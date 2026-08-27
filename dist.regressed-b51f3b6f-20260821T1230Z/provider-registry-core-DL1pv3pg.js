import { r as normalizeCapabilityProviderId, t as buildCapabilityProviderMaps } from "./provider-registry-shared-CYfJZ_PT.js";
//#region src/tts/provider-registry-core.ts
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
function normalizeSpeechProviderId(providerId) {
	return normalizeCapabilityProviderId(providerId);
}
/** Create a registry facade with canonical listing, alias lookup, and ID canonicalization. */
function createSpeechProviderRegistry(resolver) {
	const buildResolvedProviderMaps = (cfg) => buildCapabilityProviderMaps(resolver.listProviders(cfg));
	const listProviders = (cfg) => [...buildResolvedProviderMaps(cfg).canonical.values()];
	const getProvider = (providerId, cfg) => {
		const normalized = normalizeSpeechProviderId(providerId);
		if (!normalized) return;
		return resolver.getProvider(normalized, cfg) ?? buildResolvedProviderMaps(cfg).aliases.get(normalized);
	};
	const canonicalizeProviderId = (providerId, cfg) => {
		const normalized = normalizeSpeechProviderId(providerId);
		if (!normalized) return;
		return getProvider(normalized, cfg)?.id ?? normalized;
	};
	return {
		canonicalizeSpeechProviderId: canonicalizeProviderId,
		getSpeechProvider: getProvider,
		listSpeechProviders: listProviders
	};
}
//#endregion
export { normalizeSpeechProviderId as n, createSpeechProviderRegistry as t };
