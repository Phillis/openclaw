import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as computeBackoff } from "./src-BQ327IOM.js";
import "./agent-scope-BizOtGGz.js";
import { l as resolveAgentDir, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig, t as projectConfigOntoRuntimeSourceSnapshot } from "./io-CeQckj5v.js";
import { s as normalizeProviderId } from "./model-ref-shared-poyRjWh_.js";
import { m as resolveModelExtraParamSources } from "./openai-routing-BGuHAkXI.js";
import { d as resolveClaudeSonnet5ModelIdentity, f as supportsClaude1MContext, u as resolveClaudeOpus5ModelIdentity } from "./src-88rHSicm.js";
import "./config-Dl8DJbzM.js";
import "./backoff-BkMI1WEL.js";
import "./model-selection-Dg63KcCa.js";
//#region src/agents/context-cache.ts
const CONTEXT_WINDOW_CACHE_STATE_KEY = Symbol.for("openclaw.contextWindowCacheState");
const contextWindowCacheGlobal = globalThis;
const REUSED_CONTEXT_WINDOW_CACHE_STATE = contextWindowCacheGlobal[CONTEXT_WINDOW_CACHE_STATE_KEY] !== void 0;
const CONTEXT_WINDOW_CACHE_STATE = contextWindowCacheGlobal[CONTEXT_WINDOW_CACHE_STATE_KEY] ??= {
	configuredTokenCache: /* @__PURE__ */ new Map(),
	discoveredTokenCache: /* @__PURE__ */ new Map(),
	contextWindowCache: /* @__PURE__ */ new Map()
};
/** Returns the current process-global cache generation. */
function getContextWindowCaches() {
	return CONTEXT_WINDOW_CACHE_STATE;
}
/** Publish one complete context generation without copying it on the gateway thread. */
function replaceContextWindowCaches(params) {
	CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache = params.configuredTokenCache;
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache = params.discoveredTokenCache;
	CONTEXT_WINDOW_CACHE_STATE.contextWindowCache = params.contextWindowCache;
}
/** Publish one complete discovered-metadata generation. */
function replaceDiscoveredContextTokenCache(cache) {
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache = cache;
}
/** Clear the current process-global cache generation. */
function clearContextWindowCaches() {
	CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache.clear();
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache.clear();
	CONTEXT_WINDOW_CACHE_STATE.contextWindowCache.clear();
}
const PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX = "\0provider:";
/** Internal cache key for discovery metadata with verified provider ownership. */
function providerContextTokenCacheKey(provider, modelId) {
	return `${PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX}${provider}\0${modelId}`;
}
/** Looks up cached context-token count for a model id. */
function lookupCachedContextTokens(modelId) {
	if (!modelId) return;
	return CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache.get(modelId) ?? CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache.get(modelId);
}
/** Looks up a configured native context window without treating it as an effective runtime cap. */
function lookupCachedContextWindow(modelId) {
	if (!modelId) return;
	return CONTEXT_WINDOW_CACHE_STATE.contextWindowCache.get(modelId);
}
/** Returns the lowest positive context limit from independently sourced metadata. */
function minPositiveContextTokens(...values) {
	let result;
	for (const value of values) {
		if (typeof value !== "number" || value <= 0) continue;
		result = result === void 0 ? value : Math.min(result, value);
	}
	return result;
}
//#endregion
//#region src/agents/context-resolution.ts
const ANTHROPIC_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_OPUS_5_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_SONNET_5_CONTEXT_TOKENS = 1e6;
function resolveProviderModelRef(params) {
	const modelRaw = params.model?.trim();
	if (!modelRaw) return;
	const providerRaw = params.provider?.trim();
	if (providerRaw) {
		const provider = normalizeProviderId(providerRaw);
		return provider ? {
			provider,
			model: modelRaw
		} : void 0;
	}
	const slash = modelRaw.indexOf("/");
	if (slash <= 0) return;
	const provider = normalizeProviderId(modelRaw.slice(0, slash));
	const model = modelRaw.slice(slash + 1).trim();
	return provider && model ? {
		provider,
		model
	} : void 0;
}
function resolveConfiguredProviderContextTokens(cfg, provider, model) {
	const providers = (cfg?.models)?.providers;
	if (!providers) return;
	function readProviderContextTokens(providerConfig) {
		if (typeof providerConfig?.contextTokens === "number" && providerConfig.contextTokens > 0) return {
			value: providerConfig.contextTokens,
			source: "contextTokens"
		};
		if (typeof providerConfig?.contextWindow === "number" && providerConfig.contextWindow > 0) return {
			value: providerConfig.contextWindow,
			source: "contextWindow"
		};
	}
	function findContextTokens(matchProviderId) {
		for (const [providerId, providerConfig] of Object.entries(providers)) {
			if (!matchProviderId(providerId)) continue;
			if (Array.isArray(providerConfig?.models)) for (const entry of providerConfig.models) {
				const entryId = typeof entry?.id === "string" ? entry.id : "";
				const slash = entryId.indexOf("/");
				const prefixedProvider = slash > 0 ? normalizeProviderId(entryId.slice(0, slash)) : "";
				const bareEntryId = slash > 0 ? entryId.slice(slash + 1).trim() : "";
				const modelMatches = entryId === model || prefixedProvider === normalizeProviderId(providerId) && bareEntryId === model;
				if (modelMatches && typeof entry.contextTokens === "number" && entry.contextTokens > 0) return {
					value: entry.contextTokens,
					source: "contextTokens"
				};
				if (modelMatches && typeof entry.contextWindow === "number" && entry.contextWindow > 0) return {
					value: entry.contextWindow,
					source: "contextWindow"
				};
			}
			const providerContextTokens = readProviderContextTokens(providerConfig);
			if (providerContextTokens) return providerContextTokens;
		}
	}
	const exactResult = findContextTokens((id) => normalizeLowercaseStringOrEmpty(id) === normalizeLowercaseStringOrEmpty(provider));
	if (exactResult !== void 0) return exactResult;
	const normalizedProvider = normalizeProviderId(provider);
	return findContextTokens((id) => normalizeProviderId(id) === normalizedProvider);
}
function resolveProviderQualifiedModel(provider, model) {
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	const prefixedProvider = normalizeProviderId(model.slice(0, slash));
	const bareModel = model.slice(slash + 1).trim();
	return prefixedProvider === normalizeProviderId(provider) && bareModel ? bareModel : void 0;
}
function resolveConfiguredRuntimeContextTokens(cfg, provider, modelProvider, model) {
	const explicitResult = resolveConfiguredProviderContextTokens(cfg, provider, model);
	if (explicitResult) return explicitResult;
	const canonicalProvider = modelProvider?.trim();
	if (!canonicalProvider || normalizeProviderId(canonicalProvider) === normalizeProviderId(provider)) return;
	const canonicalResult = resolveConfiguredProviderContextTokens(cfg, canonicalProvider, model);
	if (canonicalResult) return canonicalResult;
	const canonicalModel = resolveProviderQualifiedModel(canonicalProvider, model);
	return canonicalModel ? resolveConfiguredProviderContextTokens(cfg, canonicalProvider, canonicalModel) : void 0;
}
function resolveModelFamilyId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return normalized.includes("/") ? normalized.split("/").at(-1) ?? normalized : normalized;
}
function resolveAnthropicFixedContextWindow(provider, model, options) {
	const modelId = resolveModelFamilyId(model);
	if (!(provider === "anthropic" || provider === "anthropic-vertex" || provider === "claude-cli")) return;
	if (/^claude-fable-5(?=$|[^a-z0-9])/.test(modelId)) return ANTHROPIC_FABLE_CONTEXT_TOKENS;
	if ((provider === "anthropic" || provider === "anthropic-vertex") && /^claude-mythos-5(?=$|[^a-z0-9])/.test(modelId)) return ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS;
	if (resolveClaudeOpus5ModelIdentity({ id: modelId })) return ANTHROPIC_OPUS_5_CONTEXT_TOKENS;
	if (resolveClaudeSonnet5ModelIdentity({ id: modelId })) return ANTHROPIC_SONNET_5_CONTEXT_TOKENS;
	if (!supportsClaude1MContext({ id: modelId })) return;
	if (provider === "claude-cli" && !modelId.endsWith("[1m]") && options?.claudeCli1M !== true) return;
	return provider === "anthropic-vertex" ? ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS : ANTHROPIC_CONTEXT_1M_TOKENS;
}
function resolveContextTokensForModelFromCache(params, lookupContextTokens = lookupCachedContextTokens, lookupContextWindow = lookupCachedContextWindow) {
	const ref = resolveProviderModelRef(params);
	const override = typeof params.contextTokensOverride === "number" && params.contextTokensOverride > 0 ? params.contextTokensOverride : void 0;
	const capOverride = (contextTokens) => override !== void 0 ? Math.min(override, contextTokens) : contextTokens;
	const explicitProvider = params.provider?.trim();
	if (ref && explicitProvider) {
		const configuredWindow = resolveConfiguredRuntimeContextTokens(params.cfg, explicitProvider, params.modelProvider, ref.model);
		const sourceConfiguredWindow = resolveConfiguredRuntimeContextTokens(params.sourceCfg === void 0 ? params.cfg : params.sourceCfg, explicitProvider, params.modelProvider, ref.model);
		const extraParamSources = resolveModelExtraParamSources({
			config: params.cfg,
			provider: ref.provider,
			modelId: ref.model
		});
		const effectiveContext1M = extraParamSources.modelParams && Object.hasOwn(extraParamSources.modelParams, "context1m") ? extraParamSources.modelParams.context1m : extraParamSources.defaultParams?.context1m;
		const fixedContextWindow = resolveAnthropicFixedContextWindow(ref.provider, ref.model, { claudeCli1M: effectiveContext1M === true });
		const providerResult = lookupContextTokens(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const providerWindow = lookupContextWindow(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const modelContextTokens = typeof params.modelContextTokens === "number" && params.modelContextTokens > 0 ? params.modelContextTokens : void 0;
		const modelContextWindow = typeof params.modelContextWindow === "number" && params.modelContextWindow > 0 ? params.modelContextWindow : void 0;
		const runtimeCap = minPositiveContextTokens(providerResult, modelContextTokens, fixedContextWindow === void 0 ? providerWindow : void 0, fixedContextWindow === void 0 ? modelContextWindow : void 0);
		if (configuredWindow) {
			if (configuredWindow.source === "contextTokens") return capOverride(fixedContextWindow === void 0 ? configuredWindow.value : Math.min(configuredWindow.value, fixedContextWindow));
			const authoredContextWindow = sourceConfiguredWindow?.source === "contextWindow" ? sourceConfiguredWindow.value : void 0;
			if (fixedContextWindow !== void 0 && authoredContextWindow === void 0) return capOverride(runtimeCap === void 0 ? fixedContextWindow : Math.min(runtimeCap, fixedContextWindow));
			if (fixedContextWindow !== void 0) {
				const effectiveCap = minPositiveContextTokens(authoredContextWindow, fixedContextWindow, runtimeCap);
				return effectiveCap === void 0 ? void 0 : capOverride(effectiveCap);
			}
			if (runtimeCap !== void 0) return capOverride(Math.min(configuredWindow.value, runtimeCap));
			return capOverride(configuredWindow.value);
		}
		if (runtimeCap !== void 0) return capOverride(fixedContextWindow === void 0 ? runtimeCap : Math.min(runtimeCap, fixedContextWindow));
		if (fixedContextWindow !== void 0) return capOverride(fixedContextWindow);
	}
	if (params.allowUnscopedModelLookup === false) return override ?? params.fallbackContextTokens;
	const bareCap = minPositiveContextTokens(lookupContextTokens(params.model), lookupContextWindow(params.model));
	if (bareCap !== void 0) return Boolean(explicitProvider && ref?.model.includes("/")) && override !== void 0 ? override : capOverride(bareCap);
	return override ?? params.fallbackContextTokens;
}
//#endregion
//#region src/agents/context-cache-projection.ts
const CONTEXT_PROJECTION_BATCH_SIZE = 512;
function cacheMinimum(cache, key, contextTokens) {
	const existing = cache.get(key);
	if (existing === void 0 || contextTokens < existing) cache.set(key, contextTokens);
}
function applyDiscoveredContextWindow(cache, model) {
	if (!model?.id) return;
	const discoveredContextTokens = typeof model.contextTokens === "number" ? Math.trunc(model.contextTokens) : typeof model.contextWindow === "number" ? Math.trunc(model.contextWindow) : void 0;
	const contextTokens = resolveDiscoveredAnthropicFixedContextWindow(model) ?? discoveredContextTokens;
	if (!contextTokens || contextTokens <= 0) return;
	cacheMinimum(cache, model.id, contextTokens);
	if (typeof model.provider !== "string") return;
	const provider = normalizeProviderId(model.provider);
	if (!provider) return;
	cacheMinimum(cache, providerContextTokenCacheKey(provider, model.id), contextTokens);
	const slash = model.id.indexOf("/");
	const prefixedProvider = slash > 0 ? normalizeProviderId(model.id.slice(0, slash)) : "";
	const bareModelId = slash > 0 ? model.id.slice(slash + 1).trim() : "";
	if (prefixedProvider === provider && bareModelId) cacheMinimum(cache, providerContextTokenCacheKey(provider, bareModelId), contextTokens);
}
function applyDiscoveredContextWindows(params) {
	for (const model of params.models) applyDiscoveredContextWindow(params.cache, model);
}
function applyConfiguredContextWindows(params) {
	const providers = params.modelsConfig?.providers;
	if (!providers || typeof providers !== "object") return;
	for (const [providerId, provider] of Object.entries(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) applyConfiguredContextWindow({
			cache: params.cache,
			windowCache: params.windowCache,
			providerId,
			provider,
			model
		});
	}
}
function applyConfiguredContextWindow(params) {
	const modelId = typeof params.model?.id === "string" ? params.model.id : void 0;
	const contextTokens = typeof params.model?.contextTokens === "number" ? params.model.contextTokens : typeof params.provider.contextTokens === "number" ? params.provider.contextTokens : void 0;
	const contextWindow = typeof params.model?.contextWindow === "number" ? params.model.contextWindow : typeof params.provider.contextWindow === "number" ? params.provider.contextWindow : void 0;
	const configuredValue = contextTokens && contextTokens > 0 ? {
		cache: params.cache,
		value: contextTokens
	} : contextWindow && contextWindow > 0 ? {
		cache: params.windowCache,
		value: contextWindow
	} : void 0;
	if (!modelId || !configuredValue) return;
	const provider = normalizeProviderId(params.providerId);
	configuredValue.cache.set(modelId, configuredValue.value);
	configuredValue.cache.set(providerContextTokenCacheKey(provider, modelId), configuredValue.value);
	const slash = modelId.indexOf("/");
	const prefixedProvider = slash > 0 ? normalizeProviderId(modelId.slice(0, slash)) : "";
	const bareModelId = slash > 0 ? modelId.slice(slash + 1).trim() : "";
	if (provider && prefixedProvider === provider && bareModelId) configuredValue.cache.set(providerContextTokenCacheKey(provider, bareModelId), configuredValue.value);
}
function resolveDiscoveredAnthropicFixedContextWindow(model) {
	const provider = typeof model.provider === "string" ? normalizeProviderId(model.provider) : void 0;
	if (provider) return resolveAnthropicFixedContextWindow(provider, model.id);
	const normalized = normalizeLowercaseStringOrEmpty(model.id);
	const slash = normalized.indexOf("/");
	if (slash < 0) return;
	const inferredProvider = normalizeProviderId(normalized.slice(0, slash));
	const inferredModel = normalized.slice(slash + 1);
	return inferredProvider === "claude-cli" ? resolveAnthropicFixedContextWindow(inferredProvider, inferredModel) : void 0;
}
function yieldToGateway() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
async function projectModels(params) {
	for (const model of params.models) {
		applyDiscoveredContextWindow(params.cache, model);
		params.processed.count += 1;
		if (params.processed.count % CONTEXT_PROJECTION_BATCH_SIZE === 0) {
			await yieldToGateway();
			params.assertCurrent?.();
		}
	}
}
async function prepareContextWindowCaches(params) {
	const caches = {
		configuredTokenCache: /* @__PURE__ */ new Map(),
		discoveredTokenCache: /* @__PURE__ */ new Map(),
		contextWindowCache: /* @__PURE__ */ new Map()
	};
	const processed = { count: 0 };
	const providers = params.config.models?.providers;
	if (providers && typeof providers === "object") for (const [providerId, provider] of Object.entries(providers)) {
		if (!Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			applyConfiguredContextWindow({
				cache: caches.configuredTokenCache,
				windowCache: caches.contextWindowCache,
				providerId,
				provider,
				model
			});
			processed.count += 1;
			if (processed.count % CONTEXT_PROJECTION_BATCH_SIZE === 0) {
				await yieldToGateway();
				params.assertCurrent?.();
			}
		}
	}
	await projectModels({
		cache: caches.discoveredTokenCache,
		models: params.modelCatalog.entries,
		processed,
		assertCurrent: params.assertCurrent
	});
	await projectModels({
		cache: caches.discoveredTokenCache,
		models: params.modelCatalog.staticEntries ?? [],
		processed,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return caches;
}
async function prepareDiscoveredContextTokenCache(params) {
	const cache = /* @__PURE__ */ new Map();
	const processed = { count: 0 };
	await projectModels({
		cache,
		models: params.modelCatalog.entries,
		processed,
		assertCurrent: params.assertCurrent
	});
	await projectModels({
		cache,
		models: params.modelCatalog.staticEntries ?? [],
		processed,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	return cache;
}
//#endregion
//#region src/agents/context-runtime-state.ts
const CONTEXT_WINDOW_RUNTIME_STATE_KEY = Symbol.for("openclaw.contextWindowRuntimeState");
/** Shared mutable state for context-window resolution and model discovery. */
const CONTEXT_WINDOW_RUNTIME_STATE = (() => {
	const globalState = globalThis;
	let state = globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY];
	if (!state) {
		state = {
			generation: 0,
			loadPromise: null,
			loadGeneration: null,
			configuredConfig: void 0,
			configLoadFailures: 0,
			nextConfigLoadAttemptAtMs: 0,
			modelsConfigRuntimeLoader: createLazyImportLoader(() => import("./agents/models-config.runtime.js"))
		};
		globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] = state;
	} else {
		if (!REUSED_CONTEXT_WINDOW_CACHE_STATE) {
			state.loadPromise = null;
			state.loadGeneration = null;
		}
		if (typeof state.generation !== "number") state.generation = 0;
		if (state.loadGeneration === void 0) state.loadGeneration = null;
		state.modelsConfigRuntimeLoader ??= createLazyImportLoader(() => import("./agents/models-config.runtime.js"));
	}
	return state;
})();
/** Invalidate prepared context metadata while a replacement load is staged. */
function beginContextWindowCacheRefresh() {
	CONTEXT_WINDOW_RUNTIME_STATE.generation += 1;
	CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = void 0;
	CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
	CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
}
/** Reset prepared context-window state after model config or plugin metadata changes. */
function resetContextWindowCache() {
	beginContextWindowCacheRefresh();
	CONTEXT_WINDOW_RUNTIME_STATE.modelsConfigRuntimeLoader.clear();
	clearContextWindowCaches();
}
/** Reset context-window runtime state and token cache for isolated tests. */
function resetContextWindowCacheForTest() {
	resetContextWindowCache();
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
	initialMs: 1e3,
	maxMs: 6e4,
	factor: 2,
	jitter: 0
};
const loadPreparedModelCatalogRuntime = () => import("./prepared-model-catalog-BGLDTo2i.js");
function primeConfiguredContextWindowsFromConfig(cfg) {
	const caches = getContextWindowCaches();
	applyConfiguredContextWindows({
		cache: caches.configuredTokenCache,
		windowCache: caches.contextWindowCache,
		modelsConfig: cfg.models
	});
	CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = cfg;
	CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
	CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
	return cfg;
}
function primeConfiguredContextWindows() {
	if (CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig) return primeConfiguredContextWindowsFromConfig(CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig);
	if (Date.now() < CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs) return;
	try {
		return primeConfiguredContextWindowsFromConfig(getRuntimeConfig());
	} catch {
		CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures += 1;
		const backoffMs = computeBackoff(CONFIG_LOAD_RETRY_POLICY, CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures);
		CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = Date.now() + backoffMs;
		return;
	}
}
function ensureContextWindowCacheLoadedFromOwner(params) {
	const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
	if (CONTEXT_WINDOW_RUNTIME_STATE.loadPromise && CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration === generation) return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
	const cfg = params.catalogOwner ? primeConfiguredContextWindowsFromConfig(params.catalogOwner.config) : params.cfgOverride ? primeConfiguredContextWindowsFromConfig(params.cfgOverride) : primeConfiguredContextWindows();
	if (!cfg) return Promise.resolve();
	CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = Promise.resolve().then(async () => {
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
		let stagedTokenCache = /* @__PURE__ */ new Map();
		try {
			const catalogResult = params.catalogOwner ? {
				status: "fulfilled",
				value: params.catalogOwner
			} : await (async () => {
				const { loadPreparedModelCatalogOwnerSnapshot } = await loadPreparedModelCatalogRuntime();
				const defaultAgentId = resolveDefaultAgentId(cfg);
				return await loadPreparedModelCatalogOwnerSnapshot({
					config: cfg,
					agentId: defaultAgentId,
					agentDir: resolveAgentDir(cfg, defaultAgentId),
					readOnly: true
				}).then((value) => ({
					status: "fulfilled",
					value
				}), (reason) => ({
					status: "rejected",
					reason
				}));
			})();
			if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
			if (catalogResult.status === "fulfilled") stagedTokenCache = await prepareDiscoveredContextTokenCache({
				modelCatalog: catalogResult.value.modelCatalog,
				assertCurrent: () => {
					if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) throw new Error("context window cache generation was superseded");
				}
			});
		} catch {}
		if (CONTEXT_WINDOW_RUNTIME_STATE.generation === generation) replaceDiscoveredContextTokenCache(stagedTokenCache);
	}).catch(() => {});
	CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
	return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
}
function ensureContextWindowCacheLoaded(cfgOverride) {
	return ensureContextWindowCacheLoadedFromOwner({ cfgOverride });
}
/**
* Reuse the Gateway's published catalog generation. Omitting the Gateway binding
* falls through to a read-only owner whose key hashes the full model config.
*/
async function prewarmContextWindowCacheAfterReady(params) {
	beginContextWindowCacheRefresh();
	const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
	const shouldStop = () => CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation || params.isCancelled?.() === true;
	if (shouldStop()) return;
	let published = false;
	const loadPromise = (async () => {
		const { getPublishedPreparedModelCatalogOwnerSnapshot } = await loadPreparedModelCatalogRuntime();
		if (shouldStop()) return;
		const defaultAgentId = resolveDefaultAgentId(params.config);
		const owner = getPublishedPreparedModelCatalogOwnerSnapshot({
			config: params.config,
			agentId: defaultAgentId,
			agentDir: resolveAgentDir(params.config, defaultAgentId),
			allowGatewaySubagentBinding: true
		});
		if (!owner) throw new Error("published Gateway model catalog owner is unavailable");
		if (shouldStop()) return;
		const caches = await prepareContextWindowCaches({
			config: owner.config,
			modelCatalog: owner.modelCatalog,
			assertCurrent: () => {
				if (shouldStop()) throw new Error("context window cache prewarm cancelled");
			}
		});
		if (shouldStop()) return;
		replaceContextWindowCaches(caches);
		CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = owner.config;
		CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
		CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
		published = true;
	})();
	const trackedLoadPromise = loadPromise.catch(() => {});
	CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = trackedLoadPromise;
	CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
	try {
		await loadPromise;
	} catch {} finally {
		if (!published && CONTEXT_WINDOW_RUNTIME_STATE.generation === generation && CONTEXT_WINDOW_RUNTIME_STATE.loadPromise === trackedLoadPromise) {
			CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = null;
			CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = null;
		}
	}
}
async function waitForContextWindowCacheLoad(options) {
	const promise = CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
	if (!promise || CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration !== CONTEXT_WINDOW_RUNTIME_STATE.generation) return "idle";
	const timeoutMs = Math.max(0, Math.trunc(options?.timeoutMs ?? 250));
	if (timeoutMs === 0) return "timeout";
	let timeoutHandle = null;
	try {
		return await Promise.race([promise.then(() => "loaded"), new Promise((resolve) => {
			timeoutHandle = setTimeout(() => resolve("timeout"), timeoutMs);
			timeoutHandle.unref?.();
		})]);
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
	}
}
/** Replace cached model context metadata for the active runtime configuration. */
async function refreshContextWindowCache(cfg) {
	beginContextWindowCacheRefresh();
	const caches = getContextWindowCaches();
	caches.configuredTokenCache.clear();
	caches.contextWindowCache.clear();
	primeConfiguredContextWindowsFromConfig(cfg);
	await ensureContextWindowCacheLoaded();
}
function prepareContextWindowCache(options) {
	if (options?.skipRuntimeConfigLoad) return;
	if (options?.allowAsyncLoad === false) primeConfiguredContextWindows();
	else ensureContextWindowCacheLoaded();
}
function lookupContextTokens(modelId, options) {
	if (!modelId) return;
	prepareContextWindowCache(options);
	return minPositiveContextTokens(lookupCachedContextTokens(modelId), lookupCachedContextWindow(modelId));
}
function resolveContextTokensForModel(params) {
	prepareContextWindowCache({
		allowAsyncLoad: params.allowAsyncLoad,
		skipRuntimeConfigLoad: Boolean(params.cfg)
	});
	const sourceCfg = params.sourceCfg !== void 0 ? params.sourceCfg : params.cfg ? projectConfigOntoRuntimeSourceSnapshot(params.cfg) : void 0;
	return resolveContextTokensForModelFromCache({
		...params,
		sourceCfg
	}, (modelId) => lookupCachedContextTokens(modelId), (modelId) => lookupCachedContextWindow(modelId));
}
//#endregion
export { resolveContextTokensForModel as a, applyConfiguredContextWindows as c, ANTHROPIC_FABLE_CONTEXT_TOKENS as d, ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS as f, resolveContextTokensForModelFromCache as g, ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS as h, refreshContextWindowCache as i, applyDiscoveredContextWindows as l, ANTHROPIC_SONNET_5_CONTEXT_TOKENS as m, lookupContextTokens as n, waitForContextWindowCacheLoad as o, ANTHROPIC_OPUS_5_CONTEXT_TOKENS as p, prewarmContextWindowCacheAfterReady as r, resetContextWindowCacheForTest as s, ensureContextWindowCacheLoaded as t, ANTHROPIC_CONTEXT_1M_TOKENS as u };
