import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-D9gvQMP6.js";
import { d as isSecretRef } from "./types.secrets-BrIfhxSG.js";
import { s as resolveSharedAuthStorePath } from "./path-resolve-DES5vxlU.js";
import { _ as writePersistedAuthProfileStoreRaw, a as inspectPersistedAuthProfileStoreRaw, c as readPersistedAuthProfileStateRaw, g as writePersistedAuthProfileStateRaw, h as runAuthProfileWriteTransaction, l as readPersistedAuthProfileStoreRaw, m as resolveAuthProfileDatabasePath, n as deferAuthProfilePostCommitPublication, r as deletePersistedAuthProfileStoreRaw } from "./sqlite-Bc2uR5B8.js";
import { d as listLegacyAuthProfileSources, f as markAuthProfileMigrationRequired, i as assertAuthProfileMigrationReady, m as warnLegacyAuthProfileSourcesIgnored, n as AuthProfileMigrationRequiredError, o as clearAuthProfileMigrationRequired, r as AuthProfileStoreUnreadableError } from "./legacy-source-diagnostic-C-wLeKtj.js";
import { C as shouldPersistRuntimeExternalOAuthProfile, I as authProfilesLog, L as cloneAuthProfileStore, a as loadPersistedAuthProfileStore, b as isSafeToAdoptMainStoreOAuthIdentity, d as loadPersistedAuthProfileState, g as setRuntimeExternalCliProfileIds, l as buildPersistedAuthProfileState, m as mergeRuntimeExternalProfileReferences, n as buildPersistedAuthProfileSecretsStore, p as getRuntimeExternalCliProfileIds, s as mergeAuthProfileStores } from "./persisted-B895D0I1.js";
import { _ as setRuntimeAuthProfileStoreSnapshot, g as replaceRuntimeAuthProfileStoreSnapshots, l as getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath, m as noteRuntimeAuthProfileStorePersistedMutation, n as clearRuntimeAuthProfileStoreSnapshots, p as listRuntimeAuthProfileStoreSnapshots, r as getPreparedRuntimeAuthProfileStoreSnapshotCore, s as getRuntimeAuthProfileStoreSnapshotCore, t as clearRuntimeAuthProfileStoreSnapshotCore, v as setRuntimeAuthProfileStoreSnapshotAtDatabasePath } from "./runtime-snapshots-CVpJCNdz.js";
import { n as overlayExternalAuthProfiles, r as syncPersistedExternalCliAuthProfiles, t as listRuntimeExternalAuthProfiles } from "./external-auth-D0I4FGco.js";
import "./source-check-BjQgT_Mf.js";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/auth-profiles/ownership.ts
function shouldUseMainOwnerForLocalOAuthCredential(params) {
	if (params.local.type !== "oauth" || params.main?.type !== "oauth") return false;
	if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) return false;
	if (isDeepStrictEqual(params.local, params.main)) return true;
	const mainExpires = asDateTimestampMs(params.main.expires);
	if (mainExpires === void 0) return false;
	const localExpires = asDateTimestampMs(params.local.expires);
	return localExpires === void 0 || mainExpires >= localExpires;
}
function isInheritedMainOAuthCredentialFromStores(params) {
	if (params.persistedStores.isMainStore || params.credential.type !== "oauth") return false;
	if (params.persistedStores.localStore?.profiles[params.profileId]) return false;
	const mainCredential = params.persistedStores.mainStore?.profiles[params.profileId];
	return mainCredential?.type === "oauth" && (isDeepStrictEqual(mainCredential, params.credential) || shouldUseMainOwnerForLocalOAuthCredential({
		local: params.credential,
		main: mainCredential
	}));
}
//#endregion
//#region src/agents/auth-profiles/store.ts
/**
* Auth profile store orchestration.
* Merges persisted stores, runtime snapshots, inherited main-agent OAuth
* profiles, and external CLI overlays while keeping save paths local.
*/
const INLINE_OAUTH_TOKEN_FIELDS = [
	"access",
	"refresh",
	"idToken"
];
const authProfileRuntimeMode = new AsyncLocalStorage();
function createEmptyAuthProfileStore() {
	return {
		version: 1,
		profiles: {}
	};
}
/** Run a bounded operation without persisted or external CLI auth profiles. */
function withEnvOnlyAuthProfileStore(run) {
	return authProfileRuntimeMode.run({ kind: "env-only" }, run);
}
/** Run a bounded operation against one existing persisted auth store. */
function withAuthProfileStoreAgentDir(agentDir, run) {
	return authProfileRuntimeMode.run({
		kind: "agent-dir",
		agentDir
	}, run);
}
function isEnvOnlyAuthProfileRuntime() {
	return authProfileRuntimeMode.getStore()?.kind === "env-only";
}
function resolveRuntimeAuthProfileAgentDir(agentDir) {
	const mode = authProfileRuntimeMode.getStore();
	return mode?.kind === "agent-dir" ? mode.agentDir : agentDir;
}
function resolveRuntimeAuthProfileLoadOptions(options) {
	const mode = authProfileRuntimeMode.getStore();
	if (mode?.kind !== "agent-dir") return options;
	return {
		...options,
		inheritedAuthDir: mode.agentDir
	};
}
function hasInlineOAuthTokenMaterial(credential) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => credential[field] !== void 0);
}
function hasChangedInlineOAuthTokenMaterial(params) {
	return INLINE_OAUTH_TOKEN_FIELDS.some((field) => {
		if (params.credential[field] === void 0) return false;
		return !isDeepStrictEqual(params.credential[field], params.existingCredential[field]);
	});
}
function preserveLegacyOAuthRefsOnSave(params) {
	if (!isRecord(params.existingRaw) || !isRecord(params.existingRaw.profiles)) return params.payload;
	let nextProfiles;
	for (const [profileId, credential] of Object.entries(params.payload.profiles)) {
		if (!isRecord(credential) || credential.oauthRef !== void 0 || credential.type !== "oauth") continue;
		const existingCredential = params.existingRaw.profiles[profileId];
		if (!isRecord(existingCredential) || existingCredential.oauthRef === void 0 || existingCredential.type !== "oauth") continue;
		if (hasInlineOAuthTokenMaterial(credential) && hasChangedInlineOAuthTokenMaterial({
			credential,
			existingCredential
		})) continue;
		nextProfiles ??= { ...params.payload.profiles };
		nextProfiles[profileId] = {
			...credential,
			oauthRef: existingCredential.oauthRef
		};
	}
	return nextProfiles ? {
		...params.payload,
		profiles: nextProfiles
	} : params.payload;
}
let runtimeSnapshotPublisherForTest;
function publishRuntimeSnapshotsAfterCommit(publish) {
	if (!publish) return true;
	try {
		if (runtimeSnapshotPublisherForTest) runtimeSnapshotPublisherForTest(publish);
		else publish();
		return true;
	} catch (err) {
		clearRuntimeAuthProfileStoreSnapshots();
		authProfilesLog.warn("auth profile store committed but runtime snapshot publication failed", { err });
		return false;
	}
}
const testing = {
	publishRuntimeSnapshotsAfterCommit,
	resetRuntimeSnapshotPublisherForTest() {
		runtimeSnapshotPublisherForTest = void 0;
	},
	setRuntimeSnapshotPublisherForTest(publisher) {
		runtimeSnapshotPublisherForTest = publisher;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.authProfileStoreTestApi")] = testing;
function resolvePersistedLoadOptions(options) {
	return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.database ? { database: options.database } : {}
	};
}
function loadPersistedAuthProfileStores(agentDir, database) {
	const localStore = loadPersistedAuthProfileStore(agentDir, database ? { database } : void 0);
	const isMainStore = (agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath()) === resolveSharedAuthStorePath();
	return {
		isMainStore,
		localStore,
		mainStore: isMainStore ? localStore : loadPersistedAuthProfileStore()
	};
}
/**
* A non-main agent store deliberately does not persist an OAuth credential the
* main store already owns at the same or newer expiry. Callers that verify a
* write must treat such a profile as intentionally deduped rather than lost,
* otherwise the credential looks like it vanished during the write.
*/
function isInheritedMainOAuthCredential(params) {
	if (!params.agentDir || params.credential.type !== "oauth") return false;
	return isInheritedMainOAuthCredentialFromStores({
		profileId: params.profileId,
		credential: params.credential,
		persistedStores: loadPersistedAuthProfileStores(params.agentDir)
	});
}
function resolveRuntimeAuthProfileStore(agentDir, options) {
	const mainKey = options?.inheritedAuthDir ? resolveAuthProfileDatabasePath(options.inheritedAuthDir) : resolveSharedAuthStorePath();
	const requestedKey = agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath();
	const mainStore = getRuntimeAuthProfileStoreSnapshotCore(options?.inheritedAuthDir);
	const requestedStore = getRuntimeAuthProfileStoreSnapshotCore(agentDir);
	if (!agentDir || requestedKey === mainKey) {
		if (!mainStore) return null;
		return mainStore;
	}
	if (mainStore && requestedStore) return mergeAuthProfileStores(mainStore, requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (requestedStore) return mergeAuthProfileStores(loadAuthProfileStoreForAgent(options?.inheritedAuthDir, {
		readOnly: true,
		syncExternalCli: false,
		...resolvePersistedLoadOptions(options)
	}), requestedStore, { preserveBaseRuntimeExternalProfiles: true });
	if (mainStore) return mergeAuthProfileStores(mainStore, loadAuthProfileStoreForAgent(agentDir, {
		readOnly: true,
		syncExternalCli: false,
		...resolvePersistedLoadOptions(options)
	}), { preserveBaseRuntimeExternalProfiles: true });
	return null;
}
function resolveExternalCliOverlayOptions(options) {
	const discovery = options?.externalCli;
	if (!discovery) return {
		...options?.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: options.allowKeychainPrompt } : {},
		...options?.config ? { config: options.config } : {},
		...options?.externalCliProviderIds ? { externalCliProviderIds: options.externalCliProviderIds } : {},
		...options?.externalCliProfileIds ? { externalCliProfileIds: options.externalCliProfileIds } : {}
	};
	if (discovery.mode === "none") {
		const config = discovery.config ?? options?.config;
		return {
			allowKeychainPrompt: false,
			...config ? { config } : {},
			...discovery.workspaceDir ? { workspaceDir: discovery.workspaceDir } : {},
			externalCliProviderIds: [],
			externalCliProfileIds: []
		};
	}
	if (discovery.mode === "existing") {
		const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
		const config = discovery.config ?? options?.config;
		return {
			...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
			...config ? { config } : {},
			...discovery.workspaceDir ? { workspaceDir: discovery.workspaceDir } : {}
		};
	}
	const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
	const config = discovery.config ?? options?.config;
	return {
		...allowKeychainPrompt !== void 0 ? { allowKeychainPrompt } : {},
		...config ? { config } : {},
		...discovery.workspaceDir ? { workspaceDir: discovery.workspaceDir } : {},
		...discovery.providerIds ? { externalCliProviderIds: discovery.providerIds } : {},
		...discovery.profileIds ? { externalCliProfileIds: discovery.profileIds } : {}
	};
}
function hasScopedExternalCliOverlay(options) {
	return options.externalCliProviderIds !== void 0 || options.externalCliProfileIds !== void 0;
}
function maybeSyncPersistedExternalCliAuthProfiles(params) {
	if (params.options?.readOnly === true || params.options?.syncExternalCli === false || process.env.OPENCLAW_AUTH_STORE_READONLY === "1") return {
		store: params.store,
		cacheable: true
	};
	const synced = syncPersistedExternalCliAuthProfiles(params.store, {
		agentDir: params.agentDir,
		...resolveExternalCliOverlayOptions(params.options)
	});
	if (synced === params.store) return {
		store: params.store,
		cacheable: true
	};
	const changedProfiles = Object.entries(synced.profiles).filter(([profileId, credential]) => {
		const previous = params.store.profiles[profileId];
		return !isDeepStrictEqual(previous, credential);
	});
	if (changedProfiles.length === 0) return {
		store: synced,
		cacheable: true
	};
	let publishRuntimeSnapshots;
	let result;
	try {
		result = runAuthProfileWriteTransaction(params.agentDir, (database) => {
			const latestStore = loadPersistedAuthProfileStore(params.agentDir, {
				...resolvePersistedLoadOptions(params.options),
				database
			}) ?? {
				version: 1,
				profiles: {}
			};
			let changed = false;
			for (const [profileId, credential] of changedProfiles) {
				const previous = params.store.profiles[profileId];
				const latest = latestStore.profiles[profileId];
				if (!isDeepStrictEqual(latest, previous)) {
					authProfilesLog.debug("skipped persisted external cli auth sync for concurrently changed profile", { profileId });
					continue;
				}
				latestStore.profiles[profileId] = credential;
				changed = true;
			}
			if (changed) publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(latestStore, params.agentDir, { filterExternalAuthProfiles: false }, database);
			return {
				store: latestStore,
				cacheable: true
			};
		});
	} catch (err) {
		authProfilesLog.warn("skipped persisted external cli auth sync because auth store write failed", { err });
		return {
			store: params.store,
			cacheable: false
		};
	}
	return publishRuntimeSnapshotsAfterCommit(publishRuntimeSnapshots) ? result : {
		store: result.store,
		cacheable: false
	};
}
function shouldKeepProfileInLocalStore(params) {
	if (params.credential.type !== "oauth") return true;
	if (isInheritedMainOAuthCredentialFromStores({
		profileId: params.profileId,
		credential: params.credential,
		persistedStores: params.persistedStores
	})) return false;
	if (params.options?.filterExternalAuthProfiles === false) return true;
	if (params.store.runtimeExternalProfileIds?.includes(params.profileId)) {
		if (params.persistedStores.localStore?.profiles[params.profileId]) return shouldPersistRuntimeExternalOAuthProfile({
			profileId: params.profileId,
			credential: params.credential,
			profiles: params.externalProfiles()
		});
		const runtimeCredential = getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[params.profileId];
		if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, params.credential)) return false;
	}
	return shouldPersistRuntimeExternalOAuthProfile({
		profileId: params.profileId,
		credential: params.credential,
		profiles: params.externalProfiles()
	});
}
function pruneAuthProfileStoreReferences(store, keptProfileIds, keptOrderProfileIds = keptProfileIds) {
	store.order = store.order ? Object.fromEntries(Object.entries(store.order).map(([provider, profileIds]) => [provider, profileIds.filter((profileId) => keptOrderProfileIds.has(profileId))]).filter(([, profileIds]) => Array.isArray(profileIds) && profileIds.length > 0)) : void 0;
	store.lastGood = store.lastGood ? Object.fromEntries(Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId))) : void 0;
	store.usageStats = store.usageStats ? Object.fromEntries(Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId) || profileId.startsWith("inline-api-key:"))) : void 0;
	store.runtimePersistedProfileIds = store.runtimePersistedProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	if (store.runtimePersistedProfileIds?.length === 0) store.runtimePersistedProfileIds = void 0;
	store.runtimeLocalProfileIds = store.runtimeLocalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	store.runtimeExternalProfileIds = store.runtimeExternalProfileIds?.filter((profileId) => keptProfileIds.has(profileId)).toSorted();
	setRuntimeExternalCliProfileIds(store, getRuntimeExternalCliProfileIds(store).filter((profileId) => keptProfileIds.has(profileId)));
	if (store.runtimeExternalProfileIds?.length === 0 && store.runtimeExternalProfileIdsAuthoritative !== true) store.runtimeExternalProfileIds = void 0;
	if (store.runtimeExternalProfileIdsAuthoritative === true) store.runtimeExternalProfileIds ??= [];
}
function buildLocalAuthProfileStoreForSave(params) {
	const localStore = cloneAuthProfileStore(params.store);
	let externalProfiles;
	const getExternalProfiles = () => externalProfiles ??= listRuntimeExternalAuthProfiles({
		store: params.store,
		agentDir: params.agentDir
	});
	localStore.profiles = Object.fromEntries(Object.entries(localStore.profiles).filter(([profileId, credential]) => shouldKeepProfileInLocalStore({
		store: params.store,
		profileId,
		credential,
		agentDir: params.agentDir,
		options: params.options,
		persistedStores: params.persistedStores,
		externalProfiles: getExternalProfiles
	})));
	const keptProfileIds = new Set(Object.keys(localStore.profiles));
	const keptOrderProfileIds = new Set(keptProfileIds);
	for (const profileId of params.options?.preserveStateProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) {
			keptProfileIds.add(normalizedProfileId);
			keptOrderProfileIds.add(normalizedProfileId);
		}
	}
	for (const profileIds of Object.values(params.persistedStores.localStore?.order ?? {})) for (const profileId of profileIds) keptOrderProfileIds.add(profileId);
	for (const profileId of params.options?.preserveOrderProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) keptOrderProfileIds.add(normalizedProfileId);
	}
	const prunedOrderProfileIds = /* @__PURE__ */ new Set();
	for (const profileId of params.options?.pruneOrderProfileIds ?? []) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) prunedOrderProfileIds.add(normalizedProfileId);
	}
	for (const profileId of prunedOrderProfileIds) keptOrderProfileIds.delete(profileId);
	pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
	if (params.options?.filterExternalAuthProfiles !== false) {
		localStore.runtimeExternalProfileIds = void 0;
		localStore.runtimeExternalProfileIdsAuthoritative = void 0;
		setRuntimeExternalCliProfileIds(localStore, []);
	}
	return localStore;
}
function buildAuthProfileStoreWithoutExternalProfiles(params) {
	const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
	const localStore = cloneAuthProfileStore(params.store);
	if (runtimeExternalProfileIds.size === 0) return stripRuntimeExternalProfileMetadata(localStore);
	for (const profileId of runtimeExternalProfileIds) delete localStore.profiles[profileId];
	pruneAuthProfileStoreReferences(localStore, new Set(Object.keys(localStore.profiles)));
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, params.options), localStore));
}
function stripRuntimeExternalProfileMetadata(store) {
	const stripped = { ...store };
	delete stripped.runtimeExternalProfileIds;
	delete stripped.runtimeExternalProfileIdsAuthoritative;
	setRuntimeExternalCliProfileIds(stripped, []);
	return stripped;
}
function markRuntimePersistedProfiles(store, persistedStore = store) {
	const profileIds = Object.entries(persistedStore.profiles).flatMap(([profileId, credential]) => isDeepStrictEqual(store.profiles[profileId], credential) ? [profileId] : []).toSorted();
	return {
		...store,
		runtimePersistedProfileIds: profileIds.length > 0 ? profileIds : void 0
	};
}
function buildRuntimeAuthProfileStoreForSave(params) {
	return buildLocalAuthProfileStoreForSave({
		...params,
		options: {
			...params.options,
			filterExternalAuthProfiles: false
		}
	});
}
function setRuntimeLocalProfileMetadata(store, localProfileIds, runtimeInheritsMainState = false) {
	return {
		...store,
		runtimeLocalProfileIds: [...new Set(localProfileIds)].toSorted(),
		...runtimeInheritsMainState ? { runtimeInheritsMainState: true } : {}
	};
}
function runtimeStoreInheritsMainState(store, localStore) {
	const state = ({ order, lastGood, usageStats }) => ({
		order,
		lastGood,
		usageStats
	});
	return !isDeepStrictEqual(state(store), state(localStore));
}
function listRuntimeLocalProfileIds(store, mainStore) {
	return Object.entries(store.profiles).flatMap(([profileId, credential]) => mainStore && shouldUseMainOwnerForLocalOAuthCredential({
		local: credential,
		main: mainStore.profiles[profileId]
	}) ? [] : [profileId]);
}
function setRuntimeExternalProfileMetadata(params) {
	const profileIds = [...params.profileIds].toSorted();
	params.store.runtimeExternalProfileIds = profileIds.length > 0 || params.authoritative ? profileIds : void 0;
	params.store.runtimeExternalProfileIdsAuthoritative = params.authoritative ? true : void 0;
	setRuntimeExternalCliProfileIds(params.store, getRuntimeExternalCliProfileIds(params.store).filter((profileId) => params.profileIds.has(profileId)));
}
function preserveResolvedSecretBackedCredentials(params) {
	const next = cloneAuthProfileStore(params.next);
	for (const [profileId, credential] of Object.entries(next.profiles)) {
		const existing = params.existing.profiles[profileId];
		if (credential.type === "api_key" && existing?.type === "api_key" && credential.key === void 0 && existing.key !== void 0 && isSecretRef(credential.keyRef) && isDeepStrictEqual(credential.keyRef, existing.keyRef)) next.profiles[profileId] = {
			...credential,
			key: existing.key
		};
		else if (credential.type === "token" && existing?.type === "token" && credential.token === void 0 && existing.token !== void 0 && isSecretRef(credential.tokenRef) && isDeepStrictEqual(credential.tokenRef, existing.tokenRef)) next.profiles[profileId] = {
			...credential,
			token: existing.token
		};
	}
	return next;
}
function mergeRuntimeExternalProfileState(params) {
	const existingRuntimeProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
	if (existingRuntimeProfileIds.size === 0) return params.next;
	const merged = cloneAuthProfileStore(params.next);
	const mergedRuntimeProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
	const existingRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(params.existing));
	const mergedRuntimeExternalCliProfileIds = new Set(getRuntimeExternalCliProfileIds(merged));
	const activeRuntimeProfileIds = /* @__PURE__ */ new Set();
	const nextRuntimeProfileIdsAuthoritative = params.next.runtimeExternalProfileIdsAuthoritative === true;
	for (const profileId of existingRuntimeProfileIds) {
		if (nextRuntimeProfileIdsAuthoritative && !mergedRuntimeProfileIds.has(profileId)) continue;
		const existingCredential = params.existing.profiles[profileId];
		if (!existingCredential) continue;
		const nextCredential = merged.profiles[profileId];
		if (nextCredential) {
			if (mergedRuntimeProfileIds.has(profileId) || isDeepStrictEqual(nextCredential, existingCredential)) {
				mergedRuntimeProfileIds.add(profileId);
				activeRuntimeProfileIds.add(profileId);
				if (existingRuntimeExternalCliProfileIds.has(profileId)) mergedRuntimeExternalCliProfileIds.add(profileId);
			}
			continue;
		}
		merged.profiles[profileId] = existingCredential;
		mergedRuntimeProfileIds.add(profileId);
		activeRuntimeProfileIds.add(profileId);
		if (existingRuntimeExternalCliProfileIds.has(profileId)) mergedRuntimeExternalCliProfileIds.add(profileId);
	}
	if (activeRuntimeProfileIds.size === 0) return params.next;
	for (const profileId of activeRuntimeProfileIds) if (params.existing.usageStats?.[profileId]) merged.usageStats = {
		...merged.usageStats,
		[profileId]: params.existing.usageStats[profileId]
	};
	for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
		const externalProfileIds = profileIds.filter((profileId) => activeRuntimeProfileIds.has(profileId));
		if (externalProfileIds.length === 0 || merged.order?.[provider]) continue;
		merged.order = {
			...merged.order,
			[provider]: externalProfileIds
		};
	}
	for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
		if (!activeRuntimeProfileIds.has(profileId) || merged.lastGood?.[provider]) continue;
		merged.lastGood = {
			...merged.lastGood,
			[provider]: profileId
		};
	}
	setRuntimeExternalProfileMetadata({
		store: merged,
		profileIds: mergedRuntimeProfileIds,
		authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true
	});
	setRuntimeExternalCliProfileIds(merged, mergedRuntimeExternalCliProfileIds);
	return merged;
}
/** Apply an auth store update inside the SQLite write lock. */
async function updateAuthProfileStoreWithLock(params) {
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	let publishRuntimeSnapshots;
	let store;
	try {
		store = runAuthProfileWriteTransaction(agentDir, (database) => {
			const loadedStore = loadAuthProfileStoreForAgent(agentDir, {
				database,
				readOnly: true,
				syncExternalCli: false
			});
			if (params.updater(loadedStore)) publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(loadedStore, agentDir, params.saveOptions, database);
			return loadedStore;
		}, { stateDir: params.stateDir });
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		authProfilesLog.warn(`auth profile store update failed: ${message}`, {
			agentDir,
			error: message
		});
		return null;
	}
	publishRuntimeSnapshotsAfterCommit(publishRuntimeSnapshots);
	return store;
}
/** Load the main auth profile store with runtime external profiles overlaid. */
function loadAuthProfileStore() {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const agentDir = resolveRuntimeAuthProfileAgentDir();
	const asStore = loadPersistedAuthProfileStore(agentDir);
	if (asStore) return overlayExternalAuthProfiles(markRuntimePersistedProfiles(asStore), { agentDir });
	return overlayExternalAuthProfiles(markRuntimePersistedProfiles({
		version: 1,
		profiles: {}
	}), { agentDir });
}
function loadAuthProfileStoreForAgent(agentDir, options) {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
	assertAuthProfileMigrationReady(effectiveAgentDir);
	const asStore = loadPersistedAuthProfileStore(effectiveAgentDir, resolvePersistedLoadOptions(effectiveOptions));
	if (asStore) {
		const legacySources = listLegacyAuthProfileSources({ agentDir: effectiveAgentDir });
		const credentialSources = legacySources.filter((source) => source.kind !== "auth-state");
		if (credentialSources.length > 0) {
			const migrationError = new AuthProfileMigrationRequiredError({
				agentDir: effectiveAgentDir,
				sources: credentialSources
			});
			markAuthProfileMigrationRequired(effectiveAgentDir, migrationError);
			throw migrationError;
		}
		warnLegacyAuthProfileSourcesIgnored({
			agentDir: effectiveAgentDir,
			sources: legacySources
		});
		clearAuthProfileMigrationRequired(effectiveAgentDir);
		return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
			store: asStore,
			agentDir: effectiveAgentDir,
			options: effectiveOptions
		}).store);
	}
	if (inspectPersistedAuthProfileStoreRaw(effectiveAgentDir, effectiveOptions?.database).status !== "missing") throw new AuthProfileStoreUnreadableError(effectiveAgentDir);
	const legacySources = listLegacyAuthProfileSources({ agentDir: effectiveAgentDir });
	const credentialSources = legacySources.filter((source) => source.kind !== "auth-state");
	if (credentialSources.length > 0) throw new AuthProfileMigrationRequiredError({
		agentDir: effectiveAgentDir,
		sources: credentialSources
	});
	warnLegacyAuthProfileSourcesIgnored({
		agentDir: effectiveAgentDir,
		sources: legacySources
	});
	clearAuthProfileMigrationRequired(effectiveAgentDir);
	return markRuntimePersistedProfiles(maybeSyncPersistedExternalCliAuthProfiles({
		store: {
			version: 1,
			profiles: {}
		},
		agentDir: effectiveAgentDir,
		options: effectiveOptions
	}).store);
}
/** Loads the effective runtime store for an agent, including inherited main profiles. */
function loadAuthProfileStoreForRuntime(agentDir, options) {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
	const store = loadAuthProfileStoreForAgent(effectiveAgentDir, effectiveOptions);
	const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = effectiveOptions?.inheritedAuthDir ? resolveAuthProfileDatabasePath(effectiveOptions.inheritedAuthDir) : resolveSharedAuthStorePath();
	const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
	if (!effectiveAgentDir || authPath === mainAuthPath) return setRuntimeLocalProfileMetadata(overlayExternalAuthProfiles(store, {
		agentDir: effectiveAgentDir,
		...externalCli
	}), listRuntimeLocalProfileIds(store));
	const mainStore = loadAuthProfileStoreForAgent(effectiveOptions?.inheritedAuthDir, effectiveOptions);
	const mergedStore = mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true });
	return setRuntimeLocalProfileMetadata(overlayExternalAuthProfiles(mergedStore, {
		agentDir: effectiveAgentDir,
		...externalCli
	}), listRuntimeLocalProfileIds(store, mainStore), runtimeStoreInheritsMainState(mergedStore, store));
}
/** Load auth profiles for secret resolution without keychain prompts or writes. */
function loadAuthProfileStoreForSecretsRuntime(agentDir, options) {
	return loadAuthProfileStoreForRuntime(agentDir, {
		...options,
		readOnly: true,
		allowKeychainPrompt: false
	});
}
/** Load auth profiles with runtime external profiles removed from the result. */
function loadAuthProfileStoreWithoutExternalProfiles(agentDir, loadOptions) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const effectiveLoadOptions = resolveRuntimeAuthProfileLoadOptions(loadOptions);
	const options = {
		readOnly: true,
		allowKeychainPrompt: effectiveLoadOptions?.allowKeychainPrompt ?? false,
		...effectiveLoadOptions?.inheritedAuthDir ? { inheritedAuthDir: effectiveLoadOptions.inheritedAuthDir } : {}
	};
	const store = loadAuthProfileStoreForAgent(effectiveAgentDir, options);
	const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = options.inheritedAuthDir ? resolveAuthProfileDatabasePath(options.inheritedAuthDir) : resolveSharedAuthStorePath();
	if (!effectiveAgentDir || authPath === mainAuthPath) return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(store), listRuntimeLocalProfileIds(store));
	const mainStore = loadAuthProfileStoreForAgent(options.inheritedAuthDir, options);
	const mergedStore = mergeAuthProfileStores(mainStore, store, { preserveBaseRuntimeExternalProfiles: true });
	return setRuntimeLocalProfileMetadata(stripRuntimeExternalProfileMetadata(mergedStore), listRuntimeLocalProfileIds(store, mainStore), runtimeStoreInheritsMainState(mergedStore, store));
}
/** Ensure an auth store is available, including runtime/external profile overlays. */
function ensureAuthProfileStore(agentDir, options) {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options);
	const externalCli = resolveExternalCliOverlayOptions(effectiveOptions);
	const runtimeStore = resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions);
	const store = overlayExternalAuthProfiles(ensureAuthProfileStoreWithoutExternalProfiles(effectiveAgentDir, effectiveOptions), {
		agentDir: effectiveAgentDir,
		...externalCli
	});
	if (!runtimeStore) {
		if (hasScopedExternalCliOverlay(externalCli) && (store.runtimeExternalProfileIds?.length ?? 0) > 0) setRuntimeAuthProfileStoreSnapshot(store, effectiveAgentDir);
		return store;
	}
	if (hasScopedExternalCliOverlay(externalCli)) {
		const materialized = mergeRuntimeExternalProfileState({
			next: store,
			existing: runtimeStore
		});
		if (!isDeepStrictEqual(materialized, runtimeStore)) setRuntimeAuthProfileStoreSnapshot(materialized, effectiveAgentDir);
		return store;
	}
	return mergeRuntimeExternalProfileState({
		next: store,
		existing: runtimeStore
	});
}
/** Ensure an auth store is available without external profile overlays. */
function ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options) {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const effectiveOptions = resolveRuntimeAuthProfileLoadOptions(options) ?? { ...options };
	const runtimeStore = resolveRuntimeAuthProfileStore(effectiveAgentDir, effectiveOptions);
	if (runtimeStore) return buildAuthProfileStoreWithoutExternalProfiles({
		store: runtimeStore,
		agentDir: effectiveAgentDir,
		options: effectiveOptions
	});
	const store = loadAuthProfileStoreForAgent(effectiveAgentDir, effectiveOptions);
	const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = effectiveOptions.inheritedAuthDir ? resolveAuthProfileDatabasePath(effectiveOptions.inheritedAuthDir) : resolveSharedAuthStorePath();
	if (!effectiveAgentDir || authPath === mainAuthPath) return stripRuntimeExternalProfileMetadata(store);
	return stripRuntimeExternalProfileMetadata(mergeAuthProfileStores(loadAuthProfileStoreForAgent(effectiveOptions.inheritedAuthDir, effectiveOptions), store, { preserveBaseRuntimeExternalProfiles: true }));
}
/** Find a persisted credential in the scoped store, falling back to the main store. */
function findPersistedAuthProfileCredential(params) {
	if (isEnvOnlyAuthProfileRuntime()) return;
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	const requestedProfile = loadPersistedAuthProfileStore(agentDir)?.profiles[params.profileId];
	if (requestedProfile || !agentDir) return requestedProfile;
	const requestedPath = resolveAuthProfileDatabasePath(agentDir);
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	if (requestedPath === (mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath())) return requestedProfile;
	return loadPersistedAuthProfileStore(resolveRuntimeAuthProfileAgentDir())?.profiles[params.profileId];
}
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
function resolvePersistedAuthProfileOwnerAgentDir(params) {
	if (isEnvOnlyAuthProfileRuntime()) return;
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	if (!agentDir) return;
	const requestedStore = loadPersistedAuthProfileStore(agentDir);
	const requestedPath = resolveAuthProfileDatabasePath(agentDir);
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	if (requestedPath === (mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath())) return;
	const mainStore = loadPersistedAuthProfileStore(mainAgentDir);
	const requestedProfile = requestedStore?.profiles[params.profileId];
	if (requestedProfile) return shouldUseMainOwnerForLocalOAuthCredential({
		local: requestedProfile,
		main: mainStore?.profiles[params.profileId]
	}) ? void 0 : agentDir;
	return mainStore?.profiles[params.profileId] ? void 0 : agentDir;
}
/** Load the store shape used when applying local-only auth updates. */
function ensureAuthProfileStoreForLocalUpdate(agentDir) {
	if (isEnvOnlyAuthProfileRuntime()) return createEmptyAuthProfileStore();
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	const store = loadAuthProfileStoreForAgent(effectiveAgentDir, { syncExternalCli: false });
	const authPath = effectiveAgentDir ? resolveAuthProfileDatabasePath(effectiveAgentDir) : resolveSharedAuthStorePath();
	const mainAgentDir = resolveRuntimeAuthProfileAgentDir();
	const mainAuthPath = mainAgentDir ? resolveAuthProfileDatabasePath(mainAgentDir) : resolveSharedAuthStorePath();
	if (!effectiveAgentDir || authPath === mainAuthPath) return store;
	return mergeAuthProfileStores(loadAuthProfileStoreForAgent(void 0, {
		readOnly: true,
		syncExternalCli: false
	}), store, { preserveBaseRuntimeExternalProfiles: true });
}
/** Return the current runtime auth-profile snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshot(agentDir) {
	return getRuntimeAuthProfileStoreSnapshotCore(agentDir);
}
/** Return the lifecycle-published effective auth store without persisted fallback reads. */
function getPreparedRuntimeAuthProfileStoreSnapshot(agentDir, inheritedAuthDir) {
	return getPreparedRuntimeAuthProfileStoreSnapshotCore(agentDir, inheritedAuthDir);
}
/** Clear one runtime auth-profile snapshot. */
function clearRuntimeAuthProfileStoreSnapshot(agentDir) {
	return clearRuntimeAuthProfileStoreSnapshotCore(agentDir);
}
function saveAuthProfileStoreInTransaction(store, agentDir, options, database, publishFromSuppliedStore = false) {
	const savedAuthPath = agentDir ? resolveAuthProfileDatabasePath(agentDir) : database.path;
	const mainAuthPath = agentDir ? resolveSharedAuthStorePath() : database.path;
	const savesMainStore = savedAuthPath === mainAuthPath;
	const loadedPersistedStores = loadPersistedAuthProfileStores(agentDir, database);
	const persistedStores = {
		...loadedPersistedStores,
		localStore: loadedPersistedStores.localStore ?? {
			version: 1,
			profiles: {},
			...loadPersistedAuthProfileState(agentDir, database)
		}
	};
	const localStore = buildLocalAuthProfileStoreForSave({
		store,
		agentDir,
		options,
		persistedStores
	});
	const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
	const payload = preserveLegacyOAuthRefsOnSave({
		payload: buildPersistedAuthProfileSecretsStore(localStore),
		existingRaw
	});
	const existingProfiles = isRecord(existingRaw) && isRecord(existingRaw.profiles) ? existingRaw.profiles : {};
	const changedProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(existingProfiles), ...Object.keys(payload.profiles)])].filter((profileId) => !isDeepStrictEqual(existingProfiles[profileId], payload.profiles[profileId]));
	const profileSetChanged = changedProfileIds.some((profileId) => Object.hasOwn(existingProfiles, profileId) !== Object.hasOwn(payload.profiles, profileId));
	const credentialsChanged = !isDeepStrictEqual(existingRaw, payload);
	const statePayload = buildPersistedAuthProfileState(localStore);
	const stateChanged = !isDeepStrictEqual(readPersistedAuthProfileStateRaw(agentDir, database), statePayload);
	const suppliedRuntimeStore = publishFromSuppliedStore ? markRuntimePersistedProfiles(buildRuntimeAuthProfileStoreForSave({
		store,
		agentDir,
		options,
		persistedStores
	}), localStore) : void 0;
	if (credentialsChanged) writePersistedAuthProfileStoreRaw(payload, agentDir, database);
	if (stateChanged) writePersistedAuthProfileStateRaw(statePayload, agentDir, database);
	const publishRuntimeSnapshots = () => {
		const derivedSnapshots = savesMainStore ? listRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath !== mainAuthPath) : [];
		if (credentialsChanged || stateChanged) noteRuntimeAuthProfileStorePersistedMutation(agentDir, {
			credentialsChanged,
			profileSetChanged,
			stateChanged,
			profileIds: changedProfileIds
		});
		if (suppliedRuntimeStore) {
			const existing = getRuntimeAuthProfileStoreSnapshot(agentDir);
			if (existing) setRuntimeAuthProfileStoreSnapshot(mergeRuntimeExternalProfileReferences({
				next: preserveResolvedSecretBackedCredentials({
					next: suppliedRuntimeStore,
					existing
				}),
				existing
			}), agentDir);
			if (savesMainStore && (credentialsChanged || stateChanged)) for (const derived of derivedSnapshots) setRuntimeAuthProfileStoreSnapshotAtDatabasePath(mergeRuntimeExternalProfileReferences({
				next: preserveResolvedSecretBackedCredentials({
					next: loadAuthProfileStoreWithoutExternalProfiles(derived.agentDir),
					existing: derived.store
				}),
				existing: derived.store
			}), derived.databasePath, derived.agentDir);
			return;
		}
		refreshRuntimeAuthProfileStoreSnapshot(agentDir);
		for (const derived of derivedSnapshots) setRuntimeAuthProfileStoreSnapshotAtDatabasePath(mergeRuntimeExternalProfileReferences({
			next: preserveResolvedSecretBackedCredentials({
				next: loadAuthProfileStoreWithoutExternalProfiles(derived.agentDir),
				existing: derived.store
			}),
			existing: derived.store
		}), derived.databasePath, derived.agentDir);
	};
	return publishRuntimeSnapshots;
}
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
function saveAuthProfileStore(store, agentDir, options, database) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	if (database) {
		const publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(store, effectiveAgentDir, options, database, true);
		const publishAfterCommit = () => {
			publishRuntimeSnapshotsAfterCommit(publishRuntimeSnapshots);
		};
		if (!deferAuthProfilePostCommitPublication(database, publishAfterCommit)) publishAfterCommit();
		return;
	}
	let publishRuntimeSnapshots;
	runAuthProfileWriteTransaction(effectiveAgentDir, (transactionDatabase) => {
		publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(store, effectiveAgentDir, options, transactionDatabase);
	});
	publishRuntimeSnapshotsAfterCommit(publishRuntimeSnapshots);
}
function captureRuntimeAuthProfileStorePersistenceSnapshot(agentDir, canonicalDatabasePath) {
	const capturedAuthPath = canonicalDatabasePath ?? (agentDir ? resolveAuthProfileDatabasePath(agentDir) : resolveSharedAuthStorePath());
	const mainAuthPath = agentDir === void 0 && canonicalDatabasePath ? canonicalDatabasePath : resolveSharedAuthStorePath();
	return {
		runtimeCaptured: true,
		runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(capturedAuthPath),
		runtimeStore: getRuntimeAuthProfileStoreSnapshot(agentDir),
		derivedRuntimeStores: capturedAuthPath === mainAuthPath ? listRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath !== mainAuthPath).map(({ agentDir: derivedAgentDir, databasePath, store }) => ({
			databasePath,
			agentDir: derivedAgentDir,
			store,
			runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath)
		})) : []
	};
}
function recordRuntimeAuthProfileStoreOwnership(owned, runtime) {
	owned.runtimeCaptured = runtime.runtimeCaptured;
	if (runtime.runtimeRevision !== void 0) owned.runtimeRevision = runtime.runtimeRevision;
	if (runtime.runtimeStore !== void 0) owned.runtimeStore = runtime.runtimeStore;
	if (runtime.derivedRuntimeStores !== void 0) owned.derivedRuntimeStores = runtime.derivedRuntimeStores;
}
function recordRuntimeAuthProfileStorePublicationEdge(owned, runtime) {
	if (runtime.runtimeRevision !== void 0) owned.runtimeRevisionBeforePublication = runtime.runtimeRevision;
	if (runtime.derivedRuntimeStores !== void 0) owned.derivedRuntimeRevisionsBeforePublication = runtime.derivedRuntimeStores.flatMap((entry) => typeof entry.runtimeRevision === "number" ? [{
		databasePath: entry.databasePath,
		agentDir: entry.agentDir,
		runtimeRevision: entry.runtimeRevision
	}] : []);
}
function replaceRuntimeAuthProfileStoreSnapshot(store, agentDir, databasePath) {
	if (store) {
		setRuntimeAuthProfileStoreSnapshotAtDatabasePath(store, databasePath, agentDir);
		return;
	}
	replaceRuntimeAuthProfileStoreSnapshots(listRuntimeAuthProfileStoreSnapshots().filter((entry) => entry.databasePath !== databasePath));
}
function refreshRuntimeAuthProfileStoreSnapshot(agentDir) {
	const existing = getRuntimeAuthProfileStoreSnapshot(agentDir);
	if (!existing) return;
	rebuildRuntimeAuthProfileStoreSnapshot(agentDir, existing);
}
function rebuildRuntimeAuthProfileStoreSnapshot(agentDir, existing, predecessor, databasePath) {
	const currentMaterialized = preserveResolvedSecretBackedCredentials({
		next: loadAuthProfileStoreWithoutExternalProfiles(agentDir),
		existing
	});
	const rebuilt = mergeRuntimeExternalProfileReferences({
		next: predecessor ? preserveResolvedSecretBackedCredentials({
			next: currentMaterialized,
			existing: predecessor
		}) : currentMaterialized,
		existing
	});
	if (databasePath) setRuntimeAuthProfileStoreSnapshotAtDatabasePath(rebuilt, databasePath, agentDir);
	else setRuntimeAuthProfileStoreSnapshot(rebuilt, agentDir);
}
/** Capture both persisted auth rows under one database lock. */
function captureAuthProfileStorePersistenceSnapshot(agentDir, options = {}) {
	const effectiveAgentDir = resolveRuntimeAuthProfileAgentDir(agentDir);
	return runAuthProfileWriteTransaction(effectiveAgentDir, (database) => {
		return {
			credentialsRaw: readPersistedAuthProfileStoreRaw(effectiveAgentDir, database),
			stateRaw: readPersistedAuthProfileStateRaw(effectiveAgentDir, database),
			...captureRuntimeAuthProfileStorePersistenceSnapshot(effectiveAgentDir, database.path)
		};
	}, options);
}
/**
* Commit only while both persisted auth rows still match the captured baseline.
* The caller claims `owned` before publishing because publication is fallible.
*/
function saveAuthProfileStoreIfPersistenceSnapshotMatches(params) {
	const agentDir = resolveRuntimeAuthProfileAgentDir(params.agentDir);
	let publishRuntimeSnapshots;
	const owned = {
		credentialsRaw: null,
		stateRaw: null,
		runtimeCaptured: false
	};
	runAuthProfileWriteTransaction(agentDir, (database) => {
		const currentCredentials = readPersistedAuthProfileStoreRaw(agentDir, database);
		const currentState = readPersistedAuthProfileStateRaw(agentDir, database);
		if (!isDeepStrictEqual(currentCredentials, params.snapshot.credentialsRaw) || !isDeepStrictEqual(currentState, params.snapshot.stateRaw)) throw new Error("auth profile store changed after secrets apply captured it");
		const runtimeAtSaveEdge = captureRuntimeAuthProfileStorePersistenceSnapshot(agentDir, database.path);
		owned.runtimeRevisionAtSaveEdge = runtimeAtSaveEdge.runtimeRevision;
		owned.derivedRuntimeRevisionsAtSaveEdge = runtimeAtSaveEdge.derivedRuntimeStores?.flatMap((entry) => typeof entry.runtimeRevision === "number" ? [{
			databasePath: entry.databasePath,
			agentDir: entry.agentDir,
			runtimeRevision: entry.runtimeRevision
		}] : []);
		publishRuntimeSnapshots = saveAuthProfileStoreInTransaction(params.store, agentDir, params.options, database);
		owned.credentialsRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
		owned.stateRaw = readPersistedAuthProfileStateRaw(agentDir, database);
	}, params.stateDir ? { stateDir: params.stateDir } : {});
	return {
		owned,
		publishRuntimeSnapshots: () => publishRuntimeSnapshotsAfterCommit(() => {
			recordRuntimeAuthProfileStorePublicationEdge(owned, captureRuntimeAuthProfileStorePersistenceSnapshot(agentDir, params.stateDir && agentDir === void 0 ? resolveSharedAuthStorePath({
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			}) : void 0));
			publishRuntimeSnapshots?.();
			recordRuntimeAuthProfileStoreOwnership(owned, captureRuntimeAuthProfileStorePersistenceSnapshot(params.agentDir, params.stateDir && params.agentDir === void 0 ? resolveSharedAuthStorePath({
				...process.env,
				OPENCLAW_STATE_DIR: params.stateDir
			}) : void 0));
		})
	};
}
function reconcileRuntimeAuthProfileStorePersistenceSnapshot(params) {
	if (!params.snapshot.runtimeCaptured || !params.owned.runtimeCaptured) return;
	const rowsFullyOwned = params.credentialsOwned && params.stateOwned;
	const rowsRestored = params.credentialsRestored || params.stateRestored;
	const reconcileOne = (databasePath, agentDir, snapshotStore, snapshotRuntimeRevision, runtimeRevisionAtSaveEdge, runtimeRevisionBeforePublication, ownedStore, ownedRuntimeRevision, currentStore, currentRuntimeRevision) => {
		if (rowsFullyOwned && typeof snapshotRuntimeRevision === "number" && typeof runtimeRevisionAtSaveEdge === "number" && typeof runtimeRevisionBeforePublication === "number" && typeof ownedRuntimeRevision === "number" && snapshotRuntimeRevision === runtimeRevisionAtSaveEdge && runtimeRevisionAtSaveEdge === runtimeRevisionBeforePublication && currentRuntimeRevision === ownedRuntimeRevision && isDeepStrictEqual(currentStore, ownedStore)) replaceRuntimeAuthProfileStoreSnapshot(snapshotStore, agentDir, databasePath);
		else if (rowsRestored && currentStore) rebuildRuntimeAuthProfileStoreSnapshot(agentDir, currentStore, snapshotStore, databasePath);
	};
	const restoredAuthPath = params.agentDir ? resolveAuthProfileDatabasePath(params.agentDir) : resolveSharedAuthStorePath();
	const mainAuthPath = resolveSharedAuthStorePath();
	const currentRuntimeStores = new Map(params.currentRuntimeStores.map((entry) => [entry.databasePath, entry]));
	reconcileOne(restoredAuthPath, params.agentDir, params.snapshot.runtimeStore, params.snapshot.runtimeRevision, params.owned.runtimeRevisionAtSaveEdge, params.owned.runtimeRevisionBeforePublication, params.owned.runtimeStore, params.owned.runtimeRevision, currentRuntimeStores.get(restoredAuthPath)?.store, params.currentRuntimeRevision);
	if (restoredAuthPath !== mainAuthPath) return;
	const snapshotDerived = new Map((params.snapshot.derivedRuntimeStores ?? []).map((entry) => [entry.databasePath, entry]));
	const ownedDerived = new Map((params.owned.derivedRuntimeStores ?? []).map((entry) => [entry.databasePath, entry]));
	const saveEdgeDerivedRevisions = new Map((params.owned.derivedRuntimeRevisionsAtSaveEdge ?? []).map((entry) => [entry.databasePath, entry.runtimeRevision]));
	const publicationEdgeDerivedRevisions = new Map((params.owned.derivedRuntimeRevisionsBeforePublication ?? []).map((entry) => [entry.databasePath, entry.runtimeRevision]));
	for (const [pathname, currentEntry] of currentRuntimeStores) {
		if (pathname === mainAuthPath) continue;
		const snapshotEntry = snapshotDerived.get(pathname);
		const ownedEntry = ownedDerived.get(pathname);
		reconcileOne(pathname, currentEntry.agentDir, snapshotEntry?.store, snapshotEntry?.runtimeRevision, saveEdgeDerivedRevisions.get(pathname), publicationEdgeDerivedRevisions.get(pathname), ownedEntry?.store, ownedEntry?.runtimeRevision, currentEntry.store, currentEntry.runtimeRevision);
	}
}
/** Restore each persisted row and runtime snapshot only while apply still owns it. */
function restoreAuthProfileStorePersistenceSnapshot(snapshot, owned, agentDir, options = {}) {
	let credentialsOwned = false;
	let stateOwned = false;
	let credentialsRestored = false;
	let stateRestored = false;
	let publishRuntimeSnapshots;
	runAuthProfileWriteTransaction(agentDir, (database) => {
		const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
		const existingState = readPersistedAuthProfileStateRaw(agentDir, database);
		credentialsOwned = isDeepStrictEqual(existingRaw, owned.credentialsRaw);
		stateOwned = isDeepStrictEqual(existingState, owned.stateRaw);
		const beforeProfiles = isRecord(existingRaw) && isRecord(existingRaw.profiles) ? existingRaw.profiles : {};
		const restoredProfiles = isRecord(snapshot.credentialsRaw) && isRecord(snapshot.credentialsRaw.profiles) ? snapshot.credentialsRaw.profiles : {};
		const changedProfileIds = [.../* @__PURE__ */ new Set([...Object.keys(beforeProfiles), ...Object.keys(restoredProfiles)])].filter((profileId) => !isDeepStrictEqual(beforeProfiles[profileId], restoredProfiles[profileId]));
		const profileSetChanged = changedProfileIds.some((profileId) => Object.hasOwn(beforeProfiles, profileId) !== Object.hasOwn(restoredProfiles, profileId));
		credentialsRestored = credentialsOwned && !isDeepStrictEqual(existingRaw, snapshot.credentialsRaw);
		stateRestored = stateOwned && !isDeepStrictEqual(existingState, snapshot.stateRaw);
		if (credentialsRestored) if (snapshot.credentialsRaw === null) deletePersistedAuthProfileStoreRaw(agentDir, database);
		else writePersistedAuthProfileStoreRaw(snapshot.credentialsRaw, agentDir, database);
		if (stateRestored) writePersistedAuthProfileStateRaw(snapshot.stateRaw, agentDir, database);
		publishRuntimeSnapshots = () => {
			const currentRuntimeStores = listRuntimeAuthProfileStoreSnapshots().map(({ agentDir: runtimeAgentDir, databasePath, store }) => ({
				databasePath,
				agentDir: runtimeAgentDir,
				store,
				runtimeRevision: getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(databasePath)
			}));
			const currentRuntimeRevision = getRuntimeAuthProfileStoreSnapshotRevisionAtDatabasePath(agentDir ? resolveAuthProfileDatabasePath(agentDir) : database.path);
			if (credentialsRestored || stateRestored) noteRuntimeAuthProfileStorePersistedMutation(agentDir, {
				credentialsChanged: credentialsRestored,
				profileSetChanged: credentialsRestored && profileSetChanged,
				stateChanged: stateRestored,
				profileIds: credentialsRestored ? changedProfileIds : []
			});
			reconcileRuntimeAuthProfileStorePersistenceSnapshot({
				snapshot,
				owned,
				agentDir,
				credentialsOwned,
				stateOwned,
				credentialsRestored,
				stateRestored,
				currentRuntimeStores,
				currentRuntimeRevision
			});
		};
	}, options);
	publishRuntimeSnapshotsAfterCommit(publishRuntimeSnapshots);
}
//#endregion
export { isInheritedMainOAuthCredentialFromStores as C, withEnvOnlyAuthProfileStore as S, restoreAuthProfileStorePersistenceSnapshot as _, ensureAuthProfileStoreWithoutExternalProfiles as a, updateAuthProfileStoreWithLock as b, getRuntimeAuthProfileStoreSnapshot as c, loadAuthProfileStoreForRuntime as d, loadAuthProfileStoreForSecretsRuntime as f, resolveRuntimeAuthProfileAgentDir as g, resolvePersistedAuthProfileOwnerAgentDir as h, ensureAuthProfileStoreForLocalUpdate as i, isInheritedMainOAuthCredential as l, preserveResolvedSecretBackedCredentials as m, clearRuntimeAuthProfileStoreSnapshot as n, findPersistedAuthProfileCredential as o, loadAuthProfileStoreWithoutExternalProfiles as p, ensureAuthProfileStore as r, getPreparedRuntimeAuthProfileStoreSnapshot as s, captureAuthProfileStorePersistenceSnapshot as t, loadAuthProfileStore as u, saveAuthProfileStore as v, withAuthProfileStoreAgentDir as x, saveAuthProfileStoreIfPersistenceSnapshotMatches as y };
