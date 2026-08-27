import { J as collectChannelSchemaMetadataCore, Y as collectPluginSchemaMetadataCore, n as getRuntimeConfig, s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-qM-9GgHk.js";
import "./config-B_0xOnKq.js";
import { t as buildConfigSchemaCore } from "./schema-Wla-hUMt.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
	return resolveConfigWidePluginManifestRegistry({
		config,
		env: env ?? process.env
	});
}
/** Builds one config schema from an exact manifest registry. */
function buildRuntimeConfigSchemaFromRegistry(registry) {
	return buildConfigSchemaCore({
		plugins: collectPluginSchemaMetadataCore(registry),
		channels: collectChannelSchemaMetadataCore(registry)
	});
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	return buildRuntimeConfigSchemaFromRegistry(loadManifestRegistry(getRuntimeConfig()));
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
export { loadGatewayRuntimeConfigSchema as n, readBestEffortRuntimeConfigSchema as r, buildRuntimeConfigSchemaFromRegistry as t };
