import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./error-runtime-oXQewkZq.js";
import { c as createOpenAIQuicksilverCall, r as buildOpenAIQuicksilverSession } from "./realtime-quicksilver-wire-B_uld9Ep.js";
import { t as OpenAIQuicksilverDelegationController } from "./realtime-quicksilver-delegation-controller-J-ZhuiHp.js";
import { n as reserveOpenAIQuicksilverSession, t as releaseOpenAIQuicksilverSession } from "./realtime-quicksilver-session-limit-C_rvr0yn.js";
import { t as connectOpenAIQuicksilverSideband } from "./realtime-quicksilver-sideband-vD_u52lj.js";
import { n as OpenAIQuicksilverPendingAudio } from "./realtime-quicksilver-audio-buffer-ZY82NjqB.js";
import { randomUUID } from "node:crypto";
import WebSocket$1 from "ws";
//#region extensions/openai/realtime-quicksilver-gateway-bridge.ts
const RELAY_SAMPLE_RATE = 24e3;
const QUICKSILVER_SESSION_TTL_MS = 30 * 6e4;
const QUICKSILVER_CONNECT_TIMEOUT_MS = 3e4;
const WEBSOCKET_OPEN = 1;
function isAbortLikeError(error) {
	if (!error || typeof error !== "object") return false;
	const value = error;
	return value.name === "AbortError" || value.code === "ABORT_ERR" || value.message === "This operation was aborted";
}
function normalizeSidebandCloseReason(reason) {
	return (typeof reason === "string" ? reason : reason?.toString("utf8") ?? "").replaceAll(/\s+/g, " ").trim().slice(0, 180);
}
function describeSidebandClose(code, reason) {
	return `OpenAI GPT-Live sideband closed (code ${code}${reason ? `: ${reason}` : ""})`;
}
function connectAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error("GPT-Live gateway relay startup stopped", { cause: signal.reason });
}
function waitForConnectStep(promise, signal) {
	if (signal.aborted) return Promise.reject(connectAbortError(signal));
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			reject(connectAbortError(signal));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "OpenAI GPT-Live gateway relay failed"));
		});
	});
}
/** Realtime voice bridge used only when a Gateway relay injects the agent runner. */
var OpenAIQuicksilverGatewayBridge = class {
	constructor(config) {
		this.config = config;
		this.supportsToolResultContinuation = false;
		this.supportsToolResultSuppression = false;
		this.abortController = new AbortController();
		this.connected = false;
		this.closed = false;
		this.closeNotified = false;
		this.pendingAudio = new OpenAIQuicksilverPendingAudio();
		this.ready = false;
		if (config.runAgentConsult) this.delegations = new OpenAIQuicksilverDelegationController({
			getSocket: () => this.sideband?.socket,
			isCanceledError: isAbortLikeError,
			logger: config.logger,
			onFatalError: (error) => this.fail(error),
			onSessionStarted: (expiresAt) => {
				if (expiresAt !== void 0) this.scheduleExpiry(Math.min(QUICKSILVER_SESSION_TTL_MS, Math.max(0, expiresAt * 1e3 - Date.now())));
				if (!this.ready) {
					this.ready = true;
					this.config.onReady?.();
				}
			},
			onTranscript: (role, text, done) => this.config.onTranscript?.(role, text, done),
			onWireEventType: (eventType) => {
				this.config.onEvent?.({
					direction: "server",
					type: eventType
				});
				if (eventType === "output_audio_buffer.cleared") this.config.onClearAudio("barge-in");
			},
			runAgentConsult: config.runAgentConsult,
			signal: this.abortController.signal
		});
	}
	connect() {
		if (this.closed) return Promise.reject(/* @__PURE__ */ new Error("GPT-Live gateway relay bridge is closed"));
		this.connectPromise ??= this.connectInternal();
		return this.connectPromise;
	}
	sendAudio(audio) {
		if (this.peer) this.peer.sendAudio(audio);
		else if (!this.closed && !this.abortController.signal.aborted) this.pendingAudio.append(audio);
	}
	setMediaTimestamp(_ts) {}
	sendUserMessage(text) {
		this.delegations?.sendToActiveDelegation(text, "speakable");
	}
	submitToolResult() {
		throw new Error("GPT-Live gateway relay uses provider-owned agent delegations");
	}
	acknowledgeMark() {}
	close() {
		this.teardown("completed");
	}
	isConnected() {
		return this.connected && !this.closed;
	}
	async connectInternal() {
		if (!this.config.runAgentConsult) throw new Error("OpenAI GPT-Live gateway relay requires the Gateway agent-consult runtime");
		const audioFormat = this.config.audioFormat;
		if (audioFormat && (audioFormat.encoding !== "pcm16" || audioFormat.sampleRateHz !== RELAY_SAMPLE_RATE || audioFormat.channels !== 1)) throw new Error("OpenAI GPT-Live gateway relay requires mono PCM16 audio at 24 kHz");
		reserveOpenAIQuicksilverSession(this);
		const connectSignal = AbortSignal.any([this.abortController.signal, AbortSignal.timeout(this.config.connectTimeoutMs ?? QUICKSILVER_CONNECT_TIMEOUT_MS)]);
		try {
			const peerPromise = (this.config.createPeer ?? (async (callbacks, signal) => {
				const { OpenAIQuicksilverAudioPeer } = await import("./extensions/openai/realtime-quicksilver-peer.runtime.js");
				return await OpenAIQuicksilverAudioPeer.create({
					callbacks,
					signal
				});
			}))({
				onAudio: (audio) => this.config.onAudio(audio),
				onError: (error) => this.fail(error),
				onRtpPacket: () => this.config.onEvent?.({
					direction: "server",
					type: "output_audio.rtp"
				})
			}, connectSignal);
			peerPromise.then((peer) => {
				if (connectSignal.aborted || this.closed) peer.close();
			}, () => void 0);
			this.peer = await waitForConnectStep(peerPromise, connectSignal);
			if (this.pendingAudio.length > 0) {
				const pendingAudio = this.pendingAudio;
				this.pendingAudio = new OpenAIQuicksilverPendingAudio();
				this.peer.adoptPendingAudio(pendingAudio);
			}
			const offerSdp = await waitForConnectStep(this.peer.createOffer(), connectSignal);
			const auth = await waitForConnectStep(this.config.resolveAuth(), connectSignal);
			const requestIds = {
				realtimeSessionId: randomUUID(),
				sessionId: randomUUID(),
				threadId: randomUUID()
			};
			const call = await waitForConnectStep(createOpenAIQuicksilverCall({
				auth,
				requestIds,
				sdp: offerSdp,
				session: buildOpenAIQuicksilverSession({
					model: this.config.model,
					instructions: this.config.instructions,
					voice: this.config.voice
				}),
				signal: connectSignal,
				fetchImpl: this.config.fetchImpl
			}), connectSignal);
			if (call.kind !== "gpt-live") throw new Error("GPT-Live gateway relay unexpectedly used the GA realtime call shape");
			await waitForConnectStep(this.peer.applyAnswer(call.answerSdp), connectSignal);
			const connected = await connectOpenAIQuicksilverSideband({
				auth,
				createSocket: this.config.webSocketFactory ?? ((url, options) => new WebSocket$1(url, options)),
				requestIds,
				signal: connectSignal,
				url: call.sidebandUrl
			});
			if (connectSignal.aborted) {
				connected.socket.close(1e3, "session stopped");
				throw connectSignal.reason;
			}
			this.sideband = {
				socket: connected.socket,
				requestIds
			};
			this.attachSidebandHandlers(connected.socket);
			const terminalEvent = connected.detachBuffer();
			this.connected = true;
			this.scheduleExpiry(QUICKSILVER_SESSION_TTL_MS);
			for (const frame of connected.bufferedFrames) this.handleSidebandFrame(frame.data, frame.isBinary);
			if (terminalEvent?.kind === "error") throw terminalEvent.error;
			if (terminalEvent?.kind === "close") {
				const reason = normalizeSidebandCloseReason(terminalEvent.reason);
				throw new Error(describeSidebandClose(terminalEvent.code, reason));
			}
		} catch (error) {
			this.releaseResources();
			throw toErrorObject(error, "OpenAI GPT-Live gateway relay failed");
		}
	}
	attachSidebandHandlers(socket) {
		socket.on("message", (data, isBinary) => this.handleSidebandFrame(data, isBinary));
		socket.on("error", (error) => this.fail(error));
		socket.on("close", (code, rawReason) => {
			const closeCode = code ?? 1006;
			const reason = normalizeSidebandCloseReason(rawReason);
			if (!this.closed) if (closeCode === 1e3) this.teardown("completed");
			else this.fail(new Error(describeSidebandClose(closeCode, reason)));
		});
	}
	handleSidebandFrame(data, isBinary) {
		this.delegations?.handleFrame(data, isBinary);
	}
	scheduleExpiry(ttlMs) {
		if (this.timer) clearTimeout(this.timer);
		this.timer = setTimeout(() => this.teardown("completed"), Math.max(0, ttlMs));
		this.timer.unref?.();
	}
	fail(error) {
		this.teardown("error", () => this.config.onError?.(error));
	}
	teardown(reason, beforeClose) {
		if (this.closed) return;
		this.closed = true;
		this.releaseResources();
		try {
			beforeClose?.();
		} finally {
			if (!this.closeNotified) {
				this.closeNotified = true;
				this.config.onClose?.(reason);
			}
		}
	}
	releaseResources() {
		releaseOpenAIQuicksilverSession(this);
		this.connected = false;
		this.pendingAudio.clear();
		this.abortController.abort(/* @__PURE__ */ new Error("GPT-Live gateway relay bridge closed"));
		this.delegations?.stop(/* @__PURE__ */ new Error("GPT-Live delegation stopped"));
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = void 0;
		}
		const socket = this.sideband?.socket;
		this.sideband = void 0;
		if (socket?.readyState === WEBSOCKET_OPEN) try {
			socket.send(JSON.stringify({ type: "session.close" }));
		} catch {}
		try {
			socket?.close(1e3, "session closed");
		} catch {}
		this.peer?.close();
		this.peer = void 0;
	}
};
//#endregion
export { OpenAIQuicksilverGatewayBridge as t };
