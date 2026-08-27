import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { d as CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT } from "./control-ui-contract-eurzifU_.js";
//#region src/gateway/control-ui-session-pr-subscriptions.ts
const CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS = 6e4;
async function loadSessionPullRequests(params) {
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-Bazh5tCq.js");
	return await loadControlUiSessionPullRequests(params);
}
function pushedSnapshot(result) {
	return {
		...result,
		status: result.rateLimited ? "rate-limited" : "ready"
	};
}
const UNAVAILABLE_SNAPSHOT = {
	pullRequests: [],
	rateLimited: false,
	status: "unavailable"
};
function snapshotHash(snapshot) {
	return JSON.stringify(snapshot);
}
function emptySessionDeltas() {
	return Object.create(null);
}
function loaderParams(sessionKey, refresh) {
	const parsed = parseAgentSessionKey(sessionKey);
	const params = parsed?.rest === "global" ? {
		sessionKey: "global",
		agentId: parsed.agentId
	} : { sessionKey };
	return refresh ? {
		...params,
		refresh: true
	} : params;
}
function parseSessionKeys(value) {
	if (!Array.isArray(value) || value.length > 200) return null;
	const keys = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (typeof entry !== "string") return null;
		const key = entry.trim();
		if (!key || key.length > 512) return null;
		if (!seen.has(key)) {
			seen.add(key);
			keys.push(key);
		}
	}
	return keys;
}
function parseControlUiSessionPullRequestsSubscribeParams(value) {
	if (!value || typeof value !== "object" || !("sessionKeys" in value)) return null;
	const raw = value;
	const sessionKeys = parseSessionKeys(raw.sessionKeys);
	const refreshSessionKeys = raw.refreshSessionKeys === void 0 ? [] : parseSessionKeys(raw.refreshSessionKeys);
	if (!sessionKeys || !refreshSessionKeys) return null;
	const watched = new Set(sessionKeys);
	for (const key of refreshSessionKeys) if (!watched.has(key)) return null;
	return {
		sessionKeys,
		refreshSessionKeys
	};
}
/**
* Owns the union of connection replace-sets. Only this union drives GitHub
* refreshes, so hidden/disconnected clients cannot leave orphan polling work.
*/
function createControlUiSessionPullRequestSubscriptions(deps) {
	const subscriptions = /* @__PURE__ */ new Map();
	const replacementTokens = /* @__PURE__ */ new Map();
	const snapshots = /* @__PURE__ */ new Map();
	const inflight = /* @__PURE__ */ new Map();
	const setTimer = deps.setTimer ?? globalThis.setTimeout;
	const clearTimer = deps.clearTimer ?? globalThis.clearTimeout;
	const load = deps.load ?? loadSessionPullRequests;
	let timer = null;
	let stopped = false;
	const subscribersForKey = (sessionKey) => {
		const connIds = /* @__PURE__ */ new Set();
		for (const [connId, keys] of subscriptions) if (keys.has(sessionKey)) connIds.add(connId);
		return connIds;
	};
	const watchedKeys = () => {
		const keys = /* @__PURE__ */ new Set();
		for (const watched of subscriptions.values()) for (const key of watched) keys.add(key);
		return keys;
	};
	const loadSnapshot = (sessionKey, refresh = false) => {
		const pending = inflight.get(sessionKey);
		if (pending) {
			if (!refresh || pending.refresh) return pending.promise;
			return pending.promise.then(() => loadSnapshot(sessionKey, true));
		}
		const promise = load(loaderParams(sessionKey, refresh)).then(pushedSnapshot).catch(() => UNAVAILABLE_SNAPSHOT).finally(() => {
			if (inflight.get(sessionKey)?.promise === promise) inflight.delete(sessionKey);
		});
		inflight.set(sessionKey, {
			promise,
			refresh
		});
		return promise;
	};
	const push = (connIds, sessions) => {
		if (connIds.size === 0 || Object.keys(sessions).length === 0) return;
		deps.broadcastToConnIds(CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT, { sessions }, connIds);
	};
	const pruneOrphans = () => {
		const watched = watchedKeys();
		for (const key of snapshots.keys()) if (!watched.has(key)) snapshots.delete(key);
	};
	const schedulePoll = () => {
		if (stopped || timer !== null || watchedKeys().size === 0) return;
		timer = setTimer(() => {
			timer = null;
			pollNow().finally(schedulePoll);
		}, CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS);
		timer.unref?.();
	};
	const pollNow = async () => {
		if (stopped) return;
		for (const sessionKey of watchedKeys()) {
			if (stopped) break;
			const snapshot = await loadSnapshot(sessionKey);
			const connIds = subscribersForKey(sessionKey);
			if (connIds.size === 0) continue;
			const hash = snapshotHash(snapshot);
			if (snapshots.get(sessionKey)?.hash === hash) continue;
			snapshots.set(sessionKey, {
				hash,
				snapshot
			});
			const sessions = emptySessionDeltas();
			sessions[sessionKey] = snapshot;
			push(connIds, sessions);
		}
	};
	const replace = async (connId, sessionKeys, refreshSessionKeys = /* @__PURE__ */ new Set()) => {
		if (stopped) return;
		const normalizedConnId = connId.trim();
		if (!normalizedConnId) return;
		const replacementToken = {};
		replacementTokens.set(normalizedConnId, replacementToken);
		const next = new Set(sessionKeys);
		if (next.size === 0) {
			subscriptions.delete(normalizedConnId);
			pruneOrphans();
			if (watchedKeys().size === 0 && timer !== null) {
				clearTimer(timer);
				timer = null;
			}
			return;
		}
		subscriptions.set(normalizedConnId, next);
		pruneOrphans();
		schedulePoll();
		for (const sessionKey of next) {
			if (stopped) break;
			const previous = snapshots.get(sessionKey);
			const refresh = refreshSessionKeys.has(sessionKey);
			const cached = refresh ? void 0 : previous?.snapshot;
			const snapshot = cached ?? await loadSnapshot(sessionKey, refresh);
			if (replacementTokens.get(normalizedConnId) !== replacementToken) return;
			const hash = snapshotHash(snapshot);
			if (!cached) snapshots.set(sessionKey, {
				hash,
				snapshot
			});
			const sessions = emptySessionDeltas();
			sessions[sessionKey] = snapshot;
			if (refresh && previous?.hash !== hash) push(subscribersForKey(sessionKey), sessions);
			else push(/* @__PURE__ */ new Set([normalizedConnId]), sessions);
		}
	};
	const unsubscribe = (connId) => {
		const normalizedConnId = connId.trim();
		if (!normalizedConnId) return;
		replacementTokens.delete(normalizedConnId);
		subscriptions.delete(normalizedConnId);
		pruneOrphans();
		if (watchedKeys().size === 0 && timer !== null) {
			clearTimer(timer);
			timer = null;
		}
	};
	const stop = () => {
		stopped = true;
		if (timer !== null) {
			clearTimer(timer);
			timer = null;
		}
		subscriptions.clear();
		replacementTokens.clear();
		snapshots.clear();
		inflight.clear();
	};
	return {
		replace,
		unsubscribe,
		pollNow,
		stop
	};
}
//#endregion
export { parseControlUiSessionPullRequestsSubscribeParams as n, createControlUiSessionPullRequestSubscriptions as t };
