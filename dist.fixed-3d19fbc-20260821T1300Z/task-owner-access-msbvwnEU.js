import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import "./config-CfeGo4K4.js";
import { A as listTasksForRelatedSessionKey, M as resolveTaskForLookupToken, b as findTaskByRunId, c as markTaskTerminalById, f as updateTaskNotifyPolicyById, x as getTaskById } from "./task-registry-1cqXcWjA.js";
import { t as buildTaskStatusSnapshot } from "./task-status-DMWIN7O1.js";
//#region src/tasks/task-owner-access.ts
function canOwnerAccessTask(task, identity) {
	if (task.scopeKind !== "session" || normalizeOptionalString(task.ownerKey) !== normalizeOptionalString(identity.callerOwnerKey)) return false;
	const callerAgentId = normalizeOptionalString(identity.callerAgentId) ?? parseAgentSessionKey(identity.callerOwnerKey)?.agentId;
	if (!callerAgentId) return false;
	let taskAgentId = task.requesterAgentId ?? parseAgentSessionKey(task.ownerKey)?.agentId;
	if (!taskAgentId) try {
		taskAgentId = resolveSessionAgentId({
			sessionKey: task.ownerKey,
			config: identity.config ?? getRuntimeConfig()
		});
	} catch {
		return false;
	}
	return Boolean(taskAgentId) && normalizeOptionalString(taskAgentId) === normalizeOptionalString(callerAgentId);
}
function getTaskByIdForOwner(params) {
	const task = getTaskById(params.taskId);
	return task && canOwnerAccessTask(task, params) ? task : void 0;
}
function findTaskByRunIdForOwner(params) {
	const task = findTaskByRunId(params.runId);
	return task && canOwnerAccessTask(task, params) ? task : void 0;
}
/** Update an owner-visible task's notification policy. */
function updateTaskNotifyPolicyForOwner(params) {
	const task = getTaskByIdForOwner({
		taskId: params.taskId,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (!task) return null;
	return updateTaskNotifyPolicyById({
		taskId: task.taskId,
		notifyPolicy: params.notifyPolicy
	});
}
/** Mark an owner-visible task as cancelled with a caller-provided summary. */
function cancelTaskByIdForOwner(params) {
	const task = getTaskByIdForOwner({
		taskId: params.taskId,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (!task) return null;
	return markTaskTerminalById({
		taskId: task.taskId,
		status: "cancelled",
		endedAt: params.endedAt,
		terminalSummary: params.terminalSummary
	});
}
function listTasksForRelatedSessionKeyForOwner(params) {
	return listTasksForRelatedSessionKey(params.relatedSessionKey).filter((task) => canOwnerAccessTask(task, params));
}
function buildTaskStatusSnapshotForRelatedSessionKeyForOwner(params) {
	return buildTaskStatusSnapshot(listTasksForRelatedSessionKeyForOwner({
		relatedSessionKey: params.relatedSessionKey,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	}));
}
function findLatestTaskForRelatedSessionKeyForOwner(params) {
	return listTasksForRelatedSessionKeyForOwner(params)[0];
}
function resolveTaskForLookupTokenForOwner(params) {
	const direct = getTaskByIdForOwner({
		taskId: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (direct) return direct;
	const byRun = findTaskByRunIdForOwner({
		runId: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (byRun) return byRun;
	const related = findLatestTaskForRelatedSessionKeyForOwner({
		relatedSessionKey: params.token,
		callerOwnerKey: params.callerOwnerKey,
		callerAgentId: params.callerAgentId,
		config: params.config
	});
	if (related) return related;
	const raw = resolveTaskForLookupToken(params.token);
	return raw && canOwnerAccessTask(raw, params) ? raw : void 0;
}
//#endregion
export { getTaskByIdForOwner as a, updateTaskNotifyPolicyForOwner as c, findTaskByRunIdForOwner as i, cancelTaskByIdForOwner as n, listTasksForRelatedSessionKeyForOwner as o, findLatestTaskForRelatedSessionKeyForOwner as r, resolveTaskForLookupTokenForOwner as s, buildTaskStatusSnapshotForRelatedSessionKeyForOwner as t };
