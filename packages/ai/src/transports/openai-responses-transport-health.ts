import type { AssistantMessage } from "@openclaw/llm-core";
import { parseStrictFiniteNumber } from "@openclaw/normalization-core/number-coercion";
import { sleepWithAbort } from "../internal/retry-sleep.js";
import {
  logResponsesFailedNoDetails,
  ResponsesStreamFailure,
  summarizeOpenAITransportError,
} from "./openai-responses-debug.js";
import { isOpenAICodexResponsesModel } from "./openai-transport-params.js";
import { log } from "./openai-transport-shared.js";
import { failTransportStream } from "./transport-stream-shared.js";
import { parseRetryAfterSeconds } from "./transport-utils.js";

/** Minimal structural fetch shape used by the health wrapper. */
export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

/**
 * Transport health controls for the ChatGPT-native Responses transport
 * (`openai-chatgpt-responses` / `openclaw-openai-chatgpt-responses-transport`).
 *
 * The upstream OpenAI SDK only retries non-streaming bodies; Responses streams
 * SSE through `fetch` with a streaming body, so 429/408/5xx responses are
 * surfaced to the caller immediately with no backoff. That produced an Aug
 * 2–26 window where ~1,815 calls hit chatgpt.com/backend-api with repeated
 * 429s (1.6–2.8s each), cascading into fallback models. For this transport
 * only, this module adds:
 *   1. a per-transport concurrency cap (semaphore),
 *   2. a rate-limit circuit breaker (N consecutive 429s in a window -> pause,
 *      fail fast with a typed error while paused),
 *   3. bounded exponential backoff honoring Retry-After / retry-after-ms and
 *      x-ratelimit-reset-* headers, capped per attempt.
 *
 * Tuning values are module constants (no public config/environment surface).
 * One opt-out env var is the escape hatch; everything else stays with the code
 * owner so the knob surface does not grow the openclaw.json/env contract.
 */

export const OPENCLAW_OPENAI_RESPONSES_TRANSPORT_HEALTH_DISABLED =
  process.env.OPENCLAW_OPENAI_RESPONSES_TRANSPORT_HEALTH_DISABLED === "1";

// ---------------------------------------------------------------------------
// Config surface (module constants by design)
// ---------------------------------------------------------------------------

export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_RETRIES = 3;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_BACKOFF_MS = 60_000;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BACKOFF_BASE_MS = 1_000;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_JITTER_MS = 250;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_CONCURRENCY = 4;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_THRESHOLD = 5;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_WINDOW_MS = 60_000;
export const OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_COOLDOWN_MS = 120_000;

