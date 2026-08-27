import { _ as resolvePrimaryStringValue, c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { a as resolveExecutablePath } from "./executable-path-D05F-hRH.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-CttHagpC.js";
import { k as CLAUDE_CLI_PROFILE_ID } from "./persisted-tYYP9V51.js";
import { o as readClaudeCliCredentialsCached } from "./external-cli-sync-CU9M9_mw.js";
import { r as ensureAuthProfileStore } from "./store-BH6qiWJF.js";
import "./paths-DJDG1Jtw.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Ap-awZem.js";
import { n as resolveCliBackendVersionGuidance, t as formatCliBackendVersionAdvisory } from "./cli-backend-version-support-BjNlmQo6.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-BV_rCsok.js";
import { t as note } from "./note-D7f3pYFE.js";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-DiF48Ewp.js";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-claude-cli.ts
/** Doctor health note for Claude CLI binary, auth, and workspace/project directories. */
const CLAUDE_CLI_PROVIDER = "claude-cli";
function usesClaudeCliModelSelection(cfg) {
	if (normalizeOptionalLowercaseString(resolvePrimaryStringValue(cfg.agents?.defaults?.model))?.startsWith(`${CLAUDE_CLI_PROVIDER}/`)) return true;
	return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) => normalizeOptionalLowercaseString(key)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`));
}
function resolveCommandVersion(commandPath, args, env) {
	const result = spawnSync(commandPath, [...args], {
		encoding: "utf8",
		env,
		maxBuffer: 16 * 1024,
		timeout: 1500,
		windowsHide: true
	});
	return `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim().split(/\r?\n/u)[0]?.trim() || void 0;
}
function probeDirectoryHealth(dirPath) {
	try {
		if (!fs.statSync(dirPath).isDirectory()) return "not_directory";
	} catch {
		return "missing";
	}
	try {
		fs.accessSync(dirPath, fs.constants.R_OK);
	} catch {
		return "unreadable";
	}
	try {
		fs.accessSync(dirPath, fs.constants.W_OK);
	} catch {
		return "readonly";
	}
	return "present";
}
function formatWorkspaceProblemLine(workspaceDir, health, agentId) {
	const label = agentId ? `Agent ${agentId} workspace` : "Workspace";
	const display = shortenHomePath(workspaceDir);
	if (health === "present" || health === "missing") return null;
	if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
	if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
	return `- ${label}: ${display} is not writable by this user.`;
}
function formatProjectDirProblemLine(projectDir, health, agentId) {
	const label = agentId ? `Agent ${agentId} Claude project dir` : "Claude project dir";
	const display = shortenHomePath(projectDir);
	if (health === "present" || health === "missing") return null;
	if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
	if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
	return `- ${label}: ${display} is not writable by this user.`;
}
function resolveClaudeCliAgentIds(cfg) {
	const runtimeAgentIds = listAgentIds(cfg).filter((agentId) => resolveModelAgentRuntimeMetadata({
		cfg,
		agentId
	}).id === CLAUDE_CLI_PROVIDER);
	if (runtimeAgentIds.length > 0) return runtimeAgentIds;
	if (usesClaudeCliModelSelection(cfg)) {
		const defaultAgentId = tryResolveDefaultAgentId(cfg);
		return defaultAgentId ? [defaultAgentId] : [];
	}
	return [];
}
function resolveClaudeCliWorkspaceTargets(params) {
	const agentIds = resolveClaudeCliAgentIds(params.cfg);
	const defaultAgentId = tryResolveDefaultAgentId(params.cfg);
	const seen = /* @__PURE__ */ new Set();
	return agentIds.filter((agentId) => {
		if (seen.has(agentId)) return false;
		seen.add(agentId);
		return true;
	}).map((agentId) => {
		const workspaceDir = params.workspaceDir && agentIds.length === 1 && agentId === defaultAgentId ? params.workspaceDir : resolveAgentWorkspaceDir(params.cfg, agentId, params.env);
		const projectDir = resolveClaudeCliProjectDirForWorkspace({
			workspaceDir,
			homeDir: params.homeDir
		});
		return {
			agentId,
			workspaceDir,
			projectDir,
			workspaceHealth: probeDirectoryHealth(workspaceDir),
			projectDirHealth: probeDirectoryHealth(projectDir)
		};
	});
}
/**
* Emits Claude CLI health diagnostics for every agent currently routed through the CLI backend.
*
* The optional deps let tests inject auth stores, PATH resolution, and workspace roots without
* touching the user's real Claude credentials or filesystem.
*/
function noteClaudeCliHealth(cfg, deps) {
	const env = deps?.env ?? process.env;
	const workspaceTargets = resolveClaudeCliWorkspaceTargets({
		cfg,
		env,
		homeDir: deps?.homeDir,
		workspaceDir: deps?.workspaceDir
	});
	if (workspaceTargets.length === 0) return;
	const store = deps?.store ?? ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	const credential = (deps?.readClaudeCliCredentials ?? (() => readClaudeCliCredentialsCached({ allowKeychainPrompt: false })))();
	const backend = resolveCliBackendConfig(CLAUDE_CLI_PROVIDER, cfg);
	const command = backend?.config.command ?? "claude";
	const commandPath = (deps?.resolveCommandPath ?? ((rawCommand, nextEnv) => resolveExecutablePath(rawCommand, { env: nextEnv })))(command, env);
	const authStorePath = resolveAuthStorePathForDisplay();
	const storedProfile = store.profiles[CLAUDE_CLI_PROFILE_ID];
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const showAgentLabels = workspaceTargets.length > 1 || workspaceTargets.some((target) => target.agentId !== defaultAgentId);
	const lines = [];
	const fixHints = [];
	if (!commandPath) {
		lines.push(`- Binary: command "${command}" was not found on PATH.`);
		fixHints.push("- Fix: install Claude CLI on PATH for the gateway user; custom executable paths belong in a CLI backend plugin registration.");
	}
	const liveSessionRequirement = backend?.liveSessionRequirement;
	if (commandPath && liveSessionRequirement) {
		const guidance = resolveCliBackendVersionGuidance((deps?.resolveCommandVersion ?? resolveCommandVersion)(commandPath, liveSessionRequirement.versionArgs, env), liveSessionRequirement);
		if (guidance.status === "below-known-floor") lines.push(`- Binary version advisory: ${formatCliBackendVersionAdvisory({
			label: "Claude Code",
			requirement: liveSessionRequirement,
			version: guidance.version
		})}`);
	}
	if (!credential) {
		lines.push("- Headless Claude auth: unavailable without interactive prompting.");
		fixHints.push(`- Fix: run ${formatCliCommand("claude auth login")}, then ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`);
	}
	if (!storedProfile && credential?.type !== "api_key_helper") {
		lines.push(`- OpenClaw auth profile: missing (${CLAUDE_CLI_PROFILE_ID}) in ${authStorePath}.`);
		fixHints.push(`- Fix: run ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`);
	} else if (storedProfile && storedProfile.provider !== CLAUDE_CLI_PROVIDER) {
		lines.push(`- OpenClaw auth profile: ${CLAUDE_CLI_PROFILE_ID} is wired to provider "${storedProfile.provider}" instead of "${CLAUDE_CLI_PROVIDER}".`);
		fixHints.push(`- Fix: rerun ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")} to rewrite the profile cleanly.`);
	}
	for (const target of workspaceTargets) {
		const agentLabel = showAgentLabels ? target.agentId : void 0;
		const workspaceProblem = formatWorkspaceProblemLine(target.workspaceDir, target.workspaceHealth, agentLabel);
		if (workspaceProblem) lines.push(workspaceProblem);
		if (target.workspaceHealth === "readonly" || target.workspaceHealth === "unreadable" || target.workspaceHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s workspace` : "the workspace"} a readable, writable directory for the gateway user.`);
		const projectDirProblem = formatProjectDirProblemLine(target.projectDir, target.projectDirHealth, agentLabel);
		if (projectDirProblem) lines.push(projectDirProblem);
		if (target.projectDirHealth === "unreadable" || target.projectDirHealth === "not_directory") fixHints.push(`- Fix: make ${agentLabel ? `agent ${agentLabel}'s Claude project dir` : "the Claude project dir"} readable, or remove the broken path and let Claude recreate it.`);
	}
	if (lines.length > 0 && workspaceTargets.length > 1) lines.push(`- Agents using Claude CLI: ${workspaceTargets.map((target) => target.agentId).toSorted((a, b) => a.localeCompare(b)).join(", ")}.`);
	if (lines.length === 0 && fixHints.length === 0) return;
	if (fixHints.length > 0) lines.push(...fixHints);
	(deps?.noteFn ?? note)(lines.join("\n"), "Claude CLI");
}
//#endregion
export { noteClaudeCliHealth };
