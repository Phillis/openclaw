import { a as isPathInside, i as isNotFoundPathError } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/server-methods/workspace-path-containment.ts
async function resolveRequestedRealPath(requestedPath, allowMissing) {
	try {
		return await fs.realpath(requestedPath);
	} catch (error) {
		if (!allowMissing || !isNotFoundPathError(error)) return null;
	}
	let ancestor = path.dirname(requestedPath);
	for (;;) {
		try {
			const ancestorRealPath = await fs.realpath(ancestor);
			return path.resolve(ancestorRealPath, path.relative(ancestor, requestedPath));
		} catch (error) {
			if (!isNotFoundPathError(error)) return null;
		}
		const parent = path.dirname(ancestor);
		if (parent === ancestor) return null;
		ancestor = parent;
	}
}
/** Resolves a Gateway path against the real roots of configured agent workspaces. */
async function resolveWorkspacePathContainment(requestedPath, cfg, options = {}) {
	const workspaceRoots = await Promise.all(listAgentIds(cfg).map(async (agentId) => {
		try {
			return await fs.realpath(resolveAgentWorkspaceDir(cfg, agentId));
		} catch {
			return null;
		}
	}));
	if (requestedPath === void 0) {
		const firstWorkspaceRoot = workspaceRoots[0];
		return firstWorkspaceRoot ? {
			path: firstWorkspaceRoot,
			workspaceRoot: firstWorkspaceRoot
		} : null;
	}
	const existingRoots = workspaceRoots.filter((root) => root !== null);
	if (!path.isAbsolute(requestedPath)) return null;
	const requestedRealPath = await resolveRequestedRealPath(path.resolve(requestedPath), options.allowMissing === true);
	if (!requestedRealPath) return null;
	const workspaceRoot = existingRoots.filter((root) => isPathInside(root, requestedRealPath)).toSorted((left, right) => right.length - left.length)[0];
	return workspaceRoot ? {
		path: requestedRealPath,
		workspaceRoot
	} : null;
}
//#endregion
export { resolveWorkspacePathContainment as t };
