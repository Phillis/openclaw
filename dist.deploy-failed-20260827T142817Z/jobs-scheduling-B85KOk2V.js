import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { d as normalizeOptionalAgentId } from "./session-key-D8GLfPr_.js";
import { N as normalizePayloadToSystemText, w as resolveCronStreamBatching, x as createCronStreamSourceIdentity, z as coerceFiniteScheduleNumber } from "./row-codec-DhVyr5Q_.js";
import { t as parseAbsoluteTimeMs } from "./parse-CXcqOHNZ.js";
import { n as resolveCronStaggerMs } from "./stagger-DfgzUk9D.js";
import { s as isCronJobActive } from "./active-jobs-D5QwO55Q.js";
import { n as computePreviousRunAtMs, t as computeNextRunAtMs } from "./schedule-Dqi0D-c0.js";
import crypto from "node:crypto";
//#region src/cron/failure-notification-text.ts
/** Keeps arbitrary runtime errors in automation history instead of chat copy. */
function cronFailureDetailLines(errorReason) {
	return errorReason ? [`Cause: ${errorReason}`] : ["Check automation history for details."];
}
//#endregion
//#region src/cron/service/auto-disable.ts
/** Shared state and owner-notification policy for cron auto-disable transitions. */
/**
* Run failures get more room than schedule errors (10 vs. 3) because provider
* and network errors are often transient, and restart-interrupted runs count too.
*/
const MAX_CONSECUTIVE_RUN_FAILURES = 10;
function autoDisableReasonLabel(reason) {
	return reason === "consecutive-failures" ? "run failures" : "schedule errors";
}
/** Records one canonical auto-disable fact and queues its owning-agent notification. */
function autoDisableCronJob(params) {
	const { state, job } = params;
	if (!job.enabled || job.state.autoDisabled) return false;
	job.enabled = false;
	job.state.nextRunAtMs = void 0;
	job.state.autoDisabled = {
		reason: params.reason,
		atMs: params.atMs,
		consecutiveErrors: params.consecutiveErrors
	};
	const name = truncateUtf16Safe((job.name || job.id).replace(/\s+/g, " ").trim(), 120);
	const errorReason = params.reason === "consecutive-failures" ? job.state.lastErrorReason : void 0;
	const text = [
		`⚠️ Automation "${name}" was auto-disabled after ${params.consecutiveErrors} consecutive ${autoDisableReasonLabel(params.reason)}.`,
		...cronFailureDetailLines(errorReason),
		`Fix the underlying cause, then run \`openclaw automations enable ${job.id}\` to re-enable it.`
	].join("\n");
	const notify = () => {
		const agentId = normalizeOptionalAgentId(job.agentId) ?? normalizeOptionalAgentId(parseAgentSessionKey(job.sessionKey)?.agentId) ?? normalizeOptionalAgentId(state.deps.resolveDefaultAgentId?.()) ?? normalizeOptionalAgentId(state.deps.defaultAgentId);
		const deliveryContext = agentId || job.sessionKey ? state.deps.resolveOriginDeliveryContext?.({
			agentId,
			sessionKey: job.sessionKey
		}) : void 0;
		state.deps.enqueueSystemEvent(text, {
			agentId,
			sessionKey: job.sessionKey,
			contextKey: `cron:${job.id}:auto-disabled`,
			...deliveryContext ? { deliveryContext } : {}
		});
		state.deps.requestHeartbeat({
			source: "cron",
			intent: "event",
			reason: `cron:${job.id}:auto-disabled`,
			agentId,
			sessionKey: job.sessionKey
		});
	};
	if (params.deferredNotifications) params.deferredNotifications.push(notify);
	else notify();
	return true;
}
/** Auto-disables only time-based recurring jobs once their run-error streak reaches the limit. */
function maybeAutoDisableCronJobAfterRunFailure(params) {
	const consecutiveErrors = params.job.state.consecutiveErrors ?? 0;
	if (params.job.schedule.kind !== "cron" && params.job.schedule.kind !== "every" || consecutiveErrors < MAX_CONSECUTIVE_RUN_FAILURES) return false;
	return autoDisableCronJob({
		...params,
		reason: "consecutive-failures",
		consecutiveErrors
	});
}
//#endregion
//#region src/cron/service/jobs-scheduling.ts
/** Scheduling state and next-run computation for cron jobs. */
const STUCK_RUN_MS = 7200 * 1e3;
const STAGGER_OFFSET_CACHE_MAX = 4096;
const staggerOffsetCache = /* @__PURE__ */ new Map();
function ownsCronRunMarker(state, jobId, markerAtMs, requireForce = false) {
	const reservation = state.queuedRunReservationsByJobId.get(jobId);
	return reservation?.markerAtMs === markerAtMs && (!requireForce || reservation.preserveWhenDisabled);
}
function normalizeStreamScheduleBounds(schedule) {
	if (schedule.kind !== "stream") return schedule;
	const resolved = resolveCronStreamBatching(schedule);
	return {
		...schedule,
		...schedule.batchMs !== void 0 ? { batchMs: resolved.batchMs } : {},
		...schedule.maxBatchBytes !== void 0 ? { maxBatchBytes: resolved.maxBatchBytes } : {}
	};
}
/** Default retry delays applied after consecutive cron execution errors. */
const DEFAULT_ERROR_BACKOFF_SCHEDULE_MS = [
	3e4,
	6e4,
	5 * 6e4,
	15 * 6e4,
	60 * 6e4
];
function isFiniteTimestamp(value) {
	return asDateTimestampMs(value) !== void 0;
}
/** Returns whether a stored next-run timestamp is finite and schedulable. */
function hasScheduledNextRunAtMs(value) {
	return isFiniteTimestamp(value) && value > 0;
}
/** Resolves the newest persisted cron run status while older state is still readable. */
function resolveJobLastRunStatus(job) {
	return job.state.lastRunStatus ?? job.state.lastStatus;
}
/** Resolves the retry backoff delay for a one-based consecutive error count. */
function errorBackoffMs(consecutiveErrors, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	const idx = Math.min(consecutiveErrors - 1, scheduleMs.length - 1);
	return expectDefined(scheduleMs[Math.max(0, idx)], "schedule ms entry at math.max(0, idx)") ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS[0];
}
/** Returns the earliest retry timestamp after a failed cron run and its runtime duration. */
function resolveJobErrorBackoffUntilMs(job, scheduleMs = DEFAULT_ERROR_BACKOFF_SCHEDULE_MS) {
	if (resolveJobLastRunStatus(job) !== "error" || !isFiniteTimestamp(job.state.lastRunAtMs)) return;
	const consecutiveErrorsRaw = job.state.consecutiveErrors;
	const consecutiveErrors = typeof consecutiveErrorsRaw === "number" && Number.isFinite(consecutiveErrorsRaw) ? Math.max(1, Math.floor(consecutiveErrorsRaw)) : 1;
	const lastDurationMs = typeof job.state.lastDurationMs === "number" && Number.isFinite(job.state.lastDurationMs) ? Math.max(0, Math.floor(job.state.lastDurationMs)) : 0;
	return asDateTimestampMs(job.state.lastRunAtMs + lastDurationMs + errorBackoffMs(consecutiveErrors, scheduleMs));
}
function resolveStableCronOffsetMs(jobId, staggerMs) {
	if (staggerMs <= 1) return 0;
	const cacheKey = `${staggerMs}:${jobId}`;
	const cached = staggerOffsetCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const offset = crypto.createHash("sha256").update(jobId).digest().readUInt32BE(0) % staggerMs;
	pruneMapToMaxSize(staggerOffsetCache, STAGGER_OFFSET_CACHE_MAX - 1);
	staggerOffsetCache.set(cacheKey, offset);
	return offset;
}
function computeStaggeredCronNextRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return computeNextRunAtMs(job.schedule, nowMs);
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computeNextRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const baseNext = computeNextRunAtMs(job.schedule, cursorMs);
		if (baseNext === void 0) return;
		const shifted = baseNext + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted > nowMs) return shifted;
		cursorMs = Math.max(cursorMs + 1, baseNext + 1e3);
	}
}
function computeStaggeredCronPreviousRunAtMs(job, nowMs) {
	if (job.schedule.kind !== "cron") return;
	const staggerMs = resolveCronStaggerMs(job.schedule);
	const offsetMs = resolveStableCronOffsetMs(job.id, staggerMs);
	if (offsetMs <= 0) return computePreviousRunAtMs(job.schedule, nowMs);
	let cursorMs = Math.max(0, nowMs - offsetMs);
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const basePrevious = computePreviousRunAtMs(job.schedule, cursorMs);
		if (basePrevious === void 0) return;
		const shifted = basePrevious + offsetMs;
		if (isFiniteTimestamp(shifted) && shifted <= nowMs) return shifted;
		cursorMs = Math.max(0, basePrevious - 1e3);
	}
}
function computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs) {
	const previous = computeStaggeredCronPreviousRunAtMs(job, nowMs);
	const probeMs = nowMs + 1e3;
	if (!isFiniteTimestamp(probeMs)) return previous;
	const boundary = computeStaggeredCronPreviousRunAtMs(job, probeMs);
	if (isFiniteTimestamp(boundary) && boundary <= nowMs && (!isFiniteTimestamp(previous) || boundary > previous)) return boundary;
	return previous;
}
function isStaggeredCronRunAtMs(job, runAtMs) {
	if (job.schedule.kind !== "cron" || !isFiniteTimestamp(runAtMs)) return false;
	return computeStaggeredCronPreviousRunAtOrBeforeMs(job, runAtMs) === runAtMs;
}
function isPendingErrorBackoffSlot(params) {
	const { job, nextRunAtMs, nowMs } = params;
	const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
	return backoffUntilMs !== void 0 && nowMs < backoffUntilMs && nextRunAtMs <= backoffUntilMs;
}
function shouldRepairFutureCronNextRunAtMs(params) {
	const { job, nowMs } = params;
	const nextRun = job.state.nextRunAtMs;
	if (job.schedule.kind !== "cron" || !hasScheduledNextRunAtMs(nextRun) || nowMs >= nextRun || typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number") return false;
	if (isPendingErrorBackoffSlot({
		job,
		nextRunAtMs: nextRun,
		nowMs
	})) return false;
	let naturalNext;
	try {
		naturalNext = computeStaggeredCronNextRunAtMs(job, nowMs);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(naturalNext)) return false;
	let isScheduledSlot;
	try {
		isScheduledSlot = isStaggeredCronRunAtMs(job, nextRun);
	} catch {
		return false;
	}
	if (isScheduledSlot) return false;
	if (nextRun < naturalNext) return job.payload.kind !== "agentTurn";
	if (nextRun === naturalNext) return false;
	let followingNaturalNext;
	try {
		followingNaturalNext = computeStaggeredCronNextRunAtMs(job, naturalNext);
	} catch {
		return false;
	}
	if (!isFiniteTimestamp(followingNaturalNext)) return false;
	const naturalIntervalMs = followingNaturalNext - naturalNext;
	return naturalIntervalMs > 0 && nextRun >= followingNaturalNext + naturalIntervalMs;
}
function resolveEveryAnchorMs(params) {
	const coerced = coerceFiniteScheduleNumber(params.schedule.anchorMs);
	if (coerced !== void 0) return Math.max(0, Math.floor(coerced));
	if (isFiniteTimestamp(params.fallbackAnchorMs)) return Math.max(0, Math.floor(params.fallbackAnchorMs));
	return 0;
}
function hasInvalidExplicitEveryAnchor(schedule) {
	if (schedule.anchorMs === void 0) return false;
	const coerced = coerceFiniteScheduleNumber(schedule.anchorMs);
	return coerced === void 0 || coerced < 0;
}
/** Finds an in-memory cron job or throws the public unknown-id error. */
function findJobOrThrow(state, id) {
	const job = state.store?.jobs.find((j) => j.id === id);
	if (!job) throw new Error(`unknown cron job id: ${id}`);
	return job;
}
/** Returns the effective enabled flag, defaulting missing values to enabled. */
function isJobEnabled(job) {
	return job.enabled ?? true;
}
/** Computes the next run timestamp for enabled jobs across every/at/cron schedules. */
function computeJobNextRunAtMs(job, nowMs) {
	if (!isJobEnabled(job)) return;
	if (job.schedule.kind === "every") {
		if (hasInvalidExplicitEveryAnchor(job.schedule)) return;
		const everyMsRaw = coerceFiniteScheduleNumber(job.schedule.everyMs);
		if (everyMsRaw === void 0) return;
		const everyMs = Math.floor(everyMsRaw);
		if (everyMs < 1) return;
		const lastRunAtMs = job.state.lastRunAtMs;
		if (isFiniteTimestamp(lastRunAtMs)) {
			const nextFromLastRun = Math.floor(lastRunAtMs) + everyMs;
			if (!isFiniteTimestamp(nextFromLastRun)) return;
			if (nextFromLastRun > nowMs) return nextFromLastRun;
		}
		const fallbackAnchorMs = isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs;
		const anchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs
		});
		const next = computeNextRunAtMs({
			...job.schedule,
			everyMs,
			anchorMs
		}, nowMs);
		return isFiniteTimestamp(next) ? next : void 0;
	}
	if (job.schedule.kind === "at") {
		const atMs = parseAbsoluteTimeMs(job.schedule.at);
		if (resolveJobLastRunStatus(job) === "ok" && job.state.lastRunAtMs) {
			if (atMs !== null && Number.isFinite(atMs) && atMs > job.state.lastRunAtMs) return atMs;
			return;
		}
		return atMs !== null && Number.isFinite(atMs) ? atMs : void 0;
	}
	const next = computeStaggeredCronNextRunAtMs(job, nowMs);
	if (next === void 0 && job.schedule.kind === "cron") return computeStaggeredCronNextRunAtMs(job, Math.floor(nowMs / 1e3) * 1e3 + 1e3);
	return isFiniteTimestamp(next) ? next : void 0;
}
/** Computes the latest effective cron timestamp at or before the supplied time. */
function computeJobPreviousRunAtOrBeforeMs(job, nowMs) {
	if (!isJobEnabled(job) || job.schedule.kind !== "cron") return;
	const previous = computeStaggeredCronPreviousRunAtOrBeforeMs(job, nowMs);
	return isFiniteTimestamp(previous) ? previous : void 0;
}
/** Maximum consecutive schedule errors before auto-disabling a job. */
const MAX_SCHEDULE_ERRORS = 3;
/** Records a schedule-computation failure and auto-disables after repeated errors. */
function recordScheduleComputeError(params) {
	const { state, job, err } = params;
	const errorCount = (job.state.scheduleErrorCount ?? 0) + 1;
	const errText = String(err);
	job.state.scheduleErrorCount = errorCount;
	job.state.nextRunAtMs = void 0;
	job.state.lastError = `schedule error: ${errText}`;
	if (errorCount >= MAX_SCHEDULE_ERRORS) {
		autoDisableCronJob({
			state,
			job,
			reason: "schedule-errors",
			atMs: state.deps.nowMs(),
			consecutiveErrors: errorCount,
			deferredNotifications: params.deferredNotifications
		});
		state.deps.log.error({
			jobId: job.id,
			name: job.name,
			errorCount,
			err: errText
		}, "cron: auto-disabled job after repeated schedule errors");
	} else state.deps.log.warn({
		jobId: job.id,
		name: job.name,
		errorCount,
		err: errText
	}, "cron: failed to compute next run for job (skipping)");
	return true;
}
function normalizeJobTickState(params) {
	const { state, job, nowMs } = params;
	let changed = false;
	if (!job.state) {
		job.state = {};
		changed = true;
	}
	if (job.schedule.kind === "stream" && !job.state.streamSourceIdentity?.trim()) {
		job.state.streamSourceIdentity = createCronStreamSourceIdentity();
		changed = true;
	}
	if (job.schedule.kind === "every" && !hasInvalidExplicitEveryAnchor(job.schedule)) {
		const normalizedAnchorMs = resolveEveryAnchorMs({
			schedule: job.schedule,
			fallbackAnchorMs: isFiniteTimestamp(job.createdAtMs) ? job.createdAtMs : nowMs
		});
		if (job.schedule.anchorMs !== normalizedAnchorMs) {
			job.schedule = {
				...job.schedule,
				anchorMs: normalizedAnchorMs
			};
			job.state.pacedNextRunAtMs = void 0;
			job.state.forcePreservedNextRunAtMs = void 0;
			changed = true;
		}
	}
	if (!isJobEnabled(job)) {
		for (const key of [
			"startupCatchupAtMs",
			"pacedNextRunAtMs",
			"forcePreservedNextRunAtMs",
			"nextRunAtMs"
		]) if (job.state[key] !== void 0) {
			job.state[key] = void 0;
			changed = true;
		}
		if (job.state.queuedAtMs !== void 0 && !ownsCronRunMarker(state, job.id, job.state.queuedAtMs, true)) {
			job.state.queuedAtMs = void 0;
			changed = true;
		}
		if (job.state.runningAtMs !== void 0 && !ownsCronRunMarker(state, job.id, job.state.runningAtMs, true) && !isCronJobActive(job.id)) {
			job.state.runningAtMs = void 0;
			changed = true;
		}
		return {
			changed,
			skip: true
		};
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs) && job.state.nextRunAtMs !== void 0) {
		job.state.nextRunAtMs = void 0;
		changed = true;
	}
	const forcePreservedNextRunAtMs = job.state.forcePreservedNextRunAtMs;
	if (forcePreservedNextRunAtMs !== void 0 && (!isFiniteTimestamp(forcePreservedNextRunAtMs) || forcePreservedNextRunAtMs !== job.state.nextRunAtMs)) {
		job.state.forcePreservedNextRunAtMs = void 0;
		changed = true;
	}
	const queuedAt = job.state.queuedAtMs;
	if (typeof queuedAt === "number" && Math.abs(nowMs - queuedAt) > STUCK_RUN_MS && !ownsCronRunMarker(state, job.id, queuedAt)) {
		state.deps.log.warn({
			jobId: job.id,
			queuedAtMs: queuedAt
		}, "cron: clearing stuck queued marker");
		job.state.queuedAtMs = void 0;
		changed = true;
	}
	const runningAt = job.state.runningAtMs;
	if (typeof runningAt === "number" && Math.abs(nowMs - runningAt) > STUCK_RUN_MS && !ownsCronRunMarker(state, job.id, runningAt)) {
		state.deps.log.warn({
			jobId: job.id,
			runningAtMs: runningAt
		}, "cron: clearing stuck running marker");
		job.state.runningAtMs = void 0;
		changed = true;
		const nextRun = job.state.nextRunAtMs;
		const lastRun = job.state.lastRunAtMs;
		const alreadyExecutedSlot = hasScheduledNextRunAtMs(nextRun) && isFiniteTimestamp(lastRun) && lastRun >= nextRun;
		return {
			changed,
			skip: !alreadyExecutedSlot
		};
	}
	return {
		changed,
		skip: false
	};
}
function walkSchedulableJobs(state, fn, nowMs = state.deps.nowMs()) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) {
		const tick = normalizeJobTickState({
			state,
			job,
			nowMs
		});
		if (tick.changed) changed = true;
		if (tick.skip) continue;
		if (fn({
			job,
			nowMs
		})) changed = true;
	}
	return changed;
}
function recomputeJobNextRunAtMs(params) {
	let changed = false;
	try {
		let newNext = computeJobNextRunAtMs(params.job, params.nowMs);
		if (params.job.schedule.kind !== "at" && resolveJobLastRunStatus(params.job) === "error" && isFiniteTimestamp(params.job.state.lastRunAtMs)) {
			const backoffFloor = resolveJobErrorBackoffUntilMs(params.job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
			if (newNext !== void 0) newNext = backoffFloor !== void 0 ? Math.max(newNext, backoffFloor) : newNext;
		}
		if (params.job.state.nextRunAtMs !== newNext) {
			params.job.state.nextRunAtMs = newNext;
			changed = true;
		}
		if (params.job.state.scheduleErrorCount) {
			params.job.state.scheduleErrorCount = void 0;
			changed = true;
		}
	} catch (err) {
		if (params.skipScheduleErrorHandling) return false;
		if (recordScheduleComputeError({
			state: params.state,
			job: params.job,
			err,
			deferredNotifications: params.deferredNotifications
		})) changed = true;
	}
	return changed;
}
/** Recomputes missing, due, or repairable next-run timestamps for all schedulable jobs. */
function recomputeNextRuns(state) {
	return walkSchedulableJobs(state, ({ job, nowMs: now }) => {
		const nextRun = job.state.nextRunAtMs;
		const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRun) && job.state.forcePreservedNextRunAtMs === nextRun;
		const isDueOrMissing = !hasScheduledNextRunAtMs(nextRun) || now >= nextRun;
		return !hasForcePreservedNextRun && (isDueOrMissing || shouldRepairFutureCronNextRunAtMs({
			job,
			nowMs: now
		})) && recomputeJobNextRunAtMs({
			state,
			job,
			nowMs: now
		});
	});
}
function recomputeSingleJobForMaintenance(state, job, opts) {
	const now = opts?.nowMs ?? state.deps.nowMs();
	const tick = normalizeJobTickState({
		state,
		job,
		nowMs: now
	});
	let changed = tick.changed;
	if (tick.skip) return changed;
	const recomputeExpired = opts?.recomputeExpired ?? false;
	const repairFutureCronNextRunAtMs = opts?.repairFutureCronNextRunAtMs ?? true;
	const recomputeJob = () => recomputeJobNextRunAtMs({
		state,
		job,
		nowMs: now,
		deferredNotifications: opts?.deferredNotifications,
		skipScheduleErrorHandling: opts?.skipScheduleErrorHandling
	});
	const startupCatchupAtMs = job.state.startupCatchupAtMs;
	const pacedNextRunAtMs = job.state.pacedNextRunAtMs;
	const nextRunAtMs = job.state.nextRunAtMs;
	const hasForcePreservedNextRun = isFiniteTimestamp(job.state.forcePreservedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && job.state.forcePreservedNextRunAtMs === nextRunAtMs;
	const hasPendingStartupCatchup = isFiniteTimestamp(startupCatchupAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && startupCatchupAtMs === nextRunAtMs && now < startupCatchupAtMs;
	if (startupCatchupAtMs !== void 0 && !hasPendingStartupCatchup) {
		job.state.startupCatchupAtMs = void 0;
		changed = true;
	}
	const hasPendingPacedNextRun = isFiniteTimestamp(pacedNextRunAtMs) && hasScheduledNextRunAtMs(nextRunAtMs) && pacedNextRunAtMs === nextRunAtMs && (now < pacedNextRunAtMs || opts?.preserveExpiredPacedNextRunJobId === job.id);
	if (pacedNextRunAtMs !== void 0 && !hasPendingPacedNextRun) {
		job.state.pacedNextRunAtMs = void 0;
		changed = true;
	}
	if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) changed = recomputeJob() || changed;
	else if (repairFutureCronNextRunAtMs && !hasPendingStartupCatchup && !hasPendingPacedNextRun && !hasForcePreservedNextRun && shouldRepairFutureCronNextRunAtMs({
		job,
		nowMs: now
	})) changed = recomputeJob() || changed;
	else if (recomputeExpired && !hasForcePreservedNextRun && now >= job.state.nextRunAtMs && typeof job.state.queuedAtMs !== "number" && typeof job.state.runningAtMs !== "number") {
		const lastRun = job.state.lastRunAtMs;
		const alreadyExecutedSlot = isFiniteTimestamp(lastRun) && lastRun >= job.state.nextRunAtMs;
		const backoffUntilMs = resolveJobErrorBackoffUntilMs(job, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS);
		const isStaleBackoffSlot = backoffUntilMs !== void 0 && now < backoffUntilMs && job.state.nextRunAtMs < backoffUntilMs;
		if (alreadyExecutedSlot || isStaleBackoffSlot) changed = recomputeJob() || changed;
	}
	return changed;
}
function recomputeNextRunsForMaintenance(state, opts) {
	if (!state.store) return false;
	let changed = false;
	for (const job of state.store.jobs) changed = recomputeSingleJobForMaintenance(state, job, opts) || changed;
	return changed;
}
/** Returns the next enabled wake timestamp from the in-memory cron store. */
function nextWakeAtMs(state) {
	let nextWake;
	for (const job of state.store?.jobs ?? []) {
		const nextRun = job.state.nextRunAtMs;
		if (isJobEnabled(job) && hasScheduledNextRunAtMs(nextRun)) nextWake = nextWake === void 0 ? nextRun : Math.min(nextWake, nextRun);
	}
	return nextWake;
}
/** Applies one canonical server-authored authority envelope to a tool-bearing job. */
function hasActiveCronRun(job) {
	return typeof job.state.queuedAtMs === "number" || typeof job.state.runningAtMs === "number" || isCronJobActive(job.id);
}
/** Returns whether a cron job should execute at `nowMs`, honoring force mode and active runs. */
function isJobDue(job, nowMs, opts) {
	if (!job.state) job.state = {};
	if (hasActiveCronRun(job)) return false;
	if (opts.forced) return true;
	return isJobEnabled(job) && hasScheduledNextRunAtMs(job.state.nextRunAtMs) && nowMs >= job.state.nextRunAtMs;
}
/** Returns main-session queue text for system-event jobs, or undefined when empty/unsupported. */
function resolveJobPayloadTextForMain(job) {
	if (job.payload.kind !== "systemEvent") return;
	const text = normalizePayloadToSystemText(job.payload);
	return text.trim() ? text : void 0;
}
//#endregion
export { cronFailureDetailLines as C, maybeAutoDisableCronJobAfterRunFailure as S, resolveEveryAnchorMs as _, findJobOrThrow as a, resolveJobPayloadTextForMain as b, isJobDue as c, normalizeStreamScheduleBounds as d, recomputeJobNextRunAtMs as f, recordScheduleComputeError as g, recomputeSingleJobForMaintenance as h, errorBackoffMs as i, isJobEnabled as l, recomputeNextRunsForMaintenance as m, computeJobNextRunAtMs as n, hasActiveCronRun as o, recomputeNextRuns as p, computeJobPreviousRunAtOrBeforeMs as r, hasScheduledNextRunAtMs as s, DEFAULT_ERROR_BACKOFF_SCHEDULE_MS as t, nextWakeAtMs as u, resolveJobErrorBackoffUntilMs as v, autoDisableCronJob as x, resolveJobLastRunStatus as y };
