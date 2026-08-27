import { d as resolveSafeBaseDir } from "./path-D138yf8v.js";
import { a as formatErrorDetail } from "./root-path-CsUfUJ7P.js";
import { n as ArchiveSecurityError } from "./archive-errors-yA0gvFwU.js";
import path from "node:path";
//#region node_modules/@openclaw/fs-safe/dist/archive-entry.js
function isWindowsDrivePath(value) {
	return normalizeArchiveEntryPath(value).split("/").some((segment) => /^[a-zA-Z]:/.test(segment));
}
function normalizeArchiveEntryPath(raw) {
	return raw.replaceAll("\\", "/");
}
function validateArchiveEntryPath(entryPath, params) {
	if (!entryPath || entryPath === "." || entryPath === "./") return;
	if (isWindowsDrivePath(entryPath)) throw new ArchiveSecurityError("entry-path", `archive entry uses a drive path: ${formatErrorDetail(entryPath)}`);
	if (entryPath.includes("\0")) throw new ArchiveSecurityError("entry-path", `archive entry contains a NUL byte: ${formatErrorDetail(entryPath)}`);
	const slashNormalized = normalizeArchiveEntryPath(entryPath);
	if (process.platform === "win32" && slashNormalized.split("/").some((segment) => segment.includes(":"))) throw new ArchiveSecurityError("entry-path", `archive entry uses a Windows alternate data stream path: ${formatErrorDetail(entryPath)}`);
	const normalized = path.posix.normalize(slashNormalized);
	if (normalized.split("/").some((segment) => Math.max(Buffer.byteLength(segment.normalize("NFC")), Buffer.byteLength(segment.normalize("NFD"))) > 255)) throw new ArchiveSecurityError("entry-path", `archive entry has an overlong path component: ${formatErrorDetail(entryPath)}`);
	const escapeLabel = params?.escapeLabel ?? "destination";
	if (normalized === ".." || normalized.startsWith("../")) throw new ArchiveSecurityError("entry-path", `archive entry escapes ${escapeLabel}: ${formatErrorDetail(entryPath)}`);
	if (path.posix.isAbsolute(normalized) || normalized.startsWith("//")) throw new ArchiveSecurityError("entry-path", `archive entry is absolute: ${formatErrorDetail(entryPath)}`);
	if (slashNormalized.split("/").includes("..")) throw new ArchiveSecurityError("entry-path", `archive entry contains a parent segment: ${formatErrorDetail(entryPath)}`);
}
function stripArchivePath(entryPath, stripComponents) {
	const raw = normalizeArchiveEntryPath(entryPath);
	if (!raw || raw === "." || raw === "./") return null;
	const parts = raw.split("/").filter((part) => part.length > 0 && part !== ".");
	const strip = Math.max(0, Math.floor(stripComponents));
	const stripped = strip === 0 ? parts.join("/") : parts.slice(strip).join("/");
	const result = path.posix.normalize(stripped);
	if (!result || result === "." || result === "./") return null;
	return result;
}
function createArchiveOutputPathTracker() {
	const seen = /* @__PURE__ */ new Set();
	return (entryPath, originalPath) => {
		const normalized = path.posix.normalize(normalizeArchiveEntryPath(entryPath));
		const collisionKey = normalized.normalize("NFC").toLowerCase().normalize("NFC");
		if (seen.has(collisionKey)) throw new ArchiveSecurityError("entry-path", `archive entries collide at output path ${formatErrorDetail(normalized)}: ${formatErrorDetail(originalPath)}`);
		seen.add(collisionKey);
	};
}
function resolveArchiveOutputPath(params) {
	const safeBase = resolveSafeBaseDir(params.rootDir);
	const outPath = path.resolve(params.rootDir, params.relPath);
	const escapeLabel = params.escapeLabel ?? "destination";
	if (!outPath.startsWith(safeBase)) throw new ArchiveSecurityError("entry-path", `archive entry escapes ${escapeLabel}: ${formatErrorDetail(params.originalPath)}`);
	return outPath;
}
//#endregion
export { stripArchivePath as a, resolveArchiveOutputPath as i, isWindowsDrivePath as n, validateArchiveEntryPath as o, normalizeArchiveEntryPath as r, createArchiveOutputPathTracker as t };
