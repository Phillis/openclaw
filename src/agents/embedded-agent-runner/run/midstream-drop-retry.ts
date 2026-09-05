/**
 * PHIL-FORK (BUG-019, 2026-09-04): retry-eligibility for mid-stream drops.
 *
 * Live evidence (magnus E00-F07 g2, transcript seq 32, 2026-09-04T18:42:13.970Z):
 * opencode-go returned 200 + partial SSE content for ~3.6s, then the stream
 * ended WITHOUT finish_reason. The OpenAI-completions stream transport throws
 * the deterministic error "Stream ended without finish_reason"
 * (packages/ai/src/transports/openai-completions-stream.ts) and the runner
 * synthesizes an assistant message with stopReason=error, EMPTY content, and
 * zero committed usage — the partial streamed content is discarded and the
 * conversation state is unchanged. The run nevertheless ended TERMINAL: no
 * retry, no failover (classification of the raw message yields no failover
 * reason, so the failure handler falls through to continue_normal and the run
 * finalizes as "no final summary produced").
 *
 * The existing silent-error retry gate
 * (shouldRetrySilentErrorAssistantTurn) cannot absorb this class because it
 * requires the attempt's accumulated assistantTexts to be empty — a mid-stream
 * drop by definition may have streamed partial visible text before dying.
 *
 * Safety contract for the retry this module enables:
 *  - Only the harness-owned deterministic stream-drop signature matches
 *    (never provider-authored error text, which can carry refusal semantics).
 *  - The current attempt must be replay-safe (no uncommitted side-effect
 *    bearing work in THIS attempt) — callers enforce via
 *    isCurrentAttemptReplaySafe; this module never overrides that.
 *  - The retry is a full re-request from the last committed conversation
 *    state: tools that already executed are settled transcript entries, the
 *    model continues from them; nothing re-executes.
 */
import type { AssistantMessage } from "../../../llm/types.js";

/** Deterministic harness-owned error emitted when a stream ends without finish_reason. */
const STREAM_ENDED_WITHOUT_FINISH_REASON = /stream ended without finish_reason/i;

/** Bounded local retries for the mid-stream drop class (matches empty-error budget). */
export const MAX_MIDSTREAM_DROP_RETRIES = 3;

export function isMidStreamDropWithoutFinishReason(
  assistant: AssistantMessage | null | undefined,
): boolean {
  if (!assistant || assistant.stopReason !== "error" || !assistant.errorMessage) {
    return false;
  }
  // Only the harness-owned signature: the provider never authored an error
  // body, it simply stopped sending frames. Partial content may have been
  // streamed; it is discarded from the final assistant message (content: [],
  // zero usage observed live), so a re-request cannot duplicate output.
  return STREAM_ENDED_WITHOUT_FINISH_REASON.test(assistant.errorMessage);
}
