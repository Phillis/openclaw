import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { C as DiagnosticMemoryUsage, Z as DiagnosticSessionActiveWorkKind, it as DiagnosticSessionState, y as DiagnosticLivenessWarningReason } from "./diagnostic-events-XF2IPtMP.js";

//#region src/logging/diagnostic-memory.d.ts
type DiagnosticMemoryThresholds = {
  rssWarningBytes?: number;
  rssCriticalBytes?: number;
  heapUsedWarningBytes?: number;
  heapUsedCriticalBytes?: number;
  rssGrowthWarningBytes?: number;
  rssGrowthCriticalBytes?: number;
  growthWindowMs?: number;
  pressureRepeatMs?: number;
};
declare function emitDiagnosticMemorySample(options?: {
  now?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  heapSizeLimitBytes?: number;
  uptimeMs?: number;
  thresholds?: DiagnosticMemoryThresholds;
  emitSample?: boolean;
  writeCriticalBundle?: boolean;
  stateDir?: string;
  sessionStorePaths?: string[];
  resolveSessionStorePaths?: () => string[] | undefined;
}): DiagnosticMemoryUsage;
//#endregion
//#region src/logging/diagnostic-session-recovery.d.ts
type DiagnosticSessionRecoverySkipReason = "active_embedded_run" | "active_reply_work" | "deferred_maintenance_wait" | "global_lane_wait" | "active_lane_task" | "already_in_flight" | "missing_session_ref" | "stale_session_state";
type DiagnosticSessionRecoveryNoopReason = "no_active_work";
type StuckSessionRecoveryRequest = {
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  ageMs: number;
  queueDepth?: number;
  allowActiveAbort?: boolean;
  expectedState?: DiagnosticSessionState;
  stateGeneration?: number;
  /**
   * Built-in no-forward-progress age after
   * which an "active" run with queued work is treated as a leaked/dead handle and
   * reclaimed. Honors an operator-raised threshold; falls back to a safe floor.
   */
  staleActiveProgressAbortMs?: number;
  /**
   * Resolved compaction safety timeout. Ownerless lane recovery waits at least
   * this long plus settle grace so queued compaction cannot be double-run.
   */
  compactionSafetyTimeoutMs?: number;
};
type DiagnosticSessionRecoveryBaseOutcome = {
  sessionId?: string;
  sessionKey?: string;
  activeSessionId?: string;
  lane?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
};
type StuckSessionRecoveryOutcome = (DiagnosticSessionRecoveryBaseOutcome & {
  status: "aborted";
  action: "abort_embedded_run";
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
  released: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "released";
  action: "release_lane";
  reason?: "stale_lane_task";
  released: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "skipped";
  action: "observe_only" | "keep_lane";
  reason: DiagnosticSessionRecoverySkipReason;
  activeCount?: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "noop";
  action: "none";
  reason: DiagnosticSessionRecoveryNoopReason;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "failed";
  action: "none";
  reason: "exception";
  error: string;
});
//#endregion
//#region src/logging/diagnostic-session-recovery-coordinator.d.ts
type RecoverStuckSession = (params: StuckSessionRecoveryRequest) => void | StuckSessionRecoveryOutcome | Promise<void | StuckSessionRecoveryOutcome>;
//#endregion
//#region src/logging/diagnostic.d.ts
type EmitDiagnosticMemorySample = typeof emitDiagnosticMemorySample;
type DiagnosticWorkSnapshot = {
  activeCount: number;
  waitingCount: number;
  queuedCount: number;
  activeLabels: string[];
  waitingLabels: string[];
  queuedLabels: string[];
};
type DiagnosticLivenessSample = {
  reasons: DiagnosticLivenessWarningReason[];
  intervalMs: number;
  degradedSinceMs?: number;
  eventLoopDelayP99Ms?: number;
  eventLoopDelayMaxMs?: number;
  eventLoopUtilization?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
};
type SampleDiagnosticLiveness = (now: number, work: DiagnosticWorkSnapshot) => DiagnosticLivenessSample | null;
type StartDiagnosticHeartbeatOptions = {
  getConfig?: () => OpenClawConfig;
  emitMemorySample?: EmitDiagnosticMemorySample;
  sampleLiveness?: SampleDiagnosticLiveness;
  recoverStuckSession?: RecoverStuckSession;
  startupGraceMs?: number; /** Keeps fake-timer recovery tests fast without reopening runtime config tuning. */
  testTimings?: {
    stuckSessionWarnMs: number;
    stuckSessionAbortMs: number;
  };
};
declare function logWebhookReceived(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
}): void;
declare function logWebhookProcessed(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
  durationMs?: number;
}): void;
declare function logWebhookError(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
  error: string;
}): void;
declare function startDiagnosticHeartbeat(config?: OpenClawConfig, opts?: StartDiagnosticHeartbeatOptions): void;
declare function stopDiagnosticHeartbeat(): void;
//#endregion
export { stopDiagnosticHeartbeat as a, startDiagnosticHeartbeat as i, logWebhookProcessed as n, logWebhookReceived as r, logWebhookError as t };