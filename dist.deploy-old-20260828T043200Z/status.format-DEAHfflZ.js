import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { t as formatRuntimeStatusWithDetails } from "./runtime-status-Ck96lKmZ.js";
import { t as getSystemdCgroupHygieneSummary } from "./service-runtime-E6hYEM49.js";
import { D as formatTokenCount } from "./sessions-CdrF1uzY.js";
import { r as formatDurationPrecise } from "./format-duration-CfGzOxKC.js";
//#region src/commands/status.format.ts
const formatKTokens = formatTokenCount;
/** Formats the actionable entries shown under status config diagnostic headings. */
const formatStatusConfigDiagnosticEntries = (diagnostics) => [
	`- Config file is invalid: ${sanitizeTerminalText(diagnostics.path)}`,
	...formatConfigIssueLines(diagnostics.issues, "-", { normalizeRoot: true }),
	`- Fix: ${formatCliCommand("openclaw doctor --fix")}`
];
/** Formats a duration or returns `unknown` for missing/non-finite values. */
const formatDuration = (ms) => {
	if (ms == null || !Number.isFinite(ms)) return "unknown";
	return formatDurationPrecise(ms, { decimals: 1 });
};
/** Formats session token usage and prompt-cache hit rate for the sessions table. */
const formatTokensCompact = (sess) => {
	const used = sess.totalTokens;
	const ctx = sess.contextTokens;
	let result;
	if (used == null) result = ctx ? `unknown/${formatKTokens(ctx)} (?%)` : "unknown used";
	else if (!ctx) result = `${formatKTokens(used)} used`;
	else {
		const pctLabel = sess.percentUsed != null ? `${sess.percentUsed}%` : "?%";
		result = `${formatKTokens(used)}/${formatKTokens(ctx)} (${pctLabel})`;
	}
	const cacheStats = resolvePromptCacheStats(sess);
	if (cacheStats && cacheStats.cacheRead > 0) result += ` · 🗄️ ${cacheStats.hitRate}% cached`;
	return result;
};
/** Formats prompt-cache details for verbose sessions table output. */
const formatPromptCacheCompact = (sess) => {
	const cacheStats = resolvePromptCacheStats(sess);
	if (!cacheStats) return "";
	const parts = [`${cacheStats.hitRate}% hit`];
	if (cacheStats.cacheRead > 0) parts.push(`read ${formatKTokens(cacheStats.cacheRead)}`);
	if (cacheStats.cacheWrite > 0) parts.push(`write ${formatKTokens(cacheStats.cacheWrite)}`);
	return parts.join(" · ");
};
function resolvePromptCacheStats(sess) {
	const cacheRead = typeof sess.cacheRead === "number" && Number.isFinite(sess.cacheRead) && sess.cacheRead >= 0 ? sess.cacheRead : 0;
	const cacheWrite = typeof sess.cacheWrite === "number" && Number.isFinite(sess.cacheWrite) && sess.cacheWrite >= 0 ? sess.cacheWrite : 0;
	if (cacheRead <= 0 && cacheWrite <= 0) return null;
	const inputTokens = typeof sess.inputTokens === "number" && Number.isFinite(sess.inputTokens) && sess.inputTokens >= 0 ? sess.inputTokens : void 0;
	const promptTokensFromParts = inputTokens != null ? inputTokens + cacheRead + cacheWrite : void 0;
	const used = sess.totalTokens;
	const total = promptTokensFromParts ?? (typeof used === "number" && Number.isFinite(used) && used > 0 ? Math.max(used, cacheRead + cacheWrite) : cacheRead + cacheWrite);
	return {
		cacheRead,
		cacheWrite,
		hitRate: total > 0 ? Math.round(cacheRead / total * 100) : 0
	};
}
/** Formats daemon runtime status plus launchd/systemd details into one compact string. */
const formatDaemonRuntimeShort = (runtime) => {
	if (!runtime) return null;
	const details = [];
	const detail = runtime.detail?.replace(/\s+/g, " ").trim() || "";
	const noisyLaunchctlDetail = runtime.missingUnit === true && normalizeLowercaseStringOrEmpty(detail).includes("could not find service");
	if (detail && !noisyLaunchctlDetail) details.push(detail);
	const cgroupSummary = getSystemdCgroupHygieneSummary(runtime.systemd);
	if (cgroupSummary) details.push(cgroupSummary);
	return formatRuntimeStatusWithDetails({
		status: runtime.status,
		pid: runtime.pid,
		state: runtime.state,
		details
	});
};
//#endregion
export { formatStatusConfigDiagnosticEntries as a, formatPromptCacheCompact as i, formatDuration as n, formatTokensCompact as o, formatKTokens as r, formatDaemonRuntimeShort as t };
