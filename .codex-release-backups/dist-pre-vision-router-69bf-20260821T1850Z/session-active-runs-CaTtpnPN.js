import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { p as hasProjectedAgentRunForSession } from "./agent-run-registry-cxavoLf6.js";
import { d as isEmbeddedAgentRunInProgress } from "./runs-CQbSP9aq.js";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-CmA2Q2CD.js";
//#region src/gateway/server-methods/session-active-runs.ts
function collectTrackedActiveSessionRuns(context) {
	const runs = [];
	if (!(context.chatAbortControllers instanceof Map)) return runs;
	for (const [runId, active] of context.chatAbortControllers) if (active.projectSessionActive !== false && active.controlUiVisible !== false) {
		const sessionKey = active.sessionKey?.trim();
		const sessionId = active.sessionId?.trim();
		if (!sessionKey && !sessionId) continue;
		runs.push({
			runId,
			...sessionKey ? { sessionKey } : {},
			...sessionId ? { sessionId } : {},
			agentId: typeof active.agentId === "string" ? normalizeAgentId(active.agentId) : void 0
		});
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
	const runIds = (params.trackedActiveRuns ?? collectTrackedActiveSessionRuns(params.context)).filter((active) => isTrackedActiveSessionRunForKey(active, params.canonicalKey, resolvedAgentId, params.defaultAgentId) || isTrackedActiveSessionRunForKey(active, params.requestedKey, resolvedAgentId, params.defaultAgentId) || sessionId !== void 0 && isTrackedActiveSessionRunForSessionId(active, sessionId, resolvedAgentId, params.defaultAgentId)).map((active) => active.runId).toSorted();
	const hasProjectedRun = hasProjectedAgentRunForSession({
		sessionKeys: [params.requestedKey, params.canonicalKey],
		...sessionId ? { sessionId } : {},
		...resolvedAgentId ? { agentId: resolvedAgentId } : {},
		...params.defaultAgentId ? { defaultAgentId: params.defaultAgentId } : {},
		...params.projectedAgentRunIndex ? { index: params.projectedAgentRunIndex } : {}
	});
	const embeddedRunInProgress = sessionId !== void 0 && isEmbeddedAgentRunInProgress(sessionId);
	return {
		active: runIds.length > 0 || hasProjectedRun || embeddedRunInProgress,
		runIds
	};
}
//#endregion
export { resolveVisibleActiveSessionRunState as i, hasRegisteredChatRunForSessionKey as n, hasTrackedActiveSessionRun as r, collectTrackedActiveSessionRuns as t };
