import { O as GroupToolPolicyBySenderConfig, k as GroupToolPolicyConfig, n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./types-cxNMThub.js";
import { mt as ChannelId } from "./types-BTkhcIzB.js";
//#region src/config/group-policy.d.ts
type GroupPolicyChannel = ChannelId;
type ChannelGroupConfig = {
  requireMention?: boolean;
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type ChannelGroupPolicy = {
  allowlistEnabled: boolean;
  allowed: boolean;
  groupConfig?: ChannelGroupConfig;
  defaultConfig?: ChannelGroupConfig;
};
declare function resolveChannelGroupPolicy(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  /** When true, sender-level filtering (groupAllowFrom) is configured upstream. */
  hasGroupAllowFrom?: boolean;
}): ChannelGroupPolicy;
declare function resolveChannelGroupRequireMention(params: {
  cfg: OpenClawConfig;
  channel: GroupPolicyChannel;
  groupId?: string | null;
  accountId?: string | null;
  groupIdCaseInsensitive?: boolean;
  requireMentionOverride?: boolean;
  configuredGroupDefaultsToNoMention?: boolean;
  overrideOrder?: "before-config" | "after-config";
}): boolean;
//#endregion
export { resolveChannelGroupRequireMention as n, resolveChannelGroupPolicy as t };