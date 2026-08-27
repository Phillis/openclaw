import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-BeVvXvOY.js";
import { o as loadGatewaySessionRow } from "./session-utils-list-B0UK93uu.js";
import "./session-utils-CCDcSRdK.js";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-DQsqndQY.js";
import { t as buildGatewaySessionEventFields } from "./session-event-payload-BBQQFMcF.js";
import { g as invalidateSessionSharingSnapshot } from "./session-sharing-DOLHhSnW.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-DKnYoEyq.js";
//#region src/gateway/server-methods/session-change-event.ts
const SESSIONS_CHANGED_DEBOUNCE_MS = 100;
const sessionsMutationVersions = /* @__PURE__ */ new WeakMap();
const pendingChangesByContext = /* @__PURE__ */ new WeakMap();
const pendingSessionChanges = /* @__PURE__ */ new Set();
function readSessionsMutationVersion(context) {
	return sessionsMutationVersions.get(context) ?? 0;
}
function sessionChangeKey(payload) {
	return `${payload.agentId ?? ""}\0${payload.sessionKey ?? ""}`;
}
function broadcastSessionsChanged(context, payload) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (!hasSessionChangeReceivers(connIds)) return;
	const cfg = context.getRuntimeConfig();
	const unscopedOwnerAgentId = payload.sessionKey ? tryResolveSessionCompatibilityOwnerAgentId(cfg, payload.sessionKey) : void 0;
	const effectiveAgentId = payload.agentId ?? unscopedOwnerAgentId;
	const sessionRow = payload.sessionKey ? loadGatewaySessionRow(payload.sessionKey, effectiveAgentId ? { agentId: effectiveAgentId } : void 0) : null;
	let rowAgentId;
	if (sessionRow) try {
		rowAgentId = resolveAgentIdFromSessionKey(sessionRow.key, effectiveAgentId);
	} catch {
		rowAgentId = void 0;
	}
	const activeRunState = sessionRow && (sessionRow.key !== "global" || rowAgentId !== void 0 || unscopedOwnerAgentId !== void 0) ? resolveVisibleActiveSessionRunState({
		context,
		requestedKey: payload.sessionKey ?? sessionRow.key,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		agentId: rowAgentId,
		defaultAgentId: unscopedOwnerAgentId
	}) : null;
	context.broadcastToConnIds("sessions.changed", {
		...payload,
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		ts: Date.now(),
		...sessionRow ? {
			...buildGatewaySessionEventFields({
				sessionRow,
				agentId: effectiveAgentId,
				hasActiveRun: activeRunState?.active,
				activeRunIds: activeRunState?.runIds
			}),
			effectiveFastMode: sessionRow.effectiveFastMode,
			effectiveFastModeSource: sessionRow.effectiveFastModeSource,
			fastAutoOnSeconds: sessionRow.fastAutoOnSeconds,
			traceLevel: sessionRow.traceLevel,
			pluginExtensions: sessionRow.pluginExtensions
		} : {}
	}, connIds, {
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		dropIfSlow: true,
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
	if (pending.dirty) broadcastSessionsChanged(pending.context, pending.payload);
}
/** Flush trailing notifications and release every debounce timer before gateway shutdown. */
function flushPendingSessionsChangedEvents(context) {
	for (const pending of pendingSessionChanges) if (!context || pending.context === context) finishPendingSessionChange(pending);
}
function emitSessionsChanged(context, payload) {
	sessionsMutationVersions.set(context, readSessionsMutationVersion(context) + 1);
	invalidateSessionSharingSnapshot(payload.sessionKey);
	if (!hasSessionChangeReceivers(context.getSessionEventSubscriberConnIds())) return;
	const key = sessionChangeKey(payload);
	const byKey = pendingChangesByContext.get(context) ?? /* @__PURE__ */ new Map();
	pendingChangesByContext.set(context, byKey);
	const pending = byKey.get(key);
	if (pending) {
		pending.payload = payload;
		pending.dirty = true;
		if (pending.timer) clearTimeout(pending.timer);
		pending.timer = setTimeout(() => finishPendingSessionChange(pending), SESSIONS_CHANGED_DEBOUNCE_MS);
		pending.timer.unref?.();
		return;
	}
	const next = {
		context,
		dirty: false,
		key,
		payload,
		timer: null
	};
	next.timer = setTimeout(() => finishPendingSessionChange(next), SESSIONS_CHANGED_DEBOUNCE_MS);
	next.timer.unref?.();
	byKey.set(key, next);
	pendingSessionChanges.add(next);
	broadcastSessionsChanged(context, payload);
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
