import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { a as normalizePluginId } from "./config-state-Bgpvw0Q6.js";
import { t as readBundledDiscoveryMode } from "./bundled-discovery-state-Uo8vep5Q.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CZWL79I8.js";
import { a as loadBundledWebSearchProviderEntriesFromDir, c as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts, i as loadBundledWebFetchProviderEntriesFromDir, l as resolveBundledWebFetchResolutionConfig, m as resolveManifestDeclaredWebProviderCandidates, o as resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts, s as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, t as resolveBundledWebSearchResolutionConfig } from "./web-search-providers.shared-PIJuRcFE.js";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-D6FGI4tT.js";
import path from "node:path";
//#region src/plugins/web-provider-public-artifacts.ts
function filterAllowlistedBundledPluginIds(config, pluginIds) {
	if (readBundledDiscoveryMode() === "compat") return [...pluginIds];
	const allow = config?.plugins?.allow;
	if (!Array.isArray(allow) || allow.length === 0) return [...pluginIds];
	const allowedPluginIds = new Set(normalizeUniqueStringEntries(allow.map((pluginId) => normalizePluginId(pluginId))));
	return pluginIds.filter((pluginId) => allowedPluginIds.has(pluginId));
}
function resolveBundledCandidatePluginIds(params) {
	if (params.onlyPluginIds !== void 0) return {
		pluginIds: filterAllowlistedBundledPluginIds(params.config, [...new Set(params.onlyPluginIds)]).toSorted((left, right) => left.localeCompare(right)),
		...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
	};
	const resolvedConfig = params.contract === "webSearchProviders" ? resolveBundledWebSearchResolutionConfig(params).config : resolveBundledWebFetchResolutionConfig(params).config;
	const candidates = resolveManifestDeclaredWebProviderCandidates({
		contract: params.contract,
		configKey: params.configKey,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		origin: "bundled",
		manifestRecords: params.manifestRecords
	});
	return {
		pluginIds: filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? []),
		...candidates.manifestRecords ? { manifestRecords: candidates.manifestRecords } : {}
	};
}
function resolveBundledRuntimeCandidatePluginIds(params) {
	const resolvedConfig = resolveBundledWebFetchResolutionConfig(params).config;
	const candidates = resolveManifestDeclaredWebProviderCandidates({
		contract: "webFetchProviders",
		configKey: "webFetch",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		manifestRecords: params.manifestRecords
	});
	const pluginIds = filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? []);
	const recordsByPluginId = new Map((candidates.manifestRecords ?? []).filter((record) => pluginIds.includes(record.id)).map((record) => [record.id, record]));
	if (pluginIds.some((pluginId) => recordsByPluginId.get(pluginId)?.origin !== "bundled")) return null;
	const enabledPluginIds = new Set(resolveEnabledBundledManifestContractPlugins({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: pluginIds,
		contract: "webFetchProviders",
		manifestRecords: candidates.manifestRecords
	}).map((plugin) => plugin.id));
	return pluginIds.filter((pluginId) => enabledPluginIds.has(pluginId));
}
function resolveBundledWebProvidersFromPublicArtifacts(params) {
	const candidates = resolveBundledCandidatePluginIds({
		contract: params.contract,
		configKey: params.configKey,
		config: params.resolution.config,
		workspaceDir: params.resolution.workspaceDir,
		env: params.resolution.env,
		onlyPluginIds: params.resolution.onlyPluginIds,
		manifestRecords: params.resolution.manifestRecords
	});
	if (candidates.pluginIds.length === 0) return [];
	const explicitProviders = params.loadExplicit({ onlyPluginIds: candidates.pluginIds });
	if (explicitProviders) return explicitProviders;
	const allowedPluginIds = new Set(candidates.pluginIds);
	const recordsByPluginId = new Map((candidates.manifestRecords ?? params.resolution.manifestRecords ?? loadManifestMetadataSnapshot({
		config: params.resolution.config,
		workspaceDir: params.resolution.workspaceDir,
		env: params.resolution.env
	}).plugins).filter((record) => record.origin === "bundled" && allowedPluginIds.has(record.id)).map((record) => [record.id, record]));
	const providers = [];
	for (const pluginId of candidates.pluginIds) {
		const record = recordsByPluginId.get(pluginId);
		if (!record) return null;
		const loadedProviders = params.loadFromDir({
			dirName: path.basename(record.rootDir),
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function resolveBundledWebSearchProvidersFromPublicArtifacts(params) {
	return resolveBundledWebProvidersFromPublicArtifacts({
		contract: "webSearchProviders",
		configKey: "webSearch",
		resolution: params,
		loadExplicit: resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
		loadFromDir: loadBundledWebSearchProviderEntriesFromDir
	});
}
function resolveBundledWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledWebProvidersFromPublicArtifacts({
		contract: "webFetchProviders",
		configKey: "webFetch",
		resolution: params,
		loadExplicit: resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
		loadFromDir: loadBundledWebFetchProviderEntriesFromDir
	});
}
function resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts(params) {
	const pluginIds = resolveBundledRuntimeCandidatePluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		manifestRecords: params.manifestRecords
	});
	if (!pluginIds) return null;
	if (pluginIds.length === 0) return [];
	return resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts({ onlyPluginIds: pluginIds });
}
//#endregion
export { resolveBundledWebFetchProvidersFromPublicArtifacts as n, resolveBundledWebSearchProvidersFromPublicArtifacts as r, resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts as t };
