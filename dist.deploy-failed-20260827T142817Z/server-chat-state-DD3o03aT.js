import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-CMI0yx54.js";
import { o as resolveAssistantEventPhase } from "./chat-message-content-BibNiFIq.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-CvzK-y8_.js";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken, t as isSuppressedControlReplyLeadFragment } from "./control-reply-text-BXkKqW89.js";
//#region src/gateway/live-chat-projector.ts
const MAX_LIVE_CHAT_BUFFER_CHARS = 5e5;
/** Normalizes assistant event payloads that contain a snapshot, a delta, or both. */
function resolveAssistantLiveChatInput(data) {
	if (!data || typeof data !== "object") return;
	const record = data;
	if (typeof record.text !== "string" && typeof record.delta !== "string") return;
	return {
		text: typeof record.text === "string" ? record.text : "",
		delta: typeof record.delta === "string" ? record.delta : ""
	};
}
function capLiveAssistantBuffer(text) {
	if (text.length <= MAX_LIVE_CHAT_BUFFER_CHARS) return text;
	return sliceUtf16Safe(text, -5e5);
}
/** Merges assistant full-text and delta events into a capped live buffer. */
function resolveMergedAssistantText(params) {
	const { previousText, nextText, nextDelta } = params;
	if (nextText && previousText) {
		if (nextText.startsWith(previousText) && nextText.length > previousText.length) return capLiveAssistantBuffer(nextText);
		if (previousText.startsWith(nextText) && !nextDelta) return capLiveAssistantBuffer(previousText);
	}
	if (nextDelta) return capLiveAssistantBuffer(previousText + nextDelta);
	if (nextText) return capLiveAssistantBuffer(nextText);
	return capLiveAssistantBuffer(previousText);
}
/** Removes runtime-only context/directive tags from the merged live assistant buffer. */
function normalizeLiveAssistantBufferedText(text) {
	return stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(text).text);
}
/** Projects buffered assistant text into display text or a suppressed/pending state. */
function projectLiveAssistantBufferedText(rawText, options) {
	if (!rawText) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (isSuppressedControlReplyText(rawText)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(rawText)) return {
		text: rawText,
		suppress: true,
		pendingLeadFragment: true
	};
	const withoutTrailingControlToken = stripSuppressedControlReplyToken(rawText);
	if (!withoutTrailingControlToken) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	const text = startsWithSilentToken(withoutTrailingControlToken, "NO_REPLY") ? stripLeadingSilentToken(withoutTrailingControlToken, SILENT_REPLY_TOKEN) : withoutTrailingControlToken;
	if (!text || isSuppressedControlReplyText(text)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(text)) return {
		text,
		suppress: true,
		pendingLeadFragment: true
	};
	return {
		text,
		suppress: false,
		pendingLeadFragment: false
	};
}
/** Returns true when an assistant event phase should not appear in live chat. */
function shouldSuppressAssistantEventForLiveChat(data) {
	return resolveAssistantEventPhase(data) === "commentary";
}
//#endregion
//#region src/gateway/server-chat-progress-snapshot.ts
const CHAT_RUN_PROGRESS_MAX_EVENTS = 50;
const CHAT_RUN_PROGRESS_MAX_BYTES = 128 * 1024;
const CHAT_RUN_PROGRESS_MAX_EVENT_BYTES = 64 * 1024;
function updateChatRunProgressSnapshot(snapshot, event) {
	const data = event.data ?? {};
	const phase = typeof data.phase === "string" ? data.phase : "";
	const toolCallId = typeof data.toolCallId === "string" ? data.toolCallId.trim() : "";
	const preambleItemId = typeof data.itemId === "string" && data.itemId.trim() ? data.itemId.trim() : typeof data.id === "string" && data.id.trim() ? data.id.trim() : "";
	const isTool = event.stream === "tool" && Boolean(toolCallId) && [
		"start",
		"input_delta",
		"update",
		"result"
	].includes(phase);
	const isPreamble = event.stream === "item" && data.kind === "preamble";
	if (!isTool && !isPreamble) return snapshot;
	const next = snapshot ?? {
		events: [],
		byteLength: 0,
		lastSeq: 0
	};
	if (event.seq <= next.lastSeq) return next;
	next.lastSeq = event.seq;
	const matchesPreamble = (candidate) => candidate.stream === "item" && candidate.data?.kind === "preamble" && (candidate.data.itemId ?? "") === preambleItemId;
	const previousPreamble = preambleItemId ? next.events.find(matchesPreamble) : void 0;
	const removeWhere = (predicate) => {
		next.events = next.events.filter((candidate) => {
			if (!predicate(candidate)) return true;
			next.byteLength -= jsonUtf8Bytes(candidate);
			return false;
		});
	};
	if (isTool) {
		removeWhere((candidate) => {
			if (candidate.stream !== "tool" || candidate.data?.toolCallId !== toolCallId) return false;
			return phase === "start" || phase === "result" || candidate.data?.phase === phase;
		});
		if (phase === "result") return next;
	} else {
		const progressText = typeof data.progressText === "string" ? data.progressText.trim() : "";
		removeWhere(matchesPreamble);
		if (!progressText) return next;
	}
	const storedData = isTool ? {
		phase,
		...typeof data.name === "string" ? { name: data.name } : {},
		toolCallId,
		...phase === "start" && Object.hasOwn(data, "args") ? { args: data.args } : {},
		...phase === "update" && Object.hasOwn(data, "partialResult") ? { partialResult: data.partialResult } : {},
		...phase === "input_delta" && Object.hasOwn(data, "diff") ? { diff: data.diff } : {}
	} : {
		kind: "preamble",
		...preambleItemId ? { itemId: preambleItemId } : {},
		progressText: data.progressText
	};
	let storedEvent = {
		runId: event.runId,
		seq: event.seq,
		stream: event.stream,
		ts: previousPreamble?.ts ?? event.ts,
		data: storedData,
		...event.sessionKey ? { sessionKey: event.sessionKey } : {},
		...event.agentId ? { agentId: event.agentId } : {}
	};
	let eventBytes = jsonUtf8Bytes(storedEvent);
	if (eventBytes > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES && isTool) {
		delete storedData.args;
		delete storedData.partialResult;
		storedEvent = {
			...storedEvent,
			data: storedData
		};
		eventBytes = jsonUtf8Bytes(storedEvent);
	}
	if (eventBytes > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES) return next;
	next.events.push(storedEvent);
	next.byteLength += eventBytes;
	while (next.events.length > CHAT_RUN_PROGRESS_MAX_EVENTS || next.byteLength > CHAT_RUN_PROGRESS_MAX_BYTES) {
		const removed = next.events.shift();
		if (!removed) break;
		next.byteLength -= jsonUtf8Bytes(removed);
	}
	return next;
}
//#endregion
//#region src/gateway/server-chat-state.ts
let chatRunOrderingSequence = 0;
function nextChatRunOrderingSequence() {
	chatRunOrderingSequence += 1;
	return chatRunOrderingSequence;
}
/** Stamp a chat run registration with the process-local ordering metadata used for abort freshness checks. */
function createChatRunEntry(entry) {
	return {
		...entry,
		registeredAtMs: Date.now(),
		registeredSequence: nextChatRunOrderingSequence()
	};
}
/** Create an abort marker ordered against chat run registrations, using a shared monotonic sequence. */
function createChatAbortMarker(now = Date.now()) {
	return {
		abortedAtMs: now,
		sequence: nextChatRunOrderingSequence()
	};
}
/** Return the wall-clock timestamp used by maintenance TTL pruning for both legacy and structured markers. */
function chatAbortMarkerTimestampMs(marker) {
	return typeof marker === "number" ? marker : marker.abortedAtMs;
}
/**
* Return whether an abort marker should suppress events for the given chat run registration.
* Structured markers compare the monotonic sequence first so same-millisecond aborts stay ordered;
* legacy numeric markers fall back to timestamp comparison, and a missing entry preserves old suppress-on-presence behavior.
*/
function isChatAbortMarkerCurrent(marker, entry) {
	if (marker === void 0) return false;
	if (!entry) return true;
	if (typeof marker !== "number" && typeof entry.registeredSequence === "number") return marker.sequence >= entry.registeredSequence;
	if (typeof entry.registeredAtMs !== "number") return true;
	return (typeof marker === "number" ? marker : marker.abortedAtMs) >= entry.registeredAtMs;
}
function createChatRunRecordStore() {
	const runs = /* @__PURE__ */ new Map();
	const getOrCreate = (runId) => {
		const existing = runs.get(runId);
		if (existing) return existing;
		const record = {};
		runs.set(runId, record);
		return record;
	};
	const releaseIfEmpty = (runId) => {
		const record = runs.get(runId);
		if (!record || Object.keys(record).length > 0) return;
		runs.delete(runId);
	};
	return {
		runs,
		getOrCreate,
		releaseIfEmpty
	};
}
function internalChatRunRecord(record) {
	return record;
}
function clearPendingLiveTextFlushes(record) {
	const internal = internalChatRunRecord(record);
	for (const pending of Object.values(internal.pendingTextFlushes ?? {})) clearTimeout(pending.timer);
	delete internal.pendingTextFlushes;
}
function createChatRunRegistryForStore(store) {
	const add = (sessionId, entry) => {
		const registeredEntry = createChatRunEntry(entry);
		const record = store.getOrCreate(sessionId);
		const queue = record.registrations;
		if (queue) queue.push(registeredEntry);
		else record.registrations = [registeredEntry];
	};
	const peek = (sessionId) => store.runs.get(sessionId)?.registrations?.[0];
	const shift = (sessionId) => {
		const record = store.runs.get(sessionId);
		if (!record) return;
		const queue = record.registrations;
		if (!queue || queue.length === 0) return;
		const entry = queue.shift();
		if (!queue.length) {
			delete record.registrations;
			store.releaseIfEmpty(sessionId);
		}
		return entry;
	};
	const remove = (sessionId, clientRunId, sessionKey) => {
		const record = store.runs.get(sessionId);
		if (!record) return;
		const queue = record.registrations;
		if (!queue || queue.length === 0) return;
		const idx = queue.findIndex((entry) => entry.clientRunId === clientRunId && (sessionKey ? entry.sessionKey === sessionKey : true));
		if (idx < 0) return;
		const [entry] = queue.splice(idx, 1);
		if (!queue.length) {
			delete record.registrations;
			store.releaseIfEmpty(sessionId);
		}
		return entry;
	};
	const clear = () => {
		for (const [runId, record] of store.runs) {
			delete record.registrations;
			store.releaseIfEmpty(runId);
		}
	};
	return {
		add,
		peek,
		shift,
		remove,
		clear
	};
}
/** Create the FIFO registry that maps session IDs to active chat runs. */
function createChatRunRegistry() {
	return createChatRunRegistryForStore(createChatRunRecordStore());
}
/** Create the single record map used by Gateway chat-run runtime state. */
function createChatRunState() {
	const store = createChatRunRecordStore();
	const registry = createChatRunRegistryForStore(store);
	const toolEventRecipients = createToolEventRecipientRegistryForStore(store);
	const recordProgressEvent = (runId, event) => {
		const progressSnapshot = updateChatRunProgressSnapshot(store.runs.get(runId)?.progressSnapshot, event);
		if (progressSnapshot) store.getOrCreate(runId).progressSnapshot = progressSnapshot;
	};
	const clearRun = (runId) => {
		const record = store.runs.get(runId);
		if (!record) return;
		delete record.rawBuffer;
		delete record.buffer;
		delete record.bufferProjection;
		delete record.planSnapshot;
		delete record.progressSnapshot;
		delete record.bufferUpdatedAt;
		delete record.deltaSentAt;
		delete record.deltaLastBroadcastLen;
		delete record.deltaLastBroadcastText;
		clearPendingLiveTextFlushes(record);
		delete record.agentText;
		store.releaseIfEmpty(runId);
	};
	const clear = () => {
		for (const record of store.runs.values()) clearPendingLiveTextFlushes(record);
		store.runs.clear();
	};
	const resolveBuffer = (runId) => {
		const record = store.runs.get(runId);
		if (!record) return projectLiveAssistantBufferedText("");
		const rawText = record.rawBuffer;
		if (rawText === void 0) return projectLiveAssistantBufferedText(record.buffer ?? "");
		if (record.bufferProjection?.source === rawText && record.buffer !== void 0) return {
			text: record.buffer,
			suppress: record.bufferProjection.suppress
		};
		const projected = projectLiveAssistantBufferedText(normalizeLiveAssistantBufferedText(rawText));
		record.buffer = projected.text;
		record.bufferProjection = {
			source: rawText,
			suppress: projected.suppress
		};
		return projected;
	};
	return {
		runs: store.runs,
		registry,
		toolEventRecipients,
		getOrCreate: store.getOrCreate,
		resolveBuffer,
		hasAbortMarker: (runId) => store.runs.get(runId)?.abortMarker !== void 0,
		deleteAbortMarker: (runId) => {
			const record = store.runs.get(runId);
			if (!record) return;
			delete record.abortMarker;
			store.releaseIfEmpty(runId);
		},
		recordProgressEvent,
		clearRun,
		clear
	};
}
const TOOL_EVENT_RECIPIENT_TTL_MS = 600 * 1e3;
const TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS = 30 * 1e3;
/** Create the broad sessions.changed subscriber registry. */
function createSessionEventSubscriberRegistry() {
	const connIds = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	return {
		subscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.add(normalized);
		},
		unsubscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.delete(normalized);
		},
		getAll: () => connIds.size > 0 ? connIds : empty,
		clear: () => {
			connIds.clear();
		}
	};
}
/** Create the per-session message subscriber registry. */
function createSessionMessageSubscriberRegistry() {
	const sessionToConnIds = /* @__PURE__ */ new Map();
	const connToSessionKeys = /* @__PURE__ */ new Map();
	const connToSessionRecency = /* @__PURE__ */ new Map();
	const provisionalSubscriptions = /* @__PURE__ */ new Map();
	const approvalSessionToConnIds = /* @__PURE__ */ new Map();
	const connToApprovalSessionKeys = /* @__PURE__ */ new Map();
	const changeListeners = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	let subscriptionSequence = 0;
	const normalize = (value) => value.trim();
	const rebuildConnectionSessionKeys = (connId) => {
		const recency = connToSessionRecency.get(connId);
		if (!recency || recency.size === 0) {
			connToSessionKeys.delete(connId);
			return;
		}
		connToSessionKeys.set(connId, new Set([...recency.entries()].toSorted(([, a], [, b]) => a - b).map(([key]) => key)));
	};
	const setMessageSubscription = (connId, sessionKey, subscribed) => {
		const connIds = sessionToConnIds.get(sessionKey);
		const wasSubscribed = connIds?.has(connId) === true;
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			sessionToConnIds.set(sessionKey, nextConnIds);
			if (!wasSubscribed) for (const listener of changeListeners) listener(sessionKey);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) sessionToConnIds.delete(sessionKey);
		if (wasSubscribed) for (const listener of changeListeners) listener(sessionKey);
	};
	const setApprovalSubscription = (connId, sessionKey, subscribed) => {
		const connIds = approvalSessionToConnIds.get(sessionKey);
		const sessionKeys = connToApprovalSessionKeys.get(connId);
		if (subscribed) {
			const nextConnIds = connIds ?? /* @__PURE__ */ new Set();
			nextConnIds.add(connId);
			approvalSessionToConnIds.set(sessionKey, nextConnIds);
			const nextSessionKeys = sessionKeys ?? /* @__PURE__ */ new Set();
			nextSessionKeys.add(sessionKey);
			connToApprovalSessionKeys.set(connId, nextSessionKeys);
			return;
		}
		connIds?.delete(connId);
		if (connIds?.size === 0) approvalSessionToConnIds.delete(sessionKey);
		sessionKeys?.delete(sessionKey);
		if (sessionKeys?.size === 0) connToApprovalSessionKeys.delete(connId);
	};
	return {
		subscribe: (connId, sessionKey, opts) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey) return;
			const hadApprovals = approvalSessionToConnIds.get(normalizedSessionKey)?.has(normalizedConnId) ?? false;
			const recency = connToSessionRecency.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const previousRecency = recency.get(normalizedSessionKey);
			const states = provisionalSubscriptions.get(normalizedConnId) ?? /* @__PURE__ */ new Map();
			const state = states.get(normalizedSessionKey) ?? {
				base: previousRecency,
				baseApprovals: hadApprovals,
				active: true,
				inflight: 0,
				lastSuccess: void 0,
				lastSuccessApprovals: void 0
			};
			state.inflight += 1;
			states.set(normalizedSessionKey, state);
			provisionalSubscriptions.set(normalizedConnId, states);
			subscriptionSequence += 1;
			const provisionalRecency = subscriptionSequence;
			setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
			recency.set(normalizedSessionKey, provisionalRecency);
			connToSessionRecency.set(normalizedConnId, recency);
			rebuildConnectionSessionKeys(normalizedConnId);
			setApprovalSubscription(normalizedConnId, normalizedSessionKey, opts?.includeApprovals === true);
			let settled = false;
			const settle = (succeeded) => {
				if (settled || !state.active) return;
				settled = true;
				if (succeeded) {
					if (provisionalRecency >= (state.lastSuccess ?? -Infinity)) {
						state.lastSuccess = provisionalRecency;
						state.lastSuccessApprovals = opts?.includeApprovals === true;
					}
				}
				state.inflight -= 1;
				if (state.inflight > 0) return;
				const committedRecency = state.lastSuccess ?? state.base;
				if (committedRecency === void 0) {
					recency.delete(normalizedSessionKey);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, false);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, false);
				} else {
					recency.set(normalizedSessionKey, committedRecency);
					setMessageSubscription(normalizedConnId, normalizedSessionKey, true);
					setApprovalSubscription(normalizedConnId, normalizedSessionKey, state.lastSuccessApprovals ?? state.baseApprovals);
				}
				if (recency.size === 0) connToSessionRecency.delete(normalizedConnId);
				rebuildConnectionSessionKeys(normalizedConnId);
				states.delete(normalizedSessionKey);
				if (states.size === 0) provisionalSubscriptions.delete(normalizedConnId);
			};
			const rollback = (() => settle(false));
			rollback.commit = () => settle(true);
			if (!opts?.provisional) {
				rollback.commit();
				return;
			}
			return rollback;
		},
		unsubscribe: (connId, sessionKey) => {
			const normalizedConnId = normalize(connId);
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedConnId || !normalizedSessionKey) return;
			const states = provisionalSubscriptions.get(normalizedConnId);
			const state = states?.get(normalizedSessionKey);
			if (state) {
				state.active = false;
				states?.delete(normalizedSessionKey);
				if (states?.size === 0) provisionalSubscriptions.delete(normalizedConnId);
			}
			setMessageSubscription(normalizedConnId, normalizedSessionKey, false);
			const recency = connToSessionRecency.get(normalizedConnId);
			if (recency) {
				recency.delete(normalizedSessionKey);
				if (recency.size === 0) connToSessionRecency.delete(normalizedConnId);
				rebuildConnectionSessionKeys(normalizedConnId);
			}
			const approvalConnIds = approvalSessionToConnIds.get(normalizedSessionKey);
			if (approvalConnIds) {
				approvalConnIds.delete(normalizedConnId);
				if (approvalConnIds.size === 0) approvalSessionToConnIds.delete(normalizedSessionKey);
			}
			const approvalSessionKeys = connToApprovalSessionKeys.get(normalizedConnId);
			if (approvalSessionKeys) {
				approvalSessionKeys.delete(normalizedSessionKey);
				if (approvalSessionKeys.size === 0) connToApprovalSessionKeys.delete(normalizedConnId);
			}
		},
		unsubscribeAll: (connId) => {
			const normalizedConnId = normalize(connId);
			if (!normalizedConnId) return;
			const states = provisionalSubscriptions.get(normalizedConnId);
			for (const state of states?.values() ?? []) state.active = false;
			provisionalSubscriptions.delete(normalizedConnId);
			const sessionKeys = connToSessionKeys.get(normalizedConnId);
			if (!sessionKeys) return;
			for (const sessionKey of sessionKeys) setMessageSubscription(normalizedConnId, sessionKey, false);
			connToSessionKeys.delete(normalizedConnId);
			connToSessionRecency.delete(normalizedConnId);
			const approvalSessionKeys = connToApprovalSessionKeys.get(normalizedConnId);
			for (const sessionKey of approvalSessionKeys ?? []) {
				const connIds = approvalSessionToConnIds.get(sessionKey);
				connIds?.delete(normalizedConnId);
				if (connIds?.size === 0) approvalSessionToConnIds.delete(sessionKey);
			}
			connToApprovalSessionKeys.delete(normalizedConnId);
		},
		get: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return sessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		getForConnection: (connId) => {
			const normalizedConnId = normalize(connId);
			if (!normalizedConnId) return empty;
			return connToSessionKeys.get(normalizedConnId) ?? empty;
		},
		getApprovals: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return approvalSessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		onChange: (listener) => {
			changeListeners.add(listener);
			return () => changeListeners.delete(listener);
		},
		clear: () => {
			const changedSessionKeys = [...sessionToConnIds.keys()].toSorted();
			sessionToConnIds.clear();
			connToSessionKeys.clear();
			connToSessionRecency.clear();
			for (const states of provisionalSubscriptions.values()) for (const state of states.values()) state.active = false;
			provisionalSubscriptions.clear();
			approvalSessionToConnIds.clear();
			connToApprovalSessionKeys.clear();
			for (const sessionKey of changedSessionKeys) for (const listener of changeListeners) listener(sessionKey);
		}
	};
}
function createToolEventRecipientRegistryForStore(store) {
	const prune = () => {
		if (store.runs.size === 0) return;
		const now = Date.now();
		for (const [runId, record] of store.runs) {
			const entry = record.toolRecipient;
			if (!entry) continue;
			if (now >= (entry.finalizedAt ? entry.finalizedAt + TOOL_EVENT_RECIPIENT_FINAL_GRACE_MS : entry.updatedAt + TOOL_EVENT_RECIPIENT_TTL_MS)) {
				delete record.toolRecipient;
				store.releaseIfEmpty(runId);
			}
		}
	};
	const add = (runId, connId) => {
		if (!runId || !connId) return;
		const now = Date.now();
		const record = store.getOrCreate(runId);
		const existing = record.toolRecipient;
		if (existing) {
			existing.connIds.add(connId);
			existing.updatedAt = now;
		} else record.toolRecipient = {
			connIds: /* @__PURE__ */ new Set([connId]),
			updatedAt: now
		};
		prune();
	};
	const get = (runId) => {
		const entry = store.runs.get(runId)?.toolRecipient;
		if (!entry) return;
		entry.updatedAt = Date.now();
		prune();
		return entry.connIds;
	};
	const markFinal = (runId) => {
		const entry = store.runs.get(runId)?.toolRecipient;
		if (!entry) return;
		entry.finalizedAt = Date.now();
		prune();
	};
	return {
		add,
		get,
		markFinal
	};
}
/** Create the run-id recipient registry used for streaming tool events. */
function createToolEventRecipientRegistry() {
	return createToolEventRecipientRegistryForStore(createChatRunRecordStore());
}
//#endregion
export { createSessionEventSubscriberRegistry as a, isChatAbortMarkerCurrent as c, resolveAssistantLiveChatInput as d, resolveMergedAssistantText as f, createChatRunState as i, normalizeLiveAssistantBufferedText as l, createChatAbortMarker as n, createSessionMessageSubscriberRegistry as o, shouldSuppressAssistantEventForLiveChat as p, createChatRunRegistry as r, createToolEventRecipientRegistry as s, chatAbortMarkerTimestampMs as t, projectLiveAssistantBufferedText as u };
