import { _ as Tool, c as Message, m as TextContent, o as ImageContent, p as StreamFn$1 } from "./types-CL_qQaPo.js";
import "./index-C1qx1Yoz.js";
import { Static, TSchema } from "typebox";
//#region packages/agent-core/src/types.d.ts
/**
 * Stream function used by the agent loop.
 *
 * Contract:
 * - Must not throw or return a rejected promise for request/model/runtime failures.
 * - Must return an AssistantMessageEventStream.
 * - Failures must be encoded in the returned stream via protocol events and a
 *   final AssistantMessage with stopReason "error" or "aborted" and errorMessage.
 */
type StreamFn = StreamFn$1;
/**
 * Configuration for how tool calls from a single assistant message are executed.
 *
 * - "sequential": each tool call is prepared, checked for steering, executed, and finalized before the next one starts.
 * - "parallel": tool calls are prepared sequentially, checked for steering once, then allowed tools execute concurrently.
 *   `tool_execution_end` is emitted in tool completion order after each tool is finalized,
 *   while tool-result message artifacts are emitted later in assistant source order.
 */
type ToolExecutionMode = "sequential" | "parallel";
interface BashExecutionMessage {
  /** Harness role for shell command transcripts. */
  role: "bashExecution";
  /** Command line that was executed. */
  command: string;
  /** Captured command output, usually already truncated for context. */
  output: string;
  /** Process exit code when the command reached process exit. */
  exitCode: number | undefined;
  /** True when the command was interrupted before normal completion. */
  cancelled: boolean;
  /** True when output was shortened for transcript/context storage. */
  truncated: boolean;
  /** Optional path containing the complete output when truncation occurred. */
  fullOutputPath?: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
  /** Exclude this command transcript from model context while keeping it in session history. */
  excludeFromContext?: boolean;
}
interface CustomMessage<T = unknown> {
  /** Harness role for application-defined transcript content. */
  role: "custom";
  /** Application-defined discriminator for rendering or handling this message. */
  customType: string;
  /** Content replayed into model context when this message is included. */
  content: string | (TextContent | ImageContent)[];
  /** Whether UI surfaces should display this message. */
  display: boolean;
  /** Keep display-only application activity out of future model context. */
  excludeFromContext?: boolean;
  /** Optional application-specific metadata. */
  details?: T;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface BranchSummaryMessage {
  /** Harness role for summaries produced when returning from another branch. */
  role: "branchSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Entry id of the branch root or source leaf being summarized. */
  fromId: string;
  /** Millisecond timestamp for transcript ordering. */
  timestamp: number;
}
interface CompactionSummaryMessage {
  /** Harness role for summaries that replace compacted transcript history. */
  role: "compactionSummary";
  /** Summary text inserted back into model context. */
  summary: string;
  /** Estimated context tokens before compaction. */
  tokensBefore: number;
  /** Timestamp may be numeric in memory or string when loaded from older persisted rows. */
  timestamp: number | string;
  /** Optional estimated context tokens after compaction. */
  tokensAfter?: number;
  /** Optional first retained entry id from the compaction range. */
  firstKeptEntryId?: string;
  /** Optional implementation-specific compaction metadata. */
  details?: unknown;
}
/**
 * Extensible interface for custom app and harness messages.
 * Apps can extend via declaration merging.
 */
interface CustomAgentMessages {
  bashExecution: BashExecutionMessage;
  custom: CustomMessage;
  branchSummary: BranchSummaryMessage;
  compactionSummary: CompactionSummaryMessage;
}
/**
 * AgentMessage: Union of LLM messages + custom messages.
 * This abstraction allows apps to add custom message types while maintaining
 * type safety and compatibility with the base LLM messages.
 */
type AgentMessage = Message | CustomAgentMessages[keyof CustomAgentMessages];
/** Channel-safe progress text emitted by a running tool. */
interface AgentToolProgress {
  /** Public text suitable for user-facing progress surfaces. */
  text: string;
  /** Tool progress is rendered by channel progress UIs. */
  visibility: "channel";
  /** Progress text must not contain secrets, private args, or fetched content. */
  privacy: "public";
  /** Optional stable id for progress line replacement. */
  id?: string;
}
/** Final or partial result produced by a tool. */
interface AgentToolResult<T> {
  /** Text or image content returned to the model. */
  content: (TextContent | ImageContent)[];
  /** Arbitrary structured details for logs or UI rendering. */
  details: T;
  /** Optional public progress hint for partial tool updates; never model content. */
  progress?: AgentToolProgress;
  /**
   * Hint that the agent should stop after the current tool batch.
   * Early termination only happens when every finalized tool result in the batch sets this to true.
   */
  terminate?: boolean;
}
/** Callback used by tools to stream partial execution updates. */
type AgentToolUpdateCallback<T = unknown> = (partialResult: AgentToolResult<T>) => void;
/** Origin class for tool output that can taint later model-authored content in the same turn. */
type ToolResultContentSource = "network";
/** Tool definition used by the agent runtime. */
interface AgentTool<TParameters extends TSchema = TSchema, TDetails = unknown> extends Tool<TParameters> {
  /** Human-readable label for UI display. */
  label: string;
  /** Optional schema for the structured `AgentToolResult.details` value. */
  outputSchema?: TSchema;
  /** Preserve lifecycle telemetry without rendering transient channel progress. */
  hideFromChannelProgress?: boolean;
  /** Tool results contain externally controlled network content. */
  resultContentSource?: ToolResultContentSource;
  /**
   * Optional compatibility shim for raw tool-call arguments before schema validation.
   * Must return an object that matches `TParameters`.
   */
  prepareArguments?: (args: unknown) => Static<TParameters>;
  /** Execute the tool call. Throw on failure instead of encoding errors in `content`. */
  execute: (toolCallId: string, params: Static<TParameters>, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback<TDetails>) => Promise<AgentToolResult<TDetails>>;
  /**
   * Per-tool execution mode override.
   * - "sequential": this tool must execute one at a time with other tool calls.
   * - "parallel": this tool can execute concurrently with other tool calls.
   *
   * If omitted, the default execution mode applies.
   */
  executionMode?: ToolExecutionMode;
}
//#endregion
export { BashExecutionMessage as a, ToolExecutionMode as c, AgentToolUpdateCallback as i, AgentTool as n, CustomMessage as o, AgentToolResult as r, StreamFn as s, AgentMessage as t };