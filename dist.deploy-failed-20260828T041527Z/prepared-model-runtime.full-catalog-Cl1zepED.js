import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { c as discoverModels, i as materializeRuntimeCapabilities, t as buildPreparedPluginModelCatalog } from "./prepared-model-runtime.plugin-generation-BRpVvyDa.js";
import { i as loadBundledProviderStaticCatalogContextModels } from "./model.static-catalog-BhbSYCbY.js";
import { o as toStaticCatalogEntry } from "./prepared-model-runtime.configured-Daaw4LxM.js";
//#region src/agents/prepared-model-runtime.full-catalog.ts
const fullModelCatalogSnapshots = /* @__PURE__ */ new WeakSet();
/** Builds the complete prepared catalog, including concrete runtime capabilities. */
async function prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource) {
	const { env, input, templateAuthStorage } = agentFacts;
	const { pluginMetadataSnapshot, preparedStaticProviderCatalog } = pluginGeneration;
	const templateModelRegistry = discoverModels(templateAuthStorage, input.agentDir, {
		config: input.config,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		pluginMetadataSnapshot,
		...catalogMode === "static" ? { normalizeModels: false } : {},
		...catalogSource ? {
			includePluginCatalogs: true,
			modelsJsonContents: catalogSource.modelsJsonContents,
			pluginCatalogs: catalogSource.pluginCatalogs
		} : {}
	});
	const discoveredCatalog = await buildPreparedPluginModelCatalog({
		agentFacts,
		catalogMode,
		modelRegistry: templateModelRegistry,
		pluginGeneration
	});
	const modelCatalog = {
		...discoveredCatalog,
		entries: materializeRuntimeCapabilities(discoveredCatalog.entries, agentFacts.runtimeCapabilityModels),
		routeVariants: materializeRuntimeCapabilities(discoveredCatalog.routeVariants, agentFacts.runtimeCapabilityModels)
	};
	const providerStaticModels = pluginGeneration.providerStaticModels ?? await loadBundledProviderStaticCatalogContextModels({
		cfg: input.config,
		env,
		metadataSnapshot: pluginMetadataSnapshot,
		...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	const staticModels = /* @__PURE__ */ new Map();
	for (const model of [...agentFacts.configuredRuntimeModels.map((configured) => configured.model), ...providerStaticModels]) {
		const modelKey = `${normalizeProviderId(model.provider)}\0${model.id.trim().toLowerCase()}`;
		if (!staticModels.has(modelKey)) staticModels.set(modelKey, model);
	}
	const staticEntries = materializeRuntimeCapabilities([...staticModels.values()].map(toStaticCatalogEntry), agentFacts.runtimeCapabilityModels);
	const providerOutcomes = catalogSource?.providerOutcomes ?? [];
	const completeModelCatalog = {
		...modelCatalog,
		staticEntries,
		...providerOutcomes.length > 0 ? { providerOutcomes } : {}
	};
	if (catalogMode === "live") fullModelCatalogSnapshots.add(completeModelCatalog);
	return {
		templateModelRegistry,
		modelCatalog: completeModelCatalog,
		configuredRuntimeModels: agentFacts.configuredRuntimeModels,
		inlineProviderModels: pluginGeneration.inlineProviderModels
	};
}
/** Reports whether a catalog came from the complete prepared-catalog build path. */
const isPreparedModelCatalogFull = (snapshot) => fullModelCatalogSnapshots.has(snapshot);
/** Restores process-local provenance after a complete catalog crosses a worker boundary. */
function markPreparedModelCatalogFull(snapshot) {
	fullModelCatalogSnapshots.add(snapshot);
	return snapshot;
}
//#endregion
export { markPreparedModelCatalogFull as n, prepareFullCatalogFacts as r, isPreparedModelCatalogFull as t };
