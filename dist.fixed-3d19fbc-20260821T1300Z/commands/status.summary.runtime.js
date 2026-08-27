import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-CIXf7egm.js";
import { i as resolveAgentModelPrimaryValue } from "../model-input-ekSMR50U.js";
import { s as resolveAgentConfig } from "../agent-scope-config-CsnnOL14.js";
import { D as resolveConfiguredProviderFallback } from "../model-selection-shared-0DI3vxkL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../defaults-CdX9UGcX.js";
import { n as parseModelRef } from "../model-selection-normalize-Cvi2hnhD.js";
import { i as resolveStoredSessionKeyForAgentStore } from "../session-store-key-Cc0gbvo8.js";
import { c as resolvePersistedSelectedModelRef } from "../model-selection-BEGvRdL1.js";
import { t as classifySessionKind } from "../classify-session-kind-C57o_c98.js";
import { r as readAcpSessionMeta } from "../session-meta-8cwXEOoU.js";
import { t as resolveModelAgentRuntimeMetadata } from "../agent-runtime-metadata-Cslt9kIV.js";
import { g as resolveContextTokensForModelFromCache, o as waitForContextWindowCacheLoad } from "../context-GlVEvpHA.js";
import { t as resolveAgentRuntimeLabel } from "../agent-runtime-label-BVh394tL.js";
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
function resolveSessionRuntimeLabel(params) {
	const acpSessionKey = params.agentId ? resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) : params.sessionKey;
	const acpMeta = readAcpSessionMeta({ sessionKey: acpSessionKey });
	const id = normalizeOptionalLowercaseString(resolveModelAgentRuntimeMetadata({
		cfg: params.cfg,
		agentId: params.agentId ?? "",
		sessionEntry: params.entry,
		provider: params.provider,
		model: params.model,
		sessionKey: acpSessionKey,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	}).id);
	const resolvedHarness = id && id !== "openclaw" && id !== "auto" ? id : void 0;
	return resolveAgentRuntimeLabel({
		config: params.cfg,
		sessionEntry: params.entry,
		resolvedHarness,
		fallbackProvider: params.provider
	});
}
const statusSummaryRuntime = {
	waitForContextWindowCacheLoad,
	resolveContextTokensForModel: resolveContextTokensForModelFromCache,
	classifySessionKey: classifySessionKind,
	resolveSessionModelRef,
	resolveSessionRuntimeLabel,
	resolveConfiguredStatusModelRef,
	resolveStatusModelLookupRef,
	resolveStatusModelComparisonLabel
};
//#endregion
export { statusSummaryRuntime };
