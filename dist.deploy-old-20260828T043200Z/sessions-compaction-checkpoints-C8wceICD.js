import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { jr as validateSessionsCompactionRestoreParams, kr as validateSessionsCompactionBranchParams } from "./src-4dv5TpeQ.js";
import { c as interruptSessionWorkAdmissions, p as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-1qqb7Ac0.js";
import "./sessions-CdrF1uzY.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-DzPMUp4j.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { A as waitForEmbeddedAgentRunEnd, n as abortEmbeddedAgentRun, u as isEmbeddedAgentRunActive } from "./runs-DpT-JSmi.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as clearSessionQueues } from "./cleanup-BNML21Fq.js";
import { r as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-SteNC2br.js";
import { n as getSessionCompactionCheckpoint, t as createFileBackedCompactionCheckpointStore } from "./session-compaction-checkpoints-DxUGwHnR.js";
import { t as authorizeGatewaySessionCreation } from "./operator-role-policy-Bvt-UeJ1.js";
import { r as hasTrackedActiveSessionRun } from "./session-active-runs-C7YJ2XPa.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as handleChatAbortRequestWithLifecycle } from "./chat-abort-handler-CbKK56Sa.js";
import { c as requireSessionKey, d as respondSessionWorkerPlacementMutationError, i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-BYADMHw6.js";
import { t as resolveAbortSessionKey } from "./sessions-abort-C81UiMBk.js";
import { t as buildDashboardSessionKey } from "./session-create-service-CjNljuQX.js";
//#region src/gateway/server-methods/session-run-interruption.ts
/** Hard-stop session work for lifecycle mutation callers that have already fenced admission. */
async function interruptSessionRunIfActive(params) {
	const cfg = params.context.getRuntimeConfig();
	const hasTrackedRun = hasTrackedActiveSessionRun({
		context: params.context,
		requestedKey: params.requestedKey,
		canonicalKey: params.canonicalKey,
		agentId: params.agentId,
		defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, params.canonicalKey),
		excludeRunIds: params.excludeRunIds
	});
	const hasEmbeddedRun = typeof params.sessionId === "string" && params.sessionId ? isEmbeddedAgentRunActive(params.sessionId) : false;
	const hasWorkerRun = typeof params.sessionId === "string" && params.sessionId ? asWorkerInferenceControl(params.context.workerEnvironmentService)?.hasInferenceForSession(params.sessionId) ?? false : false;
	if (!hasTrackedRun && !hasEmbeddedRun && !hasWorkerRun) return { interrupted: false };
	if (hasTrackedRun || hasWorkerRun) {
		let abortOk = true;
		let abortError;
		const abortSessionKey = resolveAbortSessionKey({
			context: params.context,
			requestedKey: params.requestedKey,
			canonicalKey: params.canonicalKey,
			agentId: params.agentId,
			defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, params.canonicalKey)
		});
		await handleChatAbortRequestWithLifecycle({
			req: params.req,
			params: {
				sessionKey: abortSessionKey,
				...params.agentId ? { agentId: params.agentId } : {}
			},
			respond: (ok, _payload, error) => {
				abortOk = ok;
				abortError = error;
			},
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect
		}, params.excludeRunIds ? { excludeRunIds: params.excludeRunIds } : {});
		if (!abortOk) return {
			interrupted: true,
			error: abortError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to interrupt active session")
		};
	}
	if (hasEmbeddedRun && params.sessionId) abortEmbeddedAgentRun(params.sessionId);
	clearSessionQueues([
		params.requestedKey,
		params.canonicalKey,
		params.sessionId
	]);
	if (hasEmbeddedRun && params.sessionId) {
		if (!await waitForEmbeddedAgentRunEnd(params.sessionId, 15e3)) return {
			interrupted: true,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.requestedKey} is still active; try again in a moment.`)
		};
	}
	return { interrupted: true };
}
//#endregion
//#region src/gateway/server-methods/sessions-compaction-checkpoints.ts
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
const MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE = "Checkpoint branch and restore are unavailable while model selection is locked.";
function respondCheckpointConflict(key, action, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before checkpoint ${action}. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
}
const sessionCheckpointHandlers = {
	"sessions.compaction.branch": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsCompactionBranchParams, "sessions.compaction.branch", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const checkpointId = typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
		if (!checkpointId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { entry, canonicalKey, sessionStoreKey, target, storePath } = loadAccessorSessionEntryForGatewayTarget({
			key,
			cfg,
			agentId: requestedAgent.agentId
		});
		if (!entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (!getSessionCompactionCheckpoint({
			entry,
			checkpointId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: target.agentId
		});
		if (creationError) {
			respond(false, void 0, creationError);
			return;
		}
		const nextKey = buildDashboardSessionKey(target.agentId);
		const branchedSession = await compactionCheckpointStore.branchCheckpointSession({
			agentId: target.agentId,
			expectedState: {
				sessionId: entry.sessionId,
				lifecycleRevision: entry.lifecycleRevision
			},
			storePath,
			sourceKey: canonicalKey,
			sourceStoreKey: sessionStoreKey,
			nextKey,
			checkpointId
		});
		if (branchedSession.status === "missing-checkpoint" || branchedSession.status === "missing-boundary") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		if (branchedSession.status === "missing-session") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (branchedSession.status === "model-selection-locked") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE));
			return;
		}
		if (branchedSession.status === "conflict") {
			respondCheckpointConflict(key, "branch", respond);
			return;
		}
		if (branchedSession.status === "failed") {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "failed to create checkpoint branch transcript"));
			return;
		}
		respond(true, {
			ok: true,
			sourceKey: canonicalKey,
			key: branchedSession.key,
			sessionId: branchedSession.entry.sessionId,
			checkpoint: branchedSession.checkpoint,
			entry: branchedSession.entry
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: canonicalKey,
			agentId: requestedAgent.agentId,
			reason: "checkpoint-branch"
		});
		emitSessionsChanged(context, {
			sessionKey: branchedSession.key,
			reason: "checkpoint-branch"
		});
	},
	"sessions.compaction.restore": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionsCompactionRestoreParams, "sessions.compaction.restore", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const checkpointId = typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
		if (!checkpointId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const { entry, canonicalKey, sessionStoreKey, storePath } = loadAccessorSessionEntryForGatewayTarget({
			key,
			cfg,
			agentId: requestedAgent.agentId
		});
		if (!entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		if (!getSessionCompactionCheckpoint({
			entry,
			checkpointId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
			return;
		}
		const initialPlacementError = resolveSessionWorkerPlacementMutationError({
			action: "restore",
			context,
			key,
			sessionId: entry.sessionId
		});
		if (initialPlacementError) {
			respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
			return;
		}
		const lifecycleIdentities = [
			key,
			canonicalKey,
			sessionStoreKey,
			entry.sessionId,
			entry.lifecycleRevision
		];
		const restoreLockIdentities = [entry.sessionId, entry.lifecycleRevision];
		let admittedWorkReleased = true;
		let restoreTargetStillCurrent = true;
		let restoreBlockedByModelLock = false;
		let restorePlacementError;
		await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: restoreLockIdentities,
			prepare: async () => {
				const current = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgent.agentId
				});
				const currentCheckpoint = current.entry ? getSessionCompactionCheckpoint({
					entry: current.entry,
					checkpointId
				}) : void 0;
				restoreTargetStillCurrent = current.entry?.sessionId === entry.sessionId && current.entry.lifecycleRevision === entry.lifecycleRevision && currentCheckpoint !== void 0;
				if (!restoreTargetStillCurrent) return;
				restoreBlockedByModelLock = current.entry?.modelSelectionLocked === true;
				if (restoreBlockedByModelLock) return;
				restorePlacementError = resolveSessionWorkerPlacementMutationError({
					action: "restore",
					context,
					key,
					sessionId: current.entry?.sessionId
				});
				if (restorePlacementError) return;
				clearSessionQueues([
					key,
					current.canonicalKey,
					current.sessionStoreKey,
					current.entry?.sessionId
				]);
				admittedWorkReleased = await interruptSessionWorkAdmissions({
					scope: storePath,
					identities: lifecycleIdentities,
					timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
				});
			},
			run: async () => {
				if (!restoreTargetStillCurrent) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before checkpoint restore. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				if (restoreBlockedByModelLock) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE));
					return;
				}
				if (restorePlacementError) {
					respondSessionWorkerPlacementMutationError(restorePlacementError, respond);
					return;
				}
				if (!admittedWorkReleased) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`));
					return;
				}
				const current = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgent.agentId
				});
				if (!current.entry?.sessionId) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
					return;
				}
				if (current.entry.modelSelectionLocked === true) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE));
					return;
				}
				if (!getSessionCompactionCheckpoint({
					entry: current.entry,
					checkpointId
				})) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
					return;
				}
				const interruptResult = await interruptSessionRunIfActive({
					req,
					context,
					client,
					isWebchatConnect,
					requestedKey: key,
					canonicalKey: current.canonicalKey,
					agentId: requestedAgent.agentId,
					sessionId: current.entry.sessionId
				});
				if (interruptResult.error) {
					respond(false, void 0, interruptResult.error);
					return;
				}
				const restoredSession = await compactionCheckpointStore.restoreCheckpointSession({
					agentId: requestedAgent.agentId,
					expectedState: {
						sessionId: current.entry.sessionId,
						lifecycleRevision: current.entry.lifecycleRevision
					},
					storePath,
					sessionKey: current.canonicalKey,
					sessionStoreKey: current.sessionStoreKey,
					checkpointId
				});
				if (restoredSession.status === "missing-checkpoint" || restoredSession.status === "missing-boundary") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`));
					return;
				}
				if (restoredSession.status === "missing-session") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
					return;
				}
				if (restoredSession.status === "model-selection-locked") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE));
					return;
				}
				if (restoredSession.status === "conflict") {
					respondCheckpointConflict(key, "restore", respond);
					return;
				}
				if (restoredSession.status === "failed") {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "failed to restore checkpoint transcript"));
					return;
				}
				respond(true, {
					ok: true,
					key: restoredSession.key,
					sessionId: restoredSession.entry.sessionId,
					checkpoint: restoredSession.checkpoint,
					entry: restoredSession.entry
				}, void 0);
				emitSessionsChanged(context, {
					sessionKey: current.canonicalKey,
					agentId: requestedAgent.agentId,
					reason: "checkpoint-restore"
				});
			}
		});
	}
};
//#endregion
export { sessionCheckpointHandlers };
