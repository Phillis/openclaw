import { r as isGatewayTransportError } from "./transport-error-D_LRKgla.js";
import { s as visibleWidth } from "./ansi-DjDeieuH.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./config-B2bSneS2.js";
import { o as callGateway } from "./call-Bwn2P4nz.js";
import "./message-channel-BZwx7FCw.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import "./sessions-CdrF1uzY.js";
import { i as serializeSessionCleanupResult, n as resolveSessionCleanupAction, r as runSessionsCleanup } from "./cleanup-service-A4G1gsQQ.js";
import { n as resolveSessionStoreTargetsOrExit } from "./session-store-targets-B_hJCSjQ.js";
import { c as resolveSessionDisplayModel, i as formatSessionModelCell, n as formatSessionFlagsCell, o as toSessionDisplayRows, r as formatSessionKeyCell, t as formatSessionAgeCell } from "./sessions-table-Cz89XsNx.js";
//#region src/commands/sessions-cleanup.ts
/**
* Session cleanup command.
*
* It can delegate cleanup to a live gateway or run local store maintenance,
* with dry-run tables that explain every planned pruning action.
*/
const ACTION_PAD = 17;
function formatCleanupActionCell(action, rich) {
	const label = action.padEnd(ACTION_PAD);
	if (!rich) return label;
	if (action === "keep") return theme.muted(label);
	if (action === "archive-dashboard") return theme.warn(label);
	if (action === "prune-missing") return theme.error(label);
	if (action === "prune-model-run") return theme.warn(label);
	if (action === "prune-stale") return theme.warn(label);
	if (action === "retire-dm-scope") return theme.warn(label);
	if (action === "cap-overflow") return theme.accentBright(label);
	return theme.error(label);
}
function buildActionRows(params) {
	return toSessionDisplayRows(params.beforeStore).map((row) => Object.assign({}, row, {
		label: params.beforeStore[row.key]?.label,
		action: resolveSessionCleanupAction({
			key: row.key,
			missingKeys: params.missingKeys,
			modelRunPrunedKeys: params.modelRunPrunedKeys,
			archivedKeys: params.archivedKeys,
			staleKeys: params.staleKeys,
			cappedKeys: params.cappedKeys,
			dmScopeRetiredKeys: params.dmScopeRetiredKeys
		})
	}));
}
function buildLabelSummaries(actionRows) {
	const summaryByLabel = /* @__PURE__ */ new Map();
	for (const actionRow of actionRows) {
		const label = sanitizeTerminalText(typeof actionRow.label === "string" ? actionRow.label.trim() : "") || "(unlabeled)";
		let summary = summaryByLabel.get(label);
		if (!summary) {
			summary = {
				label,
				kept: 0,
				pruned: 0
			};
			summaryByLabel.set(label, summary);
		}
		if (actionRow.action === "keep" || actionRow.action === "archive-dashboard") summary.kept += 1;
		else summary.pruned += 1;
	}
	return [...summaryByLabel.values()].toSorted((a, b) => a.label.localeCompare(b.label));
}
function renderLabelSummaries(params) {
	const summaries = buildLabelSummaries(params.actionRows);
	if (summaries.length === 0) return;
	const labelPad = Math.max(...summaries.map((summary) => visibleWidth(summary.label)));
	const totalKept = summaries.reduce((total, summary) => total + summary.kept, 0);
	const totalPruned = summaries.reduce((total, summary) => total + summary.pruned, 0);
	params.runtime.log("");
	params.runtime.log("Summary by Label:");
	for (const summary of summaries) {
		const remaining = labelPad - visibleWidth(summary.label);
		const paddedLabel = remaining > 0 ? `${summary.label}${" ".repeat(remaining)}` : summary.label;
		params.runtime.log(`${paddedLabel}  ${summary.kept} kept, ${summary.pruned} pruned`);
	}
	params.runtime.log(`Total: ${totalKept} kept, ${totalPruned} pruned`);
}
function toDisplayedCleanupSummary(summary) {
	return {
		...summary,
		storePath: resolveSqliteTargetFromSessionStorePath(summary.storePath, { agentId: summary.agentId }).path
	};
}
function renderStoreDryRunPlan(params) {
	const rich = isRich();
	const displaySummary = toDisplayedCleanupSummary(params.summary);
	if (params.showAgentHeader) params.runtime.log(`Agent: ${params.summary.agentId}`);
	params.runtime.log(`Session store: ${displaySummary.storePath}`);
	params.runtime.log(`Maintenance mode: ${params.summary.mode}`);
	params.runtime.log(`Entries: ${params.summary.beforeCount} -> ${params.summary.afterCount} (remove ${params.summary.beforeCount - params.summary.afterCount})`);
	params.runtime.log(`Would prune missing transcripts: ${params.summary.missing}`);
	params.runtime.log(`Would retire stale direct DM sessions: ${params.summary.dmScopeRetired}`);
	params.runtime.log(`Would prune stale model-run probes: ${params.summary.modelRunPruned}`);
	params.runtime.log(`Would archive inactive dashboard sessions: ${params.summary.archived ?? 0}`);
	params.runtime.log(`Would prune stale: ${params.summary.pruned}`);
	params.runtime.log(`Would cap overflow: ${params.summary.capped}`);
	if (params.summary.unreferencedArtifacts?.scannedFiles) params.runtime.log(`Would prune unreferenced artifacts: ${params.summary.unreferencedArtifacts.removedFiles}`);
	if (params.summary.diskBudget) params.runtime.log(`Would enforce disk budget: ${params.summary.diskBudget.totalBytesBefore} -> ${params.summary.diskBudget.totalBytesAfter} bytes (files ${params.summary.diskBudget.removedFiles}, entries ${params.summary.diskBudget.removedEntries})`);
	if (params.actionRows.length === 0) return;
	params.runtime.log("");
	params.runtime.log("Planned session actions:");
	const header = [
		"Action".padEnd(ACTION_PAD),
		"Key".padEnd(26),
		"Age".padEnd(9),
		"Model".padEnd(14),
		"Flags"
	].join(" ");
	params.runtime.log(rich ? theme.heading(header) : header);
	for (const actionRow of params.actionRows) {
		const model = resolveSessionDisplayModel(params.cfg, actionRow);
		const line = [
			formatCleanupActionCell(actionRow.action, rich),
			formatSessionKeyCell(actionRow.key, rich),
			formatSessionAgeCell(actionRow.updatedAt, rich),
			formatSessionModelCell(model, rich),
			formatSessionFlagsCell(actionRow, rich)
		].join(" ");
		params.runtime.log(line.trimEnd());
	}
	renderLabelSummaries({
		actionRows: params.actionRows,
		runtime: params.runtime
	});
}
function renderAppliedSummaries(params) {
	for (let i = 0; i < params.summaries.length; i += 1) {
		const summary = params.summaries[i];
		if (!summary) continue;
		if (i > 0) params.runtime.log("");
		if (params.summaries.length > 1) params.runtime.log(`Agent: ${summary.agentId}`);
		const storePath = params.locallyOwned ? toDisplayedCleanupSummary(summary).storePath : summary.storePath;
		params.runtime.log(`Session store: ${storePath}`);
		params.runtime.log(`Applied maintenance. Current entries: ${summary.appliedCount ?? 0}`);
		if (summary.unreferencedArtifacts?.removedFiles) params.runtime.log(`Pruned unreferenced artifacts: ${summary.unreferencedArtifacts.removedFiles}`);
	}
}
async function maybeRunGatewayCleanup(opts) {
	if (opts.store || opts.dryRun) return { delegated: false };
	try {
		return {
			delegated: true,
			result: await callGateway({
				method: "sessions.cleanup",
				params: {
					agent: opts.agent,
					allAgents: opts.allAgents,
					enforce: opts.enforce,
					activeKey: opts.activeKey,
					fixMissing: opts.fixMissing,
					fixDmScope: opts.fixDmScope
				},
				mode: GATEWAY_CLIENT_MODES.CLI,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				requiredMethods: ["sessions.cleanup"]
			})
		};
	} catch (error) {
		if (isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0) return { delegated: false };
		throw error;
	}
}
/** Runs session cleanup, optionally using the live gateway for active stores. */
async function sessionsCleanupCommand(opts, runtime) {
	const gatewayCleanup = await maybeRunGatewayCleanup(opts);
	if (gatewayCleanup.delegated) {
		if (opts.json) {
			writeRuntimeJson(runtime, gatewayCleanup.result);
			return;
		}
		renderAppliedSummaries({
			summaries: "stores" in gatewayCleanup.result ? gatewayCleanup.result.stores : [gatewayCleanup.result],
			runtime,
			locallyOwned: false
		});
		return;
	}
	const cfg = getRuntimeConfig();
	const targets = resolveSessionStoreTargetsOrExit({
		cfg,
		opts: {
			store: opts.store,
			agent: opts.agent,
			allAgents: opts.allAgents
		},
		runtime,
		json: opts.json
	});
	if (!targets) return;
	const cleanupParams = {
		cfg,
		opts,
		targets
	};
	let cleanupResult;
	if (opts.dryRun) cleanupResult = await runSessionsCleanup(cleanupParams);
	else {
		const { runLocalSessionsCleanup } = await import("./sessions-cleanup.runtime.js");
		cleanupResult = await runLocalSessionsCleanup(cleanupParams, runtime);
	}
	const { mode, previewResults, appliedSummaries } = cleanupResult;
	if (opts.dryRun) {
		if (opts.json) {
			writeRuntimeJson(runtime, serializeSessionCleanupResult({
				mode,
				dryRun: true,
				summaries: previewResults.map((result) => toDisplayedCleanupSummary(result.summary))
			}));
			return;
		}
		for (const [i, result] of previewResults.entries()) {
			if (i > 0) runtime.log("");
			renderStoreDryRunPlan({
				cfg,
				summary: result.summary,
				actionRows: buildActionRows(result),
				runtime,
				showAgentHeader: previewResults.length > 1
			});
		}
		return;
	}
	if (opts.json) {
		writeRuntimeJson(runtime, serializeSessionCleanupResult({
			mode,
			dryRun: false,
			summaries: appliedSummaries.map(toDisplayedCleanupSummary)
		}));
		return;
	}
	renderAppliedSummaries({
		summaries: appliedSummaries,
		runtime,
		locallyOwned: true
	});
}
//#endregion
export { sessionsCleanupCommand };
