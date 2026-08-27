import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-DvMBKwmI.js";
import { n as GuardedFetchResult, t as GuardedFetchMode } from "./fetch-guard-DNck_vGd.js";
import { n as ProviderRequestCapability, r as ProviderRequestTransport, t as ModelProviderRequestTransportOverrides } from "./provider-request-config-HOyBcQpb.js";
import "./provider-http-errors-VkT7IX7p.js";
//#region src/media-understanding/shared.d.ts
/** Static or per-call timeout resolver used by provider HTTP helpers. */
type ProviderOperationTimeoutMs = number | (() => number);
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
//#endregion
export { fetchWithTimeoutGuarded as n, resolveProviderHttpRequestConfig as r, ProviderOperationTimeoutMs as t };