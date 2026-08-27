import { V as normalizeOptionalString } from "../types.openclaw-CNftZ6Ix.js";
import { $n as SpeechProviderResolveTalkConfigContext, Bn as SpeechProviderPlugin, Gn as SpeechModelOverridePolicy, Hn as SpeechDirectiveTokenParseContext, Kn as SpeechProviderConfig, Qn as SpeechProviderResolveConfigContext, Un as SpeechDirectiveTokenParseResult, Wn as SpeechListVoicesRequest, Xn as SpeechProviderPrepareSynthesisContext, Yn as SpeechProviderOverrides, Zn as SpeechProviderPreparedSynthesis, ar as SpeechTelephonySynthesisRequest, cr as TtsDirectiveParseResult, er as SpeechProviderResolveTalkOverridesContext, ir as SpeechSynthesisTarget, nr as SpeechSynthesisStreamRequest, or as SpeechVoiceOption, qn as SpeechProviderConfiguredContext, rr as SpeechSynthesisStreamResult, sr as TtsDirectiveOverrides, tr as SpeechSynthesisRequest } from "../types-lxuSJRGv.js";
import { c as normalizeTtsAutoMode, i as requireInRange, l as asBoolean, n as normalizeLanguageCode, o as scheduleCleanup, r as normalizeSeed, s as TTS_AUTO_MODES, t as normalizeApplyTextNormalization } from "../tts-provider-helpers-C-dEEXry.js";
import { n as asOptionalRecord } from "../record-coerce-D4gfNjzB.js";
import { o as asFiniteNumber } from "../number-coercion-BMIVhtbY.js";
import { a as extractProviderErrorDetail, c as formatProviderHttpErrorMessage, h as truncateErrorDetail, i as createProviderHttpError, m as readResponseTextLimited, n as assertOkOrThrowProviderError, o as extractProviderRequestId, s as formatProviderErrorPayload } from "../provider-http-errors-CeG1AK9D.js";
import { a as normalizeSpeechProviderId, i as listSpeechProviders, n as getSpeechProvider, o as parseTtsDirectives, t as canonicalizeSpeechProviderId } from "../provider-registry-DkBH5kzs.js";

//#region src/tts/openai-compatible-speech-provider.d.ts
type OpenAiCompatibleSpeechProviderBaseConfig = {
  apiKey?: string;
  baseUrl?: string;
  model: string;
  voice: string;
  speed?: number;
  responseFormat?: string;
};
/** Normalized config shape for OpenAI-compatible speech HTTP providers. */
type OpenAiCompatibleSpeechProviderConfig<ExtraConfig extends Record<string, unknown> = Record<string, never>> = OpenAiCompatibleSpeechProviderBaseConfig & ExtraConfig;
/** Base URL normalization policy for providers that share OpenAI-style endpoints. */
type OpenAiCompatibleSpeechProviderBaseUrlPolicy = {
  kind: "trim-trailing-slash";
} | {
  kind: "canonical";
  aliases?: readonly string[];
  allowCustom?: boolean;
};
/** Extra config field to forward into the JSON body under an optional request key. */
type OpenAiCompatibleSpeechProviderExtraJsonBodyField<ExtraConfig extends Record<string, unknown>> = {
  configKey: Extract<keyof ExtraConfig, string>;
  requestKey?: string;
};
/** Factory options for a speech provider backed by /audio/speech-compatible HTTP APIs. */
type OpenAiCompatibleSpeechProviderOptions<ExtraConfig extends Record<string, unknown> = Record<string, never>> = {
  id: string;
  label: string;
  autoSelectOrder: number;
  models: readonly string[];
  voices: readonly string[];
  defaultModel: string;
  defaultVoice: string;
  defaultBaseUrl: string;
  envKey: string;
  responseFormats: readonly string[];
  defaultResponseFormat: string;
  voiceCompatibleResponseFormats: readonly string[];
  baseUrlPolicy?: OpenAiCompatibleSpeechProviderBaseUrlPolicy;
  normalizeModel?: (value: string | undefined, fallback: string) => string;
  configKey?: string;
  extraHeaders?: Record<string, string>;
  readExtraConfig?: (raw: Record<string, unknown> | undefined) => ExtraConfig;
  extraJsonBodyFields?: readonly OpenAiCompatibleSpeechProviderExtraJsonBodyField<ExtraConfig>[];
  apiErrorLabel?: string;
  missingApiKeyError?: string;
};
/** Build a complete SpeechProviderPlugin for OpenAI-compatible speech endpoints. */
declare function createOpenAiCompatibleSpeechProvider<ExtraConfig extends Record<string, unknown> = Record<string, never>>(options: OpenAiCompatibleSpeechProviderOptions<ExtraConfig>): SpeechProviderPlugin;
//#endregion
export { type OpenAiCompatibleSpeechProviderBaseUrlPolicy, type OpenAiCompatibleSpeechProviderConfig, type OpenAiCompatibleSpeechProviderExtraJsonBodyField, type OpenAiCompatibleSpeechProviderOptions, type SpeechDirectiveTokenParseContext, type SpeechDirectiveTokenParseResult, type SpeechListVoicesRequest, type SpeechModelOverridePolicy, type SpeechProviderConfig, type SpeechProviderConfiguredContext, type SpeechProviderOverrides, type SpeechProviderPlugin, type SpeechProviderPrepareSynthesisContext, type SpeechProviderPreparedSynthesis, type SpeechProviderResolveConfigContext, type SpeechProviderResolveTalkConfigContext, type SpeechProviderResolveTalkOverridesContext, type SpeechSynthesisRequest, type SpeechSynthesisStreamRequest, type SpeechSynthesisStreamResult, type SpeechSynthesisTarget, type SpeechTelephonySynthesisRequest, type SpeechVoiceOption, TTS_AUTO_MODES, type TtsDirectiveOverrides, type TtsDirectiveParseResult, asBoolean, asFiniteNumber, asOptionalRecord as asObject, assertOkOrThrowProviderError, canonicalizeSpeechProviderId, createOpenAiCompatibleSpeechProvider, createProviderHttpError, extractProviderErrorDetail, extractProviderRequestId, formatProviderErrorPayload, formatProviderHttpErrorMessage, getSpeechProvider, listSpeechProviders, normalizeApplyTextNormalization, normalizeLanguageCode, normalizeSeed, normalizeSpeechProviderId, normalizeTtsAutoMode, parseTtsDirectives, readResponseTextLimited, requireInRange, scheduleCleanup, normalizeOptionalString as trimToUndefined, truncateErrorDetail };