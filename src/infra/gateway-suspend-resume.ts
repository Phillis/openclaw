import {
  clearDurableHandoff,
  createGatewaySuspendHandoff,
  replaceDurableHandoff,
  type GatewaySuspendHandoff,
} from "./gateway-suspend-handoff.js";

export type GatewaySuspendResumeLease = {
  requestId: string;
  suspensionId: string;
  gatewayInstanceId: string;
  gatewayPid: number;
  launchdRunCount: number;
  expiresAtMs: number;
  resumeState: GatewaySuspendHandoff["resumeState"];
  resumeBeforeMs: number | null;
  admissionReopened?: boolean;
  durableHandoffPath?: string;
  durableHandoff?: GatewaySuspendHandoff;
  resumeScheduling: () => void;
  reopenAdmission: () => boolean;
  warn?: (message: string) => void;
};

export type GatewaySuspendResumeAttempt = {
  lease: GatewaySuspendResumeLease;
  nowMs: () => number;
  isCurrent: () => boolean;
  clearCurrent: () => void;
  clearTimer: () => void;
  scheduleRetry: (callback: () => void) => void;
};

export function isGatewaySuspendCleanupState(state: GatewaySuspendHandoff["resumeState"]): boolean {
  return state === "resume-reopen-authorized" || state === "resume-cleanup";
}

function durableHandoffFor(
  lease: GatewaySuspendResumeLease,
  resumeState = lease.resumeState,
  resumeBeforeMs = lease.resumeBeforeMs,
): GatewaySuspendHandoff {
  return createGatewaySuspendHandoff({
    requestId: lease.requestId,
    suspensionId: lease.suspensionId,
    gatewayInstanceId: lease.gatewayInstanceId,
    gatewayPid: lease.gatewayPid,
    launchdRunCount: lease.launchdRunCount,
    expiresAtMs: lease.expiresAtMs,
    resumeState,
    resumeBeforeMs,
  });
}

export function persistGatewaySuspendResumeState(
  lease: GatewaySuspendResumeLease,
  resumeState: GatewaySuspendHandoff["resumeState"],
  resumeBeforeMs: number | null,
): void {
  if (lease.durableHandoffPath) {
    if (!lease.durableHandoff) {
      throw new Error("gateway suspension lease lacks its active durable fence");
    }
    const replacement = durableHandoffFor(lease, resumeState, resumeBeforeMs);
    replaceDurableHandoff(lease.durableHandoffPath, lease.durableHandoff, replacement);
    lease.durableHandoff = replacement;
  }
  lease.resumeState = resumeState;
  lease.resumeBeforeMs = resumeBeforeMs;
}

function expireResumeAuthority(params: GatewaySuspendResumeAttempt): void {
  const { lease } = params;
  params.clearTimer();
  lease.resumeState = "resume-expired";
  if (!lease.durableHandoffPath) {
    return;
  }
  try {
    persistGatewaySuspendResumeState(lease, "resume-expired", lease.resumeBeforeMs);
  } catch (err) {
    lease.warn?.(`gateway expired-resume fence persistence failed: ${String(err)}`);
    params.scheduleRetry(() => {
      if (params.isCurrent() && lease.resumeState === "resume-expired") {
        expireResumeAuthority(params);
      }
    });
  }
}

export function attemptGatewaySuspendResume(
  params: GatewaySuspendResumeAttempt,
): "resumed" | "failed" | "authority-expired" {
  const { lease, nowMs } = params;
  const resumeBeforeMs = lease.resumeBeforeMs;
  if (resumeBeforeMs === null || nowMs() >= resumeBeforeMs) {
    expireResumeAuthority(params);
    return "authority-expired";
  }
  try {
    lease.resumeScheduling();
  } catch (err) {
    lease.warn?.(`gateway scheduler recovery failed: ${String(err)}`);
    params.scheduleRetry(() => {
      if (params.isCurrent() && lease.resumeState === "resume-pending") {
        attemptGatewaySuspendResume(params);
      }
    });
    return "failed";
  }
  if (!params.isCurrent()) {
    return "resumed";
  }
  if (nowMs() >= resumeBeforeMs) {
    expireResumeAuthority(params);
    return "authority-expired";
  }
  try {
    persistGatewaySuspendResumeState(lease, "resume-reopen-authorized", resumeBeforeMs);
  } catch (err) {
    lease.warn?.(`gateway resume authorization persistence failed: ${String(err)}`);
    params.scheduleRetry(() => {
      if (params.isCurrent() && lease.resumeState === "resume-pending") {
        attemptGatewaySuspendResume(params);
      }
    });
    return "failed";
  }
  if (nowMs() >= resumeBeforeMs) {
    expireResumeAuthority(params);
    return "authority-expired";
  }
  if (!lease.reopenAdmission()) {
    lease.warn?.("gateway scheduler recovery could not reopen admission");
    return "failed";
  }
  lease.admissionReopened = true;
  try {
    persistGatewaySuspendResumeState(lease, "resume-cleanup", resumeBeforeMs);
    if (lease.durableHandoffPath) {
      clearDurableHandoff(lease.durableHandoffPath);
    }
  } catch (err) {
    lease.warn?.(`gateway suspension handoff cleanup failed after reopen: ${String(err)}`);
    attemptGatewaySuspendCleanup(params);
    return "failed";
  }
  params.clearTimer();
  params.clearCurrent();
  return "resumed";
}

function attemptGatewaySuspendCleanup(params: GatewaySuspendResumeAttempt): void {
  params.scheduleRetry(() => {
    const { lease } = params;
    if (
      !params.isCurrent() ||
      !isGatewaySuspendCleanupState(lease.resumeState) ||
      !lease.admissionReopened ||
      !lease.durableHandoffPath
    ) {
      return;
    }
    try {
      if (lease.resumeState === "resume-reopen-authorized") {
        persistGatewaySuspendResumeState(lease, "resume-cleanup", lease.resumeBeforeMs);
      }
      clearDurableHandoff(lease.durableHandoffPath);
      params.clearTimer();
      params.clearCurrent();
    } catch (err) {
      lease.warn?.(`gateway suspension handoff cleanup retry failed: ${String(err)}`);
      attemptGatewaySuspendCleanup(params);
    }
  });
}
