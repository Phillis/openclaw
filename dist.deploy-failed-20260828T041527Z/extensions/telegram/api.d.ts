import { $ as buildGroupLabel, An as resetMissingDefaultWarnFlag, B as sendLocationTelegram, Ct as isBinaryContent, Dn as createTelegramActionGate, E as probeTelegram, En as TelegramPollActionGateState, Fn as mergeTelegramAccountConfig, In as resolveTelegramAccountConfig, J as reactMessageTelegram, Kn as TelegramButtonStyle, Ln as TelegramTokenResolution, Mn as resolveTelegramAccount, Nn as resolveTelegramMediaRuntimeOptions, On as listEnabledTelegramAccounts, Pn as resolveTelegramPollActionGateState, Q as TelegramReplyTarget, St as hasBotMention, T as TelegramProbeOptions, Tn as TelegramMediaRuntimeOptions, Tt as TelegramThreadSpec, Yn as ReplyPayload, _t as TelegramTextEntity, at as buildTypingThreadParams, b as shouldSuppressTelegramExecApprovalForwardingFallback, bt as extractTelegramLocation, ct as resolveTelegramForumFlag, d as parseTelegramTopicConversation, dt as resolveTelegramReplyId, et as buildTelegramGroupFrom, ft as resolveTelegramStreamMode, gt as TelegramForwardedContext, ht as StickerMetadata, it as buildTelegramThreadParams, jn as resolveDefaultTelegramAccountId, kn as listTelegramAccountIds, lt as resolveTelegramForumThreadId, mt as withResolvedTelegramForumFlag, nt as buildTelegramParentPeer, ot as describeReplyTarget, pt as resolveTelegramThreadSpec, qn as TelegramInlineButtons, rt as buildTelegramRoutingTarget, st as extractTelegramForumFlag, tt as buildTelegramGroupPeerId, u as ParsedTelegramTopicConversation, ut as resolveTelegramGroupAllowFromContext, vt as buildSenderLabel, w as TelegramProbe, wn as ResolvedTelegramAccount, wt as normalizeForwardedContext, xt as getTelegramTextParts, y as buildTelegramExecApprovalPendingPayload, yt as buildSenderName, z as sendMessageTelegram } from "../../acpx-hsLTUlEK.js";
import { At as MarkdownTableMode, B as TelegramNetworkConfig, L as TelegramExecApprovalConfig, M as ReactionLevel, N as ResolvedReactionLevel$1, ft as GroupToolPolicyConfig, n as OpenClawConfig, z as TelegramInlineButtonsScope } from "../../types.openclaw-n6JIVcIK.js";
import "../../config-contracts-B5xWKcfz.js";
import "../../channel-contract-DsIFrPEf.js";
import { D as ChannelOutboundAdapter, K as ChannelAccountSnapshot, Q as ChannelGroupContext, an as PluginApprovalRequest, cn as ExecApprovalRequest, it as ChannelStatusIssue } from "../../setup-wizard-types-CEvwzrXW.js";
import "../../types.public-DIsDeD7m.js";
import { a as normalizeTelegramCommandName, i as normalizeTelegramCommandDescription, n as TelegramCustomCommandInput, o as resolveTelegramCustomCommands, r as TelegramCustomCommandIssue, t as TELEGRAM_COMMAND_NAME_PATTERN } from "../../command-config-B5uSKuEF.js";
import { n as TelegramCredentialStatus, r as inspectTelegramAccount, t as InspectedTelegramAccount } from "../../account-inspect-B22dgz5m.js";
import { n as isNumericTelegramUserId, r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "../../allow-from-CUKXV9ZT.js";
import { t as telegramPlugin } from "../../channel-CJ7fLjJz.js";
import { t as telegramSetupPlugin } from "../../channel.setup-Bsip2GoL.js";
import { _ as parseModelCallbackData, a as buildTelegramModelsProviderChannelData, c as ParsedModelCallback, d as buildBrowseProvidersButton, f as buildModelSelectionCallbackData, g as getModelsPageSize, h as calculateTotalPages, i as buildCommandsPaginationKeyboard, l as ProviderInfo, m as buildProviderKeyboard, n as TelegramInteractiveHandlerRegistration, o as ButtonRow, p as buildModelsKeyboard, r as TelegramInteractiveHandlerResult, s as ModelsKeyboardParams, t as TelegramInteractiveHandlerContext, u as ResolveModelSelectionResult, v as resolveModelSelection } from "../../interactive-dispatch-C5uKrVLS.js";
import "../../reply-runtime-BYnilxfZ.js";
import { n as listTelegramDirectoryPeersFromConfig, t as listTelegramDirectoryGroupsFromConfig } from "../../directory-config-CNZKOgQ4.js";
import { t as collectTelegramSecurityAuditFindings } from "../../security-audit-7rD14JG-.js";
import { n as readTelegramUpdateOffset, r as writeTelegramUpdateOffset, t as deleteTelegramUpdateOffset } from "../../update-offset-store-C0iicdOm.js";
import { Message as TelegramBotMessage, Update as TelegramBotUpdate } from "grammy/types";
//#region extensions/telegram/src/action-threading.d.ts
declare function resolveTelegramAutoThreadId(params: {
  to: string;
  toolContext?: {
    currentThreadTs?: string;
    currentChannelId?: string;
  };
}): string | undefined;
//#endregion
//#region extensions/telegram/src/api-fetch.d.ts
declare function resolveTelegramChatLookupFetch(params?: {
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
}): typeof fetch;
declare function lookupTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
declare function fetchTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  fetchImpl?: typeof fetch;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
//#endregion
//#region extensions/telegram/src/dm-session-key.d.ts
declare function resolveTelegramDirectPeerId(params: {
  chatId: number | string;
  senderId?: number | string | null;
}): string;
//#endregion
//#region extensions/telegram/src/exec-approvals.d.ts
declare function resolveTelegramExecApprovalConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramExecApprovalConfig | undefined;
declare function getTelegramExecApprovalApprovers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[];
declare function isTelegramExecApprovalTargetRecipient(params: {
  cfg: OpenClawConfig;
  senderId?: string | null;
  accountId?: string | null;
}): boolean;
declare const isTelegramExecApprovalClientEnabled: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => boolean;
declare const isTelegramExecApprovalApprover: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  senderId?: string | null;
}) => boolean;
declare const isTelegramExecApprovalAuthorizedSender: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  senderId?: string | null;
}) => boolean;
declare const resolveTelegramExecApprovalTarget: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => "dm" | "channel" | "both";
declare const shouldHandleTelegramExecApprovalRequest: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
} & {
  request: ExecApprovalRequest | PluginApprovalRequest;
}) => boolean;
declare function shouldInjectTelegramExecApprovalButtons(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  to: string;
}): boolean;
declare function shouldSuppressLocalTelegramExecApprovalPrompt(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  payload: ReplyPayload;
}): boolean;
declare function isTelegramExecApprovalHandlerConfigured(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean;
//#endregion
//#region extensions/telegram/src/group-policy.d.ts
declare function resolveTelegramGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
declare function resolveTelegramGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
//#endregion
//#region extensions/telegram/src/targets.d.ts
type TelegramTarget = {
  chatId: string;
  messageThreadId?: number;
  directMessagesTopicId?: number;
  chatType: "direct" | "group" | "unknown";
};
declare function stripTelegramInternalPrefixes(to: string): string;
declare function normalizeTelegramChatId(raw: string): string | undefined;
declare function isNumericTelegramChatId(raw: string): boolean;
declare function normalizeTelegramLookupTarget(raw: string): string | undefined;
declare function parseTelegramTarget(to: string): TelegramTarget;
declare function resolveTelegramTargetChatType(target: string): "direct" | "group" | "unknown";
//#endregion
//#region extensions/telegram/src/inline-buttons.d.ts
declare function resolveTelegramInlineButtonsConfigScope(capabilities: unknown): TelegramInlineButtonsScope | undefined;
declare function resolveTelegramInlineButtonsScopeFromCapabilities(capabilities: unknown): TelegramInlineButtonsScope;
declare function resolveTelegramInlineButtonsScope(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramInlineButtonsScope;
declare function isTelegramInlineButtonsEnabled(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean;
//#endregion
//#region extensions/telegram/src/normalize.d.ts
declare function normalizeTelegramMessagingTarget(raw: string): string | undefined;
declare function looksLikeTelegramTargetId(raw: string): boolean;
//#endregion
//#region extensions/telegram/src/text-chunk-limit.d.ts
declare const TELEGRAM_TEXT_CHUNK_LIMIT = 4000;
//#endregion
//#region extensions/telegram/src/outbound-adapter.d.ts
type TelegramSendFn = typeof sendMessageTelegram;
type TelegramSendOpts = Parameters<TelegramSendFn>[2];
type TelegramReactionFn = typeof reactMessageTelegram;
type TelegramLocationFn = typeof sendLocationTelegram;
declare function sendTelegramPayloadMessages(params: {
  send: TelegramSendFn;
  sendLocation: TelegramLocationFn;
  react: TelegramReactionFn;
  to: string;
  payload: ReplyPayload;
  baseOpts: Omit<NonNullable<TelegramSendOpts>, "buttons" | "mediaUrl" | "quoteText">;
}): Promise<Awaited<ReturnType<TelegramSendFn>>>;
declare const telegramOutbound: ChannelOutboundAdapter;
//#endregion
//#region extensions/telegram/src/outbound-params.d.ts
declare function normalizeTelegramReplyToMessageId(value: unknown): number | undefined;
declare function parseTelegramReplyToMessageId(replyToId?: unknown): number | undefined;
declare function parseTelegramThreadId(threadId?: string | number | null): number | undefined;
//#endregion
//#region extensions/telegram/src/reaction-level.d.ts
type TelegramReactionLevel = ReactionLevel;
type ResolvedReactionLevel = ResolvedReactionLevel$1;
/**
 * Resolve the effective reaction level and its implications.
 */
declare function resolveTelegramReactionLevel(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedReactionLevel;
//#endregion
//#region extensions/telegram/src/sticker-cache-store.legacy-state.d.ts
interface CachedSticker {
  fileId: string;
  fileUniqueId: string;
  emoji?: string;
  setName?: string;
  description: string;
  cachedAt: string;
  receivedFrom?: string;
}
//#endregion
//#region extensions/telegram/src/sticker-cache-store.d.ts
/**
 * Get a cached sticker by its unique ID.
 */
declare function getCachedSticker(fileUniqueId: string): CachedSticker | null;
/**
 * Add or update a sticker in the cache.
 */
declare function cacheSticker(sticker: CachedSticker): void;
/**
 * Search cached stickers by text query (fuzzy match on description + emoji + setName).
 */
declare function searchStickers(query: string, limit?: number): CachedSticker[];
/**
 * Get all cached stickers (for debugging/listing).
 */
declare function getAllCachedStickers(): CachedSticker[];
/**
 * Get cache statistics.
 */
declare function getCacheStats(): {
  count: number;
  oldestAt?: string;
  newestAt?: string;
};
//#endregion
//#region extensions/telegram/src/sticker-cache.d.ts
interface DescribeStickerParams {
  imagePath: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  agentId?: string;
}
/**
 * Describe a sticker image using vision API.
 * Auto-detects an available vision provider based on configured API keys.
 * Returns null if no vision provider is available.
 */
declare function describeStickerImage(params: DescribeStickerParams): Promise<string | null>;
//#endregion
//#region extensions/telegram/src/status-issues.d.ts
declare function collectTelegramStatusIssues(accounts: ChannelAccountSnapshot[]): ChannelStatusIssue[];
//#endregion
//#region extensions/telegram/src/format.d.ts
type TelegramFormattedChunk = {
  html: string;
  text: string;
};
declare function escapeTelegramHtml(text: string): string;
declare function markdownToTelegramHtml(markdown: string, options?: {
  tableMode?: MarkdownTableMode;
  wrapFileRefs?: boolean;
}): string;
declare function splitTelegramHtmlChunks(html: string, limit: number): string[];
declare function markdownToTelegramChunks(markdown: string, limit: number, options?: {
  tableMode?: MarkdownTableMode;
}): TelegramFormattedChunk[];
declare function markdownToTelegramHtmlChunks(markdown: string, limit: number, options?: {
  tableMode?: MarkdownTableMode;
}): string[];
//#endregion
export { type ButtonRow, type CachedSticker, type DescribeStickerParams, type InspectedTelegramAccount, type ModelsKeyboardParams, type ParsedModelCallback, type ParsedTelegramTopicConversation, type ProviderInfo, type ResolveModelSelectionResult, type ResolvedReactionLevel, type ResolvedTelegramAccount, type StickerMetadata, TELEGRAM_COMMAND_NAME_PATTERN, TELEGRAM_TEXT_CHUNK_LIMIT, type TelegramBotMessage, type TelegramBotUpdate, type TelegramButtonStyle, type TelegramCredentialStatus, type TelegramCustomCommandInput, type TelegramCustomCommandIssue, type TelegramFormattedChunk, type TelegramForwardedContext, type TelegramInlineButtons, type TelegramInteractiveHandlerContext, type TelegramInteractiveHandlerRegistration, type TelegramInteractiveHandlerResult, type TelegramMediaRuntimeOptions, type TelegramPollActionGateState, type TelegramProbe, type TelegramProbeOptions, type TelegramReactionLevel, type TelegramReplyTarget, type TelegramTarget, type TelegramTextEntity, type TelegramThreadSpec, type TelegramTokenResolution, buildBrowseProvidersButton, buildCommandsPaginationKeyboard, buildGroupLabel, buildModelSelectionCallbackData, buildModelsKeyboard, buildProviderKeyboard, buildSenderLabel, buildSenderName, buildTelegramExecApprovalPendingPayload, buildTelegramGroupFrom, buildTelegramGroupPeerId, buildTelegramModelsProviderChannelData, buildTelegramParentPeer, buildTelegramRoutingTarget, buildTelegramThreadParams, buildTypingThreadParams, cacheSticker, calculateTotalPages, collectTelegramSecurityAuditFindings, collectTelegramStatusIssues, createTelegramActionGate, deleteTelegramUpdateOffset, describeReplyTarget, describeStickerImage, escapeTelegramHtml, extractTelegramForumFlag, extractTelegramLocation, fetchTelegramChatId, getAllCachedStickers, getCacheStats, getCachedSticker, getModelsPageSize, getTelegramExecApprovalApprovers, getTelegramTextParts, hasBotMention, inspectTelegramAccount, isBinaryContent, isNumericTelegramChatId, isNumericTelegramSenderUserId, isNumericTelegramUserId, isTelegramExecApprovalApprover, isTelegramExecApprovalAuthorizedSender, isTelegramExecApprovalClientEnabled, isTelegramExecApprovalHandlerConfigured, isTelegramExecApprovalTargetRecipient, isTelegramInlineButtonsEnabled, listEnabledTelegramAccounts, listTelegramAccountIds, listTelegramDirectoryGroupsFromConfig, listTelegramDirectoryPeersFromConfig, looksLikeTelegramTargetId, lookupTelegramChatId, markdownToTelegramChunks, markdownToTelegramHtml, markdownToTelegramHtmlChunks, mergeTelegramAccountConfig, normalizeForwardedContext, normalizeTelegramAllowFromEntry, normalizeTelegramChatId, normalizeTelegramCommandDescription, normalizeTelegramCommandName, normalizeTelegramLookupTarget, normalizeTelegramMessagingTarget, normalizeTelegramReplyToMessageId, parseModelCallbackData, parseTelegramReplyToMessageId, parseTelegramTarget, parseTelegramThreadId, parseTelegramTopicConversation, probeTelegram, readTelegramUpdateOffset, resetMissingDefaultWarnFlag, resolveDefaultTelegramAccountId, resolveModelSelection, resolveTelegramAccount, resolveTelegramAccountConfig, resolveTelegramAutoThreadId, resolveTelegramChatLookupFetch, resolveTelegramCustomCommands, resolveTelegramDirectPeerId, resolveTelegramExecApprovalConfig, resolveTelegramExecApprovalTarget, resolveTelegramForumFlag, resolveTelegramForumThreadId, resolveTelegramGroupAllowFromContext, resolveTelegramGroupRequireMention, resolveTelegramGroupToolPolicy, resolveTelegramInlineButtonsConfigScope, resolveTelegramInlineButtonsScope, resolveTelegramInlineButtonsScopeFromCapabilities, resolveTelegramMediaRuntimeOptions, resolveTelegramPollActionGateState, resolveTelegramReactionLevel, resolveTelegramReplyId, resolveTelegramStreamMode, resolveTelegramTargetChatType, resolveTelegramThreadSpec, searchStickers, sendTelegramPayloadMessages, shouldHandleTelegramExecApprovalRequest, shouldInjectTelegramExecApprovalButtons, shouldSuppressLocalTelegramExecApprovalPrompt, shouldSuppressTelegramExecApprovalForwardingFallback, splitTelegramHtmlChunks, stripTelegramInternalPrefixes, telegramOutbound, telegramPlugin, telegramSetupPlugin, withResolvedTelegramForumFlag, writeTelegramUpdateOffset };