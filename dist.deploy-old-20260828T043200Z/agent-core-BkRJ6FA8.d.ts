import { A as Transport, C as ThinkingBudgets, S as TextContent, _ as SimpleStreamOptions, a as AssistantMessageEventStreamContract, c as Context, d as Model, i as AssistantMessageEvent, j as Usage, l as ImageContent, n as Api, r as AssistantMessage, s as CompleteSimpleFn, u as Message, v as StopReason, y as StreamFn } from "./types-DTWCh4Mv.js";
import "./index-DspOpKBe.js";
import { S as ToolExecutionMode, a as AgentEvent, b as StreamFn$1, c as AgentMessage, g as BeforeToolCallResult, h as BeforeToolCallContext, i as AgentContext, l as AgentState, m as BashExecutionMessage, n as AfterToolCallResult, o as AgentLoopConfig, r as AfterToolOutcomeContext, s as AgentLoopTurnUpdate, t as AfterToolCallContext, v as PrepareNextTurnContext, x as ThinkingLevel, y as QueueMode } from "./types-aADBdueZ.js";
import { t as Result } from "./result-VHVNeWs6.js";
import "./types-Cc0P-Eyx.js";
import "@openclaw/ai/validation";
//#region packages/agent-core/src/runtime-deps.d.ts
/** Runtime functions injected by host packages so agent-core stays provider-agnostic. */
interface AgentCoreRuntimeDeps {
  /** Streaming completion implementation used for normal agent turns. */
  streamSimple: StreamFn;
  /** Non-streaming completion implementation used by summarization helpers. */
  completeSimple: CompleteSimpleFn;
}
/** Runtime dependency subset required by streaming agent loops. */
type AgentCoreStreamRuntimeDeps = Pick<AgentCoreRuntimeDeps, "streamSimple">;
/** Runtime dependency subset required by summarization helpers. */
type AgentCoreCompletionRuntimeDeps = Pick<AgentCoreRuntimeDeps, "completeSimple">;
//#endregion
//#region packages/agent-core/src/agent.d.ts
/** Options for constructing an {@link Agent}. */
interface AgentOptions {
  /** Initial transcript, tools, model, and prompt state. */
  initialState?: Partial<Omit<AgentState, "pendingToolCalls" | "isStreaming" | "streamingMessage" | "errorMessage">>;
  /** Convert agent-owned transcript messages into provider-facing messages. */
  convertToLlm?: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
  /** Optionally rewrite context before each provider request. */
  transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
  /** Injected stream runtime used when streamFn is not supplied. */
  runtime?: AgentCoreStreamRuntimeDeps;
  /** Explicit stream implementation, preferred over runtime.streamSimple. */
  streamFn?: StreamFn$1;
  /** Resolve provider API keys at request time. */
  getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
  /** Inspect the provider payload before it is sent. */
  onPayload?: SimpleStreamOptions["onPayload"];
  /** Inspect the provider response after it returns. */
  onResponse?: SimpleStreamOptions["onResponse"];
  /** Hook that may short-circuit or alter a tool call before execution. */
  beforeToolCall?: (context: BeforeToolCallContext, signal?: AbortSignal) => Promise<BeforeToolCallResult | undefined>;
  /** Hook that may hydrate a deferred authorized tool call into an executable tool. */
  resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
  /** Hook that may alter a tool result after execution. */
  afterToolCall?: (context: AfterToolCallContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
  /** Hook that may alter any finalized tool outcome, including pre-execution failures. */
  afterToolOutcome?: (context: AfterToolOutcomeContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
  /** Hook that may update model, reasoning, or context after a turn. */
  prepareNextTurn?: (signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  /** Context-aware turn hook. Takes precedence over `prepareNextTurn` when both are provided. */
  prepareNextTurnWithContext?: (context: PrepareNextTurnContext, signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  /** Queue drain mode for steering messages applied before the next unstarted tool or model turn. */
  steeringMode?: QueueMode;
  /** Queue drain mode for follow-up messages injected after the agent would otherwise stop. */
  followUpMode?: QueueMode;
  /** Session identifier forwarded to cache-aware providers. */
  sessionId?: string;
  /** Optional per-thinking-level token budgets forwarded to providers. */
  thinkingBudgets?: ThinkingBudgets;
  /** Preferred provider transport. */
  transport?: Transport;
  /** Optional cap for provider-requested retry delays. */
  maxRetryDelayMs?: number;
  /** Default strategy for executing multiple tool calls in one assistant message. */
  toolExecution?: ToolExecutionMode;
}
/**
 * Stateful wrapper around the low-level agent loop.
 *
 * `Agent` owns the current transcript, emits lifecycle events, executes tools,
 * and exposes queueing APIs for steering and follow-up messages.
 */
declare class Agent$1 {
  private mutableState;
  private readonly listeners;
  private readonly steeringQueue;
  private readonly followUpQueue;
  private readonly toolLoopRecoveryState;
  convertToLlm: (messages: AgentMessage[]) => Message[] | Promise<Message[]>;
  transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
  runtime?: AgentCoreStreamRuntimeDeps;
  streamFn: StreamFn$1;
  getApiKey?: (provider: string) => Promise<string | undefined> | string | undefined;
  onPayload?: SimpleStreamOptions["onPayload"];
  onResponse?: SimpleStreamOptions["onResponse"];
  beforeToolCall?: (context: BeforeToolCallContext, signal?: AbortSignal) => Promise<BeforeToolCallResult | undefined>;
  resolveDeferredTool?: AgentLoopConfig["resolveDeferredTool"];
  afterToolCall?: (context: AfterToolCallContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
  afterToolOutcome?: (context: AfterToolOutcomeContext, signal?: AbortSignal) => Promise<AfterToolCallResult | undefined>;
  prepareNextTurn?: (signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  prepareNextTurnWithContext?: (context: PrepareNextTurnContext, signal?: AbortSignal) => Promise<AgentLoopTurnUpdate | undefined> | AgentLoopTurnUpdate | undefined;
  private activeRun?;
  /** Session identifier forwarded to providers for cache-aware backends. */
  sessionId?: string;
  /** Optional per-level thinking token budgets forwarded to the stream function. */
  thinkingBudgets?: ThinkingBudgets;
  /** Preferred transport forwarded to the stream function. */
  transport: Transport;
  /** Optional cap for provider-requested retry delays. */
  maxRetryDelayMs?: number;
  /** Tool execution strategy for assistant messages that contain multiple tool calls. */
  toolExecution: ToolExecutionMode;
  constructor(options?: AgentOptions);
  /**
   * Subscribe to agent lifecycle events.
   *
   * Listener promises are awaited in subscription order and are included in
   * the current run's settlement. Listeners also receive the active abort
   * signal for the current run.
   *
   * `agent_end` is the final emitted event for a run, but the agent does not
   * become idle until all awaited listeners for that event have settled.
   */
  subscribe(listener: (event: AgentEvent, signal: AbortSignal) => Promise<void> | void): () => void;
  /**
   * Current agent state.
   *
   * Assigning `state.tools` or `state.messages` copies the provided top-level array.
   */
  get state(): AgentState;
  /** Controls how queued steering messages are drained. */
  set steeringMode(mode: QueueMode);
  get steeringMode(): QueueMode;
  /** Controls how queued follow-up messages are drained. */
  set followUpMode(mode: QueueMode);
  get followUpMode(): QueueMode;
  /**
   * Queue a message for the active run. Running tools finish, while sequential
   * tail calls or a parallel batch that has not launched yet are skipped.
   */
  steer(message: AgentMessage): void;
  /** Queue a message to run only after the agent would otherwise stop. */
  followUp(message: AgentMessage): void;
  /** Remove all queued steering messages. */
  clearSteeringQueue(): void;
  /** Remove all queued follow-up messages. */
  clearFollowUpQueue(): void;
  /** Remove all queued steering and follow-up messages. */
  clearAllQueues(): void;
  /** Returns true when either queue still contains pending messages. */
  hasQueuedMessages(): boolean;
  /** Active abort signal for the current run, if any. */
  get signal(): AbortSignal | undefined;
  /** Abort the current run, if one is active. */
  abort(reason?: unknown): void;
  /**
   * Resolve when the current run and all awaited event listeners have finished.
   *
   * This resolves after `agent_end` listeners settle.
   */
  waitForIdle(): Promise<void>;
  /** Clear transcript state, runtime state, and queued messages. */
  reset(): void;
  /** Start a new prompt from text, a single message, or a batch of messages. */
  prompt(message: AgentMessage | AgentMessage[]): Promise<void>;
  prompt(input: string, images?: ImageContent[]): Promise<void>;
  /** Continue from the current transcript. The last message must be a user or tool-result message. */
  continue(): Promise<void>;
  private normalizePromptInput;
  private runPromptMessages;
  private runContinuation;
  private createContextSnapshot;
  private createLoopConfig;
  private runWithLifecycle;
  private handleRunFailure;
  private finishRun;
  /**
   * Reduce internal state for a loop event, then await listeners.
   *
   * `agent_end` only means no further loop events will be emitted. The run is
   * considered idle later, after all awaited listeners for `agent_end` finish
   * and `finishRun()` clears runtime-owned state.
   */
  private processEvents;
}
//#endregion
//#region packages/agent-core/src/agent-loop.d.ts
/** Callback used by synchronous loop runners to publish agent lifecycle events. */
type AgentEventSink = (event: AgentEvent) => Promise<void> | void;
/** Run a prompt-started loop and emit events through a caller-owned sink. */
declare function runAgentLoop(prompts: AgentMessage[], context: AgentContext, config: AgentLoopConfig, emit: AgentEventSink, signal?: AbortSignal, streamFn?: StreamFn$1, runtime?: AgentCoreStreamRuntimeDeps): Promise<AgentMessage[]>;
//#endregion
//#region packages/agent-core/src/harness/messages.d.ts
declare const COMPACTION_SUMMARY_PREFIX = "The conversation history before this point was compacted into the following summary:\n\n<summary>\n";
declare const COMPACTION_SUMMARY_SUFFIX = "\n</summary>";
declare const BRANCH_SUMMARY_PREFIX = "The following is a summary of a branch that this conversation came back from:\n\n<summary>\n";
declare const BRANCH_SUMMARY_SUFFIX = "</summary>";
/** Render a shell execution record as user-visible context text for the model. */
declare function bashExecutionToText(msg: BashExecutionMessage): string;
//#endregion
//#region packages/agent-core/src/harness/types.d.ts
type CompactionErrorCode = "aborted" | "summarization_failed" | "invalid_session" | "unknown";
declare class CompactionError extends Error {
  code: CompactionErrorCode;
  constructor(code: CompactionErrorCode, message: string, cause?: Error);
}
type BranchSummaryErrorCode = "aborted" | "summarization_failed" | "invalid_session";
declare class BranchSummaryError extends Error {
  code: BranchSummaryErrorCode;
  constructor(code: BranchSummaryErrorCode, message: string, cause?: Error);
}
interface SessionTreeEntryBase {
  type: string;
  id: string;
  parentId: string | null;
  timestamp: string;
  appendMode?: "side";
}
interface MessageEntry extends SessionTreeEntryBase {
  type: "message";
  message: AgentMessage;
}
interface ThinkingLevelChangeEntry extends SessionTreeEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;
}
interface ModelChangeEntry extends SessionTreeEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}
interface CompactionEntry<T = unknown> extends SessionTreeEntryBase {
  type: "compaction";
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  details?: T;
  fromHook?: boolean;
}
type ResetReason = "new" | "reset" | "idle" | "daily" | "cron-stale";
interface ResetEntry extends SessionTreeEntryBase {
  type: "reset";
  reason: ResetReason;
  firstKeptEntryId?: string;
}
interface BranchSummaryEntry<T = unknown> extends SessionTreeEntryBase {
  type: "branch_summary";
  fromId: string;
  summary: string;
  details?: T;
  fromHook?: boolean;
}
interface CustomEntry<T = unknown> extends SessionTreeEntryBase {
  type: "custom";
  customType: string;
  data?: T;
}
interface CustomMessageEntry<T = unknown> extends SessionTreeEntryBase {
  type: "custom_message";
  customType: string;
  content: string | (TextContent | ImageContent)[];
  details?: T;
  display: boolean;
}
interface LabelEntry extends SessionTreeEntryBase {
  type: "label";
  targetId: string;
  label: string | undefined;
}
interface SessionInfoEntry extends SessionTreeEntryBase {
  type: "session_info";
  name?: string;
}
interface LeafEntry extends SessionTreeEntryBase {
  type: "leaf";
  targetId: string | null;
  appendParentId?: string | null;
}
type SessionTreeEntry = MessageEntry | ThinkingLevelChangeEntry | ModelChangeEntry | CompactionEntry | ResetEntry | BranchSummaryEntry | CustomEntry | CustomMessageEntry | LabelEntry | SessionInfoEntry | LeafEntry;
interface SessionContext {
  messages: AgentMessage[];
  thinkingLevel: string;
  model: {
    provider: string;
    modelId: string;
  } | null;
}
interface FileOperations {
  read: Set<string>;
  written: Set<string>;
  edited: Set<string>;
}
interface BranchSummaryResult {
  summary: string;
  readFiles: string[];
  modifiedFiles: string[];
}
//#endregion
//#region packages/agent-core/src/harness/session/session.d.ts
/** Build model context from an ordered session branch and its latest state markers. */
declare function buildSessionContext(pathEntries: SessionTreeEntry[]): SessionContext;
//#endregion
//#region packages/agent-core/src/harness/session/uuid.d.ts
/** Generate a monotonic UUIDv7 string. */
declare function uuidv7(): string;
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.d.ts
/** Serialize LLM messages to plain text for summarization prompts. */
declare function serializeConversation(messages: Message[]): string;
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.d.ts
/** File-operation details stored on generated branch summary entries. */
interface BranchSummaryDetails {
  /** Files read while exploring the summarized branch. */
  readFiles: string[];
  /** Files modified while exploring the summarized branch. */
  modifiedFiles: string[];
}
/** Prepared branch content for summarization. */
interface BranchPreparation {
  /** Messages selected for the branch summary. */
  messages: AgentMessage[];
  /** File operations extracted from the branch. */
  fileOps: FileOperations;
  /** Estimated token count for selected messages. */
  totalTokens: number;
}
/** Minimal tree entry shape needed to compare two session branches. */
interface BranchPathEntry {
  /** Stable entry id. */
  id: string;
  /** Parent entry id, or null for the session root. */
  parentId: string | null;
}
/** Branch entries selected after comparing old and target paths. */
interface CollectBranchPathEntriesResult<TEntry extends BranchPathEntry> {
  /** Entries to summarize in chronological order. */
  entries: TEntry[];
  /** Deepest common ancestor between the previous leaf and target entry. */
  commonAncestorId: string | null;
}
/** Options for generating a branch summary. */
interface GenerateBranchSummaryOptions {
  /** Model used for summarization. */
  model: Model;
  /** API key forwarded to the provider. */
  apiKey: string;
  /** Optional request headers forwarded to the provider. */
  headers?: Record<string, string>;
  /** Abort signal for the summarization request. */
  signal: AbortSignal;
  /** Runtime used to complete the summarization request. */
  runtime?: AgentCoreCompletionRuntimeDeps;
  /** Optional stream implementation used instead of the runtime complete function. */
  streamFn?: StreamFn;
  /** Optional instructions appended to or replacing the default prompt. */
  customInstructions?: string;
  /** Replace the default prompt with custom instructions instead of appending them. */
  replaceInstructions?: boolean;
  /** Tokens reserved for prompt and model output. Defaults to 16384. */
  reserveTokens?: number;
}
/** Collect entries that should be summarized before navigating to a different session tree entry. */
declare function collectEntriesForBranchSummaryFromBranches<TEntry extends BranchPathEntry>(oldBranch: readonly TEntry[], targetBranch: readonly TEntry[]): CollectBranchPathEntriesResult<TEntry>;
/** Prepare branch entries for summarization within an optional token budget. */
declare function prepareBranchEntries(entries: SessionTreeEntry[], tokenBudget?: number): BranchPreparation;
/** Generate a summary for abandoned branch entries. */
declare function generateBranchSummary(entries: SessionTreeEntry[], options: GenerateBranchSummaryOptions): Promise<Result<BranchSummaryResult, BranchSummaryError>>;
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.d.ts
/** File-operation details stored on generated compaction entries. */
interface CompactionDetails {
  /** Files read in the compacted history. */
  readFiles: string[];
  /** Files modified in the compacted history. */
  modifiedFiles: string[];
}
/** Generated compaction data ready to be persisted as a compaction entry. */
interface CompactionResult<T = unknown> {
  /** Summary text that replaces compacted history in future context. */
  summary: string;
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Optional implementation-specific details stored with the compaction entry. */
  details?: T;
}
/** Compaction thresholds and retention settings. */
interface CompactionSettings {
  /** Enable automatic compaction decisions. */
  enabled: boolean;
  /** Tokens reserved for summary prompt and output. */
  reserveTokens: number;
  /** Approximate recent-context tokens to keep after compaction. */
  keepRecentTokens: number;
}
/** Default compaction settings used by the harness. */
declare const DEFAULT_COMPACTION_SETTINGS: CompactionSettings;
/** Calculate total context tokens from provider usage. */
declare function calculateContextTokens(usage: Usage): number;
/** Return usage from the last valid assistant message in session entries. */
declare function getLastAssistantUsage(entries: SessionTreeEntry[]): Usage | undefined;
/** Estimated context-token usage for a message list. */
interface ContextUsageEstimate {
  /** Estimated total context tokens. */
  tokens: number;
  /** Tokens reported by the most recent assistant usage block. */
  usageTokens: number;
  /** Estimated tokens not covered by usable provider usage. */
  trailingTokens: number;
  /** Index of the message that provided usage, or null when none exists. */
  lastUsageIndex: number | null;
}
/** Estimate context tokens for messages using provider usage when available. */
declare function estimateContextTokens(messages: AgentMessage[]): ContextUsageEstimate;
/** Return whether context usage exceeds the configured compaction threshold. */
declare function shouldCompact(contextTokens: number, contextWindow: number, settings: CompactionSettings): boolean;
declare const IMAGE_BLOCK_TOKENS = 2000;
/** Estimate token count for one message using a conservative character heuristic. */
declare function estimateTokens(message: AgentMessage): number;
/** Find the user-visible message that starts the turn containing an entry. */
declare function findTurnStartIndex(entries: SessionTreeEntry[], entryIndex: number, startIndex: number): number;
/** Cut point selected for compaction. */
interface CutPointResult {
  /** Index of the first entry retained after compaction. */
  firstKeptEntryIndex: number;
  /** Index of the turn-start entry when the cut splits a turn, otherwise -1. */
  turnStartIndex: number;
  /** Whether the selected cut point splits an in-progress turn. */
  isSplitTurn: boolean;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
declare function findCutPoint(entries: SessionTreeEntry[], startIndex: number, endIndex: number, keepRecentTokens: number): CutPointResult;
/** Generate or update a conversation summary for compaction. */
declare function generateSummary(currentMessages: AgentMessage[], model: Model, reserveTokens: number, apiKey: string | undefined, headers?: Record<string, string>, signal?: AbortSignal, customInstructions?: string, previousSummary?: string, thinkingLevel?: ThinkingLevel, streamFn?: StreamFn, runtime?: AgentCoreCompletionRuntimeDeps): Promise<Result<string, CompactionError>>;
/** Prepared inputs for a compaction run. */
interface CompactionPreparation {
  /** Entry id where retained history starts. */
  firstKeptEntryId: string;
  /** Messages summarized into the history summary. */
  messagesToSummarize: AgentMessage[];
  /** Prefix messages summarized separately when compaction splits a turn. */
  turnPrefixMessages: AgentMessage[];
  /** Whether compaction splits a turn. */
  isSplitTurn: boolean;
  /** Explicit terminal state of the turn whose prefix was split from its retained suffix. */
  splitTurnCompleted?: boolean;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Previous compaction summary used for iterative updates. */
  previousSummary?: string;
  /** File metadata already appended to the previous compaction summary. */
  previousSummaryDetails?: CompactionDetails;
  /** File operations extracted from summarized history. */
  fileOps: FileOperations;
  /** Settings used to prepare compaction. */
  settings: CompactionSettings;
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
declare function prepareCompaction(pathEntries: SessionTreeEntry[], settings: CompactionSettings): Result<CompactionPreparation | undefined, CompactionError>;
/** Generate compaction summary data from prepared session history. */
declare function compact(preparation: CompactionPreparation, model: Model, apiKey: string | undefined, headers?: Record<string, string>, customInstructions?: string, signal?: AbortSignal, thinkingLevel?: ThinkingLevel, streamFn?: StreamFn, runtime?: AgentCoreCompletionRuntimeDeps): Promise<Result<CompactionResult, CompactionError>>;
import * as import__openclaw_ai_event_stream from "@openclaw/ai/event-stream";
//#endregion
//#region src/agents/runtime/proxy.d.ts
declare class ProxyMessageEventStream extends event_stream_d_exports.EventStream<AssistantMessageEvent, AssistantMessage> {
  constructor();
}
/**
 * Proxy event types - server sends these with partial field stripped to reduce bandwidth.
 */
type ProxyAssistantMessageEvent = {
  type: "start";
} | {
  type: "text_start";
  contentIndex: number;
  contentSignature?: string;
} | {
  type: "text_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "text_end";
  contentIndex: number;
  contentSignature?: string;
} | {
  type: "thinking_start";
  contentIndex: number;
} | {
  type: "thinking_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "thinking_end";
  contentIndex: number;
  contentSignature?: string;
} | {
  type: "toolcall_start";
  contentIndex: number;
  id: string;
  toolName: string;
} | {
  type: "toolcall_delta";
  contentIndex: number;
  delta: string;
} | {
  type: "toolcall_end";
  contentIndex: number;
} | {
  type: "done";
  reason: Extract<StopReason, "stop" | "length" | "toolUse">;
  usage: AssistantMessage["usage"];
} | {
  type: "error";
  reason: Extract<StopReason, "aborted" | "error">;
  errorMessage?: string;
  usage: AssistantMessage["usage"];
};
type ProxySerializableStreamOptions = Pick<SimpleStreamOptions, "temperature" | "maxTokens" | "reasoning" | "cacheRetention" | "sessionId" | "promptCacheKey" | "metadata" | "transport" | "thinkingBudgets" | "maxRetryDelayMs" | "timeoutMs">;
interface ProxyStreamOptions extends ProxySerializableStreamOptions {
  /** Local abort signal for the proxy request */
  signal?: AbortSignal;
  /** Auth token for the proxy server */
  authToken: string;
  /** Proxy server URL (e.g., "https://genai.example.com") */
  proxyUrl: string;
}
declare function streamProxy(model: Model, context: Context, options: ProxyStreamOptions): ProxyMessageEventStream;
//#endregion
//#region src/plugin-sdk/agent-core.d.ts
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
declare const openClawAgentCoreRuntime: {
  completeSimple: (model: Model<Api>, context: Pick<Context, "systemPrompt" | "messages">, options: SimpleStreamOptions | undefined) => Promise<AssistantMessage>;
  streamSimple: (model: Model<Api>, context: Context, options: SimpleStreamOptions | undefined) => AssistantMessageEventStreamContract;
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
declare class Agent extends Agent$1 {
  constructor(options?: AgentOptions);
}
//#endregion
export { buildSessionContext as A, AgentOptions as B, BranchPreparation as C, prepareBranchEntries as D, generateBranchSummary as E, BRANCH_SUMMARY_SUFFIX as F, COMPACTION_SUMMARY_PREFIX as I, COMPACTION_SUMMARY_SUFFIX as L, FileOperations as M, SessionTreeEntry as N, serializeConversation as O, BRANCH_SUMMARY_PREFIX as P, bashExecutionToText as R, shouldCompact as S, collectEntriesForBranchSummaryFromBranches as T, findCutPoint as _, streamProxy as a, getLastAssistantUsage as b, CompactionResult as c, DEFAULT_COMPACTION_SETTINGS as d, IMAGE_BLOCK_TOKENS as f, estimateTokens as g, estimateContextTokens as h, ProxyStreamOptions as i, BranchSummaryResult as j, uuidv7 as k, CompactionSettings as l, compact as m, openClawAgentCoreRuntime as n, CompactionDetails as o, calculateContextTokens as p, ProxyAssistantMessageEvent as r, CompactionPreparation as s, Agent as t, ContextUsageEstimate as u, findTurnStartIndex as v, BranchSummaryDetails as w, prepareCompaction as x, generateSummary as y, runAgentLoop as z };