import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as parseBooleanValue, t as asBoolean } from "./boolean-DmBL0YJK.js";
import { S as parseStrictInteger, s as asFiniteNumber, x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { m as normalizeResolvedSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-UFPP-fbI.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Dj5fUySl.js";
import { p as readProviderJsonResponse, r as assertOkOrThrowProviderError } from "./provider-http-errors-BH2HGv8j.js";
import { a as resolveSpeechProviderApiKey, i as requireInRange, n as normalizeLanguageCode, r as normalizeSeed, t as normalizeApplyTextNormalization } from "./tts-provider-helpers-DAXQcw0n.js";
import "./error-runtime-CmlvK1A3.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./secret-input-Dv7SE4A5.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./provider-http-RuCpoOP3.js";
import "./speech-core-BRO8UaZ2.js";
import "./speech-fZK6lbDh.js";
import { n as isValidElevenLabsVoiceId, r as normalizeElevenLabsBaseUrl } from "./shared-C4zbmF0I.js";
import { r as resolveElevenLabsApiKeyWithProfileFallback } from "./config-compat-DRnArMlG.js";
import "./config-api-C_plwspP.js";
import { n as elevenLabsTTSStream, t as elevenLabsTTS } from "./tts-LmHPxcGa.js";
//#region extensions/elevenlabs/speech-provider.ts
const DEFAULT_ELEVENLABS_VOICE_ID = "pMsXgVXv3BLzUgSXRplE";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_VOICE_SETTINGS = {
	stability: .5,
	similarityBoost: .75,
	style: 0,
	useSpeakerBoost: true,
	speed: 1
};
const ELEVENLABS_TTS_MODELS = [
	"eleven_v3",
	"eleven_multilingual_v2",
	"eleven_flash_v2_5",
	"eleven_flash_v2",
	"eleven_turbo_v2_5",
	"eleven_monolingual_v1"
];
function normalizeElevenLabsTtsModelId(value) {
	switch (value) {
		case "eleven_turbo_v2_5": return "eleven_flash_v2_5";
		case "eleven_turbo_v2": return "eleven_flash_v2";
		default: return value;
	}
}
function parseNumberValue(value) {
	return parseStrictFiniteNumber(value);
}
function normalizeVoiceSetting(value, min, max) {
	const number = asFiniteNumber(value);
	return number !== void 0 && number >= min && number <= max ? number : void 0;
}
function normalizeElevenLabsSeed(value) {
	const seed = asFiniteNumber(value);
	return seed !== void 0 && Number.isSafeInteger(seed) && seed >= 0 && seed <= 4294967295 ? seed : void 0;
}
function normalizeElevenLabsLatencyTier(value) {
	const latencyTier = asFiniteNumber(value);
	return latencyTier !== void 0 && Number.isSafeInteger(latencyTier) && latencyTier >= 0 && latencyTier <= 4 ? latencyTier : void 0;
}
function normalizeVoiceSettings(rawVoiceSettings) {
	return {
		...normalizeVoiceSetting(rawVoiceSettings?.stability, 0, 1) == null ? {} : { stability: normalizeVoiceSetting(rawVoiceSettings?.stability, 0, 1) },
		...normalizeVoiceSetting(rawVoiceSettings?.similarityBoost, 0, 1) == null ? {} : { similarityBoost: normalizeVoiceSetting(rawVoiceSettings?.similarityBoost, 0, 1) },
		...normalizeVoiceSetting(rawVoiceSettings?.style, 0, 1) == null ? {} : { style: normalizeVoiceSetting(rawVoiceSettings?.style, 0, 1) },
		...asBoolean(rawVoiceSettings?.useSpeakerBoost) == null ? {} : { useSpeakerBoost: asBoolean(rawVoiceSettings?.useSpeakerBoost) },
		...normalizeVoiceSetting(rawVoiceSettings?.speed, .5, 2) == null ? {} : { speed: normalizeVoiceSetting(rawVoiceSettings?.speed, .5, 2) }
	};
}
function normalizeElevenLabsProviderConfig(rawConfig) {
	const raw = asOptionalRecord(asOptionalRecord(rawConfig.providers)?.elevenlabs) ?? asOptionalRecord(rawConfig.elevenlabs);
	const rawVoiceSettings = asOptionalRecord(raw?.voiceSettings);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.elevenlabs.apiKey"
		}),
		baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? DEFAULT_ELEVENLABS_VOICE_ID,
		modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(raw?.modelId)) ?? DEFAULT_ELEVENLABS_MODEL_ID,
		seed: normalizeElevenLabsSeed(raw?.seed),
		applyTextNormalization: normalizeOptionalString(raw?.applyTextNormalization),
		languageCode: normalizeOptionalString(raw?.languageCode),
		voiceSettings: {
			...DEFAULT_ELEVENLABS_VOICE_SETTINGS,
			...normalizeVoiceSettings(rawVoiceSettings)
		}
	};
}
function readElevenLabsProviderConfig(config) {
	const defaults = normalizeElevenLabsProviderConfig({});
	const voiceSettings = asOptionalRecord(config.voiceSettings);
	return {
		apiKey: normalizeOptionalString(config.apiKey) ?? defaults.apiKey,
		baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(config.baseUrl) ?? defaults.baseUrl),
		voiceId: normalizeOptionalString(config.voiceId) ?? defaults.voiceId,
		modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(config.modelId)) ?? defaults.modelId,
		seed: normalizeElevenLabsSeed(config.seed) ?? defaults.seed,
		applyTextNormalization: normalizeOptionalString(config.applyTextNormalization) ?? defaults.applyTextNormalization,
		languageCode: normalizeOptionalString(config.languageCode) ?? defaults.languageCode,
		voiceSettings: {
			...defaults.voiceSettings,
			...normalizeVoiceSettings(voiceSettings)
		}
	};
}
function resolveElevenLabsApiKey(...candidates) {
	return resolveSpeechProviderApiKey(...candidates, resolveElevenLabsApiKeyWithProfileFallback() ?? void 0, process.env.XI_API_KEY);
}
function resolveElevenLabsTalkApiKey(config) {
	if (config.apiKey === void 0) return resolveElevenLabsApiKey();
	return normalizeResolvedSecretInputString({
		value: config.apiKey,
		path: "talk.providers.elevenlabs.apiKey"
	});
}
function mergeVoiceSettingsOverride(ctx, next) {
	return {
		...ctx.currentOverrides,
		voiceSettings: {
			...asOptionalRecord(ctx.currentOverrides?.voiceSettings),
			...next
		}
	};
}
function resolveVoiceSettingsOverride(base, overrides) {
	const voiceSettings = asOptionalRecord(overrides);
	return {
		...base,
		...normalizeVoiceSettings(voiceSettings)
	};
}
function parseDirectiveToken(ctx) {
	try {
		switch (ctx.key) {
			case "voiceid":
			case "voice_id":
			case "elevenlabs_voice":
			case "elevenlabsvoice":
				if (!ctx.policy.allowVoice) return { handled: true };
				if (!isValidElevenLabsVoiceId(ctx.value)) return {
					handled: true,
					warnings: [`invalid ElevenLabs voiceId "${ctx.value}"`]
				};
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						voiceId: ctx.value
					}
				};
			case "model":
			case "modelid":
			case "model_id":
			case "elevenlabs_model":
			case "elevenlabsmodel":
				if (!ctx.policy.allowModelId) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						modelId: normalizeElevenLabsTtsModelId(ctx.value)
					}
				};
			case "stability": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid stability value"]
				};
				requireInRange(value, 0, 1, "stability");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { stability: value })
				};
			}
			case "similarity":
			case "similarityboost":
			case "similarity_boost": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid similarityBoost value"]
				};
				requireInRange(value, 0, 1, "similarityBoost");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { similarityBoost: value })
				};
			}
			case "style": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid style value"]
				};
				requireInRange(value, 0, 1, "style");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { style: value })
				};
			}
			case "speed": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseNumberValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid speed value"]
				};
				requireInRange(value, .5, 2, "speed");
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { speed: value })
				};
			}
			case "speakerboost":
			case "speaker_boost":
			case "usespeakerboost":
			case "use_speaker_boost": {
				if (!ctx.policy.allowVoiceSettings) return { handled: true };
				const value = parseBooleanValue(ctx.value);
				if (value == null) return {
					handled: true,
					warnings: ["invalid useSpeakerBoost value"]
				};
				return {
					handled: true,
					overrides: mergeVoiceSettingsOverride(ctx, { useSpeakerBoost: value })
				};
			}
			case "normalize":
			case "applytextnormalization":
			case "apply_text_normalization":
				if (!ctx.policy.allowNormalization) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						applyTextNormalization: normalizeApplyTextNormalization(ctx.value)
					}
				};
			case "language":
			case "languagecode":
			case "language_code":
				if (!ctx.policy.allowNormalization) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						languageCode: normalizeLanguageCode(ctx.value)
					}
				};
			case "seed":
				if (!ctx.policy.allowSeed) return { handled: true };
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						seed: normalizeSeed(parseStrictInteger(ctx.value) ?? NaN)
					}
				};
			default: return { handled: false };
		}
	} catch (error) {
		return {
			handled: true,
			warnings: [formatErrorMessage(error)]
		};
	}
}
async function listElevenLabsVoices(params) {
	const normalizedBaseUrl = normalizeElevenLabsBaseUrl(params.baseUrl);
	const { response, release } = await fetchWithSsrFGuard({
		url: `${normalizedBaseUrl}/v1/voices`,
		init: { headers: { "xi-api-key": params.apiKey } },
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
		auditContext: "elevenlabs.voices"
	});
	try {
		await assertOkOrThrowProviderError(response, "ElevenLabs voices API error");
		const json = await readProviderJsonResponse(response, "elevenlabs.voices");
		return Array.isArray(json.voices) ? json.voices.map((voice) => ({
			id: voice.voice_id?.trim() ?? "",
			name: normalizeOptionalString(voice.name),
			category: normalizeOptionalString(voice.category),
			description: normalizeOptionalString(voice.description)
		})).filter((voice) => voice.id.length > 0) : [];
	} finally {
		await release();
	}
}
function resolveElevenLabsTtsRequest(req, options) {
	const config = readElevenLabsProviderConfig(req.providerConfig);
	const overrides = req.providerOverrides ?? {};
	const apiKey = resolveElevenLabsApiKey(config.apiKey);
	if (!apiKey) throw new Error("ElevenLabs API key missing");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		voiceId: normalizeOptionalString(overrides.voiceId) ?? config.voiceId,
		modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(overrides.modelId)) ?? config.modelId,
		outputFormat: options.outputFormat,
		seed: normalizeElevenLabsSeed(overrides.seed) ?? config.seed,
		applyTextNormalization: normalizeOptionalString(overrides.applyTextNormalization) ?? config.applyTextNormalization,
		languageCode: normalizeOptionalString(overrides.languageCode) ?? config.languageCode,
		latencyTier: options.latencyTier,
		voiceSettings: resolveVoiceSettingsOverride(config.voiceSettings, overrides.voiceSettings),
		timeoutMs: req.timeoutMs
	};
}
function buildElevenLabsSpeechProvider() {
	return {
		id: "elevenlabs",
		label: "ElevenLabs",
		autoSelectOrder: 20,
		defaultModel: DEFAULT_ELEVENLABS_MODEL_ID,
		models: ELEVENLABS_TTS_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeElevenLabsProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeElevenLabsProviderConfig(baseTtsConfig);
			const talkVoiceSettings = asOptionalRecord(talkProviderConfig.voiceSettings);
			const resolvedTalkApiKey = resolveElevenLabsTalkApiKey(talkProviderConfig);
			return {
				...base,
				...resolvedTalkApiKey === void 0 ? {} : { apiKey: resolvedTalkApiKey },
				...normalizeOptionalString(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)) },
				...normalizeOptionalString(talkProviderConfig.voiceId) == null ? {} : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) },
				...normalizeOptionalString(talkProviderConfig.modelId) == null ? {} : { modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(talkProviderConfig.modelId)) },
				...normalizeElevenLabsSeed(talkProviderConfig.seed) == null ? {} : { seed: normalizeElevenLabsSeed(talkProviderConfig.seed) },
				...normalizeOptionalString(talkProviderConfig.applyTextNormalization) == null ? {} : { applyTextNormalization: normalizeApplyTextNormalization(normalizeOptionalString(talkProviderConfig.applyTextNormalization)) },
				...normalizeOptionalString(talkProviderConfig.languageCode) == null ? {} : { languageCode: normalizeLanguageCode(normalizeOptionalString(talkProviderConfig.languageCode)) },
				voiceSettings: {
					...base.voiceSettings,
					...normalizeVoiceSettings(talkVoiceSettings)
				}
			};
		},
		resolveTalkOverrides: ({ params }) => {
			const normalize = normalizeOptionalString(params.normalize);
			const language = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.language));
			const latencyTier = normalizeElevenLabsLatencyTier(params.latencyTier);
			const voiceSettings = {
				...normalizeVoiceSetting(params.speed, .5, 2) == null ? {} : { speed: normalizeVoiceSetting(params.speed, .5, 2) },
				...normalizeVoiceSetting(params.stability, 0, 1) == null ? {} : { stability: normalizeVoiceSetting(params.stability, 0, 1) },
				...normalizeVoiceSetting(params.similarity, 0, 1) == null ? {} : { similarityBoost: normalizeVoiceSetting(params.similarity, 0, 1) },
				...normalizeVoiceSetting(params.style, 0, 1) == null ? {} : { style: normalizeVoiceSetting(params.style, 0, 1) },
				...asBoolean(params.speakerBoost) == null ? {} : { useSpeakerBoost: asBoolean(params.speakerBoost) }
			};
			return {
				...normalizeOptionalString(params.voiceId) == null ? {} : { voiceId: normalizeOptionalString(params.voiceId) },
				...normalizeOptionalString(params.modelId) == null ? {} : { modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(params.modelId)) },
				...normalizeOptionalString(params.outputFormat) == null ? {} : { outputFormat: normalizeOptionalString(params.outputFormat) },
				...normalizeElevenLabsSeed(params.seed) == null ? {} : { seed: normalizeElevenLabsSeed(params.seed) },
				...normalize == null ? {} : { applyTextNormalization: normalizeApplyTextNormalization(normalize) },
				...language == null ? {} : { languageCode: normalizeLanguageCode(language) },
				...latencyTier == null ? {} : { latencyTier },
				...Object.keys(voiceSettings).length === 0 ? {} : { voiceSettings }
			};
		},
		listVoices: async (req) => {
			const config = req.providerConfig ? readElevenLabsProviderConfig(req.providerConfig) : void 0;
			const requestValue = req.apiKey;
			const configValue = config?.apiKey;
			const apiKey = resolveElevenLabsApiKey(requestValue, configValue);
			if (!apiKey) throw new Error("ElevenLabs API key missing");
			return listElevenLabsVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				timeoutMs: req.timeoutMs
			});
		},
		isConfigured: ({ providerConfig }) => Boolean(resolveElevenLabsApiKey(readElevenLabsProviderConfig(providerConfig).apiKey)),
		synthesize: async (req) => {
			const overrides = req.providerOverrides ?? {};
			const outputFormat = normalizeOptionalString(overrides.outputFormat) ?? (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
			return {
				audioBuffer: await elevenLabsTTS(resolveElevenLabsTtsRequest(req, {
					outputFormat,
					latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier)
				})),
				outputFormat,
				fileExtension: req.target === "voice-note" ? ".opus" : ".mp3",
				voiceCompatible: req.target === "voice-note"
			};
		},
		streamSynthesize: async (req) => {
			const overrides = req.providerOverrides ?? {};
			const outputFormat = normalizeOptionalString(overrides.outputFormat) ?? (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
			const stream = await elevenLabsTTSStream(resolveElevenLabsTtsRequest(req, {
				outputFormat,
				latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier)
			}));
			return {
				audioStream: stream.audioStream,
				outputFormat,
				fileExtension: req.target === "voice-note" ? ".opus" : ".mp3",
				voiceCompatible: req.target === "voice-note",
				release: stream.release
			};
		},
		synthesizeTelephony: async (req) => {
			const outputFormat = "pcm_22050";
			return {
				audioBuffer: await elevenLabsTTS(resolveElevenLabsTtsRequest(req, { outputFormat })),
				outputFormat,
				sampleRate: 22050
			};
		}
	};
}
//#endregion
export { buildElevenLabsSpeechProvider as t };
