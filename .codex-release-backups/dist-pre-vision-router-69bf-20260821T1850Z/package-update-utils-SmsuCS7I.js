import { a as readRootJsonObjectSync } from "./json-C_hP6p1e.js";
//#region src/infra/package-update-utils.ts
/** Return expected integrity only for concrete semver package specs. */
function expectedIntegrityForUpdate(spec, integrity) {
	if (!integrity || !spec) return;
	const value = spec.trim();
	if (!value) return;
	const at = value.lastIndexOf("@");
	if (at <= 0 || at >= value.length - 1) return;
	const version = value.slice(at + 1).trim();
	if (!/^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) return;
	return integrity;
}
function readInstalledPackageManifest(dir) {
	const result = readRootJsonObjectSync({
		rootDir: dir,
		relativePath: "package.json",
		boundaryLabel: "installed package directory"
	});
	return result.ok ? result.value : void 0;
}
/** Read the installed package version from a package root. */
async function readInstalledPackageVersion(dir) {
	const manifest = readInstalledPackageManifest(dir);
	return typeof manifest?.version === "string" ? manifest.version : void 0;
}
//#endregion
export { readInstalledPackageManifest as n, readInstalledPackageVersion as r, expectedIntegrityForUpdate as t };
