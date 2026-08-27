import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { f as stringifyRouteThreadId } from "./channel-route-BK4VTSuz.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import { d as sessionDeliveryOrigin, f as sessionDeliveryRoute, n as deliveryContextFromSession } from "./delivery-context.shared-azPdmUls.js";
import "./message-channel-BZwx7FCw.js";
//#region src/auto-reply/reply/effective-reply-route.ts
/** Resolves the effective reply route from current context and persisted session route. */
/** Returns true for synthetic providers that should not define a user channel route. */
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
function isSessionsSendInterSessionHandoff(inputProvenance) {
	return inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool?.toLowerCase() === "sessions_send";
}
function resolveTrustedInheritedThreadId(entry) {
	const deliveryThreadId = deliveryContextFromSession(entry)?.threadId;
	if (deliveryThreadId == null) return;
	const routeThread = sessionDeliveryRoute(entry)?.thread;
	if (routeThread?.id != null && (routeThread.source === "explicit" || routeThread.source === "target" || routeThread.source === "turn") && stringifyRouteThreadId(routeThread.id) === stringifyRouteThreadId(deliveryThreadId)) return deliveryThreadId;
}
/** Resolves current, inherited, or persisted reply route for a session turn. */
function resolveEffectiveReplyRoute(params) {
	const currentSurface = normalizeMessageChannel(params.ctx.Provider) ?? normalizeMessageChannel(params.ctx.Surface) ?? normalizeMessageChannel(params.ctx.OriginatingChannel);
	const persistedDeliveryContext = deliveryContextFromSession(params.entry);
	const persistedRoute = sessionDeliveryRoute(params.entry);
	const persistedOrigin = sessionDeliveryOrigin(params.entry);
	const persistedDeliveryChannel = normalizeMessageChannel(persistedDeliveryContext?.channel);
	const liveChatType = normalizeChatType(params.ctx.ChatType);
	const persistedChatType = persistedRoute?.target?.chatType ?? params.entry?.chatType ?? normalizeChatType(persistedOrigin?.chatType);
	if (isSessionsSendInterSessionHandoff(params.ctx.InputProvenance) && currentSurface === "webchat" && persistedDeliveryChannel && persistedDeliveryChannel !== "webchat" && persistedDeliveryContext?.to) {
		const inheritedThreadId = resolveTrustedInheritedThreadId(params.entry);
		return {
			channel: persistedDeliveryChannel,
			to: persistedDeliveryContext.to,
			accountId: persistedDeliveryContext.accountId,
			...inheritedThreadId !== void 0 ? { threadId: inheritedThreadId } : {},
			...persistedChatType ? { chatType: persistedChatType } : {},
			inheritedExternalRoute: true
		};
	}
	if (!isSystemEventProvider(params.ctx.Provider)) return {
		channel: params.ctx.OriginatingChannel,
		to: params.ctx.OriginatingTo,
		accountId: params.ctx.AccountId,
		...liveChatType ? { chatType: liveChatType } : {}
	};
	const persistedChannel = persistedDeliveryContext?.channel;
	const liveChannel = params.ctx.OriginatingChannel;
	const canInheritPersistedTuple = !liveChannel || normalizeMessageChannel(liveChannel) === normalizeMessageChannel(persistedChannel);
	const chatType = liveChatType ?? (canInheritPersistedTuple ? persistedChatType : void 0);
	return {
		channel: liveChannel ?? persistedChannel,
		to: params.ctx.OriginatingTo ?? (canInheritPersistedTuple ? persistedDeliveryContext?.to : void 0),
		accountId: params.ctx.AccountId ?? (canInheritPersistedTuple ? persistedDeliveryContext?.accountId : void 0),
		...chatType ? { chatType } : {}
	};
}
//#endregion
export { resolveEffectiveReplyRoute as n, isSystemEventProvider as t };
