import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { x as resolvePersistedSessionStoreOwnerForKey } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Ir as validateSessionsDeleteParams } from "./src-4dv5TpeQ.js";
import { n as resolveSessionStoreAgentId } from "./session-store-key-DRF7yKG5.js";
import { c as interruptSessionWorkAdmissions, p as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-1qqb7Ac0.js";
import "./session-accessor-B-FKZX9M.js";
import { a as isAgentHarnessSessionKey } from "./agent-harness-session-key-Bf-Q9dw5.js";
import { a as rollbackPluginOwnedSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-DeUgE0mJ.js";
import { a as handleSessionStateSessionDeleted } from "./session-state-events-BkuyPMaw.js";
import "./sessions-CdrF1uzY.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-DzPMUp4j.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { a as isModelSelectionLocked } from "./model-overrides-BcLzAaaZ.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { a as retireSessionWorkerPlacementBeforeMutation, r as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-SteNC2br.js";
import { c as classifyWorktreeRemovalError, l as managedWorktrees } from "./service-P2Ot4H_g.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { t as chatHandlers } from "./chat-C9Dr0d5-.js";
import { c as requireSessionKey, d as respondSessionWorkerPlacementMutationError, f as sessionLog, i as loadAccessorSessionEntryForGatewayTarget, l as resolveGatewaySessionTargetFromKey, n as isAgentMainSessionKey, o as loadSessionsRuntimeModule, s as rejectPluginRuntimeSessionOwnershipMismatch } from "./sessions-shared-BYADMHw6.js";
//#region src/gateway/server-methods/sessions-delete.ts
const sessionDeleteHandlers = { "sessions.delete": async ({ req, params, respond, client, isWebchatConnect, context, sessionMutationAuthorization }) => {
	if (!assertValidParams(params, validateSessionsDeleteParams, "sessions.delete", respond)) return;
	const p = params;
	const key = requireSessionKey(p.key, respond);
	if (!key) return;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, { agentId: requestedAgentId });
	const compatibilityDefaultAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	const protectedGlobalAgentId = persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : compatibilityDefaultAgentId;
	const explicitlySelectedGlobalAgentId = normalizeOptionalString(p.agentId) ?? parseAgentSessionKey(key)?.agentId;
	const isSelectedNonDefaultGlobal = target.canonicalKey === "global" && explicitlySelectedGlobalAgentId !== void 0 && normalizeAgentId(explicitlySelectedGlobalAgentId) !== protectedGlobalAgentId;
	const isMainSession = target.canonicalKey !== "global" && isAgentMainSessionKey(cfg, target.canonicalKey);
	if ((target.canonicalKey === "global" || isMainSession) && !isSelectedNonDefaultGlobal) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Cannot delete the main session (${target.canonicalKey}).`));
		return;
	}
	const deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
	const { cleanupSessionBeforeMutation, emitGatewaySessionEndPluginHook, emitSessionUnboundLifecycleEvent } = await loadSessionsRuntimeModule();
	const initialDeleteEntry = loadGatewaySessionEntry(key, { agentId: requestedAgentId }).entry;
	const rejectModelSelectionLockedDelete = (entry, sessionKey) => {
		if (!isModelSelectionLocked(entry)) return false;
		if (normalizeOptionalString(entry?.pluginOwnerId) !== void 0 && entry?.agentHarnessId === void 0 && !isAgentHarnessSessionKey(sessionKey)) return false;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "This session cannot be deleted while model selection is locked."));
		return true;
	};
	if (rejectModelSelectionLockedDelete(initialDeleteEntry, target.canonicalKey)) return;
	if (p.archivedOnly === true && initialDeleteEntry?.archivedAt === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`));
		return;
	}
	const expectedSessionId = p.expectedSessionId?.trim();
	const expectedLifecycleRevision = p.expectedLifecycleRevision?.trim();
	const expectedSessionUpdatedAt = p.expectedSessionUpdatedAt;
	const expectedLifecycleRevisionMatches = (entry) => !expectedLifecycleRevision || entry?.lifecycleRevision === expectedLifecycleRevision;
	const expectedSessionIdMatches = (entry) => {
		if (!expectedSessionId || entry?.sessionId === expectedSessionId) return true;
		return false;
	};
	const respondSessionChanged = () => {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before deletion. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
	};
	const rejectExpectedSessionMismatch = (entry) => {
		const updatedAtMatches = expectedSessionUpdatedAt === void 0 || entry?.updatedAt === expectedSessionUpdatedAt;
		if (expectedLifecycleRevisionMatches(entry) && expectedSessionIdMatches(entry) && updatedAtMatches) return false;
		respondSessionChanged();
		return true;
	};
	if (rejectExpectedSessionMismatch(initialDeleteEntry)) return;
	const initialPlacementError = resolveSessionWorkerPlacementMutationError({
		action: "delete",
		context,
		key,
		sessionId: normalizeOptionalString(initialDeleteEntry?.sessionId)
	});
	if (initialPlacementError) {
		respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
		return;
	}
	if (rejectPluginRuntimeSessionOwnershipMismatch({
		action: "delete",
		client,
		key: target.canonicalKey ?? key,
		entry: initialDeleteEntry,
		respond
	})) return;
	const abortSessionKey = target.canonicalKey ?? key;
	const chatAbort = chatHandlers["chat.abort"];
	if (!chatAbort) throw new Error("chat.abort handler is not registered");
	const deleteLifecycleIdentities = [
		target.canonicalKey,
		key,
		initialDeleteEntry?.sessionId,
		expectedSessionId
	];
	let admittedWorkReleased = true;
	let expectedSessionStillCurrent = true;
	let deleteBlockedByModelLock = false;
	let deleteBlockedByWorkerPlacement = false;
	let deleteBlockedByArchiveOrOwnership = false;
	let preparedDeleteSessionId;
	let deletedWorktreeId;
	let worktreePreserved;
	const deletion = await runExclusiveSessionLifecycleMutation({
		scope: storePath,
		identities: deleteLifecycleIdentities,
		prepare: async () => {
			sessionMutationAuthorization?.assertCurrent();
			const { entry: preparedEntry, canonicalKey: preparedCanonicalKey } = loadGatewaySessionEntry(key, { agentId: requestedAgentId });
			deleteBlockedByModelLock = rejectModelSelectionLockedDelete(preparedEntry, preparedCanonicalKey ?? target.canonicalKey);
			if (deleteBlockedByModelLock) return;
			expectedSessionStillCurrent = !rejectExpectedSessionMismatch(preparedEntry);
			if (!expectedSessionStillCurrent) return;
			const placementError = resolveSessionWorkerPlacementMutationError({
				action: "delete",
				context,
				key,
				sessionId: normalizeOptionalString(preparedEntry?.sessionId)
			});
			if (placementError) {
				deleteBlockedByWorkerPlacement = true;
				respondSessionWorkerPlacementMutationError(placementError, respond);
				return;
			}
			if (p.archivedOnly === true && preparedEntry?.archivedAt === void 0) {
				deleteBlockedByArchiveOrOwnership = true;
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`));
				return;
			}
			if (rejectPluginRuntimeSessionOwnershipMismatch({
				action: "delete",
				client,
				key: preparedCanonicalKey ?? key,
				entry: preparedEntry,
				respond
			})) {
				deleteBlockedByArchiveOrOwnership = true;
				return;
			}
			preparedDeleteSessionId = normalizeOptionalString(preparedEntry?.sessionId);
			admittedWorkReleased = await interruptSessionWorkAdmissions({
				scope: storePath,
				identities: deleteLifecycleIdentities,
				timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
			});
		},
		run: async () => {
			if (deleteBlockedByModelLock || deleteBlockedByWorkerPlacement || deleteBlockedByArchiveOrOwnership || !expectedSessionStillCurrent) return;
			if (!admittedWorkReleased) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`));
				return;
			}
			sessionMutationAuthorization?.assertCurrent();
			const { entry, legacyKey, canonicalKey } = loadGatewaySessionEntry(key, { agentId: requestedAgentId });
			if (normalizeOptionalString(entry?.sessionId) !== preparedDeleteSessionId) {
				respondSessionChanged();
				return;
			}
			if (rejectModelSelectionLockedDelete(entry, canonicalKey ?? target.canonicalKey)) return;
			if (rejectExpectedSessionMismatch(entry)) return;
			if (p.archivedOnly === true && entry?.archivedAt === void 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} is not archived. Archive it first, then delete it.`));
				return;
			}
			if (rejectPluginRuntimeSessionOwnershipMismatch({
				action: "delete",
				client,
				key: canonicalKey ?? key,
				entry,
				respond
			})) return;
			const placementRetirementError = retireSessionWorkerPlacementBeforeMutation({
				action: "delete",
				context,
				key,
				sessionId: normalizeOptionalString(entry?.sessionId)
			});
			if (placementRetirementError) {
				respondSessionWorkerPlacementMutationError(placementRetirementError, respond);
				return;
			}
			let abortResult;
			await chatAbort({
				req,
				params: {
					sessionKey: abortSessionKey,
					...requestedAgentId ? { agentId: requestedAgentId } : {}
				},
				respond: (ok, _payload, error) => {
					abortResult = {
						ok,
						...error ? { error } : {}
					};
				},
				context,
				client,
				isWebchatConnect,
				...sessionMutationAuthorization ? { sessionMutationAuthorization } : {}
			});
			if (abortResult?.ok === false) {
				respond(false, void 0, abortResult.error);
				return;
			}
			const mutationCleanupError = await cleanupSessionBeforeMutation({
				cfg,
				key,
				target,
				entry,
				legacyKey,
				canonicalKey,
				reason: "session-delete"
			});
			if (mutationCleanupError) {
				respond(false, void 0, mutationCleanupError);
				return;
			}
			const postCleanupTarget = loadAccessorSessionEntryForGatewayTarget({
				key,
				cfg,
				...requestedAgentId ? { agentId: requestedAgentId } : {}
			});
			const postCleanupEntry = postCleanupTarget.entry;
			deletedWorktreeId = normalizeOptionalString(postCleanupEntry?.worktree?.id);
			sessionMutationAuthorization?.assertCurrent();
			if (!expectedLifecycleRevisionMatches(postCleanupEntry) || !expectedSessionIdMatches(postCleanupEntry)) {
				respondSessionChanged();
				return;
			}
			const pluginOwnerId = normalizeOptionalString(postCleanupEntry?.pluginOwnerId);
			const incognito = postCleanupEntry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
			const deletionParams = {
				agentId: target.agentId,
				archiveTranscript: incognito ? false : deleteTranscript,
				deleteDeliveryArtifacts: true,
				deleteTranscriptWithoutArchive: incognito,
				expectedEntry: postCleanupEntry,
				expectedLifecycleRevision,
				expectedSessionId,
				expectedUpdatedAt: postCleanupEntry?.updatedAt,
				storePath,
				target: {
					canonicalKey: target.canonicalKey,
					storeKeys: target.storeKeys
				}
			};
			const result = postCleanupEntry && pluginOwnerId && isModelSelectionLocked(postCleanupEntry) ? await rollbackPluginOwnedSessionEntryLifecycle({
				...deletionParams,
				expectedEntry: postCleanupEntry,
				expectedPluginOwnerId: pluginOwnerId,
				target: {
					canonicalKey: postCleanupTarget.target.canonicalKey,
					storeKeys: postCleanupTarget.target.storeKeys
				}
			}) : await deleteSessionEntryLifecycle(deletionParams);
			if (result.expectedEntryMismatch) {
				respondSessionChanged();
				return;
			}
			if (result.deleted) {
				emitGatewaySessionEndPluginHook({
					cfg,
					sessionKey: target.canonicalKey ?? key,
					sessionId: result.deletedSessionId,
					storePath,
					agentId: target.agentId,
					reason: "deleted",
					archivedTranscripts: result.archivedTranscripts
				});
				await emitSessionUnboundLifecycleEvent({
					targetSessionKey: target.canonicalKey ?? key,
					reason: "session-delete",
					emitHooks: p.emitLifecycleHooks !== false
				});
				const deletedSessionKey = target.canonicalKey ?? key;
				handleSessionStateSessionDeleted(deletedSessionKey, requestedAgentId ?? resolveSessionStoreAgentId(cfg, deletedSessionKey));
				const deletedWorktree = deletedWorktreeId ? managedWorktrees.findLiveById(deletedWorktreeId) : void 0;
				if (deletedWorktree) if (deletedWorktree.ownerKind !== "session" || deletedWorktree.ownerId !== deletedSessionKey) {
					worktreePreserved = {
						id: deletedWorktree.id,
						branch: deletedWorktree.branch,
						path: deletedWorktree.path,
						reason: "owner-mismatch"
					};
					sessionLog.warn(`refusing to clean up worktree ${deletedWorktree.id} for deleted session ${deletedSessionKey}: registry owner is ${deletedWorktree.ownerKind}${deletedWorktree.ownerId ? ` ${deletedWorktree.ownerId}` : ""}`);
				} else try {
					await managedWorktrees.remove({
						id: deletedWorktree.id,
						reason: "session-delete"
					});
				} catch (error) {
					sessionLog.warn(`failed to clean up worktree for deleted session ${deletedSessionKey}: ${formatErrorMessage(error)}`);
					const liveWorktree = managedWorktrees.findLiveById(deletedWorktree.id);
					if (liveWorktree) worktreePreserved = {
						id: liveWorktree.id,
						branch: liveWorktree.branch,
						path: liveWorktree.path,
						reason: classifyWorktreeRemovalError(error)
					};
				}
			}
			return result;
		}
	});
	if (!deletion) return;
	const deleted = deletion.deleted;
	const archived = deletion.archivedTranscripts.map((entryLocal) => entryLocal.archivedPath);
	respond(true, {
		ok: true,
		key: target.canonicalKey,
		deleted,
		archived,
		...worktreePreserved ? { worktreePreserved } : {}
	}, void 0);
	if (deleted) {
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			agentId: target.agentId,
			reason: "delete"
		});
		emitSessionsChanged(context, { reason: "delete" });
	}
} };
//#endregion
export { sessionDeleteHandlers as t };
