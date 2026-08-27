import { n as OpenClawConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../config-contracts-B5xWKcfz.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BxliKj0s.js";
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