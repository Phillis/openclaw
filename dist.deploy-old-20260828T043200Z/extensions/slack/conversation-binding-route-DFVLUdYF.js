import { a as parseSlackTarget } from "./target-parsing-BnMD2ZqZ.js";
import "./targets-Cx5W_n3W.js";
import { resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-runtime";
//#region extensions/slack/src/account-reply-mode.ts
function normalizeSlackChatType(raw) {
	const value = raw?.trim().toLowerCase();
	if (!value) return;
	if (value === "direct" || value === "dm") return "direct";
	if (value === "group" || value === "channel") return value;
}
function resolveSlackReplyToMode(account, chatType) {
	const normalized = normalizeSlackChatType(chatType ?? void 0);
	if (normalized && account.replyToModeByChatType?.[normalized] !== void 0) return account.replyToModeByChatType[normalized] ?? "off";
	return account.replyToMode ?? "off";
}
//#endregion
//#region extensions/slack/src/conversation-binding-route.ts
const slackRouteBindingConfigCache = /* @__PURE__ */ new WeakMap();
function slackTargetDefaultKindForPeer(kind) {
	return kind === "direct" ? "user" : "channel";
}
function slackTargetKindMatchesPeer(peerKind, targetKind) {
	if (targetKind === "user") return peerKind === "direct";
	return peerKind === "channel" || peerKind === "group";
}
function normalizeSlackRouteBindingPeer(peer) {
	const rawId = peer.id.trim();
	if (!rawId || rawId === "*") return peer;
	const target = (() => {
		try {
			return parseSlackTarget(rawId, { defaultKind: slackTargetDefaultKindForPeer(peer.kind) });
		} catch {
			return;
		}
	})();
	if (!target || !slackTargetKindMatchesPeer(peer.kind, target.kind)) return peer;
	const normalizedId = target.teamId ? `team:${target.teamId}:${target.kind}:${target.id}` : target.id;
	return normalizedId === peer.id ? peer : {
		...peer,
		id: normalizedId
	};
}
function normalizeSlackRouteBindingConfig(cfg) {
	const bindings = cfg.bindings;
	const cached = slackRouteBindingConfigCache.get(cfg);
	if (cached && cached.bindingsRef === bindings) return cached.normalizedCfg;
	if (!Array.isArray(bindings)) return cfg;
	let changed = false;
	const normalizedBindings = bindings.map((binding) => {
		if (binding.type === "acp" || binding.match.channel.trim().toLowerCase() !== "slack") return binding;
		const peer = binding.match.peer;
		if (!peer) return binding;
		const normalizedPeer = normalizeSlackRouteBindingPeer(peer);
		if (normalizedPeer === peer) return binding;
		changed = true;
		return {
			...binding,
			match: {
				...binding.match,
				peer: normalizedPeer
			}
		};
	});
	const normalizedCfg = changed ? {
		...cfg,
		bindings: normalizedBindings
	} : cfg;
	slackRouteBindingConfigCache.set(cfg, {
		bindingsRef: bindings,
		normalizedCfg
	});
	return normalizedCfg;
}
function resolveSlackConversationBindingRoute(params) {
	const boundThreadRoute = params.bindingsEnabled && params.runtimeBindingThreadId ? resolveRuntimeConversationBindingRoute({
		route: params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.runtimeBindingThreadId,
			parentConversationId: params.baseConversationId
		}
	}) : null;
	const runtimeRoute = !params.bindingsEnabled ? {
		bindingOwnerAvailable: true,
		route: params.route,
		bindingRecord: null,
		boundSessionKey: void 0
	} : boundThreadRoute?.boundSessionKey || boundThreadRoute?.bindingRecord ? boundThreadRoute : resolveRuntimeConversationBindingRoute({
		route: params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	});
	const configuredRoute = params.bindingsEnabled && !runtimeRoute.boundSessionKey && !runtimeRoute.bindingRecord ? resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route: params.route,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	}) : null;
	return {
		runtimeRoute,
		configuredRoute,
		route: runtimeRoute.boundSessionKey ? runtimeRoute.route : configuredRoute?.route ?? params.route
	};
}
//#endregion
export { resolveSlackConversationBindingRoute as n, resolveSlackReplyToMode as r, normalizeSlackRouteBindingConfig as t };
