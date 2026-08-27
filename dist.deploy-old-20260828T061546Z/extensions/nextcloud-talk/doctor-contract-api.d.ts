import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import { U as LegacyConfigRule, p as ChannelDoctorConfigMutation } from "../../setup-wizard-types-DVg7Zco4.js";
import "../../channel-contract-CJ4Dl3-r.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/nextcloud-talk/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };