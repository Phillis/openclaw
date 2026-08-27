import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { o as readErrorName, r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { d as markGatewayRestartDraining, f as resetGatewayWorkAdmission, l as isGatewaySubordinateWorkAdmissionClosed, t as GatewayDrainingError, u as isGatewayWorkAdmissionClosed, y as runWithGatewayRootWorkReadmission } from "./gateway-work-admission-CTDt7IQ1.js";
import { i as logLaneEnqueue, r as logLaneDequeue, t as diagnosticLogger } from "./diagnostic-runtime-IUeGlWCe.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/command-queue.state.ts
const INITIAL_QUEUE_RING_CAPACITY = 16;
function createQueueRing() {
	return {
		entries: [],
		head: 0,
		length: 0
	};
}
function createLaneQueue() {
	return {
		background: createQueueRing(),
		normal: createQueueRing(),
		foreground: createQueueRing(),
		length: 0
	};
}
function getPriorityRing(queue, priority) {
	switch (priority) {
		case 1: return queue.foreground;
		case -1: return queue.background;
		default: return queue.normal;
	}
}
function appendQueueRing(ring, entry) {
	if (ring.length === ring.entries.length) {
		const nextCapacity = Math.max(INITIAL_QUEUE_RING_CAPACITY, ring.length * 2);
		const nextEntries = Array.from({ length: nextCapacity });
		for (let index = 0; index < ring.length; index += 1) nextEntries[index] = ring.entries[(ring.head + index) % ring.entries.length];
		ring.entries = nextEntries;
		ring.head = 0;
	}
	ring.entries[(ring.head + ring.length) % ring.entries.length] = entry;
	ring.length += 1;
}
function peekQueueRing(ring) {
	return ring.length > 0 ? ring.entries[ring.head] : void 0;
}
function dequeueQueueRing(ring) {
	if (ring.length === 0) return;
	const entry = ring.entries[ring.head];
	ring.entries[ring.head] = void 0;
	ring.length -= 1;
	if (ring.length === 0) {
		ring.entries = [];
		ring.head = 0;
	} else ring.head = (ring.head + 1) % ring.entries.length;
	return entry;
}
/** Append to one of three fixed priority FIFOs and return the queued work ahead. */
function enqueueLaneQueue(queue, entry) {
	const ring = getPriorityRing(queue, entry.priority);
	const queuedAhead = ring.length + (entry.priority <= 0 ? queue.foreground.length : 0) + (entry.priority < 0 ? queue.normal.length : 0);
	appendQueueRing(ring, entry);
	queue.length += 1;
	return queuedAhead;
}
function peekLaneQueue(queue) {
	return peekQueueRing(queue.foreground) ?? peekQueueRing(queue.normal) ?? peekQueueRing(queue.background);
}
function dequeueLaneQueue(queue) {
	const entry = dequeueQueueRing(queue.foreground) ?? dequeueQueueRing(queue.normal) ?? dequeueQueueRing(queue.background);
	if (entry) queue.length -= 1;
	return entry;
}
/**
* Keep queue runtime state on globalThis so every bundled entry/chunk shares
* the same lanes, counters, and draining flag in production builds.
*/
const COMMAND_QUEUE_STATE_KEY = Symbol.for("openclaw.commandQueueState");
function getQueueState() {
	const state = resolveGlobalSingleton(COMMAND_QUEUE_STATE_KEY, () => ({
		lanes: /* @__PURE__ */ new Map(),
		nextTaskId: 1,
		nextQueueSequence: 1,
		queueFormatVersion: 1
	}));
	if (!state.nextQueueSequence) state.nextQueueSequence = 1;
	if (state.queueFormatVersion !== 1) {
		let maxQueueSequence = state.nextQueueSequence - 1;
		for (const lane of state.lanes.values()) {
			if (!Array.isArray(lane.queue)) continue;
			const legacyQueue = lane.queue;
			const queue = createLaneQueue();
			for (const [index, entry] of legacyQueue.entries()) {
				entry.priority = entry.priority === 1 || entry.priority === -1 ? entry.priority : 0;
				if (typeof entry.sequence !== "number") entry.sequence = state.nextQueueSequence++;
				maxQueueSequence = Math.max(maxQueueSequence, entry.sequence);
				if (typeof entry.queuedAheadAtEnqueue !== "number") entry.queuedAheadAtEnqueue = index;
				if (typeof entry.activeAheadAtEnqueue !== "number") entry.activeAheadAtEnqueue = lane.activeTaskIds.size;
				enqueueLaneQueue(queue, entry);
			}
			lane.queue = queue;
		}
		if (state.nextQueueSequence <= maxQueueSequence) state.nextQueueSequence = maxQueueSequence + 1;
		state.queueFormatVersion = 1;
	}
	return state;
}
function normalizeLane(lane) {
	return lane.trim() || "main";
}
//#endregion
//#region src/process/command-queue.capacity-groups.ts
/** Shared across fresh module instances so one group cannot re-enter its arbiter. */
const DRAINING_GROUPS = resolveGlobalSingleton(Symbol.for("openclaw.commandQueueDrainingGroups"), () => /* @__PURE__ */ new WeakSet());
/**
* Lanes that must never join a group, because a group member can be made to
* wait for a sibling and these lanes can be synchronously awaited by other
* lanes — which would turn a wait into a deadlock.
*
* Known wait edges at this base: outer `cron` -> `cron-nested`
* (`server-cron.ts` passes lane "cron"; `agents/lanes.ts` remaps inner work),
* and `session:<key>` -> global lane (embedded-agent-runner run + compaction).
*/
const GROUP_INELIGIBLE_LANES = /* @__PURE__ */ new Set([
	"cron",
	"main",
	"subagent",
	"nested"
]);
const GROUP_INELIGIBLE_PREFIXES = [
	"session:",
	"nested:",
	"context-engine-turn-maintenance:"
];
function assertGroupEligibleLane(lane) {
	if (GROUP_INELIGIBLE_LANES.has(lane)) throw new Error(`command lane "${lane}" cannot join a capacity group: it can be synchronously awaited by another lane`);
	for (const prefix of GROUP_INELIGIBLE_PREFIXES) if (lane.startsWith(prefix)) throw new Error(`command lane "${lane}" cannot join a capacity group: "${prefix}*" lanes can be synchronously awaited`);
}
/** Group registry, keyed by group id and by member lane name. */
function getGroupRegistry() {
	const state = getQueueState();
	if (!state.laneGroups) state.laneGroups = /* @__PURE__ */ new Map();
	if (!state.laneGroupByLane) state.laneGroupByLane = /* @__PURE__ */ new Map();
	return {
		groups: state.laneGroups,
		groupByLane: state.laneGroupByLane
	};
}
function getLaneGroup(lane) {
	const { groups, groupByLane } = getGroupRegistry();
	const groupId = groupByLane.get(lane);
	return groupId ? groups.get(groupId) : void 0;
}
/**
* Active task count for a group member WITHOUT creating the lane. Creating it
* here would resurrect lanes that `retireIdleScopedCommandLane` just removed.
*/
function getMemberActiveCount(lane) {
	return getQueueState().lanes.get(lane)?.activeTaskIds.size ?? 0;
}
/**
* Why `lane` cannot admit another task, or null if it can.
*
* Group capacity is always DERIVED from members' `activeTaskIds`, never tracked
* in a separate counter. That is what makes timeout, abort, clear, reset and
* stale-generation completion release capacity for free: they all remove the
* task id, so the next admission decision simply sees a smaller number. The
* only remaining obligation is that those paths re-drain the group.
*/
function resolveLaneBlockReason(lane) {
	const state = getQueueState().lanes.get(lane);
	if (state && state.activeTaskIds.size >= state.maxConcurrent) return "lane";
	const group = getLaneGroup(lane);
	if (!group) return null;
	let groupActive = 0;
	let siblingReserveHeld = 0;
	for (const member of group.members) {
		const active = getMemberActiveCount(member);
		groupActive += active;
		if (member !== lane) siblingReserveHeld += Math.max(0, (group.reservations.get(member) ?? 0) - active);
	}
	if (groupActive >= group.budget) return "group-budget";
	if (getMemberActiveCount(lane) < (group.reservations.get(lane) ?? 0)) return null;
	return groupActive + siblingReserveHeld < group.budget ? null : "sibling-reservation";
}
function canAdmitInGroup(lane) {
	const reason = resolveLaneBlockReason(lane);
	return reason === null || reason === "lane";
}
/**
* Define or replace a capacity group.
*
* Membership is held here, keyed by lane name, and deliberately NOT inside
* `LaneState`: `setCommandLaneConcurrency` must not be able to detach a lane
* from its group, or session suspend/resume would silently restore a member to
* ungoverned concurrency.
*/
function validateCommandLaneGroupSpec(group, spec) {
	const members = spec.members.map((member) => normalizeLane(member));
	for (const member of members) assertGroupEligibleLane(member);
	const reservations = /* @__PURE__ */ new Map();
	let reservedTotal = 0;
	for (const [rawLane, count] of Object.entries(spec.reservations ?? {})) {
		const member = normalizeLane(rawLane);
		if (!members.includes(member)) throw new Error(`command lane group "${group}" reserves for non-member lane "${member}"`);
		const reserved = Math.max(0, Math.floor(count));
		reservations.set(member, reserved);
		reservedTotal += reserved;
	}
	const budget = Math.max(0, Math.floor(spec.budget));
	if (reservedTotal > budget) throw new Error(`command lane group "${group}" reserves ${reservedTotal} slots but its budget is ${budget}`);
	return {
		group,
		budget,
		members: new Set(members),
		reservations
	};
}
/** Install a validated group, detaching its members from any previous owner. */
function installCommandLaneGroup(next) {
	const { groups, groupByLane } = getGroupRegistry();
	const previous = groups.get(next.group);
	if (previous) for (const member of previous.members) groupByLane.delete(member);
	for (const member of next.members) {
		const owner = groupByLane.get(member);
		if (owner && owner !== next.group) groups.get(owner)?.members.delete(member);
	}
	groups.set(next.group, next);
	for (const member of next.members) groupByLane.set(member, next.group);
}
/**
* Select the highest-priority, oldest currently admissible member head.
*/
function resolveNextGroupLane(group) {
	let selected;
	for (const lane of group.members) {
		const state = getQueueState().lanes.get(lane);
		const head = state ? peekLaneQueue(state.queue) : void 0;
		if (!state || !head || state.draining || resolveLaneBlockReason(lane) !== null) continue;
		if (!selected || head.priority > selected.priority || head.priority === selected.priority && (head.sequence < selected.sequence || head.sequence === selected.sequence && lane < selected.lane)) selected = {
			lane,
			priority: head.priority,
			sequence: head.sequence
		};
	}
	return selected?.lane;
}
/**
* Drain a capacity group one admission at a time.
*
* Per-lane queues already order entries by priority and global sequence. The
* group applies the same order across member queue heads so a completing lane
* cannot synchronously reclaim shared capacity ahead of an older sibling.
*/
function drainCommandLaneGroup(lane, drainLane) {
	const group = getLaneGroup(lane);
	if (!group || DRAINING_GROUPS.has(group)) return;
	DRAINING_GROUPS.add(group);
	try {
		while (getGroupRegistry().groups.get(group.group) === group) {
			const selectedLane = resolveNextGroupLane(group);
			if (!selectedLane || drainLane(selectedLane, 1) === 0) return;
		}
	} finally {
		DRAINING_GROUPS.delete(group);
	}
}
/**
* Re-drain the owning capacity group after a member changes state.
*
* The legacy exported name and callback surface stay stable for internal SDK
* consumers; the supplied queue drain also supports the private bounded call.
*/
function drainGroupSiblings(lane, drainLane) {
	drainCommandLaneGroup(lane, drainLane);
}
//#endregion
//#region src/process/command-queue.ts
/**
* Dedicated error type thrown when a queued command is rejected because
* its lane was cleared.  Callers that fire-and-forget enqueued tasks can
* catch (or ignore) this specific type to avoid unhandled-rejection noise.
*/
var CommandLaneClearedError = class extends Error {
	constructor(lane) {
		super(lane ? `Command lane "${lane}" cleared` : "Command lane cleared");
		this.name = "CommandLaneClearedError";
	}
};
/**
* Dedicated error type thrown when an active command exceeds its caller-owned
* lane timeout. The underlying task may still be unwinding, but the lane is
* released so queued work is not blocked forever.
*/
var CommandLaneTaskTimeoutError = class extends Error {
	constructor(lane, details) {
		const message = (() => {
			switch (details.cause) {
				case "task-budget": return `elapsed ${details.elapsedMs}ms reached task budget ${details.taskBudgetMs}ms`;
				case "progress-idle": return `no progress for ${details.idleMs}ms (task budget ${details.taskBudgetMs}ms, elapsed ${details.elapsedMs}ms)`;
				case "abort-grace": return `abort grace ${details.graceMs}ms elapsed (task budget ${details.taskBudgetMs}ms, elapsed ${details.elapsedMs}ms)`;
				case "release-signal": return `lane release requested after ${details.elapsedMs}ms (task budget ${details.taskBudgetMs}ms)`;
				default: throw new TypeError("Unsupported command lane timeout cause");
			}
		})();
		super(`Command lane "${lane}" task timed out: ${message}`);
		this.name = "CommandLaneTaskTimeoutError";
	}
};
function isCommandLaneTaskTimeoutError(err, lane) {
	if (!(err instanceof Error)) return false;
	if (!(err instanceof CommandLaneTaskTimeoutError || err.name === "CommandLaneTaskTimeoutError")) return false;
	return lane === void 0 || err.message.includes(`Command lane "${lane}" task timed out`);
}
function isExpectedNonErrorLaneFailure(err) {
	return err instanceof Error && err.name === "LiveSessionModelSwitchError";
}
function isQuietProbeLane(lane) {
	return lane.startsWith("auth-probe:") || lane.startsWith("session:probe-") || lane.startsWith("session:temp:setup-inference:probe-setup-inference-");
}
function getLaneDepth(state) {
	return state.queue.length + state.activeTaskIds.size;
}
function createCommandLaneSnapshot(state) {
	const snapshot = {
		lane: state.lane,
		queuedCount: state.queue.length,
		activeCount: state.activeTaskIds.size,
		maxConcurrent: state.maxConcurrent,
		draining: state.draining,
		generation: state.generation,
		blockedBy: resolveLaneBlockReason(state.lane)
	};
	const group = getLaneGroup(state.lane);
	if (group) {
		let groupActive = 0;
		for (const member of group.members) groupActive += getMemberActiveCount(member);
		snapshot.group = group.group;
		snapshot.groupActive = groupActive;
		snapshot.groupBudget = group.budget;
		snapshot.reservedForLane = group.reservations.get(state.lane) ?? 0;
	}
	return snapshot;
}
function getLaneState(lane) {
	const queueState = getQueueState();
	const existing = queueState.lanes.get(lane);
	if (existing) return existing;
	const created = {
		lane,
		queue: createLaneQueue(),
		activeTaskIds: /* @__PURE__ */ new Set(),
		maxConcurrent: 1,
		draining: false,
		generation: 0
	};
	queueState.lanes.set(lane, created);
	return created;
}
function completeTask(state, taskId, taskGeneration) {
	if (taskGeneration !== state.generation) return false;
	state.activeTaskIds.delete(taskId);
	return true;
}
function retireIdleScopedCommandLane(state) {
	if (state.draining || state.activeTaskIds.size > 0 || state.queue.length > 0 || state.maxConcurrent !== 1 || !state.lane.startsWith("session:") && !state.lane.startsWith("nested:") && !state.lane.startsWith("context-engine-turn-maintenance:")) return;
	const lanes = getQueueState().lanes;
	if (lanes.get(state.lane) === state) lanes.delete(state.lane);
}
function normalizeTaskTimeoutMs(value) {
	if (value === void 0 || !Number.isFinite(value) || value <= 0) return;
	return clampPositiveTimerTimeoutMs(value);
}
function resolveQueuePriority(priority) {
	switch (priority) {
		case "foreground": return 1;
		case "background": return -1;
		default: return 0;
	}
}
function enqueueLaneEntry(state, entry) {
	entry.queuedAheadAtEnqueue = enqueueLaneQueue(state.queue, entry);
	entry.activeAheadAtEnqueue = state.activeTaskIds.size;
}
async function runQueueEntryTask(lane, entry, marker) {
	const taskPromise = Promise.resolve().then(() => entry.task(marker));
	const taskTimeoutMs = normalizeTaskTimeoutMs(entry.taskTimeoutMs);
	if (taskTimeoutMs === void 0) return await taskPromise;
	const taskTimeoutAbortGraceMs = normalizeTaskTimeoutMs(entry.taskTimeoutAbortGraceMs) ?? taskTimeoutMs;
	const startedAtMs = Date.now();
	const readLastProgressAtMs = () => {
		let value;
		try {
			value = entry.taskTimeoutProgressAtMs?.();
		} catch (err) {
			diagnosticLogger.warn(`lane task timeout progress callback failed: lane=${lane} error="${String(err)}"`);
		}
		return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.max(startedAtMs, Math.floor(value)) : startedAtMs;
	};
	let timeoutHandle;
	let removeAbortListener;
	let removeReleaseListener;
	let timedOut = false;
	const timeoutPromise = new Promise((_, reject) => {
		const elapsedSinceStartMs = () => Math.max(0, Date.now() - startedAtMs);
		const rejectForTimeout = (details) => {
			timedOut = true;
			reject(new CommandLaneTaskTimeoutError(lane, {
				...details,
				elapsedMs: elapsedSinceStartMs(),
				taskBudgetMs: taskTimeoutMs
			}));
		};
		const armTimer = (delayMs, onTimeout) => {
			if (timeoutHandle) clearTimeout(timeoutHandle);
			if (delayMs <= 0) {
				onTimeout();
				return;
			}
			timeoutHandle = setTimeout(onTimeout, delayMs);
			timeoutHandle.unref?.();
		};
		const armProgressTimeout = () => {
			const elapsedMs = Math.max(0, Date.now() - readLastProgressAtMs());
			const remainingMs = taskTimeoutMs - elapsedMs;
			if (remainingMs <= 0) {
				rejectForTimeout(entry.taskTimeoutProgressAtMs ? {
					cause: "progress-idle",
					idleMs: elapsedMs
				} : { cause: "task-budget" });
				return;
			}
			armTimer(remainingMs, armProgressTimeout);
		};
		const armAbortTimeout = () => {
			const abortStartedAtMs = Date.now();
			armTimer(taskTimeoutAbortGraceMs, () => rejectForTimeout({
				cause: "abort-grace",
				graceMs: Math.max(0, Date.now() - abortStartedAtMs)
			}));
		};
		const abortSignal = entry.taskTimeoutAbortSignal;
		const releaseSignal = entry.taskTimeoutReleaseSignal;
		const onRelease = () => {
			removeReleaseListener?.();
			rejectForTimeout({ cause: "release-signal" });
		};
		if (releaseSignal?.aborted) {
			onRelease();
			return;
		}
		if (abortSignal?.aborted) {
			armAbortTimeout();
			return;
		}
		armProgressTimeout();
		if (abortSignal) {
			const onAbort = () => {
				removeAbortListener?.();
				armAbortTimeout();
			};
			abortSignal.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
		}
		if (releaseSignal) {
			releaseSignal.addEventListener("abort", onRelease, { once: true });
			removeReleaseListener = () => releaseSignal.removeEventListener("abort", onRelease);
		}
	});
	try {
		return await Promise.race([taskPromise, timeoutPromise]);
	} catch (err) {
		if (timedOut) taskPromise.catch((lateErr) => {
			diagnosticLogger.warn(`lane task rejected after timeout: lane=${lane} timeoutMs=${taskTimeoutMs} error="${String(lateErr)}"`);
		});
		throw err;
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
		removeAbortListener?.();
		removeReleaseListener?.();
	}
}
function drainLane(lane, maxStarts = Number.POSITIVE_INFINITY, state = getLaneState(lane)) {
	if (state.draining) {
		if (state.activeTaskIds.size === 0 && state.queue.length > 0) diagnosticLogger.warn(`drainLane blocked: lane=${lane} draining=true active=0 queue=${state.queue.length}`);
		return 0;
	}
	state.draining = true;
	let started = 0;
	try {
		while (started < maxStarts && state.activeTaskIds.size < state.maxConcurrent && state.queue.length > 0 && canAdmitInGroup(lane)) {
			const entry = dequeueLaneQueue(state.queue);
			const waitedMs = Date.now() - entry.enqueuedAt;
			const activeBeforeStart = state.activeTaskIds.size;
			const taskId = getQueueState().nextTaskId++;
			const taskGeneration = state.generation;
			state.activeTaskIds.add(taskId);
			started += 1;
			if (waitedMs >= entry.warnAfterMs) {
				try {
					entry.onWait?.(waitedMs, entry.queuedAheadAtEnqueue);
				} catch (err) {
					diagnosticLogger.error(`lane onWait callback failed: lane=${lane} error="${String(err)}"`);
				}
				diagnosticLogger.warn(`lane wait exceeded: lane=${lane} waitedMs=${waitedMs} queueAhead=${entry.queuedAheadAtEnqueue} activeAhead=${entry.activeAheadAtEnqueue} activeNow=${activeBeforeStart} queueBehind=${state.queue.length}`);
			}
			logLaneDequeue(lane, waitedMs, state.queue.length);
			(async () => {
				const startTime = Date.now();
				try {
					const result = await runQueueEntryTask(lane, entry, {
						lane,
						taskId,
						generation: taskGeneration
					});
					if (completeTask(state, taskId, taskGeneration)) {
						diagnosticLogger.debug(`lane task done: lane=${lane} durationMs=${Date.now() - startTime} active=${state.activeTaskIds.size} queued=${state.queue.length}`);
						drainReadyCommandLane(lane, state);
					}
					entry.resolve(result);
				} catch (err) {
					const completedCurrentGeneration = completeTask(state, taskId, taskGeneration);
					const isProbeLane = isQuietProbeLane(lane);
					if (!isProbeLane && !isExpectedNonErrorLaneFailure(err)) diagnosticLogger.error(`lane task error: lane=${lane} durationMs=${Date.now() - startTime} error="${formatErrorMessage(err)}"`, { errorName: readErrorName(err) || void 0 });
					else if (!isProbeLane) diagnosticLogger.debug(`lane task interrupted: lane=${lane} durationMs=${Date.now() - startTime} reason="${String(err)}"`);
					if (completedCurrentGeneration) drainReadyCommandLane(lane, state);
					entry.reject(err);
				}
			})();
		}
	} finally {
		state.draining = false;
		retireIdleScopedCommandLane(state);
	}
	return started;
}
function drainReadyCommandLane(lane, completedState) {
	if (getLaneGroup(lane)) {
		drainGroupSiblings(lane, drainLane);
		return;
	}
	drainLane(lane, Number.POSITIVE_INFINITY, completedState);
}
/**
* Mark gateway as draining for restart so new enqueues fail fast with
* `GatewayDrainingError` instead of being silently killed on shutdown.
*/
function markGatewayDraining() {
	markGatewayRestartDraining();
}
function isGatewayDraining() {
	return isGatewayWorkAdmissionClosed();
}
/**
* Apply lane concurrencies and group definitions as ONE transaction.
*
* `setCommandLaneConcurrency` drains the instant a lane goes positive, and
* gateway publication is sequential — so applying lanes one at a time can widen
* a member and let it dispatch BEFORE its group exists, admitting work above
* the budget the group was meant to enforce. Suppressing drains until every
* lane max and every group definition is installed closes that window; a single
* commit-time drain pass then dispatches under the final configuration.
*
* Callers must route grouped lanes through here rather than the per-lane
* setter, which cannot know about a group that does not exist yet.
*/
function publishLaneConfiguration(config) {
	const validated = [];
	for (const [group, spec] of Object.entries(config.groups ?? {})) validated.push(validateCommandLaneGroupSpec(group, spec));
	const touched = /* @__PURE__ */ new Set();
	for (const [rawLane, maxConcurrent] of Object.entries(config.lanes ?? {})) {
		const lane = normalizeLane(rawLane);
		const state = getLaneState(lane);
		const minConcurrent = isQuietProbeLane(lane) ? 1 : 0;
		state.maxConcurrent = Math.max(minConcurrent, Math.floor(maxConcurrent));
		touched.add(lane);
	}
	for (const group of config.clearGroups ?? []) {
		const { groups, groupByLane } = getGroupRegistry();
		const existing = groups.get(group);
		if (existing) {
			for (const member of existing.members) {
				groupByLane.delete(member);
				touched.add(member);
			}
			groups.delete(group);
		}
	}
	for (const next of validated) {
		const { groups, groupByLane } = getGroupRegistry();
		const previous = groups.get(next.group);
		for (const member of previous?.members ?? []) touched.add(member);
		for (const member of next.members) {
			const previousOwner = groupByLane.get(member);
			for (const previousSibling of groups.get(previousOwner ?? "")?.members ?? []) touched.add(previousSibling);
		}
		installCommandLaneGroup(next);
		for (const member of next.members) touched.add(member);
	}
	for (const lane of touched) {
		const state = getQueueState().lanes.get(lane);
		if (state && state.maxConcurrent > 0 && state.queue.length > 0 && !state.draining) drainReadyCommandLane(lane);
	}
}
function setCommandLaneConcurrency(lane, maxConcurrent) {
	const cleaned = normalizeLane(lane);
	const state = getLaneState(cleaned);
	const minConcurrent = isQuietProbeLane(cleaned) ? 1 : 0;
	state.maxConcurrent = Math.max(minConcurrent, Math.floor(maxConcurrent));
	if (state.maxConcurrent > 0) drainReadyCommandLane(cleaned);
}
function enqueueCommandInLane(lane, task, opts) {
	const queueState = getQueueState();
	if (isGatewaySubordinateWorkAdmissionClosed()) return Promise.reject(new GatewayDrainingError());
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	const cleaned = normalizeLane(lane);
	const warnAfterMs = opts?.warnAfterMs ?? 2e3;
	const state = getLaneState(cleaned);
	return new Promise((resolve, reject) => {
		enqueueLaneEntry(state, {
			task: (marker) => runInAsyncContext(runWithGatewayRootWorkReadmission, () => task(marker)),
			resolve: (value) => resolve(value),
			reject,
			enqueuedAt: Date.now(),
			sequence: queueState.nextQueueSequence++,
			priority: resolveQueuePriority(opts?.priority),
			warnAfterMs,
			queuedAheadAtEnqueue: 0,
			activeAheadAtEnqueue: 0,
			taskTimeoutMs: normalizeTaskTimeoutMs(opts?.taskTimeoutMs),
			taskTimeoutProgressAtMs: opts?.taskTimeoutProgressAtMs,
			taskTimeoutAbortSignal: opts?.taskTimeoutAbortSignal,
			taskTimeoutAbortGraceMs: normalizeTaskTimeoutMs(opts?.taskTimeoutAbortGraceMs),
			taskTimeoutReleaseSignal: opts?.taskTimeoutReleaseSignal,
			onWait: opts?.onWait
		});
		logLaneEnqueue(cleaned, getLaneDepth(state));
		drainReadyCommandLane(cleaned);
	});
}
function getQueueSize(lane = "main") {
	const resolved = normalizeLane(lane);
	const state = getQueueState().lanes.get(resolved);
	if (!state) return 0;
	return getLaneDepth(state);
}
function getCommandLaneSnapshot(lane = "main") {
	const resolved = normalizeLane(lane);
	const state = getQueueState().lanes.get(resolved);
	if (!state) {
		const group = getLaneGroup(resolved);
		const empty = {
			lane: resolved,
			queuedCount: 0,
			activeCount: 0,
			maxConcurrent: 1,
			draining: false,
			generation: 0,
			blockedBy: resolveLaneBlockReason(resolved)
		};
		if (group) {
			let groupActive = 0;
			for (const member of group.members) groupActive += getMemberActiveCount(member);
			empty.group = group.group;
			empty.groupActive = groupActive;
			empty.groupBudget = group.budget;
			empty.reservedForLane = group.reservations.get(resolved) ?? 0;
		}
		return empty;
	}
	return createCommandLaneSnapshot(state);
}
/** Per-lane work totals for every live lane; diagnostics composition lives in command-lane-diagnostics.ts. */
function listCommandLaneTotals() {
	return [...getQueueState().lanes.values()].map((state) => ({
		lane: state.lane,
		activeCount: state.activeTaskIds.size,
		queuedCount: state.queue.length
	}));
}
/**
* Active task ids for a lane. Ids are process-monotonic, so recovery can
* detect a turn that started after a point in time it captured earlier.
*/
function getCommandLaneActiveTaskIds(lane = "main") {
	const state = getQueueState().lanes.get(normalizeLane(lane));
	return state ? [...state.activeTaskIds] : [];
}
/** Return whether this exact lane task still owns an active queue slot. */
function isCommandLaneTaskMarkerCurrent(marker) {
	if (!marker) return false;
	const state = getQueueState().lanes.get(normalizeLane(marker.lane));
	return state?.generation === marker.generation && state.activeTaskIds.has(marker.taskId);
}
function getTotalQueueSize() {
	let total = 0;
	for (const s of getQueueState().lanes.values()) total += getLaneDepth(s);
	return total;
}
function clearCommandLane(lane = "main") {
	const cleaned = normalizeLane(lane);
	const state = getQueueState().lanes.get(cleaned);
	if (!state) return 0;
	const removed = state.queue.length;
	let entry;
	while (entry = dequeueLaneQueue(state.queue)) entry.reject(new CommandLaneClearedError(cleaned));
	return removed;
}
/**
* Force a single lane back to idle and immediately pump any queued entries.
* Used only by recovery paths after the owner has already attempted to abort
* the active work; stale completions from the previous generation are ignored.
*/
function resetCommandLane(lane = "main") {
	const cleaned = normalizeLane(lane);
	const state = getQueueState().lanes.get(cleaned);
	if (!state) return 0;
	const released = state.activeTaskIds.size;
	state.generation += 1;
	state.activeTaskIds.clear();
	state.draining = false;
	drainReadyCommandLane(cleaned);
	return released;
}
/**
* Reset all lane runtime state to idle. Used after SIGUSR1 in-process
* restarts where interrupted tasks' finally blocks may not run, leaving
* stale active task IDs that permanently block new work from draining.
*
* Bumps lane generation and clears execution counters so stale completions
* from old in-flight tasks are ignored. Queued entries are intentionally
* preserved — they represent pending user work that should still execute
* after restart.
*
* After resetting, drains any lanes that still have queued entries so
* preserved work is pumped immediately rather than waiting for a future
* `enqueueCommandInLane()` call (which may never come).
*/
function resetAllLanes() {
	const queueState = getQueueState();
	resetGatewayWorkAdmission();
	const lanesToDrain = [];
	for (const state of queueState.lanes.values()) {
		state.generation += 1;
		state.activeTaskIds.clear();
		state.draining = false;
		if (state.queue.length > 0) lanesToDrain.push(state.lane);
	}
	for (const lane of lanesToDrain) drainReadyCommandLane(lane);
}
//#endregion
export { getCommandLaneSnapshot as a, isCommandLaneTaskMarkerCurrent as c, listCommandLaneTotals as d, markGatewayDraining as f, setCommandLaneConcurrency as g, resetCommandLane as h, getCommandLaneActiveTaskIds as i, isCommandLaneTaskTimeoutError as l, resetAllLanes as m, clearCommandLane as n, getQueueSize as o, publishLaneConfiguration as p, enqueueCommandInLane as r, getTotalQueueSize as s, CommandLaneClearedError as t, isGatewayDraining as u };
