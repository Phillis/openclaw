import "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
//#region src/flows/doctor-gateway-exec-credential.ts
async function hasActiveGatewayExecCredential(params) {
	const [{ resolveSecretInputRef }, { gatewaySecretInputPathCanWin }, secretPaths] = await Promise.all([
		import("./types.secrets-vXm6qYq1.js"),
		import("./credentials-secret-inputs-COD_exzV.js"),
		import("./secret-input-paths-DE8ABgtQ.js")
	]);
	const mode = params.cfg.gateway?.mode === "remote" ? "remote" : "local";
	return secretPaths.ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
		if (!gatewaySecretInputPathCanWin({
			config: params.cfg,
			env: params.env ?? process.env,
			modeOverride: mode,
			path
		})) return false;
		return resolveSecretInputRef({
			value: secretPaths.readGatewaySecretInputValue(params.cfg, path),
			defaults: params.cfg.secrets?.defaults
		}).ref?.source === "exec";
	});
}
//#endregion
//#region src/flows/doctor-workspace-suggestion-scopes.ts
/** Resolves every configured agent workspace while preserving invalid empty-roster failures. */
function resolveDoctorWorkspaceSuggestionScopes(cfg) {
	const listedAgentIds = listAgentIds(cfg);
	const agentIds = listedAgentIds.length > 0 ? listedAgentIds : [resolveDefaultAgentId(cfg)];
	const labelAgent = agentIds.length > 1;
	return agentIds.map((agentId) => ({
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
		labelAgent
	}));
}
//#endregion
export { hasActiveGatewayExecCredential as n, resolveDoctorWorkspaceSuggestionScopes as t };
