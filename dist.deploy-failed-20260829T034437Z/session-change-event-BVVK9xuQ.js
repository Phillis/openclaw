import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { o as loadGatewaySessionRow } from "./session-utils-list-Bb0Qg6y4.js";
import { r as resolveSessionEventAgentScope, t as resolvePrivateSessionEventBroadcastScope } from "./session-request-agent-C9E8iDY4.js";
import "./session-utils-BTR52tOf.js";
import { v as invalidateSessionSharingSnapshot } from "./session-sharing-C4OmHGYo.js";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-Cx462cv4.js";
import { n as buildGatewaySessionSnapshot } from "./session-event-payload-Cf_KowSS.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-C7YJ2XPa.js";
//#region src/gateway/server-methods/session-change-event.ts
const SESSIONS_CHANGED_DEBOUNCE_MS = 100;
const SESSIONS_CHANGED_MAX_WAIT_MS = 500;
const sessionsMutationVersions = /* @__PURE__ */ new WeakMap();
const pendingChangesByContext = /* @__PURE__ */ new WeakMap();
const pendingSessionChanges = /* @__PURE__ */ new Set();
function readSessionsMutationVersion(context) {
	return sessionsMutationVersions.get(context) ?? 0;
}
function sessionChangeKey(payload, scope) {
	return `${scope?.[1] ?? payload.agentId ?? ""}\0${payload.sessionKey ?? ""}`;
}
function broadcastSessionsChanged(context, payload, scope) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (!hasSessionChangeReceivers(connIds)) return;
	if (scope === null) return;
	const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = scope;
	const privateBroadcastScope = resolvePrivateSessionEventBroadcastScope(payload.sessionKey, scope);
	const broadcastAgentId = routingAgentId;
	const broadcastOptions = {
		...broadcastAgentId ? { agentId: broadcastAgentId } : {},
		...privateBroadcastScope,
		dropIfSlow: true
	};
	const eventPayload = {
		...payload,
		...eventAgentId ? { agentId: eventAgentId } : {},
		ts: Date.now()
	};
	if (!payload.sessionKey || !routingAgentId || !eventAgentId && !compatibilityOwnerAgentId && !parseAgentSessionKey(payload.sessionKey)) {
		context.broadcastToConnIds("sessions.changed", eventPayload, connIds, broadcastOptions);
		return;
	}
	const sessionRow = loadGatewaySessionRow(payload.sessionKey, { agentId: routingAgentId });
	const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId !== void 0) ? resolveVisibleActiveSessionRunState({
		context,
		requestedKey: payload.sessionKey ?? sessionRow.key,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		agentId: routingAgentId,
		defaultAgentId: compatibilityOwnerAgentId
	}) : null;
	context.broadcastToConnIds("sessions.changed", {
		...eventPayload,
		...sessionRow ? { ...buildGatewaySessionSnapshot({
			sessionRow,
			agentId: eventAgentId,
			activeRunState,
			status: activeRunState?.active ? activeRunState.status ?? "running" : void 0
		}) } : {}
	}, connIds, {
		...broadcastOptions,
		...sessionRow?.key ? { sessionKeys: [sessionRow.key] } : {}
	});
}
function finishPendingSessionChange(pending) {
	if (pending.timer) {
		clearTimeout(pending.timer);
		pending.timer = null;
	}
	pendingSessionChanges.delete(pending);
	const byKey = pendingChangesByContext.get(pending.context);
	if (byKey?.get(pending.key) === pending) byKey.delete(pending.key);
	if (pending.dirty) broadcastSessionsChanged(pending.context, pending.payload, pending.scope);
}
/** Flush trailing notifications and release every debounce timer before gateway shutdown. */
function flushPendingSessionsChangedEvents(context) {
	for (const pending of pendingSessionChanges) if (!context || pending.context === context) finishPendingSessionChange(pending);
}
function emitSessionsChanged(context, payload) {
	sessionsMutationVersions.set(context, readSessionsMutationVersion(context) + 1);
	invalidateSessionSharingSnapshot(payload.sessionKey);
	if (!hasSessionChangeReceivers(context.getSessionEventSubscriberConnIds())) return;
	const scope = payload.sessionKey ? resolveSessionEventAgentScope(context.getRuntimeConfig(), payload.sessionKey, payload.agentId) : [
		payload.agentId,
		payload.agentId,
		void 0
	];
	const key = sessionChangeKey(payload, scope);
	const byKey = pendingChangesByContext.get(context) ?? /* @__PURE__ */ new Map();
	pendingChangesByContext.set(context, byKey);
	const pending = byKey.get(key);
	if (pending) {
		pending.payload = payload;
		pending.scope = scope;
		pending.dirty = true;
		pending.firstDeferredAt ??= Date.now();
		if (pending.timer) clearTimeout(pending.timer);
		const maxWaitRemaining = pending.firstDeferredAt + SESSIONS_CHANGED_MAX_WAIT_MS - Date.now();
		pending.timer = setTimeout(() => finishPendingSessionChange(pending), Math.max(0, Math.min(SESSIONS_CHANGED_DEBOUNCE_MS, maxWaitRemaining)));
		pending.timer.unref?.();
		return;
	}
	const next = {
		context,
		dirty: false,
		key,
		payload,
		scope,
		timer: null
	};
	next.timer = setTimeout(() => finishPendingSessionChange(next), SESSIONS_CHANGED_DEBOUNCE_MS);
	next.timer.unref?.();
	byKey.set(key, next);
	pendingSessionChanges.add(next);
	broadcastSessionsChanged(context, payload, scope);
}
function emitSessionArchived(context, sessionKey, agentId) {
	if (!sessionKey) return;
	emitSessionsChanged(context, {
		sessionKey,
		...agentId ? { agentId } : {},
		reason: "archive"
	});
}
//#endregion
export { readSessionsMutationVersion as i, emitSessionsChanged as n, flushPendingSessionsChangedEvents as r, emitSessionArchived as t };
