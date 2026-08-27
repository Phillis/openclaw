import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-DRTuNy7j.js";
import { T as loadGatewaySessionEntry } from "./session-utils-row-CJRrMBuq.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import "./session-utils-BsFMFOqg.js";
import { r as killSubagentRunAdmin } from "./subagent-control-B30oDvkM.js";
import { g as resolveTrustedHttpOperatorScopes, n as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-CM89UREd.js";
import { c as sendMethodNotAllowed, l as sendMissingScopeForbidden, o as sendInvalidRequest, s as sendJson } from "./http-common-BIedCt0N.js";
import "./http-utils-Cc5uth5g.js";
//#region src/gateway/session-kill-http.ts
function resolveSessionKeyFromPath(pathname) {
	const match = pathname.match(/^\/sessions\/([^/]+)\/kill$/);
	if (!match) return { matched: false };
	try {
		const decoded = decodeURIComponent(match[1] ?? "").trim();
		if (!decoded) return {
			error: "invalid-session-key",
			matched: true
		};
		return {
			matched: true,
			sessionKey: decoded
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
async function handleSessionKillHttpRequest(req, res, opts) {
	const cfg = getRuntimeConfig();
	const url = new URL(req.url ?? "/", "http://localhost");
	const sessionKeyResolution = resolveSessionKeyFromPath(url.pathname);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res, "POST");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	});
	if (!requestAuth) return true;
	const scopeAuth = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, resolveTrustedHttpOperatorScopes(req, requestAuth));
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey, url.searchParams.get("agentId") ?? void 0);
	if (!requestedAgent.ok) {
		sendInvalidRequest(res, requestedAgent.error.message);
		return true;
	}
	const { entry, canonicalKey } = loadGatewaySessionEntry(sessionKey, { agentId: requestedAgent.agentId });
	if (!entry) {
		sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		return true;
	}
	sendJson(res, 200, {
		ok: true,
		killed: (await killSubagentRunAdmin({
			cfg,
			sessionKey: canonicalKey,
			agentId: requestedAgent.agentId
		})).killed
	});
	return true;
}
//#endregion
export { handleSessionKillHttpRequest };
