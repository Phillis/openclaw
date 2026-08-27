import { IncomingMessage, ServerResponse } from "node:http";

//#region src/plugin-sdk/webhook-memory-guards.d.ts
/** In-memory fixed-window limiter used by webhook ingress handlers. */
type FixedWindowRateLimiter = {
  /** Return true once the key exceeds its allowed request count in the current window. */isRateLimited: (key: string, nowMs?: number) => boolean; /** Number of tracked keys currently retained in memory. */
  size: () => number; /** Drop all tracked keys and reset pruning state. */
  clear: () => void;
};
/** Default webhook ingress rate-limit settings for plugin monitors. */
declare const WEBHOOK_RATE_LIMIT_DEFAULTS: Readonly<{
  windowMs: 60000;
  maxRequests: 120;
  maxTrackedKeys: 4096;
}>;
/** Default cardinality and sampling settings for webhook anomaly counters. */
declare const WEBHOOK_ANOMALY_COUNTER_DEFAULTS: Readonly<{
  maxTrackedKeys: 4096;
  ttlMs: number;
  logEvery: 25;
}>;
/** Records repeated webhook failures and exposes bounded in-memory state controls. */
type WebhookAnomalyTracker = {
  /** Count one tracked status for a key; returns zero when the status/key is ignored. */record: (params: {
    /** Stable anomaly key, typically route plus sender or remote identity. */key: string; /** HTTP status to count when it is in the tracked status-code set. */
    statusCode: number; /** Build the sampled log message from the current key count. */
    message: (count: number) => string; /** Optional log sink invoked for the first hit and every sampled repeat. */
    log?: (message: string) => void; /** Clock override for deterministic tests. */
    nowMs?: number;
  }) => number; /** Number of tracked anomaly keys currently retained in memory. */
  size: () => number; /** Drop all tracked anomaly keys and reset pruning state. */
  clear: () => void;
};
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
declare function createFixedWindowRateLimiter(options: {
  /** Duration of one fixed window in milliseconds. */windowMs: number; /** Maximum accepted requests per key during one window. */
  maxRequests: number; /** Maximum number of keys retained before oldest entries are pruned. */
  maxTrackedKeys: number; /** Optional interval for expired-window pruning. Defaults to `windowMs`. */
  pruneIntervalMs?: number;
}): FixedWindowRateLimiter;
/** Track repeated webhook failures and emit sampled logs for suspicious request patterns. */
declare function createWebhookAnomalyTracker(options?: {
  /** Maximum number of anomaly keys retained before oldest entries are pruned. */maxTrackedKeys?: number; /** Key TTL in milliseconds; zero disables TTL expiry. */
  ttlMs?: number; /** Log every Nth repeat after the first hit. */
  logEvery?: number; /** HTTP status codes that should be counted as anomalies. */
  trackedStatusCodes?: readonly number[];
}): WebhookAnomalyTracker;
//#endregion
//#region src/plugin-sdk/webhook-request-guards.d.ts
/** Body-read profile for webhook payload limits before or after authentication. */
type WebhookBodyReadProfile = "pre-auth" | "post-auth";
/** Per-key in-flight limiter used to bound concurrent webhook handlers. */
type WebhookInFlightLimiter = {
  /** Acquire one in-flight slot for a key, returning false when the key is at capacity. */tryAcquire: (key: string) => boolean; /** Release one slot for a key after the handler completes. */
  release: (key: string) => void; /** Number of keys with retained in-flight state. */
  size: () => number; /** Drop all retained in-flight state. */
  clear: () => void;
};
/** Apply method, rate-limit, and content-type guards before a webhook handler reads the body. */
declare function applyBasicWebhookRequestGuards(params: {
  /** Incoming request to validate before body reads or handler dispatch. */req: IncomingMessage; /** Response used for method, rate-limit, or content-type rejections. */
  res: ServerResponse; /** Allowed HTTP methods; empty or omitted disables the method guard. */
  allowMethods?: readonly string[]; /** Optional fixed-window limiter for pre-body request throttling. */
  rateLimiter?: FixedWindowRateLimiter; /** Key passed to the rate limiter when throttling is enabled. */
  rateLimitKey?: string; /** Clock override for deterministic limiter tests. */
  nowMs?: number; /** Require JSON content type for POST requests. */
  requireJsonContentType?: boolean;
}): boolean;
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
declare function readJsonWebhookBodyOrReject(params: {
  /** Incoming request body stream to read and parse as JSON. */req: IncomingMessage; /** Response used for JSON parse, body size, timeout, or close failures. */
  res: ServerResponse; /** Optional maximum body size override in bytes. */
  maxBytes?: number; /** Optional body read timeout override in milliseconds. */
  timeoutMs?: number; /** Default limit profile to use when explicit limits are omitted. */
  profile?: WebhookBodyReadProfile; /** Treat an empty body as `{}` instead of rejecting it as invalid JSON. */
  emptyObjectOnEmpty?: boolean; /** Response body for malformed JSON. */
  invalidJsonMessage?: string;
}): Promise<{
  ok: true;
  value: unknown;
} | {
  ok: false;
}>;
//#endregion
export { WEBHOOK_ANOMALY_COUNTER_DEFAULTS as a, createWebhookAnomalyTracker as c, FixedWindowRateLimiter as i, applyBasicWebhookRequestGuards as n, WEBHOOK_RATE_LIMIT_DEFAULTS as o, readJsonWebhookBodyOrReject as r, createFixedWindowRateLimiter as s, WebhookInFlightLimiter as t };