import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { l as tryReadJsonSync } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-BbEZKGTS.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES } from "./official-external-plugin-bundled-catalogs-B1B9VBeU.js";
import fs from "node:fs";
import path from "node:path";
//#region src/channels/bundled-channel-catalog-read.ts
/**
* Bundled channel catalog reader.
*
* Loads channel metadata from generated package catalogs and bundled plugin package manifests.
*/
const OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH = path.join("dist", "channel-catalog.json");
const officialCatalogFileCache = /* @__PURE__ */ new Map();
const bundledPackageCatalogCache = /* @__PURE__ */ new Map();
registerPluginMetadataProcessMemoLifecycleClear(() => {
	officialCatalogFileCache.clear();
	bundledPackageCatalogCache.clear();
});
function listPackageRoots() {
	return uniqueStrings([resolveOpenClawPackageRootSync({ cwd: process.cwd() }), resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url })].filter((entry) => Boolean(entry)));
}
function readBundledExtensionCatalogEntriesSync() {
	const pluginsDir = resolveBundledPluginsDir();
	if (!pluginsDir) return [];
	const cached = bundledPackageCatalogCache.get(pluginsDir);
	if (cached !== void 0) return cached ?? [];
	try {
		const entries = fs.readdirSync(pluginsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).flatMap((entry) => {
			const parsed = tryReadJsonSync(path.join(pluginsDir, entry.name, "package.json"));
			return parsed ? [parsed] : [];
		});
		bundledPackageCatalogCache.set(pluginsDir, entries);
		return entries;
	} catch {
		bundledPackageCatalogCache.set(pluginsDir, null);
		return [];
	}
}
function readOfficialCatalogFileSync() {
	const bundledExternalEntries = BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES.filter((entry) => typeof entry === "object" && entry !== null);
	for (const packageRoot of listPackageRoots()) {
		const candidate = path.join(packageRoot, OFFICIAL_CHANNEL_CATALOG_RELATIVE_PATH);
		const cached = officialCatalogFileCache.get(candidate);
		if (cached !== void 0) {
			if (cached) return [...bundledExternalEntries, ...cached];
			continue;
		}
		if (!fs.existsSync(candidate)) {
			officialCatalogFileCache.set(candidate, null);
			continue;
		}
		const payload = tryReadJsonSync(candidate);
		if (payload) {
			const entries = Array.isArray(payload.entries) ? payload.entries : [];
			officialCatalogFileCache.set(candidate, entries);
			return [...bundledExternalEntries, ...entries];
		}
		officialCatalogFileCache.set(candidate, null);
	}
	return bundledExternalEntries;
}
function isChannelCatalogEntryLike(entry) {
	return "openclaw" in entry;
}
function toBundledChannelEntry(entry) {
	const channel = isChannelCatalogEntryLike(entry) ? entry.openclaw?.channel : entry;
	const id = normalizeOptionalLowercaseString(channel?.id);
	if (!id || !channel) return null;
	return {
		id,
		channel,
		aliases: Array.isArray(channel.aliases) ? channel.aliases.map((alias) => normalizeOptionalLowercaseString(alias)).filter((alias) => Boolean(alias)) : [],
		order: typeof channel.order === "number" && Number.isFinite(channel.order) ? channel.order : Number.MAX_SAFE_INTEGER
	};
}
/**
* Lists bundled channel catalog entries from package manifests and generated catalog files.
*/
function listBundledChannelCatalogEntries() {
	const entries = /* @__PURE__ */ new Map();
	for (const entry of readBundledExtensionCatalogEntriesSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, channelEntry);
	}
	for (const entry of readOfficialCatalogFileSync()) {
		const channelEntry = toBundledChannelEntry(entry);
		if (channelEntry) entries.set(channelEntry.id, entries.get(channelEntry.id) ?? channelEntry);
	}
	if (entries.size === 0) return [];
	return Array.from(entries.values()).toSorted((left, right) => left.order - right.order || left.id.localeCompare(right.id));
}
/** Finds bundled or generated channel metadata by id or alias. */
function findBundledChannelCatalogMetadata(channelId) {
	const normalized = normalizeOptionalLowercaseString(channelId);
	if (!normalized) return;
	return listBundledChannelCatalogEntries().find((entry) => entry.id === normalized || entry.aliases.includes(normalized))?.channel;
}
//#endregion
export { listBundledChannelCatalogEntries as n, findBundledChannelCatalogMetadata as t };
