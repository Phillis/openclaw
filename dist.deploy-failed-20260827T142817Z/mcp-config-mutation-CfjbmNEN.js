import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-C8VGUeII.js";
import { p as operatorMcpOAuthIdentity } from "./mcp-oauth-store-Bo-TrnIS.js";
import { n as clearMcpOAuthRequesters, r as clearMcpOAuthServer } from "./mcp-oauth-gyk8EYZu.js";
import { n as mcpConfigInternal } from "./mcp-config-CPBslCaE.js";
//#region src/agents/mcp-config-mutation.ts
/** Canonical configured-MCP mutations with OAuth credential lifecycle cleanup. */
function hasOAuthAuth(server) {
	return asNullableRecord(server)?.auth === "oauth";
}
function hasRequesterIdentity(server) {
	return hasOAuthAuth(server) && asNullableRecord(asNullableRecord(server)?.oauth)?.identity === "per-requester";
}
async function clearReplacedMcpOAuth(mutation) {
	if (!hasOAuthAuth(mutation.previous)) return;
	const previous = resolveMcpTransportConfig(mutation.name, mutation.previous);
	if (previous?.kind !== "http") return;
	const next = hasOAuthAuth(mutation.next) ? resolveMcpTransportConfig(mutation.name, mutation.next) : void 0;
	if (next?.kind === "http" && next.url === previous.url) {
		const wasRequester = hasRequesterIdentity(mutation.previous);
		if (wasRequester === hasRequesterIdentity(mutation.next)) return;
		if (wasRequester) {
			await clearMcpOAuthRequesters(operatorMcpOAuthIdentity(mutation.name, previous.url));
			return;
		}
	}
	await clearMcpOAuthServer(operatorMcpOAuthIdentity(mutation.name, previous.url));
}
function setConfiguredMcpServer(params) {
	return mcpConfigInternal.set(params, clearReplacedMcpOAuth);
}
function unsetConfiguredMcpServer(params) {
	return mcpConfigInternal.unset(params, clearReplacedMcpOAuth);
}
function updateConfiguredMcpServer(params) {
	return mcpConfigInternal.update(params, clearReplacedMcpOAuth);
}
function updateConfiguredMcpServerTools(params) {
	return mcpConfigInternal.updateTools(params, clearReplacedMcpOAuth);
}
//#endregion
export { updateConfiguredMcpServerTools as i, unsetConfiguredMcpServer as n, updateConfiguredMcpServer as r, setConfiguredMcpServer as t };
