import { i as openRootFileSync } from "./root-file-B4L4VJ7-.js";
import { t as describeRootFileOpenFailure } from "./boundary-file-read-h_n3tTfV.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { c as isJavaScriptModulePath, r as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-DNYw5tMM.js";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
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
const SOURCE_MODULE_RESOLUTION_EXTENSIONS = [
	".ts",
	".tsx",
	".mts",
	".cts"
];
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
function resolveSourceModuleCandidates(rootDir, specifier) {
	const normalizedSpecifier = specifier.replace(/\\/g, "/");
	const resolvedPath = path.resolve(rootDir, normalizedSpecifier);
	if (path.extname(resolvedPath)) return [];
	return SOURCE_MODULE_RESOLUTION_EXTENSIONS.map((extension) => `${resolvedPath}${extension}`);
}
/**
* Resolves a plugin-relative module specifier to an existing candidate path.
*/
function resolveExistingPluginModulePath(rootDir, specifier) {
	const resolvedPath = path.resolve(rootDir, specifier.replace(/\\/g, "/"));
	try {
		return nodeRequire.resolve(resolvedPath);
	} catch (error) {
		if (!hasErrnoCode(error, "MODULE_NOT_FOUND")) throw error;
	}
	for (const candidate of resolveSourceModuleCandidates(rootDir, specifier)) if (fs.existsSync(candidate)) return candidate;
	return resolvedPath;
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
export { resolveExistingPluginModulePath as n, loadChannelPluginModule as t };
