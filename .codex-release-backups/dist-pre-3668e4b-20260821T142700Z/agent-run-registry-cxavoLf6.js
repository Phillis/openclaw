import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { randomUUID } from "node:crypto";
//#region src/infra/agent-run-usage.ts
const usageByRun = /* @__PURE__ */ new Map();
/** Adds one completed model call and emits the new generation-scoped total. */
function recordAgentRunOutputTokens(params) {
	const outputTokens = Math.floor(params.outputTokens);
	if (!Number.isFinite(outputTokens) || outputTokens <= 0) return;
	const usageByGeneration = usageByRun.get(params.runId) ?? /* @__PURE__ */ new Map();
	const usage = { outputTokens: (usageByGeneration.get(params.lifecycleGeneration)?.outputTokens ?? 0) + outputTokens };
	if (!params.emit(usage)) return;
	usageByGeneration.set(params.lifecycleGeneration, usage);
	usageByRun.set(params.runId, usageByGeneration);
	return usage;
}
function clearAgentRunUsage(runId, lifecycleGeneration) {
	if (lifecycleGeneration === void 0) {
		usageByRun.delete(runId);
		return;
	}
	const usageByGeneration = usageByRun.get(runId);
	usageByGeneration?.delete(lifecycleGeneration);
	if (usageByGeneration?.size === 0) usageByRun.delete(runId);
}
function resetAgentRunUsageForTest() {
	usageByRun.clear();
}
//#endregion
//#region src/infra/agent-run-registry.ts
const AGENT_RUN_REGISTRY_STATE_KEY = Symbol.for("openclaw.agentRunRegistry.state");
function getAgentRunRegistryState() {
	return resolveGlobalSingleton(AGENT_RUN_REGISTRY_STATE_KEY, () => ({
		contexts: /* @__PURE__ */ new Map(),
		owners: /* @__PURE__ */ new Map(),
		lifecycleGeneration: randomUUID(),
		version: 0
	}));
}
function bumpAgentRunIndexVersion() {
	getAgentRunRegistryState().version += 1;
}
/** Reads the process-local version of the active-run projection inputs. */
function readAgentRunIndexVersion() {
	return getAgentRunRegistryState().version;
}
function getAgentRunLifecycleGeneration() {
	return getAgentRunRegistryState().lifecycleGeneration;
}
function rotateAgentRunRegistryLifecycleGeneration() {
	const state = getAgentRunRegistryState();
	for (const context of state.contexts.values()) {
		const authority = context.delegatedAuthority;
		if (authority) {
			delete context.delegatedAuthority;
			notifyDelegatedAuthorityClosed(state, authority);
		}
	}
	state.lifecycleGeneration = randomUUID();
	bumpAgentRunIndexVersion();
	return state.lifecycleGeneration;
}
function notifyDelegatedAuthorityClosed(state, authority) {
	try {
		state.delegatedAuthorityClosedHandler?.(authority);
	} catch {}
}
/** Installs the Gateway-lifetime observer for exact delegated-authority closure. */
function registerAgentRunDelegatedAuthorityClosedHandler(handler) {
	const state = getAgentRunRegistryState();
	state.delegatedAuthorityClosedHandler = handler;
	return () => {
		if (state.delegatedAuthorityClosedHandler === handler) state.delegatedAuthorityClosedHandler = void 0;
	};
}
/** Connects registry cleanup to the event sequencer without reversing ownership. */
function registerAgentRunSequenceResetHandler(handler) {
	getAgentRunRegistryState().sequenceResetHandler = handler;
}
/** Registers or merges per-run context used by later agent event emissions. */
function registerAgentRunContext(runId, context, claimId) {
	if (!runId) return;
	const state = getAgentRunRegistryState();
	const lifecycleGeneration = context.lifecycleGeneration ?? state.lifecycleGeneration;
	const owners = state.owners.get(runId);
	if (owners?.lifecycleGeneration === lifecycleGeneration && owners.exclusiveClaimId && (owners.exclusiveClaimId !== claimId || owners.clearRequested)) return;
	const existing = state.contexts.get(runId);
	if (!existing) {
		state.contexts.set(runId, {
			...context,
			lifecycleGeneration,
			registeredAt: context.registeredAt ?? Date.now()
		});
		bumpAgentRunIndexVersion();
		return;
	}
	if (context.lifecycleGeneration && existing.lifecycleGeneration && context.lifecycleGeneration !== existing.lifecycleGeneration) return;
	let runIndexChanged = false;
	if (context.sessionKey && existing.sessionKey !== context.sessionKey) {
		existing.sessionKey = context.sessionKey;
		runIndexChanged = true;
	}
	if (context.sessionId && existing.sessionId !== context.sessionId) {
		existing.sessionId = context.sessionId;
		runIndexChanged = true;
	}
	if (context.agentId && existing.agentId !== context.agentId) existing.agentId = context.agentId;
	if (context.verboseLevel && existing.verboseLevel !== context.verboseLevel) existing.verboseLevel = context.verboseLevel;
	if (context.isControlUiVisible !== void 0) existing.isControlUiVisible = context.isControlUiVisible;
	if (context.projectSessionActive !== void 0 && existing.projectSessionActive !== context.projectSessionActive) {
		existing.projectSessionActive = context.projectSessionActive;
		runIndexChanged = true;
	}
	if (context.projectSessionLifecycle !== void 0) existing.projectSessionLifecycle = context.projectSessionLifecycle;
	if (context.cronRunsByJobId !== void 0) {
		existing.cronRunsByJobId ??= /* @__PURE__ */ new Map();
		for (const [jobId, cronRun] of context.cronRunsByJobId) existing.cronRunsByJobId.set(jobId, cronRun);
	}
	if (context.isHeartbeat !== void 0 && existing.isHeartbeat !== context.isHeartbeat) existing.isHeartbeat = context.isHeartbeat;
	if (context.registeredAt !== void 0) existing.registeredAt = context.registeredAt;
	if (context.lastActiveAt !== void 0) existing.lastActiveAt = context.lastActiveAt;
	if (runIndexChanged) bumpAgentRunIndexVersion();
}
/** Claims a run id for a newly admitted execution, replacing stale ownership. */
function claimAgentRunContext(runId, context, options = {}) {
	if (!runId) return;
	const state = getAgentRunRegistryState();
	const lifecycleGeneration = context.lifecycleGeneration ?? state.lifecycleGeneration;
	const existing = state.contexts.get(runId);
	const existingOwners = state.owners.get(runId);
	const currentOwners = existingOwners?.lifecycleGeneration === lifecycleGeneration ? existingOwners : void 0;
	const adoptsExistingUnowned = options.exclusive === true && options.adoptExistingUnowned === true && existing?.lifecycleGeneration === lifecycleGeneration && currentOwners === void 0;
	if (currentOwners?.exclusiveClaimId || options.exclusive && (existing?.lifecycleGeneration === lifecycleGeneration && !adoptsExistingUnowned || currentOwners !== void 0)) return;
	let claimId;
	if (options.trackOwner) {
		claimId = randomUUID();
		if (currentOwners) {
			currentOwners.claimIds.add(claimId);
			if (options.protectFromSweep) currentOwners.sweepProtectedClaimIds.add(claimId);
			if (options.ownsContext) currentOwners.preserveAfterRelease = false;
			if (options.onClearRequested) {
				currentOwners.clearListeners ??= /* @__PURE__ */ new Map();
				currentOwners.clearListeners.set(claimId, options.onClearRequested);
			}
		} else state.owners.set(runId, {
			lifecycleGeneration,
			claimIds: /* @__PURE__ */ new Set([claimId]),
			sweepProtectedClaimIds: new Set(options.protectFromSweep ? [claimId] : []),
			preserveAfterRelease: options.ownsContext !== true && existing?.lifecycleGeneration === lifecycleGeneration,
			clearRequested: false,
			...options.exclusive ? { exclusiveClaimId: claimId } : {},
			...options.onClearRequested ? { clearListeners: /* @__PURE__ */ new Map([[claimId, options.onClearRequested]]) } : {}
		});
	} else if (existingOwners?.lifecycleGeneration !== lifecycleGeneration) state.owners.delete(runId);
	if (existing?.lifecycleGeneration === lifecycleGeneration) {
		const versionBeforeRegister = readAgentRunIndexVersion();
		registerAgentRunContext(runId, {
			...context,
			lifecycleGeneration
		}, claimId);
		if (readAgentRunIndexVersion() === versionBeforeRegister) bumpAgentRunIndexVersion();
		return claimId;
	}
	state.contexts.set(runId, {
		...context,
		lifecycleGeneration,
		registeredAt: context.registeredAt ?? Date.now()
	});
	state.sequenceResetHandler?.(runId);
	clearAgentRunUsage(runId);
	bumpAgentRunIndexVersion();
	return claimId;
}
/** Returns the currently registered context for a run, if it has not been cleared or swept. */
function getAgentRunContext(runId) {
	return getAgentRunRegistryState().contexts.get(runId);
}
function bindAgentRunTaskRunId(runId, claimId, taskRunId) {
	const normalizedTaskRunId = taskRunId.trim();
	const ownership = getAgentRunRegistryState().owners.get(runId);
	if (!normalizedTaskRunId || !ownership?.claimIds.has(claimId)) return false;
	ownership.taskRunIds ??= /* @__PURE__ */ new Map();
	ownership.taskRunIds.set(claimId, normalizedTaskRunId);
	return true;
}
function getAgentRunTaskRunId(runId) {
	const ownership = getAgentRunRegistryState().owners.get(runId);
	if (!ownership?.taskRunIds) return;
	const taskRunIds = /* @__PURE__ */ new Set();
	for (const [claimId, taskRunId] of ownership.taskRunIds) if (ownership.claimIds.has(claimId)) taskRunIds.add(taskRunId);
	return taskRunIds.size === 1 ? taskRunIds.values().next().value : void 0;
}
/** Holds an existing run context only while its current execution awaits lane admission. */
function retainQueuedAgentRunContext(runId, lifecycleGeneration) {
	const state = getAgentRunRegistryState();
	const context = state.contexts.get(runId);
	if (!context || context.lifecycleGeneration !== lifecycleGeneration || state.lifecycleGeneration !== lifecycleGeneration) return;
	const leases = state.queuedRunContextLeases ??= /* @__PURE__ */ new WeakMap();
	leases.set(context, (leases.get(context) ?? 0) + 1);
	let released = false;
	return (outcome) => {
		if (released) return;
		released = true;
		const remaining = (leases.get(context) ?? 0) - 1;
		if (remaining > 0) leases.set(context, remaining);
		else leases.delete(context);
		if (outcome === "admitted" && state.contexts.get(runId) === context && context.lifecycleGeneration === lifecycleGeneration && state.lifecycleGeneration === lifecycleGeneration) context.lastActiveAt = Date.now();
	};
}
function getAgentRunContextOwnership(runId) {
	return getAgentRunRegistryState().owners.get(runId);
}
/** Records the latest next-check proposal on the matching paced cron run. */
function recordCronNextCheckProposal(runId, jobId, delayMs) {
	const cronRun = getAgentRunContext(runId)?.cronRunsByJobId?.get(jobId);
	if (!cronRun) throw new Error("cron next_check is only available to the currently running job");
	if (!cronRun.pacingEnabled) throw new Error("cron next_check requires pacing on the current job");
	cronRun.nextCheckMs = delayMs;
}
/** Consumes one successful cron run's proposal so it cannot affect a later run. */
function consumeCronNextCheckProposal(runId, jobId) {
	const context = getAgentRunContext(runId);
	const cronRuns = context?.cronRunsByJobId;
	const cronRun = cronRuns?.get(jobId);
	if (!cronRun) return;
	cronRuns?.delete(jobId);
	if (cronRuns?.size === 0 && context) delete context.cronRunsByJobId;
	return cronRun.nextCheckMs;
}
function getAgentRunContextOwnerStatus(runId, claimId, lifecycleGeneration) {
	const state = getAgentRunRegistryState();
	const owners = state.owners.get(runId);
	if (lifecycleGeneration !== state.lifecycleGeneration || owners?.lifecycleGeneration !== lifecycleGeneration || !owners.claimIds.has(claimId)) return;
	return owners.clearRequested ? "clear-requested" : "active";
}
function sameOperationalRunInstance(left, right) {
	return left.instanceId === right.instanceId && left.runId === right.runId;
}
function ownsCurrentAgentRunClaim(runId, claimId, lifecycleGeneration) {
	const state = getAgentRunRegistryState();
	const owners = state.owners.get(runId);
	return lifecycleGeneration === state.lifecycleGeneration && owners?.lifecycleGeneration === lifecycleGeneration && owners.claimIds.has(claimId);
}
/** Claims approval authority for the exact admitted operational execution. */
function claimAgentRunDelegatedAuthority(operationalRunInstance) {
	const instanceId = operationalRunInstance.instanceId.trim();
	const runId = operationalRunInstance.runId.trim();
	if (!instanceId || !runId) throw new Error("agent run delegated authority requires an operational run instance");
	const state = getAgentRunRegistryState();
	const lifecycleGeneration = state.lifecycleGeneration;
	const existing = state.contexts.get(runId)?.delegatedAuthority;
	if (existing && sameOperationalRunInstance(existing.operationalRunInstance, {
		instanceId,
		runId
	}) && ownsCurrentAgentRunClaim(runId, existing.claimId, lifecycleGeneration)) return existing;
	if (existing) releaseAgentRunContext(runId, existing.claimId);
	const claimId = claimAgentRunContext(runId, {
		lifecycleGeneration,
		lastActiveAt: Date.now()
	}, {
		trackOwner: true,
		protectFromSweep: true,
		onClearRequested: (requestedClaimId) => {
			releaseAgentRunContext(runId, requestedClaimId);
		}
	});
	if (!claimId) throw new Error("agent run delegated authority could not claim the operational execution");
	const authority = Object.freeze({
		operationalRunInstance: operationalRunInstance.instanceId === instanceId && operationalRunInstance.runId === runId ? operationalRunInstance : Object.freeze({
			instanceId,
			runId
		}),
		lifecycleGeneration,
		claimId
	});
	const context = state.contexts.get(runId);
	if (!context || context.lifecycleGeneration !== lifecycleGeneration) {
		releaseAgentRunContext(runId, claimId);
		throw new Error("agent run delegated authority lost its lifecycle during admission");
	}
	context.delegatedAuthority = authority;
	return authority;
}
/** Returns authority only while the exact lifecycle owner still holds its claim. */
function getActiveAgentRunDelegatedAuthority(operationalRunInstance) {
	const authority = getAgentRunRegistryState().contexts.get(operationalRunInstance.runId)?.delegatedAuthority;
	return authority && sameOperationalRunInstance(authority.operationalRunInstance, operationalRunInstance) && ownsCurrentAgentRunClaim(operationalRunInstance.runId, authority.claimId, authority.lifecycleGeneration) ? authority : void 0;
}
function validateAgentRunDelegatedAuthority(authority) {
	const active = getActiveAgentRunDelegatedAuthority(authority.operationalRunInstance);
	return active?.claimId === authority.claimId && active.lifecycleGeneration === authority.lifecycleGeneration;
}
/** Compare-releases only the exact authority owned by one admitted execution. */
function releaseAgentRunDelegatedAuthority(authority) {
	if (!validateAgentRunDelegatedAuthority(authority)) return false;
	releaseAgentRunContext(authority.operationalRunInstance.runId, authority.claimId);
	return true;
}
/** Lists active runs bound to one current session identity. */
function listAgentRunsForSession(params) {
	const state = getAgentRunRegistryState();
	const runs = [];
	for (const [runId, context] of state.contexts) if ((context.sessionId ? context.sessionId === params.sessionId : context.sessionKey === params.sessionKey) && context.lifecycleGeneration === state.lifecycleGeneration) runs.push({
		runId,
		lifecycleGeneration: context.lifecycleGeneration
	});
	return runs.toSorted((a, b) => a.runId === b.runId ? a.lifecycleGeneration.localeCompare(b.lifecycleGeneration) : a.runId.localeCompare(b.runId));
}
function projectedRunIdentity(agentId, value) {
	return `${normalizeAgentId(agentId)}\0${value}`;
}
function buildProjectedAgentRunIndex() {
	const state = getAgentRunRegistryState();
	const sessionKeys = /* @__PURE__ */ new Set();
	const sessionIds = /* @__PURE__ */ new Set();
	const ownerlessSessionKeys = /* @__PURE__ */ new Set();
	const ownerlessSessionIds = /* @__PURE__ */ new Set();
	for (const context of state.contexts.values()) {
		if (context.projectSessionActive !== true || context.lifecycleGeneration !== state.lifecycleGeneration) continue;
		const agentId = context.agentId ?? parseAgentSessionKey(context.sessionKey)?.agentId;
		if (context.sessionKey !== void 0 && agentId) sessionKeys.add(projectedRunIdentity(agentId, context.sessionKey));
		else if (context.sessionKey !== void 0) ownerlessSessionKeys.add(context.sessionKey);
		if (context.sessionId !== void 0 && agentId) sessionIds.add(projectedRunIdentity(agentId, context.sessionId));
		else if (context.sessionId !== void 0) ownerlessSessionIds.add(context.sessionId);
	}
	return {
		sessionKeys,
		sessionIds,
		ownerlessSessionKeys,
		ownerlessSessionIds
	};
}
function hasProjectedAgentRunForSession(params) {
	const index = params.index ?? buildProjectedAgentRunIndex();
	const agentId = params.agentId ?? params.sessionKeys.flatMap((key) => parseAgentSessionKey(key)?.agentId ?? [])[0] ?? params.defaultAgentId;
	if (!agentId) return false;
	const mayAdoptOwnerless = params.defaultAgentId !== void 0 && normalizeAgentId(agentId) === normalizeAgentId(params.defaultAgentId);
	return params.sessionKeys.some((sessionKey) => index.sessionKeys.has(projectedRunIdentity(agentId, sessionKey))) || mayAdoptOwnerless && params.sessionKeys.some((sessionKey) => index.ownerlessSessionKeys.has(sessionKey)) || params.sessionId !== void 0 && (index.sessionIds.has(projectedRunIdentity(agentId, params.sessionId)) || mayAdoptOwnerless && index.ownerlessSessionIds.has(params.sessionId));
}
/** Clears context state for a run that has ended or been discarded. */
function clearAgentRunContext(runId, lifecycleGeneration, claimId) {
	const state = getAgentRunRegistryState();
	const existing = state.contexts.get(runId);
	if (lifecycleGeneration && existing && existing.lifecycleGeneration !== lifecycleGeneration) return;
	const owners = state.owners.get(runId);
	if (claimId && (!owners || lifecycleGeneration && owners.lifecycleGeneration !== lifecycleGeneration || !owners.claimIds.has(claimId))) return;
	if (owners?.exclusiveClaimId && owners.exclusiveClaimId !== claimId) return;
	if (owners?.claimIds.size) {
		if (!lifecycleGeneration || owners.lifecycleGeneration === lifecycleGeneration) {
			const wasClearRequested = owners.clearRequested;
			owners.clearRequested = true;
			for (const [ownerClaimId, listener] of owners.clearListeners ?? []) {
				if (ownerClaimId === existing?.delegatedAuthority?.claimId) continue;
				listener(ownerClaimId);
			}
			if (!wasClearRequested) bumpAgentRunIndexVersion();
		}
		return;
	}
	const removed = state.contexts.delete(runId);
	state.sequenceResetHandler?.(runId);
	clearAgentRunUsage(runId, lifecycleGeneration ?? existing?.lifecycleGeneration);
	if (removed) bumpAgentRunIndexVersion();
}
/** Releases one tracked owner and clears its context after the final owner exits. */
function releaseAgentRunContext(runId, claimId) {
	if (!runId || !claimId) return;
	const state = getAgentRunRegistryState();
	const owners = state.owners.get(runId);
	if (!owners?.claimIds.delete(claimId)) return;
	const context = state.contexts.get(runId);
	const authority = context?.delegatedAuthority;
	if (context && authority?.claimId === claimId) {
		delete context.delegatedAuthority;
		notifyDelegatedAuthorityClosed(state, authority);
	}
	owners.sweepProtectedClaimIds.delete(claimId);
	const versionBeforeRelease = readAgentRunIndexVersion();
	owners.taskRunIds?.delete(claimId);
	owners.clearListeners?.delete(claimId);
	if (owners.exclusiveClaimId === claimId) owners.exclusiveClaimId = void 0;
	if (owners.claimIds.size > 0) {
		bumpAgentRunIndexVersion();
		return;
	}
	state.owners.delete(runId);
	if (owners.clearRequested || !owners.preserveAfterRelease) clearAgentRunContext(runId, owners.lifecycleGeneration);
	if (readAgentRunIndexVersion() === versionBeforeRelease) bumpAgentRunIndexVersion();
}
/** Sweeps orphaned run contexts that exceeded the given TTL. */
function sweepStaleRunContexts(maxAgeMs = 1800 * 1e3) {
	const state = getAgentRunRegistryState();
	const now = Date.now();
	let swept = 0;
	for (const [runId, context] of state.contexts) {
		if (context.lifecycleGeneration === state.lifecycleGeneration && (state.queuedRunContextLeases?.get(context) ?? 0) > 0) continue;
		const owners = state.owners.get(runId);
		if (owners?.lifecycleGeneration === state.lifecycleGeneration && owners.sweepProtectedClaimIds.size > 0) continue;
		const lastSeen = context.lastActiveAt ?? context.registeredAt;
		if ((lastSeen ? now - lastSeen : Infinity) > maxAgeMs) {
			state.contexts.delete(runId);
			state.sequenceResetHandler?.(runId);
			clearAgentRunUsage(runId, context.lifecycleGeneration);
			state.owners.delete(runId);
			swept += 1;
		}
	}
	if (swept > 0) bumpAgentRunIndexVersion();
	return swept;
}
function resetAgentRunRegistryForTest() {
	const state = getAgentRunRegistryState();
	const hadRunContexts = state.contexts.size > 0;
	resetAgentRunUsageForTest();
	state.contexts.clear();
	state.owners.clear();
	state.queuedRunContextLeases = void 0;
	if (hadRunContexts) bumpAgentRunIndexVersion();
}
//#endregion
export { retainQueuedAgentRunContext as C, recordAgentRunOutputTokens as D, validateAgentRunDelegatedAuthority as E, resetAgentRunRegistryForTest as S, sweepStaleRunContexts as T, registerAgentRunContext as _, clearAgentRunContext as a, releaseAgentRunContext as b, getAgentRunContext as c, getAgentRunLifecycleGeneration as d, getAgentRunTaskRunId as f, recordCronNextCheckProposal as g, readAgentRunIndexVersion as h, claimAgentRunDelegatedAuthority as i, getAgentRunContextOwnerStatus as l, listAgentRunsForSession as m, buildProjectedAgentRunIndex as n, consumeCronNextCheckProposal as o, hasProjectedAgentRunForSession as p, claimAgentRunContext as r, getActiveAgentRunDelegatedAuthority as s, bindAgentRunTaskRunId as t, getAgentRunContextOwnership as u, registerAgentRunDelegatedAuthorityClosedHandler as v, rotateAgentRunRegistryLifecycleGeneration as w, releaseAgentRunDelegatedAuthority as x, registerAgentRunSequenceResetHandler as y };
