import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import { m as ChannelDoctorLegacyConfigRule, p as ChannelDoctorConfigMutation } from "../../setup-wizard-types-DVg7Zco4.js";
import "../../channel-contract-CJ4Dl3-r.js";
import "../../config-contracts-CbBCWgEm.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BKKjMUZs.js";
//#region extensions/zalouser/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig(params: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
//#region extensions/zalouser/doctor-contract-api.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };