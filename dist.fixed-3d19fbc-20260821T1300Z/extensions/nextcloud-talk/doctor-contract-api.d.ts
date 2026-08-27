import { n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { p as ChannelDoctorConfigMutation, st as LegacyConfigRule } from "../../setup-wizard-types-u0truel5.js";
//#region extensions/nextcloud-talk/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };