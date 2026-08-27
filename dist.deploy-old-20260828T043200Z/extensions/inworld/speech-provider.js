import { DEFAULT_INWORLD_MODEL_ID, INWORLD_TTS_MODELS, inworldTTS, listInworldVoices, normalizeInworldBaseUrl } from "./tts.js";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { parseSpeechDirectiveNumberOverride, resolveSpeechProviderApiKey, trimToUndefined } from "openclaw/plugin-sdk/speech-core";
import { asFiniteNumberInRange, asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/inworld/speech-provider.ts
function normalizeInworldTemperature(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		minExclusive: true,
		max: 2
	});
}
function normalizeInworldProviderConfig(rawConfig) {
	const raw = asOptionalRecord(asOptionalRecord(rawConfig.providers)?.inworld) ?? asOptionalRecord(rawConfig.inworld);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.inworld.apiKey"
		}),
		baseUrl: normalizeInworldBaseUrl(trimToUndefined(raw?.baseUrl)),
		voiceId: trimToUndefined(raw?.voiceId) ?? "Sarah",
		modelId: trimToUndefined(raw?.modelId) ?? "inworld-tts-1.5-max",
		temperature: normalizeInworldTemperature(raw?.temperature)
	};
}
function readInworldProviderConfig(config) {
	const defaults = normalizeInworldProviderConfig({});
	return {
		apiKey: trimToUndefined(config.apiKey) ?? defaults.apiKey,
		baseUrl: normalizeInworldBaseUrl(trimToUndefined(config.baseUrl) ?? defaults.baseUrl),
		voiceId: trimToUndefined(config.voiceId) ?? defaults.voiceId,
		modelId: trimToUndefined(config.modelId) ?? defaults.modelId,
		temperature: normalizeInworldTemperature(config.temperature) ?? defaults.temperature
	};
}
function resolveInworldApiKey(primary, fallback) {
	return resolveSpeechProviderApiKey(primary, fallback, process.env.INWORLD_API_KEY);
}
function readInworldOverrides(overrides) {
	return {
		voiceId: trimToUndefined(overrides?.voiceId ?? overrides?.voice),
		modelId: trimToUndefined(overrides?.modelId ?? overrides?.model),
		temperature: normalizeInworldTemperature(overrides?.temperature)
	};
}
async function synthesizeInworld(req) {
	const config = readInworldProviderConfig(req.providerConfig);
	const overrides = readInworldOverrides(req.providerOverrides);
	const apiKey = resolveInworldApiKey(config.apiKey);
	if (!apiKey) throw new Error("Inworld API key missing");
	return inworldTTS({
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		voiceId: overrides.voiceId ?? config.voiceId,
		modelId: overrides.modelId ?? config.modelId,
		audioEncoding: req.audioEncoding,
		...req.sampleRateHertz === void 0 ? {} : { sampleRateHertz: req.sampleRateHertz },
		temperature: overrides.temperature ?? config.temperature,
		timeoutMs: req.timeoutMs
	});
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voiceid":
		case "voice_id":
		case "inworld_voice":
		case "inworldvoice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voiceId: ctx.value }
			};
		case "model":
		case "modelid":
		case "model_id":
		case "inworld_model":
		case "inworldmodel":
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { modelId: ctx.value }
			};
		case "temperature": return parseSpeechDirectiveNumberOverride({
			ctx,
			overrideKey: "temperature",
			range: {
				min: 0,
				minExclusive: true,
				max: 2
			},
			warning: (value) => `invalid Inworld temperature "${value}"`
		});
		default: return { handled: false };
	}
}
function buildInworldSpeechProvider() {
	return {
		id: "inworld",
		label: "Inworld",
		autoSelectOrder: 30,
		defaultModel: DEFAULT_INWORLD_MODEL_ID,
		models: INWORLD_TTS_MODELS,
		resolveConfig: ({ rawConfig }) => normalizeInworldProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeInworldProviderConfig(baseTtsConfig);
			const resolvedApiKey = talkProviderConfig.apiKey === void 0 ? void 0 : normalizeResolvedSecretInputString({
				value: talkProviderConfig.apiKey,
				path: "talk.providers.inworld.apiKey"
			});
			return {
				...base,
				...resolvedApiKey === void 0 ? {} : { apiKey: resolvedApiKey },
				...trimToUndefined(talkProviderConfig.baseUrl) == null ? {} : { baseUrl: normalizeInworldBaseUrl(trimToUndefined(talkProviderConfig.baseUrl)) },
				...trimToUndefined(talkProviderConfig.voiceId) == null ? {} : { voiceId: trimToUndefined(talkProviderConfig.voiceId) },
				...trimToUndefined(talkProviderConfig.modelId) == null ? {} : { modelId: trimToUndefined(talkProviderConfig.modelId) },
				...normalizeInworldTemperature(talkProviderConfig.temperature) == null ? {} : { temperature: normalizeInworldTemperature(talkProviderConfig.temperature) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...trimToUndefined(params.voiceId) == null ? {} : { voiceId: trimToUndefined(params.voiceId) },
			...trimToUndefined(params.modelId) == null ? {} : { modelId: trimToUndefined(params.modelId) },
			...normalizeInworldTemperature(params.temperature) == null ? {} : { temperature: normalizeInworldTemperature(params.temperature) }
		}),
		listVoices: async (req) => {
			const config = req.providerConfig ? readInworldProviderConfig(req.providerConfig) : void 0;
			const apiKey = resolveInworldApiKey(req.apiKey, config?.apiKey);
			if (!apiKey) throw new Error("Inworld API key missing");
			return listInworldVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				timeoutMs: req.timeoutMs
			});
		},
		isConfigured: ({ providerConfig }) => Boolean(resolveInworldApiKey(readInworldProviderConfig(providerConfig).apiKey)),
		synthesize: async (req) => {
			const useOpus = req.target === "voice-note";
			const audioEncoding = useOpus ? "OGG_OPUS" : "MP3";
			return {
				audioBuffer: await synthesizeInworld({
					...req,
					audioEncoding
				}),
				outputFormat: audioEncoding.toLowerCase(),
				fileExtension: useOpus ? ".ogg" : ".mp3",
				voiceCompatible: useOpus
			};
		},
		synthesizeTelephony: async (req) => {
			const sampleRate = 22050;
			return {
				audioBuffer: await synthesizeInworld({
					...req,
					audioEncoding: "PCM",
					sampleRateHertz: sampleRate
				}),
				outputFormat: "pcm",
				sampleRate
			};
		}
	};
}
//#endregion
export { buildInworldSpeechProvider };
