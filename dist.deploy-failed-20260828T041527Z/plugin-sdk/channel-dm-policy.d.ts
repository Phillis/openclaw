import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import { m as DmPolicy } from "../types.base-AciWfV9W.js";
import "../types-DFD58Wgt.js";
import { u as ChannelSetupAdapter } from "../manifest-registry-fJ5PmDA1.js";
import "../types.core-CMY5bxhQ.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import "../types.adapters-BTze_x-2.js";
import { t as ChannelSetupDmPolicy } from "../setup-wizard-types-CFlUscUd.js";
//#region src/plugin-sdk/channel-dm-policy.d.ts
type DmPolicyAccountConfig = {
  dmPolicy?: DmPolicy;
  allowFrom?: ReadonlyArray<string | number> | null;
};
type ResolvedDmPolicyAccount<TConfig extends DmPolicyAccountConfig> = {
  accountId: string;
  config: TConfig;
};
type DmPolicyContext<TConfig extends DmPolicyAccountConfig> = {
  cfg: OpenClawConfig;
  requestedAccountId?: string;
  account: ResolvedDmPolicyAccount<TConfig>;
};
type DmPolicyPatchContext<TConfig extends DmPolicyAccountConfig> = DmPolicyContext<TConfig> & {
  policy: DmPolicy;
  allowFrom?: string[];
};
type CreateChannelDmPolicyParams<TConfig extends DmPolicyAccountConfig> = {
  label: string;
  channel: ChannelId;
  policyKey?: string;
  allowFromKey?: string;
  policyPath?: string;
  allowFromPath?: string;
  resolveAccount: (cfg: OpenClawConfig, accountId?: string) => ResolvedDmPolicyAccount<TConfig>;
  resolveConfigKeys?: (context: DmPolicyContext<TConfig>) => {
    policyKey: string;
    allowFromKey: string;
  };
  resolveAllowFrom?: (context: DmPolicyPatchContext<TConfig>) => string[] | undefined;
  buildPatch?: (context: DmPolicyPatchContext<TConfig>) => Record<string, unknown>;
  applyPatch?: (context: DmPolicyContext<TConfig> & {
    patch: Record<string, unknown>;
  }) => OpenClawConfig;
  setupSurface?: ChannelSetupAdapter | (() => ChannelSetupAdapter);
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
/** Build an account-aware DM policy descriptor for channel setup flows. */
declare function createChannelDmPolicy<TConfig extends DmPolicyAccountConfig>(params: CreateChannelDmPolicyParams<TConfig>): ChannelSetupDmPolicy & {
  promptAllowFrom: NonNullable<ChannelSetupDmPolicy["promptAllowFrom"]>;
};
//#endregion
export { createChannelDmPolicy };