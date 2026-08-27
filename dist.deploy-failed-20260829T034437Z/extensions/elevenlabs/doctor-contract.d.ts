import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import { U as LegacyConfigRule, m as ChannelDoctorLegacyConfigRule } from "../../setup-wizard-types-DKtF7yYx.js";
import "../../channel-contract-cEm0yf9M.js";
import "../../config-contracts-OcWhZue9.js";
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