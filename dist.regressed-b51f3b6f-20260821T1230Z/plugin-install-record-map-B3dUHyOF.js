import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { At as boolean, Et as array, Rn as string, Tn as object, Xn as union, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
	literal("npm"),
	literal("archive"),
	literal("path"),
	literal("clawhub"),
	literal("git")
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
//#endregion
//#region src/config/plugin-install-record-map.ts
const PluginInstallRecordSchema = object({
	source: InstallSourceSchema,
	spec: string().optional(),
	sourcePath: string().optional(),
	installPath: string().optional(),
	version: string().optional(),
	resolvedName: string().optional(),
	resolvedVersion: string().optional(),
	resolvedSpec: string().optional(),
	integrity: string().optional(),
	shasum: string().optional(),
	resolvedAt: string().optional(),
	installedAt: string().optional(),
	clawhubUrl: string().optional(),
	clawhubPackage: string().optional(),
	clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
	clawhubChannel: union([
		literal("official"),
		literal("community"),
		literal("private")
	]).optional(),
	clawhubTrustDisposition: union([
		literal("clean"),
		literal("review-recommended"),
		literal("review-required"),
		literal("blocked")
	]).optional(),
	clawhubTrustScanStatus: string().optional(),
	clawhubTrustModerationState: string().optional(),
	clawhubTrustReasons: array(string()).optional(),
	clawhubTrustPending: boolean().optional(),
	clawhubTrustStale: boolean().optional(),
	clawhubTrustCheckedAt: string().optional(),
	clawhubTrustAcknowledgedAt: string().optional(),
	artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
	artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
	npmIntegrity: string().optional(),
	npmShasum: string().optional(),
	npmTarballName: string().optional(),
	clawpackSha256: string().optional(),
	clawpackSpecVersion: number().int().nonnegative().optional(),
	clawpackManifestSha256: string().optional(),
	clawpackSize: number().int().nonnegative().optional(),
	gitUrl: string().optional(),
	gitRef: string().optional(),
	gitCommit: string().optional(),
	source: PluginInstallSourceSchema,
	marketplaceName: string().optional(),
	marketplaceSource: string().optional(),
	marketplacePlugin: string().optional()
}).passthrough();
const NORMALIZED_STRING_FIELDS = [
	"spec",
	"sourcePath",
	"installPath",
	"version",
	"resolvedName",
	"resolvedVersion",
	"resolvedSpec",
	"integrity",
	"shasum",
	"resolvedAt",
	"installedAt",
	"clawhubUrl",
	"clawhubPackage",
	"clawhubFamily",
	"clawhubChannel",
	"clawhubTrustDisposition",
	"clawhubTrustScanStatus",
	"clawhubTrustModerationState",
	"clawhubTrustCheckedAt",
	"clawhubTrustAcknowledgedAt",
	"artifactKind",
	"artifactFormat",
	"npmIntegrity",
	"npmShasum",
	"npmTarballName",
	"clawpackSha256",
	"clawpackManifestSha256",
	"gitUrl",
	"gitRef",
	"gitCommit",
	"marketplaceName",
	"marketplaceSource",
	"marketplacePlugin"
];
const utf8Encoder = new TextEncoder();
function comparePluginIds(left, right) {
	const leftBytes = utf8Encoder.encode(left);
	const rightBytes = utf8Encoder.encode(right);
	const sharedLength = Math.min(leftBytes.length, rightBytes.length);
	for (let index = 0; index < sharedLength; index += 1) {
		const difference = (leftBytes[index] ?? 0) - (rightBytes[index] ?? 0);
		if (difference !== 0) return difference;
	}
	return leftBytes.length - rightBytes.length;
}
function createPluginInstallRecordMap() {
	return Object.create(null);
}
function setPluginInstallRecordMapEntry(records, pluginId, record) {
	Object.defineProperty(records, pluginId, {
		configurable: true,
		enumerable: true,
		value: record,
		writable: true
	});
}
function getPluginInstallRecordMapEntry(records, pluginId) {
	return records && Object.hasOwn(records, pluginId) ? records[pluginId] : void 0;
}
function copyPluginInstallRecordMap(records) {
	const copied = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(records ?? {})) setPluginInstallRecordMapEntry(copied, pluginId, record);
	return copied;
}
function parsePluginInstallRecord(value) {
	const parsed = PluginInstallRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const record = parsed.data;
	for (const field of NORMALIZED_STRING_FIELDS) {
		const fieldValue = record[field];
		if (typeof fieldValue !== "string") continue;
		const normalized = fieldValue.trim();
		if (normalized) record[field] = normalized;
		else delete record[field];
	}
	if (record.clawhubTrustReasons) {
		const reasons = record.clawhubTrustReasons.map((entry) => entry.trim()).filter(Boolean);
		if (reasons.length > 0) record.clawhubTrustReasons = reasons;
		else delete record.clawhubTrustReasons;
	}
	return record;
}
function parsePluginInstallRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(value)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) return null;
		setPluginInstallRecordMapEntry(records, pluginId, record);
	}
	return records;
}
function inspectPluginInstallRecordMap(value) {
	if (value === void 0) return { status: "missing" };
	const records = parsePluginInstallRecordMap(value);
	return records ? {
		status: "valid",
		records
	} : { status: "invalid" };
}
/**
* Object enumeration reorders integer-index keys, so persisted bytes must be
* assembled from sorted entries instead of relying on object insertion order.
*/
function serializePluginInstallRecordMap(records) {
	return `{${Object.entries(records).toSorted(([left], [right]) => comparePluginIds(left, right)).map(([pluginId, record]) => `${JSON.stringify(pluginId)}:${JSON.stringify(record)}`).join(",")}}`;
}
//#endregion
export { inspectPluginInstallRecordMap as a, serializePluginInstallRecordMap as c, getPluginInstallRecordMapEntry as i, setPluginInstallRecordMapEntry as l, copyPluginInstallRecordMap as n, parsePluginInstallRecord as o, createPluginInstallRecordMap as r, parsePluginInstallRecordMap as s, PluginInstallRecordSchema as t };
