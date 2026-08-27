import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { H as bindDeliveryQueueEntry, K as loadDeliveryQueueEntryInDatabase, X as upsertBoundDeliveryQueueEntryInDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CeAO_dqo.js";
import { g as upsertTaskRunRowInDatabase, t as bindTaskRecord } from "./task-registry.store.sqlite-7NOoQ9mC.js";
import { S as getTaskById, v as publishTaskRecordAfterAtomicStore, x as findTaskByRunId } from "./task-registry-DzN8snH1.js";
import "./runtime-internal-KZAce0-2.js";
import { a as getErrnoCode, c as resolveDeliveryRecoveryDeadlineMs, n as createDeliveryRecoveryCoordinator, o as isDeliveryRecoveryRetryEligible, r as createEmptyDeliveryRecoverySummary, t as computeBackoffMs } from "./delivery-recovery.shared-B2XgPiah.js";
import { C as subagentRuns, c as upsertSubagentRunRowInDatabase, p as ensureDeliveryState, t as bindSubagentRunRecord } from "./subagent-registry.store.sqlite-C0InRbpL.js";
import { t as resolveSubagentCompletionResultText } from "./subagent-completion-result-DHC2b2aV.js";
import { T as safeRemoveAttachmentsDir, g as ANNOUNCE_COMPLETION_HARD_EXPIRY_MS, s as loadPendingFinalDeliveryPayload } from "./subagent-registry-lifecycle-delivery-poPWIFhB.js";
import { o as getDeliveryQueueEntryStatus } from "./delivery-queue-sqlite-YQvmsrNF.js";
import { _ as markSessionDeliverySettlement, a as SessionDeliveryDeferredError, b as prepareClaimedSessionDelivery, h as loadPendingSessionDelivery, i as SessionDeliveryDeadLetteredError, l as completeSessionDelivery, m as loadPendingSessionDeliveries, n as SessionDeliveryAcknowledgementFinalizeError, o as SessionDeliveryRetryChargedError, p as failSessionDelivery, r as SessionDeliveryAttemptStartError, s as SessionDeliverySafeRetryError, t as SESSION_DELIVERY_QUEUE_NAME, x as releaseSessionDeliveryClaim, y as moveSessionDeliveryToFailed } from "./session-delivery-queue-storage-CouGbFe6.js";
//#region src/infra/session-delivery-queue-recovery.ts
const MAX_SESSION_DELIVERY_RETRIES = 5;
const recoveryCoordinator = createDeliveryRecoveryCoordinator();
async function notifySessionDeliverySettled(params) {
	try {
		await params.onSettled?.(params.entry, params.outcome);
		return true;
	} catch (error) {
		params.log.error(`session delivery: settled callback failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
async function finalizeSessionDeliverySettlement(params) {
	if (!await notifySessionDeliverySettled(params)) return false;
	try {
		if (params.outcome === "recovered") await completeSessionDelivery(params.entry.id, params.stateDir);
		else await moveSessionDeliveryToFailed(params.entry.id, params.stateDir);
		return true;
	} catch (error) {
		params.log.error(`session delivery: ${params.outcome} finalization failed for ${params.entry.id}: ${String(error)}`);
		return false;
	}
}
function resolvePendingSettlementOutcome(entry) {
	return entry.settlementOutcome ?? (entry.acknowledgedAt !== void 0 ? "recovered" : void 0);
}
function resolveSessionDeliveryMaxRetries(entry) {
	return entry.maxRetries ?? MAX_SESSION_DELIVERY_RETRIES;
}
function canReconcileStartedAgentAttemptAtRetryLimit(entry) {
	return entry.kind === "agentTurn" && entry.deliveryStartedAt !== void 0 && entry.retryCount === resolveSessionDeliveryMaxRetries(entry);
}
function resolveSessionRetryEligibility(entry, now) {
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") {
		if (now >= entry.owner.deadlineAt) return { eligible: true };
		const remainingBackoffMs = Math.max(0, (entry.availableAt ?? 0) - now);
		return remainingBackoffMs > 0 ? {
			eligible: false,
			remainingBackoffMs
		} : { eligible: true };
	}
	return isDeliveryRecoveryRetryEligible(entry, now);
}
async function processPendingSessionDelivery(opts) {
	const { entry, context } = opts;
	const pendingSettlementOutcome = resolvePendingSettlementOutcome(entry);
	if (pendingSettlementOutcome) return {
		status: pendingSettlementOutcome,
		finalized: await finalizeSessionDeliverySettlement({
			entry,
			log: context.log,
			onSettled: context.onSettled,
			outcome: pendingSettlementOutcome,
			stateDir: context.stateDir
		})
	};
	if (!canReconcileStartedAgentAttemptAtRetryLimit(entry) && entry.retryCount >= resolveSessionDeliveryMaxRetries(entry)) {
		await markSessionDeliverySettlement(entry, "moved-to-failed", context.stateDir);
		return {
			status: "max-retries",
			finalized: await finalizeSessionDeliverySettlement({
				entry,
				log: context.log,
				onSettled: context.onSettled,
				outcome: "moved-to-failed",
				stateDir: context.stateDir
			})
		};
	}
	if (!opts.bypassBackoff) {
		const retryEligibility = resolveSessionRetryEligibility(entry, Date.now());
		if (!retryEligibility.eligible) return {
			status: "backoff",
			remainingMs: retryEligibility.remainingBackoffMs
		};
	}
	if (await opts.beforeDelivery?.() === "stop") return { status: "stop" };
	let result;
	try {
		await context.deliver(entry, { stateDir: context.stateDir });
		await markSessionDeliverySettlement(entry, "recovered", context.stateDir);
		result = "recovered";
	} catch (err) {
		if (err instanceof SessionDeliveryDeadLetteredError) {
			try {
				await markSessionDeliverySettlement(entry, "moved-to-failed", context.stateDir);
			} catch (markError) {
				if (markError instanceof SessionDeliveryAcknowledgementFinalizeError) return { status: "deferred" };
				throw markError;
			}
			result = "moved-to-failed";
		} else if (err instanceof SessionDeliveryDeferredError || err instanceof SessionDeliveryAcknowledgementFinalizeError || err instanceof SessionDeliveryAttemptStartError) return { status: "deferred" };
		else {
			const errMsg = formatErrorMessage(err);
			opts.onFailed?.(entry, errMsg);
			if (err instanceof SessionDeliveryRetryChargedError) return { status: "failed" };
			try {
				await failSessionDelivery(entry.id, errMsg, context.stateDir, { releaseAttemptOwnership: err instanceof SessionDeliverySafeRetryError });
			} catch (failErr) {
				if (getErrnoCode(failErr) === "ENOENT") return { status: "already-gone" };
				throw failErr;
			}
			return { status: "failed" };
		}
	}
	const finalized = await finalizeSessionDeliverySettlement({
		entry,
		log: context.log,
		onSettled: context.onSettled,
		outcome: result,
		stateDir: context.stateDir
	});
	return {
		status: result,
		finalized
	};
}
async function processDrainedSessionDelivery(entry, context, bypassBackoff) {
	const result = await processPendingSessionDelivery({
		entry,
		context,
		bypassBackoff,
		onFailed: (failedEntry, errMsg) => {
			context.log.warn(`${context.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`);
		}
	});
	if (result.status === "max-retries" && result.finalized) context.log.warn(`${context.logLabel}: entry ${entry.id} exceeded max retries and was moved to failed`);
	else if (result.status === "backoff") context.log.info(`${context.logLabel}: entry ${entry.id} not ready for retry yet — backoff ${result.remainingMs}ms remaining`);
	return result;
}
/** Drain one exact queued session delivery and return its final pending state. */
async function drainPendingSessionDelivery(opts) {
	const claim = await recoveryCoordinator.withClaim(opts.id, async () => {
		const entry = await loadPendingSessionDelivery(opts.id, opts.stateDir);
		if (!entry) return null;
		const result = await processDrainedSessionDelivery(entry, opts, opts.bypassBackoff);
		if (result.status === "already-gone" || "finalized" in result && result.finalized) return null;
		return result.status === "backoff" ? entry : loadPendingSessionDelivery(opts.id, opts.stateDir);
	});
	if (claim.status === "claimed-by-other-owner") {
		opts.log.info(`${opts.logLabel}: entry ${opts.id} is already being recovered`);
		return loadPendingSessionDelivery(opts.id, opts.stateDir);
	}
	return claim.value;
}
/** Replay pending session deliveries until the recovery budget is exhausted. */
async function recoverPendingSessionDeliveries(opts) {
	const pending = (await loadPendingSessionDeliveries(opts.stateDir)).filter((entry) => opts.maxEnqueuedAt == null || entry.enqueuedAt <= opts.maxEnqueuedAt);
	if (pending.length === 0) return createEmptyDeliveryRecoverySummary();
	const summary = createEmptyDeliveryRecoverySummary();
	const deadline = resolveDeliveryRecoveryDeadlineMs(opts.maxRecoveryMs);
	const onDeadlineExceeded = () => {
		opts.log.warn("Session delivery recovery time budget exceeded — remaining entries deferred");
	};
	const context = {
		...opts,
		logLabel: "Session delivery"
	};
	const beforeDelivery = async () => {
		if (await recoveryCoordinator.waitForReplay(deadline) === "deadline-exceeded") {
			onDeadlineExceeded();
			return "stop";
		}
		return "continue";
	};
	const onFailed = (_failedEntry, errMsg) => {
		summary.failed += 1;
		opts.log.warn(`Session delivery retry failed: ${errMsg}`);
	};
	await recoveryCoordinator.scan({
		entries: pending,
		loadEntry: (id) => loadPendingSessionDelivery(id, opts.stateDir),
		deadlineMs: deadline,
		onDeadlineExceeded,
		onEntry: async (currentEntry) => {
			if (opts.maxEnqueuedAt != null && currentEntry.enqueuedAt > opts.maxEnqueuedAt) return "continue";
			const result = await processPendingSessionDelivery({
				entry: currentEntry,
				context,
				beforeDelivery,
				onFailed
			});
			if (result.status === "max-retries") {
				summary.skippedMaxRetries += 1;
				return "continue";
			}
			if (result.status === "backoff") {
				summary.deferredBackoff += 1;
				return "continue";
			}
			if (result.status === "stop") return "stop";
			if (result.status === "recovered" && result.finalized) {
				summary.recovered += 1;
				opts.log.info(`Recovered session delivery ${currentEntry.id}`);
			}
			return "continue";
		}
	});
	return summary;
}
//#endregion
//#region src/infra/session-delivery-queue-runtime.ts
const RUNTIME_RELOAD_RETRY_MS = 1e3;
let runtime;
let runtimeGeneration = 0;
const scheduledEntries = /* @__PURE__ */ new Map();
const runningEntries = /* @__PURE__ */ new Map();
let pendingScanTimer;
function clearScheduledEntries() {
	for (const scheduled of scheduledEntries.values()) clearTimeout(scheduled.timer);
	scheduledEntries.clear();
	if (pendingScanTimer) {
		clearTimeout(pendingScanTimer);
		pendingScanTimer = void 0;
	}
}
function armPendingScan(generation) {
	if (!runtime || generation !== runtimeGeneration || pendingScanTimer) return;
	pendingScanTimer = setTimeout(() => {
		pendingScanTimer = void 0;
		schedulePendingSessionDeliveries();
	}, RUNTIME_RELOAD_RETRY_MS);
	pendingScanTimer.unref?.();
}
function resolveRetryDelayMs(entry) {
	const claimDelayMs = Math.max(0, (entry.availableAt ?? 0) - Date.now());
	const deadlineDelayMs = entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion" ? Math.max(0, entry.owner.deadlineAt - Date.now()) : Number.POSITIVE_INFINITY;
	if (entry.retryCount <= 0) return Math.min(claimDelayMs, deadlineDelayMs);
	if (entry.kind === "agentTurn" && entry.owner?.kind === "subagent_completion") return Math.min(deadlineDelayMs, claimDelayMs);
	const attemptedAt = entry.lastAttemptAt ?? entry.enqueuedAt;
	return Math.min(deadlineDelayMs, Math.max(claimDelayMs, attemptedAt + computeBackoffMs(entry.retryCount) - Date.now()));
}
function armSessionDeliveryId(id, delayMs, generation) {
	if (!runtime || generation !== runtimeGeneration) return;
	const dueAt = Date.now() + delayMs;
	const existing = scheduledEntries.get(id);
	if (existing && existing.dueAt <= dueAt) return;
	if (existing) clearTimeout(existing.timer);
	const timer = setTimeout(() => {
		scheduledEntries.delete(id);
		runScheduledSessionDelivery(id, generation);
	}, delayMs);
	timer.unref?.();
	scheduledEntries.set(id, {
		timer,
		dueAt
	});
}
function armSessionDelivery(entry, generation, minimumDelayMs = 0) {
	if (runningEntries.get(entry.id) === generation) return;
	armSessionDeliveryId(entry.id, Math.max(minimumDelayMs, resolveRetryDelayMs(entry)), generation);
}
async function runScheduledSessionDelivery(id, generation) {
	const activeRuntime = runtime;
	if (!activeRuntime || generation !== runtimeGeneration) return;
	if (runningEntries.get(id) === generation) return;
	runningEntries.set(id, generation);
	let pending = null;
	try {
		pending = await (activeRuntime.drain ?? drainPendingSessionDelivery)({
			id,
			logLabel: "session delivery",
			log: activeRuntime.log,
			deliver: activeRuntime.deliver,
			onSettled: activeRuntime.onSettled
		});
	} catch (error) {
		activeRuntime.log.error(`session delivery: runtime drain failed for ${id}: ${String(error)}`);
		if (runtime && generation === runtimeGeneration) armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
	} finally {
		if (runningEntries.get(id) === generation) runningEntries.delete(id);
	}
	if (!runtime || generation !== runtimeGeneration) return;
	if (pending) armSessionDelivery(pending, generation, RUNTIME_RELOAD_RETRY_MS);
}
/** Register the gateway-owned delivery callback and return its lifecycle stop handle. */
function startSessionDeliveryRuntime(params) {
	runtimeGeneration += 1;
	const generation = runtimeGeneration;
	clearScheduledEntries();
	runtime = params;
	return () => {
		if (runtimeGeneration !== generation) return;
		runtimeGeneration += 1;
		runtime = void 0;
		clearScheduledEntries();
	};
}
/** Schedule one durable entry when a gateway runtime is available. */
async function scheduleSessionDelivery(id) {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return false;
	let entry;
	try {
		entry = await (activeRuntime.reloadPending ?? loadPendingSessionDelivery)(id);
	} catch (error) {
		activeRuntime.log.error(`session delivery: failed to load ${id}: ${String(error)}`);
		armSessionDeliveryId(id, RUNTIME_RELOAD_RETRY_MS, generation);
		return true;
	}
	if (!entry || !runtime || generation !== runtimeGeneration) return !entry;
	armSessionDelivery(entry, generation);
	return true;
}
/** Schedule every pending entry after startup recovery installs the runtime owner. */
async function schedulePendingSessionDeliveries() {
	const generation = runtimeGeneration;
	const activeRuntime = runtime;
	if (!activeRuntime) return;
	let entries;
	try {
		entries = await (activeRuntime.listPending ?? loadPendingSessionDeliveries)();
	} catch (error) {
		activeRuntime.log.error(`session delivery: failed to scan pending entries: ${String(error)}`);
		armPendingScan(generation);
		return;
	}
	if (!runtime || generation !== runtimeGeneration) return;
	for (const entry of entries) armSessionDelivery(entry, generation);
}
globalThis[Symbol.for("openclaw.sessionDeliveryQueueRuntimeTestApi")] = { reset() {
	runtimeGeneration += 1;
	runtime = void 0;
	clearScheduledEntries();
} };
//#endregion
//#region src/agents/subagents/completion/subagent-completion-admission.store.ts
function invokeSynchronousHook(hook) {
	const result = hook?.();
	if (result && typeof result.then === "function") throw new Error("subagent completion admission transaction hooks must be synchronous");
}
function assertCorrelatedEntry(params) {
	const owner = params.queueEntry.kind === "agentTurn" ? params.queueEntry.owner : void 0;
	const delivery = params.subagent.delivery;
	if (!owner || owner.kind !== "subagent_completion" || owner.runId !== params.subagent.runId || owner.taskId !== params.task.taskId || owner.generation !== delivery?.generation || owner.deadlineAt !== delivery.deadlineAt || params.queueEntry.id !== delivery.queueId || params.task.deliveryStatus !== "session_queued") throw new Error("subagent completion admission records do not share one owner generation");
}
/**
* Commits the physical queue generation, logical completion owner, and task
* projection as one database-only transaction on one exact shared-state handle.
*/
function admitSubagentCompletionDelivery(params) {
	assertCorrelatedEntry(params);
	const boundQueue = bindDeliveryQueueEntry({
		queueName: SESSION_DELIVERY_QUEUE_NAME,
		entry: params.queueEntry,
		insertOnly: true
	});
	const boundSubagent = bindSubagentRunRecord(params.subagent);
	const boundTask = bindTaskRecord(params.task);
	invokeSynchronousHook(params.testHooks?.afterBind);
	return runOpenClawStateWriteTransaction((database) => {
		const claimed = upsertBoundDeliveryQueueEntryInDatabase(boundQueue, database);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("queue", database));
		if (!claimed) {
			const existing = loadDeliveryQueueEntryInDatabase(database, SESSION_DELIVERY_QUEUE_NAME, params.queueEntry.id);
			const expectedOwner = params.queueEntry.kind === "agentTurn" ? params.queueEntry.owner : void 0;
			const existingOwner = existing?.kind === "agentTurn" ? existing.owner : void 0;
			if (!existingOwner || !expectedOwner || existingOwner.kind !== expectedOwner.kind || existingOwner.runId !== expectedOwner.runId || existingOwner.taskId !== expectedOwner.taskId || existingOwner.generation !== expectedOwner.generation || existingOwner.deadlineAt !== expectedOwner.deadlineAt) throw new Error(`session delivery queue conflict for ${params.queueEntry.id}`);
		}
		upsertSubagentRunRowInDatabase(database, boundSubagent);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("subagent", database));
		upsertTaskRunRowInDatabase(database, boundTask);
		invokeSynchronousHook(() => params.testHooks?.afterMutation?.("task", database));
		return { claimed };
	}, params.databaseOptions, { operationLabel: "subagent completion delivery admission" });
}
/** Atomically consumes a correlated queue settlement into registry and task projections. */
function settleSubagentCompletionDelivery(params) {
	const boundTask = bindTaskRecord(params.task);
	runOpenClawStateWriteTransaction((database) => {
		invokeSynchronousHook(() => params.mutateSubagent?.(params.subagent));
		upsertSubagentRunRowInDatabase(database, bindSubagentRunRecord(params.subagent));
		upsertTaskRunRowInDatabase(database, boundTask);
	}, params.databaseOptions, { operationLabel: "subagent completion delivery settlement" });
}
//#endregion
//#region src/agents/subagents/completion/subagent-completion-delivery.ts
const CLAIM_LEASE_MS = 125e3;
const SUSPENDED_RETENTION_MS = 10080 * 6e4;
const MAX_DELIVERY_GENERATION = 10;
const CANONICAL_RESULT_PROMPT = "A completed subagent task is ready for parent review. The canonical result follows.";
function resolveTask(entry) {
	return findTaskByRunId(entry.taskRunId ?? entry.runId);
}
function findSubagentForTask(task) {
	for (const entry of subagentRuns.values()) if ((entry.taskRunId ?? entry.runId) === task.runId || task.childSessionKey && entry.childSessionKey === task.childSessionKey) return entry;
}
function publishCommittedRecords(subagent, task) {
	const live = subagentRuns.get(subagent.runId);
	if (live) {
		for (const key of Object.keys(live)) Reflect.deleteProperty(live, key);
		Object.assign(live, subagent);
	} else subagentRuns.set(subagent.runId, subagent);
	publishTaskRecordAfterAtomicStore(task);
}
function projectRedrivenTask(task, subagent, deliveryStatus, now) {
	return {
		...task,
		status: "succeeded",
		deliveryStatus,
		terminalOutcome: "succeeded",
		lastEventAt: now,
		progressSummary: resolveSubagentCompletionResultText(subagent) ?? task.progressSummary,
		error: void 0,
		terminalSummary: void 0,
		cleanupAfter: void 0
	};
}
/** Atomically admits a queue generation and publishes process mirrors only after commit. */
function admitCorrelatedSubagentSessionDelivery(params) {
	const current = subagentRuns.get(params.runId);
	if (!current) throw new Error(`subagent completion owner not found: ${params.runId}`);
	const task = resolveTask(current);
	if (!task || task.runtime !== "subagent") throw new Error(`subagent completion task not found: ${params.runId}`);
	const now = Date.now();
	const subagent = structuredClone(current);
	const delivery = ensureDeliveryState(subagent);
	const generation = delivery.generation ?? 1;
	const windowStartedAt = delivery.windowStartedAt ?? subagent.execution.endedAt ?? now;
	const deadlineAt = delivery.deadlineAt ?? windowStartedAt + 18e5;
	const generationSuffix = generation > 1 ? `:generation:${generation}` : "";
	const queueEntry = prepareClaimedSessionDelivery({
		...params.payload,
		idempotencyKey: `${params.payload.idempotencyKey ?? params.payload.messageId}${generationSuffix}`,
		messageId: `${params.payload.messageId}${generationSuffix}`,
		message: CANONICAL_RESULT_PROMPT,
		maxRetries: Number.MAX_SAFE_INTEGER,
		owner: {
			kind: "subagent_completion",
			runId: subagent.runId,
			taskId: task.taskId,
			generation,
			deadlineAt
		}
	}, CLAIM_LEASE_MS, now);
	Object.assign(delivery, {
		status: "in_progress",
		disposition: "session_queued",
		generation,
		queueId: queueEntry.id,
		windowStartedAt,
		deadlineAt,
		nextAttemptAt: queueEntry.availableAt,
		enqueuedAt: now
	});
	delivery.payload ??= loadPendingFinalDeliveryPayload(subagent);
	const projectedTask = projectRedrivenTask(task, subagent, "session_queued", now);
	const admission = admitSubagentCompletionDelivery({
		queueEntry,
		subagent,
		task: projectedTask
	});
	publishCommittedRecords(subagent, projectedTask);
	const status = getDeliveryQueueEntryStatus(SESSION_DELIVERY_QUEUE_NAME, queueEntry.id);
	return {
		id: queueEntry.id,
		claimed: admission.claimed,
		status: status ?? "pending"
	};
}
function canonicalResultMessage(entry) {
	const result = resolveSubagentCompletionResultText(entry) ?? "(no output)";
	return `${CANONICAL_RESULT_PROMPT}\n\n${result}`;
}
/** Resolves queue content from the canonical retained result at attempt time. */
function resolveCorrelatedSubagentDelivery(queued) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return queued;
	if (Date.now() >= queued.owner.deadlineAt) throw new SessionDeliveryDeadLetteredError("correlated subagent completion delivery deadline expired");
	const entry = subagentRuns.get(queued.owner.runId);
	if (!entry || entry.delivery?.queueId !== queued.id || entry.delivery.generation !== queued.owner.generation || entry.delivery.deadlineAt !== queued.owner.deadlineAt) throw new SessionDeliveryDeferredError("correlated subagent delivery owner mismatch");
	return {
		...queued,
		message: canonicalResultMessage(entry)
	};
}
/** Consumes durable queue settlement without allowing a stale generation to mutate its owner. */
async function settleCorrelatedSubagentDelivery(queued, outcome) {
	if (queued.kind !== "agentTurn" || queued.owner?.kind !== "subagent_completion") return;
	const current = subagentRuns.get(queued.owner.runId);
	const task = getTaskById(queued.owner.taskId);
	if (!current || !task || current.delivery?.queueId !== queued.id || current.delivery.generation !== queued.owner.generation) return;
	const now = Date.now();
	const subagent = structuredClone(current);
	const delivery = ensureDeliveryState(subagent);
	const projectedTask = { ...task };
	if (outcome === "recovered") {
		Object.assign(delivery, {
			status: "delivered",
			disposition: "delivered",
			deliveredAt: now,
			announcedAt: now,
			lastError: void 0,
			nextAttemptAt: void 0,
			queueId: void 0
		});
		delivery.payload = void 0;
		projectedTask.deliveryStatus = "delivered";
		projectedTask.terminalOutcome = "succeeded";
		projectedTask.error = void 0;
	} else {
		Object.assign(delivery, {
			status: "suspended",
			disposition: "permanent_failure",
			suspendedAt: now,
			suspendedReason: "permanent_failure",
			lastError: queued.lastError ?? "completion delivery failed",
			nextAttemptAt: void 0,
			queueId: void 0
		});
		projectedTask.deliveryStatus = "failed";
		projectedTask.terminalOutcome = "blocked";
		projectedTask.error = delivery.lastError ?? void 0;
		projectedTask.terminalSummary = "Task completed, but result delivery is blocked.";
		projectedTask.cleanupAfter = now + SUSPENDED_RETENTION_MS;
	}
	projectedTask.progressSummary = resolveSubagentCompletionResultText(subagent) ?? projectedTask.progressSummary;
	projectedTask.lastEventAt = now;
	settleSubagentCompletionDelivery({
		subagent,
		task: projectedTask
	});
	publishCommittedRecords(subagent, projectedTask);
	if (outcome === "recovered") {
		const { resumeSubagentRun } = await import("./subagent-registry-XilIqabO.js");
		resumeSubagentRun(subagent.runId);
	}
}
async function retrySubagentCompletionDelivery(taskId, databaseOptions) {
	const task = getTaskById(taskId);
	const current = task ? findSubagentForTask(task) : void 0;
	if (!task || !current || current.expectsCompletionMessage !== true) return {
		ok: false,
		reason: "task has no recoverable subagent completion"
	};
	const delivery = ensureDeliveryState(current);
	if (delivery.status === "in_progress" && delivery.queueId) {
		await releaseSessionDeliveryClaim(delivery.queueId);
		await scheduleSessionDelivery(delivery.queueId);
		return {
			ok: true,
			task: getTaskById(taskId)
		};
	}
	if (delivery.status !== "suspended") return {
		ok: false,
		reason: "completion delivery is not blocked"
	};
	const generation = (delivery.generation ?? 1) + 1;
	if (generation > MAX_DELIVERY_GENERATION) return {
		ok: false,
		reason: "completion delivery redrive limit reached"
	};
	const now = Date.now();
	const redrive = structuredClone(current);
	Object.assign(ensureDeliveryState(redrive), {
		status: "pending",
		disposition: "retryable",
		generation,
		queueId: void 0,
		windowStartedAt: now,
		deadlineAt: now + ANNOUNCE_COMPLETION_HARD_EXPIRY_MS,
		suspendedAt: void 0,
		suspendedReason: void 0,
		attemptCount: 0,
		lastError: void 0,
		nextAttemptAt: void 0
	});
	redrive.cleanupHandled = false;
	const projectedTask = projectRedrivenTask(task, redrive, "pending", now);
	settleSubagentCompletionDelivery({
		subagent: redrive,
		task: projectedTask,
		databaseOptions
	});
	publishCommittedRecords(redrive, projectedTask);
	const { resumeSubagentRun } = await import("./subagent-registry-XilIqabO.js");
	resumeSubagentRun(redrive.runId);
	return {
		ok: true,
		task: getTaskById(taskId),
		duplicateRisk: true
	};
}
async function dismissSubagentCompletionDelivery(taskId, options) {
	const task = getTaskById(taskId);
	const current = task ? findSubagentForTask(task) : void 0;
	if (!task || !current || current.delivery?.status !== "suspended") return {
		ok: false,
		reason: "completion delivery is not blocked"
	};
	const now = Date.now();
	const subagent = structuredClone(current);
	const projectedTask = {
		...task,
		deliveryStatus: "dismissed",
		terminalOutcome: "blocked",
		terminalSummary: "Task completed; result delivery was dismissed by the operator.",
		progressSummary: resolveSubagentCompletionResultText(subagent) ?? task.progressSummary,
		cleanupAfter: Math.max(task.cleanupAfter ?? 0, now + SUSPENDED_RETENTION_MS),
		lastEventAt: now
	};
	settleSubagentCompletionDelivery({
		subagent,
		task: projectedTask,
		databaseOptions: options.databaseOptions,
		mutateSubagent: (entry) => options.discardTerminalDelivery(entry, now)
	});
	publishCommittedRecords(subagent, projectedTask);
	if (subagent.cleanup === "delete" || !subagent.retainAttachmentsOnKeep) await safeRemoveAttachmentsDir(subagent);
	return {
		ok: true,
		task: getTaskById(taskId)
	};
}
//#endregion
export { settleCorrelatedSubagentDelivery as a, startSessionDeliveryRuntime as c, retrySubagentCompletionDelivery as i, drainPendingSessionDelivery as l, dismissSubagentCompletionDelivery as n, schedulePendingSessionDeliveries as o, resolveCorrelatedSubagentDelivery as r, scheduleSessionDelivery as s, admitCorrelatedSubagentSessionDelivery as t, recoverPendingSessionDeliveries as u };
