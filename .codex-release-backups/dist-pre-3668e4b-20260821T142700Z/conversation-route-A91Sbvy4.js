import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { a as buildAgentMainSessionKey, g as sanitizeAgentId, h as resolveThreadSessionKeys } from "./session-key-D8GLfPr_.js";
import { r as logVerbose } from "./globals-DD_xHyf6.js";
import { a as resolveAgentRoute, n as deriveLastRoutePolicy, t as buildAgentSessionKey } from "./resolve-route-Dz19j5-0.js";
import "./runtime-env-dZQRmQRq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
import { n as resolveConfiguredBindingRoute, r as resolveRuntimeConversationBindingRoute } from "./binding-routing-Dz0csent.js";
import "./conversation-runtime-BPbOUaQV.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-DdRrFets.js";
import { i as buildTelegramGroupPeerId, o as buildTelegramParentPeer, w as shouldUseTelegramDmThreadSession } from "./helpers-C45a6bkW.js";
//#region extensions/telegram/src/dm-session-key.ts
function resolveTelegramDirectPeerId(params) {
	return (params.senderId == null ? "" : String(params.senderId).trim()) || String(params.chatId);
}
function resolveTelegramNamedAccountBaseSessionKey(defaultAccountId, params) {
	if (!(normalizeAccountId(params.route.accountId) !== normalizeAccountId(defaultAccountId) && params.route.matchedBy === "default") || params.isGroup) return params.route.sessionKey;
	return buildAgentSessionKey({
		agentId: params.route.agentId,
		channel: "telegram",
		accountId: params.route.accountId,
		peer: {
			kind: "direct",
			id: resolveTelegramDirectPeerId({
				chatId: params.chatId,
				senderId: params.senderId
			})
		},
		dmScope: "per-account-channel-peer",
		identityLinks: params.cfg.session?.identityLinks
	});
}
function resolveTelegramSecurityDmRoute(defaultAccountId, params) {
	if (params.principalId !== void 0) return { sessionKey: resolveTelegramNamedAccountBaseSessionKey(defaultAccountId, {
		...params,
		chatId: params.principalId,
		isGroup: false,
		senderId: params.principalId
	}) };
	if (normalizeAccountId(params.accountId) !== normalizeAccountId(defaultAccountId) && params.route.matchedBy === "default" || params.route.dmScope === "per-account-channel-peer") return { kind: "isolated" };
	return params.route.dmScope === "main" ? { sessionKey: params.route.sessionKey } : { kind: "core" };
}
//#endregion
//#region extensions/telegram/src/conversation-route.ts
function resolveTelegramConversationRoute(params) {
	const peerId = params.isGroup ? buildTelegramGroupPeerId(params.chatId, params.resolvedThreadId) : resolveTelegramDirectPeerId({
		chatId: params.chatId,
		senderId: params.senderId
	});
	const parentPeer = buildTelegramParentPeer({
		isGroup: params.isGroup,
		resolvedThreadId: params.resolvedThreadId,
		chatId: params.chatId
	});
	let route = resolveAgentRoute({
		cfg: params.cfg,
		channel: "telegram",
		accountId: params.accountId,
		peer: {
			kind: params.isGroup ? "group" : "direct",
			id: peerId
		},
		parentPeer
	});
	const rawTopicAgentId = params.topicAgentId?.trim();
	if (rawTopicAgentId) {
		const topicAgentId = sanitizeAgentId(rawTopicAgentId);
		const sessionKey = normalizeLowercaseStringOrEmpty(buildAgentSessionKey({
			agentId: topicAgentId,
			channel: "telegram",
			accountId: params.accountId,
			peer: {
				kind: params.isGroup ? "group" : "direct",
				id: peerId
			},
			dmScope: params.cfg.session?.dmScope,
			identityLinks: params.cfg.session?.identityLinks
		}));
		const mainSessionKey = normalizeLowercaseStringOrEmpty(buildAgentMainSessionKey({ agentId: topicAgentId }));
		route = {
			...route,
			agentId: topicAgentId,
			sessionKey,
			mainSessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey,
				mainSessionKey
			})
		};
		logVerbose(`telegram: topic route override: topic=${params.resolvedThreadId ?? params.replyThreadId} agent=${topicAgentId} sessionKey=${route.sessionKey}`);
	}
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId: peerId,
			parentConversationId: params.isGroup ? String(params.chatId) : void 0
		}
	});
	route = configuredRoute.route;
	let bindingMode = configuredRoute.bindingResolution ? {
		kind: "configured",
		binding: configuredRoute.bindingResolution,
		sessionKey: configuredRoute.boundSessionKey ?? route.sessionKey
	} : { kind: "none" };
	const runtimeBindingConversationId = params.replyThreadId != null ? `${params.chatId}:topic:${params.replyThreadId}` : String(params.chatId);
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId: runtimeBindingConversationId
		}
	});
	route = runtimeRoute.route;
	if (runtimeRoute.bindingRecord) {
		bindingMode = runtimeRoute.boundSessionKey ? {
			kind: "runtime-bound",
			sessionKey: runtimeRoute.boundSessionKey
		} : { kind: "plugin-owned-runtime" };
		logVerbose(runtimeRoute.boundSessionKey ? `telegram: routed via bound conversation ${runtimeBindingConversationId} -> ${runtimeRoute.boundSessionKey}` : `telegram: plugin-bound conversation ${runtimeBindingConversationId}`);
	}
	return {
		route,
		bindingMode
	};
}
function resolveTelegramConversationBaseSessionKey(params) {
	return resolveTelegramNamedAccountBaseSessionKey(resolveDefaultTelegramAccountId(params.cfg), params);
}
function resolveTelegramTargetSession(params) {
	const baseSessionKey = resolveTelegramConversationBaseSessionKey(params);
	return (shouldUseTelegramDmThreadSession({
		dmThreadId: params.dmThreadId,
		botHasTopicsEnabled: params.botHasTopicsEnabled
	}) && params.dmThreadId != null ? resolveThreadSessionKeys({
		baseSessionKey,
		threadId: `${params.chatId}:${params.dmThreadId}`
	}) : null)?.sessionKey ?? baseSessionKey;
}
//#endregion
export { resolveTelegramSecurityDmRoute as a, resolveTelegramDirectPeerId as i, resolveTelegramConversationRoute as n, resolveTelegramTargetSession as r, resolveTelegramConversationBaseSessionKey as t };
