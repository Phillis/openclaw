import { FISH_AUDIO_STREAM_MAX_BYTES, fishAudioTts, fishAudioTtsStream, listFishAudioVoices, normalizeFishAudioBaseUrl } from "./tts.js";
import { resolveGeneratedMediaMaxBytes } from "openclaw/plugin-sdk/media-generation-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { asBoolean, parseSpeechDirectiveNumberOverride, resolveSpeechProviderApiKey, trimToUndefined } from "openclaw/plugin-sdk/speech-core";
import { asFiniteNumberInRange, asOptionalRecord, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/fish-audio-speech/speech-provider.ts
const FISH_AUDIO_MODELS = [
	"s2.1-pro-free",
	"s2.1-pro",
	"s2-pro",
	"s1"
];
const DEFAULT_MODEL = "s2.1-pro";
const DEFAULT_LATENCY = "balanced";
const DEFAULT_TIMEOUT_MS = 24e4;
function normalizeModel(value) {
	const model = trimToUndefined(value);
	if (!model) return DEFAULT_MODEL;
	if (FISH_AUDIO_MODELS.some((candidate) => candidate === model)) return model;
	throw new Error(`invalid Fish Audio model "${model}"`);
}
function normalizeLatency(value) {
	const latency = trimToUndefined(value)?.toLowerCase();
	if (!latency) return DEFAULT_LATENCY;
	if (latency === "low" || latency === "balanced" || latency === "normal") return latency;
	throw new Error(`invalid Fish Audio latency "${latency}"`);
}
function normalizeNumber(value, min, max) {
	return asFiniteNumberInRange(value, {
		min,
		max
	});
}
function resolveReferenceId(raw) {
	return trimToUndefined(raw?.speakerVoiceId ?? raw?.voiceId ?? raw?.referenceId);
}
function normalizeProviderConfig(rawConfig) {
	const raw = asOptionalRecord(asOptionalRecord(rawConfig.providers)?.["fish-audio"]) ?? asOptionalRecord(rawConfig["fish-audio"]);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.fish-audio.apiKey"
		}),
		baseUrl: normalizeFishAudioBaseUrl(trimToUndefined(raw?.baseUrl)),
		model: normalizeModel(raw?.model ?? raw?.modelId),
		referenceId: resolveReferenceId(raw),
		latency: normalizeLatency(raw?.latency),
		speed: normalizeNumber(raw?.speed, .5, 2),
		temperature: normalizeNumber(raw?.temperature, 0, 1),
		topP: normalizeNumber(raw?.topP ?? raw?.top_p, 0, 1),
		normalize: asBoolean(raw?.normalize)
	};
}
function readProviderConfig(config) {
	const defaults = normalizeProviderConfig({});
	const raw = asOptionalRecord(config) ?? {};
	return {
		apiKey: trimToUndefined(raw.apiKey) ?? defaults.apiKey,
		baseUrl: normalizeFishAudioBaseUrl(trimToUndefined(raw.baseUrl) ?? defaults.baseUrl),
		model: normalizeModel(raw.model ?? raw.modelId ?? defaults.model),
		referenceId: resolveReferenceId(raw) ?? defaults.referenceId,
		latency: normalizeLatency(raw.latency ?? defaults.latency),
		speed: normalizeNumber(raw.speed, .5, 2) ?? defaults.speed,
		temperature: normalizeNumber(raw.temperature, 0, 1) ?? defaults.temperature,
		topP: normalizeNumber(raw.topP ?? raw.top_p, 0, 1) ?? defaults.topP,
		normalize: asBoolean(raw.normalize) ?? defaults.normalize
	};
}
function readOverrides(overrides) {
	const raw = asOptionalRecord(overrides) ?? {};
	return {
		model: trimToUndefined(raw.model ?? raw.modelId) ? normalizeModel(raw.model ?? raw.modelId) : void 0,
		referenceId: resolveReferenceId(raw),
		latency: trimToUndefined(raw.latency) ? normalizeLatency(raw.latency) : void 0,
		speed: normalizeNumber(raw.speed, .5, 2),
		temperature: normalizeNumber(raw.temperature, 0, 1),
		topP: normalizeNumber(raw.topP ?? raw.top_p, 0, 1),
		normalize: asBoolean(raw.normalize)
	};
}
function resolveApiKey(configValue) {
	return resolveSpeechProviderApiKey(configValue, process.env.FISH_API_KEY, process.env.FISH_AUDIO_API_KEY);
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voiceid":
		case "voice_id":
		case "referenceid":
		case "reference_id":
		case "fish_voice":
		case "fishaudio_voice": return ctx.policy.allowVoice ? {
			handled: true,
			overrides: {
				...ctx.currentOverrides,
				referenceId: ctx.value
			}
		} : { handled: true };
		case "model":
		case "modelid":
		case "model_id":
		case "fish_model":
		case "fishaudio_model":
			if (!ctx.policy.allowModelId) return { handled: true };
			try {
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						model: normalizeModel(ctx.value)
					}
				};
			} catch (error) {
				return {
					handled: true,
					warnings: [String(error)]
				};
			}
		case "speed":
		case "fish_speed": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "speed",
			range: {
				min: .5,
				max: 2
			},
			warning: (value) => `invalid Fish Audio speed "${value}"`
		});
		case "temperature":
		case "fish_temperature": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "temperature",
			range: {
				min: 0,
				max: 1
			},
			warning: (value) => `invalid Fish Audio temperature "${value}"`
		});
		case "top_p":
		case "topp":
		case "fish_top_p": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "topP",
			range: {
				min: 0,
				max: 1
			},
			warning: (value) => `invalid Fish Audio top_p "${value}"`
		});
		case "latency":
		case "fish_latency":
			if (!ctx.policy.allowVoiceSettings) return { handled: true };
			try {
				return {
					handled: true,
					overrides: {
						...ctx.currentOverrides,
						latency: normalizeLatency(ctx.value)
					}
				};
			} catch (error) {
				return {
					handled: true,
					warnings: [String(error)]
				};
			}
		case "normalize":
		case "fish_normalize": {
			if (!ctx.policy.allowNormalization) return { handled: true };
			const normalize = parseBooleanValue(ctx.value);
			if (normalize !== void 0) return {
				handled: true,
				overrides: {
					...ctx.currentOverrides,
					normalize
				}
			};
			return {
				handled: true,
				warnings: [`invalid Fish Audio normalize "${ctx.value}"`]
			};
		}
		default: return { handled: false };
	}
}
function resolveFormat(target) {
	if (target === "voice-note") return {
		format: "opus",
		sampleRate: 48e3,
		fileExtension: ".opus",
		voiceCompatible: true
	};
	if (target === "telephony") return {
		format: "pcm",
		sampleRate: 8e3,
		fileExtension: ".pcm",
		voiceCompatible: false
	};
	return {
		format: "mp3",
		sampleRate: 44100,
		fileExtension: ".mp3",
		voiceCompatible: false
	};
}
function resolveSynthesisRequest(req) {
	const config = readProviderConfig(req.providerConfig);
	const overrides = readOverrides(req.providerOverrides);
	const apiKey = resolveApiKey(config.apiKey);
	if (!apiKey) throw new Error("Fish Audio API key missing");
	const output = resolveFormat(req.target);
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		model: overrides.model ?? config.model,
		referenceId: overrides.referenceId ?? config.referenceId,
		latency: overrides.latency ?? config.latency,
		speed: overrides.speed ?? config.speed,
		temperature: overrides.temperature ?? config.temperature,
		topP: overrides.topP ?? config.topP,
		normalize: overrides.normalize ?? config.normalize,
		timeoutMs: req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio"),
		...output
	};
}
function buildFishAudioSpeechProvider() {
	return {
		id: "fish-audio",
		label: "Fish Audio",
		autoSelectOrder: 28,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		defaultModel: DEFAULT_MODEL,
		models: FISH_AUDIO_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeProviderConfig(baseTtsConfig),
				...talkProviderConfig.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
					value: talkProviderConfig.apiKey,
					path: "talk.providers.fish-audio.apiKey"
				}) },
				...trimToUndefined(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeFishAudioBaseUrl(trimToUndefined(talkProviderConfig.baseUrl)) },
				...trimToUndefined(talkProviderConfig.modelId ?? talkProviderConfig.model) == null ? {} : { model: normalizeModel(talkProviderConfig.modelId ?? talkProviderConfig.model) },
				...resolveReferenceId(talkProviderConfig) == null ? {} : { referenceId: resolveReferenceId(talkProviderConfig) },
				...trimToUndefined(talkProviderConfig.latency) == null ? {} : { latency: normalizeLatency(talkProviderConfig.latency) },
				...normalizeNumber(talkProviderConfig.speed, .5, 2) == null ? {} : { speed: normalizeNumber(talkProviderConfig.speed, .5, 2) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...trimToUndefined(params.modelId ?? params.model) == null ? {} : { model: normalizeModel(params.modelId ?? params.model) },
			...resolveReferenceId(params) == null ? {} : { referenceId: resolveReferenceId(params) },
			...normalizeNumber(params.speed, .5, 2) == null ? {} : { speed: normalizeNumber(params.speed, .5, 2) }
		}),
		listVoices: async (req) => {
			const config = readProviderConfig(req.providerConfig ?? {});
			const apiKey = resolveApiKey(trimToUndefined(req.apiKey) ?? config.apiKey);
			if (!apiKey) throw new Error("Fish Audio API key missing");
			return await listFishAudioVoices({
				apiKey,
				baseUrl: normalizeFishAudioBaseUrl(trimToUndefined(req.baseUrl) ?? config.baseUrl),
				timeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS
			});
		},
		isConfigured: ({ providerConfig }) => Boolean(resolveApiKey(readProviderConfig(providerConfig).apiKey)),
		synthesize: async (req) => {
			const params = resolveSynthesisRequest(req);
			return {
				audioBuffer: await fishAudioTts(params),
				outputFormat: params.format,
				fileExtension: params.fileExtension,
				voiceCompatible: params.voiceCompatible
			};
		},
		streamSynthesize: async (req) => {
			const params = resolveSynthesisRequest(req);
			const stream = await fishAudioTtsStream({
				...params,
				maxBytes: Math.min(params.maxBytes, FISH_AUDIO_STREAM_MAX_BYTES)
			});
			return {
				audioStream: stream.audioStream,
				outputFormat: params.format,
				fileExtension: params.fileExtension,
				voiceCompatible: params.voiceCompatible,
				release: stream.release
			};
		},
		synthesizeTelephony: async (req) => {
			return {
				audioBuffer: await fishAudioTts(resolveSynthesisRequest({
					...req,
					target: "telephony"
				})),
				outputFormat: "pcm",
				sampleRate: 8e3
			};
		}
	};
}
//#endregion
export { buildFishAudioSpeechProvider };
