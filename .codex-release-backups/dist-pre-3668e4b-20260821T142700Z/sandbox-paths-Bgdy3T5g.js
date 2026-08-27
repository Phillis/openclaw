import { a as assertNoWindowsNetworkPath, d as safeFileURLToPath, s as hasEncodedFileUrlSeparator } from "./read-open-flags-YbtjZqyj.js";
import { a as isPathInside, i as isNotFoundPathError } from "./path-CYL8StfC.js";
import { s as assertNoPathAliasEscape } from "./root-impl-DNOINk8h.js";
import "./path-guards-CQdx2c2I.js";
import { d as resolveConfigDir, m as shortenHomePath } from "./utils-D9gvQMP6.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { n as isWindowsDrivePath } from "./archive-entry-UCGDJZ6a.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import "./archive-path-D5Is7hSS.js";
import "./local-file-access-D5Is7hSS.js";
import "./path-alias-guards-D5Is7hSS.js";
import { URL } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
//#region src/agents/sandbox-paths.ts
/**
* Sandbox input path normalization and boundary checks.
*
* Handles host paths, file URLs, temporary media paths, and workspace root assertions.
*/
const DATA_URL_RE = /^data:/i;
const SANDBOX_CONTAINER_WORKDIR = "/workspace";
const MANAGED_MEDIA_SUBDIRS = /* @__PURE__ */ new Set(["outbound"]);
function normalizeAtPrefix(filePath) {
	return filePath.startsWith("@") ? filePath.slice(1) : filePath;
}
function expandPath(filePath) {
	const normalized = normalizeAtPrefix(filePath);
	if (normalized === "~") return os.homedir();
	if (normalized.startsWith("~/")) return os.homedir() + normalized.slice(1);
	return normalized;
}
/** True when the path is absolute for the current platform or a Windows drive path (e.g. C:\\...), even if path.isAbsolute is false under POSIX rules. */
function hostPathLooksAbsolute(expanded) {
	return path.isAbsolute(expanded) || isWindowsDrivePath(expanded);
}
function resolveToCwd(filePath, cwd) {
	const expanded = expandPath(filePath);
	if (isWindowsDrivePath(expanded)) return path.win32.normalize(expanded);
	if (path.isAbsolute(expanded)) return expanded;
	return path.resolve(cwd, expanded);
}
function resolveSandboxInputPath(filePath, cwd) {
	return resolveToCwd(filePath, cwd);
}
function resolveSandboxPath(params) {
	const resolved = resolveSandboxInputPath(params.filePath, params.cwd);
	const rootResolved = path.resolve(params.root);
	const relative = path.relative(rootResolved, resolved);
	if (!relative || relative === "") return {
		resolved,
		relative: ""
	};
	if (relative === ".." || relative.startsWith("../") || relative.startsWith("..\\") || path.isAbsolute(relative) || isWindowsDrivePath(relative)) throw new Error(`Path escapes sandbox root (${shortenHomePath(rootResolved)}): ${params.filePath}`);
	return {
		resolved,
		relative
	};
}
const realpathNative = promisify(fs.realpath.native);
async function resolveRawPathViaExistingAncestor(rawPath) {
	let cursor = rawPath;
	const missingSuffix = [];
	while (true) try {
		return path.resolve(await realpathNative(cursor), ...missingSuffix);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		const parent = path.dirname(cursor);
		if (parent === cursor) throw error;
		missingSuffix.unshift(path.basename(cursor));
		cursor = parent;
	}
}
async function assertRawParentWithinRoot(params) {
	if (process.platform === "win32") return {
		rootCanonical: path.resolve(params.root),
		targetCanonical: resolveSandboxInputPath(params.filePath, params.cwd)
	};
	const expanded = expandPath(params.filePath);
	if (isWindowsDrivePath(expanded)) return {
		rootCanonical: path.resolve(params.root),
		targetCanonical: path.win32.normalize(expanded)
	};
	const rawAbsolute = path.isAbsolute(expanded) ? expanded : `${params.cwd}${path.sep}${expanded}`;
	const hasTrailingSeparator = rawAbsolute.endsWith(path.sep);
	const rawParent = hasTrailingSeparator ? rawAbsolute : path.dirname(rawAbsolute);
	const finalSegment = hasTrailingSeparator ? "." : path.basename(rawAbsolute);
	const rootResolved = path.resolve(params.root);
	const [rootCanonical, parentCanonical] = await Promise.all([resolveRawPathViaExistingAncestor(rootResolved), resolveRawPathViaExistingAncestor(rawParent)]);
	const targetCanonical = path.resolve(rawAbsolute) === rootResolved ? await resolveRawPathViaExistingAncestor(rawAbsolute) : path.resolve(parentCanonical, finalSegment);
	if (targetCanonical !== rootCanonical && !isPathInside(rootCanonical, targetCanonical)) throw new Error(`Path escapes sandbox root (${shortenHomePath(rootCanonical)}): ${params.filePath}`);
	return {
		rootCanonical,
		targetCanonical
	};
}
async function assertSandboxPath(params) {
	const resolved = resolveSandboxPath(params);
	const policy = {
		allowFinalSymlinkForUnlink: params.allowFinalSymlinkForUnlink,
		allowFinalHardlinkForUnlink: params.allowFinalHardlinkForUnlink
	};
	await assertNoPathAliasEscape({
		absolutePath: resolved.resolved,
		rootPath: params.root,
		boundaryLabel: "sandbox root",
		policy
	});
	const rawTarget = await assertRawParentWithinRoot(params);
	if (path.resolve(rawTarget.targetCanonical) !== path.resolve(resolved.resolved)) await assertNoPathAliasEscape({
		absolutePath: rawTarget.targetCanonical,
		rootPath: rawTarget.rootCanonical,
		boundaryLabel: "sandbox root",
		policy
	});
	return resolved;
}
function assertMediaNotDataUrl(media) {
	const raw = media.trim();
	if (DATA_URL_RE.test(raw)) throw new Error("data: URLs are not supported for media. Use buffer instead.");
}
function isManagedMediaPathUnderRoot(candidate) {
	const expanded = expandPath(candidate);
	if (!hostPathLooksAbsolute(expanded)) return false;
	const mediaRoot = path.join(resolveConfigDir(), "media");
	const resolvedMediaRoot = path.resolve(mediaRoot);
	const resolvedExpanded = path.resolve(expanded);
	if (resolvedExpanded === resolvedMediaRoot || !isPathInside(resolvedMediaRoot, resolvedExpanded)) return false;
	const firstSegment = path.relative(resolvedMediaRoot, resolvedExpanded).split(path.sep)[0] ?? "";
	return MANAGED_MEDIA_SUBDIRS.has(firstSegment) || firstSegment.startsWith("tool-");
}
async function resolveAllowedManagedMediaPath(candidate) {
	const expanded = expandPath(candidate);
	if (!isManagedMediaPathUnderRoot(expanded)) return;
	const resolved = path.resolve(expanded);
	await assertNoManagedMediaAliasEscape({
		filePath: resolved,
		managedMediaRoot: path.resolve(resolveConfigDir(), "media")
	});
	return resolved;
}
async function resolveSandboxedMediaSource(params) {
	const raw = params.media.trim();
	if (!raw) return raw;
	if (isPassThroughRemoteMediaSource(raw)) return raw;
	let candidate = raw;
	if (/^file:/i.test(candidate)) {
		const workspaceMappedFromUrl = mapContainerWorkspaceFileUrl({
			fileUrl: candidate,
			sandboxRoot: params.sandboxRoot
		});
		if (workspaceMappedFromUrl) candidate = workspaceMappedFromUrl;
		else try {
			candidate = safeFileURLToPath(candidate);
		} catch (err) {
			throw new Error(`Invalid file:// URL for sandboxed media: ${err.message}`, { cause: err });
		}
	}
	const containerWorkspaceMapped = mapContainerWorkspacePath({
		candidate,
		sandboxRoot: params.sandboxRoot
	});
	if (containerWorkspaceMapped) candidate = containerWorkspaceMapped;
	assertNoWindowsNetworkPath(candidate, "Sandbox media path");
	const tmpMediaPath = await resolveAllowedTmpMediaPath({
		candidate,
		sandboxRoot: params.sandboxRoot
	});
	if (tmpMediaPath) return tmpMediaPath;
	const managedMediaPath = await resolveAllowedManagedMediaPath(candidate);
	if (managedMediaPath) return managedMediaPath;
	return (await assertSandboxPath({
		filePath: candidate,
		cwd: params.sandboxRoot,
		root: params.sandboxRoot
	})).resolved;
}
async function assertNoManagedMediaAliasEscape(params) {
	await assertNoPathAliasEscape({
		absolutePath: params.filePath,
		rootPath: params.managedMediaRoot,
		boundaryLabel: "managed media root"
	});
}
function mapContainerWorkspaceFileUrl(params) {
	let parsed;
	try {
		parsed = new URL(params.fileUrl);
	} catch {
		return;
	}
	if (parsed.protocol !== "file:") return;
	const host = parsed.hostname.trim().toLowerCase();
	if (host && host !== "localhost") return;
	if (hasEncodedFileUrlSeparator(parsed.pathname)) return;
	let normalizedPathname;
	try {
		normalizedPathname = decodeURIComponent(parsed.pathname).replace(/\\/g, "/");
	} catch {
		return;
	}
	if (normalizedPathname !== SANDBOX_CONTAINER_WORKDIR && !normalizedPathname.startsWith(`${SANDBOX_CONTAINER_WORKDIR}/`)) return;
	return mapContainerWorkspacePath({
		candidate: normalizedPathname,
		sandboxRoot: params.sandboxRoot
	});
}
function mapContainerWorkspacePath(params) {
	const normalized = params.candidate.replace(/\\/g, "/");
	if (normalized === SANDBOX_CONTAINER_WORKDIR) return path.resolve(params.sandboxRoot);
	const prefix = `${SANDBOX_CONTAINER_WORKDIR}/`;
	if (!normalized.startsWith(prefix)) return;
	const rel = normalized.slice(prefix.length);
	if (!rel) return path.resolve(params.sandboxRoot);
	return path.resolve(params.sandboxRoot, ...rel.split("/").filter(Boolean));
}
async function resolveAllowedTmpMediaPath(params) {
	if (!hostPathLooksAbsolute(expandPath(params.candidate))) return;
	const resolved = path.resolve(resolveSandboxInputPath(params.candidate, params.sandboxRoot));
	const openClawTmpDir = path.resolve(resolvePreferredOpenClawTmpDir());
	if (!isPathInside(openClawTmpDir, resolved)) return;
	await assertNoTmpAliasEscape({
		filePath: resolved,
		tmpRoot: openClawTmpDir
	});
	return resolved;
}
async function assertNoTmpAliasEscape(params) {
	await assertNoPathAliasEscape({
		absolutePath: params.filePath,
		rootPath: params.tmpRoot,
		boundaryLabel: "tmp root"
	});
}
//#endregion
export { resolveSandboxPath as a, resolveSandboxInputPath as i, assertSandboxPath as n, resolveSandboxedMediaSource as o, resolveAllowedManagedMediaPath as r, assertMediaNotDataUrl as t };
