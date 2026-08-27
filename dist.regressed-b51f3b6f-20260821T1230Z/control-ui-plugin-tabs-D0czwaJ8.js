import { g as getActivePluginSessionExtensionRegistry } from "./runtime-g0R28Sy0.js";
import { a as READ_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-DRTuNy7j.js";
import { m as resolveControlUiPluginTabPathname } from "./control-ui-contract-eurzifU_.js";
import { a as resolvePluginRoutePathContext, t as findMatchingPluginHttpRoutes } from "./route-match-Vz3WZJuX.js";
//#region src/gateway/control-ui-plugin-tabs.ts
function findControlUiTabGatewayRoute(registry, tab) {
	if (!tab.path) return;
	const routePath = resolveControlUiPluginTabPathname(tab.path);
	if (!routePath) return;
	const route = findMatchingPluginHttpRoutes(registry, resolvePluginRoutePathContext(routePath)).find((candidate) => candidate.auth === "gateway");
	if (!route) return;
	return route.pluginId === tab.pluginId ? route : null;
}
/** Pure projection of tab descriptors visible to the presented scopes. */
function projectControlUiPluginTabs(entries, scopes) {
	const tabs = [];
	for (const entry of entries) {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "tab") continue;
		if (!(descriptor.requiredScopes ?? []).every((scope) => authorizeOperatorScopesForRequiredScope(scope, scopes).allowed)) continue;
		tabs.push({
			pluginId: entry.pluginId,
			id: descriptor.id,
			label: descriptor.label,
			description: descriptor.description,
			icon: descriptor.icon,
			path: descriptor.path,
			group: descriptor.group,
			order: descriptor.order
		});
	}
	return tabs.toSorted((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.label.localeCompare(right.label) || left.id.localeCompare(right.id));
}
/** Lists active plugins' tab descriptors visible to the presented scopes. */
function listControlUiPluginTabs(scopes, opts = {}) {
	const registry = getActivePluginSessionExtensionRegistry();
	return projectControlUiPluginTabs(registry?.controlUiDescriptors ?? [], scopes).flatMap((tab) => {
		const route = registry ? findControlUiTabGatewayRoute(registry, tab) : void 0;
		if (route === null) return [];
		return route && opts.requireGatewayAuthGrant !== false ? [{
			...tab,
			requiresGatewayAuth: true
		}] : [tab];
	});
}
/** Lists active plugins' trusted widget kinds visible to the presented scopes. */
function listControlUiPluginWidgetKinds(scopes) {
	return (getActivePluginSessionExtensionRegistry()?.controlUiDescriptors ?? []).flatMap((entry) => {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "widget") return [];
		return (descriptor.requiredScopes ?? []).every((scope) => authorizeOperatorScopesForRequiredScope(scope, scopes).allowed) ? [{
			pluginId: entry.pluginId,
			kind: `${entry.pluginId}:${descriptor.id}`,
			label: descriptor.label
		}] : [];
	}).toSorted((left, right) => left.label.localeCompare(right.label) || left.kind.localeCompare(right.kind));
}
/** Builds least-privilege grants only for visible tabs backed by same-plugin gateway routes. */
function listControlUiPluginTabAuthGrants(callerScopes) {
	const registry = getActivePluginSessionExtensionRegistry();
	if (!registry || !authorizeOperatorScopesForRequiredScope("operator.read", callerScopes).allowed) return [];
	const grants = /* @__PURE__ */ new Map();
	for (const tab of projectControlUiPluginTabs(registry.controlUiDescriptors ?? [], callerScopes)) {
		if (!tab.path) continue;
		const route = findControlUiTabGatewayRoute(registry, tab);
		if (!route) continue;
		const key = `${tab.pluginId}\n${route.path}`;
		const existing = grants.get(key);
		if (existing) {
			if (existing.match === "exact" && route.match === "prefix") grants.set(key, {
				...existing,
				match: "prefix"
			});
			continue;
		}
		grants.set(key, {
			pluginId: tab.pluginId,
			path: route.path,
			match: route.match,
			scopes: [READ_SCOPE]
		});
	}
	return [...grants.values()];
}
//#endregion
export { listControlUiPluginTabs as n, listControlUiPluginWidgetKinds as r, listControlUiPluginTabAuthGrants as t };
