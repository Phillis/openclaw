import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as TASK_STATUS_FILTERS, r as matchesTaskStatusFilter, t as TASK_RUNTIMES } from "./task-registry.types-73FJYVhP.js";
import { E as listTaskRecords } from "./task-registry-DzN8snH1.js";
import "./runtime-internal-KZAce0-2.js";
import { t as listTaskFlowAuditFindings } from "./task-flow-registry.audit-4_Ph7K21.js";
import { n as listTaskAuditFindings } from "./task-registry.audit-BaLk4XcN.js";
import { n as TASK_SYSTEM_AUDIT_SEVERITIES, t as TASK_SYSTEM_AUDIT_CODES } from "./task-system-audit.types-EobzI_JT.js";
import { t as parseCliEnumFilter } from "./enum-filter-DttQixRC.js";
import { n as buildTaskSystemAuditJsonPayload, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-BTXZkMiH.js";
//#region src/commands/tasks-json.ts
function listTaskJsonRecords() {
	return listTaskRecords();
}
function toSystemAuditFindings(params) {
	return buildTaskSystemAuditFindings({
		taskFindings: listTaskAuditFindings({ tasks: listTaskJsonRecords() }),
		flowFindings: listTaskFlowAuditFindings(),
		severityFilter: params.severityFilter,
		codeFilter: params.codeFilter
	});
}
function buildTasksListJsonPayload(opts) {
	const runtimeFilter = parseCliEnumFilter(opts.runtime, "--runtime", TASK_RUNTIMES);
	const statusFilter = parseCliEnumFilter(opts.status, "--status", TASK_STATUS_FILTERS);
	const tasks = listTaskJsonRecords().filter((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && !matchesTaskStatusFilter(task, statusFilter)) return false;
		return true;
	});
	return {
		count: tasks.length,
		runtime: runtimeFilter ?? null,
		status: statusFilter ?? null,
		tasks
	};
}
function buildTasksAuditJsonPayload(opts) {
	const severityFilter = parseCliEnumFilter(opts.severity, "--severity", TASK_SYSTEM_AUDIT_SEVERITIES);
	const codeFilter = parseCliEnumFilter(opts.code, "--code", TASK_SYSTEM_AUDIT_CODES);
	return buildTaskSystemAuditJsonPayload(toSystemAuditFindings({
		severityFilter,
		codeFilter
	}), {
		severityFilter,
		codeFilter,
		limit: opts.limit
	});
}
/** Writes task list JSON without triggering task maintenance. */
async function tasksListJsonCommand(opts, runtime) {
	writeRuntimeJson(runtime, buildTasksListJsonPayload(opts));
}
/** Writes task audit JSON with combined task/task-flow findings. */
async function tasksAuditJsonCommand(opts, runtime) {
	writeRuntimeJson(runtime, buildTasksAuditJsonPayload(opts));
}
//#endregion
export { tasksAuditJsonCommand, tasksListJsonCommand };
