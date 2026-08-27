import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, n as hasAgentRosterProperty, s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { c as classifySessionKeyShape } from "./session-key-D8GLfPr_.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { t as redactIdentifier } from "./redact-identifier-D3LO__f0.js";
import { t as sanitizeForPromptLiteral } from "./sanitize-for-prompt-Bz_9VqrX.js";
//#region src/agents/workspace-run.ts
const RUN_WORKSPACE_ROSTER_REQUIRED_ERROR_CODE = "RUN_WORKSPACE_ROSTER_REQUIRED";
var RunWorkspaceRosterRequiredError = class extends Error {
	constructor() {
		super("No agents configured; run workspace resolution requires an explicit roster.");
		this.code = RUN_WORKSPACE_ROSTER_REQUIRED_ERROR_CODE;
		this.name = "RunWorkspaceRosterRequiredError";
	}
};
var RunWorkspaceAgentNotConfiguredError = class extends Error {
	constructor(agentId) {
		super(`Agent ${agentId} is not present in the configured roster.`);
		this.code = "RUN_WORKSPACE_AGENT_NOT_CONFIGURED";
		this.name = "RunWorkspaceAgentNotConfiguredError";
		this.agentId = agentId;
	}
};
function resolveRunAgentId(params) {
	const rawSessionKey = params.sessionKey?.trim() ?? "";
	if (classifySessionKeyShape(rawSessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing workspace resolution.");
	const explicit = typeof params.agentId === "string" && params.agentId.trim() ? normalizeAgentId(params.agentId) : void 0;
	const parsed = parseAgentSessionKey(rawSessionKey);
	return {
		agentId: resolveSessionAgentId({
			sessionKey: rawSessionKey || void 0,
			agentId: explicit,
			config: params.config
		}),
		agentIdSource: explicit ? "explicit" : parsed?.agentId ? "session_key" : "default"
	};
}
/** Redacts a run/session identifier for logs and prompts. */
function redactRunIdentifier(value) {
	return redactIdentifier(value, { len: 12 });
}
/** Resolves the workspace directory used for an agent run. */
function resolveRunWorkspaceDir(params) {
	if (classifySessionKeyShape(params.sessionKey?.trim() ?? "") === "malformed_agent") throw new Error("Malformed agent session key; refusing workspace resolution.");
	const config = params.config;
	if (!config || !hasAgentRosterProperty(config)) throw new RunWorkspaceRosterRequiredError();
	const env = params.env ?? process.env;
	const requested = params.workspaceDir;
	const { agentId, agentIdSource } = resolveRunAgentId({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config
	});
	if (!resolveAgentConfig(config, agentId)) throw new RunWorkspaceAgentNotConfiguredError(agentId);
	if (typeof requested === "string") {
		const trimmed = requested.trim();
		if (trimmed) {
			const sanitized = sanitizeForPromptLiteral(trimmed);
			if (sanitized !== trimmed) logWarn("Control/format characters stripped from workspaceDir (OC-19 hardening).");
			const workspaceDir = resolveUserPath(sanitized, env);
			return {
				workspaceDir,
				isCanonicalWorkspace: workspaceDir === resolveUserPath(resolveAgentWorkspaceDir(config, agentId, env), env),
				usedFallback: false,
				agentId,
				agentIdSource
			};
		}
	}
	const fallbackReason = requested == null ? "missing" : typeof requested === "string" ? "blank" : "invalid_type";
	const fallbackWorkspace = resolveAgentWorkspaceDir(config, agentId, env);
	const sanitizedFallback = sanitizeForPromptLiteral(fallbackWorkspace);
	if (sanitizedFallback !== fallbackWorkspace) logWarn("Control/format characters stripped from fallback workspaceDir (OC-19 hardening).");
	return {
		workspaceDir: resolveUserPath(sanitizedFallback, env),
		isCanonicalWorkspace: true,
		usedFallback: true,
		fallbackReason,
		agentId,
		agentIdSource
	};
}
//#endregion
export { resolveRunWorkspaceDir as n, redactRunIdentifier as t };
