import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { logVerbose } from "openclaw/plugin-sdk/runtime-env";
import { createHash } from "node:crypto";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/imessage/src/chat-context.ts
const EMAIL_HANDLE_PATTERN = /^[^\s@]+@[^\s@]+$/u;
function parseDirectChatIdentity(raw) {
	const trimmed = raw.trim();
	const parts = trimmed.split(";");
	if (parts.length === 3 && parts[1] === "-" && parts[2]) {
		const service = parts[0]?.toLowerCase();
		if (service === "imessage" || service === "sms" || service === "any") {
			const identifier = parts[2];
			return {
				service,
				identifier: EMAIL_HANDLE_PATTERN.test(identifier) ? identifier.toLowerCase() : identifier
			};
		}
	}
	if (parts.length !== 1) return;
	if (trimmed.startsWith("+") || EMAIL_HANDLE_PATTERN.test(trimmed)) return { identifier: trimmed.toLowerCase() };
}
function resolveIMessageDirectChatService(configuredService, chatGuid) {
	if (configuredService === "imessage" || configuredService === "sms") return configuredService;
	const observedService = chatGuid ? parseDirectChatIdentity(chatGuid)?.service : void 0;
	return observedService === "imessage" || observedService === "sms" ? observedService : void 0;
}
function isIMessageEmailChatIdentifier(raw) {
	const identity = parseDirectChatIdentity(raw);
	return Boolean(identity && EMAIL_HANDLE_PATTERN.test(identity.identifier));
}
/**
* Strip the `iMessage;-;` / `SMS;-;` / `any;-;` service prefix that Messages
* uses for direct chats. Different layers report direct DMs in different
* forms, so raw comparison would falsely treat one DM as different chats.
*/
function normalizeDirectChatIdentifier(raw) {
	const trimmed = raw.trim();
	return parseDirectChatIdentity(trimmed)?.identifier ?? trimmed;
}
function chatContextFromIMessageTarget(target, effectiveService) {
	if (target.kind === "chat_id") return { chatId: target.chatId };
	if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
	if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
	const trimmedHandle = target.to.trim();
	const canonicalHandle = trimmedHandle.startsWith("+") ? normalizeE164(trimmedHandle) : /^[^\s@]+@[^\s@]+$/u.test(trimmedHandle) ? trimmedHandle.toLowerCase() : void 0;
	if (!canonicalHandle) return {};
	const service = target.service === "auto" ? effectiveService : target.service;
	if (service !== "imessage" && service !== "sms") return {};
	return { chatIdentifier: `${service === "sms" ? "SMS" : "iMessage"};-;${canonicalHandle}` };
}
function compareOptional(left, right) {
	return left === void 0 || right === void 0 ? void 0 : left === right;
}
function compareChatSelector(cachedRaw, currentRaw, crossKind = false) {
	const cached = normalizeOptionalString(cachedRaw);
	const current = normalizeOptionalString(currentRaw);
	if (!cached || !current) return;
	if (cached === current) return true;
	const cachedDirect = parseDirectChatIdentity(cached);
	const currentDirect = parseDirectChatIdentity(current);
	if (!cachedDirect || !currentDirect) return crossKind ? void 0 : false;
	if (cachedDirect.identifier !== currentDirect.identifier) return false;
	if (cachedDirect.service === "any") return true;
	if (!cachedDirect.service || !currentDirect.service) return;
	return cachedDirect.service === currentDirect.service;
}
function resolveIMessageChatMatch(cached, current) {
	const cachedChatGuid = normalizeOptionalString(cached.chatGuid);
	const currentChatGuid = normalizeOptionalString(current.chatGuid);
	const cachedChatIdentifier = normalizeOptionalString(cached.chatIdentifier);
	const currentChatIdentifier = normalizeOptionalString(current.chatIdentifier);
	const comparisons = [
		compareChatSelector(cachedChatGuid, currentChatGuid),
		compareChatSelector(cachedChatIdentifier, currentChatIdentifier),
		compareOptional(cached.chatId, current.chatId),
		compareChatSelector(cachedChatGuid, currentChatIdentifier, true),
		compareChatSelector(cachedChatIdentifier, currentChatGuid, true)
	].filter((comparison) => comparison !== void 0);
	if (comparisons.length === 0) return "unknown";
	return comparisons.every(Boolean) ? "match" : "mismatch";
}
function isPositiveIMessageChatMatch(cached, current) {
	return resolveIMessageChatMatch(cached, current) === "match";
}
//#endregion
//#region extensions/imessage/src/runtime.ts
const { getRuntime: getIMessageRuntime, setRuntime: setIMessageRuntime, tryGetRuntime: getOptionalIMessageRuntime } = createPluginRuntimeStore({
	pluginId: "imessage",
	errorMessage: "iMessage runtime not initialized"
});
//#endregion
//#region extensions/imessage/src/monitor-reply-cache.ts
const IMESSAGE_REPLY_CACHE_NAMESPACE = "imessage.reply-cache";
const IMESSAGE_REPLY_CACHE_MAX_ENTRIES = 2e3;
const IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE = "imessage.reply-cache-counter";
const IMESSAGE_REPLY_CACHE_COUNTER_KEY = "short-id-counter";
const REPLY_CACHE_TTL_MS = 360 * 60 * 1e3;
/** Recency window for the "react to the latest message" fallback. */
const LATEST_FALLBACK_MS = 600 * 1e3;
let persistenceFailureLogged = false;
function reportPersistenceFailure(scope, err) {
	if (persistenceFailureLogged) return;
	persistenceFailureLogged = true;
	logVerbose(`imessage reply-cache: ${scope} disabled after first failure: ${String(err)}`);
}
const imessageReplyCacheByMessageId = /* @__PURE__ */ new Map();
const imessageShortIdToUuid = /* @__PURE__ */ new Map();
const imessageUuidToShortId = /* @__PURE__ */ new Map();
let imessageShortIdCounter = 0;
function resolveIMessageReplyCacheEntryKey(messageId) {
	return createHash("sha256").update(messageId, "utf8").digest("hex").slice(0, 32);
}
function openReplyCacheStore() {
	return getIMessageRuntime().state.openSyncKeyedStore({
		namespace: IMESSAGE_REPLY_CACHE_NAMESPACE,
		maxEntries: IMESSAGE_REPLY_CACHE_MAX_ENTRIES
	});
}
function openReplyCacheCounterStore() {
	return getIMessageRuntime().state.openSyncKeyedStore({
		namespace: IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE,
		maxEntries: 1
	});
}
function remainingTtlMs(timestamp) {
	const remaining = REPLY_CACHE_TTL_MS - Math.max(0, Date.now() - timestamp);
	return remaining > 0 ? remaining : void 0;
}
let hydrated = false;
function hydrateFromStoreOnce() {
	if (hydrated) return;
	hydrated = true;
	const cutoff = Date.now() - REPLY_CACHE_TTL_MS;
	let entries;
	try {
		const counter = openReplyCacheCounterStore().lookup(IMESSAGE_REPLY_CACHE_COUNTER_KEY);
		if (counter && Number.isSafeInteger(counter.counter) && counter.counter > 0) imessageShortIdCounter = Math.max(imessageShortIdCounter, counter.counter);
		entries = openReplyCacheStore().entries().map(({ value }) => value).filter((entry) => entry.timestamp >= cutoff).toSorted((a, b) => a.timestamp - b.timestamp).slice(-2e3);
		for (const entry of entries) {
			const numeric = Number.parseInt(entry.shortId, 10);
			if (Number.isFinite(numeric) && numeric > imessageShortIdCounter) imessageShortIdCounter = numeric;
		}
	} catch (err) {
		reportPersistenceFailure("read", err);
		return;
	}
	if (entries.length === 0) return;
	for (const entry of entries) {
		imessageReplyCacheByMessageId.set(entry.messageId, entry);
		imessageShortIdToUuid.set(entry.shortId, entry.messageId);
		imessageUuidToShortId.set(entry.messageId, entry.shortId);
	}
}
function persistReplyCacheEntry(entry) {
	const ttlMs = remainingTtlMs(entry.timestamp);
	if (!ttlMs) return;
	try {
		openReplyCacheStore().register(resolveIMessageReplyCacheEntryKey(entry.messageId), entry, { ttlMs });
	} catch (err) {
		reportPersistenceFailure("write", err);
	}
}
function deleteReplyCacheEntry(messageId) {
	try {
		openReplyCacheStore().delete(resolveIMessageReplyCacheEntryKey(messageId));
	} catch (err) {
		reportPersistenceFailure("delete", err);
	}
}
function persistReplyCacheCounter() {
	try {
		openReplyCacheCounterStore().register(IMESSAGE_REPLY_CACHE_COUNTER_KEY, { counter: imessageShortIdCounter });
	} catch (err) {
		reportPersistenceFailure("counter", err);
	}
}
function buildReplyCacheEntry(entry, messageId, shortId) {
	return {
		accountId: entry.accountId,
		messageId,
		shortId,
		timestamp: entry.timestamp,
		...typeof entry.chatGuid === "string" ? { chatGuid: entry.chatGuid } : {},
		...typeof entry.chatIdentifier === "string" ? { chatIdentifier: entry.chatIdentifier } : {},
		...typeof entry.chatId === "number" ? { chatId: entry.chatId } : {},
		...typeof entry.isFromMe === "boolean" ? { isFromMe: entry.isFromMe } : {}
	};
}
function generateShortId() {
	imessageShortIdCounter += 1;
	persistReplyCacheCounter();
	return String(imessageShortIdCounter);
}
function rememberIMessageReplyCache(entry) {
	hydrateFromStoreOnce();
	const messageId = entry.messageId.trim();
	if (!messageId) return {
		...entry,
		shortId: ""
	};
	let shortId = imessageUuidToShortId.get(messageId);
	if (!shortId) {
		shortId = generateShortId();
		imessageShortIdToUuid.set(shortId, messageId);
		imessageUuidToShortId.set(messageId, shortId);
	}
	const fullEntry = buildReplyCacheEntry(entry, messageId, shortId);
	imessageReplyCacheByMessageId.delete(messageId);
	imessageReplyCacheByMessageId.set(messageId, fullEntry);
	const cutoff = Date.now() - REPLY_CACHE_TTL_MS;
	let evicted = false;
	const deletedMessageIds = [];
	for (const [key, value] of imessageReplyCacheByMessageId) {
		if (value.timestamp >= cutoff) break;
		imessageReplyCacheByMessageId.delete(key);
		deletedMessageIds.push(key);
		if (value.shortId) {
			imessageShortIdToUuid.delete(value.shortId);
			imessageUuidToShortId.delete(key);
		}
		evicted = true;
	}
	while (imessageReplyCacheByMessageId.size > IMESSAGE_REPLY_CACHE_MAX_ENTRIES) {
		const oldest = imessageReplyCacheByMessageId.keys().next().value;
		if (!oldest) break;
		const oldEntry = imessageReplyCacheByMessageId.get(oldest);
		imessageReplyCacheByMessageId.delete(oldest);
		deletedMessageIds.push(oldest);
		if (oldEntry?.shortId) {
			imessageShortIdToUuid.delete(oldEntry.shortId);
			imessageUuidToShortId.delete(oldest);
		}
		evicted = true;
	}
	if (evicted) for (const messageIdToDelete of deletedMessageIds) deleteReplyCacheEntry(messageIdToDelete);
	persistReplyCacheEntry(fullEntry);
	return fullEntry;
}
function hasChatScope(ctx) {
	if (!ctx) return false;
	return Boolean(normalizeOptionalString(ctx.chatGuid) || normalizeOptionalString(ctx.chatIdentifier) || typeof ctx.chatId === "number");
}
function isCrossChatMismatch(cached, ctx) {
	return resolveIMessageChatMatch(cached, ctx) === "mismatch";
}
function describeChatForError(values) {
	const parts = [];
	if (normalizeOptionalString(values.chatGuid)) parts.push("chatGuid=<redacted>");
	if (normalizeOptionalString(values.chatIdentifier)) parts.push("chatIdentifier=<redacted>");
	if (typeof values.chatId === "number") parts.push("chatId=<redacted>");
	return parts.length === 0 ? "<unknown chat>" : parts.join(", ");
}
function describeMessageIdForError(inputId, inputKind) {
	if (inputKind === "short") return `<short:${inputId.length}-digit>`;
	return `<uuid:${inputId.slice(0, 8)}...>`;
}
function buildCrossChatError(inputId, inputKind, cached, ctx) {
	const remediation = inputKind === "short" ? "Use a message ID from the current chat target; MessageSidFull from another chat is rejected." : "Retry with the correct chat target.";
	return /* @__PURE__ */ new Error(`iMessage message id ${describeMessageIdForError(inputId, inputKind)} belongs to a different chat (${describeChatForError(cached)}) than the current call target (${describeChatForError(ctx)}). ${remediation}`);
}
function resolveIMessageMessageId(shortOrUuid, opts) {
	const trimmed = shortOrUuid.trim();
	if (!trimmed) return trimmed;
	hydrateFromStoreOnce();
	if (/^\d+$/.test(trimmed)) {
		const uuid = imessageShortIdToUuid.get(trimmed);
		if (uuid) {
			const cached = imessageReplyCacheByMessageId.get(uuid);
			if (opts?.chatContext && hasChatScope(opts.chatContext)) {
				if (cached && isCrossChatMismatch(cached, opts.chatContext)) throw buildCrossChatError(trimmed, "short", cached, opts.chatContext);
			}
			if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, "short");
			return uuid;
		}
		if (opts?.requireKnownShortId && !hasChatScope(opts.chatContext)) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} requires a chat scope (chatGuid / chatIdentifier / chatId or a target).`);
		if (opts?.requireKnownShortId) throw new Error(`iMessage short message id ${describeMessageIdForError(trimmed, "short")} is no longer available. Use MessageSidFull.`);
		return trimmed;
	}
	const cached = imessageReplyCacheByMessageId.get(trimmed);
	if (opts?.chatContext) {
		if (cached && isCrossChatMismatch(cached, opts.chatContext)) throw buildCrossChatError(trimmed, "uuid", cached, opts.chatContext);
	}
	if (opts?.requireFromMe && cached?.isFromMe !== true) throw buildFromMeError(trimmed, "uuid");
	return trimmed;
}
function isKnownFromMeIMessageMessageId(messageId, ctx) {
	const trimmed = normalizeOptionalString(messageId);
	if (!trimmed || !ctx.accountId || !hasChatScope(ctx)) return false;
	hydrateFromStoreOnce();
	const cached = imessageReplyCacheByMessageId.get(trimmed);
	if (!cached || cached.isFromMe !== true || cached.accountId !== ctx.accountId) return false;
	return isPositiveIMessageChatMatch(cached, ctx);
}
function buildFromMeError(inputId, inputKind) {
	return /* @__PURE__ */ new Error(`iMessage message id ${describeMessageIdForError(inputId, inputKind)} is not one this agent sent. edit and unsend can only target messages the gateway delivered itself; messages received from other participants cannot be modified.`);
}
/**
* Return the most recent cached entry whose chat scope matches the supplied
* context. Used as a fallback when an agent calls a per-message action (e.g.
* `react`) without specifying a `messageId` — the natural intent is "react
* to the message I just received in this chat."
*
* Strict semantics for safety:
*  - Caller must supply a chat scope. We refuse to "guess" the active chat.
*  - Cached entry must positively match on at least one identifier kind
*    (chatGuid, chatIdentifier, chatId, or normalized direct-DM fingerprint).
*    We do NOT fall through on "no overlapping identifier" — that's how a
*    cached entry from a foreign chat could be returned when the caller's
*    context didn't share any identifier kind with the cache.
*  - Caller must supply an accountId; we never cross account boundaries.
*  - We only consider entries newer than `LATEST_FALLBACK_MS`. The intent
*    of "react to the latest" is "the message I just received," not
*    "anything in this chat from any time."
*/
function findLatestIMessageEntryForChat(ctx) {
	if (!hasChatScope(ctx)) return;
	if (!ctx.accountId) return;
	const cutoff = Date.now() - LATEST_FALLBACK_MS;
	let best;
	for (const entry of imessageReplyCacheByMessageId.values()) {
		if (entry.accountId !== ctx.accountId) continue;
		if (entry.timestamp < cutoff) continue;
		if (!isPositiveIMessageChatMatch(entry, ctx)) continue;
		if (!best || entry.timestamp > best.timestamp) best = entry;
	}
	return best;
}
function resolveIMessageCachedResourceBinding(messageId, ctx) {
	hydrateFromStoreOnce();
	const entry = imessageReplyCacheByMessageId.get(messageId.trim());
	if (!entry) return "unknown";
	if (Date.now() - entry.timestamp > REPLY_CACHE_TTL_MS) return "unknown";
	if (entry.accountId !== ctx.accountId) return "mismatch";
	const chatMatch = resolveIMessageChatMatch(entry, ctx);
	if (chatMatch !== "match") return chatMatch;
	return "match";
}
function isIMessageCurrentMessageInChat(params) {
	if (!params.accountId || !hasChatScope(params.chatContext)) return false;
	const currentMessageId = normalizeOptionalString(String(params.currentMessageId));
	if (!currentMessageId) return false;
	hydrateFromStoreOnce();
	const fullMessageId = /^\d+$/.test(currentMessageId) ? imessageShortIdToUuid.get(currentMessageId) : currentMessageId;
	if (!fullMessageId) return false;
	return resolveIMessageCachedResourceBinding(fullMessageId, {
		...params.chatContext,
		accountId: params.accountId
	}) === "match";
}
//#endregion
export { normalizeDirectChatIdentifier as _, findLatestIMessageEntryForChat as a, rememberIMessageReplyCache as c, resolveIMessageReplyCacheEntryKey as d, getIMessageRuntime as f, isIMessageEmailChatIdentifier as g, chatContextFromIMessageTarget as h, IMESSAGE_REPLY_CACHE_NAMESPACE as i, resolveIMessageCachedResourceBinding as l, setIMessageRuntime as m, IMESSAGE_REPLY_CACHE_COUNTER_NAMESPACE as n, isIMessageCurrentMessageInChat as o, getOptionalIMessageRuntime as p, IMESSAGE_REPLY_CACHE_MAX_ENTRIES as r, isKnownFromMeIMessageMessageId as s, IMESSAGE_REPLY_CACHE_COUNTER_KEY as t, resolveIMessageMessageId as u, resolveIMessageDirectChatService as v };
