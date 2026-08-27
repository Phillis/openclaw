import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { N as parseSessionThreadInfoFast } from "./agent-harness-session-key-BpWapmwX.js";
//#region src/auto-reply/reply/routed-delivery-thread.ts
/** Routed delivery thread classification and id resolution helpers. */
function isSlackDirectRoutedThreadTurn(ctx) {
	if (normalizeChatType(ctx.ChatType) !== "direct") return false;
	if (ctx.MessageThreadId == null && ctx.TransportThreadId == null) return false;
	return [
		ctx.Provider,
		ctx.Surface,
		ctx.OriginatingChannel
	].some((value) => normalizeOptionalString(value)?.toLowerCase() === "slack");
}
/** Prefers current inbound thread ids, falling back to persisted session thread metadata. */
function resolveRoutedDeliveryThreadId(params) {
	if (params.ctx.MessageThreadId != null) return params.ctx.MessageThreadId;
	if (params.ctx.TransportThreadId != null) return params.ctx.TransportThreadId;
	return parseSessionThreadInfoFast(params.sessionKey).threadId;
}
//#endregion
export { resolveRoutedDeliveryThreadId as n, isSlackDirectRoutedThreadTurn as t };
