import "../../acpx-Bsv7pbza.js";
import { n as PinnedDispatcherPolicy } from "../../ssrf-CTfgAjkq.js";
import { n as ProviderRequestTransportOverrides } from "../../provider-request-config-B67tGHJd.js";
import "../../provider-http-BQ0nquFZ.js";
import { t as parseGeminiAuth } from "../../gemini-auth-Ci5k3kk_.js";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "../../onboard-CoYMmjLV.js";
import { n as normalizeGoogleModelId, t as normalizeAntigravityModelId } from "../../model-id-5kQ-x9ee.js";
import { c as isGoogleGemini3ThinkingLevelModel, d as sanitizeGoogleThinkingPayload, f as stripInvalidGoogleThinkingBudget, i as GoogleThinkingLevel, l as isGoogleThinkingRequiredModel, n as createGoogleThinkingStreamWrapper, o as isGoogleGemini3FlashModel, r as GoogleThinkingInputLevel, s as isGoogleGemini3ProModel, t as createGoogleThinkingPayloadWrapper, u as resolveGoogleGemini3ThinkingLevel } from "../../thinking-api-DAvrJUWc.js";
import { n as createGoogleGenerativeAiTransportStreamFn, t as buildGoogleGenerativeAiParams } from "../../transport-stream-Di37aWrY.js";
import { a as shouldNormalizeGoogleGenerativeAiProviderConfig, c as isGoogleGenerativeAiApi, f as normalizeGoogleApiBaseUrl, l as isGoogleVertexBaseUrl, n as resolveGoogleGenerativeAiApiOrigin, o as shouldNormalizeGoogleProviderConfig, p as normalizeGoogleGenerativeAiBaseUrl, r as resolveGoogleGenerativeAiTransport, s as DEFAULT_GOOGLE_API_BASE_URL, t as normalizeGoogleProviderConfig, u as isGoogleVertexHostname } from "../../provider-policy-DuIUMvpp.js";
import { t as buildGoogleGeminiCliProvider } from "../../gemini-cli-provider-DEj9Blyu.js";
import { t as buildGoogleProvider } from "../../provider-registration-Gt8Tix-2.js";
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