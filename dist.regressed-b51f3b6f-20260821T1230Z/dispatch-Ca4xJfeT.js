import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { t as isParentOwnedBackgroundAcpSession } from "./session-interaction-mode-DcV9yxfP.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as resolveGlobalDedupeCache } from "./dedupe-C5V_sRWr.js";
import { c as mergeAlsoAllowPolicy, v as resolveToolProfilePolicy } from "./tool-policy-CWmnHLY1.js";
import { n as isToolAllowedByPolicies } from "./tool-policy-match-CEXvGj1C.js";
import { a as measureDiagnosticsTimelineSpan, o as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DwkG9AHk.js";
import { u as normalizeVerboseLevel } from "./thinking.shared-bHYuuc1L.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { i as shouldCleanTtsDirectiveText, o as normalizeTtsAutoMode } from "./tts-config-CxRyjtgI.js";
import "./thinking-dphnnN-M.js";
import { t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { m as buildConversationRef } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { f as createPluginSubagentRequesterContext, n as getGlobalPluginRegistry, t as getGlobalHookRunner, v as fireAndForgetHook } from "./hook-runner-global-IYtayVps.js";
import { a as getReplyPayloadMetadata, g as setReplyPayloadMetadata, i as copyReplyPayloadMetadata, l as isReplyPayloadStatusNotice, m as readAskUserQuestionId, s as isFastModeAutoProgressPayload } from "./reply-payload-DVcGHORx.js";
import { n as channelRouteDedupeKey } from "./channel-route-BRTlwR_x.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { u as sessionDeliveryChannel } from "./delivery-context.shared-D-qPZITK.js";
import { $t as loadSessionEntryReadOnly, J as appendTranscriptEventSync } from "./session-accessor-Bi6bzKQE.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-B3yYjPW1.js";
import "./message-channel-T4W5YOto.js";
import { a as resolveGroupSessionKey } from "./store-entry-shape-BgAn-BWO.js";
import { tt as conversationIdentityFromMsgContext } from "./targets-DxP0vsft.js";
import { h as redactTranscriptMessage } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { _ as stripLegacyMediaContextFields } from "./media-facts-CdKKNGmE.js";
import { a as isNativeCommandTurn, c as resolveCommandTurnTargetSessionKey, s as resolveCommandTurnContext } from "./command-turn-context-CRxhzdEY.js";
import { t as getSessionBindingService } from "./session-binding-service-tMO6MxaM.js";
import { d as isPluginOwnedSessionBindingRecord, f as markPluginBindingFallbackNoticeShown, g as toPluginConversationBinding, i as buildPluginBindingErrorText, r as buildPluginBindingDeclinedText, s as buildPluginBindingUnavailableText, u as hasShownPluginBindingFallbackNotice, v as resolveConversationBindingRecord, y as touchConversationBindingRecord } from "./conversation-binding-BC9B3heN.js";
import { i as resolveTextCommand, r as normalizeCommandBody } from "./commands-registry-normalize-7tyOPIdR.js";
import { i as isUnauthorizedTextSlashCommand, o as resolveSourceReplyVisibilityPolicy, t as isExplicitSourceReplyCommand } from "./source-reply-delivery-mode-Be_b_tPn.js";
import { r as readAcpSessionMeta } from "./session-meta-CkBRKe6w.js";
import { I as waitForReplyBarrierSettlement, a as forceClearReplyRunBySessionId, p as replyRunRegistry } from "./reply-run-registry-CeOg3aTN.js";
import { a as logMessageReceived, f as markDiagnosticSessionProgress, n as logMessageDispatchStarted, t as logMessageDispatchCompleted } from "./diagnostic-CV4vi0UN.js";
import { m as resolveActiveEmbeddedRunSessionId } from "./run-state-BxqT1sw2.js";
import { r as normalizeExplicitSessionKey } from "./session-key-DTH_WL7C.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DcKMk0pM.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-0SgRTQvD.js";
import { a as hasOutboundReplyContent } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { a as resolveReplyDeliveryAccountId, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-DYNwp2uC.js";
import { i as extractShortModelName } from "./normalize-reply--NSgVK7M.js";
import { i as isChannelPartialDeliveryError } from "./delivery-result-DI1YgQUl.js";
import { r as isFinalizedInboundContext, t as finalizeInboundContext } from "./inbound-context-LXL8l8JC.js";
import { i as isOutboundDeliveryError } from "./deliver-types-BGUCRKo2.js";
import { f as markConversationDeliveryReplied, l as findConversationTurnDeliveryByReplyTarget, p as markConversationDeliverySent } from "./delivery-completion-DevufG86.js";
import { a as createReplyDispatcher, c as prepareReplyPayloadForDispatcher, i as composeReplyDispatchBeforeDeliver, l as waitForReplyDispatcherIdle, n as attachReplyDispatchUndeliveredFallback, o as createReplyDispatcherWithTyping, r as captureReplyDispatchDeliveryOutcome, s as markReplyDispatchBeforeDeliverDeadlineOwned, t as appendReplyDispatcherBeforeDeliverCancelled } from "./reply-dispatcher-BZsFZ_Lr.js";
import { d as buildProjectedInboundMessageSendingBeforeDeliver, l as buildInboundReplyPayloadSendingBeforeDeliver, u as buildLegacyInboundMessageSendingBeforeDeliver } from "./deliver-prepare-DGksCq4U.js";
import { n as resolveAgentIdentity } from "./identity-hPPJEi06.js";
import { a as toInternalMessageReceivedContext, c as toPluginInboundClaimPair, l as toPluginMessageContext, n as deriveInboundMessageHookContext, u as toPluginMessageReceivedEvent } from "./message-hook-mappers-CWlKliqU.js";
import { a as resolveInheritedToolPolicyForSession, i as resolveGroupToolPolicy, o as resolveSubagentToolPolicyForSession, r as resolveEffectiveToolPolicy } from "./agent-tools.policy-BjBsVONt.js";
import { s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-WLDx82Jc.js";
import { a as cleanDeferredFinalText, c as shouldDeferFinalTtsText, d as isDispatchReplyOperationAbortedError, f as runWithDispatchAbortSignal, g as withReplyDispatcher, i as buildCaptionedFinalTextFallback, l as DispatchReplyOperationAbortedError, m as registerReplyDispatcherSettledTask, o as isCaptionedFinalTextPayload, p as readDispatcherFailedCounts, r as suppressPendingFinalDelivery, s as mergeDeferredFinalText, t as finalizeDispatchAndAudit, u as createAbortAwareDispatcher } from "./dispatch-from-config.finalize-D2ZgvHM_.js";
import { n as hasTrustedMessageAuditListeners, t as emitTrustedMessageAuditEvent } from "./message-audit-events-DGtoPYvb.js";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-CiMcVFmr.js";
import { c as hasExecApprovalUnavailablePayload, d as shouldDeliverDespiteSourceReplySuppression, i as createFinalizationAwareTtsPayloadApplier, l as prepareReplyPayloadForSideEffects, o as hasAskUserPayload, p as createBlockReplyContentKey, s as hasExecApprovalPayload, u as requiresDurableToolResultDelivery } from "./dispatch-from-config.payloads-6TqZ4tSQ.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-B9fJlULF.js";
import { f as isAskUserPromptPending } from "./openclaw-tools-DGkE1wbc.js";
import { d as normalizeAgentPlanSteps, s as formatPlanChecklistLines } from "./streaming-3t37hp7G.js";
import { a as admitReplyTurn, i as isReplyProfilerEnabled, o as resolveReplyTurnKind, r as createReplyTimingTracker, s as runWithReplyOperationLifecycleAdmission, u as resolveSilentReplyPolicyFromPolicies } from "./session-entry-handle-Cd9SRj4B.js";
import { i as resolveTurnCommentaryProgressOwner, n as reserveReplyAdmissionTicket, o as isDuplicateRestartRecoverySource, p as buildTerminalAgentRunFailureReplyPayload, r as shouldBridgeCliPreambleEvents, t as REPLY_ADMISSION_TICKET } from "./reply-admission-ticket-BpzW76RT.js";
import { o as takeCommandSessionMetadataChanges } from "./commands-goal-BpMMSkvE.js";
import { d as stageRemoteInboundMediaIfNeeded, f as bindPreparedReplyDispatchRuntime, l as withFullRuntimeReplyConfig, t as resolveRunTypingPolicy } from "./typing-policy-BYxZGws-.js";
import { r as resolveReplyOperationRunState, t as REPLY_OPERATION_RUN_STATE } from "./reply-operation-run-state-CL0NGjUt.js";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-liQoNa-v.js";
import { i as resolveConversationBindingContextFromMessage } from "./conversation-binding-input-D6QuFe0A.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-BpKpSmtD.js";
import { a as resolveVisibleRepliesPolicy, i as resolveTurnModelOverride, n as resolveStableMessageToolAvailability, o as loadSessionStoreEntry, r as createShouldEmitVerboseProgress } from "./session-stable-reply-mode-B4fOixBV.js";
import { n as resolveRoutedDeliveryThreadId, t as isSlackDirectRoutedThreadTurn } from "./routed-delivery-thread-DxMCHrWC.js";
import { r as buildPersistedUserTurnMessage, s as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript-BVy1mkbt.js";
import { n as resolveSendPolicy } from "./send-policy-fb8W-yqC.js";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-wg1VDIex.js";
import { a as loadReplyMediaPathsRuntime, i as loadPreparedModelRuntime, n as loadFastApproveRuntime, o as loadRouteReplyRuntime, r as loadGetReplyFromConfigRuntime, s as loadRuntimePlugins, t as loadAbortRuntime } from "./dispatch-from-config.runtime.js";
import { n as resolveEffectiveReplyRoute } from "./effective-reply-route-DcU2QL7A.js";
import { t as hasInboundAudio } from "./inbound-media-DbDNHQxy.js";
import { n as claimPendingConversationTurnReply } from "./conversation-turns-CGd1HUcH.js";
import { n as resolveOriginMessageProvider } from "./origin-routing-CJyhdAMl.js";
import { i as setChannelSourceTurnId, n as readChannelSourceTurnId, o as shouldMintChannelSourceTurnId, t as buildChannelSourceTurnId } from "./source-turn-id-BnVTXtrn.js";
import { t as getGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-BSAo6TQe.js";
import { r as hasActiveApprovalNativeRouteRuntime } from "./approval-native-route-coordinator-Xn23Zs0h.js";
import { n as shouldHandleTextCommands } from "./commands-text-routing-BxDpdnEG.js";
import { r as findCommandByNativeName } from "./commands-registry-_gIsFa4U.js";
import { t as resolveCommandAuthorization } from "./command-auth-DR4tXHFH.js";
import { i as PLUGIN_COMMAND_DISPATCH, r as matchPluginCommandInvocation, t as createPluginCommandRuntime } from "./plugin-command-runtime-p-6CwmOZ.js";
import { n as resolveCommandContextText } from "./context-text-D3m6Fy9M.js";
import crypto from "node:crypto";
//#region src/auto-reply/foreground-reply-fence-state.ts
function notifyForegroundReplyFenceWaiters(state) {
	const waiters = [...state.waiters];
	state.waiters.clear();
	for (const resolve of waiters) resolve();
}
const foregroundReplyFenceByKey = resolveGlobalMap(Symbol.for("openclaw.foregroundReplyFences"), (fences) => {
	for (const state of fences.values()) notifyForegroundReplyFenceWaiters(state);
	fences.clear();
}, "close-only");
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.audit.ts
function resolveCompletedInboundAuditReason(reason) {
	switch (reason) {
		case "fast_abort": return "fast_abort";
		case "plugin-bound-handled": return "plugin_bound_handled";
		case "plugin-bound-fallback-missing-plugin":
		case "plugin-bound-fallback-no-handler": return "plugin_bound_unavailable";
		case "plugin-bound-declined": return "plugin_bound_declined";
		case "before_dispatch_handled": return "before_dispatch_handled";
		case "acp_dispatch": return "acp_dispatch_completed";
		case "acp_empty_prompt": return "acp_dispatch_empty";
		case "active_run_injected": return "active_run_injected";
		default: return;
	}
}
function resolveSkippedInboundAuditReason(reason) {
	switch (reason) {
		case "duplicate": return "duplicate";
		case "reply-operation-active": return "reply_operation_active";
		case "reply_operation_aborted": return "reply_operation_aborted";
		default: return;
	}
}
function resolveInboundMessageAuditTerminal(outcome, reason) {
	if (reason === "plugin-bound-error") return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed",
		reasonCode: "plugin_bound_error"
	};
	if (reason?.startsWith("acp_error:")) return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed",
		reasonCode: "acp_dispatch_failed"
	};
	if (reason === "reply_operation_aborted") return {
		status: "blocked",
		outcome: "skipped",
		reasonCode: "reply_operation_aborted"
	};
	if (reason === "acp_aborted") return {
		status: "blocked",
		outcome: "skipped",
		reasonCode: "acp_dispatch_aborted"
	};
	if (outcome === "completed") {
		const reasonCode = resolveCompletedInboundAuditReason(reason);
		return {
			status: "succeeded",
			outcome: "completed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (outcome === "skipped") {
		const reasonCode = resolveSkippedInboundAuditReason(reason);
		return {
			status: "blocked",
			outcome: "skipped",
			...reasonCode ? { reasonCode } : {}
		};
	}
	return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed"
	};
}
function emitInboundMessageAuditTerminal(params) {
	const { ctx, cfg } = params;
	const occurredAt = Date.now();
	const sessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.CommandTargetSessionKey);
	const actorId = normalizeOptionalString(ctx.SenderId);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const conversationId = normalizeOptionalString(ctx.NativeChannelId) ?? normalizeOptionalString(ctx.OriginatingTo) ?? normalizeOptionalString(ctx.To) ?? normalizeOptionalString(ctx.From);
	const messageId = normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid) ?? normalizeOptionalString(ctx.MessageSidFirst) ?? normalizeOptionalString(ctx.MessageSidLast);
	const terminalFields = resolveInboundMessageAuditTerminal(params.terminal.outcome, params.terminal.options?.reason);
	let agentId = normalizeOptionalString(ctx.AgentId);
	try {
		agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: ctx.AgentId
		});
	} catch {}
	try {
		emitTrustedMessageAuditEvent({
			occurredAt,
			kind: "message",
			action: "message.inbound.processed",
			...terminalFields,
			actorType: actorId ? "channel_sender" : "system",
			actorId: actorId ?? "gateway",
			...agentId ? { agentId } : {},
			...normalizeOptionalString(params.observedRunId) ? { runId: normalizeOptionalString(params.observedRunId) } : {},
			direction: "inbound",
			channel: normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel) || normalizeLowercaseStringOrEmpty(ctx.Surface) || normalizeLowercaseStringOrEmpty(ctx.Provider) || "unknown",
			conversationKind: normalizeChatType(ctx.ChatType) ?? "unknown",
			durationMs: Math.max(0, occurredAt - params.startedAt),
			resultCount: params.counts.tool + params.counts.block + params.counts.final,
			...accountId ? { accountId } : {},
			...conversationId ? { conversationId } : {},
			...messageId ? { messageId } : {}
		});
	} catch {}
}
/**
* Captures one terminal event for the reply-processing boundary. Channel admission and
* pre-dispatch drops remain outside this boundary and need their own ingress projection.
*/
function createInboundMessageAuditTerminal(params) {
	if (!hasTrustedMessageAuditListeners()) return;
	const startedAt = Date.now();
	let notedTerminal;
	let observedRunId = normalizeOptionalString(params.replyOptions?.runId);
	let finished = false;
	const emitTerminal = (terminal, counts) => {
		if (finished) return;
		finished = true;
		emitInboundMessageAuditTerminal({
			cfg: params.cfg,
			counts,
			ctx: params.ctx,
			observedRunId,
			startedAt,
			terminal
		});
	};
	return {
		note(outcome, options) {
			notedTerminal = {
				outcome,
				...options ? { options } : {}
			};
		},
		observeRunId(runId) {
			observedRunId = normalizeOptionalString(runId) ?? observedRunId;
		},
		finishSuccess(result) {
			emitTerminal(notedTerminal ?? { outcome: "completed" }, result.counts);
		},
		finishError() {
			let counts = {
				tool: 0,
				block: 0,
				final: 0
			};
			try {
				counts = params.dispatcher.getQueuedCounts();
			} catch {}
			emitTerminal({ outcome: "error" }, counts);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.events.ts
function createReplyDispatchEvent(params) {
	const { shouldSendToolSummaries, ...event } = params;
	return Object.defineProperty(event, "shouldSendToolSummaries", {
		enumerable: true,
		get: shouldSendToolSummaries
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.phase-state.ts
function extendPreparedDispatchState(state, values) {
	return Object.assign(state, values);
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.transcript.ts
async function mirrorDeliveredReplyToTranscript(params) {
	const mirror = params.metadata;
	if (!mirror) return;
	try {
		const result = await appendAssistantMessageToSessionTranscript({
			sessionKey: mirror.sessionKey,
			agentId: mirror.agentId,
			...mirror.expectedSessionId ? { expectedSessionId: mirror.expectedSessionId } : {},
			...mirror.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: mirror.expectedLifecycleRevision } : {},
			...mirror.expectedWriterRunId !== void 0 ? { expectedWriterRunId: mirror.expectedWriterRunId } : {},
			text: mirror.text,
			mediaUrls: mirror.preferText && mirror.text ? void 0 : mirror.mediaUrls,
			idempotencyKey: mirror.idempotencyKey,
			...mirror.deliveryMirror ? { deliveryMirror: mirror.deliveryMirror } : {},
			...mirror.storePath ? { storePath: mirror.storePath } : {},
			updateMode: "inline",
			config: params.cfg,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		});
		if (!result.ok) logVerbose(`dispatch-from-config: transcript mirror skipped: ${result.reason}`);
	} catch (error) {
		logVerbose(`dispatch-from-config: transcript mirror failed after delivery: ${formatErrorMessage(error)}`);
	}
}
/** Reads final outcome counters from dispatchers that expose them. */
function getDispatcherFinalOutcomeCounts(dispatcher) {
	return {
		cancelled: dispatcher.getCancelledCounts?.().final ?? 0,
		failed: readDispatcherFailedCounts(dispatcher).final
	};
}
function transcriptMirrorForDeliveredPayload(metadata, payload) {
	const sendable = resolveSendableOutboundReplyParts(payload);
	if (!sendable.text && sendable.mediaUrls.length === 0) return;
	return {
		...metadata,
		text: sendable.text,
		mediaUrls: sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0
	};
}
const STALE_FOREGROUND_SUPPRESSED_FINAL_TEXT = "Channel final suppressed before delivery: stale foreground";
function captureSuppressedTranscriptMirror(params) {
	const payloadMetadata = getReplyPayloadMetadata(params.payload);
	if (!params.metadata.transcriptOwner || payloadMetadata?.foregroundDeliverySuppression?.reason !== "stale-foreground") return;
	const deliveryMirror = params.metadata.deliveryMirror;
	if (!deliveryMirror) return;
	const sourceMessageId = normalizeOptionalString(deliveryMirror.sourceMessageId);
	if (!sourceMessageId) return;
	const { transcriptOwner: _transcriptOwner, ...metadata } = params.metadata;
	return {
		...metadata,
		text: STALE_FOREGROUND_SUPPRESSED_FINAL_TEXT,
		mediaUrls: void 0,
		preferText: true,
		idempotencyKey: `channel-final-suppressed:${sourceMessageId}:${params.deliveryId ?? "single"}`,
		deliveryMirror: {
			kind: "channel-final-suppressed",
			reason: "stale-foreground",
			sourceMessageId
		}
	};
}
function captureDeliveredTranscriptMirror(params) {
	if (!params.metadata || !params.dispatcher.appendBeforeDeliver) return () => params.metadata?.transcriptOwner ? void 0 : params.metadata;
	const metadata = params.metadata;
	let deliveredMetadata;
	let suppressedMetadata;
	let observedFinal = false;
	const { idempotencyKey, sessionKey } = metadata;
	params.dispatcher.appendBeforeDeliver((payload, info) => {
		if (info.kind !== "final") return payload;
		if (getReplyPayloadMetadata(payload)?.finalDeliveryCapture !== params.captureToken) return payload;
		observedFinal = true;
		const payloadMirror = getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror;
		if (payloadMirror && payloadMirror.idempotencyKey === idempotencyKey && payloadMirror.sessionKey === sessionKey) deliveredMetadata = transcriptMirrorForDeliveredPayload({
			...payloadMirror,
			...metadata.expectedSessionId ? { expectedSessionId: metadata.expectedSessionId } : {},
			...metadata.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: metadata.expectedLifecycleRevision } : {},
			...metadata.expectedWriterRunId !== void 0 ? { expectedWriterRunId: metadata.expectedWriterRunId } : {},
			storePath: metadata.storePath
		}, payload);
		else if (!payloadMirror && !metadata.transcriptOwner && (!idempotencyKey || metadata.deliveryMirror)) deliveredMetadata = transcriptMirrorForDeliveredPayload(metadata, payload);
		return payload;
	});
	appendReplyDispatcherBeforeDeliverCancelled(params.dispatcher, (payload, info) => {
		if (info.kind !== "final") return;
		if (getReplyPayloadMetadata(payload)?.finalDeliveryCapture !== params.captureToken) return;
		observedFinal = true;
		suppressedMetadata = captureSuppressedTranscriptMirror({
			metadata,
			payload,
			deliveryId: params.deliveryId
		});
	});
	return () => observedFinal ? suppressedMetadata ?? deliveredMetadata : metadata.transcriptOwner ? void 0 : metadata;
}
async function mirrorTranscriptAfterDispatcherSettled(params) {
	const after = getDispatcherFinalOutcomeCounts(params.dispatcher);
	const metadata = params.metadata();
	if (!metadata) return;
	if (!(metadata.deliveryMirror?.kind === "channel-final-suppressed") && (after.cancelled > params.before.cancelled || after.failed > params.before.failed)) return;
	await mirrorDeliveredReplyToTranscript({
		metadata,
		cfg: params.cfg
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.choose-route.ts
async function chooseDispatchRoute(state) {
	const { acpDispatchSessionKey, attachSourceReplyDeliveryMode, cfg, commitInboundDedupeIfClaimed, completeDispatchReplyOperation, ctx, deliveryChannel, dispatcher, getPreDispatchAbortSignal, hookRunner, isRoutedReplyDelivered, markIdle, markInboundDedupeReplayUnsafe, params, recordProcessed, replyContextAccountId, replyRoute, resolvePreparedTranscriptBinding, routeReplyChannel, routeReplyThreadId, routeReplyTo, runWithDispatchLifecycleAdmission, sendPayloadAsync, sessionAgentId, sessionKey, sessionStoreEntry, sessionTtsAuto, shouldEmitVerboseProgress, shouldRouteToOriginating, traceReplyPhase, trackDispatchLifecycleWork, turnLedger } = state;
	const shouldSuppressProgressDelivery = () => state.sendPolicyDenied || state.suppressDelivery && !shouldDeliverVerboseProgressDespiteSourceSuppression();
	const shouldSuppressDefaultToolProgressMessages = () => params.replyOptions?.suppressToolProgressMessages === true || !shouldEmitVerboseProgress();
	const shouldSendVerboseProgressMessages = () => !shouldSuppressDefaultToolProgressMessages();
	const shouldSendToolSummaries = () => shouldSendVerboseProgressMessages();
	const notifiedSessionMetadataChangeKeys = /* @__PURE__ */ new Set();
	const routeState = {};
	const notifySessionMetadataChanges = (changes) => {
		if (!changes?.length) return;
		const freshChanges = [];
		for (const change of changes) {
			const key = JSON.stringify([
				change.sessionKey,
				change.agentId ?? null,
				change.reason
			]);
			if (notifiedSessionMetadataChangeKeys.has(key)) continue;
			notifiedSessionMetadataChangeKeys.add(key);
			freshChanges.push(change);
		}
		if (freshChanges.length === 0) return;
		routeState.sessionMetadataChangesForResult = [...routeState.sessionMetadataChangesForResult ?? [], ...freshChanges];
		params.onSessionMetadataChanges?.(freshChanges);
	};
	const shouldDeliverVerboseProgressDespiteSourceSuppression = () => state.suppressAutomaticSourceDelivery && state.sourceReplyDeliveryMode === "message_tool_only" && ctx.InboundEventKind !== "room_event" && !state.sendPolicyDenied && shouldEmitVerboseProgress() && shouldSendVerboseProgressMessages();
	const shouldDeliverForcedToolProgressDespiteSourceSuppression = () => state.suppressAutomaticSourceDelivery && state.sourceReplyDeliveryMode === "message_tool_only" && ctx.InboundEventKind !== "room_event" && !state.sendPolicyDenied && params.replyOptions?.forceToolResultProgress === true;
	const shouldDeliverFastModeAutoProgressDespiteSourceSuppression = () => state.suppressAutomaticSourceDelivery && state.sourceReplyDeliveryMode === "message_tool_only" && ctx.InboundEventKind !== "room_event" && !state.sendPolicyDenied;
	let finalReplyDeliveryStarted = false;
	const shouldSuppressLateTextOnlyToolProgress = (payload) => {
		if (!finalReplyDeliveryStarted) return false;
		return !requiresDurableToolResultDelivery(payload);
	};
	let pendingCommentaryProgress = null;
	const deliverCommentaryProgressMessage = async (text) => {
		if (!shouldSendToolSummaries() || shouldSuppressProgressDelivery()) return;
		const payload = { text: `💬 ${text}` };
		if (shouldSuppressLateTextOnlyToolProgress(payload)) return;
		if (shouldRouteToOriginating) await sendPayloadAsync(payload, void 0, false);
		else {
			markInboundDedupeReplayUnsafe();
			turnLedger.sendQueued("tool", payload);
		}
	};
	const flushPendingCommentaryProgress = async () => {
		const pending = pendingCommentaryProgress;
		pendingCommentaryProgress = null;
		const text = pending?.text.trim();
		if (!text) return;
		await deliverCommentaryProgressMessage(text);
	};
	const noteCommentaryProgress = async (payload) => {
		const itemId = payload.itemId?.trim() || void 0;
		const text = payload.progressText ?? "";
		const repeatsBufferedText = pendingCommentaryProgress !== null && pendingCommentaryProgress.text.trim() === text.trim();
		const updatesBufferedItem = pendingCommentaryProgress !== null && (pendingCommentaryProgress.itemId !== void 0 && pendingCommentaryProgress.itemId === itemId || repeatsBufferedText);
		if (!text.trim()) {
			if (updatesBufferedItem) pendingCommentaryProgress = null;
			return;
		}
		if (pendingCommentaryProgress && !updatesBufferedItem) await flushPendingCommentaryProgress();
		pendingCommentaryProgress = {
			itemId,
			text
		};
	};
	const shouldSuppressMessageToolOnlyTextErrorProgress = (payload) => {
		if (state.sourceReplyDeliveryMode !== "message_tool_only" || state.shouldEmitFullVerboseProgress() || payload.isError !== true) return false;
		return !resolveSendableOutboundReplyParts(payload).hasMedia && !hasExecApprovalPayload(payload);
	};
	const captionedFinalTtsContext = {
		cfg,
		ttsAuto: sessionTtsAuto,
		agentId: sessionAgentId,
		channelId: deliveryChannel,
		accountId: replyRoute.accountId,
		inboundAudio: state.inboundAudio
	};
	const deferFinalTtsText = shouldDeferFinalTtsText(captionedFinalTtsContext);
	const cleanDeferredFinalDirectives = shouldCleanTtsDirectiveText(captionedFinalTtsContext);
	const deliveredBlockContentKeys = /* @__PURE__ */ new Set();
	const blockDeliveryOutcomes = /* @__PURE__ */ new Map();
	const sendTrackedBlockReply = (payload) => {
		const contentKey = createBlockReplyContentKey(payload);
		const delivery = turnLedger.sendQueued("block", payload);
		if (!delivery.queued) return false;
		const outcome = delivery.outcome ?? Promise.resolve("delivered");
		const outcomes = blockDeliveryOutcomes.get(contentKey);
		if (outcomes) outcomes.push(outcome);
		else blockDeliveryOutcomes.set(contentKey, [outcome]);
		return true;
	};
	const recordRoutedBlockReplyDelivery = (payload, result) => {
		if (result && isRoutedReplyDelivered(result)) deliveredBlockContentKeys.add(createBlockReplyContentKey(payload));
	};
	const wasReplyDeliveredAsBlock = async (payload, abortSignal) => {
		const contentKey = createBlockReplyContentKey(payload);
		if (deliveredBlockContentKeys.has(contentKey)) return true;
		const outcomes = blockDeliveryOutcomes.get(contentKey);
		if (!outcomes) return false;
		blockDeliveryOutcomes.delete(contentKey);
		const settlement = Promise.all(outcomes).then((settledOutcomes) => ({
			kind: "settled",
			outcomes: settledOutcomes
		}));
		if (abortSignal?.aborted) return false;
		let removeAbortListener;
		const result = abortSignal ? await Promise.race([settlement, new Promise((resolve) => {
			const onAbort = () => resolve({ kind: "aborted" });
			abortSignal.addEventListener("abort", onAbort, { once: true });
			removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
		})]).finally(() => removeAbortListener?.()) : await settlement;
		if (result.kind === "aborted") return false;
		const delivered = result.outcomes.some((outcome) => outcome === "delivered");
		if (delivered) deliveredBlockContentKeys.add(contentKey);
		return delivered;
	};
	const sendFinalPayload = async (inputPayload, options = {}) => {
		const abortSignal = options.abortSignal === false ? void 0 : options.abortSignal ?? state.getDispatchAbortSignal();
		const throwIfFinalDeliveryAborted = () => {
			if (abortSignal?.aborted) throw new DispatchReplyOperationAbortedError();
		};
		throwIfFinalDeliveryAborted();
		await flushPendingCommentaryProgress();
		throwIfFinalDeliveryAborted();
		const preparation = prepareReplyPayloadForDispatcher(dispatcher, "final", inputPayload);
		if (preparation.kind === "suppress") {
			await suppressPendingFinalDelivery(inputPayload);
			return {
				queuedFinal: false,
				routedFinalCount: 0,
				suppressionReason: preparation.reason
			};
		}
		const payload = preparation.payload;
		const payloadMetadata = getReplyPayloadMetadata(payload);
		const expectedWriterRunId = normalizeOptionalString(params.replyOptions?.runId);
		const expectedLifecycleRevision = sessionStoreEntry.entry?.lifecycleRevision;
		const sourceReplySessionBinding = resolvePreparedTranscriptBinding(payloadMetadata?.sourceReplyTranscriptMirror?.sessionKey);
		const sourceReplyTranscriptMirror = payloadMetadata?.sourceReplyTranscriptMirror ? {
			...payloadMetadata.sourceReplyTranscriptMirror,
			...sourceReplySessionBinding ? { expectedSessionId: sourceReplySessionBinding.sessionId } : {},
			...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
			...expectedWriterRunId ? { expectedWriterRunId } : {},
			storePath: sourceReplySessionBinding?.storePath ?? sessionStoreEntry.storePath
		} : void 0;
		const hasTranscriptOwner = payloadMetadata?.assistantMessageIndex !== void 0 || payloadMetadata?.assistantTranscriptOwned === true;
		const hasVisibleFinalContent = hasOutboundReplyContent(payload, { trimText: true });
		if (hasVisibleFinalContent) {
			markInboundDedupeReplayUnsafe();
			finalReplyDeliveryStarted = true;
		}
		const shouldAttachDeferredText = deferFinalTtsText && isCaptionedFinalTextPayload(payload);
		const deferredRawText = shouldAttachDeferredText ? mergeDeferredFinalText(options.deferredTtsText ?? "", payload.text) : void 0;
		const ttsInputPayload = shouldAttachDeferredText ? copyReplyPayloadMetadata(payload, {
			...payload,
			text: deferredRawText
		}) : payload;
		const deferredVisibleText = shouldAttachDeferredText ? cleanDeferredFinalDirectives ? cleanDeferredFinalText(deferredRawText) : deferredRawText : void 0;
		let appliedTtsPayload = payload;
		if (!options.skipTts && payload.isReasoning !== true && payload.isCommentary !== true) try {
			appliedTtsPayload = await state.maybeApplyTtsWithFinalizationLease({
				payload: ttsInputPayload,
				cfg,
				channel: deliveryChannel,
				kind: "final",
				ttsAuto: sessionTtsAuto,
				agentId: sessionAgentId,
				accountId: replyRoute.accountId
			});
		} catch (error) {
			if (!shouldAttachDeferredText) throw error;
			logVerbose(`dispatch-from-config: final TTS failed: ${formatErrorMessage(error)}`);
		}
		const ttsPayload = shouldAttachDeferredText ? copyReplyPayloadMetadata(appliedTtsPayload, {
			...appliedTtsPayload,
			text: deferredVisibleText || void 0
		}) : appliedTtsPayload;
		throwIfFinalDeliveryAborted();
		let normalizedPayload;
		try {
			normalizedPayload = await state.normalizeReplyMediaPayload(ttsPayload);
		} catch (error) {
			if (!shouldAttachDeferredText || !deferredVisibleText) throw error;
			logVerbose(`dispatch-from-config: media normalization failed: ${formatErrorMessage(error)}`);
			normalizedPayload = buildCaptionedFinalTextFallback(ttsPayload);
		}
		throwIfFinalDeliveryAborted();
		const deliveredAsBlock = await wasReplyDeliveredAsBlock(payload, abortSignal);
		throwIfFinalDeliveryAborted();
		if (deliveredAsBlock) {
			if (createBlockReplyContentKey(normalizedPayload) === createBlockReplyContentKey(payload)) return {
				dedupedAgainstBlock: true,
				queuedFinal: false,
				routedFinalCount: 0
			};
			normalizedPayload = copyReplyPayloadMetadata(normalizedPayload, {
				...normalizedPayload,
				text: void 0
			});
			if (!hasOutboundReplyContent(normalizedPayload, { trimText: true })) return {
				dedupedAgainstBlock: true,
				queuedFinal: false,
				routedFinalCount: 0
			};
		}
		const result = await state.routeReplyToOriginating(normalizedPayload, {
			abortSignal,
			kind: "final",
			...hasTranscriptOwner ? { mirror: false } : {}
		});
		if (result) {
			if (!result.ok) logVerbose(`dispatch-from-config: route-reply (final) failed: ${result.error ?? "unknown error"}`);
			if (isRoutedReplyDelivered(result)) await mirrorDeliveredReplyToTranscript({
				metadata: sourceReplyTranscriptMirror,
				cfg
			});
			const fallbackText = deferFinalTtsText && normalizedPayload.mediaUrl ? normalizeOptionalString(normalizedPayload.text) : void 0;
			if (fallbackText && !isRoutedReplyDelivered(result)) {
				const fallbackResult = await state.routeReplyToOriginating({ text: fallbackText }, {
					abortSignal,
					kind: "final",
					...hasTranscriptOwner ? { mirror: false } : {}
				});
				if (fallbackResult && isRoutedReplyDelivered(fallbackResult)) {
					await mirrorDeliveredReplyToTranscript({
						metadata: sourceReplyTranscriptMirror,
						cfg
					});
					return {
						queuedFinal: true,
						routedFinalCount: 1
					};
				}
			}
			return {
				queuedFinal: result.ok,
				routedFinalCount: isRoutedReplyDelivered(result) ? 1 : 0
			};
		}
		throwIfFinalDeliveryAborted();
		const transcriptMirrorSessionKey = acpDispatchSessionKey ?? sessionStoreEntry.sessionKey ?? sessionKey;
		const transcriptMirrorSourceId = normalizeOptionalString(state.messageIdForHook) ?? normalizeOptionalString(params.replyOptions?.runId);
		const transcriptMirrorSessionBinding = resolvePreparedTranscriptBinding(transcriptMirrorSessionKey);
		const transcriptMirror = sourceReplyTranscriptMirror ?? (state.normalizedCurrentSurface === "slack" && hasVisibleFinalContent && transcriptMirrorSessionKey ? transcriptMirrorForDeliveredPayload({
			sessionKey: transcriptMirrorSessionKey,
			agentId: sessionAgentId,
			...transcriptMirrorSessionBinding ? { expectedSessionId: transcriptMirrorSessionBinding.sessionId } : {},
			...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
			...expectedWriterRunId ? { expectedWriterRunId } : {},
			storePath: transcriptMirrorSessionBinding?.storePath ?? sessionStoreEntry.storePath,
			preferText: true,
			...hasTranscriptOwner ? { transcriptOwner: true } : {},
			idempotencyKey: transcriptMirrorSourceId ? `channel-final:${transcriptMirrorSourceId}:${options.deliveryId ?? "single"}` : void 0,
			deliveryMirror: {
				kind: "channel-final",
				...transcriptMirrorSourceId ? { sourceMessageId: transcriptMirrorSourceId } : {}
			}
		}, normalizedPayload) : void 0);
		markInboundDedupeReplayUnsafe();
		const finalOutcomeBefore = transcriptMirror ? getDispatcherFinalOutcomeCounts(dispatcher) : void 0;
		const finalDeliveryCapture = transcriptMirror ? {} : void 0;
		const deliveredTranscriptMirror = transcriptMirror ? captureDeliveredTranscriptMirror({
			dispatcher,
			metadata: transcriptMirror,
			deliveryId: options.deliveryId,
			captureToken: finalDeliveryCapture
		}) : void 0;
		if (finalDeliveryCapture) setReplyPayloadMetadata(normalizedPayload, { finalDeliveryCapture });
		if (deferFinalTtsText && normalizedPayload.mediaUrl && normalizedPayload.text?.trim()) attachReplyDispatchUndeliveredFallback(normalizedPayload, buildCaptionedFinalTextFallback(normalizedPayload));
		const { queued: queuedFinal, outcome: dispatcherOutcome } = turnLedger.sendQueued("final", normalizedPayload);
		if (queuedFinal && deliveredTranscriptMirror && finalOutcomeBefore) registerReplyDispatcherSettledTask(dispatcher, () => mirrorTranscriptAfterDispatcherSettled({
			dispatcher,
			before: finalOutcomeBefore,
			metadata: deliveredTranscriptMirror,
			cfg
		}));
		return {
			queuedFinal,
			routedFinalCount: 0,
			...queuedFinal && dispatcherOutcome ? { dispatcherOutcome } : {}
		};
	};
	if (hookRunner?.hasHooks("before_dispatch")) {
		const beforeDispatchSessionKey = sessionStoreEntry.sessionKey ?? sessionKey;
		const pluginSubagentRequester = createPluginSubagentRequesterContext({
			sessionKey: beforeDispatchSessionKey,
			origin: {
				channel: routeReplyChannel,
				to: routeReplyTo,
				accountId: replyContextAccountId,
				threadId: routeReplyThreadId
			}
		});
		const beforeDispatchResult = await traceReplyPhase("reply.before_dispatch_hooks", () => runWithDispatchLifecycleAdmission(async () => await runWithDispatchAbortSignal(getPreDispatchAbortSignal(), () => hookRunner.runBeforeDispatch({
			messageId: state.hookState.hookContext.messageId,
			content: state.hookState.hookContext.content,
			body: state.hookState.hookContext.bodyForAgent ?? state.hookState.hookContext.body,
			channel: state.hookState.hookContext.channelId,
			sessionKey: beforeDispatchSessionKey,
			senderId: state.hookState.hookContext.senderId,
			replyToId: state.hookState.hookContext.replyToId,
			replyToIdFull: state.hookState.hookContext.replyToIdFull,
			replyToBody: state.hookState.hookContext.replyToBody,
			replyToSender: state.hookState.hookContext.replyToSender,
			replyToIsQuote: state.hookState.hookContext.replyToIsQuote,
			isGroup: state.hookState.hookContext.isGroup,
			timestamp: state.hookState.hookContext.timestamp
		}, {
			messageId: state.hookState.hookContext.messageId,
			channelId: state.hookState.hookContext.channelId,
			accountId: state.hookState.hookContext.accountId,
			conversationId: state.hookState.inboundClaimContext.conversationId,
			sessionKey: beforeDispatchSessionKey,
			senderId: state.hookState.hookContext.senderId,
			replyToId: state.hookState.hookContext.replyToId,
			replyToIdFull: state.hookState.hookContext.replyToIdFull,
			replyToBody: state.hookState.hookContext.replyToBody,
			replyToSender: state.hookState.hookContext.replyToSender,
			replyToIsQuote: state.hookState.hookContext.replyToIsQuote
		}, pluginSubagentRequester), trackDispatchLifecycleWork)));
		if (beforeDispatchResult?.handled) {
			const text = beforeDispatchResult.text;
			let queuedFinal = false;
			let routedFinalCount = 0;
			if (text && !state.suppressDelivery) {
				const handledReply = await sendFinalPayload({ text }, {
					abortSignal: getPreDispatchAbortSignal(),
					deliveryId: "before-dispatch"
				});
				queuedFinal = handledReply.queuedFinal;
				routedFinalCount += handledReply.routedFinalCount;
			}
			const counts = dispatcher.getQueuedCounts();
			counts.final += routedFinalCount;
			recordProcessed("completed", { reason: "before_dispatch_handled" });
			markIdle("message_completed");
			commitInboundDedupeIfClaimed();
			completeDispatchReplyOperation();
			return {
				status: "complete",
				result: attachSourceReplyDeliveryMode({
					queuedFinal,
					counts
				})
			};
		}
	}
	if (hookRunner?.hasHooks("reply_dispatch")) {
		const replyDispatchResult = await traceReplyPhase("reply.reply_dispatch_hooks", () => runWithDispatchLifecycleAdmission(async () => await runWithDispatchAbortSignal(getPreDispatchAbortSignal(), () => hookRunner.runReplyDispatch(createReplyDispatchEvent({
			ctx,
			runId: params.replyOptions?.runId,
			sessionKey: acpDispatchSessionKey,
			toolsAllow: params.replyOptions?.toolsAllow,
			images: params.replyOptions?.images,
			inboundAudio: state.inboundAudio,
			sessionTtsAuto,
			ttsChannel: deliveryChannel,
			suppressUserDelivery: state.suppressHookUserDelivery,
			suppressReplyLifecycle: state.suppressHookReplyLifecycle,
			sourceReplyDeliveryMode: state.sourceReplyDeliveryMode,
			shouldRouteToOriginating,
			originatingChannel: routeReplyChannel,
			originatingTo: routeReplyTo,
			originatingAccountId: replyContextAccountId,
			originatingThreadId: routeReplyThreadId,
			originatingChatType: replyRoute.chatType,
			shouldSendToolSummaries,
			shouldSendFullToolDetails: state.shouldEmitFullVerboseProgress(),
			sendPolicy: state.sendPolicy
		}), {
			cfg,
			dispatcher: state.dispatchHookDispatcher,
			abortSignal: getPreDispatchAbortSignal() ?? params.replyOptions?.abortSignal,
			onReplyStart: params.replyOptions?.onReplyStart,
			recordProcessed,
			markIdle
		}), trackDispatchLifecycleWork)));
		if (replyDispatchResult?.handled) {
			commitInboundDedupeIfClaimed();
			completeDispatchReplyOperation();
			return {
				status: "complete",
				result: attachSourceReplyDeliveryMode({
					queuedFinal: replyDispatchResult.queuedFinal,
					counts: replyDispatchResult.counts
				})
			};
		}
	}
	const dispatchAcquisition = await state.ensureDispatchReplyOperation("dispatch");
	if (dispatchAcquisition.status === "aborted") return {
		status: "complete",
		result: state.finishReplyOperationAbortedDispatch()
	};
	if (dispatchAcquisition.status === "busy") return {
		status: "complete",
		result: state.finishReplyOperationBusyDispatch({ dedupeDisposition: "release" })
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			shouldSuppressDefaultToolProgressMessages,
			shouldSendVerboseProgressMessages,
			shouldSendToolSummaries,
			notifySessionMetadataChanges,
			shouldDeliverVerboseProgressDespiteSourceSuppression,
			shouldDeliverForcedToolProgressDespiteSourceSuppression,
			shouldDeliverFastModeAutoProgressDespiteSourceSuppression,
			shouldSuppressLateTextOnlyToolProgress,
			flushPendingCommentaryProgress,
			noteCommentaryProgress,
			shouldSuppressMessageToolOnlyTextErrorProgress,
			sendTrackedBlockReply,
			recordRoutedBlockReplyDelivery,
			wasReplyDeliveredAsBlock,
			sendFinalPayload,
			deferFinalTtsText,
			routeState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.execute.ts
async function executeDispatch(state) {
	const { cfg, cleanBlockTtsDirectiveText, commentaryPayloadsEnabled, ctx, deliveryChannel, deferFinalTtsText, dispatcher, failDispatchReplyOperation, flushPendingCommentaryProgress, getDispatchAbortOperation, getDispatchAbortSignal, hookRunner, isDispatchOperationAborted, markInboundDedupeReplayUnsafe, markProgress, markVisibleToolErrorProgress, maybeApplyTtsWithFinalizationLease, normalizeReplyMediaPayload, notifySessionMetadataChanges, onToolResultFromReplyOptions, params, reasoningPayloadsEnabled, recordAgentDispatchCompleted, replyConfig, replyRoute, resolveToolDeliveryPayload, runWithDispatchLifecycleAdmission, sendPayloadAsync, sendFinalPayload, sessionAgentId, sessionTtsAuto, shouldForwardProgressCallback, shouldRouteToOriginating, shouldSuppressDefaultToolProgressMessages, trackDispatchLifecycleWork, typing, wasReplyDeliveredAsBlock, waitForPendingDirectBlockReplyDelivery, wrapProgressCallback } = state;
	const replyResolver = bindPreparedReplyDispatchRuntime(params.configOverride ? void 0 : state.preparedReplyDispatchRuntime, state.replyResolver);
	let deliberateSilentTerminalReply = false;
	let pendingContinuation = false;
	let didDeliverVisiblePartialReply = false;
	const flushDeferredFinalText = async () => {
		if (!deferFinalTtsText || params.replyOptions?.isHeartbeat === true) return false;
		const deferredVisibleText = cleanBlockTtsDirectiveText ? cleanDeferredFinalText(state.progressState.accumulatedBlockTtsText) : state.progressState.accumulatedBlockText;
		if (!deferredVisibleText.trim()) return false;
		const fallback = await sendFinalPayload({ text: deferredVisibleText }, {
			abortSignal: isDispatchOperationAborted() ? false : void 0,
			skipTts: true
		});
		if (!fallback.queuedFinal && fallback.routedFinalCount === 0) return false;
		didDeliverVisiblePartialReply = true;
		state.progressState.accumulatedBlockText = "";
		state.progressState.accumulatedBlockTtsText = "";
		return true;
	};
	const replyResult = await runWithDispatchLifecycleAdmission(async () => await runWithDispatchAbortSignal(getDispatchAbortSignal(), () => state.traceReplyPhase("reply.run_reply_resolver", () => replyResolver(ctx, {
		...state.getReplyOptions(),
		[REPLY_OPERATION_RUN_STATE]: state.replyOperationRunState,
		sourceReplyDeliveryMode: state.sourceReplyDeliveryMode,
		sessionPromptSourceReplyDeliveryMode: state.sessionStableSourceReplyDeliveryMode,
		...state.sourceReplyDeliveryRuntimeOptions,
		onDeliberateSilentTerminalReply: () => {
			deliberateSilentTerminalReply = true;
		},
		onPendingContinuation: () => {
			pendingContinuation = true;
		},
		onSessionMetadataChanges: notifySessionMetadataChanges,
		onSessionPrepared: state.notePreparedSession,
		onObservedReplyDelivery: state.markObservedReplyDelivery,
		suppressToolErrorWarnings: state.suppressToolErrorWarnings,
		shouldSuppressToolErrorWarnings: state.shouldSuppressToolErrorWarnings,
		typingPolicy: typing.typingPolicy,
		suppressTyping: typing.suppressTyping,
		onPartialReply: deferFinalTtsText ? void 0 : wrapProgressCallback(params.replyOptions?.onPartialReply, { onVisible: (payload) => {
			if (hasOutboundReplyContent(payload, { trimText: true })) didDeliverVisiblePartialReply = true;
		} }),
		onReasoningStream: wrapProgressCallback(params.replyOptions?.onReasoningStream),
		streamReasoningInNonStreamModes: params.replyOptions?.streamReasoningInNonStreamModes,
		onReasoningEnd: wrapProgressCallback(params.replyOptions?.onReasoningEnd),
		onAssistantMessageStart: wrapProgressCallback(params.replyOptions?.onAssistantMessageStart),
		onBlockReplyQueued: wrapProgressCallback(params.replyOptions?.onBlockReplyQueued),
		onToolStart: wrapProgressCallback(params.replyOptions?.onToolStart, {
			allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
			forwardWhenSourceDeliverySuppressed: true,
			requiresToolSummaryVisibility: true,
			waitForDirectBlockReplyDelivery: true,
			onForward: async () => {
				await flushPendingCommentaryProgress();
			}
		}),
		onItemEvent: state.onItemEvent,
		commentaryProgressEnabled: state.deliverStandaloneCommentaryProgress || state.canForwardSuppressedSourceItemEvents || params.replyOptions?.commentaryProgressEnabled,
		reasoningPayloadsEnabled,
		commentaryPayloadsEnabled,
		onCommandOutput: wrapProgressCallback(params.replyOptions?.onCommandOutput, {
			forwardWhenSourceDeliverySuppressed: true,
			requiresToolSummaryVisibility: true,
			waitForDirectBlockReplyDelivery: true,
			onVisible: (payload) => {
				if (state.hasFailedProgressStatus(payload)) markVisibleToolErrorProgress();
			}
		}),
		onCompactionStart: wrapProgressCallback(params.replyOptions?.onCompactionStart, {
			allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
			forwardWhenSourceDeliverySuppressed: true,
			requiresToolSummaryVisibility: true,
			waitForDirectBlockReplyDelivery: true
		}),
		onCompactionEnd: wrapProgressCallback(params.replyOptions?.onCompactionEnd, {
			allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
			forwardWhenSourceDeliverySuppressed: true,
			requiresToolSummaryVisibility: true,
			waitForDirectBlockReplyDelivery: true
		}),
		onToolResult: (payload) => {
			state.getDispatchReplyOperation()?.recordActivity();
			markProgress();
			const run = async () => {
				if (isDispatchOperationAborted()) return;
				await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
				if (isDispatchOperationAborted()) return;
				markInboundDedupeReplayUnsafe();
				await flushPendingCommentaryProgress();
				if (payload.isError === true && replyConfig.messages?.suppressToolErrors === true) return;
				const isFastModeAutoProgress = isFastModeAutoProgressPayload(payload);
				const isFastModeAutoProgressDelivery = isFastModeAutoProgress && state.shouldDeliverFastModeAutoProgressDespiteSourceSuppression();
				const isForcedToolProgress = state.shouldDeliverForcedToolProgressDespiteSourceSuppression();
				const forceToolResultProgress = params.replyOptions?.forceToolResultProgress === true;
				const durableToolResult = requiresDurableToolResultDelivery(payload);
				const requiresDurableToolResult = forceToolResultProgress && durableToolResult;
				if (params.replyOptions?.suppressToolProgressMessages && !durableToolResult) return;
				const toolResultProgressCallback = (isFastModeAutoProgress ? shouldForwardProgressCallback({ forwardWhenSourceDeliverySuppressed: true }) : forceToolResultProgress ? !requiresDurableToolResult && !state.shouldEmitVerboseProgress() && shouldForwardProgressCallback({ forwardWhenSourceDeliverySuppressed: true }) : state.shouldSendToolSummaries() && shouldForwardProgressCallback()) ? onToolResultFromReplyOptions : void 0;
				if (toolResultProgressCallback) await toolResultProgressCallback(payload);
				if (isDispatchOperationAborted()) return;
				if (toolResultProgressCallback && (isFastModeAutoProgress || forceToolResultProgress)) return;
				if (state.sendPolicyDenied) return;
				if (state.shouldSuppressProgressDelivery() && !isFastModeAutoProgressDelivery && !isForcedToolProgress && !hasAskUserPayload(payload)) return;
				const visibleToolPayload = prepareReplyPayloadForSideEffects(dispatcher, "tool", isForcedToolProgress ? payload : resolveToolDeliveryPayload(payload), state.progressState);
				if (!visibleToolPayload) return;
				const ttsPayload = await maybeApplyTtsWithFinalizationLease({
					payload: visibleToolPayload,
					cfg,
					channel: deliveryChannel,
					kind: "tool",
					ttsAuto: sessionTtsAuto,
					agentId: sessionAgentId,
					accountId: replyRoute.accountId
				});
				const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
				const deliveryPayload = isForcedToolProgress ? normalizedPayload : resolveToolDeliveryPayload(normalizedPayload);
				if (!deliveryPayload) return;
				if (isDispatchOperationAborted()) return;
				if (state.shouldSuppressLateTextOnlyToolProgress(deliveryPayload) && !isFastModeAutoProgressPayload(deliveryPayload) && !isForcedToolProgress) return;
				if (state.shouldSuppressMessageToolOnlyTextErrorProgress(deliveryPayload)) return;
				if (shouldSuppressDefaultToolProgressMessages() && !isFastModeAutoProgressPayload(deliveryPayload) && !isForcedToolProgress) {
					if (!requiresDurableToolResultDelivery(deliveryPayload)) return;
				}
				if (deliveryPayload.isError === true) markVisibleToolErrorProgress();
				const askUserQuestionId = readAskUserQuestionId(deliveryPayload);
				if (askUserQuestionId !== void 0 && !await isAskUserPromptPending(askUserQuestionId)) return;
				if (isDispatchOperationAborted()) return;
				if (shouldRouteToOriginating) await sendPayloadAsync(deliveryPayload, void 0, false);
				else {
					markInboundDedupeReplayUnsafe();
					if (state.turnLedger.sendQueued("tool", deliveryPayload).queued && hasAskUserPayload(deliveryPayload)) await waitForReplyDispatcherIdle(dispatcher, getDispatchAbortOperation()?.abortSignal);
				}
			};
			return run();
		},
		onPlanUpdate: async (payload) => {
			if (isDispatchOperationAborted()) return;
			const steps = normalizeAgentPlanSteps(payload.steps);
			const normalized = {
				phase: payload.phase,
				title: payload.title,
				explanation: payload.explanation,
				steps,
				source: payload.source
			};
			markProgress();
			await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
			if (isDispatchOperationAborted()) return;
			markInboundDedupeReplayUnsafe();
			if (shouldForwardProgressCallback({
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true
			})) await state.onPlanUpdateFromReplyOptions?.(normalized);
			if (isDispatchOperationAborted()) return;
			if (payload.phase !== "update" || shouldSuppressDefaultToolProgressMessages()) return;
			await state.sendPlanUpdate({
				explanation: normalized.explanation,
				steps
			});
		},
		onApprovalEvent: async (payload) => {
			if (isDispatchOperationAborted()) return;
			markProgress();
			await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
			if (isDispatchOperationAborted()) return;
			markInboundDedupeReplayUnsafe();
			if (shouldForwardProgressCallback({
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true
			})) await state.onApprovalEventFromReplyOptions?.(payload);
		},
		onPatchSummary: async (payload) => {
			if (isDispatchOperationAborted()) return;
			markProgress();
			await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
			if (isDispatchOperationAborted()) return;
			markInboundDedupeReplayUnsafe();
			if (shouldForwardProgressCallback({
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true
			})) await state.onPatchSummaryFromReplyOptions?.(payload);
		},
		onBlockReply: (inputPayload, context) => {
			markProgress();
			const run = async () => {
				if (isDispatchOperationAborted()) return;
				await flushPendingCommentaryProgress();
				if (state.suppressDelivery && !shouldDeliverDespiteSourceReplySuppression(inputPayload, state)) return;
				if (inputPayload.isReasoning === true && !reasoningPayloadsEnabled) return;
				if (inputPayload.isCommentary === true && !commentaryPayloadsEnabled) return;
				const payload = prepareReplyPayloadForSideEffects(dispatcher, "block", inputPayload, state.progressState, markInboundDedupeReplayUnsafe);
				if (!payload) return;
				const isStatusNotice = isReplyPayloadStatusNotice(payload);
				if (payload.text && !isStatusNotice && payload.isReasoning !== true && payload.isCommentary !== true) {
					const joinsBufferedTtsDirective = cleanBlockTtsDirectiveText?.hasBufferedDirectiveText() === true;
					if (state.progressState.accumulatedBlockText.length > 0) state.progressState.accumulatedBlockText += "\n";
					state.progressState.accumulatedBlockText += payload.text;
					if (state.progressState.accumulatedBlockTtsText.length > 0 && !joinsBufferedTtsDirective) state.progressState.accumulatedBlockTtsText += "\n";
					state.progressState.accumulatedBlockTtsText += payload.text;
					state.progressState.blockCount++;
				}
				let visiblePayload = payload.text && cleanBlockTtsDirectiveText && !isStatusNotice && payload.isReasoning !== true && payload.isCommentary !== true ? (() => {
					const text = cleanBlockTtsDirectiveText.push(payload.text);
					return copyReplyPayloadMetadata(payload, {
						...payload,
						text: text.trim() ? text : void 0
					});
				})() : payload;
				if (deferFinalTtsText && !isStatusNotice && payload.isReasoning !== true && payload.isCommentary !== true) {
					if (!Boolean(visiblePayload.mediaUrl || visiblePayload.mediaUrls?.length || visiblePayload.presentation || visiblePayload.interactive || visiblePayload.channelData)) return;
					visiblePayload = copyReplyPayloadMetadata(visiblePayload, {
						...visiblePayload,
						text: void 0
					});
				}
				if (!hasOutboundReplyContent(visiblePayload, { trimText: true })) return;
				const payloadMetadata = getReplyPayloadMetadata(payload);
				const queuedContext = payloadMetadata?.assistantMessageIndex !== void 0 ? {
					...context,
					assistantMessageIndex: payloadMetadata.assistantMessageIndex
				} : context;
				if (isDispatchOperationAborted()) return;
				const ttsPayload = payload.isReasoning === true || payload.isCommentary === true ? visiblePayload : await maybeApplyTtsWithFinalizationLease({
					payload: visiblePayload,
					cfg,
					channel: deliveryChannel,
					kind: "block",
					ttsAuto: sessionTtsAuto,
					agentId: sessionAgentId,
					accountId: replyRoute.accountId
				});
				const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
				if (isDispatchOperationAborted()) return;
				if (shouldRouteToOriginating) {
					const result = await sendPayloadAsync(normalizedPayload, context?.abortSignal, false, "block");
					state.recordRoutedBlockReplyDelivery(normalizedPayload, result);
					if (result?.delivered === true && !state.suppressAutomaticSourceDelivery) await params.replyOptions?.onBlockReplyQueued?.(visiblePayload, queuedContext);
				} else {
					markInboundDedupeReplayUnsafe();
					const admitted = state.sendTrackedBlockReply(normalizedPayload);
					if (admitted) state.progressState.hasPendingDirectBlockReplyDelivery = true;
					if (admitted && !state.suppressAutomaticSourceDelivery && params.replyOptions?.onBlockReplyQueued) trackDispatchLifecycleWork(wasReplyDeliveredAsBlock(normalizedPayload, context?.abortSignal).then(async (delivered) => {
						if (delivered) await params.replyOptions?.onBlockReplyQueued?.(visiblePayload, queuedContext);
					}));
				}
			};
			return run();
		}
	}, state.preparedReplyDispatchRuntime && !params.configOverride ? void 0 : replyConfig)), trackDispatchLifecycleWork)).catch(async (error) => {
		try {
			await flushDeferredFinalText();
		} catch (fallbackError) {
			logVerbose(`dispatch-from-config: deferred final text fallback failed: ${formatErrorMessage(fallbackError)}`);
		}
		if (params.replyOptions?.isHeartbeat === true || !didDeliverVisiblePartialReply || isDispatchOperationAborted()) throw error;
		failDispatchReplyOperation(error, "failed");
		return buildTerminalAgentRunFailureReplyPayload({
			visibleReplyDelivered: true,
			sessionCtx: ctx,
			cfg: replyConfig
		});
	});
	if (isDispatchOperationAborted()) try {
		await flushDeferredFinalText();
	} catch (fallbackError) {
		logVerbose(`dispatch-from-config: deferred final text fallback failed: ${formatErrorMessage(fallbackError)}`);
	}
	notifySessionMetadataChanges(takeCommandSessionMetadataChanges(ctx));
	const finalDispatchAcquisition = await state.ensureDispatchReplyOperation("dispatch");
	if (finalDispatchAcquisition.status === "aborted") return {
		status: "complete",
		result: state.finishReplyOperationAbortedDispatch()
	};
	if (finalDispatchAcquisition.status === "busy") return {
		status: "complete",
		result: state.finishReplyOperationBusyDispatch({
			recordAgentDispatchCompleted: true,
			...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {}
		})
	};
	if (ctx.AcpDispatchTailAfterReset === true) {
		ctx.AcpDispatchTailAfterReset = false;
		if (hookRunner?.hasHooks("reply_dispatch")) {
			const tailDispatchResult = await runWithDispatchLifecycleAdmission(async () => await runWithDispatchAbortSignal(getDispatchAbortSignal(), () => hookRunner.runReplyDispatch(createReplyDispatchEvent({
				ctx,
				runId: params.replyOptions?.runId,
				sessionKey: state.acpDispatchSessionKey,
				toolsAllow: params.replyOptions?.toolsAllow,
				images: params.replyOptions?.images,
				inboundAudio: state.inboundAudio,
				sessionTtsAuto,
				ttsChannel: deliveryChannel,
				suppressUserDelivery: state.suppressHookUserDelivery,
				suppressReplyLifecycle: state.suppressHookReplyLifecycle,
				sourceReplyDeliveryMode: state.sourceReplyDeliveryMode,
				shouldRouteToOriginating,
				originatingChannel: state.routeReplyChannel,
				originatingTo: state.routeReplyTo,
				originatingAccountId: state.replyContextAccountId,
				originatingThreadId: state.routeReplyThreadId,
				originatingChatType: replyRoute.chatType,
				shouldSendToolSummaries: state.shouldSendToolSummaries,
				shouldSendFullToolDetails: state.shouldEmitFullVerboseProgress(),
				sendPolicy: state.sendPolicy,
				isTailDispatch: true
			}), {
				cfg,
				dispatcher: state.dispatchHookDispatcher,
				abortSignal: state.getPreDispatchAbortSignal() ?? params.replyOptions?.abortSignal,
				onReplyStart: params.replyOptions?.onReplyStart,
				recordProcessed: state.recordProcessed,
				markIdle: state.markIdle
			}), trackDispatchLifecycleWork));
			if (tailDispatchResult?.handled) {
				recordAgentDispatchCompleted("completed");
				state.completeDispatchReplyOperation();
				return {
					status: "complete",
					result: state.attachSourceReplyDeliveryMode({
						queuedFinal: tailDispatchResult.queuedFinal,
						counts: tailDispatchResult.counts,
						...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {}
					})
				};
			}
		}
	}
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			deliberateSilentTerminalReply,
			pendingContinuation,
			replyResult
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.context.ts
function routeThreadIdsDiffer(left, right) {
	if (left === void 0 || right === void 0) return false;
	return String(left) !== String(right);
}
function shouldLetSlackRoutedThreadBypassBusyReplyOperation(params) {
	return isSlackDirectRoutedThreadTurn(params.ctx) && routeThreadIdsDiffer(params.activeOperation?.routeThreadId, params.routeThreadId);
}
function resolveRoutedPolicyConversationType(ctx) {
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
	if (commandTargetSessionKey && commandTargetSessionKey !== ctx.SessionKey) return;
	const chatType = normalizeChatType(ctx.ChatType);
	if (chatType === "direct") return "direct";
	if (chatType === "group" || chatType === "channel") return "group";
}
function resolveSessionStoreLookup(ctx, cfg) {
	const sessionKey = normalizeOptionalString(resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey);
	if (!sessionKey) return {};
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStoreEntry({
			agentId,
			storePath,
			sessionKey,
			readConsistency: "latest",
			clone: false
		});
		return {
			sessionKey,
			storePath,
			entry,
			store: entry ? { [sessionKey]: entry } : void 0
		};
	} catch {
		return {
			sessionKey,
			storePath
		};
	}
}
function resolveBoundAcpDispatchSessionKey(params) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	const binding = getSessionBindingService().resolveByConversation({
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		...bindingContext.parentConversationId ? { parentConversationId: bindingContext.parentConversationId } : {}
	});
	const targetSessionKey = normalizeOptionalString(binding?.targetSessionKey);
	if (!binding || !targetSessionKey || !isAcpSessionKey(targetSessionKey)) return;
	if (isPluginOwnedSessionBindingRecord(binding)) return;
	getSessionBindingService().touch(binding.bindingId);
	return targetSessionKey;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.turn-ledger.ts
const SETTLE_QUEUED_TIMEOUT_MS = 3e4;
function createReplyTurnLedger(dispatcher) {
	let visibleDeliveries = 0;
	let queuedAdmissions = 0;
	const pendingOutcomes = [];
	const enqueue = (kind, payload) => {
		if (kind === "tool") return dispatcher.sendToolResult(payload);
		if (kind === "block") return dispatcher.sendBlockReply(payload);
		return dispatcher.sendFinalReply(payload);
	};
	return {
		sendQueued(kind, payload) {
			const capture = captureReplyDispatchDeliveryOutcome(payload);
			if (!enqueue(kind, payload)) return { queued: false };
			queuedAdmissions += 1;
			const contentful = hasOutboundReplyContent(payload, { trimText: true });
			if (!capture.isTracked()) {
				if (contentful) visibleDeliveries += 1;
				return { queued: true };
			}
			pendingOutcomes.push(capture.promise.then((outcome) => {
				if (contentful && outcome !== "cancelled" && outcome !== "failed-before-deliver") visibleDeliveries += 1;
			}));
			return {
				queued: true,
				outcome: capture.promise
			};
		},
		recordRoutedDelivery(payload, delivered) {
			if (delivered && hasOutboundReplyContent(payload, { trimText: true })) visibleDeliveries += 1;
		},
		async settleQueued(abortSignal) {
			let timedOut = false;
			let timer;
			const deadline = new Promise((resolve) => {
				timer = setTimeout(() => {
					timedOut = true;
					resolve();
				}, SETTLE_QUEUED_TIMEOUT_MS);
				timer.unref?.();
			});
			let removeAbortListener;
			const aborted = abortSignal ? new Promise((resolve) => {
				const onAbort = () => resolve();
				abortSignal.addEventListener("abort", onAbort, { once: true });
				removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
			}) : void 0;
			try {
				let settledCount = 0;
				while (settledCount < pendingOutcomes.length) {
					if (abortSignal?.aborted) return "aborted";
					if (timedOut) return "timed-out";
					const batch = pendingOutcomes.slice(settledCount);
					const batchTarget = pendingOutcomes.length;
					const settled = Promise.all(batch).then(() => void 0);
					await Promise.race([
						settled,
						deadline,
						...aborted ? [aborted] : []
					]);
					if (abortSignal?.aborted) return "aborted";
					if (timedOut) return "timed-out";
					settledCount = batchTarget;
				}
				return "settled";
			} finally {
				if (timer) clearTimeout(timer);
				removeAbortListener?.();
			}
		},
		hasVisibleDelivery: () => visibleDeliveries > 0,
		hasForeignQueuedAdmissions: () => {
			const counts = dispatcher.getQueuedCounts();
			return counts.tool + counts.block + counts.final > queuedAdmissions;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.lifecycle.ts
function createDispatchReplyOperationCoordinator(params) {
	let dispatchReplyOperation;
	let dispatchAbortOperation;
	let preDispatchAbortOperation;
	let preDispatchLifecycleAdmission;
	let preDispatchLifecycleAbortController;
	let dispatchLifecycleAbortController;
	let preDispatchLifecycleInterrupted = false;
	const dispatchLifecycleWork = /* @__PURE__ */ new Set();
	const trackDispatchLifecycleWork = (work) => {
		if (!dispatchReplyOperation && !preDispatchLifecycleAdmission) return;
		const settled = work.then(() => {}, () => {});
		dispatchLifecycleWork.add(settled);
		settled.then(() => {
			dispatchLifecycleWork.delete(settled);
		});
	};
	const waitForDispatchLifecycleWorkAndDelivery = async () => {
		await Promise.allSettled(Array.from(dispatchLifecycleWork));
		await waitForReplyDispatcherIdle(params.dispatcher);
	};
	const releasePreDispatchLifecycleAdmission = async (afterWorkBarrier) => {
		const admission = preDispatchLifecycleAdmission;
		const preDispatchAbortController = preDispatchLifecycleAbortController;
		const dispatchAbortController = dispatchLifecycleAbortController;
		preDispatchLifecycleAdmission = void 0;
		if (!admission) return;
		const pendingWork = Array.from(dispatchLifecycleWork);
		const clearAbortControllers = () => {
			if (preDispatchLifecycleAbortController === preDispatchAbortController) preDispatchLifecycleAbortController = void 0;
			if (dispatchLifecycleAbortController === dispatchAbortController) dispatchLifecycleAbortController = void 0;
		};
		if (!afterWorkBarrier && pendingWork.length === 0) {
			clearAbortControllers();
			admission.release();
			return;
		}
		try {
			await Promise.allSettled(pendingWork);
			if (afterWorkBarrier) await waitForReplyBarrierSettlement(afterWorkBarrier(), params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.());
		} finally {
			clearAbortControllers();
			admission.release();
		}
	};
	const runWithDispatchLifecycleAdmission = async (run) => {
		if (dispatchReplyOperation) return await runWithReplyOperationLifecycleAdmission(dispatchReplyOperation, run);
		return preDispatchLifecycleAdmission ? await preDispatchLifecycleAdmission.run(run) : await run();
	};
	const ensureDispatchReplyOperation = async (phase) => {
		if (phase === "dispatch") {
			await releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
			if (preDispatchLifecycleInterrupted) return { status: dispatchReplyOperation ? "aborted" : "busy" };
		}
		if (dispatchReplyOperation) return { status: "ready" };
		if (dispatchAbortOperation && !dispatchAbortOperation.result) return dispatchReplyOperation ? { status: "ready" } : { status: "busy" };
		if (phase === "dispatch" && preDispatchAbortOperation?.result && preDispatchAbortOperation.result.kind !== "completed" && !dispatchReplyOperation) {
			dispatchAbortOperation = preDispatchAbortOperation;
			return { status: "busy" };
		}
		if (!params.dispatchOperationSessionKey) return { status: "ready" };
		const operationSessionId = dispatchAbortOperation?.sessionId ?? params.operationSessionStoreEntry.entry?.sessionId ?? crypto.randomUUID();
		const replyTurnKind = resolveReplyTurnKind(params.replyOptions);
		const activeReplyOperation = replyRunRegistry.get(params.dispatchOperationSessionKey);
		const activeEmbeddedSessionId = resolveActiveEmbeddedRunSessionId(params.dispatchOperationSessionKey);
		if (replyTurnKind === "visible" && params.replyOptions?.turnAdoptionLifecycle !== void 0 && activeReplyOperation === void 0 && activeEmbeddedSessionId === operationSessionId) return { status: "ready" };
		const allowActivePreDispatch = phase === "pre_dispatch" && replyTurnKind === "visible";
		if (phase === "dispatch" && replyTurnKind === "visible" && params.replyOptions?.turnAdoptionLifecycle !== void 0 && activeReplyOperation !== void 0 && activeReplyOperation.turnKind !== "heartbeat") return { status: "ready" };
		const allowSlackRoutedThreadBypass = phase === "dispatch" && shouldLetSlackRoutedThreadBypassBusyReplyOperation({
			activeOperation: replyRunRegistry.get(params.dispatchOperationSessionKey),
			ctx: params.ctx,
			routeThreadId: params.routeThreadId
		});
		const lifecycleOnlyAbortController = allowActivePreDispatch || allowSlackRoutedThreadBypass ? new AbortController() : void 0;
		const onLifecycleInterrupt = () => {
			preDispatchLifecycleInterrupted = true;
			lifecycleOnlyAbortController?.abort();
		};
		let admission = await admitReplyTurn({
			sessionKey: params.dispatchOperationSessionKey,
			sessionId: operationSessionId,
			expectedSessionId: params.resolveOperationExpectedSessionId(),
			expectedActiveOperation: params.initialDispatchReplyOperation,
			storePath: params.operationSessionStoreEntry.storePath,
			kind: replyTurnKind,
			resetTriggered: false,
			routeThreadId: params.routeThreadId,
			originatingLeafEntryId: params.replyOptions?.turnAdoptionLifecycle?.originatingLeafEntryId,
			upstreamAbortSignal: params.replyOptions?.abortSignal,
			waitForActive: !allowActivePreDispatch && !allowSlackRoutedThreadBypass,
			retainLifecycleAdmissionOnActive: allowActivePreDispatch || allowSlackRoutedThreadBypass,
			onLifecycleInterrupt,
			onReplyAdmissionWaitChange: params.replyOptions?.onReplyAdmissionWaitChange
		});
		if (admission.status === "skipped" && admission.reason === "active-run" && replyTurnKind === "visible" && isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) && admission.activeOperation?.sessionId === params.operationSessionStoreEntry.entry?.sessionId && !admission.activeOperation?.terminalRecovery) {
			if (forceClearReplyRunBySessionId(admission.activeOperation?.sessionId ?? operationSessionId, /* @__PURE__ */ new Error("clearing stale terminal reply operation"))) {
				admission.lifecycleAdmission?.release();
				logVerbose(`dispatch-from-config: cleared stale active reply operation for terminal session ${params.dispatchOperationSessionKey}`);
				admission = await admitReplyTurn({
					sessionKey: params.dispatchOperationSessionKey,
					sessionId: operationSessionId,
					expectedSessionId: params.resolveOperationExpectedSessionId(),
					expectedActiveOperation: params.initialDispatchReplyOperation,
					storePath: params.operationSessionStoreEntry.storePath,
					kind: replyTurnKind,
					resetTriggered: false,
					routeThreadId: params.routeThreadId,
					originatingLeafEntryId: params.replyOptions?.turnAdoptionLifecycle?.originatingLeafEntryId,
					upstreamAbortSignal: params.replyOptions?.abortSignal,
					waitForActive: !allowActivePreDispatch && !allowSlackRoutedThreadBypass,
					retainLifecycleAdmissionOnActive: allowActivePreDispatch || allowSlackRoutedThreadBypass,
					onLifecycleInterrupt,
					onReplyAdmissionWaitChange: params.replyOptions?.onReplyAdmissionWaitChange
				});
			}
		}
		if (admission.status === "skipped") {
			if (allowActivePreDispatch && admission.reason === "active-run") {
				preDispatchAbortOperation = admission.activeOperation;
				preDispatchLifecycleAdmission = admission.lifecycleAdmission;
				preDispatchLifecycleAbortController = lifecycleOnlyAbortController;
				return { status: "ready" };
			}
			if (admission.reason === "active-run" && shouldLetSlackRoutedThreadBypassBusyReplyOperation({
				activeOperation: admission.activeOperation,
				ctx: params.ctx,
				routeThreadId: params.routeThreadId
			})) {
				preDispatchLifecycleAdmission = admission.lifecycleAdmission;
				dispatchLifecycleAbortController = lifecycleOnlyAbortController;
				logVerbose(`dispatch-from-config: allowing Slack routed thread ${params.routeThreadId} while ${params.dispatchOperationSessionKey} has an active reply operation in another Slack thread`);
				return { status: "ready" };
			}
			admission.lifecycleAdmission?.release();
			dispatchAbortOperation = admission.activeOperation;
			logVerbose(`dispatch-from-config: skipped reply operation admission for ${params.dispatchOperationSessionKey}; reason=${admission.reason}`);
			return { status: "busy" };
		}
		if (replyTurnKind === "visible" && isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) && operationSessionId === params.operationSessionStoreEntry.entry?.sessionId) admission.operation.markTerminalRecovery();
		dispatchReplyOperation = admission.operation;
		dispatchReplyOperation.retainFailureUntilComplete();
		dispatchAbortOperation = admission.operation;
		return { status: "ready" };
	};
	const getPreDispatchAbortOperation = () => dispatchAbortOperation ?? preDispatchAbortOperation;
	let cachedPreDispatchAbortSignal;
	let cachedDispatchAbortSignal;
	const getPreDispatchAbortSignal = () => {
		const operationSignal = getPreDispatchAbortOperation()?.abortSignal;
		const lifecycleSignal = preDispatchLifecycleAbortController?.signal;
		const upstreamSignal = params.replyOptions?.abortSignal;
		if (cachedPreDispatchAbortSignal && cachedPreDispatchAbortSignal.operationSignal === operationSignal && cachedPreDispatchAbortSignal.lifecycleSignal === lifecycleSignal && cachedPreDispatchAbortSignal.upstreamSignal === upstreamSignal) return cachedPreDispatchAbortSignal.signal;
		const abortSignals = [
			operationSignal,
			lifecycleSignal,
			upstreamSignal
		].filter((signal) => Boolean(signal));
		const signal = abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0];
		cachedPreDispatchAbortSignal = {
			operationSignal,
			lifecycleSignal,
			upstreamSignal,
			signal
		};
		return signal;
	};
	const getDispatchAbortSignal = () => {
		const operationSignal = dispatchReplyOperation?.abortSignal ?? dispatchLifecycleAbortController?.signal;
		const upstreamSignal = operationSignal ? void 0 : params.replyOptions?.abortSignal;
		if (cachedDispatchAbortSignal && cachedDispatchAbortSignal.operationSignal === operationSignal && cachedDispatchAbortSignal.upstreamSignal === upstreamSignal) return cachedDispatchAbortSignal.signal;
		const signal = operationSignal ?? upstreamSignal;
		cachedDispatchAbortSignal = {
			operationSignal,
			upstreamSignal,
			signal
		};
		return signal;
	};
	const getQueuedFollowupAbortSignal = () => dispatchReplyOperation?.abortSignal ?? params.replyOptions?.abortSignal;
	let observedReplyDelivery = false;
	let agentRunTerminalOutcome;
	const markObservedReplyDelivery = async () => {
		if (observedReplyDelivery) return;
		observedReplyDelivery = true;
		await params.replyOptions?.onObservedReplyDelivery?.();
	};
	const getReplyOptions = () => {
		const abortSignal = getDispatchAbortSignal();
		const onAgentRunStart = (runId) => {
			agentRunTerminalOutcome = "completed";
			params.messageAuditTerminal?.observeRunId(runId);
			params.replyOptions?.onAgentRunStart?.(runId);
		};
		return {
			...params.replyOptions,
			...abortSignal ? {
				abortSignal,
				queuedFollowupAbortSignal: getQueuedFollowupAbortSignal()
			} : {},
			onAgentRunStart,
			...dispatchReplyOperation ? { replyOperation: dispatchReplyOperation } : {}
		};
	};
	const completeDispatchReplyOperation = () => {
		const completionBarrier = waitForDispatchLifecycleWorkAndDelivery();
		releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
		if (dispatchReplyOperation) dispatchReplyOperation.completeWithAfterClearBarrier(completionBarrier, params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.());
	};
	const failDispatchReplyOperation = (error, terminalOutcome) => {
		if (terminalOutcome === "failed" && agentRunTerminalOutcome === "completed") agentRunTerminalOutcome = "failed";
		const completionBarrier = waitForDispatchLifecycleWorkAndDelivery();
		releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
		if (!dispatchReplyOperation) return;
		dispatchReplyOperation.freezeAbort();
		if (!dispatchReplyOperation.result) dispatchReplyOperation.fail("run_failed", error);
		dispatchReplyOperation.completeWithAfterClearBarrier(completionBarrier, params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.());
	};
	const isDispatchOperationAborted = () => getDispatchAbortSignal()?.aborted === true;
	const isPreDispatchOperationAborted = () => getPreDispatchAbortSignal()?.aborted === true;
	const throwIfDispatchOperationAborted = () => {
		if (isDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
	};
	const turnLedger = createReplyTurnLedger(params.dispatcher);
	return {
		completeDispatchReplyOperation,
		dispatchHookDispatcher: createAbortAwareDispatcher({
			dispatcher: {
				...params.dispatcher,
				sendToolResult: (payload) => turnLedger.sendQueued("tool", payload).queued,
				sendBlockReply: (payload) => turnLedger.sendQueued("block", payload).queued,
				sendFinalReply: (payload) => turnLedger.sendQueued("final", payload).queued
			},
			isAborted: isPreDispatchOperationAborted
		}),
		turnLedger,
		ensureDispatchReplyOperation,
		failDispatchReplyOperation,
		getAgentRunTerminalOutcome: () => agentRunTerminalOutcome,
		getDispatchAbortOperation: () => dispatchAbortOperation,
		getDispatchAbortSignal,
		getDispatchReplyOperation: () => dispatchReplyOperation,
		getReplyOptions,
		getObservedReplyDelivery: () => observedReplyDelivery,
		getPreDispatchAbortSignal,
		isDispatchOperationAborted,
		isPreDispatchOperationAborted,
		markObservedReplyDelivery,
		releasePreDispatchLifecycleAdmission,
		runWithDispatchLifecycleAdmission,
		throwIfDispatchOperationAborted,
		trackDispatchLifecycleWork
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.timing.ts
const replyHotPathTimingLog = createSubsystemLogger("auto-reply/reply-timing");
function createReplyHotPathTimingTracker(options = {}) {
	const timing = createReplyTimingTracker({
		log: replyHotPathTimingLog,
		enabled: options.profilerEnabled === true,
		formatMessage: (params, summary, stages) => `reply hot path timings channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} totalMs=${summary.totalMs} stages=${stages}${params.reason ? ` reason=${params.reason}` : ""}`,
		detailKeys: () => [
			"channel",
			"messageId",
			"sessionKey",
			"outcome",
			"reason"
		]
	});
	return {
		measure: timing.measure,
		logIfSlow(params) {
			timing.logIfSlow(params);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.gather.ts
async function gatherDispatchRequest(params, messageAuditTerminal) {
	const ctx = isFinalizedInboundContext(params.ctx) ? params.ctx : finalizeInboundContext(params.ctx);
	const normalizedParams = {
		...params,
		ctx,
		replyOptions: { ...params.replyOptions }
	};
	const state = {
		params: normalizedParams,
		messageAuditTerminal,
		inboundDedupeReplayUnsafe: false
	};
	const { cfg, dispatcher } = normalizedParams;
	const replyOperationRunState = resolveReplyOperationRunState(normalizedParams.replyOptions) ?? {};
	if (params.replyOptions?.abortSignal?.aborted) {
		messageAuditTerminal?.note("skipped", { reason: "reply_operation_aborted" });
		return {
			status: "complete",
			result: {
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			}
		};
	}
	const diagnosticsEnabled = isDiagnosticsEnabled(cfg);
	const channel = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider ?? "unknown");
	const chatId = ctx.To ?? ctx.From;
	const messageId = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	const sessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.CommandTargetSessionKey);
	const startTime = diagnosticsEnabled ? Date.now() : 0;
	const canTrackSession = diagnosticsEnabled && Boolean(sessionKey);
	const initialSessionStoreEntry = resolveSessionStoreLookup(ctx, cfg);
	const messageLifecycle = createDiagnosticMessageLifecycle({
		enabled: diagnosticsEnabled,
		channel,
		chatId,
		messageId,
		sessionKey,
		sessionId: initialSessionStoreEntry.sessionKey === sessionKey ? initialSessionStoreEntry.entry?.sessionId : void 0,
		source: "dispatch",
		processingReason: "message_start",
		startedAtMs: startTime,
		trackSessionState: canTrackSession
	});
	const traceAttributes = {
		surface: channel,
		hasSessionKey: Boolean(sessionKey),
		hasRunId: typeof params.replyOptions?.runId === "string"
	};
	const replyHotPathTiming = createReplyHotPathTimingTracker({ profilerEnabled: isReplyProfilerEnabled({ config: cfg }) });
	const traceReplyPhase = (name, run) => replyHotPathTiming.measure(name, () => measureDiagnosticsTimelineSpan(name, run, {
		phase: "agent-turn",
		config: cfg,
		attributes: traceAttributes
	}));
	let agentDispatchStartedAt = 0;
	const recordProcessed = (outcome, opts) => {
		messageAuditTerminal?.note(outcome, opts);
		if (diagnosticsEnabled) replyHotPathTiming.logIfSlow({
			channel,
			messageId,
			sessionKey,
			outcome,
			reason: opts?.reason
		});
		messageLifecycle.markProcessed(outcome, opts);
	};
	const recordAgentDispatchStarted = () => {
		if (!diagnosticsEnabled || agentDispatchStartedAt > 0) return;
		agentDispatchStartedAt = Date.now();
		logMessageDispatchStarted({
			channel,
			sessionKey: acpDispatchSessionKey,
			source: "replyResolver"
		});
	};
	const recordAgentDispatchCompleted = (outcome, opts) => {
		if (!diagnosticsEnabled || agentDispatchStartedAt <= 0) return;
		logMessageDispatchCompleted({
			channel,
			sessionKey: acpDispatchSessionKey,
			source: "replyResolver",
			durationMs: Date.now() - agentDispatchStartedAt,
			outcome,
			reason: opts?.reason,
			error: opts?.error
		});
	};
	const markProcessing = () => {
		messageLifecycle.markProcessing();
	};
	const markIdle = (reason) => {
		messageLifecycle.markIdle(reason);
	};
	const markInboundDedupeReplayUnsafe = () => {
		state.inboundDedupeReplayUnsafe = true;
	};
	const boundAcpDispatchSessionKey = resolveBoundAcpDispatchSessionKey({
		ctx,
		cfg
	});
	const acpDispatchSessionKey = boundAcpDispatchSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey;
	const sourceSessionKey = normalizeOptionalString(ctx.SessionKey);
	const dispatchOperationSessionKey = sourceSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey ?? acpDispatchSessionKey;
	const operationSessionStoreEntry = sourceSessionKey && initialSessionStoreEntry.sessionKey && sourceSessionKey !== initialSessionStoreEntry.sessionKey ? resolveSessionStoreLookup({
		...ctx,
		CommandTargetSessionKey: void 0
	}, cfg) : initialSessionStoreEntry;
	const initialDispatchReplyOperation = dispatchOperationSessionKey ? replyRunRegistry.get(dispatchOperationSessionKey) : void 0;
	if (params.replyOptions?.isHeartbeat === true && dispatchOperationSessionKey && initialDispatchReplyOperation) {
		messageAuditTerminal?.note("skipped", { reason: "reply-operation-active" });
		return {
			status: "complete",
			result: {
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			}
		};
	}
	const markProgress = () => {
		if (!canTrackSession || !sessionKey) return;
		markDiagnosticSessionProgress({ sessionKey });
		if (acpDispatchSessionKey && acpDispatchSessionKey !== sessionKey) markDiagnosticSessionProgress({ sessionKey: acpDispatchSessionKey });
	};
	const sessionStoreEntry = boundAcpDispatchSessionKey ? resolveSessionStoreLookup({
		...ctx,
		SessionKey: boundAcpDispatchSessionKey
	}, cfg) : initialSessionStoreEntry;
	let preparedSessionBinding = sessionStoreEntry.sessionKey && sessionStoreEntry.entry?.sessionId ? {
		sessionKey: sessionStoreEntry.sessionKey,
		sessionId: sessionStoreEntry.entry.sessionId,
		storePath: sessionStoreEntry.storePath
	} : void 0;
	let preparedOperationSessionBinding = operationSessionStoreEntry.sessionKey && operationSessionStoreEntry.entry?.sessionId ? {
		sessionKey: operationSessionStoreEntry.sessionKey,
		sessionId: operationSessionStoreEntry.entry.sessionId,
		storePath: operationSessionStoreEntry.storePath
	} : void 0;
	const sessionKeysMatch = (left, right) => Boolean(left && right && normalizeExplicitSessionKey(left, ctx) === normalizeExplicitSessionKey(right, ctx));
	const notePreparedSession = (binding) => {
		if (sessionKeysMatch(binding.sessionKey, sessionStoreEntry.sessionKey)) preparedSessionBinding = binding;
		if (sessionKeysMatch(binding.sessionKey, operationSessionStoreEntry.sessionKey)) preparedOperationSessionBinding = binding;
		params.replyOptions?.onSessionPrepared?.(binding);
	};
	const resolveOperationExpectedSessionId = () => preparedOperationSessionBinding?.sessionId ?? operationSessionStoreEntry.entry?.sessionId;
	const resolvePreparedTranscriptBinding = (mirrorSessionKey) => {
		if (!preparedSessionBinding || !sessionKeysMatch(mirrorSessionKey, preparedSessionBinding.sessionKey)) return;
		return preparedSessionBinding;
	};
	const sessionAgentId = resolveSessionAgentId({
		sessionKey: acpDispatchSessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const sessionAgentCfg = resolveAgentConfig(cfg, sessionAgentId);
	const verboseProgress = createShouldEmitVerboseProgress({
		agentId: sessionAgentId,
		sessionKey: acpDispatchSessionKey,
		storePath: sessionStoreEntry.storePath,
		initialExplicitLevel: sessionStoreEntry.entry?.verboseLevel,
		fallbackLevel: normalizeVerboseLevel(sessionStoreEntry.entry?.verboseLevel ?? sessionAgentCfg?.verboseDefault ?? cfg.agents?.defaults?.verboseDefault ?? "") ?? "off"
	});
	const shouldEmitVerboseProgress = verboseProgress.shouldEmit;
	const shouldEmitFullVerboseProgress = verboseProgress.shouldEmitFull;
	const replyRoute = resolveEffectiveReplyRoute({
		ctx,
		entry: sessionStoreEntry.entry
	});
	const routeThreadId = resolveRoutedDeliveryThreadId({
		ctx,
		sessionKey: acpDispatchSessionKey
	});
	const routeReplyThreadId = replyRoute.threadId ?? routeThreadId;
	const inboundAudio = hasInboundAudio(ctx);
	const sessionTtsAuto = normalizeTtsAutoMode(sessionStoreEntry.entry?.ttsAuto);
	const preparedReplyDispatchAgentId = boundAcpDispatchSessionKey ? resolveSessionAgentId({
		sessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	}) : sessionAgentId;
	const preparedReplyDispatchRuntime = params.usePublishedModelRuntime ? await traceReplyPhase("reply.load_prepared_dispatch_runtime", async () => {
		const { loadPublishedGatewayReplyDispatchRuntime } = await loadPreparedModelRuntime();
		return await loadPublishedGatewayReplyDispatchRuntime({ agentId: preparedReplyDispatchAgentId });
	}) : void 0;
	const workspaceDir = preparedReplyDispatchRuntime?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, sessionAgentId);
	const { completeDispatchReplyOperation, dispatchHookDispatcher, ensureDispatchReplyOperation, failDispatchReplyOperation, getAgentRunTerminalOutcome, getDispatchAbortOperation, getDispatchAbortSignal, getDispatchReplyOperation, getObservedReplyDelivery, getPreDispatchAbortSignal, getReplyOptions, isDispatchOperationAborted, isPreDispatchOperationAborted, markObservedReplyDelivery, releasePreDispatchLifecycleAdmission, runWithDispatchLifecycleAdmission, throwIfDispatchOperationAborted, trackDispatchLifecycleWork, turnLedger } = createDispatchReplyOperationCoordinator({
		ctx,
		dispatcher,
		dispatchOperationSessionKey,
		initialDispatchReplyOperation,
		messageAuditTerminal,
		operationSessionStoreEntry,
		replyOptions: normalizedParams.replyOptions,
		resolveOperationExpectedSessionId,
		routeThreadId
	});
	const maybeApplyTtsWithFinalizationLease = createFinalizationAwareTtsPayloadApplier({
		getReplyOperation: getDispatchReplyOperation,
		hasInboundAudio: () => inboundAudio || getDispatchReplyOperation()?.acceptedSteeredInboundAudio === true
	});
	const pluginRegistry = preparedReplyDispatchRuntime?.inboundPluginRegistry ?? await traceReplyPhase("reply.load_runtime_plugin_registry_handle", async () => {
		const { loadAgentRuntimePluginRegistryHandle } = await traceReplyPhase("reply.load_runtime_plugins", loadRuntimePlugins);
		return loadAgentRuntimePluginRegistryHandle({
			config: cfg,
			workspaceDir,
			allowGatewaySubagentBinding: true
		});
	});
	const hookRunner = getGlobalHookRunner();
	const timestamp = typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0;
	const messageIdForHook = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	const hookCtx = { ...ctx };
	const buildHookState = (sourceCtx) => {
		const nextHookContext = deriveInboundMessageHookContext(sourceCtx, { messageId: messageIdForHook });
		const inboundClaim = toPluginInboundClaimPair(nextHookContext, {
			commandAuthorized: typeof ctx.CommandAuthorized === "boolean" ? ctx.CommandAuthorized : void 0,
			wasMentioned: typeof ctx.WasMentioned === "boolean" ? ctx.WasMentioned : void 0
		});
		return {
			hookContext: nextHookContext,
			inboundClaimContext: inboundClaim.context,
			inboundClaimEvent: inboundClaim.event
		};
	};
	const hookState = buildHookState(hookCtx);
	const { isGroup, groupId } = hookState.hookContext;
	let hookMediaPrepared = false;
	let hookMediaMetadataStaged = false;
	const prepareHookMediaMetadata = async () => {
		if (hookMediaPrepared) return;
		hookMediaPrepared = true;
		if (await traceReplyPhase("reply.stage_remote_media_for_dispatch", () => stageRemoteInboundMediaIfNeeded({
			ctx: hookCtx,
			cfg,
			sessionKey: acpDispatchSessionKey,
			workspaceDir,
			remoteMediaMode: "cache"
		}))) {
			hookMediaMetadataStaged = true;
			Object.assign(hookState, buildHookState(hookCtx));
		}
	};
	const buildMessageReceivedHookContext = () => {
		const mediaRemoteHost = normalizeOptionalString(ctx.MediaRemoteHost);
		const { hookContext } = hookState;
		const hasUnstagedRemoteMediaMetadata = Boolean(hookContext.media?.length);
		if (hookMediaMetadataStaged || !mediaRemoteHost || !hasUnstagedRemoteMediaMetadata) return hookContext;
		const messageReceivedCtx = { ...hookCtx };
		stripLegacyMediaContextFields(messageReceivedCtx);
		delete messageReceivedCtx.media;
		return {
			...buildHookState(messageReceivedCtx).hookContext,
			mediaRemoteHost,
			mediaStagingPending: true,
			originalMedia: hookContext.media?.map((entry) => ({ ...entry })),
			originalMediaPath: hookContext.mediaPath,
			originalMediaUrl: hookContext.mediaUrl,
			originalMediaType: hookContext.mediaType,
			originalMediaPaths: hookContext.mediaPaths,
			originalMediaUrls: hookContext.mediaUrls,
			originalMediaTypes: hookContext.mediaTypes
		};
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			ctx,
			cfg,
			dispatcher,
			sessionKey,
			traceReplyPhase,
			recordProcessed,
			recordAgentDispatchStarted,
			recordAgentDispatchCompleted,
			markProcessing,
			markIdle,
			markInboundDedupeReplayUnsafe,
			acpDispatchSessionKey,
			markProgress,
			sessionStoreEntry,
			notePreparedSession,
			resolvePreparedTranscriptBinding,
			sessionAgentId,
			shouldEmitVerboseProgress,
			shouldEmitFullVerboseProgress,
			replyRoute,
			routeReplyThreadId,
			inboundAudio,
			sessionTtsAuto,
			workspaceDir,
			preparedReplyDispatchRuntime,
			pluginRegistry,
			replyOperationRunState,
			completeDispatchReplyOperation,
			dispatchHookDispatcher,
			ensureDispatchReplyOperation,
			failDispatchReplyOperation,
			getAgentRunTerminalOutcome,
			getDispatchAbortOperation,
			getDispatchAbortSignal,
			getDispatchReplyOperation,
			getObservedReplyDelivery,
			getPreDispatchAbortSignal,
			getReplyOptions,
			isDispatchOperationAborted,
			isPreDispatchOperationAborted,
			markObservedReplyDelivery,
			releasePreDispatchLifecycleAdmission,
			runWithDispatchLifecycleAdmission,
			throwIfDispatchOperationAborted,
			trackDispatchLifecycleWork,
			turnLedger,
			maybeApplyTtsWithFinalizationLease,
			hookRunner,
			timestamp,
			messageIdForHook,
			isGroup,
			groupId,
			hookState,
			prepareHookMediaMetadata,
			buildMessageReceivedHookContext
		})
	};
}
//#endregion
//#region src/auto-reply/reply/conversation-turn-capture.ts
const EPOCH_MILLISECONDS_THRESHOLD = 0xe8d4a51000;
const CONVERSATION_TURN_REPLY_CUSTOM_TYPE = "openclaw.conversation-turn-reply";
function readPersistedReplyText(message) {
	const content = message?.content;
	if (typeof content === "string") return normalizeOptionalString(content);
	if (!Array.isArray(content)) return;
	return normalizeOptionalString(content.flatMap((part) => {
		if (!part || typeof part !== "object") return [];
		const record = part;
		return record.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("\n"));
}
function normalizeTimestamp(value) {
	const timestamp = typeof value === "number" && Number.isFinite(value) ? value : void 0;
	if (timestamp === void 0 || timestamp <= 0) return;
	return asDateTimestampMs(timestamp < EPOCH_MILLISECONDS_THRESHOLD ? Math.trunc(timestamp * 1e3) : timestamp);
}
async function capturePendingConversationTurnReplyUnsafe(params) {
	if (params.ctx.InboundAccessAuthorized !== true) return false;
	const sessionKey = normalizeOptionalString(params.ctx.SessionKey);
	const messageId = normalizeOptionalString(params.ctx.MessageSidFull) ?? normalizeOptionalString(params.ctx.MessageSid) ?? normalizeOptionalString(params.ctx.MessageSidFirst) ?? normalizeOptionalString(params.ctx.MessageSidLast);
	const replyText = normalizeOptionalString(params.ctx.agentText);
	if (!sessionKey || !messageId || !replyText) return false;
	const conversation = conversationIdentityFromMsgContext({ ctx: params.ctx });
	if (!conversation) return false;
	const replyToId = normalizeOptionalString(params.ctx.ReplyToIdFull) ?? normalizeOptionalString(params.ctx.ReplyToId);
	const threadId = params.ctx.MessageThreadId == null ? void 0 : normalizeOptionalString(String(params.ctx.MessageThreadId));
	const agentId = normalizeOptionalString(params.ctx.AgentId) ?? resolveAgentIdFromSessionKey(sessionKey);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	const sessionEntry = loadSessionEntryReadOnly({
		agentId,
		sessionKey,
		storePath,
		readConsistency: "latest"
	});
	if (!sessionEntry) return false;
	const timestamp = normalizeTimestamp(params.ctx.Timestamp);
	const parentConversationRef = threadId ? conversation.parentConversationRef ?? buildConversationRef({
		channel: conversation.channel,
		accountId: conversation.accountId,
		kind: conversation.kind,
		peerId: conversation.peerId
	}) : void 0;
	const input = {
		text: replyText,
		timestamp,
		idempotencyKey: `conversation-inbound:${conversation.conversationRef}:${messageId}`,
		...params.ctx.InputProvenance ? { provenance: params.ctx.InputProvenance } : {},
		transport: {
			channel: conversation.channel,
			conversationRef: conversation.conversationRef,
			messageId,
			...replyToId ? { replyToId } : {},
			...threadId ? { threadId } : {}
		},
		sender: conversation.kind === "group" || conversation.kind === "channel" ? {
			id: normalizeOptionalString(params.ctx.SenderId),
			name: normalizeOptionalString(params.ctx.SenderName),
			username: normalizeOptionalString(params.ctx.SenderUsername)
		} : void 0
	};
	const claim = await claimPendingConversationTurnReply({
		agentId,
		conversationRef: conversation.conversationRef,
		...parentConversationRef ? { parentConversationRef } : {},
		sessionId: sessionEntry.sessionId,
		messageId,
		replyToId,
		threadId,
		text: replyText,
		timestamp
	});
	if (!claim) {
		if (replyToId) {
			const operation = findConversationTurnDeliveryByReplyTarget({
				agentId,
				storePath
			}, {
				conversationRef: conversation.conversationRef,
				replyToId
			}) ?? (parentConversationRef && parentConversationRef !== conversation.conversationRef ? findConversationTurnDeliveryByReplyTarget({
				agentId,
				storePath
			}, {
				conversationRef: parentConversationRef,
				replyToId
			}) : void 0);
			if (operation?.status === "replied" && operation.reply?.messageId === messageId) return true;
			if (operation && operation.status !== "replied") markConversationDeliverySent({
				agentId,
				storePath
			}, operation.operationId, replyToId);
		}
		return false;
	}
	try {
		if (sessionEntry.sessionId !== claim.sessionId) throw new Error(`session changed before captured reply persistence: ${sessionKey}`);
		const prepared = preparePersistedUserTurnMessageForTranscriptWrite(buildPersistedUserTurnMessage(input), {
			agentId,
			sessionKey,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		});
		if (!prepared) throw new Error("captured conversation turn reply was blocked before persistence");
		const persistedMessage = redactTranscriptMessage(prepared, params.cfg);
		const persistedReplyText = readPersistedReplyText(persistedMessage);
		if (!persistedReplyText) throw new Error("captured conversation turn reply has no persistable text");
		const artifactId = `conversation-turn-reply-${claim.turnId}`;
		markConversationDeliveryReplied({
			agentId,
			storePath
		}, {
			operationId: claim.turnId,
			reply: {
				messageId,
				...replyToId ? { replyToId } : {},
				...threadId ? { threadId } : {},
				text: persistedReplyText,
				timestamp: timestamp ?? Date.now()
			}
		});
		let persisted = false;
		try {
			const appendResult = appendTranscriptEventSync({
				agentId,
				sessionId: sessionEntry.sessionId,
				sessionKey,
				storePath
			}, {
				type: "custom",
				id: artifactId,
				customType: CONVERSATION_TURN_REPLY_CUSTOM_TYPE,
				appendMode: "side",
				timestamp: timestamp ?? Date.now(),
				data: {
					turnId: claim.turnId,
					conversationRef: conversation.conversationRef,
					messageId,
					...replyToId ? { replyToId } : {},
					...threadId ? { threadId } : {},
					message: persistedMessage
				}
			});
			persisted = appendResult.ok && appendResult.value;
			if (!appendResult.ok) logVerbose(`captured conversation turn reply audit persistence failed: ${appendResult.error.code}`);
		} catch (error) {
			logVerbose(`captured conversation turn reply audit persistence failed: ${String(error)}`);
		}
		if (!persisted) logVerbose("captured conversation turn reply audit artifact was not persisted");
		claim.complete(persisted ? { transcriptArtifactId: artifactId } : void 0);
		return true;
	} catch (error) {
		claim.release();
		logVerbose(`conversation turn reply capture failed: ${String(error)}`);
		return false;
	}
}
/** Consumes a correlated channel reply before it can start a second local agent turn. */
async function capturePendingConversationTurnReply(params) {
	try {
		return await capturePendingConversationTurnReplyUnsafe(params);
	} catch (error) {
		logVerbose(`conversation turn reply capture unavailable: ${String(error)}`);
		return false;
	}
}
//#endregion
//#region src/auto-reply/reply/inbound-dedupe.ts
const DEFAULT_INBOUND_DEDUPE_TTL_MS = 20 * 6e4;
const DEFAULT_INBOUND_DEDUPE_MAX = 5e3;
/**
* Keep inbound dedupe shared across bundled chunks so the same provider
* message cannot bypass dedupe by entering through a different chunk copy.
*/
const INBOUND_DEDUPE_CACHE_KEY = Symbol.for("openclaw.inboundDedupeCache");
const INBOUND_DEDUPE_INFLIGHT_KEY = Symbol.for("openclaw.inboundDedupeInflight");
const inboundDedupeCache = resolveGlobalDedupeCache(INBOUND_DEDUPE_CACHE_KEY, {
	ttlMs: DEFAULT_INBOUND_DEDUPE_TTL_MS,
	maxSize: DEFAULT_INBOUND_DEDUPE_MAX
});
const inboundDedupeInFlight = resolveGlobalSingleton(INBOUND_DEDUPE_INFLIGHT_KEY, () => /* @__PURE__ */ new Set());
const resolveInboundPeerId = (ctx) => ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? ctx.SessionKey;
function resolveInboundDedupeSessionScope(ctx) {
	const sessionKey = resolveCommandTurnTargetSessionKey(ctx) || normalizeOptionalString(ctx.SessionKey) || "";
	if (!sessionKey) return "";
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return sessionKey;
	return `agent:${parsed.agentId}`;
}
function buildInboundDedupeKey(ctx) {
	const provider = normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface) || "";
	const messageId = normalizeOptionalString(ctx.MessageSid);
	if (!provider || !messageId) return null;
	const peerId = resolveInboundPeerId(ctx);
	if (!peerId) return null;
	const sessionScope = resolveInboundDedupeSessionScope(ctx);
	const routeKey = channelRouteDedupeKey({
		channel: provider,
		to: peerId,
		accountId: normalizeOptionalString(ctx.AccountId) ?? "",
		threadId: ctx.MessageThreadId
	});
	return JSON.stringify([
		sessionScope,
		routeKey,
		messageId
	]);
}
function claimInboundDedupe(ctx, opts) {
	const key = buildInboundDedupeKey(ctx);
	if (!key) return { status: "invalid" };
	if ((opts?.cache ?? inboundDedupeCache).peek(key, opts?.now)) return {
		status: "duplicate",
		key
	};
	const inFlight = opts?.inFlight ?? inboundDedupeInFlight;
	if (inFlight.has(key)) return {
		status: "inflight",
		key
	};
	inFlight.add(key);
	return {
		status: "claimed",
		key
	};
}
function commitInboundDedupe(key, opts) {
	(opts?.cache ?? inboundDedupeCache).check(key, opts?.now);
	(opts?.inFlight ?? inboundDedupeInFlight).delete(key);
}
function releaseInboundDedupe(key, opts) {
	(opts?.inFlight ?? inboundDedupeInFlight).delete(key);
}
function resetInboundDedupe() {
	inboundDedupeCache.clear();
	inboundDedupeInFlight.clear();
}
//#endregion
//#region src/auto-reply/reply/message-received-hooks.ts
/** Emit observation hooks once for an accepted inbound turn, independent of reply dispatch. */
function emitMessageReceivedHooks(params) {
	if (params.ctx.SuppressMessageReceivedHooks === true) return;
	const buildContext = params.buildContext ?? (() => deriveInboundMessageHookContext(params.ctx, { messageId: params.ctx.MessageSidFull ?? params.ctx.MessageSid ?? params.ctx.MessageSidFirst ?? params.ctx.MessageSidLast }));
	if (params.hookRunner?.hasHooks("message_received") === true) {
		const context = buildContext();
		fireAndForgetHook(params.hookRunner.runMessageReceived(toPluginMessageReceivedEvent(context), toPluginMessageContext(context)), "message_received plugin hook failed");
	}
	if (params.sessionKey) {
		const context = buildContext();
		fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "received", params.sessionKey, {
			...toInternalMessageReceivedContext(context),
			timestamp: params.timestamp
		})), "message_received internal hook failed");
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-context.ts
async function prepareDispatchOperationContext(state) {
	const { acpDispatchSessionKey, buildMessageReceivedHookContext, cfg, ctx, dispatcher, hookRunner, isInternalWebchatTurn, markIdle, params, recordAgentDispatchCompleted, recordProcessed, replyRoute, sessionAgentId, sessionKey, sessionStoreEntry } = state;
	const sendBindingNotice = async (payload, mode, transcriptOwner) => {
		if (sourceReplyPolicy.suppressAutomaticSourceDelivery) return false;
		return await state.deliverBindingPayload(payload, mode, transcriptOwner);
	};
	const pluginBindingConversation = resolveConversationBindingContextFromMessage({
		cfg,
		ctx
	});
	const pluginOwnedBindingRecord = pluginBindingConversation ? resolveConversationBindingRecord({
		channel: pluginBindingConversation.channel,
		accountId: pluginBindingConversation.accountId,
		conversationId: pluginBindingConversation.conversationId,
		parentConversationId: pluginBindingConversation.parentConversationId
	}) : null;
	const pluginOwnedBinding = isPluginOwnedSessionBindingRecord(pluginOwnedBindingRecord) ? toPluginConversationBinding(pluginOwnedBindingRecord) : null;
	const pluginBindingSessionKey = normalizeOptionalString(pluginOwnedBindingRecord?.targetSessionKey);
	const persistPluginBindingUserTurn = async () => {
		const recorder = params.replyOptions?.userTurnTranscriptRecorder;
		if (!recorder || !pluginBindingSessionKey) return;
		const targetAgentId = resolveSessionAgentId({
			sessionKey: pluginBindingSessionKey,
			config: cfg,
			fallbackAgentId: ctx.AgentId
		});
		const blockedOwner = (expectedSessionId) => ({
			agentId: targetAgentId,
			sessionKey: pluginBindingSessionKey,
			...expectedSessionId ? { expectedSessionId } : {},
			transcriptWriteBlocked: true
		});
		if (recorder.hasPersisted()) return blockedOwner();
		let attemptedSessionId;
		let lastOwner;
		for (let attempt = 0; attempt < 2; attempt += 1) {
			const targetSessionStoreEntry = resolveSessionStoreLookup({
				...ctx,
				CommandTargetSessionKey: void 0,
				SessionKey: pluginBindingSessionKey
			}, cfg);
			const targetSessionEntry = targetSessionStoreEntry.entry;
			if (!targetSessionEntry || targetSessionEntry.sessionId === attemptedSessionId) break;
			attemptedSessionId = targetSessionEntry.sessionId;
			lastOwner = {
				agentId: targetAgentId,
				expectedSessionId: targetSessionEntry.sessionId,
				sessionKey: pluginBindingSessionKey
			};
			if (await recorder.persistApproved({
				target: {
					sessionId: targetSessionEntry.sessionId,
					sessionKey: pluginBindingSessionKey,
					sessionEntry: targetSessionEntry,
					...targetSessionStoreEntry.store ? { sessionStore: targetSessionStoreEntry.store } : {},
					storePath: targetSessionStoreEntry.storePath,
					agentId: targetAgentId,
					cwd: resolveAgentWorkspaceDir(cfg, targetAgentId),
					config: cfg
				},
				expectedSessionId: targetSessionEntry.sessionId,
				retryIfUnpersisted: true
			})) return lastOwner;
		}
		if (!lastOwner) {
			recorder.markBlocked();
			return blockedOwner();
		}
		recorder.markBlocked();
		logVerbose(`plugin-bound user-turn persistence skipped after the target session changed`);
		return blockedOwner(lastOwner.expectedSessionId);
	};
	const sendPolicy = resolveSendPolicy({
		cfg,
		entry: sessionStoreEntry.entry,
		sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
		channel: (state.shouldRouteToOriginating ? state.routeReplyChannel : void 0) ?? sessionDeliveryChannel(sessionStoreEntry.entry) ?? replyRoute.channel ?? ctx.Surface ?? ctx.Provider ?? void 0,
		chatType: sessionStoreEntry.entry?.chatType
	});
	const { globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: cfg,
		sessionKey: acpDispatchSessionKey,
		agentId: sessionAgentId
	});
	const chatType = normalizeChatType(ctx.ChatType);
	const silentReplyConversationType = resolveRoutedPolicyConversationType(ctx);
	const silentReplySurface = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider);
	const emptyFinalAllowedAsSilent = ctx.WasMentioned !== true && silentReplyConversationType !== void 0 && resolveSilentReplyPolicyFromPolicies({
		conversationType: silentReplyConversationType,
		defaultPolicy: cfg.agents?.defaults?.silentReply,
		surfacePolicy: silentReplySurface ? cfg.surfaces?.[silentReplySurface]?.silentReply : void 0
	}) === "allow";
	const { configuredVisibleReplies, harnessDefaultVisibleReplies } = resolveVisibleRepliesPolicy({
		cfg,
		chatType,
		ctx,
		entry: sessionStoreEntry.entry,
		sessionAgentId,
		sessionKey: acpDispatchSessionKey,
		sessionStore: sessionStoreEntry.store,
		turnModelOverride: resolveTurnModelOverride(params.replyOptions)
	});
	const effectiveVisibleReplies = configuredVisibleReplies ?? harnessDefaultVisibleReplies;
	const runtimeProfileAlsoAllow = params.replyOptions?.sourceReplyDeliveryMode === "message_tool_only" || ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn || params.replyOptions?.sourceReplyDeliveryMode === void 0 && !isExplicitSourceReplyCommand(ctx, cfg) && (configuredVisibleReplies === "message_tool" || !isInternalWebchatTurn && effectiveVisibleReplies === "message_tool") ? ["message"] : [];
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), [...profileAlsoAllow ?? [], ...runtimeProfileAlsoAllow]);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), [...providerProfileAlsoAllow ?? [], ...runtimeProfileAlsoAllow]);
	const groupResolution = resolveGroupSessionKey(ctx);
	const groupPolicy = resolveGroupToolPolicy({
		config: cfg,
		sessionKey: acpDispatchSessionKey,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		groupId: groupResolution?.id,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		accountId: ctx.AccountId,
		senderId: normalizeOptionalString(ctx.SenderId),
		senderName: normalizeOptionalString(ctx.SenderName),
		senderUsername: normalizeOptionalString(ctx.SenderUsername),
		senderE164: normalizeOptionalString(ctx.SenderE164)
	});
	const subagentStore = resolveSubagentCapabilityStore(acpDispatchSessionKey, { cfg });
	const messageToolAvailable = isToolAllowedByPolicies("message", [
		profilePolicy,
		providerProfilePolicy,
		globalProviderPolicy,
		agentProviderPolicy,
		globalPolicy,
		agentPolicy,
		groupPolicy,
		acpDispatchSessionKey && isSubagentEnvelopeSession(acpDispatchSessionKey, {
			cfg,
			store: subagentStore
		}) ? resolveSubagentToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore }) : void 0,
		resolveInheritedToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore })
	]);
	const sessionStableMessageToolAvailable = effectiveVisibleReplies === "message_tool" ? resolveStableMessageToolAvailability({
		cfg,
		ctx,
		sessionEntry: sessionStoreEntry.entry,
		sessionAgentId,
		sessionKey: acpDispatchSessionKey
	}) : void 0;
	const sourceReplyPolicyParams = {
		cfg,
		ctx,
		strictMessageToolOnly: ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn,
		sendPolicy,
		suppressAcpChildUserDelivery: state.suppressAcpChildUserDelivery,
		explicitSuppressTyping: params.replyOptions?.suppressTyping === true,
		shouldSuppressTyping: state.shouldSuppressTyping,
		messageToolAvailable,
		sessionStableMessageToolAvailable,
		isHeartbeat: params.replyOptions?.isHeartbeat
	};
	let sourceReplyPolicy = resolveSourceReplyVisibilityPolicy({
		...sourceReplyPolicyParams,
		requested: params.replyOptions?.sourceReplyDeliveryMode,
		defaultVisibleReplies: harnessDefaultVisibleReplies
	});
	const alternateHarnessDefault = harnessDefaultVisibleReplies === "message_tool" ? "automatic" : "message_tool";
	const sourceReplyDeliveryRuntimeOptions = {
		sourceReplyDeliveryModeOrigin: resolveSourceReplyVisibilityPolicy({
			...sourceReplyPolicyParams,
			requested: params.replyOptions?.sourceReplyDeliveryMode,
			defaultVisibleReplies: alternateHarnessDefault
		}).sourceReplyDeliveryMode === sourceReplyPolicy.sourceReplyDeliveryMode ? "stable_policy" : "runtime_default",
		onSourceReplyDeliveryModeResolved: (mode) => {
			const stableMode = sourceReplyPolicy.sessionStableSourceReplyDeliveryMode;
			sourceReplyPolicy = resolveSourceReplyVisibilityPolicy({
				...sourceReplyPolicyParams,
				requested: mode
			});
			sourceReplyPolicy.sessionStableSourceReplyDeliveryMode = stableMode;
			Object.assign(state, sourceReplyPolicy, { sourceReplyPolicy });
		}
	};
	Object.assign(sourceReplyPolicy, sourceReplyDeliveryRuntimeOptions);
	const { sourceReplyDeliveryMode, sessionStableSourceReplyDeliveryMode, suppressAutomaticSourceDelivery, suppressDelivery, sendPolicyDenied, deliverySuppressionReason, suppressHookUserDelivery, suppressHookReplyLifecycle } = sourceReplyPolicy;
	const reasoningPayloadsEnabled = params.replyOptions?.reasoningPayloadsEnabled === true;
	const commentaryPayloadsEnabled = params.replyOptions?.commentaryPayloadsEnabled === true;
	const attachSourceReplyDeliveryMode = (result) => sourceReplyPolicy.sourceReplyDeliveryMode === "message_tool_only" || sourceReplyPolicy.sendPolicyDenied ? {
		...result,
		...sourceReplyPolicy.sourceReplyDeliveryMode === "message_tool_only" ? { sourceReplyDeliveryMode: sourceReplyPolicy.sourceReplyDeliveryMode } : {},
		...sourceReplyPolicy.sendPolicyDenied ? { sendPolicyDenied: true } : {}
	} : result;
	const explicitCommandTurnCtx = isExplicitSourceReplyCommand(ctx, cfg);
	const unauthorizedTextSlashSourceReplyCtx = (chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(ctx);
	const noVisibleReplyFallbackDirected = explicitCommandTurnCtx || ctx.InboundEventKind !== "room_event" && (chatType === "direct" || ctx.WasMentioned === true);
	const shouldDeliverPluginBindingReply = !suppressAutomaticSourceDelivery || explicitCommandTurnCtx || ctx.InboundEventKind !== "room_event" && !unauthorizedTextSlashSourceReplyCtx;
	const durableSourceTurnId = readChannelSourceTurnId(ctx) ?? (shouldMintChannelSourceTurnId(ctx.Provider ?? ctx.Surface) ? buildChannelSourceTurnId({
		provider: resolveOriginMessageProvider({
			originatingChannel: replyRoute.channel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		accountId: replyRoute.accountId,
		conversationId: replyRoute.to,
		messageId: normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid)
	}) : void 0);
	setChannelSourceTurnId(ctx, durableSourceTurnId);
	if (isDuplicateRestartRecoverySource(sessionStoreEntry.entry, durableSourceTurnId)) {
		recordProcessed("skipped", { reason: "duplicate" });
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			})
		};
	}
	const inboundDedupeClaim = claimInboundDedupe(ctx);
	if (inboundDedupeClaim.status === "duplicate" || inboundDedupeClaim.status === "inflight") {
		recordProcessed("skipped", { reason: "duplicate" });
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			})
		};
	}
	const commitInboundDedupeIfClaimed = () => {
		if (inboundDedupeClaim.status === "claimed") commitInboundDedupe(inboundDedupeClaim.key);
	};
	const releaseInboundDedupeIfClaimed = () => {
		if (inboundDedupeClaim.status === "claimed") releaseInboundDedupe(inboundDedupeClaim.key);
	};
	const finishReplyOperationBusyDispatch = (opts) => {
		state.releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(dispatcher));
		if (opts?.recordAgentDispatchCompleted) recordAgentDispatchCompleted("completed", { reason: "reply-operation-active" });
		recordProcessed("skipped", { reason: "reply-operation-active" });
		markIdle("message_completed");
		if (opts?.dedupeDisposition === "release") releaseInboundDedupeIfClaimed();
		else commitInboundDedupeIfClaimed();
		return attachSourceReplyDeliveryMode({
			queuedFinal: false,
			counts: dispatcher.getQueuedCounts(),
			...opts?.sessionMetadataChanges ? { sessionMetadataChanges: opts.sessionMetadataChanges } : {}
		});
	};
	const finishReplyOperationAbortedDispatch = () => {
		const operation = state.getDispatchReplyOperation();
		const queuedFinal = operation?.result?.kind === "failed" && operation.result.code === "run_stalled" && (operation.staleExpiryReason === "no_activity" || operation.staleExpiryReason === "stuck_recovery") ? dispatcher.sendFinalReply({
			text: "⚠️ This turn was interrupted because it stopped making progress. Please try again.",
			isError: true
		}) : false;
		commitInboundDedupeIfClaimed();
		recordProcessed("completed", { reason: "reply_operation_aborted" });
		markIdle("message_completed");
		state.completeDispatchReplyOperation();
		return attachSourceReplyDeliveryMode({
			queuedFinal,
			counts: dispatcher.getQueuedCounts()
		});
	};
	const bindingState = {};
	const emitMessageReceivedHooks$1 = () => {
		emitMessageReceivedHooks({
			ctx,
			hookRunner,
			sessionKey,
			timestamp: state.timestamp,
			buildContext: buildMessageReceivedHookContext
		});
	};
	state.markProcessing();
	if (await capturePendingConversationTurnReply({
		cfg,
		ctx
	})) {
		emitMessageReceivedHooks$1();
		commitInboundDedupeIfClaimed();
		recordProcessed("completed", { reason: "conversation-turn-reply" });
		markIdle("message_completed");
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts(),
				observedReplyDelivery: true
			})
		};
	}
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			sendBindingNotice,
			pluginOwnedBinding,
			persistPluginBindingUserTurn,
			sendPolicy,
			chatType,
			emptyFinalAllowedAsSilent,
			noVisibleReplyFallbackDirected,
			sourceReplyPolicy,
			sourceReplyDeliveryRuntimeOptions,
			sourceReplyDeliveryMode,
			sessionStableSourceReplyDeliveryMode,
			suppressAutomaticSourceDelivery,
			suppressDelivery,
			sendPolicyDenied,
			deliverySuppressionReason,
			suppressHookUserDelivery,
			suppressHookReplyLifecycle,
			reasoningPayloadsEnabled,
			commentaryPayloadsEnabled,
			attachSourceReplyDeliveryMode,
			explicitCommandTurnCtx,
			shouldDeliverPluginBindingReply,
			inboundDedupeClaim,
			commitInboundDedupeIfClaimed,
			finishReplyOperationBusyDispatch,
			finishReplyOperationAbortedDispatch,
			emitMessageReceivedHooks: emitMessageReceivedHooks$1,
			bindingState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/routing-policy.ts
