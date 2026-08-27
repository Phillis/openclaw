import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { i as resolveMessageReceiptThreadId, n as listMessageReceiptPlatformIds } from "./receipt-BzekpwQi.js";
//#region src/channels/turn/delivery-result.ts
/** Builds a typed non-visible channel outcome without transport identity. */
function createSuppressedChannelDeliveryResult(params) {
	return {
		visibleReplySent: false,
		suppression: {
			reason: params.reason,
			...params.cancelReason ? { cancelReason: params.cancelReason } : {},
			...params.metadata ? { metadata: params.metadata } : {}
		}
	};
}
const CHANNEL_PARTIAL_DELIVERY_ERROR_CODE = "CHANNEL_PARTIAL_DELIVERY";
/** Preserves provider-visible delivery facts when a later native operation fails. */
function createChannelPartialDeliveryError(cause, deliveryResult) {
	return Object.assign(new Error(formatErrorMessage(cause), { cause }), {
		code: "CHANNEL_PARTIAL_DELIVERY",
		deliveryResult,
		sentBeforeError: true,
		visibleReplySent: true
	});
}
function isChannelPartialDeliveryError(error) {
	if (!error || typeof error !== "object" || Array.isArray(error)) return false;
	const candidate = error;
	return candidate.code === CHANNEL_PARTIAL_DELIVERY_ERROR_CODE && Boolean(candidate.deliveryResult && typeof candidate.deliveryResult === "object" && !Array.isArray(candidate.deliveryResult) && candidate.deliveryResult.visibleReplySent === true);
}
/** Converts a normalized message receipt into the delivery result shape used by channel turns. */
function createChannelDeliveryResultFromReceipt(params) {
	const messageIds = listMessageReceiptPlatformIds(params.receipt);
	const threadId = resolveMessageReceiptThreadId(params.receipt, params.threadId);
	return {
		...messageIds.length > 0 ? { messageIds } : {},
		receipt: params.receipt,
		...threadId ? { threadId } : {},
		...params.replyToId ? { replyToId: params.replyToId } : {},
		...params.visibleReplySent === void 0 ? {} : { visibleReplySent: params.visibleReplySent },
		...params.content === void 0 ? {} : { content: params.content },
		...params.deliveryIntent ? { deliveryIntent: params.deliveryIntent } : {}
	};
}
//#endregion
export { isChannelPartialDeliveryError as i, createChannelPartialDeliveryError as n, createSuppressedChannelDeliveryResult as r, createChannelDeliveryResultFromReceipt as t };
