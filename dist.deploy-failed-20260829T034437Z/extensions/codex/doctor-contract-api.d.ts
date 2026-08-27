import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../config-contracts-OcWhZue9.js";
import { t as PluginDoctorStateMigration } from "../../runtime-doctor-migrations-BUTKbG4l.js";
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
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
declare const stateMigrations: PluginDoctorStateMigration[];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };