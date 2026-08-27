import { r as resolveBundledPluginsDir } from "./bundled-dir-BbEZKGTS.js";
import { n as loadBundledPluginPublicArtifactModuleSync, r as loadPluginPublicArtifactModuleSync } from "./public-surface-loader-DMySnkKb.js";
//#region src/plugins/provider-policy-surface.ts
const PROVIDER_POLICY_ARTIFACT_CANDIDATES = ["provider-policy-api.js"];
const bundledProviderPolicySurfaceByPluginId = /* @__PURE__ */ new Map();
const externalProviderPolicySurfaceByPluginId = /* @__PURE__ */ new Map();
const PROVIDER_POLICY_HOOK_KEYS = [
	"normalizeConfig",
	"applyConfigDefaults",
	"resolveConfigApiKey",
	"resolveThinkingProfile",
	"resolveModelRoutes",
	"normalizeModelCatalogId",
	"isResponseModelEquivalent"
];
function extractProviderPolicySurface(mod) {
	const surface = {};
	for (const key of PROVIDER_POLICY_HOOK_KEYS) {
		const hook = mod[key];
		if (typeof hook === "function") Object.assign(surface, { [key]: hook });
	}
	return Object.keys(surface).length > 0 ? surface : null;
}
function extractBundledProviderPolicySurface(mod) {
	const surface = extractProviderPolicySurface(mod) ?? {};
	if (typeof mod.projectConfiguredModelRow === "function") surface.projectConfiguredModelRow = mod.projectConfiguredModelRow;
	return Object.keys(surface).length > 0 ? surface : null;
}
function resolveCachedProviderPolicySurface(params) {
	const cached = params.cache.get(params.cacheKey);
	if (cached !== void 0) return cached;
	for (const artifactBasename of PROVIDER_POLICY_ARTIFACT_CANDIDATES) try {
		const mod = params.loadModule(artifactBasename);
		const surface = params.extractSurface(mod);
		if (surface) {
			params.cache.set(params.cacheKey, surface);
			return surface;
		}
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(params.missingSurfacePrefix)) continue;
		throw error;
	}
	params.cache.set(params.cacheKey, null);
	return null;
}
/** Loads policy hooks directly by canonical bundled plugin id. */
function resolveDirectBundledProviderPolicySurface(pluginId) {
	if (pluginId === "." || pluginId === ".." || pluginId.includes("/") || pluginId.includes("\\") || pluginId.includes(":")) return null;
	return resolveCachedProviderPolicySurface({
		cache: bundledProviderPolicySurfaceByPluginId,
		cacheKey: `${resolveBundledPluginsDir() ?? ""}\0${pluginId}`,
		loadModule: (artifactBasename) => loadBundledPluginPublicArtifactModuleSync({
			dirName: pluginId,
			artifactBasename
		}),
		missingSurfacePrefix: "Unable to resolve bundled plugin public surface ",
		extractSurface: extractBundledProviderPolicySurface
	});
}
/** Loads policy hooks from a host-verified official external plugin install. */
function resolveTrustedExternalProviderPolicySurface(params) {
	if (params.trustedOfficialInstall !== true) return null;
	return resolveCachedProviderPolicySurface({
		cache: externalProviderPolicySurfaceByPluginId,
		cacheKey: `${params.pluginRoot}\0${params.pluginId}`,
		loadModule: (artifactBasename) => loadPluginPublicArtifactModuleSync({
			pluginRoot: params.pluginRoot,
			artifactBasename
		}),
		missingSurfacePrefix: "Unable to resolve plugin public surface ",
		extractSurface: extractProviderPolicySurface
	});
}
//#endregion
export { resolveTrustedExternalProviderPolicySurface as n, resolveDirectBundledProviderPolicySurface as t };
