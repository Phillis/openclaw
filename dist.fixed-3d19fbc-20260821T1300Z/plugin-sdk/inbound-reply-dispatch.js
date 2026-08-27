import { t as deliverInboundReplyWithMessageSendContext } from "../channel-outbound-CP6yKwU3.js";
import { x as normalizeOutboundReplyPayloadCore } from "../reply-payload-DBNGwex4.js";
import { t as recordDroppedChannelTurnHistory } from "../run-channel-turn-RWr0qaKO.js";
import { a as recordChannelBotPairLoopAndCheckSuppression } from "../lifecycle-B5zp5eLN.js";
import { i as resolveChannelTurnDispatchCounts, n as hasFinalChannelTurnDispatch, r as hasVisibleChannelTurnDispatch } from "../dispatch-result-DaybJgme.js";
import { n as isDurableInboundReplyDeliveryHandled, r as throwIfDurableInboundReplyDeliveryFailed, t as deliverInboundReplyWithMessageSendContextCore } from "../durable-delivery-C1wIEV8i.js";
import { a as runChannelInboundEvent, n as dispatchChannelInboundReply, o as runPreparedInboundReply } from "../channel-inbound-tRRtLmIr.js";
//#region src/plugin-sdk/inbound-reply-dispatch.ts
function buildInboundReplyDispatchBase(params) {
	return {
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.route.agentId,
		routeSessionKey: params.route.sessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.core.channel.session.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: params.core.channel.reply.dispatchReplyWithBufferedBlockDispatcher
	};
}
async function recordInboundSessionAndDispatchReply(params) {
	await dispatchChannelInboundReply({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		agentId: params.agentId,
		routeSessionKey: params.routeSessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.recordInboundSession,
		dispatchReplyWithBufferedBlockDispatcher: params.dispatchReplyWithBufferedBlockDispatcher,
		delivery: {
			preparePayload: (payload) => payload && typeof payload === "object" ? normalizeOutboundReplyPayloadCore(payload) : {},
			deliver: async (payload, info) => {
				if (params.durable) {
					const durable = await deliverInboundReplyWithMessageSendContextCore({
						cfg: params.cfg,
						channel: params.channel,
						accountId: params.accountId,
						agentId: params.agentId,
						ctxPayload: params.ctxPayload,
						payload,
						info,
						...params.durable
					});
					throwIfDurableInboundReplyDeliveryFailed(durable);
					if (isDurableInboundReplyDeliveryHandled(durable)) return durable.delivery;
				}
				return await params.deliver(payload);
			},
			onError: params.onDispatchError
		},
		replyPipeline: {},
		replyOptions: params.replyOptions,
		record: { onRecordError: params.onRecordError }
	});
}
async function dispatchInboundReplyWithBase(params) {
	await recordInboundSessionAndDispatchReply({
		...buildInboundReplyDispatchBase(params),
		deliver: params.deliver,
		durable: params.durable,
		onRecordError: params.onRecordError,
		onDispatchError: params.onDispatchError,
		replyOptions: params.replyOptions
	});
}
//#endregion
export { deliverInboundReplyWithMessageSendContext, dispatchChannelInboundReply, dispatchInboundReplyWithBase, hasFinalChannelTurnDispatch as hasFinalInboundReplyDispatch, hasVisibleChannelTurnDispatch as hasVisibleInboundReplyDispatch, recordChannelBotPairLoopAndCheckSuppression, recordDroppedChannelTurnHistory as recordDroppedChannelInboundHistory, recordDroppedChannelTurnHistory, resolveChannelTurnDispatchCounts as resolveInboundReplyDispatchCounts, runChannelInboundEvent, runPreparedInboundReply };
