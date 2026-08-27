import { n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
import { f as ChannelDoctorConfigMutation, p as ChannelDoctorLegacyConfigRule } from "./types.adapters-BQbR8pan.js";
//#region src/config/legacy-private-network-migration.d.ts
/** Detects the retired flat `allowPrivateNetwork` key before doctor migration. */
declare function hasLegacyFlatAllowPrivateNetworkAlias(value: unknown): boolean;
/** Moves flat private-network config into `network.dangerouslyAllowPrivateNetwork`. */
declare function migrateLegacyFlatAllowPrivateNetworkAlias(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
}): {
  entry: Record<string, unknown>;
  changed: boolean;
};
/** Build doctor rules that migrate legacy private-network aliases for one channel config. */
declare function createLegacyPrivateNetworkDoctorContract(params: {
  channelKey: string;
}): {
  legacyConfigRules: ChannelDoctorLegacyConfigRule[];
  normalizeCompatibilityConfig: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation;
};
//#endregion
export { hasLegacyFlatAllowPrivateNetworkAlias as n, migrateLegacyFlatAllowPrivateNetworkAlias as r, createLegacyPrivateNetworkDoctorContract as t };