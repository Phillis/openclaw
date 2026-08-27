import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as stripAnsi, t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { D as hasExplicitModelPolicyAllow, E as computeModelPolicyAllowlist, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { r as isModelThinkingFormat } from "./types.models-Z6EPRVI_.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { a as normalizeConfiguredProviderCatalogModelId, l as normalizeStaticProviderModelId, o as normalizeModelRef, s as normalizeProviderId$1 } from "./model-ref-shared-D4yx0hwT.js";
import { n as resolveCatalogOwnedModelCompat, t as modelTransportRoutesMatch } from "./model-compat-catalog-BNBUeFnX.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-DI1_0gqL.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { t as canonicalizeProviderModelId } from "./provider-model-route-n5WsvCIn.js";
import { n as parseModelRef, t as findNormalizedProviderValue$1 } from "./model-selection-normalize-DRjRnS6Y.js";
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
/** Projects only thinking policy fields from broader model compatibility metadata. */
function projectModelThinkingCompat(compat) {
	const record = asOptionalRecord(compat);
	if (!record) return;
	const projected = {};
	if (typeof record.thinkingFormat === "string" && isModelThinkingFormat(record.thinkingFormat)) projected.thinkingFormat = record.thinkingFormat;
	if (record.supportedReasoningEfforts === null) projected.supportedReasoningEfforts = null;
	else if (Array.isArray(record.supportedReasoningEfforts) && record.supportedReasoningEfforts.every((effort) => typeof effort === "string")) projected.supportedReasoningEfforts = [...record.supportedReasoningEfforts];
	return Object.keys(projected).length > 0 ? projected : void 0;
}
/** Freezes thinking capability from the selected prepared catalog row. */
function prepareModelThinkingCapability(params) {
	const compat = projectModelThinkingCompat(params.entry?.compat);
	const provider = normalizeProviderId(params.entry?.provider ?? "");
	const modelId = normalizeOptionalString(params.entry?.id);
	const agentRuntime = normalizeLowercaseStringOrEmpty(params.agentRuntime);
	if (!compat || !provider || !modelId || !agentRuntime) return;
	const routeSource = params.route ?? (agentRuntime === "openclaw" ? params.entry : void 0);
	const api = normalizeOptionalString(routeSource?.api);
	const baseUrl = normalizeOptionalString(routeSource?.baseUrl);
	if (agentRuntime === "openclaw" && (!api || !baseUrl)) return;
	return {
		provider,
		modelId,
		agentRuntime,
		...api && baseUrl ? { route: {
			api,
			baseUrl
		} } : {},
		compat
	};
}
/** Resolves prepared thinking metadata only for the exact final model route and harness. */
function resolvePreparedModelThinkingCompat(params) {
	const capability = params.capability;
	if (!capability) return;
	const runtimeModelId = canonicalizeProviderModelId(capability.provider, params.model.id);
	const preparedModelId = canonicalizeProviderModelId(capability.provider, capability.modelId);
	return normalizeProviderId(params.model.provider) === capability.provider && runtimeModelId === preparedModelId && normalizeLowercaseStringOrEmpty(params.agentRuntime) === capability.agentRuntime && (!capability.route || modelTransportRoutesMatch(params.model, capability.route)) ? capability.compat : void 0;
}
/** Projects the prepared capabilities needed by one selected run candidate. */
function prepareModelRunCapabilities([catalog, configuredCatalog], [provider, modelId, agentRuntime]) {
	const entry = findModelInCatalog(catalog ?? [], provider, modelId);
	const configuredEntry = findModelInCatalog(configuredCatalog, provider, modelId);
	return {
		modelHasVision: modelSupportsInput(entry, "image"),
		modelThinkingCapability: prepareModelThinkingCapability({
			entry: entry ?? configuredEntry,
			route: agentRuntime === "openclaw" ? configuredEntry ?? entry : void 0,
			agentRuntime
		})
	};
}
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
function isStaticDefaultProviderAliasCandidate(candidate, cfg) {
	const raw = candidate.keyRaw.trim();
	const slash = raw.indexOf("/");
	return slash > 0 && slash < raw.length - 1 && normalizeProviderId$1(raw.slice(0, slash)) === normalizeProviderId$1("openai") && !findExactConfiguredProviderRefParts({
		cfg,
		raw
	});
}
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
function listConfiguredModelMaps(cfg, agentId) {
	return [{ models: cfg.agents?.defaults?.models }, ...agentId ? [{ models: resolveAgentConfig(cfg, agentId)?.models }] : []];
}
function listModelAliasCandidates(cfg, agentId) {
	return listConfiguredModelMaps(cfg, agentId).flatMap(({ models }) => Object.entries(models ?? {}).flatMap(([keyRaw, entryRaw]) => {
		if (parseModelPolicyWildcardRef(keyRaw)) return [];
		if (!entryRaw || typeof entryRaw !== "object" || !Object.hasOwn(entryRaw, "alias")) return [];
		return [{
			keyRaw,
			alias: normalizeOptionalString(entryRaw.alias) ?? ""
		}];
	}));
}
function buildEffectiveModelAliases(params) {
	const aliasesByKey = /* @__PURE__ */ new Map();
	const candidates = listModelAliasCandidates(params.cfg, params.agentId);
	if (candidates.length === 0) return {
		aliases: [],
		disabledKeys: /* @__PURE__ */ new Set()
	};
	const useStaticDefaultProviderAliases = params.allowManifestNormalization !== false && candidates.every((candidate) => isStaticDefaultProviderAliasCandidate(candidate, params.cfg)) && params.manifestPluginContext.peek() === void 0 && !getActivePluginRegistryWorkspaceDirFromState() && !getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		env: process.env
	});
	const manifestPlugins = useStaticDefaultProviderAliases ? void 0 : params.manifestPluginContext.get();
	for (const candidate of candidates) {
		const ref = parseModelRefWithCompatAlias({
			cfg: params.cfg,
			agentId: params.agentId,
			raw: candidate.keyRaw,
			defaultProvider: params.defaultProvider,
			allowManifestNormalization: useStaticDefaultProviderAliases ? false : params.allowManifestNormalization,
			allowPluginNormalization: useStaticDefaultProviderAliases ? false : params.allowPluginNormalization,
			manifestPlugins
		});
		if (!ref) continue;
		const key = modelKey(ref.provider, ref.model);
		aliasesByKey.delete(key);
		aliasesByKey.set(key, candidate.alias ? {
			...candidate,
			ref
		} : null);
	}
	return {
		aliases: [...aliasesByKey.values()].filter((alias) => alias !== null),
		disabledKeys: new Set([...aliasesByKey].flatMap(([key, alias]) => alias === null ? [key] : []))
	};
}
function findModelAliasCandidate(candidates, raw) {
	const aliasKey = normalizeLowercaseStringOrEmpty(raw);
	let match;
	for (const candidate of candidates) if (normalizeLowercaseStringOrEmpty(candidate.alias) === aliasKey) match = candidate;
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
	const collectModelMapProviders = (models) => {
		const providers = /* @__PURE__ */ new Set();
		for (const key of Object.keys(models ?? {})) {
			const ref = key.trim();
			if (!ref || !ref.includes("/") || ref.endsWith("/*")) continue;
			const parsed = parseModelRef(ref, DEFAULT_PROVIDER, {
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: false,
				manifestPlugins: params.manifestPlugins
			});
			if (parsed && (parsed.model === model || normalizeLowercaseStringOrEmpty(parsed.model) === normalized)) providers.add(normalizeProviderId$1(parsed.provider));
		}
		return providers;
	};
	const agentProviders = params.agentId ? collectModelMapProviders(resolveAgentConfig(params.cfg, params.agentId)?.models) : /* @__PURE__ */ new Set();
	if (agentProviders.size > 0) return agentProviders.size === 1 ? agentProviders.values().next().value : void 0;
	const providers = collectModelMapProviders(params.cfg.agents?.defaults?.models);
	const addProvider = (provider) => {
		const normalizedProvider = normalizeProviderId$1(provider);
		if (!normalizedProvider) return;
		providers.add(normalizedProvider);
	};
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
		agentId: params.agentId,
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
	const agentModels = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.models : void 0;
	for (const models of [agentModels, params.cfg.agents?.defaults?.models]) for (const raw of Object.keys(models ?? {})) {
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
		agentId: params.agentId,
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
function buildModelAliasIndexWithManifestContext(params) {
	const byAlias = /* @__PURE__ */ new Map();
	const byProviderAlias = /* @__PURE__ */ new Map();
	const byKey = /* @__PURE__ */ new Map();
	const { aliases, disabledKeys } = buildEffectiveModelAliases(params);
	if (aliases.length === 0) return {
		byAlias,
		byProviderAlias,
		byKey,
		disabledKeys
	};
	for (const { alias, ref } of aliases) {
		const aliasKey = normalizeLowercaseStringOrEmpty(alias);
		const match = {
			alias,
			ref
		};
		const key = modelKey(ref.provider, ref.model);
		byAlias.set(aliasKey, match);
		byProviderAlias.set(providerAliasKey(ref.provider, alias), match);
		byKey.set(key, [alias]);
	}
	return {
		byAlias,
		byProviderAlias,
		byKey,
		disabledKeys
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
	return {
		configuredByKey,
		aliasByKey: new Map([...params.aliasIndex.byKey].flatMap(([key, aliases]) => {
			const alias = aliases.at(-1);
			return alias ? [[key, alias]] : [];
		}))
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
	const configuredReasoning = configuredEntry?.configuredReasoning;
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
		...configuredReasoning !== void 0 ? { configuredReasoning } : {},
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
	const configuredReasoning = configuredEntry?.configuredReasoning;
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
		...configuredReasoning !== void 0 ? { configuredReasoning } : {},
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
		agentId: params.agentId,
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
	const rawModel = (params.agentId ? resolveAgentModelPrimaryValue(resolveAgentConfig(params.cfg, params.agentId)?.model) : void 0) ?? resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model) ?? "";
	if (rawModel) {
		const trimmed = rawModel.trim();
		const { model: modelWithoutProfile } = splitTrailingAuthProfile(trimmed);
		const manifestPluginContext = createModelManifestPluginContext(params);
		const profileStripped = Boolean(modelWithoutProfile && modelWithoutProfile !== trimmed);
		const aliasKeys = new Set([trimmed, ...profileStripped ? [modelWithoutProfile] : []].map(normalizeLowercaseStringOrEmpty));
		const aliasCandidates = listModelAliasCandidates(params.cfg, params.agentId).some((candidate) => aliasKeys.has(normalizeLowercaseStringOrEmpty(candidate.alias))) ? buildEffectiveModelAliases({
			cfg: params.cfg,
			agentId: params.agentId,
			defaultProvider: params.defaultProvider,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPluginContext
		}).aliases : [];
		const exactAliasCandidate = findModelAliasCandidate(aliasCandidates, trimmed);
		const strippedAliasCandidate = profileStripped ? findModelAliasCandidate(aliasCandidates, modelWithoutProfile) : void 0;
		const profileAliasCandidate = profileStripped ? exactAliasCandidate ?? strippedAliasCandidate : void 0;
		if (profileAliasCandidate) return profileAliasCandidate.ref;
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
				agentId: params.agentId,
				raw: primaryWithoutProfile,
				defaultProvider: params.defaultProvider,
				allowManifestNormalization: params.allowManifestNormalization,
				allowPluginNormalization: params.allowPluginNormalization,
				manifestPlugins: manifestPluginContext.get()
			});
			if (primaryRef) return primaryRef;
		}
		if (aliasCandidate) return aliasCandidate.ref;
		if (!trimmed.includes("/")) {
			const normalizedTrimmed = normalizeLowercaseStringOrEmpty(trimmed);
			const needsOpenRouterCompatManifestPlugins = normalizedTrimmed === "openrouter:auto" || normalizedTrimmed === OPENROUTER_COMPAT_FREE_ALIAS;
			const openrouterCompatRef = resolveConfiguredOpenRouterCompatAlias({
				cfg: params.cfg,
				agentId: params.agentId,
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
				agentId: params.agentId,
				allowManifestNormalization: false,
				manifestPlugins
			});
			let inferredProviderManifestPlugins = manifestPlugins;
			if ((!inferredProvider || inferredProvider !== "openai") && hasConfiguredRowsNeedingManifestLookup(params.cfg, params.defaultProvider, params.agentId)) {
				inferredProviderManifestPlugins = manifestPluginContext.get();
				inferredProvider = inferUniqueProviderFromConfiguredModels({
					cfg: params.cfg,
					model: trimmed,
					agentId: params.agentId,
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
			agentId: params.agentId,
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
/** Build explicit model override authorization without widening it for automatic fallbacks. */
function buildAllowedModelSet(params) {
	return buildAllowedModelSetFromPrepared(params, prepareModelPolicy(params));
}
function prepareModelPolicy(params) {
	const visibility = parseConfiguredModelVisibilityEntries(params);
	const policyAliasAgentId = resolvePolicyAliasAgentId(visibility.configPath, params.agentId);
	const policyAliasIndex = buildModelAliasIndex({
		...params,
		agentId: policyAliasAgentId
	});
	const selectionAliasIndex = params.agentId && policyAliasAgentId !== params.agentId ? buildModelAliasIndex(params) : policyAliasIndex;
	const configuredCatalog = buildConfiguredModelCatalog({
		cfg: params.cfg,
		manifestPlugins: params.manifestPlugins
	});
	const metadata = buildModelCatalogMetadata({
		configuredCatalog,
		aliasIndex: selectionAliasIndex
	});
	return {
		visibility,
		policyAliasIndex,
		selectionAliasIndex,
		configuredCatalog,
		metadata,
		catalog: mergeModelCatalogEntries({
			primary: params.catalog,
			secondary: configuredCatalog
		}).map((entry) => applyModelCatalogMetadata({
			entry,
			metadata
		}))
	};
}
function buildAllowedModelSetFromPrepared(params, { visibility, policyAliasIndex, metadata, catalog }) {
	const wildcardModelKeys = visibility.wildcardModelKeys;
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
		agentId: params.agentId,
		raw: defaultModel,
		defaultProvider: params.defaultProvider,
		...defaultModelNormalization
	}) : null;
	const defaultKey = defaultRef ? modelKey(defaultRef.provider, defaultRef.model) : void 0;
	const resolvePolicyModelRef = (raw) => {
		const trimmed = raw.trim();
		const defaultProvider = !trimmed.includes("/") ? resolveBareModelDefaultProvider({
			cfg: params.cfg,
			catalog,
			model: trimmed,
			defaultProvider: params.defaultProvider,
			agentId: params.agentId,
			manifestPlugins: params.manifestPlugins
		}) : params.defaultProvider;
		return resolveModelRefFromString({
			cfg: params.cfg,
			agentId: params.agentId,
			raw,
			defaultProvider,
			aliasIndex: policyAliasIndex,
			allowManifestNormalization: params.allowManifestNormalization,
			allowPluginNormalization: params.allowPluginNormalization,
			manifestPlugins: params.manifestPlugins
		})?.ref;
	};
	const catalogKeys = /* @__PURE__ */ new Set();
	for (const entry of catalog) catalogKeys.add(modelKey(entry.provider, entry.id));
	if (allowAny) {
		if (defaultKey) catalogKeys.add(defaultKey);
		return {
			allowAny: true,
			allowedCatalog: catalog,
			allowedKeys: catalogKeys
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
	const addAllowedModelRef = (raw) => {
		const parsed = resolvePolicyModelRef(raw);
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
	for (const raw of visibility.exactModelRefs) addAllowedModelRef(raw);
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
			allowedKeys: catalogKeys
		};
	}
	return {
		allowAny: false,
		allowedCatalog,
		allowedKeys
	};
}
function getModelRefStatus(params) {
	const allowed = buildAllowedModelSet(params);
	const key = modelKey(params.ref.provider, params.ref.model);
	return {
		key,
		inCatalog: Boolean(findModelCatalogEntry(params.catalog, {
			provider: params.ref.provider,
			modelId: params.ref.model
		})),
		allowAny: allowed.allowAny,
		allowed: allowed.allowAny || isModelKeyAllowedBySet(allowed.allowedKeys, key)
	};
}
/** Resolve a requested model string only if it is allowed by the supplied status check. */
function resolveAllowedModelRefFromAliasIndex(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return { error: "invalid model: empty" };
	const effectiveDefaultProvider = !trimmed.includes("/") ? inferUniqueProviderFromConfiguredModels({
		cfg: params.cfg,
		model: trimmed,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	}) ?? params.defaultProvider : params.defaultProvider;
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
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
function hasConfiguredModelRefsNeedingManifestLookup(cfg, defaultProvider, agentId) {
	const normalizedDefaultProvider = normalizeProviderId$1(defaultProvider);
	return listConfiguredModelMaps(cfg, agentId).some(({ models }) => Object.keys(models ?? {}).some((keyRaw) => {
		const key = keyRaw.trim();
		if (!key || key.endsWith("/*")) return false;
		const slashIndex = key.indexOf("/");
		if (slashIndex <= 0) return false;
		const provider = normalizeProviderId$1(key.slice(0, slashIndex));
		return Boolean(provider && provider !== normalizedDefaultProvider);
	}));
}
function hasConfiguredRowsNeedingManifestLookup(cfg, defaultProvider, agentId) {
	return hasConfiguredProviderRowsNeedingManifestLookup(cfg) || hasConfiguredModelRefsNeedingManifestLookup(cfg, defaultProvider, agentId);
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
				...typeof model?.reasoning === "boolean" ? { configuredReasoning: model.reasoning } : {},
				...model.thinkingLevelMap ? { thinkingLevelMap: model.thinkingLevelMap } : {},
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
	const prepared = prepareModelPolicy(params);
	const { visibility, policyAliasIndex, selectionAliasIndex, configuredCatalog } = prepared;
	const wildcardModelKeys = visibility.wildcardModelKeys;
	const allowed = buildAllowedModelSetFromPrepared(params, prepared);
	const configuredKeys = new Set(configuredCatalog.map(modelCatalogLogicalKey));
	const retainedKeys = /* @__PURE__ */ new Set();
	const addConfiguredRef = (raw, retained, aliasIndex) => {
		if (!raw?.trim() || parseModelPolicyWildcardRef(raw)) return;
		const resolved = resolveModelRefFromString({
			cfg: params.cfg,
			agentId: params.agentId,
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
		return resolved.ref;
	};
	const exactConfiguredKeys = /* @__PURE__ */ new Set();
	for (const raw of visibility.exactModelRefs) {
		const resolved = addConfiguredRef(raw, false, policyAliasIndex);
		if (resolved) exactConfiguredKeys.add(modelKey(resolved.provider, resolved.model));
	}
	for (const raw of params.additionalConfiguredModelRefs ?? []) addConfiguredRef(raw, false, selectionAliasIndex);
	addConfiguredRef(params.defaultModel, true, selectionAliasIndex);
	for (const fallback of params.fallbackModels) addConfiguredRef(fallback, true, selectionAliasIndex);
	const allowsKey = (key) => allowed.allowAny || isModelKeyAllowedBySet(allowed.allowedKeys, key);
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
export { resolveConfiguredProviderFallback as A, modelSupportsInput as C, isModelPolicyCompatSelector as D, resolvePreparedModelThinkingCompat as E, isValidExactModelPolicyRef as O, findModelInCatalog as S, projectModelThinkingCompat as T, resolveConfiguredModelRef as _, createModelVisibilityPolicyWithFallbacks as a, resolveModelRefFromString as b, hasConfiguredProviderModelRows as c, listModelAliasCandidates as d, modelCatalogLogicalKey as f, resolveConfiguredModelPolicyAllow as g, resolveBareModelDefaultProvider as h, buildModelAliasIndex as i, parseModelPolicyWildcardRef as k, inferUniqueProviderFromConfiguredModels as l, resolveAllowedModelRefFromAliasIndex as m, buildAllowedModelSet as n, dedupeModelCatalogEntries as o, parseConfiguredModelVisibilityEntries as p, buildConfiguredModelCatalog as r, getModelRefStatus as s, LEGACY_MODEL_POLICY_ALLOW_CONFIG_PATH as t, isModelKeyAllowedBySet as u, resolveHooksGmailModel as v, prepareModelRunCapabilities as w, findModelCatalogEntry as x, resolveModelAliasFromPair as y };
