import { c as normalizeSortedUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { d as getActivePluginRegistry, m as getActivePluginRegistryWorkspaceDir } from "./runtime-DMlUh4Cg.js";
import { i as resolveCompatibleRuntimePluginRegistry } from "./loader-D0AfkRZe.js";
//#region src/plugins/active-runtime-registry.ts
function getActiveRuntimePluginRegistry() {
	return getActivePluginRegistry();
}
function isRuntimePluginRecordLoaded(plugin) {
	return plugin.status === "loaded" && (plugin.format === "bundle" || plugin.imported !== false);
}
/** Lists runtime-loaded plugin ids from an immutable/request-scoped registry handle. */
function listRuntimePluginIdsFromRegistry(registry) {
	return normalizeSortedUniqueStringEntries(registry.plugins.filter(isRuntimePluginRecordLoaded).map((plugin) => plugin.id));
}
function listLoadedRuntimePluginIds() {
	const registry = getActivePluginRegistry();
	return registry ? listRuntimePluginIdsFromRegistry(registry) : [];
}
function normalizeRequiredPluginIds(ids) {
	if (ids === void 0) return;
	return normalizeSortedUniqueStringEntries(ids);
}
function registryContainsRuntimePluginIds(registry, pluginIds) {
	if (pluginIds === void 0) return true;
	const present = /* @__PURE__ */ new Set();
	const loaded = /* @__PURE__ */ new Set();
	const pluginStatusById = /* @__PURE__ */ new Map();
	const pluginRuntimeLoadedById = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins ?? []) {
		present.add(plugin.id);
		pluginStatusById.set(plugin.id, plugin.status);
		pluginRuntimeLoadedById.set(plugin.id, isRuntimePluginRecordLoaded(plugin));
		if (plugin.status === void 0 || isRuntimePluginRecordLoaded(plugin)) loaded.add(plugin.id);
	}
	for (const [key, value] of Object.entries(registry)) {
		if (key === "diagnostics" || key === "channelSetups") continue;
		if (!Array.isArray(value)) continue;
		for (const entry of value) if (entry && typeof entry === "object" && "pluginId" in entry) {
			const pluginId = entry.pluginId;
			if (typeof pluginId === "string" && pluginId.length > 0) {
				present.add(pluginId);
				if (pluginStatusById.get(pluginId) === void 0 || pluginRuntimeLoadedById.get(pluginId) === true) loaded.add(pluginId);
			}
		}
	}
	if (pluginIds.length === 0) return present.size === 0;
	return pluginIds.every((pluginId) => loaded.has(pluginId));
}
function registryMatchesManifestPluginIds(registry, manifestPlugins, pluginIds) {
	if (!manifestPlugins) return false;
	const records = new Map(registry.plugins.map((plugin) => [plugin.id, plugin]));
	const manifests = new Map(manifestPlugins.map((plugin) => [plugin.id, plugin]));
	return pluginIds.every((pluginId) => {
		const record = records.get(pluginId);
		const manifest = manifests.get(pluginId);
		return Boolean(record && manifest && record.origin === manifest.origin && (record.origin === "bundled" || record.rootDir === manifest.rootDir && record.source === manifest.source));
	});
}
function getLoadedRuntimePluginRegistry(params = {}) {
	const requiredPluginIds = normalizeRequiredPluginIds(params.requiredPluginIds ?? params.loadOptions?.onlyPluginIds);
	if (params.loadOptions && requiredPluginIds?.length !== 0) {
		const compatible = resolveCompatibleRuntimePluginRegistry(params.loadOptions);
		if (compatible && registryContainsRuntimePluginIds(compatible, requiredPluginIds)) return compatible;
		if (requiredPluginIds === void 0) return;
	}
	const activeWorkspaceDir = getActivePluginRegistryWorkspaceDir();
	const requestedWorkspaceDir = params.workspaceDir ?? params.loadOptions?.workspaceDir;
	if (requestedWorkspaceDir !== void 0 && activeWorkspaceDir !== requestedWorkspaceDir) return;
	const registry = getActivePluginRegistry();
	if (!registry) return;
	if (!registryContainsRuntimePluginIds(registry, requiredPluginIds)) return;
	return registry;
}
//#endregion
export { registryContainsRuntimePluginIds as a, listRuntimePluginIdsFromRegistry as i, getLoadedRuntimePluginRegistry as n, registryMatchesManifestPluginIds as o, listLoadedRuntimePluginIds as r, getActiveRuntimePluginRegistry as t };
