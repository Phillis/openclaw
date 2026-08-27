import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { f as resolveAgentIdFromSessionKey, r as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-D8GLfPr_.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { c as isAgentEventLifecycleGenerationCurrent, s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { t as GatewayClientRequestError } from "./request-error-Cviusa7U.js";
import { m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { n as deliveryContextFromSession, s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { K as updateSessionEntry, Kt as listSessionEntriesByStatus, Ot as applySessionEntryReplacements, Qt as loadSessionEntry, Xt as loadExactSessionEntry, w as persistSessionTranscriptTurn } from "./session-accessor-Bi6bzKQE.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { Z as cancelSessionWorkAdmissionHandoff, z as beginSessionWorkAdmission } from "./agent-harness-session-key-BMj1lPtX.js";
import { a as hasRestartRecoveryTerminalRun, c as resolveRestartRecoveryChannelAuthority, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-BoowPFT5.js";
import "./backoff-BkMI1WEL.js";
import "./code-mode-control-tools-ChmXUFfk.js";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BKFiXlHH.js";
import { n as AGENT_RUN_RESTART_ABORT_ERROR, r as AGENT_RUN_RESTART_ABORT_ERROR_CODE } from "./run-termination-B0y7ra5H.js";
import { f as listActiveEmbeddedRunSessionIds, p as listActiveEmbeddedRunSessionKeys } from "./run-state-BxqT1sw2.js";
import "./sessions-D-jhKYGW.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-BOW0O5mU.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DcKMk0pM.js";
import { c as readSessionMessagesAsync } from "./session-transcript-readers-CJcK7eRo.js";
import { M as resolveGatewaySessionStoreTarget } from "./session-utils-row-pCr636Wc.js";
import { a as hasInterSessionUserProvenance, n as MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL, s as isCompletionReportInputProvenance } from "./input-provenance-BA6fPshG.js";
import "./session-utils-CCDcSRdK.js";
import { o as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-BHAgwavm.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import { c as hasCurrentProcessOwner, d as normalizeStringSet, f as resolveRestartRecoveryStorePaths, l as mainSessionRecoveryLog, n as isMainRestartRecoveryCandidate, r as isMainSessionRecoveryPending, s as buildRestartRecoveryExpectedState, u as normalizeFiniteTimestamp } from "./main-session-recovery-state-uo_tHZLi.js";
import { n as markStartupOrphanedMainSessionsForRecovery, t as markRestartAbortedMainSessions } from "./main-session-restart-recovery-marking-CUfzG7EB.js";
import { t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-BEevnYXM.js";
import { n as isAgentToolReplaySafe } from "./tool-replay-safety-B_xTwlME.js";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript-BVy1mkbt.js";
import { r as isAnnounceRunId } from "./announce-idempotency-D7LnUTJR.js";
import { a as isIntermediateAssistantTranscriptMessage, c as isTerminalSilentAssistantMessage, l as readTerminalSourceReplyDeliveryMirror, n as getTranscriptMessageRole, o as isMeaningfulTranscriptMessage } from "./message-visibility-CIRFeK2g.js";
import { n as resolveSendPolicy } from "./send-policy-fb8W-yqC.js";
import { l as findDeliveryIntentOwner } from "./delivery-queue-storage-BoH6yiWv.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CQccTy_i.js";
import { a as scheduleMainSessionRecoveryMutation, i as retryMainSessionRecoveryMutation, r as repairMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-C-qrkjyM.js";
import { n as commitMainSessionRecovery } from "./main-session-recovery-store-Bo4rKtfM.js";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-dispatch.ts
const log = createSubsystemLogger("main-session-restart-recovery");
const RESTART_RECOVERY_RESUME_MESSAGE = formatSystemTurnPrompt("Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. Continue from the existing transcript and finish the interrupted response.");
function hasRestartRecoveryMessageActionAuthority(entry) {
	const authority = resolveRestartRecoveryChannelAuthority(entry);
	return authority !== void 0 && isTrustedMessageActionTurnIngress(authority.deliveryContext.channel);
}
/** Internal continuations never inherit channel authority; every other message-tool recovery must. */
function requiresRestartRecoveryMessageActionAuthority(entry) {
	return entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" && entry.restartRecoverySourceIngress !== "internal";
}
function buildResumeMessage(pendingFinalDeliveryText) {
	const sanitizedPendingText = typeof pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(pendingFinalDeliveryText) : "";
	if (sanitizedPendingText) return `${RESTART_RECOVERY_RESUME_MESSAGE}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"`;
	return RESTART_RECOVERY_RESUME_MESSAGE;
}
function resolveRestartRecoveryDeliveryContext(params) {
	const activeRunDeliveryContext = normalizeDeliveryContext(params.entry.restartRecoveryDeliveryContext);
	const hasActiveRunDeliveryClaim = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId) !== void 0;
	const deliveryContext = normalizeDeliveryContext(params.entry.pendingFinalDelivery?.context) ?? activeRunDeliveryContext ?? (params.includeSessionDeliveryFallback && !hasActiveRunDeliveryClaim ? deliveryContextFromSession(params.entry) : void 0);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
	if (params.cfg && resolveSendPolicy({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey,
		channel,
		chatType: params.entry.chatType
	}) === "deny") return;
	return {
		...deliveryContext,
		channel,
		to
	};
}
function normalizeRestartRecoveryTerminalStatus(value) {
	return value === "error" || value === "ok" || value === "timeout" ? value : void 0;
}
async function probeRestartRecoveryTerminalStatus(runId, gatewayRuntime) {
	try {
		const result = await gatewayRuntime.waitForAgent({
			runId,
			timeoutMs: 0
		}, 2e3);
		const status = normalizeRestartRecoveryTerminalStatus(result.status);
		return status === "timeout" && typeof result.endedAt !== "number" ? void 0 : status;
	} catch {
		return;
	}
}
async function settleRestartRecoveryDispatch(params) {
	await applySessionEntryReplacements({
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		update: (entries) => {
			if (params.shouldContinue?.() === false) return { result: void 0 };
			const current = entries.filter(({ entry }) => entry.sessionId === params.expectedSessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.expectedRecoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === params.expectedRecoverySourceRunId).toSorted((a, b) => (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0))[0];
			if (!current) return { result: void 0 };
			const entry = current.entry;
			const now = Date.now();
			if (params.terminalStatus) {
				entry.abortedLastRun = params.terminalStatus !== "ok";
				entry.status = params.terminalStatus === "ok" ? "done" : params.terminalStatus === "timeout" ? "timeout" : "failed";
				entry.endedAt = now;
				const startedAt = normalizeFiniteTimestamp(entry.startedAt);
				if (startedAt !== void 0) entry.runtimeMs = Math.max(0, now - startedAt);
				entry.restartRecoveryForceSafeTools = void 0;
				Object.assign(entry, buildRestartRecoveryClaimCleanupPatch({
					entry,
					recordTerminalSource: true,
					terminalRunId: params.expectedRecoveryRunId,
					terminalSourceRunId: params.expectedRecoverySourceRunId
				}), buildMainSessionRecoveryClearPatch(entry));
			} else entry.abortedLastRun = false;
			entry.updatedAt = now;
			return {
				result: void 0,
				replacements: [{
					sessionKey: current.sessionKey,
					entry
				}]
			};
		}
	});
}
function isExactRestartRecoveryDispatchAdmission(params) {
	const entry = params.admission.entry;
	return entry?.sessionId === params.sessionId && (entry.abortedLastRun === false && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.recoveryRunId && entry.restartRecoveryRuns?.some((run) => run.runId === params.recoveryRunId && run.lifecycleGeneration === params.lifecycleGeneration) === true || hasRestartRecoveryTerminalRun(entry, params.recoveryRunId) && (params.terminalStatus === "ok" && entry.status === "done" || params.terminalStatus === "error" && entry.status === "failed" || params.terminalStatus === "timeout" && entry.status === "timeout"));
}
async function settleAcceptedRestartRecovery(params) {
	const admission = await commitMainSessionRecovery({
		command: {
			kind: "admit_recovery",
			lifecycleGeneration: params.lifecycleGeneration,
			now: Date.now(),
			runId: params.expectedRecoveryRunId,
			sessionId: params.expectedSessionId
		},
		shouldContinue: params.shouldContinue,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	if (admission.transition.kind !== "admitted_recovery" && !isExactRestartRecoveryDispatchAdmission({
		admission,
		lifecycleGeneration: params.lifecycleGeneration,
		recoveryRunId: params.expectedRecoveryRunId,
		sessionId: params.expectedSessionId,
		terminalStatus: params.terminalStatus
	})) return false;
	if (params.shouldContinue?.() === false) return true;
	if (params.reservation) await commitMainSessionRecovery({
		command: {
			kind: "abandon_reservation",
			reservation: params.reservation
		},
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	if (params.shouldContinue?.() !== false) await settleRestartRecoveryDispatch(params);
	return true;
}
async function rollbackRestartRecoveryReservation(params) {
	return await retryMainSessionRecoveryMutation(async () => commitMainSessionRecovery({
		command: {
			kind: params.kind,
			reservation: params.reservation
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	}));
}
function scheduleRestartRecoveryReservationRollback(params) {
	scheduleMainSessionRecoveryMutation({
		mutation: () => rollbackRestartRecoveryReservation(params),
		onError: (error) => {
			log.warn(`failed delayed restart recovery reservation rollback ${params.sessionKey}: ${String(error)}`);
		},
		onSuccess: ({ entry, sessionKey }) => {
			if (entry?.sessionId === params.reservation.sessionId && sessionKey && isMainSessionRecoveryPending(entry, sessionKey)) scheduleMainSessionRecoveryPendingTarget({
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			});
		}
	});
}
async function resumeMainSession(params) {
	if (params.shouldContinue?.() === false) return "skipped";
	const lifecycleGeneration = params.lifecycleGeneration ?? getAgentEventLifecycleGeneration();
	const sanitizedPendingText = typeof params.pendingFinalDeliveryText === "string" ? sanitizePendingFinalDeliveryText(params.pendingFinalDeliveryText) : "";
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		sessionKey: params.sessionKey
	});
	const claimedRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const sourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	if (requiresRestartRecoveryMessageActionAuthority(params.entry) && !hasRestartRecoveryMessageActionAuthority(params.entry)) {
		log.warn(`refusing message-tool-only recovery without channel authority: ${params.sessionKey}`);
		return "failed";
	}
	const recoveryRunId = claimedRunId && claimedRunId !== sourceRunId ? claimedRunId : randomUUID();
	const reusingRecoveryRunId = recoveryRunId === claimedRunId;
	const dispatchSessionKey = params.canonicalSessionKey ?? params.sessionKey;
	const recoverySessionKeys = Array.from(/* @__PURE__ */ new Set([dispatchSessionKey, params.sessionKey]));
	let reservation;
	let dispatchStarted = false;
	const rollbackReservation = async (kind) => {
		if (!reservation) return;
		const current = reservation;
		const result = await rollbackRestartRecoveryReservation({
			kind,
			reservation: current,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		reservation = void 0;
		return {
			current,
			result
		};
	};
	try {
		const reserved = await commitMainSessionRecovery({
			command: {
				kind: "prepare_attempt",
				attempt: params.recoveryAttempt,
				lifecycleGeneration,
				now: Date.now(),
				observation: params.observation,
				runId: recoveryRunId,
				executionIdentity: isExecutionIdentityCollectionEnabled(params.cfg) ? { state: "enabled" } : { state: "disabled" }
			},
			requireWriteSuccess: true,
			shouldContinue: params.shouldContinue,
			target: {
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}
		});
		if (reserved.transition.kind !== "reserved") return "skipped";
		reservation = reserved.transition.reservation;
		if (params.shouldContinue?.() === false) {
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		if (!await applySessionEntryReplacements({
			sessionKeys: [params.sessionKey],
			storePath: params.storePath,
			update: (entries) => {
				if (params.shouldContinue?.() === false) return { result: false };
				const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
				if (!entry || entry.sessionId !== params.entry.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== claimedRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== sourceRunId) return { result: false };
				entry.restartRecoveryDeliveryRunId = recoveryRunId;
				if (params.forceRestartSafeTools) entry.restartRecoveryForceSafeTools = true;
				entry.updatedAt = Date.now();
				return {
					result: true,
					replacements: [{
						sessionKey: params.sessionKey,
						entry
					}]
				};
			}
		})) {
			const rollback = await rollbackReservation("cancel_reservation");
			if (params.shouldContinue?.() === false) return "skipped";
			const current = rollback?.result.entry;
			return current?.sessionId === params.entry.sessionId && current.status === "running" && current.abortedLastRun === true && !current.mainRestartRecovery?.reservation && !current.mainRestartRecovery?.tombstone ? "failed" : "skipped";
		}
		const agentParams = {
			agentId: params.agentId,
			message: buildResumeMessage(sanitizedPendingText),
			sessionKey: dispatchSessionKey,
			expectedExistingSessionId: params.entry.sessionId,
			...params.sessionWorkAdmissionHandoffId ? { internalRuntimeHandoffId: params.sessionWorkAdmissionHandoffId } : {},
			...isExecutionIdentityCollectionEnabled(params.cfg) ? { internalExecutionIdentityRetry: params.recoveryAttempt > 1 } : {},
			internalExecutionIdentityRecoveryAttempt: params.recoveryAttempt,
			idempotencyKey: recoveryRunId,
			deliver: Boolean(deliveryContext) && params.entry.restartRecoverySourceReplyDeliveryMode !== "message_tool_only",
			lane: "main",
			...params.entry.restartRecoverySourceReplyDeliveryMode ? { sourceReplyDeliveryMode: params.entry.restartRecoverySourceReplyDeliveryMode } : {},
			...params.forceRestartSafeTools ? { forceRestartSafeTools: true } : {},
			...params.forceCodeModeTools ? { forceCodeModeTools: true } : {},
			inputProvenance: {
				kind: "internal_system",
				sourceSessionKey: dispatchSessionKey,
				sourceTool: MAIN_SESSION_RESTART_RECOVERY_SOURCE_TOOL
			}
		};
		if (deliveryContext) {
			agentParams.channel = deliveryContext.channel;
			agentParams.to = deliveryContext.to;
			agentParams.bestEffortDeliver = true;
			if (deliveryContext.accountId) agentParams.accountId = deliveryContext.accountId;
			if (deliveryContext.threadId != null) agentParams.threadId = String(deliveryContext.threadId);
		}
		if (params.shouldContinue?.() === false) {
			await rollbackReservation("cancel_reservation");
			return "skipped";
		}
		if (params.forceRestartSafeTools) log.info(`dispatching restart-safe recovery for ${params.sessionKey}`);
		dispatchStarted = true;
		const dispatchResult = await params.gatewayRuntime.dispatchAgent(agentParams, 1e4);
		if (params.shouldContinue?.() === false) return "skipped";
		let terminalStatus = normalizeRestartRecoveryTerminalStatus(dispatchResult.status);
		if (!terminalStatus && reusingRecoveryRunId && dispatchResult.status === "accepted") terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
		if (params.shouldContinue?.() === false) return "skipped";
		if (!await settleAcceptedRestartRecovery({
			expectedRecoveryRunId: recoveryRunId,
			expectedRecoverySourceRunId: sourceRunId,
			expectedSessionId: params.entry.sessionId,
			lifecycleGeneration,
			sessionKey: params.sessionKey,
			sessionKeys: recoverySessionKeys,
			shouldContinue: params.shouldContinue,
			storePath: params.storePath,
			terminalStatus
		})) throw new Error(`restart recovery admission changed before settlement: ${params.sessionKey}`);
		if (params.shouldContinue?.() === false) return "skipped";
		log.info(`resumed interrupted main session: ${params.sessionKey}${sanitizedPendingText ? " (with pending payload)" : ""}`);
		return "resumed";
	} catch (error) {
		const explicitlyRejected = error instanceof GatewayClientRequestError;
		try {
			if (dispatchStarted && !explicitlyRejected && params.shouldContinue?.() !== false) {
				const terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId, params.gatewayRuntime);
				if (terminalStatus && params.shouldContinue?.() !== false) {
					if (!await settleAcceptedRestartRecovery({
						expectedRecoveryRunId: recoveryRunId,
						expectedRecoverySourceRunId: sourceRunId,
						expectedSessionId: params.entry.sessionId,
						lifecycleGeneration,
						reservation,
						sessionKey: params.sessionKey,
						sessionKeys: recoverySessionKeys,
						shouldContinue: params.shouldContinue,
						storePath: params.storePath,
						terminalStatus
					})) log.warn(`restart recovery admission changed before settlement: ${params.sessionKey}`);
					else if (params.shouldContinue?.() !== false) {
						log.info(`settled completed restart recovery for ${params.sessionKey}`);
						return "resumed";
					}
				}
			}
		} catch (settlementError) {
			if (params.shouldContinue?.() !== false) {
				log.warn(`failed to settle ambiguous restart recovery ${params.sessionKey}: ${String(settlementError)}`);
				const restoreAdmittedRecovery = async () => {
					if (params.shouldContinue?.() === false) return;
					const restored = await commitMainSessionRecovery({
						command: {
							kind: "mark_admitted_recovery_interrupted",
							lifecycleGeneration,
							now: Date.now(),
							runId: recoveryRunId,
							sessionId: params.entry.sessionId
						},
						requireWriteSuccess: true,
						shouldContinue: params.shouldContinue,
						target: {
							sessionKey: params.sessionKey,
							storePath: params.storePath
						}
					});
					return params.shouldContinue?.() !== false && restored.transition.kind === "applied" && restored.entry && restored.sessionKey ? {
						sessionId: restored.entry.sessionId,
						sessionKey: restored.sessionKey,
						storePath: params.storePath
					} : void 0;
				};
				const restored = await repairMainSessionRecoveryMutation({
					mutation: restoreAdmittedRecovery,
					onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
					onError: (restoreError) => {
						if (params.shouldContinue?.() !== false) log.warn(`failed to restore ambiguous restart recovery ${params.sessionKey}: ${String(restoreError)}`);
					}
				});
				if (params.shouldContinue?.() !== false) scheduleMainSessionRecoveryPendingTarget(restored);
			}
		}
		if (reservation) {
			const rollbackKind = dispatchStarted && !explicitlyRejected ? "abandon_reservation" : "cancel_reservation";
			await rollbackReservation(rollbackKind).catch((rollbackError) => {
				log.warn(`failed to roll back interrupted main session recovery attempt ${params.sessionKey}: ${String(rollbackError)}`);
				scheduleRestartRecoveryReservationRollback({
					kind: rollbackKind,
					reservation,
					sessionKey: params.sessionKey,
					storePath: params.storePath
				});
			});
		}
		if (params.shouldContinue?.() === false) return "skipped";
		log.warn(`failed to resume interrupted main session ${params.sessionKey}: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return "failed";
	}
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-resume-policy.ts
function readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId) {
	if (!expectedSourceTurnId) return;
	for (const message of messages.toReversed()) {
		if (getTranscriptMessageRole(message) !== "assistant") continue;
		const mirror = readTerminalSourceReplyDeliveryMirror(message);
		if (mirror?.sourceTurnId === expectedSourceTurnId) return mirror.toolCallId;
	}
}
function readCodeModeWaitCall(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant" || message.stopReason !== "toolUse") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	const supportedTypes = /* @__PURE__ */ new Set([
		"text",
		"thinking",
		"toolCall",
		"toolUse",
		"tool_use"
	]);
	if (content.some((block) => !block || typeof block !== "object" || !supportedTypes.has(String(block.type)) || block.type === "text" && Boolean(normalizeOptionalString(block.text)))) return;
	const toolCalls = content.filter((block) => {
		const type = block.type;
		return type === "toolCall" || type === "toolUse" || type === "tool_use";
	});
	if (toolCalls.length !== 1) return;
	const block = toolCalls[0];
	if (normalizeOptionalString(block.name) !== "wait") return;
	const args = block.arguments ?? block.input;
	const runId = args && typeof args === "object" ? normalizeOptionalString(args.runId) : void 0;
	if (!runId) return;
	const toolCallId = normalizeOptionalString(block.id);
	return {
		runId,
		...toolCallId ? { toolCallId } : {}
	};
}
function isResumableTailMessage(message) {
	const role = getTranscriptMessageRole(message);
	return role === "user" || role === "tool" || role === "toolResult";
}
function isPendingAssistantToolCall(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") return false;
	if (normalizeOptionalString(message.stopReason) !== "toolUse") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	let hasToolCall = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const type = normalizeOptionalString(block.type);
		if (type === "toolCall" || type === "toolUse" || type === "tool_use") {
			hasToolCall = true;
			continue;
		}
		if (type === "thinking") continue;
		if (type === "text" && !normalizeOptionalString(block.text)) continue;
		return false;
	}
	return hasToolCall;
}
function classifyDanglingToolCalls(content) {
	if (!Array.isArray(content)) return;
	let allReplaySafe = true;
	let hasToolCall = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return;
		const type = normalizeOptionalString(block.type);
		if (type !== "toolCall" && type !== "toolUse" && type !== "tool_use") continue;
		const name = normalizeOptionalString(block.name);
		if (name === "exec" || name === "wait") return { kind: "code-mode" };
		if (!isAgentToolReplaySafe({ name })) allReplaySafe = false;
		hasToolCall = true;
	}
	return hasToolCall ? {
		kind: "resumable",
		forceRestartSafeTools: !allReplaySafe
	} : { kind: "none" };
}
function readResumablePendingToolCallTail(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") return;
	if (normalizeOptionalString(message.stopReason) !== "toolUse") return;
	const classified = classifyDanglingToolCalls(message.content);
	return classified?.kind === "resumable" ? { forceRestartSafeTools: classified.forceRestartSafeTools } : void 0;
}
function readCodeModeCheckpoint(message) {
	if (!message || typeof message !== "object") return;
	const role = getTranscriptMessageRole(message);
	if (role !== "tool" && role !== "toolResult") return;
	const toolName = normalizeOptionalString(message.toolName);
	if (toolName !== "exec" && toolName !== "wait") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	const text = normalizeOptionalString(content.find((block) => block && typeof block === "object" && block.type === "text")?.text);
	if (!text) return;
	try {
		const result = JSON.parse(text);
		if (result.status === "completed" || result.status === "failed") return { replaySafe: result.replaySafe === true };
		const runId = normalizeOptionalString(result.runId);
		return result.status === "waiting" && runId ? {
			replaySafe: result.replaySafe === true,
			runId
		} : void 0;
	} catch {
		return;
	}
}
function hasReplaySafeCodeModeCheckpointInCurrentTurn(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (getTranscriptMessageRole(message) === "user") return false;
		if (readCodeModeCheckpoint(message)?.replaySafe === true) return true;
	}
	return false;
}
const LEGACY_RESTART_ABORT_ERROR_MESSAGES = /* @__PURE__ */ new Set([
	"Request was aborted",
	"This operation was aborted",
	AGENT_RUN_RESTART_ABORT_ERROR
]);
const CODE_MODE_RESTART_ABORT_ERROR = "code mode execution aborted";
function isRestartAbortAssistantMessage(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") return false;
	const stopReason = normalizeOptionalString(message.stopReason);
	if (stopReason === "aborted") return true;
	if (stopReason !== "error") return false;
	const errorCode = normalizeOptionalString(message.errorCode);
	if (errorCode !== void 0) return errorCode === AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	const errorMessage = normalizeOptionalString(message.errorMessage);
	return errorMessage !== void 0 && LEGACY_RESTART_ABORT_ERROR_MESSAGES.has(errorMessage);
}
function isRestartAbortTailArtifact(message) {
	if (!isRestartAbortAssistantMessage(message)) return false;
	const content = message.content;
	return Array.isArray(content) && content.length === 0;
}
function isRestartAbortedWaitFailure(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "toolResult") return false;
	const record = message;
	if (normalizeOptionalString(record.toolName) !== "wait" || record.isError !== true) return false;
	const details = record.details;
	if (!details || typeof details !== "object" || details.status !== "failed") return false;
	const content = record.content;
	const contentText = Array.isArray(content) ? content.filter((block) => block && typeof block === "object" && block.type === "text").map((block) => normalizeOptionalString(block.text) ?? "").join("\n") : "";
	const errorText = normalizeOptionalString(details.error) ?? normalizeOptionalString(contentText);
	const code = normalizeOptionalString(details.code);
	if (code === "aborted") return errorText === CODE_MODE_RESTART_ABORT_ERROR;
	if (code !== "internal_error") return false;
	return /^(?:(?:Abort)?Error:\s*)?(?:The|This) operation was aborted\.?$/u.test(errorText ?? "");
}
function isRestartAbortedWaitResultArtifact(message, waitMessage) {
	if (!isRestartAbortedWaitFailure(message)) return false;
	const toolCallId = normalizeOptionalString(message.toolCallId);
	const waitCall = readCodeModeWaitCall(waitMessage);
	return Boolean(toolCallId && waitCall?.toolCallId === toolCallId);
}
function isApprovalPendingToolResult(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "toolResult") return false;
	const details = message.details;
	if (!details || typeof details !== "object") return false;
	return details.status === "approval-pending";
}
function resolveMainSessionResumePolicy(messages, forceRestartSafeTools = false, expectedSourceTurnId, beforeAgentReplyState, deliveryReceiptState, deliveryToolCallId) {
	const mirroredToolCallId = readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId);
	if (mirroredToolCallId) return {
		action: "complete",
		reason: "delivered-terminal",
		toolCallId: mirroredToolCallId
	};
	if (deliveryReceiptState === "delivered-terminal") return deliveryToolCallId ? {
		action: "complete",
		reason: "delivered-terminal-receipt",
		toolCallId: deliveryToolCallId
	} : {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (deliveryReceiptState === "terminal-pending") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (beforeAgentReplyState === "handled-silent") return {
		action: "complete",
		reason: "handled-silent"
	};
	if (beforeAgentReplyState === "pending") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (beforeAgentReplyState === "handled-reply") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (beforeAgentReplyState === "handled-unrecoverable") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	const meaningfulMessages = messages.toReversed().filter((message) => isMeaningfulTranscriptMessage(message) && !isIntermediateAssistantTranscriptMessage(message));
	if (isRestartAbortAssistantMessage(meaningfulMessages[0])) {
		const dangling = classifyDanglingToolCalls(meaningfulMessages[0].content);
		if (dangling?.kind === "resumable") return {
			action: "resume",
			forceRestartSafeTools: dangling.forceRestartSafeTools
		};
		if (dangling?.kind === "none") meaningfulMessages.shift();
	}
	if (isRestartAbortedWaitResultArtifact(meaningfulMessages[0], meaningfulMessages[1])) meaningfulMessages.shift();
	const lastMeaningful = meaningfulMessages[0];
	if (forceRestartSafeTools && isPendingAssistantToolCall(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (isRestartAbortedWaitFailure(lastMeaningful)) {
		const waitCall = readCodeModeWaitCall(meaningfulMessages[1]);
		const checkpoint = readCodeModeCheckpoint(meaningfulMessages[2]);
		return waitCall && checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId ? {
			action: "resume",
			forceRestartSafeTools: true,
			forceCodeModeTools: true
		} : {
			action: "resume",
			forceRestartSafeTools: true
		};
	}
	const waitCall = readCodeModeWaitCall(lastMeaningful);
	if (waitCall) {
		const checkpoint = readCodeModeCheckpoint(meaningfulMessages[1]);
		return checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId ? {
			action: "resume",
			forceRestartSafeTools: true,
			forceCodeModeTools: true
		} : {
			action: "resume",
			forceRestartSafeTools: true
		};
	}
	const tailCheckpoint = readCodeModeCheckpoint(lastMeaningful);
	if (tailCheckpoint) return tailCheckpoint.replaySafe ? {
		action: "resume",
		forceRestartSafeTools: true,
		forceCodeModeTools: true
	} : {
		action: "resume",
		forceRestartSafeTools: true
	};
	const pendingToolCallTail = readResumablePendingToolCallTail(lastMeaningful);
	if (pendingToolCallTail) return {
		action: "resume",
		forceRestartSafeTools: pendingToolCallTail.forceRestartSafeTools
	};
	if ((lastMeaningful && typeof lastMeaningful === "object" ? classifyDanglingToolCalls(lastMeaningful.content) : void 0)?.kind === "code-mode") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (!lastMeaningful || !isResumableTailMessage(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: false
	};
	if (isApprovalPendingToolResult(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: true
	};
	const forceCodeModeTools = hasReplaySafeCodeModeCheckpointInCurrentTurn(messages);
	return {
		action: "resume",
		forceRestartSafeTools: forceCodeModeTools,
		...forceCodeModeTools ? { forceCodeModeTools: true } : {}
	};
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-checkpoint.ts
function hasOnlyAnnounceRecoveryRuns(entry) {
	const runs = entry.restartRecoveryRuns;
	return Boolean(runs?.length && runs.every((run) => isAnnounceRunId(run.runId)));
}
function hasCompletionReportUserTail(messages) {
	const message = messages.findLast((candidate) => getTranscriptMessageRole(candidate) === "user");
	if (!message || typeof message !== "object") return false;
	const userMessage = message;
	return hasInterSessionUserProvenance(userMessage) && isCompletionReportInputProvenance(userMessage.provenance);
}
async function reconcileInterruptedCompletionReport(params) {
	let didReconcile = false;
	const current = await updateSessionEntry({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (entry) => {
		const hasRecoveryRuns = Boolean(entry.restartRecoveryRuns?.length);
		const stillMatchesSource = params.source === "announce_runs" ? hasOnlyAnnounceRecoveryRuns(entry) : !hasRecoveryRuns;
		if (entry.sessionId !== params.entry.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || !stillMatchesSource) return null;
		didReconcile = true;
		const endedAt = Date.now();
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry,
				recordTerminalSource: false
			}),
			...buildMainSessionRecoveryClearPatch(entry),
			status: "killed",
			lifecycleRunId: void 0,
			abortedLastRun: false,
			endedAt,
			lastRunError: void 0,
			runtimeMs: typeof entry.startedAt === "number" ? Math.max(0, endedAt - entry.startedAt) : void 0,
			updatedAt: endedAt
		};
	}, { requireWriteSuccess: true });
	if (didReconcile) {
		mainSessionRecoveryLog.info(`reconciled interrupted completion report to non-running: ${params.sessionKey}`);
		return { outcome: "reconciled" };
	}
	return {
		outcome: "changed",
		entry: current
	};
}
function findSourceTurnRange(params) {
	const sourceUserTurnId = buildRunUserTurnIdempotencyKey(params.sourceTurnId);
	const sourceTurnIds = /* @__PURE__ */ new Set([params.sourceTurnId, sourceUserTurnId]);
	const continuationTurnId = params.continuationRunId ? buildRunUserTurnIdempotencyKey(params.continuationRunId) : void 0;
	for (let index = params.messages.length - 1; index >= 0; index -= 1) {
		const message = params.messages[index];
		if (getTranscriptMessageRole(message) === "user" && message && typeof message === "object" && sourceTurnIds.has(normalizeOptionalString(message.idempotencyKey) ?? "")) {
			let endIndex = params.messages.length;
			for (let nextIndex = index + 1; nextIndex < params.messages.length; nextIndex += 1) {
				const nextMessage = params.messages[nextIndex];
				if (getTranscriptMessageRole(nextMessage) !== "user") continue;
				const nextIdempotencyKey = nextMessage && typeof nextMessage === "object" ? normalizeOptionalString(nextMessage.idempotencyKey) : void 0;
				if (nextIdempotencyKey === `${params.sourceTurnId}:late-media` || nextIdempotencyKey === continuationTurnId || continuationTurnId !== void 0 && nextIdempotencyKey === `${continuationTurnId}:late-media`) continue;
				endIndex = nextIndex;
				break;
			}
			return {
				startIndex: index,
				endIndex
			};
		}
	}
}
function readToolCallId(message) {
	return [
		message.toolCallId,
		message.toolUseId,
		message.tool_call_id,
		message.tool_use_id,
		message.callId,
		message.call_id
	].map(normalizeOptionalString).find(Boolean);
}
function findMessageToolCallIndexInSourceTurn(params) {
	for (let index = params.sourceTurnRange.endIndex - 1; index > params.sourceTurnRange.startIndex; index -= 1) {
		const message = params.messages[index];
		if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") continue;
		const content = message.content;
		if (!Array.isArray(content)) continue;
		if (content.some((block) => {
			if (!block || typeof block !== "object") return false;
			const record = block;
			const type = normalizeOptionalString(record.type);
			return (type === "toolCall" || type === "toolUse" || type === "tool_use") && normalizeOptionalString(record.id) === params.toolCallId && normalizeOptionalString(record.name) === "message";
		})) return index;
	}
}
function hasSiblingAssistantToolCalls(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") return true;
	const content = message.content;
	if (!Array.isArray(content)) return true;
	let toolCallCount = 0;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const type = normalizeOptionalString(block.type);
		if (type === "toolCall" || type === "toolUse" || type === "tool_use") toolCallCount += 1;
	}
	return toolCallCount !== 1;
}
function isSuccessfulMessageToolResult(message, toolCallId) {
	const role = getTranscriptMessageRole(message);
	if (!message || typeof message !== "object" || role !== "tool" && role !== "toolResult") return false;
	const record = message;
	return readToolCallId(record) === toolCallId && normalizeOptionalString(record.toolName) === "message" && record.isError !== true;
}
function findSuccessfulMessageToolResultIndex(params) {
	for (let index = params.toolCallIndex + 1; index < params.sourceTurnRange.endIndex; index += 1) if (isSuccessfulMessageToolResult(params.messages[index], params.toolCallId)) return index;
}
function isSafeTerminalDeliveryTailMessage(params) {
	const mirror = readTerminalSourceReplyDeliveryMirror(params.message);
	if (mirror?.sourceTurnId === params.sourceTurnId && mirror.toolCallId === params.toolCallId) return true;
	return isRestartAbortTailArtifact(params.message);
}
function canReconcileTerminalDeliveryAtSourceTurnTail(params) {
	if (params.sourceTurnRange.endIndex !== params.messages.length) return false;
	for (let messageIndex = params.toolCallIndex + 1; messageIndex < params.sourceTurnRange.endIndex; messageIndex += 1) {
		if (messageIndex === params.successfulToolResultIndex) continue;
		const message = params.messages[messageIndex];
		if (params.successfulToolResultIndex !== void 0 && messageIndex > params.successfulToolResultIndex && messageIndex === params.sourceTurnRange.endIndex - 1 && isTerminalSilentAssistantMessage(message)) continue;
		if (isSafeTerminalDeliveryTailMessage({
			message,
			sourceTurnId: params.sourceTurnId,
			toolCallId: params.toolCallId
		})) continue;
		return false;
	}
	return true;
}
function buildRecoveryToolResultIdempotencyKey(sourceTurnId, toolCallId) {
	return `restart-recovery:message-tool-result:${sourceTurnId}:${toolCallId}`;
}
async function markSessionCompletedAfterRecoveryCheckpoint(params) {
	const expectedRecoveryRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
	const expectedRecoverySourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const endedAt = Date.now();
	const lifecyclePatch = {
		...buildRestartRecoveryClaimCleanupPatch({
			entry: params.entry,
			recordTerminalSource: expectedRecoverySourceRunId !== void 0,
			terminalSourceRunId: expectedRecoverySourceRunId
		}),
		abortedLastRun: false,
		lifecycleRunId: void 0,
		endedAt,
		pendingFinalDelivery: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryRuns: void 0,
		...buildMainSessionRecoveryClearPatch(params.entry),
		runtimeMs: typeof params.entry.startedAt === "number" ? Math.max(0, endedAt - params.entry.startedAt) : void 0,
		status: "done",
		updatedAt: endedAt
	};
	const sourceTurnId = normalizeOptionalString(params.sourceTurnId);
	if (params.reason === "handled-silent" && !sourceTurnId) return {
		outcome: "unsafe-transcript",
		reason: "handled silent checkpoint lacks its durable source turn"
	};
	const sourceTurnRange = sourceTurnId ? findSourceTurnRange({
		continuationRunId: expectedRecoveryRunId,
		messages: params.messages,
		sourceTurnId
	}) : void 0;
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (sourceTurnId && sourceTurnRange === void 0) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint cannot be matched to its durable source turn"
	};
	if (sourceTurnRange && sourceTurnRange.endIndex !== params.messages.length) return {
		outcome: "unsafe-transcript",
		reason: "recovery checkpoint belongs to an earlier transcript turn"
	};
	if (toolCallId && !sourceTurnId) return {
		outcome: "unsafe-transcript",
		reason: "terminal delivery lacks its durable source turn"
	};
	const messageToolCallIndex = toolCallId && sourceTurnRange ? findMessageToolCallIndexInSourceTurn({
		messages: params.messages,
		sourceTurnRange,
		toolCallId
	}) : void 0;
	if (toolCallId && messageToolCallIndex === void 0) return {
		outcome: "unsafe-transcript",
		reason: "terminal delivery cannot be matched to its message tool call"
	};
	if (messageToolCallIndex !== void 0 && hasSiblingAssistantToolCalls(params.messages[messageToolCallIndex])) return {
		outcome: "unsafe-transcript",
		reason: "terminal message tool call has sibling tool work"
	};
	const recoveryToolResultIdempotencyKey = toolCallId && sourceTurnId ? buildRecoveryToolResultIdempotencyKey(sourceTurnId, toolCallId) : void 0;
	const successfulToolResultIndex = toolCallId && sourceTurnRange && messageToolCallIndex !== void 0 ? findSuccessfulMessageToolResultIndex({
		messages: params.messages,
		sourceTurnRange,
		toolCallId,
		toolCallIndex: messageToolCallIndex
	}) : void 0;
	if (toolCallId && sourceTurnId && sourceTurnRange !== void 0 && messageToolCallIndex !== void 0 && !canReconcileTerminalDeliveryAtSourceTurnTail({
		messages: params.messages,
		sourceTurnId,
		sourceTurnRange,
		toolCallId,
		toolCallIndex: messageToolCallIndex,
		successfulToolResultIndex
	})) return {
		outcome: "unsafe-transcript",
		reason: successfulToolResultIndex === void 0 ? "terminal delivery would require an out-of-order transcript repair" : "terminal delivery result is followed by unfinished transcript work"
	};
	if (toolCallId && sourceTurnId && sourceTurnRange !== void 0 && messageToolCallIndex !== void 0 && recoveryToolResultIdempotencyKey && successfulToolResultIndex === void 0) {
		const expectedSessionState = buildRestartRecoveryExpectedState(params.entry);
		const completed = (await persistSessionTranscriptTurn({
			agentId: params.agentId,
			sessionId: params.entry.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			expectedSessionId: params.entry.sessionId,
			expectedSessionState,
			messages: [{
				idempotencyLookup: "scan",
				message: {
					role: "toolResult",
					toolCallId,
					toolName: "message",
					content: [{
						type: "text",
						text: "Message delivered before gateway restart."
					}],
					idempotencyKey: recoveryToolResultIdempotencyKey,
					isError: false,
					timestamp: endedAt
				}
			}],
			sessionLifecyclePatch: lifecyclePatch,
			updateMode: "none"
		})).sessionEntry?.status === "done";
		if (completed) mainSessionRecoveryLog.info(`reconciled delivered terminal reply after restart: ${params.sessionKey}`);
		return { outcome: completed ? "completed" : "changed" };
	}
	const marked = await applySessionEntryReplacements({
		sessionKeys: [params.sessionKey],
		storePath: params.storePath,
		update: (entries) => {
			const entry = entries.find((candidate) => candidate.sessionKey === params.sessionKey)?.entry;
			if (!entry || entry.sessionId !== params.entry.sessionId || params.pendingFinalDeliveryIntentId !== void 0 && entry.pendingFinalDelivery?.intentId !== params.pendingFinalDeliveryIntentId || entry.status !== "running" || entry.abortedLastRun !== true || normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== expectedRecoveryRunId || normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== expectedRecoverySourceRunId) return { result: false };
			Object.assign(entry, lifecyclePatch);
			return {
				result: true,
				replacements: [{
					sessionKey: params.sessionKey,
					entry
				}]
			};
		}
	});
	if (marked) mainSessionRecoveryLog.info(params.reason === "delivered-terminal" || params.reason === "delivered-terminal-receipt" ? `reconciled delivered terminal reply after restart: ${params.sessionKey}` : `reconciled handled silent reply after restart: ${params.sessionKey}`);
	return { outcome: marked ? "completed" : "changed" };
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-failure.ts
const TOMBSTONED_SESSION_NOTICE = "I couldn't continue this session after a gateway restart. Your transcript is safe. In WebChat, use Resume in new session to continue it; in other channels, use /new or /reset to start a replacement session.";
function buildRestartRecoveryTombstoneNoticeKey(entry) {
	return `main-session-restart-recovery:${normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ?? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) ?? entry.sessionId}:failed-notice`;
}
async function sendRestartRecoveryTombstoneNotice(params) {
	try {
		await params.gatewayRuntime.sendRecoveryNotice({
			channel: params.deliveryContext.channel,
			to: params.deliveryContext.to,
			accountId: params.deliveryContext.accountId,
			threadId: params.deliveryContext.threadId,
			text: TOMBSTONED_SESSION_NOTICE,
			idempotencyKey: buildRestartRecoveryTombstoneNoticeKey(params.entry)
		});
		mainSessionRecoveryLog.info(`sent restart recovery tombstone notice: ${params.sessionKey} (${params.reason})`);
	} catch (error) {
		mainSessionRecoveryLog.warn(`failed to send restart recovery tombstone notice ${params.sessionKey}: ${String(error)}`);
	}
}
async function writeRestartRecoveryTombstoneNotice(params) {
	const result = await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		expectedSessionId: params.entry.sessionId,
		expectedSessionState: params.expectedSessionState,
		sessionLifecyclePatch: params.sessionLifecyclePatch,
		storePath: params.storePath,
		text: TOMBSTONED_SESSION_NOTICE,
		idempotencyKey: buildRestartRecoveryTombstoneNoticeKey(params.entry)
	}).catch((error) => ({
		ok: false,
		reason: String(error)
	}));
	if (!result.ok) mainSessionRecoveryLog.warn(`failed to write restart recovery tombstone notice ${params.sessionKey}: ${result.reason}`);
	return result.ok ? "written" : "code" in result && result.code === "session-rebound" ? "stale" : "failed";
}
async function claimMainRestartRecoveryTombstone(params) {
	const claim = await commitMainSessionRecovery({
		command: {
			kind: "tombstone",
			now: Date.now(),
			observation: params.observation,
			reason: params.reason
		},
		requireWriteSuccess: true,
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	if (claim.transition.kind !== "tombstoned" || !claim.entry) return null;
	mainSessionRecoveryLog.warn(`tombstoned main-session restart recovery: ${params.sessionKey} (${params.reason})`);
	return claim.entry;
}
async function tombstoneMainRestartRecoveryWithNotice(params) {
	const deliveryContext = resolveRestartRecoveryDeliveryContext({
		cfg: params.cfg,
		entry: params.entry,
		includeSessionDeliveryFallback: true,
		sessionKey: params.sessionKey
	});
	if (!deliveryContext) {
		let entry = params.entry;
		let observation = params.observation;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const recoveryState = entry.mainRestartRecovery;
			if (!recoveryState || recoveryState.cycleId !== observation.cycleId || recoveryState.revision !== observation.revision) return "skipped";
			const now = Date.now();
			const notice = await writeRestartRecoveryTombstoneNotice({
				agentId: params.agentId,
				entry,
				expectedSessionState: buildRestartRecoveryExpectedState(entry, observation),
				sessionKey: params.sessionKey,
				sessionLifecyclePatch: {
					abortedLastRun: false,
					endedAt: now,
					lifecycleRunId: void 0,
					mainRestartRecovery: {
						...recoveryState,
						revision: recoveryState.revision + 1,
						tombstone: { reason: params.reason }
					},
					runtimeMs: Math.max(0, now - (entry.startedAt ?? now)),
					status: "failed",
					updatedAt: now
				},
				storePath: params.storePath
			});
			if (notice === "written") return "tombstoned";
			if (notice === "failed") return "notice_failed";
			const current = loadSessionEntry({
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			});
			const state = current?.mainRestartRecovery;
			if (!current || current.sessionId !== params.entry.sessionId || state?.cycleId !== params.observation.cycleId || state.tombstone || current.status !== "running" || current.abortedLastRun !== true) return "skipped";
			entry = current;
			observation = {
				sessionId: current.sessionId,
				cycleId: state.cycleId,
				revision: state.revision
			};
		}
		return "notice_failed";
	}
	const tombstonedEntry = await claimMainRestartRecoveryTombstone(params);
	if (!tombstonedEntry) return "skipped";
	await sendRestartRecoveryTombstoneNotice({
		deliveryContext,
		entry: tombstonedEntry,
		gatewayRuntime: params.gatewayRuntime,
		reason: params.reason,
		sessionKey: params.sessionKey
	});
	return "tombstoned";
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-store.ts
function pendingFinalRecoveryAction(pending, stateDir) {
	const deliveries = pending.deliveries;
	if (!deliveries?.length) return "fail";
	if (deliveries.every(({ state }) => state === "delivered" || state === "suppressed")) return "complete";
	const owners = deliveries.map(({ id }) => findDeliveryIntentOwner(id, stateDir));
	if (owners.some((owner) => owner?.status === "pending")) return "defer";
	if (pending.kind === "replayable" && deliveries.every(({ state }) => state === "prepared") && owners.every((owner) => owner === null)) return "retry";
	return pending.context && pending.intentId ? "notice" : "fail";
}
async function completePendingFinalRecoveryWithNotice(entry, sessionKey, storePath) {
	const endedAt = Date.now();
	let completed = false;
	await updateSessionEntry({
		sessionKey,
		storePath
	}, (current) => {
		if (current.sessionId !== entry.sessionId || current.pendingFinalDelivery?.intentId !== entry.pendingFinalDelivery?.intentId) return null;
		const pending = current.pendingFinalDelivery;
		completed = true;
		return {
			...buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true
			}),
			abortedLastRun: false,
			endedAt,
			lifecycleRunId: void 0,
			pendingFinalDelivery: void 0,
			...pending?.context && pending.intentId && (!current.pendingDeliveryNotice || current.pendingDeliveryNotice.createdAt <= pending.createdAt) ? { pendingDeliveryNotice: {
				createdAt: pending.createdAt,
				context: pending.context,
				intentId: pending.intentId,
				state: "owed"
			} } : {},
			restartRecoveryRuns: void 0,
			runtimeMs: typeof current.startedAt === "number" ? Math.max(0, endedAt - current.startedAt) : void 0,
			status: "done",
			updatedAt: endedAt
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	return completed;
}
function loadExpectedRestartRecoveryClaim(params) {
	const exact = loadExactSessionEntry({
		readConsistency: "latest",
		sessionKey: params.expected.sessionKey,
		storePath: params.storePath
	});
	const entry = exact?.sessionKey === params.expected.sessionKey ? exact.entry : void 0;
	return entry?.sessionId === params.expected.sessionId && entry.status === "running" && entry.abortedLastRun === true && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === params.expected.recoveryRunId && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === params.expected.recoverySourceRunId ? entry : void 0;
}
function loadExpectedRestartRecoveryTarget(params) {
	const exact = loadExactSessionEntry({
		sessionKey: params.expected.sessionKey,
		storePath: params.storePath,
		readConsistency: "latest"
	});
	const entry = exact?.sessionKey === params.expected.sessionKey ? exact.entry : void 0;
	return entry?.sessionId === params.expected.sessionId && entry.status === "running" && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, params.expected.sessionKey) ? entry : void 0;
}
function resolveRestartRecoveryDispatchTarget(params) {
	if (!params.cfg) return {
		agentId: resolveAgentIdFromSessionKey(params.sessionKey, LEGACY_IMPLICIT_AGENT_ID),
		sessionKey: params.sessionKey
	};
	try {
		const target = resolveGatewaySessionStoreTarget({
			cfg: params.cfg,
			key: params.sessionKey
		});
		return !params.cfg.session?.store || path.resolve(target.storePath) === path.resolve(params.storePath) ? {
			agentId: target.agentId,
			sessionKey: target.canonicalKey
		} : void 0;
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to resolve recovery store for ${params.sessionKey}: ${String(err)}`);
		return;
	}
}
async function recoverStore(params) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const shouldContinue = () => params.shouldContinue?.() !== false;
	const stopped = () => {
		if (shouldContinue()) return false;
		result.skipped++;
		return true;
	};
	const resumeIfCurrent = async (resumeParams) => {
		if (!shouldContinue()) return "skipped";
		return await resumeMainSession({
			...resumeParams,
			lifecycleGeneration: params.lifecycleGeneration,
			shouldContinue: params.shouldContinue
		});
	};
	const providedActiveSessionIds = params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
	const providedActiveSessionKeys = params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
	const resolveActiveSessionIds = () => providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
	const resolveActiveSessionKeys = () => providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
	let entries;
	try {
		if (params.expectedClaim) {
			const entry = loadExpectedRestartRecoveryClaim({
				expected: params.expectedClaim,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedClaim.sessionKey,
				entry
			}] : [];
		} else if (params.expectedTarget) {
			const entry = loadExpectedRestartRecoveryTarget({
				expected: params.expectedTarget,
				storePath: params.storePath
			});
			entries = entry ? [{
				sessionKey: params.expectedTarget.sessionKey,
				entry
			}] : [];
		} else entries = listSessionEntriesByStatus({ storePath: params.storePath }, ["running"]);
	} catch (err) {
		mainSessionRecoveryLog.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
		result.failed++;
		return result;
	}
	for (const { sessionKey, entry: loadedEntry } of entries.toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey))) {
		if (stopped()) return result;
		let entry = loadedEntry;
		if (!entry || entry.status !== "running" || entry.abortedLastRun !== true) continue;
		if (!isMainRestartRecoveryCandidate(entry, sessionKey)) {
			result.skipped++;
			continue;
		}
		if (resolveSessionWorkStartError(sessionKey, entry)) {
			result.skipped++;
			continue;
		}
		const dispatchTarget = resolveRestartRecoveryDispatchTarget({
			cfg: params.cfg,
			sessionKey,
			storePath: params.storePath
		});
		if (!dispatchTarget) {
			result.skipped++;
			continue;
		}
		const agentId = dispatchTarget.agentId;
		const dispatchSessionKey = params.expectedClaim?.canonicalSessionKey ?? params.expectedTarget?.canonicalSessionKey ?? dispatchTarget.sessionKey;
		if (hasCurrentProcessOwner({
			activeSessionIds: resolveActiveSessionIds(),
			activeSessionKeys: resolveActiveSessionKeys(),
			entry,
			sessionKey
		})) {
			result.skipped++;
			continue;
		}
		const resumeDedupeKey = sessionKey;
		if (params.resumedSessionKeys.has(resumeDedupeKey)) {
			result.skipped++;
			continue;
		}
		if (stopped()) return result;
		const observed = await commitMainSessionRecovery({
			command: {
				kind: "observe",
				cycleId: randomUUID(),
				lifecycleGeneration: params.lifecycleGeneration ?? getAgentEventLifecycleGeneration(),
				sessionKey
			},
			requireWriteSuccess: true,
			shouldContinue: params.shouldContinue,
			target: {
				sessionKey,
				storePath: params.storePath
			}
		});
		if (!observed.entry || observed.transition.kind !== "observed") {
			result.skipped++;
			continue;
		}
		if (stopped()) return result;
		entry = observed.entry;
		const recoveryView = observed.transition.view;
		if (recoveryView.status === "inactive" || recoveryView.status === "blocked" || recoveryView.status === "tombstoned") {
			result.skipped++;
			continue;
		}
		if (recoveryView.status === "exhausted") {
			if (stopped()) return result;
			if (await tombstoneMainRestartRecoveryWithNotice({
				agentId,
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: recoveryView.reason,
				sessionKey,
				storePath: params.storePath
			}) === "notice_failed") result.failed++;
			else result.skipped++;
			continue;
		}
		if (params.observationOnly) {
			result.skipped++;
			continue;
		}
		const recordResumeResult = (resumeResult) => {
			if (resumeResult === "resumed") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else if (resumeResult === "skipped") result.skipped++;
			else {
				result.failed++;
				const current = loadExpectedRestartRecoveryTarget({
					expected: {
						sessionId: entry.sessionId,
						sessionKey
					},
					storePath: params.storePath
				});
				if (current?.mainRestartRecovery?.chargedAttempts === 3 && !current.mainRestartRecovery.reservation) params.onExhaustedTarget?.({
					canonicalSessionKey: dispatchSessionKey,
					sessionId: entry.sessionId,
					sessionKey,
					storePath: params.storePath
				});
			}
		};
		if (requiresRestartRecoveryMessageActionAuthority(entry) && !hasRestartRecoveryMessageActionAuthority(entry)) {
			if (stopped()) return result;
			if (await tombstoneMainRestartRecoveryWithNotice({
				agentId,
				cfg: params.cfg,
				entry,
				gatewayRuntime: params.gatewayRuntime,
				observation: recoveryView.observation,
				reason: "message-tool-only recovery authority is unavailable",
				sessionKey,
				storePath: params.storePath
			}) === "notice_failed") result.failed++;
			else result.skipped++;
			continue;
		}
		const expectedRecoverySourceRunId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
		const resumeCurrent = async (options = {}) => {
			recordResumeResult(await resumeIfCurrent({
				agentId,
				canonicalSessionKey: dispatchSessionKey,
				cfg: params.cfg,
				entry,
				observation: recoveryView.observation,
				recoveryAttempt: recoveryView.nextAttempt,
				storePath: params.storePath,
				sessionKey,
				sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
				gatewayRuntime: params.gatewayRuntime,
				...options
			}));
		};
		const pendingAction = entry.pendingFinalDelivery ? pendingFinalRecoveryAction(entry.pendingFinalDelivery, params.stateDir) : void 0;
		if (pendingAction === "defer") {
			result.skipped++;
			continue;
		}
		if (pendingAction === "complete") {
			if ((await markSessionCompletedAfterRecoveryCheckpoint({
				agentId,
				entry,
				messages: [],
				pendingFinalDeliveryIntentId: entry.pendingFinalDelivery?.intentId,
				reason: "delivered-terminal-receipt",
				sessionKey,
				storePath: params.storePath
			})).outcome === "completed") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else result.skipped++;
			continue;
		}
		if (pendingAction === "notice") {
			const completed = await completePendingFinalRecoveryWithNotice(entry, sessionKey, params.storePath);
			result[completed ? "recovered" : "skipped"]++;
			continue;
		}
		if (pendingAction === "fail") {
			await resumeCurrent({
				...entry.pendingFinalDelivery?.kind === "replayable" ? { pendingFinalDeliveryText: entry.pendingFinalDelivery.text } : {},
				forceRestartSafeTools: true
			});
			continue;
		}
		if (entry.pendingFinalDelivery?.kind === "replayable" && entry.restartRecoveryForceSafeTools === true) {
			await resumeCurrent({
				pendingFinalDeliveryText: entry.pendingFinalDelivery.text,
				forceRestartSafeTools: true
			});
			continue;
		}
		let messages;
		try {
			messages = await readSessionMessagesAsync({
				agentId,
				sessionEntry: entry,
				sessionId: entry.sessionId,
				sessionKey,
				storePath: params.storePath
			}, {
				mode: "recent",
				maxMessages: 20,
				maxBytes: 256 * 1024
			});
		} catch (err) {
			if (stopped()) return result;
			if (entry.pendingFinalDelivery?.kind === "replayable") {
				mainSessionRecoveryLog.warn(`transcript unavailable for ${sessionKey}; resuming its durable pending final delivery`);
				await resumeCurrent({ pendingFinalDeliveryText: entry.pendingFinalDelivery.text });
				continue;
			}
			mainSessionRecoveryLog.warn(`failed to read transcript for ${sessionKey}: ${String(err)}`);
			result.failed++;
			continue;
		}
		if (stopped()) return result;
		if (entry.pendingFinalDelivery?.kind === "replayable") {
			await resumeCurrent({
				pendingFinalDeliveryText: entry.pendingFinalDelivery.text,
				forceRestartSafeTools: hasReplaySafeCodeModeCheckpointInCurrentTurn(messages)
			});
			continue;
		}
		const hasRecoveryRuns = Boolean(entry.restartRecoveryRuns?.length);
		const completionSource = hasOnlyAnnounceRecoveryRuns(entry) ? "announce_runs" : !hasRecoveryRuns && hasCompletionReportUserTail(messages) ? "transcript" : void 0;
		if (completionSource) {
			if (stopped()) return result;
			const reconciliation = await reconcileInterruptedCompletionReport({
				entry,
				source: completionSource,
				storePath: params.storePath,
				sessionKey
			});
			if (reconciliation.outcome === "reconciled") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.skipped++;
			} else if (reconciliation.entry?.status === "running" && reconciliation.entry.abortedLastRun === true) result.failed++;
			else result.skipped++;
			continue;
		}
		const resumePolicy = resolveMainSessionResumePolicy(messages, entry.restartRecoveryForceSafeTools === true, expectedRecoverySourceRunId, entry.restartRecoveryBeforeAgentReplyState, entry.restartRecoveryDeliveryReceiptState, entry.restartRecoveryDeliveryToolCallId);
		if (resumePolicy.action === "complete") {
			if (stopped()) return result;
			const completion = await markSessionCompletedAfterRecoveryCheckpoint({
				agentId,
				entry,
				messages,
				reason: resumePolicy.reason,
				storePath: params.storePath,
				sessionKey,
				sourceTurnId: expectedRecoverySourceRunId,
				...resumePolicy.reason === "handled-silent" ? {} : { toolCallId: resumePolicy.toolCallId }
			});
			if (completion.outcome === "completed") {
				params.resumedSessionKeys.add(resumeDedupeKey);
				result.recovered++;
			} else if (completion.outcome === "changed") result.skipped++;
			else await resumeCurrent({ forceRestartSafeTools: true });
			continue;
		}
		await resumeCurrent({
			forceRestartSafeTools: entry.restartRecoveryForceSafeTools === true || resumePolicy.forceRestartSafeTools,
			forceCodeModeTools: resumePolicy.forceCodeModeTools === true
		});
	}
	return result;
}
//#endregion
//#region src/agents/main-session-recovery/main-session-restart-recovery-runtime.ts
async function runRecoveryRetries(params) {
	let delayMs = params.initialDelayMs;
	for (let attempt = 1; attempt <= params.maxRetries && params.shouldContinue(); attempt += 1) {
		const finalAttempt = attempt === params.maxRetries;
		try {
			if (delayMs > 0) await sleepWithAbort(delayMs, params.signal, { ref: false });
			if (!params.shouldContinue() || await params.attempt(finalAttempt)) return;
		} catch (error) {
			if (!params.shouldContinue()) return;
			await params.onError(error, finalAttempt);
			if (finalAttempt) return;
		}
		delayMs = delayMs > 0 ? delayMs * 2 : params.retryDelayMs ?? 5e3;
	}
}
async function recoverRestartAbortedMainSessions(params) {
	const result = {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const resumedSessionKeys = params.resumedSessionKeys ?? /* @__PURE__ */ new Set();
	for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
		if (params.shouldContinue?.() === false) return result;
		const storeResult = await recoverStore({
			cfg: params.cfg,
			onExhaustedTarget: params.onExhaustedTarget,
			storePath,
			stateDir: params.stateDir,
			resumedSessionKeys,
			activeSessionIds: params.activeSessionIds,
			activeSessionKeys: params.activeSessionKeys,
			lifecycleGeneration: params.lifecycleGeneration,
			shouldContinue: params.shouldContinue,
			gatewayRuntime: params.gatewayRuntime
		});
		result.recovered += storeResult.recovered;
		result.failed += storeResult.failed;
		result.skipped += storeResult.skipped;
	}
	if (result.recovered > 0 || result.failed > 0) mainSessionRecoveryLog.info(`main-session restart recovery complete: recovered=${result.recovered} failed=${result.failed} skipped=${result.skipped}`);
	return result;
}
/** Retries one exact durable Control UI row from its owning per-agent SQLite store. */
async function retryRestartAbortedMainSessionRecovery(params) {
	const expected = {
		canonicalSessionKey: params.canonicalSessionKey,
		sessionId: params.expectedSessionId,
		sessionKey: params.sessionKey
	};
	const expectedClaim = params.expectedRecoveryRunId && params.expectedRecoverySourceRunId ? {
		...expected,
		recoveryRunId: params.expectedRecoveryRunId,
		recoverySourceRunId: params.expectedRecoverySourceRunId
	} : void 0;
	return await recoverExpectedRestartRecovery({
		...params,
		...expectedClaim ? { expectedClaim } : { expectedTarget: expected }
	});
}
async function recoverExpectedRestartRecovery(params) {
	const loadExpected = () => params.expectedClaim ? loadExpectedRestartRecoveryClaim({
		expected: params.expectedClaim,
		storePath: params.storePath
	}) : params.expectedTarget ? loadExpectedRestartRecoveryTarget({
		expected: params.expectedTarget,
		storePath: params.storePath
	}) : void 0;
	if (!loadExpected()) return {
		recovered: 0,
		failed: 0,
		skipped: 0
	};
	const assertExpectedCurrent = () => {
		if (!loadExpected()) throw new Error("restart recovery session ownership changed before dispatch");
	};
	const expectedSessionId = (params.expectedClaim ?? params.expectedTarget).sessionId;
	const admission = await beginSessionWorkAdmission({
		scope: params.storePath,
		identities: [
			params.sessionKey,
			params.expectedClaim?.canonicalSessionKey,
			expectedSessionId
		],
		assertAllowed: assertExpectedCurrent,
		revalidateAllowed: assertExpectedCurrent
	});
	const handoffId = admission.createHandoff();
	try {
		return await admission.run(async () => await recoverStore({
			cfg: params.cfg,
			observationOnly: params.observationOnly,
			storePath: params.storePath,
			stateDir: params.stateDir,
			resumedSessionKeys: /* @__PURE__ */ new Set(),
			expectedClaim: params.expectedClaim,
			expectedTarget: params.expectedTarget,
			sessionWorkAdmissionHandoffId: handoffId,
			lifecycleGeneration: params.lifecycleGeneration,
			shouldContinue: params.shouldContinue,
			gatewayRuntime: params.gatewayRuntime
		}));
	} finally {
		cancelSessionWorkAdmissionHandoff(handoffId);
		admission.release();
	}
}
function scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease(params) {
	const recover = () => runWithGatewayIndependentRootWorkAdmission(async () => {
		const gatewayRuntime = params.getGatewayRuntime();
		if (!gatewayRuntime) throw new Error("Gateway recovery runtime is unavailable");
		return await retryRestartAbortedMainSessionRecovery({
			cfg: params.getConfig(),
			expectedSessionId: params.expectedSessionId,
			sessionKey: params.sessionKey,
			stateDir: params.stateDir,
			storePath: params.storePath,
			gatewayRuntime
		});
	});
	runRecoveryRetries({
		initialDelayMs: 0,
		maxRetries: params.maxRetries ?? 3,
		retryDelayMs: params.delayMs ?? 5e3,
		shouldContinue: () => true,
		attempt: async (finalAttempt) => {
			const result = await recover();
			const stillPending = loadExpectedRestartRecoveryTarget({
				expected: {
					sessionId: params.expectedSessionId,
					sessionKey: params.sessionKey
				},
				storePath: params.storePath
			});
			if (result.failed === 0 && (result.recovered > 0 || !stillPending)) return true;
			if (finalAttempt && stillPending?.mainRestartRecovery?.chargedAttempts === 3 && !stillPending.mainRestartRecovery.reservation) await recover();
			return false;
		},
		onError: (error, finalAttempt) => {
			if (finalAttempt) mainSessionRecoveryLog.warn(`main-session owner-release recovery failed: ${String(error)}`);
		}
	});
}
function scheduleRestartAbortedMainSessionRecovery(params) {
	const resumedSessionKeys = /* @__PURE__ */ new Set();
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const abortController = new AbortController();
	let stopped = false;
	const shouldContinue = () => !stopped && params.shouldContinue?.() !== false && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration);
	const startupRecoveryCutoffMs = Date.now();
	const markedStorePaths = /* @__PURE__ */ new Set();
	const runRecoveryAttempt = async (exhaustedTargets) => {
		return await runWithGatewayIndependentRootWorkAdmission(async () => {
			const cfg = params.getConfig();
			const currentStorePaths = await resolveRestartRecoveryStorePaths({
				cfg,
				stateDir: params.stateDir
			});
			if (currentStorePaths.some((storePath) => !markedStorePaths.has(storePath))) {
				await markStartupOrphanedMainSessionsForRecovery({
					cfg,
					stateDir: params.stateDir,
					updatedBeforeMs: startupRecoveryCutoffMs
				});
				for (const storePath of currentStorePaths) markedStorePaths.add(storePath);
			}
			return await recoverRestartAbortedMainSessions({
				cfg,
				onExhaustedTarget: (target) => {
					exhaustedTargets.set(`${target.storePath}\u0000${target.sessionKey}`, target);
				},
				stateDir: params.stateDir,
				resumedSessionKeys,
				lifecycleGeneration,
				shouldContinue,
				gatewayRuntime: params.gatewayRuntime
			});
		});
	};
	const reconcileExhaustedTargets = async (targets) => {
		const outcomes = await Promise.allSettled([...targets].map((target) => runWithGatewayIndependentRootWorkAdmission(async () => recoverExpectedRestartRecovery({
			cfg: params.getConfig(),
			expectedTarget: {
				canonicalSessionKey: target.canonicalSessionKey,
				sessionId: target.sessionId,
				sessionKey: target.sessionKey
			},
			lifecycleGeneration,
			observationOnly: true,
			sessionKey: target.sessionKey,
			shouldContinue,
			storePath: target.storePath,
			stateDir: params.stateDir,
			gatewayRuntime: params.gatewayRuntime
		}))));
		for (const outcome of outcomes) if (outcome.status === "rejected") mainSessionRecoveryLog.warn(`main-session exhaustion reconciliation failed: ${String(outcome.reason)}`);
	};
	const cancelled = new Promise((resolve) => {
		abortController.signal.addEventListener("abort", () => resolve(), { once: true });
	});
	let exhaustedTargets = /* @__PURE__ */ new Map();
	const run = Promise.resolve().then(async () => {
		if (params.waitForStart) await Promise.race([params.waitForStart(), cancelled]);
		await runRecoveryRetries({
			initialDelayMs: params.delayMs ?? 5e3,
			maxRetries: Math.max(1, params.maxRetries ?? 3),
			shouldContinue,
			signal: abortController.signal,
			attempt: async (finalAttempt) => {
				exhaustedTargets = /* @__PURE__ */ new Map();
				if ((await runRecoveryAttempt(exhaustedTargets)).failed === 0) return true;
				if (finalAttempt && exhaustedTargets.size > 0) await reconcileExhaustedTargets(exhaustedTargets.values());
				return false;
			},
			onError: async (err, finalAttempt) => {
				if (finalAttempt) {
					mainSessionRecoveryLog.warn(`main-session restart recovery gave up: ${String(err)}`);
					await reconcileExhaustedTargets(exhaustedTargets.values());
				} else mainSessionRecoveryLog.warn(`main-session restart recovery failed: ${String(err)}`);
			}
		});
	});
	return { stop: async () => {
		stopped = true;
		abortController.abort();
		await run;
	} };
}
//#endregion
export { markRestartAbortedMainSessions, markStartupOrphanedMainSessionsForRecovery, recoverRestartAbortedMainSessions, retryRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecovery, scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease };
