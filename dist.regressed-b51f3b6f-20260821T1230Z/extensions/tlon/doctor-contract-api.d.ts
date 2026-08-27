import { n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { p as ChannelDoctorConfigMutation, st as LegacyConfigRule } from "../../setup-wizard-types-u0truel5.js";
//#region extensions/tlon/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare const normalizeCompatibilityConfig: (params: {
  cfg: OpenClawConfig;
}) => ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };