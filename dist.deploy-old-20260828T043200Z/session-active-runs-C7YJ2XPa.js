import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { d as hasProjectedAgentRunForSession } from "./agent-run-registry-t4kvUyNQ.js";
import { w as resolveEmbeddedAgentRunProgressState } from "./runs-DpT-JSmi.js";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-Bu4zznGp.js";
//#region src/gateway/server-methods/session-active-runs.ts
function collectTrackedActiveSessionRuns(context, includeTerminalPersistence = false) {
	const runs = [];
	if (!(context.chatAbortControllers instanceof Map)) return runs;
	for (const [runId, active] of context.chatAbortControllers) {
		const terminalPersistence = includeTerminalPersistence && active.projectSessionActive === false && active.projectSessionTerminalPending === true;
		if ((active.projectSessionActive !== false || terminalPersistence) && active.controlUiVisible !== false) {
			const sessionKey = active.sessionKey?.trim();
			const sessionId = active.sessionId?.trim();
			if (!sessionKey && !sessionId) continue;
			runs.push({
				runId,
				...sessionKey ? { sessionKey } : {},
				...sessionId ? { sessionId } : {},
				agentId: typeof active.agentId === "string" ? normalizeAgentId(active.agentId) : void 0,
				executionStarted: active.executionStarted !== false,
				...terminalPersistence ? { terminalPersistence: true } : {}
			});
		}
	}
	return runs;
}
function isTrackedActiveSessionRunForKey(active, key, agentId, defaultAgentId) {
	if (!active.sessionKey || active.sessionKey !== key) return false;
	const requestedAgentId = resolveChatRunOwnerAgentId({
		agentId,
		sessionKey: key,
		defaultAgentId
	});
	if (!requestedAgentId) return false;
	const activeAgentId = resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId
	});
	return activeAgentId ? normalizeAgentId(activeAgentId) === normalizeAgentId(requestedAgentId) : false;
}
function isTrackedActiveSessionRunForSessionId(active, sessionId, agentId, defaultAgentId) {
	if (active.sessionId !== sessionId) return false;
	const requestedAgentId = agentId ?? defaultAgentId;
	if (!requestedAgentId) return false;
	return resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId
	}) === normalizeAgentId(requestedAgentId);
}
function hasRegisteredChatRunForSessionKey(params) {
	const controllers = params.context.chatAbortControllers;
	return controllers instanceof Map && [...controllers.values()].some((active) => isTrackedActiveSessionRunForKey(active, params.sessionKey, params.agentId, params.defaultAgentId));
}
/** Returns true when either requested or canonical session key has a visible active run. */
function hasTrackedActiveSessionRun(params) {
	return collectTrackedActiveSessionRuns(params.context).some((active) => !params.excludeRunIds?.has(active.runId) && (isTrackedActiveSessionRunForKey(active, params.canonicalKey, params.agentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, params.agentId, params.defaultAgentId)));
}
function resolveVisibleActiveSessionRunState(params) {
	const sessionId = params.sessionId?.trim();
	const resolvedAgentId = params.agentId ?? parseAgentSessionKey(params.canonicalKey)?.agentId ?? parseAgentSessionKey(params.requestedKey)?.agentId;
	const matchesRequestedSession = (active) => isTrackedActiveSessionRunForKey(active, params.canonicalKey, resolvedAgentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, resolvedAgentId, params.defaultAgentId) || sessionId !== void 0 && isTrackedActiveSessionRunForSessionId(active, sessionId, resolvedAgentId, params.defaultAgentId);
	const matchingTrackedRuns = (params.trackedActiveRuns ?? collectTrackedActiveSessionRuns(params.context, params.includeTerminalPersistence)).filter(matchesRequestedSession);
	const hasTerminalPersistence = matchingTrackedRuns.some((active) => active.terminalPersistence);
	const runIds = matchingTrackedRuns.filter((active) => !active.terminalPersistence).map((active) => active.runId).toSorted();
	const hasProjectedRun = hasProjectedAgentRunForSession({
		sessionKeys: [params.requestedKey, params.canonicalKey],
		...sessionId ? { sessionId } : {},
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		...params.defaultAgentId ? { defaultAgentId: params.defaultAgentId } : {},
		...params.projectedAgentRunIndex ? { index: params.projectedAgentRunIndex } : {}
	});
	const embeddedRunState = sessionId === void 0 ? void 0 : resolveEmbeddedAgentRunProgressState(sessionId);
	const running = matchingTrackedRuns.some((active) => active.executionStarted) || hasProjectedRun || embeddedRunState === "running";
	const active = running || matchingTrackedRuns.length > 0 || embeddedRunState === "queued";
	return {
		active,
		...!hasProjectedRun && embeddedRunState === void 0 && !hasTerminalPersistence ? { runIds } : {},
		...active && !running ? { status: "queued" } : {}
	};
}
//#endregion
export { resolveVisibleActiveSessionRunState as i, hasRegisteredChatRunForSessionKey as n, hasTrackedActiveSessionRun as r, collectTrackedActiveSessionRuns as t };
