import { i as resolveOsHomeDir, t as expandHomePrefix } from "./home-dir-BFvskzn8.js";
import { fileURLToPath } from "node:url";
import { basename, isAbsolute, resolve } from "node:path";
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
function expandPath(filePath) {
	const normalized = normalizeAtPrefix(filePath);
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
	return isAbsolute(expanded) ? expanded : resolve(cwd, expanded);
}
/** Equivalent filename spellings worth probing after an exact read path misses. */
function getReadPathVariants(filePath) {
	const variants = /* @__PURE__ */ new Set();
	const fileName = basename(filePath);
	const parentPrefix = filePath.slice(0, filePath.length - fileName.length);
	const asciiSpace = normalizeUnicodeSpaces(fileName);
	for (const spaced of [asciiSpace, tryMacOSScreenshotPath(asciiSpace)]) {
		const straightQuotes = spaced.replace(/[\u2018\u2019]/g, "'");
		const curlyQuotes = spaced.replace(/['\u2018]/g, "’");
		for (const quoted of [straightQuotes, curlyQuotes]) {
			variants.add(`${parentPrefix}${quoted.normalize("NFC")}`);
			if (process.platform !== "darwin") variants.add(`${parentPrefix}${quoted.normalize("NFD")}`);
		}
	}
	variants.delete(filePath);
	return [...variants];
}
//#endregion
export { getReadPathVariants as n, resolveToCwd as r, expandOsHomePrefix as t };
