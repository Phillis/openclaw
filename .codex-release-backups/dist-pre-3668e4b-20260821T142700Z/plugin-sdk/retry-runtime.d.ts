import { i as resolveRetryConfig, n as RetryInfo, r as RetryOptions, t as RetryConfig } from "../index-BTQfvEv9.js";

//#region src/infra/retry.d.ts
/** Runs an async operation until it succeeds, policy stops, or attempts are exhausted. */
declare const retryAsync: <T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number) => Promise<T>;
//#endregion
//#region src/infra/retryable-network-errors.d.ts
/** Returns true when any nested error proves a transient network failure. */
declare function isTransientNetworkError(err: unknown): boolean;
//#endregion
//#region src/infra/retry-policy.d.ts
/** Runs an async operation with a policy-specific retry wrapper and optional log label. */
type RetryRunner = <T>(fn: () => Promise<T>, label?: string) => Promise<T>;
/** Default retry envelope for channel API operations that hit transient network edges. */
declare const CHANNEL_API_RETRY_DEFAULTS: {
  attempts: number;
  minDelayMs: number;
  maxDelayMs: number;
  jitter: number;
};
/** Creates a generic rate-limit-aware retry runner from explicit retry policy pieces. */
declare function createRateLimitRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  defaults: Required<RetryConfig>;
  logLabel: string;
  shouldRetry: (err: unknown) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
}): RetryRunner;
/** Creates the channel API retry runner used by outbound messaging integrations. */
declare function createChannelApiRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  retryAfterMaxDelayMs?: number;
  shouldRetry?: RetryOptions["shouldRetry"];
  retryAfterMs?: RetryOptions["retryAfterMs"];
  /**
   * When true, the custom shouldRetry predicate is used exclusively —
   * the default channel API fallback regex is NOT OR'd in.
   * Use this for non-idempotent operations (e.g. sendMessage) where
   * the regex fallback would cause duplicate message delivery.
   */
  strictShouldRetry?: boolean;
}): RetryRunner;
//#endregion
//#region src/infra/retry-after.d.ts
/** Parses an RFC Retry-After header as delay seconds or any valid HTTP-date form. */
declare function parseRetryAfterHeaderSeconds(value: string | null | undefined, now?: number): number | undefined;
//#endregion
//#region src/plugin-sdk/retry-runtime.d.ts
/** Classifies a normalized transport code without imposing a plugin-specific error shape. */
declare function classifyTransientNetworkErrorCode(code: string | undefined): "pre-connect" | "ambiguous" | undefined;
//#endregion
export { type RetryConfig, type RetryInfo, type RetryOptions, type RetryRunner, CHANNEL_API_RETRY_DEFAULTS as TELEGRAM_RETRY_DEFAULTS, classifyTransientNetworkErrorCode, createChannelApiRetryRunner, createChannelApiRetryRunner as createTelegramRetryRunner, createRateLimitRetryRunner, isTransientNetworkError, parseRetryAfterHeaderSeconds, resolveRetryConfig, retryAsync };