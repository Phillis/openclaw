import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as normalizeOptionalTrimmedStringList, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside, m as safeStatSync, p as safeRealpathSync } from "./path-D138yf8v.js";
import { n as discoverOpenClawPlugins, p as resolvePluginCandidateInstallOwner, u as isPluginCandidateInstallOwnerAmbiguous } from "./discovery-C2Bhkw0t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import "./path-safety-Dv61TTin.js";
import { t as isBundledPluginInsideDevSourceRoot } from "./dev-source-root-CT9MMgJk.js";
import { c as normalizeManifestChannelCommandDefaults, n as isCoreReservedPluginId, r as loadPluginManifest } from "./manifest-BmA-DH7w.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { a as toPluginActivationState, c as normalizePluginsConfigWithResolverCore, i as resolvePluginActivationDecisionShared, o as identityNormalizePluginId, s as isBundledChannelEnabledByChannelConfig$1 } from "./config-activation-shared-CdWoIbbr.js";
import { s as resolveCompatibilityHostVersion } from "./version-o4XN9fka.js";
import { o as loadBundleManifest } from "./bundle-manifest-BxBJbko_.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-B91t3pWa.js";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-BQXdZhrB.js";
import { r as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-PWJi_KhT.js";
import { t as checkMinHostVersion } from "./min-host-version-B63loSc6.js";
import { _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, o as getOfficialExternalPluginCatalogManifest, v as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-CDrgEY7c.js";
import { r as resolveTrustedSourceLinkedOfficialClawHubInstall } from "./official-external-install-records-CyycXr7u.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/manifest-install-owner.ts
const PLUGIN_MANIFEST_INSTALL_OWNER = Symbol.for("openclaw.pluginManifestInstallOwner");
function recordPluginManifestInstallOwner(record, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return record;
	Object.defineProperty(record, PLUGIN_MANIFEST_INSTALL_OWNER, {
		configurable: false,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return record;
}
function readPluginManifestInstallOwner(record) {
	return record[PLUGIN_MANIFEST_INSTALL_OWNER];
}
function resolvePluginManifestInstallOwner(record) {
	return readPluginManifestInstallOwner(record)?.installOwner;
}
function isPluginManifestInstallOwnerAmbiguous(record) {
	return readPluginManifestInstallOwner(record)?.ambiguous === true;
}
//#endregion
//#region src/plugins/config-policy.ts
function normalizePluginsConfigWithResolver(config, normalizePluginId = identityNormalizePluginId) {
	return normalizePluginsConfigWithResolverCore(config, normalizePluginId);
}
function resolvePluginActivationState(params) {
	return toPluginActivationState(resolvePluginActivationDecisionShared({
		...params,
		activationSource: {
			plugins: params.sourceConfig ?? params.config,
			rootConfig: params.sourceRootConfig ?? params.rootConfig
		},
		isBundledChannelEnabledByChannelConfig
	}));
}
const isBundledChannelEnabledByChannelConfig = isBundledChannelEnabledByChannelConfig$1;
function resolvePolicyPluginActivationState(params) {
	return resolvePluginActivationState(params);
}
//#endregion
//#region src/plugins/manifest-registry.ts
function resolvePluginSourcePath(sourcePath) {
	if (fs.existsSync(sourcePath)) return sourcePath;
	if (sourcePath.endsWith(".ts")) {
		const jsPath = sourcePath.slice(0, -3) + ".js";
		if (fs.existsSync(jsPath)) return jsPath;
	}
	return sourcePath;
}
function isPluginRootPath(params) {
	const resolvedTargetPath = path.resolve(params.targetPath);
	if (!isPathInside(path.resolve(params.rootPath), resolvedTargetPath)) return false;
	const targetRealPath = safeRealpathSync(resolvedTargetPath, params.realpathCache);
	if (!targetRealPath) return params.targetMustExist !== true;
	if (!isPathInside(params.rootRealPath, targetRealPath)) return false;
	if (params.rejectHardlinks === true) {
		const targetStat = safeStatSync(resolvedTargetPath);
		if (!targetStat || targetStat.nlink > 1) return false;
	}
	return true;
}
function resolveManifestPluginSourcePath(params) {
	const pushDiagnostic = () => {
		params.diagnostics.push({
			level: "warn",
			pluginId: sanitizeForLog(params.pluginId),
			source: sanitizeForLog(params.manifestPath),
			message: `plugin manifest ${params.entryName} must resolve inside the plugin root; ignoring entry`
		});
	};
	if (path.isAbsolute(params.entry)) {
		pushDiagnostic();
		return;
	}
	const rootPath = path.resolve(params.rootDir);
	const rootRealPath = safeRealpathSync(rootPath, params.realpathCache) ?? rootPath;
	const sourcePath = path.resolve(rootPath, params.entry);
	if (!isPluginRootPath({
		rootPath,
		targetPath: sourcePath,
		rootRealPath,
		realpathCache: params.realpathCache,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: fs.existsSync(sourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	const resolvedSourcePath = resolvePluginSourcePath(sourcePath);
	if (!isPluginRootPath({
		rootPath,
		targetPath: resolvedSourcePath,
		rootRealPath,
		realpathCache: params.realpathCache,
		rejectHardlinks: params.rejectHardlinks,
		targetMustExist: fs.existsSync(resolvedSourcePath)
	})) {
		pushDiagnostic();
		return;
	}
	return resolvedSourcePath;
}
const PLUGIN_ORIGIN_RANK = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function rejectCaseFoldedIdCollisions(records, diagnostics) {
	const recordsByPolicyId = /* @__PURE__ */ new Map();
	for (const record of records) {
		const policyId = normalizePluginPolicyId(record.id);
		const matches = recordsByPolicyId.get(policyId) ?? [];
		matches.push(record);
		recordsByPolicyId.set(policyId, matches);
	}
	const rejected = /* @__PURE__ */ new Set();
	for (const [policyId, matches] of recordsByPolicyId) {
		const declaredIds = [...new Set(matches.map((record) => record.id))].toSorted();
		if (declaredIds.length < 2) continue;
		const message = `plugin ids ${declaredIds.map((id) => JSON.stringify(id)).join(", ")} collide as normalized id ${JSON.stringify(policyId)}; refusing all colliding plugins`;
		for (const record of matches) {
			rejected.add(record);
			diagnostics.push({
				level: "error",
				pluginId: record.id,
				source: record.source,
				message
			});
		}
	}
	return records.filter((record) => !rejected.has(record));
}
function safeStatMtimeMs(filePath) {
	try {
		return fs.statSync(filePath).mtimeMs;
	} catch {
		return null;
	}
}
function normalizePreferredPluginIds(raw) {
	return normalizeOptionalTrimmedStringList(raw);
}
function mergePackageChannelMetaIntoChannelConfigs(params) {
	const channelId = params.packageChannel?.id?.trim();
	if (!channelId || isBlockedObjectKey(channelId) || !params.channelConfigs || !Object.hasOwn(params.channelConfigs, channelId)) return params.channelConfigs;
	const existing = params.channelConfigs[channelId];
	if (!existing) return params.channelConfigs;
	const label = existing.label ?? normalizeOptionalString(params.packageChannel?.label) ?? "";
	const description = existing.description ?? normalizeOptionalString(params.packageChannel?.blurb) ?? "";
	const preferOver = existing.preferOver ?? normalizePreferredPluginIds(params.packageChannel?.preferOver);
	const commands = existing.commands ?? normalizeManifestChannelCommandDefaults(params.packageChannel?.commands);
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.channelConfigs)) if (!isBlockedObjectKey(key)) merged[key] = value;
	merged[channelId] = {
		...existing,
		...label ? { label } : {},
		...description ? { description } : {},
		...preferOver?.length ? { preferOver } : {},
		...commands ? { commands } : {}
	};
	return merged;
}
function mergeContractLists(left, right) {
	const merged = uniqueStrings([...left ?? [], ...right ?? []].map((value) => value.trim()).filter((value) => value.length > 0));
	return merged.length > 0 ? merged : void 0;
}
function mergeManifestContracts(manifestContracts, catalogContracts) {
	if (!catalogContracts) return manifestContracts;
	const contracts = {};
	for (const key of [
		"embeddedExtensionFactories",
		"agentToolResultMiddleware",
		"trustedToolPolicies",
		"externalAuthProviders",
		"embeddingProviders",
		"memoryEmbeddingProviders",
		"speechProviders",
		"realtimeTranscriptionProviders",
		"realtimeVoiceProviders",
		"mediaUnderstandingProviders",
		"transcriptSourceProviders",
		"documentExtractors",
		"imageGenerationProviders",
		"videoGenerationProviders",
		"musicGenerationProviders",
		"webContentExtractors",
		"webFetchProviders",
		"webSearchProviders",
		"workerProviders",
		"usageProviders",
		"migrationProviders",
		"gatewayMethodDispatch",
		"tools"
	]) {
		const merged = mergeContractLists(manifestContracts?.[key], catalogContracts[key]);
		if (merged) contracts[key] = merged;
	}
	return Object.keys(contracts).length > 0 ? contracts : void 0;
}
function mergeCatalogChannelConfigs(params) {
	if (!params.catalogChannelConfigs) return params.manifestChannelConfigs;
	const merged = Object.create(null);
	for (const [key, value] of Object.entries(params.catalogChannelConfigs)) if (!isBlockedObjectKey(key)) merged[key] = value;
	for (const [key, value] of Object.entries(params.manifestChannelConfigs ?? {})) if (!isBlockedObjectKey(key)) {
		const catalogValue = merged[key];
		merged[key] = catalogValue ? {
			...catalogValue,
			...value,
			schema: value.schema ?? catalogValue.schema,
			...catalogValue.uiHints || value.uiHints ? { uiHints: {
				...catalogValue.uiHints,
				...value.uiHints
			} } : {},
			...value.runtime ?? catalogValue.runtime ? { runtime: value.runtime ?? catalogValue.runtime } : {},
			...value.label ?? catalogValue.label ? { label: value.label ?? catalogValue.label } : {},
			...value.description ?? catalogValue.description ? { description: value.description ?? catalogValue.description } : {},
			...value.preferOver ?? catalogValue.preferOver ? { preferOver: value.preferOver ?? catalogValue.preferOver } : {},
			...value.commands ?? catalogValue.commands ? { commands: value.commands ?? catalogValue.commands } : {}
		} : value;
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeManifestCatalog(manifestCatalog, officialCatalog) {
	const featuredCandidate = manifestCatalog?.featured ?? officialCatalog?.featured;
	const orderCandidate = manifestCatalog?.order ?? officialCatalog?.order;
	const featured = typeof featuredCandidate === "boolean" ? featuredCandidate : void 0;
	const order = typeof orderCandidate === "number" && Number.isFinite(orderCandidate) ? orderCandidate : void 0;
	if (featured === void 0 && order === void 0) return;
	return {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function buildRecord(params) {
	const pluginId = params.candidate.effectivePluginId ?? params.manifest.id;
	const providerSourceEntry = params.manifest.providerCatalogEntry !== void 0 ? {
		entryName: "providerCatalogEntry",
		entry: params.manifest.providerCatalogEntry
	} : void 0;
	const manifestChannelConfigs = params.candidate.origin === "bundled" && params.bundledChannelConfigCollector ? params.bundledChannelConfigCollector({
		pluginDir: params.candidate.packageDir ?? params.candidate.rootDir,
		manifest: params.manifest,
		packageManifest: params.candidate.packageManifest
	}) : params.manifest.channelConfigs;
	const officialCatalogManifest = params.candidate.origin !== "bundled" ? getOfficialExternalPluginCatalogManifest(getOfficialExternalPluginCatalogEntryForPackage(params.candidate.packageName) ?? {}) : void 0;
	const channelConfigs = mergePackageChannelMetaIntoChannelConfigs({
		channelConfigs: mergeCatalogChannelConfigs({
			manifestChannelConfigs,
			catalogChannelConfigs: officialCatalogManifest?.channelConfigs
		}),
		packageChannel: params.candidate.packageManifest?.channel
	});
	const packageChannelCommands = normalizeManifestChannelCommandDefaults(params.candidate.packageManifest?.channel?.commands);
	return {
		id: pluginId,
		doctorContract: params.manifest.doctorContract,
		sessionRouteStateOwners: params.manifest.sessionRouteStateOwners,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.packageName,
		description: normalizeOptionalString(params.manifest.description) ?? params.candidate.packageDescription,
		catalog: mergeManifestCatalog(params.manifest.catalog, officialCatalogManifest?.catalog),
		icon: normalizeOptionalString(params.manifest.icon),
		version: normalizeOptionalString(params.manifest.version) ?? params.candidate.packageVersion,
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		enabledByDefault: params.manifest.enabledByDefault === true ? true : void 0,
		enabledByDefaultOnPlatforms: params.manifest.enabledByDefaultOnPlatforms,
		autoEnableWhenConfiguredProviders: params.manifest.autoEnableWhenConfiguredProviders,
		legacyPluginIds: params.manifest.legacyPluginIds,
		format: params.candidate.format ?? "openclaw",
		bundleFormat: params.candidate.bundleFormat,
		kind: params.manifest.kind,
		channels: params.manifest.channels ?? [],
		providers: params.manifest.providers ?? [],
		providerDiscoverySource: providerSourceEntry ? resolveManifestPluginSourcePath({
			rootDir: params.candidate.rootDir,
			manifestPath: params.manifestPath,
			pluginId,
			entryName: providerSourceEntry.entryName,
			entry: providerSourceEntry.entry,
			rejectHardlinks: params.rejectHardlinks,
			diagnostics: params.diagnostics,
			realpathCache: params.realpathCache
		}) : void 0,
		modelSupport: params.manifest.modelSupport,
		modelCatalog: params.manifest.modelCatalog,
		modelPricing: params.manifest.modelPricing,
		modelIdNormalization: params.manifest.modelIdNormalization,
		providerEndpoints: params.manifest.providerEndpoints,
		providerRequest: params.manifest.providerRequest,
		secretProviderIntegrations: params.manifest.secretProviderIntegrations,
		cliBackends: params.manifest.cliBackends ?? [],
		syntheticAuthRefs: params.manifest.syntheticAuthRefs ?? [],
		nonSecretAuthMarkers: params.manifest.nonSecretAuthMarkers ?? [],
		commandAliases: params.manifest.commandAliases,
		providerUsageAuthEnvVars: params.manifest.providerUsageAuthEnvVars,
		providerAuthAliases: params.manifest.providerAuthAliases,
		providerAuthChoices: params.manifest.providerAuthChoices,
		activation: params.manifest.activation,
		setup: params.manifest.setup,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		trustedOfficialInstall: params.trustedOfficialInstall === true ? true : void 0,
		qaRunners: params.manifest.qaRunners,
		dashboard: params.manifest.dashboard,
		mcpServers: params.manifest.mcpServers,
		skills: params.manifest.skills ?? [],
		settingsFiles: [],
		hooks: [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		setupSource: params.candidate.setupSource,
		manifestPath: params.manifestPath,
		schemaCacheKey: params.schemaCacheKey,
		configSchema: params.configSchema,
		configUiHints: params.manifest.uiHints,
		contracts: mergeManifestContracts(params.manifest.contracts, officialCatalogManifest?.contracts),
		mediaUnderstandingProviderMetadata: params.manifest.mediaUnderstandingProviderMetadata,
		imageGenerationProviderMetadata: params.manifest.imageGenerationProviderMetadata,
		videoGenerationProviderMetadata: params.manifest.videoGenerationProviderMetadata,
		musicGenerationProviderMetadata: params.manifest.musicGenerationProviderMetadata,
		toolMetadata: params.manifest.toolMetadata,
		configContracts: params.manifest.configContracts,
		channelConfigs,
		...params.candidate.packageManifest?.channel?.id ? { channelCatalogMeta: {
			id: params.candidate.packageManifest.channel.id,
			...typeof params.candidate.packageManifest.channel.label === "string" ? { label: params.candidate.packageManifest.channel.label } : {},
			...typeof params.candidate.packageManifest.channel.blurb === "string" ? { blurb: params.candidate.packageManifest.channel.blurb } : {},
			...params.candidate.packageManifest.channel.preferOver ? { preferOver: params.candidate.packageManifest.channel.preferOver } : {},
			...packageChannelCommands ? { commands: packageChannelCommands } : {}
		} } : {}
	};
}
function buildBundleRecord(params) {
	return {
		id: params.manifest.id,
		name: normalizeOptionalString(params.manifest.name) ?? params.candidate.idHint,
		description: normalizeOptionalString(params.manifest.description),
		version: normalizeOptionalString(params.manifest.version),
		packageName: params.candidate.packageName,
		packageVersion: params.candidate.packageVersion,
		packageDescription: params.candidate.packageDescription,
		packageManifest: params.candidate.packageManifest,
		packageDependencies: params.candidate.packageDependencies,
		packageOptionalDependencies: params.candidate.packageOptionalDependencies,
		packageChannel: params.candidate.packageManifest?.channel,
		packageInstall: params.candidate.packageManifest?.install,
		format: "bundle",
		bundleFormat: params.candidate.bundleFormat,
		bundleCapabilities: params.manifest.capabilities,
		activation: params.manifest.activation,
		channels: [],
		providers: [],
		cliBackends: [],
		syntheticAuthRefs: [],
		nonSecretAuthMarkers: [],
		skills: params.manifest.skills ?? [],
		settingsFiles: params.manifest.settingsFiles ?? [],
		hooks: params.manifest.hooks ?? [],
		origin: params.candidate.origin,
		workspaceDir: params.candidate.workspaceDir,
		rootDir: params.candidate.rootDir,
		source: params.candidate.source,
		manifestPath: params.manifestPath,
		schemaCacheKey: void 0,
		configSchema: void 0,
		configUiHints: void 0,
		configContracts: void 0,
		channelConfigs: void 0
	};
}
function pushNonBundledChannelConfigDescriptorDiagnostic(params) {
	if (params.record.origin === "bundled" || params.record.format === "bundle") return;
	const configuredEntry = params.normalized?.entries[params.record.id];
	if (params.normalized?.enabled === false || configuredEntry?.enabled === false || params.normalized?.deny.includes(params.record.id) || params.normalized?.allow.length && !params.normalized.allow.includes(params.record.id)) return;
	const declaredChannels = params.record.channels.map((channelId) => channelId.trim()).filter((channelId) => channelId.length > 0);
	if (declaredChannels.length === 0) return;
	const channelConfigs = params.record.channelConfigs ?? {};
	const missingChannels = declaredChannels.filter((channelId) => !Object.hasOwn(channelConfigs, channelId));
	if (missingChannels.length === 0) return;
	const safeMissingChannels = missingChannels.map(sanitizeForLog);
	params.diagnostics.push({
		level: "warn",
		pluginId: sanitizeForLog(params.record.id),
		source: sanitizeForLog(params.record.manifestPath),
		message: `channel plugin manifest declares ${safeMissingChannels.join(", ")} without channelConfigs metadata; add openclaw.plugin.json#channelConfigs so config schema and setup surfaces work before runtime loads. Channels without channelConfigs still appear in channel listings, but setup UI may be limited.`
	});
}
function pushManifestCompatibilityDiagnostics(params) {
	pushNonBundledChannelConfigDescriptorDiagnostic(params);
}
function dedupePluginDiagnostics(diagnostics) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const diagnostic of diagnostics) {
		const key = JSON.stringify([
			diagnostic.level,
			diagnostic.pluginId ?? "",
			diagnostic.message,
			diagnostic.level === "error" ? diagnostic.source ?? "" : ""
		]);
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(diagnostic);
	}
	return deduped;
}
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const installOwner = resolvePluginCandidateInstallOwner(params.candidate);
	if (installOwner) return Object.hasOwn(params.installRecords, installOwner) ? installOwner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return safeRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return safeRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside(trackedPath, candidatePath) || isPathInside(candidatePath, trackedPath)));
}
function npmSpecMatchesPackage(value, packageName) {
	const normalized = value?.trim();
	if (!normalized) return false;
	if (normalized === packageName) return true;
	return normalized.startsWith(`${packageName}@`);
}
function isTrustedOfficialPluginInstall(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	if (!installOwner || params.candidate.origin !== "global" && params.candidate.origin !== "config" || !matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		env: params.env,
		installRecords: params.installRecords,
		installPathOnly: true
	})) return false;
	const packageName = params.candidate.packageName?.trim();
	if (!packageName) return false;
	const catalogEntry = getOfficialExternalPluginCatalogEntryForPackage(packageName);
	if (!catalogEntry || resolveOfficialExternalPluginId(catalogEntry) !== installOwner) return false;
	const officialInstall = resolveOfficialExternalPluginInstall(catalogEntry);
	const installRecord = params.installRecords[installOwner];
	if (!installRecord) return false;
	const officialClawHubInstall = installRecord.source === "clawhub" ? resolveTrustedSourceLinkedOfficialClawHubInstall({
		pluginId: installOwner,
		record: installRecord
	}) : void 0;
	if (installRecord.source === "npm" && installRecord.artifactKind === void 0 && installRecord.sourcePath === void 0 && officialInstall?.npmSpec === packageName && [
		installRecord.resolvedName,
		installRecord.spec,
		installRecord.resolvedSpec,
		params.candidate.packageName
	].some((value) => npmSpecMatchesPackage(value, packageName))) return true;
	if (installRecord.source === "clawhub" && officialClawHubInstall) return true;
	return false;
}
function resolveDuplicatePrecedenceRank(params) {
	if (params.candidate.origin === "config") return 0;
	if (params.candidate.origin === "bundled" && isBundledPluginInsideDevSourceRoot({
		rootDir: params.candidate.rootDir,
		env: params.env
	})) return 1;
	if (params.candidate.origin === "global" && matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	})) return 2;
	if (params.candidate.origin === "bundled") return 3;
	if (params.candidate.origin === "workspace") return 4;
	return 5;
}
function isIntentionalInstalledBundledDuplicate(params) {
	const leftIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.left,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	const rightIsInstalled = matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.right,
		config: params.config,
		env: params.env,
		installRecords: params.installRecords
	});
	return leftIsInstalled && params.right.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.right.rootDir,
		env: params.env
	}) || rightIsInstalled && params.left.origin === "bundled" && !isBundledPluginInsideDevSourceRoot({
		rootDir: params.left.rootDir,
		env: params.env
	});
}
function isSameGlobalPackageDuplicate(left, right) {
	if (left.origin !== "global" || right.origin !== "global") return false;
	const leftPackageName = normalizeOptionalString(left.packageName);
	const rightPackageName = normalizeOptionalString(right.packageName);
	if (!leftPackageName || leftPackageName !== rightPackageName) return false;
	const leftPackageVersion = normalizeOptionalString(left.packageVersion);
	const rightPackageVersion = normalizeOptionalString(right.packageVersion);
	return Boolean(leftPackageVersion && rightPackageVersion && leftPackageVersion === rightPackageVersion);
}
function loadPluginManifestRegistryCore(params = {}) {
	const config = params.config ?? {};
	const normalized = normalizePluginsConfigWithResolver(config.plugins);
	const env = params.env ?? process.env;
	let installRecords = params.installRecords;
	let installRecordsLoaded = Boolean(params.installRecords);
	const getInstallRecords = () => {
		if (!installRecordsLoaded) {
			installRecords = loadInstalledPluginIndexInstallRecordsSync({ env });
			installRecordsLoaded = true;
		}
		return installRecords ?? {};
	};
	const discovery = params.candidates ? {
		candidates: params.candidates,
		diagnostics: params.diagnostics ?? []
	} : params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		extraPaths: normalized.loadPaths,
		env,
		installRecords: getInstallRecords()
	});
	const diagnostics = [...discovery.diagnostics];
	const candidates = discovery.candidates;
	const records = [];
	const seenIds = /* @__PURE__ */ new Map();
	const realpathCache = /* @__PURE__ */ new Map();
	const currentHostVersion = resolveCompatibilityHostVersion(env);
	const explicitConfiguredFileSources = new Set(normalized.loadPaths.map((loadPath) => resolveUserPath(loadPath, env)).filter((loadPath) => safeStatSync(loadPath)?.isFile() === true).map((loadPath) => path.resolve(loadPath)));
	for (const candidate of candidates) {
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: candidate.origin,
			rootDir: candidate.rootDir,
			env,
			realpathCache
		});
		const isBundleRecord = (candidate.format ?? "openclaw") === "bundle";
		const isManifestlessConfiguredFile = candidate.origin === "config" && explicitConfiguredFileSources.has(path.resolve(candidate.source)) && !fs.existsSync(path.join(candidate.rootDir, "openclaw.plugin.json"));
		if (isManifestlessConfiguredFile && isCoreReservedPluginId(candidate.idHint)) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.idHint,
				source: candidate.source,
				message: `plugin manifest id "${candidate.idHint}" is reserved by OpenClaw core`
			});
			continue;
		}
		const manifestRes = candidate.origin === "bundled" && candidate.bundledManifest && candidate.bundledManifestPath ? {
			ok: true,
			manifest: candidate.bundledManifest,
			manifestPath: candidate.bundledManifestPath
		} : isBundleRecord && candidate.bundleFormat ? loadBundleManifest({
			rootDir: candidate.rootDir,
			bundleFormat: candidate.bundleFormat,
			rejectHardlinks
		}) : isManifestlessConfiguredFile ? {
			ok: true,
			manifest: {
				id: candidate.idHint,
				configSchema: {
					type: "object",
					additionalProperties: false
				}
			},
			manifestPath: candidate.source
		} : loadPluginManifest(candidate.rootDir, rejectHardlinks);
		if (!manifestRes.ok) {
			diagnostics.push({
				level: "error",
				pluginId: candidate.diagnosticIdHint ?? candidate.idHint,
				message: manifestRes.error,
				source: manifestRes.manifestPath
			});
			continue;
		}
		const manifest = manifestRes.manifest;
		const effectivePluginId = candidate.effectivePluginId ?? manifest.id;
		if (candidate.origin !== "bundled") {
			const packageManifestSource = path.join(candidate.packageDir ?? candidate.rootDir, "package.json");
			const allowLegacyBareMinHostVersion = candidate.origin === "global" && matchesInstalledPluginRecord({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const minHostVersionCheck = checkMinHostVersion({
				currentVersion: currentHostVersion,
				minHostVersion: candidate.packageManifest?.install?.minHostVersion,
				allowLegacyBareSemver: allowLegacyBareMinHostVersion
			});
			if (!minHostVersionCheck.ok) {
				diagnostics.push({
					level: minHostVersionCheck.kind === "invalid" ? "error" : "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: minHostVersionCheck.kind === "invalid" ? `plugin manifest invalid | ${minHostVersionCheck.error}` : minHostVersionCheck.kind === "unknown_host_version" ? `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined; skipping load` : `plugin requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}; skipping load`
				});
				continue;
			}
			const packagePluginApiRangeCheck = resolvePackagePluginApiRange(candidate.packageManifest);
			if (!packagePluginApiRangeCheck.ok) {
				diagnostics.push({
					level: "error",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin manifest invalid | ${packagePluginApiRangeCheck.error}`
				});
				continue;
			}
			const packagePluginApiRange = packagePluginApiRangeCheck.range;
			if (packagePluginApiRange && !satisfiesPluginApiRange(currentHostVersion, packagePluginApiRange)) {
				diagnostics.push({
					level: "warn",
					pluginId: effectivePluginId,
					source: packageManifestSource,
					message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${currentHostVersion}; skipping load (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`
				});
				continue;
			}
		}
		const configSchema = "configSchema" in manifest ? manifest.configSchema : void 0;
		const schemaCacheKey = (() => {
			if (!configSchema) return;
			const manifestMtime = safeStatMtimeMs(manifestRes.manifestPath);
			return manifestMtime ? `${manifestRes.manifestPath}:${manifestMtime}` : manifestRes.manifestPath;
		})();
		const record = isBundleRecord ? buildBundleRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath
		}) : buildRecord({
			manifest,
			candidate,
			manifestPath: manifestRes.manifestPath,
			diagnostics,
			rejectHardlinks,
			realpathCache,
			schemaCacheKey,
			configSchema,
			trustedOfficialInstall: isTrustedOfficialPluginInstall({
				pluginId: effectivePluginId,
				candidate,
				env,
				installRecords: getInstallRecords()
			}),
			...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
		});
		recordPluginManifestInstallOwner(record, resolvePluginCandidateInstallOwner(candidate), isPluginCandidateInstallOwnerAmbiguous(candidate));
		const existing = seenIds.get(effectivePluginId);
		if (existing) {
			const samePath = existing.candidate.rootDir === candidate.rootDir;
			if ((() => {
				if (samePath) return true;
				const existingReal = safeRealpathSync(existing.candidate.rootDir, realpathCache);
				const candidateReal = safeRealpathSync(candidate.rootDir, realpathCache);
				return Boolean(existingReal && candidateReal && existingReal === candidateReal);
			})()) {
				if (PLUGIN_ORIGIN_RANK[candidate.origin] < PLUGIN_ORIGIN_RANK[existing.candidate.origin]) {
					records[existing.recordIndex] = record;
					seenIds.set(effectivePluginId, {
						candidate,
						recordIndex: existing.recordIndex
					});
					pushManifestCompatibilityDiagnostics({
						record,
						diagnostics,
						normalized
					});
				}
				continue;
			}
			const candidateWins = resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate,
				config,
				env,
				installRecords: getInstallRecords()
			}) < resolveDuplicatePrecedenceRank({
				pluginId: effectivePluginId,
				candidate: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			});
			const winnerCandidate = candidateWins ? candidate : existing.candidate;
			const overriddenCandidate = candidateWins ? existing.candidate : candidate;
			if (candidateWins) {
				records[existing.recordIndex] = record;
				seenIds.set(effectivePluginId, {
					candidate,
					recordIndex: existing.recordIndex
				});
				pushManifestCompatibilityDiagnostics({
					record,
					diagnostics,
					normalized
				});
			}
			if (isIntentionalInstalledBundledDuplicate({
				pluginId: effectivePluginId,
				left: candidate,
				right: existing.candidate,
				config,
				env,
				installRecords: getInstallRecords()
			})) continue;
			if (isSameGlobalPackageDuplicate(candidate, existing.candidate)) continue;
			diagnostics.push({
				level: "warn",
				pluginId: effectivePluginId,
				source: overriddenCandidate.source,
				message: winnerCandidate.origin === "config" ? `duplicate plugin id resolved by explicit config-selected plugin; ${overriddenCandidate.origin} plugin will be overridden by config plugin (${winnerCandidate.source})` : `duplicate plugin id detected; ${overriddenCandidate.origin} plugin will be overridden by ${winnerCandidate.origin} plugin (${winnerCandidate.source})`
			});
			continue;
		}
		seenIds.set(effectivePluginId, {
			candidate,
			recordIndex: records.length
		});
		records.push(record);
		pushManifestCompatibilityDiagnostics({
			record,
			diagnostics,
			normalized
		});
	}
	return {
		plugins: rejectCaseFoldedIdCollisions(records, diagnostics),
		diagnostics: dedupePluginDiagnostics(diagnostics)
	};
}
/** Load manifest metadata from the bundled/source plugin tree without consulting operator state. */
function loadBundledPluginManifestRegistry(params = {}) {
	const env = params.env ?? process.env;
	const installRecords = {};
	return loadPluginManifestRegistryCore({
		env,
		installRecords,
		discovery: discoverOpenClawPlugins({
			env,
			installRecords,
			rootScope: "bundled"
		})
	});
}
//#endregion
export { isPluginManifestInstallOwnerAmbiguous as a, resolvePolicyPluginActivationState as i, loadPluginManifestRegistryCore as n, resolvePluginManifestInstallOwner as o, normalizePluginsConfigWithResolver as r, loadBundledPluginManifestRegistry as t };
