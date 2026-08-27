import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, g as resolveDefaultAgentId, r as listAgentEntries, t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { a as buildAgentMainSessionKey, g as sanitizeAgentId, o as buildAgentPeerSessionKey, t as DEFAULT_AGENT_ID } from "./session-key-Dbce_H9p.js";
import { t as logDebug } from "./logger-D4iLuGk3.js";
import { a as routeBindingScopeMatches, n as normalizeRouteBindingId, r as normalizeRouteBindingRoles } from "./binding-scope-DG1HvdoC.js";
import { i as shouldLogVerbose } from "./globals-GZNLg1ns.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { n as listBindings } from "./bindings-DQn4J54D.js";
//#region src/routing/peer-kind-match.ts
function peerKindMatches(bindingKind, scopeKind) {
	if (bindingKind === scopeKind) return true;
	return bindingKind === "group" && scopeKind === "channel" || bindingKind === "channel" && scopeKind === "group";
}
//#endregion
//#region src/routing/resolve-route.ts
function deriveLastRoutePolicy(params) {
	return params.sessionKey === params.mainSessionKey ? "main" : "session";
}
function resolveInboundLastRouteSessionKey(params) {
	return params.route.lastRoutePolicy === "main" ? params.route.mainSessionKey : params.sessionKey;
}
function buildAgentSessionKey(params) {
	const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
	const peer = params.peer;
	return buildAgentPeerSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey ?? "main",
		channel,
		accountId: params.accountId,
		peerKind: peer?.kind ?? "direct",
		peerId: peer ? normalizeRouteBindingId(peer.id) || "unknown" : null,
		dmScope: params.dmScope,
		groupScope: params.groupScope,
		identityLinks: params.identityLinks
	});
}
const agentLookupCacheByCfg = /* @__PURE__ */ new WeakMap();
function resolveAgentLookupCache(cfg) {
	const agentsRef = cfg.agents;
	const existing = agentLookupCacheByCfg.get(cfg);
	if (existing && existing.agentsRef === agentsRef) return existing;
	const byNormalizedId = /* @__PURE__ */ new Map();
	for (const agent of listAgentEntries(cfg)) {
		const rawId = agent.id?.trim();
		if (!rawId) continue;
		byNormalizedId.set(normalizeAgentId(rawId), sanitizeAgentId(rawId));
	}
	const next = {
		agentsRef,
		byNormalizedId,
		fallbackSoleAgentId: tryResolveLegacyCompatibilityAgentId(cfg)
	};
	agentLookupCacheByCfg.set(cfg, next);
	return next;
}
function pickFirstExistingAgentId(cfg, agentId) {
	const lookup = resolveAgentLookupCache(cfg);
	const trimmed = (agentId ?? "").trim();
	if (!trimmed) return sanitizeAgentId(lookup.fallbackSoleAgentId ?? resolveDefaultAgentId(cfg, {
		surface: "agent lookup",
		hint: "Pass an explicit agent id instead of relying on an implicit route."
	}));
	const normalized = normalizeAgentId(trimmed);
	const resolved = lookup.byNormalizedId.get(normalized);
	if (resolved) return resolved;
	if (normalized === "main") return DEFAULT_AGENT_ID;
	if (lookup.byNormalizedId.size === 0) return sanitizeAgentId(trimmed);
	throw new AgentSelectionRequiredError([...lookup.byNormalizedId.values()], {
		surface: "route binding",
		hint: `Update the binding agentId "${trimmed}" to a configured agent.`
	});
}
const evaluatedBindingsCacheByCfg = /* @__PURE__ */ new WeakMap();
const MAX_EVALUATED_BINDINGS_CACHE_KEYS = 2e3;
const resolvedRouteCacheByCfg = /* @__PURE__ */ new WeakMap();
const MAX_RESOLVED_ROUTE_CACHE_KEYS = 4e3;
function buildEvaluatedBindingsByChannel(cfg) {
	const byChannel = /* @__PURE__ */ new Map();
	let order = 0;
	for (const binding of listBindings(cfg)) {
		if (!binding || typeof binding !== "object") continue;
		const channel = normalizeLowercaseStringOrEmpty(binding.match?.channel);
		if (!channel) continue;
		const match = normalizeBindingMatch(binding.match);
		const evaluated = {
			binding,
			match,
			order
		};
		order += 1;
		let bucket = byChannel.get(channel);
		if (!bucket) {
			bucket = {
				byAccount: /* @__PURE__ */ new Map(),
				byAnyAccount: []
			};
			byChannel.set(channel, bucket);
		}
		if (match.accountPattern === "*") {
			bucket.byAnyAccount.push(evaluated);
			continue;
		}
		const accountKey = normalizeAccountId(match.accountPattern);
		const existing = bucket.byAccount.get(accountKey);
		if (existing) {
			existing.push(evaluated);
			continue;
		}
		bucket.byAccount.set(accountKey, [evaluated]);
	}
	return byChannel;
}
function mergeEvaluatedBindingsInSourceOrder(accountScoped, anyAccount) {
	if (accountScoped.length === 0) return anyAccount;
	if (anyAccount.length === 0) return accountScoped;
	const merged = [];
	let accountIdx = 0;
	let anyIdx = 0;
	while (accountIdx < accountScoped.length && anyIdx < anyAccount.length) {
		const accountBinding = accountScoped[accountIdx];
		const anyBinding = anyAccount[anyIdx];
		if ((accountBinding?.order ?? Number.MAX_SAFE_INTEGER) <= (anyBinding?.order ?? Number.MAX_SAFE_INTEGER)) {
			if (accountBinding) merged.push(accountBinding);
			accountIdx += 1;
			continue;
		}
		if (anyBinding) merged.push(anyBinding);
		anyIdx += 1;
	}
	if (accountIdx < accountScoped.length) merged.push(...accountScoped.slice(accountIdx));
	if (anyIdx < anyAccount.length) merged.push(...anyAccount.slice(anyIdx));
	return merged;
}
function pushToIndexMap(map, key, binding) {
	if (!key) return;
	const existing = map.get(key);
	if (existing) {
		existing.push(binding);
		return;
	}
	map.set(key, [binding]);
}
function peerLookupKeys(kind, id) {
	if (kind === "group") return [`group:${id}`, `channel:${id}`];
	if (kind === "channel") return [`channel:${id}`, `group:${id}`];
	return [`${kind}:${id}`];
}
function collectPeerIndexedBindings(index, peer) {
	if (!peer) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const key of peerLookupKeys(peer.kind, peer.id)) {
		const matches = index.byPeer.get(key);
		if (!matches) continue;
		for (const match of matches) {
			if (seen.has(match)) continue;
			seen.add(match);
			out.push(match);
		}
	}
	return out;
}
function buildEvaluatedBindingsIndex(bindings) {
	const byPeer = /* @__PURE__ */ new Map();
	const byPeerWildcard = [];
	const byGuildWithRoles = /* @__PURE__ */ new Map();
	const byGuild = /* @__PURE__ */ new Map();
	const byTeam = /* @__PURE__ */ new Map();
	const byAccount = [];
	const byChannel = [];
	for (const binding of bindings) {
		if (binding.match.peer.state === "valid") {
			for (const key of peerLookupKeys(binding.match.peer.kind, binding.match.peer.id)) pushToIndexMap(byPeer, key, binding);
			continue;
		}
		if (binding.match.peer.state === "wildcard-kind") {
			byPeerWildcard.push(binding);
			continue;
		}
		if (binding.match.guildId && binding.match.roles) {
			pushToIndexMap(byGuildWithRoles, binding.match.guildId, binding);
			continue;
		}
		if (binding.match.guildId && !binding.match.roles) {
			pushToIndexMap(byGuild, binding.match.guildId, binding);
			continue;
		}
		if (binding.match.teamId) {
			pushToIndexMap(byTeam, binding.match.teamId, binding);
			continue;
		}
		if (binding.match.accountPattern !== "*") {
			byAccount.push(binding);
			continue;
		}
		byChannel.push(binding);
	}
	return {
		byPeer,
		byPeerWildcard,
		byGuildWithRoles,
		byGuild,
		byTeam,
		byAccount,
		byChannel
	};
}
function getEvaluatedBindingsForChannelAccount(cfg, channel, accountId) {
	const bindingsRef = cfg.bindings;
	const existing = evaluatedBindingsCacheByCfg.get(cfg);
	const cache = existing && existing.bindingsRef === bindingsRef ? existing : {
		bindingsRef,
		byChannel: buildEvaluatedBindingsByChannel(cfg),
		byChannelAccount: /* @__PURE__ */ new Map(),
		byChannelAccountIndex: /* @__PURE__ */ new Map()
	};
	if (cache !== existing) evaluatedBindingsCacheByCfg.set(cfg, cache);
	const cacheKey = `${channel}\t${accountId}`;
	const hit = cache.byChannelAccount.get(cacheKey);
	if (hit) return hit;
	const channelBindings = cache.byChannel.get(channel);
	const evaluated = mergeEvaluatedBindingsInSourceOrder(channelBindings?.byAccount.get(accountId) ?? [], channelBindings?.byAnyAccount ?? []);
	cache.byChannelAccount.set(cacheKey, evaluated);
	cache.byChannelAccountIndex.set(cacheKey, buildEvaluatedBindingsIndex(evaluated));
	if (cache.byChannelAccount.size > MAX_EVALUATED_BINDINGS_CACHE_KEYS) {
		cache.byChannelAccount.clear();
		cache.byChannelAccountIndex.clear();
		cache.byChannelAccount.set(cacheKey, evaluated);
		cache.byChannelAccountIndex.set(cacheKey, buildEvaluatedBindingsIndex(evaluated));
	}
	return evaluated;
}
function getEvaluatedBindingIndexForChannelAccount(cfg, channel, accountId) {
	const bindings = getEvaluatedBindingsForChannelAccount(cfg, channel, accountId);
	const existing = evaluatedBindingsCacheByCfg.get(cfg);
	const cacheKey = `${channel}\t${accountId}`;
	const indexed = existing?.byChannelAccountIndex.get(cacheKey);
	if (indexed) return indexed;
	const built = buildEvaluatedBindingsIndex(bindings);
	existing?.byChannelAccountIndex.set(cacheKey, built);
	return built;
}
/** @internal Lists exact DM peers from the canonical channel/account binding index. */
function listExactDirectMessageBindingPeerIds(input) {
	const prefix = "direct:";
	return [...getEvaluatedBindingIndexForChannelAccount(input.cfg, normalizeLowercaseStringOrEmpty(input.channel), normalizeAccountId(input.accountId)).byPeer.keys()].flatMap((key) => key.startsWith(prefix) ? [key.slice(7)] : []);
}
function normalizePeerConstraint(peer) {
	if (!peer) return { state: "none" };
	const kind = normalizeChatType(peer.kind);
	const id = normalizeRouteBindingId(peer.id);
	if (!kind || !id) return { state: "invalid" };
	if (id === "*") return {
		state: "wildcard-kind",
		kind
	};
	return {
		state: "valid",
		kind,
		id
	};
}
function normalizeBindingMatch(match) {
	const rawRoles = match?.roles;
	return {
		accountPattern: (match?.accountId ?? "").trim(),
		peer: normalizePeerConstraint(match?.peer),
		guildId: normalizeRouteBindingId(match?.guildId) || null,
		teamId: normalizeRouteBindingId(match?.teamId) || null,
		roles: normalizeRouteBindingRoles(rawRoles)
	};
}
function resolveRouteCacheForConfig(cfg) {
	const existing = resolvedRouteCacheByCfg.get(cfg);
	if (existing && existing.bindingsRef === cfg.bindings && existing.agentsRef === cfg.agents && existing.sessionRef === cfg.session) return existing.byKey;
	const byKey = /* @__PURE__ */ new Map();
	resolvedRouteCacheByCfg.set(cfg, {
		bindingsRef: cfg.bindings,
		agentsRef: cfg.agents,
		sessionRef: cfg.session,
		byKey
	});
	return byKey;
}
function formatRouteCachePeer(peer) {
	if (!peer || !peer.id) return "-";
	return `${peer.kind}:${peer.id}`;
}
function buildResolvedRouteCacheKey(params) {
	return JSON.stringify([
		params.channel,
		params.defaultAgentId,
		params.accountId,
		formatRouteCachePeer(params.peer),
		formatRouteCachePeer(params.parentPeer),
		params.guildId ?? null,
		params.teamId ?? null,
		params.memberRoleIds.toSorted(),
		params.dmScope,
		params.groupScope
	]);
}
function matchesBindingScope(match, scope) {
	if (match.peer.state === "invalid") return false;
	if (match.peer.state === "valid") {
		if (!scope.peer || !peerKindMatches(match.peer.kind, scope.peer.kind) || scope.peer.id !== match.peer.id) return false;
	}
	if (match.peer.state === "wildcard-kind") {
		if (!scope.peer || !peerKindMatches(match.peer.kind, scope.peer.kind)) return false;
	}
	return routeBindingScopeMatches(match, scope);
}
function resolveAgentRoute(input) {
	const channel = normalizeLowercaseStringOrEmpty(input.channel);
	const defaultAgentId = normalizeLowercaseStringOrEmpty(input.defaultAgentId);
	const accountId = normalizeAccountId(input.accountId);
	const peer = input.peer ? {
		kind: normalizeChatType(input.peer.kind) ?? input.peer.kind,
		id: normalizeRouteBindingId(input.peer.id)
	} : null;
	const guildId = normalizeRouteBindingId(input.guildId);
	const teamId = normalizeRouteBindingId(input.teamId);
	const memberRoleIds = input.memberRoleIds ?? [];
	const memberRoleIdSet = new Set(memberRoleIds);
	const dmScope = input.dmScope ?? input.cfg.session?.dmScope ?? "main";
	const groupScope = input.groupScope ?? input.cfg.session?.groupScope ?? "per-group";
	const identityLinks = input.cfg.session?.identityLinks;
	const shouldLogDebug = shouldLogVerbose();
	const parentPeer = input.parentPeer ? {
		kind: normalizeChatType(input.parentPeer.kind) ?? input.parentPeer.kind,
		id: normalizeRouteBindingId(input.parentPeer.id)
	} : null;
	const routeCache = !shouldLogDebug && !identityLinks ? resolveRouteCacheForConfig(input.cfg) : null;
	const routeCacheKey = routeCache ? buildResolvedRouteCacheKey({
		channel,
		defaultAgentId,
		accountId,
		peer,
		parentPeer,
		guildId,
		teamId,
		memberRoleIds,
		dmScope,
		groupScope
	}) : "";
	if (routeCache && routeCacheKey) {
		const cachedRoute = routeCache.get(routeCacheKey);
		if (cachedRoute) return { ...cachedRoute };
	}
	const bindings = getEvaluatedBindingsForChannelAccount(input.cfg, channel, accountId);
	const bindingsIndex = getEvaluatedBindingIndexForChannelAccount(input.cfg, channel, accountId);
	const choose = (agentId, matchedBy, sessionOverride) => {
		const resolvedAgentId = pickFirstExistingAgentId(input.cfg, agentId);
		const effectiveDmScope = sessionOverride?.dmScope ?? dmScope;
		const effectiveGroupScope = sessionOverride?.groupScope ?? groupScope;
		const sessionKey = buildAgentSessionKey({
			agentId: resolvedAgentId,
			mainKey: input.cfg.session?.mainKey,
			channel,
			accountId,
			peer,
			dmScope: effectiveDmScope,
			groupScope: effectiveGroupScope,
			identityLinks
		});
		const mainSessionKey = normalizeLowercaseStringOrEmpty(buildAgentMainSessionKey({
			agentId: resolvedAgentId,
			mainKey: input.cfg.session?.mainKey
		}));
		const route = {
			agentId: resolvedAgentId,
			channel,
			accountId,
			dmScope: effectiveDmScope,
			groupScope: effectiveGroupScope,
			sessionKey,
			mainSessionKey,
			lastRoutePolicy: deriveLastRoutePolicy({
				sessionKey,
				mainSessionKey
			}),
			matchedBy
		};
		if (routeCache && routeCacheKey) {
			routeCache.set(routeCacheKey, route);
			if (routeCache.size > MAX_RESOLVED_ROUTE_CACHE_KEYS) {
				routeCache.clear();
				routeCache.set(routeCacheKey, route);
			}
		}
		return route;
	};
	const formatPeer = (value) => value?.kind && value?.id ? `${value.kind}:${value.id}` : "none";
	const formatNormalizedPeer = (value) => {
		if (value.state === "none") return "none";
		if (value.state === "invalid") return "invalid";
		if (value.state === "wildcard-kind") return `${value.kind}:*`;
		return `${value.kind}:${value.id}`;
	};
	if (shouldLogDebug) {
		logDebug(`[routing] resolveAgentRoute: channel=${channel} accountId=${accountId} peer=${formatPeer(peer)} guildId=${guildId || "none"} teamId=${teamId || "none"} bindings=${bindings.length}`);
		for (const entry of bindings) logDebug(`[routing] binding: agentId=${entry.binding.agentId} accountPattern=${entry.match.accountPattern || "default"} peer=${formatNormalizedPeer(entry.match.peer)} guildId=${entry.match.guildId ?? "none"} teamId=${entry.match.teamId ?? "none"} roles=${entry.match.roles?.length ?? 0}`);
	}
	const baseScope = {
		guildId,
		teamId,
		memberRoleIds: memberRoleIdSet
	};
	const tiers = [
		{
			matchedBy: "binding.peer",
			enabled: Boolean(peer),
			scopePeer: peer,
			candidates: collectPeerIndexedBindings(bindingsIndex, peer)
		},
		{
			matchedBy: "binding.peer.parent",
			enabled: Boolean(parentPeer && parentPeer.id),
			scopePeer: parentPeer && parentPeer.id ? parentPeer : null,
			candidates: collectPeerIndexedBindings(bindingsIndex, parentPeer)
		},
		{
			matchedBy: "binding.peer.wildcard",
			enabled: Boolean(peer),
			scopePeer: peer,
			candidates: bindingsIndex.byPeerWildcard
		},
		{
			matchedBy: "binding.guild+roles",
			enabled: Boolean(guildId && memberRoleIds.length > 0),
			scopePeer: peer,
			candidates: guildId ? bindingsIndex.byGuildWithRoles.get(guildId) ?? [] : []
		},
		{
			matchedBy: "binding.guild",
			enabled: Boolean(guildId),
			scopePeer: peer,
			candidates: guildId ? bindingsIndex.byGuild.get(guildId) ?? [] : []
		},
		{
			matchedBy: "binding.team",
			enabled: Boolean(teamId),
			scopePeer: peer,
			candidates: teamId ? bindingsIndex.byTeam.get(teamId) ?? [] : []
		},
		{
			matchedBy: "binding.account",
			enabled: true,
			scopePeer: peer,
			candidates: bindingsIndex.byAccount
		},
		{
			matchedBy: "binding.channel",
			enabled: true,
			scopePeer: peer,
			candidates: bindingsIndex.byChannel
		}
	];
	for (const tier of tiers) {
		if (!tier.enabled) continue;
		const matched = tier.candidates.find((candidate) => matchesBindingScope(candidate.match, {
			...baseScope,
			peer: tier.scopePeer
		}));
		if (matched) {
			if (shouldLogDebug) logDebug(`[routing] match: matchedBy=${tier.matchedBy} agentId=${matched.binding.agentId}`);
			return choose(matched.binding.agentId, tier.matchedBy, matched.binding.session);
		}
	}
	return choose((defaultAgentId || tryResolveLegacyCompatibilityAgentId(input.cfg)) ?? resolveDefaultAgentId(input.cfg, {
		surface: `${channel} account ${accountId} routing`,
		hint: `Add a channel-wide binding for ${channel}:${accountId} or configure a sole agent.`
	}), "default");
}
/** @internal Lists bindings selectable by at least one group/channel route under runtime precedence. */
function listEffectiveGroupRouteBindings(cfg) {
	const bindings = listBindings(cfg);
	const usedIds = /* @__PURE__ */ new Set();
	for (const binding of bindings) {
		usedIds.add(normalizeAccountId(binding.match.accountId));
		for (const value of [
			binding.match.peer?.id,
			binding.match.guildId,
			binding.match.teamId
		]) {
			const normalized = normalizeRouteBindingId(value);
			if (normalized) usedIds.add(normalized);
		}
	}
	let sentinel = "openclaw-audit-route";
	while (usedIds.has(sentinel)) sentinel += "-next";
	const markerForIndex = (index) => `audit-binding-${index}`;
	const probeCfg = {
		...cfg,
		agents: { entries: {} },
		bindings: bindings.map((binding, index) => ({
			...binding,
			agentId: markerForIndex(index)
		}))
	};
	return bindings.filter((binding, index) => {
		const match = normalizeBindingMatch(binding.match);
		if (match.peer.state === "invalid" || (match.peer.state === "valid" || match.peer.state === "wildcard-kind") && match.peer.kind === "direct") return false;
		const peer = match.peer.state === "valid" ? {
			kind: match.peer.kind,
			id: match.peer.id
		} : match.peer.state === "wildcard-kind" ? {
			kind: match.peer.kind,
			id: sentinel
		} : {
			kind: "group",
			id: sentinel
		};
		const accountId = match.accountPattern === "*" ? sentinel : match.accountPattern;
		return (match.roles?.map((role) => [role]) ?? [[]]).some((memberRoleIds) => resolveAgentRoute({
			cfg: probeCfg,
			channel: binding.match.channel,
			defaultAgentId: DEFAULT_AGENT_ID,
			accountId,
			peer,
			guildId: match.guildId,
			teamId: match.teamId,
			memberRoleIds
		}).agentId === markerForIndex(index));
	});
}
/** @internal Resolves fallback precedence for an unknown direct peer. */
function resolveUnknownDirectMessageRoute(input) {
	return resolveAgentRoute({
		...input,
		peer: {
			kind: "direct",
			id: ""
		}
	});
}
//#endregion
export { pickFirstExistingAgentId as a, resolveUnknownDirectMessageRoute as c, listExactDirectMessageBindingPeerIds as i, peerKindMatches as l, deriveLastRoutePolicy as n, resolveAgentRoute as o, listEffectiveGroupRouteBindings as r, resolveInboundLastRouteSessionKey as s, buildAgentSessionKey as t };
