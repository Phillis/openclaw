import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import "./ingress-retry-policy-9Z6cseGJ.js";
import "./ingress-drain-BfW43w8Y.js";
import "./payloads-D57nRTdF.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import { t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import "./session-context-Boxqt1oa.js";
import { b as resolveChannelStreamingPreviewChunk } from "./streaming-3t37hp7G.js";
import { i as livePreviewFinalizerCapabilities, n as channelMessageReceiveAckPolicies, r as durableFinalDeliveryCapabilities, t as channelMessageLiveCapabilities } from "./types-GcWljJIT.js";
import { c as resolveTextChunkLimit } from "./chunk-DbIKi2Y2.js";
import "./sanitize-text-DMcfOVvX.js";
import "./outbound-echo-DmYajtce.js";
import "./reply-pipeline-DZ8TcoFf.js";
import "./progress-draft-compositor-Bq9iBTeM.js";
import "./ingress-monitor-CeEQXHMt.js";
import "./draft-stream-controls-CzidI4eh.js";
import "./identity-C_yEndY2.js";
//#region src/channels/message/ingress-drain-lifecycle.ts
/** Maps a drain lifecycle onto the reply-lane ownership surface. */
function bindIngressLifecycleToReplyOptions(lifecycle) {
	return { turnAdoptionLifecycle: {
		admission: "exclusive",
		onAdopted: lifecycle.onAdopted,
		onDeferred: lifecycle.onDeferred,
		onAbandoned: lifecycle.onAbandoned,
		abortSignal: lifecycle.abortSignal
	} };
}
//#endregion
//#region src/channels/message/adapter.ts
const defaultManualReceiveAdapter$1 = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
function defineChannelMessageAdapter(adapter) {
	return {
		...adapter,
		receive: adapter.receive ?? defaultManualReceiveAdapter$1
	};
}
//#endregion
//#region src/channels/message/outbound-bridge.ts
/**
* Legacy outbound bridge adapter.
*
* Wraps old channel send functions in the newer channel message adapter contract.
*/
const defaultManualReceiveAdapter = {
	defaultAckPolicy: "manual",
	supportedAckPolicies: ["manual"]
};
function resolveResultMessageId(result) {
	return result.messageId ?? result.receipt?.primaryPlatformMessageId ?? result.receipt?.platformMessageIds[0] ?? result.chatId ?? result.channelId ?? result.roomId ?? result.conversationId ?? result.toJid ?? result.pollId;
}
function toMessageSendResult(result, params) {
	const receipt = result.receipt ? params.normalizeReceiptKind ? {
		...result.receipt,
		parts: result.receipt.parts.map((part) => ({
			...part,
			kind: params.kind
		}))
	} : result.receipt : createMessageReceiptFromOutboundResults({
		results: [result],
		kind: params.kind,
		threadId: params.threadId == null ? void 0 : String(params.threadId),
		replyToId: params.replyToId ?? void 0
	});
	return {
		...result.chatId !== void 0 ? { chatId: result.chatId } : {},
		...result.channelId !== void 0 ? { channelId: result.channelId } : {},
		...result.roomId !== void 0 ? { roomId: result.roomId } : {},
		...result.conversationId !== void 0 ? { conversationId: result.conversationId } : {},
		...result.toJid !== void 0 ? { toJid: result.toJid } : {},
		...result.pollId !== void 0 ? { pollId: result.pollId } : {},
		...result.timestamp !== void 0 ? { timestamp: result.timestamp } : {},
		...result.meta !== void 0 ? { meta: result.meta } : {},
		receipt,
		...resolveResultMessageId({
			...result,
			receipt
		}) ? { messageId: resolveResultMessageId({
			...result,
			receipt
		}) } : {}
	};
}
function adaptOutboundBridgeContext(ctx, resultParams) {
	const { onDeliveryResult, ...outboundCtx } = ctx;
	return {
		...outboundCtx,
		...onDeliveryResult ? { onDeliveryResult: async (result) => {
			await onDeliveryResult(toMessageSendResult(result, resultParams));
		} } : {}
	};
}
function hasRenderedPresentationBlocks(channelData) {
	return Object.values(channelData ?? {}).some((value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const blocks = value.presentationBlocks;
		return Array.isArray(blocks) && blocks.length > 0;
	});
}
function resolvePayloadReceiptKind(ctx) {
	if (ctx.payload.audioAsVoice && (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length)) return "voice";
	if (ctx.mediaUrl || ctx.payload.mediaUrl || ctx.payload.mediaUrls?.length) return "media";
	if (Boolean(ctx.payload.presentation?.title || ctx.payload.presentation?.blocks?.length) || hasRenderedPresentationBlocks(ctx.payload.channelData)) return "card";
	if (ctx.payload.interactive) return "card";
	if (ctx.payload.location) return "card";
	if (ctx.payload.text?.trim() || ctx.text.trim()) return "text";
	return "unknown";
}
/** Converts legacy outbound send methods into a typed channel message adapter. */
function createChannelMessageAdapterFromOutbound(params) {
	const send = {};
	if (params.outbound.sendText) send.text = async (ctx) => {
		const resultParams = {
			kind: "text",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendText(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendMedia) send.media = async (ctx) => {
		const resultParams = {
			kind: ctx.audioAsVoice ? "voice" : "media",
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendMedia(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPayload) send.payload = async (ctx) => {
		const resultParams = {
			kind: resolvePayloadReceiptKind(ctx),
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPayload(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	if (params.outbound.sendPoll) send.poll = async (ctx) => {
		const resultParams = {
			kind: "poll",
			normalizeReceiptKind: true,
			threadId: ctx.threadId,
			replyToId: ctx.replyToId
		};
		return toMessageSendResult(await params.outbound.sendPoll(adaptOutboundBridgeContext(ctx, resultParams)), resultParams);
	};
	return {
		...params.id ? { id: params.id } : {},
		durableFinal: { capabilities: params.capabilities ?? params.outbound.deliveryCapabilities?.durableFinal },
		send,
		...params.live ? { live: params.live } : {},
		receive: params.receive ?? defaultManualReceiveAdapter
	};
}
//#endregion
//#region src/channels/message/durable-receive.ts
function normalizeDurableInboundReceiveId(id) {
	const normalized = id.trim();
	if (!normalized) throw new Error("Durable inbound receive id cannot be empty");
	return normalized;
}
/** Adapts the shared channel ingress queue to the durable receive journal API. */
function createDurableInboundReceiveJournalFromQueue(options) {
	const prune = async (protectId) => {
		if (options.retention) await options.queue.prune({
			...options.retention,
			...protectId === void 0 ? {} : { protectIds: [protectId] }
		});
	};
	return {
		accept: async (id, payload, acceptOptions) => {
			await prune();
			const result = await options.queue.enqueue(normalizeDurableInboundReceiveId(id), payload, {
				...acceptOptions?.metadata === void 0 ? {} : { metadata: acceptOptions.metadata },
				...acceptOptions?.receivedAt === void 0 ? {} : { receivedAt: acceptOptions.receivedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			if (result.kind === "accepted") return {
				kind: "accepted",
				duplicate: false,
				record: result.record
			};
			if (result.kind === "completed") return {
				kind: "completed",
				duplicate: true,
				record: result.record
			};
			if (result.kind === "pending" || result.kind === "claimed") return {
				kind: "pending",
				duplicate: true,
				record: result.record
			};
			return {
				kind: "pending",
				duplicate: true,
				record: {
					id: result.record.id,
					payload,
					receivedAt: result.record.failedAt,
					updatedAt: result.record.failedAt,
					attempts: 0
				}
			};
		},
		pending: async () => {
			await prune();
			return await options.queue.listPending({ limit: "all" });
		},
		complete: async (id, completeOptions) => {
			await options.queue.complete(normalizeDurableInboundReceiveId(id), {
				...completeOptions?.metadata === void 0 ? {} : { metadata: completeOptions.metadata },
				...completeOptions?.completedAt === void 0 ? {} : { completedAt: completeOptions.completedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
		},
		release: async (id, releaseOptions) => {
			const released = await options.queue.release(normalizeDurableInboundReceiveId(id), {
				...releaseOptions?.lastError === void 0 ? {} : { lastError: releaseOptions.lastError },
				...releaseOptions?.releasedAt === void 0 ? {} : { releasedAt: releaseOptions.releasedAt }
			});
			await prune(normalizeDurableInboundReceiveId(id));
			return released;
		},
		deletePending: async (id) => {
			const deleted = await options.queue.delete(normalizeDurableInboundReceiveId(id));
			await prune();
			return deleted;
		}
	};
}
//#endregion
//#region src/channels/message/contracts.ts
/**
* Lists declared receive acknowledgement policies, including the default policy fallback.
*/
function listDeclaredReceiveAckPolicies(receive) {
	const declared = receive?.supportedAckPolicies?.length ? receive.supportedAckPolicies : receive?.defaultAckPolicy ? [receive.defaultAckPolicy] : [];
	return channelMessageReceiveAckPolicies.filter((policy) => declared.includes(policy));
}
/**
* Verifies proof callbacks for every declared durable-final delivery capability.
*/
async function verifyDurableFinalCapabilityProofs(params) {
	const results = [];
	for (const capability of durableFinalDeliveryCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares durable final capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared live-preview finalizer capability.
*/
async function verifyLivePreviewFinalizerCapabilityProofs(params) {
	const results = [];
	for (const capability of livePreviewFinalizerCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares live preview finalizer capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared live message capability.
*/
async function verifyChannelMessageLiveCapabilityProofs(params) {
	const results = [];
	for (const capability of channelMessageLiveCapabilities) {
		if (params.capabilities?.[capability] !== true) {
			results.push({
				capability,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[capability];
		if (!proof) throw new Error(`${params.adapterName} declares live capability "${capability}" without a contract proof`);
		await proof();
		results.push({
			capability,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies proof callbacks for every declared receive acknowledgement policy.
*/
async function verifyChannelMessageReceiveAckPolicyProofs(params) {
	const declared = new Set(listDeclaredReceiveAckPolicies(params.receive));
	const results = [];
	for (const policy of channelMessageReceiveAckPolicies) {
		if (!declared.has(policy)) {
			results.push({
				policy,
				status: "not_declared"
			});
			continue;
		}
		const proof = params.proofs[policy];
		if (!proof) throw new Error(`${params.adapterName} declares receive ack policy "${policy}" without a contract proof`);
		await proof();
		results.push({
			policy,
			status: "verified"
		});
	}
	return results;
}
/**
* Verifies durable-final proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageAdapterCapabilityProofs(params) {
	return await verifyDurableFinalCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.durableFinal?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies receive acknowledgement proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params) {
	return await verifyChannelMessageReceiveAckPolicyProofs({
		adapterName: params.adapterName,
		receive: params.adapter.receive,
		proofs: params.proofs
	});
}
/**
* Verifies live-preview finalizer proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveFinalizerProofs(params) {
	return await verifyLivePreviewFinalizerCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.finalizer?.capabilities,
		proofs: params.proofs
	});
}
/**
* Verifies live message capability proofs from a channel message adapter declaration.
*/
async function verifyChannelMessageLiveCapabilityAdapterProofs(params) {
	return await verifyChannelMessageLiveCapabilityProofs({
		adapterName: params.adapterName,
		capabilities: params.adapter.live?.capabilities,
		proofs: params.proofs
	});
}
//#endregion
//#region src/channels/message/receive.ts
/**
* Channel message receive acknowledgement context.
*
* Models ack/nack policy and idempotent receive state transitions for inbound events.
*/
const neverAbortedSignal = new AbortController().signal;
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
function shouldAckMessageAfterStage(policy, stage) {
	switch (policy) {
		case "after_receive_record": return stage === "receive_record";
		case "after_agent_dispatch": return stage === "agent_dispatch";
		case "after_durable_send": return stage === "durable_send";
		case "manual": return false;
	}
	return false;
}
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
function createMessageReceiveContext(params) {
	let nackInFlight;
	const ctx = {
		id: params.id,
		channel: params.channel,
		...params.accountId ? { accountId: params.accountId } : {},
		message: params.message,
		ackPolicy: params.ackPolicy ?? "after_receive_record",
		ackState: "pending",
		receivedAt: params.receivedAt ?? Date.now(),
		signal: params.signal ?? neverAbortedSignal,
		shouldAckAfter: (stage) => shouldAckMessageAfterStage(ctx.ackPolicy, stage),
		ack: async () => {
			if (ctx.ackState === "acked") return;
			await params.onAck?.();
			ctx.ackState = "acked";
			ctx.ackedAt = Date.now();
			delete ctx.nackErrorMessage;
		},
		nack: async (error) => {
			if (ctx.ackState === "nacked") return;
			if (nackInFlight) {
				await nackInFlight;
				return;
			}
			nackInFlight = (async () => {
				await params.onNack?.(error);
				ctx.ackState = "nacked";
				ctx.nackErrorMessage = formatErrorMessage(error);
			})();
			try {
				await nackInFlight;
			} finally {
				nackInFlight = void 0;
			}
		}
	};
	return ctx;
}
//#endregion
//#region src/channels/draft-streaming-chunking.ts
const DEFAULT_DRAFT_STREAM_MIN = 200;
const DEFAULT_DRAFT_STREAM_MAX = 800;
function resolveChannelDraftStreamingChunking(cfg, channelId, accountId, opts) {
	const textLimit = resolveTextChunkLimit(cfg, channelId, accountId, { fallbackLimit: opts.fallbackLimit });
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelCfg = cfg?.channels?.[channelId];
	const draftCfg = resolveChannelStreamingPreviewChunk(resolveAccountEntry(channelCfg?.accounts, normalizedAccountId)) ?? resolveChannelStreamingPreviewChunk(channelCfg);
	const maxRequested = Math.max(1, Math.floor(draftCfg?.maxChars ?? DEFAULT_DRAFT_STREAM_MAX));
	const maxChars = Math.max(1, Math.min(maxRequested, textLimit));
	const minRequested = Math.max(1, Math.floor(draftCfg?.minChars ?? DEFAULT_DRAFT_STREAM_MIN));
	return {
		minChars: Math.min(minRequested, maxChars),
		maxChars,
		breakPreference: draftCfg?.breakPreference === "newline" || draftCfg?.breakPreference === "sentence" ? draftCfg.breakPreference : "paragraph"
	};
}
//#endregion
//#region src/plugin-sdk/channel-outbound.ts
const loadChannelMessageRuntimeModule = createLazyRuntimeModule(() => import("./runtime-Cqaq7StI.js"));
/** Lazily forwards inbound reply delivery through the channel turn durable-delivery module. */
const deliverInboundReplyWithMessageSendContext = async (...args) => {
	return await (await import("./durable-delivery-DihMVD2F.js")).deliverInboundReplyWithMessageSendContextCore(...args);
};
/** Sends a durable message batch without eager-loading channel message runtime internals. */
async function sendDurableMessageBatch(params) {
	return await (await loadChannelMessageRuntimeModule()).sendDurableMessageBatchCore(params);
}
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
async function withDurableMessageSendContext(params, run) {
	return await (await loadChannelMessageRuntimeModule()).withDurableMessageSendContextCore(params, run);
}
//#endregion
export { createMessageReceiveContext as a, verifyChannelMessageLiveFinalizerProofs as c, createDurableInboundReceiveJournalFromQueue as d, createChannelMessageAdapterFromOutbound as f, resolveChannelDraftStreamingChunking as i, verifyChannelMessageReceiveAckPolicyAdapterProofs as l, bindIngressLifecycleToReplyOptions as m, sendDurableMessageBatch as n, verifyChannelMessageAdapterCapabilityProofs as o, defineChannelMessageAdapter as p, withDurableMessageSendContext as r, verifyChannelMessageLiveCapabilityAdapterProofs as s, deliverInboundReplyWithMessageSendContext as t, verifyDurableFinalCapabilityProofs as u };
