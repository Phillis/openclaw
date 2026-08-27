import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { a as isSubagentSessionKey, i as isCronSessionKey, n as isAcpSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { Wt as hasSessionEntriesByStatusReadOnly } from "./session-accessor-CVnxp3UM.js";
import { n as listConfiguredSessionStoreAgentIds, o as resolveAllAgentSessionStoreTargetsSync, u as resolveAgentSessionDirs } from "./targets-BzJLDErS.js";
import "./sessions-B_ifzq5W.js";
import { o as sanitizePendingFinalDeliveryText, t as PENDING_FINAL_DELIVERY_CLEAR_PATCH } from "./pending-final-delivery-COvipX9I.js";
import { n as buildMainSessionRecoveryClearPatch } from "./main-session-recovery-clear-H7IP1700.js";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-shared.ts
const mainSessionRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
function buildRestartRecoveryExpectedState(entry, mainRestartRecovery) {
	const expectedMainRestartRecovery = mainRestartRecovery ?? entry.mainRestartRecovery;
	return {
		abortedLastRun: entry.abortedLastRun,
		mainRestartRecoveryCycleId: expectedMainRestartRecovery?.cycleId,
		mainRestartRecoveryRevision: expectedMainRestartRecovery?.revision,
		restartRecoveryBeforeAgentReplyState: entry.restartRecoveryBeforeAgentReplyState,
		restartRecoveryDeliveryReceiptState: entry.restartRecoveryDeliveryReceiptState,
		restartRecoveryDeliveryToolCallId: entry.restartRecoveryDeliveryToolCallId,
		restartRecoveryDeliveryRequestFingerprint: entry.restartRecoveryDeliveryRequestFingerprint,
		restartRecoveryDeliveryRunId: entry.restartRecoveryDeliveryRunId,
		restartRecoveryDeliverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
		restartRecoveryRequesterAccountId: entry.restartRecoveryRequesterAccountId,
		restartRecoveryRequesterSenderId: entry.restartRecoveryRequesterSenderId,
		restartRecoverySameChannelThreadRequired: entry.restartRecoverySameChannelThreadRequired,
		restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
		restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
		restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds,
		status: entry.status
	};
}
function normalizeStringSet(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const trimmed = value.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return normalized;
}
const normalizeFiniteTimestamp = asFiniteNumber;
function hasCurrentProcessOwner(params) {
	if (params.activeSessionIds.has(params.entry.sessionId)) return true;
	return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}
async function resolveRestartRecoveryStorePaths(params) {
	const storePaths = /* @__PURE__ */ new Set();
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
	if (params.cfg) {
		const configuredAgentIds = listConfiguredSessionStoreAgentIds(params.cfg);
		const configuredStorePaths = new Set(configuredAgentIds.map((agentId) => path.resolve(resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId,
			env
		}))));
		const configuredAgentIdSet = new Set(configuredAgentIds);
		for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env })) {
			const storePath = path.resolve(target.storePath);
			if (!configuredAgentIdSet.has(target.agentId) && !configuredStorePaths.has(storePath)) continue;
			storePaths.add(storePath);
		}
	} else for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) storePaths.add(path.join(sessionsDir, "sessions.json"));
	return [...storePaths].filter((storePath) => hasSessionEntriesByStatusReadOnly({
		env,
		storePath
	}, ["running"])).toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/agents/main-session-recovery/main-session-recovery-state.ts
