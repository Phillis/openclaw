import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as parseCronRunScopeSuffix } from "./session-key-utils-D8x_bjrd.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { K as updateSessionEntry } from "./session-accessor-CIiPoGwM.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CpRY9lPn.js";
import { t as renderUserFacingText } from "./user-facing-text-DAYCAcGX.js";
import { T as loadGatewaySessionEntry } from "./session-utils-row-xwseApeF.js";
import "./session-utils-DvNvk7rk.js";
import { n as projectMainSessionRecoveryLifecycle, t as isMainSessionRecoveryLifecycleEvent } from "./main-session-recovery-lifecycle-4nXNCd9i.js";
//#region src/agents/agent-lifecycle-parent-state.ts
function isAgentLifecycleYieldedWaiting(event) {
	return event.phase === "end" && event.yielded === true && event.livenessState === "paused" && event.stopReason === "end_turn" && event.aborted !== true && event.status !== "cancelled" && event.status !== "timed_out" && event.timeoutPhase == null && event.error == null;
}
//#endregion
//#region src/gateway/session-lifecycle-state.ts
const SESSION_RUN_ERROR_MAX_CHARS = 160;
function isFiniteTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveLifecyclePhase(event) {
	const phase = typeof event.data?.phase === "string" ? event.data.phase : "";
	return phase === "start" || phase === "end" || phase === "error" ? phase : null;
}
const SESSION_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "done",
	timeout: "timeout",
	cancellation: "killed",
	failure: "failed"
};
function resolveTerminalOutcome(event) {
	return buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: resolveLifecyclePhase(event) === "error" ? "error" : "end",
		data: event.data,
		endedAt: event.data?.endedAt ?? event.ts
	});
}
function resolveSessionRunError(outcome, status) {
	if (status !== "failed" && status !== "timeout" || !outcome.error) return;
	const sanitized = renderUserFacingText(outcome.error, { errorContext: true }).replace(/\s+/g, " ").trim();
	return sanitized ? truncateUtf16Safe(sanitized, SESSION_RUN_ERROR_MAX_CHARS) : void 0;
}
function resolveLifecycleStartedAt(existingStartedAt, event) {
	if (isFiniteTimestamp(event.data?.startedAt)) return event.data.startedAt;
	if (isFiniteTimestamp(existingStartedAt)) return existingStartedAt;
	return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveLifecycleEndedAt(event) {
	if (isFiniteTimestamp(event.data?.endedAt)) return event.data.endedAt;
	return isFiniteTimestamp(event.ts) ? event.ts : void 0;
}
function resolveRuntimeMs(params) {
	const { startedAt, endedAt, existingRuntimeMs } = params;
	if (isFiniteTimestamp(startedAt) && isFiniteTimestamp(endedAt)) return Math.max(0, endedAt - startedAt);
	if (typeof existingRuntimeMs === "number" && Number.isFinite(existingRuntimeMs) && existingRuntimeMs >= 0) return existingRuntimeMs;
}
function deriveGatewaySessionLifecycleSnapshot(params) {
	const phase = resolveLifecyclePhase(params.event);
	if (!phase) return {};
	const existing = params.session ?? void 0;
	if (phase === "start") {
		const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
		return {
			updatedAt: startedAt ?? existing?.updatedAt,
			status: "running",
			lastRunError: void 0,
			startedAt,
			endedAt: void 0,
			runtimeMs: void 0,
			abortedLastRun: false
		};
	}
	const startedAt = resolveLifecycleStartedAt(existing?.startedAt, params.event);
	const endedAt = resolveLifecycleEndedAt(params.event);
	const updatedAt = endedAt ?? existing?.updatedAt;
	const terminal = isAgentLifecycleYieldedWaiting({
		phase,
		yielded: params.event.data?.yielded,
		livenessState: params.event.data?.livenessState,
		stopReason: params.event.data?.stopReason,
		aborted: params.event.data?.aborted,
		status: params.event.data?.status,
		timeoutPhase: params.event.data?.timeoutPhase,
		error: params.event.data?.error
	}) ? void 0 : resolveTerminalOutcome(params.event);
	const status = terminal ? SESSION_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(terminal)] : "running";
	return {
		updatedAt,
		status,
		lastRunError: terminal ? resolveSessionRunError(terminal, status) : void 0,
		startedAt,
		endedAt,
		runtimeMs: resolveRuntimeMs({
			startedAt,
			endedAt,
			existingRuntimeMs: existing?.runtimeMs
		}),
		abortedLastRun: status === "killed"
	};
}
function derivePersistedSessionLifecyclePatch(params) {
	const snapshot = deriveGatewaySessionLifecycleSnapshot({
		session: params.entry ?? void 0,
		event: params.event
	});
	const snapshotPatch = {
		...snapshot,
		updatedAt: typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : void 0
	};
	const projection = projectMainSessionRecoveryLifecycle({
		currentLifecycleGeneration: getAgentEventLifecycleGeneration(),
		entry: params.entry,
		event: params.event,
		snapshotPatch
	});
	if (projection.action === "suppress") return {};
	const phase = resolveLifecyclePhase(params.event);
	const runId = normalizeOptionalString(params.event.runId);
	return {
		...projection.patch,
		...phase === "start" ? { lifecycleRunId: runId } : projection.patch.status && projection.patch.status !== "running" ? { lifecycleRunId: void 0 } : {}
	};
}
function deriveGatewaySessionLifecycleProjectionPatch(params) {
	const { restartRecoveryRuns: _restartRecoveryRuns, lifecycleRunId: _lifecycleRunId, ...patch } = derivePersistedSessionLifecyclePatch(params);
	return patch;
}
function isRestartRecoveryLifecycleEvent(params) {
	return isMainSessionRecoveryLifecycleEvent(params);
}
/**
* Reject pre-reset runs and explicitly older runs sharing one session so late
* lifecycle events cannot overwrite a newer run's authoritative state.
*/
function isStaleLifecycleEventForSession(params) {
	if (params.owningSessionId && params.currentSessionId && params.owningSessionId !== params.currentSessionId) return true;
	const eventRunId = normalizeOptionalString(params.eventRunId);
	const currentRunId = normalizeOptionalString(params.currentRunId);
	if (eventRunId && currentRunId && eventRunId === currentRunId) return false;
	return isFiniteTimestamp(params.eventStartedAt) && isFiniteTimestamp(params.currentStartedAt) && params.eventStartedAt < params.currentStartedAt;
}
function acceptsCronRunContinuationLifecycleEvent(params) {
	const marker = params.entry.cronRunContinuation;
	if (marker?.phase === "running") return true;
	const runId = params.event.runId?.trim();
	return Boolean(marker?.phase === "continuing" && runId && marker.ownerRunId === runId);
}
let lifecyclePersistenceVersion = 0;
function readSessionLifecyclePersistenceVersion() {
	return lifecyclePersistenceVersion;
}
async function persistGatewaySessionLifecycleEvent(params) {
	if (!resolveLifecyclePhase(params.event)) return;
	const sessionEntry = loadGatewaySessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
	if (!sessionEntry.entry) return;
	const owningSessionId = typeof params.event.sessionId === "string" && params.event.sessionId ? params.event.sessionId : void 0;
	const exactCronRun = parseCronRunScopeSuffix(sessionEntry.canonicalKey).runId !== void 0;
	await updateSessionEntry({
		storePath: sessionEntry.storePath,
		sessionKey: sessionEntry.canonicalKey
	}, async (storedEntry) => {
		const entry = storedEntry;
		if (exactCronRun && !acceptsCronRunContinuationLifecycleEvent({
			entry,
			event: params.event
		})) return null;
		if (isStaleLifecycleEventForSession({
			owningSessionId,
			currentSessionId: entry.sessionId,
			eventRunId: params.event.runId,
			currentRunId: entry.lifecycleRunId,
			eventStartedAt: params.event.data?.startedAt,
			currentStartedAt: entry.startedAt
		})) return null;
		const patch = derivePersistedSessionLifecyclePatch({
			entry,
			event: params.event
		});
		return Object.keys(patch).length > 0 ? patch : null;
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		requireWriteSuccess: true
	});
	lifecyclePersistenceVersion += 1;
}
//#endregion
export { readSessionLifecyclePersistenceVersion as a, persistGatewaySessionLifecycleEvent as i, isRestartRecoveryLifecycleEvent as n, isAgentLifecycleYieldedWaiting as o, isStaleLifecycleEventForSession as r, deriveGatewaySessionLifecycleProjectionPatch as t };
