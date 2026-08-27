import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as stripAnsi, t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { T as hasExplicitModelPolicyAllow, s as resolveAgentConfig, w as computeModelPolicyAllowlist } from "./agent-scope-config-BdXMWufB.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-B1YRfQOc.js";
import { a as normalizeConfiguredProviderCatalogModelId, l as normalizeStaticProviderModelId, o as normalizeModelRef, s as normalizeProviderId$1 } from "./model-ref-shared-poyRjWh_.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DppTp7ET.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { n as parseModelRef, t as findNormalizedProviderValue$1 } from "./model-selection-normalize-Cvi2hnhD.js";
//#region src/agents/model-compat-catalog.ts
function normalizeBaseUrl(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	if (!trimmed) return "";
	try {
		const url = new URL(trimmed);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return trimmed.replace(/\/+$/u, "");
	}
}
function modelTransportRoutesMatch(catalogRoute, configuredRoute) {
	const catalogApi = normalizeLowercaseStringOrEmpty(catalogRoute.api);
	const catalogBaseUrl = normalizeBaseUrl(catalogRoute.baseUrl);
	return (normalizeLowercaseStringOrEmpty(configuredRoute.api) || catalogApi) === catalogApi && (normalizeBaseUrl(configuredRoute.baseUrl) || catalogBaseUrl) === catalogBaseUrl;
}
/** Returns one unambiguous physical catalog route for destructive config cleanup. */
function resolveUniqueCatalogModelRoute(catalogRoutes, configuredRoute) {
	let match;
	for (const route of catalogRoutes ?? []) {
		if (!modelTransportRoutesMatch(route, configuredRoute)) continue;
		if (match) return;
		match = route;
	}
	return match;
}
/** Capabilities belong to the catalog route; config owns them only for a different/custom route. */
function resolveCatalogOwnedModelCompat(params) {
	if (!params.catalogRoute) return params.configuredCompat;
	return modelTransportRoutesMatch(params.catalogRoute, params.configuredRoute ?? {}) ? params.catalogCompat : params.configuredCompat;
}
//#endregion
//#region src/agents/configured-provider-fallback.ts
/**
* Chooses a configured provider/model fallback when defaults are absent from
* the user's model config.
*/
/** Resolve the first configured provider/model that can replace a missing default. */
function resolveConfiguredProviderFallback(params) {
	const configuredProviders = params.cfg.models?.providers;
	if (!configuredProviders || typeof configuredProviders !== "object") return null;
	const defaultProviderConfig = findNormalizedProviderValue(configuredProviders, params.defaultProvider);
	const defaultModel = params.defaultModel?.trim();
	const defaultProviderHasConfiguredModel = Array.isArray(defaultProviderConfig?.models) && defaultProviderConfig.models.some((model) => Boolean(model?.id));
	const defaultProviderHasDefaultModel = defaultModel !== void 0 && Array.isArray(defaultProviderConfig?.models) && defaultProviderConfig.models.some((model) => model?.id === defaultModel);
	if (defaultProviderHasConfiguredModel && (!defaultModel || defaultProviderHasDefaultModel)) return null;
	const availableProvider = Object.entries(configuredProviders).find(([, providerCfg]) => providerCfg && Array.isArray(providerCfg.models) && providerCfg.models.length > 0 && providerCfg.models[0]?.id);
	if (!availableProvider) return null;
	const [provider, providerCfg] = availableProvider;
	const models = providerCfg.models;
	if (!Array.isArray(models) || !models[0]?.id) return null;
	return {
		provider: normalizeProviderId(provider),
		model: models[0].id
	};
}
//#endregion
//#region src/config/model-policy-ref.ts
const MODEL_POLICY_COMPAT_SELECTORS = /* @__PURE__ */ new Set(["openrouter:auto", "openrouter:free"]);
function hasControlCharacter(value) {
	for (const char of value) {
		const codePoint = char.codePointAt(0) ?? 0;
		if (codePoint <= 31 || codePoint === 127) return true;
	}
	return false;
}
function hasValidSegments(segments, bounds) {
	return segments.length >= bounds.min && (bounds.max === void 0 || segments.length <= bounds.max) && segments.every((segment) => segment.length > 0 && !segment.includes("*") && !/\s/u.test(segment) && !hasControlCharacter(segment));
}
/** Parse and canonicalize a segment-boundary model-policy prefix wildcard. */
function parseModelPolicyWildcardRef(raw) {
	const segments = raw.trim().split("/").map((segment) => segment.trim());
	if (segments.at(-1) !== "*" || !hasValidSegments(segments.slice(0, -1), { min: 1 })) return null;
	const provider = normalizeProviderId(segments[0] ?? "");
	if (!provider) return null;
	return {
		key: [provider, ...segments.slice(1)].join("/"),
		provider
	};
}
/** True for a syntactically valid exact provider/model policy reference. */
function isValidExactModelPolicyRef(raw) {
	const parsed = parseModelCatalogRef(raw);
	return Boolean(parsed && hasValidSegments([parsed.provider, ...parsed.modelId.split("/")], { min: 2 }));
}
/** True for a supported bare selector whose target is resolved from config. */
function isModelPolicyCompatSelector(raw) {
	return MODEL_POLICY_COMPAT_SELECTORS.has(normalizeLowercaseStringOrEmpty(raw));
}
//#endregion
//#region src/agents/model-catalog-lookup.ts
/**
* Looks up model catalog entries and input capability support.
*/
/** Returns whether a catalog entry declares support for an input modality. */
function modelSupportsInput(entry, input) {
	return entry?.input?.includes(input) ?? false;
}
/** Finds a provider-qualified model entry in a catalog. */
function findModelInCatalog(catalog, provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	return catalog.find((entry) => normalizeProviderId(entry.provider) === normalizedProvider && normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
}
/** Finds a model entry, requiring uniqueness when provider is omitted. */
function findModelCatalogEntry(catalog, params) {
	const modelId = normalizeOptionalString(params.modelId) ?? "";
	if (!modelId) return;
	const provider = normalizeOptionalString(params.provider);
	if (provider) return findModelInCatalog(catalog, provider, modelId);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const matches = catalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.id) === normalizedModelId);
	return matches.length === 1 ? matches[0] : void 0;
}
//#endregion
//#region src/agents/model-selection-shared.ts
/**
* Shared model-selection resolution, alias, allowlist, and visibility logic.
*/
let log = null;
function getLog() {
	log ??= createSubsystemLogger("model-selection");
	return log;
}
const OPENROUTER_COMPAT_FREE_ALIAS = "openrouter:free";
function providerAliasKey(provider, alias) {
	return `${normalizeProviderId$1(provider)}/${normalizeLowercaseStringOrEmpty(alias)}`;
}
function hasSlashFormModelRef(raw) {
	const trimmed = raw.trim();
	const slash = trimmed.indexOf("/");
	return slash > 0 && slash < trimmed.length - 1;
}
function resolveManifestPluginsForModelIdNormalization(params) {
	if (params.allowManifestNormalization === false || params.manifestPlugins !== void 0) return params.manifestPlugins;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	if (!workspaceDir) {
		const currentManifestPlugins = getCurrentPluginMetadataSnapshot({
			config: params.cfg,
			env: process.env
		})?.plugins;
		if (currentManifestPlugins) return currentManifestPlugins;
	}
	return loadManifestMetadataSnapshot({
		config: params.cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	}).plugins;
}
function createModelManifestPluginContext(params) {
	let manifestPlugins = params.manifestPlugins;
	let resolved = params.allowManifestNormalization === false || params.manifestPlugins !== void 0;
	return {
		peek: () => manifestPlugins,
		get: () => {
			if (!resolved) {
				manifestPlugins = resolveManifestPluginsForModelIdNormalization(params);
				resolved = true;
			}
			return manifestPlugins;
		}
	};
}
function listModelAliasCandidates(cfg, agentId) {
	const modelMaps = [cfg.agents?.defaults?.models];
	if (agentId) {
		const agentModels = resolveAgentConfig(cfg, agentId)?.models;
		modelMaps.push(agentModels);
	}
	return modelMaps.flatMap((models) => Object.entries(models ?? {}).flatMap(([keyRaw, entryRaw]) => {
		if (parseModelPolicyWildcardRef(keyRaw)) return [];
		const alias = normalizeOptionalString(entryRaw?.alias) ?? "";
		return alias ? [{
			keyRaw,
			alias
		}] : [];
	}));
}
function findModelAliasCandidate(cfg, raw) {
	const aliasKey = normalizeLowercaseStringOrEmpty(raw);
	let match;
	for (const candidate of listModelAliasCandidates(cfg)) if (normalizeLowercaseStringOrEmpty(candidate.alias) === aliasKey) match = candidate;
	return match;
}
function sanitizeModelWarningValue(value) {
	const stripped = value ? stripAnsi(value) : "";
	let controlBoundary = -1;
	for (let index = 0; index < stripped.length; index += 1) {
		const code = stripped.charCodeAt(index);
		if (code <= 31 || code === 127) {
			controlBoundary = index;
			break;
		}
	}
	if (controlBoundary === -1) return sanitizeForLog(stripped);
	return sanitizeForLog(stripped.slice(0, controlBoundary));
}
function mergeModelCatalogEntries(params) {
	const merged = [...params.primary];
	const seen = new Set(merged.map((entry) => modelKey(entry.provider, entry.id)));
	for (const entry of params.secondary) {
		const key = modelKey(entry.provider, entry.id);
		if (seen.has(key)) continue;
		merged.push(entry);
		seen.add(key);
	}
	return merged;
}
/** Infer a unique provider for a bare model from configured model rows. */
function inferUniqueProviderFromConfiguredModels(params) {
	const model = params.model.trim();
	if (!model) return;
	const normalized = normalizeLowercaseStringOrEmpty(model);
	const providers = /* @__PURE__ */ new Set();
	const addProvider = (provider) => {
		const normalizedProvider = normalizeProviderId$1(provider);
		if (!normalizedProvider) return;
		providers.add(normalizedProvider);
	};
	const configuredModels = params.cfg.agents?.defaults?.models;
	if (configuredModels) for (const key of Object.keys(configuredModels)) {
		const ref = key.trim();
		if (!ref || !ref.includes("/") || ref.endsWith("/*")) continue;
		const parsed = parseModelRef(ref, DEFAULT_PROVIDER, {
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: false,
			manifestPlugins: params.manifestPlugins
		});
		if (!parsed) continue;
		if (parsed.model === model || normalizeLowercaseStringOrEmpty(parsed.model) === normalized) {
			addProvider(parsed.provider);
			if (providers.size > 1) return;
		}
	}
	const configuredProviders = params.cfg.models?.providers;
	if (configuredProviders) for (const [providerId, providerConfig] of Object.entries(configuredProviders)) {
		const models = providerConfig?.models;
		if (!Array.isArray(models)) continue;
		for (const entry of models) {
			const modelId = entry?.id?.trim();
			if (!modelId) continue;
			const normalizedModelId = normalizeConfiguredProviderCatalogModelId(providerId, modelId, {
				allowManifestNormalization: params.allowManifestNormalization,
				manifestPlugins: params.manifestPlugins
			});
			if (modelId === model || normalizeLowercaseStringOrEmpty(modelId) === normalized || normalizedModelId === model || normalizeLowercaseStringOrEmpty(normalizedModelId) === normalized) addProvider(providerId);
		}
		if (providers.size > 1) return;
	}
	if (providers.size !== 1) return;
	return providers.values().next().value;
}
/** Infer a unique provider for a bare model from a provider catalog. */
function inferUniqueProviderFromCatalog(params) {
	const model = params.model.trim();
	if (!model) return;
	const normalized = normalizeLowercaseStringOrEmpty(model);
	const providers = /* @__PURE__ */ new Set();
	for (const entry of params.catalog) {
		const entryId = entry.id.trim();
		if (!entryId) continue;
		if (entryId !== model && normalizeLowercaseStringOrEmpty(entryId) !== normalized) continue;
		const provider = normalizeProviderId$1(entry.provider);
		if (provider) providers.add(provider);
		if (providers.size > 1) return;
	}
	return providers.size === 1 ? providers.values().next().value : void 0;
}
/** Resolve the provider used when a model string omits provider/id syntax. */
function resolveBareModelDefaultProvider(params) {
	return inferUniqueProviderFromConfiguredModels({
		cfg: params.cfg,
		model: params.model,
		manifestPlugins: params.manifestPlugins
	}) ?? inferUniqueProviderFromCatalog({
		catalog: params.catalog,
		model: params.model
	}) ?? params.defaultProvider;
}
function isConcreteOpenRouterFreeModelRef(ref) {
	return ref.provider === "openrouter" && ref.model.includes("/") && ref.model.endsWith(":free");
}
function resolveConfiguredOpenRouterCompatFreeRef(params) {
	const configuredModels = params.cfg.agents?.defaults?.models ?? {};
	for (const raw of Object.keys(configuredModels)) {
		if (!raw.includes("/")) continue;
		const parsed = parseModelRef(raw, params.defaultProvider, {
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
		if (parsed && isConcreteOpenRouterFreeModelRef(parsed)) return parsed;
	}
	const openrouterProviderConfig = findNormalizedProviderValue$1(params.cfg.models?.providers, "openrouter");
	for (const entry of openrouterProviderConfig?.models ?? []) {
		const modelId = entry?.id?.trim();
		if (!modelId || !modelId.includes("/") || !modelId.endsWith(":free")) continue;
		return normalizeModelRef("openrouter", modelId, {
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
	}
	return null;
}
/** Resolve OpenRouter compatibility aliases such as openrouter:auto/free. */
function resolveConfiguredOpenRouterCompatAlias(params) {
	const normalized = normalizeLowercaseStringOrEmpty(params.raw);
	if (normalized === "openrouter:auto") return normalizeModelRef("openrouter", "auto", {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	if (normalized !== OPENROUTER_COMPAT_FREE_ALIAS || !params.cfg) return null;
	return resolveConfiguredOpenRouterCompatFreeRef({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function parseModelRefWithCompatAlias(params) {
	const exactConfiguredProviderRef = resolveExactConfiguredProviderRef(params);
	const exactDefaultProviderRef = hasSlashFormModelRef(params.raw) ? null : resolveExactConfiguredProviderRef({
		...params,
		raw: `${params.defaultProvider}/${params.raw}`
	});
	return resolveConfiguredOpenRouterCompatAlias(params) ?? exactConfiguredProviderRef ?? exactDefaultProviderRef ?? parseModelRef(params.raw, params.defaultProvider, {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function findExactConfiguredProviderRefParts(params) {
	const slash = params.raw.indexOf("/");
	if (slash <= 0 || !params.cfg?.models?.providers) return null;
	const providerRaw = params.raw.slice(0, slash).trim();
	const modelRaw = params.raw.slice(slash + 1).trim();
	if (!providerRaw || !modelRaw) return null;
	const providerKey = normalizeLowercaseStringOrEmpty(providerRaw);
	const exactConfigured = Object.entries(params.cfg.models.providers).find(([key]) => normalizeLowercaseStringOrEmpty(key) === providerKey);
	if (!exactConfigured) return null;
	const [configuredProvider, providerConfig] = exactConfigured;
	const normalizedConfiguredProvider = normalizeProviderId$1(configuredProvider);
	const apiOwner = typeof providerConfig?.api === "string" ? normalizeProviderId$1(providerConfig.api) : "";
	if (!apiOwner || apiOwner === normalizedConfiguredProvider) return null;
	return {
		configuredProvider,
		modelRaw
	};
}
function normalizeExactConfiguredProviderRef(parts, params) {
	const { configuredProvider, modelRaw } = parts;
	const provider = normalizeLowercaseStringOrEmpty(configuredProvider);
	return {
		provider,
		model: normalizeConfiguredProviderCatalogModelId(provider, normalizeStaticProviderModelId(provider, modelRaw.trim(), {
			allowManifestNormalization: params.allowManifestNormalization,
			manifestPlugins: params.manifestPlugins
		}), {
			allowManifestNormalization: params.allowManifestNormalization,
			manifestPlugins: params.manifestPlugins
		})
	};
}
function resolveExactConfiguredProviderRef(params) {
	const exactConfigured = findExactConfiguredProviderRefParts({
		cfg: params.cfg,
		raw: params.raw
	});
	if (!exactConfigured) return null;
	return normalizeExactConfiguredProviderRef(exactConfigured, params);
}
/** Normalize a configured allowlist entry into the canonical provider/model key. */
function resolveAllowlistModelKey(params) {
	const parsed = resolveModelRefFromString({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	})?.ref;
	if (!parsed) return null;
	return modelKey(parsed.provider, parsed.model);
}
function buildModelAliasIndexWithManifestContext(params) {
	const byAlias = /* @__PURE__ */ new Map();
	const byProviderAlias = /* @__PURE__ */ new Map();
	const byKey = /* @__PURE__ */ new Map();
	const aliasCandidates = listModelAliasCandidates(params.cfg, params.agentId);
	if (aliasCandidates.length === 0) return {
		byAlias,
		byProviderAlias,
		byKey
	};
	const manifestPlugins = params.manifestPluginContext.get();
	for (const { keyRaw, alias } of aliasCandidates) {
		const parsed = parseModelRefWithCompatAlias({
			cfg: params.cfg,
			raw: keyRaw,
			defaultProvider: params.defaultProvider,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins
		});
		if (!parsed) continue;
		const aliasKey = normalizeLowercaseStringOrEmpty(alias);
		const match = {
			alias,
			ref: parsed
		};
		byAlias.set(aliasKey, match);
		byProviderAlias.set(providerAliasKey(parsed.provider, alias), match);
		const key = modelKey(parsed.provider, parsed.model);
		const existing = byKey.get(key) ?? [];
		existing.push(alias);
		byKey.set(key, existing);
	}
	return {
		byAlias,
		byProviderAlias,
		byKey
	};
}
/** Build lookup maps from user-facing aliases to normalized model refs. */
function buildModelAliasIndex(params) {
	return buildModelAliasIndexWithManifestContext({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPluginContext: createModelManifestPluginContext(params)
	});
}
function buildModelCatalogMetadata(params) {
	const configuredByKey = /* @__PURE__ */ new Map();
	for (const entry of params.configuredCatalog) configuredByKey.set(modelKey(entry.provider, entry.id), entry);
	const aliasByKey = /* @__PURE__ */ new Map();
	const configuredModels = params.cfg.agents?.defaults?.models ?? {};
	for (const [rawKey, entryRaw] of Object.entries(configuredModels)) {
		if (parseModelPolicyWildcardRef(rawKey)) continue;
		const key = resolveAllowlistModelKey({
			cfg: params.cfg,
			raw: rawKey,
			defaultProvider: params.defaultProvider,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
		if (!key) continue;
		const alias = (entryRaw?.alias ?? "").trim();
		if (alias) aliasByKey.set(key, alias);
	}
	return {
		configuredByKey,
		aliasByKey
	};
}
function applyModelCatalogMetadata(params) {
	const key = modelKey(params.entry.provider, params.entry.id);
	const configuredEntry = params.metadata.configuredByKey.get(key);
	const alias = params.metadata.aliasByKey.get(key);
	if (!configuredEntry && !alias) return params.entry;
	const nextAlias = alias ?? params.entry.alias;
	const nextContextWindow = configuredEntry?.contextWindow ?? params.entry.contextWindow;
	const nextContextTokens = configuredEntry?.contextTokens ?? params.entry.contextTokens;
	const nextReasoning = configuredEntry?.reasoning ?? params.entry.reasoning;
	const nextInput = configuredEntry?.input ?? params.entry.input;
	const nextParams = params.entry.params || configuredEntry?.params ? {
		...params.entry.params,
		...configuredEntry?.params
	} : void 0;
	const nextCompat = resolveCatalogOwnedModelCompat({
		catalogRoute: params.entry,
		catalogCompat: params.entry.compat,
		configuredRoute: configuredEntry,
		configuredCompat: configuredEntry?.compat
	});
	return {
		...params.entry,
		name: configuredEntry?.name ?? params.entry.name,
		...nextAlias ? { alias: nextAlias } : {},
		...nextContextWindow !== void 0 ? { contextWindow: nextContextWindow } : {},
		...nextContextTokens !== void 0 ? { contextTokens: nextContextTokens } : {},
		...nextReasoning !== void 0 ? { reasoning: nextReasoning } : {},
		...nextInput ? { input: nextInput } : {},
		...nextParams ? { params: nextParams } : {},
		...nextCompat ? { compat: nextCompat } : {}
	};
}
function buildSyntheticAllowedCatalogEntry(params) {
	const key = modelKey(params.parsed.provider, params.parsed.model);
	const configuredEntry = params.metadata.configuredByKey.get(key);
	const alias = params.metadata.aliasByKey.get(key);
	const nextContextWindow = configuredEntry?.contextWindow;
	const nextContextTokens = configuredEntry?.contextTokens;
	const nextReasoning = configuredEntry?.reasoning;
	const nextInput = configuredEntry?.input;
	const nextParams = configuredEntry?.params;
	const nextCompat = configuredEntry?.compat;
	return {
		id: params.parsed.model,
		name: configuredEntry?.name ?? params.parsed.model,
		provider: params.parsed.provider,
		...alias ? { alias } : {},
		...nextContextWindow !== void 0 ? { contextWindow: nextContextWindow } : {},
		...nextContextTokens !== void 0 ? { contextTokens: nextContextTokens } : {},
		...nextReasoning !== void 0 ? { reasoning: nextReasoning } : {},
		...nextInput ? { input: nextInput } : {},
		...nextParams ? { params: nextParams } : {},
		...nextCompat ? { compat: nextCompat } : {}
	};
}
function resolveModelRefFromString(params) {
	const { model } = splitTrailingAuthProfile(params.raw);
	if (!model) return null;
	const aliasKey = normalizeLowercaseStringOrEmpty(model);
	const aliasMatch = params.aliasIndex?.byAlias.get(aliasKey);
	if (aliasMatch) return {
		ref: aliasMatch.ref,
		alias: aliasMatch.alias
	};
	const slash = model.indexOf("/");
	if (slash > 0) {
		const providerAliasMatch = params.aliasIndex?.byProviderAlias?.get(providerAliasKey(model.slice(0, slash), model.slice(slash + 1)));
		if (providerAliasMatch) return {
			ref: providerAliasMatch.ref,
			alias: providerAliasMatch.alias
		};
	}
	const parsed = parseModelRefWithCompatAlias({
		cfg: params.cfg,
		raw: model,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	if (!parsed) return null;
	return { ref: parsed };
}
/** Resolves legacy provider/model pairs whose model field may still contain an alias. */
function resolveModelAliasFromPair(params) {
	const bareAlias = resolveModelRefFromString({
		...params,
		raw: params.model,
		defaultProvider: params.provider
	});
	const providerAlias = resolveModelRefFromString({
		...params,
		raw: `${params.provider}/${params.model}`
	});
	if (providerAlias?.alias) return providerAlias.ref;
	const provider = normalizeProviderId$1(params.provider);
	return bareAlias?.alias && (normalizeProviderId$1(bareAlias.ref.provider) === provider || provider === normalizeProviderId$1(params.defaultProvider)) ? bareAlias.ref : null;
}
/** Resolve the default configured model ref, including aliases and fallback provider rows. */
function resolveConfiguredModelRef(params) {
	const rawModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model) ?? "";
	if (rawModel) {
		const trimmed = rawModel.trim();
		const { model: modelWithoutProfile } = splitTrailingAuthProfile(trimmed);
		const manifestPluginContext = createModelManifestPluginContext(params);
		const profileStripped = Boolean(modelWithoutProfile && modelWithoutProfile !== trimmed);
		const exactAliasCandidate = findModelAliasCandidate(params.cfg, trimmed);
		const strippedAliasCandidate = profileStripped ? findModelAliasCandidate(params.cfg, modelWithoutProfile) : void 0;
		const profileAliasCandidate = profileStripped ? exactAliasCandidate ?? strippedAliasCandidate : void 0;
		if (profileAliasCandidate) {
			const aliasRef = parseModelRefWithCompatAlias({
				cfg: params.cfg,
				raw: profileAliasCandidate.keyRaw,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: manifestPluginContext.get()
			});
			if (aliasRef) return aliasRef;
		}
		const primaryWithoutProfile = modelWithoutProfile || trimmed;
		const exactConfiguredPrimary = findExactConfiguredProviderRefParts({
			cfg: params.cfg,
			raw: primaryWithoutProfile
		});
		if (exactConfiguredPrimary) return normalizeExactConfiguredProviderRef(exactConfiguredPrimary, {
			allowManifestNormalization: params.allowManifestNormalization,
			manifestPlugins: manifestPluginContext.get()
		});
		const aliasCandidate = profileStripped ? void 0 : exactAliasCandidate;
		const manifestPlugins = manifestPluginContext.peek();
		if (aliasCandidate && hasSlashFormModelRef(primaryWithoutProfile) && !hasSlashFormModelRef(aliasCandidate.keyRaw)) {
			const primaryRef = parseModelRefWithCompatAlias({
				cfg: params.cfg,
				raw: primaryWithoutProfile,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: manifestPluginContext.get()
			});
			if (primaryRef) return primaryRef;
		}
		if (aliasCandidate) {
			const aliasRef = parseModelRefWithCompatAlias({
				cfg: params.cfg,
				raw: aliasCandidate.keyRaw,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: manifestPluginContext.get()
			});
			if (aliasRef) return aliasRef;
		}
		if (!trimmed.includes("/")) {
			const normalizedTrimmed = normalizeLowercaseStringOrEmpty(trimmed);
			const needsOpenRouterCompatManifestPlugins = normalizedTrimmed === "openrouter:auto" || normalizedTrimmed === OPENROUTER_COMPAT_FREE_ALIAS;
			const openrouterCompatRef = resolveConfiguredOpenRouterCompatAlias({
				cfg: params.cfg,
				raw: trimmed,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: needsOpenRouterCompatManifestPlugins ? manifestPluginContext.get() : manifestPlugins
			});
			if (openrouterCompatRef) return openrouterCompatRef;
			let inferredProvider = inferUniqueProviderFromConfiguredModels({
				cfg: params.cfg,
				model: trimmed,
				allowManifestNormalization: false,
				manifestPlugins
			});
			let inferredProviderManifestPlugins = manifestPlugins;
			if ((!inferredProvider || inferredProvider !== "openai") && hasConfiguredRowsNeedingManifestLookup(params.cfg, params.defaultProvider)) {
				inferredProviderManifestPlugins = manifestPluginContext.get();
				inferredProvider = inferUniqueProviderFromConfiguredModels({
					cfg: params.cfg,
					model: trimmed,
					allowManifestNormalization: params.allowManifestNormalization,
					manifestPlugins: inferredProviderManifestPlugins
				}) ?? inferredProvider;
			}
			if (inferredProvider) return normalizeModelRef(inferredProvider, trimmed, {
				allowManifestNormalization: inferredProviderManifestPlugins ? params.allowManifestNormalization : false,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: inferredProviderManifestPlugins
			});
			const safeTrimmed = sanitizeModelWarningValue(trimmed);
			const safeResolved = sanitizeForLog(`${params.defaultProvider}/${safeTrimmed}`);
			getLog().warn(`Model "${safeTrimmed}" specified without provider. Falling back to "${safeResolved}". Please use "${safeResolved}" in your config.`);
			return {
				provider: params.defaultProvider,
				model: trimmed
			};
		}
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw: trimmed,
			defaultProvider: params.defaultProvider,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: manifestPluginContext.get()
		});
		if (resolved) return resolved.ref;
		const safe = sanitizeForLog(trimmed);
		const safeFallback = sanitizeForLog(`${params.defaultProvider}/${params.defaultModel}`);
		getLog().warn(`Model "${safe}" could not be resolved. Falling back to default "${safeFallback}".`);
	}
	const fallbackProvider = resolveConfiguredProviderFallback({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
	if (fallbackProvider) return fallbackProvider;
	return {
		provider: params.defaultProvider,
		model: params.defaultModel
	};
}
/** Build explicit override authorization plus configured automatic fallback keys. */
function buildAllowedModelSetWithFallbacks(params) {
	const configuredCatalog = buildConfiguredModelCatalog({
		cfg: params.cfg,
		manifestPlugins: params.manifestPlugins
	});
	const metadata = buildModelCatalogMetadata({
		cfg: params.cfg,
		configuredCatalog,
		defaultProvider: params.defaultProvider,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const catalog = mergeModelCatalogEntries({
		primary: params.catalog,
		secondary: configuredCatalog
	}).map((entry) => applyModelCatalogMetadata({
		entry,
		metadata
	}));
	const visibility = params.visibility ?? parseConfiguredModelVisibilityEntries({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const wildcardModelKeys = visibility.wildcardModelKeys;
	const policyAliasAgentId = resolvePolicyAliasAgentId(visibility.configPath, params.agentId);
	const policyAliasIndex = params.aliasIndex ?? buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: policyAliasAgentId,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const selectionAliasIndex = params.selectionAliasIndex ?? (params.agentId && policyAliasAgentId !== params.agentId ? buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	}) : policyAliasIndex);
	const allowAny = !visibility.hasEntries;
	const defaultModelNormalization = allowAny ? {
		allowManifestNormalization: false,
		allowPluginNormalization: false,
		manifestPlugins: params.manifestPlugins
	} : {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	};
	const defaultModel = params.defaultModel?.trim();
	const defaultRef = defaultModel && params.defaultProvider ? parseModelRefWithCompatAlias({
		cfg: params.cfg,
		raw: defaultModel,
		defaultProvider: params.defaultProvider,
		...defaultModelNormalization
	}) : null;
	const defaultKey = defaultRef ? modelKey(defaultRef.provider, defaultRef.model) : void 0;
	const resolveSelectionModelRef = (raw, aliasIndex) => {
		const trimmed = raw.trim();
		const defaultProvider = !trimmed.includes("/") ? resolveBareModelDefaultProvider({
			cfg: params.cfg,
			catalog,
			model: trimmed,
			defaultProvider: params.defaultProvider,
			manifestPlugins: params.manifestPlugins
		}) : params.defaultProvider;
		return resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider,
			aliasIndex,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		})?.ref;
	};
	const automaticFallbackKeys = /* @__PURE__ */ new Set();
	for (const fallback of params.fallbackModels) {
		const parsed = resolveSelectionModelRef(fallback, selectionAliasIndex);
		if (parsed) automaticFallbackKeys.add(modelKey(parsed.provider, parsed.model));
	}
	const catalogKeys = /* @__PURE__ */ new Set();
	for (const entry of catalog) catalogKeys.add(modelKey(entry.provider, entry.id));
	if (allowAny) {
		if (defaultKey) catalogKeys.add(defaultKey);
		return {
			allowAny: true,
			allowedCatalog: catalog,
			allowedKeys: catalogKeys,
			automaticFallbackKeys,
			configuredCatalog
		};
	}
	const allowedKeys = /* @__PURE__ */ new Set();
	const allowedRefs = [];
	const syntheticCatalogEntries = /* @__PURE__ */ new Map();
	for (const wildcardKey of wildcardModelKeys) allowedKeys.add(wildcardKey);
	const addAllowedCatalogRef = (ref) => {
		if (!allowedRefs.some((existing) => modelKey(existing.provider, existing.model) === modelKey(ref.provider, ref.model))) allowedRefs.push(ref);
	};
	for (const entry of expandModelCatalogWildcards(catalog, wildcardModelKeys)) {
		allowedKeys.add(modelKey(entry.provider, entry.id));
		addAllowedCatalogRef({
			provider: entry.provider,
			model: entry.id
		});
	}
	const addAllowedModelRef = (raw, aliasIndex) => {
		const parsed = resolveSelectionModelRef(raw, aliasIndex);
		if (!parsed) return;
		const key = modelKey(parsed.provider, parsed.model);
		allowedKeys.add(key);
		addAllowedCatalogRef(parsed);
		if (!findModelCatalogEntry(catalog, {
			provider: parsed.provider,
			modelId: parsed.model
		}) && !syntheticCatalogEntries.has(key)) syntheticCatalogEntries.set(key, buildSyntheticAllowedCatalogEntry({
			parsed,
			metadata
		}));
	};
	for (const raw of visibility.exactModelRefs) addAllowedModelRef(raw, policyAliasIndex);
	if (defaultKey && (visibility.exactModelRefs.length > 0 && wildcardModelKeys.size === 0 || isModelKeyAllowedBySet(wildcardModelKeys, defaultKey))) {
		allowedKeys.add(defaultKey);
		if (defaultRef) addAllowedCatalogRef(defaultRef);
	}
	const allowedCatalog = [...catalog.filter((entry) => allowedRefs.some((ref) => findModelCatalogEntry([entry], {
		provider: ref.provider,
		modelId: ref.model
	}) === entry)), ...syntheticCatalogEntries.values()];
	if (allowedCatalog.length === 0 && allowedKeys.size === 0 && wildcardModelKeys.size === 0) {
		if (defaultKey) catalogKeys.add(defaultKey);
		return {
			allowAny: true,
			allowedCatalog: catalog,
			allowedKeys: catalogKeys,
			automaticFallbackKeys,
			configuredCatalog
		};
	}
	return {
		allowAny: false,
		allowedCatalog,
		allowedKeys,
		automaticFallbackKeys,
		configuredCatalog
	};
}
function getModelRefStatusFromAllowedSet(params) {
	const key = modelKey(params.ref.provider, params.ref.model);
	return {
		key,
		inCatalog: Boolean(findModelCatalogEntry(params.catalog, {
			provider: params.ref.provider,
			modelId: params.ref.model
		})),
		allowAny: params.allowed.allowAny,
		allowed: params.allowed.allowAny || isModelKeyAllowedBySet(params.allowed.allowedKeys, key)
	};
}
function getModelRefStatusWithFallbackModels(params) {
	const allowed = buildAllowedModelSetWithFallbacks({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		fallbackModels: params.fallbackModels,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	return getModelRefStatusFromAllowedSet({
		catalog: params.catalog,
		ref: params.ref,
		allowed
	});
}
/** Resolve a requested model string only if it is allowed by the supplied status check. */
function resolveAllowedModelRefFromAliasIndex(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return { error: "invalid model: empty" };
	const effectiveDefaultProvider = !trimmed.includes("/") ? inferUniqueProviderFromConfiguredModels({
		cfg: params.cfg,
		model: trimmed,
		manifestPlugins: params.manifestPlugins
	}) ?? params.defaultProvider : params.defaultProvider;
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		raw: trimmed,
		defaultProvider: effectiveDefaultProvider,
		aliasIndex: params.aliasIndex,
		manifestPlugins: params.manifestPlugins
	});
	if (!resolved) return { error: `invalid model: ${trimmed}` };
	const status = params.getStatus(resolved.ref);
	if (!status.allowed) return { error: `model not allowed: ${status.key}` };
	return {
		ref: resolved.ref,
		key: status.key
	};
}
/** True when config contains provider model rows that should seed catalogs. */
function hasConfiguredProviderModelRows(cfg) {
	const providers = cfg.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	return Object.values(providers).some((provider) => Array.isArray(provider?.models));
}
function hasConfiguredProviderRowsNeedingManifestLookup(cfg) {
	const providers = cfg.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	return Object.entries(providers).some(([providerRaw, provider]) => Array.isArray(provider?.models) && normalizeProviderId$1(providerRaw) !== "openai");
}
function hasConfiguredModelRefsNeedingManifestLookup(cfg, defaultProvider) {
	const configuredModels = cfg.agents?.defaults?.models;
	if (!configuredModels || typeof configuredModels !== "object") return false;
	const normalizedDefaultProvider = normalizeProviderId$1(defaultProvider);
	return Object.keys(configuredModels).some((keyRaw) => {
		const key = keyRaw.trim();
		if (!key || key.endsWith("/*")) return false;
		const slashIndex = key.indexOf("/");
		if (slashIndex <= 0) return false;
		const provider = normalizeProviderId$1(key.slice(0, slashIndex));
		return Boolean(provider && provider !== normalizedDefaultProvider);
	});
}
function hasConfiguredRowsNeedingManifestLookup(cfg, defaultProvider) {
	return hasConfiguredProviderRowsNeedingManifestLookup(cfg) || hasConfiguredModelRefsNeedingManifestLookup(cfg, defaultProvider);
}
function resolveConfiguredModelManifestPlugins(params) {
	if (params.manifestPlugins) return params.manifestPlugins;
	if (!hasConfiguredProviderModelRows(params.cfg)) return;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	if (!workspaceDir) return getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env: process.env
	})?.plugins;
	return loadManifestMetadataSnapshot({
		config: params.cfg,
		env: process.env,
		...workspaceDir ? { workspaceDir } : {}
	}).plugins;
}
/** Build catalog entries from configured provider model rows. */
function buildConfiguredModelCatalog(params) {
	const providers = params.cfg.models?.providers;
	if (!providers || typeof providers !== "object") return [];
	const manifestPlugins = resolveConfiguredModelManifestPlugins(params);
	const catalog = [];
	for (const [providerRaw, provider] of Object.entries(providers)) {
		const providerId = normalizeProviderId$1(providerRaw);
		if (!providerId || !Array.isArray(provider?.models)) continue;
		for (const model of provider.models) {
			const rawId = normalizeOptionalString(model?.id) ?? "";
			const id = rawId ? normalizeConfiguredProviderCatalogModelId(providerId, rawId, { manifestPlugins }) : "";
			if (!id) continue;
			const name = normalizeOptionalString(model?.name) || id;
			const contextWindow = typeof model?.contextWindow === "number" && model.contextWindow > 0 ? model.contextWindow : void 0;
			const contextTokens = typeof model?.contextTokens === "number" && model.contextTokens > 0 ? model.contextTokens : void 0;
			const input = Array.isArray(model?.input) ? model.input : void 0;
			const modelParams = model?.params && typeof model.params === "object" ? model.params : void 0;
			const compat = model?.compat && typeof model.compat === "object" ? model.compat : void 0;
			const reasoning = typeof model?.reasoning === "boolean" ? model.reasoning : isVllmQwenThinkingCompat(providerId, compat) ? true : void 0;
			catalog.push({
				provider: providerId,
				id,
				name,
				api: model.api ?? provider.api,
				...model.baseUrl ?? provider.baseUrl ? { baseUrl: model.baseUrl ?? provider.baseUrl } : {},
				contextWindow,
				contextTokens,
				reasoning,
				input,
				...modelParams ? { params: modelParams } : {},
				compat
			});
		}
	}
	return catalog;
}
function isVllmQwenThinkingCompat(providerId, compat) {
	return providerId === "vllm" && (compat?.thinkingFormat === "qwen" || compat?.thinkingFormat === "qwen-chat-template");
}
function resolveHooksGmailModel(params) {
	const hooksModel = params.cfg.hooks?.gmail?.model;
	if (!hooksModel?.trim()) return null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	return resolveModelRefFromString({
		cfg: params.cfg,
		raw: hooksModel,
		defaultProvider: params.defaultProvider,
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	})?.ref ?? null;
}
function normalizeModelSelection(value) {
	if (typeof value === "string") return value.trim() || void 0;
	if (!value || typeof value !== "object") return;
	const primary = value.primary;
	if (typeof primary === "string" && primary.trim()) return primary.trim();
}
const DEFAULT_MODEL_POLICY_ALLOW_CONFIG_PATH = "agents.defaults.modelPolicy.allow";
const AGENT_MODEL_POLICY_ALLOW_CONFIG_PATH = "agents.entries.*.modelPolicy.allow";
const LEGACY_MODEL_POLICY_ALLOW_CONFIG_PATH = "agents.defaults.models";
function resolvePolicyAliasAgentId(configPath, agentId) {
	return configPath === AGENT_MODEL_POLICY_ALLOW_CONFIG_PATH ? agentId : void 0;
}
function resolveConfiguredModelPolicyAllow(params) {
	const defaults = params.cfg?.agents?.defaults;
	if (params.agentId) {
		const agentPolicy = (params.cfg ? resolveAgentConfig(params.cfg, params.agentId) : void 0)?.modelPolicy;
		if (hasExplicitModelPolicyAllow(agentPolicy)) return {
			refs: agentPolicy?.allow ?? [],
			configPath: AGENT_MODEL_POLICY_ALLOW_CONFIG_PATH,
			repairConfigPath: AGENT_MODEL_POLICY_ALLOW_CONFIG_PATH
		};
	}
	const defaultPolicy = defaults?.modelPolicy;
	if (hasExplicitModelPolicyAllow(defaultPolicy)) return {
		refs: defaultPolicy?.allow ?? [],
		configPath: DEFAULT_MODEL_POLICY_ALLOW_CONFIG_PATH,
		repairConfigPath: DEFAULT_MODEL_POLICY_ALLOW_CONFIG_PATH
	};
	const legacyDefaultRefs = computeModelPolicyAllowlist({
		root: params.cfg,
		defaults
	});
	if (legacyDefaultRefs) return {
		refs: legacyDefaultRefs,
		configPath: LEGACY_MODEL_POLICY_ALLOW_CONFIG_PATH,
		repairConfigPath: DEFAULT_MODEL_POLICY_ALLOW_CONFIG_PATH
	};
	return {
		refs: [],
		configPath: null,
		repairConfigPath: DEFAULT_MODEL_POLICY_ALLOW_CONFIG_PATH
	};
}
function parseConfiguredModelVisibilityEntries(params) {
	const configured = resolveConfiguredModelPolicyAllow(params);
	const exactModelRefs = [];
	const providerWildcards = /* @__PURE__ */ new Set();
	const wildcardModelKeys = /* @__PURE__ */ new Set();
	for (const raw of configured.refs) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		const wildcard = parseModelPolicyWildcardRef(trimmed);
		if (wildcard) {
			providerWildcards.add(wildcard.provider);
			wildcardModelKeys.add(wildcard.key);
			continue;
		}
		exactModelRefs.push(raw);
	}
	return {
		exactModelRefs,
		providerWildcards,
		wildcardModelKeys,
		hasEntries: configured.refs.length > 0,
		configPath: configured.configPath,
		repairConfigPath: configured.repairConfigPath
	};
}
/** Expand segment-boundary prefix wildcard policy entries against discovered catalog rows. */
function expandModelCatalogWildcards(catalog, wildcardModelKeys) {
	return catalog.filter((entry) => isModelKeyAllowedBySet(wildcardModelKeys, modelKey(entry.provider, entry.id)));
}
function isModelKeyAllowedBySet(allowedKeys, key) {
	if (allowedKeys.has(key)) return true;
	let separator = key.indexOf("/");
	while (separator > 0) {
		if (allowedKeys.has(`${key.slice(0, separator + 1)}*`)) return true;
		separator = key.indexOf("/", separator + 1);
	}
	return false;
}
function resolveAllowedModelSelection(params) {
	const normalizeSelectionRef = (provider, model) => resolveExactConfiguredProviderRef({
		cfg: params.cfg,
		raw: `${provider}/${model}`,
		allowManifestNormalization: params.allowManifestNormalization,
		manifestPlugins: params.manifestPlugins
	}) ?? normalizeModelRef(provider, model, {
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const current = normalizeSelectionRef(params.provider, params.model);
	if (params.allowAny || isModelKeyAllowedBySet(params.allowedKeys, modelKey(current.provider, current.model))) return current;
	const fallback = params.allowedCatalog[0];
	if (!fallback) return null;
	return normalizeSelectionRef(fallback.provider, fallback.id);
}
/** Canonical logical identity shared by visibility and physical route rows. */
function modelCatalogLogicalKey(entry) {
	const provider = normalizeProviderId$1(entry.provider);
	const model = splitTrailingAuthProfile(entry.id).model;
	return normalizeLowercaseStringOrEmpty(modelKey(provider, model));
}
function dedupeModelCatalogEntries(entries) {
	const seen = /* @__PURE__ */ new Set();
	const next = [];
	for (const entry of entries) {
		const key = modelKey(entry.provider, entry.id);
		if (seen.has(key)) continue;
		seen.add(key);
		next.push(entry);
	}
	return next;
}
function createModelVisibilityPolicyWithFallbacks(params) {
	const visibility = parseConfiguredModelVisibilityEntries({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const wildcardModelKeys = visibility.wildcardModelKeys;
	const policyAliasAgentId = resolvePolicyAliasAgentId(visibility.configPath, params.agentId);
	const policyAliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: policyAliasAgentId,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const selectionAliasIndex = params.agentId && policyAliasAgentId !== params.agentId ? buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		allowManifestNormalization: params.allowManifestNormalization,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	}) : policyAliasIndex;
	const allowed = buildAllowedModelSetWithFallbacks({
		...params,
		aliasIndex: policyAliasIndex,
		selectionAliasIndex,
		visibility
	});
	const configuredKeys = new Set(allowed.configuredCatalog.map(modelCatalogLogicalKey));
	const retainedKeys = /* @__PURE__ */ new Set();
	const addConfiguredRef = (raw, retained, aliasIndex) => {
		if (!raw?.trim() || parseModelPolicyWildcardRef(raw)) return;
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider: params.defaultProvider,
			aliasIndex,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		});
		if (!resolved) return;
		const key = modelCatalogLogicalKey({
			provider: resolved.ref.provider,
			id: resolved.ref.model
		});
		configuredKeys.add(key);
		if (retained) retainedKeys.add(key);
	};
	for (const raw of visibility.exactModelRefs) addConfiguredRef(raw, false, policyAliasIndex);
	for (const raw of params.additionalConfiguredModelRefs ?? []) addConfiguredRef(raw, false, selectionAliasIndex);
	addConfiguredRef(params.defaultModel, true, selectionAliasIndex);
	for (const fallback of params.fallbackModels) addConfiguredRef(fallback, true, selectionAliasIndex);
	const allowsKey = (key) => allowed.allowAny || isModelKeyAllowedBySet(allowed.allowedKeys, key);
	const exactConfiguredKeys = /* @__PURE__ */ new Set();
	for (const raw of visibility.exactModelRefs) {
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			raw,
			defaultProvider: params.defaultProvider,
			aliasIndex: policyAliasIndex,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		})?.ref;
		if (resolved) exactConfiguredKeys.add(modelKey(resolved.provider, resolved.model));
	}
	return {
		allowAny: allowed.allowAny,
		allowedCatalog: allowed.allowedCatalog,
		allowedKeys: allowed.allowedKeys,
		policyAliasIndex,
		selectionAliasIndex,
		configuredKeys,
		retainedKeys,
		exactModelRefs: visibility.exactModelRefs,
		providerWildcards: visibility.providerWildcards,
		hasConfiguredEntries: visibility.hasEntries,
		hasProviderWildcards: wildcardModelKeys.size > 0,
		allowConfigPath: visibility.configPath,
		allowRepairConfigPath: visibility.repairConfigPath,
		automaticFallbackKeys: allowed.automaticFallbackKeys,
		allowsKey,
		allows: (ref) => allowsKey(modelKey(ref.provider, ref.model)),
		allowsByWildcard: (ref) => isModelKeyAllowedBySet(wildcardModelKeys, modelKey(ref.provider, ref.model)),
		resolveSelection: (ref) => resolveAllowedModelSelection({
			provider: ref.provider,
			model: ref.model,
			cfg: params.cfg,
			allowAny: allowed.allowAny,
			allowedKeys: allowed.allowedKeys,
			allowedCatalog: allowed.allowedCatalog,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		}),
		visibleCatalog: ({ catalog, defaultVisibleCatalog, view }) => {
			if (view === "all") return [...catalog];
			if (allowed.allowAny) return [...defaultVisibleCatalog];
			if (wildcardModelKeys.size === 0) return [...allowed.allowedCatalog];
			return dedupeModelCatalogEntries([...defaultVisibleCatalog.filter((entry) => isModelKeyAllowedBySet(wildcardModelKeys, modelKey(entry.provider, entry.id))), ...allowed.allowedCatalog.filter((entry) => exactConfiguredKeys.has(modelKey(entry.provider, entry.id)))]);
		}
	};
}
//#endregion
export { resolveUniqueCatalogModelRoute as A, modelSupportsInput as C, resolveConfiguredProviderFallback as D, parseModelPolicyWildcardRef as E, modelTransportRoutesMatch as O, findModelInCatalog as S, isValidExactModelPolicyRef as T, resolveConfiguredModelRef as _, createModelVisibilityPolicyWithFallbacks as a, resolveModelRefFromString as b, hasConfiguredProviderModelRows as c, modelCatalogLogicalKey as d, normalizeModelSelection as f, resolveConfiguredModelPolicyAllow as g, resolveBareModelDefaultProvider as h, buildModelAliasIndex as i, resolveCatalogOwnedModelCompat as k, inferUniqueProviderFromConfiguredModels as l, resolveAllowedModelRefFromAliasIndex as m, buildAllowedModelSetWithFallbacks as n, dedupeModelCatalogEntries as o, parseConfiguredModelVisibilityEntries as p, buildConfiguredModelCatalog as r, getModelRefStatusWithFallbackModels as s, LEGACY_MODEL_POLICY_ALLOW_CONFIG_PATH as t, isModelKeyAllowedBySet as u, resolveHooksGmailModel as v, isModelPolicyCompatSelector as w, findModelCatalogEntry as x, resolveModelAliasFromPair as y };
