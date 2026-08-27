import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DbQz-n_m.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { a as normalizeAttachments, n as isImageAttachment } from "./attachments.normalize-bAPjiGNs.js";
import { t as stripExtractedFileImageMetadata } from "./extracted-file-images-CdmNdoIK.js";
import { r as resolveAgentTurnAttachments, t as collectDescribedImageAttachmentIndexes } from "./agent-turn-attachments-CDnycmxX.js";
//#region src/auto-reply/reply/queue-policy.ts
/** Resolves whether an active session should run, queue, or drop a new inbound turn. */
function resolveActiveRunQueueAction(params) {
	if (!params.isActive && (!params.queueAdmissionState || params.queueAdmissionState === "empty")) return "run-now";
	if (params.isHeartbeat) return "drop";
	if (params.resetTriggered) return "run-now";
	if (params.queueAdmissionState && params.queueAdmissionState !== "empty") return "enqueue-followup";
	if (params.shouldFollowup) return "enqueue-followup";
	return "run-now";
}
//#endregion
//#region src/auto-reply/reply/typing-mode.ts
/** Group chats default to message-triggered typing to avoid noisy indicators. */
const DEFAULT_GROUP_TYPING_MODE = "message";
/** Resolves the effective typing mode for the current auto-reply turn. */
function resolveTypingMode({ configured, isGroupChat, wasMentioned, isHeartbeat, typingPolicy, suppressTyping, sourceReplyDeliveryMode }) {
	if (isHeartbeat || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat" || suppressTyping) return "never";
	if (configured) return configured;
	if (sourceReplyDeliveryMode === "message_tool_only") return "instant";
	if (!isGroupChat || wasMentioned) return "instant";
	return DEFAULT_GROUP_TYPING_MODE;
}
/** Creates a typing signaler that starts or refreshes typing from stream events. */
function createTypingSignaler(params) {
	const { typing, mode, isHeartbeat } = params;
	const shouldStartImmediately = mode === "instant";
	const shouldStartOnMessageStart = mode === "message";
	const shouldStartOnText = mode === "message" || mode === "instant";
	const shouldStartOnReasoning = mode === "thinking";
	const disabled = isHeartbeat || mode === "never";
	let hasRenderableText = false;
	const isRenderableText = (text) => {
		const trimmed = normalizeOptionalString(text);
		if (!trimmed) return false;
		return !isSilentReplyText(trimmed, SILENT_REPLY_TOKEN);
	};
	const signalRunStart = async () => {
		if (disabled || !shouldStartImmediately) return;
		await typing.startTypingLoop();
	};
	const signalMessageStart = async () => {
		if (disabled || !shouldStartOnMessageStart) return;
		if (!hasRenderableText) return;
		await typing.startTypingLoop();
	};
	const signalTextDelta = async (text) => {
		if (disabled) return;
		if (isRenderableText(text)) hasRenderableText = true;
		else if (normalizeOptionalString(text)) return;
		else return;
		if (shouldStartOnText) {
			await typing.startTypingOnText(text);
			return;
		}
		if (shouldStartOnReasoning) {
			if (!typing.isActive()) await typing.startTypingLoop();
			typing.refreshTypingTtl();
		}
	};
	const signalReasoningDelta = async () => {
		if (disabled || !shouldStartOnReasoning) return;
		await typing.startTypingLoop();
		typing.refreshTypingTtl();
	};
	const signalToolStart = async () => {
		if (disabled) return;
		if (!typing.isActive()) {
			if (shouldStartOnMessageStart && !hasRenderableText) return;
			await typing.startTypingLoop();
			typing.refreshTypingTtl();
			return;
		}
		typing.refreshTypingTtl();
	};
	const signalExecutionActivity = async () => {
		if (disabled) return;
		if (!typing.isActive()) await typing.startTypingLoop();
		typing.refreshTypingTtl();
	};
	return {
		mode,
		shouldStartImmediately,
		shouldStartOnMessageStart,
		shouldStartOnText,
		shouldStartOnReasoning,
		signalRunStart,
		signalMessageStart,
		signalTextDelta,
		signalReasoningDelta,
		signalToolStart,
		signalExecutionActivity
	};
}
//#endregion
//#region src/auto-reply/reply/current-turn-images.ts
function collectCurrentImageAttachments(ctx) {
	return normalizeAttachments(ctx).flatMap((attachment) => {
		const mediaPath = normalizeOptionalString(attachment.path);
		return mediaPath && isImageAttachment(attachment) ? [{
			...attachment,
			path: mediaPath
		}] : [];
	});
}
function appendOrderedImages(params) {
	const images = params.images ?? [];
	if (!params.imageOrder || params.imageOrder.length === 0) {
		for (const image of images) params.entries.push({
			image,
			imageOrder: "inline",
			sourceIndex: params.sourceIndex,
			sequence: params.entries.length
		});
		return;
	}
	let inlineIndex = 0;
	for (const imageOrder of params.imageOrder) params.entries.push({
		image: imageOrder === "inline" ? images[inlineIndex++] : void 0,
		imageOrder,
		sourceIndex: params.sourceIndex,
		sequence: params.entries.length
	});
	while (inlineIndex < images.length) params.entries.push({
		image: images[inlineIndex++],
		imageOrder: "inline",
		sourceIndex: params.sourceIndex,
		sequence: params.entries.length
	});
}
function resolveMergedTurnImages(entries) {
	if (entries.length === 0) return {};
	const merged = entries.toSorted((left, right) => {
		if (left.sourceIndex !== void 0 && right.sourceIndex !== void 0) return left.sourceIndex - right.sourceIndex || left.sequence - right.sequence;
		return left.sequence - right.sequence;
	});
	const images = merged.flatMap((entry) => entry.image ? [entry.image] : []);
	const result = {
		...images.length > 0 ? { images } : {},
		imageOrder: merged.map((entry) => entry.imageOrder)
	};
	Object.defineProperty(result, "imageSourceIndexes", { value: merged.map((entry) => entry.sourceIndex) });
	return result;
}
/** Resolves current-turn image attachments that were not already described by media understanding. */
async function resolveCurrentTurnImages(params) {
	const entries = [];
	appendOrderedImages({
		entries,
		images: params.images,
		imageOrder: params.imageOrder
	});
	for (const image of params.extractedFileImages ?? []) appendOrderedImages({
		entries,
		images: [stripExtractedFileImageMetadata(image)],
		sourceIndex: image.attachmentIndex
	});
	const currentImageAttachments = collectCurrentImageAttachments(params.ctx);
	if (currentImageAttachments.length === 0) return resolveMergedTurnImages(entries);
	const describedImageIndexes = collectDescribedImageAttachmentIndexes(params.ctx);
	const undescribedImageAttachments = currentImageAttachments.filter((attachment) => !describedImageIndexes.has(attachment.index));
	if (undescribedImageAttachments.length === 0) return resolveMergedTurnImages(entries);
	try {
		const resolved = await resolveAgentTurnAttachments({
			ctx: params.ctx,
			cfg: params.cfg,
			includeRecentHistoryImages: false,
			includeAttachmentIndexes: true
		});
		const images = resolved.attachments.map((attachment) => ({
			type: "image",
			data: attachment.data,
			mimeType: attachment.mediaType
		}));
		const resolvedIndexes = resolved.attachmentIndexes ?? [];
		if (images.length < undescribedImageAttachments.length) logVerbose(`agent-runner: native OpenClaw media resolution produced ${images.length}/${undescribedImageAttachments.length} current image attachment(s); retaining resolved images`);
		const imageByResolvedIndex = new Map(resolvedIndexes.map((resolvedIndex, imageIndex) => [resolvedIndex, images[imageIndex]]));
		const unresolvedSourceIndexes = [];
		for (const attachment of undescribedImageAttachments) {
			const image = imageByResolvedIndex.get(attachment.index);
			if (image) appendOrderedImages({
				entries,
				images: [image],
				sourceIndex: attachment.index
			});
			else unresolvedSourceIndexes.push(attachment.index);
		}
		const merged = resolveMergedTurnImages(entries);
		return unresolvedSourceIndexes.length > 0 ? Object.assign(merged, { unresolvedSourceIndexes }) : merged;
	} catch (error) {
		logVerbose(`agent-runner: media attachment image resolution failed, proceeding without native images: ${formatErrorMessage(error)}`);
		const merged = resolveMergedTurnImages(entries);
		return undescribedImageAttachments.length > 0 ? Object.assign(merged, { unresolvedSourceIndexes: undescribedImageAttachments.map((attachment) => attachment.index) }) : merged;
	}
}
//#endregion
export { resolveActiveRunQueueAction as i, createTypingSignaler as n, resolveTypingMode as r, resolveCurrentTurnImages as t };
