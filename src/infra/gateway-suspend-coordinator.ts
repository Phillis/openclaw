import { randomUUID } from "node:crypto";
import { join } from "node:path";
import type {
  GatewaySuspendPrepareResult as GatewaySuspendPrepareWireResult,
  GatewaySuspendResumeResult as GatewaySuspendResumeWireResult,
  GatewaySuspendStatusResult as GatewaySuspendStatusWireResult,
} from "../../packages/gateway-protocol/src/index.js";
import { resolveStateDir } from "../config/paths.js";
import { tryBeginGatewaySuspendAdmission } from "../process/gateway-work-admission.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";
import {
  createGatewayActiveWorkSnapshot,
  type GatewayActiveWorkInspectors,
  type GatewayActiveWorkSnapshot,
} from "./gateway-active-work.js";
import {
  clearDurableHandoff,
  GATEWAY_SUSPEND_HANDOFF_SCHEMA,
  normalizeDurableHandoffAtStartup,
  persistDurableHandoff,
  proveDurableHandoffBytes,
  readDurableHandoff,
} from "./gateway-suspend-handoff.js";
import {
  attemptGatewaySuspendResume,
  isGatewaySuspendCleanupState,
  persistGatewaySuspendResumeState,
  type GatewaySuspendResumeLease,
} from "./gateway-suspend-resume.js";

const GATEWAY_SUSPEND_TTL_MS = 2 * 60_000;
const GATEWAY_SUSPEND_RETRY_AFTER_MS = 20_000;
const GATEWAY_SCHEDULER_RECOVERY_RETRY_MS = 1_000;
const GATEWAY_SUSPEND_HANDOFF_FILENAME = "gateway-suspend-handoff.json";

type GatewaySchedulerRecoveryResult = {
  status: "recovering";
  reason: "scheduler-resume-failed";
  retryAfterMs: number;
};

type GatewaySuspendPrepareResult =
  | GatewaySuspendPrepareWireResult
  | { status: "conflict"; expiresAtMs: number }
  | { status: "process-mismatch" }
  | GatewaySchedulerRecoveryResult;

type GatewaySuspendStatusResult =
  | GatewaySuspendStatusWireResult
  | { status: "conflict"; expiresAtMs: number }
  | { status: "process-mismatch" }
  | GatewaySchedulerRecoveryResult;

type GatewaySuspendResumeResult =
  | GatewaySuspendResumeWireResult
  | { ok: false; reason: "suspension-mismatch" }
  | { ok: false; reason: "process-mismatch" | "resume-authority-expired" }
  | { ok: false; reason: "scheduler-resume-failed"; retryAfterMs: number };

type GatewaySuspendCoordinatorEntryBase = {
  owner: object;
  resumeScheduling: () => void;
  reopenAdmission: () => boolean;
  warn?: (message: string) => void;
  timer?: ReturnType<typeof setTimeout>;
  durableHandoffPath?: string;
};

type HeldGatewaySuspension = GatewaySuspendCoordinatorEntryBase &
  GatewaySuspendResumeLease & {
    kind: "held";
    snapshot: GatewayActiveWorkSnapshot;
    nowMs: () => number;
    adoptedAtStartup?: boolean;
  };

type GatewaySchedulerRecovery = GatewaySuspendCoordinatorEntryBase & {
  kind: "recovering";
};

type GatewaySuspendCoordinatorEntry = HeldGatewaySuspension | GatewaySchedulerRecovery;

type GatewaySuspendCoordinatorState = {
  current: GatewaySuspendCoordinatorEntry | null;
  retiredForLifecycleReset?: GatewaySuspendCoordinatorEntry | null;
};

const COORDINATOR_STATE = resolveGlobalSingleton(
  Symbol.for("openclaw.gatewaySuspendCoordinatorState"),
  (): GatewaySuspendCoordinatorState => ({
    current: null,
    retiredForLifecycleReset: null,
  }),
);
const GATEWAY_INSTANCE_ID: string = resolveGlobalSingleton(
  Symbol.for("openclaw.gatewayProcessIncarnationId"),
  () => randomUUID(),
);