function updateRecoveryState(entry, state, patch) {
	return entry.mainRestartRecovery = {
		...state,
		revision: state.revision + 1,
		...patch
	};
}
function createCycle(cycleId) {
	return {
		cycleId,
		revision: 1,
		chargedAttempts: 0
	};
}
function matchesObservation(entry, observation) {
	if (entry.sessionId !== observation.sessionId) return "session_replaced";
	if (entry.mainRestartRecovery?.cycleId !== observation.cycleId) return "stale_cycle";
	return entry.mainRestartRecovery.revision === observation.revision ? null : "stale_revision";
}
function hasCurrentForegroundClaim(state, lifecycleGeneration) {
	return state.foregroundClaims?.lifecycleGeneration === lifecycleGeneration && state.foregroundClaims.tokens.length > 0;
}
function ownsForegroundClaim(state, claim) {
	return state?.cycleId === claim.cycleId && state.foregroundClaims?.lifecycleGeneration === claim.lifecycleGeneration && state.foregroundClaims.tokens.includes(claim.claimId);
}
function validateRecoveryAdmission(entry, command) {
	const state = entry.mainRestartRecovery;
	if (entry.sessionId !== command.sessionId) return "session_replaced";
	if (entry.status !== "running" || entry.abortedLastRun !== true || !state) return "not_interrupted";
	if (state.reservation?.runId !== command.runId || state.reservation.lifecycleGeneration !== command.lifecycleGeneration) return "stale_reservation";
	return hasCurrentForegroundClaim(state, command.lifecycleGeneration) ? "foreground_active" : null;
}
/** Keeps distinct concurrent runs while transferring each run id to its newest lifecycle owner. */
function normalizeMainSessionRecoveryRunFences(runs) {
	return [...new Map([...runs].map((run) => [run.runId, run])).values()].toSorted((left, right) => left.runId.localeCompare(right.runId));
}
function recordLifecycleFence(entry, run) {
	entry.restartRecoveryRuns = normalizeMainSessionRecoveryRunFences([...entry.restartRecoveryRuns ?? [], run]);
}
function isMainRestartRecoveryCandidate(entry, sessionKey) {
	if (typeof entry.spawnDepth === "number" && entry.spawnDepth > 0) return false;
	if (entry.subagentRole != null) return false;
	return !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey) && !isAcpSessionKey(sessionKey);
}
function isMainSessionRecoveryPending(entry, sessionKey) {
	const state = entry.mainRestartRecovery;
	return entry.status === "running" && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, sessionKey) && !state?.foregroundClaims && !state?.reservation && !state?.tombstone;
}
function inspectMainRestartRecoveryRolloverEligibility(entry) {
	if (!entry.mainRestartRecovery?.tombstone) return {
		eligible: false,
		reason: "not_tombstoned"
	};
	const recoveredSessionId = entry.mainRestartRecovery.tombstone.recoveredSessionId;
	const recoveredSessionKey = entry.mainRestartRecovery.tombstone.recoveredSessionKey;
	if (recoveredSessionId || recoveredSessionKey) return {
		eligible: false,
		reason: "already_recovered",
		...recoveredSessionId ? { recoveredSessionId } : {},
		...recoveredSessionKey ? { recoveredSessionKey } : {}
	};
	return { eligible: true };
}
function hasOrphanedMainRestartRecoveryFences(entry, sessionKey) {
	return entry.status === "running" && entry.abortedLastRun !== true && entry.restartRecoveryRuns !== void 0 && entry.mainRestartRecovery === void 0 && entry.restartRecoveryDeliveryRunId === void 0 && isMainRestartRecoveryCandidate(entry, sessionKey) || entry.status !== "running" && entry.mainRestartRecovery === void 0 && isMainRestartRecoveryCandidate(entry, sessionKey) && (entry.restartRecoveryRuns !== void 0 || entry.abortedLastRun === true);
}
function inspectMainSessionRecovery(params) {
	const { entry } = params;
	const state = entry.mainRestartRecovery;
	if (state?.tombstone) return { status: "tombstoned" };
	if (state && hasCurrentForegroundClaim(state, params.lifecycleGeneration)) return { status: "blocked" };
	if (entry.status === "running" && entry.abortedLastRun !== true && state && entry.restartRecoveryRuns?.some((run) => run.lifecycleGeneration === params.lifecycleGeneration)) return { status: "blocked" };
	if (entry.status !== "running" || entry.abortedLastRun !== true || !isMainRestartRecoveryCandidate(entry, params.sessionKey)) return { status: "inactive" };
	if (!state) return { status: "inactive" };
	const observation = {
		sessionId: entry.sessionId,
		cycleId: state.cycleId,
		revision: state.revision
	};
	if (state.reservation) return { status: "blocked" };
	if (state.chargedAttempts >= 3) return {
		status: "exhausted",
		observation,
		reason: `main-session restart recovery blocked after ${state.chargedAttempts} charged automatic resume attempts; inspect the failed main session and use /new or reset to start a replacement session`
	};
	return {
		status: "recoverable",
		observation,
		nextAttempt: state.chargedAttempts + 1
	};
}
function inspectMainSessionRecoveryForAdmission(params) {
	if (params.entry.status === "running" && params.entry.abortedLastRun !== true && params.entry.mainRestartRecovery && params.entry.restartRecoveryRuns?.length) return { status: "blocked" };
	if (params.entry.status === "running" && params.entry.abortedLastRun === true && isMainRestartRecoveryCandidate(params.entry, params.sessionKey) && !params.entry.mainRestartRecovery) return { status: "blocked" };
	return inspectMainSessionRecovery(params);
}
function transitionMainSessionRecovery(entry, command) {
	switch (command.kind) {
		case "mark_interrupted":
			if (!entry.mainRestartRecovery) entry.mainRestartRecovery = createCycle(command.cycleId);
			entry.status = "running";
			entry.lifecycleRunId = void 0;
			entry.abortedLastRun = true;
			if (command.resetRuntime) {
				entry.startedAt = void 0;
				entry.endedAt = void 0;
				entry.runtimeMs = void 0;
			}
			for (const run of command.runs ?? []) recordLifecycleFence(entry, run);
			entry.updatedAt = command.now;
			return { kind: "applied" };
		case "inspect": return {
			kind: "observed",
			view: inspectMainSessionRecoveryForAdmission({
				entry,
				lifecycleGeneration: command.lifecycleGeneration,
				sessionKey: command.sessionKey
			})
		};
		case "observe": {
			if (entry.status === "running" && entry.abortedLastRun === true && isMainRestartRecoveryCandidate(entry, command.sessionKey) && !entry.mainRestartRecovery) entry.mainRestartRecovery = createCycle(command.cycleId);
			let state = entry.mainRestartRecovery;
			if (state?.foregroundClaims && state.foregroundClaims.lifecycleGeneration !== command.lifecycleGeneration) if (entry.abortedLastRun !== true) {
				Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
				state = void 0;
			} else state = updateRecoveryState(entry, state, { foregroundClaims: void 0 });
			if (state?.reservation && state.reservation.lifecycleGeneration !== command.lifecycleGeneration) updateRecoveryState(entry, state, { reservation: void 0 });
			return {
				kind: "observed",
				view: inspectMainSessionRecovery({
					entry,
					lifecycleGeneration: command.lifecycleGeneration,
					sessionKey: command.sessionKey
				})
			};
		}
		case "prepare_attempt": {
			const conflict = matchesObservation(entry, command.observation);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			const state = entry.mainRestartRecovery;
			if (entry.status !== "running" || entry.abortedLastRun !== true) return {
				kind: "rejected",
				reason: "not_interrupted"
			};
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			if (state.reservation) return {
				kind: "rejected",
				reason: "reservation_active"
			};
			if (command.attempt !== state.chargedAttempts + 1) return {
				kind: "rejected",
				reason: "stale_revision"
			};
			const executionIdentityAdmission = command.executionIdentity.state === "disabled" ? void 0 : state.executionIdentity?.runId === command.runId ? {
				kind: "retry-reference",
				token: state.executionIdentity
			} : void 0;
			updateRecoveryState(entry, state, {
				...command.executionIdentity.state === "disabled" ? { executionIdentity: void 0 } : {},
				chargedAttempts: command.attempt,
				reservation: {
					runId: command.runId,
					attempt: command.attempt,
					lifecycleGeneration: command.lifecycleGeneration
				}
			});
			entry.updatedAt = command.now;
			return {
				kind: "reserved",
				reservation: {
					sessionId: entry.sessionId,
					cycleId: state.cycleId,
					lifecycleGeneration: command.lifecycleGeneration,
					runId: command.runId,
					attempt: command.attempt,
					...executionIdentityAdmission ? { executionIdentityAdmission } : {}
				}
			};
		}
		case "bind_admitted_execution_identity": {
			const state = entry.mainRestartRecovery;
			if (!state || state.cycleId !== command.cycleId || state.chargedAttempts !== command.attempt || entry.sessionId !== command.sessionId || entry.lifecycleRunId !== command.runId || !entry.restartRecoveryRuns?.some((run) => run.runId === command.runId && run.lifecycleGeneration === command.lifecycleGeneration) || command.token.runId !== command.runId) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			if (state.executionIdentity) return JSON.stringify(state.executionIdentity) === JSON.stringify(command.token) ? { kind: "no_change" } : {
				kind: "rejected",
				reason: "stale_reservation"
			};
			updateRecoveryState(entry, state, { executionIdentity: command.token });
			return { kind: "applied" };
		}
		case "cancel_reservation":
		case "abandon_reservation": {
			const state = entry.mainRestartRecovery;
			const reserved = state?.reservation;
			if (!state || entry.sessionId !== command.reservation.sessionId || state.cycleId !== command.reservation.cycleId || reserved?.runId !== command.reservation.runId || reserved.attempt !== command.reservation.attempt || reserved.lifecycleGeneration !== command.reservation.lifecycleGeneration) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			updateRecoveryState(entry, state, {
				chargedAttempts: command.kind === "cancel_reservation" ? Math.max(0, command.reservation.attempt - 1) : state.chargedAttempts,
				reservation: void 0
			});
			return { kind: "applied" };
		}
		case "validate_recovery": {
			const conflict = validateRecoveryAdmission(entry, command);
			return conflict ? {
				kind: "rejected",
				reason: conflict
			} : { kind: "recovery_validated" };
		}
		case "admit_recovery": {
			const conflict = validateRecoveryAdmission(entry, command);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			const state = entry.mainRestartRecovery;
			updateRecoveryState(entry, state, {
				reservation: void 0,
				foregroundClaims: void 0
			});
			entry.abortedLastRun = false;
			entry.lifecycleRunId = command.runId;
			recordLifecycleFence(entry, {
				runId: command.runId,
				lifecycleGeneration: command.lifecycleGeneration
			});
			if (entry.pendingFinalDelivery?.kind === "replayable") {
				const pendingText = sanitizePendingFinalDeliveryText(entry.pendingFinalDelivery.text);
				if (pendingText) entry.pendingFinalDelivery = {
					...entry.pendingFinalDelivery,
					text: pendingText
				};
				else Object.assign(entry, PENDING_FINAL_DELIVERY_CLEAR_PATCH);
			}
			return { kind: "admitted_recovery" };
		}
		case "mark_admitted_recovery_interrupted": {
			const state = entry.mainRestartRecovery;
			if (entry.sessionId !== command.sessionId) return {
				kind: "rejected",
				reason: "session_replaced"
			};
			if (!state || state.reservation || !entry.restartRecoveryRuns?.some((run) => run.runId === command.runId && run.lifecycleGeneration === command.lifecycleGeneration)) return {
				kind: "rejected",
				reason: "stale_reservation"
			};
			entry.status = "running";
			entry.lifecycleRunId = void 0;
			entry.abortedLastRun = true;
			entry.startedAt = void 0;
			entry.endedAt = void 0;
			entry.runtimeMs = void 0;
			if (entry.restartRecoveryDeliveryRunId === command.runId) entry.restartRecoveryDeliveryRunId = void 0;
			entry.updatedAt = command.now;
			return { kind: "applied" };
		}
		case "claim_foreground": {
			if (entry.sessionId === command.sessionId && hasOrphanedMainRestartRecoveryFences(entry, command.sessionKey)) {
				Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
				return { kind: "applied" };
			}
			if (entry.sessionId !== command.sessionId || entry.status !== "running" || entry.abortedLastRun !== true || !isMainRestartRecoveryCandidate(entry, command.sessionKey)) return { kind: "no_change" };
			const state = entry.mainRestartRecovery ?? createCycle(command.cycleId);
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			if (state.chargedAttempts >= 3) return {
				kind: "rejected",
				reason: "recovery_exhausted"
			};
			const currentTokens = state.foregroundClaims?.lifecycleGeneration === command.lifecycleGeneration ? state.foregroundClaims.tokens : [];
			const tokens = [.../* @__PURE__ */ new Set([...currentTokens, command.claimId])].toSorted();
			const currentRunIds = state.foregroundClaims?.lifecycleGeneration === command.lifecycleGeneration ? state.foregroundClaims.runIdsByClaimId : void 0;
			const runIdsByClaimId = command.runId ? {
				...currentRunIds,
				[command.claimId]: command.runId
			} : currentRunIds;
			if (command.runId) recordLifecycleFence(entry, {
				lifecycleGeneration: command.lifecycleGeneration,
				runId: command.runId
			});
			updateRecoveryState(entry, state, {
				reservation: state.reservation?.lifecycleGeneration === command.lifecycleGeneration ? state.reservation : void 0,
				foregroundClaims: {
					lifecycleGeneration: command.lifecycleGeneration,
					tokens,
					...runIdsByClaimId ? { runIdsByClaimId } : {}
				}
			});
			return {
				kind: "foreground_claimed",
				claim: {
					cycleId: state.cycleId,
					lifecycleGeneration: command.lifecycleGeneration,
					claimId: command.claimId,
					sessionId: entry.sessionId,
					sessionKey: command.sessionKey,
					...command.runId ? { runId: command.runId } : {}
				}
			};
		}
		case "bind_foreground_run": {
			const state = entry.mainRestartRecovery;
			const claims = state?.foregroundClaims;
			if (!state || !claims || !ownsForegroundClaim(state, command.claim)) return { kind: "no_change" };
			recordLifecycleFence(entry, {
				lifecycleGeneration: command.claim.lifecycleGeneration,
				runId: command.runId
			});
			updateRecoveryState(entry, state, { foregroundClaims: {
				...claims,
				runIdsByClaimId: {
					...claims.runIdsByClaimId,
					[command.claim.claimId]: command.runId
				}
			} });
			return { kind: "applied" };
		}
		case "validate_foreground": {
			const state = entry.mainRestartRecovery;
			return entry.sessionId === command.claim.sessionId && ownsForegroundClaim(state, command.claim) ? { kind: "foreground_validated" } : { kind: "no_change" };
		}
		case "release_foreground": {
			const state = entry.mainRestartRecovery;
			const claims = state?.foregroundClaims;
			if (!state || !claims || !ownsForegroundClaim(state, command.claim)) return { kind: "no_change" };
			const tokens = claims.tokens.filter((token) => token !== command.claim.claimId);
			const runIdsByClaimId = Object.fromEntries(Object.entries(claims.runIdsByClaimId ?? {}).filter(([token]) => token !== command.claim.claimId));
			if (tokens.length === 0 && entry.abortedLastRun !== true) {
				Object.assign(entry, buildMainSessionRecoveryClearPatch(entry));
				return { kind: "applied" };
			}
			updateRecoveryState(entry, state, { foregroundClaims: tokens.length > 0 ? {
				lifecycleGeneration: command.claim.lifecycleGeneration,
				tokens,
				...Object.keys(runIdsByClaimId).length > 0 ? { runIdsByClaimId } : {}
			} : void 0 });
			return { kind: "applied" };
		}
		case "tombstone": {
			const conflict = matchesObservation(entry, command.observation);
			if (conflict) return {
				kind: "rejected",
				reason: conflict
			};
			const state = entry.mainRestartRecovery;
			if (state.reservation) return {
				kind: "rejected",
				reason: "reservation_active"
			};
			if (state.tombstone) return {
				kind: "rejected",
				reason: "already_tombstoned"
			};
			updateRecoveryState(entry, state, { tombstone: { reason: command.reason } });
			entry.abortedLastRun = false;
			entry.status = "failed";
			entry.lifecycleRunId = void 0;
			entry.endedAt = command.now;
			entry.runtimeMs = Math.max(0, command.now - (entry.startedAt ?? command.now));
			entry.updatedAt = command.now;
			return { kind: "tombstoned" };
		}
		case "doctor_repair":
			if (!entry.mainRestartRecovery?.tombstone || entry.abortedLastRun !== true) return { kind: "no_change" };
			entry.abortedLastRun = false;
			entry.updatedAt = command.now;
			return { kind: "doctor_repaired" };
		case "clear": {
			const patch = buildMainSessionRecoveryClearPatch(entry);
			if (Object.keys(patch).length === 0) return { kind: "no_change" };
			Object.assign(entry, patch);
			return { kind: "applied" };
		}
		default: return command;
	}
}
//#endregion
export { transitionMainSessionRecovery as a, hasCurrentProcessOwner as c, normalizeStringSet as d, resolveRestartRecoveryStorePaths as f, normalizeMainSessionRecoveryRunFences as i, mainSessionRecoveryLog as l, isMainRestartRecoveryCandidate as n, DEFAULT_RECOVERY_DELAY_MS as o, isMainSessionRecoveryPending as r, buildRestartRecoveryExpectedState as s, inspectMainRestartRecoveryRolloverEligibility as t, normalizeFiniteTimestamp as u };
