import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.js";
import { u as formatSlackBotTokenIdentityWarning } from "./accounts-Dm_H77gH.js";
import { createRequire } from "node:module";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
import { createHash } from "node:crypto";
import { WebClient } from "@slack/web-api";
import { addActiveManagedProxyTlsOptions, resolveEnvHttpProxyAgentOptions, resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { isDebugProxyGlobalFetchPatchInstalled } from "openclaw/plugin-sdk/proxy-capture";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
//#region extensions/slack/src/client-options.ts
const requireFromSlackSocketMode = (() => {
	return createRequire(createRequire(import.meta.url).resolve("@slack/socket-mode/package.json"));
})();
function loadSlackUndiciRuntime() {
	return requireFromSlackSocketMode("undici");
}
const SLACK_DEFAULT_RETRY_OPTIONS = {
	retries: 2,
	factor: 2,
	minTimeout: 500,
	maxTimeout: 3e3,
	randomize: true
};
const SLACK_WRITE_RETRY_OPTIONS = { retries: 0 };
const SLACK_READ_TIMEOUT_MS = 3e4;
const SLACK_LOOKUP_RETRY_OPTIONS = { retries: 0 };
/** Build the dispatcher shared by Slack Web API fetches and Socket Mode. */
function resolveSlackProxyDispatcher() {
	const options = resolveEnvHttpProxyAgentOptions();
	if (!options) return;
	try {
		const { EnvHttpProxyAgent } = loadSlackUndiciRuntime();
		return new EnvHttpProxyAgent(addActiveManagedProxyTlsOptions(options));
	} catch {
		return;
	}
}
function buildSlackFetch(dispatcher) {
	if (!dispatcher || isDebugProxyGlobalFetchPatchInstalled()) return resolveFetch();
	const { fetch: slackFetch } = loadSlackUndiciRuntime();
	return ((input, init) => {
		const slackInput = input;
		const slackInit = {
			...init,
			dispatcher
		};
		return slackFetch(slackInput, slackInit);
	});
}
function resolveSlackApiUrlFromEnv() {
	return process.env.SLACK_API_URL?.trim() || void 0;
}
function applySlackApiUrlAndProxyOptions(options, dispatcher) {
	const slackApiUrl = options.slackApiUrl ?? resolveSlackApiUrlFromEnv();
	if (dispatcher && !options.fetch) options.fetch = buildSlackFetch(dispatcher);
	if (slackApiUrl !== void 0) options.slackApiUrl = slackApiUrl;
	else delete options.slackApiUrl;
}
function resolveSlackWebClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher()) {
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	resolved.fetch ??= buildSlackFetch(dispatcher);
	resolved.retryConfig ??= SLACK_DEFAULT_RETRY_OPTIONS;
	return resolved;
}
function resolveSlackReadClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher()) {
	const resolved = resolveSlackWebClientOptions(options, dispatcher);
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
function resolveSlackWriteClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher()) {
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	resolved.retryConfig ??= SLACK_WRITE_RETRY_OPTIONS;
	return resolved;
}
function resolveSlackLookupClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher()) {
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	resolved.rejectRateLimitedCalls = true;
	resolved.retryConfig = SLACK_LOOKUP_RETRY_OPTIONS;
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
//#endregion
//#region extensions/slack/src/client.ts
const SLACK_WRITE_CLIENT_CACHE_MAX = 32;
const SLACK_STARTUP_AUTH_TIMEOUT_MS = 1e4;
const SLACK_STARTUP_AUTH_RETRY_BUDGET_MS = 35e3;
const slackWriteClientCache = /* @__PURE__ */ new Map();
const slackListenerUploadCompletionClientCache = /* @__PURE__ */ new WeakMap();
function createSlackWebClient(token, options = {}) {
	return new WebClient(token, resolveSlackWebClientOptions(options));
}
function createSlackReadClient(token, options = {}) {
	return new WebClient(token, resolveSlackReadClientOptions(options));
}
function createSlackStartupAuthFetch(baseFetch) {
	const deadline = Date.now() + SLACK_STARTUP_AUTH_RETRY_BUDGET_MS;
	return async (input, init) => {
		const response = await baseFetch(input, init);
		if (response.status !== 429) return response;
		const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
		const remainingMs = Math.max(0, deadline - Date.now());
		if (!Number.isFinite(retryAfter) || retryAfter * 1e3 <= remainingMs) return response;
		await new Promise((resolve) => {
			setTimeout(resolve, remainingMs);
		});
		throw new Error("Slack startup auth retry budget exhausted after rate limit");
	};
}
function createSlackStartupAuthClient(token, options = {}) {
	const resolvedOptions = resolveSlackWebClientOptions(options);
	const baseFetch = resolvedOptions.fetch;
	if (!baseFetch) throw new Error("Slack startup auth fetch is unavailable");
	return new WebClient(token, {
		...resolvedOptions,
		fetch: createSlackStartupAuthFetch(baseFetch),
		retryConfig: {
			...SLACK_DEFAULT_RETRY_OPTIONS,
			maxRetryTime: SLACK_STARTUP_AUTH_RETRY_BUDGET_MS
		},
		timeout: SLACK_STARTUP_AUTH_TIMEOUT_MS
	});
}
function createSlackLookupClient(token, options = {}) {
	return new WebClient(token, resolveSlackLookupClientOptions(options));
}
function createSlackWriteClient(token, options = {}) {
	return new WebClient(token, resolveSlackWriteClientOptions(options));
}
function createSlackTokenCacheKey(token) {
	return `sha256:${createHash("sha256").update(token).digest("base64url")}`;
}
function slackWriteClientCacheKey(token, options) {
	return `${createSlackTokenCacheKey(token)}${options.slackApiUrl ? `:api:${options.slackApiUrl}` : ""}${options.teamId ? `:team:${options.teamId.trim().toLowerCase()}` : ""}`;
}
function getSlackWriteClient(token, options = {}) {
	const resolvedOptions = resolveSlackWriteClientOptions(options);
	const tokenKey = slackWriteClientCacheKey(token, resolvedOptions);
	const cached = slackWriteClientCache.get(tokenKey);
	if (cached) {
		slackWriteClientCache.delete(tokenKey);
		slackWriteClientCache.set(tokenKey, cached);
		return cached;
	}
	const client = new WebClient(token, resolvedOptions);
	if (slackWriteClientCache.size >= SLACK_WRITE_CLIENT_CACHE_MAX) {
		const oldestTokenKey = slackWriteClientCache.keys().next().value;
		if (oldestTokenKey) slackWriteClientCache.delete(oldestTokenKey);
	}
	slackWriteClientCache.set(tokenKey, client);
	return client;
}
function getSlackListenerUploadCompletionClient(params) {
	const token = params.listenerClient.token?.trim();
	const teamId = params.teamId.trim().toUpperCase();
	if (!token || !teamId) return;
	const cached = slackListenerUploadCompletionClientCache.get(params.listenerClient);
	if (cached) return cached.teamId === teamId ? cached.client : void 0;
	const headers = Object.fromEntries(Object.entries(params.clientOptions?.headers ?? {}).filter(([name]) => name.toLowerCase() !== "authorization"));
	const client = new WebClient(token, resolveSlackWriteClientOptions({
		...params.clientOptions,
		headers,
		slackApiUrl: params.listenerClient.slackApiUrl,
		teamId,
		retryConfig: SLACK_WRITE_RETRY_OPTIONS,
		timeout: 0
	}));
	slackListenerUploadCompletionClientCache.set(params.listenerClient, {
		teamId,
		client
	});
	return client;
}
//#endregion
//#region extensions/slack/src/errors.ts
const NO_ERROR_DETAIL = "no error detail";
function redact(value) {
	return redactSensitiveText(value);
}
function addStringDetail(details, label, value) {
	if (typeof value !== "string") return;
	const trimmed = redact(value.trim());
	if (trimmed) details.push(label ? `${label}: ${trimmed}` : trimmed);
}
function addScalarDetail(details, label, value) {
	if (typeof value === "string") {
		addStringDetail(details, label, value);
		return;
	}
	if (typeof value === "number" || typeof value === "boolean") details.push(`${label}: ${String(value)}`);
}
function addStringListDetail(details, label, value) {
	if (!Array.isArray(value)) return;
	const entries = value.flatMap((entry) => {
		if (typeof entry !== "string") return [];
		const trimmed = redact(entry.trim());
		return trimmed ? [trimmed] : [];
	});
	if (entries.length) details.push(`${label}: ${entries.join(", ")}`);
}
function safeStringify(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const result = JSON.stringify(value, (_key, nested) => {
			if (typeof nested !== "object" || nested === null) return nested;
			if (seen.has(nested)) return "[Circular]";
			seen.add(nested);
			return nested;
		});
		return result ? redact(result) : void 0;
	} catch {
		return;
	}
}
function addSlackResponseMetadata(details, value) {
	if (!isRecord(value)) return;
	addStringListDetail(details, "scopes", value.scopes);
	addStringListDetail(details, "accepted", value.acceptedScopes);
	const messages = value.messages;
	if (Array.isArray(messages)) for (const message of messages) addStringDetail(details, "slack message", message);
	const warnings = value.warnings;
	if (Array.isArray(warnings)) for (const warning of warnings) addStringDetail(details, "slack warning", warning);
}
function addSlackDataDetails(details, value) {
	if (!isRecord(value)) return;
	addScalarDetail(details, "slack error", value.error);
	addScalarDetail(details, "needed", value.needed);
	addScalarDetail(details, "provided", value.provided);
	addSlackResponseMetadata(details, value.response_metadata);
}
function addRecordDetails(details, value) {
	addScalarDetail(details, "code", value.code);
	addScalarDetail(details, "status", value.status);
	addScalarDetail(details, "statusCode", value.statusCode);
	addScalarDetail(details, "statusMessage", value.statusMessage);
	addScalarDetail(details, "retryAfter", value.retryAfter);
	addScalarDetail(details, "errno", value.errno);
	addScalarDetail(details, "syscall", value.syscall);
	addScalarDetail(details, "hostname", value.hostname);
	addScalarDetail(details, "type", value.type);
	addStringDetail(details, "statusText", value.statusText);
	addStringDetail(details, "body", value.body);
	addSlackDataDetails(details, value.data);
	if (isRecord(value.response)) {
		addScalarDetail(details, "response status", value.response.status);
		addStringDetail(details, "response statusText", value.response.statusText);
		addSlackDataDetails(details, value.response.data);
	}
}
function collectSlackErrorDetails(error) {
	const details = [];
	if (error === void 0 || error === null) return details;
	if (typeof error === "string") {
		addStringDetail(details, "", error);
		return details;
	}
	if (error instanceof Error) {
		addStringDetail(details, "", error.message || error.name);
		if (error.cause !== void 0) {
			const cause = formatSlackError(error.cause, "");
			if (cause) details.push(`cause: ${cause}`);
		}
	}
	if (isRecord(error)) {
		addRecordDetails(details, error);
		const fallback = safeStringify(error);
		if (details.length === 0 && fallback && fallback !== "{}") details.push(fallback);
	}
	return details;
}
function formatSlackError(error, fallback = NO_ERROR_DETAIL) {
	const details = collectSlackErrorDetails(error);
	if (details.length > 0) return details.join("; ");
	if (error === void 0 || error === null) return fallback;
	if (typeof error === "string" && !error.trim()) return fallback;
	return safeStringify(error) ?? fallback;
}
//#endregion
//#region extensions/slack/src/probe.ts
var probe_exports = /* @__PURE__ */ __exportAll({ probeSlack: () => probeSlack });
async function probeSlack(token, timeoutMs = 2500, opts) {
	const client = createSlackReadClient(token, {
		rejectRateLimitedCalls: true,
		retryConfig: { retries: 0 },
		timeout: timeoutMs
	});
	return await runChannelProbe(timeoutMs, async () => {
		const result = await client.auth.test();
		if (!result.ok) return {
			ok: false,
			status: 200,
			error: result.error ?? "unknown"
		};
		if (opts?.identity === "user") {
			if (result.bot_id?.trim()) return {
				ok: false,
				status: 200,
				error: "Slack auth.test identified a bot token; user identity requires a user OAuth token"
			};
			const userId = result.user_id?.trim();
			if (!userId) return {
				ok: false,
				status: 200,
				error: "Slack auth.test returned no human user_id for user identity"
			};
			return {
				ok: true,
				status: 200,
				user: {
					id: userId,
					name: result.user
				},
				team: {
					id: result.team_id,
					name: result.team
				}
			};
		}
		const warning = formatSlackBotTokenIdentityWarning({
			auth: result,
			accountId: opts?.accountId
		});
		return {
			ok: true,
			status: 200,
			bot: {
				id: result.user_id,
				name: result.user
			},
			team: {
				id: result.team_id,
				name: result.team
			},
			...warning ? { warning } : {}
		};
	}, (error) => ({
		ok: false,
		status: typeof error.statusCode === "number" ? error.statusCode : null,
		error: formatSlackError(error)
	}));
}
//#endregion
export { resolveSlackWriteClientOptions as _, createSlackReadClient as a, createSlackWebClient as c, getSlackWriteClient as d, SLACK_DEFAULT_RETRY_OPTIONS as f, resolveSlackWebClientOptions as g, resolveSlackProxyDispatcher as h, createSlackLookupClient as i, createSlackWriteClient as l, resolveSlackLookupClientOptions as m, probe_exports as n, createSlackStartupAuthClient as o, SLACK_WRITE_RETRY_OPTIONS as p, formatSlackError as r, createSlackTokenCacheKey as s, probeSlack as t, getSlackListenerUploadCompletionClient as u };
