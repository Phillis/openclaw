import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-B19X7f09.js";
import { Jt as validateHooksStatusParams } from "./src-4dv5TpeQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { t as loadWorkspaceHookEntries } from "./workspace-Cc9UBSPp.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-lrMZaDtO.js";
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
