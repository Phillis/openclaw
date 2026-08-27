import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { At as boolean, Et as array, Rn as string, Tn as object, Xn as union, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, b as resolveOfficialExternalPluginLegacyIds, i as getOfficialExternalPluginCatalogEntry, v as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-C1KgYx9P.js";
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
	marketplacePlugin: string().optional(),
	acceptedSurface: object({
		channels: array(string().min(1)),
		providers: array(string().min(1)),
		tools: array(string().min(1)),
		contracts: array(string().min(1)),
		hooks: array(string().min(1)),
		mcpServers: array(string().min(1)),
		cliCommands: array(string().min(1)),
		cliBackends: array(string().min(1)),
		skills: array(string().min(1)),
		dangerousConfigFlags: array(string().min(1))
	}).strict().optional(),
	acceptedSurfaceHash: string().optional(),
	acceptedSurfaceAt: string().optional(),
	acceptedSurfaceIntegrity: string().optional()
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
	"marketplacePlugin",
	"acceptedSurfaceHash",
	"acceptedSurfaceAt",
	"acceptedSurfaceIntegrity"
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
//#region src/plugins/official-external-install-records.ts
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveClawHubSpecPackageName(spec) {
	return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function resolveExactNpmPackageName(value) {
	const packageName = resolveNpmSpecPackageName(value);
	return packageName && value.trim() === packageName ? packageName : void 0;
}
function resolveUnanimousRecordedNpmPackageName(record) {
	if (record.source !== "npm") return;
	const packageNames = [];
	const fields = [
		[record.spec, resolveNpmSpecPackageName],
		[record.resolvedName, resolveExactNpmPackageName],
		[record.resolvedSpec, resolveNpmSpecPackageName]
	];
	for (const [value, resolvePackageName] of fields) {
		if (value === void 0) continue;
		const packageName = resolvePackageName(value);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames.length > 0 && new Set(packageNames).size === 1 ? packageNames[0] : void 0;
}
function resolveOfficialPackageNames(params) {
	return [
		resolveClawHubSpecPackageName(params.clawhubSpec),
		resolveNpmSpecPackageName(params.npmSpec),
		params.entry.name
	].filter((value) => Boolean(value));
}
function resolveRecordedClawHubPackageNames(record) {
	const packageNames = [];
	if (record.clawhubPackage !== void 0) {
		const packageName = resolveExactNpmPackageName(record.clawhubPackage);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.spec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.spec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedSpec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.resolvedSpec) ?? resolveNpmSpecPackageName(record.resolvedSpec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedName !== void 0) {
		const packageName = resolveExactNpmPackageName(record.resolvedName);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames;
}
function isOfficialClawHubInstallRecord(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
	return (record.clawhubUrl ?? "").trim().replace(/\/+$/, "") === "https://clawhub.ai";
}
/** Resolves one package identity from a current trusted official ClawHub install record. */
function resolveTrustedOfficialClawHubPackageName(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official" || (record.clawhubUrl ?? "").trim().replace(/\/+$/, "") !== "https://clawhub.ai") return;
	const packageNames = resolveRecordedClawHubPackageNames(record);
	if (!packageNames || packageNames.length === 0 || new Set(packageNames).size !== 1) return;
	return packageNames[0];
}
function hasTrustedClawHubSourceAuthority(record, officialClawHubSpec) {
	if (record.clawhubUrl !== void 0 || record.clawhubChannel !== void 0) return isOfficialClawHubInstallRecord(record);
	return Boolean(officialClawHubSpec && record.spec && resolveClawHubSpecPackageName(record.spec) === resolveClawHubSpecPackageName(officialClawHubSpec));
}
/** Resolves exact package-bound official npm identity and any declared id migration. */
function resolveTrustedSourceLinkedOfficialNpmInstall(params) {
	if (params.record.source !== "npm") return;
	const canonicalEntry = getOfficialExternalPluginCatalogEntry(params.pluginId);
	if (canonicalEntry) {
		const officialSpec = resolveOfficialExternalPluginInstall(canonicalEntry)?.npmSpec;
		const packageName = resolveNpmSpecPackageName(officialSpec);
		const recordedPackageNames = [
			params.record.resolvedName,
			resolveNpmSpecPackageName(params.record.spec),
			resolveNpmSpecPackageName(params.record.resolvedSpec)
		].filter((value) => Boolean(value));
		if (officialSpec && packageName && recordedPackageNames.includes(packageName)) return {
			npmSpec: officialSpec,
			pluginId: params.pluginId
		};
	}
	const packageName = resolveUnanimousRecordedNpmPackageName(params.record);
	const entry = packageName ? getOfficialExternalPluginCatalogEntryForPackage(packageName) : void 0;
	if (!entry) return;
	const officialSpec = resolveOfficialExternalPluginInstall(entry)?.npmSpec;
	const officialPackageName = resolveNpmSpecPackageName(officialSpec);
	const canonicalPluginId = resolveOfficialExternalPluginId(entry);
	if (!packageName || !officialSpec || officialPackageName !== packageName || !canonicalPluginId || params.pluginId === canonicalPluginId || !resolveOfficialExternalPluginLegacyIds(entry).includes(params.pluginId)) return;
	return {
		npmSpec: officialSpec,
		pluginId: canonicalPluginId,
		replacementPluginId: canonicalPluginId
	};
}
/** Resolves the official npm spec when an install record matches the trusted catalog package. */
function resolveTrustedSourceLinkedOfficialNpmSpec(params) {
	return resolveTrustedSourceLinkedOfficialNpmInstall(params)?.npmSpec;
}
function hasOfficialNpmIdReplacement(params) {
	return params.record !== void 0 && resolveTrustedSourceLinkedOfficialNpmInstall({
		pluginId: params.pluginId,
		record: params.record
	})?.replacementPluginId !== void 0;
}
/** Resolves the official ClawHub spec when a trusted-source install record matches. */
function resolveTrustedSourceLinkedOfficialClawHubSpec(params) {
	return resolveTrustedSourceLinkedOfficialClawHubInstall(params)?.clawhubSpec;
}
/** Resolves official ClawHub/npm specs linked to a trusted-source install record. */
function resolveTrustedSourceLinkedOfficialClawHubInstall(params) {
	if (params.record.source !== "clawhub") return;
	const entry = getOfficialExternalPluginCatalogEntry(params.pluginId);
	if (!entry) return;
	const install = resolveOfficialExternalPluginInstall(entry);
	const officialClawHubSpec = install?.clawhubSpec;
	const officialNpmSpec = install?.npmSpec;
	if (!officialClawHubSpec && !officialNpmSpec) return;
	const officialNames = resolveOfficialPackageNames({
		entry,
		npmSpec: officialNpmSpec,
		clawhubSpec: officialClawHubSpec
	});
	if (officialNames.length === 0) return;
	if (params.record.clawhubPackage === void 0 && params.record.spec === void 0) return;
	const recordedPackageNames = resolveRecordedClawHubPackageNames(params.record);
	if (!hasTrustedClawHubSourceAuthority(params.record, officialClawHubSpec) || !recordedPackageNames || recordedPackageNames.length === 0 || !recordedPackageNames.every((name) => officialNames.includes(name))) return;
	return {
		...officialClawHubSpec ? { clawhubSpec: officialClawHubSpec } : {},
		...officialNpmSpec ? { npmSpec: officialNpmSpec } : {}
	};
}
//#endregion
export { resolveTrustedSourceLinkedOfficialNpmInstall as a, copyPluginInstallRecordMap as c, inspectPluginInstallRecordMap as d, parsePluginInstallRecord as f, setPluginInstallRecordMapEntry as h, resolveTrustedSourceLinkedOfficialClawHubSpec as i, createPluginInstallRecordMap as l, serializePluginInstallRecordMap as m, resolveTrustedOfficialClawHubPackageName as n, resolveTrustedSourceLinkedOfficialNpmSpec as o, parsePluginInstallRecordMap as p, resolveTrustedSourceLinkedOfficialClawHubInstall as r, PluginInstallRecordSchema as s, hasOfficialNpmIdReplacement as t, getPluginInstallRecordMapEntry as u };
