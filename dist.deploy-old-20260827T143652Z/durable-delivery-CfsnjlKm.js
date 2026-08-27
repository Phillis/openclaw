import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as createChannelDeliveryResultFromReceipt } from "./delivery-result-DI1YgQUl.js";
import { a as resolveOutboundDurableFinalDeliverySupport } from "./deliver-prepare-x_0C8l3i.js";
import { t as buildOutboundSessionContext } from "./session-context-Boxqt1oa.js";
import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-8F_8bL8C.js";
import { t as normalizeDeliverableOutboundChannel } from "./channel-resolution-CmOqcYJw.js";
import "./deliver-CLbqlLI7.js";
import { t as sendDurableMessageBatchCore } from "./send-wWzlNbvX.js";
//#region src/channels/turn/durable-delivery.ts
function resolveDeliveryTarget(params) {
	return normalizeOptionalString(params.to) ?? normalizeOptionalString(params.ctxPayload.OriginatingTo) ?? normalizeOptionalString(params.ctxPayload.To);
}
function resolveDurableInboundReplyToId(params) {
	if (params.replyToId === null || params.payload.replyToId === null) return null;
	return normalizeOptionalString(params.replyToId) ?? normalizeOptionalString(params.payload.replyToId) ?? normalizeOptionalString(params.ctxPayload.ReplyToIdFull) ?? normalizeOptionalString(params.ctxPayload.ReplyToId);
}
function resolveDurableInboundReplyThreadId(params) {
	if ("threadId" in params) return params.threadId;
	return params.ctxPayload.MessageThreadId;
}
function stringifyThreadId(value) {
	return value == null ? void 0 : String(value);
}
function toDeliveryIntent(intent) {
	return {
		id: intent.id,
		kind: "outbound_queue",
		queuePolicy: intent.queuePolicy
	};
}
function resolveDurableSuppression(send) {
	const hookEffect = send.payloadOutcomes?.find((outcome) => outcome.status === "suppressed")?.hookEffect;
	return {
		reason: send.reason,
		...hookEffect?.cancelReason ? { cancelReason: hookEffect.cancelReason } : {},
		...hookEffect?.metadata ? { metadata: hookEffect.metadata } : {}
	};
}
/** Narrows durable delivery results that handled the payload without caller fallback. */
function isDurableInboundReplyDeliveryHandled(result) {
	return result.status === "handled_visible" || result.status === "handled_no_send";
}
/** Throws failed durable delivery results, preserving visible-send metadata when applicable. */
function throwIfDurableInboundReplyDeliveryFailed(result) {
	if (result.status === "failed") throw result.sentBeforeError === true ? markDurableInboundReplyDeliveryErrorVisible(result.error) : result.error;
}
function markDurableInboundReplyDeliveryErrorVisible(error) {
	if (typeof error === "object" && error !== null && Object.isExtensible(error)) {
		Object.assign(error, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return error;
	}
	const visibleError = new Error("visible durable reply delivery failed", { cause: error });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
/** Delivers final inbound replies through the durable message-send context when supported. */
async function deliverInboundReplyWithMessageSendContextCore(params) {
	if (params.info.kind !== "final") return {
		status: "not_applicable",
		reason: "non_final"
	};
	const channel = normalizeDeliverableOutboundChannel(params.channel);
	const to = resolveDeliveryTarget(params);
	if (!channel) return {
		status: "unsupported",
		reason: "missing_channel"
	};
	if (!to) return {
		status: "unsupported",
		reason: "missing_target"
	};
	const replyToId = resolveDurableInboundReplyToId(params);
	const threadId = resolveDurableInboundReplyThreadId(params);
	const requiredCapabilities = params.requiredCapabilities ?? deriveDurableFinalDeliveryRequirements({
		payload: params.payload,
		replyToId,
		threadId,
		silent: params.silent
	});
	const durability = requiredCapabilities.reconcileUnknownSend === true ? "required" : "best_effort";
	let support;
	try {
		support = await resolveOutboundDurableFinalDeliverySupport({
			cfg: params.cfg,
			agentId: params.agentId,
			channel,
			requirements: requiredCapabilities
		});
	} catch (err) {
		return {
			status: "failed",
			error: err
		};
	}
	if (!support.ok) return {
		status: "unsupported",
		reason: support.reason,
		...support.capability ? { capability: support.capability } : {}
	};
	const session = buildOutboundSessionContext({
		cfg: params.cfg,
		sessionKey: params.ctxPayload.SessionKey,
		policySessionKey: params.ctxPayload.RuntimePolicySessionKey,
		conversationType: params.ctxPayload.ChatType,
		agentId: params.agentId,
		requesterAccountId: params.accountId ?? params.ctxPayload.AccountId,
		requesterSenderId: params.ctxPayload.SenderId ?? params.ctxPayload.From,
		requesterSenderName: params.ctxPayload.SenderName,
		requesterSenderUsername: params.ctxPayload.SenderUsername,
		requesterSenderE164: params.ctxPayload.SenderE164
	});
	const send = await sendDurableMessageBatchCore({
		cfg: params.cfg,
		channel,
		to,
		accountId: params.accountId,
		payloads: [params.payload],
		threadId,
		replyToId,
		replyToMode: params.replyToMode,
		formatting: params.formatting,
		identity: params.identity,
		deps: params.deps,
		mediaAccess: params.mediaAccess,
		silent: params.silent,
		durability,
		...requiredCapabilities.reconcileUnknownSend === true ? { requireUnknownSendReconciliation: true } : {},
		session,
		gatewayClientScopes: params.ctxPayload.GatewayClientScopes ?? []
	});
	if (send.status === "failed") return {
		status: "failed",
		error: send.error
	};
	if (send.status === "partial_failed") return {
		status: "failed",
		error: markDurableInboundReplyDeliveryErrorVisible(send.error),
		sentBeforeError: true
	};
	const receiptDelivery = createChannelDeliveryResultFromReceipt({
		receipt: send.receipt,
		threadId: stringifyThreadId(threadId),
		...replyToId ? { replyToId } : {},
		visibleReplySent: send.status === "sent",
		...send.deliveryIntent ? { deliveryIntent: toDeliveryIntent(send.deliveryIntent) } : {}
	});
	const delivery = send.status === "suppressed" ? {
		...receiptDelivery,
		suppression: resolveDurableSuppression(send)
	} : receiptDelivery;
	if (send.status === "suppressed") return {
		status: "handled_no_send",
		reason: "no_visible_result",
		delivery
	};
	return {
		status: "handled_visible",
		delivery
	};
}
//#endregion
export { isDurableInboundReplyDeliveryHandled as n, throwIfDurableInboundReplyDeliveryFailed as r, deliverInboundReplyWithMessageSendContextCore as t };
