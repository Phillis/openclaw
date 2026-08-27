import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as getBundledChannelPlugin } from "./bundled-BTOeOZSs.js";
import "./registry-DbgR8dhg.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { i as listLoadedChannelPlugins, n as getLoadedChannelPluginEntryById, t as getLoadedChannelPluginById } from "./registry-loaded-Dbglb2uR.js";
//#region src/channels/plugins/registry.ts
/** Active channel plugin registry with bundled fallback. */
const listChannelPlugins = () => listLoadedChannelPlugins();
/**
* Returns a loaded channel plugin without falling back to bundled metadata.
*/
function getLoadedChannelPlugin(id) {
	return getLoadedChannelPluginById(id);
}
/**
* Returns the package/install origin for a loaded channel plugin.
*/
function getLoadedChannelPluginOrigin(id) {
	return normalizeOptionalString(getLoadedChannelPluginEntryById(id)?.origin);
}
/**
* Resolves the active channel implementation together with host-owned provenance.
*/
function resolveChannelPluginRegistration(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	const loadedEntry = getLoadedChannelPluginEntryById(resolvedId);
	if (loadedEntry) {
		const origin = normalizeOptionalString(loadedEntry.origin) ?? void 0;
		return {
			plugin: loadedEntry.plugin,
			...loadedEntry.resolveChannelRuntime ? { resolveChannelRuntime: loadedEntry.resolveChannelRuntime } : {},
			...origin ? { origin } : {}
		};
	}
	const plugin = getBundledChannelPlugin(resolvedId);
	return plugin ? {
		plugin,
		origin: "bundled"
	} : void 0;
}
/**
* Returns the active channel plugin, with bundled fallback for built-in channels.
*/
function getChannelPlugin(id) {
	return resolveChannelPluginRegistration(id)?.plugin;
}
/**
* Normalizes user-facing channel aliases to canonical channel ids.
*/
function normalizeChannelId(raw) {
	return normalizeAnyChannelId(raw);
}
//#endregion
export { normalizeChannelId as a, listChannelPlugins as i, getLoadedChannelPlugin as n, resolveChannelPluginRegistration as o, getLoadedChannelPluginOrigin as r, getChannelPlugin as t };
