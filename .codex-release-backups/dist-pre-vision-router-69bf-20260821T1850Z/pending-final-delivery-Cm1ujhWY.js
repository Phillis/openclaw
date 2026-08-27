import { st as stripInternalMetadataForDisplay } from "./openclaw-state-db-BciZ4rHE.js";
import { c as stripLeadingSilentToken, i as isSilentReplyPayloadText, l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-CMI0yx54.js";
import { a as getReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { i as normalizeReplyPayloadsForDelivery } from "./payloads-46PhlDay.js";
import { n as normalizeReplyPayload } from "./normalize-reply-Fznc1VSS.js";
//#region src/auto-reply/reply/pending-final-delivery.ts
/** Normalize raw final payloads into the channel-agnostic sendable set recovery can mark. */
function normalizePendingFinalDeliveryPayloads(payloads) {
	return normalizeReplyPayloadsForDelivery(normalizePendingFinalRecoveryPayloads(payloads));
}
/** Normalize raw final payloads for durable recovery without stripping delivery directives. */
function normalizePendingFinalRecoveryPayloads(payloads) {
	return payloads.flatMap((payload) => {
		const normalized = normalizeReplyPayload(payload, { applyChannelTransforms: false });
		return normalized ? [normalized] : [];
	});
}
/** Build durable recovery text only for payload shapes this marker can replay without loss. */
function buildRecoverablePendingFinalDeliveryText(payloads) {
	const sendablePayloads = [];
	for (const payload of payloads) {
		if (payload.isReasoning === true) continue;
		const recoveryPayload = payload.replyToId && getReplyPayloadMetadata(payload)?.replyToIdExplicit !== true ? {
			...payload,
			replyToId: void 0
		} : payload;
		const deliveryPayloads = normalizeReplyPayloadsForDelivery([recoveryPayload]);
		if (deliveryPayloads.length === 0) continue;
		if (hasUnsupportedDurableRecoveryShape(recoveryPayload) || deliveryPayloads.some(hasUnrecoverableNormalizedDeliveryShape)) return;
		sendablePayloads.push(...deliveryPayloads);
	}
	if (sendablePayloads.length > 1 && sendablePayloads.some((payload) => hasDurableMedia(payload) || hasMediaDirectiveText(payload))) return;
	const recoveryPayloads = [];
	for (const payload of sendablePayloads) {
		const textAndMedia = [payload.text, ...collectDurableMediaDirectives(payload).map((mediaUrl) => `MEDIA:${mediaUrl}`)].filter((value) => Boolean(value?.trim())).join("\n");
		if (textAndMedia) recoveryPayloads.push({
			...payload,
			mediaUrl: void 0,
			mediaUrls: void 0,
			text: textAndMedia
		});
	}
	return buildPendingFinalDeliveryText(recoveryPayloads) || void 0;
}
/** Build the restart-recovery text represented by one or more final payloads. */
function buildPendingFinalDeliveryText(payloads) {
	return sanitizePendingFinalDeliveryText(payloads.filter((payload) => payload.isReasoning !== true).map((payload) => payload.text).filter((textLocal) => Boolean(textLocal)).join("\n\n"));
}
const PENDING_FINAL_DELIVERY_CLEAR_PATCH = { pendingFinalDelivery: void 0 };
function resolvePendingFinalDeliveryCompletion(payloads) {
	const completion = payloads?.map((payload) => getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion).find(Boolean);
	return completion ? {
		kind: "pending-final",
		...completion
	} : void 0;
}
function collectDurableMediaDirectives(payload) {
	if (payload.sensitiveMedia === true) return [];
	const mediaUrls = [...payload.mediaUrls ?? [], ...payload.mediaUrl ? [payload.mediaUrl] : []];
	const seen = /* @__PURE__ */ new Set();
	return mediaUrls.map((mediaUrl) => mediaUrl.trim()).filter((mediaUrl) => {
		if (!mediaUrl || seen.has(mediaUrl)) return false;
		seen.add(mediaUrl);
		return true;
	});
}
function hasUnsupportedDurableRecoveryShape(payload) {
	const hasMedia = hasDurableMedia(payload);
	return payload.sensitiveMedia === true || payload.trustedLocalMedia === true || payload.presentation !== void 0 || payload.interactive !== void 0 || payload.btw !== void 0 || payload.delivery !== void 0 || payload.channelData !== void 0 || payload.location !== void 0 || payload.replyToId !== void 0 || payload.replyToTag === true || payload.replyToCurrent === true || payload.audioAsVoice === true || payload.videoAsNote === true || payload.spokenText !== void 0 || payload.ttsSupplement !== void 0 || hasMedia && (payload.isCommentary === true || payload.isStatusNotice === true);
}
function hasDurableMedia(payload) {
	return Boolean(payload.mediaUrl?.trim() || payload.mediaUrls?.some((url) => url.trim()));
}
function hasMediaDirectiveText(payload) {
	return /^\s*MEDIA:/imu.test(payload.text ?? "");
}
function hasUnrecoverableNormalizedDeliveryShape(payload) {
	return payload.replyToCurrent === true || payload.replyToTag === true || payload.replyToId !== void 0 || payload.audioAsVoice === true || payload.videoAsNote === true;
}
/** Sanitizes pending final delivery text before channel-visible output. */
function sanitizePendingFinalDeliveryText(text) {
	let stripped = stripInternalMetadataForDisplay(text).trim();
	if (isSilentReplyPayloadText(stripped, "NO_REPLY")) return "";
	if (stripped && !isSilentReplyText(stripped, "NO_REPLY")) {
		const hasLeadingSilentToken = startsWithSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken) stripped = stripLeadingSilentToken(stripped, SILENT_REPLY_TOKEN);
		if (hasLeadingSilentToken || stripped.toLowerCase().includes("NO_REPLY".toLowerCase())) stripped = stripSilentToken(stripped, SILENT_REPLY_TOKEN);
	}
	if (!stripped.trim()) return "";
	return isSilentReplyPayloadText(stripped, "NO_REPLY") ? "" : stripped.trim();
}
//#endregion
export { resolvePendingFinalDeliveryCompletion as a, normalizePendingFinalRecoveryPayloads as i, buildRecoverablePendingFinalDeliveryText as n, sanitizePendingFinalDeliveryText as o, normalizePendingFinalDeliveryPayloads as r, PENDING_FINAL_DELIVERY_CLEAR_PATCH as t };
