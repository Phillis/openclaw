import "./types-BdTyUrVT.js";
import { f as CronScheduledToolCallerOrigin, p as CronScheduledToolPolicy, x as HookExternalContentSource, y as SessionCreatedActor } from "./types-Kt4lh6nX.js";
import { t as ChannelId } from "./channel-id.types-myn0PI2A.js";
import "./types.public-B6kp1nO6.js";
import { t as FailoverReason } from "./signal-DTFr3i_8.js";
import { t as CronRuntimeAuthority } from "./runtime-authority-UwYXiqCS.js";
import "./openclaw-state-db.generated-CIYJwO5s.js";
import { DatabaseSync } from "node:sqlite";
import "kysely";
//#region src/auto-reply/reply/normalize-reply.d.ts
type NormalizeReplySkipReason = "empty" | "silent" | "heartbeat" | "channel_transform";
//#endregion
//#region src/cron/types-shared.d.ts
/** Optional dynamic-cadence bounds for one cron job. */
type CronPacing = {
  min?: string;
  max?: string;
};
/** Shared persisted cron job envelope used by runtime and external config shapes. */
type CronJobBase<TSchedule, TSessionTarget, TWakeMode, TPayload, TDelivery, TFailureAlert> = {
  id: string;
  agentId?: string;
  sessionKey?: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: TSchedule;
  pacing?: CronPacing;
  sessionTarget: TSessionTarget;
  wakeMode: TWakeMode;
  payload: TPayload;
  delivery?: TDelivery;
  failureAlert?: TFailureAlert;
};
//#endregion
//#region src/cron/types.d.ts
/** Supported schedule forms persisted in cron job specs. */
type CronSchedule = {
  kind: "at";
  at: string;
} | {
  kind: "every";
  everyMs: number;
  anchorMs?: number;
} | {
  kind: "cron";
  expr: string;
  tz?: string;
  /** Optional deterministic stagger window in milliseconds (0 keeps exact schedule). */
  staggerMs?: number;
} | {
  /**
   * Event-driven (non-time) trigger: the job fires once when a gateway-owned
   * watcher process running `command` exits. The watcher lives under the
   * gateway ProcessSupervisor, NOT inside any agent turn's process tree, so
   * it survives the per-turn spawn-and-kill teardown that CLI backends apply
   * (#71662). On exit the job runs through the normal cron run pipeline, so
   * delivery to the bound session works exactly like a scheduled main job.
   * `computeNextRunAtMs` returns undefined for this kind (never time-due).
   */
  kind: "on-exit";
  command: string;
  cwd?: string;
} | {
  /** Event-driven source whose supervised argv emits payload-triggering lines. */
  kind: "stream";
  command: string[];
  cwd?: string;
  mode?: "line" | "match";
  /** JavaScript regular-expression source, required when mode is "match". */
  match?: string;
  batchMs?: number;
  maxBatchBytes?: number;
};
/** Runtime target that decides whether a job joins main, isolated, or a named session. */
type CronSessionTarget = "main" | "isolated" | "current" | `session:${string}`;
/** Wake policy for main-session jobs waiting on heartbeat/user activity. */
type CronWakeMode = "next-heartbeat" | "now";
/** Messaging channel id accepted by cron delivery settings. */
type CronMessageChannel = ChannelId;
/** Delivery mode for job completion output. */
type CronDeliveryMode = "none" | "announce" | "webhook";
/** Completion delivery configuration for cron job output. */
type CronDelivery = {
  mode: CronDeliveryMode;
  channel?: CronMessageChannel;
  to?: string;
  /** Explicit thread/topic id for channels that support threaded delivery. */
  threadId?: string | number;
  /** Explicit channel account id for multi-account setups (e.g. multiple Telegram bots). */
  accountId?: string;
  bestEffort?: boolean;
  /** Additional webhook destination used when a job must keep chat delivery. */
  completionDestination?: CronCompletionDestination;
  /** Separate destination for failure notifications. */
  failureDestination?: CronFailureDestination;
};
/** Webhook completion destination used alongside chat delivery. */
type CronCompletionDestination = {
  mode: "webhook";
  to?: string;
};
/** Destination override for failed-run notifications. */
type CronFailureDestination = {
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
  mode?: "announce" | "webhook";
};
/** Partial failure-destination update shape; null clears individual override fields. */
type CronFailureDestinationPatch = {
  channel?: CronMessageChannel | null;
  to?: string | null;
  accountId?: string | null;
  mode?: "announce" | "webhook" | null;
};
/** Partial delivery update shape; null clears optional delivery destinations or fields. */
type CronDeliveryPatch = Partial<Pick<CronDelivery, "mode" | "bestEffort">> & {
  channel?: CronMessageChannel | null;
  to?: string | null;
  threadId?: string | number | null;
  accountId?: string | null;
  completionDestination?: CronCompletionDestination | null;
  failureDestination?: CronFailureDestinationPatch | null;
};
/** Execution outcome, separate from delivery outcome. */
type CronRunStatus = "ok" | "error" | "skipped";
/** Delivery outcome for completion or failure-notification sends. */
type CronDeliveryStatus = "delivered" | "not-delivered" | "unknown" | "not-requested";
/** Severity level for persisted cron run diagnostics. */
type CronRunDiagnosticSeverity = "info" | "warn" | "error";
/** Subsystem that produced a cron run diagnostic entry. */
type CronRunDiagnosticSource = "cron-preflight" | "cron-setup" | "model-preflight" | "agent-run" | "tool" | "exec" | "delivery";
/** Timestamped diagnostic entry preserved for cron run troubleshooting. */
type CronRunDiagnostic = {
  ts: number;
  source: CronRunDiagnosticSource;
  severity: CronRunDiagnosticSeverity;
  message: string;
  toolName?: string;
  exitCode?: number | null;
  truncated?: boolean;
};
/** Bounded diagnostic bundle stored on the run outcome. */
type CronRunDiagnostics = {
  summary?: string;
  entries: CronRunDiagnostic[];
};
/** Failure alert policy persisted on a cron job. */
type CronFailureAlert = {
  after?: number;
  channel?: CronMessageChannel;
  to?: string;
  cooldownMs?: number;
  /** When true, consecutive skipped runs count toward the alert threshold. */
  includeSkipped?: boolean;
  /** Delivery mode: announce (via messaging channels) or webhook (HTTP POST). */
  mode?: "announce" | "webhook";
  /** Account ID for multi-account channel configurations. */
  accountId?: string;
};
/** Partial failure-alert update; null clears an inherited field override. */
type CronFailureAlertPatch = { [K in keyof CronFailureAlert]?: CronFailureAlert[K] | null; };
/** Payload variants cron can execute in main-session or detached modes. */
type CronPayload = ({
  kind: "systemEvent";
  text: string;
} & CronPayloadToolAllow) | (CronAgentTurnPayload & CronPayloadToolAllow) | (CronCommandPayload & CronPayloadToolAllow) | (CronScriptPayload & CronPayloadToolAllow) | ({
  kind: "heartbeat";
} & CronPayloadToolAllow) | ({
  kind: "skillCollectionReview";
} & CronPayloadToolAllow);
/** Partial payload update shape used by cron patch/edit flows. */
type CronPayloadPatch = ({
  kind: "systemEvent";
  text?: string;
} & CronPayloadToolAllowPatch) | (CronAgentTurnPayloadPatch & CronPayloadToolAllowPatch) | (CronCommandPayloadPatch & CronPayloadToolAllowPatch) | (CronScriptPayloadPatch & CronPayloadToolAllowPatch) | ({
  kind: "heartbeat";
} & CronPayloadToolAllowPatch) | ({
  kind: "skillCollectionReview";
} & CronPayloadToolAllowPatch);
type CronPayloadToolAllow = {
  /** Restricts agentTurn execution, or the trigger runtime for other payload kinds. */
  toolsAllow?: string[];
  /** Server-managed marker for auto-stamped defaults; explicit restrictions omit it. */
  toolsAllowIsDefault?: boolean;
};
type CronPayloadToolAllowPatch = {
  toolsAllow?: string[] | null;
  toolsAllowIsDefault?: boolean;
};
type CronAgentTurnPayloadFields = {
  message: string;
  /** Optional model override (provider/model or alias). */
  model?: string;
  /** Optional per-job fallback models; overrides agent/global fallbacks when defined. */
  fallbacks?: string[];
  thinking?: string;
  timeoutSeconds?: number;
  allowUnsafeExternalContent?: boolean;
  /** Immutable external hook provenance for async dispatch. */
  externalContentSource?: HookExternalContentSource;
  /** If true, run with lightweight bootstrap context. */
  lightContext?: boolean;
};
type CronAgentTurnPayload = {
  kind: "agentTurn";
} & CronAgentTurnPayloadFields;
type CronAgentTurnPayloadPatch = {
  kind: "agentTurn";
} & Partial<Omit<CronAgentTurnPayloadFields, "model" | "fallbacks" | "toolsAllow" | "thinking">> & {
  model?: string | null;
  fallbacks?: string[] | null;
  toolsAllow?: string[] | null;
  thinking?: string | null;
};
type CronCommandPayloadFields = {
  /** Explicit argv vector to execute. Use a shell wrapper argv for shell syntax. */
  argv: string[];
  cwd?: string;
  env?: Record<string, string>;
  input?: string;
  timeoutSeconds?: number;
  noOutputTimeoutSeconds?: number;
  outputMaxBytes?: number;
};
type CronCommandPayload = {
  kind: "command";
} & CronCommandPayloadFields;
type CronCommandPayloadPatch = {
  kind: "command";
} & Partial<CronCommandPayloadFields>;
type CronScriptPayloadFields = {
  script: string;
  timeoutSeconds?: number;
  toolBudget?: number;
};
type CronScriptPayload = {
  kind: "script";
} & CronScriptPayloadFields;
type CronScriptPayloadPatch = {
  kind: "script";
} & Partial<CronScriptPayloadFields>;
/** Mutable runtime state persisted beside the immutable cron job spec. */
type CronJobState = {
  nextRunAtMs?: number;
  /**
   * When the current scheduling inputs took effect. Restart catch-up replays a
   * missed slot only when the slot is newer than this, because slots computed
   * from a freshly edited schedule never existed under the old one. Absent on
   * jobs whose schedule has not changed, where every computed slot is real.
   */
  scheduleActivatedAtMs?: number;
  /** Exact startup catch-up slot protected from future-slot repair across restarts. */
  startupCatchupAtMs?: number;
  /** Exact paced completion slot protected from future-slot repair until consumed. */
  pacedNextRunAtMs?: number;
  /** Exact recurring slot retained across an out-of-band manual force run. */
  forcePreservedNextRunAtMs?: number;
  /** Durable pre-admission reservation. Cleared on restart without recording a run. */
  queuedAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  /** Preferred execution outcome field. */
  lastRunStatus?: CronRunStatus;
  /** @deprecated Use lastRunStatus. */
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDiagnostics?: CronRunDiagnostics;
  lastDiagnosticSummary?: string;
  /** Classified reason for the last error (when available). */
  lastErrorReason?: FailoverReason;
  lastDurationMs?: number;
  /** Number of consecutive execution errors (reset on success). Used for backoff. */
  consecutiveErrors?: number;
  /** Durable explanation for a scheduler-owned automatic disable transition. */
  autoDisabled?: {
    reason: "consecutive-failures" | "schedule-errors";
    atMs: number;
    consecutiveErrors: number;
  };
  /** Number of consecutive skipped executions (reset on success or error). */
  consecutiveSkipped?: number;
  /** Last failure alert timestamp (ms since epoch) for cooldown gating. */
  lastFailureAlertAtMs?: number;
  /** Number of consecutive schedule computation errors. Auto-disables job after threshold. */
  scheduleErrorCount?: number;
  /** Timestamp of the last trigger script evaluation. */
  lastTriggerEvalAtMs?: number;
  /** Number of completed trigger script evaluations. */
  triggerEvalCount?: number;
  /** Timestamp of the last trigger evaluation that fired. */
  lastTriggerFireAtMs?: number;
  /** JSON state returned by the last trigger script evaluation. */
  triggerState?: unknown;
  /** Current gateway-owned stream source lifecycle state. */
  streamStatus?: "starting" | "running" | "restarting" | "stopped" | "disabled" | "error";
  streamError?: string;
  streamConsecutiveFailures?: number;
  streamRestartExhausted?: boolean;
  streamSourceIdentity?: string;
  streamDroppedBatches?: number;
  streamCoalescedBatches?: number;
  streamLastStartedAtMs?: number;
  streamLastExitAtMs?: number;
  /** Explicit delivery outcome, separate from execution outcome. */
  lastDeliveryStatus?: CronDeliveryStatus;
  /** Delivery-specific error text when available. */
  lastDeliveryError?: string;
  /** Intentional non-delivery reason for the last run, when recorded by the dispatcher. */
  deliverySuppressionReason?: NormalizeReplySkipReason;
  /** Whether the last run's output was delivered to the target channel. */
  lastDelivered?: boolean;
  /** Whether the last failed run's failure notification was delivered to the target channel. */
  lastFailureNotificationDelivered?: boolean;
  /** Delivery outcome for the last failed run's failure notification. */
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus;
  /** Delivery-specific error for the last failed run's failure notification. */
  lastFailureNotificationDeliveryError?: string;
};
type CronTrigger = {
  script: string;
  once?: boolean;
};
/** Public cron job contract with spec fields and mutable run state. */
type CronJob = CronJobBase<CronSchedule, CronSessionTarget, CronWakeMode, CronPayload, CronDelivery, CronFailureAlert | false> & {
  declarationKey?: string;
  displayName?: string;
  owner?: {
    agentId?: string;
    sessionKey?: string;
    /** Authenticated account that created this scheduled authority envelope. */
    accountId?: string;
  };
  /** Server-authored provenance for requester-scoped scheduled tool authority. */
  scheduledToolPolicy?: CronScheduledToolPolicy;
  trigger?: CronTrigger;
  state: CronJobState;
};
/** Store-only proof omitted from public Gateway results and the CronJob wire/type contract. */
type CronToolsAllowProvenance = {
  version: 1;
  source: "final-executable-surface";
  /** Store-private creator origin; missing legacy facts normalize to unknown. */
  callerOrigin?: CronScheduledToolCallerOrigin;
};
/** Persisted row shape; public Gateway and wire contracts use CronJob. */
type CronStoredJob = CronJob & {
  /** Immutable creator provenance stamped by the trusted cron creation seam. */
  createdActor?: SessionCreatedActor;
  toolsAllowProvenance?: CronToolsAllowProvenance;
  /** Runtime-private authority omitted from public Gateway and wire contracts. */
  runtimeAuthority?: CronRuntimeAuthority;
  /** Authority was explicitly cleared and must be reauthorized before app reuse. */
  runtimeAuthorityRecoveryRequired?: true;
};
/** Versioned cron store file shape. */
type CronStoreFile = {
  version: 1;
  jobs: CronStoredJob[];
};
type CronJobStateInput = Partial<Omit<CronJobState, "autoDisabled" | "scheduleActivatedAtMs" | "streamSourceIdentity">>;
/** Create input accepted by cron APIs before id/timestamps/state are assigned. */
type CronJobCreate = Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs" | "state" | "scheduledToolPolicy"> & {
  /** Internal callers can reserve a durable id before creation; public cron.add omits this. */
  id?: string;
  state?: CronJobStateInput;
};
/** Patch input accepted by cron APIs without allowing immutable identity fields. */
type CronJobPatch = Partial<Omit<CronJob, "id" | "createdAtMs" | "state" | "payload" | "delivery" | "failureAlert" | "declarationKey" | "displayName" | "owner" | "scheduledToolPolicy" | "pacing" | "trigger">> & {
  displayName?: string | null;
  pacing?: CronPacing | null;
  trigger?: CronTrigger | null;
  payload?: CronPayloadPatch;
  delivery?: CronDeliveryPatch;
  failureAlert?: CronFailureAlertPatch | false | null;
  state?: CronJobStateInput;
};
//#endregion
//#region src/cron/store.d.ts
type SaveCronStoreOptions = {
  stateOnly?: boolean;
};
/** Resolves the public plugin-SDK cron store path. */
declare function resolveCronStorePath(storePath?: string): string;
/** Plugin-SDK alias for loading the cron store. */
declare function loadCronStore(storePath: string): Promise<CronStoreFile>;
/** Plugin-SDK alias for saving the cron store. */
declare function saveCronStore(storePath: string, store: CronStoreFile, opts?: SaveCronStoreOptions): Promise<void>;
//#endregion
export { CronJobCreate as a, CronRunStatus as c, NormalizeReplySkipReason as d, CronJob as i, CronStoredJob as l, resolveCronStorePath as n, CronJobPatch as o, saveCronStore as r, CronPayload as s, loadCronStore as t, CronToolsAllowProvenance as u };