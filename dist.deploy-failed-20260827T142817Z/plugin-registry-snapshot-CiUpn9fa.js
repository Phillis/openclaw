import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { g as listBundledSourceOverlayDirs, t as discoverConfiguredPluginLoadPaths, v as buildLegacyBundledRootPath } from "./discovery-C2Bhkw0t.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { l as tryReadJsonSync } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-CvTl0ZdS.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata } from "./manifest-BmA-DH7w.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { n as resolvePluginSourceRoots } from "./roots-BE7SozBT.js";
import { a as loadInstalledPluginIndexWithDiscovery, d as resolvePluginDoctorContractArtifactPath, g as safeHashFile, h as safeFileSignature, l as hasOptionalMissingPluginManifestFile, n as hasInstalledPluginIndexWorkspaceScopeMismatch, p as resolveInstalledPluginIndexPolicyHash, r as isInstalledPluginEnabled, t as getInstalledPluginRecord, v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-BC03OFwf.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-DH1L0Z7Y.js";
import { r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-DArXGVRI.js";
import { a as refreshPersistedInstalledPluginIndex, i as readPersistedInstalledPluginIndexSync, m as hasMissingConfigPathActivationMetadata, t as inspectPersistedInstalledPluginIndex } from "./installed-plugin-index-store-BIcBJeAh.js";
import { t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-FCmk8v-i.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-B1YRfQOc.js";
import { t as hasMissingInstalledPluginOwnerMetadata } from "./installed-plugin-package-ownership-DMNKpP-8.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/plugin-registry-id-normalizer.ts
function normalizePluginRegistryAlias(value) {
	return value.trim();
}
function normalizePluginRegistryAliasKey(value) {
	return normalizePluginRegistryAlias(value).toLowerCase();
}
function collectObjectKeys(value) {
	return value ? Object.keys(value) : [];
}
function listPluginRegistryNormalizerAliases(plugin) {
	return [
		plugin.id,
		...plugin.providers ?? [],
		...plugin.channels ?? [],
		...plugin.setup?.providers?.map((provider) => provider.id) ?? [],
		...plugin.cliBackends ?? [],
		...plugin.setup?.cliBackends ?? [],
		...collectObjectKeys(plugin.modelCatalog?.providers),
		...collectObjectKeys(plugin.modelCatalog?.aliases),
		...collectObjectKeys(plugin.providerAuthAliases),
		...plugin.legacyPluginIds ?? []
	];
}
/** Creates a normalizer that maps provider/channel/catalog aliases back to plugin ids. */
function createPluginRegistryIdNormalizer(index, options = {}) {
	const aliases = /* @__PURE__ */ new Map();
	for (const plugin of index.plugins) {
		if (!plugin.pluginId) continue;
		const pluginId = normalizePluginRegistryAlias(plugin.pluginId);
		if (pluginId) aliases.set(normalizePluginRegistryAliasKey(pluginId), plugin.pluginId);
	}
	const registry = options.lookUpTable?.manifestRegistry ?? options.manifestRegistry ?? loadPluginManifestRegistryForInstalledIndex({
		index,
		includeDisabled: true
	});
	for (const plugin of [...registry.plugins].toSorted((left, right) => left.id.localeCompare(right.id))) {
		const pluginId = normalizePluginRegistryAlias(plugin.id);
		if (!pluginId) continue;
		aliases.set(normalizePluginRegistryAliasKey(pluginId), plugin.id);
		for (const alias of listPluginRegistryNormalizerAliases(plugin)) {
			const normalizedAlias = normalizePluginRegistryAlias(alias);
			const normalizedAliasKey = normalizePluginRegistryAliasKey(alias);
			if (normalizedAlias && !aliases.has(normalizedAliasKey)) aliases.set(normalizedAliasKey, pluginId);
		}
	}
	return (pluginId) => {
		const trimmed = normalizePluginRegistryAlias(pluginId);
		return aliases.get(normalizePluginRegistryAliasKey(trimmed)) ?? trimmed;
	};
}
//#endregion
//#region src/plugins/control-plane-workspace.ts
/** Resolves the optional agent workspace enrichment used by plugin control-plane inventory. */
const PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE = "workspace-scope-omitted";
/**
* Resolve workspace discovery without inventing ownership for an explicit roster.
* Shared roots remain safe to inspect when no system owner can be proven.
*/
function resolvePluginControlPlaneWorkspace(params) {
	if (params.workspaceDir !== void 0) return {
		workspaceDir: params.workspaceDir,
		workspaceScope: "selected"
	};
	const agentId = normalizeOptionalString(params.config.agents?.defaults?.systemAgent?.agentId) ?? tryResolveLegacyCompatibilityAgentId(params.config);
	const workspaceDir = agentId ? resolveAgentWorkspaceDir(params.config, agentId, params.env) : void 0;
	if (workspaceDir) return {
		agentId,
		workspaceDir,
		workspaceScope: "selected"
	};
	return {
		workspaceScope: "omitted",
		diagnostic: {
			level: "warn",
			code: PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE,
			message: "Workspace plugin discovery was skipped because multiple explicit agents are configured without agents.defaults.systemAgent.agentId. This partial result includes bundled, managed, and global plugins only; set agents.defaults.systemAgent.agentId to include that owner's workspace plugins."
		}
	};
}
function appendPluginControlPlaneWorkspaceDiagnostic(diagnostics, resolution) {
	const diagnostic = resolution.diagnostic;
	if (!diagnostic || diagnostics.some((entry) => entry.code === PLUGIN_WORKSPACE_SCOPE_OMITTED_DIAGNOSTIC_CODE)) return [...diagnostics];
	return [...diagnostics, diagnostic];
}
//#endregion
//#region src/plugins/plugin-registry-snapshot.ts
function resolvePluginRegistryContent(index, comparePackageJsonPath, excludedPlugins) {
	const { generatedAtMs: _generatedAtMs, refreshReason: _refreshReason, warning: _warning, ...content } = index;
	const excludedRoots = [...excludedPlugins?.values() ?? []].map((root) => path.resolve(root));
	const exclusionPathCache = /* @__PURE__ */ new Map();
	return {
		...content,
		diagnostics: excludedPlugins ? content.diagnostics.filter((diagnostic) => !(diagnostic.pluginId && excludedPlugins.has(diagnostic.pluginId) || diagnostic.source && excludedRoots.some((root) => isContainedPluginPath(root, diagnostic.source, exclusionPathCache)))) : content.diagnostics,
		installRecords: excludedPlugins ? Object.fromEntries(Object.entries(content.installRecords).filter(([pluginId]) => !excludedPlugins.has(pluginId))) : content.installRecords,
		plugins: content.plugins.filter((plugin) => !excludedPlugins?.has(plugin.pluginId)).map((plugin) => {
			const { doctorContractFile: _doctorContractFile, manifestFile: _manifestFile, packageBuild, packageJson, ...record } = plugin;
			const stableRecord = Object.assign(record, packageBuild === void 0 ? {} : { packageBuild: packageBuild.bundledDist === void 0 ? {} : { bundledDist: packageBuild.bundledDist } });
			if (!packageJson) return stableRecord;
			if (!comparePackageJsonPath) return stableRecord;
			const { fileSignature: _fileSignature, path: packageJsonPath, ...stablePackageJson } = packageJson;
			return Object.assign(stableRecord, { packageJson: Object.assign(stablePackageJson, { path: packageJsonPath }) });
		})
	};
}
function canReuseCurrentPluginMetadataSnapshot(params) {
	return params.allowCurrent !== false && params.preferPersisted !== false && params.stateDir === void 0 && params.filePath === void 0 && params.pluginIndexFilePath === void 0 && params.installRecords === void 0 && params.candidates === void 0 && params.diagnostics === void 0 && params.discovery === void 0 && params.now === void 0;
}
function loadCurrentPluginRegistrySnapshotResult(params) {
	if (!canReuseCurrentPluginMetadataSnapshot(params)) return;
	const current = getCurrentPluginMetadataSnapshot({
		config: params.config,
		env: params.env ?? process.env,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
	});
	if (!current) return;
	return {
		snapshot: current.index,
		source: current.registrySource ?? (current.registryDiagnostics.length > 0 ? "derived" : "provided"),
		diagnostics: current.registryDiagnostics,
		...current.discovery ? { discovery: current.discovery } : {},
		manifestRegistry: current.manifestRegistry
	};
}
function fileContentMatches(filePath, hash, signature, trustSignature = true) {
	const current = safeFileSignature(filePath);
	if (!current) return false;
	if (trustSignature && signature?.ctimeMs !== void 0 && current.size === signature.size && current.mtimeMs === signature.mtimeMs && current.ctimeMs === signature.ctimeMs) return true;
	return safeHashFile({
		filePath,
		diagnostics: [],
		required: false
	}) === hash;
}
function isContainedPluginPath(rootPath, targetPath, cache) {
	const resolveProjectedPath = (inputPath) => {
		const target = path.resolve(inputPath);
		for (let cursor = target;; cursor = path.dirname(cursor)) try {
			fs.lstatSync(cursor);
			const realCursor = safeRealpathSync(cursor, cache);
			return realCursor ? path.resolve(realCursor, path.relative(cursor, target)) : null;
		} catch {
			if (cursor === path.dirname(cursor)) return null;
		}
	};
	const root = resolveProjectedPath(rootPath);
	const target = resolveProjectedPath(targetPath);
	return Boolean(root && target && isPathInside(root, target));
}
function hasStaleDoctorContractFile(plugin, rootExists) {
	if (!rootExists && !plugin.enabled) return false;
	const contractPath = resolvePluginDoctorContractArtifactPath(plugin.rootDir);
	return contractPath ? !plugin.doctorContractHash || !fileContentMatches(contractPath, plugin.doctorContractHash, plugin.doctorContractFile) : plugin.doctorContractHash !== void 0 || plugin.doctorContractFile !== void 0;
}
function hasStalePersistedPluginFiles(index) {
	const realpathCache = /* @__PURE__ */ new Map();
	return index.plugins.some((plugin) => {
		if (!isContainedPluginPath(plugin.rootDir, plugin.rootDir, realpathCache)) return true;
		const rootExists = fs.existsSync(plugin.rootDir);
		if (!rootExists && plugin.enabled) return true;
		for (const artifactPath of [
			plugin.source,
			plugin.setupSource,
			plugin.manifestPath
		]) if (artifactPath && !isContainedPluginPath(plugin.rootDir, artifactPath, realpathCache)) return true;
		if (plugin.enabled && ((plugin.source ? !fs.existsSync(plugin.source) : false) || (plugin.setupSource ? !fs.existsSync(plugin.setupSource) : false))) return true;
		if (!hasOptionalMissingPluginManifestFile(plugin)) {
			if (!fs.existsSync(plugin.manifestPath)) {
				if (plugin.enabled) return true;
			} else if (!fileContentMatches(plugin.manifestPath, plugin.manifestHash, plugin.manifestFile)) return true;
		}
		if (hasStaleDoctorContractFile(plugin, rootExists)) return true;
		if (!plugin.packageJson) return false;
		const packageJsonPath = path.resolve(plugin.rootDir, plugin.packageJson.path);
		if (!isContainedPluginPath(plugin.rootDir, packageJsonPath, realpathCache)) return true;
		if (!fs.existsSync(packageJsonPath)) return plugin.enabled;
		if (!isRealPathInside(plugin.rootDir, packageJsonPath, realpathCache)) return true;
		return !fileContentMatches(packageJsonPath, plugin.packageJson.hash, plugin.packageJson.fileSignature, plugin.origin === "bundled");
	});
}
function isRealPathInside(parentPath, childPath, cache) {
	const parent = safeRealpathSync(parentPath, cache);
	const child = safeRealpathSync(childPath, cache);
	return Boolean(parent && child && isPathInside(parent, child));
}
function hasMismatchedPersistedBundledRoot(index, env) {
	const bundledRoot = resolveBundledPluginsDir(env);
	if (!bundledRoot) return false;
	const realpathCache = /* @__PURE__ */ new Map();
	const overlays = listBundledSourceOverlayDirs({
		bundledRoot,
		env
	});
	const legacyRoot = buildLegacyBundledRootPath(bundledRoot);
	const sourceCheckout = legacyRoot && fs.existsSync(path.join(path.dirname(legacyRoot), ".git")) && fs.existsSync(path.join(path.dirname(legacyRoot), "pnpm-workspace.yaml")) && fs.existsSync(path.join(path.dirname(legacyRoot), "src"));
	return index.plugins.some((plugin) => {
		if (plugin.origin !== "bundled") return false;
		if (!plugin.enabled && !fs.existsSync(plugin.rootDir)) return ![
			bundledRoot,
			...overlays,
			...legacyRoot ? [legacyRoot] : []
		].some((root) => isContainedPluginPath(root, plugin.rootDir, realpathCache));
		if (isRealPathInside(bundledRoot, plugin.rootDir, realpathCache)) {
			if (!sourceCheckout) return false;
			const resolvedBundledRoot = safeRealpathSync(bundledRoot, realpathCache) ?? bundledRoot;
			const resolvedPluginRoot = safeRealpathSync(plugin.rootDir, realpathCache) ?? plugin.rootDir;
			return getPackageManifestMetadata(tryReadJsonSync(path.join(legacyRoot, path.relative(resolvedBundledRoot, resolvedPluginRoot), "package.json")) ?? void 0)?.build?.bundledDist === false;
		}
		return !overlays.some((root) => isRealPathInside(root, plugin.rootDir, realpathCache)) && !(plugin.packageBuild?.bundledDist === false && legacyRoot && isRealPathInside(legacyRoot, plugin.rootDir, realpathCache));
	});
}
function hasRecoveredInstallRecordsMissingFromPersistedIndex(index, params, env) {
	const installRecords = loadInstalledPluginIndexInstallRecordsSync({
		env,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.filePath ? { filePath: params.filePath } : params.pluginIndexFilePath ? { filePath: params.pluginIndexFilePath } : {}
	});
	return Object.keys(installRecords).some((pluginId) => !index.installRecords?.[pluginId]);
}
function requiresDerivedRegistryValidation(index, params, env, hasStalePluginFiles) {
	return hasInstalledPluginIndexWorkspaceScopeMismatch(index, params.workspaceDir) || params.candidates !== void 0 || params.discovery !== void 0 || params.diagnostics !== void 0 || params.installRecords !== void 0 || normalizePluginsConfig(params.config?.plugins).loadPaths.length > 0 || hasMissingConfigPathActivationMetadata(index) || hasMissingInstalledPluginOwnerMetadata(index, env) || index.diagnostics.some(({ pluginId, source }) => Boolean(pluginId && source && path.isAbsolute(source) && !fs.existsSync(source))) || hasMismatchedPersistedBundledRoot(index, env) || hasStalePluginFiles() || hasRecoveredInstallRecordsMissingFromPersistedIndex(index, params, env) || hasConfiguredGlobalSourcePluginMissingFromPersistedIndex(params, index, env);
}
function collectConfiguredPluginIds(config) {
	const plugins = normalizePluginsConfig(config?.plugins);
	const pluginIds = /* @__PURE__ */ new Set();
	for (const pluginId of Object.keys(plugins.entries)) pluginIds.add(pluginId);
	for (const pluginId of plugins.allow) pluginIds.add(pluginId);
	for (const pluginId of Object.values(plugins.slots)) if (typeof pluginId === "string" && pluginId.trim() && pluginId !== "none") pluginIds.add(pluginId);
	return pluginIds;
}
function hasConfiguredGlobalSourcePluginMissingFromPersistedIndex(params, index, env) {
	const configuredPluginIds = collectConfiguredPluginIds(params.config);
	const persistedPluginIds = new Set(index.plugins.map((plugin) => plugin.pluginId));
	const missingConfiguredPluginIds = new Set([...configuredPluginIds].filter((pluginId) => !persistedPluginIds.has(pluginId)));
	if (missingConfiguredPluginIds.size === 0) return false;
	const globalExtensionsRoot = resolvePluginSourceRoots({
		workspaceDir: params.workspaceDir,
		env
	}).global;
	const discovery = discoverConfiguredPluginLoadPaths({
		loadPaths: [globalExtensionsRoot],
		workspaceDir: params.workspaceDir,
		env
	});
	return loadPluginManifestRegistryCore({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(index)
	}).plugins.some((plugin) => missingConfiguredPluginIds.has(plugin.id));
}
function loadPluginRegistrySnapshotWithMetadata(params = {}) {
	if (params.index) return {
		snapshot: params.index,
		source: "provided",
		diagnostics: []
	};
	const current = loadCurrentPluginRegistrySnapshotResult(params);
	if (current) return current;
	const env = params.env ?? process.env;
	if (!(params.preferPersisted !== false)) {
		const derived = loadInstalledPluginIndexWithDiscovery({
			...params,
			installRecords: params.installRecords ?? {}
		});
		return {
			snapshot: derived.index,
			source: "derived",
			diagnostics: [],
			discovery: derived.discovery,
			manifestRegistry: derived.manifestRegistry
		};
	}
	const diagnostics = [];
	const persistedIndex = readPersistedInstalledPluginIndexSync(params);
	let stalePluginFiles;
	const hasStalePluginFiles = () => stalePluginFiles ??= persistedIndex ? hasStalePersistedPluginFiles(persistedIndex) : false;
	if (!persistedIndex) diagnostics.push({
		level: "info",
		code: "persisted-registry-missing",
		message: "Persisted plugin registry is missing or invalid; using derived plugin index."
	});
	else if (params.config && persistedIndex.policyHash !== resolveInstalledPluginIndexPolicyHash(params.config)) diagnostics.push({
		level: "warn",
		code: "persisted-registry-stale-policy",
		message: "Persisted plugin registry policy does not match current config; using derived plugin index. Run `openclaw plugins registry --refresh` to update the persisted registry."
	});
	else if (!requiresDerivedRegistryValidation(persistedIndex, params, env, hasStalePluginFiles)) return {
		snapshot: persistedIndex,
		source: "persisted",
		diagnostics
	};
	const derived = loadInstalledPluginIndexWithDiscovery({
		...params,
		...params.filePath && !params.pluginIndexFilePath ? { pluginIndexFilePath: params.filePath } : {}
	});
	const comparePackageJsonPath = params.candidates !== void 0 || params.discovery !== void 0 || hasStalePluginFiles();
	const excludedMissingDisabledPlugins = /* @__PURE__ */ new Map();
	if (persistedIndex && params.candidates === void 0 && params.discovery === void 0 && params.installRecords === void 0 && !hasStalePluginFiles() && !hasMismatchedPersistedBundledRoot(persistedIndex, env)) {
		const derivedPluginIds = new Set(derived.index.plugins.map((plugin) => plugin.pluginId));
		for (const plugin of persistedIndex.plugins) if (!plugin.enabled && !derivedPluginIds.has(plugin.pluginId)) excludedMissingDisabledPlugins.set(plugin.pluginId, plugin.rootDir);
	}
	const contentMatches = persistedIndex && diagnostics.length === 0 && isDeepStrictEqual(resolvePluginRegistryContent(persistedIndex, comparePackageJsonPath, excludedMissingDisabledPlugins), resolvePluginRegistryContent(derived.index, comparePackageJsonPath, excludedMissingDisabledPlugins));
	if (persistedIndex && contentMatches) {
		const packageMetadataMatches = isDeepStrictEqual(resolvePluginRegistryContent(persistedIndex, true), resolvePluginRegistryContent(derived.index, true));
		return {
			snapshot: persistedIndex,
			source: "persisted",
			diagnostics,
			discovery: derived.discovery,
			...packageMetadataMatches ? { manifestRegistry: derived.manifestRegistry } : {}
		};
	} else if (persistedIndex && diagnostics.length === 0) diagnostics.push({
		level: "warn",
		code: "persisted-registry-stale-source",
		message: "Persisted plugin registry no longer matches current plugin discovery or metadata; using derived plugin index. Run `openclaw plugins registry --refresh` to update the persisted registry."
	});
	return {
		snapshot: derived.index,
		source: "derived",
		diagnostics,
		discovery: derived.discovery,
		manifestRegistry: derived.manifestRegistry
	};
}
function resolveSnapshot(params = {}) {
	return loadPluginRegistrySnapshotWithMetadata(params).snapshot;
}
function loadPluginRegistrySnapshot(params = {}) {
	return resolveSnapshot(params);
}
function getPluginRecord(params) {
	return getInstalledPluginRecord(resolveSnapshot(params), params.pluginId);
}
function isPluginEnabled(params) {
	return isInstalledPluginEnabled(resolveSnapshot(params), params.pluginId, params.config);
}
function inspectPluginRegistry(params = {}) {
	return inspectPersistedInstalledPluginIndex(params);
}
function refreshPluginRegistry(params) {
	if (!params.config) return refreshPersistedInstalledPluginIndex(params);
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir
	});
	return refreshPersistedInstalledPluginIndex({
		...params,
		diagnostics: appendPluginControlPlaneWorkspaceDiagnostic(params.diagnostics ?? [], workspace),
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	});
}
//#endregion
export { loadPluginRegistrySnapshotWithMetadata as a, resolvePluginControlPlaneWorkspace as c, loadPluginRegistrySnapshot as i, createPluginRegistryIdNormalizer as l, inspectPluginRegistry as n, refreshPluginRegistry as o, isPluginEnabled as r, appendPluginControlPlaneWorkspaceDiagnostic as s, getPluginRecord as t };
