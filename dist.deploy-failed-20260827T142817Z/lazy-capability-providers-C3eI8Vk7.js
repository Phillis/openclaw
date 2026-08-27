import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as createRealtimeVoiceAudioQueue } from "./realtime-session-lifecycle-CmQhqqoW.js";
import { b as serializeXaiRealtimeToolResult } from "./realtime-voice-config-CSQZ6J9P.js";
import { c as createXaiImageGenerationProviderMetadata, d as createXaiRealtimeVoiceProviderMetadata, f as createXaiVideoGenerationProviderMetadata, l as createXaiMediaUnderstandingProviderMetadata, m as normalizeXaiRealtimeTranscriptionProviderConfig, s as assertXaiRealtimeVoiceRequestSupported, u as createXaiRealtimeTranscriptionProviderMetadata } from "./capability-provider-metadata-DikE8kIL.js";
import { n as createXaiSpeechProviderMetadata } from "./speech-provider-metadata-B0aOiZbn.js";
//#region extensions/xai/lazy-capability-providers.ts
const MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGES = 128;
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGE_BYTES = 256 * 1024;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULTS = 128;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULT_BYTES = 256 * 1024;
const loadXaiImageGenerationProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/image-generation-provider.js")).buildXaiImageGenerationProvider());
const loadXaiMediaUnderstandingProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/stt.js")).buildXaiMediaUnderstandingProvider());
const loadXaiRealtimeTranscriptionProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/realtime-transcription-provider.js")).buildXaiRealtimeTranscriptionProvider());
const loadXaiRealtimeVoiceProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/realtime-voice-provider.js")).buildXaiRealtimeVoiceProvider());
const loadXaiSpeechProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/speech-provider.js")).buildXaiSpeechProvider());
const loadXaiVideoGenerationProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/video-generation-provider.js")).buildXaiVideoGenerationProvider());
function createPendingTranscriptionAudioQueue() {
	let chunks = [];
	let head = 0;
	let bytes = 0;
	const clear = () => {
		chunks = [];
		head = 0;
		bytes = 0;
	};
	return {
		clear,
		drain: () => {
			const pending = chunks.slice(head).filter((chunk) => chunk !== void 0);
			clear();
			return pending;
		},
		enqueue: (audio) => {
			if (audio.byteLength > MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES) return;
			const chunk = Buffer.from(audio);
			chunks.push(chunk);
			bytes += chunk.byteLength;
			while (bytes > MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES && head < chunks.length) {
				const dropped = chunks[head];
				chunks[head] = void 0;
				head += 1;
				bytes -= dropped?.byteLength ?? 0;
			}
			if (head > 256 && head * 2 >= chunks.length) {
				chunks = chunks.slice(head);
				head = 0;
			}
		}
	};
}
function createLazyXaiRealtimeTranscriptionSession(req) {
	let session;
	let sessionPromise;
	let activeConnect;
	let generation = 0;
	let closedSessionGeneration;
	let closed = false;
	let acceptsInput = false;
	const pendingAudio = createPendingTranscriptionAudioQueue();
	const closeSession = (closeGeneration, loadedSession = session) => {
		if (!loadedSession || closedSessionGeneration === closeGeneration) return;
		closedSessionGeneration = closeGeneration;
		loadedSession.close();
	};
	const loadSession = async () => {
		if (!sessionPromise) sessionPromise = loadXaiRealtimeTranscriptionProvider().then((provider) => provider.createSession(req));
		session = await sessionPromise;
		return session;
	};
	const beginConnectGeneration = () => {
		if (closed) {
			generation += 1;
			closed = false;
		}
		return generation;
	};
	return {
		connect: async () => {
			const connectGeneration = beginConnectGeneration();
			if (activeConnect?.generation === connectGeneration) {
				await activeConnect.promise;
				return;
			}
			const promise = (async () => {
				const loadedSession = await loadSession();
				if (connectGeneration !== generation || closed) {
					if (connectGeneration === generation && closed) closeSession(connectGeneration, loadedSession);
					return;
				}
				for (const audio of pendingAudio.drain()) loadedSession.sendAudio(audio);
				acceptsInput = true;
				await loadedSession.connect();
				if (connectGeneration === generation && closed) closeSession(connectGeneration, loadedSession);
			})();
			const connectTask = {
				generation: connectGeneration,
				promise
			};
			activeConnect = connectTask;
			try {
				await promise;
			} finally {
				if (activeConnect === connectTask) activeConnect = void 0;
			}
		},
		sendAudio: (audio) => {
			if (closed) return;
			if (acceptsInput && session) {
				session.sendAudio(audio);
				return;
			}
			pendingAudio.enqueue(audio);
		},
		close: () => {
			if (closed) return;
			closed = true;
			acceptsInput = false;
			pendingAudio.clear();
			closeSession(generation);
		},
		isConnected: () => !closed && (session?.isConnected() ?? false)
	};
}
function createLazyXaiRealtimeVoiceBridge(req) {
	assertXaiRealtimeVoiceRequestSupported(req);
	let bridge;
	let bridgeState;
	let activeConnect;
	let generation = 0;
	let terminalGeneration;
	let closed = false;
	let acceptsInput = false;
	let pendingMediaTimestamp;
	let pendingGreeting;
	let pendingUserMessageCount = 0;
	let pendingUserMessageBytes = 0;
	let pendingToolResultCount = 0;
	let pendingToolResultBytes = 0;
	const closedBridges = /* @__PURE__ */ new WeakSet();
	const pendingAudio = createRealtimeVoiceAudioQueue("reject-newest");
	const pendingOperations = [];
	const clearPendingInput = () => {
		pendingAudio.clear();
		pendingOperations.length = 0;
		pendingMediaTimestamp = void 0;
		pendingGreeting = void 0;
		pendingUserMessageCount = 0;
		pendingUserMessageBytes = 0;
		pendingToolResultCount = 0;
		pendingToolResultBytes = 0;
	};
	const emitTerminal = (terminalForGeneration, outcome) => {
		if (terminalForGeneration !== generation || terminalGeneration === terminalForGeneration) return;
		terminalGeneration = terminalForGeneration;
		acceptsInput = false;
		clearPendingInput();
		req.onClose?.(outcome);
	};
	const closeBridge = (loadedBridge = bridge) => {
		if (!loadedBridge || closedBridges.has(loadedBridge)) return;
		closedBridges.add(loadedBridge);
		loadedBridge.close();
	};
	const acceptsProviderCallback = (callbackGeneration) => callbackGeneration === generation && !closed && terminalGeneration !== callbackGeneration;
	const guardProviderCallback = (callbackGeneration, callback) => {
		return (...args) => {
			if (acceptsProviderCallback(callbackGeneration)) callback(...args);
		};
	};
	const loadBridge = async (loadGeneration) => {
		const existingState = bridgeState;
		const state = existingState?.generation === loadGeneration ? existingState : {
			generation: loadGeneration,
			promise: loadXaiRealtimeVoiceProvider().then((provider) => provider.createBridge({
				...req,
				onAudio: guardProviderCallback(loadGeneration, req.onAudio),
				onClearAudio: guardProviderCallback(loadGeneration, req.onClearAudio),
				...req.onMark ? { onMark: guardProviderCallback(loadGeneration, req.onMark) } : {},
				...req.onTranscript ? { onTranscript: guardProviderCallback(loadGeneration, req.onTranscript) } : {},
				...req.onEvent ? { onEvent: guardProviderCallback(loadGeneration, req.onEvent) } : {},
				...req.onResponseDone ? { onResponseDone: guardProviderCallback(loadGeneration, req.onResponseDone) } : {},
				...req.onToolCall ? { onToolCall: guardProviderCallback(loadGeneration, req.onToolCall) } : {},
				...req.onReady ? { onReady: guardProviderCallback(loadGeneration, req.onReady) } : {},
				...req.onError ? { onError: guardProviderCallback(loadGeneration, req.onError) } : {},
				onClose: (outcome) => emitTerminal(loadGeneration, outcome)
			}))
		};
		if (state !== existingState) bridgeState = state;
		const loadedBridge = await state.promise;
		if (bridgeState === state && loadGeneration === generation) bridge = loadedBridge;
		return loadedBridge;
	};
	const replacePendingOperation = (previous, next) => {
		if (previous) {
			const previousIndex = pendingOperations.indexOf(previous);
			if (previousIndex >= 0) pendingOperations.splice(previousIndex, 1);
		}
		pendingOperations.push(next);
		return next;
	};
	const beginConnectGeneration = () => {
		if (closed || terminalGeneration === generation) {
			generation += 1;
			closed = false;
			acceptsInput = false;
			bridge = void 0;
		}
		return generation;
	};
	const acceptsCurrentInput = () => !closed && terminalGeneration !== generation;
	const flushPendingInput = async (loadedBridge, connectGeneration) => {
		if (connectGeneration !== generation || !acceptsCurrentInput()) return;
		while (true) {
			if (connectGeneration !== generation || !acceptsCurrentInput()) return;
			const operation = pendingOperations.shift();
			if (!operation) {
				acceptsInput = true;
				return;
			}
			switch (operation.type) {
				case "audio": {
					const chunk = pendingAudio.dequeue();
					if (!chunk) throw new Error("xAI realtime voice pending audio queue invariant violated");
					loadedBridge.sendAudio(chunk);
					break;
				}
				case "media-timestamp":
					if (pendingMediaTimestamp === operation) pendingMediaTimestamp = void 0;
					loadedBridge.setMediaTimestamp(operation.timestamp);
					break;
				case "user-message":
					loadedBridge.sendUserMessage?.(operation.text);
					break;
				case "tool-result":
					await loadedBridge.submitToolResult(operation.callId, operation.result, operation.options);
					break;
				case "greeting":
					if (pendingGreeting === operation) pendingGreeting = void 0;
					loadedBridge.triggerGreeting?.(operation.instructions);
					break;
			}
			if (connectGeneration !== generation || !acceptsCurrentInput()) return;
			if (operation.type === "user-message") {
				pendingUserMessageCount -= 1;
				pendingUserMessageBytes -= operation.bytes;
			} else if (operation.type === "tool-result") {
				pendingToolResultCount -= 1;
				pendingToolResultBytes -= operation.bytes;
			}
		}
	};
	return {
		get supportsToolResultContinuation() {
			return bridge?.supportsToolResultContinuation ?? false;
		},
		connect: async () => {
			const connectGeneration = beginConnectGeneration();
			if (activeConnect?.generation === connectGeneration) {
				await activeConnect.promise;
				return;
			}
			const promise = (async () => {
				const loadedBridge = await loadBridge(connectGeneration);
				if (connectGeneration !== generation || !acceptsCurrentInput()) {
					closeBridge(loadedBridge);
					return;
				}
				try {
					await loadedBridge.connect();
				} catch (error) {
					if (connectGeneration === generation) {
						acceptsInput = false;
						terminalGeneration = connectGeneration;
						clearPendingInput();
					}
					throw error;
				}
				if (connectGeneration !== generation || !acceptsCurrentInput()) {
					closeBridge(loadedBridge);
					return;
				}
				try {
					await flushPendingInput(loadedBridge, connectGeneration);
				} catch (error) {
					emitTerminal(connectGeneration, "error");
					closeBridge(loadedBridge);
					throw error;
				}
				if (connectGeneration !== generation || !acceptsCurrentInput()) closeBridge(loadedBridge);
			})();
			const connectTask = {
				generation: connectGeneration,
				promise
			};
			activeConnect = connectTask;
			try {
				await promise;
			} finally {
				if (activeConnect === connectTask) activeConnect = void 0;
			}
		},
		sendAudio: (audio) => {
			if (!acceptsCurrentInput()) return;
			if (acceptsInput && bridge) {
				bridge.sendAudio(audio);
				return;
			}
			if (pendingAudio.enqueue(audio)) pendingOperations.push({ type: "audio" });
		},
		setMediaTimestamp: (timestamp) => {
			if (!acceptsCurrentInput()) return;
			if (acceptsInput && bridge) {
				bridge.setMediaTimestamp(timestamp);
				return;
			}
			pendingMediaTimestamp = replacePendingOperation(pendingMediaTimestamp, {
				timestamp,
				type: "media-timestamp"
			});
		},
		sendUserMessage: (text) => {
			if (!acceptsCurrentInput()) return;
			if (acceptsInput && bridge) {
				bridge.sendUserMessage?.(text);
				return;
			}
			const messageBytes = Buffer.byteLength(text, "utf8");
			if (pendingUserMessageCount >= MAX_LAZY_REALTIME_VOICE_USER_MESSAGES || pendingUserMessageBytes + messageBytes > MAX_LAZY_REALTIME_VOICE_USER_MESSAGE_BYTES) {
				req.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message overflow during lazy startup"));
				return;
			}
			pendingOperations.push({
				bytes: messageBytes,
				text,
				type: "user-message"
			});
			pendingUserMessageCount += 1;
			pendingUserMessageBytes += messageBytes;
		},
		triggerGreeting: (instructions) => {
			if (!acceptsCurrentInput()) return;
			if (acceptsInput && bridge) {
				bridge.triggerGreeting?.(instructions);
				return;
			}
			pendingGreeting = replacePendingOperation(pendingGreeting, {
				instructions,
				type: "greeting"
			});
		},
		handleBargeIn: (options) => {
			if (acceptsCurrentInput()) bridge?.handleBargeIn?.(options);
		},
		submitToolResult: (callId, result, options) => {
			if (!acceptsCurrentInput() || options?.willContinue === true) return;
			if (acceptsInput && bridge) return bridge.submitToolResult(callId, result, options);
			let serialized;
			try {
				serialized = serializeXaiRealtimeToolResult(result);
			} catch (error) {
				req.onError?.(error);
				throw error;
			}
			const pending = {
				callId,
				result: JSON.parse(serialized),
				...options ? { options } : {}
			};
			const resultBytes = Buffer.byteLength(JSON.stringify(pending), "utf8");
			if (pendingToolResultCount >= MAX_LAZY_REALTIME_VOICE_TOOL_RESULTS || pendingToolResultBytes + resultBytes > MAX_LAZY_REALTIME_VOICE_TOOL_RESULT_BYTES) {
				const error = /* @__PURE__ */ new Error("xAI realtime voice pending tool result overflow during lazy startup");
				req.onError?.(error);
				throw error;
			}
			pendingOperations.push({
				...pending,
				bytes: resultBytes,
				type: "tool-result"
			});
			pendingToolResultCount += 1;
			pendingToolResultBytes += resultBytes;
		},
		acknowledgeMark: (markName) => {
			if (acceptsCurrentInput()) bridge?.acknowledgeMark(markName);
		},
		close: () => {
			if (closed) return;
			const closeGeneration = generation;
			closed = true;
			acceptsInput = false;
			clearPendingInput();
			closeBridge();
			emitTerminal(closeGeneration, "completed");
		},
		isConnected: () => acceptsCurrentInput() && (bridge?.isConnected() ?? false)
	};
}
function createLazyXaiImageGenerationProvider() {
	return {
		...createXaiImageGenerationProviderMetadata(),
		generateImage: async (req) => (await loadXaiImageGenerationProvider()).generateImage(req)
	};
}
function createLazyXaiMediaUnderstandingProvider() {
	return {
		...createXaiMediaUnderstandingProviderMetadata(),
		transcribeAudio: async (req) => {
			const provider = await loadXaiMediaUnderstandingProvider();
			if (!provider.transcribeAudio) throw new Error("xAI media understanding provider missing transcribeAudio");
			return await provider.transcribeAudio(req);
		}
	};
}
function createLazyXaiVideoGenerationProvider() {
	return {
		...createXaiVideoGenerationProviderMetadata(),
		generateVideo: async (req) => (await loadXaiVideoGenerationProvider()).generateVideo(req)
	};
}
function createLazyXaiSpeechProvider() {
	return {
		...createXaiSpeechProviderMetadata(),
		listVoices: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.listVoices) throw new Error("xAI speech provider missing listVoices");
			return await provider.listVoices(req);
		},
		synthesize: async (req) => await (await loadXaiSpeechProvider()).synthesize(req),
		streamSynthesize: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.streamSynthesize) throw new Error("xAI speech provider missing streamSynthesize");
			return await provider.streamSynthesize(req);
		},
		synthesizeTelephony: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.synthesizeTelephony) throw new Error("xAI speech provider missing synthesizeTelephony");
			return await provider.synthesizeTelephony(req);
		}
	};
}
function createLazyXaiRealtimeTranscriptionProvider() {
	return {
		...createXaiRealtimeTranscriptionProviderMetadata(),
		createSession: (req) => {
			normalizeXaiRealtimeTranscriptionProviderConfig(req.providerConfig);
			return createLazyXaiRealtimeTranscriptionSession(req);
		}
	};
}
function createLazyXaiRealtimeVoiceProvider() {
	return {
		...createXaiRealtimeVoiceProviderMetadata(),
		createBridge: createLazyXaiRealtimeVoiceBridge
	};
}
//#endregion
export { createLazyXaiSpeechProvider as a, createLazyXaiRealtimeVoiceProvider as i, createLazyXaiMediaUnderstandingProvider as n, createLazyXaiVideoGenerationProvider as o, createLazyXaiRealtimeTranscriptionProvider as r, createLazyXaiImageGenerationProvider as t };
