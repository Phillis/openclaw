import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as isPluginEnabled, t as getPluginRecord } from "./plugin-registry-snapshot-CiUpn9fa.js";
import { o as resolvePluginContributionOwners } from "./plugin-registry-contributions-Dt1rr-bF.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DppTp7ET.js";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-TmlV1LhK.js";
//#region src/commands/models/list.manifest-catalog.ts
/** Manifest-backed model catalog row loaders for `openclaw models list`. */
function planManifestCatalogRowsForPluginIds(params) {
	if (params.pluginIds && params.pluginIds.length === 0) return [];
	const pluginIdSet = params.pluginIds ? new Set(params.pluginIds) : void 0;
	return planEffectiveModelCatalogRows({
		registry: pluginIdSet ? {
			...params.registry,
			plugins: params.registry.plugins.filter((plugin) => pluginIdSet.has(plugin.id))
		} : params.registry,
		config: params.cfg,
		...params.providerFilter ? { providerFilter: params.providerFilter } : {},
		...params.selection ? { selection: params.selection } : {}
	}).rows;
}
function resolveConventionModelCatalogPluginIds(params) {
	const record = getPluginRecord({
		index: params.index,
		pluginId: params.providerFilter
	});
	if (!record || !isPluginEnabled({
		index: params.index,
		pluginId: record.pluginId,
		config: params.cfg
	})) return [];
	return [record.pluginId];
}
function resolveDeclaredModelCatalogPluginIds(params) {
	return resolvePluginContributionOwners({
		index: params.index,
		config: params.cfg,
		contribution: "modelCatalogProviders",
		matches: params.providerFilter
	});
}
function resolveModelCatalogPluginIdsForProvider(params) {
	return [.../* @__PURE__ */ new Set([...resolveConventionModelCatalogPluginIds({
		cfg: params.cfg,
		index: params.index,
		providerFilter: params.provider
	}), ...resolveDeclaredModelCatalogPluginIds({
		cfg: params.cfg,
		index: params.index,
		providerFilter: params.provider
	})])];
}
/**
* Resolves provider ownership and whether static manifest rows require runtime
* augmentation before they can be treated as complete catalog coverage.
*/
function resolveManifestCatalogCoverageForList(params) {
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env
	});
	const pluginsById = new Map(snapshot.manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	const ownedProviderIds = /* @__PURE__ */ new Set();
	const completeProviderIds = /* @__PURE__ */ new Set();
	for (const rawProvider of params.providerIds) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		const pluginIds = resolveModelCatalogPluginIdsForProvider({
			cfg: params.cfg,
			index: snapshot.index,
			provider
		});
		if (pluginIds.length === 0) continue;
		ownedProviderIds.add(provider);
		if (pluginIds.every((pluginId) => {
			const plugin = pluginsById.get(pluginId);
			if (!plugin) return false;
			if (plugin.modelCatalog?.runtimeAugment === true || plugin.origin !== "bundled") return false;
			const aliasTarget = plugin.modelCatalog?.aliases?.[provider]?.provider;
			const discoveryProvider = normalizeProviderId(aliasTarget ?? provider);
			return plugin.modelCatalog?.discovery?.[discoveryProvider] === "static";
		})) completeProviderIds.add(provider);
	}
	if (params.cfg.models?.mode === "replace") for (const provider of params.providerIds) completeProviderIds.add(normalizeProviderId(provider));
	return {
		ownedProviderIds,
		completeProviderIds
	};
}
function loadManifestCatalogRowsForListSelection(params) {
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : void 0;
	const snapshot = params.metadataSnapshot ?? loadManifestMetadataSnapshot({
		config: params.cfg,
		env: params.env ?? process.env
	});
	const index = snapshot.index;
	if (!providerFilter) return planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry,
		...params.selection ? { selection: params.selection } : {}
	});
	const conventionRows = planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry,
		pluginIds: resolveConventionModelCatalogPluginIds({
			cfg: params.cfg,
			index,
			providerFilter
		}),
		providerFilter,
		...params.selection ? { selection: params.selection } : {}
	});
	if (conventionRows.length > 0) return conventionRows;
	return planManifestCatalogRowsForPluginIds({
		cfg: params.cfg,
		registry: snapshot.manifestRegistry,
		pluginIds: resolveDeclaredModelCatalogPluginIds({
			cfg: params.cfg,
			index,
			providerFilter
		}),
		providerFilter,
		...params.selection ? { selection: params.selection } : {}
	});
}
/** Loads manifest catalog rows without importing provider runtimes. */
function loadManifestCatalogRowsForList(params) {
	return loadManifestCatalogRowsForListSelection(params);
}
/** Loads authoritative static manifest catalog rows for model-list output. */
function loadStaticManifestCatalogRowsForList(params) {
	return loadManifestCatalogRowsForListSelection({
		...params,
		selection: "static"
	});
}
//#endregion
export { loadStaticManifestCatalogRowsForList as n, resolveManifestCatalogCoverageForList as r, loadManifestCatalogRowsForList as t };
