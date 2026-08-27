import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-y-_yRnBE.js";
import { c as getAgentRunContext } from "./agent-run-registry-cxavoLf6.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { S as subagentRuns, a as loadSubagentSessionListRunsFromSqlite, b as getSubagentRunsForChildSession, g as isDeliverySuspended, i as loadSubagentRunsForControllerFromSqlite, l as compareSubagentRunGeneration, n as loadSubagentRegistryFromSqlite, o as saveSubagentRegistryChangesToSqlite, r as loadSubagentRunsForChildSessionFromSqlite, s as saveSubagentRegistryToSqlite } from "./subagent-registry.store.sqlite-okpdNwYx.js";
import { n as hasSubagentRunEnded, r as isLiveUnendedSubagentRun } from "./subagent-run-liveness-Xp6SfCLg.js";
//#region src/agents/subagents/registry/subagent-registry-queries.ts
function resolveControllerSessionKey(entry) {
	return entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
}
function resolveConcurrencyOwnerSessionKey(entry) {
	return entry.collect ? entry.swarmRequesterSessionKey?.trim() || resolveControllerSessionKey(entry) : resolveControllerSessionKey(entry);
}
function isDeliveryTerminalForRequesterSettle(entry) {
	return isDeliverySuspended(entry) || entry.delivery?.disposition === "delivered" || entry.delivery?.disposition === "intentional_non_delivery" || entry.delivery?.disposition === "permanent_failure";
}
/** Lists requester-owned runs, optionally scoped to the lifetime of a requester run. */
function listRunsForRequesterFromRuns(runs, requesterSessionKey, options) {
	const key = requesterSessionKey.trim();
	if (!key) return [];
	const requesterRunId = options?.requesterRunId?.trim();
	const requesterRun = requesterRunId ? runs.get(requesterRunId) : void 0;
	const requesterRunMatchesScope = requesterRun && requesterRun.childSessionKey === key ? requesterRun : void 0;
	const lowerBound = requesterRunMatchesScope?.execution.startedAt ?? requesterRunMatchesScope?.createdAt;
	const upperBound = requesterRunMatchesScope?.execution.endedAt;
	const results = [];
	for (const entry of runs.values()) if (entry.requesterSessionKey === key && (!options?.requesterAgentId || entry.requesterAgentId === options.requesterAgentId) && (typeof lowerBound !== "number" || entry.createdAt >= lowerBound) && (typeof upperBound !== "number" || entry.createdAt <= upperBound)) results.push(entry);
	return results;
}
/** Lists runs controlled by the normalized controller session key. */
function listRunsForControllerFromRuns(runs, controllerSessionKey, controllerAgentId) {
	const key = controllerSessionKey.trim();
	const results = [];
	if (!key) return results;
	for (const entry of runs.values()) if (resolveControllerSessionKey(entry) === key && (!controllerAgentId || entry.requesterAgentId === controllerAgentId)) results.push(entry);
	return results;
}
function rememberLatestRunEntry(map, key, entry) {
	const existing = map.get(key);
	if (!existing || compareSubagentRunGeneration(entry, existing) > 0) map.set(key, entry);
}
/** Builds a reusable latest-generation lookup from one registry snapshot. */
function buildLatestSubagentRunReadIndexFromRuns(runs) {
	const latestRunByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		rememberLatestRunEntry(latestRunByChildSessionKey, childSessionKey, entry);
	}
	return { getLatestSubagentRun: (childSessionKey) => latestRunByChildSessionKey.get(childSessionKey.trim()) ?? null };
}
/** Builds a read index from snapshot and optional in-memory runs. */
function buildSubagentRunReadIndexFromRuns(params) {
	const { runs } = params;
	const now = params.now ?? Date.now();
	const inMemoryDisplayByChildSessionKey = /* @__PURE__ */ new Map();
	const latestSnapshotActiveByChildSessionKey = /* @__PURE__ */ new Map();
	const latestSnapshotEndedByChildSessionKey = /* @__PURE__ */ new Map();
	const latestRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByControllerSessionKey = /* @__PURE__ */ new Map();
	const latestRunByRequesterAndChildSessionKey = /* @__PURE__ */ new Map();
	const activeDescendantCountBySessionKey = /* @__PURE__ */ new Map();
	const pendingDescendantCountBySessionKey = /* @__PURE__ */ new Map();
	for (const entry of params.inMemoryRuns ?? []) {
		const childSessionKey = entry.childSessionKey.trim();
		if (!childSessionKey) continue;
		rememberLatestRunEntry(inMemoryDisplayByChildSessionKey, childSessionKey, entry);
	}
	for (const [, entry] of runs.entries()) {
		const childSessionKey = entry.childSessionKey.trim();
		const controllerSessionKey = resolveControllerSessionKey(entry);
		if (controllerSessionKey) {
			let controllerRuns = runsByControllerSessionKey.get(controllerSessionKey);
			if (!controllerRuns) {
				controllerRuns = [];
				runsByControllerSessionKey.set(controllerSessionKey, controllerRuns);
			}
			controllerRuns.push(entry);
		}
		if (!childSessionKey) continue;
		rememberLatestRunEntry(isLiveUnendedSubagentRun(entry, now) ? latestSnapshotActiveByChildSessionKey : latestSnapshotEndedByChildSessionKey, childSessionKey, entry);
		rememberLatestRunEntry(latestRunsByChildSessionKey, childSessionKey, entry);
		const requesterSessionKey = entry.requesterSessionKey;
		if (!requesterSessionKey) continue;
		let latestByChild = latestRunByRequesterAndChildSessionKey.get(requesterSessionKey);
		if (!latestByChild) {
			latestByChild = /* @__PURE__ */ new Map();
			latestRunByRequesterAndChildSessionKey.set(requesterSessionKey, latestByChild);
		}
		rememberLatestRunEntry(latestByChild, childSessionKey, entry);
	}
	const getDisplaySubagentRun = (childSessionKey) => {
		const key = childSessionKey.trim();
		if (!key) return null;
		return inMemoryDisplayByChildSessionKey.get(key) ?? latestSnapshotActiveByChildSessionKey.get(key) ?? latestSnapshotEndedByChildSessionKey.get(key) ?? null;
	};
	const forEachDescendantRun = (rootSessionKey, visitor) => {
		const root = rootSessionKey.trim();
		if (!root) return;
		const pending = [root];
		const visited = /* @__PURE__ */ new Set([root]);
		for (const requester of pending) for (const [childSessionKey, entry] of latestRunByRequesterAndChildSessionKey.get(requester) ?? []) {
			if (latestRunsByChildSessionKey.get(childSessionKey) !== entry) continue;
			if (visitor(entry) === true) return;
			if (visited.has(childSessionKey)) continue;
			visited.add(childSessionKey);
			pending.push(childSessionKey);
		}
	};
	const countActiveDescendantRuns = (rootSessionKey) => {
		const root = rootSessionKey.trim();
		if (!root) return 0;
		if (activeDescendantCountBySessionKey.has(root)) return activeDescendantCountBySessionKey.get(root) ?? 0;
		let count = 0;
		forEachDescendantRun(root, (entry) => {
			if (isLiveUnendedSubagentRun(entry, now)) count += 1;
		});
		activeDescendantCountBySessionKey.set(root, count);
		return count;
	};
	const countPendingDescendantRunsInternal = (rootSessionKey, options) => {
		const excludedRunId = options?.excludeRunId?.trim();
		let count = 0;
		forEachDescendantRun(rootSessionKey, (entry) => {
			if (entry.runId === excludedRunId) return false;
			if (hasSubagentRunEnded(entry) ? typeof entry.cleanupCompletedAt !== "number" && !(options?.treatSuspendedDeliveryAsSettled === true && isDeliveryTerminalForRequesterSettle(entry)) : isLiveUnendedSubagentRun(entry, now)) {
				count += 1;
				if (options?.stopAtFirst === true) return true;
			}
			return false;
		});
		return count;
	};
	const countPendingDescendantRuns = (rootSessionKey) => {
		const root = rootSessionKey.trim();
		if (!root) return 0;
		if (pendingDescendantCountBySessionKey.has(root)) return pendingDescendantCountBySessionKey.get(root) ?? 0;
		const count = countPendingDescendantRunsInternal(root);
		pendingDescendantCountBySessionKey.set(root, count);
		return count;
	};
	const hasDescendantRunAwaitingSettle = (rootSessionKey, excludeRunId) => countPendingDescendantRunsInternal(rootSessionKey, {
		excludeRunId,
		treatSuspendedDeliveryAsSettled: true,
		stopAtFirst: true
	}) > 0;
	const listDescendantRunsForRequester = (rootSessionKey) => {
		const descendants = [];
		forEachDescendantRun(rootSessionKey, (entry) => {
			descendants.push(entry);
		});
		return descendants;
	};
	return {
		getDisplaySubagentRun,
		latestRunsByChildSessionKey,
		countActiveDescendantRuns,
		countPendingDescendantRuns,
		hasDescendantRunAwaitingSettle,
		listDescendantRunsForRequester,
		runsByControllerSessionKey
	};
}
/**
* Returns the latest-generation run for a child session.
*
* `matches` narrows the candidates before the generation comparison, so callers
* that own a specific row class (a paused continuation target, say) select the
* newest row of that class rather than the newest row overall. Without it a
* sibling registered at a higher generation hides the row the caller owns.
*/
function getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey, matches) {
	const key = childSessionKey.trim();
	if (!key) return;
	let latest;
	for (const entry of runs instanceof Map ? runs.values() : runs) {
		if (entry.childSessionKey !== key) continue;
		if (matches && !matches(entry)) continue;
		if (!latest || compareSubagentRunGeneration(entry, latest) > 0) latest = entry;
	}
	return latest;
}
/** Returns whether the latest run for a child session is still live. */
function isSubagentSessionRunActiveFromRuns(runs, childSessionKey) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey);
	return Boolean(latest && isLiveUnendedSubagentRun(latest));
}
/** Returns the preferred run for a child session, active first then latest ended. */
function getSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	let latestActive = null;
	let latestEnded = null;
	for (const entry of runs.values()) {
		if (entry.childSessionKey !== key) continue;
		if (isLiveUnendedSubagentRun(entry)) {
			if (!latestActive || compareSubagentRunGeneration(entry, latestActive) > 0) latestActive = entry;
			continue;
		}
		if (!latestEnded || compareSubagentRunGeneration(entry, latestEnded) > 0) latestEnded = entry;
	}
	return latestActive ?? latestEnded;
}
/** Resolves the requester and delivery origin for the latest child-session run. */
function resolveRequesterForChildSessionFromRuns(runs, childSessionKey) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey);
	if (!latest) return null;
	return {
		requesterSessionKey: latest.requesterSessionKey,
		requesterAgentId: latest.requesterAgentId,
		requesterOrigin: latest.requesterOrigin
	};
}
/** Returns whether post-completion announce should be skipped for a cleaned-up run. */
function shouldIgnorePostCompletionAnnounceForSessionFromRuns(runs, childSessionKey) {
	const latest = getLatestSubagentRunByChildSessionKeyFromRuns(runs, childSessionKey);
	return Boolean(latest && latest.spawnMode !== "session" && typeof latest.execution.endedAt === "number" && typeof latest.cleanupCompletedAt === "number" && latest.cleanupCompletedAt >= latest.execution.endedAt);
}
/** Counts active direct child runs plus completed children that still have pending descendants. */
function countActiveRunsForSessionFromRuns(runs, controllerSessionKey, options) {
	const key = controllerSessionKey.trim();
	if (!key) return 0;
	const readIndex = buildSubagentRunReadIndexFromRuns({ runs });
	const latestByChildSessionKey = /* @__PURE__ */ new Map();
	for (const entry of runs.values()) {
		if (options?.collect !== void 0 && entry.collect === true !== options.collect) continue;
		if (resolveConcurrencyOwnerSessionKey(entry) !== key) continue;
		if (options?.requesterAgentId && entry.requesterAgentId !== options.requesterAgentId) continue;
		rememberLatestRunEntry(latestByChildSessionKey, entry.childSessionKey, entry);
	}
	let count = 0;
	for (const entry of latestByChildSessionKey.values()) {
		if (isLiveUnendedSubagentRun(entry)) {
			count += 1;
			continue;
		}
		if (readIndex.countPendingDescendantRuns(entry.childSessionKey) > 0) count += 1;
	}
	return count;
}
/** Counts live descendants under a requester/session tree. */
function countActiveDescendantRunsFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).countActiveDescendantRuns(rootSessionKey);
}
/** Counts descendants that are live or ended but not yet cleaned up. */
function countPendingDescendantRunsFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).countPendingDescendantRuns(rootSessionKey);
}
/**
* True when any descendant below a root session has not reached a terminal
* settle. Differs from the pending count in one way: a run whose final
* delivery was suspended counts as settled — suspension is terminal for
* automatic announce retries, so requester-drain decisions must not wait on it.
*/
function hasDescendantRunAwaitingSettleFromRuns(runs, rootSessionKey, excludeRunId, requesterAgentId) {
	return buildSubagentRunReadIndexFromRuns({ runs: requesterAgentId ? new Map([...runs].filter(([, entry]) => entry.requesterSessionKey !== rootSessionKey || entry.requesterAgentId === requesterAgentId)) : runs }).hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId);
}
/** Lists latest descendant runs under a requester/session tree. */
function listDescendantRunsForRequesterFromRuns(runs, rootSessionKey) {
	return buildSubagentRunReadIndexFromRuns({ runs }).listDescendantRunsForRequester(rootSessionKey);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-state.ts
/**
* Subagent registry state persistence bridge.
*
* Merges process-local active runs with persisted SQLite state for cross-process readers.
*/
const SUBAGENT_RUNS_READ_CACHE_TTL_MS = 500;
const persistedSubagentRunsReadCache = {
	load: loadSubagentRegistryFromSqlite,
	copy: structuredClone,
	project: (entry) => entry
};
const persistedSubagentSessionListRunsReadCache = {
	load: () => loadSubagentSessionListRunsFromSqlite(),
	copy: projectSubagentRunForSessionList,
	project: projectSubagentRunForSessionList
};
const SUBAGENT_REGISTRY_PERSIST_LISTENERS = /* @__PURE__ */ new Set();
function emitSubagentRegistryPersisted() {
	for (const listener of SUBAGENT_REGISTRY_PERSIST_LISTENERS) try {
		listener();
	} catch {}
}
/** Wake process-local readers after a registry mutation, even if persistence failed. */
function onSubagentRegistryPersisted(listener) {
	SUBAGENT_REGISTRY_PERSIST_LISTENERS.add(listener);
	return () => {
		SUBAGENT_REGISTRY_PERSIST_LISTENERS.delete(listener);
	};
}
function projectSubagentRunForSessionList(entry) {
	return {
		runId: entry.runId,
		childSessionKey: entry.childSessionKey,
		...entry.controllerSessionKey ? { controllerSessionKey: entry.controllerSessionKey } : {},
		requesterSessionKey: entry.requesterSessionKey,
		...entry.requesterAgentId ? { requesterAgentId: entry.requesterAgentId } : {},
		...entry.model ? { model: entry.model } : {},
		...entry.generation !== void 0 ? { generation: entry.generation } : {},
		createdAt: entry.createdAt,
		execution: {
			...entry.execution.startedAt !== void 0 ? { startedAt: entry.execution.startedAt } : {},
			...entry.execution.endedAt !== void 0 ? { endedAt: entry.execution.endedAt } : {},
			...entry.execution.outcome ? { outcome: { status: entry.execution.outcome.status } } : {}
		},
		...entry.sessionStartedAt !== void 0 ? { sessionStartedAt: entry.sessionStartedAt } : {},
		...entry.accumulatedRuntimeMs !== void 0 ? { accumulatedRuntimeMs: entry.accumulatedRuntimeMs } : {},
		...entry.runTimeoutSeconds !== void 0 ? { runTimeoutSeconds: entry.runTimeoutSeconds } : {},
		...entry.endedReason ? { endedReason: entry.endedReason } : {},
		...entry.cleanupCompletedAt !== void 0 ? { cleanupCompletedAt: entry.cleanupCompletedAt } : {},
		...entry.delivery ? { delivery: {
			status: entry.delivery.status,
			...entry.delivery.suspendedAt !== void 0 ? { suspendedAt: entry.delivery.suspendedAt } : {}
		} } : {}
	};
}
function rememberSubagentRunsSnapshot(cache, runs, changedRunIds, loadedAtMs) {
	const snapshot = cache.snapshot;
	if (!changedRunIds || !snapshot) {
		cache.snapshot = {
			loadedAtMs,
			runs: new Map([...runs].map(([runId, entry]) => [runId, cache.copy(entry)]))
		};
		return;
	}
	for (const runId of new Set(changedRunIds)) {
		const entry = runs.get(runId);
		if (entry) snapshot.runs.set(runId, cache.copy(entry));
		else snapshot.runs.delete(runId);
	}
	snapshot.loadedAtMs = loadedAtMs;
}
function rememberPersistedSubagentRunsSnapshot(runs, changedRunIds) {
	const loadedAtMs = Date.now();
	rememberSubagentRunsSnapshot(persistedSubagentRunsReadCache, runs, changedRunIds, loadedAtMs);
	rememberSubagentRunsSnapshot(persistedSubagentSessionListRunsReadCache, runs, changedRunIds, loadedAtMs);
}
function shouldReadPersistedSubagentRuns() {
	return !isVitestRuntimeEnv() || process.env.OPENCLAW_TEST_READ_SUBAGENT_RUNS_FROM_SQLITE === "1";
}
function getFreshPersistedSubagentRunsSnapshot(cache, nowMs) {
	const cached = cache.snapshot;
	return cached && nowMs >= cached.loadedAtMs && nowMs - cached.loadedAtMs < SUBAGENT_RUNS_READ_CACHE_TTL_MS ? cached.runs : null;
}
function loadPersistedSubagentRunsForRead(cache) {
	const nowMs = Date.now();
	const cached = getFreshPersistedSubagentRunsSnapshot(cache, nowMs);
	if (cached) return cached;
	cache.snapshot = {
		loadedAtMs: nowMs,
		runs: cache.load()
	};
	return cache.snapshot.runs;
}
function clearSubagentRunsReadCacheForTest() {
	persistedSubagentRunsReadCache.snapshot = void 0;
	persistedSubagentSessionListRunsReadCache.snapshot = void 0;
}
function persistSubagentRuns(runs, changedRunIds, strict) {
	try {
		if (changedRunIds) saveSubagentRegistryChangesToSqlite(runs, changedRunIds);
		else saveSubagentRegistryToSqlite(runs);
	} catch (error) {
		if (strict) throw error;
	}
	rememberPersistedSubagentRunsSnapshot(runs, changedRunIds);
	emitSubagentRegistryPersisted();
}
function persistSubagentRunsToDisk(runs, changedRunIds) {
	persistSubagentRuns(runs, changedRunIds, false);
}
function persistSubagentRunsToDiskOrThrow(runs, changedRunIds) {
	persistSubagentRuns(runs, changedRunIds, true);
}
function restoreSubagentRunsFromDisk(params) {
	const restored = loadSubagentRegistryFromSqlite();
	if (restored.size === 0) return 0;
	let added = 0;
	for (const [runId, entry] of restored.entries()) {
		if (!runId || !entry) continue;
		if (params.mergeOnly && params.runs.has(runId)) continue;
		params.runs.set(runId, entry);
		added += 1;
	}
	return added;
}
function getSubagentRunsSnapshot(inMemoryRuns, cache, scope) {
	const merged = /* @__PURE__ */ new Map();
	const key = scope?.key.trim() ?? "";
	if (scope && !key) return merged;
	if (shouldReadPersistedSubagentRuns()) try {
		const cached = scope ? getFreshPersistedSubagentRunsSnapshot(cache, Date.now()) : null;
		const persisted = scope ? cached ? [...cached.values()].filter((entry) => scope.matches(entry, key)) : scope.load(key) : loadPersistedSubagentRunsForRead(cache).values();
		for (const entry of persisted) merged.set(entry.runId, scope ? structuredClone(entry) : entry);
	} catch {}
	for (const [runId, entry] of inMemoryRuns) {
		const projected = cache.project(entry);
		if (!scope || scope.matches(projected, key)) merged.set(runId, projected);
		else merged.delete(runId);
	}
	return merged;
}
function getSubagentRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache);
}
function getSubagentSessionListRunsSnapshotForRead(inMemoryRuns) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentSessionListRunsReadCache);
}
function getSubagentRunsSnapshotForController(inMemoryRuns, controllerSessionKey) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		key: controllerSessionKey,
		load: loadSubagentRunsForControllerFromSqlite,
		matches: (entry, key) => (entry.controllerSessionKey?.trim() || entry.requesterSessionKey) === key
	});
}
function getSubagentRunsSnapshotForChildSession(inMemoryRuns, childSessionKey) {
	return getSubagentRunsSnapshot(inMemoryRuns, persistedSubagentRunsReadCache, {
		key: childSessionKey,
		load: loadSubagentRunsForChildSessionFromSqlite,
		matches: (entry, key) => entry.childSessionKey === key
	});
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read.ts
/**
* Read-only subagent registry accessors.
*
* Combines persisted snapshots with in-memory live runs for UI, announce, control, and recovery paths.
*/
/** Builds the session-list index without hydrating full retained registry payloads. */
function buildSubagentSessionListReadIndex(now = Date.now()) {
	return buildSubagentRunReadIndexFromRuns({
		runs: getSubagentSessionListRunsSnapshotForRead(subagentRuns),
		inMemoryRuns: subagentRuns.values(),
		now
	});
}
/** Builds an O(1) latest-run lookup from one persisted and in-memory snapshot. */
function buildLatestSubagentRunReadIndex() {
	return buildLatestSubagentRunReadIndexFromRuns(getSubagentRunsSnapshotForRead(subagentRuns));
}
/** Builds a reusable index from the full readable registry snapshot. */
function buildSubagentRunReadIndex(now = Date.now()) {
	return buildSubagentRunReadIndexFromRuns({
		runs: getSubagentRunsSnapshotForRead(subagentRuns),
		now
	});
}
/** Lists runs controlled by a session key. */
function listSubagentRunsForController(controllerSessionKey, controllerAgentId) {
	return listRunsForControllerFromRuns(getSubagentRunsSnapshotForController(subagentRuns, controllerSessionKey), controllerSessionKey, controllerAgentId);
}
/** Counts active descendant runs for a requester/session tree. */
function countActiveDescendantRuns(rootSessionKey) {
	return countActiveDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Lists descendant runs under a requester/session tree. */
function listDescendantRunsForRequester(rootSessionKey) {
	return listDescendantRunsForRequesterFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** Counts pending descendant runs below a requester/session tree. */
function countPendingDescendantRuns(rootSessionKey) {
	return countPendingDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey);
}
/** True when any descendant run still awaits terminal settle (suspended delivery counts as settled). */
function hasDescendantRunAwaitingSettle(rootSessionKey, excludeRunId, requesterAgentId) {
	return hasDescendantRunAwaitingSettleFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), rootSessionKey, excludeRunId, requesterAgentId);
}
/** Resolves the requester session and normalized origin for a child subagent session. */
function resolveRequesterForChildSession(childSessionKey) {
	const resolved = resolveRequesterForChildSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
	if (!resolved) return null;
	return {
		requesterSessionKey: resolved.requesterSessionKey,
		requesterAgentId: resolved.requesterAgentId,
		requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin)
	};
}
/** True when post-completion announce should be skipped for a child session. */
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey) {
	return shouldIgnorePostCompletionAnnounceForSessionFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), childSessionKey);
}
/** True when the process-local registry still owns an active run for the child session. */
function isSubagentSessionRunActive(childSessionKey) {
	return isSubagentSessionRunActiveFromRuns(subagentRuns, childSessionKey);
}
/** Lists process-local runs requested by one session key. */
function listSubagentRunsForRequester(requesterSessionKey, options) {
	return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
/** Returns whether a registry entry still has a live agent run context. */
function isSubagentRunLive(entry) {
	if (!entry || typeof entry.execution.endedAt === "number") return false;
	return Boolean(getAgentRunContext(entry.runId));
}
/** Returns the run to display for a child session, using live memory before snapshot state. */
function getSessionDisplaySubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsForChildSession(key), key) ?? getSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, key), key);
}
/** Returns the preferred child-session run from its scoped readable snapshot. */
function getSubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, key), key);
}
/** Returns the most recently created run for a child session from readable registry state. */
function getLatestSubagentRunByChildSessionKey(childSessionKey) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsSnapshotForChildSession(subagentRuns, key), key) ?? null;
}
/**
* Returns the authoritative process-local run for mutation ownership checks.
*
* `matches` restricts the search to a row class the caller owns; see
* `getLatestSubagentRunByChildSessionKeyFromRuns`.
*/
function getLatestLiveSubagentRunByChildSessionKey(childSessionKey, matches) {
	const key = childSessionKey.trim();
	if (!key) return null;
	return getLatestSubagentRunByChildSessionKeyFromRuns(getSubagentRunsForChildSession(key), key, matches) ?? null;
}
//#endregion
export { restoreSubagentRunsFromDisk as C, getLatestSubagentRunByChildSessionKeyFromRuns as E, persistSubagentRunsToDiskOrThrow as S, countActiveRunsForSessionFromRuns as T, shouldIgnorePostCompletionAnnounceForSession as _, countPendingDescendantRuns as a, onSubagentRegistryPersisted as b, getSessionDisplaySubagentRunByChildSessionKey as c, isSubagentRunLive as d, isSubagentSessionRunActive as f, resolveRequesterForChildSession as g, listSubagentRunsForRequester as h, countActiveDescendantRuns as i, getSubagentRunByChildSessionKey as l, listSubagentRunsForController as m, buildSubagentRunReadIndex as n, getLatestLiveSubagentRunByChildSessionKey as o, listDescendantRunsForRequester as p, buildSubagentSessionListReadIndex as r, getLatestSubagentRunByChildSessionKey as s, buildLatestSubagentRunReadIndex as t, hasDescendantRunAwaitingSettle as u, clearSubagentRunsReadCacheForTest as v, buildSubagentRunReadIndexFromRuns as w, persistSubagentRunsToDisk as x, getSubagentRunsSnapshotForRead as y };
