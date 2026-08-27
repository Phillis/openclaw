import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
//#region src/cron/active-jobs.ts
/** Tracks in-process cron executions so schedulers and wake paths avoid duplicate runs. */
const CRON_ACTIVE_JOB_STATE_KEY = Symbol.for("openclaw.cron.activeJobs");
function getCronActiveJobState() {
	const state = resolveGlobalSingleton(CRON_ACTIVE_JOB_STATE_KEY, () => ({
		activeJobs: /* @__PURE__ */ new Map(),
		generation: 0,
		nextToken: 1,
		emptyWaiters: /* @__PURE__ */ new Set()
	}));
	state.generation ??= 0;
	state.nextToken ??= 1;
	state.activeJobs ??= /* @__PURE__ */ new Map();
	state.emptyWaiters ??= /* @__PURE__ */ new Set();
	return state;
}
function getActiveCronJobCountForGeneration(state) {
	let active = 0;
	for (const marker of state.activeJobs.values()) if (isMarkerActiveInGeneration(marker, state.generation)) active += 1;
	return active;
}
function isMarkerActiveInGeneration(marker, generation) {
	return marker.generation === generation || marker.preserveAcrossGenerationAdvance === true;
}
function getCurrentCronActiveJobMarker(jobId) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const marker = state.activeJobs.get(jobId);
	return marker && isMarkerActiveInGeneration(marker, state.generation) ? marker : void 0;
}
function notifyActiveCronJobWaitersIfEmpty(state) {
	if (getActiveCronJobCountForGeneration(state) > 0) return;
	for (const resolve of state.emptyWaiters) resolve();
	state.emptyWaiters.clear();
}
function notifyCronJobInactive(marker) {
	if (marker.inactiveNotified) return;
	marker.inactiveNotified = true;
	for (const callback of marker.onInactive ?? []) callback();
	marker.onInactive?.clear();
}
/** Marks a cron job id as currently executing for duplicate-run suppression. */
function markCronJobActive(jobId, opts) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const token = state.nextToken;
	state.nextToken += 1;
	const marker = {
		jobId,
		...opts?.payloadKind ? { payloadKind: opts.payloadKind } : {},
		generation: state.generation,
		token,
		...opts?.preserveAcrossGenerationAdvance ? { preserveAcrossGenerationAdvance: true } : {}
	};
	state.activeJobs.set(jobId, marker);
	return marker;
}
/** Clears the active marker when a cron run exits or is abandoned. */
function clearCronJobActive(jobId, marker) {
	if (!jobId) return;
	const state = getCronActiveJobState();
	const activeMarker = state.activeJobs.get(jobId);
	if (activeMarker && (!marker || marker.jobId === jobId && marker.token === activeMarker.token)) {
		state.activeJobs.delete(jobId);
		notifyCronJobInactive(activeMarker);
	} else if (marker?.jobId === jobId) notifyCronJobInactive(marker);
	notifyActiveCronJobWaitersIfEmpty(state);
}
/** Records a durable schedule edit against the exact run that was active for it. */
function noteActiveCronJobScheduleMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.scheduleMutated = true;
}
/** Records a durable trigger edit against the exact run that evaluated it. */
function noteActiveCronJobTriggerMutation(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) marker.triggerMutated = true;
}
/** Retires the admitted job identity after its deletion becomes durable. */
function noteActiveCronJobRemoval(jobId) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (!marker) return;
	marker.scheduleMutated = true;
	marker.jobRemoved = true;
	requestCronActiveJobMarkerCancellation(marker, "Cron job removed by operator.");
	return marker;
}
function requestCronActiveJobMarkerCancellation(marker, reason) {
	const cancellation = marker.cancellation;
	if (cancellation?.kind === "requested") return;
	marker.cancellation = {
		kind: "requested",
		reason
	};
	cancellation?.cancel(reason);
}
/** Requests cancellation now or when the exact active run binds its controller. */
function requestActiveCronJobCancellation(jobId, reason) {
	const marker = getCurrentCronActiveJobMarker(jobId);
	if (marker) requestCronActiveJobMarkerCancellation(marker, reason);
}
/** Revokes every active run admitted from one payload family. */
function requestActiveCronJobCancellationByPayloadKind(payloadKind, reason) {
	const state = getCronActiveJobState();
	for (const marker of state.activeJobs.values()) {
		if (marker.payloadKind !== payloadKind || !isMarkerActiveInGeneration(marker, state.generation)) continue;
		requestCronActiveJobMarkerCancellation(marker, reason);
	}
}
/** Returns whether the given cron job id is currently executing in this process. */
function isCronJobActive(jobId) {
	if (!jobId) return false;
	const state = getCronActiveJobState();
	const marker = state.activeJobs.get(jobId);
	return marker ? isMarkerActiveInGeneration(marker, state.generation) : false;
}
/** Runs a callback when the exact cron job no longer has an active in-process run. */
function onCronJobInactive(marker, callback) {
	if (!marker || marker.inactiveNotified) {
		callback();
		return;
	}
	marker.onInactive ??= /* @__PURE__ */ new Set();
	marker.onInactive.add(callback);
}
function isCronActiveJobMarkerCurrent(marker) {
	if (!marker) return true;
	const state = getCronActiveJobState();
	return state.activeJobs.get(marker.jobId)?.token === marker.token && isMarkerActiveInGeneration(marker, state.generation);
}
/** Returns whether any cron run is active in this process. */
function hasActiveCronJobs() {
	return getActiveCronJobCountForGeneration(getCronActiveJobState()) > 0;
}
/**
* Ignore only the caller's own marker. Unrelated runs must still block its wake,
* because cron jobs may execute concurrently.
*/
function hasActiveCronJobsExceptMarker(markerToIgnore) {
	const state = getCronActiveJobState();
	for (const marker of state.activeJobs.values()) if (!(marker.jobId === markerToIgnore.jobId && marker.token === markerToIgnore.token) && isMarkerActiveInGeneration(marker, state.generation)) return true;
	return false;
}
/** Returns the number of active cron runs in this process. */
function getActiveCronJobCount() {
	return getActiveCronJobCountForGeneration(getCronActiveJobState());
}
async function waitForActiveCronJobs(timeoutMs) {
	const state = getCronActiveJobState();
	if (getActiveCronJobCountForGeneration(state) === 0) return {
		drained: true,
		active: 0
	};
	await new Promise((resolve) => {
		const waiter = () => {
			clearTimeout(timeout);
			resolve();
		};
		const timeout = setTimeout(() => {
			state.emptyWaiters.delete(waiter);
			resolve();
		}, Math.max(0, Math.floor(timeoutMs)));
		state.emptyWaiters.add(waiter);
	});
	const active = getActiveCronJobCountForGeneration(state);
	return {
		drained: active === 0,
		active
	};
}
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
function advanceCronActiveJobGeneration() {
	const state = getCronActiveJobState();
	state.generation += 1;
	for (const [jobId, marker] of state.activeJobs) {
		if (marker.preserveAcrossGenerationAdvance === true) continue;
		if (marker.generation < state.generation - 1) {
			state.activeJobs.delete(jobId);
			notifyCronJobInactive(marker);
		}
	}
	notifyActiveCronJobWaitersIfEmpty(state);
}
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
function resetCronActiveJobs() {
	const state = getCronActiveJobState();
	state.generation += 1;
	for (const marker of state.activeJobs.values()) notifyCronJobInactive(marker);
	state.activeJobs.clear();
	notifyActiveCronJobWaitersIfEmpty(state);
}
//#endregion
export { hasActiveCronJobsExceptMarker as a, markCronJobActive as c, noteActiveCronJobTriggerMutation as d, onCronJobInactive as f, waitForActiveCronJobs as g, resetCronActiveJobs as h, hasActiveCronJobs as i, noteActiveCronJobRemoval as l, requestActiveCronJobCancellationByPayloadKind as m, clearCronJobActive as n, isCronActiveJobMarkerCurrent as o, requestActiveCronJobCancellation as p, getActiveCronJobCount as r, isCronJobActive as s, advanceCronActiveJobGeneration as t, noteActiveCronJobScheduleMutation as u };
