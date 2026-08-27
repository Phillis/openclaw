import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { a as setCurrentPluginMetadataSnapshotState, i as getCurrentPluginMetadataSnapshotState, r as currentPluginMetadataConfigIdentityCache } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { p as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-B1BZ_yR8.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-3yWCh0UH.js";
import { r as registerPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot.runtime.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-scope.ts
/** Normalizes plugin id scope input into a sorted unique string list. */
function normalizePluginIdScope(ids) {
	if (ids === void 0) return;
	return Array.from(new Set(normalizeStringEntries(ids.filter((id) => typeof id === "string")))).toSorted();
}
/** True when plugin scope was explicitly provided, including an empty scope. */
function hasExplicitPluginIdScope(ids) {
	return ids !== void 0;
}
/** True when plugin scope was explicitly provided with at least one id. */
function hasNonEmptyPluginIdScope(ids) {
	return ids !== void 0 && ids.length > 0;
}
/** Creates a lookup set for explicit plugin scope, or null when unscoped. */
function createPluginIdScopeSet(ids) {
	if (ids === void 0) return null;
	return new Set(ids);
}
/** Serializes plugin scope for cache keys. */
function serializePluginIdScope(ids) {
	return ids === void 0 ? "__unscoped__" : JSON.stringify(ids);
}
//#endregion
//#region src/plugins/current-plugin-metadata-snapshot.ts
/** Tracks the current plugin metadata snapshot for control-plane lookups. */
let activeTemporaryPluginMetadataSnapshotLease;
const scopedPluginMetadataSnapshot = resolveGlobalSingleton(Symbol.for("openclaw.scopedPluginMetadataSnapshot"), () => new AsyncLocalStorage());
function resolvePluginMetadataControlPlaneFingerprint(config, options = {}) {
	return resolvePluginControlPlaneFingerprint({
		config,
		...options
	});
}
function publishCurrentPluginMetadataSnapshot(snapshot, options) {
	currentPluginMetadataConfigIdentityCache.clear();
	const compatiblePolicyHashes = snapshot ? options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config)) : void 0;
	const compatibleConfigFingerprints = snapshot ? options.compatibleConfigs?.map((config, index) => resolvePluginMetadataControlPlaneFingerprint(config, {
		env: options.env,
		index: snapshot.index,
		policyHash: compatiblePolicyHashes?.[index],
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	})) : void 0;
	const configFingerprint = snapshot ? resolvePluginMetadataControlPlaneFingerprint(options.config, {
		env: options.env,
		index: snapshot.index,
		policyHash: snapshot.policyHash,
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	}) : void 0;
	const defaultDiscoveryConfigFingerprint = snapshot ? resolvePluginMetadataControlPlaneFingerprint({}, {
		env: options.env,
		index: snapshot.index,
		policyHash: snapshot.policyHash,
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	}) : void 0;
	const revision = setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, snapshot && defaultDiscoveryConfigFingerprint && (configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint))) ? snapshot.plugins : void 0);
	if (!snapshot) return revision;
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config);
		if (policyHash === snapshot.policyHash || Boolean(compatiblePolicyHashes?.includes(policyHash))) currentPluginMetadataConfigIdentityCache.add(options.config);
	}
	for (const config of options.compatibleConfigs ?? []) currentPluginMetadataConfigIdentityCache.add(config);
	return revision;
}
function setCurrentPluginMetadataSnapshot(snapshot, options = {}) {
	activeTemporaryPluginMetadataSnapshotLease = void 0;
	publishCurrentPluginMetadataSnapshot(snapshot, options);
}
/** Publishes a prepared CLI snapshot without displacing a lifecycle owner. */
function adoptCurrentPluginMetadataSnapshotIfAbsent(snapshot, options = {}) {
	if (getCurrentPluginMetadataSnapshotState().snapshot !== void 0) return;
	setCurrentPluginMetadataSnapshot(snapshot, options);
}
function captureCurrentPluginMetadataSnapshotState() {
	return {
		...getCurrentPluginMetadataSnapshotState(),
		configIdentities: currentPluginMetadataConfigIdentityCache.capture()
	};
}
function restoreCapturedCurrentPluginMetadataSnapshotState(state) {
	currentPluginMetadataConfigIdentityCache.restore(state.configIdentities);
	return setCurrentPluginMetadataSnapshotState(state.snapshot, state.configFingerprint, state.compatiblePolicyHashes, state.compatibleConfigFingerprints, state.manifestModelIdNormalizationRecords);
}
function resolveTemporaryPluginMetadataSnapshotLeaseParent() {
	const active = activeTemporaryPluginMetadataSnapshotLease;
	if (active && getCurrentPluginMetadataSnapshotState().revision !== active.revision) {
		activeTemporaryPluginMetadataSnapshotLease = void 0;
		return;
	}
	return active;
}
function releaseTemporaryPluginMetadataSnapshotLease(lease) {
	if (lease.released) return false;
	lease.released = true;
	if (activeTemporaryPluginMetadataSnapshotLease !== lease) return false;
	let restored = false;
	while (activeTemporaryPluginMetadataSnapshotLease?.released) {
		const current = activeTemporaryPluginMetadataSnapshotLease;
		if (getCurrentPluginMetadataSnapshotState().revision !== current.revision) {
			activeTemporaryPluginMetadataSnapshotLease = void 0;
			return restored;
		}
		const restoredRevision = restoreCapturedCurrentPluginMetadataSnapshotState(current.previousState);
		activeTemporaryPluginMetadataSnapshotLease = current.parent;
		if (activeTemporaryPluginMetadataSnapshotLease) activeTemporaryPluginMetadataSnapshotLease.revision = restoredRevision;
		restored = true;
	}
	return restored;
}
/** Temporarily publishes metadata without restoring over lifecycle-owned replacements. */
function installTemporaryCurrentPluginMetadataSnapshot(snapshot, options = {}) {
	const lease = {
		parent: resolveTemporaryPluginMetadataSnapshotLeaseParent(),
		previousState: captureCurrentPluginMetadataSnapshotState(),
		revision: publishCurrentPluginMetadataSnapshot(snapshot, options),
		released: false
	};
	activeTemporaryPluginMetadataSnapshotLease = lease;
	return { release: () => releaseTemporaryPluginMetadataSnapshotLease(lease) };
}
/** Carries one owner-prepared metadata generation through nested async plugin lookups. */
function withPluginMetadataSnapshotScope(snapshot, run, options = {}) {
	const workspaceDir = options.workspaceDir ?? snapshot.workspaceDir;
	const compatiblePolicyHashes = options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config));
	const compatibleConfigFingerprints = options.compatibleConfigs?.map((config, index) => resolvePluginMetadataControlPlaneFingerprint(config, {
		env: options.env,
		index: snapshot.index,
		policyHash: compatiblePolicyHashes?.[index],
		workspaceDir
	}));
	const configFingerprint = options.config ? resolvePluginMetadataControlPlaneFingerprint(options.config, {
		env: options.env,
		index: snapshot.index,
		policyHash: snapshot.policyHash,
		workspaceDir
	}) : snapshot.configFingerprint;
	const configIdentities = /* @__PURE__ */ new WeakSet();
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config);
		if (options.trustConfigIdentity === true || policyHash === snapshot.policyHash || compatiblePolicyHashes?.includes(policyHash)) configIdentities.add(options.config);
	}
	for (const config of options.compatibleConfigs ?? []) configIdentities.add(config);
	return scopedPluginMetadataSnapshot.run({
		snapshot,
		configFingerprint,
		compatiblePolicyHashes,
		compatibleConfigFingerprints,
		hasConfigIdentity: (config) => configIdentities.has(config),
		immutableRuntimeGeneration: options.trustConfigIdentity === true,
		parent: scopedPluginMetadataSnapshot.getStore()
	}, run);
}
function resolveCompatiblePluginMetadataSnapshot(candidate, params, options = {}) {
	const snapshot = candidate.snapshot;
	if (!snapshot) return;
	const env = params.env ?? process.env;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds ?? params.pluginIdScope?.resolve({ index: snapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(snapshot.pluginIds);
	if (requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) !== serializePluginIdScope(requestedPluginIds)) return;
	if (snapshotPluginIds !== void 0 && requestedPluginIds === void 0 && params.allowScopedSnapshot !== true) return;
	if (candidate.immutableRuntimeGeneration) return snapshot;
	const requestedWorkspaceDir = params.workspaceDir ?? (params.allowWorkspaceScopedSnapshot === true || options.scopedOwnerContext === true ? snapshot.workspaceDir : void 0);
	if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
	if (requestedWorkspaceDir !== void 0 && (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")) return;
	const canReuseCachedConfig = Boolean(params.config && candidate.hasConfigIdentity?.(params.config));
	if (canReuseCachedConfig && params.requireDefaultDiscoveryContext !== true) return snapshot;
	const requestedPolicyHash = params.config && !canReuseCachedConfig ? resolveInstalledPluginIndexPolicyHash(params.config) : void 0;
	if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
		if (!candidate.compatiblePolicyHashes?.includes(requestedPolicyHash)) return;
	}
	if (params.config && !canReuseCachedConfig) {
		const requestedConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(params.config, {
			env,
			index: snapshot.index,
			policyHash: requestedPolicyHash,
			workspaceDir: requestedWorkspaceDir
		});
		if (!(candidate.configFingerprint === requestedConfigFingerprint || snapshot.configFingerprint === requestedConfigFingerprint || Boolean(candidate.compatibleConfigFingerprints?.includes(requestedConfigFingerprint)))) return;
	}
	if (params.requireDefaultDiscoveryContext === true && options.scopedOwnerContext !== true) {
		const defaultDiscoveryConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint({}, {
			env: params.env,
			index: snapshot.index,
			policyHash: snapshot.policyHash,
			workspaceDir: requestedWorkspaceDir
		});
		if (!(candidate.configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || Boolean(candidate.compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint)))) return;
	}
	return snapshot;
}
function isCurrentPluginMetadataSnapshotRuntimeGeneration(snapshot) {
	for (let scoped = scopedPluginMetadataSnapshot.getStore(); scoped; scoped = scoped.parent) if (scoped.snapshot === snapshot && scoped.immutableRuntimeGeneration === true) return true;
	return false;
}
function getCurrentPluginMetadataSnapshot(params = {}) {
	for (let scoped = scopedPluginMetadataSnapshot.getStore(); scoped; scoped = scoped.parent) {
		const compatibleScoped = resolveCompatiblePluginMetadataSnapshot(scoped, params, { scopedOwnerContext: true });
		if (compatibleScoped) return compatibleScoped;
	}
	const { snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints } = getCurrentPluginMetadataSnapshotState();
	return resolveCompatiblePluginMetadataSnapshot({
		snapshot,
		configFingerprint,
		compatiblePolicyHashes,
		compatibleConfigFingerprints,
		hasConfigIdentity: (config) => currentPluginMetadataConfigIdentityCache.has(config)
	}, params);
}
registerPluginMetadataSnapshotReaders({
	adoptCurrentPluginMetadataSnapshotIfAbsent,
	getCurrentPluginMetadataSnapshot
});
//#endregion
export { setCurrentPluginMetadataSnapshot as a, hasExplicitPluginIdScope as c, serializePluginIdScope as d, isCurrentPluginMetadataSnapshotRuntimeGeneration as i, hasNonEmptyPluginIdScope as l, getCurrentPluginMetadataSnapshot as n, withPluginMetadataSnapshotScope as o, installTemporaryCurrentPluginMetadataSnapshot as r, createPluginIdScopeSet as s, adoptCurrentPluginMetadataSnapshotIfAbsent as t, normalizePluginIdScope as u };
