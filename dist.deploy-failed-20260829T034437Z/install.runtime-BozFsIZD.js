import { a as isPathInside } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { n as readJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata, o as resolvePackageExtensionEntries, r as loadPluginManifest } from "./manifest-DFeZvDdx.js";
import { l as resolveRuntimeServiceVersion, s as resolveCompatibilityHostVersion } from "./version-CkBmshxX.js";
import { a as detectBundleManifestFormat, o as loadBundleManifest } from "./bundle-manifest-BaJfS3mk.js";
import { u as validateRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { t as checkMinHostVersion } from "./min-host-version-CHH9FiYY.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-D2m0UUwS.js";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-BwXj3nrc.js";
import { t as installPackageDir } from "./install-package-dir-B1M2mVjW.js";
import { a as scanFileInstallSource, i as scanBundleInstallSource, o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-CeLvjpeg.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-zTo7dqst.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export { checkMinHostVersion, detectBundleManifestFormat, ensureInstallTargetAvailable, pathExists as fileExists, finalizeNpmSpecArchiveInstall, getPackageManifestMetadata, installFromNpmSpecArchiveWithInstaller, installPackageDir, isPathInside, loadBundleManifest, loadPluginManifest, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveCompatibilityHostVersion, resolveExistingInstallPath, resolveInstallModeOptions, resolvePackageExtensionEntries, resolveRuntimeServiceVersion, resolveTimedInstallModeOptions, root, scanBundleInstallSource, scanFileInstallSource, scanInstalledPackageDependencyTree, scanPackageInstallSource, validateRegistryNpmSpec, withExtractedArchiveRoot };
