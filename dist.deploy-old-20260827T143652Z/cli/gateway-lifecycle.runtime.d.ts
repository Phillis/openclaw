import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { Ct as TaskStatus, Nt as rotateAgentEventLifecycleGeneration, Rt as DiagnosticMemoryPressureEvent, St as TaskRecord, zt as DiagnosticMemoryUsage } from "../host-capability-types-CSKZWJAm.js";
import { i as RestartRecoveryRun } from "../types-7aAIDdHX.js";
import { ot as getRuntimeConfig } from "../config-DiNLUfeX.js";
import { a as listActiveEmbeddedRunSessionKeys, i as listActiveEmbeddedRunSessionIds, n as waitForActiveEmbeddedRuns, r as getActiveEmbeddedRunCount, t as abortEmbeddedAgentRun } from "../runs-CfDHaNUy.js";
import { i as waitForActiveCronTaskRuns, r as retireActiveCronTaskRunTracking, t as abortActiveCronTaskRuns } from "../active-run-cancellation-D2egNSpJ.js";
import { DatabaseSync } from "node:sqlite";
import { IncomingMessage, ServerResponse } from "node:http";
import { ChildProcess } from "node:child_process";

//#region src/process/gateway-work-admission.d.ts
/** Waits for admitted root transactions after restart has closed new admission. */
declare function waitForActiveGatewayRootWork(timeoutMs?: number): Promise<{
  drained: boolean;
  active: number;
}>;
//#endregion
//#region src/process/command-queue.d.ts
/**
 * Mark gateway as draining for restart so new enqueues fail fast with
 * `GatewayDrainingError` instead of being silently killed on shutdown.
 */
declare function markGatewayDraining(): void;
/**
 * Reset all lane runtime state to idle. Used after SIGUSR1 in-process
 * restarts where interrupted tasks' finally blocks may not run, leaving
 * stale active task IDs that permanently block new work from draining.
 *
 * Bumps lane generation and clears execution counters so stale completions
 * from old in-flight tasks are ignored. Queued entries are intentionally
 * preserved — they represent pending user work that should still execute
 * after restart.
 *
 * After resetting, drains any lanes that still have queued entries so
 * preserved work is pumped immediately rather than waiting for a future
 * `enqueueCommandInLane()` call (which may never come).
 */
declare function resetAllLanes(): void;
/**
 * Returns the total number of actively executing tasks across all lanes
 * (excludes queued-but-not-started entries).
 */
declare function getActiveTaskCount(): number;
/**
 * Wait for all currently active tasks across all lanes to finish.
 * Polls at a short interval; resolves when no tasks are active or
 * when `timeoutMs` elapses (whichever comes first). If no timeout is passed,
 * waits indefinitely for the active set captured at call time.
 *
 * New tasks enqueued after this call are ignored — only tasks that are
 * already executing are waited on.
 */
declare function waitForActiveTasks(timeoutMs?: number): Promise<{
  drained: boolean;
}>;
//#endregion
//#region src/cron/active-jobs.d.ts
declare function waitForActiveCronJobs(timeoutMs: number): Promise<{
  drained: boolean;
  active: number;
}>;
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
declare function advanceCronActiveJobGeneration(): void;
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
declare function resetCronActiveJobs(): void;
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-marking.d.ts
declare function markRestartAbortedMainSessions(params: {
  cfg?: OpenClawConfig;
  additionalCfgs?: Iterable<OpenClawConfig | undefined>;
  stateDir?: string;
  sessionKeys?: Iterable<string>;
  sessionIds?: Iterable<string>;
  activeRuns?: Iterable<RestartRecoveryRun & {
    sessionKey: string;
    sessionId: string;
    observedAt?: number;
  }>;
  isActiveRun?: (run: RestartRecoveryRun & {
    sessionKey: string;
    sessionId: string;
    observedAt?: number;
  }) => boolean;
  reason?: string;
}): Promise<{
  marked: number;
  skipped: number;
}>;
//#endregion
//#region src/infra/process-respawn.d.ts
type RespawnMode = "spawned" | "supervised" | "disabled" | "failed";
type GatewayRespawnResult = {
  mode: RespawnMode;
  pid?: number;
  detail?: string;
  handoffSpawned?: Promise<boolean>;
};
type GatewayUpdateRespawnResult = GatewayRespawnResult & {
  child?: ChildProcess;
};
type GatewayRespawnOptions = {
  env?: NodeJS.ProcessEnv;
};
/**
 * Attempt to restart this process with a fresh PID.
 * - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
 * - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
 * - unmanaged environments: caller should keep in-process restart behavior so
 *   custom supervisors keep tracking the same gateway PID
 */
