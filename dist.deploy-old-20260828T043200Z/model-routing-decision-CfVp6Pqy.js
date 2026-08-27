import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, n as hasAgentRosterProperty, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { c as classifySessionKeyShape } from "./session-key-Dbce_H9p.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { t as redactIdentifier } from "./redact-identifier-BRudYwZN.js";
import { s as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-KQIZywud.js";
import { i as recordExecutionDecisionWork } from "./execution-decision-work-C829f_qO.js";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-C5q9LjmF.js";
import { randomUUID } from "node:crypto";
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
//#region src/agents/model-routing-decision.ts
/** Receipt-grade facts for one model route that reached exact run admission. */
function boundedModelRef(provider, model) {
	return truncateUtf16Safe(redactSensitiveText(`${provider}/${model}`, { mode: "tools" }), 160);
}
/** Queue only selected routes that already own an admitted execution token. */
function recordAdmittedModelRoutingDecision(params) {
	const admittedRunContext = params.admittedRunContext;
	const token = admittedRunContext?.executionIdentityToken;
	if (!token) return false;
	const receiptId = `model-routing:${randomUUID()}`;
	const requestedRef = boundedModelRef(params.requestedProvider, params.requestedModel);
	const selectedRef = boundedModelRef(params.selectedProvider, params.selectedModel);
	const credentialProfileId = params.credentialProfileId?.trim();
	const hasCredentialOwner = Boolean(credentialProfileId);
	const reasonCode = params.fallbackReason ?? (params.fallbackSelected ? "model_route_selected_after_fallback" : "model_route_selected");
	const assertActive = resolveAdmittedRunActiveAssertion(admittedRunContext, params.abortSignal);
	if (!assertActive) throw new Error("admitted run authority is no longer active");
	assertActive();
	return recordExecutionDecisionWork({
		workVersion: 1,
		token,
		receipt: {
			schemaVersion: 1,
			receiptId,
			occurredAt: params.occurredAt ?? Date.now(),
			action: {
				family: "model-routing",
				operation: `${params.selectionMode}-selection`,
				summary: `Requested ${requestedRef}; selected ${selectedRef}.`
			},
			decision: {
				outcome: "allowed",
				reasonCode
			},
			enforcement: {
				coverageState: hasCredentialOwner ? "attribution-only" : "unknown",
				policyRefs: [],
				grantRefs: [],
				contextFieldsUsed: [
					"contextId",
					"executionId",
					"runId"
				]
			},
			source: {
				owner: "model-routing",
				recordRef: receiptId,
				decisionBoundary: "agent-runtime.post-admission"
			},
			missingEvidence: hasCredentialOwner ? [] : ["credential_profile_owner"],
			remediation: []
		},
		refs: {
			...credentialProfileId ? { resource: {
				namespace: "credential-profile",
				value: credentialProfileId
			} } : {},
			target: {
				namespace: "model-route",
				value: JSON.stringify([params.selectedProvider, params.selectedModel])
			}
		}
	});
}
//#endregion
export { redactRunIdentifier as n, resolveRunWorkspaceDir as r, recordAdmittedModelRoutingDecision as t };
