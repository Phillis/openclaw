import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import { m as ChannelDoctorLegacyConfigRule, p as ChannelDoctorConfigMutation } from "../../setup-wizard-types-DKtF7yYx.js";
import "../../channel-contract-cEm0yf9M.js";
import "../../config-contracts-OcWhZue9.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BUTKbG4l.js";
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