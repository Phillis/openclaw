import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-dw5fHLEW.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CZdVn5YO.js";
import { c as readMcpOAuthStore, h as requesterMcpOAuthStoreKeyPrefix, s as readMcpOAuthPendingAuthorization } from "./mcp-oauth-store-BSuWhVNF.js";
import { a as completeOAuthCallback } from "./mcp-oauth-eWr2mvUU.js";
//#region src/gateway/mcp-oauth-callback.ts
const MCP_OAUTH_CALLBACK_PATH = "/oauth/mcp/callback";
const MCP_OAUTH_CALLBACK_MAX_URL_BYTES = 8 * 1024;
const CONNECTED_HTML = "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Account connected</title><body><main><h1>You're connected.</h1><p>Return to the chat.</p></main></body></html>";
const RETRY_HTML = "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Sign-in incomplete</title><body><main><h1>Sign-in wasn't completed.</h1><p>Ask the bot to connect again.</p></main></body></html>";
const EXPIRED_HTML = "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><title>Sign-in link expired</title><body><main><h1>This sign-in link expired or was already used.</h1><p>Ask the bot to connect again.</p></main></body></html>";
function respondHtml(res, status, body) {
	res.statusCode = status;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end(body);
}
function readPendingState(lastAuthorizationUrl) {
	try {
		return new URL(lastAuthorizationUrl).searchParams.get("state")?.trim() || void 0;
	} catch {
		return;
	}
}
function isPerRequesterServer(server) {
	const oauth = isRecord(server.oauth) ? server.oauth : void 0;
	return server.enabled !== false && server.auth === "oauth" && oauth?.identity === "per-requester";
}
/** Completes one requester MCP OAuth redirect using durable state correlation. */
async function handleMcpOAuthCallback(req, res, params) {
	if (req.method !== "GET") return false;
	const rawUrl = req.url ?? "/";
	const url = new URL(rawUrl, "http://localhost");
	if (url.pathname !== MCP_OAUTH_CALLBACK_PATH) return false;
	const configuredServers = Object.entries(normalizeConfiguredMcpServers(params.config.mcp?.servers)).toSorted(([left], [right]) => left.localeCompare(right)).flatMap(([serverName, rawServer]) => {
		if (!isPerRequesterServer(rawServer)) return [];
		const resolved = resolveMcpTransportConfig(serverName, rawServer, { logWarnings: false });
		return resolved?.kind === "http" && resolved.auth === "oauth" ? [{
			serverName,
			resolved
		}] : [];
	});
	if (configuredServers.length === 0) return false;
	if (Buffer.byteLength(rawUrl, "utf8") > MCP_OAUTH_CALLBACK_MAX_URL_BYTES) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	const state = url.searchParams.get("state")?.trim();
	const storeKey = state ? readMcpOAuthPendingAuthorization(state) : void 0;
	const pending = storeKey ? readMcpOAuthStore(storeKey) : void 0;
	if (!storeKey || !state || readPendingState(pending?.lastAuthorizationUrl ?? "") !== state) {
		respondHtml(res, 404, EXPIRED_HTML);
		return true;
	}
	const configuredServer = configuredServers.find(({ serverName, resolved }) => storeKey.startsWith(requesterMcpOAuthStoreKeyPrefix(serverName, resolved.url)));
	if (!configuredServer) {
		respondHtml(res, 404, EXPIRED_HTML);
		return true;
	}
	if (url.searchParams.has("error")) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	const code = url.searchParams.get("code")?.trim();
	if (!code) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	try {
		if (await completeOAuthCallback({
			storeKey,
			principal: "requester",
			serverName: configuredServer.serverName,
			serverUrl: configuredServer.resolved.url
		}, configuredServer.resolved, {
			code,
			state
		}) === "expired") {
			respondHtml(res, 404, EXPIRED_HTML);
			return true;
		}
		respondHtml(res, 200, CONNECTED_HTML);
	} catch (error) {
		params.log.warn(`MCP OAuth callback failed for server "${configuredServer.serverName}": ${formatErrorMessage(error)}`);
		respondHtml(res, 400, RETRY_HTML);
	}
	return true;
}
//#endregion
export { handleMcpOAuthCallback };
