import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as shouldAttemptTtsPayload } from "./tts-config-FJpaUUd1.js";
import { r as logVerbose } from "./globals-DD_xHyf6.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, l as isReplyPayloadStatusNotice } from "./reply-payload-DVcGHORx.js";
import { t as runAbortableTimeout } from "./with-timeout-CRFXnEKz.js";
import { t as beginReplyOperationFinalizationWork } from "./reply-run-finalization-lease-CfBDn0LI.js";
import { n as RUN_STALE_TAKEOVER_MS } from "./diagnostic-run-activity-Bf46HUQp.js";
import { a as hasOutboundReplyContent } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { c as prepareReplyPayloadForDispatcher } from "./reply-dispatcher-CE6KhGPF.js";
//#region src/auto-reply/reply/block-reply-coalescer.ts
/** Creates a text coalescer with idle and size-based flush behavior. */
function createBlockReplyCoalescer(params) {
	const { config, shouldAbort, onFlush } = params;
	const minChars = Math.max(1, Math.floor(config.minChars));
	const maxChars = Math.max(minChars, Math.floor(config.maxChars));
	const idleMs = Math.max(0, Math.floor(config.idleMs));
	const joiner = config.joiner ?? "";
	const flushOnEnqueue = config.flushOnEnqueue === true;
	let bufferText = "";
	let bufferReplyToId;
	let bufferAudioAsVoice;
	let bufferIsReasoning;
	let bufferIsCommentary;
	let bufferIsCompactionNotice;
	let bufferIsFallbackNotice;
	let bufferIsStatusNotice;
	let bufferMetadataSource;
	let idleTimer;
	const clearIdleTimer = () => {
		if (!idleTimer) return;
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const resetBuffer = () => {
		bufferText = "";
		bufferReplyToId = void 0;
		bufferAudioAsVoice = void 0;
		bufferIsReasoning = void 0;
		bufferIsCommentary = void 0;
		bufferIsCompactionNotice = void 0;
		bufferIsFallbackNotice = void 0;
		bufferIsStatusNotice = void 0;
		bufferMetadataSource = void 0;
	};
	const startBufferFromPayload = (payload) => {
		bufferReplyToId = payload.replyToId;
		bufferAudioAsVoice = payload.audioAsVoice;
		bufferIsReasoning = payload.isReasoning;
		bufferIsCommentary = payload.isCommentary;
		bufferIsCompactionNotice = payload.isCompactionNotice;
		bufferIsFallbackNotice = payload.isFallbackNotice;
		bufferIsStatusNotice = payload.isStatusNotice;
		bufferMetadataSource = payload;
	};
	const scheduleIdleFlush = () => {
		if (idleMs <= 0) return;
		clearIdleTimer();
		idleTimer = setTimeout(() => {
			flush({ force: false });
		}, idleMs);
	};
	const flush = async (options) => {
		clearIdleTimer();
		if (shouldAbort()) {
			resetBuffer();
			return;
		}
		if (!bufferText) return;
		if (!options?.force && !flushOnEnqueue && bufferText.length < minChars) {
			scheduleIdleFlush();
			return;
		}
		const payload = {
			text: bufferText,
			replyToId: bufferReplyToId,
			audioAsVoice: bufferAudioAsVoice,
			isReasoning: bufferIsReasoning,
			isCommentary: bufferIsCommentary,
			isCompactionNotice: bufferIsCompactionNotice,
			isFallbackNotice: bufferIsFallbackNotice,
			isStatusNotice: bufferIsStatusNotice
		};
		const payloadWithMetadata = copyReplyPayloadMetadata(bufferMetadataSource ?? payload, payload);
		resetBuffer();
		await onFlush(payloadWithMetadata);
	};
	const canMergeBufferedTextWithMedia = (payload) => Boolean(bufferText) && !flushOnEnqueue && !bufferAudioAsVoice && !payload.audioAsVoice && !payload.isReasoning && !payload.isCommentary && !isReplyPayloadStatusNotice(payload) && !bufferIsReasoning && !bufferIsCommentary && !isReplyPayloadStatusNotice({
		isCompactionNotice: bufferIsCompactionNotice,
		isFallbackNotice: bufferIsFallbackNotice,
		isStatusNotice: bufferIsStatusNotice
	}) && (!payload.replyToId || bufferReplyToId === payload.replyToId);
	/** Merges buffered text into a media payload without changing media metadata. */
	const mergeBufferedTextWithMedia = (payload, text) => {
		const mergedText = text ? `${bufferText}${joiner}${text}` : bufferText;
		const mergedPayload = {
			...payload,
			text: mergedText,
			replyToId: payload.replyToId ?? bufferReplyToId
		};
		const metadataMergedPayload = copyReplyPayloadMetadata(bufferMetadataSource ?? mergedPayload, mergedPayload);
		resetBuffer();
		return copyReplyPayloadMetadata(payload, metadataMergedPayload);
	};
	const enqueue = (payload) => {
		if (shouldAbort()) return;
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasMedia = reply.hasMedia;
		const text = reply.text;
		const hasText = reply.hasText;
		if (hasMedia) {
			if (canMergeBufferedTextWithMedia(payload)) {
				onFlush(mergeBufferedTextWithMedia(payload, text));
				return;
			}
			flush({ force: true });
			onFlush(payload);
			return;
		}
		if (!hasText) return;
		if (flushOnEnqueue) {
			if (bufferText) flush({ force: true });
			startBufferFromPayload(payload);
			bufferText = text;
			flush({ force: true });
			return;
		}
		const replyToConflict = Boolean(bufferText && payload.replyToId && (!bufferReplyToId || bufferReplyToId !== payload.replyToId));
		const visibilityConflict = bufferText && (bufferIsReasoning !== payload.isReasoning || bufferIsCommentary !== payload.isCommentary || bufferIsCompactionNotice !== payload.isCompactionNotice || bufferIsFallbackNotice !== payload.isFallbackNotice || isReplyPayloadStatusNotice({
			isCompactionNotice: bufferIsCompactionNotice,
			isFallbackNotice: bufferIsFallbackNotice,
			isStatusNotice: bufferIsStatusNotice
		}) !== isReplyPayloadStatusNotice(payload));
		if (bufferText && (replyToConflict || bufferAudioAsVoice !== payload.audioAsVoice || visibilityConflict)) flush({ force: true });
		if (!bufferText) startBufferFromPayload(payload);
		const nextText = bufferText ? `${bufferText}${joiner}${text}` : text;
		if (nextText.length > maxChars) {
			if (bufferText) {
				flush({ force: true });
				startBufferFromPayload(payload);
				if (text.length >= maxChars) {
					onFlush(payload);
					return;
				}
				bufferText = text;
				scheduleIdleFlush();
				return;
			}
			onFlush(payload);
			return;
		}
		bufferText = nextText;
		if (bufferText.length >= maxChars) {
			flush({ force: true });
			return;
		}
		scheduleIdleFlush();
	};
	return {
		enqueue,
		flush,
		hasBuffered: () => Boolean(bufferText),
		stop: () => clearIdleTimer()
	};
}
//#endregion
//#region src/auto-reply/reply/block-reply-pipeline.ts
/** Buffers audio payloads so final delivery can preserve voice presentation. */
function createAudioAsVoiceBuffer(params) {
	let seenAudioAsVoice = false;
	return {
		onEnqueue: (payload) => {
			if (payload.audioAsVoice) seenAudioAsVoice = true;
		},
		shouldBuffer: (payload) => params.isAudioPayload(payload),
		finalize: (payload) => seenAudioAsVoice ? {
			...payload,
			audioAsVoice: true
		} : payload
	};
}
/** Creates a stable duplicate key for a complete outbound payload. */
function createBlockReplyPayloadKey(payload) {
	const reply = resolveSendableOutboundReplyParts(payload);
	return JSON.stringify({
		statusNotice: isReplyPayloadStatusNotice(payload),
		text: reply.trimmedText,
		mediaList: reply.mediaUrls,
		presentation: payload.presentation ?? null,
		presentationTextMode: payload.presentationTextMode ?? null,
		interactive: payload.interactive ?? null,
		channelData: payload.channelData ?? null,
		replyToId: payload.replyToId ?? null
	});
}
/** Creates a duplicate key that ignores reply target for final suppression. */
function createBlockReplyContentKey(payload) {
	const reply = resolveSendableOutboundReplyParts(payload);
	return JSON.stringify({
		text: reply.trimmedText,
		mediaList: reply.mediaUrls,
		presentation: payload.presentation ?? null,
		presentationTextMode: payload.presentationTextMode ?? null,
		interactive: payload.interactive ?? null,
		channelData: payload.channelData ?? null
	});
}
function resolveBlockReplyTimeoutMs(timeoutMs) {
	return clampPositiveTimerTimeoutMs(timeoutMs) ?? 0;
}
/** Creates the ordered block reply delivery pipeline for streamed payloads. */
function createBlockReplyPipeline(params) {
	const { onBlockReply, coalescing, buffer } = params;
	const timeoutMs = resolveBlockReplyTimeoutMs(params.timeoutMs);
	const sentKeys = /* @__PURE__ */ new Set();
	const sentContentKeys = /* @__PURE__ */ new Set();
	const sentMediaUrls = /* @__PURE__ */ new Set();
	const pendingKeys = /* @__PURE__ */ new Set();
	const seenKeys = /* @__PURE__ */ new Set();
	const bufferedKeys = /* @__PURE__ */ new Set();
	const bufferedPayloadKeys = /* @__PURE__ */ new Set();
	const bufferedPayloads = [];
	const streamedTextFragmentsByMessage = /* @__PURE__ */ new Map();
	let bufferedAssistantMessageIndex;
	let sendChain = Promise.resolve();
	let aborted = false;
	let didStream = false;
	let didStreamTerminalReply = false;
	let didLogTimeout = false;
	const hasSeenOrQueuedPayloadKey = (payloadKey) => seenKeys.has(payloadKey) || sentKeys.has(payloadKey) || pendingKeys.has(payloadKey);
	const flushBufferedAssistantBlock = () => {
		bufferedAssistantMessageIndex = void 0;
		coalescer?.flush({ force: true });
	};
	const sendPayload = (payload, bypassSeenCheck = false) => {
		if (aborted) return;
		const payloadKey = createBlockReplyPayloadKey(payload);
		const contentKey = createBlockReplyContentKey(payload);
		if (!bypassSeenCheck) {
			if (seenKeys.has(payloadKey)) return;
			seenKeys.add(payloadKey);
		}
		if (sentKeys.has(payloadKey) || pendingKeys.has(payloadKey)) return;
		pendingKeys.add(payloadKey);
		const fallbackAbortController = new AbortController();
		let timeoutSignal;
		sendChain = sendChain.then(async () => {
			if (aborted) return false;
			await runAbortableTimeout(async (signal) => {
				timeoutSignal = signal;
				await onBlockReply(payload, {
					abortSignal: signal ?? fallbackAbortController.signal,
					timeoutMs
				});
			}, timeoutMs || void 0, "block reply delivery");
			return true;
		}).then((didSend) => {
			if (!didSend) return;
			sentKeys.add(payloadKey);
			const isStatusNotice = isReplyPayloadStatusNotice(payload);
			if (!isStatusNotice) sentContentKeys.add(contentKey);
			const reply = resolveSendableOutboundReplyParts(payload);
			for (const mediaUrl of reply.mediaUrls) sentMediaUrls.add(mediaUrl);
			if (!isStatusNotice && reply.trimmedText) {
				const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
				const fragments = streamedTextFragmentsByMessage.get(assistantMessageIndex) ?? [];
				fragments.push(reply.trimmedText);
				streamedTextFragmentsByMessage.set(assistantMessageIndex, fragments);
			}
			if (!isStatusNotice) {
				didStream = true;
				if (payload.isReasoning !== true && payload.isCommentary !== true && hasOutboundReplyContent(payload, { trimText: true })) didStreamTerminalReply = true;
			}
		}).catch((err) => {
			if (timeoutSignal?.aborted) {
				aborted = true;
				if (!didLogTimeout) {
					didLogTimeout = true;
					logVerbose(`block reply delivery timed out after ${timeoutMs}ms; skipping remaining block replies to preserve ordering`);
				}
				return;
			}
			logVerbose(`block reply delivery failed: ${String(err)}`);
		}).finally(() => {
			pendingKeys.delete(payloadKey);
		});
	};
	const coalescer = coalescing ? createBlockReplyCoalescer({
		config: coalescing,
		shouldAbort: () => aborted,
		onFlush: (payload) => {
			bufferedAssistantMessageIndex = void 0;
			bufferedKeys.clear();
			sendPayload(payload, true);
		}
	}) : null;
	const bufferPayload = (payload) => {
		buffer?.onEnqueue?.(payload);
		if (!buffer?.shouldBuffer(payload)) return false;
		const payloadKey = createBlockReplyPayloadKey(payload);
		if (hasSeenOrQueuedPayloadKey(payloadKey) || bufferedPayloadKeys.has(payloadKey)) return true;
		seenKeys.add(payloadKey);
		bufferedPayloadKeys.add(payloadKey);
		bufferedPayloads.push(payload);
		return true;
	};
	const flushBuffered = () => {
		if (!bufferedPayloads.length) return;
		for (const payload of bufferedPayloads) {
			const finalPayload = buffer?.finalize?.(payload) ?? payload;
			sendPayload(finalPayload, true);
		}
		bufferedPayloads.length = 0;
		bufferedPayloadKeys.clear();
	};
	const enqueueCoalescedPayload = (payload) => {
		if (!coalescer) return;
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		if (assistantMessageIndex !== void 0 && bufferedAssistantMessageIndex !== void 0 && assistantMessageIndex !== bufferedAssistantMessageIndex && coalescer.hasBuffered()) flushBufferedAssistantBlock();
		const payloadKey = createBlockReplyPayloadKey(payload);
		if (hasSeenOrQueuedPayloadKey(payloadKey) || bufferedKeys.has(payloadKey)) return;
		seenKeys.add(payloadKey);
		bufferedKeys.add(payloadKey);
		bufferedAssistantMessageIndex = assistantMessageIndex;
		coalescer.enqueue(payload);
	};
	const enqueue = (payload) => {
		if (aborted) return;
		if (bufferPayload(payload)) return;
		const reply = resolveSendableOutboundReplyParts(payload);
		const hasNonTextContent = hasOutboundReplyContent({
			...payload,
			text: void 0,
			mediaUrl: void 0,
			mediaUrls: void 0
		}, { trimText: true });
		if (reply.hasMedia && coalescer && !hasNonTextContent) {
			enqueueCoalescedPayload(payload);
			return;
		}
		if (reply.hasMedia || hasNonTextContent) {
			coalescer?.flush({ force: true });
			sendPayload(payload, false);
			return;
		}
		if (coalescer) {
			enqueueCoalescedPayload(payload);
			return;
		}
		sendPayload(payload, false);
	};
	const flush = async (options) => {
		await coalescer?.flush(options);
		bufferedAssistantMessageIndex = void 0;
		flushBuffered();
		await sendChain;
	};
	const stop = () => {
		coalescer?.stop();
	};
	return {
		enqueue,
		flush,
		stop,
		hasBuffered: () => coalescer?.hasBuffered() || bufferedPayloads.length > 0,
		didStream: () => didStream,
		didStreamTerminalReply: () => didStreamTerminalReply,
		isAborted: () => aborted,
		hasSentExactPayload: (payload) => sentContentKeys.has(createBlockReplyContentKey(payload)),
		hasSentPayload: (payload) => {
			const payloadKey = createBlockReplyContentKey(payload);
			if (sentContentKeys.has(payloadKey)) return true;
			if (!didStream) return false;
			const reply = resolveSendableOutboundReplyParts(payload);
			if (reply.hasMedia || !reply.trimmedText) return false;
			const normalize = (text) => text.replace(/\s+/g, "");
			const target = normalize(reply.trimmedText);
			for (const fragments of streamedTextFragmentsByMessage.values()) if (fragments.length > 0 && normalize(fragments.join("")) === target) return true;
			return false;
		},
		getSentMediaUrls: () => Array.from(sentMediaUrls)
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.payloads.ts
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const NO_VISIBLE_REPLY_FALLBACK_TEXT = "No reply was generated for this message. This is usually a temporary model failure - please try again.";
const QUEUE_CAP_REJECTION_TEXT = "This message was not queued because the session queue is full. Please try again after the current response finishes.";
function shouldDeliverDespiteSourceReplySuppression(payload, state) {
	return state.suppressAutomaticSourceDelivery && !state.sendPolicyDenied && getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true && (state.ctx.InboundEventKind !== "room_event" || state.explicitCommandTurnCtx);
}
function hasExecApprovalPayload(payload) {
	return isRecord(payload.channelData?.execApproval);
}
function hasExecApprovalUnavailablePayload(payload) {
	return isRecord(payload.channelData?.execApprovalUnavailable);
}
function hasAskUserPayload(payload) {
	return isRecord(payload.channelData?.askUser);
}
function requiresDurableToolResultDelivery(payload) {
	return resolveSendableOutboundReplyParts(payload).hasMedia || hasExecApprovalPayload(payload) || hasExecApprovalUnavailablePayload(payload) || hasAskUserPayload(payload);
}
function createFinalDispatchPayloadDedupeKey(payload) {
	const metadata = getReplyPayloadMetadata(payload);
	return JSON.stringify({
		payload: {
			text: payload.text,
			mediaUrl: payload.mediaUrl,
			mediaUrls: payload.mediaUrls,
			trustedLocalMedia: payload.trustedLocalMedia,
			sensitiveMedia: payload.sensitiveMedia,
			presentation: payload.presentation,
			presentationTextMode: payload.presentationTextMode,
			delivery: payload.delivery,
			interactive: payload.interactive,
			btw: payload.btw,
			replyToId: payload.replyToId,
			replyToTag: payload.replyToTag,
			replyToCurrent: payload.replyToCurrent,
			audioAsVoice: payload.audioAsVoice,
			spokenText: payload.spokenText,
			ttsSupplement: payload.ttsSupplement,
			isError: payload.isError,
			isReasoning: payload.isReasoning,
			isCommentary: payload.isCommentary,
			isReasoningSnapshot: payload.isReasoningSnapshot,
			isCompactionNotice: payload.isCompactionNotice,
			isFallbackNotice: payload.isFallbackNotice,
			isStatusNotice: payload.isStatusNotice,
			channelData: payload.channelData
		},
		identity: {
			assistantMessageIndex: metadata?.assistantMessageIndex,
			assistantTranscriptOwned: metadata?.assistantTranscriptOwned,
			replyToIdExplicit: metadata?.replyToIdExplicit,
			replyDelivery: metadata?.replyDelivery,
			replyDeliverySource: metadata?.replyDeliverySource,
			sourceReplyTranscriptMirror: metadata?.sourceReplyTranscriptMirror
		}
	});
}
function formatSuppressedReplyPayloadForLog(reply) {
	const metadata = getReplyPayloadMetadata(reply);
	const text = normalizeOptionalString(reply.text);
	const textPreview = text ? truncateUtf16Safe(text.replace(/\s+/g, " "), 160) : void 0;
	const sendableParts = resolveSendableOutboundReplyParts(reply);
	const richParts = [
		reply.presentation ? "presentation" : void 0,
		reply.interactive ? "interactive" : void 0,
		reply.channelData ? "channelData" : void 0
	].filter(Boolean);
	return [
		`textChars=${text?.length ?? 0}`,
		`media=${sendableParts.mediaCount}`,
		`rich=${richParts.length ? richParts.join("|") : "none"}`,
		`error=${reply.isError === true}`,
		`beforeAgentRunBlocked=${metadata?.beforeAgentRunBlocked === true}`,
		`deliverDespiteSuppression=${metadata?.deliverDespiteSourceReplySuppression === true}`,
		textPreview ? `textPreview=${JSON.stringify(textPreview)}` : void 0
	].filter(Boolean).join(" ");
}
async function maybeApplyTtsToReplyPayload(params) {
	if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	const ttsPayload = await maybeApplyTtsToPayload(params);
	return ttsPayload === params.payload ? ttsPayload : copyReplyPayloadMetadata(params.payload, ttsPayload);
}
function createFinalizationAwareTtsPayloadApplier(params) {
	return async (ttsParams) => {
		const replyOperation = params.getReplyOperation();
		const finishFinalizationWork = replyOperation ? beginReplyOperationFinalizationWork(replyOperation, RUN_STALE_TAKEOVER_MS) : void 0;
		try {
			return await maybeApplyTtsToReplyPayload({
				...ttsParams,
				inboundAudio: params.hasInboundAudio()
			});
		} finally {
			finishFinalizationWork?.();
			replyOperation?.recordActivity();
		}
	};
}
/** Applies dispatcher normalization before TTS or transcript-visible side effects. */
function prepareReplyPayloadForSideEffects(dispatcher, kind, payload, state, onVisibleAccepted) {
	if (!payload) return null;
	const outcome = prepareReplyPayloadForDispatcher(dispatcher, kind, payload);
	if (outcome.kind === "deliver") {
		state.acceptedReplyPayload = true;
		if (outcome.payload.isReasoning !== true && outcome.payload.isCommentary !== true && hasOutboundReplyContent(outcome.payload, { trimText: true })) onVisibleAccepted?.();
		return outcome.payload;
	}
	state.channelTransformSuppressed ||= outcome.reason === "channel_transform";
	return null;
}
//#endregion
export { formatSuppressedReplyPayloadForLog as a, hasExecApprovalUnavailablePayload as c, shouldDeliverDespiteSourceReplySuppression as d, createAudioAsVoiceBuffer as f, createFinalizationAwareTtsPayloadApplier as i, prepareReplyPayloadForSideEffects as l, createBlockReplyPipeline as m, QUEUE_CAP_REJECTION_TEXT as n, hasAskUserPayload as o, createBlockReplyContentKey as p, createFinalDispatchPayloadDedupeKey as r, hasExecApprovalPayload as s, NO_VISIBLE_REPLY_FALLBACK_TEXT as t, requiresDurableToolResultDelivery as u };
