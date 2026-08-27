import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-BsgKV5VN.js";
import "./memory-core-host-engine-embeddings-BI8nsdfO.js";
import "./dreaming-shared-Bo_EvGZb.js";
//#region extensions/memory-core/src/memory/embeddings.ts
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const LOCAL_LLAMA_CPP_PROVIDER_ID = "local";
function createMissingLlamaCppProviderError() {
	return new Error([
		"Unknown memory embedding provider: local.",
		"Local GGUF embeddings are provided by the official llama.cpp provider plugin.",
		"Install it with: openclaw plugins install @openclaw/llama-cpp-provider",
		"Then restart OpenClaw and retry: openclaw memory status --deep"
	].join("\n"));
}
function formatProviderError(adapter, err) {
	return adapter.formatSetupError?.(err) ?? formatErrorMessage(err);
}
function getAdapter(id, config) {
	const adapter = getMemoryEmbeddingProvider(id, config);
	if (adapter) return adapter;
	if (id === LOCAL_LLAMA_CPP_PROVIDER_ID) throw createMissingLlamaCppProviderError();
	throw new Error(`Unknown memory embedding provider: ${id}`);
}
function resolveProviderModel(adapter, requestedModel) {
	const trimmed = requestedModel.trim();
	if (trimmed) return trimmed;
	return adapter.defaultModel ?? "";
}
function resolveEmbeddingProviderFallbackModel(providerId, fallbackSourceModel, config) {
	return getMemoryEmbeddingProvider(providerId, config)?.defaultModel ?? fallbackSourceModel;
}
function resolveEmbeddingProviderFallbackRemote(remote) {
	if (!remote) return;
	const { baseUrl: _baseUrl, apiKey: _apiKey, headers: _headers, ...sharedRemote } = remote;
	return Object.keys(sharedRemote).length > 0 ? sharedRemote : void 0;
}
function resolveEmbeddingProviderAdapterId(providerId, config) {
	try {
		return getAdapter(providerId, config).id;
	} catch {
		return;
	}
}
function resolveEmbeddingProviderAdapterTransport(providerId, config) {
	try {
		return getAdapter(providerId, config).transport;
	} catch {
		return;
	}
}
function resolveEmbeddingProviderIndexIdentity(options) {
	const provider = options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
	try {
		const adapter = getAdapter(provider, options.config);
		const model = resolveProviderModel(adapter, options.model);
		const identity = adapter.resolveIndexIdentity?.({
			...options,
			provider,
			model
		});
		return identity ? {
			provider: {
				id: adapter.id,
				model: identity.model
			},
			cacheKeyData: identity.cacheKeyData,
			aliases: identity.aliases
		} : void 0;
	} catch {
		return;
	}
}
async function createWithAdapter(adapter, options) {
	const createOptions = {
		...options,
		model: resolveProviderModel(adapter, options.model)
	};
	const result = await adapter.create(createOptions);
	return {
		provider: result.provider,
		requestedProvider: options.provider,
		runtime: result.runtime
	};
}
async function createEmbeddingProvider(options) {
	const provider = options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
	const primaryAdapter = getAdapter(provider, options.config);
	try {
		return await createWithAdapter(primaryAdapter, {
			...options,
			provider
		});
	} catch (primaryErr) {
		const reason = formatProviderError(primaryAdapter, primaryErr);
		if (options.fallback && options.fallback !== "none" && options.fallback !== provider) {
			const fallbackAdapter = getAdapter(options.fallback, options.config);
			try {
				return {
					...await createWithAdapter(fallbackAdapter, {
						...options,
						provider: options.fallback,
						remote: resolveEmbeddingProviderFallbackRemote(options.remote)
					}),
					requestedProvider: provider,
					fallbackFrom: provider,
					fallbackReason: reason
				};
			} catch (fallbackErr) {
				const fallbackReason = formatProviderError(fallbackAdapter, fallbackErr);
				const wrapped = /* @__PURE__ */ new Error(`${reason}\n\nFallback to ${options.fallback} failed: ${fallbackReason}`);
				wrapped.cause = primaryErr;
				throw wrapped;
			}
		}
		const wrapped = new Error(reason);
		wrapped.cause = primaryErr;
		throw wrapped;
	}
}
//#endregion
export { resolveEmbeddingProviderFallbackRemote as a, resolveEmbeddingProviderFallbackModel as i, resolveEmbeddingProviderAdapterId as n, resolveEmbeddingProviderIndexIdentity as o, resolveEmbeddingProviderAdapterTransport as r, createEmbeddingProvider as t };
