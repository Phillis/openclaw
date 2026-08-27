import { n as OpenClawConfig } from "../../types.openclaw-CZEJqSSW.js";
import { m as ChannelDoctorLegacyConfigRule } from "../../setup-wizard-types-BW-DTrda.js";
import "../../channel-contract-DCFFV2MY.js";
import "../../config-contracts-CAOod931.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-B0gOz63Y.js";
//#region extensions/reef/doctor-contract-api.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };