import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { K as interruptSessionWorkAdmissions, R as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, X as runExclusiveSessionLifecycleMutation } from "./agent-harness-session-key-BpWapmwX.js";
import { Cr as validateSessionsCompactionBranchParams, Tr as validateSessionsCompactionRestoreParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import "./sessions-Bh837xaa.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-4IbI4BFl.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { t as clearSessionQueues } from "./cleanup-C31pth_Y.js";
import { i as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-BZjFQ_8W.js";
import { n as getSessionCompactionCheckpoint, t as createFileBackedCompactionCheckpointStore } from "./session-compaction-checkpoints-DDWg3cX8.js";
import { n as emitSessionsChanged } from "./session-change-event-XKNRoRWi.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { a as loadAccessorSessionEntryForGatewayTarget, f as respondSessionWorkerPlacementMutationError, l as requireSessionKey } from "./sessions-shared-7waBealu.js";
import { t as buildDashboardSessionKey } from "./session-create-service-C4rNgCBY.js";
import { t as interruptSessionRunIfActive } from "./sessions-messaging-vo9BFia0.js";
//#region src/gateway/server-methods/sessions-compaction-checkpoints.ts
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
const MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE = "Checkpoint branch and restore are unavailable while model selection is locked.";
function respondCheckpointConflict(key, action, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before checkpoint ${action}. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
}
const sessionCheckpointHandlers = {
	"sessions.compaction.branch": async ({ params, respond, context }) => {
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
