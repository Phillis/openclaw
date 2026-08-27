import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { n as resolvePluginVersionDriftUpdateCommand } from "./plugin-version-drift-t_3RVhFg.js";
import { O as listTasksForFlowId, Y as listTaskFlowRecords } from "./task-registry-CV6EhTBX.js";
import "./runtime-internal-CbPNKBWW.js";
import { t as note } from "./note-D7f3pYFE.js";
import { i as buildPluginCompatibilityWarnings } from "./status-Dlx02Gb7.js";
import { t as buildPluginRegistrySnapshotReport } from "./status-snapshot-BHu5PcKv.js";
//#region src/commands/doctor-workspace-status.ts
/** Doctor status summary for workspace skills, plugins, and task-flow recovery hints. */
const WORKSPACE_STATUS_CHECK_ID = "core/doctor/workspace-status";
function collectTaskFlowRecoveryFindings() {
	return listTaskFlowRecords().flatMap((flow) => {
		const tasks = listTasksForFlowId(flow.flowId);
		const findings = [];
		if (flow.syncMode === "managed" && flow.status === "running" && tasks.length === 0 && flow.waitJson === void 0) findings.push({
			flowId: flow.flowId,
			message: `${flow.flowId}: running managed TaskFlow has no linked tasks or wait state; inspect or cancel it manually.`
		});
		if (flow.endedAt == null && flow.status === "blocked" && flow.blockedTaskId && !tasks.some((task) => task.taskId === flow.blockedTaskId)) findings.push({
			flowId: flow.flowId,
			message: `${flow.flowId}: blocked TaskFlow points at missing task ${flow.blockedTaskId}; inspect before retrying.`
		});
		return findings;
	});
}
function noteFlowRecoveryHints() {
	const suspicious = collectTaskFlowRecoveryFindings();
	if (suspicious.length === 0) return;
	note([
		...suspicious.slice(0, 5).map((finding) => finding.message),
		suspicious.length > 5 ? `...and ${suspicious.length - 5} more.` : null,
		`Inspect: ${formatCliCommand("openclaw tasks flow show <flow-id>")}`,
		`Cancel: ${formatCliCommand("openclaw tasks flow cancel <flow-id>")}`
	].filter((line) => Boolean(line)).join("\n"), "TaskFlow recovery");
}
function pluginVersionDriftToHealthFindings(drift) {
	if (!drift || drift.drifts.length === 0) return [];
	return drift.drifts.map((entry) => {
		const updateCommand = formatCliCommand(resolvePluginVersionDriftUpdateCommand(entry));
		return {
			checkId: WORKSPACE_STATUS_CHECK_ID,
			severity: "warning",
			message: `Plugin ${entry.pluginId} is ${entry.installedVersion}, but the Gateway is ${drift.gatewayVersion}.`,
			path: `plugins.entries.${entry.pluginId}`,
			target: entry.pluginId,
			requirement: "plugin-version-drift",
			fixHint: `${updateCommand} && ${formatCliCommand("openclaw gateway restart")}`
		};
	});
}
function pluginCompatibilityWarningToHealthFinding(message) {
	return {
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: "warning",
		message,
		path: "plugins",
		requirement: "plugin-compatibility",
		fixHint: "Update or replace the plugin so it no longer depends on legacy compatibility paths."
	};
}
function pluginDiagnosticToHealthFinding(diagnostic, message = diagnostic.message) {
	return {
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: diagnostic.level === "error" ? "error" : "warning",
		message,
		...diagnostic.pluginId ? { path: `plugins.entries.${diagnostic.pluginId}` } : {},
		...diagnostic.pluginId ? { target: diagnostic.pluginId } : {},
		...diagnostic.source ? { source: diagnostic.source } : {},
		...diagnostic.code ? { requirement: diagnostic.code } : { requirement: "plugin-diagnostic" }
	};
}
function taskFlowRecoveryToHealthFinding(finding) {
	return {
		checkId: WORKSPACE_STATUS_CHECK_ID,
		severity: "warning",
		message: finding.message,
		path: "tasks.flows",
		target: finding.flowId,
		requirement: "taskflow-recovery",
		fixHint: [formatCliCommand(`openclaw tasks flow show ${finding.flowId}`), formatCliCommand(`openclaw tasks flow cancel ${finding.flowId}`)].join(" or ")
	};
}
function collectWorkspaceStatusHealthFindings(cfg, options = {}) {
	const agentIds = listAgentIds(cfg);
	const scopes = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
	const workspaceFindings = [];
	for (const { agentId, workspaceDir } of scopes) {
		const collectForWorkspace = () => {
			const findings = [];
			const prefix = agentIds.length > 1 ? `Agent "${agentId}": ` : "";
			const pluginRegistry = buildPluginRegistrySnapshotReport({
				config: cfg,
				workspaceDir
			});
			const compatibilityWarnings = buildPluginCompatibilityWarnings({
				config: cfg,
				workspaceDir,
				report: pluginRegistry
			});
			for (const message of compatibilityWarnings) findings.push(pluginCompatibilityWarningToHealthFinding(`${prefix}${message}`));
			for (const diagnostic of pluginRegistry.diagnostics) findings.push(pluginDiagnosticToHealthFinding(diagnostic, `${prefix}${diagnostic.message}`));
			return findings;
		};
		workspaceFindings.push(...options.runWithPluginMetadataSnapshot ? options.runWithPluginMetadataSnapshot({
			config: cfg,
			workspaceDir
		}, collectForWorkspace) : collectForWorkspace());
	}
	return [
		...pluginVersionDriftToHealthFindings(options.pluginVersionDrift),
		...workspaceFindings,
		...collectTaskFlowRecoveryFindings().map(taskFlowRecoveryToHealthFinding)
	];
}
function notePluginVersionDrift(drift) {
	if (!drift || drift.drifts.length === 0) return;
	const singleDrift = drift.drifts.length === 1 ? drift.drifts[0] : void 0;
	const updateCommands = drift.drifts.map((entry) => formatCliCommand(resolvePluginVersionDriftUpdateCommand(entry)));
	note([
		`${drift.drifts.length} active official plugin${drift.drifts.length === 1 ? "" : "s"} not on OpenClaw ${drift.gatewayVersion}`,
		...drift.drifts.map((entry) => {
			const sourceLabel = entry.source === "clawhub" ? "clawhub" : "npm";
			return `- ${entry.pluginId}: ${entry.installedVersion} (${sourceLabel}) -> expected ${drift.gatewayVersion}`;
		}),
		singleDrift ? `Fix: ${updateCommands[0]} && ${formatCliCommand("openclaw gateway restart")}.` : [
			"Fix each drifted plugin:",
			...updateCommands.map((command) => `- ${command}`),
			`Then run ${formatCliCommand("openclaw gateway restart")}.`
		].join("\n")
	].join("\n"), "Plugin version drift");
}
/** Emits plugin and TaskFlow recovery problem notes for doctor. */
function noteWorkspaceStatus(cfg, options = {}) {
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const agentIds = listAgentIds(cfg);
	const scopes = agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	}));
	for (const { agentId, workspaceDir } of scopes) {
		const noteForWorkspace = () => {
			const prefix = agentIds.length > 1 ? `Agent "${agentId}":\n` : "";
			const pluginRegistry = buildPluginRegistrySnapshotReport({
				config: cfg,
				workspaceDir
			});
			const errored = pluginRegistry.plugins.filter((plugin) => plugin.status === "error").toSorted((a, b) => a.id.localeCompare(b.id));
			if (errored.length > 0) note([`${prefix}Errors: ${errored.length}`, `- ${errored.slice(0, 10).map((plugin) => plugin.id).join("\n- ")}${errored.length > 10 ? "\n- ..." : ""}`].join("\n"), "Plugins");
			const compatibilityWarnings = buildPluginCompatibilityWarnings({
				config: cfg,
				workspaceDir,
				report: pluginRegistry
			});
			if (compatibilityWarnings.length > 0) note(`${prefix}${compatibilityWarnings.map((line) => `- ${line}`).join("\n")}`, "Plugin compatibility");
			if (pluginRegistry.diagnostics.length > 0) note(`${prefix}${pluginRegistry.diagnostics.map((diag) => {
				const level = diag.level.toUpperCase();
				const plugin = diag.pluginId ? ` ${diag.pluginId}` : "";
				const source = diag.source ? ` (${diag.source})` : "";
				return `- ${level}${plugin}: ${diag.message}${source}`;
			}).join("\n")}`, "Plugin diagnostics");
		};
		if (options.runWithPluginMetadataSnapshot) options.runWithPluginMetadataSnapshot({
			config: cfg,
			workspaceDir
		}, noteForWorkspace);
		else noteForWorkspace();
	}
	notePluginVersionDrift(options.pluginVersionDrift);
	noteFlowRecoveryHints();
	return { workspaceDir: scopes.find((scope) => scope.agentId === defaultAgentId)?.workspaceDir ?? scopes[0]?.workspaceDir };
}
//#endregion
export { collectWorkspaceStatusHealthFindings, noteWorkspaceStatus };
