import { n as OpenClawConfig } from "../../types.openclaw-CpYrAZv3.js";
import { p as ChannelDoctorConfigMutation, st as LegacyConfigRule } from "../../setup-wizard-types-DUwZ9UvR.js";
//#region extensions/nextcloud-talk/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };