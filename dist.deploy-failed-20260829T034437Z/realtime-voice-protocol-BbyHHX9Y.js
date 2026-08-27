import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { Q as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, nt as toOpenAICompatibleRealtimeAudioFormat, tt as realtimeVoiceAudioDurationMs } from "./realtime-session-harness-BKlDBU2j.js";
import "./realtime-voice-RqIaCTAX.js";
import { b as serializeXaiRealtimeToolResult, c as XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL, l as XAI_REALTIME_MAX_PENDING_PLAYBACK_MARKS } from "./realtime-voice-config-Q8aUq8-_.js";
import { randomUUID } from "node:crypto";
//#region extensions/xai/realtime-voice-protocol.ts
var XaiRealtimePlaybackMarkOverflowError = class extends Error {};
var XaiRealtimeVoiceProtocol = class {
	constructor(config) {
		this.config = config;
		this.markQueue = [];
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.continuingToolCallIds = /* @__PURE__ */ new Set();
		this.pendingToolCallIds = /* @__PURE__ */ new Set();
		this.latestMediaTimestamp = 0;
		this.assistantAudioItem = null;
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
		const assistantAudioItem = this.assistantAudioItem;
		const shouldInterruptProvider = assistantAudioItem !== null && (this.responseActive || this.markQueue.length > 0 || options?.audioPlaybackActive === true);
		const audioEndMs = shouldInterruptProvider ? this.audioEndMs(assistantAudioItem) : null;
		if (this.responseActive && !this.responseCancelInFlight) {
			this.sendEvent({ type: "response.cancel" }, "reason=barge-in");
			this.responseCancelInFlight = true;
		}
		if (shouldInterruptProvider && audioEndMs !== null) {
			this.truncateAssistantAudio(assistantAudioItem, "barge-in", audioEndMs);
			this.config.onClearAudio("barge-in");
			this.markQueue = [];
			this.assistantAudioItem = null;
			return;
		}
		this.config.onClearAudio("barge-in");
		this.markQueue = [];
	}
	handleServerVadBargeIn() {
		const assistantAudioItem = this.assistantAudioItem;
		if (assistantAudioItem !== null && this.markQueue.length > 0) this.truncateAssistantAudio(assistantAudioItem, "server-vad-barge-in");
		this.config.onClearAudio("barge-in");
		this.markQueue = [];
		this.assistantAudioItem = null;
	}
	audioEndMs(item) {
		const producedAudioMs = Math.floor(realtimeVoiceAudioDurationMs(this.audioFormat, item.bytes));
		const playbackAudioMs = Math.max(0, this.latestMediaTimestamp - item.startTimestamp);
		return Math.min(producedAudioMs, playbackAudioMs);
	}
	truncateAssistantAudio(item, reason, audioEndMs = this.audioEndMs(item)) {
		this.sendEvent({
			type: "conversation.item.truncate",
			item_id: item.itemId,
			content_index: 0,
			audio_end_ms: audioEndMs
		}, `reason=${reason} audioEndMs=${audioEndMs}`);
	}
	buildSessionUpdate() {
		const cfg = this.config;
		const format = toOpenAICompatibleRealtimeAudioFormat(this.audioFormat);
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
						format,
						transcription: { model: XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL }
					},
					output: { format }
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
		this.responseActive = false;
		this.responseCreateInFlight = false;
		this.responseCancelInFlight = false;
		this.responseCreatePending = false;
		this.assistantAudioItem = null;
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
