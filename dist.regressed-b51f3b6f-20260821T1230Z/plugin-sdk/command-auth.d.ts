import { r as OpenClawConfig } from "../types.openclaw-D3TBp_34.js";
import { n as CommandArgs, t as CommandArgValues } from "../commands-args.types-zglMcgeO.js";
import { t as ChannelId } from "../channel-id.types-CjcGKHk0.js";
import { aa as CommandAuthorizer, ca as resolveControlCommandGate, la as resolveDualTextControlCommandGate, oa as CommandGatingModeWhenAccessGroupsOff, sa as resolveCommandAuthorizedFromAuthorizers } from "../host-capability-types-BQXGgYpD.js";
import { n as SkillCommandSpec } from "../types-Hb8WnKto.js";
import { a as CommandArgsParsing, c as CommandScope, i as CommandArgMenuSpec, l as NativeCommandSpec, n as CommandArgChoiceContext, o as CommandDetection, r as CommandArgDefinition, s as CommandNormalizeOptions, t as ChatCommandDefinition, u as ShouldHandleTextCommandsParams } from "../commands-registry.types-RlSWRsbu.js";
import { i as shouldComputeCommandAuthorized, n as hasInlineCommandTokens, r as isControlCommandMessage, t as hasControlCommand } from "../command-detection-BkSIhRX4.js";
import { a as parseAccessGroupAllowFromEntry, t as ACCESS_GROUP_ALLOW_FROM_PREFIX } from "../allow-from-Bdiy2LH6.js";
import { a as resolveAccessGroupAllowFromMatches, i as expandAllowFromWithAccessGroups, n as AccessGroupMembershipResolver, o as resolveAccessGroupAllowFromState, r as ResolvedAccessGroupAllowFromState, t as AccessGroupMembershipLookup } from "../access-groups-Bxq1uYF4.js";
import { i as resolveInboundDirectDmAccessWithRuntime, n as ResolvedInboundDirectDmAccess, r as createPreCryptoDirectDmAuthorizer, t as DirectDmCommandAuthorizationRuntime } from "../direct-dm-access-CczufvaH.js";
import { S as listChatCommandsForConfig, _ as maybeResolveTextAlias, a as formatCommandArgMenuTitle, b as isCommandEnabled, c as listNativeCommandSpecsForConfig, d as resolveCommandArgChoices, f as resolveCommandArgMenu, g as getCommandDetection, h as shouldHandleTextCommands, i as findCommandByNativeName, m as isNativeCommandSurface, n as buildCommandText, o as isCommandMessage, p as serializeCommandArgs, r as buildCommandTextFromArgs, s as listNativeCommandSpecs, t as ResolvedCommandArgChoice, u as parseCommandArgs, v as normalizeCommandBody, x as listChatCommands, y as resolveTextCommand } from "../commands-registry-DZAsSAHf.js";
import { a as ResolveNativeCommandSessionTargetsParams, i as resolveCommandAuthorization, n as resolveStoredModelOverride, o as resolveNativeCommandSessionTargets, r as CommandAuthorization, t as StoredModelOverride } from "../stored-model-override-Xd0xaFDb.js";
import { a as resolveModelsCommandReply, i as formatModelsAvailableHeader, r as buildModelsProviderData, t as ModelsProviderData } from "../commands-models-Cjq1UU8g.js";
import { i as resolveSkillCommandInvocation, n as listSkillCommandsForWorkspace, r as listReservedChatSlashCommandNames, t as listSkillCommandsForAgents } from "../chat-commands-C4CHo-O1.js";
import { n as listProviderPluginCommandSpecs, t as getPluginCommandSpecs } from "../command-specs-TMwB9Pxx.js";

//#region src/plugin-sdk/telegram-command-ui.d.ts
/**
 * Telegram command UI helpers exposed for plugin command pagination.
 */
