import { L as collectChannelSchemaMetadataCore, R as collectPluginSchemaMetadataCore, l as readConfigFileSnapshot, r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
import "./config-Dl8DJbzM.js";
import { t as buildConfigSchemaCore } from "./schema-DqKbLJu8.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
	return resolveConfigWidePluginManifestRegistry({
		config,
		env: env ?? process.env
	});
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	const registry = loadManifestRegistry(getRuntimeConfig());
	return buildConfigSchemaCore({
		plugins: collectPluginSchemaMetadataCore(registry),
		channels: collectChannelSchemaMetadataCore(registry)
	});
}
async function readBestEffortRuntimeConfigSchema() {
	const snapshot = await readConfigFileSnapshot({ observe: false });
	const registry = loadManifestRegistry(snapshot.valid ? snapshot.config : {
		agents: { list: [{ id: "main" }] },
		plugins: { enabled: true }
	});
	return buildConfigSchemaCore({
		plugins: snapshot.valid ? collectPluginSchemaMetadataCore(registry) : [],
		channels: collectChannelSchemaMetadataCore(registry)
	});
}
//#endregion
export { readBestEffortRuntimeConfigSchema as n, loadGatewayRuntimeConfigSchema as t };
