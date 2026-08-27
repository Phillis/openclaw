import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { c as isAgentEventLifecycleGenerationCurrent, f as registerAgentEventLifecycleRotationHandler } from "./agent-events-Cmj8toCy.js";
import { d as listActiveReplyRunSessionKeys, h as resolveActiveReplyRunSessionId, o as getActiveReplyRunCount, u as listActiveReplyRunSessionIds } from "./reply-run-registry-CeOg3aTN.js";
//#region src/agents/embedded-agent-runner/run-state.ts
const embeddedRunState = resolveGlobalSingleton(Symbol.for("openclaw.embeddedRunState"), () => ({
	activeRuns: /* @__PURE__ */ new Map(),
	activeRunsByRunId: /* @__PURE__ */ new Map(),
	activeRunLifecycleGenerations: /* @__PURE__ */ new WeakMap(),
	retainedAbortabilityRunIds: /* @__PURE__ */ new Set(),
	snapshots: /* @__PURE__ */ new Map(),
	sessionIdsByKey: /* @__PURE__ */ new Map(),
	sessionIdsByFile: /* @__PURE__ */ new Map(),
	abandonedRunsBySessionId: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByKey: /* @__PURE__ */ new Map(),
	abandonedRunSessionIdsByFile: /* @__PURE__ */ new Map(),
	waiters: /* @__PURE__ */ new Map()
}));
const ACTIVE_EMBEDDED_RUNS = embeddedRunState.activeRuns ?? (embeddedRunState.activeRuns = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUNS_BY_RUN_ID = embeddedRunState.activeRunsByRunId ?? (embeddedRunState.activeRunsByRunId = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS = embeddedRunState.activeRunLifecycleGenerations ?? (embeddedRunState.activeRunLifecycleGenerations = /* @__PURE__ */ new WeakMap());
const RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS = embeddedRunState.retainedAbortabilityRunIds ?? (embeddedRunState.retainedAbortabilityRunIds = /* @__PURE__ */ new Set());
const ACTIVE_EMBEDDED_RUN_SNAPSHOTS = embeddedRunState.snapshots ?? (embeddedRunState.snapshots = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.sessionIdsByKey ?? (embeddedRunState.sessionIdsByKey = /* @__PURE__ */ new Map());
const ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.sessionIdsByFile ?? (embeddedRunState.sessionIdsByFile = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID = embeddedRunState.abandonedRunsBySessionId ?? (embeddedRunState.abandonedRunsBySessionId = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY = embeddedRunState.abandonedRunSessionIdsByKey ?? (embeddedRunState.abandonedRunSessionIdsByKey = /* @__PURE__ */ new Map());
const ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE = embeddedRunState.abandonedRunSessionIdsByFile ?? (embeddedRunState.abandonedRunSessionIdsByFile = /* @__PURE__ */ new Map());
const EMBEDDED_RUN_WAITERS = embeddedRunState.waiters ?? (embeddedRunState.waiters = /* @__PURE__ */ new Map());
function evictPriorLifecycleEmbeddedRuns() {
	const staleHandles = /* @__PURE__ */ new Set();
	for (const [sessionId, handle] of ACTIVE_EMBEDDED_RUNS) {
		const lifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
		if (lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) continue;
		staleHandles.add(handle);
		if (ACTIVE_EMBEDDED_RUNS.get(sessionId) === handle) ACTIVE_EMBEDDED_RUNS.delete(sessionId);
		ACTIVE_EMBEDDED_RUN_SNAPSHOTS.delete(sessionId);
	}
	for (const [runId, handle] of ACTIVE_EMBEDDED_RUNS_BY_RUN_ID) {
		const lifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
		if (lifecycleGeneration && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) continue;
		staleHandles.add(handle);
		if (ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(runId) === handle) {
			ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.delete(runId);
			RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS.delete(runId);
		}
	}
	for (const [sessionKey, sessionId] of ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.delete(sessionKey);
	for (const [sessionFile, sessionId] of ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.delete(sessionFile);
	for (const [sessionId, waiters] of EMBEDDED_RUN_WAITERS) {
		if (ACTIVE_EMBEDDED_RUNS.has(sessionId)) continue;
		EMBEDDED_RUN_WAITERS.delete(sessionId);
		for (const waiter of waiters) {
			if (waiter.timer) clearTimeout(waiter.timer);
			waiter.resolve(true);
		}
	}
	const abortErrors = [];
	for (const handle of staleHandles) try {
		handle.abort("restart");
	} catch (error) {
		abortErrors.push(error);
	}
	if (abortErrors.length > 0) throw new AggregateError(abortErrors, "Failed to abort stale embedded agent runs");
}
registerAgentEventLifecycleRotationHandler("embedded-agent-runs", evictPriorLifecycleEmbeddedRuns);
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
function getActiveEmbeddedRunCount() {
	let activeCount = ACTIVE_EMBEDDED_RUNS.size;
	for (const sessionId of listActiveReplyRunSessionIds()) if (!ACTIVE_EMBEDDED_RUNS.has(sessionId)) activeCount += 1;
	return Math.max(activeCount, getActiveReplyRunCount());
}
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
function listActiveEmbeddedRunSessionKeys() {
	return [.../* @__PURE__ */ new Set([...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.keys(), ...listActiveReplyRunSessionKeys()])].toSorted((a, b) => a.localeCompare(b));
}
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
function listActiveEmbeddedRunSessionIds() {
	return [.../* @__PURE__ */ new Set([
		...ACTIVE_EMBEDDED_RUNS.keys(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.values(),
		...ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE.values(),
		...listActiveReplyRunSessionIds()
	])].toSorted((a, b) => a.localeCompare(b));
}
function setActiveEmbeddedRunLifecycleGeneration(handle, lifecycleGeneration) {
	const existingLifecycleGeneration = ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.get(handle);
	if (existingLifecycleGeneration !== void 0) return existingLifecycleGeneration;
	ACTIVE_EMBEDDED_RUN_LIFECYCLE_GENERATIONS.set(handle, lifecycleGeneration);
	return lifecycleGeneration;
}
/** Resolves the current session id for an active run after resets or compaction. */
function resolveActiveEmbeddedRunSessionId(sessionKey) {
	const normalizedSessionKey = sessionKey.trim();
	if (!normalizedSessionKey) return;
	return resolveActiveReplyRunSessionId(normalizedSessionKey) ?? ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY.get(normalizedSessionKey);
}
//#endregion
export { ACTIVE_EMBEDDED_RUNS_BY_RUN_ID as a, ACTIVE_EMBEDDED_RUN_SNAPSHOTS as c, getActiveEmbeddedRunCount as d, listActiveEmbeddedRunSessionIds as f, setActiveEmbeddedRunLifecycleGeneration as h, ACTIVE_EMBEDDED_RUNS as i, EMBEDDED_RUN_WAITERS as l, resolveActiveEmbeddedRunSessionId as m, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_FILE as n, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_FILE as o, listActiveEmbeddedRunSessionKeys as p, ABANDONED_EMBEDDED_RUN_SESSION_IDS_BY_KEY as r, ACTIVE_EMBEDDED_RUN_SESSION_IDS_BY_KEY as s, ABANDONED_EMBEDDED_RUNS_BY_SESSION_ID as t, RETAINED_EMBEDDED_RUN_ABORTABILITY_RUN_IDS as u };
