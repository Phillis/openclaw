import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import { T as SessionMaintenanceMode } from "./types.base-nhGY37Gp.js";
import { c as Message, m as TextContent, o as ImageContent } from "./types-CL_qQaPo.js";
import "./index-BSAlQ8TI.js";
import { a as BashExecutionMessage, o as CustomMessage, t as AgentMessage } from "./types-CPd3N9Q-.js";
import { _ as DeliveryContext, i as InternalSessionEntry, r as GroupKeyResolution, v as ChannelRouteRef } from "./types-CNsppBy_.js";
import { s as MsgContext, x as TranscriptEntryAnchor } from "./templating-tHzj-d8O.js";
import { DatabaseSync } from "node:sqlite";
import "kysely";
//#region src/config/sessions/store-maintenance.d.ts
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  archiveDashboardAfterMs: number | null;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  preserveRecentMs?: number | null;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
/** Raw transcript record for non-message events; message records use appendTranscriptMessage. */
type TranscriptEvent = unknown;
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-contract.d.ts
type SessionAccessScope = {
  agentId?: string;
  clone?: boolean;
  /** Fixed-store ownership is explicit; omitted values use the storage resolver's legacy-main contract. */
  defaultAgentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  readConsistency?: "latest";
  sessionKey: string;
  storePath?: string;
};
type SessionTranscriptAccessScope = Omit<SessionAccessScope, "sessionKey"> & {
  sessionFile?: string;
  sessionId: string;
  sessionKey?: string;
  threadId?: string | number;
};
type TranscriptEventAppendOptions = {
  appendIntent?: "active-branch";
  /** Synchronous authority check run inside the append transaction. */
  beforeCommitInTransaction?: () => void;
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry.d.ts
/** Forks one parent SQLite transcript into a new child transcript. */
declare function recordInboundSessionMeta(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
}): Promise<InternalSessionEntry | null>;
/** Updates last-route/delivery metadata without refreshing activity timestamps. */
declare function updateSessionLastRoute(params: {
  storePath: string;
  sessionKey: string;
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
  route?: ChannelRouteRef;
  deliveryContext?: DeliveryContext;
  ctx?: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  assertCommitAllowed?: () => void;
}): Promise<InternalSessionEntry | null>;
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write.d.ts
/** Appends one raw transcript event to the additive SQLite transcript store. */
declare function appendTranscriptEvent(scope: SessionTranscriptAccessScope, event: TranscriptEvent, options?: TranscriptEventAppendOptions): Promise<void>;
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
type SessionManagerBoundedContextLimits = {
  maxBytes: number;
  maxEvents: number;
};
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
  protected boundedContextLimits: SessionManagerBoundedContextLimits | undefined;
  protected boundedContextIncomplete: boolean;
  protected persistedBoundaryCount: number | undefined;
  constructor(cwd: string, persistenceTarget?: SessionManagerPersistenceTarget, loadedEntries?: FileEntry[], boundedContext?: {
    boundaryCount: number;
    limits: SessionManagerBoundedContextLimits;
  });
  setSessionTarget(target: SessionManagerPersistenceTarget): void;
  /** Active-only loads can omit sibling rows even when they fit the context limits. */
  protected ensureCompletePersistedHistory(): void;
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
  static open(target: SessionTranscriptRuntimeTarget, cwdOverride?: string, contextLimits?: SessionManagerBoundedContextLimits): SessionManager;
  /** Opens only the selected model-context tail while preserving the complete durable transcript. */
  static openBounded(target: SessionTranscriptRuntimeTarget, options: SessionManagerBoundedContextLimits & {
    cwd?: string;
  }): SessionManager;
  /** Appends to the current transcript leaf without hydrating its history. */
  static appendMessageToTranscript(target: SessionTranscriptRuntimeTarget, message: Message | CustomMessage | BashExecutionMessage, options?: Pick<AppendPersistenceOptions, "config">): string;
  static inMemory(cwd?: string): SessionManager;
  static fromEntries(entries: readonly unknown[], cwdOverride?: string): SessionManager;
}
type ReadonlySessionManager = Pick<SessionManager, "getCwd" | "getSessionId" | "getSessionTarget" | "getLeafId" | "getAppendParentId" | "getAppendMode" | "getLeafEntry" | "getEntry" | "getLabel" | "getBranch" | "getHeader" | "getEntries" | "getTree" | "getSessionName">;
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
type SessionRecentConversationText = {
  id?: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
  sourceChannel?: string;
};
type ReadRecentSessionConversationTextOptions = {
  beforeTimestampMs?: number;
  limit?: number;
  minTimestampMs?: number;
  role?: "user" | "assistant";
  preferUpstreamUserText?: boolean;
};
type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
  agentId: string;
  sessionKey: string;
  storePath?: string;
};
declare function readRecentUserAssistantTextForSession(params: ReadRecentSessionConversationTextParams): Promise<SessionRecentConversationText[]>;
//#endregion
export { SessionManager as a, updateSessionLastRoute as c, ReadonlySessionManager as i, ResolvedSessionMaintenanceConfigInput as l, SessionTranscriptDeliveryMirror as n, appendTranscriptEvent as o, readRecentUserAssistantTextForSession as r, recordInboundSessionMeta as s, SessionRecentConversationText as t };