/** Statuses this transport retries on idempotent-capable request paths. */
export function isRetryableResponsesTransportStatus(status: number): boolean {
  return (
    status === 429 ||
    status === 408 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

// ============================================================================
// Header parsing
// ============================================================================

const EPOCH_SECONDS_MIN = 1_000_000_000;
const EPOCH_SECONDS_MAX = 3_000_000_000;

/**
 * Parses an `x-ratelimit-reset-*` header value into seconds until the limit
 * resets. OpenAI has variously returned an absolute Unix epoch (seconds) or a
 * relative seconds count; both are accepted.
 */
export function parseRateLimitResetSeconds(
  value: string | null | undefined,
  nowMs: number,
): number | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = parseStrictFiniteNumber(trimmed);
  if (parsed === undefined) {
    return undefined;
  }
  if (parsed >= EPOCH_SECONDS_MIN && parsed <= EPOCH_SECONDS_MAX) {
    return Math.max(0, (parsed * 1000 - nowMs) / 1000);
  }
  if (parsed >= 0) {
    return parsed;
  }
  return undefined;
}

/** Combines `x-ratelimit-reset-requests` and `x-ratelimit-reset-tokens`. */
export function resolveRateLimitResetSeconds(headers: Headers, nowMs: number): number | undefined {
  const seconds = [
    parseRateLimitResetSeconds(headers.get("x-ratelimit-reset-requests"), nowMs),
    parseRateLimitResetSeconds(headers.get("x-ratelimit-reset-tokens"), nowMs),
  ].filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (seconds.length === 0) {
    return undefined;
  }
  return Math.max(...seconds);
}

export type OpenAIResponsesTransportBackoffOptions = {
  maxBackoffMs?: number;
  backoffBaseMs?: number;
  jitterMs?: number;
  random?: () => number;
};

/**
 * Resolves one backoff wait for `attempt`, honoring Retry-After (seconds or
 * HTTP-date), retry-after-ms, and x-ratelimit-reset-* headers when present,
 * otherwise exponential `base * 2^attempt`, then bounded jitter, then capped
 * per attempt. Deterministic under an injected `random`.
 */
export function resolveOpenAIResponsesTransportRetryDelayMs(
  attempt: number,
  headers: Headers,
  nowMs: number,
  options?: OpenAIResponsesTransportBackoffOptions,
): number {
  const backoffBaseMs =
    options?.backoffBaseMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BACKOFF_BASE_MS;
  const maxBackoffMs =
    options?.maxBackoffMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_BACKOFF_MS;
  const jitterMs = options?.jitterMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_JITTER_MS;
  const random = options?.random ?? Math.random;

  const fallbackMs = backoffBaseMs * 2 ** Math.max(0, attempt);
  const hints: number[] = [fallbackMs];

  const retryAfterSeconds = parseRetryAfterSeconds(headers);
  if (retryAfterSeconds !== undefined) {
    hints.push(Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : maxBackoffMs);
  } else {
    const resetSeconds = resolveRateLimitResetSeconds(headers, nowMs);
    if (resetSeconds !== undefined) {
      hints.push(resetSeconds * 1000);
    }
  }

  const baseMs = Math.max(...hints);
  const jitter = Math.floor(jitterMs * Math.max(0, Math.min(1, random())));
  return clampBackoffMs(baseMs + jitter, maxBackoffMs);
}

function clampBackoffMs(valueMs: number, maxBackoffMs: number): number {
  if (!Number.isFinite(valueMs) || valueMs <= 0) {
    return 1;
  }
  return Math.min(Math.floor(valueMs), Math.max(1, maxBackoffMs));
}

/** Resolves the server-suggested pause for breaker cooldown extension. */
export function resolveRetryAfterHintMs(headers: Headers, nowMs: number): number | undefined {
  const retryAfterSeconds = parseRetryAfterSeconds(headers);
  if (retryAfterSeconds !== undefined && Number.isFinite(retryAfterSeconds)) {
    return retryAfterSeconds * 1000;
  }
  const resetSeconds = resolveRateLimitResetSeconds(headers, nowMs);
  if (resetSeconds !== undefined) {
    return resetSeconds * 1000;
  }
  return undefined;
}

// ============================================================================
// Concurrency gate (semaphore)
// ============================================================================

export type OpenAIResponsesConcurrencyRelease = () => void;

/**
 * A small waiting semaphore capping concurrent in-flight requests to one
 * transport endpoint. FIFO; waiters are re-armed in order.
 */
export class OpenAIResponsesConcurrencyGate {
  private active = 0;
  private waiters: Array<{
    resolve: () => void;
    reject: (reason: Error) => void;
    onAbort: () => void;
  }> = [];

  constructor(private readonly limit: number) {}

  get inFlight(): number {
    return this.active;
  }

  get pending(): number {
    return this.waiters.length;
  }

  async acquire(signal?: AbortSignal): Promise<OpenAIResponsesConcurrencyRelease> {
    while (true) {
      if (signal?.aborted) {
        throw abortError();
      }
      if (this.active < this.limit) {
        this.active += 1;
        return () => this.releaseWaiter();
      }
      await new Promise<void>((resolve, reject) => {
        const waiter = {
          resolve,
          reject,
          onAbort: (): void => {
            const index = this.waiters.indexOf(waiter);
            if (index >= 0) {
              this.waiters.splice(index, 1);
            }
            reject(abortError());
          },
        };
        if (signal) {
          if (signal.aborted) {
            waiter.onAbort();
            return;
          }
          signal.addEventListener("abort", waiter.onAbort, { once: true });
        }
        this.waiters.push(waiter);
      });
    }
  }

  private releaseWaiter(): void {
    this.active -= 1;
    const waiter = this.waiters.shift();
    if (!waiter) {
      return;
    }
    waiter.resolve();
  }
}

function abortError(): Error {
  return new DOMException("The operation was aborted.", "AbortError") as unknown as Error; // SAFETY: DOMException is a valid Error subtype; cast only narrows the static type.
}

// ============================================================================
// Circuit breaker (rate-limit driven)
// ============================================================================

export type OpenAIResponsesBreakerState = "closed" | "open" | "half-open";

export type OpenAIResponsesBreakerSnapshot = {
  state: OpenAIResponsesBreakerState;
  openUntilMs: number;
};

export class OpenAIResponsesCircuitBreaker {
  private state: OpenAIResponsesBreakerState = "closed";
  private openUntilMs = 0;
  private rateLimitHistory: number[] = [];

  constructor(
    private readonly threshold: number,
    private readonly windowMs: number,
    private readonly cooldownMs: number,
  ) {}

  /** Observes one provider response status with a possibly server-suggested wait. */
  observe(
    status: number,
    nowMs: number,
    retryAfterHintMs?: number,
  ): OpenAIResponsesBreakerSnapshot {
    const isRateLimited = status === 429;
    const isSuccess = status >= 200 && status < 300;

    if (this.state === "open") {
      if (nowMs < this.openUntilMs) {
        return this.snapshot();
      }
      this.state = "half-open";
      return this.snapshot();
    }

    if (this.state === "half-open") {
      if (isSuccess) {
        this.close();
      } else if (isRateLimited || isRetryableResponsesTransportStatus(status)) {
        this.open(nowMs, retryAfterHintMs);
      }
      return this.snapshot();
    }

    // closed
    if (isRateLimited) {
      this.rateLimitHistory.push(nowMs);
      this.pruneWindow(nowMs);
      if (this.rateLimitHistory.length >= this.threshold) {
        this.open(nowMs, retryAfterHintMs);
      }
      return this.snapshot();
    }
    if (isSuccess) {
      this.rateLimitHistory = [];
    }
    return this.snapshot();
  }

  private open(nowMs: number, hintMs?: number): void {
    const waitMs =
      hintMs !== undefined && Number.isFinite(hintMs) && hintMs > this.cooldownMs
        ? hintMs
        : this.cooldownMs;
    this.state = "open";
    this.openUntilMs = nowMs + waitMs;
    log.warn("OpenAI Responses transport circuit breaker OPEN", {
      key: "openai-responses-transport",
      threshold: this.threshold,
      windowMs: this.windowMs,
      cooldownMs: Math.round(waitMs),
    });
  }

  private close(): void {
    this.state = "closed";
    this.rateLimitHistory = [];
    log.info("OpenAI Responses transport circuit breaker CLOSED", {
      key: "openai-responses-transport",
    });
  }

  private pruneWindow(nowMs: number): void {
    const cutoff = nowMs - this.windowMs;
    while (this.rateLimitHistory.length > 0 && (this.rateLimitHistory[0] ?? Infinity) < cutoff) {
      this.rateLimitHistory.shift();
    }
  }

  snapshot(nowMs?: number): OpenAIResponsesBreakerSnapshot {
    if (this.state === "open" && nowMs !== undefined && nowMs >= this.openUntilMs) {
      this.state = "half-open";
    }
    return { state: this.state, openUntilMs: this.openUntilMs };
  }
}

// ============================================================================
// Typed failure mode
// ============================================================================

export class OpenAIResponsesTransportOpenError extends Error {
  readonly code = "openai_responses_transport_open";
  constructor(
    readonly transportKey: string,
    readonly openUntilMs: number,
  ) {
    super("OpenAI Responses transport is paused by its rate-limit circuit breaker (fail-fast).");
    this.name = "OpenAIResponsesTransportOpenError";
  }
}

/**
 * Walks a cause chain (the SDK wraps our fetch throw in an APIConnectionError)
 * to find our typed breaker-open error, if present.
 */
export function unwrapOpenAIResponsesTransportOpenError(
  error: unknown,
): OpenAIResponsesTransportOpenError | undefined {
  let current: unknown = error;
  const seen = new Set<unknown>();
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    if (current instanceof OpenAIResponsesTransportOpenError) {
      return current;
    }
    current = (current as { cause?: unknown }).cause; // SAFETY: optional structural read of an unknown-typed cause chain.
  }
  return undefined;
}

