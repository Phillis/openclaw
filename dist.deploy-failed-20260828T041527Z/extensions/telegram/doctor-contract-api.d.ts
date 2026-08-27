import { n as OpenClawConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../config-contracts-B5xWKcfz.js";
import "../../channel-contract-DsIFrPEf.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BxliKj0s.js";
import { h as ChannelDoctorLegacyConfigRule, m as ChannelDoctorConfigMutation } from "../../setup-wizard-types-CEvwzrXW.js";
//#region extensions/telegram/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
//#region extensions/telegram/doctor-contract-api.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };