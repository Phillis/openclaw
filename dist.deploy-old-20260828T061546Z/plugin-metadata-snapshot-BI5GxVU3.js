import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as isPathInside, p as safeRealpathSync } from "./path-D138yf8v.js";
import { g as listBundledSourceOverlayDirs, t as discoverConfiguredPluginLoadPaths, v as buildLegacyBundledRootPath } from "./discovery-KmR2BWJK.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { l as tryReadJsonSync } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-DItVECdo.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata } from "./manifest-DFeZvDdx.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { r as official_external_provider_catalog_default } from "./official-external-plugin-bundled-catalogs-CgQNgVtn.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { _ as safeHashFile, a as loadInstalledPluginIndexWithDiscovery, d as resolvePluginDoctorContractArtifactPath, g as safeFileSignature, l as hasOptionalMissingPluginManifestFile, m as hashJson, n as hasInstalledPluginIndexWorkspaceScopeMismatch, p as resolveInstalledPluginIndexPolicyHash, r as isInstalledPluginEnabled, t as getInstalledPluginRecord, v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-Cr71VmpU.js";
import { n as resolveActivePluginInstallRoots } from "./install-root-context-GQzXSH_D.js";
import { n as resolvePluginSourceRoots } from "./roots-Cb7EhqtT.js";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { n as loadPluginManifestRegistryCore, s as loadInstalledPluginIndexInstallRecordsSync } from "./manifest-registry-DqYRJvWI.js";
import { f as hasConfigPathActivationMetadataMigration, i as refreshPersistedInstalledPluginIndex, p as hasMissingConfigPathActivationMetadata, r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-7GzEHL03.js";
import { n as resolveInstalledManifestRegistryIndexFingerprint, t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-CSTRdAYO.js";
import { o as measureDiagnosticsTimelineSpanSync, r as getActiveDiagnosticsTimelineSpan } from "./diagnostics-timeline-DhDccUEp.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-DGIHVL5k.js";
import { r as registerPluginMetadataSnapshotReaders, t as adoptCurrentPluginMetadataSnapshotIfAbsentRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { d as serializePluginIdScope, i as isCurrentPluginMetadataSnapshotRuntimeGeneration, n as getCurrentPluginMetadataSnapshot, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BkM5PRVy.js";
import { t as hasMissingInstalledPluginOwnerMetadata } from "./installed-plugin-package-ownership-JNsP8Eri.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/installed-plugin-index-invalidation.ts
function diffInstalledPluginIndexInvalidationReasons(previous, current) {
	const reasons = /* @__PURE__ */ new Set();
	if (previous.version !== current.version) reasons.add("missing");
	if (previous.hostContractVersion !== current.hostContractVersion) reasons.add("host-contract-changed");
	if (previous.compatRegistryVersion !== current.compatRegistryVersion) reasons.add("compat-registry-changed");
	if (previous.migrationVersion !== current.migrationVersion) reasons.add("migration");
	if (previous.policyHash !== current.policyHash) reasons.add("policy-changed");
	if (hashJson(previous.installRecords ?? {}) !== hashJson(current.installRecords ?? {})) reasons.add("source-changed");
	const previousByPluginId = new Map(previous.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const currentByPluginId = new Map(current.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const [pluginId, previousPlugin] of previousByPluginId) {
		const currentPlugin = currentByPluginId.get(pluginId);
		if (!currentPlugin) {
			reasons.add("source-changed");
			continue;
		}
		if (previousPlugin.rootDir !== currentPlugin.rootDir || previousPlugin.manifestPath !== currentPlugin.manifestPath || previousPlugin.source !== currentPlugin.source || previousPlugin.setupSource !== currentPlugin.setupSource || resolveInstalledPluginIndexInstallOwner(previousPlugin) !== resolveInstalledPluginIndexInstallOwner(currentPlugin) || isInstalledPluginIndexInstallOwnerAmbiguous(previousPlugin) !== isInstalledPluginIndexInstallOwnerAmbiguous(currentPlugin) || previousPlugin.installRecordHash !== currentPlugin.installRecordHash) reasons.add("source-changed");
		if (previousPlugin.enabled !== currentPlugin.enabled) reasons.add("policy-changed");
		if (hasConfigPathActivationMetadataMigration({
			previous: previousPlugin,
			current: currentPlugin
		})) reasons.add("migration");
		if (previousPlugin.manifestHash !== currentPlugin.manifestHash || previousPlugin.doctorContractHash !== currentPlugin.doctorContractHash) reasons.add("stale-manifest");
		if (previousPlugin.packageVersion !== currentPlugin.packageVersion || previousPlugin.packageJson?.path !== currentPlugin.packageJson?.path || previousPlugin.packageJson?.hash !== currentPlugin.packageJson?.hash) reasons.add("stale-package");
	}
	for (const pluginId of currentByPluginId.keys()) if (!previousByPluginId.has(pluginId)) {
		if (currentByPluginId.get(pluginId)?.enabled === false) continue;
		reasons.add("source-changed");
	}
	return Array.from(reasons).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/official-external-provider-endpoints.ts
/**
* Provider endpoint metadata for officially externalized provider plugins.
*
* Endpoint classification (SSRF, attribution, payload-compat policy) keys off
* base URLs and must keep working when the owning plugin is not installed:
* dist packages exclude externalized plugins, so their manifests are invisible
* to bundled discovery. Only the repo-bundled catalog JSON feeds this table;
* hosted marketplace feeds must never influence endpoint classification.
* Kept separate from official-external-plugin-catalog.ts so provider
* transports do not pull the ClawHub install/marketplace module graph.
*/
/**
* Lists manifest-shaped catalog metadata blocks that declare provider endpoints.
*
* The catalog mirrors manifests faithfully, including endpoint classes core
* does not (yet) recognize (e.g. deepinfra-native, gmi-native). The endpoint
* reader filters unknown classes exactly as it does for installed manifests,
* so they stay inert instead of complicating the mirror contract.
*/
function listOfficialExternalProviderEndpointManifests() {
	const entries = official_external_provider_catalog_default.entries;
	if (!Array.isArray(entries)) return [];
	const manifests = [];
	for (const entry of entries) {
		if (!isRecord(entry)) continue;
		const manifest = entry[MANIFEST_KEY];
		if (isRecord(manifest) && Array.isArray(manifest.providerEndpoints)) manifests.push(manifest);
	}
	return manifests;
}
//#endregion
//#region src/plugins/plugin-metadata-provider-facts.ts
const PROVIDER_ENDPOINT_CLASSES = new Set("anthropic-public cerebras-native chutes-native deepseek-native github-copilot-native groq-native meta-native mistral-public minimax-native moonshot-native modelstudio-native nvidia-native openai-public openai opencode-native azure-openai openrouter xai-native xiaomi-native zai-native google-generative-ai google-vertex".split(" "));
function normalizeProviderHosts(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string").map((entry) => entry.trim().toLowerCase()).filter(Boolean) : [];
}
function normalizePluginProviderBaseUrl(value) {
	const trimmed = normalizeOptionalString(value);
	const schemeless = trimmed && /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed);
	const url = trimmed ? URL.parse(schemeless ? `https://${trimmed}` : trimmed) : null;
	if (!url || url.protocol !== "http:" && url.protocol !== "https:") return;
	url.hash = "";
	url.search = "";
	return normalizeOptionalLowercaseString(url.toString().replace(/\/+$/, ""));
}
function prepareProviderEndpoints(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isRecord).filter((endpoint) => {
		const endpointClass = normalizeOptionalString(endpoint.endpointClass);
		return endpointClass ? PROVIDER_ENDPOINT_CLASSES.has(endpointClass) : false;
	}).map((endpoint) => {
		const endpointClass = normalizeOptionalString(endpoint.endpointClass);
		const googleVertexRegion = normalizeOptionalString(endpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(endpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		return Object.assign({
			endpointClass,
			hosts: normalizeProviderHosts(endpoint.hosts),
			hostSuffixes: normalizeProviderHosts(endpoint.hostSuffixes),
			baseUrls: normalizeProviderHosts(endpoint.baseUrls).map(normalizePluginProviderBaseUrl).filter((baseUrl) => baseUrl !== void 0)
		}, googleVertexRegion ? { googleVertexRegion } : {}, googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {});
	});
}
function buildPluginMetadataProviderFacts(plugins) {
	const providerEndpoints = plugins.flatMap((plugin) => prepareProviderEndpoints(plugin.providerEndpoints));
	const providerRequests = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		const requests = isRecord(plugin.providerRequest?.providers) ? plugin.providerRequest.providers : {};
		for (const [rawProvider, request] of Object.entries(requests)) {
			if (!isRecord(request)) continue;
			const provider = normalizeLowercaseStringOrEmpty(rawProvider);
			if (!provider) continue;
			const supportsStreamingUsage = isRecord(request.openAICompletions) ? request.openAICompletions.supportsStreamingUsage : void 0;
			providerRequests.set(provider, {
				...normalizeOptionalString(request.family) ? { family: normalizeOptionalString(request.family) } : {},
				...normalizeOptionalString(request.compatibilityFamily) === "moonshot" ? { compatibilityFamily: "moonshot" } : {},
				...typeof supportsStreamingUsage === "boolean" ? { openAICompletions: { supportsStreamingUsage } } : {}
			});
		}
	}
	for (const manifest of listOfficialExternalProviderEndpointManifests()) providerEndpoints.push(...prepareProviderEndpoints(manifest.providerEndpoints));
	return {
		providerEndpoints,
		providerRequests
	};
}
//#endregion
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
function resolveControlPlaneRegistryParams(params) {
	if (!params.config) return params;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir
	});
	const diagnostics = appendPluginControlPlaneWorkspaceDiagnostic(params.diagnostics ?? [], workspace);
	return {
		...params,
		...diagnostics.length > 0 ? { diagnostics } : {},
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
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
async function inspectPluginRegistry(params = {}) {
	const inspectionParams = resolveControlPlaneRegistryParams(params);
	const persisted = readPersistedInstalledPluginIndexSync(inspectionParams);
	const result = loadPluginRegistrySnapshotWithMetadata({
		...inspectionParams,
		allowCurrent: false
	});
	if (!persisted) return {
		state: "missing",
		refreshReasons: ["missing"],
		persisted: null,
		current: result.snapshot
	};
	const fresh = result.source === "persisted";
	const refreshReasons = fresh ? [] : [...diffInstalledPluginIndexInvalidationReasons(persisted, result.snapshot)];
	if (!fresh && refreshReasons.length === 0) refreshReasons.push(result.diagnostics.some((diagnostic) => diagnostic.code === "persisted-registry-stale-policy") ? "policy-changed" : "source-changed");
	return {
		state: fresh ? "fresh" : "stale",
		refreshReasons,
		persisted,
		current: result.snapshot
	};
}
function refreshPluginRegistry(params) {
	if (!params.config) return refreshPersistedInstalledPluginIndex(params);
	return refreshPersistedInstalledPluginIndex(resolveControlPlaneRegistryParams(params));
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"APPDATA",
	"HOME",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
	"OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"OPENCLAW_HOME",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_STATE_DIR",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
function pickPluginMetadataEnv(env) {
	return Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
		const value = env[key];
		return value === void 0 ? [] : [[key, value]];
	}));
}
function resolvePluginMetadataEnvFingerprint(env) {
	return hashJson({
		env: pickPluginMetadataEnv(env),
		installRoots: resolveActivePluginInstallRoots(env)
	});
}
function throwReadonlyPluginMetadataMutation() {
	throw new TypeError("Plugin metadata snapshots are immutable");
}
function freezeSnapshotValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	if (value instanceof Map) {
		for (const [key, entry] of value) {
			freezeSnapshotValue(key, seen);
			freezeSnapshotValue(entry, seen);
		}
		Object.defineProperties(value, {
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation },
			set: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	if (value instanceof Set) {
		for (const entry of value) freezeSnapshotValue(entry, seen);
		Object.defineProperties(value, {
			add: { value: throwReadonlyPluginMetadataMutation },
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	for (const entry of Object.values(value)) freezeSnapshotValue(entry, seen);
	return Object.freeze(value);
}
function indexesMatch(left, right) {
	if (!left || !right) return true;
	return resolveInstalledManifestRegistryIndexFingerprint(left) === resolveInstalledManifestRegistryIndexFingerprint(right);
}
/** Restores process-local behavior and immutability after a snapshot crosses a worker boundary. */
function restorePluginMetadataSnapshot(snapshot) {
	return freezeSnapshotValue({
		...snapshot,
		normalizePluginId: createPluginRegistryIdNormalizer(snapshot.index, { manifestRegistry: snapshot.manifestRegistry })
	});
}
function resolvePluginMetadataSnapshotPluginIds(params) {
	const direct = normalizePluginIdScope(params.params.pluginIds);
	if (direct !== void 0) return direct;
	return normalizePluginIdScope(params.params.pluginIdScope?.resolve({ index: params.index }));
}
function isPluginMetadataSnapshotCompatible(params) {
	const env = params.env ?? process.env;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds);
	const snapshotPluginIds = normalizePluginIdScope(params.snapshot.pluginIds);
	return (snapshotPluginIds === void 0 || params.allowScopedSnapshot === true || requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) === serializePluginIdScope(requestedPluginIds)) && params.snapshot.policyHash === resolveInstalledPluginIndexPolicyHash(params.config) && (!params.snapshot.configFingerprint || params.snapshot.configFingerprint === resolvePluginControlPlaneFingerprint({
		config: params.config,
		env,
		index: params.index ?? params.snapshot.index,
		policyHash: params.snapshot.policyHash,
		workspaceDir: params.workspaceDir
	})) && (params.snapshot.workspaceDir ?? "") === (params.workspaceDir ?? "") && indexesMatch(params.snapshot.index, params.index);
}
function appendOwner(owners, ownedId, pluginId) {
	const existing = owners.get(ownedId);
	if (existing) {
		if (existing.includes(pluginId)) return;
		existing.push(pluginId);
		return;
	}
	owners.set(ownedId, [pluginId]);
}
function freezeOwnerMap(owners) {
	return new Map([...owners.entries()].map(([ownedId, pluginIds]) => [ownedId, Object.freeze([...pluginIds])]));
}
function buildPluginMetadataOwnerMaps(plugins) {
	const channels = /* @__PURE__ */ new Map();
	const channelConfigs = /* @__PURE__ */ new Map();
	const providers = /* @__PURE__ */ new Map();
	const modelCatalogProviders = /* @__PURE__ */ new Map();
	const cliBackends = /* @__PURE__ */ new Map();
	const setupProviders = /* @__PURE__ */ new Map();
	const commandAliases = /* @__PURE__ */ new Map();
	const contracts = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		for (const channelId of plugin.channels ?? []) appendOwner(channels, channelId, plugin.id);
		for (const channelId of Object.keys(plugin.channelConfigs ?? {})) appendOwner(channelConfigs, channelId, plugin.id);
		for (const providerId of plugin.providers ?? []) appendOwner(providers, providerId, plugin.id);
		for (const [rawAlias, target] of Object.entries(plugin.providerAuthAliases ?? {})) {
			const alias = normalizeProviderId(rawAlias);
			const targetProvider = normalizeProviderId(target);
			if (alias && targetProvider && (plugin.providers ?? []).some((providerId) => normalizeProviderId(providerId) === targetProvider)) appendOwner(providers, alias, plugin.id);
		}
		for (const providerId of Object.keys(plugin.modelCatalog?.providers ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
		for (const providerId of Object.keys(plugin.modelCatalog?.aliases ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
		for (const cliBackendId of plugin.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
		for (const cliBackendId of plugin.setup?.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
		for (const setupProvider of plugin.setup?.providers ?? []) appendOwner(setupProviders, setupProvider.id, plugin.id);
		for (const commandAlias of plugin.commandAliases ?? []) appendOwner(commandAliases, commandAlias.name, plugin.id);
		for (const [contract, values] of Object.entries(plugin.contracts ?? {})) if (Array.isArray(values) && values.length > 0) appendOwner(contracts, contract, plugin.id);
	}
	return {
		channels: freezeOwnerMap(channels),
		channelConfigs: freezeOwnerMap(channelConfigs),
		providers: freezeOwnerMap(providers),
		modelCatalogProviders: freezeOwnerMap(modelCatalogProviders),
		cliBackends: freezeOwnerMap(cliBackends),
		setupProviders: freezeOwnerMap(setupProviders),
		commandAliases: freezeOwnerMap(commandAliases),
		contracts: freezeOwnerMap(contracts),
		...buildPluginMetadataProviderFacts(plugins)
	};
}
function listPluginOriginsFromMetadataSnapshot(snapshot) {
	return new Map(snapshot.plugins.map((record) => [record.id, record.origin]));
}
/** Rebuilds every manifest-derived snapshot fact from one authoritative registry. */
function rebasePluginMetadataSnapshotManifestRegistry(snapshot, manifestRegistry) {
	const plugins = manifestRegistry.plugins;
	return {
		...snapshot,
		manifestRegistry,
		plugins,
		diagnostics: manifestRegistry.diagnostics,
		byPluginId: new Map(plugins.map((plugin) => [plugin.id, plugin])),
		normalizePluginId: snapshot.index ? createPluginRegistryIdNormalizer(snapshot.index, { manifestRegistry }) : snapshot.normalizePluginId,
		owners: buildPluginMetadataOwnerMaps(plugins),
		...snapshot.metrics ? { metrics: {
			...snapshot.metrics,
			manifestPluginCount: plugins.length
		} } : {}
	};
}
function loadPluginMetadataSnapshot(params) {
	const activeTimelineSpan = getActiveDiagnosticsTimelineSpan();
	const snapshot = measureDiagnosticsTimelineSpanSync("plugins.metadata.scan", () => loadPluginMetadataSnapshotImpl(params), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			hasWorkspaceDir: params.workspaceDir !== void 0,
			hasInstalledIndex: params.index !== void 0
		}
	});
	return measureDiagnosticsTimelineSpanSync("plugins.metadata.freeze", () => restorePluginMetadataSnapshot(snapshot), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			indexPluginCount: snapshot.index.plugins.length,
			manifestPluginCount: snapshot.plugins.length
		}
	});
}
/** Promotes a planning-scoped graph to the complete process-lifecycle metadata snapshot. */
function completePluginMetadataSnapshot(params) {
	if (!params.snapshot || params.snapshot.pluginIds === void 0) return params.snapshot;
	const workspaceDir = params.workspaceDir ?? params.snapshot.workspaceDir;
	const manifestStartedAt = performance.now();
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index: params.snapshot.index,
		config: params.config,
		env: params.env ?? process.env,
		...workspaceDir ? { workspaceDir } : {},
		includeDisabled: true
	});
	const manifestRegistryMs = performance.now() - manifestStartedAt;
	const completed = rebasePluginMetadataSnapshotManifestRegistry(params.snapshot, manifestRegistry);
	const { pluginIds: _pluginIds, ...unscoped } = completed;
	return freezeSnapshotValue({
		...unscoped,
		configFingerprint: resolvePluginControlPlaneFingerprint({
			config: params.config,
			env: params.env,
			index: completed.index,
			policyHash: completed.policyHash,
			workspaceDir
		}),
		metrics: {
			...completed.metrics,
			manifestRegistryMs,
			totalMs: completed.metrics.totalMs + manifestRegistryMs
		}
	});
}
function resolvePluginMetadataSnapshot(params) {
	if (params.allowCurrent !== false && params.stateDir === void 0 && params.preferPersisted !== false) {
		const current = getCurrentPluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.config === void 0 ? { requireDefaultDiscoveryContext: true } : {},
			...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
			...params.pluginIdScope !== void 0 ? { pluginIdScope: params.pluginIdScope } : {},
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent === true ? { allowWorkspaceScopedSnapshot: true } : {}
		});
		if (!current) {
			const snapshot = loadPluginMetadataSnapshot(params);
			if (params.index === void 0 && params.workspaceDir === void 0 && params.pluginIds === void 0 && params.pluginIdScope === void 0 && snapshot.workspaceDir === void 0 && snapshot.pluginIds === void 0) adoptCurrentPluginMetadataSnapshotIfAbsentRuntime(snapshot, params);
			return snapshot;
		}
		if (!params.index || isCurrentPluginMetadataSnapshotRuntimeGeneration(current)) return current;
		if (isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config: params.config,
			env: params.env,
			allowScopedSnapshot: params.pluginIds !== void 0 || params.pluginIdScope !== void 0,
			workspaceDir: params.workspaceDir ?? (params.allowWorkspaceScopedCurrent === true ? current.workspaceDir : void 0),
			index: params.index
		})) return current;
	}
	return loadPluginMetadataSnapshot(params);
}
function loadPluginMetadataSnapshotImpl(params) {
	const totalStartedAt = performance.now();
	const registryStartedAt = performance.now();
	const registryResult = loadPluginRegistrySnapshotWithMetadata({
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		env: params.env,
		...params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {},
		...params.allowCurrent !== void 0 ? { allowCurrent: params.allowCurrent } : {},
		...params.index ? { index: params.index } : {}
	});
	const registrySnapshotMs = performance.now() - registryStartedAt;
	const index = structuredClone(registryResult.snapshot);
	index.diagnostics ??= [];
	const pluginIds = resolvePluginMetadataSnapshotPluginIds({
		params,
		index
	});
	const manifestStartedAt = performance.now();
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index,
		...registryResult.manifestRegistry ? { manifestRegistry: registryResult.manifestRegistry } : {},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...pluginIds !== void 0 ? { pluginIds } : {},
		includeDisabled: true
	});
	const manifestRegistryMs = performance.now() - manifestStartedAt;
	const byPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	const ownerMapsStartedAt = performance.now();
	const owners = buildPluginMetadataOwnerMaps(manifestRegistry.plugins);
	const ownerMapsMs = performance.now() - ownerMapsStartedAt;
	const totalMs = performance.now() - totalStartedAt;
	return {
		policyHash: index.policyHash,
		registrySource: registryResult.source,
		configFingerprint: resolvePluginControlPlaneFingerprint({
			config: params.config,
			env: params.env,
			index,
			policyHash: index.policyHash,
			workspaceDir: params.workspaceDir
		}),
		...pluginIds !== void 0 ? { pluginIds } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		index,
		registryDiagnostics: registryResult.diagnostics,
		manifestRegistry,
		plugins: manifestRegistry.plugins,
		diagnostics: manifestRegistry.diagnostics,
		byPluginId,
		owners,
		metrics: {
			registrySnapshotMs,
			manifestRegistryMs,
			ownerMapsMs,
			totalMs,
			indexPluginCount: index.plugins.length,
			manifestPluginCount: manifestRegistry.plugins.length
		},
		discovery: registryResult.discovery
	};
}
registerPluginMetadataSnapshotReaders({ resolvePluginMetadataSnapshot });
//#endregion
export { diffInstalledPluginIndexInvalidationReasons as _, rebasePluginMetadataSnapshotManifestRegistry as a, restorePluginMetadataSnapshot as c, isPluginEnabled as d, loadPluginRegistrySnapshot as f, normalizePluginProviderBaseUrl as g, createPluginRegistryIdNormalizer as h, loadPluginMetadataSnapshot as i, getPluginRecord as l, refreshPluginRegistry as m, isPluginMetadataSnapshotCompatible as n, resolvePluginMetadataEnvFingerprint as o, loadPluginRegistrySnapshotWithMetadata as p, listPluginOriginsFromMetadataSnapshot as r, resolvePluginMetadataSnapshot as s, completePluginMetadataSnapshot as t, inspectPluginRegistry as u };
