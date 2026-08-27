import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { _ as resolveOfficialExternalPluginId, a as getOfficialExternalPluginCatalogEntryForPackage, i as getOfficialExternalPluginCatalogEntry, v as resolveOfficialExternalPluginInstall } from "./official-external-plugin-catalog-BEMBT-Dn.js";
import { n as findBundledPluginSourceInMap, r as getProcessBundledPluginSources } from "./bundled-sources-B9c0tpjJ.js";
//#region src/plugins/official-external-install-trust.ts
function isBareNpmPackageName(spec) {
	const trimmed = spec.trim();
	return /^[a-z0-9][a-z0-9-._~]*$/.test(trimmed);
}
function resolveCatalogInstall(value, lookup) {
	const entry = lookup === "package" ? getOfficialExternalPluginCatalogEntryForPackage(value) : getOfficialExternalPluginCatalogEntry(value);
	if (!entry) return;
	const pluginId = resolveOfficialExternalPluginId(entry);
	if (!pluginId) return;
	const install = resolveOfficialExternalPluginInstall(entry);
	return {
		pluginId,
		...install?.npmSpec ? { npmSpec: install.npmSpec } : {},
		...install?.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}
	};
}
function resolveOfficialExternalInstallPlanBeforeNpm(params) {
	if (!isBareNpmPackageName(params.rawSpec)) return null;
	const entry = params.findOfficialExternalPlugin(params.rawSpec);
	const npmSpec = entry?.npmSpec?.trim();
	if (!entry?.pluginId || !npmSpec) return null;
	return {
		pluginId: entry.pluginId,
		npmSpec,
		...entry.expectedIntegrity ? { expectedIntegrity: entry.expectedIntegrity } : {}
	};
}
function resolveOfficialExternalNpmPackageTrust(params) {
	const parsed = parseRegistryNpmSpec(params.npmSpec);
	if (!parsed) return null;
	const entry = params.findOfficialExternalPackage(parsed.name);
	if (!entry?.pluginId) return null;
	const catalogSpec = entry.npmSpec?.trim();
	const catalogPackageName = catalogSpec ? parseRegistryNpmSpec(catalogSpec)?.name : void 0;
	if (catalogPackageName && catalogPackageName !== parsed.name) return null;
	return {
		pluginId: entry.pluginId,
		...entry.expectedIntegrity && catalogSpec === params.npmSpec.trim() ? { expectedIntegrity: entry.expectedIntegrity } : {},
		trustedSourceLinkedOfficialInstall: true
	};
}
function resolveCatalogOfficialExternalInstallPlan(rawSpec) {
	return resolveOfficialExternalInstallPlanBeforeNpm({
		rawSpec,
		findOfficialExternalPlugin: (pluginId) => resolveCatalogInstall(pluginId, "plugin")
	});
}
function resolveCatalogOfficialExternalNpmPackageTrust(npmSpec) {
	return resolveOfficialExternalNpmPackageTrust({
		npmSpec,
		findOfficialExternalPackage: (packageName) => resolveCatalogInstall(packageName, "package")
	});
}
//#endregion
//#region src/plugins/install-provenance.ts
const NON_CLAWHUB_INSTALL_FORCE_FLAG = "--force";
function resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources = getProcessBundledPluginSources()) {
	const packageName = parseRegistryNpmSpec(npmSpec)?.name;
	if (!packageName) return null;
	const bundled = findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "npmSpec",
			value: packageName
		}
	});
	if (bundled) return { pluginId: bundled.pluginId };
	return resolveCatalogOfficialExternalNpmPackageTrust(npmSpec);
}
function isOpenClawTrustedPluginInstallSpec(spec, bundledSources = getProcessBundledPluginSources()) {
	const trimmed = spec.trim();
	if (trimmed.toLowerCase().startsWith("clawhub:")) return true;
	const explicitNpm = trimmed.toLowerCase().startsWith("npm:");
	const npmSpec = explicitNpm ? trimmed.slice(4) : trimmed;
	if (explicitNpm) return resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources) !== null;
	const parsedPackageName = parseRegistryNpmSpec(npmSpec)?.name;
	const bundled = findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "pluginId",
			value: npmSpec
		}
	}) ?? (parsedPackageName ? findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "npmSpec",
			value: parsedPackageName
		}
	}) : void 0) ?? findBundledPluginSourceInMap({
		bundled: bundledSources,
		lookup: {
			kind: "localPath",
			value: npmSpec
		}
	});
	return Boolean(bundled ?? resolveOpenClawTrustedNpmPackageInstall(npmSpec, bundledSources) ?? resolveCatalogOfficialExternalInstallPlan(npmSpec));
}
const sourceClassLabels = {
	git: "Git repository",
	"local-archive": "local archive",
	"local-path": "local path",
	marketplace: "marketplace source",
	npm: "npm registry",
	"npm-pack": "local npm-pack archive"
};
function formatNonClawHubInstallWarning(params) {
	return [`WARNING - Installing plugin from ${sourceClassLabels[params.sourceClass]}: ${sanitizeTerminalText(params.spec)}`, "This source is outside ClawHub review and trust metadata. Only continue if you trust the publisher, package contents, and install source."].join("\n");
}
//#endregion
export { resolveCatalogOfficialExternalInstallPlan as a, resolveOpenClawTrustedNpmPackageInstall as i, formatNonClawHubInstallWarning as n, isOpenClawTrustedPluginInstallSpec as r, NON_CLAWHUB_INSTALL_FORCE_FLAG as t };
