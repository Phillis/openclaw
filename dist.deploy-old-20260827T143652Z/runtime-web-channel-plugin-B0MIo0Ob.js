import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { c as isJavaScriptModulePath, l as tryNativeRequireJavaScriptModule, r as getCachedPluginSourceModuleLoader, t as createPluginModuleLoaderCache } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-Q7fHcAUz.js";
import "./config-Dl8DJbzM.js";
import "./web-media-Dk8VJTPc.js";
import { r as getDefaultLocalRootsCore } from "./local-media-access-x5uqWCfl.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/runtime/runtime-plugin-boundary.ts
function readPluginBoundaryConfigSafely() {
	try {
		return getRuntimeConfig();
	} catch {
		return {};
	}
}
function resolvePluginRuntimeRecordByEntryBaseNames(entryBaseNames, onMissing) {
	const matches = loadPluginManifestRegistryCore({ config: readPluginBoundaryConfigSafely() }).plugins.filter((plugin) => {
		if (!plugin?.source) return false;
		const record = {
			rootDir: plugin.rootDir,
			source: plugin.source
		};
		return entryBaseNames.every((entryBaseName) => resolvePluginRuntimeModulePath(record, entryBaseName) !== null);
	});
	if (matches.length === 0) {
		if (onMissing) onMissing();
		return null;
	}
	if (matches.length > 1) {
		const pluginIds = matches.map((plugin) => plugin.id).join(", ");
		throw new Error(`plugin runtime boundary is ambiguous for entries [${entryBaseNames.join(", ")}]: ${pluginIds}`);
	}
	const record = expectDefined(matches[0], "matches capture group 0");
	return {
		...record.origin ? { origin: record.origin } : {},
		rootDir: record.rootDir,
		source: record.source
	};
}
function resolvePluginRuntimeModulePath(record, entryBaseName, onMissing) {
	const candidates = [
		path.join(path.dirname(record.source), `${entryBaseName}.js`),
		path.join(path.dirname(record.source), `${entryBaseName}.ts`),
		...record.rootDir ? [path.join(record.rootDir, `${entryBaseName}.js`), path.join(record.rootDir, `${entryBaseName}.ts`)] : []
	];
	for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
	if (onMissing) onMissing();
	return null;
}
function getPluginBoundarySourceLoader(modulePath, loaders) {
	return getCachedPluginSourceModuleLoader({
		cache: loaders,
		modulePath,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url
	});
}
function loadPluginBoundaryModule(modulePath, loaders, options = {}) {
	if (isJavaScriptModulePath(modulePath)) {
		const native = tryNativeRequireJavaScriptModule(modulePath, {
			allowWindows: true,
			fallbackOnNativeError: options.origin !== "bundled"
		});
		if (native.ok) return native.moduleExport;
		if (options.origin === "bundled") throw new Error(`bundled plugin runtime module must load natively: ${modulePath}`);
	} else if (options.origin === "bundled") throw new Error(`bundled plugin runtime module must be built JavaScript: ${modulePath}`);
	return getPluginBoundarySourceLoader(modulePath, loaders)(modulePath);
}
//#endregion
//#region src/plugins/runtime/runtime-web-channel-plugin.ts
const webChannelRuntimeModuleCache = /* @__PURE__ */ new Map();
const moduleLoaders = createPluginModuleLoaderCache();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	webChannelRuntimeModuleCache.clear();
	moduleLoaders.clear();
});
/** Resolves the active web-channel plugin record that provides runtime APIs. */
function resolveWebChannelPluginRecord() {
	return resolvePluginRuntimeRecordByEntryBaseNames(["light-runtime-api", "runtime-api"], () => {
		throw new Error("web channel plugin runtime is unavailable: missing plugin that provides light-runtime-api and runtime-api");
	});
}
function resolveWebChannelRuntimeModulePath(record, entryBaseName) {
	const modulePath = resolvePluginRuntimeModulePath(record, entryBaseName, () => {
		throw new Error(`web channel plugin runtime is unavailable: missing ${entryBaseName}`);
	});
	if (!modulePath) throw new Error(`web channel plugin runtime is unavailable: missing ${entryBaseName}`);
	return modulePath;
}
function getCachedWebChannelRuntimeModule(kind, load) {
	const cached = webChannelRuntimeModuleCache.get(kind);
	if (cached) return cached.module;
	const loaded = load();
	webChannelRuntimeModuleCache.set(kind, { module: loaded });
	return loaded;
}
function loadWebChannelLightModule() {
	return getCachedWebChannelRuntimeModule("light", () => {
		const record = resolveWebChannelPluginRecord();
		return loadPluginBoundaryModule(resolveWebChannelRuntimeModulePath(record, "light-runtime-api"), moduleLoaders, { origin: record.origin });
	});
}
function loadWebChannelHeavyModuleSync() {
	return getCachedWebChannelRuntimeModule("heavy", () => {
		const record = resolveWebChannelPluginRecord();
		return loadPluginBoundaryModule(resolveWebChannelRuntimeModulePath(record, "runtime-api"), moduleLoaders, { origin: record.origin });
	});
}
async function loadWebChannelHeavyModule() {
	return loadWebChannelHeavyModuleSync();
}
function getLightExport(exportName) {
	const value = loadWebChannelLightModule()[exportName];
	if (value == null) throw new Error(`web channel plugin runtime is missing export '${exportName}'`);
	return value;
}
async function getHeavyExport(exportName) {
	const value = (await loadWebChannelHeavyModule())[exportName];
	if (value == null) throw new Error(`web channel plugin runtime is missing export '${exportName}'`);
	return value;
}
/** Returns the active web channel listener from the light runtime API. */
function getActiveWebListener(...args) {
	return getLightExport("getActiveWebListener")(...args);
}
/** Returns web-auth age from the light runtime API. */
function getWebAuthAgeMs(...args) {
	return getLightExport("getWebAuthAgeMs")(...args);
}
/** Logs the active web account self id through the light runtime API. */
function logWebSelfId(...args) {
	return getLightExport("logWebSelfId")(...args);
}
/** Starts web-channel login through the heavy runtime API. */
function loginWeb(...args) {
	return loadWebChannelHeavyModule().then((loaded) => loaded.loginWeb(...args));
}
/** Logs out the web-channel account through the light runtime API. */
function logoutWeb(...args) {
	return getLightExport("logoutWeb")(...args);
}
/** Reads the web-channel self id through the light runtime API. */
function readWebSelfId(...args) {
	return getLightExport("readWebSelfId")(...args);
}
/** Checks whether web-channel auth exists through the light runtime API. */
function webAuthExists(...args) {
	return getLightExport("webAuthExists")(...args);
}
/** Reads a web-channel status code from the light runtime API. */
function getStatusCode(...args) {
	return getLightExport("getStatusCode")(...args);
}
/** Picks the active web channel through the light runtime API. */
function pickWebChannel(...args) {
	return getLightExport("pickWebChannel")(...args);
}
/** Resolves the default web-channel auth directory from the light runtime API. */
function resolveWebChannelAuthDir() {
	const loaded = loadWebChannelLightModule();
	if (loaded.resolveDefaultWebAuthDir) return loaded.resolveDefaultWebAuthDir();
	if (typeof loaded.WA_WEB_AUTH_DIR === "string") return loaded.WA_WEB_AUTH_DIR;
	throw new Error("web channel plugin runtime is missing export 'resolveDefaultWebAuthDir'");
}
/** Starts web-channel monitoring through the heavy runtime API. */
function monitorWebChannel(...args) {
	return loadWebChannelHeavyModule().then((loaded) => loaded.monitorWebChannel(...args));
}
/** Starts web inbox monitoring through the heavy runtime API. */
async function monitorWebInbox(...args) {
	return (await getHeavyExport("monitorWebInbox"))(...args);
}
/** Starts QR login through the heavy runtime API. */
async function startWebLoginWithQr(...args) {
	return (await getHeavyExport("startWebLoginWithQr"))(...args);
}
/** Waits for web-channel login through the heavy runtime API. */
async function waitForWebLogin(...args) {
	return (await getHeavyExport("waitForWebLogin"))(...args);
}
/** Extracts text through the heavy runtime API. */
const extractText = (...args) => loadWebChannelHeavyModuleSync().extractText(...args);
/** Returns default local media roots through the core media helper. */
function getDefaultLocalRoots(...args) {
	return getDefaultLocalRootsCore(...args);
}
//#endregion
export { extractText, getActiveWebListener, getDefaultLocalRoots, getStatusCode, getWebAuthAgeMs, logWebSelfId, loginWeb, logoutWeb, monitorWebChannel, monitorWebInbox, pickWebChannel, readWebSelfId, resolveWebChannelAuthDir, startWebLoginWithQr, waitForWebLogin, webAuthExists };