/** Builds an inline keyboard row for paginated Telegram command listings. */
declare function buildCommandsPaginationKeyboard(currentPage: number, totalPages: number, agentId?: string): Array<Array<{
  text: string;
  callback_data: string;
}>>;
//#endregion
//#region src/plugin-sdk/command-auth.d.ts
/**
 * Inputs for legacy sender command authorization.
 * Kept for plugins that still compose command auth from DM/group allowlists instead of channel ingress.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
type ResolveSenderCommandAuthorizationParams = {
  cfg: OpenClawConfig;
  rawBody: string;
  isGroup: boolean;
  dmPolicy: string;
  configuredAllowFrom: string[];
  configuredGroupAllowFrom?: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
  channel?: ChannelId;
  accountId?: string;
  resolveAccessGroupMembership?: AccessGroupMembershipResolver;
  readAllowFromStore: () => Promise<string[]>;
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean; /** @deprecated Command authorization is resolved by channel ingress. Kept for runtime injection compatibility. */
  resolveCommandAuthorizedFromAuthorizers?: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
  }) => boolean;
};
/**
 * Injectable runtime hooks for legacy command authorization tests and channel adapters.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
type CommandAuthorizationRuntime = {
  shouldComputeCommandAuthorized: (rawBody: string, cfg: OpenClawConfig) => boolean;
  resolveCommandAuthorizedFromAuthorizers: (params: {
    useAccessGroups: boolean;
    authorizers: Array<{
      configured: boolean;
      allowed: boolean;
    }>;
  }) => boolean;
};
/**
 * Legacy command authorization params with runtime hooks grouped for dependency injection.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
type ResolveSenderCommandAuthorizationWithRuntimeParams = Omit<ResolveSenderCommandAuthorizationParams, "shouldComputeCommandAuthorized" | "resolveCommandAuthorizedFromAuthorizers"> & {
  runtime: CommandAuthorizationRuntime;
};
/**
 * Classify direct-DM command handling after sender authorization has been computed.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveDirectDmAuthorizationOutcome(params: {
  isGroup: boolean;
  dmPolicy: string;
  senderAllowedForCommands: boolean;
}): "disabled" | "unauthorized" | "allowed";
/**
 * Resolve legacy command authorization using an injected runtime object.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveSenderCommandAuthorizationWithRuntime(params: ResolveSenderCommandAuthorizationWithRuntimeParams): ReturnType<typeof resolveSenderCommandAuthorization>;
/**
 * Resolve whether a sender may run slash/control commands under legacy DM/group policy.
 * Returns effective allowlists so callers can report the exact source set used for authorization.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveSenderCommandAuthorization(params: ResolveSenderCommandAuthorizationParams): Promise<{
  shouldComputeAuth: boolean;
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
  senderAllowedForCommands: boolean;
  commandAuthorized: boolean | undefined;
}>;
//#endregion
export { ACCESS_GROUP_ALLOW_FROM_PREFIX, type AccessGroupMembershipLookup, type AccessGroupMembershipResolver, type ChatCommandDefinition, type CommandArgChoiceContext, type CommandArgDefinition, type CommandArgMenuSpec, type CommandArgValues, type CommandArgs, type CommandArgsParsing, type CommandAuthorization, CommandAuthorizationRuntime, type CommandAuthorizer, type CommandDetection, type CommandGatingModeWhenAccessGroupsOff, type CommandNormalizeOptions, type CommandScope, type DirectDmCommandAuthorizationRuntime, type ModelsProviderData, type NativeCommandSpec, type ResolveNativeCommandSessionTargetsParams, ResolveSenderCommandAuthorizationParams, ResolveSenderCommandAuthorizationWithRuntimeParams, type ResolvedAccessGroupAllowFromState, type ResolvedCommandArgChoice, type ResolvedInboundDirectDmAccess, type ShouldHandleTextCommandsParams, type SkillCommandSpec, type StoredModelOverride, buildCommandText, buildCommandTextFromArgs, buildCommandsPaginationKeyboard, buildModelsProviderData, createPreCryptoDirectDmAuthorizer, expandAllowFromWithAccessGroups, findCommandByNativeName, formatCommandArgMenuTitle, formatModelsAvailableHeader, getCommandDetection, getPluginCommandSpecs, hasControlCommand, hasInlineCommandTokens, isCommandEnabled, isCommandMessage, isControlCommandMessage, isNativeCommandSurface, listChatCommands, listChatCommandsForConfig, listNativeCommandSpecs, listNativeCommandSpecsForConfig, listProviderPluginCommandSpecs, listReservedChatSlashCommandNames, listSkillCommandsForAgents, listSkillCommandsForWorkspace, maybeResolveTextAlias, normalizeCommandBody, parseAccessGroupAllowFromEntry, parseCommandArgs, resolveAccessGroupAllowFromMatches, resolveAccessGroupAllowFromState, resolveCommandArgChoices, resolveCommandArgMenu, resolveCommandAuthorization, resolveCommandAuthorizedFromAuthorizers, resolveControlCommandGate, resolveDirectDmAuthorizationOutcome, resolveDualTextControlCommandGate, resolveInboundDirectDmAccessWithRuntime, resolveModelsCommandReply, resolveNativeCommandSessionTargets, resolveSenderCommandAuthorization, resolveSenderCommandAuthorizationWithRuntime, resolveSkillCommandInvocation, resolveStoredModelOverride, resolveTextCommand, serializeCommandArgs, shouldComputeCommandAuthorized, shouldHandleTextCommands };