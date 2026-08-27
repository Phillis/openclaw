import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { x as requireActivePluginHttpRouteRegistry } from "./runtime-CTbL314X.js";
import { n as normalizePluginHttpPath, t as findPluginHttpRouteRegistrationConflicts } from "./http-route-overlap-BiEmB859.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/http-registry.ts
const pluginHttpRouteRegistryScope = new AsyncLocalStorage();
const noopUnregister = () => {};
function withPluginHttpRouteRegistry(registry, run) {
	return pluginHttpRouteRegistryScope.run(registry, run);
}
function registerPluginHttpRoute(params) {
	const registry = params.registry ?? pluginHttpRouteRegistryScope.getStore() ?? requireActivePluginHttpRouteRegistry();
	const routes = registry.httpRoutes ?? [];
	registry.httpRoutes = routes;
	const normalizedPath = normalizePluginHttpPath(params.path, params.fallbackPath);
	const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
	const rejectRegistration = (message) => {
		params.log?.(message);
		if (params.throwOnFailure) throw new Error(message);
		return noopUnregister;
	};
	if (!normalizedPath) return rejectRegistration(`plugin: webhook path missing${suffix}`);
	const routeMatch = params.match ?? "exact";
	const { authOverlap, canonicalMatches } = findPluginHttpRouteRegistrationConflicts(routes, {
		path: normalizedPath,
		match: routeMatch,
		auth: params.auth
	});
	if (authOverlap) return rejectRegistration(`plugin: route overlap denied at ${normalizedPath} (${routeMatch}, ${params.auth})${suffix}; overlaps ${authOverlap.path} (${authOverlap.match}, ${authOverlap.auth}) owned by ${authOverlap.pluginId ?? "unknown-plugin"} (${authOverlap.source ?? "unknown-source"})`);
	const existingIndex = canonicalMatches[0] ? routes.indexOf(canonicalMatches[0]) : -1;
	if (existingIndex >= 0) {
		const existing = routes[existingIndex];
		if (!existing) return rejectRegistration(`plugin: route conflict at ${normalizedPath} (${routeMatch})${suffix}`);
		const requestedOwner = normalizeOptionalString(params.pluginId);
		const requestedSource = normalizeOptionalString(params.source);
		const mismatchedOwner = canonicalMatches.find((route) => normalizeOptionalString(route.pluginId) !== requestedOwner || normalizeOptionalString(route.source) !== requestedSource);
		if (!params.replaceExisting && params.reuseExistingSameOwner) {
			if (requestedOwner !== void 0 && requestedSource !== void 0 && !mismatchedOwner) {
				params.log?.(`plugin: reusing existing webhook path ${normalizedPath} (${routeMatch}) (${requestedOwner}/${requestedSource})`);
				return noopUnregister;
			}
			const conflictingOwner = mismatchedOwner ?? existing;
			return rejectRegistration(`plugin: route reuse denied for ${normalizedPath} (${routeMatch})${suffix}; owned by ${conflictingOwner.pluginId ?? "unknown-plugin"} (${conflictingOwner.source ?? "unknown-source"})`);
		}
		if (!params.replaceExisting) return rejectRegistration(`plugin: route conflict at ${normalizedPath} (${routeMatch})${suffix}; owned by ${existing.pluginId ?? "unknown-plugin"} (${existing.source ?? "unknown-source"})`);
		const incompatibleReplacement = canonicalMatches.find((route) => normalizeOptionalString(route.pluginId) !== requestedOwner || requestedOwner !== void 0 && normalizeOptionalString(route.source) !== requestedSource);
		if (incompatibleReplacement) return rejectRegistration(`plugin: route replacement denied for ${normalizedPath} (${routeMatch})${suffix}; owned by ${incompatibleReplacement.pluginId ?? "unknown-plugin"} (${incompatibleReplacement.source ?? "unknown-source"})`);
		const pluginHint = params.pluginId ? ` (${params.pluginId})` : "";
		params.log?.(`plugin: replacing stale webhook path ${normalizedPath} (${routeMatch})${suffix}${pluginHint}`);
		for (const route of canonicalMatches.toReversed()) {
			const index = routes.indexOf(route);
			if (index >= 0) routes.splice(index, 1);
		}
	}
	const entry = {
		path: normalizedPath,
		handler: params.handler,
		auth: params.auth,
		match: routeMatch,
		...params.gatewayRuntimeScopeSurface ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface } : {},
		pluginId: params.pluginId,
		source: params.source
	};
	routes.push(entry);
	return () => {
		const index = routes.indexOf(entry);
		if (index >= 0) routes.splice(index, 1);
	};
}
//#endregion
export { withPluginHttpRouteRegistry as n, registerPluginHttpRoute as t };
