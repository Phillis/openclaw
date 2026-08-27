import { ct as GroupToolPolicyBySenderConfig, lt as GroupToolPolicyConfig, n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import { t as ChannelId } from "./channel-id.types-myn0PI2A.js";
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