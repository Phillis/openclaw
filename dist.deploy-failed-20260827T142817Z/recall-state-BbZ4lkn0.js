import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as coerceErrorMessage } from "./error-coercion-DisD0JTb.js";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./error-runtime-CmlvK1A3.js";
import "./number-runtime-CoAPZzJY.js";
import "./text-utility-runtime-LRU688AB.js";
import { t as closeActiveMemorySearchManager } from "./memory-host-search-Bep3vghH.js";
import { v as DEFAULT_MAX_CACHE_ENTRIES } from "./types-CyvGmPEE.js";
import { l as resolveActiveMemoryCleanupConfig } from "./config-Bf9b9OJ-.js";
import crypto from "node:crypto";
//#region extensions/active-memory/recall-state.ts
let lastActiveRecallCacheSweepAt = 0;
const activeRecallCache = /* @__PURE__ */ new Map();
const activeRecallRuns = /* @__PURE__ */ new Map();
const timeoutCircuitBreaker = /* @__PURE__ */ new Map();
function buildCircuitBreakerKey(agentId, provider, model) {
	return `${agentId}:${provider ?? "unknown"}/${model ?? "unknown"}`;
}
function isCircuitBreakerOpen(key, maxTimeouts, cooldownMs) {
	const entry = timeoutCircuitBreaker.get(key);
	if (!entry || entry.consecutiveTimeouts < maxTimeouts) return false;
	if (Date.now() - entry.lastTimeoutAt >= cooldownMs) {
		timeoutCircuitBreaker.delete(key);
		return false;
	}
	return true;
}
function recordCircuitBreakerTimeout(key) {
	const entry = timeoutCircuitBreaker.get(key);
	if (entry) {
		entry.consecutiveTimeouts++;
		entry.lastTimeoutAt = Date.now();
	} else timeoutCircuitBreaker.set(key, {
		consecutiveTimeouts: 1,
		lastTimeoutAt: Date.now()
	});
}
function resetCircuitBreaker(key) {
	timeoutCircuitBreaker.delete(key);
}
function scheduleMemorySearchCleanupAfterTimeout(api, logPrefix, agentId) {
	return new Promise((resolve) => {
		const cfg = resolveActiveMemoryCleanupConfig(api);
		setTimeout(() => {
			closeActiveMemorySearchManager({
				cfg: cfg ?? api.config,
				agentId
			}).then(() => {
				api.logger.debug?.(`${logPrefix} released memory search managers after timeout`);
			}).catch((error) => {
				const message = toSingleLineErrorMessage(error);
				api.logger.warn?.(`${logPrefix} failed to release memory search managers after timeout: ${message}`);
			}).finally(resolve);
		}, 0);
	});
}
async function resolveActiveRecallForRun(runId, start) {
	const existing = activeRecallRuns.get(runId);
	if (existing?.timeoutCleanup) {
		await Promise.allSettled([existing.promise, existing.timeoutCleanup]);
		if (activeRecallRuns.get(runId) === existing) activeRecallRuns.delete(runId);
		return await resolveActiveRecallForRun(runId, start);
	}
	if (existing) return await existing.promise;
	const entry = { promise: Promise.resolve().then(() => start((cleanup) => {
		entry.timeoutCleanup = cleanup;
		Promise.allSettled([entry.promise, cleanup]).then(() => {
			if (activeRecallRuns.get(runId) === entry) activeRecallRuns.delete(runId);
		});
	})) };
	activeRecallRuns.set(runId, entry);
	entry.promise.catch(() => {
		if (!entry.timeoutCleanup && activeRecallRuns.get(runId) === entry) activeRecallRuns.delete(runId);
	});
	return await entry.promise;
}
function forgetActiveRecallRun(runId) {
	if (runId) activeRecallRuns.delete(runId);
}
function buildCacheKey(params) {
	const hash = crypto.createHash("sha1").update(params.query).digest("hex");
	return `${params.agentId}:${params.sessionKey ?? params.sessionId ?? "none"}:${hash}`;
}
function getCachedResult(cacheKey) {
	const cached = activeRecallCache.get(cacheKey);
	if (!cached) return;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || asDateTimestampMs(cached.expiresAt) === void 0 || cached.expiresAt <= now) {
		activeRecallCache.delete(cacheKey);
		return;
	}
	return cached.result;
}
function setCachedResult(cacheKey, result, ttlMs) {
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	if (activeRecallCache.size >= 1e3 || now !== void 0 && now - lastActiveRecallCacheSweepAt >= 1e3) {
		sweepExpiredCacheEntries(now);
		if (now !== void 0) lastActiveRecallCacheSweepAt = now;
	}
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (expiresAt === void 0) {
		activeRecallCache.delete(cacheKey);
		return;
	}
	if (activeRecallCache.has(cacheKey)) activeRecallCache.delete(cacheKey);
	activeRecallCache.set(cacheKey, {
		expiresAt,
		result
	});
	while (activeRecallCache.size > DEFAULT_MAX_CACHE_ENTRIES) {
		const oldestKey = activeRecallCache.keys().next().value;
		if (!oldestKey) break;
		activeRecallCache.delete(oldestKey);
	}
}
function sweepExpiredCacheEntries(now = asDateTimestampMs(Date.now())) {
	if (now === void 0) {
		activeRecallCache.clear();
		return;
	}
	for (const [cacheKey, cached] of activeRecallCache.entries()) if (asDateTimestampMs(cached.expiresAt) === void 0 || cached.expiresAt <= now) activeRecallCache.delete(cacheKey);
}
function toSingleLineLogValue(value) {
	const singleLine = (typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol" ? String(value) : value == null ? "" : JSON.stringify(value)).replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").trim();
	return singleLine.length > 300 ? `${truncateUtf16Safe(singleLine, 300)}...` : singleLine;
}
function toSingleLineErrorMessage(error) {
	return toSingleLineLogValue(coerceErrorMessage(error));
}
function shouldCacheResult(result) {
	return result.status === "ok" && result.summary.length > 0;
}
function resetActiveRecallStateForTests() {
	activeRecallCache.clear();
	activeRecallRuns.clear();
	timeoutCircuitBreaker.clear();
	lastActiveRecallCacheSweepAt = 0;
}
function getCircuitBreakerEntry(key) {
	return timeoutCircuitBreaker.get(key);
}
//#endregion
export { getCircuitBreakerEntry as a, resetActiveRecallStateForTests as c, scheduleMemorySearchCleanupAfterTimeout as d, setCachedResult as f, toSingleLineLogValue as h, getCachedResult as i, resetCircuitBreaker as l, toSingleLineErrorMessage as m, buildCircuitBreakerKey as n, isCircuitBreakerOpen as o, shouldCacheResult as p, forgetActiveRecallRun as r, recordCircuitBreakerTimeout as s, buildCacheKey as t, resolveActiveRecallForRun as u };
