import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { g as getActivePluginSessionExtensionRegistry } from "./runtime-B2KAtS3O.js";
import { a as READ_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BQC2sTma.js";
import { a as resolveCachedGitHubIdentity, t as classifyTailscaleLogin, x as normalizeGitHubLogin } from "./user-profiles-tailscale-login-kvQH2eWv.js";
import { f as syncGitHubIdentity } from "./user-profiles-CBL8neN1.js";
import "./control-ui-contract-CgrOMhfo.js";
import { a as resolvePluginRoutePathContext, t as findMatchingPluginHttpRoutes } from "./route-match-Vz3WZJuX.js";
import { d as readBoundedResponse, f as readGitHubJsonResponse, i as GITHUB_REQUEST_TIMEOUT_MS, n as ControlUiGitHubError, o as fetchGitHubApi, r as GITHUB_API_ORIGIN, s as fetchGitHubJson } from "./control-ui-github-api-DURS8eJ_.js";
//#region src/gateway/control-ui-plugin-frame-contract.ts
/** Lifetime shared by server-minted plugin-tab grants and parent-side renewal. */
const CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS = 300 * 1e3;
/** Reserved query key for the sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY = "__openclaw_plugin_frame_auth_probe";
/** Exact parent origin that may receive the successful probe message. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY = "__openclaw_plugin_frame_auth_origin";
/** Message emitted only by a successful sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE = "openclaw-plugin-frame-auth-probe";
/** Extracts the same-origin route pathname from a tab descriptor URL. */
function resolveControlUiPluginTabPathname(path) {
	try {
		const baseUrl = new URL("http://openclaw.invalid");
		const tabUrl = new URL(path, baseUrl);
		return tabUrl.origin === baseUrl.origin ? tabUrl.pathname : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/control-ui-plugin-tabs.ts
const CORE_CONTROL_UI_WIDGET_KINDS = [{
	pluginId: "session",
	kind: "session:progress",
	label: "Session progress"
}];
function findControlUiTabGatewayRoute(registry, tab) {
	if (!tab.path) return;
	const routePath = resolveControlUiPluginTabPathname(tab.path);
	if (!routePath) return;
	const route = findMatchingPluginHttpRoutes(registry, resolvePluginRoutePathContext(routePath)).find((candidate) => candidate.auth === "gateway");
	if (!route) return;
	return route.pluginId === tab.pluginId ? route : null;
}
/** Pure projection of tab descriptors visible to the presented scopes. */
function projectControlUiPluginTabs(entries, scopes) {
	const tabs = [];
	for (const entry of entries) {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "tab") continue;
		if (!(descriptor.requiredScopes ?? []).every((scope) => authorizeOperatorScopesForRequiredScope(scope, scopes).allowed)) continue;
		tabs.push({
			pluginId: entry.pluginId,
			id: descriptor.id,
			label: descriptor.label,
			description: descriptor.description,
			icon: descriptor.icon,
			path: descriptor.path,
			placement: descriptor.placement,
			group: descriptor.group,
			order: descriptor.order
		});
	}
	return tabs.toSorted((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.label.localeCompare(right.label) || left.id.localeCompare(right.id));
}
/** Lists active plugins' tab descriptors visible to the presented scopes. */
function listControlUiPluginTabs(scopes, opts = {}) {
	const registry = getActivePluginSessionExtensionRegistry();
	return projectControlUiPluginTabs(registry?.controlUiDescriptors ?? [], scopes).flatMap((tab) => {
		const route = registry ? findControlUiTabGatewayRoute(registry, tab) : void 0;
		if (route === null) return [];
		return route && opts.requireGatewayAuthGrant !== false ? [{
			...tab,
			requiresGatewayAuth: true
		}] : [tab];
	});
}
/** Lists active plugins' trusted widget kinds visible to the presented scopes. */
function listControlUiPluginWidgetKinds(scopes) {
	const entries = getActivePluginSessionExtensionRegistry()?.controlUiDescriptors ?? [];
	const coreEntries = authorizeOperatorScopesForRequiredScope("operator.read", scopes).allowed ? CORE_CONTROL_UI_WIDGET_KINDS : [];
	const pluginEntries = entries.flatMap((entry) => {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "widget") return [];
		return (descriptor.requiredScopes ?? []).every((scope) => authorizeOperatorScopesForRequiredScope(scope, scopes).allowed) ? [{
			pluginId: entry.pluginId,
			kind: `${entry.pluginId}:${descriptor.id}`,
			label: descriptor.label
		}] : [];
	});
	return [...coreEntries, ...pluginEntries].toSorted((left, right) => left.label.localeCompare(right.label) || left.kind.localeCompare(right.kind));
}
/** Builds least-privilege grants only for visible tabs backed by same-plugin gateway routes. */
function listControlUiPluginTabAuthGrants(callerScopes) {
	const registry = getActivePluginSessionExtensionRegistry();
	if (!registry || !authorizeOperatorScopesForRequiredScope("operator.read", callerScopes).allowed) return [];
	const grants = /* @__PURE__ */ new Map();
	for (const tab of projectControlUiPluginTabs(registry.controlUiDescriptors ?? [], callerScopes)) {
		if (!tab.path) continue;
		const route = findControlUiTabGatewayRoute(registry, tab);
		if (!route) continue;
		const key = `${tab.pluginId}\n${route.path}`;
		const existing = grants.get(key);
		if (existing) {
			if (existing.match === "exact" && route.match === "prefix") grants.set(key, {
				...existing,
				match: "prefix"
			});
			continue;
		}
		grants.set(key, {
			pluginId: tab.pluginId,
			path: route.path,
			match: route.match,
			scopes: [READ_SCOPE]
		});
	}
	return [...grants.values()];
}
//#endregion
//#region src/gateway/github-user-identity.ts
const CLOUDFLARE_ACCESS_USER_HEADER = "cf-access-authenticated-user-email";
const CLOUDFLARE_ACCESS_ASSERTION_HEADER = "cf-access-jwt-assertion";
const CLOUDFLARE_ACCESS_HOST_SUFFIX = ".cloudflareaccess.com";
const CLOUDFLARE_ACCESS_IDENTITY_PATH = "/cdn-cgi/access/get-identity";
const ACCESS_ASSERTION_MAX_BYTES = 16 * 1024;
const ACCESS_IDENTITY_MAX_BYTES = 64 * 1024;
const JWT_SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/u;
function headerValue(value) {
	return Array.isArray(value) ? value[0] : value;
}
function cloudflareAccessIssuer(assertion) {
	if (Buffer.byteLength(assertion, "utf8") > ACCESS_ASSERTION_MAX_BYTES) throw new Error("Cloudflare Access assertion is invalid");
	const segments = assertion.split(".");
	if (segments.length !== 3 || segments.some((segment) => !JWT_SEGMENT_PATTERN.test(segment))) throw new Error("Cloudflare Access assertion is invalid");
	let payload;
	try {
		payload = JSON.parse(Buffer.from(segments[1], "base64url").toString("utf8"));
	} catch {
		throw new Error("Cloudflare Access assertion is invalid");
	}
	if (!isRecord(payload) || typeof payload.iss !== "string") throw new Error("Cloudflare Access assertion issuer is invalid");
	let issuer;
	try {
		issuer = new URL(payload.iss);
	} catch {
		throw new Error("Cloudflare Access assertion issuer is invalid");
	}
	if (issuer.protocol !== "https:" || issuer.username || issuer.password || issuer.port || issuer.pathname !== "/" || issuer.search || issuer.hash || !issuer.hostname.endsWith(CLOUDFLARE_ACCESS_HOST_SUFFIX)) throw new Error("Cloudflare Access assertion issuer is invalid");
	return issuer;
}
async function resolveCloudflareAccessIdentity(assertion, authenticatedPrincipal) {
	const issuer = cloudflareAccessIssuer(assertion);
	let payload;
	try {
		const response = await fetch(`${issuer.origin}${CLOUDFLARE_ACCESS_IDENTITY_PATH}`, {
			headers: { Cookie: `CF_Authorization=${assertion}` },
			redirect: "manual",
			signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS)
		});
		if (!response.ok) {
			await response.body?.cancel().catch(() => {});
			throw new Error("identity response was not successful");
		}
		const body = await readBoundedResponse(response, ACCESS_IDENTITY_MAX_BYTES);
		payload = JSON.parse(body.toString("utf8"));
	} catch {
		throw new Error("Cloudflare Access identity lookup failed");
	}
	if (!isRecord(payload)) throw new Error("Cloudflare Access identity response is invalid");
	const email = typeof payload.email === "string" ? payload.email.trim() : "";
	if (!email || email.toLowerCase() !== authenticatedPrincipal.trim().toLowerCase()) throw new Error("Cloudflare Access identity principal did not match");
	if (!isRecord(payload.idp) || payload.idp.type !== "github") throw new Error("Cloudflare Access identity is not GitHub-backed");
	if (typeof payload.id !== "number" || !Number.isSafeInteger(payload.id) || payload.id <= 0) throw new Error("Cloudflare Access GitHub account id is invalid");
	const initialDisplayName = typeof payload.name === "string" && payload.name.trim() ? payload.name : void 0;
	return {
		accountId: payload.id,
		...initialDisplayName ? { initialDisplayName } : {}
	};
}
async function resolveGitHubUserIdentityByLogin(username) {
	const requestedLogin = normalizeGitHubLogin(username);
	if (!requestedLogin) throw new TypeError("GitHub username is invalid");
	let payload;
	try {
		payload = await fetchGitHubJson(`${GITHUB_API_ORIGIN}/users/${encodeURIComponent(requestedLogin)}`, fetch, void 0);
	} catch (error) {
		if (error instanceof ControlUiGitHubError) throw error;
		throw new ControlUiGitHubError(502, "GitHub request failed");
	}
	if (!isRecord(payload)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
	const accountId = payload.id;
	const login = typeof payload.login === "string" ? normalizeGitHubLogin(payload.login) : void 0;
	if (!Number.isSafeInteger(accountId) || typeof accountId !== "number" || accountId <= 0) throw new ControlUiGitHubError(502, "GitHub response omitted a valid account id");
	if (!login) throw new ControlUiGitHubError(502, "GitHub response omitted a valid login");
	return {
		accountId,
		login
	};
}
function resolveGitHubUserIdentityById(accountId, payload) {
	if (!isRecord(payload) || payload.id !== accountId) throw new ControlUiGitHubError(502, "GitHub account id did not match");
	const login = typeof payload.login === "string" ? normalizeGitHubLogin(payload.login) : void 0;
	if (!login) throw new ControlUiGitHubError(502, "GitHub response omitted a valid login");
	return {
		accountId,
		login
	};
}
function retryableConnectionSync(sync) {
	let inFlight;
	let completed;
	return () => {
		if (completed) return Promise.resolve(completed);
		if (inFlight) return inFlight;
		const current = sync().then((result) => {
			completed = result;
			return result;
		});
		inFlight = current;
		current.then(() => {
			inFlight = void 0;
		}, () => {
			inFlight = void 0;
		});
		return current;
	};
}
function cloudflareAccessAssertion(params) {
	const trustedProxy = params.authConfig?.trustedProxy;
	if (!params.authResult.ok || params.authResult.method !== "trusted-proxy" || params.authConfig?.mode !== "trusted-proxy" || normalizeLowercaseStringOrEmpty(trustedProxy?.userHeader) !== CLOUDFLARE_ACCESS_USER_HEADER || !trustedProxy?.requiredHeaders?.some((header) => normalizeLowercaseStringOrEmpty(header) === CLOUDFLARE_ACCESS_ASSERTION_HEADER)) return;
	const principal = params.authResult.user?.trim();
	const assertion = headerValue(params.requestHeaders?.[CLOUDFLARE_ACCESS_ASSERTION_HEADER])?.trim();
	return principal && assertion ? {
		assertion,
		principal
	} : void 0;
}
function createAuthenticatedGitHubIdentitySync(params) {
	const tailscaleLogin = params.authResult.tailscaleIdentity ? classifyTailscaleLogin(params.authResult.tailscaleIdentity.login) : void 0;
	if (tailscaleLogin?.kind === "provider" && tailscaleLogin.provider === "github") return retryableConnectionSync(async () => {
		const profile = syncGitHubIdentity({
			identity: await resolveGitHubUserIdentityByLogin(tailscaleLogin.subject),
			authenticationAlias: {
				kind: "github-login",
				login: tailscaleLogin.subject
			},
			initialDisplayName: params.authResult.tailscaleIdentity?.name
		});
		return {
			profileId: profile.id,
			updatedAt: profile.updatedAt
		};
	});
	const access = cloudflareAccessAssertion(params);
	if (!access) return;
	return retryableConnectionSync(async () => {
		const accessIdentity = await resolveCloudflareAccessIdentity(access.assertion, access.principal);
		let response;
		let payload;
		try {
			response = await fetchGitHubApi(`${GITHUB_API_ORIGIN}/user/${accessIdentity.accountId}`, fetch);
			payload = await readGitHubJsonResponse(response);
		} catch (error) {
			if (response ? response.status === 429 || response.status >= 500 || error instanceof ControlUiGitHubError && error.statusCode === 429 : !(error instanceof ControlUiGitHubError)) {
				const cached = resolveCachedGitHubIdentity({
					accountId: accessIdentity.accountId,
					email: access.principal
				});
				if (cached) return cached;
			}
			throw error instanceof ControlUiGitHubError ? error : new ControlUiGitHubError(502, "GitHub request failed");
		}
		const profile = syncGitHubIdentity({
			identity: resolveGitHubUserIdentityById(accessIdentity.accountId, payload),
			authenticationAlias: {
				kind: "email",
				email: access.principal
			},
			initialDisplayName: accessIdentity.initialDisplayName
		});
		return {
			profileId: profile.id,
			updatedAt: profile.updatedAt
		};
	});
}
//#endregion
export { CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS as a, CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY as c, listControlUiPluginWidgetKinds as i, listControlUiPluginTabAuthGrants as n, CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE as o, listControlUiPluginTabs as r, CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY as s, createAuthenticatedGitHubIdentitySync as t };
