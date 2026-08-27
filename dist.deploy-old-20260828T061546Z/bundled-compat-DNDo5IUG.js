import { a as normalizePluginId } from "./config-state-Bgpvw0Q6.js";
import { t as readBundledDiscoveryMode } from "./bundled-discovery-state-DJlRn_Tx.js";
//#region src/plugins/bundled-compat.ts
/** Returns config with selected bundled plugins explicitly enabled when compat rules require it. */
function withBundledPluginEnablementCompat(params) {
	if (params.pluginIds.length === 0) return params.config;
	const existingEntries = params.config?.plugins?.entries ?? {};
	const forcePluginsEnabled = params.config?.plugins?.enabled === false;
	const allow = params.config?.plugins?.allow;
	const bypassAllowlist = readBundledDiscoveryMode() === "compat";
	const allowSet = !bypassAllowlist && Array.isArray(allow) && allow.length > 0 ? new Set(allow.map((pluginId) => normalizePluginId(pluginId)).filter(Boolean)) : void 0;
	let hasEligiblePlugin = false;
	let changed = false;
	const nextEntries = { ...existingEntries };
	const nextAllow = bypassAllowlist && Array.isArray(allow) ? new Set(allow) : void 0;
	for (const pluginId of params.pluginIds) {
		if (allowSet && !allowSet.has(pluginId)) continue;
		hasEligiblePlugin = true;
		const beforeAllowSize = nextAllow?.size;
		nextAllow?.add(pluginId);
		if (nextAllow && nextAllow.size !== beforeAllowSize) changed = true;
		if (existingEntries[pluginId] !== void 0) continue;
		nextEntries[pluginId] = { enabled: true };
		changed = true;
	}
	if (!changed) {
		if (!forcePluginsEnabled || !hasEligiblePlugin) return params.config;
	}
	return {
		...params.config,
		plugins: {
			...params.config?.plugins,
			...forcePluginsEnabled ? { enabled: true } : {},
			...nextAllow ? { allow: [...nextAllow] } : {},
			entries: nextEntries
		}
	};
}
//#endregion
export { withBundledPluginEnablementCompat as t };
