import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-DLiU5GYQ.js";
import { l as setPluginInstallRecordMapEntry, r as createPluginInstallRecordMap } from "./plugin-install-record-map-CWFLMnp7.js";
import { i as resolveTrustedSourceLinkedOfficialClawHubSpec, o as resolveTrustedSourceLinkedOfficialNpmSpec } from "./official-external-install-records-BB1DFCD4.js";
import { r as runPluginPayloadSmokeCheck } from "./plugin-payload-validation-B9eSwi2i.js";
//#region src/cli/update-cli/active-plugin-payload-validation.ts
/** Runs the static payload check without repair, installs, or network access. */
async function runActivePluginPayloadSmokeCheck(params) {
	return await runPluginPayloadSmokeCheck({
		records: filterRecordsToActive({
			cfg: params.cfg,
			records: params.records
		}),
		env: params.env
	});
}
/** Selects the installed records covered by update/startup payload verification. */
function filterRecordsToActive(params) {
	const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
	const filtered = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(params.records)) {
		if (!record || typeof record !== "object") continue;
		if (resolveEffectiveEnableState({
			id: pluginId,
			origin: "global",
			config: normalizedPluginConfig,
			rootConfig: params.cfg
		}).enabled) {
			setPluginInstallRecordMapEntry(filtered, pluginId, record);
			continue;
		}
		const officialNpm = resolveTrustedSourceLinkedOfficialNpmSpec({
			pluginId,
			record
		});
		const officialClawHub = resolveTrustedSourceLinkedOfficialClawHubSpec({
			pluginId,
			record
		});
		if (officialNpm || officialClawHub) setPluginInstallRecordMapEntry(filtered, pluginId, record);
	}
	return filtered;
}
//#endregion
export { runActivePluginPayloadSmokeCheck as n, filterRecordsToActive as t };
