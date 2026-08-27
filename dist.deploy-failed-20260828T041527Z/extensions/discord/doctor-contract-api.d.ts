import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../config-contracts-CGgezQeX.js";
import { a as ChannelDoctorConfigMutation, o as ChannelDoctorLegacyConfigRule } from "../../channel-contract-C7AAps4m.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-Z1BBI_Xm.js";
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