export function getGatewayProcessIncarnationId(): string {
  return GATEWAY_INSTANCE_ID;
}

function schedulerRecoveryResult(): GatewaySchedulerRecoveryResult {
  return {
    status: "recovering",
    reason: "scheduler-resume-failed",
    retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  };
}

function resumeSchedulerRecoveryResult(): GatewaySuspendResumeResult {
  return {
    ok: false,
    reason: "scheduler-resume-failed",
    retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  };
}

function clearEntryTimer(entry: GatewaySuspendCoordinatorEntry): void {
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = undefined;
  }
}

export function resolveGatewaySuspendHandoffPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(resolveStateDir(env), GATEWAY_SUSPEND_HANDOFF_FILENAME);
}

function scheduleEntry(
  entry: GatewaySuspendCoordinatorEntry,
  delayMs: number,
  callback: () => void,
): void {
  clearEntryTimer(entry);
  entry.timer = setTimeout(callback, delayMs);
  entry.timer.unref?.();
}

function resumeAndReopen(entry: GatewaySuspendCoordinatorEntry): boolean {
  try {
    entry.resumeScheduling();
  } catch (err) {
    entry.warn?.(`gateway scheduler recovery failed: ${String(err)}`);
    enterSchedulerRecovery(entry);
    return false;
  }
  if (COORDINATOR_STATE.current !== entry) {
    return true;
  }
  if (entry.durableHandoffPath) {
    try {
      clearDurableHandoff(entry.durableHandoffPath);
    } catch (err) {
      entry.warn?.(`gateway suspension handoff cleanup failed: ${String(err)}`);
      enterSchedulerRecovery(entry);
      return false;
    }
  }
  if (!entry.reopenAdmission()) {
    entry.warn?.("gateway scheduler recovery could not reopen admission");
    enterSchedulerRecovery(entry);
    return false;
  }
  clearEntryTimer(entry);
  COORDINATOR_STATE.current = null;
  return true;
}

function resumeAndReopenBefore(
  held: HeldGatewaySuspension,
  nowMs: () => number,
): "resumed" | "failed" | "authority-expired" {
  return attemptGatewaySuspendResume({
    lease: held,
    nowMs,
    isCurrent: () => COORDINATOR_STATE.current === held,
    clearCurrent: () => {
      COORDINATOR_STATE.current = null;
    },
    clearTimer: () => clearEntryTimer(held),
    scheduleRetry: (callback) => scheduleEntry(held, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, callback),
  });
}

function enterSchedulerRecovery(entry: GatewaySuspendCoordinatorEntry): void {
  if (COORDINATOR_STATE.current !== entry) {
    return;
  }
  if (entry.kind === "recovering") {
    scheduleRecoveryRetry(entry);
    return;
  }
  clearEntryTimer(entry);
  const recovery: GatewaySchedulerRecovery = {
    kind: "recovering",
    owner: entry.owner,
    resumeScheduling: entry.resumeScheduling,
    reopenAdmission: entry.reopenAdmission,
    warn: entry.warn,
    durableHandoffPath: entry.durableHandoffPath,
  };
  COORDINATOR_STATE.current = recovery;
  scheduleRecoveryRetry(recovery);
}

function scheduleRecoveryRetry(entry: GatewaySuspendCoordinatorEntry): void {
  scheduleEntry(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, () => {
    if (COORDINATOR_STATE.current === entry) {
      resumeAndReopen(entry);
    }
  });
}

function normalizeExpiredHeldSuspension(
  held: HeldGatewaySuspension,
): GatewaySuspendCoordinatorEntry | null {
  if (held.resumeState !== "held") {
    return held;
  }
  if (held.nowMs() < held.expiresAtMs) {
    return held;
  }
  resumeAndReopen(held);
  return COORDINATOR_STATE.current;
}

function armSchedulerRecovery(
  recovery: Omit<GatewaySchedulerRecovery, "kind">,
): GatewaySchedulerRecovery {
  const entry: GatewaySchedulerRecovery = { kind: "recovering", ...recovery };
  scheduleRecoveryRetry(entry);
  return entry;
}