// ============================================================================
// Health context
// ============================================================================

export type OpenAIResponsesTransportHealth = {
  breaker: OpenAIResponsesCircuitBreaker;
  gate: OpenAIResponsesConcurrencyGate;
  sleep: (ms: number, signal?: AbortSignal) => Promise<void>;
  nowMs: () => number;
  random: () => number;
  maxRetries: number;
  maxBackoffMs: number;
  backoffBaseMs: number;
  jitterMs: number;
  maxConcurrency: number;
};

export type OpenAIResponsesTransportHealthOptions = {
  maxConcurrency?: number;
  maxRetries?: number;
  maxBackoffMs?: number;
  backoffBaseMs?: number;
  jitterMs?: number;
  breakerThreshold?: number;
  breakerWindowMs?: number;
  breakerCooldownMs?: number;
  nowMs?: () => number;
  random?: () => number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
};

export function createOpenAIResponsesTransportHealth(
  options?: OpenAIResponsesTransportHealthOptions,
): OpenAIResponsesTransportHealth {
  return {
    breaker: new OpenAIResponsesCircuitBreaker(
      options?.breakerThreshold ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_THRESHOLD,
      options?.breakerWindowMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_WINDOW_MS,
      options?.breakerCooldownMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BREAKER_COOLDOWN_MS,
    ),
    gate: new OpenAIResponsesConcurrencyGate(
      options?.maxConcurrency ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_CONCURRENCY,
    ),
    sleep: options?.sleep ?? sleepWithAbort,
    nowMs: options?.nowMs ?? (() => Date.now()),
    random: options?.random ?? Math.random,
    maxRetries: options?.maxRetries ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_RETRIES,
    maxBackoffMs: options?.maxBackoffMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_BACKOFF_MS,
    backoffBaseMs:
      options?.backoffBaseMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_BACKOFF_BASE_MS,
    jitterMs: options?.jitterMs ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_JITTER_MS,
    maxConcurrency:
      options?.maxConcurrency ?? OPENAI_RESPONSES_TRANSPORT_HEALTH_DEFAULT_MAX_CONCURRENCY,
  };
}

