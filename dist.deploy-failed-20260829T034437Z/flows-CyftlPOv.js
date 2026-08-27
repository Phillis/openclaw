import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { R as timestampMsToIsoString } from "./number-coercion-CLj0HTDM.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as formatCliJsonFailure } from "./failure-output-CdUzE2dC.js";
import { o as truncateToVisibleWidth, s as visibleWidth } from "./ansi-DjDeieuH.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import "./config-B2bSneS2.js";
import { n as info } from "./globals-GZNLg1ns.js";
import { n as isTerminalTaskFlow, t as TASK_FLOW_STATUSES } from "./task-flow-registry.types-BidrdCoB.js";
import { $ as listTaskFlowRecords, Z as getTaskFlowById, k as listTasksForFlowId, rt as resolveTaskFlowForLookupToken } from "./task-registry-DzN8snH1.js";
import { n as formatTaskStatus, o as isTaskStatusIssue, r as formatTaskStatusDetail } from "./task-status-DUVcvxzX.js";
import "./runtime-internal-KZAce0-2.js";
import { d as getFlowTaskSummary, n as cancelFlowById } from "./task-executor-D9EdhKj2.js";
import { t as parseCliEnumFilter } from "./enum-filter-DttQixRC.js";
//#region src/commands/flows.ts
/** CLI commands for listing, inspecting, and cancelling TaskFlow records. */
const ID_PAD = 10;
const STATUS_PAD = 10;
const MODE_PAD = 14;
const REV_PAD = 6;
const CTRL_PAD = 20;
function formatFlowLookupMiss(lookup) {
	return `TaskFlow not found: ${sanitizeTerminalText(lookup)}. Run ${formatCliCommand("openclaw tasks flow list")} to see recent flow ids.`;
}
function truncate(value, maxChars) {
	if (value.length <= maxChars) return value;
	if (maxChars <= 1) return truncateUtf16Safe(value, maxChars);
	return truncateWithMarker(value, maxChars, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
}
function safeFlowDisplayText(value, maxChars) {
	const sanitized = sanitizeTerminalText(value ?? "").trim();
	if (!sanitized) return "n/a";
	return typeof maxChars === "number" ? truncate(sanitized, maxChars) : sanitized;
}
function formatFlowTableCell(value, width) {
	const text = safeFlowDisplayText(value);
	const fitted = visibleWidth(text) > width ? `${truncateToVisibleWidth(text, width - 1)}…` : text;
	return `${fitted}${" ".repeat(width - visibleWidth(fitted))}`;
}
function shortToken(value, maxChars = ID_PAD) {
	return safeFlowDisplayText(normalizeOptionalString(value), maxChars);
}
function formatFlowTimestamp(value) {
	return timestampMsToIsoString(value) ?? "n/a";
}
function formatFlowStatusCell(status, rich) {
	const padded = status.padEnd(STATUS_PAD);
	if (!rich) return padded;
	if (status === "succeeded") return theme.success(padded);
	if (status === "failed" || status === "lost") return theme.error(padded);
	if (status === "running") return theme.accentBright(padded);
	if (status === "blocked") return theme.warn(padded);
	return theme.muted(padded);
}
function formatFlowRows(flows, rich) {
	const header = [
		"TaskFlow".padEnd(ID_PAD),
		"Mode".padEnd(MODE_PAD),
		"Status".padEnd(STATUS_PAD),
		"Rev".padEnd(REV_PAD),
		"Controller".padEnd(CTRL_PAD),
		"Tasks".padEnd(14),
		"Goal"
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	for (const flow of flows) {
		const taskSummary = getFlowTaskSummary(flow.flowId);
		const counts = `${taskSummary.active} active/${taskSummary.total} total`;
		lines.push([
			shortToken(flow.flowId).padEnd(ID_PAD),
			flow.syncMode.padEnd(MODE_PAD),
			formatFlowStatusCell(flow.status, rich),
			String(flow.revision).padEnd(REV_PAD),
			formatFlowTableCell(flow.controllerId, CTRL_PAD),
			counts.padEnd(14),
			safeFlowDisplayText(flow.goal, 80)
		].join(" "));
	}
	return lines;
}
function formatFlowListSummary(flows) {
	const counts = {
		active: 0,
		waiting: 0,
		blocked: 0,
		issues: 0,
		cancelRequested: 0
	};
	for (const flow of flows) {
		counts.active += Number(flow.status === "queued" || flow.status === "running");
		counts.waiting += Number(flow.status === "waiting");
		counts.blocked += Number(flow.status === "blocked");
		counts.issues += Number(flow.status === "failed" || flow.status === "lost");
		counts.cancelRequested += Number(flow.cancelRequestedAt != null && !isTerminalTaskFlow(flow));
	}
	const waiting = counts.waiting ? ` · ${counts.waiting} waiting` : "";
	const issues = counts.issues ? ` · ${counts.issues} issues` : "";
	return `${counts.active} active${waiting} · ${counts.blocked} blocked${issues} · ${counts.cancelRequested} cancel-requested · ${flows.length} total`;
}
function summarizeWait(flow) {
	if (flow.waitJson == null) return "n/a";
	if (typeof flow.waitJson === "string" || typeof flow.waitJson === "number" || typeof flow.waitJson === "boolean") return String(flow.waitJson);
	if (Array.isArray(flow.waitJson)) return `array(${flow.waitJson.length})`;
	return Object.keys(flow.waitJson).toSorted().join(", ") || "object";
}
function summarizeFlowState(flow) {
	if (flow.status === "blocked") {
		if (flow.blockedSummary) return flow.blockedSummary;
		if (flow.blockedTaskId) return `blocked by ${flow.blockedTaskId}`;
		return "blocked";
	}
	if (flow.status === "waiting" && flow.waitJson != null) return summarizeWait(flow);
	return null;
}
/** Lists TaskFlows with optional status filtering and JSON output. */
async function flowsListCommand(opts, runtime) {
	const statusFilter = parseCliEnumFilter(opts.status, "--status", TASK_FLOW_STATUSES);
	const flows = listTaskFlowRecords().filter((flow) => {
		if (statusFilter && flow.status !== statusFilter) return false;
		return true;
	});
	if (opts.json) {
		writeRuntimeJson(runtime, {
			count: flows.length,
			status: statusFilter ?? null,
			flows: flows.map((flow) => ({
				...flow,
				tasks: listTasksForFlowId(flow.flowId),
				taskSummary: getFlowTaskSummary(flow.flowId)
			}))
		});
		return;
	}
	runtime.log(info(`TaskFlows: ${flows.length}`));
	runtime.log(info(`TaskFlow pressure: ${formatFlowListSummary(flows)}`));
	if (statusFilter) runtime.log(info(`Status filter: ${sanitizeTerminalText(statusFilter)}`));
	if (flows.length === 0) {
		runtime.log(`No TaskFlows found. Run ${formatCliCommand("openclaw tasks list")} to inspect standalone background tasks.`);
		return;
	}
	const rich = isRich();
	for (const line of formatFlowRows(flows, rich)) runtime.log(line);
}
/** Shows one TaskFlow and its linked task summary. */
async function flowsShowCommand(opts, runtime) {
	const flow = resolveTaskFlowForLookupToken(opts.lookup);
	if (!flow) {
		const message = formatFlowLookupMiss(opts.lookup);
		if (opts.json) writeRuntimeJson(runtime, formatCliJsonFailure(message));
		else runtime.error(message);
		runtime.exit(1, opts.json ? { resetStream: process.stderr } : void 0);
		return;
	}
	const tasks = listTasksForFlowId(flow.flowId);
	const taskSummary = getFlowTaskSummary(flow.flowId);
	const stateSummary = summarizeFlowState(flow);
	if (opts.json) {
		writeRuntimeJson(runtime, {
			...flow,
			tasks,
			taskSummary
		});
		return;
	}
	const lines = [
		"TaskFlow:",
		`flowId: ${flow.flowId}`,
		`status: ${flow.status}`,
		`goal: ${safeFlowDisplayText(flow.goal)}`,
		`currentStep: ${safeFlowDisplayText(flow.currentStep)}`,
		`owner: ${safeFlowDisplayText(flow.ownerKey)}`,
		`notify: ${flow.notifyPolicy}`,
		...stateSummary ? [`state: ${safeFlowDisplayText(stateSummary)}`] : [],
		...flow.cancelRequestedAt ? [`cancelRequestedAt: ${formatFlowTimestamp(flow.cancelRequestedAt)}`] : [],
		`createdAt: ${formatFlowTimestamp(flow.createdAt)}`,
		`updatedAt: ${formatFlowTimestamp(flow.updatedAt)}`,
		`endedAt: ${formatFlowTimestamp(flow.endedAt)}`,
		`tasks: ${taskSummary.total} total · ${taskSummary.active} active · ${tasks.filter(isTaskStatusIssue).length} issues`
	];
	for (const line of lines) runtime.log(sanitizeTerminalText(line));
	if (tasks.length === 0) {
		runtime.log("Linked tasks: none");
		return;
	}
	runtime.log("Linked tasks:");
	for (const task of tasks) {
		const safeLabel = safeFlowDisplayText(task.label ?? task.task);
		const detail = formatTaskStatusDetail(task);
		const safeDetail = detail ? ` · ${safeFlowDisplayText(detail)}` : "";
		runtime.log(sanitizeTerminalText(`- ${task.taskId} ${formatTaskStatus(task)} ${safeFlowDisplayText(task.runId)} ${safeLabel}${safeDetail}`));
	}
}
/** Requests cancellation for one TaskFlow selected by id or lookup token. */
async function flowsCancelCommand(opts, runtime) {
	const flow = resolveTaskFlowForLookupToken(opts.lookup);
	if (!flow) {
		runtime.error(formatFlowLookupMiss(opts.lookup));
		runtime.exit(1);
		return;
	}
	const result = await cancelFlowById({
		cfg: getRuntimeConfig(),
		flowId: flow.flowId
	});
	if (!result.found) {
		runtime.error(sanitizeTerminalText(result.reason ?? formatFlowLookupMiss(opts.lookup)));
		runtime.exit(1);
		return;
	}
	if (!result.cancelled) {
		runtime.error(sanitizeTerminalText(result.reason ?? `Could not cancel TaskFlow: ${opts.lookup}`));
		runtime.exit(1);
		return;
	}
	const updated = getTaskFlowById(flow.flowId) ?? result.flow ?? flow;
	runtime.log(sanitizeTerminalText(`Cancelled ${updated.flowId} (${updated.syncMode}) with status ${updated.status}.`));
}
//#endregion
export { flowsCancelCommand, flowsListCommand, flowsShowCommand };
