import "./channel-outbound-vVeKbh9E.js";
import { i as createFinalizableDraftStreamControlsForState } from "./draft-stream-controls-Bz_CJMkw.js";
import { o as sendSingleTextMessageMatrix, t as editMessageMatrix, u as prepareMatrixSingleText } from "./send-CJi8LIWN.js";
import { c as MsgType } from "./direct-management-DeaumWfF.js";
//#region extensions/matrix/src/matrix/draft-stream.ts
const DEFAULT_THROTTLE_MS = 1e3;
function resolveDraftPreviewOptions(mode) {
	if (mode === "quiet") return {
		msgtype: MsgType.Notice,
		includeMentions: false
	};
	return {
		msgtype: MsgType.Text,
		includeMentions: false
	};
}
function createMatrixDraftStream(params) {
	const { roomId, client, cfg, threadId, accountId, log } = params;
	const preview = resolveDraftPreviewOptions(params.mode ?? "partial");
	const useLive = params.mode !== "quiet";
	let currentEventId;
	let lastSentText = "";
	let lastSentContent = "";
	const streamState = {
		stopped: false,
		final: false
	};
	let sendFailed = false;
	let finalizeInPlaceBlocked = false;
	let liveFinalized = false;
	let replyToId = params.replyToId;
	const sendOrEdit = async (text) => {
		const trimmed = text.trimEnd();
		if (!trimmed.trim()) return false;
		const preparedText = prepareMatrixSingleText(trimmed, {
			cfg,
			accountId,
			preserveWhitespace: true
		});
		if (!preparedText.fitsInSingleEvent) {
			finalizeInPlaceBlocked = true;
			if (!currentEventId) sendFailed = true;
			streamState.stopped = true;
			log?.(`draft-stream: preview exceeded single-event limit (${preparedText.convertedText.length} > ${preparedText.singleEventLimit})`);
			return false;
		}
		if (sendFailed) return false;
		if (preparedText.trimmedText === lastSentText) return true;
		try {
			if (!currentEventId) {
				currentEventId = (await sendSingleTextMessageMatrix(roomId, preparedText.trimmedText, {
					client,
					cfg,
					replyToId,
					threadId,
					accountId,
					msgtype: preview.msgtype,
					includeMentions: preview.includeMentions,
					live: useLive
				})).messageId;
				lastSentText = preparedText.trimmedText;
				lastSentContent = preparedText.convertedText;
				log?.(`draft-stream: created message ${currentEventId}${useLive ? " (MSC4357 live)" : ""}`);
			} else {
				await editMessageMatrix(roomId, currentEventId, preparedText.trimmedText, {
					client,
					cfg,
					threadId,
					accountId,
					msgtype: preview.msgtype,
					includeMentions: preview.includeMentions,
					live: useLive
				});
				lastSentText = preparedText.trimmedText;
				lastSentContent = preparedText.convertedText;
			}
			return true;
		} catch (err) {
			log?.(`draft-stream: send/edit failed: ${String(err)}`);
			if (err instanceof Error && err.message.startsWith("Matrix single-message text exceeds limit")) finalizeInPlaceBlocked = true;
			if (!currentEventId) sendFailed = true;
			streamState.stopped = true;
			return false;
		}
	};
	const { loop, update, stop: stopDraft, discardPending } = createFinalizableDraftStreamControlsForState({
		throttleMs: DEFAULT_THROTTLE_MS,
		state: streamState,
		sendOrEditStreamMessage: sendOrEdit
	});
	log?.(`draft-stream: ready (throttleMs=${DEFAULT_THROTTLE_MS})`);
	const finalizeLive = async () => {
		if (useLive && !liveFinalized && currentEventId && lastSentText) {
			liveFinalized = true;
			try {
				await editMessageMatrix(roomId, currentEventId, lastSentText, {
					client,
					cfg,
					threadId,
					accountId,
					msgtype: preview.msgtype,
					includeMentions: preview.includeMentions,
					live: false
				});
				log?.(`draft-stream: finalized ${currentEventId} (MSC4357 stream ended)`);
				return true;
			} catch (err) {
				log?.(`draft-stream: finalize edit failed: ${String(err)}`);
				finalizeInPlaceBlocked = true;
				return false;
			}
		}
		return true;
	};
	const stop = async () => {
		await stopDraft();
		return currentEventId;
	};
	const reset = () => {
		replyToId = params.preserveReplyId ? params.replyToId : void 0;
		currentEventId = void 0;
		lastSentText = "";
		lastSentContent = "";
		streamState.stopped = false;
		streamState.final = false;
		sendFailed = false;
		finalizeInPlaceBlocked = false;
		liveFinalized = false;
		loop.resetPending();
		loop.resetThrottleWindow();
	};
	return {
		update,
		flush: loop.flush,
		stop,
		discardPending,
		finalizeLive,
		reset,
		eventId: () => currentEventId,
		content: () => lastSentContent || void 0,
		matchesPreparedText: (text) => prepareMatrixSingleText(text.trimEnd(), {
			cfg,
			accountId,
			preserveWhitespace: true
		}).trimmedText === lastSentText,
		mustDeliverFinalNormally: () => sendFailed || finalizeInPlaceBlocked
	};
}
//#endregion
export { createMatrixDraftStream };
