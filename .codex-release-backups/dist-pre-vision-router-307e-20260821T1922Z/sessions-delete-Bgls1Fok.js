import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-BGbniDph.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { n as resolveSessionStoreAgentId } from "./session-store-key-CoZdm5gl.js";
import "./session-accessor-Bi6bzKQE.js";
import { a as rollbackPluginOwnedSessionEntryLifecycle, n as deleteSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { K as interruptSessionWorkAdmissions, R as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, X as runExclusiveSessionLifecycleMutation, a as isAgentHarnessSessionKey } from "./agent-harness-session-key-BMj1lPtX.js";
import { Ar as validateSessionsDeleteParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as handleSessionStateSessionDeleted } from "./session-state-events-C74I5OQg.js";
import "./sessions-D-jhKYGW.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-BOW0O5mU.js";
import { T as loadGatewaySessionEntry } from "./session-utils-row-pCr636Wc.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import "./session-utils-CCDcSRdK.js";
import { a as isModelSelectionLocked } from "./model-overrides-D4SC_nUZ.js";
import { s as managedWorktrees } from "./service-C_Ue82wC.js";
import { a as retireSessionWorkerPlacementBeforeMutation, i as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-BZjFQ_8W.js";
import { n as emitSessionsChanged } from "./session-change-event-DpwrobLa.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as chatHandlers } from "./chat-gobMPTly.js";
import { a as loadAccessorSessionEntryForGatewayTarget, c as rejectPluginRuntimeSessionOwnershipMismatch, f as respondSessionWorkerPlacementMutationError, l as requireSessionKey, p as sessionLog, r as isAgentMainSessionKey, s as loadSessionsRuntimeModule, u as resolveGatewaySessionTargetFromKey } from "./sessions-shared-DsqJJjAE.js";
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
					sessionFile: result.deletedSessionFile,
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
				if (deletedWorktree) {
					worktreePreserved = {
						id: deletedWorktree.id,
						branch: deletedWorktree.branch,
						path: deletedWorktree.path
					};
					if (deletedWorktree.ownerKind !== "session" || deletedWorktree.ownerId !== deletedSessionKey) sessionLog.warn(`refusing to clean up worktree ${deletedWorktree.id} for deleted session ${deletedSessionKey}: registry owner is ${deletedWorktree.ownerKind}${deletedWorktree.ownerId ? ` ${deletedWorktree.ownerId}` : ""}`);
					else try {
						await managedWorktrees.remove({
							id: deletedWorktree.id,
							reason: "session-delete"
						});
						worktreePreserved = void 0;
					} catch (error) {
						sessionLog.warn(`failed to clean up worktree for deleted session ${deletedSessionKey}: ${formatErrorMessage(error)}`);
					}
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
