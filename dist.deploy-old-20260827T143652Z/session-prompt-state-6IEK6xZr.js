import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
//#region src/agents/embedded-agent-runner/session-prompt-state.ts
/** Process-local prompt projection state owned by an embedded session lifecycle. */
const MAX_SESSION_PROMPT_STATES = 64;
const MAX_ACTIVE_PROJECT_KEYS = 4;
const sessionPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.embeddedSessionPromptStates"), () => /* @__PURE__ */ new Map());
function createSessionPromptState() {
	return {
		activeProjectKeys: [],
		toolResults: {
			replacements: /* @__PURE__ */ new Map(),
			frozen: /* @__PURE__ */ new Set(),
			ambiguousBaseKeys: /* @__PURE__ */ new Set(),
			sourceTextByKey: /* @__PURE__ */ new Map()
		},
		sentUserTurnIds: /* @__PURE__ */ new Set()
	};
}
function cloneToolResultPromptProjectionState(state) {
	return {
		replacements: new Map(state.replacements),
		frozen: new Set(state.frozen),
		ambiguousBaseKeys: new Set(state.ambiguousBaseKeys),
		sourceTextByKey: new Map(state.sourceTextByKey)
	};
}
function getEmbeddedSessionPromptState(sessionId) {
	const existing = sessionPromptStates.get(sessionId);
	if (existing) {
		sessionPromptStates.delete(sessionId);
		sessionPromptStates.set(sessionId, existing);
		return existing;
	}
	const created = createSessionPromptState();
	sessionPromptStates.set(sessionId, created);
	pruneMapToMaxSize(sessionPromptStates, MAX_SESSION_PROMPT_STATES);
	return created;
}
/** Records the prepared repository identity and snapshots this session's LRU active set. */
function prepareEmbeddedSessionActiveProjectKeys(sessionId, projectKey) {
	const state = getEmbeddedSessionPromptState(sessionId);
	if (projectKey) {
		const existing = state.activeProjectKeys.indexOf(projectKey);
		if (existing >= 0) state.activeProjectKeys.splice(existing, 1);
		state.activeProjectKeys.unshift(projectKey);
		state.activeProjectKeys.length = Math.min(state.activeProjectKeys.length, MAX_ACTIVE_PROJECT_KEYS);
	}
	return [...state.activeProjectKeys];
}
function clearEmbeddedSessionPromptStates(sessionIds) {
	for (const sessionId of sessionIds) {
		const normalized = sessionId?.trim();
		if (normalized) sessionPromptStates.delete(normalized);
	}
}
function markSessionUserTurnsSent(state, messages) {
	for (const message of messages) {
		if (message.role !== "user") continue;
		const idempotencyKey = message.idempotencyKey;
		if (typeof idempotencyKey === "string" && idempotencyKey.length > 0) state.sentUserTurnIds.add(idempotencyKey);
	}
}
function hasSessionUserTurnBeenSent(state, message) {
	if (!message || message.role !== "user") return;
	const idempotencyKey = message.idempotencyKey;
	return typeof idempotencyKey === "string" && idempotencyKey.length > 0 ? state.sentUserTurnIds.has(idempotencyKey) : void 0;
}
//#endregion
export { markSessionUserTurnsSent as a, hasSessionUserTurnBeenSent as i, cloneToolResultPromptProjectionState as n, prepareEmbeddedSessionActiveProjectKeys as o, getEmbeddedSessionPromptState as r, clearEmbeddedSessionPromptStates as t };