function resumeSchedulingBeforeReopen(params: {
  owner: object;
  resumeScheduling: () => void;
  reopenAdmission: () => boolean;
  isInvalidated: () => boolean;
  warn?: (message: string) => void;
}): boolean {
  if (params.isInvalidated()) {
    return true;
  }
  try {
    params.resumeScheduling();
  } catch (err) {
    params.warn?.(`gateway scheduler resume failed during suspension rollback: ${String(err)}`);
    COORDINATOR_STATE.current = armSchedulerRecovery({
      owner: params.owner,
      resumeScheduling: params.resumeScheduling,
      reopenAdmission: params.reopenAdmission,
      warn: params.warn,
    });
    return false;
  }
  if (!params.isInvalidated()) {
    params.reopenAdmission();
  }
  return true;
}

function armExpiry(held: Omit<HeldGatewaySuspension, "kind">): HeldGatewaySuspension {
  const entry: HeldGatewaySuspension = { kind: "held", ...held };
  if (entry.resumeState === "held") {
    scheduleEntry(entry, Math.max(0, entry.expiresAtMs - entry.nowMs()), () => {
      if (COORDINATOR_STATE.current === entry) {
        resumeAndReopen(entry);
      }
    });
  }
  return entry;
}

function renewHeldSuspension(
  held: HeldGatewaySuspension,
  nowMs: number,
  identity: {
    gatewayInstanceId: string;
    gatewayPid: number;
    launchdRunCount: number;
  } = held,
): void {
  const expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
  if (held.durableHandoffPath) {
    persistDurableHandoff(held.durableHandoffPath, {
      schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA,
      requestId: held.requestId,
      suspensionId: held.suspensionId,
      gatewayInstanceId: identity.gatewayInstanceId,
      gatewayPid: identity.gatewayPid,
      launchdRunCount: identity.launchdRunCount,
      expiresAtMs,
      resumeState: "held",
      resumeBeforeMs: null,
    });
  }
  held.expiresAtMs = expiresAtMs;
  held.gatewayInstanceId = identity.gatewayInstanceId;
  held.gatewayPid = identity.gatewayPid;
  held.launchdRunCount = identity.launchdRunCount;
  held.resumeState = "held";
  held.resumeBeforeMs = null;
  scheduleEntry(held, GATEWAY_SUSPEND_TTL_MS, () => {
    if (COORDINATOR_STATE.current === held) {
      resumeAndReopen(held);
    }
  });
}

