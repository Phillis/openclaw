import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import "../../config-contracts-CHCvb6rG.js";
//#region extensions/ollama/src/config-compat.d.ts
type LegacyConfigRule = {
  path: Array<string | number>;
  message: string;
  match: (value: unknown, root?: Record<string, unknown>) => boolean;
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