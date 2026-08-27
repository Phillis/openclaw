import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/canvas/src/config-migration.ts
const RETIRED_HOST_KEYS = [
	"root",
	"port",
	"liveReload"
];
/** Removes retired file-host settings while preserving the route enablement choice. */
function migrateCanvasHostConfig(config) {
	const legacyHost = asOptionalRecord(config.canvasHost);
	const existingHost = asOptionalRecord(asOptionalRecord(asOptionalRecord(asOptionalRecord(asOptionalRecord(config.plugins)?.entries)?.canvas)?.config)?.host);
	const retiredKeys = RETIRED_HOST_KEYS.filter((key) => Object.hasOwn(existingHost ?? {}, key));
	if (!legacyHost && retiredKeys.length === 0) return null;
	const next = structuredClone(config);
	delete next.canvasHost;
	const enabled = asBoolean(existingHost?.enabled) ?? asBoolean(legacyHost?.enabled);
	const nextPlugins = asOptionalRecord(next.plugins) ?? {};
	const nextEntries = asOptionalRecord(nextPlugins.entries) ?? {};
	const nextEntry = asOptionalRecord(nextEntries.canvas) ?? {};
	const nextPluginConfig = asOptionalRecord(nextEntry.config) ?? {};
	if (existingHost || enabled !== void 0) {
		if (enabled === void 0) delete nextPluginConfig.host;
		else nextPluginConfig.host = { enabled };
		nextEntry.config = nextPluginConfig;
		nextEntries.canvas = nextEntry;
		nextPlugins.entries = nextEntries;
		next.plugins = nextPlugins;
	}
	const changes = [];
	if (legacyHost) changes.push(enabled === void 0 ? "Removed retired canvasHost configuration." : "Migrated canvasHost.enabled to plugins.entries.canvas.config.host.enabled.");
	if (retiredKeys.length > 0) changes.push(`Removed retired Canvas host config: ${retiredKeys.map((key) => `plugins.entries.canvas.config.host.${key}`).join(", ")}.`);
	return {
		config: next,
		changes
	};
}
//#endregion
export { migrateCanvasHostConfig as t };
