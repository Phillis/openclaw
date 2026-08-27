import { n as Api } from "./types-DTWCh4Mv.js";
import "./types-Cc0P-Eyx.js";
import { i as ModelDefinitionConfig, u as ConfiguredModelProviderRequest } from "./types.models-BxGvs1Ab.js";
import "./types-Ds34fJCS.js";
import { r as PluginMetadataSnapshotOwnerMaps } from "./plugin-metadata-snapshot.types-CzItNOEa.js";
import "./ssrf-CFXqHr3d.js";
import { t as RuntimeVersionEnv } from "./version-CR3y7QSr.js";
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
/** Parsed endpoint facts derived from provider id and base URL. */
type ProviderEndpointResolution = {
  endpointClass: ProviderEndpointClass;
  hostname?: string;
  googleVertexRegion?: string;
};
/** Raw model/provider fields accepted by policy resolution. */
type ProviderRequestPolicyInput = {
  provider?: string | null;
  api?: string | null;
  baseUrl?: string | null;
  transport?: ProviderRequestTransport;
  capability?: ProviderRequestCapability;
  providerMetadataOwners?: PluginMetadataSnapshotOwnerMaps;
};
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
/** Policy input plus model compatibility fields for feature-level capability resolution. */
type ProviderRequestCapabilitiesInput = ProviderRequestPolicyInput & {
  modelId?: string | null;
  compat?: unknown;
};
/** Known compatibility family that needs provider-specific request adjustments. */
type ProviderRequestCompatibilityFamily = "moonshot";
/** Feature capability facts for one resolved provider/model request route. */
type ProviderRequestCapabilities = ProviderRequestPolicyResolution & {
  isKnownNativeEndpoint: boolean;
  allowsOpenAIServiceTier: boolean;
  supportsOpenAIReasoningCompatPayload: boolean;
  allowsAnthropicServiceTier: boolean;
  supportsResponsesStoreField: boolean;
  allowsResponsesStore: boolean;
  shouldStripResponsesPromptCache: boolean;
  supportsNativeStreamingUsageCompat: boolean;
  supportsOpenAICompletionsStreamingUsageCompat: boolean;
  compatibilityFamily?: ProviderRequestCompatibilityFamily;
};
declare function resolveProviderEndpoint(baseUrl: string | null | undefined, providerMetadataOwners?: PluginMetadataSnapshotOwnerMaps): ProviderEndpointResolution;
declare function resolveProviderRequestPolicy(input: ProviderRequestPolicyInput, env?: RuntimeVersionEnv): ProviderRequestPolicyResolution;
declare function resolveProviderRequestCapabilities(input: ProviderRequestCapabilitiesInput, env?: RuntimeVersionEnv): ProviderRequestCapabilities;
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
type ProviderRequestHeaderPrecedence = "caller-wins" | "defaults-win";
/** Sanitizes model-level request overrides after secret resolution. */
declare function sanitizeConfiguredModelProviderRequest(request: ConfiguredModelProviderRequest | undefined): ModelProviderRequestTransportOverrides | undefined;
/** Normalizes provider base URLs by trimming trailing slashes. */
declare function normalizeBaseUrl(baseUrl: string | undefined, fallback: string): string;
declare function normalizeBaseUrl(baseUrl: string | undefined, fallback?: string): string | undefined;
/** Resolves final headers for one provider request route. */
declare function resolveProviderRequestHeaders(params: {
  provider: string;
  api?: RequestApi;
  baseUrl?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
  callerHeaders?: Record<string, string>;
  defaultHeaders?: Record<string, string>;
  precedence?: ProviderRequestHeaderPrecedence;
  request?: ProviderRequestTransportOverrides;
}): Record<string, string> | undefined;
//#endregion
export { ProviderRequestPolicyResolution as _, ProviderRequestTransportOverrides as a, resolveProviderRequestCapabilities as b, sanitizeConfiguredModelProviderRequest as c, ProviderEndpointResolution as d, ProviderRequestCapabilities as f, ProviderRequestPolicyInput as g, ProviderRequestCompatibilityFamily as h, ProviderRequestTlsOverride as i, ProviderAttributionPolicy as l, ProviderRequestCapability as m, ProviderRequestAuthOverride as n, normalizeBaseUrl as o, ProviderRequestCapabilitiesInput as p, ProviderRequestProxyOverride as r, resolveProviderRequestHeaders as s, ModelProviderRequestTransportOverrides as t, ProviderEndpointClass as u, ProviderRequestTransport as v, resolveProviderRequestPolicy as x, resolveProviderEndpoint as y };