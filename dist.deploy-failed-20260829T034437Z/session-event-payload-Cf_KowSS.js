import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as parseCronRunScopeSuffix } from "./session-key-utils-Di3FvABa.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { s as getAgentEventLifecycleGeneration } from "./agent-events-CcZImb5w.js";
import { E as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { nt as updateSessionEntry } from "./session-accessor-B-FKZX9M.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { t as renderUserFacingText } from "./user-facing-text-BcBNmELa.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { n as projectMainSessionRecoveryLifecycle, t as isMainSessionRecoveryLifecycleEvent } from "./main-session-recovery-lifecycle-qdZCHqUv.js";
//#region src/agents/agent-lifecycle-parent-state.ts
function isAgentLifecycleYieldedWaiting(event) {
	return event.phase === "end" && event.yielded === true && event.livenessState === "paused" && event.stopReason === "end_turn" && event.aborted !== true && event.status !== "cancelled" && event.status !== "timed_out" && event.timeoutPhase == null && event.error == null;
}
//#endregion
//#region src/gateway/session-lifecycle-state.ts
const restartRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
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
function resolveSettledLifecycleTerminalOutcome(event) {
	const phase = resolveLifecyclePhase(event);
	if (phase !== "end" && phase !== "error") return;
	const outcome = resolveTerminalOutcome(event);
	return isAgentLifecycleYieldedWaiting({
		phase,
		yielded: event.data?.yielded,
		livenessState: event.data?.livenessState,
		stopReason: outcome.stopReason,
		aborted: event.data?.aborted,
		status: event.data?.status,
		timeoutPhase: event.data?.timeoutPhase,
		error: event.data?.error
	}) ? void 0 : outcome;
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
	const terminal = resolveSettledLifecycleTerminalOutcome(params.event);
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
	const clientRunId = normalizeOptionalString(params.event.clientRunId) ?? runId;
	return {
		...projection.patch,
		...phase === "start" ? {
			lifecycleRunId: runId,
			lastRunId: void 0
		} : projection.patch.status && projection.patch.status !== "running" ? {
			lifecycleRunId: void 0,
			lastRunId: clientRunId
		} : {}
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
	const phase = resolveLifecyclePhase(params.event);
	if (!phase) return;
	const sessionEntry = loadGatewaySessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false
	});
	if (!sessionEntry.entry) return;
	const owningSessionId = typeof params.event.sessionId === "string" && params.event.sessionId ? params.event.sessionId : void 0;
	const exactCronRun = parseCronRunScopeSuffix(sessionEntry.canonicalKey).runId !== void 0;
	let terminalRecovery;
	if (await updateSessionEntry({
		storePath: sessionEntry.storePath,
		sessionKey: sessionEntry.canonicalKey
	}, async (storedEntry) => {
		terminalRecovery = void 0;
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
		const recoveryTerminalRunId = normalizeOptionalString(params.event.runId);
		const terminalOutcome = params.event.mainSessionRestartRecovery === true && params.event.lifecycleGeneration === getAgentEventLifecycleGeneration() && recoveryTerminalRunId !== void 0 && (phase === "end" || phase === "error") ? resolveSettledLifecycleTerminalOutcome(params.event) : void 0;
		if (terminalOutcome && recoveryTerminalRunId && Object.keys(patch).length > 0) terminalRecovery = {
			runId: recoveryTerminalRunId,
			outcome: terminalOutcome
		};
		return Object.keys(patch).length > 0 ? patch : null;
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true,
		requireWriteSuccess: true
	}) && terminalRecovery) {
		const message = `main-session restart recovery terminal: session=${sessionEntry.canonicalKey} run=${terminalRecovery.runId} status=${terminalRecovery.outcome.status} reason=${terminalRecovery.outcome.reason}`;
		restartRecoveryLog[terminalRecovery.outcome.status === "ok" ? "info" : "warn"](message);
	}
	lifecyclePersistenceVersion += 1;
}
//#endregion
//#region src/gateway/session-event-payload.ts
/**
* Project a catalog-less session row for websocket merge events.
* Picker metadata comes from catalog-backed list/patch responses; emitting a
* locally reconstructed subset here would replace richer client state.
*/
function buildGatewaySessionEventFields(params) {
	const { sessionRow } = params;
	const omitUnscopedGlobalGoal = sessionRow.key === "global" && !params.agentId;
	return {
		updatedAt: sessionRow.updatedAt ?? void 0,
		sessionId: sessionRow.sessionId,
		createdActor: sessionRow.createdActor ?? null,
		owner: sessionRow.owner ?? null,
		participants: sessionRow.participants ?? [],
		participantCount: sessionRow.participantCount ?? 0,
		kind: sessionRow.kind,
		visibility: sessionRow.visibility,
		channel: sessionRow.channel,
		subject: sessionRow.subject,
		groupChannel: sessionRow.groupChannel,
		space: sessionRow.space,
		chatType: sessionRow.chatType,
		origin: sessionRow.origin,
		archived: sessionRow.archived ?? false,
		archivedAt: sessionRow.archivedAt ?? null,
		archivedBy: sessionRow.archivedBy ?? null,
		pinned: sessionRow.pinned ?? false,
		pinnedAt: sessionRow.pinnedAt ?? null,
		unread: sessionRow.unread ?? false,
		lastReadAt: sessionRow.lastReadAt,
		markedUnreadAt: sessionRow.markedUnreadAt ?? null,
		agentStatus: sessionRow.agentStatus ?? null,
		observerDigest: sessionRow.observerDigest ?? null,
		lastActivityAt: sessionRow.lastActivityAt,
		spawnedBy: sessionRow.spawnedBy,
		controlOwnerSessionKey: sessionRow.controlOwnerSessionKey ?? null,
		swarmGroupId: sessionRow.swarmGroupId,
		spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
		spawnedCwd: sessionRow.spawnedCwd,
		permissionMode: sessionRow.permissionMode ?? null,
		...sessionRow.permissionMode !== void 0 && sessionRow.sessionRoot !== void 0 ? { sessionRoot: sessionRow.sessionRoot } : {},
		forkedFromParent: sessionEntryForkedFromParent(sessionRow) ? true : void 0,
		spawnDepth: sessionRow.spawnDepth,
		subagentRole: sessionRow.subagentRole,
		subagentControlScope: sessionRow.subagentControlScope,
		createdVia: sessionRow.createdVia,
		createdAt: sessionRow.createdAt,
		forkSource: sessionRow.forkSource,
		previousSessionId: sessionRow.previousSessionId,
		label: params.label ?? sessionRow.label ?? null,
		icon: sessionRow.icon ?? null,
		channelAvatarUrl: sessionRow.channelAvatarUrl ?? null,
		category: sessionRow.category ?? null,
		displayName: params.displayName ?? sessionRow.displayName ?? null,
		deliveryContext: sessionRow.deliveryContext,
		parentSessionKey: params.parentSessionKey ?? sessionRow.parentSessionKey,
		childSessions: sessionRow.childSessions,
		thinkingLevel: sessionRow.thinkingLevel ?? null,
		fastMode: sessionRow.fastMode,
		effectiveFastMode: sessionRow.effectiveFastMode,
		effectiveFastModeSource: sessionRow.effectiveFastModeSource,
		fastAutoOnSeconds: sessionRow.fastAutoOnSeconds,
		toolOverrides: sessionRow.toolOverrides ?? null,
		verboseLevel: sessionRow.verboseLevel,
		traceLevel: sessionRow.traceLevel,
		reasoningLevel: sessionRow.reasoningLevel,
		elevatedLevel: sessionRow.elevatedLevel,
		sendPolicy: sessionRow.sendPolicy,
		systemSent: sessionRow.systemSent,
		abortedLastRun: sessionRow.abortedLastRun,
		restartRecoveryStatus: sessionRow.restartRecoveryStatus ?? null,
		inputTokens: sessionRow.inputTokens,
		outputTokens: sessionRow.outputTokens,
		lastChannel: sessionRow.lastChannel,
		lastTo: sessionRow.lastTo,
		lastAccountId: sessionRow.lastAccountId,
		lastThreadId: sessionRow.lastThreadId,
		totalTokens: sessionRow.totalTokens,
		totalTokensFresh: sessionRow.totalTokensFresh,
		...omitUnscopedGlobalGoal ? {} : { goal: sessionRow.goal ?? null },
		contextTokens: sessionRow.contextTokens,
		estimatedCostUsd: sessionRow.estimatedCostUsd,
		responseUsage: sessionRow.responseUsage,
		effectiveResponseUsage: sessionRow.effectiveResponseUsage,
		modelProvider: sessionRow.modelProvider,
		model: sessionRow.model,
		modelOverrideSource: sessionRow.modelOverrideSource,
		agentRuntime: sessionRow.agentRuntime,
		status: params.status ?? sessionRow.status,
		lastRunError: sessionRow.lastRunError ?? null,
		lastRunId: sessionRow.lastRunId ?? null,
		hasAutomation: sessionRow.hasAutomation ?? false,
		...params.hasActiveRun === void 0 ? {} : { hasActiveRun: params.hasActiveRun },
		...params.activeRunIds === void 0 ? {} : { activeRunIds: params.activeRunIds },
		startedAt: sessionRow.startedAt,
		endedAt: sessionRow.endedAt,
		runtimeMs: sessionRow.runtimeMs,
		compactionCheckpointCount: sessionRow.compactionCheckpointCount,
		latestCompactionCheckpoint: sessionRow.latestCompactionCheckpoint,
		pluginExtensions: sessionRow.pluginExtensions
	};
}
function buildGatewaySessionSnapshot(params) {
	const { event, sessionRow: storedRow } = params;
	if (!storedRow) return {};
	const lifecycleRow = {
		...storedRow,
		updatedAt: storedRow.updatedAt ?? void 0
	};
	const patch = event && !isStaleLifecycleEventForSession({
		owningSessionId: event.sessionId,
		currentSessionId: storedRow.sessionId,
		eventRunId: event.runId,
		currentRunId: params.lifecycleRunId,
		eventStartedAt: event.data?.startedAt,
		currentStartedAt: storedRow.startedAt
	}) ? deriveGatewaySessionLifecycleProjectionPatch({
		entry: lifecycleRow,
		event
	}) : {};
	const sessionRow = {
		...storedRow,
		...patch
	};
	for (const key of [
		"thinkingLevels",
		"thinkingOptions",
		"thinkingDefault"
	]) delete sessionRow[key];
	if (params.lifecycle) {
		delete sessionRow.modelProvider;
		delete sessionRow.model;
		delete sessionRow.modelOverrideSource;
		delete sessionRow.agentRuntime;
		if (sessionRow.totalTokensFresh !== true) {
			delete sessionRow.totalTokens;
			delete sessionRow.totalTokensFresh;
			delete sessionRow.contextTokens;
			delete sessionRow.estimatedCostUsd;
		}
	}
	const eventFields = buildGatewaySessionEventFields({
		sessionRow,
		agentId: params.agentId,
		label: params.label,
		displayName: params.displayName,
		parentSessionKey: params.parentSessionKey,
		status: params.status,
		hasActiveRun: params.activeRunState?.active,
		activeRunIds: params.activeRunState ? params.activeRunState.runIds ?? null : void 0
	});
	const session = params.includeSession ? {
		...sessionRow,
		...Object.fromEntries(Object.entries(eventFields).filter(([, value]) => value !== void 0))
	} : void 0;
	if (session && sessionRow.key === "global" && !params.agentId) delete session.goal;
	return {
		...session ? { session } : {},
		...eventFields,
		subagentRunState: sessionRow.subagentRunState,
		hasActiveSubagentRun: sessionRow.hasActiveSubagentRun
	};
}
//#endregion
export { persistGatewaySessionLifecycleEvent as a, isRestartRecoveryLifecycleEvent as i, buildGatewaySessionSnapshot as n, readSessionLifecyclePersistenceVersion as o, deriveGatewaySessionLifecycleSnapshot as r, isAgentLifecycleYieldedWaiting as s, buildGatewaySessionEventFields as t };
