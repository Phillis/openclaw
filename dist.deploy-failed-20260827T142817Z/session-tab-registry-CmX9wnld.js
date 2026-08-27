import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { F as resolveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { n as extractErrorCode, r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { d as readResponseWithLimit } from "./http-body-D5I0NwSl.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Bk80Ti5l.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import "./error-runtime-CmlvK1A3.js";
import "./response-limit-runtime-cHsvrQig.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import { t as parseBrowserHttpUrl } from "./browser-config-B_uQJIyR.js";
import "./constants-0X-2im2J.js";
import { C as resolveVolatileTabAlias, S as resolveDurableTabExact, _ as hasVolatileTabAlias, a as getBrowserSessionTabStore, b as rememberVolatileTabAliases, c as parseBrowserSessionTabRecord, d as withoutBrowserSessionTabCleanup, f as clearDurableTabAliases, g as hasDurableTabExact, h as hasDurableTabAlias, i as deleteBrowserSessionTabIf, l as sameBrowserSessionTabRecord, m as forgetVolatileTabAlias, n as browserSessionTabStorageKey, o as getOptionalBrowserSessionTabStore, p as clearVolatileTabAliases, r as compareBrowserSessionTabProfileAliases, t as browserSessionTabNativeIdentity, u as updateBrowserSessionTab, v as hasVolatileTabExact, w as resolveVolatileTabExact, x as resolveDurableTabAlias, y as rememberDurableTabAliases } from "./session-tab-store-CZSebDwT.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-CJe40hw8.js";
import { D as parseBrowserErrorPayload, h as resolveBrowserRateLimitMessage, r as closeTrackedCdpTarget } from "./tmp-openclaw-dir-DoieXIgG.js";
import "./config-BdAtrEnx.js";
import { n as resolveBrowserControlAuth } from "./control-auth-DrorZF1h.js";
import { r as resolveCdpControlPolicy } from "./trash-Dl_zOrVI.js";
import "./sdk-setup-tools-Dlma8XjO.js";
import { randomUUID } from "node:crypto";
//#region extensions/browser/src/browser/client-actions-url.ts
/**
* URL helpers for browser client action requests.
*/
/** Build a query string for profile-scoped browser requests. */
function buildProfileQuery(profile) {
	return profile ? `?profile=${encodeURIComponent(profile)}` : "";
}
/** Prefix a browser-control path with an optional base URL. */
function withBaseUrl(baseUrl, path) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return path;
	return `${trimmed.replace(/\/$/, "")}${path}`;
}
//#endregion
//#region extensions/browser/src/browser/bridge-auth-registry.ts
/**
* Ephemeral auth registry for loopback browser bridge servers.
*
* Dynamic sandbox/host ports need auth lookup without persisting tokens in
* config files, so callers store credentials only for the current process.
*/
const authByPort = /* @__PURE__ */ new Map();
/** Store auth material for a loopback bridge port in the current process. */
function setBridgeAuthForPort(port, auth) {
	if (!Number.isFinite(port) || port <= 0) return;
	const token = normalizeOptionalString(auth.token) ?? "";
	const password = normalizeOptionalString(auth.password) ?? "";
	authByPort.set(port, {
		token: token || void 0,
		password: password || void 0
	});
}
/** Read auth material for a loopback bridge port. */
function getBridgeAuthForPort(port) {
	if (!Number.isFinite(port) || port <= 0) return;
	return authByPort.get(port);
}
/** Drop auth material when a bridge server closes or changes port. */
function deleteBridgeAuthForPort(port) {
	if (!Number.isFinite(port) || port <= 0) return;
	authByPort.delete(port);
}
//#endregion
//#region extensions/browser/src/browser/client-fetch.ts
/**
* Browser control client transport.
*
* Sends requests to either an absolute HTTP browser-control URL or the local
* in-process dispatcher, adding loopback auth and operator-facing diagnostics.
*/
var BrowserServiceError = class extends Error {
	constructor(message, metadata, status) {
		super(message);
		this.name = "BrowserServiceError";
		this.status = status;
		this.reason = metadata?.reason;
		this.details = metadata?.details;
	}
};
function browserServiceErrorFromPayload(value, fallback, status) {
	const parsed = parseBrowserErrorPayload(value);
	const message = parsed?.error ?? fallback;
	const modelHint = resolveBrowserServiceModelHint(message, status);
	return new BrowserServiceError(modelHint ? appendBrowserToolModelHint(message, modelHint) : message, parsed && "reason" in parsed ? parsed : void 0, status);
}
function isAbsoluteHttp(url) {
	return /^https?:\/\//i.test(url.trim());
}
function isLoopbackHttpUrl(url) {
	try {
		return isLoopbackHost(new URL(url).hostname);
	} catch {
		return false;
	}
}
function withLoopbackBrowserAuthImpl(url, init, deps) {
	const headers = new Headers(init?.headers ?? {});
	if (headers.has("authorization") || headers.has("x-openclaw-password")) return {
		...init,
		headers
	};
	if (!isLoopbackHttpUrl(url)) return {
		...init,
		headers
	};
	try {
		const cfg = deps.getRuntimeConfig();
		const auth = deps.resolveBrowserControlAuth(cfg);
		if (auth.token) {
			headers.set("Authorization", `Bearer ${auth.token}`);
			return {
				...init,
				headers
			};
		}
		if (auth.password) {
			headers.set("x-openclaw-password", auth.password);
			return {
				...init,
				headers
			};
		}
	} catch {}
	try {
		const { port } = parseBrowserHttpUrl(url, "browser control URL");
		const bridgeAuth = deps.getBridgeAuthForPort(port);
		if (bridgeAuth?.token) headers.set("Authorization", `Bearer ${bridgeAuth.token}`);
		else if (bridgeAuth?.password) headers.set("x-openclaw-password", bridgeAuth.password);
	} catch {}
	return {
		...init,
		headers
	};
}
function withLoopbackBrowserAuth(url, init) {
	return withLoopbackBrowserAuthImpl(url, init, {
		getRuntimeConfig,
		resolveBrowserControlAuth,
		getBridgeAuthForPort
	});
}
const BROWSER_TOOL_PERSISTENT_MODEL_HINT = "Do NOT retry the browser tool — it will keep failing. Use an alternative approach or inform the user that the browser is currently unavailable.";
const BROWSER_TOOL_TRANSIENT_MODEL_HINT = "This may be a transient browser error. Retry the browser tool once. If the same error persists, use an alternative approach or inform the user that the browser is currently unavailable.";
const BROWSER_TRANSIENT_NETWORK_ERROR_RE = /\b(?:ECONNRESET|ECONNABORTED|ENETRESET|ETIMEDOUT|EPIPE|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN|UND_ERR_(?:CONNECT_TIMEOUT|HEADERS_TIMEOUT|BODY_TIMEOUT|SOCKET))\b|fetch failed|network error|other side closed|socket (?:hang up|terminated)|connection (?:reset|aborted|timed out)/i;
const BROWSER_PERSISTENT_FAILURE_RE = /\bECONNREFUSED\b|connection refused|browser control (?:is )?(?:disabled|not enabled)|invalid (?:auth|authentication|credentials|password|token)|authentication (?:failed|required)|unauthorized/i;
const BROWSER_ERROR_BODY_LIMIT_BYTES = 16 * 1024;
const BROWSER_SUCCESS_BODY_LIMIT_BYTES = 32 * 1024 * 1024;
function decodeBrowserControlResponseUtf8(body, status) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(body);
	} catch {
		throw browserServiceErrorFromPayload(void 0, `Browser control response was not valid UTF-8 (HTTP ${status})`, status);
	}
}
function isRateLimitStatus(status) {
	return status === 429;
}
function resolveDispatcherBrowserControlOwnership(url) {
	if (isAbsoluteHttp(url)) return "unknown";
	try {
		const cfg = getRuntimeConfig();
		const resolved = resolveBrowserConfig(cfg?.browser, cfg);
		const requestedProfile = new URL(url, "http://localhost").searchParams.get("profile")?.trim();
		const profile = resolveProfile(resolved, requestedProfile || resolved.defaultProfile);
		if (!profile) return "unknown";
		return profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly ? "local-managed" : "external-browser";
	} catch {
		return "unknown";
	}
}
function resolveBrowserFetchOperatorHint(url, opts) {
	if (opts?.ownership === "external-browser") return "The browser profile is external to OpenClaw; make sure its browser/CDP endpoint is running and reachable. Restarting the OpenClaw gateway will not launch it.";
	return !isAbsoluteHttp(url) ? `Restart the OpenClaw gateway (OpenClaw.app menubar, or \`${formatCliCommand("openclaw gateway")}\`).` : "If this is a sandboxed session, ensure the sandbox browser is running.";
}
function normalizeErrorMessage(err) {
	const message = err instanceof Error ? normalizeOptionalString(err.message) : void 0;
	if (message) return message;
	return String(err);
}
function appendBrowserToolModelHint(message, hint) {
	return `${message.replaceAll(BROWSER_TOOL_PERSISTENT_MODEL_HINT, "").replaceAll(BROWSER_TOOL_TRANSIENT_MODEL_HINT, "").trim()} ${hint}`;
}
function resolveBrowserFetchTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, 5e3);
}
function classifyBrowserFetchFailure(err) {
	const directCode = extractErrorCode(err);
	const formatted = formatErrorMessage(err);
	const detail = directCode ? `${formatted} | ${directCode}` : formatted;
	const detailLower = normalizeLowercaseStringOrEmpty(detail);
	const nameLower = err instanceof Error ? normalizeLowercaseStringOrEmpty(err.name) : "";
	if (nameLower === "aborterror") return "aborted";
	if (BROWSER_PERSISTENT_FAILURE_RE.test(detail)) return "persistent";
	if (nameLower.includes("timeout") || detailLower.includes("timed out") || detailLower.includes("timeout")) return "timeout";
	if (BROWSER_TRANSIENT_NETWORK_ERROR_RE.test(detail)) return "transient-network";
	return detailLower.includes("aborterror") || detailLower.includes("aborted") || detailLower.includes("abort") || detailLower.includes("cancelled") || detailLower.includes("canceled") ? "aborted" : "persistent";
}
function isPersistentBrowserServiceFailure(message, status) {
	return status === 401 || BROWSER_PERSISTENT_FAILURE_RE.test(message);
}
function resolveBrowserServiceModelHint(message, status) {
	if (message.includes(BROWSER_TOOL_PERSISTENT_MODEL_HINT)) return BROWSER_TOOL_PERSISTENT_MODEL_HINT;
	if (message.includes(BROWSER_TOOL_TRANSIENT_MODEL_HINT)) return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	if (isPersistentBrowserServiceFailure(message, status)) return BROWSER_TOOL_PERSISTENT_MODEL_HINT;
	if (status === 408 || status === 504) return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	if (status === void 0 || status < 500 || status > 599) return;
	const kind = classifyBrowserFetchFailure(new Error(message));
	return kind === "timeout" || kind === "transient-network" ? BROWSER_TOOL_TRANSIENT_MODEL_HINT : void 0;
}
function resolveBrowserToolModelHint(kind) {
	if (kind === "timeout" || kind === "transient-network") return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	return kind === "persistent" ? BROWSER_TOOL_PERSISTENT_MODEL_HINT : void 0;
}
async function discardResponseBody(res) {
	try {
		await res.body?.cancel();
	} catch {}
}
function enhanceDispatcherPathError(url, err) {
	const msg = normalizeErrorMessage(err);
	const kind = classifyBrowserFetchFailure(err);
	const operatorHint = resolveBrowserFetchOperatorHint(url, { ownership: resolveDispatcherBrowserControlOwnership(url) });
	const modelHint = resolveBrowserToolModelHint(kind);
	const suffix = modelHint ? `${operatorHint} ${modelHint}` : operatorHint;
	const normalized = msg.endsWith(".") ? msg : `${msg}.`;
	return new Error(`${normalized} ${suffix}`, err instanceof Error ? { cause: err } : void 0);
}
function enhanceBrowserFetchError(url, err, timeoutMs) {
	const operatorHint = resolveBrowserFetchOperatorHint(url);
	const msg = normalizeErrorMessage(err);
	const kind = classifyBrowserFetchFailure(err);
	if (kind === "timeout") return new Error(`Can't reach the OpenClaw browser control service (timed out after ${timeoutMs}ms). ${operatorHint} ${BROWSER_TOOL_TRANSIENT_MODEL_HINT}`, err instanceof Error ? { cause: err } : void 0);
	if (kind === "aborted") return new Error(`Browser control request was cancelled. ${operatorHint}`, err instanceof Error ? { cause: err } : void 0);
	if (kind === "transient-network") return new Error(`Can't reach the OpenClaw browser control service. ${operatorHint} (${msg}) ${BROWSER_TOOL_TRANSIENT_MODEL_HINT}`, err instanceof Error ? { cause: err } : void 0);
	return new Error(appendBrowserToolModelHint(`Can't reach the OpenClaw browser control service. ${operatorHint} (${msg})`, BROWSER_TOOL_PERSISTENT_MODEL_HINT), err instanceof Error ? { cause: err } : void 0);
}
async function fetchHttpJson(url, init) {
	const timeoutMs = resolveBrowserFetchTimeoutMs(init.timeoutMs);
	const ctrl = new AbortController();
	const upstreamSignal = init.signal;
	let upstreamAbortListener;
	if (upstreamSignal) if (upstreamSignal.aborted) ctrl.abort(upstreamSignal.reason);
	else {
		upstreamAbortListener = () => ctrl.abort(upstreamSignal.reason);
		upstreamSignal.addEventListener("abort", upstreamAbortListener, { once: true });
	}
	const t = setTimeout(() => ctrl.abort(/* @__PURE__ */ new Error("timed out")), timeoutMs);
	let release;
	try {
		const guarded = await fetchWithSsrFGuard({
			url,
			init,
			timeoutMs,
			signal: ctrl.signal,
			policy: { allowPrivateNetwork: true },
			auditContext: "browser-control-client"
		});
		release = guarded.release;
		const res = guarded.response;
		if (!res.ok) {
			if (isRateLimitStatus(res.status)) {
				await discardResponseBody(res);
				throw new BrowserServiceError(`${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_PERSISTENT_MODEL_HINT}`);
			}
			const body = await readResponseWithLimit(res, BROWSER_ERROR_BODY_LIMIT_BYTES).catch(() => void 0);
			const text = body ? decodeBrowserControlResponseUtf8(body, res.status) : "";
			let parsed;
			if (text) try {
				parsed = JSON.parse(text);
			} catch {}
			throw browserServiceErrorFromPayload(parsed, text || `HTTP ${res.status}`, res.status);
		}
		const body = await readResponseWithLimit(res, BROWSER_SUCCESS_BODY_LIMIT_BYTES, { onOverflow: ({ maxBytes }) => new BrowserServiceError(`Browser control response exceeded ${maxBytes} bytes`) });
		return JSON.parse(decodeBrowserControlResponseUtf8(body, res.status));
	} finally {
		clearTimeout(t);
		await release?.();
		if (upstreamSignal && upstreamAbortListener) upstreamSignal.removeEventListener("abort", upstreamAbortListener);
	}
}
/** Fetch JSON from browser control over HTTP or local dispatcher transport. */
async function fetchBrowserJson(url, init) {
	const timeoutMs = resolveBrowserFetchTimeoutMs(init?.timeoutMs);
	let isDispatcherPath = false;
	try {
		if (isAbsoluteHttp(url)) return await fetchHttpJson(url, {
			...withLoopbackBrowserAuth(url, init),
			timeoutMs
		});
		isDispatcherPath = true;
		const { dispatchBrowserControlRequest } = await import("./local-dispatch.runtime.js");
		const parsed = new URL(url, "http://localhost");
		const query = {};
		for (const [key, value] of parsed.searchParams.entries()) query[key] = value;
		let body = init?.body;
		if (typeof body === "string") try {
			body = JSON.parse(body);
		} catch {}
		const abortCtrl = new AbortController();
		const upstreamSignal = init?.signal;
		let upstreamAbortListener;
		if (upstreamSignal) if (upstreamSignal.aborted) abortCtrl.abort(upstreamSignal.reason);
		else {
			upstreamAbortListener = () => abortCtrl.abort(upstreamSignal.reason);
			upstreamSignal.addEventListener("abort", upstreamAbortListener, { once: true });
		}
		let abortListener;
		const abortPromise = abortCtrl.signal.aborted ? Promise.reject(toErrorObject(abortCtrl.signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection")) : new Promise((_, reject) => {
			abortListener = () => reject(toErrorObject(abortCtrl.signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
			abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
		});
		let timer;
		if (timeoutMs) timer = setTimeout(() => abortCtrl.abort(/* @__PURE__ */ new Error("timed out")), timeoutMs);
		const dispatchPromise = dispatchBrowserControlRequest({
			method: init?.method?.toUpperCase() === "DELETE" ? "DELETE" : init?.method?.toUpperCase() === "POST" ? "POST" : "GET",
			path: parsed.pathname,
			query,
			body,
			signal: abortCtrl.signal
		});
		const result = await Promise.race([dispatchPromise, abortPromise]).finally(() => {
			if (timer) clearTimeout(timer);
			if (abortListener) abortCtrl.signal.removeEventListener("abort", abortListener);
			if (upstreamSignal && upstreamAbortListener) upstreamSignal.removeEventListener("abort", upstreamAbortListener);
		});
		if (result.status >= 400) {
			if (isRateLimitStatus(result.status)) throw new BrowserServiceError(`${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_PERSISTENT_MODEL_HINT}`);
			throw browserServiceErrorFromPayload(result.body, `HTTP ${result.status}`, result.status);
		}
		return result.body;
	} catch (err) {
		if (err instanceof BrowserServiceError) throw err;
		if (isDispatcherPath) throw enhanceDispatcherPathError(url, err);
		throw enhanceBrowserFetchError(url, err, timeoutMs);
	}
}
//#endregion
//#region extensions/browser/src/browser/client.ts
/**
* Browser control client API.
*
* Provides typed helpers for status, profile lifecycle, tabs, and snapshots
* over the browser-control transport.
*/
const BROWSER_STATUS_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DOCTOR_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS = 1e4;
const JSON_HEADERS = { "Content-Type": "application/json" };
function resolveBrowserClientTimeoutMs(opts, fallbackMs) {
	return resolveTimerTimeoutMs(opts?.timeoutMs, fallbackMs);
}
function withProfilePath(baseUrl, path, profile) {
	const profileQuery = buildProfileQuery(profile);
	if (!profileQuery) return withBaseUrl(baseUrl, path);
	return withBaseUrl(baseUrl, `${path}${path.includes("?") ? "&" : "?"}${profileQuery.slice(1)}`);
}
async function sendProfilePost(baseUrl, path, opts, fallbackTimeoutMs) {
	await fetchBrowserJson(withProfilePath(baseUrl, path, opts?.profile), {
		method: "POST",
		timeoutMs: resolveBrowserClientTimeoutMs(opts, fallbackTimeoutMs)
	});
}
async function sendTabTargetRequest(params) {
	return await fetchBrowserJson(withProfilePath(params.baseUrl, params.path, params.opts?.profile), {
		method: params.method,
		...params.body ? {
			headers: JSON_HEADERS,
			body: JSON.stringify(params.body)
		} : {},
		timeoutMs: resolveBrowserClientTimeoutMs(params.opts, 5e3)
	});
}
/** Read browser-control status for the selected profile. */
async function browserStatus(baseUrl, opts) {
	return await fetchBrowserJson(withProfilePath(baseUrl, "/", opts?.profile), { timeoutMs: resolveBrowserClientTimeoutMs(opts, BROWSER_STATUS_REQUEST_TIMEOUT_MS) });
}
/** Run browser doctor checks for the selected profile. */
async function browserDoctor(baseUrl, opts) {
	const params = new URLSearchParams();
	if (opts?.profile) params.set("profile", opts.profile);
	if (opts?.deep) params.set("deep", "true");
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/doctor${params.size ? `?${params.toString()}` : ""}`), { timeoutMs: opts?.deep ? BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS : BROWSER_DOCTOR_REQUEST_TIMEOUT_MS });
}
/** List configured browser profiles and their current status. */
async function browserProfiles(baseUrl, opts) {
	return (await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles`), { timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3) })).profiles ?? [];
}
/** List Chrome-family profiles available on the local macOS host. */
async function browserSystemProfiles(baseUrl, opts) {
	return (await fetchBrowserJson(withBaseUrl(baseUrl, `/system-profiles${opts?.browser ? `?browser=${encodeURIComponent(opts.browser)}` : ""}`), { timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3) })).systemProfiles ?? [];
}
/** Import system-profile cookies into a managed browser profile. */
async function browserImportProfile(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, "/profiles/import"), {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify(opts),
		timeoutMs: 12e4
	});
}
/** Start the selected browser profile. */
async function browserStart(baseUrl, opts) {
	await sendProfilePost(baseUrl, "/start", opts, 15e3);
}
/** Stop the selected browser profile. */
async function browserStop(baseUrl, opts) {
	await sendProfilePost(baseUrl, "/stop", opts, 15e3);
}
/** Reset the selected managed browser profile directory. */
async function browserResetProfile(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/reset-profile${buildProfileQuery(opts?.profile)}`), {
		method: "POST",
		timeoutMs: 2e4
	});
}
/** Create and persist a browser profile. */
async function browserCreateProfile(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles/create`), {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify({
			name: opts.name,
			color: opts.color,
			cdpUrl: opts.cdpUrl,
			userDataDir: opts.userDataDir,
			driver: opts.driver
		}),
		timeoutMs: 1e4
	});
}
/** Delete a configured browser profile. */
async function browserDeleteProfile(baseUrl, profile) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/profiles/${encodeURIComponent(profile)}`), {
		method: "DELETE",
		timeoutMs: 2e4
	});
}
/** List tabs for the selected browser profile. */
async function browserTabs(baseUrl, opts) {
	return (await fetchBrowserJson(withProfilePath(baseUrl, "/tabs", opts?.profile), { timeoutMs: resolveBrowserClientTimeoutMs(opts, 3e3) })).tabs ?? [];
}
/** Open a new tab in the selected browser profile. */
async function browserOpenTab(baseUrl, url, opts) {
	return await fetchBrowserJson(withProfilePath(baseUrl, "/tabs/open", opts?.profile), {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify({
			url,
			...opts?.label ? { label: opts.label } : {}
		}),
		timeoutMs: resolveBrowserClientTimeoutMs(opts, 15e3)
	});
}
/** Focus an existing browser tab. */
async function browserFocusTab(baseUrl, targetId, opts) {
	return await sendTabTargetRequest({
		baseUrl,
		path: "/tabs/focus",
		method: "POST",
		opts,
		body: { targetId }
	});
}
/** Close an existing browser tab. */
async function browserCloseTab(baseUrl, targetId, opts) {
	await sendTabTargetRequest({
		baseUrl,
		path: `/tabs/${encodeURIComponent(targetId)}`,
		method: "DELETE",
		opts
	});
}
/** Close a canonical raw target id selected by OpenClaw's internal tab bookkeeping. */
async function browserCloseTabByRawTargetId(baseUrl, targetId, opts) {
	await sendTabTargetRequest({
		baseUrl,
		path: `/tabs/${encodeURIComponent(targetId)}?targetIdMode=raw`,
		method: "DELETE",
		opts
	});
}
/** Execute legacy index-based tab actions. */
async function browserTabAction(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/tabs/action${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			action: opts.action,
			index: opts.index
		}),
		timeoutMs: 1e4
	});
}
/** Capture an ARIA or AI snapshot for the selected tab. */
async function browserSnapshot(baseUrl, opts) {
	const q = new URLSearchParams();
	if (opts.format) q.set("format", opts.format);
	if (opts.targetId) q.set("targetId", opts.targetId);
	if (typeof opts.limit === "number") q.set("limit", String(opts.limit));
	if (typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars)) q.set("maxChars", String(opts.maxChars));
	if (opts.refs === "aria" || opts.refs === "role") q.set("refs", opts.refs);
	if (typeof opts.interactive === "boolean") q.set("interactive", String(opts.interactive));
	if (typeof opts.compact === "boolean") q.set("compact", String(opts.compact));
	if (typeof opts.depth === "number" && Number.isFinite(opts.depth)) q.set("depth", String(opts.depth));
	if (opts.selector?.trim()) q.set("selector", opts.selector.trim());
	if (opts.frame?.trim()) q.set("frame", opts.frame.trim());
	if (opts.labels === true) q.set("labels", "1");
	if (opts.urls === true) q.set("urls", "1");
	if (opts.mode) q.set("mode", opts.mode);
	if (opts.profile) q.set("profile", opts.profile);
	const resolvedTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	q.set("timeoutMs", String(resolvedTimeoutMs));
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/snapshot?${q.toString()}`), { timeoutMs: resolvedTimeoutMs });
}
//#endregion
//#region extensions/browser/src/browser/session-tab-process-state.ts
const volatileStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile");
const volatileCleanupStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile-cleanup");
const activeDurableStateSymbol = Symbol.for("openclaw.browser.session-tabs.active-durable-keys");
const coldNativeActivityStateSymbol = Symbol.for("openclaw.browser.session-tabs.cold-native-activity");
function activeDurableStorageKeys() {
	const state = globalThis;
	state[activeDurableStateSymbol] ??= /* @__PURE__ */ new Set();
	return state[activeDurableStateSymbol];
}
function volatileTabsBySession() {
	const state = globalThis;
	state[volatileStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileStateSymbol];
}
/** Keeps one in-flight volatile target close shared across Browser plugin bundles. */
function volatileTabCleanupByTarget() {
	const state = globalThis;
	state[volatileCleanupStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileCleanupStateSymbol];
}
function deleteVolatileSessionTab(sessionKey, tabKey) {
	const state = volatileTabsBySession();
	const tabs = state.get(sessionKey);
	tabs?.delete(tabKey);
	clearVolatileTabAliases(sessionKey, tabKey);
	if (tabs?.size === 0) state.delete(sessionKey);
}
function coldNativeActivity() {
	const state = globalThis;
	state[coldNativeActivityStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[coldNativeActivityStateSymbol];
}
function rememberColdNativeActivity(identity, now) {
	coldNativeActivity().set(identity, now);
}
function forgetColdNativeActivity(identity) {
	coldNativeActivity().delete(identity);
}
function readColdNativeActivity(identity) {
	return coldNativeActivity().get(identity);
}
//#endregion
//#region extensions/browser/src/browser/session-tab-cleanup-claim.ts
/**
* Cleanup claim bookkeeping for durable session tabs. A claim marks a row as
* being closed by exactly one attempt, so a concurrent touch or a competing
* sweep cannot delete a row that another generation now owns.
*/
function isIgnorableTabCloseError(error) {
	const message = normalizeLowercaseStringOrEmpty(String(error));
	return message.includes("tab not found") || message.includes("target closed") || message.includes("target not found") || message.includes("no such target") || message.includes("no target with given id found");
}
function claimCleanup(tab, now, kind) {
	const cleanupAttemptToken = randomUUID();
	const cleanupKind = kind === "lifecycle" ? "lifecycle" : tab.cleanupKind ?? kind;
	return updateBrowserSessionTab(tab.storageKey, (current) => {
		const record = parseBrowserSessionTabRecord(current);
		if (!record || !sameBrowserSessionTabRecord(record, tab)) return;
		return {
			...record,
			cleanupRequestedAt: now,
			cleanupAttemptToken,
			cleanupKind
		};
	}) ? {
		...tab,
		cleanupRequestedAt: now,
		cleanupAttemptToken,
		cleanupKind
	} : void 0;
}
function matchesCleanupAttempt(current, tab) {
	return Boolean(current && current.cleanupAttemptToken === tab.cleanupAttemptToken && current.cleanupRequestedAt === tab.cleanupRequestedAt && current.cleanupKind === tab.cleanupKind && sameBrowserSessionTabRecord({
		...current,
		lastUsedAt: tab.lastUsedAt
	}, tab));
}
function ownsCleanupAttempt(tab) {
	return matchesCleanupAttempt(parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(tab.storageKey)), tab);
}
function deleteClaimedTab(tab, onWarn) {
	try {
		if (deleteBrowserSessionTabIf(tab.storageKey, (current) => {
			return matchesCleanupAttempt(parseBrowserSessionTabRecord(current), tab);
		})) {
			clearDurableTabAliases(tab.storageKey);
			activeDurableStorageKeys().delete(tab.storageKey);
		}
	} catch (error) {
		onWarn?.(`failed to delete tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
	}
}
//#endregion
//#region extensions/browser/src/browser/session-tab-sweep-selection.ts
function trackedTabIdentity(tab) {
	return tab.kind === "durable" ? `durable:${tab.storageKey}` : `volatile:${tab.sessionKey}:${tab.targetId}\u0000${tab.baseUrl ?? ""}\u0000${tab.profile ?? ""}`;
}
function selectStaleTrackedTabs(params) {
	const selected = /* @__PURE__ */ new Map();
	const activeBySession = /* @__PURE__ */ new Map();
	const nativeIdentityCounts = /* @__PURE__ */ new Map();
	const observedNativeActivity = /* @__PURE__ */ new Map();
	for (const tab of params.tabs) {
		if (tab.kind !== "durable" || tab.interactionTargetKind !== "native") continue;
		const identity = browserSessionTabNativeIdentity(tab);
		nativeIdentityCounts.set(identity, (nativeIdentityCounts.get(identity) ?? 0) + 1);
		const observedAt = readColdNativeActivity(identity);
		if (observedAt !== void 0) observedNativeActivity.set(tab.storageKey, observedAt);
	}
	const effectiveLastUsedAt = (tab) => tab.kind === "durable" ? Math.max(tab.lastUsedAt, observedNativeActivity.get(tab.storageKey) ?? 0) : tab.lastUsedAt;
	for (const tab of params.tabs) {
		const observedAt = tab.kind === "durable" ? observedNativeActivity.get(tab.storageKey) : void 0;
		const isActiveDurable = tab.kind === "durable" && activeDurableStorageKeys().has(tab.storageKey);
		const isUnambiguousNative = tab.kind === "durable" && tab.interactionTargetKind === "native" && nativeIdentityCounts.get(browserSessionTabNativeIdentity(tab)) === 1;
		const activitySupersedesSweep = tab.kind === "durable" && tab.cleanupKind === "sweep" && observedAt !== void 0 && observedAt >= (tab.cleanupRequestedAt ?? 0);
		if (tab.kind === "durable" && tab.cleanupAttemptToken && !activitySupersedesSweep) {
			if (tab.cleanupKind === "lifecycle" || isActiveDurable || isUnambiguousNative) selected.set(trackedTabIdentity(tab), tab);
			continue;
		}
		if (params.sessionFilter && !params.sessionFilter(tab.sessionKey)) continue;
		if (tab.kind === "durable" && !isActiveDurable && (tab.interactionTargetKind === "opaque" || !isUnambiguousNative)) continue;
		const active = activeBySession.get(tab.sessionKey) ?? [];
		active.push(tab);
		activeBySession.set(tab.sessionKey, active);
	}
	for (const tabs of activeBySession.values()) {
		tabs.sort((left, right) => effectiveLastUsedAt(left) - effectiveLastUsedAt(right) || left.trackedAt - right.trackedAt);
		if (params.idleMs && params.idleMs > 0) {
			for (const tab of tabs) if (params.now - effectiveLastUsedAt(tab) >= params.idleMs) selected.set(trackedTabIdentity(tab), tab);
		}
		const remaining = tabs.filter((tab) => !selected.has(trackedTabIdentity(tab)));
		if (params.maxTabsPerSession && params.maxTabsPerSession > 0 && remaining.length > params.maxTabsPerSession) for (const tab of remaining.slice(0, remaining.length - params.maxTabsPerSession)) selected.set(trackedTabIdentity(tab), tab);
	}
	return [...selected.values()];
}
//#endregion
//#region extensions/browser/src/browser/session-tab-untrack-selection.ts
function selectSessionTabToUntrack(params) {
	if (params.volatileIsExact && !params.hasDurableExactCandidate) return "volatile";
	if (params.durableIsExact && !params.hasVolatileExactCandidate) return "durable";
	if (params.hasVolatileCandidate && params.hasDurableCandidate) return "ambiguous";
	if (params.volatileAvailable) return "volatile";
	if (params.durableAvailable) return "durable";
	if (params.hasVolatileCandidate || params.hasDurableCandidate) return "ambiguous";
	return "missing";
}
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.ts
/**
* Session-owned browser tabs. Host-local durable ownership is canonical in
* plugin SQLite; all other tabs remain process-local.
*/
function normalizeSessionKey(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function normalizeProfile(value) {
	return normalizeOptionalLowercaseString(value);
}
function normalizeProfileAliases(values) {
	return [...new Set((values ?? []).map(normalizeProfile).filter((value) => Boolean(value)))].toSorted(compareBrowserSessionTabProfileAliases);
}
function resolveInteractionIdentity(params) {
	const sessionKey = params.sessionKey?.trim();
	const targetId = params.targetId?.trim();
	if (!sessionKey || !targetId) return;
	const baseUrl = params.baseUrl?.trim();
	return {
		sessionKey: normalizeSessionKey(sessionKey),
		targetId,
		...baseUrl ? { baseUrl } : {},
		...normalizeProfile(params.profile) ? { profile: normalizeProfile(params.profile) } : {}
	};
}
function durableOwnership(params) {
	return params.ownership?.status === "durable" ? params.ownership : void 0;
}
function volatileId(identity) {
	return `${identity.targetId}\u0000${identity.baseUrl ?? ""}\u0000${identity.profile ?? ""}`;
}
function deleteInvalidRecord(key, onWarn) {
	try {
		if (deleteBrowserSessionTabIf(key, (current) => {
			const record = parseBrowserSessionTabRecord(current);
			return !record || browserSessionTabStorageKey(record) !== key;
		})) {
			clearDurableTabAliases(key);
			activeDurableStorageKeys().delete(key);
		}
	} catch (error) {
		onWarn?.(`failed to delete invalid browser session tab record: ${String(error)}`);
		return;
	}
	onWarn?.("deleted invalid browser session tab record");
}
function readDurableTabs(onWarn) {
	const store = getOptionalBrowserSessionTabStore();
	if (!store) return [];
	const tabs = [];
	for (const entry of store.entries()) {
		const record = parseBrowserSessionTabRecord(entry.value);
		if (!record || browserSessionTabStorageKey(record) !== entry.key) {
			deleteInvalidRecord(entry.key, onWarn);
			continue;
		}
		tabs.push({
			...record,
			kind: "durable",
			storageKey: entry.key
		});
	}
	return tabs;
}
function deleteVolatileMatching(identity) {
	const state = volatileTabsBySession();
	const tabs = state.get(identity.sessionKey);
	if (!tabs) return;
	for (const [key, tab] of tabs) if (tab.targetId === identity.targetId && tab.baseUrl === identity.baseUrl && tab.profile === identity.profile) {
		tabs.delete(key);
		clearVolatileTabAliases(identity.sessionKey, key);
	}
	if (tabs.size === 0) state.delete(identity.sessionKey);
}
function resolveVolatile(identity) {
	const tabs = volatileTabsBySession().get(identity.sessionKey);
	const exactKey = volatileId(identity);
	const exact = tabs?.get(exactKey);
	if (exact) return {
		tab: exact,
		tabKey: exactKey,
		isExact: true
	};
	const exactTarget = resolveVolatileTabExact(identity);
	if (!exactTarget && hasVolatileTabExact(identity)) return;
	const target = exactTarget ?? resolveVolatileTabAlias(identity);
	if (!target) {
		if (!hasVolatileTabAlias(identity)) forgetVolatileTabAlias(identity);
		return;
	}
	if (target.sessionKey !== identity.sessionKey) {
		forgetVolatileTabAlias(identity);
		return;
	}
	const tab = tabs?.get(target.tabKey);
	if (!tab) {
		forgetVolatileTabAlias(identity);
		return;
	}
	return {
		tab,
		tabKey: target.tabKey,
		isExact: Boolean(exactTarget)
	};
}
function upsertVolatile(identity, aliases, profileAliases, now) {
	const state = volatileTabsBySession();
	const tabs = state.get(identity.sessionKey) ?? /* @__PURE__ */ new Map();
	const key = volatileId(identity);
	const existing = tabs.get(key);
	tabs.set(key, {
		...identity,
		kind: "volatile",
		trackedAt: existing?.trackedAt ?? now,
		lastUsedAt: now
	});
	state.set(identity.sessionKey, tabs);
	rememberVolatileTabAliases(identity, aliases, key, profileAliases);
}
function deleteDurableCandidate(tab) {
	const deleted = deleteBrowserSessionTabIf(tab.storageKey, (current) => {
		const record = parseBrowserSessionTabRecord(current);
		return Boolean(record && sameBrowserSessionTabRecord(record, tab));
	});
	if (deleted) {
		clearDurableTabAliases(tab.storageKey);
		activeDurableStorageKeys().delete(tab.storageKey);
	}
	return deleted;
}
function clearDurableForVolatile(identity) {
	const mappedKey = resolveDurableTabExact(identity);
	if (!mappedKey) return true;
	const record = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(mappedKey));
	if (record) return deleteDurableCandidate({
		...record,
		kind: "durable",
		storageKey: mappedKey
	});
	clearDurableTabAliases(mappedKey);
	activeDurableStorageKeys().delete(mappedKey);
	return true;
}
/** Starts tracking a browser tab for later session cleanup. */
function trackSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const ownership = durableOwnership(params);
	const profileAliases = normalizeProfileAliases(params.profileAliases);
	const now = params.now ?? Date.now();
	if (identity.baseUrl) {
		upsertVolatile(identity, params.aliases ?? [], profileAliases, now);
		return;
	}
	if (!ownership) {
		if (!clearDurableForVolatile(identity)) throw new Error("durable browser tab changed during non-durable transition");
		upsertVolatile(identity, params.aliases ?? [], profileAliases, now);
		return;
	}
	if (!identity.profile) throw new Error("durable browser tab tracking requires an explicit profile");
	const profile = identity.profile;
	const storageKey = browserSessionTabStorageKey({
		sessionKey: identity.sessionKey,
		nativeTargetId: ownership.nativeTargetId,
		profileFingerprint: ownership.profileFingerprint,
		browserInstanceFingerprint: ownership.browserInstanceFingerprint
	});
	let persistedProfileAliases = [];
	updateBrowserSessionTab(storageKey, (current) => {
		const existing = parseBrowserSessionTabRecord(current);
		persistedProfileAliases = normalizeProfileAliases([
			...existing?.profileAliases ?? [],
			existing?.profile,
			...profileAliases
		]).filter((alias) => alias !== profile);
		return {
			version: 1,
			sessionKey: identity.sessionKey,
			nativeTargetId: ownership.nativeTargetId,
			profile,
			...persistedProfileAliases.length > 0 ? { profileAliases: persistedProfileAliases } : {},
			profileFingerprint: ownership.profileFingerprint,
			browserInstanceFingerprint: ownership.browserInstanceFingerprint,
			interactionTargetKind: identity.targetId === ownership.nativeTargetId ? "native" : "opaque",
			trackedAt: existing?.trackedAt ?? now,
			lastUsedAt: now
		};
	});
	rememberDurableTabAliases(identity, params.aliases ?? [], storageKey, persistedProfileAliases);
	activeDurableStorageKeys().add(storageKey);
	deleteVolatileMatching(identity);
}
function canonicalCandidate(params, identity) {
	const ownership = durableOwnership(params);
	if (!ownership) {
		const mappedKey = resolveDurableTabAlias(identity);
		if (mappedKey) {
			const mappedRecord = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(mappedKey));
			if (mappedRecord) return {
				...mappedRecord,
				kind: "durable",
				storageKey: mappedKey
			};
		}
		return;
	}
	if (!identity.profile) return;
	const key = browserSessionTabStorageKey({
		sessionKey: identity.sessionKey,
		nativeTargetId: ownership.nativeTargetId,
		profileFingerprint: ownership.profileFingerprint,
		browserInstanceFingerprint: ownership.browserInstanceFingerprint
	});
	const record = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(key));
	return record ? {
		...record,
		kind: "durable",
		storageKey: key
	} : void 0;
}
/** Updates last-used time for an existing tracked browser tab. */
function touchSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const now = params.now ?? Date.now();
	const volatile = resolveVolatile(identity);
	if (volatile) volatileTabsBySession().get(identity.sessionKey)?.set(volatile.tabKey, {
		...volatile.tab,
		lastUsedAt: now
	});
	if (identity.baseUrl) return;
	if (!getOptionalBrowserSessionTabStore()) return;
	const candidate = canonicalCandidate(params, identity);
	if (candidate) {
		activeDurableStorageKeys().add(candidate.storageKey);
		updateBrowserSessionTab(candidate.storageKey, (current) => {
			const record = parseBrowserSessionTabRecord(current);
			if (!record || !sameBrowserSessionTabRecord(record, candidate)) return;
			if (record.cleanupKind === "sweep") return {
				...withoutBrowserSessionTabCleanup(record),
				lastUsedAt: now
			};
			return {
				...record,
				lastUsedAt: now
			};
		});
		return;
	}
	if (identity.profile) {
		const nativeTargetId = params.nativeTargetId?.trim() || identity.targetId;
		const coldIdentity = browserSessionTabNativeIdentity({
			sessionKey: identity.sessionKey,
			profile: identity.profile,
			nativeTargetId
		});
		if (readColdNativeActivity(coldIdentity) !== void 0 || readDurableTabs().some((tab) => tab.interactionTargetKind === "native" && browserSessionTabNativeIdentity(tab) === coldIdentity)) rememberColdNativeActivity(coldIdentity, now);
	}
}
/** Removes a browser tab from session cleanup tracking. */
function untrackSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const volatile = resolveVolatile(identity);
	if (identity.baseUrl) {
		if (volatile) deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	if (!getOptionalBrowserSessionTabStore()) {
		if (volatile) deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	const durable = canonicalCandidate(params, identity);
	if (durable && durableOwnership(params)) {
		deleteDurableCandidate(durable);
		return;
	}
	const selection = selectSessionTabToUntrack({
		volatileAvailable: Boolean(volatile),
		durableAvailable: Boolean(durable),
		hasVolatileCandidate: Boolean(volatile) || hasVolatileTabAlias(identity),
		hasDurableCandidate: Boolean(durable) || hasDurableTabAlias(identity),
		volatileIsExact: volatile?.isExact ?? false,
		durableIsExact: Boolean(durable && resolveDurableTabExact(identity) === durable.storageKey),
		hasVolatileExactCandidate: hasVolatileTabExact(identity),
		hasDurableExactCandidate: hasDurableTabExact(identity)
	});
	if (selection === "volatile" && volatile) {
		deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	if (selection === "durable" && durable) {
		deleteDurableCandidate(durable);
		return;
	}
	if (selection !== "missing") return;
	if (identity.profile) forgetColdNativeActivity(browserSessionTabNativeIdentity({
		sessionKey: identity.sessionKey,
		profile: identity.profile,
		nativeTargetId: params.nativeTargetId?.trim() || identity.targetId
	}));
}
async function closeCurrentDurableTab(tab, shouldClose, getResolvedBrowserConfig) {
	let resolved = getResolvedBrowserConfig?.();
	if (!resolved) {
		const cfg = getRuntimeConfig();
		resolved = resolveBrowserConfig(cfg.browser, cfg);
	}
	const profile = resolveProfile(resolved, tab.profile);
	if (!profile?.cdpUrl) return { status: "ownership-mismatch" };
	if (profile.driver === "extension" && !resolved.extensionRelayInternalTokens[profile.name]) return {
		status: "unavailable",
		reason: "extension-relay-unavailable"
	};
	const cdpControlPolicy = resolveCdpControlPolicy(profile, resolved.ssrfPolicy);
	return await closeTrackedCdpTarget({
		profileName: profile.name,
		cdpUrl: profile.cdpUrl,
		nativeTargetId: tab.nativeTargetId,
		timeoutMs: resolved.remoteCdpTimeoutMs,
		ssrfPolicy: cdpControlPolicy,
		expectedProfileFingerprint: tab.profileFingerprint,
		expectedBrowserInstanceFingerprint: tab.browserInstanceFingerprint,
		shouldClose
	});
}
async function performDurableCleanup(candidate, params, now, cleanupKind) {
	const tab = claimCleanup(candidate, now, cleanupKind);
	if (!tab) return 0;
	const shouldClose = () => ownsCleanupAttempt(tab);
	let outcome;
	try {
		if (params.closeDurableTab) outcome = await params.closeDurableTab(tab, { shouldClose });
		else if (params.closeTab) {
			if (!shouldClose()) return 0;
			await params.closeTab({
				targetId: tab.nativeTargetId,
				nativeTargetId: tab.nativeTargetId,
				profile: tab.profile
			});
			outcome = { status: "closed" };
		} else outcome = await closeCurrentDurableTab(tab, shouldClose, params.getResolvedBrowserConfig);
	} catch (error) {
		if (isIgnorableTabCloseError(error)) {
			deleteClaimedTab(tab, params.onWarn);
			return 0;
		}
		params.onWarn?.(`failed to close tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
		return 0;
	}
	if (outcome.status === "cancelled") return 0;
	if (outcome.status === "unavailable") {
		if (outcome.reason === "extension-relay-unavailable") {
			params.onWarn?.(`deferred tracked browser tab ${tab.nativeTargetId}: extension relay runtime unavailable`);
			return 0;
		}
		if (now - tab.lastUsedAt >= 864e5) {
			params.onWarn?.(`retired unreachable tracked browser tab ${tab.nativeTargetId}: ${outcome.reason}`);
			deleteClaimedTab(tab, params.onWarn);
			return 0;
		}
		params.onWarn?.(`deferred tracked browser tab ${tab.nativeTargetId}: ${outcome.reason}`);
		return 0;
	}
	if (outcome.status === "ownership-mismatch") {
		params.onWarn?.(`retired tracked browser tab ${tab.nativeTargetId}: ownership mismatch`);
		deleteClaimedTab(tab, params.onWarn);
		return 0;
	}
	deleteClaimedTab(tab, params.onWarn);
	return outcome.status === "closed" ? 1 : 0;
}
async function closeDurableTab(candidate, params, now, cleanupKind) {
	return await performDurableCleanup(candidate, params, now, cleanupKind);
}
function sameVolatileTab(left, right) {
	return volatileId(left) === volatileId(right) && left.sessionKey === right.sessionKey && left.trackedAt === right.trackedAt && left.lastUsedAt === right.lastUsedAt;
}
function deleteVolatileTarget(tab) {
	const state = volatileTabsBySession();
	const targetKey = volatileId(tab);
	for (const [sessionKey, tabs] of state) {
		for (const [key, candidate] of tabs) if (volatileId(candidate) === targetKey) {
			tabs.delete(key);
			clearVolatileTabAliases(sessionKey, key);
		}
		if (tabs.size === 0) state.delete(sessionKey);
	}
}
async function performVolatileCleanup(candidate, params, cleanupKind) {
	const tab = resolveVolatile(candidate)?.tab;
	if (!tab) return 0;
	if (cleanupKind === "sweep" && !sameVolatileTab(tab, candidate)) return 0;
	const inFlight = volatileTabCleanupByTarget();
	const targetKey = volatileId(tab);
	const existing = inFlight.get(targetKey);
	if (existing) {
		await existing;
		return 0;
	}
	const cleanup = Promise.resolve().then(async () => {
		try {
			if (params.closeTab) await params.closeTab({
				targetId: tab.targetId,
				...tab.baseUrl ? { baseUrl: tab.baseUrl } : {},
				...tab.profile ? { profile: tab.profile } : {}
			});
			else await browserCloseTabByRawTargetId(tab.baseUrl, tab.targetId, { profile: tab.profile });
		} catch (error) {
			if (isIgnorableTabCloseError(error)) {
				deleteVolatileTarget(tab);
				return 0;
			}
			params.onWarn?.(`failed to close tracked browser tab ${tab.targetId}: ${String(error)}`);
			return 0;
		}
		deleteVolatileTarget(tab);
		return 1;
	});
	inFlight.set(targetKey, cleanup);
	try {
		return await cleanup;
	} finally {
		if (inFlight.get(targetKey) === cleanup) inFlight.delete(targetKey);
	}
}
async function closeTrackedTabs(tabs, params) {
	let closed = 0;
	const now = params.now ?? Date.now();
	for (const tab of tabs) closed += tab.kind === "durable" ? await closeDurableTab(tab, params, now, params.cleanupKind) : await performVolatileCleanup(tab, params, params.cleanupKind);
	return closed;
}
function normalizeSessionKeys(keys) {
	return new Set(keys.map((key) => key?.trim() ? normalizeSessionKey(key) : "").filter(Boolean));
}
function volatileTabsForSessions(sessionKeys) {
	const result = [];
	for (const sessionKey of sessionKeys) result.push(...volatileTabsBySession().get(sessionKey)?.values() ?? []);
	return result;
}
/** Closes and untracks tabs for the supplied session keys. */
async function closeTrackedBrowserTabsForSessions(params) {
	const sessionKeys = normalizeSessionKeys(params.sessionKeys);
	if (sessionKeys.size === 0) return 0;
	return await closeTrackedTabs([...readDurableTabs(params.onWarn).filter((tab) => sessionKeys.has(tab.sessionKey)), ...volatileTabsForSessions(sessionKeys)], {
		...params,
		cleanupKind: "lifecycle"
	});
}
/** Closes and untracks stale, pending, or excess browser tabs. */
async function sweepTrackedBrowserTabs(params) {
	const now = params.now ?? Date.now();
	const volatile = [];
	for (const tabs of volatileTabsBySession().values()) volatile.push(...tabs.values());
	return await closeTrackedTabs(selectStaleTrackedTabs({
		tabs: [...readDurableTabs(params.onWarn), ...volatile],
		now,
		idleMs: params.idleMs,
		maxTabsPerSession: params.maxTabsPerSession,
		sessionFilter: params.sessionFilter
	}), {
		...params,
		now,
		cleanupKind: "sweep"
	});
}
//#endregion
export { fetchBrowserJson as C, withBaseUrl as D, buildProfileQuery as E, BrowserServiceError as S, setBridgeAuthForPort as T, browserStatus as _, untrackSessionBrowserTab as a, browserTabAction as b, browserDeleteProfile as c, browserImportProfile as d, browserOpenTab as f, browserStart as g, browserSnapshot as h, trackSessionBrowserTab as i, browserDoctor as l, browserResetProfile as m, sweepTrackedBrowserTabs as n, browserCloseTab as o, browserProfiles as p, touchSessionBrowserTab as r, browserCreateProfile as s, closeTrackedBrowserTabsForSessions as t, browserFocusTab as u, browserStop as v, deleteBridgeAuthForPort as w, browserTabs as x, browserSystemProfiles as y };
