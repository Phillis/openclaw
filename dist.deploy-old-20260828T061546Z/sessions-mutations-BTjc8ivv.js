import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./fs-safe-CmrQUApq.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { O as patchPluginSessionExtension } from "./loader-BcKpDiEM.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { ai as validateSessionsPatchManyParams, fi as validateSessionsResetParams, oi as validateSessionsPatchParams, si as validateSessionsPluginPatchParams, yr as validateSessionsAssignOwnerParams } from "./src-4dv5TpeQ.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRF7yKG5.js";
import { A as isInternalSessionEffectsKey } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { c as interruptSessionWorkAdmissions, l as isCompetingSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BtKN0pjk.js";
import { Dt as SessionLabelOwnerIndex, Nt as applySessionEntryCanonicalReplacements } from "./session-accessor-fcDZuc2H.js";
import { t as assignSessionOwner } from "./session-accessor.sqlite-owner-C4EZWikF.js";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-D9_Ct3Lx.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-B13mO5hL.js";
import { d as errorShape, f as missingScopeErrorShape } from "./validation-errors-rELRlKfn.js";
import { b as waitForReplyRunEndBySessionId, l as isReplyRunActiveForSessionId, m as replyRunRegistry, n as abortReplyRunBySessionId } from "./reply-run-registry-Ch9Ye6re.js";
import { A as waitForEmbeddedAgentRunEnd, f as isEmbeddedAgentRunInProgress, n as abortEmbeddedAgentRun } from "./runs-eqaxGmoQ.js";
import { a as getCommandLaneSnapshot } from "./command-queue-CBS1Vl32.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
import { n as projectSessionPatchResult } from "./session-utils-model-DHZkyDhz.js";
import { c as projectAssignableSessionOwner, l as projectSessionActor, v as disableCronJobsBoundToSessions } from "./session-utils-list-D98WVYL8.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { f as resolveGatewaySessionStoreTargetWithStore, o as resolveCanonicalGatewaySessionStoreKey, s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-Dmx2MxPy.js";
import { s as hasPendingFollowupQueueWork } from "./settings-CxUlx8Vr.js";
import "./session-utils-uVsFjoXC.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { t as clearSessionQueues } from "./cleanup-CiIpHyQA.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-CgZcALpf.js";
import { n as prepareSessionWorkerPlacementForArchive } from "./session-placement-lifecycle-SteNC2br.js";
import { m as waitForChatAbortControllerRemoval } from "./chat-abort-CsMNzOPX.js";
import { n as resolveStickyModelSelectionScope, t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-ChH_TCbX.js";
import { a as resolveCreatorSandbox, d as gatewayClientSessionCreator, t as authorizeGatewaySessionCreation } from "./operator-role-policy-il7s4lXY.js";
import { g as resolveSessionSharingTarget, r as authorizeIncognitoSessionTarget, t as SessionMutationAuthorizationChangedError, u as createSessionListEntryFilter } from "./session-sharing-DSLYm21V.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-Dk6fjq2Z.js";
import { n as emitSessionsChanged } from "./session-change-event-Cjm468kd.js";
import { i as hasGatewaySessionAbortOwner, r as createChatAbortOps, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-DroEkxn7.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-B9w3HHXu.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { c as requireSessionKey, f as sessionLog, n as isAgentMainSessionKey, o as loadSessionsRuntimeModule, u as resolveSessionWorkerPlacementPatchError } from "./sessions-shared-DVKJTkd0.js";
import { t as projectSessionsPatchEntry } from "./sessions-patch-u8GJWIwF.js";
import { r as ensureSessionGroupRegistered } from "./session-groups-CjVenYCj.js";
import { t as beginWorkerInferenceSessionDrain } from "./inference-control-internal-CQh2JfZC.js";
//#region src/gateway/server-methods/session-unread-ack.ts
var session_unread_ack_exports = /* @__PURE__ */ __exportAll({
	resolveSessionUnreadAck: () => resolveSessionUnreadAck$1,
	validateSessionUnreadAck: () => validateSessionUnreadAck$1
});
const CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS = /* @__PURE__ */ new Set([
	"agentId",
	"expectedLifecycleRevision",
	"expectedMarkedUnreadAt",
	"expectedSessionId",
	"key",
	"unread"
]);
function hasOtherMutation(patch) {
	return Object.entries(patch).some(([key, value]) => value !== void 0 && !CONDITIONAL_UNREAD_ACK_ALLOWED_KEYS.has(key));
}
function validateSessionUnreadAck$1(patch, target) {
	if (target.expectedMarkedUnreadAt === void 0) return;
	if (patch.unread === false && !hasOtherMutation(patch)) return;
	return "expectedMarkedUnreadAt requires unread=false as the only mutation.";
}
function resolveSessionUnreadAck$1(entry, patch) {
	const { expectedMarkedUnreadAt } = patch;
	if (patch.unread !== false || hasOtherMutation(patch) || expectedMarkedUnreadAt === void 0) return { kind: "apply" };
	if (!entry) return { kind: "missing" };
	return (entry.markedUnreadAt ?? null) === expectedMarkedUnreadAt ? { kind: "apply" } : {
		kind: "stale",
		entry
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-archive-lifecycle.ts
function asArchiveInferenceDrainService(value) {
	if (typeof value !== "object" || value === null) return;
	return typeof value.beginInferenceSessionDrain === "function" ? value : void 0;
}
function hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, workIdentities) {
	const sessionId = params.sessionId;
	return isCompetingSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || params.sessionKeys.some((key) => replyRunRegistry.isActive(key)) || Boolean(sessionId && isReplyRunActiveForSessionId(sessionId)) || Boolean(sessionId && isEmbeddedAgentRunInProgress(sessionId)) || hasPendingFollowupQueueWork(workIdentities) || workIdentities.some((key) => getCommandLaneSnapshot(resolveEmbeddedSessionLane(key)).queuedCount > 0) || hasGatewaySessionAbortOwner({
		context: params.context,
		sessionKeys: params.sessionKeys,
		sessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}) || Boolean(sessionId && params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId)?.turnClaim) || workerDrain?.hasWork() === true || terminalDrain?.hasWork() === true;
}
/** Fence is already active when this starts; retain the returned runtime fence through commit. */
async function prepareSessionArchiveLifecycle(params) {
	await prepareSessionWorkerPlacementForArchive({
		...params,
		reclaimActive: false
	});
	const timeoutMs = SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS;
	const workIdentities = Array.from(/* @__PURE__ */ new Set([...params.sessionKeys, ...params.sessionId ? [params.sessionId] : []]));
	const workerService = params.context.workerEnvironmentService;
	const workerControl = asWorkerInferenceControl(workerService);
	let workerDrain;
	let terminalDrain;
	if (params.sessionId) {
		workerDrain = beginWorkerInferenceSessionDrain(workerService, params.sessionId) ?? asArchiveInferenceDrainService(workerService)?.beginInferenceSessionDrain(params.sessionId);
		if (!workerDrain && workerControl?.hasInferenceForSession(params.sessionId) === true) throw new Error("Worker inference drain is unavailable");
		terminalDrain = params.context.terminalSessions?.beginAgentSessionDrain({
			kind: "agent",
			agentSessionKey: params.sessionKey,
			agentSessionId: params.sessionId,
			agentId: params.agentId
		});
	}
	try {
		let controllerDrain = Promise.resolve(true);
		if ((await abortChatRunsForSessionKeyWithPartials({
			context: params.context,
			ops: createChatAbortOps(params.context),
			sessionKey: params.sessionKeys[0],
			sessionKeyAliases: params.sessionKeys.slice(1),
			sessionId: params.sessionId,
			agentId: params.agentId,
			defaultAgentId: params.defaultAgentId,
			abortOrigin: "rpc",
			stopReason: "archive",
			requester: { isAdmin: true },
			includeProtectedRuns: true,
			onControllerTargets: (targets) => {
				controllerDrain = waitForChatAbortControllerRemoval({
					entries: params.context.chatAbortControllers,
					targets,
					timeoutMs
				});
			},
			onAuthorizedAfterQueuedAbort: () => {
				const cleared = clearSessionQueues(workIdentities);
				let aborted = cleared.followupCleared > 0 || cleared.laneCleared > 0;
				for (const key of params.sessionKeys) aborted = replyRunRegistry.abort(key) || aborted;
				if (params.sessionId) {
					aborted = abortReplyRunBySessionId(params.sessionId) || aborted;
					aborted = abortEmbeddedAgentRun(params.sessionId) || aborted;
				}
				return aborted;
			}
		})).unauthorized) throw new Error("Archive cancellation lost session ownership");
		const admittedWork = interruptSessionWorkAdmissions({
			scope: params.storePath,
			identities: params.lifecycleIdentities,
			timeoutMs
		});
		const replyWork = Promise.all([...params.sessionKeys.map((key) => replyRunRegistry.waitForIdle(key, timeoutMs)), ...params.sessionId ? [waitForReplyRunEndBySessionId(params.sessionId, timeoutMs)] : []]).then((results) => results.every(Boolean));
		const embeddedWork = params.sessionId ? waitForEmbeddedAgentRunEnd(params.sessionId, timeoutMs) : Promise.resolve(true);
		const placementService = params.context.workerSessionPlacementService;
		const placementWork = (params.sessionId ? placementService?.getMany([params.sessionId]).get(params.sessionId) : void 0)?.turnClaim ? placementService?.waitForTurnClaimRelease ? placementService.waitForTurnClaimRelease(params.sessionId, { timeoutMs }).then(() => true) : Promise.resolve(false) : Promise.resolve(true);
		const workerWork = workerDrain ? withTimeout(workerDrain.drained, timeoutMs, "worker inference archive drain").then(() => true) : Promise.resolve(true);
		const terminalWork = terminalDrain ? withTimeout(terminalDrain.drained, timeoutMs, "agent terminal archive drain").then(() => true) : Promise.resolve(true);
		if (!(await Promise.all([
			controllerDrain,
			admittedWork,
			replyWork,
			embeddedWork,
			placementWork,
			workerWork,
			terminalWork
		])).every(Boolean)) throw new Error("Session work did not fully drain before archive");
		await prepareSessionWorkerPlacementForArchive({
			...params,
			reclaimActive: true
		});
		return {
			release: () => {
				terminalDrain?.release();
				workerDrain?.release();
			},
			hasAuthoritativeWork: () => hasAuthoritativeSessionWork(params, workerDrain, terminalDrain, workIdentities)
		};
	} catch (error) {
		terminalDrain?.release();
		workerDrain?.release();
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-archive.ts
function archiveChangedError(key) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
}
function archiveUnavailableError(key, message) {
	return errorShape(ErrorCodes.UNAVAILABLE, message === "active" ? `Session ${key} is still active; retry the archive.` : `Session ${key} did not finish stopping; retry the archive.`, { retryable: true });
}
function protectedArchiveError(cfg, canonicalKey) {
	if (canonicalKey === "unknown") return errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive the unknown session sentinel.");
	if (canonicalKey === "global" || isAgentMainSessionKey(cfg, canonicalKey)) return errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive an agent's main session.");
}
function archiveTargetChanged(params) {
	const { baselineEntry, currentEntry, patch } = params;
	const expectedSessionChanged = patch.expectedSessionId !== void 0 && currentEntry?.sessionId !== patch.expectedSessionId || patch.expectedLifecycleRevision !== void 0 && currentEntry?.lifecycleRevision !== patch.expectedLifecycleRevision;
	const generationChanged = baselineEntry !== void 0 && currentEntry !== void 0 && (currentEntry.sessionId !== baselineEntry.sessionId || currentEntry.lifecycleRevision !== baselineEntry.lifecycleRevision);
	return expectedSessionChanged || baselineEntry !== void 0 && currentEntry === void 0 || baselineEntry === void 0 && currentEntry !== void 0 || generationChanged;
}
async function prepareSessionPatchArchive(params) {
	const { cfg, target } = params;
	const freshResolved = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: target.key,
		...target.requestedAgentId ? { agentId: target.requestedAgentId } : {},
		exactRead: true
	});
	if (freshResolved.storePath !== target.storePath) return err(archiveChangedError(target.key));
	const fresh = resolveCanonicalGatewaySessionStoreKey({
		cfg,
		key: target.key,
		store: freshResolved.store,
		agentId: target.requestedAgentId
	});
	const freshCanonicalKey = fresh.target.canonicalKey ?? target.key;
	const ownershipError = resolvePluginSessionOwnershipError({
		action: "patch",
		entry: fresh.entry,
		key: freshCanonicalKey,
		pluginOwnerId: params.pluginOwnerId
	});
	if (ownershipError) return err(ownershipError);
	if (freshCanonicalKey !== target.canonicalKey || archiveTargetChanged({
		currentEntry: fresh.entry,
		baselineEntry: target.initialEntry,
		patch: target.fullPatch
	})) return err(archiveChangedError(target.key));
	const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(freshCanonicalKey, fresh.entry);
	if (missingHarnessSessionError) return err(errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError));
	const protectedError = protectedArchiveError(cfg, freshCanonicalKey);
	if (protectedError) return err(protectedError);
	const placementError = resolveSessionWorkerPlacementPatchError({
		agentId: freshResolved.agentId,
		cfg,
		context: params.context,
		entry: fresh.entry,
		key: target.key,
		patch: target.fullPatch,
		sessionKey: freshCanonicalKey,
		validateModelRuntime: false
	});
	if (placementError) return err(errorShape(ErrorCodes.INVALID_REQUEST, placementError));
	const freshCandidateKeys = new Set(fresh.target.storeKeys);
	const preview = await projectSessionsPatchEntry({
		cfg,
		existingEntry: fresh.entry,
		isLabelInUse: (label) => Object.entries(freshResolved.store).some(([sessionKey, entry]) => !freshCandidateKeys.has(sessionKey) && entry.label === label),
		storeKey: fresh.primaryKey,
		agentId: target.requestedAgentId,
		patch: target.fullPatch,
		archivedBy: target.archiveActor,
		loadGatewayModelCatalog: params.loadGatewayModelCatalog
	});
	if (!preview.ok) return err(preview.error);
	const previewPlacementError = resolveSessionWorkerPlacementPatchError({
		agentId: freshResolved.agentId,
		cfg,
		context: params.context,
		entry: preview.entry,
		key: target.key,
		patch: target.fullPatch,
		sessionKey: freshCanonicalKey,
		validateModelRuntime: true
	});
	if (previewPlacementError) return err(errorShape(ErrorCodes.INVALID_REQUEST, previewPlacementError));
	const authorizationError = params.commitGuard();
	if (authorizationError) return err(authorizationError);
	try {
		return ok({
			canonicalKey: freshCanonicalKey,
			drain: await prepareSessionArchiveLifecycle({
				context: params.context,
				storePath: target.storePath,
				sessionKeys: Array.from(/* @__PURE__ */ new Set([
					target.key,
					target.canonicalKey,
					...target.initialStoreKeys,
					freshCanonicalKey,
					...fresh.target.storeKeys
				])),
				sessionId: fresh.entry?.sessionId,
				sessionKey: freshCanonicalKey,
				agentId: freshResolved.agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, freshCanonicalKey),
				lifecycleIdentities: target.lifecycleIdentities.filter((identity) => Boolean(identity))
			}),
			...fresh.entry ? { entry: fresh.entry } : {}
		});
	} catch (error) {
		sessionLog.warn(`sessions.patch: archive drain failed for ${target.canonicalKey}: ${formatErrorMessage(error)}`);
		return err(archiveUnavailableError(target.key, "stopping"));
	}
}
function validateSessionPatchArchiveProjection(params) {
	if (params.preparation.drain.hasAuthoritativeWork()) return archiveUnavailableError(params.key, "active");
	if (params.primaryKey !== params.preparation.canonicalKey || archiveTargetChanged({
		currentEntry: params.existingEntry,
		baselineEntry: params.preparation.entry,
		patch: params.fullPatch
	})) return archiveChangedError(params.key);
	return protectedArchiveError(params.cfg, params.primaryKey) ?? resolvePluginSessionOwnershipError({
		action: "patch",
		entry: params.existingEntry,
		key: params.primaryKey,
		pluginOwnerId: params.pluginOwnerId
	});
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-model-selection.ts
function persistSessionPatchModelSelection(params) {
	const scope = resolveStickyModelSelectionScope({ cfg: params.cfg });
	if (typeof params.patch.model !== "string" || !params.callerScopes.includes("operator.admin") || scope === "session" || scope === "effective" && (params.entry.modelOverrideSource !== "user" || !params.entry.providerOverride || !params.entry.modelOverride)) return;
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	persistStickyModelSelectionBestEffort({
		agentId,
		model: `${resolved.provider}/${resolved.model}`,
		...scope === "agent" ? { target: "agent" } : scope === "global" ? { target: "defaults" } : {}
	});
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-engine.ts
const { resolveSessionUnreadAck, validateSessionUnreadAck } = session_unread_ack_exports;
function unexpectedPatchError(key, error) {
	sessionLog.warn(`sessions.patch: target failed for ${key}: ${formatErrorMessage(error)}`);
	return errorShape(ErrorCodes.UNAVAILABLE, "Session patch failed unexpectedly. Retry the request.", { retryable: true });
}
function sessionChangedError(key) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
}
function pluginOwnershipError(client, entry, key) {
	return resolvePluginSessionOwnershipError({
		action: "patch",
		entry,
		key,
		pluginOwnerId: client?.internal?.pluginRuntimeOwnerId
	});
}
function createCommitGuard(key, assertCurrent) {
	return () => {
		try {
			assertCurrent?.();
			return;
		} catch (error) {
			return error instanceof SessionMutationAuthorizationChangedError ? error.error : unexpectedPatchError(key, error);
		}
	};
}
async function executeSessionPatchMutations(params) {
	const { client } = params;
	const cfg = params.context.getRuntimeConfig();
	const operatorCreation = resolveOperatorSessionCreation(client);
	const sandbox = resolveCreatorSandbox(cfg, operatorCreation);
	const creation = {
		...operatorCreation,
		...sandbox ? { sandbox } : {}
	};
	const archiveActor = gatewayClientSessionCreator(client);
	const callerScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	const callerCanManageCron = client === null || callerScopes.includes("operator.admin");
	const pluginOwnerId = client?.internal?.pluginRuntimeOwnerId;
	const targetDiscoveryCache = /* @__PURE__ */ new Map();
	const preflightTargets = params.targets.map((input) => {
		const key = input.key.trim();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, input.agentId);
		return {
			input,
			key,
			requestedAgent,
			resolved: requestedAgent.ok ? resolveGatewaySessionStoreTargetWithStore({
				cfg,
				key,
				agentId: requestedAgent.agentId,
				exactRead: true,
				targetDiscoveryCache
			}) : void 0
		};
	});
	const logicalTargets = /* @__PURE__ */ new Set();
	for (const { key, resolved } of preflightTargets) {
		if (!resolved) continue;
		const logicalId = `${resolved.storePath}\0${resolved.canonicalKey ?? key}`;
		if (logicalTargets.has(logicalId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "Duplicate target.")
		};
		logicalTargets.add(logicalId);
	}
	const outcomes = Array.from({ length: params.targets.length });
	const prepared = [];
	const preparedByIndex = Array.from({ length: params.targets.length });
	for (const [index, { input, key, requestedAgent, resolved }] of preflightTargets.entries()) {
		const unreadAckError = validateSessionUnreadAck(params.patch, input);
		if (unreadAckError) {
			outcomes[index] = {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, unreadAckError)
			};
			continue;
		}
		if (!requestedAgent.ok) {
			outcomes[index] = requestedAgent;
			continue;
		}
		if (!resolved) {
			outcomes[index] = {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, "Session target could not be resolved.")
			};
			continue;
		}
		const requestedAgentId = requestedAgent.agentId;
		const canonicalKey = resolved.canonicalKey ?? key;
		const candidateKeys = resolved.storeKeys;
		let initialEntry;
		try {
			initialEntry = resolveCanonicalSessionEntryFromStoreKeys(resolved.store, [...candidateKeys]);
		} catch (error) {
			outcomes[index] = {
				ok: false,
				error: unexpectedPatchError(key, error)
			};
			continue;
		}
		const creationError = !initialEntry && authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId: resolved.agentId
		});
		if (creationError) {
			outcomes[index] = {
				ok: false,
				error: creationError
			};
			continue;
		}
		const ownershipError = pluginOwnershipError(client, initialEntry, canonicalKey);
		if (ownershipError) {
			outcomes[index] = {
				ok: false,
				error: ownershipError
			};
			continue;
		}
		const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(canonicalKey, initialEntry);
		if (missingHarnessSessionError) {
			outcomes[index] = {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError)
			};
			continue;
		}
		const { commitGuard: _commitGuard, ...identity } = input;
		const fullPatch = {
			...params.patch,
			...identity
		};
		let initialPlacementPatchError;
		try {
			initialPlacementPatchError = resolveSessionWorkerPlacementPatchError({
				agentId: resolved.agentId,
				cfg,
				context: params.context,
				entry: initialEntry,
				key,
				patch: fullPatch,
				sessionKey: canonicalKey,
				validateModelRuntime: false
			});
		} catch (error) {
			outcomes[index] = {
				ok: false,
				error: unexpectedPatchError(key, error)
			};
			continue;
		}
		if (initialPlacementPatchError) {
			outcomes[index] = {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, initialPlacementPatchError)
			};
			continue;
		}
		const lifecycleIdentities = Array.from(/* @__PURE__ */ new Set([
			key,
			canonicalKey,
			...candidateKeys,
			initialEntry?.sessionId
		]));
		const preparedTarget = {
			archiveActor,
			canonicalKey,
			fullPatch,
			index,
			...initialEntry ? { initialEntry } : {},
			initialStoreKeys: [...candidateKeys],
			key,
			lifecycleIdentities,
			...requestedAgentId ? { requestedAgentId } : {},
			storePath: resolved.storePath,
			targetAgentId: resolved.agentId
		};
		prepared.push(preparedTarget);
		preparedByIndex[index] = preparedTarget;
	}
	const modelCatalogByAgent = /* @__PURE__ */ new Map();
	const loadModelCatalog = (agentId) => {
		let promise = modelCatalogByAgent.get(agentId);
		if (!promise) {
			promise = params.context.loadGatewayModelCatalog({ agentId });
			modelCatalogByAgent.set(agentId, promise);
		}
		return promise;
	};
	if (prepared.length > 0) try {
		await runExclusiveSessionLifecycleMutation({
			targets: prepared.map((target) => ({
				scope: target.storePath,
				identities: target.lifecycleIdentities
			})),
			prepare: async () => {
				await Promise.all(prepared.filter((target) => target.fullPatch.archived === true).map(async (target) => {
					try {
						const result = await prepareSessionPatchArchive({
							cfg,
							commitGuard: params.targets[target.index].commitGuard,
							context: params.context,
							loadGatewayModelCatalog: () => loadModelCatalog(target.targetAgentId),
							...pluginOwnerId ? { pluginOwnerId } : {},
							target
						});
						if (result.ok) target.archivePreparation = result.value;
						else outcomes[target.index] = result;
					} catch (error) {
						outcomes[target.index] = {
							ok: false,
							error: unexpectedPatchError(target.key, error)
						};
					}
				}));
			},
			run: async () => {
				const groups = /* @__PURE__ */ new Map();
				for (const target of prepared) {
					if (target.fullPatch.archived === true && !target.archivePreparation) continue;
					const groupKey = `${target.storePath}\0${target.targetAgentId}`;
					const group = groups.get(groupKey);
					if (group) group.push(target);
					else groups.set(groupKey, [target]);
				}
				await Promise.all([...groups.values()].map(async (group) => {
					const first = group[0];
					try {
						const selectedSessionKeys = group.length === 1 && first.fullPatch.label === void 0 ? Array.from(/* @__PURE__ */ new Set([
							first.key,
							first.canonicalKey,
							...first.initialStoreKeys
						])) : void 0;
						const groupOutcomes = await applySessionEntryCanonicalReplacements({
							agentId: first.targetAgentId,
							...selectedSessionKeys ? { sessionKeys: selectedSessionKeys } : {},
							storePath: first.storePath,
							skipMaintenance: true,
							update: async (entries) => {
								const workingStore = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
								const labelOwners = new SessionLabelOwnerIndex(workingStore);
								const replacements = [];
								const projectedOutcomes = [];
								for (const target of group) try {
									const { entry: existingEntry, primaryKey, target: currentTarget } = resolveCanonicalGatewaySessionStoreKey({
										cfg,
										key: target.key,
										store: workingStore,
										...target.requestedAgentId ? { agentId: target.requestedAgentId } : {}
									});
									const creationError = !existingEntry && authorizeGatewaySessionCreation({
										cfg,
										client,
										agentId: target.targetAgentId
									});
									if (creationError) {
										projectedOutcomes.push({
											ok: false,
											error: creationError
										});
										continue;
									}
									const candidateKeys = currentTarget.storeKeys;
									const ownershipError = pluginOwnershipError(client, existingEntry, primaryKey);
									if (ownershipError) {
										projectedOutcomes.push({
											ok: false,
											error: ownershipError
										});
										continue;
									}
									const expectedSessionChanged = target.fullPatch.expectedSessionId !== void 0 && existingEntry?.sessionId !== target.fullPatch.expectedSessionId || target.fullPatch.expectedLifecycleRevision !== void 0 && existingEntry?.lifecycleRevision !== target.fullPatch.expectedLifecycleRevision;
									const lifecycleEntryRemoved = target.initialEntry !== void 0 && existingEntry === void 0;
									const archiveTargetChanged = target.fullPatch.archived === true && (target.initialEntry === void 0 ? existingEntry !== void 0 : existingEntry !== void 0 && (existingEntry.sessionId !== target.initialEntry.sessionId || existingEntry.lifecycleRevision !== target.initialEntry.lifecycleRevision));
									if (expectedSessionChanged || lifecycleEntryRemoved || archiveTargetChanged) {
										projectedOutcomes.push({
											ok: false,
											error: sessionChangedError(target.key)
										});
										continue;
									}
									if (target.fullPatch.archived === true) {
										const archiveError = validateSessionPatchArchiveProjection({
											cfg,
											existingEntry,
											fullPatch: target.fullPatch,
											key: target.key,
											...pluginOwnerId ? { pluginOwnerId } : {},
											preparation: target.archivePreparation,
											primaryKey
										});
										if (archiveError) {
											projectedOutcomes.push({
												ok: false,
												error: archiveError
											});
											continue;
										}
									}
									const unreadAck = resolveSessionUnreadAck(existingEntry, target.fullPatch);
									if (unreadAck.kind === "missing") {
										projectedOutcomes.push({
											ok: false,
											error: sessionChangedError(target.key)
										});
										continue;
									}
									if (unreadAck.kind === "stale") {
										const authorizationFailure = params.targets[target.index].commitGuard();
										if (authorizationFailure) {
											projectedOutcomes.push({
												ok: false,
												error: authorizationFailure
											});
											continue;
										}
										projectedOutcomes.push({
											ok: true,
											applied: false,
											entry: unreadAck.entry
										});
										continue;
									}
									const projected = await projectSessionsPatchEntry({
										cfg,
										creation,
										existingEntry,
										isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys),
										storeKey: primaryKey,
										agentId: target.requestedAgentId,
										patch: target.fullPatch,
										archivedBy: archiveActor,
										loadGatewayModelCatalog: () => loadModelCatalog(target.targetAgentId)
									});
									if (!projected.ok) {
										projectedOutcomes.push(projected);
										continue;
									}
									const placementPatchError = resolveSessionWorkerPlacementPatchError({
										agentId: target.targetAgentId,
										cfg,
										context: params.context,
										entry: projected.entry,
										key: target.key,
										patch: target.fullPatch,
										sessionKey: primaryKey,
										validateModelRuntime: true
									});
									if (placementPatchError) {
										projectedOutcomes.push({
											ok: false,
											error: errorShape(ErrorCodes.INVALID_REQUEST, placementPatchError)
										});
										continue;
									}
									const authorizationFailure = params.targets[target.index].commitGuard();
									if (authorizationFailure) {
										projectedOutcomes.push({
											ok: false,
											error: authorizationFailure
										});
										continue;
									}
									const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== primaryKey && workingStore[sessionKey]);
									replacements.push({
										entry: projected.entry,
										previousSessionKeys,
										sessionKey: primaryKey
									});
									const cloned = labelOwners.replaceEntry(candidateKeys, primaryKey, projected.entry);
									projectedOutcomes.push({
										ok: true,
										applied: true,
										entry: cloned
									});
								} catch (error) {
									projectedOutcomes.push({
										ok: false,
										error: unexpectedPatchError(target.key, error)
									});
								}
								return {
									replacements,
									result: projectedOutcomes
								};
							}
						});
						for (const [groupIndex, target] of group.entries()) outcomes[target.index] = groupOutcomes[groupIndex];
					} catch (error) {
						for (const target of group) outcomes[target.index] = {
							ok: false,
							error: unexpectedPatchError(target.key, error)
						};
					}
				}));
			}
		});
	} finally {
		for (const target of prepared) try {
			target.archivePreparation?.drain.release();
		} catch (error) {
			sessionLog.warn(`sessions.patch: archive drain release failed for ${target.canonicalKey}: ${formatErrorMessage(error)}`);
		}
	}
	let patched = false;
	const archivedSessionKeys = /* @__PURE__ */ new Set();
	for (const target of prepared) {
		const outcome = outcomes[target.index];
		if (!outcome?.ok || !outcome.applied) continue;
		triggerSessionPatchHook({
			cfg,
			sessionEntry: outcome.entry,
			sessionKey: target.canonicalKey,
			patch: target.fullPatch
		});
		persistSessionPatchModelSelection({
			cfg,
			callerScopes,
			entry: outcome.entry,
			patch: target.fullPatch,
			sessionKey: target.canonicalKey,
			targetAgentId: target.targetAgentId
		});
		emitSessionsChanged(params.context, {
			sessionKey: target.canonicalKey,
			...target.requestedAgentId ? { agentId: target.requestedAgentId } : {},
			reason: "patch"
		});
		patched = true;
		if (target.fullPatch.archived === true) archivedSessionKeys.add(target.canonicalKey);
	}
	const category = params.patch.category;
	if (patched && typeof category === "string" && category.trim()) {
		if (ensureSessionGroupRegistered(category)) emitSessionsChanged(params.context, { reason: "groups" });
	}
	if (callerCanManageCron && archivedSessionKeys.size > 0) try {
		const disabledBySession = await disableCronJobsBoundToSessions({
			cron: params.context.cron,
			cfg,
			sessionKeys: [...archivedSessionKeys]
		});
		for (const [sessionKey, disabledJobIds] of disabledBySession) if (disabledJobIds.length > 0) sessionLog.info(`sessions.patch: disabled cron jobs bound to archived session ${sessionKey}: ${disabledJobIds.join(", ")}`);
	} catch (error) {
		sessionLog.warn(`sessions.patch: failed to disable cron jobs for archived sessions: ${formatErrorMessage(error)}`);
	}
	return {
		ok: true,
		cfg,
		outcomes,
		preparedByIndex,
		modelCatalogByAgent
	};
}
async function executeSessionPatchMany(params) {
	const executed = await executeSessionPatchMutations({
		client: params.client,
		context: params.context,
		patch: params.patch,
		targets: params.targets.map((target) => ({
			...target,
			commitGuard: createCommitGuard(target.key.trim(), () => params.sessionMutationAuthorization?.assertTargetCurrent({
				sessionKey: target.key.trim(),
				...target.agentId ? { agentId: target.agentId } : {}
			}))
		}))
	});
	if (!executed.ok) return executed;
	const outcomes = [];
	for (const [index, outcome] of executed.outcomes.entries()) {
		const target = params.targets[index];
		if (outcome.ok) {
			outcomes.push(target.agentId ? {
				ok: true,
				key: target.key,
				agentId: target.agentId
			} : {
				ok: true,
				key: target.key
			});
			continue;
		}
		outcomes.push(target.agentId ? {
			ok: false,
			key: target.key,
			agentId: target.agentId,
			error: outcome.error
		} : {
			ok: false,
			key: target.key,
			error: outcome.error
		});
	}
	return {
		ok: true,
		outcomes
	};
}
async function executeSessionPatch(params) {
	const target = {
		key: params.patch.key,
		...params.patch.agentId ? { agentId: params.patch.agentId } : {},
		...params.patch.expectedSessionId !== void 0 ? { expectedSessionId: params.patch.expectedSessionId } : {},
		...params.patch.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: params.patch.expectedLifecycleRevision } : {},
		expectedMarkedUnreadAt: params.patch.expectedMarkedUnreadAt
	};
	const executed = await executeSessionPatchMutations({
		client: params.client,
		context: params.context,
		patch: params.patch,
		targets: [{
			...target,
			commitGuard: createCommitGuard(target.key, params.sessionMutationAuthorization?.assertCurrent)
		}]
	});
	if (!executed.ok) return executed;
	const outcome = executed.outcomes[0];
	if (!outcome.ok) return outcome;
	const prepared = executed.preparedByIndex[0];
	return {
		ok: true,
		result: await projectSessionPatchResult({
			canonicalKey: prepared.canonicalKey,
			cfg: executed.cfg,
			entry: outcome.entry,
			modelCatalogByAgent: executed.modelCatalogByAgent,
			storePath: prepared.storePath,
			targetAgentId: prepared.targetAgentId
		})
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-mutations.ts
const sessionMutationHandlers = {
	"sessions.patchMany": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsPatchManyParams, "sessions.patchMany", respond)) return;
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		if (params.patch.permissionMode === "full" && client !== null && !scopes.includes("operator.admin")) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		const executed = await executeSessionPatchMany({
			client,
			context,
			patch: params.patch,
			sessionMutationAuthorization,
			targets: params.targets
		});
		if (!executed.ok) {
			respond(false, void 0, executed.error);
			return;
		}
		respond(true, { outcomes: executed.outcomes }, void 0);
	},
	"sessions.patch": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsPatchParams, "sessions.patch", respond)) return;
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		if (params.permissionMode === "full" && client !== null && !scopes.includes("operator.admin")) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const executed = await executeSessionPatch({
			client,
			context,
			patch: {
				...params,
				key
			},
			sessionMutationAuthorization
		});
		if (!executed.ok) {
			respond(false, void 0, executed.error);
			return;
		}
		respond(true, executed.result, void 0);
	},
	"sessions.assignOwner": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSessionsAssignOwnerParams, "sessions.assignOwner", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const runtimeAgentId = normalizeOptionalString(client?.internal?.agentRuntimeIdentity?.agentId);
		const agentToolCallerId = client?.internal?.syntheticClient === true ? normalizeOptionalString(client.internal.agentToolCaller?.agentId) : void 0;
		const trustedAgentId = runtimeAgentId ?? agentToolCallerId;
		const humanActor = gatewayClientSessionCreator(client);
		const assignedBy = trustedAgentId ? {
			type: "agent",
			id: trustedAgentId
		} : humanActor ? {
			type: "human",
			id: humanActor.id
		} : null;
		if (!assignedBy) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "sessions.assignOwner requires an identified caller"));
			return;
		}
		const cfg = context.getRuntimeConfig();
		const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const target = resolveSessionSharingTarget({
			cfg,
			sessionKey: key,
			agentId: requestedAgent.agentId
		});
		if (!target) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${key}`));
			return;
		}
		const authorizeView = (candidate) => authorizeIncognitoSessionTarget({
			client,
			sessionKey: key,
			target: candidate
		}) ?? (createSessionListEntryFilter({
			client,
			cfg
		})?.(candidate.storeKey, candidate.entry) === false ? errorShape(ErrorCodes.FORBIDDEN, "session is not visible to this connection") : null);
		const visibilityError = authorizeView(target);
		if (visibilityError) {
			respond(false, void 0, visibilityError);
			return;
		}
		const ownerIdentityById = /* @__PURE__ */ new Map();
		const projectedOwner = projectAssignableSessionOwner(params.owner, ownerIdentityById, cfg);
		if (!projectedOwner) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session owner "${params.owner.id}"`));
			return;
		}
		const owner = {
			type: projectedOwner.type,
			id: projectedOwner.id
		};
		const assignment = assignSessionOwner({
			agentId: target.agentId,
			sessionKey: target.storeKey,
			storePath: target.storePath
		}, {
			owner,
			assignedBy,
			assertCurrent: () => {
				const current = resolveSessionSharingTarget({
					cfg: context.getRuntimeConfig(),
					sessionKey: target.canonicalKey,
					agentId: target.agentId
				});
				const currentError = current ? authorizeView(current) : null;
				if (!current || current.entry.sessionId !== target.entry.sessionId || current.storeKey !== target.storeKey || currentError) throw new SessionMutationAuthorizationChangedError(currentError ?? errorShape(ErrorCodes.INVALID_REQUEST, "session changed before sessions.assignOwner; retry the request"));
			}
		});
		const projectedActor = assignment ? projectAssignableSessionOwner(assignment.actor, ownerIdentityById, cfg) : null;
		const projectedAssignedBy = assignment?.assignedBy ? projectSessionActor(assignment.assignedBy, /* @__PURE__ */ new Map(), cfg) : void 0;
		const projected = assignment && projectedActor ? {
			actor: projectedActor,
			...projectedAssignedBy ? { assignedBy: projectedAssignedBy } : {},
			...assignment.assignedAt !== void 0 ? { assignedAt: assignment.assignedAt } : {}
		} : void 0;
		if (!projected) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${key}`));
			return;
		}
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			owner: projected
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: target.canonicalKey,
			agentId: target.agentId,
			reason: "owner"
		});
	},
	"sessions.pluginPatch": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsPluginPatchParams, "sessions.pluginPatch", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		if (!(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes("operator.admin")) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `sessions.pluginPatch requires gateway scope: ${ADMIN_SCOPE}`));
			return;
		}
		const pluginId = normalizeOptionalString(params.pluginId);
		const namespace = normalizeOptionalString(params.namespace);
		if (!pluginId || !namespace) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "pluginId and namespace are required"));
			return;
		}
		if (params.unset === true && params.value !== void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.pluginPatch cannot specify both unset and value"));
			return;
		}
		if (params.value !== void 0 && !isPluginJsonValue(params.value)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.pluginPatch value must be JSON-compatible"));
			return;
		}
		const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, params.agentId);
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const canonicalKey = resolveStoredSessionKeyForAgentStore({
			cfg: context.getRuntimeConfig(),
			agentId: requestedAgent.agentId,
			sessionKey: key
		});
		const patched = await patchPluginSessionExtension({
			cfg: context.getRuntimeConfig(),
			sessionKey: canonicalKey,
			agentId: requestedAgent.agentId,
			pluginId,
			namespace,
			value: params.value,
			unset: params.unset === true,
			assertCurrent: sessionMutationAuthorization?.assertCurrent
		});
		if (!patched.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, patched.error));
			return;
		}
		respond(true, {
			ok: true,
			key: patched.key,
			value: patched.value
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: patched.key,
			agentId: requestedAgent.agentId,
			reason: "plugin-patch"
		});
	},
	"sessions.reset": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsResetParams, "sessions.reset", respond)) return;
		const p = params;
		const key = requireSessionKey(p.key, respond);
		if (!key) return;
		const reason = p.reason === "new" ? "new" : "reset";
		const { performGatewaySessionReset } = await loadSessionsRuntimeModule();
		const result = await performGatewaySessionReset({
			key,
			...p.agentId ? { agentId: p.agentId } : {},
			reason,
			commandSource: "gateway:sessions.reset",
			creation: resolveOperatorSessionCreation(client),
			...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
			...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
			authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
			armSessionDiffBaselineCapture: true,
			workerPlacementContext: context,
			assertAuthorizedInstance: sessionMutationAuthorization?.assertCurrent
		});
		if (!result.ok) {
			respond(false, void 0, result.error);
			return;
		}
		if ("incognitoDeleted" in result) {
			respond(true, {
				ok: true,
				key: result.key,
				deleted: true
			}, void 0);
			emitSessionsChanged(context, {
				sessionKey: result.key,
				reason: "delete"
			});
			return;
		}
		respond(true, {
			ok: true,
			key: result.key,
			entry: result.entry,
			resolved: result.resolved
		}, void 0);
		emitSessionsChanged(context, {
			sessionKey: result.key,
			agentId: result.agentId,
			reason
		});
	}
};
//#endregion
export { sessionMutationHandlers };
