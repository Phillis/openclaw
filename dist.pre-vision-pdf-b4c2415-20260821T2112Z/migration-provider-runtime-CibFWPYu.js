import { n as listBundledPluginMetadata } from "./bundled-plugin-metadata-CZCtCRPV.js";
import { n as loadPluginRegistryHandle } from "./loader-B4G6K_LK.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { t as withBundledPluginEnablementCompat } from "./bundled-compat-DA9iwXlO.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BGg0hzV1.js";
import { t as resolveManifestContractRuntimePluginResolution } from "./manifest-contract-runtime-Dw6bHK2u.js";
//#region src/plugins/migration-provider-runtime.ts
let standaloneMigrationRegistrySlot;
function migrationPluginIdsKey(pluginIds) {
	return JSON.stringify(pluginIds);
}
function findMigrationProviderById(entries, providerId) {
	return entries.find((entry) => entry.provider.id === providerId)?.provider;
}
function bindMigrationProviderToRegistry(provider, registry) {
	return {
		...provider,
		...provider.detect ? { detect: (ctx) => withPluginRuntimeRegistryScope(registry, () => provider.detect(ctx)) } : {},
		...provider.prepareApply ? { prepareApply: (ctx) => withPluginRuntimeRegistryScope(registry, () => provider.prepareApply(ctx)) } : {},
		plan: (ctx) => withPluginRuntimeRegistryScope(registry, () => provider.plan(ctx)),
		apply: (ctx, plan) => withPluginRuntimeRegistryScope(registry, () => provider.apply(ctx, plan))
	};
}
function resolveMigrationProviderRegistry(params) {
	const active = getLoadedRuntimePluginRegistry({ requiredPluginIds: params.pluginIds });
	if (active) return active;
	const standalone = standaloneMigrationRegistrySlot;
	return standalone && standalone.config === params.cfg && standalone.pluginIdsKey === migrationPluginIdsKey(params.pluginIds) ? standalone.registry : void 0;
}
function resolveMigrationProviderPluginResolution(params) {
	const resolution = resolveManifestContractRuntimePluginResolution({
		cfg: params.cfg,
		contract: "migrationProviders",
		...params.providerId ? { value: params.providerId } : {}
	});
	const pluginIds = new Set(resolution.pluginIds);
	const bundledCompatPluginIds = new Set(resolution.bundledCompatPluginIds);
	for (const plugin of listBundledPluginMetadata({ includeChannelConfigs: false })) {
		const providerIds = plugin.manifest.contracts?.migrationProviders ?? [];
		if (providerIds.length === 0 || params.providerId && !providerIds.includes(params.providerId)) continue;
		pluginIds.add(plugin.manifest.id);
		bundledCompatPluginIds.add(plugin.manifest.id);
	}
	return {
		pluginIds: [...pluginIds].toSorted((left, right) => left.localeCompare(right)),
		bundledCompatPluginIds: [...bundledCompatPluginIds].toSorted((left, right) => left.localeCompare(right))
	};
}
function mergeMigrationProviders(left, right) {
	const merged = /* @__PURE__ */ new Map();
	for (const entry of [...left, ...right]) if (!merged.has(entry.provider.id)) merged.set(entry.provider.id, entry.provider);
	return [...merged.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
function ensureStandaloneMigrationProviderRegistryLoaded(params = {}) {
	const resolution = resolveMigrationProviderPluginResolution(params);
	if (resolution.pluginIds.length === 0) return;
	const compatConfig = withBundledPluginEnablementCompat({
		config: params.cfg,
		pluginIds: resolution.bundledCompatPluginIds
	});
	const registry = loadPluginRegistryHandle({
		...compatConfig === void 0 ? {} : { config: compatConfig },
		onlyPluginIds: resolution.pluginIds,
		activate: false
	});
	standaloneMigrationRegistrySlot = registry ? {
		config: params.cfg,
		pluginIdsKey: migrationPluginIdsKey(resolution.pluginIds),
		registry
	} : void 0;
}
function resolvePluginMigrationProvider(params) {
	const activeProvider = findMigrationProviderById(getLoadedRuntimePluginRegistry()?.migrationProviders ?? [], params.providerId);
	if (activeProvider) return activeProvider;
	const pluginIds = resolveMigrationProviderPluginResolution({
		cfg: params.cfg,
		providerId: params.providerId
	}).pluginIds;
	if (pluginIds.length === 0) return;
	const registry = resolveMigrationProviderRegistry({
		cfg: params.cfg,
		pluginIds
	});
	const provider = findMigrationProviderById(registry?.migrationProviders ?? [], params.providerId);
	return provider && registry ? bindMigrationProviderToRegistry(provider, registry) : void 0;
}
function resolvePluginMigrationProviders(params = {}) {
	const activeProviders = getLoadedRuntimePluginRegistry()?.migrationProviders ?? [];
	const pluginIds = resolveMigrationProviderPluginResolution({ cfg: params.cfg }).pluginIds;
	if (pluginIds.length === 0) return mergeMigrationProviders(activeProviders, []);
	const registry = resolveMigrationProviderRegistry({
		cfg: params.cfg,
		pluginIds
	});
	return mergeMigrationProviders(activeProviders, registry ? registry.migrationProviders.map(({ provider }) => ({ provider: bindMigrationProviderToRegistry(provider, registry) })) : []);
}
//#endregion
export { resolvePluginMigrationProvider as n, resolvePluginMigrationProviders as r, ensureStandaloneMigrationProviderRegistryLoaded as t };
