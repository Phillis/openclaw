import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { p as stringifyRouteThreadId } from "./channel-route-BRTlwR_x.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
//#region src/infra/outbound/best-effort-delivery.ts
/** Normalizes an optional best-effort destination into a deliver/no-deliver decision. */
function resolveExternalBestEffortDeliveryTarget(params) {
	const normalizedChannel = normalizeMessageChannel(params.channel);
	const channel = normalizedChannel && isDeliverableMessageChannel(normalizedChannel) ? normalizedChannel : void 0;
	const to = normalizeOptionalString(params.to);
	const deliver = Boolean(channel && to);
	return {
		deliver,
		channel: deliver ? channel : void 0,
		to: deliver ? to : void 0,
		accountId: deliver ? normalizeOptionalString(params.accountId) : void 0,
		threadId: deliver && params.threadId != null && params.threadId !== "" ? stringifyRouteThreadId(params.threadId) : void 0
	};
}
/** Detects best-effort sends that should stay session-only on the internal channel. */
function shouldDowngradeDeliveryToSessionOnly(params) {
	return params.wantsDelivery && params.bestEffortDeliver && params.resolvedChannel === "webchat";
}
//#endregion
export { shouldDowngradeDeliveryToSessionOnly as n, resolveExternalBestEffortDeliveryTarget as t };
