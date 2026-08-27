import { r as deliverSlackSlashReplies$1, s as sanitizeSlackMonitorReplyPayload } from "./replies-CCYBZNUM.js";
import { resolveAgentRoute as resolveAgentRoute$1 } from "openclaw/plugin-sdk/routing";
import { resolveMarkdownTableMode as resolveMarkdownTableMode$1 } from "openclaw/plugin-sdk/markdown-table-runtime";
import { resolveConversationLabel as resolveConversationLabel$1 } from "openclaw/plugin-sdk/conversation-runtime";
import { dispatchChannelInboundTurn as dispatchChannelInboundTurn$1, isChannelPartialDeliveryError as isChannelPartialDeliveryError$1 } from "openclaw/plugin-sdk/channel-inbound";
import { finalizeInboundContext as finalizeInboundContext$1, resolveChunkMode as resolveChunkMode$1 } from "openclaw/plugin-sdk/reply-runtime";
//#region extensions/slack/src/monitor/slash-dispatch.runtime.ts
function resolveChunkMode(...args) {
	return resolveChunkMode$1(...args);
}
function finalizeInboundContext(...args) {
	return finalizeInboundContext$1(...args);
}
function dispatchChannelInboundTurn(...args) {
	return dispatchChannelInboundTurn$1(...args);
}
function isChannelPartialDeliveryError(...args) {
	return isChannelPartialDeliveryError$1(...args);
}
function resolveConversationLabel(...args) {
	return resolveConversationLabel$1(...args);
}
function resolveMarkdownTableMode(...args) {
	return resolveMarkdownTableMode$1(...args);
}
function resolveAgentRoute(...args) {
	return resolveAgentRoute$1(...args);
}
function deliverSlackSlashReplies(...args) {
	return deliverSlackSlashReplies$1(...args);
}
//#endregion
export { deliverSlackSlashReplies, dispatchChannelInboundTurn, finalizeInboundContext, isChannelPartialDeliveryError, resolveAgentRoute, resolveChunkMode, resolveConversationLabel, resolveMarkdownTableMode, sanitizeSlackMonitorReplyPayload };
