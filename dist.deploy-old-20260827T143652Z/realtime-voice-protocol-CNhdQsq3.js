import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { Q as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ } from "./realtime-session-harness-BWrgDib2.js";
import "./realtime-voice-oUx-QwLx.js";
import { b as serializeXaiRealtimeToolResult, c as XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, l as XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS } from "./realtime-voice-config-Ceq4xLuI.js";
import { randomUUID } from "node:crypto";
//#region extensions/xai/realtime-voice-protocol.ts
var XaiRealtimePlaybackMarkOverflowError = class extends Error {};
var XaiRealtimeVoiceProtocol = class {
	constructor(config) {
		this.config = config;
		this.markQueue = [];
		this.responseStartTimestamp = null;
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.continuingToolCallIds = /* @__PURE__ */ new Set();
		this.pendingToolCallIds = /* @__PURE__ */ new Set();
		this.latestMediaTimestamp = 0;
		this.lastAssistantItemId = null;
		this.toolCallBuffers = /* @__PURE__ */ new Map();
		this.deliveredToolCallKeys = /* @__PURE__ */ new Set();
		this.pendingToolResultAcks = /* @__PURE__ */ new Set();
		this.conversationId = null;
		this.audioFormat = config.audioFormat ?? REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ;
	}
	sendUserMessageNow(text) {
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "message",
				role: "user",
				content: [{
					type: "input_text",
					text
				}]
			}
		});
		this.requestResponseCreate();
	}
	submitToolResultNow(callId, result, options) {
		if (options?.willContinue === true) return;
		const output = serializeXaiRealtimeToolResult(result);
		this.sendEvent({
			type: "conversation.item.create",
			item: {
				type: "function_call_output",
				call_id: callId,
				output
			}
		});
		this.pendingToolResultAcks.add(callId);
		this.continuingToolCallIds.delete(callId);
		this.pendingToolCallIds.delete(callId);
		if (options?.suppressResponse !== true) this.flushPendingResponseCreateAfterToolResults();
	}
	acknowledgeMark(markName) {
		if (this.markQueue.length === 0) return;
		if (markName) {
			const index = this.markQueue.indexOf(markName);
			if (index < 0) return;
			this.markQueue.splice(index, 1);
		} else this.markQueue.shift();
		if (this.markQueue.length === 0) this.flushPendingResponseCreate();
	}
	handleBargeIn(options) {
		const assistantItemId = this.lastAssistantItemId;
		const responseStartTimestamp = this.responseStartTimestamp;
		const outputInterruptible = responseStartTimestamp !== null && (this.responseActive || this.markQueue.length > 0 || options?.audioPlaybackActive === true);
		const shouldInterruptProvider = assistantItemId !== null && outputInterruptible;
		const audioEndMs = shouldInterruptProvider ? Math.max(0, responseStartTimestamp === null ? this.latestMediaTimestamp : this.latestMediaTimestamp - responseStartTimestamp) : null;
		if (this.responseActive && !this.responseCancelInFlight) {
			this.sendEvent({ type: "response.cancel" }, "reason=barge-in");
			this.responseCancelInFlight = true;
		}
		if (shouldInterruptProvider) {
			this.sendEvent({
				type: "conversation.item.truncate",
				item_id: assistantItemId,
				content_index: 0,
				audio_end_ms: audioEndMs
			}, `reason=barge-in audioEndMs=${audioEndMs}`);
			this.config.onClearAudio("barge-in");
			this.markQueue = [];
			this.lastAssistantItemId = null;
			this.responseStartTimestamp = null;
			return;
		}
		this.config.onClearAudio("barge-in");
		this.markQueue = [];
	}
	handleServerVadBargeIn() {
		if (this.lastAssistantItemId !== null && this.responseStartTimestamp !== null && this.markQueue.length > 0) {
			const audioEndMs = Math.max(0, this.latestMediaTimestamp - this.responseStartTimestamp);
			this.sendEvent({
				type: "conversation.item.truncate",
				item_id: this.lastAssistantItemId,
				content_index: 0,
				audio_end_ms: audioEndMs
			}, `reason=server-vad-barge-in audioEndMs=${audioEndMs}`);
		}
		this.config.onClearAudio("barge-in");
		this.markQueue = [];
		this.lastAssistantItemId = null;
		this.responseStartTimestamp = null;
	}
	buildSessionUpdate() {
		const cfg = this.config;
		return {
			type: "session.update",
			session: {
				instructions: cfg.instructions,
				voice: cfg.voice ?? "eve",
				output_modalities: ["audio"],
				turn_detection: {
					type: "server_vad",
					threshold: cfg.vadThreshold ?? .85,
					prefix_padding_ms: cfg.prefixPaddingMs ?? 333,
					silence_duration_ms: cfg.silenceDurationMs ?? 500
				},
				audio: {
					input: {
						format: this.resolveRealtimeAudioFormat(),
						transcription: { model: XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL }
					},
					output: { format: this.resolveRealtimeAudioFormat() }
				},
				...cfg.sessionResumption === true ? { resumption: { enabled: true } } : {},
				...cfg.reasoningEffort ? { reasoning: { effort: cfg.reasoningEffort } } : {},
				...cfg.tools?.length ? {
					tools: cfg.tools,
					tool_choice: "auto"
				} : {}
			}
		};
	}
	resolveRealtimeAudioFormat() {
		return this.audioFormat.encoding === "pcm16" ? {
			type: "audio/pcm",
			rate: 24e3
		} : { type: "audio/pcmu" };
	}
	emitToolCallOnce(fields) {
		if (!this.config.onToolCall) return;
		const itemId = fields.itemId || fields.callId || "unknown";
		const callId = fields.callId || itemId;
		const name = fields.name || "";
		const dedupeKey = fields.itemId || fields.callId || `${name}:${fields.rawArgs ?? ""}`;
		if (this.deliveredToolCallKeys.has(dedupeKey)) return;
		let args;
		try {
			args = JSON.parse(fields.rawArgs || "{}");
		} catch {
			this.rejectToolCallArguments({
				itemId,
				callId,
				dedupeKey,
				reason: "malformed-json"
			});
			return;
		}
		if (!isRecord(args)) {
			this.rejectToolCallArguments({
				itemId,
				callId,
				dedupeKey,
				reason: "non-object-json"
			});
			return;
		}
		this.deliveredToolCallKeys.add(dedupeKey);
		this.pendingToolCallIds.add(callId);
		this.config.onToolCall({
			itemId,
			callId,
			name,
			args
		});
	}
	rejectToolCallArguments(params) {
		this.deliveredToolCallKeys.add(params.dedupeKey);
		this.config.onEvent?.({
			direction: "server",
			type: "tool_call.arguments.rejected",
			detail: `reason=${params.reason}`,
			itemId: params.itemId
		});
		this.submitToolResultNow(params.callId, { error: "Invalid tool arguments." });
	}
	flushPendingResponseCreateAfterToolResults() {
		if (this.pendingToolCallIds.size > 0 || this.continuingToolCallIds.size > 0) {
			this.responseCreatePending = true;
			return;
		}
		this.requestResponseCreate();
	}
	requestResponseCreate() {
		if (this.responseActive || this.responseCreateInFlight || this.responseCancelInFlight || this.markQueue.length > 0 || this.continuingToolCallIds.size > 0 || this.pendingToolCallIds.size > 0) {
			this.responseCreatePending = true;
			return;
		}
		this.responseCreatePending = false;
		this.responseCreateInFlight = true;
		this.sendEvent({ type: "response.create" });
	}
	flushPendingResponseCreate() {
		if (!this.responseCreatePending) return;
		this.responseCreatePending = false;
		this.requestResponseCreate();
	}
	resetRealtimeSessionState(options = {}) {
		this.markQueue = [];
		this.responseStartTimestamp = null;
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.lastAssistantItemId = null;
		this.resetInputTranscripts();
		if (!options.preserveToolCallState) {
			this.continuingToolCallIds.clear();
			this.pendingToolCallIds.clear();
			this.toolCallBuffers.clear();
			this.deliveredToolCallKeys.clear();
			this.pendingToolResultAcks.clear();
		}
	}
	emitAudioWithPlaybackMark(audio) {
		if (this.markQueue.length >= 1024) throw new XaiRealtimePlaybackMarkOverflowError(`xAI realtime voice playback mark limit exceeded (${XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS})`);
		const markName = `audio-${randomUUID()}`;
		this.config.onAudio(audio);
		this.markQueue.push(markName);
		this.config.onMark?.(markName);
	}
};
//#endregion
export { XaiRealtimeVoiceProtocol as n, XaiRealtimePlaybackMarkOverflowError as t };
