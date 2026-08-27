import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as hasUsableOAuthCredential } from "./credential-state-DJrnG0Ay.js";
import { C as isSafeToAdoptBootstrapOAuthIdentity, E as shouldBootstrapFromExternalCliCredential, L as OPENAI_CODEX_DEFAULT_PROFILE_ID, N as EXTERNAL_CLI_SYNC_TTL_MS, P as MINIMAX_CLI_PROFILE_ID, R as authProfilesLog, k as isSafeToCopyOAuthIdentity, x as areOAuthCredentialsEquivalent } from "./persisted-Bjx2XcL3.js";
import { i as readMiniMaxCliCredentialsCached, n as readCodexCliCredentialsCached } from "./cli-credentials-DZ9rGNcm.js";
//#region src/agents/auth-profiles/external-cli-sync.ts
/**
* External CLI OAuth synchronization.
* Reads supported CLI credential stores, decides whether those credentials can
* safely bootstrap local auth profiles, and returns runtime/persisted overlays.
*/
/** Return true when imported CLI credentials match an existing profile identity. */
function isSafeToUseExternalCliCredential(existing, imported) {
	if (!existing) return true;
	if (existing.provider !== imported.provider) return false;
	return isSafeToCopyOAuthIdentity(existing, imported);
}
const EXTERNAL_CLI_SYNC_PROVIDERS = [{
	profileId: OPENAI_CODEX_DEFAULT_PROFILE_ID,
	profileAliases: ["openai:default"],
	provider: "openai",
	aliases: [
		"openai",
		"codex",
		"codex-cli",
		"codex-app-server"
	],
	readCredentials: (options) => readCodexCliCredentialsCached({
		ttlMs: EXTERNAL_CLI_SYNC_TTL_MS,
		allowKeychainPrompt: options?.allowKeychainPrompt
	}),
	bootstrapOnly: true
}, {
	profileId: MINIMAX_CLI_PROFILE_ID,
	provider: "minimax-portal",
	aliases: ["minimax", "minimax-cli"],
	readCredentials: () => readMiniMaxCliCredentialsCached({ ttlMs: EXTERNAL_CLI_SYNC_TTL_MS })
}];
function resolveExternalCliSyncProvider(params) {
	const provider = EXTERNAL_CLI_SYNC_PROVIDERS.find((entry) => externalCliProfileIdMatches(entry, params.profileId));
	if (!provider) return null;
	if (params.credential && !listExternalCliProviderIds(provider).includes(params.credential.provider)) return null;
	return provider;
}
function listExternalCliProfileIds(providerConfig) {
	return [providerConfig.profileId, ...providerConfig.profileAliases ?? []];
}
function listExternalCliProviderIds(providerConfig) {
	return [providerConfig.provider, ...providerConfig.aliases ?? []];
}
/** Provider ids whose external CLI credentials can be refreshed by this owner. */
function listExternalCliSyncProviderIds() {
	return [...new Set(EXTERNAL_CLI_SYNC_PROVIDERS.flatMap(listExternalCliProviderIds))];
}
function normalizeExternalCliCredentialProvider(credential, provider) {
	return credential ? {
		...credential,
		provider
	} : null;
}
function getAuthProfileProviderPrefix(profileId) {
	return profileId.split(":", 1)[0]?.trim() ?? "";
}
function externalCliProfileIdMatches(providerConfig, profileId, options) {
	if (listExternalCliProfileIds(providerConfig).includes(profileId)) return true;
	if (!options?.allowLegacyNamespace || providerConfig.profileId !== "openai:default") return false;
	return normalizeProviderId(getAuthProfileProviderPrefix(profileId)) === "openai";
}
function hasInlineOAuthTokenMaterial(credential) {
	return [
		credential.access,
		credential.refresh,
		credential.idToken
	].some((value) => typeof value === "string" && value.trim().length > 0);
}
function hasManagedProviderOAuth(store, providerConfig) {
	return Object.values(store.profiles).some((credential) => credential?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(credential.provider) && hasInlineOAuthTokenMaterial(credential));
}
/** Read a CLI credential only for safe bootstrap of an unusable local profile. */
function readExternalCliBootstrapCredential(params) {
	const provider = resolveExternalCliSyncProvider(params);
	if (!provider) return null;
	if (provider.bootstrapOnly && hasManagedProviderOAuth(params.store, provider)) return null;
	if (provider.bootstrapOnly && !params.allowInlineOAuthTokenMaterial && hasInlineOAuthTokenMaterial(params.credential)) return null;
	return normalizeExternalCliCredentialProvider(provider.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt }), params.credential.provider);
}
function normalizeProviderScope(values) {
	if (values === void 0) return;
	const out = /* @__PURE__ */ new Set();
	for (const value of values) {
		const raw = value.trim();
		if (!raw) continue;
		out.add(raw.toLowerCase());
		const normalized = normalizeProviderId(raw);
		if (normalized) out.add(normalized);
	}
	return out;
}
function isExternalCliProviderInScope(params) {
	const { providerConfig, options, store } = params;
	const providerScope = normalizeProviderScope(options?.providerIds);
	if (providerScope === void 0 && options?.profileIds === void 0) return Object.entries(store.profiles).some(([profileId, existing]) => {
		return externalCliProfileIdMatches(providerConfig, profileId) && existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider);
	});
	if (Array.from(options?.profileIds ?? []).some((profileId) => externalCliProfileIdMatches(providerConfig, profileId.trim(), { allowLegacyNamespace: true }))) return true;
	if (!providerScope || providerScope.size === 0) return false;
	return listExternalCliProviderIds(providerConfig).some((alias) => {
		const raw = alias.trim().toLowerCase();
		const normalized = normalizeProviderId(alias);
		return providerScope.has(raw) || (normalized ? providerScope.has(normalized) : false);
	});
}
/** True when a previously resolved built-in CLI profile belongs to this refresh scope. */
function isExternalCliAuthProfileInScope(params) {
	const credential = params.store.profiles[params.profileId];
	const providerConfig = resolveExternalCliSyncProvider({
		profileId: params.profileId,
		...credential?.type === "oauth" ? { credential } : {}
	});
	return providerConfig ? isExternalCliProviderInScope({
		providerConfig,
		store: params.store,
		options: {
			...params.providerIds ? { providerIds: params.providerIds } : {},
			...params.profileIds ? { profileIds: params.profileIds } : {}
		}
	}) : false;
}
function listScopedExternalCliProfileIds(params) {
	const { options, providerConfig, store } = params;
	if (providerConfig.bootstrapOnly && hasManagedProviderOAuth(store, providerConfig)) return [];
	const matchingRequestedProfileIds = Array.from(options?.profileIds ?? []).map((value) => value.trim()).filter((value) => value.length > 0).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId, { allowLegacyNamespace: true }));
	if (matchingRequestedProfileIds.length > 0) return matchingRequestedProfileIds;
	const existingProfileIds = Object.keys(store.profiles).filter((profileId) => externalCliProfileIdMatches(providerConfig, profileId));
	if (existingProfileIds.length > 0) return existingProfileIds;
	return options?.providerIds ? [providerConfig.profileId] : [];
}
function backfillExternalCliIdentity(params) {
	if (params.existingOAuth.email) return null;
	const creds = params.providerConfig.readCredentials({ allowKeychainPrompt: params.allowKeychainPrompt });
	return creds?.email && (creds.refresh === params.existingOAuth.refresh || creds.access === params.existingOAuth.access) ? {
		...params.existingOAuth,
		email: creds.email
	} : null;
}
/** Resolve scoped external CLI auth profiles available to overlay or persist. */
function resolveExternalCliAuthProfiles(store, options) {
	const profiles = [];
	const now = Date.now();
	for (const providerConfig of EXTERNAL_CLI_SYNC_PROVIDERS) {
		if (!isExternalCliProviderInScope({
			providerConfig,
			store,
			options
		})) continue;
		const scopedProfileIds = listScopedExternalCliProfileIds({
			providerConfig,
			store,
			options
		});
		for (const profileId of scopedProfileIds) {
			const existing = store.profiles[profileId];
			const existingOAuth = existing?.type === "oauth" && listExternalCliProviderIds(providerConfig).includes(existing.provider) ? existing : void 0;
			if (existing && !existingOAuth) {
				authProfilesLog.debug("kept explicit local auth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localType: existing.type,
					localProvider: existing.provider
				});
				continue;
			}
			if (providerConfig.bootstrapOnly && existingOAuth && hasInlineOAuthTokenMaterial(existingOAuth)) {
				authProfilesLog.debug("kept local oauth over external cli bootstrap-only provider", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !providerConfig.bootstrapOnly && hasUsableOAuthCredential(existingOAuth, { now })) {
				const backfilled = backfillExternalCliIdentity({
					providerConfig,
					existingOAuth,
					allowKeychainPrompt: options?.allowKeychainPrompt
				});
				if (backfilled) profiles.push({
					profileId,
					credential: backfilled,
					persistence: providerConfig.persistence ?? "persisted"
				});
				continue;
			}
			const creds = normalizeExternalCliCredentialProvider(providerConfig.readCredentials({ allowKeychainPrompt: options?.allowKeychainPrompt }), existingOAuth?.provider ?? providerConfig.provider);
			if (!creds) continue;
			if (existingOAuth && !isSafeToUseExternalCliCredential(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (existingOAuth && !isSafeToAdoptBootstrapOAuthIdentity(existingOAuth, creds) && !areOAuthCredentialsEquivalent(existingOAuth, creds)) {
				authProfilesLog.warn("refused external cli oauth bootstrap: identity mismatch or missing binding", {
					profileId,
					provider: providerConfig.provider
				});
				continue;
			}
			if (!shouldBootstrapFromExternalCliCredential({
				existing: existingOAuth,
				imported: creds,
				now
			})) {
				if (existingOAuth) authProfilesLog.debug("kept usable local oauth over external cli bootstrap", {
					profileId,
					provider: providerConfig.provider,
					localExpires: existingOAuth.expires,
					externalExpires: creds.expires
				});
				continue;
			}
			authProfilesLog.debug("used external cli oauth bootstrap because local oauth was missing or unusable", {
				profileId,
				provider: providerConfig.provider,
				localExpires: existingOAuth?.expires,
				externalExpires: creds.expires
			});
			profiles.push({
				profileId,
				credential: creds,
				persistence: providerConfig.persistence ?? (providerConfig.bootstrapOnly ? "runtime-only" : "persisted")
			});
		}
	}
	return profiles;
}
//#endregion
export { resolveExternalCliAuthProfiles as i, listExternalCliSyncProviderIds as n, readExternalCliBootstrapCredential as r, isExternalCliAuthProfileInScope as t };
