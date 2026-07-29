import { randomUUID } from "node:crypto";
import { getGatewayProcessInstanceId } from "../gateway/process-instance.js";
import { tryBeginGatewaySuspendAdmission } from "../process/gateway-work-admission.js";
import {
  createGatewayActiveWorkSnapshot,
  type GatewayActiveWorkInspectors,
} from "./gateway-active-work.js";
import {
  type GatewaySuspendMode,
  type GatewaySuspendPrepareResult,
  resolveGatewaySuspendMode,
  schedulerRecoveryResult,
} from "./gateway-suspend-coordinator-contract.js";
import {
  armSchedulerRecovery,
  clearGatewaySuspendEntryTimer,
  committedReleaseReceiptForHandoff,
  createHeldSuspension,
  GATEWAY_SUSPEND_COORDINATOR_STATE,
  GATEWAY_SUSPEND_RETRY_AFTER_MS,
  GATEWAY_SUSPEND_TTL_MS,
  normalizeHeldSuspension,
  renewHeldSuspension,
  resolveGatewaySuspendHandoffPath,
  resumeSchedulingBeforeReopen,
} from "./gateway-suspend-coordinator-state.js";
import {
  clearExactDurableHandoff,
  createGatewaySuspendHandoff,
  gatewaySuspendModeForHandoff,
  normalizeDurableHandoffAtStartup,
  persistDurableHandoff,
  proveDurableHandoffBytes,
  readDurableHandoff,
  recoverDurableHandoffCompareAndSwap,
} from "./gateway-suspend-handoff.js";
import {
  commitGatewaySuspendRelease,
  recoverGatewaySuspendReleaseCompareAndSwap,
  resolveGatewaySuspendReleasePath,
} from "./gateway-suspend-release.js";
import { isGatewaySuspendCleanupState } from "./gateway-suspend-resume.js";

export {
  getGatewaySuspendStatus,
  resumeGatewaySuspend,
} from "./gateway-suspend-coordinator-release.js";
export {
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resolveGatewaySuspendHandoffPath,
} from "./gateway-suspend-coordinator-state.js";

