import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { s as setCurrentManifestModelIdNormalizationRecords } from "./provider-model-id-normalization-DvssXFxG.js";
//#region src/plugins/current-plugin-metadata-state.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.currentPluginMetadataState"), () => ({
	snapshot: void 0,
	configFingerprint: void 0,
	compatiblePolicyHashes: void 0,
	compatibleConfigFingerprints: void 0,
	manifestModelIdNormalizationRecords: void 0,
	revision: Symbol("plugin-metadata-snapshot"),
	configIdentities: /* @__PURE__ */ new WeakSet()
}));
/** Owns config identity reuse for the current immutable metadata snapshot. */
const currentPluginMetadataConfigIdentityCache = {
	add(config) {
		state.configIdentities.add(config);
	},
	capture() {
		return state.configIdentities;
	},
	clear() {
		state.configIdentities = /* @__PURE__ */ new WeakSet();
	},
	has(config) {
		return state.configIdentities.has(config);
	},
	restore(identities) {
		state.configIdentities = identities;
	}
};
/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
function setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, manifestModelIdNormalizationRecords) {
	state.snapshot = snapshot;
	state.configFingerprint = snapshot ? configFingerprint : void 0;
	state.compatiblePolicyHashes = snapshot ? compatiblePolicyHashes : void 0;
	state.compatibleConfigFingerprints = snapshot ? compatibleConfigFingerprints : void 0;
	state.manifestModelIdNormalizationRecords = snapshot ? manifestModelIdNormalizationRecords : void 0;
	setCurrentManifestModelIdNormalizationRecords(state.manifestModelIdNormalizationRecords);
	state.revision = Symbol("plugin-metadata-snapshot");
	return state.revision;
}
/** Clears the process-current plugin metadata snapshot. */
function clearCurrentPluginMetadataSnapshotState() {
	state.snapshot = void 0;
	state.configFingerprint = void 0;
	state.compatiblePolicyHashes = void 0;
	state.compatibleConfigFingerprints = void 0;
	state.manifestModelIdNormalizationRecords = void 0;
	setCurrentManifestModelIdNormalizationRecords(void 0);
	state.revision = Symbol("plugin-metadata-snapshot");
	return state.revision;
}
/** Clears the snapshot, its identity cache, and process-wide model normalization. */
function clearCurrentPluginMetadataSnapshot() {
	currentPluginMetadataConfigIdentityCache.clear();
	clearCurrentPluginMetadataSnapshotState();
}
/** Returns the process-current plugin metadata snapshot state. */
function getCurrentPluginMetadataSnapshotState() {
	return {
		snapshot: state.snapshot,
		configFingerprint: state.configFingerprint,
		compatiblePolicyHashes: state.compatiblePolicyHashes,
		compatibleConfigFingerprints: state.compatibleConfigFingerprints,
		manifestModelIdNormalizationRecords: state.manifestModelIdNormalizationRecords,
		revision: state.revision
	};
}
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.ts
/** Coordinates plugin metadata snapshot and process memo cache lifecycle resets. */
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Set();
/** Registers a process-local plugin metadata memo clear hook. */
function registerPluginMetadataProcessMemoLifecycleClear(clearProcessMemo) {
	pluginMetadataProcessMemoClears.add(clearProcessMemo);
}
/** Clears plugin metadata snapshots and registered process memo caches. */
function clearPluginMetadataLifecycleCaches() {
	clearCurrentPluginMetadataSnapshot();
	for (const clearProcessMemo of pluginMetadataProcessMemoClears) clearProcessMemo();
}
//#endregion
export { setCurrentPluginMetadataSnapshotState as a, getCurrentPluginMetadataSnapshotState as i, registerPluginMetadataProcessMemoLifecycleClear as n, currentPluginMetadataConfigIdentityCache as r, clearPluginMetadataLifecycleCaches as t };
