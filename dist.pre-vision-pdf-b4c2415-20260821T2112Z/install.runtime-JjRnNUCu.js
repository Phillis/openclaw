import { a as isPathInside } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import { r as root } from "./fs-safe-C9N8pCh1.js";
import { n as readJson } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata, o as resolvePackageExtensionEntries, r as loadPluginManifest } from "./manifest-BmA-DH7w.js";
import { l as resolveRuntimeServiceVersion, s as resolveCompatibilityHostVersion } from "./version-o4XN9fka.js";
import { a as detectBundleManifestFormat, o as loadBundleManifest } from "./bundle-manifest-BxBJbko_.js";
import { l as validateRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as checkMinHostVersion } from "./min-host-version-B63loSc6.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-DqwMuR5d.js";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-BA0ixVO8.js";
import { t as installPackageDir } from "./install-package-dir-CBvlaFS_.js";
import { a as scanFileInstallSource, i as scanBundleInstallSource, o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-Ix-vNSaq.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-NB1f1Tpb.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, pathExists as fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, root, scanBundleInstallSource, scanFileInstallSource, scanInstalledPackageDependencyTree, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot };
