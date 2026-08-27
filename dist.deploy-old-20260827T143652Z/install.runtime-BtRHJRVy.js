import "./redact-Cl7lwBnl.js";
import { a as isPathInside, o as isPathInsideWithRealpath } from "./path-D138yf8v.js";
import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import "./fs-safe-C9N8pCh1.js";
import { n as readJson } from "./json-BE1X9L-o.js";
import "./json-files-C6dF5uZO.js";
import { l as validateRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-DqwMuR5d.js";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-BA0ixVO8.js";
import { n as installPackageDirWithManifestDeps, t as installPackageDir } from "./install-package-dir-CBvlaFS_.js";
import { a as finalizeNpmSpecArchiveInstall, i as resolveTimedInstallModeOptions, n as resolveCanonicalInstallTarget, o as installFromNpmSpecArchiveWithInstaller, r as resolveInstallModeOptions, t as ensureInstallTargetAvailable } from "./install-target-NB1f1Tpb.js";
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
