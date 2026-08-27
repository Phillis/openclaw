import { i as resolveOsHomeDir, t as expandHomePrefix } from "./home-dir-DcrXWQPU.js";
import { fileURLToPath } from "node:url";
import { isAbsolute, resolve } from "node:path";
//#region src/agents/sessions/tools/path-utils.ts
/**
* Session tool path normalization helpers.
*
* Expands user/file URL inputs and resolves read/write paths against the active cwd with macOS filename variants.
*/
const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
const NARROW_NO_BREAK_SPACE = " ";
function normalizeUnicodeSpaces(str) {
	return str.replace(UNICODE_SPACES, " ");
}
function tryMacOSScreenshotPath(filePath) {
	return filePath.replace(/ (?=(?:AM|PM)(?:\b|\.))/gi, NARROW_NO_BREAK_SPACE);
}
function normalizeAtPrefix(filePath) {
	return filePath.startsWith("@") ? filePath.slice(1) : filePath;
}
/** Expand OS-home syntax without treating a POSIX backslash as a separator. */
function expandOsHomePrefix(filePath) {
	if (!(filePath === "~" || filePath.startsWith("~/") || process.platform === "win32" && filePath.startsWith("~\\"))) return filePath;
	const home = resolveOsHomeDir();
	return home ? expandHomePrefix(filePath, { home }) : filePath;
}
function expandPath(filePath, normalizeSpaces = true) {
	const withoutAtPrefix = normalizeAtPrefix(filePath);
	const normalized = normalizeSpaces ? normalizeUnicodeSpaces(withoutAtPrefix) : withoutAtPrefix;
	if (normalized.startsWith("file://")) try {
		return fileURLToPath(normalized);
	} catch {
		return normalized;
	}
	return expandOsHomePrefix(normalized);
}
/**
* Resolve a path relative to the given cwd.
* Handles ~ expansion and absolute paths.
*/
function resolveToCwd(filePath, cwd) {
	const expanded = expandPath(filePath);
	if (isAbsolute(expanded)) return expanded;
	return resolve(cwd, expanded);
}
function resolveReadPath(filePath, cwd) {
	const expanded = expandPath(filePath, false);
	return isAbsolute(expanded) ? expanded : resolve(cwd, expanded);
}
/** Equivalent spellings worth probing after an exact read path misses. */
function getReadPathVariants(filePath) {
	const variants = /* @__PURE__ */ new Set();
	const asciiSpace = normalizeUnicodeSpaces(filePath);
	for (const spaced of [asciiSpace, tryMacOSScreenshotPath(asciiSpace)]) {
		const straightQuotes = spaced.replace(/[\u2018\u2019]/g, "'");
		const curlyQuotes = spaced.replace(/['\u2018]/g, "’");
		for (const quoted of [straightQuotes, curlyQuotes]) {
			variants.add(quoted.normalize("NFC"));
			variants.add(quoted.normalize("NFD"));
		}
	}
	variants.delete(filePath);
	return [...variants];
}
//#endregion
export { resolveToCwd as i, getReadPathVariants as n, resolveReadPath as r, expandOsHomePrefix as t };
