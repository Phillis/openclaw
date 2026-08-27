import { _n as sessionEntryForkedFromParent } from "./session-accessor-CVnxp3UM.js";
//#region src/gateway/session-event-payload.ts
/**
* Project a catalog-less session row for websocket merge events.
* Picker metadata comes from catalog-backed list/patch responses; emitting a
* locally reconstructed subset here would replace richer client state.
*/
function buildGatewaySessionEventRow(sessionRow, options = {}) {
	const session = { ...sessionRow };
	delete session.thinkingLevels;
	delete session.thinkingOptions;
	delete session.thinkingDefault;
	if (options.lifecycle) {
		delete session.modelProvider;
		delete session.model;
		delete session.agentRuntime;
		if (session.totalTokensFresh !== true) {
			delete session.totalTokens;
			delete session.totalTokensFresh;
			delete session.contextTokens;
			delete session.estimatedCostUsd;
		}
	}
	return session;
}
function buildGatewaySessionEventFields(params) {
	const { sessionRow } = params;
	const omitUnscopedGlobalGoal = sessionRow.key === "global" && !params.agentId;
	return {
		updatedAt: sessionRow.updatedAt ?? void 0,
		sessionId: sessionRow.sessionId,
		createdActor: sessionRow.createdActor ?? null,
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
		agentStatus: sessionRow.agentStatus ?? null,
		observerDigest: sessionRow.observerDigest ?? null,
		lastActivityAt: sessionRow.lastActivityAt,
		spawnedBy: sessionRow.spawnedBy,
		controlOwnerSessionKey: sessionRow.controlOwnerSessionKey ?? null,
		swarmGroupId: sessionRow.swarmGroupId,
		spawnedWorkspaceDir: sessionRow.spawnedWorkspaceDir,
		spawnedCwd: sessionRow.spawnedCwd,
		forkedFromParent: sessionEntryForkedFromParent(sessionRow) ? true : void 0,
		spawnDepth: sessionRow.spawnDepth,
		subagentRole: sessionRow.subagentRole,
		subagentControlScope: sessionRow.subagentControlScope,
		createdVia: sessionRow.createdVia,
		createdAt: sessionRow.createdAt,
		forkSource: sessionRow.forkSource,
		previousSessionId: sessionRow.previousSessionId,
		label: params.label ?? sessionRow.label ?? null,
		category: sessionRow.category ?? null,
		displayName: params.displayName ?? sessionRow.displayName ?? null,
		deliveryContext: sessionRow.deliveryContext,
		parentSessionKey: params.parentSessionKey ?? sessionRow.parentSessionKey,
		childSessions: sessionRow.childSessions,
		thinkingLevel: sessionRow.thinkingLevel ?? null,
		fastMode: sessionRow.fastMode,
		toolOverrides: sessionRow.toolOverrides ?? null,
		verboseLevel: sessionRow.verboseLevel,
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
		agentRuntime: sessionRow.agentRuntime,
		status: sessionRow.status,
		lastRunError: sessionRow.lastRunError ?? null,
		hasAutomation: sessionRow.hasAutomation ?? false,
		...params.hasActiveRun === void 0 ? {} : { hasActiveRun: params.hasActiveRun },
		...params.activeRunIds === void 0 ? {} : { activeRunIds: params.activeRunIds },
		startedAt: sessionRow.startedAt,
		endedAt: sessionRow.endedAt,
		runtimeMs: sessionRow.runtimeMs,
		compactionCheckpointCount: sessionRow.compactionCheckpointCount,
		latestCompactionCheckpoint: sessionRow.latestCompactionCheckpoint
	};
}
//#endregion
export { buildGatewaySessionEventRow as n, buildGatewaySessionEventFields as t };
