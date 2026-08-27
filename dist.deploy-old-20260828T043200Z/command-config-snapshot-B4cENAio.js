import { u as readConfigFileSnapshotWithPluginMetadata } from "./io-DlN5njvP.js";
import { t as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { t as adoptCurrentPluginMetadataSnapshotIfAbsent } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import "./config-B2bSneS2.js";
//#region src/cli/command-config-snapshot.ts
/** Reads full command config and adopts its metadata without replacing an existing owner. */
async function readCommandConfigSnapshot(options) {
	const read = await readConfigFileSnapshotWithPluginMetadata(options);
	const pluginMetadataSnapshot = completePluginMetadataSnapshot({
		snapshot: read.pluginMetadataSnapshot,
		config: read.snapshot.sourceConfig,
		env: process.env,
		workspaceDir: read.pluginMetadataSnapshot?.workspaceDir
	});
	if (pluginMetadataSnapshot) adoptCurrentPluginMetadataSnapshotIfAbsent(pluginMetadataSnapshot, {
		config: read.snapshot.sourceConfig,
		compatibleConfigs: [read.snapshot.config, read.snapshot.runtimeConfig],
		env: process.env,
		workspaceDir: pluginMetadataSnapshot.workspaceDir
	});
	return {
		...read,
		pluginMetadataSnapshot
	};
}
//#endregion
export { readCommandConfigSnapshot };
