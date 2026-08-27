import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { F as resolveTimerTimeoutMs, a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { o as isLoopbackHost } from "./net-DeK7gO-9.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-Vw7DZYSc.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { f as saveMediaBuffer } from "./store-fXRck5jl.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./media-runtime-CE5ps2bv.js";
import { n as redactCdpUrl } from "./browser-config-BDyn11gY.js";
import { t as BROWSER_PROXY_COMMAND } from "./browser-node-commands-CIbUPKdY.js";
import { I as withTimeout, r as closeTrackedCdpTarget } from "./cdp.helpers-BZ0z5X6D.js";
import { c as resolveBrowserActRequestTimeoutMs, l as resolveBrowserNavigationTimeoutMs } from "./act-policy-C-oAQSTE.js";
import "./paths-C2o4widP.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "./config-CSL9j7n3.js";
import "./control-auth-CjCZORq5.js";
import "./chrome-Bz25Dp6i.js";
import { r as resolveCdpControlPolicy } from "./trash-DB7RJIyG.js";
import { o as loadBrowserConfigForRuntimeRefresh } from "./server-context-ZddMXBGO.js";
import "./sdk-setup-tools-B9rFA7Or.js";
import { D as buildProfileQuery, E as setBridgeAuthForPort, O as withBaseUrl, T as deleteBridgeAuthForPort, w as fetchBrowserJson } from "./session-tab-registry-B04yZSN3.js";
import { a as stageBrowserProxyUploadRequest, d as createBrowserProxyFailure, l as assertBrowserProxyFileBytesWithinLimits, m as visitBrowserProxyFilePaths, n as ensureBrowserProxyUploadCleanup, o as BROWSER_PROXY_ERROR_ENVELOPE, s as BROWSER_PROXY_MAX_FILE_BYTES, t as discardStagedBrowserProxyUpload, u as assertBrowserProxyFileCountWithinLimit } from "./browser-proxy-upload-BVi3558t.js";
import "./routes-CjC7EQeT.js";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware, t as hasVerifiedBrowserAuth } from "./server-middleware-1rk9HeEQ.js";
import { r as getBrowserControlState, s as stopBrowserBridgeRuntime, t as createBrowserControlContext } from "./browser-control-state-DP3NUAZ5.js";
import { a as resolveRequestedBrowserProfile, i as normalizeBrowserRequestPath, n as isBrowserHostLocalRoute, r as isPersistentBrowserProfileMutation, t as createBrowserRouteDispatcher } from "./dispatcher-BiDJU71X.js";
import "./snapshot-urls-DVqktkQ3.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-BARipSfx.js";
import fs from "node:fs/promises";
import express from "express";
//#region extensions/browser/src/browser/client-actions-core.ts
/**
* Browser client action helpers.
*
* Wraps browser-control action endpoints for navigation, dialog/file hooks,
* screenshots, and element actions used by the Browser agent tool.
*/
function normalizePositiveTimeoutMs(value) {
	return clampPositiveTimerTimeoutMs(value);
}
function resolveBrowserOperationRequestTimeoutMs(timeoutMs) {
	return addTimerTimeoutGraceMs(normalizePositiveTimeoutMs(timeoutMs) ?? 12e4, 5e3) ?? 1;
}
async function postDownloadRequest(baseUrl, route, body, profile, timeoutMs, signal) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `${route}${buildProfileQuery(profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(timeoutMs),
		signal
	});
}
/** Navigate a browser tab through the control server. */
async function browserNavigate(baseUrl, opts) {
	const q = buildProfileQuery(opts.profile);
	const timeoutMs = opts.timeoutMs === void 0 ? void 0 : resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/navigate${q}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			url: opts.url,
			targetId: opts.targetId,
			timeoutMs
		}),
		timeoutMs: timeoutMs === void 0 ? 2e4 : resolveBrowserOperationRequestTimeoutMs(timeoutMs),
		signal: opts.signal
	});
}
/** Arm a one-shot browser dialog handler. */
async function browserArmDialog(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/hooks/dialog${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			accept: opts.accept,
			promptText: opts.promptText,
			dialogId: opts.dialogId,
			targetId: opts.targetId,
			timeoutMs: opts.timeoutMs
		}),
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs),
		signal: opts.signal
	});
}
/** Arm or execute a browser file chooser upload. */
async function browserArmFileChooser(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/hooks/file-chooser${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			paths: opts.paths,
			ref: opts.ref,
			inputRef: opts.inputRef,
			element: opts.element,
			targetId: opts.targetId,
			timeoutMs: opts.timeoutMs
		}),
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs),
		signal: opts.signal
	});
}
/** Wait for the next managed browser download and save it under the guarded download root. */
async function browserWaitForDownload(baseUrl, opts) {
	return await postDownloadRequest(baseUrl, "/wait/download", {
		targetId: opts.targetId,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, opts.profile, opts.timeoutMs, opts.signal);
}
/** Click a snapshot ref and save its download under the guarded download root. */
async function browserDownload(baseUrl, opts) {
	return await postDownloadRequest(baseUrl, "/download", {
		targetId: opts.targetId,
		ref: opts.ref,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, opts.profile, opts.timeoutMs, opts.signal);
}
/** Execute one normalized browser action request. */
async function browserAct(baseUrl, req, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/act${buildProfileQuery(opts?.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req),
		timeoutMs: resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req)),
		signal: opts?.signal
	});
}
/** Capture a screenshot through the browser control server. */
async function browserScreenshotAction(baseUrl, opts) {
	const q = buildProfileQuery(opts.profile);
	const effectiveTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/screenshot${q}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			targetId: opts.targetId,
			fullPage: opts.fullPage,
			ref: opts.ref,
			element: opts.element,
			type: opts.type,
			labels: opts.labels,
			timeoutMs: effectiveTimeoutMs
		}),
		timeoutMs: effectiveTimeoutMs,
		signal: opts.signal
	});
}
//#endregion
//#region extensions/browser/src/browser/client-actions-observe.ts
function buildQuerySuffix(params) {
	const query = new URLSearchParams();
	for (const [key, value] of params) {
		if (typeof value === "boolean") {
			query.set(key, String(value));
			continue;
		}
		if (typeof value === "string" && value.length > 0) query.set(key, value);
	}
	const encoded = query.toString();
	return encoded.length > 0 ? `?${encoded}` : "";
}
/** Read browser console messages for a tab. */
async function browserConsoleMessages(baseUrl, opts = {}) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/console${buildQuerySuffix([
		["level", opts.level],
		["targetId", opts.targetId],
		["profile", opts.profile]
	])}`), {
		timeoutMs: 2e4,
		signal: opts.signal
	});
}
/** Save the current page as PDF through browser control. */
async function browserPdfSave(baseUrl, opts = {}) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/pdf${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ targetId: opts.targetId }),
		timeoutMs: 2e4,
		signal: opts.signal
	});
}
//#endregion
//#region extensions/browser/src/browser/proxy-files.ts
/**
* Browser proxy file helpers.
*
* Persists files returned by node-hosted browser proxy calls and rewrites
* proxied result paths to local saved media paths.
*/
const INVALID_BROWSER_PROXY_FILE_ENVELOPE = "browser proxy returned an invalid file envelope";
function invalidBrowserProxyFileEnvelope() {
	throw new Error(INVALID_BROWSER_PROXY_FILE_ENVELOPE);
}
function collectBrowserProxyResultPaths(result) {
	const paths = /* @__PURE__ */ new Set();
	visitBrowserProxyFilePaths(result, (filePath) => {
		paths.add(filePath);
		assertBrowserProxyFileCountWithinLimit(paths.size);
	});
	return paths;
}
function validateBrowserProxyFiles(result, files) {
	const referencedPaths = collectBrowserProxyResultPaths(result);
	const candidates = files === void 0 ? [] : files;
	if (!Array.isArray(candidates)) return invalidBrowserProxyFileEnvelope();
	assertBrowserProxyFileCountWithinLimit(candidates.length);
	const validated = [];
	for (const value of candidates) {
		const file = asNullableRecord(value);
		if (!file || typeof file.path !== "string" || !file.path.trim() || typeof file.base64 !== "string" || file.mimeType !== void 0 && typeof file.mimeType !== "string" || !referencedPaths.delete(file.path)) return invalidBrowserProxyFileEnvelope();
		validated.push({
			path: file.path,
			base64: file.base64,
			...file.mimeType === void 0 ? {} : { mimeType: file.mimeType }
		});
	}
	if (referencedPaths.size > 0) return invalidBrowserProxyFileEnvelope();
	return validated;
}
function decodeBrowserProxyFileBase64(file, totalBytes) {
	const estimatedBytes = estimateBase64DecodedBytes(file.base64);
	assertBrowserProxyFileBytesWithinLimits(estimatedBytes, totalBytes + estimatedBytes);
	const canonicalBase64 = file.base64 === "" ? "" : canonicalizeBase64(file.base64);
	if (canonicalBase64 === void 0) throw new Error("browser proxy file contains malformed base64 data");
	const buffer = Buffer.from(canonicalBase64, "base64");
	assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
	return buffer;
}
/** Validate, persist, and rewrite every route-owned file in a node result. */
async function persistBrowserProxyResultFiles(result, files) {
	const validatedFiles = validateBrowserProxyFiles(result, files);
	if (validatedFiles.length === 0) return result;
	const decoded = [];
	let totalBytes = 0;
	for (const file of validatedFiles) {
		const buffer = decodeBrowserProxyFileBase64(file, totalBytes);
		totalBytes += buffer.byteLength;
		decoded.push({
			file,
			buffer
		});
	}
	const mapping = /* @__PURE__ */ new Map();
	for (const { file, buffer } of decoded) {
		const saved = await saveMediaBuffer(buffer, file.mimeType, "browser", BROWSER_PROXY_MAX_FILE_BYTES);
		mapping.set(file.path, saved.path);
	}
	visitBrowserProxyFilePaths(result, (filePath) => mapping.get(filePath));
	return result;
}
//#endregion
//#region extensions/browser/src/browser/bridge-server.ts
const bridgeStates = /* @__PURE__ */ new WeakMap();
const bridgeStopPromises = /* @__PURE__ */ new WeakMap();
async function closeBridgeHttpServer(server) {
	if (!server.listening) return;
	await new Promise((resolve, reject) => {
		server.close((error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
function buildNoVncBootstrapHtml(params) {
	const hash = new URLSearchParams({
		autoconnect: "1",
		resize: "remote"
	});
	const password = normalizeOptionalString(params.password);
	if (password) hash.set("password", password);
	const targetUrl = `http://127.0.0.1:${params.noVncPort}/vnc.html#${hash.toString()}`;
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="referrer" content="no-referrer" />
  <title>OpenClaw noVNC Observer</title>
</head>
<body>
  <p>Opening sandbox observer...</p>
  <script>
    const target = ${JSON.stringify(targetUrl)};
    window.location.replace(target);
  <\/script>
</body>
</html>`;
}
/** Start an authenticated loopback browser bridge and register browser routes. */
async function startBrowserBridgeServer(params) {
	const host = params.host ?? "127.0.0.1";
	if (!isLoopbackHost(host)) throw new Error(`bridge server must bind to loopback host (got ${host})`);
	const port = params.port ?? 0;
	const app = express();
	installBrowserCommonMiddleware(app);
	const authToken = normalizeOptionalString(params.authToken);
	const authPassword = normalizeOptionalString(params.authPassword);
	if (!authToken && !authPassword) throw new Error("bridge server requires auth (authToken/authPassword missing)");
	installBrowserAuthMiddleware(app, {
		token: authToken,
		password: authPassword
	});
	if (params.resolveSandboxNoVncToken) app.get("/sandbox/novnc", (req, res) => {
		if (!hasVerifiedBrowserAuth(req)) {
			res.status(401).send("Unauthorized");
			return;
		}
		res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");
		res.setHeader("Referrer-Policy", "no-referrer");
		const rawToken = normalizeOptionalString(req.query?.token);
		if (!rawToken) {
			res.status(400).send("Missing token");
			return;
		}
		const resolved = params.resolveSandboxNoVncToken?.(rawToken);
		if (!resolved) {
			res.status(404).send("Invalid or expired token");
			return;
		}
		res.type("html").status(200).send(buildNoVncBootstrapHtml(resolved));
	});
	const state = {
		server: null,
		port,
		resolved: params.resolved,
		profiles: /* @__PURE__ */ new Map()
	};
	const [{ createBrowserRouteContext }, { registerBrowserRoutes }] = await Promise.all([import("./server-context-Ci89xLoT.js"), import("./routes-BJjfLReP.js")]);
	registerBrowserRoutes(app, createBrowserRouteContext({
		getState: () => state,
		onEnsureAttachTarget: params.onEnsureAttachTarget
	}));
	const server = await listenBrowserHttpServer(app, port, host);
	const resolvedPort = server.address()?.port ?? port;
	state.server = server;
	state.port = resolvedPort;
	state.resolved.controlPort = resolvedPort;
	bridgeStates.set(server, state);
	setBridgeAuthForPort(resolvedPort, {
		token: authToken,
		password: authPassword
	});
	return {
		server,
		port: resolvedPort,
		baseUrl: `http://${host}:${resolvedPort}`,
		state
	};
}
async function stopBrowserBridgeServerOnce(server) {
	let port;
	try {
		const address = server.address();
		if (address?.port) port = address.port;
	} catch {}
	const state = bridgeStates.get(server);
	const httpClose = closeBridgeHttpServer(server);
	if (state) deleteBridgeAuthForPort(state.port);
	else if (port) deleteBridgeAuthForPort(port);
	if (!state) {
		await httpClose;
		return;
	}
	const runtimeClose = stopBrowserBridgeRuntime({
		current: state,
		getState: () => bridgeStates.get(server) ?? null,
		clearState: () => {},
		onWarn: () => {}
	});
	const failed = (await Promise.allSettled([httpClose, runtimeClose])).find((result) => result.status === "rejected");
	if (failed) throw failed.reason;
	bridgeStates.delete(server);
}
/** Stop a browser bridge server and clear its ephemeral port auth. */
function stopBrowserBridgeServer(server) {
	const current = bridgeStopPromises.get(server);
	if (current) return current;
	let resolveStop;
	let rejectStop;
	const stopping = new Promise((resolve, reject) => {
		resolveStop = resolve;
		rejectStop = reject;
	});
	bridgeStopPromises.set(server, stopping);
	stopBrowserBridgeServerOnce(server).then(resolveStop, rejectStop);
	stopping.finally(() => {
		if (bridgeStopPromises.get(server) === stopping) bridgeStopPromises.delete(server);
	}).catch(() => {});
	return stopping;
}
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.ts
/**
* Node-host browser.proxy command implementation for delegated Browser control
* requests.
*/
function readOwnedTabCloseRequest(value) {
	const ownership = asNullableRecord(asNullableRecord(value)?.ownership);
	if (ownership?.status !== "durable" || typeof ownership.nativeTargetId !== "string" || !ownership.nativeTargetId.trim() || typeof ownership.profileFingerprint !== "string" || !ownership.profileFingerprint.trim() || typeof ownership.browserInstanceFingerprint !== "string" || !ownership.browserInstanceFingerprint.trim()) throw new Error("INVALID_REQUEST: valid durable tab ownership required");
	return { ownership: {
		status: "durable",
		nativeTargetId: ownership.nativeTargetId.trim(),
		profileFingerprint: ownership.profileFingerprint.trim(),
		browserInstanceFingerprint: ownership.browserInstanceFingerprint.trim()
	} };
}
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_STATUS_TIMEOUT_MS = 750;
const BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES = 24 * 1024 * 1024;
function normalizeProfileAllowlist(raw) {
	return Array.isArray(raw) ? normalizeStringEntries(raw) : [];
}
function resolveBrowserProxyConfig() {
	const proxy = loadBrowserConfigForRuntimeRefresh().nodeHost?.browserProxy;
	const allowProfiles = normalizeProfileAllowlist(proxy?.allowProfiles);
	return {
		enabled: proxy?.enabled !== false,
		allowProfiles
	};
}
let browserControlReady = null;
async function ensureBrowserControlService() {
	if (browserControlReady) return browserControlReady;
	const sharedStartup = (async () => {
		const cfg = loadBrowserConfigForRuntimeRefresh();
		if (!resolveBrowserConfig(cfg.browser, cfg).enabled) throw new Error("browser control disabled");
		if (!await startBrowserControlServiceFromConfig()) throw new Error("browser control disabled");
	})().catch((error) => {
		if (browserControlReady === sharedStartup) browserControlReady = null;
		throw error;
	});
	browserControlReady = sharedStartup;
	return sharedStartup;
}
function isProfileAllowed(params) {
	const { allowProfiles, profile } = params;
	if (!allowProfiles.length) return true;
	if (!profile) return false;
	return allowProfiles.includes(profile.trim());
}
function collectBrowserProxyPaths(payload) {
	const paths = /* @__PURE__ */ new Set();
	visitBrowserProxyFilePaths(payload, (filePath) => {
		paths.add(filePath.trim());
		assertBrowserProxyFileCountWithinLimit(paths.size);
	});
	return [...paths];
}
async function readBrowserProxyFiles(filePaths) {
	const files = [];
	let totalBytes = 0;
	for (const filePath of filePaths) try {
		const stat = await fs.stat(filePath).catch(() => null);
		if (!stat || !stat.isFile()) throw new Error("file not found");
		assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
		const buffer = await fs.readFile(filePath);
		assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
		totalBytes += buffer.byteLength;
		const mimeType = await detectMime({
			buffer,
			filePath
		});
		files.push({
			path: filePath,
			base64: buffer.toString("base64"),
			mimeType
		});
	} catch (err) {
		throw new Error(`browser proxy file read failed for ${filePath}: ${String(err)}`, { cause: err });
	}
	return files;
}
function decodeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	return JSON.parse(raw);
}
function resolveBrowserProxyTimeout(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_BROWSER_PROXY_TIMEOUT_MS);
}
function isBrowserProxyTimeoutError(err) {
	return String(err).includes("browser proxy request timed out");
}
function combineBrowserProxySignals(timeoutSignal, invocationSignal) {
	if (timeoutSignal && invocationSignal) return AbortSignal.any([timeoutSignal, invocationSignal]);
	return timeoutSignal ?? invocationSignal;
}
function isWsBackedBrowserProxyPath(path) {
	return path === "/act" || path === "/download" || path === "/navigate" || path === "/pdf" || path === "/screenshot" || path === "/snapshot" || path === "/wait/download";
}
async function readBrowserProxyStatus(params) {
	const query = params.profile ? { profile: params.profile } : {};
	try {
		const response = await withTimeout((signal) => params.dispatcher.dispatch({
			method: "GET",
			path: "/",
			query,
			signal
		}), BROWSER_PROXY_STATUS_TIMEOUT_MS, "browser proxy status");
		if (response.status >= 400 || !response.body || typeof response.body !== "object") return null;
		const body = response.body;
		return {
			running: body.running,
			transport: body.transport,
			cdpHttp: body.cdpHttp,
			cdpReady: body.cdpReady,
			cdpUrl: body.cdpUrl
		};
	} catch {
		return null;
	}
}
function formatBrowserProxyTimeoutMessage(params) {
	const parts = [`browser proxy timed out for ${params.method} ${params.path} after ${params.timeoutMs}ms`, params.wsBacked ? "ws-backed browser action" : "browser action"];
	if (params.profile) parts.push(`profile=${params.profile}`);
	if (params.status) {
		const statusParts = [
			`running=${String(params.status.running)}`,
			`cdpHttp=${String(params.status.cdpHttp)}`,
			`cdpReady=${String(params.status.cdpReady)}`
		];
		if (typeof params.status.transport === "string" && params.status.transport.trim()) statusParts.push(`transport=${params.status.transport}`);
		if (typeof params.status.cdpUrl === "string" && params.status.cdpUrl.trim()) statusParts.push(`cdpUrl=${redactCdpUrl(params.status.cdpUrl)}`);
		parts.push(`status(${statusParts.join(", ")})`);
	}
	return parts.join("; ");
}
/** Executes a serialized browser.proxy command and returns a serialized result payload. */
async function runBrowserProxyCommand(paramsJSON, command = BROWSER_PROXY_COMMAND, invocationSignal) {
	invocationSignal?.throwIfAborted();
	ensureBrowserProxyUploadCleanup();
	const params = decodeParams(paramsJSON);
	if (command === "browser.proxy" && params.upload !== void 0) throw new Error("INVALID_REQUEST: browser.proxy does not accept upload envelopes");
	if (command === "browser.proxy.upload.v1" && !params.upload) throw new Error("INVALID_REQUEST: browser.proxy.upload.v1 requires an upload envelope");
	if (command !== "browser.proxy" && command !== "browser.proxy.upload.v1") throw new Error(`INVALID_REQUEST: unsupported browser proxy command: ${command}`);
	const pathValue = typeof params.path === "string" ? params.path.trim() : "";
	if (!pathValue) throw new Error("INVALID_REQUEST: path required");
	const proxyConfig = resolveBrowserProxyConfig();
	if (!proxyConfig.enabled) throw new Error("UNAVAILABLE: node browser proxy disabled");
	await ensureBrowserControlService();
	invocationSignal?.throwIfAborted();
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const method = typeof params.method === "string" ? params.method.toUpperCase() : "GET";
	const path = normalizeBrowserRequestPath(pathValue);
	let body = params.body;
	const requestedProfile = resolveRequestedBrowserProfile({
		query: params.query,
		body,
		profile: params.profile
	}) ?? "";
	const effectiveProfile = path === "/profiles" ? "" : requestedProfile || resolved.defaultProfile;
	const effectiveResolvedProfile = effectiveProfile ? resolveProfile(resolved, effectiveProfile) : null;
	const route = effectiveResolvedProfile ? {
		status: "resolved",
		profile: effectiveProfile,
		driver: effectiveResolvedProfile.driver
	} : { status: "unavailable" };
	const includeRoute = params.errorEnvelope === BROWSER_PROXY_ERROR_ENVELOPE;
	const allowedProfiles = proxyConfig.allowProfiles;
	if (isPersistentBrowserProfileMutation(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot mutate persistent browser profiles");
	if (isBrowserHostLocalRoute(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot run host-local browser routes");
	if (allowedProfiles.length > 0) {
		if (path !== "/profiles") {
			if (!isProfileAllowed({
				allowProfiles: allowedProfiles,
				profile: requestedProfile || resolved.defaultProfile
			})) throw new Error("INVALID_REQUEST: browser profile not allowed");
		} else if (requestedProfile) {
			if (!isProfileAllowed({
				allowProfiles: allowedProfiles,
				profile: requestedProfile
			})) throw new Error("INVALID_REQUEST: browser profile not allowed");
		}
	}
	const timeoutMs = resolveBrowserProxyTimeout(params.timeoutMs);
	const deadlineAt = Date.now() + timeoutMs;
	const query = {};
	const rawQuery = params.query ?? {};
	for (const [key, value] of Object.entries(rawQuery)) {
		if (value === void 0 || value === null) continue;
		query[key] = typeof value === "string" ? value : String(value);
	}
	if (requestedProfile) query.profile = requestedProfile;
	if (path === "/__openclaw/session-tab/close-owned") {
		const request = readOwnedTabCloseRequest(body);
		const liveResolved = getBrowserControlState()?.resolved ?? resolved;
		const profile = resolveProfile(liveResolved, effectiveProfile);
		const result = profile?.cdpUrl && effectiveProfile ? await closeTrackedCdpTarget({
			profileName: effectiveProfile,
			cdpUrl: profile.cdpUrl,
			nativeTargetId: request.ownership.nativeTargetId,
			expectedProfileFingerprint: request.ownership.profileFingerprint,
			expectedBrowserInstanceFingerprint: request.ownership.browserInstanceFingerprint,
			timeoutMs: liveResolved.remoteCdpTimeoutMs,
			ssrfPolicy: resolveCdpControlPolicy(profile, liveResolved.ssrfPolicy),
			signal: invocationSignal
		}) : { status: "ownership-mismatch" };
		return JSON.stringify({
			result,
			...includeRoute ? { route } : {}
		});
	}
	const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	let stagedUpload;
	try {
		stagedUpload = await withTimeout((timeoutSignal) => stageBrowserProxyUploadRequest({
			method,
			path,
			body,
			upload: params.upload,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal)
		}), timeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: requestedProfile || resolved.defaultProfile || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status: null
		}), { cause: err });
	}
	body = stagedUpload.body;
	const remainingTimeoutMs = deadlineAt - Date.now();
	if (remainingTimeoutMs <= 0) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: requestedProfile || resolved.defaultProfile || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status: null
		}));
	}
	let response;
	try {
		response = await withTimeout((timeoutSignal) => dispatcher.dispatch({
			method: method === "DELETE" ? "DELETE" : method === "POST" ? "POST" : "GET",
			path,
			query,
			body,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal)
		}), remainingTimeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		const profileForStatus = requestedProfile || resolved.defaultProfile;
		const status = await readBrowserProxyStatus({
			dispatcher,
			profile: path === "/profiles" ? void 0 : profileForStatus
		});
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: path === "/profiles" ? void 0 : profileForStatus || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status
		}), { cause: err });
	}
	if (response.status >= 400) await discardStagedBrowserProxyUpload(stagedUpload);
	if (response.status >= 400) {
		if (params.errorEnvelope === "browser-v1") return JSON.stringify(createBrowserProxyFailure(response.status, response.body, route));
		const detail = response.body && typeof response.body === "object" && "error" in response.body ? String(response.body.error).trim() : "";
		throw new Error(detail ? `${response.status}: ${detail}` : `HTTP ${response.status}`);
	}
	const result = response.body;
	if (allowedProfiles.length > 0 && path === "/profiles") {
		const obj = typeof result === "object" && result !== null ? result : {};
		obj.profiles = (Array.isArray(obj.profiles) ? obj.profiles : []).filter((entry) => {
			if (!entry || typeof entry !== "object") return false;
			const name = entry.name;
			return typeof name === "string" && allowedProfiles.includes(name);
		});
	}
	const paths = collectBrowserProxyPaths(result);
	const files = paths.length > 0 ? await readBrowserProxyFiles(paths) : void 0;
	const payload = files ? {
		result,
		files,
		...includeRoute ? { route } : {}
	} : {
		result,
		...includeRoute ? { route } : {}
	};
	const serialized = JSON.stringify(payload);
	if (Buffer.byteLength(JSON.stringify(serialized)) > BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES) throw new Error("browser proxy payload exceeds 24 MiB encoded limit");
	return serialized;
}
//#endregion
export { browserConsoleMessages as a, browserArmDialog as c, browserNavigate as d, browserScreenshotAction as f, persistBrowserProxyResultFiles as i, browserArmFileChooser as l, startBrowserBridgeServer as n, browserPdfSave as o, browserWaitForDownload as p, stopBrowserBridgeServer as r, browserAct as s, runBrowserProxyCommand as t, browserDownload as u };
