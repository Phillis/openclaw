import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { n as findNormalizedProviderValue } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as resolveAgentModelPrimaryValue, r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-Dh4ADgX8.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { o as normalizeModelRef } from "./model-ref-shared-poyRjWh_.js";
import { _ as resolveConfiguredModelRef, b as resolveModelRefFromString, i as buildModelAliasIndex, y as resolveModelAliasFromPair } from "./model-selection-shared-BSy9FczT.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as getPluginRegistryState, t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { t as isPluginProvidersLoadInFlight } from "./providers.runtime-C6CvEUdL.js";
import "./model-selection-resolve-Csj_jVLX.js";
//#region src/agents/configured-provider-model.ts
/** Configured provider rows own exact model ids before plugin normalization. */
/** Find the first configured provider without rediscovering its normalized key. */
function findConfiguredModelProvider(cfg, provider) {
	return provider.trim() ? findNormalizedProviderValue(cfg?.models?.providers, provider) : void 0;
}
/** Exact configured model rows must survive provider-owned alias rewriting. */
function hasExactConfiguredProviderModel(params) {
	const model = params.model.trim();
	return Boolean(model && findConfiguredModelProvider(params.cfg, params.provider)?.models?.some((entry) => entry.id.trim() === model));
}
/** Disabled plugins and exact configured rows both prohibit runtime alias rewriting. */
function allowsPluginModelNormalization(params) {
	const provider = findConfiguredModelProvider(params.cfg, params.provider);
	if (!provider) return true;
	if (!normalizePluginsConfig(params.cfg?.plugins).enabled) return false;
	const model = params.model.trim();
	return !model || !(provider.models ?? []).some((entry) => entry.id.trim() === model);
}
//#endregion
//#region src/agents/model-fallback-candidates.ts
/** Resolves ordered model and image fallback candidate chains. */
const MAX_FALLBACK_CANDIDATE_CACHE_ENTRIES = 256;
const fallbackCandidateCache = /* @__PURE__ */ new Map();
function createModelCandidateCollector() {
	const seen = /* @__PURE__ */ new Set();
	const candidates = [];
	const addCandidate = (candidate, routeOrigin, routeResolution) => {
		if (!candidate.provider || !candidate.model) return;
		const key = modelKey(candidate.provider, candidate.model);
		if (seen.has(key)) return;
		seen.add(key);
		candidates.push({
			...candidate,
			routeOrigin,
			routeResolution
		});
	};
	return {
		candidates,
		addCandidate
	};
}
function resolveImageFallbackCandidates(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg ?? {},
		defaultProvider: params.defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	const { candidates, addCandidate } = createModelCandidateCollector();
	const addRaw = (raw, routeOrigin) => {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider: params.defaultProvider,
			aliasIndex,
			manifestPlugins: params.manifestPlugins
		});
		if (!resolved) return;
		addCandidate(resolved.ref, routeOrigin, "resolved");
	};
	if (params.modelOverride?.trim()) addRaw(params.modelOverride, "requested");
	else {
		const primary = resolveAgentModelPrimaryValue(params.cfg?.agents?.defaults?.imageModel);
		if (primary?.trim()) addRaw(primary, "configured-primary");
	}
	const imageFallbacks = resolveAgentModelFallbackValues(params.cfg?.agents?.defaults?.imageModel);
	for (const raw of imageFallbacks) addRaw(raw, "configured-fallback");
	return candidates;
}
function resolveImageFallbackDefaultProvider(cfg) {
	const configuredPrimary = resolveAgentModelPrimaryValue(cfg?.agents?.defaults?.imageModel);
	if (configuredPrimary?.trim()) {
		const resolved = resolveModelRefFromString({
			cfg,
			raw: configuredPrimary,
			defaultProvider: DEFAULT_PROVIDER,
			aliasIndex: buildModelAliasIndex({
				cfg: cfg ?? {},
				defaultProvider: DEFAULT_PROVIDER
			})
		});
		if (resolved?.ref.provider) return resolved.ref.provider;
	}
	return DEFAULT_PROVIDER;
}
function resolveModelCandidateChain(params) {
	const cacheKey = resolveFallbackCandidateCacheKey(params);
	if (cacheKey) {
		const cached = fallbackCandidateCache.get(cacheKey);
		if (cached) return cached.map(cloneModelCandidate);
	}
	const candidates = resolveFallbackCandidatesUncached(params);
	if (cacheKey) {
		fallbackCandidateCache.set(cacheKey, candidates.map(cloneModelCandidate));
		pruneMapToMaxSize(fallbackCandidateCache, MAX_FALLBACK_CANDIDATE_CACHE_ENTRIES);
	}
	return candidates;
}
function cloneModelCandidate(candidate) {
	return {
		provider: candidate.provider,
		model: candidate.model,
		routeOrigin: candidate.routeOrigin,
		routeResolution: candidate.routeResolution
	};
}
function resolveFallbackCandidateCacheKey(params) {
	if (params.manifestPlugins) return null;
	const workspaceDir = getActivePluginRegistryWorkspaceDirFromState();
	const env = process.env;
	const pluginMetadata = getCurrentPluginMetadataSnapshot({
		env,
		workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	const providerLoadMetadata = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env,
		workspaceDir,
		allowWorkspaceScopedSnapshot: true
	});
	if (isPluginProvidersLoadInFlight({
		config: params.cfg,
		workspaceDir,
		env,
		...providerLoadMetadata ? { pluginMetadataSnapshot: providerLoadMetadata } : {},
		activate: false
	})) return null;
	const registryState = getPluginRegistryState();
	return JSON.stringify({
		provider: params.provider,
		model: params.model,
		requestedRouteResolution: params.requestedRouteResolution,
		fallbacksOverride: params.fallbacksOverride,
		agentsDefaultsModel: params.cfg?.agents?.defaults?.model,
		agentsDefaultsModels: params.cfg?.agents?.defaults?.models,
		modelProviders: resolveFallbackCandidateModelProviderCacheParts(params.cfg),
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.cfg,
			env,
			workspaceDir
		}),
		pluginMetadataFingerprint: pluginMetadata?.configFingerprint ?? null,
		pluginRegistryKey: registryState?.key ?? null,
		pluginRegistryVersion: registryState?.activeVersion ?? null,
		pluginWorkspaceDir: workspaceDir ?? null
	});
}
function resolveFallbackCandidateModelProviderCacheParts(cfg) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	return Object.entries(providers).map(([providerId, providerConfig]) => ({
		providerId,
		api: typeof providerConfig?.api === "string" ? providerConfig.api : void 0,
		models: Array.isArray(providerConfig?.models) ? providerConfig.models.map((entry) => typeof entry?.id === "string" ? entry.id : void 0).filter((id) => id !== void 0) : []
	}));
}
function resolveFallbackCandidatesUncached(params) {
	const primary = params.cfg ? resolveConfiguredModelRef({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: false,
		manifestPlugins: params.manifestPlugins
	}) : null;
	const defaultProvider = primary?.provider ?? "openai";
	const defaultModel = primary?.model ?? "gpt-5.6-sol";
	const providerRaw = normalizeOptionalString(params.provider) || defaultProvider;
	const modelRaw = normalizeOptionalString(params.model) || defaultModel;
	const normalizeCandidateRef = (provider, model) => normalizeModelRef(provider, model, {
		allowPluginNormalization: allowsPluginModelNormalization({
			cfg: params.cfg,
			provider,
			model
		}),
		manifestPlugins: params.manifestPlugins
	});
	const allowPluginModelAliases = params.cfg ? normalizePluginsConfig(params.cfg.plugins).enabled : true;
	const normalizedPrimary = normalizeCandidateRef(providerRaw, modelRaw);
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg ?? {},
		defaultProvider,
		allowPluginNormalization: allowPluginModelAliases,
		manifestPlugins: params.manifestPlugins
	});
	const { candidates, addCandidate } = createModelCandidateCollector();
	const requestedRouteResolution = params.requestedRouteResolution ?? "raw";
	let requestedCandidate = normalizedPrimary;
	const exactRequestedRouteConfigured = hasExactConfiguredProviderModel({
		cfg: params.cfg,
		provider: normalizedPrimary.provider,
		model: normalizedPrimary.model
	}) || aliasIndex.byKey.has(modelKey(normalizedPrimary.provider, normalizedPrimary.model));
	if (requestedRouteResolution === "raw" && !exactRequestedRouteConfigured) requestedCandidate = resolveModelAliasFromPair({
		cfg: params.cfg,
		provider: providerRaw,
		model: modelRaw,
		defaultProvider,
		aliasIndex,
		allowPluginNormalization: allowsPluginModelNormalization({
			cfg: params.cfg,
			provider: providerRaw,
			model: modelRaw
		}),
		manifestPlugins: params.manifestPlugins
	}) ?? normalizedPrimary;
	addCandidate(normalizeCandidateRef(requestedCandidate.provider, requestedCandidate.model), "requested", requestedRouteResolution);
	const modelFallbacks = params.fallbacksOverride !== void 0 ? params.fallbacksOverride : resolveAgentModelFallbackValues(params.cfg?.agents?.defaults?.model);
	for (const raw of modelFallbacks) {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider,
			aliasIndex,
			allowPluginNormalization: allowPluginModelAliases,
			manifestPlugins: params.manifestPlugins
		});
		if (!resolved) continue;
		addCandidate(normalizeCandidateRef(resolved.ref.provider, resolved.ref.model), "configured-fallback", "resolved");
	}
	if (params.fallbacksOverride === void 0 && primary?.provider && primary.model) addCandidate(normalizeCandidateRef(primary.provider, primary.model), "configured-primary", "resolved");
	return candidates;
}
//#endregion
export { findConfiguredModelProvider as a, allowsPluginModelNormalization as i, resolveImageFallbackDefaultProvider as n, resolveModelCandidateChain as r, resolveImageFallbackCandidates as t };
