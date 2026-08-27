import { i as openRootFileSync } from "./root-file-CdmcBz8_.js";
import { t as describeRootFileOpenFailure } from "./boundary-file-read-Dy4MeTWa.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-BbEZKGTS.js";
import { c as isJavaScriptModulePath, n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-O65paH_z.js";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/channels/plugins/bundled-root.ts
/**
* Bundled channel package-root resolver.
*
* Computes cache scopes for generated channel metadata across source and packaged layouts.
*/
const OPENCLAW_PACKAGE_ROOT = resolveOpenClawPackageRootSync({
	argv1: process.argv[1],
	cwd: process.cwd(),
	moduleUrl: import.meta.url.startsWith("file:") ? import.meta.url : void 0
}) ?? (import.meta.url.startsWith("file:") ? path.resolve(fileURLToPath(new URL("../../..", import.meta.url))) : process.cwd());
function derivePackageRootFromExtensionsDir(extensionsDir) {
	const parentDir = path.dirname(extensionsDir);
	const parentBase = path.basename(parentDir);
	if (parentBase === "dist" || parentBase === "dist-runtime") return path.dirname(parentDir);
	return parentDir;
}
/**
* Resolves the package/cache scope used for bundled channel plugin metadata.
*/
function resolveBundledChannelRootScope(env = process.env) {
	const bundledPluginsDir = resolveBundledPluginsDir(env);
	if (!bundledPluginsDir) return {
		packageRoot: OPENCLAW_PACKAGE_ROOT,
		cacheKey: OPENCLAW_PACKAGE_ROOT
	};
	const resolvedPluginsDir = path.resolve(bundledPluginsDir);
	return {
		packageRoot: path.basename(resolvedPluginsDir) === "extensions" ? derivePackageRootFromExtensionsDir(resolvedPluginsDir) : resolvedPluginsDir,
		cacheKey: resolvedPluginsDir,
		pluginsDir: resolvedPluginsDir
	};
}
//#endregion
//#region src/channels/plugins/module-loader.ts
/**
* Channel plugin module loader.
*
* Loads JavaScript or source plugin modules through native require or cached TS loaders.
*/
const nodeRequire = createRequire(import.meta.url);
const SOURCE_MODULE_EXTENSIONS = /* @__PURE__ */ new Set([
	".ts",
	".tsx",
	".mts",
	".cts"
]);
const jitiLoaders = /* @__PURE__ */ new Map();
function hasNativeSourceRequireHook(modulePath) {
	const extension = path.extname(modulePath).toLowerCase();
	return SOURCE_MODULE_EXTENSIONS.has(extension) && typeof nodeRequire.extensions?.[extension] === "function";
}
function isSourceModulePath(modulePath) {
	return SOURCE_MODULE_EXTENSIONS.has(path.extname(modulePath).toLowerCase());
}
function loadModuleWithJiti(modulePath) {
	return getCachedPluginModuleLoader({
		cache: jitiLoaders,
		modulePath,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url,
		tryNative: false,
		cacheScopeKey: "channel-plugin-module-loader"
	})(modulePath);
}
function loadModule(modulePath) {
	if (!isJavaScriptModulePath(modulePath) && !hasNativeSourceRequireHook(modulePath)) {
		if (isSourceModulePath(modulePath)) return loadModuleWithJiti(modulePath);
		throw new Error(`channel plugin module must be built JavaScript: ${modulePath}`);
	}
	try {
		return nodeRequire(modulePath);
	} catch (error) {
		if (isSourceModulePath(modulePath)) return loadModuleWithJiti(modulePath);
		throw new Error(`failed to load channel plugin module with native require: ${modulePath}`, { cause: error });
	}
}
function resolvePluginModuleCandidates(rootDir, specifier) {
	const normalizedSpecifier = specifier.replace(/\\/g, "/");
	const resolvedPath = path.resolve(rootDir, normalizedSpecifier);
	if (path.extname(resolvedPath)) return [resolvedPath];
	return [
		resolvedPath,
		`${resolvedPath}.ts`,
		`${resolvedPath}.mts`,
		`${resolvedPath}.js`,
		`${resolvedPath}.mjs`,
		`${resolvedPath}.cts`,
		`${resolvedPath}.cjs`
	];
}
/**
* Resolves a plugin-relative module specifier to an existing candidate path.
*/
function resolveExistingPluginModulePath(rootDir, specifier) {
	for (const candidate of resolvePluginModuleCandidates(rootDir, specifier)) if (fs.existsSync(candidate)) return candidate;
	return path.resolve(rootDir, specifier);
}
/**
* Loads a channel plugin module after enforcing plugin-root file boundaries.
*
* `rootDir` is always the plugin's own directory, so the containment failure is
* reported against that one root; no caller boundary override exists.
*/
function loadChannelPluginModule(params) {
	const boundaryLabel = "plugin root";
	const opened = openRootFileSync({
		absolutePath: params.modulePath,
		rootPath: params.rootDir,
		boundaryLabel,
		rejectHardlinks: false,
		skipLexicalRootCheck: true
	});
	if (!opened.ok) throw new Error(describeRootFileOpenFailure({
		failure: opened,
		subject: "plugin module path",
		boundaryLabel,
		filePath: params.modulePath
	}), { cause: opened.error });
	const safePath = opened.path;
	fs.closeSync(opened.fd);
	return loadModule(safePath);
}
//#endregion
export { resolveExistingPluginModulePath as n, resolveBundledChannelRootScope as r, loadChannelPluginModule as t };
