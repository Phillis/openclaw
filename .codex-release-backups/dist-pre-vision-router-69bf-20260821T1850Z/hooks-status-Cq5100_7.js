import "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { d as getActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { qt as validateHooksStatusParams } from "./src-BlUKtAtD.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BhyQ_s7_.js";
import { t as loadWorkspaceHookEntries } from "./workspace-CFG3Y7tG.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-J4oIH1re.js";
//#region src/gateway/server-methods/hooks-status.ts
/** Gateway handler for the live hook status report. */
const hooksStatusHandlers = { "hooks.status": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateHooksStatusParams, "hooks.status", respond)) return;
	const config = context.getRuntimeConfig();
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: config,
		normalize: (value) => typeof value === "string" ? value.trim() || void 0 : void 0
	});
	if (!resolved) return;
	const workspaceDir = resolveAgentWorkspaceDir(config, resolved.agentId);
	respond(true, buildWorkspaceHookStatus(workspaceDir, {
		config,
		entries: [...(getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry())?.hooks.map((hook) => hook.entry) ?? [], ...loadWorkspaceHookEntries(workspaceDir, { config })]
	}), void 0);
} };
//#endregion
export { hooksStatusHandlers };
