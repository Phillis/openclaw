import { o as resolveIMessageAccount } from "./accounts-DIpGOIiN.js";
import { m as setIMessageRuntime } from "./monitor-reply-cache-BdeUQaHO.js";
import { c as normalizeIMessageMessagingTarget, d as imessageMessageActions, f as probeIMessage, n as resolveIMessageGroupToolPolicy, s as looksLikeIMessageTargetId, t as resolveIMessageGroupRequireMention } from "./group-policy-BkMHTfdJ.js";
import { n as IMessageConfigSchema } from "./config-schema-DV0KP5nC.js";
import { t as sendMessageIMessage } from "./send-DrANSors.js";
import { t as monitorIMessageProvider } from "./monitor-fFEUA_tx.js";
import { formatTrimmedAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildComputedAccountStatusSnapshot, collectStatusIssuesFromLastError } from "openclaw/plugin-sdk/status-helpers";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/media-runtime";
import { chunkTextForOutbound } from "openclaw/plugin-sdk/text-chunking";
import { DEFAULT_ACCOUNT_ID, getChatChannelMeta } from "openclaw/plugin-sdk/core";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
//#region extensions/imessage/src/config-accessors.ts
function resolveIMessageConfigAllowFrom(params) {
	return (resolveIMessageAccount(params).config.allowFrom ?? []).map((entry) => String(entry));
}
function resolveIMessageConfigDefaultTo(params) {
	const defaultTo = resolveIMessageAccount(params).config.defaultTo;
	if (defaultTo == null) return;
	return defaultTo.trim() || void 0;
}
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, imessageMessageActions, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
