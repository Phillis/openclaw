import { n as OpenClawConfig } from "../../types.openclaw-DRR8P0H2.js";
import "../../config-contracts-BoWM1_J1.js";
//#region extensions/xai/doctor-contract-api.d.ts
type LegacyConfigRule = {
  path: Array<string | number>;
  message: string;
  match: (value: unknown) => boolean;
};
declare const legacyConfigRules: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };