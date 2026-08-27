import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { m as resolveModelExtraParamSources } from "./openai-routing-mOc2UICM.js";
import { d as resolveClaudeSonnet5ModelIdentity, f as supportsClaude1MContext, u as resolveClaudeOpus5ModelIdentity } from "./src-5i09w5fd.js";
import "./model-selection-DHDS-v4K.js";
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
function resolveConfiguredProviderModel(cfg, provider, model) {
	const providers = (cfg?.models)?.providers;
	const requestedProvider = provider.trim();
	const normalizedProvider = normalizeProviderId(provider);
	const providerEntries = Object.entries(providers ?? {});
	return (providerEntries.find(([providerId]) => providerId.trim() === requestedProvider)?.[1] ?? providerEntries.find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[1])?.models?.find((entry) => {
		const entryId = entry.id?.trim();
		if (!entryId) return false;
		if (entryId === model) return true;
		const slash = entryId.indexOf("/");
		return slash > 0 && normalizeProviderId(entryId.slice(0, slash)) === normalizedProvider && entryId.slice(slash + 1).trim() === model;
	});
}
function resolveProviderQualifiedModel(provider, model) {
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	const prefixedProvider = normalizeProviderId(model.slice(0, slash));
	const bareModel = model.slice(slash + 1).trim();
	return prefixedProvider === normalizeProviderId(provider) && bareModel ? bareModel : void 0;
}
function resolveConfiguredRuntimeModel(cfg, provider, modelProvider, model) {
	const explicitResult = resolveConfiguredProviderModel(cfg, provider, model);
	if (explicitResult) return explicitResult;
	const canonicalProvider = modelProvider?.trim();
	if (!canonicalProvider || normalizeProviderId(canonicalProvider) === normalizeProviderId(provider)) return;
	const canonicalResult = resolveConfiguredProviderModel(cfg, canonicalProvider, model);
	if (canonicalResult) return canonicalResult;
	const canonicalModel = resolveProviderQualifiedModel(canonicalProvider, model);
	return canonicalModel ? resolveConfiguredProviderModel(cfg, canonicalProvider, canonicalModel) : void 0;
}
function readAuthoredModelContextTokens(model) {
	return typeof model?.contextTokens === "number" && model.contextTokens > 0 ? model.contextTokens : void 0;
}
/** Returns only the per-model contextTokens value authored in OpenClaw config. */
function resolveAuthoredModelContextTokens(params) {
	const ref = resolveProviderModelRef(params);
	const explicitProvider = params.provider?.trim();
	if (!ref || !explicitProvider) return;
	return readAuthoredModelContextTokens(resolveConfiguredRuntimeModel(params.cfg, explicitProvider, params.modelProvider, ref.model));
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
	const explicitProvider = params.provider?.trim();
	if (ref && explicitProvider) {
		const configuredModel = resolveConfiguredRuntimeModel(params.cfg, explicitProvider, params.modelProvider, ref.model);
		const extraParamSources = resolveModelExtraParamSources({
			config: params.cfg,
			provider: ref.provider,
			modelId: ref.model
		});
		const effectiveContext1M = extraParamSources.modelParams && Object.hasOwn(extraParamSources.modelParams, "context1m") ? extraParamSources.modelParams.context1m : extraParamSources.defaultParams?.context1m;
		const fixedContextWindow = resolveAnthropicFixedContextWindow(ref.provider, ref.model, { claudeCli1M: effectiveContext1M === true });
		const configuredContextTokens = readAuthoredModelContextTokens(configuredModel);
		const configuredContextWindow = typeof configuredModel?.contextWindow === "number" && configuredModel.contextWindow > 0 ? configuredModel.contextWindow : void 0;
		const configuredTokenLimit = fixedContextWindow ?? configuredContextWindow;
		if (configuredContextTokens !== void 0) return configuredTokenLimit === void 0 ? configuredContextTokens : Math.min(configuredContextTokens, configuredTokenLimit);
		if (fixedContextWindow !== void 0) return fixedContextWindow;
		const providerResult = lookupContextTokens(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const providerWindow = lookupContextWindow(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const discoveredCap = minPositiveContextTokens(providerResult, typeof params.modelContextTokens === "number" && params.modelContextTokens > 0 ? params.modelContextTokens : void 0, providerWindow, typeof params.modelContextWindow === "number" && params.modelContextWindow > 0 ? params.modelContextWindow : void 0);
		if (discoveredCap !== void 0) return configuredContextWindow === void 0 ? discoveredCap : Math.min(discoveredCap, configuredContextWindow);
		if (configuredContextWindow !== void 0) return configuredContextWindow;
	}
	if (params.allowUnscopedModelLookup === false) return params.fallbackContextTokens;
	const bareCap = minPositiveContextTokens(lookupContextTokens(params.model), lookupContextWindow(params.model));
	if (bareCap !== void 0) return bareCap;
	return params.fallbackContextTokens;
}
//#endregion
export { replaceContextWindowCaches as _, ANTHROPIC_SONNET_5_CONTEXT_TOKENS as a, resolveAuthoredModelContextTokens as c, clearContextWindowCaches as d, getContextWindowCaches as f, providerContextTokenCacheKey as g, minPositiveContextTokens as h, ANTHROPIC_OPUS_5_CONTEXT_TOKENS as i, resolveContextTokensForModelFromCache as l, lookupCachedContextWindow as m, ANTHROPIC_FABLE_CONTEXT_TOKENS as n, ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS as o, lookupCachedContextTokens as p, ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS as r, resolveAnthropicFixedContextWindow as s, ANTHROPIC_CONTEXT_1M_TOKENS as t, REUSED_CONTEXT_WINDOW_CACHE_STATE as u, replaceDiscoveredContextTokenCache as v };
