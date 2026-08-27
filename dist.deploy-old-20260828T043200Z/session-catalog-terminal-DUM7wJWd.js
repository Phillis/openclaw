import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-D75E8106.js";
import { a as ClaudeCatalogParamsError, i as CLAUDE_TERMINAL_RESUME_COMMAND, o as isResumableClaudeSource } from "./session-catalog-shared-B8NbCO28.js";
import "./session-catalog-adoption-C3d_naEs.js";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-terminal.ts
function isClaudeCliAvailable(pathEnv = process.env.PATH ?? "") {
	return resolveClaudeTerminalExecutable({
		...process.env,
		PATH: pathEnv
	}) !== void 0;
}
function claudeNodeTerminalCapability(node) {
	const commands = node.invocableCommands ?? node.commands;
	return node.connected === true && commands?.includes("anthropic.claude.terminal.resume.v1") === true ? { canOpenTerminalClaude: true } : {};
}
function isLocalClaudeResumable(host, source) {
	return host.hostId === "gateway:local" && isResumableClaudeSource(source);
}
function canOpenClaudeTerminalSession(host, source, localCliAvailable) {
	return isResumableClaudeSource(source) && (host.hostId === "gateway:local" && localCliAvailable || host.canOpenTerminalClaude === true);
}
function terminalEligibility(host, source, localCliAvailable) {
	return {
		localResumable: isLocalClaudeResumable(host, source),
		canOpenTerminal: canOpenClaudeTerminalSession(host, source, localCliAvailable)
	};
}
async function startClaudeCatalogTerminal(params) {
	if (params.nodeId) throw new ClaudeCatalogParamsError("Paired-node Claude terminal start is unavailable; omit hostId to start on the gateway host");
	const resolution = resolveClaudeTerminalExecutable();
	if (!resolution) throw new ClaudeCatalogParamsError("Claude CLI is unavailable; install Claude Code or add claude to PATH, then restart the gateway");
	return {
		kind: "local",
		argv: [resolution.executable, ...params.initialMessage !== void 0 ? ["--", params.initialMessage] : []],
		cwd: params.cwd,
		...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
		title: "claude"
	};
}
async function openClaudeCatalogTerminal(params) {
	const title = `claude --resume ${params.threadId.slice(0, 8)}…`;
	if (params.hostId === "gateway:local") {
		const record = (await params.listClaudeSessions()).find((candidate) => candidate.threadId === params.threadId);
		if (!record || !isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("Claude session is unavailable");
		if (!(await fs.stat(record.filePath).catch(() => void 0))?.isFile()) throw new ClaudeCatalogParamsError("Claude session transcript is unavailable");
		const resolution = resolveClaudeTerminalExecutable();
		if (!resolution) throw new ClaudeCatalogParamsError("Claude CLI is unavailable");
		return {
			kind: "local",
			argv: [
				resolution.executable,
				"--resume",
				params.threadId
			],
			...record.cwd ? { cwd: record.cwd } : {},
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!params.hostId.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	if (!(await params.api.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes("anthropic.claude.sessions.list.v1") === true && commands.includes("anthropic.claude.terminal.resume.v1");
	})) throw new ClaudeCatalogParamsError("paired-node Claude terminal is unavailable");
	const record = await params.resolveNodeClaudeRecord({
		runtime: params.api.runtime,
		nodeId,
		threadId: params.threadId
	});
	if (!isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("Claude session cannot be resumed in a terminal");
	return {
		kind: "node",
		nodeId,
		command: CLAUDE_TERMINAL_RESUME_COMMAND,
		paramsJSON: JSON.stringify({ threadId: params.threadId }),
		...record.cwd ? { cwd: record.cwd } : {},
		title
	};
}
//#endregion
export { terminalEligibility as a, startClaudeCatalogTerminal as i, isClaudeCliAvailable as n, openClaudeCatalogTerminal as r, claudeNodeTerminalCapability as t };
