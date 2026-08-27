import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as readResponseWithLimit } from "./http-body-DthsuKdw.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-Dt4YqBT2.js";
import { c as resolveOAuthTokenExpiresAt, l as resolveOAuthTokenLifetimeMs, u as throwIfOAuthLoginAborted } from "./provider-oauth-runtime-BEQhnGT0.js";
import "./response-limit-runtime-Dd4g9Wqb.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./ssrf-runtime-CIuLn0o4.js";
//#region extensions/openai/openai-chatgpt-oauth-token.runtime.ts
const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
const TOKEN_URL = "https://auth.openai.com/oauth/token";
const OAUTH_TOKEN_SSRF_POLICY = {
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true,
	hostnameAllowlist: ["auth.openai.com"]
};
const TOKEN_REQUEST_TIMEOUT_MS = 3e4;
const OAUTH_TOKEN_RESPONSE_BODY_LIMIT_BYTES = 1 * 1024 * 1024;
function formatMissingTokenResponseFields(json, existingRefreshToken) {
	const missing = [];
	if (!json.access_token) missing.push("access_token");
	if (!json.refresh_token && !existingRefreshToken) missing.push("refresh_token");
	if (resolveOAuthTokenLifetimeMs(json.expires_in) === void 0) missing.push("expires_in");
	return missing.join(", ");
}
function formatTokenRequestError(operation, error, timeoutMs, signal) {
	if (signal?.aborted) return "Login cancelled";
	if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return `OpenAI Codex token ${operation} timed out after ${timeoutMs}ms`;
	return `OpenAI Codex token ${operation} error: ${error instanceof Error ? error.message : String(error)}`;
}
async function postTokenForm(body, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	throwIfOAuthLoginAborted(options.signal);
	const { response, release } = await fetchWithSsrFGuard({
		url: TOKEN_URL,
		policy: OAUTH_TOKEN_SSRF_POLICY,
		init: {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body
		},
		timeoutMs,
		signal: options.signal,
		auditContext: "openai-chatgpt-oauth-token"
	});
	try {
		const responseBody = await readResponseWithLimit(response, OAUTH_TOKEN_RESPONSE_BODY_LIMIT_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`OpenAI Codex OAuth token response body too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
		return new Response(new Uint8Array(responseBody), {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	} finally {
		await release();
	}
}
async function readOpenAITokenResponse(response, operation, existingRefreshToken) {
	if (!response.ok) {
		const text = await response.text().catch(() => "");
		return {
			type: "failed",
			status: response.status,
			message: `OpenAI Codex token ${operation} failed (${response.status}): ${text || response.statusText}`
		};
	}
	let json;
	try {
		json = await response.json();
	} catch {
		return {
			type: "failed",
			message: `OpenAI Codex token ${operation} failed: response is not valid JSON`
		};
	}
	if (!isRecord(json)) return {
		type: "failed",
		message: `OpenAI Codex token ${operation} failed: expected JSON object response`
	};
	const expires = resolveOAuthTokenExpiresAt(json.expires_in);
	const refreshToken = json.refresh_token || existingRefreshToken;
	if (!json.access_token || !refreshToken || expires === void 0) return {
		type: "failed",
		message: `OpenAI Codex token ${operation} response missing fields: ${formatMissingTokenResponseFields(json, existingRefreshToken)}`
	};
	return {
		type: "success",
		access: json.access_token,
		refresh: refreshToken,
		expires
	};
}
async function exchangeOpenAIAuthorizationCode(code, verifier, redirectUri, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	let response;
	try {
		response = await postTokenForm(new URLSearchParams({
			grant_type: "authorization_code",
			client_id: CLIENT_ID,
			code,
			code_verifier: verifier,
			redirect_uri: redirectUri
		}), {
			signal: options.signal,
			timeoutMs
		});
	} catch (error) {
		return {
			type: "failed",
			message: formatTokenRequestError("exchange", error, timeoutMs, options.signal)
		};
	}
	return await readOpenAITokenResponse(response, "exchange");
}
async function refreshOpenAIAccessToken(refreshToken, options = {}) {
	const timeoutMs = options.timeoutMs ?? TOKEN_REQUEST_TIMEOUT_MS;
	try {
		return await readOpenAITokenResponse(await postTokenForm(new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: CLIENT_ID
		}), {
			signal: options.signal,
			timeoutMs
		}), "refresh", refreshToken);
	} catch (error) {
		return {
			type: "failed",
			message: formatTokenRequestError("refresh", error, timeoutMs, options.signal)
		};
	}
}
//#endregion
export { refreshOpenAIAccessToken as n, exchangeOpenAIAuthorizationCode as t };
