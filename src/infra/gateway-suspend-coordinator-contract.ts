import {
  GATEWAY_SUSPEND_MODE_DURABLE,
  GATEWAY_SUSPEND_MODE_LEGACY,
  type GatewaySuspendMode,
  type GatewaySuspendPrepareResult as GatewaySuspendPrepareWireResult,
  type GatewaySuspendResumeResult as GatewaySuspendResumeWireResult,
  type GatewaySuspendStatusResult as GatewaySuspendStatusWireResult,
} from "../../packages/gateway-protocol/src/index.js";
import type { GatewayActiveWorkSnapshot } from "./gateway-active-work.js";
import type { GatewaySuspendResumeLease } from "./gateway-suspend-resume.js";

export { GATEWAY_SUSPEND_MODE_DURABLE, GATEWAY_SUSPEND_MODE_LEGACY };
export type { GatewaySuspendMode };

export const GATEWAY_SCHEDULER_RECOVERY_RETRY_MS = 1_000;

type GatewaySchedulerRecoveryResult = {
  status: "recovering";
  reason: "scheduler-resume-failed";
  retryAfterMs: number;
};

export type GatewaySuspendPrepareResult =
  | GatewaySuspendPrepareWireResult
  | { status: "conflict"; expiresAtMs: number }
  | { status: "mode-mismatch" }
  | { status: "process-mismatch" }
  | GatewaySchedulerRecoveryResult;

export type GatewaySuspendStatusResult =
  | GatewaySuspendStatusWireResult
  | { status: "conflict"; expiresAtMs: number }
  | { status: "mode-mismatch" }
  | { status: "process-mismatch" }
  | GatewaySchedulerRecoveryResult;

export type GatewaySuspendResumeResult =
  | GatewaySuspendResumeWireResult
  | { ok: false; reason: "suspension-mismatch" }
  | { ok: false; reason: "mode-mismatch" | "process-mismatch" | "resume-authority-expired" }
  | { ok: false; reason: "scheduler-resume-failed"; retryAfterMs: number };

type GatewaySuspendCoordinatorEntryBase = {
  owner: object;
  resumeScheduling: () => void;
  reopenAdmission: () => boolean;
  warn?: (message: string) => void;
  timer?: ReturnType<typeof setTimeout>;
  durableHandoffPath?: string;
};

export type HeldGatewaySuspension = GatewaySuspendCoordinatorEntryBase &
  GatewaySuspendResumeLease & {
    kind: "held";
    snapshot: GatewayActiveWorkSnapshot;
    nowMs: () => number;
    adoptedAtStartup?: boolean;
  };

export type GatewaySchedulerRecovery = GatewaySuspendCoordinatorEntryBase & {
  kind: "recovering";
};

export type GatewaySuspendCoordinatorEntry = HeldGatewaySuspension | GatewaySchedulerRecovery;

export type GatewaySuspendCoordinatorState = {
  current: GatewaySuspendCoordinatorEntry | null;
  retiredForLifecycleReset?: GatewaySuspendCoordinatorEntry | null;
};

export function schedulerRecoveryResult(): GatewaySchedulerRecoveryResult {
  return {
    status: "recovering",
    reason: "scheduler-resume-failed",
    retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  };
}

export function resumeSchedulerRecoveryResult(): GatewaySuspendResumeResult {
  return {
    ok: false,
    reason: "scheduler-resume-failed",
    retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS,
  };
}

export function resolveGatewaySuspendMode(
  value: GatewaySuspendMode | undefined,
): GatewaySuspendMode | null {
  if (value === undefined || value === GATEWAY_SUSPEND_MODE_LEGACY) {
    return GATEWAY_SUSPEND_MODE_LEGACY;
  }
  return value === GATEWAY_SUSPEND_MODE_DURABLE ? value : null;
}
