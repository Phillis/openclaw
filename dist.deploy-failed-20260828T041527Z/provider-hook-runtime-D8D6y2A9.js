import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { p as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { n as findNormalizedProviderValue } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { i as resolveConfigScopedRuntimeCacheValue, t as PluginLruCache } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-DGIHVL5k.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { n as getPluginRegistryState, t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { y as resolveProviderConfigApiOwnerHint } from "./gateway-startup-plugin-ids-Dy6KWM9Y.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { n as matchesProviderPluginRef } from "./provider-registry-shared-CYfJZ_PT.js";
import "./config-B_0xOnKq.js";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-scope-D--dYlKj.js";
import { a as registryContainsRuntimePluginIds, n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-C6lIiD1n.js";
import { n as resolvePluginProvidersCore, t as isPluginProvidersLoadInFlight } from "./providers.runtime-FOWiRwM8.js";
//#region src/agents/model-discovery-context.ts
/**
* Shared context resolvers for model discovery.
* Keeps callers from reaching into runtime config or plugin metadata snapshot
* plumbing directly.
*/
function providerConfigDeclaresModel(providerConfig, model) {
	const trimmedModel = model.trim();
	return Boolean(trimmedModel && providerConfig?.models?.some((candidate) => candidate.id?.trim() === trimmedModel));
}
/** Resolves provider/model refs used to scope model catalog discovery. */
function resolveModelCatalogScope(params) {
	const provider = params.provider.trim();
	const model = params.model.trim();
	const providerConfig = findNormalizedProviderValue(params.cfg?.models?.providers, provider);
	const modelRefs = providerConfigDeclaresModel(providerConfig, model) ? [provider && model ? `${provider}/${model}` : model] : [provider && model ? `${provider}/${model}` : model, model];
	return {
		providerRefs: normalizeUniqueSingleOrTrimmedStringList([provider, providerConfig?.api]),
		modelRefs: normalizeUniqueSingleOrTrimmedStringList(modelRefs)
	};
}
/** Resolve the workspace directory model discovery should use for agent scope. */
function resolveModelWorkspaceDir(cfg, explicitWorkspaceDir, agentId) {
	if (explicitWorkspaceDir !== void 0 || !cfg) return explicitWorkspaceDir;
	return resolveAgentWorkspaceDir(cfg, agentId ?? resolveDefaultAgentId(cfg));
}
/**
* Resolve the plugin metadata snapshot for model discovery.
*
* Explicit snapshots win for tests and prepared runtimes. Otherwise we prefer
* the current process snapshot, then fall back to resolving from config/env.
*/
function resolveModelPluginMetadataSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	const env = params.env ?? process.env;
	try {
		const config = params.config ?? (params.useRuntimeConfig ? getRuntimeConfig() : void 0);
		return getCurrentPluginMetadataSnapshot({
			allowWorkspaceScopedSnapshot: true,
			env,
			...config ? { config } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}) ?? resolvePluginMetadataSnapshot({
			config: config ?? {},
			env,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent !== void 0 ? { allowWorkspaceScopedCurrent: params.allowWorkspaceScopedCurrent } : {}
		});
	} catch {
		return;
	}
}
//#endregion
//#region src/plugins/provider-hook-runtime.ts
const providerRuntimePluginCache = /* @__PURE__ */ new WeakMap();
const defaultProviderRuntimePluginCache = new PluginLruCache(128);
const MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL = Symbol.for("openclaw.modelProviderRuntimePluginHandle");
/** Carries one attempt's prepared provider plugin through the model transport boundary. */
function attachModelProviderRuntimePluginHandle(model, runtimeHandle) {
	const next = { ...model };
	next[MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL] = runtimeHandle;
	return next;
}
/** Reads the provider plugin handle attached to a prepared attempt model. */
function getModelProviderRuntimePluginHandle(model) {
	return model ? model[MODEL_PROVIDER_RUNTIME_PLUGIN_HANDLE_SYMBOL] : void 0;
}
function resolveProviderRuntimePluginCacheKey(params, registryState = getPluginRegistryState()) {
	return JSON.stringify({
		providerScope: [params.provider, params.providerOwner].map(normalizeLowercaseStringOrEmpty),
		modelId: resolveProviderRuntimeLookupModelId(params) ?? null,
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.config,
			env: params.env,
			workspaceDir: params.workspaceDir
		}),
		plugins: params.config?.plugins,
		models: params.config?.models?.providers,
		workspaceDir: params.workspaceDir ?? "",
		applyAutoEnable: params.applyAutoEnable ?? null,
		pluginMetadata: params.pluginMetadataSnapshot?.manifestRegistry.plugins.map((plugin) => plugin.id).join(",") ?? null,
		pluginRegistryKey: registryState?.key ?? null,
		pluginRegistryVersion: registryState?.activeVersion ?? null
	});
}
function matchesProviderLiteralId(provider, providerId) {
	const normalized = normalizeLowercaseStringOrEmpty(providerId);
	return Boolean(normalized) && normalizeLowercaseStringOrEmpty(provider.id) === normalized;
}
function resolveProviderRuntimeLookupModelId(params) {
	return normalizeOptionalString(params.modelId ?? (typeof params.context?.modelId === "string" ? params.context.modelId : void 0));
}
function resolveProviderRuntimeLookupScope(params, ownerRefs) {
	const providerRefs = [params.provider, ...ownerRefs];
	const modelId = resolveProviderRuntimeLookupModelId(params);
	if (!modelId) return { providerRefs };
	return {
		providerRefs,
		modelRefs: resolveModelCatalogScope({
			cfg: params.config,
			provider: params.provider,
			model: modelId
		}).modelRefs
	};
}
function findProviderRuntimePluginInLoadedRegistries(params) {
	const generationRegistry = getPluginRuntimeGenerationRegistry();
	if (generationRegistry) return findProviderRuntimePluginInRegistry({
		registry: generationRegistry,
		provider: params.lookup.provider,
		ownerRefs: params.ownerRefs
	});
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scopedPlugin = scopedRegistry ? findProviderRuntimePluginInRegistry({
		registry: scopedRegistry,
		provider: params.lookup.provider,
		ownerRefs: params.ownerRefs
	}) : void 0;
	if (scopedPlugin) return scopedPlugin;
	const activeRegistry = getLoadedRuntimePluginRegistry({
		env: params.lookup.env,
		workspaceDir: params.lookup.workspaceDir
	});
	const activePlugin = activeRegistry ? findProviderRuntimePluginInRegistry({
		registry: activeRegistry,
		provider: params.lookup.provider,
		ownerRefs: params.ownerRefs
	}) : void 0;
	if (activePlugin) return activePlugin;
}
function findProviderRuntimePluginInRegistry(params) {
	return listProviderRuntimePluginsInRegistry(params.registry).find((plugin) => {
		if (params.ownerRefs.length > 0) return matchesProviderLiteralId(plugin, params.provider) || params.ownerRefs.some((ownerRef) => matchesProviderPluginRef(plugin, ownerRef));
		return matchesProviderPluginRef(plugin, params.provider);
	});
}
function listProviderRuntimePluginsInRegistry(registry) {
	return registry.providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
}
function hasConfiguredModelProvider(params) {
	return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
function resolveProviderPluginsForHooks(params) {
	const filterRegistryPlugins = (registry) => {
		const onlyPluginIds = params.onlyPluginIds ? new Set(params.onlyPluginIds) : void 0;
		return listProviderRuntimePluginsInRegistry(registry).filter((plugin) => (!onlyPluginIds || onlyPluginIds.has(plugin.pluginId)) && (!params.providerRefs?.length || params.providerRefs.some((providerRef) => matchesProviderPluginRef(plugin, providerRef))));
	};
	const generationRegistry = getPluginRuntimeGenerationRegistry();
	if (generationRegistry) return filterRegistryPlugins(generationRegistry);
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const preparedRegistry = scopedRegistry && registryContainsRuntimePluginIds(scopedRegistry, params.onlyPluginIds) ? scopedRegistry : getLoadedRuntimePluginRegistry({
		env,
		workspaceDir,
		requiredPluginIds: params.onlyPluginIds
	});
	const preparedPlugins = preparedRegistry ? filterRegistryPlugins(preparedRegistry) : [];
	if (preparedPlugins.length > 0) return preparedPlugins;
	return resolvePluginProvidersCore({
		...params,
		workspaceDir,
		env,
		activate: false,
		applyAutoEnable: params.applyAutoEnable,
		skipIfLoadInFlight: true
	});
}
function resolveProviderRuntimePlugin(params) {
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const env = params.env ?? process.env;
	const lookup = {
		...params,
		workspaceDir,
		env
	};
	const apiOwnerHint = resolveProviderConfigApiOwnerHint({
		provider: params.provider,
		config: params.config
	});
	const ownerRefs = [...new Set([params.providerOwner, apiOwnerHint].filter(Boolean))];
	const providerRefs = [params.provider, ...ownerRefs];
	const loadedPlugin = findProviderRuntimePluginInLoadedRegistries({
		lookup,
		ownerRefs
	});
	if (loadedPlugin) return loadedPlugin;
	if (getPluginRuntimeGenerationRegistry()) return;
	if (isPluginProvidersLoadInFlight({
		...params,
		workspaceDir,
		env,
		providerRefs,
		activate: false,
		applyAutoEnable: params.applyAutoEnable
	})) return;
	const cacheConfig = params.env && params.env !== process.env ? void 0 : params.config;
	const registryState = getPluginRegistryState();
	const cacheKey = resolveProviderRuntimePluginCacheKey(lookup, registryState);
	const load = () => {
		const lookupScope = resolveProviderRuntimeLookupScope(params, ownerRefs);
		return resolveProviderPluginsForHooks({
			config: params.config,
			workspaceDir,
			env,
			providerRefs: lookupScope.providerRefs,
			modelRefs: lookupScope.modelRefs,
			applyAutoEnable: params.applyAutoEnable,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		}).find((plugin) => {
			if (ownerRefs.length > 0) return matchesProviderLiteralId(plugin, params.provider) || ownerRefs.some((ownerRef) => matchesProviderPluginRef(plugin, ownerRef));
			return matchesProviderPluginRef(plugin, params.provider);
		}) ?? null;
	};
	return (cacheConfig ? resolveConfigScopedRuntimeCacheValue({
		cache: providerRuntimePluginCache,
		config: cacheConfig,
		key: cacheKey,
		load
	}) : !registryState?.key ? load() : (() => {
		const cached = defaultProviderRuntimePluginCache.getResult(cacheKey);
		if (cached.hit) return cached.value;
		const loaded = load();
		defaultProviderRuntimePluginCache.set(cacheKey, loaded);
		return loaded;
	})()) ?? void 0;
}
function resolveLoadedProviderRuntimePlugin(params) {
	const apiOwnerHint = resolveProviderConfigApiOwnerHint({
		provider: params.provider,
		config: params.config
	});
	return findProviderRuntimePluginInLoadedRegistries({
		lookup: params,
		ownerRefs: [...new Set([params.providerOwner, apiOwnerHint].filter(Boolean))]
	});
}
function resolveProviderHookPlugin(params) {
	const runtimePlugin = resolveProviderRuntimePlugin(params);
	if (runtimePlugin) return runtimePlugin;
	if (hasConfiguredModelProvider(params)) return;
	return resolveProviderPluginsForHooks({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}).find((candidate) => matchesProviderPluginRef(candidate, params.provider));
}
function resolveProviderRuntimePluginHandle(params) {
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	const env = params.env;
	const runtimePlugin = resolveProviderRuntimePlugin({
		...params,
		workspaceDir,
		env
	});
	return {
		...params,
		workspaceDir,
		env,
		plugin: runtimePlugin
	};
}
function ensureProviderRuntimePluginHandle(params) {
	const modelId = resolveProviderRuntimeLookupModelId(params);
	if (!params.runtimeHandle || modelId && !params.runtimeHandle.plugin && params.runtimeHandle.modelId !== modelId) return resolveProviderRuntimePluginHandle({
		provider: params.provider,
		modelId,
		config: params.config ?? params.runtimeHandle?.config,
		workspaceDir: params.workspaceDir ?? params.runtimeHandle?.workspaceDir,
		env: params.env ?? params.runtimeHandle?.env,
		applyAutoEnable: params.runtimeHandle?.applyAutoEnable,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot ?? params.runtimeHandle?.pluginMetadataSnapshot
	});
	return params.runtimeHandle;
}
function prepareProviderExtraParams(params) {
	return ensureProviderRuntimePluginHandle(params).plugin?.prepareExtraParams?.(params.context) ?? void 0;
}
function resolveProviderExtraParamsForTransport(params) {
	return ensureProviderRuntimePluginHandle(params).plugin?.extraParamsForTransport?.(params.context) ?? void 0;
}
function resolveProviderAuthProfileId(params) {
	const resolved = ensureProviderRuntimePluginHandle(params).plugin?.resolveAuthProfileId?.(params.context);
	return typeof resolved === "string" && resolved.trim() ? resolved.trim() : void 0;
}
function resolveProviderFollowupFallbackRoute(params) {
	return ensureProviderRuntimePluginHandle(params).plugin?.followupFallbackRoute?.(params.context) ?? void 0;
}
function wrapProviderStreamFn(params) {
	return ensureProviderRuntimePluginHandle(params).plugin?.wrapStreamFn?.(params.context) ?? void 0;
}
function wrapProviderSimpleCompletionStreamFn(params) {
	return ensureProviderRuntimePluginHandle(params).plugin?.wrapSimpleCompletionStreamFn?.(params.context) ?? void 0;
}
//#endregion
export { resolveLoadedProviderRuntimePlugin as a, resolveProviderFollowupFallbackRoute as c, resolveProviderRuntimePlugin as d, resolveProviderRuntimePluginHandle as f, resolveModelWorkspaceDir as g, resolveModelPluginMetadataSnapshot as h, prepareProviderExtraParams as i, resolveProviderHookPlugin as l, wrapProviderStreamFn as m, ensureProviderRuntimePluginHandle as n, resolveProviderAuthProfileId as o, wrapProviderSimpleCompletionStreamFn as p, getModelProviderRuntimePluginHandle as r, resolveProviderExtraParamsForTransport as s, attachModelProviderRuntimePluginHandle as t, resolveProviderPluginsForHooks as u };
