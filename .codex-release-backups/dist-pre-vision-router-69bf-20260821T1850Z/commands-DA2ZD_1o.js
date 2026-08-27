import { q as validateCommandsListParams } from "./src-BlUKtAtD.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BhyQ_s7_.js";
import { t as buildCommandsListResult } from "./commands-list-result-8icyT69w.js";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateCommandsListParams, "commands.list", respond)) return;
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: (rawAgentId) => typeof rawAgentId === "string" ? rawAgentId.trim() : void 0
	});
	if (!resolved) return;
	respond(true, buildCommandsListResult({
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		provider: params.provider,
		scope: params.scope,
		includeArgs: params.includeArgs
	}), void 0);
} };
//#endregion
export { commandsHandlers };
