import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { s as coerceSecretRef } from "./types.secrets-Bre8L6Ts.js";
import { f as secretRefKey } from "./ref-contract-BHWY70rN.js";
import { r as copyConfigResolutionFactsExcept, t as cloneConfigWithResolutionFacts } from "./resolution-facts-DIK_QG79.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-Cv5MaU8U.js";
import { c as markAuthProfileMigrationRequired, i as clearAuthProfileMigrationDiagnostics, t as AuthProfileMigrationRequiredError } from "./legacy-source-diagnostic-SYdrQUmo.js";
import { f as loadAuthProfileStoreForSecretsRuntime, p as loadAuthProfileStoreWithoutExternalProfiles } from "./store-C6iqqcJy.js";
import { a as getRuntimeAuthProfileStoreCredentialsRevision, n as clearRuntimeAuthProfileStoreSnapshots } from "./runtime-snapshots-a_60jBeK.js";
import "./auth-profiles-wr_j3m1O.js";
import { t as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-D4vwqky1.js";
import { n as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-web-tools-state-B2O6toZJ.js";
import { _ as registerSecretsRuntimeStateClearHook, b as setPreparedSecretsRuntimeSnapshotRefreshContext, c as getActiveSecretsRuntimeSnapshotRevisionState, d as getPreparedSecretsRuntimeSnapshotRefreshContext, l as getActiveSecretsRuntimeSnapshotState, n as activateSecretsRuntimeSnapshotStateIfCurrent, o as getActiveSecretsRuntimeEnvState, r as clearSecretsRuntimeSnapshotState, s as getActiveSecretsRuntimeRefreshContext, t as activateSecretsRuntimeSnapshotState, u as getLiveSecretsRuntimeAuthStores, v as restoreSecretsRuntimeSnapshotStateIfCurrent } from "./runtime-state-B9BywrOx.js";
import { a as collectCandidateAgentDirs, i as canUseSecretsRuntimeFastPath, l as resolveRefreshAgentDirs, n as clearProviderAuthRuntimeSnapshotActivation, o as createEmptyRuntimeWebToolsMetadata, s as mergeSecretsRuntimeEnv, t as activateProviderAuthRuntimeSnapshot } from "./runtime-provider-auth-activation-BpfP_TZR.js";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/runtime-provider-auth-warnings.ts
function isProviderAuthRuntimeWarning(warning) {
	return warning.path.startsWith("models.providers.") || warning.path.includes(".auth-profiles.");
}
function mergeProviderAuthRuntimeWarnings(activeWarnings, candidateWarnings) {
	return [...activeWarnings.filter((warning) => !isProviderAuthRuntimeWarning(warning)), ...candidateWarnings.filter(isProviderAuthRuntimeWarning)];
}
//#endregion
//#region src/secrets/runtime.ts
/** Prepares secrets runtime snapshots from config, auth stores, plugins, and env. */
registerSecretsRuntimeStateClearHook(clearRuntimeAuthProfileStoreSnapshots);
registerSecretsRuntimeStateClearHook(clearAuthProfileMigrationDiagnostics);
registerSecretsRuntimeStateClearHook(clearProviderAuthRuntimeSnapshotActivation);
const loadRuntimeManifestHelpers = createLazyRuntimeModule(() => import("./runtime-manifest.runtime.js"));
const loadRuntimePrepareHelpers = createLazyRuntimeModule(() => import("./runtime-prepare.runtime.js"));
const loadRuntimeOwnerAssignmentHelpers = createLazyRuntimeModule(() => import("./runtime-owner-assignments-D3JSrhy4.js"));
async function resolveLoadablePluginOrigins(params) {
	const { listPluginOriginsFromMetadataSnapshot } = await loadRuntimeManifestHelpers();
	return listPluginOriginsFromMetadataSnapshot(params.plugins);
}
function hasConfiguredPluginEntries(config) {
	const entries = config.plugins?.entries;
	return Boolean(entries) && typeof entries === "object" && !Array.isArray(entries) && Object.keys(entries).length > 0;
}
function hasConfiguredChannelEntries(config) {
	const channels = config.channels;
	return Boolean(channels) && typeof channels === "object" && !Array.isArray(channels) && Object.keys(channels).some((channelId) => channelId !== "defaults");
}
function hasConfiguredPluginIntegrationSecretProviders(config) {
	const providers = config.secrets?.providers;
	if (!providers || typeof providers !== "object" || Array.isArray(providers)) return false;
	return Object.values(providers).some((provider) => provider?.source === "exec" && "pluginIntegration" in provider && provider.pluginIntegration !== void 0);
}
function shouldLoadPluginMetadataForSecrets(config) {
	return hasConfiguredPluginEntries(config) || hasConfiguredChannelEntries(config) || hasConfiguredPluginIntegrationSecretProviders(config);
}
function loadAuthStoresWithMigrationIsolation(params) {
	const authStores = [];
	const degradedOwners = [];
	for (const agentDir of params.agentDirs) try {
		authStores.push({
			agentDir,
			store: structuredClone(params.loadAuthStore(agentDir))
		});
	} catch (error) {
		if (!(error instanceof AuthProfileMigrationRequiredError) || !params.allowUnavailable) throw error;
		markAuthProfileMigrationRequired(agentDir, error);
		authStores.push({
			agentDir,
			store: {
				version: 1,
				profiles: {}
			}
		});
		degradedOwners.push({
			ownerKind: "route",
			ownerId: error.ownerId,
			state: "unavailable",
			degradationState: "cold",
			paths: error.sourceKinds.map((kind) => `auth-profile-legacy:${kind}`),
			refKeys: [],
			reason: "auth profile migration required"
		});
	}
	return {
		authStores,
		degradedOwners
	};
}
/** Prepares a secrets runtime snapshot and records refresh context for later activation. */
async function prepareSecretsRuntimeSnapshot(params) {
	const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
	const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
	const sourceConfig = cloneConfigWithResolutionFacts(params.config);
	const assignmentSourceConfig = cloneConfigWithResolutionFacts(params.assignmentConfig ?? params.config);
	const resolvedConfig = cloneConfigWithResolutionFacts(assignmentSourceConfig);
	const includeConfigRefs = params.includeConfigRefs ?? true;
	const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
	let authStores = [];
	const fastPathLoadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreWithoutExternalProfiles;
	const candidateDirs = params.agentDirs?.length ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, runtimeEnv))) : collectCandidateAgentDirs(resolvedConfig, runtimeEnv);
	let migrationDegradedOwners = [];
	if (includeAuthStoreRefs) {
		const loaded = loadAuthStoresWithMigrationIsolation({
			agentDirs: candidateDirs,
			loadAuthStore: fastPathLoadAuthStore,
			allowUnavailable: params.allowUnavailableSecretOwners === true
		});
		authStores = loaded.authStores;
		migrationDegradedOwners = loaded.degradedOwners;
	}
	if (canUseSecretsRuntimeFastPath({
		sourceConfig: includeConfigRefs ? assignmentSourceConfig : {},
		authStores
	})) {
		const manifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
		const snapshot = {
			sourceConfig,
			config: resolvedConfig,
			authStores,
			authStoreCredentialsRevision,
			warnings: [],
			degradedOwners: migrationDegradedOwners,
			secretOwners: [],
			webTools: createEmptyRuntimeWebToolsMetadata()
		};
		setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
			env: runtimeEnv,
			explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
			includeConfigRefs,
			includeAuthStoreRefs,
			loadAuthStore: fastPathLoadAuthStore,
			loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
			...manifestRegistry ? { manifestRegistry } : {}
		});
		return snapshot;
	}
	const { collectAuthStoreAssignments, collectConfigAssignments, createResolverContext, resolveRuntimeWebTools } = await loadRuntimePrepareHelpers();
	const { listSecretAssignmentOwners, resolveAndApplySecretAssignments } = await loadRuntimeOwnerAssignmentHelpers();
	let manifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
	if (!manifestRegistry && shouldLoadPluginMetadataForSecrets(sourceConfig)) {
		const { resolveConfigWidePluginManifestRegistry } = await loadRuntimeManifestHelpers();
		manifestRegistry = resolveConfigWidePluginManifestRegistry({
			config: sourceConfig,
			env: runtimeEnv
		});
	}
	const loadablePluginOrigins = params.loadablePluginOrigins ?? (manifestRegistry ? await resolveLoadablePluginOrigins({ plugins: manifestRegistry }) : /* @__PURE__ */ new Map());
	const context = createResolverContext({
		sourceConfig,
		env: runtimeEnv,
		...manifestRegistry ? { manifestRegistry } : {}
	});
	if (includeConfigRefs) collectConfigAssignments({
		config: resolvedConfig,
		context,
		loadablePluginOrigins
	});
	if (includeAuthStoreRefs) {
		const loadAuthStore = params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime;
		if (!params.loadAuthStore) {
			const loaded = loadAuthStoresWithMigrationIsolation({
				agentDirs: candidateDirs,
				loadAuthStore,
				allowUnavailable: params.allowUnavailableSecretOwners === true
			});
			authStores = loaded.authStores;
			migrationDegradedOwners = loaded.degradedOwners;
		}
		for (const entry of authStores) collectAuthStoreAssignments({
			store: entry.store,
			context,
			agentDir: entry.agentDir
		});
	}
	const assignmentResolution = context.assignments.length > 0 ? await resolveAndApplySecretAssignments({
		assignments: context.assignments,
		context,
		allowOwnerIsolation: params.allowUnavailableSecretOwners,
		options: {
			config: sourceConfig,
			env: context.env,
			cache: context.cache,
			manifestRegistry: context.manifestRegistry
		},
		forceColdRefKeys: params.forceColdRefKeys
	}) : {
		degradedOwners: [],
		resolvedValues: /* @__PURE__ */ new Map()
	};
	copyConfigResolutionFactsExcept(assignmentSourceConfig, resolvedConfig, context.assignments.filter((assignment) => assignmentResolution.resolvedValues.has(secretRefKey(assignment.ref))).map((assignment) => assignment.path));
	const assignmentSecretOwners = listSecretAssignmentOwners(context.assignments, assignmentResolution.resolvedValues);
	const webTools = includeConfigRefs ? await resolveRuntimeWebTools({
		sourceConfig,
		resolvedConfig,
		context,
		allowUnavailableSecretOwners: params.allowUnavailableSecretOwners,
		forceColdRefKeys: params.forceColdRefKeys
	}) : {
		metadata: createEmptyRuntimeWebToolsMetadata(),
		degradedOwners: [],
		secretOwners: []
	};
	const snapshot = {
		sourceConfig,
		config: resolvedConfig,
		authStores,
		authStoreCredentialsRevision,
		warnings: context.warnings,
		degradedOwners: [
			...migrationDegradedOwners,
			...assignmentResolution.degradedOwners,
			...webTools.degradedOwners
		],
		secretOwners: [...assignmentSecretOwners, ...webTools.secretOwners],
		webTools: webTools.metadata
	};
	setPreparedSecretsRuntimeSnapshotRefreshContext(snapshot, {
		env: runtimeEnv,
		explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
		includeConfigRefs,
		includeAuthStoreRefs,
		loadAuthStore: params.loadAuthStore ?? loadAuthProfileStoreForSecretsRuntime,
		loadablePluginOrigins,
		...manifestRegistry ? { manifestRegistry } : {}
	});
	return snapshot;
}
/** Activates a prepared secrets runtime snapshot for fast runtime lookup. */
function activateSecretsRuntimeSnapshot(snapshot) {
	activateSecretsRuntimeSnapshotState(createSecretsRuntimeSnapshotActivation(snapshot));
}
/** Activates resolved runtime bytes while retaining the distinct raw config source. */
function activateSecretsRuntimeSnapshotWithSource(snapshot, runtimeSourceConfig) {
	activateSecretsRuntimeSnapshotState({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		runtimeSourceConfig
	});
}
/** Compare-and-activate boundary for snapshots prepared from process-wide runtime state. */
function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
	return activateSecretsRuntimeSnapshotStateIfCurrent({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		expectedRevision,
		preserveActivationLineage: options?.preserveActivationLineage,
		runtimeSourceConfig: options?.runtimeSourceConfig
	});
}
/** Restores an owned predecessor while retaining changes after candidate preparation. */
function restoreSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, ownedSnapshot, options) {
	return restoreSecretsRuntimeSnapshotStateIfCurrent({
		...createSecretsRuntimeSnapshotActivation(snapshot),
		expectedRevision,
		ownedSnapshot,
		runtimeSourceConfig: options?.runtimeSourceConfig
	});
}
function coercePreflightRefresh(value, sourceConfig) {
	if (!value || typeof value !== "object") return null;
	const candidate = value;
	return candidate.snapshot && typeof candidate.expectedRevision === "number" && isDeepStrictEqual(candidate.snapshot.sourceConfig, sourceConfig) ? candidate : null;
}
async function prepareActiveSecretsRuntimeRefresh(sourceConfig, includeAuthStoreRefs, snapshotConfig = sourceConfig) {
	const expectedRevision = getActiveSecretsRuntimeSnapshotRevisionState();
	const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
	if (!getActiveSecretsRuntimeSnapshotState() || !activeRefreshContext) return null;
	return {
		snapshot: await prepareSecretsRuntimeSnapshot({
			config: sourceConfig,
			assignmentConfig: snapshotConfig,
			env: activeRefreshContext.env,
			agentDirs: resolveRefreshAgentDirs(sourceConfig, activeRefreshContext),
			includeConfigRefs: activeRefreshContext.includeConfigRefs ?? true,
			includeAuthStoreRefs: includeAuthStoreRefs ?? activeRefreshContext.includeAuthStoreRefs,
			loadablePluginOrigins: activeRefreshContext.loadablePluginOrigins,
			...activeRefreshContext.manifestRegistry ? { manifestRegistry: activeRefreshContext.manifestRegistry } : {},
			...activeRefreshContext.loadAuthStore ? { loadAuthStore: activeRefreshContext.loadAuthStore } : {},
			allowUnavailableSecretOwners: true
		}),
		expectedRevision
	};
}
/** Prepares a config-write refresh candidate tied to the current runtime revision. */
async function preflightActiveSecretsRuntimeSnapshotRefresh(params) {
	return await prepareActiveSecretsRuntimeRefresh(params.sourceConfig, params.includeAuthStoreRefs);
}
/** Publishes a config-write refresh after retrying any candidate invalidated while preparing. */
async function refreshActiveSecretsRuntimeSnapshotForConfig(params) {
	let candidate = coercePreflightRefresh(params.preflightResult, params.sourceConfig);
	for (;;) {
		candidate ??= await prepareActiveSecretsRuntimeRefresh(params.sourceConfig, params.includeAuthStoreRefs);
		if (!candidate) return false;
		const activeRefreshContext = getActiveSecretsRuntimeRefreshContext();
		if (!activeRefreshContext) return false;
		if (params.includeAuthStoreRefs === false && activeRefreshContext.includeAuthStoreRefs) {
			candidate.snapshot.authStores = getLiveSecretsRuntimeAuthStores();
			candidate.snapshot.authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
			setPreparedSecretsRuntimeSnapshotRefreshContext(candidate.snapshot, activeRefreshContext);
		}
		if (activateSecretsRuntimeSnapshotIfCurrent(candidate.snapshot, candidate.expectedRevision)) return true;
		candidate = null;
	}
}
function patchResolvedSecretRefLeaves(params) {
	if (coerceSecretRef(params.source, params.defaults)) return isDeepStrictEqual(params.source, params.resolved) ? {
		changed: false,
		value: params.current
	} : {
		changed: true,
		value: params.resolved
	};
	if (Array.isArray(params.source) && Array.isArray(params.resolved)) {
		const next = Array.isArray(params.current) ? [...params.current] : structuredClone(params.resolved);
		let changed = false;
		for (const [index, source] of params.source.entries()) {
			const patch = patchResolvedSecretRefLeaves({
				current: next[index],
				source,
				resolved: params.resolved[index],
				defaults: params.defaults
			});
			if (patch.changed) {
				next[index] = patch.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : params.current
		};
	}
	if (isRecord(params.source) && isRecord(params.resolved)) {
		const next = isRecord(params.current) ? { ...params.current } : structuredClone(params.resolved);
		let changed = false;
		for (const [key, source] of Object.entries(params.source)) {
			const patch = patchResolvedSecretRefLeaves({
				current: next[key],
				source,
				resolved: params.resolved[key],
				defaults: params.defaults
			});
			if (patch.changed) {
				next[key] = patch.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : params.current
		};
	}
	return {
		changed: false,
		value: params.current
	};
}
function selectProviderAuthConfig(config) {
	return {
		...config.secrets === void 0 ? {} : { secrets: config.secrets },
		...config.models === void 0 ? {} : { models: config.models }
	};
}
function listAuthProfileSecretOwnerIds(authStores) {
	return new Set(authStores.flatMap(({ agentDir, store }) => Object.keys(store.profiles).map((profileId) => resolveAuthProfileSecretOwnerId({
		agentDir,
		profileId
	}))));
}
function mergeProviderAuthSecretOwners(active, candidate) {
	const activeAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(active.authStores);
	const candidateAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(candidate.authStores);
	const isActiveProviderAuthOwner = (owner) => owner.ownerKind === "provider" || owner.ownerKind === "account" && activeAuthProfileOwnerIds.has(owner.ownerId);
	const isCandidateProviderAuthOwner = (owner) => owner.ownerKind === "provider" || owner.ownerKind === "account" && candidateAuthProfileOwnerIds.has(owner.ownerId);
	return [...(active.secretOwners ?? []).filter((owner) => !isActiveProviderAuthOwner(owner)), ...(candidate.secretOwners ?? []).filter(isCandidateProviderAuthOwner)];
}
function mergeProviderAuthDegradedOwners(active, candidate) {
	const activeAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(active.authStores);
	const candidateAuthProfileOwnerIds = listAuthProfileSecretOwnerIds(candidate.authStores);
	const isProviderAuthOwner = (owner) => owner.ownerKind === "provider" || owner.ownerKind === "account" && activeAuthProfileOwnerIds.has(owner.ownerId);
	return [...(active.degradedOwners ?? []).filter((owner) => !isProviderAuthOwner(owner)), ...(candidate.degradedOwners ?? []).filter((owner) => owner.ownerKind === "provider" || owner.ownerKind === "account" && candidateAuthProfileOwnerIds.has(owner.ownerId))];
}
function createSecretsRuntimeSnapshotActivation(snapshot) {
	return {
		snapshot,
		refreshContext: getPreparedSecretsRuntimeSnapshotRefreshContext(snapshot) ?? getActiveSecretsRuntimeRefreshContext() ?? {
			env: { ...process.env },
			explicitAgentDirs: null,
			includeAuthStoreRefs: snapshot.authStores.length > 0,
			loadAuthStore: loadAuthProfileStoreForSecretsRuntime,
			loadablePluginOrigins: /* @__PURE__ */ new Map()
		},
		refreshHandler: {
			preflight: preflightActiveSecretsRuntimeSnapshotRefresh,
			refresh: refreshActiveSecretsRuntimeSnapshotForConfig
		}
	};
}
/** Refresh provider credentials without republishing transport-owned config. */
async function refreshActiveProviderAuthRuntimeSnapshot() {
	for (;;) {
		const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
		if (!activeSnapshot) return false;
		const providerAuthConfig = selectProviderAuthConfig(activeSnapshot.sourceConfig);
		const candidate = await prepareActiveSecretsRuntimeRefresh(activeSnapshot.sourceConfig, void 0, providerAuthConfig);
		if (!candidate) return false;
		const runtimeConfig = getRuntimeConfigSnapshot();
		const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
		const runtimeMetadata = getRuntimeConfigSnapshotMetadata();
		if (!runtimeConfig || !runtimeSourceConfig || !runtimeMetadata) return false;
		const config = cloneConfigWithResolutionFacts(runtimeConfig);
		const modelsPatch = patchResolvedSecretRefLeaves({
			current: runtimeConfig.models,
			source: providerAuthConfig.models,
			resolved: candidate.snapshot.config.models,
			defaults: activeSnapshot.sourceConfig.secrets?.defaults
		});
		if (modelsPatch.changed) config.models = modelsPatch.value;
		const refreshedSnapshot = {
			...activeSnapshot,
			config,
			authStores: candidate.snapshot.authStores,
			authStoreCredentialsRevision: candidate.snapshot.authStoreCredentialsRevision,
			warnings: mergeProviderAuthRuntimeWarnings(activeSnapshot.warnings, candidate.snapshot.warnings),
			degradedOwners: mergeProviderAuthDegradedOwners(activeSnapshot, candidate.snapshot),
			secretOwners: mergeProviderAuthSecretOwners(activeSnapshot, candidate.snapshot)
		};
		const activateSnapshotIfCurrent = () => {
			if (getRuntimeConfigSnapshotMetadata()?.revision !== runtimeMetadata.revision) return false;
			return activateSecretsRuntimeSnapshotIfCurrent(refreshedSnapshot, candidate.expectedRevision, {
				preserveActivationLineage: true,
				runtimeSourceConfig
			});
		};
		if (await activateProviderAuthRuntimeSnapshot({
			snapshot: refreshedSnapshot,
			expectedRevision: candidate.expectedRevision,
			activateSnapshotIfCurrent
		})) return true;
	}
}
function getActiveSecretsRuntimeSnapshot() {
	return getActiveSecretsRuntimeSnapshotState();
}
function getActiveSecretsRuntimeSnapshotRevision() {
	return getActiveSecretsRuntimeSnapshotRevisionState();
}
function getActiveSecretsRuntimeEnv() {
	return getActiveSecretsRuntimeEnvState();
}
function getActiveRuntimeWebToolsMetadata() {
	return getActiveRuntimeWebToolsMetadataFromState();
}
function clearSecretsRuntimeSnapshot() {
	clearSecretsRuntimeSnapshotState();
}
//#endregion
export { getActiveRuntimeWebToolsMetadata as a, getActiveSecretsRuntimeSnapshotRevision as c, refreshActiveProviderAuthRuntimeSnapshot as d, refreshActiveSecretsRuntimeSnapshotForConfig as f, clearSecretsRuntimeSnapshot as i, preflightActiveSecretsRuntimeSnapshotRefresh as l, activateSecretsRuntimeSnapshotIfCurrent as n, getActiveSecretsRuntimeEnv as o, restoreSecretsRuntimeSnapshotIfCurrent as p, activateSecretsRuntimeSnapshotWithSource as r, getActiveSecretsRuntimeSnapshot as s, activateSecretsRuntimeSnapshot as t, prepareSecretsRuntimeSnapshot as u };
