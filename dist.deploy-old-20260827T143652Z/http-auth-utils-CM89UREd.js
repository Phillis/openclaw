import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { a as resolveBrowserOriginPolicy } from "./origin-check-DudmUihq.js";
import { n as authorizeHttpGatewayConnect, r as authorizeUserProfileAvatarHttpGatewayConnect } from "./auth-CCT61CRz.js";
import { n as authorizeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-DRTuNy7j.js";
import { c as CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY, l as CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY, o as CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS, s as CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE } from "./control-ui-contract-eurzifU_.js";
import { a as resolvePluginRoutePathContext } from "./route-match-Vz3WZJuX.js";
import { t as listControlUiPluginTabAuthGrants } from "./control-ui-plugin-tabs-D0czwaJ8.js";
import { a as sendGatewayAuthFailure, l as sendMissingScopeForbidden } from "./http-common-BIedCt0N.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BWx0sDdz.js";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
//#region src/gateway/control-ui-plugin-auth-cookie.ts
const CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX = `__openclaw_plugin_tab_auth_${randomBytes(8).toString("hex")}`;
const CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE = "plugin-tab";
const controlUiPluginAuthCookieSecret = randomBytes(32);
function signPayload(encodedPayload) {
	return createHmac("sha256", controlUiPluginAuthCookieSecret).update(encodedPayload).digest("base64url");
}
function safeEqual(a, b) {
	return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
function readCookieHeaderValues(header, namePrefix) {
	const raw = Array.isArray(header) ? header.join(";") : header;
	const values = [];
	for (const part of raw?.split(";") ?? []) {
		const index = part.indexOf("=");
		if (index <= 0) continue;
		const key = part.slice(0, index).trim();
		const value = part.slice(index + 1).trim();
		if (key.startsWith(`${namePrefix}_`)) values.push(value);
	}
	return values;
}
function cookieNameForPlugin(pluginId) {
	const pluginKey = createHash("sha256").update(pluginId).digest("hex");
	return `${CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX}_${pluginKey}`;
}
function hasInvalidCookiePathCharacter(path) {
	for (const character of path) {
		const code = character.charCodeAt(0);
		if (character === ";" || code <= 31 || code === 127) return true;
	}
	return false;
}
function normalizeCookiePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || hasInvalidCookiePathCharacter(path)) return;
	try {
		const normalized = new URL(path, "http://localhost").pathname;
		return normalized === path ? normalized : void 0;
	} catch {
		return;
	}
}
function createControlUiPluginAuthCookie(grant, params) {
	const path = normalizeCookiePath(grant.path);
	if (!path || !grant.pluginId || !params.generation) return;
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return;
	const exp = asDateTimestampMs(now + CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS);
	if (exp === void 0) return;
	const payload = {
		scope: CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE,
		pluginId: grant.pluginId,
		scopes: grant.scopes.filter(isOperatorScope),
		path,
		match: grant.match,
		generation: params.generation,
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	const sig = signPayload(encodedPayload);
	return `${cookieNameForPlugin(grant.pluginId)}=v1.${encodedPayload}.${sig}; Path=${path}; HttpOnly; Secure; SameSite=None; Max-Age=${Math.ceil(CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS / 1e3)}`;
}
function setControlUiPluginAuthCookie(res, grants, params) {
	const issuedGrants = [];
	const cookiesToAdd = grants.flatMap((grant) => {
		const cookie = createControlUiPluginAuthCookie(grant, {
			generation: params.generation,
			nowMs: params.nowMs
		});
		if (!cookie) return [];
		issuedGrants.push(grant);
		return [cookie];
	});
	if (cookiesToAdd.length === 0) return issuedGrants;
	const existing = typeof res.getHeader === "function" ? res.getHeader("Set-Cookie") : void 0;
	const cookies = Array.isArray(existing) ? [...existing, ...cookiesToAdd] : typeof existing === "string" ? [existing, ...cookiesToAdd] : cookiesToAdd;
	res.setHeader("Set-Cookie", cookies);
	return issuedGrants;
}
function grantPathMatchesRequest(grantPath, match, requestPath) {
	if (match === "exact") return requestPath === grantPath;
	return requestPath === grantPath || requestPath.startsWith(grantPath) && (grantPath.endsWith("/") || requestPath.at(grantPath.length) === "/");
}
function resolveControlUiPluginAuthCookieGrants(req, params) {
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return [];
	const requestPath = normalizeCookiePath(params.requestPath);
	if (!requestPath || !params.generation) return [];
	const requestPathContext = resolvePluginRoutePathContext(requestPath);
	if (requestPathContext.malformedEncoding || requestPathContext.decodePassLimitReached) return [];
	const grants = [];
	for (const value of readCookieHeaderValues(req.headers.cookie, CONTROL_UI_PLUGIN_AUTH_COOKIE_PREFIX)) {
		const parts = value.split(".");
		if (parts.length !== 3 || parts[0] !== "v1") continue;
		const [, encodedPayload, sig] = parts;
		if (!encodedPayload || !sig || !safeEqual(sig, signPayload(encodedPayload))) continue;
		try {
			const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
			if (payload?.scope !== CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE || payload.exp <= now || payload.generation !== params.generation || typeof payload.pluginId !== "string" || payload.pluginId.length === 0 || !Array.isArray(payload.scopes) || typeof payload.path !== "string" || normalizeCookiePath(payload.path) !== payload.path || payload.match !== "exact" && payload.match !== "prefix") continue;
			const grantPathContext = resolvePluginRoutePathContext(payload.path);
			if (grantPathContext.malformedEncoding || grantPathContext.decodePassLimitReached || !grantPathMatchesRequest(grantPathContext.canonicalPath, payload.match, requestPathContext.canonicalPath)) continue;
			const grant = {
				pluginId: payload.pluginId,
				path: payload.path,
				match: payload.match,
				scopes: payload.scopes.filter(isOperatorScope)
			};
			grants.push(grant);
		} catch {
			continue;
		}
	}
	return grants.toSorted((left, right) => right.path.length - left.path.length);
}
/**
* Confirms that the browser actually sent a grant from inside the opaque
* sandbox. Secure contexts can still block third-party cookies, so bootstrap
* acknowledgement alone is not enough to mount the plugin frame.
*/
function respondControlUiPluginAuthCookieProbe(req, res) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const nonce = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY);
	if (nonce === null) return false;
	const targetOrigin = url.searchParams.get(CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY);
	let validTargetOrigin = false;
	if (targetOrigin) try {
		const parsedOrigin = new URL(targetOrigin);
		validTargetOrigin = parsedOrigin.origin === targetOrigin && (parsedOrigin.protocol === "https:" || parsedOrigin.protocol === "http:");
	} catch {
		validTargetOrigin = false;
	}
	if (!/^[a-zA-Z0-9_-]{16,128}$/.test(nonce) || !validTargetOrigin) {
		res.statusCode = 400;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Invalid plugin frame auth probe");
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
	const message = JSON.stringify({
		type: CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE,
		nonce
	});
	res.end(`<!doctype html><script>parent.postMessage(${message}, ${JSON.stringify(targetOrigin)})<\/script>`);
	return true;
}
//#endregion
//#region src/gateway/http-auth-utils.ts
function getHeader(req, name) {
	const raw = req.headers[normalizeLowercaseStringOrEmpty(name)];
	if (typeof raw === "string") return raw;
	if (Array.isArray(raw)) return raw[0];
}
function getBearerToken(req) {
	const raw = normalizeOptionalString(getHeader(req, "authorization")) ?? "";
	if (!normalizeLowercaseStringOrEmpty(raw).startsWith("bearer ")) return;
	return normalizeOptionalString(raw.slice(7));
}
function resolveHttpBrowserOriginPolicy(req, cfg = getRuntimeConfig()) {
	return resolveBrowserOriginPolicy({
		req,
		cfg
	});
}
function usesSharedSecretHttpAuth(auth) {
	return auth?.mode === "token" || auth?.mode === "password";
}
function usesSharedSecretGatewayMethod(method) {
	return method === "token" || method === "password";
}
function shouldTrustDeclaredHttpOperatorScopes(req, authOrRequest) {
	if (authOrRequest && "trustDeclaredOperatorScopes" in authOrRequest) return authOrRequest.trustDeclaredOperatorScopes;
	return !isGatewayBearerHttpRequest(req, authOrRequest);
}
async function authorizeGatewayHttpRequestOrReply(params) {
	return await authorizeGatewayHttpRequestWithOrReply(params, authorizeHttpGatewayConnect);
}
async function authorizeGatewayHttpRequestWithOrReply(params, authorizeConnect) {
	const result = await checkGatewayHttpRequestAuthWith(params, authorizeConnect);
	if (!result.ok) {
		sendGatewayAuthFailure(params.res, result.authResult);
		return null;
	}
	return result.requestAuth;
}
function setControlUiPluginAuthCookieForRequest(req, res, authMethod, trustDeclaredOperatorScopes, authGeneration, authenticatedScopes) {
	const grants = listControlUiPluginTabAuthGrants(usesSharedSecretGatewayMethod(authMethod) ? [...CLI_DEFAULT_OPERATOR_SCOPES] : authMethod === "trusted-proxy" || authMethod === "tailscale" ? resolveTrustedHttpOperatorScopes(req, { trustDeclaredOperatorScopes }) : authMethod === "device-token" ? authenticatedScopes ?? [] : []);
	if (grants.length > 0) return setControlUiPluginAuthCookie(res, grants, { generation: authGeneration });
	return [];
}
function authorizeControlUiPluginCookieRequest(req, params) {
	if (req.method !== "GET" && req.method !== "HEAD") return null;
	const grants = resolveControlUiPluginAuthCookieGrants(req, {
		requestPath: params.requestPath,
		generation: params.authGeneration
	});
	if (grants.length === 0) return null;
	return {
		requestAuth: {
			trustDeclaredOperatorScopes: false,
			controlUiPluginGrants: grants
		},
		operatorScopes: []
	};
}
async function authorizePluginGatewayHttpRequestOrReply(params) {
	const authGeneration = resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies);
	const cookieAuth = authorizeControlUiPluginCookieRequest(params.req, {
		requestPath: params.requestPath,
		authGeneration
	});
	if (cookieAuth) return cookieAuth;
	const requestAuth = await authorizeGatewayHttpRequestOrReply(params);
	return requestAuth ? {
		requestAuth,
		operatorScopes: params.resolveOperatorScopes(params.req, requestAuth)
	} : null;
}
async function checkGatewayHttpRequestAuth(params) {
	return await checkGatewayHttpRequestAuthWith(params, authorizeHttpGatewayConnect);
}
async function checkGatewayHttpRequestAuthWith(params, authorizeConnect) {
	const token = getBearerToken(params.req);
	const browserOriginPolicy = resolveHttpBrowserOriginPolicy(params.req, params.cfg);
	const authResult = await authorizeConnect({
		auth: params.auth,
		connectAuth: token ? {
			token,
			password: token
		} : null,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: params.rateLimiter,
		browserOriginPolicy
	});
	if (!authResult.ok) return {
		ok: false,
		authResult
	};
	return {
		ok: true,
		requestAuth: {
			authMethod: authResult.method,
			...authResult.user ? { user: authResult.user } : {},
			trustDeclaredOperatorScopes: !usesSharedSecretGatewayMethod(authResult.method)
		}
	};
}
async function authorizeScopedGatewayHttpRequestOrReply(params) {
	return await authorizeScopedGatewayHttpRequestWithOrReply(params, authorizeHttpGatewayConnect);
}
/** Authorize the read-only avatar route without broadening ordinary HTTP auth. */
async function authorizeScopedUserProfileAvatarHttpRequestOrReply(params) {
	return await authorizeScopedGatewayHttpRequestWithOrReply(params, authorizeUserProfileAvatarHttpGatewayConnect);
}
async function authorizeScopedGatewayHttpRequestWithOrReply(params, authorizeConnect) {
	const cfg = getRuntimeConfig();
	const requestAuth = await authorizeGatewayHttpRequestWithOrReply({
		req: params.req,
		res: params.res,
		auth: params.auth,
		trustedProxies: params.trustedProxies ?? cfg.gateway?.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback,
		rateLimiter: params.rateLimiter
	}, authorizeConnect);
	if (!requestAuth) return null;
	const operatorScopes = params.resolveOperatorScopes(params.req, requestAuth);
	const scopeAuth = authorizeOperatorScopesForMethod(params.operatorMethod, operatorScopes);
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(params.res, scopeAuth.missingScope);
		return null;
	}
	return {
		cfg,
		requestAuth,
		operatorScopes
	};
}
function isGatewayBearerHttpRequest(req, auth) {
	return usesSharedSecretHttpAuth(auth) && Boolean(getBearerToken(req));
}
function resolveTrustedHttpOperatorScopes(req, authOrRequest) {
	if (!shouldTrustDeclaredHttpOperatorScopes(req, authOrRequest)) return [];
	const headerValue = getHeader(req, "x-openclaw-scopes");
	if (headerValue === void 0) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	const raw = headerValue.trim();
	if (!raw) return [];
	return raw.split(",").map((scope) => scope.trim()).filter((scope) => scope.length > 0);
}
function resolveOpenAiCompatibleHttpOperatorScopes(req, requestAuth) {
	return resolveSharedSecretHttpOperatorScopes(req, requestAuth);
}
function resolveSharedSecretHttpOperatorScopes(req, requestAuth) {
	if (usesSharedSecretGatewayMethod(requestAuth.authMethod)) return [...CLI_DEFAULT_OPERATOR_SCOPES];
	return resolveTrustedHttpOperatorScopes(req, requestAuth);
}
function resolveHttpSenderIsOwner(req, authOrRequest) {
	return resolveTrustedHttpOperatorScopes(req, authOrRequest).includes(ADMIN_SCOPE);
}
function resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth) {
	if (usesSharedSecretGatewayMethod(requestAuth.authMethod)) return true;
	return resolveHttpSenderIsOwner(req, requestAuth);
}
function authorizeOpenAiCompatibleHttpModelOverride(req, requestAuth) {
	if (!normalizeOptionalString(getHeader(req, "x-openclaw-model")) || resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth)) return { allowed: true };
	return {
		allowed: false,
		missingScope: ADMIN_SCOPE
	};
}
//#endregion
export { setControlUiPluginAuthCookieForRequest as _, authorizeScopedGatewayHttpRequestOrReply as a, getBearerToken as c, resolveHttpBrowserOriginPolicy as d, resolveHttpSenderIsOwner as f, resolveTrustedHttpOperatorScopes as g, resolveSharedSecretHttpOperatorScopes as h, authorizePluginGatewayHttpRequestOrReply as i, getHeader as l, resolveOpenAiCompatibleHttpSenderIsOwner as m, authorizeGatewayHttpRequestOrReply as n, authorizeScopedUserProfileAvatarHttpRequestOrReply as o, resolveOpenAiCompatibleHttpOperatorScopes as p, authorizeOpenAiCompatibleHttpModelOverride as r, checkGatewayHttpRequestAuth as s, authorizeControlUiPluginCookieRequest as t, isGatewayBearerHttpRequest as u, respondControlUiPluginAuthCookieProbe as v };
