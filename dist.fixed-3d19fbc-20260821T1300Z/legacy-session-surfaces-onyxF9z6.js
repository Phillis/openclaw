import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as openRootFileSync } from "./root-file-CdmcBz8_.js";
import { t as describeRootFileOpenFailure } from "./boundary-file-read-Dy4MeTWa.js";
import { n as getCachedPluginModuleLoader, t as createPluginModuleLoaderCache } from "./plugin-module-loader-cache-O65paH_z.js";
import { s as normalizePluginsConfig } from "./config-state-DLiU5GYQ.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-BTVZ3DhS.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { c as shouldIncludeChannelSetupFeatureForConfig } from "./doctor-contract-registry-Bji_8NSw.js";
import { n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-DHFjJfjG.js";
import { k as createEmptyPluginRegistry } from "./runtime-LV4GwzTm.js";
import { l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-CdpkZk_Q.js";
import { n as resolveCanonicalDistRuntimeSource, r as resolvePluginRuntimeArtifact } from "./plugin-runtime-artifact-resolution-CnZ8RXPb.js";
import { i as resolvePluginRuntimeLoadContext } from "./load-context-DCsonorK.js";
import "./channel-plugin-ids-PXSMuTP5.js";
import fs from "node:fs";
//#region src/plugins/legacy-session-surfaces.types.ts
const EMPTY_LEGACY_SESSION_SURFACES = Object.freeze({
	surfaces: Object.freeze([]),
	failures: Object.freeze([])
});
//#endregion
//#region src/plugins/legacy-session-surfaces.ts
function prepareResult(surfaces, failures) {
	return Object.freeze({
		surfaces: Object.freeze(surfaces),
		failures: Object.freeze(failures)
	});
}
function formatLoadFailure(pluginId, detail) {
	return `Deferred legacy session-key migration for channel owner "${pluginId}": ${detail}. Restore or reinstall the plugin setup entry, then rerun openclaw doctor --fix`;
}
function resolveLegacySessionSurface(moduleExport) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
	if (!resolved || typeof resolved !== "object") throw new Error("setup entry does not export loadLegacySessionSurface");
	const setupEntry = resolved;
	if (setupEntry.kind !== "bundled-channel-setup-entry" || typeof setupEntry.loadLegacySessionSurface !== "function") throw new Error("setup entry does not export loadLegacySessionSurface");
	const surface = setupEntry.loadLegacySessionSurface();
	if (!isRecord(surface)) throw new Error("legacy session surface must be an object");
	const isGroupKey = surface.isLegacyGroupSessionKey;
	const canonicalizeKey = surface.canonicalizeLegacySessionKey;
	if (isGroupKey !== void 0 && typeof isGroupKey !== "function" || typeof canonicalizeKey !== "function") throw new Error("legacy session surface must declare canonicalizeLegacySessionKey");
	return surface;
}
function isEnabledLegacySurfaceOwner(params) {
	if (!shouldIncludeChannelSetupFeatureForConfig({
		plugin: params.record,
		config: params.config
	})) return false;
	if (isBundledManifestOwner(params.record)) return true;
	if (params.record.origin === "global" || params.record.origin === "config") return hasExplicitManifestOwnerTrust({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig
	});
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
function loadLegacySessionSurface(params) {
	const setupEntry = resolvePluginRuntimeArtifact({
		pluginId: params.record.id,
		entryKind: "setup",
		source: params.record.setupSource,
		rootDir: params.record.rootDir,
		origin: params.record.origin,
		preferBuiltPluginArtifacts: false,
		packageManifest: params.record.packageManifest,
		registry: params.artifactRegistry
	});
	const moduleSource = resolveCanonicalDistRuntimeSource(setupEntry.source);
	const opened = openRootFileSync({
		absolutePath: moduleSource,
		rootPath: resolveCanonicalDistRuntimeSource(setupEntry.rootDir),
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: params.record.origin,
			rootDir: params.record.rootDir,
			env: params.env
		}),
		skipLexicalRootCheck: true
	});
	if (!opened.ok) throw new Error(describeRootFileOpenFailure({
		failure: opened,
		subject: "plugin setup entry path",
		boundaryLabel: "plugin root",
		filePath: moduleSource
	}));
	const safeSource = opened.path;
	fs.closeSync(opened.fd);
	return resolveLegacySessionSurface(getCachedPluginModuleLoader({
		cache: params.moduleLoaders,
		modulePath: safeSource,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url
	})(safeSource));
}
/** Resolves immutable session surfaces from the exact configured channel-owner snapshot. */
function prepareLegacySessionSurfaces(params) {
	const context = params.context ?? resolvePluginRuntimeLoadContext({
		config: params.config,
		env: params.env
	});
	const manifestRecords = context.manifestRegistry?.plugins ?? [];
	const selectedPluginIds = new Set(resolveConfiguredChannelPluginIds({
		config: context.config,
		activationSourceConfig: context.activationSourceConfig,
		workspaceDir: context.workspaceDir,
		env: context.env,
		manifestRecords
	}));
	const normalizedConfig = normalizePluginsConfig(context.activationSourceConfig.plugins);
	for (const record of manifestRecords) if (record.packageManifest?.setupFeatures?.legacySessionSurfaces === true && isEnabledLegacySurfaceOwner({
		record,
		config: context.activationSourceConfig,
		normalizedConfig
	})) selectedPluginIds.add(record.id);
	const declaringRecords = manifestRecords.filter((record) => selectedPluginIds.has(record.id) && record.packageManifest?.setupFeatures?.legacySessionSurfaces === true);
	if (declaringRecords.length === 0) return EMPTY_LEGACY_SESSION_SURFACES;
	const failures = declaringRecords.flatMap((record) => record.setupSource ? [] : [formatLoadFailure(record.id, "package metadata declares the surface but has no setupEntry")]);
	const loadableRecords = declaringRecords.filter((record) => Boolean(record.setupSource));
	if (loadableRecords.length === 0) return prepareResult([], failures);
	const surfaces = [];
	const moduleLoaders = createPluginModuleLoaderCache();
	const artifactRegistry = createEmptyPluginRegistry();
	for (const record of loadableRecords) try {
		surfaces.push(loadLegacySessionSurface({
			record,
			env: context.env,
			moduleLoaders,
			artifactRegistry
		}));
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		failures.push(formatLoadFailure(record.id, detail));
	}
	return prepareResult(surfaces, failures);
}
//#endregion
export { prepareLegacySessionSurfaces };
