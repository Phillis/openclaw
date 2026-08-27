import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-C1p3Hf59.js";
import { a as GuardedFetchMode, i as ProviderRequestTransport, n as ResolvedProviderRequestConfig, o as GuardedFetchResult, r as ProviderRequestCapability, t as ModelProviderRequestTransportOverrides } from "./provider-request-config-wn7eqNvi.js";

//#region src/media-understanding/shared.d.ts
type ResolvedProviderHttpRequestConfig = {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  requestConfig: ResolvedProviderRequestConfig;
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
//#endregion
export { resolveProviderHttpRequestConfig as n, fetchWithTimeoutGuarded as t };