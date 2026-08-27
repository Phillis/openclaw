import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT } from "./control-ui-contract-CgrOMhfo.js";
import pLimit from "p-limit";
//#region src/gateway/control-ui-session-pr-subscriptions.ts
const CONTROL_UI_SESSION_PR_POLL_INTERVAL_MS = 6e4;
const CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY = 4;
async function loadSessionPullRequests(params) {
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-BTfvhePF.js");
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
		for (const [connId, { keys }] of subscriptions) if (keys.has(sessionKey)) connIds.add(connId);
		return connIds;
	};
	const watchedKeys = () => {
		const keys = /* @__PURE__ */ new Set();
		for (const { keys: watched } of subscriptions.values()) for (const key of watched) keys.add(key);
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
	const push = (connIds, sessionKey, snapshot) => {
		if (connIds.size === 0) return;
		const sessions = emptySessionDeltas();
		sessions[sessionKey] = snapshot;
		deps.broadcastToConnIds(CONTROL_UI_SESSION_PULL_REQUESTS_CHANGED_EVENT, { sessions }, connIds);
		for (const connId of connIds) {
			const subscription = subscriptions.get(connId);
			if (subscription?.keys.has(sessionKey)) subscription.delivered.add(sessionKey);
		}
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
	const loadKeysInParallel = async (sessionKeys, loadKey) => {
		const limit = pLimit(CONTROL_UI_SESSION_PR_LOAD_CONCURRENCY);
		await Promise.all(Array.from(sessionKeys, (sessionKey) => limit(() => loadKey(sessionKey))));
	};
	const pollNow = async () => {
		if (stopped) return;
		await loadKeysInParallel(watchedKeys(), async (sessionKey) => {
			if (stopped || subscribersForKey(sessionKey).size === 0) return;
			const snapshot = await loadSnapshot(sessionKey);
			const connIds = subscribersForKey(sessionKey);
			if (connIds.size === 0) return;
			const hash = snapshotHash(snapshot);
			if (snapshots.get(sessionKey)?.hash === hash) return;
			snapshots.set(sessionKey, {
				hash,
				snapshot
			});
			push(connIds, sessionKey, snapshot);
		});
	};
	const replace = async (connId, sessionKeys, refreshSessionKeys = /* @__PURE__ */ new Set()) => {
		if (stopped) return;
		const normalizedConnId = connId.trim();
		if (!normalizedConnId || deps.isConnectionActive?.(normalizedConnId) === false) return;
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
		const delivered = subscriptions.get(normalizedConnId)?.delivered ?? /* @__PURE__ */ new Set();
		for (const sessionKey of delivered) if (!next.has(sessionKey)) delivered.delete(sessionKey);
		subscriptions.set(normalizedConnId, {
			keys: next,
			delivered
		});
		pruneOrphans();
		schedulePoll();
		const pendingKeys = [];
		for (const sessionKey of next) {
			const previous = snapshots.get(sessionKey);
			const cached = refreshSessionKeys.has(sessionKey) ? void 0 : previous?.snapshot;
			if (cached) {
				if (!delivered.has(sessionKey)) push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, cached);
				continue;
			}
			pendingKeys.push(sessionKey);
		}
		await loadKeysInParallel(pendingKeys, async (sessionKey) => {
			if (stopped || replacementTokens.get(normalizedConnId) !== replacementToken) return;
			const previous = snapshots.get(sessionKey);
			const refresh = refreshSessionKeys.has(sessionKey);
			const snapshot = await loadSnapshot(sessionKey, refresh);
			if (replacementTokens.get(normalizedConnId) !== replacementToken) return;
			const hash = snapshotHash(snapshot);
			snapshots.set(sessionKey, {
				hash,
				snapshot
			});
			if (refresh && previous?.hash !== hash) push(subscribersForKey(sessionKey), sessionKey, snapshot);
			else push(/* @__PURE__ */ new Set([normalizedConnId]), sessionKey, snapshot);
		});
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
