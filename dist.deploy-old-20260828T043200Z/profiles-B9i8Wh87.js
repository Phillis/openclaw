import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-Csz_STEP.js";
import { n as listProfilesForProvider, t as dedupeProfileIds } from "./profile-list-BRrg2jEV.js";
import { s as resetAuthProfileFailureState } from "./usage-state-C0QBjJnZ.js";
import { a as loadPersistedAuthProfileStore, b as setRuntimeLocalProfileIds, g as getRuntimeLocalProfileIds, h as getRuntimeExternalCliProfileIds, l as buildPersistedAuthProfileState, v as removeRuntimeExternalProfileReferences, y as setRuntimeExternalCliProfileIds } from "./persisted-DGErf7Xt.js";
import { a as inspectPersistedAuthProfileStoreRaw, g as writePersistedAuthProfileStateRaw, h as runAuthProfileWriteTransaction, i as inspectPersistedAuthProfileStateRaw, r as deletePersistedAuthProfileStoreRaw } from "./sqlite-fgcxOC8G.js";
import { b as updateAuthProfileStoreWithLock, h as resolvePersistedAuthProfileOwnerAgentDir, i as ensureAuthProfileStoreForLocalUpdate, v as saveAuthProfileStore } from "./store-C0UG5FOx.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { isDeepStrictEqual } from "node:util";
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
/** Locked auth profile writes and attempt-scoped compensation. */
function throwAuthProfileUpdateError() {
	throw new Error("Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.");
}
/** Atomically persists a batch and returns conditional attempt-scoped compensation. */
async function persistAuthProfileBatch(params) {
	const profiles = new Map(params.profiles.map(({ profileId, credential, replaceExisting }) => [profileId, {
		credential: normalizeAuthProfileCredential(credential),
		replaceExisting: replaceExisting !== false
	}]));
	if (profiles.size === 0) return { rollback() {} };
	const previousProfiles = /* @__PURE__ */ new Map();
	const previousOrder = /* @__PURE__ */ new Map();
	const appliedProfiles = /* @__PURE__ */ new Map();
	let storeWasAbsent = false;
	let stateWasAbsent = false;
	runAuthProfileWriteTransaction(params.agentDir, (database) => {
		storeWasAbsent = inspectPersistedAuthProfileStoreRaw(params.agentDir, database).status === "missing";
		stateWasAbsent = inspectPersistedAuthProfileStateRaw(params.agentDir, database).status === "missing";
		const next = loadPersistedAuthProfileStore(params.agentDir, { database }) ?? {
			version: 1,
			profiles: {}
		};
		for (const [profileId, entry] of profiles) {
			if (!entry.replaceExisting && Object.hasOwn(next.profiles, profileId)) continue;
			previousProfiles.set(profileId, next.profiles[profileId]);
			next.profiles[profileId] = entry.credential;
			appliedProfiles.set(profileId, entry.credential);
		}
		for (const [provider, profileIds] of Object.entries(params.order ?? {})) {
			previousOrder.set(provider, next.order?.[provider]);
			const existing = next.order?.[provider] ?? [];
			const additions = [...new Set(profileIds)].filter((profileId) => appliedProfiles.has(profileId) && !existing.includes(profileId));
			if (additions.length > 0) next.order = {
				...next.order,
				[provider]: [...existing, ...additions]
			};
		}
		if (appliedProfiles.size > 0) saveAuthProfileStore(next, params.agentDir, {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		}, database);
	}, {
		sharedStoreWrite: true,
		stateDir: params.stateDir
	});
	let rolledBack = false;
	return { rollback: () => {
		if (rolledBack) return;
		runAuthProfileWriteTransaction(params.agentDir, (database) => {
			const current = loadPersistedAuthProfileStore(params.agentDir, { database });
			if (!current) return;
			const ownedProfiles = /* @__PURE__ */ new Set();
			for (const [profileId, credential] of appliedProfiles) {
				if (!isDeepStrictEqual(current.profiles[profileId], credential)) continue;
				ownedProfiles.add(profileId);
				const previous = previousProfiles.get(profileId);
				if (previous) current.profiles[profileId] = previous;
				else delete current.profiles[profileId];
			}
			for (const [provider, profileIds] of Object.entries(params.order ?? {})) {
				const existing = current.order?.[provider];
				if (!existing) continue;
				const preexisting = new Set(previousOrder.get(provider) ?? []);
				const introduced = new Set(profileIds.filter((profileId) => !preexisting.has(profileId)));
				const remaining = existing.filter((profileId) => !introduced.has(profileId) || !ownedProfiles.has(profileId));
				if (remaining.length === existing.length) continue;
				if (remaining.length > 0) current.order = {
					...current.order,
					[provider]: remaining
				};
				else if (current.order) {
					delete current.order[provider];
					if (Object.keys(current.order).length === 0) delete current.order;
				}
			}
			saveAuthProfileStore(current, params.agentDir, {
				filterExternalAuthProfiles: false,
				syncExternalCli: false
			}, database);
			if (storeWasAbsent && Object.keys(current.profiles).length === 0) deletePersistedAuthProfileStoreRaw(params.agentDir, database);
			if (stateWasAbsent && buildPersistedAuthProfileState(current) === null) writePersistedAuthProfileStateRaw(null, params.agentDir, database);
		}, {
			sharedStoreWrite: true,
			stateDir: params.stateDir
		});
		rolledBack = true;
	} };
}
async function upsertAuthProfileWithLockCore(params, resetFailureState) {
	const credential = normalizeAuthProfileCredential(params.credential);
	return await updateAuthProfileStoreWithLock({
		agentDir: params.agentDir,
		sharedStoreWrite: true,
		stateDir: params.stateDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (store) => {
			store.profiles[params.profileId] = credential;
			const existingStats = store.usageStats?.[params.profileId];
			if (resetFailureState && existingStats) store.usageStats[params.profileId] = resetAuthProfileFailureState(existingStats);
			return true;
		}
	});
}
/** Upserts an auth profile under the store lock, returning null on store write failure. */
async function upsertAuthProfileWithLock(params) {
	return await upsertAuthProfileWithLockCore(params, false);
}
/** Upserts an auth profile under the store lock, failing when the store cannot be written. */
async function upsertAuthProfileWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLock(params)) throwAuthProfileUpdateError();
}
/** Replaces one completed-login credential and clears only its existing failure state. */
async function upsertAuthProfileAfterLoginWithLockOrThrow(params) {
	if (!await upsertAuthProfileWithLockCore(params, true)) throwAuthProfileUpdateError();
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
function updateSuccessfulUsageStatsEntry(store, profileId, lastUsed) {
	store.usageStats = store.usageStats ?? {};
	store.usageStats[profileId] = resetAuthProfileFailureState(store.usageStats[profileId] ?? {}, { lastUsed });
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
		sharedStoreWrite: true,
		syncExternalCli: false
	});
}
/** Removes auth profiles and related state for a provider, optionally narrowed to exact IDs. */
async function removeProviderAuthProfilesWithLock(params) {
	if (params.profileIds) return await removeAuthProfilesWithLock({
		agentDir: params.agentDir,
		profileIds: params.profileIds
	});
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
			const next = removeRuntimeExternalProfileReferences({
				store,
				profileIds
			});
			if (isDeepStrictEqual(store, next)) return false;
			Object.assign(store, {
				profiles: next.profiles,
				order: next.order,
				lastGood: next.lastGood,
				usageStats: next.usageStats,
				runtimePersistedProfileIds: next.runtimePersistedProfileIds,
				runtimeExternalProfileIds: next.runtimeExternalProfileIds,
				runtimeExternalProfileIdsAuthoritative: next.runtimeExternalProfileIdsAuthoritative
			});
			setRuntimeLocalProfileIds(store, getRuntimeLocalProfileIds(next));
			setRuntimeExternalCliProfileIds(store, getRuntimeExternalCliProfileIds(next));
			return true;
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
export { removeAuthProfilesWithLock as a, upsertAuthProfile as c, upsertAuthProfileWithLock as d, upsertAuthProfileWithLockOrThrow as f, removeAuthProfilesAcrossOwnerStores as i, persistAuthProfileBatch as l, markAuthProfileSuccess as n, removeProviderAuthProfilesWithLock as o, normalizeAuthProfileCredential as p, promoteAuthProfileInOrder as r, setAuthProfileOrder as s, clearLastGoodProfileWithLock as t, upsertAuthProfileAfterLoginWithLockOrThrow as u };
