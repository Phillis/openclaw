import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
import { _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, b as resolveOfficialExternalPluginLegacyIds, i as getOfficialExternalPluginCatalogEntry, v as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-DlrV8XyO.js";
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
export { resolveTrustedSourceLinkedOfficialNpmInstall as a, resolveTrustedSourceLinkedOfficialClawHubSpec as i, resolveTrustedOfficialClawHubPackageName as n, resolveTrustedSourceLinkedOfficialNpmSpec as o, resolveTrustedSourceLinkedOfficialClawHubInstall as r, hasOfficialNpmIdReplacement as t };
