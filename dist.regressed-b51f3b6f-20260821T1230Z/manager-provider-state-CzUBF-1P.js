import { a as resolveEmbeddingProviderFallbackRemote, i as resolveEmbeddingProviderFallbackModel } from "./embeddings-DkbBl2GD.js";
//#region extensions/memory-core/src/memory/manager-provider-state.ts
function createPendingMemoryProviderLifecycle(requestedProvider) {
	return {
		mode: "pending",
		requestedProvider
	};
}
function createDegradedMemoryProviderLifecycle(params) {
	return {
		mode: "degraded",
		providerId: params.providerId,
		reason: params.reason,
		...params.code ? { code: params.code } : {}
	};
}
function resolveProviderLifecycle(result) {
	if (result.provider && result.fallbackFrom) return {
		mode: "fallback-active",
		providerId: result.provider.id,
		fallbackFrom: result.fallbackFrom,
		reason: result.fallbackReason ?? "fallback activated"
	};
	if (result.provider) return {
		mode: "active",
		providerId: result.provider.id
	};
	return {
		mode: "fts-only",
		reason: result.providerUnavailableReason ?? "No embedding provider available",
		attemptedProviderId: result.requestedProvider
	};
}
function resolveFallbackCurrentProviderId(params) {
	if (params.provider) return params.provider.id;
	if (params.lifecycle.mode === "degraded") return params.lifecycle.providerId;
	return null;
}
function resolveMemoryPrimaryProviderRequest(params) {
	return {
		provider: params.settings.provider,
		model: params.settings.model,
		remote: params.settings.remote,
		inputType: params.settings.inputType,
		queryInputType: params.settings.queryInputType,
		documentInputType: params.settings.documentInputType,
		outputDimensionality: params.settings.outputDimensionality,
		fallback: params.settings.fallback,
		local: params.settings.local
	};
}
function resolveMemoryProviderState(result) {
	return {
		provider: result.provider,
		fallbackFrom: result.fallbackFrom,
		fallbackReason: result.fallbackReason,
		providerUnavailableReason: result.providerUnavailableReason,
		providerRuntime: result.runtime,
		lifecycle: resolveProviderLifecycle(result)
	};
}
function applyMemoryFallbackProviderState(params) {
	return {
		...params.current,
		fallbackFrom: params.fallbackFrom,
		fallbackReason: params.reason,
		providerUnavailableReason: void 0,
		provider: params.result.provider,
		providerRuntime: params.result.runtime,
		lifecycle: params.result.provider ? {
			mode: "fallback-active",
			providerId: params.result.provider.id,
			fallbackFrom: params.fallbackFrom,
			reason: params.reason
		} : {
			mode: "fts-only",
			reason: params.reason,
			attemptedProviderId: params.fallbackFrom
		}
	};
}
function resolveMemoryFallbackProviderRequest(params) {
	const fallback = params.settings.fallback;
	if (!fallback || fallback === "none" || !params.currentProviderId || fallback === params.currentProviderId) return null;
	return {
		provider: fallback,
		model: resolveEmbeddingProviderFallbackModel(fallback, params.settings.model, params.cfg),
		remote: resolveEmbeddingProviderFallbackRemote(params.settings.remote),
		inputType: params.settings.inputType,
		queryInputType: params.settings.queryInputType,
		documentInputType: params.settings.documentInputType,
		outputDimensionality: params.settings.outputDimensionality,
		fallback: "none",
		local: params.settings.local
	};
}
//#endregion
export { resolveMemoryFallbackProviderRequest as a, resolveFallbackCurrentProviderId as i, createDegradedMemoryProviderLifecycle as n, resolveMemoryPrimaryProviderRequest as o, createPendingMemoryProviderLifecycle as r, resolveMemoryProviderState as s, applyMemoryFallbackProviderState as t };
