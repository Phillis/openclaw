import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { o as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-HlYcrSdl.js";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-uJ4oFasT.js";
import { n as bindChannelReplyTransformOwner, t as applyChannelReplyTransform } from "./reply-transform-CcuI1yfm.js";
import { n as createReplyPrefixOptions } from "./reply-prefix-B7Svb381.js";
import { t as createTypingCallbacks } from "./typing-QbFJ2R5k.js";
//#region src/channels/message/reply-pipeline.ts
/** Resolves whether a channel reply should use source delivery, message tools, or direct sending. */
function resolveChannelSourceReplyDeliveryMode(params) {
	return resolveSourceReplyDeliveryMode(params);
}
/** Builds the reply pipeline used by channel turns and plugin SDK reply helpers. */
function createChannelReplyPipeline(params) {
	const channelId = params.channel ? normalizeAnyChannelId(params.channel) ?? params.channel : void 0;
	let plugin;
	let pluginMessagingResolved = false;
	const resolvePluginMessaging = () => {
		if (pluginMessagingResolved) return plugin?.messaging;
		pluginMessagingResolved = true;
		plugin = channelId ? getLoadedChannelPluginForRead(channelId) : void 0;
		return plugin?.messaging;
	};
	const transformPluginReply = (payload) => {
		const messaging = resolvePluginMessaging();
		if (messaging?.transformReplyPayload) bindChannelReplyTransformOwner(transformPluginReply, messaging, params.accountId);
		return applyChannelReplyTransform({
			messaging,
			payload,
			cfg: params.cfg,
			accountId: params.accountId
		});
	};
	const transformReplyPayload = params.transformReplyPayload ? params.transformReplyPayload : channelId ? transformPluginReply : void 0;
	const prefixOptions = createReplyPrefixOptions({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId
	});
	return {
		...prefixOptions,
		resolveResponsePrefix: () => resolveResponsePrefixTemplate(prefixOptions.responsePrefix, prefixOptions.responsePrefixContextProvider()),
		...transformReplyPayload ? { transformReplyPayload } : {},
		...params.typingCallbacks ? { typingCallbacks: params.typingCallbacks } : params.typing ? { typingCallbacks: createTypingCallbacks(params.typing) } : {}
	};
}
//#endregion
export { resolveChannelSourceReplyDeliveryMode as n, createChannelReplyPipeline as t };
