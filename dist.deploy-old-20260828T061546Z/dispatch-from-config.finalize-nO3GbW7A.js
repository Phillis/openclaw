import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isAbortError, r as racePromiseWithAbortSignal } from "./abort-signal-D2k14JsD.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as resolveConfiguredTtsMode } from "./tts-config-DgBDj2SP.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { nt as updateSessionEntry } from "./session-accessor-fcDZuc2H.js";
import { t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-6FYlAu33.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, p as markReplyPayloadAsTtsSupplement, u as isReplyPayloadTerminalContent } from "./reply-payload-BeeUJOmJ.js";
import { o as settlePendingFinalDelivery } from "./delivery-completion-CDrntLbO.js";
import { a as hasOutboundReplyContent } from "./reply-payload-i0RzN2iF.js";
import { t as resolveChannelTtsVoiceDelivery } from "./tts-capabilities-d3WAu6Sf.js";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-r7hZudXu.js";
import { t as resolveStatusTtsSnapshot } from "./status-config-DZt6FuEd.js";
import { a as formatSuppressedReplyPayloadForLog, d as shouldDeliverDespiteSourceReplySuppression, n as QUEUE_CAP_REJECTION_TEXT, r as createFinalDispatchPayloadDedupeKey, t as NO_VISIBLE_REPLY_FALLBACK_TEXT } from "./dispatch-from-config.payloads-CSG-wPxm.js";
import { n as recordAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ovu6kj_3.js";
//#region src/auto-reply/dispatch-dispatcher.ts
const settledTasksByDispatcher = /* @__PURE__ */ new WeakMap();
/** Register post-delivery work owned by the dispatcher's settle lifecycle. */
function registerReplyDispatcherSettledTask(dispatcher, task) {
	const tasks = settledTasksByDispatcher.get(dispatcher) ?? /* @__PURE__ */ new Set();
	tasks.add(task);
	settledTasksByDispatcher.set(dispatcher, tasks);
}
async function runReplyDispatcherSettledTasks(dispatcher) {
	const tasks = settledTasksByDispatcher.get(dispatcher);
	if (!tasks) return;
	settledTasksByDispatcher.delete(dispatcher);
	for (const task of tasks) await task();
}
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
async function settleReplyDispatcher(params) {
	params.dispatcher.markComplete();
	try {
		const receipt = await params.dispatcher.waitForIdle();
		await runReplyDispatcherSettledTasks(params.dispatcher);
		return receipt || void 0;
	} finally {
		settledTasksByDispatcher.delete(params.dispatcher);
		await params.onSettled?.();
	}
}
/** Run work with a dispatcher and always drain it before returning or throwing. */
async function withReplyDispatcher(params) {
	try {
		return await params.run();
	} finally {
		const receipt = await settleReplyDispatcher(params);
		params.onSettledReceipt?.(receipt);
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.abort.ts
var DispatchReplyOperationAbortedError = class extends Error {
	constructor() {
		super("Dispatch reply operation aborted");
		this.name = "AbortError";
	}
};
function isDispatchReplyOperationAbortedError(error) {
	return error instanceof DispatchReplyOperationAbortedError;
}
function runWithDispatchAbortSignal(signal, run, onWorkStarted) {
	if (signal?.aborted) return Promise.reject(new DispatchReplyOperationAbortedError());
	const work = Promise.resolve().then(run);
	onWorkStarted?.(work);
	return racePromiseWithAbortSignal(work, signal).catch((error) => {
		if (signal?.aborted && isAbortError(error)) throw new DispatchReplyOperationAbortedError();
		throw error;
	});
}
function createAbortAwareDispatcher(params) {
	const sendIfActive = (send) => (payload) => params.isAborted() ? false : send(payload);
	const getCancelledCounts = params.dispatcher.getCancelledCounts;
	return {
		sendToolResult: sendIfActive(params.dispatcher.sendToolResult),
		sendBlockReply: sendIfActive(params.dispatcher.sendBlockReply),
		sendFinalReply: sendIfActive(params.dispatcher.sendFinalReply),
		...params.dispatcher.supportsSettledReceipt ? { supportsSettledReceipt: true } : {},
		waitForIdle: () => params.dispatcher.waitForIdle(),
		getQueuedCounts: () => params.dispatcher.getQueuedCounts(),
		...getCancelledCounts ? { getCancelledCounts: () => getCancelledCounts() } : {},
		getFailedCounts: () => params.dispatcher.getFailedCounts(),
		markComplete: () => {
			if (!params.isAborted()) params.dispatcher.markComplete();
		}
	};
}
//#endregion
//#region src/tts/captioned-final.ts
function shouldDeferFinalTtsText(params) {
	if (!resolveChannelTtsVoiceDelivery(params.channelId)?.captionedFinalText) return false;
	if (resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	}) !== "final") return false;
	const status = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	return status != null && status.autoMode !== "off" && status.autoMode !== "tagged" && (status.autoMode !== "inbound" || params.inboundAudio);
}
function mergeDeferredFinalText(streamedText, finalText) {
	const streamed = streamedText.trim();
	const final = finalText?.trim() ?? "";
	if (!streamed) return final;
	if (!final || streamed === final || streamed.startsWith(final)) return streamed;
	if (final.startsWith(streamed)) return final;
	return `${streamed}\n${final}`;
}
function isCaptionedFinalTextPayload(payload) {
	return isReplyPayloadTerminalContent(payload);
}
function cleanDeferredFinalText(text) {
	if (!text) return "";
	const cleaner = createTtsDirectiveTextStreamCleaner();
	return `${cleaner.push(text)}${cleaner.flush()}`.replace(/[ \t]+\n/gu, "\n");
}
function buildCaptionedFinalTextFallback(payload) {
	return copyReplyPayloadMetadata(payload, {
		text: payload.text,
		delivery: payload.delivery,
		replyToId: payload.replyToId,
		replyToTag: payload.replyToTag,
		replyToCurrent: payload.replyToCurrent
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.pending-final.ts
async function suppressPendingFinalDelivery(payload) {
	const completion = getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion;
	if (completion) {
		await settlePendingFinalDelivery({
			kind: "pending-final",
			...completion
		}, "suppressed", ["prepared"]);
		await clearPendingFinalDeliveryAfterSuccess(completion);
	}
}
async function clearPendingFinalDeliveryAfterSuccess(identity) {
	if (!identity) return;
	await updateSessionEntry({
		storePath: identity.storePath,
		sessionKey: identity.sessionKey
	}, (entry) => {
		const recoveryRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
		const deliveries = entry.pendingFinalDelivery?.deliveries;
		if (entry.sessionId !== identity.sessionId || entry.pendingFinalDelivery?.intentId !== identity.intentId || !deliveries?.length || !deliveries.every(({ state }) => state === "delivered" || state === "suppressed") || recoveryRunId !== void 0 && recoveryRunId !== identity.recoveryRunId) return null;
		const endedAt = recoveryRunId === void 0 && (entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable") ? Date.now() : void 0;
		return {
			...recoveryRunId ? buildRestartRecoveryClaimCleanupPatch({
				entry,
				recordTerminalSource: true
			}) : {
				restartRecoveryBeforeAgentReplyState: void 0,
				restartRecoverySourceIngress: void 0,
				restartRecoveryForceSafeTools: void 0
			},
			pendingFinalDelivery: void 0,
			...endedAt === void 0 ? {} : {
				abortedLastRun: false,
				endedAt,
				lifecycleRunId: void 0,
				runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, endedAt - entry.startedAt) : void 0,
				status: "done"
			},
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.finalize.ts
const needsTtsFallback = (clean, visible, fallback) => clean && !visible.trim() && Boolean(fallback?.trim());
async function finalizeDispatchAndAudit(state) {
	const { cfg, chatType, ctx, deferFinalTtsText, deliveryChannel, deliberateSilentTerminalReply, dispatcher, emptyFinalAllowedAsSilent, getDispatchAbortSignal, getObservedReplyDelivery, isRoutedReplyDelivered, markInboundDedupeReplayUnsafe, noVisibleReplyFallbackDirected, pendingContinuation, replyResult, replyRoute, routeReplyToOriginating, sendPolicyDenied, sessionAgentId, sessionKey, suppressDelivery, throwIfDispatchOperationAborted, turnLedger, waitForPendingDirectBlockReplyDelivery } = state;
	const replies = replyResult ? Array.isArray(replyResult) ? replyResult : [replyResult] : [];
	const pendingFinalDeliveryIdentity = replies.map((reply) => getReplyPayloadMetadata(reply)?.pendingFinalDeliveryCompletion).find((completion) => completion !== void 0);
	if (state.preserveProgressCallbackStartOrder) await state.progressState.progressCallbackStartTail;
	await state.flushPendingCommentaryProgress();
	const beforeAgentRunBlocked = replies.some((reply) => getReplyPayloadMetadata(reply)?.beforeAgentRunBlocked === true);
	let queuedFinal = false;
	let routedFinalCount = 0;
	let attemptedFinalDelivery = false;
	let acceptedFinal = false;
	let finalDeliveryFailed = false;
	let channelTransformSuppressedFinal = false;
	const finalDeliveries = [];
	let allQueuedFinalsObserved = true;
	const sentFinalPayloadDedupeKeys = /* @__PURE__ */ new Set();
	let deferredTtsTextPending = state.progressState.accumulatedBlockTtsText;
	for (const [replyIndex, reply] of replies.entries()) {
		throwIfDispatchOperationAborted();
		if (reply.isReasoning === true && !state.reasoningPayloadsEnabled) {
			await suppressPendingFinalDelivery(reply);
			continue;
		}
		if (reply.isCommentary === true && !state.commentaryPayloadsEnabled) {
			await suppressPendingFinalDelivery(reply);
			continue;
		}
		if (suppressDelivery && !shouldDeliverDespiteSourceReplySuppression(reply, state)) {
			if (hasOutboundReplyContent(reply, { trimText: true })) logVerbose([
				`dispatch-from-config: final reply suppressed by ${state.deliverySuppressionReason || "source delivery policy"}`,
				`(session=${state.acpDispatchSessionKey ?? sessionKey ?? "unknown"}`,
				`provider=${ctx.Provider ?? "unknown"}`,
				`surface=${ctx.Surface ?? "unknown"}`,
				`chatType=${chatType ?? "unknown"}`,
				`inboundEventKind=${ctx.InboundEventKind ?? "unknown"}`,
				`message=${ctx.MessageSidFull ?? ctx.MessageSid ?? "unknown"}`,
				`${formatSuppressedReplyPayloadForLog(reply)})`
			].join(" "));
			await suppressPendingFinalDelivery(reply);
			continue;
		}
		const finalPayloadDedupeKey = createFinalDispatchPayloadDedupeKey(reply);
		if (sentFinalPayloadDedupeKeys.has(finalPayloadDedupeKey)) {
			await suppressPendingFinalDelivery(reply);
			continue;
		}
		sentFinalPayloadDedupeKeys.add(finalPayloadDedupeKey);
		const shouldAttachDeferredText = deferFinalTtsText && isReplyPayloadTerminalContent(reply);
		const finalReply = await state.sendFinalPayload(reply, {
			deliveryId: String(replyIndex),
			...shouldAttachDeferredText ? { deferredTtsText: deferredTtsTextPending } : {}
		});
		if (finalReply.suppressionReason) {
			channelTransformSuppressedFinal ||= finalReply.suppressionReason === "channel_transform";
			continue;
		}
		acceptedFinal = true;
		if (shouldAttachDeferredText) deferredTtsTextPending = "";
		if (finalReply.dedupedAgainstBlock) {
			await suppressPendingFinalDelivery(reply);
			continue;
		}
		attemptedFinalDelivery = true;
		queuedFinal = finalReply.queuedFinal || queuedFinal;
		routedFinalCount += finalReply.routedFinalCount;
		if (finalReply.queuedFinal) if (finalReply.dispatcherOutcome) finalDeliveries.push(finalReply.dispatcherOutcome);
		else allQueuedFinalsObserved = false;
		if (!finalReply.queuedFinal && finalReply.routedFinalCount === 0) finalDeliveryFailed = true;
	}
	const channelTransformSuppressed = (state.progressState.channelTransformSuppressed || channelTransformSuppressedFinal) && !state.progressState.acceptedReplyPayload && !acceptedFinal;
	if (attemptedFinalDelivery && !finalDeliveryFailed) {
		if (queuedFinal && allQueuedFinalsObserved) {
			const reconcilePendingFinal = Promise.all(finalDeliveries).then(async () => {
				await clearPendingFinalDeliveryAfterSuccess(pendingFinalDeliveryIdentity);
			}).catch((error) => {
				logVerbose(`dispatch-from-config: pending final reconciliation failed: ${formatErrorMessage(error)}`);
			});
			registerReplyDispatcherSettledTask(dispatcher, () => reconcilePendingFinal);
		} else await clearPendingFinalDeliveryAfterSuccess(pendingFinalDeliveryIdentity);
		throwIfDispatchOperationAborted();
	}
	if (!suppressDelivery && !channelTransformSuppressed) {
		if (resolveConfiguredTtsMode(cfg, {
			agentId: sessionAgentId,
			channelId: deliveryChannel,
			accountId: replyRoute.accountId
		}) === "final" && state.progressState.blockCount > 0 && deferredTtsTextPending.trim() && (replies.length === 0 || deferFinalTtsText)) try {
			await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
			throwIfDispatchOperationAborted();
			const ttsSyntheticReply = await state.maybeApplyTtsWithFinalizationLease({
				payload: { text: deferredTtsTextPending },
				cfg,
				channel: deliveryChannel,
				kind: "final",
				ttsAuto: state.sessionTtsAuto,
				agentId: sessionAgentId,
				accountId: replyRoute.accountId
			});
			throwIfDispatchOperationAborted();
			if (ttsSyntheticReply.mediaUrl || deferFinalTtsText && ttsSyntheticReply.text?.trim()) {
				const ttsOnlyPayload = deferFinalTtsText ? ttsSyntheticReply : markReplyPayloadAsTtsSupplement({
					mediaUrl: ttsSyntheticReply.mediaUrl,
					audioAsVoice: ttsSyntheticReply.audioAsVoice,
					spokenText: deferredTtsTextPending,
					trustedLocalMedia: true
				}, deferredTtsTextPending, { visibleTextAlreadyDelivered: true });
				const finalReply = await state.sendFinalPayload(ttsOnlyPayload, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			} else if (needsTtsFallback(Boolean(state.cleanBlockTtsDirectiveText), cleanDeferredFinalText(deferredTtsTextPending), ttsSyntheticReply.text)) {
				const finalReply = await state.sendFinalPayload(ttsSyntheticReply, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			}
		} catch (err) {
			if (isDispatchReplyOperationAbortedError(err)) throw err;
			logVerbose(`dispatch-from-config: accumulated block TTS failed: ${formatErrorMessage(err)}`);
			const deferredVisibleText = cleanDeferredFinalText(deferredTtsTextPending);
			if (deferFinalTtsText && deferredVisibleText.trim()) {
				const finalReply = await state.sendFinalPayload({ text: deferredVisibleText }, {
					abortSignal: getDispatchAbortSignal(),
					skipTts: true
				});
				queuedFinal = finalReply.queuedFinal || queuedFinal;
				routedFinalCount += finalReply.routedFinalCount;
			}
		}
	}
	await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
	const replyAdmission = state.replyOperationRunState.admission;
	const replyAcceptedByActiveRun = replyAdmission?.status === "accepted";
	const queueCapRejected = replyAdmission?.status === "skipped" && replyAdmission.reason === "queue-cap";
	const noVisibleReplyFallbackAllowed = () => noVisibleReplyFallbackDirected && !suppressDelivery && !sendPolicyDenied && state.sourceReplyDeliveryMode !== "message_tool_only" && !emptyFinalAllowedAsSilent && !deliberateSilentTerminalReply && !pendingContinuation && !channelTransformSuppressed && !getObservedReplyDelivery() && !replyAcceptedByActiveRun && !turnLedger.hasVisibleDelivery();
	let queuedSettleResult = "settled";
	if (noVisibleReplyFallbackAllowed()) queuedSettleResult = await turnLedger.settleQueued(getDispatchAbortSignal());
	let counts = dispatcher.getQueuedCounts();
	let noVisibleReplyFallbackDelivered = false;
	if (queuedSettleResult === "settled" && noVisibleReplyFallbackAllowed()) try {
		throwIfDispatchOperationAborted();
		const fallbackPayload = { text: queueCapRejected ? QUEUE_CAP_REJECTION_TEXT : NO_VISIBLE_REPLY_FALLBACK_TEXT };
		const result = await routeReplyToOriginating(fallbackPayload, {
			abortSignal: getDispatchAbortSignal(),
			kind: "final"
		});
		if (result) {
			if (isRoutedReplyDelivered(result)) {
				queuedFinal = true;
				noVisibleReplyFallbackDelivered = true;
				routedFinalCount += 1;
			} else if (!result.ok) logVerbose(`dispatch-from-config: route-reply (no-visible-reply fallback) failed: ${result.error ?? "unknown error"}`);
		} else {
			throwIfDispatchOperationAborted();
			markInboundDedupeReplayUnsafe();
			if (turnLedger.sendQueued("final", fallbackPayload).queued) {
				const fallbackSettle = await turnLedger.settleQueued(getDispatchAbortSignal());
				throwIfDispatchOperationAborted();
				if (fallbackSettle !== "settled" || turnLedger.hasVisibleDelivery()) {
					queuedFinal = true;
					noVisibleReplyFallbackDelivered = true;
					counts = dispatcher.getQueuedCounts();
				}
			}
		}
	} catch (err) {
		if (isDispatchReplyOperationAbortedError(err)) throw err;
		logVerbose(`dispatch-from-config: no-visible-reply fallback failed: ${formatErrorMessage(err)}`);
	}
	counts.final += routedFinalCount;
	const agentRunTerminalOutcome = state.getAgentRunTerminalOutcome();
	state.commitInboundDedupeIfClaimed();
	const messageInjectionAborted = state.replyOperationRunState.messageInjectionAborted === true;
	const dispatchOutcome = queueCapRejected || messageInjectionAborted ? "skipped" : "completed";
	const dispatchReason = queueCapRejected ? "queue-cap" : messageInjectionAborted ? "reply_operation_aborted" : replyAdmission?.status === "accepted" && replyAdmission.mode === "steer" ? "active_run_injected" : channelTransformSuppressed ? "channel_transform" : state.bindingState.pluginFallbackReason;
	state.recordAgentDispatchCompleted(dispatchOutcome, dispatchReason ? { reason: dispatchReason } : void 0);
	state.recordProcessed(dispatchOutcome, dispatchReason ? { reason: dispatchReason } : void 0);
	state.markIdle(queueCapRejected ? "message_queue_cap_rejected" : "message_completed");
	state.completeDispatchReplyOperation();
	const result = state.attachSourceReplyDeliveryMode({
		queuedFinal,
		counts,
		...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {},
		...getObservedReplyDelivery() ? { observedReplyDelivery: true } : {},
		...replyAdmission?.status === "accepted" ? { deferredToActiveRun: replyAdmission.mode } : {},
		...noVisibleReplyFallbackDirected && queuedSettleResult === "settled" && !turnLedger.hasVisibleDelivery() && !noVisibleReplyFallbackDelivered && !getObservedReplyDelivery() && !replyAcceptedByActiveRun && !emptyFinalAllowedAsSilent && !deliberateSilentTerminalReply && !pendingContinuation && !channelTransformSuppressed ? { noVisibleReplyFallbackEligible: true } : {},
		...noVisibleReplyFallbackDelivered ? { noVisibleReplyFallbackDelivered: true } : {},
		...deliberateSilentTerminalReply ? { deliberateSilentTerminalReply: true } : {},
		...beforeAgentRunBlocked ? { beforeAgentRunBlocked } : {}
	});
	if (agentRunTerminalOutcome) recordAgentRunTerminalOutcome(result, agentRunTerminalOutcome);
	return {
		status: "complete",
		result
	};
}
//#endregion
export { cleanDeferredFinalText as a, shouldDeferFinalTtsText as c, isDispatchReplyOperationAbortedError as d, runWithDispatchAbortSignal as f, withReplyDispatcher as h, buildCaptionedFinalTextFallback as i, DispatchReplyOperationAbortedError as l, settleReplyDispatcher as m, needsTtsFallback as n, isCaptionedFinalTextPayload as o, registerReplyDispatcherSettledTask as p, suppressPendingFinalDelivery as r, mergeDeferredFinalText as s, finalizeDispatchAndAudit as t, createAbortAwareDispatcher as u };
