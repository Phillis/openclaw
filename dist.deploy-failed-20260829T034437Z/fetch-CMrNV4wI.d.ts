import { n as PinnedDispatcherPolicy, o as SsrFPolicy, t as LookupFn } from "./ssrf-DNrB9j1Q.js";
import { i as RetryOptions } from "./index-CVK1du31.js";
import { t as SavedMedia } from "./store-CU-s5VWG.js";
//#region src/media/audio.d.ts
/** Checks whether MIME type or filename is compatible with voice-message delivery. */
declare function isVoiceMessageCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean;
/**
 * Backward-compatible alias for voice-message audio compatibility checks.
 *
 * @deprecated Use isVoiceMessageCompatibleAudio.
 */
declare function isVoiceCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean;
//#endregion
//#region src/media/fetch.d.ts
/** Remote media bytes plus metadata before they are persisted to the media store. */
type FetchMediaResult = {
  buffer: Buffer;
  contentType?: string;
  fileName?: string;
};
/** Saved media record enriched with the best remote filename candidate. */
type SavedRemoteMedia = SavedMedia & {
  fileName?: string;
};
/** Closed error classes callers can use for retry and diagnostic policy. */
type MediaFetchErrorCode = "max_bytes" | "http_error" | "fetch_failed";
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
type MediaFetchRetryOptions = RetryOptions;
/** Structured fetch error used for retry decisions and caller-facing diagnostics. */
declare class MediaFetchError extends Error {
  readonly code: MediaFetchErrorCode;
  readonly status?: number;
  constructor(code: MediaFetchErrorCode, message: string, options?: {
    cause?: unknown;
    status?: number;
  });
}
/** Fetch-compatible injection point used by tests and guarded network callers. */
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
type FetchDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
  lookupFn?: LookupFn;
};
type FetchMediaOptions = {
  url: string;
  fetchImpl?: FetchLike;
  requestInit?: RequestInit;
  filePathHint?: string;
  maxBytes?: number;
  maxRedirects?: number;
  /** Require HTTPS for the initial URL and every redirect target. */
  requireHttps?: boolean;
  /** Abort the complete guarded fetch and body operation after this deadline (ms). */
  timeoutMs?: number;
  /** Abort if final response headers have not arrived by this deadline (ms). */
  responseHeaderTimeoutMs?: number;
  /** Abort if the response body stops yielding data for this long (ms). */
  readIdleTimeoutMs?: number;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  dispatcherAttempts?: FetchDispatcherAttempt[];
  shouldRetryFetchError?: (error: unknown) => boolean;
  /**
   * Retries the complete guarded fetch/read-or-save operation. Dispatcher
   * attempts still run inside each retry attempt.
   */
  retry?: MediaFetchRetryOptions;
  /**
   * Allow an operator-configured explicit proxy to resolve target DNS after
   * hostname-policy checks instead of forcing local pinned-DNS first.
   */
  trustExplicitProxyDns?: boolean;
};
/** Options for validating and saving an existing Response body into the media store. */
type SaveResponseMediaOptions = {
  sourceUrl?: string;
  filePathHint?: string;
  maxBytes?: number;
  readIdleTimeoutMs?: number;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Options for guarded URL fetches that are saved directly into the media store. */
type SaveRemoteMediaOptions = FetchMediaOptions & {
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
//#endregion
export { readRemoteMediaBuffer as a, isVoiceCompatibleAudio as c, fetchRemoteMedia as i, isVoiceMessageCompatibleAudio as l, MediaFetchError as n, saveRemoteMedia as o, SavedRemoteMedia as r, saveResponseMedia as s, FetchLike as t };