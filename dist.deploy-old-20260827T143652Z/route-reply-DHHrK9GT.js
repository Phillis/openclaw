import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { i as normalizeChatChannelId } from "./ids-BDKYF0d6.js";
import { n as getBundledChannelPlugin } from "./bundled-CY1EA4MS.js";
import "./registry-BYAHQp83.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { a as getReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-B3yYjPW1.js";
import "./plugins-cwOWOggC.js";
import "./message-channel-T4W5YOto.js";
import { o as hasReplyPayloadContent } from "./payload-ByplrRCQ.js";
import { o as shouldSuppressReasoningPayload, r as formatBtwTextForExternalDelivery } from "./reply-payloads-DqK1lEBN.js";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply--NSgVK7M.js";
import { r as resolveEffectiveMessagesConfig } from "./identity-hPPJEi06.js";
import { t as buildOutboundSessionContext } from "./session-context-Boxqt1oa.js";
import { r as createChannelReplyTransform } from "./reply-transform-D4mhFVwH.js";
//#region src/auto-reply/reply/route-reply.ts
/**
* Provider-agnostic reply router.
*
* Routes replies to the originating channel based on OriginatingChannel/OriginatingTo
* instead of using the session's lastChannel. This ensures replies go back to the
* provider where the message originated, even when the main session is shared
* across multiple providers.
*/
const messageRuntimeLoader = createLazyImportLoader(() => import("./runtime-CoFLMf90.js"));
function loadDeliverRuntime() {
	return messageRuntimeLoader.load();
}
function replyDeliverySourceMatchesRoute(params) {
	return (normalizeMessageChannel(params.source.channel) ?? normalizeOptionalLowercaseString(params.source.channel)) === (normalizeMessageChannel(params.channel) ?? normalizeOptionalLowercaseString(params.channel)) && normalizeAccountId(params.source.accountId) === normalizeAccountId(params.accountId) && normalizeChatType(params.payloadDelivery.chatType ?? void 0) === normalizeChatType(params.routeDelivery.chatType ?? void 0);
}
function summarizeVisibleRouteReplyDelivery(results) {
	let delivered = false;
	let lastVisibleMessageId;
	for (let index = results.length - 1; index >= 0; index -= 1) {
		const result = results[index];
		if (!result) continue;
		const messageId = result.messageId?.trim().toLowerCase();
		if (messageId === "skipped" || messageId === "suppressed") continue;
		if (!delivered) {
			delivered = true;
			if (!messageId) lastVisibleMessageId = result.messageId;
		}
		if (messageId && messageId !== "unknown" && messageId !== "ok") return {
			delivered: true,
			messageId: result.messageId
		};
	}
	return {
		delivered,
		messageId: delivered ? lastVisibleMessageId : void 0
	};
}
/**
* Routes a reply payload to the specified channel.
*
* This function provides a unified interface for sending messages to any
* supported provider. It's used by the followup queue to route replies
* back to the originating channel when OriginatingChannel/OriginatingTo
* are set.
*/
async function routeReply(params) {
	const { payload, channel, to, accountId, threadId, cfg, abortSignal } = params;
	if (shouldSuppressReasoningPayload(payload)) return {
		ok: true,
		delivered: false,
		suppressed: true,
		reason: "reasoning_payload_not_external"
	};
	const normalizedChannel = normalizeMessageChannel(channel);
	const channelId = normalizeChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? null;
	const loadedPlugin = channelId ? getLoadedChannelPlugin(channelId) : void 0;
	const bundledPlugin = channelId && !loadedPlugin ? getBundledChannelPlugin(channelId) : void 0;
	const messaging = loadedPlugin?.messaging ?? bundledPlugin?.messaging;
	const threading = loadedPlugin?.threading ?? bundledPlugin?.threading;
	const resolvedAgentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg
	}) : void 0;
	const responsePrefix = resolveEffectiveMessagesConfig(cfg, resolvedAgentId ?? resolveSessionAgentId({ config: cfg }), {
		channel: normalizedChannel,
		accountId
	}).responsePrefix;
	const transformReplyPayload = createChannelReplyTransform({
		messaging,
		cfg,
		accountId
	});
	const normalization = normalizeReplyPayloadOutcome(payload, {
		responsePrefix,
		responsePrefixContext: params.responsePrefixContext,
		transformReplyPayload
	});
	if (normalization.kind === "suppress") {
		if (normalization.reason === "channel_transform") return {
			ok: true,
			delivered: false,
			suppressed: true,
			reason: normalization.reason
		};
		return {
			ok: true,
			delivered: false
		};
	}
	const normalized = normalization.payload;
	const externalPayload = {
		...normalized,
		text: formatBtwTextForExternalDelivery(normalized)
	};
	const text = externalPayload.text ?? "";
	let mediaUrls = [];
	for (const url of externalPayload.mediaUrls ?? []) if (url) mediaUrls.push(url);
	if (mediaUrls.length === 0 && externalPayload.mediaUrl) mediaUrls = [externalPayload.mediaUrl];
	const replyToId = externalPayload.replyToId;
	const hasChannelData = messaging?.hasStructuredReplyPayload?.({ payload: externalPayload });
	if (!hasReplyPayloadContent({
		...externalPayload,
		text,
		mediaUrls
	}, { hasChannelData })) return {
		ok: true,
		delivered: false
	};
	if (channel === "webchat") return {
		ok: false,
		delivered: false,
		error: "Webchat routing not supported for queued replies"
	};
	if (!channelId) return {
		ok: false,
		delivered: false,
		error: `Unknown channel: ${String(channel)}`
	};
	if (abortSignal?.aborted) return {
		ok: false,
		delivered: false,
		error: "Reply routing aborted"
	};
	const payloadMetadata = getReplyPayloadMetadata(normalized);
	const payloadReplyDelivery = payloadMetadata?.replyDelivery;
	const replyDelivery = (payloadReplyDelivery && params.replyDelivery && payloadMetadata.replyDeliverySource ? replyDeliverySourceMatchesRoute({
		source: payloadMetadata.replyDeliverySource,
		payloadDelivery: payloadReplyDelivery,
		routeDelivery: params.replyDelivery,
		channel: channelId,
		accountId
	}) : false) ? payloadReplyDelivery : params.replyDelivery ?? payloadReplyDelivery;
	const replyTransport = threading?.resolveReplyTransport?.({
		cfg,
		accountId,
		threadId,
		replyToId,
		replyToIsExplicit: Boolean(payloadMetadata?.replyToIdExplicit || normalized.replyToTag || normalized.replyToCurrent),
		replyDelivery
	}) ?? null;
	const resolvedReplyToId = replyTransport?.replyToId === null ? void 0 : replyTransport?.replyToId ?? replyToId ?? void 0;
	const resolvedThreadId = replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId ?? null : threadId ?? null;
	const deliveryPayload = {
		...externalPayload,
		replyToId: resolvedReplyToId
	};
	try {
		const { sendDurableMessageBatchCore } = await loadDeliverRuntime();
		const outboundSession = buildOutboundSessionContext({
			cfg,
			agentId: resolvedAgentId,
			sessionKey: params.sessionKey,
			policySessionKey: params.policySessionKey,
			conversationType: params.policyConversationType,
			isGroup: params.policySessionKey || params.policyConversationType ? void 0 : params.isGroup,
			requesterSenderId: params.requesterSenderId,
			requesterSenderName: params.requesterSenderName,
			requesterSenderUsername: params.requesterSenderUsername,
			requesterSenderE164: params.requesterSenderE164
		});
		const send = await sendDurableMessageBatchCore({
			cfg,
			channel: channelId,
			to,
			accountId: accountId ?? void 0,
			payloads: [deliveryPayload],
			replyPayloadSendingHook: {
				kind: params.replyKind,
				channel: channelId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				...params.runId ? { runId: params.runId } : {},
				context: {
					channelId,
					...accountId ? { accountId } : {},
					conversationId: to,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					...params.requesterSenderId ? { senderId: params.requesterSenderId } : {},
					...params.runId ? { runId: params.runId } : {}
				}
			},
			replyToId: resolvedReplyToId ?? null,
			threadId: resolvedThreadId,
			session: outboundSession,
			signal: abortSignal,
			mirror: params.mirror !== false && params.sessionKey ? {
				sessionKey: params.sessionKey,
				agentId: resolvedAgentId,
				text,
				mediaUrls,
				...params.isGroup != null ? { isGroup: params.isGroup } : {},
				...params.groupId ? { groupId: params.groupId } : {}
			} : void 0
		});
		if (send.status === "failed") throw send.error;
		if (send.status === "partial_failed") {
			const delivery = summarizeVisibleRouteReplyDelivery(send.results);
			return {
				ok: false,
				delivered: delivery.delivered,
				error: `Failed to route reply to ${channel}: ${formatErrorMessage(send.error)}`,
				messageId: delivery.messageId
			};
		}
		if (send.status === "suppressed" && (send.reason === "cancelled_by_message_sending_hook" || send.reason === "cancelled_by_reply_payload_sending_hook" || send.reason === "empty_after_message_sending_hook" || send.reason === "empty_after_reply_payload_sending_hook")) return {
			ok: true,
			delivered: false,
			suppressed: true,
			reason: send.reason
		};
		if (send.status === "suppressed" && send.reason === "adapter_returned_no_identity") return {
			ok: true,
			delivered: true,
			ambiguous: true,
			reason: send.reason
		};
		const delivery = summarizeVisibleRouteReplyDelivery(send.status === "sent" ? send.results : []);
		return {
			ok: true,
			delivered: delivery.delivered,
			messageId: delivery.messageId
		};
	} catch (err) {
		return {
			ok: false,
			delivered: false,
			error: `Failed to route reply to ${channel}: ${formatErrorMessage(err)}`
		};
	}
}
/**
* Checks if a channel type is routable via routeReply.
*
* Some channels (webchat) require special handling and cannot be routed through
* this generic interface.
*/
function isRoutableChannel(channel) {
	if (!channel || channel === "webchat") return false;
	return normalizeChatChannelId(channel) !== null || normalizeChannelId(channel) !== null;
}
//#endregion
export { routeReply as n, isRoutableChannel as t };
