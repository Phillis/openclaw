import { i as openRootFileSync } from "./root-file-Chr9dJBe.js";
import "./boundary-file-read-BoOq_oud.js";
import { r as resolveBundledPluginsDir, t as areBundledPluginsDisabled } from "./bundled-dir-CvTl0ZdS.js";
import { i as resolveBundledPluginSourcePublicSurfacePath, n as normalizeBundledPluginArtifactSubpath, r as resolveBundledPluginPublicSurfacePath, t as PUBLIC_SURFACE_SOURCE_EXTENSIONS } from "./public-surface-runtime-CvzvnEAJ.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { a as resolveLoaderPackageRoot } from "./sdk-alias-BF1YflQg.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-B91t3pWa.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/plugin-sdk/facade-resolution-shared.ts
/**
* Shared resolver for bundled plugin facade module paths and registry fallbacks.
*/
/** Builds the cache key for one facade lookup under the current bundled-plugin mode. */
function createFacadeResolutionKey(params) {
	const disabledKey = areBundledPluginsDisabled(params.env ?? process.env) ? "disabled" : "enabled";
	return `${params.dirName}::${params.artifactBasename}::${params.bundledPluginsDir ? path.resolve(params.bundledPluginsDir) : "<default>"}::${disabledKey}`;
}
/** Chooses the boundary root that should constrain a resolved facade module. */
function resolveFacadeBoundaryRoot(params) {
	if (!params.bundledPluginsDir) return params.packageRoot;
	const resolvedBundledPluginsDir = path.resolve(params.bundledPluginsDir);
	return params.modulePath.startsWith(`${resolvedBundledPluginsDir}${path.sep}`) ? resolvedBundledPluginsDir : params.packageRoot;
}
/** Resolves a bundled facade from source in dev and built artifacts in dist installs. */
function resolveBundledFacadeModuleLocation(params) {
	const env = params.env ?? process.env;
	if (areBundledPluginsDisabled(env)) return null;
	const preferSource = !params.currentModulePath.includes(`${path.sep}dist${path.sep}`);
	const packageSourceRoot = path.resolve(params.packageRoot, "extensions");
	const publicSurfaceParams = {
		rootDir: params.packageRoot,
		env: params.env,
		...params.bundledPluginsDir ? { bundledPluginsDir: params.bundledPluginsDir } : {},
		dirName: params.dirName,
		artifactBasename: params.artifactBasename
	};
	const modulePath = preferSource ? resolveBundledPluginSourcePublicSurfacePath({
		dirName: params.dirName,
		artifactBasename: params.artifactBasename,
		sourceRoot: params.bundledPluginsDir ?? packageSourceRoot
	}) ?? (params.bundledPluginsDir && !areBundledPluginsDisabled(env) ? resolveBundledPluginSourcePublicSurfacePath({
		dirName: params.dirName,
		artifactBasename: params.artifactBasename,
		sourceRoot: packageSourceRoot
	}) : null) ?? resolveBundledPluginPublicSurfacePath(publicSurfaceParams) : resolveBundledPluginPublicSurfacePath(publicSurfaceParams);
	return modulePath ? {
		modulePath,
		boundaryRoot: resolveFacadeBoundaryRoot({
			modulePath,
			bundledPluginsDir: params.bundledPluginsDir,
			packageRoot: params.packageRoot
		})
	} : null;
}
/** Resolves a facade path from manifest registry records using id, folder, then channel matches. */
function resolveRegistryPluginModuleLocationFromRecords(params) {
	const tiers = [
		(plugin) => plugin.id === params.dirName,
		(plugin) => path.basename(plugin.rootDir) === params.dirName,
		(plugin) => plugin.channels.includes(params.dirName)
	];
	const artifactBasename = normalizeBundledPluginArtifactSubpath(params.artifactBasename);
	const sourceBaseName = artifactBasename.replace(/\.js$/u, "");
	for (const matchFn of tiers) for (const record of params.registry.filter(matchFn)) {
		const rootDir = path.resolve(record.rootDir);
		for (const builtCandidate of [path.join(rootDir, artifactBasename), path.join(rootDir, "dist", artifactBasename)]) if (fs.existsSync(builtCandidate)) return {
			modulePath: builtCandidate,
			boundaryRoot: rootDir
		};
		for (const ext of PUBLIC_SURFACE_SOURCE_EXTENSIONS) {
			const sourceCandidate = path.join(rootDir, `${sourceBaseName}${ext}`);
			if (fs.existsSync(sourceCandidate)) return {
				modulePath: sourceCandidate,
				boundaryRoot: rootDir
			};
		}
	}
	return null;
}
//#endregion
//#region src/plugin-sdk/facade-loader.ts
/** Error thrown when a bundled plugin public surface artifact cannot be resolved. */
var MissingPublicSurfaceError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "MissingPublicSurfaceError";
	}
};
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const moduleLoaders = /* @__PURE__ */ new Map();
const loadedFacadeModules = /* @__PURE__ */ new Map();
const loadedFacadePluginIds = /* @__PURE__ */ new Set();
let cachedOpenClawPackageRoot;
function getOpenClawPackageRoot() {
	if (cachedOpenClawPackageRoot) return cachedOpenClawPackageRoot;
	cachedOpenClawPackageRoot = resolveLoaderPackageRoot({
		modulePath: fileURLToPath(import.meta.url),
		moduleUrl: import.meta.url
	}) ?? fileURLToPath(new URL("../..", import.meta.url));
	return cachedOpenClawPackageRoot;
}
function resolveFacadeModuleLocation(params) {
	const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
	return resolveBundledFacadeModuleLocation({
		...params,
		currentModulePath: CURRENT_MODULE_PATH,
		packageRoot: getOpenClawPackageRoot(),
		bundledPluginsDir
	});
}
function getModuleLoader(modulePath) {
	return getCachedPluginModuleLoader({
		cache: moduleLoaders,
		modulePath,
		importerUrl: import.meta.url,
		preferBuiltDist: true,
		loaderFilename: import.meta.url
	});
}
function createLazyFacadeValueLoader(load) {
	let loaded = false;
	let value;
	return () => {
		if (!loaded) {
			value = load();
			loaded = true;
		}
		return value;
	};
}
function createLazyFacadeProxyValue(params) {
	const resolve = createLazyFacadeValueLoader(params.load);
	return new Proxy(params.target, {
		defineProperty(_target, property, descriptor) {
			return Reflect.defineProperty(resolve(), property, descriptor);
		},
		deleteProperty(_target, property) {
			return Reflect.deleteProperty(resolve(), property);
		},
		get(_target, property, receiver) {
			return Reflect.get(resolve(), property, receiver);
		},
		getOwnPropertyDescriptor(_target, property) {
			return Reflect.getOwnPropertyDescriptor(resolve(), property);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(resolve());
		},
		has(_target, property) {
			return Reflect.has(resolve(), property);
		},
		isExtensible() {
			return Reflect.isExtensible(resolve());
		},
		ownKeys() {
			return Reflect.ownKeys(resolve());
		},
		preventExtensions() {
			return Reflect.preventExtensions(resolve());
		},
		set(_target, property, value, receiver) {
			return Reflect.set(resolve(), property, value, receiver);
		},
		setPrototypeOf(_target, prototype) {
			return Reflect.setPrototypeOf(resolve(), prototype);
		}
	});
}
/** Create an object proxy that loads the underlying facade only on first property access. */
function createLazyFacadeObjectValue(load) {
	return createLazyFacadeProxyValue({
		load,
		target: {}
	});
}
function isPathAtOrInside(target, root) {
	const resolvedRoot = path.resolve(root);
	const resolvedTarget = path.resolve(target);
	return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}
