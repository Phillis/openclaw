import { X as ReplyToMode, Z as SessionMaintenanceMode, n as OpenClawConfig, ut as SilentReplyConversationType } from "./types.openclaw-DhIzMzKO.js";
import { m as Message, p as ImageContent, v as TextContent } from "./types.models-i3fcfEfL.js";
import { s as PluginHookReplyPayloadSendingContext, w as ReplyDispatchKind } from "./subagent-requester-context-DOs0m3He.js";
import { S as ChannelDeliveryCapabilities, T as OutboundDeliveryFormattingOptions, _n as BashExecutionMessage, an as MessagePresentation, dt as RenderedMessageBatchPlanItem, et as OutboundDeliveryResult, gt as OutboundSendDeps, in as LegacyInteractiveReply, mt as OutboundMediaAccess, nt as OutboundPayloadDeliverySuppressionReason, pn as AgentMessage, rn as ReplyPayload$1, sn as ReplyPayloadDelivery, tt as OutboundPayloadDeliveryOutcome, un as TranscriptEntryAnchor, vn as CustomMessage, w as OutboundIdentity } from "./types.adapters-BxgsWXLj.js";
import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-CIroieCz.js";
import { DatabaseSync } from "node:sqlite";
import { ImageMetadata } from "rastermill";

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
//#region packages/retry/src/index.d.ts
type RetryConfig = {
  attempts?: number;
  minDelayMs?: number;
  maxDelayMs?: number; /** Fractional symmetric spread or full jitter. */
  jitter?: number | "full";
};
type RetryDelayContext = {
  attempt: number;
  maxAttempts: number;
  err: unknown;
  label?: string;
};
type RetryInfo = RetryDelayContext & {
  delayMs: number;
};
type RetryOptions = RetryConfig & {
  label?: string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
  retryAfterMaxDelayMs?: number;
  delayMs?: number | ((context: RetryDelayContext) => number);
  onRetry?: (info: RetryInfo) => unknown;
  random?: () => number;
  sleep?: (ms: number) => Promise<void>;
};
//#endregion
//#region src/media/store.d.ts
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
declare function extractOriginalFilename(filePath: string): string;
/** Media-store file metadata returned after bytes are persisted under a safe media ID. */
type SavedMedia = {
  id: string;
  path: string;
  size: number;
  contentType?: string;
};
/** Saves an in-memory media buffer under a UUID-backed media ID. */
declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
//#endregion
//#region src/media/fetch.d.ts
/** Remote media bytes plus metadata before they are persisted to the media store. */
type FetchMediaResult = {
  buffer: Buffer;
  contentType?: string;
  fileName?: string;
};
/** Saved media record enriched with the best remote filename candidate. */
type SavedRemoteMedia = SavedMedia & {
  fileName?: string;
};
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
type MediaFetchRetryOptions = RetryOptions;
/** Fetch-compatible injection point used by tests and guarded network callers. */
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
type FetchDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
  lookupFn?: LookupFn;
};
type FetchMediaOptions = {
  url: string;
  fetchImpl?: FetchLike;
  requestInit?: RequestInit;
  filePathHint?: string;
  maxBytes?: number;
  maxRedirects?: number; /** Abort the complete guarded fetch and body operation after this deadline (ms). */
  timeoutMs?: number; /** Abort if final response headers have not arrived by this deadline (ms). */
  responseHeaderTimeoutMs?: number; /** Abort if the response body stops yielding data for this long (ms). */
  readIdleTimeoutMs?: number;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  dispatcherAttempts?: FetchDispatcherAttempt[];
  shouldRetryFetchError?: (error: unknown) => boolean;
  /**
   * Retries the complete guarded fetch/read-or-save operation. Dispatcher
   * attempts still run inside each retry attempt.
   */
  retry?: MediaFetchRetryOptions;
  /**
   * Allow an operator-configured explicit proxy to resolve target DNS after
   * hostname-policy checks instead of forcing local pinned-DNS first.
   */
  trustExplicitProxyDns?: boolean;
};
/** Options for validating and saving an existing Response body into the media store. */
type SaveResponseMediaOptions = {
  sourceUrl?: string;
  filePathHint?: string;
  maxBytes?: number;
  readIdleTimeoutMs?: number;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Options for guarded URL fetches that are saved directly into the media store. */
type SaveRemoteMediaOptions = FetchMediaOptions & {
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
//#endregion
//#region src/infra/delivery-queue-sqlite.types.d.ts
type DeliveryQueueCompletionRetention = "permanent" | Readonly<{
  idPrefix: string;
  maxAgeMs: number;
  maxEntries: number;
}>;
//#endregion
//#region src/infra/outbound/delivery-completion.d.ts
/** Serializable owner callback for a durable queue entry. */
type DurableDeliveryCompletion = {
  kind: "conversation";
  agentId: string;
  operationId: string;
  storePath?: string;
} | {
  kind: "pending-final";
  deliveryId: string;
  intentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
};
//#endregion
//#region src/infra/outbound/mirror.d.ts
/**
 * Transcript append data emitted after an outbound send completes.
 */
type OutboundMirror = {
  sessionKey: string;
  agentId?: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
  expectedSessionId?: string;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
};
/**
 * Delivery-layer mirror data with optional group/channel correlation metadata.
 */
type DeliveryMirror = OutboundMirror & {
  /** Whether this message is being sent in a group/channel context */isGroup?: boolean; /** Group or channel identifier for correlation with received events */
  groupId?: string;
};
//#endregion
//#region src/infra/outbound/prepared-batch.d.ts
declare const PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION: 1;
type PreparedOutboundAcceptedEntry = {
  sourceIndex: number;
  status: "accepted";
  payload: ReplyPayload$1;
  replyHookChanged: boolean;
  messageHookChanged: boolean;
  preparedMediaCount: number;
};
type PreparedOutboundSuppressedEntry = {
  sourceIndex: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
};
type PreparedOutboundBatchEntry = PreparedOutboundAcceptedEntry | PreparedOutboundSuppressedEntry;
/** Canonical post-policy payload custody persisted by the durable outbound queue. */
type PreparedOutboundBatch = {
  schemaVersion: typeof PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION;
  sourcePayloadCount: number; /** True only when accepted payloads already passed post-policy channel normalization. */
  channelNormalized?: true;
  runId?: string;
  entries: PreparedOutboundBatchEntry[];
};
//#endregion
//#region src/infra/outbound/session-context.d.ts
type OutboundSessionContext = {
  /**
   * Canonical session key used for internal hook dispatch.
   *
   * MUST equal the agent runtime's `params.sessionKey` for the run that
   * produced the payload being delivered. Plugins observing both
   * `agent_end`/`llm_input`/`llm_output`/`before_tool_call`/`after_tool_call`
   * and `message_sending`/`message_sent` rely on this equality to correlate
   * per-turn state across the agent-loop and delivery boundaries.
   *
   * Callers populating this field should use the same value the agent runner
   * received as its sessionKey — in the chat path that is
   * `targetSessionKey || ctx.SessionKey` (see
   * `auto-reply/reply/get-reply.ts`). Followup, ACP, command, and cron
   * delivery paths each have their own canonical value to forward; consult
   * the relevant runner.
   */
  key?: string;
  /**
   * Session key used for policy resolution when delivery differs from the
   * control session. Used to look up silent-reply policy, send rate limits,
   * agent-scoped channel preferences, etc., for the chat the reply is being
   * delivered into. May equal `key` when there is no redirect; otherwise
   * `policyKey` describes the *delivery target*'s session while `key`
   * describes the *control session* whose hooks fire.
   */
  policyKey?: string; /** Explicit conversation type for policy resolution when a session key is generic. */
  conversationType?: SilentReplyConversationType;
  /**
   * Caller-declared destination conversation kind for metadata-only audit
   * projection. Never derived from session-key parsing: policy keys can name
   * an acted-on session that is not the delivery destination, and a wrong
   * "direct" here over-collects under audit.messages="direct".
   */
  conversationKind?: "direct" | "group" | "channel"; /** Active agent id used for workspace-scoped media roots. */
  agentId?: string; /** Originating account id used for requester-scoped group policy resolution. */
  requesterAccountId?: string; /** Originating sender id used for sender-scoped outbound media policy. */
  requesterSenderId?: string; /** Originating sender display name for name-keyed sender policy matching. */
  requesterSenderName?: string; /** Originating sender username for username-keyed sender policy matching. */
  requesterSenderUsername?: string; /** Originating sender E.164 phone number for e164-keyed sender policy matching. */
  requesterSenderE164?: string;
};
//#endregion
//#region src/infra/outbound/delivery-queue-types.d.ts
type QueuedRenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
type QueuedReplyPayloadSendingHook = {
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  context: PluginHookReplyPayloadSendingContext;
};
//#endregion
//#region src/infra/outbound/message-sent-hook.d.ts
type MessageSentEvent = {
  success: boolean;
  content: string;
  error?: string;
  messageId?: string;
};
//#endregion
//#region src/plugin-sdk/reply-payload.d.ts
/** Plugin-facing reply payload without core-only trusted local media internals. */
type ReplyPayload = Omit<ReplyPayload$1, "trustedLocalMedia">;
/** Normalized outbound reply payload accepted by channel send helpers. */
type OutboundReplyPayload = {
  /** Plain text reply body. */text?: string; /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string; /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  }; /** Ordered media attachments for channels that can send multiple media items. */
  mediaUrls?: string[]; /** Legacy single media attachment. */
  mediaUrl?: string; /** Rich presentation payload for channels that support structured replies. */
  presentation?: ReplyPayload$1["presentation"];
  /**
   * @deprecated Use presentation. Runtime support remains for legacy producers.
   */
  interactive?: ReplyPayload$1["interactive"]; /** Channel-specific opaque data forwarded to outbound adapters. */
  channelData?: ReplyPayload$1["channelData"]; /** Marks media as sensitive for channel-specific spoiler/safety handling. */
  sensitiveMedia?: boolean; /** Platform message id that the outbound reply should target when supported. */
  replyToId?: string; /** Portable geographic location or named place. */
  location?: ReplyPayload$1["location"]; /** Ask supporting channels to render video media as a round video note. */
  videoAsNote?: boolean;
};
/** Send media-first payloads intact, or chunk text-only payloads through the caller's transport hooks. */
declare function sendPayloadWithChunkedTextAndMedia<TContext extends {
  payload: object;
}, TResult>(params: {
  /** Caller context containing the loose outbound payload. */ctx: TContext; /** Text length limit passed to the chunker for text-only payloads. */
  textChunkLimit?: number; /** Optional text chunker used only when no media URLs are present. */
  chunker?: ((text: string, limit: number) => string[]) | null; /** Transport hook for text-only chunks. */
  sendText: (ctx: TContext & {
    text: string;
  }) => Promise<TResult>; /** Transport hook for media sends; first media receives the caption text. */
  sendMedia: (ctx: TContext & {
    text: string;
    mediaUrl: string;
  }) => Promise<TResult>; /** Result returned when payload has neither text nor media. */
  emptyResult: TResult; /** Host callback that persists each completed sub-send before the next one starts. */
  onResult?: (result: TResult) => Promise<void> | void;
}): Promise<TResult>;
/** Detect numeric-looking target ids for channels that distinguish ids from handles. */
declare function isNumericTargetId(raw: string): boolean;
/** Deliver media with leading caption when possible, otherwise fall back to chunked text. */
declare function deliverTextOrMediaReply(params: {
  payload: OutboundReplyPayload;
  text: string;
  chunkText?: (text: string) => readonly string[];
  sendText: (text: string) => Promise<void>;
  sendMedia: (payload: {
    mediaUrl: string;
    caption?: string;
  }) => Promise<void>;
  onMediaError?: (params: {
    error: unknown;
    mediaUrl: string;
    caption?: string;
    index: number;
    isFirst: boolean;
  }) => Promise<void> | void;
}): Promise<"empty" | "text" | "media">;
//#endregion
//#region src/infra/outbound/payloads.d.ts
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
type NormalizedOutboundPayload = {
  text: string;
  mediaUrls: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload$1["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload$1["location"]; /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
  hookContent?: string;
};
//#endregion
//#region src/infra/outbound/deliver-contracts.d.ts
type OutboundDeliveryQueuePolicy = "required" | "best_effort";
type OutboundDeliveryIntent = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  queuePolicy: OutboundDeliveryQueuePolicy;
};
type DurableFinalDeliveryRequirement = keyof NonNullable<ChannelDeliveryCapabilities["durableFinal"]>;
type DurableFinalDeliveryRequirements = Partial<Record<DurableFinalDeliveryRequirement, boolean>>;
type PlatformSendRoute = {
  replyToId?: string | null;
  threadId?: string | number | null;
};
type DeliverOutboundPayloadsCoreParams = {
  cfg: OpenClawConfig;
  channel: string;
  to: string;
  accountId?: string;
  payloads: ReplyPayload$1[]; /** @internal Canonical post-policy batch used by queue recovery and physical delivery. */
  preparedBatch?: PreparedOutboundBatch;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  mediaAccess?: OutboundMediaAccess;
  gifPlayback?: boolean;
  forceDocument?: boolean;
  replyPayloadSendingHook?: QueuedReplyPayloadSendingHook;
  abortSignal?: AbortSignal;
  bestEffort?: boolean;
  onError?: (err: unknown, payload: NormalizedOutboundPayload) => void;
  onPayload?: (payload: NormalizedOutboundPayload) => void; /** @internal Reports the effective payload only after an identified platform send. */
  onDeliveredPayload?: (payload: NormalizedOutboundPayload) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void; /** @internal Runs after each identified platform result, before further fallible work. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void; /** @internal Reports a settled native payload for post-terminal message_sent observation. */
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void; /** @internal Persists ambiguous-send state immediately before platform I/O. */
  onPlatformSendStart?: (route: PlatformSendRoute) => Promise<void>; /** @internal Opaque durable intent id forwarded to provider reconciliation hooks. */
  deliveryQueueId?: string; /** @internal Stable producer id used to make queue creation idempotent across crashes. */
  deliveryIntentId?: string; /** @internal Retain the completed receipt for a producer-owned replayable intent. */
  completionRetention?: DeliveryQueueCompletionRetention; /** @internal Producer-specific durable recovery attempt budget. */
  maxRetries?: number; /** @internal Retry this producer's pending intent only when no platform send began. */
  reusePendingDeliveryIntent?: boolean; /** @internal Serializable owner state finalized after live or recovered delivery. */
  deliveryCompletion?: DurableDeliveryCompletion; /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string; /** @internal Recheck the concrete post-hook send shape before platform I/O. */
  requiredUnknownSendReconciliation?: boolean; /** @internal Caller preflight explicitly required provider unknown-send reconciliation. */
  requireUnknownSendReconciliation?: boolean; /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>; /** Session/agent context used for hooks and media local-root scoping. */
  session?: OutboundSessionContext;
  mirror?: DeliveryMirror;
  silent?: boolean;
  gatewayClientScopes?: readonly string[];
  conversationReadOrigin?: "delegated" | "direct-operator";
};
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
type DeliverOutboundPayloadsParams = DeliverOutboundPayloadsCoreParams & {
  /** @internal Skip write-ahead queue (used by crash-recovery to avoid re-enqueueing). */skipQueue?: boolean; /** @internal Fence recovery ownership at the same provider boundary as live sends. */
  deliveryProducerClaimId?: string; /** @internal Keep the exact live producer claim alive during platform preparation. */
  deliveryProducerLeaseRequired?: boolean; /** @internal Recovery already ran provider admission after its pending-row re-read. */
  deferredDeliveryAdmissionPassed?: true; /** @internal State directory that owns the existing recovery queue entry. */
  deliveryQueueStateDir?: string; /** @internal Let recovery run commit hooks after it has acked the recovered queue entry. */
  deferCommitHooks?: boolean;
  queuePolicy?: OutboundDeliveryQueuePolicy;
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  onDeliveryIntent?: (intent: OutboundDeliveryIntent) => void;
};
//#endregion
//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
//#endregion
export { RetryConfig as _, OutboundDeliveryQueuePolicy as a, deliverTextOrMediaReply as c, fetchRemoteMedia as d, readRemoteMediaBuffer as f, saveMediaBuffer as g, extractOriginalFilename as h, DurableFinalDeliveryRequirements as i, isNumericTargetId as l, saveResponseMedia as m, resizeToJpeg as n, OutboundReplyPayload as o, saveRemoteMedia as p, DeliverOutboundPayloadsParams as r, ReplyPayload as s, getImageMetadata as t, sendPayloadWithChunkedTextAndMedia as u, SessionManager as v, ResolvedSessionMaintenanceConfigInput as y };