import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-BGbniDph.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { $t as loadSessionEntryReadOnly, qt as listSessionEntriesReadOnly, sn as resolveSessionKeyBySessionId } from "./session-accessor-Bi6bzKQE.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { b as attachOpenClawTranscriptMeta, s as readSessionMessageCountAsync } from "./session-transcript-readers-CJcK7eRo.js";
import { E as loadGatewaySessionEntryReadOnly, v as resolveCurrentUserProfileDisplay } from "./session-utils-row-CJRrMBuq.js";
import { o as loadGatewaySessionRow } from "./session-utils-list-9Nb5BMah.js";
import "./session-utils-BsFMFOqg.js";
import { n as resolveSessionSubscriptionKeys } from "./session-subscription-keys-KDeUeJtW.js";
import { t as projectChatDisplayMessage } from "./chat-display-projection-CHZEyvHW.js";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-DQsqndQY.js";
import { n as buildGatewaySessionEventRow, t as buildGatewaySessionEventFields } from "./session-event-payload-BBQQFMcF.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-DKnYoEyq.js";
import path from "node:path";
//#region src/gateway/server-session-events.ts
function tryResolveCompatibilityDefaultAgentId() {
	return tryResolveLegacyCompatibilityAgentId(getRuntimeConfig());
}
function readMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readMessageSenderIsOwner(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const openclaw = message["__openclaw"];
	if (!openclaw || typeof openclaw !== "object" || Array.isArray(openclaw)) return;
	const value = openclaw.senderIsOwner;
	return typeof value === "boolean" ? value : void 0;
}
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
function buildGatewaySessionSnapshot(params) {
	const { sessionRow } = params;
	if (!sessionRow) return {};
	const session = params.includeSession ? {
		...buildGatewaySessionEventRow(sessionRow),
		createdActor: sessionRow.createdActor ?? null,
		thinkingLevel: sessionRow.thinkingLevel ?? null
	} : void 0;
	if (session && sessionRow.key === "global" && !params.agentId) delete session.goal;
	if (session && params.hasActiveRun !== void 0) session.hasActiveRun = params.hasActiveRun;
	if (session && params.activeRunIds !== void 0) session.activeRunIds = params.activeRunIds;
	return {
		...session ? { session } : {},
		...buildGatewaySessionEventFields({
			sessionRow,
			agentId: params.agentId,
			label: params.label,
			displayName: params.displayName,
			parentSessionKey: params.parentSessionKey,
			hasActiveRun: params.hasActiveRun,
			activeRunIds: params.activeRunIds
		}),
		subagentRunState: sessionRow.subagentRunState,
		hasActiveSubagentRun: sessionRow.hasActiveSubagentRun
	};
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
		const laneKey = normalizeOptionalString(update.target?.sessionKey) ?? normalizeOptionalString(update.sessionKey) ?? normalizeOptionalString(update.sessionFile) ?? "";
		const task = (broadcastQueues.get(laneKey) ?? Promise.resolve()).then(() => handleTranscriptUpdateBroadcast(params, queuedUpdate));
		const settled = task.then(() => void 0, () => void 0);
		broadcastQueues.set(laneKey, settled);
		settled.then(() => {
			if (broadcastQueues.get(laneKey) === settled) broadcastQueues.delete(laneKey);
		});
		return task;
	};
}
async function handleTranscriptUpdateBroadcast(params, update) {
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
	const effectiveAgentId = compatibleLegacyMarker?.agentId ?? targetAgentId ?? update.agentId;
	const compatibilityDefaultAgentId = tryResolveCompatibilityDefaultAgentId();
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(getRuntimeConfig(), sessionKey);
	const stableCompatibilityAgentId = persistedOwner.kind === "configured" ? persistedOwner.agentId : compatibilityDefaultAgentId;
	const stableUnscopedOwner = !parseAgentSessionKey(sessionKey) && !effectiveAgentId ? stableCompatibilityAgentId : void 0;
	const storageAgentId = effectiveAgentId ?? stableUnscopedOwner;
	const visibleAgentId = effectiveAgentId;
	const routingAgentId = effectiveAgentId ?? stableUnscopedOwner;
	const connIds = /* @__PURE__ */ new Set();
	for (const connId of params.sessionEventSubscribers.getAll()) connIds.add(connId);
	let broadcastKeys = [sessionKey];
	if (sessionKey === "global" && routingAgentId) broadcastKeys = resolveSessionSubscriptionKeys(sessionKey, routingAgentId, stableCompatibilityAgentId);
	for (const broadcastKey of broadcastKeys) for (const connId of params.sessionMessageSubscribers.get(broadcastKey)) connIds.add(connId);
	if (connIds.size === 0) {
		if (!hasSessionChangeReceivers(connIds) || update.message !== void 0 && projectChatDisplayMessage(update.message)) return;
	}
	let messageSeq = asPositiveSafeInteger(update.messageSeq);
	if (update.message !== void 0 && messageSeq === void 0) {
		const updateStorePath = targetStorePath ?? compatibleLegacyMarker?.storePath;
		const fallbackTarget = updateStorePath ? {
			entry: loadSessionEntryReadOnly({
				agentId: storageAgentId ?? routingAgentId,
				sessionKey,
				storePath: updateStorePath
			}),
			storePath: updateStorePath
		} : loadGatewaySessionEntryReadOnly(sessionKey, { agentId: routingAgentId });
		const entry = fallbackTarget?.entry;
		const messageSessionId = compatibleLegacyMarker?.sessionId ?? normalizeOptionalString(update.target?.sessionId) ?? entry?.sessionId;
		const storePath = updateStorePath ?? fallbackTarget?.storePath;
		messageSeq = messageSessionId ? asPositiveSafeInteger(await readSessionMessageCountAsync({
			agentId: update.target?.agentId ?? storageAgentId ?? routingAgentId,
			sessionEntry: entry,
			sessionId: messageSessionId,
			sessionKey,
			storePath
		})) : void 0;
	}
	const lifecycleRevision = normalizeOptionalString(update.lifecycleRevision);
	if (lifecycleRevision) {
		const currentLifecycleOwner = readTranscriptUpdateLifecycleOwner(update);
		if (!currentLifecycleOwner || currentLifecycleOwner.lifecycleRevision && currentLifecycleOwner.lifecycleRevision !== lifecycleRevision) return;
	}
	const sessionRow = loadGatewaySessionRow(sessionKey, {
		agentId: routingAgentId,
		transcriptUsageMaxBytes: 64 * 1024
	});
	const activeRunState = sessionRow && (sessionRow.key !== "global" || routingAgentId !== void 0 || compatibilityDefaultAgentId) ? resolveVisibleActiveSessionRunState({
		context: params,
		requestedKey: sessionKey,
		canonicalKey: sessionRow.key,
		sessionId: sessionRow.sessionId,
		...routingAgentId ? { agentId: routingAgentId } : {},
		defaultAgentId: stableUnscopedOwner
	}) : null;
	const sessionSnapshot = buildGatewaySessionSnapshot({
		sessionRow,
		agentId: routingAgentId,
		includeSession: true,
		hasActiveRun: activeRunState?.active,
		activeRunIds: activeRunState?.runIds
	});
	if (update.message === void 0) {
		params.broadcastToConnIds("sessions.changed", {
			sessionKey,
			...visibleAgentId ? { agentId: visibleAgentId } : {},
			phase: "message",
			ts: Date.now(),
			...sessionSnapshot
		}, connIds);
		return;
	}
	const idempotencyKey = readMessageIdempotencyKey(update.message);
	const senderIsOwner = readMessageSenderIsOwner(update.message);
	const message = projectChatDisplayMessage(attachOpenClawTranscriptMeta(update.message, {
		...typeof update.messageId === "string" ? { id: update.messageId } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...messageSeq !== void 0 ? { seq: messageSeq } : {}
	}), { resolveCurrentUserProfileDisplay });
	if (message) {
		params.broadcastToConnIds("session.message", {
			sessionKey,
			...senderIsOwner === void 0 ? {} : { senderIsOwner },
			...visibleAgentId ? { agentId: visibleAgentId } : {},
			message,
			...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
			...messageSeq !== void 0 ? { messageSeq } : {},
			...sessionSnapshot
		}, connIds);
		return;
	}
	const sessionEventConnIds = params.sessionEventSubscribers.getAll();
	if (!hasSessionChangeReceivers(sessionEventConnIds)) return;
	params.broadcastToConnIds("sessions.changed", {
		sessionKey,
		...visibleAgentId ? { agentId: visibleAgentId } : {},
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
		const compatibilityDefaultAgentId = tryResolveCompatibilityDefaultAgentId();
		const eventAgentId = normalizeOptionalString(event.agentId) ?? parseAgentSessionKey(event.sessionKey)?.agentId;
		const persistedOwner = resolvePersistedSessionStoreOwnerForKey(getRuntimeConfig(), event.sessionKey);
		const stableOwnerAgentId = (persistedOwner.kind === "configured" ? persistedOwner.agentId : void 0) ?? compatibilityDefaultAgentId;
		const rowAgentId = eventAgentId ?? stableOwnerAgentId;
		const sessionRow = rowAgentId ? loadGatewaySessionRow(event.sessionKey, { agentId: rowAgentId }) : void 0;
		const activeRunState = sessionRow && (sessionRow.key !== "global" || rowAgentId) ? resolveVisibleActiveSessionRunState({
			context: params,
			requestedKey: event.sessionKey,
			canonicalKey: sessionRow.key,
			sessionId: sessionRow.sessionId,
			...rowAgentId ? { agentId: rowAgentId } : {},
			defaultAgentId: stableOwnerAgentId
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
				label: event.label,
				displayName: event.displayName,
				parentSessionKey: event.parentSessionKey,
				hasActiveRun: activeRunState?.active,
				activeRunIds: activeRunState?.runIds
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
