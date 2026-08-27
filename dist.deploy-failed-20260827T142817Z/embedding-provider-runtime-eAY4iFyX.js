import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-BtzNAiNr.js";
import { v as getRegisteredEmbeddingProvider, y as listRegisteredEmbeddingProviders } from "./gateway-startup-plugin-ids-6UecoKl9.js";
import { i as resolvePluginCapabilityProviders, r as resolvePluginCapabilityProvider } from "./capability-provider-runtime-CmN5L8jb.js";
//#region src/plugins/embedding-provider-runtime-shared.ts
/** Shared runtime helpers for embedding provider lookup across core and plugin capabilities. */
/** Builds lookup ids for embedding providers, including configured API aliases. */
function resolveRuntimeEmbeddingProviderLookupIds(params) {
	const ids = [params.id];
	const configuredProviderId = params.resolveConfiguredProviderId(params.id, params.cfg);
	if (configuredProviderId && !ids.some((candidate) => normalizeProviderId(candidate) === configuredProviderId)) ids.push(configuredProviderId);
	return ids;
}
/** Lists registered and plugin-contributed embedding provider adapters for a capability key. */
function listRuntimeEmbeddingProviderAdapters(params) {
	const merged = new Map(params.registered.map((adapter) => [adapter.id, adapter]));
	const capabilityAdapters = resolvePluginCapabilityProviders({
		key: params.key,
		cfg: params.cfg
	});
	for (const adapter of capabilityAdapters) if (!merged.has(adapter.id)) merged.set(adapter.id, adapter);
	return [...merged.values()];
}
/** Resolves one embedding provider adapter from registered providers before plugin capabilities. */
function getRuntimeEmbeddingProviderAdapter(params) {
	for (const candidateId of params.lookupIds) {
		const registered = params.getRegisteredProvider(candidateId);
		if (registered) return registered.adapter;
		const provider = resolvePluginCapabilityProvider({
			key: params.key,
			providerId: candidateId,
			cfg: params.cfg
		});
		if (provider) return provider;
	}
}
//#endregion
//#region src/plugins/embedding-provider-runtime.ts
/** Lists embedding provider adapters registered directly with the process registry. */
function listRegisteredEmbeddingProviderAdapters() {
	return listRegisteredEmbeddingProviders().map((entry) => entry.adapter);
}
/** Lists embedding providers from registered adapters and plugin capabilities. */
function listEmbeddingProviders(cfg) {
	return listRuntimeEmbeddingProviderAdapters({
		key: "embeddingProviders",
		cfg,
		registered: listRegisteredEmbeddingProviderAdapters()
	});
}
function resolveConfiguredEmbeddingProviderId(providerId, cfg) {
	return resolveConfiguredGenericEmbeddingProviderId(providerId, cfg);
}
function resolveEmbeddingProviderLookupIds(id, cfg) {
	return resolveRuntimeEmbeddingProviderLookupIds({
		id,
		cfg,
		resolveConfiguredProviderId: resolveConfiguredEmbeddingProviderId
	});
}
/** Resolves one embedding provider adapter by id, including configured API aliases. */
function getEmbeddingProvider(id, cfg) {
	return getRuntimeEmbeddingProviderAdapter({
		key: "embeddingProviders",
		cfg,
		lookupIds: resolveEmbeddingProviderLookupIds(id, cfg),
		getRegisteredProvider: getRegisteredEmbeddingProvider
	});
}
//#endregion
export { resolveRuntimeEmbeddingProviderLookupIds as a, listRuntimeEmbeddingProviderAdapters as i, listEmbeddingProviders as n, getRuntimeEmbeddingProviderAdapter as r, getEmbeddingProvider as t };
