import { n as OpenClawConfig } from "../../types.openclaw-VfFCsbZD.js";
import { d as ChannelDoctorLegacyConfigRule, u as ChannelDoctorConfigMutation } from "../../types.adapters-BCj_O1Hf.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-DECiDJEm.js";
//#region extensions/msteams/doctor-contract-api.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };