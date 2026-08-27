import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { c as tryReadJson } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import path from "node:path";
//#region src/infra/package-json.ts
/** Reads package.json as a loose object, returning null for missing or invalid manifests. */
async function readPackageJson(root) {
	return asNullableRecord(await tryReadJson(path.join(root, "package.json")));
}
/** Reads and trims the package version string, returning null for blank or non-string values. */
async function readPackageVersion(root) {
	return normalizeNullableString((await readPackageJson(root))?.version);
}
/** Reads and trims the package name string, returning null for blank or non-string values. */
async function readPackageName(root) {
	return normalizeNullableString((await readPackageJson(root))?.name);
}
/** Reads and trims the packageManager spec, returning null for blank or non-string values. */
async function readPackageManagerSpec(root) {
	return normalizeNullableString((await readPackageJson(root))?.packageManager);
}
//#endregion
export { readPackageName as n, readPackageVersion as r, readPackageManagerSpec as t };
