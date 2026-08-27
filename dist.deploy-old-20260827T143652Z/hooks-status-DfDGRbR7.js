import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { d as getActivePluginRegistry } from "./runtime-g0R28Sy0.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { qt as validateHooksStatusParams } from "./src-Bo4ezI_n.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-uNTkOYt3.js";
import { t as loadWorkspaceHookEntries } from "./workspace-OnUROaJT.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-B3i1-1qZ.js";
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
