import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { o as toAgentModelListLike, r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { o as resolveAgentEffectiveModelPrimary, p as resolveEffectiveModelFallbacks, u as resolveAgentModelFallbacksOverride } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-poyRjWh_.js";
import { D as resolveConfiguredProviderFallback, _ as resolveConfiguredModelRef, b as resolveModelRefFromString, f as normalizeModelSelection, i as buildModelAliasIndex } from "./model-selection-shared-DT9x3Cg2.js";
import { _ as isDefaultAgentRuntimeId, l as resolveOpenAIImplicitAgentRuntime, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-rNKXMHlB.js";
import { t as listMutableCodexRouteAgentEntries } from "./codex-route-agent-entries-Czj7-L1O.js";
//#region src/agents/model-selection-config.ts
/** Pure configured-model selection helpers safe for config validation. */
function resolveDefaultModelForAgent(params) {
	const agentModelOverride = params.agentId ? resolveAgentEffectiveModelPrimary(params.cfg, params.agentId) : void 0;
	return resolveConfiguredModelRef({
		cfg: agentModelOverride && agentModelOverride.length > 0 ? {
			...params.cfg,
			agents: {
				...params.cfg.agents,
				defaults: {
					...params.cfg.agents?.defaults,
					model: {
						...toAgentModelListLike(params.cfg.agents?.defaults?.model),
						primary: agentModelOverride
					}
				}
			}
		} : params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return normalizeModelSelection(agentConfig?.subagents?.model) ?? normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model) ?? (params.includeAgentPrimary === false ? void 0 : normalizeModelSelection(agentConfig?.model));
}
//#endregion
//#region src/config/codex-plugin-diagnostics.ts
const CODEX_PLUGIN_ID = "codex";
const OPENAI_PROVIDER_ID = "openai";
function codexPluginEntryEnabled(cfg) {
	for (const [pluginId, entry] of Object.entries(cfg.plugins?.entries ?? {})) if (normalizeLowercaseStringOrEmpty(pluginId) === CODEX_PLUGIN_ID) return entry?.enabled;
}
function configuredRuntimeNeedsCodex(params) {
	const runtimeId = normalizeOptionalAgentRuntimeId(params.runtimeId);
	if (runtimeId === CODEX_PLUGIN_ID) return true;
	if (!isDefaultAgentRuntimeId(runtimeId)) return false;
	return resolveOpenAIImplicitAgentRuntime({
		provider: OPENAI_PROVIDER_ID,
		modelId: params.modelId,
		config: params.cfg,
		env: params.env
	}) === CODEX_PLUGIN_ID;
}
/** Resolves effective runtime policy for one canonical provider/model route. */
function configuredModelRouteNeedsCodex(params) {
	if (normalizeProviderId(params.route.provider) !== OPENAI_PROVIDER_ID) return false;
	const runtime = resolveModelRuntimePolicy({
		config: params.cfg,
		provider: OPENAI_PROVIDER_ID,
		modelId: params.route.modelId,
		agentId: params.agentId
	}).policy?.id;
	return configuredRuntimeNeedsCodex({
		cfg: params.cfg,
		env: params.env,
		modelId: params.route.modelId,
		runtimeId: runtime
	});
}
function resolveEffectiveSelectedModelRefs(params) {
	const { cfg, agentId } = params;
	const mainPrimaryRaw = resolveAgentEffectiveModelPrimary(cfg, agentId);
	const mainFallbacks = resolveAgentModelFallbacksOverride(cfg, agentId) ?? resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
	const subagentPrimaryRaw = resolveSubagentConfiguredModelSelection({
		cfg,
		agentId
	}) ?? mainPrimaryRaw;
	const subagentFallbacks = resolveEffectiveModelFallbacks({
		cfg,
		agentId,
		sessionKey: `agent:${agentId}:subagent:codex-diagnostic`,
		hasSessionModelOverride: true,
		modelOverrideSource: "auto"
	}) ?? [];
	const values = /* @__PURE__ */ new Set();
	for (const raw of [
		mainPrimaryRaw,
		...mainFallbacks,
		subagentPrimaryRaw,
		...subagentFallbacks
	]) {
		const value = raw?.trim();
		if (value) values.add(value);
	}
	return {
		complete: Boolean(mainPrimaryRaw?.trim() && subagentPrimaryRaw?.trim()),
		values
	};
}
function configuredRefTargetsAgent(params) {
	const match = /^agents\.list\.(\d+)\./.exec(params.path);
	if (match) {
		const entry = (params.sourceConfigBeforeMigrations ?? params.cfg).agents?.list?.[Number(match[1])];
		return Boolean(entry && normalizeAgentId(entry.id) === params.agentId);
	}
	const keyedMatch = /^agents\.entries\.([^.]+)\./.exec(params.path);
	return !keyedMatch || normalizeAgentId(keyedMatch[1] ?? "") === params.agentId;
}
function configuredRefIsEffectiveForAgent(params) {
	if (!configuredRefTargetsAgent(params)) return false;
	if (/^agents\.(?:defaults|list\.\d+)\.(?:model|subagents\.model)(?:\.|$)/.test(params.path)) return params.selectedModelRefs.has(params.value);
	const agent = resolveAgentConfig(params.cfg, params.agentId);
	if (params.path.endsWith(".heartbeat.model")) return (agent?.heartbeat?.model?.trim() || params.cfg.agents?.defaults?.heartbeat?.model?.trim()) === params.value;
	if (params.path.endsWith(".utilityModel")) return (agent?.utilityModel ?? params.cfg.agents?.defaults?.utilityModel)?.trim() === params.value;
	return true;
}
function configuredProviderPoliciesNeedCodex(cfg, env, agentIds) {
	for (const agentId of agentIds) {
		const genericPolicy = resolveModelRuntimePolicy({
			config: cfg,
			provider: OPENAI_PROVIDER_ID,
			agentId
		}).policy;
		if (genericPolicy?.id?.trim() && configuredRuntimeNeedsCodex({
			cfg,
			env,
			runtimeId: genericPolicy.id
		})) return true;
	}
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		if (normalizeProviderId(providerId) !== OPENAI_PROVIDER_ID) continue;
		for (const model of providerConfig.models ?? []) {
			if (!model.agentRuntime?.id?.trim()) continue;
			const parsed = parseModelCatalogRef(model.id);
			const modelId = parsed?.provider === OPENAI_PROVIDER_ID ? parsed.modelId : model.id.trim();
			if (modelId && modelId !== "*" && agentIds.some((agentId) => configuredModelRouteNeedsCodex({
				cfg,
				env,
				agentId,
				route: {
					provider: OPENAI_PROVIDER_ID,
					modelId
				}
			}))) return true;
		}
	}
	return false;
}
function configuredModelRefsNeedCodex(params) {
	const refs = collectConfiguredModelRefs(params.sourceConfigBeforeMigrations ?? params.cfg);
	let complete = true;
	for (const agentId of params.agentIds) {
		const selected = resolveEffectiveSelectedModelRefs({
			cfg: params.cfg,
			agentId
		});
		complete &&= selected.complete;
		const primary = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId,
			manifestPlugins: []
		});
		const aliasIndex = buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider: primary.provider,
			manifestPlugins: []
		});
		for (const ref of refs) {
			if (!configuredRefIsEffectiveForAgent({
				cfg: params.cfg,
				sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations,
				path: ref.path,
				value: ref.value,
				agentId,
				selectedModelRefs: selected.values
			})) continue;
			const resolved = resolveModelRefFromString({
				cfg: params.cfg,
				raw: ref.value,
				defaultProvider: primary.provider,
				aliasIndex,
				allowManifestNormalization: false
			});
			const route = resolved ? {
				provider: resolved.ref.provider,
				modelId: resolved.ref.model
			} : void 0;
			if (route && configuredModelRouteNeedsCodex({
				cfg: params.cfg,
				env: params.env,
				agentId,
				route
			})) return {
				complete,
				needsCodex: true
			};
		}
	}
	return {
		complete,
		needsCodex: false
	};
}
function defaultOpenAiRouteNeedsCodex(cfg, env, agentIds) {
	return agentIds.some((agentId) => {
		const runtimeId = resolveModelRuntimePolicy({
			config: cfg,
			provider: OPENAI_PROVIDER_ID,
			agentId
		}).policy?.id;
		return configuredRuntimeNeedsCodex({
			cfg,
			env,
			runtimeId
		});
	});
}
function configNeedsCodexForOpenAi(cfg, env, sourceConfigBeforeMigrations) {
	const agentIds = listAgentIds(cfg);
	const configuredRefs = configuredModelRefsNeedCodex({
		cfg,
		env,
		agentIds,
		sourceConfigBeforeMigrations
	});
	if (configuredRefs.needsCodex) return true;
	if (configuredProviderPoliciesNeedCodex(cfg, env, agentIds)) return true;
	return configuredRefs.complete ? false : defaultOpenAiRouteNeedsCodex(cfg, env, agentIds);
}
/** Suppresses missing Codex diagnostics when no effective OpenAI route selects it. */
function shouldSuppressMissingCodexPluginDiagnostics(cfg, env = process.env, sourceConfigBeforeMigrations) {
	const entryEnabled = codexPluginEntryEnabled(cfg);
	if (entryEnabled === true) return false;
	return entryEnabled === false || !configNeedsCodexForOpenAi(cfg, env, sourceConfigBeforeMigrations);
}
//#endregion
//#region src/commands/doctor/shared/codex-route-model-ref.ts
function normalizeRuntimeString(value) {
	return normalizeOptionalAgentRuntimeId(value);
}
function asAgentRuntimePolicyConfig(value) {
	const record = asOptionalRecord(value);
	return record ? { id: typeof record.id === "string" ? record.id : void 0 } : void 0;
}
function readLegacyDefaultsRuntime(defaults) {
	return asAgentRuntimePolicyConfig(asOptionalRecord(defaults)?.agentRuntime);
}
const LEGACY_CODEX_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai-codex"]);
function legacyCodexProviderIdentityKey(providerId) {
	const normalized = normalizeOptionalLowercaseString(providerId);
	return normalized && LEGACY_CODEX_PROVIDER_IDS.has(normalized) ? `${normalized}\u0000` : void 0;
}
function legacyCodexModelIdentityKey(params) {
	const providerId = normalizeOptionalLowercaseString(params.providerId);
	if (!providerId || !LEGACY_CODEX_PROVIDER_IDS.has(providerId) || typeof params.modelId !== "string") return;
	const modelId = splitTrailingAuthProfile(params.modelId).model.trim();
	if (!modelId) return;
	const slash = modelId.indexOf("/");
	const unscopedModelId = slash > 0 && LEGACY_CODEX_PROVIDER_IDS.has(normalizeOptionalLowercaseString(modelId.slice(0, slash)) ?? "") ? modelId.slice(slash + 1).trim() : modelId;
	return unscopedModelId ? `${providerId}\u0000${unscopedModelId}` : void 0;
}
function legacyCodexModelRefIdentityKey(modelRef) {
	if (typeof modelRef !== "string") return;
	const model = splitTrailingAuthProfile(modelRef).model.trim();
	const slash = model.indexOf("/");
	if (slash <= 0) return;
	return legacyCodexModelIdentityKey({
		providerId: model.slice(0, slash),
		modelId: model.slice(slash + 1)
	});
}
function isBlockedLegacyCodexModelRef(params) {
	const identity = legacyCodexModelRefIdentityKey(params.modelRef);
	if (!identity || !params.blockedModelIdentities) return false;
	const separator = identity.indexOf("\0");
	const providerIdentity = separator >= 0 ? identity.slice(0, separator + 1) : void 0;
	return params.blockedModelIdentities.has(identity) || Boolean(providerIdentity && params.blockedModelIdentities.has(providerIdentity));
}
function isBlockedLegacyCodexModelPair(params) {
	if (!params.blockedModelIdentities) return false;
	const providerIdentity = legacyCodexProviderIdentityKey(params.providerId);
	const modelIdentity = legacyCodexModelIdentityKey(params);
	return Boolean(providerIdentity && params.blockedModelIdentities.has(providerIdentity)) || Boolean(modelIdentity && params.blockedModelIdentities.has(modelIdentity));
}
function isLegacyCodexProviderId(provider) {
	const normalized = normalizeOptionalLowercaseString(provider);
	return normalized ? LEGACY_CODEX_PROVIDER_IDS.has(normalized) : false;
}
function readLegacyCodexModelId(model) {
	if (typeof model !== "string") return;
	const trimmed = model.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || !LEGACY_CODEX_PROVIDER_IDS.has(normalizeOptionalLowercaseString(trimmed.slice(0, slash)) ?? "")) return;
	return trimmed.slice(slash + 1).trim() || void 0;
}
function isOpenAICodexModelRef(model) {
	return readLegacyCodexModelId(model) !== void 0;
}
function isOpenAICodexAuthProfileRef(profile) {
	const normalized = normalizeOptionalLowercaseString(profile);
	const separator = normalized?.indexOf(":") ?? -1;
	return separator > 0 && LEGACY_CODEX_PROVIDER_IDS.has(normalized?.slice(0, separator) ?? "");
}
function isProviderlessModelRef(model) {
	const normalized = normalizeOptionalLowercaseString(model);
	return Boolean(normalized && !normalized.includes("/"));
}
function toCanonicalOpenAIModelRef(model) {
	const modelId = readLegacyCodexModelId(model);
	return modelId ? `openai/${modelId}` : void 0;
}
function toOpenAIModelId(model) {
	return readLegacyCodexModelId(model);
}
function resolveRuntime(params) {
	return normalizeRuntimeString(params.agentRuntime?.id) ?? normalizeRuntimeString(params.defaultsRuntime?.id);
}
function readModelConfigPrimaryRef(value) {
	if (typeof value === "string") return value.trim() || void 0;
	const record = asOptionalRecord(value);
	if (typeof record?.primary === "string") return record.primary.trim() || void 0;
}
function readAgentPrimaryModelRef(agent, fallback) {
	const record = asOptionalRecord(agent);
	if (!record) return fallback;
	return readModelConfigPrimaryRef(record.model) ?? fallback;
}
function modelRefUsesCodexRuntime(params) {
	const effectiveModelRef = params.modelRef?.trim() || `openai/gpt-5.6-sol`;
	if (isOpenAICodexModelRef(effectiveModelRef)) return true;
	return canonicalOpenAIModelUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: resolveRuntimeModelRef({
			cfg: params.cfg,
			modelRef: effectiveModelRef,
			agentId: params.agentId
		}),
		agentId: params.agentId,
		env: params.env
	});
}
function resolveRuntimeModelRef(params) {
	const effectiveModelRef = normalizeProviderModelRefAuthProfile(params.modelRef) ?? `openai/gpt-5.6-sol`;
	const legacyCodexModel = toCanonicalOpenAIModelRef(effectiveModelRef);
	if (legacyCodexModel) return legacyCodexModel;
	return resolveKnownCompatModelAliasRef(effectiveModelRef) ?? resolveConfiguredModelAliasRef({
		cfg: params.cfg,
		modelRef: effectiveModelRef,
		agentId: params.agentId
	}) ?? resolveConfiguredBareModelRef({
		cfg: params.cfg,
		modelRef: effectiveModelRef,
		agentId: params.agentId
	}) ?? normalizeDefaultProviderModelRef(effectiveModelRef, resolveDefaultProviderForAliasContext({
		cfg: params.cfg,
		agentId: params.agentId
	}));
}
function normalizeProviderModelRefAuthProfile(modelRef) {
	const trimmed = modelRef.trim();
	if (!trimmed) return;
	return splitTrailingAuthProfile(trimmed).model || trimmed;
}
function resolveKnownCompatModelAliasRef(modelRef) {
	const normalized = normalizeOptionalLowercaseString(modelRef);
	if (!normalized?.startsWith("openrouter:")) return;
	const modelId = normalized.slice(11).trim();
	return modelId ? `openrouter/openrouter/${modelId}` : void 0;
}
function resolveConfiguredModelAliasRef(params) {
	const aliasKey = normalizeOptionalLowercaseString(params.modelRef);
	if (!aliasKey) return;
	const defaultProvider = resolveDefaultProviderForAliasContext({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolveAliasFromModelsMap(asOptionalRecord(params.cfg.agents?.defaults?.models), aliasKey, defaultProvider);
}
function resolveDefaultProviderForAliasContext(params) {
	const primaryModelRef = readModelConfigPrimaryRef(findAgentById(params.cfg, params.agentId)?.model) ?? readModelConfigPrimaryRef(params.cfg.agents?.defaults?.model);
	if (primaryModelRef) {
		const effectivePrimaryModelRef = normalizeProviderModelRefAuthProfile(primaryModelRef) ?? primaryModelRef;
		const legacyCodexModel = toCanonicalOpenAIModelRef(effectivePrimaryModelRef);
		const compatModelRef = resolveKnownCompatModelAliasRef(effectivePrimaryModelRef);
		return normalizeProviderId((parseCodexRouteModelRef(resolveAliasFromModelsMap(asOptionalRecord(params.cfg.agents?.defaults?.models), normalizeOptionalLowercaseString(effectivePrimaryModelRef) ?? "", "openai") ?? compatModelRef ?? legacyCodexModel ?? effectivePrimaryModelRef) ?? parseCodexRouteModelRef(resolveConfiguredBareModelRef({
			cfg: params.cfg,
			modelRef: effectivePrimaryModelRef,
			agentId: params.agentId
		}) ?? ""))?.provider ?? "openai") || "openai";
	}
	return normalizeProviderId(parseCodexRouteModelRef(resolveImplicitDefaultAgentModelRef(params.cfg))?.provider ?? "openai") || "openai";
}
function findAgentById(cfg, agentId) {
	if (!agentId) return;
	const normalizedAgentId = normalizeAgentId(agentId);
	return listMutableCodexRouteAgentEntries(cfg).find((entry) => entry.agentId === normalizedAgentId)?.agent;
}
function resolveAliasFromModelsMap(models, aliasKey, defaultProvider) {
	for (const [modelRef, entry] of Object.entries(models ?? {})) {
		if (normalizeOptionalLowercaseString(asOptionalRecord(entry)?.alias) !== aliasKey) continue;
		const compatRef = resolveKnownCompatModelAliasRef(modelRef);
		if (compatRef) return compatRef;
		return modelRef.includes("/") ? normalizeDefaultProviderModelRef(modelRef) : `${defaultProvider}/${modelRef}`;
	}
}
function resolveConfiguredBareModelRef(params) {
	const modelId = params.modelRef.trim();
	if (!modelId || modelId.includes("/")) return;
	const matches = /* @__PURE__ */ new Set();
	const pushModelMapMatches = (models) => {
		for (const key of Object.keys(models ?? {})) {
			const parsed = parseCodexRouteModelRef(key);
			if (parsed?.modelId === modelId) matches.add(`${parsed.provider}/${parsed.modelId}`);
		}
	};
	pushModelMapMatches(asOptionalRecord(params.cfg.agents?.defaults?.models));
	for (const [provider, providerConfig] of Object.entries(params.cfg.models?.providers ?? {})) for (const model of providerConfig?.models ?? []) if (providerCatalogModelMatches(provider, model?.id, modelId)) matches.add(`${normalizeProviderId(provider)}/${modelId}`);
	return matches.size === 1 ? [...matches][0] : void 0;
}
function providerCatalogModelMatches(provider, catalogModelId, modelId) {
	const rawId = catalogModelId?.trim();
	if (!rawId) return false;
	const normalizedId = normalizeConfiguredProviderCatalogModelId(provider, rawId);
	if (normalizedId === modelId) return true;
	return normalizeOptionalLowercaseString(normalizedId) === normalizeOptionalLowercaseString(modelId);
}
function normalizeDefaultProviderModelRef(modelRef, defaultProvider = DEFAULT_PROVIDER) {
	return modelRef.includes("/") ? modelRef : `${defaultProvider}/${modelRef}`;
}
function normalizeProviderModelRef(provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider);
	const normalizedModelId = normalizeConfiguredProviderCatalogModelId(normalizedProvider, modelId);
	const slash = normalizedModelId.indexOf("/");
	if (slash > 0 && normalizeProviderId(normalizedModelId.slice(0, slash)) === normalizedProvider && slash < normalizedModelId.length - 1) return `${normalizedProvider}/${normalizedModelId.slice(slash + 1)}`;
	return `${normalizedProvider}/${normalizedModelId}`;
}
function resolveImplicitDefaultAgentModelRef(cfg) {
	const fallbackProvider = resolveConfiguredProviderFallback({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	return fallbackProvider ? normalizeProviderModelRef(fallbackProvider.provider, fallbackProvider.model) : `${DEFAULT_PROVIDER}/${DEFAULT_MODEL}`;
}
function agentUsesCodexRuntimeForCompaction(params) {
	const runtime = concreteRuntimeId(normalizeOptionalLowercaseString(params.currentRuntime));
	if (runtime) return runtime === "codex";
	return modelRefUsesCodexRuntime({
		cfg: params.cfg,
		modelRef: readAgentPrimaryModelRef(params.agent, params.inheritedModelRef),
		agentId: params.agentId,
		env: params.env
	});
}
function concreteRuntimeId(runtime) {
	return runtime && runtime !== "auto" && runtime !== "default" ? runtime : void 0;
}
function parseCodexRouteModelRef(modelRef) {
	const slash = modelRef.indexOf("/");
	if (slash <= 0 || slash >= modelRef.length - 1) return;
	return {
		provider: modelRef.slice(0, slash),
		modelId: modelRef.slice(slash + 1)
	};
}
function canonicalOpenAIModelUsesCodexRuntime(params) {
	const parsed = parseCodexRouteModelRef(params.modelRef);
	if (!parsed) return false;
	return configuredModelRouteNeedsCodex({
		cfg: params.cfg,
		env: params.env ?? process.env,
		...params.agentId ? { agentId: params.agentId } : {},
		route: {
			provider: parsed.provider,
			modelId: parsed.modelId
		}
	});
}
//#endregion
export { shouldSuppressMissingCodexPluginDiagnostics as C, toOpenAIModelId as S, resolveSubagentConfiguredModelSelection as T, readModelConfigPrimaryRef as _, isBlockedLegacyCodexModelRef as a, resolveRuntimeModelRef as b, isOpenAICodexModelRef as c, modelRefUsesCodexRuntime as d, normalizeDefaultProviderModelRef as f, readLegacyDefaultsRuntime as g, readAgentPrimaryModelRef as h, isBlockedLegacyCodexModelPair as i, isProviderlessModelRef as l, parseCodexRouteModelRef as m, asAgentRuntimePolicyConfig as n, isLegacyCodexProviderId as o, normalizeRuntimeString as p, canonicalOpenAIModelUsesCodexRuntime as r, isOpenAICodexAuthProfileRef as s, agentUsesCodexRuntimeForCompaction as t, legacyCodexProviderIdentityKey as u, resolveImplicitDefaultAgentModelRef as v, resolveDefaultModelForAgent as w, toCanonicalOpenAIModelRef as x, resolveRuntime as y };
