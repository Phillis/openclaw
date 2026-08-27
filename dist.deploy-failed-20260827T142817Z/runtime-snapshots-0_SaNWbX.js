import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { s as resolveSharedAuthStorePath } from "./path-resolve-DH_naXF5.js";
import { m as resolveAuthProfileDatabasePath, t as closeAuthProfileReadPool } from "./sqlite-R6lp3fio.js";
import { L as cloneAuthProfileStore, s as mergeAuthProfileStores } from "./persisted-BaBq9UBI.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/runtime-materializations.ts
const materializations = /* @__PURE__ */ new Map();
const listeners = /* @__PURE__ */ new Set();
function ownerKey(agentDir) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
}
function notify(agentDir) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0
	};
	for (const listener of listeners) listener(event);
}
function registerRuntimeAuthMaterializationMutationListener(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
/** Records successful auth at the boundary that proved one exact runtime route. */
function recordRuntimeAuthMaterialization(params) {
	const fact = {
		provider: normalizeProviderId(params.provider),
		modelId: params.modelId.trim().toLowerCase(),
		modelApi: params.modelApi.trim().toLowerCase(),
		modelBaseUrl: params.modelBaseUrl.trim(),
		requestTransportOverrides: params.requestTransportOverrides,
		authMode: params.authMode.trim().toLowerCase(),
		runtimeOwnerId: params.runtimeOwnerId.trim().toLowerCase(),
		...params.authProfileId?.trim() ? { authProfileId: params.authProfileId.trim() } : {}
	};
	if (Object.values(fact).some((value) => !value)) return false;
	const key = ownerKey(params.agentDir);
	const existing = materializations.get(key) ?? [];
	if (existing.some((candidate) => isDeepStrictEqual(candidate, fact))) return false;
	materializations.set(key, [...existing, fact].slice(-64));
	notify(params.agentDir);
	return true;
}
/** Revokes all facts backed by one runtime owner after a classified auth failure. */
function revokeRuntimeAuthMaterializations(params) {
	const key = ownerKey(params.agentDir);
	const provider = normalizeProviderId(params.provider);
	const runtimeOwnerId = params.runtimeOwnerId.trim().toLowerCase();
	const existing = materializations.get(key);
	if (!provider || !runtimeOwnerId || !existing) return false;
	const next = existing.filter((fact) => fact.provider !== provider || fact.runtimeOwnerId !== runtimeOwnerId);
	if (next.length === existing.length) return false;
	if (next.length) materializations.set(key, next);
	else materializations.delete(key);
	notify(params.agentDir);
	return true;
}
function getPreparedRuntimeAuthMaterializations(agentDir) {
	return materializations.get(ownerKey(agentDir)) ?? [];
}
function clearRuntimeAuthMaterializations(agentDir) {
	materializations.delete(ownerKey(agentDir));
}
/** Clears materializations for an already resolved canonical auth database owner. */
function clearRuntimeAuthMaterializationsAtDatabasePath(databasePath) {
	materializations.delete(databasePath);
}
function clearAllRuntimeAuthMaterializations() {
	materializations.clear();
}
//#endregion
//#region src/agents/auth-profiles/runtime-snapshots.ts
/**
* Process-local auth profile snapshots used by prepared runtimes and tests.
* Snapshots are cloned at boundaries so callers cannot mutate shared state.
*/
const runtimeAuthStoreSnapshots = /* @__PURE__ */ new Map();
const runtimeAuthStoreMutationListeners = /* @__PURE__ */ new Set();
let runtimeAuthStoreCredentialsRevision = 0;
let runtimeAuthStoreSnapshotsRevision = 0;
const runtimeAuthStoreSnapshotRevisions = /* @__PURE__ */ new Map();
let persistedMutationRevision = 0;
let evictedOwnerMutationFloor = 0;
const MAX_PERSISTED_MUTATION_OWNERS = 256;
const MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER = 256;
const persistedMutationRecords = /* @__PURE__ */ new Map();
function advanceRuntimeAuthStoreSnapshotsRevision() {
	closeAuthProfileReadPool();
	runtimeAuthStoreSnapshotsRevision += 1;
}
function maxMutationRevision(record) {
	return Math.max(record.credentialRevision, record.profileSetRevision, record.stateRevision, record.mutationFloor, ...record.profileRevisions.values());
}
function getOrCreatePersistedMutationRecord(ownerKey) {
	const existing = persistedMutationRecords.get(ownerKey);
	if (existing) {
		persistedMutationRecords.delete(ownerKey);
		persistedMutationRecords.set(ownerKey, existing);
		return existing;
	}
	const record = {
		credentialRevision: evictedOwnerMutationFloor,
		credentialRevisionKnown: evictedOwnerMutationFloor === 0,
		profileSetRevision: evictedOwnerMutationFloor,
		profileSetRevisionKnown: evictedOwnerMutationFloor === 0,
		stateRevision: evictedOwnerMutationFloor,
		stateRevisionKnown: evictedOwnerMutationFloor === 0,
		mutationFloor: evictedOwnerMutationFloor,
		profileRevisions: /* @__PURE__ */ new Map()
	};
	persistedMutationRecords.set(ownerKey, record);
	while (persistedMutationRecords.size > MAX_PERSISTED_MUTATION_OWNERS) {
		const oldestOwnerKey = persistedMutationRecords.keys().next().value;
		if (oldestOwnerKey === void 0) break;
		const oldest = persistedMutationRecords.get(oldestOwnerKey);
		persistedMutationRecords.delete(oldestOwnerKey);
		if (oldest) evictedOwnerMutationFloor = Math.max(evictedOwnerMutationFloor, maxMutationRevision(oldest));
	}
	record.mutationFloor = Math.max(record.mutationFloor, evictedOwnerMutationFloor);
	return record;
}
function setProfileMutationRevision(record, profileId, revision) {
	record.profileRevisions.delete(profileId);
	record.profileRevisions.set(profileId, revision);
	while (record.profileRevisions.size > MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER) {
		const oldestProfileId = record.profileRevisions.keys().next().value;
		if (oldestProfileId === void 0) break;
		const oldestRevision = record.profileRevisions.get(oldestProfileId) ?? 0;
		record.profileRevisions.delete(oldestProfileId);
		record.mutationFloor = Math.max(record.mutationFloor, oldestRevision);
	}
}
function getPersistedMutationRecord(ownerKey) {
	return persistedMutationRecords.get(ownerKey);
}
function credentialState(entries) {
	return Array.from(entries).filter(([, store]) => Object.keys(store.profiles).length > 0).map(([key, store]) => [key, store.profiles]).toSorted(([left], [right]) => left.localeCompare(right));
}
function ownerState(store) {
	if (!store) return;
	return {
		order: store.order,
		profiles: store.profiles,
		runtimePersistedProfileIds: store.runtimePersistedProfileIds,
		runtimeExternalProfileIds: store.runtimeExternalProfileIds,
		runtimeExternalProfileIdsAuthoritative: store.runtimeExternalProfileIdsAuthoritative,
		runtimeExternalCliProfileIds: store.runtimeExternalCliProfileIds,
		runtimeLocalProfileIds: store.runtimeLocalProfileIds,
		runtimeInheritsMainState: store.runtimeInheritsMainState
	};
}
function replaceChangesOwner(entries) {
	const next = new Map(entries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	return !isDeepStrictEqual(Array.from(runtimeAuthStoreSnapshots, ([key, store]) => [key, ownerState(store)]).toSorted(([left], [right]) => left.localeCompare(right)), Array.from(next, ([key, store]) => [key, ownerState(store)]).toSorted(([left], [right]) => left.localeCompare(right)));
}
function replaceChangesCredentials(entries) {
	const next = new Map(entries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	return !isDeepStrictEqual(credentialState(runtimeAuthStoreSnapshots), credentialState(next));
}
function recordChangedSnapshotRevisions(entries) {
	const next = new Map(entries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	const keys = /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()]);
	let changed = false;
	for (const key of keys) {
		if (isDeepStrictEqual(runtimeAuthStoreSnapshots.get(key), next.get(key))) continue;
		changed = true;
		advanceRuntimeAuthStoreSnapshotsRevision();
		if (next.has(key)) runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
		else runtimeAuthStoreSnapshotRevisions.delete(key);
	}
	return changed;
}
function resolveRuntimeStoreKey(agentDir) {
	return agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
}
function resolveRuntimeSnapshotEntryKey(entry) {
	return entry.databasePath ?? resolveRuntimeStoreKey(entry.agentDir);
}
function notifyRuntimeAuthStoreMutation(agentDir) {
	const event = {
		...agentDir ? { agentDir } : {},
		affectsInheritedStores: agentDir === void 0
	};
	for (const listener of runtimeAuthStoreMutationListeners) listener(event);
}
function authProfilesChanged(previous, next) {
	return !isDeepStrictEqual(previous?.profiles ?? {}, next?.profiles ?? {});
}
/** Observes credential snapshot changes at their lifecycle publication edge. */
function registerRuntimeAuthProfileStoreMutationListener(listener) {
	runtimeAuthStoreMutationListeners.add(listener);
	return () => runtimeAuthStoreMutationListeners.delete(listener);
}
/** Reads a cloned runtime auth profile store snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshotCore(agentDir) {
	const store = runtimeAuthStoreSnapshots.get(resolveRuntimeStoreKey(agentDir));
	return store ? cloneAuthProfileStore(store) : void 0;
}
/**
* Reads the effective prepared auth store without falling back to persisted storage.
* Lifecycle consumers use this after auth publication so request paths never reopen SQLite.
*/
function getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir) {
	const inherited = getRuntimeAuthProfileStoreSnapshotCore(inheritedAuthDir);
	const requested = getRuntimeAuthProfileStoreSnapshotCore(agentDir);
	if (!agentDir || resolveRuntimeStoreKey(agentDir) === resolveRuntimeStoreKey(inheritedAuthDir)) return requested ?? inherited;
	if (inherited && requested) return mergeAuthProfileStores(inherited, requested, { preserveBaseRuntimeExternalProfiles: true });
	return requested ?? inherited;
}
/** Lists cloned snapshots while preserving their canonical database identity. */
function listRuntimeAuthProfileStoreSnapshots() {
	return Array.from(runtimeAuthStoreSnapshots, ([key, store]) => ({
		databasePath: key,
		agentDir: path.dirname(key),
		store: cloneAuthProfileStore(store)
	}));
}
/** Returns true when a runtime snapshot exists for an agent dir. */
function hasRuntimeAuthProfileStoreSnapshot(agentDir) {
	return runtimeAuthStoreSnapshots.has(resolveRuntimeStoreKey(agentDir));
}
/** Returns true when requested or main runtime snapshots contain profiles. */
function hasAnyRuntimeAuthProfileStoreSource(agentDir) {
	const requestedStore = getRuntimeAuthProfileStoreSnapshotCore(agentDir);
	if (requestedStore && Object.keys(requestedStore.profiles).length > 0) return true;
	if (!agentDir) return false;
	const mainStore = getRuntimeAuthProfileStoreSnapshotCore();
	return Boolean(mainStore && Object.keys(mainStore.profiles).length > 0);
}
/** Replaces all runtime auth profile snapshots with cloned entries. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
	const credentialsChanged = replaceChangesCredentials(entries);
	const ownerChanged = replaceChangesOwner(entries);
	if (credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	const next = new Map(entries.map((entry) => [resolveRuntimeSnapshotEntryKey(entry), entry.store]));
	for (const key of /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()])) if (authProfilesChanged(runtimeAuthStoreSnapshots.get(key), next.get(key))) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	recordChangedSnapshotRevisions(entries);
	runtimeAuthStoreSnapshots.clear();
	for (const entry of entries) runtimeAuthStoreSnapshots.set(resolveRuntimeSnapshotEntryKey(entry), cloneAuthProfileStore(entry.store));
	if (ownerChanged) notifyRuntimeAuthStoreMutation();
}
/** Clears all runtime auth profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
	const snapshotsChanged = runtimeAuthStoreSnapshots.size > 0;
	if (credentialState(runtimeAuthStoreSnapshots).length > 0) runtimeAuthStoreCredentialsRevision += 1;
	if (snapshotsChanged) advanceRuntimeAuthStoreSnapshotsRevision();
	else closeAuthProfileReadPool();
	runtimeAuthStoreSnapshots.clear();
	clearAllRuntimeAuthMaterializations();
	runtimeAuthStoreSnapshotRevisions.clear();
	if (snapshotsChanged) notifyRuntimeAuthStoreMutation();
}
/** Clears one runtime auth-profile snapshot without disturbing other active agents. */
function clearRuntimeAuthProfileStoreSnapshotCore(agentDir) {
	const key = resolveRuntimeStoreKey(agentDir);
	const store = runtimeAuthStoreSnapshots.get(key);
	if (!store) return false;
	if (Object.keys(store.profiles).length > 0) runtimeAuthStoreCredentialsRevision += 1;
	advanceRuntimeAuthStoreSnapshotsRevision();
	runtimeAuthStoreSnapshots.delete(key);
	clearRuntimeAuthMaterializationsAtDatabasePath(key);
	runtimeAuthStoreSnapshotRevisions.delete(key);
	notifyRuntimeAuthStoreMutation(agentDir);
	return true;
}
function setRuntimeAuthProfileStoreSnapshotAtKey(store, key, agentDir) {
	if (!isDeepStrictEqual(credentialState(runtimeAuthStoreSnapshots.has(key) ? [[key, runtimeAuthStoreSnapshots.get(key)]] : []), credentialState([[key, store]]))) runtimeAuthStoreCredentialsRevision += 1;
	const previousStore = runtimeAuthStoreSnapshots.get(key);
	if (authProfilesChanged(previousStore, store)) clearRuntimeAuthMaterializationsAtDatabasePath(key);
	const ownerChanged = !isDeepStrictEqual(ownerState(previousStore), ownerState(store));
	if (!isDeepStrictEqual(previousStore, store)) {
		advanceRuntimeAuthStoreSnapshotsRevision();
		runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
	}
	runtimeAuthStoreSnapshots.set(key, cloneAuthProfileStore(store));
	if (ownerChanged) notifyRuntimeAuthStoreMutation(agentDir);
}
/** Stores a cloned runtime auth profile snapshot for an agent dir. */
function setRuntimeAuthProfileStoreSnapshot(store, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(store, resolveRuntimeStoreKey(agentDir), agentDir);
}
/** Stores a cloned snapshot under an already resolved canonical database owner. */
function setRuntimeAuthProfileStoreSnapshotAtDatabasePath(store, databasePath, agentDir) {
	setRuntimeAuthProfileStoreSnapshotAtKey(store, databasePath, agentDir);
}
/**
* Invalidates prepared credential ownership after a persisted owner-store write.
* Main-store credentials are inherited by custom-agent snapshots, so those
* derived snapshots must be dropped even when no exact main snapshot exists.
* State-only saves refresh them in the publisher without changing credential ownership.
*/
function noteRuntimeAuthProfileStorePersistedMutation(agentDir, mutation) {
	if (!mutation.credentialsChanged && !mutation.profileSetChanged && !mutation.stateChanged) return;
	persistedMutationRevision += 1;
	if (mutation.credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
	const ownerKey = resolveRuntimeStoreKey(agentDir);
	if (mutation.credentialsChanged || mutation.profileSetChanged) clearRuntimeAuthMaterializations(agentDir);
	const record = getOrCreatePersistedMutationRecord(ownerKey);
	if (mutation.profileSetChanged) {
		record.profileSetRevision = persistedMutationRevision;
		record.profileSetRevisionKnown = true;
	}
	if (mutation.credentialsChanged) {
		record.credentialRevision = persistedMutationRevision;
		record.credentialRevisionKnown = true;
		for (const profileId of mutation.profileIds) setProfileMutationRevision(record, profileId, persistedMutationRevision);
	}
	if (mutation.stateChanged) {
		record.stateRevision = persistedMutationRevision;
		record.stateRevisionKnown = true;
	}
	const mainKey = resolveRuntimeStoreKey(void 0);
	if (ownerKey !== mainKey || !mutation.credentialsChanged && !mutation.profileSetChanged) return;
	let deletedDerivedSnapshot = false;
	for (const key of runtimeAuthStoreSnapshots.keys()) if (key !== mainKey) {
		runtimeAuthStoreSnapshots.delete(key);
		runtimeAuthStoreSnapshotRevisions.delete(key);
		deletedDerivedSnapshot = true;
	}
	if (deletedDerivedSnapshot) advanceRuntimeAuthStoreSnapshotsRevision();
	if (mutation.credentialsChanged || mutation.profileSetChanged) notifyRuntimeAuthStoreMutation(agentDir);
}
function combineMutationTokens(tokens) {
	return {
		revision: Math.max(0, ...tokens.map((token) => token.revision)),
		known: tokens.every((token) => token.known)
	};
}
/** Bounded persisted credential lineage; unknown means its exact token was evicted. */
function getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, options) {
	const requestedKey = resolveRuntimeStoreKey(agentDir);
	if (!profileId) {
		const record = getPersistedMutationRecord(requestedKey);
		return record ? {
			revision: record.credentialRevision,
			known: record.credentialRevisionKnown
		} : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	}
	const mainKey = resolveRuntimeStoreKey(void 0);
	return combineMutationTokens((requestedKey === mainKey || options?.includeMain !== true ? [requestedKey] : [requestedKey, mainKey]).map((key) => {
		const record = getPersistedMutationRecord(key);
		if (!record) return {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
		const revision = record.profileRevisions.get(profileId);
		return revision === void 0 ? {
			revision: record.mutationFloor,
			known: record.mutationFloor === 0
		} : {
			revision,
			known: true
		};
	}));
}
/** Persisted token for profile-id additions and removals in one owner store. */
function getRuntimeAuthProfileStoreProfileSetMutationToken(agentDir) {
	const record = getPersistedMutationRecord(resolveRuntimeStoreKey(agentDir));
	return record ? {
		revision: record.profileSetRevision,
		known: record.profileSetRevisionKnown
	} : {
		revision: evictedOwnerMutationFloor,
		known: evictedOwnerMutationFloor === 0
	};
}
/** Persisted mutation token for non-secret selection state in one owner store. */
function getRuntimeAuthProfileStoreStateMutationToken(agentDir, options) {
	const requestedKey = resolveRuntimeStoreKey(agentDir);
	const mainKey = resolveRuntimeStoreKey(void 0);
	return combineMutationTokens((requestedKey === mainKey || options?.includeMain !== true ? [requestedKey] : [requestedKey, mainKey]).map((key) => {
		const record = getPersistedMutationRecord(key);
		return record ? {
			revision: record.stateRevision,
			known: record.stateRevisionKnown
		} : {
			revision: evictedOwnerMutationFloor,
			known: evictedOwnerMutationFloor === 0
		};
	}));
}
/** Stable token for credential ownership without coupling to usage bookkeeping. */
function getRuntimeAuthProfileStoreCredentialsRevision() {
	return runtimeAuthStoreCredentialsRevision;
}
/** Process-local generation for one exact runtime snapshot rollback owner. */
function getRuntimeAuthProfileStoreSnapshotRevision(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(resolveRuntimeStoreKey(agentDir));
}
/** Process-local generation for an already resolved canonical snapshot owner. */
function getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath) {
	return runtimeAuthStoreSnapshotRevisions.get(databasePath) ?? runtimeAuthStoreSnapshotsRevision;
}
const testing = {
	MAX_PERSISTED_MUTATION_OWNERS,
	MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER,
	getPersistedMutationRecordCounts() {
		return {
			owners: persistedMutationRecords.size,
			profiles: Math.max(0, ...Array.from(persistedMutationRecords.values(), (record) => record.profileRevisions.size))
		};
	},
	resetPersistedMutationLineage() {
		persistedMutationRecords.clear();
		persistedMutationRevision = 0;
		evictedOwnerMutationFloor = 0;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.runtimeAuthSnapshotsTestApi")] = testing;
//#endregion
export { revokeRuntimeAuthMaterializations as S, setRuntimeAuthProfileStoreSnapshot as _, getRuntimeAuthProfileStoreCredentialsRevision as a, recordRuntimeAuthMaterialization as b, getRuntimeAuthProfileStoreSnapshotRevision as c, hasAnyRuntimeAuthProfileStoreSource as d, hasRuntimeAuthProfileStoreSnapshot as f, replaceRuntimeAuthProfileStoreSnapshots as g, registerRuntimeAuthProfileStoreMutationListener as h, getRuntimeAuthProfileStoreCredentialMutationToken as i, getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath as l, noteRuntimeAuthProfileStorePersistedMutation as m, clearRuntimeAuthProfileStoreSnapshots as n, getRuntimeAuthProfileStoreProfileSetMutationToken as o, listRuntimeAuthProfileStoreSnapshots as p, getPreparedRuntimeAuthProfileStoreSnapshotCore as r, getRuntimeAuthProfileStoreSnapshotCore as s, clearRuntimeAuthProfileStoreSnapshotCore as t, getRuntimeAuthProfileStoreStateMutationToken as u, setRuntimeAuthProfileStoreSnapshotAtDatabasePath as v, registerRuntimeAuthMaterializationMutationListener as x, getPreparedRuntimeAuthMaterializations as y };
