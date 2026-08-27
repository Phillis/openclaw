import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as isAbortError } from "./abort-signal-D2k14JsD.js";
import { i as formatErrorMessageWithCode, o as readErrorName } from "./errors-Ccx0R-_Z.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds } from "./agent-scope-config-CUBiGmG3.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, f as parseThreadSessionSuffix, i as isCronSessionKey, l as parseCronRunScopeSuffix, n as isAcpSessionKey, u as parseRawSessionConversationRef } from "./session-key-utils-Di3FvABa.js";
import { c as classifySessionKeyShape, f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { n as emitDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { t as setSafeTimeout } from "./timer-delay-x5n129Nx.js";
import { s as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-CcZImb5w.js";
import { i as clearAgentRunContext, n as claimAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import { t as bindGatewayContextResolver } from "./gateway-request-scope-B19X7f09.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import { L as normalizeCronScheduledToolCallerOrigin, R as normalizeCronScheduledToolPolicy } from "./row-codec-gAlP-EPD.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { l as AGENT_SESSION_RESET_COMMAND_RE } from "./method-scopes-BQC2sTma.js";
import { i as resolveExplicitAgentSessionKey, r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { h as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-D5yZGaHY.js";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, d as sessionDeliveryOrigin, f as sessionDeliveryRoute, n as deliveryContextFromSession, s as normalizeDeliveryContext, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import { d as isDeliverableMessageChannel, f as isGatewayMessageChannel } from "./message-channel-BZwx7FCw.js";
import { g as consumeSessionWorkAdmissionHandoff, n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BtKN0pjk.js";
import { st as buildSessionCreationStamp } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { p as retainGatewayRootWorkAdmissionContinuation, v as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { r as mergeSessionEntry } from "./types-gVK8DqPC.js";
import { h as resolveMaintenanceConfigFromInput } from "./disk-budget-NzkPcdhZ.js";
import { At as applySessionEntryReplacements, ht as getCliSessionBinding, mt as clearAllCliSessions, zt as resolveSessionEntryAccessTarget } from "./session-accessor-fcDZuc2H.js";
import { c as resolveRestartRecoveryChannelAuthority } from "./restart-recovery-state-6FYlAu33.js";
import { l as resolveAgentHarnessSessionContextError, t as AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE, u as resolveAgentHarnessSessionIdMismatchError } from "./agent-harness-session-key-D9_Ct3Lx.js";
import { A as readTranscriptStatsSync } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import { u as recordSessionCreated } from "./session-state-events-DvygRPJJ.js";
import "./sessions-BI8dPUCI.js";
import { c as resolveTerminalMainSessionTranscriptRegistryCheck, i as hasTerminalMainSessionTranscriptNewerThanRegistrySync, o as resolveSessionLifecycleTimestamps, s as resolveSessionWorkStartError } from "./lifecycle-B13mO5hL.js";
import { n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-ClywUmJm.js";
import { n as resolveSessionResetPolicy, t as evaluateSessionFreshness } from "./reset-policy-Bcf937ne.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { i as deleteMediaBuffer } from "./store-fXRck5jl.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-Rrd1VaX1.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuqTHyA8.js";
import { s as loadPublishedGatewayReplyDispatchRuntime } from "./prepared-model-runtime-DRxNQEhr.js";
import { c as resolvePersistedOverrideModelRef } from "./model-selection-Cp8EGD61.js";
import { t as isCliProvider } from "./model-selection-cli-DIJUaQeE.js";
import { c as executionIdentitySpawnAdmission, o as parseExecutionIdentityAdmissionToken } from "./execution-identity-admission-Tv8ni-9_.js";
import { i as isRetainedExecutionOwnerBinding, n as createExecutionStartedOwnerBinding } from "./execution-owner-binding-D6RWdohd.js";
import { n as bindTaskRunExecution } from "./task-registry.store.sqlite-uc-5B4tV.js";
import { t as bindTaskFlowExecution } from "./task-flow-registry.store.sqlite-BevZzVWA.js";
import { x as findTaskByRunId, z as mapAgentRunTerminalOutcomeToTaskStatus } from "./task-registry-aynazQHF.js";
import { n as buildAgentRunTerminalOutcome, o as classifyAgentRunTerminalOutcome, p as normalizeAgentRunTimeoutPhase } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { d as isTimeoutError } from "./failover-error-DVBvcQuA.js";
import { c as createAgentRunRestartAbortError, f as isAgentRunRestartAbortReason, i as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./run-termination-hzmbXtwI.js";
import "./runtime-internal-C7MuMy9Z.js";
import { a as hasNewGeneratedMediaTaskForSessionKey, r as getGeneratedMediaTaskIdsForSessionKey } from "./task-status-access-BpeKxCiz.js";
import { a as finalizeTaskRunByRunId, r as createRunningTaskRun } from "./detached-task-runtime-1EE8WqNV.js";
import { n as resolveAgentTimeoutMs } from "./timeout-DlFI6Ssz.js";
import { r as readAcpSessionMeta } from "./session-meta-CpNLCGd4.js";
import { E as retainEmbeddedAgentRunAbortabilityForRunId, i as clearEmbeddedAgentRunAbortabilityForRunId, l as isEmbeddedAgentRunAbortableForRunId } from "./runs-eqaxGmoQ.js";
import { s as resolveTrustedGroupId } from "./agent-tools.policy-BuNXvHMo.js";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BKFiXlHH.js";
import { i as getAdmittedRunDelegatedAuthority, n as createExecutionIdentityRecoveryAdmission, r as createOperationalRunInstanceRef } from "./admitted-run-context-KQIZywud.js";
import { a as consumeAgentRuntimeExecutionLineage, s as readAgentRuntimeExecutionLineage } from "./agent-runtime-identity-token-Cal_zwyQ.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-ClPyKMyt.js";
import { t as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ovu6kj_3.js";
import { r as annotateInterSessionPromptText } from "./input-provenance-CCQsDhUy.js";
import { r as hasGeneratedMediaCompletionEvent } from "./subagent-requester-store-key-B9iKefbQ.js";
import { a as resolveExactSubagentCompletionEvent } from "./requester-tool-policy-CNXmQc7V.js";
import { a as createUserTurnTranscriptRecorder, i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript-CMdiyjwP.js";
import { o as consumeSubagentCompletionToolHandoff } from "./server-plugin-in-process-dispatch-BdIxABXU.js";
import { s as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-DMT8aOi4.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-DHZkyDhz.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { l as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { t as recordSessionParticipantBestEffort } from "./session-participant-recording-CgrciBxO.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import { n as resolveSendPolicy } from "./send-policy-P4TZtqWs.js";
import { i as runWithCronCreatorAuthorityCapability, r as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-T9-l7dcu.js";
import { t as hasProviderOwnedSession } from "./entry-freshness-DtB-5U5I.js";
import "./cli-session-CCYUcdz9.js";
import { o as transitionMainSessionRecovery } from "./main-session-recovery-state-DagFkxEX.js";
import { r as resolveExistingSessionKeyForRequest } from "./session-_tB-9DuM.js";
import { n as shouldDowngradeDeliveryToSessionOnly } from "./best-effort-delivery-DvwiJ0s1.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-CZMWzTDE.js";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-CcwhpB50.js";
import { r as runWithCanonicalSkillWorkspace } from "./autonomous-apply-KctlPl2E.js";
import { n as resolveScheduledToolPolicyContext } from "./scheduled-tool-policy-BOL4J_60.js";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-Z4Z1U4Xa.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-B77CDO7F.js";
import { r as repairMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-qdZCHqUv.js";
import { a as releaseMainSessionRecoveryOwner, n as commitMainSessionRecovery } from "./main-session-recovery-store-dpSl6NHY.js";
import { a as setChannelSourceTurnSameThreadRequired, i as setChannelSourceTurnId } from "./source-turn-id-qBM1Md8V.js";
import { f as updateChatRunProvider, l as resolveAgentRunExpiresAtMs, s as registerChatAbortController } from "./chat-abort-CsMNzOPX.js";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-Bu4zznGp.js";
import { r as buildExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-D90XjSjB.js";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-B4KFr9oE.js";
import { a as attachAgentCommandAdmissionFacts, i as withAgentCommandExecutionIdentitySpawnFacts, o as attachAgentCommandRecoveryAdmissionFacts } from "./agent-command-execution-identity-zCYtM-ae.js";
import { n as agentCommandFromGatewayIngress } from "./agent-command-BGJF3gqo.js";
import { n as resolveAgentExplicitRecipientSession, r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlanWithSessionRoute } from "./agent-delivery-B7SXPoHk.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import "./agent-DTKZxqS8.js";
import { i as isExecApprovalFollowupSessionRebound, n as claimExecApprovalFollowupRuntimeHandoff, r as finalizeExecApprovalFollowupRuntimeHandoff, s as releaseExecApprovalFollowupRuntimeHandoff } from "./bash-tools.exec-approval-followup-state-CiA8RPlH.js";
import { a as resolveCreatorSandbox, t as authorizeGatewaySessionCreation, u as gatewayClientSenderFields } from "./operator-role-policy-il7s4lXY.js";
import { i as authorizeResolvedSessionMutation } from "./session-sharing-DSLYm21V.js";
import { n as prepareGitCoauthorAttribution } from "./git-coauthor-attribution-DPzSfDW9.js";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-BsshswU5.js";
import { c as persistInboundImagesForTranscript, i as discardPreparedInboundMedia, n as MediaOffloadError, o as logAttachmentFailure, s as parseMessageWithAttachments, t as INLINE_IMAGE_DURABLE_OMISSION_MARKER } from "./chat-attachments-DPVCWrZk.js";
import { t as errorShapeFromError } from "./error-shape-AdXc5KWe.js";
import { a as emitGatewaySessionStartPluginHook, i as emitGatewaySessionEndPluginHook, s as performGatewaySessionReset } from "./session-reset-service-C83MrovO.js";
import { n as emitSessionsChanged } from "./session-change-event-Cjm468kd.js";
import { F as setGatewayDedupeEntry, I as waitForAgentJob } from "./chat-abort-runtime-DroEkxn7.js";
import { t as resolveAgentRunSessionCreation } from "./session-creation-provenance-B9w3HHXu.js";
import { t as handleChatAbortRequest } from "./chat-abort-handler-DjBzwbDE.js";
import { r as resolveVoiceWakeRouteByTrigger, t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-BPbJ7VSf.js";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-BA7mKleS.js";
import { n as getGatewayLocalUserIngress } from "./local-user-ingress-Ci8q8U5g.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/agent-turn/agent-handler-helpers.ts
const CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS = [
	250,
	1e3,
	4e3,
	15e3
];
function clientHasAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function respondDeletedAgentSession(params) {
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(params.cfg, params.canonicalKey, params.entry, { acpMetadataSessionKey: params.acpMetadataSessionKey ?? params.canonicalKey });
	if (deletedAgentId === null) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
	return true;
}
function respondUnavailableAgentSessionForKey(params) {
	const { cfg, entry, canonicalKey, legacyKey } = loadGatewaySessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
	if (respondDeletedAgentSession({
		cfg,
		canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		respond: params.respond
	})) return true;
	const harnessSessionError = resolveAgentHarnessSessionContextError(canonicalKey, entry);
	if (harnessSessionError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionError));
		return true;
	}
	const harnessSessionIdError = resolveAgentHarnessSessionIdMismatchError(entry, params.requestedSessionId);
	if (harnessSessionIdError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionIdError));
		return true;
	}
	if (params.isRawModelRun && entry?.modelSelectionLocked === true) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE));
		return true;
	}
	const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
	if (!archivedSessionError) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
	return true;
}
function resolveAllowModelOverrideFromClient(client) {
	return clientHasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function resolveCanUseInternalRuntimeHandoff(client) {
	return client?.connect?.client?.mode === GATEWAY_CLIENT_MODES.BACKEND;
}
function resolveCanUseCronRunContinuation(client) {
	return client?.internal?.cronRunContinuation === true;
}
function cronContinuationHasReusableRuntime(params) {
	const executionProvider = resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.model
	}) ?? params.provider;
	return !isCliProvider(executionProvider, params.cfg) || Boolean(getCliSessionBinding(params.entry, executionProvider)?.sessionId);
}
function withoutCronRunContinuation(entry) {
	const { cronRunContinuation: _cronRunContinuation, ...baseEntry } = entry;
	return baseEntry;
}
function emitAgentSendSessionLifecycleTransition(transition) {
	if (!transition) return;
	if (transition.previousSessionId) emitGatewaySessionEndPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.previousSessionFile,
		agentId: transition.agentId,
		workspaceDir: transition.workspaceDir,
		reason: transition.previousEndReason ?? "unknown",
		nextSessionId: transition.sessionId,
		nextSessionKey: transition.sessionKey
	});
	emitGatewaySessionStartPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.sessionId,
		resumedFrom: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.sessionFile,
		agentId: transition.agentId
	});
}
function shouldSuppressAgentPromptPersistence(params) {
	return params.inputProvenance?.kind === "inter_session" && params.inputProvenance.sourceTool === "subagent_announce" && params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
}
function withSqliteSessionFileMarker(params) {
	if (!(params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey))) return params.entry;
	return params.entry;
}
function yieldAfterAgentAcceptedAck() {
	return new Promise((resolve) => {
		setTimeout(resolve, 10);
	});
}
function waitForCronContinuationReleaseRecovery(delayMs) {
	return new Promise((resolve) => {
		setSafeTimeout(resolve, delayMs).unref?.();
	});
}
//#endregion
//#region src/gateway/server-methods/agent-cron-continuation.ts
function createCronContinuationController(params) {
	let claim;
	let recoveryScheduled = false;
	const release = async (outcome) => {
		const activeClaim = claim;
		if (!activeClaim) return true;
		const baseSessionKey = parseCronRunScopeSuffix(activeClaim.sessionKey).baseSessionKey;
		for (let attempt = 1; attempt <= 3; attempt += 1) try {
			const released = await applySessionEntryReplacements({
				activeSessionKey: activeClaim.sessionKey,
				agentId: activeClaim.sessionAgentId,
				requireWriteSuccess: true,
				sessionKeys: baseSessionKey && baseSessionKey !== activeClaim.sessionKey ? [activeClaim.sessionKey, baseSessionKey] : [activeClaim.sessionKey],
				skipMaintenance: false,
				storePath: activeClaim.storePath,
				update: (entries) => {
					const entriesByKey = new Map(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
					let current = entriesByKey.get(activeClaim.sessionKey);
					const marker = current?.cronRunContinuation;
					if (!current || marker?.phase !== "continuing" || marker.ownerRunId !== params.runId || marker.lifecycleRevision !== activeClaim.lifecycleRevision) return { result: false };
					const continuationCommittedWork = outcome?.terminalOutcome.reason === "completed" || hasNewGeneratedMediaTaskForSessionKey(activeClaim.sessionKey, activeClaim.mediaTaskIdsBefore);
					if (!continuationCommittedWork) current = structuredClone(activeClaim.initialEntry);
					else if (outcome?.terminalOutcome) {
						current.status = outcome.terminalOutcome.status === "ok" ? "done" : outcome.terminalOutcome.status === "timeout" ? "timeout" : "failed";
						current.endedAt = outcome.terminalOutcome.endedAt ?? Date.now();
					}
					const baseEntry = baseSessionKey ? entriesByKey.get(baseSessionKey) : void 0;
					const canPersistToBase = baseSessionKey !== void 0 && baseSessionKey !== activeClaim.sessionKey && baseEntry?.lifecycleRevision === activeClaim.lifecycleRevision;
					const replacements = [];
					if (continuationCommittedWork && canPersistToBase && baseEntry && baseSessionKey) replacements.push({
						sessionKey: baseSessionKey,
						entry: mergeSessionSnapshotChanges({
							initial: withoutCronRunContinuation(activeClaim.initialEntry),
							next: withoutCronRunContinuation(current),
							current: baseEntry
						})
					});
					const { ownerRunId: _ownerRunId, ownerLifecycleGeneration: _ownerLifecycleGeneration, ...releasedMarker } = continuationCommittedWork ? marker : activeClaim.initialEntry.cronRunContinuation ?? marker;
					const baseWasSuperseded = Boolean(baseEntry && baseEntry.lifecycleRevision !== activeClaim.lifecycleRevision);
					current.cronRunContinuation = {
						...releasedMarker,
						phase: "ready",
						basePersisted: releasedMarker.basePersisted === true || canPersistToBase || baseWasSuperseded
					};
					current.updatedAt = Date.now();
					replacements.push({
						sessionKey: activeClaim.sessionKey,
						entry: current
					});
					return {
						replacements,
						result: true
					};
				}
			});
			claim = void 0;
			if (released && baseSessionKey) emitSessionsChanged(params.context, {
				sessionKey: baseSessionKey,
				agentId: activeClaim.sessionAgentId,
				reason: "cron-continuation"
			});
			return released;
		} catch (error) {
			params.context.logGateway.warn(`failed to release cron continuation ${params.runId} (${attempt}/3): ${formatForLog(error)}`);
		}
		return false;
	};
	const releaseWithRecovery = async (outcome, onRecovered) => {
		const released = await release(outcome);
		const recoveryClaim = claim;
		if (released || !recoveryClaim || recoveryScheduled) return released;
		recoveryScheduled = true;
		runWithGatewayIndependentRootWorkContinuation(async () => {
			for (const delayMs of CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS) {
				await waitForCronContinuationReleaseRecovery(delayMs);
				if (claim !== recoveryClaim || getAgentEventLifecycleGeneration() !== params.lifecycleGeneration) return;
				if (await release(outcome)) {
					try {
						onRecovered?.();
					} catch (error) {
						params.context.logGateway.warn(`failed to refresh recovered cron continuation dedupe ${params.runId}: ${formatForLog(error)}`);
					}
					return;
				}
			}
			params.context.logGateway.warn(`cron continuation release recovery exhausted for ${params.runId}`);
		});
		return false;
	};
	return {
		releaseWithRecovery,
		setClaim: (value) => {
			claim = value;
		}
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-dedupe.ts
function resolveAgentDedupeKeys(params) {
	const keys = [`agent:${params.idempotencyKey}`];
	const approvalId = params.execApprovalFollowupApprovalId?.trim();
	if (approvalId) keys.push(`agent:exec-approval-followup:${approvalId}`);
	return uniqueStrings(keys);
}
function readGatewayDedupeEntry(params) {
	for (const key of params.keys) {
		const entry = params.dedupe.get(key);
		if (entry) return entry;
	}
}
function isAcceptedAgentDedupePayload(payload) {
	return typeof payload === "object" && payload !== null && payload.status === "accepted";
}
function isPreRegistrationAbortedAgentDedupePayload(payload) {
	const stopReason = payload?.stopReason;
	return typeof payload === "object" && payload !== null && payload.status === "timeout" && (stopReason === "rpc" || stopReason === "stop");
}
function isPreRegistrationAbortedAgentDedupeEntryForSession(params) {
	if (!params.entry?.ok || !isPreRegistrationAbortedAgentDedupePayload(params.entry.payload)) return false;
	const payload = params.entry.payload;
	const payloadRunId = typeof payload.runId === "string" ? payload.runId.trim() : "";
	if (payloadRunId && payloadRunId !== params.runId) return false;
	const payloadSessionKey = typeof payload.sessionKey === "string" && payload.sessionKey.trim() ? payload.sessionKey.trim() : void 0;
	const payloadAgentId = typeof payload.agentId === "string" && payload.agentId.trim() ? payload.agentId.trim() : void 0;
	if (params.agentId && payloadAgentId !== params.agentId) return false;
	const expectedSessionKeys = new Set([params.sessionKey, ...params.alternateSessionKeys ?? []].filter((value) => Boolean(value?.trim())));
	return !payloadSessionKey || expectedSessionKeys.size === 0 || expectedSessionKeys.has(payloadSessionKey);
}
function setGatewayDedupeEntries(params) {
	for (const key of params.keys) setGatewayDedupeEntry({
		dedupe: params.dedupe,
		key,
		entry: params.entry
	});
}
function setAbortedAgentDedupeEntries(params) {
	setGatewayDedupeEntries({
		dedupe: params.dedupe,
		keys: params.keys,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: {
				runId: params.runId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				status: "timeout",
				summary: "aborted",
				stopReason: params.stopReason,
				timeoutPhase: "queue",
				providerStarted: false
			}
		}
	});
}
//#endregion
//#region src/gateway/server-methods/agent-session-reset.ts
async function runSessionResetFromAgent(params) {
	const result = await performGatewaySessionReset({
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		reason: params.reason,
		commandSource: "gateway:agent",
		creation: params.creation,
		...params.requestingOperatorProfileId ? { requestingOperatorProfileId: params.requestingOperatorProfileId } : {},
		...params.operatorRoleActor ? { operatorRoleActor: params.operatorRoleActor } : {},
		armSessionDiffBaselineCapture: true,
		assertCurrent: params.assertCurrent,
		onCommitted: params.onCommitted
	});
	if (!result.ok) return result;
	if ("incognitoDeleted" in result) return {
		ok: true,
		key: result.key
	};
	return {
		ok: true,
		key: result.key,
		sessionId: result.entry.sessionId
	};
}
function sessionResetAckText(reason) {
	return reason === "new" ? "✅ New session started." : "✅ Session reset.";
}
function buildBareSessionResetResult(params) {
	return {
		payloads: [{ text: params.ackText ?? sessionResetAckText(params.reason) }],
		meta: {
			durationMs: 0,
			...params.sessionId ? { agentMeta: { sessionId: params.sessionId } } : {}
		}
	};
}
function buildBareSessionResetResponse(params) {
	return {
		runId: params.runId,
		status: "ok",
		summary: "completed",
		result: params.result
	};
}
async function deliverBareSessionResetResult(params) {
	const { deliverAgentCommandResult } = await import("./delivery.runtime.js");
	params.assertCurrent?.();
	const result = buildBareSessionResetResult({
		reason: params.reason,
		sessionId: params.sessionId,
		ackText: params.ackText
	});
	return await deliverAgentCommandResult({
		cfg: params.cfg,
		deps: params.context.deps,
		runtime: defaultRuntime,
		opts: {
			message: params.ackText ?? sessionResetAckText(params.reason),
			...params.agentId ? { agentId: params.agentId } : {},
			...params.sessionId ? { sessionId: params.sessionId } : {},
			sessionKey: params.sessionKey,
			deliver: true,
			replyTo: params.request.replyTo,
			to: params.request.to,
			replyChannel: params.request.replyChannel,
			channel: params.request.channel,
			replyAccountId: params.request.replyAccountId,
			accountId: params.request.accountId,
			threadId: params.request.threadId,
			deliveryTargetMode: params.deliveryTargetMode,
			bestEffortDeliver: params.bestEffortDeliver,
			runId: params.runId,
			messageChannel: params.originMessageChannel,
			runContext: {
				messageChannel: params.originMessageChannel,
				accountId: params.request.replyAccountId ?? params.request.accountId,
				currentThreadTs: params.request.threadId != null ? String(params.request.threadId) : void 0
			},
			allowModelOverride: false
		},
		outboundSession: void 0,
		sessionEntry: params.sessionEntry,
		result,
		payloads: result.payloads,
		preparedPlugin: params.preparedPlugin,
		assertDeliveryCurrent: params.assertCurrent
	});
}
async function resolveBareSessionResetResult(params) {
	params.assertCurrent?.();
	if (params.request.deliver !== true) return buildBareSessionResetResult({
		reason: params.reason,
		sessionId: params.sessionId,
		ackText: params.ackText
	});
	if (resolveSendPolicy({
		cfg: params.cfg,
		entry: params.sessionEntry,
		sessionKey: params.sessionKey,
		channel: sessionDeliveryChannel(params.sessionEntry),
		chatType: params.sessionEntry?.chatType
	}) === "deny") throw new Error("send blocked by session policy");
	const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		currentSessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		requestedChannel: normalizeOptionalString(params.request.replyChannel) ?? normalizeOptionalString(params.request.channel),
		explicitTo: normalizeOptionalString(params.request.replyTo) ?? normalizeOptionalString(params.request.to),
		explicitThreadId: normalizeOptionalString(params.request.threadId),
		accountId: normalizeOptionalString(params.request.replyAccountId) ?? normalizeOptionalString(params.request.accountId),
		wantsDelivery: true,
		turnSourceChannel: normalizeOptionalString(params.request.channel),
		turnSourceTo: normalizeOptionalString(params.request.to),
		turnSourceAccountId: normalizeOptionalString(params.request.accountId),
		turnSourceThreadId: normalizeOptionalString(params.request.threadId)
	});
	params.assertCurrent?.();
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey)
	});
	const bestEffortDeliver = typeof params.request.bestEffortDeliver === "boolean" ? params.request.bestEffortDeliver : params.sessionKey === mainSessionKey || params.sessionKey === "global" ? true : void 0;
	return await deliverBareSessionResetResult({
		cfg: params.cfg,
		context: params.context,
		reason: params.reason,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		preparedPlugin: deliveryPlan.plugin,
		request: {
			...params.request,
			channel: deliveryPlan.resolvedChannel,
			to: deliveryPlan.resolvedTo ?? deliveryPlan.baseDelivery.to,
			accountId: deliveryPlan.resolvedAccountId ?? deliveryPlan.baseDelivery.accountId,
			threadId: deliveryPlan.resolvedThreadId
		},
		bestEffortDeliver,
		deliveryTargetMode: deliveryPlan.deliveryTargetMode ?? deliveryPlan.baseDelivery.mode,
		originMessageChannel: params.originMessageChannel ?? deliveryPlan.resolvedChannel,
		runId: params.runId,
		assertCurrent: params.assertCurrent,
		ackText: params.ackText
	});
}
function loadBareSessionResetDeliverySession(params) {
	const loaded = loadGatewaySessionEntry(params.sessionKey, {
		clone: false,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return {
		cfg: loaded?.cfg ?? params.cfg,
		entry: loaded?.entry,
		agentId: resolveAgentIdFromSessionKey(params.sessionKey, params.agentId)
	};
}
function resolveSessionRuntimeCwd(params) {
	return normalizeOptionalString(params.requestedCwd ?? params.sessionEntry?.spawnedCwd);
}
//#endregion
//#region src/gateway/server-methods/agent-reset-phase.ts
async function runAgentResetPhase(params) {
	const base = {
		requestedSessionKey: params.requestedSessionKey,
		resolvedSessionId: params.resolvedSessionId,
		effectiveTranscriptInputText: params.effectiveTranscriptInputText,
		message: params.message
	};
	const resetCommandMatch = params.message.match(AGENT_SESSION_RESET_COMMAND_RE);
	if (!resetCommandMatch || !params.requestedSessionKey) return {
		...base,
		stop: false,
		accepted: false
	};
	if (params.abortForLifecycleRotation({
		sessionKey: params.requestedSessionKey,
		agentId: params.agentId
	})) return {
		...base,
		stop: true,
		accepted: true
	};
	const postResetMessage = normalizeOptionalString(resetCommandMatch[2]) ?? "";
	if (!clientHasAdminScope(params.client)) {
		params.respond(false, void 0, missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}));
		return {
			...base,
			stop: true,
			accepted: false
		};
	}
	const resetReason = normalizeOptionalLowercaseString(resetCommandMatch[1]) === "new" ? "new" : "reset";
	let resetResult;
	try {
		resetResult = await runSessionResetFromAgent({
			key: params.requestedSessionKey,
			...params.agentId ? { agentId: params.agentId } : {},
			reason: resetReason,
			creation: resolveAgentRunSessionCreation(params.client),
			...params.client?.authenticatedUserProfile ? { requestingOperatorProfileId: params.client.authenticatedUserProfile.profileId } : {},
			...params.client?.internal?.operatorRoleActor ? { operatorRoleActor: params.client.internal.operatorRoleActor } : {},
			assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration),
			onCommitted: (commit) => {
				params.setCommittedResetCompletion({
					reason: resetReason,
					sessionId: commit.sessionId,
					sessionKey: commit.key,
					agentId: params.agentId,
					followUpPending: Boolean(postResetMessage)
				});
			}
		});
	} catch (err) {
		if (params.abortForLifecycleRotation({
			sessionKey: params.requestedSessionKey,
			agentId: params.agentId
		})) return {
			...base,
			stop: true,
			accepted: true
		};
		throw err;
	}
	if (!resetResult.ok) {
		params.respond(false, void 0, resetResult.error);
		return {
			...base,
			stop: true,
			accepted: false
		};
	}
	const next = {
		...base,
		requestedSessionKey: resetResult.key,
		resolvedSessionId: resetResult.sessionId ?? params.resolvedSessionId
	};
	params.setCommittedResetCompletion({
		reason: resetReason,
		sessionId: resetResult.sessionId,
		sessionKey: resetResult.key,
		agentId: params.agentId,
		followUpPending: Boolean(postResetMessage)
	});
	if (postResetMessage) {
		if (params.abortForLifecycleRotation({
			sessionKey: resetResult.key,
			agentId: params.agentId
		})) return {
			...next,
			stop: true,
			accepted: true
		};
		return {
			...next,
			stop: false,
			accepted: false,
			effectiveTranscriptInputText: postResetMessage,
			message: postResetMessage
		};
	}
	try {
		const deliverySession = params.request.deliver === true ? loadBareSessionResetDeliverySession({
			cfg: params.cfg,
			sessionKey: resetResult.key,
			...params.agentId ? { agentId: params.agentId } : {}
		}) : void 0;
		const resetAckResult = await resolveBareSessionResetResult({
			cfg: deliverySession?.cfg ?? params.cfg,
			context: params.context,
			reason: resetReason,
			sessionId: resetResult.sessionId,
			sessionKey: resetResult.key,
			agentId: deliverySession?.agentId ?? params.agentId,
			sessionEntry: deliverySession?.entry,
			request: params.sessionKeyFromTo ? {
				...params.request,
				to: void 0
			} : params.request,
			runId: params.runId,
			assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration)
		});
		const responsePayload = buildBareSessionResetResponse({
			runId: params.runId,
			result: resetAckResult
		});
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			entry: {
				ts: Date.now(),
				ok: true,
				payload: responsePayload
			}
		});
		params.respond(true, responsePayload, void 0, { runId: params.runId });
		emitSessionsChanged(params.context, {
			sessionKey: resetResult.key,
			...params.agentId ? { agentId: params.agentId } : {},
			reason: resetReason
		});
		return {
			...next,
			stop: true,
			accepted: true
		};
	} catch (err) {
		if (params.abortForLifecycleRotation({
			sessionKey: resetResult.key,
			agentId: params.agentId
		})) return {
			...next,
			stop: true,
			accepted: true
		};
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
		return {
			...next,
			stop: true,
			accepted: false
		};
	}
}
//#endregion
//#region src/gateway/server-methods/agent-task-tracking.ts
function normalizeTrustedGroupMetadata(value) {
	return {
		groupId: normalizeOptionalString(value?.groupId),
		groupChannel: normalizeOptionalString(value?.groupChannel),
		groupSpace: normalizeOptionalString(value?.groupSpace ?? value?.space)
	};
}
function resolveSessionKeyGroupId(sessionKey) {
	const { baseSessionKey } = parseThreadSessionSuffix(sessionKey);
	const conversation = parseRawSessionConversationRef(baseSessionKey ?? sessionKey);
	if (!conversation || conversation.kind !== "group" && conversation.kind !== "channel") return;
	return conversation.rawId;
}
function resolveTrustedGroupMetadata(params) {
	return {
		groupId: params.stored.groupId ?? params.inherited?.groupId ?? resolveSessionKeyGroupId(params.sessionKey) ?? (params.spawnedBy ? resolveSessionKeyGroupId(params.spawnedBy) : void 0),
		groupChannel: params.stored.groupChannel ?? params.inherited?.groupChannel,
		groupSpace: params.stored.groupSpace ?? params.inherited?.groupSpace
	};
}
function requestGroupMatchesTrusted(params) {
	const requestGroupId = params.requestGroupId?.trim();
	if (!requestGroupId) return true;
	return Boolean(params.trustedGroupId && requestGroupId === params.trustedGroupId);
}
function resolveGatewayAgentTaskTrackingMode(params) {
	if (params.modelRun === true) return "none";
	if (!params.sessionKey?.trim() || params.inputProvenance?.kind === "inter_session") return "none";
	const runTaskOwner = params.client?.internal?.agentRunTracking;
	if (runTaskOwner === "plugin_subagent") return "plugin_subagent";
	const existingTask = params.runId ? findTaskByRunId(params.runId) : void 0;
	if (existingTask?.runtime === "subagent" && existingTask.childSessionKey === params.sessionKey?.trim()) return "none";
	if (runTaskOwner === "native_subagent") return "none";
	if (params.confirmedAcpManualSpawn) return "none";
	return "cli";
}
function isTrustedBackendAcpSpawnClient(client) {
	return client?.connect?.client?.id === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT && client.connect.client.mode === GATEWAY_CLIENT_MODES.BACKEND && client.isDeviceTokenAuth !== true;
}
function isConfirmedAcpManualSpawnTaskOwner(params) {
	const sessionKey = params.sessionKey;
	if (!isTrustedBackendAcpSpawnClient(params.client) || params.acpTurnSource !== "manual_spawn" || sessionKey == null || !isAcpSessionKey(sessionKey)) return false;
	try {
		return readAcpSessionMeta({ sessionKey }) != null;
	} catch (err) {
		params.logGateway.warn(`failed to read ACP session metadata for manual-spawn task tracking ${sessionKey}; falling back to cli task tracking: ${formatForLog(err)}`);
		return false;
	}
}
async function registerPluginSubagentRunFromGateway(params) {
	const childSessionKey = params.childSessionKey.trim();
	if (!childSessionKey) return;
	const ownerSessionKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: resolveAgentIdFromSessionKey(childSessionKey)
	});
	const requesterSessionKey = params.requester?.sessionKey ?? ownerSessionKey;
	const { adoptPausedSubagentRunForFollowUp, registerSubagentRun } = await import("./subagent-registry-36rPN0fA.js");
	if (!params.requester && adoptPausedSubagentRunForFollowUp({
		childSessionKey,
		runId: params.runId,
		task: params.task,
		...params.gatewayContextResolver ? { gatewayContextResolver: params.gatewayContextResolver } : {}
	})) return;
	registerSubagentRun({
		runId: params.runId,
		childSessionKey,
		controllerSessionKey: ownerSessionKey,
		requesterSessionKey,
		requesterOrigin: params.requester?.origin,
		requesterDisplayKey: params.requester ? requesterSessionKey : "main",
		task: params.task,
		cleanup: "keep",
		...params.pluginId ? { label: `plugin:${params.pluginId}` } : {},
		expectsCompletionMessage: params.requester !== void 0,
		spawnMode: "run",
		...params.gatewayContextResolver ? { gatewayContextResolver: params.gatewayContextResolver } : {}
	});
}
function tryFinalizeTrackedAgentTask(params) {
	try {
		finalizeTaskRunByRunId({
			runId: params.runId,
			runtime: "cli",
			status: params.status,
			endedAt: Date.now(),
			...params.error !== void 0 ? { error: params.error } : {},
			...params.terminalSummary !== void 0 ? { terminalSummary: params.terminalSummary } : {}
		});
	} catch (err) {
		params.log.warn(`failed to finalize tracked agent task ${params.runId}: ${formatForLog(err)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/agent-session-patch.ts
function buildAgentSessionPatch(params) {
	const storedSpawnedBy = normalizeOptionalString(params.freshEntry?.spawnedBy);
	const freshSpawnedBy = storedSpawnedBy ? resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: storedSpawnedBy,
		storeAgentId: params.sessionAgentId
	}) : void 0;
	const storedGroup = normalizeTrustedGroupMetadata(params.freshEntry);
	let inheritedGroup;
	if (freshSpawnedBy && (!storedGroup.groupId || !storedGroup.groupChannel || !storedGroup.groupSpace)) try {
		const parentEntry = resolveSessionEntryAccessTarget({
			cfg: params.cfg,
			sessionKey: freshSpawnedBy
		}).entry;
		inheritedGroup = normalizeTrustedGroupMetadata({
			groupId: parentEntry?.groupId,
			groupChannel: parentEntry?.groupChannel,
			groupSpace: parentEntry?.space
		});
	} catch (error) {
		if (error?.code === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") throw error;
		inheritedGroup = void 0;
	}
	const trustedGroup = resolveTrustedGroupMetadata({
		sessionKey: params.canonicalSessionKey,
		spawnedBy: freshSpawnedBy,
		stored: storedGroup,
		inherited: inheritedGroup
	});
	const validatedGroup = trustedGroup.groupId ? resolveTrustedGroupId({
		groupId: trustedGroup.groupId,
		sessionKey: params.canonicalSessionKey,
		spawnedBy: freshSpawnedBy
	}) : void 0;
	const trustRequestSelectors = Boolean(trustedGroup.groupId) && requestGroupMatchesTrusted({
		requestGroupId: params.normalizedSpawned.groupId,
		trustedGroupId: trustedGroup.groupId
	});
	const nextGroup = validatedGroup?.dropped ? {
		groupId: void 0,
		groupChannel: void 0,
		groupSpace: void 0
	} : {
		groupId: trustedGroup.groupId,
		groupChannel: trustedGroup.groupChannel ?? (trustRequestSelectors ? params.normalizedSpawned.groupChannel : void 0),
		groupSpace: trustedGroup.groupSpace ?? (trustRequestSelectors ? params.normalizedSpawned.groupSpace : void 0)
	};
	const effectiveDelivery = mergeDeliveryContext(deliveryContextFromSession(params.freshEntry), params.requestDeliveryHint);
	const delivery = normalizeSessionDeliveryState({
		route: sessionDeliveryRoute(params.freshEntry),
		context: effectiveDelivery,
		origin: sessionDeliveryOrigin(params.freshEntry)
	});
	const labelValue = normalizeOptionalString(params.requestLabel) || params.freshEntry?.label;
	const explicitSessionDisplayName = params.freshEntry === void 0 && params.visibleRequest && normalizeOptionalString(params.explicitSessionKey) && !labelValue && !isCronSessionKey(params.canonicalSessionKey) && !isSubagentSessionKey(params.canonicalSessionKey) && !isAcpSessionKey(params.canonicalSessionKey) ? parseAgentSessionKey(params.canonicalSessionKey)?.rest.trim() : void 0;
	const freshSessionRotatedSinceLoad = Boolean(params.initialEntry?.sessionId && params.freshEntry?.sessionId && params.freshEntry.sessionId !== params.initialEntry.sessionId);
	const freshLifecycleTimestamps = params.freshEntry ? resolveSessionLifecycleTimestamps({
		entry: params.freshEntry,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		sessionKey: params.canonicalSessionKey
	}) : void 0;
	const freshSkipImplicitExpiry = params.expectedExistingSessionId !== void 0 || params.hasRestoredCronContinuation || params.freshEntry?.modelSelectionLocked === true || params.resetPolicy.configured !== true && hasProviderOwnedSession(params.freshEntry);
	const freshFreshness = params.freshEntry ? freshSkipImplicitExpiry ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: params.freshEntry.updatedAt,
		...freshLifecycleTimestamps,
		now: params.now,
		policy: params.resetPolicy
	}) : void 0;
	const freshRequestedSessionMatchesEntry = Boolean(params.requestedSessionId && params.freshEntry?.sessionId?.trim() === params.requestedSessionId);
	const freshTerminalMainTranscriptNewerThanRegistry = params.isSystemGatewayRun || freshRequestedSessionMatchesEntry ? false : hasTerminalMainSessionTranscriptNewerThanRegistrySync({
		entry: params.freshEntry,
		sessionScope: params.cfg.session?.scope,
		sessionKey: params.canonicalSessionKey,
		agentId: params.sessionAgentId,
		mainKey: params.cfg.session?.mainKey,
		storePath: params.storePath
	});
	const freshRecoverableTerminalSession = Boolean(params.freshEntry?.sessionId) && params.visibleRequest && isRecoverableTerminalSessionStatus(params.freshEntry?.status);
	const freshCanReuseSession = Boolean(params.freshEntry?.sessionId) && ((freshFreshness?.fresh ?? false) || freshRecoverableTerminalSession) && !params.failedSessionTranscriptMissing(params.freshEntry) && !freshTerminalMainTranscriptNewerThanRegistry;
	const freshUsableRequestedSessionId = params.requestedSessionId && (!params.freshEntry?.sessionId || freshCanReuseSession) ? params.requestedSessionId : void 0;
	const freshSessionId = freshUsableRequestedSessionId ?? (freshCanReuseSession ? params.freshEntry?.sessionId : void 0) ?? params.fallbackSessionId;
	const freshIsNewSession = !params.freshEntry || !freshCanReuseSession && !freshUsableRequestedSessionId || Boolean(freshUsableRequestedSessionId && params.freshEntry?.sessionId !== freshUsableRequestedSessionId);
	const freshRotatedSessionId = Boolean(params.freshEntry?.sessionId && params.freshEntry.sessionId !== freshSessionId);
	const patchSessionId = freshSessionRotatedSinceLoad ? params.freshEntry?.sessionId : freshSessionId;
	const shouldClearRotatedState = freshRotatedSessionId && !freshSessionRotatedSinceLoad;
	const shouldClearTerminalState = freshCanReuseSession && freshRecoverableTerminalSession && !freshSessionRotatedSinceLoad && patchSessionId === params.freshEntry?.sessionId;
	const automaticRecoveryClearPatch = shouldClearRotatedState ? buildMainSessionRecoveryClearPatch(params.freshEntry) : {};
	const patch = {
		sessionId: patchSessionId,
		updatedAt: params.now,
		...freshIsNewSession && !freshSessionRotatedSinceLoad ? { sessionStartedAt: params.now } : {},
		...params.touchInteraction ? {
			lastInteractionAt: params.now,
			agentStatus: void 0
		} : {},
		...automaticRecoveryClearPatch,
		delivery,
		...labelValue ? { label: labelValue } : {},
		...explicitSessionDisplayName ? { displayName: explicitSessionDisplayName } : {},
		...freshSpawnedBy ? { spawnedBy: freshSpawnedBy } : {},
		groupId: nextGroup.groupId,
		groupChannel: nextGroup.groupChannel,
		space: nextGroup.groupSpace,
		...params.freshEntry === void 0 && params.pluginOwnerId ? { pluginOwnerId: params.pluginOwnerId } : {},
		...shouldClearRotatedState || shouldClearTerminalState ? {
			status: void 0,
			lifecycleRunId: void 0,
			lastRunId: void 0,
			startedAt: void 0,
			endedAt: void 0,
			runtimeMs: void 0,
			abortedLastRun: void 0
		} : {}
	};
	if (shouldClearRotatedState) clearAllCliSessions(patch);
	return {
		patch,
		spawnedBy: freshSpawnedBy,
		groupId: nextGroup.groupId,
		groupChannel: nextGroup.groupChannel,
		groupSpace: nextGroup.groupSpace,
		freshSessionRotatedSinceLoad,
		isNewSession: freshIsNewSession,
		rotatedSessionId: freshRotatedSessionId,
		usableRequestedSessionId: freshUsableRequestedSessionId,
		freshness: freshFreshness
	};
}
//#endregion
//#region src/gateway/server-methods/agent-session-prepare.ts
function prepareAgentSession(params) {
	const requestedSessionAgent = resolveRequestedSessionAgentId(params.cfg, params.requestedSessionKey, params.agentId);
	if (!requestedSessionAgent.ok) {
		params.respond(false, void 0, requestedSessionAgent.error);
		return;
	}
	const requestedAgentId = requestedSessionAgent.agentId;
	const { cfg, storePath, entry, canonicalKey, legacyKey, storeKeys } = loadGatewaySessionEntry(params.requestedSessionKey, {
		agentId: requestedAgentId,
		clone: false
	});
	if (params.expectedExistingSessionId && entry?.sessionId !== params.expectedExistingSessionId) {
		params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session "${canonicalKey}" changed before expected work could start.`));
		return;
	}
	let effectiveBootstrapContextRunKind = params.effectiveBootstrapContextRunKind;
	let restoredCronContinuationIdentity;
	if (hasGeneratedMediaCompletionEvent(params.request.internalEvents) && parseCronRunScopeSuffix(canonicalKey).runId !== void 0) {
		if (!params.canUseCronRunContinuation) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cron run completion handoffs are reserved for server-owned callers"));
			return;
		}
		const marker = entry?.cronRunContinuation;
		const continuationSessionId = normalizeOptionalString(entry?.sessionId);
		const staleClaim = marker?.phase === "continuing" && marker.ownerLifecycleGeneration !== params.lifecycleGeneration;
		if (staleClaim || marker?.phase === "ready" && marker.basePersisted !== true) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, staleClaim ? "cron run continuation owner was lost during gateway restart" : "cron run continuation base session was not persisted"));
			return;
		}
		if (!marker || marker.phase !== "ready" || !continuationSessionId) {
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation is not ready"));
			return;
		}
		if (params.requestedSessionId && params.requestedSessionId !== continuationSessionId) {
			params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation session changed"));
			return;
		}
		restoredCronContinuationIdentity = {
			lifecycleRevision: marker.lifecycleRevision,
			sessionId: continuationSessionId
		};
		effectiveBootstrapContextRunKind = "cron";
	}
	const sessionExistedBeforeAttachmentSetup = params.preAttachmentSession?.canonicalKey === canonicalKey ? params.preAttachmentSession : void 0;
	if (sessionExistedBeforeAttachmentSetup && !entry) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session "${canonicalKey}" was deleted while starting work. Retry.`));
		return;
	}
	if (sessionExistedBeforeAttachmentSetup && entry?.sessionId !== sessionExistedBeforeAttachmentSetup.sessionId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session "${canonicalKey}" changed while starting work. Retry.`));
		return;
	}
	if (respondDeletedAgentSession({
		cfg,
		canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		respond: params.respond
	})) return;
	const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
	if (archivedSessionError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
		return;
	}
	const canonicalSessionAgentId = parseAgentSessionKey(canonicalKey)?.agentId ?? requestedAgentId;
	const now = Date.now();
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg: cfg.session,
		resetType: resolveSessionResetType({ sessionKey: canonicalKey }),
		resetOverride: resolveChannelResetConfig({
			sessionCfg: cfg.session,
			channel: sessionDeliveryChannel(entry) ?? params.recipientChannel
		})
	});
	const lifecycleTimestamps = entry ? resolveSessionLifecycleTimestamps({
		entry,
		storePath,
		agentId: canonicalSessionAgentId,
		sessionKey: canonicalKey
	}) : void 0;
	const skipImplicitExpiry = params.expectedExistingSessionId !== void 0 || restoredCronContinuationIdentity !== void 0 || entry?.modelSelectionLocked === true || resetPolicy.configured !== true && hasProviderOwnedSession(entry);
	const freshness = entry ? skipImplicitExpiry ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: entry.updatedAt,
		...lifecycleTimestamps,
		now,
		policy: resetPolicy
	}) : void 0;
	const visibleRequest = effectiveBootstrapContextRunKind !== "cron" && effectiveBootstrapContextRunKind !== "heartbeat" && !params.request.internalEvents?.length;
	const failedSessionTranscriptMissing = (candidateEntry) => {
		if (candidateEntry?.status !== "failed" || !candidateEntry.sessionId?.trim()) return false;
		try {
			return readTranscriptStatsSync({
				agentId: canonicalSessionAgentId,
				sessionId: candidateEntry.sessionId,
				sessionKey: canonicalKey,
				storePath,
				sessionEntry: candidateEntry
			}).eventCount === 0;
		} catch {
			return true;
		}
	};
	const mainSessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId: canonicalSessionAgentId
	});
	const isSystemGatewayRun = effectiveBootstrapContextRunKind === "cron" || effectiveBootstrapContextRunKind === "heartbeat";
	const requestedSessionMatchesEntry = Boolean(params.requestedSessionId && entry?.sessionId?.trim() === params.requestedSessionId);
	const terminalMainTranscriptNewerThanRegistry = (isSystemGatewayRun || requestedSessionMatchesEntry ? void 0 : resolveTerminalMainSessionTranscriptRegistryCheck({
		entry,
		sessionScope: cfg.session?.scope,
		sessionKey: canonicalKey,
		agentId: canonicalSessionAgentId,
		mainKey: cfg.session?.mainKey,
		storePath
	})) ? hasTerminalMainSessionTranscriptNewerThanRegistrySync({
		entry,
		sessionScope: cfg.session?.scope,
		sessionKey: canonicalKey,
		agentId: canonicalSessionAgentId,
		mainKey: cfg.session?.mainKey,
		storePath
	}) : false;
	const recoverableTerminalSession = Boolean(entry?.sessionId) && visibleRequest && isRecoverableTerminalSessionStatus(entry?.status);
	const canReuseSession = Boolean(entry?.sessionId) && ((freshness?.fresh ?? false) || recoverableTerminalSession) && !failedSessionTranscriptMissing(entry) && !terminalMainTranscriptNewerThanRegistry;
	const usableRequestedSessionId = params.requestedSessionId && (!entry?.sessionId || canReuseSession) ? params.requestedSessionId : void 0;
	const sessionId = usableRequestedSessionId ?? (canReuseSession ? entry?.sessionId : void 0) ?? randomUUID();
	const isNewSession = !entry || !canReuseSession && !usableRequestedSessionId || Boolean(usableRequestedSessionId && entry?.sessionId !== usableRequestedSessionId);
	return {
		cfg,
		storePath,
		entry,
		canonicalKey,
		storeKeys,
		maintenanceConfig: resolveMaintenanceConfigFromInput(cfg.session?.maintenance),
		canonicalSessionAgentId,
		resetPolicy,
		now,
		freshness,
		visibleRequest,
		mainSessionKey,
		isSystemGatewayRun,
		usableRequestedSessionId,
		sessionId,
		isNewSession,
		rotatedSessionId: Boolean(entry?.sessionId && entry.sessionId !== sessionId),
		touchInteraction: visibleRequest,
		sessionPersistedBeforeGatewayAdmission: entry !== void 0,
		effectiveBootstrapContextRunKind,
		restoredCronContinuationIdentity,
		failedSessionTranscriptMissing
	};
}
//#endregion
//#region src/gateway/server-methods/agent-expected-session.ts
var ExpectedExistingSessionChangedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ExpectedExistingSessionChangedError";
	}
};
function resolveExpectedExistingSessionConstraint(params) {
	const sessionId = normalizeOptionalString(params.expectedExistingSessionId);
	if (!sessionId) return { ok: true };
	if (!params.canUseInternalRuntimeHandoff) return {
		ok: false,
		error: "expectedExistingSessionId is reserved for backend callers."
	};
	const handoffId = normalizeOptionalString(params.internalRuntimeHandoffId);
	return {
		ok: true,
		constraint: {
			sessionId,
			...handoffId ? { handoffId } : {}
		}
	};
}
function validateExpectedExistingSessionTarget(params) {
	if (!params.constraint) return;
	if (!params.requestedSessionKey) return "expectedExistingSessionId requires an explicit session key.";
	if (params.requestedSessionId && params.requestedSessionId !== params.constraint.sessionId) return "conflicting session identity constraints.";
}
function assertExpectedExistingSession(params) {
	if (params.constraint && params.entry?.sessionId !== params.constraint.sessionId) throw new ExpectedExistingSessionChangedError(params.message);
}
function consumeExpectedSessionWorkAdmission(params) {
	const handoffId = params.constraint?.handoffId;
	if (!handoffId) return;
	const lease = consumeSessionWorkAdmissionHandoff({
		handoffId,
		scope: params.scope,
		identities: params.identities,
		onInterrupt: params.onInterrupt
	});
	if (!lease) throw new Error("session work admission handoff is unavailable");
	return lease;
}
//#endregion
//#region src/gateway/agent-turn/agent-admission-controller.ts
function createAgentAdmissionController(params) {
	let admission;
	let admittedRunAbort;
	let postAdmissionAbort;
	let postAdmissionTimeout;
	let postAdmissionSuperseded = false;
	let lifecycleRotated = false;
	const admissionAgentId = () => {
		const resolvedSessionKey = params.getResolvedSessionKey();
		return params.getResolvedSessionAgentId() ?? (resolvedSessionKey ? params.getAgentId() : void 0);
	};
	const assertAllowed = (commitOutcome = true) => {
		const resolvedSessionKey = params.getResolvedSessionKey();
		const requestedSessionKey = params.getRequestedSessionKey();
		const latest = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		if (isPreRegistrationAbortedAgentDedupeEntryForSession({
			entry: latest,
			runId: params.runId,
			sessionKey: resolvedSessionKey,
			alternateSessionKeys: [params.preAcceptedReservedSessionKey, requestedSessionKey],
			agentId: admissionAgentId()
		})) {
			if (commitOutcome) postAdmissionAbort = latest;
			return;
		}
		if (params.dedupeLifecycle.isReserved()) {
			if (!latest) {
				if (commitOutcome) {
					postAdmissionTimeout = queueTimeout(params.runId);
					setAbortedAgentDedupeEntries({
						dedupe: params.context.dedupe,
						keys: params.agentDedupeKeys,
						agentId: admissionAgentId(),
						sessionKey: resolvedSessionKey,
						runId: params.runId,
						stopReason: "timeout"
					});
				}
				return;
			}
			if (!latest.ok || !isAcceptedAgentDedupePayload(latest.payload)) {
				if (commitOutcome) postAdmissionAbort = latest;
				return;
			}
			if (latest.payload.reservationId !== params.dedupeLifecycle.reservationId) {
				if (commitOutcome) postAdmissionSuperseded = true;
				return;
			}
			if (!isFutureDateTimestampMs(latest.payload.expiresAtMs, { nowMs: Date.now() })) {
				if (commitOutcome) {
					postAdmissionTimeout = queueTimeout(params.runId);
					setAbortedAgentDedupeEntries({
						dedupe: params.context.dedupe,
						keys: params.agentDedupeKeys,
						agentId: admissionAgentId(),
						sessionKey: resolvedSessionKey,
						runId: params.runId,
						stopReason: "timeout"
					});
				}
				return;
			}
		}
		if (params.lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
			if (commitOutcome) lifecycleRotated = params.dedupeLifecycle.abortForLifecycleRotation({
				sessionKey: resolvedSessionKey,
				agentId: admissionAgentId()
			});
			return;
		}
		if (!resolvedSessionKey) return;
		const admissionAgent = admissionAgentId();
		let latestEntry = loadGatewaySessionEntry(resolvedSessionKey, {
			agentId: admissionAgent,
			clone: false
		}).entry;
		if (!latestEntry && requestedSessionKey && requestedSessionKey !== resolvedSessionKey) latestEntry = loadGatewaySessionEntry(requestedSessionKey, {
			agentId: admissionAgent,
			clone: false
		}).entry;
		assertExpectedExistingSession({
			constraint: params.expectedSession,
			entry: latestEntry,
			message: `Session "${resolvedSessionKey}" changed while starting expected work. Retry.`
		});
		if (params.getSessionPersisted() && !latestEntry) throw new Error(`Session "${resolvedSessionKey}" was deleted while starting work. Retry.`);
		const archivedError = resolveSessionWorkStartError(resolvedSessionKey, latestEntry);
		if (archivedError) throw new Error(archivedError);
		if (commitOutcome && latestEntry?.sessionId && latestEntry.sessionId !== params.getSupersededSessionId()) params.setAdmittedSessionId(latestEntry.sessionId);
	};
	const interrupt = () => {
		if (admittedRunAbort?.entry) admittedRunAbort.entry.abortStopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
		if (admittedRunAbort) {
			admittedRunAbort.controller.abort(createAgentRunRestartAbortError());
			return;
		}
		const reservedEntry = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		if (reservedEntry?.ok && isAcceptedAgentDedupePayload(reservedEntry.payload) && reservedEntry.payload.reservationId === params.dedupeLifecycle.reservationId) setAbortedAgentDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			agentId: admissionAgentId(),
			sessionKey: params.getResolvedSessionKey(),
			runId: params.runId,
			stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
		});
	};
	const acquire = async (scope) => {
		if (admission) return;
		admission = consumeExpectedSessionWorkAdmission({
			constraint: params.expectedSession,
			scope,
			identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
			onInterrupt: interrupt
		}) ?? await beginSessionWorkAdmission({
			scope,
			identities: [params.getResolvedSessionKey(), params.getResolvedSessionId()],
			assertAllowed: () => assertAllowed(false),
			revalidateAllowed: assertAllowed,
			onInterrupt: interrupt
		});
	};
	const respondToOutcome = () => {
		if (postAdmissionAbort) {
			admission?.release();
			params.dedupeLifecycle.markAccepted(true);
			params.io.emitAcceptance([
				postAdmissionAbort.ok,
				postAdmissionAbort.payload,
				postAdmissionAbort.error
			], {
				cached: true,
				runId: params.runId
			});
			return true;
		}
		if (postAdmissionTimeout || postAdmissionSuperseded) {
			admission?.release();
			params.dedupeLifecycle.markAccepted(true);
			params.io.emitAcceptance([
				true,
				postAdmissionTimeout ?? {
					runId: params.runId,
					status: "in_flight"
				},
				void 0
			], {
				cached: true,
				runId: params.runId
			});
			return true;
		}
		if (lifecycleRotated) {
			admission?.release();
			return true;
		}
		return false;
	};
	return {
		admissionAgentId,
		assertAllowed,
		acquire,
		respondToOutcome,
		hasOutcome: () => Boolean(postAdmissionAbort || postAdmissionTimeout || postAdmissionSuperseded || lifecycleRotated),
		getAdmission: () => admission,
		getAdmittedRunAbort: () => admittedRunAbort,
		setAdmittedRunAbort: (value) => {
			admittedRunAbort = value;
		},
		release: () => admission?.release()
	};
}
function queueTimeout(runId) {
	return {
		runId,
		status: "timeout",
		summary: "aborted",
		stopReason: "timeout",
		timeoutPhase: "queue",
		providerStarted: false
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-content-phase.ts
async function prepareAgentContentPhase(params) {
	const transcriptInputText = (params.request.message ?? "").trim();
	let message = params.isRawModelRun ? transcriptInputText : annotateInterSessionPromptText(transcriptInputText, params.inputProvenance);
	let images = [];
	let imageOrder = [];
	let media = [];
	let offloadedRefs = [];
	let supportsInlineImages;
	let agentId = params.agentId;
	let requestedSessionKey = params.requestedSessionKey;
	const isKnownGatewayChannel = (value) => isGatewayMessageChannel(value) || isInternalNonDeliveryChannel(value);
	const channelHints = normalizeStringEntries([params.request.channel, params.request.replyChannel].filter((value) => typeof value === "string"));
	for (const rawChannel of channelHints) {
		const normalized = normalizeMessageChannel(rawChannel);
		if (normalized && normalized !== "last" && !isKnownGatewayChannel(normalized)) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown channel: ${normalized}`));
			return;
		}
	}
	if (params.normalizedAttachments.length > 0) {
		let baseProvider;
		let baseModel;
		let catalogAgentId = agentId;
		let requestedAcpMeta;
		if (params.requestedSessionKeyRaw) {
			const { cfg, entry, canonicalKey } = loadGatewaySessionEntry(params.requestedSessionKeyRaw, {
				...agentId ? { agentId } : {},
				clone: false
			});
			const sessionAgentId = resolveAgentIdFromSessionKey(canonicalKey, agentId);
			catalogAgentId = sessionAgentId;
			const modelRef = resolveSessionModelRef(cfg, entry, sessionAgentId);
			baseProvider = modelRef.provider;
			baseModel = modelRef.model;
			requestedAcpMeta = readAcpSessionMeta({ sessionKey: canonicalKey });
		}
		supportsInlineImages = params.request.acpTurnSource === "manual_spawn" && isAcpSessionKey(params.requestedSessionKeyRaw) && requestedAcpMeta != null ? true : await resolveGatewayModelSupportsImages({
			loadGatewayModelCatalog: params.context.loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot: params.context.loadGatewayModelCatalogSnapshot,
			agentId: catalogAgentId,
			provider: params.providerOverride || baseProvider,
			model: params.modelOverride || baseModel
		});
	}
	const voiceWakeTrigger = normalizeOptionalString(params.request.voiceWakeTrigger) ?? "";
	const replyTo = normalizeOptionalString(params.request.replyTo) ?? "";
	const recipientChannel = params.explicitRecipientSession?.channel ?? params.request.channel;
	const recipientAccountId = params.explicitRecipientSession?.accountId ?? params.request.accountId;
	const recipientThreadId = params.explicitRecipientSession?.threadId ?? params.request.threadId;
	const to = params.sessionKeyFromTo ? "" : params.explicitRecipientSession?.to ?? params.requestedToRaw ?? "";
	const explicitVoiceWakeSessionTarget = params.requestedSessionKeyRaw ? (() => {
		const { cfg, canonicalKey } = loadGatewaySessionEntry(params.requestedSessionKeyRaw, {
			...agentId ? { agentId } : {},
			clone: false
		});
		const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey, agentId);
		const compatibilityOwner = tryResolveSessionCompatibilityOwnerAgentId(cfg, canonicalKey);
		if (!compatibilityOwner || routedAgentId !== compatibilityOwner) return true;
		return canonicalKey !== resolveAgentMainSessionKey({
			cfg,
			agentId: routedAgentId
		});
	})() : false;
	const canAutoRouteVoiceWake = !normalizeOptionalString(params.request.agentId) && !explicitVoiceWakeSessionTarget && !params.requestedSessionId && !replyTo && !to;
	if (Object.hasOwn(params.request, "voiceWakeTrigger") && canAutoRouteVoiceWake) try {
		const route = resolveVoiceWakeRouteByTrigger({
			trigger: voiceWakeTrigger || void 0,
			config: await loadVoiceWakeRoutingConfig()
		});
		if ("agentId" in route) if (params.knownAgents.includes(route.agentId)) {
			agentId = route.agentId;
			requestedSessionKey = resolveExplicitAgentSessionKey({
				cfg: params.cfg,
				agentId
			});
		} else params.context.logGateway.warn(`voicewake routing ignored unknown agentId="${route.agentId}" trigger="${voiceWakeTrigger}"`);
		else if ("sessionKey" in route) if (classifySessionKeyShape(route.sessionKey) !== "malformed_agent") {
			const canonicalKey = loadGatewaySessionEntry(route.sessionKey, { clone: false }).canonicalKey;
			const routedAgentId = resolveAgentIdFromSessionKey(canonicalKey);
			if (params.knownAgents.includes(routedAgentId)) {
				requestedSessionKey = canonicalKey;
				agentId = routedAgentId;
			} else params.context.logGateway.warn(`voicewake routing ignored unknown session agent="${routedAgentId}" sessionKey="${canonicalKey}" trigger="${voiceWakeTrigger}"`);
		} else params.context.logGateway.warn(`voicewake routing ignored malformed sessionKey="${route.sessionKey}" trigger="${voiceWakeTrigger}"`);
	} catch (err) {
		params.context.logGateway.warn(`voicewake routing load failed: ${formatForLog(err)}`);
	}
	if (params.normalizedAttachments.length > 0) try {
		const parsed = await parseMessageWithAttachments(message, params.normalizedAttachments, {
			maxBytes: resolveChatAttachmentMaxBytes(params.cfg),
			log: params.context.logGateway,
			supportsInlineImages,
			acceptNonImage: false
		});
		message = parsed.message.trim();
		images = parsed.images;
		imageOrder = parsed.imageOrder;
		media = parsed.media;
		offloadedRefs = parsed.offloadedRefs;
	} catch (err) {
		logAttachmentFailure(params.context.logGateway, "agent attachment parse failed", err);
		params.respond(false, void 0, errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
		return;
	}
	return {
		agentId,
		requestedSessionKey,
		effectiveTranscriptInputText: transcriptInputText,
		message,
		images,
		imageOrder,
		media,
		offloadedRefs,
		replyTo,
		recipientChannel,
		recipientAccountId,
		recipientThreadId,
		to
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-dispatch-execution-identity.ts
const dispatchExecutionIdentities = /* @__PURE__ */ new WeakMap();
function withAgentRunDispatchExecutionIdentity(params, facts) {
	if (!facts) return params;
	const carried = { ...params };
	dispatchExecutionIdentities.set(carried, facts);
	return carried;
}
function readAgentRunDispatchExecutionIdentity(params) {
	return dispatchExecutionIdentities.get(params);
}
//#endregion
//#region src/gateway/agent-turn/agent-run-dispatch.ts
function resolveResolvedAgentTimeoutStopReason(meta, signal) {
	if (!signal.aborted) return;
	const record = meta && typeof meta === "object" && !Array.isArray(meta) ? meta : void 0;
	if (record?.aborted !== true && record?.stopReason !== "toolUse") return;
	return resolveGatewayAgentAbortStopReason(signal) === "timeout" ? "timeout" : void 0;
}
function isGatewayAbortSignalReason(reason) {
	return reason === void 0 || isAbortError(reason) || readErrorName(reason) === "TimeoutError";
}
function isGatewayAgentAbortRejection(error, signal) {
	if (!signal.aborted) return false;
	if (isAgentRunRestartAbortReason(signal.reason)) return true;
	if (readErrorName(signal.reason) === "TimeoutError") return true;
	if (!isGatewayAbortSignalReason(signal.reason)) return false;
	return isAbortError(error) || readErrorName(error) === "TimeoutError";
}
function resolveGatewayAgentAbortStopReason(signal) {
	if (isAgentRunRestartAbortReason(signal.reason)) return "restart";
	return readErrorName(signal.reason) === "TimeoutError" ? "timeout" : "rpc";
}
const RESOLVED_GATEWAY_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "ok",
	timeout: "timeout",
	cancellation: "timeout",
	failure: "error"
};
function projectRejectedGatewayStatus(outcome) {
	return outcome.reason === "cancelled" || outcome.reason === "superseded" || outcome.stopReason === "timeout" ? "timeout" : "error";
}
function resolveAbortedAgentStopReason(entry) {
	return entry?.abortStopReason?.trim() || "rpc";
}
function deleteGatewayDedupeEntries(params) {
	for (const key of params.keys) params.dedupe.delete(key);
}
function dispatchAgentRunFromGateway(params) {
	const shouldTrackTask = params.taskTrackingMode === "cli";
	let taskTracked = false;
	let trackedTask;
	if (shouldTrackTask) try {
		trackedTask = createRunningTaskRun({
			runtime: "cli",
			sourceId: params.runId,
			ownerKey: params.ingressOpts.sessionKey,
			scopeKind: "session",
			requesterOrigin: normalizeDeliveryContext({
				channel: params.ingressOpts.channel,
				to: params.ingressOpts.to,
				accountId: params.ingressOpts.accountId,
				threadId: params.ingressOpts.threadId
			}),
			childSessionKey: params.ingressOpts.sessionKey,
			runId: params.runId,
			task: params.ingressOpts.message,
			deliveryStatus: "not_applicable",
			startedAt: Date.now()
		}) ?? void 0;
		taskTracked = Boolean(trackedTask);
	} catch (err) {
		params.context.logGateway.warn(`failed to start tracked agent task ${params.runId}: ${formatForLog(err)}`);
	}
	const settle = async (outcome) => {
		try {
			return await params.onSettled?.(outcome) ?? true;
		} catch (error) {
			params.context.logGateway.warn(`failed to settle agent continuation ${params.runId}: ${formatForLog(error)}`);
			return false;
		}
	};
	const cronCreatorAuthorityCapability = params.cronCreatorAuthority ? createCronCreatorAuthorityCapability(params.cronCreatorAuthority.runId, params.cronCreatorAuthority.callerOrigin) : void 0;
	const ingressOptsWithSpawnFacts = withAgentCommandExecutionIdentitySpawnFacts(params.ingressOpts, readAgentRunDispatchExecutionIdentity(params));
	const trackedTaskBinding = trackedTask ? createExecutionStartedOwnerBinding((admitted) => {
		try {
			const taskResult = bindTaskRunExecution({
				admitted,
				taskId: trackedTask.taskId
			});
			if ([taskResult, trackedTask.parentFlowId ? isRetainedExecutionOwnerBinding(taskResult) ? bindTaskFlowExecution({
				admitted,
				flowId: trackedTask.parentFlowId
			}) : taskResult : void 0].some((result) => result === "mismatch" || result === "missing")) params.context.logGateway.warn(`exact tracked-task execution binding was not retained for ${params.runId}`);
		} catch (error) {
			params.context.logGateway.warn(`failed to retain tracked-task execution binding ${params.runId}: ${formatForLog(error)}`);
		}
	}) : void 0;
	const ingressOptsWithTaskBinding = trackedTask ? {
		...ingressOptsWithSpawnFacts,
		onPostAdmittedRunContext: trackedTaskBinding?.onPostAdmission,
		onExecutionStarted: () => {
			ingressOptsWithSpawnFacts.onExecutionStarted?.();
			trackedTaskBinding?.onExecutionStarted();
		}
	} : ingressOptsWithSpawnFacts;
	const runAgent = () => runWithCanonicalSkillWorkspace(params.canonicalSkillWorkspaceDir, () => agentCommandFromGatewayIngress(cronCreatorAuthorityCapability ? {
		...ingressOptsWithTaskBinding,
		cronCreatorAuthorityCapability
	} : ingressOptsWithTaskBinding, defaultRuntime, params.context.deps, { restoreAdmittedRecovery: params.restoreAdmittedRecovery }, params.commandRuntimeContext));
	(cronCreatorAuthorityCapability ? runWithCronCreatorAuthorityCapability(cronCreatorAuthorityCapability, runAgent, params.abortController.signal) : runAgent()).then(async (result) => {
		const recordedOutcome = readAgentRunTerminalOutcome(result);
		const signalStopReason = resolveResolvedAgentTimeoutStopReason(result?.meta, params.abortController.signal);
		const aborted = result?.meta?.aborted === true || signalStopReason !== void 0;
		const stopReason = signalStopReason ? signalStopReason : aborted ? result?.meta?.stopReason ?? "rpc" : void 0;
		const timeoutPhase = normalizeAgentRunTimeoutPhase(result?.meta?.timeoutPhase);
		const terminalOutcome = buildAgentRunTerminalOutcome({
			status: aborted || result?.meta?.stopReason === "timeout" || timeoutPhase ? "timeout" : recordedOutcome === "failed" || result?.meta?.error || result?.meta?.stopReason === "error" ? "error" : "ok",
			error: result?.meta?.error,
			stopReason: stopReason ?? result?.meta?.stopReason,
			livenessState: result?.meta?.livenessState,
			timeoutPhase,
			providerStarted: result?.meta?.providerStarted
		});
		const responseStatus = RESOLVED_GATEWAY_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(terminalOutcome)];
		if (taskTracked) tryFinalizeTrackedAgentTask({
			runId: params.runId,
			status: mapAgentRunTerminalOutcomeToTaskStatus(terminalOutcome),
			terminalSummary: responseStatus === "timeout" ? "aborted" : responseStatus === "error" ? "failed" : "completed",
			log: params.context.logGateway
		});
		const payload = {
			runId: params.runId,
			status: responseStatus,
			summary: responseStatus === "timeout" ? "aborted" : responseStatus === "error" ? "failed" : "completed",
			...responseStatus !== "ok" && terminalOutcome.stopReason ? { stopReason: terminalOutcome.stopReason } : {},
			...responseStatus === "timeout" && terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
			...responseStatus === "timeout" && terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
			result
		};
		const persistTerminalDedupe = () => {
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.dedupeKeys,
				entry: {
					ts: Date.now(),
					ok: true,
					payload
				}
			});
		};
		if (!await settle({
			terminalOutcome,
			onRecovered: persistTerminalDedupe
		})) {
			const summary = "failed to persist cron continuation settlement";
			const error = errorShape(ErrorCodes.UNAVAILABLE, summary);
			const failedPayload = {
				runId: params.runId,
				status: "error",
				summary
			};
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.dedupeKeys,
				entry: {
					ts: Date.now(),
					ok: false,
					payload: failedPayload,
					error
				}
			});
			params.io.emitFinal([
				false,
				failedPayload,
				error
			], {
				runId: params.runId,
				error: summary
			});
			return;
		}
		persistTerminalDedupe();
		params.io.emitFinal([
			true,
			payload,
			void 0
		], { runId: params.runId });
	}).catch(async (err) => {
		const aborted = isGatewayAgentAbortRejection(err, params.abortController.signal);
		const renderedErr = formatErrorMessageWithCode(err);
		const stopReason = aborted ? resolveGatewayAgentAbortStopReason(params.abortController.signal) : isAbortError(err) ? "aborted" : void 0;
		const terminalOutcome = buildAgentRunTerminalOutcome({
			status: aborted || isTimeoutError(err) ? "timeout" : "error",
			error: renderedErr,
			stopReason,
			timeoutPhase: stopReason === "restart" ? "gateway_draining" : void 0
		});
		const responseStatus = projectRejectedGatewayStatus(terminalOutcome);
		if (taskTracked) tryFinalizeTrackedAgentTask({
			runId: params.runId,
			status: mapAgentRunTerminalOutcomeToTaskStatus(terminalOutcome),
			error: renderedErr,
			terminalSummary: renderedErr,
			log: params.context.logGateway
		});
		const error = errorShape(ErrorCodes.UNAVAILABLE, renderedErr);
		Object.defineProperty(error, "cause", { value: err });
		const payload = {
			runId: params.runId,
			status: responseStatus,
			summary: aborted ? "aborted" : renderedErr,
			...aborted ? {
				stopReason,
				...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {}
			} : {}
		};
		const persistTerminalDedupe = (settlementPersisted) => {
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.dedupeKeys,
				entry: {
					ts: Date.now(),
					ok: aborted && settlementPersisted,
					payload,
					...aborted ? {} : { error }
				}
			});
		};
		const settled = await settle({
			terminalOutcome,
			onRecovered: () => persistTerminalDedupe(true)
		});
		persistTerminalDedupe(settled);
		params.io.emitFinal([
			aborted && settled,
			payload,
			aborted && settled ? void 0 : error
		], {
			runId: params.runId,
			...aborted ? {} : { error: renderedErr }
		});
	}).finally(() => {
		clearAgentRunContext(params.runId, params.ingressOpts.lifecycleGeneration);
		params.cleanupAbortController();
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-dedupe-lifecycle.ts
function createAgentDedupeLifecycle(params) {
	let reserved = false;
	let accepted = false;
	let committedResetCompletion;
	const reservationId = randomUUID();
	const reserve = (sessionKey, dedupeAgentId) => {
		if (reserved) return;
		const acceptedAt = Date.now();
		const pendingTimeoutMs = resolveAgentTimeoutMs({
			cfg: params.cfg,
			overrideSeconds: typeof params.request.timeout === "number" ? params.request.timeout : void 0
		});
		setGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			entry: {
				ts: acceptedAt,
				ok: true,
				payload: {
					runId: params.runId,
					reservationId,
					status: "accepted",
					...sessionKey ? { sessionKey } : {},
					...dedupeAgentId ? { agentId: dedupeAgentId } : {},
					controlUiVisible: !params.suppressVisibleSessionEffects,
					acceptedAt,
					dedupeKeys: params.agentDedupeKeys,
					expiresAtMs: resolveAgentRunExpiresAtMs({
						now: acceptedAt,
						timeoutMs: pendingTimeoutMs
					}),
					ownerConnId: params.ownerConnId,
					ownerDeviceId: params.ownerDeviceId
				}
			}
		});
		reserved = true;
	};
	const clearUnaccepted = () => {
		if (!reserved || accepted) return;
		const entry = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		if (isPreRegistrationAbortedAgentDedupeEntryForSession({
			entry,
			runId: params.runId
		}) || entry?.ok && isAcceptedAgentDedupePayload(entry.payload) && entry.payload.reservationId !== reservationId) return;
		deleteGatewayDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys
		});
		reserved = false;
	};
	const abortForLifecycleRotation = (target) => {
		if (params.lifecycleGeneration === getAgentEventLifecycleGeneration()) return false;
		if (committedResetCompletion) {
			const completion = committedResetCompletion;
			const responsePayload = buildBareSessionResetResponse({
				runId: params.runId,
				result: buildBareSessionResetResult({
					reason: completion.reason,
					sessionId: completion.sessionId,
					ackText: completion.followUpPending ? `${sessionResetAckText(completion.reason)} Gateway restarted before the follow-up ran; send the follow-up message again.` : void 0
				})
			});
			accepted = true;
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.agentDedupeKeys,
				entry: {
					ts: Date.now(),
					ok: true,
					payload: responsePayload
				}
			});
			params.io.emitAcceptance([
				true,
				responsePayload,
				void 0
			], { runId: params.runId });
			emitSessionsChanged(params.context, {
				sessionKey: completion.sessionKey,
				...completion.agentId ? { agentId: completion.agentId } : {},
				reason: completion.reason
			});
			return true;
		}
		accepted = true;
		setAbortedAgentDedupeEntries({
			dedupe: params.context.dedupe,
			keys: params.agentDedupeKeys,
			agentId: target?.agentId,
			sessionKey: target?.sessionKey,
			runId: params.runId,
			stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
		});
		params.io.emitAcceptance([
			true,
			{
				runId: params.runId,
				status: "timeout",
				summary: "aborted",
				stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON,
				timeoutPhase: "queue",
				providerStarted: false
			},
			void 0
		], { runId: params.runId });
		return true;
	};
	return {
		reservationId,
		reserve,
		clearUnaccepted,
		abortForLifecycleRotation,
		isReserved: () => reserved,
		isAccepted: () => accepted,
		markAccepted: (value) => {
			accepted = value;
		},
		setCommittedResetCompletion: (value) => {
			committedResetCompletion = value;
		}
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-delivery-phase.ts
async function resolveAgentDeliveryPhase(params) {
	const activeSessionAgentId = params.resolvedSessionAgentId ? params.resolvedSessionAgentId : params.resolvedSessionKey ? resolveAgentIdFromSessionKey(params.resolvedSessionKey, params.agentId) : params.agentId;
	if (!activeSessionAgentId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent selection is required for this session"));
		return;
	}
	if (params.onRunObserved) {
		params.onRunObserved(params.runId);
		const compatibilityOwnerAgentId = params.resolvedSessionKey ? tryResolveSessionCompatibilityOwnerAgentId(params.cfgForAgent ?? params.cfg, params.resolvedSessionKey) : void 0;
		for (const [activeRunId, active] of params.context.chatAbortControllers) {
			const sameSession = active.sessionKey === params.resolvedSessionKey;
			const activeOwner = resolveChatRunOwnerAgentId({
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				defaultAgentId: compatibilityOwnerAgentId
			});
			if (activeRunId !== params.runId && sameSession && activeOwner === activeSessionAgentId) params.onRunObserved(activeRunId);
		}
	}
	const wantsDelivery = params.request.deliver === true;
	const explicitThreadId = normalizeOptionalString(params.recipientThreadId);
	const turnSourceChannel = normalizeOptionalString(params.recipientChannel);
	const deliveryPlan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfgForAgent ?? params.cfg,
		agentId: activeSessionAgentId,
		currentSessionKey: params.resolvedSessionKey,
		sessionEntry: params.sessionEntry,
		requestedChannel: params.request.replyChannel ?? params.recipientChannel,
		explicitTo: params.replyTo || params.to || void 0,
		explicitThreadId,
		accountId: params.request.replyAccountId ?? params.recipientAccountId,
		wantsDelivery,
		turnSourceChannel,
		turnSourceTo: params.to || void 0,
		turnSourceAccountId: normalizeOptionalString(params.recipientAccountId),
		turnSourceThreadId: explicitThreadId
	});
	let resolvedChannel = deliveryPlan.resolvedChannel;
	let deliveryTargetMode = deliveryPlan.deliveryTargetMode;
	const resolvedAccountId = deliveryPlan.resolvedAccountId;
	let resolvedTo = deliveryPlan.resolvedTo;
	let effectivePlan = deliveryPlan;
	let deliveryResolutionError = null;
	let deliveryTargetResolutionError = deliveryPlan.targetResolutionError;
	if (wantsDelivery && resolvedChannel === "webchat") try {
		const selection = await resolveMessageChannelSelection({ cfg: params.cfgForAgent ?? params.cfg });
		resolvedChannel = selection.channel;
		deliveryTargetMode = deliveryTargetMode ?? "implicit";
		effectivePlan = {
			...deliveryPlan,
			resolvedChannel,
			plugin: selection.plugin,
			deliveryTargetMode,
			resolvedAccountId
		};
	} catch (err) {
		if (!shouldDowngradeDeliveryToSessionOnly({
			wantsDelivery,
			bestEffortDeliver: params.bestEffortDeliver,
			resolvedChannel
		})) {
			params.respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, err));
			return;
		}
		deliveryResolutionError = String(err);
	}
	if (wantsDelivery && deliveryTargetResolutionError && !params.bestEffortDeliver) {
		params.respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, deliveryTargetResolutionError));
		return;
	}
	if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel)) {
		const fallback = resolveAgentOutboundTarget({
			cfg: params.cfgForAgent ?? params.cfg,
			plan: effectivePlan,
			targetMode: deliveryTargetMode ?? "implicit",
			validateExplicitTarget: false
		});
		if (fallback.resolvedTarget?.ok) resolvedTo = fallback.resolvedTo;
		else if (fallback.resolvedTarget && !fallback.resolvedTarget.ok) deliveryTargetResolutionError = fallback.resolvedTarget.error;
	}
	if (wantsDelivery && isDeliverableMessageChannel(resolvedChannel) && !resolvedTo) {
		if (!params.bestEffortDeliver) {
			params.respond(false, void 0, deliveryTargetResolutionError ? errorShapeFromError(ErrorCodes.INVALID_REQUEST, deliveryTargetResolutionError) : errorShape(ErrorCodes.INVALID_REQUEST, `delivery target is required for ${resolvedChannel}: pass --to/--reply-to or configure a default target`));
			return;
		}
		params.context.logGateway.info(deliveryTargetResolutionError ? `agent delivery target missing (bestEffortDeliver): ${String(deliveryTargetResolutionError)}` : "agent delivery target missing (bestEffortDeliver): no deliverable target");
	}
	if (wantsDelivery && resolvedChannel === "webchat") {
		if (!shouldDowngradeDeliveryToSessionOnly({
			wantsDelivery,
			bestEffortDeliver: params.bestEffortDeliver,
			resolvedChannel
		})) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel"));
			return;
		}
		params.context.logGateway.info(deliveryResolutionError ? `agent delivery unresolved (bestEffortDeliver); final delivery will report: ${deliveryResolutionError}` : "agent delivery unresolved (bestEffortDeliver); final delivery will report: no deliverable channel");
	}
	const normalizedTurnSource = normalizeMessageChannel(turnSourceChannel);
	const turnSourceMessageChannel = normalizedTurnSource && (isGatewayMessageChannel(normalizedTurnSource) || isInternalNonDeliveryChannel(normalizedTurnSource)) ? normalizedTurnSource : void 0;
	return {
		activeSessionAgentId,
		deliveryPlan: effectivePlan,
		resolvedChannel,
		deliveryTargetMode,
		resolvedAccountId,
		resolvedTo,
		originMessageChannel: turnSourceMessageChannel ?? (params.client?.connect && params.isWebchatConnect(params.client.connect) ? "webchat" : resolvedChannel),
		deliver: wantsDelivery,
		explicitThreadId
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-request-routing.ts
async function prepareAgentRequestRouting(params) {
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.request.attachments);
	const requestedBestEffortDeliver = typeof params.request.bestEffortDeliver === "boolean" ? params.request.bestEffortDeliver : void 0;
	const knownAgents = listAgentIds(params.cfg);
	const agentIdRaw = normalizeOptionalString(params.request.agentId) ?? "";
	let agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (agentId && !knownAgents.includes(agentId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: unknown agent id "${params.request.agentId}"`));
		return;
	}
	const requestedSessionKeyParam = normalizeOptionalString(params.request.sessionKey);
	const requestedSessionId = normalizeOptionalString(params.request.sessionId);
	const requestedToRaw = normalizeOptionalString(params.request.to);
	const sessionKeyFromTo = !requestedSessionKeyParam && !requestedSessionId && classifySessionKeyShape(requestedToRaw) === "agent" ? requestedToRaw : void 0;
	const requestedSessionKeyRaw = requestedSessionKeyParam ?? sessionKeyFromTo;
	if (requestedSessionKeyRaw && classifySessionKeyShape(requestedSessionKeyRaw) === "malformed_agent") {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid agent params: malformed session key "${requestedSessionKeyRaw}"`));
		return;
	}
	if (requestedSessionKeyRaw) {
		const requestedSessionAgent = resolveRequestedSessionAgentId(params.cfg, requestedSessionKeyRaw, agentId);
		if (!requestedSessionAgent.ok) {
			params.respond(false, void 0, requestedSessionAgent.error);
			return;
		}
		agentId = requestedSessionAgent.agentId;
	}
	let sessionIdTarget;
	if (requestedSessionId && !requestedSessionKeyRaw) try {
		sessionIdTarget = resolveExistingSessionKeyForRequest({
			cfg: params.cfg,
			sessionId: requestedSessionId,
			agentId,
			clone: false
		});
		agentId = sessionIdTarget.agentId ?? agentId;
	} catch (error) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(error)));
		return;
	}
	if (!requestedSessionKeyRaw && !requestedSessionId && !agentId) {
		const implicitMainOwner = resolveRequestedSessionAgentId(params.cfg, "main");
		if (!implicitMainOwner.ok) {
			params.respond(false, void 0, implicitMainOwner.error);
			return;
		}
		agentId = implicitMainOwner.agentId;
	}
	const explicitRecipientChannel = normalizeMessageChannel(params.request.channel);
	const explicitRecipient = !requestedSessionKeyRaw && !requestedSessionId && agentId && explicitRecipientChannel && isDeliverableMessageChannel(explicitRecipientChannel) && requestedToRaw ? {
		agentId,
		channel: explicitRecipientChannel,
		to: requestedToRaw
	} : void 0;
	let explicitRecipientSession;
	if (explicitRecipient) {
		params.reserveDedupe(void 0, explicitRecipient.agentId);
		try {
			explicitRecipientSession = await resolveAgentExplicitRecipientSession({
				cfg: params.cfg,
				agentId: explicitRecipient.agentId,
				channel: explicitRecipient.channel,
				to: explicitRecipient.to,
				accountId: normalizeOptionalString(params.request.accountId),
				threadId: params.request.threadId
			});
		} catch (error) {
			params.clearDedupe();
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(error)));
			return;
		}
	}
	if (explicitRecipientSession?.error) {
		params.clearDedupe();
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, explicitRecipientSession.error.message));
		return;
	}
	const requestedSessionKey = requestedSessionKeyRaw ?? sessionIdTarget?.sessionKey ?? explicitRecipientSession?.sessionKey ?? (!requestedSessionId ? resolveAgentExplicitRecipientSessionKey(params.cfg, agentIdRaw ? agentId : void 0) : void 0);
	const expectedSessionTargetError = validateExpectedExistingSessionTarget({
		constraint: params.expectedSession,
		requestedSessionId,
		requestedSessionKey
	});
	if (expectedSessionTargetError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, expectedSessionTargetError));
		return;
	}
	if (requestedSessionKey && respondUnavailableAgentSessionForKey({
		sessionKey: requestedSessionKey,
		requestedSessionId,
		isRawModelRun: params.isRawModelRun,
		agentId,
		respond: params.respond
	})) {
		params.clearDedupe();
		return;
	}
	if (dropReboundExecApprovalFollowup({
		...params,
		requestedSessionKeyRaw,
		agentId
	})) return;
	const preAcceptedReservedSessionKey = requestedSessionKey && resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: requestedSessionKey,
		storeAgentId: agentId
	}) === "global" ? "global" : requestedSessionKey;
	params.reserveDedupe(preAcceptedReservedSessionKey, agentId);
	const loaded = requestedSessionKey ? loadGatewaySessionEntry(requestedSessionKey, {
		...agentId ? { agentId } : {},
		clone: false
	}) : void 0;
	return {
		normalizedAttachments,
		requestedBestEffortDeliver,
		knownAgents,
		agentId,
		requestedSessionId,
		requestedToRaw,
		sessionKeyFromTo,
		requestedSessionKeyRaw,
		requestedSessionKey,
		explicitRecipientSession,
		preAcceptedReservedSessionKey,
		preAttachmentSession: loaded?.entry ? {
			canonicalKey: loaded.canonicalKey,
			sessionId: loaded.entry.sessionId
		} : void 0
	};
}
function resolveAgentExplicitRecipientSessionKey(cfg, agentId) {
	return resolveExplicitAgentSessionKey({
		cfg,
		agentId
	});
}
function dropReboundExecApprovalFollowup(params) {
	if (!params.execApprovalFollowupApprovalId || !params.requestedSessionKeyRaw) return false;
	const expectedSessionId = normalizeOptionalString(params.request.execApprovalFollowupExpectedSessionId);
	let currentSessionId;
	try {
		currentSessionId = normalizeOptionalString(loadGatewaySessionEntry(params.requestedSessionKeyRaw, {
			...params.agentId ? { agentId: params.agentId } : {},
			clone: false
		}).entry?.sessionId);
	} catch {
		currentSessionId = void 0;
	}
	if (!isExecApprovalFollowupSessionRebound({
		expectedSessionId,
		resolvedSessionId: currentSessionId
	})) return false;
	emitDiagnosticEvent({
		type: "exec.approval.followup_suppressed",
		approvalId: params.execApprovalFollowupApprovalId,
		reason: "session_rebound",
		phase: "gateway_preflight"
	});
	params.context.logGateway.info(`Dropping stale exec approval followup ${params.execApprovalFollowupApprovalId}: session ${params.requestedSessionKeyRaw} rebound (expected ${expectedSessionId}, current ${currentSessionId}) before the approval resolved`);
	const droppedPayload = {
		runId: params.runId,
		status: "ok",
		summary: "exec approval followup dropped: session was reset before the approval resolved"
	};
	setGatewayDedupeEntries({
		dedupe: params.context.dedupe,
		keys: params.agentDedupeKeys,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: droppedPayload
		}
	});
	params.respond(true, droppedPayload, void 0, { runId: params.runId });
	return true;
}
//#endregion
//#region src/gateway/server-methods/cron-creator-authority-admission.ts
function resolveDirectLocalOperatorAuthority(params) {
	const internal = params.client?.internal;
	const runId = params.runId.trim();
	return runId.length > 0 && clientHasAdminScope(params.client ?? null) && internal?.isLocalClient === true && Boolean(params.resolvedSessionKey?.trim()) && !params.spawnedBy?.trim() && params.inputProvenance === void 0 && !params.disallowed && internal.syntheticClient !== true && internal.senderAttribution === void 0 && internal.approvalRuntime !== true && internal.cronRunContinuation !== true && internal.agentRuntimeIdentity === void 0 && internal.pluginRuntimeOwnerId === void 0 && internal.agentRunTracking === void 0 && internal.pluginSubagentRequester === void 0 && internal.runtimePluginToolGrant === void 0 && internal.delegatedToolPolicyHandoffId === void 0 ? Object.freeze({
		runId,
		callerOrigin: { kind: "local" }
	}) : void 0;
}
/** Mints fresh cron authority only for an admitted direct local agent RPC turn. */
function resolveGatewayCronCreatorAuthorityAdmission(params) {
	const request = params.request;
	return resolveDirectLocalOperatorAuthority({
		runId: params.runId,
		resolvedSessionKey: params.resolvedSessionKey,
		spawnedBy: params.spawnedBy,
		client: params.client,
		inputProvenance: params.inputProvenance,
		disallowed: params.hasRestoredCronContinuation || params.isOneShotModelRun || params.isRestartRecoveryResumeRun || request.modelRun === true || request.acpTurnSource !== void 0 || request.internalRuntimeHandoffId !== void 0 || request.internalExecutionIdentityRetry === true || request.internalExecutionIdentityRecoveryAttempt !== void 0 || request.execApprovalFollowupExpectedSessionId !== void 0 || request.internalEvents !== void 0 || request.sessionEffects === "internal" || request.suppressPromptPersistence === true || request.swarmCollector === true || request.lane === "subagent"
	});
}
/** Mints the same authority for an admitted ordinary local chat.send turn. */
function resolveGatewayChatCronCreatorAuthorityAdmission(params) {
	return resolveDirectLocalOperatorAuthority({
		runId: params.runId,
		resolvedSessionKey: params.resolvedSessionKey,
		spawnedBy: params.spawnedBy,
		client: params.client,
		inputProvenance: params.inputProvenance,
		disallowed: !params.isDirectExternalUser || params.hasExplicitOrigin || params.hasRestoredCronContinuation || params.isIncognito || params.isReconnectResume || params.isSystemGenerated || params.turnKind !== "main"
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-run-user-turn.ts
async function prepareAgentRunUserTurn(params) {
	const execApprovalFollowupHandoffClaimId = randomUUID();
	let claimedExecApprovalFollowupHandoffId;
	let durableMediaIds = [];
	try {
		let execApprovalFollowupRuntimeHandoff = params.canUseInternalRuntimeHandoff && params.execApprovalFollowupApprovalId ? claimExecApprovalFollowupRuntimeHandoff({
			handoffId: params.request.internalRuntimeHandoffId,
			approvalId: params.execApprovalFollowupApprovalId,
			idempotencyKey: params.runId,
			sessionKey: params.resolvedSessionKey,
			claimId: execApprovalFollowupHandoffClaimId
		}) : void 0;
		if (!execApprovalFollowupRuntimeHandoff && params.canUseInternalRuntimeHandoff && params.execApprovalFollowupApprovalId && params.requestedSessionKeyRaw && params.requestedSessionKeyRaw !== params.resolvedSessionKey) execApprovalFollowupRuntimeHandoff = claimExecApprovalFollowupRuntimeHandoff({
			handoffId: params.request.internalRuntimeHandoffId,
			approvalId: params.execApprovalFollowupApprovalId,
			idempotencyKey: params.runId,
			sessionKey: params.requestedSessionKeyRaw,
			claimId: execApprovalFollowupHandoffClaimId
		});
		if (execApprovalFollowupRuntimeHandoff) claimedExecApprovalFollowupHandoffId = params.request.internalRuntimeHandoffId;
		let message = params.message;
		let effectiveTranscriptInputText = params.effectiveTranscriptInputText;
		let execApprovalContinuationPromptRange;
		let execApprovalContinuationTranscriptPromptRange;
		if (execApprovalFollowupRuntimeHandoff?.resultText !== void 0) {
			const continuation = buildExecApprovalContinuationPrompt(execApprovalFollowupRuntimeHandoff.resultText);
			message = continuation.message;
			effectiveTranscriptInputText = continuation.message;
			execApprovalContinuationPromptRange = continuation.resultRange;
			execApprovalContinuationTranscriptPromptRange = continuation.resultRange;
		} else if (message === "An approved async exec completed; load the authenticated completion handoff.") throw new Error("exec approval followup runtime handoff is unavailable");
		const senderIsOwner = params.restoredCronContinuation ? true : clientHasAdminScope(params.client);
		const suppressPromptPersistence = params.requestedPromptPersistenceSuppression || shouldSuppressAgentPromptPersistence({
			inputProvenance: params.inputProvenance,
			internalEvents: params.request.internalEvents
		});
		let recorder;
		if (params.resolvedSessionKey && !params.suppressVisibleSessionEffects && !suppressPromptPersistence) {
			const persistedMedia = await persistInboundImagesForTranscript({
				images: params.images,
				offloadedRefs: params.offloadedRefs,
				log: params.context.logGateway,
				logContext: "agent"
			});
			durableMediaIds = persistedMedia.entries.map((entry) => entry.id);
			const media = persistedMedia.entries.map((entry) => entry.fact);
			const slots = persistedMedia.entries.flatMap((entry, factIndex) => entry.imageKind ? [{
				kind: entry.imageKind,
				factIndex
			}] : []);
			recorder = createUserTurnTranscriptRecorder({
				input: {
					text: persistedMedia.omission === "inline-image-save-failed" ? [effectiveTranscriptInputText, INLINE_IMAGE_DURABLE_OMISSION_MARKER].filter(Boolean).join("\n") : effectiveTranscriptInputText,
					timestamp: Date.now(),
					idempotencyKey: buildRunUserTurnIdempotencyKey(params.runId),
					...gatewayClientSenderFields(params.client),
					senderIsOwner,
					...params.inputProvenance ? { provenance: params.inputProvenance } : {},
					...media.length > 0 ? { media } : {},
					...slots.length > 0 ? { mediaImageLayout: { slots } } : {}
				},
				target: () => {
					const loaded = loadGatewaySessionEntry(params.resolvedSessionKey, {
						agentId: params.activeSessionAgentId,
						clone: false
					});
					const latestEntry = loaded.entry;
					const loadedSessionId = latestEntry?.sessionId?.trim();
					if (!latestEntry || loadedSessionId !== params.admittedSessionId) return;
					return {
						sessionId: latestEntry.sessionId,
						expectedSessionId: params.admittedSessionId,
						sessionKey: params.resolvedSessionKey,
						sessionEntry: latestEntry,
						sessionStore: loaded.store,
						storePath: loaded.storePath,
						agentId: params.activeSessionAgentId,
						cwd: resolveSessionRuntimeCwd({ sessionEntry: latestEntry }),
						...params.resolvedThreadId != null ? { threadId: params.resolvedThreadId } : {},
						config: params.cfgForAgent ?? params.cfg
					};
				},
				errorContext: "gateway agent user turn transcript",
				beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
				onPersistenceError: (error) => {
					params.context.logGateway.warn(`gateway agent user transcript persistence failed: ${formatForLog(error)}`);
				}
			});
			if (!await recorder.persistApproved()) throw new Error("agent turn was not durably admitted");
		}
		return {
			...execApprovalFollowupRuntimeHandoff?.bashElevated ? { bashElevated: execApprovalFollowupRuntimeHandoff.bashElevated } : {},
			...claimedExecApprovalFollowupHandoffId ? { claimedExecApprovalFollowupHandoffId } : {},
			execApprovalFollowupHandoffClaimId,
			...execApprovalContinuationPromptRange ? { execApprovalContinuationPromptRange } : {},
			...execApprovalContinuationTranscriptPromptRange ? { execApprovalContinuationTranscriptPromptRange } : {},
			message,
			...recorder ? { recorder } : {},
			senderIsOwner,
			suppressPromptPersistence
		};
	} catch (error) {
		releaseExecApprovalFollowupRuntimeHandoff({
			handoffId: claimedExecApprovalFollowupHandoffId,
			claimId: execApprovalFollowupHandoffClaimId
		});
		await Promise.allSettled(durableMediaIds.map((id) => deleteMediaBuffer(id, "inbound")));
		throw error;
	}
}
function finalizePreparedAgentRunUserTurn(prepared) {
	const handoffId = prepared.claimedExecApprovalFollowupHandoffId;
	if (!handoffId) return;
	if (!finalizeExecApprovalFollowupRuntimeHandoff({
		handoffId,
		claimId: prepared.execApprovalFollowupHandoffClaimId
	})) throw new Error("exec approval followup runtime handoff expired before dispatch");
}
function releasePreparedAgentRunUserTurn(prepared) {
	releaseExecApprovalFollowupRuntimeHandoff({
		handoffId: prepared.claimedExecApprovalFollowupHandoffId,
		claimId: prepared.execApprovalFollowupHandoffClaimId
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-run-admission-phase.ts
async function prepareAgentRunDispatch(params) {
	const preRegistrationAbort = readGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		keys: params.agentDedupeKeys
	});
	if (isPreRegistrationAbortedAgentDedupeEntryForSession({
		entry: preRegistrationAbort,
		runId: params.runId,
		sessionKey: params.resolvedSessionKey,
		alternateSessionKeys: [params.preAcceptedReservedSessionKey, params.requestedSessionKey],
		agentId: params.activeSessionAgentId
	})) {
		params.markAgentRunAccepted(true);
		params.io.emitAcceptance([
			true,
			preRegistrationAbort?.payload,
			void 0
		], {
			cached: true,
			runId: params.runId
		});
		return;
	}
	if (params.abortForLifecycleRotation({
		sessionKey: params.resolvedSessionKey,
		agentId: params.activeSessionAgentId
	})) return;
	if (params.restoredCronContinuationIdentity && !params.restoredCronContinuation) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, "cron run continuation could not be restored")
		]);
		return;
	}
	const timeoutMs = resolveAgentTimeoutMs({
		cfg: params.cfgForAgent ?? params.cfg,
		overrideSeconds: typeof params.request.timeout === "number" ? params.request.timeout : void 0
	});
	const effectiveProviderOverride = params.restoredCronContinuation?.provider ?? params.providerOverride;
	const effectiveModelOverride = params.restoredCronContinuation?.model ?? params.modelOverride;
	const effectiveThinking = params.restoredCronContinuation ? params.restoredCronContinuation.thinking : params.request.thinking;
	const effectiveAllowModelOverride = params.allowModelOverride || params.restoredCronContinuation !== void 0;
	const runtimeConfig = params.cfgForAgent ?? params.cfg;
	const sessionModel = resolveSessionModelRef(runtimeConfig, params.sessionEntry, params.activeSessionAgentId);
	const activeModel = effectiveModelOverride ? resolvePersistedOverrideModelRef({
		defaultProvider: effectiveProviderOverride ?? sessionModel.provider,
		overrideProvider: effectiveProviderOverride,
		overrideModel: effectiveModelOverride
	}) ?? sessionModel : {
		provider: effectiveProviderOverride ?? sessionModel.provider,
		model: sessionModel.model
	};
	const resolvedRuntime = {
		harness: resolveEffectiveAgentRuntime({
			cfg: runtimeConfig,
			provider: activeModel.provider,
			modelId: activeModel.model,
			agentId: params.activeSessionAgentId,
			sessionKey: params.resolvedSessionKey,
			sessionEntry: params.sessionEntry
		}),
		provider: activeModel.provider,
		model: activeModel.model
	};
	const activeModelProvider = activeModel.provider;
	const lifecycleStorePath = params.resolvedSessionKey ? loadGatewaySessionEntry(params.resolvedSessionKey, {
		...params.activeSessionAgentId ? { agentId: params.activeSessionAgentId } : {},
		clone: false
	}).storePath : `agent:${params.activeSessionAgentId}`;
	let operationalRunInstance;
	try {
		await params.acquireGatewayWorkAdmission(lifecycleStorePath);
		params.assertGatewayWorkAdmissionAllowed();
		if (!params.hasGatewayAdmissionOutcome()) {
			operationalRunInstance = createOperationalRunInstanceRef(params.runId);
			const now = Date.now();
			params.setAdmittedRunAbort(registerChatAbortController({
				chatAbortControllers: params.context.chatAbortControllers,
				runId: params.runId,
				sessionId: params.getAdmittedSessionId(),
				sessionKey: params.resolvedSessionKey,
				agentId: params.admissionAgentId(),
				timeoutMs,
				now,
				expiresAtMs: resolveAgentRunExpiresAtMs({
					now,
					timeoutMs
				}),
				ownerConnId: params.ownerConnId,
				ownerDeviceId: params.ownerDeviceId,
				providerId: activeModelProvider,
				authProviderId: resolveProviderIdForAuth(activeModelProvider, { config: params.cfgForAgent ?? params.cfg }),
				isAbortable: () => isEmbeddedAgentRunAbortableForRunId(params.runId),
				onRemoved: () => clearEmbeddedAgentRunAbortabilityForRunId(params.runId),
				controlUiVisible: !params.suppressVisibleSessionEffects,
				kind: "agent",
				lifecycleGeneration: params.lifecycleGeneration,
				operationalRunInstance
			}));
		}
	} catch (err) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err))
		]);
		return;
	}
	if (params.respondToGatewayAdmissionOutcome()) return;
	const activeGatewayWorkAdmission = params.getGatewayWorkAdmission();
	if (!activeGatewayWorkAdmission) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, "agent run admission failed")
		]);
		return;
	}
	const activeRunAbort = params.getAdmittedRunAbort();
	if (!activeRunAbort || !operationalRunInstance) {
		activeRunAbort?.cleanup({ force: true });
		activeGatewayWorkAdmission.release();
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.UNAVAILABLE, "agent run admission failed")
		]);
		return;
	}
	const existingRunAbort = params.context.chatAbortControllers.get(params.runId);
	if (!activeRunAbort.registered && existingRunAbort) {
		activeGatewayWorkAdmission.release();
		params.markAgentRunAccepted(existingRunAbort.kind === "agent");
		params.io.emitAcceptance([
			true,
			{
				runId: params.runId,
				status: "in_flight"
			},
			void 0
		], {
			cached: true,
			runId: params.runId
		});
		return;
	}
	if (!activeRunAbort.registered) activeGatewayWorkAdmission.release();
	else {
		retainEmbeddedAgentRunAbortabilityForRunId(params.runId);
		if (params.pendingChatRun) params.context.addChatRun(params.runId, {
			...params.pendingChatRun,
			clientRunId: params.runId
		});
		if (params.resolvedSessionKey) claimAgentRunContext(params.runId, params.suppressVisibleSessionEffects ? {
			isControlUiVisible: false,
			lifecycleGeneration: params.lifecycleGeneration,
			mainSessionRestartRecovery: params.isRestartRecoveryResumeRun ? true : void 0
		} : {
			sessionKey: params.resolvedSessionKey,
			lifecycleGeneration: params.lifecycleGeneration,
			mainSessionRestartRecovery: params.isRestartRecoveryResumeRun ? true : void 0
		});
	}
	const resolvedThreadId = params.delivery.explicitThreadId ?? params.delivery.deliveryPlan.resolvedThreadId;
	const completionEvent = resolveExactSubagentCompletionEvent({
		inputProvenance: params.inputProvenance,
		internalEvents: params.request.internalEvents
	});
	const trustedInternalHandoff = params.providerOverride === void 0 && params.modelOverride === void 0 && params.restoredCronContinuation === void 0 ? consumeSubagentCompletionToolHandoff({
		handoffId: params.client?.internal?.delegatedToolPolicyHandoffId,
		sourceSessionKey: completionEvent?.childSessionKey,
		sourceSessionId: completionEvent?.childSessionId,
		targetSessionKey: params.resolvedSessionKey,
		targetSessionId: params.getAdmittedSessionId(),
		idempotencyKey: params.request.idempotencyKey,
		provider: activeModel.provider,
		model: activeModel.model
	}) : void 0;
	const taskTrackingMode = resolveGatewayAgentTaskTrackingMode({
		client: params.client,
		sessionKey: params.resolvedSessionKey,
		inputProvenance: params.inputProvenance,
		confirmedAcpManualSpawn: isConfirmedAcpManualSpawnTaskOwner({
			acpTurnSource: params.request.acpTurnSource,
			sessionKey: params.resolvedSessionKey,
			client: params.client,
			logGateway: params.context.logGateway
		}),
		modelRun: params.isOneShotModelRun,
		runId: params.runId
	});
	const dispatchTaskTrackingMode = taskTrackingMode === "cli" ? "cli" : "none";
	if (taskTrackingMode === "plugin_subagent" && params.resolvedSessionKey) try {
		await registerPluginSubagentRunFromGateway({
			cfg: params.cfg,
			runId: params.runId,
			childSessionKey: params.resolvedSessionKey,
			task: params.request.message.trim(),
			requester: params.client?.internal?.pluginSubagentRequester,
			pluginId: normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId),
			gatewayContextResolver: params.context.resolveGatewayContext
		});
	} catch (err) {
		params.context.logGateway.warn(`failed to register plugin subagent run ${params.runId}; rejecting untracked dispatch: ${formatForLog(err)}`);
		activeRunAbort.cleanup({ force: true });
		activeGatewayWorkAdmission.release();
		params.io.emitAcceptance([
			false,
			void 0,
			errorShapeFromError(ErrorCodes.UNAVAILABLE, new Error("plugin subagent registry persistence failed; run was not started", { cause: err }))
		]);
		return;
	}
	let restoreAdmittedRestartRecoveryInterrupted;
	if (params.isRestartRecoveryResumeRun) {
		const recoverySessionKey = params.resolvedSessionKey;
		if (!recoverySessionKey) {
			activeRunAbort.cleanup({ force: true });
			activeGatewayWorkAdmission.release();
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.UNAVAILABLE, "restart recovery session target is unavailable")
			]);
			return;
		}
		try {
			const recoveryAdmission = await commitMainSessionRecovery({
				command: {
					kind: "admit_recovery",
					lifecycleGeneration: params.lifecycleGeneration,
					now: Date.now(),
					runId: params.runId,
					sessionId: params.request.expectedExistingSessionId ?? params.getAdmittedSessionId()
				},
				requireWriteSuccess: true,
				target: {
					sessionKey: recoverySessionKey,
					storePath: lifecycleStorePath
				}
			});
			if (recoveryAdmission.transition.kind !== "admitted_recovery") throw new Error(`Session "${recoverySessionKey}" restart recovery reservation is stale; recovery was skipped.`);
			const admittedRecoverySessionKey = recoveryAdmission.sessionKey ?? recoverySessionKey;
			let restored = false;
			restoreAdmittedRestartRecoveryInterrupted = async () => {
				if (restored) return;
				const recovery = await commitMainSessionRecovery({
					command: {
						kind: "mark_admitted_recovery_interrupted",
						lifecycleGeneration: params.lifecycleGeneration,
						now: Date.now(),
						runId: params.runId,
						sessionId: params.request.expectedExistingSessionId ?? params.getAdmittedSessionId()
					},
					requireWriteSuccess: true,
					target: {
						sessionKey: admittedRecoverySessionKey,
						storePath: lifecycleStorePath
					}
				});
				restored = true;
				const expectedSessionId = params.request.expectedExistingSessionId ?? params.getAdmittedSessionId();
				return recovery.transition.kind === "applied" && recovery.entry?.sessionId === expectedSessionId && recovery.sessionKey ? {
					sessionId: recovery.entry.sessionId,
					sessionKey: recovery.sessionKey,
					storePath: lifecycleStorePath
				} : void 0;
			};
		} catch (err) {
			activeRunAbort.cleanup({ force: true });
			activeGatewayWorkAdmission.release();
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err))
			]);
			return;
		}
	}
	let userTurn;
	try {
		userTurn = await prepareAgentRunUserTurn({
			request: params.request,
			cfg: params.cfg,
			cfgForAgent: params.cfgForAgent,
			sessionEntry: params.sessionEntry,
			resolvedSessionKey: params.resolvedSessionKey,
			requestedSessionKeyRaw: params.requestedSessionKeyRaw,
			admittedSessionId: params.getAdmittedSessionId(),
			activeSessionAgentId: params.activeSessionAgentId,
			resolvedThreadId,
			suppressVisibleSessionEffects: params.suppressVisibleSessionEffects,
			requestedPromptPersistenceSuppression: params.requestedPromptPersistenceSuppression,
			restoredCronContinuation: params.restoredCronContinuation,
			canUseInternalRuntimeHandoff: params.canUseInternalRuntimeHandoff,
			execApprovalFollowupApprovalId: params.execApprovalFollowupApprovalId,
			message: params.message,
			effectiveTranscriptInputText: params.effectiveTranscriptInputText,
			images: params.images,
			offloadedRefs: params.offloadedRefs,
			inputProvenance: params.inputProvenance,
			runId: params.runId,
			client: params.client,
			context: params.context
		});
		if (userTurn.recorder) params.onUserTurnMediaPersisted();
	} catch (err) {
		activeRunAbort.cleanup({ force: true });
		activeGatewayWorkAdmission.release();
		params.io.emitAcceptance([
			false,
			void 0,
			errorShapeFromError(ErrorCodes.UNAVAILABLE, err)
		]);
		return;
	}
	try {
		params.assertGatewayWorkAdmissionAllowed();
	} catch (err) {
		releasePreparedAgentRunUserTurn(userTurn);
		activeRunAbort.cleanup({ force: true });
		activeGatewayWorkAdmission.release();
		params.io.emitAcceptance([
			false,
			void 0,
			errorShapeFromError(ErrorCodes.INVALID_REQUEST, err)
		]);
		return;
	}
	if (params.respondToGatewayAdmissionOutcome()) {
		releasePreparedAgentRunUserTurn(userTurn);
		activeRunAbort.cleanup({ force: true });
		return;
	}
	const accepted = {
		runId: params.runId,
		sessionKey: params.resolvedSessionKey,
		agentId: params.activeSessionAgentId,
		status: "accepted",
		acceptedAt: Date.now(),
		...taskTrackingMode === "plugin_subagent" ? { runtime: resolvedRuntime } : {}
	};
	params.markAgentRunAccepted(true);
	setGatewayDedupeEntries({
		dedupe: params.context.dedupe,
		keys: params.agentDedupeKeys,
		entry: {
			ts: Date.now(),
			ok: true,
			payload: {
				...accepted,
				controlUiVisible: !params.suppressVisibleSessionEffects,
				dedupeKeys: params.agentDedupeKeys,
				ownerConnId: params.ownerConnId,
				ownerDeviceId: params.ownerDeviceId
			}
		}
	});
	params.io.emitAcceptance([
		true,
		accepted,
		void 0
	], { runId: params.runId });
	const cronCreatorAuthority = resolveGatewayCronCreatorAuthorityAdmission({
		runId: params.runId,
		resolvedSessionKey: params.resolvedSessionKey,
		spawnedBy: params.sessionEntry?.spawnedBy,
		client: params.client,
		request: params.request,
		inputProvenance: params.inputProvenance,
		hasRestoredCronContinuation: params.restoredCronContinuation !== void 0,
		isOneShotModelRun: params.isOneShotModelRun,
		isRestartRecoveryResumeRun: params.isRestartRecoveryResumeRun
	});
	return {
		activeGatewayWorkAdmission,
		activeRunAbort,
		...cronCreatorAuthority ? { cronCreatorAuthority } : {},
		operationalRunInstance,
		effectiveProviderOverride,
		effectiveModelOverride,
		effectiveThinking,
		effectiveAllowModelOverride,
		trustedInternalHandoff,
		restoredCronContinuationLifecycleRevision: params.restoredCronContinuation?.lifecycleRevision,
		lifecycleStorePath,
		resolvedThreadId,
		dispatchTaskTrackingMode,
		unpersistedOffloadedRefs: userTurn.recorder ? [] : params.offloadedRefs,
		userTurn,
		restoreAdmittedRestartRecoveryInterrupted
	};
}
//#endregion
//#region src/gateway/server-methods/agent-run-model-selection.ts
function createAgentRunModelSelectionHandler(params) {
	return async ({ provider, model }) => {
		if (params.trustedInternalHandoff) {
			params.trustedInternalHandoff.provider = provider.trim().toLowerCase();
			params.trustedInternalHandoff.model = model.trim();
		}
		updateChatRunProvider(params.context.chatAbortControllers, {
			runId: params.runId,
			providerId: provider,
			authProviderId: resolveProviderIdForAuth(provider, { config: params.cfgForAgent ?? params.cfg })
		});
		if (!params.restoredCronContinuationLifecycleRevision || !params.resolvedSessionKey) return;
		if (!await applySessionEntryReplacements({
			activeSessionKey: params.resolvedSessionKey,
			requireWriteSuccess: true,
			sessionKeys: [params.resolvedSessionKey],
			skipMaintenance: false,
			storePath: params.lifecycleStorePath,
			update: (entries) => {
				const current = entries.find((entry) => entry.sessionKey === params.resolvedSessionKey)?.entry;
				const marker = current?.cronRunContinuation;
				if (!current || marker?.phase !== "continuing" || marker.ownerRunId !== params.runId || marker.lifecycleRevision !== params.restoredCronContinuationLifecycleRevision) return { result: false };
				const executionProvider = resolveCliRuntimeExecutionProvider({
					provider,
					cfg: params.cfgForAgent ?? params.cfg,
					agentId: params.activeSessionAgentId,
					modelId: model
				}) ?? provider;
				const cronRunContinuation = { ...marker };
				if (isCliProvider(executionProvider, params.cfgForAgent ?? params.cfg)) cronRunContinuation.cliExecutionProvider = executionProvider;
				else delete cronRunContinuation.cliExecutionProvider;
				return {
					replacements: [{
						sessionKey: params.resolvedSessionKey,
						entry: {
							...current,
							cronRunContinuation,
							modelProvider: provider,
							model,
							updatedAt: Date.now()
						}
					}],
					result: true
				};
			}
		})) throw new Error("cron run continuation changed before model execution");
	};
}
//#endregion
//#region src/gateway/session-subagent-reactivation.ts
async function loadSessionSubagentReactivationRuntime() {
	return import("./subagent-registry-runtime-pw3Q_Q-S.js");
}
/**
* Reactivates a completed subagent session by swapping in the new run id.
*
* `task` is the canonical user-supplied prompt text that just dispatched the
* follow-up. When provided, it is persisted on the new run record so a later
* orphan recovery / gateway restart rewraps the follow-up prompt rather than
* the stale original task. Without this, sessions.send and agent.run callers
* could reactivate a completed run with the new run id but lose the new
* prompt text from restart redispatch.
*/
async function reactivateCompletedSubagentSession(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const existing = getLatestSubagentRunByChildSessionKey(params.sessionKey);
	if (!existing || typeof existing.execution.endedAt !== "number") return false;
	const { replaceSubagentRunAfterSteer } = await loadSessionSubagentReactivationRuntime();
	if (params.gatewayContextResolver && !params.gatewayContextResolver()) return false;
	const task = params.task;
	const hasTask = typeof task === "string" && task.trim().length > 0;
	return replaceSubagentRunAfterSteer({
		previousRunId: existing.runId,
		nextRunId: runId,
		fallback: existing,
		runTimeoutSeconds: existing.runTimeoutSeconds ?? 0,
		...hasTask ? { task } : {},
		...params.gatewayContextResolver ? { gatewayContextResolver: params.gatewayContextResolver } : {}
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-restart-recovery-context.ts
/** Resolve only the private token durably owned by the admitted recovery cycle. */
function resolveAgentRestartRecoveryExecutionIdentityAdmission(params) {
	if (!params.isRestartRecoveryResumeRun || !params.collectionEnabled) return;
	if (params.retryOnly === void 0) throw new Error("restart recovery execution identity admission mode is unavailable");
	const stored = params.sessionEntry?.mainRestartRecovery?.executionIdentity;
	if (!stored) return createExecutionIdentityRecoveryAdmission({
		retryOnly: params.retryOnly,
		expectedOperationalRunId: params.runId
	});
	return createExecutionIdentityRecoveryAdmission({
		token: parseExecutionIdentityAdmissionToken(stored),
		retryOnly: params.retryOnly,
		expectedOperationalRunId: params.runId
	});
}
/** Rehydrates durable channel authority only for the exact host-owned recovery run. */
function resolveAgentRestartRecoveryChannelContext(params) {
	const expectedSessionId = normalizeOptionalString(params.expectedExistingSessionId);
	const authority = params.sessionEntry ? resolveRestartRecoveryChannelAuthority(params.sessionEntry) : void 0;
	if (!params.canUseInternalRuntimeHandoff || !expectedSessionId || expectedSessionId !== normalizeOptionalString(params.resolvedSessionId) || expectedSessionId !== normalizeOptionalString(params.sessionEntry?.sessionId) || !authority || normalizeOptionalString(params.sessionEntry?.restartRecoveryDeliveryRunId) !== params.runId) return;
	return {
		channel: authority.deliveryContext.channel,
		currentChannelId: authority.deliveryContext.to,
		currentThreadTs: authority.deliveryContext.threadId != null ? String(authority.deliveryContext.threadId) : void 0,
		sourceTurnId: authority.sourceTurnId,
		requesterAccountId: normalizeOptionalString(params.sessionEntry?.restartRecoveryRequesterAccountId),
		requesterSenderId: normalizeOptionalString(params.sessionEntry?.restartRecoveryRequesterSenderId),
		sameChannelThreadRequired: params.sessionEntry?.restartRecoverySameChannelThreadRequired === true
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-execution-lineage.ts
/** Consume authenticated spawn provenance once, at the child admission owner. */
function resolveExecutionIdentitySpawnFacts(identity) {
	const lineage = readAgentRuntimeExecutionLineage(identity?.sessionSpawnContext);
	if (!identity || !lineage || !consumeAgentRuntimeExecutionLineage(identity)) return;
	const parent = identity.executionIdentity;
	return {
		ingress: {
			kind: lineage.externalNativeActions === "unsupported" ? "acp" : "subagent",
			boundary: `sessions_spawn.${lineage.externalNativeActions === "unsupported" ? "acp" : "subagent"}`,
			state: "present"
		},
		invoker: {
			state: "present",
			kind: "agent",
			rawPrincipalRef: identity.agentId
		},
		applicableGrants: lineage.applicableGrantRefs.map((rawGrantRef) => ({
			rawGrantRef,
			state: "present"
		})),
		assurance: [{
			kind: "spawn-lineage",
			rawEvidenceRef: lineage.requesterRef,
			strength: "boundary-verified"
		}, ...lineage.runtimeAssuranceRefs.map((rawEvidenceRef) => ({
			kind: "runtime-binding",
			rawEvidenceRef,
			strength: "boundary-verified"
		}))],
		spawnAdmission: executionIdentitySpawnAdmission({
			operation: "serialize",
			value: {
				...parent?.contextId ? { parentContextId: parent.contextId } : {},
				...parent?.executionId ? { parentExecutionId: parent.executionId } : {},
				...parent?.runId ? { parentRunId: parent.runId } : {},
				parentAgentId: identity.agentId,
				relation: lineage.relation,
				rawRequesterRef: lineage.requesterRef,
				rawControllerRef: lineage.controllerRef,
				depth: lineage.depth,
				localPolicyRefs: lineage.localPolicyRefs,
				targetPolicyRefs: lineage.targetPolicyRefs
			},
			extra: [
				...!parent?.contextId ? ["lineage.parent-context"] : [],
				...!parent?.executionId ? ["lineage.parent-execution"] : [],
				...!parent?.runId ? ["lineage.parent-run"] : [],
				...lineage.externalNativeActions === "unsupported" ? ["acp.native-action-callback"] : []
			]
		})
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-run-execution-phase.ts
function startAgentRunExecution(params) {
	const { prepared } = params;
	let unpersistedOffloadedRefs = prepared.unpersistedOffloadedRefs;
	let releaseGatewayRootContinuation = retainGatewayRootWorkAdmissionContinuation() ?? void 0;
	const cleanupAdmittedRun = (options) => {
		const refsToDiscard = unpersistedOffloadedRefs;
		unpersistedOffloadedRefs = [];
		prepared.activeRunAbort.cleanup(options);
		prepared.activeGatewayWorkAdmission.release();
		releaseGatewayRootContinuation?.();
		releaseGatewayRootContinuation = void 0;
		discardPreparedInboundMedia(refsToDiscard, params.context.logGateway);
	};
	prepared.activeGatewayWorkAdmission.run(async () => {
		await yieldAfterAgentAcceptedAck();
		let dispatched = false;
		let pendingRecovery;
		const finishUndispatchedAbort = async () => {
			pendingRecovery = await prepared.restoreAdmittedRestartRecoveryInterrupted?.();
			const stopReason = resolveAbortedAgentStopReason(prepared.activeRunAbort.entry);
			setAbortedAgentDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.agentDedupeKeys,
				agentId: params.activeSessionAgentId,
				runId: params.runId,
				stopReason
			});
			params.io.emitFinal([
				true,
				{
					runId: params.runId,
					status: "timeout",
					summary: "aborted",
					stopReason,
					timeoutPhase: "queue",
					providerStarted: false
				},
				void 0
			], { runId: params.runId });
		};
		try {
			if (prepared.activeRunAbort.controller.signal.aborted) {
				await finishUndispatchedAbort();
				return;
			}
			let message = prepared.userTurn.message;
			let execApprovalContinuationPromptRange = prepared.userTurn.execApprovalContinuationPromptRange;
			const execApprovalContinuationTranscriptPromptRange = prepared.userTurn.execApprovalContinuationTranscriptPromptRange;
			if (!params.isOneShotModelRun && params.resolvedSessionKey) await reactivateCompletedSubagentSession({
				sessionKey: params.resolvedSessionKey,
				runId: params.runId,
				task: message,
				gatewayContextResolver: params.context.resolveGatewayContext
			});
			if (!params.suppressVisibleSessionEffects && params.requestedSessionKey && params.resolvedSessionKey && params.isNewSession) emitSessionsChanged(params.context, {
				sessionKey: params.resolvedSessionKey,
				agentId: params.activeSessionAgentId,
				reason: "create"
			});
			if (!params.suppressVisibleSessionEffects && params.resolvedSessionKey) emitSessionsChanged(params.context, {
				sessionKey: params.resolvedSessionKey,
				agentId: params.activeSessionAgentId,
				reason: "send"
			});
			if (!params.isRawModelRun) {
				const unannotatedMessage = message;
				message = annotateInterSessionPromptText(unannotatedMessage, params.inputProvenance);
				if (execApprovalContinuationPromptRange) {
					if (!message.endsWith(unannotatedMessage)) throw new Error("exec approval continuation prompt range could not be annotated");
					const offset = message.length - unannotatedMessage.length;
					execApprovalContinuationPromptRange = {
						start: offset + execApprovalContinuationPromptRange.start,
						end: offset + execApprovalContinuationPromptRange.end
					};
				}
			}
			const senderIsOwner = prepared.userTurn.senderIsOwner;
			const userTurnTranscriptRecorder = prepared.userTurn.recorder;
			const ingressAgentId = params.resolvedSessionKey ? params.activeSessionAgentId : params.agentId;
			const replyDispatchRuntime = await loadPublishedGatewayReplyDispatchRuntime({
				agentId: params.activeSessionAgentId,
				abortSignal: prepared.activeRunAbort.controller.signal
			});
			if (!replyDispatchRuntime?.pluginGeneration) throw new Error(`prepared reply dispatch runtime was not published for ${params.activeSessionAgentId}`);
			const runtimePluginToolGrant = params.client?.internal?.agentRunTracking === "plugin_subagent" && params.client.internal.pluginRuntimeOwnerId === params.client.internal.runtimePluginToolGrant?.pluginId ? params.client.internal.runtimePluginToolGrant : void 0;
			const pluginSubagentToolsAllow = params.client?.internal?.agentRunTracking === "plugin_subagent" && Array.isArray(params.client.internal.pluginSubagentToolsAllow) ? [...params.client.internal.pluginSubagentToolsAllow] : void 0;
			const executionIdentityAdmission = resolveAgentRestartRecoveryExecutionIdentityAdmission({
				collectionEnabled: isExecutionIdentityCollectionEnabled(params.cfg),
				isRestartRecoveryResumeRun: params.isRestartRecoveryResumeRun,
				retryOnly: params.request.internalExecutionIdentityRetry,
				runId: params.runId,
				sessionEntry: params.sessionEntry
			});
			const agentRuntimeIdentity = params.client?.internal?.agentRuntimeIdentity;
			const executionIdentitySpawnFacts = agentRuntimeIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(agentRuntimeIdentity) === true ? resolveExecutionIdentitySpawnFacts(agentRuntimeIdentity) : void 0;
			const restartRecoveryChannelContext = resolveAgentRestartRecoveryChannelContext({
				canUseInternalRuntimeHandoff: params.canUseInternalRuntimeHandoff,
				expectedExistingSessionId: params.request.expectedExistingSessionId,
				resolvedSessionId: params.resolvedSessionId,
				runId: params.runId,
				sessionEntry: params.sessionEntry
			});
			const runContext = {
				messageChannel: restartRecoveryChannelContext?.channel ?? params.delivery.originMessageChannel,
				accountId: restartRecoveryChannelContext?.requesterAccountId ?? params.delivery.resolvedAccountId,
				senderId: restartRecoveryChannelContext?.requesterSenderId,
				groupId: params.groupId,
				groupChannel: params.groupChannel,
				groupSpace: params.groupSpace,
				currentChannelId: restartRecoveryChannelContext?.currentChannelId,
				currentThreadTs: restartRecoveryChannelContext?.currentThreadTs ?? (prepared.resolvedThreadId != null ? String(prepared.resolvedThreadId) : void 0)
			};
			setChannelSourceTurnId(runContext, restartRecoveryChannelContext?.sourceTurnId);
			setChannelSourceTurnSameThreadRequired(runContext, restartRecoveryChannelContext?.sameChannelThreadRequired);
			const localUserIngress = getGatewayLocalUserIngress(params.client);
			if (params.isRestartRecoveryResumeRun) attachAgentCommandRecoveryAdmissionFacts(runContext);
			else if (localUserIngress) attachAgentCommandAdmissionFacts(runContext, localUserIngress.facts);
			params.assertContextCurrent?.();
			finalizePreparedAgentRunUserTurn(prepared.userTurn);
			dispatchAgentRunFromGateway(withAgentRunDispatchExecutionIdentity({
				commandRuntimeContext: {
					config: replyDispatchRuntime.config,
					pluginGeneration: replyDispatchRuntime.pluginGeneration
				},
				cronCreatorAuthority: prepared.cronCreatorAuthority,
				ingressOpts: {
					message,
					images: params.images,
					imageOrder: params.imageOrder,
					media: params.media,
					agentId: ingressAgentId,
					provider: prepared.effectiveProviderOverride,
					model: prepared.effectiveModelOverride,
					to: params.delivery.resolvedTo,
					sessionId: params.resolvedSessionId,
					sessionKey: params.resolvedSessionKey,
					thinking: prepared.effectiveThinking,
					deliver: params.delivery.deliver,
					deliveryTargetMode: params.delivery.deliveryTargetMode,
					channel: params.delivery.resolvedChannel,
					accountId: params.delivery.resolvedAccountId,
					threadId: prepared.resolvedThreadId,
					runContext,
					...prepared.userTurn.bashElevated ? { bashElevated: prepared.userTurn.bashElevated } : {},
					...execApprovalContinuationPromptRange ? { execApprovalContinuationPromptRange } : {},
					...execApprovalContinuationTranscriptPromptRange ? { execApprovalContinuationTranscriptPromptRange } : {},
					groupId: params.groupId,
					groupChannel: params.groupChannel,
					groupSpace: params.groupSpace,
					spawnedBy: params.spawnedBy,
					timeout: params.request.timeout?.toString(),
					bestEffortDeliver: params.bestEffortDeliver,
					messageChannel: params.delivery.originMessageChannel,
					runId: params.runId,
					lane: params.request.lane,
					modelRun: params.request.modelRun === true,
					promptMode: params.request.promptMode,
					extraSystemPrompt: params.request.extraSystemPrompt,
					gitCoauthorAttribution: prepareGitCoauthorAttribution({
						agentId: params.activeSessionAgentId,
						config: params.cfgForAgent ?? params.cfg,
						currentProfileId: params.client?.authenticatedUserProfile?.profileId,
						sessionKey: params.resolvedSessionKey,
						storePath: params.storePath
					}),
					bootstrapContextMode: params.request.bootstrapContextMode,
					bootstrapContextRunKind: params.effectiveBootstrapContextRunKind,
					toolsAllow: pluginSubagentToolsAllow ?? params.restoredCronContinuation?.toolsAllow,
					runtimePluginToolGrant,
					trustedInternalHandoff: prepared.trustedInternalHandoff,
					toolsAllowIsDefault: params.restoredCronContinuation?.toolsAllowIsDefault,
					scheduledToolPolicy: params.restoredCronContinuation ? resolveScheduledToolPolicyContext({
						toolsAllow: params.restoredCronContinuation.toolsAllow,
						scheduledToolPolicy: params.restoredCronContinuation.scheduledToolPolicy,
						callerOrigin: params.restoredCronContinuation.scheduledToolCallerOrigin
					}) : void 0,
					requireExplicitMessageTarget: params.restoredCronContinuation?.cliSessionBindingFacts?.requireExplicitMessageTarget,
					cliSessionBindingFacts: params.restoredCronContinuation?.cliSessionBindingFacts,
					acpTurnSource: params.request.acpTurnSource,
					internalEvents: params.request.internalEvents,
					inputProvenance: params.inputProvenance,
					senderIsOwner,
					sessionEffects: params.sessionEffects,
					skipInitialSessionTouch: params.skipAgentInitialSessionTouch,
					preserveUserFacingSessionModelState: params.preserveUserFacingSessionModelState && !params.restoredCronContinuation,
					sourceReplyDeliveryMode: params.restoredCronContinuation ? params.restoredCronContinuation.cliSessionBindingFacts?.sourceReplyDeliveryMode : params.request.sourceReplyDeliveryMode,
					disableMessageTool: params.request.disableMessageTool,
					swarmCollector: params.request.swarmCollector,
					swarmOutputSchema: params.request.swarmOutputSchema,
					forceRestartSafeTools: params.request.forceRestartSafeTools,
					forceCodeModeTools: params.request.forceCodeModeTools,
					...executionIdentityAdmission ? { executionIdentityAdmission } : {},
					operationalRunInstance: prepared.operationalRunInstance,
					onAdmittedRunContext: (admittedRunContext) => {
						bindGatewayContextResolver(admittedRunContext, params.context.resolveGatewayContext);
						const authority = getAdmittedRunDelegatedAuthority(admittedRunContext);
						if (!authority) throw new Error("agent run delegated authority was not admitted");
						if (prepared.activeRunAbort.registered) prepared.activeRunAbort.bindAgentRunDelegatedAuthority(authority);
					},
					internalDeliveryMediaUrls: params.client?.internal?.internalDeliveryMediaUrls,
					internalDeliverySuppressText: params.client?.internal?.internalDeliverySuppressText,
					suppressPromptPersistence: prepared.userTurn.suppressPromptPersistence,
					userTurnTranscriptRecorder,
					cleanupBundleMcpOnRunEnd: params.request.cleanupBundleMcpOnRunEnd,
					abortSignal: prepared.activeRunAbort.controller.signal,
					lifecycleGeneration: params.lifecycleGeneration,
					onExecutionStarted: () => {
						if (!prepared.activeRunAbort.markExecutionStarted()) return;
						params.io.emitExecutionStarted?.();
						if (params.resolvedSessionKey) emitSessionsChanged(params.context, {
							sessionKey: params.resolvedSessionKey,
							agentId: params.agentId,
							reason: "agent.run.started"
						});
					},
					onActiveModelSelected: createAgentRunModelSelectionHandler({
						context: params.context,
						runId: params.runId,
						cfg: params.cfg,
						cfgForAgent: params.cfgForAgent,
						restoredCronContinuationLifecycleRevision: prepared.restoredCronContinuationLifecycleRevision,
						resolvedSessionKey: params.resolvedSessionKey,
						lifecycleStorePath: prepared.lifecycleStorePath,
						activeSessionAgentId: params.activeSessionAgentId,
						trustedInternalHandoff: prepared.trustedInternalHandoff
					}),
					onSessionIdChanged: (sessionId) => {
						if (prepared.activeRunAbort.entry) prepared.activeRunAbort.entry.sessionId = sessionId;
					},
					workspaceDir: resolveIngressWorkspaceOverrideForSessionRun({
						spawnedBy: params.spawnedBy,
						workspaceDir: params.sessionEntry?.spawnedWorkspaceDir,
						cwd: params.sessionEntry?.spawnedCwd
					}),
					cwd: resolveSessionRuntimeCwd({
						requestedCwd: params.request.cwd,
						sessionEntry: params.sessionEntry
					}),
					allowGatewaySubagentBinding: true,
					...params.mainRestartRecoveryOwnerLease ? { mainRestartRecoveryOwnerLease: params.mainRestartRecoveryOwnerLease } : {},
					...params.isRestartRecoveryResumeRun ? { mainRestartRecoveryAdmitted: true } : {},
					...params.request.internalExecutionIdentityRecoveryAttempt !== void 0 ? { mainRestartRecoveryAttempt: params.request.internalExecutionIdentityRecoveryAttempt } : {},
					allowModelOverride: prepared.effectiveAllowModelOverride
				},
				runId: params.runId,
				dedupeKeys: params.agentDedupeKeys,
				abortController: prepared.activeRunAbort.controller,
				cleanupAbortController: cleanupAdmittedRun,
				onSettled: params.restoredCronContinuation ? async ({ terminalOutcome, onRecovered }) => await params.releaseCronContinuationClaimWithRecovery({ terminalOutcome }, onRecovered) : void 0,
				io: params.io,
				context: params.context,
				taskTrackingMode: prepared.dispatchTaskTrackingMode,
				restoreAdmittedRecovery: prepared.restoreAdmittedRestartRecoveryInterrupted,
				canonicalSkillWorkspaceDir: params.sessionEntry?.worktree?.canonicalWorkspaceDir
			}, executionIdentitySpawnFacts));
			dispatched = true;
		} catch (err) {
			if (prepared.activeRunAbort.controller.signal.aborted && isAbortError(err)) {
				await finishUndispatchedAbort();
				return;
			}
			const renderedErr = formatErrorMessageWithCode(err);
			const error = errorShape(ErrorCodes.UNAVAILABLE, renderedErr);
			const payload = {
				runId: params.runId,
				status: "error",
				summary: renderedErr
			};
			setGatewayDedupeEntries({
				dedupe: params.context.dedupe,
				keys: params.agentDedupeKeys,
				entry: {
					ts: Date.now(),
					ok: false,
					payload,
					error
				}
			});
			params.io.emitFinal([
				false,
				payload,
				error
			], {
				runId: params.runId,
				error: renderedErr
			});
		} finally {
			if (!dispatched) {
				releasePreparedAgentRunUserTurn(prepared.userTurn);
				try {
					const restoreAdmittedRecovery = prepared.restoreAdmittedRestartRecoveryInterrupted;
					if (restoreAdmittedRecovery) pendingRecovery ??= await repairMainSessionRecoveryMutation({
						mutation: restoreAdmittedRecovery,
						onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
						onError: (err) => params.context.logGateway.warn(`failed to restore undispatched restart recovery: ${formatForLog(err)}`)
					});
				} finally {
					try {
						await params.releaseCronContinuationClaimWithRecovery();
					} finally {
						try {
							pendingRecovery ??= await releaseMainSessionRecoveryOwner(params.mainRestartRecoveryOwnerLease);
						} catch (err) {
							params.context.logGateway.warn(`failed to release undispatched main restart recovery owner: ${formatForLog(err)}`);
						} finally {
							try {
								cleanupAdmittedRun({ force: true });
							} finally {
								scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
							}
						}
					}
				}
			}
		}
	});
}
//#endregion
//#region src/gateway/agent-turn/agent-session-persist.ts
async function persistAgentSessionPhase(params) {
	let patchBuild = params.initialPatchBuild;
	let sessionEntry = params.initialSessionEntry;
	let resolvedSessionId = params.initialResolvedSessionId;
	let sessionPersistedBeforeGatewayAdmission = params.initialSessionPersistedBeforeGatewayAdmission;
	let supersededSessionId = params.initialSupersededSessionId;
	let restoredCronContinuation;
	let mainRestartRecoveryOwnerLease;
	let skipAgentInitialSessionTouch = false;
	let createdNewEntry = false;
	const recoveredSessionStartedAt = !patchBuild.isNewSession && params.entry !== void 0 && params.entry.sessionStartedAt === void 0 ? resolveSessionLifecycleTimestamps({
		entry: params.entry,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		sessionKey: params.canonicalSessionKey
	}).sessionStartedAt : void 0;
	if (params.storePath && !params.suppressVisibleSessionEffects) {
		if (params.abortForLifecycleRotation({
			sessionKey: params.canonicalSessionKey,
			agentId: params.agentId
		})) return;
		let deniedBySendPolicy = false;
		let deniedSessionEntry;
		let persisted;
		let archivedDuringStoreUpdateError;
		let deletedDuringStoreUpdateError;
		let restoredCronContinuationError;
		let restartRecoveryReservationConflict;
		let creationAuthorizationError;
		try {
			persisted = await patchSessionEntryTarget({
				agentId: params.sessionAgentId,
				storePath: params.storePath,
				target: {
					canonicalKey: params.canonicalSessionKey,
					storeKeys: params.storeKeys ?? [params.canonicalSessionKey]
				}
			}, (_currentEntry, patchContext) => {
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				const freshEntry = patchContext.existingEntry;
				if (!freshEntry) {
					creationAuthorizationError = authorizeGatewaySessionCreation({
						cfg: params.cfg,
						agentId: params.sessionAgentId,
						...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
					});
					if (creationAuthorizationError) throw new Error(creationAuthorizationError.message);
				}
				assertExpectedExistingSession({
					constraint: params.expectedSession,
					entry: freshEntry,
					message: `Session "${params.canonicalSessionKey}" changed before expected work could start.`
				});
				if (params.entry && !freshEntry) {
					deletedDuringStoreUpdateError = `Session "${params.canonicalSessionKey}" was deleted while starting work. Retry.`;
					throw new Error(deletedDuringStoreUpdateError);
				}
				const archivedError = resolveSessionWorkStartError(params.canonicalSessionKey, freshEntry);
				if (archivedError) {
					archivedDuringStoreUpdateError = archivedError;
					throw new Error(archivedError);
				}
				const internalFreshEntry = freshEntry;
				if (!params.isRestartRecoveryResumeRun && internalFreshEntry && (internalFreshEntry.mainRestartRecovery?.tombstone || internalFreshEntry.status === "running" && internalFreshEntry.abortedLastRun === true && (internalFreshEntry.mainRestartRecovery?.chargedAttempts ?? 0) >= 3)) {
					restartRecoveryReservationConflict = `Session "${params.canonicalSessionKey}" is quarantined after restart recovery exhaustion; use /new or /reset before starting new work.`;
					throw new Error(restartRecoveryReservationConflict);
				}
				let entryForPatch = freshEntry;
				if (params.restoredCronContinuationIdentity) {
					const marker = freshEntry?.cronRunContinuation;
					const provider = normalizeOptionalString(freshEntry?.modelProvider);
					const model = normalizeOptionalString(freshEntry?.model);
					if (!(marker?.phase === "ready" && marker.basePersisted === true && marker.lifecycleRevision === params.restoredCronContinuationIdentity.lifecycleRevision && freshEntry?.sessionId === params.restoredCronContinuationIdentity.sessionId) || !freshEntry || !provider || !model) {
						restoredCronContinuationError = "cron run continuation changed before admission";
						throw new Error(restoredCronContinuationError);
					}
					if (!cronContinuationHasReusableRuntime({
						cfg: params.cfg,
						entry: freshEntry,
						agentId: params.sessionAgentId,
						provider,
						model
					})) {
						restoredCronContinuationError = "cron run continuation has no reusable native CLI session";
						throw new Error(restoredCronContinuationError);
					}
					restoredCronContinuation = {
						...params.restoredCronContinuationIdentity,
						provider,
						model,
						...freshEntry.thinkingLevel ? { thinking: freshEntry.thinkingLevel } : {},
						...marker.toolsAllow !== void 0 ? { toolsAllow: [...marker.toolsAllow] } : {},
						...marker.toolsAllowIsDefault === true ? { toolsAllowIsDefault: true } : {},
						...normalizeCronScheduledToolPolicy(marker.scheduledToolPolicy) ? { scheduledToolPolicy: normalizeCronScheduledToolPolicy(marker.scheduledToolPolicy) } : {},
						...normalizeCronScheduledToolPolicy(marker.scheduledToolPolicy)?.mode === "account" ? { scheduledToolCallerOrigin: normalizeCronScheduledToolCallerOrigin(marker.scheduledToolCallerOrigin) } : {},
						...marker.cliSessionBindingFacts ? { cliSessionBindingFacts: { ...marker.cliSessionBindingFacts } } : {}
					};
					entryForPatch = {
						...freshEntry,
						cronRunContinuation: {
							...marker,
							phase: "continuing",
							ownerRunId: params.runId,
							ownerLifecycleGeneration: params.lifecycleGeneration
						}
					};
					params.setCronContinuationClaim({
						storePath: params.storePath,
						sessionKey: params.canonicalSessionKey,
						sessionAgentId: params.sessionAgentId,
						lifecycleRevision: marker.lifecycleRevision,
						initialEntry: structuredClone(entryForPatch),
						mediaTaskIdsBefore: getGeneratedMediaTaskIdsForSessionKey(params.canonicalSessionKey)
					});
				}
				patchBuild = params.buildSessionPatch(entryForPatch);
				const lifecyclePatch = recoveredSessionStartedAt !== void 0 && entryForPatch?.sessionStartedAt === void 0 && entryForPatch?.sessionId === params.entry?.sessionId ? {
					...patchBuild.patch,
					sessionStartedAt: recoveredSessionStartedAt
				} : patchBuild.patch;
				const previousSessionId = normalizeOptionalString(freshEntry?.sessionId);
				const nextSessionId = normalizeOptionalString(lifecyclePatch.sessionId);
				const rotationLineage = previousSessionId && nextSessionId && previousSessionId !== nextSessionId ? { previousSessionId } : {};
				const operatorRoleActor = params.operatorRoleActor;
				const delegatedCreation = !freshEntry && !params.creation.actor && params.cfg.gateway?.roles && operatorRoleActor?.kind === "operator" ? {
					...params.creation,
					actor: {
						type: "human",
						id: operatorRoleActor.profileId
					}
				} : params.creation;
				const sandbox = freshEntry ? void 0 : resolveCreatorSandbox(params.cfg, delegatedCreation);
				const effectivePatch = freshEntry ? {
					...lifecyclePatch,
					...rotationLineage
				} : {
					...lifecyclePatch,
					...buildSessionCreationStamp(sandbox ? {
						...delegatedCreation,
						sandbox
					} : params.creation)
				};
				createdNewEntry = freshEntry === void 0;
				const merged = withSqliteSessionFileMarker({
					agentId: params.sessionAgentId,
					entry: mergeSessionEntry(entryForPatch, effectivePatch),
					sessionKey: params.canonicalSessionKey,
					storePath: params.storePath
				});
				const recoveryTransition = params.isRestartRecoveryResumeRun ? transitionMainSessionRecovery(merged, {
					kind: "validate_recovery",
					lifecycleGeneration: params.lifecycleGeneration,
					runId: params.runId,
					sessionId: params.request.expectedExistingSessionId ?? merged.sessionId
				}) : transitionMainSessionRecovery(merged, {
					kind: "claim_foreground",
					cycleId: randomUUID(),
					lifecycleGeneration: params.lifecycleGeneration,
					sessionId: merged.sessionId,
					sessionKey: params.canonicalSessionKey,
					claimId: mainRestartRecoveryOwnerLease?.claimId ?? randomUUID(),
					runId: params.runId
				});
				if (params.isRestartRecoveryResumeRun && recoveryTransition.kind !== "recovery_validated") {
					restartRecoveryReservationConflict = `Session "${params.canonicalSessionKey}" restart recovery reservation is stale; recovery was skipped.`;
					throw new Error(restartRecoveryReservationConflict);
				}
				if (recoveryTransition.kind === "foreground_claimed") {
					mainRestartRecoveryOwnerLease = {
						...recoveryTransition.claim,
						storePath: params.storePath
					};
					params.setMainRestartRecoveryOwnerLease(mainRestartRecoveryOwnerLease);
				}
				if (params.request.deliver === true && resolveSendPolicy({
					cfg: params.cfg,
					entry: merged,
					sessionKey: params.canonicalSessionKey,
					channel: sessionDeliveryChannel(merged),
					chatType: merged.chatType
				}) === "deny") {
					deniedBySendPolicy = true;
					deniedSessionEntry = merged;
					return null;
				}
				return merged;
			}, {
				fallbackEntry: params.entry ?? mergeSessionEntry(void 0, patchBuild.patch),
				replaceEntry: true,
				takeCacheOwnership: true,
				maintenanceConfig: params.maintenanceConfig
			}) ?? void 0;
		} catch (err) {
			if (creationAuthorizationError) {
				params.respond(false, void 0, creationAuthorizationError);
				return;
			}
			if (params.abortForLifecycleRotation({
				sessionKey: params.canonicalSessionKey,
				agentId: params.agentId
			})) return;
			if (archivedDuringStoreUpdateError) {
				params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedDuringStoreUpdateError));
				return;
			}
			if (deletedDuringStoreUpdateError) {
				params.respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, err));
				return;
			}
			if (err instanceof ExpectedExistingSessionChangedError) {
				params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, err.message));
				return;
			}
			if (restoredCronContinuationError) {
				params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, restoredCronContinuationError));
				return;
			}
			if (restartRecoveryReservationConflict) {
				params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, restartRecoveryReservationConflict));
				return;
			}
			throw err;
		}
		if (params.abortForLifecycleRotation({
			sessionKey: params.canonicalSessionKey,
			agentId: params.agentId
		})) return;
		if (deniedBySendPolicy && deniedSessionEntry) {
			sessionEntry = deniedSessionEntry;
			resolvedSessionId = sessionEntry.sessionId;
		} else if (persisted) {
			sessionEntry = persisted;
			resolvedSessionId = sessionEntry.sessionId;
			sessionPersistedBeforeGatewayAdmission = true;
		}
		if (patchBuild.isNewSession && params.entry?.sessionId && resolvedSessionId !== params.entry.sessionId) supersededSessionId = params.entry.sessionId;
		const admittedSessionId = resolvedSessionId ?? params.runId;
		params.updateAdmissionState({
			resolvedSessionId,
			admittedSessionId,
			supersededSessionId,
			sessionPersistedBeforeGatewayAdmission
		});
		try {
			params.assertGatewayWorkAdmissionAllowed();
		} catch (err) {
			params.respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, err));
			return;
		}
		if (params.respondToGatewayAdmissionOutcome() || params.abortForLifecycleRotation({
			sessionKey: params.canonicalSessionKey,
			agentId: params.agentId
		})) return;
		skipAgentInitialSessionTouch = params.touchInteraction;
		if (deniedBySendPolicy) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
			return;
		}
	}
	const isNewSession = patchBuild.isNewSession;
	const rotatedSessionId = patchBuild.rotatedSessionId;
	const usableRequestedSessionId = patchBuild.usableRequestedSessionId;
	const freshness = patchBuild.freshness;
	if (createdNewEntry && sessionEntry) recordSessionCreated({
		sessionKey: params.canonicalSessionKey,
		agentId: params.sessionAgentId,
		entry: sessionEntry
	});
	if (params.creation.actor?.type === "human" && params.creation.actor.id) recordSessionParticipantBestEffort({
		actor: {
			type: "human",
			id: params.creation.actor.id
		},
		agentId: params.sessionAgentId,
		sessionKey: params.canonicalSessionKey,
		source: "profile",
		storePath: params.storePath
	});
	if (isNewSession && params.entry?.sessionId && resolvedSessionId !== params.entry.sessionId) supersededSessionId = params.entry.sessionId;
	if (!params.suppressVisibleSessionEffects && isNewSession && resolvedSessionId && params.storePath && !patchBuild.freshSessionRotatedSinceLoad) {
		const previousSessionId = rotatedSessionId ? params.entry?.sessionId : void 0;
		emitAgentSendSessionLifecycleTransition({
			cfg: params.cfg,
			sessionKey: params.canonicalSessionKey,
			sessionId: resolvedSessionId,
			storePath: params.storePath,
			agentId: params.sessionAgentId,
			workspaceDir: params.entry?.spawnedWorkspaceDir,
			previousSessionId,
			previousEndReason: previousSessionId ? freshness?.staleReason ?? (usableRequestedSessionId && params.entry?.sessionId !== usableRequestedSessionId ? "new" : "unknown") : void 0
		});
	}
	if (params.request.deliver === true && resolveSendPolicy({
		cfg: params.cfg,
		entry: sessionEntry,
		sessionKey: params.canonicalSessionKey,
		channel: sessionDeliveryChannel(sessionEntry),
		chatType: sessionEntry?.chatType
	}) === "deny") {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
		return;
	}
	const isMainSession = !params.suppressVisibleSessionEffects && (params.canonicalSessionKey === params.mainSessionKey || params.canonicalSessionKey === "global");
	return {
		sessionEntry,
		resolvedSessionId,
		sessionPersistedBeforeGatewayAdmission,
		supersededSessionId,
		admittedSessionId: params.getAdmittedSessionId(),
		skipAgentInitialSessionTouch,
		patchBuild,
		isNewSession,
		rotatedSessionId,
		usableRequestedSessionId,
		freshness,
		spawnedBy: patchBuild.spawnedBy,
		groupId: patchBuild.groupId,
		groupChannel: patchBuild.groupChannel,
		groupSpace: patchBuild.groupSpace,
		pendingChatRun: isMainSession ? {
			sessionKey: params.canonicalSessionKey,
			agentId: params.sessionAgentId
		} : void 0,
		bestEffortDeliver: isMainSession && params.requestedBestEffortDeliver === void 0 ? true : params.bestEffortDeliver,
		restoredCronContinuation
	};
}
//#endregion
//#region src/gateway/agent-turn/agent-turn-service.ts
function createAcceptanceRespond(io) {
	return (ok, payload, error, meta) => io.emitAcceptance([
		ok,
		payload,
		error
	], meta);
}
function replayAgentTurnIfCached(params) {
	const { agentDedupeKeys, runId } = params.preflight;
	const cached = readGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		keys: agentDedupeKeys
	});
	if (!cached) return false;
	if (cached.ok && isAcceptedAgentDedupePayload(cached.payload)) {
		const cachedRunId = normalizeOptionalString(cached.payload.runId) ?? runId;
		const cachedSessionKey = normalizeOptionalString(cached.payload.sessionKey);
		const cachedAgentId = normalizeOptionalString(cached.payload.agentId);
		const cachedRuntime = asOptionalRecord(cached.payload.runtime);
		const admissionPending = typeof cached.payload.reservationId === "string";
		params.io.emitAcceptance([
			true,
			{
				runId: cachedRunId,
				status: "in_flight",
				...cachedSessionKey ? { sessionKey: cachedSessionKey } : {},
				...cachedAgentId ? { agentId: cachedAgentId } : {},
				...cachedRuntime ? { runtime: cachedRuntime } : {},
				...admissionPending ? { admissionPending: true } : {}
			},
			void 0
		], {
			cached: true,
			runId: cachedRunId
		});
	} else params.io.emitAcceptance([
		cached.ok,
		cached.payload,
		cached.error
	], { cached: true });
	return true;
}
function createAgentTurnService({ context, isWebchatConnect }, assertContextCurrent) {
	const startTurn = async ({ preflight, principal, io, onRunObserved }) => {
		if (replayAgentTurnIfCached({
			preflight,
			context,
			io
		})) return;
		const respond = createAcceptanceRespond(io);
		const { request, cfg, runId, allowModelOverride, canUseInternalRuntimeHandoff, canUseCronRunContinuation, expectedSession, expectedExistingSessionId, providerOverride, modelOverride, execApprovalFollowupApprovalId, normalizedSpawned, inputProvenance, isRestartRecoveryResumeRun, preserveUserFacingSessionModelState, sessionEffects, suppressVisibleSessionEffects, requestedPromptPersistenceSuppression, isOneShotModelRun, isRawModelRun, agentDedupeKeys } = preflight;
		const lifecycleGeneration = getAgentEventLifecycleGeneration();
		let resolvedGroupId = normalizedSpawned.groupId;
		let resolvedGroupChannel = normalizedSpawned.groupChannel;
		let resolvedGroupSpace = normalizedSpawned.groupSpace;
		let spawnedByValue;
		const ownerConnId = typeof principal?.connId === "string" ? principal.connId : void 0;
		const ownerDeviceId = typeof principal?.connect?.device?.id === "string" ? principal.connect.device.id : void 0;
		const dedupeLifecycle = createAgentDedupeLifecycle({
			cfg,
			request,
			runId,
			lifecycleGeneration,
			agentDedupeKeys,
			suppressVisibleSessionEffects,
			ownerConnId,
			ownerDeviceId,
			context,
			io
		});
		const reservePreAcceptedAgentDedupe = dedupeLifecycle.reserve;
		const clearUnacceptedAgentDedupe = dedupeLifecycle.clearUnaccepted;
		const abortForLifecycleRotation = dedupeLifecycle.abortForLifecycleRotation;
		const routing = await prepareAgentRequestRouting({
			request,
			cfg,
			expectedSession,
			isRawModelRun,
			execApprovalFollowupApprovalId,
			runId,
			agentDedupeKeys,
			context,
			respond,
			reserveDedupe: reservePreAcceptedAgentDedupe,
			clearDedupe: clearUnacceptedAgentDedupe
		});
		if (!routing) return;
		const { normalizedAttachments, requestedBestEffortDeliver, knownAgents, requestedSessionId, requestedToRaw, sessionKeyFromTo, requestedSessionKeyRaw, explicitRecipientSession, preAcceptedReservedSessionKey, preAttachmentSession } = routing;
		let agentId = routing.agentId;
		let requestedSessionKey = routing.requestedSessionKey;
		let gatewayAdmissionTransferred = false;
		let preparedOffloadedRefs = [];
		let mainRestartRecoveryOwnerLease;
		let releaseGatewayAdmission = () => {};
		const cronContinuation = createCronContinuationController({
			runId,
			lifecycleGeneration,
			context
		});
		const releaseCronContinuationClaimWithRecovery = cronContinuation.releaseWithRecovery;
		try {
			const content = await prepareAgentContentPhase({
				request,
				cfg,
				context,
				respond,
				isRawModelRun,
				inputProvenance,
				normalizedAttachments,
				requestedSessionKeyRaw,
				requestedSessionKey,
				requestedSessionId,
				requestedToRaw,
				sessionKeyFromTo,
				agentId,
				providerOverride,
				modelOverride,
				explicitRecipientSession,
				knownAgents
			});
			if (!content) return;
			preparedOffloadedRefs = content.offloadedRefs;
			agentId = content.agentId;
			requestedSessionKey = content.requestedSessionKey;
			let effectiveTranscriptInputText = content.effectiveTranscriptInputText;
			let message = content.message;
			const { images, imageOrder, media, offloadedRefs, replyTo, recipientChannel, recipientAccountId, recipientThreadId, to } = content;
			let resolvedSessionId = requestedSessionId;
			let sessionEntry;
			let effectiveBootstrapContextRunKind = request.bootstrapContextRunKind;
			let restoredCronContinuation;
			let restoredCronContinuationIdentity;
			let sessionPersistedBeforeGatewayAdmission = false;
			let bestEffortDeliver = requestedBestEffortDeliver ?? false;
			let cfgForAgent;
			let resolvedSessionKey = requestedSessionKey;
			let resolvedSessionAgentId;
			let isNewSession = false;
			let supersededSessionId;
			let skipAgentInitialSessionTouch = false;
			let pendingChatRun;
			let resolvedStorePath;
			let admittedSessionId = resolvedSessionId ?? runId;
			const admissionController = createAgentAdmissionController({
				cfg,
				runId,
				lifecycleGeneration,
				agentDedupeKeys,
				preAcceptedReservedSessionKey,
				expectedSession,
				context,
				io,
				dedupeLifecycle,
				getRequestedSessionKey: () => requestedSessionKey,
				getResolvedSessionKey: () => resolvedSessionKey,
				getResolvedSessionId: () => resolvedSessionId,
				getResolvedSessionAgentId: () => resolvedSessionAgentId,
				getAgentId: () => agentId,
				getCfgForAgent: () => cfgForAgent,
				getSessionPersisted: () => sessionPersistedBeforeGatewayAdmission,
				getSupersededSessionId: () => supersededSessionId,
				setAdmittedSessionId: (sessionId) => {
					admittedSessionId = sessionId;
				}
			});
			const admissionAgentId = admissionController.admissionAgentId;
			const assertGatewayWorkAdmissionAllowed = admissionController.assertAllowed;
			const acquireGatewayWorkAdmission = admissionController.acquire;
			const respondToGatewayAdmissionOutcome = admissionController.respondToOutcome;
			releaseGatewayAdmission = admissionController.release;
			const resetPhase = await runAgentResetPhase({
				request,
				cfg,
				requestedSessionKey,
				resolvedSessionId,
				effectiveTranscriptInputText,
				message,
				agentId,
				sessionKeyFromTo,
				lifecycleGeneration,
				runId,
				agentDedupeKeys,
				client: principal,
				context,
				respond,
				abortForLifecycleRotation,
				setCommittedResetCompletion: dedupeLifecycle.setCommittedResetCompletion
			});
			requestedSessionKey = resetPhase.requestedSessionKey;
			resolvedSessionId = resetPhase.resolvedSessionId;
			effectiveTranscriptInputText = resetPhase.effectiveTranscriptInputText;
			message = resetPhase.message;
			if (resetPhase.accepted) dedupeLifecycle.markAccepted(true);
			if (resetPhase.stop) return;
			if (requestedSessionKey) {
				const preparedSession = prepareAgentSession({
					cfg,
					requestedSessionKey,
					requestedSessionId,
					expectedExistingSessionId,
					agentId,
					recipientChannel,
					request,
					canUseCronRunContinuation,
					lifecycleGeneration,
					effectiveBootstrapContextRunKind,
					preAttachmentSession,
					respond
				});
				if (!preparedSession) return;
				const { cfg: cfgLocal, storePath, entry, canonicalKey, storeKeys, maintenanceConfig: sessionMaintenanceConfig, canonicalSessionAgentId, resetPolicy, now, visibleRequest, mainSessionKey: mainSessionKeyForRequest, isSystemGatewayRun, sessionId, touchInteraction, failedSessionTranscriptMissing: resolveFailedSessionTranscriptMissingForEntry } = preparedSession;
				cfgForAgent = cfgLocal;
				resolvedStorePath = storePath;
				const sessionAuthorizationError = authorizeGatewaySessionCreation({
					cfg: cfgLocal,
					client: principal,
					agentId: canonicalSessionAgentId
				}) ?? authorizeResolvedSessionMutation({
					cfg: cfgLocal,
					client: principal,
					sessionKey: canonicalKey,
					agentId: canonicalSessionAgentId
				});
				if (sessionAuthorizationError) {
					io.emitAcceptance([
						false,
						void 0,
						sessionAuthorizationError
					]);
					return;
				}
				effectiveBootstrapContextRunKind = preparedSession.effectiveBootstrapContextRunKind;
				restoredCronContinuationIdentity = preparedSession.restoredCronContinuationIdentity;
				sessionPersistedBeforeGatewayAdmission = preparedSession.sessionPersistedBeforeGatewayAdmission;
				isNewSession = preparedSession.isNewSession;
				const sessionAgent = canonicalSessionAgentId;
				const requestDeliveryHint = normalizeDeliveryContext({
					channel: recipientChannel?.trim(),
					to,
					accountId: recipientAccountId?.trim(),
					threadId: recipientThreadId
				});
				const explicitSessionKey = normalizeOptionalString(request.sessionKey);
				const buildSessionPatch = (freshEntry) => buildAgentSessionPatch({
					freshEntry,
					initialEntry: entry,
					cfg: cfgLocal,
					sessionAgentId: sessionAgent,
					canonicalSessionKey: canonicalKey,
					storePath,
					normalizedSpawned,
					requestDeliveryHint,
					requestLabel: request.label,
					...explicitSessionKey ? { explicitSessionKey } : {},
					pluginOwnerId: freshEntry === void 0 ? normalizeOptionalString(principal?.internal?.pluginRuntimeOwnerId) : void 0,
					expectedExistingSessionId,
					hasRestoredCronContinuation: restoredCronContinuationIdentity !== void 0,
					resetPolicy,
					now,
					requestedSessionId,
					isSystemGatewayRun,
					visibleRequest,
					fallbackSessionId: sessionId,
					touchInteraction,
					failedSessionTranscriptMissing: resolveFailedSessionTranscriptMissingForEntry
				});
				const patchBuild = buildSessionPatch(entry);
				isNewSession = patchBuild.isNewSession;
				sessionEntry = mergeSessionEntry(entry, patchBuild.patch);
				resolvedSessionId = sessionEntry?.sessionId ?? sessionId;
				admittedSessionId = resolvedSessionId ?? runId;
				const canonicalSessionKey = canonicalKey;
				resolvedSessionKey = canonicalSessionKey;
				const sessionAgentId = canonicalSessionAgentId;
				resolvedSessionAgentId = sessionAgentId;
				const mainSessionKey = mainSessionKeyForRequest;
				try {
					await acquireGatewayWorkAdmission(storePath ?? `agent:${sessionAgentId}`);
				} catch (err) {
					io.emitAcceptance([
						false,
						void 0,
						errorShapeFromError(ErrorCodes.INVALID_REQUEST, err)
					]);
					return;
				}
				if (respondToGatewayAdmissionOutcome()) return;
				const persistedSession = await persistAgentSessionPhase({
					request,
					cfg: cfgLocal,
					storePath,
					storeKeys,
					entry,
					canonicalSessionKey,
					sessionAgentId,
					mainSessionKey,
					creation: resolveAgentRunSessionCreation(principal),
					...principal?.authenticatedUserProfile ? { requestingOperatorProfileId: principal.authenticatedUserProfile.profileId } : {},
					...principal?.internal?.operatorRoleActor ? { operatorRoleActor: principal.internal.operatorRoleActor } : {},
					lifecycleGeneration,
					isRestartRecoveryResumeRun,
					runId,
					agentId,
					suppressVisibleSessionEffects,
					restoredCronContinuationIdentity,
					initialPatchBuild: patchBuild,
					buildSessionPatch,
					initialSessionEntry: sessionEntry,
					initialResolvedSessionId: resolvedSessionId,
					initialSessionPersistedBeforeGatewayAdmission: sessionPersistedBeforeGatewayAdmission,
					initialSupersededSessionId: supersededSessionId,
					touchInteraction,
					requestedBestEffortDeliver,
					bestEffortDeliver,
					expectedSession,
					maintenanceConfig: sessionMaintenanceConfig,
					abortForLifecycleRotation,
					assertGatewayWorkAdmissionAllowed,
					respondToGatewayAdmissionOutcome,
					updateAdmissionState: (state) => {
						resolvedSessionId = state.resolvedSessionId;
						admittedSessionId = state.admittedSessionId;
						supersededSessionId = state.supersededSessionId;
						sessionPersistedBeforeGatewayAdmission = state.sessionPersistedBeforeGatewayAdmission;
					},
					getAdmittedSessionId: () => admittedSessionId,
					setCronContinuationClaim: cronContinuation.setClaim,
					setMainRestartRecoveryOwnerLease: (lease) => {
						mainRestartRecoveryOwnerLease = lease;
					},
					respond
				});
				if (!persistedSession) return;
				sessionEntry = persistedSession.sessionEntry;
				resolvedSessionId = persistedSession.resolvedSessionId;
				sessionPersistedBeforeGatewayAdmission = persistedSession.sessionPersistedBeforeGatewayAdmission;
				supersededSessionId = persistedSession.supersededSessionId;
				admittedSessionId = persistedSession.admittedSessionId;
				skipAgentInitialSessionTouch = persistedSession.skipAgentInitialSessionTouch;
				isNewSession = persistedSession.isNewSession;
				spawnedByValue = persistedSession.spawnedBy;
				resolvedGroupId = persistedSession.groupId;
				resolvedGroupChannel = persistedSession.groupChannel;
				resolvedGroupSpace = persistedSession.groupSpace;
				pendingChatRun = persistedSession.pendingChatRun;
				bestEffortDeliver = persistedSession.bestEffortDeliver;
				restoredCronContinuation = persistedSession.restoredCronContinuation;
			}
			const delivery = await resolveAgentDeliveryPhase({
				request,
				cfg,
				cfgForAgent,
				sessionEntry,
				resolvedSessionKey,
				resolvedSessionAgentId,
				agentId,
				replyTo,
				to,
				recipientChannel,
				recipientAccountId,
				recipientThreadId,
				bestEffortDeliver,
				runId,
				client: principal,
				context,
				respond,
				isWebchatConnect,
				onRunObserved
			});
			if (!delivery) return;
			const { activeSessionAgentId } = delivery;
			const preparedDispatch = await prepareAgentRunDispatch({
				request,
				cfg,
				cfgForAgent,
				sessionEntry,
				resolvedSessionKey,
				requestedSessionKeyRaw,
				requestedSessionKey,
				preAcceptedReservedSessionKey,
				activeSessionAgentId,
				delivery,
				restoredCronContinuationIdentity,
				restoredCronContinuation,
				providerOverride,
				modelOverride,
				allowModelOverride,
				lifecycleGeneration,
				getAdmittedSessionId: () => admittedSessionId,
				ownerConnId,
				ownerDeviceId,
				suppressVisibleSessionEffects,
				pendingChatRun,
				inputProvenance,
				isOneShotModelRun,
				isRestartRecoveryResumeRun,
				canUseInternalRuntimeHandoff,
				execApprovalFollowupApprovalId,
				message,
				effectiveTranscriptInputText,
				images,
				offloadedRefs,
				onUserTurnMediaPersisted: () => {
					preparedOffloadedRefs = [];
				},
				requestedPromptPersistenceSuppression,
				runId,
				agentDedupeKeys,
				context,
				client: principal,
				io,
				abortForLifecycleRotation,
				acquireGatewayWorkAdmission,
				assertGatewayWorkAdmissionAllowed,
				hasGatewayAdmissionOutcome: admissionController.hasOutcome,
				respondToGatewayAdmissionOutcome,
				admissionAgentId,
				getGatewayWorkAdmission: admissionController.getAdmission,
				setAdmittedRunAbort: admissionController.setAdmittedRunAbort,
				getAdmittedRunAbort: admissionController.getAdmittedRunAbort,
				markAgentRunAccepted: dedupeLifecycle.markAccepted
			});
			if (!preparedDispatch) return;
			resolvedSessionId = admittedSessionId;
			preparedOffloadedRefs = [];
			gatewayAdmissionTransferred = true;
			startAgentRunExecution({
				assertContextCurrent,
				prepared: preparedDispatch,
				mainRestartRecoveryOwnerLease,
				request,
				cfg,
				cfgForAgent,
				sessionEntry,
				resolvedSessionKey,
				requestedSessionKey,
				resolvedSessionId,
				storePath: resolvedStorePath,
				agentId,
				activeSessionAgentId,
				delivery,
				isNewSession,
				isRawModelRun,
				isOneShotModelRun,
				isRestartRecoveryResumeRun,
				suppressVisibleSessionEffects,
				images,
				imageOrder,
				media,
				inputProvenance,
				runId,
				agentDedupeKeys,
				spawnedBy: spawnedByValue,
				groupId: resolvedGroupId,
				groupChannel: resolvedGroupChannel,
				groupSpace: resolvedGroupSpace,
				bestEffortDeliver,
				lifecycleGeneration,
				effectiveBootstrapContextRunKind,
				preserveUserFacingSessionModelState,
				sessionEffects,
				skipAgentInitialSessionTouch,
				restoredCronContinuation,
				canUseInternalRuntimeHandoff,
				client: principal,
				context,
				io,
				releaseCronContinuationClaimWithRecovery
			});
			mainRestartRecoveryOwnerLease = void 0;
		} finally {
			try {
				if (!gatewayAdmissionTransferred) {
					let pendingRecovery = void 0;
					try {
						pendingRecovery = await releaseMainSessionRecoveryOwner(mainRestartRecoveryOwnerLease);
					} finally {
						try {
							releaseGatewayAdmission();
						} finally {
							try {
								await releaseCronContinuationClaimWithRecovery();
							} finally {
								scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
							}
						}
					}
				}
			} finally {
				await discardPreparedInboundMedia(preparedOffloadedRefs);
				clearUnacceptedAgentDedupe();
			}
		}
	};
	const waitForTurn = async (params) => {
		const runId = (params.runId ?? "").trim();
		const timeoutMs = typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) ? Math.max(0, Math.floor(params.timeoutMs)) : 3e4;
		const activeChatEntry = context.chatAbortControllers.get(runId);
		const hasActiveChatRun = activeChatEntry !== void 0 && activeChatEntry.kind !== "agent";
		const queuedResult = () => context.chatQueuedTurns.has(runId) ? {
			runId,
			status: "pending",
			timeoutPhase: "queue",
			providerStarted: false
		} : void 0;
		const queuedBeforeWait = queuedResult();
		if (queuedBeforeWait) return queuedBeforeWait;
		const snapshot = await waitForAgentJob({
			runId,
			timeoutMs,
			...hasActiveChatRun ? { source: "chat" } : {}
		});
		const queuedAfterWait = queuedResult();
		if (queuedAfterWait) return queuedAfterWait;
		if (!snapshot) {
			const activeRunRegistered = activeChatEntry !== void 0;
			return {
				runId,
				status: "timeout",
				timeoutPhase: activeRunRegistered ? "gateway_draining" : "queue",
				...activeRunRegistered ? {} : { providerStarted: false }
			};
		}
		return {
			runId,
			status: snapshot.status,
			startedAt: snapshot.startedAt,
			endedAt: snapshot.endedAt,
			error: snapshot.error,
			stopReason: snapshot.stopReason,
			livenessState: snapshot.livenessState,
			yielded: snapshot.yielded,
			pendingError: snapshot.pendingError,
			timeoutPhase: snapshot.timeoutPhase,
			providerStarted: snapshot.providerStarted,
			...snapshot.terminalDelivery ? { terminalDelivery: snapshot.terminalDelivery } : {},
			terminalReceipt: snapshot.terminalReceipt,
			terminalReply: snapshot.terminalReply
		};
	};
	const abortTurn = async (options) => {
		await handleChatAbortRequest({
			...options,
			context,
			isWebchatConnect
		});
	};
	return {
		startTurn,
		waitForTurn,
		abortTurn
	};
}
//#endregion
export { readGatewayDedupeEntry as a, resolveCanUseCronRunContinuation as c, resolveExpectedExistingSessionConstraint as i, resolveCanUseInternalRuntimeHandoff as l, reactivateCompletedSubagentSession as n, resolveAgentDedupeKeys as o, resolveGatewayChatCronCreatorAuthorityAdmission as r, resolveAllowModelOverrideFromClient as s, createAgentTurnService as t };
