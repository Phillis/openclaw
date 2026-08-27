import { i as normalizeChatChannelId } from "./ids-BDKYF0d6.js";
import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-4Nhw_LEO.js";
import { a as findChatChannelMeta, r as getRegisteredChannelPluginMeta } from "./registry-BYAHQp83.js";
import { c as normalizeGatewayClientName, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, s as normalizeGatewayClientMode } from "./client-info-yubNQC1L.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import "./message-channel-normalize-rAbqRXlG.js";
//#region src/utils/message-channel.ts
/** Return whether a Gateway client is the CLI transport. */
function isGatewayCliClient(client) {
	return normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.CLI;
}
/**
* Return whether a Gateway client is an ephemeral control-plane connection.
* Test-mode clients stay excluded from this list: suites use them as stand-ins
* for real clients and assert presence propagation through the full pipeline.
*/
function isEphemeralGatewayClient(client) {
	const mode = normalizeGatewayClientMode(client?.mode);
	return mode === GATEWAY_CLIENT_MODES.CLI || mode === GATEWAY_CLIENT_MODES.BACKEND || mode === GATEWAY_CLIENT_MODES.PROBE;
}
/** Return whether a client is one of the operator UI clients. */
function isOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT || clientId === GATEWAY_CLIENT_NAMES.TUI;
}
/** Return whether a client is the browser Control UI. */
function isBrowserOperatorUiClient(client) {
	const clientId = normalizeGatewayClientName(client?.id);
	return clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI || clientId === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
}
/** Return whether a client is the first-party browser side-panel copilot. */
function isBrowserCopilotClient(client) {
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.BROWSER_COPILOT;
}
/** Return whether a raw channel id resolves to OpenClaw's internal channel. */
function isInternalMessageChannel(raw) {
	return normalizeMessageChannel(raw) === INTERNAL_MESSAGE_CHANNEL;
}
/** Return whether a channel can resolve exec approvals in the originating chat. */
function isNativeApprovalChannel(value) {
	if (!value) return false;
	if (value === "webchat") return true;
	return listBundledChannelCatalogEntries().some((entry) => entry.id === value && entry.channel.approvalFlags?.includes("native"));
}
/** Return whether a Gateway client is the public webchat surface. */
function isWebchatClient(client) {
	if (normalizeGatewayClientMode(client?.mode) === GATEWAY_CLIENT_MODES.WEBCHAT) return true;
	return normalizeGatewayClientName(client?.id) === GATEWAY_CLIENT_NAMES.WEBCHAT_UI;
}
/** Resolve whether a channel can receive markdown without plain-text downgrade. */
function isMarkdownCapableMessageChannel(raw) {
	const channel = normalizeMessageChannel(raw);
	if (!channel) return false;
	if (channel === "webchat" || channel === "tui") return true;
	const builtInChannel = normalizeChatChannelId(channel);
	if (builtInChannel) {
		const builtInMeta = findChatChannelMeta(builtInChannel);
		if (builtInMeta) return builtInMeta.markdownCapable === true;
		const catalogMeta = listBundledChannelCatalogEntries().find((entry) => entry.id === builtInChannel);
		if (catalogMeta) return catalogMeta.channel.markdownCapable === true;
	}
	return getRegisteredChannelPluginMeta(channel)?.markdownCapable === true;
}
//#endregion
export { isInternalMessageChannel as a, isOperatorUiClient as c, isGatewayCliClient as i, isWebchatClient as l, isBrowserOperatorUiClient as n, isMarkdownCapableMessageChannel as o, isEphemeralGatewayClient as r, isNativeApprovalChannel as s, isBrowserCopilotClient as t };
