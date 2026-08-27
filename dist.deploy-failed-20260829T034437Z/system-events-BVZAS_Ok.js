import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { n as channelRouteDedupeKey } from "./channel-route-BK4VTSuz.js";
import { a as mergeDeliveryContext, s as normalizeDeliveryContext } from "./delivery-context.shared-azPdmUls.js";
//#region src/infra/system-event-ownership.ts
const { eventOwners, optionOwners } = resolveGlobalSingleton(Symbol.for("openclaw.systemEvents.ownership"), () => ({
	eventOwners: /* @__PURE__ */ new WeakMap(),
	optionOwners: /* @__PURE__ */ new WeakMap()
}));
function normalizeOwnerAgentId(agentId) {
	return normalizeOptionalString(agentId) ? normalizeAgentId(agentId) : null;
}
function withSystemEventOwner(options, agentId) {
	optionOwners.set(options, normalizeAgentId(agentId));
	return options;
}
function resolveSystemEventOptionsOwnerAgentId(options) {
	return optionOwners.get(options) ?? null;
}
function recordSystemEventOwner(event, agentId) {
	const normalized = normalizeOwnerAgentId(agentId);
	if (normalized) eventOwners.set(event, normalized);
}
function cloneSystemEventOwner(source, clone) {
	const ownerAgentId = eventOwners.get(source);
	if (ownerAgentId) eventOwners.set(clone, ownerAgentId);
}
function resolveSystemEventOwnerAgentId(event) {
	return eventOwners.get(event) ?? null;
}
function selectAgentSystemEvents(events, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return events.filter((event) => {
		const ownerAgentId = resolveSystemEventOwnerAgentId(event);
		return ownerAgentId === null || ownerAgentId === normalizedAgentId;
	});
}
//#endregion
//#region src/infra/system-events.ts
const MAX_EVENTS = 20;
const queues = resolveGlobalMap(Symbol.for("openclaw.systemEvents.queues"), "close-and-restart");
function requireSessionKey(key) {
	const trimmed = normalizeOptionalString(key) ?? "";
	if (!trimmed) throw new Error("system events require a sessionKey");
	return trimmed;
}
function normalizeContextKey(key) {
	return normalizeOptionalLowercaseString(key) ?? null;
}
function getSessionQueue(sessionKey) {
	return queues.get(requireSessionKey(sessionKey));
}
function getOrCreateSessionQueue(sessionKey) {
	const key = requireSessionKey(sessionKey);
	const existing = queues.get(key);
	if (existing) return existing;
	const created = {
		queue: [],
		lastContextKey: null
	};
	queues.set(key, created);
	return created;
}
function cloneSystemEvent(event) {
	const clone = {
		...event,
		...event.deliveryContext ? { deliveryContext: { ...event.deliveryContext } } : {}
	};
	cloneSystemEventOwner(event, clone);
	return clone;
}
function isSystemEventContextChanged(sessionKey, contextKey) {
	const existing = getSessionQueue(sessionKey);
	return normalizeContextKey(contextKey) !== (existing?.lastContextKey ?? null);
}
function findDuplicateInQueue(queue, text, contextKey, deliveryContext, ownerAgentId) {
	const incoming = {
		text,
		contextKey,
		deliveryContext,
		ownerAgentId
	};
	if (contextKey === null) {
		const last = queue[queue.length - 1];
		return last ? isDuplicateSystemEvent(last, incoming) : false;
	}
	return queue.some((event) => isDuplicateSystemEvent(event, incoming));
}
function enqueueSystemEventEntry(text, options) {
	return enqueueOwnedSystemEventEntry(text, options);
}
function enqueueOwnedSystemEventEntry(text, options, receiptOptions) {
	if (options.replace) return replaceSystemEventEntry(text, options);
	const entry = getOrCreateSessionQueue(requireSessionKey(options.sessionKey));
	const cleaned = text.trim();
	if (!cleaned) return null;
	const normalizedContextKey = normalizeContextKey(options.contextKey);
	const normalizedDeliveryContext = normalizeDeliveryContext(options.deliveryContext);
	const normalizedOwnerAgentId = resolveSystemEventOptionsOwnerAgentId(options);
	if (receiptOptions?.allowDuplicate !== true && findDuplicateInQueue(entry.queue, cleaned, normalizedContextKey, normalizedDeliveryContext, normalizedOwnerAgentId)) return null;
	if (normalizedContextKey !== null) entry.lastContextKey = normalizedContextKey;
	const event = {
		id: generateSecureUuid(),
		text: cleaned,
		ts: Date.now(),
		contextKey: normalizedContextKey,
		deliveryContext: normalizedDeliveryContext
	};
	recordSystemEventOwner(event, normalizedOwnerAgentId);
	entry.queue.push(event);
	if (entry.queue.length > MAX_EVENTS) entry.queue.shift();
	return cloneSystemEvent(event);
}
function enqueueSystemEvent(text, options) {
	return enqueueSystemEventEntry(text, options) !== null;
}
/** Enqueues one occurrence and returns one-use removal ownership for its UUID. */
function enqueueSystemEventWithReceipt(text, options, receiptOptions) {
	const event = enqueueOwnedSystemEventEntry(text, options, receiptOptions);
	if (!event) return null;
	const sessionKey = requireSessionKey(options.sessionKey);
	return () => consumeSelectedSystemEventEntries(sessionKey, [event]).length > 0;
}
function drainSystemEventEntries(sessionKey) {
	const key = requireSessionKey(sessionKey);
	const entry = getSessionQueue(key);
	if (!entry || entry.queue.length === 0) return [];
	const out = entry.queue.map(cloneSystemEvent);
	entry.queue.length = 0;
	entry.lastContextKey = null;
	queues.delete(key);
	return out;
}
function areDeliveryContextsEqual(left, right) {
	if (!left && !right) return true;
	if (!left || !right) return false;
	return channelRouteDedupeKey(left) === channelRouteDedupeKey(right);
}
function replaceSystemEventEntry(text, options) {
	const entry = getOrCreateSessionQueue(requireSessionKey(options.sessionKey));
	const cleaned = text.trim();
	if (!cleaned) return null;
	const normalizedContextKey = normalizeContextKey(options.contextKey);
	if (normalizedContextKey === null) throw new Error("replaced system events require a contextKey");
	const normalizedDeliveryContext = normalizeDeliveryContext(options.deliveryContext);
	const normalizedOwnerAgentId = resolveSystemEventOptionsOwnerAgentId(options);
	const matching = entry.queue.filter((event) => (event.contextKey ?? null) === normalizedContextKey && resolveSystemEventOwnerAgentId(event) === normalizedOwnerAgentId && areDeliveryContextsEqual(event.deliveryContext, normalizedDeliveryContext));
	if (matching.length === 1 && matching[0]?.text === cleaned) return null;
	entry.queue = entry.queue.filter((event) => (event.contextKey ?? null) !== normalizedContextKey || resolveSystemEventOwnerAgentId(event) !== normalizedOwnerAgentId || !areDeliveryContextsEqual(event.deliveryContext, normalizedDeliveryContext));
	const event = {
		id: generateSecureUuid(),
		text: cleaned,
		ts: Date.now(),
		contextKey: normalizedContextKey,
		deliveryContext: normalizedDeliveryContext
	};
	recordSystemEventOwner(event, normalizedOwnerAgentId);
	entry.queue.push(event);
	if (entry.queue.length > MAX_EVENTS) entry.queue.shift();
	entry.lastContextKey = normalizedContextKey;
	return cloneSystemEvent(event);
}
function isDuplicateSystemEvent(existing, incoming) {
	return existing.text === incoming.text && (existing.contextKey ?? null) === (incoming.contextKey ?? null) && resolveSystemEventOwnerAgentId(existing) === incoming.ownerAgentId && areDeliveryContextsEqual(existing.deliveryContext, incoming.deliveryContext);
}
function areLegacySystemEventsEqual(left, right) {
	return left.text === right.text && left.ts === right.ts && (left.contextKey ?? null) === (right.contextKey ?? null) && resolveSystemEventOwnerAgentId(left) === resolveSystemEventOwnerAgentId(right) && areDeliveryContextsEqual(left.deliveryContext, right.deliveryContext);
}
function matchesConsumedSystemEvent(queued, consumed) {
	if (consumed.id !== void 0) return queued.id === consumed.id;
	return areLegacySystemEventsEqual(queued, consumed);
}
function resetQueueState(key, entry) {
	if (entry.queue.length === 0) {
		entry.lastContextKey = null;
		queues.delete(key);
		return;
	}
	for (let index = entry.queue.length - 1; index >= 0; index -= 1) {
		const contextKey = expectDefined(entry.queue[index], "queue entry at index").contextKey ?? null;
		if (contextKey !== null) {
			entry.lastContextKey = contextKey;
			return;
		}
	}
	entry.lastContextKey = null;
}
function consumeSystemEventEntries(sessionKey, consumedEntries) {
	const key = requireSessionKey(sessionKey);
	const entry = getSessionQueue(key);
	if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
	if (consumedEntries.length > entry.queue.length || !consumedEntries.every((event, index) => matchesConsumedSystemEvent(expectDefined(entry.queue[index], "queue entry at index"), event))) return consumeSelectedSystemEventEntries(key, consumedEntries);
	const removed = entry.queue.splice(0, consumedEntries.length).map(cloneSystemEvent);
	resetQueueState(key, entry);
	return removed;
}
function consumeSelectedSystemEventEntries(sessionKey, consumedEntries) {
	const key = requireSessionKey(sessionKey);
	const entry = getSessionQueue(key);
	if (!entry || entry.queue.length === 0 || consumedEntries.length === 0) return [];
	const removed = [];
	for (const consumed of consumedEntries) {
		const index = entry.queue.findIndex((event) => matchesConsumedSystemEvent(event, consumed));
		if (index === -1) continue;
		const [event] = entry.queue.splice(index, 1);
		if (event) removed.push(cloneSystemEvent(event));
	}
	resetQueueState(key, entry);
	return removed;
}
function drainSystemEvents(sessionKey) {
	return drainSystemEventEntries(sessionKey).map((event) => event.text);
}
function peekSystemEventEntries(sessionKey) {
	return getSessionQueue(sessionKey)?.queue.map(cloneSystemEvent) ?? [];
}
function peekSystemEvents(sessionKey) {
	return peekSystemEventEntries(sessionKey).map((event) => event.text);
}
function hasSystemEvents(sessionKey) {
	return (getSessionQueue(sessionKey)?.queue.length ?? 0) > 0;
}
function resolveSystemEventDeliveryContext(events) {
	let resolved;
	for (const event of events) resolved = mergeDeliveryContext(event.deliveryContext, resolved);
	return resolved;
}
function resetSystemEventsForTest() {
	queues.clear();
}
//#endregion
export { enqueueSystemEvent as a, hasSystemEvents as c, peekSystemEvents as d, resetSystemEventsForTest as f, withSystemEventOwner as h, drainSystemEvents as i, isSystemEventContextChanged as l, selectAgentSystemEvents as m, consumeSystemEventEntries as n, enqueueSystemEventEntry as o, resolveSystemEventDeliveryContext as p, drainSystemEventEntries as r, enqueueSystemEventWithReceipt as s, consumeSelectedSystemEventEntries as t, peekSystemEventEntries as u };
