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
declare function resolveRetryConfig(defaults?: Required<RetryConfig>, overrides?: RetryConfig): Required<RetryConfig>;
declare const retryAsync: <T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number) => Promise<T>;
//#endregion
export { retryAsync as a, resolveRetryConfig as i, RetryInfo as n, RetryOptions as r, RetryConfig as t };