import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-DbQz-n_m.js";
import { o as resolveAssistantEventPhase } from "./chat-message-content-BibNiFIq.js";
import { a as stripInlineDirectiveTagsForDisplay } from "./directive-tags-DqL78ij5.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken, t as isSuppressedControlReplyLeadFragment } from "./control-reply-text-DcrqVZr7.js";
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
const CHAT_RUN_PROGRESS_MAX_REVIEWS_PER_TOOL = 16;
function updateChatRunProgressSnapshot(snapshot, event, mode = "full") {
	const data = event.data ?? {};
	const phase = typeof data.phase === "string" ? data.phase : "";
	const toolCallId = typeof data.toolCallId === "string" ? data.toolCallId.trim() : "";
	const review = asNullableRecord(data.review) ?? void 0;
	const reviewId = typeof review?.id === "string" ? review.id.trim() : "";
	const isStartupStatus = event.stream === "run_status" && [
		"preparing_workspace",
		"provisioning_environment",
		"preparing_context",
		"starting_model"
	].includes(phase);
	const preambleItemId = typeof data.itemId === "string" && data.itemId.trim() ? data.itemId.trim() : typeof data.id === "string" && data.id.trim() ? data.id.trim() : "";
	const isTool = event.stream === "tool" && Boolean(toolCallId) && [
		"start",
		"input_delta",
		"update",
		"review",
		"result"
	].includes(phase) && (phase !== "review" || mode === "full" && Boolean(reviewId));
	const isPreamble = event.stream === "item" && data.kind === "preamble";
	const isNotice = event.stream === "notice" && phase === "warning";
	const guardianTargetItemId = typeof data.targetItemId === "string" ? data.targetItemId.trim() : "";
	const isGuardian = event.stream === "codex_app_server.guardian";
	const isStandaloneGuardian = isGuardian && (phase === "warning" || phase === "strict_review_required" || (phase === "started" || phase === "completed") && !guardianTargetItemId);
	const resolvesStrictReview = isGuardian && phase === "completed" && Boolean(guardianTargetItemId) && snapshot?.events.some((candidate) => candidate.stream === event.stream && candidate.data.phase === "strict_review_required" && candidate.data.reviewId === data.reviewId);
	if (mode === "summary" && !isTool && !isPreamble) return snapshot;
	if (!isTool && !isPreamble && !isStartupStatus && !isStandaloneGuardian && !isNotice && !resolvesStrictReview) return snapshot;
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
		next.events = next.events.filter((candidate) => !predicate(candidate));
		next.byteLength = next.events.reduce((total, candidate) => total + jsonUtf8Bytes(candidate), 0);
	};
	if (isStartupStatus) {
		if (next.events.some((candidate) => candidate.stream === "tool" || candidate.stream === "item")) return next;
		removeWhere((candidate) => candidate.stream === "run_status");
	} else if (isTool || isPreamble) removeWhere((candidate) => candidate.stream === "run_status");
	if (isTool) removeWhere((candidate) => {
		if (candidate.stream !== "tool" || candidate.data?.toolCallId !== toolCallId) return false;
		if (phase === "start") return true;
		if (phase === "result") return candidate.data?.phase === "result";
		if (phase !== "review" || candidate.data?.phase !== "review") return candidate.data?.phase === phase;
		return asNullableRecord(candidate.data.review)?.id === reviewId;
	});
	else if (isPreamble) {
		const progressText = typeof data.progressText === "string" ? data.progressText.trim() : "";
		removeWhere(matchesPreamble);
		if (!progressText) return next;
	} else if ((isStandaloneGuardian || resolvesStrictReview) && typeof data.reviewId === "string") {
		removeWhere((candidate) => candidate.stream === event.stream && candidate.data?.reviewId === data.reviewId);
		if (resolvesStrictReview) return next;
	}
	const storedData = isTool ? mode === "summary" ? {
		phase,
		name: typeof data.name === "string" ? data.name : void 0,
		toolCallId
	} : {
		phase,
		name: typeof data.name === "string" ? data.name : void 0,
		toolCallId,
		args: phase === "start" ? data.args : void 0,
		partialResult: phase === "update" ? data.partialResult : void 0,
		diff: phase === "input_delta" ? data.diff : void 0,
		review: phase === "review" ? data.review : void 0,
		approvalReviewOutcome: phase === "review" || phase === "result" ? data.approvalReviewOutcome : void 0,
		isError: phase === "result" ? data.isError : void 0,
		result: phase === "result" ? data.result : void 0
	} : isPreamble ? {
		kind: "preamble",
		itemId: preambleItemId || void 0,
		progressText: data.progressText
	} : { ...data };
	for (const key of Object.keys(storedData)) if (storedData[key] === void 0) delete storedData[key];
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
		delete storedData.diff;
		delete storedData.result;
		storedEvent = {
			...storedEvent,
			data: storedData
		};
		eventBytes = jsonUtf8Bytes(storedEvent);
	}
	if (eventBytes > CHAT_RUN_PROGRESS_MAX_EVENT_BYTES) return next;
	next.events.push(storedEvent);
	next.byteLength += eventBytes;
	if (phase === "review") {
		const reviews = next.events.filter((candidate) => candidate.stream === "tool" && candidate.data?.toolCallId === toolCallId && candidate.data?.phase === "review");
		const overflow = reviews.length - CHAT_RUN_PROGRESS_MAX_REVIEWS_PER_TOOL;
		if (overflow > 0) {
			const evicted = new Set(reviews.slice(0, overflow));
			removeWhere((candidate) => evicted.has(candidate));
		}
	}
	while (next.events.length > CHAT_RUN_PROGRESS_MAX_EVENTS || next.byteLength > CHAT_RUN_PROGRESS_MAX_BYTES) {
		const oldest = next.events[0];
		if (!oldest) break;
		const oldestToolCallId = oldest.stream === "tool" && typeof oldest.data?.toolCallId === "string" ? oldest.data.toolCallId : "";
		removeWhere((candidate) => oldestToolCallId ? candidate.stream === "tool" && candidate.data?.toolCallId === oldestToolCallId : candidate === oldest);
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
/** Return the wall-clock timestamp used by maintenance TTL pruning. */
function chatAbortMarkerTimestampMs(marker) {
	return marker.abortedAtMs;
}
/**
* Return whether an abort marker should suppress events for the given chat run registration.
* The shared monotonic sequence keeps same-millisecond aborts ordered; a missing
* entry preserves suppress-on-presence behavior.
*/
function isChatAbortMarkerCurrent(marker, entry) {
	if (marker === void 0) return false;
	return !entry || marker.sequence >= entry.registeredSequence;
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
	return {
		add,
		peek,
		shift,
		remove
	};
}
/** Create the single record map used by Gateway chat-run runtime state. */
function createChatRunState() {
	const store = createChatRunRecordStore();
	const registry = createChatRunRegistryForStore(store);
	const toolEventRecipients = createToolEventRecipientRegistryForStore(store);
	const recordProgressEvent = (runId, event, mode) => {
		const progressSnapshot = updateChatRunProgressSnapshot(store.runs.get(runId)?.progressSnapshot, event, mode);
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
function createSessionEventSubscriberRegistry(isConnectionActive) {
	const connIds = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	return {
		subscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized || isConnectionActive?.(normalized) === false) return;
			connIds.add(normalized);
		},
		unsubscribe: (connId) => {
			const normalized = connId.trim();
			if (!normalized) return;
			connIds.delete(normalized);
		},
		getAll: () => connIds.size > 0 ? connIds : empty
	};
}
/** Create the per-session message subscriber registry. */
function createSessionMessageSubscriberRegistry(isConnectionActive) {
	const sessionToConnIds = /* @__PURE__ */ new Map();
	const connToSessionRecency = /* @__PURE__ */ new Map();
	const provisionalSubscriptions = /* @__PURE__ */ new Map();
	const approvalSessionToConnIds = /* @__PURE__ */ new Map();
	const connToApprovalSessionKeys = /* @__PURE__ */ new Map();
	const changeListeners = /* @__PURE__ */ new Set();
	const empty = /* @__PURE__ */ new Set();
	let subscriptionSequence = 0;
	const normalize = (value) => value.trim();
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
			if (!normalizedConnId || !normalizedSessionKey || isConnectionActive?.(normalizedConnId) === false) return;
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
			const sessionKeys = connToSessionRecency.get(normalizedConnId);
			if (!sessionKeys) return;
			for (const sessionKey of sessionKeys.keys()) setMessageSubscription(normalizedConnId, sessionKey, false);
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
		getApprovals: (sessionKey) => {
			const normalizedSessionKey = normalize(sessionKey);
			if (!normalizedSessionKey) return empty;
			return approvalSessionToConnIds.get(normalizedSessionKey) ?? empty;
		},
		onChange: (listener) => {
			changeListeners.add(listener);
			return () => changeListeners.delete(listener);
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
//#endregion
export { createSessionMessageSubscriberRegistry as a, projectLiveAssistantBufferedText as c, shouldSuppressAssistantEventForLiveChat as d, createSessionEventSubscriberRegistry as i, resolveAssistantLiveChatInput as l, createChatAbortMarker as n, isChatAbortMarkerCurrent as o, createChatRunState as r, normalizeLiveAssistantBufferedText as s, chatAbortMarkerTimestampMs as t, resolveMergedAssistantText as u };
