import type {
  GatewaySuspendReleaseCommittedReceipt,
  GatewaySuspendReleaseReceipt,
} from "../../packages/gateway-protocol/src/index.js";
import { getGatewayProcessInstanceId } from "../gateway/process-instance.js";
import {
  isGatewayWorkAdmissionClosed,
  tryBeginGatewaySuspendAdmission,
} from "../process/gateway-work-admission.js";
import {
  GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  GATEWAY_SUSPEND_MODE_DURABLE,
  GATEWAY_SUSPEND_MODE_LEGACY,
  type GatewaySuspendMode,
  type GatewaySuspendResumeResult,
  type GatewaySuspendStatusResult,
  type HeldGatewaySuspension,
  resolveGatewaySuspendMode,
  resumeSchedulerRecoveryResult,
  schedulerRecoveryResult,
} from "./gateway-suspend-coordinator-contract.js";
import {
  clearGatewaySuspendEntryTimer,
  committedReleaseReceiptForHandoff,
  GATEWAY_SUSPEND_COORDINATOR_STATE,
  normalizeHeldSuspension,
  resolveGatewaySuspendHandoffPath,
  resumeAndReopenBefore,
} from "./gateway-suspend-coordinator-state.js";
import {
  beginDurableHandoffRelease,
  clearExactDurableHandoff,
  persistDurableHandoff,
  readDurableHandoff,
  type GatewaySuspendHandoff,
} from "./gateway-suspend-handoff.js";
import {
  commitGatewaySuspendRelease,
  completeGatewaySuspendRelease,
  gatewaySuspendReleaseCommittedView,
  isGatewaySuspendReleaseAuthorityPair,
  isSameGatewaySuspendReleaseCommit,
  readExactGatewaySuspendReleaseReceipt,
  readGatewaySuspendReleaseReceipt,
  resolveGatewaySuspendReleasePath,
} from "./gateway-suspend-release.js";
import {
  isGatewaySuspendCleanupState,
  persistGatewaySuspendResumeState,
} from "./gateway-suspend-resume.js";

export function getGatewaySuspendStatus(
  params:
    | {
        suspensionId: string;
        gatewayInstanceId: string;
        suspendMode?: GatewaySuspendMode;
      }
    | {
        releaseRequestId: string;
        releaseAuthoritySha256: string;
        suspendMode: typeof GATEWAY_SUSPEND_MODE_DURABLE;
      },
  currentGatewayInstanceId = getGatewayProcessInstanceId(),
  durableHandoffPath = resolveGatewaySuspendHandoffPath(),
): GatewaySuspendStatusResult {
  if ("releaseRequestId" in params) {
    if (
      params.suspendMode !== GATEWAY_SUSPEND_MODE_DURABLE ||
      !isGatewaySuspendReleaseAuthorityPair(params.releaseRequestId, params.releaseAuthoritySha256)
    ) {
      return { status: "mode-mismatch" };
    }
    const releaseReceipt = readExactGatewaySuspendReleaseReceipt({
      handoffPath: durableHandoffPath,
      releaseRequestId: params.releaseRequestId,
      releaseAuthoritySha256: params.releaseAuthoritySha256,
    });
    if (releaseReceipt?.status === "release_completed") {
      const activeHandoff = readDurableHandoff(durableHandoffPath)?.handoff;
      if (
        activeHandoff?.resumeState === "release-pending" &&
        activeHandoff.releaseRequestId === params.releaseRequestId &&
        activeHandoff.releaseAuthoritySha256 === params.releaseAuthoritySha256
      ) {
        const committed = committedReleaseReceiptForHandoff(activeHandoff);
        if (!isSameGatewaySuspendReleaseCommit(committed, releaseReceipt)) {
          throw new Error("gateway completed release receipt does not match its pending handoff");
        }
        return {
          status: "release_recovery_needed",
          retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
          releaseReceipt: committed,
        };
      }
      return releaseReceipt;
    }
    if (releaseReceipt?.status === "release_committed") {
      return {
        status: "release_recovery_needed",
        retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
        releaseReceipt,
      };
    }
    const activeHandoff = readDurableHandoff(durableHandoffPath)?.handoff;
    if (
      activeHandoff?.resumeState === "release-pending" &&
      activeHandoff.releaseRequestId === params.releaseRequestId &&
      activeHandoff.releaseAuthoritySha256 === params.releaseAuthoritySha256
    ) {
      return {
        status: "release_recovery_needed",
        retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
        releaseReceipt: committedReleaseReceiptForHandoff(activeHandoff),
      };
    }
    const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
    if (activeHandoff || current?.kind === "held") {
      return {
        status: "conflict",
        expiresAtMs:
          activeHandoff?.expiresAtMs ?? (current?.kind === "held" ? current.expiresAtMs : 0),
      };
    }
    return {
      status: "running",
      gatewayInstanceId: currentGatewayInstanceId,
      suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
    };
  }
  if (params.gatewayInstanceId !== currentGatewayInstanceId) {
    return { status: "process-mismatch" };
  }
  const suspendMode = resolveGatewaySuspendMode(params.suspendMode);
  if (!suspendMode) {
    return { status: "mode-mismatch" };
  }
  const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  const held = current ? normalizeHeldSuspension(current) : null;
  if (held?.kind === "recovering") {
    return schedulerRecoveryResult();
  }
  if (held && isGatewaySuspendCleanupState(held.resumeState)) {
    return schedulerRecoveryResult();
  }
  if (!held) {
    return { status: "running", gatewayInstanceId: currentGatewayInstanceId, suspendMode };
  }
  if (held.suspendMode !== suspendMode) {
    return { status: "mode-mismatch" };
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
    suspendMode: held.suspendMode,
  };
}

