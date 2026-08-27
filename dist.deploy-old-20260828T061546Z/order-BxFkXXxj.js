import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { a as resolveTokenExpiryState, n as evaluateStoredCredentialEligibility } from "./credential-state-DJrnG0Ay.js";
import { n as listProfilesForProvider, t as dedupeProfileIds } from "./profile-list-CFe_FbXc.js";
import { c as resolveProfileUnusableUntil, o as isProfileInCooldown, t as clearExpiredCooldowns } from "./usage-state-C0QBjJnZ.js";
//#region src/agents/auth-profiles/order.ts
/**
* Auth profile ordering and eligibility.
* Resolves configured/stored auth order, provider aliases, cooldowns, and
* profile compatibility for provider auth selection.
*/
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = "openai";
function isOpenAIApiKeyCompatibleWithCodexAuth(params) {
	if (params.providerAuthKey !== OPENAI_CODEX_PROVIDER_ID) return false;
	const providerKey = resolveProviderIdForAuth(params.profileProvider ?? "", {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	const mode = params.credential?.type ?? params.profileMode;
	return providerKey === OPENAI_PROVIDER_ID && mode === "api_key";
}
function isCredentialProviderCompatibleWithAuthProvider(params) {
	return resolveProviderIdForAuth(params.credential.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	}) === params.providerAuthKey || isOpenAIApiKeyCompatibleWithCodexAuth({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: params.providerAuthKey,
		credential: params.credential,
		profileProvider: params.credential.provider
	});
}
/** Returns true when a stored credential can authenticate the requested provider. */
function isStoredCredentialCompatibleWithAuthProvider(params) {
	return isCredentialProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: resolveProviderIdForAuth(params.provider, {
			config: params.cfg,
			...params.authAliasLookupParams
		}),
		credential: params.credential
	});
}
function isConfiguredProfileCompatibleWithAuthProvider(params) {
	return resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	}) === params.providerAuthKey || isOpenAIApiKeyCompatibleWithCodexAuth({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: params.providerAuthKey,
		credential: params.credential,
		profileProvider: params.provider,
		profileMode: params.mode
	});
}
function listProfilesCompatibleWithAuthProvider(params) {
	if (params.providerAuthKey !== OPENAI_CODEX_PROVIDER_ID) return listProfilesForProvider(params.store, params.provider);
	return Object.entries(params.store.profiles).filter(([, credential]) => isCredentialProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey: params.providerAuthKey,
		credential
	})).map(([profileId]) => profileId);
}
function resolveProviderAuthMode(cfg, provider) {
	const providers = cfg?.models?.providers;
	if (!providers) return;
	const auth = findNormalizedProviderValue(providers, provider)?.auth;
	return typeof auth === "string" ? auth : void 0;
}
function providerAllowsAwsSdkAuth(cfg, provider) {
	return resolveProviderAuthMode(cfg, provider) === "aws-sdk";
}
/** Returns true when config declares an aws-sdk auth profile for a provider. */
function isConfiguredAwsSdkAuthProfileForProvider(params) {
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (!profileConfig || profileConfig.mode !== "aws-sdk") return false;
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	if (resolveProviderIdForAuth(profileConfig.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	}) !== providerAuthKey) return false;
	return providerAllowsAwsSdkAuth(params.cfg, providerAuthKey);
}
/** Resolves whether a profile can be used for a provider right now. */
function resolveAuthProfileEligibility(params) {
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.cfg,
		...params.authAliasLookupParams
	});
	const cred = params.store.profiles[params.profileId];
	if (!cred) {
		if (isConfiguredAwsSdkAuthProfileForProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			provider: params.provider,
			profileId: params.profileId
		})) return {
			eligible: true,
			reasonCode: "ok"
		};
		return {
			eligible: false,
			reasonCode: "profile_missing"
		};
	}
	if (!isCredentialProviderCompatibleWithAuthProvider({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		credential: cred
	})) return {
		eligible: false,
		reasonCode: "provider_mismatch"
	};
	const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
	if (profileConfig) {
		if (!isConfiguredProfileCompatibleWithAuthProvider({
			cfg: params.cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			providerAuthKey,
			provider: profileConfig.provider,
			mode: profileConfig.mode,
			credential: cred
		})) return {
			eligible: false,
			reasonCode: "provider_mismatch"
		};
		if (profileConfig.mode !== cred.type) {
			if (!(profileConfig.mode === "oauth" && cred.type === "token")) return {
				eligible: false,
				reasonCode: "mode_mismatch"
			};
		}
	}
	const credentialEligibility = evaluateStoredCredentialEligibility({
		credential: cred,
		now: params.now
	});
	return {
		eligible: credentialEligibility.eligible,
		reasonCode: credentialEligibility.reasonCode
	};
}
/** Shares stored-over-config order precedence with CLI runtime selection. */
function resolveExplicitAuthOrderSelection(params) {
	const { storeOrder, configuredOrder, providerKey, providerAuthKey } = params;
	const stored = findNormalizedProviderValue(storeOrder, providerAuthKey) ?? findNormalizedProviderValue(storeOrder, providerKey);
	return {
		order: stored ?? findNormalizedProviderValue(configuredOrder, providerAuthKey) ?? findNormalizedProviderValue(configuredOrder, providerKey),
		fromStore: stored !== void 0
	};
}
/** Resolves ordered usable auth profiles plus whether an explicit order owns selection. */
function resolveAuthProfileOrderWithMetadata(params) {
	const { cfg, store, provider, preferredProfile, forModel } = params;
	const providerKey = normalizeProviderId(provider);
	const providerAuthKey = resolveProviderIdForAuth(provider, {
		config: cfg,
		...params.authAliasLookupParams
	});
	const now = Date.now();
	clearExpiredCooldowns(store, now);
	const { order: explicitOrder, fromStore: explicitOrderFromStore } = resolveExplicitAuthOrderSelection({
		storeOrder: store.order,
		configuredOrder: cfg?.auth?.order,
		providerKey,
		providerAuthKey
	});
	const explicitProfiles = cfg?.auth?.profiles ? Object.entries(cfg.auth.profiles).filter(([profileId, profile]) => isConfiguredProfileCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		providerAuthKey,
		provider: profile.provider,
		mode: profile.mode,
		credential: store.profiles[profileId]
	})).map(([profileId]) => profileId) : [];
	const storeProfiles = listProfilesCompatibleWithAuthProvider({
		cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		store,
		provider,
		providerAuthKey
	});
	const baseOrder = explicitOrder ?? (explicitProfiles.length > 0 ? explicitProfiles : storeProfiles);
	if (baseOrder.length === 0) return {
		profileIds: [],
		hasExplicitOrder: explicitOrder !== void 0
	};
	const isValidProfile = (profileId) => {
		const eligibility = resolveAuthProfileEligibility({
			cfg,
			authAliasLookupParams: params.authAliasLookupParams,
			store,
			provider,
			profileId,
			now
		});
		return eligibility.eligible || params.readinessMode === "read-only" && eligibility.reasonCode === "unresolved_ref";
	};
	let filtered = baseOrder.filter(isValidProfile);
	let repairedFallbackToStoreProfiles = false;
	const allBaseProfilesMissing = baseOrder.every((profileId) => !store.profiles[profileId]);
	if (filtered.length === 0 && allBaseProfilesMissing && (explicitOrderFromStore || explicitProfiles.length > 0)) {
		filtered = storeProfiles.filter(isValidProfile);
		repairedFallbackToStoreProfiles = true;
	}
	const deduped = dedupeProfileIds(filtered);
	if (explicitOrder && explicitOrder.length > 0 && !repairedFallbackToStoreProfiles) {
		const available = [];
		const inCooldown = [];
		for (const profileId of deduped) if (isProfileInCooldown(store, profileId, now, forModel)) {
			const cooldownUntil = resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}, forModel) ?? now;
			inCooldown.push({
				profileId,
				cooldownUntil
			});
		} else available.push(profileId);
		const cooldownSorted = inCooldown.toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
		const ordered = [...available, ...cooldownSorted];
		if (preferredProfile && ordered.includes(preferredProfile)) return {
			profileIds: [preferredProfile, ...ordered.filter((e) => e !== preferredProfile)],
			hasExplicitOrder: true
		};
		return {
			profileIds: ordered,
			hasExplicitOrder: true
		};
	}
	const sorted = orderProfilesByMode(deduped, store, now, forModel);
	if (preferredProfile && sorted.includes(preferredProfile)) return {
		profileIds: [preferredProfile, ...sorted.filter((e) => e !== preferredProfile)],
		hasExplicitOrder: explicitOrder !== void 0
	};
	return {
		profileIds: sorted,
		hasExplicitOrder: explicitOrder !== void 0
	};
}
/** Resolves ordered usable auth profile ids for a provider. */
function resolveAuthProfileOrder(params) {
	return resolveAuthProfileOrderWithMetadata(params).profileIds;
}
function orderProfilesByMode(order, store, now, forModel) {
	const available = [];
	const inCooldown = [];
	for (const profileId of order) if (isProfileInCooldown(store, profileId, now, forModel)) inCooldown.push(profileId);
	else available.push(profileId);
	const sorted = available.map((profileId) => {
		const profile = store.profiles[profileId];
		const type = profile?.type;
		return {
			profileId,
			typeScore: type === "oauth" ? 0 : type === "token" ? 1 : type === "api_key" ? 2 : 3,
			expiryScore: profile?.type === "oauth" && resolveTokenExpiryState(profile.expires, now) === "expired" ? 1 : 0,
			lastUsed: store.usageStats?.[profileId]?.lastUsed ?? 0
		};
	}).toSorted((a, b) => {
		if (a.typeScore !== b.typeScore) return a.typeScore - b.typeScore;
		if (a.expiryScore !== b.expiryScore) return a.expiryScore - b.expiryScore;
		return a.lastUsed - b.lastUsed;
	}).map((entry) => entry.profileId);
	const cooldownSorted = inCooldown.map((profileId) => ({
		profileId,
		cooldownUntil: resolveProfileUnusableUntil(store.usageStats?.[profileId] ?? {}, forModel) ?? now
	})).toSorted((a, b) => a.cooldownUntil - b.cooldownUntil).map((entry) => entry.profileId);
	return [...sorted, ...cooldownSorted];
}
//#endregion
export { resolveAuthProfileOrderWithMetadata as a, resolveAuthProfileOrder as i, isStoredCredentialCompatibleWithAuthProvider as n, resolveExplicitAuthOrderSelection as o, resolveAuthProfileEligibility as r, isConfiguredAwsSdkAuthProfileForProvider as t };