function readRequestSignal(init: RequestInit | undefined): AbortSignal | undefined {
  if (!init || typeof init !== "object") {
    return undefined;
  }
  return (init as { signal?: AbortSignal }).signal; // SAFETY: optional structural read; undefined when absent.
}

/** A module-level registry of health contexts, keyed by transport endpoint. */
const healthRegistry = new Map<string, OpenAIResponsesTransportHealth>();

export function getOpenAIResponsesTransportHealth(
  key: string,
  options?: OpenAIResponsesTransportHealthOptions,
): OpenAIResponsesTransportHealth {
  let existing = healthRegistry.get(key);
  if (!existing) {
    existing = createOpenAIResponsesTransportHealth(options);
    healthRegistry.set(key, existing);
  }
  return existing;
}

/** Test-only reset of module-level health state. */
export function resetOpenAIResponsesTransportHealthRegistry(): void {
  healthRegistry.clear();
}

export function resolveOpenAIResponsesTransportKey(params: {
  provider: string | null | undefined;
  api: string | null | undefined;
  baseUrl: string | undefined;
}): string {
  return `${params.provider ?? "openai"}::${params.api ?? "unknown"}::${params.baseUrl ?? ""}`;
}

/**
 * Wraps a low-level fetch with concurrency + circuit breaker + backoff.
 * On an open breaker it fails fast with a typed
 * `OpenAIResponsesTransportOpenError`; otherwise it retries idempotent
 * 429/408/5xx responses up to `maxRetries` times with honored backoff.
 */
