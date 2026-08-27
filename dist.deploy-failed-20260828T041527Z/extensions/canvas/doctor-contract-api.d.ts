import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../config-contracts-CGgezQeX.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-Z1BBI_Xm.js";
//#region extensions/canvas/doctor-contract-api.d.ts
/** Retired Canvas file-host settings detected before strict plugin validation. */
declare const legacyConfigRules: {
  path: string[];
  message: string;
}[];
/** Removes retired file-host config while preserving the surviving enablement switch. */
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };