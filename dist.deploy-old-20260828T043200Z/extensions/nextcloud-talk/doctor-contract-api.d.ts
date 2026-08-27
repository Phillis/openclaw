import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import { U as LegacyConfigRule, p as ChannelDoctorConfigMutation } from "../../setup-wizard-types-DKtF7yYx.js";
import "../../channel-contract-cEm0yf9M.js";
import "../../config-contracts-OcWhZue9.js";
//#region extensions/nextcloud-talk/src/doctor-contract.d.ts
declare const legacyConfigRules: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };