import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-DItVECdo.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-DRErrq38.js";
import { n as resolveTrustedExternalProviderPolicySurface, t as resolveDirectBundledProviderPolicySurface } from "./provider-policy-surface-D3wds4go.js";
import path from "node:path";
//#region src/plugins/provider-public-artifacts.ts
function resolveBundledProviderPolicyPlugin(providerId, options = {}) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!normalizedProviderId) return null;
	if (!resolveBundledPluginsDir()) return null;
	const registry = options.manifestRegistry ?? loadPluginManifestRegistryCore();
	for (const plugin of registry.plugins.toSorted((left, right) => left.id.localeCompare(right.id))) {
		if (plugin.origin !== "bundled") continue;
		if (pluginOwnsProviderPolicyRef(plugin, normalizedProviderId)) return plugin;
	}
	return null;
}
function pluginOwnsProviderPolicyRef(plugin, normalizedProviderId) {
	const ownedProviders = new Set([
		...plugin.providers,
		...plugin.cliBackends,
		...plugin.contracts?.embeddingProviders ?? []
	].map((provider) => normalizeProviderId(provider)).filter(Boolean));
	if (ownedProviders.has(normalizedProviderId)) return true;
	for (const [rawAlias, rawTarget] of Object.entries(plugin.providerAuthAliases ?? {})) {
		const alias = normalizeProviderId(rawAlias);
		const target = normalizeProviderId(rawTarget);
		if (alias === normalizedProviderId && ownedProviders.has(target)) return true;
	}
	return false;
}
/** Resolves provider policy hooks for a bundled provider or its owning plugin. */
function resolveBundledProviderPolicySurface(providerId, options = {}) {
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!normalizedProviderId) return null;
	const directSurface = resolveDirectBundledProviderPolicySurface(normalizedProviderId);
	if (directSurface) return directSurface;
	const ownerPlugin = resolveBundledProviderPolicyPlugin(normalizedProviderId, options);
	if (ownerPlugin) {
		const ownerSurface = resolveDirectBundledProviderPolicySurface(ownerPlugin.id);
		if (ownerSurface) return ownerSurface;
	}
	if (!ownerPlugin) return null;
	return resolveDirectBundledProviderPolicySurface(path.basename(ownerPlugin.rootDir));
}
/** Resolves provider policy hooks from bundled or trusted official plugin artifacts. */
function resolveProviderPolicySurface(providerId, options = {}) {
	const bundledSurface = resolveBundledProviderPolicySurface(providerId, options);
	if (bundledSurface) return bundledSurface;
	if (!normalizeProviderId(providerId) || !options.manifestRegistry) return null;
	return loadTrustedExternalProviderPolicyArtifacts(listTrustedExternalProviderPolicyOwners(providerId, options.manifestRegistry))?.surface ?? null;
}
/** Loads the first usable policy surface from caller-selected trusted owners. */
function loadTrustedExternalProviderPolicyArtifacts(owners) {
	for (const owner of owners) {
		const surface = resolveTrustedExternalProviderPolicySurface({
			pluginId: owner.id,
			pluginRoot: owner.rootDir,
			trustedOfficialInstall: owner.trustedOfficialInstall
		});
		if (surface) return {
			owner,
			surface
		};
	}
	const owner = owners[0];
	return owner ? {
		owner,
		surface: null
	} : null;
}
/** Lists trusted installed plugins that own a provider policy reference. */
function listTrustedExternalProviderPolicyOwners(providerId, manifestRegistry) {
	const normalizedProviderId = normalizeProviderId(providerId);
	return manifestRegistry.plugins.toSorted((left, right) => left.id.localeCompare(right.id)).filter((plugin) => plugin.trustedOfficialInstall === true && pluginOwnsProviderPolicyRef(plugin, normalizedProviderId));
}
//#endregion
export { resolveProviderPolicySurface as i, loadTrustedExternalProviderPolicyArtifacts as n, resolveBundledProviderPolicySurface as r, listTrustedExternalProviderPolicyOwners as t };
