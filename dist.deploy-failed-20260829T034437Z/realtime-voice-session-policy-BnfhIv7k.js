import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as asFiniteNumberInRange, f as asSafeIntegerInRange, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { h as normalizeSecretInputString, m as normalizeResolvedSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { o as warn } from "./globals-GZNLg1ns.js";
import { i as isProviderAuthProfileConfigured, s as resolveProviderAuthProfileApiKey } from "./provider-auth-DI4TAoBi.js";
import "./runtime-env-_YEv0JPQ.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./secret-input-bJBlHnFk.js";
import "./agent-runtime-BOXRUj3V.js";
import { $ as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, Q as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, nt as toOpenAICompatibleRealtimeAudioFormat } from "./realtime-session-harness-BKlDBU2j.js";
import "./realtime-voice-RqIaCTAX.js";
import { t as OPENAI_GPT_LIVE_MODELS } from "./realtime-quicksilver-BdMyAyC5.js";
import { i as resolveOpenAIChatGptSubscriptionAuth } from "./realtime-quicksilver-session-DXj_PsOk.js";
import { a as resolveOpenAIProviderConfigRecord, i as readRealtimeErrorDetail } from "./realtime-provider-shared-BfxgP2Tu.js";
import { execFileSync } from "node:child_process";
//#region extensions/openai/realtime-voice-session-policy.ts
const OPENAI_REALTIME_DEFAULT_MODEL = "gpt-realtime-2.1";
const OPENAI_REALTIME_MODELS = [
	"gpt-realtime-2.1",
	"gpt-realtime-2.1-mini",
	"gpt-realtime-2",
	...OPENAI_GPT_LIVE_MODELS
];
const OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
const OPENAI_REALTIME_CAPABILITIES = {
	transports: ["webrtc", "gateway-relay"],
	inputAudioFormats: [REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ],
	outputAudioFormats: [REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ],
	supportsBrowserSession: true,
	supportsBargeIn: true,
	handlesInputAudioBargeIn: true,
	supportsToolCalls: true,
	supportsActivationNameGating: true,
	supportsVideoFrames: true
};
const OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX = "Conversation already has an active response in progress:";
const OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR = "Cancellation failed: no active response found";
const OPENAI_REALTIME_MAX_SESSION_DURATION_FRAGMENT = "maximum duration";
const OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
const OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES = 1024 * 1024;
const OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS = 250;
const OPENAI_REALTIME_TOOL_NAME_RE = /^[A-Za-z0-9_-]+$/;
const AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH = 64;
const OPENAI_REALTIME_VOICES = [
	"alloy",
	"ash",
	"ballad",
	"coral",
	"echo",
	"sage",
	"shimmer",
	"verse",
	"marin",
	"cedar"
];
function normalizeOpenAIRealtimeVoice(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	return OPENAI_REALTIME_VOICES.includes(normalized) ? normalized : void 0;
}
function normalizeProviderConfig(config) {
	const raw = resolveOpenAIProviderConfigRecord(config);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "plugins.entries.voice-call.config.realtime.providers.openai.apiKey"
		}),
		model: normalizeOptionalString(raw?.model),
		voice: normalizeOpenAIRealtimeVoice(raw?.speakerVoice ?? raw?.voice),
		temperature: asFiniteNumber(raw?.temperature),
		vadThreshold: asUnitInterval(raw?.vadThreshold),
		silenceDurationMs: asSafeIntegerInRange(raw?.silenceDurationMs, { min: 0 }),
		prefixPaddingMs: asSafeIntegerInRange(raw?.prefixPaddingMs, { min: 0 }),
		interruptResponseOnInputAudio: typeof raw?.interruptResponseOnInputAudio === "boolean" ? raw.interruptResponseOnInputAudio : void 0,
		minBargeInAudioEndMs: asSafeIntegerInRange(raw?.minBargeInAudioEndMs, { min: 0 }),
		reasoningEffort: normalizeOptionalString(raw?.reasoningEffort),
		azureEndpoint: normalizeOptionalString(raw?.azureEndpoint),
		azureDeployment: normalizeOptionalString(raw?.azureDeployment),
		azureApiVersion: normalizeOptionalString(raw?.azureApiVersion)
	};
}
function asUnitInterval(value) {
	return asFiniteNumberInRange(value, {
		min: 0,
		max: 1
	});
}
const OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED = "OpenAI Realtime voice requires an OpenAI Platform API key";
const OPENAI_GPT_LIVE_AUTH_REQUIRED = "GPT-Live Talk requires either an OpenAI Platform API key or a ChatGPT OAuth subscription profile";
const OPENAI_GPT_LIVE_AUTHORED_PLATFORM_AUTH_UNAVAILABLE = "GPT-Live Talk requires a working OpenAI Platform API key or ChatGPT OAuth subscription profile. The selected Platform API-key source could not be resolved, so OAuth fallback was not used; fix or remove it.";
const OPENAI_REALTIME_API_KEY_REQUIRED = "OpenAI Realtime voice requires an API key";
const OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED = "OpenAI Realtime rejected the selected API key. Update or remove the active OpenAI API-key source";
const KEYCHAIN_SECRET_REF_RE = /^keychain:([^:]+):([^:]+)$/;
const KEYCHAIN_LOOKUP_TIMEOUT_MS = 5e3;
const resolvedKeychainSecretRefCache = /* @__PURE__ */ new Map();
function isDirectOpenAIRealtimeWebSocketUrl(value) {
	try {
		return new URL(value).hostname === "api.openai.com";
	} catch {
		return false;
	}
}
function isOpenAIRealtimeStartupAuthFailure(error) {
	const record = typeof error === "object" && error !== null ? error : void 0;
	const status = record?.status ?? record?.statusCode;
	const rawCode = record?.code ?? record?.errorCode;
	const code = typeof rawCode === "string" ? rawCode.toLowerCase() : "";
	const message = readRealtimeErrorDetail(error).toLowerCase();
	return status === 401 || code === "invalid_api_key" || message.includes("invalid_api_key") || message.includes("incorrect api key provided") || message.includes("unexpected server response: 401");
}
function resolveKeychainSecretRef(value) {
	const trimmed = value.trim();
	const match = KEYCHAIN_SECRET_REF_RE.exec(trimmed);
	if (!match) return trimmed || void 0;
	const cached = resolvedKeychainSecretRefCache.get(trimmed);
	if (cached) return cached;
	const [, service, account] = match;
	if (!service || !account) return;
	try {
		const resolved = execFileSync("/usr/bin/security", [
			"find-generic-password",
			"-s",
			service,
			"-a",
			account,
			"-w"
		], {
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: KEYCHAIN_LOOKUP_TIMEOUT_MS
		}).trim() || void 0;
		if (resolved) resolvedKeychainSecretRefCache.set(trimmed, resolved);
		return resolved;
	} catch {
		return;
	}
}
function resolveOpenAIRealtimeSecretInput(configuredApiKey) {
	const configured = normalizeSecretInputString(configuredApiKey);
	if (configured) {
		const value = resolveKeychainSecretRef(configured);
		return value ? {
			status: "available",
			value
		} : { status: "missing" };
	}
	return { status: "missing" };
}
function resolveOpenAIRealtimeEnvApiKey() {
	const envValue = normalizeSecretInputString(process.env.OPENAI_API_KEY);
	if (!envValue) return { status: "missing" };
	const value = resolveKeychainSecretRef(envValue);
	return value ? {
		status: "available",
		value
	} : { status: "missing" };
}
function resolveOpenAIRealtimeApiKey(configuredApiKey) {
	const configured = resolveOpenAIRealtimeSecretInput(configuredApiKey);
	if (configured.status === "available" || hasOpenAIRealtimeConfiguredApiKeyInput(configuredApiKey)) return configured;
	return resolveOpenAIRealtimeEnvApiKey();
}
function requireOpenAIRealtimeApiKey(configuredApiKey, errorMessage = OPENAI_REALTIME_API_KEY_REQUIRED) {
	const resolved = resolveOpenAIRealtimeApiKey(configuredApiKey);
	if (resolved.status === "available") return resolved.value;
	throw new Error(errorMessage);
}
function hasOpenAIRealtimeConfiguredApiKeyInput(configuredApiKey) {
	return Boolean(normalizeSecretInputString(configuredApiKey));
}
function hasOpenAIRealtimeApiKeyInput(configuredApiKey) {
	return Boolean(normalizeSecretInputString(configuredApiKey) ?? normalizeSecretInputString(process.env.OPENAI_API_KEY));
}
function normalizeOpenAIRealtimeTools(tools, maxNameLength) {
	const normalized = [];
	let omitted = 0;
	for (const tool of tools ?? []) try {
		const name = tool.name;
		if (typeof name !== "string") {
			omitted += 1;
			continue;
		}
		if (maxNameLength !== void 0 && name.length > maxNameLength || !OPENAI_REALTIME_TOOL_NAME_RE.test(name)) {
			omitted += 1;
			continue;
		}
		normalized.push({
			type: "function",
			name,
			description: tool.description,
			parameters: tool.parameters
		});
	} catch {
		omitted += 1;
	}
	if (omitted > 0) warn(`openai realtime: omitted ${omitted} tool definition(s) with unsupported names`);
	return normalized.length > 0 ? normalized : void 0;
}
function buildOpenAIRealtimeTurnDetectionConfig(params) {
	const configuredAutoResponse = params.autoRespondToAudio ?? true;
	return {
		type: "server_vad",
		threshold: params.vadThreshold ?? .5,
		prefix_padding_ms: params.prefixPaddingMs ?? 300,
		silence_duration_ms: params.silenceDurationMs ?? 500,
		create_response: params.createResponse ?? configuredAutoResponse,
		...params.includeInterruptResponse ? { interrupt_response: params.interruptResponseOnInputAudio ?? configuredAutoResponse } : {}
	};
}
function buildOpenAIRealtimeGaSessionPolicy(params) {
	const format = toOpenAICompatibleRealtimeAudioFormat(params.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ);
	return {
		type: "realtime",
		model: params.model,
		...params.instructions !== void 0 ? { instructions: params.instructions } : {},
		output_modalities: ["audio"],
		audio: {
			input: {
				format,
				noise_reduction: params.noiseReduction,
				transcription: {
					model: OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL,
					...params.language ? { language: params.language } : {}
				},
				turn_detection: buildOpenAIRealtimeTurnDetectionConfig({
					autoRespondToAudio: params.autoRespondToAudio,
					includeInterruptResponse: true,
					interruptResponseOnInputAudio: params.interruptResponseOnInputAudio,
					prefixPaddingMs: params.prefixPaddingMs,
					silenceDurationMs: params.silenceDurationMs,
					vadThreshold: params.vadThreshold
				})
			},
			output: {
				format,
				voice: params.voice
			}
		},
		...params.reasoningEffort ? { reasoning: { effort: params.reasoningEffort } } : {},
		...params.tools ? {
			tools: params.tools,
			tool_choice: "auto"
		} : {}
	};
}
async function resolveOpenAIRealtimePlatformAuth(params) {
	const configured = resolveOpenAIRealtimeSecretInput(params.configuredApiKey);
	if (configured.status === "available" || hasOpenAIRealtimeConfiguredApiKeyInput(params.configuredApiKey)) return configured;
	const profileApiKey = await resolveProviderAuthProfileApiKey({
		provider: "openai",
		cfg: params.cfg,
		...params.cfg && params.agentId ? { agentDir: resolveAgentDir(params.cfg, params.agentId) } : {},
		profileTypes: ["api_key"],
		includeExternalCliAuth: false
	});
	if (profileApiKey) return {
		status: "available",
		value: profileApiKey
	};
	const envApiKey = resolveOpenAIRealtimeEnvApiKey();
	if (envApiKey.status === "available") return envApiKey;
	return { status: "missing" };
}
async function requireOpenAIRealtimePlatformAuth(params) {
	const resolved = await resolveOpenAIRealtimePlatformAuth(params);
	if (resolved.status === "available") return resolved;
	throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
}
async function resolveOpenAIQuicksilverBridgeAuth(params) {
	const subscriptionAuth = await resolveOpenAIChatGptSubscriptionAuth({
		cfg: params.cfg,
		agentDir: params.cfg && params.agentId ? resolveAgentDir(params.cfg, params.agentId) : void 0
	});
	if (subscriptionAuth) return subscriptionAuth;
	const platformAuth = await resolveOpenAIRealtimePlatformAuth(params);
	if (platformAuth.status === "available") return {
		type: "api-key",
		token: platformAuth.value
	};
	if (hasOpenAIRealtimePlatformAuthInput({
		configuredApiKey: params.configuredApiKey,
		cfg: params.cfg,
		agentId: params.agentId
	})) throw new Error(OPENAI_GPT_LIVE_AUTHORED_PLATFORM_AUTH_UNAVAILABLE);
	throw new Error(OPENAI_GPT_LIVE_AUTH_REQUIRED);
}
function hasOpenAIRealtimePlatformAuthInput(params) {
	if (hasOpenAIRealtimeConfiguredApiKeyInput(params.configuredApiKey)) return true;
	if (isProviderAuthProfileConfigured({
		provider: "openai",
		cfg: params.cfg,
		...params.cfg && params.agentId ? { agentDir: resolveAgentDir(params.cfg, params.agentId) } : {},
		profileTypes: ["api_key"],
		includeExternalCliAuth: false
	})) return true;
	return hasOpenAIRealtimeApiKeyInput(void 0);
}
function hasOpenAIChatGptSubscriptionAuthInput(params) {
	return isProviderAuthProfileConfigured({
		provider: "openai",
		cfg: params.cfg,
		agentDir: params.cfg && params.agentId ? resolveAgentDir(params.cfg, params.agentId) : void 0,
		profileTypes: ["oauth"],
		includeExternalCliAuth: false
	});
}
function isOpenAIRealtimeMaxSessionDurationError(detail) {
	const normalized = detail.toLowerCase();
	return normalized.includes("session") && normalized.includes(OPENAI_REALTIME_MAX_SESSION_DURATION_FRAGMENT);
}
function readRealtimeErrorEventId(error) {
	if (!error || typeof error !== "object") return;
	const eventId = error.event_id;
	return typeof eventId === "string" ? eventId : void 0;
}
function parsePlaybackMarkSequence(markName) {
	const match = /^audio-(\d+)$/u.exec(markName);
	if (!match) return;
	const sequence = Number(match[1]);
	return Number.isSafeInteger(sequence) && sequence > 0 ? sequence : void 0;
}
//#endregion
export { requireOpenAIRealtimePlatformAuth as A, isOpenAIRealtimeStartupAuthFailure as C, parsePlaybackMarkSequence as D, normalizeProviderConfig as E, resolveOpenAIRealtimeEnvApiKey as M, resolveOpenAIRealtimePlatformAuth as N, readRealtimeErrorEventId as O, resolveOpenAIRealtimeSecretInput as P, isOpenAIRealtimeMaxSessionDurationError as S, normalizeOpenAIRealtimeVoice as T, hasOpenAIChatGptSubscriptionAuthInput as _, OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED as a, hasOpenAIRealtimePlatformAuthInput as b, OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as c, OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED as d, OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES as f, buildOpenAIRealtimeTurnDetectionConfig as g, buildOpenAIRealtimeGaSessionPolicy as h, OPENAI_REALTIME_CAPABILITIES as i, resolveOpenAIQuicksilverBridgeAuth as j, requireOpenAIRealtimeApiKey as k, OPENAI_REALTIME_MODELS as l, OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES as m, OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as n, OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS as o, OPENAI_REALTIME_VOICES as p, OPENAI_REALTIME_API_KEY_REQUIRED as r, OPENAI_REALTIME_DEFAULT_MODEL as s, AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH as t, OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as u, hasOpenAIRealtimeApiKeyInput as v, normalizeOpenAIRealtimeTools as w, isDirectOpenAIRealtimeWebSocketUrl as x, hasOpenAIRealtimeConfiguredApiKeyInput as y };
