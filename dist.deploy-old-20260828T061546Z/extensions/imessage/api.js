import { a as resolveDefaultIMessageAccountId, i as listIMessageAccountIds, o as resolveIMessageAccount, r as listEnabledIMessageAccounts } from "./accounts-DIpGOIiN.js";
import { a as isAllowedIMessageSender, c as parseIMessageAllowTarget, g as IMESSAGE_ACTION_NAMES, h as IMESSAGE_ACTIONS, l as parseIMessageTarget, n as formatIMessageChatTarget, o as looksLikeIMessageExplicitTargetId, r as inferIMessageTargetChatType, s as normalizeIMessageHandle } from "./message-tool-api-BwIxJDoz.js";
import { s as DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS } from "./sanitize-outbound-Bp3Bjyyc.js";
import { a as normalizeIMessageAcpConversationId, c as normalizeIMessageMessagingTarget, f as probeIMessage, i as matchIMessageAcpConversation, n as resolveIMessageGroupToolPolicy, o as resolveIMessageConversationIdFromTarget, r as resolveIMessageInboundConversationId, s as looksLikeIMessageTargetId, t as resolveIMessageGroupRequireMention, v as imessageSetupContract } from "./group-policy-BkMHTfdJ.js";
import { n as createIMessagePluginBase, r as imessageSetupWizard, t as imessagePlugin } from "./channel-CKjIeGWB.js";
import { t as createIMessageConversationBindingManager } from "./conversation-bindings-GDQ_Laxj.js";
import { t as IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./outbound-send-deps-B-QEsLSM.js";
import { createAllowedChatSenderMatcher, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget, resolveServicePrefixedTarget } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = { ...createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setupContract: imessageSetupContract
}) };
//#endregion
export { DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS, IMESSAGE_ACTIONS, IMESSAGE_ACTION_NAMES, IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS, createAllowedChatSenderMatcher, createIMessageConversationBindingManager, formatIMessageChatTarget, imessagePlugin, imessageSetupPlugin, inferIMessageTargetChatType, isAllowedIMessageSender, listEnabledIMessageAccounts, listIMessageAccountIds, looksLikeIMessageExplicitTargetId, looksLikeIMessageTargetId, matchIMessageAcpConversation, normalizeIMessageAcpConversationId, normalizeIMessageHandle, normalizeIMessageMessagingTarget, parseChatAllowTargetPrefixes, parseChatTargetPrefixesOrThrow, parseIMessageAllowTarget, parseIMessageTarget, probeIMessage, resolveDefaultIMessageAccountId, resolveIMessageAccount, resolveIMessageConversationIdFromTarget, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, resolveIMessageInboundConversationId, resolveServicePrefixedAllowTarget, resolveServicePrefixedChatTarget, resolveServicePrefixedOrChatAllowTarget, resolveServicePrefixedTarget };
