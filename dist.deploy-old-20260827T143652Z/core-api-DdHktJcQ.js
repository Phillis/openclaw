import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs, a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { o as isLoopbackHost } from "./net-BRYQcUG8.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import { d as saveMediaBuffer } from "./store-CNsqBmYb.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./media-runtime-vkQwnhW4.js";
import { n as redactCdpUrl } from "./browser-config-B_uQJIyR.js";
import { t as BROWSER_PROXY_COMMAND } from "./browser-node-commands-CIbUPKdY.js";
import "./constants-0X-2im2J.js";
import { l as resolveBrowserActRequestTimeoutMs, u as resolveBrowserNavigationTimeoutMs } from "./act-policy-BrghP9Kf.js";
import { c as DEFAULT_UPLOAD_DIR, l as resolveExistingUploadPaths, r as resolveBrowserConfig } from "./config-ChuJBdOZ.js";
import { D as parseBrowserErrorPayload, X as withTimeout } from "./tmp-openclaw-dir-dS-1ArW-.js";
import "./control-auth-BBJ8Ai-O.js";
import "./chrome-COUNz8dw.js";
import "./trash-DbUVw_yo.js";
import { o as loadBrowserConfigForRuntimeRefresh } from "./server-context-DrhV4-XI.js";
import "./sdk-setup-tools-buGCCFSU.js";
import { C as fetchBrowserJson, D as withBaseUrl, E as buildProfileQuery, T as setBridgeAuthForPort, w as deleteBridgeAuthForPort } from "./session-tab-registry-4FaeH-h4.js";
import "./routes-SRWznHFw.js";
import { i as listenBrowserHttpServer, n as installBrowserAuthMiddleware, r as installBrowserCommonMiddleware, t as hasVerifiedBrowserAuth } from "./server-middleware-DKf4KCm9.js";
import { s as stopBrowserBridgeRuntime, t as createBrowserControlContext } from "./browser-control-state-CRclhuSW.js";
import { a as resolveRequestedBrowserProfile, i as normalizeBrowserRequestPath, n as isBrowserHostLocalRoute, r as isPersistentBrowserProfileMutation, t as createBrowserRouteDispatcher } from "./dispatcher-DtnCeEDz.js";
import "./snapshot-urls-xkh7aq-p.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-CyF1smmu.js";
import path from "node:path";
import fs from "node:fs/promises";
import express from "express";
//#region extensions/browser/src/browser-proxy-envelope.ts
/**
* Browser node-proxy response envelope shared by the node host and Gateway.
*/
/** Additive opt-in for structured browser route errors over node.invoke. */
const BROWSER_PROXY_ERROR_ENVELOPE = "browser-v1";
/** Additive request envelope for Gateway-owned files sent to a browser node. */
const BROWSER_PROXY_UPLOAD_ENVELOPE = "browser-upload-v1";
const BROWSER_PROXY_MAX_FILE_BYTES = 10 * 1024 * 1024;
const BROWSER_PROXY_MAX_TOTAL_FILE_BYTES = 16 * 1024 * 1024;
const BROWSER_PROXY_MAX_FILES = 256;
/** Bound filesystem work even when one action emits many tiny downloads. */
function assertBrowserProxyFileCountWithinLimit(fileCount, direction = "response") {
	if (fileCount > BROWSER_PROXY_MAX_FILES) throw new Error(`browser proxy ${direction} exceeds 256 file limit`);
}
/** Enforce the shared per-file and raw aggregate Browser proxy limits. */
function assertBrowserProxyFileBytesWithinLimits(fileBytes, totalBytes) {
	if (fileBytes > 10485760) throw new Error("browser proxy file exceeds 10 MiB limit");
	if (totalBytes > BROWSER_PROXY_MAX_TOTAL_FILE_BYTES) throw new Error("browser proxy files exceed 16 MiB aggregate limit");
}
/** Visit the route-owned file paths that may cross the Browser node boundary. */
function visitBrowserProxyFilePaths(result, visit) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return;
	const root = result;
	const visitPath = (owner, key) => {
		const filePath = owner[key];
		if (typeof filePath !== "string" || !filePath.trim()) return;
		const replacement = visit(filePath);
		if (typeof replacement === "string") owner[key] = replacement;
	};
	visitPath(root, "path");
	visitPath(root, "imagePath");
	const download = root.download;
	if (download && typeof download === "object" && !Array.isArray(download)) visitPath(download, "path");
	if (Array.isArray(root.downloads)) {
		for (const entry of root.downloads) if (entry && typeof entry === "object" && !Array.isArray(entry)) visitPath(entry, "path");
	}
}
function normalizeBrowserProxyErrorBody(value, fallback) {
	const parsed = parseBrowserErrorPayload(value);
	if (parsed) return parsed;
	return fallback ? { error: fallback } : null;
}
/** Build a route-failure envelope while allowing only closed Browser metadata. */
function createBrowserProxyFailure(status, body) {
	return { error: {
		status,
		body: normalizeBrowserProxyErrorBody(body, `HTTP ${status}`) ?? { error: `HTTP ${status}` }
	} };
}
/** Parse an untrusted node response without forwarding arbitrary metadata. */
function parseBrowserProxyFailure(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const error = value.error;
	if (!error || typeof error !== "object" || Array.isArray(error)) return null;
	const candidate = error;
	if (!Number.isInteger(candidate.status) || candidate.status < 400 || candidate.status > 599) return null;
	const body = normalizeBrowserProxyErrorBody(candidate.body);
	if (!body) return null;
	return { error: {
		status: candidate.status,
		body
	} };
}
//#endregion
//#region extensions/browser/src/browser-proxy-upload.ts
/**
* Browser proxy upload transport.
*
* Existing Browser upload paths are Gateway-owned. Proxied requests carry
* bounded bytes to the node, which stages private copies under its upload root.
*/
const logger = createSubsystemLogger("browser");
const BROWSER_PROXY_UPLOAD_ROOT_NAME = ".proxy-uploads";
const BROWSER_PROXY_UPLOAD_PREFIX = "upload-";
const BROWSER_PROXY_UPLOAD_MARKER_NAME = ".openclaw-browser-proxy-upload-v1";
const BROWSER_PROXY_UPLOAD_MARKER_CONTENT = "openclaw-browser-proxy-upload-v1\n";
const BROWSER_PROXY_UPLOAD_RETENTION_MS = 1440 * 60 * 1e3;
const BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS = 3600 * 1e3;
const BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES = 256 * 1024 * 1024;
const BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES = 64;
const BROWSER_PROXY_MAX_ENCODED_FILE_LENGTH = Math.ceil(BROWSER_PROXY_MAX_FILE_BYTES / 3) * 4;
const MAX_STAGED_NAME_BYTES = 180;
const PORTABLE_NAME_FORBIDDEN = /* @__PURE__ */ new Set([
	"<",
	">",
	":",
	"\"",
	"/",
	"\\",
	"|",
	"?",
	"*",
	"%",
	"!"
]);
const WINDOWS_RESERVED_NAME = /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu;
const cleanupTimers = /* @__PURE__ */ new Map();
const recoveryPromises = /* @__PURE__ */ new Map();
const recoveryRetryTimers = /* @__PURE__ */ new Map();
const stagingLocks = /* @__PURE__ */ new Map();
function isFileChooserRequest(method, requestPath) {
	return method.toUpperCase() === "POST" && `/${requestPath.trim().replace(/^\/+/u, "")}` === "/hooks/file-chooser";
}
/** Identify upload requests before reading files or applying transport-only limits. */
function isBrowserProxyUploadRequest(params) {
	if (!isFileChooserRequest(params.method, params.path)) return false;
	const body = asNullableRecord(params.body);
	return Boolean(body && Array.isArray(body.paths) && body.paths.length > 0);
}
function readUploadPaths(body) {
	if (!Array.isArray(body.paths) || body.paths.length === 0) return null;
	if (!body.paths.every((entry) => typeof entry === "string")) throw new Error("browser proxy upload paths must contain only strings");
	return body.paths;
}
async function readBrowserProxyUploadFiles(paths, signal) {
	assertBrowserProxyFileCountWithinLimit(paths.length, "request");
	const files = [];
	let totalBytes = 0;
	for (const filePath of paths) {
		signal?.throwIfAborted();
		const stat = await fs.stat(filePath).catch(() => null);
		if (!stat?.isFile()) throw new Error(`browser proxy upload file not found: ${filePath}`);
		assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
		const buffer = await fs.readFile(filePath, signal ? { signal } : void 0);
		assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
		totalBytes += buffer.byteLength;
		files.push({
			name: path.basename(filePath),
			contentBase64: buffer.toString("base64")
		});
	}
	return files;
}
/** Build a node-only upload envelope while retaining the original body for host fallback. */
async function prepareBrowserProxyUploadRequest(params) {
	params.signal?.throwIfAborted();
	if (!isFileChooserRequest(params.method, params.path)) return { body: params.body };
	const body = asNullableRecord(params.body);
	if (!body) return { body: params.body };
	const requestedPaths = readUploadPaths(body);
	if (!requestedPaths) return { body: params.body };
	assertBrowserProxyFileCountWithinLimit(requestedPaths.length, "request");
	const resolved = await resolveExistingUploadPaths({
		requestedPaths,
		...params.uploadDir ? { uploadDir: params.uploadDir } : {},
		...params.inboundMediaDir ? { inboundMediaDir: params.inboundMediaDir } : {}
	});
	if (!resolved.ok) throw new Error(resolved.error);
	const upload = {
		envelope: BROWSER_PROXY_UPLOAD_ENVELOPE,
		files: await readBrowserProxyUploadFiles(resolved.paths, params.signal)
	};
	const { paths: _paths, ...bodyWithoutPaths } = body;
	return {
		body: bodyWithoutPaths,
		upload
	};
}
function truncateUtf8(value, maxBytes) {
	let result = "";
	let bytes = 0;
	for (const character of value) {
		const nextBytes = Buffer.byteLength(character, "utf8");
		if (bytes + nextBytes > maxBytes) break;
		result += character;
		bytes += nextBytes;
	}
	return result;
}
function sanitizeUploadName(name) {
	const basename = path.posix.basename(name.replaceAll("\\", "/"));
	const cleaned = Array.from(basename, (character) => {
		const codePoint = character.codePointAt(0) ?? 0;
		return codePoint <= 31 || codePoint === 127 || PORTABLE_NAME_FORBIDDEN.has(character) ? "_" : character;
	}).join("").trim().replace(/[. ]+$/u, "");
	const portable = WINDOWS_RESERVED_NAME.test(cleaned) ? `_${cleaned}` : cleaned;
	return truncateUtf8(portable && portable !== "." && portable !== ".." ? portable : "upload", MAX_STAGED_NAME_BYTES) || "upload";
}
function decodedBase64Size(value) {
	if (value.length % 4 !== 0) throw new Error("INVALID_REQUEST: invalid browser proxy upload encoding");
	const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
	return value.length / 4 * 3 - padding;
}
function decodeUploadFile(file, totalBytes) {
	if (!file || typeof file.name !== "string" || !file.name.trim() || typeof file.contentBase64 !== "string" || file.contentBase64.length > BROWSER_PROXY_MAX_ENCODED_FILE_LENGTH) throw new Error("INVALID_REQUEST: invalid browser proxy upload file");
	const estimatedBytes = decodedBase64Size(file.contentBase64);
	assertBrowserProxyFileBytesWithinLimits(estimatedBytes, totalBytes + estimatedBytes);
	const buffer = Buffer.from(file.contentBase64, "base64");
	if (buffer.toString("base64") !== file.contentBase64) throw new Error("INVALID_REQUEST: invalid browser proxy upload encoding");
	assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
	return buffer;
}
async function removeStagedUpload(directory) {
	const timer = cleanupTimers.get(directory);
	if (timer) {
		clearTimeout(timer);
		cleanupTimers.delete(directory);
	}
	try {
		await fs.rm(directory, {
			recursive: true,
			force: true
		});
	} catch (error) {
		logger.warn(`browser proxy upload cleanup failed; retrying: ${String(error)}`);
		scheduleCleanup(directory, BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS);
	}
}
async function readDirectoryBytes(directory, signal) {
	signal?.throwIfAborted();
	let entries;
	try {
		entries = await fs.readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return 0;
		throw error;
	}
	let totalBytes = 0;
	for (const entry of entries) {
		signal?.throwIfAborted();
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			totalBytes += await readDirectoryBytes(entryPath, signal);
			continue;
		}
		if (!entry.isFile()) continue;
		const stat = await fs.stat(entryPath).catch(() => null);
		totalBytes += stat?.isFile() ? stat.size : 0;
	}
	return totalBytes;
}
async function readOwnedStagedUploads(stagingRoot, signal) {
	signal?.throwIfAborted();
	let entries;
	try {
		entries = await fs.readdir(stagingRoot, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	return (await Promise.all(entries.filter((entry) => entry.isDirectory() && entry.name.startsWith(BROWSER_PROXY_UPLOAD_PREFIX)).map(async (entry) => {
		signal?.throwIfAborted();
		const directory = path.join(stagingRoot, entry.name);
		const stat = await fs.stat(directory).catch(() => null);
		if (!stat?.isDirectory()) return null;
		if (typeof process.getuid === "function" && stat.uid !== process.getuid()) return null;
		if (await fs.readFile(path.join(directory, BROWSER_PROXY_UPLOAD_MARKER_NAME), "utf8").catch(() => null) !== BROWSER_PROXY_UPLOAD_MARKER_CONTENT) return null;
		return {
			bytes: await readDirectoryBytes(directory, signal),
			directory,
			mtimeMs: stat.mtimeMs
		};
	}))).filter((upload) => upload !== null);
}
function scheduleCleanup(directory, delayMs) {
	if (cleanupTimers.has(directory)) return;
	const timer = setTimeout(() => {
		cleanupTimers.delete(directory);
		removeStagedUpload(directory);
	}, Math.max(0, delayMs));
	cleanupTimers.set(directory, timer);
	timer.unref?.();
}
async function recoverStagedUploads(params) {
	const { uploadDir, retentionMs, nowMs, limits } = params;
	const stagingRoot = path.join(uploadDir, BROWSER_PROXY_UPLOAD_ROOT_NAME);
	const retained = [];
	for (const upload of await readOwnedStagedUploads(stagingRoot)) if (retentionMs - Math.max(0, nowMs - upload.mtimeMs) <= 0) await removeStagedUpload(upload.directory);
	else retained.push(upload);
	retained.sort((left, right) => left.mtimeMs - right.mtimeMs);
	let totalBytes = retained.reduce((total, upload) => total + upload.bytes, 0);
	while (retained.length > limits.maxRetainedDirectories || totalBytes > limits.maxRetainedBytes) {
		const oldest = retained.shift();
		if (!oldest) break;
		totalBytes -= oldest.bytes;
		await removeStagedUpload(oldest.directory);
	}
	for (const upload of retained) {
		const remaining = retentionMs - Math.max(0, nowMs - upload.mtimeMs);
		scheduleCleanup(upload.directory, remaining);
	}
}
function clearRecoveryRetry(uploadDir) {
	const timer = recoveryRetryTimers.get(uploadDir);
	if (!timer) return;
	clearTimeout(timer);
	recoveryRetryTimers.delete(uploadDir);
}
function scheduleRecoveryRetry(uploadDir, retentionMs) {
	if (recoveryRetryTimers.has(uploadDir)) return;
	const timer = setTimeout(() => {
		recoveryRetryTimers.delete(uploadDir);
		recoveryPromises.delete(uploadDir);
		ensureBrowserProxyUploadCleanup({
			uploadDir,
			retentionMs
		});
	}, BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS);
	recoveryRetryTimers.set(uploadDir, timer);
	timer.unref?.();
}
async function runRecovery(params) {
	try {
		await recoverStagedUploads(params);
		clearRecoveryRetry(params.uploadDir);
	} catch (error) {
		logger.warn(`browser proxy upload recovery failed; retrying: ${String(error)}`);
		scheduleRecoveryRetry(params.uploadDir, params.retentionMs);
	}
}
/** Restores cleanup timers for staged uploads left by a previous node process. */
function ensureBrowserProxyUploadCleanup(options) {
	const uploadDir = options?.uploadDir ?? DEFAULT_UPLOAD_DIR;
	const retentionMs = options?.retentionMs ?? BROWSER_PROXY_UPLOAD_RETENTION_MS;
	const nowMs = options?.nowMs ?? Date.now();
	const limits = {
		maxRetainedBytes: options?.maxRetainedBytes ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES,
		maxRetainedDirectories: options?.maxRetainedDirectories ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES
	};
	if (options?.retentionMs !== void 0 || options?.nowMs !== void 0 || options?.maxRetainedBytes !== void 0 || options?.maxRetainedDirectories !== void 0) return runRecovery({
		uploadDir,
		retentionMs,
		nowMs,
		limits
	});
	const existing = recoveryPromises.get(uploadDir);
	if (existing) return existing;
	const recovery = runRecovery({
		uploadDir,
		retentionMs,
		nowMs,
		limits
	}).finally(() => {
		if (recoveryRetryTimers.has(uploadDir)) recoveryPromises.delete(uploadDir);
	});
	recoveryPromises.set(uploadDir, recovery);
	return recovery;
}
async function waitForStagingLock(previous, signal) {
	if (!signal) {
		await previous;
		return;
	}
	signal.throwIfAborted();
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => {
			try {
				signal.throwIfAborted();
			} catch (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			}
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		await Promise.race([previous, aborted]);
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function withStagingLock(uploadDir, task, signal) {
	const previous = stagingLocks.get(uploadDir) ?? Promise.resolve();
	let release = () => {};
	const current = new Promise((resolve) => {
		release = resolve;
	});
	const tail = previous.then(() => current);
	stagingLocks.set(uploadDir, tail);
	try {
		await waitForStagingLock(previous, signal);
		return await task();
	} finally {
		release();
		if (stagingLocks.get(uploadDir) === tail) stagingLocks.delete(uploadDir);
	}
}
function validateUploadEnvelope(upload) {
	if (!upload || upload.envelope !== "browser-upload-v1" || !Array.isArray(upload.files) || upload.files.length === 0) throw new Error("INVALID_REQUEST: invalid browser proxy upload envelope");
	assertBrowserProxyFileCountWithinLimit(upload.files.length, "request");
	return upload.files;
}
/** Stage a validated upload envelope under the node's managed Browser upload root. */
async function stageBrowserProxyUploadRequest(params) {
	params.signal?.throwIfAborted();
	if (params.upload === void 0) return { body: params.body };
	if (!isFileChooserRequest(params.method, params.path)) throw new Error("INVALID_REQUEST: browser proxy upload requires the file chooser route");
	const body = asNullableRecord(params.body);
	if (!body || Object.hasOwn(body, "paths")) throw new Error("INVALID_REQUEST: browser proxy upload body must omit paths");
	const files = validateUploadEnvelope(params.upload);
	const uploadDir = params.uploadDir ?? DEFAULT_UPLOAD_DIR;
	const stagingRoot = path.join(uploadDir, BROWSER_PROXY_UPLOAD_ROOT_NAME);
	await fs.mkdir(stagingRoot, {
		recursive: true,
		mode: 448
	});
	params.signal?.throwIfAborted();
	await ensureBrowserProxyUploadCleanup({ uploadDir });
	params.signal?.throwIfAborted();
	const decodedFiles = [];
	let fileBytes = 0;
	for (const file of files) {
		const buffer = decodeUploadFile(file, fileBytes);
		fileBytes += buffer.byteLength;
		decodedFiles.push({
			buffer,
			name: file.name
		});
	}
	const retainedRequestBytes = fileBytes + Buffer.byteLength(BROWSER_PROXY_UPLOAD_MARKER_CONTENT);
	const limits = {
		maxRetainedBytes: params.maxRetainedBytes ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES,
		maxRetainedDirectories: params.maxRetainedDirectories ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES
	};
	return await withStagingLock(uploadDir, async () => {
		params.signal?.throwIfAborted();
		const retained = await readOwnedStagedUploads(stagingRoot, params.signal);
		const retainedBytes = retained.reduce((total, upload) => total + upload.bytes, 0);
		if (retained.length >= limits.maxRetainedDirectories || retainedBytes + retainedRequestBytes > limits.maxRetainedBytes) throw new Error("RESOURCE_EXHAUSTED: browser proxy upload staging limit reached");
		const directory = await fs.mkdtemp(path.join(stagingRoot, BROWSER_PROXY_UPLOAD_PREFIX));
		const stagedPaths = [];
		try {
			await fs.writeFile(path.join(directory, BROWSER_PROXY_UPLOAD_MARKER_NAME), BROWSER_PROXY_UPLOAD_MARKER_CONTENT, {
				flag: "wx",
				mode: 384,
				signal: params.signal
			});
			for (const [index, file] of decodedFiles.entries()) {
				params.signal?.throwIfAborted();
				const fileDirectory = path.join(directory, String(index));
				await fs.mkdir(fileDirectory, { mode: 448 });
				params.signal?.throwIfAborted();
				const filePath = path.join(fileDirectory, sanitizeUploadName(file.name));
				await fs.writeFile(filePath, file.buffer, {
					flag: "wx",
					mode: 384,
					signal: params.signal
				});
				stagedPaths.push(filePath);
			}
		} catch (error) {
			await removeStagedUpload(directory);
			throw error;
		}
		scheduleCleanup(directory, BROWSER_PROXY_UPLOAD_RETENTION_MS);
		return {
			body: {
				...body,
				paths: stagedPaths
			},
			directory
		};
	}, params.signal);
}
/** Remove staged copies after a request fails before Browser ownership is established. */
async function discardStagedBrowserProxyUpload(staged) {
	if (staged.directory) await removeStagedUpload(staged.directory);
}
//#endregion
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
async function postDownloadRequest(baseUrl, route, body, profile, timeoutMs) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `${route}${buildProfileQuery(profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(timeoutMs)
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
		timeoutMs: timeoutMs === void 0 ? 2e4 : resolveBrowserOperationRequestTimeoutMs(timeoutMs)
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
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs)
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
		timeoutMs: resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs)
	});
}
/** Wait for the next managed browser download and save it under the guarded download root. */
async function browserWaitForDownload(baseUrl, opts) {
	return await postDownloadRequest(baseUrl, "/wait/download", {
		targetId: opts.targetId,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, opts.profile, opts.timeoutMs);
}
/** Click a snapshot ref and save its download under the guarded download root. */
async function browserDownload(baseUrl, opts) {
	return await postDownloadRequest(baseUrl, "/download", {
		targetId: opts.targetId,
		ref: opts.ref,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, opts.profile, opts.timeoutMs);
}
/** Execute one normalized browser action request. */
async function browserAct(baseUrl, req, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/act${buildProfileQuery(opts?.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req),
		timeoutMs: resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req))
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
		timeoutMs: effectiveTimeoutMs
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
	])}`), { timeoutMs: 2e4 });
}
/** Save the current page as PDF through browser control. */
async function browserPdfSave(baseUrl, opts = {}) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/pdf${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ targetId: opts.targetId }),
		timeoutMs: 2e4
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
function decodeBrowserProxyFileBase64(file, totalBytes) {
	const estimatedBytes = estimateBase64DecodedBytes(file.base64);
	assertBrowserProxyFileBytesWithinLimits(estimatedBytes, totalBytes + estimatedBytes);
	const canonicalBase64 = file.base64 === "" ? "" : canonicalizeBase64(file.base64);
	if (canonicalBase64 === void 0) throw new Error("browser proxy file contains malformed base64 data");
	const buffer = Buffer.from(canonicalBase64, "base64");
	assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
	return buffer;
}
/** Persist proxy-returned files and return a remote-path to local-path map. */
async function persistBrowserProxyFiles(files) {
	if (!files || files.length === 0) return /* @__PURE__ */ new Map();
	assertBrowserProxyFileCountWithinLimit(files.length);
	const decoded = [];
	let totalBytes = 0;
	for (const file of files) {
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
	return mapping;
}
/** Rewrite every supported result path that points at a persisted proxy file. */
function applyBrowserProxyPaths(result, mapping) {
	visitBrowserProxyFilePaths(result, (filePath) => mapping.get(filePath));
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
	if (params.skipRouteRegistrationForTest) app.get("/", (_req, res) => {
		res.status(200).send("OK");
	});
	else {
		const [{ createBrowserRouteContext }, { registerBrowserRoutes }] = await Promise.all([import("./server-context-CmNvWV_U.js"), import("./routes-DiONFR9I.js")]);
		registerBrowserRoutes(app, createBrowserRouteContext({
			getState: () => state,
			onEnsureAttachTarget: params.onEnsureAttachTarget
		}));
	}
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
		if (params.errorEnvelope === "browser-v1") return JSON.stringify(createBrowserProxyFailure(response.status, response.body));
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
	const serialized = JSON.stringify(files ? {
		result,
		files
	} : { result });
	if (Buffer.byteLength(JSON.stringify(serialized)) > BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES) throw new Error("browser proxy payload exceeds 24 MiB encoded limit");
	return serialized;
}
//#endregion
export { prepareBrowserProxyUploadRequest as _, persistBrowserProxyFiles as a, browserAct as c, browserDownload as d, browserNavigate as f, isBrowserProxyUploadRequest as g, ensureBrowserProxyUploadCleanup as h, applyBrowserProxyPaths as i, browserArmDialog as l, browserWaitForDownload as m, startBrowserBridgeServer as n, browserConsoleMessages as o, browserScreenshotAction as p, stopBrowserBridgeServer as r, browserPdfSave as s, runBrowserProxyCommand as t, browserArmFileChooser as u, BROWSER_PROXY_ERROR_ENVELOPE as v, parseBrowserProxyFailure as y };