type GatewaySuspendResumeParams =
  | {
      suspensionId: string;
      gatewayInstanceId: string;
      resumeBeforeMs: number;
      suspendMode?: typeof GATEWAY_SUSPEND_MODE_LEGACY;
    }
  | {
      suspensionId: string;
      gatewayInstanceId: string;
      resumeBeforeMs: number;
      suspendMode: typeof GATEWAY_SUSPEND_MODE_DURABLE;
      releaseRequestId: string;
      releaseAuthoritySha256: string;
    };

type GatewaySuspendResumeRuntime = {
  pauseScheduling?: () => void;
  resumeScheduling?: () => void;
  durableHandoffPath?: string;
  afterReleaseCompleted?: () => void;
};

function recloseDurableReleaseAfterCompletionFailure(held: HeldGatewaySuspension): void {
  if (!isGatewayWorkAdmissionClosed()) {
    const admission = tryBeginGatewaySuspendAdmission(() => {
      if (GATEWAY_SUSPEND_COORDINATOR_STATE.current === held) {
        clearGatewaySuspendEntryTimer(held);
        GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
      }
    });
    if (!admission || !admission.commit()) {
      throw new Error(
        "gateway durable release could not reclose admission after persistence failure",
      );
    }
    held.reopenAdmission = admission.release;
    held.admissionReopened = false;
  }
  held.pauseScheduling();
}

function finishDurableRelease(params: {
  held: HeldGatewaySuspension;
  committed: GatewaySuspendReleaseCommittedReceipt;
  releasePath: string;
  nowMs: () => number;
  afterReleaseCompleted?: () => void;
}): GatewaySuspendResumeResult {
  const { held } = params;
  try {
    held.resumeScheduling();
  } catch (err) {
    held.warn?.(`gateway durable release scheduler recovery failed: ${String(err)}`);
    return resumeSchedulerRecoveryResult();
  }
  if (isGatewayWorkAdmissionClosed()) {
    if (!held.reopenAdmission()) {
      held.warn?.("gateway durable release could not reopen admission");
      return resumeSchedulerRecoveryResult();
    }
  }
  held.admissionReopened = true;

  let completed;
  try {
    completed = completeGatewaySuspendRelease({
      releasePath: params.releasePath,
      committed: params.committed,
      completedAtMs: params.nowMs(),
    });
  } catch (err) {
    const persisted = readGatewaySuspendReleaseReceipt(params.releasePath);
    if (
      persisted?.receipt.status === "release_completed" &&
      isSameGatewaySuspendReleaseCommit(persisted.receipt, params.committed)
    ) {
      completed = persisted.receipt;
    } else {
      try {
        recloseDurableReleaseAfterCompletionFailure(held);
      } catch (recloseError) {
        held.warn?.(
          `gateway durable release completion failed and admission reclose failed: ${String(
            recloseError,
          )}`,
        );
        throw recloseError;
      }
      held.warn?.(`gateway durable release completion persistence failed: ${String(err)}`);
      return resumeSchedulerRecoveryResult();
    }
  }

  try {
    params.afterReleaseCompleted?.();
    if (!held.durableHandoffPath || !held.durableHandoff) {
      throw new Error("gateway completed release lacks its durable handoff");
    }
    clearExactDurableHandoff(held.durableHandoffPath, held.durableHandoff);
    if (readDurableHandoff(held.durableHandoffPath) !== null) {
      throw new Error("gateway completed release handoff remained after durable cleanup");
    }
    if (isGatewayWorkAdmissionClosed() || !held.admissionReopened) {
      throw new Error("gateway completed release did not leave admission reopened");
    }
    // resumeScheduling returned successfully in this exact synchronous release
    // attempt; no intervening callback can pause it before the handoff absence
    // and admission-open observations above.
  } catch (err) {
    try {
      recloseDurableReleaseAfterCompletionFailure(held);
      if (
        held.durableHandoffPath &&
        held.durableHandoff &&
        readDurableHandoff(held.durableHandoffPath) === null
      ) {
        persistDurableHandoff(held.durableHandoffPath, held.durableHandoff);
      }
    } catch (recoveryError) {
      held.warn?.(
        `gateway completed release cleanup failed and fence recovery failed: ${String(
          recoveryError,
        )}`,
      );
      throw recoveryError;
    }
    held.warn?.(`gateway completed release cleanup is pending: ${String(err)}`);
    return resumeSchedulerRecoveryResult();
  }
  clearGatewaySuspendEntryTimer(held);
  if (GATEWAY_SUSPEND_COORDINATOR_STATE.current === held) {
    GATEWAY_SUSPEND_COORDINATOR_STATE.current = null;
  }
  return {
    ok: true,
    status: "running",
    resumed: true,
    gatewayInstanceId: held.gatewayInstanceId,
    suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
    releaseReceipt: completed,
  };
}

