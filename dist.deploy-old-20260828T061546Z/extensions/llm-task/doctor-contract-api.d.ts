import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
//#region extensions/llm-task/doctor-contract-api.d.ts
declare const legacyConfigRules: ({
  path: string[];
  message: string;
  match?: undefined;
} | {
  path: string[];
  message: string;
  match: (value: unknown) => boolean;
})[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };