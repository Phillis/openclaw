import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { m as ChannelDoctorLegacyConfigRule } from "../../setup-wizard-types-D9afUG0f.js";
import "../../channel-contract-Dv36zYCV.js";
import "../../config-contracts-CHCvb6rG.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BSJJaOQY.js";
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