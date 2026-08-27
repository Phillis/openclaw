import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as asOptionalObjectRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import "./error-runtime-CmA1H4Zg.js";
import "./runtime-env-_YEv0JPQ.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { H as readSpeakableRealtimeVoiceToolResult, V as readRealtimeVoiceConsultQuestion, k as buildRealtimeVoiceAgentConsultWorkingResponse, t as createRealtimeVoiceSessionHarness, w as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "./realtime-session-harness-BIfCDu_t.js";
import "./realtime-voice-DvokcLRl.js";
import { n as createSpeechThresholdGate, t as calculateMulawRms } from "./audio-energy-BP9DXUkU.js";
import "./text-utility-runtime-BNhX-3os.js";
import "./webhook-ingress-ByuWujwG.js";
import { n as normalizeWebhookPath } from "./webhook-targets-Bm2XLMzf.js";
import { d as REALTIME_VOICE_END_CALL_TOOL_NAME, s as resolveVoiceCallPublicPathPrefix } from "./config-CtG21fyw.js";
import { t as canonicalizeVoiceCallMediaBase64 } from "./media-base64-CoKSGskw.js";
import { randomUUID } from "node:crypto";
import WebSocket$1, { WebSocketServer } from "ws";
import "node:http";
//#region extensions/voice-call/src/webhook/realtime-audio-pacer.ts
const TELEPHONY_SAMPLE_RATE = 8e3;
const TELEPHONY_CHUNK_BYTES = 160;
const LEAD_MS = 160;
const DEFAULT_MAX_QUEUED_AUDIO_BYTES = TELEPHONY_SAMPLE_RATE * 120;
const QUEUE_COMPACT_HEAD_THRESHOLD = 256;
/** Paces outgoing mulaw audio frames at telephony cadence. */
var RealtimeAudioPacer = class {
	constructor(params) {
		this.params = params;
		this.queue = [];
		this.queueHead = 0;
		this.timer = null;
		this.queuedAudioBytes = 0;
		this.closed = false;
		this.streamClockMs = null;
	}
	/** Queue mulaw audio and split it into 20ms-ish telephony chunks. */
	sendAudio(muLaw) {
		if (this.closed || muLaw.length === 0) return;
		const maxQueuedAudioBytes = this.params.maxQueuedAudioBytes ?? DEFAULT_MAX_QUEUED_AUDIO_BYTES;
		for (let offset = 0; offset < muLaw.length; offset += TELEPHONY_CHUNK_BYTES) {
			const chunk = Buffer.from(muLaw.subarray(offset, offset + TELEPHONY_CHUNK_BYTES));
			if (this.queuedAudioBytes + chunk.length > maxQueuedAudioBytes) {
				this.failBackpressure();
				return;
			}
			this.queue.push({
				type: "audio",
				chunk,
				durationMs: chunk.length / 8
			});
			this.queuedAudioBytes += chunk.length;
		}
		this.ensurePump();
	}
	/** Queue a provider mark frame after prior audio frames. */
	sendMark(name) {
		if (this.closed || !name) return;
		this.queue.push({
			type: "mark",
			name
		});
		this.ensurePump();
	}
	/** Clear queued audio and notify the provider stream. */
	clearAudio() {
		if (this.closed) return 0;
		const clearedAudioBytes = this.queuedAudioBytes;
		this.clearTimer();
		this.resetQueue();
		this.queuedAudioBytes = 0;
		this.streamClockMs = null;
		this.params.send(this.params.serializer.clear());
		return clearedAudioBytes;
	}
	/** True while queued audio or a paced send timer can still reach the telephony stream. */
	hasPendingAudio() {
		return !this.closed && (this.queuedAudioBytes > 0 || this.timer !== null);
	}
	/** Stop sending and discard queued frames. */
	close() {
		this.closed = true;
		this.clearTimer();
		this.resetQueue();
		this.queuedAudioBytes = 0;
		this.streamClockMs = null;
	}
	/** Clear the scheduled pump timer. */
	clearTimer() {
		if (!this.timer) return;
		clearTimeout(this.timer);
		this.timer = null;
	}
	/** Start the pump when queued work exists and no timer is active. */
	ensurePump() {
		if (!this.timer) this.pump();
	}
	/** Close the pacer and notify the caller about queued-audio backpressure. */
	failBackpressure() {
		this.close();
		this.params.onBackpressure?.();
	}
	get pendingQueueSize() {
		return Math.max(0, this.queue.length - this.queueHead);
	}
	/** Take one queued item without shifting the remaining paced-audio backlog. */
	takeNextItem() {
		if (this.queueHead >= this.queue.length) {
			this.resetQueue();
			return;
		}
		const item = this.queue[this.queueHead];
		this.queueHead += 1;
		if (this.queueHead >= this.queue.length) this.resetQueue();
		else if (this.queueHead > QUEUE_COMPACT_HEAD_THRESHOLD && this.queueHead * 2 > this.queue.length) {
			this.queue.splice(0, this.queueHead);
			this.queueHead = 0;
		}
		return item;
	}
	resetQueue() {
		this.queue.length = 0;
		this.queueHead = 0;
	}
	/** Fill the provider playout cushion, then wake at the next timeline boundary. */
	pump() {
		this.timer = null;
		if (this.closed) return;
		const now = performance.now();
		this.streamClockMs ??= now;
		while (this.pendingQueueSize > 0 && this.streamClockMs < now + LEAD_MS) {
			const item = this.takeNextItem();
			if (!item) break;
			if (!(item.type === "audio" ? this.sendAudioItem(item) : this.params.send(this.params.serializer.mark(item.name)))) {
				this.resetQueue();
				this.queuedAudioBytes = 0;
				this.streamClockMs = null;
				return;
			}
		}
		if (this.pendingQueueSize === 0) {
			this.streamClockMs = null;
			return;
		}
		const delayMs = Math.max(1, this.streamClockMs - LEAD_MS - performance.now());
		this.timer = setTimeout(() => this.pump(), delayMs);
	}
	sendAudioItem(item) {
		this.queuedAudioBytes = Math.max(0, this.queuedAudioBytes - item.chunk.length);
		const sent = this.params.send(this.params.serializer.media(item.chunk.toString("base64")));
		this.streamClockMs = (this.streamClockMs ?? performance.now()) + item.durationMs;
		return sent;
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/stream-frame-adapter.ts
/** Parse numeric timestamps sent as numbers or integer strings. */
function parseTimestampMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && /^[+-]?\d+$/.test(value.trim())) {
		const parsed = Number(value.trim());
		return Number.isSafeInteger(parsed) ? parsed : void 0;
	}
}
/** Parse a JSON object frame, returning null for invalid or non-object payloads. */
function tryParseJson(rawMessage) {
	try {
		return asNullableRecord(JSON.parse(rawMessage));
	} catch {}
	return null;
}
/** Read an object-valued field from a parsed frame. */
function readRecordField(record, field) {
	return asOptionalObjectRecord(record[field]);
}
/** Parse a common provider media frame. */
function parseMediaFrame(msg) {
	const mediaData = readRecordField(msg, "media");
	const payload = typeof mediaData?.payload === "string" ? mediaData.payload : void 0;
	const canonicalPayload = payload ? canonicalizeVoiceCallMediaBase64(payload) : void 0;
	if (!canonicalPayload) return { kind: "ignored" };
	return {
		kind: "media",
		payloadBase64: canonicalPayload,
		timestampMs: parseTimestampMs(mediaData?.timestamp),
		track: typeof mediaData?.track === "string" ? mediaData.track : void 0
	};
}
/** Parse a common provider mark frame. */
function parseMarkFrame(msg) {
	const markData = readRecordField(msg, "mark");
	return {
		kind: "mark",
		name: typeof markData?.name === "string" ? markData.name : void 0
	};
}
/** Parse common media, mark, and stop frames shared by supported providers. */
function parseCommonInboundFrame(event, msg) {
	if (event === "media") return parseMediaFrame(msg);
	if (event === "mark") return parseMarkFrame(msg);
	if (event === "stop") return { kind: "stop" };
}
/** Parse one provider frame with provider-specific start/error hooks. */
function parseProviderInboundFrame(rawMessage, parseStartFrame, parseExtraFrame) {
	const msg = tryParseJson(rawMessage);
	if (!msg) return { kind: "ignored" };
	const event = msg.event;
	if (event === "start") return parseStartFrame(msg) ?? { kind: "ignored" };
	return parseCommonInboundFrame(event, msg) ?? parseExtraFrame?.(event, msg) ?? { kind: "ignored" };
}
/** Include streamSid only when Twilio has already supplied one. */
function withOptionalStreamSid(streamSid) {
	return streamSid === void 0 ? {} : { streamSid };
}
/** Serialize a provider media frame. */
function serializeMediaFrame(payloadBase64, streamSid) {
	return JSON.stringify({
		event: "media",
		...withOptionalStreamSid(streamSid),
		media: { payload: payloadBase64 }
	});
}
/** Serialize a provider clear frame. */
function serializeClearFrame(streamSid) {
	return JSON.stringify({
		event: "clear",
		...withOptionalStreamSid(streamSid)
	});
}
/** Serialize a provider mark frame. */
function serializeMarkFrame(name, streamSid) {
	return JSON.stringify({
		event: "mark",
		...withOptionalStreamSid(streamSid),
		mark: { name }
	});
}
/** Twilio media stream adapter, retaining streamSid for outbound frames. */
var TwilioStreamFrameAdapter = class {
	constructor() {
		this.providerName = "twilio";
		this.streamSid = "";
	}
	/** Parse one Twilio websocket message into a normalized frame. */
	parseInbound(rawMessage) {
		return parseProviderInboundFrame(rawMessage, (msg) => {
			const startData = readRecordField(msg, "start");
			const streamSid = typeof startData?.streamSid === "string" ? startData.streamSid : "";
			const callSid = typeof startData?.callSid === "string" ? startData.callSid : "";
			if (!streamSid || !callSid) return;
			this.streamSid = streamSid;
			return {
				kind: "start",
				streamId: streamSid,
				providerCallId: callSid
			};
		});
	}
	/** Serialize Twilio media with the active streamSid. */
	serializeMedia(payloadBase64) {
		return serializeMediaFrame(payloadBase64, this.streamSid);
	}
	/** Serialize Twilio clear with the active streamSid. */
	serializeClear() {
		return serializeClearFrame(this.streamSid);
	}
	/** Serialize Twilio mark with the active streamSid. */
	serializeMark(name) {
		return serializeMarkFrame(name, this.streamSid);
	}
};
/** Telnyx media stream adapter. */
var TelnyxStreamFrameAdapter = class {
	constructor() {
		this.providerName = "telnyx";
	}
	/** Parse one Telnyx websocket message into a normalized frame. */
	parseInbound(rawMessage) {
		return parseProviderInboundFrame(rawMessage, (msg) => {
			const topLevelStreamId = typeof msg.stream_id === "string" && msg.stream_id ? msg.stream_id : void 0;
			const startData = readRecordField(msg, "start");
			const providerCallId = typeof startData?.call_control_id === "string" && startData.call_control_id ? startData.call_control_id : void 0;
			if (!topLevelStreamId || !providerCallId) return;
			return {
				kind: "start",
				streamId: topLevelStreamId,
				providerCallId
			};
		}, (event, msg) => {
			if (event !== "error") return;
			const errorData = readRecordField(msg, "payload");
			return {
				kind: "error",
				code: typeof errorData?.code === "string" || typeof errorData?.code === "number" ? String(errorData.code) : void 0,
				title: typeof errorData?.title === "string" ? errorData.title : void 0,
				detail: typeof errorData?.detail === "string" ? errorData.detail : void 0
			};
		});
	}
	/** Serialize Telnyx media. */
	serializeMedia(payloadBase64) {
		return serializeMediaFrame(payloadBase64);
	}
	/** Serialize Telnyx clear. */
	serializeClear() {
		return serializeClearFrame();
	}
	/** Serialize Telnyx mark. */
	serializeMark(name) {
		return serializeMarkFrame(name);
	}
};
//#endregion
//#region extensions/voice-call/src/webhook/realtime-handler.ts
const STREAM_TOKEN_TTL_MS = 3e4;
const DEFAULT_HOST = "localhost:8443";
const MAX_REALTIME_MESSAGE_BYTES = 256 * 1024;
const MAX_REALTIME_WS_BUFFERED_BYTES = 1024 * 1024;
const REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS = 3e4;
const REALTIME_DISCONNECT_HANGUP_GRACE_MS = 2e3;
const FORCED_CONSULT_FALLBACK_DELAY_MS = 200;
const FORCED_CONSULT_NATIVE_DEDUPE_MS = 2e3;
const FORCED_CONSULT_RESULT_MAX_CHARS = 1800;
const FORCED_CONSULT_REASON = "provider_final_transcript_without_openclaw_agent_consult";
const CONSULT_TRANSCRIPT_SETTLE_MS = 350;
const CONSULT_TRANSCRIPT_SETTLE_MAX_MS = 1e3;
const MAX_PARTIAL_USER_TRANSCRIPT_CHARS = 1200;
const RECENT_FINAL_USER_TRANSCRIPT_TTL_MS = 2e3;
const BARGE_IN_REQUIRED_LOUD_CHUNKS = 2;
const logger = createSubsystemLogger("voice-call/realtime");
function buildGreetingInstructions(baseInstructions, greeting) {
	const trimmedGreeting = greeting?.trim();
	if (!trimmedGreeting) return;
	const intro = "Start the call by greeting the caller naturally. Include this greeting in your first spoken reply:";
	return baseInstructions ? `${baseInstructions}\n\n${intro} "${trimmedGreeting}"` : `${intro} "${trimmedGreeting}"`;
}
function readConsultArgText(args, key) {
	if (!args || typeof args !== "object" || Array.isArray(args)) return;
	const value = args[key];
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readConsultQuestionText(args) {
	return readRealtimeVoiceConsultQuestion(args);
}
function normalizeTranscriptText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function findTextOverlap(base, next) {
	const max = Math.min(base.length, next.length);
	for (let size = max; size > 0; size -= 1) if (base.slice(-size) === next.slice(0, size)) return size;
	return 0;
}
function shouldInsertTranscriptSpace(base, next) {
	if (!base || !next) return false;
	const last = base.at(-1);
	if (/\s$/.test(base) || last === "(" || last === "[" || last === "{" || last === "\"" || last === "'" || /^[\s,.;:!?)]/.test(next)) return false;
	return true;
}
function appendTranscriptText(base, fragment) {
	const next = normalizeTranscriptText(fragment);
	if (!next) return base ?? "";
	const current = normalizeTranscriptText(base ?? "");
	if (!current) return next;
	const currentLower = current.toLowerCase();
	const nextLower = next.toLowerCase();
	if (currentLower === nextLower || currentLower.endsWith(nextLower)) return current;
	if (nextLower.startsWith(currentLower)) return next;
	const overlap = findTextOverlap(currentLower, nextLower);
	if (overlap >= 6 || overlap >= 3 && next.length <= 12) return `${current}${next.slice(overlap)}`.trim();
	return `${current}${shouldInsertTranscriptSpace(current, next) ? " " : ""}${next}`.trim();
}
function resolveFinalTranscriptText(params) {
	const final = normalizeTranscriptText(params.final);
	const rawPartial = params.rawPartial ?? "";
	const partial = normalizeTranscriptText(params.partial ?? rawPartial);
	if (!partial) return final;
	if (!final) return partial;
	const compact = (value) => value.toLowerCase().replaceAll(/\s/g, "");
	const compactFinal = compact(final);
	const compactRaw = compact(rawPartial);
	const compactPartial = compact(partial);
	if (compactFinal.startsWith(compactPartial) || compactFinal.endsWith(compactPartial)) return final;
	if (compactPartial.endsWith(compactFinal)) return partial;
	if (compactRaw !== compactPartial) return appendTranscriptText(partial, params.final);
	return normalizeTranscriptText(`${rawPartial}${params.final}`);
}
function limitPartialUserTranscript(text) {
	if (text.length <= MAX_PARTIAL_USER_TRANSCRIPT_CHARS) return text;
	const tail = sliceUtf16Safe(text, -1200);
	return tail.replace(/^\S+\s+/, "").trimStart() || tail.trimStart();
}
function withFallbackConsultQuestion(args, fallback) {
	const providerQuestion = readConsultQuestionText(args);
	const question = fallback?.trim();
	if (providerQuestion) {
		if (question && providerQuestion.length <= 40 && question.length >= providerQuestion.length + 8) {
			const context = readConsultArgText(args, "context");
			const fallbackContext = `Realtime provider supplied a shorter consult question: ${providerQuestion}`;
			return args && typeof args === "object" && !Array.isArray(args) ? {
				...args,
				question,
				context: context ? `${context}\n\n${fallbackContext}` : fallbackContext
			} : {
				question,
				context: fallbackContext
			};
		}
		return args;
	}
	if (!question) return args;
	return args && typeof args === "object" && !Array.isArray(args) ? {
		...args,
		question
	} : { question };
}
function buildForcedConsultSpeechPrompt(result) {
	const trimmed = result.trim();
	return [
		"Internal OpenClaw consult result is ready.",
		"Do not call tools for this internal result.",
		"Speak the following answer to the caller now, briefly and naturally:",
		trimmed.length <= FORCED_CONSULT_RESULT_MAX_CHARS ? trimmed : `${truncateUtf16Safe(trimmed, FORCED_CONSULT_RESULT_MAX_CHARS - 16).trimEnd()} [truncated]`
	].join("\n");
}
async function waitForNativeConsult(state) {
	return await Promise.race([state.promise.then((result) => ({
		kind: "completed",
		result
	})), state.cancellation.then(() => ({ kind: "cancelled" }))]);
}
function appendRecentTalkEventMetadata(call, event) {
	if (!call) return;
	const metadata = call.metadata ?? {};
	const previous = Array.isArray(metadata.recentTalkEvents) ? metadata.recentTalkEvents : [];
	metadata.lastTalkEventAt = event.timestamp;
	metadata.lastTalkEventType = event.type;
	metadata.recentTalkEvents = [...previous, {
		id: event.id,
		brain: event.brain,
		mode: event.mode,
		provider: event.provider,
		seq: event.seq,
		sessionId: event.sessionId,
		timestamp: event.timestamp,
		transport: event.transport,
		type: event.type,
		...event.turnId ? { turnId: event.turnId } : {},
		...event.final !== void 0 ? { final: event.final } : {}
	}].slice(-12);
	call.metadata = metadata;
}
var RealtimeCallHandler = class {
	constructor(config, manager, resolveCallRegistration, servePath, streamDisconnectLifecycle, coreConfig) {
		this.config = config;
		this.manager = manager;
		this.resolveCallRegistration = resolveCallRegistration;
		this.servePath = servePath;
		this.streamDisconnectLifecycle = streamDisconnectLifecycle;
		this.coreConfig = coreConfig;
		this.toolHandlers = /* @__PURE__ */ new Map();
		this.pendingStreamTokens = /* @__PURE__ */ new Map();
		this.activeSockets = /* @__PURE__ */ new Set();
		this.serverClosingSockets = /* @__PURE__ */ new WeakSet();
		this.activeBridgesByCallId = /* @__PURE__ */ new Map();
		this.activeTelephonyBindingsByCallId = /* @__PURE__ */ new Map();
		this.userTranscriptStatesByCallId = /* @__PURE__ */ new Map();
		this.forcedConsultsByCallId = /* @__PURE__ */ new Map();
		this.consultSessionsByCallId = /* @__PURE__ */ new Map();
		this.nativeConsultsInFlightByCallId = /* @__PURE__ */ new Map();
		this.terminationAttempts = /* @__PURE__ */ new Set();
		this.closePromise = null;
		this.closing = false;
		this.publicOrigin = null;
		this.publicPathPrefix = "";
	}
	setPublicUrl(url) {
		try {
			const parsed = new URL(url);
			this.publicOrigin = parsed.host;
			this.publicPathPrefix = resolveVoiceCallPublicPathPrefix(parsed.pathname, this.servePath);
		} catch {
			this.publicOrigin = null;
			this.publicPathPrefix = "";
		}
	}
	getStreamPathPattern() {
		return `${this.publicPathPrefix}${normalizeWebhookPath(this.config.streamPath ?? "/voice/stream/realtime")}`;
	}
	buildTwiMLPayload(req, params) {
		const rawDirection = params?.get("Direction");
		const previousOrigin = this.publicOrigin;
		if (!previousOrigin) this.publicOrigin = req.headers.host ?? DEFAULT_HOST;
		try {
			const { streamUrl } = this.issueStreamSession({
				providerName: "twilio",
				from: params?.get("From") ?? void 0,
				to: params?.get("To") ?? void 0,
				direction: rawDirection?.startsWith("outbound") ? "outbound" : "inbound"
			});
			return {
				statusCode: 200,
				headers: { "Content-Type": "text/xml" },
				body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}" />
  </Connect>
</Response>`
			};
		} finally {
			this.publicOrigin = previousOrigin;
		}
	}
	handleWebSocketUpgrade(request, socket, head) {
		if (this.closing) {
			socket.write("HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n");
			socket.destroy();
			return;
		}
		const token = new URL(request.url ?? "/", "wss://localhost").pathname.split("/").pop() ?? null;
		const callerMeta = token ? this.consumeStreamToken(token) : null;
		if (!callerMeta) {
			socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
			socket.destroy();
			return;
		}
		const adapter = (callerMeta.providerName ?? "twilio") === "telnyx" ? new TelnyxStreamFrameAdapter() : new TwilioStreamFrameAdapter();
		new WebSocketServer({
			noServer: true,
			maxPayload: MAX_REALTIME_MESSAGE_BYTES
		}).handleUpgrade(request, socket, head, (ws) => {
			this.activeSockets.add(ws);
			let telephonyBinding = null;
			let initialized = false;
			let activeCallSid = "unknown";
			let activeStreamSid = "unknown";
			let lastMediaTimestamp;
			let lastMediaGapWarnAt = 0;
			ws.on("message", (data) => {
				try {
					const frame = adapter.parseInbound(data.toString());
					if (frame.kind === "ignored") return;
					if (frame.kind === "start") {
						if (initialized) return;
						initialized = true;
						activeCallSid = frame.providerCallId;
						activeStreamSid = frame.streamId;
						const nextBinding = this.handleCall(frame.streamId, frame.providerCallId, ws, callerMeta, adapter);
						if (!nextBinding) return;
						telephonyBinding = nextBinding;
						this.streamDisconnectLifecycle.connect(activeCallSid, activeStreamSid);
						return;
					}
					if (!telephonyBinding) return;
					if (frame.kind === "media") {
						const audio = Buffer.from(frame.payloadBase64, "base64");
						telephonyBinding.noteMediaActivity();
						telephonyBinding.bridge.sendAudio(audio);
						if (frame.timestampMs !== void 0) {
							if (lastMediaTimestamp !== void 0) {
								const gapMs = frame.timestampMs - lastMediaTimestamp;
								const now = Date.now();
								if ((gapMs > 120 || gapMs < 0) && now - lastMediaGapWarnAt > 5e3) {
									lastMediaGapWarnAt = now;
									console.warn(`[voice-call] realtime media timestamp gap providerCallId=${activeCallSid} gapMs=${gapMs} timestamp=${frame.timestampMs}`);
								}
							}
							lastMediaTimestamp = frame.timestampMs;
							telephonyBinding.bridge.setMediaTimestamp(frame.timestampMs);
						}
						return;
					}
					if (frame.kind === "mark") {
						telephonyBinding.bridge.acknowledgeMark();
						return;
					}
					if (frame.kind === "error") {
						console.error(`[voice-call] realtime WS error frame providerCallId=${activeCallSid} code=${frame.code ?? "?"} title=${frame.title ?? ""} detail=${frame.detail ?? ""}`);
						return;
					}
					if (frame.kind === "stop") telephonyBinding.close("disconnect");
				} catch (error) {
					console.error("[voice-call] realtime WS parse failed:", error);
				}
			});
			ws.on("close", () => {
				this.activeSockets.delete(ws);
				const reason = this.serverClosingSockets.has(ws) ? "shutdown" : "disconnect";
				if (telephonyBinding) telephonyBinding.close(reason);
			});
			ws.on("error", (error) => {
				console.error("[voice-call] realtime WS error:", error);
				ws.terminate();
			});
			if (this.closing) {
				this.serverClosingSockets.add(ws);
				ws.terminate();
			}
		});
	}
	close(shutdownBarrier = Promise.resolve()) {
		if (this.closePromise) return this.closePromise;
		this.closing = true;
		this.pendingStreamTokens.clear();
		const sockets = [...this.activeSockets];
		this.closePromise = Promise.all([shutdownBarrier, ...sockets.map((ws) => new Promise((resolve) => {
			if (ws.readyState === WebSocket$1.CLOSED) {
				resolve();
				return;
			}
			this.serverClosingSockets.add(ws);
			ws.once("close", () => resolve());
			ws.terminate();
		}))]).then(async () => {
			await Promise.all(this.terminationAttempts);
			this.pendingStreamTokens.clear();
		}).finally(() => {
			this.closing = false;
			this.closePromise = null;
		});
		return this.closePromise;
	}
	registerToolHandler(name, fn) {
		this.toolHandlers.set(name, fn);
	}
	speak(callId, instructions) {
		const bridge = this.activeBridgesByCallId.get(callId);
		if (!bridge) return {
			success: false,
			error: "No active realtime bridge for call"
		};
		try {
			bridge.triggerGreeting(instructions);
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: formatErrorMessage(error)
			};
		}
	}
	issueStreamSession(request = {}) {
		const token = this.issueStreamToken({
			providerName: request.providerName ?? "twilio",
			callId: request.callId,
			from: request.from,
			to: request.to,
			direction: request.direction
		});
		return {
			token,
			streamUrl: `wss://${this.publicOrigin || DEFAULT_HOST}${this.getStreamPathPattern()}/${token}`
		};
	}
	issueStreamToken(meta = {}) {
		const token = randomUUID();
		const expiry = resolveExpiresAtMsFromDurationMs(STREAM_TOKEN_TTL_MS, { nowMs: Date.now() });
		if (expiry !== void 0) {
			this.pendingStreamTokens.set(token, {
				expiry,
				...meta
			});
			const host = this.publicOrigin || DEFAULT_HOST;
			const streamPathPattern = this.getStreamPathPattern();
			setTimeout(() => {
				if (!this.pendingStreamTokens.has(token)) return;
				this.pendingStreamTokens.delete(token);
				if (this.closing) return;
				const call = meta.callId ? ` for call ${meta.callId}` : "";
				const endpoints = [meta.from ? `from ${meta.from}` : "", meta.to ? `to ${meta.to}` : ""].filter(Boolean).join(" ");
				const participants = endpoints ? ` (${endpoints})` : "";
				console.warn(`[voice-call] Realtime stream WebSocket never connected within ${STREAM_TOKEN_TTL_MS / 1e3}s${call}${participants} — the provider could not reach wss://${host}${streamPathPattern}/<token>. Verify the stream path is exposed (tailscale serve/funnel --set-path).`);
			}, STREAM_TOKEN_TTL_MS).unref?.();
		}
		return token;
	}
	consumeStreamToken(token) {
		const entry = this.pendingStreamTokens.get(token);
		if (!entry) return null;
		this.pendingStreamTokens.delete(token);
		if (!isFutureDateTimestampMs(entry.expiry)) return null;
		return {
			from: entry.from,
			to: entry.to,
			direction: entry.direction,
			providerName: entry.providerName,
			callId: entry.callId
		};
	}
	handleCall(streamSid, callSid, ws, callerMeta, adapter) {
		const preparedCall = this.prepareCallInManager(callSid, callerMeta);
		if (!preparedCall) {
			ws.close(1008, "Caller rejected by policy");
			return null;
		}
		const { callRecord } = preparedCall;
		const callId = callRecord.callId;
		const hadPredecessorOnAdmission = this.activeBridgesByCallId.has(callId);
		const previousTelephonyBinding = this.activeTelephonyBindingsByCallId.get(callId);
		let callEndPromise;
		const emitCallEnd = (cause) => {
			if (callEndPromise) return callEndPromise;
			const reason = cause === "error" ? "error" : cause === "inactivity" ? "timeout" : "completed";
			const attempt = this.manager.endCall(callId, { reason }).then((result) => {
				if (!result.success) {
					console.warn(`[voice-call] Failed to end realtime call callId=${callId} providerCallId=${callSid} reason=${reason}: ${result.error ?? "unknown error"}; call remains active`);
					return;
				}
				console.log(`[voice-call] Realtime call ended callId=${callId} providerCallId=${callSid} reason=${cause}`);
			});
			callEndPromise = attempt;
			this.terminationAttempts.add(attempt);
			const release = () => this.terminationAttempts.delete(attempt);
			attempt.then(release, release);
			return attempt;
		};
		let registration;
		try {
			registration = this.resolveCallRegistration(callRecord);
		} catch (error) {
			console.error(`[voice-call] Failed to resolve realtime call registration callId=${callId} providerCallId=${callSid}: ${formatErrorMessage(error)}`);
			if (!hadPredecessorOnAdmission) emitCallEnd("error");
			ws.close(1011, "Check realtime configuration for routed agent");
			return null;
		}
		const { baseFields, initialGreeting } = preparedCall;
		if (callRecord.metadata) delete callRecord.metadata.initialMessage;
		this.manager.processEvent({
			id: `realtime-answered-${callSid}`,
			callId,
			type: "call.answered",
			...baseFields
		});
		const { agentId, instructions, provider: realtimeProvider, providerConfig } = registration;
		const initialGreetingInstructions = buildGreetingInstructions(instructions, initialGreeting);
		const harness = createRealtimeVoiceSessionHarness({
			talk: {
				sessionId: `voice-call:${callId}:realtime`,
				mode: "realtime",
				transport: "gateway-relay",
				brain: "agent-consult",
				provider: realtimeProvider.id
			},
			talkPayloads: {
				turnStarted: () => ({
					callId,
					providerCallId: callSid
				}),
				turnEnded: (reason) => ({
					callId,
					providerCallId: callSid,
					reason
				}),
				inputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
				outputAudioStarted: () => ({
					callId,
					providerCallId: callSid
				}),
				outputAudioDelta: (audio) => ({ byteLength: audio.byteLength }),
				outputAudioDone: (reason) => ({
					callId,
					providerCallId: callSid,
					reason
				})
			},
			onTalkEvent: (event) => appendRecentTalkEventMetadata(callRecord, event)
		});
		let providerHandlesInputAudioBargeIn = realtimeProvider.capabilities?.handlesInputAudioBargeIn === true;
		const cancelOutputAudioForBargeIn = (source, interruptProvider, clearedAudioBytes = 0) => {
			const outputAudioActive = harness.talk.outputAudioActive;
			const pendingTelephonyAudio = audioPacer.hasPendingAudio();
			if (source === "provider" && !outputAudioActive && !pendingTelephonyAudio && clearedAudioBytes === 0) return;
			const interruptedTurnId = harness.talk.activeTurnId;
			interruptProvider?.(outputAudioActive || pendingTelephonyAudio);
			const clearedBytes = clearedAudioBytes + (source === "local" || pendingTelephonyAudio ? audioPacer.clearAudio() : 0);
			console.log(`[voice-call] realtime outbound audio cleared by ${source} barge-in callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
			if (!outputAudioActive || !interruptedTurnId) return;
			const reason = `${source}-barge-in`;
			harness.finishOutputAudio(reason);
			harness.talk.cancelTurn({
				turnId: interruptedTurnId,
				payload: {
					callId,
					providerCallId: callSid,
					reason
				}
			});
		};
		harness.emit({
			type: "session.started",
			payload: {
				callId,
				providerCallId: callSid,
				streamSid
			}
		});
		console.log(`[voice-call] Realtime bridge starting for call ${callId} (providerCallId=${callSid}, initialGreeting=${initialGreetingInstructions ? "queued" : "absent"})`);
		const sendString = (message) => {
			if (ws.readyState !== WebSocket$1.OPEN) return false;
			if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
				console.warn(`[voice-call] realtime outbound websocket backpressure before send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`);
				ws.close(1013, "Backpressure: send buffer exceeded");
				return false;
			}
			ws.send(message);
			if (ws.bufferedAmount > MAX_REALTIME_WS_BUFFERED_BYTES) {
				console.warn(`[voice-call] realtime outbound websocket backpressure after send callId=${callId} providerCallId=${callSid} bufferedBytes=${ws.bufferedAmount}`);
				ws.close(1013, "Backpressure: send buffer exceeded");
				return false;
			}
			return true;
		};
		const audioPacer = new RealtimeAudioPacer({
			send: sendString,
			serializer: {
				media: (payload) => adapter.serializeMedia(payload),
				clear: () => adapter.serializeClear(),
				mark: (name) => adapter.serializeMark(name)
			},
			onBackpressure: () => {
				console.warn(`[voice-call] realtime paced audio backpressure callId=${callId} providerCallId=${callSid}`);
				if (ws.readyState === WebSocket$1.OPEN) ws.close(1013, "Backpressure: paced audio queue exceeded");
			}
		});
		const speechDetector = createSpeechThresholdGate({
			rmsThreshold: .035,
			speechFrames: BARGE_IN_REQUIRED_LOUD_CHUNKS,
			silenceFrames: 12
		});
		const interruptResponseOnInputAudio = typeof providerConfig.interruptResponseOnInputAudio === "boolean" ? providerConfig.interruptResponseOnInputAudio : void 0;
		const nativeConsultOwner = {};
		const userTranscriptAdoption = this.beginUserTranscriptOwnerAdoption(callId);
		const userTranscriptOwner = userTranscriptAdoption.owner;
		const bridgeParams = {
			provider: realtimeProvider,
			cfg: this.coreConfig,
			agentId,
			providerConfig,
			interruptResponseOnInputAudio,
			instructions,
			tools: this.config.tools,
			initialGreetingInstructions,
			triggerGreetingOnReady: Boolean(initialGreetingInstructions),
			audioSink: {
				isOpen: () => ws.readyState === WebSocket$1.OPEN,
				sendAudio: (muLaw) => {
					harness.recordOutputAudio(muLaw);
					audioPacer.sendAudio(muLaw);
				},
				clearAudio: (reason) => {
					harness.flushOutput(() => {
						const clearedBytes = audioPacer.clearAudio();
						if (reason === "barge-in") {
							cancelOutputAudioForBargeIn("provider", void 0, clearedBytes);
							return;
						}
						console.log(`[voice-call] realtime outbound audio clear requested callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
						harness.finishOutputAudio("clear");
					});
				},
				sendMark: (markName) => {
					audioPacer.sendMark(markName);
				}
			},
			onTranscript: (role, text, isFinal) => {
				const owner = nativeConsultOwner.current;
				if (!this.getUserTranscriptState(callId, userTranscriptOwner) || owner && !this.isActiveBridgeOwner(callId, owner)) return;
				const turnId = harness.ensureTurn();
				const eventType = role === "assistant" ? isFinal ? "output.text.done" : "output.text.delta" : isFinal ? "transcript.done" : "transcript.delta";
				const payload = role === "assistant" ? { text } : {
					role,
					text
				};
				harness.emit({
					type: eventType,
					turnId,
					payload,
					final: isFinal
				});
				if (role === "user" && isFinal) harness.emit({
					type: "input.audio.committed",
					turnId,
					payload: {
						callId,
						providerCallId: callSid
					},
					final: true
				});
				if (!isFinal) {
					if (role === "user" && text.trim()) {
						const transcript = this.recordPartialUserTranscript(callId, userTranscriptOwner, text);
						if (!transcript) return;
						console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=false chars=${text.trim().length} aggregateChars=${transcript.length}`);
					}
					return;
				}
				if (role === "user") {
					const state = this.getUserTranscriptState(callId, userTranscriptOwner);
					if (!state) return;
					const transcript = resolveFinalTranscriptText({
						partial: state.partial,
						rawPartial: state.rawPartial,
						final: text
					});
					this.clearPartialUserTranscript(callId, userTranscriptOwner);
					this.setRecentFinalUserTranscript(callId, userTranscriptOwner, transcript);
					console.log(`[voice-call] realtime input transcript callId=${callId} providerCallId=${callSid} final=true chars=${text.trim().length} aggregateChars=${transcript.length}`);
					const event = {
						id: `realtime-speech-${callSid}-${Date.now()}`,
						type: "call.speech",
						callId,
						providerCallId: callSid,
						timestamp: Date.now(),
						transcript,
						isFinal: true
					};
					this.manager.processEvent(event);
					this.scheduleForcedAgentConsult({
						harness,
						session,
						callId,
						callSid,
						transcript,
						userTranscriptOwner,
						clearAudio: () => {
							const clearedBytes = audioPacer.clearAudio();
							console.log(`[voice-call] realtime forced consult cleared outbound audio callId=${callId} providerCallId=${callSid} queuedBytes=${clearedBytes}`);
						}
					});
					return;
				}
				this.manager.processEvent({
					id: `realtime-bot-${callSid}-${Date.now()}`,
					type: "call.assistant-speech",
					callId,
					providerCallId: callSid,
					timestamp: Date.now(),
					transcript: text
				});
			},
			onToolCall: (toolEvent, sessionLocal) => {
				const turnId = harness.ensureTurn();
				harness.emit({
					type: "tool.call",
					turnId,
					itemId: toolEvent.itemId,
					callId: toolEvent.callId,
					payload: {
						name: toolEvent.name,
						args: toolEvent.args
					}
				});
				console.log(`[voice-call] realtime tool call received callId=${callId} providerCallId=${callSid} tool=${toolEvent.name}`);
				return this.executeToolCall(sessionLocal, callId, toolEvent.callId || toolEvent.itemId, toolEvent.name, toolEvent.args, turnId, harness, userTranscriptOwner);
			},
			onEvent: (event) => {
				if (event.direction === "client" && event.type === "session.continuity.reset") {
					const turnId = harness.talk.activeTurnId;
					const owner = nativeConsultOwner.current;
					if (owner && this.isActiveBridgeOwner(callId, owner)) {
						this.resetUserTranscriptState(callId, userTranscriptOwner);
						this.resetConsultSessionForContinuity(callId, owner);
					}
					harness.flushOutput(() => {
						audioPacer.clearAudio();
						harness.finishOutputAudio(event.type);
					});
					if (turnId) harness.talk.cancelTurn({
						turnId,
						payload: {
							callId,
							providerCallId: callSid,
							reason: event.type
						}
					});
					return;
				}
				if (event.type === "input_audio_buffer.speech_started") {
					harness.ensureTurn();
					return;
				}
				if (event.type === "input_audio_buffer.speech_stopped") {
					const turnId = harness.talk.activeTurnId;
					if (!turnId) return;
					harness.emit({
						type: "input.audio.committed",
						turnId,
						payload: {
							callId,
							providerCallId: callSid,
							source: event.type
						},
						final: true
					});
					return;
				}
				if (event.type === "error") harness.emit({
					type: "session.error",
					payload: { message: event.detail ?? "Realtime provider error" },
					final: true
				});
			},
			onResponseDone: (outcome) => {
				if (outcome.status === "failed" || outcome.status === "incomplete") console.warn(`[voice-call] realtime response ${outcome.status}: ${outcome.message}`);
			},
			onReady: () => {
				harness.emit({
					type: "session.ready",
					payload: {
						callId,
						providerCallId: callSid
					}
				});
			},
			onError: (error) => {
				console.error("[voice-call] realtime voice error:", error.message);
				harness.emit({
					type: "session.error",
					payload: { message: error.message },
					final: true
				});
			},
			onClose: (reason) => {
				const owner = nativeConsultOwner.current;
				const ownsCallState = owner ? this.isActiveBridgeOwner(callId, owner) : false;
				if (owner) {
					this.clearActiveBridgeMappings(callId, callSid, owner);
					this.cancelConsultSession(callId, owner);
				}
				if (ownsCallState) this.clearUserTranscriptState(callId, userTranscriptOwner);
				harness.finishOutputAudio(reason);
				harness.emit({
					type: "session.closed",
					payload: { reason },
					final: true
				});
				if (reason !== "error") return;
				this.streamDisconnectLifecycle.retire(callSid, streamSid);
				if (ws.readyState === WebSocket$1.OPEN) ws.close(1011, "Bridge disconnected");
				if (owner && !ownsCallState || !owner && hadPredecessorOnAdmission && this.activeBridgesByCallId.has(callId)) return;
				emitCallEnd("error");
			}
		};
		let session;
		try {
			session = harness.createBridge(bridgeParams);
		} catch (error) {
			this.rollbackUserTranscriptOwnerAdoption(callId, userTranscriptAdoption);
			harness.close();
			audioPacer.close();
			if (!hadPredecessorOnAdmission || !this.activeBridgesByCallId.has(callId)) emitCallEnd("error");
			if (ws.readyState === WebSocket$1.OPEN) ws.close(1011, "Failed to create realtime bridge");
			console.error("[voice-call] Failed to create realtime bridge:", error);
			return null;
		}
		this.commitUserTranscriptOwnerAdoption(callId, userTranscriptAdoption);
		nativeConsultOwner.current = session;
		providerHandlesInputAudioBargeIn = session.bridge.handlesInputAudioBargeIn ?? providerHandlesInputAudioBargeIn;
		const previousConsultSession = this.consultSessionsByCallId.get(callId);
		if (previousConsultSession && previousConsultSession.owner !== session) this.cancelConsultSession(callId, previousConsultSession.owner);
		this.consultSessionsByCallId.set(callId, {
			owner: session,
			coordinator: harness.forcedConsults
		});
		const sendAudioToSession = session.sendAudio.bind(session);
		session.sendAudio = (audio) => {
			if (speechDetector.accept({
				rms: calculateMulawRms(audio),
				peak: 0
			})) {
				console.log(`[voice-call] realtime local speech detected callId=${callId} providerCallId=${callSid}`);
				if (!providerHandlesInputAudioBargeIn) cancelOutputAudioForBargeIn("local", (audioPlaybackActive) => {
					session.handleBargeIn({ audioPlaybackActive });
				});
			}
			harness.recordInputAudio(audio);
			sendAudioToSession(audio);
		};
		const closeSession = session.close.bind(session);
		let sessionClosed = false;
		session.close = () => {
			if (sessionClosed) return;
			sessionClosed = true;
			try {
				closeSession();
			} finally {
				this.clearActiveBridgeMappings(callId, callSid, session);
				this.cancelConsultSession(callId, session);
				this.clearUserTranscriptState(callId, userTranscriptOwner);
				harness.close();
				audioPacer.close();
			}
		};
		let livenessTimer;
		const clearLivenessTimer = () => {
			if (livenessTimer) {
				clearTimeout(livenessTimer);
				livenessTimer = void 0;
			}
		};
		let bindingClosed = false;
		const closeBinding = (binding, cause) => {
			if (bindingClosed) return callEndPromise ?? Promise.resolve();
			bindingClosed = true;
			clearLivenessTimer();
			const ownsCall = this.activeTelephonyBindingsByCallId.get(callId) === binding;
			let termination = Promise.resolve();
			try {
				session.close();
			} catch (error) {
				console.warn(`[voice-call] Failed to close realtime bridge ${callSid}: ${formatErrorMessage(error)}`);
			} finally {
				this.clearActiveTelephonyBinding(callId, binding);
				if (cause === "disconnect") this.streamDisconnectLifecycle.disconnect(callSid, streamSid);
				else this.streamDisconnectLifecycle.retire(callSid, streamSid);
				if (ownsCall && cause && cause !== "disconnect") termination = emitCallEnd(cause);
			}
			return termination;
		};
		const telephonyBinding = {
			bridge: session,
			close: (cause) => closeBinding(telephonyBinding, cause),
			endCall: () => {
				closeBinding(telephonyBinding);
				if (ws.readyState === WebSocket$1.OPEN) ws.close(1e3, "Call ended");
			},
			noteMediaActivity: () => {
				if (bindingClosed || this.activeTelephonyBindingsByCallId.get(callId) !== telephonyBinding) return;
				clearLivenessTimer();
				livenessTimer = setTimeout(() => {
					console.warn(`[voice-call] Realtime media inactive callId=${callId} providerCallId=${callSid} timeoutMs=${REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS} graceMs=${REALTIME_DISCONNECT_HANGUP_GRACE_MS}`);
					livenessTimer = setTimeout(() => {
						telephonyBinding.close("inactivity");
						if (ws.readyState === WebSocket$1.OPEN) ws.close(1e3, "Media inactivity");
					}, REALTIME_DISCONNECT_HANGUP_GRACE_MS);
					livenessTimer.unref?.();
				}, REALTIME_MEDIA_INACTIVITY_TIMEOUT_MS);
				livenessTimer.unref?.();
			},
			retire: () => {
				closeBinding(telephonyBinding);
			}
		};
		this.activeBridgesByCallId.set(callId, session);
		this.activeBridgesByCallId.set(callSid, session);
		this.activeTelephonyBindingsByCallId.set(callId, telephonyBinding);
		telephonyBinding.noteMediaActivity();
		if (previousTelephonyBinding && previousTelephonyBinding !== telephonyBinding) previousTelephonyBinding.retire();
		session.connect().catch((error) => {
			console.error("[voice-call] Failed to connect realtime bridge:", error);
			const ownsCallState = this.isActiveBridgeOwner(callId, session);
			this.streamDisconnectLifecycle.retire(callSid, streamSid);
			try {
				session.close();
			} catch (closeError) {
				console.warn(`[voice-call] Failed to close realtime bridge ${callSid}: ${formatErrorMessage(closeError)}`);
			} finally {
				if (ownsCallState) emitCallEnd("error");
				ws.close(1011, "Failed to connect");
			}
		});
		return telephonyBinding;
	}
	beginUserTranscriptOwnerAdoption(callId) {
		const adoption = {
			owner: {},
			previous: this.userTranscriptStatesByCallId.get(callId)
		};
		this.userTranscriptStatesByCallId.set(callId, adoption.owner);
		return adoption;
	}
	commitUserTranscriptOwnerAdoption(callId, adoption) {
		if (this.userTranscriptStatesByCallId.get(callId) !== adoption.owner) return;
		if (adoption.previous?.recentFinalTimer) {
			clearTimeout(adoption.previous.recentFinalTimer);
			adoption.previous.recentFinalTimer = void 0;
		}
	}
	rollbackUserTranscriptOwnerAdoption(callId, adoption) {
		if (this.userTranscriptStatesByCallId.get(callId) !== adoption.owner) return;
		if (adoption.owner.recentFinalTimer) {
			clearTimeout(adoption.owner.recentFinalTimer);
			adoption.owner.recentFinalTimer = void 0;
		}
		if (adoption.previous) {
			this.userTranscriptStatesByCallId.set(callId, adoption.previous);
			return;
		}
		this.userTranscriptStatesByCallId.delete(callId);
	}
	getUserTranscriptState(callId, owner) {
		const state = this.userTranscriptStatesByCallId.get(callId);
		return state === owner ? state : void 0;
	}
	recordPartialUserTranscript(callId, owner, text) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		const next = limitPartialUserTranscript(appendTranscriptText(state.partial, text));
		const raw = limitPartialUserTranscript(`${state.rawPartial ?? ""}${text}`);
		state.partial = next;
		state.rawPartial = raw;
		state.partialUpdatedAt = Date.now();
		return next;
	}
	clearPartialUserTranscript(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		state.partial = void 0;
		state.rawPartial = void 0;
		state.partialUpdatedAt = void 0;
	}
	setRecentFinalUserTranscript(callId, owner, text) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		this.clearRecentFinalUserTranscript(callId, owner);
		state.recentFinal = text;
		const timer = setTimeout(() => {
			if (this.userTranscriptStatesByCallId.get(callId) !== state) return;
			if (state.recentFinal === text) state.recentFinal = void 0;
			if (state.recentFinalTimer === timer) state.recentFinalTimer = void 0;
		}, RECENT_FINAL_USER_TRANSCRIPT_TTL_MS);
		timer.unref?.();
		state.recentFinalTimer = timer;
	}
	clearRecentFinalUserTranscript(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		if (state.recentFinalTimer) {
			clearTimeout(state.recentFinalTimer);
			state.recentFinalTimer = void 0;
		}
		state.recentFinal = void 0;
	}
	resetUserTranscriptState(callId, owner) {
		this.clearPartialUserTranscript(callId, owner);
		this.clearRecentFinalUserTranscript(callId, owner);
	}
	clearUserTranscriptState(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		if (!state) return;
		if (state.recentFinalTimer) clearTimeout(state.recentFinalTimer);
		if (this.userTranscriptStatesByCallId.get(callId) === state) this.userTranscriptStatesByCallId.delete(callId);
	}
	cancelNativeConsult(callId, owner) {
		const state = this.nativeConsultsInFlightByCallId.get(callId);
		if (!state || state.owner !== owner) return;
		state.cancelled = true;
		this.nativeConsultsInFlightByCallId.delete(callId);
		state.cancel();
	}
	cancelForcedConsult(callId, owner) {
		const state = this.forcedConsultsByCallId.get(callId);
		if (!state || state.owner !== owner) return;
		state.cancelled = true;
		state.sendSpeechPrompt = false;
		state.cancel();
		this.forcedConsultsByCallId.delete(callId);
	}
	resetConsultSession(callId, owner) {
		const session = this.consultSessionsByCallId.get(callId);
		if (!session || session.owner !== owner) return false;
		session.coordinator.clearPending();
		this.cancelForcedConsult(callId, owner);
		this.cancelNativeConsult(callId, owner);
		return true;
	}
	resetConsultSessionForContinuity(callId, owner) {
		const session = this.consultSessionsByCallId.get(callId);
		if (!session || session.owner !== owner) return false;
		this.cancelForcedConsult(callId, owner);
		this.cancelNativeConsult(callId, owner);
		session.coordinator.clear();
		return true;
	}
	cancelConsultSession(callId, owner) {
		if (!owner || !this.resetConsultSession(callId, owner)) return;
		this.consultSessionsByCallId.delete(callId);
	}
	isActiveBridgeOwner(callId, owner) {
		return this.activeBridgesByCallId.get(callId) === owner;
	}
	clearActiveBridgeMappings(callId, callSid, owner) {
		for (const key of [callId, callSid]) {
			if (this.activeBridgesByCallId.get(key) !== owner) continue;
			this.activeBridgesByCallId.delete(key);
		}
	}
	clearActiveTelephonyBinding(callId, binding) {
		if (this.activeTelephonyBindingsByCallId.get(callId) === binding) this.activeTelephonyBindingsByCallId.delete(callId);
	}
	resolveUserTranscriptContext(callId, owner) {
		const state = this.getUserTranscriptState(callId, owner);
		return state?.partial ?? state?.recentFinal;
	}
	consumePartialUserTranscript(callId, owner, consumed) {
		const text = consumed?.trim();
		if (!text) return;
		const state = this.getUserTranscriptState(callId, owner);
		const current = state?.partial;
		if (!current) return;
		if (current === text) {
			this.clearPartialUserTranscript(callId, owner);
			return;
		}
		if (current.toLowerCase().startsWith(text.toLowerCase())) {
			const remaining = current.slice(text.length).trimStart();
			if (remaining) {
				state.partial = remaining;
				state.rawPartial = remaining;
			} else this.clearPartialUserTranscript(callId, owner);
		}
		const recent = state.recentFinal;
		if (!recent) return;
		if (recent === text || recent.toLowerCase().startsWith(text.toLowerCase())) this.clearRecentFinalUserTranscript(callId, owner);
	}
	async waitForConsultTranscriptSettle(callId, owner, startedAt) {
		const deadline = startedAt + CONSULT_TRANSCRIPT_SETTLE_MAX_MS;
		while (true) {
			const updatedAt = this.getUserTranscriptState(callId, owner)?.partialUpdatedAt;
			if (!updatedAt) return;
			const now = Date.now();
			const quietFor = now - updatedAt;
			if (quietFor >= CONSULT_TRANSCRIPT_SETTLE_MS || now >= deadline) return;
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(CONSULT_TRANSCRIPT_SETTLE_MS - quietFor, deadline - now));
			});
		}
	}
	scheduleForcedAgentConsult(params) {
		if (this.config.consultPolicy !== "always" || this.activeBridgesByCallId.get(params.callId) !== params.session) return;
		const question = params.transcript.trim();
		if (!question) return;
		const handler = this.toolHandlers.get(REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME);
		if (!handler) return;
		const existingForcedConsult = this.forcedConsultsByCallId.get(params.callId);
		if (existingForcedConsult && !existingForcedConsult.completedAt) return;
		const coordinator = params.harness.forcedConsults;
		if (coordinator.hasRecentNativeConsult(question, { allowUnknownQuestion: true })) return;
		coordinator.clearPending();
		const pending = coordinator.prepare(question);
		if (!pending) return;
		coordinator.schedule(pending, FORCED_CONSULT_FALLBACK_DELAY_MS, (handle) => {
			const activeForcedConsult = this.forcedConsultsByCallId.get(params.callId);
			if (activeForcedConsult && !activeForcedConsult.completedAt) return;
			this.runForcedAgentConsult({
				...params,
				handle,
				handler
			});
		});
	}
	async runForcedAgentConsult(params) {
		const coordinator = params.harness.forcedConsults;
		coordinator.markStarted(params.handle);
		const startedAt = Date.now();
		logger.debug(`[voice-call] realtime forced agent consult reason=${FORCED_CONSULT_REASON} consultPolicy=always callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`);
		console.log(`[voice-call] realtime forced agent consult starting callId=${params.callId} providerCallId=${params.callSid} chars=${params.handle.question.length}`);
		params.clearAudio();
		const abortController = new AbortController();
		const state = {
			owner: params.session,
			sendSpeechPrompt: true,
			cancelled: false,
			cancel: () => {
				abortController.abort(/* @__PURE__ */ new Error("Realtime forced consult owner was cancelled."));
				coordinator.markCancelled(params.handle);
			},
			promise: Promise.resolve().then(() => {
				abortController.signal.throwIfAborted();
				return params.handler({ question: params.handle.question }, params.callId, { abortSignal: abortController.signal });
			})
		};
		this.forcedConsultsByCallId.set(params.callId, state);
		try {
			const result = await state.promise;
			if (state.cancelled || this.forcedConsultsByCallId.get(params.callId) !== state) return;
			state.completedAt = Date.now();
			coordinator.markDelivered(params.handle);
			const text = readSpeakableRealtimeVoiceToolResult(result, {
				keys: ["text", "output"],
				maxChars: FORCED_CONSULT_RESULT_MAX_CHARS
			});
			if (!text) {
				console.warn(`[voice-call] realtime forced agent consult returned no speakable text callId=${params.callId} providerCallId=${params.callSid}`);
				return;
			}
			if (state.sendSpeechPrompt) {
				params.clearAudio();
				params.session.sendUserMessage(buildForcedConsultSpeechPrompt(text));
			}
			console.log(`[voice-call] realtime forced agent consult completed callId=${params.callId} providerCallId=${params.callSid} elapsedMs=${Date.now() - startedAt}`);
			this.consumePartialUserTranscript(params.callId, params.userTranscriptOwner, params.handle.question);
		} catch (error) {
			if (!state.cancelled) console.warn(`[voice-call] realtime forced agent consult failed callId=${params.callId} providerCallId=${params.callSid} error=${formatErrorMessage(error)}`);
		} finally {
			if (!state.cancelled) if (this.forcedConsultsByCallId.get(params.callId) !== state) coordinator.remove(params.handle);
			else setTimeout(() => {
				if (this.forcedConsultsByCallId.get(params.callId) === state) {
					this.forcedConsultsByCallId.delete(params.callId);
					coordinator.remove(params.handle);
				}
			}, FORCED_CONSULT_NATIVE_DEDUPE_MS).unref?.();
		}
	}
	prepareCallInManager(callSid, callerMeta = {}) {
		const baseFields = {
			providerCallId: callSid,
			timestamp: Date.now(),
			direction: callerMeta.direction ?? "inbound",
			...callerMeta.from ? { from: callerMeta.from } : {},
			...callerMeta.to ? { to: callerMeta.to } : {}
		};
		const callRecord = this.resolveRealtimeCall(callSid, callerMeta, baseFields);
		if (!callRecord) return null;
		const initialGreeting = this.extractInitialGreeting(callRecord);
		console.log(`[voice-call] Realtime call ${callRecord.callId} initial greeting ${initialGreeting ? "queued" : "absent"}`);
		return {
			callRecord,
			baseFields,
			initialGreeting
		};
	}
	resolveRealtimeCall(callSid, callerMeta, baseFields) {
		if (callerMeta.callId) {
			const call = this.manager.getCall(callerMeta.callId);
			return call?.providerCallId === callSid ? call : null;
		}
		this.manager.processEvent({
			id: `realtime-initiated-${callSid}`,
			callId: callSid,
			type: "call.initiated",
			...baseFields
		});
		return this.manager.getCallByProviderCallId(callSid) ?? null;
	}
	extractInitialGreeting(call) {
		return typeof call.metadata?.initialMessage === "string" ? call.metadata.initialMessage : void 0;
	}
	async executeEndCallTool(params) {
		const binding = this.activeTelephonyBindingsByCallId.get(params.callId);
		if (!binding || binding.bridge !== params.bridge || !this.isActiveBridgeOwner(params.callId, params.bridge)) return;
		let result;
		try {
			result = await this.manager.endCall(params.callId);
		} catch (error) {
			result = {
				success: false,
				error: formatErrorMessage(error)
			};
		}
		if (this.activeTelephonyBindingsByCallId.get(params.callId) !== binding || !this.isActiveBridgeOwner(params.callId, params.bridge)) return;
		if (!result.success) {
			const toolResult = { error: `Could not end the current phone call: ${result.error?.trim() || "the telephony provider returned no reason"}. Tell the caller the call could not be ended and they can hang up or ask you to try again.` };
			await params.bridge.submitToolResult(params.bridgeCallId, toolResult);
			params.harness.emit({
				type: "tool.error",
				turnId: params.turnId,
				callId: params.bridgeCallId,
				payload: {
					name: REALTIME_VOICE_END_CALL_TOOL_NAME,
					result: toolResult
				},
				final: true
			});
			return;
		}
		params.harness.emit({
			type: "tool.result",
			turnId: params.turnId,
			callId: params.bridgeCallId,
			payload: {
				name: REALTIME_VOICE_END_CALL_TOOL_NAME,
				result: { success: true }
			},
			final: true
		});
		binding.endCall();
	}
	async executeToolCall(bridge, callId, bridgeCallId, name, args, turnId, harness, userTranscriptOwner) {
		if (name === "openclaw_end_call") {
			await this.executeEndCallTool({
				bridge,
				callId,
				bridgeCallId,
				turnId,
				harness
			});
			return;
		}
		const handler = this.toolHandlers.get(name);
		const startedAt = Date.now();
		const hasResultError = (result) => {
			return Boolean(result && typeof result === "object" && !Array.isArray(result) && "error" in result);
		};
		const emitFinalToolEvent = (result) => {
			harness.emit({
				type: hasResultError(result) ? "tool.error" : "tool.result",
				turnId,
				callId: bridgeCallId,
				payload: {
					name,
					result
				},
				final: true
			});
		};
		const submitFinalToolResult = async (result) => {
			await bridge.submitToolResult(bridgeCallId, result);
			emitFinalToolEvent(result);
		};
		const submitWorkingResponse = async () => {
			if (handler && name === "openclaw_agent_consult" && bridge.bridge.supportsToolResultContinuation && !this.config.fastContext.enabled) {
				await bridge.submitToolResult(bridgeCallId, buildRealtimeVoiceAgentConsultWorkingResponse("caller"), { willContinue: true });
				harness.emit({
					type: "tool.progress",
					turnId,
					callId: bridgeCallId,
					payload: {
						name,
						status: "working"
					}
				});
			}
		};
		if (name === "openclaw_agent_consult") {
			if (this.activeBridgesByCallId.get(callId) !== bridge) return;
			const coordinator = harness.forcedConsults;
			const forcedMatch = coordinator.recordNativeConsult(args, bridgeCallId);
			if (forcedMatch.kind === "none") {
				const pending = coordinator.consumePending();
				if (pending) coordinator.remove(pending);
			}
			const forcedConsultState = this.forcedConsultsByCallId.get(callId);
			const forcedConsult = forcedConsultState?.owner === bridge && !forcedConsultState.cancelled ? forcedConsultState : void 0;
			if (forcedMatch.kind === "already_delivered" && coordinator.isCancelled(forcedMatch.handle)) {
				if (forcedConsult) forcedConsult.sendSpeechPrompt = false;
				await submitFinalToolResult({
					status: "cancelled",
					message: "OpenClaw cancelled this consult before completion. Do not restart it."
				});
				return;
			}
			if (forcedConsult) {
				if (forcedConsult.completedAt || forcedMatch.kind === "already_delivered") {
					await submitFinalToolResult({
						status: "already_delivered",
						message: "OpenClaw already delivered this consult result internally. Do not repeat it."
					});
					return;
				}
				forcedConsult.sendSpeechPrompt = false;
				const result = await forcedConsult.promise.catch((error) => ({ error: formatErrorMessage(error) }));
				if (forcedConsult.cancelled || forcedConsult.owner !== bridge || this.forcedConsultsByCallId.get(callId) !== forcedConsult) return;
				await submitFinalToolResult(result);
				return;
			}
			const existingNativeConsult = this.nativeConsultsInFlightByCallId.get(callId);
			if (existingNativeConsult) {
				console.log(`[voice-call] realtime tool call sharing in-flight agent consult callId=${callId} ageMs=${Date.now() - existingNativeConsult.startedAt}`);
				await submitWorkingResponse();
				const outcome = await waitForNativeConsult(existingNativeConsult);
				if (outcome.kind === "cancelled") return;
				await submitFinalToolResult(outcome.result);
				return;
			}
			const abortController = new AbortController();
			let releaseCancellation = () => {};
			const cancellation = new Promise((resolve) => {
				releaseCancellation = resolve;
			});
			let completeConsult = (_result) => {};
			const state = {
				owner: bridge,
				startedAt,
				promise: new Promise((resolve) => {
					completeConsult = resolve;
				}),
				cancellation,
				cancelled: false,
				cancel: () => {
					abortController.abort(/* @__PURE__ */ new Error("Realtime native consult owner was cancelled."));
					releaseCancellation();
				}
			};
			this.nativeConsultsInFlightByCallId.set(callId, state);
			(async () => {
				try {
					await submitWorkingResponse();
					if (state.cancelled) return;
					await Promise.race([this.waitForConsultTranscriptSettle(callId, userTranscriptOwner, startedAt), state.cancellation]);
					if (state.cancelled) return;
					const context = {
						partialUserTranscript: this.resolveUserTranscriptContext(callId, userTranscriptOwner),
						abortSignal: abortController.signal
					};
					state.partialUserTranscript = context.partialUserTranscript;
					const handlerArgs = withFallbackConsultQuestion(args, context.partialUserTranscript);
					console.log(`[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`);
					return !handler ? { error: `Tool "${name}" not available` } : await handler(handlerArgs, callId, context);
				} catch (error) {
					return { error: formatErrorMessage(error) };
				}
			})().then(completeConsult);
			try {
				const outcome = await waitForNativeConsult(state);
				if (outcome.kind === "cancelled") return;
				const result = outcome.result;
				const status = result && typeof result === "object" && !Array.isArray(result) && "error" in result ? "error" : "ok";
				const error = status === "error" && result && typeof result === "object" && !Array.isArray(result) ? formatErrorMessage(result.error ?? "unknown") : void 0;
				console.log(`[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${status} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`);
				await submitFinalToolResult(result);
				if (status === "ok") this.consumePartialUserTranscript(callId, userTranscriptOwner, state.partialUserTranscript);
			} finally {
				if (this.nativeConsultsInFlightByCallId.get(callId) === state) this.nativeConsultsInFlightByCallId.delete(callId);
			}
			return;
		}
		console.log(`[voice-call] realtime tool call executing callId=${callId} tool=${name} hasHandler=${Boolean(handler)}`);
		const context = { partialUserTranscript: this.resolveUserTranscriptContext(callId, userTranscriptOwner) };
		const handlerArgs = name === "openclaw_agent_consult" ? withFallbackConsultQuestion(args, context.partialUserTranscript) : args;
		const result = !handler ? { error: `Tool "${name}" not available` } : await handler(handlerArgs, callId, context).catch((error) => ({ error: formatErrorMessage(error) }));
		const status = result && typeof result === "object" && !Array.isArray(result) && "error" in result ? "error" : "ok";
		const error = status === "error" && result && typeof result === "object" && !Array.isArray(result) ? formatErrorMessage(result.error ?? "unknown") : void 0;
		console.log(`[voice-call] realtime tool call completed callId=${callId} tool=${name} status=${status} elapsedMs=${Date.now() - startedAt}${error ? ` error=${error}` : ""}`);
		await submitFinalToolResult(result);
		if (name === "openclaw_agent_consult" && status === "ok") this.consumePartialUserTranscript(callId, userTranscriptOwner, context.partialUserTranscript);
	}
};
//#endregion
export { RealtimeCallHandler };
