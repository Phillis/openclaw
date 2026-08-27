import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-DQOi_XmP.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-D-khMh6L.js";
import { B as normalizeExecTarget, D as maxAsk, H as resolveExecModeFromPolicy, I as normalizeExecAsk, O as minSecurity, U as resolveExecModePolicy, i as resolveExecApprovalsFromFile, z as normalizeExecSecurity } from "./exec-approvals-PtbcLeQo.js";
import { a as loadExecApprovals } from "./exec-approvals-generated-migration-KEjNHNyB.js";
import { t as applyExecPolicyLayer } from "./exec-policy-BxqHweRr.js";
import { d as isRequestedExecTargetAllowed, h as resolveExecTarget } from "./bash-tools.exec-runtime-CMnpBkJC.js";
//#region src/agents/exec-defaults.ts
function applySessionLegacyExecPolicyLayer(base, sessionEntry) {
	const security = normalizeExecSecurity(sessionEntry?.execSecurity);
	const ask = normalizeExecAsk(sessionEntry?.execAsk);
	if (security !== null || ask !== null) return {
		security: security ?? base.security,
		ask: ask ?? base.ask
	};
	return base;
}
function resolveExecConfigState(params) {
	const cfg = params.cfg ?? {};
	const resolvedAgentId = params.scope?.kind === "defaults" ? void 0 : params.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg
	});
	const globalExec = cfg.tools?.exec;
	const agentExec = resolvedAgentId ? resolveAgentConfig(cfg, resolvedAgentId)?.tools?.exec : void 0;
	return {
		cfg,
		host: params.execOverrides?.host ?? normalizeExecTarget(params.sessionEntry?.execHost) ?? agentExec?.host ?? globalExec?.host ?? "auto",
		agentId: resolvedAgentId,
		agentExec,
		globalExec
	};
}
/** Resolves whether node exec is usable and any effective node binding. */
function resolveNodeExecEligibility(params) {
	const defaults = resolveExecDefaults(params);
	const systemRunDenied = params.cfg?.gateway?.nodes?.commands?.deny?.some((command) => command.trim() === "system.run");
	return {
		canExec: defaults.canRequestNode && defaults.security !== "deny" && !systemRunDenied,
		...defaults.node ? { node: defaults.node } : {}
	};
}
/** Resolves effective exec host, mode, approval policy, and node availability. */
function resolveExecDefaults(params) {
	const { cfg, host, agentId: resolvedAgentId, agentExec, globalExec } = resolveExecConfigState(params);
	const sandboxRuntime = params.sessionKey ? resolveSandboxRuntimeStatus({
		cfg,
		sessionKey: params.sessionKey
	}) : void 0;
	const sandboxRequired = params.sessionEntry?.sandbox === "required" || sandboxRuntime?.sandboxRequired === true;
	const sandboxAvailable = params.sandboxAvailable ?? sandboxRuntime?.sandboxed ?? false;
	const resolved = resolveExecTarget({
		configuredTarget: host,
		elevatedRequested: params.elevatedRequested === true && !sandboxRequired,
		sandboxAvailable,
		sandboxRequired
	});
	const defaultSecurity = resolved.effectiveHost === "sandbox" ? "deny" : "full";
	const sessionPermissionPolicy = params.sessionEntry?.permissionMode ? resolveSessionPermissionCoreToolPolicy({ mode: params.sessionEntry.permissionMode }) : void 0;
	const approvalDefaults = resolved.effectiveHost === "sandbox" || sessionPermissionPolicy?.bypassHostApprovalFloors ? void 0 : resolveExecApprovalsFromFile({
		file: params.execApprovals ?? loadExecApprovals(),
		agentId: resolvedAgentId,
		overrides: {
			security: defaultSecurity,
			ask: "off"
		}
	}).agent;
	const basePolicy = {
		security: approvalDefaults?.security ?? defaultSecurity,
		ask: approvalDefaults?.ask ?? "off"
	};
	const modePolicy = resolveExecModePolicy(sessionPermissionPolicy ? {
		mode: sessionPermissionPolicy.execMode,
		security: defaultSecurity,
		ask: "off"
	} : applyExecPolicyLayer(applySessionLegacyExecPolicyLayer(applyExecPolicyLayer(applyExecPolicyLayer(basePolicy, globalExec), agentExec), params.sessionEntry), params.execOverrides));
	const security = approvalDefaults?.security !== void 0 ? minSecurity(modePolicy.security, approvalDefaults.security) : modePolicy.security;
	const ask = approvalDefaults?.ask !== void 0 ? maxAsk(modePolicy.ask, approvalDefaults.ask) : modePolicy.ask;
	const mode = security === modePolicy.security && ask === modePolicy.ask ? modePolicy.mode : resolveExecModeFromPolicy({
		security,
		ask
	});
	return {
		host: resolved.configuredTarget,
		effectiveHost: resolved.effectiveHost,
		mode,
		security,
		ask,
		node: params.execOverrides?.node ?? params.sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node,
		canRequestNode: isRequestedExecTargetAllowed({
			configuredTarget: resolved.configuredTarget,
			requestedTarget: "node",
			sandboxAvailable
		})
	};
}
//#endregion
export { resolveNodeExecEligibility as n, resolveExecDefaults as t };
