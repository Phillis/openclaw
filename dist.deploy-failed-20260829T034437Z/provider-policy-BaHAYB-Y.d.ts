import { At as ProviderThinkingProfile, kt as ProviderDefaultThinkingPolicyContext } from "./acpx-D5fMZfg0.js";
import { l as ModelProviderConfig } from "./types.openclaw-Ca71eRYk.js";
//#region extensions/google/src/google-api-base-url.d.ts
declare const DEFAULT_GOOGLE_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
/** Exact official AI Studio request root eligible for native provider behavior. */
declare function isOfficialGoogleAiStudioBaseUrl(baseUrl?: string | null): boolean;
declare function isGoogleVertexHostname(hostname: string): boolean;
declare function isGoogleVertexBaseUrl(baseUrl?: string | null): boolean;
declare function normalizeGoogleApiBaseUrl(baseUrl?: string): string;
declare function isGoogleGenerativeAiApi(api?: string | null): boolean;
declare function normalizeGoogleGenerativeAiBaseUrl(baseUrl?: string): string | undefined;
//#endregion
//#region extensions/google/provider-policy.d.ts
type GoogleApiCarrier = {
  api?: string | null;
};
type GoogleProviderConfigLike = GoogleApiCarrier & {
  baseUrl?: string | null;
  models?: ReadonlyArray<GoogleApiCarrier | null | undefined> | null;
};
declare function resolveGoogleGenerativeAiTransport<TApi extends string | null | undefined>(params: {
  provider?: string;
  api: TApi;
  baseUrl?: string;
}): {
  api: TApi | "google-generative-ai" | "google-vertex";
  baseUrl?: string;
};
declare function resolveGoogleGenerativeAiApiOrigin(baseUrl?: string): string;
declare function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
declare function shouldNormalizeGoogleProviderConfig(providerKey: string, provider: GoogleProviderConfigLike): boolean;
declare function normalizeGoogleProviderConfig(providerKey: string, provider: ModelProviderConfig): ModelProviderConfig;
declare function resolveGoogleThinkingProfile({ modelId, reasoning }: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { shouldNormalizeGoogleGenerativeAiProviderConfig as a, isGoogleGenerativeAiApi as c, isOfficialGoogleAiStudioBaseUrl as d, normalizeGoogleApiBaseUrl as f, resolveGoogleThinkingProfile as i, isGoogleVertexBaseUrl as l, resolveGoogleGenerativeAiApiOrigin as n, shouldNormalizeGoogleProviderConfig as o, normalizeGoogleGenerativeAiBaseUrl as p, resolveGoogleGenerativeAiTransport as r, DEFAULT_GOOGLE_API_BASE_URL as s, normalizeGoogleProviderConfig as t, isGoogleVertexHostname as u };