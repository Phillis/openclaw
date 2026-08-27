import { t as isFastTestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-ChWDbSFK.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { m as patchSessionEntryCore, w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { h as projectCanonicalSessionEntryShape } from "./store-entry-BN3xGmHe.js";
import { v as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CTDt7IQ1.js";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { mt as clearAllCliSessions, nt as updateSessionEntry } from "./session-accessor-fcDZuc2H.js";
import "./sessions-BI8dPUCI.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CDBq1X4a.js";
import { s as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-BR7phvyf.js";
import "./cli-session-CCYUcdz9.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-DFjm1Q5i.js";
import { a as buildSessionStartHookPayload, i as buildSessionEndHookPayload, r as noteActiveSessionForShutdown, t as forgetActiveSessionForShutdown } from "./active-sessions-shutdown-tracker-NctYi_BN.js";
import { t as getRemoteSkillEligibility } from "./remote-BHibO2zu.js";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-HsJk4BCx.js";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
/** Session update helpers for skill snapshots, compaction, and lifecycle hooks. */
async function persistSessionEntryUpdate(params) {
	if (!params.sessionEntryHandle && (!params.sessionStore || !params.sessionKey)) return;
	if (!params.storePath || !params.sessionKey) {
		if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(params.nextEntry);
		else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = {
			...params.sessionStore[params.sessionKey],
			...params.nextEntry
		};
		return params.nextEntry;
	}
	const persistedEntry = await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => entry.sessionId === params.expectedSessionId ? params.updates : null);
	if (persistedEntry) {
		if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(persistedEntry);
		else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = persistedEntry;
		return persistedEntry;
	}
	params.sessionEntryHandle?.clearCurrent();
	if (params.sessionStore && params.sessionKey) delete params.sessionStore[params.sessionKey];
}
function emitCompactionSessionLifecycleHooks(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	if (params.previousEntry.sessionId) forgetActiveSessionForShutdown(params.previousEntry.sessionId);
	if (params.nextEntry.sessionId && params.storePath) noteActiveSessionForShutdown({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.nextEntry.sessionId,
		storePath: params.storePath,
		sessionFile: params.sessionKey,
		agentId
	});
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner) return;
	if (hookRunner.hasHooks("session_end")) {
		const storePath = agentId && params.storePath ? resolveSessionStorePathForScope({
			agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) : params.storePath;
		const transcript = resolveStableSessionEndTranscript({
			sessionId: params.previousEntry.sessionId,
			storePath,
			agentId
		});
		const payload = buildSessionEndHookPayload({
			sessionId: params.previousEntry.sessionId,
			sessionKey: params.sessionKey,
			agentId,
			reason: "compaction",
			sessionFile: transcript.sessionFile ?? (agentId && storePath ? formatSqliteSessionFileMarker({
				agentId,
				sessionId: params.previousEntry.sessionId,
				storePath
			}) : void 0),
			transcriptArchived: transcript.transcriptArchived,
			nextSessionId: params.nextEntry.sessionId
		});
		runWithGatewayIndependentRootWorkContinuation(async () => {
			await hookRunner.runSessionEnd(payload.event, payload.context);
		}).catch((err) => {
			logVerbose(`session_end hook failed: ${String(err)}`);
		});
	}
	if (hookRunner.hasHooks("session_start")) {
		const payload = buildSessionStartHookPayload({
			sessionId: params.nextEntry.sessionId,
			sessionKey: params.sessionKey,
			agentId,
			resumedFrom: params.previousEntry.sessionId
		});
		runWithGatewayIndependentRootWorkContinuation(async () => {
			await hookRunner.runSessionStart(payload.event, payload.context);
		}).catch((err) => {
			logVerbose(`session_start hook failed: ${String(err)}`);
		});
	}
}
function resolveNonNegativeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
/** Ensures a session entry has the reusable skill snapshot needed for reply runs. */
async function ensureSkillSnapshot(params) {
	if (isFastTestRuntimeEnv()) return {
		sessionEntry: params.sessionEntry,
		skillsSnapshot: params.sessionEntry?.skillsSnapshot,
		systemSent: params.sessionEntry?.systemSent ?? false
	};
	const { sessionEntry, sessionEntryHandle, sessionStore, sessionKey, storePath, sessionId, isFirstTurnInSession, workspaceDir, cfg, skillFilter, skillOverrides } = params;
	let nextEntry = sessionEntryHandle?.getCurrent() ?? sessionEntry;
	let systemSent = sessionEntry?.systemSent ?? false;
	const sessionAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg
	});
	const nodeSkillsEligibility = resolveNodeExecEligibility({
		cfg,
		sessionEntry,
		sessionKey,
		agentId: sessionAgentId,
		execOverrides: params.execOverrides
	});
	const remoteEligibility = getRemoteSkillEligibility({ advertiseExecNode: nodeSkillsEligibility.canExec });
	const existingSnapshot = nextEntry?.skillsSnapshot;
	const resolveSnapshot = (snapshot) => resolveReusableWorkspaceSkillSnapshot({
		workspaceDir,
		...params.executionSkillsDir ? { executionSkillsDir: params.executionSkillsDir } : {},
		config: cfg,
		agentId: sessionAgentId,
		skillFilter,
		skillOverrides,
		eligibility: {
			nodeSkills: nodeSkillsEligibility,
			remote: remoteEligibility
		},
		existingSnapshot: snapshot
	});
	const initialSnapshotState = resolveSnapshot(existingSnapshot);
	const shouldRefreshSnapshot = initialSnapshotState.shouldRefresh;
	if (isFirstTurnInSession && (sessionEntryHandle || sessionStore) && sessionKey) {
		const current = nextEntry ?? sessionEntryHandle?.get(sessionKey) ?? sessionStore?.[sessionKey] ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		const skillSnapshot = !current.skillsSnapshot || shouldRefreshSnapshot ? initialSnapshotState.snapshot : resolveSnapshot(current.skillsSnapshot).snapshot;
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			systemSent: true,
			skillsSnapshot: skillSnapshot
		};
		const persistedEntry = await persistSessionEntryUpdate({
			expectedSessionId: current.sessionId,
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry,
			updates: {
				sessionId: nextEntry.sessionId,
				updatedAt: nextEntry.updatedAt,
				systemSent: nextEntry.systemSent,
				skillsSnapshot: nextEntry.skillsSnapshot
			}
		});
		nextEntry = persistedEntry;
		systemSent = persistedEntry?.systemSent ?? systemSent;
	}
	const skillsSnapshot = Boolean(nextEntry?.skillsSnapshot) && (nextEntry?.skillsSnapshot !== existingSnapshot || !shouldRefreshSnapshot) && nextEntry?.skillsSnapshot ? resolveSnapshot(nextEntry.skillsSnapshot).snapshot : shouldRefreshSnapshot || !nextEntry?.skillsSnapshot ? initialSnapshotState.snapshot : resolveSnapshot(nextEntry.skillsSnapshot).snapshot;
	if (skillsSnapshot && (sessionEntryHandle || sessionStore) && sessionKey && !isFirstTurnInSession && (!nextEntry?.skillsSnapshot || shouldRefreshSnapshot)) {
		const current = nextEntry ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			skillsSnapshot
		};
		nextEntry = await persistSessionEntryUpdate({
			expectedSessionId: current.sessionId,
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry,
			updates: {
				sessionId: nextEntry.sessionId,
				updatedAt: nextEntry.updatedAt,
				skillsSnapshot: nextEntry.skillsSnapshot
			}
		});
	}
	return {
		sessionEntry: nextEntry,
		skillsSnapshot,
		systemSent
	};
}
/** Increments compaction count and persists the updated session entry. */
async function incrementCompactionCount(params) {
	const { agentId, sessionEntry, sessionStore, sessionKey, storePath, cfg, now = Date.now(), amount = 1, tokensAfter, newSessionId, compactionKind, expectedSession, authorize } = params;
	if (!sessionStore || !sessionKey) return;
	const entry = sessionStore[sessionKey] ?? sessionEntry;
	if (!entry) return;
	const canApply = (current) => (authorize?.() ?? true) && (!expectedSession || current.sessionId === expectedSession.sessionId && current.lifecycleRevision === expectedSession.lifecycleRevision);
	if (!canApply(entry)) return;
	const incrementBy = Math.max(0, amount);
	const nextCount = (entry.compactionCount ?? 0) + incrementBy;
	const updates = {
		compactionCount: nextCount,
		updatedAt: now,
		...incrementBy > 0 ? { contextBudgetStatus: void 0 } : {}
	};
	if (compactionKind === "context-engine") clearAllCliSessions(updates);
	const sessionIdChanged = Boolean(newSessionId && newSessionId !== entry.sessionId);
	if (sessionIdChanged && newSessionId) {
		updates.sessionId = newSessionId;
		updates.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		updates.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			newSessionId
		]));
	}
	const tokensAfterCompaction = resolveNonNegativeTokenCount(tokensAfter);
	if (tokensAfterCompaction !== void 0) {
		updates.totalTokens = tokensAfterCompaction;
		updates.totalTokensFresh = true;
		updates.totalTokensVersion = 1;
		updates.inputTokens = void 0;
		updates.outputTokens = void 0;
		updates.cacheRead = void 0;
		updates.cacheWrite = void 0;
	} else if (incrementBy > 0) {
		updates.totalTokensFresh = false;
		updates.totalTokensVersion = void 0;
	}
	const nextEntry = projectCanonicalSessionEntryShape({
		...entry,
		...updates
	});
	const effectiveStorePath = storePath ? resolveSessionStorePathForScope({
		agentId,
		sessionKey,
		storePath
	}) : void 0;
	if (effectiveStorePath) {
		let committed = false;
		const authorityRevoked = /* @__PURE__ */ new Error("compaction accounting authority revoked");
		let persistedEntry;
		try {
			persistedEntry = await patchSessionEntryCore({
				...agentId ? { agentId } : {},
				storePath: effectiveStorePath,
				sessionKey
			}, (current) => {
				if (!canApply(current)) return null;
				committed = true;
				return updates;
			}, {
				...expectedSession ? {} : { fallbackEntry: nextEntry },
				...authorize ? { assertCommitAllowed: () => {
					if (!authorize()) throw authorityRevoked;
				} } : {}
			});
		} catch (error) {
			if (error === authorityRevoked) return;
			throw error;
		}
		if (!committed || !persistedEntry) return;
		sessionStore[sessionKey] = persistedEntry;
	} else sessionStore[sessionKey] = nextEntry;
	if (sessionIdChanged && cfg) emitCompactionSessionLifecycleHooks({
		agentId,
		cfg,
		sessionKey,
		storePath: effectiveStorePath,
		previousEntry: entry,
		nextEntry: sessionStore[sessionKey]
	});
	return nextCount;
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
