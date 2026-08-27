import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { a as buildAgentMainSessionKey, g as sanitizeAgentId, h as resolveThreadSessionKeys } from "./session-key-Dbce_H9p.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { n as deriveLastRoutePolicy, o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-CaHBZG2x.js";
import "./runtime-env-_YEv0JPQ.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import { n as resolveConfiguredBindingRoute, r as resolveRuntimeConversationBindingRoute } from "./binding-routing-C1a-oNmf.js";
import "./conversation-runtime-BCniVCys.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-3yDZGxKI.js";
import { t as buildTelegramConversationId } from "./topic-conversation-Cl4csGES.js";
import { o as buildTelegramParentPeer, w as shouldUseTelegramDmThreadSession } from "./helpers-BYdV1asc.js";
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
function buildTelegramConversationRouteContext(params) {
	return {
		ConversationRouteContextObserved: true,
		ConversationRoutePeerId: params.isGroup ? buildTelegramConversationId({
			chatId: params.chatId,
			thread: params.threadSpec
		}) : resolveTelegramDirectPeerId(params),
		ThreadParentId: buildTelegramParentPeer(params)?.id
	};
}
function resolveTelegramConversationRouteWithRuntimePolicy(params, touchRuntimeBinding) {
	const resolvedThreadId = params.threadSpec.id;
	const conversationId = buildTelegramConversationId({
		chatId: params.chatId,
		thread: params.threadSpec
	});
	const peerId = params.isGroup ? conversationId : resolveTelegramDirectPeerId({
		chatId: params.chatId,
		senderId: params.senderId
	});
	const parentPeer = buildTelegramParentPeer({
		isGroup: params.isGroup,
		resolvedThreadId,
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
			mainKey: params.cfg.session?.mainKey,
			channel: "telegram",
			accountId: params.accountId,
			peer: {
				kind: params.isGroup ? "group" : "direct",
				id: peerId
			},
			dmScope: route.dmScope,
			groupScope: route.groupScope,
			identityLinks: params.cfg.session?.identityLinks
		}));
		const mainSessionKey = normalizeLowercaseStringOrEmpty(buildAgentMainSessionKey({
			agentId: topicAgentId,
			mainKey: params.cfg.session?.mainKey
		}));
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
		logVerbose(`telegram: topic route override: topic=${resolvedThreadId} agent=${topicAgentId} sessionKey=${route.sessionKey}`);
	}
	const configuredRoute = resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route,
		conversation: {
			channel: "telegram",
			accountId: params.accountId,
			conversationId: params.isGroup ? conversationId : peerId,
			parentConversationId: conversationId !== String(params.chatId) || params.isGroup ? String(params.chatId) : void 0
		}
	});
	route = configuredRoute.route;
	let bindingMode = configuredRoute.bindingResolution ? {
		kind: "configured",
		binding: configuredRoute.bindingResolution,
		sessionKey: configuredRoute.boundSessionKey ?? route.sessionKey
	} : { kind: "none" };
	const runtimeBindingConversationId = conversationId;
	const runtimeRoute = resolveRuntimeConversationBindingRoute({
		route,
		touchBinding: touchRuntimeBinding,
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
		} : {
			kind: "plugin-owned-runtime",
			pluginId: runtimeRoute.pluginId ?? ""
		};
		logVerbose(runtimeRoute.boundSessionKey ? `telegram: routed via bound conversation ${runtimeBindingConversationId} -> ${runtimeRoute.boundSessionKey}` : `telegram: plugin-bound conversation ${runtimeBindingConversationId}`);
	}
	return {
		route,
		bindingMode,
		bindingOwnerAvailable: runtimeRoute.bindingOwnerAvailable ?? true
	};
}
function resolveTelegramConversationRoute(params) {
	return resolveTelegramConversationRouteWithRuntimePolicy(params, true);
}
/** Revalidates route ownership without extending runtime-binding liveness. */
function inspectTelegramConversationRoute(params) {
	return resolveTelegramConversationRouteWithRuntimePolicy(params, false);
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
export { resolveTelegramTargetSession as a, resolveTelegramConversationRoute as i, inspectTelegramConversationRoute as n, resolveTelegramDirectPeerId as o, resolveTelegramConversationBaseSessionKey as r, resolveTelegramSecurityDmRoute as s, buildTelegramConversationRouteContext as t };
