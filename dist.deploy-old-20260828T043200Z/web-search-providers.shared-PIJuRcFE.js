import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as sortUniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as getCurrentPluginMetadataSnapshot, s as createPluginIdScopeSet, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Zllbp6of.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CZWL79I8.js";
import { t as resolveBundledCompatActivationInputs } from "./activation-context-uSIB1oKw.js";
import { n as sortPluginEntriesForAutoDetect, t as sortPluginEntriesById } from "./plugin-entry-order-DxrT0ucv.js";
//#region src/plugins/web-provider-resolution-shared.ts
function pluginManifestDeclaresProviderConfig(record, configKey, contract) {
	if ((record.contracts?.[contract]?.length ?? 0) > 0) return true;
	if (Object.keys(record.configUiHints ?? {}).some((key) => key === configKey || key.startsWith(`${configKey}.`))) return true;
	const properties = record.configSchema?.properties;
	return typeof properties === "object" && properties !== null && configKey in properties;
}
function loadInstalledWebProviderManifestRecords(params) {
	const records = params.manifestRecords ?? loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	}).plugins;
	const pluginIdSet = createPluginIdScopeSet(params.pluginIds);
	return pluginIdSet ? records.filter((plugin) => pluginIdSet.has(plugin.id)) : records;
}
/** Returns only plugin ids for manifest-declared web provider candidates. */
function resolveManifestDeclaredWebProviderCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidates(params).pluginIds;
}
/** Resolves manifest-declared web provider candidates without importing plugin runtime code. */
function resolveManifestDeclaredWebProviderCandidates(params) {
	const scopedPluginIds = normalizePluginIdScope(params.onlyPluginIds);
	if (scopedPluginIds?.length === 0) return { pluginIds: [] };
	const onlyPluginIdSet = createPluginIdScopeSet(scopedPluginIds);
	const manifestRecords = params.manifestRecords ?? loadInstalledWebProviderManifestRecords({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: scopedPluginIds
	});
	const ids = manifestRecords.filter((plugin) => (!params.origin || plugin.origin === params.origin) && (!params.sandboxed || plugin.origin === "bundled" || plugin.trustedOfficialInstall === true) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && pluginManifestDeclaresProviderConfig(plugin, params.configKey, params.contract)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	if (ids.length > 0) return {
		pluginIds: ids,
		manifestRecords
	};
	if (params.origin || params.sandboxed || scopedPluginIds !== void 0) return {
		pluginIds: [],
		manifestRecords
	};
	return {
		pluginIds: void 0,
		manifestRecords
	};
}
function resolveBundledWebProviderCompatPluginIds(params) {
	return loadInstalledWebProviderManifestRecords(params).filter((plugin) => plugin.origin === "bundled" && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Builds bundled-plugin activation config for provider families with legacy enablement defaults. */
function resolveBundledWebProviderResolutionConfig(params) {
	const currentSnapshot = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	let manifestRecords = params.manifestRecords ?? currentSnapshot?.plugins;
	const activation = resolveBundledCompatActivationInputs({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		applyAutoEnable: true,
		...manifestRecords ? { manifestRegistry: {
			plugins: [...manifestRecords],
			diagnostics: []
		} } : {},
		...currentSnapshot?.discovery ? { discovery: currentSnapshot.discovery } : {},
		resolveBundledPluginIds: (compatParams) => {
			manifestRecords ??= loadInstalledWebProviderManifestRecords({
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: params.env
			});
			return resolveBundledWebProviderCompatPluginIds({
				contract: params.contract,
				...compatParams,
				manifestRecords
			});
		}
	});
	return {
		config: activation.config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons,
		manifestRecords
	};
}
/** Adds plugin ids to registry provider records, applies an optional plugin scope, then sorts. */
function mapRegistryProviders(params) {
	const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
	return params.sortProviders(params.entries.filter((entry) => !onlyPluginIdSet || onlyPluginIdSet.has(entry.pluginId)).map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId })));
}
//#endregion
//#region src/plugins/web-fetch-providers.shared.ts
function sortWebFetchProviders(providers) {
	return sortPluginEntriesById(providers);
}
function sortWebFetchProvidersForAutoDetect(providers) {
	return sortPluginEntriesForAutoDetect(providers);
}
function resolveBundledWebFetchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webFetchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.manifestRecords
	});
}
//#endregion
//#region src/plugins/web-provider-public-artifacts.explicit.ts
const WEB_SEARCH_ARTIFACT_CANDIDATES = [
	"web-search-contract-api.js",
	"web-search-provider.js",
	"web-search.js"
];
const WEB_FETCH_ARTIFACT_CANDIDATES = [
	"web-fetch-contract-api.js",
	"web-fetch-provider.js",
	"web-fetch.js"
];
const WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES = ["web-fetch-provider.js", "web-fetch.js"];
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWebProviderPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && typeof value.hint === "string" && isStringArray(value.envVars) && typeof value.placeholder === "string" && typeof value.signupUrl === "string" && typeof value.credentialPath === "string" && typeof value.getCredentialValue === "function" && typeof value.setCredentialValue === "function" && typeof value.createTool === "function";
}
function collectProviderFactories(params) {
	const providers = [];
	const errors = [];
	for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith(params.suffix)) continue;
		let candidate;
		try {
			candidate = exported();
		} catch (error) {
			errors.push(error);
			continue;
		}
		if (params.isProvider(candidate)) providers.push(candidate);
	}
	return {
		providers,
		errors
	};
}
function unableToInitializeProviderError(params) {
	return new Error(`Unable to initialize web providers for plugin ${params.pluginId}`, { cause: params.errors.length === 1 ? params.errors[0] : new AggregateError(params.errors) });
}
function loadBundledProviderEntriesFromDir(params) {
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.dirName,
		artifactCandidates: params.artifactCandidates
	});
	if (!mod) return null;
	const { providers, errors } = collectProviderFactories({
		mod,
		suffix: params.suffix,
		isProvider: params.isProvider
	});
	if (providers.length === 0) {
		if (errors.length > 0) throw unableToInitializeProviderError({
			pluginId: params.pluginId,
			errors
		});
		return null;
	}
	return providers.map((provider) => Object.assign({}, provider, { pluginId: params.pluginId }));
}
function resolveBundledExplicitProviders(params) {
	const providers = [];
	for (const pluginId of sortUniqueStrings(params.onlyPluginIds)) {
		const loadedProviders = params.loadProviders(pluginId);
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function loadBundledWebSearchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		...params,
		artifactCandidates: WEB_SEARCH_ARTIFACT_CANDIDATES,
		suffix: "WebSearchProvider",
		isProvider: (value) => isWebProviderPlugin(value)
	});
}
function loadBundledWebFetchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		...params,
		artifactCandidates: WEB_FETCH_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isProvider: (value) => isWebProviderPlugin(value)
	});
}
function loadBundledRuntimeWebFetchProviderEntriesFromDir(params) {
	return loadBundledProviderEntriesFromDir({
		...params,
		artifactCandidates: WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES,
		suffix: "WebFetchProvider",
		isProvider: (value) => isWebProviderPlugin(value)
	});
}
function resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		loadProviders: (pluginId) => loadBundledWebSearchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		})
	});
}
function resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		loadProviders: (pluginId) => loadBundledWebFetchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		})
	});
}
function resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts(params) {
	return resolveBundledExplicitProviders({
		...params,
		loadProviders: (pluginId) => loadBundledRuntimeWebFetchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		})
	});
}
//#endregion
//#region src/plugins/web-search-providers.shared.ts
function sortWebSearchProviders(providers) {
	return sortPluginEntriesById(providers);
}
function sortWebSearchProvidersForAutoDetect(providers) {
	return sortPluginEntriesForAutoDetect(providers);
}
function resolveBundledWebSearchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webSearchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.manifestRecords
	});
}
//#endregion
export { loadBundledWebSearchProviderEntriesFromDir as a, resolveBundledExplicitWebSearchProvidersFromPublicArtifacts as c, sortWebFetchProvidersForAutoDetect as d, mapRegistryProviders as f, loadBundledWebFetchProviderEntriesFromDir as i, resolveBundledWebFetchResolutionConfig as l, resolveManifestDeclaredWebProviderCandidates as m, sortWebSearchProviders as n, resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts as o, resolveManifestDeclaredWebProviderCandidatePluginIds as p, sortWebSearchProvidersForAutoDetect as r, resolveBundledExplicitWebFetchProvidersFromPublicArtifacts as s, resolveBundledWebSearchResolutionConfig as t, sortWebFetchProviders as u };
