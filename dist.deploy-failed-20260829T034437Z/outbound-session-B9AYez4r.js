import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { S as updateSessionLastRoute } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { o as resolveAgentRoute } from "./resolve-route-CaHBZG2x.js";
import "./inbound.runtime-B7loqWZu.js";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-DbIvcY5J.js";
//#region src/infra/outbound/outbound-session.ts
function resolveOutboundChannelPlugin(channel) {
	return getChannelPlugin(channel);
}
function rebaseOutboundSessionRoute(route, baseSessionKey) {
	if (route.sessionKey !== route.baseSessionKey && !route.sessionKey.startsWith(`${route.baseSessionKey}:`)) return null;
	return {
		...route,
		sessionKey: `${baseSessionKey}${route.sessionKey.slice(route.baseSessionKey.length)}`,
		baseSessionKey
	};
}
function stripProviderPrefix(raw, channel) {
	const trimmed = raw.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const prefix = `${normalizeLowercaseStringOrEmpty(channel)}:`;
	if (lower.startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	return trimmed;
}
function stripKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm|thread):/i, "").trim();
}
const FALLBACK_TARGET_KIND_PREFIXES = [
	{
		kind: "direct",
		pattern: /^(user:|dm:)/i
	},
	{
		kind: "channel",
		pattern: /^(channel:|conversation:|thread:)/i
	},
	{
		kind: "group",
		pattern: /^(group:|room:)/i
	}
];
function normalizeInferredPeerKind(value) {
	return value === "direct" || value === "group" || value === "channel" ? value : void 0;
}
function inferPeerKindFromPlugin(params) {
	for (const target of params.targets) {
		const inferred = normalizeInferredPeerKind(params.plugin?.messaging?.inferTargetChatType?.({ to: target }));
		if (inferred) return inferred;
	}
}
function inferPeerKindFromFallbackPrefixes(targets) {
	for (const target of targets) for (const fallback of FALLBACK_TARGET_KIND_PREFIXES) if (fallback.pattern.test(target)) return fallback.kind;
}
function inferPeerKindFromCapabilities(plugin) {
	const chatTypes = [];
	for (const chatType of plugin?.capabilities?.chatTypes ?? []) if ((chatType === "direct" || chatType === "group" || chatType === "channel") && !chatTypes.includes(chatType)) chatTypes.push(chatType);
	return chatTypes.length === 1 ? chatTypes[0] : void 0;
}
function inferPeerKind(params) {
	const resolvedKind = params.resolvedTarget?.kind;
	if (resolvedKind === "user") return "direct";
	if (resolvedKind === "channel") return "channel";
	if (resolvedKind === "group") {
		const chatTypes = (params.plugin ?? resolveOutboundChannelPlugin(params.channel))?.capabilities?.chatTypes ?? [];
		const supportsChannel = chatTypes.includes("channel");
		const supportsGroup = chatTypes.includes("group");
		if (supportsChannel && !supportsGroup) return "channel";
		return "group";
	}
	const plugin = params.plugin ?? resolveOutboundChannelPlugin(params.channel);
	const strippedTarget = stripProviderPrefix(params.target, params.channel).trim();
	const targets = uniqueStrings([params.target, strippedTarget].filter(Boolean));
	return inferPeerKindFromPlugin({
		plugin,
		targets
	}) ?? inferPeerKindFromFallbackPrefixes(targets) ?? inferPeerKindFromCapabilities(plugin) ?? "direct";
}
function resolveFallbackSession(params) {
	const trimmed = stripProviderPrefix(params.target, params.channel).trim();
	if (!trimmed) return null;
	const peerKind = inferPeerKind({
		channel: params.channel,
		plugin: params.plugin,
		target: params.target,
		resolvedTarget: params.resolvedTarget
	});
	if (!peerKind) return null;
	const peerId = stripKindPrefix(trimmed);
	if (!peerId) return null;
	const peer = {
		kind: peerKind,
		id: peerId
	};
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact: false,
		peer,
		chatType: peerKind === "direct" ? "direct" : peerKind === "channel" ? "channel" : "group",
		from: peerKind === "direct" ? `${params.channel}:${peerId}` : `${params.channel}:${peerKind}:${peerId}`,
		to: `${peerKind === "direct" ? "user" : "channel"}:${peerId}`
	};
}
/** Resolves the session route used to mirror outbound delivery into conversation state. */
async function resolveOutboundSessionRoute(params) {
	const target = params.target.trim();
	if (!target) return null;
	const nextParams = {
		...params,
		target
	};
	const resolver = (params.plugin ?? resolveOutboundChannelPlugin(params.channel))?.messaging?.resolveOutboundSessionRoute;
	const route = resolver ? await resolver(nextParams) : resolveFallbackSession(nextParams);
	if (!route || route.recipientSessionExact !== true) return route;
	const bindingRoute = resolveAgentRoute({
		cfg: params.cfg,
		channel: params.channel,
		defaultAgentId: params.agentId,
		accountId: params.accountId,
		peer: route.peer
	});
	const isDirect = route.peer.kind === "direct";
	const globalScope = isDirect ? params.cfg.session?.dmScope ?? "main" : params.cfg.session?.groupScope ?? "per-group";
	return (isDirect ? bindingRoute.dmScope : bindingRoute.groupScope) !== globalScope && normalizeAgentId(bindingRoute.agentId) === normalizeAgentId(params.agentId) ? rebaseOutboundSessionRoute(route, bindingRoute.sessionKey) : route;
}
async function persistOutboundSessionEntry(params) {
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: resolveAgentIdFromSessionKey(params.route.sessionKey) });
	const ctx = {
		From: params.route.from,
		To: params.route.to,
		SessionKey: params.route.sessionKey,
		AccountId: params.accountId ?? void 0,
		ChatType: params.route.chatType,
		Provider: params.channel,
		Surface: params.channel,
		MessageThreadId: params.route.threadId,
		OriginatingChannel: params.channel,
		OriginatingTo: params.route.to,
		NativeDirectUserId: params.route.peer.kind === "direct" ? params.route.peer.id : void 0,
		NativeChannelId: params.route.peer.kind === "direct" ? void 0 : params.route.peer.id
	};
	return await updateSessionLastRoute({
		storePath,
		sessionKey: params.route.sessionKey,
		createIfMissing: true,
		channel: params.channel,
		to: params.route.to,
		accountId: params.accountId ?? void 0,
		threadId: params.route.threadId,
		ctx,
		...params.assertCommitAllowed ? { assertCommitAllowed: params.assertCommitAllowed } : {}
	});
}
/** Persists best-effort session metadata for an outbound-only route. */
async function ensureOutboundSessionEntry(params) {
	try {
		await persistOutboundSessionEntry(params);
	} catch {}
}
/** Persists the route required to bind an exact conversation address to local context. */
async function bindOutboundSessionEntry(params) {
	if (!await persistOutboundSessionEntry(params)) throw new Error(`Failed to bind outbound session ${params.route.sessionKey}`);
}
//#endregion
export { ensureOutboundSessionEntry as n, resolveOutboundSessionRoute as r, bindOutboundSessionEntry as t };
