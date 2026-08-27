import { N as validateConfigObjectWithPlugins, ct as containsAuthoredInclude, l as readConfigFileSnapshot, lt as isSingleTopLevelIncludeMigration } from "./io-D1h6pxaD.js";
import { r as replaceConfigFile } from "./mutate-xf8UM8H3.js";
import "./config-CW-q_d35.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-CPsRDmLT.js";
//#region src/commands/doctor/legacy-config-repair.ts
/** Migrate a legacy config snapshot during update, unless validation blocks it. */
async function repairLegacyConfigForUpdateChannel(params) {
	const hasAuthoredIncludes = containsAuthoredInclude(params.configSnapshot.parsed);
	const migrated = migrateLegacyConfig(params.configSnapshot.sourceConfig);
	if (!migrated.config) return {
		snapshot: params.configSnapshot,
		repaired: false
	};
	const validated = validateConfigObjectWithPlugins(migrated.config);
	if (!validated.ok) return {
		snapshot: params.configSnapshot,
		repaired: false
	};
	const nextConfig = hasAuthoredIncludes && migrated.sourceConfig ? migrated.sourceConfig : validated.config;
	if (hasAuthoredIncludes && !isSingleTopLevelIncludeMigration({
		parsed: params.configSnapshot.parsed,
		sourceConfig: params.configSnapshot.sourceConfig,
		candidate: nextConfig
	})) return {
		snapshot: params.configSnapshot,
		repaired: false
	};
	await replaceConfigFile({
		nextConfig,
		baseHash: params.configSnapshot.hash,
		writeOptions: {
			auditOrigin: "doctor",
			allowConfigSizeDrop: true,
			skipOutputLogs: params.jsonMode
		}
	});
	const snapshot = await readConfigFileSnapshot();
	return {
		snapshot,
		repaired: snapshot.valid
	};
}
//#endregion
export { repairLegacyConfigForUpdateChannel };
