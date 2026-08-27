import { d as normalizeOptionalThreadValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-W2ggd3eH.js";
import { a as normalizeChannelId } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
//#region src/channels/plugins/target-parsing-loaded.ts
/** Preserves the shipped `parseExplicitTarget` SDK contract until its deprecation window ends. */
function resolveExplicitDeliveryTargetCompat(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel);
	const rawTo = normalizeOptionalString(params.rawTarget);
	if (!channel || !rawTo) return null;
	const parsed = getLoadedChannelPluginForRead(normalizeChannelId(channel) ?? channel)?.messaging?.parseExplicitTarget?.({ raw: rawTo });
	return {
		channel,
		rawTo,
		to: parsed?.to ?? rawTo,
		threadId: normalizeOptionalThreadValue(parsed?.threadId ?? params.fallbackThreadId),
		chatType: parsed?.chatType
	};
}
//#endregion
export { resolveExplicitDeliveryTargetCompat as t };
