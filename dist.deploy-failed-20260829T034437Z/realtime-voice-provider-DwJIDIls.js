import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-BAUXM8KH.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./agent-runtime-BOXRUj3V.js";
import "./provider-http-S5IuZe1q.js";
import { $ as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ } from "./realtime-session-harness-BKlDBU2j.js";
import "./realtime-voice-RqIaCTAX.js";
import { n as buildOpenAIQuicksilverInstructions } from "./realtime-quicksilver-instructions-CUVT6eIm.js";
import { n as isOpenAIGptLiveModel, r as isSupportedOpenAIGptLiveModel } from "./realtime-quicksilver-BdMyAyC5.js";
import { i as resolveOpenAIChatGptSubscriptionAuth, t as OPENAI_QUICKSILVER_CAPABILITIES } from "./realtime-quicksilver-session-DXj_PsOk.js";
import { a as resolveOpenAIProviderConfigRecord, n as createOpenAIRealtimeClientSecret } from "./realtime-provider-shared-BfxgP2Tu.js";
import { t as OpenAIQuicksilverVoiceBridge } from "./realtime-quicksilver-bridge-CjOLS6sL.js";
import { t as OpenAIQuicksilverGatewayBridge } from "./realtime-quicksilver-gateway-bridge-BVCsxj7_.js";
import { A as requireOpenAIRealtimePlatformAuth, E as normalizeProviderConfig, N as resolveOpenAIRealtimePlatformAuth, T as normalizeOpenAIRealtimeVoice, _ as hasOpenAIChatGptSubscriptionAuthInput, a as OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED, b as hasOpenAIRealtimePlatformAuthInput, c as OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, d as OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED, h as buildOpenAIRealtimeGaSessionPolicy, i as OPENAI_REALTIME_CAPABILITIES, j as resolveOpenAIQuicksilverBridgeAuth, l as OPENAI_REALTIME_MODELS, p as OPENAI_REALTIME_VOICES, s as OPENAI_REALTIME_DEFAULT_MODEL, v as hasOpenAIRealtimeApiKeyInput, w as normalizeOpenAIRealtimeTools } from "./realtime-voice-session-policy-BnfhIv7k.js";
import { t as OpenAIRealtimeBridge } from "./realtime-voice-bridge-DLo_qWi9.js";
//#region extensions/openai/realtime-voice-provider.ts
function resolveOpenAIRealtimeBrowserOfferHeaders() {
	const headers = resolveProviderRequestHeaders({
		provider: "openai",
		baseUrl: "https://api.openai.com/v1/realtime/calls",
		capability: "audio",
		transport: "http",
		defaultHeaders: {}
	});
	const SERVER_ONLY_HEADERS = /* @__PURE__ */ new Set([
		"user-agent",
		"originator",
		"version"
	]);
	const browserHeaders = Object.fromEntries(Object.entries(headers ?? {}).filter(([key]) => !SERVER_ONLY_HEADERS.has(key.toLowerCase())));
	return Object.keys(browserHeaders).length > 0 ? browserHeaders : void 0;
}
const INTERNAL_REALTIME_VOICE_PROVIDER = Symbol.for("openclaw.internal.realtime-voice-provider.v1");
function buildOpenAIRealtimeBrowserSessionConfig(req, config, model) {
	const voice = normalizeOpenAIRealtimeVoice(req.voice) ?? config.voice ?? "alloy";
	const tools = normalizeOpenAIRealtimeTools(req.tools);
	const session = {
		type: "realtime",
		model,
		instructions: req.instructions,
		audio: {
			input: {
				noise_reduction: { type: "near_field" },
				turn_detection: {
					type: "server_vad",
					create_response: true,
					interrupt_response: true,
					...typeof (req.vadThreshold ?? config.vadThreshold) === "number" ? { threshold: req.vadThreshold ?? config.vadThreshold } : {},
					...typeof (req.prefixPaddingMs ?? config.prefixPaddingMs) === "number" ? { prefix_padding_ms: req.prefixPaddingMs ?? config.prefixPaddingMs } : {},
					...typeof (req.silenceDurationMs ?? config.silenceDurationMs) === "number" ? { silence_duration_ms: req.silenceDurationMs ?? config.silenceDurationMs } : {}
				},
				transcription: { model: OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL }
			},
			output: { voice }
		}
	};
	if (tools) {
		session.tools = tools;
		session.tool_choice = "auto";
	}
	const reasoningEffort = normalizeOptionalString(req.reasoningEffort) ?? config.reasoningEffort;
	if (reasoningEffort) session.reasoning = { effort: reasoningEffort };
	return {
		session,
		voice
	};
}
async function createOpenAIRealtimeBrowserSession(req, quicksilverBroker, logger) {
	const rawConfig = resolveOpenAIProviderConfigRecord(req.providerConfig);
	const config = normalizeProviderConfig(req.providerConfig);
	if (config.azureEndpoint || config.azureDeployment) throw new Error("OpenAI Realtime browser sessions do not support Azure endpoints yet");
	const model = req.model ?? config.model ?? "gpt-realtime-2.1";
	if (req.gatewayControl) {
		if (isOpenAIGptLiveModel(model)) throw new Error("gateway-control-v1 supports OpenAI GA Realtime models only");
		if (!quicksilverBroker) throw new Error("OpenAI realtime browser session broker is unavailable");
		const auth = await requireOpenAIRealtimePlatformAuth({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId
		});
		const voice = normalizeOpenAIRealtimeVoice(req.voice) ?? config.voice ?? "alloy";
		const sessionConfig = buildOpenAIRealtimeGaSessionPolicy({
			audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
			instructions: req.instructions,
			interruptResponseOnInputAudio: config.interruptResponseOnInputAudio,
			model,
			noiseReduction: { type: "near_field" },
			prefixPaddingMs: req.prefixPaddingMs ?? config.prefixPaddingMs,
			reasoningEffort: normalizeOptionalString(req.reasoningEffort) ?? config.reasoningEffort,
			silenceDurationMs: req.silenceDurationMs ?? config.silenceDurationMs,
			tools: normalizeOpenAIRealtimeTools(req.tools),
			vadThreshold: req.vadThreshold ?? config.vadThreshold,
			voice
		});
		const gatewayControl = req.gatewayControl;
		return await quicksilverBroker.createBrowserSession({
			...req,
			model,
			voice,
			gaSession: sessionConfig,
			gaSideband: { createBridge: ({ apiKey, callId, onTerminal }) => {
				const bridge = new OpenAIRealtimeBridge({
					cfg: req.cfg,
					agentId: req.agentId,
					providerConfig: req.providerConfig,
					apiKey,
					callId,
					audioFormat: REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ,
					gaSessionPolicy: sessionConfig,
					model,
					voice,
					instructions: req.instructions,
					tools: req.tools,
					interruptResponseOnInputAudio: config.interruptResponseOnInputAudio,
					reasoningEffort: req.reasoningEffort ?? config.reasoningEffort,
					vadThreshold: req.vadThreshold ?? config.vadThreshold,
					silenceDurationMs: req.silenceDurationMs ?? config.silenceDurationMs,
					prefixPaddingMs: req.prefixPaddingMs ?? config.prefixPaddingMs,
					onAudio: () => void 0,
					onClearAudio: () => void 0,
					onEvent: gatewayControl.onEvent,
					onResponseDone: gatewayControl.onResponseDone,
					onTranscript: gatewayControl.onTranscript,
					onToolCall: gatewayControl.onToolCall,
					onReady: gatewayControl.onReady,
					onError: gatewayControl.onError,
					onClose: (reason) => {
						gatewayControl.onClose?.(reason);
						onTerminal();
					},
					logger
				});
				gatewayControl.bindBridge(bridge);
				return bridge;
			} }
		}, {
			type: "api-key",
			token: auth.value
		});
	}
	if (isOpenAIGptLiveModel(model)) {
		if (!quicksilverBroker) throw new Error("OpenAI GPT-Live browser session broker is unavailable");
		const configuredVoice = normalizeOptionalString(rawConfig?.speakerVoice ?? rawConfig?.voice);
		const quicksilverRequest = {
			...req,
			model,
			instructions: buildOpenAIQuicksilverInstructions(req.instructions),
			...req.voice ? {} : configuredVoice ? { voice: configuredVoice } : {}
		};
		const auth = await resolveOpenAIQuicksilverBridgeAuth({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId
		});
		return await quicksilverBroker.createBrowserSession(quicksilverRequest, auth);
	}
	const { session, voice } = buildOpenAIRealtimeBrowserSessionConfig(req, config, model);
	const auth = await resolveOpenAIRealtimePlatformAuth({
		configuredApiKey: config.apiKey,
		cfg: req.cfg,
		agentId: req.agentId
	});
	if (auth.status === "missing") {
		if (hasOpenAIRealtimePlatformAuthInput({
			configuredApiKey: config.apiKey,
			cfg: req.cfg,
			agentId: req.agentId
		})) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
		const subscriptionAuth = await resolveOpenAIChatGptSubscriptionAuth({
			cfg: req.cfg,
			agentDir: req.cfg ? resolveAgentDir(req.cfg, req.agentId) : void 0
		});
		if (!subscriptionAuth) throw new Error(OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED);
		if (!quicksilverBroker) throw new Error("OpenAI realtime browser session broker is unavailable");
		return await quicksilverBroker.createBrowserSession({
			...req,
			model,
			voice,
			gaSession: session
		}, subscriptionAuth);
	}
	const clientSecret = await createOpenAIRealtimeClientSecret({
		authToken: auth.value,
		auditContext: "openai-realtime-browser-session",
		session,
		authRejectedMessage: OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED
	});
	const offerHeaders = resolveOpenAIRealtimeBrowserOfferHeaders();
	return {
		provider: "openai",
		transport: "webrtc",
		clientSecret: clientSecret.value,
		offerUrl: "https://api.openai.com/v1/realtime/calls",
		offerResponseMaxBytes: 256 * 1024,
		...offerHeaders ? { offerHeaders } : {},
		model,
		voice,
		...typeof clientSecret.expiresAt === "number" ? { expiresAt: clientSecret.expiresAt } : {}
	};
}
function buildOpenAIRealtimeVoiceProvider(options) {
	const provider = {
		id: "openai",
		label: "OpenAI Realtime Voice",
		defaultModel: OPENAI_REALTIME_DEFAULT_MODEL,
		models: OPENAI_REALTIME_MODELS,
		voices: OPENAI_REALTIME_VOICES,
		autoSelectOrder: 10,
		capabilities: OPENAI_REALTIME_CAPABILITIES,
		resolveConfig: ({ rawConfig }) => normalizeProviderConfig(rawConfig),
		isConfigured: ({ cfg, providerConfig, agentId }) => {
			const config = normalizeProviderConfig(providerConfig);
			if (config.azureEndpoint || config.azureDeployment) return hasOpenAIRealtimeApiKeyInput(config.apiKey);
			if (hasOpenAIRealtimePlatformAuthInput({
				configuredApiKey: config.apiKey,
				cfg,
				agentId
			})) return true;
			return false;
		},
		createBridge: (req) => {
			const config = normalizeProviderConfig(req.providerConfig);
			const model = config.model;
			if (model && isOpenAIGptLiveModel(model)) {
				if (config.azureEndpoint || config.azureDeployment) throw new Error("GPT-Live backend WebSocket sessions do not support Azure endpoints or deployments");
				if (req.runAgentConsult) return new OpenAIQuicksilverGatewayBridge({
					...req,
					model,
					voice: config.voice ?? "marin",
					instructions: buildOpenAIQuicksilverInstructions(req.instructions),
					logger: options?.logger ?? {
						debug: () => void 0,
						warn: () => void 0
					},
					resolveAuth: () => resolveOpenAIQuicksilverBridgeAuth({
						configuredApiKey: config.apiKey,
						cfg: req.cfg,
						agentId: req.agentId
					})
				});
				return new OpenAIQuicksilverVoiceBridge({
					...req,
					model,
					voice: config.voice,
					instructions: buildOpenAIQuicksilverInstructions(req.instructions),
					logger: options?.logger ?? { warn: () => void 0 },
					resolveAuth: async () => ({
						type: "api-key",
						token: (await requireOpenAIRealtimePlatformAuth({
							configuredApiKey: config.apiKey,
							cfg: req.cfg,
							agentId: req.agentId
						})).value
					})
				});
			}
			return new OpenAIRealtimeBridge({
				...req,
				apiKey: config.apiKey,
				model: config.model,
				voice: config.voice,
				temperature: config.temperature,
				vadThreshold: config.vadThreshold,
				silenceDurationMs: config.silenceDurationMs,
				prefixPaddingMs: config.prefixPaddingMs,
				interruptResponseOnInputAudio: req.interruptResponseOnInputAudio ?? config.interruptResponseOnInputAudio,
				minBargeInAudioEndMs: config.minBargeInAudioEndMs,
				reasoningEffort: config.reasoningEffort,
				azureEndpoint: config.azureEndpoint,
				azureDeployment: config.azureDeployment,
				azureApiVersion: config.azureApiVersion,
				logger: options?.logger ?? { warn: () => void 0 }
			});
		},
		createBrowserSession: (req) => createOpenAIRealtimeBrowserSession(req, options?.quicksilverBrowserSessionBroker, options?.logger ?? { warn: () => void 0 })
	};
	Object.defineProperty(provider, INTERNAL_REALTIME_VOICE_PROVIDER, {
		configurable: true,
		value: {
			isBrowserSessionConfigured: ({ cfg, providerConfig, agentId }) => {
				const config = normalizeProviderConfig(providerConfig);
				if (config.azureEndpoint || config.azureDeployment) return false;
				const model = config.model ?? "gpt-realtime-2.1";
				if (isOpenAIGptLiveModel(model)) {
					if (!isSupportedOpenAIGptLiveModel(model)) return false;
					return options?.quicksilverBrowserSessionBroker !== void 0 && (hasOpenAIRealtimePlatformAuthInput({
						configuredApiKey: config.apiKey,
						cfg,
						agentId
					}) || hasOpenAIChatGptSubscriptionAuthInput({
						cfg,
						agentId
					}));
				}
				return hasOpenAIRealtimePlatformAuthInput({
					configuredApiKey: config.apiKey,
					cfg,
					agentId
				}) || options?.quicksilverBrowserSessionBroker !== void 0 && hasOpenAIChatGptSubscriptionAuthInput({
					cfg,
					agentId
				});
			},
			resolveBrowserSessionCapabilities: ({ cfg, providerConfig, agentId, model }) => {
				const config = normalizeProviderConfig(providerConfig);
				if (isSupportedOpenAIGptLiveModel(model ?? config.model)) return {
					...OPENAI_REALTIME_CAPABILITIES,
					...OPENAI_QUICKSILVER_CAPABILITIES
				};
				return {
					...OPENAI_REALTIME_CAPABILITIES,
					...options?.quicksilverBrowserSessionBroker !== void 0 && hasOpenAIRealtimePlatformAuthInput({
						configuredApiKey: config.apiKey,
						cfg,
						agentId
					}) ? { supportsGatewayControl: true } : {}
				};
			},
			isGatewayRelayConfigured: ({ cfg, providerConfig, agentId }) => {
				const config = normalizeProviderConfig(providerConfig);
				if (!isOpenAIGptLiveModel(config.model)) return;
				if (config.azureEndpoint || config.azureDeployment) return false;
				return isSupportedOpenAIGptLiveModel(config.model) && (hasOpenAIRealtimePlatformAuthInput({
					configuredApiKey: config.apiKey,
					cfg,
					agentId
				}) || hasOpenAIChatGptSubscriptionAuthInput({
					cfg,
					agentId
				}));
			},
			resolveGatewayRelayCapabilities: ({ providerConfig, model }) => {
				const config = normalizeProviderConfig(providerConfig);
				if (isSupportedOpenAIGptLiveModel(model ?? config.model)) return {
					...OPENAI_REALTIME_CAPABILITIES,
					...OPENAI_QUICKSILVER_CAPABILITIES
				};
				return OPENAI_REALTIME_CAPABILITIES;
			},
			validateGatewayRelayLaunch: ({ providerConfig, model, autoRespondToAudio }) => {
				const config = normalizeProviderConfig(providerConfig);
				if (autoRespondToAudio === false && isOpenAIGptLiveModel(model ?? config.model)) return "GPT-Live gateway-relay sessions cannot use forced agent consult routing; GPT-Live delegates to the agent natively";
			},
			cancelBrowserSession: (_request, session) => options?.quicksilverBrowserSessionBroker?.cancelBrowserSession(session)
		}
	});
	return provider;
}
//#endregion
export { buildOpenAIRealtimeVoiceProvider as t };
