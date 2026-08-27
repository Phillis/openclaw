import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { i as resolveRegisteredAgentIdForDir } from "./agent-dir-registry-lkpKoZwG.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import { o as resolveStoredSessionKeyForSessionId } from "./session-ChRzjWPw.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-suspension.ts
/**
* Session suspension persistence and lifecycle helpers.
*
* Records quota/manual/circuit suspensions for diagnostics and recovery flows.
*/
const log = createSubsystemLogger("session-suspension");
const DEFAULT_QUOTA_SUSPENSION_RESUME_MS = 1800 * 1e3;
/**
* Keep timer shutdown state process-global so bundled gateway chunks cannot
* leave one module copy scheduling lane resumes after another copy cleaned up.
*/
const SESSION_SUSPENSION_STATE_KEY = Symbol.for("openclaw.sessionSuspensionRuntimeState");
function getSessionSuspensionState() {
	const state = resolveGlobalSingleton(SESSION_SUSPENSION_STATE_KEY, () => ({
		pendingSuspensionWrites: /* @__PURE__ */ new Map(),
		suspensionWriteChain: Promise.resolve(),
		cleanupGeneration: 0,
		cleanupActive: false
	}));
	if (!state.pendingSuspensionWrites) state.pendingSuspensionWrites = /* @__PURE__ */ new Map();
	if (state.suspensionWriteChain === void 0) state.suspensionWriteChain = Promise.resolve();
	return state;
}
const deferredSessionSuspension = new AsyncLocalStorage();
function resolveSessionSuspensionReason(reason) {
	if (reason === "billing") return "manual";
	if (reason === "rate_limit") return "quota_exhausted";
	return "circuit_open";
}
function runWithDeferredSessionSuspension(run, onDeferred) {
	return deferredSessionSuspension.run({
		claimed: false,
		onDeferred
	}, run);
}
function resolveSessionSuspensionTarget() {
	const scope = deferredSessionSuspension.getStore();
	if (!scope || scope.claimed) return { mode: "suspend" };
	scope.claimed = true;
	return {
		mode: "defer",
		defer: (params) => scope.onDeferred?.(params)
	};
}
function fenceSessionSuspensionWritesForGatewayShutdown() {
	const state = getSessionSuspensionState();
	state.cleanupGeneration += 1;
	state.cleanupActive = true;
}
function enableSessionSuspensionWritesForGatewayStart() {
	const state = getSessionSuspensionState();
	state.cleanupGeneration += 1;
	state.cleanupActive = false;
}
async function suspendSession(params) {
	const state = getSessionSuspensionState();
	const queuedGeneration = state.cleanupGeneration;
	const run = state.suspensionWriteChain.catch(() => void 0).then(() => suspendSessionQueued(params, queuedGeneration));
	state.suspensionWriteChain = run.then(() => void 0, () => void 0);
	await run;
}
async function suspendSessionQueued(params, queuedGeneration) {
	if (!params.cfg) return;
	const agentIdFromDir = params.agentDir ? resolveRegisteredAgentIdForDir(params.agentDir) : void 0;
	const { sessionKey, storePath } = resolveStoredSessionKeyForSessionId({
		cfg: params.cfg,
		sessionId: params.sessionId,
		agentId: params.agentId ?? agentIdFromDir
	});
	if (!sessionKey) return;
	const ttlMs = resolveTimerTimeoutMs(params.ttlMs, DEFAULT_QUOTA_SUSPENSION_RESUME_MS, 0);
	const now = Date.now();
	const expectedResumeBy = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now }) ?? now;
	const state = getSessionSuspensionState();
	if (state.cleanupActive || state.cleanupGeneration !== queuedGeneration) return;
	const suspensionGeneration = state.cleanupGeneration;
	const pendingWriteKey = `${storePath}\0${sessionKey}`;
	const existingPendingWrite = state.pendingSuspensionWrites.get(pendingWriteKey);
	const pendingWrite = existingPendingWrite?.generation === suspensionGeneration ? existingPendingWrite : {
		generation: suspensionGeneration,
		previousQuotaSuspension: void 0,
		previousSnapshotCaptured: false,
		activeCount: 0
	};
	pendingWrite.activeCount += 1;
	state.pendingSuspensionWrites.set(pendingWriteKey, pendingWrite);
	const releasePendingWrite = () => {
		pendingWrite.activeCount -= 1;
		if (pendingWrite.activeCount <= 0 && getSessionSuspensionState().pendingSuspensionWrites.get(pendingWriteKey) === pendingWrite) getSessionSuspensionState().pendingSuspensionWrites.delete(pendingWriteKey);
	};
	let persistedSuspension;
	try {
		persistedSuspension = await patchSessionEntryCore({
			storePath,
			sessionKey
		}, (entry) => {
			if (getSessionSuspensionState().cleanupGeneration !== suspensionGeneration) return null;
			if (!pendingWrite.previousSnapshotCaptured) {
				pendingWrite.previousQuotaSuspension = entry.quotaSuspension;
				pendingWrite.previousSnapshotCaptured = true;
			}
			return { quotaSuspension: {
				schemaVersion: 1,
				suspendedAt: now,
				reason: params.reason,
				failedProvider: params.failedProvider,
				failedModel: params.failedModel,
				summary: params.summary,
				expectedResumeBy,
				state: "suspended"
			} };
		}, {
			skipMaintenance: true,
			takeCacheOwnership: true
		}) !== null;
	} catch (err) {
		log.warn("failed to persist quota suspension", {
			sessionId: params.sessionId,
			error: err instanceof Error ? err.message : String(err)
		});
		releasePendingWrite();
		return;
	}
	const postPatchState = getSessionSuspensionState();
	if (persistedSuspension && (postPatchState.cleanupActive || suspensionGeneration !== postPatchState.cleanupGeneration)) {
		try {
			await patchSessionEntryCore({
				storePath,
				sessionKey
			}, (entry) => entry.quotaSuspension?.suspendedAt === now && entry.quotaSuspension.reason === params.reason && entry.quotaSuspension.failedProvider === params.failedProvider && entry.quotaSuspension.failedModel === params.failedModel ? { quotaSuspension: pendingWrite.previousQuotaSuspension } : null, {
				skipMaintenance: true,
				takeCacheOwnership: true
			});
		} catch (err) {
			log.warn("failed to clear quota suspension after shutdown cleanup", {
				sessionId: params.sessionId,
				error: err instanceof Error ? err.message : String(err)
			});
		}
		releasePendingWrite();
		return;
	}
	releasePendingWrite();
}
function resetSessionSuspensionStateForTest() {
	const state = getSessionSuspensionState();
	state.cleanupGeneration += 1;
	state.pendingSuspensionWrites.clear();
	state.suspensionWriteChain = Promise.resolve();
	state.cleanupActive = false;
}
function isSessionSuspensionWriteCleanupActiveForTest() {
	return getSessionSuspensionState().cleanupActive;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionSuspensionTestApi")] = {
	isSessionSuspensionWriteCleanupActiveForTest,
	resetSessionSuspensionStateForTest
};
//#endregion
export { runWithDeferredSessionSuspension as a, resolveSessionSuspensionTarget as i, fenceSessionSuspensionWritesForGatewayShutdown as n, suspendSession as o, resolveSessionSuspensionReason as r, enableSessionSuspensionWritesForGatewayStart as t };