export function createOpenAIResponsesTransportHealthFetch(
  underlying: typeof fetch,
  health: OpenAIResponsesTransportHealth,
  transportKey: string,
): typeof fetch {
  return async (input, init) => {
    const signal = readRequestSignal(init);
    // Fail fast before queuing on the gate so open-state requests never pile up.
    const pre = health.breaker.snapshot(health.nowMs());
    if (pre.state === "open") {
      throw new OpenAIResponsesTransportOpenError(transportKey, pre.openUntilMs);
    }

    const release = await health.gate.acquire(signal);
    try {
      let attempt = 0;
      while (true) {
        if (signal?.aborted) {
          throw abortError();
        }
        const snapshot = health.breaker.snapshot(health.nowMs());
        if (snapshot.state === "open") {
          throw new OpenAIResponsesTransportOpenError(transportKey, snapshot.openUntilMs);
        }

        let response: Response;
        try {
          response = await underlying(input, init);
        } catch (error) {
          const aborted = signal?.aborted === true;
          const abortLike =
            error instanceof Error &&
            (error.name === "AbortError" || error.name === "TimeoutError");
          if (attempt < health.maxRetries && !aborted && !abortLike) {
            const delayMs = resolveOpenAIResponsesTransportRetryDelayMs(
              attempt,
              new Headers(),
              health.nowMs(),
              { maxBackoffMs: health.maxBackoffMs, backoffBaseMs: health.backoffBaseMs },
            );
            await health.sleep(delayMs, signal);
            attempt += 1;
            continue;
          }
          throw error;
        }

        const status = response.status;
        if (response.ok) {
          health.breaker.observe(status, health.nowMs());
          return response;
        }

        const hintMs = resolveRetryAfterHintMs(response.headers, health.nowMs());
        health.breaker.observe(status, health.nowMs(), status === 429 ? hintMs : undefined);

        if (
          isRetryableResponsesTransportStatus(status) &&
          attempt < health.maxRetries &&
          !signal?.aborted
        ) {
          const delayMs = resolveOpenAIResponsesTransportRetryDelayMs(
            attempt,
            response.headers,
            health.nowMs(),
            {
              maxBackoffMs: health.maxBackoffMs,
              backoffBaseMs: health.backoffBaseMs,
              jitterMs: health.jitterMs,
              random: health.random,
            },
          );
          log.debug("OpenAI Responses transport backoff wait", {
            status,
            attempt,
            delayMs,
            transport: transportKey,
          });
          await health.sleep(delayMs, signal);
          attempt += 1;
          continue;
        }
        return response;
      }
    } finally {
      release();
    }
  };
}

/** Wrap a guarded model fetch with transport-health enforcement (concurrency
 *  capping, rate-limit circuit breaking, Retry-After/x-ratelimit honoring
 *  backoff) for the ChatGPT-native Responses transport, which surfaces
 *  429/408/5xx on streamed SSE bodies with no SDK backoff. Disables the SDK's
 *  own (non-streaming only) retries so we are the single retry owner. Only the
 *  chatgpt-responses codex transport is wrapped; other OpenAI/azure-responses
 *  transports keep their existing behavior. */
export function resolveHealthWrappedModelFetch(
  guardedFetch: FetchLike,
  model: Parameters<typeof isOpenAICodexResponsesModel>[0],
): { fetch: FetchLike; healthEnabled: boolean } {
  const healthEnabled =
    isOpenAICodexResponsesModel(model) && !OPENCLAW_OPENAI_RESPONSES_TRANSPORT_HEALTH_DISABLED;
  const healthKey = resolveOpenAIResponsesTransportKey({
    provider: model.provider,
    api: model.api,
    baseUrl: model.baseUrl,
  });
  return {
    fetch: healthEnabled
      ? createOpenAIResponsesTransportHealthFetch(
          guardedFetch,
          getOpenAIResponsesTransportHealth(healthKey),
          healthKey,
        )
      : guardedFetch,
    healthEnabled,
  };
}

/** Surface a breaker-open failure with its typed identity so the fallback layer
 *  sees an immediate, distinct failure mode rather than a generic connection
 *  error wrapped by the SDK; settles compact requests and the stream. */
export function failResponsesTransportWithEffectiveError(args: {
  error: unknown;
  model: { provider: string; api?: string; model?: string; id?: string };
  log: { warn: (message: string) => void };
  compactRequest?: { reject: (error: unknown) => void } | undefined;
  stream: import("./transport-stream-shared.js").WritableTransportStream;
  output: AssistantMessage;
  signal?: AbortSignal;
}): void {
  const transportOpenError = unwrapOpenAIResponsesTransportOpenError(args.error);
  const effectiveError = transportOpenError ?? args.error;
  if (args.compactRequest) {
    args.compactRequest.reject(effectiveError);
    failTransportStream({
      stream: args.stream,
      output: args.output,
      signal: args.signal,
      error: effectiveError,
    });
    return;
  }
  if (effectiveError instanceof ResponsesStreamFailure && effectiveError.observation) {
    logResponsesFailedNoDetails(effectiveError.observation);
  }
  args.log.warn(
    `[responses] error provider=${args.model.provider} api=${args.model.api} model=${args.model.id ?? args.model.model} ` +
      summarizeOpenAITransportError(effectiveError) +
      (transportOpenError
        ? `; circuit breaker open (fail-fast, will not dispatch to avoid hammering 429)`
        : ""),
  );
  failTransportStream({
    stream: args.stream,
    output: args.output,
    signal: args.signal,
    error: effectiveError,
  });
}
