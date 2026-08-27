import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-BbEZKGTS.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-BR2zb0j_.js";
import { n as resolveTrustedExternalProviderPolicySurface, t as resolveDirectBundledProviderPolicySurface } from "./provider-policy-surface-2YNdA_F4.js";
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
	const ownedProviders = new Set([...plugin.providers, ...plugin.cliBackends].map((provider) => normalizeProviderId(provider)).filter(Boolean));
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
	const normalizedProviderId = normalizeProviderId(providerId);
	if (!normalizedProviderId || !options.manifestRegistry) return null;
	for (const plugin of options.manifestRegistry.plugins.toSorted((left, right) => left.id.localeCompare(right.id))) if (pluginOwnsProviderPolicyRef(plugin, normalizedProviderId) && plugin.trustedOfficialInstall === true) {
		const surface = resolveTrustedExternalProviderPolicySurface({
			pluginId: plugin.id,
			pluginRoot: plugin.rootDir,
			trustedOfficialInstall: plugin.trustedOfficialInstall
		});
		if (surface) return surface;
	}
	return null;
}
//#endregion
export { resolveProviderPolicySurface as n, resolveBundledProviderPolicySurface as t };
