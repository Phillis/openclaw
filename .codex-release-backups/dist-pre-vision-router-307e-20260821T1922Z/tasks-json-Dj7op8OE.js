import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
import { T as listTaskRecords } from "./task-registry-DkfAoDv0.js";
import "./runtime-internal-CEnngiYh.js";
import { n as listTaskAuditFindings } from "./task-registry.audit-DiY0ICYg.js";
import { n as buildTaskSystemAuditJsonPayload, r as listTaskFlowAuditFindings, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-OtOmDVA_.js";
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
	const runtimeFilter = normalizeOptionalString(opts.runtime);
	const statusFilter = normalizeOptionalString(opts.status);
	const tasks = listTaskJsonRecords().filter((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && task.status !== statusFilter) return false;
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
	const severityFilter = normalizeOptionalString(opts.severity);
	const codeFilter = normalizeOptionalString(opts.code);
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
