/**
 * Layer-A transparent retry for finish-less stream terminations.
 *
 * Live class (opencode-go fronting GLM, 2026-09): the provider returns 200,
 * streams SSE chunks, then closes the body with neither a finish_reason chunk
 * nor a data: [DONE] frame. processCompletionsStream raises the typed error
 * below; the partial fragment is consumer-owned in-flight state (nothing is
 * committed and no usage is recorded).
 *
 * A single completions HTTP call has no side effects: async tools execute at
 * toolcall_end, never mid-stream, and text/thinking deltas only mutate the
 * in-flight fragment that consumers replace when a second start event arrives.
 * So when the typed error fires with zero toolcall_end events observed, one
 * identical re-request is invisible to the agent loop. The gate is strict on
 * purpose: a second failure, caller abort, observed toolcall_end, or any
 * non-matching error rethrows into the existing error path — the run-level
 * replay gates above this layer stay authoritative.
 *
 * The same retry also covers premature body terminations: the response
 * streamed, then the connection died before the body completed (undici
 * `TypeError: terminated`, Node `ERR_STREAM_PREMATURE_CLOSE`, undici
 * `UND_ERR_SOCKET`/socket-hang-up). RCA-verified 2026-09-13: a synthetic
 * Kimi-K3 stream `terminated` mid-thinking with zero toolcall_end and no
 * retry, stranding the run. These are the connection_closed/terminated
 * transport families classified in src/infra/diagnostic-error-metadata.ts;
 * identical safety class (nothing committed, consumer-owned fragment).
 * Provider-authored HTTP error responses (any error carrying an HTTP status
 * code) never match, so 4xx/5xx bodies stay outside this retry.
 */

/** Harness-owned error for a stream that ended without finish_reason. */
export class StreamEndedWithoutFinishReasonError extends Error {
  constructor() {
    super("Stream ended without finish_reason");
    this.name = "StreamEndedWithoutFinishReasonError";
  }
}

/** Typed-only check for in-process retry gates; never matches provider-authored text. */
export function isStreamEndedWithoutFinishReasonError(error: unknown): boolean {
  return error instanceof StreamEndedWithoutFinishReasonError;
}

/**
 * Canonical signature match for serialized error messages, where the error
 * class identity is lost (assistant errorMessage crossing persistence or IPC
 * boundaries). Serialization fallback only — in-process gates must use
 * {@link isStreamEndedWithoutFinishReasonError}.
 */
export function isStreamEndedWithoutFinishReasonMessage(message: string | undefined): boolean {
  return typeof message === "string" && /stream ended without finish_reason/i.test(message);
}

const PREMATURE_BODY_TERMINATION_CODES = /^(?:ERR_STREAM_PREMATURE_CLOSE|UND_ERR_SOCKET)$/i;

/**
 * Message signatures for the connection_closed/terminated transport families
 * (mirrors src/infra/diagnostic-error-metadata.ts, minus sigkill/sigterm:
 * process kill signals are not body terminations and never retry here).
 * Also matches the codes as text, for serializers that append them.
 */
const PREMATURE_BODY_TERMINATION_MESSAGE =
  /\b(?:terminated|premature close|socket hang up|connection closed|other side closed|ERR_STREAM_PREMATURE_CLOSE|UND_ERR_SOCKET)\b/i;

/**
 * Serialized-message fallback for premature body terminations, where the
 * error class identity is lost. In-process gates must use
 * {@link isPrematureBodyTerminationError}.
 */
export function isPrematureBodyTerminationMessage(message: string | undefined): boolean {
  return typeof message === "string" && PREMATURE_BODY_TERMINATION_MESSAGE.test(message);
}

/**
 * Live check for premature body terminations. Excludes provider-authored
 * HTTP error responses: any error carrying an HTTP status code (number or
 * 3-digit string, `status`/`statusCode`) is a completed provider response,
 * not a dead body, so 4xx/5xx never retries here.
 */
export function isPrematureBodyTerminationError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  // SAFETY: undici/Node/SDK transport errors carry ad-hoc status/statusCode/code own props not on Error
  const carrier = error as Error & { status?: unknown; statusCode?: unknown; code?: unknown };
  if (typeof carrier.status === "number" || typeof carrier.statusCode === "number") {
    return false;
  }
  if (
    typeof carrier.status === "string" &&
    /^\d{3}$/.test(carrier.status) &&
    Number.isFinite(Number.parseInt(carrier.status, 10))
  ) {
    return false;
  }
  if (
    typeof carrier.statusCode === "string" &&
    /^\d{3}$/.test(carrier.statusCode) &&
    Number.isFinite(Number.parseInt(carrier.statusCode, 10))
  ) {
    return false;
  }
  if (typeof carrier.code === "string" && PREMATURE_BODY_TERMINATION_CODES.test(carrier.code)) {
    return true;
  }
  return isPrematureBodyTerminationMessage(error.message);
}

/**
 * Both retryable transport classes: the harness-typed finish-less signature
 * and premature body terminations. Everything else rethrows unchanged. Type
 * guard so catch sites narrow the retried error for onRetry reporting.
 */
export function isRetryableFinishLessStreamError(error: unknown): error is Error {
  return isStreamEndedWithoutFinishReasonError(error) || isPrematureBodyTerminationError(error);
}

/** Bounded: exactly one transparent re-request of the same HTTP call. */
export const FINISH_LESS_STREAM_MAX_ATTEMPTS = 2;

/** ~300ms jittered backoff: off the same edge-worker instant without dragging the turn. */
export function finishLessStreamRetryDelayMs(): number {
  return 240 + Math.floor(Math.random() * 120);
}

/** Per-attempt facts the retry gate needs; reset by the wrapper before each attempt. */
export type FinishLessStreamAttemptState = {
  /** toolcall_end events that reached the consumer during the current attempt. */
  toolcallEndCount: number;
};

/**
 * Runs `run(attempt, attemptState)` and, only for a retryable finish-less
 * signature (typed finish-less error or premature body termination) with
 * zero observed toolcall_end on the first attempt, retries once with the
 * same call after a jittered backoff. `attemptState` is reset before each
 * attempt; `run` increments `toolcallEndCount` as it forwards events to the
 * consumer.
 */
export async function withFinishLessStreamRetry<T>(params: {
  signal?: AbortSignal;
  /** Delay override for deterministic tests; defaults to ~300ms jittered. */
  retryDelayMs?: () => number;
  onRetry?: (attempt: number, error: Error) => void;
  run: (attempt: number, attemptState: FinishLessStreamAttemptState) => Promise<T>;
}): Promise<T> {
  const attemptState: FinishLessStreamAttemptState = { toolcallEndCount: 0 };
  for (let attempt = 1; ; attempt += 1) {
    attemptState.toolcallEndCount = 0;
    try {
      return await params.run(attempt, attemptState);
    } catch (error) {
      if (
        attempt >= FINISH_LESS_STREAM_MAX_ATTEMPTS ||
        params.signal?.aborted ||
        attemptState.toolcallEndCount > 0 ||
        !isRetryableFinishLessStreamError(error)
      ) {
        throw error;
      }
      params.onRetry?.(attempt, error);
      await new Promise<void>((resolve) => {
        setTimeout(resolve, (params.retryDelayMs ?? finishLessStreamRetryDelayMs)());
      });
    }
  }
}
