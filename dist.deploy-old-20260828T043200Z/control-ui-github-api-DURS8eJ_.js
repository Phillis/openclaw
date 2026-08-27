import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { f as readResponseWithLimit } from "./http-body-DthsuKdw.js";
import { a as getRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-D5EZZ925.js";
import { createHash } from "node:crypto";
//#region src/gateway/control-ui-github-api.ts
const GITHUB_API_ORIGIN = "https://api.github.com";
const CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE = "The configured Control UI GitHub credential is unavailable. Resolve gateway.controlUi.github.token and retry.";
const GITHUB_JSON_MAX_BYTES = 256 * 1024;
const GITHUB_REQUEST_TIMEOUT_MS = 8e3;
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_API_MAX_REDIRECTS = 3;
var ControlUiGitHubError = class extends Error {
	constructor(statusCode, message) {
		super(message);
		this.name = "ControlUiGitHubError";
		this.statusCode = statusCode;
	}
};
function requiredString(record, key) {
	const value = readNonBlankString(record[key]);
	if (value === void 0) throw new ControlUiGitHubError(502, `GitHub response omitted ${key}`);
	return value;
}
function readOptionalGitHubString(record, key) {
	return readNonBlankString(record[key]);
}
function optionalNumber(record, key) {
	return asFiniteNumber(record[key]);
}
function githubApiToken(env = process.env, config = getRuntimeConfigSnapshot()) {
	const configured = config?.gateway?.controlUi?.github?.token;
	if (configured !== void 0) {
		assertSecretOwnerAvailable("capability", "control-ui-github");
		const token = typeof configured === "string" ? configured.trim() : "";
		if (!token) throw new SecretSurfaceUnavailableError({
			ownerKind: "capability",
			ownerId: "control-ui-github",
			state: "unavailable",
			paths: ["gateway.controlUi.github.token"],
			refKeys: [],
			reason: "secret reference was not materialized by the active runtime"
		});
		return token;
	}
	return env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim() || void 0;
}
/** Raw-config inspection for doctor; it never consults process-global runtime degradation state. */
function hasConfiguredGitHubApiCredential(env, config) {
	return config.gateway?.controlUi?.github?.token !== void 0 || Boolean(env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim());
}
/** Captures the effective token and a non-secret cache scope from the same env snapshot. */
function resolveGitHubApiCredentialScope(env = process.env) {
	const token = githubApiToken(env);
	return {
		token,
		cacheScope: token ? createHash("sha256").update(token).digest("hex") : "anonymous"
	};
}
function githubApiHeaders(token) {
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "OpenClaw-Control-UI",
		"X-GitHub-Api-Version": GITHUB_API_VERSION
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}
function isGitHubApiRedirect(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function safeGitHubApiUrl(raw, base) {
	try {
		const url = new URL(raw, base);
		if (url.origin !== "https://api.github.com" || url.username || url.password || url.port) return null;
		return url;
	} catch {
		return null;
	}
}
async function fetchGitHubApi(rawUrl, fetchImpl, token, beforeRedirect) {
	const initialUrl = safeGitHubApiUrl(rawUrl);
	if (!initialUrl) throw new ControlUiGitHubError(502, "Invalid GitHub API URL");
	let url = initialUrl;
	const signal = AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS);
	for (let redirects = 0;; redirects += 1) {
		const response = await fetchImpl(url.href, {
			headers: githubApiHeaders(token),
			redirect: "manual",
			signal
		});
		if (!isGitHubApiRedirect(response.status)) return response;
		const location = response.headers.get("location");
		const nextUrl = location ? safeGitHubApiUrl(location, url) : null;
		if (!nextUrl || redirects >= GITHUB_API_MAX_REDIRECTS) {
			await discardResponse(response);
			throw new ControlUiGitHubError(502, "GitHub API returned an unsafe redirect");
		}
		await discardResponse(response);
		await beforeRedirect?.(nextUrl);
		url = nextUrl;
	}
}
async function discardResponse(response) {
	await response.body?.cancel().catch(() => {});
}
async function readBoundedResponse(response, maxBytes) {
	try {
		return await readResponseWithLimit(response, maxBytes);
	} finally {
		await discardResponse(response);
	}
}
function isGitHubRateLimitResponse(response) {
	if (response.status === 429) return true;
	return response.status === 403 && (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after"));
}
function githubResponseErrorStatus(response) {
	if (isGitHubRateLimitResponse(response)) return 429;
	if (response.status === 401 || response.status === 403 || response.status === 404) return response.status;
	return 502;
}
async function withOptionalGitHubAuth(token, request) {
	try {
		return await request(token);
	} catch (error) {
		const status = error instanceof ControlUiGitHubError ? error.statusCode : 0;
		if (token && [
			401,
			403,
			429
		].includes(status)) return request(void 0);
		throw error;
	}
}
async function readGitHubJsonResponse(response) {
	if (!response.ok) {
		const status = githubResponseErrorStatus(response);
		await discardResponse(response);
		throw new ControlUiGitHubError(status, `GitHub request failed (${response.status})`);
	}
	const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
	try {
		return JSON.parse(body.toString("utf8"));
	} catch {
		throw new ControlUiGitHubError(502, "GitHub response was not valid JSON");
	}
}
/** Fetch a GitHub API JSON document with bounded size and normalized errors. */
function fetchGitHubJson(rawUrl, fetchImpl, token) {
	return withOptionalGitHubAuth(token, async (requestToken) => readGitHubJsonResponse(await fetchGitHubApi(rawUrl, fetchImpl, requestToken)));
}
//#endregion
export { discardResponse as a, githubApiToken as c, readBoundedResponse as d, readGitHubJsonResponse as f, withOptionalGitHubAuth as g, resolveGitHubApiCredentialScope as h, GITHUB_REQUEST_TIMEOUT_MS as i, hasConfiguredGitHubApiCredential as l, requiredString as m, ControlUiGitHubError as n, fetchGitHubApi as o, readOptionalGitHubString as p, GITHUB_API_ORIGIN as r, fetchGitHubJson as s, CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE as t, optionalNumber as u };
