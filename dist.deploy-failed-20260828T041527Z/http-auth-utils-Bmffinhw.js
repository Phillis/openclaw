import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { l as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN } from "./auth-rate-limit-C6x9QPnp.js";
import { a as prepareGatewayIngressAttribution } from "./ingress-attribution-CVTrlUeM.js";
import { a as resolveBrowserOriginPolicy } from "./origin-check-Bai6m4aI.js";
import { t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-YzBasB1g.js";
import { n as authorizeHttpGatewayConnect, r as authorizeUserProfileAvatarHttpGatewayConnect } from "./auth-CqG8D1lM.js";
import { n as authorizeOperatorScopesForMethod, t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-BQC2sTma.js";
import { a as getUserProfileListItem, i as getUserProfileDisplay, n as ensureProfileForEmail, r as ensureProfileForTailscaleIdentity } from "./user-profiles-CBL8neN1.js";
import { a as CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS, c as CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY, n as listControlUiPluginTabAuthGrants, o as CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE, s as CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY, t as createAuthenticatedGitHubIdentitySync } from "./github-user-identity-DDUjZfp_.js";
import "./control-ui-contract-CgrOMhfo.js";
import { _ as verifyPairingToken } from "./device-bootstrap-6c0qs5r-.js";
import { c as listDevicePairing } from "./device-pairing-BIRweQsd.js";
import { s as verifyDeviceToken } from "./device-pairing-tokens-C8qsNRd7.js";
import { a as resolvePluginRoutePathContext } from "./route-match-Vz3WZJuX.js";
import { a as sendGatewayAuthFailure, l as sendMissingScopeForbidden, s as sendJson } from "./http-common-Dy8Dj7pv.js";
import { c as resolveOperatorRolePolicyForProfile } from "./operator-role-policy-il7s4lXY.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-Wt672rYh.js";
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
		exp,
		...params.profileId ? { profileId: params.profileId } : {}
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
			profileId: params.profileId,
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
			if (payload?.scope !== CONTROL_UI_PLUGIN_AUTH_COOKIE_SCOPE || payload.exp <= now || payload.generation !== params.generation || typeof payload.pluginId !== "string" || payload.pluginId.length === 0 || payload.profileId !== void 0 && (typeof payload.profileId !== "string" || payload.profileId.length === 0) || !Array.isArray(payload.scopes) || typeof payload.path !== "string" || normalizeCookiePath(payload.path) !== payload.path || payload.match !== "exact" && payload.match !== "prefix") continue;
			const grantPathContext = resolvePluginRoutePathContext(payload.path);
			if (grantPathContext.malformedEncoding || grantPathContext.decodePassLimitReached || !grantPathMatchesRequest(grantPathContext.canonicalPath, payload.match, requestPathContext.canonicalPath)) continue;
			const grant = {
				pluginId: payload.pluginId,
				path: payload.path,
				match: payload.match,
				scopes: payload.scopes.filter(isOperatorScope),
				...payload.profileId ? { profileId: payload.profileId } : {}
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
const CONTROL_UI_OPERATOR_READ_SCOPE = "operator.read";
const CONTROL_UI_OPERATOR_ROLE = "operator";
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
async function resolveAuthenticatedHttpUserProfile(params) {
	const authenticatedUserId = normalizeOptionalString(params.authResult.user);
	if (!params.cfg.gateway?.roles) return {};
	if (!authenticatedUserId) {
		if (usesSharedSecretGatewayMethod(params.authResult.method)) return {};
		throw new Error("operator role policies require a verified durable user profile");
	}
	const syncGitHubIdentity = createAuthenticatedGitHubIdentitySync({
		authResult: params.authResult,
		authConfig: params.cfg.gateway.auth,
		requestHeaders: params.req.headers
	});
	const profile = syncGitHubIdentity ? await syncGitHubIdentity() : params.authResult.tailscaleIdentity ? ensureProfileForTailscaleIdentity(params.authResult.tailscaleIdentity) : ensureProfileForEmail(authenticatedUserId);
	return resolveHttpProfile("profileId" in profile ? profile.profileId : profile.id, profile.updatedAt, params.cfg);
}
function resolveHttpProfile(profileId, updatedAt, cfg) {
	const display = getUserProfileDisplay(profileId);
	const operatorRolePolicy = resolveOperatorRolePolicyForProfile(display.id, cfg);
	return {
		authenticatedUserProfile: {
			profileId: display.id,
			displayName: display.displayName,
			avatarRevision: display.avatarRevision,
			hasAvatar: display.hasAvatar,
			updatedAt
		},
		...operatorRolePolicy ? { operatorRolePolicy } : {}
	};
}
function applyHttpOperatorRoleScopeCeiling(scopes, auth) {
	const allowedScopes = auth?.operatorRolePolicy?.scopes;
	return allowedScopes ? scopes.filter((scope) => allowedScopes.includes(scope)) : scopes;
}
function shouldTrustDeclaredHttpOperatorScopes(req, authOrRequest) {
	if (authOrRequest && "trustDeclaredOperatorScopes" in authOrRequest) return authOrRequest.trustDeclaredOperatorScopes;
	return !isGatewayBearerHttpRequest(req, authOrRequest);
}
function resolveControlUiReadAuthToken(req, allowQueryToken) {
	const bearer = getBearerToken(req);
	if (bearer || !allowQueryToken || !req.url) return bearer;
	try {
		return normalizeOptionalString(new URL(req.url, "http://localhost").searchParams.get("token"));
	} catch {
		return;
	}
}
async function verifyControlUiDeviceReadToken(token, requiredSharedGatewaySessionGeneration) {
	const pairing = await listDevicePairing();
	for (const device of pairing.paired) {
		const operatorToken = device.tokens?.[CONTROL_UI_OPERATOR_ROLE];
		if (!operatorToken || operatorToken.revokedAtMs || !verifyPairingToken(token, operatorToken.token)) continue;
		return (await verifyDeviceToken({
			deviceId: device.deviceId,
			token,
			role: CONTROL_UI_OPERATOR_ROLE,
			scopes: [CONTROL_UI_OPERATOR_READ_SCOPE],
			requiredSharedGatewaySessionGeneration
		})).ok ? [...operatorToken.scopes] : null;
	}
	return null;
}
function resolveControlUiReadOperatorScopes(req, authMethod, deviceScopes, authenticatedRequest) {
	if (authMethod === "device-token") return applyHttpOperatorRoleScopeCeiling(deviceScopes ?? [], authenticatedRequest);
	if (authMethod === "trusted-proxy" || authMethod === "tailscale") return resolveTrustedHttpOperatorScopes(req, {
		trustDeclaredOperatorScopes: true,
		...authenticatedRequest
	});
	return authMethod === "bootstrap-token" ? [] : [...CLI_DEFAULT_OPERATOR_SCOPES];
}
/** Authorize a read-only same-origin Control UI request, including paired devices. */
async function authorizeControlUiReadRequestOrReply(params) {
	const auth = params.auth;
	if (!auth) {
		params.onPluginFrameGrants?.([]);
		return {
			authMethod: "none",
			operatorScopes: [...CLI_DEFAULT_OPERATOR_SCOPES]
		};
	}
	const token = resolveControlUiReadAuthToken(params.req, params.allowQueryToken);
	const ingressAttribution = prepareGatewayIngressAttribution({
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback
	});
	if (ingressAttribution.kind === "unattributable-proxy") {
		sendGatewayAuthFailure(params.res, {
			ok: false,
			reason: ingressAttribution.reason
		});
		return null;
	}
	const clientIp = ingressAttribution.rateLimit.subject.key;
	const canUseDeviceTokenFallback = Boolean(token) && auth.mode !== "trusted-proxy" && auth.mode !== "none";
	const run = async () => {
		const authResult = await authorizeHttpGatewayConnect({
			auth,
			connectAuth: token ? {
				token,
				password: token
			} : null,
			req: params.req,
			browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req),
			trustedProxies: params.trustedProxies,
			allowRealIpFallback: params.allowRealIpFallback,
			rateLimiter: token ? params.rateLimiter : void 0,
			clientIp,
			rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET,
			deferRateLimitFailure: canUseDeviceTokenFallback
		});
		const authGeneration = resolveSharedGatewaySessionGeneration(auth, params.trustedProxies);
		let resolvedAuthResult = authResult;
		let deviceScopes;
		if (!authResult.ok && authResult.reason !== "proxy_attribution_required" && canUseDeviceTokenFallback && token) {
			const recordSharedSecretFailure = async () => {
				if (authResult.reason === "token_mismatch" || authResult.reason === "password_mismatch") await params.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
			};
			const deviceRateCheck = params.rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
			if (deviceRateCheck && !deviceRateCheck.allowed) {
				await recordSharedSecretFailure();
				resolvedAuthResult = {
					ok: false,
					reason: "rate_limited",
					rateLimited: true,
					retryAfterMs: deviceRateCheck.retryAfterMs
				};
			} else {
				const verifiedScopes = await verifyControlUiDeviceReadToken(token, authGeneration);
				if (verifiedScopes) {
					deviceScopes = verifiedScopes;
					params.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
					resolvedAuthResult = {
						ok: true,
						method: "device-token"
					};
				} else {
					await recordSharedSecretFailure();
					await params.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
				}
			}
		}
		if (!resolvedAuthResult.ok) {
			sendGatewayAuthFailure(params.res, resolvedAuthResult);
			return null;
		}
		const cfg = getRuntimeConfig();
		let authenticatedProfile;
		try {
			authenticatedProfile = await resolveAuthenticatedHttpUserProfile({
				authResult: resolvedAuthResult,
				cfg,
				req: params.req
			});
		} catch {
			sendGatewayAuthFailure(params.res, {
				ok: false,
				reason: "user_profile_unavailable"
			});
			return null;
		}
		const authMethod = resolvedAuthResult.method ?? "none";
		const trustDeclaredOperatorScopes = authMethod === "trusted-proxy" || authMethod === "tailscale";
		const operatorScopes = resolveControlUiReadOperatorScopes(params.req, authMethod, deviceScopes, authenticatedProfile);
		params.onPluginFrameGrants?.(setControlUiPluginAuthCookieForRequest(params.req, params.res, authMethod, trustDeclaredOperatorScopes, authGeneration, operatorScopes, authenticatedProfile.authenticatedUserProfile?.profileId));
		const scopeAuth = authorizeOperatorScopesForMethod(params.requiredOperatorMethod ?? "assistant.media.get", operatorScopes);
		if (!scopeAuth.allowed) {
			sendMissingScopeForbidden(params.res, scopeAuth.missingScope);
			return null;
		}
		return {
			authMethod,
			operatorScopes
		};
	};
	if (!canUseDeviceTokenFallback || !params.rateLimiter) return await run();
	return await withSerializedCredentialFallbackAttempt({
		limiter: params.rateLimiter,
		ip: clientIp,
		run
	});
}
/**
* Session byte routes cannot apply the client-specific `sessions.list` filter.
* Require its read scope plus admin, whose owner view is not narrowed by that filter.
*/
async function authorizeControlUiSessionOwnerReadRequestOrReply(params) {
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...params,
		requiredOperatorMethod: "sessions.list"
	});
	if (!requestAuth || requestAuth.operatorScopes.includes("operator.admin")) return requestAuth;
	sendJson(params.res, 403, {
		ok: false,
		error: {
			message: "owner access required",
			type: "forbidden"
		}
	});
	return null;
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
function setControlUiPluginAuthCookieForRequest(req, res, authMethod, trustDeclaredOperatorScopes, authGeneration, authenticatedScopes, authenticatedProfileId) {
	const grants = listControlUiPluginTabAuthGrants(authenticatedScopes ?? (usesSharedSecretGatewayMethod(authMethod) ? [...CLI_DEFAULT_OPERATOR_SCOPES] : authMethod === "trusted-proxy" || authMethod === "tailscale" ? resolveTrustedHttpOperatorScopes(req, { trustDeclaredOperatorScopes }) : []));
	if (grants.length > 0) return setControlUiPluginAuthCookie(res, grants, {
		generation: authGeneration,
		...authenticatedProfileId ? { profileId: authenticatedProfileId } : {}
	});
	return [];
}
function authorizeControlUiPluginCookieRequest(req, params) {
	if (req.method !== "GET" && req.method !== "HEAD") return null;
	const grants = resolveControlUiPluginAuthCookieGrants(req, {
		requestPath: params.requestPath,
		generation: params.authGeneration
	});
	if (grants.length === 0) return null;
	const cfg = getRuntimeConfig();
	let authenticatedProfile = {};
	if (cfg.gateway?.roles) {
		const profileId = grants[0]?.profileId;
		if (!profileId || grants.some((grant) => grant.profileId !== profileId)) return null;
		try {
			const profile = getUserProfileListItem(profileId);
			authenticatedProfile = resolveHttpProfile(profile.id, profile.updatedAt, cfg);
		} catch {
			return null;
		}
	}
	return {
		requestAuth: {
			trustDeclaredOperatorScopes: false,
			controlUiPluginGrants: authenticatedProfile.operatorRolePolicy ? grants.map((grant) => ({
				...grant,
				scopes: grant.scopes.filter((scope) => authenticatedProfile.operatorRolePolicy?.scopes.includes(scope))
			})) : grants,
			...authenticatedProfile
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
	let authenticatedProfile;
	try {
		authenticatedProfile = await resolveAuthenticatedHttpUserProfile({
			authResult,
			cfg: params.cfg ?? getRuntimeConfig(),
			req: params.req
		});
	} catch {
		return {
			ok: false,
			authResult: {
				ok: false,
				reason: "user_profile_unavailable"
			}
		};
	}
	return {
		ok: true,
		requestAuth: {
			authMethod: authResult.method,
			...authResult.user ? { user: authResult.user } : {},
			trustDeclaredOperatorScopes: !usesSharedSecretGatewayMethod(authResult.method),
			...authenticatedProfile
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
	return applyHttpOperatorRoleScopeCeiling(headerValue === void 0 ? [...CLI_DEFAULT_OPERATOR_SCOPES] : headerValue.split(",").map((scope) => scope.trim()).filter((scope) => scope.length > 0), authOrRequest && "trustDeclaredOperatorScopes" in authOrRequest ? authOrRequest : void 0);
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
export { resolveSharedSecretHttpOperatorScopes as _, authorizeOpenAiCompatibleHttpModelOverride as a, respondControlUiPluginAuthCookieProbe as b, authorizeScopedUserProfileAvatarHttpRequestOrReply as c, getHeader as d, isGatewayBearerHttpRequest as f, resolveOpenAiCompatibleHttpSenderIsOwner as g, resolveOpenAiCompatibleHttpOperatorScopes as h, authorizeGatewayHttpRequestOrReply as i, checkGatewayHttpRequestAuth as l, resolveHttpSenderIsOwner as m, authorizeControlUiReadRequestOrReply as n, authorizePluginGatewayHttpRequestOrReply as o, resolveHttpBrowserOriginPolicy as p, authorizeControlUiSessionOwnerReadRequestOrReply as r, authorizeScopedGatewayHttpRequestOrReply as s, authorizeControlUiPluginCookieRequest as t, getBearerToken as u, resolveTrustedHttpOperatorScopes as v, setControlUiPluginAuthCookieForRequest as y };