function resolveFacadeBoundaryOpenParams(boundaryRoot) {
	if (isPathAtOrInside(boundaryRoot, getOpenClawPackageRoot())) return {
		boundaryLabel: "OpenClaw package root",
		rejectHardlinks: false
	};
	const bundledDir = resolveBundledPluginsDir();
	if (bundledDir && isPathAtOrInside(boundaryRoot, bundledDir)) return {
		boundaryLabel: "bundled plugin directory",
		rejectHardlinks: false
	};
	return {
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: "global",
			rootDir: boundaryRoot
		})
	};
}
/** Load and cache a facade module after verifying it is inside its declared boundary root. */
function loadFacadeModuleAtLocationSync(params) {
	const location = params.location;
	const cached = loadedFacadeModules.get(location.modulePath);
	if (cached) return cached;
	const opened = openRootFileSync({
		absolutePath: location.modulePath,
		rootPath: location.boundaryRoot,
		...resolveFacadeBoundaryOpenParams(location.boundaryRoot)
	});
	if (!opened.ok) throw new Error(`Unable to open bundled plugin public surface ${location.modulePath}`, { cause: opened.error });
	fs.closeSync(opened.fd);
	const sentinel = {};
	loadedFacadeModules.set(location.modulePath, sentinel);
	let loaded;
	try {
		loaded = params.loadModule?.(location.modulePath) ?? getModuleLoader(location.modulePath)(location.modulePath);
		Object.assign(sentinel, loaded);
		loadedFacadePluginIds.add(typeof params.trackedPluginId === "function" ? params.trackedPluginId() : params.trackedPluginId);
	} catch (err) {
		loadedFacadeModules.delete(location.modulePath);
		throw err;
	}
	return sentinel;
}
/** Resolve and synchronously load a bundled plugin public surface by plugin dir and artifact name. */
function loadBundledPluginPublicSurfaceModuleSyncCore(params) {
	const location = resolveFacadeModuleLocation(params);
	if (!location) throw new MissingPublicSurfaceError(`Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`);
	return loadFacadeModuleAtLocationSync({
		location,
		trackedPluginId: params.trackedPluginId ?? params.dirName
	});
}
/** List plugin ids whose public facades have been loaded in this process. */
function listImportedBundledPluginFacadeIds() {
	return [...loadedFacadePluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { loadFacadeModuleAtLocationSync as a, resolveRegistryPluginModuleLocationFromRecords as c, loadBundledPluginPublicSurfaceModuleSyncCore as i, createLazyFacadeObjectValue as n, createFacadeResolutionKey as o, listImportedBundledPluginFacadeIds as r, resolveBundledFacadeModuleLocation as s, MissingPublicSurfaceError as t };
