import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { d as safeFileURLToPath } from "./read-open-flags-DGgM-BoE.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { d as resolveConfigDir } from "./utils-Bw16L5tB.js";
import { h as resolveDeliveryQueueMediaDir, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import "./local-file-access-C2hsuc07.js";
import { n as resolveEffectiveToolFsWorkspaceOnly, t as resolveEffectiveToolFsRootExpansionAllowed } from "./tool-fs-policy-DwrFWb3k.js";
import path from "node:path";
//#region src/media/local-media-path.ts
const DATA_URL_RE = /^data:/i;
const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
/** Resolves a media source to a local path when it is not a remote or data URL. */
function resolveLocalMediaPath(source) {
	const trimmed = source.trim();
	if (!trimmed || isPassThroughRemoteMediaSource(trimmed) || DATA_URL_RE.test(trimmed)) return;
	if (/^file:/iu.test(trimmed)) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	if (path.isAbsolute(trimmed) || WINDOWS_DRIVE_RE.test(trimmed)) return path.resolve(trimmed);
}
//#endregion
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
function resolveCachedPreferredTmpDir() {
	if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
	return cachedPreferredTmpDir;
}
/** Builds the baseline local media root allowlist from state/config directories. */
function buildMediaLocalRoots(stateDir, configDir, options = {}) {
	const resolvedStateDir = path.resolve(stateDir);
	const resolvedConfigDir = path.resolve(configDir);
	const preferredTmpDir = options.preferredTmpDir ?? resolveCachedPreferredTmpDir();
	return Array.from(/* @__PURE__ */ new Set([
		preferredTmpDir,
		path.join(resolvedConfigDir, "media"),
		path.join(resolvedStateDir, "media"),
		resolveDeliveryQueueMediaDir(resolvedStateDir),
		path.join(resolvedStateDir, "canvas"),
		path.join(resolvedStateDir, "workspace"),
		path.join(resolvedStateDir, "sandboxes")
	]));
}
/** Returns the process default roots where local media reads may resolve generated/cache files. */
function getDefaultMediaLocalRoots() {
	return buildMediaLocalRoots(resolveStateDir(), resolveConfigDir());
}
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
function getAgentScopedMediaLocalRoots(cfg, agentId) {
	const roots = buildMediaLocalRoots(resolveStateDir(), resolveConfigDir());
	const normalizedAgentId = normalizeOptionalString(agentId);
	if (!normalizedAgentId) return roots;
	const workspaceDir = resolveAgentWorkspaceDir(cfg, normalizedAgentId);
	if (!workspaceDir) return roots;
	const normalizedWorkspaceDir = path.resolve(workspaceDir);
	if (!roots.includes(normalizedWorkspaceDir)) roots.push(normalizedWorkspaceDir);
	return roots;
}
/** Adds only concrete local source parent directories to an existing root allowlist. */
function appendLocalMediaParentRoots(roots, mediaSources) {
	const appended = uniqueStrings(roots.map((root) => path.resolve(root)));
	for (const source of mediaSources ?? []) {
		const localPath = resolveLocalMediaPath(source);
		if (!localPath) continue;
		const parentDir = path.dirname(localPath);
		if (parentDir === path.parse(parentDir).root) continue;
		const normalizedParent = path.resolve(parentDir);
		if (!appended.includes(normalizedParent)) appended.push(normalizedParent);
	}
	return appended;
}
/** Resolves outbound media roots, expanding for local sources only when filesystem policy allows it. */
function getAgentScopedMediaLocalRootsForSources(params) {
	const roots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId);
	if (resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.cfg,
		agentId: params.agentId
	})) return roots;
	if (!resolveEffectiveToolFsRootExpansionAllowed({
		cfg: params.cfg,
		agentId: params.agentId
	})) return roots;
	return appendLocalMediaParentRoots(roots, params.mediaSources);
}
//#endregion
export { resolveLocalMediaPath as a, getDefaultMediaLocalRoots as i, getAgentScopedMediaLocalRoots as n, getAgentScopedMediaLocalRootsForSources as r, appendLocalMediaParentRoots as t };
