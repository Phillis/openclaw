import "./redact-DP7p9QfH.js";
import { a as isPathInside, o as isPathInsideWithRealpath } from "./path-CYL8StfC.js";
import { s as pathExists } from "./absolute-path-DBVN5h2m.js";
import "./fs-safe-X_oyl7Rx.js";
import { n as readJson } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import { l as validateRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as resolveArchiveKind } from "./archive-Bspx_Gv4.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-DyDPgWM7.js";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-UY7Rt_sS.js";
import { n as installPackageDirWithManifestDeps, t as installPackageDir } from "./install-package-dir-C42XyOJV.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-BhROzw1m.js";
//#region src/infra/install-from-npm-spec.ts
/**
* Validates a registry npm spec, downloads its archive, and delegates final installation.
* The caller supplies archive-specific params without `archivePath`; this helper injects
* the downloaded archive path and normalizes the npm archive flow result.
*/
async function installFromValidatedNpmSpecArchive(params) {
	const spec = params.spec.trim();
	const specError = validateRegistryNpmSpec(spec);
	if (specError) return {
		ok: false,
		error: specError
	};
	return finalizeNpmSpecArchiveInstall(await installFromNpmSpecArchiveWithInstaller({
		tempDirPrefix: params.tempDirPrefix,
		spec,
		timeoutMs: params.timeoutMs,
		expectedIntegrity: params.expectedIntegrity,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: params.warn,
		installFromArchive: params.installFromArchive,
		archiveInstallParams: params.archiveInstallParams
	}));
}
//#endregion
export { ensureInstallTargetAvailable, pathExists as fileExists, installFromValidatedNpmSpecArchive, installPackageDir, installPackageDirWithManifestDeps, isPathInside, isPathInsideWithRealpath, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveExistingInstallPath, resolveInstallModeOptions, resolveTimedInstallModeOptions, withExtractedArchiveRoot };
