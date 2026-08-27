import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { a as resolvePendingFinalDeliveryCompletion } from "./pending-final-delivery-BHAgwavm.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import { i as isOutboundDeliveryError } from "./deliver-types-BGUCRKo2.js";
import { o as createRenderedMessageBatch } from "./deliver-prepare-Dv3usHa3.js";
import { n as deliverOutboundPayloadsInternal } from "./deliver-DDIuG1_y.js";
import { o as markLiveMessagePreviewUpdated, t as createLiveMessageState } from "./live-BkLbrfBk.js";
//#region src/channels/message/send.ts
const log = createSubsystemLogger("channels/message/send");
function serializeDurableMessagePayloadOutcomes(outcomes, options) {
	if (!outcomes || outcomes.length === 0) return;
	return outcomes.map((outcome) => {
		if (outcome.status === "sent") return {
			index: outcome.index,
			status: "sent",
			resultCount: outcome.results.length
		};
		if (outcome.status === "suppressed") return {
			index: outcome.index,
			status: "suppressed",
			reason: outcome.reason,
			...options?.includeHookEffect === true && outcome.hookEffect ? { hookEffect: outcome.hookEffect } : {}
		};
		return {
			index: outcome.index,
			status: "failed",
			error: formatErrorMessage(outcome.error),
			sentBeforeError: outcome.sentBeforeError,
			stage: outcome.stage
		};
	});
}
const neverAbortedSignal = new AbortController().signal;
function toDurableMessageIntent(intent, renderedBatch) {
	return {
		id: intent.id,
		channel: intent.channel,
		to: intent.to,
		...intent.accountId ? { accountId: intent.accountId } : {},
		durability: intent.queuePolicy === "required" ? "required" : "best_effort",
		renderedBatch
	};
}
function toDurablePayloadOutcome(outcome) {
	return outcome;
}
function toDurablePayloadOutcomes(outcomes) {
	return outcomes.map((outcome) => toDurablePayloadOutcome(outcome));
}
async function withDurableMessageSendContextCore(params, run) {
	let deliveryIntent;
	const { attempt, durability, onDeleteReceipt, onDeliveryIntent, onEditReceipt, onCommitReceipt, onPreviewUpdate, onSendFailure, onPayloadDeliveryOutcome, payloads, preview, previousReceipt, signal, abortSignal, ...deliveryParams } = params;
	const effectiveSignal = signal ?? abortSignal;
	const queuePolicy = durability === "best_effort" ? "best_effort" : "required";
	let liveState = preview ?? createLiveMessageState();
	const ctx = {
		id: `${params.channel}:${params.to}`,
		channel: params.channel,
		to: params.to,
		...params.accountId ? { accountId: params.accountId } : {},
		durability: durability ?? "required",
		attempt: attempt ?? 1,
		signal: effectiveSignal ?? neverAbortedSignal,
		...previousReceipt ? { previousReceipt } : {},
		preview: liveState,
		render: async () => createRenderedMessageBatch(payloads),
		previewUpdate: async (rendered) => {
			liveState = onPreviewUpdate ? await onPreviewUpdate(rendered, liveState) : markLiveMessagePreviewUpdated(liveState, rendered);
			ctx.preview = liveState;
			return liveState;
		},
		send: async (rendered) => {
			const payloadOutcomes = [];
			const durablePayloadOutcomes = () => toDurablePayloadOutcomes(payloadOutcomes);
			try {
				const results = await deliverOutboundPayloadsInternal({
					...deliveryParams,
					payloads: rendered.payloads,
					renderedBatchPlan: rendered.plan,
					queuePolicy,
					...effectiveSignal ? { abortSignal: effectiveSignal } : {},
					onPayloadDeliveryOutcome: (outcome) => {
						payloadOutcomes.push(outcome);
						onPayloadDeliveryOutcome?.(outcome);
					},
					onDeliveryIntent: (intent) => {
						deliveryIntent = intent;
						const durableIntent = toDurableMessageIntent(intent, rendered);
						ctx.intent = durableIntent;
						onDeliveryIntent?.(durableIntent);
					}
				});
				const receipt = createMessageReceiptFromOutboundResults({
					results,
					threadId: params.threadId == null ? void 0 : String(params.threadId),
					replyToId: params.replyToId ?? void 0
				});
				const failedOutcome = payloadOutcomes.find((outcome) => outcome.status === "failed");
				if (failedOutcome) {
					if (results.length > 0) return {
						status: "partial_failed",
						results,
						receipt,
						error: failedOutcome.error,
						sentBeforeError: true,
						...deliveryIntent ? { deliveryIntent } : {},
						...payloadOutcomes.length > 0 ? { payloadOutcomes: durablePayloadOutcomes() } : {}
					};
					return {
						status: "failed",
						error: failedOutcome.error,
						stage: failedOutcome.stage,
						...payloadOutcomes.length > 0 ? { payloadOutcomes: durablePayloadOutcomes() } : {}
					};
				}
				if (results.length === 0) return {
					status: "suppressed",
					results: [],
					receipt,
					...deliveryIntent ? { deliveryIntent } : {},
					reason: payloadOutcomes.find((outcome) => outcome.status === "suppressed")?.reason ?? "no_visible_result",
					...payloadOutcomes.length > 0 ? { payloadOutcomes: durablePayloadOutcomes() } : {}
				};
				return {
					status: "sent",
					results,
					receipt,
					...deliveryIntent ? { deliveryIntent } : {},
					...payloadOutcomes.length > 0 ? { payloadOutcomes: durablePayloadOutcomes() } : {}
				};
			} catch (error) {
				if (isOutboundDeliveryError(error)) {
					if (error.results.length > 0) {
						const receipt = createMessageReceiptFromOutboundResults({
							results: error.results,
							threadId: params.threadId == null ? void 0 : String(params.threadId),
							replyToId: params.replyToId ?? void 0
						});
						return {
							status: "partial_failed",
							results: error.results,
							receipt,
							error,
							sentBeforeError: true,
							...deliveryIntent ? { deliveryIntent } : {},
							...error.payloadOutcomes.length > 0 ? { payloadOutcomes: toDurablePayloadOutcomes(error.payloadOutcomes) } : {}
						};
					}
					return {
						status: "failed",
						error,
						stage: error.stage,
						...error.payloadOutcomes.length > 0 ? { payloadOutcomes: toDurablePayloadOutcomes(error.payloadOutcomes) } : {}
					};
				}
				return {
					status: "failed",
					error
				};
			}
		},
		edit: async (receipt, rendered) => {
			if (!onEditReceipt) throw new Error("message send context edit is not configured");
			const editedReceipt = await onEditReceipt(receipt, rendered);
			liveState = {
				...liveState,
				receipt: editedReceipt,
				lastRendered: rendered
			};
			ctx.preview = liveState;
			return editedReceipt;
		},
		delete: async (receipt) => {
			if (!onDeleteReceipt) throw new Error("message send context delete is not configured");
			await onDeleteReceipt(receipt);
		},
		commit: async (receipt) => {
			await onCommitReceipt?.(receipt);
		},
		fail: async (error) => {
			try {
				await onSendFailure?.(error);
			} catch (cleanupError) {
				log.warn(`message send failure cleanup failed; preserving original send error: ${formatErrorMessage(cleanupError)}`);
			}
		}
	};
	try {
		return await run(ctx);
	} catch (error) {
		await ctx.fail(error);
		throw error;
	}
}
async function sendDurableMessageBatchCore(params) {
	const pendingFinalCompletion = params.deliveryCompletion ? void 0 : resolvePendingFinalDeliveryCompletion(params.payloads);
	const pendingFinalDelivery = pendingFinalCompletion ? {
		deliveryCompletion: pendingFinalCompletion,
		deliveryIntentId: pendingFinalCompletion.deliveryId,
		durability: "required"
	} : {};
	return await withDurableMessageSendContextCore({
		...params,
		...pendingFinalDelivery
	}, async (ctx) => {
		const rendered = await ctx.render();
		const result = await ctx.send(rendered);
		if (result.status === "sent" || result.status === "suppressed") await ctx.commit(result.receipt);
		else await ctx.fail(result.error);
		return result;
	});
}
//#endregion
export { serializeDurableMessagePayloadOutcomes as n, withDurableMessageSendContextCore as r, sendDurableMessageBatchCore as t };
