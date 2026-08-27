import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BN9nuenf.js";
import { n as listProfilesForProvider, t as dedupeProfileIds } from "./profile-list-C3LUpGxc.js";
import { b as updateAuthProfileStoreWithLock, h as resolvePersistedAuthProfileOwnerAgentDir, i as ensureAuthProfileStoreForLocalUpdate, v as saveAuthProfileStore } from "./store-DOJuehrg.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
//#region src/agents/auth-profiles/credential-normalize.ts
function normalizeAuthProfileCredential(credential) {
	if (credential.type === "api_key") {
		if (typeof credential.key !== "string") return credential;
		const { key: _key, ...rest } = credential;
		const key = normalizeSecretInput(credential.key);
		return {
			...rest,
			...key ? { key } : {}
		};
	}
	if (credential.type === "token") {
		if (typeof credential.token !== "string") return credential;
		const { token: _token, ...rest } = credential;
		const token = normalizeSecretInput(credential.token);
		return {
			...rest,
			...token ? { token } : {}
		};
	}
	return credential;
}
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.ts
/**
* Locked auth profile upsert helper.
* Normalizes literal secrets before persistence and routes all writes through
* the shared SQLite lock to avoid racing concurrent auth updates.
*/
/** Upserts an auth profile under the store lock, returning null on store write failure. */
async function upsertAuthProfileWithLock(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		stateDir: params.stateDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (store) => {
			store.profiles[params.profileId] = credential;
			return true;
		}
	});
}
/** Upserts an auth profile under the store lock, failing when the store cannot be written. */
async function upsertAuthProfileWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLock(params)) throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
//#endregion
//#region src/agents/auth-profiles/profiles.ts
/**
* Auth profile mutation helpers.
* Updates profile order, last-good state, usage stats, and provider profile
* records through locked or immediate store writes.
*/
const authProfileProfilesLog = createSubsystemLogger("agent/embedded");
function listProviderAuthStateEntries(entries, provider) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	return Object.entries(entries ?? {}).filter(([key]) => resolveProviderIdForAuth(key) === canonicalProvider).toSorted(([left], [right]) => left.localeCompare(right));
}
function readProviderAuthState(entries, provider) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	const matches = listProviderAuthStateEntries(entries, canonicalProvider);
	return matches.find(([key]) => normalizeProviderId(key) === canonicalProvider)?.[1] ?? matches[0]?.[1];
}
function replaceProviderAuthState(entries, provider, value) {
	const canonicalProvider = resolveProviderIdForAuth(provider);
	const next = Object.fromEntries(Object.entries(entries ?? {}).filter(([key]) => resolveProviderIdForAuth(key) !== canonicalProvider));
	if (value !== void 0) next[canonicalProvider] = value;
	return Object.keys(next).length > 0 ? next : void 0;
}
function resetSuccessfulUsageStats(existing, lastUsed) {
	return {
		...existing,
		errorCount: 0,
		blockedUntil: void 0,
		blockedReason: void 0,
		blockedSource: void 0,
		blockedModel: void 0,
		cooldownUntil: void 0,
		cooldownReason: void 0,
		cooldownModel: void 0,
		disabledUntil: void 0,
		disabledReason: void 0,
		failureCounts: void 0,
		lastUsed
	};
}
function updateSuccessfulUsageStatsEntry(store, profileId, lastUsed) {
	store.usageStats = store.usageStats ?? {};
	store.usageStats[profileId] = resetSuccessfulUsageStats(store.usageStats[profileId], lastUsed);
}
/** Sets or clears explicit auth profile order for a provider. */
async function setAuthProfileOrder(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	const deduped = dedupeProfileIds(params.order && Array.isArray(params.order) ? normalizeStringEntries(params.order) : []);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		...deduped.length > 0 ? { saveOptions: { preserveOrderProfileIds: deduped } } : {},
		updater: (store) => {
			if (deduped.length === 0) {
				if (listProviderAuthStateEntries(store.order, providerKey).length === 0) return false;
				store.order = replaceProviderAuthState(store.order, providerKey);
				return true;
			}
			store.order = replaceProviderAuthState(store.order, providerKey, deduped);
			return true;
		}
	});
}
/** Promotes one auth profile to the front of a provider order. */
async function promoteAuthProfileInOrder(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		...params.createFromOrder ? { saveOptions: { preserveOrderProfileIds: params.createFromOrder } } : {},
		updater: (store) => {
			const profile = store.profiles[params.profileId];
			if (!profile || resolveProviderIdForAuth(profile.provider) !== providerKey) return false;
			const matchingOrderEntries = listProviderAuthStateEntries(store.order, providerKey);
			const existing = readProviderAuthState(store.order, providerKey);
			if (!existing || existing.length === 0) {
				if (!params.createIfMissing) return false;
				const providerProfiles = dedupeProfileIds(params.createFromOrder !== void 0 ? params.createFromOrder : listProfilesForProvider(store, providerKey));
				const next = dedupeProfileIds([params.profileId, ...providerProfiles.filter((profileId) => profileId !== params.profileId)]);
				store.order = replaceProviderAuthState(store.order, providerKey, next);
				return true;
			}
			const next = dedupeProfileIds([params.profileId, ...existing.filter((profileId) => profileId !== params.profileId)]);
			if (next.length === existing.length && next.every((profileId, idx) => profileId === existing[idx]) && matchingOrderEntries.length === 1 && matchingOrderEntries[0]?.[0] === providerKey) return false;
			store.order = replaceProviderAuthState(store.order, providerKey, next);
			return true;
		}
	});
}
/** Upserts an auth profile immediately into the local store. */
function upsertAuthProfile(params) {
	const credential = normalizeAuthProfileCredential(params.credential);
	const store = ensureAuthProfileStoreForLocalUpdate(params.agentDir);
	store.profiles[params.profileId] = credential;
	saveAuthProfileStore(store, params.agentDir, {
		filterExternalAuthProfiles: false,
		syncExternalCli: false
	});
}
/** Removes all auth profiles and related state for a provider. */
async function removeProviderAuthProfilesWithLock(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			const profileIds = listProfilesForProvider(store, params.provider);
			let changed = false;
			for (const profileId of profileIds) {
				if (store.profiles[profileId]) {
					delete store.profiles[profileId];
					changed = true;
				}
				if (store.usageStats?.[profileId]) {
					delete store.usageStats[profileId];
					changed = true;
				}
			}
			if (listProviderAuthStateEntries(store.order, providerKey).length > 0) {
				store.order = replaceProviderAuthState(store.order, providerKey);
				changed = true;
			}
			if (listProviderAuthStateEntries(store.lastGood, providerKey).length > 0) {
				store.lastGood = replaceProviderAuthState(store.lastGood, providerKey);
				changed = true;
			}
			if (store.usageStats && Object.keys(store.usageStats).length === 0) store.usageStats = void 0;
			return changed;
		}
	});
}
/** Removes selected auth profiles and every state pointer that references them. */
async function removeAuthProfilesWithLock(params) {
	const profileIds = new Set(dedupeProfileIds([...params.profileIds]));
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			let changed = false;
			for (const profileId of profileIds) {
				if (store.profiles[profileId]) {
					delete store.profiles[profileId];
					changed = true;
				}
				if (store.usageStats?.[profileId]) {
					delete store.usageStats[profileId];
					changed = true;
				}
			}
			for (const [provider, order] of Object.entries(store.order ?? {})) {
				const next = order.filter((profileId) => !profileIds.has(profileId));
				if (next.length === order.length) continue;
				changed = true;
				if (next.length > 0) store.order[provider] = next;
				else delete store.order[provider];
			}
			for (const [provider, profileId] of Object.entries(store.lastGood ?? {})) if (profileIds.has(profileId)) {
				delete store.lastGood[provider];
				changed = true;
			}
			if (store.order && Object.keys(store.order).length === 0) store.order = void 0;
			if (store.lastGood && Object.keys(store.lastGood).length === 0) store.lastGood = void 0;
			if (store.usageStats && Object.keys(store.usageStats).length === 0) store.usageStats = void 0;
			return changed;
		}
	});
}
/**
* Removes profiles from every store that owns them. Auth profiles can be
* adopted by a provider-specific owner agent dir, so removing only the caller's
* store lets the profile reappear on the next status read and auth warmup.
*/
async function removeAuthProfilesAcrossOwnerStores(params) {
	const profilesByOwner = /* @__PURE__ */ new Map([[params.agentDir, new Set(params.profileIds)]]);
	for (const profileId of params.profileIds) {
		const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
			agentDir: params.agentDir,
			profileId
		});
		const ownerProfiles = profilesByOwner.get(ownerAgentDir) ?? /* @__PURE__ */ new Set();
		ownerProfiles.add(profileId);
		profilesByOwner.set(ownerAgentDir, ownerProfiles);
	}
	for (const [ownerAgentDir, profileIds] of profilesByOwner) if (!await removeAuthProfilesWithLock({
		profileIds: [...profileIds],
		agentDir: ownerAgentDir
	})) return false;
	return true;
}
/** Clear the last-good profile pointer for a provider under the store lock. */
async function clearLastGoodProfileWithLock(params) {
	const providerKey = resolveProviderIdForAuth(params.provider);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		updater: (store) => {
			if (!listProviderAuthStateEntries(store.lastGood, providerKey).some(([, profileId]) => profileId === params.profileId)) return false;
			store.lastGood = replaceProviderAuthState(store.lastGood, providerKey);
			return true;
		}
	});
}
/** Mark a profile as successfully used and update ordering/usage metadata. */
async function markAuthProfileSuccess(params) {
	const { store, provider, profileId, agentDir } = params;
	const providerKey = resolveProviderIdForAuth(provider);
	const lastUsed = Date.now();
	const updated = await updateAuthProfileStoreWithLock({
		agentDir,
		updater: (freshStore) => {
			const profile = freshStore.profiles[profileId];
			if (!profile || resolveProviderIdForAuth(profile.provider) !== providerKey) return false;
			freshStore.lastGood = replaceProviderAuthState(freshStore.lastGood, providerKey, profileId);
			updateSuccessfulUsageStatsEntry(freshStore, profileId, lastUsed);
			return true;
		}
	});
	if (updated) {
		store.lastGood = updated.lastGood;
		store.usageStats = updated.usageStats;
		return;
	}
	if (updated === null) authProfileProfilesLog.warn("dropped auth profile bookkeeping after locked store update failed", {
		event: "auth_profile_bookkeeping_dropped",
		kind: "success",
		profileId,
		tags: ["auth_profiles", "persistence"]
	});
}
//#endregion
export { removeAuthProfilesWithLock as a, upsertAuthProfile as c, normalizeAuthProfileCredential as d, removeAuthProfilesAcrossOwnerStores as i, upsertAuthProfileWithLock as l, markAuthProfileSuccess as n, removeProviderAuthProfilesWithLock as o, promoteAuthProfileInOrder as r, setAuthProfileOrder as s, clearLastGoodProfileWithLock as t, upsertAuthProfileWithLockOrThrow as u };
