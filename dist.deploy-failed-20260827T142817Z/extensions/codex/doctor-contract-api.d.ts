import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-D_jLUTxP.js";

//#region extensions/codex/src/migration/session-binding-sidecars.d.ts
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
//#region extensions/codex/doctor-contract-api.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match: (value: unknown) => boolean;
};
/** Legacy Codex config keys that doctor should report or repair. */
declare const legacyConfigRules: LegacyConfigRule[];
/**
 * Removes retired Codex plugin config keys while preserving unrelated config.
 */
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };