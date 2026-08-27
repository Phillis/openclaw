import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
//#region src/config/exec-command-highlighting.ts
/** Resolves whether exec command highlighting is enabled for the current agent scope. */
function resolveExecCommandHighlighting(params) {
	const config = params.config ?? {};
	const globalValue = config.tools?.exec?.commandHighlighting;
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : null;
	return (agentId ? resolveAgentConfig(config, agentId)?.tools?.exec?.commandHighlighting : void 0) ?? globalValue ?? false;
}
//#endregion
export { resolveExecCommandHighlighting as t };
