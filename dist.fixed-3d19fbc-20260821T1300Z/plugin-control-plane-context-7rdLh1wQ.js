import { t as resolvePluginCacheInputs } from "./roots-CjvZvHHv.js";
import { m as hashJson, p as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-uuE4SyLf.js";
import { n as resolveInstalledManifestRegistryIndexFingerprint } from "./manifest-registry-installed-DozKX1OI.js";
//#region src/plugins/plugin-control-plane-context.ts
function resolveConfiguredPluginLoadPaths(config) {
	const paths = config?.plugins?.load?.paths;
	return Array.isArray(paths) ? paths : void 0;
}
/** Resolves plugin discovery roots and load paths for cache/fingerprint callers. */
function resolvePluginDiscoveryContext(params = {}) {
	return resolvePluginCacheInputs({
		env: params.env ?? process.env,
		workspaceDir: params.workspaceDir,
		loadPaths: [...params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config) ?? []]
	});
}
/** Hashes an already resolved plugin discovery context. */
function fingerprintPluginDiscoveryContext(context) {
	return hashJson(context);
}
/** Resolves all inputs that determine plugin control-plane activation state. */
function resolvePluginControlPlaneContext(params = {}) {
	const inventoryFingerprint = params.inventoryFingerprint ?? (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0);
	return {
		discovery: resolvePluginDiscoveryContext(params),
		policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config),
		...inventoryFingerprint ? { inventoryFingerprint } : {},
		...params.activationFingerprint ? { activationFingerprint: params.activationFingerprint } : {}
	};
}
/** Resolves a stable fingerprint for plugin control-plane activation state. */
function resolvePluginControlPlaneFingerprint(params = {}) {
	return fingerprintPluginControlPlaneContext(resolvePluginControlPlaneContext(params));
}
function fingerprintPluginControlPlaneContext(context) {
	return hashJson(context);
}
//#endregion
export { resolvePluginControlPlaneFingerprint as n, resolvePluginDiscoveryContext as r, fingerprintPluginDiscoveryContext as t };
