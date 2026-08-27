import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { c as isAgentEventLifecycleGenerationCurrent, s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import "./config-CfeGo4K4.js";
import { Qt as loadSessionEntry, en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import { Z as cancelSessionWorkAdmissionHandoff, z as beginSessionWorkAdmission } from "./agent-harness-session-key-BpWapmwX.js";
import "./sessions-Bh837xaa.js";
import { c as readSessionMessagesAsync, n as extractSessionTranscriptText, t as extractMessageRole } from "./session-transcript-readers-BIeuEaZ3.js";
import { i as isStaleUnendedSubagentRun, s as getSubagentSessionStartedAt } from "./subagent-run-liveness-Xp6SfCLg.js";
import { n as formatSubagentRecoveryWedgedReason, r as isSubagentRecoveryWedgedEntry } from "./subagent-recovery-state-DZjW-qZw.js";
import { r as resolveInternalSessionEffectsTarget } from "./internal-session-effects-cThun48j.js";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.js";
import { createHash } from "node:crypto";
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-helpers.ts
function getRestartRecoveryReplayError(entry) {
	return entry.terminalOwner !== "interrupted-recovery" || entry.pauseReason === "sessions_yield" || entry.execution.status !== "terminal" || typeof entry.execution.endedAt !== "number" || entry.execution.outcome?.status !== "error" || entry.endedReason !== "subagent-error" ? void 0 : entry.execution.outcome.error ?? "subagent run interrupted by gateway restart";
}
function isRestartRecoveryLifecycleCurrent(receipt) {
	return !receipt.lifecycleGeneration || isAgentEventLifecycleGenerationCurrent(receipt.lifecycleGeneration);
}
function buildRestartRecoveryResumeMessage(task, lastHumanMessage) {
	return formatSystemTurnPrompt(`Your previous turn was interrupted by a gateway restart. Your original task was:\n\n${task.length > 2e3 ? `${truncateUtf16Safe(task, 2e3)}...` : task}\n\n` + (lastHumanMessage ? `The last message from the user before the interruption was:\n\n${lastHumanMessage}\n\n` : "") + `Please continue where you left off.`);
}
function buildRestartRecoveryIdempotencyKey(runId, sessionMarker) {
	return `subagent-recovery:${createHash("sha256").update(runId).update("\0").update(sessionMarker).digest("hex")}`;
}
function assertRestartRecoverySnapshotCurrent(params) {
	const current = loadSessionEntry({
		storePath: params.storePath,
		sessionKey: params.childSessionKey,
		clone: false
	});
	if (!params.isOwnerCurrent() || current?.sessionId !== params.sessionId || params.sessionLifecycleRevision !== void 0 && current.lifecycleRevision !== params.sessionLifecycleRevision || current.updatedAt !== params.updatedAt || current.abortedLastRun !== true) throw new Error("subagent restart recovery session snapshot changed before dispatch");
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery-session.ts
async function settleAcceptedRecoverySession(params) {
	let settled = false;
	await patchSessionEntryCore({
		storePath: params.storePath,
		sessionKey: params.childSessionKey
	}, (current) => {
		if (!params.isOwnerCurrent() || current.sessionId !== params.sessionId || params.sessionLifecycleRevision !== void 0 && current.lifecycleRevision !== params.sessionLifecycleRevision) return current;
		if (current.abortedLastRun !== true) {
			settled = true;
			return current;
		}
		current.abortedLastRun = false;
		current.subagentRecovery = {
			automaticAttempts: Math.max(current.subagentRecovery?.automaticAttempts ?? 0, params.attempts + 1),
			lastAttemptAt: params.now,
			lastRunId: params.runId
		};
		current.updatedAt = params.now;
		settled = true;
		return current;
	}, {
		assertCommitAllowed: () => {
			if (!params.isOwnerCurrent()) throw new Error("subagent restart recovery lifecycle retired before session commit");
		},
		replaceEntry: true,
		skipMaintenance: true
	});
	return settled;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-restart-recovery.ts
const MAX_RECOVERY_ATTEMPTS = 2;
const RECOVERY_ATTEMPT_WINDOW_MS = 2 * 6e4;
async function reconcileAcceptedRecovery(params) {
	let owner = params.entry;
	if (!isRestartRecoveryLifecycleCurrent(params.receipt)) return {
		status: "terminal",
		error: "retired Gateway lifecycle",
		suppressSessionEffects: true,
		target: {
			runId: owner.runId,
			entry: owner
		}
	};
	if (params.runId !== params.receipt.idempotencyKey) {
		let remapped = false;
		try {
			remapped = params.isCurrent(params.runId, params.entry) && params.replaceRun({
				previousRunId: params.runId,
				nextRunId: params.receipt.idempotencyKey,
				fallback: params.entry,
				expected: params.entry,
				transcriptTarget: resolveInternalSessionEffectsTarget({
					agentId: params.agentId,
					runId: params.receipt.idempotencyKey,
					storePath: params.storePath
				}),
				task: params.entry.task,
				restartRecovery: params.receipt,
				persistenceFailure: "return-false"
			});
		} catch {}
		if (!remapped) {
			params.warn("accepted subagent restart recovery could not remap its exact row", {
				runId: params.runId,
				childSessionKey: params.childSessionKey
			});
			return { status: "deferred" };
		}
		const successor = params.getRun(params.receipt.idempotencyKey);
		if (!successor || successor.execution.restartRecovery !== params.receipt || !params.isCurrent(successor.runId, successor)) {
			params.warn("accepted subagent restart recovery lost its remapped owner", {
				runId: params.runId,
				childSessionKey: params.childSessionKey
			});
			return { status: "deferred" };
		}
		owner = successor;
	}
	const ownsAcceptedTarget = () => params.isCurrent(owner.runId, owner) && owner.execution.restartRecovery === params.receipt && isRestartRecoveryLifecycleCurrent(params.receipt);
	if (!params.currentSessionId || params.currentSessionId !== params.receipt.sessionId || params.receipt.sessionLifecycleRevision !== void 0 && params.currentSessionLifecycleRevision !== params.receipt.sessionLifecycleRevision) return {
		status: "terminal",
		error: "accepted subagent restart recovery lost its exact session before ownership settlement",
		suppressSessionEffects: true,
		target: {
			runId: owner.runId,
			entry: owner
		}
	};
	try {
		if (!await settleAcceptedRecoverySession({
			attempts: params.attempts,
			childSessionKey: params.childSessionKey,
			isOwnerCurrent: ownsAcceptedTarget,
			sessionId: params.receipt.sessionId,
			sessionLifecycleRevision: params.receipt.sessionLifecycleRevision,
			now: params.now,
			runId: owner.runId,
			storePath: params.storePath
		})) {
			if (!isRestartRecoveryLifecycleCurrent(params.receipt)) return {
				status: "terminal",
				error: "retired Gateway lifecycle",
				suppressSessionEffects: true,
				target: {
					runId: owner.runId,
					entry: owner
				}
			};
			params.warn("accepted subagent restart recovery session changed during settlement", {
				runId: owner.runId,
				childSessionKey: params.childSessionKey
			});
			return { status: "deferred" };
		}
	} catch (error) {
		if (!isRestartRecoveryLifecycleCurrent(params.receipt)) return {
			status: "terminal",
			error: "retired Gateway lifecycle",
			suppressSessionEffects: true,
			target: {
				runId: owner.runId,
				entry: owner
			}
		};
		params.warn("accepted subagent restart recovery could not clear its abort marker", {
			runId: owner.runId,
			childSessionKey: params.childSessionKey,
			error
		});
		return { status: "deferred" };
	}
	if (!isRestartRecoveryLifecycleCurrent(params.receipt)) return {
		status: "terminal",
		error: "retired Gateway lifecycle",
		suppressSessionEffects: true,
		target: {
			runId: owner.runId,
			entry: owner
		}
	};
	try {
		if (!ownsAcceptedTarget() || !params.clearAcceptedRecovery({
			runId: owner.runId,
			expected: owner,
			sessionId: params.receipt.sessionId,
			idempotencyKey: params.receipt.idempotencyKey
		})) {
			params.warn("accepted subagent restart recovery could not retire its receipt", {
				runId: owner.runId,
				childSessionKey: params.childSessionKey
			});
			return { status: "deferred" };
		}
	} catch (error) {
		params.warn("accepted subagent restart recovery could not persist receipt retirement", {
			error,
			runId: owner.runId,
			childSessionKey: params.childSessionKey
		});
		return { status: "deferred" };
	}
	if (!params.isCurrent(owner.runId, owner) || !params.resumeAcceptedRecovery({
		runId: owner.runId,
		expected: owner
	})) {
		params.warn("accepted subagent restart recovery lost its settled owner", {
			runId: owner.runId,
			childSessionKey: params.childSessionKey
		});
		return { status: "deferred" };
	}
	return { status: "accepted" };
}
async function recoverInterruptedSubagentRow(params) {
	const recoveryLifecycleGeneration = getAgentEventLifecycleGeneration();
	const isRecoveryAttemptLifecycleCurrent = () => isAgentEventLifecycleGenerationCurrent(recoveryLifecycleGeneration);
	const initialRecoveryReceipt = params.entry.execution.restartRecovery;
	const legacyRestartTimeout = params.entry.execution.outcome?.status === "timeout" && typeof params.entry.execution.endedAt === "number";
	const acceptedRecoveryCurrent = initialRecoveryReceipt?.phase === "accepted" && params.isCurrent(params.runId, params.entry);
	const isRecoverySourceCurrent = () => isRecoveryAttemptLifecycleCurrent() && params.isCurrent(params.runId, params.entry) && params.entry.pauseReason !== "sessions_yield" && params.entry.suppressAnnounceReason !== "steer-restart" && params.entry.killReconciliation === void 0 && params.entry.killIntent === void 0 && typeof params.entry.execution.endedAt !== "number";
	if (initialRecoveryReceipt && !isRestartRecoveryLifecycleCurrent(initialRecoveryReceipt)) return {
		status: "terminal",
		error: "retired Gateway lifecycle",
		endedAt: params.entry.execution.endedAt,
		suppressSessionEffects: true
	};
	if (!acceptedRecoveryCurrent) {
		const terminalError = getRestartRecoveryReplayError(params.entry);
		if (terminalError) return {
			status: "terminal",
			error: terminalError,
			endedAt: params.entry.execution.endedAt
		};
	}
	if (!acceptedRecoveryCurrent && !legacyRestartTimeout && !isRecoverySourceCurrent()) return { status: "ignored" };
	const childSessionKey = params.entry.childSessionKey.trim();
	if (!childSessionKey) return { status: "ignored" };
	try {
		const agentId = resolveAgentIdFromSessionKey(childSessionKey);
		const storePath = resolveSessionStorePathCore(getRuntimeConfig().session?.store, { agentId });
		const sessionEntry = loadSessionEntry({
			storePath,
			sessionKey: childSessionKey,
			clone: false
		});
		const recovery = sessionEntry?.subagentRecovery;
		const attempts = typeof recovery?.lastAttemptAt === "number" && Number.isFinite(recovery.lastAttemptAt) && params.now - recovery.lastAttemptAt <= RECOVERY_ATTEMPT_WINDOW_MS && typeof recovery.automaticAttempts === "number" && Number.isFinite(recovery.automaticAttempts) && recovery.automaticAttempts > 0 ? Math.floor(recovery.automaticAttempts) : 0;
		const currentRecoveryReceipt = params.entry.execution.restartRecovery;
		const abandonedError = "subagent restart recovery was abandoned after an ambiguous Gateway restart; automatic replay was suppressed to avoid duplicate side effects";
		if (currentRecoveryReceipt && !isRestartRecoveryLifecycleCurrent(currentRecoveryReceipt)) return {
			status: "terminal",
			error: "retired Gateway lifecycle",
			endedAt: params.entry.execution.endedAt,
			suppressSessionEffects: true
		};
		if (currentRecoveryReceipt?.phase === "accepted") return await reconcileAcceptedRecovery({
			agentId,
			attempts,
			childSessionKey,
			currentSessionId: sessionEntry?.sessionId,
			currentSessionLifecycleRevision: sessionEntry?.lifecycleRevision,
			clearAcceptedRecovery: params.clearAcceptedRecovery,
			entry: params.entry,
			getRun: params.getRun,
			isCurrent: params.isCurrent,
			now: params.now,
			receipt: currentRecoveryReceipt,
			replaceRun: params.replaceRun,
			resumeAcceptedRecovery: params.resumeAcceptedRecovery,
			runId: params.runId,
			storePath,
			warn: params.warn
		});
		if (currentRecoveryReceipt?.phase === "abandoned") return {
			status: "terminal",
			error: abandonedError
		};
		if (currentRecoveryReceipt?.phase === "attempted" || currentRecoveryReceipt?.phase === "consumed") {
			if (!params.abandonLaunch({
				runId: params.runId,
				expected: params.entry,
				sessionMarker: currentRecoveryReceipt.sessionMarker,
				idempotencyKey: currentRecoveryReceipt.idempotencyKey
			})) return {
				status: "retry",
				error: "ambiguous subagent restart recovery could not persist its terminal fence"
			};
			return {
				status: "terminal",
				error: abandonedError
			};
		}
		if (!sessionEntry?.abortedLastRun) return { status: "ignored" };
		const marker = `${sessionEntry.sessionId ?? ""}:${sessionEntry.updatedAt ?? ""}`;
		if (typeof params.entry.execution.endedAt === "number" && !legacyRestartTimeout) return { status: "ignored" };
		if (legacyRestartTimeout) {
			const interruptedAt = params.entry.execution.endedAt;
			params.entry.execution = {
				...params.entry.execution,
				status: "interrupted",
				interruptedAt,
				interruptionReason: "gateway-restart",
				endedAt: void 0,
				outcome: void 0
			};
			params.entry.endedReason = void 0;
			params.entry.terminalOwner = void 0;
		}
		if (isStaleUnendedSubagentRun(params.entry, params.now)) return {
			status: "terminal",
			error: `stale aborted subagent run not resumed (${Math.round((params.now - (getSubagentSessionStartedAt(params.entry) ?? params.now)) / 1e3)}s old, exceeds stale-run window)`
		};
		const alreadyWedged = isSubagentRecoveryWedgedEntry(sessionEntry);
		const blockedReason = alreadyWedged ? formatSubagentRecoveryWedgedReason(sessionEntry) : attempts >= MAX_RECOVERY_ATTEMPTS ? `subagent orphan recovery blocked after ${attempts} rapid accepted resume attempts; run "openclaw tasks maintenance --apply" or "openclaw doctor --fix" to reconcile it` : void 0;
		if (blockedReason) {
			if (!alreadyWedged) try {
				await patchSessionEntryCore({
					storePath,
					sessionKey: childSessionKey
				}, (current) => {
					current.abortedLastRun = false;
					current.subagentRecovery = {
						...current.subagentRecovery,
						automaticAttempts: Math.max(current.subagentRecovery?.automaticAttempts ?? 0, MAX_RECOVERY_ATTEMPTS),
						lastAttemptAt: current.subagentRecovery?.lastAttemptAt ?? params.now,
						lastRunId: params.runId,
						wedgedAt: params.now,
						wedgedReason: blockedReason
					};
					current.updatedAt = params.now;
					return current;
				}, {
					assertCommitAllowed: () => {
						if (!isRecoverySourceCurrent() || !isRecoveryAttemptLifecycleCurrent()) throw new Error("subagent recovery lifecycle retired before wedge commit");
					},
					replaceEntry: true,
					skipMaintenance: true
				});
			} catch (error) {
				if (!isRecoveryAttemptLifecycleCurrent()) return {
					status: "terminal",
					error: "retired Gateway lifecycle",
					suppressSessionEffects: true
				};
				params.warn("failed to persist wedged subagent recovery marker", {
					runId: params.runId,
					childSessionKey,
					error
				});
			}
			params.warn("subagent restart recovery is blocked", {
				runId: params.runId,
				childSessionKey,
				reason: blockedReason
			});
			return { status: "handled" };
		}
		if (!params.gatewayRuntime) return { status: "deferred" };
		const messages = await readSessionMessagesAsync({
			agentId,
			sessionEntry,
			sessionId: sessionEntry.sessionId,
			sessionKey: childSessionKey,
			storePath
		}, {
			mode: "recent",
			maxMessages: 200,
			maxBytes: 1024 * 1024
		});
		if (!isRecoverySourceCurrent()) return { status: "handled" };
		const lastHumanMessage = extractSessionTranscriptText([...messages].toReversed().find((message) => extractMessageRole(message) === "user"));
		const configChanged = messages.some((message) => extractMessageRole(message) === "assistant" && /openclaw\.json|openclaw gateway restart|config\.patch/i.test(extractSessionTranscriptText(message) ?? ""));
		const sessionId = sessionEntry.sessionId;
		const updatedAt = sessionEntry.updatedAt;
		if (!sessionId || typeof updatedAt !== "number") return {
			status: "retry",
			error: "subagent restart recovery session snapshot is incomplete"
		};
		const assertSnapshotCurrent = () => {
			if (!isRecoverySourceCurrent()) throw new Error("subagent restart recovery source changed before dispatch");
			assertRestartRecoverySnapshotCurrent({
				childSessionKey,
				isOwnerCurrent: isRecoverySourceCurrent,
				sessionId,
				sessionLifecycleRevision: sessionEntry.lifecycleRevision,
				storePath,
				updatedAt
			});
		};
		const admission = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [childSessionKey, sessionId],
			assertAllowed: assertSnapshotCurrent,
			revalidateAllowed: assertSnapshotCurrent
		});
		const handoffId = admission.createHandoff();
		let idempotencyKey = "";
		let dispatched;
		let dispatchFailure;
		let earlyResult;
		let attemptedGeneration;
		try {
			idempotencyKey = params.reserveLaunch({
				runId: params.runId,
				expected: params.entry,
				sessionId,
				sessionMarker: marker,
				sessionLifecycleRevision: sessionEntry.lifecycleRevision,
				idempotencyKey: buildRestartRecoveryIdempotencyKey(params.runId, marker)
			}) ?? "";
			if (!idempotencyKey) earlyResult = { status: "handled" };
			else {
				const attempted = params.markLaunchAttempted({
					runId: params.runId,
					expected: params.entry,
					sessionMarker: marker,
					idempotencyKey,
					lifecycleGeneration: recoveryLifecycleGeneration
				});
				if (!attempted || attempted.phase === "accepted") earlyResult = { status: "handled" };
				else {
					attemptedGeneration = attempted.lifecycleGeneration;
					dispatched = await admission.run(() => params.gatewayRuntime.dispatchAgent({
						message: buildRestartRecoveryResumeMessage(params.entry.task, lastHumanMessage ?? void 0) + (configChanged ? "\n\n[config changes from your previous run were already applied — do not re-modify openclaw.json or restart the gateway]" : ""),
						sessionKey: childSessionKey,
						expectedExistingSessionId: sessionId,
						internalRuntimeHandoffId: handoffId,
						idempotencyKey,
						deliver: false,
						lane: "subagent",
						...params.entry.collect ? {
							swarmCollector: true,
							swarmOutputSchema: params.entry.outputSchema
						} : {},
						inputProvenance: {
							kind: "inter_session",
							sourceSessionKey: params.entry.requesterSessionKey,
							sourceChannel: "internal",
							sourceTool: "subagent_interrupted_resume"
						},
						sessionEffects: "internal",
						suppressPromptPersistence: true
					}));
				}
			}
		} catch (error) {
			dispatchFailure = { error };
		}
		const handoffCanceled = cancelSessionWorkAdmissionHandoff(handoffId);
		const attemptedLifecycleRetired = attemptedGeneration !== void 0 && !isAgentEventLifecycleGenerationCurrent(attemptedGeneration);
		if (attemptedGeneration) if (handoffCanceled) {
			if (!params.resetLaunchAttempt({
				runId: params.runId,
				expected: params.entry,
				sessionMarker: marker,
				idempotencyKey
			})) throw new Error("failed to reset unconsumed subagent restart recovery attempt");
		} else try {
			const consumed = params.markLaunchConsumed({
				runId: params.runId,
				expected: params.entry,
				sessionMarker: marker,
				idempotencyKey
			});
			if (!consumed || consumed.phase === "reserved" || consumed.phase === "attempted") throw new Error("failed to persist consumed subagent restart recovery attempt");
		} catch (error) {
			if (!dispatched) throw error;
			params.warn("subagent restart recovery could not persist its intermediate consumed receipt", {
				runId: params.runId,
				childSessionKey,
				error
			});
		}
		if (attemptedLifecycleRetired) return handoffCanceled ? { status: "handled" } : {
			status: "terminal",
			error: "retired Gateway lifecycle",
			suppressSessionEffects: true
		};
		if (earlyResult) return earlyResult;
		if (dispatchFailure) throw dispatchFailure.error;
		if (handoffCanceled) return {
			status: "retry",
			error: "Gateway did not consume the subagent restart recovery admission"
		};
		if (!dispatched) throw new Error("subagent restart recovery dispatch completed without a response");
		if (dispatched.runId !== idempotencyKey || dispatched.status !== "accepted" && dispatched.status !== "in_flight") {
			if (!params.abandonLaunch({
				runId: params.runId,
				expected: params.entry,
				sessionMarker: marker,
				idempotencyKey
			})) return {
				status: "retry",
				error: "rejected subagent restart recovery could not persist its terminal fence"
			};
			return {
				status: "terminal",
				error: "Gateway did not accept the subagent restart recovery run; automatic replay was suppressed to avoid duplicate side effects"
			};
		}
		const restartRecovery = params.markLaunchAccepted({
			runId: params.runId,
			expected: params.entry,
			sessionMarker: marker,
			idempotencyKey
		});
		if (!restartRecovery || restartRecovery.phase !== "accepted") return {
			status: "retry",
			error: "accepted subagent restart recovery could not persist its acceptance receipt"
		};
		return await reconcileAcceptedRecovery({
			agentId,
			attempts,
			childSessionKey,
			currentSessionId: sessionId,
			currentSessionLifecycleRevision: sessionEntry.lifecycleRevision,
			clearAcceptedRecovery: params.clearAcceptedRecovery,
			entry: params.entry,
			getRun: params.getRun,
			isCurrent: params.isCurrent,
			now: Date.now(),
			receipt: restartRecovery,
			replaceRun: params.replaceRun,
			resumeAcceptedRecovery: params.resumeAcceptedRecovery,
			runId: params.runId,
			storePath,
			warn: params.warn
		});
	} catch (error) {
		return {
			status: "retry",
			error: formatErrorMessage(error)
		};
	}
}
//#endregion
export { recoverInterruptedSubagentRow };
