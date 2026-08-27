import { n as PinnedDispatcherPolicy } from "./ssrf-CX7egwMk.js";
import { a as ProviderRequestTransport, i as ProviderRequestCapability, r as ResolvedProviderRequestConfig, t as ModelProviderRequestTransportOverrides } from "./provider-request-config-B3PbEfcF.js";

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
//#endregion
export { resolveProviderHttpRequestConfig as t };