import { join } from "node:path";
import type { GatewaySuspendReleaseCommittedReceipt } from "../../packages/gateway-protocol/src/index.js";
import { resolveStateDir } from "../config/paths.js";
import { resolveGlobalSingleton } from "../shared/global-singleton.js";
import {
  GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  GATEWAY_SUSPEND_MODE_DURABLE,
  GATEWAY_SUSPEND_MODE_LEGACY,
  type GatewaySchedulerRecovery,
  type GatewaySuspendCoordinatorEntry,
  type GatewaySuspendCoordinatorState,
  type HeldGatewaySuspension,
} from "./gateway-suspend-coordinator-contract.js";
import {
  clearDurableHandoff,
  createGatewaySuspendHandoff,
  GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE,
  replaceDurableHandoff,
  type GatewaySuspendHandoff,
} from "./gateway-suspend-handoff.js";
import { GATEWAY_SUSPEND_RELEASE_SCHEMA } from "./gateway-suspend-release.js";
import {
  attemptGatewaySuspendResume,
  isGatewaySuspendCleanupState,
} from "./gateway-suspend-resume.js";

export const GATEWAY_SUSPEND_TTL_MS = 2 * 60_000;
export const GATEWAY_SUSPEND_RETRY_AFTER_MS = 20_000;
const GATEWAY_SUSPEND_HANDOFF_FILENAME = "gateway-suspend-handoff.json";

export const GATEWAY_SUSPEND_COORDINATOR_STATE = resolveGlobalSingleton(
  Symbol.for("openclaw.gatewaySuspendCoordinatorState"),
  (): GatewaySuspendCoordinatorState => ({
    current: null,
    retiredForLifecycleReset: null,
  }),
);

export function clearGatewaySuspendEntryTimer(entry: GatewaySuspendCoordinatorEntry): void {
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = undefined;
  }
}

export function resolveGatewaySuspendHandoffPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(resolveStateDir(env), GATEWAY_SUSPEND_HANDOFF_FILENAME);
}

export function committedReleaseReceiptForHandoff(
  handoff: GatewaySuspendHandoff,
): GatewaySuspendReleaseCommittedReceipt {
  if (
    handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE ||
    handoff.suspendMode !== GATEWAY_SUSPEND_MODE_DURABLE ||
    handoff.resumeState !== "release-pending" ||
    handoff.resumeBeforeMs === null ||
    handoff.releaseRequestId === undefined ||
    handoff.releaseAuthoritySha256 === undefined ||
    handoff.releaseCommittedAtMs === undefined
  ) {
    throw new Error("gateway suspension handoff lacks a committed release binding");
  }
  return {
    schema: GATEWAY_SUSPEND_RELEASE_SCHEMA,
    status: "release_committed",
    releaseRequestId: handoff.releaseRequestId,
    releaseAuthoritySha256: handoff.releaseAuthoritySha256,
    suspendRequestId: handoff.requestId,
    suspensionId: handoff.suspensionId,
    gatewayInstanceId: handoff.gatewayInstanceId,
    gatewayPid: handoff.gatewayPid,
    launchdRunCount: handoff.launchdRunCount,
    suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
    resumeBeforeMs: handoff.resumeBeforeMs,
    committedAtMs: handoff.releaseCommittedAtMs,
    requiredAdmissionReopened: true,
    requiredSchedulerReopened: true,
    nonReusable: true,
  };
}

