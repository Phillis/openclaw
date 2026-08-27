import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { N as runWithDiagnosticTraceContext, T as createDiagnosticTraceContextFromActiveScope } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import { a as getReplyPayloadMetadata, g as setReplyPayloadMetadata, i as copyReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { n as deliveryContextFromSession, r as deliveryContextKey, s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { $t as loadSessionEntryReadOnly, K as updateSessionEntry } from "./session-accessor-Bi6bzKQE.js";
import { s as copyChannelParticipantAdmissionEvidence } from "./admission-evidence-UgNy_kxM.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DcKMk0pM.js";
import { l as summarizeOutboundPayloadForTransport } from "./payloads-YIMlWZ2P.js";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-_WMqEo47.js";
import { i as isChannelPartialDeliveryError, r as createSuppressedChannelDeliveryResult } from "./delivery-result-DI1YgQUl.js";
import { a as isPlatformMessageNotDispatchedError, n as PlatformMessageNotDispatchedError, o as isPlatformMessageRejectedError } from "./deliver-types-BGUCRKo2.js";
import { a as settlePendingFinalDelivery } from "./delivery-completion-DevufG86.js";
import { c as applyMessageSendingHook } from "./deliver-prepare-DGksCq4U.js";
import { n as deriveInboundMessageHookContext, r as resolveInboundReplyHookTarget } from "./message-hook-mappers-CWlKliqU.js";
import { f as normalizeEmptyPayloadForDelivery } from "./delivery-queue-reconciliation-CwJzYuZB.js";
import { r as suppressPendingFinalDelivery } from "./dispatch-from-config.finalize-D2ZgvHM_.js";
import { a as dispatchInboundMessageWithRoutedChannelDispatcher } from "./dispatch-Ca4xJfeT.js";
import { t as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-B5sNTTcg.js";
import { c as createMessageSentEmitter } from "./delivery-queue-recovery-5IPw6isX.js";
import { l as findDeliveryIntentOwner } from "./delivery-queue-storage-BoH6yiWv.js";
import { f as clearChannelHistoryIfEnabled } from "./history-DLKGD0Dj.js";
import { t as recordInboundSession } from "./session-CApmOK5h.js";
import { t as isRecentOutboundMessageIdentity } from "./outbound-echo-DmYajtce.js";
import { a as resolvePairLoopGuardSettings, r as createPairLoopGuard } from "./pair-loop-guard-runtime-qcafZ164.js";
import { r as hasVisibleChannelTurnDispatch, t as EMPTY_CHANNEL_TURN_DISPATCH_COUNTS } from "./dispatch-result-DaybJgme.js";
import { i as runWithSessionInitConflictRetry, n as withReplySystemEventSessionKey } from "./system-event-session-key-BjAx1Tg1.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-CH_BtvSb.js";
import { n as isDurableInboundReplyDeliveryHandled, r as throwIfDurableInboundReplyDeliveryFailed, t as deliverInboundReplyWithMessageSendContextCore } from "./durable-delivery-Bjsbj3ck.js";
//#region src/channels/turn/bot-loop-protection.ts
const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 6e4 });
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
function recordChannelBotPairLoopAndCheckSuppression(params) {
	return channelBotPairLoopGuard.recordAndCheck({
		scopeId: params.scopeId,
		conversationId: params.conversationId,
		senderId: params.senderId,
		receiverId: params.receiverId,
		eventId: params.eventId,
		settings: resolvePairLoopGuardSettings({
			config: params.config,
			defaultsConfig: params.defaultsConfig,
			defaultEnabled: params.defaultEnabled
		}),
		nowMs: params.nowMs
	});
}
//#endregion
//#region src/channels/turn/pending-delivery-notice.ts
const PENDING_DELIVERY_NOTICE = "I couldn’t confirm whether my previous reply reached this chat, so I won’t resend it automatically. Please ask for any missing remainder.";
function noticeId(intentId) {
	return `main-session-restart-recovery:pending-final:${intentId}`;
}
async function acknowledgePendingDeliveryNotice(params) {
	if (!(await appendAssistantMessageToSessionTranscript({
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		expectedSessionId: params.sessionId,
		text: PENDING_DELIVERY_NOTICE,
		idempotencyKey: params.idempotencyKey
	})).ok) return;
	await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (current) => current.sessionId === params.sessionId && current.pendingDeliveryNotice?.intentId === params.intentId ? {
		pendingDeliveryNotice: void 0,
		updatedAt: Date.now()
	} : null, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
async function deliverPendingDeliveryNotice(sessionKey, storePath) {
	const entry = loadSessionEntryReadOnly({
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const notice = entry?.pendingDeliveryNotice;
	const context = normalizeDeliveryContext(notice?.context);
	const runtime = getGatewayRecoveryRuntime();
	if (!entry || !runtime || !notice || notice.state !== "owed" || !context?.channel || !context.to || deliveryContextKey(context) !== deliveryContextKey(deliveryContextFromSession(entry))) return;
	const idempotencyKey = noticeId(notice.intentId);
	try {
		if ((await runtime.sendRecoveryNotice({
			channel: context.channel,
			to: context.to,
			accountId: context.accountId,
			threadId: context.threadId,
			text: PENDING_DELIVERY_NOTICE,
			idempotencyKey
		})).suppressed) {
			await updateSessionEntry({
				sessionKey,
				storePath
			}, (current) => current.sessionId === entry.sessionId && current.pendingDeliveryNotice?.intentId === notice.intentId ? {
				pendingDeliveryNotice: {
					...notice,
					state: "unresolved"
				},
				updatedAt: Date.now()
			} : null);
			return;
		}
	} catch {
		const owner = findDeliveryIntentOwner(idempotencyKey);
		if (owner?.status === "completed") await acknowledgePendingDeliveryNotice({
			sessionKey,
			storePath,
			sessionId: entry.sessionId,
			intentId: notice.intentId,
			idempotencyKey
		});
		else if (owner?.status === "failed") await updateSessionEntry({
			sessionKey,
			storePath
		}, (current) => current.sessionId === entry.sessionId && current.pendingDeliveryNotice?.intentId === notice.intentId ? {
			pendingDeliveryNotice: {
				...notice,
				state: "unresolved"
			},
			updatedAt: Date.now()
		} : null);
		return;
	}
	await acknowledgePendingDeliveryNotice({
		sessionKey,
		storePath,
		sessionId: entry.sessionId,
		intentId: notice.intentId,
		idempotencyKey
	});
}
//#endregion
//#region src/channels/turn/execution.ts
const NO_ADDITIONAL_DELIVERY_SIGNALS = {};
const log = createSubsystemLogger("channels/turn/execution");
function emit(params) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		...params.event
	});
}
function clearPendingHistoryAfterTurn(params) {
	if (!params?.isGroup || !params.historyKey || !params.historyMap || params.limit === void 0) return;
	clearChannelHistoryIfEnabled({
		historyMap: params.historyMap,
		historyKey: params.historyKey,
		limit: params.limit
	});
}
function resolveObserveOnlyDispatchResult(params) {
	return params.observeOnlyDispatchResult ?? {
		queuedFinal: false,
		counts: EMPTY_CHANNEL_TURN_DISPATCH_COUNTS
	};
}
function isSystemChannelTurn(ctx) {
	return ctx.Provider === "heartbeat" || ctx.Provider === "cron-event" || ctx.Provider === "exec-event";
}
function resolveRecordSessionKey(params) {
	const explicitSessionKey = params.record?.sessionKey;
	if (explicitSessionKey === void 0) return params.ctxPayload.SessionKey ?? params.routeSessionKey;
	const normalizedSessionKey = explicitSessionKey.trim();
	if (!normalizedSessionKey) throw new Error("Channel turn record.sessionKey must be non-empty.");
	if (normalizedSessionKey !== explicitSessionKey) throw new Error("Channel turn record.sessionKey must not include surrounding whitespace.");
	return explicitSessionKey;
}
function maybeWarnZeroCountVisibleDispatch(params) {
	if (params.admission?.kind === "observeOnly" || isSystemChannelTurn(params.ctxPayload)) return;
	const dispatchResult = params.dispatchResult;
	if (hasVisibleChannelTurnDispatch(dispatchResult, NO_ADDITIONAL_DELIVERY_SIGNALS)) return;
	log.warn(`visible channel turn dispatched with no queued reply payloads: channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.ctxPayload.SessionKey ?? params.routeSessionKey}`);
	emit({
		...params,
		event: {
			stage: "dispatch",
			event: "warning",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: params.admission?.kind ?? "dispatch",
			reason: "zero-count-visible-dispatch"
		}
	});
}
function resolveBotLoopProtectionDrop(params) {
	if (!params.botLoopProtection) return;
	if (!recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) return;
	const admission = {
		kind: "drop",
		reason: "bot-loop-protection"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
}
function resolveOutboundEchoDrop(params) {
	const conversationId = [params.ctxPayload.NativeChannelId, params.ctxPayload.ChatId].find((value) => typeof value === "string" && value.trim().length > 0);
	if (!conversationId) return;
	const matchedMessageId = [
		params.messageId,
		params.ctxPayload.MessageSidFull,
		params.ctxPayload.MessageSid
	].find((messageId) => typeof messageId === "string" && isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		messageId
	}));
	const sourceId = params.outboundEchoSourceId?.trim();
	const matchesSource = sourceId ? isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		sourceId
	}) : false;
	if (!matchedMessageId && !matchesSource) return;
	const admission = {
		kind: "drop",
		reason: "outbound-echo"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId ?? matchedMessageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
}
async function runPreparedChannelTurnCore(params, options) {
	return await runWithDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope(), () => runPreparedChannelTurnCoreInTrace(params, options));
}
async function runPreparedChannelTurnCoreInTrace(params, options) {
	const admission = params.admission ?? { kind: "dispatch" };
	const outboundEchoDrop = resolveOutboundEchoDrop(params);
	if (outboundEchoDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("outboundEcho");
		return outboundEchoDrop;
	}
	const botLoopDrop = resolveBotLoopProtectionDrop(params);
	if (botLoopDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("botLoopProtection");
		return botLoopDrop;
	}
	const recordSessionKey = resolveRecordSessionKey(params);
	if (params.ctxPayload.SessionTranscriptContext) {
		const { mergeSessionTranscriptContext } = await import("./session-transcript-context.runtime.js");
		await mergeSessionTranscriptContext({
			agentId: params.ctxPayload.AgentId,
			ctx: params.ctxPayload,
			sessionKey: recordSessionKey,
			storePath: params.storePath
		});
	}
	emit({
		...params,
		event: {
			stage: "record",
			event: "start",
			messageId: params.messageId,
			sessionKey: recordSessionKey,
			admission: admission.kind
		}
	});
	try {
		await params.recordInboundSession({
			storePath: params.storePath,
			sessionKey: recordSessionKey,
			ctx: params.ctxPayload,
			groupResolution: params.record?.groupResolution,
			createIfMissing: params.record?.createIfMissing,
			updateLastRoute: params.record?.updateLastRoute,
			onRecordError: params.record?.onRecordError ?? (() => void 0),
			trackSessionMetaTask: params.record?.trackSessionMetaTask
		});
		emit({
			...params,
			event: {
				stage: "record",
				event: "done",
				messageId: params.messageId,
				sessionKey: recordSessionKey,
				admission: admission.kind
			}
		});
		await params.afterRecord?.();
		await deliverPendingDeliveryNotice(recordSessionKey, params.storePath);
	} catch (err) {
		emit({
			...params,
			event: {
				stage: "record",
				event: "error",
				messageId: params.messageId,
				sessionKey: recordSessionKey,
				admission: admission.kind,
				error: err
			}
		});
		try {
			await params.onPreDispatchFailure?.(err);
		} catch {}
		throw err;
	}
	emit({
		...params,
		event: {
			stage: "dispatch",
			event: "start",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind
		}
	});
	let dispatchResult;
	try {
		if (admission.kind === "observeOnly" && !options.suppressObserveOnlyDispatch) await params.runDispatch();
		else if (admission.kind === "observeOnly") await params.runDispatchLifecycle?.onDispatchSkipped("observeOnly");
		dispatchResult = admission.kind === "observeOnly" ? resolveObserveOnlyDispatchResult(params) : await params.runDispatch();
		maybeWarnZeroCountVisibleDispatch({
			...params,
			admission,
			dispatchResult
		});
	} catch (err) {
		emit({
			...params,
			event: {
				stage: "dispatch",
				event: "error",
				messageId: params.messageId,
				sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
				admission: admission.kind,
				error: err
			}
		});
		throw err;
	}
	emit({
		...params,
		event: {
			stage: "dispatch",
			event: "done",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind
		}
	});
	clearPendingHistoryAfterTurn(params.history);
	return {
		admission,
		dispatched: true,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey,
		dispatchResult
	};
}
async function runPreparedChannelTurn(params) {
	return await runPreparedChannelTurnCore(params, { suppressObserveOnlyDispatch: true });
}
//#endregion
//#region src/channels/turn/direct-delivery-custody.ts
const NO_PENDING_FINAL_CUSTODY = { onPlatformSendDispatch: () => Promise.resolve() };
function resolvePendingFinalCompletion(payload) {
	const identity = getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion;
	return identity ? {
		kind: "pending-final",
		...identity
	} : void 0;
}
function createDirectPendingFinalCustody(payload) {
	const completion = resolvePendingFinalCompletion(payload);
	if (!completion) return;
	const { kind: _kind, ...identity } = completion;
	let admission;
	return {
		bindPendingFinalDelivery: (nextPayload) => setReplyPayloadMetadata(nextPayload, { pendingFinalDeliveryCompletion: identity }),
		onPlatformSendDispatch: () => {
			admission ??= settlePendingFinalDelivery(completion, "unknown", ["prepared", "queued"]).then((result) => {
				if (result.state !== "unknown") throw new PlatformMessageNotDispatchedError("Pending final delivery ownership changed before platform dispatch", { cause: /* @__PURE__ */ new Error(`pending final delivery is ${result.state}`) });
			});
			return admission;
		}
	};
}
function toCoreManagedDeliveryInfo(info) {
	return {
		kind: info.kind,
		...info.assistantMessageIndex === void 0 ? {} : { assistantMessageIndex: info.assistantMessageIndex }
	};
}
//#endregion
//#region src/channels/turn/route-dm-scope.ts
function applyRouteDmScope(context, dmScope) {
	if (!dmScope || context.DmScope === dmScope) return context;
	const scoped = {
		...context,
		DmScope: dmScope
	};
	copyChannelParticipantAdmissionEvidence(context, scoped);
	return scoped;
}
//#endregion
//#region src/channels/turn/lifecycle.ts
function resolvePartialChannelDeliveryResult(error) {
	return isChannelPartialDeliveryError(error) ? error.deliveryResult : void 0;
}
function assembleResolvedChannelTurn(value) {
	if (!("route" in value)) return value;
	if ("runDispatch" in value) {
		const { cfg, route, ...turn } = value;
		return {
			...turn,
			ctxPayload: applyRouteDmScope(turn.ctxPayload, route.dmScope),
			routeSessionKey: route.sessionKey,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: route.agentId }),
			recordInboundSession
		};
	}
	const { cfg, route, ...turn } = value;
	return {
		...turn,
		ctxPayload: applyRouteDmScope(turn.ctxPayload, route.dmScope),
		cfg,
		agentId: route.agentId,
		routeSessionKey: route.sessionKey,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: route.agentId }),
		recordInboundSession
	};
}
function resolveAssembledReplyPipeline(params) {
	const adoption = params.turnAdoptionLifecycle ?? params.replyOptions?.turnAdoptionLifecycle;
	let replyOptions = adoption ? {
		...params.replyOptions,
		turnAdoptionLifecycle: adoption
	} : params.replyOptions;
	if (params.routeSessionKey !== params.ctxPayload.SessionKey) replyOptions = withReplySystemEventSessionKey(replyOptions ?? {}, params.routeSessionKey);
	if (!params.replyPipeline) return {
		dispatcherOptions: params.dispatcherOptions,
		replyOptions
	};
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		...params.replyPipeline
	});
	return {
		dispatcherOptions: {
			...replyPipeline,
			...params.dispatcherOptions
		},
		replyOptions: {
			onModelSelected,
			...replyOptions
		}
	};
}
function isExplicitlyNonVisibleChannelDelivery(result) {
	return typeof result === "object" && result !== null && !Array.isArray(result) && result.visibleReplySent === false;
}
function markChannelDeliveryErrorVisible(error) {
	if (typeof error === "object" && error !== null && !Array.isArray(error)) try {
		Object.assign(error, {
			sentBeforeError: true,
			visibleReplySent: true
		});
		return error;
	} catch {}
	const visibleError = new Error("visible channel reply delivery failed", { cause: error });
	Object.assign(visibleError, {
		sentBeforeError: true,
		visibleReplySent: true
	});
	return visibleError;
}
async function runChannelDeliveryObserver(params) {
	if (!params.onDelivered) return;
	try {
		await params.onDelivered(params.payload, params.info, params.result);
	} catch (error) {
		throw isExplicitlyNonVisibleChannelDelivery(params.result) ? error : markChannelDeliveryErrorVisible(error);
	}
}
function resolveChannelDeliveryMessageId(result) {
	return result?.receipt ? resolveMessageReceiptPrimaryId(result.receipt) : result?.messageIds?.find((messageId) => messageId.trim());
}
async function settleChannelDeliveryAttempts(params) {
	let preferredSettlementError;
	for (const attempt of params.attempts) try {
		const finalized = await settleChannelDeliveryAttempt({
			attempt,
			onDelivered: params.delivery.onDelivered,
			onFinalizationError: async (error) => {
				await Promise.resolve(params.delivery.onError?.(error, attempt.info));
			},
			emitMessageSent: params.emitMessageSent
		});
		params.onSettled?.(attempt.info, finalized);
	} catch (error) {
		if (preferredSettlementError === void 0 || resolvePartialChannelDeliveryResult(error) !== void 0 && resolvePartialChannelDeliveryResult(preferredSettlementError) === void 0) preferredSettlementError = error;
	}
	if (preferredSettlementError !== void 0) throw toErrorObject(preferredSettlementError, "channel delivery settlement failed");
}
async function settleFailedPendingFinalDelivery(payload, error) {
	const completion = resolvePendingFinalCompletion(payload);
	if (!completion) return;
	if (isPlatformMessageRejectedError(error)) await settlePendingFinalDelivery(completion, "suppressed", [
		"prepared",
		"queued",
		"unknown"
	]);
	else if (isPlatformMessageNotDispatchedError(error)) await settlePendingFinalDelivery(completion, "prepared", ["queued", "unknown"]);
	else await settlePendingFinalDelivery(completion, "unknown", ["queued", "unknown"]);
}
async function settleChannelDeliveryAttempt(params) {
	const { attempt } = params;
	if ("error" in attempt) {
		const partial = resolvePartialChannelDeliveryResult(attempt.error);
		if (!isPlatformMessageNotDispatchedError(attempt.error)) params.emitMessageSent?.({
			success: false,
			content: partial?.content ?? attempt.payload.text ?? "",
			error: formatErrorMessage(attempt.error),
			messageId: resolveChannelDeliveryMessageId(partial)
		});
		return;
	}
	let finalized;
	try {
		const result = attempt.result;
		finalized = result ? result.finalization ? {
			...result,
			...await result.finalization,
			finalization: void 0
		} : result : void 0;
	} catch (error) {
		try {
			await params.onFinalizationError?.(error);
		} catch {}
		await settleFailedPendingFinalDelivery(attempt.payload, error);
		const partial = resolvePartialChannelDeliveryResult(error);
		if (!isPlatformMessageNotDispatchedError(error)) params.emitMessageSent?.({
			success: false,
			content: partial?.content ?? attempt.payload.text ?? "",
			error: formatErrorMessage(error),
			messageId: resolveChannelDeliveryMessageId(partial)
		});
		throw toErrorObject(error, "channel delivery finalization failed");
	}
	if (!isExplicitlyNonVisibleChannelDelivery(finalized)) params.emitMessageSent?.({
		success: true,
		content: finalized?.content ?? attempt.payload.text ?? "",
		messageId: resolveChannelDeliveryMessageId(finalized)
	});
	const completion = resolvePendingFinalCompletion(attempt.payload);
	if (completion) await settlePendingFinalDelivery(completion, isExplicitlyNonVisibleChannelDelivery(finalized) ? "suppressed" : "delivered");
	await runChannelDeliveryObserver({
		onDelivered: params.onDelivered,
		payload: attempt.payload,
		info: attempt.info,
		result: finalized
	});
	return finalized;
}
async function applyRoutedDirectMessageSending(params) {
	const hookRunner = getGlobalHookRunner();
	const hookCtx = deriveInboundMessageHookContext(params.turn.ctxPayload);
	const hookResult = await applyMessageSendingHook({
		hookRunner,
		enabled: hookRunner?.hasHooks("message_sending") ?? false,
		payload: params.payload,
		payloadSummary: summarizeOutboundPayloadForTransport(params.payload),
		to: resolveInboundReplyHookTarget(params.turn.ctxPayload, hookCtx),
		channel: params.turn.channel,
		accountId: params.turn.accountId,
		replyToId: params.payload.replyToId ?? params.turn.ctxPayload.ReplyToIdFull ?? params.turn.ctxPayload.ReplyToId,
		threadId: params.turn.ctxPayload.MessageThreadId,
		sessionKey: params.turn.routeSessionKey
	});
	if (hookResult.cancelled) return {
		payload: params.payload,
		suppression: createSuppressedChannelDeliveryResult({
			reason: "cancelled_by_message_sending_hook",
			cancelReason: hookResult.cancelReason,
			metadata: hookResult.hookMetadata
		})
	};
	const payload = normalizeEmptyPayloadForDelivery(hookResult.payload);
	if (!payload) return {
		payload: hookResult.payload,
		suppression: createSuppressedChannelDeliveryResult({ reason: hookResult.contentRewritten ? "empty_after_message_sending_hook" : "no_visible_payload" })
	};
	return { payload: copyReplyPayloadMetadata(params.payload, payload) };
}
function reconcileNonVisibleChannelDeliveries(result, nonVisibleCounts) {
	const counts = {
		tool: Math.max(0, result.counts.tool - nonVisibleCounts.tool),
		block: Math.max(0, result.counts.block - nonVisibleCounts.block),
		final: Math.max(0, result.counts.final - nonVisibleCounts.final)
	};
	return {
		...result,
		queuedFinal: result.queuedFinal && counts.final > 0,
		counts
	};
}
function createObserveOnlyDeliveryAdapter() {
	return { deliver: async () => ({ visibleReplySent: false }) };
}
async function dispatchChannelTurnWithDeliveryOwner(...args) {
	const [params, ownership] = args;
	const replyPipeline = resolveAssembledReplyPipeline(params);
	const turnAdoptionLifecycle = params.turnAdoptionLifecycle ?? params.replyOptions?.turnAdoptionLifecycle;
	const delivery = params.admission?.kind === "observeOnly" ? createObserveOnlyDeliveryAdapter() : params.delivery;
	const pendingDeliveryAttempts = [];
	const normalizationSuppressionAttempts = [];
	const nonVisibleDeliveryCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const recordSettledDelivery = (info, result) => {
		if (isExplicitlyNonVisibleChannelDelivery(result)) nonVisibleDeliveryCounts[info.kind] += 1;
	};
	let agentRunId;
	const onAgentRunStart = replyPipeline.replyOptions?.onAgentRunStart;
	const replyOptions = delivery.observeMessageSent ? {
		...replyPipeline.replyOptions,
		onAgentRunStart: (runId) => {
			agentRunId = runId;
			onAgentRunStart?.(runId);
		}
	} : replyPipeline.replyOptions;
	const hookCtx = delivery.observeMessageSent ? deriveInboundMessageHookContext(params.ctxPayload) : void 0;
	let messageSentEmitter;
	const getMessageSentEmitter = () => {
		if (!delivery.observeMessageSent || !hookCtx) return;
		messageSentEmitter ??= createMessageSentEmitter({
			hookRunner: getGlobalHookRunner(),
			channel: params.channel,
			to: resolveInboundReplyHookTarget(params.ctxPayload, hookCtx),
			accountId: params.accountId,
			sessionKeyForInternalHooks: params.routeSessionKey,
			runId: agentRunId,
			isGroup: hookCtx.isGroup,
			groupId: hookCtx.groupId,
			logPrefix: "dispatchAssembledChannelTurn"
		});
		return messageSentEmitter;
	};
	return await runPreparedChannelTurnCore({
		channel: params.channel,
		accountId: params.accountId,
		routeSessionKey: params.routeSessionKey,
		storePath: params.storePath,
		ctxPayload: params.ctxPayload,
		recordInboundSession: params.recordInboundSession,
		afterRecord: params.afterRecord,
		record: params.record,
		history: params.history,
		admission: params.admission,
		botLoopProtection: params.botLoopProtection,
		outboundEchoSourceId: params.outboundEchoSourceId,
		log: params.log,
		messageId: params.messageId,
		...turnAdoptionLifecycle ? { runDispatchLifecycle: {
			turnAdoptionLifecycle,
			onDispatchSkipped: async () => await turnAdoptionLifecycle.onAdopted()
		} } : {},
		runDispatch: async () => {
			let dispatchResult;
			let dispatchError;
			try {
				dispatchResult = await runWithSessionInitConflictRetry(() => (ownership === "routed-delivery" ? dispatchInboundMessageWithRoutedChannelDispatcher : params.dispatchReplyWithBufferedBlockDispatcher)({
					ctx: params.ctxPayload,
					cfg: params.cfg,
					...ownership === "routed-delivery" ? {
						...params.admission?.kind === "observeOnly" ? { suppressOutboundHooks: true } : {},
						onReplyPayloadSuppressed: async (payload, info, reason) => {
							await suppressPendingFinalDelivery(payload);
							await runChannelDeliveryObserver({
								onDelivered: delivery.onDelivered,
								payload,
								info,
								result: createSuppressedChannelDeliveryResult({ reason })
							});
						}
					} : {},
					dispatcherOptions: {
						...replyPipeline.dispatcherOptions,
						onSkip: (payload, info) => {
							replyPipeline.dispatcherOptions?.onSkip?.(payload, info);
							if (info.reason !== "channel_transform") return;
							const { reason: _reason, ...deliveryInfo } = info;
							normalizationSuppressionAttempts.push({
								payload,
								info: deliveryInfo,
								result: createSuppressedChannelDeliveryResult({ reason: info.reason })
							});
						},
						deliver: async (payload, info) => {
							const preparedPayloadResult = delivery.preparePayload ? await delivery.preparePayload(payload, info) : payload;
							const preparedPayload = preparedPayloadResult === null ? null : copyReplyPayloadMetadata(payload, preparedPayloadResult);
							if (preparedPayload === null) {
								const suppression = createSuppressedChannelDeliveryResult({ reason: "no_visible_payload" });
								await suppressPendingFinalDelivery(payload);
								await runChannelDeliveryObserver({
									onDelivered: delivery.onDelivered,
									payload,
									info,
									result: suppression
								});
								recordSettledDelivery(info, suppression);
								return suppression;
							}
							const declaredDurable = "durable" in delivery ? delivery.durable : void 0;
							const durableOptions = typeof declaredDurable === "function" ? await declaredDurable(preparedPayload, info) : declaredDurable;
							if (durableOptions) {
								const durable = await deliverInboundReplyWithMessageSendContextCore({
									cfg: params.cfg,
									channel: params.channel,
									accountId: params.accountId,
									agentId: params.agentId,
									ctxPayload: params.ctxPayload,
									payload: preparedPayload,
									info,
									...durableOptions
								});
								throwIfDurableInboundReplyDeliveryFailed(durable);
								if (isDurableInboundReplyDeliveryHandled(durable)) {
									await runChannelDeliveryObserver({
										onDelivered: delivery.onDelivered,
										payload: preparedPayload,
										info,
										result: durable.delivery
									});
									recordSettledDelivery(info, durable.delivery);
									return durable.delivery;
								}
							}
							let effectivePayload = preparedPayload;
							let result = void 0;
							let directInfo = info;
							try {
								if (ownership === "routed-delivery" && "deliverWithProviderMessageSending" in delivery && delivery.deliverWithProviderMessageSending) {
									const providerInfo = {
										...info,
										...createDirectPendingFinalCustody(effectivePayload) ?? NO_PENDING_FINAL_CUSTODY
									};
									directInfo = providerInfo;
									result = await delivery.deliverWithProviderMessageSending(effectivePayload, providerInfo);
								} else {
									if (ownership === "routed-delivery" && params.admission?.kind !== "observeOnly") {
										const hook = await applyRoutedDirectMessageSending({
											turn: params,
											payload: effectivePayload
										});
										effectivePayload = hook.payload;
										if (hook.suppression) result = hook.suppression;
									}
									if (!result) {
										if (!("deliver" in delivery) || !delivery.deliver) throw new Error("channel delivery adapter is missing a direct deliverer");
										await createDirectPendingFinalCustody(effectivePayload)?.onPlatformSendDispatch();
										result = await delivery.deliver(effectivePayload, toCoreManagedDeliveryInfo(info));
									}
								}
							} catch (error) {
								await settleFailedPendingFinalDelivery(effectivePayload, error);
								if (delivery.observeMessageSent) await settleChannelDeliveryAttempt({
									attempt: {
										payload: effectivePayload,
										info: directInfo,
										error
									},
									onDelivered: delivery.onDelivered,
									emitMessageSent: getMessageSentEmitter()?.emitMessageSent
								});
								throw error;
							}
							if (result?.finalization) {
								result.finalization.catch(() => void 0);
								pendingDeliveryAttempts.push({
									payload: effectivePayload,
									info: directInfo,
									result
								});
							} else {
								const finalized = await settleChannelDeliveryAttempt({
									attempt: {
										payload: effectivePayload,
										info: directInfo,
										result
									},
									onDelivered: delivery.onDelivered,
									emitMessageSent: delivery.observeMessageSent ? getMessageSentEmitter()?.emitMessageSent : void 0
								});
								recordSettledDelivery(info, finalized);
							}
							return result;
						},
						onError: delivery.onError
					},
					toolsAllow: params.toolsAllow,
					replyOptions,
					replyResolver: params.replyResolver
				}), params.sessionInitRetry ? {
					retryDelaysMs: params.sessionInitRetry.delaysMs,
					signal: params.sessionInitRetry.signal,
					sleep: params.sessionInitRetry.sleep
				} : void 0);
			} catch (error) {
				dispatchError = error;
			}
			let settlementError;
			try {
				await settleChannelDeliveryAttempts({
					attempts: normalizationSuppressionAttempts,
					delivery
				});
				await settleChannelDeliveryAttempts({
					attempts: pendingDeliveryAttempts,
					delivery,
					emitMessageSent: getMessageSentEmitter()?.emitMessageSent,
					onSettled: recordSettledDelivery
				});
			} catch (error) {
				settlementError = error;
			}
			if (settlementError !== void 0 && resolvePartialChannelDeliveryResult(settlementError) !== void 0) throw toErrorObject(settlementError, "channel delivery settlement failed");
			if (dispatchError !== void 0) throw toErrorObject(dispatchError, "channel dispatch failed");
			if (settlementError !== void 0) throw toErrorObject(settlementError, "channel delivery settlement failed");
			return ownership === "routed-delivery" ? reconcileNonVisibleChannelDeliveries(dispatchResult, nonVisibleDeliveryCounts) : dispatchResult;
		}
	}, { suppressObserveOnlyDispatch: false });
}
async function dispatchAssembledChannelTurn(params) {
	return await dispatchChannelTurnWithDeliveryOwner(params, "legacy-dispatcher");
}
async function dispatchRoutedChannelTurn(params) {
	return await dispatchChannelTurnWithDeliveryOwner(assembleResolvedChannelTurn(params), "routed-delivery");
}
//#endregion
export { recordChannelBotPairLoopAndCheckSuppression as a, runPreparedChannelTurn as i, dispatchAssembledChannelTurn as n, dispatchRoutedChannelTurn as r, assembleResolvedChannelTurn as t };
