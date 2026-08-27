import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import { U as LegacyConfigRule, m as ChannelDoctorLegacyConfigRule } from "../../setup-wizard-types-DVg7Zco4.js";
import "../../channel-contract-CJ4Dl3-r.js";
import "../../config-contracts-CbBCWgEm.js";
import { ELEVENLABS_TALK_PROVIDER_ID } from "./config-compat.js";
//#region extensions/elevenlabs/doctor-contract.d.ts
declare function hasLegacyTalkFields(value: unknown): boolean;
declare const legacyConfigRules: ChannelDoctorLegacyConfigRule[];
declare const ELEVENLABS_TALK_LEGACY_CONFIG_RULES: LegacyConfigRule[];
declare function normalizeCompatibilityConfig({ cfg }: {
  cfg: OpenClawConfig;
}): {
  config: OpenClawConfig;
  changes: string[];
};
//#endregion
export { ELEVENLABS_TALK_LEGACY_CONFIG_RULES, ELEVENLABS_TALK_PROVIDER_ID, hasLegacyTalkFields, legacyConfigRules, normalizeCompatibilityConfig };