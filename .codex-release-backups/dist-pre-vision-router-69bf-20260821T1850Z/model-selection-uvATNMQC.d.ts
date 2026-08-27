import { a as ModelCompatConfig, et as MarkdownTableMode, g as Message, h as ImageContent, i as ModelApi, n as OpenClawConfig, nt as SessionMaintenanceMode, s as ModelMediaInputConfig, x as TextContent } from "./types.openclaw-eGZBtvai.js";
import { C as ChannelId, f as HookExternalContentSource, v as CronScheduledToolPolicy } from "./types-kBzibTqd.js";
import { cn as CustomMessage, en as TranscriptEntryAnchor, rn as AgentMessage, sn as BashExecutionMessage } from "./setup-wizard-types-u0truel5.js";
import { D as ModelCatalogStatus } from "./manifest-registry-BzRPksH-.js";
import { DatabaseSync } from "node:sqlite";
//#region src/agents/failover/signal.d.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
declare const FAILOVER_REASONS: readonly ["auth", "auth_permanent", "format", "rate_limit", "overloaded", "billing", "server_error", "timeout", "tls_certificate", "context_overflow", "model_not_found", "session_expired", "empty_response", "no_error_details", "unclassified", "unknown"];
type FailoverReason = (typeof FAILOVER_REASONS)[number];
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "modelRunPruneAfterMs">>;
//#endregion
//#region src/cron/runtime-authority.d.ts
type CronRuntimeAuthority = Readonly<{
  version: 1; /** Concrete harness runtime that alone may consume this opaque authority. */
  runtimeId: string; /** Runtime-owned payload discriminator; core never interprets its value. */
  namespace: string;
  payload: Readonly<Record<string, unknown>>;
}>;
//#endregion
//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string; /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  status: "ready" | "auth-rejected" | "unavailable";
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string; /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi; /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
};
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[]; /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[]; /** Static provider-hook rows captured alongside the full lifecycle generation. */
  staticEntries?: ModelCatalogEntry[];
  /**
   * `false` only when this snapshot came from a degraded load (discovery threw,
   * static or empty fallback). Absent/`true` means authoritative — consumers that
   * destroy durable state (e.g. resetting a pinned model override) must treat only
   * an explicit `false` as degraded, so unrelated hand-built snapshots stay safe.
   */
  authoritative?: boolean;
};
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
  tz?: string; /** Optional deterministic stagger window in milliseconds (0 keeps exact schedule). */
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
  /** Event-driven source whose supervised argv emits payload-triggering lines. */kind: "stream";
  command: string[];
  cwd?: string;
  mode?: "line" | "match"; /** JavaScript regular-expression source, required when mode is "match". */
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
  to?: string; /** Explicit thread/topic id for channels that support threaded delivery. */
  threadId?: string | number; /** Explicit channel account id for multi-account setups (e.g. multiple Telegram bots). */
  accountId?: string;
  bestEffort?: boolean; /** Additional webhook destination used when a job must keep chat delivery. */
  completionDestination?: CronCompletionDestination; /** Separate destination for failure notifications. */
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
  cooldownMs?: number; /** When true, consecutive skipped runs count toward the alert threshold. */
  includeSkipped?: boolean; /** Delivery mode: announce (via messaging channels) or webhook (HTTP POST). */
  mode?: "announce" | "webhook"; /** Account ID for multi-account channel configurations. */
  accountId?: string;
};
/** Partial failure-alert update; null clears an inherited field override. */
type CronFailureAlertPatch = { [K in keyof CronFailureAlert]?: CronFailureAlert[K] | null };
/** Payload variants cron can execute in main-session or detached modes. */
type CronPayload = ({
  kind: "systemEvent";
  text: string;
} & CronPayloadToolAllow) | (CronAgentTurnPayload & CronPayloadToolAllow) | (CronCommandPayload & CronPayloadToolAllow) | (CronScriptPayload & CronPayloadToolAllow) | ({
  kind: "heartbeat";
} & CronPayloadToolAllow);
/** Partial payload update shape used by cron patch/edit flows. */
type CronPayloadPatch = ({
  kind: "systemEvent";
  text?: string;
} & CronPayloadToolAllowPatch) | (CronAgentTurnPayloadPatch & CronPayloadToolAllowPatch) | (CronCommandPayloadPatch & CronPayloadToolAllowPatch) | (CronScriptPayloadPatch & CronPayloadToolAllowPatch) | ({
  kind: "heartbeat";
} & CronPayloadToolAllowPatch);
type CronPayloadToolAllow = {
  /** Restricts agentTurn execution, or the trigger runtime for other payload kinds. */toolsAllow?: string[]; /** Server-managed marker for auto-stamped defaults; explicit restrictions omit it. */
  toolsAllowIsDefault?: boolean;
};
type CronPayloadToolAllowPatch = {
  toolsAllow?: string[] | null;
  toolsAllowIsDefault?: boolean;
};
type CronAgentTurnPayloadFields = {
  message: string; /** Optional model override (provider/model or alias). */
  model?: string; /** Optional per-job fallback models; overrides agent/global fallbacks when defined. */
  fallbacks?: string[];
  thinking?: string;
  timeoutSeconds?: number;
  allowUnsafeExternalContent?: boolean; /** Immutable external hook provenance for async dispatch. */
  externalContentSource?: HookExternalContentSource; /** If true, run with lightweight bootstrap context. */
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
  /** Explicit argv vector to execute. Use a shell wrapper argv for shell syntax. */argv: string[];
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
  scheduleActivatedAtMs?: number; /** Exact startup catch-up slot protected from future-slot repair across restarts. */
  startupCatchupAtMs?: number; /** Exact paced completion slot protected from future-slot repair until consumed. */
  pacedNextRunAtMs?: number; /** Exact recurring slot retained across an out-of-band manual force run. */
  forcePreservedNextRunAtMs?: number; /** Durable pre-admission reservation. Cleared on restart without recording a run. */
  queuedAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number; /** Preferred execution outcome field. */
  lastRunStatus?: CronRunStatus; /** @deprecated Use lastRunStatus. */
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDiagnostics?: CronRunDiagnostics;
  lastDiagnosticSummary?: string; /** Classified reason for the last error (when available). */
  lastErrorReason?: FailoverReason;
  lastDurationMs?: number; /** Number of consecutive execution errors (reset on success). Used for backoff. */
  consecutiveErrors?: number; /** Durable explanation for a scheduler-owned automatic disable transition. */
  autoDisabled?: {
    reason: "consecutive-failures" | "schedule-errors";
    atMs: number;
    consecutiveErrors: number;
  }; /** Number of consecutive skipped executions (reset on success or error). */
  consecutiveSkipped?: number; /** Last failure alert timestamp (ms since epoch) for cooldown gating. */
  lastFailureAlertAtMs?: number; /** Number of consecutive schedule computation errors. Auto-disables job after threshold. */
  scheduleErrorCount?: number; /** Timestamp of the last trigger script evaluation. */
  lastTriggerEvalAtMs?: number; /** Number of completed trigger script evaluations. */
  triggerEvalCount?: number; /** Timestamp of the last trigger evaluation that fired. */
  lastTriggerFireAtMs?: number; /** JSON state returned by the last trigger script evaluation. */
  triggerState?: unknown; /** Current gateway-owned stream source lifecycle state. */
  streamStatus?: "starting" | "running" | "restarting" | "stopped" | "disabled" | "error";
  streamError?: string;
  streamConsecutiveFailures?: number;
  streamRestartExhausted?: boolean;
  streamSourceIdentity?: string;
  streamDroppedBatches?: number;
  streamCoalescedBatches?: number;
  streamLastStartedAtMs?: number;
  streamLastExitAtMs?: number; /** Explicit delivery outcome, separate from execution outcome. */
  lastDeliveryStatus?: CronDeliveryStatus; /** Delivery-specific error text when available. */
  lastDeliveryError?: string; /** Whether the last run's output was delivered to the target channel. */
  lastDelivered?: boolean; /** Whether the last failed run's failure notification was delivered to the target channel. */
  lastFailureNotificationDelivered?: boolean; /** Delivery outcome for the last failed run's failure notification. */
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus; /** Delivery-specific error for the last failed run's failure notification. */
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
    sessionKey?: string; /** Authenticated account that created this scheduled authority envelope. */
    accountId?: string;
  }; /** Server-authored provenance for requester-scoped scheduled tool authority. */
  scheduledToolPolicy?: CronScheduledToolPolicy;
  trigger?: CronTrigger;
  state: CronJobState;
};
/** Store-only proof omitted from public Gateway results and the CronJob wire/type contract. */
type CronToolsAllowProvenance = {
  version: 1;
  source: "final-executable-surface";
};
/** Persisted row shape; public Gateway and wire contracts use CronJob. */
type CronStoredJob = CronJob & {
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Runtime-private authority omitted from public Gateway and wire contracts. */
  runtimeAuthority?: CronRuntimeAuthority; /** Authority was explicitly cleared and must be reauthorized before app reuse. */
  runtimeAuthorityRecoveryRequired?: true;
};
type CronJobStateInput = Partial<Omit<CronJobState, "autoDisabled" | "scheduleActivatedAtMs" | "streamSourceIdentity">>;
/** Create input accepted by cron APIs before id/timestamps/state are assigned. */
type CronJobCreate = Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs" | "state" | "scheduledToolPolicy"> & {
  /** Internal callers can reserve a durable id before creation; public cron.add omits this. */id?: string;
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
//#region src/agents/agent-scope-config.d.ts
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
//#region src/agents/sessions/session-manager-types.d.ts
interface SessionHeader {
  type: "session";
  version?: number;
  id: string;
  timestamp: string;
  cwd: string;
  parentSession?: string;
}
interface NewSessionOptions {
  id?: string;
  parentSession?: string;
}
interface SessionEntryBase {
  type: string;
  id: string;
  parentId: string | null;
  timestamp: string;
  /** This row consumes the raw side cursor instead of the visible leaf. */
  appendMode?: "side";
}
interface SessionMessageEntry extends SessionEntryBase {
  type: "message";
  message: AgentMessage;
}
interface ThinkingLevelChangeEntry extends SessionEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;
}
interface ModelChangeEntry extends SessionEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}
interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  /** Extension-specific data, such as artifact indexes or version markers. */
  details?: T;
  /** True for extension-generated compaction entries. */
  fromHook?: boolean;
}
type ResetReason = "new" | "reset" | "idle" | "daily" | "cron-stale";
interface ResetEntry extends SessionEntryBase {
  type: "reset";
  reason: ResetReason;
  firstKeptEntryId?: string;
}
interface BranchSummaryEntry<T = unknown> extends SessionEntryBase {
  type: "branch_summary";
  fromId: string;
  summary: string;
  /** Extension-specific data that is not sent to the model. */
  details?: T;
  /** True for extension-generated branch summaries. */
  fromHook?: boolean;
}
/** Extension state that is persisted but excluded from model context. */
interface CustomEntry<T = unknown> extends SessionEntryBase {
  type: "custom";
  customType: string;
  data?: T;
}
interface LabelEntry extends SessionEntryBase {
  type: "label";
  targetId: string;
  label: string | undefined;
}
interface SessionInfoEntry extends SessionEntryBase {
  type: "session_info";
  name?: string;
}
/** Extension message that participates in model context. */
interface CustomMessageEntry<T = unknown> extends SessionEntryBase {
  type: "custom_message";
  customType: string;
  content: string | (TextContent | ImageContent)[];
  details?: T;
  display: boolean;
}
type SessionEntry = SessionMessageEntry | ThinkingLevelChangeEntry | ModelChangeEntry | CompactionEntry | ResetEntry | BranchSummaryEntry | CustomEntry | CustomMessageEntry | LabelEntry | SessionInfoEntry;
type FileEntry = SessionHeader | SessionEntry;
type AppendPersistenceOptions = {
  appendIntent?: "active-branch";
  config?: OpenClawConfig;
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked";
  invalidateSerializedPrefixCache?: boolean;
};
interface SessionTreeNode {
  entry: SessionEntry;
  children: SessionTreeNode[];
  label?: string;
  labelTimestamp?: string;
}
interface SessionContext {
  messages: AgentMessage[];
  thinkingLevel: string;
  model: {
    provider: string;
    modelId: string;
  } | null;
}
type PreservedOpaqueFileEntry = {
  index: number;
  record: unknown;
};
type SessionLeafControl = {
  type: "leaf";
  id: string;
  parentId: string | null;
  timestamp: string;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
};
//#endregion
//#region src/agents/sessions/session-manager-codec.d.ts
declare function parseOpaqueLeafEntry(record: unknown): {
  id: string;
  parentId: string | null;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
} | undefined;
//#endregion
//#region src/agents/sessions/session-manager-core.d.ts
type SessionManagerPersistenceTarget = SessionTranscriptRuntimeTarget;
declare class SessionManagerCore {
  migrated: boolean;
  protected sessionId: string;
  protected cwd: string;
  protected fileEntries: FileEntry[];
  protected opaqueFileEntries: PreservedOpaqueFileEntry[];
  protected byId: Map<string, SessionEntry>;
  protected opaqueParentsById: Map<string, string | null>;
  protected logicalParentsById: Map<string, string | null>;
  protected invalidLeafControlIds: Set<string>;
  protected labelsById: Map<string, string>;
  protected labelTimestampsById: Map<string, string>;
  protected leafId: string | null;
  protected appendParentId: string | null;
  protected appendMode: "side" | undefined;
  protected pendingDeliberateAppend: boolean;
  protected persistenceTarget: SessionManagerPersistenceTarget | undefined;
  protected persistenceHeaderPending: boolean;
  constructor(cwd: string, persistenceTarget?: SessionManagerPersistenceTarget, loadedEntries?: FileEntry[]);
  setSessionTarget(target: SessionManagerPersistenceTarget): void;
  protected setLoadedSessionTarget(target: SessionManagerPersistenceTarget | undefined, entries: FileEntry[]): void;
  reloadPersistedTranscript(): void;
  newSession(options?: NewSessionOptions): string | undefined;
  private initializeSession;
  protected resolveOpaqueLeafTargetId(targetId: string | null): string | null;
  protected resolveOpaqueAppendParentId(parentId: string | null): string | null;
  protected resolveOpaqueLeafControl(leafEntry: ReturnType<typeof parseOpaqueLeafEntry>): {
    leafId: string | null;
    appendParentId: string | null;
    appendMode?: "side";
  } | undefined;
  protected buildIndex(): void;
  protected resolveCanonicalParentId(parentId: string | null): string | null;
  protected normalizeEntryParent(entry: SessionEntry): SessionEntry;
  private findFirstCanonicalDescendantOnBranch;
  private findFirstCanonicalDescendant;
  protected resolveBranchTargetId(branchFromId: string): string | null | undefined;
  protected clampOpaqueFileEntryIndexes(): void;
  protected createLeafControl(parentId: string | null, appendParentId?: string | null, appendMode?: "side"): SessionLeafControl;
  protected rememberLeafControl(leafEntry: SessionLeafControl): void;
  getAppendParentId(): string | null;
  getAppendMode(): "side" | undefined;
  protected getPersistedFileEntries(leafAppendParentId?: string | null, leafAppendMode?: "side"): unknown[];
  getPersistedEntries(): unknown[];
  clearPreservedOpaqueFileEntries(): void;
  protected replacePersistedTranscript(options?: {
    leafAppendParentId?: string | null;
    leafAppendMode?: "side";
  }): void;
  /** SQLite appends are synchronous; retained for the AgentSession contract. */
  protected flushPendingPersistence(): void;
  isPersisted(): boolean;
  getCwd(): string;
  getSessionId(): string;
  getSessionTarget(): SessionManagerPersistenceTarget | undefined;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence.d.ts
type PersistRecordResult = string | null | undefined | {
  anchor?: TranscriptEntryAnchor;
  adoptedMessageId?: string;
  effectiveParentId: string | null;
};
declare class SessionManagerPersistence extends SessionManagerCore {
  removeTrailingEntries(predicate: (entry: SessionEntry) => boolean, options?: {
    preserveTrailing?: (entry: SessionEntry) => boolean;
  }): number;
  protected persistRecord(entry: unknown, options?: AppendPersistenceOptions): PersistRecordResult;
  persist(entry: SessionEntry, options?: AppendPersistenceOptions): PersistRecordResult;
  private persistSqliteRecord;
}
//#endregion
//#region src/agents/sessions/session-manager-entries.d.ts
declare class SessionManagerEntries extends SessionManagerPersistence {
  protected appendEntry(entry: SessionEntry, options?: AppendPersistenceOptions): TranscriptEntryAnchor | undefined;
  private resolveCurrentKeyedUserId;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendMessageWithTranscriptAnchor(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): {
    entryId: string;
    anchor?: TranscriptEntryAnchor;
  };
  appendThinkingLevelChange(thinkingLevel: string): string;
  appendModelChange(provider: string, modelId: string): string;
  appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): string;
  appendResetBoundary(reason: ResetReason, firstKeptEntryId?: string): string;
  appendCustomEntry(customType: string, data?: unknown): string;
  appendSessionInfo(name: string): string;
  getSessionName(): string | undefined;
  appendCustomMessageEntry(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details?: unknown): string;
  getLeafId(): string | null;
  appendLeafControl(params: {
    targetId: string | null;
    appendParentId: string | null;
    appendMode?: "side";
  }): SessionLeafControl;
  getLeafEntry(): SessionEntry | undefined;
  getEntry(id: string): SessionEntry | undefined;
  getChildren(parentId: string): SessionEntry[];
  getLabel(id: string): string | undefined;
  appendLabelChange(targetId: string, label: string | undefined): string;
  getBranch(fromId?: string): SessionEntry[];
  buildSessionContext(): SessionContext;
  getBoundaryCount(): number;
  getHeader(): SessionHeader | null;
  getEntries(): SessionEntry[];
  getTree(): SessionTreeNode[];
  branch(branchFromId: string): void;
  resetLeaf(): void;
  branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromHook?: boolean): string;
}
//#endregion
//#region src/agents/sessions/session-manager-branching.d.ts
declare class SessionManagerBranching extends SessionManagerEntries {
  private collectBranchedSessionPath;
  createBranchedSession(leafId: string): Promise<string | undefined>;
}
//#endregion
//#region src/agents/sessions/session-manager.d.ts
declare class SessionManager extends SessionManagerBranching {
  private constructor();
  /** Makes pending append-oriented persistence durable without rewriting committed entries. */
  flushPendingPersistence(): void;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendMessageWithTranscriptAnchor(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): {
    entryId: string;
    anchor?: TranscriptEntryAnchor;
  };
  static open(target: SessionTranscriptRuntimeTarget, cwdOverride?: string): SessionManager;
  /** Appends to the current transcript leaf without hydrating its history. */
  static appendMessageToTranscript(target: SessionTranscriptRuntimeTarget, message: Message | CustomMessage | BashExecutionMessage, options?: Pick<AppendPersistenceOptions, "config">): string;
  static inMemory(cwd?: string): SessionManager;
  static fromEntries(entries: readonly unknown[], cwdOverride?: string): SessionManager;
}
//#endregion
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
} | {
  kind: "channel-final-suppressed";
  reason: "stale-foreground";
  sourceMessageId?: string;
};
//#endregion
//#region src/plugin-sdk/session-transcript-memory-hit.d.ts
type SessionTranscriptReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  sessionId: string;
  sessionKey: string;
  storePath?: string;
  threadId?: string | number;
};
//#endregion
//#region src/plugin-sdk/session-transcript-runtime.d.ts
type SessionTranscriptTargetParams = SessionTranscriptReadParams;
//#endregion
//#region src/config/markdown-tables.types.d.ts
/** Parameters for resolving markdown table rendering per config and channel. */
type ResolveMarkdownTableModeParams = {
  cfg?: Partial<OpenClawConfig>;
  channel?: string | null;
  accountId?: string | null;
  supportsBlockTables?: boolean;
};
type ResolveMarkdownTableMode = (params: ResolveMarkdownTableModeParams) => MarkdownTableMode;
//#endregion
export { CronRuntimeAuthority as _, resolveAgentDir as a, CronJobCreate as c, CronRunStatus as d, CronStoredJob as f, ProviderCatalogOutcome as g, ModelCatalogSnapshot as h, SessionManager as i, CronJobPatch as l, ModelCatalogEntry as m, SessionTranscriptTargetParams as n, resolveAgentWorkspaceDir as o, CronToolsAllowProvenance as p, SessionTranscriptDeliveryMirror as r, CronJob as s, ResolveMarkdownTableMode as t, CronPayload as u, ResolvedSessionMaintenanceConfigInput as v, FailoverReason as y };