import { s as readConfigFileSnapshot } from "./io-DlN5njvP.js";
import { i as getRuntimeConfigAppliedHash, u as hashRuntimeConfigValue } from "./runtime-snapshot-Cv5MaU8U.js";
import { p as getActivePluginRegistryVersion } from "./runtime-DMlUh4Cg.js";
import "./config-B2bSneS2.js";
import { r as redactConfigSnapshot } from "./redact-snapshot-Cc1aNUFV.js";
//#region src/gateway/config-get-response.ts
let configGetResponseCache;
function createConfigGetResponse(snapshot, uiHints, revisionProjector) {
	const redacted = redactConfigSnapshot(snapshot, uiHints);
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	return {
		...redacted,
		hash: redacted.hash ? revisionProjector.projectRawHash(redacted.hash) : redacted.hash,
		configRevisionHash: revisionProjector.projectResolvedHash(hashRuntimeConfigValue(snapshot.sourceConfig)),
		appliedConfigHash: appliedConfigHash ? revisionProjector.projectResolvedHash(appliedConfigHash) : null
	};
}
/** Reads and projects config.get once per watcher-owned runtime and plugin-schema revision. */
async function readConfigGetResponse(params) {
	const getHotReloadStatus = params.getHotReloadStatus;
	if (!getHotReloadStatus || getHotReloadStatus() !== "active") return createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints(), params.revisionProjector);
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	if (configGetResponseCache?.getHotReloadStatus === getHotReloadStatus && configGetResponseCache.revisionProjector === params.revisionProjector && configGetResponseCache.appliedConfigHash === appliedConfigHash && configGetResponseCache.pluginRegistryVersion === pluginRegistryVersion) return await configGetResponseCache.promise;
	const promise = (async () => createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints(), params.revisionProjector))();
	configGetResponseCache = {
		getHotReloadStatus,
		revisionProjector: params.revisionProjector,
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
