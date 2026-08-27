import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { d as normalizeModelCatalogProviderRows } from "./manifest-DFeZvDdx.js";
//#region src/model-catalog/manifest-planner.ts
function mergeRemoteModelWithTrustedTransport(remoteModel, trustedModel) {
	return {
		...remoteModel,
		...trustedModel?.baseUrl ? { baseUrl: trustedModel.baseUrl } : {},
		...trustedModel?.headers ? { headers: trustedModel.headers } : {}
	};
}
function planManifestModelCatalogRows(params) {
	const providerFilters = Boolean(params.providerFilter) || params.providerFilters !== void 0 ? new Set(normalizeUniqueStringEntries([...params.providerFilter !== void 0 ? [params.providerFilter] : [], ...params.providerFilters ?? []].map(normalizeProviderId))) : void 0;
	const entries = [];
	for (const plugin of params.registry.plugins) for (const entry of planManifestModelCatalogPluginEntries({
		plugin,
		providerFilters,
		mergeKeyFilter: params.mergeKeyFilter,
		remoteOverlay: params.remoteOverlay,
		resolveRemoteProvider: params.resolveRemoteProvider
	})) entries.push(entry);
	const rowCandidates = [];
	const seenRows = /* @__PURE__ */ new Map();
	const conflicts = /* @__PURE__ */ new Map();
	for (const entry of entries) for (const row of entry.rows) {
		const seen = seenRows.get(row.mergeKey);
		if (seen) {
			if (!conflicts.has(row.mergeKey)) conflicts.set(row.mergeKey, {
				mergeKey: row.mergeKey,
				ref: seen.row.ref,
				provider: seen.row.provider,
				modelId: seen.row.id,
				firstPluginId: seen.pluginId,
				secondPluginId: entry.pluginId
			});
			continue;
		}
		seenRows.set(row.mergeKey, {
			pluginId: entry.pluginId,
			row,
			discovery: entry.discovery
		});
		rowCandidates.push(row);
	}
	const conflictedMergeKeys = new Set(conflicts.keys());
	const rows = rowCandidates.filter((row) => {
		if (conflictedMergeKeys.has(row.mergeKey)) return false;
		const discovery = seenRows.get(row.mergeKey)?.discovery;
		if (params.selection === "static") return discovery === "static";
		return params.selection !== "supplemental" || discovery !== "runtime" || row.source === "runtime-refresh";
	});
	return {
		entries,
		conflicts: [...conflicts.values()],
		rows: rows.toSorted((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id))
	};
}
function planManifestModelCatalogPluginEntries(params) {
	const providers = params.plugin.modelCatalog?.providers;
	if (!providers) return [];
	const aliasesByTargetProvider = buildModelCatalogProviderAliasTargets(params.plugin);
	return Object.entries(providers).flatMap(([provider, providerCatalog]) => {
		const normalizedProvider = normalizeProviderId(provider);
		if (!normalizedProvider) return [];
		const providerAliases = aliasesByTargetProvider.get(normalizedProvider) ?? [];
		const plannedProviders = params.providerFilters ? normalizeUniqueStringEntries([normalizedProvider, ...providerAliases]).filter((candidateProvider) => params.providerFilters?.has(candidateProvider)) : [normalizedProvider];
		if (plannedProviders.length === 0) return [];
		const remoteProvider = params.resolveRemoteProvider ? params.resolveRemoteProvider(normalizedProvider) : params.remoteOverlay?.[normalizedProvider];
		return plannedProviders.flatMap((plannedProvider) => {
			const includesModel = (model) => !params.mergeKeyFilter || params.mergeKeyFilter.has(buildModelCatalogMergeKey(plannedProvider, model.id));
			const manifestModels = providerCatalog.models.filter(includesModel);
			const remoteModels = remoteProvider?.models.filter(includesModel) ?? [];
			const remoteModelIds = new Set(remoteModels.map((model) => model.id));
			const manifestModelsById = new Map(manifestModels.map((model) => [model.id, model]));
			const providerDefaults = remoteProvider ? {
				...providerCatalog,
				...remoteProvider,
				...providerCatalog.baseUrl ? { baseUrl: providerCatalog.baseUrl } : {},
				...providerCatalog.headers ? { headers: providerCatalog.headers } : {}
			} : providerCatalog;
			const manifestRows = normalizeModelCatalogProviderRows({
				provider: plannedProvider,
				providerCatalog: {
					...providerDefaults,
					models: manifestModels.filter((model) => !remoteModelIds.has(model.id))
				},
				source: "manifest"
			});
			const remoteRows = remoteProvider ? normalizeModelCatalogProviderRows({
				provider: plannedProvider,
				providerCatalog: {
					...providerDefaults,
					models: remoteModels.map((model) => mergeRemoteModelWithTrustedTransport(model, manifestModelsById.get(model.id)))
				},
				source: "runtime-refresh"
			}) : [];
			const rows = [...manifestRows, ...remoteRows].toSorted((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id));
			if (rows.length === 0) return [];
			return [{
				pluginId: params.plugin.id,
				provider: plannedProvider,
				discovery: params.plugin.modelCatalog?.discovery?.[normalizedProvider],
				rows: applyModelCatalogAliasOverrides({
					rows,
					alias: params.plugin.modelCatalog?.aliases?.[plannedProvider]
				})
			}];
		});
	});
}
function buildOwnedProviderSet(plugin) {
	return new Set(normalizeUniqueStringEntries((plugin.providers ?? []).map(normalizeProviderId)));
}
function buildModelCatalogProviderAliasTargets(plugin) {
	const ownedProviders = buildOwnedProviderSet(plugin);
	const aliasesByTargetProvider = /* @__PURE__ */ new Map();
	for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const aliasProvider = normalizeProviderId(rawAlias);
		const targetProvider = normalizeProviderId(alias.provider);
		if (!aliasProvider || !targetProvider || !ownedProviders.has(targetProvider)) continue;
		const aliases = aliasesByTargetProvider.get(targetProvider) ?? [];
		aliases.push(aliasProvider);
		aliasesByTargetProvider.set(targetProvider, aliases);
	}
	return aliasesByTargetProvider;
}
function buildModelCatalogProviderRefs(plugin) {
	const ownedProviders = buildOwnedProviderSet(plugin);
	const refs = new Set(ownedProviders);
	for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const aliasProvider = normalizeProviderId(rawAlias);
		const targetProvider = normalizeProviderId(alias.provider);
		if (aliasProvider && targetProvider && ownedProviders.has(targetProvider)) refs.add(aliasProvider);
	}
	return refs;
}
function applyModelCatalogAliasOverrides(params) {
	const alias = params.alias;
	if (!alias) return params.rows;
	return params.rows.map((row) => ({
		...row,
		...alias.api ? { api: alias.api } : {},
		...alias.baseUrl ? { baseUrl: alias.baseUrl } : {}
	}));
}
function planManifestModelCatalogSuppressions(params) {
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : void 0;
	const modelFilter = params.modelFilter ? normalizeLowercaseStringOrEmpty(params.modelFilter) : void 0;
	const suppressions = [];
	for (const plugin of params.registry.plugins) {
		const providerRefs = buildModelCatalogProviderRefs(plugin);
		for (const suppression of plugin.modelCatalog?.suppressions ?? []) {
			const provider = normalizeProviderId(suppression.provider);
			const model = normalizeLowercaseStringOrEmpty(suppression.model);
			if (!provider || !model) continue;
			if (providerFilter && provider !== providerFilter) continue;
			if (modelFilter && model !== modelFilter) continue;
			if (!providerRefs.has(provider)) continue;
			suppressions.push({
				pluginId: plugin.id,
				provider,
				model,
				mergeKey: buildModelCatalogMergeKey(provider, model),
				...suppression.reason ? { reason: suppression.reason } : {},
				...suppression.when ? { when: suppression.when } : {}
			});
		}
	}
	return { suppressions: suppressions.toSorted((left, right) => left.provider.localeCompare(right.provider) || left.model.localeCompare(right.model) || left.pluginId.localeCompare(right.pluginId)) };
}
//#endregion
export { planManifestModelCatalogSuppressions as n, planManifestModelCatalogRows as t };
