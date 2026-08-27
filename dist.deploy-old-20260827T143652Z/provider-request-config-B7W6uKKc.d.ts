import { d as Api, o as ModelDefinitionConfig } from "./types.openclaw-eGZBtvai.js";
import { i as SsrFPolicy, n as PinnedDispatcherPolicy, t as LookupFn } from "./ssrf-CX7egwMk.js";
import { Dispatcher } from "undici";

//#region src/infra/net/pinned-dispatcher-pool.d.ts
type PinnedDispatcherLease = {
  dispatcher: Dispatcher;
  reused: boolean;
  release: () => Promise<void>;
};
type PinnedDispatcherPoolOptions = {
  maxEntries: number;
  idleTtlMs: number;
};
/**
 * Bounded cache of reusable DNS-pinned dispatchers.
 *
 * Callers must perform fresh DNS and SSRF validation before every acquisition
 * and include the resulting origin, address set, and connection policy in the key.
 */
declare class PinnedDispatcherPool {
  private readonly entries;
  private readonly ownedEntries;
  private readonly maxEntries;
  private readonly idleTtlMs;
  private closed;
  constructor(options: PinnedDispatcherPoolOptions);
  acquire(params: {
    key: string;
    groupKey: string;
    createDispatcher: () => Dispatcher;
  }): PinnedDispatcherLease | undefined;
  closeAll(): Promise<void>;
  private createLease;
  private retireEntry;
  private startClose;
}
//#endregion
//#region src/infra/net/fetch-guard.d.ts
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
declare const GUARDED_FETCH_MODE: {
  readonly STRICT: "strict";
  readonly TRUSTED_ENV_PROXY: "trusted_env_proxy";
  readonly TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy";
};
type GuardedFetchMode = (typeof GUARDED_FETCH_MODE)[keyof typeof GUARDED_FETCH_MODE];
type GuardedFetchOptions = {
  url: string;
  fetchImpl?: FetchLike;
  init?: RequestInit;
  capture?: false | {
    flowId?: string;
    meta?: Record<string, unknown>;
    sensitiveRequestHeaderNames?: readonly string[];
  };
  maxRedirects?: number;
  /**
   * Allow replaying unsafe request methods and bodies across cross-origin redirects.
   * Sensitive cross-origin headers (for example Authorization/Cookie) are still stripped.
   * Defaults to false.
   */
  allowCrossOriginUnsafeRedirectReplay?: boolean;
  timeoutMs?: number;
  signal?: AbortSignal;
  requireHttps?: boolean;
  policy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  retainAuthorizationRedirectHostnameAllowlist?: string[];
  mode?: GuardedFetchMode;
  pinDns?: boolean; /** @deprecated use `mode: "trusted_env_proxy"` for trusted/operator-controlled URLs. */
  proxy?: "env";
  /**
   * @deprecated use `mode: "trusted_env_proxy"` instead.
   */
  dangerouslyAllowEnvProxyWithoutPinnedDns?: boolean;
  auditContext?: string; /** Internal opt-in for reusing freshly revalidated, direct pinned dispatchers. */
  dispatcherPool?: PinnedDispatcherPool;
};
type GuardedFetchResult = {
  response: Response;
  finalUrl: string;
  release: () => Promise<void>;
  refreshTimeout?: () => void;
  dispatcherReused?: boolean;
};
declare function fetchWithSsrFGuard(params: GuardedFetchOptions): Promise<GuardedFetchResult>;
//#endregion
//#region src/agents/provider-attribution.d.ts
type ProviderAttributionVerification = "vendor-documented" | "vendor-hidden-api-spec" | "vendor-sdk-hook-only" | "internal-runtime";
type ProviderAttributionHook = "request-headers" | "default-headers" | "user-agent-extra" | "custom-user-agent";
/** Product attribution policy emitted for verified provider hooks. */
type ProviderAttributionPolicy = {
  provider: string;
  enabledByDefault: boolean;
  verification: ProviderAttributionVerification;
  hook?: ProviderAttributionHook;
  docsUrl?: string;
  reviewNote?: string;
  product: string;
  version: string;
  headers?: Record<string, string>;
};
/** Transport family used when resolving provider-specific request policy. */
type ProviderRequestTransport = "stream" | "websocket" | "http" | "media-understanding";
/** Capability family used when endpoint rules differ by media or LLM request type. */
type ProviderRequestCapability = "llm" | "audio" | "image" | "video" | "other";
/** Normalized endpoint class used by provider policy and SSRF/attribution decisions. */
type ProviderEndpointClass = "default" | "anthropic-public" | "cerebras-native" | "chutes-native" | "deepseek-native" | "github-copilot-native" | "groq-native" | "meta-native" | "mistral-public" | "minimax-native" | "moonshot-native" | "modelstudio-native" | "nvidia-native" | "openai-public" | "openai" | "opencode-native" | "azure-openai" | "openrouter" | "xai-native" | "xiaomi-native" | "zai-native" | "google-generative-ai" | "google-vertex" | "local" | "custom" | "invalid";
/** Provider policy facts consumed by transports before constructing a request. */
type ProviderRequestPolicyResolution = {
  provider?: string;
  policy?: ProviderAttributionPolicy;
  endpointClass: ProviderEndpointClass;
  usesConfiguredBaseUrl: boolean;
  knownProviderFamily: string;
  attributionProvider?: string;
  attributionHeaders?: Record<string, string>;
  allowsHiddenAttribution: boolean;
  usesKnownNativeOpenAIEndpoint: boolean;
  usesKnownNativeOpenAIRoute: boolean;
  usesVerifiedOpenAIAttributionHost: boolean;
  usesExplicitProxyLikeEndpoint: boolean;
};
//#endregion
//#region src/agents/provider-request-config.d.ts
type RequestApi = Api | ModelDefinitionConfig["api"];
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
/** Transport override block shared by provider and model request config. */
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
/** Model-scoped transport overrides, including private-network policy. */
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
type ResolvedProviderRequestAuthConfig = {
  configured: false;
  mode: "provider-default" | "authorization-bearer";
  injectAuthorizationHeader: boolean;
} | {
  configured: true;
  mode: "authorization-bearer";
  headerName: "Authorization";
  value: string;
  injectAuthorizationHeader: true;
} | {
  configured: true;
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
  injectAuthorizationHeader: false;
};
type ResolvedProviderRequestProxyConfig = {
  configured: false;
} | {
  configured: true;
  mode: "env-proxy";
  tls: ResolvedProviderRequestTlsConfig;
} | {
  configured: true;
  mode: "explicit-proxy";
  proxyUrl: string;
  tls: ResolvedProviderRequestTlsConfig;
};
type ResolvedProviderRequestTlsConfig = {
  configured: false;
} | {
  configured: true;
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  rejectUnauthorized?: boolean;
};
type ResolvedProviderRequestExtraHeadersConfig = {
  configured: boolean;
  headers?: Record<string, string>;
};
type ResolvedProviderRequestConfig = {
  api?: RequestApi;
  baseUrl?: string;
  headers?: Record<string, string>;
  extraHeaders: ResolvedProviderRequestExtraHeadersConfig;
  auth: ResolvedProviderRequestAuthConfig;
  proxy: ResolvedProviderRequestProxyConfig;
  tls: ResolvedProviderRequestTlsConfig;
  policy: ProviderRequestPolicyResolution;
};
//#endregion
export { ProviderRequestTransport as a, ProviderRequestCapability as i, ProviderRequestTransportOverrides as n, fetchWithSsrFGuard as o, ResolvedProviderRequestConfig as r, ModelProviderRequestTransportOverrides as t };