declare function restartGatewayProcessWithFreshPid(_opts?: GatewayRespawnOptions): GatewayRespawnResult;
/**
 * Update restarts must replace the OS process so the new code runs from a
 * fresh module graph after package files have changed on disk.
 *
 * Unlike the generic restart path, update mode allows detached respawn on
 * unmanaged Windows installs because there is no safe in-process fallback once
 * the installed package contents have been replaced.
 */
declare function respawnGatewayProcessForUpdate(opts?: GatewayRespawnOptions): GatewayUpdateRespawnResult;
//#endregion
//#region src/infra/restart-intent.d.ts
type GatewayRestartIntent = {
  reason?: string;
  force?: boolean;
  waitMs?: number;
};
declare function consumeGatewayRestartIntentPayloadSync(env?: NodeJS.ProcessEnv, now?: number): GatewayRestartIntent | null;
declare function consumeGatewayRestartIntentSync(env?: NodeJS.ProcessEnv, now?: number): boolean;
//#endregion
//#region src/infra/restart.d.ts
/** Releases a signal fence when the run loop rejects or fails to handle the signal. */
declare function rollbackGatewayRestartSignalAdmission(): boolean;
declare function resetGatewayRestartStateForInProcessRestart(): void;
type RestartAuditInfo = {
  actor?: string;
  deviceId?: string;
  clientIp?: string;
  changedPaths?: string[];
};
/**
 * Register a callback that scheduleGatewaySigusr1Restart checks before emitting SIGUSR1.
 * The callback should return the number of pending items (0 = safe to restart).
 */
/** Closed restart result for owners that must distinguish coalescing from delivery failure. */
declare function requestGatewayRestartWithSignalAdmission(reasonOverride?: string, intent?: GatewayRestartIntent): GatewayRestartEmitResult;
declare function isGatewaySigusr1RestartExternallyAllowed(): boolean;
declare function consumeGatewaySigusr1RestartAuthorization(): boolean;
declare function peekGatewaySigusr1RestartReason(): string | undefined;
/**
 * Reads and clears only the in-memory intent for the current emitted SIGUSR1 cycle.
 * The restart reason and cycle token are advanced by markGatewaySigusr1RestartHandled().
 */
declare function consumeGatewaySigusr1RestartIntent(): GatewayRestartIntent | null;
/**
 * Mark the currently emitted SIGUSR1 restart cycle as consumed by the run loop.
 * This explicitly advances the cycle state instead of resetting emit guards inside
 * consumeGatewaySigusr1RestartAuthorization().
 */
