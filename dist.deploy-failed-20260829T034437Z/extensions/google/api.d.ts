import "../../acpx-D5fMZfg0.js";
import { n as PinnedDispatcherPolicy } from "../../ssrf-CTfgAjkq.js";
import { n as ProviderRequestTransportOverrides } from "../../provider-request-config-BAddg9J0.js";
import "../../provider-http-CyNYsG6w.js";
import { t as parseGeminiAuth } from "../../gemini-auth-Ci5k3kk_.js";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "../../onboard-Cz76XXsM.js";
import { n as normalizeGoogleModelId, t as normalizeAntigravityModelId } from "../../model-id-5kQ-x9ee.js";
import { c as isGoogleGemini3ThinkingLevelModel, d as sanitizeGoogleThinkingPayload, f as stripInvalidGoogleThinkingBudget, i as GoogleThinkingLevel, l as isGoogleThinkingRequiredModel, n as createGoogleThinkingStreamWrapper, o as isGoogleGemini3FlashModel, r as GoogleThinkingInputLevel, s as isGoogleGemini3ProModel, t as createGoogleThinkingPayloadWrapper, u as resolveGoogleGemini3ThinkingLevel } from "../../thinking-api-CwapsLU0.js";
import { n as createGoogleGenerativeAiTransportStreamFn, t as buildGoogleGenerativeAiParams } from "../../transport-stream-Pz4_F74c.js";
import { a as shouldNormalizeGoogleGenerativeAiProviderConfig, c as isGoogleGenerativeAiApi, f as normalizeGoogleApiBaseUrl, l as isGoogleVertexBaseUrl, n as resolveGoogleGenerativeAiApiOrigin, o as shouldNormalizeGoogleProviderConfig, p as normalizeGoogleGenerativeAiBaseUrl, r as resolveGoogleGenerativeAiTransport, s as DEFAULT_GOOGLE_API_BASE_URL, t as normalizeGoogleProviderConfig, u as isGoogleVertexHostname } from "../../provider-policy-BaHAYB-Y.js";
import { t as buildGoogleGeminiCliProvider } from "../../gemini-cli-provider-1FBPqbUx.js";
import { t as buildGoogleProvider } from "../../provider-registration-MIlCIpZ8.js";
//#region extensions/google/api.d.ts
type GoogleGenerativeAiRequestOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
declare function resolveGoogleGenerativeAiHttpRequestConfig(params: {
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: GoogleGenerativeAiRequestOverrides;
  capability: "image" | "audio" | "video";
  transport: "http" | "media-understanding";
}): {
  baseUrl: string;
  allowPrivateNetwork: boolean;
  headers: Headers;
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
//#endregion
export { DEFAULT_GOOGLE_API_BASE_URL, GOOGLE_GEMINI_DEFAULT_MODEL, type GoogleThinkingInputLevel, type GoogleThinkingLevel, applyGoogleGeminiModelDefault, buildGoogleGeminiCliProvider, buildGoogleGenerativeAiParams, buildGoogleProvider, createGoogleGenerativeAiTransportStreamFn, createGoogleThinkingPayloadWrapper, createGoogleThinkingStreamWrapper, isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel, isGoogleGenerativeAiApi, isGoogleThinkingRequiredModel, isGoogleVertexBaseUrl, isGoogleVertexHostname, normalizeAntigravityModelId, normalizeGoogleApiBaseUrl, normalizeGoogleGenerativeAiBaseUrl, normalizeGoogleModelId, normalizeGoogleProviderConfig, parseGeminiAuth, resolveGoogleGemini3ThinkingLevel, resolveGoogleGenerativeAiApiOrigin, resolveGoogleGenerativeAiHttpRequestConfig, resolveGoogleGenerativeAiTransport, sanitizeGoogleThinkingPayload, shouldNormalizeGoogleGenerativeAiProviderConfig, shouldNormalizeGoogleProviderConfig, stripInvalidGoogleThinkingBudget };