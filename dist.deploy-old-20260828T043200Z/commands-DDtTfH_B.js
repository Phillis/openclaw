import { J as validateCommandsListParams } from "./src-4dv5TpeQ.js";
import { n as defineValidatedGatewayMethod } from "./validation-kYFXohur.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { t as buildCommandsListResult } from "./commands-list-result-Bw2280xJ.js";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": defineValidatedGatewayMethod("commands.list", validateCommandsListParams, ({ params, respond, context }) => {
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
}) };
//#endregion
export { commandsHandlers };
