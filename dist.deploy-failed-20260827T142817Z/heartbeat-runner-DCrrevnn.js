import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { j as resolveIntegerOption } from "./number-coercion-oCkfUEEq.js";
import "./utils-DEqefz4f.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { i as isSilentReplyPayloadText, t as HEARTBEAT_TOKEN } from "./tokens-CMI0yx54.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { u as resolveCronJobsStorePathFromConfig } from "./store-Ce3SZg1h.js";
import "./config-CW-q_d35.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { Dt as applySessionEntryLifecycleMutation, Xt as loadExactSessionEntry, en as patchSessionEntryCore } from "./session-accessor-CVnxp3UM.js";
import { m as selectAgentSystemEvents, p as resolveSystemEventDeliveryContext, t as consumeSelectedSystemEventEntries, u as peekSystemEventEntries } from "./system-events-B0eLVp5j.js";
import { t as STREAM_ERROR_FALLBACK_TEXT } from "./stream-message-shared-Cyrn1UHN.js";
import { a as HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT, d as getHeartbeatWakeAbortSignal, i as HEARTBEAT_SKIP_PREEMPTED, l as setHeartbeatWakeHandler, n as HEARTBEAT_SKIP_CRON_IN_PROGRESS, o as areHeartbeatsEnabled, r as HEARTBEAT_SKIP_NO_PENDING_EVENT, s as isRetryableHeartbeatSkipReason } from "./heartbeat-wake-WmGdPBfX.js";
import { S as replaceGenericExternalRunFailureText } from "./user-copy-B4A_rZVy.js";
import { a as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-BkG8TWNz.js";
import { d as listActiveReplyRunSessionKeys, p as replyRunRegistry } from "./reply-run-registry-CeOg3aTN.js";
import { p as listActiveEmbeddedRunSessionKeys } from "./run-state-BxqT1sw2.js";
import { a as hasOutboundReplyContent } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { s as isHeartbeatContentEffectivelyEmpty, u as stripHeartbeatToken } from "./heartbeat-BB6nm0Fy.js";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-SBuC01JP.js";
import { n as buildRecoverablePendingFinalDeliveryText } from "./pending-final-delivery-COvipX9I.js";
import { a as transitionMainSessionRecovery } from "./main-session-recovery-state-BkgEXAzo.js";
import { a as hasActiveCronJobsExceptMarker, i as hasActiveCronJobs, o as isCronActiveJobMarkerCurrent } from "./active-jobs-D5QwO55Q.js";
import { l as isCommandLaneTaskMarkerCurrent, s as getQueueSize } from "./command-queue-CqN2qr5o.js";
import { t as buildOutboundSessionContext } from "./session-context-Boxqt1oa.js";
import { t as REPLY_OPERATION_RUN_STATE } from "./reply-operation-run-state-CL0NGjUt.js";
import { a as getHeartbeatToolNotificationText, c as resolveHeartbeatToolResponseFromReplyResult, s as resolveHeartbeatScratchProposalFromReplyResult } from "./heartbeat-tool-response-CyHYyyCM.js";
import { i as resolveAmbientHeartbeatAgentId, n as resolveHeartbeatIntervalMs, t as isHeartbeatEnabledForAgent } from "./heartbeat-summary-D3cbsUP0.js";
import { r as persistHeartbeatOutcome } from "./heartbeat-outcome-store-BIOunpoQ.js";
import { t as appendCronStyleCurrentTimeLine } from "./current-time-D-I8cLSc.js";
import { a as isRelayableExecCompletionEvent, i as isExecCompletionEvent, n as buildExecEventPrompt, r as isCronSystemEvent, t as buildCronEventPrompt } from "./heartbeat-events-filter-3knu9SYy.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { t as sendDurableMessageBatchCore } from "./send-DijSpoVg.js";
import "./runtime-DuCKblTw.js";
import { i as resolveHeartbeatSenderContext, r as resolveHeartbeatDeliveryTargetWithSessionRoute } from "./targets-DMOfrU8H.js";
import { a as writeCronJobScratch, i as readHeartbeatMonitorScratch } from "./scratch-store-BhSnPn6R.js";
import { t as createReplyPrefixContext } from "./reply-prefix-CcOSb2xM.js";
import { t as createTypingCallbacks } from "./typing-BdTQBR6k.js";
import { n as resolveHeartbeatTerminalToolFailure, t as resolveHeartbeatReplyPayload } from "./heartbeat-reply-payload-CBRzMkbK.js";
import { n as resolveAgentOutboundIdentity } from "./identity-C_yEndY2.js";
import { a as resolveIndicatorType, t as emitHeartbeatEvent } from "./heartbeat-events-bg9alNGv.js";
import { t as resolveHeartbeatVisibility } from "./heartbeat-visibility-UVwDVBL7.js";
import { n as resolveReplyOperationAgentTurn } from "./reply-operation-agent-turn-state-Cv97DQ51.js";
import { _ as resolveHeartbeatTimeoutOverrideSeconds, a as restoreHeartbeatUpdatedAt, b as createActiveHoursPredicate, c as isHeartbeatTypingEnabled, d as resolveHeartbeatAckMaxChars, f as resolveHeartbeatAgents, g as resolveHeartbeatSchedulerSeed, h as resolveHeartbeatResponseToolPrompt, i as resolveStaleHeartbeatIsolatedSessionKey, l as resolveActiveHoursSchedule, m as resolveHeartbeatForWake, o as activeHoursConfigMatch, p as resolveHeartbeatChannelPlugin, r as resolveIsolatedHeartbeatSessionKey, s as heartbeatLog, t as resolveHeartbeatSession, u as resolveConfiguredHeartbeatPrompt, v as resolveHeartbeatTypingIntervalSeconds, x as isWithinActiveHours, y as shouldUseHeartbeatResponseToolPrompt } from "./heartbeat-runner-session-DG5Kq8Z-.js";
import { n as resolveCronSession } from "./session-BJpJqJcN.js";
import { createHash } from "node:crypto";
//#region src/infra/heartbeat-delivery-normalization.ts
function stripLeadingHeartbeatResponsePrefix(text, responsePrefix) {
	const normalizedPrefix = responsePrefix?.trim();
	if (!normalizedPrefix) return text;
	const prefixPattern = new RegExp(`^${escapeRegExp(normalizedPrefix)}(?=$|\\s|[\\p{P}\\p{S}])\\s*`, "iu");
	return text.replace(prefixPattern, "");
}
function isStreamErrorFallbackPlaceholderOnly(text) {
	let remaining = text.trim();
	if (!remaining) return false;
	while (remaining.startsWith(STREAM_ERROR_FALLBACK_TEXT)) remaining = remaining.slice(STREAM_ERROR_FALLBACK_TEXT.length).trimStart();
	return remaining.length === 0;
}
const TRAILING_HEARTBEAT_NOTIFY_FALSE_RE = /(?:^|[\r\n])[ \t]*notify=false[ \t]*(?:\r?\n[ \t]*)*$/i;
function stripTrailingHeartbeatNotifyFalse(text) {
	const match = TRAILING_HEARTBEAT_NOTIFY_FALSE_RE.exec(text);
	return match ? {
		text: text.slice(0, match.index).trimEnd(),
		silent: true
	} : {
		text,
		silent: false
	};
}
function normalizeHeartbeatReply(payload, responsePrefix, ackMaxChars, mode = "heartbeat") {
	const textForStrip = stripLeadingHeartbeatResponsePrefix(typeof payload.text === "string" ? payload.text : "", responsePrefix);
	const isSilentReply = isSilentReplyPayloadText(textForStrip);
	const stripped = stripHeartbeatToken(isSilentReply ? "" : textForStrip, {
		mode,
		maxAckChars: ackMaxChars
	});
	const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
	const notifyFalse = stripTrailingHeartbeatNotifyFalse(stripped.text);
	notifyFalse.silent ||= isSilentReply;
	const isInternalPlaceholderOnly = isStreamErrorFallbackPlaceholderOnly(notifyFalse.text);
	if ((stripped.shouldSkip || isInternalPlaceholderOnly) && !hasMedia) return {
		shouldSkip: true,
		text: "",
		hasMedia,
		isInternalPlaceholderOnly,
		...notifyFalse.silent ? { silent: true } : {}
	};
	let finalText = isInternalPlaceholderOnly ? "" : notifyFalse.text;
	if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) finalText = `${responsePrefix} ${finalText}`;
	return {
		shouldSkip: !hasMedia && finalText.trim().length === 0,
		text: finalText,
		hasMedia,
		isInternalPlaceholderOnly,
		...notifyFalse.silent ? { silent: true } : {}
	};
}
function normalizeHeartbeatToolNotification(response, responsePrefix) {
	let finalText = getHeartbeatToolNotificationText(response);
	if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) finalText = `${responsePrefix} ${finalText}`;
	return {
		shouldSkip: finalText.trim().length === 0,
		text: finalText,
		hasMedia: false,
		isInternalPlaceholderOnly: false,
		...response.notify ? {} : { silent: true }
	};
}
//#endregion
//#region src/infra/heartbeat-failure-notice.ts
/** Deliver a heartbeat failure notice without acknowledging the underlying work. */
async function handleHeartbeatFailureNotice(params) {
	await params.restoreUpdatedAt();
	const finish = (channel, silent) => {
		emitHeartbeatEvent({
			status: "failed",
			reason: params.reason,
			preview: params.preview(params.normalized.text || params.previewText),
			durationMs: Date.now() - params.startedAt,
			channel,
			accountId: params.delivery.accountId,
			...silent === true ? { silent: true } : {},
			indicatorType: params.useIndicator ? resolveIndicatorType("failed") : void 0
		});
		return {
			status: "failed",
			reason: params.reason
		};
	};
	if (params.shouldSkipMain || params.delivery.channel === "none" || !params.delivery.to) return finish(params.delivery.channel !== "none" ? params.delivery.channel : void 0, true);
	if (!params.showAlerts) return finish(params.delivery.channel, true);
	let readiness;
	try {
		readiness = await params.checkReady?.();
	} catch (error) {
		params.onDeliveryError?.(error);
		return finish(params.delivery.channel, true);
	}
	if (readiness && !readiness.ok) {
		params.onChannelNotReady(readiness.reason);
		return finish(params.delivery.channel, true);
	}
	let deliveryStatus;
	try {
		deliveryStatus = await params.deliver?.();
	} catch (error) {
		params.onDeliveryError?.(error);
	}
	if (deliveryStatus === "sent") await params.clearSatisfiedPendingFinalDelivery?.();
	return finish(params.delivery.channel, deliveryStatus !== "sent" || params.normalized.silent === true);
}
//#endregion
//#region src/infra/heartbeat-wake-policy.ts
function inferHeartbeatWakeSourceFromReason(reason) {
	const trimmed = (reason ?? "").trim();
	if (trimmed === "exec-event") return "exec-event";
	if (trimmed.startsWith("cron:")) return "cron";
	if (trimmed === "wake" || trimmed.startsWith("hook:")) return "hook";
	if (trimmed.startsWith("acp:spawn:")) return "acp-spawn";
	if (trimmed.startsWith("session-state:")) return "session-state";
}
function resolveHeartbeatWakePayloadFlags(params) {
	const source = params.source ?? inferHeartbeatWakeSourceFromReason(params.reason);
	const reason = (params.reason ?? "").trim();
	return {
		isExecEventWake: source === "exec-event",
		isCronWake: source === "cron",
		isWakePayload: source === "hook" || source === "acp-spawn" || source === "session-state" || source === "background-task" || source === "background-task-blocked" || reason === "wake"
	};
}
function isTargetedImmediateUnscheduledWake(params) {
	if (params.intent !== "immediate") return false;
	const hasSessionTarget = normalizeOptionalString(params.sessionKey) !== void 0;
	if (!(hasSessionTarget || normalizeOptionalString(params.agentId) !== void 0)) return false;
	switch (params.source) {
		case "notifications-event": return hasSessionTarget && params.reason?.trim() === "wake";
		case "hook": return params.reason?.trim().startsWith("hook:") ?? false;
		case "background-task":
		case "background-task-blocked": return true;
		default: return false;
	}
}
function isConfiguredHeartbeatAgent(cfg, agentId) {
	const normalized = normalizeAgentId(agentId);
	return listAgentIds(cfg).some((candidate) => normalizeAgentId(candidate) === normalized);
}
//#endregion
//#region src/infra/heartbeat-runner-prompt.ts
const log$4 = heartbeatLog;
function truncateHeartbeatPreview(value) {
	return value ? truncateUtf16Safe(value, 200) : void 0;
}
function shouldPreflightExecEventWake(source, scheduledEveryMs, scheduledTaskCount) {
	return source === "exec-event" && !(typeof scheduledEveryMs === "number" && Number.isSafeInteger(scheduledEveryMs) && scheduledEveryMs > 0) && scheduledTaskCount === 0;
}
async function resolveHeartbeatPreflight(params) {
	const wakeFlags = resolveHeartbeatWakePayloadFlags({
		source: params.source,
		reason: params.reason
	});
	const session = resolveHeartbeatSession(params.cfg, params.agentId, params.heartbeat, params.sessionKey);
	const pendingEventEntries = selectAgentSystemEvents(peekSystemEventEntries(session.sessionKey), params.agentId);
	const turnSourceDeliveryContext = resolveSystemEventDeliveryContext(pendingEventEntries);
	const hasTaggedCronEvents = pendingEventEntries.some((event) => event.contextKey?.startsWith("cron:"));
	const shouldInspectWakePendingEvents = (() => {
		if (!wakeFlags.isWakePayload) return false;
		if (params.heartbeat?.isolatedSession !== true) return true;
		const configuredSession = resolveHeartbeatSession(params.cfg, params.agentId, params.heartbeat);
		const { isolatedSessionKey } = resolveIsolatedHeartbeatSessionKey({
			agentId: params.agentId,
			sessionKey: session.sessionKey,
			configuredSessionKey: configuredSession.sessionKey,
			sessionEntry: session.entry
		});
		return isolatedSessionKey === session.sessionKey;
	})();
	const shouldInspectPendingEvents = wakeFlags.isExecEventWake || wakeFlags.isCronWake || shouldInspectWakePendingEvents || hasTaggedCronEvents;
	const shouldBypassFileGates = wakeFlags.isExecEventWake || wakeFlags.isCronWake || wakeFlags.isWakePayload || hasTaggedCronEvents;
	let monitorScratch;
	try {
		monitorScratch = readHeartbeatMonitorScratch(resolveCronJobsStorePathFromConfig(params.cfg), params.agentId);
	} catch (error) {
		log$4.warn(`heartbeat: scratch read failed: ${formatErrorMessage(error)}`);
	}
	const heartbeatScratchContent = monitorScratch?.state.scratch?.content;
	const basePreflight = {
		...wakeFlags,
		session,
		pendingEventEntries,
		turnSourceDeliveryContext,
		hasTaggedCronEvents,
		shouldInspectPendingEvents,
		authoritativeScheduledTick: typeof params.scheduledEveryMs === "number" && Number.isSafeInteger(params.scheduledEveryMs) && params.scheduledEveryMs > 0,
		...monitorScratch?.jobId ? {
			scratchJobId: monitorScratch.jobId,
			scratchRevision: monitorScratch.state.currentRevision
		} : {},
		...!shouldBypassFileGates && heartbeatScratchContent !== void 0 ? { heartbeatScratchContent } : {}
	};
	if (wakeFlags.isExecEventWake && !basePreflight.authoritativeScheduledTick && !params.scheduledTasks?.length && !hasTaggedCronEvents && !pendingEventEntries.some((event) => isExecCompletionEvent(event.text))) return {
		...basePreflight,
		skipReason: HEARTBEAT_SKIP_NO_PENDING_EVENT
	};
	if (shouldBypassFileGates) return basePreflight;
	if (params.scheduledTasks?.length) return basePreflight;
	if (heartbeatScratchContent === void 0) return basePreflight;
	if (isHeartbeatContentEffectivelyEmpty(heartbeatScratchContent)) return {
		...basePreflight,
		skipReason: "empty-heartbeat-file"
	};
	return basePreflight;
}
/** Appends monitor scratch prose to the generated heartbeat prompt. */
function appendHeartbeatScratch(prompt, heartbeatScratchContent) {
	if (!heartbeatScratchContent) return prompt;
	const directives = heartbeatScratchContent.trim();
	if (!directives || prompt.includes(directives)) return prompt;
	return `${prompt}\n\nHeartbeat monitor scratch:\n${directives}`;
}
function resolveHeartbeatRunPrompt(params) {
	const pendingEventEntries = params.preflight.pendingEventEntries;
	const cronEvents = pendingEventEntries.filter((event) => (params.preflight.isCronWake || event.contextKey?.startsWith("cron:")) && isCronSystemEvent(event.text)).map((event) => event.text);
	const execEvents = params.preflight.shouldInspectPendingEvents ? pendingEventEntries.filter((event) => isExecCompletionEvent(event.text)).map((event) => event.text) : [];
	const hasExecCompletion = execEvents.length > 0;
	const hasRelayableExecCompletion = params.canRelayToUser && execEvents.some((event) => isRelayableExecCompletionEvent(event));
	const hasCronEvents = cronEvents.length > 0;
	if (params.scheduledTasks.length > 0) return {
		prompt: appendHeartbeatScratch(`Run the following periodic tasks (only those due based on their intervals):

${params.scheduledTasks.map((task) => `- ${task.name}: ${task.prompt}`).join("\n")}

${params.useHeartbeatResponseTool ? "After completing all due tasks, use heartbeat_respond to report the outcome. Set notify=false when nothing needs the user's attention." : "After completing all due tasks, reply HEARTBEAT_OK."}`, params.heartbeatScratchContent),
		hasExecCompletion: false,
		hasRelayableExecCompletion: false,
		hasCronEvents: false,
		usesHeartbeatResponseTool: params.useHeartbeatResponseTool
	};
	const baseUsesHeartbeatResponseTool = params.useHeartbeatResponseTool;
	return {
		prompt: appendHeartbeatScratch(hasExecCompletion ? buildExecEventPrompt(execEvents, {
			deliverToUser: params.canRelayToUser,
			useHeartbeatResponseTool: baseUsesHeartbeatResponseTool
		}) : hasCronEvents ? buildCronEventPrompt(cronEvents, {
			deliverToUser: params.canRelayToUser,
			useHeartbeatResponseTool: baseUsesHeartbeatResponseTool
		}) : baseUsesHeartbeatResponseTool ? resolveHeartbeatResponseToolPrompt(params.cfg, params.heartbeat) : resolveConfiguredHeartbeatPrompt(params.cfg, params.heartbeat), params.heartbeatScratchContent),
		hasExecCompletion,
		hasRelayableExecCompletion,
		hasCronEvents,
		usesHeartbeatResponseTool: baseUsesHeartbeatResponseTool
	};
}
function selectSystemEventsConsumedByHeartbeat(params) {
	const { preflight } = params;
	if (!preflight.shouldInspectPendingEvents || preflight.pendingEventEntries.length === 0) return [];
	if (params.hasExecCompletion) return preflight.pendingEventEntries.filter((event) => isExecCompletionEvent(event.text));
	if (params.hasCronEvents) return preflight.pendingEventEntries.filter((event) => (preflight.isCronWake || event.contextKey?.startsWith("cron:")) && isCronSystemEvent(event.text));
	if (preflight.isExecEventWake && !params.hasExecCompletion) return [];
	return preflight.pendingEventEntries;
}
//#endregion
//#region src/infra/heartbeat-runner-delivery.ts
const log$3 = heartbeatLog;
const CLEARED_PENDING_FINAL_DELIVERY_FIELDS = { pendingFinalDelivery: void 0 };
const FIRST_HEARTBEAT_ALERT_PREAMBLE = "First heartbeat alert: your bot runs periodic background checks and messages you only when something needs attention. Set agents.defaults.heartbeat.target: \"none\" to keep these internal.";
function heartbeatRunOwnsPendingFinalDelivery(entry, runStartedAt) {
	const createdAt = entry?.pendingFinalDelivery?.createdAt;
	return typeof createdAt === "number" && createdAt >= runStartedAt;
}
function classifyHeartbeatAgentOutcome(params) {
	const { agentRunFailed, heartbeatToolResponse, heartbeatTerminalToolFailure, replyPayload } = params.agentRun;
	const replyMetadata = replyPayload ? getReplyPayloadMetadata(replyPayload) : void 0;
	const hasExplicitFailure = Boolean(heartbeatTerminalToolFailure || agentRunFailed);
	const shouldSuppressSourceReply = params.suppressUnmarkedSourceReplies && !params.hasRelayableExecCompletion && replyPayload && replyPayload.isError !== true && replyMetadata?.deliverDespiteSourceReplySuppression !== true && (!hasExplicitFailure && !heartbeatToolResponse || agentRunFailed && !heartbeatTerminalToolFailure);
	if (heartbeatToolResponse && !heartbeatToolResponse.notify && !hasExplicitFailure) return {
		kind: "ack",
		eventStatus: "ok-token",
		preview: truncateHeartbeatPreview(heartbeatToolResponse.summary),
		response: heartbeatToolResponse
	};
	if (shouldSuppressSourceReply && !hasExplicitFailure) return {
		kind: "ack",
		eventStatus: "ok-token",
		silent: true
	};
	if (!heartbeatToolResponse && !hasExplicitFailure && (!replyPayload || !hasOutboundReplyContent(replyPayload))) return {
		kind: "ack",
		eventStatus: "ok-empty"
	};
	const mode = params.hasRelayableExecCompletion ? "message" : "heartbeat";
	const normalized = shouldSuppressSourceReply ? {
		shouldSkip: true,
		text: "",
		hasMedia: false,
		isInternalPlaceholderOnly: false
	} : hasExplicitFailure && replyPayload ? normalizeHeartbeatReply(replyPayload, params.responsePrefix, params.ackMaxChars, mode) : heartbeatToolResponse ? normalizeHeartbeatToolNotification(heartbeatToolResponse, params.responsePrefix) : replyPayload ? normalizeHeartbeatReply(replyPayload, params.responsePrefix, params.ackMaxChars, mode) : {
		shouldSkip: true,
		text: "",
		hasMedia: false,
		isInternalPlaceholderOnly: false
	};
	if (agentRunFailed) {
		const replacement = replaceGenericExternalRunFailureText(normalized.text);
		if (replacement.replaced) {
			normalized.text = replacement.text;
			normalized.shouldSkip = false;
		}
	}
	const hasStructuredReplyContent = !shouldSuppressSourceReply && (!heartbeatToolResponse || agentRunFailed) && replyPayload !== void 0 && hasOutboundReplyContent({
		...replyPayload,
		text: void 0,
		mediaUrl: void 0,
		mediaUrls: void 0
	});
	const shouldSkipMain = normalized.shouldSkip && !normalized.hasMedia && (!hasStructuredReplyContent || normalized.isInternalPlaceholderOnly);
	if (hasExplicitFailure) return {
		kind: "failure",
		reason: heartbeatTerminalToolFailure ? "agent-tool-failure" : "agent-runner-failure",
		...heartbeatTerminalToolFailure ? { previewText: heartbeatToolResponse?.summary || heartbeatTerminalToolFailure.toolName } : {},
		replyPayload: shouldSuppressSourceReply ? void 0 : replyPayload,
		normalized,
		shouldSkipMain
	};
	if (shouldSkipMain) return {
		kind: "ack",
		eventStatus: "ok-token",
		silent: normalized.silent
	};
	return {
		kind: "delivery",
		normalized,
		hasStructuredReplyContent,
		replyPayload: heartbeatToolResponse ? void 0 : replyPayload,
		mediaUrls: heartbeatToolResponse || !replyPayload ? [] : resolveSendableOutboundReplyParts(replyPayload).mediaUrls
	};
}
async function finalizeHeartbeatOutcome(params) {
	const { cfg, agentId, scheduledTasks, startedAt, wakeSource } = params.wake;
	const { delivery, entry, previousUpdatedAt } = params.prepared;
	const { runSessionKey, sessionKey, storePath, visibility } = params.prepared;
	const outcome = params.outcome;
	if (outcome.kind === "failure") {
		const failureReplyPayload = outcome.replyPayload;
		const failureChannel = delivery.channel;
		const failureTarget = delivery.to;
		const checkReady = (failureChannel !== "none" ? resolveHeartbeatChannelPlugin(failureChannel) : void 0)?.heartbeat?.checkReady;
		return await handleHeartbeatFailureNotice({
			reason: outcome.reason,
			...outcome.previewText ? { previewText: outcome.previewText } : {},
			normalized: outcome.normalized,
			shouldSkipMain: outcome.shouldSkipMain,
			delivery,
			showAlerts: visibility.showAlerts,
			useIndicator: visibility.useIndicator,
			startedAt,
			preview: truncateHeartbeatPreview,
			restoreUpdatedAt: async () => {
				await restoreHeartbeatUpdatedAt({
					storePath,
					sessionKey,
					updatedAt: previousUpdatedAt
				});
			},
			...checkReady ? { checkReady: async () => await checkReady({
				cfg,
				accountId: delivery.accountId,
				deps: params.opts.deps
			}) } : {},
			...failureChannel !== "none" && failureTarget ? { deliver: async () => {
				const send = await sendDurableMessageBatchCore({
					cfg,
					channel: failureChannel,
					to: failureTarget,
					accountId: delivery.accountId,
					session: params.outboundSession,
					identity: params.outboundIdentity,
					threadId: delivery.threadId,
					payloads: [copyReplyPayloadMetadata(failureReplyPayload ?? {}, {
						...failureReplyPayload,
						text: outcome.normalized.text || void 0
					})],
					deps: params.opts.deps,
					silent: outcome.normalized.silent
				});
				if (send.status === "failed" || send.status === "partial_failed") throw send.error;
				return send.status === "sent" ? "sent" : "suppressed";
			} } : {},
			...failureReplyPayload ? { clearSatisfiedPendingFinalDelivery: async () => {
				const pendingFinalText = buildRecoverablePendingFinalDeliveryText([failureReplyPayload]);
				if (!pendingFinalText) return;
				await clearSatisfiedPendingFinalDelivery(params.wake, params.prepared, pendingFinalText);
			} } : {},
			onChannelNotReady: (reason) => {
				log$3.info("heartbeat: channel not ready for failure notice", {
					channel: failureChannel,
					reason
				});
			},
			onDeliveryError: (error) => {
				log$3.warn("heartbeat: failure notice delivery failed", {
					channel: failureChannel,
					error: formatErrorMessage(error)
				});
			}
		});
	}
	if (outcome.kind === "ack") {
		if ("response" in outcome && outcome.response) persistHeartbeatOutcome({
			agentId,
			sessionKey,
			storePath,
			runSessionKey,
			response: outcome.response,
			taskNames: scheduledTasks.map((task) => task.name),
			wakeSource,
			wakeReason: params.opts.reason,
			occurredAt: startedAt
		});
		await restoreHeartbeatUpdatedAt({
			storePath,
			sessionKey,
			updatedAt: previousUpdatedAt
		});
		const okSent = "silent" in outcome && outcome.silent ? false : await params.maybeSendHeartbeatOk();
		emitHeartbeatEvent({
			status: outcome.eventStatus,
			reason: params.opts.reason,
			..."preview" in outcome ? { preview: outcome.preview } : {},
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId,
			silent: !okSent,
			indicatorType: visibility.useIndicator ? resolveIndicatorType(outcome.eventStatus) : void 0
		});
		consumeInspectedSystemEvents(params.wake, params.prepared);
		return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	}
	const { hasStructuredReplyContent, mediaUrls, normalized, replyPayload } = outcome;
	const prevHeartbeatText = typeof entry?.lastHeartbeatText === "string" ? entry.lastHeartbeatText : "";
	const prevHeartbeatAt = typeof entry?.lastHeartbeatSentAt === "number" ? entry.lastHeartbeatSentAt : void 0;
	if (!mediaUrls.length && !hasStructuredReplyContent && Boolean(prevHeartbeatText.trim()) && normalized.text.trim() === prevHeartbeatText.trim() && typeof prevHeartbeatAt === "number" && prevHeartbeatAt <= startedAt && startedAt - prevHeartbeatAt < 1440 * 60 * 1e3) {
		await restoreHeartbeatUpdatedAt({
			storePath,
			sessionKey,
			updatedAt: previousUpdatedAt
		});
		await clearSatisfiedPendingFinalDelivery(params.wake, params.prepared);
		emitHeartbeatEvent({
			status: "skipped",
			reason: "duplicate",
			preview: truncateHeartbeatPreview(normalized.text),
			durationMs: Date.now() - startedAt,
			hasMedia: false,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId
		});
		consumeInspectedSystemEvents(params.wake, params.prepared);
		return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	}
	const deliveryText = delivery.implicitDefaultRoute && prevHeartbeatAt === void 0 ? `${FIRST_HEARTBEAT_ALERT_PREAMBLE}\n${normalized.text}` : normalized.text;
	const previewText = deliveryText;
	if (delivery.channel === "none" || !delivery.to) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: delivery.reason ?? "no-target",
			preview: truncateHeartbeatPreview(previewText),
			durationMs: Date.now() - startedAt,
			hasMedia: mediaUrls.length > 0,
			accountId: delivery.accountId
		});
		consumeInspectedSystemEvents(params.wake, params.prepared);
		return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	}
	if (!visibility.showAlerts) {
		await restoreHeartbeatUpdatedAt({
			storePath,
			sessionKey,
			updatedAt: previousUpdatedAt
		});
		emitHeartbeatEvent({
			status: "skipped",
			reason: "alerts-disabled",
			preview: truncateHeartbeatPreview(previewText),
			durationMs: Date.now() - startedAt,
			channel: delivery.channel,
			hasMedia: mediaUrls.length > 0,
			accountId: delivery.accountId,
			indicatorType: visibility.useIndicator ? resolveIndicatorType("sent") : void 0
		});
		consumeInspectedSystemEvents(params.wake, params.prepared);
		return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	}
	const deliveryAccountId = delivery.accountId;
	const heartbeatPlugin = resolveHeartbeatChannelPlugin(delivery.channel);
	if (heartbeatPlugin?.heartbeat?.checkReady) {
		const readiness = await heartbeatPlugin.heartbeat.checkReady({
			cfg,
			accountId: deliveryAccountId,
			deps: params.opts.deps
		});
		if (!readiness.ok) {
			emitHeartbeatEvent({
				status: "skipped",
				reason: readiness.reason,
				preview: truncateHeartbeatPreview(previewText),
				durationMs: Date.now() - startedAt,
				hasMedia: mediaUrls.length > 0,
				channel: delivery.channel,
				accountId: delivery.accountId
			});
			log$3.info("heartbeat: channel not ready", {
				channel: delivery.channel,
				reason: readiness.reason
			});
			return {
				status: "skipped",
				reason: readiness.reason
			};
		}
	}
	const send = await sendDurableMessageBatchCore({
		cfg,
		channel: delivery.channel,
		to: delivery.to,
		accountId: deliveryAccountId,
		session: params.outboundSession,
		identity: params.outboundIdentity,
		threadId: delivery.threadId,
		payloads: [copyReplyPayloadMetadata(replyPayload ?? {}, {
			...replyPayload,
			text: deliveryText,
			mediaUrls
		})],
		deps: params.opts.deps,
		silent: normalized.silent
	});
	if (send.status === "failed" || send.status === "partial_failed") throw send.error;
	const visibleSendSucceeded = send.status === "sent";
	if (visibleSendSucceeded) {
		const hasHeartbeatText = Boolean(deliveryText.trim());
		await patchSessionEntryCore({
			storePath,
			sessionKey
		}, (current, context) => {
			if (!context.existingEntry) return null;
			const ownsPendingFinalDelivery = heartbeatRunOwnsPendingFinalDelivery(current, startedAt);
			if (!hasHeartbeatText && !ownsPendingFinalDelivery) return null;
			return {
				...hasHeartbeatText ? {
					lastHeartbeatText: normalized.text,
					lastHeartbeatSentAt: startedAt
				} : {},
				...ownsPendingFinalDelivery ? CLEARED_PENDING_FINAL_DELIVERY_FIELDS : {}
			};
		}, { preserveActivity: true });
	}
	const eventStatus = visibleSendSucceeded ? "sent" : "skipped";
	emitHeartbeatEvent({
		status: eventStatus,
		to: delivery.to,
		...!visibleSendSucceeded ? { reason: send.reason } : {},
		preview: truncateHeartbeatPreview(previewText),
		durationMs: Date.now() - startedAt,
		hasMedia: mediaUrls.length > 0,
		channel: delivery.channel,
		accountId: delivery.accountId,
		...normalized.silent === true ? { silent: true } : {},
		indicatorType: visibility.useIndicator ? resolveIndicatorType(eventStatus) : void 0
	});
	if (visibleSendSucceeded) consumeInspectedSystemEvents(params.wake, params.prepared);
	return {
		status: "ran",
		durationMs: Date.now() - startedAt
	};
}
async function clearSatisfiedPendingFinalDelivery(wake, prepared, expectedText) {
	await patchSessionEntryCore({
		storePath: prepared.storePath,
		sessionKey: prepared.sessionKey
	}, (current, context) => {
		if (!context.existingEntry) return null;
		if (!current?.pendingFinalDelivery) return null;
		if (!heartbeatRunOwnsPendingFinalDelivery(current, wake.startedAt)) return null;
		if (expectedText !== void 0 && (current.pendingFinalDelivery.kind !== "replayable" || current.pendingFinalDelivery.text !== expectedText)) return null;
		return CLEARED_PENDING_FINAL_DELIVERY_FIELDS;
	}, { preserveActivity: true });
}
function consumeInspectedSystemEvents(wake, prepared) {
	if (wake.preflight.shouldInspectPendingEvents && prepared.inspectedSystemEventsToConsume.length) consumeSelectedSystemEventEntries(prepared.sessionKey, prepared.inspectedSystemEventsToConsume);
}
//#endregion
//#region src/infra/heartbeat-runner-execution.ts
const log$2 = heartbeatLog;
const loadHeartbeatRunnerRuntime = createLazyRuntimeModule(() => import("./heartbeat-runner.runtime.js"));
function hasActiveRunForAgent(agentId, listSessionKeys) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return listSessionKeys().some((sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		return parsed ? normalizeAgentId(parsed.agentId) === normalizedAgentId : false;
	});
}
function hasActiveRunForSession(sessionKey, listSessionKeys) {
	const normalizedSessionKey = sessionKey.trim();
	return Boolean(normalizedSessionKey) && listSessionKeys().includes(normalizedSessionKey);
}
async function resolveHeartbeatWakeStage(opts) {
	const cfg = opts.cfg ?? getRuntimeConfig();
	const explicitAgentId = typeof opts.agentId === "string" ? opts.agentId.trim() : "";
	const forcedSessionAgentId = explicitAgentId.length > 0 ? void 0 : parseAgentSessionKey(opts.sessionKey)?.agentId;
	const agentId = normalizeAgentId(explicitAgentId || forcedSessionAgentId || resolveAmbientHeartbeatAgentId(cfg));
	const wakeSource = opts.source ?? inferHeartbeatWakeSourceFromReason(opts.reason);
	const heartbeat = resolveHeartbeatForWake({
		cfg,
		agentId,
		requestedHeartbeat: opts.heartbeat,
		source: wakeSource,
		mergeRequestedHeartbeat: wakeSource === "cron"
	});
	const scheduledTasks = [...opts.tasks ?? []].toSorted((left, right) => left.jobId.localeCompare(right.jobId));
	const allowsUnscheduledTarget = isTargetedImmediateUnscheduledWake(opts) && isConfiguredHeartbeatAgent(cfg, agentId);
	if (!areHeartbeatsEnabled()) return {
		kind: "skipped",
		reason: "disabled"
	};
	if (!allowsUnscheduledTarget && !isHeartbeatEnabledForAgent(cfg, agentId)) return {
		kind: "skipped",
		reason: "disabled"
	};
	if (!allowsUnscheduledTarget && !resolveHeartbeatIntervalMs(cfg, void 0, heartbeat)) return {
		kind: "skipped",
		reason: "disabled"
	};
	const startedAt = opts.deps?.nowMs?.() ?? Date.now();
	if (!allowsUnscheduledTarget && wakeSource !== "cron" && !isWithinActiveHours(cfg, heartbeat, startedAt)) return {
		kind: "skipped",
		reason: "quiet-hours"
	};
	const shouldInspectExecWakeBeforeBusy = shouldPreflightExecEventWake(wakeSource, opts.scheduledEveryMs, scheduledTasks.length);
	const resolvePreflight = () => resolveHeartbeatPreflight({
		...opts,
		cfg,
		agentId,
		heartbeat,
		source: wakeSource,
		scheduledTasks
	});
	let preflight = shouldInspectExecWakeBeforeBusy ? await resolvePreflight() : void 0;
	if (preflight?.skipReason) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: preflight.skipReason,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: preflight.skipReason
		};
	}
	const getSize = opts.deps?.getQueueSize ?? getQueueSize;
	if (getSize("main") > 0) return {
		kind: "skipped",
		reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
	};
	const owningCronJobMarker = opts.owningCronJobMarker;
	const ownsActiveCronRun = owningCronJobMarker ? isCronActiveJobMarkerCurrent(owningCronJobMarker) : false;
	const cronBusy = ownsActiveCronRun && owningCronJobMarker ? hasActiveCronJobsExceptMarker(owningCronJobMarker) : hasActiveCronJobs();
	const owningCronLaneTaskMarker = opts.owningCronLaneTaskMarker;
	const ownsCronLaneTask = ownsActiveCronRun && owningCronLaneTaskMarker?.lane === "cron" && isCommandLaneTaskMarkerCurrent(owningCronLaneTaskMarker);
	const cronLaneBusy = getSize("cron") > (ownsCronLaneTask ? 1 : 0) || getSize("cron-nested") > 0 || getSize("hook-dispatch") > 0;
	if (cronBusy || cronLaneBusy) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: HEARTBEAT_SKIP_CRON_IN_PROGRESS,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: HEARTBEAT_SKIP_CRON_IN_PROGRESS
		};
	}
	const shouldHonorActiveReplyRuns = opts.intent !== "immediate" && opts.intent !== "manual";
	const listActiveReplyRuns = opts.deps?.listActiveReplyRunSessionKeys ?? listActiveReplyRunSessionKeys;
	const listActiveEmbeddedRuns = opts.deps?.listActiveEmbeddedRunSessionKeys ?? listActiveEmbeddedRunSessionKeys;
	if (shouldHonorActiveReplyRuns && (hasActiveRunForAgent(agentId, listActiveReplyRuns) || hasActiveRunForAgent(agentId, listActiveEmbeddedRuns))) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
		};
	}
	const { sessionKey: recentSessionKey, entry: recentSessionEntry } = resolveHeartbeatSession(cfg, agentId, heartbeat, opts.sessionKey);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const mainSessionRecovery = opts.intent !== "manual" && recentSessionEntry ? transitionMainSessionRecovery(recentSessionEntry, {
		kind: "inspect",
		lifecycleGeneration,
		sessionKey: recentSessionKey
	}) : void 0;
	const activeRestartRecoveryRunId = normalizeOptionalString(recentSessionEntry?.restartRecoveryDeliveryRunId);
	const hasCurrentRestartRecoveryDelivery = opts.intent !== "manual" && activeRestartRecoveryRunId !== void 0 && recentSessionEntry?.restartRecoveryRuns?.some((run) => run.runId === activeRestartRecoveryRunId && run.lifecycleGeneration === lifecycleGeneration) === true;
	if (mainSessionRecovery?.kind === "observed" && (mainSessionRecovery.view.status === "blocked" || mainSessionRecovery.view.status === "recoverable") || hasCurrentRestartRecoveryDelivery) return {
		kind: "skipped",
		reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
	};
	const HEARTBEAT_DEFER_WINDOW_MS = 3e4;
	const pendingFinalDeliveryText = recentSessionEntry?.pendingFinalDelivery?.kind === "replayable" ? recentSessionEntry.pendingFinalDelivery.text : void 0;
	const pendingFinalDeliveryIsHeartbeatAck = typeof pendingFinalDeliveryText === "string" && stripHeartbeatToken(pendingFinalDeliveryText, {
		mode: "heartbeat",
		maxAckChars: resolveHeartbeatAckMaxChars(cfg, heartbeat)
	}).shouldSkip;
	if (recentSessionEntry?.pendingFinalDelivery !== void 0 && !pendingFinalDeliveryIsHeartbeatAck && recentSessionEntry?.updatedAt && startedAt - recentSessionEntry.updatedAt < HEARTBEAT_DEFER_WINDOW_MS) return {
		kind: "skipped",
		reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
	};
	if (!preflight) preflight = await resolvePreflight();
	if (preflight.skipReason) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: preflight.skipReason,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: preflight.skipReason
		};
	}
	const { sessionKey } = preflight.session;
	const isReplyRunActive = opts.deps?.isReplyRunActive ?? ((key) => replyRunRegistry.isActive(key));
	if (isReplyRunActive(sessionKey) || hasActiveRunForSession(sessionKey, listActiveEmbeddedRuns)) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
		};
	}
	if (getSize(resolveEmbeddedSessionLane(sessionKey)) > 0) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
		};
	}
	return {
		kind: "ready",
		cfg,
		agentId,
		wakeSource,
		heartbeat,
		scheduledTasks,
		startedAt,
		listActiveEmbeddedRuns,
		isReplyRunActive,
		preflight
	};
}
async function prepareHeartbeatRunStage(wake) {
	const { cfg, agentId, heartbeat, preflight } = wake;
	const { scheduledTasks, startedAt } = wake;
	const { listActiveEmbeddedRuns, isReplyRunActive } = wake;
	const { entry, sessionKey } = preflight.session;
	const previousUpdatedAt = entry?.updatedAt;
	const useIsolatedSession = heartbeat?.isolatedSession === true;
	const delivery = await resolveHeartbeatDeliveryTargetWithSessionRoute({
		cfg,
		agentId,
		entry,
		heartbeat,
		currentSessionKey: sessionKey,
		turnSource: useIsolatedSession ? void 0 : preflight.turnSourceDeliveryContext
	});
	if (delivery.channel === "none" && delivery.reason === "no-route" && (wake.wakeSource === void 0 || wake.wakeSource === "interval") && preflight.pendingEventEntries.length === 0 && scheduledTasks.length === 0) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: "no-route",
			durationMs: Date.now() - startedAt
		});
		return {
			kind: "skipped",
			reason: "no-route"
		};
	}
	const heartbeatAccountId = heartbeat?.accountId?.trim();
	if (delivery.reason === "unknown-account") log$2.warn("heartbeat: unknown accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId ?? null,
		target: heartbeat?.target ?? "owner"
	});
	else if (heartbeatAccountId) log$2.info("heartbeat: using explicit accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId,
		target: heartbeat?.target ?? "owner",
		channel: delivery.channel
	});
	const visibility = delivery.channel !== "none" ? resolveHeartbeatVisibility({
		cfg,
		channel: delivery.channel,
		accountId: delivery.accountId
	}) : {
		showOk: false,
		showAlerts: true,
		useIndicator: true
	};
	const { sender } = resolveHeartbeatSenderContext({
		cfg,
		entry,
		delivery
	});
	const replyPrefix = createReplyPrefixContext({
		cfg,
		agentId,
		channel: delivery.channel !== "none" ? delivery.channel : void 0,
		accountId: delivery.accountId
	});
	const canRelayToUser = Boolean(delivery.channel !== "none" && delivery.to && visibility.showAlerts);
	let useHeartbeatResponseToolPrompt = shouldUseHeartbeatResponseToolPrompt({
		cfg,
		agentId,
		heartbeat,
		entry,
		sessionKey,
		chatType: delivery.chatType
	});
	let heartbeatRunPrompt = resolveHeartbeatRunPrompt({
		cfg,
		heartbeat,
		preflight,
		canRelayToUser,
		startedAt,
		scheduledTasks,
		heartbeatScratchContent: preflight.heartbeatScratchContent,
		useHeartbeatResponseTool: useHeartbeatResponseToolPrompt
	});
	if (heartbeatRunPrompt.prompt === null) {
		const shouldConsumeInspectedEvents = !preflight.isWakePayload && preflight.shouldInspectPendingEvents;
		const inspectedSystemEventsToConsume = selectSystemEventsConsumedByHeartbeat({
			preflight,
			hasExecCompletion: heartbeatRunPrompt.hasExecCompletion,
			hasCronEvents: heartbeatRunPrompt.hasCronEvents
		});
		if (shouldConsumeInspectedEvents && inspectedSystemEventsToConsume.length > 0) consumeSelectedSystemEventEntries(sessionKey, inspectedSystemEventsToConsume);
		return {
			kind: "skipped",
			reason: "not-due"
		};
	}
	let runSessionKey = sessionKey;
	let runSessionEntry = entry;
	let outboundPolicySessionKey;
	if (useIsolatedSession) {
		const { isolatedSessionKey, isolatedBaseSessionKey } = resolveIsolatedHeartbeatSessionKey({
			agentId,
			sessionKey,
			configuredSessionKey: resolveHeartbeatSession(cfg, agentId, heartbeat).sessionKey,
			sessionEntry: entry
		});
		const isolatedStorePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const staleIsolatedSessionKey = resolveStaleHeartbeatIsolatedSessionKey({
			sessionKey,
			isolatedSessionKey,
			isolatedBaseSessionKey
		});
		if (isReplyRunActive(isolatedSessionKey) || hasActiveRunForSession(isolatedSessionKey, listActiveEmbeddedRuns)) {
			emitHeartbeatEvent({
				status: "skipped",
				reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
				durationMs: Date.now() - startedAt
			});
			return {
				kind: "skipped",
				reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
			};
		}
		const staleIsolatedEntry = staleIsolatedSessionKey ? loadExactSessionEntry({
			storePath: isolatedStorePath,
			sessionKey: staleIsolatedSessionKey
		})?.entry : void 0;
		const lifecycleResult = await applySessionEntryLifecycleMutation({
			activeSessionKey: isolatedSessionKey,
			storePath: isolatedStorePath,
			removals: staleIsolatedSessionKey ? [{
				sessionKey: staleIsolatedSessionKey,
				...staleIsolatedEntry ? { expectedEntry: staleIsolatedEntry } : {},
				...staleIsolatedEntry?.sessionId ? { expectedSessionId: staleIsolatedEntry.sessionId } : {},
				archiveRemovedTranscript: true
			}] : [],
			upserts: [{
				sessionKey: isolatedSessionKey,
				buildEntry: ({ store }) => {
					const nextEntry = {
						...resolveCronSession({
							cfg,
							sessionKey: isolatedSessionKey,
							agentId,
							nowMs: startedAt,
							forceNew: true,
							store
						}).sessionEntry,
						heartbeatIsolatedBaseSessionKey: isolatedBaseSessionKey
					};
					runSessionEntry = nextEntry;
					return nextEntry;
				}
			}],
			captureArtifactCleanupError: true
		});
		if (lifecycleResult.artifactCleanupError) log$2.warn("heartbeat: failed to archive stale isolated session transcript", {
			err: formatErrorMessage(lifecycleResult.artifactCleanupError),
			sessionKey: staleIsolatedSessionKey
		});
		runSessionKey = isolatedSessionKey;
		outboundPolicySessionKey = isolatedBaseSessionKey;
		const actualUseHeartbeatResponseToolPrompt = shouldUseHeartbeatResponseToolPrompt({
			cfg,
			agentId,
			heartbeat,
			entry: runSessionEntry,
			sessionKey: runSessionKey,
			chatType: delivery.chatType
		});
		if (actualUseHeartbeatResponseToolPrompt !== useHeartbeatResponseToolPrompt) {
			useHeartbeatResponseToolPrompt = actualUseHeartbeatResponseToolPrompt;
			heartbeatRunPrompt = resolveHeartbeatRunPrompt({
				cfg,
				heartbeat,
				preflight,
				canRelayToUser,
				startedAt,
				scheduledTasks,
				heartbeatScratchContent: preflight.heartbeatScratchContent,
				useHeartbeatResponseTool: useHeartbeatResponseToolPrompt
			});
		}
	}
	const { hasExecCompletion, hasCronEvents } = heartbeatRunPrompt;
	const prompt = heartbeatRunPrompt.prompt;
	if (prompt === null) return {
		kind: "skipped",
		reason: "not-due"
	};
	return {
		kind: "ready",
		...preflight.session,
		previousUpdatedAt,
		delivery,
		visibility,
		sender,
		replyPrefix,
		runSessionKey,
		outboundPolicySessionKey,
		...heartbeatRunPrompt,
		prompt,
		inspectedSystemEventsToConsume: selectSystemEventsConsumedByHeartbeat({
			preflight,
			hasExecCompletion,
			hasCronEvents
		})
	};
}
async function invokeHeartbeatAgentRun(opts, wake, prepared) {
	const { cfg, agentId, heartbeat, startedAt, preflight } = wake;
	const { delivery, hasExecCompletion, hasCronEvents, prompt } = prepared;
	const { replyPrefix, runSessionKey, sender, suppressOriginatingContext } = prepared;
	const { usesHeartbeatResponseTool } = prepared;
	const replyOperationRunState = {};
	const heartbeatModelOverride = normalizeOptionalString(heartbeat?.model);
	const getReplyFromConfig = opts.deps?.getReplyFromConfig ?? (await loadHeartbeatRunnerRuntime()).getReplyFromConfig;
	const heartbeatWakeAbortSignal = getHeartbeatWakeAbortSignal();
	const replyOpts = {
		isHeartbeat: true,
		[REPLY_OPERATION_RUN_STATE]: replyOperationRunState,
		...heartbeatModelOverride ? { heartbeatModelOverride } : {},
		suppressToolErrorWarnings: false,
		...usesHeartbeatResponseTool ? {
			enableHeartbeatTool: true,
			forceHeartbeatTool: true
		} : {},
		...usesHeartbeatResponseTool ? { sourceReplyDeliveryMode: "message_tool_only" } : {},
		...heartbeatWakeAbortSignal ? { abortSignal: heartbeatWakeAbortSignal } : {},
		timeoutOverrideSeconds: resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat),
		bootstrapContextMode: heartbeat?.lightContext === true ? "lightweight" : void 0,
		onModelSelected: replyPrefix.onModelSelected
	};
	const replyResult = await getReplyFromConfig({
		Body: appendCronStyleCurrentTimeLine(prompt, cfg, startedAt),
		From: sender,
		To: sender,
		OriginatingChannel: !suppressOriginatingContext && delivery.channel !== "none" ? delivery.channel : void 0,
		OriginatingTo: !suppressOriginatingContext ? delivery.to : void 0,
		AccountId: delivery.accountId,
		MessageThreadId: delivery.threadId,
		Provider: hasExecCompletion ? "exec-event" : hasCronEvents ? "cron-event" : "heartbeat",
		SessionKey: runSessionKey,
		AgentId: agentId
	}, replyOpts, cfg);
	const agentTurnStatus = resolveReplyOperationAgentTurn(replyOperationRunState);
	if (agentTurnStatus === "superseded") return { kind: "preempted" };
	const heartbeatToolResponse = resolveHeartbeatToolResponseFromReplyResult(replyResult);
	const heartbeatScratchProposal = resolveHeartbeatScratchProposalFromReplyResult(replyResult);
	const heartbeatTerminalToolFailure = resolveHeartbeatTerminalToolFailure(replyResult);
	const replyPayload = resolveHeartbeatReplyPayload(replyResult);
	const agentRunFailed = agentTurnStatus === "failed";
	if (heartbeatScratchProposal !== void 0 && heartbeatToolResponse && !heartbeatTerminalToolFailure) if (!preflight.scratchJobId) log$2.warn("heartbeat: scratch update ignored because no monitor job exists");
	else try {
		if (!writeCronJobScratch({
			storePath: resolveCronJobsStorePathFromConfig(cfg),
			jobId: preflight.scratchJobId,
			content: heartbeatScratchProposal,
			expectedRevision: preflight.scratchRevision ?? 0
		}).ok) log$2.warn("heartbeat: scratch update lost a concurrent revision race");
	} catch (error) {
		log$2.warn(`heartbeat: scratch update failed: ${formatErrorMessage(error)}`);
	}
	if (!heartbeatToolResponse && (!replyPayload || !hasOutboundReplyContent(replyPayload)) && replyOperationRunState.admission?.status === "skipped" && replyOperationRunState.admission.reason === "active-run") return { kind: "busy" };
	return {
		kind: "completed",
		heartbeatToolResponse,
		heartbeatTerminalToolFailure,
		agentRunFailed,
		replyPayload
	};
}
//#endregion
//#region src/infra/heartbeat-typing.ts
const DEFAULT_HEARTBEAT_TYPING_INTERVAL_SECONDS = 6;
/** Create typing start/stop/keepalive callbacks for a heartbeat delivery target. */
function createHeartbeatTypingCallbacks(params) {
	const sendTyping = params.plugin?.heartbeat?.sendTyping;
	const to = params.target.to?.trim();
	if (!sendTyping || !to) return;
	const clearTyping = params.plugin?.heartbeat?.clearTyping;
	const keepaliveIntervalMs = typeof params.typingIntervalSeconds === "number" && params.typingIntervalSeconds > 0 ? params.typingIntervalSeconds * 1e3 : DEFAULT_HEARTBEAT_TYPING_INTERVAL_SECONDS * 1e3;
	const target = {
		cfg: params.cfg,
		to,
		...params.target.accountId !== void 0 ? { accountId: params.target.accountId } : {},
		...params.target.threadId !== void 0 ? { threadId: params.target.threadId } : {},
		...params.deps ? { deps: params.deps } : {}
	};
	return createTypingCallbacks({
		start: async () => {
			await sendTyping(target);
		},
		...clearTyping ? { stop: async () => {
			await clearTyping(target);
		} } : {},
		...keepaliveIntervalMs ? { keepaliveIntervalMs } : {},
		onStartError: (err) => {
			params.log?.debug?.(`heartbeat typing failed for ${params.target.channel}`, {
				error: String(err),
				channel: params.target.channel,
				accountId: params.target.accountId
			});
		}
	});
}
//#endregion
//#region src/infra/heartbeat-runner-run.ts
const log$1 = heartbeatLog;
async function runHeartbeatOnce(opts) {
	const wake = await resolveHeartbeatWakeStage(opts);
	if (wake.kind === "skipped") return {
		status: "skipped",
		reason: wake.reason
	};
	const prepared = await prepareHeartbeatRunStage(wake);
	if (prepared.kind === "skipped") return {
		status: "skipped",
		reason: prepared.reason
	};
	const { cfg, agentId, heartbeat, startedAt } = wake;
	const { delivery, visibility, replyPrefix, runSessionKey } = prepared;
	const { outboundPolicySessionKey, hasRelayableExecCompletion } = prepared;
	if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: "alerts-disabled",
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId
		});
		return {
			status: "skipped",
			reason: "alerts-disabled"
		};
	}
	const resolveHeartbeatResponsePrefix = () => resolveResponsePrefixTemplate(replyPrefix.responsePrefix, replyPrefix.responsePrefixContextProvider());
	const resolveHeartbeatOkText = () => {
		const responsePrefix = resolveHeartbeatResponsePrefix();
		return responsePrefix ? `${responsePrefix} ${HEARTBEAT_TOKEN}` : HEARTBEAT_TOKEN;
	};
	const outboundSession = buildOutboundSessionContext({
		cfg,
		agentId,
		sessionKey: runSessionKey,
		policySessionKey: outboundPolicySessionKey
	});
	const outboundIdentity = resolveAgentOutboundIdentity(cfg, agentId);
	const canAttemptHeartbeatOk = Boolean(visibility.showOk && delivery.channel !== "none" && delivery.to);
	const hasChatDelivery = Boolean(delivery.channel !== "none" && delivery.to && (visibility.showAlerts || visibility.showOk));
	const heartbeatTypingIntervalSeconds = resolveHeartbeatTypingIntervalSeconds(cfg);
	const heartbeatChannelPlugin = delivery.channel !== "none" ? resolveHeartbeatChannelPlugin(delivery.channel) : void 0;
	const heartbeatTyping = delivery.channel !== "none" && isHeartbeatTypingEnabled({
		cfg,
		agentId,
		hasChatDelivery
	}) ? createHeartbeatTypingCallbacks({
		cfg,
		target: {
			channel: delivery.channel,
			...delivery.to !== void 0 ? { to: delivery.to } : {},
			...delivery.accountId !== void 0 ? { accountId: delivery.accountId } : {},
			...delivery.threadId !== void 0 ? { threadId: delivery.threadId } : {}
		},
		...heartbeatChannelPlugin ? { plugin: heartbeatChannelPlugin } : {},
		...opts.deps ? { deps: opts.deps } : {},
		...heartbeatTypingIntervalSeconds !== void 0 ? { typingIntervalSeconds: heartbeatTypingIntervalSeconds } : {},
		log: log$1
	}) : void 0;
	const maybeSendHeartbeatOk = async () => {
		if (!canAttemptHeartbeatOk || delivery.channel === "none" || !delivery.to) return false;
		try {
			const heartbeatPlugin = resolveHeartbeatChannelPlugin(delivery.channel);
			if (heartbeatPlugin?.heartbeat?.checkReady) {
				if (!(await heartbeatPlugin.heartbeat.checkReady({
					cfg,
					accountId: delivery.accountId,
					deps: opts.deps
				})).ok) return false;
			}
			const send = await sendDurableMessageBatchCore({
				cfg,
				channel: delivery.channel,
				to: delivery.to,
				accountId: delivery.accountId,
				threadId: delivery.threadId,
				payloads: [{ text: resolveHeartbeatOkText() }],
				session: outboundSession,
				identity: outboundIdentity,
				deps: opts.deps
			});
			if (send.status === "failed" || send.status === "partial_failed") throw send.error;
			return send.status === "sent";
		} catch (err) {
			log$1.warn(`heartbeat: HEARTBEAT_OK delivery failed: ${formatErrorMessage(err)}`);
			return false;
		}
	};
	try {
		await heartbeatTyping?.onReplyStart();
		const agentRun = await invokeHeartbeatAgentRun(opts, wake, prepared);
		if (agentRun.kind === "busy") {
			emitHeartbeatEvent({
				status: "skipped",
				reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT,
				durationMs: Date.now() - startedAt
			});
			return {
				status: "skipped",
				reason: HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT
			};
		}
		if (agentRun.kind === "preempted") {
			emitHeartbeatEvent({
				status: "skipped",
				reason: HEARTBEAT_SKIP_PREEMPTED,
				durationMs: Date.now() - startedAt
			});
			return {
				status: "skipped",
				reason: HEARTBEAT_SKIP_PREEMPTED
			};
		}
		return await finalizeHeartbeatOutcome({
			opts,
			wake,
			prepared,
			outcome: classifyHeartbeatAgentOutcome({
				agentRun,
				hasRelayableExecCompletion,
				suppressUnmarkedSourceReplies: resolveSourceReplyDeliveryMode({
					cfg,
					ctx: {
						ChatType: delivery.chatType,
						Provider: delivery.channel
					}
				}) === "message_tool_only",
				responsePrefix: resolveHeartbeatResponsePrefix(),
				ackMaxChars: resolveHeartbeatAckMaxChars(cfg, heartbeat)
			}),
			maybeSendHeartbeatOk,
			outboundSession,
			outboundIdentity
		});
	} catch (err) {
		const reason = formatErrorMessage(err);
		emitHeartbeatEvent({
			status: "failed",
			reason,
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId,
			indicatorType: visibility.useIndicator ? resolveIndicatorType("failed") : void 0
		});
		log$1.error(`heartbeat failed: ${reason}`, { error: reason });
		return {
			status: "failed",
			reason
		};
	} finally {
		heartbeatTyping?.onCleanup?.();
	}
}
//#endregion
//#region src/infra/heartbeat-cooldown.ts
const DEFAULT_MIN_WAKE_SPACING_MS = 3e4;
const DEFAULT_FLOOD_WINDOW_MS = 6e4;
const DEFAULT_FLOOD_THRESHOLD = 5;
/**
* Decide whether an incoming wake should be deferred.
*
* The decision matrix:
*
* | Wake intent   | First wake (no prior run) | Subsequent wakes                       |
* |---------------|----------------------------|-----------------------------------------|
* | manual        | Run                        | Run (never deferred)                    |
* | immediate     | Run                        | Run (never deferred, except flood)      |
* | scheduled     | Defer if now < nextDueMs   | Defer if now < nextDueMs                |
* | task          | Run                        | Defer only within floor or on flood      |
* | event         | Run (bootstrap responsive) | Defer if now < nextDueMs OR within floor |
*
* Immediate is for documented wake-now delivery paths such as `openclaw system
* event --mode now`, task completion follow-ups, cron `--wake now`, and
* `/hooks/wake mode=now`. Event is for external/system notifications such as
* background exec exits, node notification changes, hook/cron next-heartbeat
* handoffs, ACP spawn stream updates, and retry wakes.
*
* Additional gates layered on top of the reason matrix:
*
*   1. **Minimum spacing floor** (`min-spacing`): even if `nextDueMs` has been
*      passed, defer if a run started within the last `minSpacingMs`. Catches
*      the race where a second wake arrives between `runOnce` returning and
*      `advanceAgentSchedule` updating `nextDueMs`.
*   2. **Flood guard** (`flood`): if `recentRunStarts` shows ≥ `floodThreshold`
*      runs within `floodWindowMs`, defer regardless of reason (except
*      `manual`-class immediate intent). Caller should also emit a single
*      warning log when this fires.
*/
function shouldDeferWake(input) {
	if (input.intent === "manual") return { defer: false };
	if (input.intent === "immediate") return checkFloodGuard(input) ?? { defer: false };
	if (input.intent === "task") {
		const floodDefer = checkFloodGuard(input);
		if (floodDefer) return floodDefer;
		const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
		if (spacingRetryAtMs !== void 0) return {
			defer: true,
			reason: "min-spacing",
			retryAtMs: spacingRetryAtMs
		};
		return { defer: false };
	}
	const floodDefer = checkFloodGuard(input);
	if (floodDefer) return floodDefer;
	if (input.intent === "scheduled") return input.now < input.nextDueMs ? {
		defer: true,
		reason: "not-due",
		retryAtMs: input.nextDueMs
	} : { defer: false };
	if (input.lastRunStartedAtMs === void 0) return { defer: false };
	if (!input.retainedWork && input.now < input.nextDueMs) {
		const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
		return {
			defer: true,
			reason: "not-due",
			retryAtMs: Math.min(input.nextDueMs, spacingRetryAtMs ?? input.nextDueMs)
		};
	}
	const spacingRetryAtMs = resolveMinSpacingRetryAtMs(input);
	if (spacingRetryAtMs !== void 0) return {
		defer: true,
		reason: "min-spacing",
		retryAtMs: spacingRetryAtMs
	};
	return { defer: false };
}
function resolveMinSpacingRetryAtMs(input) {
	const minSpacing = input.minSpacingMs ?? DEFAULT_MIN_WAKE_SPACING_MS;
	if (minSpacing <= 0 || input.lastRunStartedAtMs === void 0) return;
	const retryAtMs = input.lastRunStartedAtMs + minSpacing;
	return input.now < retryAtMs ? retryAtMs : void 0;
}
function checkFloodGuard(input) {
	const floodWindow = input.floodWindowMs ?? DEFAULT_FLOOD_WINDOW_MS;
	const floodThreshold = input.floodThreshold ?? DEFAULT_FLOOD_THRESHOLD;
	if (!input.recentRunStarts || input.recentRunStarts.length < floodThreshold || floodWindow <= 0) return null;
	const windowStart = input.now - floodWindow;
	let inWindow = 0;
	let thresholdOldestTs;
	for (let i = input.recentRunStarts.length - 1; i >= 0; i--) {
		const ts = input.recentRunStarts[i];
		if (ts === void 0 || ts < windowStart) break;
		inWindow += 1;
		if (inWindow === floodThreshold) thresholdOldestTs = ts;
	}
	return inWindow >= floodThreshold && thresholdOldestTs !== void 0 ? {
		defer: true,
		reason: "flood",
		retryAtMs: thresholdOldestTs + floodWindow + 1
	} : null;
}
/**
* Append a run-start timestamp to a bounded recent-runs buffer. Caller passes
* the previous buffer; this returns a new (mutated) buffer with the entry
* appended and trimmed to `floodThreshold + 1` entries (only the newest matter
* for flood detection).
*/
function recordRunStart(buffer, ts, floodThreshold = DEFAULT_FLOOD_THRESHOLD) {
	buffer.push(ts);
	const max = floodThreshold + 1;
	while (buffer.length > max) buffer.shift();
	return buffer;
}
//#endregion
//#region src/infra/heartbeat-schedule.ts
function resolvePositiveIntervalMs(value) {
	return resolveIntegerOption(value, 1, { min: 1 });
}
function normalizeModulo(value, divisor) {
	return (value % divisor + divisor) % divisor;
}
function resolveHeartbeatPhaseMs(params) {
	const intervalMs = resolvePositiveIntervalMs(params.intervalMs);
	return createHash("sha256").update(`${params.schedulerSeed}:${params.agentId}`).digest().readUInt32BE(0) % intervalMs;
}
function computeNextHeartbeatPhaseDueMs(params) {
	const intervalMs = resolvePositiveIntervalMs(params.intervalMs);
	const nowMs = Number.isFinite(params.nowMs) ? Math.floor(params.nowMs) : 0;
	let deltaMs = normalizeModulo(normalizeModulo(Number.isFinite(params.phaseMs) ? Math.floor(params.phaseMs) : 0, intervalMs) - normalizeModulo(nowMs, intervalMs), intervalMs);
	if (deltaMs === 0) deltaMs = intervalMs;
	return nowMs + deltaMs;
}
function resolveNextHeartbeatDueMs(params) {
	const intervalMs = resolvePositiveIntervalMs(params.intervalMs);
	const phaseMs = normalizeModulo(Number.isFinite(params.phaseMs) ? Math.floor(params.phaseMs) : 0, intervalMs);
	const prev = params.prev;
	if (prev && prev.intervalMs === intervalMs && prev.phaseMs === phaseMs && prev.nextDueMs > params.nowMs) return prev.nextDueMs;
	return computeNextHeartbeatPhaseDueMs({
		nowMs: params.nowMs,
		intervalMs,
		phaseMs
	});
}
/**
* Seek forward through phase-aligned slots until one falls within the active
* hours window.  Falls back to the raw next slot when no predicate is provided
* or no in-window slot is found within the seek horizon.
*
* The caller binds config/heartbeat into `isActive` so this module stays
* config-agnostic.  `phaseMs` is unused — alignment is preserved because
* `startMs` is already phase-aligned and `intervalMs` addition maintains it.
*/
const MAX_SEEK_HORIZON_MS = 10080 * 6e4;
const MIN_SEEK_STEP_MS = 3e4;
function seekNextActivePhaseDueMs(params) {
	const isActive = params.isActive;
	if (!isActive) return params.startMs;
	const intervalMs = resolvePositiveIntervalMs(params.intervalMs);
	const horizonMs = params.startMs + MAX_SEEK_HORIZON_MS;
	const multiplier = Math.max(1, Math.ceil(MIN_SEEK_STEP_MS / intervalMs));
	const batchStepMs = intervalMs * multiplier;
	let candidateMs = params.startMs;
	let previousInactiveMs;
	while (candidateMs < horizonMs) {
		if (isActive(candidateMs)) {
			if (previousInactiveMs !== void 0 && multiplier > 1) {
				let inactiveMs = previousInactiveMs;
				let activeMs = candidateMs;
				while (activeMs - inactiveMs > intervalMs) {
					const remainingSteps = (activeMs - inactiveMs) / intervalMs;
					const probeMs = inactiveMs + Math.floor(remainingSteps / 2) * intervalMs;
					if (isActive(probeMs)) activeMs = probeMs;
					else inactiveMs = probeMs;
				}
				return activeMs;
			}
			return candidateMs;
		}
		previousInactiveMs = candidateMs;
		candidateMs += batchStepMs;
	}
	return params.startMs;
}
//#endregion
//#region src/infra/heartbeat-runner-scheduler.ts
const log = heartbeatLog;
function startHeartbeatRunner(opts) {
	const runtime = opts.runtime ?? defaultRuntime;
	const runOnce = opts.runOnce ?? runHeartbeatOnce;
	const state = {
		cfg: opts.cfg ?? getRuntimeConfig(),
		runtime,
		schedulerSeed: resolveHeartbeatSchedulerSeed(opts.stableSchedulerSeed),
		agents: /* @__PURE__ */ new Map(),
		stopped: false
	};
	const readCurrentConfig = opts.readCurrentConfig ?? (() => state.cfg);
	let initialized = false;
	const resolveNextDue = (now, intervalMs, phaseMs, prevState) => resolveNextHeartbeatDueMs({
		nowMs: now,
		intervalMs,
		phaseMs,
		prev: prevState ? {
			intervalMs: prevState.intervalMs,
			phaseMs: prevState.phaseMs,
			nextDueMs: prevState.nextDueMs
		} : void 0
	});
	const seekActiveSlotForAgent = (agent, rawDueMs) => {
		const isActive = createActiveHoursPredicate(state.cfg, agent.heartbeat);
		return seekNextActivePhaseDueMs({
			startMs: rawDueMs,
			intervalMs: agent.intervalMs,
			phaseMs: agent.phaseMs,
			isActive
		});
	};
	const advanceAgentSchedule = (agent, now, reason) => {
		const rawDueMs = reason === "interval" ? computeNextHeartbeatPhaseDueMs({
			nowMs: now,
			intervalMs: agent.intervalMs,
			phaseMs: agent.phaseMs
		}) : now + agent.intervalMs;
		agent.nextDueMs = seekActiveSlotForAgent(agent, rawDueMs);
	};
	const applyScheduledCadence = (agent, intervalMs, anchorMs) => {
		if (intervalMs === void 0) return;
		agent.intervalMs = intervalMs;
		agent.phaseMs = anchorMs ?? resolveHeartbeatPhaseMs({
			schedulerSeed: state.schedulerSeed,
			agentId: agent.agentId,
			intervalMs
		});
		agent.heartbeat = {
			...agent.heartbeat,
			every: `${intervalMs}ms`
		};
	};
	const advanceStaleScheduleAfterDeferral = (agent, now, reason, decision, options = {}) => {
		if (!decision?.defer || decision.reason === "not-due" || agent.nextDueMs > now || options.execEventWake && !options.authoritativeScheduledTick) return;
		advanceAgentSchedule(agent, now, reason);
	};
	const evaluateWakeDeferral = (agent, now, reason, intent = "event", options = {}) => {
		const decision = shouldDeferWake({
			intent,
			reason,
			now,
			nextDueMs: options.authoritativeScheduledTick ? now : agent.nextDueMs,
			lastRunStartedAtMs: agent.lastRunStartedAtMs,
			recentRunStarts: agent.recentRunStarts,
			retainedWork: options.retainedWork
		});
		if (decision.defer && decision.reason === "flood") {
			if (!agent.floodLoggedSinceLastRun) {
				log.warn("heartbeat: flood guard tripped, deferring wake", {
					agentId: agent.agentId,
					reason: reason ?? "(none)",
					recentRunCount: agent.recentRunStarts.length
				});
				agent.floodLoggedSinceLastRun = true;
			}
		}
		return decision;
	};
	const recordRunBookkeeping = (agent, now) => {
		agent.lastRunStartedAtMs = now;
		recordRunStart(agent.recentRunStarts, now);
		agent.floodLoggedSinceLastRun = false;
	};
	const updateConfig = (cfg) => {
		if (state.stopped) return;
		const now = Date.now();
		const prevAgents = state.agents;
		const prevEnabled = prevAgents.size > 0;
		const nextAgents = /* @__PURE__ */ new Map();
		const intervals = [];
		for (const agent of resolveHeartbeatAgents(cfg)) {
			const intervalMs = resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat);
			if (!intervalMs) continue;
			const phaseMs = resolveHeartbeatPhaseMs({
				schedulerSeed: state.schedulerSeed,
				agentId: agent.agentId,
				intervalMs
			});
			intervals.push(intervalMs);
			const prevState = prevAgents.get(agent.agentId);
			const activeHoursSchedule = resolveActiveHoursSchedule(cfg, agent.heartbeat);
			const ahChanged = prevState && !activeHoursConfigMatch(prevState.activeHoursSchedule, activeHoursSchedule);
			const nextDueMs = seekNextActivePhaseDueMs({
				startMs: resolveNextDue(now, intervalMs, phaseMs, ahChanged ? void 0 : prevState),
				intervalMs,
				phaseMs,
				isActive: createActiveHoursPredicate(cfg, agent.heartbeat)
			});
			nextAgents.set(agent.agentId, {
				agentId: agent.agentId,
				heartbeat: agent.heartbeat,
				activeHoursSchedule,
				intervalMs,
				phaseMs,
				nextDueMs,
				lastRunStartedAtMs: prevState?.lastRunStartedAtMs,
				recentRunStarts: prevState?.recentRunStarts ?? [],
				floodLoggedSinceLastRun: prevState?.floodLoggedSinceLastRun ?? false
			});
		}
		state.cfg = cfg;
		state.agents = nextAgents;
		const nextEnabled = nextAgents.size > 0;
		if (!initialized) {
			if (!nextEnabled) log.info("heartbeat: disabled", { enabled: false });
			else log.info("heartbeat: started", { intervalMs: Math.min(...intervals) });
			initialized = true;
		} else if (prevEnabled !== nextEnabled) if (!nextEnabled) log.info("heartbeat: disabled", { enabled: false });
		else log.info("heartbeat: started", { intervalMs: Math.min(...intervals) });
	};
	const run = async (params) => {
		if (state.stopped) return {
			status: "skipped",
			reason: "disabled"
		};
		if (!areHeartbeatsEnabled()) return {
			status: "skipped",
			reason: "disabled"
		};
		const reason = params.reason;
		const intent = params.intent;
		const execEventWake = params.source === "exec-event";
		const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
		const requestedSessionKey = normalizeOptionalString(params.sessionKey);
		const requestedHeartbeat = params.heartbeat;
		const scheduledEveryMs = typeof params.scheduledEveryMs === "number" && Number.isSafeInteger(params.scheduledEveryMs) && params.scheduledEveryMs > 0 ? params.scheduledEveryMs : void 0;
		const authoritativeScheduledTick = scheduledEveryMs !== void 0;
		const scheduledAnchorMs = typeof params.scheduledAnchorMs === "number" && Number.isSafeInteger(params.scheduledAnchorMs) && params.scheduledAnchorMs >= 0 ? params.scheduledAnchorMs : void 0;
		const requestedTasks = params.tasks ?? [];
		const retainedWork = params.retainedWork === true;
		const wakeConfig = readCurrentConfig();
		const requestedTargetAgentId = requestedAgentId ?? (requestedSessionKey ? resolveAgentIdFromSessionKey(requestedSessionKey) : void 0);
		const allowsUnscheduledTarget = requestedTargetAgentId !== void 0 && isConfiguredHeartbeatAgent(wakeConfig, requestedTargetAgentId) && isTargetedImmediateUnscheduledWake({
			source: params.source,
			intent,
			reason,
			agentId: requestedAgentId,
			sessionKey: requestedSessionKey
		});
		if (state.agents.size === 0 && !allowsUnscheduledTarget) return {
			status: "skipped",
			reason: "disabled"
		};
		const isInterval = reason === "interval";
		const startedAt = Date.now();
		const now = startedAt;
		let ran = false;
		const runOneAgent = async (agent, scheduledTickIsAuthoritative = false) => {
			const deferral = evaluateWakeDeferral(agent, now, reason, intent, {
				authoritativeScheduledTick: scheduledTickIsAuthoritative,
				retainedWork
			});
			if (deferral.defer) {
				advanceStaleScheduleAfterDeferral(agent, now, reason, deferral, {
					authoritativeScheduledTick: scheduledTickIsAuthoritative,
					execEventWake
				});
				return {
					ran: false,
					result: {
						status: "skipped",
						reason: deferral.reason,
						retryAtMs: deferral.retryAtMs
					}
				};
			}
			let res;
			try {
				res = await runOnce({
					cfg: wakeConfig,
					agentId: agent.agentId,
					heartbeat: agent.heartbeat,
					source: params.source,
					intent,
					reason,
					...scheduledEveryMs !== void 0 ? { scheduledEveryMs } : {},
					tasks: requestedTasks,
					deps: { runtime: state.runtime }
				});
			} catch (err) {
				const errMsg = formatErrorMessage(err);
				log.error(`heartbeat runner: runOnce threw unexpectedly: ${errMsg}`, {
					error: errMsg,
					agentId: agent.agentId
				});
				recordRunBookkeeping(agent, now);
				advanceAgentSchedule(agent, now, reason);
				return {
					ran: false,
					result: {
						status: "failed",
						reason: formatErrorMessage(err)
					}
				};
			}
			if (res.status === "skipped" && isRetryableHeartbeatSkipReason(res.reason)) return {
				ran: false,
				retryableSkip: res
			};
			if (params.source === "exec-event" && res.status === "skipped" && res.reason === "no-pending-event") return {
				ran: false,
				result: res
			};
			recordRunBookkeeping(agent, now);
			advanceAgentSchedule(agent, now, reason);
			return {
				ran: res.status === "ran",
				result: res
			};
		};
		if (requestedSessionKey || requestedAgentId) {
			const targetAgentId = requestedTargetAgentId ?? resolveAmbientHeartbeatAgentId(wakeConfig);
			const targetAgent = state.agents.get(targetAgentId);
			if (targetAgent && authoritativeScheduledTick) applyScheduledCadence(targetAgent, scheduledEveryMs, scheduledAnchorMs);
			if (!targetAgent && !allowsUnscheduledTarget) return {
				status: "skipped",
				reason: "disabled"
			};
			if ((isInterval || authoritativeScheduledTick) && targetAgent && !requestedSessionKey && !requestedHeartbeat) {
				const outcome = await runOneAgent(targetAgent, authoritativeScheduledTick);
				if (outcome.retryableSkip) return outcome.retryableSkip;
				if (outcome.ran) return {
					status: "ran",
					durationMs: Date.now() - startedAt
				};
				return outcome.result ?? {
					status: "skipped",
					reason: "not-due"
				};
			}
			if (targetAgent) {
				const deferral = evaluateWakeDeferral(targetAgent, now, reason, intent, {
					authoritativeScheduledTick,
					retainedWork
				});
				if (deferral.defer) {
					advanceStaleScheduleAfterDeferral(targetAgent, now, reason, deferral, {
						authoritativeScheduledTick,
						execEventWake
					});
					return {
						status: "skipped",
						reason: deferral.reason,
						retryAtMs: deferral.retryAtMs
					};
				}
			}
			try {
				const res = await runOnce({
					cfg: wakeConfig,
					agentId: targetAgentId,
					heartbeat: resolveHeartbeatForWake({
						cfg: wakeConfig,
						agentId: targetAgentId,
						configuredHeartbeat: targetAgent?.heartbeat,
						requestedHeartbeat,
						source: params.source,
						mergeRequestedHeartbeat: true
					}),
					source: params.source,
					intent,
					reason,
					...scheduledEveryMs !== void 0 ? { scheduledEveryMs } : {},
					sessionKey: requestedSessionKey,
					tasks: requestedTasks,
					deps: { runtime: state.runtime }
				});
				if (res.status === "skipped" && isRetryableHeartbeatSkipReason(res.reason)) return res;
				if (params.source === "exec-event" && res.status === "skipped" && res.reason === "no-pending-event") return res;
				if (targetAgent) {
					recordRunBookkeeping(targetAgent, now);
					advanceAgentSchedule(targetAgent, now, reason);
				}
				return res.status === "ran" ? {
					status: "ran",
					durationMs: Date.now() - startedAt
				} : res;
			} catch (err) {
				const errMsg = formatErrorMessage(err);
				log.error(`heartbeat runner: targeted runOnce threw unexpectedly: ${errMsg}`, { error: errMsg });
				if (targetAgent) {
					recordRunBookkeeping(targetAgent, now);
					advanceAgentSchedule(targetAgent, now, reason);
				}
				return {
					status: "failed",
					reason: errMsg
				};
			}
		}
		if (authoritativeScheduledTick) for (const agent of state.agents.values()) applyScheduledCadence(agent, scheduledEveryMs, scheduledAnchorMs);
		const agentOutcomes = await Promise.all(Array.from(state.agents.values()).map((agent) => runOneAgent(agent, authoritativeScheduledTick)));
		let firstRetryableSkip;
		for (const outcome of agentOutcomes) {
			if (outcome.ran) ran = true;
			if (outcome.retryableSkip && !firstRetryableSkip) firstRetryableSkip = outcome.retryableSkip;
		}
		if (firstRetryableSkip) return firstRetryableSkip;
		if (ran) return {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
		return {
			status: "skipped",
			reason: isInterval ? "not-due" : "disabled"
		};
	};
	const wakeHandler = async (params) => run({
		reason: params.reason,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		heartbeat: params.heartbeat,
		scheduledEveryMs: params.scheduledEveryMs,
		scheduledAnchorMs: params.scheduledAnchorMs,
		tasks: params.tasks,
		retainedWork: params.retainedWork,
		source: params.source,
		intent: params.intent
	});
	const disposeWakeHandler = setHeartbeatWakeHandler(wakeHandler);
	updateConfig(state.cfg);
	const cleanup = () => {
		if (state.stopped) return;
		state.stopped = true;
		opts.abortSignal?.removeEventListener("abort", cleanup);
		disposeWakeHandler();
	};
	if (opts.abortSignal?.aborted) cleanup();
	else opts.abortSignal?.addEventListener("abort", cleanup, { once: true });
	return {
		stop: cleanup,
		updateConfig
	};
}
//#endregion
export { resolveHeartbeatPhaseMs as n, runHeartbeatOnce as r, startHeartbeatRunner as t };
