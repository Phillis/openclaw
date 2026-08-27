import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { i as normalizeChatChannelId, t as CHANNEL_IDS } from "./ids-Cgp0iV_A.js";
import { n as listBundledChannelCatalogEntries } from "./bundled-channel-catalog-read-BhCviPr3.js";
import { a as findChatChannelMeta, i as listRegisteredChannelPluginIds, r as getRegisteredChannelPluginMeta } from "./registry-DbgR8dhg.js";
import { c as normalizeGatewayClientName, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, s as normalizeGatewayClientMode } from "./client-info-UYcIi_5g.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
//#region src/utils/message-channel-normalize.ts
/** Lists built-in and registered plugin channel ids that can receive delivery. */
const listDeliverableMessageChannels = () => uniqueStrings([...CHANNEL_IDS, ...listRegisteredChannelPluginIds()]);
/** Returns whether a normalized id is valid for Gateway routing. */
function isGatewayMessageChannel(value) {
	return value === "webchat" || isDeliverableMessageChannel(value);
}
/** Returns whether a normalized id is a deliverable non-internal channel. */
function isDeliverableMessageChannel(value) {
	return CHANNEL_IDS.some((channelId) => channelId === value) || listRegisteredChannelPluginIds().includes(value);
}
/** Normalizes and validates a raw channel value for Gateway routing. */
function resolveGatewayMessageChannel(raw) {
	const normalized = normalizeMessageChannel(raw);
	if (!normalized) return;
	return isGatewayMessageChannel(normalized) ? normalized : void 0;
}
/** Normalizes the primary channel or falls back to a secondary channel value. */
function resolveMessageChannel(primary, fallback) {
	return normalizeMessageChannel(primary) ?? normalizeMessageChannel(fallback);
}
//#endregion
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
const PROGRESS_CARD_RENDERER_PLATFORMS = /* @__PURE__ */ new Set([
	"web",
	"ios",
	"android",
	"macos",
	"darwin"
]);
/** Return whether a paired Gateway client can render progress cards. */
function isProgressCardRendererClient(paired) {
	const client = {
		id: paired?.clientId,
		mode: paired?.clientMode
	};
	const clientId = normalizeGatewayClientName(client?.id);
	const rendererClient = clientId === GATEWAY_CLIENT_NAMES.CONTROL_UI && isBrowserOperatorUiClient(client) || clientId === GATEWAY_CLIENT_NAMES.WEBCHAT_UI && isWebchatClient(client) || clientId === GATEWAY_CLIENT_NAMES.IOS_APP || clientId === GATEWAY_CLIENT_NAMES.ANDROID_APP || clientId === GATEWAY_CLIENT_NAMES.MACOS_APP;
	const platform = paired?.platform?.trim().toLowerCase();
	return rendererClient || (platform ? PROGRESS_CARD_RENDERER_PLATFORMS.has(platform) : false);
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
export { isInternalMessageChannel as a, isOperatorUiClient as c, isDeliverableMessageChannel as d, isGatewayMessageChannel as f, resolveMessageChannel as h, isGatewayCliClient as i, isProgressCardRendererClient as l, resolveGatewayMessageChannel as m, isBrowserOperatorUiClient as n, isMarkdownCapableMessageChannel as o, listDeliverableMessageChannels as p, isEphemeralGatewayClient as r, isNativeApprovalChannel as s, isBrowserCopilotClient as t, isWebchatClient as u };