/** Resolves whether replies should route to the originating channel or current surface. */
/** Computes source-routing and typing suppression for a reply turn. */
function resolveReplyRoutingDecision(params) {
	const originatingChannel = normalizeMessageChannel(params.originatingChannel);
	const providerChannel = normalizeMessageChannel(params.provider);
	const surfaceChannel = normalizeMessageChannel(params.surface);
	const currentSurface = providerChannel ?? surfaceChannel;
	const isInternalWebchatTurn = currentSurface === "webchat" && (surfaceChannel === "webchat" || !surfaceChannel) && params.explicitDeliverRoute !== true;
	const shouldRouteToOriginating = Boolean(!params.suppressDirectUserDelivery && !isInternalWebchatTurn && params.isRoutableChannel(originatingChannel) && params.originatingTo && originatingChannel !== currentSurface);
	return {
		originatingChannel,
		currentSurface,
		isInternalWebchatTurn,
		shouldRouteToOriginating,
		shouldSuppressTyping: params.suppressDirectUserDelivery === true || shouldRouteToOriginating || originatingChannel === "webchat"
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-delivery.ts
async function prepareDispatchDelivery(state) {
	const { cfg, ctx, groupId, markInboundDedupeReplayUnsafe, replyRoute, sessionStoreEntry, turnLedger } = state;
	const sessionAcpMeta = sessionStoreEntry.sessionKey ? readAcpSessionMeta({ sessionKey: sessionStoreEntry.sessionKey }) : void 0;
	const suppressAcpChildUserDelivery = isParentOwnedBackgroundAcpSession(sessionAcpMeta && sessionStoreEntry.entry ? {
		...sessionStoreEntry.entry,
		acp: sessionAcpMeta
	} : sessionStoreEntry.entry);
	const normalizedRouteReplyChannel = normalizeMessageChannel(replyRoute.channel);
	const normalizedProviderChannel = normalizeMessageChannel(ctx.Provider);
	const normalizedSurfaceChannel = normalizeMessageChannel(ctx.Surface);
	const normalizedCurrentSurface = normalizedProviderChannel ?? normalizedSurfaceChannel;
	const effectiveExplicitDeliverRoute = ctx.ExplicitDeliverRoute === true || replyRoute.inheritedExternalRoute === true;
	const isInternalWebchatTurn = normalizedCurrentSurface === "webchat" && (normalizedSurfaceChannel === "webchat" || !normalizedSurfaceChannel) && !effectiveExplicitDeliverRoute;
	const routeReplyRuntime = Boolean(!suppressAcpChildUserDelivery && !isInternalWebchatTurn && normalizedRouteReplyChannel && replyRoute.to && normalizedRouteReplyChannel !== normalizedCurrentSurface) ? await loadRouteReplyRuntime() : void 0;
	const { originatingChannel: routeReplyChannel, currentSurface, shouldRouteToOriginating, shouldSuppressTyping } = resolveReplyRoutingDecision({
		provider: ctx.Provider,
		surface: ctx.Surface,
		explicitDeliverRoute: effectiveExplicitDeliverRoute,
		originatingChannel: replyRoute.channel,
		originatingTo: replyRoute.to,
		suppressDirectUserDelivery: suppressAcpChildUserDelivery,
		isRoutableChannel: routeReplyRuntime?.isRoutableChannel ?? (() => false)
	});
	const routeReplyTo = replyRoute.to;
	const deliveryChannel = shouldRouteToOriginating ? routeReplyChannel : currentSurface;
	const shouldPrepareRoutedReplyDelivery = shouldRouteToOriginating && Boolean(routeReplyChannel);
	const replyContextAccountId = routeReplyChannel ? resolveReplyDeliveryAccountId(cfg, routeReplyChannel, replyRoute.accountId) : void 0;
	const routedReplyAccountId = shouldPrepareRoutedReplyDelivery ? replyContextAccountId : void 0;
	const routedReplyDelivery = shouldPrepareRoutedReplyDelivery ? createReplyDeliveryContext(resolveReplyToMode(cfg, routeReplyChannel, routedReplyAccountId, replyRoute.chatType), replyRoute.chatType) : void 0;
	let normalizeReplyMediaPaths;
	const getNormalizeReplyMediaPaths = async () => {
		if (normalizeReplyMediaPaths) return normalizeReplyMediaPaths;
		const { createReplyMediaPathNormalizer } = await loadReplyMediaPathsRuntime();
		normalizeReplyMediaPaths = createReplyMediaPathNormalizer({
			cfg,
			sessionKey: state.acpDispatchSessionKey,
			workspaceDir: state.workspaceDir,
			messageProvider: deliveryChannel,
			accountId: replyContextAccountId,
			groupId,
			groupChannel: ctx.GroupChannel,
			groupSpace: ctx.GroupSpace,
			requesterSenderId: ctx.SenderId,
			requesterSenderName: ctx.SenderName,
			requesterSenderUsername: ctx.SenderUsername,
			requesterSenderE164: ctx.SenderE164
		});
		return normalizeReplyMediaPaths;
	};
	const normalizeReplyMediaPayload = async (payload) => {
		if (!resolveSendableOutboundReplyParts(payload).hasMedia) return payload;
		return await (await getNormalizeReplyMediaPaths())(payload);
	};
	const routeReplyToOriginating = async (payload, options) => {
		if (!shouldRouteToOriginating || !routeReplyChannel || !routeReplyTo || !routeReplyRuntime) return null;
		markInboundDedupeReplayUnsafe();
		const agentRuntimeSessionKey = options?.sessionKey ?? (ctx.CommandSource === "native" ? resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey : ctx.SessionKey);
		const result = await routeReplyRuntime.routeReply({
			payload,
			channel: routeReplyChannel,
			to: routeReplyTo,
			sessionKey: agentRuntimeSessionKey,
			policySessionKey: options?.sessionKey ?? resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey,
			policyConversationType: resolveRoutedPolicyConversationType(ctx),
			accountId: routedReplyAccountId,
			requesterSenderId: ctx.SenderId,
			requesterSenderName: ctx.SenderName,
			requesterSenderUsername: ctx.SenderUsername,
			requesterSenderE164: ctx.SenderE164,
			threadId: state.routeReplyThreadId,
			replyDelivery: routedReplyDelivery,
			cfg,
			abortSignal: options?.abortSignal,
			mirror: options?.mirror,
			isGroup: state.isGroup,
			groupId,
			replyKind: options?.kind ?? "final",
			runId: state.params.replyOptions?.runId,
			responsePrefixContext: options?.responsePrefixContext
		});
		turnLedger.recordRoutedDelivery(payload, isRoutedReplyDelivered(result));
		return result;
	};
	const isRoutedReplyDelivered = (result) => result.delivered;
	/**
	* Helper to send a payload via route-reply (async).
	* Only used when actually routing to a different provider.
	* Note: Only called when shouldRouteToOriginating is true, so
	* routeReplyChannel and routeReplyTo are guaranteed to be defined.
	*/
	const sendPayloadAsync = async (payload, abortSignal, mirror, kind = "tool") => {
		if (!routeReplyRuntime || !routeReplyChannel || !routeReplyTo) return null;
		const effectiveAbortSignal = abortSignal ?? state.getDispatchAbortSignal();
		if (effectiveAbortSignal?.aborted) return null;
		const result = await routeReplyToOriginating(payload, {
			abortSignal: effectiveAbortSignal,
			mirror,
			kind
		});
		if (result && !result.ok) logVerbose(`dispatch-from-config: route-reply failed: ${result.error ?? "unknown error"}`);
		return result;
	};
	const deliverBindingPayload = async (payload, mode, transcriptOwner) => {
		const bindingPayload = setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, { ...payload }), { sourceReplyTranscriptMirror: transcriptOwner ? {
			sessionKey: transcriptOwner.sessionKey,
			agentId: transcriptOwner.agentId,
			...transcriptOwner.expectedSessionId ? { expectedSessionId: transcriptOwner.expectedSessionId } : {},
			...transcriptOwner.transcriptWriteBlocked ? { transcriptWriteBlocked: true } : {}
		} : void 0 });
		const result = await routeReplyToOriginating(bindingPayload, {
			kind: mode === "terminal" ? "final" : "tool",
			sessionKey: transcriptOwner?.sessionKey
		});
		if (result) {
			if (!result.ok) logVerbose(`dispatch-from-config: route-reply (plugin binding notice) failed: ${result.error ?? "unknown error"}`);
			return result.delivered || result.suppressed === true;
		}
		markInboundDedupeReplayUnsafe();
		return mode === "additive" ? turnLedger.sendQueued("tool", bindingPayload).queued : turnLedger.sendQueued("final", bindingPayload).queued;
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			suppressAcpChildUserDelivery,
			normalizedCurrentSurface,
			isInternalWebchatTurn,
			routeReplyChannel,
			shouldRouteToOriginating,
			shouldSuppressTyping,
			routeReplyTo,
			deliveryChannel,
			replyContextAccountId,
			normalizeReplyMediaPayload,
			routeReplyToOriginating,
			isRoutedReplyDelivered,
			sendPayloadAsync,
			deliverBindingPayload
		})
	};
}
//#endregion
//#region src/channels/plugins/exec-approval-local.ts
function shouldSuppressLocalExecApprovalPrompt(params) {
	const channel = params.channel ? normalizeChannelId(params.channel) : null;
	if (!channel) return false;
	return getChannelPlugin(channel)?.outbound?.shouldSuppressLocalPayloadPrompt?.({
		cfg: params.cfg,
		accountId: params.accountId,
		payload: params.payload,
		hint: {
			kind: "approval-pending",
			approvalKind: "exec",
			nativeRouteActive: getGatewayNativeApprovalRuntime()?.routeCoordinator.hasActiveRuntime({
				channel,
				accountId: params.accountId,
				approvalKind: "exec"
			}) ?? hasActiveApprovalNativeRouteRuntime({
				channel,
				accountId: params.accountId,
				approvalKind: "exec"
			})
		}
	}) ?? false;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-execution.ts
async function prepareDispatchExecution(state) {
	const { cfg, ctx, dispatcher, isDispatchOperationAborted, markInboundDedupeReplayUnsafe, markProgress, noteCommentaryProgress, params, sendPayloadAsync, sessionKey, shouldEmitVerboseProgress, shouldRouteToOriginating, shouldSendToolSummaries, shouldSendVerboseProgressMessages, turnLedger } = state;
	if (state.suppressDelivery) logVerbose(`Delivery suppressed by ${state.deliverySuppressionReason} for session ${state.sessionStoreEntry.sessionKey ?? sessionKey ?? "unknown"} — agent will still process the message`);
	let didSendPlanStatusNotice = false;
	const formatPlanUpdateText = (payload) => {
		const explanation = payload.explanation?.replace(/\s+/g, " ").trim();
		const steps = (payload.steps ?? []).map((entry) => ({
			step: entry.step.replace(/\s+/g, " ").trim(),
			status: entry.status
		})).filter((entry) => entry.step);
		if (steps.length > 0) return formatPlanChecklistLines(steps, {
			maxLines: steps.length,
			maxLineChars: 120
		}).join("\n");
		return explanation || "Planning next steps.";
	};
	const sendPlanUpdate = async (payload) => {
		if (shouldSuppressProgressDelivery() || !shouldSendVerboseProgressMessages() || didSendPlanStatusNotice) return;
		didSendPlanStatusNotice = true;
		const replyPayload = {
			text: formatPlanUpdateText(payload),
			isStatusNotice: true
		};
		if (shouldRouteToOriginating) {
			await sendPayloadAsync(replyPayload, void 0, false);
			return;
		}
		markInboundDedupeReplayUnsafe();
		turnLedger.sendQueued("tool", replyPayload);
	};
	const progressState = {
		accumulatedBlockText: "",
		accumulatedBlockTtsText: "",
		acceptedReplyPayload: false,
		blockCount: 0,
		channelTransformSuppressed: false,
		hasPendingDirectBlockReplyDelivery: false,
		progressCallbackStartTail: Promise.resolve()
	};
	const cleanBlockTtsDirectiveText = shouldCleanTtsDirectiveText({
		cfg,
		ttsAuto: state.sessionTtsAuto,
		agentId: state.sessionAgentId,
		channelId: state.deliveryChannel,
		accountId: state.replyRoute.accountId
	}) ? createTtsDirectiveTextStreamCleaner() : void 0;
	const resolveToolDeliveryPayload = (payload) => {
		if (shouldSuppressLocalExecApprovalPrompt({
			channel: normalizeMessageChannel(ctx.Surface ?? ctx.Provider),
			cfg,
			accountId: ctx.AccountId,
			payload
		})) return null;
		if (shouldSendToolSummaries()) return payload;
		if (hasExecApprovalPayload(payload) || hasExecApprovalUnavailablePayload(payload)) return payload;
		if (hasAskUserPayload(payload)) return payload;
		if (isFastModeAutoProgressPayload(payload)) return payload;
		if (!resolveSendableOutboundReplyParts(payload).hasMedia) return null;
		return {
			...payload,
			text: void 0
		};
	};
	const typing = resolveRunTypingPolicy({
		requestedPolicy: params.replyOptions?.typingPolicy,
		suppressTyping: state.sourceReplyPolicy.suppressTyping,
		originatingChannel: state.routeReplyChannel,
		systemEvent: shouldRouteToOriginating
	});
	const shouldSuppressProgressDelivery = () => state.sendPolicyDenied || state.suppressDelivery && !state.shouldDeliverVerboseProgressDespiteSourceSuppression();
	const hasVisibleRegularVerboseToolProgress = () => shouldEmitVerboseProgress() && !state.shouldEmitFullVerboseProgress() && shouldSendVerboseProgressMessages() && ctx.InboundEventKind !== "room_event" && !shouldSuppressProgressDelivery();
	let observedVisibleToolErrorProgress = false;
	const markVisibleToolErrorProgress = () => {
		if (hasVisibleRegularVerboseToolProgress()) observedVisibleToolErrorProgress = true;
	};
	const hasFailedProgressStatus = (payload) => payload.phase === "error" || payload.status === "failed" || payload.status === "error" || typeof payload.exitCode === "number" && payload.exitCode !== 0;
	const shouldSuppressToolErrorWarnings = () => {
		if (params.replyOptions?.suppressToolErrorWarnings !== void 0) return params.replyOptions.suppressToolErrorWarnings;
		if (!shouldEmitVerboseProgress()) return false;
		return observedVisibleToolErrorProgress ? true : void 0;
	};
	const suppressToolErrorWarnings = params.replyOptions?.suppressToolErrorWarnings ?? (observedVisibleToolErrorProgress ? true : void 0);
	const onToolResultFromReplyOptions = params.replyOptions?.onToolResult;
	const onPlanUpdateFromReplyOptions = params.replyOptions?.onPlanUpdate;
	const onApprovalEventFromReplyOptions = params.replyOptions?.onApprovalEvent;
	const onPatchSummaryFromReplyOptions = params.replyOptions?.onPatchSummary;
	const allowSuppressedSourceProgressCallbacks = params.replyOptions?.allowProgressCallbacksWhenSourceDeliverySuppressed === true;
	const shouldAllowQuietChannelOwnedProgressCallbacks = (options) => options?.requiresToolSummaryVisibility === true && (params.replyOptions?.suppressDefaultToolProgressMessages === true || options.allowWhenToolSummariesHidden === true);
	const waitForPendingDirectBlockReplyDelivery = async (abortSignal) => {
		if (!progressState.hasPendingDirectBlockReplyDelivery) return;
		progressState.hasPendingDirectBlockReplyDelivery = false;
		await waitForReplyDispatcherIdle(dispatcher, abortSignal);
	};
	const shouldForwardProgressCallback = (options) => {
		if (options?.requiresToolSummaryVisibility === true && !shouldSendToolSummaries() && !shouldAllowQuietChannelOwnedProgressCallbacks(options)) return false;
		return !state.suppressAutomaticSourceDelivery || allowSuppressedSourceProgressCallbacks && !state.sendPolicyDenied && options?.forwardWhenSourceDeliverySuppressed === true;
	};
	const preserveProgressCallbackStartOrder = params.replyOptions?.preserveProgressCallbackStartOrder === true;
	const reserveProgressCallbackStart = () => {
		const previousStart = progressState.progressCallbackStartTail;
		let releaseStart;
		progressState.progressCallbackStartTail = new Promise((resolve) => {
			releaseStart = resolve;
		});
		return {
			previousStart,
			releaseStart: () => releaseStart?.()
		};
	};
	const wrapProgressCallback = (callback, options) => {
		if (!callback) return;
		const runProgressCallback = async (args, noteCallbackStarted) => {
			try {
				if (isDispatchOperationAborted()) return;
				state.getDispatchReplyOperation()?.recordActivity();
				markProgress();
				if (options?.waitForDirectBlockReplyDelivery) {
					await waitForPendingDirectBlockReplyDelivery(state.getDispatchAbortOperation()?.abortSignal);
					if (isDispatchOperationAborted()) return;
				}
				if (shouldForwardProgressCallback(options)) {
					if (preserveProgressCallbackStartOrder && options?.onForward) await options.onForward(...args);
					else if (!preserveProgressCallbackStartOrder) await options?.onForward?.(...args);
					const callbackResult = callback(...args);
					noteCallbackStarted();
					const result = await callbackResult;
					if (result === false) return result;
					await options?.onVisible?.(...args);
				}
				return;
			} finally {
				noteCallbackStarted();
			}
		};
		return (...args) => {
			if (!preserveProgressCallbackStartOrder) return runProgressCallback(args, () => void 0);
			const start = reserveProgressCallbackStart();
			return (async () => {
				await start.previousStart;
				return await runProgressCallback(args, start.releaseStart);
			})();
		};
	};
	const deliverStandaloneCommentaryProgress = shouldEmitVerboseProgress();
	const itemEventForwardingOptions = {
		forwardWhenSourceDeliverySuppressed: true,
		requiresToolSummaryVisibility: true
	};
	const canForwardItemEvents = Boolean(params.replyOptions?.onItemEvent);
	const canForwardSuppressedSourceItemEvents = allowSuppressedSourceProgressCallbacks && !state.sendPolicyDenied && Boolean(params.replyOptions?.onItemEvent);
	const shouldDeliverDurableCommentaryProgress = (payload) => deliverStandaloneCommentaryProgress && payload.kind === "preamble" && payload.suppressDurableProgress !== true;
	const forwardItemEvent = canForwardItemEvents ? wrapProgressCallback(params.replyOptions?.onItemEvent, {
		...itemEventForwardingOptions,
		waitForDirectBlockReplyDelivery: true,
		onForward: (payload) => preserveProgressCallbackStartOrder && shouldDeliverDurableCommentaryProgress(payload) ? noteCommentaryProgress(payload) : void 0,
		onVisible: (payload) => {
			if (hasFailedProgressStatus(payload)) markVisibleToolErrorProgress();
		}
	}) : void 0;
	const canCaptureCliPreambleEvents = Boolean(params.replyOptions?.onItemEvent) && shouldBridgeCliPreambleEvents(params.replyOptions);
	const onItemEvent = deliverStandaloneCommentaryProgress || canForwardItemEvents || canCaptureCliPreambleEvents ? async (payload) => {
		if (isDispatchOperationAborted()) return;
		if (!forwardItemEvent && deliverStandaloneCommentaryProgress) markProgress();
		if ((!forwardItemEvent || !preserveProgressCallbackStartOrder) && shouldDeliverDurableCommentaryProgress(payload)) await noteCommentaryProgress(payload);
		return await forwardItemEvent?.(payload);
	} : void 0;
	const resolveVerboseProgressVisibility = () => deliverStandaloneCommentaryProgress && shouldSendVerboseProgressMessages() && !shouldSuppressProgressDelivery();
	const { commentaryPayloadsEnabled } = resolveTurnCommentaryProgressOwner({
		commentaryPayloadsEnabled: state.commentaryPayloadsEnabled,
		options: params.replyOptions,
		resolveVerboseProgressVisibility
	});
	const replyResolver = params.replyResolver ?? (await state.traceReplyPhase("reply.load_reply_resolver", () => loadGetReplyFromConfigRuntime())).getReplyFromConfig;
	const runtimeReplyConfig = state.preparedReplyDispatchRuntime?.config ?? cfg;
	const replyConfig = withFullRuntimeReplyConfig(params.configOverride ? applyMergePatch(runtimeReplyConfig, params.configOverride) : runtimeReplyConfig);
	state.recordAgentDispatchStarted();
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			sendPlanUpdate,
			cleanBlockTtsDirectiveText,
			resolveToolDeliveryPayload,
			typing,
			shouldSuppressProgressDelivery,
			markVisibleToolErrorProgress,
			hasFailedProgressStatus,
			shouldSuppressToolErrorWarnings,
			suppressToolErrorWarnings,
			onToolResultFromReplyOptions,
			onPlanUpdateFromReplyOptions,
			onApprovalEventFromReplyOptions,
			onPatchSummaryFromReplyOptions,
			waitForPendingDirectBlockReplyDelivery,
			shouldForwardProgressCallback,
			preserveProgressCallbackStartOrder,
			wrapProgressCallback,
			deliverStandaloneCommentaryProgress,
			canForwardSuppressedSourceItemEvents,
			onItemEvent,
			commentaryPayloadsEnabled,
			replyResolver,
			replyConfig,
			progressState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.plugin-binding.ts
function shouldBypassPluginOwnedBindingForCommand(ctx, cfg, replyOptions) {
	if (ctx.CommandAuthorized !== void 0 && typeof ctx.CommandAuthorized !== "boolean") return false;
	const commandTurn = resolveCommandTurnContext(ctx);
	if ((commandTurn.kind === "native" || commandTurn.kind === "text-slash") && !commandTurn.authorized) return false;
	if (isNativeCommandTurn(commandTurn) && commandTurn.authorized) return true;
	if (!(commandTurn.kind === "text-slash" && commandTurn.authorized || commandTurn.kind === "normal" && typeof ctx.CommandAuthorized === "boolean" && ctx.CommandAuthorized) || !shouldHandleTextCommands({
		cfg,
		surface: ctx.Surface ?? ctx.Provider ?? "",
		commandSource: ctx.CommandSource
	})) return false;
	const commandBody = normalizeCommandBody(commandTurn.body ?? resolveCommandContextText(ctx), { botUsername: ctx.BotUsername });
	if (!commandBody.startsWith("/")) return false;
	if (replyOptions?.[PLUGIN_COMMAND_DISPATCH]) return true;
	const channel = normalizeOptionalString(ctx.Surface ?? ctx.Provider) ?? "";
	const match = matchPluginCommandInvocation(createPluginCommandRuntime(), commandBody, { channel });
	if (match) {
		if (replyOptions) replyOptions[PLUGIN_COMMAND_DISPATCH] = match.dispatch;
		return true;
	}
	if (!isExplicitSourceReplyCommand(ctx, cfg)) return false;
	if (resolveTextCommand(commandBody)) return true;
	const provider = normalizeOptionalString(ctx.Provider ?? ctx.Surface);
	if (commandTurn.commandName && findCommandByNativeName(commandTurn.commandName, provider, { includeBundledChannelFallback: true })) return true;
	return false;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-operation.ts
async function prepareDispatchOperation(state) {
	const { attachSourceReplyDeliveryMode, cfg, chatType, commitInboundDedupeIfClaimed, completeDispatchReplyOperation, ctx, deliverySuppressionReason, dispatcher, emitMessageReceivedHooks, finishReplyOperationAbortedDispatch, hookRunner, isPreDispatchOperationAborted, markIdle, params, persistPluginBindingUserTurn, pluginOwnedBinding, recordProcessed, sendBindingNotice, sessionAgentId, sessionKey, sessionStoreEntry, suppressDelivery } = state;
	const abortRuntime = params.fastAbortResolver ? null : await loadAbortRuntime();
	const fastAbortResolver = params.fastAbortResolver ?? abortRuntime?.tryFastAbortFromMessage;
	const formatAbortReplyTextResolver = params.formatAbortReplyTextResolver ?? abortRuntime?.formatAbortReplyText;
	if (!fastAbortResolver || !formatAbortReplyTextResolver) throw new Error("abort runtime unavailable");
	const finishFastCommand = async (fast) => {
		if (pluginOwnedBinding) touchConversationBindingRecord(pluginOwnedBinding.bindingId);
		emitMessageReceivedHooks();
		let queuedFinal = false;
		let routedFinalCount = 0;
		if (!suppressDelivery && fast.payload) {
			const selectedModel = resolveSessionModelRef(cfg, sessionStoreEntry.entry, sessionAgentId);
			const modelSelection = {
				...selectedModel,
				thinkLevel: sessionStoreEntry.entry?.thinkingLevel
			};
			const responsePrefixContext = {
				identityName: normalizeOptionalString(resolveAgentIdentity(cfg, sessionAgentId)?.name),
				provider: selectedModel.provider,
				model: extractShortModelName(selectedModel.model),
				modelFull: `${selectedModel.provider}/${selectedModel.model}`,
				thinkingLevel: modelSelection.thinkLevel ?? "off"
			};
			const result = await state.routeReplyToOriginating(fast.payload, { responsePrefixContext });
			if (result) {
				queuedFinal = result.ok;
				if (state.isRoutedReplyDelivered(result)) routedFinalCount += 1;
				if (!result.ok) logVerbose(`dispatch-from-config: route-reply (${fast.logKind}) failed: ${result.error ?? "unknown error"}`);
			} else {
				state.markInboundDedupeReplayUnsafe();
				params.replyOptions?.onModelSelected?.(modelSelection);
				queuedFinal = dispatcher.sendFinalReply(fast.payload);
			}
		} else if (suppressDelivery) logVerbose(`dispatch-from-config: ${fast.logKind} reply suppressed by ${deliverySuppressionReason} (session=${sessionKey ?? "unknown"})`);
		const counts = dispatcher.getQueuedCounts();
		counts.final += routedFinalCount;
		recordProcessed("completed", { reason: fast.reason });
		markIdle("message_completed");
		commitInboundDedupeIfClaimed();
		completeDispatchReplyOperation();
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal,
				counts
			})
		};
	};
	const fastAbort = await fastAbortResolver({
		ctx,
		cfg
	});
	if (fastAbort.handled) return await finishFastCommand({
		payload: { text: formatAbortReplyTextResolver(fastAbort.stoppedSubagents, fastAbort.rejectionReason, fastAbort.failedSubagents) },
		reason: "fast_abort",
		logKind: "fast_abort"
	});
	if (/^\s*\/approve(?:@[^\s]+)?(?:\s|$)/i.test(ctx.commandText)) {
		const fastApprove = await (await loadFastApproveRuntime()).tryFastApproveFromMessage({
			ctx,
			cfg,
			agentId: sessionAgentId,
			sessionKey
		});
		if (fastApprove.handled) return await finishFastCommand({
			...fastApprove.reply ? { payload: fastApprove.reply } : {},
			reason: "before_dispatch_handled",
			logKind: "fast_approve"
		});
	}
	const admissionTicket = params.replyOptions?.[REPLY_ADMISSION_TICKET];
	if (admissionTicket && !await admissionTicket.wait(params.replyOptions?.abortSignal)) return {
		status: "complete",
		result: finishReplyOperationAbortedDispatch()
	};
	const preDispatchAcquisition = await state.ensureDispatchReplyOperation("pre_dispatch");
	if (preDispatchAcquisition.status === "aborted") return {
		status: "complete",
		result: finishReplyOperationAbortedDispatch()
	};
	if (preDispatchAcquisition.status === "busy") return {
		status: "complete",
		result: state.finishReplyOperationBusyDispatch({ dedupeDisposition: "release" })
	};
	if (pluginOwnedBinding) {
		if (isPreDispatchOperationAborted()) return {
			status: "complete",
			result: finishReplyOperationAbortedDispatch()
		};
		touchConversationBindingRecord(pluginOwnedBinding.bindingId);
		params.replyOptions ??= {};
		if (shouldBypassPluginOwnedBindingForCommand(ctx, cfg, params.replyOptions)) logVerbose(`plugin-bound inbound command escaped plugin binding (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to command processing`);
		else if (state.sendPolicyDenied || suppressDelivery && !state.suppressAutomaticSourceDelivery) logVerbose(`plugin-bound inbound skipped under ${deliverySuppressionReason} (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to suppressed agent processing`);
		else {
			logVerbose(`plugin-bound inbound routed to ${pluginOwnedBinding.pluginId} conversation=${pluginOwnedBinding.conversationId}`);
			const bindingAuthorization = resolveCommandAuthorization({
				ctx,
				cfg,
				commandAuthorized: ctx.CommandAuthorized
			});
			const targetedClaimOutcome = hookRunner?.runInboundClaimForPluginOutcome ? await (async () => {
				await state.prepareHookMediaMetadata();
				if (isPreDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
				const authorizedInboundClaimEvent = {
					...state.hookState.inboundClaimEvent,
					senderIsOwner: bindingAuthorization.senderIsOwner
				};
				return await state.runWithDispatchLifecycleAdmission(async () => await hookRunner.runInboundClaimForPluginOutcome(pluginOwnedBinding.pluginId, authorizedInboundClaimEvent, {
					...state.hookState.inboundClaimContext,
					pluginBinding: pluginOwnedBinding
				}));
			})() : (() => {
				return getGlobalPluginRegistry()?.plugins.some((plugin) => plugin.id === pluginOwnedBinding.pluginId && plugin.status === "loaded") ?? false ? { status: "no_handler" } : { status: "missing_plugin" };
			})();
			if (isPreDispatchOperationAborted()) return {
				status: "complete",
				result: finishReplyOperationAbortedDispatch()
			};
			switch (targetedClaimOutcome.status) {
				case "handled": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					if (targetedClaimOutcome.result.reply && state.shouldDeliverPluginBindingReply) await state.deliverBindingPayload(targetedClaimOutcome.result.reply, "terminal", transcriptOwner);
					markIdle("plugin_binding_dispatch");
					recordProcessed("completed", { reason: "plugin-bound-handled" });
					commitInboundDedupeIfClaimed();
					completeDispatchReplyOperation();
					return {
						status: "complete",
						result: attachSourceReplyDeliveryMode({
							queuedFinal: false,
							counts: dispatcher.getQueuedCounts()
						})
					};
				}
				case "missing_plugin":
				case "no_handler":
					state.bindingState.pluginFallbackReason = targetedClaimOutcome.status === "missing_plugin" ? "plugin-bound-fallback-missing-plugin" : "plugin-bound-fallback-no-handler";
					if ((chatType === "group" || chatType === "channel") && ctx.WasMentioned === false && !state.explicitCommandTurnCtx && ctx.GroupRequireMention !== false) {
						markIdle("plugin_binding_fallback_unmentioned");
						recordProcessed("completed", { reason: state.bindingState.pluginFallbackReason });
						commitInboundDedupeIfClaimed();
						completeDispatchReplyOperation();
						return {
							status: "complete",
							result: attachSourceReplyDeliveryMode({
								queuedFinal: false,
								counts: dispatcher.getQueuedCounts()
							})
						};
					}
					if (!hasShownPluginBindingFallbackNotice(pluginOwnedBinding.bindingId)) {
						if (await sendBindingNotice({ text: buildPluginBindingUnavailableText(pluginOwnedBinding) }, "additive")) markPluginBindingFallbackNoticeShown(pluginOwnedBinding.bindingId);
					}
					break;
				case "declined": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					await sendBindingNotice({ text: buildPluginBindingDeclinedText(pluginOwnedBinding) }, "terminal", transcriptOwner);
					markIdle("plugin_binding_declined");
					recordProcessed("completed", { reason: "plugin-bound-declined" });
					commitInboundDedupeIfClaimed();
					completeDispatchReplyOperation();
					return {
						status: "complete",
						result: attachSourceReplyDeliveryMode({
							queuedFinal: false,
							counts: dispatcher.getQueuedCounts()
						})
					};
				}
				case "error": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					logVerbose(`plugin-bound inbound claim failed for ${pluginOwnedBinding.pluginId}: ${targetedClaimOutcome.error}`);
					await sendBindingNotice({ text: buildPluginBindingErrorText(pluginOwnedBinding) }, "terminal", transcriptOwner);
					markIdle("plugin_binding_error");
					recordProcessed("completed", { reason: "plugin-bound-error" });
					commitInboundDedupeIfClaimed();
					completeDispatchReplyOperation();
					return {
						status: "complete",
						result: attachSourceReplyDeliveryMode({
							queuedFinal: false,
							counts: dispatcher.getQueuedCounts()
						})
					};
				}
			}
		}
	}
	emitMessageReceivedHooks();
	return {
		status: "ready",
		state
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.ts
/** Main reply dispatch pipeline from finalized config/context to delivery payloads. */
/** Dispatches a reply from config, context, command handling, agent run, and delivery policy. */
async function dispatchReplyFromConfig(params) {
	const ticket = reserveReplyAdmissionTicket([params.ctx.SessionKey, params.ctx.CommandTargetSessionKey]);
	const ticketedParams = ticket ? {
		...params,
		replyOptions: {
			...params.replyOptions,
			[REPLY_ADMISSION_TICKET]: ticket
		}
	} : params;
	const messageAuditTerminal = createInboundMessageAuditTerminal(params);
	try {
		const result = await dispatchReplyFromConfigInner(ticketedParams, messageAuditTerminal);
		messageAuditTerminal?.finishSuccess(result);
		return result;
	} catch (error) {
		messageAuditTerminal?.finishError();
		throw error;
	} finally {
		ticket?.release();
	}
}
async function dispatchReplyFromConfigInner(params, messageAuditTerminal) {
	const gathered = await gatherDispatchRequest(params, messageAuditTerminal);
	if (gathered.status === "complete") return gathered.result;
	return await withPluginRuntimeRegistryScope(gathered.state.pluginRegistry, async () => {
		const context = await prepareDispatchOperationContext((await prepareDispatchDelivery(gathered.state)).state);
		if (context.status === "complete") return context.result;
		const errorState = context.state;
		try {
			const operation = await prepareDispatchOperation(context.state);
			if (operation.status === "complete") return operation.result;
			const route = await chooseDispatchRoute(operation.state);
			if (route.status === "complete") return route.result;
			const executed = await executeDispatch((await prepareDispatchExecution(route.state)).state);
			if (executed.status === "complete") return executed.result;
			return (await finalizeDispatchAndAudit(executed.state)).result;
		} catch (err) {
			const { failDispatchReplyOperation, finishReplyOperationAbortedDispatch, inboundDedupeClaim, markIdle, recordAgentDispatchCompleted, recordProcessed } = errorState;
			if (isDispatchReplyOperationAbortedError(err)) return finishReplyOperationAbortedDispatch();
			if (inboundDedupeClaim.status === "claimed") if (errorState.inboundDedupeReplayUnsafe) commitInboundDedupe(inboundDedupeClaim.key);
			else releaseInboundDedupe(inboundDedupeClaim.key);
			recordAgentDispatchCompleted("error", { error: String(err) });
			recordProcessed("error", { error: String(err) });
			markIdle("message_error");
			failDispatchReplyOperation(err);
			throw err;
		}
	});
}
//#endregion
//#region src/auto-reply/dispatch.ts
/** Auto-reply dispatch orchestration, hook composition, and foreground delivery fencing. */
const replyPayloadSendingDispatchers = /* @__PURE__ */ new WeakSet();
function applyRuntimeToolsAllow(replyOptions, toolsAllow) {
	if (toolsAllow === void 0) return replyOptions;
	return {
		...replyOptions,
		toolsAllow
	};
}
function resolveForegroundReplyFenceKey(finalized) {
	const sessionKey = normalizeOptionalString(finalized.SessionKey);
	const channel = normalizeOptionalString(finalized.OriginatingChannel) ?? normalizeOptionalString(finalized.Surface) ?? normalizeOptionalString(finalized.Provider);
	const target = normalizeOptionalString(finalized.OriginatingTo) ?? normalizeOptionalString(finalized.NativeChannelId) ?? normalizeOptionalString(finalized.From) ?? normalizeOptionalString(finalized.To);
	if (!sessionKey || !channel || !target) return;
	return JSON.stringify([
		"foreground",
		channel,
		normalizeOptionalString(finalized.AccountId) ?? "default",
		sessionKey,
		normalizeChatType(finalized.ChatType) ?? "unknown",
		target
	]);
}
function beginForegroundReplyFence(finalized) {
	const key = resolveForegroundReplyFenceKey(finalized);
	if (!key) return;
	const state = foregroundReplyFenceByKey.get(key) ?? {
		generation: 0,
		visibleDeliveryGeneration: 0,
		activeDispatches: 0,
		activeGenerations: /* @__PURE__ */ new Map(),
		suspendedGenerations: /* @__PURE__ */ new Set(),
		waiters: /* @__PURE__ */ new Set()
	};
	state.generation += 1;
	state.activeDispatches += 1;
	state.activeGenerations.set(state.generation, (state.activeGenerations.get(state.generation) ?? 0) + 1);
	foregroundReplyFenceByKey.set(key, state);
	return {
		key,
		generation: state.generation,
		state
	};
}
function setForegroundReplyFenceAdmissionWaiting(snapshot, waiting) {
	if (!snapshot) return;
	const state = foregroundReplyFenceByKey.get(snapshot.key);
	if (state !== snapshot.state) return;
	if (waiting) {
		if (state.activeGenerations.delete(snapshot.generation)) state.suspendedGenerations.add(snapshot.generation);
	} else if (state.suspendedGenerations.delete(snapshot.generation)) state.activeGenerations.set(snapshot.generation, 1);
	notifyForegroundReplyFenceWaiters(state);
}
function hasNewerActiveForegroundReplyFenceGeneration(state, generation) {
	for (const [activeGeneration, count] of state.activeGenerations) if (activeGeneration > generation && count > 0) return true;
	return false;
}
async function shouldCancelForegroundReplyDelivery(snapshot) {
	if (!snapshot) return false;
	while (true) {
		const state = foregroundReplyFenceByKey.get(snapshot.key);
		if (!state) return false;
		if (state.visibleDeliveryGeneration > snapshot.generation) return true;
		if (!hasNewerActiveForegroundReplyFenceGeneration(state, snapshot.generation)) return false;
		await new Promise((resolve) => {
			state.waiters.add(resolve);
		});
	}
}
function markForegroundReplyFenceVisibleDelivery(snapshot, payload, deliveryResult) {
	if (!snapshot || !hasOutboundReplyContent(payload, { trimText: true })) return;
	if (isExplicitlyNonVisibleDelivery(deliveryResult)) return;
	markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
}
function markForegroundReplyFenceVisibleDeliveryGeneration(snapshot) {
	if (!snapshot) return;
	const state = foregroundReplyFenceByKey.get(snapshot.key);
	if (!state) return;
	state.visibleDeliveryGeneration = Math.max(state.visibleDeliveryGeneration, snapshot.generation);
	notifyForegroundReplyFenceWaiters(state);
}
function isExplicitlyNonVisibleDelivery(deliveryResult) {
	return typeof deliveryResult === "object" && deliveryResult !== null && !Array.isArray(deliveryResult) && "visibleReplySent" in deliveryResult && deliveryResult.visibleReplySent === false;
}
function isExplicitlyVisibleDelivery(deliveryResult) {
	return typeof deliveryResult === "object" && deliveryResult !== null && !Array.isArray(deliveryResult) && deliveryResult.visibleReplySent === true;
}
function isVisiblePartialDeliveryError(error) {
	if (isOutboundDeliveryError(error)) return error.sentBeforeError;
	if (isChannelPartialDeliveryError(error)) return true;
	return typeof error === "object" && error !== null && !Array.isArray(error) && (error.visibleReplySent === true || error.sentBeforeError === true);
}
async function runForegroundReplyFenceFreshSettledDelivery(snapshot, onFreshSettledDelivery) {
	if (!onFreshSettledDelivery) return;
	if (await shouldCancelForegroundReplyDelivery(snapshot)) return;
	try {
		if (isExplicitlyVisibleDelivery(await onFreshSettledDelivery())) markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
	} catch (err) {
		if (isVisiblePartialDeliveryError(err)) markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
		throw err;
	}
}
function endForegroundReplyFence(snapshot) {
	const state = foregroundReplyFenceByKey.get(snapshot.key);
	if (!state) return;
	const activeGenerationCount = state.activeGenerations.get(snapshot.generation) ?? 0;
	if (activeGenerationCount <= 1) state.activeGenerations.delete(snapshot.generation);
	else state.activeGenerations.set(snapshot.generation, activeGenerationCount - 1);
	state.suspendedGenerations.delete(snapshot.generation);
	state.activeDispatches -= 1;
	notifyForegroundReplyFenceWaiters(state);
	if (state.activeDispatches <= 0) foregroundReplyFenceByKey.delete(snapshot.key);
}
function resolveDispatcherSilentReplyContext(ctx, cfg) {
	const finalized = finalizeInboundContext(ctx);
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(finalized);
	const policySessionKey = commandTargetSessionKey ?? finalized.SessionKey;
	const chatType = normalizeChatType(finalized.ChatType);
	const conversationType = commandTargetSessionKey && commandTargetSessionKey !== finalized.SessionKey ? void 0 : chatType === "direct" ? "direct" : chatType === "group" || chatType === "channel" ? "group" : void 0;
	return {
		cfg,
		sessionKey: policySessionKey,
		surface: finalized.Surface ?? finalized.Provider,
		conversationType
	};
}
function bindReplyPayloadRunState(replyOptions, runState) {
	const onAgentRunStart = replyOptions?.onAgentRunStart;
	return {
		...replyOptions,
		onAgentRunStart: (runId) => {
			runState.runId = runId;
			onAgentRunStart?.(runId);
		}
	};
}
function installReplyPayloadSendingBeforeDeliver(dispatcher, ctx, runState) {
	if (replyPayloadSendingDispatchers.has(dispatcher)) return;
	const beforeDeliver = buildInboundReplyPayloadSendingBeforeDeliver(ctx, runState);
	if (!beforeDeliver || !dispatcher.appendBeforeDeliver) return;
	dispatcher.appendBeforeDeliver(beforeDeliver);
	replyPayloadSendingDispatchers.add(dispatcher);
}
function markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, beforeDeliver) {
	if (beforeDeliver) replyPayloadSendingDispatchers.add(dispatcher);
}
function buildDispatchTimelineAttributes(ctx) {
	const commandTurn = resolveCommandTurnContext(ctx);
	return {
		surface: typeof ctx.Surface === "string" ? ctx.Surface : typeof ctx.Provider === "string" ? ctx.Provider : "unknown",
		hasSessionKey: typeof ctx.SessionKey === "string" || typeof ctx.CommandTargetSessionKey === "string",
		commandSource: commandTurn.source
	};
}
function finalizeDispatchResult(result, dispatcher) {
	const cancelledCounts = dispatcher.getCancelledCounts?.();
	const failedCounts = dispatcher.getFailedCounts?.();
	if (!cancelledCounts && !failedCounts) return result;
	const resultCounts = {
		tool: result.counts?.tool ?? 0,
		block: result.counts?.block ?? 0,
		final: result.counts?.final ?? 0
	};
	const counts = {
		tool: Math.max(0, resultCounts.tool - (cancelledCounts?.tool ?? 0) - (failedCounts?.tool ?? 0)),
		block: Math.max(0, resultCounts.block - (cancelledCounts?.block ?? 0) - (failedCounts?.block ?? 0)),
		final: Math.max(0, resultCounts.final - (cancelledCounts?.final ?? 0) - (failedCounts?.final ?? 0))
	};
	const hasFailedCounts = (failedCounts?.tool ?? 0) > 0 || (failedCounts?.block ?? 0) > 0 || (failedCounts?.final ?? 0) > 0;
	return {
		...result,
		queuedFinal: result.queuedFinal && counts.final > 0,
		counts,
		...hasFailedCounts ? { failedCounts } : {}
	};
}
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
async function dispatchInboundMessage(params) {
	const replyOptions = applyRuntimeToolsAllow(params.replyOptions, params.toolsAllow);
	const replyPayloadRunState = params.replyPayloadRunState ?? { runId: replyOptions?.runId };
	const replyOptionsWithRunState = bindReplyPayloadRunState(replyOptions, replyPayloadRunState);
	const finalized = measureDiagnosticsTimelineSpanSync("auto_reply.finalize_context", () => finalizeInboundContext(params.ctx), {
		phase: "agent-turn",
		config: params.cfg,
		attributes: buildDispatchTimelineAttributes(params.ctx)
	});
	if (isDiagnosticsEnabled(params.cfg)) logMessageReceived({
		sessionKey: finalized.SessionKey,
		channel: finalized.Surface ?? finalized.Provider,
		chatId: finalized.To ?? finalized.From,
		messageId: finalized.MessageSid ?? finalized.MessageSidFirst ?? finalized.MessageSidLast,
		source: "dispatchInboundMessage"
	});
	if (params.outboundHooks !== "disabled") installReplyPayloadSendingBeforeDeliver(params.dispatcher, finalized, replyPayloadRunState);
	return finalizeDispatchResult(await withReplyDispatcher({
		dispatcher: params.dispatcher,
		onSettled: params.onSettled,
		run: () => measureDiagnosticsTimelineSpan("auto_reply.dispatch_reply_from_config", () => dispatchReplyFromConfig({
			ctx: finalized,
			cfg: params.cfg,
			dispatcher: params.dispatcher,
			replyOptions: replyOptionsWithRunState,
			replyResolver: params.replyResolver,
			onSessionMetadataChanges: params.onSessionMetadataChanges,
			usePublishedModelRuntime: true
		}), {
			phase: "agent-turn",
			config: params.cfg,
			attributes: buildDispatchTimelineAttributes(finalized)
		})
	}), params.dispatcher);
}
async function dispatchInboundMessageWithBufferedDispatcherCore(params, ownership) {
	const finalized = finalizeInboundContext(params.ctx);
	const foregroundReplyFence = beginForegroundReplyFence(finalized);
	const silentReplyContext = resolveDispatcherSilentReplyContext(finalized, params.cfg);
	const replyPayloadRunState = { runId: params.replyOptions?.runId };
	const replyPayloadBeforeDeliver = ownership.outboundHooks === "disabled" ? void 0 : buildInboundReplyPayloadSendingBeforeDeliver(finalized, replyPayloadRunState, ownership.onReplyPayloadSuppressed);
	const globalBeforeDeliver = ownership.messageSending === "dispatcher" ? composeReplyDispatchBeforeDeliver(replyPayloadBeforeDeliver, buildLegacyInboundMessageSendingBeforeDeliver(finalized)) : replyPayloadBeforeDeliver;
	const configuredBeforeDeliver = params.dispatcherOptions.beforeDeliver ? composeReplyDispatchBeforeDeliver({
		hook: params.dispatcherOptions.beforeDeliver,
		options: params.dispatcherOptions.beforeDeliverOptions
	}, replyPayloadBeforeDeliver) : globalBeforeDeliver;
	const beforeDeliver = foregroundReplyFence || configuredBeforeDeliver ? markReplyDispatchBeforeDeliverDeadlineOwned(async (payload, info) => {
		if (await shouldCancelForegroundReplyDelivery(foregroundReplyFence)) {
			setReplyPayloadMetadata(payload, { foregroundDeliverySuppression: { reason: "stale-foreground" } });
			return null;
		}
		const deliverPayload = configuredBeforeDeliver ? await configuredBeforeDeliver(payload, info) : payload;
		if (!deliverPayload) return null;
		if (await shouldCancelForegroundReplyDelivery(foregroundReplyFence)) {
			setReplyPayloadMetadata(payload, { foregroundDeliverySuppression: { reason: "stale-foreground" } });
			return null;
		}
		return deliverPayload;
	}) : void 0;
	const deliver = async (payload, info) => {
		try {
			const result = await params.dispatcherOptions.deliver(payload, info);
			markForegroundReplyFenceVisibleDelivery(foregroundReplyFence, payload, result);
			return result;
		} catch (err) {
			if (isVisiblePartialDeliveryError(err)) markForegroundReplyFenceVisibleDelivery(foregroundReplyFence, payload, { visibleReplySent: true });
			throw err;
		}
	};
	const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } = createReplyDispatcherWithTyping({
		...params.dispatcherOptions,
		deliver,
		beforeDeliver,
		silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext
	});
	const onTypingController = params.replyOptions?.onTypingController ? (typing) => {
		replyOptions.onTypingController?.(typing);
		params.replyOptions?.onTypingController?.(typing);
	} : replyOptions.onTypingController;
	markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
	try {
		return await dispatchInboundMessage({
			ctx: finalized,
			cfg: params.cfg,
			dispatcher,
			toolsAllow: params.toolsAllow,
			replyResolver: params.replyResolver,
			replyOptions: {
				...params.replyOptions,
				...replyOptions,
				onTypingController,
				onReplyAdmissionWaitChange: (waiting) => {
					setForegroundReplyFenceAdmissionWaiting(foregroundReplyFence, waiting);
				}
			},
			replyPayloadRunState,
			outboundHooks: ownership.outboundHooks,
			onSessionMetadataChanges: params.onSessionMetadataChanges
		});
	} finally {
		try {
			if (isExplicitlyVisibleDelivery(await params.dispatcherOptions.onSettled?.())) markForegroundReplyFenceVisibleDeliveryGeneration(foregroundReplyFence);
			await runForegroundReplyFenceFreshSettledDelivery(foregroundReplyFence, params.dispatcherOptions.onFreshSettledDelivery);
		} finally {
			if (foregroundReplyFence) endForegroundReplyFence(foregroundReplyFence);
			markRunComplete();
			markDispatchIdle();
		}
	}
}
async function dispatchInboundMessageWithBufferedDispatcher(params) {
	return await dispatchInboundMessageWithBufferedDispatcherCore(params, { messageSending: "dispatcher" });
}
async function dispatchInboundMessageWithRoutedChannelDispatcher(params) {
	const { onReplyPayloadSuppressed, suppressOutboundHooks, ...dispatcherParams } = params;
	return await dispatchInboundMessageWithBufferedDispatcherCore(dispatcherParams, {
		messageSending: "channel-delivery",
		...suppressOutboundHooks ? { outboundHooks: "disabled" } : { onReplyPayloadSuppressed }
	});
}
async function dispatchInboundMessageWithPlainDispatcherCore(params, messageSending) {
	const silentReplyContext = resolveDispatcherSilentReplyContext(params.ctx, params.cfg);
	const replyPayloadRunState = { runId: params.replyOptions?.runId };
	const replyPayloadBeforeDeliver = buildInboundReplyPayloadSendingBeforeDeliver(params.ctx, replyPayloadRunState);
	const globalBeforeDeliver = composeReplyDispatchBeforeDeliver(replyPayloadBeforeDeliver, messageSending === "projected" ? buildProjectedInboundMessageSendingBeforeDeliver(params.ctx) : buildLegacyInboundMessageSendingBeforeDeliver(params.ctx));
	const composedBeforeDeliver = params.dispatcherOptions.beforeDeliver ? composeReplyDispatchBeforeDeliver({
		hook: params.dispatcherOptions.beforeDeliver,
		options: params.dispatcherOptions.beforeDeliverOptions
	}, replyPayloadBeforeDeliver) : globalBeforeDeliver;
	const dispatcher = createReplyDispatcher({
		...params.dispatcherOptions,
		beforeDeliver: composedBeforeDeliver,
		silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext
	});
	markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
	return await dispatchInboundMessage({
		ctx: params.ctx,
		cfg: params.cfg,
		dispatcher,
		toolsAllow: params.toolsAllow,
		replyResolver: params.replyResolver,
		replyOptions: params.replyOptions,
		replyPayloadRunState,
		onSessionMetadataChanges: params.onSessionMetadataChanges
	});
}
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
async function dispatchInboundMessageWithDispatcher(params) {
	return await dispatchInboundMessageWithPlainDispatcherCore(params, "legacy");
}
/** Creates a core-owned dispatcher whose modifiers fence projected output capture. */
async function dispatchInboundMessageWithProjectedDispatcher(params) {
	return await dispatchInboundMessageWithPlainDispatcherCore(params, "projected");
}
//#endregion
export { dispatchInboundMessageWithRoutedChannelDispatcher as a, resetInboundDedupe as c, dispatchInboundMessageWithProjectedDispatcher as i, emitInboundMessageAuditTerminal as l, dispatchInboundMessageWithBufferedDispatcher as n, dispatchReplyFromConfig as o, dispatchInboundMessageWithDispatcher as r, emitMessageReceivedHooks as s, dispatchInboundMessage as t };
