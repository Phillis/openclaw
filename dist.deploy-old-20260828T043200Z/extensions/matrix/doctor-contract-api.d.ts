import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
import { d as ChannelDoctorLegacyConfigRule, u as ChannelDoctorConfigMutation } from "../../types.adapters-UsYT95C9.js";
import "../../channel-contract-BTByoES9.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-D8oGisY_.js";
//#region extensions/matrix/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
//#region extensions/matrix/doctor-contract-api.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };