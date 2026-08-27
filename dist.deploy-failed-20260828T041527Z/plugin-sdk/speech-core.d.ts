import { H as normalizeOptionalString } from "../types.openclaw-DckSqIPo.js";
import { $t as listLoadedSpeechProviders, Ci as SpeechTelephonySynthesisRequest, Ei as TtsDirectiveParseResult, Jr as SpeechProviderPlugin, Qt as getSpeechProvider, Si as SpeechSynthesisTarget, Ti as TtsDirectiveOverrides, Zt as canonicalizeSpeechProviderId, _i as SpeechProviderResolveTalkConfigContext, _n as ResolvedTtsConfig, bi as SpeechSynthesisStreamRequest, ci as SpeechDirectiveTokenParseResult, di as SpeechProviderConfig, en as listSpeechProviders, fi as SpeechProviderConfiguredContext, gi as SpeechProviderResolveConfigContext, gn as summarizeText, hi as SpeechProviderPreparedSynthesis, hn as resolveEffectiveTtsConfig, li as SpeechListVoicesRequest, mi as SpeechProviderPrepareSynthesisContext, mn as TtsConfigResolutionContext, oi as parseTtsDirectives, pi as SpeechProviderOverrides, si as SpeechDirectiveTokenParseContext, tn as normalizeSpeechProviderId, ui as SpeechModelOverridePolicy, vi as SpeechProviderResolveTalkOverridesContext, vn as ResolvedTtsModelOverrides, wi as SpeechVoiceOption, xi as SpeechSynthesisStreamResult, yi as SpeechSynthesisRequest } from "../types-DP7cDwEi.js";
import { n as asOptionalRecord } from "../record-coerce-D4gfNjzB.js";
import { a as normalizeSeed, c as scheduleCleanup, i as normalizeLanguageCode, l as asBoolean, n as normalizeTtsAutoMode, o as requireInRange, r as normalizeApplyTextNormalization, s as resolveSpeechProviderApiKey, t as TTS_AUTO_MODES } from "../tts-auto-mode-oFIpet1I.js";
import { o as asFiniteNumber } from "../number-coercion-BMIVhtbY.js";
import { a as extractProviderErrorDetail, c as formatProviderHttpErrorMessage, h as truncateErrorDetail, i as createProviderHttpError, m as readResponseTextLimited, n as assertOkOrThrowProviderError, o as extractProviderRequestId, s as formatProviderErrorPayload } from "../provider-http-errors-CE8O184B.js";
//#region src/tts/directive-number.d.ts
/** Numeric directive parsing shared by speech providers with bounded knobs. */
type DirectiveNumberRange = {
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
};
/** Parse a numeric speech directive token and return provider overrides when policy allows it. */
declare function parseSpeechDirectiveNumberOverride(params: {
  ctx: SpeechDirectiveTokenParseContext;
  overrideKey: string;
  range: DirectiveNumberRange;
  warning: (value: string) => string;
  mergeCurrentOverrides?: boolean;
}): SpeechDirectiveTokenParseResult;
//#endregion
export { type ResolvedTtsConfig, type ResolvedTtsModelOverrides, type SpeechDirectiveTokenParseContext, type SpeechDirectiveTokenParseResult, type SpeechListVoicesRequest, type SpeechModelOverridePolicy, type SpeechProviderConfig, type SpeechProviderConfiguredContext, type SpeechProviderOverrides, type SpeechProviderPlugin, type SpeechProviderPrepareSynthesisContext, type SpeechProviderPreparedSynthesis, type SpeechProviderResolveConfigContext, type SpeechProviderResolveTalkConfigContext, type SpeechProviderResolveTalkOverridesContext, type SpeechSynthesisRequest, type SpeechSynthesisStreamRequest, type SpeechSynthesisStreamResult, type SpeechSynthesisTarget, type SpeechTelephonySynthesisRequest, type SpeechVoiceOption, TTS_AUTO_MODES, type TtsConfigResolutionContext, type TtsDirectiveOverrides, type TtsDirectiveParseResult, asBoolean, asFiniteNumber, asOptionalRecord as asObject, assertOkOrThrowProviderError, canonicalizeSpeechProviderId, createProviderHttpError, extractProviderErrorDetail, extractProviderRequestId, formatProviderErrorPayload, formatProviderHttpErrorMessage, getSpeechProvider, listLoadedSpeechProviders, listSpeechProviders, normalizeApplyTextNormalization, normalizeLanguageCode, normalizeSeed, normalizeSpeechProviderId, normalizeTtsAutoMode, parseSpeechDirectiveNumberOverride, parseTtsDirectives, readResponseTextLimited, requireInRange, resolveEffectiveTtsConfig, resolveSpeechProviderApiKey, scheduleCleanup, summarizeText, normalizeOptionalString as trimToUndefined, truncateErrorDetail };