/** Acquire, inspect, and either roll back immediately or hold an idle fence. */
export function prepareGatewaySuspend(params: {
  requestId: string;
  suspensionId?: string;
  gatewayInstanceId?: string;
  gatewayPid: number;
  launchdRunCount: number;
  suspendMode?: GatewaySuspendMode;
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
  const suspendMode = resolveGatewaySuspendMode(params.suspendMode);
  if (!suspendMode) {
    return { status: "mode-mismatch" };
  }
  const currentGatewayInstanceId = params.currentGatewayInstanceId ?? getGatewayProcessInstanceId();
  const currentGatewayPid = params.currentGatewayPid ?? process.pid;
  if (
    params.gatewayPid !== currentGatewayPid ||
    (params.gatewayInstanceId !== undefined &&
      params.gatewayInstanceId !== currentGatewayInstanceId)
  ) {
    return { status: "process-mismatch" };
  }
  const nowMs = (params.nowMs ?? Date.now)();
  const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (current?.kind === "held" && isGatewaySuspendCleanupState(current.resumeState)) {
    return schedulerRecoveryResult();
  }
  const existing = current ? normalizeHeldSuspension(current) : null;
  if (existing?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (existing) {
    if (existing.suspendMode !== suspendMode) {
      return { status: "mode-mismatch" };
    }
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
    if (existing.resumeState === "release-pending") {
      return { status: "conflict", expiresAtMs: existing.expiresAtMs };
    }
    const exactRenewalRequired =
      existing.adoptedAtStartup || existing.resumeState !== "held" || nowMs >= existing.expiresAtMs;
    if (exactRenewalRequired && params.suspensionId !== existing.suspensionId) {
      return { status: "conflict", expiresAtMs: existing.expiresAtMs };
    }
    if (existing.adoptedAtStartup || existing.resumeState !== "held") {
      existing.pauseScheduling = params.pauseScheduling;
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
      suspendMode: existing.suspendMode,
      activeCount: existing.snapshot.counts.totalActive,
      blockers: existing.snapshot.blockers,
    };
  }

  const owner = {};
  let suspensionInvalidated = false;
  const admission = tryBeginGatewaySuspendAdmission(() => {
    suspensionInvalidated = true;
    const activeEntry = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
    if (activeEntry?.owner !== owner) {
      return;
    }
    clearGatewaySuspendEntryTimer(activeEntry);
    GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
    GATEWAY_SUSPEND_COORDINATOR_STATE.retiredForLifecycleReset = activeEntry;
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
    const durableHandoff = params.durableHandoffPath
      ? createGatewaySuspendHandoff({
          suspendMode,
          requestId: params.requestId,
          suspensionId,
          gatewayInstanceId: currentGatewayInstanceId,
          gatewayPid: params.gatewayPid,
          launchdRunCount: params.launchdRunCount,
          expiresAtMs,
          resumeState: "held",
          resumeBeforeMs: null,
        })
      : undefined;
    const held = createHeldSuspension({
      owner,
      requestId: params.requestId,
      suspensionId,
      gatewayInstanceId: currentGatewayInstanceId,
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
      suspendMode,
      expiresAtMs,
      snapshot,
      reopenAdmission: admission.release,
      pauseScheduling: params.pauseScheduling,
      resumeScheduling: params.resumeScheduling,
      nowMs: params.nowMs ?? Date.now,
      resumeState: "held",
      resumeBeforeMs: null,
      warn: params.warn,
      durableHandoffPath: params.durableHandoffPath,
      durableHandoff,
    });
    if (held.durableHandoffPath && durableHandoff) {
      durableHandoffPersistenceStarted = true;
      persistDurableHandoff(held.durableHandoffPath, durableHandoff);
      durableHandoffPersistenceStarted = false;
    }
    GATEWAY_SUSPEND_COORDINATOR_STATE.current = held;
    return {
      status: "ready",
      suspensionId,
      gatewayInstanceId: currentGatewayInstanceId,
      gatewayPid: params.gatewayPid,
      launchdRunCount: params.launchdRunCount,
      expiresAtMs,
      suspendMode,
      activeCount: snapshot.counts.totalActive,
      blockers: snapshot.blockers,
    };
  } catch (err) {
    if (durableHandoffPersistenceStarted) {
      GATEWAY_SUSPEND_COORDINATOR_STATE.current = armSchedulerRecovery({
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
    beforeCompletedReleaseCleanup?: () => void;
  } = {},
): boolean {
  const path = params.durableHandoffPath ?? resolveGatewaySuspendHandoffPath();
  const nowMs = params.nowMs ?? Date.now;
  const currentGatewayInstanceId = params.currentGatewayInstanceId ?? getGatewayProcessInstanceId();
  const currentGatewayPid = params.currentGatewayPid ?? process.pid;
  recoverDurableHandoffCompareAndSwap(path);
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
  if (handoff.resumeState === "release-pending") {
    const committed = committedReleaseReceiptForHandoff(handoff);
    const releasePath = resolveGatewaySuspendReleasePath(
      path,
      committed.releaseRequestId,
      committed.releaseAuthoritySha256,
    );
    recoverGatewaySuspendReleaseCompareAndSwap(releasePath);
    const releaseReceipt = commitGatewaySuspendRelease({
      handoffPath: path,
      expectedHandoff: handoff,
      receipt: committed,
    });
    if (releaseReceipt.status === "release_completed") {
      params.beforeCompletedReleaseCleanup?.();
      clearExactDurableHandoff(path, handoff);
      if (readDurableHandoff(path) !== null) {
        throw new Error("gateway completed release handoff remained after startup cleanup");
      }
      return false;
    }
  }
  if (GATEWAY_SUSPEND_COORDINATOR_STATE.current) {
    return true;
  }
  const admission = tryBeginGatewaySuspendAdmission(() => {
    const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
    if (current) {
      clearGatewaySuspendEntryTimer(current);
      GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
    }
  });
  if (!admission || !admission.commit()) {
    throw new Error("gateway suspension handoff could not close successor admission");
  }
  GATEWAY_SUSPEND_COORDINATOR_STATE.current = createHeldSuspension({
    owner: {},
    requestId: handoff.requestId,
    suspensionId: handoff.suspensionId,
    gatewayInstanceId: currentGatewayInstanceId,
    gatewayPid: currentGatewayPid,
    launchdRunCount: handoff.launchdRunCount,
    suspendMode: gatewaySuspendModeForHandoff(handoff),
    expiresAtMs: handoff.expiresAtMs,
    snapshot: createGatewayActiveWorkSnapshot(),
    reopenAdmission: admission.release,
    pauseScheduling: () => {},
    resumeScheduling: () => {},
    nowMs,
    resumeState: handoff.resumeState,
    resumeBeforeMs: handoff.resumeBeforeMs,
    releaseRequestId: handoff.releaseRequestId,
    releaseAuthoritySha256: handoff.releaseAuthoritySha256,
    releaseCommittedAtMs: handoff.releaseCommittedAtMs,
    warn: params.warn,
    durableHandoffPath: path,
    durableHandoff: handoff,
    adoptedAtStartup: true,
  });
  return true;
}
