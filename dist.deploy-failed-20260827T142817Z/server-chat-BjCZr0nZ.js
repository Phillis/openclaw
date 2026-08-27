import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, l as parseCronRunScopeSuffix, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "./io-D1h6pxaD.js";
import { u as normalizeVerboseLevel } from "./thinking.shared-bHYuuc1L.js";
import { n as logError } from "./logger-DKrZPnAI.js";
import { t as setSafeTimeout } from "./timer-delay-x5n129Nx.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { c as getAgentRunContext, l as getAgentRunContextOwnerStatus } from "./agent-run-registry-cxavoLf6.js";
import "./thinking-KBBrAmGh.js";
import { _n as sessionEntryForkedFromParent } from "./session-accessor-CVnxp3UM.js";
import { o as resolveAssistantEventPhase } from "./chat-message-content-BibNiFIq.js";
import { d as isTimeoutError, f as resolveFailoverReasonFromError } from "./failover-error-EKvoWJQa.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-CriEgq90.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-BeVvXvOY.js";
import { a as loadGatewaySessionLifecycleSnapshot } from "./session-utils-list-Bh24bUSo.js";
import "./session-utils-rhyq5EVD.js";
import { u as stripHeartbeatToken } from "./heartbeat-BB6nm0Fy.js";
import { c as resolveToolSearchCodeDisplayTarget } from "./tool-display-DNnLx8TW.js";
import { d as normalizeAgentPlanSteps } from "./streaming-3t37hp7G.js";
import { r as readToolValidationErrorSummary } from "./tool-error-summary-Bw_A4yhp.js";
import { a as createSessionEventSubscriberRegistry, c as isChatAbortMarkerCurrent, d as resolveAssistantLiveChatInput, f as resolveMergedAssistantText, i as createChatRunState, n as createChatAbortMarker, o as createSessionMessageSubscriberRegistry, p as shouldSuppressAssistantEventForLiveChat, r as createChatRunRegistry, s as createToolEventRecipientRegistry, u as projectLiveAssistantBufferedText } from "./server-chat-state-DD3o03aT.js";
import { n as resolveSessionSubscriptionKeys } from "./session-subscription-keys-KDeUeJtW.js";
import { t as resolveHeartbeatVisibility } from "./heartbeat-visibility-UVwDVBL7.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-DQsqndQY.js";
import { n as buildGatewaySessionEventRow } from "./session-event-payload-BhPqYV6j.js";
import { i as persistGatewaySessionLifecycleEvent, n as isRestartRecoveryLifecycleEvent, o as isAgentLifecycleYieldedWaiting, r as isStaleLifecycleEventForSession, t as deriveGatewaySessionLifecycleProjectionPatch } from "./session-lifecycle-state-zNqFUBsn.js";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-chat.ts
const CHAT_STATE_BY_TERMINAL_CLASSIFICATION = {
	success: "done",
	timeout: "error",
	cancellation: "aborted",
	failure: "error"
};
function readChatRunStartupPhase(value) {
	switch (value) {
		case "preparing_workspace":
		case "provisioning_environment":
		case "preparing_context":
		case "starting_model": return value;
		default: return;
	}
}
function projectToolSearchCodeEventForChannelPayload(payload) {
	const data = payload.data;
	if (!data || typeof data !== "object") return payload;
	const record = data;
	if (record.name !== "tool_search_code") return payload;
	const target = resolveToolSearchCodeDisplayTarget(record.args);
	if (!target) return payload;
	const projectedName = target.displayToolName ?? target.toolName;
	if (!projectedName || projectedName === "tool_search_code") return payload;
	const projectedData = {
		...record,
		name: projectedName
	};
	if (target.displayArgs) projectedData.args = target.displayArgs;
	else if (target.detail) projectedData.args = { detail: target.detail };
	if (target.bridgeVerb) {
		projectedData.bridgeToolName = "tool_search_code";
		projectedData.bridgeTargetToolName = target.toolName;
		projectedData.bridgeVerb = target.bridgeVerb;
	}
	return {
		...payload,
		data: projectedData
	};
}
function resolveHeartbeatAckMaxChars() {
	return 300;
}
function resolveHeartbeatContext(runId, sourceRunId) {
	const primary = getAgentRunContext(runId);
	if (primary?.isHeartbeat) return primary;
	if (sourceRunId && sourceRunId !== runId) {
		const source = getAgentRunContext(sourceRunId);
		if (source?.isHeartbeat) return source;
	}
	return primary;
}
/**
* Check if heartbeat ACK/noise should be hidden from interactive chat surfaces.
*/
function shouldHideHeartbeatChatOutput(runId, sourceRunId) {
	if (!resolveHeartbeatContext(runId, sourceRunId)?.isHeartbeat) return false;
	try {
		return !resolveHeartbeatVisibility({
			cfg: getRuntimeConfig(),
			channel: "webchat"
		}).showOk;
	} catch {
		return true;
	}
}
function shouldSuppressHeartbeatToolEvents(runId, sourceRunId) {
	return Boolean(resolveHeartbeatContext(runId, sourceRunId)?.isHeartbeat);
}
function shouldMirrorAssistantEventToHiddenSessionMessages(data) {
	if (!data || typeof data !== "object") return false;
	const record = data;
	const hasText = typeof record.text === "string" && record.text.length > 0;
	const hasDelta = typeof record.delta === "string" && record.delta.length > 0;
	if (!hasText && !hasDelta) return false;
	return resolveAssistantEventPhase(data) === "commentary";
}
function shouldMirrorAgentEventToHiddenSessionMessages(evt) {
	return evt.stream === "thinking" || evt.stream === "approval" || evt.stream === "lifecycle";
}
function normalizeHeartbeatChatFinalText(params) {
	if (!shouldHideHeartbeatChatOutput(params.runId, params.sourceRunId)) return {
		suppress: false,
		text: params.text
	};
	const stripped = stripHeartbeatToken(params.text, {
		mode: "heartbeat",
		maxAckChars: resolveHeartbeatAckMaxChars()
	});
	if (!stripped.didStrip) return {
		suppress: false,
		text: params.text
	};
	if (stripped.shouldSkip) return {
		suppress: true,
		text: ""
	};
	return {
		suppress: false,
		text: stripped.text
	};
}
/**
* Keep this aligned with the agent.wait lifecycle-error grace so chat surfaces
* do not finalize a run before fallback or retry reuses the same runId.
*/
const AGENT_LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const LIVE_TEXT_PACING_MS = 75;
const CHAT_ERROR_KINDS = /* @__PURE__ */ new Set([
	"refusal",
	"timeout",
	"rate_limit",
	"context_length",
	"unknown"
]);
const CHAT_ERROR_KIND_BY_FAILOVER_REASON = {
	auth: void 0,
	auth_permanent: void 0,
	format: void 0,
	rate_limit: "rate_limit",
	overloaded: "rate_limit",
	billing: void 0,
	server_error: void 0,
	timeout: void 0,
	tls_certificate: void 0,
	context_overflow: "context_length",
	model_not_found: void 0,
	session_expired: void 0,
	empty_response: void 0,
	no_error_details: void 0,
	unclassified: void 0,
	unknown: void 0
};
function readChatErrorKind(value) {
	return typeof value === "string" && CHAT_ERROR_KINDS.has(value) ? value : void 0;
}
function resolveChatErrorKindFromError(error) {
	if (error === void 0) return;
	const message = formatErrorMessage(error).toLowerCase();
	if (message.includes("refusal") || message.includes("content_filter") || message.includes("sensitive") || message.includes("unhandled stop reason: refusal_policy")) return "refusal";
	const reason = resolveFailoverReasonFromError(error);
	if (reason) {
		const errorKind = CHAT_ERROR_KIND_BY_FAILOVER_REASON[reason];
		if (errorKind) return errorKind;
	}
	return isTimeoutError(error) ? "timeout" : void 0;
}
function excludeConnIds(connIds, excludedConnIds) {
	if (!excludedConnIds || excludedConnIds.size === 0 || connIds.size === 0) return connIds;
	const filtered = /* @__PURE__ */ new Set();
	for (const connId of connIds) if (!excludedConnIds.has(connId)) filtered.add(connId);
	return filtered;
}
function resolveBroadcastDelta(params) {
	if (!params.text) return;
	const previous = params.previousBroadcastText;
	if (previous === void 0) return { deltaText: params.text };
	if (!params.text.startsWith(previous)) return {
		deltaText: params.text,
		replace: true
	};
	const deltaText = params.text.slice(previous.length);
	return deltaText ? { deltaText } : void 0;
}
const AGENT_TEXT_THROTTLE_STREAMS = ["assistant", "thinking"];
function internalChatRunRecord(record) {
	return record;
}
function cancelPendingLiveTextFlush(run, stream) {
	const pending = run.pendingTextFlushes?.[stream];
	if (!pending) return;
	clearTimeout(pending.timer);
	delete run.pendingTextFlushes?.[stream];
	if (run.pendingTextFlushes && Object.keys(run.pendingTextFlushes).length === 0) delete run.pendingTextFlushes;
}
function scheduleLiveTextFlush(run, stream, delayMs, flush) {
	const pendingFlushes = run.pendingTextFlushes ??= {};
	const existing = pendingFlushes[stream];
	if (existing) {
		existing.flush = flush;
		return;
	}
	const timer = setSafeTimeout(() => {
		const pending = run.pendingTextFlushes?.[stream];
		if (!pending || pending.timer !== timer) return;
		cancelPendingLiveTextFlush(run, stream);
		pending.flush();
	}, delayMs);
	timer.unref?.();
	pendingFlushes[stream] = {
		timer,
		flush
	};
}
function roundedChatSendTimingMs(value) {
	return Math.max(0, Math.round(value * 1e3) / 1e3);
}
function createAgentEventHandler({ broadcast, broadcastToConnIds, nodeSendToSession, agentRunSeq, chatRunState, resolveSessionKeyForRun, clearAgentRunContext, toolEventRecipients, sessionEventSubscribers, sessionMessageSubscribers, loadGatewaySessionLifecycleSnapshotForEvent = loadGatewaySessionLifecycleSnapshot, lifecycleErrorRetryGraceMs = AGENT_LIFECYCLE_ERROR_RETRY_GRACE_MS, isChatSendRunActive = () => false, clearTrackedActiveRun, markTrackedRunTerminalPersisted, trackTrackedRunTerminalPersistence, resolveActiveLifecycleGenerationForRun = () => void 0, updateRunToolErrorSummary, resolveSessionActiveRunState }) {
	const shouldProcessOwnedEvent = (evt) => {
		const claimId = evt.contextClaimId;
		if (!claimId) return true;
		const lifecycleGeneration = evt.lifecycleGeneration;
		if (!lifecycleGeneration || lifecycleGeneration !== getAgentEventLifecycleGeneration()) return false;
		return getAgentRunContextOwnerStatus(evt.runId, claimId, lifecycleGeneration) === "active";
	};
	const clearRunContextForEvent = (evt) => {
		if (evt.contextClaimId) {
			clearAgentRunContext(evt.runId, evt.lifecycleGeneration, evt.contextClaimId);
			return;
		}
		clearAgentRunContext(evt.runId);
	};
	const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
	const cancelPendingChatDeltaFlush = (clientRunId) => {
		const record = chatRunState.runs.get(clientRunId);
		if (record) cancelPendingLiveTextFlush(internalChatRunRecord(record), "chat");
	};
	const clearPendingTerminalLifecycleError = (runId, lifecycleGeneration) => {
		const pending = pendingTerminalLifecycleErrors.get(runId);
		if (!pending) return;
		if (lifecycleGeneration && pending.event.lifecycleGeneration && lifecycleGeneration !== pending.event.lifecycleGeneration) return;
		clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.delete(runId);
	};
	const resolveRestartRecoveryLifecycleState = (sessionKey, agentId, event) => {
		try {
			const { entry } = loadGatewaySessionEntryReadOnly(sessionKey, {
				...agentId ? { agentId } : {},
				clone: false
			});
			return { suppress: isRestartRecoveryLifecycleEvent({
				entry,
				event
			}) };
		} catch {
			return { suppress: false };
		}
	};
	const spawnedByCache = /* @__PURE__ */ new Map();
	const resolveSpawnedBy = (sessionKey) => {
		if (spawnedByCache.has(sessionKey)) return spawnedByCache.get(sessionKey);
		const isDashboardSession = parseAgentSessionKey(sessionKey)?.rest.startsWith("dashboard:") === true;
		if (!isSubagentSessionKey(sessionKey) && !isAcpSessionKey(sessionKey) && !isDashboardSession) return null;
		let result = null;
		try {
			result = loadGatewaySessionLifecycleSnapshotForEvent(sessionKey).row?.spawnedBy ?? null;
		} catch {}
		spawnedByCache.set(sessionKey, result);
		return result;
	};
	const buildSessionEventSnapshot = (sessionKey, evt, agentId, includeActiveRunState = false, lifecycleProjection = false) => {
		const { lifecycleRunId, row } = loadGatewaySessionLifecycleSnapshotForEvent(sessionKey, agentId ? { agentId } : void 0);
		const omitUnscopedGlobalGoal = sessionKey === "global" && !agentId;
		const lifecyclePatch = evt && !isStaleLifecycleEventForSession({
			owningSessionId: evt.sessionId,
			currentSessionId: row?.sessionId,
			eventRunId: evt.runId,
			currentRunId: lifecycleRunId,
			eventStartedAt: evt.data?.startedAt,
			currentStartedAt: row?.startedAt
		}) ? deriveGatewaySessionLifecycleProjectionPatch({
			entry: row ? {
				updatedAt: row.updatedAt ?? void 0,
				status: row.status,
				lastRunError: row.lastRunError,
				startedAt: row.startedAt,
				endedAt: row.endedAt,
				runtimeMs: row.runtimeMs,
				abortedLastRun: row.abortedLastRun
			} : void 0,
			event: evt
		}) : {};
		const activeRunState = includeActiveRunState ? resolveSessionActiveRunState?.({
			requestedKey: sessionKey,
			canonicalKey: row?.key ?? sessionKey,
			...row?.sessionId ? { sessionId: row.sessionId } : {},
			...agentId ? { agentId } : {}
		}) : void 0;
		const activeRunFields = activeRunState ? {
			hasActiveRun: activeRunState.active,
			activeRunIds: activeRunState.runIds
		} : {};
		const clearsLastRunError = Object.hasOwn(lifecyclePatch, "lastRunError") && lifecyclePatch.lastRunError === void 0;
		const projectedRow = row ? lifecycleProjection ? buildGatewaySessionEventRow(row, { lifecycle: true }) : row : void 0;
		const session = projectedRow ? {
			...projectedRow,
			...lifecyclePatch,
			...activeRunFields,
			...clearsLastRunError ? { lastRunError: null } : {}
		} : void 0;
		if (session && omitUnscopedGlobalGoal) delete session.goal;
		const snapshotSource = session ?? lifecyclePatch;
		return {
			...session ? { session } : {},
			updatedAt: snapshotSource.updatedAt,
			sessionId: row?.sessionId,
			kind: row?.kind,
			channel: row?.channel,
			subject: row?.subject,
			groupChannel: row?.groupChannel,
			space: row?.space,
			chatType: row?.chatType,
			origin: row?.origin,
			spawnedBy: row?.spawnedBy,
			spawnedWorkspaceDir: row?.spawnedWorkspaceDir,
			spawnedCwd: row?.spawnedCwd,
			forkedFromParent: sessionEntryForkedFromParent(row ?? void 0) ? true : void 0,
			spawnDepth: row?.spawnDepth,
			subagentRole: row?.subagentRole,
			subagentControlScope: row?.subagentControlScope,
			label: row?.label,
			displayName: row?.displayName,
			deliveryContext: row?.deliveryContext,
			parentSessionKey: row?.parentSessionKey,
			childSessions: row?.childSessions,
			thinkingLevel: row?.thinkingLevel,
			fastMode: row?.fastMode,
			toolOverrides: row?.toolOverrides,
			verboseLevel: row?.verboseLevel,
			traceLevel: row?.traceLevel,
			reasoningLevel: row?.reasoningLevel,
			elevatedLevel: row?.elevatedLevel,
			sendPolicy: row?.sendPolicy,
			systemSent: row?.systemSent,
			inputTokens: row?.inputTokens,
			outputTokens: row?.outputTokens,
			lastChannel: row?.lastChannel,
			lastTo: row?.lastTo,
			lastAccountId: row?.lastAccountId,
			lastThreadId: row?.lastThreadId,
			totalTokens: projectedRow?.totalTokens,
			totalTokensFresh: projectedRow?.totalTokensFresh,
			...omitUnscopedGlobalGoal ? {} : { goal: row?.goal ?? null },
			contextTokens: projectedRow?.contextTokens,
			estimatedCostUsd: projectedRow?.estimatedCostUsd,
			responseUsage: row?.responseUsage,
			effectiveResponseUsage: row?.effectiveResponseUsage,
			modelProvider: projectedRow?.modelProvider,
			model: projectedRow?.model,
			...activeRunFields,
			status: snapshotSource.status,
			lastRunError: snapshotSource.lastRunError ?? null,
			startedAt: snapshotSource.startedAt,
			endedAt: snapshotSource.endedAt,
			runtimeMs: snapshotSource.runtimeMs,
			abortedLastRun: snapshotSource.abortedLastRun
		};
	};
	const resolveSessionDeliveryKeys = (sessionKey, agentId) => {
		if (sessionKey.trim().toLowerCase() !== "global") return [sessionKey];
		const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(getRuntimeConfig(), sessionKey);
		const deliveryAgentId = agentId ?? compatibilityOwnerAgentId;
		return deliveryAgentId ? resolveSessionSubscriptionKeys(sessionKey, deliveryAgentId, compatibilityOwnerAgentId) : [];
	};
	const sendNodeSessionPayloadForAgent = (sessionKey, event, payload, agentId) => {
		for (const deliverySessionKey of resolveSessionDeliveryKeys(sessionKey, agentId)) nodeSendToSession(deliverySessionKey, event, payload);
	};
	const emitFirstAssistantChatSendTiming = (chatLink) => {
		const timing = chatLink?.chatSendTiming;
		if (!timing || timing.firstAssistantEventSent) return;
		timing.firstAssistantEventSent = true;
		const nowMs = performance.now();
		broadcastToConnIds("chat.send_timing", {
			phase: "first-assistant-event",
			runId: chatLink.clientRunId,
			sessionKey: chatLink.sessionKey,
			...chatLink.agentId ? { agentId: chatLink.agentId } : {},
			ackToPhaseMs: roundedChatSendTimingMs(nowMs - timing.ackedAtMs),
			receivedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.receivedAtMs),
			...timing.dispatchStartedAtMs !== void 0 ? { dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.dispatchStartedAtMs) } : {}
		}, /* @__PURE__ */ new Set([timing.connId]), { dropIfSlow: true });
	};
	const finalizeLifecycleEvent = (evt, opts) => {
		if (!shouldProcessOwnedEvent(evt)) return;
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
		if (lifecyclePhase !== "end" && lifecyclePhase !== "error") return;
		const currentRunContext = getAgentRunContext(evt.runId);
		const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
		const currentLifecycleGeneration = activeLifecycleGeneration ?? currentRunContext?.lifecycleGeneration;
		const chatLink = evt.contextClaimId ? void 0 : chatRunState.registry.peek(evt.runId);
		const sessionAgentId = chatLink?.agentId ?? evt.agentId;
		const eventSessionKey = evt.deliverySessionKey ?? (typeof evt.sessionKey === "string" && evt.sessionKey.trim() ? evt.sessionKey : void 0);
		const isControlUiVisible = evt.controlUiVisible ?? currentRunContext?.isControlUiVisible ?? true;
		const projectSessionLifecycle = evt.projectSessionLifecycle ?? currentRunContext?.projectSessionLifecycle ?? true;
		const sessionKey = chatLink?.sessionKey ?? eventSessionKey ?? resolveSessionKeyForRun(evt.runId);
		const restartRecoverySessionKey = eventSessionKey ?? sessionKey;
		const restartRecoveryAgentId = evt.agentId ?? sessionAgentId;
		const clientRunId = chatLink?.clientRunId ?? evt.runId;
		const eventRunId = chatLink?.clientRunId ?? evt.runId;
		const isAborted = isChatAbortMarkerCurrent(chatRunState.runs.get(clientRunId)?.abortMarker, chatLink) || isChatAbortMarkerCurrent(chatRunState.runs.get(evt.runId)?.abortMarker, chatLink);
		const lifecycleAborted = evt.data?.aborted === true;
		const deliverySessionKeys = sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : [];
		const restartRecoveryState = opts?.restartRecoveryState ?? (restartRecoverySessionKey ? resolveRestartRecoveryLifecycleState(restartRecoverySessionKey, restartRecoveryAgentId, evt) : void 0);
		const suppressRestartRecoveryProjection = opts?.suppressRestartRecoveryProjection === true || Boolean(evt.lifecycleGeneration && activeLifecycleGeneration && evt.lifecycleGeneration !== activeLifecycleGeneration) || restartRecoveryState?.suppress === true;
		if (suppressRestartRecoveryProjection && Boolean(evt.lifecycleGeneration && currentLifecycleGeneration && evt.lifecycleGeneration !== currentLifecycleGeneration)) return;
		if (!suppressRestartRecoveryProjection && sessionKey && (isControlUiVisible || deliverySessionKeys.some((deliverySessionKey) => sessionMessageSubscribers.get(deliverySessionKey).size > 0))) {
			if (!isAborted) {
				const finished = chatLink ? chatRunState.registry.shift(evt.runId) : void 0;
				if (chatLink && !finished) {
					clearRunContextForEvent(evt);
					return;
				}
				const terminalSessionKey = finished?.sessionKey ?? sessionKey;
				const terminalRunId = finished?.clientRunId ?? eventRunId;
				const terminalAgentId = finished?.agentId ?? sessionAgentId;
				const terminalOutcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
					phase: lifecyclePhase,
					data: evt.data,
					endedAt: evt.data?.endedAt ?? evt.ts
				});
				const yieldedWaiting = isAgentLifecycleYieldedWaiting({
					phase: lifecyclePhase,
					yielded: evt.data?.yielded,
					livenessState: evt.data?.livenessState,
					stopReason: terminalOutcome.stopReason,
					aborted: lifecycleAborted,
					status: evt.data?.status,
					timeoutPhase: evt.data?.timeoutPhase,
					error: evt.data?.error
				});
				const terminalClassification = classifyAgentRunTerminalOutcome(terminalOutcome);
				const terminalState = CHAT_STATE_BY_TERMINAL_CLASSIFICATION[terminalClassification];
				if (!(opts?.skipChatErrorFinal && terminalState === "error")) emitChatTerminal(terminalSessionKey, terminalRunId, evt.runId, evt.seq, terminalState, terminalOutcome.error ?? evt.data?.error, terminalOutcome.stopReason, terminalClassification === "timeout" ? "timeout" : readChatErrorKind(evt.data?.errorKind) ?? resolveChatErrorKindFromError(evt.data?.error), {
					agentId: terminalAgentId,
					controlUiVisible: isControlUiVisible,
					firstAssistantTimingEntry: finished,
					abortErrorMessage: readToolValidationErrorSummary(evt.data?.toolErrorSummary),
					yielded: yieldedWaiting ? true : void 0
				});
			} else if (chatLink) chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
		}
		toolEventRecipients.markFinal(evt.runId);
		chatRunState.clearRun(clientRunId);
		if (suppressRestartRecoveryProjection && chatLink) chatRunState.registry.remove(evt.runId, clientRunId, sessionKey);
		clearRunContextForEvent(evt);
		agentRunSeq.delete(evt.runId);
		agentRunSeq.delete(clientRunId);
		if (sessionKey) {
			clearTrackedActiveRun?.({
				runId: evt.runId,
				clientRunId,
				sessionKey
			});
			if (!suppressRestartRecoveryProjection && projectSessionLifecycle) {
				const persistence = persistGatewaySessionLifecycleEvent({
					sessionKey,
					agentId: sessionAgentId,
					event: evt
				});
				trackTrackedRunTerminalPersistence?.({
					runId: evt.runId,
					clientRunId,
					sessionKey,
					sessionId: evt.sessionId,
					observedAt: evt.ts,
					persistence
				});
				const broadcastSessionChange = (snapshotEvent) => {
					if (parseCronRunScopeSuffix(sessionKey).runId) return;
					const sessionEventConnIds = sessionEventSubscribers.getAll();
					if (!hasSessionChangeReceivers(sessionEventConnIds)) return;
					broadcastToConnIds("sessions.changed", {
						sessionKey,
						...sessionAgentId ? { agentId: sessionAgentId } : {},
						phase: lifecyclePhase,
						runId: evt.runId,
						...eventRunId !== evt.runId ? { clientRunId: eventRunId } : {},
						ts: evt.ts,
						...buildSessionEventSnapshot(sessionKey, snapshotEvent, sessionAgentId, true, true)
					}, sessionEventConnIds, { dropIfSlow: true });
				};
				const markPersisted = () => {
					markTrackedRunTerminalPersisted?.({
						runId: evt.runId,
						clientRunId,
						sessionKey
					});
				};
				persistence.then(() => {
					markPersisted();
					broadcastSessionChange();
				}).catch((err) => {
					logError(`gateway: terminal session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(evt.runId)} error=${formatForLog(err)}`);
					broadcastSessionChange(evt);
				});
			}
		}
	};
	const scheduleTerminalLifecycleError = (evt, opts) => {
		clearPendingTerminalLifecycleError(evt.runId);
		const timer = setSafeTimeout(() => {
			const pending = pendingTerminalLifecycleErrors.get(evt.runId);
			if (!pending || pending.timer !== timer) return;
			pendingTerminalLifecycleErrors.delete(evt.runId);
			finalizeLifecycleEvent(pending.event, pending.opts);
		}, lifecycleErrorRetryGraceMs);
		timer.unref?.();
		pendingTerminalLifecycleErrors.set(evt.runId, {
			timer,
			event: evt,
			opts
		});
	};
	const broadcastChatDelta = (sessionKey, agentId, clientRunId, sourceRunId, seq, text, opts) => {
		cancelPendingChatDeltaFlush(clientRunId);
		const run = chatRunState.getOrCreate(clientRunId);
		const broadcastDelta = resolveBroadcastDelta({
			text,
			previousBroadcastText: run.deltaLastBroadcastText
		});
		if (!broadcastDelta) return;
		const now = Date.now();
		run.deltaSentAt = now;
		run.deltaLastBroadcastText = text;
		const spawnedBy = resolveSpawnedBy(sessionKey);
		const payload = {
			runId: clientRunId,
			sessionKey,
			...agentId ? { agentId } : {},
			...spawnedBy && { spawnedBy },
			seq,
			state: "delta",
			deltaText: broadcastDelta.deltaText,
			...broadcastDelta.replace ? { replace: true } : {},
			message: {
				role: "assistant",
				content: [{
					type: "text",
					text
				}],
				timestamp: now
			}
		};
		emitFirstAssistantChatSendTiming(opts?.firstAssistantTimingEntry ?? chatRunState.registry.peek(sourceRunId));
		sendChatPayload(sessionKey, payload, {
			agentId,
			controlUiVisible: opts?.controlUiVisible ?? true,
			dropIfSlow: true
		});
	};
	const scheduleChatDeltaFlush = (sessionKey, agentId, clientRunId, sourceRunId, seq, delayMs, controlUiVisible) => {
		const run = internalChatRunRecord(chatRunState.getOrCreate(clientRunId));
		const flush = () => {
			const projected = chatRunState.resolveBuffer(clientRunId);
			if (projected.suppress || shouldHideHeartbeatChatOutput(clientRunId, sourceRunId)) return;
			broadcastChatDelta(sessionKey, agentId, clientRunId, sourceRunId, seq, projected.text, { controlUiVisible });
		};
		scheduleLiveTextFlush(run, "chat", delayMs, flush);
	};
	const emitChatDelta = (sessionKey, agentId, clientRunId, sourceRunId, seq, text, delta, opts) => {
		const run = chatRunState.getOrCreate(clientRunId);
		const mergedRawText = resolveMergedAssistantText({
			previousText: run.rawBuffer ?? "",
			nextText: text,
			nextDelta: typeof delta === "string" ? delta : ""
		});
		if (!mergedRawText) return;
		const now = Date.now();
		run.rawBuffer = mergedRawText;
		run.bufferUpdatedAt = now;
		const waitedMs = now - (run.deltaSentAt ?? 0);
		if (waitedMs < LIVE_TEXT_PACING_MS) {
			scheduleChatDeltaFlush(sessionKey, agentId, clientRunId, sourceRunId, seq, LIVE_TEXT_PACING_MS - waitedMs, opts?.controlUiVisible);
			return;
		}
		const projected = chatRunState.resolveBuffer(clientRunId);
		const mergedText = projected.text;
		if (projected.suppress || shouldHideHeartbeatChatOutput(clientRunId, sourceRunId)) return;
		broadcastChatDelta(sessionKey, agentId, clientRunId, sourceRunId, seq, mergedText, opts);
	};
	const resolveBufferedChatTextState = (clientRunId, sourceRunId, options) => {
		const normalizedHeartbeatText = normalizeHeartbeatChatFinalText({
			runId: clientRunId,
			sourceRunId,
			text: chatRunState.resolveBuffer(clientRunId).text.trim()
		});
		const projected = projectLiveAssistantBufferedText(normalizedHeartbeatText.text.trim(), { suppressLeadFragments: options?.suppressLeadFragments });
		return {
			text: projected.text.trim(),
			shouldSuppressSilent: normalizedHeartbeatText.suppress || projected.suppress
		};
	};
	const flushBufferedChatDeltaIfNeeded = (sessionKey, agentId, clientRunId, sourceRunId, seq, opts) => {
		cancelPendingChatDeltaFlush(clientRunId);
		const { text, shouldSuppressSilent } = resolveBufferedChatTextState(clientRunId, sourceRunId, { suppressLeadFragments: true });
		const shouldSuppressHeartbeatStreaming = shouldHideHeartbeatChatOutput(clientRunId, sourceRunId);
		if (!text || shouldSuppressSilent || shouldSuppressHeartbeatStreaming) return;
		broadcastChatDelta(sessionKey, agentId, clientRunId, sourceRunId, seq, text, opts);
	};
	const sendChatPayload = (sessionKey, payload, opts) => {
		const deliverySessionKeys = resolveSessionDeliveryKeys(sessionKey, opts?.agentId);
		if (opts?.controlUiVisible ?? true) {
			broadcast("chat", payload, {
				dropIfSlow: opts?.dropIfSlow,
				sessionKeys: deliverySessionKeys
			});
			sendNodeSessionPayloadForAgent(sessionKey, "chat", payload, opts?.agentId);
			return;
		}
		const recipients = new Set(deliverySessionKeys.flatMap((deliveryKey) => [...sessionMessageSubscribers.get(deliveryKey)]));
		if (recipients.size > 0) broadcastToConnIds("chat", payload, recipients, {
			dropIfSlow: opts?.dropIfSlow,
			sessionKeys: deliverySessionKeys
		});
	};
	const emitChatTerminal = (sessionKey, clientRunId, sourceRunId, seq, jobState, error, stopReason, errorKind, opts) => {
		const { text, shouldSuppressSilent } = resolveBufferedChatTextState(clientRunId, sourceRunId, { suppressLeadFragments: false });
		flushBufferedChatDeltaIfNeeded(sessionKey, opts?.agentId, clientRunId, sourceRunId, seq, opts);
		chatRunState.clearRun(clientRunId);
		const spawnedBy = resolveSpawnedBy(sessionKey);
		if (jobState !== "error") {
			const payload = {
				runId: clientRunId,
				sessionKey,
				...opts?.agentId ? { agentId: opts.agentId } : {},
				...spawnedBy && { spawnedBy },
				seq,
				state: jobState === "done" ? "final" : "aborted",
				...jobState === "aborted" && opts?.abortErrorMessage ? { errorMessage: opts.abortErrorMessage } : {},
				...stopReason && { stopReason },
				...jobState === "done" && opts?.yielded ? { yielded: true } : {},
				message: text && !shouldSuppressSilent ? {
					role: "assistant",
					content: [{
						type: "text",
						text
					}],
					timestamp: Date.now()
				} : void 0
			};
			sendChatPayload(sessionKey, payload, opts);
			return;
		}
		const payload = {
			runId: clientRunId,
			sessionKey,
			...opts?.agentId ? { agentId: opts.agentId } : {},
			...spawnedBy && { spawnedBy },
			seq,
			state: "error",
			errorMessage: error ? formatForLog(error) : void 0,
			...errorKind && { errorKind },
			...stopReason && { stopReason }
		};
		sendChatPayload(sessionKey, payload, opts);
	};
	const sendAgentPayload = (sessionKey, payload, opts) => {
		if (opts?.controlUiVisible ?? true) {
			broadcast("agent", payload, { sessionKeys: sessionKey ? resolveSessionDeliveryKeys(sessionKey, opts?.agentId) : void 0 });
			if (sessionKey) sendNodeSessionPayloadForAgent(sessionKey, "agent", payload, opts?.agentId);
			return;
		}
		if (!sessionKey) return;
		const deliverySessionKeys = resolveSessionDeliveryKeys(sessionKey, opts?.agentId);
		const recipients = new Set(deliverySessionKeys.flatMap((deliveryKey) => [...sessionMessageSubscribers.get(deliveryKey)]));
		if (recipients.size > 0) broadcastToConnIds("agent", payload, recipients, {
			dropIfSlow: opts?.dropIfSlow,
			sessionKeys: deliverySessionKeys
		});
	};
	const sendNodeAgentPayload = (sessionKey, payload, agentId) => {
		if (sessionKey) sendNodeSessionPayloadForAgent(sessionKey, "agent", payload, agentId);
	};
	const flushBufferedAgentDeltaIfNeeded = (clientRunId) => {
		const run = chatRunState.runs.get(clientRunId);
		if (run) cancelPendingLiveTextFlush(internalChatRunRecord(run), "agent");
		const bufferedEntries = AGENT_TEXT_THROTTLE_STREAMS.flatMap((currentStream) => {
			const buffered = (run?.agentText?.[currentStream])?.bufferedEvent;
			if (!buffered) return [];
			return [{
				stream: currentStream,
				buffered
			}];
		});
		bufferedEntries.sort((a, b) => a.buffered.payload.seq - b.buffered.payload.seq);
		for (const { stream: currentStream, buffered } of bufferedEntries) {
			sendAgentPayload(buffered.sessionKey, buffered.payload, { agentId: buffered.agentId });
			const state = run?.agentText?.[currentStream];
			if (state) {
				delete state.bufferedEvent;
				state.lastSentAt = Date.now();
			}
		}
	};
	const resolveAgentTextThrottleStream = (evt) => evt.stream === "assistant" ? "assistant" : evt.stream === "thinking" ? "thinking" : null;
	const shouldCoalesceAgentTextEvent = (evt) => resolveAgentTextThrottleStream(evt) !== null && typeof evt.data?.text === "string" && typeof evt.data.delta === "string" && evt.data.delta.length > 0 && !(Array.isArray(evt.data.mediaUrls) && evt.data.mediaUrls.length > 0) && typeof evt.data.mediaUrl !== "string" && evt.data.replace !== true && (evt.stream !== "assistant" || !shouldSuppressAssistantEventForLiveChat(evt.data));
	const mergeBufferedAgentPayload = (previous, next) => {
		if (previous.payload.stream !== next.payload.stream) return next;
		const previousDelta = previous.payload.data.delta;
		const nextDelta = next.payload.data.delta;
		if (typeof previousDelta !== "string" || typeof nextDelta !== "string") return next;
		return {
			...next,
			payload: {
				...next.payload,
				data: {
					...next.payload.data,
					delta: `${previousDelta}${nextDelta}`
				}
			}
		};
	};
	const sendOrBufferAgentTextEvent = (clientRunId, sessionKey, agentId, payload) => {
		const stream = resolveAgentTextThrottleStream(payload);
		if (!stream) {
			sendAgentPayload(sessionKey, payload, { agentId });
			return;
		}
		const now = Date.now();
		const run = chatRunState.getOrCreate(clientRunId);
		const agentText = run.agentText ??= {};
		const state = agentText[stream] ??= {};
		const last = state.lastSentAt;
		if (last !== void 0 && now - last < LIVE_TEXT_PACING_MS) {
			const nextBuffered = sessionKey ? {
				sessionKey,
				agentId,
				payload
			} : {
				agentId,
				payload
			};
			state.bufferedEvent = state.bufferedEvent ? mergeBufferedAgentPayload(state.bufferedEvent, nextBuffered) : nextBuffered;
			scheduleLiveTextFlush(internalChatRunRecord(run), "agent", LIVE_TEXT_PACING_MS - (now - last), () => flushBufferedAgentDeltaIfNeeded(clientRunId));
			return;
		}
		flushBufferedAgentDeltaIfNeeded(clientRunId);
		sendAgentPayload(sessionKey, payload, { agentId });
		state.lastSentAt = now;
	};
	const resolveToolVerboseLevel = (runId, sessionKey) => {
		const runContext = getAgentRunContext(runId);
		const runVerbose = normalizeVerboseLevel(runContext?.verboseLevel);
		if (!sessionKey) return runVerbose ?? "off";
		try {
			const { cfg, entry } = loadGatewaySessionEntryReadOnly(sessionKey);
			const sessionVerbose = normalizeVerboseLevel(entry?.verboseLevel);
			const sessionUpdatedAt = typeof entry?.updatedAt === "number" ? entry.updatedAt : void 0;
			const sessionChangedAfterRunStarted = sessionUpdatedAt !== void 0 && runContext?.registeredAt !== void 0 && sessionUpdatedAt >= runContext.registeredAt;
			if (sessionVerbose && (!runVerbose || sessionChangedAfterRunStarted)) return sessionVerbose;
			if (runVerbose) return runVerbose;
			return normalizeVerboseLevel(cfg.agents?.defaults?.verboseDefault) ?? "off";
		} catch {
			return runVerbose ?? "off";
		}
	};
	const handleEvent = (event) => {
		const evt = event;
		if (!shouldProcessOwnedEvent(evt)) return;
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
		const chatLink = evt.contextClaimId ? void 0 : chatRunState.registry.peek(evt.runId);
		const sessionAgentId = chatLink?.agentId ?? evt.agentId;
		const eventSessionKey = evt.deliverySessionKey ?? (typeof evt.sessionKey === "string" && evt.sessionKey.trim() ? evt.sessionKey : void 0);
		const runContext = getAgentRunContext(evt.runId);
		const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
		const isControlUiVisible = evt.controlUiVisible ?? runContext?.isControlUiVisible ?? true;
		const projectSessionLifecycle = evt.projectSessionLifecycle ?? runContext?.projectSessionLifecycle ?? true;
		const isHeartbeat = runContext?.isHeartbeat;
		const sessionKey = chatLink?.sessionKey ?? eventSessionKey ?? resolveSessionKeyForRun(evt.runId);
		const restartRecoverySessionKey = eventSessionKey ?? sessionKey;
		const restartRecoveryAgentId = evt.agentId ?? sessionAgentId;
		const clientRunId = chatLink?.clientRunId ?? evt.runId;
		const eventRunId = chatLink?.clientRunId ?? evt.runId;
		const eventForClients = chatLink ? {
			...evt,
			runId: eventRunId
		} : evt;
		const isAborted = isChatAbortMarkerCurrent(chatRunState.runs.get(clientRunId)?.abortMarker, chatLink) || isChatAbortMarkerCurrent(chatRunState.runs.get(evt.runId)?.abortMarker, chatLink);
		const restartRecoveryState = restartRecoverySessionKey ? resolveRestartRecoveryLifecycleState(restartRecoverySessionKey, restartRecoveryAgentId, evt) : void 0;
		if (lifecyclePhase !== null && (Boolean(evt.lifecycleGeneration && activeLifecycleGeneration && evt.lifecycleGeneration !== activeLifecycleGeneration) || restartRecoveryState?.suppress === true)) {
			clearPendingTerminalLifecycleError(evt.runId, evt.lifecycleGeneration);
			if (lifecyclePhase === "end" || lifecyclePhase === "error") finalizeLifecycleEvent(evt, {
				suppressRestartRecoveryProjection: true,
				restartRecoveryState
			});
			return;
		}
		if (lifecyclePhase !== null && lifecyclePhase !== "error") clearPendingTerminalLifecycleError(evt.runId);
		const spawnedBy = sessionKey ? resolveSpawnedBy(sessionKey) : null;
		const agentPayload = sessionKey ? {
			...eventForClients,
			sessionKey,
			...sessionAgentId ? { agentId: sessionAgentId } : {},
			...spawnedBy && { spawnedBy },
			...isHeartbeat !== void 0 && { isHeartbeat }
		} : {
			...eventForClients,
			...isHeartbeat !== void 0 && { isHeartbeat }
		};
		const hasSessionMessageSubscribers = sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId).some((deliverySessionKey) => sessionMessageSubscribers.get(deliverySessionKey).size > 0) : false;
		const last = agentRunSeq.get(evt.runId) ?? 0;
		const isToolEvent = evt.stream === "tool";
		const isItemEvent = evt.stream === "item";
		const toolVerbose = isToolEvent ? resolveToolVerboseLevel(evt.runId, sessionKey) : "off";
		const suppressHeartbeatToolEvents = isToolEvent && shouldSuppressHeartbeatToolEvents(clientRunId, evt.runId);
		const shouldCoalesceAgentEvent = shouldCoalesceAgentTextEvent(evt);
		const channelToolPayload = isToolEvent && toolVerbose !== "full" ? (() => {
			const data = evt.data ? { ...evt.data } : {};
			delete data.result;
			delete data.partialResult;
			return {
				...agentPayload,
				data
			};
		})() : agentPayload;
		if (last > 0 && evt.seq !== last + 1 && isControlUiVisible) {
			flushBufferedAgentDeltaIfNeeded(clientRunId);
			broadcast("agent", {
				runId: eventRunId,
				stream: "error",
				ts: Date.now(),
				sessionKey,
				...spawnedBy && { spawnedBy },
				...isHeartbeat !== void 0 && { isHeartbeat },
				data: {
					reason: "seq gap",
					expected: last + 1,
					received: evt.seq
				}
			}, { sessionKeys: sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : void 0 });
		}
		agentRunSeq.set(evt.runId, evt.seq);
		if (evt.stream === "assistant") updateRunToolErrorSummary?.({
			runId: evt.runId,
			clientRunId,
			summary: void 0
		});
		if (evt.stream === "plan" && evt.data?.phase === "update") {
			const steps = normalizeAgentPlanSteps(evt.data.steps) ?? [];
			const explanation = typeof evt.data.explanation === "string" ? evt.data.explanation.trim() : "";
			chatRunState.getOrCreate(clientRunId).planSnapshot = {
				steps,
				...explanation ? { explanation } : {}
			};
		}
		if (chatLink && isControlUiVisible && !isAborted && (isToolEvent && !suppressHeartbeatToolEvents || isItemEvent)) chatRunState.recordProgressEvent(clientRunId, agentPayload);
		if (evt.stream === "run_status") {
			const phase = readChatRunStartupPhase(evt.data?.phase);
			if (phase && chatLink && isControlUiVisible && sessionKey && !isAborted) {
				const payload = {
					runId: clientRunId,
					sessionKey,
					...sessionAgentId ? { agentId: sessionAgentId } : {},
					...spawnedBy && { spawnedBy },
					seq: evt.seq,
					state: "status",
					phase
				};
				sendChatPayload(sessionKey, payload, {
					agentId: sessionAgentId,
					controlUiVisible: true,
					dropIfSlow: true
				});
			}
		}
		if (isToolEvent) {
			const toolPhase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
			if (toolPhase === "start") updateRunToolErrorSummary?.({
				runId: evt.runId,
				clientRunId,
				summary: void 0
			});
			else if (toolPhase === "result") updateRunToolErrorSummary?.({
				runId: evt.runId,
				clientRunId,
				summary: readToolValidationErrorSummary(evt.data?.toolErrorSummary)
			});
			if (toolPhase === "start" && (isControlUiVisible || hasSessionMessageSubscribers) && sessionKey && !isAborted && !suppressHeartbeatToolEvents) {
				flushBufferedChatDeltaIfNeeded(sessionKey, sessionAgentId, clientRunId, evt.runId, evt.seq, { controlUiVisible: isControlUiVisible });
				flushBufferedAgentDeltaIfNeeded(clientRunId);
			}
			const runToolRecipients = toolEventRecipients.get(evt.runId);
			if (isControlUiVisible && !suppressHeartbeatToolEvents && runToolRecipients && runToolRecipients.size > 0) broadcastToConnIds("agent", sessionKey ? {
				...agentPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			} : agentPayload, runToolRecipients, { sessionKeys: sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : void 0 });
			if (!isControlUiVisible && sessionKey && !suppressHeartbeatToolEvents) sendAgentPayload(sessionKey, {
				...agentPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			}, {
				agentId: sessionAgentId,
				controlUiVisible: false,
				dropIfSlow: true
			});
			if (isControlUiVisible && sessionKey && !suppressHeartbeatToolEvents) {
				const sessionSubscribers = excludeConnIds(sessionEventSubscribers.getAll(), runToolRecipients);
				if (sessionSubscribers.size > 0) broadcastToConnIds("session.tool", {
					...agentPayload,
					...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
				}, sessionSubscribers, { dropIfSlow: true });
			}
		} else {
			if ((isItemEvent && typeof evt.data?.phase === "string" ? evt.data.phase : "") === "start" && (isControlUiVisible || hasSessionMessageSubscribers) && !isAborted) {
				if (sessionKey) flushBufferedChatDeltaIfNeeded(sessionKey, sessionAgentId, clientRunId, evt.runId, evt.seq, { controlUiVisible: isControlUiVisible });
				flushBufferedAgentDeltaIfNeeded(clientRunId);
			}
			if (isControlUiVisible) if (shouldCoalesceAgentEvent) sendOrBufferAgentTextEvent(clientRunId, sessionKey, sessionAgentId, agentPayload);
			else {
				flushBufferedAgentDeltaIfNeeded(clientRunId);
				sendAgentPayload(sessionKey, agentPayload, {
					agentId: sessionAgentId,
					controlUiVisible: isControlUiVisible
				});
				const textThrottleStream = resolveAgentTextThrottleStream(evt);
				if (textThrottleStream && (typeof evt.data.delta === "string" || evt.data.replace === true)) {
					const agentText = chatRunState.getOrCreate(clientRunId).agentText ??= {};
					(agentText[textThrottleStream] ??= {}).lastSentAt = Date.now();
				}
			}
			else if (sessionKey && hasSessionMessageSubscribers && (shouldMirrorAgentEventToHiddenSessionMessages(evt) || !isAborted && evt.stream === "assistant" && shouldMirrorAssistantEventToHiddenSessionMessages(evt.data))) sendAgentPayload(sessionKey, {
				...agentPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			}, {
				agentId: sessionAgentId,
				controlUiVisible: false,
				dropIfSlow: true
			});
			if (!isControlUiVisible && isItemEvent && sessionKey && hasSessionMessageSubscribers) sendAgentPayload(sessionKey, {
				...agentPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			}, {
				agentId: sessionAgentId,
				controlUiVisible: false,
				dropIfSlow: true
			});
		}
		if ((isControlUiVisible || hasSessionMessageSubscribers) && sessionKey) {
			if (isControlUiVisible && isToolEvent && !suppressHeartbeatToolEvents && toolVerbose !== "off") sendNodeAgentPayload(sessionKey, projectToolSearchCodeEventForChannelPayload({
				...channelToolPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			}), sessionAgentId);
			const assistantLiveChatInput = evt.stream === "assistant" ? resolveAssistantLiveChatInput(evt.data) : void 0;
			if (!isAborted && assistantLiveChatInput && !shouldSuppressAssistantEventForLiveChat(evt.data)) emitChatDelta(sessionKey, sessionAgentId, clientRunId, evt.runId, evt.seq, assistantLiveChatInput.text, assistantLiveChatInput.delta, { controlUiVisible: isControlUiVisible });
		}
		if (lifecyclePhase === "error") {
			const skipChatErrorFinal = isChatSendRunActive(evt.runId) && !chatLink;
			const isFallbackExhaustedFailure = evt.data?.fallbackExhaustedFailure === true;
			if (isAborted || isFallbackExhaustedFailure || lifecycleErrorRetryGraceMs <= 0) finalizeLifecycleEvent(evt, {
				skipChatErrorFinal,
				restartRecoveryState
			});
			else {
				if (sessionKey) flushBufferedChatDeltaIfNeeded(sessionKey, sessionAgentId, clientRunId, evt.runId, evt.seq, { controlUiVisible: isControlUiVisible });
				chatRunState.clearRun(clientRunId);
				scheduleTerminalLifecycleError(evt, {
					skipChatErrorFinal,
					restartRecoveryState
				});
			}
			return;
		}
		if (lifecyclePhase === "end") {
			finalizeLifecycleEvent(evt, { restartRecoveryState });
			return;
		}
		if (projectSessionLifecycle && sessionKey && lifecyclePhase === "start") {
			persistGatewaySessionLifecycleEvent({
				sessionKey,
				agentId: sessionAgentId,
				event: evt
			}).catch((err) => {
				logError(`gateway: start session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(evt.runId)} error=${formatForLog(err)}`);
			});
			const sessionEventConnIds = sessionEventSubscribers.getAll();
			if (hasSessionChangeReceivers(sessionEventConnIds)) broadcastToConnIds("sessions.changed", {
				sessionKey,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				phase: lifecyclePhase,
				runId: evt.runId,
				...eventRunId !== evt.runId ? { clientRunId: eventRunId } : {},
				ts: evt.ts,
				...buildSessionEventSnapshot(sessionKey, evt, sessionAgentId, true, true)
			}, sessionEventConnIds, { dropIfSlow: true });
		}
	};
	return Object.assign(handleEvent, { dispose: () => {
		for (const pending of pendingTerminalLifecycleErrors.values()) clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.clear();
	} });
}
//#endregion
export { createAgentEventHandler, createChatAbortMarker, createChatRunRegistry, createChatRunState, createSessionEventSubscriberRegistry, createSessionMessageSubscriberRegistry, createToolEventRecipientRegistry, resolveChatErrorKindFromError };
