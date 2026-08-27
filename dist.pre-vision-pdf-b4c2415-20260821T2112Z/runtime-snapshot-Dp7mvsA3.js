import { n as sha256Base64Url } from "./crypto-digest-PR8Utwzg.js";
import { t as clearExecutablePathCache } from "./executable-path-D05F-hRH.js";
import { f as resetPublishedConfigRuntimeEnv } from "./config-env-vars-BITg3hPR.js";
//#region src/config/runtime-snapshot.ts
function resolveConfigWriteAfterWrite(afterWrite) {
	return afterWrite ?? { mode: "auto" };
}
function resolveConfigWriteFollowUp(afterWrite) {
	const resolved = resolveConfigWriteAfterWrite(afterWrite);
	if (resolved.mode === "restart") return {
		mode: "restart",
		reason: resolved.reason,
		requiresRestart: true
	};
	if (resolved.mode === "none") return {
		mode: "none",
		reason: resolved.reason,
		requiresRestart: false
	};
	return {
		mode: "auto",
		requiresRestart: false
	};
}
let runtimeConfigSnapshot = null;
let runtimeConfigSourceSnapshot = null;
let runtimeConfigSnapshotMetadata = null;
let runtimeConfigAppliedHash = null;
let runtimeConfigSnapshotRevision = 0;
let runtimeConfigSnapshotRefreshHandler = null;
const managedRuntimeConfigWriteOwners = /* @__PURE__ */ new Map();
const runtimeConfigWriteListeners = /* @__PURE__ */ new Set();
const runtimeConfigSnapshotPreparers = /* @__PURE__ */ new Set();
function stableConfigStringify(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (Array.isArray(value)) return `[${value.map((entry) => stableConfigStringify(entry)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).toSorted().map((key) => `${JSON.stringify(key)}:${stableConfigStringify(record[key])}`).join(",")}}`;
}
function configSnapshotsMatch(left, right) {
	if (left === right) return true;
	try {
		return stableConfigStringify(left) === stableConfigStringify(right);
	} catch {
		return false;
	}
}
function hashRuntimeConfigValue(value) {
	return sha256Base64Url(stableConfigStringify(value));
}
function createRuntimeConfigSnapshotMetadata(config, sourceConfig) {
	runtimeConfigSnapshotRevision += 1;
	return {
		revision: runtimeConfigSnapshotRevision,
		fingerprint: hashRuntimeConfigValue(config),
		sourceFingerprint: sourceConfig ? hashRuntimeConfigValue(sourceConfig) : null,
		updatedAtMs: Date.now()
	};
}
function setRuntimeConfigSnapshot(config, sourceConfig) {
	for (const prepare of runtimeConfigSnapshotPreparers) prepare(config);
	clearExecutablePathCache();
	runtimeConfigSnapshot = config;
	runtimeConfigSourceSnapshot = sourceConfig ?? null;
	runtimeConfigSnapshotMetadata = createRuntimeConfigSnapshotMetadata(config, sourceConfig);
}
function registerRuntimeConfigSnapshotPreparer(prepare) {
	runtimeConfigSnapshotPreparers.add(prepare);
	if (runtimeConfigSnapshot) prepare(runtimeConfigSnapshot);
	return () => runtimeConfigSnapshotPreparers.delete(prepare);
}
function setAppliedRuntimeConfigSnapshot(config, sourceConfig) {
	setRuntimeConfigSnapshot(config, sourceConfig);
	runtimeConfigAppliedHash = hashRuntimeConfigValue(sourceConfig);
}
/** Publish a newer canonical source without changing the active runtime object. */
function setRuntimeConfigSourceSnapshotIfCurrent(params) {
	if (!runtimeConfigSnapshot || !runtimeConfigSnapshotMetadata || runtimeConfigSnapshotMetadata.revision !== params.expectedRevision) return false;
	setRuntimeConfigSnapshot(runtimeConfigSnapshot, params.sourceConfig);
	return true;
}
function resetConfigRuntimeState() {
	clearExecutablePathCache();
	runtimeConfigSnapshot = null;
	runtimeConfigSourceSnapshot = null;
	runtimeConfigSnapshotMetadata = null;
	runtimeConfigAppliedHash = null;
	runtimeConfigSnapshotRevision = 0;
	resetPublishedConfigRuntimeEnv();
}
function clearRuntimeConfigSnapshot() {
	resetConfigRuntimeState();
}
function getRuntimeConfigSnapshot() {
	return runtimeConfigSnapshot;
}
function getRuntimeConfigSourceSnapshot() {
	return runtimeConfigSourceSnapshot;
}
function getRuntimeConfigSnapshotMetadata() {
	return runtimeConfigSnapshotMetadata;
}
/** Resolved source-config revision accepted by the active Gateway runtime. */
function getRuntimeConfigAppliedHash() {
	return runtimeConfigAppliedHash;
}
function setRuntimeConfigAppliedHash(hash) {
	runtimeConfigAppliedHash = hash;
}
function resolveRuntimeConfigCacheKey(config) {
	const metadata = runtimeConfigSnapshotMetadata;
	if (metadata && config === runtimeConfigSnapshot) return `runtime:${metadata.revision}:${metadata.fingerprint}`;
	return `config:${hashRuntimeConfigValue(config)}`;
}
function createRuntimeConfigWriteNotification(params) {
	const metadata = params.runtimeConfig === runtimeConfigSnapshot && runtimeConfigSnapshotMetadata ? runtimeConfigSnapshotMetadata : {
		revision: runtimeConfigSnapshotRevision,
		fingerprint: hashRuntimeConfigValue(params.runtimeConfig),
		sourceFingerprint: hashRuntimeConfigValue(params.sourceConfig),
		updatedAtMs: Date.now()
	};
	return {
		configPath: params.configPath,
		sourceConfig: params.sourceConfig,
		runtimeConfig: params.runtimeConfig,
		persistedHash: params.persistedHash,
		revision: metadata.revision,
		fingerprint: metadata.fingerprint,
		sourceFingerprint: metadata.sourceFingerprint,
		writtenAtMs: params.writtenAtMs ?? Date.now(),
		afterWrite: params.afterWrite,
		...params.runtimeRefresh ? { runtimeRefresh: params.runtimeRefresh } : {},
		...params.preparedCandidate ? { preparedCandidate: params.preparedCandidate } : {},
		...params.preparedCandidatesByOwner ? { preparedCandidatesByOwner: params.preparedCandidatesByOwner } : {}
	};
}
function selectApplicableRuntimeConfig(params) {
	const runtimeConfig = params.runtimeConfig ?? null;
	if (!runtimeConfig) return params.inputConfig;
	const inputConfig = params.inputConfig;
	if (!inputConfig) return runtimeConfig;
	if (inputConfig === runtimeConfig) return inputConfig;
	const runtimeSourceConfig = params.runtimeSourceConfig ?? null;
	if (!runtimeSourceConfig) return runtimeConfig;
	if (configSnapshotsMatch(inputConfig, runtimeSourceConfig)) return runtimeConfig;
	return inputConfig;
}
function setRuntimeConfigSnapshotRefreshHandler(refreshHandler) {
	runtimeConfigSnapshotRefreshHandler = refreshHandler;
}
function getRuntimeConfigSnapshotRefreshHandler() {
	return runtimeConfigSnapshotRefreshHandler;
}
function registerRuntimeConfigWriteListener(listener) {
	runtimeConfigWriteListeners.add(listener);
	return () => {
		runtimeConfigWriteListeners.delete(listener);
	};
}
function registerManagedRuntimeConfigWriteOwner(configPath, preflight) {
	const owner = preflight ? {
		id: Symbol("managed-runtime-config-write-owner"),
		preflight
	} : { id: Symbol("managed-runtime-config-write-owner") };
	const owners = managedRuntimeConfigWriteOwners.get(configPath) ?? /* @__PURE__ */ new Set();
	owners.add(owner);
	managedRuntimeConfigWriteOwners.set(configPath, owners);
	let released = false;
	const unregister = () => {
		if (released) return;
		released = true;
		const currentOwners = managedRuntimeConfigWriteOwners.get(configPath);
		currentOwners?.delete(owner);
		if (!currentOwners || currentOwners.size === 0) managedRuntimeConfigWriteOwners.delete(configPath);
	};
	return Object.assign(unregister, { ownerId: owner.id });
}
async function preflightManagedRuntimeConfigWrite(configPath, sourceConfig, refreshOptions) {
	const owners = managedRuntimeConfigWriteOwners.get(configPath);
	if (!owners) return /* @__PURE__ */ new Map();
	const preparedCandidates = /* @__PURE__ */ new Map();
	for (const owner of owners) if (owner.preflight) preparedCandidates.set(owner.id, await owner.preflight(sourceConfig, refreshOptions));
	return preparedCandidates;
}
function hasManagedRuntimeConfigWriteOwner(configPath) {
	return managedRuntimeConfigWriteOwners.has(configPath);
}
function notifyRuntimeConfigWriteListeners(event) {
	for (const listener of runtimeConfigWriteListeners) try {
		listener(event);
	} catch {}
}
function loadPinnedRuntimeConfig(loadFresh) {
	if (runtimeConfigSnapshot) return runtimeConfigSnapshot;
	const config = loadFresh();
	setRuntimeConfigSnapshot(config);
	return getRuntimeConfigSnapshot() ?? config;
}
async function preflightRuntimeSnapshotWrite(params) {
	const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
	if (!refreshHandler?.preflight) return;
	try {
		return await refreshHandler.preflight({
			sourceConfig: params.nextSourceConfig,
			...params.refreshOptions
		});
	} catch (error) {
		throw params.createRefreshError(params.formatRefreshError(error), error);
	}
}
async function finalizeRuntimeSnapshotWrite(params) {
	if (params.deferRuntimeActivation) {
		params.notifyCommittedWrite();
		return;
	}
	const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
	if (refreshHandler) try {
		if (await refreshHandler.refresh({
			sourceConfig: params.nextSourceConfig,
			...params.refreshOptions,
			preflightResult: params.preflightResult
		})) {
			params.notifyCommittedWrite();
			return;
		}
	} catch (error) {
		try {
			refreshHandler.clearOnRefreshFailure?.();
		} catch {}
		throw params.createRefreshError(params.formatRefreshError(error), error);
	}
	if (params.hadBothSnapshots) {
		setRuntimeConfigSnapshot(params.loadFreshConfig(), params.nextSourceConfig);
		params.notifyCommittedWrite();
		return;
	}
	if (params.hadRuntimeSnapshot) {
		setRuntimeConfigSnapshot(params.loadFreshConfig());
		params.notifyCommittedWrite();
		return;
	}
	setRuntimeConfigSnapshot(params.loadFreshConfig());
	params.notifyCommittedWrite();
}
//#endregion
export { setAppliedRuntimeConfigSnapshot as C, setRuntimeConfigSourceSnapshotIfCurrent as D, setRuntimeConfigSnapshotRefreshHandler as E, selectApplicableRuntimeConfig as S, setRuntimeConfigSnapshot as T, registerRuntimeConfigWriteListener as _, getRuntimeConfigSnapshot as a, resolveConfigWriteFollowUp as b, getRuntimeConfigSourceSnapshot as c, loadPinnedRuntimeConfig as d, notifyRuntimeConfigWriteListeners as f, registerRuntimeConfigSnapshotPreparer as g, registerManagedRuntimeConfigWriteOwner as h, getRuntimeConfigAppliedHash as i, hasManagedRuntimeConfigWriteOwner as l, preflightRuntimeSnapshotWrite as m, createRuntimeConfigWriteNotification as n, getRuntimeConfigSnapshotMetadata as o, preflightManagedRuntimeConfigWrite as p, finalizeRuntimeSnapshotWrite as r, getRuntimeConfigSnapshotRefreshHandler as s, clearRuntimeConfigSnapshot as t, hashRuntimeConfigValue as u, resetConfigRuntimeState as v, setRuntimeConfigAppliedHash as w, resolveRuntimeConfigCacheKey as x, resolveConfigWriteAfterWrite as y };
