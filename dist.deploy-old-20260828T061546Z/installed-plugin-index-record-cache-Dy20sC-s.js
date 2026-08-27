//#region src/plugins/installed-plugin-index-record-cache.ts
const installRecordsCache = /* @__PURE__ */ new Map();
let installRecordsCacheGeneration = 0;
/** Returns cached installed plugin records for a store/recovery key. */
function getInstalledPluginIndexInstallRecordsCache(key) {
	return installRecordsCache.get(key);
}
/** Stores cached installed plugin records for a store/recovery key. */
function setInstalledPluginIndexInstallRecordsCache(key, entry) {
	installRecordsCache.set(key, entry);
}
/** Current cache generation used to detect concurrent clears during async loads. */
function getInstalledPluginIndexInstallRecordsCacheGeneration() {
	return installRecordsCacheGeneration;
}
/** Clears cached installed plugin records and advances the cache generation. */
function clearLoadInstalledPluginIndexInstallRecordsCache() {
	installRecordsCacheGeneration += 1;
	installRecordsCache.clear();
}
//#endregion
export { setInstalledPluginIndexInstallRecordsCache as i, getInstalledPluginIndexInstallRecordsCache as n, getInstalledPluginIndexInstallRecordsCacheGeneration as r, clearLoadInstalledPluginIndexInstallRecordsCache as t };
