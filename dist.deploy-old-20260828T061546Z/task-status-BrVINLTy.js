import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-Bw16L5tB.js";
import { t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-E3ku7Huk.js";
import { r as matchesTaskStatusFilter } from "./task-registry.types-73FJYVhP.js";
import { r as sanitizeUserFacingText, t as renderUserFacingText } from "./user-facing-text-BAcix5i_.js";
//#region src/tasks/task-status.ts
const ACTIVE_TASK_STATUSES = /* @__PURE__ */ new Set(["queued", "running"]);
const FAILURE_TASK_STATUSES = /* @__PURE__ */ new Set([
	"failed",
	"timed_out",
	"lost",
	"blocked"
]);
/** Window for showing recently completed tasks in compact status output. */
const TASK_STATUS_RECENT_WINDOW_MS = 5 * 6e4;
const TASK_STATUS_TITLE_MAX_CHARS = 80;
function isActiveTask(task) {
	return ACTIVE_TASK_STATUSES.has(task.status);
}
function formatTaskStatus(task) {
	return matchesTaskStatusFilter(task, "blocked") ? "blocked" : task.status;
}
function isTaskStatusIssue(task) {
	return FAILURE_TASK_STATUSES.has(formatTaskStatus(task));
}
function resolveTaskReferenceAt(task) {
	if (isActiveTask(task)) return task.lastEventAt ?? task.startedAt ?? task.createdAt;
	return task.endedAt ?? task.lastEventAt ?? task.startedAt ?? task.createdAt;
}
function isExpiredTask(task, now) {
	return typeof task.cleanupAfter === "number" && task.cleanupAfter <= now;
}
function isRecentTerminalTask(task, now) {
	if (isActiveTask(task)) return false;
	return now - resolveTaskReferenceAt(task) <= TASK_STATUS_RECENT_WINDOW_MS;
}
function truncateTaskStatusText(value, maxChars) {
	const trimmed = value.trim();
	if (trimmed.length <= maxChars) return trimmed;
	return `${truncateUtf16Safe(trimmed, Math.max(0, maxChars - 1)).trimEnd()}…`;
}
function stripInlineLeakedInternalContext(value) {
	const beginIndex = value.indexOf(INTERNAL_RUNTIME_CONTEXT_BEGIN);
	if (beginIndex !== -1 && (value.includes("<<<END_OPENCLAW_INTERNAL_CONTEXT>>>") || value.includes("OpenClaw runtime context (internal):") || value.includes("[Internal task completion event]"))) return value.slice(0, beginIndex);
	const legacyHeaderIndex = value.indexOf("OpenClaw runtime context (internal):");
	if (legacyHeaderIndex !== -1 && (value.includes("Keep internal details private.") || value.includes("[Internal task completion event]"))) return value.slice(0, legacyHeaderIndex);
	return value;
}
function sanitizeTaskStatusValue(value, errorContext) {
	if (typeof value === "string") return renderUserFacingText(stripInlineLeakedInternalContext(value), { errorContext }).replace(/\s+/g, " ").trim() || void 0;
	if (Array.isArray(value)) {
		const next = value.map((entry) => sanitizeTaskStatusValue(entry, errorContext)).filter((entry) => entry !== void 0);
		return next.length > 0 ? next : void 0;
	}
	if (value && typeof value === "object") {
		const nextEntries = Object.entries(value).map(([key, entry]) => [key, sanitizeTaskStatusValue(entry, errorContext)]).filter(([, entry]) => entry !== void 0);
		if (nextEntries.length === 0) return;
		return Object.fromEntries(nextEntries);
	}
	return value;
}
function sanitizeTaskStatusText(value, opts) {
	const sanitizedValue = sanitizeTaskStatusValue(value, opts?.errorContext ?? false);
	const sanitized = (typeof sanitizedValue === "string" ? sanitizedValue : sanitizedValue == null ? "" : JSON.stringify(sanitizedValue) ?? "").replace(/\s+/g, " ").trim();
	if (!sanitized) return "";
	if (typeof opts?.maxChars === "number") return truncateTaskStatusText(sanitized, opts.maxChars);
	return sanitized;
}
/** Sanitize bounded task input for detail views without flattening its layout. */
function sanitizeTaskPromptText(value, maxChars) {
	if (typeof value !== "string") return "";
	const sanitized = sanitizeUserFacingText(stripInlineLeakedInternalContext(value));
	return sanitized ? truncateTaskStatusText(sanitized, maxChars) : "";
}
function formatTaskStatusTitleText(value, fallback = "Background task") {
	return sanitizeTaskStatusText(value, { maxChars: TASK_STATUS_TITLE_MAX_CHARS }) || fallback;
}
function formatTaskStatusTitle(task) {
	return formatTaskStatusTitleText(task.label?.trim() || task.task.trim());
}
function formatTaskStatusDetail(task) {
	if (task.status === "running" || task.status === "queued") return sanitizeTaskStatusText(task.progressSummary, { maxChars: 120 }) || void 0;
	const sanitizedError = sanitizeTaskStatusText(task.error, {
		errorContext: true,
		maxChars: 120
	});
	if (sanitizedError) return sanitizedError;
	return sanitizeTaskStatusText(task.terminalSummary, {
		errorContext: true,
		maxChars: 120
	}) || void 0;
}
function buildTaskStatusSnapshot(tasks, opts) {
	const now = opts?.now ?? Date.now();
	const visibleCandidates = tasks.filter((task) => !isExpiredTask(task, now));
	const active = visibleCandidates.filter(isActiveTask);
	const recentTerminal = visibleCandidates.filter((task) => isRecentTerminalTask(task, now));
	const visible = active.length > 0 ? [...active, ...recentTerminal] : recentTerminal;
	const focus = active[0] ?? recentTerminal.find(isTaskStatusIssue) ?? recentTerminal[0];
	return {
		latest: active[0] ?? recentTerminal[0],
		focus,
		visible,
		active,
		recentTerminal,
		activeCount: active.length,
		totalCount: visible.length,
		recentFailureCount: recentTerminal.filter(isTaskStatusIssue).length
	};
}
//#endregion
export { formatTaskStatusTitleText as a, sanitizeTaskStatusText as c, formatTaskStatusTitle as i, formatTaskStatus as n, isTaskStatusIssue as o, formatTaskStatusDetail as r, sanitizeTaskPromptText as s, buildTaskStatusSnapshot as t };
