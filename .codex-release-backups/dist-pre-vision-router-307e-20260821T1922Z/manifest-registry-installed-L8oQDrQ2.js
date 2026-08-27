import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as normalizeOptionalTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { d as recordPluginCandidateInstallOwner, i as normalizePluginDependencySpecs, s as tracePluginLifecyclePhase } from "./discovery-C2Bhkw0t.js";
import { l as tryReadJsonSync } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata, c as normalizeManifestChannelCommandDefaults, i as DEFAULT_PLUGIN_ENTRY_CANDIDATES } from "./manifest-BmA-DH7w.js";
import { m as hashJson, v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-CqyEIHSI.js";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-Q7fHcAUz.js";
import { r as resolveChannelSetupFieldCliAttributeName } from "./setup-contract-DNfi_CdO.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/manifest-registry-installed.ts
/** Builds manifest registry records from installed plugin index snapshots. */
const installedManifestRegistryIndexFingerprintCache = /* @__PURE__ */ new WeakMap();
const installedPackageMetadataCache = /* @__PURE__ */ new Map();
const MAX_INSTALLED_PACKAGE_METADATA_CACHE_ENTRIES = 256;
function clearInstalledManifestRegistryProcessCaches() {
	installedPackageMetadataCache.clear();
}
registerPluginMetadataProcessMemoLifecycleClear(clearInstalledManifestRegistryProcessCaches);
function isDeepFrozenJsonLike(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return true;
	const object = value;
	if (seen.has(object)) return true;
	if (!Object.isFrozen(object)) return false;
	seen.add(object);
	return Object.values(value).every((entry) => isDeepFrozenJsonLike(entry, seen));
}
function isRelativePathInsideOrEqual(relativePath) {
	return relativePath === "" || relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
}
function resolvePackageJsonPath(record, realpathCache) {
	if (!record.packageJson?.path) return;
	const rootDir = resolveInstalledPluginRootDir(record);
	const realRootDir = safeRealpathSync(rootDir, realpathCache) ?? path.resolve(rootDir);
	const packageJsonPath = path.resolve(realRootDir, record.packageJson.path);
	if (!isRelativePathInsideOrEqual(path.relative(realRootDir, packageJsonPath))) return;
	const packageJsonRealPath = safeRealpathSync(packageJsonPath, realpathCache);
	if (!packageJsonRealPath || !isPathInside(realRootDir, packageJsonRealPath)) return;
	return packageJsonPath;
}
function rememberInstalledPackageMetadata(key, metadata) {
	if (key) {
		installedPackageMetadataCache.set(key, metadata);
		pruneMapToMaxSize(installedPackageMetadataCache, MAX_INSTALLED_PACKAGE_METADATA_CACHE_ENTRIES);
	}
	return metadata;
}
function buildInstalledPackageMetadataCacheKey(record) {
	if (!record.packageJson?.path || !record.packageJson.hash) return;
	return hashJson({
		rootDir: path.resolve(resolveInstalledPluginRootDir(record)),
		packageJson: record.packageJson,
		packageChannel: record.packageChannel ?? null
	});
}
function resolveInstalledManifestRegistryIndexFingerprint(index) {
	const cached = installedManifestRegistryIndexFingerprintCache.get(index);
	if (cached) return cached;
	const fingerprint = hashJson({
		version: index.version,
		hostContractVersion: index.hostContractVersion,
		compatRegistryVersion: index.compatRegistryVersion,
		migrationVersion: index.migrationVersion,
		policyHash: index.policyHash,
		installRecords: index.installRecords,
		diagnostics: index.diagnostics,
		plugins: index.plugins.map(({ doctorContractFile: _doctorContractFile, ...plugin }) => plugin)
	});
	if (isDeepFrozenJsonLike(index)) installedManifestRegistryIndexFingerprintCache.set(index, fingerprint);
	return fingerprint;
}
function resolveInstalledPluginRootDir(record) {
	return record.rootDir || path.dirname(record.manifestPath || process.cwd());
}
function resolveFallbackPluginSource(record) {
	const rootDir = resolveInstalledPluginRootDir(record);
	for (const entry of DEFAULT_PLUGIN_ENTRY_CANDIDATES) {
		const candidate = path.join(rootDir, entry);
		if (fs.existsSync(candidate)) return candidate;
	}
	return path.join(rootDir, DEFAULT_PLUGIN_ENTRY_CANDIDATES[0]);
}
function normalizePackageChannelExposure(exposure) {
	if (!isRecord(exposure)) return;
	const normalized = {};
	for (const key of [
		"configured",
		"setup",
		"docs"
	]) if (typeof exposure[key] === "boolean") normalized[key] = exposure[key];
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePackageChannelConfiguredState(configuredState) {
	if (!isRecord(configuredState)) return;
	const env = isRecord(configuredState.env) ? {
		...normalizeOptionalTrimmedStringList(configuredState.env.allOf)?.length ? { allOf: normalizeOptionalTrimmedStringList(configuredState.env.allOf) } : {},
		...normalizeOptionalTrimmedStringList(configuredState.env.anyOf)?.length ? { anyOf: normalizeOptionalTrimmedStringList(configuredState.env.anyOf) } : {}
	} : void 0;
	const specifier = normalizeOptionalString(configuredState.specifier);
	const exportName = normalizeOptionalString(configuredState.exportName);
	return specifier || exportName || env && Object.keys(env).length > 0 ? {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
		...env && Object.keys(env).length > 0 ? { env } : {}
	} : void 0;
}
function normalizePackageChannelPersistedAuthState(persistedAuthState) {
	if (!isRecord(persistedAuthState)) return;
	const specifier = normalizeOptionalString(persistedAuthState.specifier);
	const exportName = normalizeOptionalString(persistedAuthState.exportName);
	return specifier || exportName ? {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {}
	} : void 0;
}
function normalizePackageChannelDoctorCapabilities(doctorCapabilities) {
	if (!isRecord(doctorCapabilities)) return;
	const normalized = {};
	const { dmAllowFromMode, groupModel } = doctorCapabilities;
	if (dmAllowFromMode === "topOnly" || dmAllowFromMode === "topOrNested" || dmAllowFromMode === "nestedOnly") normalized.dmAllowFromMode = dmAllowFromMode;
	if (groupModel === "sender" || groupModel === "route" || groupModel === "hybrid") normalized.groupModel = groupModel;
	for (const key of [
		"openDmRequiresAllowFromWildcard",
		"groupAllowFromFallbackToAllowFrom",
		"warnOnEmptyGroupSenderAllowlist"
	]) if (typeof doctorCapabilities[key] === "boolean") normalized[key] = doctorCapabilities[key];
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePackageChannelCliOptions(cliAddOptions) {
	if (!Array.isArray(cliAddOptions)) return;
	const normalized = cliAddOptions.flatMap((option) => {
		if (!isRecord(option)) return [];
		const flags = normalizeOptionalString(option.flags);
		const description = normalizeOptionalString(option.description);
		if (!flags || !description) return [];
		const defaultValue = typeof option.defaultValue === "boolean" || typeof option.defaultValue === "string" ? option.defaultValue : void 0;
		const valueType = option.valueType === "int" || option.valueType === "list" ? option.valueType : void 0;
		return [{
			flags,
			description,
			...defaultValue !== void 0 ? { defaultValue } : {},
			...valueType ? { valueType } : {}
		}];
	});
	return normalized.length > 0 ? normalized : void 0;
}
function normalizePackageChannelSetup(setup) {
	if (!isRecord(setup) || !Array.isArray(setup.fields)) return;
	const fields = [];
	for (const value of setup.fields) {
		if (!isRecord(value) || !isRecord(value.cli)) continue;
		const key = normalizeOptionalString(value.key);
		const kind = normalizeOptionalString(value.kind);
		const flags = normalizeOptionalString(value.cli.flags);
		const negatedFlags = normalizeOptionalString(value.cli.negatedFlags);
		const description = normalizeOptionalString(value.cli.description);
		if (!key || !flags || !description || !kind || kind !== "string" && kind !== "boolean" && kind !== "integer" && kind !== "string-list" && kind !== "choice") continue;
		try {
			if (resolveChannelSetupFieldCliAttributeName(flags) !== key || negatedFlags && resolveChannelSetupFieldCliAttributeName(negatedFlags) !== key) continue;
		} catch {
			continue;
		}
		const defaultValue = typeof value.cli.defaultValue === "boolean" || typeof value.cli.defaultValue === "string" ? value.cli.defaultValue : void 0;
		const cli = {
			flags,
			...negatedFlags ? { negatedFlags } : {},
			description,
			...defaultValue !== void 0 ? { defaultValue } : {}
		};
		if (kind === "choice") {
			const choices = normalizeOptionalTrimmedStringList(value.choices);
			if (!choices?.length) continue;
			fields.push({
				key,
				kind,
				choices,
				cli
			});
			continue;
		}
		if (kind === "string" || kind === "string-list") {
			fields.push({
				key,
				kind,
				...value.sensitive === true ? { sensitive: true } : {},
				cli
			});
			continue;
		}
		if (kind === "boolean") {
			const envVars = normalizeOptionalTrimmedStringList(value.envVars);
			const envVarMode = value.envVarMode === "any" || value.envVarMode === "all" ? value.envVarMode : void 0;
			fields.push({
				key,
				kind,
				...envVars?.length ? { envVars } : {},
				...envVars?.length && envVarMode ? { envVarMode } : {},
				cli
			});
			continue;
		}
		fields.push({
			key,
			kind,
			cli
		});
	}
	return { fields };
}
function normalizePersistedPackageChannel(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	if (!id) return;
	const channel = { id };
	for (const key of [
		"label",
		"selectionLabel",
		"detailLabel",
		"docsPath",
		"docsLabel",
		"blurb",
		"systemImage",
		"selectionDocsPrefix"
	]) {
		const normalized = normalizeOptionalString(value[key]);
		if (normalized) channel[key] = normalized;
	}
	if (typeof value.order === "number" && Number.isFinite(value.order)) channel.order = value.order;
	for (const key of [
		"aliases",
		"preferOver",
		"selectionExtras"
	]) {
		const normalized = normalizeOptionalTrimmedStringList(value[key]);
		if (normalized?.length) channel[key] = normalized;
	}
	if (Array.isArray(value.approvalFlags) && value.approvalFlags.includes("native")) channel.approvalFlags = ["native"];
	for (const key of [
		"selectionDocsOmitLabel",
		"markdownCapable",
		"quickstartAllowFrom",
		"forceAccountBinding",
		"preferSessionLookupForAnnounceTarget"
	]) if (typeof value[key] === "boolean") channel[key] = value[key];
	for (const [key, normalize] of [
		["exposure", normalizePackageChannelExposure],
		["commands", normalizeManifestChannelCommandDefaults],
		["configuredState", normalizePackageChannelConfiguredState],
		["persistedAuthState", normalizePackageChannelPersistedAuthState],
		["doctorCapabilities", normalizePackageChannelDoctorCapabilities],
		["setup", normalizePackageChannelSetup],
		["cliAddOptions", normalizePackageChannelCliOptions]
	]) {
		const normalized = normalize(value[key]);
		if (normalized) Object.assign(channel, { [key]: normalized });
	}
	return channel;
}
function normalizePreparedManifestRecord(record) {
	if (!record.packageManifest?.channel && !record.packageChannel) return record;
	const packageChannel = normalizePersistedPackageChannel(record.packageManifest?.channel ?? record.packageChannel);
	const { channel: _ignoredChannel, ...packageManifest } = record.packageManifest ?? {};
	return {
		...record,
		packageChannel,
		...record.packageManifest ? { packageManifest: {
			...packageManifest,
			...packageChannel ? { channel: packageChannel } : {}
		} } : {},
		...!packageChannel && record.channelCatalogMeta ? { channelCatalogMeta: void 0 } : {}
	};
}
function resolveInstalledPackageMetadata(record, realpathCache) {
	const cacheKey = buildInstalledPackageMetadataCacheKey(record);
	const cached = cacheKey ? installedPackageMetadataCache.get(cacheKey) : void 0;
	if (cached) return cached;
	const recordPackageChannel = normalizePersistedPackageChannel(record.packageChannel);
	const fallbackPackageManifest = recordPackageChannel ? { channel: recordPackageChannel } : void 0;
	const packageJsonPath = record.packageJson?.path ? resolvePackageJsonPath(record, realpathCache) : void 0;
	if (!packageJsonPath) return rememberInstalledPackageMetadata(cacheKey, fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {});
	const packageJson = tryReadJsonSync(packageJsonPath);
	if (packageJson) {
		const packageManifest = getPackageManifestMetadata(packageJson);
		const dependencies = normalizePluginDependencySpecs({
			dependencies: packageJson.dependencies,
			optionalDependencies: packageJson.optionalDependencies
		});
		if (!packageManifest) return rememberInstalledPackageMetadata(cacheKey, {
			...fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {},
			packageDependencies: dependencies.dependencies,
			packageOptionalDependencies: dependencies.optionalDependencies
		});
		const packageChannel = normalizePersistedPackageChannel(packageManifest.channel);
		const channel = recordPackageChannel || packageChannel ? {
			...recordPackageChannel,
			...packageChannel
		} : void 0;
		const { channel: _ignoredChannel, ...packageManifestWithoutChannel } = packageManifest;
		return rememberInstalledPackageMetadata(cacheKey, {
			packageManifest: {
				...packageManifestWithoutChannel,
				...channel ? { channel } : {}
			},
			packageDependencies: dependencies.dependencies,
			packageOptionalDependencies: dependencies.optionalDependencies
		});
	}
	return rememberInstalledPackageMetadata(cacheKey, fallbackPackageManifest ? { packageManifest: fallbackPackageManifest } : {});
}
function toPluginCandidate(record, realpathCache) {
	const rootDir = resolveInstalledPluginRootDir(record);
	const packageMetadata = resolveInstalledPackageMetadata(record, realpathCache);
	return recordPluginCandidateInstallOwner({
		idHint: record.pluginId,
		effectivePluginId: record.pluginId,
		source: record.source ?? resolveFallbackPluginSource(record),
		...record.setupSource ? { setupSource: record.setupSource } : {},
		rootDir,
		origin: record.origin,
		...record.format ? { format: record.format } : {},
		...record.bundleFormat ? { bundleFormat: record.bundleFormat } : {},
		...record.packageName ? { packageName: record.packageName } : {},
		...record.packageVersion ? { packageVersion: record.packageVersion } : {},
		...packageMetadata.packageManifest ? { packageManifest: packageMetadata.packageManifest } : {},
		...packageMetadata.packageDependencies ? { packageDependencies: packageMetadata.packageDependencies } : {},
		...packageMetadata.packageOptionalDependencies ? { packageOptionalDependencies: packageMetadata.packageOptionalDependencies } : {},
		packageDir: rootDir
	}, resolveInstalledPluginIndexInstallOwner(record), isInstalledPluginIndexInstallOwnerAmbiguous(record));
}
function loadPluginManifestRegistryForInstalledIndex(params) {
	return tracePluginLifecyclePhase("manifest registry", () => {
		if (params.pluginIds && params.pluginIds.length === 0) return {
			plugins: [],
			diagnostics: []
		};
		const env = params.env ?? process.env;
		const pluginIdSet = params.pluginIds?.length ? new Set(params.pluginIds) : null;
		const realpathCache = /* @__PURE__ */ new Map();
		const diagnostics = pluginIdSet ? params.index.diagnostics.filter((diagnostic) => {
			const pluginId = diagnostic.pluginId;
			return !pluginId || pluginIdSet.has(pluginId);
		}) : params.index.diagnostics;
		if (params.manifestRegistry && !params.bundledChannelConfigCollector) {
			const enabledPluginIds = new Set(params.index.plugins.filter((plugin) => params.includeDisabled || plugin.enabled).map((plugin) => plugin.pluginId));
			return {
				plugins: params.manifestRegistry.plugins.filter((plugin) => enabledPluginIds.has(plugin.id)).filter((plugin) => !pluginIdSet || pluginIdSet.has(plugin.id)).map(normalizePreparedManifestRecord),
				diagnostics: [...diagnostics]
			};
		}
		const candidates = params.index.plugins.filter((plugin) => params.includeDisabled || plugin.enabled).filter((plugin) => !pluginIdSet || pluginIdSet.has(plugin.pluginId)).map((plugin) => toPluginCandidate(plugin, realpathCache));
		return loadPluginManifestRegistryCore({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env,
			candidates,
			diagnostics: [...diagnostics],
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(params.index),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
	}, {
		includeDisabled: params.includeDisabled === true,
		pluginIdCount: params.pluginIds?.length,
		indexPluginCount: params.index.plugins.length
	});
}
//#endregion
export { resolveInstalledManifestRegistryIndexFingerprint as n, loadPluginManifestRegistryForInstalledIndex as t };
