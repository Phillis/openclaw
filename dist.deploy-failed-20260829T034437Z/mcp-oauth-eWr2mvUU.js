import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as loadUndiciRuntimeDeps } from "./undici-runtime-CWs3Ll9x.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-arYIaOWE.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-D2tMUB-B.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-Bw2pQRks.js";
import { t as wrapGuardedBodyStream } from "./guarded-body-stream-38Py3kmx.js";
import { a as listMcpOAuthStoreKeysByPrefix, c as readMcpOAuthStore, d as writeMcpOAuthPendingAuthorization, h as requesterMcpOAuthStoreKeyPrefix, i as deleteMcpOAuthPendingAuthorizationsByPrefix, l as readMcpOAuthStoreReadOnly, n as consumeOAuthState, r as deleteMcpOAuthPendingAuthorization, t as clearMcpOAuthStore, u as updateMcpOAuthStore } from "./mcp-oauth-store-BSuWhVNF.js";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-http-fetch.ts
/**
* MCP HTTP fetch wrappers.
* Adds SSRF protection, scoped TLS/client-cert dispatchers, response cleanup,
* and same-origin header handling around the MCP SDK fetch contract.
*/
/** Default MCP HTTP fetch backed by lazy-loaded undici runtime deps. */
const fetchWithUndici = async (url, init) => await loadUndiciRuntimeDeps().fetch(url, init);
const fetchWithUndiciGuard = async (input, init) => await fetchWithUndici(input instanceof Request ? input.url : input, init);
const MCP_HTTP_MAX_REDIRECTS = 20;
function resolveFetchRequest(input, init) {
	if (input instanceof Request) {
		const request = new Request(input, init);
		const body = request.body ?? void 0;
		return {
			url: request.url,
			signal: request.signal,
			init: {
				method: request.method,
				headers: request.headers,
				body,
				redirect: request.redirect,
				...body ? { duplex: "half" } : {}
			}
		};
	}
	const { signal, ...requestInit } = init ?? {};
	return {
		url: input instanceof URL ? input.toString() : input,
		signal: signal ?? void 0,
		init: init ? requestInit : void 0
	};
}
async function ensureGlobalFetchResponse(response) {
	const init = {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	};
	if (response.body != null) return new Response(response.body, init);
	if (response.status === 204 || response.status === 205 || response.status === 304) return new Response(null, init);
	return new Response(null, init);
}
async function buildManagedMcpResponse(response, release, refreshTimeout) {
	if (!response.body) {
		release();
		return await ensureGlobalFetchResponse(response);
	}
	const wrappedBody = wrapGuardedBodyStream({
		body: response.body,
		cleanup: release,
		refreshTimeout
	});
	return await ensureGlobalFetchResponse(new Response(wrappedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	}));
}
/** Builds an MCP fetch function with optional TLS/client-cert dispatcher support. */
function buildMcpHttpFetch(params) {
	const needsCustomDispatcher = params.sslVerify === false || Boolean(params.clientCert || params.clientKey);
	const scopedOrigin = params.resourceUrl ? new URL(params.resourceUrl).origin : void 0;
	const policy = params.resourceUrl ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.resourceUrl) : void 0;
	let customConnect;
	const resolveCustomDispatcherPolicy = (url) => {
		if (!needsCustomDispatcher || !scopedOrigin || url.origin !== scopedOrigin) return;
		customConnect ??= {
			...params.sslVerify === false ? { rejectUnauthorized: false } : {},
			...params.clientCert ? { cert: fs.readFileSync(params.clientCert, "utf-8") } : {},
			...params.clientKey ? { key: fs.readFileSync(params.clientKey, "utf-8") } : {}
		};
		return {
			mode: "direct",
			connect: customConnect
		};
	};
	return async (url, init) => {
		const request = resolveFetchRequest(url, init);
		const guarded = await fetchWithSsrFGuard({
			url: request.url,
			init: request.init,
			fetchImpl: fetchWithUndiciGuard,
			maxRedirects: MCP_HTTP_MAX_REDIRECTS,
			allowCrossOriginUnsafeRedirectReplay: true,
			auditContext: "mcp-http",
			useEnvProxyForEligibleUrls: true,
			...request.signal ? { signal: request.signal } : {},
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...policy ? { policy } : {},
			...needsCustomDispatcher ? { resolveDispatcherPolicy: resolveCustomDispatcherPolicy } : {}
		});
		return await buildManagedMcpResponse(guarded.response, guarded.release, guarded.refreshTimeout);
	};
}
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
function withoutMcpAuthorizationHeader(headers) {
	if (!headers) return;
	const entries = Object.entries(headers).filter(([key]) => key.toLowerCase() !== "authorization");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
function withSameOriginMcpHttpHeaders(params) {
	if (!params.headers || Object.keys(params.headers).length === 0) return params.fetchFn;
	const resourceOrigin = new URL(params.resourceUrl).origin;
	return (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(params.headers);
		for (const [key, value] of new Headers(init?.headers)) headers.set(key, value);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
//#endregion
//#region src/agents/mcp-oauth-provider.ts
/** MCP SDK OAuth provider backed by canonical OpenClaw state. */
const LEGACY_DEFAULT_REDIRECT_URL = "http://127.0.0.1:8989/oauth/callback";
function resolveTokenExpiresAt(tokens) {
	const expiresIn = tokens.expires_in;
	return typeof expiresIn === "number" && Number.isFinite(expiresIn) ? Date.now() + expiresIn * 1e3 : void 0;
}
function resolveOAuthRedirectUrl(config, store = {}) {
	return normalizeOptionalString(config.redirectUrl) ?? normalizeOptionalString(store.redirectUrl) ?? LEGACY_DEFAULT_REDIRECT_URL;
}
function buildOAuthClientMetadata(config, store = {}) {
	return {
		client_name: "OpenClaw MCP",
		redirect_uris: [resolveOAuthRedirectUrl(config, store)],
		grant_types: ["authorization_code", "refresh_token"],
		response_types: ["code"],
		token_endpoint_auth_method: "none",
		...normalizeOptionalString(config.scope) ? { scope: normalizeOptionalString(config.scope) } : {}
	};
}
function bindMcpOAuthLeaseAssertion(lease) {
	return lease ? (database) => lease.assertOwnedInTransaction(database) : void 0;
}
/** Bind OAuth network work to the lease that fences its persisted side effects. */
function withMcpOAuthLeaseSignal(fetchFn, leaseSignal) {
	const baseFetch = fetchFn ?? ((url, init) => fetch(url, init));
	return async (url, init) => {
		const requestSignal = init?.signal;
		const signal = requestSignal ? AbortSignal.any([requestSignal, leaseSignal]) : leaseSignal;
		return await baseFetch(url, {
			...init,
			signal
		});
	};
}
function beginMcpOAuthAuthorization(store) {
	const next = { ...store };
	if (next.credentialState === "uninitialized") delete next.credentialState;
	return next;
}
/** Creates the MCP SDK OAuth provider backed by canonical shared SQLite state. */
function createMcpOAuthClientProvider(params) {
	const config = params.config ?? {};
	const storeKey = params.identity.storeKey;
	const assertOwnedInTransaction = bindMcpOAuthLeaseAssertion(params.lease);
	const updateStore = (update) => updateMcpOAuthStore(storeKey, update, assertOwnedInTransaction);
	const assertAuthorizationRedirectAllowed = () => {
		if (params.allowAuthorizationRedirect !== true) throw new Error(`MCP server "${params.identity.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.identity.serverName}.`);
	};
	return {
		get redirectUrl() {
			return resolveOAuthRedirectUrl(config, readMcpOAuthStore(storeKey));
		},
		clientMetadataUrl: normalizeOptionalString(config.clientMetadataUrl),
		get clientMetadata() {
			return buildOAuthClientMetadata(config, readMcpOAuthStore(storeKey));
		},
		state() {
			assertAuthorizationRedirectAllowed();
			return randomUUID();
		},
		clientInformation() {
			return readMcpOAuthStore(storeKey).clientInformation;
		},
		saveClientInformation(clientInformation) {
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				clientInformation
			}));
		},
		tokens() {
			if (params.suppressStoredTokens) return;
			const store = readMcpOAuthStore(storeKey);
			const discoveredAuthorizationServerUrl = store.discoveryState?.authorizationServerUrl;
			if (!store.tokens?.refresh_token || discoveredAuthorizationServerUrl === void 0) return store.tokens;
			return store.tokensAuthorizationServerUrl !== void 0 && discoveredAuthorizationServerUrl === store.tokensAuthorizationServerUrl ? store.tokens : void 0;
		},
		saveTokens(tokens) {
			updateStore((store) => {
				const next = {
					...store,
					tokens
				};
				delete next.credentialState;
				delete next.pendingAuthorizationChallenge;
				const issuedBy = store.discoveryState?.authorizationServerUrl;
				if (issuedBy === void 0) delete next.tokensAuthorizationServerUrl;
				else next.tokensAuthorizationServerUrl = issuedBy;
				const tokenExpiresAt = resolveTokenExpiresAt(tokens);
				if (tokenExpiresAt === void 0) delete next.tokenExpiresAt;
				else next.tokenExpiresAt = tokenExpiresAt;
				return next;
			});
		},
		async redirectToAuthorization(authorizationUrl) {
			assertAuthorizationRedirectAllowed();
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				lastAuthorizationUrl: authorizationUrl.toString(),
				redirectUrl: resolveOAuthRedirectUrl(config, store)
			}));
		},
		saveCodeVerifier(codeVerifier) {
			assertAuthorizationRedirectAllowed();
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				codeVerifier
			}));
		},
		codeVerifier() {
			const codeVerifier = readMcpOAuthStore(storeKey).codeVerifier;
			if (!codeVerifier) throw new Error("Missing MCP OAuth code verifier. Run the login flow again.");
			return codeVerifier;
		},
		invalidateCredentials(scope) {
			updateStore((store) => {
				const next = { ...store };
				if (scope === "all" || scope === "client") delete next.clientInformation;
				if ((scope === "all" || scope === "tokens") && params.suppressStoredTokens !== true) {
					delete next.tokens;
					delete next.tokenExpiresAt;
					delete next.tokensAuthorizationServerUrl;
					next.credentialState = "cleared";
				}
				if (scope === "all" || scope === "verifier") delete next.codeVerifier;
				if (scope === "all" || scope === "discovery") delete next.discoveryState;
				return next;
			});
		},
		saveDiscoveryState(discoveryState) {
			updateStore((store) => ({
				...beginMcpOAuthAuthorization(store),
				discoveryState
			}));
		},
		discoveryState() {
			return readMcpOAuthStore(storeKey).discoveryState;
		}
	};
}
//#endregion
//#region src/agents/mcp-oauth.ts
/** MCP OAuth credential provider, flow coordinator, and login helpers. */
const LOCALHOST_REDIRECT_URL = "http://localhost:8989/oauth/callback";
const TOKEN_EXPIRY_SKEW_MS = 3e4;
const MCP_OAUTH_LEASE_MS = 6e4;
const MCP_OAUTH_LEASE_WAIT_MS = 3e4;
function isMcpOAuthRedirectRegistrationError(error) {
	return /invalid_client_metadata|redirect_uri/i.test(String(error));
}
async function withMcpOAuthLease(storeKey, run, signal) {
	return await withOpenClawStateLease({
		scope: "core:mcp-oauth",
		key: storeKey,
		database: { scope: "shared" },
		leaseMs: MCP_OAUTH_LEASE_MS,
		waitMs: MCP_OAUTH_LEASE_WAIT_MS,
		...signal ? { signal } : {}
	}, run);
}
function mcpOAuthAdditionalAuthorizationError(serverName) {
	return /* @__PURE__ */ new Error(`MCP server "${serverName}" requires additional OAuth authorization. Run openclaw mcp login ${serverName}.`);
}
function bindMcpOAuthTokensIssuer(store) {
	const issuedBy = store.discoveryState?.authorizationServerUrl;
	if (!store.tokens?.refresh_token || store.tokensAuthorizationServerUrl !== void 0 || issuedBy === void 0) return store;
	return {
		...store,
		tokensAuthorizationServerUrl: issuedBy
	};
}
function applyMcpOAuthAuthorizationChallenge(current, params) {
	const next = {
		...current,
		pendingAuthorizationChallenge: {
			...current.pendingAuthorizationChallenge,
			...params.resourceMetadataUrl ? { resourceMetadataUrl: params.resourceMetadataUrl } : {},
			...params.scope ? { scope: params.scope } : {},
			...params.requiresAuthorization ? { requiresAuthorization: true } : {}
		}
	};
	if (current.credentialState === void 0 && current.tokens === void 0 && current.clientInformation === void 0 && current.codeVerifier === void 0 && current.discoveryState === void 0 && current.lastAuthorizationUrl === void 0 && current.redirectUrl === void 0) next.credentialState = "uninitialized";
	if (params.resourceMetadataUrl && current.discoveryState?.resourceMetadataUrl !== params.resourceMetadataUrl) {
		const bound = bindMcpOAuthTokensIssuer(next);
		delete bound.discoveryState;
		return bound;
	}
	return next;
}
async function resolveMcpOAuthAccessToken(params) {
	const storeKey = params.identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease) => {
		const store = readMcpOAuthStore(storeKey);
		const tokens = store.tokens;
		const rejectedCurrentToken = params.rejectedAccessToken === tokens?.access_token;
		const challengeAppliesToCurrentState = !tokens?.access_token || rejectedCurrentToken;
		if (params.authorizationChallenge === true && challengeAppliesToCurrentState) {
			const resourceMetadataUrl = params.resourceMetadataUrl?.toString();
			const scope = normalizeOptionalString(params.scope);
			if (resourceMetadataUrl || scope || params.interactiveAuthorizationRequired === true) updateMcpOAuthStore(storeKey, (current) => applyMcpOAuthAuthorizationChallenge(current, {
				resourceMetadataUrl,
				scope,
				...params.interactiveAuthorizationRequired === true ? { requiresAuthorization: true } : {}
			}), bindMcpOAuthLeaseAssertion(lease));
		}
		if (params.authorizationChallenge === true && params.interactiveAuthorizationRequired === true && challengeAppliesToCurrentState) throw mcpOAuthAdditionalAuthorizationError(params.identity.serverName);
		if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) throw mcpOAuthAdditionalAuthorizationError(params.identity.serverName);
		if (!tokens?.access_token) {
			if (params.allowMissingToken === true) return;
			throw new Error(`MCP server "${params.identity.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.identity.serverName}.`);
		}
		const tokenIsFresh = store.tokenExpiresAt !== void 0 && store.tokenExpiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS;
		if (!rejectedCurrentToken && (tokenIsFresh || store.tokenExpiresAt === void 0 && (params.acceptUnknownExpiry === true || !tokens.refresh_token))) return tokens.access_token;
		if (!tokens.refresh_token) throw new Error(`MCP server "${params.identity.serverName}" has expired OAuth credentials. Run openclaw mcp login ${params.identity.serverName}.`);
		const pendingChallenge = store.pendingAuthorizationChallenge;
		updateMcpOAuthStore(storeKey, bindMcpOAuthTokensIssuer, bindMcpOAuthLeaseAssertion(lease));
		const provider = createMcpOAuthClientProvider({
			identity: params.identity,
			config: params.config,
			lease
		});
		const result = await auth(provider, {
			serverUrl: params.identity.serverUrl,
			resourceMetadataUrl: params.resourceMetadataUrl ?? (pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0),
			scope: params.scope ?? normalizeOptionalString(pendingChallenge?.scope) ?? normalizeOptionalString(params.config?.scope),
			fetchFn: withMcpOAuthLeaseSignal(params.fetchFn, lease.signal)
		});
		lease.assertOwned();
		const refreshedTokens = await provider.tokens();
		if (result !== "AUTHORIZED" || !refreshedTokens?.access_token) throw new Error(`MCP server "${params.identity.serverName}" could not refresh OAuth credentials. Run openclaw mcp login ${params.identity.serverName}.`);
		return refreshedTokens.access_token;
	}, params.signal);
}
/** Persist a terminal resource rejection without overwriting newer credentials. */
async function recordMcpOAuthAuthorizationRequired(params) {
	const storeKey = params.identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease) => {
		if (readMcpOAuthStore(storeKey).tokens?.access_token !== params.rejectedAccessToken) return false;
		let recorded = false;
		updateMcpOAuthStore(storeKey, (current) => {
			if (current.tokens?.access_token !== params.rejectedAccessToken) return current;
			recorded = true;
			return applyMcpOAuthAuthorizationChallenge(current, {
				resourceMetadataUrl: params.resourceMetadataUrl?.toString(),
				scope: normalizeOptionalString(params.scope),
				requiresAuthorization: true
			});
		}, bindMcpOAuthLeaseAssertion(lease));
		return recorded;
	}, params.signal);
}
/** Deletes one OAuth session without racing an in-flight refresh or login. */
async function clearMcpOAuthCredentials(identity) {
	await clearMcpOAuthStoreKey(identity.storeKey);
}
async function clearMcpOAuthStoreKey(storeKey) {
	await withMcpOAuthLease(storeKey, async (lease) => {
		clearMcpOAuthStore(storeKey, bindMcpOAuthLeaseAssertion(lease));
	});
}
/** Clear operator and requester credentials bound to one configured server URL. */
async function clearMcpOAuthServer(identity) {
	await clearMcpOAuthStoreKey(identity.storeKey);
	await clearMcpOAuthRequesters(identity);
}
/** Clear requester credentials without changing the operator row for this server URL. */
async function clearMcpOAuthRequesters(identity) {
	const prefix = requesterMcpOAuthStoreKeyPrefix(identity.serverName, identity.serverUrl);
	const requesterKeys = listMcpOAuthStoreKeysByPrefix(prefix);
	for (const storeKey of requesterKeys) await clearMcpOAuthStoreKey(storeKey);
	deleteMcpOAuthPendingAuthorizationsByPrefix(prefix);
}
/** Count authorized requester principals for one configured server URL. */
function countMcpOAuthPrincipals(identity) {
	return listMcpOAuthStoreKeysByPrefix(requesterMcpOAuthStoreKeyPrefix(identity.serverName, identity.serverUrl)).filter((storeKey) => readMcpOAuthStoreReadOnly(storeKey).tokens !== void 0).length;
}
/** Reads stored OAuth credential presence without exposing values or creating state. */
async function readMcpOAuthCredentialsStatus(identity) {
	const store = readMcpOAuthStoreReadOnly(identity.storeKey);
	if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) return { state: "requires-authorization" };
	if (store.tokens) return {
		state: "authorized",
		...store.tokenExpiresAt === void 0 ? {} : { expiresAt: store.tokenExpiresAt }
	};
	if (store.clientInformation || store.codeVerifier || store.discoveryState || store.lastAuthorizationUrl || store.redirectUrl || store.pendingAuthorizationChallenge) return { state: "pending-authorization" };
	return { state: "unauthenticated" };
}
function buildMcpOAuthAuthorizationFetch(config) {
	return withSameOriginMcpHttpHeaders({
		fetchFn: buildMcpHttpFetch({
			sslVerify: config.sslVerify,
			clientCert: config.clientCert,
			clientKey: config.clientKey,
			resourceUrl: config.url,
			timeoutMs: config.requestTimeoutMs
		}),
		headers: withoutMcpAuthorizationHeader(config.headers),
		resourceUrl: config.url
	});
}
async function runMcpOAuthAuthorizationAttempt(params, lease) {
	const result = await auth(createMcpOAuthClientProvider({
		identity: params.identity,
		config: params.config,
		allowAuthorizationRedirect: true,
		suppressStoredTokens: params.suppressStoredTokens,
		lease
	}), {
		serverUrl: params.identity.serverUrl,
		authorizationCode: normalizeOptionalString(params.authorizationCode),
		resourceMetadataUrl: params.resourceMetadataUrl,
		scope: normalizeOptionalString(params.scope) ?? normalizeOptionalString(params.config?.scope),
		fetchFn: withMcpOAuthLeaseSignal(params.fetchFn, lease.signal)
	});
	lease.assertOwned();
	return result === "AUTHORIZED" ? "authorized" : "redirect";
}
async function startMcpOAuthAuthorization(identity, config, opts) {
	const storeKey = identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease) => {
		const store = readMcpOAuthStore(storeKey);
		const pendingChallenge = store.pendingAuthorizationChallenge;
		const configuredRedirectUrl = normalizeOptionalString(opts.redirectUrl) ?? normalizeOptionalString(config.oauth?.redirectUrl) ?? store.redirectUrl;
		const attempt = {
			identity,
			config: {
				...config.oauth,
				...configuredRedirectUrl ? { redirectUrl: configuredRedirectUrl } : {}
			},
			fetchFn: buildMcpOAuthAuthorizationFetch(config),
			resourceMetadataUrl: pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0,
			scope: normalizeOptionalString(pendingChallenge?.scope),
			suppressStoredTokens: pendingChallenge?.requiresAuthorization === true
		};
		let result;
		try {
			result = await runMcpOAuthAuthorizationAttempt(attempt, lease);
		} catch (error) {
			if (!normalizeOptionalString(opts.redirectUrl) && !normalizeOptionalString(config.oauth?.redirectUrl) && isMcpOAuthRedirectRegistrationError(error)) result = await runMcpOAuthAuthorizationAttempt({
				...attempt,
				config: {
					...config.oauth,
					redirectUrl: LOCALHOST_REDIRECT_URL
				}
			}, lease);
			else throw error;
		}
		if (result === "authorized") return { status: "authorized" };
		const pending = readMcpOAuthStore(storeKey);
		const authorizationUrl = pending.lastAuthorizationUrl;
		const state = authorizationUrl ? new URL(authorizationUrl).searchParams.get("state") : null;
		if (!authorizationUrl || !pending.codeVerifier || !pending.redirectUrl || !state) throw new Error("MCP OAuth authorization session was not persisted.");
		writeMcpOAuthPendingAuthorization(storeKey, state, bindMcpOAuthLeaseAssertion(lease));
		return {
			status: "redirect",
			authorizationUrl,
			redirectUrl: pending.redirectUrl,
			state
		};
	});
}
async function completeMcpOAuthAuthorization(identity, config, input) {
	const storeKey = identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease) => {
		return await completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease);
	});
}
function readMcpOAuthAuthorizationState(authorizationUrl) {
	if (!authorizationUrl) return;
	try {
		return normalizeOptionalString(new URL(authorizationUrl).searchParams.get("state"));
	} catch {
		return;
	}
}
async function completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease) {
	const storeKey = identity.storeKey;
	const store = readMcpOAuthStore(storeKey);
	if (!store.codeVerifier || !store.redirectUrl) throw new Error("Missing MCP OAuth authorization session. Run the login flow again.");
	const pendingChallenge = store.pendingAuthorizationChallenge;
	await runMcpOAuthAuthorizationAttempt({
		identity,
		config: {
			...config.oauth,
			redirectUrl: store.redirectUrl
		},
		fetchFn: buildMcpOAuthAuthorizationFetch(config),
		authorizationCode: input.code,
		resourceMetadataUrl: pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0,
		scope: normalizeOptionalString(pendingChallenge?.scope),
		suppressStoredTokens: pendingChallenge?.requiresAuthorization === true
	}, lease);
	const assertLeaseOwned = bindMcpOAuthLeaseAssertion(lease);
	updateMcpOAuthStore(storeKey, (current) => {
		const next = { ...current };
		delete next.codeVerifier;
		delete next.lastAuthorizationUrl;
		delete next.redirectUrl;
		return next;
	}, assertLeaseOwned);
	deleteMcpOAuthPendingAuthorization(storeKey, assertLeaseOwned);
	return "authorized";
}
/** Claims one callback state and completes its exchange under the same store lease. */
async function completeOAuthCallback(identity, config, input) {
	return await withMcpOAuthLease(identity.storeKey, async (lease) => {
		const assertLeaseOwned = bindMcpOAuthLeaseAssertion(lease);
		if (!consumeOAuthState(identity.storeKey, input.state, assertLeaseOwned)) return "expired";
		if (readMcpOAuthAuthorizationState(readMcpOAuthStore(identity.storeKey).lastAuthorizationUrl) !== input.state) return "expired";
		return await completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease);
	});
}
//#endregion
export { completeOAuthCallback as a, recordMcpOAuthAuthorizationRequired as c, buildMcpHttpFetch as d, withSameOriginMcpHttpHeaders as f, completeMcpOAuthAuthorization as i, resolveMcpOAuthAccessToken as l, clearMcpOAuthRequesters as n, countMcpOAuthPrincipals as o, withoutMcpAuthorizationHeader as p, clearMcpOAuthServer as r, readMcpOAuthCredentialsStatus as s, clearMcpOAuthCredentials as t, startMcpOAuthAuthorization as u };
