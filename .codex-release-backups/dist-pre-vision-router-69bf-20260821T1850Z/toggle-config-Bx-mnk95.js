import { t as mergeDeep } from "./deep-merge-DhxZfAYh.js";
import { i as normalizeChatChannelId } from "./ids-CvoHNWoD.js";
import { a as normalizePluginId, o as normalizePluginTargetConfig } from "./config-state-DLiU5GYQ.js";
//#region src/plugins/toggle-config.ts
/** Returns config with a plugin enabled/disabled and optional built-in channel state synced. */
function setPluginEnabledInConfig(config, pluginId, enabled, options = {}) {
	const builtInChannelId = normalizeChatChannelId(pluginId);
	const resolvedId = normalizePluginId(builtInChannelId ?? pluginId);
	const normalizedConfig = normalizePluginTargetConfig(config, resolvedId);
	let existingEntry = {};
	const existingEntries = Object.entries(config.plugins?.entries ?? {}).filter(([entryId]) => normalizePluginId(entryId) === resolvedId).toSorted(([leftId], [rightId]) => {
		if (leftId === resolvedId) return rightId === resolvedId ? 0 : 1;
		if (rightId === resolvedId) return -1;
		return leftId.localeCompare(rightId, "en");
	});
	for (const [, entry] of existingEntries) existingEntry = mergeDeep(existingEntry, entry);
	const next = {
		...normalizedConfig,
		plugins: {
			...normalizedConfig.plugins,
			entries: {
				...normalizedConfig.plugins?.entries,
				[resolvedId]: {
					...existingEntry,
					enabled
				}
			}
		}
	};
	if (!builtInChannelId || options.updateChannelConfig === false) return next;
	const existing = normalizedConfig.channels?.[builtInChannelId];
	const existingRecord = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...next,
		channels: {
			...normalizedConfig.channels,
			[builtInChannelId]: {
				...existingRecord,
				enabled
			}
		}
	};
}
//#endregion
export { setPluginEnabledInConfig as t };
