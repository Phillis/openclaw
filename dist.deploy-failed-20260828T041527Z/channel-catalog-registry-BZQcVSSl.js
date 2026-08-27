import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as discoverOpenClawPlugins } from "./discovery-KmR2BWJK.js";
import { y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { s as resolveCompatibilityHostVersion } from "./version-CkBmshxX.js";
import { s as loadInstalledPluginIndexInstallRecordsSync } from "./manifest-registry-DqYRJvWI.js";
import { r as resolvePluginDiscoveryContext } from "./plugin-control-plane-context-DGIHVL5k.js";
//#region src/plugins/channel-catalog-registry.ts
const defaultInstallRecordsIdentity = Symbol("default-install-records");
const noInstallRecordsIdentity = Symbol("no-install-records");
let channelCatalogDiscoveryMemo;
function clearChannelCatalogDiscoveryMemo() {
	channelCatalogDiscoveryMemo = void 0;
}
registerPluginMetadataProcessMemoLifecycleClear(clearChannelCatalogDiscoveryMemo);
function listChannelCatalogEntries(params = {}) {
	if (params.discovery) resolveInstallRecords(params);
	return (params.discovery ?? resolveMemoizedChannelCatalogDiscovery(params)).candidates.flatMap((candidate) => {
		if (params.origin && candidate.origin !== params.origin) return [];
		const channel = candidate.packageManifest?.channel;
		if (!channel?.id) return [];
		const pluginId = resolveChannelCatalogPluginId(candidate);
		if (!pluginId) return [];
		return [{
			pluginId,
			origin: candidate.origin,
			packageName: candidate.packageName,
			workspaceDir: candidate.workspaceDir,
			rootDir: candidate.rootDir,
			channel,
			...candidate.packageManifest?.install ? { install: candidate.packageManifest.install } : {}
		}];
	});
}
function resolveMemoizedChannelCatalogDiscovery(params) {
	const installRecordsKey = resolveInstallRecordsKey(params);
	const scopeKey = resolveChannelCatalogDiscoveryScopeKey(params);
	if (installRecordsKey.cacheable && channelCatalogDiscoveryMemo?.scopeKey === scopeKey && channelCatalogDiscoveryMemo.installRecordsIdentity === installRecordsKey.identity && channelCatalogDiscoveryMemo.installRecordsFingerprint === installRecordsKey.fingerprint) return channelCatalogDiscoveryMemo.discovery;
	const resolvedInstallRecords = resolveInstallRecords(params);
	const discovery = discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env,
		extraPaths: params.extraPaths,
		...resolvedInstallRecords.installRecords && Object.keys(resolvedInstallRecords.installRecords).length > 0 ? { installRecords: resolvedInstallRecords.installRecords } : {}
	});
	if (resolvedInstallRecords.cacheable && installRecordsKey.cacheable) channelCatalogDiscoveryMemo = {
		scopeKey,
		installRecordsIdentity: installRecordsKey.identity,
		...installRecordsKey.fingerprint !== void 0 ? { installRecordsFingerprint: installRecordsKey.fingerprint } : {},
		discovery
	};
	return discovery;
}
function resolveChannelCatalogDiscoveryScopeKey(params) {
	const env = params.env ?? process.env;
	return JSON.stringify({
		workspaceDir: normalizeOptionalString(params.workspaceDir) ?? null,
		discovery: resolvePluginDiscoveryContext({
			workspaceDir: params.workspaceDir,
			env,
			loadPaths: params.extraPaths
		}),
		compatibilityHostVersion: resolveCompatibilityHostVersion(env),
		bundledSourceOverlaysDisabled: env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS ?? "",
		nixMode: resolveIsNixMode(env)
	});
}
function resolveInstallRecordsKey(params) {
	if (params.installRecords) try {
		const fingerprint = JSON.stringify(params.installRecords);
		return fingerprint === void 0 ? {
			identity: params.installRecords,
			cacheable: false
		} : {
			identity: params.installRecords,
			fingerprint,
			cacheable: true
		};
	} catch {
		return {
			identity: params.installRecords,
			cacheable: false
		};
	}
	return {
		identity: params.origin === "bundled" ? noInstallRecordsIdentity : defaultInstallRecordsIdentity,
		cacheable: true
	};
}
function resolveChannelCatalogPluginId(candidate) {
	return normalizeOptionalString(candidate.bundledManifest?.id) ?? normalizeOptionalString(candidate.bundledManifestId) ?? normalizeOptionalString(candidate.packageManifest?.plugin?.id) ?? normalizeOptionalString(candidate.idHint);
}
function resolveInstallRecords(params) {
	if (params.installRecords) return {
		installRecords: params.installRecords,
		cacheable: true
	};
	if (params.origin === "bundled") return { cacheable: true };
	try {
		return {
			installRecords: loadInstalledPluginIndexInstallRecordsSync(params.env ? { env: params.env } : {}),
			cacheable: true
		};
	} catch {
		return { cacheable: false };
	}
}
//#endregion
export { listChannelCatalogEntries as t };
