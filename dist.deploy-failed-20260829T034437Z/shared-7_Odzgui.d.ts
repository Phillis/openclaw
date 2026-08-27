import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-CTfgAjkq.js";
import { a as GuardedFetchMode, i as ProviderRequestTransport, o as GuardedFetchResult, r as ProviderRequestCapability, t as ModelProviderRequestTransportOverrides } from "./provider-request-config-BAddg9J0.js";
import "./provider-http-errors-DsmoPCXa.js";
//#region src/provider-runtime/operation-retry.d.ts
type ProviderOperationRetryStage = "read" | "poll" | "download" | "create";
type TransientProviderRetryParams = {
  error: unknown;
  message: string;
  provider: string;
  apiKeyIndex: number;
  attemptNumber: number;
  stage?: ProviderOperationRetryStage;
};
type TransientProviderRetryOptions = {
  /**
   * Total executions, including the first call.
   * attempts: 2 means one initial call plus one retry.
   */
  attempts: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  signal?: AbortSignal;
  shouldRetry?: (params: TransientProviderRetryParams) => boolean;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
};
type TransientProviderRetryConfig = boolean | TransientProviderRetryOptions;
//#endregion
//#region src/media-understanding/shared.d.ts
type GuardedProviderRequestParams = {
  pinDns?: boolean;
  allowPrivateNetwork?: boolean;
  ssrfPolicy?: SsrFPolicy;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  auditContext?: string;
  /**
   * Override the guarded-fetch mode. Defaults to an auto-upgrade to
   * `TRUSTED_ENV_PROXY` when `HTTP_PROXY`/`HTTPS_PROXY` is configured in the
   * environment; pass `"strict"` to force pinned-DNS even inside a proxy.
   */
  mode?: GuardedFetchMode;
};
type ResolvedProviderHttpRequestConfig = {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
type ResolvedProviderHttpRequestConfigWithOriginTrust = ResolvedProviderHttpRequestConfig & {
  trustConfiguredBaseUrlOrigin: boolean;
};
declare function resolveProviderHttpRequestConfigWithOriginTrustInternal(params: {
  baseUrl?: string;
  defaultBaseUrl: string;
  allowPrivateNetwork?: boolean;
  headers?: HeadersInit;
  defaultHeaders?: Record<string, string>;
  request?: ModelProviderRequestTransportOverrides;
  provider?: string;
  api?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
}): ResolvedProviderHttpRequestConfigWithOriginTrust;
declare function resolveProviderHttpRequestConfig(params: Parameters<typeof resolveProviderHttpRequestConfigWithOriginTrustInternal>[0]): ResolvedProviderHttpRequestConfig;
declare function fetchWithTimeoutGuarded(url: string, init: RequestInit, timeoutMs: number | undefined, fetchFn: typeof fetch, options?: {
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  pinDns?: boolean;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  auditContext?: string;
  mode?: GuardedFetchMode;
}): Promise<GuardedFetchResult>;
type GuardedPostRequestRetryOptions = {
  /**
   * POST requests default to no retry because many provider endpoints create
   * billable jobs. Pass "read" only for read/analysis POST endpoints.
   */
  retryStage?: ProviderOperationRetryStage;
  retry?: TransientProviderRetryConfig;
};
type GuardedPostRequestParams<TBody> = GuardedProviderRequestParams & GuardedPostRequestRetryOptions & {
  url: string;
  headers: Headers;
  body: TBody;
  timeoutMs?: number;
  signal?: AbortSignal;
  fetchFn: typeof fetch;
};
declare function postJsonRequest(params: GuardedPostRequestParams<unknown>): Promise<GuardedFetchResult>;
//#endregion
export { postJsonRequest as n, resolveProviderHttpRequestConfig as r, fetchWithTimeoutGuarded as t };