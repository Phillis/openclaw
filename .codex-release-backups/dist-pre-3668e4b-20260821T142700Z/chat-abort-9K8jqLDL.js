import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { i as emitAgentEvent, s as getAgentEventLifecycleGeneration } from "./agent-events-Cmj8toCy.js";
import { x as releaseAgentRunDelegatedAuthority } from "./agent-run-registry-cxavoLf6.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { c as createAgentRunRestartAbortError } from "./run-termination-0Y8XLbCX.js";
import { n as isAbortRequestText } from "./abort-primitives-Bgnhsuju.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import { r as readToolValidationErrorSummary } from "./tool-error-summary-Bw_A4yhp.js";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-CmA2Q2CD.js";
import { n as createChatAbortMarker, u as projectLiveAssistantBufferedText } from "./server-chat-state-DD3o03aT.js";
import { n as resolveSessionSubscriptionKeys, t as resolveSessionSubscriptionKey } from "./session-subscription-keys-KDeUeJtW.js";
//#region src/gateway/chat-abort-lifecycle-internal.ts
const terminalPersistenceErrorByEntry = /* @__PURE__ */ new WeakMap();
const removalWaitersByEntry = /* @__PURE__ */ new WeakMap();
function markChatAbortTerminalPersistenceError(entry, error) {
	if (error === void 0) {
		terminalPersistenceErrorByEntry.delete(entry);
		return;
	}
	terminalPersistenceErrorByEntry.set(entry, error);
}
function notifyChatAbortControllerRemoved(entry) {
	const waiters = removalWaitersByEntry.get(entry);
	removalWaitersByEntry.delete(entry);
	for (const resolve of waiters ?? []) resolve();
}
/** Waits for captured run registrations and their terminal persistence owner to leave. */
async function waitForChatAbortControllerRemoval(params) {
	const registeredWaiters = [];
	const removals = params.targets.flatMap(({ runId, entry }) => {
		if (params.entries.get(runId) !== entry) return [];
		return [new Promise((resolve) => {
			const waiters = removalWaitersByEntry.get(entry) ?? /* @__PURE__ */ new Set();
			waiters.add(resolve);
			removalWaitersByEntry.set(entry, waiters);
			registeredWaiters.push({
				entry,
				resolve
			});
		})];
	});
	if (removals.length === 0) return true;
	let timer;
	try {
		return await Promise.race([Promise.all(removals).then(() => true), new Promise((resolve) => {
			timer = setTimeout(() => resolve(false), Math.max(0, params.timeoutMs));
			timer.unref?.();
		})]) && params.targets.every(({ entry }) => !terminalPersistenceErrorByEntry.has(entry));
	} finally {
		if (timer) clearTimeout(timer);
		for (const { entry, resolve } of registeredWaiters) {
			const waiters = removalWaitersByEntry.get(entry);
			waiters?.delete(resolve);
			if (waiters?.size === 0) removalWaitersByEntry.delete(entry);
		}
	}
}
//#endregion
//#region src/gateway/chat-abort.ts
const DEFAULT_CHAT_RUN_ABORT_GRACE_MS = 6e4;
function isChatStopCommandText(text) {
	return isAbortRequestText(text);
}
function createChatAbortSignalReason(stopReason) {
	if (stopReason === "restart") return createAgentRunRestartAbortError();
	if (stopReason !== "timeout") return;
	const reason = /* @__PURE__ */ new Error("chat run timed out");
	reason.name = "TimeoutError";
	return reason;
}
function resolveChatRunExpiresAtMs(params) {
	const { now, timeoutMs, graceMs = DEFAULT_CHAT_RUN_ABORT_GRACE_MS, minMs = 2 * 6e4, maxMs = 1440 * 6e4 } = params;
	const safeNow = asDateTimestampMs(now);
	if (safeNow === void 0) return 0;
	const target = resolveExpiresAtMsFromDurationMs(Math.max(0, timeoutMs) + graceMs, { nowMs: safeNow });
	const min = resolveExpiresAtMsFromDurationMs(minMs, { nowMs: safeNow });
	const max = resolveExpiresAtMsFromDurationMs(maxMs, { nowMs: safeNow });
	if (target === void 0 || min === void 0 || max === void 0) return 0;
	return Math.min(max, Math.max(min, target));
}
function resolveAgentRunExpiresAtMs(params) {
	const graceMs = Math.max(0, params.graceMs ?? DEFAULT_CHAT_RUN_ABORT_GRACE_MS);
	return resolveChatRunExpiresAtMs({
		now: params.now,
		timeoutMs: params.timeoutMs,
		graceMs,
		minMs: graceMs,
		maxMs: Math.max(0, params.timeoutMs) + graceMs
	});
}
function registerChatAbortController(params) {
	const controller = new AbortController();
	const bindAgentRunDelegatedAuthority = (authority) => {
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || !entry.operationalRunInstance || authority.operationalRunInstance !== entry.operationalRunInstance) throw new Error("agent run authority does not belong to this controller registration");
		if (entry.agentRunDelegatedAuthority && entry.agentRunDelegatedAuthority !== authority) throw new Error("agent run controller already owns a different authority");
		entry.agentRunDelegatedAuthority = authority;
	};
	let executionStarted = false;
	const markExecutionStarted = () => {
		if (executionStarted) return;
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller !== controller || controller.signal.aborted || entry.kind !== "agent") return;
		const now = Date.now();
		executionStarted = true;
		if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) return;
		entry.expiresAtMs = resolveAgentRunExpiresAtMs({
			now,
			timeoutMs: params.timeoutMs
		});
	};
	const cleanup = (opts) => {
		const entry = params.chatAbortControllers.get(params.runId);
		if (entry?.controller === controller) {
			if (entry.agentRunDelegatedAuthority) releaseAgentRunDelegatedAuthority(entry.agentRunDelegatedAuthority);
			if (opts?.force === true) {
				removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
				return;
			}
			entry.registrationCleanupRequested = true;
			if (entry.projectSessionTerminalPending === true) return;
			const persistence = entry.projectSessionTerminalPersistence;
			if (persistence) {
				persistence.then(() => {
					if (params.chatAbortControllers.get(params.runId)?.controller === controller) removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
				}).catch(() => {
					if (params.chatAbortControllers.get(params.runId)?.controller === controller) removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
				});
				return;
			}
			removeChatAbortControllerEntry(params.chatAbortControllers, params.runId, entry);
		}
	};
	if (!params.sessionKey || params.chatAbortControllers.has(params.runId)) return {
		controller,
		registered: false,
		markExecutionStarted,
		bindAgentRunDelegatedAuthority,
		cleanup
	};
	const rawNow = params.now ?? Date.now();
	const now = resolveDateTimestampMs(rawNow, 0);
	const explicitExpiresAtMs = params.expiresAtMs === void 0 ? void 0 : asDateTimestampMs(params.expiresAtMs) ?? 0;
	const entry = {
		controller,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		lifecycleGeneration: params.lifecycleGeneration ?? getAgentEventLifecycleGeneration(),
		operationalRunInstance: params.operationalRunInstance,
		agentId: normalizeActiveAgentId(params.agentId),
		startedAtMs: now,
		expiresAtMs: explicitExpiresAtMs ?? resolveChatRunExpiresAtMs({
			now: rawNow,
			timeoutMs: params.timeoutMs
		}),
		ownerConnId: params.ownerConnId,
		ownerDeviceId: params.ownerDeviceId,
		providerId: normalizeProviderIdForActiveRun(params.providerId),
		authProviderId: normalizeProviderIdForActiveRun(params.authProviderId),
		controlUiVisible: params.controlUiVisible,
		isAbortable: params.isAbortable,
		onRemoved: params.onRemoved,
		projectSessionActive: true,
		kind: params.kind,
		turnKind: params.turnKind
	};
	params.chatAbortControllers.set(params.runId, entry);
	return {
		controller,
		registered: true,
		entry,
		markExecutionStarted,
		bindAgentRunDelegatedAuthority,
		cleanup
	};
}
function normalizeProviderIdForActiveRun(providerId) {
	return providerId?.trim().toLowerCase() || void 0;
}
function normalizeActiveAgentId(agentId) {
	return agentId?.trim().toLowerCase() || void 0;
}
/**
* Snapshot the live assistant text of any in-flight run for a session+agent. Used
* by chat.history so a run that kept streaming while the client was switched away
* — whose deltas the gateway delivered to a delivery key this client is no longer
* subscribed to — is restored on switch-back.
*
* Matches a run the same way sessions.list's active-run projection does: an abort
* entry can hold the requested key while chat run state holds the canonical store
* key, so accept a match on EITHER `requestedSessionKey` or `canonicalSessionKey`,
* scoping the shared "global" session by agent. Only runs still projected active
* (`projectSessionActive !== false`, matching sessions.list; the terminal lifecycle
* flips it to false), not aborted, and visible chat-send runs are returned, so a
* finalized run — already in persisted history — is not duplicated and hidden
* agent runs cannot be adopted by chat clients that will not receive their final
* events.
*/
function resolveInFlightRunSnapshot(params) {
	const matchesKey = (entry, key) => {
		if (entry.sessionKey !== key) return false;
		if (key !== "global") return true;
		const requestedAgentId = normalizeActiveAgentId(params.agentId) ?? normalizeActiveAgentId(params.defaultAgentId);
		if (!requestedAgentId) return false;
		return (normalizeActiveAgentId(entry.agentId) ?? normalizeActiveAgentId(params.defaultAgentId)) === requestedAgentId;
	};
	if (!(params.chatAbortControllers instanceof Map)) return;
	let best;
	for (const [runId, entry] of params.chatAbortControllers) {
		if (entry.projectSessionActive === false || entry.controlUiVisible === false || entry.controller.signal.aborted || entry.kind === "agent") continue;
		if (!matchesKey(entry, params.requestedSessionKey) && !matchesKey(entry, params.canonicalSessionKey)) continue;
		const newer = best === void 0 || entry.startedAtMs > best.startedAtMs;
		const tie = best !== void 0 && entry.startedAtMs === best.startedAtMs && runId > best.runId;
		if (newer || tie) best = {
			runId,
			startedAtMs: entry.startedAtMs
		};
	}
	if (best === void 0) return;
	const run = params.chatRunState.runs.get(best.runId);
	const projected = projectLiveAssistantBufferedText(params.chatRunState.resolveBuffer(best.runId).text, { suppressLeadFragments: true });
	const plan = run?.planSnapshot;
	const events = run?.progressSnapshot?.events;
	return {
		runId: best.runId,
		text: projected.suppress ? "" : projected.text,
		startedAt: best.startedAtMs,
		...plan ? { plan } : {},
		...events?.length ? { events } : {}
	};
}
function boundInFlightRunSnapshotForChatHistory(params) {
	if (!params.snapshot) return;
	const messagesBytes = jsonUtf8Bytes(params.messages);
	if (messagesBytes + jsonUtf8Bytes(params.snapshot) <= params.maxBytes) return params.snapshot;
	let bounded = {
		runId: params.snapshot.runId,
		text: "",
		...params.snapshot.events ? { events: [] } : {},
		...params.snapshot.plan ? { plan: { steps: [] } } : {}
	};
	if (params.snapshot.startedAt !== void 0) {
		const candidate = {
			...bounded,
			startedAt: params.snapshot.startedAt
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	if (params.snapshot.events) {
		const events = [...params.snapshot.events];
		while (events.length > 0) {
			const candidate = {
				...bounded,
				events
			};
			if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) {
				bounded = candidate;
				break;
			}
			events.shift();
		}
	}
	if (params.snapshot.plan) {
		const candidate = {
			...bounded,
			plan: params.snapshot.plan
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	if (params.snapshot.text) {
		const candidate = {
			...bounded,
			text: params.snapshot.text
		};
		if (messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes) bounded = candidate;
	}
	return bounded;
}
function resolveChatAbortDeliverySessionKeys(ops, sessionKey, agentId) {
	const scopedAgentId = normalizeActiveAgentId(agentId);
	if (!scopedAgentId) return [sessionKey];
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, scopedAgentId);
	if (canonicalKey === sessionKey) return [canonicalKey];
	return resolveSessionSubscriptionKeys(sessionKey, scopedAgentId, resolveDefaultGlobalAgentId(ops));
}
function broadcastChatAborted(ops, params) {
	const { runId, sessionKey, stopReason, partialText } = params;
	const errorMessage = readToolValidationErrorSummary(params.errorMessage);
	const explicitAgentId = normalizeActiveAgentId(params.agentId);
	const defaultGlobalAgentId = sessionKey === "global" && !explicitAgentId ? normalizeActiveAgentId(resolveDefaultGlobalAgentId(ops)) : void 0;
	const payloadAgentId = sessionKey === "global" ? explicitAgentId ?? defaultGlobalAgentId : explicitAgentId;
	const payload = {
		runId,
		sessionKey,
		...payloadAgentId ? { agentId: payloadAgentId } : {},
		seq: (ops.agentRunSeq.get(runId) ?? 0) + 1,
		state: "aborted",
		stopReason,
		...errorMessage ? { errorMessage } : {},
		message: partialText ? {
			role: "assistant",
			content: [{
				type: "text",
				text: partialText
			}],
			timestamp: Date.now()
		} : void 0
	};
	const deliverySessionKeys = resolveChatAbortDeliverySessionKeys(ops, sessionKey, payloadAgentId);
	ops.broadcast("chat", payload, { sessionKeys: deliverySessionKeys });
	for (const deliverySessionKey of deliverySessionKeys) ops.nodeSendToSession(deliverySessionKey, "chat", payload);
}
function resolveDefaultGlobalAgentId(ops) {
	const cfg = ops.getRuntimeConfig?.();
	if (!cfg) return;
	const resolved = resolveRequestedSessionAgentId(cfg, "global");
	return resolved.ok ? resolved.agentId : void 0;
}
function isChatAbortControllerEntryAbortable(entry) {
	if (entry.controller.signal.aborted) return false;
	try {
		return entry.isAbortable?.(entry) !== false;
	} catch {
		return false;
	}
}
function removeChatAbortControllerEntry(entries, runId, expectedEntry) {
	const entry = entries.get(runId);
	if (!entry || expectedEntry && entry !== expectedEntry) return false;
	entries.delete(runId);
	try {
		entry.onRemoved?.();
	} catch {} finally {
		notifyChatAbortControllerRemoved(entry);
	}
	return true;
}
function abortChatRunById(ops, params) {
	const { runId, sessionKey, stopReason } = params;
	const active = ops.chatAbortControllers.get(runId);
	if (!active) return { aborted: false };
	if (active.sessionKey !== sessionKey) return { aborted: false };
	if (!isChatAbortControllerEntryAbortable(active)) return { aborted: false };
	const bufferedText = ops.chatRunState.resolveBuffer(runId).text;
	const partialText = bufferedText && bufferedText.trim() ? bufferedText : void 0;
	ops.chatRunState.getOrCreate(runId).abortMarker = createChatAbortMarker();
	if (stopReason) active.abortStopReason = stopReason;
	active.projectSessionActive = false;
	active.projectSessionTerminalPending = true;
	active.projectSessionTerminalObservedAt = void 0;
	active.registrationCleanupRequested = true;
	if (active.agentRunDelegatedAuthority) releaseAgentRunDelegatedAuthority(active.agentRunDelegatedAuthority);
	try {
		ops.onRunAborted?.(runId);
	} catch {}
	active.controller.abort(createChatAbortSignalReason(stopReason));
	ops.chatRunState.clearRun(runId);
	const removed = ops.removeChatRun(runId, runId, sessionKey);
	if (active.controlUiVisible !== false) broadcastChatAborted(ops, {
		runId,
		sessionKey,
		agentId: active.agentId,
		stopReason,
		partialText,
		errorMessage: active.toolErrorSummary
	});
	emitAgentEvent({
		runId,
		...active.lifecycleGeneration ? { lifecycleGeneration: active.lifecycleGeneration } : {},
		sessionKey,
		sessionId: active.sessionId,
		agentId: active.agentId,
		stream: "lifecycle",
		data: {
			phase: "end",
			status: "cancelled",
			aborted: true,
			stopReason,
			...active.toolErrorSummary ? { toolErrorSummary: active.toolErrorSummary } : {},
			startedAt: active.startedAtMs,
			endedAt: Date.now()
		}
	});
	if (ops.chatAbortControllers.get(runId) === active && active.projectSessionTerminalObservedAt === void 0 && !active.projectSessionTerminalPersistence) removeChatAbortControllerEntry(ops.chatAbortControllers, runId, active);
	ops.agentRunSeq.delete(runId);
	if (removed?.clientRunId) ops.agentRunSeq.delete(removed.clientRunId);
	return { aborted: true };
}
function updateChatRunProvider(chatAbortControllers, params) {
	const entry = chatAbortControllers.get(params.runId);
	if (!entry) return false;
	entry.providerId = normalizeProviderIdForActiveRun(params.providerId);
	entry.authProviderId = normalizeProviderIdForActiveRun(params.authProviderId);
	return true;
}
function abortChatRunsForProvider(ops, params) {
	const providerId = normalizeProviderIdForActiveRun(params.providerId);
	const agentId = normalizeActiveAgentId(params.agentId);
	if (!providerId) return { runIds: [] };
	const compatibilityOwnerAgentId = agentId && tryResolveLegacyCompatibilityAgentId(params.cfg);
	const matches = [...ops.chatAbortControllers.entries()].filter(([, entry]) => {
		if (normalizeProviderIdForActiveRun(entry.authProviderId) !== providerId && normalizeProviderIdForActiveRun(entry.providerId) !== providerId) return false;
		return !agentId || resolveChatRunOwnerAgentId({
			agentId: entry.agentId,
			sessionKey: entry.sessionKey,
			defaultAgentId: compatibilityOwnerAgentId
		}) === agentId;
	});
	const runIds = [];
	for (const [runId, entry] of matches) if (abortChatRunById(ops, {
		runId,
		sessionKey: entry.sessionKey,
		stopReason: params.stopReason
	}).aborted) runIds.push(runId);
	return { runIds };
}
//#endregion
export { isChatStopCommandText as a, resolveAgentRunExpiresAtMs as c, updateChatRunProvider as d, markChatAbortTerminalPersistenceError as f, isChatAbortControllerEntryAbortable as i, resolveChatRunExpiresAtMs as l, abortChatRunsForProvider as n, registerChatAbortController as o, waitForChatAbortControllerRemoval as p, boundInFlightRunSnapshotForChatHistory as r, removeChatAbortControllerEntry as s, abortChatRunById as t, resolveInFlightRunSnapshot as u };
