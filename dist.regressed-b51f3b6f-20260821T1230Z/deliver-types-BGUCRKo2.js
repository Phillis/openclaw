//#region src/infra/outbound/deliver-types.ts
/** Count platform sends without double-counting equivalent receipt representations. */
function countPhysicalOutboundSends(results) {
	return results.reduce((count, result) => {
		const receipt = result.receipt;
		if (!receipt) return count + 1;
		const receiptCount = receipt.parts.length > 0 ? receipt.parts.length : receipt.platformMessageIds.length;
		return count + Math.max(1, receiptCount);
	}, 0);
}
const PLATFORM_MESSAGE_NOT_DISPATCHED_ERROR_CODE = "OPENCLAW_PLATFORM_MESSAGE_NOT_DISPATCHED";
/**
* Provider assertion that no recipient-visible send began. Set retryable=false
* for permanent payload/policy rejection; never use after an ambiguous send.
*/
var PlatformMessageNotDispatchedError = class extends Error {
	constructor(message, options) {
		const retryable = options.retryable !== false;
		super(retryable ? message : message.trim() || "Platform rejected the message before dispatch", { cause: options.cause });
		this.code = PLATFORM_MESSAGE_NOT_DISPATCHED_ERROR_CODE;
		this.name = "PlatformMessageNotDispatchedError";
		this.retryable = retryable;
	}
};
function isPlatformMessageNotDispatchedError(error) {
	return error instanceof PlatformMessageNotDispatchedError;
}
function isPlatformMessageRejectedError(error) {
	return error instanceof PlatformMessageNotDispatchedError && !error.retryable;
}
/** Error carrying partial delivery results when an outbound send fails mid-batch. */
var OutboundDeliveryError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OutboundDeliveryError";
		this.results = [...options.results ?? []];
		this.payloadOutcomes = [...options.payloadOutcomes ?? []];
		this.sentBeforeError = this.results.length > 0;
		this.stage = options.stage ?? "unknown";
	}
};
/** Narrows unknown failures to outbound delivery errors with partial-send metadata. */
function isOutboundDeliveryError(error) {
	return error instanceof OutboundDeliveryError;
}
//#endregion
export { isPlatformMessageNotDispatchedError as a, isOutboundDeliveryError as i, PlatformMessageNotDispatchedError as n, isPlatformMessageRejectedError as o, countPhysicalOutboundSends as r, OutboundDeliveryError as t };
