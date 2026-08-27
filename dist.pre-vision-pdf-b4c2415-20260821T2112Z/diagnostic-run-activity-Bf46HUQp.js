import { F as markCoreSemanticRunProgressDiagnosticEvent, P as CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY, R as CORE_MODEL_REQUEST_STARTED_METADATA_KEY, h as onInternalDiagnosticEvent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, u as getInternalDiagnosticEventSequence, z as markCoreModelRequestStartedDiagnosticEvent } from "./diagnostic-events-Djn4AVRp.js";
//#region src/infra/diagnostic-model-request.ts
/** Emits a request attempt from the core boundary that owns provider streaming. */
function emitCoreModelRequestStartedDiagnosticEvent(event, privateData) {
	emitTrustedDiagnosticEventWithPrivateData(markCoreModelRequestStartedDiagnosticEvent({
		...event,
		type: "model.call.started",
		observationUnit: "request"
	}), privateData);
}
/** Returns whether core observed the provider request represented by this event. */
function isCoreModelRequestStartedDiagnosticMetadata(metadata) {
	return metadata[CORE_MODEL_REQUEST_STARTED_METADATA_KEY] === true;
}
//#endregion
//#region src/infra/diagnostic-semantic-run-progress.ts
/** Emits semantic run progress from the core boundary that validated the model result. */
function emitCoreSemanticRunProgressDiagnosticEvent(event) {
	emitTrustedDiagnosticEvent(markCoreSemanticRunProgressDiagnosticEvent({
		...event,
		type: "run.progress"
	}));
}
/** Returns whether core validated the semantic model result that produced this progress event. */
function isCoreSemanticRunProgressDiagnosticMetadata(metadata) {
	return metadata[CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY] === true;
}
//#endregion
//#region src/logging/diagnostic-argument-churn-activity.ts
const ARGUMENT_CHURN_CONTINUITY_WINDOW_MS = 6e4;
let diagnosticActivitySequence = 0;
function nextDiagnosticActivitySequence() {
	diagnosticActivitySequence += 1;
	return diagnosticActivitySequence;
}
function recordDiagnosticActivityProgress(activity) {
	activity.lastProgressSequence = nextDiagnosticActivitySequence();
}
function resolveCurrentArgumentChurnOwner(owners) {
	let currentOwner;
	for (const owner of owners) if (!currentOwner || owner.sequence > currentOwner.sequence) currentOwner = owner;
	return currentOwner;
}
function hasArgumentChurnContinuityExpired(activity, now) {
	const observationAt = activity.argumentChurnObservationAt;
	const lastProgressAt = activity.lastProgressAt;
	const observationSequence = activity.argumentChurnObservationSequence;
	const lastProgressSequence = activity.lastProgressSequence;
	return observationAt !== void 0 && (observationSequence !== void 0 && lastProgressSequence !== void 0 ? lastProgressSequence > observationSequence : lastProgressAt !== void 0 && observationAt !== void 0 && lastProgressAt > observationAt) && now - observationAt >= ARGUMENT_CHURN_CONTINUITY_WINDOW_MS;
}
function resolveArgumentChurnProgress(activity, owners, now) {
	const currentOwnerRunId = resolveCurrentArgumentChurnOwner(owners)?.runId;
	if (currentOwnerRunId !== void 0 && activity.argumentChurnPolicyWaitRunId === currentOwnerRunId && (activity.argumentChurnPolicyWaitTokens?.size ?? 0) > 0) return {
		lastProgressAt: now,
		lastProgressReason: "tool_policy:pending"
	};
	const startedAt = activity.argumentChurnStartedAt;
	if (!(startedAt !== void 0 && currentOwnerRunId === activity.argumentChurnRunId)) return {
		lastProgressAt: activity.lastProgressAt,
		lastProgressReason: activity.lastProgressReason
	};
	if (hasArgumentChurnContinuityExpired(activity, now)) return {
		lastProgressAt: activity.lastProgressAt,
		lastProgressReason: activity.lastProgressReason
	};
	return {
		lastProgressAt: startedAt,
		lastProgressReason: "tool_loop:argument_churn"
	};
}
function recordArgumentChurnActivityObservation(activity, params) {
	if (params.existingOnly && (activity.argumentChurnStartedAt === void 0 || activity.argumentChurnRunId !== params.runId)) return;
	if (!params.active) {
		if (activity.argumentChurnRunId === params.runId) clearArgumentChurnActivity(activity, params);
		return;
	}
	const continuityExpired = hasArgumentChurnContinuityExpired(activity, params.now);
	if (activity.argumentChurnStartedAt === void 0 || activity.argumentChurnRunId !== params.runId || continuityExpired) {
		activity.argumentChurnStartedAt = params.now;
		activity.argumentChurnRunId = params.runId;
	}
	activity.argumentChurnObservationAt = params.now;
	activity.argumentChurnObservationSequence = nextDiagnosticActivitySequence();
}
function updateArgumentChurnPolicyWait(activity, params) {
	if (params.action === "enter") {
		if (activity.argumentChurnPolicyWaitRunId !== params.runId) {
			activity.argumentChurnPolicyWaitRunId = params.runId;
			activity.argumentChurnPolicyWaitTokens = /* @__PURE__ */ new Set();
		}
		activity.argumentChurnPolicyWaitTokens?.add(params.token);
		return;
	}
	if (activity.argumentChurnPolicyWaitRunId !== params.runId) return;
	activity.argumentChurnPolicyWaitTokens?.delete(params.token);
	if (activity.argumentChurnPolicyWaitTokens?.size === 0) {
		activity.argumentChurnPolicyWaitRunId = void 0;
		activity.argumentChurnPolicyWaitTokens = void 0;
	}
}
function clearArgumentChurnPolicyWaits(activity, params = {}) {
	if (params.runId !== void 0 && activity.argumentChurnPolicyWaitRunId !== params.runId) return false;
	const cleared = (activity.argumentChurnPolicyWaitTokens?.size ?? 0) > 0;
	activity.argumentChurnPolicyWaitRunId = void 0;
	activity.argumentChurnPolicyWaitTokens = void 0;
	return cleared;
}
function applyArgumentChurnObservation(activity, owners, params) {
	const now = params.now ?? Date.now();
	const runId = params.runId?.trim() || void 0;
	const currentOwnerRunId = resolveCurrentArgumentChurnOwner(owners)?.runId;
	if (currentOwnerRunId !== void 0 && currentOwnerRunId !== runId) return;
	if (params.policyWait) {
		if (params.policyWaitToken) updateArgumentChurnPolicyWait(activity, {
			action: params.policyWait,
			runId,
			token: params.policyWaitToken
		});
		return;
	}
	recordArgumentChurnActivityObservation(activity, {
		runId,
		active: params.active === true,
		existingOnly: params.existingOnly,
		now
	});
}
function mergeArgumentChurnActivity(target, source) {
	const sourceObservationSequence = source.argumentChurnObservationSequence;
	const targetObservationSequence = target.argumentChurnObservationSequence;
	const sourceClearsAtSameTime = sourceObservationSequence === void 0 && targetObservationSequence === void 0 && source.argumentChurnObservationAt !== void 0 && source.argumentChurnObservationAt === target.argumentChurnObservationAt && source.argumentChurnStartedAt === void 0 && target.argumentChurnStartedAt !== void 0;
	const sourceIsNewer = sourceObservationSequence !== void 0 ? targetObservationSequence === void 0 || sourceObservationSequence > targetObservationSequence : targetObservationSequence === void 0 && source.argumentChurnObservationAt !== void 0 && (target.argumentChurnObservationAt === void 0 || source.argumentChurnObservationAt > target.argumentChurnObservationAt || sourceClearsAtSameTime);
	if (source.argumentChurnStartedAt !== void 0 && source.argumentChurnRunId === target.argumentChurnRunId && target.argumentChurnStartedAt !== void 0) {
		target.argumentChurnStartedAt = Math.min(target.argumentChurnStartedAt, source.argumentChurnStartedAt);
		if (source.argumentChurnObservationAt !== void 0 && (sourceIsNewer || sourceObservationSequence === void 0 && source.argumentChurnObservationAt >= (target.argumentChurnObservationAt ?? 0))) {
			target.argumentChurnObservationAt = source.argumentChurnObservationAt;
			target.argumentChurnObservationSequence = sourceObservationSequence;
		}
	} else if (sourceIsNewer) {
		target.argumentChurnStartedAt = source.argumentChurnStartedAt;
		target.argumentChurnObservationAt = source.argumentChurnObservationAt;
		target.argumentChurnObservationSequence = sourceObservationSequence;
		target.argumentChurnRunId = source.argumentChurnRunId;
	}
	if ((source.argumentChurnPolicyWaitTokens?.size ?? 0) === 0) return;
	if (target.argumentChurnPolicyWaitRunId !== source.argumentChurnPolicyWaitRunId) {
		if ((target.argumentChurnPolicyWaitTokens?.size ?? 0) === 0) {
			target.argumentChurnPolicyWaitRunId = source.argumentChurnPolicyWaitRunId;
			target.argumentChurnPolicyWaitTokens = new Set(source.argumentChurnPolicyWaitTokens);
		}
		return;
	}
	target.argumentChurnPolicyWaitTokens ??= /* @__PURE__ */ new Set();
	for (const token of source.argumentChurnPolicyWaitTokens ?? []) target.argumentChurnPolicyWaitTokens.add(token);
}
function clearArgumentChurnActivity(activity, params = {}) {
	const cleared = activity.argumentChurnStartedAt !== void 0;
	activity.argumentChurnStartedAt = void 0;
	activity.argumentChurnObservationAt = params.now ?? Date.now();
	activity.argumentChurnObservationSequence = nextDiagnosticActivitySequence();
	activity.argumentChurnRunId = params.runId;
	return cleared;
}
//#endregion
//#region src/logging/diagnostic-embedded-run-index.ts
function createDiagnosticEmbeddedRunIndex(runIdIndex) {
	const remove = (activity, workKey) => {
		const embeddedRun = activity.activeEmbeddedRuns.get(workKey);
		if (!embeddedRun) return;
		activity.activeEmbeddedRuns.delete(workKey);
		if (!Array.from(activity.activeEmbeddedRuns.values()).some((candidate) => candidate.runId === embeddedRun.runId) && runIdIndex.get(embeddedRun.runId) === activity) runIdIndex.delete(embeddedRun.runId);
		return embeddedRun;
	};
	const clear = (activity) => {
		for (const workKey of Array.from(activity.activeEmbeddedRuns.keys())) remove(activity, workKey);
	};
	return {
		clear,
		remove
	};
}
//#endregion
//#region src/logging/diagnostic-repeated-request-activity.ts
let mutationSequence = 0;
function nextMutationSequence() {
	mutationSequence += 1;
	return mutationSequence;
}
function currentOwner(owners) {
	let current;
	for (const owner of owners) if (!current || owner.sequence > current.sequence) current = owner;
	return current;
}
function recordRepeatedRequestObservation(activity, owners, params) {
	if (params.observationUnit === "turn") return;
	const owner = currentOwner(owners);
	const runId = params.runId?.trim();
	if (!owner || !runId || owner.runId !== runId) return;
	if (activity.repeatedRequestOwnerRunId !== runId) {
		activity.repeatedRequestOwnerRunId = runId;
		activity.repeatedRequestFirstStartedAt = params.now ?? Date.now();
		activity.repeatedRequestCount = 1;
	} else activity.repeatedRequestCount = (activity.repeatedRequestCount ?? 0) + 1;
	activity.repeatedRequestMutationSequence = nextMutationSequence();
}
function clearRepeatedRequestActivity(activity, params = {}) {
	if (params.runId !== void 0 && activity.repeatedRequestOwnerRunId !== void 0 && activity.repeatedRequestOwnerRunId !== params.runId) return false;
	const cleared = activity.repeatedRequestCount !== void 0;
	if (!cleared && params.runId !== void 0) return false;
	activity.repeatedRequestOwnerRunId = void 0;
	activity.repeatedRequestFirstStartedAt = void 0;
	activity.repeatedRequestCount = void 0;
	activity.repeatedRequestMutationSequence = nextMutationSequence();
	return cleared;
}
function mergeRepeatedRequestActivity(target, source) {
	if (source.repeatedRequestMutationSequence === void 0 || (target.repeatedRequestMutationSequence ?? 0) >= source.repeatedRequestMutationSequence) return;
	target.repeatedRequestOwnerRunId = source.repeatedRequestOwnerRunId;
	target.repeatedRequestFirstStartedAt = source.repeatedRequestFirstStartedAt;
	target.repeatedRequestCount = source.repeatedRequestCount;
	target.repeatedRequestMutationSequence = source.repeatedRequestMutationSequence;
}
function resolveRepeatedRequestNoProgressAgeMs(activity, owners, now) {
	const owner = currentOwner(owners);
	if (!owner || owner.runId !== activity.repeatedRequestOwnerRunId || (activity.repeatedRequestCount ?? 0) < 2 || activity.repeatedRequestFirstStartedAt === void 0) return;
	return Math.max(0, now - activity.repeatedRequestFirstStartedAt);
}
//#endregion
//#region src/logging/diagnostic-run-activity-snapshot.ts
function buildDiagnosticSessionActivitySnapshot(activity, now) {
	const activeWorkKind = activity.activeTools.size > 0 ? "tool_call" : activity.activeModelCalls.size > 0 ? "model_call" : activity.activeEmbeddedRuns.size > 0 ? "embedded_run" : void 0;
	let activeTool;
	for (const tool of activity.activeTools.values()) if (!activeTool || tool.startedAt < activeTool.startedAt) activeTool = tool;
	const churnProgress = resolveArgumentChurnProgress(activity, activity.activeEmbeddedRuns.values(), now);
	return {
		activeWorkKind,
		...activity.activeEmbeddedRuns.size > 0 ? { hasActiveEmbeddedRun: true } : {},
		activeToolName: activeTool?.toolName,
		activeToolCallId: activeTool?.toolCallId,
		activeToolAgeMs: activeTool ? Math.max(0, now - activeTool.startedAt) : void 0,
		lastProgressAgeMs: Math.max(0, now - churnProgress.lastProgressAt),
		lastProgressReason: churnProgress.lastProgressReason,
		repeatedRequestNoProgressAgeMs: resolveRepeatedRequestNoProgressAgeMs(activity, activity.activeEmbeddedRuns.values(), now)
	};
}
//#endregion
//#region src/logging/diagnostic-run-activity.ts
const BLOCKED_TOOL_CALL_ABORT_FLOOR_MS = 15 * 6e4;
const RUN_STALE_TAKEOVER_MS = 10 * 6e4;
function resolveRunStaleThresholdMs(activity) {
	return activity.activeWorkKind === "tool_call" ? Math.max(RUN_STALE_TAKEOVER_MS, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS) : RUN_STALE_TAKEOVER_MS;
}
const activityByRef = /* @__PURE__ */ new Map();
const activityByRunId = /* @__PURE__ */ new Map();
const embeddedRunIndex = createDiagnosticEmbeddedRunIndex(activityByRunId);
let embeddedRunSequence = 0;
function sessionRefs(params) {
	const refs = [];
	const sessionId = params.sessionId?.trim();
	const sessionKey = params.sessionKey?.trim();
	if (sessionId) refs.push(`id:${sessionId}`);
	if (sessionKey) refs.push(`key:${sessionKey}`);
	return refs;
}
function registerSessionActivityRefs(activity, params) {
	activity.sessionId ??= params.sessionId;
	activity.sessionKey ??= params.sessionKey;
	for (const ref of sessionRefs(params)) activityByRef.set(ref, activity);
	if (params.runId) activityByRunId.set(params.runId, activity);
}
function replaceSessionActivityReferences(source, target) {
	for (const [ref, activity] of activityByRef) if (activity === source) activityByRef.set(ref, target);
	for (const [runId, activity] of activityByRunId) if (activity === source) activityByRunId.set(runId, target);
}
function mergeSessionActivity(target, source) {
	target.sessionId ??= source.sessionId;
	target.sessionKey ??= source.sessionKey;
	for (const [key, embeddedRun] of source.activeEmbeddedRuns) {
		const existing = target.activeEmbeddedRuns.get(key);
		if (existing && existing.runId !== embeddedRun.runId) embeddedRunIndex.remove(target, key);
		target.activeEmbeddedRuns.set(key, embeddedRun);
	}
	for (const [key, tool] of source.activeTools) target.activeTools.set(key, tool);
	for (const [key, modelCall] of source.activeModelCalls) target.activeModelCalls.set(key, modelCall);
	for (const [ownerRef, cutoff] of source.recoveredOwnerStartEventCutoffs) target.recoveredOwnerStartEventCutoffs.set(ownerRef, Math.max(cutoff, target.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0));
	if (source.lastProgressSequence !== void 0 ? target.lastProgressSequence === void 0 || source.lastProgressSequence > target.lastProgressSequence : target.lastProgressSequence === void 0 && source.lastProgressAt > target.lastProgressAt) {
		target.lastProgressAt = source.lastProgressAt;
		target.lastProgressReason = source.lastProgressReason;
		target.lastProgressSequence = source.lastProgressSequence;
	}
	mergeArgumentChurnActivity(target, source);
	mergeRepeatedRequestActivity(target, source);
	replaceSessionActivityReferences(source, target);
}
function resolveSessionActivity(params) {
	let activity;
	if (params.runId) {
		const byRun = activityByRunId.get(params.runId);
		if (byRun) activity = byRun;
	}
	for (const ref of sessionRefs(params)) {
		const byRef = activityByRef.get(ref);
		if (!byRef) continue;
		if (!activity) activity = byRef;
		else if (activity !== byRef) mergeSessionActivity(activity, byRef);
	}
	if (activity) {
		registerSessionActivityRefs(activity, params);
		return activity;
	}
	if (!params.create) return;
	const created = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		activeEmbeddedRuns: /* @__PURE__ */ new Map(),
		activeTools: /* @__PURE__ */ new Map(),
		activeModelCalls: /* @__PURE__ */ new Map(),
		recoveredOwnerStartEventCutoffs: /* @__PURE__ */ new Map(),
		lastProgressAt: Date.now()
	};
	registerSessionActivityRefs(created, params);
	return created;
}
function touchSessionActivity(activity, reason, now = Date.now()) {
	activity.lastProgressAt = now;
	activity.lastProgressReason = reason;
	recordDiagnosticActivityProgress(activity);
}
function touchSemanticSessionActivity(activity, reason, params = {}) {
	clearRepeatedRequestActivity(activity, { runId: params.runId });
	touchSessionActivity(activity, reason, params.now);
}
function toolKey(event) {
	return `${event.runId ?? event.sessionId ?? event.sessionKey ?? "unknown"}:${event.toolCallId ?? event.toolName}`;
}
function modelCallKey(event) {
	return `${event.runId ?? "unknown"}:${event.provider ?? "provider"}:${event.model ?? "model"}`;
}
function recordToolStarted(event) {
	const activity = resolveSessionActivity({
		...event,
		create: true
	});
	if (!activity || shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
	const now = Date.now();
	activity.activeTools.set(toolKey(event), {
		runId: event.runId,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		sequence: event.seq,
		toolName: event.toolName,
		toolCallId: event.toolCallId,
		startedAt: now,
		lastProgressAt: now
	});
	touchSessionActivity(activity, `tool:${event.toolName}:started`, now);
}
function recordToolEnded(event) {
	const activity = resolveSessionActivity(event);
	if (!activity) return;
	activity.activeTools.delete(toolKey(event));
	touchSessionActivity(activity, `tool:${event.toolName}:ended`);
}
function recordModelStarted(event, coreRequest) {
	const activity = resolveSessionActivity({
		...event,
		create: true
	});
	if (!activity) return;
	if (shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
	if (coreRequest) recordRepeatedRequestObservation(activity, activity.activeEmbeddedRuns.values(), event);
	activity.activeModelCalls.set(modelCallKey(event), {
		runId: event.runId,
		sessionId: event.sessionId,
		sessionKey: event.sessionKey,
		sequence: event.seq
	});
	touchSessionActivity(activity, "model_call:started");
}
function recordModelEnded(event) {
	const activity = resolveSessionActivity(event);
	if (!activity) return;
	activity.activeModelCalls.delete(modelCallKey(event));
	touchSessionActivity(activity, "model_call:ended");
}
function recordRunProgress(event, coreSemantic) {
	applyRunProgress(event, coreSemantic);
}
function markDiagnosticArgumentChurnObservation(params) {
	const activity = resolveSessionActivity({
		...params,
		create: params.active === true
	});
	if (activity) applyArgumentChurnObservation(activity, activity.activeEmbeddedRuns.values(), params);
}
const markDiagnosticRunProgress = applyRunProgress;
function applyRunProgress(params, semantic = false) {
	const runId = params.runId?.trim() || void 0;
	const activity = resolveSessionActivity({
		...params,
		runId,
		create: true
	});
	if (!activity) return;
	if (!semantic || !runId) {
		touchSessionActivity(activity, params.reason);
		return;
	}
	touchSemanticSessionActivity(activity, params.reason, { runId });
}
function recordRunCompleted(event) {
	const activity = resolveSessionActivity(event);
	if (!activity) return;
	activity.activeTools.clear();
	activity.activeModelCalls.clear();
	activityByRunId.delete(event.runId);
	if (activity.repeatedRequestOwnerRunId === event.runId) {
		touchSessionActivity(activity, "run:attempt_completed");
		return;
	}
	embeddedRunIndex.clear(activity);
	clearArgumentChurnActivity(activity, { runId: event.runId });
	clearArgumentChurnPolicyWaits(activity, { runId: event.runId });
	touchSemanticSessionActivity(activity, "run:completed", { runId: event.runId });
}
function markDiagnosticEmbeddedRunStarted(params) {
	const ownerRunId = params.runId?.trim() || params.sessionId.trim();
	const activity = resolveSessionActivity({
		...params,
		runId: ownerRunId,
		create: true
	});
	if (activity.repeatedRequestOwnerRunId !== ownerRunId) clearRepeatedRequestActivity(activity);
	if (activity.argumentChurnStartedAt !== void 0) clearArgumentChurnActivity(activity, { runId: ownerRunId });
	clearArgumentChurnPolicyWaits(activity);
	const workKey = resolveEmbeddedRunWorkKey(params);
	const existing = activity.activeEmbeddedRuns.get(workKey);
	if (existing && existing.runId !== ownerRunId) embeddedRunIndex.remove(activity, workKey);
	activity.activeEmbeddedRuns.set(workKey, {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: ownerRunId,
		sequence: ++embeddedRunSequence
	});
	touchSessionActivity(activity, "embedded_run:started");
}
function markDiagnosticEmbeddedRunEnded(params) {
	const activity = resolveSessionActivity(params);
	if (!activity) return;
	embeddedRunIndex.remove(activity, resolveEmbeddedRunWorkKey(params));
	if (params.clearRunActivity !== false) {
		activity.activeTools.clear();
		activity.activeModelCalls.clear();
	}
	if (activity.activeEmbeddedRuns.size === 0) {
		clearArgumentChurnActivity(activity);
		clearArgumentChurnPolicyWaits(activity);
	}
	touchSessionActivity(activity, "embedded_run:ended");
}
function resolveEmbeddedRunWorkKey(params) {
	return params.workKey ?? params.sessionId;
}
function ownerRefsForRecovery(params) {
	const refs = [params.activeSessionId?.trim(), params.sessionId?.trim()].filter((ref) => Boolean(ref));
	return new Set(refs);
}
function ownerRefsForStartedEvent(event) {
	return [event.runId?.trim(), event.sessionId?.trim()].filter((ref) => Boolean(ref));
}
function markerBelongsToRecoveredOwner(marker, ownerRefs) {
	return marker.runId !== void 0 && ownerRefs.has(marker.runId) || marker.sessionId !== void 0 && ownerRefs.has(marker.sessionId);
}
function embeddedRunStartedAfter(embeddedRun, sequence) {
	return sequence !== void 0 && embeddedRun.sequence > sequence;
}
function activityMarkerStartedAfter(marker, sequence) {
	return sequence !== void 0 && marker.sequence !== void 0 && marker.sequence > sequence;
}
function clearRecoveredOwnerEmbeddedRuns(activity, ownerRefs, recoveryStartedAfterSequence) {
	if (ownerRefs.size === 0) return;
	for (const [key, embeddedRun] of activity.activeEmbeddedRuns) if (embeddedRun.sessionId !== void 0 && ownerRefs.has(embeddedRun.sessionId) && !embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterSequence)) embeddedRunIndex.remove(activity, key);
}
function hasEmbeddedRunStartedAfter(activity, sequence) {
	if (sequence === void 0) return activity.activeEmbeddedRuns.size > 0;
	for (const embeddedRun of activity.activeEmbeddedRuns.values()) if (embeddedRun.sequence > sequence) return true;
	return false;
}
function clearRecoveredOwnerMarkers(activity, ownerRefs, recoveryStartedAfterSequence) {
	if (ownerRefs.size === 0) return;
	for (const [key, tool] of activity.activeTools) if (markerBelongsToRecoveredOwner(tool, ownerRefs) && !activityMarkerStartedAfter(tool, recoveryStartedAfterSequence)) activity.activeTools.delete(key);
	for (const [key, modelCall] of activity.activeModelCalls) if (markerBelongsToRecoveredOwner(modelCall, ownerRefs) && !activityMarkerStartedAfter(modelCall, recoveryStartedAfterSequence)) activity.activeModelCalls.delete(key);
}
function pruneActivityStartedBeforeRecoveryCutoff(activity, recoveryStartedAfterEmbeddedRunSequence, recoveryStartedAfterDiagnosticEventSequence) {
	if (recoveryStartedAfterEmbeddedRunSequence === void 0 && recoveryStartedAfterDiagnosticEventSequence === void 0) return;
	for (const [key, embeddedRun] of activity.activeEmbeddedRuns) if (!embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterEmbeddedRunSequence)) embeddedRunIndex.remove(activity, key);
	for (const [key, tool] of activity.activeTools) if (!activityMarkerStartedAfter(tool, recoveryStartedAfterDiagnosticEventSequence)) activity.activeTools.delete(key);
	for (const [key, modelCall] of activity.activeModelCalls) if (!activityMarkerStartedAfter(modelCall, recoveryStartedAfterDiagnosticEventSequence)) activity.activeModelCalls.delete(key);
}
function rememberRecoveredOwnerStartEventCutoffs(activity, ownerRefs, recoveryStartedAfterSequence) {
	if (recoveryStartedAfterSequence === void 0) return;
	for (const ownerRef of ownerRefs) activity.recoveredOwnerStartEventCutoffs.set(ownerRef, Math.max(recoveryStartedAfterSequence, activity.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0));
}
function shouldIgnoreRecoveredOwnerStartEvent(activity, event) {
	if (event.seq === void 0) return false;
	for (const ownerRef of ownerRefsForStartedEvent(event)) {
		const cutoff = activity.recoveredOwnerStartEventCutoffs.get(ownerRef);
		if (cutoff !== void 0 && event.seq <= cutoff) return true;
	}
	return false;
}
function clearDiagnosticEmbeddedRunActivityForSession(params) {
	const shouldCreateCutoffActivity = params.recoveryStartedAfterDiagnosticEventSequence !== void 0;
	const activity = resolveSessionActivity({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: params.activeSessionId,
		create: shouldCreateCutoffActivity
	});
	if (!activity) return {
		cleared: false,
		blockedByActiveEmbeddedRun: false
	};
	if (params.activeSessionId) registerSessionActivityRefs(activity, {
		sessionId: params.activeSessionId,
		sessionKey: params.sessionKey,
		runId: params.activeSessionId
	});
	const ownerRefs = ownerRefsForRecovery(params);
	rememberRecoveredOwnerStartEventCutoffs(activity, ownerRefs, params.recoveryStartedAfterDiagnosticEventSequence);
	if (activity.activeEmbeddedRuns.size === 0 && activity.activeTools.size === 0 && activity.activeModelCalls.size === 0) {
		const clearedChurn = clearArgumentChurnActivity(activity, { runId: params.activeSessionId });
		const clearedPolicyWait = clearArgumentChurnPolicyWaits(activity, { runId: params.activeSessionId });
		const clearedRepeatedRequests = clearRepeatedRequestActivity(activity);
		return {
			cleared: clearedChurn || clearedPolicyWait || clearedRepeatedRequests,
			blockedByActiveEmbeddedRun: false
		};
	}
	clearRecoveredOwnerEmbeddedRuns(activity, ownerRefs, params.recoveryStartedAfterEmbeddedRunSequence);
	clearRecoveredOwnerMarkers(activity, ownerRefs, params.recoveryStartedAfterDiagnosticEventSequence);
	if (activity.activeEmbeddedRuns.size > 0) {
		if (hasEmbeddedRunStartedAfter(activity, params.recoveryStartedAfterEmbeddedRunSequence)) {
			pruneActivityStartedBeforeRecoveryCutoff(activity, params.recoveryStartedAfterEmbeddedRunSequence, params.recoveryStartedAfterDiagnosticEventSequence);
			touchSessionActivity(activity, "embedded_run:recovery_skipped_active_owner");
			return {
				cleared: false,
				blockedByActiveEmbeddedRun: true
			};
		}
		embeddedRunIndex.clear(activity);
	}
	activity.activeTools.clear();
	activity.activeModelCalls.clear();
	clearArgumentChurnActivity(activity, { runId: params.activeSessionId });
	clearArgumentChurnPolicyWaits(activity, { runId: params.activeSessionId });
	clearRepeatedRequestActivity(activity);
	touchSemanticSessionActivity(activity, "embedded_run:ended");
	return {
		cleared: true,
		blockedByActiveEmbeddedRun: false
	};
}
function getDiagnosticSessionActivitySnapshot(params, now = Date.now()) {
	const activity = resolveSessionActivity(params);
	if (!activity) return {};
	return buildDiagnosticSessionActivitySnapshot(activity, now);
}
function getDiagnosticEmbeddedRunActivitySequence() {
	return embeddedRunSequence;
}
function markDiagnosticRunProgressForTest(params) {
	applyRunProgress(params, params.progressKind === "semantic");
}
function markDiagnosticToolStartedForTest(params) {
	recordToolStarted(params);
}
function markDiagnosticModelStartedForTest(params) {
	recordModelStarted(params, true);
}
function resetDiagnosticRunActivityForTest() {
	stopDiagnosticRunActivityTracking();
	installDiagnosticRunActivityTestApi();
}
function installDiagnosticRunActivityTestApi() {
	globalThis[Symbol.for("openclaw.diagnosticRunActivityTestApi")] = {
		markDiagnosticModelStartedForTest,
		markDiagnosticRunProgressForTest,
		markDiagnosticToolStartedForTest
	};
}
let unregisterDiagnosticRunActivityListener;
function startDiagnosticRunActivityTracking() {
	if (unregisterDiagnosticRunActivityListener) return;
	const startAfterEventSequence = getInternalDiagnosticEventSequence();
	unregisterDiagnosticRunActivityListener = onInternalDiagnosticEvent((event, metadata) => {
		if (event.seq <= startAfterEventSequence) return;
		switch (event.type) {
			case "tool.execution.started":
				recordToolStarted(event);
				return;
			case "tool.execution.completed":
			case "tool.execution.error":
			case "tool.execution.blocked":
				recordToolEnded(event);
				return;
			case "model.call.started":
				recordModelStarted(event, isCoreModelRequestStartedDiagnosticMetadata(metadata));
				return;
			case "model.call.completed":
			case "model.call.error":
				recordModelEnded(event);
				return;
			case "run.progress":
				recordRunProgress(event, isCoreSemanticRunProgressDiagnosticMetadata(metadata));
				return;
			case "run.completed": recordRunCompleted(event);
			default:
		}
	});
}
function stopDiagnosticRunActivityTracking() {
	unregisterDiagnosticRunActivityListener?.();
	unregisterDiagnosticRunActivityListener = void 0;
	activityByRef.clear();
	activityByRunId.clear();
	embeddedRunSequence = 0;
}
if (process.env.VITEST || false) installDiagnosticRunActivityTestApi();
//#endregion
export { getDiagnosticSessionActivitySnapshot as a, markDiagnosticEmbeddedRunStarted as c, resolveRunStaleThresholdMs as d, startDiagnosticRunActivityTracking as f, emitCoreModelRequestStartedDiagnosticEvent as h, getDiagnosticEmbeddedRunActivitySequence as i, markDiagnosticRunProgress as l, emitCoreSemanticRunProgressDiagnosticEvent as m, RUN_STALE_TAKEOVER_MS as n, markDiagnosticArgumentChurnObservation as o, stopDiagnosticRunActivityTracking as p, clearDiagnosticEmbeddedRunActivityForSession as r, markDiagnosticEmbeddedRunEnded as s, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS as t, resetDiagnosticRunActivityForTest as u };
