import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { c as isAgentEventLifecycleGenerationCurrent, s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { s as callGateway } from "./call-D4XcT41c.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { Qt as loadSessionEntry, en as patchSessionEntryCore } from "./session-accessor-Bi6bzKQE.js";
import "./message-channel-T4W5YOto.js";
import { K as interruptSessionWorkAdmissions, R as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, X as runExclusiveSessionLifecycleMutation } from "./agent-harness-session-key-BMj1lPtX.js";
import { at as SUBAGENT_KILL_TASK_ERROR } from "./task-registry-activity-Da_BdI-a.js";
import { S as subagentRuns } from "./subagent-registry.store.sqlite-okpdNwYx.js";
import "./subagent-run-liveness-Xp6SfCLg.js";
import { a as countPendingDescendantRuns, m as listSubagentRunsForController, o as getLatestLiveSubagentRunByChildSessionKey, w as buildSubagentRunReadIndexFromRuns, y as getSubagentRunsSnapshotForRead } from "./subagent-registry-read-CnYv36nn.js";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-WLDx82Jc.js";
import { l as resolveInternalSessionKey, u as resolveMainSessionAlias } from "./sessions-helpers-CuYcNwxb.js";
import { i as sortSubagentRuns, n as resolveSubagentLabel } from "./subagents-utils-BYihPlfM.js";
import { n as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-BdElypHU.js";
import { n as resolveSessionEntryForKey } from "./subagent-list-CtUTjLCM.js";
import { F as resolveKilledSubagentTaskEndedAt, P as resolveFinalizedSubagentTaskState } from "./subagent-registry-lifecycle-delivery-DekTaqCR.js";
import { t as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-B5sNTTcg.js";
import { S as replaceSubagentRunAfterSteerCore, _ as markSubagentRunTerminated, g as markSubagentRunForSteerRestart, i as clearSubagentRunSteerRestart, r as claimSubagentRunKill, x as releaseSubagentRunKillClaim } from "./subagent-registry-BAbBNaM0.js";
import { h as terminateAcceptedCollectorRun } from "./subagent-announce-output-BeUz6fzw.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { i as readLatestAssistantReplySnapshot, o as waitForAgentRunAndReadUpdatedAssistantReply } from "./run-wait-BCRVl_lb.js";
import crypto from "node:crypto";
//#region src/agents/subagents/registry/subagent-control-scope.ts
/** Controller identity, authorization, and controlled-run read scope. */
/** Maximum recent-run window accepted by subagent control UI/tools. */
const MAX_RECENT_MINUTES = 1440;
/** Resolves which subagent runs the caller is allowed to control. */
function resolveSubagentController(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const callerSessionKey = resolveInternalSessionKey({
		key: params.agentSessionKey?.trim() || alias,
		alias,
		mainKey
	});
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: callerSessionKey,
		agentId: params.agentId
	});
	if (!isSubagentSessionKey(callerSessionKey)) return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: false,
		controlScope: "children"
	};
	return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: true,
		controlScope: resolveStoredSubagentCapabilities(callerSessionKey, {
			cfg: params.cfg,
			agentId: controllerAgentId
		}).controlScope
	};
}
function resolveRunRequesterAgentId(entry, cfg) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsed = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsed || !cfg) return parsed;
	return resolveSubagentRequesterAgentId(cfg, entry);
}
function isSubagentRunVisibleToSession(entry, sessionKey, agentId, cfg) {
	const controllerKey = entry.controllerSessionKey?.trim();
	const requesterKey = entry.requesterSessionKey.trim();
	const requesterAgentId = resolveRunRequesterAgentId(entry, cfg);
	const controllerAgentId = (controllerKey ? parseAgentSessionKey(controllerKey)?.agentId : void 0) ?? requesterAgentId;
	const normalizedAgentId = normalizeAgentId(agentId);
	return controllerKey === sessionKey && controllerAgentId === normalizedAgentId || requesterKey === sessionKey && requesterAgentId === normalizedAgentId;
}
/** Builds one stable snapshot for controlled-run listing and descendant status reads. */
function buildControlledSubagentRunsReadContext(controllerSessionKey, controllerAgentId, cfg) {
	const key = controllerSessionKey.trim();
	const agentId = controllerAgentId ?? parseAgentSessionKey(key)?.agentId;
	if (!key || !agentId) return {
		runs: [],
		countPendingDescendantRuns: () => 0
	};
	const readIndex = buildSubagentRunReadIndexFromRuns({ runs: getSubagentRunsSnapshotForRead(subagentRuns) });
	return {
		runs: sortSubagentRuns(Array.from(readIndex.latestRunsByChildSessionKey.values()).filter((entry) => isSubagentRunVisibleToSession(entry, key, agentId, cfg))),
		countPendingDescendantRuns: (rootSessionKey) => readIndex.countPendingDescendantRuns(rootSessionKey)
	};
}
/** Lists latest child runs controlled by a session key. */
function listControlledSubagentRuns(controllerSessionKey, controllerAgentId, cfg) {
	return buildControlledSubagentRunsReadContext(controllerSessionKey, controllerAgentId, cfg).runs;
}
function ensureSubagentControllerOwnsRun(params) {
	const owner = params.entry.controllerSessionKey?.trim() || params.entry.requesterSessionKey;
	const ownerAgentId = parseAgentSessionKey(owner)?.agentId ?? resolveRunRequesterAgentId(params.entry, params.cfg);
	const controllerAgentId = params.controller.controllerAgentId ?? parseAgentSessionKey(params.controller.controllerSessionKey)?.agentId;
	if (owner === params.controller.controllerSessionKey && ownerAgentId === controllerAgentId) return;
	return "Subagents can only control runs spawned from their own session.";
}
function isFinishedSubagentRunForSteer(entry, hasPendingDescendants) {
	return Boolean(entry.execution.endedAt) && entry.pauseReason !== "sessions_yield" && !hasPendingDescendants;
}
function getLatestOwnedSubagentRun(childSessionKey, agentId, cfg) {
	const ownerFilter = parseAgentSessionKey(childSessionKey) ? void 0 : agentId;
	return getLatestLiveSubagentRunByChildSessionKey(childSessionKey, ownerFilter ? (candidate) => resolveRunRequesterAgentId(candidate, cfg) === ownerFilter : void 0) ?? void 0;
}
function isCurrentSubagentRun(entry, cfg) {
	if (!cfg) return getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey) === entry;
	return getLatestOwnedSubagentRun(entry.childSessionKey, resolveRunRequesterAgentId(entry, cfg), cfg) === entry;
}
function isSameSubagentRunGeneration(live, snapshot) {
	return live.childSessionKey === snapshot.childSessionKey && live.runId === snapshot.runId && live.generation === snapshot.generation && live.createdAt === snapshot.createdAt;
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill-runtime.ts
const defaultSubagentKillDeps = { patchSessionEntryCore };
let subagentKillDeps = defaultSubagentKillDeps;
const subagentKillRuntimeLoader = createLazyImportLoader(() => import("./subagent-control.runtime.js"));
async function resolveSubagentKillRuntime() {
	if (subagentKillDeps.abortEmbeddedAgentRun && subagentKillDeps.isEmbeddedAgentRunActive && subagentKillDeps.clearSessionQueues) return {
		abortEmbeddedAgentRun: subagentKillDeps.abortEmbeddedAgentRun,
		isEmbeddedAgentRunActive: subagentKillDeps.isEmbeddedAgentRunActive,
		clearSessionQueues: subagentKillDeps.clearSessionQueues
	};
	const runtime = await subagentKillRuntimeLoader.load();
	return {
		abortEmbeddedAgentRun: subagentKillDeps.abortEmbeddedAgentRun ?? runtime.abortEmbeddedAgentRun,
		isEmbeddedAgentRunActive: subagentKillDeps.isEmbeddedAgentRunActive ?? runtime.isEmbeddedAgentRunActive,
		clearSessionQueues: subagentKillDeps.clearSessionQueues ?? runtime.clearSessionQueues
	};
}
function setSubagentKillTestDeps(overrides) {
	subagentKillDeps = overrides ? {
		...defaultSubagentKillDeps,
		...overrides
	} : defaultSubagentKillDeps;
}
function resolveSubagentKillTargetState(entry) {
	if (entry.endedReason === "subagent-killed" && entry.suppressAnnounceReason !== "steer-restart") {
		const taskEndedAt = resolveKilledSubagentTaskEndedAt(entry);
		return typeof taskEndedAt === "number" ? {
			state: "terminal",
			task: {
				status: "cancelled",
				endedAt: taskEndedAt,
				lastEventAt: taskEndedAt,
				error: SUBAGENT_KILL_TASK_ERROR,
				progressSummary: entry.completion?.resultText ?? void 0,
				terminalSummary: null
			}
		} : void 0;
	}
	const terminal = resolveFinalizedSubagentTaskState(entry);
	if (terminal) return {
		state: "terminal",
		task: terminal
	};
	return typeof entry.execution.endedAt === "number" && entry.pauseReason !== "sessions_yield" && (entry.endedReason !== "subagent-killed" || entry.suppressAnnounceReason === "steer-restart") ? { state: "finalizing" } : void 0;
}
async function persistSubagentAbortedLastRun(params) {
	if (!params.hasSessionEntry) return true;
	try {
		await subagentKillDeps.patchSessionEntryCore({
			storePath: params.storePath,
			sessionKey: params.childSessionKey
		}, (current) => current.sessionId !== params.expectedSessionId || current.lifecycleRevision !== params.expectedLifecycleRevision || params.isCurrent?.(current) === false ? null : {
			...current,
			abortedLastRun: params.abortedLastRun,
			updatedAt: Date.now()
		}, {
			assertCommitAllowed: params.assertCommitAllowed,
			replaceEntry: true
		});
		return true;
	} catch (error) {
		if (params.strict) throw error;
		logVerbose(`subagents control kill: failed to persist abortedLastRun=${params.abortedLastRun} for ${params.childSessionKey}: ${formatErrorMessage(error)}`);
		return false;
	}
}
function markSubagentRunTerminatedBestEffort(params) {
	try {
		return markSubagentRunTerminated(params);
	} catch (error) {
		logVerbose(`subagents control kill: failed to persist ${params.runId ?? params.childSessionKey ?? "unknown"}: ${formatErrorMessage(error)}`);
		return 0;
	}
}
async function killSubagentRun(params) {
	const markKilledBestEffort = () => markSubagentRunTerminatedBestEffort({
		runId: params.entry.runId,
		reason: "killed",
		suppressTaskDelivery: params.suppressTaskDelivery
	});
	const initialTargetState = resolveSubagentKillTargetState(params.entry);
	if (initialTargetState) {
		if (params.entry.endedReason === "subagent-killed" && params.entry.suppressAnnounceReason !== "steer-restart") markKilledBestEffort();
		return {
			killed: false,
			targetState: initialTargetState
		};
	}
	if (params.entry.execution.endedAt && params.entry.pauseReason !== "sessions_yield") return { killed: false };
	const childSessionKey = params.entry.childSessionKey;
	const resolved = resolveSessionEntryForKey({
		cfg: params.cfg,
		key: childSessionKey,
		cache: params.cache
	});
	const sessionId = resolved.entry?.sessionId;
	const sessionLifecycleRevision = resolved.entry?.lifecycleRevision;
	const runtime = await resolveSubagentKillRuntime();
	let admittedWorkReleased = true;
	return await runExclusiveSessionLifecycleMutation({
		scope: resolved.storePath,
		identities: [childSessionKey, sessionId],
		prepare: async () => {
			if (!isCurrentSubagentRun(params.entry, params.cfg)) return;
			admittedWorkReleased = await interruptSessionWorkAdmissions({
				scope: resolved.storePath,
				identities: [childSessionKey, sessionId],
				timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS
			});
		},
		run: async () => {
			if (!admittedWorkReleased) return {
				killed: false,
				sessionId,
				error: "Subagent is still active; try the kill again in a moment."
			};
			if (!isCurrentSubagentRun(params.entry, params.cfg)) return {
				killed: false,
				sessionId,
				superseded: true
			};
			const targetStateAfterRuntimeLoad = resolveSubagentKillTargetState(params.entry);
			if (targetStateAfterRuntimeLoad) {
				if (params.entry.endedReason === "subagent-killed" && params.entry.suppressAnnounceReason !== "steer-restart") markKilledBestEffort();
				return {
					killed: false,
					sessionId,
					targetState: targetStateAfterRuntimeLoad
				};
			}
			let killClaim;
			const killOwnerCurrent = () => isCurrentSubagentRun(params.entry, params.cfg) && (!killClaim || (params.entry.killIntent === killClaim || params.entry.endedReason === "subagent-killed" && params.entry.killReconciliation !== void 0 && params.entry.execution.lifecycleGeneration === killClaim.lifecycleGeneration) && (killClaim.lifecycleGeneration === void 0 || isAgentEventLifecycleGenerationCurrent(killClaim.lifecycleGeneration)));
			const persistAbortedLastRun = (abortedLastRun, strict = false) => persistSubagentAbortedLastRun({
				childSessionKey,
				storePath: resolved.storePath,
				hasSessionEntry: resolved.entry !== void 0,
				expectedSessionId: sessionId,
				expectedLifecycleRevision: sessionLifecycleRevision,
				abortedLastRun,
				isCurrent: () => killOwnerCurrent(),
				assertCommitAllowed: () => {
					if (!killOwnerCurrent()) throw new Error("subagent kill lifecycle retired before abort-marker commit");
				},
				strict
			});
			try {
				killClaim = claimSubagentRunKill({
					runId: params.entry.runId,
					expected: params.entry,
					sessionId,
					sessionLifecycleRevision,
					suppressTaskDelivery: params.suppressTaskDelivery
				});
			} catch (error) {
				return {
					killed: false,
					sessionId,
					error: `Failed to persist subagent kill intent: ${formatErrorMessage(error)}`
				};
			}
			if (!killClaim || !killOwnerCurrent()) return {
				killed: false,
				sessionId,
				superseded: true
			};
			const claimedKill = killClaim;
			const ownsSessionIncarnation = () => {
				const currentSessionEntry = loadSessionEntry({
					storePath: resolved.storePath,
					sessionKey: childSessionKey,
					clone: false,
					readConsistency: "latest"
				});
				return currentSessionEntry !== void 0 === (resolved.entry !== void 0) && currentSessionEntry?.sessionId === sessionId && currentSessionEntry?.lifecycleRevision === sessionLifecycleRevision;
			};
			const releaseChangedSessionKill = () => {
				try {
					releaseSubagentRunKillClaim({
						runId: params.entry.runId,
						expected: params.entry,
						claim: claimedKill
					});
				} catch (error) {
					return {
						killed: false,
						sessionId,
						error: `Subagent session changed and its kill intent could not be released: ${formatErrorMessage(error)}`
					};
				}
				return {
					killed: false,
					sessionId,
					error: "Subagent session changed while the kill was pending; retry."
				};
			};
			if (!ownsSessionIncarnation()) return releaseChangedSessionKill();
			const active = sessionId ? runtime.isEmbeddedAgentRunActive(sessionId) : false;
			if (!ownsSessionIncarnation()) return releaseChangedSessionKill();
			const aborted = sessionId ? runtime.abortEmbeddedAgentRun(sessionId) : false;
			if (!ownsSessionIncarnation()) return releaseChangedSessionKill();
			const cleared = runtime.clearSessionQueues([childSessionKey, sessionId]);
			if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`subagents control kill: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
			if (active && !aborted) {
				try {
					releaseSubagentRunKillClaim({
						runId: params.entry.runId,
						expected: params.entry,
						claim: killClaim
					});
				} catch (error) {
					return {
						killed: false,
						sessionId,
						error: `Subagent remained active and its kill intent could not be released: ${formatErrorMessage(error)}`
					};
				}
				return {
					killed: false,
					sessionId,
					error: "Subagent is still active; try the kill again in a moment."
				};
			}
			const targetState = resolveSubagentKillTargetState(params.entry);
			if (targetState) {
				const killedTarget = targetState.state === "terminal" && targetState.task.status === "cancelled" && targetState.task.error === "Subagent run killed.";
				if (killedTarget) markKilledBestEffort();
				else try {
					releaseSubagentRunKillClaim({
						runId: params.entry.runId,
						expected: params.entry,
						claim: killClaim
					});
				} catch (error) {
					return {
						killed: false,
						sessionId,
						targetState,
						error: `Completed subagent kill intent could not be released: ${formatErrorMessage(error)}`
					};
				}
				return {
					killed: killedTarget,
					sessionId,
					targetState
				};
			}
			let marked;
			try {
				marked = markSubagentRunTerminated({
					runId: params.entry.runId,
					reason: "killed",
					suppressTaskDelivery: params.suppressTaskDelivery
				});
			} catch (error) {
				return {
					killed: false,
					sessionId,
					error: `Failed to persist subagent kill tombstone: ${formatErrorMessage(error)}`
				};
			}
			await persistAbortedLastRun(true);
			return {
				killed: marked > 0,
				sessionId
			};
		}
	});
}
async function killLatestSubagentRun(params) {
	let entry = params.entry;
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const result = await killSubagentRun({
			...params,
			entry
		});
		if (!result.superseded) return {
			entry,
			result
		};
		const latest = getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey);
		if (!latest || latest === entry) return {
			entry,
			result
		};
		if (entry.execution.restartRecovery?.idempotencyKey !== latest.runId) return {
			entry,
			result
		};
		entry = latest;
	}
	return {
		entry,
		result: {
			killed: false,
			superseded: true,
			error: "Subagent changed generations repeatedly during kill; retry in a moment."
		}
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-messaging.ts
/** Authorized steering and follow-up messaging for controlled subagents. */
const STEER_RATE_LIMIT_MS = 2e3;
const STEER_ABORT_SETTLE_TIMEOUT_MS = 5e3;
const SUBAGENT_REPLY_HISTORY_LIMIT = 50;
const steerRateLimit = /* @__PURE__ */ new Map();
const callSubagentControlGateway = async (request) => {
	const gatewayRuntime = getGatewayRecoveryRuntime();
	if (gatewayRuntime && request.method === "agent") return await gatewayRuntime.dispatchAgent(request.params, request.timeoutMs ?? void 0);
	if (gatewayRuntime && request.method === "agent.wait") return await gatewayRuntime.waitForAgent(request.params, request.timeoutMs ?? void 0);
	return await callGateway(request);
};
const defaultSubagentMessagingDeps = { callGateway: callSubagentControlGateway };
let subagentMessagingDeps = defaultSubagentMessagingDeps;
const subagentMessagingRuntimeLoader = createLazyImportLoader(() => import("./subagent-control.runtime.js"));
async function resolveSubagentMessagingRuntime() {
	if (subagentMessagingDeps.abortEmbeddedAgentRun && subagentMessagingDeps.isEmbeddedAgentRunActive && subagentMessagingDeps.clearSessionQueues) return {
		abortEmbeddedAgentRun: subagentMessagingDeps.abortEmbeddedAgentRun,
		isEmbeddedAgentRunActive: subagentMessagingDeps.isEmbeddedAgentRunActive,
		clearSessionQueues: subagentMessagingDeps.clearSessionQueues
	};
	const runtime = await subagentMessagingRuntimeLoader.load();
	return {
		abortEmbeddedAgentRun: subagentMessagingDeps.abortEmbeddedAgentRun ?? runtime.abortEmbeddedAgentRun,
		isEmbeddedAgentRunActive: subagentMessagingDeps.isEmbeddedAgentRunActive ?? runtime.isEmbeddedAgentRunActive,
		clearSessionQueues: subagentMessagingDeps.clearSessionQueues ?? runtime.clearSessionQueues
	};
}
function setSubagentMessagingTestDeps(overrides) {
	subagentMessagingDeps = overrides ? {
		...defaultSubagentMessagingDeps,
		...overrides
	} : defaultSubagentMessagingDeps;
}
/** Restarts a controlled subagent run with a new steering message. */
async function steerControlledSubagentRun(params) {
	if (params.controller.controlScope !== "children") return {
		status: "forbidden",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: "Leaf subagents cannot control other sessions."
	};
	if (params.controller.callerSessionKey === params.entry.childSessionKey) return {
		status: "forbidden",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: "Subagents cannot steer themselves."
	};
	const currentEntry = getLatestLiveSubagentRunByChildSessionKey(params.entry.childSessionKey);
	const currentHasPendingDescendants = currentEntry ? countPendingDescendantRuns(currentEntry.childSessionKey) > 0 : false;
	if (!currentEntry || !isSameSubagentRunGeneration(currentEntry, params.entry) || isFinishedSubagentRunForSteer(currentEntry, currentHasPendingDescendants)) return {
		status: "done",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		text: `${resolveSubagentLabel(params.entry)} is already finished.`
	};
	const ownershipError = ensureSubagentControllerOwnsRun({
		cfg: params.cfg,
		controller: params.controller,
		entry: currentEntry
	});
	if (ownershipError) return {
		status: "forbidden",
		runId: currentEntry.runId,
		sessionKey: currentEntry.childSessionKey,
		error: ownershipError
	};
	if (currentEntry.collect) return {
		status: "forbidden",
		runId: currentEntry.runId,
		sessionKey: currentEntry.childSessionKey,
		error: "Collector subagents cannot be steered; use agents_wait or cancel the task."
	};
	const rateKey = `${params.controller.callerSessionKey}:${params.entry.childSessionKey}`;
	if (process.env.VITEST !== "true") {
		const now = Date.now();
		if (now - (steerRateLimit.get(rateKey) ?? 0) < STEER_RATE_LIMIT_MS) return {
			status: "rate_limited",
			runId: params.entry.runId,
			sessionKey: params.entry.childSessionKey,
			error: "Steer rate limit exceeded. Wait a moment before sending another steer."
		};
		steerRateLimit.set(rateKey, now);
	}
	let ownsSteerRestart;
	try {
		ownsSteerRestart = markSubagentRunForSteerRestart(params.entry.runId, currentEntry);
	} catch (error) {
		return {
			status: "error",
			runId: params.entry.runId,
			sessionKey: params.entry.childSessionKey,
			error: `Failed to persist steer restart ownership: ${formatErrorMessage(error)}`
		};
	}
	if (!ownsSteerRestart) return {
		status: "error",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: "Another subagent restart already owns this session; retry after it settles."
	};
	const targetSession = resolveSessionEntryForKey({
		cfg: params.cfg,
		key: params.entry.childSessionKey,
		cache: /* @__PURE__ */ new Map()
	});
	const sessionId = typeof targetSession.entry?.sessionId === "string" && targetSession.entry.sessionId.trim() ? targetSession.entry.sessionId.trim() : void 0;
	const restartSessionId = sessionId ? crypto.randomUUID() : void 0;
	const runtime = await resolveSubagentMessagingRuntime();
	if (sessionId) {
		const active = runtime.isEmbeddedAgentRunActive(sessionId);
		const aborted = runtime.abortEmbeddedAgentRun(sessionId);
		if (active && !aborted) {
			clearSubagentRunSteerRestart(params.entry.runId, currentEntry);
			return {
				status: "error",
				runId: params.entry.runId,
				sessionKey: params.entry.childSessionKey,
				sessionId,
				error: "Subagent reply is already finalizing and can no longer be restarted."
			};
		}
	}
	const cleared = runtime.clearSessionQueues([params.entry.childSessionKey, sessionId]);
	if (cleared.followupCleared > 0 || cleared.laneCleared > 0) logVerbose(`subagents control steer: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`);
	try {
		await subagentMessagingDeps.callGateway({
			method: "agent.wait",
			params: {
				runId: params.entry.runId,
				timeoutMs: STEER_ABORT_SETTLE_TIMEOUT_MS
			},
			timeoutMs: 7e3
		});
	} catch {}
	const idempotencyKey = crypto.randomUUID();
	let runId = idempotencyKey;
	const latestAfterWait = getLatestLiveSubagentRunByChildSessionKey(currentEntry.childSessionKey);
	const hasPendingDescendantsAfterWait = countPendingDescendantRuns(currentEntry.childSessionKey) > 0;
	if (latestAfterWait !== currentEntry || currentEntry.suppressAnnounceReason !== "steer-restart" || currentEntry.execution.restartRecovery || currentEntry.killIntent || currentEntry.killReconciliation || isFinishedSubagentRunForSteer(currentEntry, hasPendingDescendantsAfterWait)) {
		clearSubagentRunSteerRestart(params.entry.runId, currentEntry);
		return {
			status: "done",
			runId: params.entry.runId,
			sessionKey: params.entry.childSessionKey,
			text: `${resolveSubagentLabel(params.entry)} is already finished.`
		};
	}
	try {
		const steerLifecycleGeneration = getAgentEventLifecycleGeneration();
		const response = await subagentMessagingDeps.callGateway({
			method: "agent",
			params: {
				message: params.message,
				sessionKey: params.entry.childSessionKey,
				sessionId: restartSessionId,
				idempotencyKey,
				deliver: false,
				channel: INTERNAL_MESSAGE_CHANNEL,
				lane: AGENT_LANE_SUBAGENT,
				timeout: 0
			},
			timeoutMs: 1e4
		});
		if (typeof response?.runId === "string" && response.runId) runId = response.runId;
		let acceptedSessionEntry;
		try {
			acceptedSessionEntry = loadSessionEntry({
				storePath: targetSession.storePath,
				sessionKey: params.entry.childSessionKey,
				clone: false,
				readConsistency: "latest"
			});
		} catch {}
		const terminateUnownedSteer = () => terminateAcceptedCollectorRun({
			childSessionKey: params.entry.childSessionKey,
			gatewayRunId: runId,
			expectedSessionId: acceptedSessionEntry?.sessionId,
			expectedLifecycleRevision: acceptedSessionEntry?.lifecycleRevision,
			callGateway: subagentMessagingDeps.callGateway,
			timeoutMs: 1e4
		});
		if (!isAgentEventLifecycleGenerationCurrent(steerLifecycleGeneration)) {
			await terminateUnownedSteer();
			clearSubagentRunSteerRestart(params.entry.runId, currentEntry);
			return {
				status: "error",
				runId,
				sessionKey: params.entry.childSessionKey,
				sessionId: restartSessionId,
				error: "Gateway lifecycle changed before the steered run could be registered."
			};
		}
		if (!replaceSubagentRunAfterSteerCore({
			previousRunId: params.entry.runId,
			nextRunId: runId,
			fallback: currentEntry,
			expected: currentEntry,
			allowEndedSource: true,
			runTimeoutSeconds: currentEntry.runTimeoutSeconds ?? 0,
			lifecycleGeneration: steerLifecycleGeneration,
			task: params.message
		})) {
			await terminateUnownedSteer();
			clearSubagentRunSteerRestart(params.entry.runId, currentEntry);
			return {
				status: "error",
				runId,
				sessionKey: params.entry.childSessionKey,
				sessionId: restartSessionId,
				error: "failed to replace steered subagent run"
			};
		}
	} catch (err) {
		clearSubagentRunSteerRestart(params.entry.runId, currentEntry);
		const error = formatErrorMessage(err);
		return {
			status: "error",
			runId,
			sessionKey: params.entry.childSessionKey,
			sessionId: restartSessionId,
			error
		};
	}
	return {
		status: "accepted",
		runId,
		sessionKey: params.entry.childSessionKey,
		sessionId: restartSessionId,
		mode: "restart",
		label: resolveSubagentLabel(params.entry),
		text: `steered ${resolveSubagentLabel(params.entry)}.`
	};
}
/** Sends a follow-up message to a controlled subagent and waits for a reply. */
async function sendControlledSubagentMessage(params) {
	const ownershipError = ensureSubagentControllerOwnsRun({
		cfg: params.cfg,
		controller: params.controller,
		entry: params.entry
	});
	if (ownershipError) return {
		status: "forbidden",
		error: ownershipError
	};
	if (params.entry.collect) return {
		status: "forbidden",
		error: "Collector subagents cannot receive follow-up messages; use agents_wait."
	};
	if (params.controller.controlScope !== "children") return {
		status: "forbidden",
		error: "Leaf subagents cannot control other sessions."
	};
	const currentEntry = getLatestLiveSubagentRunByChildSessionKey(params.entry.childSessionKey);
	if (!currentEntry || currentEntry.runId !== params.entry.runId) return {
		status: "done",
		runId: params.entry.runId,
		text: `${resolveSubagentLabel(params.entry)} is already finished.`
	};
	const targetSessionKey = params.entry.childSessionKey;
	const parsed = parseAgentSessionKey(targetSessionKey);
	const targetSessionEntry = loadSessionEntry({
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: parsed?.agentId }),
		sessionKey: targetSessionKey,
		clone: false
	});
	const targetSessionId = typeof targetSessionEntry?.sessionId === "string" && targetSessionEntry.sessionId.trim() ? targetSessionEntry.sessionId.trim() : void 0;
	const idempotencyKey = crypto.randomUUID();
	let runId = idempotencyKey;
	try {
		const baselineReply = await readLatestAssistantReplySnapshot({
			sessionKey: targetSessionKey,
			limit: SUBAGENT_REPLY_HISTORY_LIMIT,
			callGateway: subagentMessagingDeps.callGateway
		});
		const response = await subagentMessagingDeps.callGateway({
			method: "agent",
			params: {
				message: params.message,
				sessionKey: targetSessionKey,
				sessionId: targetSessionId,
				idempotencyKey,
				deliver: false,
				channel: INTERNAL_MESSAGE_CHANNEL,
				lane: AGENT_LANE_SUBAGENT,
				timeout: 0
			},
			timeoutMs: 1e4
		});
		const responseRunId = typeof response?.runId === "string" ? response.runId : void 0;
		if (responseRunId) runId = responseRunId;
		const result = await waitForAgentRunAndReadUpdatedAssistantReply({
			runId,
			sessionKey: targetSessionKey,
			timeoutMs: 3e4,
			limit: SUBAGENT_REPLY_HISTORY_LIMIT,
			baseline: baselineReply,
			callGateway: subagentMessagingDeps.callGateway
		});
		if (result.status === "timeout") return {
			status: "timeout",
			runId
		};
		if (result.status === "error") return {
			status: "error",
			runId,
			error: result.error ?? "unknown error"
		};
		return {
			status: "ok",
			runId,
			replyText: result.replyText
		};
	} catch (err) {
		const error = formatErrorMessage(err);
		return {
			status: "error",
			runId,
			error
		};
	}
}
//#endregion
//#region src/agents/subagents/registry/subagent-control-kill.ts
/** Authorized single-run, tree, and admin subagent kill orchestration. */
async function killSubagentRunTree(params) {
	let killed = 0;
	const labels = [];
	const errors = [];
	for (const run of params.runs) {
		const childKey = run.childSessionKey?.trim();
		if (!childKey || params.seenChildSessionKeys.has(childKey)) continue;
		const latest = getLatestLiveSubagentRunByChildSessionKey(childKey);
		if (!latest || !isSameSubagentRunGeneration(latest, run)) continue;
		const latestControllerSessionKey = latest.controllerSessionKey?.trim() || latest.requesterSessionKey?.trim();
		if (params.controllerSessionKey && latestControllerSessionKey !== params.controllerSessionKey) continue;
		params.seenChildSessionKeys.add(childKey);
		const entry = latest;
		if (!entry.execution.endedAt || entry.pauseReason === "sessions_yield") {
			const stopped = await killLatestSubagentRun({
				cfg: params.cfg,
				entry,
				cache: params.cache,
				suppressTaskDelivery: params.suppressTaskDelivery
			});
			const stopResult = stopped.result;
			if (stopResult.error) errors.push(`${resolveSubagentLabel(stopped.entry)}: ${stopResult.error}`);
			const stoppedEntryIsCurrent = isCurrentSubagentRun(stopped.entry, params.cfg);
			if (stopResult.superseded || !stopResult.killed && !stoppedEntryIsCurrent) continue;
			if (stopResult.killed) {
				killed += 1;
				labels.push(resolveSubagentLabel(stopped.entry));
			}
			if (!stoppedEntryIsCurrent) continue;
		}
		const cascade = await killSubagentRunTree({
			cfg: params.cfg,
			runs: listSubagentRunsForController(childKey),
			cache: params.cache,
			seenChildSessionKeys: params.seenChildSessionKeys,
			controllerSessionKey: childKey,
			suppressTaskDelivery: params.suppressTaskDelivery
		});
		killed += cascade.killed;
		labels.push(...cascade.labels);
		errors.push(...cascade.errors);
	}
	return {
		killed,
		labels,
		errors
	};
}
async function cascadeKillChildren(params) {
	return killSubagentRunTree({
		cfg: params.cfg,
		runs: listSubagentRunsForController(params.parentChildSessionKey),
		cache: params.cache,
		seenChildSessionKeys: params.seenChildSessionKeys ?? /* @__PURE__ */ new Set(),
		controllerSessionKey: params.parentChildSessionKey,
		suppressTaskDelivery: params.suppressTaskDelivery
	});
}
/** Kills every currently controlled child run and its descendants. */
async function killAllControlledSubagentRuns(params) {
	if (params.controller.controlScope !== "children") return {
		status: "forbidden",
		error: "Leaf subagents cannot control other sessions.",
		killed: 0,
		labels: []
	};
	const result = await killSubagentRunTree({
		cfg: params.cfg,
		runs: params.runs,
		cache: /* @__PURE__ */ new Map(),
		seenChildSessionKeys: /* @__PURE__ */ new Set(),
		controllerSessionKey: params.controller.controllerSessionKey,
		suppressTaskDelivery: params.suppressTaskDelivery
	});
	if (result.errors.length > 0) return {
		status: "error",
		error: result.errors.join("; "),
		killed: result.killed,
		labels: result.labels
	};
	return {
		status: "ok",
		killed: result.killed,
		labels: result.labels
	};
}
/** Kills one controlled subagent run and any active descendants. */
async function killControlledSubagentRun(params) {
	if (params.controller.controlScope !== "children") return {
		status: "forbidden",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: "Leaf subagents cannot control other sessions."
	};
	const currentEntry = getLatestLiveSubagentRunByChildSessionKey(params.entry.childSessionKey);
	if (!currentEntry || !isSameSubagentRunGeneration(currentEntry, params.entry)) return {
		status: "done",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		label: resolveSubagentLabel(params.entry),
		text: `${resolveSubagentLabel(params.entry)} is already finished.`
	};
	const ownershipError = ensureSubagentControllerOwnsRun({
		cfg: params.cfg,
		controller: params.controller,
		entry: currentEntry
	});
	if (ownershipError) return {
		status: "forbidden",
		runId: currentEntry.runId,
		sessionKey: currentEntry.childSessionKey,
		error: ownershipError
	};
	const killCache = /* @__PURE__ */ new Map();
	const stopped = await killLatestSubagentRun({
		cfg: params.cfg,
		entry: currentEntry,
		cache: killCache,
		suppressTaskDelivery: params.suppressTaskDelivery
	});
	const stopResult = stopped.result;
	if (stopResult.error) return {
		status: "error",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: stopResult.error
	};
	const stoppedEntryIsCurrent = isCurrentSubagentRun(stopped.entry, params.cfg);
	if (stopResult.superseded || !stopResult.killed && !stoppedEntryIsCurrent) return {
		status: "done",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		label: resolveSubagentLabel(params.entry),
		text: `${resolveSubagentLabel(params.entry)} is already finished.`
	};
	if (!stoppedEntryIsCurrent) return {
		status: "ok",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		label: resolveSubagentLabel(params.entry),
		killed: true,
		cascadeKilled: 0,
		cascadeLabels: void 0,
		text: `killed ${resolveSubagentLabel(params.entry)}.`
	};
	const seenChildSessionKeys = /* @__PURE__ */ new Set();
	const targetChildKey = params.entry.childSessionKey?.trim();
	if (targetChildKey) seenChildSessionKeys.add(targetChildKey);
	const cascade = await cascadeKillChildren({
		cfg: params.cfg,
		parentChildSessionKey: params.entry.childSessionKey,
		cache: killCache,
		seenChildSessionKeys,
		suppressTaskDelivery: params.suppressTaskDelivery
	});
	if (cascade.errors.length > 0) return {
		status: "error",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		error: cascade.errors.join("; "),
		...stopResult.killed ? { killed: true } : {},
		cascadeKilled: cascade.killed,
		cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0
	};
	if (!stopResult.killed && cascade.killed === 0) return {
		status: "done",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		label: resolveSubagentLabel(params.entry),
		text: `${resolveSubagentLabel(params.entry)} is already finished.`
	};
	const cascadeText = cascade.killed > 0 ? ` (+ ${cascade.killed} descendant${cascade.killed === 1 ? "" : "s"})` : "";
	return {
		status: "ok",
		runId: params.entry.runId,
		sessionKey: params.entry.childSessionKey,
		label: resolveSubagentLabel(params.entry),
		...stopResult.killed ? { killed: true } : {},
		cascadeKilled: cascade.killed,
		cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0,
		text: stopResult.killed ? `killed ${resolveSubagentLabel(params.entry)}${cascadeText}.` : `killed ${cascade.killed} descendant${cascade.killed === 1 ? "" : "s"} of ${resolveSubagentLabel(params.entry)}.`
	};
}
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
async function killSubagentRunAdmin(params) {
	const targetSessionKey = params.sessionKey.trim();
	if (!targetSessionKey) return {
		found: false,
		killed: false
	};
	const entry = getLatestOwnedSubagentRun(targetSessionKey, params.agentId, params.cfg);
	if (!entry) return {
		found: false,
		killed: false
	};
	const killCache = /* @__PURE__ */ new Map();
	const stopped = await killLatestSubagentRun({
		cfg: params.cfg,
		entry,
		cache: killCache
	});
	const stopResult = stopped.result;
	if (stopResult.error) return {
		found: true,
		killed: false,
		runId: stopped.entry.runId,
		sessionKey: stopped.entry.childSessionKey,
		cascadeKilled: 0,
		error: stopResult.error
	};
	const stoppedEntryIsCurrent = isCurrentSubagentRun(stopped.entry, params.cfg);
	if (stopResult.superseded || !stopResult.killed && !stoppedEntryIsCurrent) return {
		found: true,
		killed: false,
		runId: stopped.entry.runId,
		sessionKey: stopped.entry.childSessionKey,
		cascadeKilled: 0
	};
	if (!stoppedEntryIsCurrent) return {
		found: true,
		killed: stopResult.killed,
		...stopResult.targetState ? { targetState: stopResult.targetState } : {},
		runId: stopped.entry.runId,
		sessionKey: stopped.entry.childSessionKey,
		cascadeKilled: 0
	};
	const seenChildSessionKeys = /* @__PURE__ */ new Set([targetSessionKey]);
	const cascade = await cascadeKillChildren({
		cfg: params.cfg,
		parentChildSessionKey: targetSessionKey,
		cache: killCache,
		seenChildSessionKeys
	});
	const targetState = resolveSubagentKillTargetState(stopped.entry) ?? stopResult.targetState;
	const killedTarget = targetState?.state === "terminal" && targetState.task.status === "cancelled" && targetState.task.error === "Subagent run killed.";
	const stopResultAlreadyClearedAbort = stopResult.targetState !== void 0 && !(stopResult.targetState.state === "terminal" && stopResult.targetState.task.status === "cancelled" && stopResult.targetState.task.error === "Subagent run killed.");
	if (targetState && !killedTarget && !stopResultAlreadyClearedAbort) {
		const resolved = resolveSessionEntryForKey({
			cfg: params.cfg,
			key: targetSessionKey,
			cache: killCache
		});
		await persistSubagentAbortedLastRun({
			childSessionKey: targetSessionKey,
			storePath: resolved.storePath,
			hasSessionEntry: resolved.entry !== void 0,
			expectedSessionId: resolved.entry?.sessionId,
			expectedLifecycleRevision: resolved.entry?.lifecycleRevision,
			abortedLastRun: false,
			isCurrent: () => isCurrentSubagentRun(stopped.entry, params.cfg)
		});
	}
	return {
		found: true,
		killed: stopResult.killed || cascade.killed > 0,
		...targetState ? { targetState } : {},
		runId: stopped.entry.runId,
		sessionKey: stopped.entry.childSessionKey,
		cascadeKilled: cascade.killed,
		cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-control.ts
/** Controller-authorized subagent list, kill, steer, and message operations. */
const testing = { setDepsForTest(overrides) {
	setSubagentKillTestDeps(overrides);
	setSubagentMessagingTestDeps(overrides);
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.subagentControlTestApi")] = testing;
//#endregion
export { steerControlledSubagentRun as a, listControlledSubagentRuns as c, sendControlledSubagentMessage as i, resolveSubagentController as l, killControlledSubagentRun as n, MAX_RECENT_MINUTES as o, killSubagentRunAdmin as r, buildControlledSubagentRunsReadContext as s, killAllControlledSubagentRuns as t };
