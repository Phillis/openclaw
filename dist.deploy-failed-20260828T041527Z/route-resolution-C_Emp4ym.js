import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-Di3FvABa.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { n as deriveLastRoutePolicy, o as resolveAgentRoute } from "./resolve-route-CaHBZG2x.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import { t as parseDiscordTarget } from "./target-parsing-CcbK_-tL.js";
//#region extensions/discord/src/conversation-identity.ts
function normalizeDiscordTarget(raw, defaultKind) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	return parseDiscordTarget(trimmed, { defaultKind })?.normalized;
}
function buildDiscordConversationIdentity(kind, rawId) {
	const trimmed = normalizeOptionalString(rawId);
	return trimmed ? `${kind}:${trimmed}` : void 0;
}
function resolveDiscordConversationIdentity(params) {
	return params.isDirectMessage ? buildDiscordConversationIdentity("user", params.userId) : buildDiscordConversationIdentity("channel", params.channelId);
}
function resolveDiscordRuntimeBindingConversationId(params) {
	if (params.isDirectMessage && !params.isGroupDm) return buildDiscordConversationIdentity("user", params.userId) ?? params.channelId;
	return params.channelId;
}
function resolveDiscordCurrentConversationIdentity(params) {
	if (normalizeOptionalLowercaseString(params.chatType) === "direct") {
		const senderTarget = normalizeDiscordTarget(params.from, "user");
		if (senderTarget?.startsWith("user:")) return senderTarget;
	}
	for (const candidate of [
		params.originatingTo,
		params.commandTo,
		params.fallbackTo
	]) {
		const target = normalizeDiscordTarget(candidate, "channel");
		if (target) return target;
	}
}
//#endregion
//#region extensions/discord/src/monitor/route-resolution.ts
function buildDiscordRoutePeer(params) {
	return {
		kind: params.isGroupDm ? "group" : params.isDirectMessage ? "direct" : "channel",
		id: params.isDirectMessage && !params.isGroupDm ? params.directUserId?.trim() || params.conversationId : params.conversationId
	};
}
function buildDiscordConversationRouteContext(params) {
	return {
		ConversationRouteContextObserved: true,
		ConversationRoutePeerId: buildDiscordRoutePeer(params).id,
		NativeChannelId: params.conversationId,
		InboundAccessAuthorized: true,
		MessageThreadId: params.isThread ? params.conversationId : void 0,
		ThreadParentId: params.isThread ? params.parentConversationId : void 0
	};
}
function resolveDiscordConversationRoute(params) {
	return resolveAgentRoute({
		cfg: params.cfg,
		channel: "discord",
		accountId: params.accountId,
		guildId: params.guildId ?? void 0,
		memberRoleIds: params.memberRoleIds,
		peer: params.peer,
		parentPeer: params.parentConversationId ? {
			kind: "channel",
			id: params.parentConversationId
		} : void 0
	});
}
function resolveDiscordBoundConversationRoute(params) {
	return resolveDiscordEffectiveRoute({
		route: resolveDiscordConversationRoute({
			cfg: params.cfg,
			accountId: params.accountId,
			guildId: params.guildId,
			memberRoleIds: params.memberRoleIds,
			peer: buildDiscordRoutePeer({
				isDirectMessage: params.isDirectMessage,
				isGroupDm: params.isGroupDm,
				directUserId: params.directUserId,
				conversationId: params.conversationId
			}),
			parentConversationId: params.parentConversationId
		}),
		boundSessionKey: params.boundSessionKey,
		configuredRoute: params.configuredRoute,
		matchedBy: params.matchedBy
	});
}
function resolveDiscordEffectiveRoute(params) {
	const boundSessionKey = params.boundSessionKey?.trim();
	if (!boundSessionKey) return params.configuredRoute?.route ?? params.route;
	return {
		...params.route,
		sessionKey: boundSessionKey,
		agentId: resolveAgentIdFromSessionKey(boundSessionKey),
		lastRoutePolicy: deriveLastRoutePolicy({
			sessionKey: boundSessionKey,
			mainSessionKey: params.route.mainSessionKey
		}),
		...params.matchedBy ? { matchedBy: params.matchedBy } : {}
	};
}
function hasExplicitRuntimeBindingIntent(record) {
	if (record.targetKind === "subagent") return true;
	if (isAcpSessionKey(record.targetSessionKey) || isSubagentSessionKey(record.targetSessionKey)) return true;
	const metadata = record.metadata;
	if (!metadata || typeof metadata !== "object") return false;
	return typeof metadata.boundBy === "string" || typeof metadata.label === "string" || typeof metadata.threadName === "string" || metadata.pluginBindingOwner === "plugin";
}
function shouldIgnoreStaleDiscordRouteBinding(params) {
	const bindingRecord = params.bindingRecord;
	const boundSessionKey = bindingRecord?.targetSessionKey?.trim();
	if (!bindingRecord || !boundSessionKey || hasExplicitRuntimeBindingIntent(bindingRecord)) return false;
	const bound = parseAgentSessionKey(boundSessionKey);
	const routed = parseAgentSessionKey(params.route.sessionKey);
	if (!bound || !routed || bound.rest !== routed.rest) return false;
	return bound.agentId !== params.route.agentId;
}
//#endregion
export { resolveDiscordEffectiveRoute as a, resolveDiscordCurrentConversationIdentity as c, resolveDiscordConversationRoute as i, resolveDiscordRuntimeBindingConversationId as l, buildDiscordRoutePeer as n, shouldIgnoreStaleDiscordRouteBinding as o, resolveDiscordBoundConversationRoute as r, resolveDiscordConversationIdentity as s, buildDiscordConversationRouteContext as t };