declare function markGatewaySigusr1RestartHandled(): void;
type RestartEmitHooks = {
  beforeEmit?: () => Promise<void>;
  afterEmitRejected?: () => Promise<void>;
  afterEmitFailed?: () => Promise<void>;
  emitRestart?: GatewayRestartEmitter;
};
type GatewayRestartEmitter = (reasonOverride?: string, intent?: GatewayRestartIntent) => GatewayRestartEmitResult;
type GatewayRestartEmitResult = {
  status: "emitted";
} | {
  status: "coalesced";
} | {
  status: "failed";
};
declare function resolveGatewayRestartDeferralTimeoutMs(timeoutMs?: unknown): number | undefined;
type ScheduledRestart = {
  ok: boolean;
  pid: number;
  signal: "SIGUSR1";
  delayMs: number;
  reason?: string;
  mode: "emit" | "signal" | "supervisor";
  coalesced: boolean;
  cooldownMsApplied: number;
  emitHooksQueued: boolean;
};
declare function scheduleGatewaySigusr1Restart(opts?: {
  delayMs?: number;
  reason?: string;
  audit?: RestartAuditInfo;
  emitHooks?: RestartEmitHooks;
  preservePendingEmitHooksOnDeferralBypass?: boolean;
  sessionKey?: string;
  skipDeferral?: boolean;
  skipCooldown?: boolean;
}): ScheduledRestart;
//#endregion
//#region src/infra/restart-handoff.d.ts
declare const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND = "gateway-supervisor-restart-handoff";
declare const GATEWAY_RESTART_HANDOFF_SCHEMA_VERSION = 1;
type GatewayRestartHandoffRestartKind = "full-process" | "update-process";
type GatewayRestartHandoffSource = "config-write" | "gateway-update" | "operator-restart" | "plugin-change" | "signal" | "unknown";
type GatewayRestartHandoffSupervisorMode = "launchd" | "systemd" | "schtasks" | "external";
type GatewayRestartHandoff = {
  kind: typeof GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND;
  version: typeof GATEWAY_RESTART_HANDOFF_SCHEMA_VERSION;
  intentId: string;
  pid: number;
  processInstanceId?: string;
  createdAt: number;
  expiresAt: number;
  reason?: string;
  source: GatewayRestartHandoffSource;
  restartKind: GatewayRestartHandoffRestartKind;
  supervisorMode: GatewayRestartHandoffSupervisorMode;
  restartTrace?: {
    startedAt: number;
    lastAt: number;
  };
};
/** Write the bounded supervisor restart handoff atomically. */
declare function writeGatewayRestartHandoffSync(opts: {
  env?: NodeJS.ProcessEnv;
  pid?: number;
  processInstanceId?: string;
  reason?: string;
  source?: GatewayRestartHandoffSource;
  restartKind: GatewayRestartHandoffRestartKind;
  supervisorMode?: GatewayRestartHandoffSupervisorMode | null;
  restartTrace?: GatewayRestartHandoff["restartTrace"];
  ttlMs?: number;
  createdAt?: number;
}): GatewayRestartHandoff | null;
//#endregion
//#region src/tasks/task-restart-blocker.d.ts
type ActiveTaskRestartBlocker = {
  taskId: string;
  status: Extract<TaskStatus, "running">;
  runtime: TaskRecord["runtime"];
  runId?: string;
  label?: string;
  title?: string;
};
//#endregion
//#region src/infra/gateway-suspend-coordinator.d.ts
declare function resetGatewaySuspendCoordinatorForLifecycleRestart(): void;
//#endregion
//#region src/infra/restart-sentinel-store.d.ts
type RestartSentinelLog = {
  stdoutTail?: string | null;
  stderrTail?: string | null;
  exitCode?: number | null;
};
type RestartSentinelStep = {
  name: string;
  command: string;
  cwd?: string | null;
  durationMs?: number | null;
  log?: RestartSentinelLog | null;
};
type RestartSentinelStats = {
  mode?: string;
  root?: string;
  requiresRestart?: boolean;
  handoffId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  steps?: RestartSentinelStep[];
  reason?: string | null;
  durationMs?: number | null;
};
type RestartSentinelContinuation = {
  kind: "systemEvent";
  text: string;
} | {
  kind: "agentTurn";
  message: string;
};
type RestartSentinelPayload = {
  kind: "config-apply" | "config-auto-recovery" | "config-patch" | "update" | "restart";
  status: "ok" | "error" | "skipped";
  ts: number;
  sessionKey?: string;
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
  };
  threadId?: string;
  message?: string | null;
  continuation?: RestartSentinelContinuation | null;
  doctorHint?: string | null;
  stats?: RestartSentinelStats | null;
};
type RestartSentinelEnvelope = {
  version: 1;
  payload: RestartSentinelPayload;
};
type RestartSentinel = RestartSentinelEnvelope & {
  /** Optimistic-concurrency revision backed by gateway_restart_sentinel.updated_at_ms. */revision: number;
};
//#endregion
//#region src/infra/restart-sentinel.d.ts
declare function markUpdateRestartSentinelFailure(reason: string, env?: NodeJS.ProcessEnv): Promise<RestartSentinel | null>;
//#endregion
//#region src/infra/supervisor-markers.d.ts
/** Supported supervisor families that can respawn the gateway after update/restart handoff. */
type RespawnSupervisor = "launchd" | "systemd" | "schtasks";
type GatewayRespawnSupervisor = RespawnSupervisor | "external";
interface DetectRespawnSupervisorOptions {
  includeLinuxOpenClawGatewayServiceMarker?: boolean;
}
/** Detects the current platform supervisor from process environment hints. */
declare function detectRespawnSupervisor(env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform, options?: DetectRespawnSupervisorOptions): RespawnSupervisor | null;
/** Resolves gateway restart ownership without treating external mode as a native service manager. */
declare function detectGatewayRespawnSupervisor(env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform, options?: DetectRespawnSupervisorOptions): GatewayRespawnSupervisor | null;
//#endregion
//#region src/logging/diagnostic-stability-bundle.d.ts
type DiagnosticHeapSpaceSummary = {
  spaceName: string;
  spaceSizeBytes: number;
  spaceUsedBytes: number;
  spaceAvailableBytes: number;
  physicalSpaceSizeBytes: number;
};
type DiagnosticHeapStatisticsSummary = {
  totalHeapSizeBytes: number;
  totalHeapSizeExecutableBytes: number;
  totalPhysicalSizeBytes: number;
  totalAvailableSizeBytes: number;
  usedHeapSizeBytes: number;
  heapSizeLimitBytes: number;
  mallocedMemoryBytes: number;
  externalMemoryBytes: number;
};
type DiagnosticActiveResourceSummary = {
  total: number;
  byType: Record<string, number>;
};
type DiagnosticCgroupMemorySummary = {
  version: "v2";
  values: Record<string, number | "max">;
  events: Record<string, number>;
};
type DiagnosticSessionFileSummary = {
  relativePath: string;
  sizeBytes: number;
  mtimeMs: number;
};
type DiagnosticMemoryPressureBundleEvidence = {
  level: DiagnosticMemoryPressureEvent["level"];
  reason: DiagnosticMemoryPressureEvent["reason"];
  memory: DiagnosticMemoryUsage;
  thresholdBytes?: number;
  rssGrowthBytes?: number;
  windowMs?: number;
  heapStatistics?: DiagnosticHeapStatisticsSummary;
  heapSpaces?: DiagnosticHeapSpaceSummary[];
  cgroup?: DiagnosticCgroupMemorySummary;
  activeResources?: DiagnosticActiveResourceSummary;
  topSessionFiles?: DiagnosticSessionFileSummary[];
};
type DiagnosticStabilityBundleEvidence = {
  memoryPressure?: DiagnosticMemoryPressureBundleEvidence;
};
type WriteDiagnosticStabilityBundleOptions = {
  reason: string;
  error?: unknown;
  includeEmpty?: boolean;
  limit?: number;
  now?: Date;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  retention?: number;
  evidence?: DiagnosticStabilityBundleEvidence;
};
type DiagnosticStabilityBundleFailureWriteOutcome = {
  status: "written";
  message: string;
  path: string;
} | {
  status: "failed";
  message: string;
  error: unknown;
} | {
  status: "skipped";
  reason: "empty";
};
type WriteDiagnosticStabilityBundleForFailureOptions = Omit<WriteDiagnosticStabilityBundleOptions, "error" | "includeEmpty" | "reason">;
declare function writeDiagnosticStabilityBundleForFailureSync(reason: string, error?: unknown, options?: WriteDiagnosticStabilityBundleForFailureOptions): DiagnosticStabilityBundleFailureWriteOutcome;
//#endregion
//#region src/tasks/runtime-internal.d.ts
declare function reloadTaskRuntimeStateFromStore(): void;
//#endregion
//#region src/tasks/task-registry.maintenance.d.ts
declare function getInspectableActiveTaskRestartBlockers(): ActiveTaskRestartBlocker[];
//#endregion
//#region src/gateway/server-reload-contracts.d.ts
/** Signal any in-progress deferred channel reload to abort immediately. */
declare function abortPendingChannelReloads(): void;
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, detectGatewayRespawnSupervisor, detectRespawnSupervisor, getActiveEmbeddedRunCount, getActiveTaskCount, getInspectableActiveTaskRestartBlockers, getRuntimeConfig, isGatewaySigusr1RestartExternallyAllowed, listActiveEmbeddedRunSessionIds, listActiveEmbeddedRunSessionKeys, markGatewayDraining, markGatewaySigusr1RestartHandled, markRestartAbortedMainSessions, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForActiveEmbeddedRuns, waitForActiveGatewayRootWork, waitForActiveTasks, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };