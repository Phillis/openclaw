import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { c as getRuntimeAuthProfileStoreSnapshot, o as findPersistedAuthProfileCredential } from "./store-C6iqqcJy.js";
import { i as applyModelOverrideToSessionEntry } from "./model-overrides-BcLzAaaZ.js";
//#region src/sessions/auth-profile-preservation.ts
function resolvePinnedAuthProfileProvider(params) {
	return getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId]?.provider ?? findPersistedAuthProfileCredential({
		agentDir: params.agentDir,
		profileId: params.profileId
	})?.provider ?? params.cfg.auth?.profiles?.[params.profileId]?.provider;
}
/** Checks whether a pinned session auth profile can authenticate the selected provider. */
function shouldPreserveSessionAuthProfileOverride(params) {
	const profileOverride = normalizeOptionalString(params.entry.authProfileOverride);
	const provider = normalizeOptionalLowercaseString(params.provider);
	if (!profileOverride || !provider) return false;
	const resolvesToTargetProvider = (rawProvider) => {
		const candidate = normalizeOptionalLowercaseString(rawProvider);
		const lookupParams = {
			config: params.cfg,
			...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
		};
		return Boolean(candidate && resolveProviderIdForAuth(candidate, lookupParams) === resolveProviderIdForAuth(provider, lookupParams));
	};
	const recordedProvider = resolvePinnedAuthProfileProvider({
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileId: profileOverride
	});
	if (recordedProvider) return resolvesToTargetProvider(recordedProvider);
	const delimiterIndex = profileOverride.indexOf(":");
	if (delimiterIndex < 0) return resolvesToTargetProvider(params.currentProvider);
	return resolvesToTargetProvider(profileOverride.slice(0, delimiterIndex));
}
/** Applies a user model selection without dropping a compatible pinned auth profile. */
function applyModelOverrideWithAuthProfileCompatibility(params) {
	return applyModelOverrideToSessionEntry({
		entry: params.entry,
		selection: params.selection,
		...params.profileOverride ? { profileOverride: params.profileOverride } : {},
		...params.profileOverrideSource ? { profileOverrideSource: params.profileOverrideSource } : {},
		...params.selectionSource ? { selectionSource: params.selectionSource } : {},
		...params.markLiveSwitchPending !== void 0 ? { markLiveSwitchPending: params.markLiveSwitchPending } : {},
		preserveAuthProfileOverride: !params.profileOverride && shouldPreserveSessionAuthProfileOverride({
			cfg: params.cfg,
			agentDir: params.agentDir,
			entry: params.entry,
			currentProvider: params.currentProvider,
			provider: params.selection.provider,
			...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
		})
	});
}
//#endregion
export { shouldPreserveSessionAuthProfileOverride as n, applyModelOverrideWithAuthProfileCompatibility as t };
