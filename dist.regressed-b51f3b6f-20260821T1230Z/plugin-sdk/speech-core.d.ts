import { V as normalizeOptionalString } from "../types.openclaw-6A5yUI1l.js";
import { $n as SpeechProviderResolveTalkConfigContext, Bn as SpeechProviderPlugin, Gn as SpeechModelOverridePolicy, Hn as SpeechDirectiveTokenParseContext, Kn as SpeechProviderConfig, Qn as SpeechProviderResolveConfigContext, Un as SpeechDirectiveTokenParseResult, Wn as SpeechListVoicesRequest, Xn as SpeechProviderPrepareSynthesisContext, Yn as SpeechProviderOverrides, Zn as SpeechProviderPreparedSynthesis, ar as SpeechTelephonySynthesisRequest, b as TtsConfigResolutionContext, cr as TtsDirectiveParseResult, er as SpeechProviderResolveTalkOverridesContext, ir as SpeechSynthesisTarget, nr as SpeechSynthesisStreamRequest, or as SpeechVoiceOption, qn as SpeechProviderConfiguredContext, rr as SpeechSynthesisStreamResult, sr as TtsDirectiveOverrides, tr as SpeechSynthesisRequest, v as ResolvedTtsConfig, x as resolveEffectiveTtsConfig, y as ResolvedTtsModelOverrides } from "../types-BJ8oTDFw.js";
import { a as resolveSpeechProviderApiKey, c as normalizeTtsAutoMode, i as requireInRange, l as asBoolean, n as normalizeLanguageCode, o as scheduleCleanup, r as normalizeSeed, s as TTS_AUTO_MODES, t as normalizeApplyTextNormalization } from "../tts-provider-helpers-CpcTUh-T.js";
import { n as asOptionalRecord } from "../record-coerce-D4gfNjzB.js";
import { o as asFiniteNumber } from "../number-coercion-BMIVhtbY.js";
import { a as extractProviderErrorDetail, c as formatProviderHttpErrorMessage, h as truncateErrorDetail, i as createProviderHttpError, m as readResponseTextLimited, n as assertOkOrThrowProviderError, o as extractProviderRequestId, s as formatProviderErrorPayload } from "../provider-http-errors-CeG1AK9D.js";
import { t as summarizeText } from "../tts-core-DvSWAwGu.js";
import { a as normalizeSpeechProviderId, i as listSpeechProviders, n as getSpeechProvider, o as parseTtsDirectives, r as listLoadedSpeechProviders, t as canonicalizeSpeechProviderId } from "../provider-registry-CKDV-yzf.js";

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