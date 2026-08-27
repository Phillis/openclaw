import { n as OpenClawConfig } from "../../types.openclaw-DhIzMzKO.js";
import { d as ChannelDoctorLegacyConfigRule, u as ChannelDoctorConfigMutation } from "../../types.adapters-BxgsWXLj.js";
//#region extensions/feishu/src/doctor-contract.d.ts
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare function normalizeCompatibilityConfig({
  cfg
}: {
  cfg: OpenClawConfig;
}): ChannelDoctorConfigMutation;
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };