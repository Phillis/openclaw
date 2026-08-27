import { N as RetryConfig, pt as ReplyPayload } from "../../runtime-api-B8urSeFb.js";
import { U as GroupPolicy, k as GroupToolPolicyConfig, n as OpenClawConfig, v as DiscordExecApprovalConfig } from "../../types.openclaw-R2xZRh0U.js";
import "../../config-contracts-CGgezQeX.js";
import { F as ChannelMessageActionContext, N as ChannelGroupContext, R as ChannelStatusIssue, d as ChannelOutboundPayloadHint, j as ChannelAccountSnapshot } from "../../channel-contract-C7AAps4m.js";
import { i as AgentToolResult } from "../../index-Q1SbbORG.js";
import "../../agent-core-CmZwnml7.js";
import "../../helpers-Dg3hOLxa.js";
import { n as DiscordTokenResolution, t as DiscordCredentialStatus } from "../../token-gK0GdkRl.js";
import { n as inspectDiscordAccount, t as InspectedDiscordAccount } from "../../account-inspect-d_dbT8Kj.js";
import { M as ComponentData, t as DiscordMessagingActionOptions, y as DiscordSendResult } from "../../runtime.messaging.shared-CkKyhXMl.js";
import { a as mergeDiscordAccountConfig, c as resolveDiscordAccountConfig, i as listEnabledDiscordAccounts, l as resolveDiscordMaxLinesPerMessage, n as createDiscordActionGate, o as resolveDefaultDiscordAccountId, r as listDiscordAccountIds, s as resolveDiscordAccount, t as ResolvedDiscordAccount } from "../../accounts-BA9QOPWH.js";
import { a as fetchDiscordApplicationId, c as probeDiscord, i as DiscordProbe, l as resolveDiscordPrivilegedIntentsFromFlags, n as DiscordPrivilegedIntentStatus, o as fetchDiscordApplicationSummary, r as DiscordPrivilegedIntentsSummary, s as parseApplicationIdFromToken, t as DiscordApplicationSummary } from "../../probe-C4E3j0Fv.js";
import { t as discordPlugin } from "../../channel-CZn38GWi.js";
import { t as discordSetupPlugin } from "../../channel.setup-B6XI4vhD.js";
import { A as DiscordComponentSectionAccessory, B as buildDiscordComponentCustomId, C as DiscordComponentBlock, D as DiscordComponentEntry, E as DiscordComponentButtonStyle, F as DiscordModalFieldDefinition, G as parseDiscordModalCustomIdForInteraction, H as parseDiscordComponentCustomId, I as DiscordModalFieldSpec, L as DiscordModalSpec, M as DiscordComponentSelectSpec, N as DiscordComponentSelectType, O as DiscordComponentMessageSpec, P as DiscordModalEntry, R as DISCORD_COMPONENT_CUSTOM_ID_KEY, S as buildDiscordComponentMessageFlags, T as DiscordComponentButtonSpec, U as parseDiscordComponentCustomIdForInteraction, V as buildDiscordModalCustomId, W as parseDiscordModalCustomId, _ as createDiscordFormModal, b as resolveDiscordComponentAttachmentName, c as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, g as DiscordFormModal, h as buildDiscordInteractiveComponents, j as DiscordComponentSelectOption, k as DiscordComponentModalFieldType, l as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, m as formatDiscordComponentEventText, n as DiscordSendComponents, o as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, ot as ThreadBindingTargetKind, r as DiscordSendEmbeds, s as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, v as DISCORD_COMPONENT_ATTACHMENT_PREFIX, w as DiscordComponentBuildResult, x as buildDiscordComponentMessage, y as readDiscordComponentSpec, z as DISCORD_MODAL_CUSTOM_ID_KEY } from "../../send.shared-s14lm5jB.js";
import { t as DirectoryConfigParams } from "../../directory-runtime-CekoOQfg.js";
import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-wwYscL_h.js";
import { n as DiscordInteractiveHandlerRegistration, t as DiscordInteractiveHandlerContext } from "../../interactive-dispatch-EYtkH_2M.js";
import { t as normalizeExplicitDiscordSessionKey } from "../../session-key-normalization-D-5WIPZD.js";
import { t as collectDiscordSecurityAuditFindings } from "../../security-audit-Dvq_talu.js";
//#region extensions/discord/src/actions/handle-action.d.ts
declare function handleDiscordMessageAction$1(ctx: Pick<ChannelMessageActionContext, "action" | "params" | "cfg" | "accountId" | "requesterAccountId" | "requesterSenderId" | "senderIsOwner" | "toolContext" | "mediaAccess" | "mediaLocalRoots" | "mediaReadFile" | "sessionKey" | "inboundEventKind" | "conversationReadOrigin" | "reply">): Promise<AgentToolResult<unknown>>;
//#endregion
//#region extensions/discord/src/subagent-hooks.d.ts
type DiscordSubagentEndedEvent = {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
};
type DiscordSubagentDeliveryTargetEvent = {
  expectsCompletionMessage?: boolean;
  childSessionKey: string;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    threadId?: string | number;
  };
};
type DiscordSubagentDeliveryTargetResult = {
  origin: {
    channel: "discord";
    accountId?: string;
    to: string;
    threadId?: string | number;
  };
} | undefined;
declare function handleDiscordSubagentEnded(event: DiscordSubagentEndedEvent): void;
declare function handleDiscordSubagentDeliveryTarget(event: DiscordSubagentDeliveryTargetEvent): DiscordSubagentDeliveryTargetResult;
//#endregion
//#region extensions/discord/src/actions/handle-action.guild-admin.d.ts
type Ctx = Pick<ChannelMessageActionContext, "action" | "params" | "cfg" | "accountId" | "requesterSenderId" | "senderIsOwner" | "toolContext" | "mediaLocalRoots" | "mediaReadFile">;
declare function tryHandleDiscordMessageActionGuildAdmin(params: {
  ctx: Ctx;
  resolveChannelId: () => string;
  readPolicyOptions?: DiscordMessagingActionOptions;
  actionOptions: DiscordMessagingActionOptions;
}): Promise<AgentToolResult<unknown> | undefined>;
//#endregion
//#region extensions/discord/src/api.d.ts
declare class DiscordApiError extends Error {
  status: number;
  retryAfter?: number;
  constructor(message: string, status: number, retryAfter?: number);
}
type DiscordFetchOptions = {
  retry?: RetryConfig;
  label?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
};
type DiscordApiRequestOptions = DiscordFetchOptions & {
  body?: unknown;
  fetcher?: typeof fetch;
  headers?: Record<string, string>;
  method?: string;
};
declare function requestDiscord<T>(path: string, token: string, options?: DiscordApiRequestOptions): Promise<T>;
declare function fetchDiscord<T>(path: string, token: string, fetcher?: typeof fetch, options?: DiscordFetchOptions): Promise<T>;
//#endregion
//#region extensions/discord/src/group-policy.d.ts
declare function resolveDiscordGroupRequireMention(params: ChannelGroupContext): boolean;
declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
//#endregion
//#region extensions/discord/src/normalize.d.ts
declare function normalizeDiscordMessagingTarget(raw: string): string | undefined;
/**
 * Normalize a Discord outbound target for delivery. Bare numeric IDs are
 * prefixed with "channel:" to avoid the ambiguous-target error in
 * parseDiscordTarget, unless the ID is explicitly configured as an allowed DM
 * sender. All other formats pass through unchanged.
 */
declare function normalizeDiscordOutboundTarget(to?: string, allowFrom?: readonly string[]): {
  ok: true;
  to: string;
} | {
  ok: false;
  error: Error;
};
declare function looksLikeDiscordTargetId(raw: string): boolean;
//#endregion
//#region src/config/runtime-group-policy.d.ts
type RuntimeGroupPolicyResolution = {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
type ResolveProviderRuntimeGroupPolicyParams = {
  providerConfigPresent: boolean;
  groupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
};
/**
 * Resolve the standard channel-provider policy.
 * Configured providers default open; missing provider config defaults allowlist.
 */
declare function resolveOpenProviderRuntimeGroupPolicy(params: ResolveProviderRuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
//#endregion
//#region extensions/discord/src/status-issues.d.ts
declare function collectDiscordStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[];
//#endregion
//#region extensions/discord/src/exec-approvals.d.ts
declare function getDiscordExecApprovalApprovers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  configOverride?: DiscordExecApprovalConfig | null;
}): string[];
declare function isDiscordExecApprovalClientEnabled(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  configOverride?: DiscordExecApprovalConfig | null;
}): boolean;
declare function isDiscordExecApprovalApprover(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  senderId?: string | null;
  configOverride?: DiscordExecApprovalConfig | null;
}): boolean;
declare function shouldSuppressLocalDiscordExecApprovalPrompt(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  payload: ReplyPayload;
  hint?: ChannelOutboundPayloadHint;
}): boolean;
//#endregion
//#region extensions/discord/src/pluralkit.d.ts
type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};
type PluralKitSystemInfo = {
  id: string;
  name?: string | null;
  tag?: string | null;
};
type PluralKitMemberInfo = {
  id: string;
  name?: string | null;
  display_name?: string | null;
};
type PluralKitMessageInfo = {
  id: string;
  original?: string | null;
  sender?: string | null;
  system?: PluralKitSystemInfo | null;
  member?: PluralKitMemberInfo | null;
};
declare function fetchPluralKitMessageInfo(params: {
  messageId: string;
  config?: DiscordPluralKitConfig;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
}): Promise<PluralKitMessageInfo | null>;
//#endregion
//#region src/channels/targets.d.ts
/** Canonical route target families shared by channel-owned parsers. */
type MessagingTargetKind = "user" | "channel";
/** Parsed channel target with the original token and normalized lookup key. */
type MessagingTarget = {
  kind: MessagingTargetKind;
  id: string;
  raw: string;
  normalized: string;
};
/** Options for parsers that can infer a kind or reject ambiguous input. */
type MessagingTargetParseOptions = {
  defaultKind?: MessagingTargetKind;
  ambiguousMessage?: string;
};
//#endregion
//#region extensions/discord/src/target-parsing.d.ts
type DiscordTargetKind = MessagingTargetKind;
type DiscordTarget = MessagingTarget;
type DiscordTargetParseOptions = MessagingTargetParseOptions;
declare function parseDiscordTarget(raw: string, options?: DiscordTargetParseOptions): DiscordTarget | undefined;
declare function resolveDiscordChannelId(raw: string): string;
//#endregion
//#region extensions/discord/src/send-target-parsing.d.ts
type SendDiscordTarget = DiscordTarget;
declare const parseDiscordSendTarget: (raw: string, options?: DiscordTargetParseOptions) => SendDiscordTarget | undefined;
//#endregion
//#region extensions/discord/src/target-resolver.d.ts
/**
 * Resolve a Discord username to user ID using the directory lookup.
 * This enables sending DMs by username instead of requiring explicit user IDs.
 */
