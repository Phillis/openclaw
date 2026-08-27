import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { G as findLatestTaskFlowForOwnerKey, H as deleteTaskFlowRecordById, L as isParentFlowLinkError, N as isProvisionalSubagentKillTask, O as listTasksForFlowId, P as isTaskFlowCancellationPending, Q as requestFlowCancel, V as createTaskFlowForTask, X as listTaskFlowsForOwnerKey, a as linkTaskToFlowById, b as findTaskByRunId$1, c as markTaskTerminalById, d as setTaskRunDeliveryStatusByRunId, i as finalizeTaskRecordByRunId, l as recordTaskProgressByRunId, nt as updateFlowRecordByIdExpectedRevision, q as getTaskFlowById, r as createTaskRecord, s as markTaskRunningByRunId, x as getTaskById } from "./task-registry-DkfAoDv0.js";
import "./runtime-internal-CEnngiYh.js";
import { n as summarizeTaskRecords } from "./task-registry.summary-BwpoHlXv.js";
//#region src/tasks/task-flow-owner-access.ts
/** Reads a flow only when it belongs to the caller owner key. */
function getTaskFlowByIdForOwner(params) {
	const flow = getTaskFlowById(params.flowId);
	return flow && normalizeOptionalString(flow.ownerKey) === normalizeOptionalString(params.callerOwnerKey) ? flow : void 0;
}
function listTaskFlowsForOwner(params) {
	const ownerKey = normalizeOptionalString(params.callerOwnerKey);
	return ownerKey ? listTaskFlowsForOwnerKey(ownerKey) : [];
}
function findLatestTaskFlowForOwner(params) {
	const ownerKey = normalizeOptionalString(params.callerOwnerKey);
	return ownerKey ? findLatestTaskFlowForOwnerKey(ownerKey) : void 0;
}
function resolveTaskFlowForLookupTokenForOwner(params) {
	const direct = getTaskFlowByIdForOwner({
		flowId: params.token,
		callerOwnerKey: params.callerOwnerKey
	});
	if (direct) return direct;
	const normalizedToken = normalizeOptionalString(params.token);
	const normalizedCallerOwnerKey = normalizeOptionalString(params.callerOwnerKey);
	if (!normalizedToken || normalizedToken !== normalizedCallerOwnerKey) return;
	return findLatestTaskFlowForOwner({ callerOwnerKey: normalizedCallerOwnerKey });
}
//#endregion
//#region src/tasks/task-executor.ts
const log = createSubsystemLogger("tasks/executor");
function isOneTaskFlowEligible(task) {
	if (task.parentFlowId?.trim() || task.scopeKind !== "session") return false;
	if (task.deliveryStatus === "not_applicable") return false;
	return task.runtime === "acp" || task.runtime === "subagent";
}
function ensureSingleTaskFlow(params) {
	if (!isOneTaskFlowEligible(params.task)) return params.task;
	try {
		const flow = createTaskFlowForTask({
			task: params.task,
			requesterOrigin: params.requesterOrigin
		});
		if (!flow) return params.task;
		const linked = linkTaskToFlowById({
			taskId: params.task.taskId,
			flowId: flow.flowId
		});
		if (!linked) {
			deleteTaskFlowRecordById(flow.flowId);
			return params.task;
		}
		if (linked.parentFlowId !== flow.flowId) {
			deleteTaskFlowRecordById(flow.flowId);
			return linked;
		}
		return linked;
	} catch (error) {
		log.warn("Failed to create one-task flow for detached run", {
			taskId: params.task.taskId,
			runId: params.task.runId,
			error
		});
		return params.task;
	}
}
function createQueuedTaskRunCore(params) {
	const task = createTaskRecord({
		...params,
		status: "queued"
	});
	if (!task) return null;
	return ensureSingleTaskFlow({
		task,
		requesterOrigin: params.requesterOrigin
	});
}
function getFlowTaskSummary(flowId) {
	return summarizeTaskRecords(listTasksForFlowId(flowId));
}
function createRunningTaskRunCore(params) {
	const task = createTaskRecord({
		...params,
		status: "running"
	});
	if (!task) return null;
	return ensureSingleTaskFlow({
		task,
		requesterOrigin: params.requesterOrigin
	});
}
function findTaskByRunId(runId) {
	return findTaskByRunId$1(runId);
}
function startTaskRunByRunIdCore(params) {
	return markTaskRunningByRunId(params);
}
function recordTaskRunProgressByRunIdCore(params) {
	return recordTaskProgressByRunId(params);
}
function completeTaskRunByRunIdCore(params) {
	return finalizeTaskRunByRunIdCore({
		...params,
		status: "succeeded"
	});
}
function finalizeTaskRunByRunIdCore(params) {
	return finalizeTaskRecordByRunId(params);
}
function finalizeTaskRunById(params) {
	return markTaskTerminalById(params);
}
function failTaskRunByRunIdCore(params) {
	return finalizeTaskRunByRunIdCore({
		...params,
		status: params.status ?? "failed"
	});
}
function setDetachedTaskDeliveryStatusByRunIdCore(params) {
	return setTaskRunDeliveryStatusByRunId(params);
}
function isTerminalFlowStatus(status) {
	return status === "succeeded" || status === "failed" || status === "cancelled" || status === "lost";
}
function markFlowCancelRequested(flow) {
	if (flow.cancelRequestedAt != null) return flow;
	const result = requestFlowCancel({
		flowId: flow.flowId,
		expectedRevision: flow.revision
	});
	if (result.applied) return result.flow;
	return {
		reason: describeFlowUpdateFailure(result.reason),
		flow: result.current ?? getTaskFlowById(flow.flowId)
	};
}
function describeFlowUpdateFailure(reason) {
	switch (reason) {
		case "revision_conflict": return "Flow changed while cancellation was in progress.";
		case "persist_failed": return "Flow persistence failed.";
		case "not_found": return "Flow not found.";
		default: return "Flow mutation failed.";
	}
}
function cancelManagedFlowAfterChildrenSettle(flow, endedAt) {
	const result = updateFlowRecordByIdExpectedRevision({
		flowId: flow.flowId,
		expectedRevision: flow.revision,
		patch: {
			status: "cancelled",
			blockedTaskId: null,
			blockedSummary: null,
			waitJson: null,
			endedAt,
			updatedAt: endedAt
		}
	});
	if (result.applied) return result.flow;
	return {
		reason: describeFlowUpdateFailure(result.reason),
		flow: result.current ?? getTaskFlowById(flow.flowId)
	};
}
function mapRunTaskInFlowCreateError(params) {
	const flow = getTaskFlowById(params.flowId);
	if (isParentFlowLinkError(params.error)) {
		if (params.error.code === "cancel_requested") return {
			found: true,
			created: false,
			reason: "Flow cancellation has already been requested.",
			...flow ? { flow } : {}
		};
		if (params.error.code === "terminal") return {
			found: true,
			created: false,
			reason: `Flow is already ${flow?.status ?? params.error.details?.status ?? "terminal"}.`,
			...flow ? { flow } : {}
		};
		if (params.error.code === "parent_flow_not_found") return {
			found: false,
			created: false,
			reason: "Flow not found."
		};
	}
	throw params.error;
}
function runTaskInFlow(params) {
	const flow = getTaskFlowById(params.flowId);
	if (!flow) return {
		found: false,
		created: false,
		reason: "Flow not found."
	};
	if (flow.syncMode !== "managed") return {
		found: true,
		created: false,
		reason: "Flow does not accept managed child tasks.",
		flow
	};
	if (flow.cancelRequestedAt != null) return {
		found: true,
		created: false,
		reason: "Flow cancellation has already been requested.",
		flow
	};
	if (isTerminalFlowStatus(flow.status)) return {
		found: true,
		created: false,
		reason: `Flow is already ${flow.status}.`,
		flow
	};
	const common = {
		runtime: params.runtime,
		sourceId: params.sourceId,
		ownerKey: flow.ownerKey,
		scopeKind: "session",
		requesterOrigin: flow.requesterOrigin,
		parentFlowId: flow.flowId,
		childSessionKey: params.childSessionKey,
		parentTaskId: params.parentTaskId,
		agentId: params.agentId,
		runId: params.runId,
		label: params.label,
		task: params.task,
		preferMetadata: params.preferMetadata,
		notifyPolicy: params.notifyPolicy,
		deliveryStatus: params.deliveryStatus ?? "pending"
	};
	let task;
	try {
		task = params.status === "running" ? createRunningTaskRunCore({
			...common,
			startedAt: params.startedAt,
			lastEventAt: params.lastEventAt,
			progressSummary: params.progressSummary
		}) : createQueuedTaskRunCore(common);
	} catch (error) {
		return mapRunTaskInFlowCreateError({
			error,
			flowId: flow.flowId
		});
	}
	if (!task) return {
		found: true,
		created: false,
		reason: "Task persistence failed.",
		flow: getTaskFlowById(flow.flowId) ?? flow
	};
	const registeredTask = getTaskById(task.taskId);
	if (!registeredTask) return {
		found: true,
		created: false,
		reason: "Task persistence failed.",
		flow: getTaskFlowById(flow.flowId) ?? flow
	};
	return {
		found: true,
		created: true,
		flow: getTaskFlowById(flow.flowId) ?? flow,
		task: registeredTask
	};
}
function runTaskInFlowForOwner(params) {
	const flow = getTaskFlowByIdForOwner({
		flowId: params.flowId,
		callerOwnerKey: params.callerOwnerKey
	});
	if (!flow) return {
		found: false,
		created: false,
		reason: "Flow not found."
	};
	return runTaskInFlow({
		flowId: flow.flowId,
		runtime: params.runtime,
		sourceId: params.sourceId,
		childSessionKey: params.childSessionKey,
		parentTaskId: params.parentTaskId,
		agentId: params.agentId,
		runId: params.runId,
		label: params.label,
		task: params.task,
		preferMetadata: params.preferMetadata,
		notifyPolicy: params.notifyPolicy,
		deliveryStatus: params.deliveryStatus,
		status: params.status,
		startedAt: params.startedAt,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary
	});
}
async function cancelFlowById(params) {
	const flow = getTaskFlowById(params.flowId);
	if (!flow) return {
		found: false,
		cancelled: false,
		reason: "Flow not found."
	};
	if (isTerminalFlowStatus(flow.status)) {
		const provisionalTasks = listTasksForFlowId(flow.flowId).filter(isProvisionalSubagentKillTask);
		if (flow.status === "cancelled" && provisionalTasks.length > 0) {
			for (const task of provisionalTasks) await cancelDetachedTaskRunById({
				cfg: params.cfg,
				taskId: task.taskId
			});
			const tasks = listTasksForFlowId(flow.flowId);
			if (tasks.some(isProvisionalSubagentKillTask)) return {
				found: true,
				cancelled: false,
				reason: "One or more child tasks remain provisionally cancelled.",
				flow: getTaskFlowById(flow.flowId) ?? flow,
				tasks
			};
			const refreshedFlow = getTaskFlowById(flow.flowId) ?? flow;
			return {
				found: true,
				cancelled: refreshedFlow.status === "cancelled",
				reason: refreshedFlow.status === "cancelled" ? void 0 : `Flow is already ${refreshedFlow.status}.`,
				flow: refreshedFlow,
				tasks
			};
		}
		return {
			found: true,
			cancelled: false,
			reason: `Flow is already ${flow.status}.`,
			flow,
			tasks: listTasksForFlowId(flow.flowId)
		};
	}
	const cancelRequestedFlow = markFlowCancelRequested(flow);
	if ("reason" in cancelRequestedFlow) return {
		found: true,
		cancelled: false,
		reason: cancelRequestedFlow.reason,
		flow: cancelRequestedFlow.flow,
		tasks: listTasksForFlowId(flow.flowId)
	};
	const activeTasks = listTasksForFlowId(flow.flowId).filter(isTaskFlowCancellationPending);
	for (const task of activeTasks) await cancelDetachedTaskRunById({
		cfg: params.cfg,
		taskId: task.taskId
	});
	const refreshedTasks = listTasksForFlowId(flow.flowId);
	if (refreshedTasks.filter(isTaskFlowCancellationPending).length > 0) return {
		found: true,
		cancelled: false,
		reason: "One or more child tasks are still active.",
		flow: getTaskFlowById(flow.flowId) ?? cancelRequestedFlow,
		tasks: refreshedTasks
	};
	const now = Date.now();
	const refreshedFlow = getTaskFlowById(flow.flowId) ?? cancelRequestedFlow;
	if (isTerminalFlowStatus(refreshedFlow.status)) return {
		found: true,
		cancelled: refreshedFlow.status === "cancelled",
		reason: refreshedFlow.status === "cancelled" ? void 0 : `Flow is already ${refreshedFlow.status}.`,
		flow: refreshedFlow,
		tasks: refreshedTasks
	};
	const updatedFlow = cancelManagedFlowAfterChildrenSettle(refreshedFlow, now);
	if ("reason" in updatedFlow) return {
		found: true,
		cancelled: false,
		reason: updatedFlow.reason,
		flow: updatedFlow.flow,
		tasks: refreshedTasks
	};
	return {
		found: true,
		cancelled: true,
		flow: updatedFlow,
		tasks: refreshedTasks
	};
}
async function cancelFlowByIdForOwner(params) {
	const flow = getTaskFlowByIdForOwner({
		flowId: params.flowId,
		callerOwnerKey: params.callerOwnerKey
	});
	if (!flow) return {
		found: false,
		cancelled: false,
		reason: "Flow not found."
	};
	return cancelFlowById({
		cfg: params.cfg,
		flowId: flow.flowId
	});
}
async function cancelDetachedTaskRunById(params) {
	return (await import("./task-executor-cancel.runtime.js")).cancelDetachedTaskRunByIdCore(params);
}
//#endregion
export { getTaskFlowByIdForOwner as _, createQueuedTaskRunCore as a, finalizeTaskRunById as c, getFlowTaskSummary as d, recordTaskRunProgressByRunIdCore as f, findLatestTaskFlowForOwner as g, startTaskRunByRunIdCore as h, completeTaskRunByRunIdCore as i, finalizeTaskRunByRunIdCore as l, setDetachedTaskDeliveryStatusByRunIdCore as m, cancelFlowById as n, createRunningTaskRunCore as o, runTaskInFlowForOwner as p, cancelFlowByIdForOwner as r, failTaskRunByRunIdCore as s, cancelDetachedTaskRunById as t, findTaskByRunId as u, listTaskFlowsForOwner as v, resolveTaskFlowForLookupTokenForOwner as y };
