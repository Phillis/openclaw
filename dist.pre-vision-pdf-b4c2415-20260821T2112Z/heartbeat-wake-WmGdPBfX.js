import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/heartbeat-reason.ts
/** Normalize a heartbeat wake reason for logs and UI. */
function normalizeHeartbeatWakeReason(reason) {
	return normalizeOptionalString(reason) ?? "requested";
}
//#endregion
//#region src/infra/heartbeat-wake-lifecycle.ts
const heartbeatWakeAbortSignals = new AsyncLocalStorage();
/** Propagate lifecycle cancellation into the provider's existing reply abort contract. */
function getHeartbeatWakeAbortSignal() {
	return heartbeatWakeAbortSignals.getStore();
}
async function runAbortableHeartbeatWake(active, wake, signal) {
	let abortListener;
	const aborted = new Promise((_resolve, reject) => {
		abortListener = () => {
			const abortReason = signal.reason;
			reject(abortReason instanceof Error ? abortReason : /* @__PURE__ */ new Error("Heartbeat handler was replaced"));
		};
		if (signal.aborted) {
			abortListener();
			return;
		}
		signal.addEventListener("abort", abortListener, { once: true });
	});
	try {
		const running = heartbeatWakeAbortSignals.run(signal, () => active(wake));
		return await Promise.race([running, aborted]);
	} finally {
		if (abortListener) signal.removeEventListener("abort", abortListener);
	}
}
function abortHeartbeatWakeGeneration(activeTargets, generation) {
	for (const activeTarget of activeTargets) if (activeTarget.generation === generation) activeTarget.abortController.abort();
}
function normalizeHeartbeatWakeTarget(value) {
	return (normalizeOptionalString(value) ?? "") || void 0;
}
function resolveHeartbeatWakeTargetKey(params) {
	const agentId = normalizeHeartbeatWakeTarget(params.agentId);
	const sessionKey = normalizeHeartbeatWakeTarget(params.sessionKey);
	return sessionKey ? `::${sessionKey}` : `${agentId ?? ""}::`;
}
function isHeartbeatWakeAfterGlobalBarrier(targetKey, enqueueSequence, barrierSequence) {
	return barrierSequence !== void 0 && targetKey !== "::" && enqueueSequence >= barrierSequence;
}
function isHeartbeatWakeTargetGroupReady(group, now) {
	if (!group || group.blockedUntilMs !== void 0 && group.blockedUntilMs > now) return false;
	return [
		group.task,
		group.scheduled,
		group.event
	].some((pending) => pending !== void 0 && (pending.readyAtMs === void 0 || pending.readyAtMs <= now) && (pending.notBeforeMs === void 0 || pending.notBeforeMs <= now));
}
//#endregion
//#region src/infra/heartbeat-wake.ts
const HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT = "requests-in-flight";
const HEARTBEAT_SKIP_CRON_IN_PROGRESS = "cron-in-progress";
const HEARTBEAT_SKIP_LANES_BUSY = "lanes-busy";
const HEARTBEAT_SKIP_NO_PENDING_EVENT = "no-pending-event";
const HEARTBEAT_SKIP_PREEMPTED = "preempted";
const RETRYABLE_HEARTBEAT_SKIP_REASONS = /* @__PURE__ */ new Set([
	HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
	HEARTBEAT_SKIP_CRON_IN_PROGRESS,
	HEARTBEAT_SKIP_LANES_BUSY,
	HEARTBEAT_SKIP_PREEMPTED
]);
const RETRYABLE_GUARD_SKIP_REASONS = /* @__PURE__ */ new Set([
	"not-due",
	"min-spacing",
	"flood"
]);
function isRetryableHeartbeatSkipReason(reason) {
	return RETRYABLE_HEARTBEAT_SKIP_REASONS.has(reason);
}
let heartbeatsEnabled = true;
function setHeartbeatsEnabled(enabled) {
	heartbeatsEnabled = enabled;
}
function areHeartbeatsEnabled() {
	return heartbeatsEnabled;
}
let handler = null;
let handlerGeneration = 0;
const pendingWakes = /* @__PURE__ */ new Map();
const activeWakeTargets = /* @__PURE__ */ new Map();
let timer = null;
let timerDueAt = null;
let wakeEnqueueSequence = 0;
const DEFAULT_COALESCE_MS = 250;
const DEFAULT_RETRY_MS = 1e3;
const HEARTBEAT_IDLE_RETRY_GRACE_MS = 6e4;
const MAX_CONCURRENT_HEARTBEAT_WAKE_TARGETS = 4;
const REASON_PRIORITY = {
	RETRY: 0,
	INTERVAL: 1,
	DEFAULT: 2,
	ACTION: 3
};
function resolveWakePriority(params) {
	if (params.intent === "manual" || params.intent === "immediate") return REASON_PRIORITY.ACTION;
	if (params.source === "retry" || params.reason === "retry") return REASON_PRIORITY.RETRY;
	if (params.intent === "scheduled" || params.source === "interval" || params.reason === "interval") return REASON_PRIORITY.INTERVAL;
	return REASON_PRIORITY.DEFAULT;
}
function normalizeWakeReason(reason) {
	return normalizeHeartbeatWakeReason(reason);
}
function mergePendingWakeReasons(previous, next) {
	const tasksByJobId = /* @__PURE__ */ new Map();
	for (const task of previous.tasks ?? []) tasksByJobId.set(task.jobId, task);
	for (const task of next.tasks ?? []) tasksByJobId.set(task.jobId, task);
	const mergedTasks = Array.from(tasksByJobId.values()).toSorted((left, right) => left.jobId.localeCompare(right.jobId));
	const preferred = previous.intent === "task" !== (next.intent === "task") ? previous.intent === "task" ? previous : next : next.priority > previous.priority || next.priority === previous.priority && next.requestedAt >= previous.requestedAt ? next : previous;
	const other = preferred === previous ? next : previous;
	const bypassRetainedWork = (preferred.intent === "manual" || preferred.intent === "immediate") && preferred.retainedWork !== true && (previous.retainedWork === true || next.retainedWork === true);
	const scheduledEveryMs = preferred.scheduledEveryMs ?? other.scheduledEveryMs;
	const scheduledAnchorMs = preferred.scheduledAnchorMs ?? other.scheduledAnchorMs;
	const immediateBarrierSequences = [previous.immediateBarrierSequence, next.immediateBarrierSequence].filter((value) => value !== void 0);
	const readyAtMs = Math.min(previous.readyAtMs ?? previous.requestedAt, next.readyAtMs ?? next.requestedAt);
	const merged = {
		...preferred,
		enqueueSequence: Math.min(previous.enqueueSequence, next.enqueueSequence),
		readyAtMs,
		...!bypassRetainedWork && (previous.notBeforeMs !== void 0 || next.notBeforeMs !== void 0) ? {
			requestedAt: Math.min(previous.requestedAt, next.requestedAt),
			notBeforeMs: Math.max(previous.notBeforeMs ?? 0, next.notBeforeMs ?? 0)
		} : {},
		...preferred.heartbeat ?? other.heartbeat ? { heartbeat: preferred.heartbeat ?? other.heartbeat } : {},
		...scheduledEveryMs !== void 0 ? { scheduledEveryMs } : {},
		...scheduledAnchorMs !== void 0 ? { scheduledAnchorMs } : {},
		...mergedTasks.length ? { tasks: mergedTasks } : {}
	};
	if (!bypassRetainedWork && (previous.retainedWork || next.retainedWork)) merged.retainedWork = true;
	else delete merged.retainedWork;
	if (immediateBarrierSequences.length > 0) merged.immediateBarrierSequence = Math.min(...immediateBarrierSequences);
	else delete merged.immediateBarrierSequence;
	return merged;
}
function takePendingWakeBatch(maxGroups, now = Date.now()) {
	if (maxGroups <= 0) return [];
	const globalWakeGroup = pendingWakes.get("::");
	const globalImmediateWake = globalWakeGroup?.event;
	const flushPendingCoalescing = globalImmediateWake?.intent === "immediate" && !activeWakeTargets.has("::") && (globalWakeGroup?.blockedUntilMs === void 0 || globalWakeGroup.blockedUntilMs <= now) && (globalImmediateWake.readyAtMs === void 0 || globalImmediateWake.readyAtMs <= now) && (globalImmediateWake.notBeforeMs === void 0 || globalImmediateWake.notBeforeMs <= now);
	const globalBarrierCutoffSequence = globalImmediateWake?.intent === "immediate" ? globalImmediateWake.immediateBarrierSequence : void 0;
	const globalBarrierReady = isHeartbeatWakeTargetGroupReady(globalWakeGroup, now);
	if (activeWakeTargets.has("::")) return [];
	if (globalBarrierReady && activeWakeTargets.size > 0) return [];
	const readyGroups = [];
	const pendingEntries = globalBarrierReady ? flushPendingCoalescing ? [...pendingWakes.entries()].toSorted(([leftTarget], [rightTarget]) => Number(leftTarget === "::") - Number(rightTarget === "::")) : [["::", globalWakeGroup]] : pendingWakes.entries();
	for (const [targetKey, group] of pendingEntries) {
		if (readyGroups.length >= maxGroups) break;
		if (activeWakeTargets.has(targetKey) || group.blockedUntilMs !== void 0 && group.blockedUntilMs > now) continue;
		if (targetKey === "::" && (activeWakeTargets.size > 0 || readyGroups.length > 0)) continue;
		const ready = {};
		const remaining = {};
		for (const slot of [
			"task",
			"scheduled",
			"event"
		]) {
			const pending = group[slot];
			if (!pending) continue;
			if (!isHeartbeatWakeAfterGlobalBarrier(targetKey, pending.enqueueSequence, globalBarrierCutoffSequence) && (flushPendingCoalescing || pending.readyAtMs === void 0 || pending.readyAtMs <= now) && (pending.notBeforeMs === void 0 || pending.notBeforeMs <= now)) ready[slot] = pending;
			else remaining[slot] = pending;
		}
		if (remaining.task || remaining.scheduled || remaining.event) pendingWakes.set(targetKey, remaining);
		else pendingWakes.delete(targetKey);
		if (ready.task || ready.scheduled || ready.event) readyGroups.push({
			targetKey,
			group: ready
		});
	}
	const batch = [];
	for (const { targetKey, group } of readyGroups) {
		const wakes = [];
		if (group.task) {
			const taskWake = group.scheduled ? mergePendingWakeReasons(group.scheduled, group.task) : group.task;
			if (group.event) wakes.push(...[taskWake, group.event].toSorted((left, right) => {
				if (left.retainedWork !== right.retainedWork) return left.retainedWork ? -1 : 1;
				if (left.requestedAt !== right.requestedAt) return left.requestedAt - right.requestedAt;
				return 0;
			}));
			else wakes.push(taskWake);
		} else if (group.event) wakes.push(group.scheduled ? mergePendingWakeReasons(group.scheduled, group.event) : group.event);
		else if (group.scheduled) wakes.push(group.scheduled);
		batch.push({
			targetKey,
			wakes
		});
	}
	return batch;
}
function queuePendingWakeReason(params) {
	const requestedAt = params.requestedAt ?? Date.now();
	const enqueueSequence = params.enqueueSequence ?? ++wakeEnqueueSequence;
	const normalizedReason = normalizeWakeReason(params.reason);
	const normalizedAgentId = normalizeHeartbeatWakeTarget(params.agentId);
	const normalizedSessionKey = normalizeHeartbeatWakeTarget(params.sessionKey);
	const wakeTargetKey = resolveHeartbeatWakeTargetKey({
		agentId: normalizedAgentId,
		sessionKey: normalizedSessionKey
	});
	const immediateBarrierSequence = params.immediateBarrierSequence ?? (wakeTargetKey === "::" && params.intent === "immediate" ? enqueueSequence : void 0);
	const next = {
		source: params.source,
		intent: params.intent,
		reason: normalizedReason,
		priority: resolveWakePriority({
			source: params.source,
			intent: params.intent,
			reason: normalizedReason
		}),
		requestedAt,
		enqueueSequence,
		...immediateBarrierSequence === void 0 ? {} : { immediateBarrierSequence },
		...params.readyAtMs === void 0 ? {} : { readyAtMs: params.readyAtMs },
		agentId: normalizedAgentId,
		sessionKey: normalizedSessionKey,
		heartbeat: params.heartbeat,
		scheduledEveryMs: params.scheduledEveryMs,
		scheduledAnchorMs: params.scheduledAnchorMs,
		...params.tasks?.length ? { tasks: [...params.tasks] } : {},
		...params.notBeforeMs === void 0 ? {} : { notBeforeMs: params.notBeforeMs },
		...params.retainedWork ? { retainedWork: true } : {}
	};
	const group = pendingWakes.get(wakeTargetKey) ?? {};
	if (params.blockTargetUntilMs !== void 0) group.blockedUntilMs = Math.max(group.blockedUntilMs ?? 0, params.blockTargetUntilMs);
	const slot = params.intent === "task" ? "task" : params.intent === "scheduled" ? "scheduled" : "event";
	const previous = group[slot];
	if (!previous) {
		group[slot] = next;
		pendingWakes.set(wakeTargetKey, group);
		return;
	}
	group[slot] = mergePendingWakeReasons(previous, next);
	pendingWakes.set(wakeTargetKey, group);
}
function resolveHeartbeatRetrySchedule(pendingWake, result) {
	const now = Date.now();
	const deferWakeOnly = result.reason === "preempted" || result.reason === "requests-in-flight" && (pendingWake.intent === "scheduled" || pendingWake.intent === "task");
	return {
		delayMs: result.retryAtMs !== void 0 ? Math.max(0, result.retryAtMs - now) : deferWakeOnly ? HEARTBEAT_IDLE_RETRY_GRACE_MS : DEFAULT_RETRY_MS,
		deferWakeOnly
	};
}
function retryPendingWake(pendingWake, retrySchedule = {
	delayMs: DEFAULT_RETRY_MS,
	deferWakeOnly: false
}) {
	const retryAtMs = Date.now() + retrySchedule.delayMs;
	queuePendingWakeReason({
		source: pendingWake.source,
		intent: pendingWake.intent,
		reason: pendingWake.reason ?? "retry",
		agentId: pendingWake.agentId,
		sessionKey: pendingWake.sessionKey,
		heartbeat: pendingWake.heartbeat,
		scheduledEveryMs: pendingWake.scheduledEveryMs,
		scheduledAnchorMs: pendingWake.scheduledAnchorMs,
		tasks: pendingWake.tasks,
		requestedAt: pendingWake.requestedAt,
		enqueueSequence: pendingWake.enqueueSequence,
		immediateBarrierSequence: pendingWake.immediateBarrierSequence,
		...retrySchedule.deferWakeOnly ? {
			notBeforeMs: retryAtMs,
			retainedWork: true
		} : {
			blockTargetUntilMs: retryAtMs,
			retainedWork: pendingWake.retainedWork
		}
	});
	schedule(retrySchedule.delayMs);
}
function handOffPendingWakeBatch(pendingBatch, startIndex) {
	for (const pendingWake of pendingBatch.slice(startIndex)) queuePendingWakeReason(pendingWake);
	if (handler && startIndex < pendingBatch.length) schedulePendingWakes(DEFAULT_COALESCE_MS);
}
async function dispatchPendingWakeGroup(params) {
	const { active, generation, targetKey, wakes, abortSignal } = params;
	try {
		for (const [wakeIndex, pendingWake] of wakes.entries()) {
			if (handlerGeneration !== generation) {
				handOffPendingWakeBatch(wakes, wakeIndex);
				return;
			}
			const wakeOpts = {
				source: pendingWake.source,
				intent: pendingWake.intent,
				reason: pendingWake.reason ?? void 0,
				...pendingWake.agentId ? { agentId: pendingWake.agentId } : {},
				...pendingWake.sessionKey ? { sessionKey: pendingWake.sessionKey } : {},
				...pendingWake.heartbeat ? { heartbeat: pendingWake.heartbeat } : {},
				...pendingWake.scheduledEveryMs !== void 0 ? { scheduledEveryMs: pendingWake.scheduledEveryMs } : {},
				...pendingWake.scheduledAnchorMs !== void 0 ? { scheduledAnchorMs: pendingWake.scheduledAnchorMs } : {},
				...pendingWake.tasks ? { tasks: pendingWake.tasks } : {},
				...pendingWake.retainedWork ? { retainedWork: true } : {}
			};
			let result;
			try {
				result = await runWithGatewayIndependentRootWorkAdmission(async () => runAbortableHeartbeatWake(active, wakeOpts, abortSignal));
			} catch {
				if (handlerGeneration !== generation) {
					handOffPendingWakeBatch(wakes, wakeIndex);
					return;
				}
				retryPendingWake(pendingWake);
				continue;
			}
			if (handlerGeneration !== generation) {
				handOffPendingWakeBatch(wakes, wakeIndex + (result.status === "skipped" && (isRetryableHeartbeatSkipReason(result.reason) || RETRYABLE_GUARD_SKIP_REASONS.has(result.reason) && (pendingWake.tasks?.length || pendingWake.intent === "task" || pendingWake.intent === "event" || pendingWake.intent === "immediate")) ? 0 : 1));
				return;
			}
			if (result.status === "skipped" && isRetryableHeartbeatSkipReason(result.reason)) retryPendingWake(pendingWake, resolveHeartbeatRetrySchedule(pendingWake, result));
			else if (result.status === "skipped" && RETRYABLE_GUARD_SKIP_REASONS.has(result.reason) && (pendingWake.tasks?.length || pendingWake.intent === "task" || pendingWake.intent === "event" || pendingWake.intent === "immediate")) {
				const retryAtMs = Math.max(Date.now(), result.retryAtMs ?? Date.now() + DEFAULT_RETRY_MS);
				queuePendingWakeReason({
					source: pendingWake.source,
					intent: pendingWake.intent,
					reason: pendingWake.reason ?? "retry",
					agentId: pendingWake.agentId,
					sessionKey: pendingWake.sessionKey,
					heartbeat: pendingWake.heartbeat,
					tasks: pendingWake.tasks,
					scheduledEveryMs: pendingWake.scheduledEveryMs,
					scheduledAnchorMs: pendingWake.scheduledAnchorMs,
					requestedAt: pendingWake.requestedAt,
					enqueueSequence: pendingWake.enqueueSequence,
					immediateBarrierSequence: pendingWake.immediateBarrierSequence,
					notBeforeMs: retryAtMs,
					retainedWork: true
				});
				schedule(retryAtMs - Date.now());
			}
		}
	} finally {
		if (activeWakeTargets.get(targetKey)?.generation === generation) {
			activeWakeTargets.delete(targetKey);
			if (pendingWakes.size > 0) schedulePendingWakes(0);
		}
	}
}
function schedule(coalesceMs) {
	const delay = resolveTimerTimeoutMs(coalesceMs, DEFAULT_COALESCE_MS, 0);
	const dueAt = Date.now() + delay;
	if (timer) {
		if (typeof timerDueAt === "number" && timerDueAt <= dueAt) return;
		clearTimeout(timer);
		timer = null;
		timerDueAt = null;
	}
	timerDueAt = dueAt;
	timer = setTimeout(() => {
		(async () => {
			timer = null;
			timerDueAt = null;
			const active = handler;
			if (!active) return;
			const activeGeneration = handlerGeneration;
			const availableTargetSlots = MAX_CONCURRENT_HEARTBEAT_WAKE_TARGETS - activeWakeTargets.size;
			for (const group of takePendingWakeBatch(availableTargetSlots)) {
				const abortController = new AbortController();
				activeWakeTargets.set(group.targetKey, {
					generation: activeGeneration,
					abortController
				});
				dispatchPendingWakeGroup({
					active,
					generation: activeGeneration,
					targetKey: group.targetKey,
					wakes: group.wakes,
					abortSignal: abortController.signal
				});
			}
			if (pendingWakes.size > 0) schedulePendingWakes(delay);
		})();
	}, delay);
	timer.unref?.();
}
function schedulePendingWakes(readyDelayMs) {
	if (activeWakeTargets.size >= MAX_CONCURRENT_HEARTBEAT_WAKE_TARGETS) return;
	const now = Date.now();
	if (activeWakeTargets.has("::") || activeWakeTargets.size > 0 && isHeartbeatWakeTargetGroupReady(pendingWakes.get("::"), now)) return;
	const pendingGlobalImmediateWake = pendingWakes.get("::")?.event;
	const globalBarrierCutoffSequence = pendingGlobalImmediateWake?.intent === "immediate" ? pendingGlobalImmediateWake.immediateBarrierSequence : void 0;
	let earliestNotBeforeMs = Number.POSITIVE_INFINITY;
	let hasReadyWake = false;
	for (const [targetKey, group] of pendingWakes) {
		if (activeWakeTargets.has(targetKey)) continue;
		const groupWakes = [
			group.task,
			group.scheduled,
			group.event
		];
		if (groupWakes.every((pending) => !pending || isHeartbeatWakeAfterGlobalBarrier(targetKey, pending.enqueueSequence, globalBarrierCutoffSequence))) continue;
		if (group.blockedUntilMs !== void 0 && group.blockedUntilMs > now) {
			earliestNotBeforeMs = Math.min(earliestNotBeforeMs, group.blockedUntilMs);
			continue;
		}
		for (const pending of groupWakes) {
			if (!pending || isHeartbeatWakeAfterGlobalBarrier(targetKey, pending.enqueueSequence, globalBarrierCutoffSequence)) continue;
			const nextReadyAtMs = Math.max(pending.readyAtMs ?? 0, pending.notBeforeMs ?? 0);
			if (nextReadyAtMs <= now) hasReadyWake = true;
			else earliestNotBeforeMs = Math.min(earliestNotBeforeMs, nextReadyAtMs);
		}
	}
	if (hasReadyWake) schedule(readyDelayMs);
	else if (Number.isFinite(earliestNotBeforeMs)) schedule(earliestNotBeforeMs - now);
}
function clearPendingWakeRetryState() {
	for (const group of pendingWakes.values()) {
		delete group.blockedUntilMs;
		for (const pending of [
			group.task,
			group.scheduled,
			group.event
		]) {
			if (!pending) continue;
			delete pending.notBeforeMs;
			delete pending.retainedWork;
		}
	}
}
/**
* Register (or clear) the heartbeat wake handler.
* Returns a disposer function that clears this specific registration.
* Stale disposers (from previous registrations) are no-ops, preventing
* a race where an old runner's cleanup clears a newer runner's handler.
*/
function setHeartbeatWakeHandler(next) {
	const previousGeneration = handlerGeneration;
	handlerGeneration += 1;
	const generation = handlerGeneration;
	handler = next;
	abortHeartbeatWakeGeneration(activeWakeTargets.values(), previousGeneration);
	if (next) {
		if (timer) clearTimeout(timer);
		timer = null;
		timerDueAt = null;
		clearPendingWakeRetryState();
	}
	if (handler && pendingWakes.size > 0) schedulePendingWakes(DEFAULT_COALESCE_MS);
	return () => {
		if (handlerGeneration !== generation) return;
		if (handler !== next) return;
		abortHeartbeatWakeGeneration(activeWakeTargets.values(), generation);
		handlerGeneration += 1;
		handler = null;
	};
}
function requestHeartbeat(opts) {
	const requestedAt = Date.now();
	const coalesceMs = opts.coalesceMs ?? DEFAULT_COALESCE_MS;
	queuePendingWakeReason({
		source: opts.source,
		intent: opts.intent,
		reason: opts.reason,
		agentId: opts.agentId,
		sessionKey: opts.sessionKey,
		heartbeat: opts.heartbeat,
		scheduledEveryMs: opts.scheduledEveryMs,
		scheduledAnchorMs: opts.scheduledAnchorMs,
		tasks: opts.tasks,
		requestedAt,
		readyAtMs: requestedAt + resolveTimerTimeoutMs(coalesceMs, DEFAULT_COALESCE_MS, 0)
	});
	schedule(coalesceMs);
}
//#endregion
export { HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT as a, requestHeartbeat as c, getHeartbeatWakeAbortSignal as d, HEARTBEAT_SKIP_PREEMPTED as i, setHeartbeatWakeHandler as l, HEARTBEAT_SKIP_CRON_IN_PROGRESS as n, areHeartbeatsEnabled as o, HEARTBEAT_SKIP_NO_PENDING_EVENT as r, isRetryableHeartbeatSkipReason as s, HEARTBEAT_IDLE_RETRY_GRACE_MS as t, setHeartbeatsEnabled as u };
