import "../types.openclaw-ClnaeuRs.js";
import "../index-CupoZcg3.js";
import "../channel-contract-DLq6qN88.js";
import "../templating-B2U7ExGD.js";
import "../types-BqVSqbhn.js";
import "../input-provenance-CbIybIuA.js";
import "../execution-identity-admission-QJ9jJTde.js";
import "../manifest-registry-BxbBLC7n.js";
import { An as advanceCronActiveJobGeneration, Mn as waitForActiveCronJobs, Nn as DiagnosticMemoryPressureEvent, On as rotateAgentEventLifecycleGeneration, Pn as DiagnosticMemoryUsage, _n as TaskStatus, gn as TaskRecord, jn as resetCronActiveJobs, pt as abortEmbeddedAgentRun } from "../types-5umPnScv.js";
import "../plugin-metadata-snapshot.types-Unqs8JMC.js";
import "../plugin-metadata-snapshot-31daOrm8.js";
import "../config-GDtWBx0k.js";
import "../hook-runner-global-BZOTnQUd.js";
import "../web-media-o1sGWuDA.js";
import { i as waitForActiveCronTaskRuns, r as retireActiveCronTaskRunTracking, t as abortActiveCronTaskRuns } from "../active-run-cancellation-KAaMNmu3.js";
import "../services-C2X1zA3S.js";
import "../index-CPKNYzw-.js";
import "../update-startup-C-UDftTl.js";
import { DatabaseSync } from "node:sqlite";
import { IncomingMessage, ServerResponse } from "node:http";
import { ChildProcess } from "node:child_process";
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
//#endregion
//#region src/infra/process-respawn.d.ts
type GatewayRespawnResult = {
  mode: "supervised" | "disabled" | "failed";
  detail?: string;
  handoffSpawned?: Promise<boolean>;
};
type GatewayUpdateRespawnResult = {
  mode: "spawned" | "disabled" | "failed";
  pid?: number;
  detail?: string;
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
 * The caller resolves supervisor ownership first; this path is only for an
 * unmanaged process whose installed package contents have been replaced.
 */
declare function respawnGatewayProcessForUpdate(opts?: GatewayRespawnOptions): GatewayUpdateRespawnResult;
//#endregion
//#region src/infra/restart-intent.d.ts
type GatewayRestartIntent = {
  reason?: string;
  force?: boolean;
  waitMs?: number;
  successorOwner?: {
    kind: "managed-update-handoff";
    handoffId: string;
    installRoot: string;
  };
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
declare function resolveGatewayRestartDeferralTimeoutMs(): number;
declare function resolveGatewayRestartDeferralTimeoutMs(timeoutMs: unknown): number | undefined;
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
  successorOwner?: GatewayRestartIntent["successorOwner"];
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
  /** Optimistic-concurrency revision backed by gateway_restart_sentinel.updated_at_ms. */
  revision: number;
};
//#endregion
//#region src/infra/restart-sentinel.d.ts
declare function markUpdateRestartSentinelFailure(reason: string, env?: NodeJS.ProcessEnv): Promise<RestartSentinel | null>;
//#endregion
//#region src/infra/update-managed-service-handoff.d.ts
declare function claimManagedServiceUpdateHandoff(identity: NonNullable<GatewayRestartIntent["successorOwner"]>): boolean;
declare function requestManagedServiceUpdateHandoffPark(identity: NonNullable<GatewayRestartIntent["successorOwner"]>): Promise<boolean>;
declare function commitManagedServiceUpdateHandoff(identity: NonNullable<GatewayRestartIntent["successorOwner"]>, outcome?: "update" | "restore"): Promise<boolean>;
declare function cancelManagedServiceUpdateHandoff(identity: NonNullable<GatewayRestartIntent["successorOwner"]>): Promise<"restored-in-process" | "restart-after-exit" | false>;
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
//#region src/infra/gateway-active-work.d.ts
type GatewayActiveWorkCounts = {
  queueSize: number;
  pendingReplies: number;
  embeddedRuns: number;
  backgroundExecSessions: number;
  cronRuns: number;
  activeTasks: number;
  rootRequests: number;
  sessionAdmissions: number;
  sessionMutations: number;
  chatRuns: number;
  queuedTurns: number;
  terminalPersistence: number;
  terminalSessions: number;
  /** Compatibility aggregate. Categories can overlap; use individual counts for diagnostics. */
  totalActive: number;
};
type GatewayActiveWorkBlocker = {
  kind: "queue" | "reply" | "embedded-run" | "background-exec" | "cron-run" | "task" | "root-request" | "session-admission" | "session-mutation" | "chat-run" | "queued-turn" | "terminal-persistence" | "terminal-session";
  count: number;
  message: string;
  task?: ActiveTaskRestartBlocker;
};
type GatewayActiveWorkSnapshot = {
  idle: boolean;
  counts: GatewayActiveWorkCounts;
  blockers: GatewayActiveWorkBlocker[];
};
type GatewayActiveWorkWaitResult = {
  drained: boolean;
  snapshot: GatewayActiveWorkSnapshot;
};
type GatewayActiveWorkInspectors = {
  getQueueSize: () => number;
  getPendingReplies: () => number;
  getEmbeddedRuns: () => number;
  getBackgroundExecSessions: () => number;
  getCronRuns: () => number;
  getActiveTasks: () => number;
  getTaskBlockers: () => ActiveTaskRestartBlocker[];
  getRootRequests: () => number;
  getSessionAdmissions: () => number;
  getSessionMutations: () => number;
  getChatRuns: () => number;
  getQueuedTurns: () => number;
  getTerminalPersistence: () => number;
  getTerminalSessions: () => number;
};
declare function createGatewayActiveWorkSnapshot(inspectors?: Partial<GatewayActiveWorkInspectors>, options?: {
  ignoreTerminalSessions?: boolean;
}): GatewayActiveWorkSnapshot;
/** Waits for the complete process-wide active-work inventory to become idle. */
declare function waitForGatewayActiveWork(timeoutMs?: number, options?: {
  onSnapshot?: (snapshot: GatewayActiveWorkSnapshot) => void;
}): Promise<GatewayActiveWorkWaitResult>;
//#endregion
//#region src/infra/gateway-suspend-coordinator.d.ts
declare function resetGatewaySuspendCoordinatorForLifecycleRestart(): void;
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
//#region src/gateway/server-reload-contracts.d.ts
/** Signal any in-progress deferred channel reload to abort immediately. */
declare function abortPendingChannelReloads(): void;
//#endregion
export { abortActiveCronTaskRuns, abortEmbeddedAgentRun, abortPendingChannelReloads, advanceCronActiveJobGeneration, cancelManagedServiceUpdateHandoff, claimManagedServiceUpdateHandoff, commitManagedServiceUpdateHandoff, consumeGatewayRestartIntentPayloadSync, consumeGatewayRestartIntentSync, consumeGatewaySigusr1RestartAuthorization, consumeGatewaySigusr1RestartIntent, createGatewayActiveWorkSnapshot, detectGatewayRespawnSupervisor, detectRespawnSupervisor, isGatewaySigusr1RestartExternallyAllowed, markGatewayDraining, markGatewaySigusr1RestartHandled, markUpdateRestartSentinelFailure, peekGatewaySigusr1RestartReason, reloadTaskRuntimeStateFromStore, requestGatewayRestartWithSignalAdmission, requestManagedServiceUpdateHandoffPark, resetAllLanes, resetCronActiveJobs, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, resolveGatewayRestartDeferralTimeoutMs, respawnGatewayProcessForUpdate, restartGatewayProcessWithFreshPid, retireActiveCronTaskRunTracking, rollbackGatewayRestartSignalAdmission, rotateAgentEventLifecycleGeneration, scheduleGatewaySigusr1Restart, waitForActiveCronJobs, waitForActiveCronTaskRuns, waitForGatewayActiveWork, writeDiagnosticStabilityBundleForFailureSync, writeGatewayRestartHandoffSync };