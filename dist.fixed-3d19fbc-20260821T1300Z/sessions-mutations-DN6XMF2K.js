import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./fs-safe-X_oyl7Rx.js";
import { r as withTimeout } from "./timing-DpgMro2Q.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { j as patchPluginSessionExtension } from "./loader-BIAS8vL1.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Cc0gbvo8.js";
import { Tt as SessionLabelOwnerIndex, jt as applySessionEntryCanonicalReplacements, vn as isInternalSessionEffectsKey } from "./session-accessor-CIiPoGwM.js";
import { K as interruptSessionWorkAdmissions, R as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, X as runExclusiveSessionLifecycleMutation, m as resolveMissingAgentHarnessSessionError, q as isCompetingSessionWorkAdmissionActive } from "./agent-harness-session-key-BpWapmwX.js";
import { Xr as validateSessionsPatchParams, Yr as validateSessionsPatchManyParams, Zr as validateSessionsPluginPatchParams, ti as validateSessionsResetParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { b as waitForReplyRunEndBySessionId, c as isReplyRunActiveForSessionId, n as abortReplyRunBySessionId, p as replyRunRegistry } from "./reply-run-registry-Bzalc5xR.js";
import { D as waitForEmbeddedAgentRunEnd, d as isEmbeddedAgentRunInProgress, n as abortEmbeddedAgentRun } from "./runs-CQbSP9aq.js";
import { t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-4IbI4BFl.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-D3R4yOqT.js";
import { n as projectSessionPatchResult } from "./session-utils-model-D6D0SFax.js";
import { N as resolveGatewaySessionStoreTargetWithStore, O as resolveCanonicalGatewaySessionStoreKey, g as disableCronJobsBoundToSessions, k as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-row-xwseApeF.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId, t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { o as hasPendingFollowupQueueWork } from "./state-DyigdfFK.js";
import "./session-utils-DvNvk7rk.js";
import { o as getCommandLaneSnapshot } from "./command-queue-B992TXUy.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { t as clearSessionQueues } from "./cleanup-CfiPPrwM.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-CGO8FDDk.js";
import { p as waitForChatAbortControllerRemoval } from "./chat-abort-9K8jqLDL.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-DIFuSi8s.js";
import { r as prepareSessionWorkerPlacementForArchive } from "./session-placement-lifecycle-BZjFQ_8W.js";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-C6snQDwt.js";
import { t as SessionMutationAuthorizationChangedError, v as gatewayClientSessionCreator } from "./session-sharing-YSn98RD0.js";
import { n as emitSessionsChanged } from "./session-change-event-XKNRoRWi.js";
import { i as hasGatewaySessionAbortOwner, r as createChatAbortOps, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-Coi0Aqat.js";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CX5dCIoC.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { d as resolveSessionWorkerPlacementPatchError, l as requireSessionKey, p as sessionLog, r as isAgentMainSessionKey, s as loadSessionsRuntimeModule } from "./sessions-shared-D_8AKVeN.js";
import { t as projectSessionsPatchEntry } from "./sessions-patch-Q97GzluN.js";
import { n as ensureSessionGroupRegistered } from "./session-groups-D0pNbqai.js";
import { t as appendSessionAudit } from "./session-audit-CV4hulLj.js";
import { t as beginWorkerInferenceSessionDrain } from "./inference-control-internal-CQh2JfZC.js";
//#region src/gateway/server-methods/sessions-archive-lifecycle.ts
function asArchiveInferenceDrainService(value) {
	if (typeof value !== "object" || value === null) return;
	return typeof value.beginInferenceSessionDrain === "function" ? value : void 0;
}
function hasAuthoritativeSessionWork(params, workerDrain, workIdentities) {
	const sessionId = params.sessionId;
	return isCompetingSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || params.sessionKeys.some((key) => replyRunRegistry.isActive(key)) || Boolean(sessionId && isReplyRunActiveForSessionId(sessionId)) || Boolean(sessionId && isEmbeddedAgentRunInProgress(sessionId)) || hasPendingFollowupQueueWork(workIdentities) || workIdentities.some((key) => getCommandLaneSnapshot(resolveEmbeddedSessionLane(key)).queuedCount > 0) || hasGatewaySessionAbortOwner({
		context: params.context,
		sessionKeys: params.sessionKeys,
		sessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	}) || Boolean(sessionId && params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId)?.turnClaim) || workerDrain?.hasWork() === true;
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
	if (params.sessionId) {
		workerDrain = beginWorkerInferenceSessionDrain(workerService, params.sessionId) ?? asArchiveInferenceDrainService(workerService)?.beginInferenceSessionDrain(params.sessionId);
		if (!workerDrain && workerControl?.hasInferenceForSession(params.sessionId) === true) throw new Error("Worker inference drain is unavailable");
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
		if (!(await Promise.all([
			controllerDrain,
			admittedWork,
			replyWork,
			embeddedWork,
			placementWork,
			workerWork
		])).every(Boolean)) throw new Error("Session work did not fully drain before archive");
		await prepareSessionWorkerPlacementForArchive({
			...params,
			reclaimActive: true
		});
		return {
			release: () => workerDrain?.release(),
			hasAuthoritativeWork: () => hasAuthoritativeSessionWork(params, workerDrain, workIdentities)
		};
	} catch (error) {
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
	if (typeof params.patch.model !== "string" || !params.callerScopes.includes("operator.admin") || params.entry.modelOverrideSource !== "user" || !params.entry.providerOverride || !params.entry.modelOverride) return;
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	persistStickyModelSelectionBestEffort({
		agentId,
		model: `${resolved.provider}/${resolved.model}`
	});
}
//#endregion
//#region src/gateway/server-methods/sessions-patch-engine.ts
function unexpectedPatchError(key, error) {
	sessionLog.warn(`sessions.patch: target failed for ${key}: ${formatErrorMessage(error)}`);
	return errorShape(ErrorCodes.UNAVAILABLE, "Session patch failed unexpectedly. Retry the request.", { retryable: true });
}
function sessionChangedError(key) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } });
}
function pluginOwnershipError(params) {
	return resolvePluginSessionOwnershipError({
		action: "patch",
		entry: params.entry,
		key: params.key,
		pluginOwnerId: params.client?.internal?.pluginRuntimeOwnerId
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
	const cfg = params.context.getRuntimeConfig();
	const archiveActor = gatewayClientSessionCreator(params.client);
	const callerScopes = Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : [];
	const callerCanManageCron = params.client === null || callerScopes.includes("operator.admin");
	const pluginOwnerId = params.client?.internal?.pluginRuntimeOwnerId;
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
		const ownershipError = pluginOwnershipError({
			client: params.client,
			entry: initialEntry,
			key: canonicalKey
		});
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
									const candidateKeys = currentTarget.storeKeys;
									const ownershipError = pluginOwnershipError({
										client: params.client,
										entry: existingEntry,
										key: primaryKey
									});
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
									const wasArchivedBeforePatch = existingEntry?.archivedAt !== void 0;
									const projected = await projectSessionsPatchEntry({
										cfg,
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
										archiveStateChanged: typeof target.fullPatch.archived === "boolean" && wasArchivedBeforePatch !== (cloned.archivedAt !== void 0),
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
				for (const target of prepared) {
					const outcome = outcomes[target.index];
					if (!outcome?.ok || !archiveActor) continue;
					if (!outcome.archiveStateChanged) continue;
					const action = outcome.entry.archivedAt === void 0 ? "unarchived" : "archived";
					try {
						await appendSessionAudit({
							cfg,
							target: {
								agentId: target.targetAgentId,
								entry: outcome.entry,
								sessionKey: target.canonicalKey,
								storePath: target.storePath
							},
							text: `${action} by ${archiveActor.label ?? archiveActor.id}`,
							now: Date.now()
						});
					} catch (error) {
						sessionLog.warn(`sessions.patch: ${action} audit note failed for ${target.canonicalKey}; archive kept: ${formatErrorMessage(error)}`);
					}
				}
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
		if (!outcome?.ok) continue;
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
		...params.patch.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: params.patch.expectedLifecycleRevision } : {}
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
		const canonicalParams = { ...params };
		delete canonicalParams.icon;
		const key = requireSessionKey(canonicalParams.key, respond);
		if (!key) return;
		const executed = await executeSessionPatch({
			client,
			context,
			patch: {
				...canonicalParams,
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
			authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
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
