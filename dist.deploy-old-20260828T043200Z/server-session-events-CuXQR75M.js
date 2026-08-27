import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { o as listSessionEntriesReadOnly, p as loadSessionEntryReadOnly, x as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import "./session-accessor-B-FKZX9M.js";
import { S as projectChatDisplayMessage, a as readSessionMessageCountAsync, y as projectSessionMessagePayload } from "./session-transcript-readers-CgCxlOAj.js";
import { o as loadGatewaySessionRow } from "./session-utils-list-Bb0Qg6y4.js";
import { a as resolveSessionSubscriptionKey, o as resolveSessionSubscriptionKeys, r as resolveSessionEventAgentScope, t as resolvePrivateSessionEventBroadcastScope } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-Cx462cv4.js";
import { n as buildGatewaySessionSnapshot } from "./session-event-payload-Cf_KowSS.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-C7YJ2XPa.js";
import path from "node:path";
//#region src/gateway/server-session-events.ts
function readTranscriptUpdateLifecycleOwner(update) {
	const marker = parseSqliteSessionFileMarker(update.sessionFile);
	const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? (marker ? resolveSessionKeyBySessionId(marker) : void 0);
	if (!sessionKey) return;
	const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? marker?.agentId;
	const sessionId = normalizeOptionalString(update.target?.sessionId) ?? normalizeOptionalString(update.sessionId) ?? marker?.sessionId;
	const storePath = normalizeOptionalString(update.target?.storePath) ?? marker?.storePath;
	const entry = storePath ? loadSessionEntryReadOnly({
		agentId,
		sessionKey,
		storePath
	}) : loadGatewaySessionEntryReadOnly(sessionKey, agentId ? { agentId } : void 0)?.entry;
	if (!entry || sessionId && entry.sessionId !== sessionId) return;
	const lifecycleRevision = normalizeOptionalString(entry.lifecycleRevision);
	return lifecycleRevision ? { lifecycleRevision } : {};
}
/** Creates a serialized transcript-update broadcaster for session websocket clients. */
function createTranscriptUpdateBroadcastHandler(params) {
	const broadcastQueues = /* @__PURE__ */ new Map();
	return (update) => {
		const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision) ?? (update.message !== void 0 ? readTranscriptUpdateLifecycleOwner(update)?.lifecycleRevision : void 0);
		const queuedUpdate = lifecycleRevision ? {
			...update,
			lifecycleRevision
		} : update;
		const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
		const sessionKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? (legacyMarker ? resolveSessionKeyBySessionId(legacyMarker) : void 0);
		const agentId = normalizeOptionalString(update.target?.agentId) ?? normalizeOptionalString(update.agentId) ?? legacyMarker?.agentId;
		const agentScope = sessionKey ? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, agentId) : void 0;
		if (agentScope === null) return Promise.resolve();
		const laneKey = sessionKey && agentScope?.[1] ? resolveSessionSubscriptionKey(sessionKey, agentScope[1]) : sessionKey ?? normalizeOptionalString(update.sessionFile) ?? "";
		const task = (broadcastQueues.get(laneKey) ?? Promise.resolve()).then(() => handleTranscriptUpdateBroadcast(params, queuedUpdate, agentScope));
		const settled = task.then(() => void 0, () => void 0);
		broadcastQueues.set(laneKey, settled);
		settled.then(() => {
			if (broadcastQueues.get(laneKey) === settled) broadcastQueues.delete(laneKey);
		});
		return task;
	};
}
async function handleTranscriptUpdateBroadcast(params, update, capturedAgentScope) {
	const legacyMarker = parseSqliteSessionFileMarker(update.sessionFile);
	const targetAgentId = normalizeOptionalString(update.target?.agentId);
	const targetSessionId = normalizeOptionalString(update.target?.sessionId);
	const targetSessionKey = normalizeOptionalString(update.target?.sessionKey);
	const suppliedSessionKey = normalizeOptionalString(update.sessionKey);
	const candidateSessionKey = targetSessionKey ?? suppliedSessionKey;
	const targetKeyAgentId = parseAgentSessionKey(candidateSessionKey)?.agentId;
	const targetStorePath = normalizeOptionalString(update.target?.storePath);
	const completeTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const markerSessionKey = legacyMarker && !completeTarget ? resolveSessionKeyBySessionId(legacyMarker) : void 0;
	const markerMatches = legacyMarker && !completeTarget ? listSessionEntriesReadOnly({
		agentId: legacyMarker.agentId,
		storePath: legacyMarker.storePath
	}).filter(({ entry }) => entry.sessionId === legacyMarker.sessionId) : [];
	const candidateKeyEntry = candidateSessionKey && legacyMarker && !completeTarget ? loadSessionEntryReadOnly({
		agentId: legacyMarker.agentId,
		sessionKey: candidateSessionKey,
		storePath: legacyMarker.storePath
	}) : void 0;
	if (targetKeyAgentId && targetAgentId && targetKeyAgentId !== targetAgentId) return;
	if (legacyMarker && !completeTarget && (targetAgentId && targetAgentId !== legacyMarker.agentId || targetSessionId && targetSessionId !== legacyMarker.sessionId && candidateKeyEntry?.sessionId !== legacyMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== legacyMarker.agentId || candidateSessionKey && (candidateKeyEntry && candidateKeyEntry.sessionId !== legacyMarker.sessionId || !candidateKeyEntry && markerMatches.length > 0) || targetStorePath && path.resolve(targetStorePath) !== path.resolve(legacyMarker.storePath))) return;
	const compatibleLegacyMarker = completeTarget ? void 0 : legacyMarker;
	const sessionKey = compatibleLegacyMarker ? candidateKeyEntry?.sessionId === compatibleLegacyMarker.sessionId || !candidateKeyEntry && markerMatches.length === 0 ? candidateSessionKey : markerSessionKey : candidateSessionKey;
	if (!sessionKey) return;
	const agentScope = capturedAgentScope ?? resolveSessionEventAgentScope(getRuntimeConfig(), sessionKey, compatibleLegacyMarker?.agentId ?? targetAgentId ?? update.agentId);
	if (!agentScope) return;
	const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = agentScope;
	const privateBroadcastScope = resolvePrivateSessionEventBroadcastScope(sessionKey, agentScope);
	const connIds = /* @__PURE__ */ new Set();
	for (const connId of params.sessionEventSubscribers.getAll()) connIds.add(connId);
	const broadcastKeys = routingAgentId ? resolveSessionSubscriptionKeys(sessionKey, routingAgentId, compatibilityOwnerAgentId) : [sessionKey];
	for (const broadcastKey of broadcastKeys) for (const connId of params.sessionMessageSubscribers.get(broadcastKey)) connIds.add(connId);
	if (connIds.size === 0) {
		if (!hasSessionChangeReceivers(connIds) || update.message !== void 0 && projectChatDisplayMessage(update.message)) return;
	}
	const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
	if (!eventAgentId && !compatibilityOwnerAgentId && !parseAgentSessionKey(sessionKey)) {
		if (lifecycleRevision) {
			const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update);
			if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
		}
		params.broadcastToConnIds("sessions.changed", {
			sessionKey,
			phase: "message",
			ts: Date.now()
		}, connIds, {
			...privateBroadcastScope,
			dropIfSlow: true
		});
		return;
	}
	let messageSeq = asPositiveSafeInteger(update.messageSeq);
	if (update.message !== void 0 && messageSeq === void 0) {
		const updateStorePath = targetStorePath ?? compatibleLegacyMarker?.storePath;
		const fallbackTarget = updateStorePath ? {
			entry: loadSessionEntryReadOnly({
				agentId: routingAgentId,
				sessionKey,
				storePath: updateStorePath
			}),
			storePath: updateStorePath
		} : loadGatewaySessionEntryReadOnly(sessionKey, { agentId: routingAgentId });
		const entry = fallbackTarget?.entry;
		const messageSessionId = compatibleLegacyMarker?.sessionId ?? normalizeOptionalString(update.target?.sessionId) ?? entry?.sessionId;
		const storePath = updateStorePath ?? fallbackTarget?.storePath;
		messageSeq = messageSessionId ? asPositiveSafeInteger(await readSessionMessageCountAsync({
			agentId: update.target?.agentId ?? routingAgentId,
			sessionEntry: entry,
			sessionId: messageSessionId,
			sessionKey,
			storePath
		})) : void 0;
	}
	if (lifecycleRevision) {
		const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update);
		if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
	}
	const sessionRow = loadGatewaySessionRow(sessionKey, {
		agentId: routingAgentId,
		transcriptUsageMaxBytes: 64 * 1024
	});
	const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId !== void 0 || compatibilityOwnerAgentId) ? resolveVisibleActiveSessionRunState({
		context: params,
		requestedKey: sessionKey,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		...routingAgentId ? { agentId: routingAgentId } : {},
		defaultAgentId: compatibilityOwnerAgentId
	}) : null;
	const sessionSnapshot = buildGatewaySessionSnapshot({
		sessionRow,
		agentId: eventAgentId,
		includeSession: true,
		activeRunState,
		status: activeRunState?.active ? activeRunState.status ?? "running" : void 0
	});
	if (update.message === void 0) {
		params.broadcastToConnIds("sessions.changed", {
			sessionKey,
			...eventAgentId ? { agentId: eventAgentId } : {},
			phase: "message",
			ts: Date.now(),
			...sessionSnapshot
		}, connIds);
		return;
	}
	const projected = projectSessionMessagePayload({
		sessionKey,
		...eventAgentId ? { agentId: eventAgentId } : {},
		message: update.message,
		...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
		...messageSeq !== void 0 ? { messageSeq } : {},
		...update.runId ? { runId: update.runId } : {},
		sessionSnapshot
	});
	if (projected.payload) {
		params.broadcastToConnIds("session.message", projected.payload, connIds);
		return;
	}
	const sessionEventConnIds = params.sessionEventSubscribers.getAll();
	if (!hasSessionChangeReceivers(sessionEventConnIds)) return;
	params.broadcastToConnIds("sessions.changed", {
		sessionKey,
		...eventAgentId ? { agentId: eventAgentId } : {},
		phase: "message",
		ts: Date.now(),
		...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
		...messageSeq !== void 0 ? { messageSeq } : {},
		...sessionSnapshot
	}, sessionEventConnIds, { dropIfSlow: true });
}
/** Creates a lifecycle-event broadcaster for session list refreshes. */
function createLifecycleEventBroadcastHandler(params) {
	return (event) => {
		const swarmEvent = event;
		const connIds = params.sessionEventSubscribers.getAll();
		if (!hasSessionChangeReceivers(connIds)) return;
		const agentScope = resolveSessionEventAgentScope(getRuntimeConfig(), event.sessionKey, normalizeOptionalString(event.agentId), true);
		if (!agentScope) return;
		const [eventAgentId, routingAgentId, compatibilityOwnerAgentId] = agentScope;
		const broadcastOptions = {
			...resolvePrivateSessionEventBroadcastScope(event.sessionKey, agentScope),
			dropIfSlow: true
		};
		if (!routingAgentId || !eventAgentId && !compatibilityOwnerAgentId) {
			params.broadcastToConnIds("sessions.changed", {
				sessionKey: event.sessionKey,
				reason: event.reason,
				ts: Date.now()
			}, connIds, broadcastOptions);
			return;
		}
		const sessionRow = loadGatewaySessionRow(event.sessionKey, { agentId: routingAgentId });
		const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId) ? resolveVisibleActiveSessionRunState({
			context: params,
			requestedKey: event.sessionKey,
			canonicalKey: sessionRow.key,
			sessionId: sessionRow.sessionId,
			...routingAgentId ? { agentId: routingAgentId } : {},
			defaultAgentId: compatibilityOwnerAgentId
		}) : null;
		params.broadcastToConnIds("sessions.changed", {
			sessionKey: event.sessionKey,
			...eventAgentId ? { agentId: eventAgentId } : {},
			reason: event.reason,
			parentSessionKey: event.parentSessionKey,
			label: event.label,
			displayName: event.displayName,
			ts: Date.now(),
			...buildGatewaySessionSnapshot({
				sessionRow,
				agentId: eventAgentId,
				label: event.label,
				displayName: event.displayName,
				parentSessionKey: event.parentSessionKey,
				activeRunState
			}),
			...swarmEvent.swarmGroupId ? {
				swarmGroupId: swarmEvent.swarmGroupId,
				kind: swarmEvent.kind,
				text: swarmEvent.text
			} : {}
		}, connIds, { dropIfSlow: true });
	};
}
//#endregion
export { createLifecycleEventBroadcastHandler, createTranscriptUpdateBroadcastHandler };
