import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure, s as rethrowExpectedCliError } from "./failure-output-CdUzE2dC.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import { l as resolveCronJobsStorePath, r as loadCronJobsStoreSync } from "./store-jPtUD1Vb.js";
import "./config-B_0xOnKq.js";
import { i as formatLookupMiss } from "./error-format-HTpcnFye.js";
import { s as readAgentDeletionJournal } from "./agent-deletion-journal-C1nSMR13.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CSCF74bk.js";
import { v as runSessionRegistryMaintenanceForStore } from "./sessions-BI8dPUCI.js";
import { n as TASK_STATUS_FILTERS, r as matchesTaskStatusFilter, t as TASK_RUNTIMES } from "./task-registry.types-73FJYVhP.js";
import { S as getTaskById, f as updateTaskNotifyPolicyById } from "./task-registry-aynazQHF.js";
import { n as formatTaskStatus, o as isTaskStatusIssue, r as formatTaskStatusDetail } from "./task-status-BrVINLTy.js";
import "./runtime-internal-C7MuMy9Z.js";
import { t as cancelDetachedTaskRunById } from "./task-executor-CcRsrYRm.js";
import { n as summarizeTaskRecords } from "./task-registry.summary-BwpoHlXv.js";
import { a as getInspectableTaskRegistrySummary, b as previewTaskFlowRegistryMaintenance, d as reconcileTaskLookupToken, i as getInspectableTaskAuditSummary, l as previewTaskRegistryMaintenance, o as getTaskRegistryMaintenanceDiagnostics, p as runTaskRegistryMaintenance, t as configureTaskRegistryMaintenance, u as reconcileInspectableTasks, v as assertTaskFlowRegistryMaintenanceReady, x as runTaskFlowRegistryMaintenance, y as getInspectableTaskFlowAuditSummary } from "./task-registry.maintenance-BSzqE7_G.js";
import { t as listTaskFlowAuditFindings } from "./task-flow-registry.audit-C3581muT.js";
import { i as summarizeRetainedLostTaskAuditFindings, n as listTaskAuditFindings } from "./task-registry.audit-BaLk4XcN.js";
import { n as TASK_SYSTEM_AUDIT_SEVERITIES, t as TASK_SYSTEM_AUDIT_CODES } from "./task-system-audit.types-EobzI_JT.js";
import { t as parseCliEnumFilter } from "./enum-filter-DttQixRC.js";
import { n as buildTaskSystemAuditJsonPayload, t as buildTaskSystemAuditFindings } from "./tasks-audit-system-CUNqud-N.js";
//#region src/commands/tasks-session-registry-maintenance.ts
const SESSION_REGISTRY_RETENTION_MS = 10080 * 6e4;
function resolveExplicitCronSessionSegment(sessionKey) {
	return /^(?:agent:[^:]+:)?cron:([^:]+)$/u.exec(sessionKey?.trim() ?? "")?.[1]?.toLowerCase();
}
function readRunningCronJobIds() {
	try {
		const runningJobs = loadCronJobsStoreSync(resolveCronJobsStorePath()).jobs.filter((job) => typeof job.state?.runningAtMs === "number");
		const ids = /* @__PURE__ */ new Set();
		for (const job of runningJobs) {
			ids.add(job.id.toLowerCase());
			if (job.sessionTarget === "main") continue;
			const explicitSessionSegment = resolveExplicitCronSessionSegment(job.sessionKey);
			if (explicitSessionSegment) ids.add(explicitSessionSegment);
		}
		return {
			ok: true,
			ids,
			count: runningJobs.length
		};
	} catch (err) {
		return {
			ok: false,
			reason: formatErrorMessage(err)
		};
	}
}
async function runSessionRegistryMaintenance(params) {
	const cfg = getRuntimeConfig();
	const runningCronJobs = readRunningCronJobIds();
	if (!runningCronJobs.ok) return {
		retentionMs: SESSION_REGISTRY_RETENTION_MS,
		runningCronJobs: 0,
		pruned: 0,
		skippedStores: 0,
		stores: [],
		skippedReason: `cron store unreadable: ${runningCronJobs.reason}`
	};
	const stores = [];
	for (const target of resolveAllAgentSessionStoreTargetsSync(cfg)) {
		if (readAgentDeletionJournal(target.agentId)?.cleanupCompleted) {
			stores.push({
				...target,
				skippedReason: "agent-deletion-complete"
			});
			continue;
		}
		const result = await runSessionRegistryMaintenanceForStore({
			apply: params.apply,
			retentionMs: SESSION_REGISTRY_RETENTION_MS,
			runningCronJobIds: runningCronJobs.ids,
			storePath: target.storePath
		});
		stores.push({
			agentId: target.agentId,
			storePath: target.storePath,
			beforeCount: result.beforeCount,
			afterCount: result.afterCount,
			pruned: result.pruned,
			preservedRunning: result.preservedRunning
		});
	}
	return {
		retentionMs: SESSION_REGISTRY_RETENTION_MS,
		runningCronJobs: runningCronJobs.count,
		pruned: stores.reduce((total, store) => total + ("pruned" in store ? store.pruned : 0), 0),
		skippedStores: stores.filter((store) => "skippedReason" in store).length,
		stores
	};
}
//#endregion
//#region src/commands/tasks.ts
const RUNTIME_PAD = 8;
const STATUS_PAD = 10;
const DELIVERY_PAD = 14;
const ID_PAD = 10;
const RUN_PAD = 10;
const info = theme.info;
function formatTaskLookupMiss(lookup) {
	return formatLookupMiss({
		noun: "Task",
		value: sanitizeTerminalText(lookup),
		listCommand: "openclaw tasks list",
		valueLabel: "task id"
	});
}
function formatTaskTimestamp(value) {
	return timestampMsToIsoString(value) ?? "n/a";
}
async function loadTaskCancelConfig() {
	return getRuntimeConfig();
}
async function tryCancelGatewayOwnedTaskViaGateway(task) {
	if (task.runtime === "cli") return null;
	try {
		const { callGateway } = await import("./call-DPYKD0iw.js");
		return await callGateway({
			method: "tasks.cancel",
			params: { taskId: task.taskId },
			timeoutMs: 5e3
		});
	} catch (error) {
		if (task.runtime === "cron") return null;
		const detail = error instanceof Error ? error.message : String(error);
		return {
			found: true,
			cancelled: false,
			reason: `${task.runtime.toUpperCase()} task cancellation requires the live Gateway tasks.cancel path: ${detail}`,
			task
		};
	}
}
function configureTaskMaintenanceFromConfig() {
	configureTaskRegistryMaintenance();
}
function truncate(value, maxChars) {
	if (value.length <= maxChars) return value;
	return maxChars <= 0 ? "" : truncateWithMarker(value, maxChars, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
}
function shortToken(value, maxChars = ID_PAD) {
	const sanitized = sanitizeTerminalText(normalizeOptionalString(value) ?? "").trim();
	if (!sanitized) return "n/a";
	return truncate(sanitized, maxChars);
}
function formatTaskStatusCell(status, rich) {
	const padded = status.padEnd(STATUS_PAD);
	if (!rich) return padded;
	if (status === "succeeded") return theme.success(padded);
	if (status === "failed" || status === "lost" || status === "timed_out") return theme.error(padded);
	if (status === "running") return theme.accentBright(padded);
	if (status === "blocked") return theme.warn(padded);
	return theme.muted(padded);
}
function formatTaskRows(tasks, rich) {
	const header = [
		"Task".padEnd(ID_PAD),
		"Kind".padEnd(RUNTIME_PAD),
		"Status".padEnd(STATUS_PAD),
		"Delivery".padEnd(DELIVERY_PAD),
		"Run".padEnd(RUN_PAD),
		"Child Session",
		"Summary"
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	for (const task of tasks) {
		const summary = truncate(sanitizeTerminalText(formatTaskStatusDetail(task) || normalizeOptionalString(task.label) || task.task.trim()), 80);
		const line = [
			shortToken(task.taskId).padEnd(ID_PAD),
			task.runtime.padEnd(RUNTIME_PAD),
			formatTaskStatusCell(formatTaskStatus(task), rich),
			task.deliveryStatus.padEnd(DELIVERY_PAD),
			shortToken(task.runId, RUN_PAD).padEnd(RUN_PAD),
			shortToken(task.childSessionKey, 36).padEnd(36),
			summary
		].join(" ");
		lines.push(line.trimEnd());
	}
	return lines;
}
function formatTaskListSummary(tasks) {
	const summary = summarizeTaskRecords(tasks);
	return `${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${tasks.filter(isTaskStatusIssue).length} issues`;
}
function formatAgeMs(ageMs) {
	if (typeof ageMs !== "number" || ageMs < 1e3) return "fresh";
	const totalSeconds = Math.floor(ageMs / 1e3);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor(totalSeconds % 86400 / 3600);
	const minutes = Math.floor(totalSeconds % 3600 / 60);
	if (days > 0) return `${days}d${hours}h`;
	if (hours > 0) return `${hours}h${minutes}m`;
	if (minutes > 0) return `${minutes}m`;
	return `${totalSeconds}s`;
}
function formatAuditRows(findings, rich) {
	const header = [
		"Scope".padEnd(8),
		"Severity".padEnd(8),
		"Code".padEnd(22),
		"Item".padEnd(ID_PAD),
		"Status".padEnd(STATUS_PAD),
		"Age".padEnd(8),
		"Detail"
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	for (const finding of findings) {
		const severity = finding.severity.padEnd(8);
		const status = formatTaskStatusCell(finding.status ?? "n/a", rich);
		const severityCell = !rich ? severity : finding.severity === "error" ? theme.error(severity) : theme.warn(severity);
		const scope = finding.kind === "task" ? "Task" : "TaskFlow";
		lines.push([
			scope.padEnd(8),
			severityCell,
			finding.code.padEnd(22),
			shortToken(finding.token).padEnd(ID_PAD),
			status,
			formatAgeMs(finding.ageMs).padEnd(8),
			truncate(sanitizeTerminalText(finding.detail), 88)
		].join(" ").trimEnd());
	}
	return lines;
}
function toSystemAuditFindings(params) {
	return buildTaskSystemAuditFindings({
		taskFindings: listTaskAuditFindings({ tasks: reconcileInspectableTasks() }),
		flowFindings: listTaskFlowAuditFindings(),
		severityFilter: params.severityFilter,
		codeFilter: params.codeFilter
	});
}
/** Lists background tasks with optional runtime/status filters. */
async function tasksListCommand(opts, runtime) {
	const runtimeFilter = parseCliEnumFilter(opts.runtime, "--runtime", TASK_RUNTIMES);
	const statusFilter = parseCliEnumFilter(opts.status, "--status", TASK_STATUS_FILTERS);
	const tasks = reconcileInspectableTasks().filter((task) => {
		if (runtimeFilter && task.runtime !== runtimeFilter) return false;
		if (statusFilter && !matchesTaskStatusFilter(task, statusFilter)) return false;
		return true;
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			count: tasks.length,
			runtime: runtimeFilter ?? null,
			status: statusFilter ?? null,
			tasks
		});
		return;
	}
	runtime.log(info(`Background tasks: ${tasks.length}`));
	runtime.log(info(`Task pressure: ${formatTaskListSummary(tasks)}`));
	if (runtimeFilter) runtime.log(info(`Runtime filter: ${sanitizeTerminalText(runtimeFilter)}`));
	if (statusFilter) runtime.log(info(`Status filter: ${sanitizeTerminalText(statusFilter)}`));
	if (tasks.length === 0) {
		runtime.log(`No background tasks found. Run ${formatCliCommand("openclaw tasks audit")} to check for stale task state.`);
		return;
	}
	const rich = isRich();
	for (const line of formatTaskRows(tasks, rich)) runtime.log(line);
}
/** Shows one task record by id or lookup token. */
async function tasksShowCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		const message = formatTaskLookupMiss(opts.lookup);
		if (opts.json) writeRuntimeJson(runtime, formatCliJsonFailure(message));
		else runtime.error(message);
		runtime.exit(1, opts.json ? { resetStream: process.stderr } : void 0);
		return;
	}
	if (opts.json) {
		writeRuntimeJson(runtime, task);
		return;
	}
	const lines = [
		"Background task:",
		`taskId: ${task.taskId}`,
		`kind: ${task.runtime}`,
		`sourceId: ${task.sourceId ?? "n/a"}`,
		`status: ${formatTaskStatus(task)}`,
		`result: ${task.terminalOutcome ?? "n/a"}`,
		`delivery: ${task.deliveryStatus}`,
		`notify: ${task.notifyPolicy}`,
		`ownerKey: ${task.ownerKey}`,
		`childSessionKey: ${task.childSessionKey ?? "n/a"}`,
		`parentTaskId: ${task.parentTaskId ?? "n/a"}`,
		`agentId: ${task.agentId ?? "n/a"}`,
		`runId: ${task.runId ?? "n/a"}`,
		`label: ${task.label ?? "n/a"}`,
		`task: ${task.task}`,
		`createdAt: ${formatTaskTimestamp(task.createdAt)}`,
		`startedAt: ${formatTaskTimestamp(task.startedAt)}`,
		`endedAt: ${formatTaskTimestamp(task.endedAt)}`,
		`lastEventAt: ${formatTaskTimestamp(task.lastEventAt)}`,
		`cleanupAfter: ${formatTaskTimestamp(task.cleanupAfter)}`,
		...task.error ? [`error: ${task.error}`] : [],
		...task.progressSummary ? [`progressSummary: ${task.progressSummary}`] : [],
		...task.terminalSummary ? [`terminalSummary: ${task.terminalSummary}`] : []
	];
	for (const line of lines) runtime.log(sanitizeTerminalText(line));
}
/** Updates a task's notification policy. */
async function tasksNotifyCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	const updated = updateTaskNotifyPolicyById({
		taskId: task.taskId,
		notifyPolicy: opts.notify
	});
	if (!updated) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	runtime.log(sanitizeTerminalText(`Updated ${updated.taskId} notify policy to ${updated.notifyPolicy}.`));
}
/** Cancels a detached task run by lookup token. */
async function tasksCancelCommand(opts, runtime) {
	const task = reconcileTaskLookupToken(opts.lookup);
	if (!task) {
		runtime.error(formatTaskLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	const gatewayResult = await tryCancelGatewayOwnedTaskViaGateway(task);
	if (gatewayResult) {
		if (!gatewayResult.found) {
			runtime.error(sanitizeTerminalText(gatewayResult.reason ?? formatTaskLookupMiss(opts.lookup)));
			runtime.exit(1);
			return;
		}
		if (!gatewayResult.cancelled) {
			runtime.error(sanitizeTerminalText(gatewayResult.reason ?? `Could not cancel task: ${opts.lookup}`));
			runtime.exit(1);
			return;
		}
		const updated = gatewayResult.task;
		runtime.log(sanitizeTerminalText(`Cancelled ${updated?.taskId ?? updated?.id ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`));
		return;
	}
	const result = await cancelDetachedTaskRunById({
		cfg: await loadTaskCancelConfig(),
		taskId: task.taskId
	});
	if (!result.found) {
		runtime.error(sanitizeTerminalText(result.reason ?? formatTaskLookupMiss(opts.lookup)));
		runtime.exit(1);
		return;
	}
	if (!result.cancelled) {
		runtime.error(sanitizeTerminalText(result.reason ?? `Could not cancel task: ${opts.lookup}`));
		runtime.exit(1);
		return;
	}
	const updated = getTaskById(task.taskId);
	runtime.log(sanitizeTerminalText(`Cancelled ${updated?.taskId ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`));
}
async function runTaskRecoveryCommand(action, lookups, runtime) {
	if (lookups.length > 10) {
		runtime.error("At most 10 task deliveries can be recovered per request.");
		runtime.exit(1);
		return;
	}
	const tasks = [];
	for (const lookup of lookups) {
		const task = reconcileTaskLookupToken(lookup);
		if (!task) {
			runtime.error(formatTaskLookupMiss(lookup));
			runtime.exit(1);
			return;
		}
		tasks.push(task);
	}
	try {
		const { callGateway } = await import("./call-DPYKD0iw.js");
		const failures = (await callGateway({
			method: `tasks.${action}`,
			params: { taskIds: tasks.map((task) => task.taskId) },
			timeoutMs: 1e4
		})).results?.filter((result) => result.ok !== true) ?? [];
		if (failures.length > 0) {
			for (const failure of failures) runtime.error(sanitizeTerminalText(`${failure.taskId ?? "task"}: ${failure.reason ?? `${action} failed`}`));
			runtime.exit(1);
			return;
		}
		runtime.log(sanitizeTerminalText(`${action === "retry" ? "Retried" : "Dismissed"} ${tasks.length} ${tasks.length === 1 ? "completion delivery" : "completion deliveries"}.${action === "retry" ? " Ambiguous prior acknowledgements may still produce a duplicate visible result." : ""}`));
	} catch (error) {
		rethrowExpectedCliError(error);
		runtime.error(sanitizeTerminalText(`Task delivery ${action} requires a live Gateway: ${error instanceof Error ? error.message : String(error)}`));
		runtime.exit(1);
	}
}
/** Starts a new fenced delivery generation for one to ten blocked completions. */
async function tasksRetryCommand(opts, runtime) {
	await runTaskRecoveryCommand("retry", opts.lookups, runtime);
}
/** Records intentional non-delivery while preserving the task result and audit projection. */
async function tasksDismissCommand(opts, runtime) {
	await runTaskRecoveryCommand("dismiss", opts.lookups, runtime);
}
/** Prints or serializes combined task/task-flow audit findings. */
async function tasksAuditCommand(opts, runtime) {
	const severityFilter = parseCliEnumFilter(opts.severity, "--severity", TASK_SYSTEM_AUDIT_SEVERITIES);
	const codeFilter = parseCliEnumFilter(opts.code, "--code", TASK_SYSTEM_AUDIT_CODES);
	configureTaskMaintenanceFromConfig();
	const auditResult = toSystemAuditFindings({
		severityFilter,
		codeFilter
	});
	const { filteredFindings, summary } = auditResult;
	const limit = typeof opts.limit === "number" && opts.limit > 0 ? opts.limit : void 0;
	const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;
	if (opts.json) {
		writeRuntimeJson(runtime, buildTaskSystemAuditJsonPayload(auditResult, {
			severityFilter,
			codeFilter,
			limit: opts.limit
		}));
		return;
	}
	runtime.log(info(`Tasks audit: ${summary.total} findings · ${summary.errors} errors · ${summary.warnings} warnings`));
	if (severityFilter || codeFilter) runtime.log(info(`Showing ${filteredFindings.length} matching findings.`));
	if (severityFilter) runtime.log(info(`Severity filter: ${sanitizeTerminalText(severityFilter)}`));
	if (codeFilter) runtime.log(info(`Code filter: ${sanitizeTerminalText(codeFilter)}`));
	if (limit) runtime.log(info(`Limit: ${limit}`));
	runtime.log(info(`Task findings: ${summary.tasks.total} · TaskFlow findings: ${summary.taskFlows.total}`));
	if (displayed.length === 0) {
		runtime.log("No tasks audit findings.");
		return;
	}
	const rich = isRich();
	for (const line of formatAuditRows(displayed, rich)) runtime.log(line);
}
/** Previews or applies task, task-flow, and backing session-registry maintenance. */
async function tasksMaintenanceCommand(opts, runtime) {
	configureTaskMaintenanceFromConfig();
	assertTaskFlowRegistryMaintenanceReady();
	const auditBefore = getInspectableTaskAuditSummary();
	const flowAuditBefore = getInspectableTaskFlowAuditSummary();
	const taskMaintenance = opts.apply ? await runTaskRegistryMaintenance() : previewTaskRegistryMaintenance();
	const diagnostics = opts.json ? getTaskRegistryMaintenanceDiagnostics() : void 0;
	const flowMaintenance = opts.apply ? await runTaskFlowRegistryMaintenance() : previewTaskFlowRegistryMaintenance();
	const sessionMaintenance = await runSessionRegistryMaintenance({ apply: Boolean(opts.apply) });
	const summary = getInspectableTaskRegistrySummary();
	const auditAfter = opts.apply ? getInspectableTaskAuditSummary() : auditBefore;
	const flowAuditAfter = opts.apply ? getInspectableTaskFlowAuditSummary() : flowAuditBefore;
	const retainedLostAfter = summarizeRetainedLostTaskAuditFindings(listTaskAuditFindings({ tasks: reconcileInspectableTasks() }));
	if (opts.json) {
		writeRuntimeJson(runtime, {
			mode: opts.apply ? "apply" : "preview",
			maintenance: {
				tasks: taskMaintenance,
				taskFlows: flowMaintenance,
				sessions: sessionMaintenance
			},
			tasks: summary,
			diagnostics,
			auditBefore: {
				...auditBefore,
				taskFlows: flowAuditBefore
			},
			auditAfter: {
				...auditAfter,
				taskFlows: flowAuditAfter
			}
		});
		return;
	}
	runtime.log(info(`Tasks maintenance (${opts.apply ? "applied" : "preview"}): tasks ${taskMaintenance.reconciled} reconcile · ${taskMaintenance.recovered} recovered · ${taskMaintenance.cleanupStamped} cleanup stamp · ${taskMaintenance.pruned} prune; task-flows ${flowMaintenance.reconciled} reconcile · ${flowMaintenance.pruned} prune`));
	runtime.log(info(sessionMaintenance.skippedReason ? `Session registry: sweep skipped (${sessionMaintenance.skippedReason})` : `Session registry: ${sessionMaintenance.pruned} prune · ${sessionMaintenance.runningCronJobs} running automations · ${sessionMaintenance.skippedStores} skipped ${sessionMaintenance.skippedStores === 1 ? "store" : "stores"}`));
	runtime.log(info(`${opts.apply ? "Tasks health after apply" : "Tasks health"}: ${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${auditAfter.errors + flowAuditAfter.errors} audit errors · ${auditAfter.warnings + flowAuditAfter.warnings} audit warnings`));
	if (retainedLostAfter.count > 0) runtime.log(info(`Retained lost tasks: ${retainedLostAfter.count} retained until ${timestampMsToIsoString(retainedLostAfter.nextCleanupAfter) ?? "cleanupAfter"}; maintenance will prune after cleanupAfter.`));
	if (opts.apply) runtime.log(info(`Tasks health before apply: ${auditBefore.errors + flowAuditBefore.errors} audit errors · ${auditBefore.warnings + flowAuditBefore.warnings} audit warnings`));
	if (!opts.apply) runtime.log("Dry run only. Re-run with `openclaw tasks maintenance --apply` to write changes.");
}
//#endregion
export { tasksAuditCommand, tasksCancelCommand, tasksDismissCommand, tasksListCommand, tasksMaintenanceCommand, tasksNotifyCommand, tasksRetryCommand, tasksShowCommand };
