import "./fs-safe-defaults-BPVQr7Lx.js";
import path from "node:path";
//#region src/infra/path-guards.ts
/**
* Normalize a Windows path for boundary math whose result is handed back to callers.
*
* Unlike `normalizeWindowsPathForComparison`, this preserves case: `path.win32.relative`
* already matches roots case-insensitively, so lowercasing only corrupts the returned
* relative path — and callers create files from it on a case-preserving filesystem.
* Extended-length prefix stripping stays, or `\\?\`-prefixed inputs read as boundary escapes.
*/
function normalizeWindowsPathPreservingCase(input) {
	const normalized = path.win32.normalize(input);
	if (!normalized.startsWith("\\\\?\\")) return normalized;
	const withoutPrefix = normalized.slice(4);
	return withoutPrefix.toUpperCase().startsWith("UNC\\") ? `\\\\${withoutPrefix.slice(4)}` : withoutPrefix;
}
//#endregion
export { normalizeWindowsPathPreservingCase as t };
