import { t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import { n as createDebugProxyWebSocketAgent, r as resolveDebugProxySettings } from "./env-CKcI7t_B.js";
import { n as captureWsEvent } from "./runtime-NDWM8q7n.js";
import "./proxy-capture-BflLDg9r.js";
import "./media-runtime-vkQwnhW4.js";
import { n as rawDataToString } from "./ws-C3ckvj65.js";
import { t as RealtimeVoiceSessionLifecycle } from "./realtime-session-lifecycle-CmQhqqoW.js";
import { w as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "./realtime-session-harness-BWrgDib2.js";
import "./realtime-voice-oUx-QwLx.js";
import { a as mulawToPcm, i as convertPcmToMulaw8k, s as resamplePcm } from "./audio-energy-DF0tOiok.js";
import "./webhook-ingress-h_3NGYrN.js";
import { a as buildOpenAIQuicksilverWebSocketUrl, d as parseOpenAIQuicksilverEvent, i as buildOpenAIQuicksilverSessionUpdate, n as boundOpenAIQuicksilverDelegationResult, s as chunkOpenAIQuicksilverAppendText } from "./realtime-quicksilver-wire-CcNGVsjw.js";
import { t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-CLfRPtZv.js";
import { randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-bridge.ts
const OPENAI_QUICKSILVER_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
const OPENAI_QUICKSILVER_READY_TIMEOUT_MS = 15e3;
const OPENAI_QUICKSILVER_SAMPLE_RATE = 24e3;
const WEBSOCKET_OPEN = 1;
function toolResultText(result) {
	if (typeof result === "string") return result;
	if (result && typeof result === "object") {
		const record = result;
		for (const key of [
			"text",
			"result",
			"output",
			"error"
		]) {
			const value = record[key];
			if (typeof value === "string" && value.trim()) return value;
		}
	}
	try {
		return JSON.stringify(result) ?? String(result);
	} catch {
		return String(result);
	}
}
var OpenAIQuicksilverVoiceBridge = class {
	constructor(config) {
		this.config = config;
		this.supportsToolResultContinuation = true;
		this.supportsToolResultSuppression = true;
		this.handlesInputAudioBargeIn = false;
		this.lifecycle = new RealtimeVoiceSessionLifecycle("OpenAI");
		this.activeDelegations = /* @__PURE__ */ new Set();
		this.flowId = randomUUID();
		this.requestIds = {
			realtimeSessionId: randomUUID(),
			sessionId: randomUUID(),
			threadId: randomUUID()
		};
	}
	async connect() {
		await this.lifecycle.connect((connection) => this.connectConnection(connection));
	}
	async connectConnection(connection) {
		let connected;
		try {
			const auth = await this.waitForConnection(this.config.resolveAuth(), connection);
			if (!auth) return;
			const url = buildOpenAIQuicksilverWebSocketUrl(this.config.model);
			connected = await connectOpenAIQuicksilverSideband({
				auth,
				createSocket: this.config.webSocketFactory ?? this.createSocketFactory(),
				requestIds: this.requestIds,
				signal: connection.signal,
				url
			});
		} catch (error) {
			if (!this.lifecycle.isCurrent(connection) || this.lifecycle.terminalOutcome(connection) === "completed") return;
			this.failLifecycle(connection);
			throw error;
		}
		if (!this.lifecycle.isCurrent(connection) || connection.signal.aborted) {
			this.closeSocket("stale connection", connected.socket);
			return;
		}
		const url = buildOpenAIQuicksilverWebSocketUrl(this.config.model);
		this.socket = connected.socket;
		captureWsEvent({
			url,
			direction: "local",
			kind: "ws-open",
			flowId: this.flowId,
			meta: {
				provider: "openai",
				capability: "gpt-live-voice"
			}
		});
		let reachedReady = false;
		let resolveReady;
		let rejectReady;
		let readySettled = false;
		let removeAbortListener = () => {};
		const readyPromise = new Promise((resolve, reject) => {
			resolveReady = resolve;
			rejectReady = reject;
		});
		const settleReady = (providerReady = true) => {
			if (readySettled) return;
			readySettled = true;
			reachedReady = providerReady;
			if (readyTimeout) clearTimeout(readyTimeout);
			removeAbortListener();
			resolveReady();
		};
		const failReady = (error) => {
			if (readySettled) return;
			readySettled = true;
			if (readyTimeout) clearTimeout(readyTimeout);
			removeAbortListener();
			rejectReady(error);
		};
		const failStartup = (error, reason) => {
			if (this.lifecycle.terminalOutcome(connection) === "completed") {
				settleReady(false);
				return;
			}
			if (!this.lifecycle.acceptsEvents(connection) || reachedReady) return;
			this.failLifecycle(connection);
			failReady(error);
			this.closeSocket(reason, connected.socket);
		};
		const readyTimeout = setTimeout(() => {
			failStartup(/* @__PURE__ */ new Error("GPT-Live WebSocket did not emit session.started"), "session-start timeout");
		}, OPENAI_QUICKSILVER_READY_TIMEOUT_MS);
		readyTimeout.unref?.();
		const onAbort = () => {
			if (this.lifecycle.terminalOutcome(connection) === "completed") settleReady(false);
		};
		connection.signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => connection.signal.removeEventListener("abort", onAbort);
		if (connection.signal.aborted) onAbort();
		connected.socket.on("message", (data, isBinary) => {
			if (!this.lifecycle.acceptsEvents(connection) || this.socket !== connected.socket) return;
			if (isBinary) {
				const error = /* @__PURE__ */ new Error("GPT-Live WebSocket returned an unexpected binary frame");
				if (!reachedReady) failStartup(error, "unexpected binary frame");
				else this.fail(connection, error);
				return;
			}
			const payload = rawDataToString(data);
			captureWsEvent({
				url,
				direction: "inbound",
				kind: "ws-frame",
				flowId: this.flowId,
				payload,
				meta: {
					provider: "openai",
					capability: "gpt-live-voice"
				}
			});
			const event = parseOpenAIQuicksilverEvent(payload);
			if (event) this.handleEvent(event, connection, settleReady, failStartup);
		});
		connected.socket.on("error", (error) => {
			if (!this.lifecycle.acceptsEvents(connection) || this.socket !== connected.socket) return;
			if (!reachedReady) failStartup(error, "startup error");
			else this.fail(connection, error);
		});
		connected.socket.on("close", () => {
			if (!this.lifecycle.isCurrent(connection) || this.socket !== connected.socket) return;
			this.socket = void 0;
			if (!reachedReady) {
				if (this.lifecycle.terminalOutcome(connection) === "completed") {
					settleReady();
					this.notifyClose(connection, "completed");
					return;
				}
				const error = /* @__PURE__ */ new Error("GPT-Live WebSocket closed before session.started");
				this.failLifecycle(connection);
				failReady(error);
				this.lifecycle.close(connection, "error");
				return;
			}
			this.notifyClose(connection, "error");
		});
		const terminalEvent = connected.detachBuffer();
		this.sendEvent(buildOpenAIQuicksilverSessionUpdate({
			instructions: this.config.instructions,
			voice: this.config.voice
		}));
		for (const frame of connected.bufferedFrames) if (!frame.isBinary) {
			const event = parseOpenAIQuicksilverEvent(rawDataToString(frame.data));
			if (event) this.handleEvent(event, connection, settleReady, failStartup);
		}
		if (terminalEvent) {
			const error = terminalEvent.kind === "error" ? terminalEvent.error : /* @__PURE__ */ new Error("GPT-Live WebSocket closed during startup");
			if (reachedReady) {
				if (this.fail(connection, error, "startup terminal event")) this.notifyClose(connection, "error");
			} else failStartup(error, "startup terminal event");
		}
		await readyPromise;
	}
	sendAudio(audio) {
		if (this.lifecycle.phase() === "terminal") return;
		if (!this.lifecycle.isReady() || this.socket?.readyState !== WEBSOCKET_OPEN) {
			this.lifecycle.enqueuePendingAudio(audio);
			return;
		}
		this.sendAudioNow(audio);
	}
	setMediaTimestamp(_ts) {}
	sendUserMessage(text) {
		this.sendContext("session.context.append", void 0, text);
	}
	triggerGreeting(instructions) {
		this.sendContext("session.context.append", void 0, instructions ?? "Greet the user briefly.", "speakable");
	}
	submitToolResult(callId, result, options) {
		const channel = options?.suppressResponse || options?.willContinue ? "commentary" : "speakable";
		const isDelegation = this.activeDelegations.has(callId);
		const type = isDelegation ? "delegation.context.append" : "session.context.append";
		const text = toolResultText(result);
		this.sendContext(type, isDelegation ? callId : void 0, isDelegation ? boundOpenAIQuicksilverDelegationResult(text) : text, channel);
		if (!options?.willContinue) this.activeDelegations.delete(callId);
	}
	acknowledgeMark(_markName) {}
	close() {
		const connection = this.lifecycle.currentConnection();
		if (!this.lifecycle.cancel()) return;
		this.resetTerminalState();
		if (!connection) return;
		if (this.socket?.readyState === WEBSOCKET_OPEN) this.sendEvent({ type: "session.close" });
		this.closeSocket("bridge closed");
		this.notifyClose(connection, "completed");
	}
	isConnected() {
		return this.lifecycle.isReady() && this.socket?.readyState === WEBSOCKET_OPEN;
	}
	handleBargeIn() {
		this.config.onClearAudio("barge-in");
	}
	createSocketFactory() {
		return (url, options) => {
			const proxyAgent = createDebugProxyWebSocketAgent(resolveDebugProxySettings());
			return new WebSocket$1(url, {
				...options,
				maxPayload: OPENAI_QUICKSILVER_MAX_PAYLOAD_BYTES,
				...proxyAgent ? { agent: proxyAgent } : {}
			});
		};
	}
	async waitForConnection(promise, connection) {
		if (connection.signal.aborted) return;
		return new Promise((resolve, reject) => {
			const onAbort = () => {
				cleanup();
				resolve(void 0);
			};
			const cleanup = () => connection.signal.removeEventListener("abort", onAbort);
			connection.signal.addEventListener("abort", onAbort, { once: true });
			promise.then((value) => {
				cleanup();
				resolve(value);
			}, (error) => {
				cleanup();
				reject(error instanceof Error ? error : new Error(String(error)));
			});
		});
	}
	handleEvent(event, connection, settleReady, failStartup) {
		if (event.kind === "ignored" || event.kind === "unknown") return;
		if (event.kind === "session-started") {
			if (this.lifecycle.ready(connection)) {
				for (const audio of this.lifecycle.drainPendingAudio()) this.sendAudioNow(audio);
				this.config.onReady?.();
			}
			this.config.onEvent?.({
				direction: "server",
				type: "session.started"
			});
			settleReady();
			return;
		}
		if (event.kind === "audio") {
			const canonical = canonicalizeBase64(event.data);
			if (!canonical) {
				this.fail(connection, /* @__PURE__ */ new Error("GPT-Live WebSocket returned malformed base64 audio"));
				return;
			}
			const pcm = Buffer.from(canonical, "base64");
			this.config.onAudio(this.config.audioFormat?.encoding === "g711_ulaw" ? convertPcmToMulaw8k(pcm, OPENAI_QUICKSILVER_SAMPLE_RATE) : pcm);
			this.config.onEvent?.({
				direction: "server",
				type: "output_audio.delta"
			});
			return;
		}
		if (event.kind === "transcript-delta" || event.kind === "transcript-done") {
			this.config.onTranscript?.(event.role, event.text, event.kind === "transcript-done");
			this.config.onEvent?.({
				direction: "server",
				type: event.kind === "transcript-done" ? event.role === "assistant" ? "response.done" : "turn.done" : `${event.role === "user" ? "input" : "output"}_transcript.added`
			});
			return;
		}
		if (event.kind === "delegation") {
			this.activeDelegations.add(event.id);
			this.config.onEvent?.({
				direction: "server",
				type: "delegation.created",
				itemId: event.id
			});
			this.config.onToolCall?.({
				itemId: event.id,
				callId: event.id,
				name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
				args: { question: event.prompt }
			});
			return;
		}
		const error = new Error(event.message);
		if (!this.lifecycle.isReady()) {
			failStartup(error, "session start failed");
			return;
		}
		this.config.onEvent?.({
			direction: "server",
			type: "error",
			detail: event.message
		});
		if (event.fatalAuth) this.fail(connection, error, "authentication failed");
		else this.config.onError?.(error);
	}
	sendAudioNow(audio) {
		const pcm = this.config.audioFormat?.encoding === "g711_ulaw" ? resamplePcm(mulawToPcm(audio), 8e3, OPENAI_QUICKSILVER_SAMPLE_RATE) : audio;
		this.sendEvent({
			type: "input_audio.append",
			audio: pcm.toString("base64")
		});
	}
	sendContext(type, delegationItemId, text, channel) {
		for (const chunk of chunkOpenAIQuicksilverAppendText(text)) this.sendEvent({
			type,
			...delegationItemId ? { delegation_item_id: delegationItemId } : {},
			...channel ? { channel } : {},
			content: [{
				type: "input_text",
				text: chunk
			}]
		});
	}
	sendEvent(event) {
		if (!this.socket || this.socket.readyState !== WEBSOCKET_OPEN) return;
		const payload = JSON.stringify(event);
		captureWsEvent({
			url: buildOpenAIQuicksilverWebSocketUrl(this.config.model),
			direction: "outbound",
			kind: "ws-frame",
			flowId: this.flowId,
			payload,
			meta: {
				provider: "openai",
				capability: "gpt-live-voice"
			}
		});
		this.socket.send(payload);
	}
	fail(connection, error, reason = "bridge error") {
		if (!this.failLifecycle(connection)) return false;
		this.config.onError?.(error);
		this.closeSocket(reason);
		return true;
	}
	failLifecycle(connection) {
		if (!this.lifecycle.failure(connection)) return false;
		this.resetTerminalState();
		return true;
	}
	resetTerminalState() {
		this.activeDelegations.clear();
	}
	closeSocket(reason, socket = this.socket) {
		try {
			socket?.close(1e3, reason);
		} catch {}
	}
	notifyClose(connection, reason) {
		const outcome = this.lifecycle.close(connection, reason);
		if (!outcome) return;
		this.resetTerminalState();
		this.config.onClose?.(outcome);
	}
};
//#endregion
export { OpenAIQuicksilverVoiceBridge as t };
