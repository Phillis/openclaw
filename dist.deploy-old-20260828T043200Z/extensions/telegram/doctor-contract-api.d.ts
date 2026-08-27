import { n as OpenClawConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../config-contracts-DfVpGCcF.js";
import "../../channel-contract-CRFpY1xx.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-CP1eTlmf.js";
import { h as ChannelDoctorLegacyConfigRule, m as ChannelDoctorConfigMutation } from "../../setup-wizard-types-BoxqfOlR.js";
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