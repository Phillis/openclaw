import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as createOpenAiCompatibleSpeechProvider } from "./speech-BhDs9xJ0.js";
import { t as OPENROUTER_BASE_URL } from "./provider-catalog-FVAAdWle.js";
//#region extensions/openrouter/speech-provider.ts
const DEFAULT_OPENROUTER_TTS_MODEL = "hexgrad/kokoro-82m";
const DEFAULT_OPENROUTER_TTS_VOICE = "af_alloy";
const OPENROUTER_TTS_MODELS = [
	DEFAULT_OPENROUTER_TTS_MODEL,
	"elevenlabs/eleven-turbo-v2",
	"google/gemini-3.1-flash-tts-preview",
	"mistralai/voxtral-mini-tts-2603"
];
const OPENROUTER_TTS_RESPONSE_FORMATS = ["mp3", "pcm"];
function buildOpenRouterSpeechProvider() {
	return createOpenAiCompatibleSpeechProvider({
		id: "openrouter",
		label: "OpenRouter",
		autoSelectOrder: 35,
		models: OPENROUTER_TTS_MODELS,
		voices: [DEFAULT_OPENROUTER_TTS_VOICE],
		defaultModel: DEFAULT_OPENROUTER_TTS_MODEL,
		defaultVoice: DEFAULT_OPENROUTER_TTS_VOICE,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		envKey: "OPENROUTER_API_KEY",
		responseFormats: OPENROUTER_TTS_RESPONSE_FORMATS,
		defaultResponseFormat: "mp3",
		voiceCompatibleResponseFormats: ["mp3"],
		baseUrlPolicy: {
			kind: "canonical",
			aliases: ["https://openrouter.ai/v1"],
			allowCustom: true
		},
		extraHeaders: {
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": "OpenClaw"
		},
		apiErrorLabel: "OpenRouter TTS API error",
		missingApiKeyError: "OpenRouter API key missing",
		readExtraConfig: (raw) => ({ provider: asOptionalRecord(raw?.provider) }),
		extraJsonBodyFields: [{ configKey: "provider" }]
	});
}
//#endregion
export { buildOpenRouterSpeechProvider as t };
