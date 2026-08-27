import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-D-qPZITK.js";
import { Et as inheritSessionSelection, V as recoverSessionEntryFromRestartTombstone, gn as buildSessionCreationStamp } from "./session-accessor-CVnxp3UM.js";
import { X as runExclusiveSessionLifecycleMutation, Y as isSessionWorkAdmissionActive } from "./agent-harness-session-key-D5rklW6u.js";
import { p as mergeSessionEntry } from "./restart-recovery-state-DDUaUjgV.js";
import { ei as validateSessionsRecoverParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { u as recordSessionCreated } from "./session-state-events-BTZJfLLh.js";
import { l as isEmbeddedAgentRunActive } from "./runs-DdjJNEQM.js";
import { E as loadGatewaySessionEntryReadOnly, M as resolveGatewaySessionStoreTarget } from "./session-utils-row-CriEgq90.js";
import "./session-utils-rhyq5EVD.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import { t as inspectMainRestartRecoveryRolloverEligibility } from "./main-session-recovery-state-BkgEXAzo.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-DIFuSi8s.js";
import "./embedded-agent--GrdaB8E.js";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.js";
import { n as emitSessionsChanged, t as emitSessionArchived } from "./session-change-event-BanWv5Vf.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CX5dCIoC.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as handleTrustedInternalChatSend } from "./chat-send-handler-CzlbNsWf.js";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-Clnn0OSD.js";
import { t as buildDashboardSessionKey } from "./session-create-service-MEWuvilG.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/session-recovery-entry.ts
/** Builds the fresh runtime identity paired with a recovered transcript. */
function buildRestartRecoverySuccessorEntry(params) {
	const source = params.source;
	const entry = mergeSessionEntry(void 0, {
		...inheritSessionSelection(source),
		...buildSessionCreationStamp({
			via: "operator",
			actor: params.actor
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
	const initialSource = loadGatewaySessionEntryReadOnly(sourceTarget.canonicalKey, { agentId: sourceTarget.agentId }).entry;
	if (!initialSource?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery source was not found.")
	};
	const initialEligibility = inspectMainRestartRecoveryRolloverEligibility(initialSource);
	if (!initialEligibility.eligible && initialEligibility.reason !== "already_recovered") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery requires a restart-tombstoned session.")
	};
	const ownershipError = resolvePluginSessionOwnershipError({
		action: "recover",
		entry: initialSource,
		key: sourceTarget.canonicalKey,
		pluginOwnerId: params.authorizedPluginId
	});
	if (ownershipError) return {
		ok: false,
		error: ownershipError
	};
	const recovery = initialSource.mainRestartRecovery;
	if (!recovery?.tombstone) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "Session is not recoverable.")
	};
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
			identities: [sourceTarget.canonicalKey, initialSource.sessionId]
		}, {
			scope: successorTarget.storePath,
			identities: [successorTarget.canonicalKey, successorSessionId]
		}],
		run: async () => {
			const currentSource = loadGatewaySessionEntryReadOnly(sourceTarget.canonicalKey, { agentId: sourceTarget.agentId }).entry;
			const currentOwnershipError = resolvePluginSessionOwnershipError({
				action: "recover",
				entry: currentSource,
				key: sourceTarget.canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (currentOwnershipError) return {
				ok: false,
				error: currentOwnershipError
			};
			if (!currentSource?.sessionId) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before recovery; refresh and retry.")
			};
			if (isEmbeddedAgentRunActive(currentSource.sessionId) || isSessionWorkAdmissionActive(sourceTarget.storePath, [sourceTarget.canonicalKey, currentSource.sessionId])) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "Session recovery is unavailable while the source still has active work.")
			};
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
const sessionRecoverHandlers = { "sessions.recover": async ({ req, params, respond, client, context }) => {
	if (!assertValidParams(params, validateSessionsRecoverParams, "sessions.recover", respond)) return;
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const creation = resolveOperatorSessionCreation(client);
	const recovered = await recoverGatewaySession({
		cfg: context.getRuntimeConfig(),
		key: params.key,
		...params.agentId ? { agentId: params.agentId } : {},
		...creation.actor ? { actor: creation.actor } : {},
		authorizedPluginId: client?.internal?.pluginRuntimeOwnerId,
		...authority.commitGuard ? { commitGuard: authority.commitGuard } : {},
		launchContinuation: async (continuation) => await launchSessionRecoveryContinuation({
			...continuation,
			client,
			...authority.commitGuard ? { commitGuard: authority.commitGuard } : {},
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
