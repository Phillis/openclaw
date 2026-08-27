import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
//#region src/plugins/provider-registry-shared.ts
/** Normalizes provider ids used by capability-provider registries. */
function normalizeCapabilityProviderId(providerId) {
	const normalized = normalizeOptionalLowercaseString(providerId);
	return normalized && !isBlockedObjectKey(normalized) ? normalized : void 0;
}
function matchesProviderPluginRef(provider, providerId) {
	const normalized = normalizeProviderId(providerId);
	return Boolean(normalized && (normalizeProviderId(provider.id) === normalized || [...provider.aliases ?? [], ...provider.hookAliases ?? []].some((alias) => normalizeProviderId(alias) === normalized)));
}
/** Builds canonical and alias lookup maps for capability providers. */
function buildCapabilityProviderMaps(providers, normalizeId = normalizeCapabilityProviderId) {
	const canonical = /* @__PURE__ */ new Map();
	const aliases = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		const id = normalizeId(provider.id);
		if (!id) continue;
		canonical.set(id, provider);
		aliases.set(id, provider);
		for (const alias of provider.aliases ?? []) {
			const normalizedAlias = normalizeId(alias);
			if (normalizedAlias) aliases.set(normalizedAlias, provider);
		}
	}
	return {
		canonical,
		aliases
	};
}
//#endregion
export { matchesProviderPluginRef as n, normalizeCapabilityProviderId as r, buildCapabilityProviderMaps as t };
