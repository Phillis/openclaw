import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as loadPluginManifest } from "./manifest-BmA-DH7w.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-Q7fHcAUz.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-7Zd9NJ9x.js";
import { l as normalizeStaticProviderModelId, t as createStaticProviderModelIdNormalizer } from "./model-ref-shared-poyRjWh_.js";
import { n as planManifestModelCatalogSuppressions } from "./manifest-planner-CU46ZL6r.js";
import { t as listOpenClawPluginManifestMetadata } from "./manifest-metadata-scan-nV49b44N.js";
import "./defaults-CdX9UGcX.js";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-CvIVbKms.js";
import { d as resolveOwningPluginIdsForProviderRef, n as resolveBundledProviderCompatPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers-o7UIOzTf.js";
import { t as buildInlineProviderModels } from "./model.inline-provider-D8YRxcgw.js";
import { i as resolveRuntimePluginDiscoveryProviders, n as normalizePluginDiscoveryResult, o as runProviderStaticCatalog } from "./provider-discovery-DATDyD7M.js";
//#region src/agents/embedded-agent-runner/model.static-id.ts
function matchesStaticModelId(params, normalizeModelId) {
	const normalizedProvider = normalizeProviderId(params.provider);
	if (params.rowProvider && normalizeProviderId(params.rowProvider) !== normalizedProvider) return false;
	return normalizeModelId(normalizedProvider, params.candidateId).trim().toLowerCase() === normalizeModelId(normalizedProvider, params.modelId).trim().toLowerCase();
}
function staticModelIdMatches(params) {
	return matchesStaticModelId(params, normalizeStaticProviderModelId);
}
/** Builds a matcher pinned to one prepared manifest-policy generation. */
function createStaticModelIdMatcher(options = {}) {
	const normalizeModelId = createStaticProviderModelIdNormalizer(options);
	return (params) => matchesStaticModelId(params, normalizeModelId);
}
//#endregion
//#region src/agents/embedded-agent-runner/model.manifest-alias.ts
function hasModelCatalogAliasTransportOverride(alias) {
	return Boolean(alias.api?.trim() || alias.baseUrl?.trim());
}
function hasModelCatalogAliasEndpointSurface(alias) {
	return Boolean(alias.baseUrl?.trim());
}
function findConfiguredModelCatalogProviderConfig(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return;
	for (const [providerId, providerConfig] of Object.entries(params.cfg?.models?.providers ?? {})) if (normalizeProviderId(providerId) === provider) return providerConfig;
}
function hasConfiguredModelCatalogProviderEndpointSurface(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return false;
	const config = findConfiguredModelCatalogProviderConfig({
		provider,
		cfg: params.cfg
	});
	if (config?.baseUrl?.trim()) return true;
	const modelId = params.modelId?.trim();
	if (!modelId || !Array.isArray(config?.models)) return false;
	return config.models.some((model) => Boolean(model.baseUrl?.trim()) && staticModelIdMatches({
		candidateId: model.id,
		provider,
		modelId
	}));
}
function resolveConfiguredModelCatalogProviderApi(params) {
	const provider = normalizeProviderId(params.provider);
	const config = findConfiguredModelCatalogProviderConfig({
		provider,
		cfg: params.cfg
	});
	const modelId = params.modelId?.trim();
	return (provider && modelId && Array.isArray(config?.models) ? config.models.find((candidate) => staticModelIdMatches({
		candidateId: candidate.id,
		provider,
		modelId
	})) : void 0)?.api ?? config?.api;
}
function hasUnconditionalManifestModelCatalogSuppression(params) {
	const provider = normalizeProviderId(params.provider);
	const modelId = params.modelId?.trim();
	if (!provider || !modelId) return false;
	return planManifestModelCatalogSuppressions({
		registry: { plugins: [params.plugin] },
		providerFilter: provider,
		modelFilter: modelId
	}).suppressions.some((suppression) => !suppression.when && normalizeProviderId(suppression.provider) === provider);
}
function listEligibleManifestModelCatalogAliasPlugins(params) {
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	return params.plugins.filter((plugin) => {
		if (!isActivatedManifestOwner({
			plugin,
			normalizedConfig,
			rootConfig: params.cfg
		})) return false;
		return isBundledManifestOwner(plugin) || plugin.origin === "config" || hasExplicitManifestOwnerTrust({
			plugin,
			normalizedConfig
		});
	});
}
function resolveManifestAliasTargetApi(params) {
	const providerCatalog = Object.entries(params.plugin.modelCatalog?.providers ?? {}).find(([provider]) => normalizeProviderId(provider) === params.provider)?.[1];
	if (!providerCatalog) return;
	const modelId = params.modelId?.trim();
	return (modelId ? providerCatalog.models.find((candidate) => staticModelIdMatches({
		candidateId: candidate.id,
		provider: params.provider,
		modelId
	})) : void 0)?.api ?? providerCatalog.api;
}
function resolveManifestModelCatalogProviderAlias(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return { kind: "none" };
	const claims = [];
	const plugins = listEligibleManifestModelCatalogAliasPlugins({
		cfg: params.cfg,
		plugins: params.plugins
	});
	for (const plugin of plugins) for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
		const normalizedAlias = normalizeProviderId(rawAlias);
		const normalizedTarget = normalizeProviderId(alias.provider);
		if (normalizedAlias !== provider || !normalizedTarget || !plugin.providers.some((providerId) => normalizeProviderId(providerId) === normalizedTarget)) continue;
		const hasApplicableSuppression = Boolean(params.modelId?.trim()) && hasUnconditionalManifestModelCatalogSuppression({
			provider,
			modelId: params.modelId,
			plugin
		});
		const hasEndpointSurface = hasModelCatalogAliasEndpointSurface(alias) || hasConfiguredModelCatalogProviderEndpointSurface({
			provider,
			modelId: params.modelId,
			cfg: params.cfg
		});
		const transportApi = resolveConfiguredModelCatalogProviderApi({
			provider,
			modelId: params.modelId,
			cfg: params.cfg
		}) ?? alias.api ?? resolveManifestAliasTargetApi({
			plugin,
			provider: normalizedTarget,
			modelId: params.modelId
		});
		const hasTransportOverride = hasModelCatalogAliasTransportOverride(alias);
		const retainsTransportAlias = hasTransportOverride && hasEndpointSurface && Boolean(transportApi) && !hasApplicableSuppression;
		const baseUrl = alias.baseUrl?.trim();
		claims.push({
			incompleteTransport: hasTransportOverride && hasEndpointSurface && !transportApi && !hasApplicableSuppression,
			targetProvider: normalizedTarget,
			retainsTransportAlias,
			transport: {
				...transportApi ? { api: transportApi } : {},
				...baseUrl ? { baseUrl } : {}
			}
		});
	}
	if (claims.length === 0) return { kind: "none" };
	if (claims.length > 1) return { kind: "conflict" };
	const claim = claims[0];
	if (!claim) return { kind: "none" };
	if (claim.incompleteTransport) return { kind: "incomplete-transport" };
	if (claim.retainsTransportAlias) return {
		kind: "transport",
		transport: claim.transport
	};
	return {
		kind: "canonical",
		provider: claim.targetProvider
	};
}
function resolveManifestModelCatalogProviderAliasMetadata(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return { provider: params.provider };
	const env = params.env ?? process.env;
	const plugins = (env === process.env ? getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...params.cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}
	})?.plugins : void 0) ?? loadPluginManifestRegistryCore({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	}).plugins;
	const resolved = resolveManifestModelCatalogProviderAlias({
		provider,
		modelId: params.modelId,
		cfg: params.cfg,
		plugins
	});
	switch (resolved.kind) {
		case "canonical": return { provider: resolved.provider };
		case "transport": return {
			provider: params.provider,
			transport: resolved.transport
		};
		case "conflict":
		case "incomplete-transport": return {
			provider: params.provider,
			ambiguous: true
		};
		case "none": return { provider: params.provider };
		default: return resolved;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-catalog.ts
/**
* Resolves bundled plugin static model-catalog rows into runtime model records.
*/
function rowMatchesModel(params) {
	return params.matchesStaticModelId({
		candidateId: params.row.id,
		provider: params.provider,
		modelId: params.modelId,
		rowProvider: params.row.provider
	});
}
function normalizeStaticCatalogInput(input) {
	const normalizedInput = (input ?? []).filter((item) => item === "text" || item === "image");
	return normalizedInput.length > 0 ? normalizedInput : ["text"];
}
function normalizeStaticCatalogCost(cost) {
	return {
		input: cost?.input ?? 0,
		output: cost?.output ?? 0,
		cacheRead: cost?.cacheRead ?? 0,
		cacheWrite: cost?.cacheWrite ?? 0
	};
}
/** Converts a normalized catalog row into the provider runtime model shape. */
function modelFromStaticCatalogRow(row) {
	return {
		id: row.id,
		name: row.name || row.id,
		provider: row.provider,
		api: row.api ?? "openai-responses",
		baseUrl: row.baseUrl ?? "",
		reasoning: row.reasoning,
		input: normalizeStaticCatalogInput(row.input),
		cost: normalizeStaticCatalogCost(row.cost),
		contextWindow: row.contextWindow ?? 2e5,
		contextTokens: row.contextTokens,
		maxTokens: row.maxTokens ?? 2e5,
		thinkingLevelMap: row.thinkingLevelMap ? { ...row.thinkingLevelMap } : void 0,
		headers: row.headers,
		compat: row.compat,
		mediaInput: row.mediaInput
	};
}
function modelFromProviderStaticCatalog(params) {
	const [model] = buildInlineProviderModels({ [params.provider]: {
		...params.providerConfig,
		models: [params.model]
	} }, { providerMetadataOwners: params.providerMetadataOwners });
	return {
		...model,
		id: model?.id ?? params.model.id,
		name: model?.name || params.model.name || params.model.id,
		provider: params.provider,
		api: model?.api ?? params.model.api ?? params.providerConfig.api ?? "openai-responses",
		baseUrl: model?.baseUrl ?? params.model.baseUrl ?? params.providerConfig.baseUrl ?? "",
		reasoning: model?.reasoning ?? params.model.reasoning ?? false,
		input: normalizeStaticCatalogInput(model?.input ?? params.model.input),
		cost: model?.cost ?? normalizeStaticCatalogCost(params.model.cost),
		contextWindow: model?.contextWindow ?? params.model.contextWindow ?? params.providerConfig.contextWindow ?? 2e5,
		contextTokens: model?.contextTokens ?? params.model.contextTokens ?? params.providerConfig.contextTokens,
		maxTokens: model?.maxTokens ?? params.model.maxTokens ?? params.providerConfig.maxTokens ?? 2e5,
		...params.providerConfig.authHeader !== void 0 ? { authHeader: params.providerConfig.authHeader } : {}
	};
}
const bundledStaticCatalogStatesBySnapshot = /* @__PURE__ */ new WeakMap();
const defaultBundledStaticCatalogConfig = {};
function resolveBundledStaticCatalogMetadataSnapshot(params) {
	if (params.metadataSnapshot) return params.metadataSnapshot;
	if (params.env !== process.env) return;
	return getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env: params.env,
		workspaceDir: params.workspaceDir,
		...params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {},
		...params.cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}
	});
}
function listBundledStaticCatalogPlugins(params, metadataSnapshot) {
	const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
	return (metadataSnapshot ? metadataSnapshot.plugins.filter((plugin) => plugin.origin === "bundled").map(({ id, providers, modelCatalog }) => ({
		id,
		providers,
		modelCatalog
	})) : listOpenClawPluginManifestMetadata(params.env).flatMap((record) => {
		if (record.origin !== "bundled") return [];
		const loaded = loadPluginManifest(record.pluginDir);
		return loaded.ok ? [{
			id: loaded.manifest.id,
			providers: loaded.manifest.providers,
			modelCatalog: loaded.manifest.modelCatalog
		}] : [];
	})).filter((plugin) => Boolean(plugin.modelCatalog) && passesManifestOwnerBasePolicy({
		plugin,
		normalizedConfig
	}));
}
function resolveSnapshotBundledStaticCatalogState(params, metadataSnapshot) {
	let states = bundledStaticCatalogStatesBySnapshot.get(metadataSnapshot);
	if (!states) {
		states = /* @__PURE__ */ new WeakMap();
		bundledStaticCatalogStatesBySnapshot.set(metadataSnapshot, states);
	}
	const config = params.cfg ?? defaultBundledStaticCatalogConfig;
	const cached = states.get(config);
	if (cached) return cached;
	const state = {
		plugins: listBundledStaticCatalogPlugins(params, metadataSnapshot),
		plans: /* @__PURE__ */ new Map()
	};
	states.set(config, state);
	return state;
}
/** Returns whether a bundled static catalog asks runtime discovery to augment its rows. */
function bundledStaticCatalogProviderUsesRuntimeAugment(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return false;
	const catalogParams = {
		cfg: params.cfg,
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir
	};
	const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot(catalogParams);
	return (metadataSnapshot ? resolveSnapshotBundledStaticCatalogState(catalogParams, metadataSnapshot).plugins : listBundledStaticCatalogPlugins(catalogParams)).some((plugin) => {
		const catalog = plugin.modelCatalog;
		if (catalog?.runtimeAugment !== true) return false;
		return Object.keys(catalog.providers ?? {}).some((candidate) => normalizeProviderId(candidate) === provider) || Object.keys(catalog.aliases ?? {}).some((candidate) => normalizeProviderId(candidate) === provider);
	});
}
/**
* Prepares a process-stable bundled manifest catalog lookup.
* Manifest discovery runs once; provider-specific plans are cached on demand.
*/
function createBundledStaticCatalogModelResolver(params) {
	const catalogParams = {
		cfg: params?.cfg,
		env: params?.env ?? process.env,
		...params?.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		workspaceDir: params?.workspaceDir
	};
	const matchesStaticModelId = params?.metadataSnapshot ? createStaticModelIdMatcher({ manifestPlugins: params.metadataSnapshot.plugins }) : staticModelIdMatches;
	let standaloneState;
	return (lookup) => {
		const provider = normalizeProviderId(lookup.provider);
		if (!provider || !lookup.modelId.trim()) return;
		const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot(catalogParams);
		const state = metadataSnapshot ? resolveSnapshotBundledStaticCatalogState(catalogParams, metadataSnapshot) : standaloneState ??= {
			plugins: listBundledStaticCatalogPlugins(catalogParams),
			plans: /* @__PURE__ */ new Map()
		};
		if (state.plugins.length === 0) return;
		let plan = state.plans.get(provider);
		if (!plan) {
			plan = planEffectiveModelCatalogRows({
				registry: { plugins: state.plugins },
				config: params?.cfg ?? {},
				providerFilter: provider
			});
			state.plans.set(provider, plan);
		}
		for (const entry of plan.entries) {
			if (entry.discovery !== "static" && !(params?.includeRuntimeDiscovery && (entry.discovery === "runtime" || entry.discovery === "refreshable"))) continue;
			const row = entry.rows.find((candidate) => rowMatchesModel({
				row: candidate,
				provider,
				modelId: lookup.modelId,
				matchesStaticModelId
			}));
			if (row) return modelFromStaticCatalogRow(row);
		}
	};
}
/** Resolves one bundled static-catalog model row for provider/model lookup. */
function resolveBundledStaticCatalogModel(params) {
	return createBundledStaticCatalogModelResolver({
		cfg: params.cfg,
		...params.env ? { env: params.env } : {},
		...params.includeRuntimeDiscovery !== void 0 ? { includeRuntimeDiscovery: params.includeRuntimeDiscovery } : {},
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	})(params);
}
function resolveBundledProviderStaticCatalogPluginIds(params) {
	const pluginIds = resolveOwningPluginIdsForProviderRef({
		provider: params.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	});
	if (!pluginIds || pluginIds.length === 0) return [];
	const activatablePluginIds = resolveActivatableProviderOwnerPluginIds({
		pluginIds,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? {
			registry: params.metadataSnapshot.index,
			manifestRegistry: params.metadataSnapshot.manifestRegistry
		} : {}
	});
	if (activatablePluginIds.length === 0) return [];
	const bundledPluginIds = new Set(resolveBundledProviderCompatPluginIds({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...params.metadataSnapshot ? { manifestRegistry: params.metadataSnapshot.manifestRegistry } : {}
	}));
	return activatablePluginIds.filter((pluginId) => bundledPluginIds.has(pluginId)).toSorted();
}
async function loadBundledProviderStaticCatalogModels(params) {
	const pluginIds = new Set(params.pluginIds);
	const preparedProviders = (params.preparedStaticProviderCatalog?.providers ?? []).filter((provider) => provider.pluginId !== void 0 && pluginIds.has(provider.pluginId));
	const preparedPluginIds = new Set(preparedProviders.flatMap((provider) => provider.pluginId ? [provider.pluginId] : []));
	const missingPluginIds = params.pluginIds.filter((pluginId) => !preparedPluginIds.has(pluginId));
	const discoveredProviders = missingPluginIds.length === 0 ? [] : await resolveRuntimePluginDiscoveryProviders({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: missingPluginIds,
		includeUntrustedWorkspacePlugins: false,
		requireCompleteDiscoveryEntryCoverage: true,
		discoveryEntriesOnly: true,
		includeManifestModelCatalogProviders: false,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const providers = [...preparedProviders, ...discoveredProviders];
	const preparedEntries = params.preparedStaticProviderCatalog?.entries.filter(({ provider }) => provider.pluginId !== void 0 && pluginIds.has(provider.pluginId));
	const preparedResults = preparedEntries ? new Map(preparedEntries.map(({ provider, result }) => [`${provider.pluginId ?? ""}\0${normalizeProviderId(provider.id)}`, result])) : void 0;
	const modelsByProvider = /* @__PURE__ */ new Map();
	for (const catalogProvider of providers) {
		const preparedResultKey = `${catalogProvider.pluginId ?? ""}\0${normalizeProviderId(catalogProvider.id)}`;
		const normalized = normalizePluginDiscoveryResult({
			provider: catalogProvider,
			result: preparedResults?.has(preparedResultKey) ? preparedResults.get(preparedResultKey) : await runProviderStaticCatalog({ provider: catalogProvider })
		});
		for (const [providerIdRaw, providerConfig] of Object.entries(normalized)) {
			const provider = normalizeProviderId(providerIdRaw);
			if (!provider || !Array.isArray(providerConfig.models)) continue;
			const models = modelsByProvider.get(provider) ?? [];
			models.push(...providerConfig.models.map((model) => modelFromProviderStaticCatalog({
				provider,
				providerConfig,
				model,
				...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {}
			})));
			modelsByProvider.set(provider, models);
		}
	}
	return modelsByProvider;
}
/** Loads all enabled bundled provider static-catalog rows without live discovery or writes. */
async function loadBundledProviderStaticCatalogContextModels(params = {}) {
	const env = params.env ?? process.env;
	const metadataSnapshot = resolveBundledStaticCatalogMetadataSnapshot({
		cfg: params.cfg,
		env,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		workspaceDir: params.workspaceDir
	});
	const discoveryEntryPluginIds = new Set((metadataSnapshot?.manifestRegistry?.plugins ?? loadPluginManifestRegistryCore({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	}).plugins).flatMap((plugin) => plugin.origin === "bundled" && plugin.providerDiscoverySource ? [plugin.id] : []));
	const providerScopedPluginIds = params.providerIds?.flatMap((provider) => resolveBundledProviderStaticCatalogPluginIds({
		provider,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...metadataSnapshot ? { metadataSnapshot } : {}
	}));
	const candidatePluginIds = providerScopedPluginIds === void 0 ? resolveBundledProviderCompatPluginIds({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...metadataSnapshot ? { manifestRegistry: metadataSnapshot.manifestRegistry } : {}
	}) : providerScopedPluginIds;
	const pluginIds = [...new Set(candidatePluginIds)].filter((pluginId) => discoveryEntryPluginIds.has(pluginId)).toSorted((left, right) => left.localeCompare(right));
	if (pluginIds.length === 0) return [];
	return (await Promise.allSettled(pluginIds.map(async (pluginId) => await loadBundledProviderStaticCatalogModels({
		pluginIds: [pluginId],
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		...params.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: params.preparedStaticProviderCatalog } : {},
		...metadataSnapshot ? { providerMetadataOwners: metadataSnapshot.owners } : {},
		...metadataSnapshot ? { pluginMetadataSnapshot: metadataSnapshot } : {}
	})))).flatMap((result) => result.status === "fulfilled" ? [...result.value.values()].flat() : []);
}
function createScopedBundledProviderStaticCatalogModelResolver(params = {}) {
	const env = params.env ?? process.env;
	const matchesStaticModelId = params.metadataSnapshot ? createStaticModelIdMatcher({ manifestPlugins: params.metadataSnapshot.plugins }) : staticModelIdMatches;
	const pluginCatalogs = /* @__PURE__ */ new Map();
	const providerPluginIds = /* @__PURE__ */ new Map();
	return async (lookup, scopedPluginIds) => {
		const provider = normalizeProviderId(lookup.provider);
		if (!provider || !lookup.modelId.trim()) return;
		let pluginIds = scopedPluginIds;
		if (!pluginIds) pluginIds = providerPluginIds.get(provider);
		if (!pluginIds) {
			pluginIds = resolveBundledProviderStaticCatalogPluginIds({
				provider,
				cfg: params.cfg,
				workspaceDir: params.workspaceDir,
				env,
				...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
			});
			providerPluginIds.set(provider, pluginIds);
		}
		if (pluginIds.length === 0) return;
		const catalogKey = pluginIds.join("\0");
		let catalog = pluginCatalogs.get(catalogKey);
		if (!catalog) {
			catalog = loadBundledProviderStaticCatalogModels({
				pluginIds,
				cfg: params.cfg,
				workspaceDir: params.workspaceDir,
				env,
				...params.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: params.preparedStaticProviderCatalog } : {},
				...params.metadataSnapshot ? {
					providerMetadataOwners: params.metadataSnapshot.owners,
					pluginMetadataSnapshot: params.metadataSnapshot
				} : {}
			});
			pluginCatalogs.set(catalogKey, catalog);
		}
		return ((await catalog).get(provider) ?? []).find((candidate) => matchesStaticModelId({
			candidateId: candidate.id,
			provider,
			modelId: lookup.modelId
		}));
	};
}
/**
* Prepares bundled provider static-catalog lookup.
* Each provider hook runs at most once for the resolver lifetime.
*/
function createBundledProviderStaticCatalogModelResolver(params = {}) {
	const resolveModel = createScopedBundledProviderStaticCatalogModelResolver(params);
	return async (lookup) => await resolveModel(lookup);
}
function resolveOwnedNestedProviderLookup(params) {
	const provider = normalizeProviderId(params.lookup.provider);
	const modelId = params.lookup.modelId.trim();
	const slash = modelId.indexOf("/");
	if (!provider || slash <= 0 || slash >= modelId.length - 1) return;
	const nestedProvider = normalizeProviderId(modelId.slice(0, slash));
	const nestedModelId = modelId.slice(slash + 1).trim();
	if (!nestedProvider || nestedProvider === provider || !nestedModelId) return;
	const resolveBundledOwners = (candidateProvider) => resolveBundledProviderStaticCatalogPluginIds({
		provider: candidateProvider,
		cfg: params.resolverParams.cfg,
		workspaceDir: params.resolverParams.workspaceDir,
		env: params.env,
		...params.resolverParams.metadataSnapshot ? { metadataSnapshot: params.resolverParams.metadataSnapshot } : {}
	});
	const nestedProviderOwners = new Set(resolveBundledOwners(nestedProvider));
	const sharedPluginIds = resolveBundledOwners(provider).filter((pluginId) => nestedProviderOwners.has(pluginId));
	if (sharedPluginIds.length === 0) return;
	return {
		lookup: {
			provider: nestedProvider,
			modelId: nestedModelId
		},
		pluginIds: sharedPluginIds
	};
}
/**
* Prepares context-only provider catalog lookup.
* Nested provider refs may reuse metadata only when both providers have the same plugin owner.
*/
function createBundledProviderStaticCatalogContextResolver(params = {}) {
	const env = params.env ?? process.env;
	const resolveModel = createScopedBundledProviderStaticCatalogModelResolver(params);
	return async (lookup) => {
		const exactModel = await resolveModel(lookup);
		const nested = exactModel ? void 0 : resolveOwnedNestedProviderLookup({
			lookup,
			resolverParams: params,
			env
		});
		const model = exactModel ?? (nested ? await resolveModel(nested.lookup, nested.pluginIds) : void 0);
		if (!model) return;
		return {
			...model.contextWindow > 0 ? { contextWindow: model.contextWindow } : {},
			...typeof model.contextTokens === "number" && model.contextTokens > 0 ? { contextTokens: model.contextTokens } : {}
		};
	};
}
/**
* Resolves one bundled provider static-catalog model row for provider/model lookup.
*
* Some bundled providers expose their canonical offline rows through
* `providerCatalogEntry` instead of manifest `modelCatalog`. This keeps the
* skip-discovery fallback aligned with model list/inspect without running live
* discovery or untrusted workspace plugins.
*/
async function resolveBundledProviderStaticCatalogModel(params) {
	return createBundledProviderStaticCatalogModelResolver(params)(params);
}
//#endregion
export { resolveBundledProviderStaticCatalogModel as a, createStaticModelIdMatcher as c, loadBundledProviderStaticCatalogContextModels as i, staticModelIdMatches as l, createBundledProviderStaticCatalogContextResolver as n, resolveBundledStaticCatalogModel as o, createBundledStaticCatalogModelResolver as r, resolveManifestModelCatalogProviderAliasMetadata as s, bundledStaticCatalogProviderUsesRuntimeAugment as t };
