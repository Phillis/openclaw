import { n as OpenClawConfig } from "../../types.openclaw-CpYrAZv3.js";
import { p as ChannelDoctorConfigMutation, st as LegacyConfigRule } from "../../setup-wizard-types-DUwZ9UvR.js";
//#region extensions/tlon/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare const normalizeCompatibilityConfig: (params: {
  cfg: OpenClawConfig;
}) => ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };