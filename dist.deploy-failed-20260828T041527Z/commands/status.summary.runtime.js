import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-CIXf7egm.js";
import { a as resolveAgentModelPrimaryValue } from "../model-input-ILUprkGk.js";
import { s as resolveAgentConfig } from "../agent-scope-config-CUBiGmG3.js";
import { A as resolveConfiguredProviderFallback } from "../model-selection-shared-DbjoXfPH.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../defaults-CdX9UGcX.js";
import { n as parseModelRef } from "../model-selection-normalize-DRjRnS6Y.js";
import { i as resolveStoredSessionKeyForAgentStore } from "../session-store-key-DRF7yKG5.js";
import { b as classifySessionKind } from "../session-state-events-DvygRPJJ.js";
import { i as resolvePersistedSelectedModelRef } from "../model-selection-Cp8EGD61.js";
import { r as readAcpSessionMeta } from "../session-meta-CpNLCGd4.js";
import { t as resolveCurrentSessionAgentRuntimeMetadata } from "../agent-runtime-metadata-DytIv1m8.js";
import { c as resolveAuthoredModelContextTokens, l as resolveContextTokensForModelFromCache } from "../context-resolution-BUC8w087.js";
import { o as waitForContextWindowCacheLoad } from "../context-o5tuEdcP.js";
import { t as resolveAgentRuntimeLabel } from "../agent-runtime-label-DOEeoseC.js";
//#region src/status/summary.runtime.ts
function resolveStatusModelRefFromRaw(params) {
	const trimmed = params.rawModel.trim();
	if (!trimmed) return null;
	const configuredModels = params.cfg.agents?.defaults?.models ?? {};
	if (!trimmed.includes("/")) {
		const aliasKey = normalizeLowercaseStringOrEmpty(trimmed);
		for (const [modelKey, entry] of Object.entries(configuredModels)) {
			const aliasValue = entry?.alias;
			const alias = normalizeOptionalString(aliasValue) ?? "";
			if (!alias || normalizeOptionalLowercaseString(alias) !== aliasKey) continue;
			const parsed = parseModelRef(modelKey, params.defaultProvider, {
				allowManifestNormalization: false,
				allowPluginNormalization: false
			});
			if (parsed) return parsed;
		}
		return {
			provider: params.defaultProvider,
			model: trimmed
		};
	}
	return parseModelRef(trimmed, params.defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
}
function resolveConfiguredStatusModelRef(params) {
	const agentRawModel = params.agentId ? resolveAgentModelPrimaryValue(resolveAgentConfig(params.cfg, params.agentId)?.model) : void 0;
	if (agentRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: agentRawModel,
			defaultProvider: params.defaultProvider
		});
		if (parsed) return parsed;
	}
	const defaultsRawModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
	if (defaultsRawModel) {
		const parsed = resolveStatusModelRefFromRaw({
			cfg: params.cfg,
			rawModel: defaultsRawModel,
			defaultProvider: params.defaultProvider
		});
		if (parsed) return parsed;
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
function resolveProviderlessPersistedStatusModelRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!model || provider || model.includes("/") || normalizeLowercaseStringOrEmpty(model) === "openrouter:auto") return null;
	return {
		provider: params.defaultProvider,
		model
	};
}
function resolveStatusModelLookupRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!model) return null;
	const defaultProvider = normalizeOptionalString(params.defaultProvider) ?? provider ?? "openai";
	return parseModelRef(provider ? `${provider}/${model}` : model, defaultProvider, {
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) ?? {
		provider: provider ?? defaultProvider,
		model
	};
}
function resolveStatusModelComparisonLabel(params) {
	const ref = resolveStatusModelLookupRef(params);
	return ref ? `${ref.provider}/${ref.model}` : null;
}
function resolveSessionModelRef(cfg, entry, agentId) {
	const resolved = resolveConfiguredStatusModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		agentId
	});
	const defaultProvider = resolved.provider || "openai";
	const providerlessPersisted = resolveProviderlessPersistedStatusModelRef({
		defaultProvider,
		provider: entry?.providerOverride,
		model: entry?.modelOverride
	}) ?? resolveProviderlessPersistedStatusModelRef({
		defaultProvider,
		provider: entry?.modelProvider,
		model: entry?.model
	});
	if (providerlessPersisted) return providerlessPersisted;
	return resolvePersistedSelectedModelRef({
		defaultProvider,
		runtimeProvider: entry?.modelProvider,
		runtimeModel: entry?.model,
		overrideProvider: entry?.providerOverride,
		overrideModel: entry?.modelOverride,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	}) ?? resolved;
}
function resolveSessionRuntime(params) {
	const acpSessionKey = params.agentId ? resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : params.sessionKey;
	const acpMeta = readAcpSessionMeta({
		cfg: params.cfg,
		sessionKey: acpSessionKey
	});
	const id = normalizeOptionalLowercaseString(resolveCurrentSessionAgentRuntimeMetadata({
		cfg: params.cfg,
		agentId: params.agentId ?? "",
		provider: params.provider,
		model: params.model,
		sessionKey: acpSessionKey,
		sessionEntry: params.entry,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	}).id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return {
		id,
		label: resolveAgentRuntimeLabel({
			config: params.cfg,
			sessionEntry: params.entry,
			resolvedHarness,
			fallbackProvider: params.provider
		})
	};
}
const statusSummaryRuntime = {
	waitForContextWindowCacheLoad,
	resolveAuthoredModelContextTokens,
	resolveContextTokensForModel: resolveContextTokensForModelFromCache,
	classifySessionKey: classifySessionKind,
	resolveSessionModelRef,
	resolveSessionRuntime,
	resolveConfiguredStatusModelRef,
	resolveStatusModelLookupRef,
	resolveStatusModelComparisonLabel
};
//#endregion
export { statusSummaryRuntime };
