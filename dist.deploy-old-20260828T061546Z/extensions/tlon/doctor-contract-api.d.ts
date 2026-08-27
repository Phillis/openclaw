import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { K as LegacyConfigRule, p as ChannelDoctorConfigMutation } from "../../setup-wizard-types-D9afUG0f.js";
import "../../channel-contract-Dv36zYCV.js";
import "../../config-runtime-BGpPj3qV.js";
//#region extensions/tlon/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare const normalizeCompatibilityConfig: (params: {
  cfg: OpenClawConfig;
}) => ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };