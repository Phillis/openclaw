import { f as loadPluginRegistrySnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-BBST5Lo5.js";
import "./plugin-registry-DS2siXub.js";
//#region src/plugins/manifest-contribution-ids.ts
/** Lists manifest contribution ids from installed plugin registry snapshots. */
/** Lists ids contributed by plugin manifests for one contribution kind. */
function listManifestContributionIds(params) {
	const env = params.env ?? process.env;
	return listPluginContributionIds({
		index: params.index ?? loadPluginRegistrySnapshot({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env,
			candidates: params.candidates,
			preferPersisted: params.preferPersisted
		}),
		contribution: params.contribution,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		includeDisabled: params.includeDisabled
	});
}
/** Lists channel ids contributed by plugin manifests. */
function listManifestChannelContributionIds(params = {}) {
	return listManifestContributionIds({
		...params,
		contribution: "channels"
	});
}
//#endregion
export { listManifestChannelContributionIds as t };
