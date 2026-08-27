import { n as OpenClawConfig } from "../../types.openclaw-DhIzMzKO.js";
//#region extensions/llama-cpp/doctor-contract-api.d.ts
declare const legacyConfigRules: {
  path: string[];
  message: string;
  match: (value: unknown) => value is "local://llama-cpp";
}[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };