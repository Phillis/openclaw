import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { _ as resolveConfiguredModelRef, l as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-DT9x3Cg2.js";
import { _ as isDefaultAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { n as parseModelRef } from "./model-selection-normalize-Cvi2hnhD.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Bw2nFxxx.js";
import { n as getRegisteredAgentHarness } from "./registry-RzPPae7_.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-CvHDRR81.js";
import { r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-VbLZXcDR.js";
import { c as resolvePersistedSelectedModelRef, r as normalizeStoredOverrideModel } from "./model-selection-BhpnS-Rv.js";
//#region src/agents/session-model-ref.ts
function resolveSessionModelRef(cfg, entry, agentId, options) {
	const normalizedOverride = normalizeStoredOverrideModel({
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride
	});
	if (normalizedOverride.providerOverride && normalizedOverride.modelOverride) return resolvePersistedSelectedModelRef({
		defaultProvider: normalizedOverride.providerOverride,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride,
		allowPluginNormalization: options?.allowPluginNormalization
	});
	const runtimeProvider = normalizeOptionalString(entry?.modelProvider);
	const runtimeModel = normalizeOptionalString(entry?.model);
	const resolved = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId,
		allowPluginNormalization: options?.allowPluginNormalization
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: options?.allowPluginNormalization
	});
	return resolvePersistedSelectedModelRef({
		defaultProvider: resolved.provider || "openai",
		runtimeProvider: agentId ? void 0 : runtimeProvider,
		runtimeModel: agentId ? void 0 : runtimeModel,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride,
		allowPluginNormalization: options?.allowPluginNormalization
	}) ?? resolved;
}
function resolveSessionModelIdentityRef(cfg, entry, agentId, fallbackModelRef, options) {
	const runtimeModel = entry?.model?.trim();
	const runtimeProvider = entry?.modelProvider?.trim();
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		const inferredProvider = inferUniqueProviderFromConfiguredModels({
			cfg,
			model: runtimeModel
		});
		if (inferredProvider) return {
			provider: inferredProvider,
			model: runtimeModel
		};
		if (runtimeModel.includes("/")) {
			const parsedRuntime = parseModelRef(runtimeModel, DEFAULT_PROVIDER, { allowPluginNormalization: options?.allowPluginNormalization });
			if (parsedRuntime) return {
				provider: parsedRuntime.provider,
				model: parsedRuntime.model
			};
			return { model: runtimeModel };
		}
		return { model: runtimeModel };
	}
	const fallbackRef = fallbackModelRef?.trim();
	if (fallbackRef) {
		const parsedFallback = parseModelRef(fallbackRef, DEFAULT_PROVIDER, { allowPluginNormalization: options?.allowPluginNormalization });
		if (parsedFallback) return {
			provider: parsedFallback.provider,
			model: parsedFallback.model
		};
		const inferredProvider = inferUniqueProviderFromConfiguredModels({
			cfg,
			model: fallbackRef
		});
		if (inferredProvider) return {
			provider: inferredProvider,
			model: fallbackRef
		};
		return { model: fallbackRef };
	}
	const resolved = resolveSessionModelRef(cfg, entry, agentId, { allowPluginNormalization: options?.allowPluginNormalization });
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
	const persistedRuntime = resolvePersistedSessionRuntimeId(params.entry);
	if (persistedRuntime && !isDefaultAgentRuntimeId(persistedRuntime)) return persistedRuntime;
	const selectedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: selectedModel.provider,
		modelId: selectedModel.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
function resolveWorkerPlacementExecutionMode(runtime) {
	const runtimeId = runtime.trim();
	if (runtimeId === "openclaw") return "worker-turn";
	return (getRegisteredAgentHarness(runtimeId)?.harness)?.cloudPlacement?.mode;
}
function projectWorkerPlacementAgentRuntime(runtime) {
	const { source, ...identity } = runtime;
	return {
		...identity,
		cloudPlacementSupported: resolveWorkerPlacementExecutionMode(runtime.id) !== void 0,
		source
	};
}
//#endregion
export { resolveSessionModelRef as a, resolveSessionModelIdentityRef as i, resolveWorkerPlacementExecutionMode as n, resolveWorkerPlacementSessionRuntime as r, projectWorkerPlacementAgentRuntime as t };
