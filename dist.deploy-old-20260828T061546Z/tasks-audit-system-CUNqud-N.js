import { n as summarizeTaskFlowAuditFindings } from "./task-flow-registry.audit-C3581muT.js";
import { r as compareTaskAuditFindingSortKeys } from "./task-registry.audit.shared-CN77q0s9.js";
import { a as summarizeTaskAuditFindings } from "./task-registry.audit-BaLk4XcN.js";
//#region src/commands/tasks-audit-system.ts
function compareSystemAuditFindings(left, right) {
	return compareTaskAuditFindingSortKeys({
		severity: left.severity,
		ageMs: left.ageMs,
		createdAt: left.task?.createdAt ?? left.flow?.createdAt ?? 0
	}, {
		severity: right.severity,
		ageMs: right.ageMs,
		createdAt: right.task?.createdAt ?? right.flow?.createdAt ?? 0
	});
}
/** Builds combined task/task-flow audit findings with optional severity/code filtering. */
function buildTaskSystemAuditFindings(params) {
	const allFindings = [...params.taskFindings.map((finding) => ({
		kind: "task",
		severity: finding.severity,
		code: finding.code,
		detail: finding.detail,
		ageMs: finding.ageMs,
		status: finding.task.status,
		token: finding.task.taskId,
		task: finding.task
	})), ...params.flowFindings.map((finding) => ({
		kind: "task_flow",
		severity: finding.severity,
		code: finding.code,
		detail: finding.detail,
		ageMs: finding.ageMs,
		status: finding.flow?.status ?? "n/a",
		token: finding.flow?.flowId,
		...finding.flow ? { flow: finding.flow } : {}
	}))];
	const filteredFindings = allFindings.filter((finding) => {
		if (params.severityFilter && finding.severity !== params.severityFilter) return false;
		if (params.codeFilter && finding.code !== params.codeFilter) return false;
		return true;
	}).toSorted(compareSystemAuditFindings);
	const sortedAllFindings = [...allFindings].toSorted(compareSystemAuditFindings);
	return {
		allFindings: sortedAllFindings,
		filteredFindings,
		taskFindings: params.taskFindings,
		flowFindings: params.flowFindings,
		summary: {
			total: sortedAllFindings.length,
			errors: sortedAllFindings.filter((finding) => finding.severity === "error").length,
			warnings: sortedAllFindings.filter((finding) => finding.severity !== "error").length,
			tasks: summarizeTaskAuditFindings(params.taskFindings),
			taskFlows: summarizeTaskFlowAuditFindings(params.flowFindings)
		}
	};
}
function buildTaskSystemAuditJsonPayload(result, params) {
	const { allFindings, filteredFindings, taskFindings, summary } = result;
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : void 0;
	const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;
	const legacySummary = summarizeTaskAuditFindings(taskFindings);
	return {
		count: allFindings.length,
		filteredCount: filteredFindings.length,
		displayed: displayed.length,
		filters: {
			severity: params.severityFilter ?? null,
			code: params.codeFilter ?? null,
			limit: limit ?? null
		},
		summary: {
			...legacySummary,
			taskFlows: summary.taskFlows,
			combined: {
				total: summary.total,
				errors: summary.errors,
				warnings: summary.warnings
			}
		},
		findings: displayed
	};
}
//#endregion
export { buildTaskSystemAuditJsonPayload as n, buildTaskSystemAuditFindings as t };
