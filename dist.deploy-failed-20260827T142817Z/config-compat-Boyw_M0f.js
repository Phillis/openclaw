import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-D9ocX9lc.js";
//#region extensions/memory-wiki/src/config-compat.ts
function hasLegacyBridgeArtifactToggle(value) {
	return Object.hasOwn(asNullableRecord(value) ?? {}, "readMemoryCore");
}
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"memory-wiki",
		"config",
		"bridge"
	],
	message: "plugins.entries.memory-wiki.config.bridge.readMemoryCore is legacy; use plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts. Run \"openclaw doctor --fix\".",
	match: hasLegacyBridgeArtifactToggle
}];
function migrateMemoryWikiLegacyConfig(config) {
	const rawBridge = asNullableRecord(asNullableRecord(asNullableRecord(config.plugins?.entries?.["memory-wiki"])?.config)?.bridge);
	if (!rawBridge || !hasLegacyBridgeArtifactToggle(rawBridge)) return null;
	const nextConfig = structuredClone(config);
	const nextPlugins = asNullableRecord(nextConfig.plugins) ?? {};
	nextConfig.plugins = nextPlugins;
	const nextEntries = asNullableRecord(nextPlugins.entries) ?? {};
	nextPlugins.entries = nextEntries;
	const nextEntry = asNullableRecord(nextEntries["memory-wiki"]) ?? {};
	nextEntries["memory-wiki"] = nextEntry;
	const nextPluginConfig = asNullableRecord(nextEntry.config) ?? {};
	nextEntry.config = nextPluginConfig;
	const nextBridge = asNullableRecord(nextPluginConfig.bridge) ?? {};
	nextPluginConfig.bridge = nextBridge;
	const legacyValue = nextBridge.readMemoryCore;
	const hasCanonical = Object.hasOwn(nextBridge, "readMemoryArtifacts");
	if (!hasCanonical) nextBridge.readMemoryArtifacts = legacyValue;
	delete nextBridge.readMemoryCore;
	return {
		config: nextConfig,
		changes: hasCanonical ? ["Removed legacy plugins.entries.memory-wiki.config.bridge.readMemoryCore; kept explicit plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts."] : ["Moved plugins.entries.memory-wiki.config.bridge.readMemoryCore → plugins.entries.memory-wiki.config.bridge.readMemoryArtifacts."]
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	return migrateMemoryWikiLegacyConfig(cfg) ?? {
		config: cfg,
		changes: []
	};
}
//#endregion
export { migrateMemoryWikiLegacyConfig as n, normalizeCompatibilityConfig as r, legacyConfigRules as t };
