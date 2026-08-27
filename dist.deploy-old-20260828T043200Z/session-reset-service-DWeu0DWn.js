import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { E as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { c as interruptSessionWorkAdmissions, p as runExclusiveSessionLifecycleMutation, s as hasOnlySessionLifecycleMutationKindActive, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, u as isSessionLifecycleMutationActive } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { st as buildSessionCreationStamp } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { v as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { mt as clearAllCliSessions, vt as rebindCliSessionReseedReceiptsForReset } from "./session-accessor-B-FKZX9M.js";
import { m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-Bf-Q9dw5.js";
import { n as deleteSessionEntryLifecycle, r as resetSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-DeUgE0mJ.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-DCSDDfZL.js";
import { a as handleSessionStateSessionDeleted, o as handleSessionStateSessionReset, u as recordSessionCreated } from "./session-state-events-BkuyPMaw.js";
import "./sessions-CdrF1uzY.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-DzPMUp4j.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { i as resetRegisteredAgentHarnessSessions } from "./registry-lPXwErEe.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CWpWIBkz.js";
import { o as tryPrepareFreshManagerRuntimeSession, t as getAcpSessionManager } from "./manager-CHj5wRbh.js";
import { t as getSessionBindingService } from "./session-binding-service-B0hkzhLM.js";
import { t as getAcpRuntimeBackend } from "./registry-DK6sb9wH.js";
import { c as writeAcpSessionMetaForMigration, r as readAcpSessionMeta, s as upsertAcpSessionMeta } from "./session-meta-BgX5x3e6.js";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks--fsrYuTN.js";
import { n as clearBootstrapSnapshotOnSessionBoundary, t as clearBootstrapSnapshot } from "./bootstrap-cache-B5sBKdmh.js";
import { a as isModelSelectionLocked, n as MODEL_SELECTION_LOCKED_RESET_MESSAGE } from "./model-overrides-BcLzAaaZ.js";
import { o as readSessionMessagesAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { r as archiveSessionTranscriptsDetailed, s as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-BR7phvyf.js";
import { n as resolveSessionModelRef } from "./session-model-ref-BtF53_Cz.js";
import { n as projectPublicSessionEntry } from "./session-entry-projection-CWfZj8nO.js";
import { d as resolveGatewaySessionStoreTarget, r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import "./cli-session-JwnBWNOs.js";
import { a as retireSessionWorkerPlacementBeforeMutation, r as resolveSessionWorkerPlacementMutationError } from "./session-placement-lifecycle-SteNC2br.js";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-cimPfxF5.js";
import { a as buildSessionStartHookPayload, i as buildSessionEndHookPayload, r as noteActiveSessionForShutdown, t as forgetActiveSessionForShutdown } from "./active-sessions-shutdown-tracker-NctYi_BN.js";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.js";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-qFybcCBn.js";
import { n as hasSessionAutoResetListeners, r as isSessionAutoResetReason, t as emitSessionAutoResetHook } from "./session-auto-reset-Cb1X1lJp.js";
import { t as clearSessionResetRuntimeState } from "./session-reset-cleanup-BFt4o8b5.js";
import { r as stopSubagentsForRequester } from "./abort-Dq5wq9cm.js";
import { a as resolveCreatorSandbox, t as authorizeGatewaySessionCreation } from "./operator-role-policy-Bvt-UeJ1.js";
import { l as managedWorktrees } from "./service-P2Ot4H_g.js";
import { n as runPluginHostCleanup } from "./host-hook-cleanup-D0OoG1KX.js";
import { t as rollbackGatewaySessionPreparation } from "./session-lifecycle-preparation-DmXI5toe.js";
import { t as resolvePluginSessionOwnershipError } from "./session-plugin-ownership-Dk6fjq2Z.js";
import { t as notifyGatewaySessionReset } from "./session-reset-notifications-DgKdsPPS.js";
import { randomUUID } from "node:crypto";
import { cleanupSessionResources } from "@openclaw/ai/internal/runtime";
//#region src/gateway/session-child-sessions.ts
/** Returns true when a session store row is a direct child of the parent key. */
function isDirectChildSessionEntry(params) {
	const parentKey = normalizeOptionalString(params.parentKey);
	if (!parentKey || params.sessionKey === parentKey || !params.entry) return false;
	return normalizeOptionalString(params.entry.spawnedBy) === parentKey || normalizeOptionalString(params.entry.parentSessionKey) === parentKey;
}
/** Finds direct child sessions for a parent session across the combined gateway store. */
function findDirectChildSessionsForParent(params) {
	const { store } = loadCombinedSessionStoreForGatewayCore(params.cfg);
	return Object.entries(store).filter(([sessionKey, entry]) => isDirectChildSessionEntry({
		sessionKey,
		entry,
		parentKey: params.parentKey
	})).map(([sessionKey, entry]) => ({
		sessionKey,
		entry
	}));
}
//#endregion
//#region src/gateway/session-reset-service.ts
function resolveLifecycleAgentId(cfg, agentId) {
	return normalizeAgentId(agentId ?? resolveAmbientOwnerAgentId(cfg));
}
const mcpRunEndWatcherState = resolveGlobalSingleton(Symbol.for("openclaw.mcpRunEndWatchers"), () => ({
	cancellations: /* @__PURE__ */ new Map(),
	retirements: /* @__PURE__ */ new Set(),
	watchers: /* @__PURE__ */ new Map()
}), async (state) => {
	for (const cancel of state.cancellations.values()) cancel();
	await Promise.allSettled([...state.watchers.values(), ...state.retirements]);
	state.cancellations.clear();
	state.retirements.clear();
	state.watchers.clear();
});
const mcpRunEndWatchers = mcpRunEndWatcherState.watchers;
const ACP_RUNTIME_CLEANUP_TIMEOUT_MS = 15e3;
function archiveSessionTranscriptsForSessionDetailed(params) {
	if (!params.sessionId || params.incognito === true) return [];
	return archiveSessionTranscriptsDetailed({
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId,
		reason: params.reason,
		onArchiveError: params.onArchiveError
	});
}
function emitGatewaySessionEndPluginHook(params) {
	if (!params.sessionId) return;
	forgetActiveSessionForShutdown(params.sessionId);
	const hookRunner = getGlobalHookRunner();
	const shouldEmitAutoReset = isSessionAutoResetReason(params.reason) && hasSessionAutoResetListeners();
	const shouldEmitPluginHook = hookRunner?.hasHooks("session_end") === true;
	if (!shouldEmitAutoReset && !shouldEmitPluginHook) return;
	const transcript = resolveStableSessionEndTranscript({
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId,
		archivedTranscripts: params.archivedTranscripts
	});
	if (shouldEmitAutoReset) emitSessionAutoResetHook({
		cfg: params.cfg,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		reason: params.reason,
		sessionFile: transcript.sessionFile,
		transcriptArchived: transcript.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		storePath: params.storePath
	});
	if (!shouldEmitPluginHook) return;
	if (!hookRunner) return;
	const payload = buildSessionEndHookPayload({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		reason: params.reason,
		sessionFile: transcript.sessionFile,
		transcriptArchived: transcript.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey
	});
	runWithGatewayIndependentRootWorkContinuation(async () => {
		await hookRunner.runSessionEnd(payload.event, payload.context);
	}).catch((err) => {
		logVerbose(`session_end hook failed: ${String(err)}`);
	});
}
function emitGatewaySessionStartPluginHook(params) {
	if (!params.sessionId) return;
	if (params.storePath) noteActiveSessionForShutdown({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		agentId: params.agentId
	});
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("session_start")) return;
	const payload = buildSessionStartHookPayload({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		resumedFrom: params.resumedFrom
	});
	runWithGatewayIndependentRootWorkContinuation(async () => {
		await hookRunner.runSessionStart(payload.event, payload.context);
	}).catch((err) => {
		logVerbose(`session_start hook failed: ${String(err)}`);
	});
}
async function emitSessionUnboundLifecycleEvent(params) {
	const targetKind = isSubagentSessionKey(params.targetSessionKey) ? "subagent" : "acp";
	await getSessionBindingService().unbind({
		targetSessionKey: params.targetSessionKey,
		reason: params.reason
	});
	if (params.emitHooks === false) return;
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("subagent_ended")) return;
	await hookRunner.runSubagentEnded({
		targetSessionKey: params.targetSessionKey,
		targetKind,
		reason: params.reason,
		sendFarewell: true,
		outcome: params.reason === "session-reset" ? "reset" : "deleted"
	}, { childSessionKey: params.targetSessionKey });
}
async function ensureSessionRuntimeCleanup(params) {
	const [embeddedAgent, mcpTools, { clearFinishedSessionsForScopes }] = await Promise.all([
		import("./embedded-agent-DjHmTlnD.js"),
		import("./agent-bundle-mcp-tools-DVMGaqLt.js"),
		import("./bash-process-registry-BUSdWF8r.js")
	]);
	params.assertCurrent?.();
	const closeTrackedBrowserTabs = async () => {
		params.assertCurrent?.();
		const closeKeys = /* @__PURE__ */ new Set([
			params.key,
			params.target.canonicalKey,
			...params.target.storeKeys,
			params.sessionId ?? ""
		]);
		await cleanupBrowserSessionsForLifecycleEnd({
			cfg: params.cfg,
			sessionKeys: [...closeKeys],
			onWarn: (message) => logVerbose(message)
		});
		params.assertCurrent?.();
	};
	params.assertCurrent?.();
	const queueKeys = new Set(params.target.storeKeys);
	queueKeys.add(params.target.canonicalKey);
	if (params.sessionId) queueKeys.add(params.sessionId);
	const processScopeKeys = new Set(queueKeys);
	processScopeKeys.add(params.key);
	clearFinishedSessionsForScopes(processScopeKeys);
	clearSessionResetRuntimeState([...queueKeys], {
		activeReplySessionId: params.sessionId,
		agentId: resolveLifecycleAgentId(params.cfg, params.target.agentId)
	});
	await stopSubagentsForRequester({
		cfg: params.cfg,
		requesterSessionKey: params.target.canonicalKey
	});
	if (!params.sessionId) {
		params.assertCurrent?.();
		clearBootstrapSnapshot(params.target.canonicalKey);
		await closeTrackedBrowserTabs();
		return;
	}
	const sessionId = params.sessionId;
	params.assertCurrent?.();
	const cleanupProviderResources = () => {
		try {
			cleanupSessionResources(sessionId);
		} catch (error) {
			logVerbose(`sessions cleanup: failed to dispose provider resources for ${sessionId}: ${String(error)}`);
		}
	};
	const retireMcpRuntime = async (retainAcrossReuse) => {
		await mcpTools.retireSessionMcpRuntime({
			sessionId,
			reason: "gateway-session-cleanup",
			preserveActiveLeases: true,
			retainAcrossReuse,
			onError: (error, retiredSessionId) => {
				logVerbose(`sessions cleanup: failed to dispose bundle MCP runtime for ${retiredSessionId}: ${String(error)}`);
			}
		});
	};
	const ensureMcpRetirementWatcher = () => {
		return getOrCreatePromise(mcpRunEndWatchers, sessionId, async () => {
			let cancelWatcher = () => {};
			const cancelled = new Promise((resolve) => {
				cancelWatcher = () => resolve(false);
			});
			mcpRunEndWatcherState.cancellations.set(sessionId, cancelWatcher);
			try {
				while (await Promise.race([embeddedAgent.waitForEmbeddedAgentRunEnd(sessionId, null), cancelled])) {
					if (embeddedAgent.isEmbeddedAgentRunActive(sessionId)) continue;
					const retirement = retireMcpRuntime(false);
					mcpRunEndWatcherState.retirements.add(retirement);
					try {
						await retirement;
					} finally {
						mcpRunEndWatcherState.retirements.delete(retirement);
					}
					if (embeddedAgent.isEmbeddedAgentRunActive(sessionId)) continue;
					cleanupProviderResources();
					return;
				}
			} catch (error) {
				logVerbose(`sessions cleanup: failed to disarm deferred MCP retirement: ${String(error)}`);
			} finally {
				if (mcpRunEndWatcherState.cancellations.get(sessionId) === cancelWatcher) mcpRunEndWatcherState.cancellations.delete(sessionId);
			}
		}, { evictOnSettled: true });
	};
	const mcpRetirementWatcher = ensureMcpRetirementWatcher();
	embeddedAgent.abortEmbeddedAgentRun(sessionId);
	await retireMcpRuntime(true);
	const ended = await embeddedAgent.waitForEmbeddedAgentRunEnd(sessionId, 15e3);
	params.assertCurrent?.();
	await retireMcpRuntime(!ended);
	params.assertCurrent?.();
	clearBootstrapSnapshot(params.target.canonicalKey);
	if (ended && !embeddedAgent.isEmbeddedAgentRunActive(sessionId)) {
		params.assertCurrent?.();
		mcpRunEndWatcherState.cancellations.get(sessionId)?.();
		await mcpRetirementWatcher;
		cleanupProviderResources();
		await closeTrackedBrowserTabs();
		return;
	}
	return errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} is still active; try again in a moment.`);
}
async function runAcpCleanupStep(params) {
	let timer;
	const timeoutPromise = new Promise((resolve) => {
		timer = setTimeout(() => resolve({ status: "timeout" }), ACP_RUNTIME_CLEANUP_TIMEOUT_MS);
	});
	const opPromise = params.op().then(() => ({ status: "ok" })).catch((error) => ({
		status: "error",
		error
	}));
	const outcome = await Promise.race([opPromise, timeoutPromise]);
	if (timer) clearTimeout(timer);
	return outcome;
}
async function closeAcpRuntimeForSession(params) {
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	const sessionKeys = Array.from(new Set([params.sessionKey, ...params.fallbackSessionKeys ?? []].map((key) => typeof key === "string" ? key.trim() : "").filter(Boolean)));
	let acpMeta;
	let acpSessionKey = params.sessionKey;
	for (const sessionKey of sessionKeys) {
		acpMeta = readAcpSessionMeta({
			sessionKey,
			agentId: params.agentId,
			cfg: params.cfg
		});
		if (acpMeta) {
			acpSessionKey = sessionKey;
			break;
		}
	}
	if (!acpMeta) return;
	const acpManager = getAcpSessionManager();
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	const cancelOutcome = await runAcpCleanupStep({ op: async () => {
		await acpManager.cancelSession({
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			reason: params.reason
		});
	} });
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	if (cancelOutcome.status === "timeout") return errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.sessionKey} is still active; try again in a moment.`);
	if (cancelOutcome.status === "error") logVerbose(`sessions.${params.reason}: ACP cancel failed for ${params.sessionKey}: ${String(cancelOutcome.error)}`);
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	const closeOutcome = await runAcpCleanupStep({ op: async () => {
		await acpManager.closeSession({
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			reason: params.reason,
			discardPersistentState: true,
			requireAcpSession: false,
			allowBackendUnavailable: true
		});
	} });
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	if (closeOutcome.status === "timeout") return errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.sessionKey} is still active; try again in a moment.`);
	if (closeOutcome.status === "error") logVerbose(`sessions.${params.reason}: ACP runtime close failed for ${params.sessionKey}: ${String(closeOutcome.error)}`);
	if (params.reason === "session-delete") {
		params.assertCurrent?.();
		await upsertAcpSessionMeta({
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			agentId: params.agentId,
			mutate: () => null
		});
		params.assertCurrent?.();
	} else if (params.deferResetState) params.onDeferredResetState?.({
		sessionKey: acpSessionKey,
		meta: acpMeta
	});
	else {
		const resetMeta = await ensureFreshAcpResetState({
			cfg: params.cfg,
			sessionKey: acpSessionKey,
			agentId: params.agentId,
			reason: params.reason,
			acpMeta,
			assertCurrent: params.assertCurrent,
			shouldApply: params.shouldCleanup
		});
		if (resetMeta) params.onResetMeta?.({
			sessionKey: acpSessionKey,
			meta: resetMeta
		});
	}
}
function buildPendingAcpMeta(base, now) {
	const currentIdentity = base.identity;
	const nextIdentity = currentIdentity ? {
		state: "pending",
		...currentIdentity.acpxRecordId ? { acpxRecordId: currentIdentity.acpxRecordId } : {},
		source: currentIdentity.source,
		lastUpdatedAt: now
	} : void 0;
	return {
		backend: base.backend,
		agent: base.agent,
		runtimeSessionName: base.runtimeSessionName,
		...nextIdentity ? { identity: nextIdentity } : {},
		mode: base.mode,
		...base.runtimeOptions ? { runtimeOptions: base.runtimeOptions } : {},
		...base.cwd ? { cwd: base.cwd } : {},
		state: "idle",
		lastActivityAt: now
	};
}
async function ensureFreshAcpResetState(params) {
	if (params.reason !== "session-reset") return;
	const latestMeta = readAcpSessionMeta({
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		cfg: params.cfg
	}) ?? params.acpMeta;
	if (!latestMeta?.identity || latestMeta.identity.state !== "resolved" || !latestMeta.identity.acpxSessionId && !latestMeta.identity.agentSessionId) return;
	if (params.shouldApply && !params.shouldApply()) return;
	params.assertCurrent?.();
	await tryPrepareFreshManagerRuntimeSession({
		deps: { getRuntimeBackend: getAcpRuntimeBackend },
		cfg: params.cfg,
		meta: latestMeta,
		sessionKey: params.sessionKey,
		logPrefix: `sessions.${params.reason}`
	});
	if (params.shouldApply && !params.shouldApply()) return;
	params.assertCurrent?.();
	const now = Date.now();
	let resetMeta;
	if (params.shouldApply && !params.shouldApply()) return;
	params.assertCurrent?.();
	await upsertAcpSessionMeta({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		mutate: (current) => {
			if (params.shouldApply && !params.shouldApply()) return current;
			resetMeta = buildPendingAcpMeta(current ?? latestMeta, now);
			return resetMeta;
		}
	});
	params.assertCurrent?.();
	return resetMeta;
}
async function closeChildAcpRuntimesForParent(params) {
	let children;
	try {
		if (params.shouldCleanup && !params.shouldCleanup()) return;
		params.assertCurrent?.();
		children = findDirectChildSessionsForParent({
			cfg: params.cfg,
			parentKey: params.parentKey
		}).flatMap(({ sessionKey }) => {
			return readAcpSessionMeta({ sessionKey }) ? [{ sessionKey }] : [];
		});
	} catch (error) {
		logVerbose(`sessions.${params.reason}: failed to enumerate sessions for child ACP cleanup: ${String(error)}`);
		return;
	}
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
	await Promise.allSettled(children.map(({ sessionKey }) => closeAcpRuntimeForSession({
		cfg: params.cfg,
		sessionKey,
		reason: params.reason,
		assertCurrent: params.assertCurrent,
		shouldCleanup: params.shouldCleanup
	}).then((childError) => {
		if (childError) logVerbose(`sessions.${params.reason}: child ACP cleanup incomplete for ${sessionKey}`);
	})));
	if (params.shouldCleanup && !params.shouldCleanup()) return;
	params.assertCurrent?.();
}
async function cleanupSessionBeforeMutation(params) {
	const cleanupError = await ensureSessionRuntimeCleanup({
		cfg: params.cfg,
		key: params.key,
		target: params.target,
		sessionId: params.entry?.sessionId,
		assertCurrent: params.assertCurrent
	});
	if (cleanupError) return cleanupError;
	const pluginCleanup = await runPluginHostCleanup({
		cfg: params.cfg,
		registry: getActivePluginRegistry(),
		reason: params.reason === "session-reset" ? "reset" : "delete",
		sessionKey: params.target.canonicalKey ?? params.key,
		shouldCleanup: () => {
			params.assertCurrent?.();
			return true;
		}
	});
	params.assertCurrent?.();
	for (const failure of pluginCleanup.failures) logVerbose(`plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`);
	const parentSessionKey = params.target.canonicalKey ?? params.canonicalKey ?? params.key;
	const parentAcpError = await closeAcpRuntimeForSession({
		cfg: params.cfg,
		sessionKey: parentSessionKey,
		agentId: params.target.agentId,
		fallbackSessionKeys: [
			params.canonicalKey,
			params.legacyKey,
			params.key
		],
		reason: params.reason,
		onResetMeta: params.onAcpResetMeta,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	await closeChildAcpRuntimesForParent({
		cfg: params.cfg,
		parentKey: params.target.canonicalKey ?? params.canonicalKey ?? params.key,
		reason: params.reason,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	if (parentAcpError) return parentAcpError;
	if (params.entry?.sessionId) {
		await resetRegisteredAgentHarnessSessions({
			agentId: resolveLifecycleAgentId(params.cfg, params.target.agentId),
			sessionId: params.entry.sessionId,
			sessionKey: params.target.canonicalKey ?? params.key,
			sessionFile: params.target.canonicalKey ?? params.key,
			reason: params.reason === "session-reset" ? "reset" : "deleted"
		});
		params.assertCurrent?.();
	}
}
async function emitGatewayBeforeResetPluginHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_reset")) return;
	const sessionKey = params.target.canonicalKey ?? params.key;
	const sessionId = params.entry?.sessionId;
	const agentId = resolveLifecycleAgentId(params.cfg, params.target.agentId);
	const sessionFile = sessionId ? formatSqliteSessionFileMarker({
		agentId,
		sessionId,
		storePath: params.storePath
	}) : void 0;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
	const messages = params.messages ?? await readGatewayBeforeResetPluginHookMessages({
		agentId,
		entry: params.entry,
		sessionId,
		sessionKey,
		storePath: params.storePath
	});
	hookRunner.runBeforeReset({
		sessionFile,
		messages,
		reason: params.reason
	}, {
		agentId,
		sessionKey,
		sessionId,
		workspaceDir
	}).catch((err) => {
		logVerbose(`before_reset hook failed: ${String(err)}`);
	});
}
async function readGatewayBeforeResetPluginHookMessages(params) {
	if (typeof params.sessionId !== "string" || params.sessionId.trim().length === 0) return [];
	try {
		return await readSessionMessagesAsync({
			agentId: params.agentId,
			sessionEntry: params.entry,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			mode: "full",
			reason: "before_reset hook payload"
		});
	} catch (err) {
		logVerbose(`before_reset: failed to read session messages for ${params.sessionId}; firing hook with empty messages (${String(err)})`);
		return [];
	}
}
async function performGatewaySessionReset(params) {
	const resetTarget = (() => {
		const cfg = getRuntimeConfig();
		const explicitAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
		const parsedKey = parseAgentSessionKey(params.key);
		const inferredGlobalAgentId = !explicitAgentId && parsedKey && resolveSessionStoreKey({
			cfg,
			sessionKey: params.key
		}) === "global" ? normalizeAgentId(parsedKey.agentId) : void 0;
		const requestedAgentId = explicitAgentId ?? inferredGlobalAgentId;
		if (requestedAgentId && !listAgentIds(cfg).includes(requestedAgentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id: ${requestedAgentId}`)
		};
		if (explicitAgentId && parsedKey?.agentId && normalizeAgentId(parsedKey.agentId) !== explicitAgentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId")
		};
		const target = resolveGatewaySessionStoreTarget({
			cfg,
			key: params.key,
			...requestedAgentId ? { agentId: requestedAgentId } : {}
		});
		return {
			ok: true,
			cfg,
			target,
			storePath: target.storePath,
			requestedAgentId
		};
	})();
	if (!resetTarget.ok) return resetTarget;
	const reportLifecycleCleanupError = (error) => {
		if (params.onLifecycleCleanupError) {
			params.onLifecycleCleanupError(error);
			return;
		}
		logVerbose(`session lifecycle resource cleanup failed: ${String(error)}`);
	};
	const initialResetEntry = loadGatewaySessionEntry(params.key, resetTarget.requestedAgentId ? { agentId: resetTarget.requestedAgentId } : void 0).entry;
	if (!initialResetEntry) {
		const creationError = authorizeGatewaySessionCreation({
			cfg: resetTarget.cfg,
			agentId: resetTarget.target.agentId,
			...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
		});
		if (creationError) return {
			ok: false,
			error: creationError
		};
	}
	const initialOwnershipError = resolvePluginSessionOwnershipError({
		action: "reset",
		entry: initialResetEntry,
		key: resetTarget.target.canonicalKey,
		pluginOwnerId: params.authorizedPluginId
	});
	if (initialOwnershipError) return {
		ok: false,
		error: initialOwnershipError
	};
	const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(resetTarget.target.canonicalKey, initialResetEntry);
	if (missingHarnessSessionError) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError)
	};
	if (isModelSelectionLocked(initialResetEntry)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE)
	};
	const workerPlacementContext = params.workerPlacementContext ?? (await import("./session-worker-placement-context-0yK2er1p.js")).resolveSessionWorkerPlacementContext();
	const initialPlacementError = resolveSessionWorkerPlacementMutationError({
		action: "reset",
		context: workerPlacementContext,
		key: params.key,
		sessionId: normalizeOptionalString(initialResetEntry?.sessionId)
	});
	if (initialPlacementError) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, initialPlacementError.message)
	};
	const resetLifecycleIdentities = [
		resetTarget.target.canonicalKey,
		params.key,
		initialResetEntry?.sessionId
	];
	const activeLifecycleMutation = isSessionLifecycleMutationActive(resetTarget.storePath, resetLifecycleIdentities);
	const activeCompaction = hasOnlySessionLifecycleMutationKindActive(resetTarget.storePath, resetLifecycleIdentities, "compaction");
	if (activeLifecycleMutation && !activeCompaction) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} has another lifecycle mutation in progress; try again.`)
	};
	let admittedWorkReleased = true;
	let resetPreparationError;
	let preparedResetSessionId;
	let preparedLifecycle;
	let lifecyclePreparationCommitted = false;
	return await runExclusiveSessionLifecycleMutation({
		scope: resetTarget.storePath,
		identities: resetLifecycleIdentities,
		prepare: async () => {
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const { entry: currentEntry, canonicalKey: currentCanonicalKey } = loadGatewaySessionEntry(params.key, resetTarget.requestedAgentId ? { agentId: resetTarget.requestedAgentId } : void 0);
			if (!currentEntry) {
				resetPreparationError = authorizeGatewaySessionCreation({
					cfg: resetTarget.cfg,
					agentId: resetTarget.target.agentId,
					...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
				});
				if (resetPreparationError) return;
			}
			resetPreparationError = resolvePluginSessionOwnershipError({
				action: "reset",
				entry: currentEntry,
				key: resetTarget.target.canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (resetPreparationError) return;
			const currentMissingHarnessSessionError = resolveMissingAgentHarnessSessionError(resetTarget.target.canonicalKey, currentEntry);
			if (currentMissingHarnessSessionError) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, currentMissingHarnessSessionError);
				return;
			}
			const placementError = resolveSessionWorkerPlacementMutationError({
				action: "reset",
				context: workerPlacementContext,
				key: params.key,
				sessionId: normalizeOptionalString(currentEntry?.sessionId)
			});
			if (placementError) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, placementError.message);
				return;
			}
			const archivedSessionError = resolveSessionWorkStartError(currentCanonicalKey, currentEntry);
			if (archivedSessionError) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError);
				return;
			}
			if (isModelSelectionLocked(currentEntry)) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE);
				return;
			}
			if ((currentEntry?.incognito === true || isIncognitoSessionKey(resetTarget.target.canonicalKey)) && !currentEntry) {
				resetPreparationError = errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.key}`);
				return;
			}
			preparedResetSessionId = normalizeOptionalString(currentEntry?.sessionId);
			admittedWorkReleased = await interruptSessionWorkAdmissions({
				scope: resetTarget.storePath,
				identities: resetLifecycleIdentities,
				timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
			});
			if (admittedWorkReleased && params.prepareLifecycle) {
				const prepared = await params.prepareLifecycle({
					agentId: resetTarget.target.agentId,
					entry: currentEntry,
					key: resetTarget.target.canonicalKey,
					storePath: resetTarget.storePath
				});
				if (!prepared.ok) {
					resetPreparationError = prepared.error;
					return;
				}
				preparedLifecycle = prepared.value;
			}
		},
		run: async () => {
			const { cfg, target, storePath, requestedAgentId } = resetTarget;
			if (resetPreparationError) return {
				ok: false,
				error: resetPreparationError
			};
			if (!admittedWorkReleased) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} is still active; try again in a moment.`)
			};
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const { entry, legacyKey, canonicalKey } = loadGatewaySessionEntry(params.key, requestedAgentId ? { agentId: requestedAgentId } : void 0);
			if (normalizeOptionalString(entry?.sessionId) !== preparedResetSessionId) return {
				ok: false,
				error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} changed before reset. Retry.`)
			};
			const currentOwnershipError = resolvePluginSessionOwnershipError({
				action: "reset",
				entry,
				key: canonicalKey,
				pluginOwnerId: params.authorizedPluginId
			});
			if (currentOwnershipError) return {
				ok: false,
				error: currentOwnershipError
			};
			const placementError = resolveSessionWorkerPlacementMutationError({
				action: "reset",
				context: workerPlacementContext,
				key: params.key,
				sessionId: normalizeOptionalString(entry?.sessionId)
			});
			if (placementError) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, placementError.message)
			};
			const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
			if (archivedSessionError) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError)
			};
			if (isModelSelectionLocked(entry)) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_RESET_MESSAGE)
			};
			const incognito = entry?.incognito === true || isIncognitoSessionKey(target.canonicalKey);
			if (incognito && !entry) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.key}`)
			};
			const placementRetirementError = retireSessionWorkerPlacementBeforeMutation({
				action: "reset",
				context: workerPlacementContext,
				key: params.key,
				sessionId: normalizeOptionalString(entry?.sessionId)
			});
			if (placementRetirementError) return {
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, placementRetirementError.message)
			};
			const hadExistingEntry = Boolean(entry);
			const detachedWorktreeId = params.clearSpawnedCwd ? normalizeOptionalString(entry?.worktree?.id) : void 0;
			const resetLifecycleRevision = entry?.lifecycleRevision;
			const agentId = resolveLifecycleAgentId(cfg, target.agentId);
			const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
			const resetPluginRegistry = getActivePluginRegistry();
			const isResetLifecycleCurrent = () => {
				try {
					params.assertCurrent?.();
					return true;
				} catch {
					return false;
				}
			};
			let deferredAcpResetState;
			await triggerInternalHook(createInternalHookEvent("command", params.reason, target.canonicalKey ?? params.key, {
				agentId,
				sessionEntry: entry,
				previousSessionEntry: entry,
				commandSource: params.commandSource,
				cfg,
				storePath,
				workspaceDir
			}));
			params.assertCurrent?.();
			params.assertAuthorizedInstance?.();
			const runtimeCleanupError = await ensureSessionRuntimeCleanup({
				cfg,
				key: params.key,
				target,
				sessionId: entry?.sessionId
			});
			if (runtimeCleanupError) return {
				ok: false,
				error: runtimeCleanupError
			};
			const parentAcpError = await closeAcpRuntimeForSession({
				cfg,
				sessionKey: target.canonicalKey ?? canonicalKey ?? params.key,
				agentId: target.agentId,
				fallbackSessionKeys: [
					canonicalKey,
					legacyKey,
					params.key
				],
				reason: "session-reset",
				deferResetState: true,
				onDeferredResetState: (state) => {
					deferredAcpResetState = state;
				}
			});
			if (parentAcpError) return {
				ok: false,
				error: parentAcpError
			};
			const pluginCleanup = await runPluginHostCleanup({
				cfg,
				registry: resetPluginRegistry,
				reason: "reset",
				sessionKey: target.canonicalKey ?? params.key,
				skipPersistentSessionState: true
			});
			for (const failure of pluginCleanup.failures) logVerbose(`plugin host cleanup failed for ${failure.pluginId}/${failure.hookId}: ${String(failure.error)}`);
			await closeChildAcpRuntimesForParent({
				cfg,
				parentKey: target.canonicalKey ?? canonicalKey ?? params.key,
				reason: "session-reset"
			});
			if (entry?.sessionId) await resetRegisteredAgentHarnessSessions({
				agentId,
				sessionId: entry.sessionId,
				sessionKey: target.canonicalKey ?? params.key,
				sessionFile: target.canonicalKey ?? params.key,
				reason: "reset"
			});
			const beforeResetMessages = getGlobalHookRunner()?.hasHooks("before_reset") ? await readGatewayBeforeResetPluginHookMessages({
				agentId: resolveLifecycleAgentId(cfg, target.agentId ?? requestedAgentId),
				entry,
				sessionId: entry?.sessionId,
				sessionKey: target.canonicalKey ?? params.key,
				storePath
			}) : void 0;
			if (incognito) {
				if (!entry) return {
					ok: false,
					error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.key}`)
				};
				await emitGatewayBeforeResetPluginHook({
					cfg,
					key: params.key,
					messages: beforeResetMessages,
					target,
					storePath,
					entry,
					reason: params.reason
				});
				if (!(await deleteSessionEntryLifecycle({
					agentId: target.agentId,
					archiveTranscript: false,
					deleteDeliveryArtifacts: true,
					deleteTranscriptWithoutArchive: true,
					expectedEntry: entry,
					expectedSessionId: entry.sessionId,
					expectedUpdatedAt: entry.updatedAt,
					storePath,
					target: {
						canonicalKey: target.canonicalKey,
						storeKeys: target.storeKeys
					}
				})).deleted) return {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.key} changed before reset. Retry.`)
				};
				handleSessionStateSessionDeleted(target.canonicalKey, agentId);
				notifyGatewaySessionReset(target.canonicalKey, target.agentId);
				emitGatewaySessionEndPluginHook({
					cfg,
					sessionKey: target.canonicalKey,
					sessionId: entry.sessionId,
					storePath,
					sessionFile: target.canonicalKey,
					agentId: target.agentId,
					reason: params.reason,
					archivedTranscripts: []
				});
				await emitSessionUnboundLifecycleEvent({
					targetSessionKey: target.canonicalKey,
					reason: "session-reset"
				});
				return {
					ok: true,
					key: target.canonicalKey,
					agentId: target.agentId,
					storePath,
					incognitoDeleted: true
				};
			}
			let createdNewEntry = false;
			params.assertAuthorizedInstance?.();
			const boundaryEntry = loadGatewaySessionEntry(params.key, requestedAgentId ? { agentId: requestedAgentId } : void 0).entry;
			if (boundaryEntry?.sessionId !== entry?.sessionId) {
				params.assertCurrent?.();
				throw new Error(`Session ${params.key} changed before reset boundary append.`);
			}
			let resetBoundaryAppended = false;
			let resetSkipped = false;
			let creationAuthorizationError;
			const lifecyclePromise = resetSessionEntryLifecycle({
				archivePreviousTranscript: false,
				agentId: target.agentId,
				resetBoundary: boundaryEntry ? {
					context: "clear",
					reason: params.reason
				} : void 0,
				storePath,
				target: {
					canonicalKey: target.canonicalKey,
					storeKeys: [...new Set([
						...target.storeKeys,
						canonicalKey,
						legacyKey,
						params.key
					].filter((key) => Boolean(key)))]
				},
				buildNextEntry: ({ currentEntry, primaryKey }) => {
					params.assertAuthorizedInstance?.();
					if (!currentEntry) {
						creationAuthorizationError = authorizeGatewaySessionCreation({
							cfg,
							agentId: target.agentId,
							...params.operatorRoleActor ? { actor: params.operatorRoleActor } : { profileId: params.requestingOperatorProfileId }
						});
						if (creationAuthorizationError) throw new Error(creationAuthorizationError.message);
					}
					createdNewEntry = currentEntry === void 0;
					if (currentEntry?.sessionId !== boundaryEntry?.sessionId) {
						if (currentEntry) {
							resetSkipped = true;
							return currentEntry;
						}
						params.assertCurrent?.();
						throw new Error(`Session ${params.key} changed before reset boundary commit.`);
					}
					if (currentEntry && !isResetLifecycleCurrent() && currentEntry.lifecycleRevision !== resetLifecycleRevision) {
						resetSkipped = true;
						return currentEntry;
					}
					resetBoundaryAppended = currentEntry !== void 0;
					const resetPreservedSelection = resolveResetPreservedSelection({ entry: currentEntry });
					const now = Date.now();
					const nextSessionId = currentEntry?.sessionId ?? randomUUID();
					const nextExecNode = params.execNode ? params.execNode : params.clearExecBinding ? void 0 : currentEntry?.execNode;
					const creationStamp = currentEntry ? {
						createdVia: currentEntry.createdVia,
						createdActor: currentEntry.createdActor,
						createdAt: currentEntry.createdAt,
						projectId: currentEntry.projectId,
						...currentEntry.sandbox === "required" ? { sandbox: "required" } : {}
					} : params.creation ? {
						...buildSessionCreationStamp(params.creation),
						...resolveCreatorSandbox(cfg, params.creation) === "required" ? { sandbox: "required" } : {}
					} : {};
					const nextEntry = {
						sessionId: nextSessionId,
						lifecycleRevision: randomUUID(),
						updatedAt: now,
						sessionStartedAt: now,
						systemSent: false,
						abortedLastRun: false,
						contextWindow: currentEntry?.contextWindow,
						thinkingLevel: currentEntry?.thinkingLevel,
						fastMode: currentEntry?.fastMode,
						toolOverrides: currentEntry?.toolOverrides,
						verboseLevel: currentEntry?.verboseLevel,
						traceLevel: currentEntry?.traceLevel,
						reasoningLevel: currentEntry?.reasoningLevel,
						elevatedLevel: currentEntry?.elevatedLevel,
						ttsAuto: currentEntry?.ttsAuto,
						execHost: params.execNode ? "node" : params.clearExecBinding ? void 0 : currentEntry?.execHost,
						execSecurity: currentEntry?.execSecurity,
						execAsk: currentEntry?.execAsk,
						execNode: nextExecNode,
						execCwd: params.execNode ? params.execCwd : params.clearExecBinding ? void 0 : currentEntry?.execCwd,
						...params.armSessionDiffBaselineCapture && !nextExecNode ? { sessionDiffBaselineCapture: createSessionDiffBaselineCaptureClaim() } : {},
						responseUsage: currentEntry?.responseUsage,
						pinnedAt: currentEntry?.pinnedAt,
						...resetPreservedSelection,
						groupActivation: currentEntry?.groupActivation,
						groupActivationNeedsSystemIntro: currentEntry?.groupActivationNeedsSystemIntro,
						chatType: currentEntry?.chatType,
						compactionCount: 0,
						sendPolicy: currentEntry?.sendPolicy,
						queueMode: currentEntry?.queueMode,
						queueDebounceMs: currentEntry?.queueDebounceMs,
						queueCap: currentEntry?.queueCap,
						queueDrop: currentEntry?.queueDrop,
						spawnedBy: currentEntry?.spawnedBy,
						completionOwnerSessionKey: currentEntry?.completionOwnerSessionKey,
						inheritedToolPolicyVersion: currentEntry?.inheritedToolPolicyVersion,
						inheritedToolAllow: currentEntry?.inheritedToolAllow,
						inheritedToolDeny: currentEntry?.inheritedToolDeny,
						spawnedWorkspaceDir: currentEntry?.spawnedWorkspaceDir,
						spawnedCwd: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.spawnedCwd ?? params.spawnedCwd ?? currentEntry?.spawnedCwd,
						sessionRoot: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.sessionRoot ?? params.sessionRoot ?? currentEntry?.sessionRoot,
						permissionMode: params.clearSpawnedCwd ? void 0 : params.permissionMode ?? currentEntry?.permissionMode,
						worktree: params.clearSpawnedCwd ? void 0 : preparedLifecycle?.worktree ?? currentEntry?.worktree,
						parentSessionKey: currentEntry?.parentSessionKey,
						parentSessionId: currentEntry?.parentSessionId,
						...creationStamp,
						forkSource: currentEntry?.forkSource,
						forkedFromParent: sessionEntryForkedFromParent(currentEntry) ? true : void 0,
						spawnDepth: currentEntry?.spawnDepth,
						subagentRole: currentEntry?.subagentRole,
						subagentControlScope: currentEntry?.subagentControlScope,
						label: currentEntry?.label,
						icon: currentEntry?.icon,
						category: currentEntry?.category,
						boardFace: currentEntry?.boardFace,
						visibility: currentEntry?.visibility,
						displayName: currentEntry?.displayName,
						delivery: currentEntry?.delivery,
						pendingDeliveryNotice: currentEntry?.pendingDeliveryNotice,
						groupId: currentEntry?.groupId,
						subject: currentEntry?.subject,
						groupChannel: currentEntry?.groupChannel,
						space: currentEntry?.space,
						pluginOwnerId: currentEntry?.pluginOwnerId ?? params.authorizedPluginId,
						cliSessionBindings: currentEntry?.cliSessionBindings,
						cliSessionIds: currentEntry?.cliSessionIds,
						claudeCliSessionId: currentEntry?.claudeCliSessionId,
						usageFamilyKey: currentEntry?.usageFamilyKey,
						usageFamilySessionIds: currentEntry?.usageFamilySessionIds,
						inputTokens: 0,
						outputTokens: 0,
						totalTokens: 0,
						totalTokensFresh: true,
						totalTokensVersion: 1
					};
					if (resetBoundaryAppended && !isSubagentSessionKey(primaryKey)) clearAllCliSessions(nextEntry);
					else nextEntry.cliSessionBindings = rebindCliSessionReseedReceiptsForReset(nextEntry.cliSessionBindings, nextSessionId);
					return nextEntry;
				},
				afterEntryMutation: async (mutation) => {
					if (resetSkipped) return;
					clearBootstrapSnapshotOnSessionBoundary({
						boundaryAppended: resetBoundaryAppended,
						sessionKey: target.canonicalKey ?? params.key
					});
					if (createdNewEntry) recordSessionCreated({
						sessionKey: target.canonicalKey ?? params.key,
						agentId,
						entry: mutation.nextEntry
					});
					let committedAcpResetState;
					if (deferredAcpResetState) {
						const identity = deferredAcpResetState.meta.identity;
						if (identity?.state === "resolved" && (identity.acpxSessionId || identity.agentSessionId)) {
							committedAcpResetState = {
								sessionKey: deferredAcpResetState.sessionKey,
								meta: buildPendingAcpMeta(deferredAcpResetState.meta, Date.now())
							};
							writeAcpSessionMetaForMigration({
								sessionKey: committedAcpResetState.sessionKey,
								sessionId: mutation.nextEntry.sessionId,
								lifecycleRevision: mutation.nextEntry.lifecycleRevision,
								meta: committedAcpResetState.meta
							});
						}
					}
					params.onCommitted?.({
						key: target.canonicalKey,
						sessionId: mutation.nextEntry.sessionId
					});
					if (committedAcpResetState && isResetLifecycleCurrent()) await tryPrepareFreshManagerRuntimeSession({
						deps: { getRuntimeBackend: getAcpRuntimeBackend },
						cfg,
						meta: committedAcpResetState.meta,
						sessionKey: committedAcpResetState.sessionKey,
						logPrefix: "sessions.session-reset"
					});
					await emitGatewayBeforeResetPluginHook({
						cfg,
						key: params.key,
						messages: beforeResetMessages,
						target,
						storePath,
						entry: mutation.previousEntry,
						reason: params.reason
					});
				}
			});
			let lifecycle;
			try {
				lifecycle = await lifecyclePromise;
			} catch (error) {
				if (creationAuthorizationError) return {
					ok: false,
					error: creationAuthorizationError
				};
				throw error;
			}
			lifecyclePreparationCommitted = !resetSkipped;
			if (!resetSkipped) {
				const resetSessionKey = target.canonicalKey ?? params.key;
				handleSessionStateSessionReset(resetSessionKey);
				notifyGatewaySessionReset(resetSessionKey, target.agentId);
			}
			const next = lifecycle.nextEntry;
			const selectedModel = resolveSessionModelRef(cfg, next, target.agentId);
			const resolved = {
				modelProvider: selectedModel.provider,
				model: selectedModel.model
			};
			const responseEntry = {
				...projectPublicSessionEntry(next),
				modelProvider: resolved.modelProvider,
				model: resolved.model
			};
			const oldSessionId = lifecycle.previousSessionId;
			const oldSessionFile = lifecycle.previousSessionFile;
			const archivedTranscripts = lifecycle.archivedTranscripts;
			if (!resetSkipped) {
				emitGatewaySessionEndPluginHook({
					cfg,
					sessionKey: target.canonicalKey ?? params.key,
					sessionId: oldSessionId,
					storePath,
					sessionFile: oldSessionFile,
					agentId: target.agentId,
					reason: params.reason,
					archivedTranscripts,
					nextSessionId: next.sessionId
				});
				emitGatewaySessionStartPluginHook({
					cfg,
					sessionKey: target.canonicalKey ?? params.key,
					sessionId: next.sessionId,
					resumedFrom: oldSessionId,
					storePath,
					sessionFile: target.canonicalKey ?? params.key,
					agentId: target.agentId
				});
			}
			if (hadExistingEntry && !resetSkipped) await emitSessionUnboundLifecycleEvent({
				targetSessionKey: target.canonicalKey ?? params.key,
				reason: "session-reset"
			});
			if (!resetSkipped && detachedWorktreeId) try {
				if (!await managedWorktrees.removeIfLossless(detachedWorktreeId)) {
					const retained = managedWorktrees.findLiveById(detachedWorktreeId);
					if (retained) {
						const safePath = truncateUtf16Safe(sanitizeForLog(retained.path), 256);
						reportLifecycleCleanupError(/* @__PURE__ */ new Error(`worktree retained: branch=${retained.branch} path=${safePath} outcome=${retained.runEndCleanup?.outcome}`));
					}
				}
			} catch (error) {
				reportLifecycleCleanupError(error);
			}
			return {
				ok: true,
				key: target.canonicalKey,
				entry: responseEntry,
				resolved,
				agentId: target.agentId,
				storePath
			};
		},
		finalize: async () => {
			if (!lifecyclePreparationCommitted) await rollbackGatewaySessionPreparation({
				prepared: preparedLifecycle,
				onError: reportLifecycleCleanupError
			});
		}
	});
}
//#endregion
export { emitGatewaySessionStartPluginHook as a, emitGatewaySessionEndPluginHook as i, cleanupSessionBeforeMutation as n, emitSessionUnboundLifecycleEvent as o, emitGatewayBeforeResetPluginHook as r, performGatewaySessionReset as s, archiveSessionTranscriptsForSessionDetailed as t };