declare function resolveDiscordTarget(raw: string, options: DirectoryConfigParams, parseOptions?: DiscordTargetParseOptions): Promise<MessagingTarget | undefined>;
//#endregion
//#region extensions/discord/api.d.ts
type DiscordMessageActionHandler = typeof handleDiscordMessageAction$1;
declare const handleDiscordMessageAction: DiscordMessageActionHandler;
/**
 * @deprecated Shipped `@openclaw/discord/api` compatibility only. Use native
 * `AbortSignal.any` after filtering optional signals. Removal with the next
 * plugin-SDK major.
 */
declare function mergeAbortSignals(signals: Array<AbortSignal | undefined>): AbortSignal | undefined;
//#endregion
export { type ComponentData, DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS, DISCORD_COMPONENT_ATTACHMENT_PREFIX, DISCORD_COMPONENT_CUSTOM_ID_KEY, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS, DISCORD_MODAL_CUSTOM_ID_KEY, DiscordApiError, type DiscordApplicationSummary, type DiscordComponentBlock, type DiscordComponentBuildResult, type DiscordComponentButtonSpec, type DiscordComponentButtonStyle, type DiscordComponentEntry, type DiscordComponentMessageSpec, type DiscordComponentModalFieldType, type DiscordComponentSectionAccessory, type DiscordComponentSelectOption, type DiscordComponentSelectSpec, type DiscordComponentSelectType, type DiscordCredentialStatus, DiscordFormModal, type DiscordInteractiveHandlerContext, type DiscordInteractiveHandlerRegistration, type DiscordModalEntry, type DiscordModalFieldDefinition, type DiscordModalFieldSpec, type DiscordModalSpec, type DiscordPluralKitConfig, type DiscordPrivilegedIntentStatus, type DiscordPrivilegedIntentsSummary, type DiscordProbe, type DiscordSendComponents, type DiscordSendEmbeds, type DiscordSendResult, type DiscordTarget, type DiscordTargetKind, type DiscordTargetParseOptions, type DiscordTokenResolution, type InspectedDiscordAccount, type PluralKitMemberInfo, type PluralKitMessageInfo, type PluralKitSystemInfo, type ResolvedDiscordAccount, type SendDiscordTarget, buildDiscordComponentCustomId, buildDiscordComponentMessage, buildDiscordComponentMessageFlags, buildDiscordInteractiveComponents, buildDiscordModalCustomId, collectDiscordSecurityAuditFindings, collectDiscordStatusIssues, createDiscordActionGate, createDiscordFormModal, discordPlugin, discordSetupPlugin, fetchDiscord, fetchDiscordApplicationId, fetchDiscordApplicationSummary, fetchPluralKitMessageInfo, formatDiscordComponentEventText, getDiscordExecApprovalApprovers, handleDiscordMessageAction, handleDiscordSubagentDeliveryTarget, handleDiscordSubagentEnded, inspectDiscordAccount, isDiscordExecApprovalApprover, isDiscordExecApprovalClientEnabled, listDiscordAccountIds, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig, listEnabledDiscordAccounts, looksLikeDiscordTargetId, mergeAbortSignals, mergeDiscordAccountConfig, normalizeDiscordMessagingTarget, normalizeDiscordOutboundTarget, normalizeExplicitDiscordSessionKey, parseApplicationIdFromToken, parseDiscordComponentCustomId, parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon, parseDiscordComponentCustomIdForInteraction, parseDiscordModalCustomId, parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon, parseDiscordModalCustomIdForInteraction, parseDiscordSendTarget, parseDiscordTarget, probeDiscord, readDiscordComponentSpec, requestDiscord, resolveDefaultDiscordAccountId, resolveDiscordAccount, resolveDiscordAccountConfig, resolveDiscordChannelId, resolveDiscordComponentAttachmentName, resolveDiscordGroupRequireMention, resolveDiscordGroupToolPolicy, resolveDiscordMaxLinesPerMessage, resolveDiscordPrivilegedIntentsFromFlags, resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy, resolveDiscordTarget, shouldSuppressLocalDiscordExecApprovalPrompt, tryHandleDiscordMessageActionGuildAdmin };