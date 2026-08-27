import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, r as listAgentEntries, y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
import path from "node:path";
//#region src/shared/avatar-limits.ts
/** Maximum avatar payload size accepted by local file and Gateway upload paths. */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
/** Maximum encoded length of a supported local avatar at AVATAR_MAX_BYTES. */
const AVATAR_MAX_DATA_URL_CHARS = Math.ceil(AVATAR_MAX_BYTES / 3) * 4 + 26;
const AVATAR_IMAGE_DATA_URL_RE = /^data:image\//i;
/** Accepts image data URLs that fit the Gateway and Control UI payload boundary. */
function isRenderableAvatarImageDataUrl(value) {
	return value.length <= AVATAR_MAX_DATA_URL_CHARS && AVATAR_IMAGE_DATA_URL_RE.test(value);
}
//#endregion
//#region src/shared/avatar-policy.ts
/**
* Shared avatar source policy for config validation, agent identity loading,
* gateway uploads, and Control UI rendering hints.
*/
const LOCAL_AVATAR_EXTENSIONS = /* @__PURE__ */ new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg"
]);
/** MIME hints for known image extensions, including formats not accepted for local serving. */
const AVATAR_MIME_BY_EXT = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".bmp": "image/bmp",
	".tif": "image/tiff",
	".tiff": "image/tiff"
};
/** Detects data URLs before image-specific avatar validation. */
const AVATAR_DATA_RE = /^data:/i;
/** Detects remote avatar URLs served over HTTP(S). */
const AVATAR_HTTP_RE = /^https?:\/\//i;
/** Detects URI schemes so non-path avatar values can be rejected or routed. */
const AVATAR_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
/** Detects Windows absolute paths before URI-scheme classification. */
const WINDOWS_ABS_RE = /^[a-zA-Z]:[\\/]/;
const AVATAR_PATH_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
/** Resolves a local avatar file MIME type from its extension. */
function resolveAvatarMime(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	return AVATAR_MIME_BY_EXT[ext] ?? "application/octet-stream";
}
/** Detects any data URL value before image-specific validation. */
function isAvatarDataUrl(value) {
	return AVATAR_DATA_RE.test(value);
}
/** Detects remote HTTP(S) avatar URLs. */
function isAvatarHttpUrl(value) {
	return AVATAR_HTTP_RE.test(value);
}
/** Detects URI-scheme-like avatar values, including non-HTTP schemes. */
function hasAvatarUriScheme(value) {
	return AVATAR_SCHEME_RE.test(value);
}
/** Detects Windows absolute paths so they are not mistaken for URI schemes. */
function isWindowsAbsolutePath(value) {
	return WINDOWS_ABS_RE.test(value);
}
/** Checks that a resolved avatar path remains inside its configured root. */
function isPathWithinRoot(rootDir, targetPath) {
	return isPathInside(rootDir, targetPath);
}
/** Heuristically detects strings that look like local avatar file paths. */
function looksLikeAvatarPath(value) {
	if (/[\\/]/.test(value)) return true;
	return AVATAR_PATH_EXT_RE.test(value);
}
/** Restricts local avatar files to image extensions that can be safely served inline. */
function isSupportedLocalAvatarExtension(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	return LOCAL_AVATAR_EXTENSIONS.has(ext);
}
//#endregion
//#region src/config/agent-workspace-roster-transition.ts
function pinSurvivorWorkspaceForRosterCollapse(sourceConfig, targetConfig, env = process.env) {
	const sourceEntries = listAgentEntries(sourceConfig);
	const targetEntries = listAgentEntries(targetConfig);
	if (sourceEntries.length <= 1 || targetEntries.length !== 1) return {
		config: targetConfig,
		insertedPaths: []
	};
	const survivorId = normalizeAgentId(targetEntries[0].id);
	if (!sourceEntries.some((entry) => normalizeAgentId(entry.id) === survivorId)) return {
		config: targetConfig,
		insertedPaths: []
	};
	const targetAgents = targetConfig.agents ?? {};
	const entries = targetAgents.entries ? { ...targetAgents.entries } : toAgentEntriesRecord(targetEntries);
	const entryKey = Object.keys(entries).find((candidate) => normalizeAgentId(candidate) === survivorId);
	const entry = entryKey ? entries[entryKey] : void 0;
	const workspaceNeedsPin = entry !== void 0 && (!Object.hasOwn(entry, "workspace") || typeof entry.workspace === "string" && entry.workspace.trim().length === 0);
	if (!entryKey || !entry || !workspaceNeedsPin) return {
		config: targetConfig,
		insertedPaths: []
	};
	entries[entryKey] = {
		...entry,
		workspace: resolveAgentWorkspaceDir(sourceConfig, survivorId, env)
	};
	const { list: _legacyList, ...canonicalAgents } = targetAgents;
	return {
		config: {
			...targetConfig,
			agents: {
				...canonicalAgents,
				entries
			}
		},
		insertedPaths: [[
			"agents",
			"entries",
			entryKey,
			"workspace"
		]]
	};
}
//#endregion
export { isPathWithinRoot as a, looksLikeAvatarPath as c, AVATAR_MAX_DATA_URL_CHARS as d, isRenderableAvatarImageDataUrl as f, isAvatarHttpUrl as i, resolveAvatarMime as l, hasAvatarUriScheme as n, isSupportedLocalAvatarExtension as o, isAvatarDataUrl as r, isWindowsAbsolutePath as s, pinSurvivorWorkspaceForRosterCollapse as t, AVATAR_MAX_BYTES as u };
