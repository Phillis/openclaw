import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-BbEZKGTS.js";
import { r as resolveDefaultPluginExtensionsDir } from "./install-paths-Bp_9OgEZ.js";
import path from "node:path";
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
	const env = params.env ?? process.env;
	const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
	return {
		stock: resolveBundledPluginsDir(env),
		global: resolveDefaultPluginExtensionsDir(env),
		workspace: workspaceRoot ? path.join(workspaceRoot, ".openclaw", "extensions") : void 0
	};
}
function resolvePluginCacheInputs(params) {
	const env = params.env ?? process.env;
	return {
		roots: resolvePluginSourceRoots({
			workspaceDir: params.workspaceDir,
			env
		}),
		loadPaths: normalizeStringEntries((params.loadPaths ?? []).filter((entry) => typeof entry === "string")).map((entry) => resolveUserPath(entry, env))
	};
}
//#endregion
export { resolvePluginSourceRoots as n, resolvePluginCacheInputs as t };
