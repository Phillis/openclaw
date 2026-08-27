import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-Doha8xVC.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { Qt as loadSessionEntry } from "./session-accessor-CIiPoGwM.js";
import { z as beginSessionWorkAdmission } from "./agent-harness-session-key-BpWapmwX.js";
import { B as ReplyRunFollowupAdmissionBlockedError, C as createReplyOperation, F as runAfterReplyOperationClear, L as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, M as isReplyRunSuccessorAdmissionBlocked, N as registerReplyOperationSuccessorBarrier, P as retainReplyOperationUntilComplete, R as REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS, S as waitForReplyRunSuccessorAdmission, V as ReplyRunSuccessorAdmissionBlockedError, j as isReplyRunEvidenceStale, p as replyRunRegistry, w as expireStaleReplyOperation, x as waitForReplyRunFollowupAdmission, z as ReplyRunAlreadyActiveError } from "./reply-run-registry-Bzalc5xR.js";
import { a as getDiagnosticSessionActivitySnapshot, d as resolveRunStaleThresholdMs } from "./diagnostic-run-activity-Bf46HUQp.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-4IbI4BFl.js";
import { n as isMainRestartRecoveryCandidate } from "./main-session-recovery-state-Ct2CBK87.js";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CwKii7Ph.js";
import { a as releaseMainSessionRecoveryOwner, t as claimMainSessionRecoveryOwner } from "./main-session-recovery-store-DTu6q_37.js";
//#region src/shared/silent-reply-policy.ts
const DEFAULT_SILENT_REPLY_POLICY = {
	direct: "disallow",
	group: "allow",
	internal: "allow"
};
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
function classifySilentReplyConversationType(params) {
	if (params.conversationType) return params.conversationType;
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (normalizedSessionKey.includes(":group:") || normalizedSessionKey.includes(":channel:")) return "group";
	if (normalizedSessionKey.includes(":direct:") || normalizedSessionKey.includes(":dm:")) return "direct";
	if (normalizeLowercaseStringOrEmpty(params.surface) === "webchat") return "direct";
	return "internal";
}
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
function resolveSilentReplyPolicyFromPolicies(params) {
	if (params.conversationType === "direct") return "disallow";
	return params.surfacePolicy?.[params.conversationType] ?? params.defaultPolicy?.[params.conversationType] ?? DEFAULT_SILENT_REPLY_POLICY[params.conversationType];
}
//#endregion
//#region src/config/silent-reply.ts
function resolveSilentReplyConversationContext(params) {
	const conversationType = classifySilentReplyConversationType({
		sessionKey: params.sessionKey,
		surface: params.surface,
		conversationType: params.conversationType
	});
	const normalizedSurface = normalizeLowercaseStringOrEmpty(params.surface);
	const surface = normalizedSurface ? params.cfg?.surfaces?.[normalizedSurface] : void 0;
	return {
		conversationType,
		defaultPolicy: params.cfg?.agents?.defaults?.silentReply,
		surfacePolicy: surface?.silentReply
	};
}
/** Resolves the effective silent-reply settings for a routed conversation. */
function resolveSilentReplySettings(params) {
	return { policy: resolveSilentReplyPolicyFromPolicies(resolveSilentReplyConversationContext(params)) };
}
/** Returns just the effective silent-reply policy for callers that do not need metadata. */
function resolveSilentReplyPolicy(params) {
	return resolveSilentReplySettings(params).policy;
}
//#endregion
//#region src/auto-reply/reply/reply-turn-admission.ts
var QueuedFollowupLifecycleInvalidatedError = class extends Error {};
const log = createSubsystemLogger("auto-reply/reply-turn-admission");
const lifecycleAdmissionByOperation = /* @__PURE__ */ new WeakMap();
async function releaseReplyRecoveryOwner(lease) {
	if (!lease) return;
	let settleDeferredRelease = () => {};
	const deferredRelease = new Promise((resolve) => {
		settleDeferredRelease = resolve;
	});
	try {
		return await releaseMainSessionRecoveryOwner(lease, { onDeferredSuccess: settleDeferredRelease });
	} catch (error) {
		log.warn(`failed to release main-session recovery reply owner: ${formatErrorMessage(error)}`);
		return await deferredRelease;
	}
}
/** Runs owner work with its admission marked as the initiating lifecycle context. */
async function runWithReplyOperationLifecycleAdmission(operation, run) {
	const admission = lifecycleAdmissionByOperation.get(operation);
	return admission ? await admission.run(run) : await run();
}
function rejectLifecycleInvalidatedWork(params) {
	if (params.kind === "queued_followup") throw new QueuedFollowupLifecycleInvalidatedError(params.message);
	throw new Error(params.message);
}
function isAbortSignalAborted(signal) {
	return signal?.aborted === true;
}
function expireVisibleStaleOperation(operation) {
	if (!operation) return false;
	const idleMs = Date.now() - operation.lastActivityAtMs;
	if (operation.result) return idleMs >= 6e4 && expireStaleReplyOperation(operation, "terminal_unreleased");
	return isReplyRunEvidenceStale(operation) && expireStaleReplyOperation(operation, "no_activity");
}
function resolveVisibleActiveWaitMs(operation) {
	if (!operation) return REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS;
	const ageMs = Date.now() - operation.lastActivityAtMs;
	const activity = getDiagnosticSessionActivitySnapshot({
		sessionId: operation.sessionId,
		sessionKey: operation.key
	});
	const remainingMs = operation.result ? REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS - ageMs : resolveRunStaleThresholdMs(activity) - ageMs;
	return Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, Math.max(1, remainingMs));
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
	let admissionWaitReported = false;
	const waitForAdmission = async (wait) => {
		if (!admissionWaitReported) {
			admissionWaitReported = true;
			params.onReplyAdmissionWaitChange?.(true);
		}
		return await wait();
	};
	try {
		return await admitReplyTurnWithWaitSignal(params, waitForAdmission);
	} finally {
		if (admissionWaitReported) params.onReplyAdmissionWaitChange?.(false);
	}
}
async function admitReplyTurnWithWaitSignal(params, waitForAdmission) {
	let sessionId = params.sessionId;
	let expectedSessionId = params.expectedSessionId;
	const waitTimeoutMs = params.waitTimeoutMs ?? (params.kind === "queued_followup" ? 15e3 : void 0);
	while (true) {
		if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
			status: "skipped",
			reason: "aborted"
		};
		if (isReplyRunSuccessorAdmissionBlocked(params.sessionKey)) {
			if (params.kind === "heartbeat") return {
				status: "skipped",
				reason: "active-run"
			};
			const successorAdmission = await waitForAdmission(() => waitForReplyRunSuccessorAdmission(params.sessionKey, params.kind === "visible" ? null : waitTimeoutMs, { signal: params.upstreamAbortSignal }));
			if (!successorAdmission.settled) return {
				status: "skipped",
				reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
			};
			sessionId = successorAdmission.sessionId ?? sessionId;
			if (expectedSessionId && successorAdmission.sessionId) expectedSessionId = successorAdmission.sessionId;
			continue;
		}
		try {
			const storePath = params.storePath;
			let operation;
			let admittedSessionEntry;
			let recoveryOwnerLease;
			let interruptedBeforeOperation = false;
			const admission = storePath ? await beginSessionWorkAdmission({
				scope: storePath,
				identities: [params.sessionKey],
				signal: params.upstreamAbortSignal,
				onInterrupt: () => {
					interruptedBeforeOperation = true;
					operation?.abortForRestart();
					params.onLifecycleInterrupt?.();
				},
				assertAllowed: () => {
					const currentEntry = loadSessionEntry({
						storePath,
						sessionKey: params.sessionKey,
						readConsistency: "latest"
					});
					admittedSessionEntry = currentEntry;
					if (expectedSessionId && !currentEntry) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" was deleted while starting work. Retry.`
					});
					const registeredOperation = replyRunRegistry.get(params.sessionKey);
					const rotationOperation = [registeredOperation, params.expectedActiveOperation].find((candidate) => {
						if (!candidate || !expectedSessionId || currentEntry?.sessionId !== candidate.sessionId || !candidate.hasOwnedSessionId(expectedSessionId)) return false;
						if (candidate.result?.kind === "aborted" && candidate.result.code === "aborted_for_restart") return false;
						return candidate === registeredOperation || candidate.result !== null;
					});
					const activeOperationRotatedExpectedSession = Boolean(rotationOperation && currentEntry?.sessionId === rotationOperation.sessionId);
					if (expectedSessionId && currentEntry?.sessionId !== expectedSessionId && !activeOperationRotatedExpectedSession) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" changed while starting work. Retry.`
					});
					if (activeOperationRotatedExpectedSession) expectedSessionId = currentEntry?.sessionId;
					const archivedSessionError = resolveSessionWorkStartError(params.sessionKey || sessionId, currentEntry);
					if (archivedSessionError) rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: archivedSessionError
					});
					sessionId = currentEntry?.sessionId ?? sessionId;
				}
			}) : void 0;
			try {
				if (isReplyRunSuccessorAdmissionBlocked(params.sessionKey)) throw new ReplyRunSuccessorAdmissionBlockedError(params.sessionKey);
				if (storePath && !params.resetTriggered && admittedSessionEntry && (admittedSessionEntry.status === "running" && (admittedSessionEntry.abortedLastRun === true || admittedSessionEntry.restartRecoveryRuns !== void 0 || admittedSessionEntry.mainRestartRecovery !== void 0) || admittedSessionEntry.mainRestartRecovery?.tombstone !== void 0) && isMainRestartRecoveryCandidate(admittedSessionEntry, params.sessionKey)) {
					const ownerClaim = await claimMainSessionRecoveryOwner({
						lifecycleGeneration: getAgentEventLifecycleGeneration(),
						sessionId,
						target: {
							sessionKey: params.sessionKey,
							storePath
						}
					});
					if (ownerClaim.kind === "invalidated") rejectLifecycleInvalidatedWork({
						kind: params.kind,
						message: `Session "${params.sessionKey}" changed while starting work. Retry.`
					});
					recoveryOwnerLease = ownerClaim.kind === "claimed" ? ownerClaim.lease : void 0;
				}
				if (interruptedBeforeOperation || isAbortSignalAborted(params.upstreamAbortSignal)) rejectLifecycleInvalidatedWork({
					kind: params.kind,
					message: `Session "${params.sessionKey}" changed while starting work. Retry.`
				});
				if (params.adoptOperation) {
					params.adoptOperation.updateSessionKey(params.sessionKey);
					operation = params.adoptOperation;
				} else operation = createReplyOperation({
					sessionKey: params.sessionKey,
					sessionId,
					turnKind: params.kind,
					resetTriggered: params.resetTriggered,
					routeThreadId: params.routeThreadId,
					originatingLeafEntryId: params.originatingLeafEntryId,
					upstreamAbortSignal: params.upstreamAbortSignal,
					respectFollowupAdmissionBarrier: params.kind === "queued_followup" || params.kind === "heartbeat"
				});
			} catch (error) {
				const pendingRecovery = recoveryOwnerLease ? await releaseReplyRecoveryOwner(recoveryOwnerLease) : void 0;
				if (error instanceof ReplyRunAlreadyActiveError && admission && params.retainLifecycleAdmissionOnActive) {
					admission.released.then(() => {
						scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
					});
					return {
						status: "skipped",
						reason: "active-run",
						activeOperation: replyRunRegistry.get(params.sessionKey),
						lifecycleAdmission: admission
					};
				}
				admission?.release();
				scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
				throw error;
			}
			if (admission) {
				retainReplyOperationUntilComplete(operation);
				lifecycleAdmissionByOperation.set(operation, admission);
				let recoveryOwnerRelease;
				const releaseRecoveryOwner = () => recoveryOwnerRelease ??= releaseReplyRecoveryOwner(recoveryOwnerLease);
				if (recoveryOwnerLease) registerReplyOperationSuccessorBarrier({
					operation,
					sessionId: recoveryOwnerLease.sessionId,
					sessionKeys: [params.sessionKey, recoveryOwnerLease.sessionKey],
					start: releaseRecoveryOwner
				});
				runAfterReplyOperationClear(operation, () => {
					lifecycleAdmissionByOperation.delete(operation);
					releaseRecoveryOwner().then((pendingTarget) => {
						admission.release();
						scheduleMainSessionRecoveryPendingTarget(pendingTarget);
					});
				});
			}
			return {
				status: "owned",
				operation,
				...admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {}
			};
		} catch (error) {
			if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
				status: "skipped",
				reason: "aborted"
			};
			if (error instanceof QueuedFollowupLifecycleInvalidatedError) return {
				status: "skipped",
				reason: "lifecycle-invalidated"
			};
			if (error instanceof ReplyRunSuccessorAdmissionBlockedError) {
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run"
				};
				continue;
			}
			if (error instanceof ReplyRunFollowupAdmissionBlockedError) {
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run"
				};
				const followupAdmission = await waitForAdmission(() => waitForReplyRunFollowupAdmission(params.sessionKey, waitTimeoutMs ?? 15e3, { signal: params.upstreamAbortSignal }));
				if (!followupAdmission.settled) return {
					status: "skipped",
					reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
				};
				sessionId = followupAdmission.sessionId ?? sessionId;
				if (expectedSessionId && followupAdmission.sessionId) expectedSessionId = followupAdmission.sessionId;
				continue;
			}
			if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
			const activeOperation = replyRunRegistry.get(params.sessionKey);
			if (params.kind === "visible" && activeOperation?.turnKind === "heartbeat") activeOperation.supersede();
			if (params.kind === "visible" && expireVisibleStaleOperation(activeOperation)) continue;
			if (params.kind === "heartbeat") return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			if (params.waitForActive === false) return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			const activeWaitTimeoutMs = params.kind === "visible" ? resolveVisibleActiveWaitMs(activeOperation) : waitTimeoutMs;
			if (!await waitForAdmission(() => replyRunRegistry.waitForIdle(params.sessionKey, activeWaitTimeoutMs, { signal: params.upstreamAbortSignal }))) {
				if (params.kind === "visible" && !isAbortSignalAborted(params.upstreamAbortSignal)) {
					expireVisibleStaleOperation(replyRunRegistry.get(params.sessionKey) ?? activeOperation);
					continue;
				}
				return {
					status: "skipped",
					reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
					activeOperation
				};
			}
			if (activeOperation) {
				sessionId = activeOperation.sessionId;
				if (expectedSessionId && !(activeOperation.result?.kind === "aborted" && activeOperation.result.code === "aborted_for_restart")) expectedSessionId = activeOperation.sessionId;
			}
		}
	}
}
/** Resolves the default turn kind from reply options. */
function resolveReplyTurnKind(opts) {
	return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
//#endregion
//#region src/auto-reply/reply/reply-timing-tracker.ts
const disabledTimingTracker = {
	async measure(_name, run) {
		return await run();
	},
	measureSync(_name, run) {
		return run();
	},
	logIfSlow() {}
};
/** Checks config/env diagnostic flags for reply profiling. */
function isReplyProfilerEnabled(params) {
	const cfg = params?.config;
	const env = params?.env ?? process.env;
	return isDiagnosticFlagEnabled("profiler", cfg, env) || isDiagnosticFlagEnabled("reply.profiler", cfg, env);
}
/** Creates a no-timer pass-through unless reply profiling is enabled. */
function createReplyTimingTracker(params) {
	if (!(params.enabled ?? isReplyProfilerEnabled({
		config: params.config,
		env: params.env
	}))) return disabledTimingTracker;
	const startedAt = Date.now();
	const spans = [];
	let didLog = false;
	const totalWarnMs = params.totalWarnMs ?? 1e3;
	const stageWarnMs = params.stageWarnMs ?? 500;
	const toMs = (value) => Math.max(0, Math.round(value));
	const record = (name, spanStartedAt) => {
		spans.push({
			name,
			durationMs: toMs(Date.now() - spanStartedAt),
			elapsedMs: toMs(Date.now() - startedAt)
		});
	};
	return {
		async measure(name, run) {
			const spanStartedAt = Date.now();
			try {
				return await run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		measureSync(name, run) {
			const spanStartedAt = Date.now();
			try {
				return run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		logIfSlow(logParams, options) {
			if (didLog && !options?.repeat) return;
			const summary = {
				totalMs: toMs(Date.now() - startedAt),
				spans: spans.slice()
			};
			if (summary.totalMs < totalWarnMs && !summary.spans.some((span) => span.durationMs >= stageWarnMs)) return;
			if (!options?.repeat) didLog = true;
			const formattedSpans = summary.spans.length > 0 ? summary.spans.map((span) => `${span.name}:${span.durationMs}ms@${span.elapsedMs}ms`).join(",") : "none";
			if (params.formatMessage) {
				const detailParams = logParams;
				const details = Object.fromEntries((params.detailKeys?.(logParams) ?? []).map((key) => [key, detailParams[key]]));
				params.log.warn(params.formatMessage(logParams, summary, formattedSpans), {
					...details,
					totalMs: summary.totalMs,
					spans: summary.spans
				});
				return;
			}
			const defaults = logParams;
			const suffix = [
				`totalMs=${summary.totalMs}`,
				`stages=${formattedSpans}`,
				defaults.outcome ? `outcome=${defaults.outcome}` : void 0,
				defaults.reason ? `reason=${defaults.reason}` : void 0,
				defaults.error ? `error="${defaults.error}"` : void 0
			].filter(Boolean).join(" ");
			params.log.warn(`${defaults.message} ${suffix}`, {
				...defaults.details,
				outcome: defaults.outcome,
				reason: defaults.reason,
				error: defaults.error,
				totalMs: summary.totalMs,
				spans: summary.spans
			});
		}
	};
}
//#endregion
//#region src/auto-reply/reply/session-entry-handle.ts
var ReplySessionGenerationInvalidatedError = class extends Error {};
function createReplySessionEntryHandle(params) {
	const { generationFence, sessionKey, sessionStore } = params;
	const entries = sessionStore ?? {};
	let ownedSessionId = generationFence?.sessionId;
	let ownedLifecycleRevision = params.sessionEntry && params.sessionEntry.sessionId === ownedSessionId ? params.sessionEntry.lifecycleRevision : void 0;
	const matchesGeneration = (entry) => entry !== void 0 && (!generationFence || entry.sessionId === ownedSessionId && entry.lifecycleRevision === ownedLifecycleRevision);
	let currentEntry = matchesGeneration(params.sessionEntry) ? params.sessionEntry : void 0;
	if (sessionKey && currentEntry) {
		const storedEntry = entries[sessionKey];
		if (!generationFence || !sessionStore || storedEntry && (storedEntry === generationFence.expectedStoreEntry && !matchesGeneration(storedEntry) || matchesGeneration(storedEntry) && currentEntry.updatedAt >= storedEntry.updatedAt)) entries[sessionKey] = currentEntry;
	}
	const current = () => {
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		if (generationFence && matchesGeneration(storedEntry) && (!currentEntry || storedEntry.updatedAt >= currentEntry.updatedAt)) currentEntry = storedEntry;
		return currentEntry;
	};
	const replaceCurrent = (entry, adopt = false) => {
		if (!generationFence) {
			currentEntry = entry;
			if (sessionKey) entries[sessionKey] = entry;
			return;
		}
		const storedEntry = sessionKey ? entries[sessionKey] : void 0;
		const storedMatchesOwned = matchesGeneration(storedEntry);
		let nextEntry = entry;
		if (adopt) {
			const storedMatchesAdopted = Boolean(storedEntry && storedEntry.sessionId === entry.sessionId && storedEntry.lifecycleRevision === entry.lifecycleRevision);
			if (sessionStore && sessionKey && !storedEntry && generationFence.expectedStoreEntry || storedEntry && !storedMatchesOwned && !storedMatchesAdopted) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation was replaced during admission");
			if (storedMatchesAdopted && storedEntry && storedEntry.updatedAt >= entry.updatedAt) nextEntry = storedEntry;
			ownedSessionId = nextEntry.sessionId;
			ownedLifecycleRevision = nextEntry.lifecycleRevision;
		} else if (!matchesGeneration(nextEntry)) return;
		if (adopt || !currentEntry || nextEntry.updatedAt >= currentEntry.updatedAt) currentEntry = nextEntry;
		if (sessionKey && (adopt ? !storedEntry || storedMatchesOwned || nextEntry !== storedEntry : !storedEntry && !generationFence.expectedStoreEntry || storedMatchesOwned && storedEntry && nextEntry.updatedAt >= storedEntry.updatedAt)) entries[sessionKey] = nextEntry;
	};
	const handle = {
		adoptCurrent: (entry) => replaceCurrent(entry, true),
		clearCurrent: () => {
			currentEntry = void 0;
			if (sessionKey && (!generationFence || matchesGeneration(entries[sessionKey]))) delete entries[sessionKey];
		},
		get: (key) => entries[key],
		getCurrent: current,
		patchCurrent: (patch) => {
			if (currentEntry) replaceCurrent({
				...currentEntry,
				...patch
			});
			return currentEntry;
		},
		replaceCurrent,
		set: (key, entry) => {
			if (key === sessionKey) replaceCurrent(entry);
			else entries[key] = entry;
		},
		toCompatSessionStore: () => {
			if (!generationFence || !sessionKey) return entries;
			const view = {
				...entries,
				...currentEntry ? { [sessionKey]: currentEntry } : {}
			};
			return new Proxy(view, {
				get: (target, key) => key === sessionKey ? current() : Reflect.get(target, key),
				set(target, key, entry) {
					if (key !== sessionKey) return Reflect.set(target, key, entry);
					if (!entry) handle.clearCurrent();
					else replaceCurrent(entry, !matchesGeneration(entry));
					return true;
				},
				deleteProperty(target, key) {
					if (key !== sessionKey) return Reflect.deleteProperty(target, key);
					handle.clearCurrent();
					return true;
				}
			});
		}
	};
	return handle;
}
//#endregion
export { admitReplyTurn as a, resolveSilentReplyPolicy as c, isReplyProfilerEnabled as i, resolveSilentReplySettings as l, createReplySessionEntryHandle as n, resolveReplyTurnKind as o, createReplyTimingTracker as r, runWithReplyOperationLifecycleAdmission as s, ReplySessionGenerationInvalidatedError as t, resolveSilentReplyPolicyFromPolicies as u };
