import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CsnnOL14.js";
import { i as resolveNormalizedRouteBindingMatch, t as normalizeRouteBindingChannelId } from "./binding-scope-CB8p6O_X.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
//#region src/routing/bindings.ts
function listBindings(cfg) {
	return listRouteBindings(cfg);
}
function listBoundAccountIds(cfg, channelId) {
	const normalizedChannel = normalizeRouteBindingChannelId(channelId);
	if (!normalizedChannel) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const binding of listBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding);
		if (!resolved || resolved.channelId !== normalizedChannel) continue;
		ids.add(resolved.accountId);
	}
	return Array.from(ids).toSorted((a, b) => a.localeCompare(b));
}
function resolveDefaultAgentBoundAccountId(cfg, channelId) {
	const normalizedChannel = normalizeRouteBindingChannelId(channelId);
	if (!normalizedChannel) return null;
	const soleAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	if (!soleAgentId) return null;
	const defaultAgentId = normalizeAgentId(soleAgentId);
	for (const binding of listBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding);
		if (!resolved || resolved.channelId !== normalizedChannel || resolved.agentId !== defaultAgentId) continue;
		return resolved.accountId;
	}
	return null;
}
function buildChannelAccountBindings(cfg) {
	const map = /* @__PURE__ */ new Map();
	for (const binding of listBindings(cfg)) {
		const resolved = resolveNormalizedRouteBindingMatch(binding);
		if (!resolved) continue;
		const byAgent = map.get(resolved.channelId) ?? /* @__PURE__ */ new Map();
		const list = byAgent.get(resolved.agentId) ?? [];
		if (!list.includes(resolved.accountId)) list.push(resolved.accountId);
		byAgent.set(resolved.agentId, list);
		map.set(resolved.channelId, byAgent);
	}
	return map;
}
function resolvePreferredAccountId(params) {
	if (params.boundAccounts.length > 0) return expectDefined(params.boundAccounts[0], "bound accounts entry at 0");
	return params.defaultAccountId;
}
//#endregion
export { resolvePreferredAccountId as a, resolveDefaultAgentBoundAccountId as i, listBindings as n, listBoundAccountIds as r, buildChannelAccountBindings as t };
