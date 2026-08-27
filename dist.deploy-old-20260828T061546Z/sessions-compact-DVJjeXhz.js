import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { O as resolveSessionAuthProfileOverrideSource } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { o as normalizeReasoningLevel, s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Or as validateSessionsCompactParams } from "./src-4dv5TpeQ.js";
import { l as isCompetingSessionWorkAdmissionActive, p as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BtKN0pjk.js";
import { O as selectSessionTranscriptTreePathNodes, T as scanSessionTranscriptTree } from "./session-transcript-index-_z9fjL8c.js";
import { E as trimSessionTranscriptForManualCompact, T as preflightSessionTranscriptForManualCompact, mt as clearAllCliSessions, w as resolveSessionTranscriptRuntimeTarget, xt as applySessionPatchProjection } from "./session-accessor-fcDZuc2H.js";
import { A as readTranscriptStatsSync, b as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import { l as recordSessionCompacted } from "./session-state-events-DvygRPJJ.js";
import "./sessions-BI8dPUCI.js";
import { s as resolveSessionWorkStartError, t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON } from "./lifecycle-B13mO5hL.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { s as preflightManualSessionCompaction } from "./sessions-BLpYW515.js";
import { r as isIndexedSessionEntry } from "./session-manager-codec-CANcDH2n.js";
import "./thinking-DLPyZXEW.js";
import { n as resolveManualCompactionCliTarget } from "./session-runtime-compat-CuMcNwkW.js";
import { a as getCommandLaneSnapshot } from "./command-queue-CBS1Vl32.js";
import { n as resolveSessionModelRef } from "./session-model-ref-Dc9mG8e_.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { f as resolveGatewaySessionStoreTargetWithStore, o as resolveCanonicalGatewaySessionStoreKey } from "./session-utils-store-Dmx2MxPy.js";
import { s as hasPendingFollowupQueueWork } from "./settings-CxUlx8Vr.js";
import "./session-utils-uVsFjoXC.js";
import "./cli-session-CCYUcdz9.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-CcwhpB50.js";
import { n as compactEmbeddedAgentSession } from "./embedded-agent-uA4hl59E.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CJd39CY4.js";
import { n as emitSessionsChanged } from "./session-change-event-Cjm468kd.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { c as requireSessionKey, i as loadAccessorSessionEntryForGatewayTarget, t as emitSessionOperation } from "./sessions-shared-DVKJTkd0.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-compaction-runner.ts
function usesLegacyOpenClawCompaction(params) {
	const persistedRuntime = resolveManualCompactionCliTarget({
		provider: resolveSessionModelRef(params.cfg, params.entry, params.agentId).provider,
		entry: params.entry,
		cfg: params.cfg
	}).agentHarnessId;
	const contextEngine = params.cfg.plugins?.slots?.contextEngine?.trim();
	return (!persistedRuntime || persistedRuntime === "openclaw") && (!contextEngine || contextEngine === "legacy");
}
async function resolveGatewayCompactionTranscriptTarget(params) {
	return await resolveSessionTranscriptRuntimeTarget({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionStoreKey,
		storePath: params.storePath
	});
}
/** Returns only definitive legacy-runtime no-op verdicts; other runtimes decide for themselves. */
async function preflightGatewaySessionCompaction(params) {
	if (!usesLegacyOpenClawCompaction(params)) return;
	try {
		const tree = scanSessionTranscriptTree(await loadTranscriptEvents({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionStoreKey,
			storePath: params.storePath
		}));
		const preflight = preflightManualSessionCompaction(selectSessionTranscriptTreePathNodes(tree, tree.leafId).map((node) => node.entry).filter(isIndexedSessionEntry), {
			enabled: true,
			reserveTokens: 0,
			keepRecentTokens: 0
		});
		return preflight.compactable ? void 0 : { reason: preflight.reason };
	} catch {
		return;
	}
}
async function runGatewaySessionCompaction(params) {
	const transcriptTarget = await resolveGatewayCompactionTranscriptTarget(params);
	const resolvedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
	const workspaceDir = resolveIngressWorkspaceOverrideForSessionRun({
		spawnedBy: params.entry.spawnedBy,
		workspaceDir: params.entry.spawnedWorkspaceDir,
		cwd: params.entry.spawnedCwd
	}) ?? resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const compactionCliTarget = resolveManualCompactionCliTarget({
		provider: resolvedModel.provider,
		entry: params.entry,
		cfg: params.cfg
	});
	return await compactEmbeddedAgentSession({
		contextEngineAgentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		sessionTarget: {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		allowGatewaySubagentBinding: true,
		sessionFile: transcriptTarget.sessionKey,
		workspaceDir,
		cwd: normalizeOptionalString(params.entry.spawnedCwd),
		config: params.cfg,
		provider: resolvedModel.provider,
		model: resolvedModel.model,
		authProfileId: compactionCliTarget.cliSessionBinding?.authProfileId ?? params.entry.authProfileOverride,
		authProfileIdSource: resolveSessionAuthProfileOverrideSource(params.entry),
		agentHarnessId: compactionCliTarget.agentHarnessId,
		cliSessionId: compactionCliTarget.cliSessionId,
		cliSessionBinding: compactionCliTarget.cliSessionBinding,
		sessionEntry: params.entry,
		modelSelectionLocked: params.entry.modelSelectionLocked === true,
		thinkLevel: normalizeThinkLevel(params.entry.thinkingLevel),
		reasoningLevel: normalizeReasoningLevel(params.entry.reasoningLevel),
		bashElevated: {
			enabled: false,
			allowed: false,
			defaultLevel: "off"
		},
		trigger: "manual"
	});
}
//#endregion
//#region src/gateway/server-methods/sessions-compact.ts
const sessionCompactHandlers = { "sessions.compact": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateSessionsCompactParams, "sessions.compact", respond)) return;
	const p = params;
	const key = requireSessionKey(p.key, respond);
	if (!key) return;
	const maxLines = typeof p.maxLines === "number" && Number.isFinite(p.maxLines) ? Math.max(1, Math.floor(p.maxLines)) : void 0;
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const compatibilityDefaultAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key,
		exactRead: true,
		...requestedAgentId ? { agentId: requestedAgentId } : {}
	});
	const storePath = target.storePath;
	let compactPrimaryKey = target.canonicalKey;
	const compactRead = await applySessionPatchProjection({
		agentId: target.agentId,
		sessionKeys: target.storeKeys,
		storePath,
		resolveTarget: ({ store }) => {
			const { target: migratedTarget, primaryKey } = resolveCanonicalGatewaySessionStoreKey({
				cfg,
				key,
				store,
				agentId: requestedAgentId
			});
			compactPrimaryKey = primaryKey;
			return {
				primaryKey,
				candidateKeys: migratedTarget.storeKeys
			};
		},
		project: ({ existingEntry }) => existingEntry ? {
			ok: true,
			entry: existingEntry
		} : { ok: false }
	});
	const compactTarget = {
		entry: compactRead.ok ? compactRead.entry : void 0,
		primaryKey: compactPrimaryKey
	};
	const entry = compactTarget.entry;
	const sessionId = entry?.sessionId;
	if (!sessionId) {
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			compacted: false,
			reason: "no sessionId"
		}, void 0);
		return;
	}
	if (maxLines !== void 0) {
		const trimPreflight = await preflightSessionTranscriptForManualCompact({
			sessionId,
			storePath,
			sessionKey: compactTarget.primaryKey,
			agentId: target.agentId
		}, { maxLines });
		if (!trimPreflight.compacted) {
			respond(true, {
				ok: true,
				key: target.canonicalKey,
				compacted: false,
				..."kept" in trimPreflight ? { kept: trimPreflight.kept } : { reason: "no transcript" }
			}, void 0);
			return;
		}
	} else if (readTranscriptStatsSync({
		agentId: target.agentId,
		sessionId,
		sessionKey: compactTarget.primaryKey,
		storePath
	}).eventCount === 0) {
		respond(true, {
			ok: true,
			key: target.canonicalKey,
			compacted: false,
			reason: "no transcript"
		}, void 0);
		return;
	}
	const lifecycleRevision = entry.lifecycleRevision;
	const queueIdentities = [
		key,
		target.canonicalKey,
		compactTarget.primaryKey,
		sessionId
	];
	const lifecycleIdentities = [...queueIdentities, lifecycleRevision];
	let sessionStillCurrent = true;
	let compactionNoopReason;
	let blockedByActiveRun = false;
	let blockedByQueuedWork = false;
	try {
		await runExclusiveSessionLifecycleMutation({
			scope: storePath,
			identities: lifecycleIdentities,
			kind: "compaction",
			prepare: async () => {
				const latestEntry = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgentId
				}).entry;
				if (!latestEntry || latestEntry.sessionId !== sessionId || latestEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, latestEntry)) {
					sessionStillCurrent = false;
					return;
				}
				if (maxLines === void 0) {
					compactionNoopReason = (await preflightGatewaySessionCompaction({
						cfg,
						entry: latestEntry,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactTarget.primaryKey,
						storePath
					}))?.reason;
					if (compactionNoopReason) return;
				}
				blockedByActiveRun = isCompetingSessionWorkAdmissionActive(storePath, lifecycleIdentities) || (asWorkerInferenceControl(context.workerEnvironmentService)?.hasInferenceForSession(sessionId) ?? false) || resolveVisibleActiveSessionRunState({
					context,
					requestedKey: key,
					canonicalKey: target.canonicalKey,
					sessionId,
					agentId: requestedAgentId,
					defaultAgentId: compatibilityDefaultAgentId
				}).active;
				blockedByQueuedWork = hasPendingFollowupQueueWork(queueIdentities) || queueIdentities.some((identity) => getCommandLaneSnapshot(resolveEmbeddedSessionLane(identity)).queuedCount > 0);
			},
			run: async () => {
				if (!sessionStillCurrent) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				if (compactionNoopReason) {
					respond(true, {
						ok: false,
						key: target.canonicalKey,
						compacted: false,
						reason: compactionNoopReason
					}, void 0);
					return;
				}
				if (blockedByQueuedWork) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} has queued work; retry after it finishes.`));
					return;
				}
				if (blockedByActiveRun) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} has an active run; retry after it finishes.`));
					return;
				}
				const latestEntry = loadAccessorSessionEntryForGatewayTarget({
					key,
					cfg,
					agentId: requestedAgentId
				}).entry;
				if (!latestEntry || latestEntry.sessionId !== sessionId || latestEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, latestEntry)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before compaction. Retry.`, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
					return;
				}
				const operationId = randomUUID();
				if (maxLines !== void 0) {
					const trimResult = await trimSessionTranscriptForManualCompact({
						sessionId,
						storePath,
						sessionKey: compactTarget.primaryKey,
						agentId: target.agentId
					}, { maxLines });
					respond(true, {
						ok: true,
						key: target.canonicalKey,
						compacted: trimResult.compacted,
						...trimResult.compacted ? { kept: trimResult.kept } : "kept" in trimResult ? { kept: trimResult.kept } : { reason: "no transcript" }
					}, void 0);
					if (trimResult.compacted) {
						recordSessionCompacted({
							sessionKey: target.canonicalKey,
							operationId,
							sessionId,
							agentId: target.agentId ?? requestedAgentId
						});
						emitSessionsChanged(context, {
							sessionKey: target.canonicalKey,
							agentId: target.agentId,
							reason: "compact",
							compacted: true
						});
					}
					return;
				}
				if (readTranscriptStatsSync({
					agentId: target.agentId,
					sessionId,
					sessionKey: compactTarget.primaryKey,
					storePath
				}).eventCount === 0) {
					respond(true, {
						ok: true,
						key: target.canonicalKey,
						compacted: false,
						reason: "no transcript"
					}, void 0);
					return;
				}
				emitSessionOperation(context, {
					operationId,
					operation: "compact",
					phase: "start",
					sessionKey: target.canonicalKey,
					agentId: target.agentId
				});
				const emitCompactionEnd = (completed, reason) => emitSessionOperation(context, {
					operationId,
					operation: "compact",
					phase: "end",
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					completed,
					reason
				});
				let result;
				try {
					result = await runGatewaySessionCompaction({
						cfg,
						entry: latestEntry,
						agentId: target.agentId,
						sessionId,
						sessionKey: target.canonicalKey,
						sessionStoreKey: compactTarget.primaryKey,
						storePath
					});
				} catch (err) {
					emitCompactionEnd(false, formatErrorMessage(err));
					throw err;
				}
				if (result.ok && result.compacted) {
					let persisted;
					try {
						persisted = (await applySessionPatchProjection({
							agentId: target.agentId,
							sessionKeys: [compactTarget.primaryKey],
							storePath,
							resolveTarget: () => ({ primaryKey: compactTarget.primaryKey }),
							project: ({ existingEntry }) => {
								if (!existingEntry || existingEntry.sessionId !== sessionId || existingEntry.lifecycleRevision !== lifecycleRevision || resolveSessionWorkStartError(target.canonicalKey, existingEntry)) return { ok: false };
								const entryToUpdate = existingEntry;
								entryToUpdate.updatedAt = Date.now();
								entryToUpdate.compactionCount = Math.max(0, entryToUpdate.compactionCount ?? 0) + 1;
								if (result.compactionKind === "context-engine") clearAllCliSessions(entryToUpdate);
								if (result.result?.sessionId && result.result.sessionId !== entryToUpdate.sessionId) entryToUpdate.sessionId = result.result.sessionId;
								delete entryToUpdate.inputTokens;
								delete entryToUpdate.outputTokens;
								delete entryToUpdate.contextBudgetStatus;
								if (typeof result.result?.tokensAfter === "number" && Number.isFinite(result.result.tokensAfter)) {
									entryToUpdate.totalTokens = result.result.tokensAfter;
									entryToUpdate.totalTokensFresh = true;
									entryToUpdate.totalTokensVersion = 1;
								} else {
									delete entryToUpdate.totalTokens;
									delete entryToUpdate.totalTokensFresh;
									delete entryToUpdate.totalTokensVersion;
								}
								return {
									ok: true,
									entry: entryToUpdate
								};
							}
						})).ok;
					} catch (err) {
						emitCompactionEnd(false, formatErrorMessage(err));
						throw err;
					}
					if (!persisted) {
						const reason = `Session ${key} changed before compaction completed. Retry.`;
						emitCompactionEnd(false, reason);
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, reason, { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } }));
						return;
					}
					recordSessionCompacted({
						sessionKey: target.canonicalKey,
						operationId,
						sessionId: result.result?.sessionId ?? sessionId,
						agentId: target.agentId ?? requestedAgentId
					});
				}
				emitCompactionEnd(result.ok && result.compacted, result.reason);
				respond(true, {
					ok: result.ok,
					key: target.canonicalKey,
					compacted: result.compacted,
					reason: result.reason,
					result: result.result
				}, void 0);
				if (result.ok) emitSessionsChanged(context, {
					sessionKey: target.canonicalKey,
					agentId: target.agentId,
					reason: "compact",
					compacted: result.compacted
				});
			}
		});
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
	}
} };
//#endregion
export { sessionCompactHandlers };
