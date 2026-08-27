import { l as readConfigFileSnapshot } from "./io-D1h6pxaD.js";
import { p as getActivePluginRegistryVersion } from "./runtime-CTbL314X.js";
import { i as getRuntimeConfigAppliedHash, u as hashRuntimeConfigValue } from "./runtime-snapshot-Dp7mvsA3.js";
import "./config-CW-q_d35.js";
import { r as redactConfigSnapshot } from "./redact-snapshot-DuN7qyYL.js";
//#region src/gateway/config-get-response.ts
let configGetResponseCache;
function createConfigGetResponse(snapshot, uiHints) {
	return {
		...redactConfigSnapshot(snapshot, uiHints),
		configRevisionHash: hashRuntimeConfigValue(snapshot.sourceConfig),
		appliedConfigHash: getRuntimeConfigAppliedHash()
	};
}
/** Reads and projects config.get once per watcher-owned runtime and plugin-schema revision. */
async function readConfigGetResponse(params) {
	const getHotReloadStatus = params.getHotReloadStatus;
	if (!getHotReloadStatus || getHotReloadStatus() !== "active") return createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints());
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	if (configGetResponseCache?.getHotReloadStatus === getHotReloadStatus && configGetResponseCache.appliedConfigHash === appliedConfigHash && configGetResponseCache.pluginRegistryVersion === pluginRegistryVersion) return await configGetResponseCache.promise;
	const promise = (async () => createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints()))();
	configGetResponseCache = {
		getHotReloadStatus,
		appliedConfigHash,
		pluginRegistryVersion,
		promise
	};
	try {
		return await promise;
	} catch (error) {
		if (configGetResponseCache?.promise === promise) configGetResponseCache = void 0;
		throw error;
	}
}
/** Invalidates cached config.get work after the watcher accepts a config candidate. */
function invalidateConfigGetResponseCache() {
	configGetResponseCache = void 0;
}
//#endregion
export { readConfigGetResponse as n, invalidateConfigGetResponseCache as t };
