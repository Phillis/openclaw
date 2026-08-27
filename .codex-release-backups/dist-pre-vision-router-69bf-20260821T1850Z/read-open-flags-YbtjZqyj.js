import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { t as normalizeLowercaseStringOrEmpty } from "./string-coerce-DTQhjyM_.js";
import { URL, fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/local-file-access.js
const ENCODED_FILE_URL_SEPARATOR_RE = /%(?:2f|5c)/i;
const FILE_URL_PREFIX_RE = /^file:\/\//i;
function isFileUrl(input) {
	return FILE_URL_PREFIX_RE.test(input);
}
function isLocalFileUrlHost(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname);
	return normalized === "" || normalized === "localhost";
}
function hasEncodedFileUrlSeparator(pathname) {
	return ENCODED_FILE_URL_SEPARATOR_RE.test(pathname);
}
function isWindowsNetworkPath(filePath, platform = process.platform) {
	if (platform !== "win32") return false;
	const normalized = filePath.replace(/\//g, "\\");
	if (normalized.length >= 7 && normalized.startsWith("\\\\?\\") && /^[a-z]$/i.test(normalized[4] ?? "") && normalized[5] === ":" && normalized[6] === "\\") return false;
	return normalized.startsWith("\\\\");
}
function isWindowsDriveLetterPath(filePath, platform = process.platform) {
	return platform === "win32" && /^[A-Za-z]:[\\/]/.test(filePath);
}
function assertNoWindowsNetworkPath(filePath, label = "Path") {
	if (isWindowsNetworkPath(filePath)) throw new Error(`${label} cannot use Windows network paths: ${filePath}`);
}
function safeFileURLToPath(fileUrl, platform = process.platform) {
	let parsed;
	try {
		parsed = new URL(fileUrl);
	} catch {
		throw new Error(`Invalid file:// URL: ${fileUrl}`);
	}
	if (parsed.protocol !== "file:") throw new Error(`Invalid file:// URL: ${fileUrl}`);
	if (!isLocalFileUrlHost(parsed.hostname)) throw new Error(`file:// URLs with remote hosts are not allowed: ${fileUrl}`);
	if (hasEncodedFileUrlSeparator(parsed.pathname)) throw new Error(`file:// URLs cannot encode path separators: ${fileUrl}`);
	const filePath = fileURLToPath(parsed, { windows: platform === "win32" });
	if (isWindowsNetworkPath(filePath, platform)) throw new Error(`Local file URL cannot use Windows network paths: ${filePath}`);
	return filePath;
}
function trySafeFileURLToPath(fileUrl, platform = process.platform) {
	try {
		return safeFileURLToPath(fileUrl, platform);
	} catch {
		return;
	}
}
function basenameFromMediaSource(source) {
	if (!source) return;
	if (isFileUrl(source)) {
		const filePath = trySafeFileURLToPath(source);
		return filePath ? path.basename(filePath) || void 0 : void 0;
	}
	if (/^https?:\/\//i.test(source)) try {
		return path.basename(new URL(source).pathname) || void 0;
	} catch {
		return;
	}
	return path.basename(source) || void 0;
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/device-path.js
const POSIX_BLOCKED_DEVICE_PATHS = /* @__PURE__ */ new Set([
	"/dev/zero",
	"/dev/random",
	"/dev/urandom",
	"/dev/full",
	"/dev/stdin",
	"/dev/stdout",
	"/dev/stderr",
	"/dev/tty",
	"/dev/console"
]);
const WINDOWS_RESERVED_DEVICE_NAMES = /* @__PURE__ */ new Set([
	"CON",
	"PRN",
	"AUX",
	"NUL",
	"CLOCK$",
	"CONIN$",
	"CONOUT$",
	"COM1",
	"COM2",
	"COM3",
	"COM4",
	"COM5",
	"COM6",
	"COM7",
	"COM8",
	"COM9",
	"COM¹",
	"COM²",
	"COM³",
	"LPT1",
	"LPT2",
	"LPT3",
	"LPT4",
	"LPT5",
	"LPT6",
	"LPT7",
	"LPT8",
	"LPT9",
	"LPT¹",
	"LPT²",
	"LPT³"
]);
const WINDOWS_SEPARATOR_CHAR_CODE = 92;
const WINDOWS_IGNORED_SPACE_CHAR_CODE = 32;
const WINDOWS_IGNORED_DOT_CHAR_CODE = 46;
function trimTrailingWindowsSeparators(value) {
	let end = value.length;
	while (end > 0 && value.charCodeAt(end - 1) === WINDOWS_SEPARATOR_CHAR_CODE) end -= 1;
	return end === value.length ? value : value.slice(0, end);
}
function trimTrailingWindowsIgnoredChars(value) {
	let end = value.length;
	while (end > 0) {
		const charCode = value.charCodeAt(end - 1);
		if (charCode !== WINDOWS_IGNORED_SPACE_CHAR_CODE && charCode !== WINDOWS_IGNORED_DOT_CHAR_CODE) break;
		end -= 1;
	}
	return end === value.length ? value : value.slice(0, end);
}
function candidateReadPaths(filePath, platform) {
	if (!isFileUrl(filePath)) return [filePath];
	const parsed = trySafeFileURLToPath(filePath, platform);
	return parsed === void 0 ? [filePath] : [filePath, parsed];
}
function normalizePosixPath(filePath, cwd) {
	if (path.posix.isAbsolute(filePath)) return path.posix.normalize(filePath);
	const base = cwd && path.posix.isAbsolute(cwd) ? cwd : process.cwd();
	return path.posix.resolve(base, filePath);
}
function matchPosixDeviceReadPath(filePath, cwd) {
	const normalized = normalizePosixPath(filePath, cwd);
	if (POSIX_BLOCKED_DEVICE_PATHS.has(normalized)) return {
		path: normalized,
		reason: "posix-device"
	};
	if (normalized === "/dev/fd" || normalized.startsWith("/dev/fd/")) return {
		path: normalized,
		reason: "posix-fd"
	};
	if (/^\/proc\/(?:self|thread-self|\d+)\/fd(?:\/|$)/.test(normalized)) return {
		path: normalized,
		reason: "posix-fd"
	};
}
function normalizeWindowsDeviceBaseName(filePath) {
	const normalized = trimTrailingWindowsSeparators(filePath.replace(/\//g, "\\"));
	const lastSegment = normalized.split("\\").filter(Boolean).at(-1) ?? normalized;
	const withoutTrailingIgnoredChars = trimTrailingWindowsIgnoredChars(lastSegment.split(":")[0] ?? lastSegment);
	return (withoutTrailingIgnoredChars.split(".")[0] ?? withoutTrailingIgnoredChars).toUpperCase();
}
function matchWindowsDeviceReadPath(filePath) {
	const normalized = filePath.replace(/\//g, "\\");
	if (/^\\\\\.\\/.test(normalized) || /^\\\\\?\\GLOBALROOT\\Device\\/i.test(normalized)) return {
		path: normalized,
		reason: "windows-device"
	};
	const baseName = normalizeWindowsDeviceBaseName(filePath);
	if (WINDOWS_RESERVED_DEVICE_NAMES.has(baseName)) return {
		path: normalized,
		reason: "windows-device"
	};
}
function matchUnsafeDeviceReadPath(filePath, options = {}) {
	const platform = options.platform ?? process.platform;
	for (const candidate of candidateReadPaths(filePath, platform)) {
		const match = platform === "win32" ? matchWindowsDeviceReadPath(candidate) : matchPosixDeviceReadPath(candidate, options.cwd);
		if (match) return match;
	}
}
function isUnsafeDeviceReadPath(filePath, options) {
	return matchUnsafeDeviceReadPath(filePath, options) !== void 0;
}
function assertNoUnsafeDeviceReadPath(filePath, options) {
	if (matchUnsafeDeviceReadPath(filePath, options)) throw new FsSafeError("device-path", `file reads from unsafe device paths are not allowed: ${filePath}`);
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/read-open-flags.js
function resolveReadOpenFlags(options) {
	const constants = options?.constants ?? fs.constants;
	const noFollow = process.platform !== "win32" && options?.followSymlinks !== true && typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
	const nonBlocking = process.platform !== "win32" && typeof constants.O_NONBLOCK === "number" ? constants.O_NONBLOCK : 0;
	return constants.O_RDONLY | noFollow | nonBlocking;
}
//#endregion
export { assertNoWindowsNetworkPath as a, isFileUrl as c, safeFileURLToPath as d, trySafeFileURLToPath as f, isUnsafeDeviceReadPath as i, isWindowsDriveLetterPath as l, WINDOWS_RESERVED_DEVICE_NAMES as n, basenameFromMediaSource as o, assertNoUnsafeDeviceReadPath as r, hasEncodedFileUrlSeparator as s, resolveReadOpenFlags as t, isWindowsNetworkPath as u };
