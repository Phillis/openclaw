import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { i as resolveBootstrapTotalMaxChars, r as resolveBootstrapMaxChars } from "./bootstrap-C3qVpLY-.js";
import "./embedded-agent-helpers-kQU3aKSw.js";
import { i as buildBootstrapInjectionStats, t as analyzeBootstrapBudget } from "./bootstrap-budget-BjndRqg9.js";
import { a as resolveBootstrapContextForRun } from "./bootstrap-files-DQdZlI4U.js";
import { t as note } from "./note-D7f3pYFE.js";
//#region src/commands/doctor-bootstrap-size.ts
/** Doctor note for workspace bootstrap file size and truncation risk. */
function formatInt(value) {
	return new Intl.NumberFormat("en-US").format(Math.max(0, Math.floor(value)));
}
function formatPercent(numerator, denominator) {
	if (!Number.isFinite(denominator) || denominator <= 0) return "0%";
	return `${Math.min(100, Math.max(0, Math.round(numerator / denominator * 100)))}%`;
}
function formatCauses(causes) {
	if (causes.length === 0) return "unknown";
	return causes.map((cause) => cause === "per-file-limit" ? "max/file" : "max/total").join(", ");
}
/**
* Analyzes configured bootstrap files and emits warnings when injection will truncate content.
*
* Returns the raw budget analysis for tests and callers that need structured evidence.
*/
async function noteBootstrapFileSize(cfg) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const agentIds = listAgentIds(cfg);
	const workspaces = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
	let defaultAnalysis;
	for (const { agentId, workspaceDir } of workspaces) {
		const bootstrapMaxChars = resolveBootstrapMaxChars(cfg, agentId);
		const bootstrapTotalMaxChars = resolveBootstrapTotalMaxChars(cfg, agentId);
		const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForRun({
			workspaceDir,
			config: cfg,
			agentId
		});
		const analysis = analyzeBootstrapBudget({
			files: buildBootstrapInjectionStats({
				bootstrapFiles,
				injectedFiles: contextFiles
			}),
			bootstrapMaxChars,
			bootstrapTotalMaxChars
		});
		if (agentId === defaultAgentId) defaultAnalysis = analysis;
		if (!analysis.hasTruncation && analysis.nearLimitFiles.length === 0 && !analysis.totalNearLimit) continue;
		const lines = agentIds.length > 1 ? [`Agent "${agentId}":`] : [];
		if (analysis.hasTruncation) {
			lines.push("Workspace bootstrap files exceed limits and will be truncated:");
			for (const file of analysis.truncatedFiles) {
				const truncatedChars = Math.max(0, file.rawChars - file.injectedChars);
				lines.push(`- ${file.name}: ${formatInt(file.rawChars)} raw / ${formatInt(file.injectedChars)} injected (${formatPercent(truncatedChars, file.rawChars)} truncated; ${formatCauses(file.causes)})`);
			}
		} else lines.push("Workspace bootstrap files are near configured limits:");
		const nonTruncatedNearLimit = analysis.nearLimitFiles.filter((file) => !file.truncated);
		if (nonTruncatedNearLimit.length > 0) for (const file of nonTruncatedNearLimit) lines.push(`- ${file.name}: ${formatInt(file.rawChars)} chars (${formatPercent(file.rawChars, bootstrapMaxChars)} of max/file ${formatInt(bootstrapMaxChars)})`);
		lines.push(`Total bootstrap injected chars: ${formatInt(analysis.totals.injectedChars)} (${formatPercent(analysis.totals.injectedChars, bootstrapTotalMaxChars)} of max/total ${formatInt(bootstrapTotalMaxChars)}).`);
		lines.push(`Total bootstrap raw chars (before truncation): ${formatInt(analysis.totals.rawChars)}.`);
		const needsPerFileTip = analysis.truncatedFiles.some((file) => file.causes.includes("per-file-limit")) || analysis.nearLimitFiles.length > 0;
		const needsTotalTip = analysis.truncatedFiles.some((file) => file.causes.includes("total-limit")) || analysis.totalNearLimit;
		if (needsPerFileTip || needsTotalTip) lines.push("");
		if (needsPerFileTip) lines.push("- Tip: tune `agents.entries.*.bootstrapMaxChars` for this agent, or `agents.defaults.bootstrapMaxChars` as fallback, for per-file limits.");
		if (needsTotalTip) lines.push("- Tip: tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback, for total-budget limits.");
		note(lines.join("\n"), "Bootstrap file size");
	}
	return defaultAnalysis;
}
//#endregion
export { noteBootstrapFileSize };
