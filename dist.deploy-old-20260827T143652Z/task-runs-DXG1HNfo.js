import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { Bt as cronRunStatusToTaskStatus, Ht as cronTaskRecordToRunLogEntry, Jt as resolveCronTaskRecordTimestamp, Rt as cronQuietTriggerTaskDetail, Ut as cronTaskRecordToScriptRunResult, Vt as cronTaskRecordStoreKey, Wt as cronTaskRecordToTriggerEval, zt as cronRunLogEntryToTaskDetail } from "./openclaw-state-db-DlCMR4eQ.js";
import { J as cronStoreKey } from "./row-codec-BXU8Ei5n.js";
import { f as resolveFailoverReasonFromError } from "./failover-error-EKvoWJQa.js";
import "./task-registry-DrR4kwK-.js";
import { o as listTaskRecordsByRuntimeSourceIdInDatabase } from "./task-registry.store.sqlite-DF7-e6ST.js";
import { c as finalizeTaskRunById, f as recordTaskRunProgressByRunIdCore, l as finalizeTaskRunByRunIdCore, o as createRunningTaskRunCore, u as findTaskByRunId } from "./task-executor-C_bCFvCs.js";
import { i as normalizeCronRunErrorText } from "./execution-errors-CEAOqO7v.js";
import { n as resolveCronJobEffectiveAgentId, t as CRON_AGENT_SELECTION_REQUIRED_MESSAGE } from "./agent-id-C6YEx4KT.js";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.js";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/cron/run-error-reason.ts
/** Resolve one cron-owned classification before falling back to provider error inference. */
function resolveCronRunErrorReason(error, provider, classification) {
	if (classification?.kind === "permanent") return;
	if (classification?.kind === "reason") return classification.reason;
	return resolveFailoverReasonFromError(error, provider) ?? void 0;
}
//#endregion
//#region src/cron/task-run-event-codec.ts
/** Write-side cron codec: converts a finished service event into a run-history entry.
* Kept separate from task-run-detail.ts so the read/history codec stays free of the
* agents failover tree (which transitively pulls the sandbox module graph). */
/** Uses execution timing for one timestamp shared by ledger and legacy dual-write paths. */
function resolveCronRunEndedAt(event, fallbackTs) {
	if (typeof event.runAtMs === "number" && Number.isFinite(event.runAtMs) && typeof event.durationMs === "number" && Number.isFinite(event.durationMs)) return event.runAtMs + event.durationMs;
	return fallbackTs;
}
/** Builds the legacy run-history record from one finished service event. */
function cronRunLogEntryFromEvent(event, fallbackTs, errorClassification) {
	const errorReason = resolveCronRunErrorReason(event.error, event.provider, errorClassification);
	return {
		ts: resolveCronRunEndedAt(event, fallbackTs),
		jobId: event.jobId,
		action: "finished",
		status: event.status,
		error: event.error,
		errorReason,
		summary: event.summary,
		diagnostics: event.diagnostics,
		delivered: event.delivered,
		deliveryStatus: event.deliveryStatus,
		deliveryError: event.deliveryError,
		failureNotificationDelivery: event.failureNotificationDelivery,
		delivery: event.delivery,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		runId: event.runId,
		runAtMs: event.runAtMs,
		durationMs: event.durationMs,
		nextRunAtMs: event.nextRunAtMs,
		triggerFired: event.triggerFired,
		model: event.model,
		provider: event.provider,
		usage: event.usage
	};
}
//#endregion
//#region src/cron/service/task-runs.ts
/** Detached task-ledger integration for cron runs. */
function requireCronAgentId(agentId) {
	if (!agentId?.trim()) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return normalizeAgentId(agentId);
}
function resolveCurrentDefaultAgentId(state) {
	return state.deps.resolveDefaultAgentId?.() ?? state.deps.defaultAgentId;
}
const activeCronTaskRunId = new AsyncLocalStorage();
/** Keeps the detached task id on the async execution that owns it. */
function withCronTaskRunId(taskRunId, run) {
	const normalizedRunId = taskRunId?.trim();
	return normalizedRunId ? activeCronTaskRunId.run(normalizedRunId, run) : run();
}
function getActiveCronTaskRunId() {
	return activeCronTaskRunId.getStore();
}
/** Converts cron ids into bounded session-key path segments with a fallback for empty input. */
function normalizeCronLaneSegment(value, fallback) {
	return normalizeOptionalLowercaseString(value)?.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || fallback;
}
/** Builds the main-session child key used to isolate one cron run's task transcript. */
function resolveMainSessionCronRunSessionKey(job, startedAt, configuredDefaultAgentId) {
	return `agent:${resolveCronJobEffectiveAgentId(job, configuredDefaultAgentId)}:cron:${normalizeCronLaneSegment(job.id, "job")}:run:${normalizeCronLaneSegment(String(Math.max(0, Math.floor(startedAt))), "run")}`;
}
function resolveCronTaskChildSessionKey(params) {
	if (params.job.sessionTarget === "main" && params.job.payload.kind === "systemEvent") return resolveMainSessionCronRunSessionKey(params.job, params.startedAt, resolveCurrentDefaultAgentId(params.state));
}
/** Updates an active cron task with the exact transcript identity reported by its runner. */
function tryUpdateCronTaskRunSession(state, taskRunId, sessionKey) {
	const childSessionKey = sessionKey?.trim();
	if (!taskRunId || !childSessionKey) return;
	try {
		if (recordTaskRunProgressByRunIdCore({
			runId: taskRunId,
			runtime: "cron",
			childSessionKey
		}).length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger session was not updated");
	} catch (error) {
		state.deps.log.warn({
			runId: taskRunId,
			error
		}, "cron: failed to update task ledger session");
	}
}
/** Creates a best-effort detached task row keyed to the persisted execution start. */
function tryCreateCronTaskRun(params) {
	const runId = createCronTaskRunId(params.job.id, params.startedAt, params.publicRunId);
	return tryCreateCronTaskRunRecord({
		state: params.state,
		job: params.job,
		jobId: params.job.id,
		startedAt: params.startedAt,
		runId
	});
}
function createCronTaskRunId(jobId, startedAt, publicRunId) {
	const discriminator = publicRunId?.trim() || randomUUID();
	return `${createCronExecutionId(jobId, startedAt)}:${discriminator}`;
}
function findLatestCronTaskRunForRecoveryFromRecords(records, jobId, startedAt, storeKey) {
	const executionRunId = createCronExecutionId(jobId, startedAt);
	const prefix = `${executionRunId}:`;
	return records.filter((task) => {
		if (task.runtime !== "cron" || task.sourceId !== jobId) return false;
		const taskStoreKey = cronTaskRecordStoreKey(task);
		if (taskStoreKey === void 0) return task.runId === executionRunId;
		return taskStoreKey === storeKey && (task.runId === executionRunId || task.runId?.startsWith(prefix) || task.startedAt === startedAt);
	}).toSorted((left, right) => Number(left.endedAt !== void 0) - Number(right.endedAt !== void 0) || resolveCronTaskRecordTimestamp(right) - resolveCronTaskRecordTimestamp(left) || right.createdAt - left.createdAt || right.taskId.localeCompare(left.taskId))[0];
}
function finalizedCronTaskRun(task, jobId) {
	if (task?.runtime !== "cron" || task.sourceId !== jobId || task.endedAt === void 0) return;
	const triggerEval = cronTaskRecordToTriggerEval(task);
	const entry = cronTaskRecordToRunLogEntry(task) ?? (task.status === "succeeded" && triggerEval?.fired === false ? {
		ts: task.endedAt,
		jobId,
		action: "finished",
		status: "ok",
		...task.startedAt === void 0 ? {} : {
			runAtMs: task.startedAt,
			durationMs: Math.max(0, task.endedAt - task.startedAt)
		}
	} : void 0);
	if (!entry?.status) return;
	const scriptResult = cronTaskRecordToScriptRunResult(task);
	return {
		entry: {
			...entry,
			status: entry.status
		},
		...scriptResult ? { scriptResult } : {},
		...triggerEval ? { triggerEval } : {}
	};
}
/** Re-reads task recovery facts on the caller's exact SQLite transaction. */
function findCronTaskRunRecoveryInDatabase(params) {
	const task = findLatestCronTaskRunForRecoveryFromRecords(listTaskRecordsByRuntimeSourceIdInDatabase(params.database, "cron", params.jobId), params.jobId, params.startedAt, params.storeKey);
	const finalized = finalizedCronTaskRun(task, params.jobId);
	return {
		...task?.runId ? { taskRunId: task.runId } : {},
		...finalized ? { finalized } : {}
	};
}
function tryCreateCronTaskRunRecord(params) {
	try {
		const explicitJobAgentId = params.job?.agentId?.trim();
		const childSessionKey = params.childSessionKey ?? (params.job ? resolveCronTaskChildSessionKey({
			state: params.state,
			job: params.job,
			startedAt: params.startedAt
		}) : void 0);
		const effectiveJobAgentId = params.job ? resolveCronJobEffectiveAgentId(params.job, resolveCurrentDefaultAgentId(params.state)) : void 0;
		if (!createRunningTaskRunCore({
			runtime: "cron",
			taskKind: "automation_run",
			sourceId: params.jobId,
			ownerKey: "",
			scopeKind: "system",
			childSessionKey,
			agentId: effectiveJobAgentId ?? (explicitJobAgentId ? normalizeAgentId(explicitJobAgentId) : void 0) ?? (childSessionKey ? resolveAgentIdFromSessionKey(childSessionKey, resolveCurrentDefaultAgentId(params.state)) : requireCronAgentId(resolveCurrentDefaultAgentId(params.state))),
			runId: params.runId,
			label: params.job?.name,
			task: params.job?.name || params.jobId,
			deliveryStatus: "not_applicable",
			notifyPolicy: "silent",
			startedAt: params.startedAt,
			lastEventAt: params.startedAt,
			progressSummary: "Running automation.",
			detail: { storeKey: cronStoreKey(params.state.deps.storePath) }
		})) {
			params.state.deps.log.warn({ jobId: params.jobId }, "cron: task ledger record was not persisted");
			return;
		}
		return params.runId;
	} catch (error) {
		params.state.deps.log.warn({
			jobId: params.jobId,
			error
		}, "cron: failed to create task ledger record");
		return;
	}
}
/** Finalizes executions that intentionally do not produce a run-history row. */
function tryFinishCronTaskRunWithoutHistory(state, result) {
	if (!result.taskRunId) return;
	const error = result.status !== "ok" && result.error !== void 0 ? normalizeCronRunErrorText(result.error) : void 0;
	const quietTriggerEval = result.triggerEval?.fired === false ? {
		...result.triggerEval,
		fired: false
	} : void 0;
	try {
		finalizeTaskRunByRunIdCore({
			runId: result.taskRunId,
			runtime: "cron",
			status: cronRunStatusToTaskStatus({
				status: result.status,
				error
			}),
			endedAt: result.endedAt,
			lastEventAt: result.endedAt,
			error,
			terminalSummary: result.summary,
			childSessionKey: result.childSessionKey ?? result.sessionKey ?? null,
			...quietTriggerEval ? { detail: cronQuietTriggerTaskDetail(cronStoreKey(state.deps.storePath), quietTriggerEval) } : {}
		});
	} catch (cause) {
		state.deps.log.warn({
			runId: result.taskRunId,
			jobStatus: result.status,
			error: cause
		}, "cron: failed to update task ledger record");
	}
}
/** Finalizes the authoritative task row, creating one for terminal-only cron events. */
function tryFinishCronTaskRun(state, result) {
	const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs(), result.errorClassification);
	const startedAt = entry.runAtMs ?? entry.ts;
	const candidateRunId = result.taskRunId ?? createCronTaskRunId(entry.jobId, startedAt, entry.runId);
	try {
		const taskRunId = findTaskByRunId(candidateRunId)?.runtime === "cron" ? candidateRunId : tryCreateCronTaskRunRecord({
			state,
			job: result.job ?? result.event.job,
			jobId: entry.jobId,
			startedAt,
			runId: candidateRunId,
			childSessionKey: entry.sessionKey
		});
		if (!taskRunId) return;
		const storeKey = cronStoreKey(state.deps.storePath);
		const legacyRecoveryRunId = createCronExecutionId(entry.jobId, startedAt);
		const detail = cronRunLogEntryToTaskDetail(entry, {
			storeKey,
			...result.scriptResult ? { scriptResult: result.scriptResult } : {},
			...result.triggerEval ? { triggerEval: result.triggerEval } : {}
		});
		const finalize = (runId, status = cronRunStatusToTaskStatus(entry)) => finalizeTaskRunByRunIdCore({
			runId,
			runtime: "cron",
			status,
			endedAt: entry.ts,
			lastEventAt: entry.ts,
			error: entry.error,
			clearError: entry.error === void 0,
			terminalSummary: entry.summary ?? null,
			preserveTerminalSummary: true,
			childSessionKey: entry.sessionKey ?? null,
			detail
		});
		let updated = finalize(taskRunId);
		if (updated.length === 0) {
			const existing = findTaskByRunId(taskRunId);
			if (existing?.runtime === "cron" && existing.status === "cancelled") updated = finalize(taskRunId, "cancelled");
			else if (existing?.runtime === "cron" && (existing.status === "lost" || cronTaskRecordStoreKey(existing) === storeKey && cronTaskRecordToRunLogEntry(existing) === null || existing.detail === void 0 && existing.runId === legacyRecoveryRunId)) {
				const recovered = finalizeTaskRunById({
					taskId: existing.taskId,
					status: cronRunStatusToTaskStatus(entry),
					childSessionKey: entry.sessionKey ?? null,
					endedAt: entry.ts,
					lastEventAt: entry.ts,
					error: entry.error,
					terminalSummary: entry.summary ?? null,
					preserveTerminalSummary: true,
					detail
				});
				updated = recovered ? [recovered] : [];
			} else if (existing?.runtime === "cron") updated = finalize(taskRunId);
			else {
				const recreatedRunId = tryCreateCronTaskRunRecord({
					state,
					job: result.job ?? result.event.job,
					jobId: entry.jobId,
					startedAt,
					runId: taskRunId,
					childSessionKey: entry.sessionKey
				});
				if (recreatedRunId) updated = finalize(recreatedRunId);
			}
		}
		if (updated.length === 0) state.deps.log.warn({ runId: taskRunId }, "cron: task ledger record was not finalized");
	} catch (error) {
		state.deps.log.warn({
			runId: candidateRunId,
			jobStatus: entry.status,
			error
		}, "cron: failed to update task ledger record");
	}
}
//#endregion
export { tryCreateCronTaskRun as a, tryUpdateCronTaskRunSession as c, resolveMainSessionCronRunSessionKey as i, withCronTaskRunId as l, getActiveCronTaskRunId as n, tryFinishCronTaskRun as o, normalizeCronLaneSegment as r, tryFinishCronTaskRunWithoutHistory as s, findCronTaskRunRecoveryInDatabase as t, resolveCronRunErrorReason as u };
