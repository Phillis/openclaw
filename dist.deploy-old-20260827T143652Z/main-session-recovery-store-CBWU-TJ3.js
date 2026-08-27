import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { Ot as applySessionEntryReplacements } from "./session-accessor-Bi6bzKQE.js";
import { a as transitionMainSessionRecovery, n as isMainRestartRecoveryCandidate, r as isMainSessionRecoveryPending } from "./main-session-recovery-state-uo_tHZLi.js";
import { a as scheduleMainSessionRecoveryMutation, i as retryMainSessionRecoveryMutation } from "./main-session-recovery-lifecycle-C-qrkjyM.js";
import { randomUUID } from "node:crypto";
//#region src/agents/main-session-recovery/main-session-recovery-store.ts
function matchesReservation(entry, reservation) {
	const state = entry.mainRestartRecovery;
	return entry.sessionId === reservation.sessionId && state?.cycleId === reservation.cycleId && state.reservation?.runId === reservation.runId && state.reservation.lifecycleGeneration === reservation.lifecycleGeneration;
}
function currentGenerationRequiredBy(command) {
	if (command.kind === "validate_foreground" || command.kind === "bind_foreground_run") return command.claim.lifecycleGeneration;
	return "lifecycleGeneration" in command ? command.lifecycleGeneration : void 0;
}
async function commitMainSessionRecovery(params) {
	const reservationCleanup = params.command.kind === "cancel_reservation" || params.command.kind === "abandon_reservation" ? params.command.reservation : void 0;
	const recoveryAdmission = params.command.kind === "admit_recovery" || params.command.kind === "validate_recovery" ? params.command : void 0;
	const ownerClaim = params.command.kind === "claim_foreground" ? params.command : void 0;
	const exactOwnerClaim = params.command.kind === "validate_foreground" || params.command.kind === "release_foreground" ? params.command.claim : void 0;
	const scansAliases = Boolean(params.scanAliases || reservationCleanup || recoveryAdmission || exactOwnerClaim);
	return await applySessionEntryReplacements({
		requireWriteSuccess: params.requireWriteSuccess,
		...scansAliases ? {} : { sessionKeys: [params.target.sessionKey] },
		storePath: params.target.storePath,
		update: (entries) => {
			if (params.shouldContinue?.() === false) return { result: { transition: {
				kind: "rejected",
				reason: "stale_generation"
			} } };
			const expectedGeneration = currentGenerationRequiredBy(params.command);
			if (expectedGeneration && expectedGeneration !== getAgentEventLifecycleGeneration()) return { result: { transition: {
				kind: "rejected",
				reason: "stale_generation"
			} } };
			const selected = entries.find(({ sessionKey }) => sessionKey === params.target.sessionKey);
			let candidate = params.expectedSessionId && selected?.entry.sessionId !== params.expectedSessionId || ownerClaim && selected?.entry.sessionId !== ownerClaim.sessionId ? void 0 : selected;
			if (reservationCleanup) candidate = entries.find(({ entry }) => matchesReservation(entry, reservationCleanup)) ?? selected;
			else if (recoveryAdmission) candidate = entries.find(({ entry }) => {
				const reservation = entry.mainRestartRecovery?.reservation;
				return entry.sessionId === recoveryAdmission.sessionId && reservation?.runId === recoveryAdmission.runId && reservation.lifecycleGeneration === recoveryAdmission.lifecycleGeneration;
			}) ?? selected;
			else if (exactOwnerClaim) candidate = entries.find(({ entry }) => {
				const state = entry.mainRestartRecovery;
				return state?.cycleId === exactOwnerClaim.cycleId && state.foregroundClaims?.lifecycleGeneration === exactOwnerClaim.lifecycleGeneration && state.foregroundClaims.tokens.includes(exactOwnerClaim.claimId);
			}) ?? selected;
			else if (ownerClaim && (!selected || selected.entry.sessionId !== ownerClaim.sessionId)) candidate = entries.find(({ entry }) => entry.sessionId === ownerClaim.sessionId);
			else if (params.scanAliases && params.expectedSessionId) candidate = entries.find(({ entry }) => entry.sessionId === params.expectedSessionId);
			if (!candidate) return { result: {
				entry: selected?.entry,
				sessionKey: selected?.sessionKey,
				transition: {
					kind: "rejected",
					reason: "session_replaced"
				}
			} };
			const entry = candidate.entry;
			const previousRecoveryState = entry.mainRestartRecovery;
			let command;
			if (ownerClaim) command = ownerClaim.sessionKey === candidate.sessionKey ? ownerClaim : {
				...ownerClaim,
				sessionKey: candidate.sessionKey
			};
			else if ((params.command.kind === "observe" || params.command.kind === "inspect") && params.command.sessionKey !== candidate.sessionKey) command = {
				...params.command,
				sessionKey: candidate.sessionKey
			};
			else command = params.command;
			const transition = transitionMainSessionRecovery(entry, command);
			const changed = previousRecoveryState !== entry.mainRestartRecovery || transition.kind !== "foreground_validated" && transition.kind !== "no_change" && transition.kind !== "observed" && transition.kind !== "rejected";
			return {
				result: {
					entry,
					sessionKey: candidate.sessionKey,
					transition
				},
				...changed ? { replacements: [{
					sessionKey: candidate.sessionKey,
					entry
				}] } : {}
			};
		}
	});
}
async function refreshMainSessionRecoveryOwner(lease, runId) {
	const result = await commitMainSessionRecovery({
		command: runId ? {
			kind: "bind_foreground_run",
			claim: lease,
			runId
		} : {
			kind: "validate_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	});
	return (runId ? result.transition.kind === "applied" : result.transition.kind === "foreground_validated") && result.entry && result.sessionKey ? {
		lease: runId ? {
			...lease,
			runId
		} : lease,
		entry: result.entry,
		sessionKey: result.sessionKey
	} : void 0;
}
async function claimMainSessionRecoveryOwner(params) {
	const command = {
		kind: "claim_foreground",
		cycleId: randomUUID(),
		lifecycleGeneration: params.lifecycleGeneration,
		sessionId: params.sessionId,
		sessionKey: params.target.sessionKey,
		claimId: randomUUID(),
		...params.runId ? { runId: params.runId } : {}
	};
	let claim = await commitMainSessionRecovery({
		command,
		requireWriteSuccess: true,
		target: params.target
	});
	if (claim.transition.kind === "rejected" && claim.transition.reason === "session_replaced") claim = await commitMainSessionRecovery({
		command,
		requireWriteSuccess: true,
		scanAliases: true,
		target: params.target
	});
	if (claim.transition.kind === "foreground_claimed") {
		if (!claim.entry || !claim.sessionKey) return {
			kind: "invalidated",
			reason: "state_changed"
		};
		return {
			kind: "claimed",
			lease: {
				...claim.transition.claim,
				storePath: params.target.storePath
			},
			entry: claim.entry,
			sessionKey: claim.sessionKey
		};
	}
	if (claim.transition.kind === "rejected" && claim.transition.reason === "stale_generation") return {
		kind: "invalidated",
		reason: claim.transition.reason
	};
	if (!claim.entry && (params.allowMissingSession || params.replacementSessionId)) return { kind: "not_required" };
	const healthyExpectedSession = claim.entry && claim.entry.abortedLastRun !== true && claim.entry.restartRecoveryRuns === void 0 && claim.entry.mainRestartRecovery === void 0 && (claim.entry.sessionId === params.sessionId || claim.entry.sessionId === params.replacementSessionId);
	if (claim.entry?.sessionId === params.sessionId && claim.sessionKey && !isMainRestartRecoveryCandidate(claim.entry, claim.sessionKey)) return { kind: "not_required" };
	if (healthyExpectedSession) return { kind: "not_required" };
	return {
		kind: "invalidated",
		reason: claim.transition.kind === "rejected" ? claim.transition.reason : "state_changed"
	};
}
async function inspectMainSessionRecoveryRequired(params) {
	const command = {
		kind: "inspect",
		lifecycleGeneration: params.lifecycleGeneration,
		sessionKey: params.target.sessionKey
	};
	let result = await commitMainSessionRecovery({
		command,
		expectedSessionId: params.expectedSessionId,
		requireWriteSuccess: true,
		target: params.target
	});
	if (result.transition.kind === "rejected" && result.transition.reason === "session_replaced") result = await commitMainSessionRecovery({
		command,
		expectedSessionId: params.expectedSessionId,
		requireWriteSuccess: true,
		scanAliases: true,
		target: params.target
	});
	if (result.transition.kind === "observed") return result.transition.view.status === "inactive" ? { kind: "not_required" } : { kind: "required" };
	if (result.transition.kind === "rejected" && result.transition.reason === "session_replaced") return !result.entry && params.allowMissingSession ? { kind: "not_required" } : {
		kind: "invalidated",
		reason: result.transition.reason
	};
	return {
		kind: "invalidated",
		reason: result.transition.kind === "rejected" ? result.transition.reason : "state_changed"
	};
}
async function releaseMainSessionRecoveryOwnerWithRetries(lease) {
	const released = await retryMainSessionRecoveryMutation(async () => commitMainSessionRecovery({
		command: {
			kind: "release_foreground",
			claim: lease
		},
		requireWriteSuccess: true,
		target: lease
	}));
	const { entry, sessionKey } = released;
	if (released.transition.kind !== "applied" && released.transition.kind !== "no_change" || !entry || !sessionKey || entry.sessionId !== lease.sessionId || !isMainSessionRecoveryPending(entry, sessionKey)) return;
	return {
		sessionId: entry.sessionId,
		sessionKey,
		storePath: lease.storePath
	};
}
function scheduleMainSessionRecoveryOwnerRelease(lease, onDeferredSuccess) {
	scheduleMainSessionRecoveryMutation({
		mutation: () => releaseMainSessionRecoveryOwnerWithRetries(lease),
		onSuccess: onDeferredSuccess ?? (async (pending) => {
			if (pending) {
				const { scheduleMainSessionRecoveryPendingTarget } = await import("./main-session-recovery-owner-release-8EiDwKLi.js");
				scheduleMainSessionRecoveryPendingTarget(pending);
			}
		})
	});
}
async function releaseMainSessionRecoveryOwner(lease, options) {
	if (!lease) return;
	try {
		return await releaseMainSessionRecoveryOwnerWithRetries(lease);
	} catch (error) {
		scheduleMainSessionRecoveryOwnerRelease(lease, options?.onDeferredSuccess);
		throw error;
	}
}
//#endregion
export { releaseMainSessionRecoveryOwner as a, refreshMainSessionRecoveryOwner as i, commitMainSessionRecovery as n, inspectMainSessionRecoveryRequired as r, claimMainSessionRecoveryOwner as t };
