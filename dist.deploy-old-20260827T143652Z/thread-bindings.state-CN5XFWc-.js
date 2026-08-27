import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import { n as recordOutboundMessageIdentity } from "./outbound-echo-DmYajtce.js";
import "./outbound-echo-runtime-C1aNe6Wg.js";
import { t as getDiscordRuntime } from "./runtime-Dg4d9hPu.js";
//#region extensions/discord/src/monitor/thread-bindings.state.ts
const THREAD_BINDINGS_STATE_KEY = Symbol.for("openclaw.discordThreadBindingsState");
let threadBindingsState;
function createThreadBindingsGlobalState() {
	return {
		managersByAccountId: /* @__PURE__ */ new Map(),
		bindingsByThreadId: /* @__PURE__ */ new Map(),
		bindingsBySessionKey: /* @__PURE__ */ new Map(),
		tokensByAccountId: /* @__PURE__ */ new Map(),
		reusableWebhooksByAccountChannel: /* @__PURE__ */ new Map(),
		persistByAccountId: /* @__PURE__ */ new Map(),
		loadedBindings: false,
		loadedPersistentBindings: false,
		persistenceAvailable: true,
		lastPersistedAtMs: 0
	};
}
function resolveThreadBindingsGlobalState() {
	if (!threadBindingsState) {
		const globalStore = globalThis;
		threadBindingsState = globalStore[THREAD_BINDINGS_STATE_KEY] ?? createThreadBindingsGlobalState();
		globalStore[THREAD_BINDINGS_STATE_KEY] = threadBindingsState;
	}
	return threadBindingsState;
}
const THREAD_BINDINGS_STATE = resolveThreadBindingsGlobalState();
const MANAGERS_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.managersByAccountId;
const BINDINGS_BY_THREAD_ID = THREAD_BINDINGS_STATE.bindingsByThreadId;
const BINDINGS_BY_SESSION_KEY = THREAD_BINDINGS_STATE.bindingsBySessionKey;
const TOKENS_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.tokensByAccountId;
const REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL = THREAD_BINDINGS_STATE.reusableWebhooksByAccountChannel;
const PERSIST_BY_ACCOUNT_ID = THREAD_BINDINGS_STATE.persistByAccountId;
const THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS = 15e3;
const THREAD_BINDINGS_NAMESPACE = "thread-bindings";
const THREAD_BINDINGS_MAX_ENTRIES = 1e4;
function rememberThreadBindingToken(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const token = params.token?.trim();
	if (!token) return;
	TOKENS_BY_ACCOUNT_ID.set(normalizedAccountId, token);
}
function forgetThreadBindingToken(accountId) {
	TOKENS_BY_ACCOUNT_ID.delete(normalizeAccountId(accountId));
}
function getThreadBindingToken(accountId) {
	return TOKENS_BY_ACCOUNT_ID.get(normalizeAccountId(accountId));
}
function shouldDefaultPersist() {
	return !(process.env.VITEST || false);
}
function openThreadBindingsStore() {
	return getDiscordRuntime().state.openSyncKeyedStore({
		namespace: THREAD_BINDINGS_NAMESPACE,
		maxEntries: THREAD_BINDINGS_MAX_ENTRIES
	});
}
function normalizeTargetKind(raw, targetSessionKey) {
	if (raw === "subagent" || raw === "acp") return raw;
	return targetSessionKey.includes(":subagent:") ? "subagent" : "acp";
}
function normalizeThreadId(raw) {
	return normalizeOptionalStringifiedId(raw);
}
function toBindingRecordKey(params) {
	return `${normalizeAccountId(params.accountId)}:${params.threadId.trim()}`;
}
function resolveBindingRecordKey(params) {
	const threadId = normalizeThreadId(params.threadId);
	if (!threadId) return;
	return toBindingRecordKey({
		accountId: normalizeAccountId(params.accountId),
		threadId
	});
}
function normalizePersistedBinding(threadIdKey, raw) {
	if (!raw || typeof raw !== "object") return null;
	const value = raw;
	const threadId = normalizeThreadId(value.threadId ?? threadIdKey);
	const channelId = normalizeOptionalString(value.channelId) ?? "";
	const targetSessionKey = normalizeOptionalString(value.targetSessionKey) ?? "";
	if (!threadId || !channelId || !targetSessionKey) return null;
	const accountId = normalizeAccountId(value.accountId);
	const targetKind = normalizeTargetKind(value.targetKind, targetSessionKey);
	const agentId = (normalizeOptionalString(value.agentId) ?? "") || resolveAgentIdFromSessionKey(targetSessionKey);
	const label = normalizeOptionalString(value.label);
	const webhookId = normalizeOptionalString(value.webhookId);
	const webhookToken = normalizeOptionalString(value.webhookToken);
	const boundBy = normalizeOptionalString(value.boundBy) ?? "system";
	const boundAt = typeof value.boundAt === "number" && Number.isFinite(value.boundAt) ? Math.floor(value.boundAt) : Date.now();
	const lastActivityAt = typeof value.lastActivityAt === "number" && Number.isFinite(value.lastActivityAt) ? Math.max(0, Math.floor(value.lastActivityAt)) : boundAt;
	const idleTimeoutMs = typeof value.idleTimeoutMs === "number" && Number.isFinite(value.idleTimeoutMs) ? Math.max(0, Math.floor(value.idleTimeoutMs)) : void 0;
	const maxAgeMs = typeof value.maxAgeMs === "number" && Number.isFinite(value.maxAgeMs) ? Math.max(0, Math.floor(value.maxAgeMs)) : void 0;
	const metadata = value.metadata && typeof value.metadata === "object" ? { ...value.metadata } : void 0;
	const record = {
		accountId,
		channelId,
		threadId,
		targetKind,
		targetSessionKey,
		agentId,
		boundBy,
		boundAt,
		lastActivityAt
	};
	if (label !== void 0) record.label = label;
	if (webhookId !== void 0) record.webhookId = webhookId;
	if (webhookToken !== void 0) record.webhookToken = webhookToken;
	if (idleTimeoutMs !== void 0) record.idleTimeoutMs = idleTimeoutMs;
	if (maxAgeMs !== void 0) record.maxAgeMs = maxAgeMs;
	if (metadata !== void 0) record.metadata = metadata;
	return record;
}
function normalizeThreadBindingDurationMs(raw, defaultsTo) {
	if (typeof raw !== "number" || !Number.isFinite(raw)) return defaultsTo;
	const durationMs = Math.floor(raw);
	if (durationMs < 0) return defaultsTo;
	return durationMs;
}
function resolveThreadBindingIdleTimeoutMs(params) {
	const explicit = params.record.idleTimeoutMs;
	if (typeof explicit === "number" && Number.isFinite(explicit)) return Math.max(0, Math.floor(explicit));
	return Math.max(0, Math.floor(params.defaultIdleTimeoutMs));
}
function resolveThreadBindingMaxAgeMs(params) {
	const explicit = params.record.maxAgeMs;
	if (typeof explicit === "number" && Number.isFinite(explicit)) return Math.max(0, Math.floor(explicit));
	return Math.max(0, Math.floor(params.defaultMaxAgeMs));
}
function resolveThreadBindingInactivityExpiresAt(params) {
	const idleTimeoutMs = resolveThreadBindingIdleTimeoutMs({
		record: params.record,
		defaultIdleTimeoutMs: params.defaultIdleTimeoutMs
	});
	if (idleTimeoutMs <= 0) return;
	const lastActivityAt = Math.floor(params.record.lastActivityAt);
	if (!Number.isFinite(lastActivityAt) || lastActivityAt <= 0) return;
	return lastActivityAt + idleTimeoutMs;
}
function resolveThreadBindingMaxAgeExpiresAt(params) {
	const maxAgeMs = resolveThreadBindingMaxAgeMs({
		record: params.record,
		defaultMaxAgeMs: params.defaultMaxAgeMs
	});
	if (maxAgeMs <= 0) return;
	const boundAt = Math.floor(params.record.boundAt);
	if (!Number.isFinite(boundAt) || boundAt <= 0) return;
	return boundAt + maxAgeMs;
}
function linkSessionBinding(targetSessionKey, bindingKey) {
	const key = targetSessionKey.trim();
	if (!key) return;
	const threads = BINDINGS_BY_SESSION_KEY.get(key) ?? /* @__PURE__ */ new Set();
	threads.add(bindingKey);
	BINDINGS_BY_SESSION_KEY.set(key, threads);
}
function unlinkSessionBinding(targetSessionKey, bindingKey) {
	const key = targetSessionKey.trim();
	if (!key) return;
	const threads = BINDINGS_BY_SESSION_KEY.get(key);
	if (!threads) return;
	threads.delete(bindingKey);
	if (threads.size === 0) BINDINGS_BY_SESSION_KEY.delete(key);
}
function toReusableWebhookKey(params) {
	return `${normalizeLowercaseStringOrEmpty(params.accountId)}:${params.channelId.trim()}`;
}
function rememberReusableWebhook(record) {
	const webhookId = record.webhookId?.trim();
	const webhookToken = record.webhookToken?.trim();
	if (!webhookId || !webhookToken) return;
	const key = toReusableWebhookKey({
		accountId: record.accountId,
		channelId: record.channelId
	});
	REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.set(key, {
		webhookId,
		webhookToken
	});
}
function refreshUnboundThreadWebhookIdentity(record) {
	const sourceId = record.webhookId?.trim();
	if (!sourceId) return;
	recordOutboundMessageIdentity({
		channel: "discord",
		accountId: record.accountId,
		conversationId: record.threadId,
		sourceId
	});
}
function setBindingRecord(record) {
	const bindingKey = toBindingRecordKey({
		accountId: record.accountId,
		threadId: record.threadId
	});
	const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
	if (existing) unlinkSessionBinding(existing.targetSessionKey, bindingKey);
	BINDINGS_BY_THREAD_ID.set(bindingKey, record);
	linkSessionBinding(record.targetSessionKey, bindingKey);
	rememberReusableWebhook(record);
}
function removeBindingRecord(bindingKeyRaw) {
	const key = bindingKeyRaw.trim();
	if (!key) return null;
	const existing = BINDINGS_BY_THREAD_ID.get(key);
	if (!existing) return null;
	BINDINGS_BY_THREAD_ID.delete(key);
	unlinkSessionBinding(existing.targetSessionKey, key);
	return existing;
}
function shouldPersistAnyBindingState() {
	for (const value of PERSIST_BY_ACCOUNT_ID.values()) if (value) return true;
	return false;
}
function shouldPersistBindingMutations() {
	if (!THREAD_BINDINGS_STATE.persistenceAvailable) return false;
	if (shouldPersistAnyBindingState()) return true;
	return THREAD_BINDINGS_STATE.loadedPersistentBindings;
}
function toPersistedBindingRecord(record) {
	const serialized = JSON.stringify(record);
	if (!serialized) return { ...record };
	return JSON.parse(serialized);
}
function saveBindingsToDisk(params = {}) {
	if (!params.force && !shouldPersistAnyBindingState()) return;
	if (!THREAD_BINDINGS_STATE.persistenceAvailable) return;
	const minIntervalMs = typeof params.minIntervalMs === "number" && Number.isFinite(params.minIntervalMs) ? Math.max(0, Math.floor(params.minIntervalMs)) : 0;
	const now = Date.now();
	if (!params.force && minIntervalMs > 0 && THREAD_BINDINGS_STATE.lastPersistedAtMs > 0 && now - THREAD_BINDINGS_STATE.lastPersistedAtMs < minIntervalMs) return;
	try {
		const store = openThreadBindingsStore();
		const persistedKeys = /* @__PURE__ */ new Set();
		for (const [bindingKey, record] of BINDINGS_BY_THREAD_ID.entries()) {
			store.register(bindingKey, toPersistedBindingRecord(record));
			persistedKeys.add(bindingKey);
		}
		for (const entry of store.entries()) if (!persistedKeys.has(entry.key)) store.delete(entry.key);
		THREAD_BINDINGS_STATE.loadedPersistentBindings = persistedKeys.size > 0;
		THREAD_BINDINGS_STATE.lastPersistedAtMs = now;
	} catch {
		THREAD_BINDINGS_STATE.persistenceAvailable = false;
	}
}
function ensureBindingsLoaded() {
	if (THREAD_BINDINGS_STATE.loadedBindings) return;
	THREAD_BINDINGS_STATE.loadedBindings = true;
	BINDINGS_BY_THREAD_ID.clear();
	BINDINGS_BY_SESSION_KEY.clear();
	REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL.clear();
	THREAD_BINDINGS_STATE.loadedPersistentBindings = false;
	const entries = (() => {
		try {
			return openThreadBindingsStore().entries();
		} catch {
			THREAD_BINDINGS_STATE.persistenceAvailable = false;
			return null;
		}
	})();
	if (!entries) return;
	THREAD_BINDINGS_STATE.persistenceAvailable = true;
	THREAD_BINDINGS_STATE.loadedPersistentBindings = entries.length > 0;
	for (const entry of entries) {
		const normalized = normalizePersistedBinding(entry.key, entry.value);
		if (!normalized) continue;
		setBindingRecord(normalized);
	}
}
function resolveBindingIdsForSession(params) {
	const key = params.targetSessionKey.trim();
	if (!key) return [];
	const ids = BINDINGS_BY_SESSION_KEY.get(key);
	if (!ids) return [];
	const out = [];
	for (const bindingKey of ids.values()) {
		const record = BINDINGS_BY_THREAD_ID.get(bindingKey);
		if (!record) continue;
		if (params.accountId && record.accountId !== params.accountId) continue;
		if (params.targetKind && record.targetKind !== params.targetKind) continue;
		out.push(bindingKey);
	}
	return out;
}
//#endregion
export { toReusableWebhookKey as A, resolveThreadBindingMaxAgeExpiresAt as C, shouldDefaultPersist as D, setBindingRecord as E, shouldPersistBindingMutations as O, resolveThreadBindingInactivityExpiresAt as S, saveBindingsToDisk as T, rememberThreadBindingToken as _, THREAD_BINDINGS_MAX_ENTRIES as a, resolveBindingRecordKey as b, ensureBindingsLoaded as c, normalizePersistedBinding as d, normalizeTargetKind as f, rememberReusableWebhook as g, refreshUnboundThreadWebhookIdentity as h, REUSABLE_WEBHOOKS_BY_ACCOUNT_CHANNEL as i, toBindingRecordKey as k, forgetThreadBindingToken as l, normalizeThreadId as m, MANAGERS_BY_ACCOUNT_ID as n, THREAD_BINDINGS_NAMESPACE as o, normalizeThreadBindingDurationMs as p, PERSIST_BY_ACCOUNT_ID as r, THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS as s, BINDINGS_BY_THREAD_ID as t, getThreadBindingToken as u, removeBindingRecord as v, resolveThreadBindingMaxAgeMs as w, resolveThreadBindingIdleTimeoutMs as x, resolveBindingIdsForSession as y };
