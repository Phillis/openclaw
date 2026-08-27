import { n as findNormalizedProviderValue } from "./provider-id-DMd-TDFp.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { L as cloneAuthProfileStore, M as MINIMAX_CLI_PROFILE_ID, _ as areOAuthCredentialsEquivalent, g as setRuntimeExternalCliProfileIds, h as removeRuntimeExternalProfileReferences, k as CLAUDE_CLI_PROFILE_ID, p as getRuntimeExternalCliProfileIds, x as overlayRuntimeExternalOAuthProfiles } from "./persisted-tYYP9V51.js";
import { S as resolveExternalAuthProfilesWithPlugins } from "./provider-runtime-Drkiu7-F.js";
import { a as resolveExternalCliAuthProfiles, t as isExternalCliAuthProfileInScope } from "./external-cli-sync-CU9M9_mw.js";
//#region src/agents/auth-profiles/ambient-auth.ts
/** Provider auth-pin policy for credentials discovered outside OpenClaw storage. */
/** Returns whether ambient credential material agrees with a provider's declared auth mode. */
function isAmbientCredentialAllowedByProviderAuthPin(params) {
	const providers = params.config?.models?.providers;
	const direct = findNormalizedProviderValue(providers, params.provider);
	const providerAuthKey = resolveProviderIdForAuth(params.provider, {
		config: params.config,
		...params.authAliasLookupParams
	});
	const auth = direct?.auth ?? findNormalizedProviderValue(providers, providerAuthKey)?.auth;
	if (auth === "api-key") return params.type === "api_key";
	if (auth === "oauth") return params.type === "oauth" || params.type === "token";
	if (auth === "token") return params.type === "token";
	return auth === void 0;
}
//#endregion
//#region src/agents/auth-profiles/external-auth.ts
let resolveExternalAuthProfilesForRuntime;
/** Test-only resolver injection for provider external auth profiles. */
const testing = {
	resetResolveExternalAuthProfilesForTest() {
		resolveExternalAuthProfilesForRuntime = void 0;
	},
	setResolveExternalAuthProfilesForTest(resolver) {
		resolveExternalAuthProfilesForRuntime = resolver;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.externalAuthTestApi")] = testing;
function normalizeExternalAuthProfile(profile) {
	if (!profile?.profileId || !profile.credential) return null;
	return {
		...profile,
		persistence: profile.persistence ?? "runtime-only"
	};
}
function resolveExplicitProfileIds(values) {
	if (values === void 0) return;
	return new Set(Array.from(values, (value) => value.trim()).filter((value) => value.length > 0));
}
function isExternalAuthProfileAllowed(profile, store, config, explicitProfileIds, env) {
	if (store.profiles[profile.profileId] || explicitProfileIds?.has(profile.profileId)) return true;
	return isAmbientCredentialAllowedByProviderAuthPin({
		config,
		authAliasLookupParams: { env },
		provider: profile.credential.provider,
		type: profile.credential.type
	});
}
function resolveExternalAuthProfiles(params) {
	const env = params.env ?? process.env;
	const profiles = (resolveExternalAuthProfilesForRuntime ?? resolveExternalAuthProfilesWithPlugins)({
		env,
		config: params.externalCli?.config,
		...params.externalCli?.workspaceDir ? { workspaceDir: params.externalCli.workspaceDir } : {},
		context: {
			config: params.externalCli?.config,
			agentDir: params.agentDir,
			...params.externalCli?.workspaceDir ? { workspaceDir: params.externalCli.workspaceDir } : {},
			env,
			store: params.store
		}
	});
	const resolved = resolveExternalCliAuthProfileMap(params);
	const runtimeExternalCliProfileIds = new Set([...resolved.values()].filter((profile) => profile.persistence !== "persisted").map((profile) => profile.profileId));
	const pluginProfileIds = /* @__PURE__ */ new Set();
	const explicitProfileIds = resolveExplicitProfileIds(params.externalCli?.externalCliProfileIds);
	for (const rawProfile of profiles) {
		const profile = normalizeExternalAuthProfile(rawProfile);
		if (!profile) continue;
		if (!isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env)) continue;
		resolved.set(profile.profileId, profile);
		pluginProfileIds.add(profile.profileId);
		runtimeExternalCliProfileIds.delete(profile.profileId);
	}
	return {
		profiles: resolved,
		pluginProfileIds,
		runtimeExternalCliProfileIds
	};
}
function resolveAllowedExternalCliAuthProfiles(params) {
	const env = params.env ?? process.env;
	const explicitProfileIds = resolveExplicitProfileIds(params.externalCli?.externalCliProfileIds);
	return (resolveExternalCliAuthProfiles?.(params.store, {
		allowKeychainPrompt: params.externalCli?.allowKeychainPrompt,
		providerIds: params.externalCli?.externalCliProviderIds,
		profileIds: explicitProfileIds
	}) ?? []).flatMap((profile) => isExternalAuthProfileAllowed(profile, params.store, params.externalCli?.config, explicitProfileIds, env) ? [{
		profileId: profile.profileId,
		credential: profile.credential,
		persistence: profile.persistence ?? "runtime-only"
	}] : []);
}
function resolveExternalCliAuthProfileMap(params) {
	return new Map(resolveAllowedExternalCliAuthProfiles(params).map((profile) => [profile.profileId, profile]));
}
/** List runtime-only and persisted external auth profiles for this store. */
function listRuntimeExternalAuthProfiles(params) {
	return Array.from(resolveExternalAuthProfiles({
		store: params.store,
		agentDir: params.agentDir,
		env: params.env,
		externalCli: params.externalCli
	}).profiles.values());
}
function hasPersistableExternalCliSyncCandidate(store, params) {
	if (params?.externalCliProviderIds || params?.externalCliProfileIds) return true;
	for (const profileId of [CLAUDE_CLI_PROFILE_ID, MINIMAX_CLI_PROFILE_ID]) if (store.profiles[profileId]?.type === "oauth") return true;
	return false;
}
function hasScopedExternalCliOverlay(params) {
	return Boolean(params?.externalCliProviderIds || params?.externalCliProfileIds);
}
/** Overlay external auth profiles onto a cloned auth store for runtime use. */
function overlayExternalAuthProfiles(store, params) {
	const scoped = hasScopedExternalCliOverlay(params);
	const runtimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(store));
	const refreshedProfileIds = new Set((store.runtimeExternalProfileIds ?? []).filter((profileId) => !runtimeExternalCliProfileIds.has(profileId)));
	for (const profileId of runtimeExternalCliProfileIds) if (scoped && isExternalCliAuthProfileInScope({
		store,
		profileId,
		providerIds: params?.externalCliProviderIds,
		profileIds: params?.externalCliProfileIds
	})) refreshedProfileIds.add(profileId);
	const base = removeRuntimeExternalProfileReferences({
		store,
		profileIds: refreshedProfileIds
	});
	const resolved = resolveExternalAuthProfiles({
		store: base,
		agentDir: params?.agentDir,
		env: params?.env,
		externalCli: params
	});
	const next = overlayRuntimeExternalOAuthProfiles(base, resolved.profiles.values(), { runtimeExternalProfileIdsAuthoritative: !scoped });
	setRuntimeExternalCliProfileIds(next, [...getRuntimeExternalCliProfileIds(base).filter((profileId) => !resolved.pluginProfileIds.has(profileId)), ...resolved.runtimeExternalCliProfileIds]);
	return next;
}
/** Persist safe external CLI OAuth profiles that own their local profile slot. */
function syncPersistedExternalCliAuthProfiles(store, params) {
	if (!hasPersistableExternalCliSyncCandidate(store, params)) return store;
	const persistedProfiles = resolveAllowedExternalCliAuthProfiles({
		store,
		env: params?.env,
		externalCli: params
	}).filter((profile) => profile.persistence === "persisted");
	if (persistedProfiles.length === 0) return store;
	let next;
	for (const profile of persistedProfiles) {
		const existing = (next ?? store).profiles[profile.profileId];
		if (existing?.type === "oauth" && areOAuthCredentialsEquivalent(existing, profile.credential)) continue;
		next ??= cloneAuthProfileStore(store);
		next.profiles[profile.profileId] = profile.credential;
	}
	return next ?? store;
}
//#endregion
export { isAmbientCredentialAllowedByProviderAuthPin as i, overlayExternalAuthProfiles as n, syncPersistedExternalCliAuthProfiles as r, listRuntimeExternalAuthProfiles as t };
