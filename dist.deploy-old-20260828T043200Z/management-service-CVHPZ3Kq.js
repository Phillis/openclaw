import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BN1NZvXG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as asSafeIntegerInRange } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as projectPluginDependencyHealth, r as buildPluginDependencyStatus } from "./discovery-KmR2BWJK.js";
import { y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { E as collectChangedPaths, l as readConfigFileSnapshotForWrite } from "./io-DlN5njvP.js";
import { t as installPluginFromGitSpec } from "./git-install-B-UPvogR.js";
import { t as validateJsonSchemaValue } from "./schema-validator-yfJyG0DX.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as createConfigScopedPromiseLoader } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DllFtsSG.js";
import { i as resolveTrustedSourceLinkedOfficialClawHubSpec, n as resolveTrustedOfficialClawHubPackageName, o as resolveTrustedSourceLinkedOfficialNpmSpec } from "./official-external-install-records-HG9WW4vi.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, f as listOfficialExternalPluginCatalogEntries, m as loadConfiguredHostedOfficialExternalPluginCatalogEntries, o as getOfficialExternalPluginCatalogManifest, v as resolveOfficialExternalPluginInstall, y as resolveOfficialExternalPluginLabel } from "./official-external-plugin-catalog-DwzC0Kl2.js";
import { o as loadInstalledPluginIndexInstallRecords } from "./manifest-registry-DRErrq38.js";
import { i as loadPluginMetadataSnapshot, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { n as resolvePluginControlPlaneWorkspace, t as appendPluginControlPlaneWorkspaceDiagnostic } from "./control-plane-workspace-BkM5PRVy.js";
import { n as resolveInstalledPluginPackageOwnership } from "./installed-plugin-package-ownership-JNsP8Eri.js";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-BlJhejU6.js";
import { t as setPluginEnabledInConfig } from "./toggle-config-SLa68K2j.js";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-DgqKtqMD.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-HeQJZ2vC.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-D2m0UUwS.js";
import { a as withPluginInstallRecords, o as withoutPluginInstallRecords, r as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-CyommlnD.js";
import { t as listRecommendedToolInstalls } from "./recommended-tool-installs-CXAwbaGj.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-BZTAJyJS.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BGnacuDj.js";
import { c as resolveAcceptedSurfaceCurrent, d as resolvePluginCapabilityConsent, f as resolvePluginInstallRecordIntegrity, g as resolvePluginPackageDeclaredSurface, l as resolvePendingPluginCapabilityReview, m as buildPluginCapabilitySummary, o as formatPluginCapabilityConsentRequired, p as resolvePluginInstallRecordTrust, r as computeDeclaredSurfaceHash, s as prepareManagedPluginArtifactConsentHandler } from "./capability-consent-D7GK9qgb.js";
import { n as recordPluginPackageUninstallPlan, t as prepareConfigForPendingPluginDirectoryRemovalSet } from "./uninstall-package-plan-DVdwa1CC.js";
import { B as isUnavailableNpmTarget, G as requestDeferredPluginInstall, q as resolvePluginInstallTransaction, z as PLUGIN_INSTALL_ERROR_CODE } from "./install-managed-npm-state-CKczi0Dv.js";
import { a as planPluginUninstall, n as applyPluginUninstallDirectoryRemoval, o as pluginUninstallTargetExists, r as formatUninstallActionLabels } from "./uninstall-D_sbsEHT.js";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-BwV39-oy.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-DHzKSPNn.js";
import { t as applySlotSelectionForPlugin } from "./slot-selection-D1BylzgO.js";
import { i as selectInstallMutationWriteOptions, r as resolveInstallConfigMutationPreflights, t as persistPluginInstall } from "./install-persistence-Z_XgQg-r.js";
import { i as installPluginFromNpmPackArchive, n as installPluginFromPath, r as installPluginFromNpmSpec } from "./install-03TyRPdj.js";
import { n as isUnavailableClawHubTarget, t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-Bqqw9uh0.js";
import { t as installPluginFromClawHub } from "./clawhub-D1lt_CwW.js";
import { f as resolveRegistryUpdateChannel, l as normalizeUpdateChannel } from "./update-channels-D2-WrHya.js";
import { i as buildClawHubPluginInstallRecordFields, n as resolveClawHubInstallSpecsForUpdateChannel, r as resolveNpmInstallSpecsForUpdateChannel } from "./install-channel-specs-DvTjoiME.js";
import { t as installPluginFromMarketplace } from "./marketplace-BFee0CCw.js";
import { t as collectClawPluginUninstallWarnings } from "./uninstall-claw-references-DqSWhY4I.js";
//#region src/plugins/bundled-install.ts
function resolveBundledPluginConfigEnablement(params) {
	if (!params.bundledSource.requiresConfig) return { mode: "ready" };
	const entry = isRecord(params.existingEntry) ? params.existingEntry : void 0;
	if (!entry || !Object.hasOwn(entry, "config")) return { mode: "missing" };
	const config = entry.config;
	if (!params.bundledSource.configSchema) return isRecord(config) && Object.keys(config).length > 0 ? { mode: "ready" } : {
		mode: "invalid",
		error: "config must be a non-empty object"
	};
	const result = validateJsonSchemaValue({
		schema: params.bundledSource.configSchema,
		cacheKey: `bundled-install:${params.bundledSource.pluginId}`,
		value: config,
		applyDefaults: true
	});
	return result.ok ? { mode: "ready" } : {
		mode: "invalid",
		error: result.errors[0]?.text ?? "invalid plugin config"
	};
}
function prepareConfigForDisabledBundledInstall(config, pluginId) {
	const entry = config.plugins?.entries?.[pluginId];
	const policy = isRecord(entry) ? { ...entry } : {};
	delete policy.config;
	return {
		...config,
		plugins: {
			...config.plugins,
			entries: {
				...config.plugins?.entries,
				[pluginId]: {
					...policy,
					enabled: false
				}
			}
		}
	};
}
async function installBundledPluginSource(params) {
	const existingEntry = params.snapshot.config.plugins?.entries?.[params.bundledSource.pluginId];
	const configEnablement = resolveBundledPluginConfigEnablement({
		bundledSource: params.bundledSource,
		existingEntry
	});
	if (configEnablement.mode === "invalid") throw new Error(`Plugin "${params.bundledSource.pluginId}" has invalid configured settings: ${configEnablement.error}. Fix plugins.entries.${params.bundledSource.pluginId}.config, then rerun the install.`);
	const shouldEnable = configEnablement.mode === "ready";
	const configBase = shouldEnable ? params.snapshot.config : prepareConfigForDisabledBundledInstall(params.snapshot.config, params.bundledSource.pluginId);
	const configWarning = shouldEnable ? void 0 : `Installed bundled plugin "${params.bundledSource.pluginId}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${params.bundledSource.pluginId}\`.`;
	const warnings = [params.warning, configWarning].filter((warning) => Boolean(warning));
	await persistPluginInstall({
		snapshot: {
			...params.snapshot,
			config: configBase
		},
		pluginId: params.bundledSource.pluginId,
		install: {
			source: "path",
			spec: params.rawSpec,
			sourcePath: params.bundledSource.localPath,
			installPath: params.bundledSource.localPath
		},
		enable: shouldEnable,
		invalidateRuntimeCache: params.invalidateRuntimeCache,
		...warnings.length > 0 ? { warningMessage: warnings.join("\n") } : {},
		runtime: params.runtime
	});
	return {
		pluginId: params.bundledSource.pluginId,
		warnings
	};
}
//#endregion
//#region src/plugins/management-service.ts
const officialCatalogLoader = createConfigScopedPromiseLoader(() => loadConfiguredHostedOfficialExternalPluginCatalogEntries());
let pluginDependencyDiagnostics = /* @__PURE__ */ new WeakMap();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	pluginDependencyDiagnostics = /* @__PURE__ */ new WeakMap();
});
function resolveManagedPluginDiagnostics(snapshot) {
	const cached = pluginDependencyDiagnostics.get(snapshot);
	if (cached) return cached;
	const { diagnostics } = projectPluginDependencyHealth({
		plugins: snapshot.index.plugins.map((record) => {
			const manifest = snapshot.byPluginId.get(record.pluginId);
			return {
				id: record.pluginId,
				source: manifest?.source ?? record.source ?? record.manifestPath,
				enabled: record.enabled,
				status: record.enabled ? "loaded" : "disabled",
				dependencyStatus: record.origin === "bundled" ? void 0 : buildPluginDependencyStatus({
					rootDir: record.rootDir,
					dependencies: manifest?.packageDependencies,
					optionalDependencies: manifest?.packageOptionalDependencies
				})
			};
		}),
		diagnostics: [...snapshot.diagnostics]
	});
	pluginDependencyDiagnostics.set(snapshot, diagnostics);
	return diagnostics;
}
/** Clear the process-stable hosted catalog snapshot after an explicit owner reload. */
function clearManagedPluginOfficialCatalogCache() {
	officialCatalogLoader.clear();
}
function resolveCatalogManifestIcon(manifest) {
	if (!manifest || typeof manifest !== "object") return;
	return normalizeOptionalString(manifest.icon);
}
function resolveCatalogEntryIcon(entry) {
	return normalizeOptionalString(entry?.icon) ?? resolveCatalogManifestIcon(getOfficialExternalPluginCatalogManifest(entry ?? {}));
}
function mergeCatalogMetadata(hosted, bundled, options) {
	const hostedManifest = getOfficialExternalPluginCatalogManifest(hosted);
	const bundledManifest = getOfficialExternalPluginCatalogManifest(bundled);
	const bundledCatalog = bundledManifest?.catalog;
	const bundledPlugin = bundledManifest?.plugin;
	const bundledIcon = resolveCatalogManifestIcon(bundledManifest);
	const bundledName = normalizeOptionalString(bundled.name);
	const bundledDescription = normalizeOptionalString(bundled.description);
	const bundledKind = normalizeOptionalString(bundled.kind);
	const bundledSource = normalizeOptionalString(bundled.source);
	const hostedFeatured = typeof hosted.featured === "boolean" ? hosted.featured : false;
	const mergedCatalog = bundledCatalog || hostedManifest?.catalog || options.hostedFeaturedAuthoritative && hostedFeatured ? {
		...hostedManifest?.catalog,
		...bundledCatalog,
		...options.hostedFeaturedAuthoritative ? { featured: hostedFeatured } : {}
	} : void 0;
	if (!mergedCatalog && !bundledPlugin) return hosted;
	return {
		...hosted,
		...!normalizeOptionalString(hosted.name) && bundledName ? { name: bundledName } : {},
		...!normalizeOptionalString(hosted.description) && bundledDescription ? { description: bundledDescription } : {},
		...!normalizeOptionalString(hosted.kind) && bundledKind ? { kind: bundledKind } : {},
		...!normalizeOptionalString(hosted.source) && bundledSource ? { source: bundledSource } : {},
		[MANIFEST_KEY]: {
			...hostedManifest,
			...bundledPlugin ? { plugin: {
				...hostedManifest?.plugin,
				...bundledPlugin
			} } : {},
			...mergedCatalog ? { catalog: mergedCatalog } : {},
			...!resolveCatalogManifestIcon(hostedManifest) && bundledIcon ? { icon: bundledIcon } : {}
		}
	};
}
function resolveCatalogPackageSourceIdentities(entry) {
	const install = resolveOfficialExternalPluginInstall(entry);
	const clawhubPackage = install?.clawhubSpec ? parseClawHubPluginSpec(install.clawhubSpec)?.name : void 0;
	const npmPackage = install?.npmSpec ? parseRegistryNpmSpec(install.npmSpec)?.name : void 0;
	return [...clawhubPackage ? [{
		source: "clawhub",
		packageName: clawhubPackage
	}] : [], ...npmPackage ? [{
		source: "npm",
		packageName: npmPackage
	}] : []];
}
function matchesBundledCatalogIdentity(params) {
	const hostedSources = resolveCatalogPackageSourceIdentities(params.hosted);
	const bundledSources = resolveCatalogPackageSourceIdentities(params.bundled);
	return hostedSources.some((hosted) => bundledSources.some((bundled) => bundled.source === hosted.source && bundled.packageName === hosted.packageName));
}
/**
* Overlay local runtime identity and ordering after an exact package/source match.
* Hosted curation wins; bundled Featured state survives only in fallback mode.
*/
function overlayBundledOfficialPluginCatalogMetadata(entries, bundledEntries = listOfficialExternalPluginCatalogEntries(), options = { hostedFeaturedAuthoritative: false }) {
	return entries.map((entry) => {
		const matches = bundledEntries.filter((bundled) => matchesBundledCatalogIdentity({
			hosted: entry,
			bundled
		}));
		const bundled = matches.length === 1 ? matches[0] : void 0;
		if (bundled) return mergeCatalogMetadata(entry, bundled, options);
		if (!options.hostedFeaturedAuthoritative) return entry;
		const hostedManifest = getOfficialExternalPluginCatalogManifest(entry);
		if (entry.featured !== true && !hostedManifest?.catalog) return entry;
		return {
			...entry,
			[MANIFEST_KEY]: {
				...hostedManifest,
				catalog: {
					...hostedManifest?.catalog,
					featured: entry.featured === true
				}
			}
		};
	});
}
async function loadOfficialCatalog() {
	const result = await officialCatalogLoader.load();
	const hostedFeaturedAuthoritative = result.source === "hosted" || result.source === "hosted-snapshot";
	return {
		entries: overlayBundledOfficialPluginCatalogMetadata(result.entries, void 0, { hostedFeaturedAuthoritative }),
		hostedFeaturedAuthoritative,
		..."error" in result ? { error: result.error } : {}
	};
}
function normalizeKinds(kind) {
	const values = (typeof kind === "string" ? [kind] : kind ?? []).map((value) => value.trim()).filter(Boolean);
	return values.length > 0 ? [...new Set(values)] : void 0;
}
function normalizeCatalogMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const featured = typeof record.featured === "boolean" ? record.featured : void 0;
	const order = typeof record.order === "number" && Number.isFinite(record.order) ? record.order : void 0;
	return featured === void 0 && order === void 0 ? void 0 : {
		...featured !== void 0 ? { featured } : {},
		...order !== void 0 ? { order } : {}
	};
}
function normalizeFeaturedAt(value) {
	return asSafeIntegerInRange(value, { min: 0 });
}
function resolveCatalogInstallAction(params) {
	const install = resolveOfficialExternalPluginInstall(params.entry);
	const clawhub = install?.clawhubSpec ? parseClawHubPluginSpec(install.clawhubSpec) : void 0;
	if (clawhub && !clawhub.version) return {
		source: "clawhub",
		packageName: clawhub.name
	};
	return install ? {
		source: "official",
		pluginId: params.pluginId
	} : void 0;
}
/** Coarse manifest-derived grouping so catalog UIs can shelve a large inventory. */
function derivePluginCategory(manifest) {
	if (!manifest) return;
	if (manifest.channels.length > 0 || Object.keys(manifest.channelConfigs ?? {}).length > 0) return "channel";
	const mediaProvider = Object.keys(manifest.imageGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.videoGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.musicGenerationProviderMetadata ?? {}).length > 0 || Object.keys(manifest.mediaUnderstandingProviderMetadata ?? {}).length > 0;
	if (manifest.providers.length > 0 || manifest.providerEndpoints?.length || manifest.modelCatalog || mediaProvider) return "provider";
	const kinds = normalizeKinds(manifest.kind);
	if (kinds?.includes("memory")) return "memory";
	if (kinds?.includes("context-engine")) return "context-engine";
	if (manifest.contracts?.tools?.length || Object.keys(manifest.toolMetadata ?? {}).length > 0 || manifest.skills.length > 0) return "tool";
}
function firstPluginError(diagnostics, pluginId) {
	return diagnostics.find((diagnostic) => diagnostic.level === "error" && diagnostic.pluginId === pluginId)?.message;
}
function compareCatalogEntries(left, right) {
	const featured = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
	if (featured !== 0) return featured;
	if (left.featured && right.featured) {
		const leftFeaturedAt = left.featuredAt;
		const rightFeaturedAt = right.featuredAt;
		if (leftFeaturedAt !== void 0 || rightFeaturedAt !== void 0) {
			if (leftFeaturedAt === void 0) return 1;
			if (rightFeaturedAt === void 0) return -1;
			if (leftFeaturedAt !== rightFeaturedAt) return rightFeaturedAt - leftFeaturedAt;
		}
	}
	const order = (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
	return order !== 0 ? order : left.name.localeCompare(right.name);
}
function resolveInstalledOfficialCatalogEntry(params) {
	if (!params.packageName) return;
	const matches = params.entries.filter((entry) => resolveCatalogPackageSourceIdentities(entry).some((identity) => identity.source === params.source && identity.packageName === params.packageName));
	return matches.length === 1 ? matches[0] : void 0;
}
function resolveOfficialCatalogIconUrl(entries, pluginId) {
	return resolveCatalogEntryIcon(entries.find((candidate) => resolveOfficialExternalPluginId(candidate) === pluginId));
}
function resolveInstalledPluginPresentation(params) {
	const { record, manifest, officialEntry, hostedListingAuthoritative } = params;
	const localName = (manifest?.name !== record.packageName ? manifest?.name : void 0) ?? manifest?.channelCatalogMeta?.label ?? record.pluginId;
	const localDescription = manifest?.description ?? manifest?.channelCatalogMeta?.blurb ?? manifest?.packageDescription;
	const name = (hostedListingAuthoritative ? normalizeOptionalString(officialEntry?.title) : void 0) ?? localName;
	const description = (hostedListingAuthoritative ? normalizeOptionalString(officialEntry?.description) : void 0) ?? localDescription;
	const version = record.packageVersion ?? manifest?.version;
	return {
		name,
		...description ? { description } : {},
		...version ? { version } : {}
	};
}
function resolveInstalledHostedOfficialEntry(params) {
	const identityPluginId = params.installOwner ?? params.record.pluginId;
	const trustedOfficialClawHubSpec = params.installRecord ? resolveTrustedSourceLinkedOfficialClawHubSpec({
		pluginId: identityPluginId,
		record: params.installRecord
	}) : void 0;
	const trustedOfficialNpmSpec = params.installRecord ? resolveTrustedSourceLinkedOfficialNpmSpec({
		pluginId: identityPluginId,
		record: params.installRecord
	}) : void 0;
	const sourceLinkedOfficialClawHubPackage = trustedOfficialClawHubSpec ? parseClawHubPluginSpec(trustedOfficialClawHubSpec)?.name : void 0;
	const currentOfficialClawHubPackage = params.installRecord ? resolveTrustedOfficialClawHubPackageName(params.installRecord) : void 0;
	const trustedOfficialNpmPackage = trustedOfficialNpmSpec ? parseRegistryNpmSpec(trustedOfficialNpmSpec)?.name : void 0;
	const bundledPublishedEntry = params.record.origin === "bundled" ? resolveInstalledOfficialCatalogEntry({
		entries: params.bundledOfficialEntries,
		packageName: params.record.packageName,
		source: "npm"
	}) : void 0;
	const installedOfficialIdentity = sourceLinkedOfficialClawHubPackage ? {
		source: "clawhub",
		packageName: sourceLinkedOfficialClawHubPackage
	} : trustedOfficialNpmPackage ? {
		source: "npm",
		packageName: trustedOfficialNpmPackage
	} : currentOfficialClawHubPackage && (!params.record.packageName || params.record.packageName === currentOfficialClawHubPackage) ? {
		source: "clawhub",
		packageName: currentOfficialClawHubPackage
	} : bundledPublishedEntry && params.record.packageName ? {
		source: "npm",
		packageName: params.record.packageName
	} : void 0;
	const hasInstalledOfficialProvenance = Boolean(installedOfficialIdentity && (!params.record.packageName || params.record.packageName === installedOfficialIdentity.packageName));
	const bundledOfficialEntry = bundledPublishedEntry ?? resolveInstalledOfficialCatalogEntry({
		entries: params.bundledOfficialEntries,
		packageName: hasInstalledOfficialProvenance ? installedOfficialIdentity?.packageName : void 0,
		source: installedOfficialIdentity?.source ?? "clawhub"
	});
	const hostedPackageName = installedOfficialIdentity?.source === "npm" ? (bundledOfficialEntry ? resolveCatalogPackageSourceIdentities(bundledOfficialEntry) : []).find((identity) => identity.source === "clawhub")?.packageName : installedOfficialIdentity?.packageName;
	return {
		entry: resolveInstalledOfficialCatalogEntry({
			entries: params.officialEntries,
			packageName: hasInstalledOfficialProvenance ? hostedPackageName : void 0,
			source: "clawhub"
		}),
		hasPublishedIdentity: Boolean(hasInstalledOfficialProvenance && hostedPackageName)
	};
}
function resolvePluginIconUrlFromCatalogFacts(params) {
	const normalizedPluginId = params.metadata.normalizePluginId(params.pluginId);
	const record = params.metadata.index.plugins.find((candidate) => params.metadata.normalizePluginId(candidate.pluginId) === normalizedPluginId);
	const localIcon = normalizeOptionalString(params.metadata.byPluginId.get(normalizedPluginId)?.icon);
	if (!record) return resolveOfficialCatalogIconUrl(params.officialEntries, normalizedPluginId);
	const ownership = resolveInstalledPluginPackageOwnership(params.metadata.index, record.pluginId);
	const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
	const { entry: officialEntry } = resolveInstalledHostedOfficialEntry({
		record,
		...installOwner ? { installOwner } : {},
		installRecord: installOwner ? params.metadata.index.installRecords[installOwner] : void 0,
		officialEntries: params.officialEntries,
		bundledOfficialEntries: params.bundledOfficialEntries ?? listOfficialExternalPluginCatalogEntries()
	});
	return resolveCatalogEntryIcon(officialEntry) ?? localIcon;
}
function resolveManagedPluginMetadataParams(config, env) {
	const workspace = resolvePluginControlPlaneWorkspace({
		config,
		env
	});
	return {
		config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	};
}
/** Resolve the current manifest/catalog icon URL without accepting a caller-provided URL. */
async function resolveManagedPluginIconUrl(params) {
	const env = params.env ?? process.env;
	return resolvePluginIconUrlFromCatalogFacts({
		metadata: resolvePluginMetadataSnapshot(resolveManagedPluginMetadataParams(params.config, env)),
		officialEntries: (params.officialCatalog ?? await loadOfficialCatalog()).entries,
		bundledOfficialEntries: listOfficialExternalPluginCatalogEntries(),
		pluginId: params.pluginId
	});
}
function normalizeManagedCatalogIconUrl(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized || normalized.length > 2048) return;
	try {
		const url = new URL(normalized);
		return url.protocol === "https:" && url.hostname && !url.username && !url.password && !url.hash ? url.href : void 0;
	} catch {
		return;
	}
}
/** Resolve only URLs currently owned by a manifest or bundled presentation catalog. */
function resolveManagedSetupCatalogIconUrl(params) {
	const requested = normalizeManagedCatalogIconUrl(params.iconUrl);
	if (!requested) return;
	const env = params.env ?? process.env;
	return [...resolveManifestProviderAuthChoices({
		config: params.config,
		env,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}).map((choice) => choice.icon), ...listRecommendedToolInstalls().map((install) => install.icon)].some((iconUrl) => normalizeManagedCatalogIconUrl(iconUrl) === requested) ? requested : void 0;
}
/** Build cold installed state merged with the hosted official catalog and bundled curation. */
async function listManagedPlugins(params) {
	const env = params.env ?? process.env;
	const workspace = resolvePluginControlPlaneWorkspace({
		config: params.config,
		env
	});
	const metadata = resolvePluginMetadataSnapshot({
		config: params.config,
		env,
		...workspace.workspaceDir !== void 0 ? { workspaceDir: workspace.workspaceDir } : {}
	});
	const pluginDiagnostics = resolveManagedPluginDiagnostics(metadata);
	const officialCatalog = params.officialCatalog ?? await loadOfficialCatalog();
	const bundledOfficialEntries = listOfficialExternalPluginCatalogEntries();
	const capabilityConsentDiagnostics = [];
	const plugins = metadata.index.plugins.map((record) => {
		const manifest = metadata.byPluginId.get(record.pluginId);
		const localCatalog = normalizeCatalogMetadata(manifest?.catalog);
		const ownership = resolveInstalledPluginPackageOwnership(metadata.index, record.pluginId);
		const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		if (record.enabled && record.origin !== "bundled" && ownership.ok && installRecord) {
			const declared = resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId);
			if (!declared || !resolveAcceptedSurfaceCurrent(installRecord, declared)) capabilityConsentDiagnostics.push({
				level: "warn",
				pluginId: record.pluginId,
				message: formatPluginCapabilityConsentRequired(record.pluginId)
			});
		}
		const { entry: officialEntry, hasPublishedIdentity } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries: officialCatalog.entries,
			bundledOfficialEntries
		});
		const hasHostedOfficialIdentity = hasPublishedIdentity;
		const officialCatalogMetadata = officialEntry ? normalizeCatalogMetadata(getOfficialExternalPluginCatalogManifest(officialEntry)?.catalog) : void 0;
		const catalog = hasHostedOfficialIdentity && officialCatalog.hostedFeaturedAuthoritative ? {
			...localCatalog,
			...officialCatalogMetadata,
			featured: officialEntry?.featured === true
		} : officialCatalogMetadata ? {
			...localCatalog,
			...officialCatalogMetadata
		} : localCatalog;
		const error = firstPluginError(pluginDiagnostics, record.pluginId);
		const kind = normalizeKinds(manifest?.kind);
		const category = derivePluginCategory(manifest);
		const removable = record.origin !== "bundled" && Boolean(installOwner);
		const hostedListingAuthoritative = hasHostedOfficialIdentity && officialCatalog.hostedFeaturedAuthoritative === true;
		const featuredAt = hostedListingAuthoritative && catalog?.featured === true ? normalizeFeaturedAt(officialEntry?.featuredAt) : void 0;
		const presentation = resolveInstalledPluginPresentation({
			record,
			manifest,
			officialEntry,
			hostedListingAuthoritative
		});
		const plugin = {
			id: record.pluginId,
			name: presentation.name,
			installed: true,
			enabled: record.enabled,
			state: error ? "error" : record.enabled ? "enabled" : "disabled",
			removable
		};
		if (record.packageName) plugin.packageName = record.packageName;
		if (presentation.description) plugin.description = presentation.description;
		if (presentation.version) plugin.version = presentation.version;
		if (kind) plugin.kind = kind;
		if (record.origin) plugin.origin = record.origin;
		if (catalog?.featured !== void 0) plugin.featured = catalog.featured;
		if (featuredAt !== void 0) plugin.featuredAt = featuredAt;
		if (catalog?.order !== void 0) plugin.order = catalog.order;
		if (resolvePluginIconUrlFromCatalogFacts({
			metadata,
			officialEntries: officialCatalog.entries,
			bundledOfficialEntries,
			pluginId: record.pluginId
		})) plugin.hasIcon = true;
		if (error) plugin.error = error;
		if (category) plugin.category = category;
		return plugin;
	});
	const installedIds = new Set(plugins.map((plugin) => plugin.id));
	const installedPackageNames = new Set(plugins.flatMap((plugin) => plugin.packageName ? [plugin.packageName] : []));
	const entryPackageInstalled = (entry) => resolveCatalogPackageSourceIdentities(entry).some((identity) => installedPackageNames.has(identity.packageName));
	for (const entry of officialCatalog.entries) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifestCatalog = normalizeCatalogMetadata(getOfficialExternalPluginCatalogManifest(entry)?.catalog);
		const catalog = manifestCatalog || typeof entry.featured === "boolean" ? {
			...manifestCatalog,
			...manifestCatalog?.featured === void 0 && typeof entry.featured === "boolean" ? { featured: entry.featured } : {}
		} : void 0;
		if (!pluginId || !catalog || installedIds.has(pluginId) || entryPackageInstalled(entry)) continue;
		const kind = normalizeKinds(entry.kind);
		const install = resolveCatalogInstallAction({
			entry,
			pluginId
		});
		const clawhubPackageName = resolveCatalogPackageSourceIdentities(entry).find((identity) => identity.source === "clawhub")?.packageName;
		const description = normalizeOptionalString(entry.description);
		const version = normalizeOptionalString(entry.version);
		const featuredAt = catalog.featured === true ? normalizeFeaturedAt(entry.featuredAt) : void 0;
		plugins.push({
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...clawhubPackageName ? { packageName: clawhubPackageName } : {},
			...description ? { description } : {},
			...version ? { version } : {},
			...kind ? { kind } : {},
			origin: "official",
			installed: false,
			enabled: false,
			state: "not-installed",
			...catalog.featured !== void 0 ? { featured: catalog.featured } : {},
			...featuredAt !== void 0 ? { featuredAt } : {},
			...catalog.order !== void 0 ? { order: catalog.order } : {},
			...resolveCatalogEntryIcon(entry) ? { hasIcon: true } : {},
			...install ? { install } : {}
		});
	}
	const diagnostics = appendPluginControlPlaneWorkspaceDiagnostic([...pluginDiagnostics, ...capabilityConsentDiagnostics], workspace);
	if (officialCatalog.error) diagnostics.push({
		level: "warn",
		message: `Official plugin catalog fallback: ${officialCatalog.error}`
	});
	return {
		plugins: plugins.toSorted(compareCatalogEntries),
		diagnostics,
		mutationAllowed: !resolveIsNixMode(env)
	};
}
/** Inspect one plugin's manifest, operator grants, and recorded install provenance. */
async function inspectManagedPlugin(params) {
	const env = params.env ?? process.env;
	const metadata = resolvePluginMetadataSnapshot(resolveManagedPluginMetadataParams(params.config, env));
	const pluginId = metadata.normalizePluginId(params.pluginId);
	const record = metadata.index.plugins.find((candidate) => candidate.pluginId === pluginId);
	const pendingReview = resolvePendingPluginCapabilityReview(pluginId);
	if (pendingReview) return {
		ok: true,
		plugin: {
			id: pluginId,
			name: pendingReview.name,
			...pendingReview.version ? { version: pendingReview.version } : {},
			...record?.origin ? { origin: record.origin } : {},
			installed: Boolean(record),
			enabled: record?.enabled ?? false
		},
		declared: pendingReview.declared,
		grants: pendingReview.grants,
		reviewToken: pendingReview.reviewToken,
		...pendingReview.source ? { source: pendingReview.source } : {},
		...pendingReview.trust ? { trust: pendingReview.trust } : {}
	};
	const officialCatalog = await loadOfficialCatalog();
	if (record) {
		const manifest = metadata.byPluginId.get(pluginId);
		const ownership = resolveInstalledPluginPackageOwnership(metadata.index, pluginId, env);
		const installOwner = ownership.ok ? ownership.value.installOwner : void 0;
		const installRecord = installOwner ? metadata.index.installRecords[installOwner] : void 0;
		const { entry: officialEntry, hasPublishedIdentity } = resolveInstalledHostedOfficialEntry({
			record,
			...installOwner ? { installOwner } : {},
			installRecord,
			officialEntries: officialCatalog.entries,
			bundledOfficialEntries: listOfficialExternalPluginCatalogEntries()
		});
		const spec = installRecord?.resolvedSpec ?? installRecord?.spec;
		const packageName = installRecord?.clawhubPackage ?? record.packageName;
		const source = installRecord ? {
			kind: installRecord.source,
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...resolvePluginInstallRecordIntegrity(installRecord)
		} : record.origin === "bundled" ? { kind: "bundled" } : void 0;
		const trust = resolvePluginInstallRecordTrust(installRecord);
		const summary = buildPluginCapabilitySummary({
			manifest: manifest ?? {},
			origin: record.origin,
			entryConfig: params.config.plugins?.entries?.[pluginId]
		});
		const declared = ownership.ok ? resolvePluginPackageDeclaredSurface(ownership.value, metadata.byPluginId) : summary.declared;
		if (!declared) throw new ManagedPluginLifecycleError(`Plugin package "${installOwner}" has incomplete manifest metadata.`);
		return {
			ok: true,
			plugin: {
				id: pluginId,
				...resolveInstalledPluginPresentation({
					record,
					manifest,
					officialEntry,
					hostedListingAuthoritative: hasPublishedIdentity && officialCatalog.hostedFeaturedAuthoritative === true
				}),
				origin: record.origin,
				installed: true,
				enabled: record.enabled
			},
			...source ? { source } : {},
			...summary,
			declared,
			reviewToken: computeDeclaredSurfaceHash(declared),
			...trust ? { trust } : {}
		};
	}
	const entry = resolveOfficialEntryById(officialCatalog.entries, pluginId);
	if (!entry) throw new ManagedPluginLifecycleError(`Plugin "${pluginId}" not found.`, { kind: "invalid-request" });
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const install = resolveOfficialExternalPluginInstall(entry);
	const packageName = resolveCatalogPackageSourceIdentities(entry)[0]?.packageName;
	const spec = install?.clawhubSpec ?? install?.npmSpec;
	const description = normalizeOptionalString(entry.description);
	const version = normalizeOptionalString(entry.version);
	const summary = buildPluginCapabilitySummary({
		manifest: manifest ?? {},
		origin: "official",
		entryConfig: params.config.plugins?.entries?.[pluginId]
	});
	return {
		ok: true,
		plugin: {
			id: pluginId,
			name: resolveOfficialExternalPluginLabel(entry),
			...version ? { version } : {},
			...description ? { description } : {},
			origin: "official",
			installed: false,
			enabled: false
		},
		source: {
			kind: "official-catalog",
			...spec ? { spec: redactSensitiveUrlLikeString(spec) } : {},
			...packageName ? { packageName } : {},
			...install?.expectedIntegrity ? {
				integrity: install.expectedIntegrity,
				integrityKind: install.defaultChoice === "clawhub" ? "sha256" : "ssri"
			} : {}
		},
		...summary,
		reviewToken: computeDeclaredSurfaceHash(summary.declared)
	};
}
function assertValidConfigSnapshot(prepared) {
	const { snapshot, writeOptions } = prepared;
	if (!snapshot.valid) throw new ManagedPluginLifecycleError("Config invalid; run `openclaw doctor --fix` before managing plugins.");
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
	const { pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed: snapshot.parsed ?? {},
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	if (pluginMutation.mode === "blocked") throw new ManagedPluginLifecycleError(pluginMutation.reason);
	return {
		config: snapshot.sourceConfig,
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions
	};
}
async function readPluginMutationSnapshot(env) {
	try {
		assertConfigWriteAllowedInCurrentMode({ env });
	} catch (error) {
		throw new ManagedPluginLifecycleError(formatErrorMessage(error), { cause: error });
	}
	return assertValidConfigSnapshot(await readConfigFileSnapshotForWrite());
}
function createSilentRuntime() {
	return {
		log: () => void 0,
		error: () => void 0,
		exit: (code) => {
			throw new ManagedPluginLifecycleError(`plugin lifecycle exited with code ${code}`);
		}
	};
}
function createInstallLogger(warnings) {
	return {
		info: () => void 0,
		warn: (message) => warnings.push(message)
	};
}
function resolveOfficialEntryById(entries, pluginId) {
	return entries.find((entry) => resolveOfficialExternalPluginId(entry) === pluginId);
}
/** Explicitly declared runtime id, ignoring the entry-id fallback used for display. */
function resolveDeclaredOfficialPluginId(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.id) ?? normalizeOptionalString(manifest?.channel?.id) ?? normalizeOptionalString(manifest?.providers?.[0]?.id);
}
function resolveOfficialEntryByClawHubPackage(entries, packageName) {
	return [...listOfficialExternalPluginCatalogEntries(), ...entries].find((entry) => {
		return parseClawHubPluginSpec(resolveOfficialExternalPluginInstall(entry)?.clawhubSpec ?? "")?.name === packageName;
	});
}
function resolveHostedOfficialEntryByClawHubPackage(entries, packageName) {
	return entries.find((entry) => {
		return parseClawHubPluginSpec(resolveOfficialExternalPluginInstall(entry)?.clawhubSpec ?? "")?.name === packageName;
	});
}
function buildClawHubSpec(packageName, version) {
	const parsed = parseClawHubPluginSpec(`clawhub:${packageName}`);
	if (!parsed || parsed.version) throw new ManagedPluginLifecycleError(`invalid ClawHub package name: ${packageName}`);
	return `clawhub:${packageName}${version ? `@${version}` : ""}`;
}
function throwInstallFailure(result) {
	const unavailable = !result.code || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE || result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE || result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE;
	throw new ManagedPluginLifecycleError(result.error, {
		kind: unavailable ? "unavailable" : "invalid-request",
		code: result.code,
		version: result.version,
		warning: result.warning,
		installPolicyWarning: result.installPolicyWarning,
		cause: result
	});
}
async function persistManagedSourceInstall(params) {
	const warnings = [];
	let committed = false;
	try {
		return {
			config: await persistPluginInstall({
				snapshot: params.snapshot,
				pluginId: params.pluginId,
				install: params.install,
				invalidateRuntimeCache: params.invalidateRuntimeCache,
				runtime: params.runtime,
				persistenceLogger: { warn: (message) => warnings.push(message) },
				onCommitted: () => {
					committed = true;
				},
				...params.successMessage ? { successMessage: params.successMessage } : {}
			}),
			warnings
		};
	} catch (error) {
		if (!committed) try {
			await params.transaction?.rollback();
		} catch (rollbackError) {
			throw new AggregateError([error, rollbackError], "Plugin install failed and payload rollback failed", { cause: rollbackError });
		}
		throw error;
	} finally {
		if (committed) await params.transaction?.commit().catch(() => {
			const warning = "Plugin install committed, but backup cleanup failed. Restart is required.";
			warnings.push(warning);
			params.runtime?.log(warning);
		});
	}
}
/**
* Official plugin installs target the release stream the gateway is running,
* the same target `openclaw doctor --fix` and `openclaw plugins update`
* already resolve. Resolving here keeps every managed install path — CLI,
* chat command, and any future caller — on one answer instead of letting the
* registry default land a plugin the gateway then reports as drifted.
*
* Only the beta stream resolves here. The version-bound stable tracks key off a
* per-plugin `versionBoundToOpenClaw` descriptor that a managed install request
* does not carry, and answering for them from this boundary would pin plugins
* the policy never opted in.
*/
function resolveOfficialManagedInstallSpec(params) {
	const { request } = params;
	const trustedSourceLinkedOfficialInstall = request.source !== "official" && request.trustedSourceLinkedOfficialInstall === true;
	if (request.source === "npm" && !trustedSourceLinkedOfficialInstall) return null;
	if (request.expectedIntegrity) return null;
	const packageName = request.source === "clawhub" ? parseClawHubPluginSpec(request.spec)?.name : parseRegistryNpmSpec(request.spec)?.name;
	if (!packageName || request.source !== "official" && !trustedSourceLinkedOfficialInstall && !getOfficialExternalPluginCatalogEntryForPackage(packageName)) return null;
	const updateChannel = resolveRegistryUpdateChannel({
		configChannel: normalizeUpdateChannel(params.config.update?.channel),
		currentVersion: VERSION
	});
	if (updateChannel !== "beta") return null;
	const specs = request.source === "clawhub" ? resolveClawHubInstallSpecsForUpdateChannel({
		spec: request.spec,
		updateChannel
	}) : resolveNpmInstallSpecsForUpdateChannel({
		spec: request.spec,
		updateChannel
	});
	return specs.installSpec === request.spec ? null : specs.installSpec;
}
/**
* Installs official plugins from the release stream the gateway runs. When that
* stream has no published artifact the install reports it instead of widening
* back to the registry default: widening would resolve `latest` and land exactly
* the cross-release plugin this boundary exists to prevent, and a fresh install
* has nothing to preserve, so failing with the reason costs the operator only a
* retry with an explicit version.
*/
async function installManagedPluginSource(params) {
	const { request } = params;
	if (request.source !== "official" && request.source !== "npm" && request.source !== "clawhub") return await installResolvedManagedPluginSource(params);
	const installSpec = resolveOfficialManagedInstallSpec({
		request,
		config: params.snapshot.config
	});
	if (!installSpec) return await installResolvedManagedPluginSource(params);
	const result = await installResolvedManagedPluginSource({
		...params,
		request: {
			...request,
			spec: installSpec,
			recordSpec: request.recordSpec ?? request.spec
		}
	});
	if (result.ok) return result;
	if (!(request.source === "clawhub" ? isUnavailableClawHubTarget(result) : isUnavailableNpmTarget(result))) return result;
	return {
		...result,
		code: PLUGIN_INSTALL_ERROR_CODE.RELEASE_COHORT_UNAVAILABLE,
		error: `No ${installSpec} release is published for this gateway. Installing ${request.spec} would resolve a build from another release; pass an explicit version to install one anyway.`
	};
}
/** Execute one resolved plugin source through the shared install-and-persist pipeline. */
async function installResolvedManagedPluginSource(params) {
	const { request } = params;
	const env = params.env ?? process.env;
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	if (request.source === "bundled") return {
		ok: true,
		...await installBundledPluginSource({
			snapshot: params.snapshot,
			rawSpec: request.rawSpec,
			bundledSource: request.bundledSource,
			warning: request.warning,
			invalidateRuntimeCache: params.invalidateRuntimeCache,
			runtime: params.runtime
		}),
		config: params.snapshot.config
	};
	const consentExemptSource = request.source === "local" && request.bundledOrigin === true;
	const source = request.source === "local" ? request.recordSource : request.source === "npm-pack" || request.source === "official" ? "npm" : request.source;
	const capabilityConsent = consentExemptSource ? void 0 : await prepareManagedPluginArtifactConsentHandler({
		config: params.snapshot.config,
		env,
		source,
		...request.source === "marketplace" ? { spec: `${request.plugin}@${request.marketplace}` } : "spec" in request ? { spec: request.spec } : {},
		..."expectedIntegrity" in request && request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {},
		acknowledgeCapabilities: params.acknowledgeCapabilities,
		onCapabilityConsent: params.onCapabilityConsent
	});
	const common = requestDeferredPluginInstall({
		...params.safetyOverrides,
		config: params.snapshot.config,
		extensionsDir,
		logger: params.logger,
		...capabilityConsent ? { onBeforePluginArtifactCommit: capabilityConsent.onBeforePluginArtifactCommit } : {}
	});
	const complete = async (installResult, completed) => {
		const result = await installResult;
		if (!result.ok) return result;
		const installed = result;
		if (request.source === "local" && request.link) await capabilityConsent?.onBeforePluginArtifactCommit({
			pluginId: installed.pluginId,
			stagedArtifactDir: request.path,
			mode: request.mode ?? "install"
		});
		const transaction = resolvePluginInstallTransaction(installed);
		if (completed.expectedPluginId && installed.pluginId !== completed.expectedPluginId) {
			await transaction?.rollback();
			return {
				ok: false,
				error: `official catalog plugin id mismatch: expected ${completed.expectedPluginId}, got ${installed.pluginId}`
			};
		}
		const persisted = await persistManagedSourceInstall({
			...params,
			snapshot: completed.snapshot ?? params.snapshot,
			pluginId: installed.pluginId,
			install: capabilityConsent ? capabilityConsent.applyAcceptedSurface(installed.pluginId, completed.install(installed)) : completed.install(installed),
			transaction,
			successMessage: completed.successMessage
		});
		return {
			...installed,
			config: persisted.config,
			...persisted.warnings.length > 0 ? { warnings: [...new Set(persisted.warnings)] } : {}
		};
	};
	if (request.source === "local") {
		const installPath = request.link ? request.path : void 0;
		const linkedSnapshot = request.link ? {
			...params.snapshot,
			config: {
				...params.snapshot.config,
				plugins: {
					...params.snapshot.config.plugins,
					load: {
						...params.snapshot.config.plugins?.load,
						paths: uniqueStrings([...params.snapshot.config.plugins?.load?.paths ?? [], request.path])
					}
				}
			}
		} : params.snapshot;
		return await complete(installPluginFromPath({
			...common,
			path: request.path,
			mode: request.mode,
			...request.link ? {
				dryRun: true,
				allowSourceTypeScriptEntries: true
			} : {}
		}), {
			snapshot: linkedSnapshot,
			successMessage: request.successMessage,
			install: (result) => ({
				source: request.recordSource,
				sourcePath: request.path,
				installPath: installPath ?? result.targetDir,
				version: result.version
			})
		});
	}
	if (request.source === "marketplace") return await complete(installPluginFromMarketplace({
		...common,
		marketplace: request.marketplace,
		plugin: request.plugin,
		mode: request.mode
	}), { install: (result) => ({
		source: "marketplace",
		installPath: result.targetDir,
		version: result.version,
		marketplaceName: result.marketplaceName,
		marketplaceSource: result.marketplaceSource,
		marketplacePlugin: result.marketplacePlugin
	}) });
	if (request.source === "npm-pack") return await complete(installPluginFromNpmPackArchive({
		...common,
		archivePath: request.archivePath,
		mode: request.mode
	}), { install: (result) => ({
		source: "npm",
		spec: result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId,
		sourcePath: request.archivePath,
		installPath: result.targetDir,
		...result.version ? { version: result.version } : {},
		...buildNpmResolutionFields(result.npmResolution),
		artifactKind: "npm-pack",
		artifactFormat: "tgz",
		...result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {},
		...result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {},
		...result.npmTarballName ? { npmTarballName: result.npmTarballName } : {}
	}) });
	if (request.source === "git") return await complete(installPluginFromGitSpec({
		...common,
		spec: request.spec,
		mode: request.mode
	}), { install: (result) => ({
		source: "git",
		spec: request.spec,
		installPath: result.targetDir,
		version: result.version,
		resolvedAt: result.git.resolvedAt,
		gitUrl: result.git.url,
		gitRef: result.git.ref,
		gitCommit: result.git.commit
	}) });
	if (request.source === "clawhub") return await complete(installPluginFromClawHub({
		...common,
		spec: request.spec,
		mode: request.mode,
		...request.expectedPluginId ? { expectedPluginId: request.expectedPluginId } : {},
		...request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {},
		...request.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {},
		...request.onClawHubRisk ? { onClawHubRisk: request.onClawHubRisk } : {}
	}), {
		expectedPluginId: request.expectedPluginId,
		install: (result) => ({
			...buildClawHubPluginInstallRecordFields(result.clawhub),
			spec: request.recordSpec ?? request.spec,
			installPath: result.targetDir
		})
	});
	const expectedPluginId = request.source === "official" ? request.pluginId : request.expectedPluginId;
	return await complete(installPluginFromNpmSpec({
		...common,
		spec: request.spec,
		mode: request.mode,
		...request.source === "official" || request.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
		...expectedPluginId ? { expectedPluginId } : {},
		...request.expectedIntegrity ? { expectedIntegrity: request.expectedIntegrity } : {}
	}), {
		expectedPluginId,
		install: (result) => ({
			source: "npm",
			spec: request.pin ? result.npmResolution?.resolvedSpec ?? request.spec : request.recordSpec ?? request.spec,
			installPath: result.targetDir,
			...result.version ? { version: result.version } : {},
			...buildNpmResolutionFields(result.npmResolution)
		})
	});
}
function resolveManagedClawHubInstallRequest(params) {
	const packageName = params.request.packageName.trim();
	const official = resolveOfficialEntryByClawHubPackage(params.officialEntries, packageName);
	const expectedPluginId = official ? resolveDeclaredOfficialPluginId(official) : void 0;
	const hostedOfficial = resolveHostedOfficialEntryByClawHubPackage(params.officialEntries, packageName);
	const hostedInstall = hostedOfficial ? resolveOfficialExternalPluginInstall(hostedOfficial) : void 0;
	const hostedClawHub = parseClawHubPluginSpec(hostedInstall?.clawhubSpec ?? "");
	const requestMatchesHostedCandidate = !params.request.version || params.request.version === hostedClawHub?.version;
	const version = params.request.version ?? (requestMatchesHostedCandidate ? hostedClawHub?.version : void 0);
	const expectedIntegrity = params.expectedIntegrity ?? (requestMatchesHostedCandidate ? hostedInstall?.expectedIntegrity : void 0);
	return {
		source: "clawhub",
		spec: buildClawHubSpec(packageName, version),
		...official ? { trustedSourceLinkedOfficialInstall: true } : {},
		...expectedPluginId ? { expectedPluginId } : {},
		...expectedIntegrity ? { expectedIntegrity } : {},
		...params.request.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}
	};
}
function resolveManagedOfficialInstallRequest(params) {
	const entry = resolveOfficialEntryById(params.officialEntries, params.request.pluginId);
	if (!entry) throw new ManagedPluginLifecycleError(`unknown official plugin catalog entry: ${params.request.pluginId}`);
	const pluginId = resolveOfficialExternalPluginId(entry);
	const install = resolveOfficialExternalPluginInstall(entry);
	if (!pluginId || !install) throw new ManagedPluginLifecycleError(`official plugin catalog entry is not installable: ${params.request.pluginId}`);
	const clawhub = install.clawhubSpec ? parseClawHubPluginSpec(install.clawhubSpec) : void 0;
	if (clawhub) return resolveManagedClawHubInstallRequest({
		request: {
			source: "clawhub",
			packageName: clawhub.name,
			...clawhub.version ? { version: clawhub.version } : {}
		},
		officialEntries: params.officialEntries,
		...install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}
	});
	if (!install.npmSpec) throw new ManagedPluginLifecycleError(`official plugin catalog entry has no supported install source: ${params.request.pluginId}`);
	return {
		source: "official",
		spec: install.npmSpec,
		pluginId,
		mode: "install",
		...install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}
	};
}
/** Install a ClawHub or curated official plugin through the canonical install pipeline. */
async function installManagedPlugin(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({ env }, async () => {
		const snapshot = await readPluginMutationSnapshot(env);
		const officialCatalog = await loadOfficialCatalog();
		const warnings = [];
		const installLogger = createInstallLogger(warnings);
		const installed = await installManagedPluginSource({
			request: params.request.source === "clawhub" ? resolveManagedClawHubInstallRequest({
				request: params.request,
				officialEntries: officialCatalog.entries
			}) : resolveManagedOfficialInstallRequest({
				request: params.request,
				officialEntries: officialCatalog.entries
			}),
			snapshot,
			env,
			logger: installLogger,
			...params.request.acknowledgeCapabilities ? { acknowledgeCapabilities: params.request.acknowledgeCapabilities } : {},
			...params.request.acknowledgeInstallPolicyWarning ? { safetyOverrides: { onInstallPolicyWarning: async () => ({ status: "approved" }) } } : {},
			invalidateRuntimeCache: false,
			runtime: createSilentRuntime()
		});
		if (!installed.ok) return throwInstallFailure(installed);
		warnings.push(...installed.warnings ?? []);
		const workspace = resolvePluginControlPlaneWorkspace({
			config: installed.config,
			env
		});
		if (workspace.diagnostic) warnings.push(workspace.diagnostic.message);
		const catalog = await listManagedPlugins({
			config: installed.config,
			env,
			officialCatalog
		});
		const installedOwnership = resolveInstalledPluginPackageOwnership(resolvePluginMetadataSnapshot(resolveManagedPluginMetadataParams(installed.config, env)).index, installed.pluginId, env);
		if (!installedOwnership.ok) throw new ManagedPluginLifecycleError(installedOwnership.error);
		const installedPluginIds = installedOwnership.value.pluginIds;
		const representativePluginId = installedPluginIds[0];
		const plugin = catalog.plugins.find((entry) => entry.id === representativePluginId);
		if (!plugin) throw new ManagedPluginLifecycleError(`installed plugin missing from refreshed registry: ${installed.pluginId}`);
		return {
			plugin,
			...installedPluginIds.length > 1 || warnings.length > 0 ? { warnings: [...installedPluginIds.length > 1 ? [`Installed package "${installed.pluginId}" with plugin entries: ${installedPluginIds.join(", ")}.`] : [], ...new Set(warnings)] } : {}
		};
	});
}
/** Persist desired plugin policy while preserving allow/deny, slot, include, and hash guards. */
async function setManagedPluginEnabled(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({ env }, async () => {
		const snapshot = await readPluginMutationSnapshot(env);
		const metadata = loadPluginMetadataSnapshot(resolveManagedPluginMetadataParams(snapshot.config, env));
		const pluginId = metadata.normalizePluginId(params.pluginId.trim());
		const installedPlugin = metadata.index.plugins.find((plugin) => plugin.pluginId === pluginId);
		if (!installedPlugin) throw new ManagedPluginLifecycleError(`plugin not installed: ${params.pluginId}`);
		if (params.enabled && !installedPlugin.enabled) await resolvePluginCapabilityConsent({
			config: snapshot.config,
			env,
			pluginId,
			acknowledge: params.acknowledgeCapabilities,
			metadata
		});
		let next = snapshot.config;
		const warnings = [];
		let policyPluginId = pluginId;
		if (params.enabled) {
			if ((next.plugins?.allow?.length ?? 0) > 0) next = ensurePluginAllowlisted(next, pluginId);
			const enableResult = enableExplicitlySelectedPluginInConfig(next, pluginId, { updateChannelConfig: false });
			if (!enableResult.enabled) throw new ManagedPluginLifecycleError(`plugin "${pluginId}" could not be enabled (${enableResult.reason ?? "unknown reason"})`);
			next = enableResult.config;
			policyPluginId = enableResult.pluginId;
			const slotResult = applySlotSelectionForPlugin(next, pluginId);
			next = slotResult.config;
			warnings.push(...slotResult.warnings);
		} else next = setPluginEnabledInConfig(next, pluginId, false, { updateChannelConfig: false });
		const changedPaths = /* @__PURE__ */ new Set();
		collectChangedPaths(snapshot.config, next, "", changedPaths);
		await replaceConfigFile({
			nextConfig: next,
			baseHash: snapshot.baseHash,
			writeOptions: snapshot.writeOptions
		});
		await refreshPluginRegistryAfterConfigMutation({
			config: next,
			env,
			reason: "policy-changed",
			invalidateRuntimeCache: false,
			policyPluginIds: [policyPluginId],
			logger: { warn: (message) => warnings.push(message) }
		});
		const plugin = (await listManagedPlugins({
			config: next,
			env
		})).plugins.find((entry) => entry.id === pluginId);
		if (!plugin) throw new ManagedPluginLifecycleError(`updated plugin missing from refreshed registry: ${pluginId}`);
		return {
			plugin,
			changedPaths: [...changedPaths].filter(Boolean).toSorted(),
			...warnings.length > 0 ? { warnings } : {}
		};
	});
}
/** Remove an installed plugin: config references, install record, and managed files. */
async function uninstallManagedPlugin(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({ env }, async () => {
		const snapshot = await readPluginMutationSnapshot(env);
		const installRecords = await loadInstalledPluginIndexInstallRecords({ env });
		const configWithRecords = withPluginInstallRecords(snapshot.config, installRecords);
		const metadata = loadPluginMetadataSnapshot(resolveManagedPluginMetadataParams(configWithRecords, env));
		const pluginId = metadata.normalizePluginId(params.pluginId.trim());
		const record = metadata.index.plugins.find((plugin) => plugin.pluginId === pluginId);
		if (record?.origin === "bundled") throw new ManagedPluginLifecycleError(`bundled plugin cannot be uninstalled: ${pluginId}; disable it instead`);
		if (!record && !Object.hasOwn(installRecords, pluginId)) throw new ManagedPluginLifecycleError(`Plugin not found: ${pluginId}`);
		const ownership = resolveInstalledPluginPackageOwnership(metadata.index, pluginId, env);
		if (!ownership.ok) throw new ManagedPluginLifecycleError(ownership.error);
		const { installOwner, pluginIds: ownedPluginIds } = ownership.value;
		const ownedManifests = ownedPluginIds.flatMap((entryId) => {
			const manifest = metadata.byPluginId.get(entryId);
			return manifest ? [manifest] : [];
		});
		const channelIds = ownedManifests.length > 0 ? uniqueStrings(ownedManifests.flatMap((manifest) => manifest.channels)) : void 0;
		const extensionsDir = resolveDefaultPluginExtensionsDir(env);
		const initialPlan = planPluginUninstall(recordPluginPackageUninstallPlan({
			config: configWithRecords,
			pluginId: installOwner,
			...channelIds !== void 0 ? { channelIds } : {},
			deleteFiles: true,
			extensionsDir
		}, {
			runtimePluginIds: ownedPluginIds,
			runtimeLoadPaths: ownedPluginIds.flatMap((entryId) => metadata.byPluginId.get(entryId)?.source ?? [])
		}));
		if (!initialPlan.ok) throw new ManagedPluginLifecycleError(initialPlan.error);
		let plan = initialPlan;
		let finalSnapshot = snapshot;
		let directoryResult = {
			directoryRemoved: false,
			warnings: []
		};
		if (plan.directoryRemoval) {
			await replaceConfigFile({
				nextConfig: prepareConfigForPendingPluginDirectoryRemovalSet(snapshot.config, ownedPluginIds),
				baseHash: snapshot.baseHash,
				writeOptions: {
					...snapshot.writeOptions,
					afterWrite: { mode: "auto" }
				}
			});
			directoryResult = await applyPluginUninstallDirectoryRemoval(plan.directoryRemoval);
			if (pluginUninstallTargetExists(plan.directoryRemoval.target)) throw new ManagedPluginLifecycleError(`Failed to remove plugin directory ${plan.directoryRemoval.target}; the plugin remains disabled and tracked so uninstall can be retried.`, { kind: "unavailable" });
			finalSnapshot = await readPluginMutationSnapshot(env);
			const refreshedPlan = planPluginUninstall(recordPluginPackageUninstallPlan({
				config: withPluginInstallRecords(finalSnapshot.config, installRecords),
				pluginId: installOwner,
				...channelIds !== void 0 ? { channelIds } : {},
				deleteFiles: true,
				extensionsDir
			}, {
				runtimePluginIds: ownedPluginIds,
				runtimeLoadPaths: ownedPluginIds.flatMap((entryId) => metadata.byPluginId.get(entryId)?.source ?? [])
			}));
			if (!refreshedPlan.ok) throw new ManagedPluginLifecycleError(refreshedPlan.error);
			plan = refreshedPlan;
		}
		const nextConfig = withoutPluginInstallRecords(plan.config);
		const nextInstallRecords = removePluginInstallRecordFromRecords(installRecords, installOwner);
		await commitPluginInstallRecordsWithConfig({
			previousInstallRecords: installRecords,
			nextInstallRecords,
			nextConfig,
			baseHash: finalSnapshot.baseHash,
			writeOptions: finalSnapshot.writeOptions
		});
		const warnings = [
			...collectClawPluginUninstallWarnings({
				pluginId: installOwner,
				installRecord: installRecords[installOwner],
				env
			}),
			...pluginId !== installOwner || ownedPluginIds.length > 1 ? [`Uninstalled package "${installOwner}" and all owned plugin entries: ${ownedPluginIds.join(", ")}.`] : [],
			...directoryResult.warnings
		];
		await refreshPluginRegistryAfterConfigMutation({
			config: nextConfig,
			env,
			reason: "source-changed",
			installRecords: nextInstallRecords,
			invalidateRuntimeCache: false,
			logger: { warn: (message) => warnings.push(message) }
		});
		return {
			pluginId: installOwner,
			removed: formatUninstallActionLabels({
				...plan.actions,
				directory: directoryResult.directoryRemoved
			}),
			...warnings.length > 0 ? { warnings: [...new Set(warnings)] } : {}
		};
	});
}
//#endregion
export { listManagedPlugins as a, setManagedPluginEnabled as c, installManagedPluginSource as i, uninstallManagedPlugin as l, inspectManagedPlugin as n, resolveManagedPluginIconUrl as o, installManagedPlugin as r, resolveManagedSetupCatalogIconUrl as s, clearManagedPluginOfficialCatalogCache as t };
