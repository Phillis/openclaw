import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import { m as normalizeResolvedSecretInputString } from "../../types.secrets-Bre8L6Ts.js";
import "../../string-coerce-runtime-C8jKEm3h.js";
import "../../secret-input-bJBlHnFk.js";
import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { n as createRealtimeVoiceAudioQueue } from "../../realtime-session-lifecycle-Dcc59a-5.js";
import { t as buildGoogleGeminiCliBackend } from "../../cli-backend-B19Eb2vp.js";
import { n as registerGoogleGeminiCliProvider } from "../../gemini-cli-provider-CxgZt2Ka.js";
import { c as createGoogleMusicGenerationProviderMetadata, l as createGoogleVideoGenerationProviderMetadata } from "../../generation-provider-metadata-Dp8yu0ZP.js";
import { t as geminiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-ifwC9kzq.js";
import { n as registerGoogleProvider } from "../../provider-registration-DBV52aKB.js";
import { t as buildGoogleSpeechProvider } from "../../speech-provider-CLRK8db9.js";
import { t as createGeminiWebSearchProvider } from "../../gemini-web-search-provider-BZaak5h5.js";
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
	const raw = asOptionalRecord(asOptionalRecord(rawConfig.providers)?.google) ?? asOptionalRecord(rawConfig.google) ?? rawConfig;
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
	let bridgePromiseGeneration = 0;
	let bridgeReady = false;
	let terminated = false;
	let generation = 0;
	let latestMediaTimestamp;
	let pendingGreeting;
	const pendingAudio = createRealtimeVoiceAudioQueue("drop-oldest");
	const pendingUserMessages = [];
	let pendingUserMessageBytes = 0;
	const closedBridges = /* @__PURE__ */ new WeakSet();
	const clearPendingInput = () => {
		pendingAudio.clear();
		pendingUserMessages.length = 0;
		pendingUserMessageBytes = 0;
		pendingGreeting = void 0;
		latestMediaTimestamp = void 0;
	};
	const isCurrentNonterminalGeneration = (candidate) => candidate === generation && !terminated;
	const closeBridge = (loadedBridge = bridge) => {
		if (!loadedBridge || closedBridges.has(loadedBridge)) return;
		closedBridges.add(loadedBridge);
		loadedBridge.close();
	};
	const emitTerminal = (terminalGeneration, reason) => {
		if (!isCurrentNonterminalGeneration(terminalGeneration)) return;
		bridgeReady = false;
		terminated = true;
		clearPendingInput();
		req.onClose?.(reason);
	};
	const throwTerminalBridgeError = (terminalGeneration, loadedBridge, primaryError) => {
		if (isCurrentNonterminalGeneration(terminalGeneration)) {
			try {
				req.onError?.(primaryError instanceof Error ? primaryError : new Error(String(primaryError)));
			} catch {}
			try {
				emitTerminal(terminalGeneration, "error");
			} catch {}
		}
		try {
			closeBridge(loadedBridge);
		} catch {}
		throw primaryError;
	};
	const loadBridge = async () => {
		if (!bridgePromise) {
			const loadGeneration = generation;
			bridgePromiseGeneration = loadGeneration;
			bridgePromise = loadGoogleRealtimeVoiceProvider().then((provider) => provider.createBridge({
				...req,
				onReady: () => {
					if (loadGeneration !== generation || terminated) return;
					req.onReady?.();
					if (loadGeneration !== generation || terminated || !bridge) return;
					bridgeReady = true;
					flushPending(bridge);
				},
				onClose: (reason) => {
					emitTerminal(loadGeneration, reason);
				}
			}));
		}
		const loading = bridgePromise;
		const loadGeneration = bridgePromiseGeneration;
		const loadedBridge = await loading;
		if (loading !== bridgePromise || loadGeneration !== generation || terminated) {
			closeBridge(loadedBridge);
			return loadedBridge;
		}
		bridge = loadedBridge;
		return loadedBridge;
	};
	const requireBridge = () => {
		if (!bridge) throw new Error("Google realtime voice bridge is not connected");
		return bridge;
	};
	const flushPending = (loadedBridge) => {
		if (terminated) return;
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
			if (terminated) {
				generation += 1;
				bridge = void 0;
				bridgePromise = void 0;
				bridgeReady = false;
				terminated = false;
			}
			const connectGeneration = generation;
			const loadedBridge = await loadBridge();
			if (connectGeneration !== generation || terminated) {
				closeBridge(loadedBridge);
				return;
			}
			try {
				await loadedBridge.connect();
			} catch (error) {
				throwTerminalBridgeError(connectGeneration, loadedBridge, error);
			}
			if (connectGeneration !== generation || terminated) closeBridge(loadedBridge);
		},
		sendAudio: (audio) => {
			if (terminated) return;
			if (bridgeReady && bridge) {
				bridge.sendAudio(audio);
				return;
			}
			pendingAudio.enqueue(audio);
		},
		setMediaTimestamp: (ts) => {
			if (terminated) return;
			latestMediaTimestamp = ts;
			bridge?.setMediaTimestamp(ts);
		},
		sendUserMessage: (text) => {
			if (terminated) return;
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
			if (terminated) return;
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
			if (terminated) return;
			terminated = true;
			bridgeReady = false;
			clearPendingInput();
			closeBridge();
			req.onClose?.("completed");
		},
		isConnected: () => !terminated && (bridge?.isConnected() ?? false)
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
		api.registerEmbeddingProvider(geminiMemoryEmbeddingProviderAdapter);
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
