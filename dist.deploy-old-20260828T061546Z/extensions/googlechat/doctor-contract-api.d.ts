import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { d as ChannelDoctorLegacyConfigRule, u as ChannelDoctorConfigMutation } from "../../types.adapters-DVrIc5zd.js";
import "../../channel-contract-gwjjjQO_.js";
//#region extensions/googlechat/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };