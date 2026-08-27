import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { m as normalizeResolvedSecretInputString } from "../../types.secrets-BrIfhxSG.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../secret-input-Dv7SE4A5.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { n as createRealtimeVoiceAudioQueue } from "../../realtime-session-lifecycle-CmQhqqoW.js";
import { t as buildGoogleGeminiCliBackend } from "../../cli-backend-sW66kbAj.js";
import { n as registerGoogleGeminiCliProvider } from "../../gemini-cli-provider-BW_gdoAS.js";
import { c as createGoogleMusicGenerationProviderMetadata, l as createGoogleVideoGenerationProviderMetadata } from "../../generation-provider-metadata-CdYRLn_B.js";
import { t as geminiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-CLxtTkUE.js";
import { n as registerGoogleProvider } from "../../provider-registration-D1IObsrk.js";
import { t as buildGoogleSpeechProvider } from "../../speech-provider-BEziTCAj.js";
import { t as createGeminiWebSearchProvider } from "../../gemini-web-search-provider-Bp2YLKSl.js";
//#region extensions/google/index.ts
let googleImageGenerationProviderPromise = null;
let googleMediaUnderstandingProviderPromise = null;
let googleMusicGenerationProviderPromise = null;
let googleRealtimeVoiceProviderPromise = null;
let googleVideoGenerationProviderPromise = null;
async function loadGoogleImageGenerationProvider() {
	if (!googleImageGenerationProviderPromise) googleImageGenerationProviderPromise = import("./image-generation-provider.js").then((mod) => mod.buildGoogleImageGenerationProvider());
	return await googleImageGenerationProviderPromise;
}
async function loadGoogleMediaUnderstandingProvider() {
	if (!googleMediaUnderstandingProviderPromise) googleMediaUnderstandingProviderPromise = import("./media-understanding-provider.js").then((mod) => mod.googleMediaUnderstandingProvider);
	return await googleMediaUnderstandingProviderPromise;
}
async function loadGoogleMusicGenerationProvider() {
	if (!googleMusicGenerationProviderPromise) googleMusicGenerationProviderPromise = import("./music-generation-provider.js").then((mod) => mod.buildGoogleMusicGenerationProvider());
	return await googleMusicGenerationProviderPromise;
}
async function loadGoogleRealtimeVoiceProvider() {
	if (!googleRealtimeVoiceProviderPromise) googleRealtimeVoiceProviderPromise = import("./realtime-voice-provider.js").then((mod) => mod.buildGoogleRealtimeVoiceProvider());
	return await googleRealtimeVoiceProviderPromise;
}
async function loadGoogleVideoGenerationProvider() {
	if (!googleVideoGenerationProviderPromise) googleVideoGenerationProviderPromise = import("./video-generation-provider.js").then((mod) => mod.buildGoogleVideoGenerationProvider());
	return await googleVideoGenerationProviderPromise;
}
async function loadGoogleRequiredMediaUnderstandingProvider() {
	const provider = await loadGoogleMediaUnderstandingProvider();
	if (!provider.describeImage || !provider.describeImages || !provider.transcribeAudio || !provider.describeVideo) throw new Error("google media understanding provider missing required handlers");
	return provider;
}
function createLazyGoogleImageGenerationProvider() {
	return {
		id: "google",
		label: "Google",
		defaultModel: "gemini-3.1-flash-image",
		models: ["gemini-3.1-flash-image", "gemini-3-pro-image"],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 5,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			geometry: {
				sizes: [
					"1024x1024",
					"1024x1536",
					"1536x1024",
					"1024x1792",
					"1792x1024"
				],
				aspectRatios: [
					"1:1",
					"2:3",
					"3:2",
					"3:4",
					"4:3",
					"4:5",
					"5:4",
					"9:16",
					"16:9",
					"21:9"
				],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		generateImage: async (req) => (await loadGoogleImageGenerationProvider()).generateImage(req)
	};
}
function createLazyGoogleMediaUnderstandingProvider() {
	return {
		id: "google",
		capabilities: [
			"image",
			"audio",
			"video"
		],
		defaultModels: {
			image: "gemini-3-flash-preview",
			audio: "gemini-3-flash-preview",
			video: "gemini-3-flash-preview"
		},
		autoPriority: {
			image: 30,
			audio: 40,
			video: 10
		},
		nativeDocumentInputs: ["pdf"],
		describeImage: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeImage(...args),
		describeImages: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeImages(...args),
		transcribeAudio: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).transcribeAudio(...args),
		describeVideo: async (...args) => await (await loadGoogleRequiredMediaUnderstandingProvider()).describeVideo(...args)
	};
}
function createLazyGoogleMusicGenerationProvider() {
	return {
		...createGoogleMusicGenerationProviderMetadata(),
		generateMusic: async (...args) => await (await loadGoogleMusicGenerationProvider()).generateMusic(...args)
	};
}
function resolveGoogleRealtimeProviderConfig(rawConfig, cfg) {
	const nested = (typeof rawConfig.providers === "object" && rawConfig.providers !== null && !Array.isArray(rawConfig.providers) ? rawConfig.providers : void 0)?.google;
	const raw = typeof nested === "object" && nested !== null && !Array.isArray(nested) ? nested : typeof rawConfig.google === "object" && rawConfig.google !== null && !Array.isArray(rawConfig.google) ? rawConfig.google : rawConfig;
	return {
		...raw,
		...raw.apiKey === void 0 ? cfg?.models?.providers?.google?.apiKey === void 0 ? {} : { apiKey: normalizeResolvedSecretInputString({
			value: cfg.models.providers.google.apiKey,
			path: "models.providers.google.apiKey"
		}) } : { apiKey: normalizeResolvedSecretInputString({
			value: raw.apiKey,
			path: "plugins.entries.voice-call.config.realtime.providers.google.apiKey"
		}) }
	};
}
function resolveGoogleRealtimeEnvApiKey() {
	return normalizeOptionalString(process.env.GEMINI_API_KEY) ?? normalizeOptionalString(process.env.GOOGLE_API_KEY);
}
const GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGES = 128;
const GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGE_BYTES = 256 * 1024;
function createLazyGoogleRealtimeVoiceBridge(req) {
	let bridge;
	let bridgePromise;
	let bridgeReady = false;
	let bridgeClosed = false;
	let closed = false;
	let providerTerminated = false;
	let latestMediaTimestamp;
	let pendingGreeting;
	const pendingAudio = createRealtimeVoiceAudioQueue("drop-oldest");
	const pendingUserMessages = [];
	let pendingUserMessageBytes = 0;
	const closeBridge = (loadedBridge = bridge) => {
		if (!loadedBridge || bridgeClosed) return;
		bridgeClosed = true;
		loadedBridge.close();
	};
	const loadBridge = async () => {
		if (!bridgePromise) bridgePromise = loadGoogleRealtimeVoiceProvider().then((provider) => provider.createBridge({
			...req,
			onReady: () => {
				if (closed || providerTerminated) return;
				req.onReady?.();
				if (closed || providerTerminated || !bridge) return;
				bridgeReady = true;
				flushPending(bridge);
			},
			onClose: (reason) => {
				bridgeReady = false;
				providerTerminated = true;
				pendingAudio.clear();
				req.onClose?.(reason);
			}
		}));
		bridge = await bridgePromise;
		if (closed) closeBridge(bridge);
		return bridge;
	};
	const requireBridge = () => {
		if (!bridge) throw new Error("Google realtime voice bridge is not connected");
		return bridge;
	};
	const flushPending = (loadedBridge) => {
		if (closed || providerTerminated) return;
		if (typeof latestMediaTimestamp === "number") loadedBridge.setMediaTimestamp(latestMediaTimestamp);
		for (const audio of pendingAudio.drain()) loadedBridge.sendAudio(audio);
		const userMessages = pendingUserMessages.splice(0);
		pendingUserMessageBytes = 0;
		for (const text of userMessages) loadedBridge.sendUserMessage?.(text);
		if (pendingGreeting !== void 0) {
			const greeting = pendingGreeting;
			pendingGreeting = void 0;
			loadedBridge.triggerGreeting?.(greeting);
		}
	};
	return {
		get supportsToolResultContinuation() {
			return bridge?.supportsToolResultContinuation ?? false;
		},
		supportsToolResultSuppression: false,
		connect: async () => {
			const loadedBridge = await loadBridge();
			if (closed) {
				closeBridge(loadedBridge);
				return;
			}
			providerTerminated = false;
			try {
				await loadedBridge.connect();
			} catch (error) {
				bridgeReady = false;
				providerTerminated = true;
				pendingAudio.clear();
				throw error;
			}
			if (closed) closeBridge(loadedBridge);
		},
		sendAudio: (audio) => {
			if (closed || providerTerminated) return;
			if (bridgeReady && bridge) {
				bridge.sendAudio(audio);
				return;
			}
			pendingAudio.enqueue(audio);
		},
		setMediaTimestamp: (ts) => {
			if (closed) return;
			latestMediaTimestamp = ts;
			bridge?.setMediaTimestamp(ts);
		},
		sendUserMessage: (text) => {
			if (closed) return;
			if (bridgeReady && bridge) {
				bridge.sendUserMessage?.(text);
				return;
			}
			const messageBytes = Buffer.byteLength(text, "utf8");
			if (pendingUserMessages.length >= GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGES || pendingUserMessageBytes + messageBytes > GOOGLE_REALTIME_LAZY_MAX_PENDING_USER_MESSAGE_BYTES) {
				req.onError?.(/* @__PURE__ */ new Error("Google realtime voice pending user message queue overflow during startup"));
				return;
			}
			pendingUserMessages.push(text);
			pendingUserMessageBytes += messageBytes;
		},
		triggerGreeting: (instructions) => {
			if (closed) return;
			if (bridgeReady && bridge) {
				bridge.triggerGreeting?.(instructions);
				return;
			}
			pendingGreeting = instructions;
		},
		handleBargeIn: (options) => requireBridge().handleBargeIn?.(options),
		submitToolResult: (callId, result, options) => requireBridge().submitToolResult(callId, result, options),
		acknowledgeMark: () => requireBridge().acknowledgeMark(),
		close: () => {
			closed = true;
			bridgeReady = false;
			providerTerminated = true;
			pendingAudio.clear();
			pendingUserMessages.length = 0;
			pendingUserMessageBytes = 0;
			pendingGreeting = void 0;
			closeBridge();
		},
		isConnected: () => bridge?.isConnected() ?? false
	};
}
function createLazyGoogleRealtimeVoiceProvider() {
	return {
		id: "google",
		label: "Google Live Voice",
		autoSelectOrder: 20,
		resolveConfig: ({ cfg, rawConfig }) => resolveGoogleRealtimeProviderConfig(rawConfig, cfg),
		isConfigured: ({ cfg, providerConfig }) => Boolean(normalizeOptionalString(providerConfig.apiKey) ?? normalizeOptionalString(cfg?.models?.providers?.google?.apiKey) ?? resolveGoogleRealtimeEnvApiKey()),
		createBridge: createLazyGoogleRealtimeVoiceBridge,
		createBrowserSession: async (req) => {
			const provider = await loadGoogleRealtimeVoiceProvider();
			if (!provider.createBrowserSession) throw new Error("Google realtime voice browser sessions are unavailable");
			return await provider.createBrowserSession(req);
		}
	};
}
function createLazyGoogleVideoGenerationProvider() {
	return {
		...createGoogleVideoGenerationProviderMetadata(),
		generateVideo: async (...args) => await (await loadGoogleVideoGenerationProvider()).generateVideo(...args)
	};
}
var google_default = definePluginEntry({
	id: "google",
	name: "Google Plugin",
	description: "Bundled Google plugin",
	register(api) {
		api.registerCliBackend(buildGoogleGeminiCliBackend());
		registerGoogleGeminiCliProvider(api);
		registerGoogleProvider(api);
		api.registerMemoryEmbeddingProvider(geminiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(createLazyGoogleImageGenerationProvider());
		api.registerMediaUnderstandingProvider(createLazyGoogleMediaUnderstandingProvider());
		api.registerMusicGenerationProvider(createLazyGoogleMusicGenerationProvider());
		api.registerRealtimeVoiceProvider(createLazyGoogleRealtimeVoiceProvider());
		api.registerSpeechProvider(buildGoogleSpeechProvider());
		api.registerVideoGenerationProvider(createLazyGoogleVideoGenerationProvider());
		api.registerWebSearchProvider(createGeminiWebSearchProvider());
	}
});
//#endregion
export { google_default as default };
