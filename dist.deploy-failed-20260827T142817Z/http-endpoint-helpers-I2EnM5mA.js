import { n as authorizeOperatorScopesForMethod } from "./method-scopes-rPUXjV_D.js";
import { g as resolveTrustedHttpOperatorScopes, n as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-CDftY0xy.js";
import { c as sendMethodNotAllowed, i as readJsonBodyOrError, l as sendMissingScopeForbidden } from "./http-common-CJ1Ivcyn.js";
import "./http-utils-DN0p0N4t.js";
//#region src/gateway/http-endpoint-helpers.ts
/** Handles a gateway POST JSON endpoint and returns the parsed body when authorized. */
async function handleGatewayPostJsonEndpoint(req, res, opts) {
	if (new URL(req.url ?? "/", "http://localhost").pathname !== opts.pathname) return false;
	if (req.method !== "POST") {
		sendMethodNotAllowed(res);
		return;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	});
	if (!requestAuth) return;
	if (opts.requiredOperatorMethod) {
		const requestedScopes = opts.resolveOperatorScopes?.(req, requestAuth) ?? resolveTrustedHttpOperatorScopes(req, requestAuth);
		const scopeAuth = authorizeOperatorScopesForMethod(opts.requiredOperatorMethod, requestedScopes);
		if (!scopeAuth.allowed) {
			sendMissingScopeForbidden(res, scopeAuth.missingScope);
			return;
		}
	}
	const body = await readJsonBodyOrError(req, res, opts.maxBodyBytes);
	if (body === void 0) return;
	return {
		body,
		requestAuth
	};
}
//#endregion
export { handleGatewayPostJsonEndpoint as t };
