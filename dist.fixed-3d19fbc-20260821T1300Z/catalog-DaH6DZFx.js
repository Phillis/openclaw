import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { d as resolveConfigDir } from "./utils-D9gvQMP6.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { l as tryReadJsonSync } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { o as isPrereleaseSemverVersion, s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { u as describePluginInstallSource } from "./installed-plugin-index-uuE4SyLf.js";
import { u as listOfficialExternalChannelCatalogEntries } from "./official-external-plugin-catalog-BEMBT-Dn.js";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-CfYcuOsn.js";
import { t as buildManifestChannelMeta } from "./channel-meta-Db2pD5EX.js";
import path from "node:path";
//#region src/channels/plugins/catalog.ts
/**
* Channel plugin catalog builder.
*
* Combines bundled, installed, and official external channel metadata for UI/setup surfaces.
*/
const ORIGIN_PRIORITY = {
	config: 0,
	workspace: 1,
	global: 2,
	bundled: 3
};
function shouldExcludeCatalogEntry(options, pluginId, origin) {
	const normalizedPluginId = normalizeOptionalString(pluginId);
	return options.excludeWorkspace === true && origin === "workspace" || origin !== void 0 && (options.excludeOrigins?.includes(origin) ?? false) || Boolean(normalizedPluginId && options.excludePluginRefs?.some((entry) => entry.pluginId === normalizedPluginId && (entry.origin === void 0 || entry.origin === origin)));
}
const EXTERNAL_CATALOG_PRIORITY = ORIGIN_PRIORITY.bundled + 1;
const FALLBACK_CATALOG_PRIORITY = EXTERNAL_CATALOG_PRIORITY + 1;
const ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
const catalogEntriesByPath = /* @__PURE__ */ new Map();
registerPluginMetadataProcessMemoLifecycleClear(() => catalogEntriesByPath.clear());
function parseCatalogEntries(raw) {
	const list = Array.isArray(raw) ? raw : isRecord(raw) ? raw.entries ?? raw.packages ?? raw.plugins : void 0;
	return Array.isArray(list) ? list.filter((entry) => isRecord(entry)) : [];
}
function resolveExternalCatalogPaths(options) {
	if (options.catalogPaths && options.catalogPaths.length > 0) return normalizeStringEntries(options.catalogPaths);
	const env = options.env ?? process.env;
	for (const key of ENV_CATALOG_PATHS) {
		const raw = env[key];
		if (raw?.trim()) return normalizeStringEntries(raw.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)));
	}
	const configDir = resolveConfigDir(env);
	return [
		"mpm/plugins.json",
		"mpm/catalog.json",
		"plugins/catalog.json"
	].map((relativePath) => path.join(configDir, relativePath));
}
function loadCatalogEntriesFromPaths(paths, cache) {
	const entries = [];
	for (const resolvedPath of paths) {
		let parsed = cache?.get(resolvedPath);
		if (parsed === void 0) {
			const payload = tryReadJsonSync(resolvedPath);
			parsed = payload === null ? null : parseCatalogEntries(payload);
			cache?.set(resolvedPath, parsed);
		}
		if (parsed !== null) entries.push(...parsed);
	}
	return entries;
}
function resolveOfficialCatalogPaths(options) {
	if (options.officialCatalogPaths && options.officialCatalogPaths.length > 0) return normalizeStringEntries(options.officialCatalogPaths);
	const candidates = uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry))).map((packageRoot) => path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
	if (process.execPath) {
		const execDir = path.dirname(process.execPath);
		candidates.push(path.join(execDir, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH));
		candidates.push(path.join(execDir, "channel-catalog.json"));
	}
	return uniqueStrings(candidates);
}
function resolveInstallInfo(params) {
	const clawhubSpec = normalizeOptionalString(params.install?.clawhubSpec);
	let npmSpec = normalizeOptionalString(params.install?.npmSpec) ?? normalizeOptionalString(params.packageName);
	const packageVersion = normalizeOptionalString(params.packageVersion);
	const parsedNpmSpec = npmSpec ? parseRegistryNpmSpec(npmSpec) : null;
	const expectedPackageName = normalizeOptionalString(params.packageName);
	const parsedPackageName = expectedPackageName ? parseRegistryNpmSpec(expectedPackageName) : null;
	if (npmSpec && packageVersion && isPrereleaseSemverVersion(packageVersion) && parsedNpmSpec?.selectorKind === "none" && (!parsedPackageName || parsedNpmSpec.name === parsedPackageName.name)) npmSpec = `${parsedNpmSpec.name}@${packageVersion}`;
	if (!clawhubSpec && !npmSpec) return null;
	let localPath = normalizeOptionalString(params.install?.localPath);
	if (!localPath && params.workspaceDir && params.packageDir) localPath = path.relative(params.workspaceDir, params.packageDir) || void 0;
	const requestedDefaultChoice = params.install?.defaultChoice;
	const availableChoices = {
		clawhub: clawhubSpec,
		npm: npmSpec,
		local: localPath
	};
	const defaultChoice = requestedDefaultChoice && Object.hasOwn(availableChoices, requestedDefaultChoice) && availableChoices[requestedDefaultChoice] ? requestedDefaultChoice : clawhubSpec ? "clawhub" : localPath ? "local" : "npm";
	const install = {
		...localPath ? { localPath } : {},
		defaultChoice,
		...params.install?.minHostVersion ? { minHostVersion: params.install.minHostVersion } : {},
		...params.install?.expectedIntegrity ? { expectedIntegrity: params.install.expectedIntegrity } : {},
		...params.install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	if (clawhubSpec) return {
		clawhubSpec,
		...npmSpec ? { npmSpec } : {},
		...install
	};
	if (!npmSpec) return null;
	return {
		npmSpec,
		...install
	};
}
function buildCatalogEntryFromManifest(params) {
	const channel = params.channel;
	const id = channel?.id?.trim();
	const label = channel?.label?.trim();
	if (!channel || !id || !label) return null;
	const install = resolveInstallInfo(params);
	if (!install) return null;
	const pluginId = normalizeOptionalString(params.pluginId);
	const systemImage = channel.systemImage?.trim();
	return {
		id,
		...pluginId ? { pluginId } : {},
		...params.origin ? { origin: params.origin } : {},
		...params.trustedSourceLinkedOfficialInstall ? { trustedSourceLinkedOfficialInstall: true } : {},
		channel,
		meta: buildManifestChannelMeta({
			id,
			channel,
			label,
			selectionLabel: channel.selectionLabel?.trim() || label,
			docsPath: channel.docsPath?.trim() || `/channels/${id}`,
			docsLabel: normalizeOptionalString(channel.docsLabel),
			blurb: channel.blurb?.trim() || "",
			detailLabel: channel.detailLabel?.trim(),
			...systemImage ? { systemImage } : {},
			arrayFieldMode: "defined",
			selectionDocsPrefixMode: "truthy"
		}),
		install,
		installSource: describePluginInstallSource(install, { expectedPackageName: params.packageName })
	};
}
function buildExternalCatalogEntry(entry, trustedSourceLinkedOfficialInstall = false) {
	const manifest = entry[MANIFEST_KEY];
	return buildCatalogEntryFromManifest({
		pluginId: manifest?.plugin?.id,
		packageName: entry.name,
		packageVersion: entry.version,
		trustedSourceLinkedOfficialInstall,
		channel: manifest?.channel,
		install: manifest?.install
	});
}
function buildChannelUiCatalog(plugins) {
	const entries = plugins.map((plugin) => {
		const detailLabel = plugin.meta.detailLabel ?? plugin.meta.selectionLabel ?? plugin.meta.label;
		return {
			id: plugin.id,
			label: plugin.meta.label,
			detailLabel,
			...plugin.meta.systemImage ? { systemImage: plugin.meta.systemImage } : {}
		};
	});
	const order = entries.map((entry) => entry.id);
	const labels = {};
	const detailLabels = {};
	const systemImages = {};
	const byId = {};
	for (const entry of entries) {
		labels[entry.id] = entry.label;
		detailLabels[entry.id] = entry.detailLabel;
		if (entry.systemImage) systemImages[entry.id] = entry.systemImage;
		byId[entry.id] = entry;
	}
	return {
		entries,
		order,
		labels,
		detailLabels,
		systemImages,
		byId
	};
}
/**
* Raw catalog primitive. This may include untrusted workspace entries and
* workspace shadows. Security-sensitive or execution-facing callers should
* prefer `listTrustedChannelPluginCatalogEntries`; use this primitive only when
* the caller immediately applies trust filtering or explicitly excludes
* workspace entries.
*
* @internal
*/
function listRawChannelPluginCatalogEntries(options = {}) {
	const manifestEntries = listChannelCatalogEntries({
		workspaceDir: options.workspaceDir,
		env: options.env,
		extraPaths: options.extraPaths,
		installRecords: options.installRecords,
		discovery: options.discovery
	});
	const resolved = /* @__PURE__ */ new Map();
	const rememberCatalogEntry = (entry, priority) => {
		const existing = resolved.get(entry.id);
		if (!existing || priority < existing.priority) resolved.set(entry.id, {
			entry,
			priority
		});
	};
	for (const candidate of manifestEntries) {
		if (shouldExcludeCatalogEntry(options, candidate.pluginId, candidate.origin)) continue;
		const entry = buildCatalogEntryFromManifest({
			pluginId: candidate.pluginId,
			packageName: candidate.packageName,
			packageDir: candidate.rootDir,
			origin: candidate.origin,
			workspaceDir: candidate.workspaceDir ?? options.workspaceDir,
			channel: candidate.channel,
			install: candidate.install
		});
		if (!entry) continue;
		rememberCatalogEntry(entry, ORIGIN_PRIORITY[candidate.origin] ?? 99);
	}
	const rememberExternalCatalogEntries = (entries, priority, trustedSourceLinkedOfficialInstall = false) => {
		for (const candidate of entries) {
			const entry = buildExternalCatalogEntry(candidate, trustedSourceLinkedOfficialInstall);
			if (entry) rememberCatalogEntry(entry, priority);
		}
	};
	const officialFileEntries = loadCatalogEntriesFromPaths(resolveOfficialCatalogPaths(options), options.officialCatalogPaths?.length ? void 0 : catalogEntriesByPath);
	rememberExternalCatalogEntries([...listOfficialExternalChannelCatalogEntries(), ...officialFileEntries], FALLBACK_CATALOG_PRIORITY, true);
	rememberExternalCatalogEntries(loadCatalogEntriesFromPaths(resolveExternalCatalogPaths(options).map((rawPath) => resolveUserPath(rawPath, options.env ?? process.env)), catalogEntriesByPath), EXTERNAL_CATALOG_PRIORITY);
	return Array.from(resolved.values()).map(({ entry }) => entry).toSorted((a, b) => {
		const orderA = a.meta.order ?? 999;
		const orderB = b.meta.order ?? 999;
		if (orderA !== orderB) return orderA - orderB;
		return a.meta.label.localeCompare(b.meta.label);
	});
}
function getChannelPluginCatalogEntry(id, options = {}) {
	const trimmed = id.trim();
	if (!trimmed) return;
	return listRawChannelPluginCatalogEntries(options).find((entry) => entry.id === trimmed);
}
//#endregion
export { getChannelPluginCatalogEntry as n, listRawChannelPluginCatalogEntries as r, buildChannelUiCatalog as t };
