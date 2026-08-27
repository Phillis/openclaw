import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { di as validateSessionsRecoverParams } from "./src-4dv5TpeQ.js";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-azPdmUls.js";
import { d as isSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BtKN0pjk.js";
import { st as buildSessionCreationStamp } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { r as mergeSessionEntry } from "./types-gVK8DqPC.js";
import { Ot as inheritSessionSelection, Z as recoverSessionEntryFromRestartTombstone } from "./session-accessor-fcDZuc2H.js";
import { u as recordSessionCreated } from "./session-state-events-DvygRPJJ.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { u as isEmbeddedAgentRunActive } from "./runs-eqaxGmoQ.js";
import { d as resolveGatewaySessionStoreTarget, i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import { t as inspectMainRestartRecoveryRolloverEligibility } from "./main-session-recovery-state-DagFkxEX.js";
import { n as prepareSessionWorkerPlacementForArchive } from "./session-placement-lifecycle-SteNC2br.js";
import "./embedded-agent-uA4hl59E.js";
import { t as authorizeGatewaySessionCreation } from "./operator-role-policy-il7s4lXY.js";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-Dk6fjq2Z.js";
import { n as emitSessionsChanged, t as emitSessionArchived } from "./session-change-event-Cjm468kd.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-B9w3HHXu.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { i as handleTrustedInternalChatSend } from "./chat-send-handler-Cc-XJB9u.js";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-DnVI97Gp.js";
import { t as buildDashboardSessionKey } from "./session-create-service-D3TxHcgc.js";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-eLWq_7-B.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/session-recovery-entry.ts
/** Builds the fresh runtime identity paired with a recovered transcript. */
function buildRestartRecoverySuccessorEntry(params) {
	const source = params.source;
	const entry = mergeSessionEntry(void 0, {
		...inheritSessionSelection(source),
		...buildSessionCreationStamp({
			via: "operator",
			actor: params.actor,
			...source.sandbox ? { sandbox: source.sandbox } : {}
		}),
		delivery: normalizeSessionDeliveryState(),
		sessionId: params.sessionId,
		previousSessionId: source.sessionId,
		spawnDepth: 0,
		...source.agentHarnessId ? { agentHarnessId: source.agentHarnessId } : {},
		...source.modelSelectionLocked === true ? { modelSelectionLocked: true } : {},
		...source.pluginOwnerId ? { pluginOwnerId: source.pluginOwnerId } : {},
		...source.visibility ? { visibility: source.visibility } : {},
		...source.spawnedCwd ? { spawnedCwd: source.spawnedCwd } : {},
		...source.execHost ? { execHost: source.execHost } : {},
		...source.execNode ? { execNode: source.execNode } : {},
		...source.execCwd ? { execCwd: source.execCwd } : {},
		...source.execSecurity ? { execSecurity: source.execSecurity } : {},
		...source.execAsk ? { execAsk: source.execAsk } : {}
	});
	return {
		...entry,
		...buildMainSessionRecoveryClearPatch(entry),
		sessionId: params.sessionId
	};
}
//#endregion
//#region src/gateway/session-recovery-service.ts
function recoveryConflictError(reason) {
	const unavailable = reason === "successor-missing" || reason === "transcript-missing";
	return errorShape(unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, unavailable ? "Session recovery state is incomplete." : "Session changed before recovery; refresh and retry.", { details: { reason } });
}
/** Owns explicit restart recovery from authorization through continuation launch. */
async function recoverGatewaySession(params) {
	const sourceTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const readSource = () => loadGatewaySessionEntryReadOnly(sourceTarget.canonicalKey, { agentId: sourceTarget.agentId }).entry;
	const initialSource = readSource();
	const checkOwnership = (entry) => resolvePluginSessionOwnershipError({
		action: "recover",
		entry,
		key: sourceTarget.canonicalKey,
		pluginOwnerId: params.authorizedPluginId
	});
	if (!initialSource?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery source was not found.")
	};
	const initialEligibility = inspectMainRestartRecoveryRolloverEligibility(initialSource);
	if (!initialEligibility.eligible && initialEligibility.reason !== "already_recovered") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery requires a restart-tombstoned session.")
	};
	const ownershipError = checkOwnership(initialSource);
	if (ownershipError) return {
		ok: false,
		error: ownershipError
	};
	const recovery = initialSource.mainRestartRecovery;
	if (!recovery?.tombstone) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session is not recoverable.")
	};
	if (!recovery.tombstone.recoveredSessionKey) {
		const creationError = authorizeGatewaySessionCreation({
			cfg: params.cfg,
			agentId: sourceTarget.agentId,
			...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
		});
		if (creationError) return {
			ok: false,
			error: creationError
		};
	}
	const generatedSuccessorKey = buildDashboardSessionKey(sourceTarget.agentId);
	const successorTarget = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: generatedSuccessorKey,
		agentId: sourceTarget.agentId
	});
	const successorSessionId = randomUUID();
	const committed = await runExclusiveSessionLifecycleMutation({
		targets: [{
			scope: sourceTarget.storePath,
			identities: [
				...sourceTarget.storeKeys,
				sourceTarget.canonicalKey,
				initialSource.sessionId
			]
		}, {
			scope: successorTarget.storePath,
			identities: [successorTarget.canonicalKey, successorSessionId]
		}],
		run: async () => {
			let currentSource = readSource();
			const currentOwnershipError = checkOwnership(currentSource);
			if (currentOwnershipError) return {
				ok: false,
				error: currentOwnershipError
			};
			if (!currentSource?.sessionId) return {
				ok: false,
				error: recoveryConflictError("source-changed")
			};
			if (!currentSource.mainRestartRecovery?.tombstone?.recoveredSessionKey) {
				const creationError = authorizeGatewaySessionCreation({
					cfg: params.cfg,
					agentId: sourceTarget.agentId,
					...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
				});
				if (creationError) return {
					ok: false,
					error: creationError
				};
			}
			if (isEmbeddedAgentRunActive(currentSource.sessionId) || isSessionWorkAdmissionActive(sourceTarget.storePath, [sourceTarget.canonicalKey, currentSource.sessionId])) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery is unavailable while the source still has active work.")
			};
			const alreadyRecovered = currentSource.mainRestartRecovery?.tombstone?.recoveredSessionKey;
			if (params.workerPlacementContext.workerSessionPlacementService?.getMany([currentSource.sessionId]).get(currentSource.sessionId) && !alreadyRecovered) {
				try {
					await prepareSessionWorkerPlacementForArchive({
						agentId: sourceTarget.agentId,
						...params.commitGuard ? { authorize: params.commitGuard } : {},
						context: params.workerPlacementContext,
						reclaimActive: true,
						sessionId: currentSource.sessionId,
						sessionKey: sourceTarget.canonicalKey
					});
				} catch (error) {
					params.commitGuard?.();
					return {
						ok: false,
						error: errorShape(ErrorCodes.UNAVAILABLE, `Session recovery cannot safely stop/reclaim its cloud worker: ${formatErrorMessage(error)} Stop cloud worker or call sessions.reclaim, then retry recovery.`, { retryable: true })
					};
				}
				params.commitGuard?.();
				const settledSource = readSource();
				if (settledSource?.sessionId !== currentSource.sessionId || settledSource.lifecycleRevision !== currentSource.lifecycleRevision) return {
					ok: false,
					error: recoveryConflictError("source-changed")
				};
				const settledOwnershipError = checkOwnership(settledSource);
				if (settledOwnershipError) return {
					ok: false,
					error: settledOwnershipError
				};
				currentSource = settledSource;
			}
			const successorEntry = buildRestartRecoverySuccessorEntry({
				sessionId: successorSessionId,
				source: currentSource,
				...params.actor ? { actor: params.actor } : {}
			});
			const result = await recoverSessionEntryFromRestartTombstone({
				agentId: sourceTarget.agentId,
				...params.actor ? { archivedBy: params.actor } : {},
				...params.commitGuard ? { commitGuard: params.commitGuard } : {},
				expected: {
					cycleId: recovery.cycleId,
					lifecycleRevision: initialSource.lifecycleRevision,
					revision: recovery.revision,
					sessionId: initialSource.sessionId,
					...normalizeOptionalString(initialSource.pluginOwnerId) ? { pluginOwnerId: initialSource.pluginOwnerId } : {}
				},
				sourceTarget,
				storePath: sourceTarget.storePath,
				successorEntry,
				successorTarget
			});
			if (result.status === "conflict") return {
				ok: false,
				error: recoveryConflictError(result.reason)
			};
			return {
				ok: true,
				created: result.status === "created",
				successorEntry: result.successorEntry,
				successorKey: result.successorKey
			};
		}
	});
	if (!committed.ok) return committed;
	if (committed.created) recordSessionCreated({
		sessionKey: committed.successorKey,
		entry: committed.successorEntry,
		agentId: sourceTarget.agentId
	});
	const continuation = await params.launchContinuation({
		agentId: sourceTarget.agentId,
		idempotencyKey: `restart-recovery-rollover:${committed.successorEntry.sessionId}`,
		sessionId: committed.successorEntry.sessionId,
		sessionKey: committed.successorKey
	});
	return {
		ok: true,
		agentId: sourceTarget.agentId,
		created: committed.created,
		sourceKey: sourceTarget.canonicalKey,
		successorEntry: committed.successorEntry,
		successorKey: committed.successorKey,
		continuation
	};
}
//#endregion
//#region src/gateway/server-methods/session-recovery-continuation.ts
const RECOVERY_CONTINUATION_TEXT = "Continue from the recovered transcript and finish the interrupted work.";
/** Starts the fixed recovery continuation as trusted system input. */
async function launchSessionRecoveryContinuation(params) {
	let outcome;
	try {
		await handleTrustedInternalChatSend({
			req: params.req,
			params: {
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				sessionId: params.sessionId,
				message: formatSystemTurnPrompt(RECOVERY_CONTINUATION_TEXT),
				idempotencyKey: params.idempotencyKey,
				deliver: false,
				suppressCommandInterpretation: true,
				systemInputProvenance: {
					kind: "internal_system",
					sourceSessionKey: params.sessionKey,
					sourceTool: "sessions.recover"
				}
			},
			respond: (ok, payload, error) => {
				const response = payload;
				const runId = ok && response && typeof response.runId === "string" ? response.runId.trim() : "";
				outcome = ok && runId ? {
					status: "started",
					runId
				} : {
					status: "rejected",
					error: error ?? errorShape(ErrorCodes.UNAVAILABLE, "Continuation was not started.")
				};
			},
			context: params.context,
			client: params.client,
			isWebchatConnect: () => false
		}, params.commitGuard ? async () => {
			params.commitGuard?.();
			return true;
		} : void 0);
	} catch (error) {
		outcome = {
			status: "rejected",
			error: errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "Continuation authority check failed.")
		};
	}
	return outcome ?? {
		status: "rejected",
		error: errorShape(ErrorCodes.UNAVAILABLE, "Continuation returned no outcome.")
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-recover.ts
const sessionRecoverHandlers = { "sessions.recover": async ({ req, params, respond, client, context, sessionMutationAuthorization }) => {
	if (!assertValidParams(params, validateSessionsRecoverParams, "sessions.recover", respond)) return;
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const commitGuard = authority.commitGuard || sessionMutationAuthorization ? () => {
		authority.commitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
	} : void 0;
	const creation = resolveOperatorSessionCreation(client);
	const recovered = await recoverGatewaySession({
		cfg: context.getRuntimeConfig(),
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		...creation.actor ? { actor: creation.actor } : {},
		...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
		...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
		authorizedPluginId: client?.internal?.pluginRuntimeOwnerId,
		...commitGuard ? { commitGuard } : {},
		workerPlacementContext: resolveSessionWorkerPlacementContext(context),
		launchContinuation: async (continuation) => await launchSessionRecoveryContinuation({
			...continuation,
			client,
			...commitGuard ? { commitGuard } : {},
			context,
			req
		})
	}).catch((error) => authority.handleClosedError(error));
	if (!recovered) return;
	if (!recovered.ok) {
		respond(false, void 0, recovered.error);
		return;
	}
	emitSessionArchived(context, recovered.sourceKey, recovered.sourceKey === "global" ? recovered.agentId : void 0);
	emitSessionsChanged(context, {
		sessionKey: recovered.successorKey,
		reason: recovered.created ? "create" : "recovery",
		...recovered.successorKey === "global" ? { agentId: recovered.agentId } : {}
	});
	respond(true, {
		ok: true,
		key: recovered.successorKey,
		sessionId: recovered.successorEntry.sessionId,
		continuation: recovered.continuation
	}, void 0);
} };
//#endregion
export { sessionRecoverHandlers };
