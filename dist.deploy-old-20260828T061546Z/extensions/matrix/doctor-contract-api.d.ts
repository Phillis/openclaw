import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { d as ChannelDoctorLegacyConfigRule, u as ChannelDoctorConfigMutation } from "../../types.adapters-DVrIc5zd.js";
import "../../channel-contract-gwjjjQO_.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-DQzJ5KWe.js";
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