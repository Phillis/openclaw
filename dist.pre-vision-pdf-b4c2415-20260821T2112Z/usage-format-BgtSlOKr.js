import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { l as resolveAgentDir, r as listAgentEntries, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { l as tryReadJsonSync } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-CqyEIHSI.js";
import { o as normalizeModelRef, s as normalizeProviderId } from "./model-ref-shared-poyRjWh_.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { n as getRemoteModelCatalogPricing, t as planEffectiveModelCatalogRows } from "./model-catalog-CvIVbKms.js";
import "./model-selection-Dg63KcCa.js";
import { createHash } from "node:crypto";
import path from "node:path";
import { isIP } from "node:net";
//#region src/model-catalog/pricing.ts
const EMPTY_CONFIG = {};
const pricingContextByConfig = /* @__PURE__ */ new WeakMap();
function normalizePolicy(policy) {
	if (!policy) return;
	return { external: policy.external !== false };
}
function activeManifestRegistry(snapshot, config) {
	if (config.plugins?.enabled === false) return {
		plugins: [],
		diagnostics: []
	};
	return {
		diagnostics: snapshot.manifestRegistry.diagnostics,
		plugins: snapshot.manifestRegistry.plugins.filter((plugin) => isInstalledPluginEnabled(snapshot.index, plugin.id, config))
	};
}
function normalizedHostedKey(key, manifestPlugins) {
	const slash = key.indexOf("/");
	if (slash <= 0 || slash === key.length - 1) return;
	const normalized = normalizeModelRef(key.slice(0, slash), key.slice(slash + 1), { manifestPlugins });
	return modelKey(normalized.provider, normalized.model);
}
function buildPricingContext(config) {
	let snapshot;
	try {
		snapshot = resolvePluginMetadataSnapshot({
			config,
			env: process.env,
			allowWorkspaceScopedCurrent: true
		});
	} catch {
		snapshot = void 0;
	}
	const registry = snapshot ? activeManifestRegistry(snapshot, config) : {
		plugins: [],
		diagnostics: []
	};
	const catalog = /* @__PURE__ */ new Map();
	for (const row of planEffectiveModelCatalogRows({
		registry,
		config
	}).rows) if (row.cost) catalog.set(modelKey(row.provider, row.id), row.cost);
	const policies = /* @__PURE__ */ new Map();
	for (const plugin of registry.plugins) for (const [provider, rawPolicy] of Object.entries(plugin.modelPricing?.providers ?? {})) {
		const policy = normalizePolicy(rawPolicy);
		if (policy) policies.set(provider, policy);
	}
	const hosted = snapshot ? getRemoteModelCatalogPricing(config) ?? {} : {};
	const normalizedHosted = /* @__PURE__ */ new Map();
	for (const [key, pricing] of Object.entries(hosted).toSorted(([a], [b]) => a.localeCompare(b))) {
		const normalized = normalizedHostedKey(key, snapshot?.plugins);
		if (normalized && !normalizedHosted.has(normalized)) normalizedHosted.set(normalized, pricing);
	}
	const fingerprint = JSON.stringify({
		catalog: [...catalog.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
		hosted: Object.entries(hosted).toSorted(([a], [b]) => a.localeCompare(b)),
		normalizedHosted: [...normalizedHosted.entries()].toSorted(([a], [b]) => a.localeCompare(b)),
		policies: [...policies.entries()].toSorted(([a], [b]) => a.localeCompare(b))
	});
	return {
		snapshot,
		catalog,
		hosted,
		normalizedHosted,
		policies,
		fingerprint
	};
}
function getPricingContext(config) {
	const existing = pricingContextByConfig.get(config);
	if (existing) return existing;
	const context = buildPricingContext(config);
	pricingContextByConfig.set(config, context);
	return context;
}
function hasKnownPricing(pricing) {
	return Boolean(pricing.tieredPricing?.some((tier) => tier.input > 0 || tier.output > 0 || tier.cacheRead > 0 || tier.cacheWrite > 0)) || (pricing.input ?? 0) > 0 || (pricing.output ?? 0) > 0 || (pricing.cacheRead ?? 0) > 0 || (pricing.cacheWrite ?? 0) > 0;
}
function isPrivateOrLoopbackHost(hostname) {
	const host = hostname.trim().toLowerCase().replace(/^\[|\]$/gu, "");
	if (host === "localhost" || host === "localhost.localdomain" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
	const addressFamily = isIP(host);
	if (addressFamily === 6) return host === "::1" || host === "0:0:0:0:0:0:0:1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd");
	if (addressFamily === 4) return host.startsWith("127.") || host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.") || /^172\.(1[6-9]|2\d|3[0-1])\./u.test(host);
	return false;
}
function isPrivateOrLoopbackUrl(value) {
	if (!value) return false;
	try {
		return isPrivateOrLoopbackHost(new URL(value).hostname);
	} catch {
		return false;
	}
}
function findConfiguredModel(config, provider, model, manifestPlugins) {
	return config.models?.providers?.[provider]?.models?.find((entry) => {
		const normalized = normalizeModelRef(provider, entry.id, { manifestPlugins });
		return modelKey(normalized.provider, normalized.model) === modelKey(provider, model);
	});
}
function allowsHostedPricing(config, provider, model, manifestPlugins) {
	const providerConfig = config.models?.providers?.[provider];
	return !(isPrivateOrLoopbackUrl(findConfiguredModel(config, provider, model, manifestPlugins)?.baseUrl) || isPrivateOrLoopbackUrl(providerConfig?.baseUrl));
}
function resolveCatalogModelPricing(params) {
	const config = params.config ?? EMPTY_CONFIG;
	const context = getPricingContext(config);
	const normalized = normalizeModelRef(params.provider, params.model, { manifestPlugins: context.snapshot?.plugins });
	if (!allowsHostedPricing(config, normalized.provider, normalized.model, context.snapshot?.plugins)) return;
	const pricing = context.catalog.get(modelKey(normalized.provider, normalized.model));
	return pricing && hasKnownPricing(pricing) ? pricing : void 0;
}
function resolveHostedModelPricing(params) {
	const config = params.config ?? EMPTY_CONFIG;
	const context = getPricingContext(config);
	const normalized = normalizeModelRef(params.provider, params.model, { manifestPlugins: context.snapshot?.plugins });
	if (context.policies.get(normalized.provider)?.external === false || !allowsHostedPricing(config, normalized.provider, normalized.model, context.snapshot?.plugins)) return;
	const key = modelKey(normalized.provider, normalized.model);
	const pricing = context.hosted[key] ?? (context.policies.has(normalized.provider) ? void 0 : context.normalizedHosted.get(key));
	return pricing && hasKnownPricing(pricing) ? pricing : void 0;
}
function modelCatalogPricingFingerprint(config) {
	const resolvedConfig = config ?? EMPTY_CONFIG;
	const context = getPricingContext(resolvedConfig);
	const configuredEndpoints = Object.entries(resolvedConfig.models?.providers ?? {}).toSorted(([a], [b]) => a.localeCompare(b)).map(([provider, providerConfig]) => ({
		provider,
		baseUrl: providerConfig.baseUrl,
		models: (providerConfig.models ?? []).map((model) => ({
			id: model.id,
			baseUrl: model.baseUrl
		})).toSorted((a, b) => a.id.localeCompare(b.id))
	}));
	return JSON.stringify({
		pricing: context.fingerprint,
		configuredEndpoints
	});
}
//#endregion
//#region src/utils/usage-format-pricing.ts
function normalizeTieredPricing(raw) {
	if (!raw || raw.length === 0) return;
	const result = [];
	for (const tier of raw) {
		const range = tier.range;
		const start = Array.isArray(range) && typeof range[0] === "number" ? range[0] : NaN;
		if (!Number.isFinite(start)) continue;
		const rawEnd = range.length >= 2 ? range[1] : null;
		const end = typeof rawEnd === "number" && Number.isFinite(rawEnd) && rawEnd > start ? rawEnd : Infinity;
		if (!Number.isFinite(tier.input) || !Number.isFinite(tier.output) || !Number.isFinite(tier.cacheRead) || !Number.isFinite(tier.cacheWrite)) continue;
		result.push({
			input: tier.input,
			output: tier.output,
			cacheRead: tier.cacheRead,
			cacheWrite: tier.cacheWrite,
			range: [start, end]
		});
	}
	return result.length > 0 ? result.toSorted((a, b) => a.range[0] - b.range[0]) : void 0;
}
function normalizeModelCostConfig(cost) {
	const normalizedTiers = normalizeTieredPricing(cost.tieredPricing);
	return {
		input: cost.input,
		output: cost.output,
		cacheRead: cost.cacheRead,
		cacheWrite: cost.cacheWrite,
		...normalizedTiers ? { tieredPricing: normalizedTiers } : {}
	};
}
function normalizeResolvedPricing(cost) {
	const finiteOrZero = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
	return normalizeModelCostConfig({
		input: finiteOrZero(cost.input),
		output: finiteOrZero(cost.output),
		cacheRead: finiteOrZero(cost.cacheRead),
		cacheWrite: finiteOrZero(cost.cacheWrite),
		...cost.tieredPricing ? { tieredPricing: cost.tieredPricing } : {}
	});
}
//#endregion
//#region src/utils/usage-format.ts
/**
* Shared token/cost formatting and pricing lookup helpers for CLI, TUI, gateway, and status output.
* Keep this module synchronous; request paths call it while rendering usage summaries.
*/
const EMPTY_PROVIDER_COST_INDEX = /* @__PURE__ */ new Map();
const MODELS_JSON_COST_CACHE_LIMIT = 128;
const MODEL_KEY_CACHE_LIMIT = 4096;
let modelsJsonCostCacheByAgentDir = /* @__PURE__ */ new Map();
let providerCostIndexByConfig = /* @__PURE__ */ new WeakMap();
let modelKeyCache = /* @__PURE__ */ new Map();
let sortedPricingTiersByInput = /* @__PURE__ */ new WeakMap();
/** Formats a USD amount for usage summaries, keeping tiny costs visible. */
function formatUsd(value) {
	if (value === void 0 || !Number.isFinite(value)) return;
	if (value >= .01) return `$${value.toFixed(2)}`;
	return `$${value.toFixed(4)}`;
}
function toResolvedModelKey(params) {
	const cacheKey = [
		"resolved",
		params.allowPluginNormalization === false ? "raw" : "default",
		params.provider ?? "",
		params.model ?? ""
	].join("\0");
	if (modelKeyCache.has(cacheKey)) return modelKeyCache.get(cacheKey) ?? null;
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!provider || !model) {
		cacheModelKey(cacheKey, null);
		return null;
	}
	const normalized = normalizeModelRef(provider, model, {
		allowManifestNormalization: params.allowPluginNormalization === false ? false : void 0,
		allowPluginNormalization: params.allowPluginNormalization
	});
	const key = modelKey(normalized.provider, normalized.model);
	cacheModelKey(cacheKey, key);
	return key;
}
function toDirectModelKey(params) {
	const cacheKey = [
		"direct",
		params.provider ?? "",
		params.model ?? ""
	].join("\0");
	if (modelKeyCache.has(cacheKey)) return modelKeyCache.get(cacheKey) ?? null;
	const provider = normalizeProviderId(normalizeOptionalString(params.provider) ?? "");
	const model = normalizeOptionalString(params.model);
	if (!provider || !model) {
		cacheModelKey(cacheKey, null);
		return null;
	}
	const key = modelKey(provider, model);
	cacheModelKey(cacheKey, key);
	return key;
}
function cacheModelKey(cacheKey, key) {
	if (modelKeyCache.size >= MODEL_KEY_CACHE_LIMIT) modelKeyCache.clear();
	modelKeyCache.set(cacheKey, key);
}
function shouldUseNormalizedCostLookup(params) {
	const provider = normalizeProviderId(normalizeOptionalString(params.provider) ?? "");
	const model = normalizeOptionalString(params.model) ?? "";
	if (!provider || !model) return false;
	return provider === "anthropic" || provider === "openrouter" || provider === "vercel-ai-gateway";
}
function isRawModelCostConfig(value) {
	return value !== null && typeof value === "object";
}
function buildProviderCostStructureFingerprint(providers) {
	if (!providers) return "";
	return Object.entries(providers).toSorted(([a], [b]) => a.localeCompare(b)).flatMap(([providerKey, providerConfig]) => (providerConfig?.models ?? []).map((model) => `${providerKey}\0${model.id}\0${isRawModelCostConfig(model.cost) ? "cost" : "metadata"}`)).join("\0");
}
function buildProviderCostIndexBundle(providers, options) {
	const entries = /* @__PURE__ */ new Map();
	const sources = /* @__PURE__ */ new Map();
	const structureFingerprint = buildProviderCostStructureFingerprint(providers);
	if (!providers) return {
		entries,
		sources,
		structureFingerprint
	};
	for (const [providerKey, providerConfig] of Object.entries(providers)) {
		const normalizedProvider = normalizeProviderId(providerKey);
		for (const model of providerConfig?.models ?? []) {
			const normalized = normalizeModelRef(normalizedProvider, model.id, {
				allowManifestNormalization: options?.allowManifestNormalization ?? (options?.allowPluginNormalization === false ? false : void 0),
				allowPluginNormalization: options?.allowPluginNormalization
			});
			const key = modelKey(normalized.provider, normalized.model);
			if (!isRawModelCostConfig(model.cost)) continue;
			const rawCost = model.cost;
			entries.set(key, normalizeModelCostConfig(rawCost));
			sources.set(key, {
				fingerprint: buildModelCostFingerprint(rawCost),
				model,
				providerKey,
				rawCost
			});
		}
	}
	return {
		entries,
		sources,
		structureFingerprint
	};
}
function buildProviderCostIndex(providers, options) {
	return buildProviderCostIndexBundle(providers, options).entries;
}
function getProviderCostIndex(providers, options) {
	if (!providers) return EMPTY_PROVIDER_COST_INDEX;
	const isRawLookup = options?.allowPluginNormalization === false && (options.allowManifestNormalization === false || options.allowManifestNormalization === void 0);
	const isDefaultNormalizedLookup = options?.allowPluginNormalization !== false && options?.allowManifestNormalization === void 0;
	if (!isRawLookup && !isDefaultNormalizedLookup) return buildProviderCostIndex(providers, options);
	let cache = providerCostIndexByConfig.get(providers);
	if (!cache) {
		cache = {};
		providerCostIndexByConfig.set(providers, cache);
	}
	if (isRawLookup) {
		cache.rawEntries ??= buildProviderCostIndexBundle(providers, {
			allowManifestNormalization: false,
			allowPluginNormalization: false
		});
		const rawOptions = {
			allowManifestNormalization: false,
			allowPluginNormalization: false
		};
		if (refreshProviderCostIndexMutations(cache.rawEntries, providers, rawOptions) === "rebuild") cache.rawEntries = buildProviderCostIndexBundle(providers, rawOptions);
		if (cache.rawEntries.structureFingerprint !== buildProviderCostStructureFingerprint(providers)) cache.rawEntries = buildProviderCostIndexBundle(providers, rawOptions);
		return cache.rawEntries.entries;
	}
	cache.normalizedEntries ??= buildProviderCostIndexBundle(providers);
	if (refreshProviderCostIndexMutations(cache.normalizedEntries, providers) === "rebuild") cache.normalizedEntries = buildProviderCostIndexBundle(providers);
	if (cache.normalizedEntries.structureFingerprint !== buildProviderCostStructureFingerprint(providers)) cache.normalizedEntries = buildProviderCostIndexBundle(providers);
	return cache.normalizedEntries.entries;
}
function loadModelsJsonCostIndex(options) {
	const useRawEntries = options?.allowPluginNormalization === false;
	const agentDir = options?.agentDir;
	if (!agentDir) return EMPTY_PROVIDER_COST_INDEX;
	const modelsPath = path.join(agentDir, "models.json");
	try {
		let modelsJsonCostCache = modelsJsonCostCacheByAgentDir.get(agentDir);
		if (!modelsJsonCostCache) {
			const parsed = tryReadJsonSync(modelsPath);
			if (!parsed) return EMPTY_PROVIDER_COST_INDEX;
			modelsJsonCostCache = {
				path: modelsPath,
				providers: parsed?.providers,
				normalizedEntries: null,
				rawEntries: null
			};
			pruneMapToMaxSize(modelsJsonCostCacheByAgentDir, MODELS_JSON_COST_CACHE_LIMIT - 1);
			modelsJsonCostCacheByAgentDir.set(agentDir, modelsJsonCostCache);
		}
		if (useRawEntries) {
			modelsJsonCostCache.rawEntries ??= getProviderCostIndex(modelsJsonCostCache.providers, { allowPluginNormalization: false });
			return modelsJsonCostCache.rawEntries;
		}
		modelsJsonCostCache.normalizedEntries ??= getProviderCostIndex(modelsJsonCostCache.providers);
		return modelsJsonCostCache.normalizedEntries;
	} catch {
		return EMPTY_PROVIDER_COST_INDEX;
	}
}
function resolveCostAgentDir(config, agentDir) {
	if (agentDir) return agentDir;
	if (config && listAgentEntries(config).length > 0) {
		const defaultAgentId = tryResolveDefaultAgentId(config);
		return defaultAgentId ? resolveAgentDir(config, defaultAgentId) : void 0;
	}
	return path.join(resolveStateDir(), "agents", "main", "agent");
}
function findConfiguredProviderCost(params) {
	const key = toResolvedModelKey(params);
	if (!key) return;
	return getProviderCostFromIndex(params.config?.models?.providers, key, { allowPluginNormalization: params.allowPluginNormalization });
}
function stableCostFingerprintValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? JSON.stringify(value) : JSON.stringify(String(value));
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map((entry) => stableCostFingerprintValue(entry)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).filter((key) => record[key] !== void 0).toSorted().map((key) => `${JSON.stringify(key)}:${stableCostFingerprintValue(record[key])}`).join(",")}}`;
}
function buildModelCostFingerprint(cost) {
	const tierFingerprint = Array.isArray(cost.tieredPricing) ? cost.tieredPricing.flatMap((tier) => {
		const range = Array.isArray(tier.range) ? tier.range : [];
		return [
			tier.input,
			tier.output,
			tier.cacheRead,
			tier.cacheWrite,
			...range
		];
	}) : [];
	return [
		cost.input,
		cost.output,
		cost.cacheRead,
		cost.cacheWrite,
		...tierFingerprint
	].join("|");
}
function isProviderCostSourceCurrent(providers, source, key, options) {
	if (!providers[source.providerKey]?.models?.includes(source.model)) return false;
	const normalized = normalizeModelRef(normalizeProviderId(source.providerKey), source.model.id, {
		allowManifestNormalization: options?.allowManifestNormalization ?? (options?.allowPluginNormalization === false ? false : void 0),
		allowPluginNormalization: options?.allowPluginNormalization
	});
	return modelKey(normalized.provider, normalized.model) === key;
}
function refreshProviderCostIndexEntry(index, key, providers, options) {
	const source = index.sources.get(key);
	if (!source) return "current";
	if (providers && !isProviderCostSourceCurrent(providers, source, key, options)) return "rebuild";
	if (!isRawModelCostConfig(source.model.cost)) return "rebuild";
	if (source.model.cost !== source.rawCost) source.rawCost = source.model.cost;
	const fingerprint = buildModelCostFingerprint(source.rawCost);
	if (source.fingerprint === fingerprint) return "current";
	source.fingerprint = fingerprint;
	index.entries.set(key, normalizeModelCostConfig(source.rawCost));
	return "current";
}
function refreshProviderCostIndexMutations(index, providers, options) {
	for (const key of index.sources.keys()) if (refreshProviderCostIndexEntry(index, key, providers, options) === "rebuild") return "rebuild";
	return "current";
}
function hasProviderCostSourceForKey(providers, key, options) {
	for (const [providerKey, providerConfig] of Object.entries(providers)) {
		const normalizedProvider = normalizeProviderId(providerKey);
		for (const model of providerConfig?.models ?? []) {
			if (!isRawModelCostConfig(model.cost)) continue;
			const normalized = normalizeModelRef(normalizedProvider, model.id, {
				allowManifestNormalization: options?.allowManifestNormalization ?? (options?.allowPluginNormalization === false ? false : void 0),
				allowPluginNormalization: options?.allowPluginNormalization
			});
			if (modelKey(normalized.provider, normalized.model) === key) return true;
		}
	}
	return false;
}
function getProviderCostFromIndex(providers, key, options) {
	if (!providers) return;
	const isRawLookup = options?.allowPluginNormalization === false && (options.allowManifestNormalization === false || options.allowManifestNormalization === void 0);
	const isDefaultNormalizedLookup = options?.allowPluginNormalization !== false && options?.allowManifestNormalization === void 0;
	if (!isRawLookup && !isDefaultNormalizedLookup) return buildProviderCostIndex(providers, options).get(key);
	let cache = providerCostIndexByConfig.get(providers);
	if (!cache) {
		cache = {};
		providerCostIndexByConfig.set(providers, cache);
	}
	const index = isRawLookup ? cache.rawEntries ??= buildProviderCostIndexBundle(providers, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) : cache.normalizedEntries ??= buildProviderCostIndexBundle(providers);
	const sourceMissingWithStructuralChange = !index.sources.has(key) && index.structureFingerprint !== buildProviderCostStructureFingerprint(providers);
	const sourceMissingWithNewCost = !index.sources.has(key) && hasProviderCostSourceForKey(providers, key, options);
	if (refreshProviderCostIndexEntry(index, key, providers, options) === "rebuild" || sourceMissingWithStructuralChange || sourceMissingWithNewCost) {
		const rebuilt = buildProviderCostIndexBundle(providers, isRawLookup ? {
			allowManifestNormalization: false,
			allowPluginNormalization: false
		} : void 0);
		if (isRawLookup) cache.rawEntries = rebuilt;
		else cache.normalizedEntries = rebuilt;
		return rebuilt.entries.get(key);
	}
	return index.entries.get(key);
}
function serializeCostIndex(entries) {
	return Array.from(entries.entries()).toSorted(([a], [b]) => a.localeCompare(b));
}
/**
* Fingerprints all model-pricing sources that can affect usage cost estimates.
* Consumers cache this value to know when resolved cost entries need recomputation.
*/
function resolveModelCostConfigFingerprint(config, agentDir) {
	const resolvedAgentDir = resolveCostAgentDir(config, agentDir);
	const serialized = stableCostFingerprintValue({
		configuredRaw: serializeCostIndex(getProviderCostIndex(config?.models?.providers, { allowPluginNormalization: false })),
		configuredNormalized: serializeCostIndex(getProviderCostIndex(config?.models?.providers)),
		modelsJsonRaw: serializeCostIndex(loadModelsJsonCostIndex({
			agentDir: resolvedAgentDir,
			allowPluginNormalization: false
		})),
		modelsJsonNormalized: serializeCostIndex(loadModelsJsonCostIndex({ agentDir: resolvedAgentDir })),
		catalogPricing: modelCatalogPricingFingerprint(config)
	});
	return createHash("sha256").update(serialized).digest("hex");
}
/**
* Resolves pricing for a provider/model pair from local models.json, configured models, then gateway cache.
* Direct keys win before plugin normalization so configured pricing does not trigger provider discovery.
*/
function resolveModelCostConfig(params) {
	const rawKey = toDirectModelKey(params);
	if (!rawKey) return;
	const agentDir = resolveCostAgentDir(params.config, params.agentDir);
	const rawModelsJsonCost = loadModelsJsonCostIndex({
		agentDir,
		allowPluginNormalization: false
	}).get(rawKey);
	if (rawModelsJsonCost) return rawModelsJsonCost;
	const rawConfiguredCost = findConfiguredProviderCost({
		...params,
		allowPluginNormalization: false
	});
	if (rawConfiguredCost) return rawConfiguredCost;
	if (params.allowPluginNormalization === false) return;
	if (shouldUseNormalizedCostLookup(params)) {
		const key = toResolvedModelKey(params);
		if (key && key !== rawKey) {
			const modelsJsonCost = loadModelsJsonCostIndex({ agentDir }).get(key);
			if (modelsJsonCost) return modelsJsonCost;
			const configuredCost = findConfiguredProviderCost(params);
			if (configuredCost) return configuredCost;
		}
	}
	const catalogPricing = resolveCatalogModelPricing({
		config: params.config,
		provider: params.provider ?? "",
		model: params.model ?? ""
	});
	if (catalogPricing) return normalizeResolvedPricing(catalogPricing);
	const hostedPricing = resolveHostedModelPricing({
		config: params.config,
		provider: params.provider ?? "",
		model: params.model ?? ""
	});
	return hostedPricing ? normalizeResolvedPricing(hostedPricing) : void 0;
}
const toNumber = (value) => typeof value === "number" && Number.isFinite(value) ? value : 0;
function selectPricingTier(tiers, input) {
	const sortedTiers = getSortedPricingTiers(tiers);
	if (sortedTiers.length === 0) return;
	if (input <= 0) return sortedTiers[0];
	for (const tier of sortedTiers) {
		const [start, end] = tier.range;
		if (input >= start && input < end) return tier;
	}
	for (let index = sortedTiers.length - 1; index >= 0; index -= 1) {
		const tier = expectDefined(sortedTiers[index], "sorted tiers entry at index");
		if (input >= tier.range[0]) return tier;
	}
	return sortedTiers[0];
}
function getSortedPricingTiers(tiers) {
	const cached = sortedPricingTiersByInput.get(tiers);
	if (cached) return cached;
	const sorted = tiers.toSorted((a, b) => a.range[0] - b.range[0]);
	sortedPricingTiersByInput.set(tiers, sorted);
	return sorted;
}
function computeTieredCost(tiers, input, output, cacheRead, cacheWrite) {
	const tier = selectPricingTier(tiers, input);
	if (!tier) return 0;
	return input * tier.input + output * tier.output + cacheRead * tier.cacheRead + cacheWrite * tier.cacheWrite;
}
/**
* Estimates USD usage cost from normalized token totals.
* Tiered pricing selects one whole-request tier by input size; it does not blend tiers.
*/
function estimateUsageCost(params) {
	const usage = params.usage;
	const cost = params.cost;
	if (!usage || !cost) return;
	const input = toNumber(usage.input);
	const output = toNumber(usage.output);
	const cacheRead = toNumber(usage.cacheRead);
	const cacheWrite = toNumber(usage.cacheWrite);
	let total;
	if (cost.tieredPricing && cost.tieredPricing.length > 0) total = computeTieredCost(cost.tieredPricing, input, output, cacheRead, cacheWrite);
	else total = input * cost.input + output * cost.output + cacheRead * cost.cacheRead + cacheWrite * cost.cacheWrite;
	if (!Number.isFinite(total)) return;
	return total / 1e6;
}
function resetUsageFormatCachesForTest() {
	modelsJsonCostCacheByAgentDir = /* @__PURE__ */ new Map();
	providerCostIndexByConfig = /* @__PURE__ */ new WeakMap();
	modelKeyCache = /* @__PURE__ */ new Map();
	sortedPricingTiersByInput = /* @__PURE__ */ new WeakMap();
}
//#endregion
export { resolveModelCostConfigFingerprint as a, resolveModelCostConfig as i, formatUsd as n, resetUsageFormatCachesForTest as r, estimateUsageCost as t };
