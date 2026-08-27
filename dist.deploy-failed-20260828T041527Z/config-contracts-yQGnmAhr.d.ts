import { A as GroupToolPolicyBySenderConfig, j as GroupToolPolicyConfig, n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import "./types-vfwkTnFP.js";
import { pt as ChannelId } from "./types-CR4mN0O8.js";
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
type GroupToolPolicySender = {
  /** Skip sender-specific overlays for trusted non-ingress executions. */
  senderPolicyMode?: "always" | "never";
  messageProvider?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
declare function resolveToolsBySender(params: {
  toolsBySender?: GroupToolPolicyBySenderConfig;
} & GroupToolPolicySender): GroupToolPolicyConfig | undefined;
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
export { resolveChannelGroupRequireMention as n, resolveToolsBySender as r, resolveChannelGroupPolicy as t };