export function resumeGatewaySuspend(
  params: GatewaySuspendResumeParams,
  currentGatewayInstanceId = getGatewayProcessInstanceId(),
  nowMs: () => number = Date.now,
  runtime: GatewaySuspendResumeRuntime = {},
): GatewaySuspendResumeResult {
  const suspendMode = resolveGatewaySuspendMode(params.suspendMode);
  if (!suspendMode) {
    return { ok: false, reason: "mode-mismatch" };
  }
  const current = GATEWAY_SUSPEND_COORDINATOR_STATE.current;
  if (current?.kind === "recovering") {
    return resumeSchedulerRecoveryResult();
  }
  const held = current ? normalizeHeldSuspension(current) : null;
  if (held?.kind === "recovering") {
    return resumeSchedulerRecoveryResult();
  }
  if (held && isGatewaySuspendCleanupState(held.resumeState)) {
    return resumeSchedulerRecoveryResult();
  }
  if (!held) {
    if (suspendMode === GATEWAY_SUSPEND_MODE_DURABLE && "releaseRequestId" in params) {
      const completed = readExactGatewaySuspendReleaseReceipt({
        handoffPath: runtime.durableHandoffPath ?? resolveGatewaySuspendHandoffPath(),
        releaseRequestId: params.releaseRequestId,
        releaseAuthoritySha256: params.releaseAuthoritySha256,
      });
      if (
        completed &&
        (completed.suspensionId !== params.suspensionId ||
          completed.gatewayInstanceId !== params.gatewayInstanceId)
      ) {
        return { ok: false, reason: "suspension-mismatch" };
      }
      if (completed?.status === "release_completed") {
        const pending = readDurableHandoff(
          runtime.durableHandoffPath ?? resolveGatewaySuspendHandoffPath(),
        )?.handoff;
        if (
          pending?.resumeState === "release-pending" &&
          pending.releaseRequestId === params.releaseRequestId &&
          pending.releaseAuthoritySha256 === params.releaseAuthoritySha256
        ) {
          return resumeSchedulerRecoveryResult();
        }
        return {
          ok: true,
          status: "running",
          resumed: false,
          gatewayInstanceId: currentGatewayInstanceId,
          suspendMode: GATEWAY_SUSPEND_MODE_DURABLE,
          releaseReceipt: completed,
        };
      }
      if (completed?.status === "release_committed") {
        return resumeSchedulerRecoveryResult();
      }
      if (params.gatewayInstanceId !== currentGatewayInstanceId) {
        return { ok: false, reason: "process-mismatch" };
      }
      return { ok: false, reason: "suspension-mismatch" };
    }
    if (params.gatewayInstanceId !== currentGatewayInstanceId) {
      return { ok: false, reason: "process-mismatch" };
    }
    return {
      ok: true,
      status: "running",
      resumed: false,
      gatewayInstanceId: currentGatewayInstanceId,
      suspendMode: GATEWAY_SUSPEND_MODE_LEGACY,
    };
  }
  if (held.suspendMode !== suspendMode) {
    return { ok: false, reason: "mode-mismatch" };
  }
  const releaseRecoveryIdentityMatches =
    suspendMode === GATEWAY_SUSPEND_MODE_DURABLE &&
    "releaseRequestId" in params &&
    held.resumeState === "release-pending" &&
    held.durableHandoff?.gatewayInstanceId === params.gatewayInstanceId;
  if (
    held.gatewayInstanceId !== currentGatewayInstanceId ||
    (params.gatewayInstanceId !== currentGatewayInstanceId && !releaseRecoveryIdentityMatches)
  ) {
    return { ok: false, reason: "process-mismatch" };
  }
  if (held.suspensionId !== params.suspensionId) {
    return { ok: false, reason: "suspension-mismatch" };
  }
  if (
    held.adoptedAtStartup &&
    !(
      suspendMode === GATEWAY_SUSPEND_MODE_DURABLE &&
      "releaseRequestId" in params &&
      held.resumeState === "release-pending"
    )
  ) {
    return { ok: false, reason: "suspension-mismatch" };
  }
  if (suspendMode === GATEWAY_SUSPEND_MODE_DURABLE) {
    if (
      !("releaseRequestId" in params) ||
      !isGatewaySuspendReleaseAuthorityPair(
        params.releaseRequestId,
        params.releaseAuthoritySha256,
      ) ||
      !held.durableHandoffPath ||
      !held.durableHandoff
    ) {
      return { ok: false, reason: "suspension-mismatch" };
    }
    if (
      runtime.durableHandoffPath !== undefined &&
      runtime.durableHandoffPath !== held.durableHandoffPath
    ) {
      return { ok: false, reason: "suspension-mismatch" };
    }
    if (runtime.pauseScheduling) {
      held.pauseScheduling = runtime.pauseScheduling;
    }
    if (runtime.resumeScheduling) {
      held.resumeScheduling = runtime.resumeScheduling;
    }
    if (held.adoptedAtStartup) {
      try {
        held.pauseScheduling();
      } catch (err) {
        held.warn?.(`gateway durable release could not pause adopted scheduler: ${String(err)}`);
        return resumeSchedulerRecoveryResult();
      }
    }
    if (held.resumeState === "held") {
      if (nowMs() >= params.resumeBeforeMs || params.resumeBeforeMs > held.expiresAtMs) {
        return { ok: false, reason: "resume-authority-expired" };
      }
      const historical = readExactGatewaySuspendReleaseReceipt({
        handoffPath: held.durableHandoffPath,
        releaseRequestId: params.releaseRequestId,
        releaseAuthoritySha256: params.releaseAuthoritySha256,
      });
      if (historical !== null) {
        return { ok: false, reason: "suspension-mismatch" };
      }
      const committedAtMs = nowMs();
      if (committedAtMs >= params.resumeBeforeMs) {
        return { ok: false, reason: "resume-authority-expired" };
      }
      let pending: GatewaySuspendHandoff;
      try {
        pending = beginDurableHandoffRelease({
          path: held.durableHandoffPath,
          expected: held.durableHandoff,
          releaseRequestId: params.releaseRequestId,
          releaseAuthoritySha256: params.releaseAuthoritySha256,
          resumeBeforeMs: params.resumeBeforeMs,
          committedAtMs,
        });
      } catch (err) {
        held.warn?.(`gateway durable release handoff persistence failed: ${String(err)}`);
        return resumeSchedulerRecoveryResult();
      }
      held.durableHandoff = pending;
      held.resumeState = pending.resumeState;
      held.resumeBeforeMs = pending.resumeBeforeMs;
      held.releaseRequestId = pending.releaseRequestId;
      held.releaseAuthoritySha256 = pending.releaseAuthoritySha256;
      held.releaseCommittedAtMs = pending.releaseCommittedAtMs;
    } else if (
      held.resumeState !== "release-pending" ||
      held.resumeBeforeMs !== params.resumeBeforeMs ||
      held.releaseRequestId !== params.releaseRequestId ||
      held.releaseAuthoritySha256 !== params.releaseAuthoritySha256
    ) {
      return { ok: false, reason: "suspension-mismatch" };
    }

    const committed = committedReleaseReceiptForHandoff(held.durableHandoff);
    const releasePath = resolveGatewaySuspendReleasePath(
      held.durableHandoffPath,
      committed.releaseRequestId,
      committed.releaseAuthoritySha256,
    );
    let releaseReceipt: GatewaySuspendReleaseReceipt;
    try {
      releaseReceipt = commitGatewaySuspendRelease({
        handoffPath: held.durableHandoffPath,
        expectedHandoff: held.durableHandoff,
        receipt: committed,
      });
    } catch (err) {
      const persisted = readGatewaySuspendReleaseReceipt(releasePath);
      if (!persisted || !isSameGatewaySuspendReleaseCommit(persisted.receipt, committed)) {
        held.warn?.(`gateway durable release commit persistence failed: ${String(err)}`);
        return resumeSchedulerRecoveryResult();
      }
      releaseReceipt = persisted.receipt;
    }
    if (releaseReceipt.status === "release_completed") {
      return finishDurableRelease({
        held,
        committed: gatewaySuspendReleaseCommittedView(releaseReceipt),
        releasePath,
        nowMs,
        afterReleaseCompleted: runtime.afterReleaseCompleted,
      });
    }
    held.adoptedAtStartup = false;
    return finishDurableRelease({
      held,
      committed,
      releasePath,
      nowMs,
      afterReleaseCompleted: runtime.afterReleaseCompleted,
    });
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
    suspendMode: GATEWAY_SUSPEND_MODE_LEGACY,
  };
}
