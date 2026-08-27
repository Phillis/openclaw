import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../config-contracts-BoWM1_J1.js";
import { a as ChannelDoctorConfigMutation, o as ChannelDoctorLegacyConfigRule } from "../../channel-contract-Pji552cX.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-Bcgahbi5.js";
//#region extensions/discord/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
//#region extensions/discord/doctor-contract-api.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };