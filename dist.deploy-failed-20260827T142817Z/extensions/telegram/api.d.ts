import { N as GroupToolPolicyConfig, Y as MarkdownTableMode, c as ResolvedReactionLevel$1, f as TelegramExecApprovalConfig, h as TelegramNetworkConfig, m as TelegramInlineButtonsScope, n as OpenClawConfig, s as ReactionLevel } from "../../types.openclaw-VfFCsbZD.js";
import { C as ChannelOutboundAdapter, F as ChannelAccountSnapshot, V as ChannelGroupContext, ot as PluginApprovalRequest, q as ChannelStatusIssue, vt as ExecApprovalRequest } from "../../types.adapters-BCj_O1Hf.js";
import { s as ReplyPayload } from "../../media-services-CCiq3Bcu.js";
import { a as listEnabledTelegramAccounts, c as resolveDefaultTelegramAccountId, d as resolveTelegramPollActionGateState, f as mergeTelegramAccountConfig, i as createTelegramActionGate, l as resolveTelegramAccount, m as TelegramTokenResolution, n as TelegramMediaRuntimeOptions, o as listTelegramAccountIds, p as resolveTelegramAccountConfig, r as TelegramPollActionGateState, s as resetMissingDefaultWarnFlag, t as ResolvedTelegramAccount, u as resolveTelegramMediaRuntimeOptions } from "../../accounts-TOCbk8Ss.js";
import { n as TelegramCredentialStatus, r as inspectTelegramAccount, t as InspectedTelegramAccount } from "../../account-inspect-XTEuC2XI.js";
import { A as extractTelegramForumFlag, B as TelegramForwardedContext, C as buildTelegramGroupFrom, D as buildTelegramThreadParams, E as buildTelegramRoutingTarget, F as resolveTelegramReplyId, G as getTelegramTextParts, H as buildSenderLabel, I as resolveTelegramStreamMode, J as normalizeForwardedContext, K as hasBotMention, L as resolveTelegramThreadSpec, M as resolveTelegramForumFlag, N as resolveTelegramForumThreadId, O as buildTypingThreadParams, P as resolveTelegramGroupAllowFromContext, R as withResolvedTelegramForumFlag, S as buildGroupLabel, T as buildTelegramParentPeer, U as buildSenderName, V as TelegramTextEntity, W as extractTelegramLocation, X as TelegramInlineButtons, Y as TelegramButtonStyle, b as TelegramReplyTarget, c as sendLocationTelegram, g as reactMessageTelegram, j as resetTelegramForumFlagCacheForTest, k as describeReplyTarget, q as isBinaryContent, s as sendMessageTelegram, w as buildTelegramGroupPeerId, x as TelegramThreadSpec, z as StickerMetadata } from "../../runtime-D_GlO6Sj.js";
import { c as shouldSuppressTelegramExecApprovalForwardingFallback, s as buildTelegramExecApprovalPendingPayload } from "../../runtime-api-CFbx_9M3.js";
import { a as normalizeTelegramCommandName, i as normalizeTelegramCommandDescription, n as TelegramCustomCommandInput, o as resolveTelegramCustomCommands, r as TelegramCustomCommandIssue, t as TELEGRAM_COMMAND_NAME_PATTERN } from "../../command-config-B5uSKuEF.js";
import { i as resetTelegramProbeFetcherCacheForTests, n as TelegramProbeOptions, r as probeTelegram, t as TelegramProbe } from "../../probe-DrrFn4Od.js";
import { n as parseTelegramTopicConversation, t as ParsedTelegramTopicConversation } from "../../topic-conversation-DB0Kpc_a.js";
import { n as isNumericTelegramUserId, r as normalizeTelegramAllowFromEntry, t as isNumericTelegramSenderUserId } from "../../allow-from-CUKXV9ZT.js";
import { t as telegramPlugin } from "../../channel-BFuJtiNr.js";
import { t as telegramSetupPlugin } from "../../channel.setup-BRTck6OX.js";
import { _ as parseModelCallbackData, a as buildTelegramModelsProviderChannelData, c as ParsedModelCallback, d as buildBrowseProvidersButton, f as buildModelSelectionCallbackData, g as getModelsPageSize, h as calculateTotalPages, i as buildCommandsPaginationKeyboard, l as ProviderInfo, m as buildProviderKeyboard, n as TelegramInteractiveHandlerRegistration, o as ButtonRow, p as buildModelsKeyboard, r as TelegramInteractiveHandlerResult, s as ModelsKeyboardParams, t as TelegramInteractiveHandlerContext, u as ResolveModelSelectionResult, v as resolveModelSelection } from "../../interactive-dispatch-CvuodZFV.js";
import { n as listTelegramDirectoryPeersFromConfig, t as listTelegramDirectoryGroupsFromConfig } from "../../directory-config-CoDgJtme.js";
import { t as collectTelegramSecurityAuditFindings } from "../../security-audit-Dg34HrPf.js";
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
}) => "channel" | "dm" | "both";
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
//#region extensions/telegram/src/outbound-adapter.d.ts
declare const TELEGRAM_TEXT_CHUNK_LIMIT = 4000;
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
export { type ButtonRow, type CachedSticker, type DescribeStickerParams, type InspectedTelegramAccount, type ModelsKeyboardParams, type ParsedModelCallback, type ParsedTelegramTopicConversation, type ProviderInfo, type ResolveModelSelectionResult, type ResolvedReactionLevel, type ResolvedTelegramAccount, type StickerMetadata, TELEGRAM_COMMAND_NAME_PATTERN, TELEGRAM_TEXT_CHUNK_LIMIT, type TelegramBotMessage, type TelegramBotUpdate, type TelegramButtonStyle, type TelegramCredentialStatus, type TelegramCustomCommandInput, type TelegramCustomCommandIssue, type TelegramFormattedChunk, type TelegramForwardedContext, type TelegramInlineButtons, type TelegramInteractiveHandlerContext, type TelegramInteractiveHandlerRegistration, type TelegramInteractiveHandlerResult, type TelegramMediaRuntimeOptions, type TelegramPollActionGateState, type TelegramProbe, type TelegramProbeOptions, type TelegramReactionLevel, type TelegramReplyTarget, type TelegramTarget, type TelegramTextEntity, type TelegramThreadSpec, type TelegramTokenResolution, buildBrowseProvidersButton, buildCommandsPaginationKeyboard, buildGroupLabel, buildModelSelectionCallbackData, buildModelsKeyboard, buildProviderKeyboard, buildSenderLabel, buildSenderName, buildTelegramExecApprovalPendingPayload, buildTelegramGroupFrom, buildTelegramGroupPeerId, buildTelegramModelsProviderChannelData, buildTelegramParentPeer, buildTelegramRoutingTarget, buildTelegramThreadParams, buildTypingThreadParams, cacheSticker, calculateTotalPages, collectTelegramSecurityAuditFindings, collectTelegramStatusIssues, createTelegramActionGate, deleteTelegramUpdateOffset, describeReplyTarget, describeStickerImage, escapeTelegramHtml, extractTelegramForumFlag, extractTelegramLocation, fetchTelegramChatId, getAllCachedStickers, getCacheStats, getCachedSticker, getModelsPageSize, getTelegramExecApprovalApprovers, getTelegramTextParts, hasBotMention, inspectTelegramAccount, isBinaryContent, isNumericTelegramChatId, isNumericTelegramSenderUserId, isNumericTelegramUserId, isTelegramExecApprovalApprover, isTelegramExecApprovalAuthorizedSender, isTelegramExecApprovalClientEnabled, isTelegramExecApprovalHandlerConfigured, isTelegramExecApprovalTargetRecipient, isTelegramInlineButtonsEnabled, listEnabledTelegramAccounts, listTelegramAccountIds, listTelegramDirectoryGroupsFromConfig, listTelegramDirectoryPeersFromConfig, looksLikeTelegramTargetId, lookupTelegramChatId, markdownToTelegramChunks, markdownToTelegramHtml, markdownToTelegramHtmlChunks, mergeTelegramAccountConfig, normalizeForwardedContext, normalizeTelegramAllowFromEntry, normalizeTelegramChatId, normalizeTelegramCommandDescription, normalizeTelegramCommandName, normalizeTelegramLookupTarget, normalizeTelegramMessagingTarget, normalizeTelegramReplyToMessageId, parseModelCallbackData, parseTelegramReplyToMessageId, parseTelegramTarget, parseTelegramThreadId, parseTelegramTopicConversation, probeTelegram, readTelegramUpdateOffset, resetMissingDefaultWarnFlag, resetTelegramForumFlagCacheForTest, resetTelegramProbeFetcherCacheForTests, resolveDefaultTelegramAccountId, resolveModelSelection, resolveTelegramAccount, resolveTelegramAccountConfig, resolveTelegramAutoThreadId, resolveTelegramChatLookupFetch, resolveTelegramCustomCommands, resolveTelegramDirectPeerId, resolveTelegramExecApprovalConfig, resolveTelegramExecApprovalTarget, resolveTelegramForumFlag, resolveTelegramForumThreadId, resolveTelegramGroupAllowFromContext, resolveTelegramGroupRequireMention, resolveTelegramGroupToolPolicy, resolveTelegramInlineButtonsConfigScope, resolveTelegramInlineButtonsScope, resolveTelegramInlineButtonsScopeFromCapabilities, resolveTelegramMediaRuntimeOptions, resolveTelegramPollActionGateState, resolveTelegramReactionLevel, resolveTelegramReplyId, resolveTelegramStreamMode, resolveTelegramTargetChatType, resolveTelegramThreadSpec, searchStickers, sendTelegramPayloadMessages, shouldHandleTelegramExecApprovalRequest, shouldInjectTelegramExecApprovalButtons, shouldSuppressLocalTelegramExecApprovalPrompt, shouldSuppressTelegramExecApprovalForwardingFallback, splitTelegramHtmlChunks, stripTelegramInternalPrefixes, telegramOutbound, telegramPlugin, telegramSetupPlugin, withResolvedTelegramForumFlag, writeTelegramUpdateOffset };