/** Acquire, inspect, and either roll back immediately or hold an idle fence. */
export function prepareGatewaySuspend(params: {
  requestId: string;
  suspensionId?: string;
  gatewayInstanceId?: string;
  gatewayPid: number;
  launchdRunCount: number;
  currentGatewayInstanceId?: string;
  currentGatewayPid?: number;
  pauseScheduling: () => void;
  resumeScheduling: () => void;
  inspect?: Partial<GatewayActiveWorkInspectors>;
  nowMs?: () => number;
  createSuspensionId?: () => string;
  warn?: (message: string) => void;
  durableHandoffPath?: string;
}): GatewaySuspendPrepareResult {
  const currentGatewayInstanceId = params.currentGatewayInstanceId ?? GATEWAY_INSTANCE_ID;
  const currentGatewayPid = params.currentGatewayPid ?? process.pid;
  if (
    params.gatewayPid !== currentGatewayPid ||
    (params.gatewayInstanceId !== undefined &&
      params.gatewayInstanceId !== currentGatewayInstanceId)
  ) {
    return { status: "process-mismatch" };
  }
  const nowMs = (params.nowMs ?? Date.now)();
  const current = COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (current?.kind === "held" && isGatewaySuspendCleanupState(current.resumeState)) {
    return schedulerRecoveryResult();
  }
  const existing = current ? normalizeExpiredHeldSuspension(current) : null;
  if (existing?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (existing) {
    if (
      existing.gatewayInstanceId !== currentGatewayInstanceId ||
      (!existing.adoptedAtStartup &&
        (existing.gatewayPid !== params.gatewayPid ||
          existing.launchdRunCount !== params.launchdRunCount))
    ) {
      return { status: "process-mismatch" };
    }
    if (existing.requestId !== params.requestId) {
      return { status: "conflict", expiresAtMs: existing.expiresAtMs };
    }
    if (
      (existing.adoptedAtStartup || existing.resumeState !== "held") &&
      params.suspensionId !== existing.suspensionId
    ) {
      return { status: "conflict", expiresAtMs: existing.expiresAtMs };
    }
    if (existing.adoptedAtStartup || existing.resumeState !== "held") {
      existing.resumeScheduling = params.resumeScheduling;
      existing.warn = params.warn;
      params.pauseScheduling();
      const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
      if (!snapshot.idle) {
        return {
          status: "busy",
          reason: "active-work",
          retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
          activeCount: snapshot.counts.totalActive,
          blockers: snapshot.blockers,
        };
      }
      existing.snapshot = snapshot;
    }
    existing.nowMs = params.nowMs ?? Date.now;
    renewHeldSuspension(existing, nowMs, {
      gatewayInstanceId: currentGatewayInstanceId,
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
    });
    existing.adoptedAtStartup = false;
    return {
      status: "ready",
      suspensionId: existing.suspensionId,
      gatewayInstanceId: existing.gatewayInstanceId,
      gatewayPid: existing.gatewayPid,
      launchdRunCount: existing.launchdRunCount,
      expiresAtMs: existing.expiresAtMs,
      activeCount: existing.snapshot.counts.totalActive,
      blockers: existing.snapshot.blockers,
    };
  }

  const owner = {};
  let suspensionInvalidated = false;
  const admission = tryBeginGatewaySuspendAdmission(() => {
    suspensionInvalidated = true;
    const activeEntry = COORDINATOR_STATE.current;
    if (activeEntry?.owner !== owner) {
      return;
    }
    clearEntryTimer(activeEntry);
    COORDINATOR_STATE.current = null;
    COORDINATOR_STATE.retiredForLifecycleReset = activeEntry;
  });
  if (!admission) {
    const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
    return {
      status: "busy",
      reason: "gateway-draining",
      retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
      activeCount: snapshot.counts.totalActive,
      blockers: snapshot.blockers,
    };
  }

  let schedulingPaused = false;
  let admissionCommitted = false;
  let durableHandoffPersistenceStarted = false;
  try {
    params.pauseScheduling();
    schedulingPaused = true;
    const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
    if (!snapshot.idle) {
      const resumed = resumeSchedulingBeforeReopen({
        owner,
        resumeScheduling: params.resumeScheduling,
        reopenAdmission: admission.rollback,
        isInvalidated: () => suspensionInvalidated,
        warn: params.warn,
      });
      schedulingPaused = false;
      if (!resumed) {
        return schedulerRecoveryResult();
      }
      return {
        status: "busy",
        reason: "active-work",
        retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
        activeCount: snapshot.counts.totalActive,
        blockers: snapshot.blockers,
      };
    }
    if (!admission.commit()) {
      throw new Error("gateway suspension admission changed during preparation");
    }
    admissionCommitted = true;
    const suspensionId = (params.createSuspensionId ?? randomUUID)();
    const expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
    const held = armExpiry({
      owner,
      requestId: params.requestId,
      suspensionId,
      gatewayInstanceId: currentGatewayInstanceId,
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
      expiresAtMs,
      snapshot,
      reopenAdmission: admission.release,
      resumeScheduling: params.resumeScheduling,
      nowMs: params.nowMs ?? Date.now,
      resumeState: "held",
      resumeBeforeMs: null,
      warn: params.warn,
      durableHandoffPath: params.durableHandoffPath,
    });
    if (held.durableHandoffPath) {
      durableHandoffPersistenceStarted = true;
      persistDurableHandoff(held.durableHandoffPath, {
        schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA,
        requestId: params.requestId,
        suspensionId,
        gatewayInstanceId: currentGatewayInstanceId,
        gatewayPid: params.gatewayPid,
        launchdRunCount: params.launchdRunCount,
        expiresAtMs,
        resumeState: "held",
        resumeBeforeMs: null,
      });
      durableHandoffPersistenceStarted = false;
    }
    COORDINATOR_STATE.current = held;
    return {
      status: "ready",
      suspensionId,
      gatewayInstanceId: currentGatewayInstanceId,
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
      expiresAtMs,
      activeCount: snapshot.counts.totalActive,
      blockers: snapshot.blockers,
    };
  } catch (err) {
    if (durableHandoffPersistenceStarted) {
      COORDINATOR_STATE.current = armSchedulerRecovery({
        owner,
        resumeScheduling: params.resumeScheduling,
        reopenAdmission: admission.release,
        warn: params.warn,
        durableHandoffPath: params.durableHandoffPath,
      });
      return schedulerRecoveryResult();
    }
    if (schedulingPaused) {
      const resumed = resumeSchedulingBeforeReopen({
        owner,
        resumeScheduling: params.resumeScheduling,
        reopenAdmission: admissionCommitted ? admission.release : admission.rollback,
        isInvalidated: () => suspensionInvalidated,
        warn: params.warn,
      });
      if (!resumed) {
        return schedulerRecoveryResult();
      }
    } else if (admissionCommitted) {
      admission.release();
    } else {
      admission.rollback();
    }
    throw err;
  }
}

/**
 * Reestablishes a predecessor's durable fence before successor startup can
 * create any request, cron, or task root.
 */
export function adoptGatewaySuspendHandoffAtStartup(
  params: {
    durableHandoffPath?: string;
    nowMs?: () => number;
    warn?: (message: string) => void;
    currentGatewayInstanceId?: string;
    currentGatewayPid?: number;
  } = {},
): boolean {
  const path = params.durableHandoffPath ?? resolveGatewaySuspendHandoffPath();
  const nowMs = params.nowMs ?? Date.now;
  const currentGatewayInstanceId = params.currentGatewayInstanceId ?? GATEWAY_INSTANCE_ID;
  const currentGatewayPid = params.currentGatewayPid ?? process.pid;
  const persisted = readDurableHandoff(path);
  if (!persisted) {
    return false;
  }
  proveDurableHandoffBytes(path, persisted.bytes);
  const durable = readDurableHandoff(path);
  if (!durable || !durable.bytes.equals(persisted.bytes)) {
    throw new Error("gateway suspension handoff changed during startup adoption");
  }
  const handoff = normalizeDurableHandoffAtStartup(path, durable.handoff, nowMs());
  if (!handoff) {
    return false;
  }
  if (COORDINATOR_STATE.current) {
    return true;
  }
  const admission = tryBeginGatewaySuspendAdmission(() => {
    const current = COORDINATOR_STATE.current;
    if (current) {
      clearEntryTimer(current);
      COORDINATOR_STATE.current = null;
    }
  });
  if (!admission || !admission.commit()) {
    throw new Error("gateway suspension handoff could not close successor admission");
  }
  COORDINATOR_STATE.current = armExpiry({
    owner: {},
    requestId: handoff.requestId,
    suspensionId: handoff.suspensionId,
    gatewayInstanceId: currentGatewayInstanceId,
    gatewayPid: currentGatewayPid,
    launchdRunCount: handoff.launchdRunCount,
    expiresAtMs: handoff.expiresAtMs,
    snapshot: createGatewayActiveWorkSnapshot(),
    reopenAdmission: admission.release,
    resumeScheduling: () => {},
    nowMs,
    resumeState: handoff.resumeState,
    resumeBeforeMs: handoff.resumeBeforeMs,
    warn: params.warn,
    durableHandoffPath: path,
    adoptedAtStartup: true,
  });
  return true;
}

export function getGatewaySuspendStatus(
  params: { suspensionId: string; gatewayInstanceId: string },
  currentGatewayInstanceId = GATEWAY_INSTANCE_ID,
): GatewaySuspendStatusResult {
  if (params.gatewayInstanceId !== currentGatewayInstanceId) {
    return { status: "process-mismatch" };
  }
  const current = COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  const held = current ? normalizeExpiredHeldSuspension(current) : null;
  if (held?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (held && isGatewaySuspendCleanupState(held.resumeState)) {
    return schedulerRecoveryResult();
  }
  if (!held) {
    return { status: "running", gatewayInstanceId: currentGatewayInstanceId };
  }
  if (held.gatewayInstanceId !== currentGatewayInstanceId) {
    return { status: "process-mismatch" };
  }
  if (held.suspensionId !== params.suspensionId) {
    return { status: "conflict", expiresAtMs: held.expiresAtMs };
  }
  return {
    status: "ready",
    gatewayInstanceId: currentGatewayInstanceId,
    expiresAtMs: held.expiresAtMs,
  };
}

export function resumeGatewaySuspend(
  params: { suspensionId: string; gatewayInstanceId: string; resumeBeforeMs: number },
  currentGatewayInstanceId = GATEWAY_INSTANCE_ID,
  nowMs: () => number = Date.now,
): GatewaySuspendResumeResult {
  if (params.gatewayInstanceId !== currentGatewayInstanceId) {
    return { ok: false, reason: "process-mismatch" };
  }
  const current = COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return resumeSchedulerRecoveryResult();
  }
  const held = current ? normalizeExpiredHeldSuspension(current) : null;
  if (held?.kind === "recovering") {
    return resumeSchedulerRecoveryResult();
  }
  if (held && isGatewaySuspendCleanupState(held.resumeState)) {
    return resumeSchedulerRecoveryResult();
  }
  if (!held) {
    return {
      ok: true,
      status: "running",
      resumed: false,
      gatewayInstanceId: currentGatewayInstanceId,
    };
  }
  if (held.gatewayInstanceId !== currentGatewayInstanceId) {
    return { ok: false, reason: "process-mismatch" };
  }
  if (held.suspensionId !== params.suspensionId) {
    return { ok: false, reason: "suspension-mismatch" };
  }
  if (held.adoptedAtStartup) {
    return { ok: false, reason: "suspension-mismatch" };
  }
  if (held.resumeState === "resume-expired") {
    return { ok: false, reason: "resume-authority-expired" };
  }
  if (nowMs() >= params.resumeBeforeMs) {
    if (held.resumeState === "resume-pending" && held.resumeBeforeMs === params.resumeBeforeMs) {
      held.nowMs = nowMs;
      resumeAndReopenBefore(held, nowMs);
    }
    return { ok: false, reason: "resume-authority-expired" };
  }
  if (params.resumeBeforeMs > held.expiresAtMs) {
    return { ok: false, reason: "resume-authority-expired" };
  }
  if (held.resumeState === "held") {
    try {
      persistGatewaySuspendResumeState(held, "resume-pending", params.resumeBeforeMs);
    } catch (err) {
      held.warn?.(`gateway resume authority persistence failed: ${String(err)}`);
      return resumeSchedulerRecoveryResult();
    }
  } else if (held.resumeBeforeMs !== params.resumeBeforeMs) {
    return { ok: false, reason: "suspension-mismatch" };
  }
  held.nowMs = nowMs;
  const resumeResult = resumeAndReopenBefore(held, nowMs);
  if (resumeResult === "authority-expired") {
    return { ok: false, reason: "resume-authority-expired" };
  }
  if (resumeResult === "failed") {
    return resumeSchedulerRecoveryResult();
  }
  return {
    ok: true,
    status: "running",
    resumed: true,
    gatewayInstanceId: currentGatewayInstanceId,
  };
}

function resetGatewaySuspendCoordinator(): void {
  const current = COORDINATOR_STATE.current;
  const retired = COORDINATOR_STATE.retiredForLifecycleReset;
  COORDINATOR_STATE.current = null;
  COORDINATOR_STATE.retiredForLifecycleReset = null;
  const entries = current && current !== retired ? [current, retired] : [current ?? retired];
  for (const entry of entries) {
    if (!entry) {
      continue;
    }
    clearEntryTimer(entry);
    if (entry.kind === "held" && isGatewaySuspendCleanupState(entry.resumeState)) {
      continue;
    }
    try {
      entry.resumeScheduling();
    } catch (err) {
      entry.warn?.(`gateway scheduler resume failed during lifecycle reset: ${String(err)}`);
    }
    entry.reopenAdmission();
  }
}

export function resetGatewaySuspendCoordinatorForLifecycleRestart(): void {
  resetGatewaySuspendCoordinator();
}
