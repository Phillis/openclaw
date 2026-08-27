import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.js";
import { r as computeBackoffSchedule } from "./src-BQ327IOM.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
import { n as getRetryAttemptErrors } from "./retry-DIUON3ys.js";
import { a as isPlatformMessageNotDispatchedError, o as isPlatformMessageRejectedError } from "./deliver-types-w6kiySpD.js";
//#region src/infra/delivery-recovery.shared.ts
const RECOVERY_BACKOFF_MS = [
	5e3,
	25e3,
	12e4,
	6e5
];
const RECOVERY_REPLAY_SPACING_MS = 250;
const PRE_CONNECT_ERROR_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ENETDOWN",
	"ENETUNREACH",
	"EHOSTUNREACH"
]);
const TRANSPORT_ERROR_CODE_RE = /^(?:E(?:AI_|CONN|NET|HOST|ADDR|PIPE|TIMEDOUT|SOCKET)|UND_ERR_|ERR_(?:NETWORK|HTTP2|QUIC|TLS|SSL))/;
const UNPROVEN_ERROR_BRANCH = "unproven delivery error branch";
function createEmptyDeliveryRecoverySummary() {
	return {
		recovered: 0,
		failed: 0,
		skippedMaxRetries: 0,
		deferredBackoff: 0
	};
}
function resolveDeliveryRecoveryDeadlineMs(maxRecoveryMs) {
	const durationMs = resolveNonNegativeIntegerOption(maxRecoveryMs, 6e4);
	if (durationMs <= 0) return resolveDateTimestampMs(Date.now());
	return resolveExpiresAtMsFromDurationMs(durationMs) ?? resolveDateTimestampMs(Date.now());
}
function isDeliveryRecoveryRetryEligible(entry, now) {
	if (entry.availableAt && now < entry.availableAt) return {
		eligible: false,
		remainingBackoffMs: entry.availableAt - now
	};
	const backoff = computeBackoffMs(entry.retryCount);
	if (backoff <= 0 || entry.retryCount === 0 && entry.lastAttemptAt === void 0) return { eligible: true };
	const lastAttemptAt = entry.lastAttemptAt;
	const remainingBackoffMs = (typeof lastAttemptAt === "number" && Number.isFinite(lastAttemptAt) && lastAttemptAt > 0 ? lastAttemptAt : entry.enqueuedAt) + backoff - now;
	return remainingBackoffMs > 0 ? {
		eligible: false,
		remainingBackoffMs
	} : { eligible: true };
}
function preserveProofBranches(branches) {
	return branches?.map((branch) => branch ?? UNPROVEN_ERROR_BRANCH) ?? [];
}
function isProvenPreConnectCandidate(candidate) {
	const code = extractErrorCode(candidate)?.trim().toUpperCase();
	if (code === "UND_ERR_CONNECT_TIMEOUT" || code === "UND_ERR_DNS_RESOLVE_FAILED") return true;
	if (!code || !PRE_CONNECT_ERROR_CODES.has(code) || !candidate || typeof candidate !== "object") return false;
	const syscall = candidate.syscall;
	return syscall === "connect" || syscall === "getaddrinfo";
}
function nestedErrorCandidates(current) {
	const retryBranches = preserveProofBranches(getRetryAttemptErrors(current));
	if (isPlatformMessageNotDispatchedError(current) || isProvenPreConnectCandidate(current)) return retryBranches;
	const nestedObjects = [
		current.cause,
		current.original,
		current.error,
		current.reason
	].filter((candidate) => candidate !== null && typeof candidate === "object");
	const aggregateBranches = Array.isArray(current.errors) ? preserveProofBranches(current.errors) : [];
	return [
		...retryBranches,
		...aggregateBranches,
		...nestedObjects
	];
}
function isProvenDeliveryNotSentError(err) {
	let foundNotSentProof = false;
	for (const candidate of collectErrorGraphCandidates(err, nestedErrorCandidates)) {
		const code = extractErrorCode(candidate)?.trim().toUpperCase();
		if (isPlatformMessageNotDispatchedError(candidate) || isProvenPreConnectCandidate(candidate)) {
			foundNotSentProof = true;
			continue;
		}
		const nested = candidate && typeof candidate === "object" ? nestedErrorCandidates(candidate) : [];
		const isPreConnectAggregateSummary = candidate !== null && typeof candidate === "object" && Array.isArray(candidate.errors) && code !== void 0 && PRE_CONNECT_ERROR_CODES.has(code);
		if (nested.length === 0 || code && !isPreConnectAggregateSummary && (PRE_CONNECT_ERROR_CODES.has(code) || TRANSPORT_ERROR_CODE_RE.test(code))) return false;
	}
	return foundNotSentProof;
}
/** Finds a provider's permanent pre-dispatch rejection through delivery wrappers. */
function findPlatformMessageRejectedError(err) {
	for (const candidate of collectErrorGraphCandidates(err, nestedErrorCandidates)) if (isPlatformMessageRejectedError(candidate)) return candidate;
}
function computeBackoffMs(retryCount) {
	return computeBackoffSchedule(RECOVERY_BACKOFF_MS, retryCount);
}
function getErrnoCode(err) {
	return err && typeof err === "object" && "code" in err ? String(err.code) : null;
}
function createRecoveryReplayPacer() {
	let lastReplayStartedAt = 0;
	let waitQueue = Promise.resolve();
	return { async wait(deadlineMs) {
		let releaseWaiter = () => {};
		const previousWaiter = waitQueue;
		waitQueue = new Promise((resolve) => {
			releaseWaiter = resolve;
		});
		await previousWaiter;
		try {
			const now = Date.now();
			if (deadlineMs !== void 0 && now >= deadlineMs) return "deadline-exceeded";
			const elapsedMs = now - lastReplayStartedAt;
			const waitMs = elapsedMs < 0 ? 0 : Math.max(0, RECOVERY_REPLAY_SPACING_MS - elapsedMs);
			if (waitMs > 0) {
				const remainingBudgetMs = deadlineMs === void 0 ? waitMs : Math.max(0, deadlineMs - now);
				await sleep(Math.min(waitMs, remainingBudgetMs));
			}
			if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return "deadline-exceeded";
			lastReplayStartedAt = Date.now();
			return "ready";
		} finally {
			releaseWaiter();
		}
	} };
}
/** Own one queue namespace's live claims, drain exclusion, and replay pacing. */
function createDeliveryRecoveryCoordinator() {
	const activeDrains = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const replayPacer = createRecoveryReplayPacer();
	async function withClaim(entryId, run) {
		if (activeEntries.has(entryId)) return { status: "claimed-by-other-owner" };
		activeEntries.add(entryId);
		try {
			return {
				status: "claimed",
				value: await run()
			};
		} finally {
			activeEntries.delete(entryId);
		}
	}
	return {
		withClaim,
		async withDrain(drainKey, run) {
			if (activeDrains.has(drainKey)) return false;
			activeDrains.add(drainKey);
			try {
				await run();
				return true;
			} finally {
				activeDrains.delete(drainKey);
			}
		},
		async scan(options) {
			for (const entry of options.entries.toSorted((a, b) => a.enqueuedAt - b.enqueuedAt)) {
				if (options.deadlineMs !== void 0 && Date.now() >= options.deadlineMs) {
					options.onDeadlineExceeded?.();
					break;
				}
				const claim = await withClaim(entry.id, async () => {
					const current = await options.loadEntry(entry.id);
					if (!current) {
						options.onMissingEntry?.(entry);
						return "continue";
					}
					return await options.onEntry(current) ?? "continue";
				});
				if (claim.status === "claimed-by-other-owner") {
					options.onClaimConflict?.(entry);
					continue;
				}
				if (claim.value === "stop") break;
			}
		},
		waitForReplay(deadlineMs) {
			return replayPacer.wait(deadlineMs);
		}
	};
}
//#endregion
export { getErrnoCode as a, resolveDeliveryRecoveryDeadlineMs as c, findPlatformMessageRejectedError as i, createDeliveryRecoveryCoordinator as n, isDeliveryRecoveryRetryEligible as o, createEmptyDeliveryRecoverySummary as r, isProvenDeliveryNotSentError as s, computeBackoffMs as t };
