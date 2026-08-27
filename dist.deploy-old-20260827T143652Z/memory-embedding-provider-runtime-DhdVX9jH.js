import { t as readConfiguredProviderApiId } from "./embedding-provider-config-BtzNAiNr.js";
import { S as requireActivePluginRegistry, t as assertDirectPluginRegistrationReplacement, w as resolveDirectPluginRegistrationOwner } from "./runtime-g0R28Sy0.js";
import { a as resolveRuntimeEmbeddingProviderLookupIds, i as listRuntimeEmbeddingProviderAdapters, r as getRuntimeEmbeddingProviderAdapter, t as getEmbeddingProvider } from "./embedding-provider-runtime-lu5yQFl9.js";
//#region src/plugins/memory-embedding-providers.ts
function getMemoryEmbeddingProviders() {
	return requireActivePluginRegistry().memoryEmbeddingProviders.map((entry) => ({
		adapter: entry.provider,
		ownerPluginId: entry.pluginId || void 0
	}));
}
function registerMemoryEmbeddingProvider(adapter, options) {
	const registry = requireActivePluginRegistry();
	const entry = {
		pluginId: resolveDirectPluginRegistrationOwner(options?.ownerPluginId) ?? "",
		provider: adapter,
		source: "runtime"
	};
	const index = registry.memoryEmbeddingProviders.findIndex((registration) => registration.provider.id === adapter.id);
	if (index !== -1) assertDirectPluginRegistrationReplacement(registry.memoryEmbeddingProviders[index]?.pluginId || void 0, `memory embedding provider ${adapter.id}`);
	if (index === -1) registry.memoryEmbeddingProviders.push(entry);
	else registry.memoryEmbeddingProviders.splice(index, 1, entry);
}
function getRegisteredMemoryEmbeddingProvider(id) {
	return getMemoryEmbeddingProviders().find((entry) => entry.adapter.id === id);
}
function listRegisteredMemoryEmbeddingProviders() {
	return getMemoryEmbeddingProviders();
}
function clearMemoryEmbeddingProviders() {
	requireActivePluginRegistry().memoryEmbeddingProviders.length = 0;
}
//#endregion
//#region src/plugins/memory-embedding-provider-runtime.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
/** Lists registered memory embedding provider adapters without registry metadata. */
function listRegisteredMemoryEmbeddingProviderAdapters() {
	return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}
/** Lists memory embedding providers from runtime config and registered adapters. */
function listMemoryEmbeddingProviders(cfg) {
	return listRuntimeEmbeddingProviderAdapters({
		key: "memoryEmbeddingProviders",
		cfg,
		registered: listRegisteredMemoryEmbeddingProviderAdapters()
	});
}
function resolveConfiguredMemoryEmbeddingProviderId(providerId, cfg) {
	return readConfiguredProviderApiId({
		providerId,
		cfg
	});
}
function resolveMemoryEmbeddingProviderLookupIds(id, cfg) {
	return resolveRuntimeEmbeddingProviderLookupIds({
		id,
		cfg,
		resolveConfiguredProviderId: resolveConfiguredMemoryEmbeddingProviderId
	});
}
function adaptEmbeddingProvider(provider) {
	const adapted = {
		...provider,
		embedQuery: (text, options) => provider.embed(text, {
			...options,
			inputType: "query"
		}),
		embedBatch: (texts, options) => provider.embedBatch(texts, {
			...options,
			inputType: "document"
		}),
		embedBatchInputs: (inputs, options) => provider.embedBatch(inputs, {
			...options,
			inputType: "document"
		}),
		...provider.close ? { close: () => provider.close?.() } : {}
	};
	const getRuntimeFacts = Reflect.get(provider, LOCAL_EMBEDDING_RUNTIME_FACTS);
	if (typeof getRuntimeFacts === "function") Object.defineProperty(adapted, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: getRuntimeFacts
	});
	return adapted;
}
function adaptEmbeddingProviderAdapter(adapter) {
	const genericOptions = (options) => ({
		...options,
		...typeof options.outputDimensionality === "number" ? { dimensions: options.outputDimensionality } : {}
	});
	const resolveIndexIdentity = adapter.resolveIndexIdentity;
	return {
		...adapter,
		...resolveIndexIdentity ? { resolveIndexIdentity: (options) => resolveIndexIdentity(genericOptions(options)) } : {},
		create: async (options) => {
			const result = await adapter.create(genericOptions(options));
			return {
				...result,
				provider: result.provider ? adaptEmbeddingProvider(result.provider) : null
			};
		}
	};
}
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
function getMemoryEmbeddingProvider(id, cfg) {
	const memoryAdapter = getRuntimeEmbeddingProviderAdapter({
		key: "memoryEmbeddingProviders",
		cfg,
		lookupIds: resolveMemoryEmbeddingProviderLookupIds(id, cfg),
		getRegisteredProvider: getRegisteredMemoryEmbeddingProvider
	});
	if (memoryAdapter) return memoryAdapter;
	const embeddingAdapter = getEmbeddingProvider(id, cfg);
	return embeddingAdapter ? adaptEmbeddingProviderAdapter(embeddingAdapter) : void 0;
}
//#endregion
export { listRegisteredMemoryEmbeddingProviders as a, clearMemoryEmbeddingProviders as i, listMemoryEmbeddingProviders as n, registerMemoryEmbeddingProvider as o, listRegisteredMemoryEmbeddingProviderAdapters as r, getMemoryEmbeddingProvider as t };
