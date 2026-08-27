import { r as normalizeCapabilityProviderId, t as buildCapabilityProviderMaps } from "./provider-registry-shared-CYfJZ_PT.js";
import { i as resolvePluginCapabilityProviders, r as resolvePluginCapabilityProvider } from "./capability-provider-runtime-CmN5L8jb.js";
//#region src/media-generation/provider-registry.ts
/** Shares normalized provider listing while preserving targeted transcription lookup. */
function createMediaProviderRegistry(key, options = {}) {
	const buildProviderMaps = (cfg) => buildCapabilityProviderMaps(resolvePluginCapabilityProviders({
		key,
		cfg
	}));
	return {
		listProviders: (cfg) => [...buildProviderMaps(cfg).canonical.values()],
		getProvider: (providerId, cfg) => {
			const normalized = normalizeCapabilityProviderId(providerId);
			if (!normalized) return;
			return options.directLookup ? resolvePluginCapabilityProvider({
				key,
				providerId: normalized,
				cfg
			}) : buildProviderMaps(cfg).aliases.get(normalized);
		}
	};
}
//#endregion
export { createMediaProviderRegistry as t };
