import { n as OpenClawConfig } from "../../types.openclaw-CTCn19OD.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-B3zOlmym.js";

//#region extensions/acpx/doctor-contract-api.d.ts
/** Retired ACPX config that `openclaw doctor --fix` removes before strict validation. */
declare const legacyConfigRules: {
  path: ("strictWindowsCmdWrapper" | "queueOwnerTtlSeconds" | "plugins" | "entries" | "acpx" | "config")[];
  message: string;
}[];
/** Removes retired plugin-owned config without keeping runtime compatibility keys. */
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };