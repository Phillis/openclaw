import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { u as resolveAgentEntry } from "./agent-scope-config-CsnnOL14.js";
import { t as MODEL_APIS } from "./types.models-Z6EPRVI_.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { t as buildInlineProviderModels } from "./model.inline-provider-Uy3d1OLo.js";
import { n as normalizePluginDiscoveryResult } from "./provider-discovery-DATDyD7M.js";
//#region src/agents/prepared-model-runtime.configured.ts
/** Collects defaults, global refs, and only the selected agent's overrides. */
function collectPreparedModelRuntimeConfiguredRefs(config, agentId) {
	if (!agentId) return collectConfiguredModelRefs(config);
	const entry = resolveAgentEntry(config, agentId);
	return collectConfiguredModelRefs({
		...config,
		agents: {
			...config.agents?.defaults ? { defaults: config.agents.defaults } : {},
			list: entry ? [entry] : []
		}
	});
}
function isCatalogModelApi(value) {
	return value !== void 0 && MODEL_APIS.includes(value);
}
function toStaticCatalogEntry(model) {
	return {
		id: model.id,
		name: model.name ?? model.id,
		provider: model.provider,
		...isCatalogModelApi(model.api) ? { api: model.api } : {},
		...model.baseUrl ? { baseUrl: model.baseUrl } : {},
		...model.contextWindow ? { contextWindow: model.contextWindow } : {},
		...model.contextTokens ? { contextTokens: model.contextTokens } : {},
		...model.reasoning !== void 0 ? { reasoning: model.reasoning } : {},
		...model.input ? { input: model.input } : {},
		...model.params ? { params: model.params } : {},
		...model.compat ? { compat: model.compat } : {},
		...model.mediaInput ? { mediaInput: model.mediaInput } : {}
	};
}
function collectPreparedModelRuntimeProviderIds(config, credentials, includeCredentialProviders, configuredModelRefs = collectConfiguredModelRefs(config)) {
	const providerIds = /* @__PURE__ */ new Set();
	const addProviderId = (value) => {
		const providerId = normalizeProviderId(value);
		if (providerId) providerIds.add(providerId);
	};
	if (includeCredentialProviders) for (const providerId of Object.keys(credentials)) addProviderId(providerId);
	for (const providerId of Object.keys(config.models?.providers ?? {})) addProviderId(providerId);
	for (const ref of configuredModelRefs) {
		const separator = ref.value.indexOf("/");
		if (separator > 0) addProviderId(ref.value.slice(0, separator));
	}
	return [...providerIds].toSorted((left, right) => left.localeCompare(right));
}
function hasConfiguredInlineProviderModel(config, provider, modelId, matchesStaticModelId) {
	return Object.entries(config.models?.providers ?? {}).some(([providerId, providerConfig]) => normalizeProviderId(providerId) === provider && (providerConfig.models ?? []).some((model) => matchesStaticModelId({
		candidateId: model.id,
		rowProvider: providerId,
		provider,
		modelId
	})));
}
function collectConfiguredProviderIdsNeedingStaticCatalog(params) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const { value } of params.configuredModelRefs ?? collectConfiguredModelRefs(params.config)) {
		const parsed = parseModelCatalogRef(value);
		if (!parsed) continue;
		const { provider, modelId } = parsed;
		if (hasConfiguredInlineProviderModel(params.config, provider, modelId, params.matchesStaticModelId) || params.resolveStaticCatalogModel({
			provider,
			modelId
		})) continue;
		providerIds.add(provider);
	}
	return [...providerIds].toSorted((left, right) => left.localeCompare(right));
}
function prepareConfiguredRuntimeModels(params) {
	const prepared = [];
	const seen = /* @__PURE__ */ new Set();
	for (const { value } of params.configuredModelRefs ?? collectConfiguredModelRefs(params.config)) {
		const parsed = parseModelCatalogRef(value);
		if (!parsed) continue;
		const { modelId, provider } = parsed;
		const key = buildModelCatalogMergeKey(provider, modelId);
		if (seen.has(key)) continue;
		seen.add(key);
		const model = params.resolveStaticCatalogModel({
			provider,
			modelId
		}) ?? findPreparedProviderStaticCatalogModel({
			prepared: params.preparedStaticProviderCatalog,
			metadataSnapshot: params.metadataSnapshot,
			provider,
			modelId,
			matchesStaticModelId: params.matchesStaticModelId
		}) ?? params.providerStaticModels.find((candidate) => params.matchesStaticModelId({
			candidateId: candidate.id,
			rowProvider: candidate.provider,
			provider,
			modelId
		}));
		if (model) prepared.push({
			provider,
			modelId,
			model
		});
	}
	return prepared;
}
function findPreparedProviderStaticCatalogModel(params) {
	if (!params.prepared) return;
	for (const { provider, result } of params.prepared.entries) for (const [providerId, providerConfig] of Object.entries(normalizePluginDiscoveryResult({
		provider,
		result
	}))) {
		const model = (providerConfig.models ?? []).find((candidate) => params.matchesStaticModelId({
			candidateId: candidate.id,
			rowProvider: providerId,
			provider: params.provider,
			modelId: params.modelId
		}));
		if (!model) continue;
		const [resolved] = buildInlineProviderModels({ [providerId]: {
			...providerConfig,
			models: [model]
		} }, { providerMetadataOwners: params.metadataSnapshot.owners });
		if (resolved) return resolved;
	}
}
//#endregion
export { toStaticCatalogEntry as a, prepareConfiguredRuntimeModels as i, collectPreparedModelRuntimeConfiguredRefs as n, collectPreparedModelRuntimeProviderIds as r, collectConfiguredProviderIdsNeedingStaticCatalog as t };
