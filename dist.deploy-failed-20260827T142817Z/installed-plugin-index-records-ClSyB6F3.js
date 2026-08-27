import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { i as getPluginInstallRecordMapEntry, l as setPluginInstallRecordMapEntry, n as copyPluginInstallRecordMap, r as createPluginInstallRecordMap } from "./plugin-install-record-map-B3dUHyOF.js";
import { s as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-DArXGVRI.js";
import { a as refreshPersistedInstalledPluginIndex, s as refreshPersistedInstalledPluginIndexWithLeaseSync } from "./installed-plugin-index-store-BIcBJeAh.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-DqwMuR5d.js";
//#region src/plugins/installs.ts
function configReferencesNpmInstallPath(params) {
	const installPath = params.install?.installPath;
	if (params.install?.source !== "npm" || !installPath) return false;
	const resolvedInstallPath = resolveUserPath(installPath, params.env);
	return Boolean(params.config.plugins?.load?.paths?.some((entry) => resolveUserPath(entry, params.env) === resolvedInstallPath));
}
function reconcileNpmPluginLoadPath(params) {
	const previousPath = params.previousInstall?.installPath;
	const nextPath = params.nextInstall.installPath;
	if (params.previousInstall?.source !== "npm" || params.nextInstall.source !== "npm" || !previousPath || !nextPath) return params.config;
	const previousResolved = resolveUserPath(previousPath, params.env);
	const nextResolved = resolveUserPath(nextPath, params.env);
	const existing = params.config.plugins?.load?.paths;
	if (previousResolved === nextResolved || !existing?.length) return params.config;
	const replaceAt = existing.findIndex((entry) => resolveUserPath(entry, params.env) === previousResolved);
	if (replaceAt < 0) return params.config;
	const existingNextAt = existing.findIndex((entry) => resolveUserPath(entry, params.env) === nextResolved);
	const paths = existing.flatMap((entry, index) => {
		const resolved = resolveUserPath(entry, params.env);
		if (existingNextAt >= 0) {
			if (resolved === previousResolved || resolved === nextResolved && index !== existingNextAt) return [];
			return [entry];
		}
		if (index === replaceAt) return [nextPath];
		return resolved === previousResolved ? [] : [entry];
	});
	return {
		...params.config,
		plugins: {
			...params.config.plugins,
			load: {
				...params.config.plugins?.load,
				paths
			}
		}
	};
}
/** Builds install record fields from resolved npm package metadata. */
function buildNpmResolutionInstallFields(resolution) {
	return buildNpmResolutionFields(resolution);
}
function isExactRegistryNpmSpec(spec) {
	return (spec ? parseRegistryNpmSpec(spec) : null)?.selectorKind === "exact-version";
}
function resolveNpmInstallRecordSpec(params) {
	const resolvedSpec = params.resolution?.resolvedSpec;
	if (!params.pinResolvedRegistrySpec || !isExactRegistryNpmSpec(resolvedSpec)) return params.requestedSpec;
	return resolvedSpec;
}
/** Replaces a plugin install record with the authoritative completed install. */
function recordPluginInstall(cfg, update) {
	const { pluginId, ...record } = update;
	const nextRecord = {
		...record,
		installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	};
	const installs = copyPluginInstallRecordMap(cfg.plugins?.installs);
	setPluginInstallRecordMapEntry(installs, pluginId, nextRecord);
	return reconcileNpmPluginLoadPath({
		config: {
			...cfg,
			plugins: {
				...cfg.plugins,
				installs
			}
		},
		previousInstall: getPluginInstallRecordMapEntry(cfg.plugins?.installs, pluginId),
		nextInstall: nextRecord
	});
}
//#endregion
//#region src/plugins/installed-plugin-index-records.ts
/** Builds and compares installed plugin index records for refresh decisions. */
/** Config path for legacy plugin install records kept for migration/doctor flows. */
const PLUGIN_INSTALLS_CONFIG_PATH = ["plugins", "installs"];
/** Resolves the installed plugin index record store path. */
function resolveInstalledPluginIndexRecordsStorePath(options = {}) {
	return resolveInstalledPluginIndexStorePath(options);
}
/** Refreshes persisted installed plugin index records asynchronously. */
async function writePersistedInstalledPluginIndexInstallRecords(records, options = {}) {
	await refreshPersistedInstalledPluginIndex({
		...options,
		reason: "source-changed",
		installRecords: records
	});
	return resolveInstalledPluginIndexRecordsStorePath(options);
}
/** Refresh persisted install records while holding the plugin lifecycle lease. */
async function writePersistedInstalledPluginIndexInstallRecordsWithLease(records, options) {
	return refreshPersistedInstalledPluginIndexWithLeaseSync({
		...options,
		reason: "source-changed",
		installRecords: records
	});
}
/** Returns config with plugin install records attached at the canonical config path. */
function withPluginInstallRecords(config, records) {
	return {
		...config,
		plugins: {
			...config.plugins,
			installs: records
		}
	};
}
/** Returns config with legacy plugin install records removed. */
function withoutPluginInstallRecords(config, options = {}) {
	if (!config.plugins?.installs) return config;
	const { installs: _installs, ...plugins } = config.plugins;
	if (Object.keys(plugins).length === 0) {
		if (options.preserveEmptyPlugins) return {
			...config,
			plugins: {}
		};
		const { plugins: _plugins, ...rest } = config;
		return rest;
	}
	return {
		...config,
		plugins
	};
}
/** Applies one install update to an in-memory install record map. */
function recordPluginInstallInRecords(records, update) {
	return recordPluginInstall({ plugins: { installs: records } }, update).plugins?.installs ?? createPluginInstallRecordMap();
}
/** Removes one plugin install record from an in-memory record map. */
function removePluginInstallRecordFromRecords(records, pluginId) {
	const remaining = createPluginInstallRecordMap();
	for (const [candidateId, record] of Object.entries(records)) if (candidateId !== pluginId) setPluginInstallRecordMapEntry(remaining, candidateId, record);
	return remaining;
}
//#endregion
export { withPluginInstallRecords as a, writePersistedInstalledPluginIndexInstallRecordsWithLease as c, reconcileNpmPluginLoadPath as d, recordPluginInstall as f, resolveInstalledPluginIndexRecordsStorePath as i, buildNpmResolutionInstallFields as l, recordPluginInstallInRecords as n, withoutPluginInstallRecords as o, resolveNpmInstallRecordSpec as p, removePluginInstallRecordFromRecords as r, writePersistedInstalledPluginIndexInstallRecords as s, PLUGIN_INSTALLS_CONFIG_PATH as t, configReferencesNpmInstallPath as u };
