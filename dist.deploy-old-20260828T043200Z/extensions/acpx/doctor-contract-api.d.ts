import { n as OpenClawConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../config-contracts-DfVpGCcF.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-CP1eTlmf.js";
//#region extensions/acpx/doctor-contract-api.d.ts
/** Retired ACPX config that `openclaw doctor --fix` removes before strict validation. */
declare const legacyConfigRules: {
  path: ("acpx" | "strictWindowsCmdWrapper" | "queueOwnerTtlSeconds" | "plugins" | "entries" | "config")[];
  message: string;
}[];
/** Removes retired plugin-owned config without keeping runtime compatibility keys. */
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };