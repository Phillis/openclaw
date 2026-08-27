import { v as SourceReplyDeliveryMode } from "./types-Byd4mWhx.js";
import { g as TaskSuggestionDeliveryMode } from "./templating-CW47wETJ.js";
import { Ho as ReplyBackendQueueMessageOptions, Uo as ReplyBackendQueueMessageResult, Vo as ReplyBackendMessageInjection } from "./host-capability-types-3XBDy-df.js";

//#region src/agents/embedded-agent-runner/run-state.d.ts
/**
 * Shared process state for embedded-agent runs, queues, and snapshots.
 *
 * The maps are global-singleton backed so reloads and lazy imports inside the same gateway process
 * do not split active-run bookkeeping.
 */
type EmbeddedAgentQueueHandle = {
  kind?: "embedded";
  runId?: string; /** Exact authority of the concrete provider/model attempt behind this handle. */
  toolAuthorityFingerprint?: string; /** Atomically consumes one plain-text answer for this run's pending user-input request. */
  claimPendingUserInputAnswer?: (text: string, options?: EmbeddedAgentQueueMessageOptions) => Promise<boolean>; /** Cancels this run's pending user-input request before an image is queued as a later turn. */
  cancelPendingUserInput?: (resolvedBy: string) => Promise<boolean>; /** Exact heartbeat owner retained after its reply-operation registration clears. */
  readonly preemptByVisibleTurn?: () => boolean;
  queueMessage: (text: string, options?: EmbeddedAgentQueueMessageOptions) => Promise<void | EmbeddedAgentQueueMessageResult>;
  messageInjection?: ReplyBackendMessageInjection;
  isStreaming: () => boolean;
  isStopped?: () => boolean; /** True after this handle has accepted an abort, even while cleanup retains it. */
  isAborted?: () => boolean;
  isAbortable?: () => boolean;
  isCompacting: () => boolean;
  supportsTranscriptCommitWait?: boolean; /** True only when queueMessage preserves images supplied in its options. */
  supportsQueueMessageImages?: boolean;
  cancel?: (reason?: "user_abort" | "restart" | "superseded") => void;
  abort: (reason?: "restart") => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
};
type EmbeddedAgentQueueMessageOptions = ReplyBackendQueueMessageOptions;
type EmbeddedAgentQueueMessageResult = ReplyBackendQueueMessageResult;
/** Resolves the current session id for an active run after resets or compaction. */
declare function resolveActiveEmbeddedRunSessionId(sessionKey: string): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/runs.d.ts
/**
 * Abort embedded OpenClaw runs.
 *
 * - With a sessionId, aborts that single run.
 * - With no sessionId, supports targeted abort modes (for example, compacting runs only).
 */
declare function abortEmbeddedAgentRun(sessionId: string): boolean;
declare function abortEmbeddedAgentRun(sessionId: undefined, opts: {
  mode: "all" | "compacting";
  reason?: "restart";
}): boolean;
type AbortAndDrainEmbeddedAgentRunResult = {
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
};
declare function abortAndDrainEmbeddedAgentRun(params: {
  sessionId: string;
  sessionKey?: string;
  settleMs?: number;
  forceClear?: boolean;
  reason?: string;
}): Promise<AbortAndDrainEmbeddedAgentRunResult>;
declare function setActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string): void;
declare function clearActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string, reason?: string): void;
//#endregion
export { setActiveEmbeddedRun as a, clearActiveEmbeddedRun as i, abortAndDrainEmbeddedAgentRun as n, EmbeddedAgentQueueMessageOptions as o, abortEmbeddedAgentRun as r, resolveActiveEmbeddedRunSessionId as s, AbortAndDrainEmbeddedAgentRunResult as t };