function scheduleEntry(
  entry: GatewaySuspendCoordinatorEntry,
  delayMs: number,
  callback: () => void,
): void {
  clearGatewaySuspendEntryTimer(entry);
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
  if (GATEWAY_SUSPEND_COORDINATOR_STATE.current !== entry) {
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
  clearGatewaySuspendEntryTimer(entry);
  GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
  return true;
}

export function resumeAndReopenBefore(
  held: HeldGatewaySuspension,
  nowMs: () => number,
): "resumed" | "failed" | "authority-expired" {
  return attemptGatewaySuspendResume({
    lease: held,
    nowMs,
    isCurrent: () => GATEWAY_SUSPEND_COORDINATOR_STATE.current === held,
    clearCurrent: () => {
      GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
    },
    clearTimer: () => clearGatewaySuspendEntryTimer(held),
    scheduleRetry: (callback) => scheduleEntry(held, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, callback),
  });
}

function enterSchedulerRecovery(entry: GatewaySuspendCoordinatorEntry): void {
  if (GATEWAY_SUSPEND_COORDINATOR_STATE.current !== entry) {
    return;
  }
  if (entry.kind === "recovering") {
    scheduleRecoveryRetry(entry);
    return;
  }
  clearGatewaySuspendEntryTimer(entry);
  const recovery: GatewaySchedulerRecovery = {
    kind: "recovering",
    owner: entry.owner,
    resumeScheduling: entry.resumeScheduling,
    reopenAdmission: entry.reopenAdmission,
    warn: entry.warn,
    durableHandoffPath: entry.durableHandoffPath,
  };
  GATEWAY_SUSPEND_COORDINATOR_STATE.current = recovery;
  scheduleRecoveryRetry(recovery);
}

function scheduleRecoveryRetry(entry: GatewaySuspendCoordinatorEntry): void {
  scheduleEntry(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, () => {
    if (GATEWAY_SUSPEND_COORDINATOR_STATE.current === entry) {
      resumeAndReopen(entry);
    }
  });
}

export function normalizeHeldSuspension(
  held: HeldGatewaySuspension,
): GatewaySuspendCoordinatorEntry | null {
  if (held.resumeState === "held" && held.nowMs() >= held.expiresAtMs) {
    if (held.suspendMode === GATEWAY_SUSPEND_MODE_LEGACY) {
      resumeAndReopen(held);
      return GATEWAY_SUSPEND_COORDINATOR_STATE.current;
    }
    // Durable-hold expiry ends renewal authority, not the fence. Only an
    // exact successor rebind followed by explicit resume may reopen admission.
    clearGatewaySuspendEntryTimer(held);
  }
  return held;
}

export function armSchedulerRecovery(
  recovery: Omit<GatewaySchedulerRecovery, "kind">,
): GatewaySchedulerRecovery {
  const entry: GatewaySchedulerRecovery = { kind: "recovering", ...recovery };
  scheduleRecoveryRetry(entry);
  return entry;
}

export function resumeSchedulingBeforeReopen(params: {
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
    GATEWAY_SUSPEND_COORDINATOR_STATE.current = armSchedulerRecovery({
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

export function createHeldSuspension(
  held: Omit<HeldGatewaySuspension, "kind">,
): HeldGatewaySuspension {
  const entry: HeldGatewaySuspension = { kind: "held", ...held };
  if (entry.suspendMode === GATEWAY_SUSPEND_MODE_LEGACY && entry.resumeState === "held") {
    scheduleEntry(entry, Math.max(0, entry.expiresAtMs - entry.nowMs()), () => {
      if (GATEWAY_SUSPEND_COORDINATOR_STATE.current === entry) {
        resumeAndReopen(entry);
      }
    });
  }
  return entry;
}

export function renewHeldSuspension(
  held: HeldGatewaySuspension,
  nowMs: number,
  identity: {
    gatewayInstanceId: string;
    gatewayPid: number;
    launchdRunCount: number;
  } = held,
): void {
  const expiresAtMs = Math.max(nowMs + GATEWAY_SUSPEND_TTL_MS, held.expiresAtMs + 1);
  const replacement = createGatewaySuspendHandoff({
    suspendMode: held.suspendMode,
    requestId: held.requestId,
    suspensionId: held.suspensionId,
    gatewayInstanceId: identity.gatewayInstanceId,
    gatewayPid: identity.gatewayPid,
    launchdRunCount: identity.launchdRunCount,
    expiresAtMs,
    resumeState: "held",
    resumeBeforeMs: null,
  });
  if (held.durableHandoffPath) {
    if (!held.durableHandoff) {
      throw new Error("gateway suspension lease lacks its active durable fence");
    }
    replaceDurableHandoff(held.durableHandoffPath, held.durableHandoff, replacement);
    held.durableHandoff = replacement;
  }
  held.expiresAtMs = expiresAtMs;
  held.gatewayInstanceId = identity.gatewayInstanceId;
  held.gatewayPid = identity.gatewayPid;
  held.launchdRunCount = identity.launchdRunCount;
  held.resumeState = "held";
  held.resumeBeforeMs = null;
  held.releaseRequestId = undefined;
  held.releaseAuthoritySha256 = undefined;
  held.releaseCommittedAtMs = undefined;
  if (held.suspendMode === GATEWAY_SUSPEND_MODE_LEGACY) {
    scheduleEntry(held, GATEWAY_SUSPEND_TTL_MS, () => {
      if (GATEWAY_SUSPEND_COORDINATOR_STATE.current === held) {
        resumeAndReopen(held);
      }
    });
  }
}

export function resetGatewaySuspendCoordinatorForLifecycleRestart(): void {
  const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
  const retired = GATEWAY_SUSPEND_COORDINATOR_STATE.retiredForLifecycleReset;
  GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
  GATEWAY_SUSPEND_COORDINATOR_STATE.retiredForLifecycleReset = null;
  const entries = current && current !== retired ? [current, retired] : [current ?? retired];
  for (const entry of entries) {
    if (!entry) {
      continue;
    }
    clearGatewaySuspendEntryTimer(entry);
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
