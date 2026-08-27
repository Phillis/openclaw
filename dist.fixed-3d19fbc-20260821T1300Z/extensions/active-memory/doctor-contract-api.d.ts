import { n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-RMLQ9sdY.js";

//#region extensions/active-memory/doctor-contract-api.d.ts
/** Retired Active Memory QMD override detected before strict manifest validation. */
declare const legacyConfigRules: {
  path: string[];
  message: string;
}[];
/** Removes the retired plugin-owned QMD override. */
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
/** State migrations exposed to OpenClaw doctor for Active Memory. */
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };