import { bi as GroupToolPolicyBySenderConfig, i as OpenClawConfig, xi as GroupToolPolicyConfig } from "./types.openclaw-D9FrGbix.js";

//#region src/channels/ids.d.ts
/**
 * Canonical chat channel id used by core routing, plugin config, and channel catalogs.
 */
type ChatChannelId = string;
//#endregion
//#region src/channels/plugins/channel-id.types.d.ts
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = ChatChannelId | (string & {});
//#endregion
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
  groupIdCaseInsensitive?: boolean; /** When true, sender-level filtering (groupAllowFrom) is configured upstream. */
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
export { ChatChannelId as i, resolveChannelGroupRequireMention as n, ChannelId as r, resolveChannelGroupPolicy as t };