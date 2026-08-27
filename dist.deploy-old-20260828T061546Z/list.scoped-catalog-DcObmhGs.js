import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./model-ref-shared-D4yx0hwT.js";
import { t as modelTransportRoutesMatch } from "./model-compat-catalog-BNBUeFnX.js";
import { t as modelCatalogRowToEntry } from "./model-catalog-entry-vto08Vpf.js";
import { n as loadStaticManifestCatalogRowsForList, r as resolveManifestCatalogCoverageForList, t as loadManifestCatalogRowsForList } from "./list.manifest-catalog-Cj-et3gB.js";
//#region src/commands/models/list.scoped-catalog.ts
/** Dependency-light model catalog snapshots for default model-list views. */
const persistedCatalogModuleLoader = createLazyImportLoader(() => import("./list.persisted-catalog-D41Dx98j.js"));
const preparedScopedCatalogModuleLoader = createLazyImportLoader(() => import("./prepared-model-runtime.scoped-catalog-sw9LK2vj.js"));
function selectProviderRows(rows, providerIds) {
	return rows.filter((row) => providerIds.has(normalizeProviderId(row.provider)));
}
function entryKey(entry) {
	return modelKey(normalizeProviderId(entry.provider), entry.id.trim().toLowerCase());
}
function routeKey(entry) {
	return `${entryKey(entry)}\0${entry.api ?? ""}\0${entry.baseUrl ?? ""}`;
}
function resolveConfiguredProviderCoverage(cfg, providerIds, ownedProviderIds) {
	const coveredProviders = /* @__PURE__ */ new Set();
	for (const [provider, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		const normalizedProvider = normalizeProviderId(provider);
		if (providerIds.has(normalizedProvider) && !ownedProviderIds.has(normalizedProvider) && (providerConfig.models ?? []).some((model) => providerConfig.api !== void 0 || model.api !== void 0)) coveredProviders.add(normalizedProvider);
	}
	return coveredProviders;
}
function enrichPersistedEntry(entry, manifestEntry) {
	if (!manifestEntry || !modelTransportRoutesMatch(manifestEntry, entry)) return entry;
	return {
		...manifestEntry,
		...entry,
		name: entry.name || manifestEntry.name,
		...entry.contextWindow === void 0 && manifestEntry.contextWindow !== void 0 ? { contextWindow: manifestEntry.contextWindow } : {},
		...entry.contextTokens === void 0 && manifestEntry.contextTokens !== void 0 ? { contextTokens: manifestEntry.contextTokens } : {},
		...entry.reasoning === void 0 && manifestEntry.reasoning !== void 0 ? { reasoning: manifestEntry.reasoning } : {},
		...entry.input === void 0 && manifestEntry.input !== void 0 ? { input: manifestEntry.input } : {}
	};
}
function mergeSnapshotEntries(snapshots) {
	const entries = /* @__PURE__ */ new Map();
	const staticEntries = /* @__PURE__ */ new Map();
	const routeVariants = /* @__PURE__ */ new Map();
	for (const snapshot of snapshots) {
		for (const entry of snapshot.entries) entries.set(entryKey(entry), entry);
		for (const entry of snapshot.staticEntries ?? []) staticEntries.set(entryKey(entry), entry);
		for (const entry of snapshot.routeVariants) routeVariants.set(routeKey(entry), entry);
	}
	return {
		entries: [...entries.values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id)),
		routeVariants: [...routeVariants.values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id) || (left.api ?? "").localeCompare(right.api ?? "") || (left.baseUrl ?? "").localeCompare(right.baseUrl ?? "")),
		staticEntries: [...staticEntries.values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || left.id.localeCompare(right.id))
	};
}
/** Builds an auth-scoped snapshot from manifest metadata already loaded by the command. */
async function loadScopedListModelCatalogSnapshot(params) {
	const providerIds = new Set(params.providerIds.map(normalizeProviderId).filter(Boolean));
	if (providerIds.size === 0) return {
		entries: [],
		routeVariants: [],
		staticEntries: []
	};
	const loaderParams = {
		cfg: params.cfg,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	};
	const manifestEntries = selectProviderRows(loadManifestCatalogRowsForList(loaderParams), providerIds).map(modelCatalogRowToEntry);
	const manifestByKey = new Map(manifestEntries.map((entry) => [entryKey(entry), entry]));
	const configuredKeys = new Set(params.configuredKeys.map((key) => key.trim().toLowerCase()));
	const manifestFallbackProviderIds = new Set((params.manifestFallbackProviderIds ?? []).map(normalizeProviderId).filter((provider) => providerIds.has(provider)));
	const staticEntries = selectProviderRows(loadStaticManifestCatalogRowsForList(loaderParams), providerIds).map(modelCatalogRowToEntry);
	const { loadPersistedListCatalogEntries } = await persistedCatalogModuleLoader.load();
	const persistedEntries = loadPersistedListCatalogEntries({
		agentDir: params.agentDir,
		providerIds,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	}).map((entry) => enrichPersistedEntry(entry, manifestByKey.get(entryKey(entry))));
	const { ownedProviderIds, completeProviderIds } = resolveManifestCatalogCoverageForList({
		cfg: params.cfg,
		providerIds,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	});
	const admittedEntries = /* @__PURE__ */ new Map();
	for (const entry of [...staticEntries, ...persistedEntries]) admittedEntries.set(entryKey(entry), entry);
	for (const entry of manifestEntries) if ((configuredKeys.has(entryKey(entry)) || manifestFallbackProviderIds.has(normalizeProviderId(entry.provider))) && !admittedEntries.has(entryKey(entry))) admittedEntries.set(entryKey(entry), entry);
	const admittedKeys = new Set(admittedEntries.keys());
	const routeVariants = [...persistedEntries];
	for (const entry of manifestEntries) if (admittedKeys.has(entryKey(entry))) routeVariants.push(entry);
	const lightweightSnapshot = {
		entries: [...admittedEntries.values()],
		routeVariants,
		staticEntries
	};
	const coveredProviders = /* @__PURE__ */ new Set([...completeProviderIds, ...resolveConfiguredProviderCoverage(params.cfg, providerIds, ownedProviderIds)]);
	const uncoveredProviders = [...new Set((params.runtimeProviderIds ?? params.providerIds).map(normalizeProviderId).filter((provider) => providerIds.has(provider)))].filter((provider) => !coveredProviders.has(provider));
	if (uncoveredProviders.length === 0) return mergeSnapshotEntries([lightweightSnapshot]);
	const { prepareScopedReadOnlyLiveModelCatalog } = await preparedScopedCatalogModuleLoader.load();
	return mergeSnapshotEntries([lightweightSnapshot, await prepareScopedReadOnlyLiveModelCatalog({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		agentDir: params.agentDir,
		...params.inheritedAuthDir ? { inheritedAuthDir: params.inheritedAuthDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true
	}, uncoveredProviders)]);
}
//#endregion
export { loadScopedListModelCatalogSnapshot };
