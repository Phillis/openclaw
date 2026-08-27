import { i as logWarn } from "./logger-DKrZPnAI.js";
import { i as terminalUploadDecodedSize, n as MAX_TERMINAL_UPLOAD_BYTES, r as isCanonicalTerminalUploadBase64, t as MAX_TERMINAL_UPLOAD_BASE64_LENGTH } from "./terminal-constants-0UMJMHnf.js";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { lstat, mkdir, mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
//#region src/infra/terminal-file-upload.ts
const TERMINAL_UPLOAD_PREFIX = "openclaw-terminal-upload-";
const TERMINAL_UPLOAD_RETENTION_MS = 1440 * 60 * 1e3;
const TERMINAL_UPLOAD_CLEANUP_RETRY_MS = 3600 * 1e3;
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
const cleanupRecoveryTimers = /* @__PURE__ */ new Map();
let defaultCleanupPromise;
/** Windows temp variables can point at a shared directory; inherit the user's profile ACL instead. */
function resolveTerminalUploadRoot(options) {
	return (options?.platform ?? process.platform) === "win32" ? path.join(options?.homeDir ?? homedir(), ".openclaw", "tmp") : options?.tempDir ?? tmpdir();
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
function sanitizeTerminalUploadName(name) {
	const basename = path.posix.basename(name.replaceAll("\\", "/"));
	const cleaned = Array.from(basename, (char) => {
		const codePoint = char.codePointAt(0) ?? 0;
		return codePoint <= 31 || codePoint === 127 || PORTABLE_NAME_FORBIDDEN.has(char) ? "_" : char;
	}).join("").trim().replace(/[. ]+$/u, "");
	const portable = WINDOWS_RESERVED_NAME.test(cleaned) ? `_${cleaned}` : cleaned;
	return truncateUtf8(portable && portable !== "." && portable !== ".." ? portable : "upload", MAX_STAGED_NAME_BYTES) || "upload";
}
function decodeTerminalUpload(contentBase64) {
	if (contentBase64.length > MAX_TERMINAL_UPLOAD_BASE64_LENGTH || terminalUploadDecodedSize(contentBase64) > 16777216) throw new Error(`terminal upload exceeds ${MAX_TERMINAL_UPLOAD_BYTES} bytes`);
	if (!isCanonicalTerminalUploadBase64(contentBase64)) throw new Error("invalid terminal upload encoding");
	const bytes = Buffer.from(contentBase64, "base64");
	if (bytes.length > 16777216) throw new Error(`terminal upload exceeds ${MAX_TERMINAL_UPLOAD_BYTES} bytes`);
	if (bytes.toString("base64") !== contentBase64) throw new Error("invalid terminal upload encoding");
	return bytes;
}
async function removeTerminalUploadDirectory(directory) {
	try {
		await rm(directory, {
			recursive: true,
			force: true
		});
	} catch (error) {
		logWarn(`terminal-upload: cleanup failed; retrying: ${String(error)}`);
		scheduleTerminalUploadCleanup(directory, TERMINAL_UPLOAD_CLEANUP_RETRY_MS);
	}
}
function scheduleTerminalUploadCleanup(directory, afterMs) {
	if (cleanupTimers.has(directory)) return;
	const timer = setTimeout(() => {
		cleanupTimers.delete(directory);
		removeTerminalUploadDirectory(directory);
	}, Math.max(0, afterMs));
	cleanupTimers.set(directory, timer);
	timer.unref?.();
}
/** Restores cleanup timers for staged uploads left by a previous process. */
async function recoverTerminalUploadCleanup(options) {
	const tempRoot = options?.tempRoot ?? resolveTerminalUploadRoot();
	const retentionMs = options?.retentionMs ?? TERMINAL_UPLOAD_RETENTION_MS;
	const nowMs = options?.nowMs ?? Date.now();
	let entries;
	try {
		entries = await readdir(tempRoot, { withFileTypes: true });
	} catch (error) {
		if (error.code !== "ENOENT") {
			logWarn(`terminal-upload: recovery scan failed: ${String(error)}`);
			throw error;
		}
		return;
	}
	await Promise.all(entries.filter((entry) => entry.isDirectory() && entry.name.startsWith(TERMINAL_UPLOAD_PREFIX)).map(async (entry) => {
		const directory = path.join(tempRoot, entry.name);
		try {
			const stats = await lstat(directory);
			if (!stats.isDirectory()) return;
			if (typeof process.getuid === "function" && stats.uid !== process.getuid()) return;
			const remainingMs = retentionMs - Math.max(0, nowMs - stats.mtimeMs);
			if (remainingMs <= 0) await removeTerminalUploadDirectory(directory);
			else scheduleTerminalUploadCleanup(directory, remainingMs);
		} catch (error) {
			if (error.code !== "ENOENT") {
				logWarn(`terminal-upload: recovery failed: ${String(error)}`);
				throw error;
			}
		}
	}));
}
function cleanupRecoveryRoot(options) {
	return options?.tempRoot ?? resolveTerminalUploadRoot();
}
function clearTerminalUploadCleanupRetry(tempRoot) {
	const timer = cleanupRecoveryTimers.get(tempRoot);
	if (!timer) return;
	clearTimeout(timer);
	cleanupRecoveryTimers.delete(tempRoot);
}
function scheduleTerminalUploadCleanupRetry(options) {
	const tempRoot = cleanupRecoveryRoot(options);
	if (cleanupRecoveryTimers.has(tempRoot)) return;
	const timer = setTimeout(() => {
		cleanupRecoveryTimers.delete(tempRoot);
		ensureTerminalUploadCleanup(options ? {
			tempRoot,
			retentionMs: options.retentionMs
		} : void 0);
	}, TERMINAL_UPLOAD_CLEANUP_RETRY_MS);
	cleanupRecoveryTimers.set(tempRoot, timer);
	timer.unref?.();
}
async function runTerminalUploadCleanupRecovery(options) {
	const tempRoot = cleanupRecoveryRoot(options);
	try {
		await recoverTerminalUploadCleanup(options);
		clearTerminalUploadCleanupRetry(tempRoot);
	} catch {
		scheduleTerminalUploadCleanupRetry(options);
	}
}
/** Starts one process-wide recovery scan and retries transient scan failures. */
function ensureTerminalUploadCleanup(options) {
	if (options) return runTerminalUploadCleanupRecovery(options);
	if (defaultCleanupPromise) return defaultCleanupPromise;
	defaultCleanupPromise = runTerminalUploadCleanupRecovery().finally(() => {
		if (cleanupRecoveryTimers.has(cleanupRecoveryRoot())) defaultCleanupPromise = void 0;
	});
	return defaultCleanupPromise;
}
/** Stages one browser-selected file in a private, expiring temporary directory. */
async function stageTerminalUpload(file, options) {
	if (!options?.tempRoot) ensureTerminalUploadCleanup();
	const bytes = decodeTerminalUpload(file.contentBase64);
	const platform = options?.platform ?? process.platform;
	const tempRoot = options?.tempRoot ?? resolveTerminalUploadRoot(options);
	if (platform === "win32" && !options?.tempRoot) await mkdir(tempRoot, {
		recursive: true,
		mode: 448
	});
	const directory = await mkdtemp(path.join(tempRoot, TERMINAL_UPLOAD_PREFIX));
	const targetPath = path.join(directory, sanitizeTerminalUploadName(file.name));
	try {
		await writeFile(targetPath, bytes, {
			flag: "wx",
			mode: 384
		});
	} catch (error) {
		await removeTerminalUploadDirectory(directory);
		throw error;
	}
	scheduleTerminalUploadCleanup(directory, options?.cleanupAfterMs ?? TERMINAL_UPLOAD_RETENTION_MS);
	return {
		path: targetPath,
		size: bytes.length
	};
}
//#endregion
export { stageTerminalUpload as n, ensureTerminalUploadCleanup as t };
