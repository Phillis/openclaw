import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.js";
import { t as createAgentRunStaleLifecycleError } from "./agent-lifecycle-error-eMD2INV2.js";
import { S as rotateAgentRunRegistryLifecycleGeneration, _ as registerAgentRunSequenceResetHandler, b as resetAgentRunRegistryForTest, l as getAgentRunContextOwnership, s as getAgentRunContext, u as getAgentRunLifecycleGeneration } from "./agent-run-registry-t4kvUyNQ.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/agent-event-lifecycle.ts
/** Returns true when a lifecycle start omits its producer-owned finite timestamp. */
function hasInvalidLifecycleStartTimestamp(stream, data) {
	if (stream !== "lifecycle" || !data || typeof data !== "object" || Array.isArray(data)) return false;
	const lifecycle = data;
	return lifecycle.phase === "start" && (typeof lifecycle.startedAt !== "number" || !Number.isFinite(lifecycle.startedAt));
}
//#endregion
//#region src/infra/agent-events.ts
const AGENT_EVENT_STATE_KEY = Symbol.for("openclaw.agentEvents.state");
const AGENT_EVENT_EXECUTION_CONTEXT_KEY = Symbol.for("openclaw.agentEvents.executionContext");
function getAgentEventState() {
	return resolveGlobalSingleton(AGENT_EVENT_STATE_KEY, () => ({
		seqByRun: /* @__PURE__ */ new Map(),
		listeners: /* @__PURE__ */ new Set(),
		auditListeners: /* @__PURE__ */ new Set()
	}));
}
registerAgentRunSequenceResetHandler((runId) => {
	getAgentEventState().seqByRun.delete(runId);
});
function getAgentEventExecutionContext() {
	return resolveGlobalSingleton(AGENT_EVENT_EXECUTION_CONTEXT_KEY, () => new AsyncLocalStorage());
}
/** Runs one execution with immutable ownership inherited by every emitted stream event. */
function withAgentRunLifecycleGeneration(lifecycleGeneration, run) {
	const storage = getAgentEventExecutionContext();
	const parent = storage.getStore();
	const onceByRun = parent?.lifecycleGeneration === lifecycleGeneration ? parent.onceByRun : /* @__PURE__ */ new Map();
	return storage.run({
		lifecycleGeneration,
		onceByRun
	}, run);
}
/** Shares one operation across fallback attempts that belong to the same admitted run. */
function runOncePerAgentRun(runId, operation, run) {
	const context = getAgentEventExecutionContext().getStore();
	if (!context) return run();
	const key = `${operation}:${runId}`;
	const existing = context.onceByRun.get(key);
	if (existing) return existing;
	const pending = Promise.resolve().then(run);
	context.onceByRun.set(key, pending);
	return pending;
}
function getAgentEventLifecycleGeneration() {
	return getAgentRunLifecycleGeneration();
}
function isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) {
	return lifecycleGeneration === getAgentRunLifecycleGeneration();
}
/** Registers process-local state cleanup at the gateway lifecycle boundary. */
function registerAgentEventLifecycleRotationHandler(key, handler) {
	const state = getAgentEventState();
	(state.lifecycleRotationHandlers ?? (state.lifecycleRotationHandlers = /* @__PURE__ */ new Map())).set(key, handler);
}
/** Rejects work that no longer belongs to the active gateway lifecycle. */
function assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration) {
	if (isAgentEventLifecycleGenerationCurrent(lifecycleGeneration)) return;
	throw createAgentRunStaleLifecycleError();
}
/** Captures immutable lifecycle ownership for one admitted execution. */
function captureAgentRunLifecycleGeneration(runId) {
	return getAgentEventExecutionContext().getStore()?.lifecycleGeneration ?? getAgentRunContext(runId)?.lifecycleGeneration ?? getAgentRunLifecycleGeneration();
}
/** Starts a new ownership generation before an in-process gateway restart. */
function rotateAgentEventLifecycleGeneration() {
	const state = getAgentEventState();
	const lifecycleGeneration = rotateAgentRunRegistryLifecycleGeneration();
	const errors = [];
	notifyListeners(state.lifecycleRotationHandlers?.values() ?? [], lifecycleGeneration, (error) => errors.push(error));
	if (errors.length > 0) throw new AggregateError(errors, "Failed to retire stale agent lifecycle owners");
	return lifecycleGeneration;
}
function enrichAgentEvent(event, claimId) {
	const state = getAgentEventState();
	const currentLifecycleGeneration = getAgentRunLifecycleGeneration();
	const owners = getAgentRunContextOwnership(event.runId);
	if (claimId !== void 0) {
		if (owners?.lifecycleGeneration !== currentLifecycleGeneration || owners.exclusiveClaimId !== claimId || !owners.claimIds.has(claimId) || owners.clearRequested) return;
	} else if (owners?.lifecycleGeneration === currentLifecycleGeneration && owners.exclusiveClaimId) return;
	const context = getAgentRunContext(event.runId);
	const executionLifecycleGeneration = event.lifecycleGeneration ?? getAgentEventExecutionContext().getStore()?.lifecycleGeneration;
	const ownedLifecycleGeneration = executionLifecycleGeneration ?? context?.lifecycleGeneration;
	if (executionLifecycleGeneration && context?.lifecycleGeneration && executionLifecycleGeneration !== context.lifecycleGeneration) return;
	if (ownedLifecycleGeneration && ownedLifecycleGeneration !== currentLifecycleGeneration) return;
	if (hasInvalidLifecycleStartTimestamp(event.stream, event.data)) return;
	let data = event.data;
	if (context && event.stream === "lifecycle") {
		if (data.phase === "start") context.lifecycleStartedAt = data.startedAt;
		else if ((data.phase === "end" || data.phase === "error") && data.startedAt === void 0 && context.lifecycleStartedAt !== void 0) data = {
			...data,
			startedAt: context.lifecycleStartedAt
		};
	}
	const nextSeq = (state.seqByRun.get(event.runId) ?? 0) + 1;
	state.seqByRun.set(event.runId, nextSeq);
	if (context) context.lastActiveAt = Date.now();
	const isControlUiVisible = context?.isControlUiVisible ?? true;
	const eventSessionKey = typeof event.sessionKey === "string" && event.sessionKey.trim() ? event.sessionKey : void 0;
	const deliverySessionKey = eventSessionKey ?? context?.sessionKey;
	const sessionKey = isControlUiVisible || event.stream === "lifecycle" ? eventSessionKey ?? context?.sessionKey : void 0;
	const sessionId = event.stream === "lifecycle" ? event.sessionId ?? context?.sessionId : event.sessionId;
	const lifecycleGeneration = event.stream === "lifecycle" ? ownedLifecycleGeneration ?? currentLifecycleGeneration : ownedLifecycleGeneration;
	const agentId = event.agentId ?? context?.agentId;
	const enriched = {
		...event,
		data,
		sessionKey,
		...sessionId ? { sessionId } : {},
		...agentId ? { agentId } : {},
		seq: nextSeq,
		ts: Date.now()
	};
	if (lifecycleGeneration) Object.defineProperty(enriched, "lifecycleGeneration", {
		value: lifecycleGeneration,
		enumerable: false
	});
	if (context?.isControlUiVisible !== void 0) Object.defineProperty(enriched, "controlUiVisible", {
		value: context.isControlUiVisible,
		enumerable: false
	});
	if (context?.projectSessionLifecycle !== void 0) Object.defineProperty(enriched, "projectSessionLifecycle", {
		value: context.projectSessionLifecycle,
		enumerable: false
	});
	if (context?.projectSessionMessages !== void 0) Object.defineProperty(enriched, "projectSessionMessages", {
		value: context.projectSessionMessages,
		enumerable: false
	});
	if (context?.mainSessionRestartRecovery === true) Object.defineProperty(enriched, "mainSessionRestartRecovery", {
		value: true,
		enumerable: false
	});
	if (claimId !== void 0) {
		Object.defineProperty(enriched, "contextClaimId", {
			value: claimId,
			enumerable: false
		});
		if (deliverySessionKey) Object.defineProperty(enriched, "deliverySessionKey", {
			value: deliverySessionKey,
			enumerable: false
		});
	}
	return enriched;
}
/** Emits an event only when its run ownership is still current. */
function emitAgentEventIfCurrent(event) {
	const enriched = enrichAgentEvent(event);
	if (!enriched) return false;
	notifyListeners(getAgentEventState().listeners, enriched);
	return true;
}
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
function emitAgentEvent(event) {
	emitAgentEventIfCurrent(event);
}
function emitAgentEventForOwner(event, claimId) {
	const enriched = enrichAgentEvent(event, claimId);
	if (enriched) notifyListeners(getAgentEventState().listeners, enriched);
}
/** Emits run metadata only to the Gateway-owned durable audit projection. */
function emitAgentAuditEvent(event) {
	const state = getAgentEventState();
	const enriched = enrichAgentEvent(event);
	if (enriched) {
		notifyListeners(state.auditListeners, enriched);
		const phase = event.stream === "lifecycle" ? event.data.phase : void 0;
		if ((phase === "end" || phase === "error") && !getAgentRunContext(event.runId)) state.seqByRun.delete(event.runId);
	}
}
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
function onAgentEvent(listener) {
	return registerListener(getAgentEventState().listeners, listener);
}
/** Subscribes Gateway internals that consume non-public ownership and routing metadata. */
function onAgentRuntimeEvent(listener) {
	return registerListener(getAgentEventState().listeners, listener);
}
/** Subscribes to private audit-only agent events; returns an unsubscribe callback. */
function onAgentAuditEvent(listener) {
	return registerListener(getAgentEventState().auditListeners, listener);
}
/** Clears agent event state; test suites with a live Gateway can preserve its listeners. */
function resetAgentEventsForTest(options) {
	const state = getAgentEventState();
	state.seqByRun.clear();
	resetAgentRunRegistryForTest();
	if (!options?.preserveListeners) {
		state.listeners.clear();
		state.auditListeners.clear();
	}
}
//#endregion
export { hasInvalidLifecycleStartTimestamp as _, emitAgentEventForOwner as a, isAgentEventLifecycleGenerationCurrent as c, onAgentRuntimeEvent as d, registerAgentEventLifecycleRotationHandler as f, withAgentRunLifecycleGeneration as g, runOncePerAgentRun as h, emitAgentEvent as i, onAgentAuditEvent as l, rotateAgentEventLifecycleGeneration as m, captureAgentRunLifecycleGeneration as n, emitAgentEventIfCurrent as o, resetAgentEventsForTest as p, emitAgentAuditEvent as r, getAgentEventLifecycleGeneration as s, assertAgentRunLifecycleGenerationCurrent as t, onAgentEvent as u };
