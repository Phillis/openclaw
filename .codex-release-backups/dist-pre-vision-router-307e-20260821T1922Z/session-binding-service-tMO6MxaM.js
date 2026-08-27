import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-DlCMR4eQ.js";
import { i as getActivePluginChannelRegistryFromState } from "./registry-lookup-DLP3NSyt.js";
import "./registry-BYAHQp83.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeConversationRef, t as buildChannelAccountKey } from "./session-binding-normalization-CFh5eVeP.js";
//#region src/acp/conversation-id.ts
/** Normalizes ACP conversation identifiers from loose metadata values. */
function normalizeConversationText(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return `${value}`.trim();
	return "";
}
//#endregion
//#region src/infra/outbound/current-conversation-bindings.ts
const CURRENT_BINDINGS_ID_PREFIX = "generic:";
const CURRENT_BINDING_CONVERSATION_KIND = "current";
const currentConversationBindingsState = resolveGlobalSingleton(Symbol.for("openclaw.currentConversationBindings"), () => ({
	loaded: false,
	byConversationKey: /* @__PURE__ */ new Map()
}), (state) => {
	state.loaded = false;
	state.byConversationKey.clear();
});
function buildConversationKey(ref) {
	const normalized = normalizeConversationRef(ref);
	return [
		normalized.channel,
		normalized.accountId,
		normalized.parentConversationId ?? "",
		normalized.conversationId
	].join("␟");
}
function buildBindingId(ref) {
	return `${CURRENT_BINDINGS_ID_PREFIX}${buildConversationKey(ref)}`;
}
function isBindingExpired(record, now = Date.now()) {
	if (record.expiresAt === void 0) return false;
	const expiresAt = asDateTimestampMs(record.expiresAt);
	if (expiresAt === void 0) return true;
	const nowMs = asDateTimestampMs(now);
	return nowMs !== void 0 && !isFutureDateTimestampMs(expiresAt, { nowMs });
}
function normalizePersistedBindingRecord(record) {
	if (!record?.bindingId || !record?.conversation?.conversationId || isBindingExpired(record)) return null;
	const conversation = normalizeConversationRef(record.conversation);
	const targetSessionKey = record.targetSessionKey?.trim() ?? "";
	if (!targetSessionKey) return null;
	return {
		...record,
		bindingId: buildBindingId(conversation),
		targetSessionKey,
		conversation
	};
}
function openBindingDatabase() {
	return openOpenClawStateDatabase();
}
function bindingRowsToRecords(rows) {
	return rows.flatMap((row) => {
		try {
			const normalized = normalizePersistedBindingRecord(JSON.parse(row.record_json));
			return normalized ? [normalized] : [];
		} catch {
			return [];
		}
	});
}
function readPersistedBindings() {
	const database = openBindingDatabase();
	const bindingDb = getNodeSqliteKysely(database.db);
	const now = Date.now();
	executeSqliteQuerySync(database.db, bindingDb.deleteFrom("current_conversation_bindings").where("expires_at", "is not", null).where("expires_at", "<=", now));
	const rows = executeSqliteQuerySync(database.db, bindingDb.selectFrom("current_conversation_bindings").select(["record_json"]).orderBy("binding_id", "asc")).rows;
	return bindingRowsToRecords(rows);
}
function targetAgentIdForSessionKey(targetSessionKey) {
	return resolveAgentIdFromSessionKey(targetSessionKey);
}
function writePersistedBindings(nextBindings) {
	const records = [...nextBindings.values()].filter((record) => !isBindingExpired(record)).toSorted((a, b) => a.bindingId.localeCompare(b.bindingId));
	const updatedAt = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		const bindingDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, bindingDb.deleteFrom("current_conversation_bindings"));
		if (records.length === 0) return;
		executeSqliteQuerySync(db, bindingDb.insertInto("current_conversation_bindings").values(records.map((record) => {
			const conversation = normalizeConversationRef(record.conversation);
			return {
				binding_key: buildConversationKey(conversation),
				binding_id: record.bindingId,
				target_agent_id: targetAgentIdForSessionKey(record.targetSessionKey),
				target_session_id: null,
				target_session_key: record.targetSessionKey,
				channel: conversation.channel,
				account_id: conversation.accountId,
				conversation_kind: CURRENT_BINDING_CONVERSATION_KIND,
				parent_conversation_id: conversation.parentConversationId ?? null,
				conversation_id: conversation.conversationId,
				target_kind: record.targetKind,
				status: record.status,
				bound_at: record.boundAt,
				expires_at: record.expiresAt ?? null,
				metadata_json: record.metadata ? JSON.stringify(record.metadata) : null,
				record_json: JSON.stringify(record),
				updated_at: updatedAt
			};
		})));
	});
}
function commitBindings(nextBindings) {
	writePersistedBindings(nextBindings);
	currentConversationBindingsState.byConversationKey = nextBindings;
}
function loadBindingsIntoMemory() {
	if (currentConversationBindingsState.loaded) return;
	const nextBindings = /* @__PURE__ */ new Map();
	for (const record of readPersistedBindings()) nextBindings.set(buildConversationKey(record.conversation), record);
	currentConversationBindingsState.byConversationKey = nextBindings;
	currentConversationBindingsState.loaded = true;
}
function resolveChannelSupportsCurrentConversationBinding(params) {
	const normalized = normalizeAnyChannelId(params.channel) ?? normalizeOptionalLowercaseString(normalizeConversationText(params.channel));
	if (!normalized) return false;
	const matchesPluginId = (plugin) => plugin.id === normalized || (plugin.meta?.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized);
	const bindingSupport = ((getActivePluginChannelRegistryFromState()?.channels ?? []).find((entry) => matchesPluginId(entry.plugin))?.plugin)?.conversationBindings;
	if (bindingSupport?.supportsCurrentConversationBinding !== true) return false;
	return bindingSupport.isCurrentConversationBindingSupported?.({ accountId: params.accountId }) ?? true;
}
function supportsGenericCurrentConversationBinding(ref) {
	const normalized = normalizeConversationRef({
		...ref,
		conversationId: "capability-check"
	});
	if (normalized.channel === "webchat") return true;
	return resolveChannelSupportsCurrentConversationBinding({
		channel: normalized.channel,
		accountId: normalized.accountId
	});
}
function bindingRefFromId(bindingId) {
	if (!bindingId.startsWith(CURRENT_BINDINGS_ID_PREFIX)) return null;
	const [channel, accountId] = bindingId.slice(8).split("␟", 2);
	return channel && accountId ? {
		channel,
		accountId
	} : null;
}
/** Reports generic current-conversation binding support for plugin-owned channels. */
function getGenericCurrentConversationBindingCapabilities(params) {
	if (!supportsGenericCurrentConversationBinding(params)) return null;
	return {
		adapterAvailable: true,
		bindSupported: true,
		unbindSupported: true,
		placements: ["current"]
	};
}
/** Stores or replaces the current-conversation binding for a normalized conversation ref. */
async function bindGenericCurrentConversation(input) {
	const conversation = normalizeConversationRef(input.conversation);
	const targetSessionKey = input.targetSessionKey.trim();
	if (!conversation.channel || !conversation.conversationId || !targetSessionKey || !supportsGenericCurrentConversationBinding(conversation)) return null;
	loadBindingsIntoMemory();
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) return null;
	const ttlMs = typeof input.ttlMs === "number" && Number.isFinite(input.ttlMs) ? Math.max(0, Math.floor(input.ttlMs)) : void 0;
	const expiresAt = ttlMs === void 0 ? void 0 : ttlMs === 0 ? now : resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (ttlMs !== void 0 && expiresAt === void 0) return null;
	const key = buildConversationKey(conversation);
	const existing = currentConversationBindingsState.byConversationKey.get(key);
	const activeExisting = existing && !isBindingExpired(existing) ? existing : void 0;
	const record = {
		bindingId: buildBindingId(conversation),
		targetSessionKey,
		targetKind: input.targetKind,
		conversation,
		status: "active",
		boundAt: now,
		...expiresAt !== void 0 ? { expiresAt } : {},
		metadata: {
			...activeExisting?.metadata,
			...input.metadata,
			lastActivityAt: now
		}
	};
	const nextBindings = new Map(currentConversationBindingsState.byConversationKey);
	nextBindings.set(key, record);
	commitBindings(nextBindings);
	return record;
}
/** Resolves a current-conversation binding and prunes it if its TTL has expired. */
function resolveGenericCurrentConversationBinding(ref) {
	if (!supportsGenericCurrentConversationBinding(ref)) return null;
	loadBindingsIntoMemory();
	const key = buildConversationKey(ref);
	const record = currentConversationBindingsState.byConversationKey.get(key) ?? null;
	if (!record || !isBindingExpired(record)) return record;
	const nextBindings = new Map(currentConversationBindingsState.byConversationKey);
	nextBindings.delete(key);
	commitBindings(nextBindings);
	return null;
}
/** Lists non-expired current-conversation bindings owned by one target session. */
function listGenericCurrentConversationBindingsBySession(targetSessionKey) {
	loadBindingsIntoMemory();
	const results = [];
	let nextBindings;
	for (const [key, record] of currentConversationBindingsState.byConversationKey) {
		if (isBindingExpired(record)) {
			nextBindings ??= new Map(currentConversationBindingsState.byConversationKey);
			nextBindings.delete(key);
			continue;
		}
		if (record.targetSessionKey !== targetSessionKey || !supportsGenericCurrentConversationBinding(record.conversation)) continue;
		results.push(record);
	}
	if (nextBindings) commitBindings(nextBindings);
	return results;
}
/** Persists last-activity metadata for an existing generic current-conversation binding. */
function touchGenericCurrentConversationBinding(bindingId, at = Date.now()) {
	const bindingRef = bindingRefFromId(bindingId);
	if (!bindingRef || !supportsGenericCurrentConversationBinding(bindingRef)) return;
	loadBindingsIntoMemory();
	const key = bindingId.slice(8);
	const record = currentConversationBindingsState.byConversationKey.get(key);
	if (!record) return;
	const nextBindings = new Map(currentConversationBindingsState.byConversationKey);
	if (isBindingExpired(record)) nextBindings.delete(key);
	else nextBindings.set(key, {
		...record,
		metadata: {
			...record.metadata,
			lastActivityAt: at
		}
	});
	commitBindings(nextBindings);
}
/** Removes generic current-conversation bindings by binding id or target session key. */
async function unbindGenericCurrentConversationBindings(input) {
	const removed = [];
	const normalizedBindingId = input.bindingId?.trim();
	const normalizedTargetSessionKey = input.targetSessionKey?.trim();
	if (normalizedBindingId?.startsWith(CURRENT_BINDINGS_ID_PREFIX)) {
		const bindingRef = bindingRefFromId(normalizedBindingId);
		if (!bindingRef || !supportsGenericCurrentConversationBinding(bindingRef)) return removed;
		loadBindingsIntoMemory();
		const key = normalizedBindingId.slice(8);
		const record = currentConversationBindingsState.byConversationKey.get(key);
		if (record) {
			const nextBindings = new Map(currentConversationBindingsState.byConversationKey);
			nextBindings.delete(key);
			if (!isBindingExpired(record)) removed.push(record);
			commitBindings(nextBindings);
		}
		return removed;
	}
	if (!normalizedTargetSessionKey) return removed;
	loadBindingsIntoMemory();
	const nextBindings = new Map(currentConversationBindingsState.byConversationKey);
	for (const [key, record] of currentConversationBindingsState.byConversationKey) {
		if (isBindingExpired(record)) {
			nextBindings.delete(key);
			continue;
		}
		if (record.targetSessionKey !== normalizedTargetSessionKey || !supportsGenericCurrentConversationBinding(record.conversation)) continue;
		nextBindings.delete(key);
		removed.push(record);
	}
	if (nextBindings.size !== currentConversationBindingsState.byConversationKey.size) commitBindings(nextBindings);
	return removed;
}
const testing$1 = { resetCurrentConversationBindingsForTests(params) {
	currentConversationBindingsState.loaded = false;
	currentConversationBindingsState.byConversationKey.clear();
	if (params?.deletePersistedFile) runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("current_conversation_bindings"));
	}, params.env ? { env: params.env } : void 0);
} };
//#endregion
//#region src/infra/outbound/session-binding-service.ts
var SessionBindingError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "SessionBindingError";
	}
};
function isSessionBindingError(error) {
	return error instanceof SessionBindingError;
}
function normalizePlacement(raw) {
	return raw === "current" || raw === "child" ? raw : void 0;
}
function inferDefaultPlacement(ref) {
	return ref.conversationId ? "current" : "child";
}
function resolveAdapterPlacements(adapter) {
	const placements = (adapter.capabilities?.placements?.map((value) => normalizePlacement(value)))?.filter((value) => Boolean(value));
	if (placements && placements.length > 0) return uniqueValues(placements);
	return ["current", "child"];
}
function resolveAdapterCapabilities(adapter) {
	if (!adapter) return {
		adapterAvailable: false,
		bindSupported: false,
		unbindSupported: false,
		placements: []
	};
	const bindSupported = adapter.capabilities?.bindSupported ?? Boolean(adapter.bind);
	return {
		adapterAvailable: true,
		bindSupported,
		unbindSupported: adapter.capabilities?.unbindSupported ?? Boolean(adapter.unbind),
		placements: bindSupported ? resolveAdapterPlacements(adapter) : []
	};
}
const ADAPTERS_BY_CHANNEL_ACCOUNT = resolveGlobalMap(Symbol.for("openclaw.sessionBinding.adapters"));
function registerSessionBindingAdapter(adapter) {
	const normalizedAdapter = {
		...adapter,
		...normalizeConversationRef({
			channel: adapter.channel,
			accountId: adapter.accountId,
			conversationId: "unused"
		})
	};
	const key = buildChannelAccountKey(normalizedAdapter);
	const existing = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key);
	const registrations = existing ? [...existing] : [];
	registrations.push({
		adapter,
		normalizedAdapter
	});
	ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, registrations);
}
function unregisterSessionBindingAdapter(params) {
	const key = buildChannelAccountKey(params);
	const registrations = ADAPTERS_BY_CHANNEL_ACCOUNT.get(key);
	if (!registrations || registrations.length === 0) return;
	const nextRegistrations = [...registrations];
	if (params.adapter) {
		const registrationIndex = nextRegistrations.findLastIndex((registration) => registration.adapter === params.adapter);
		if (registrationIndex < 0) return;
		nextRegistrations.splice(registrationIndex, 1);
	} else nextRegistrations.pop();
	if (nextRegistrations.length === 0) {
		ADAPTERS_BY_CHANNEL_ACCOUNT.delete(key);
		return;
	}
	ADAPTERS_BY_CHANNEL_ACCOUNT.set(key, nextRegistrations);
}
function resolveAdapterForChannelAccount(params) {
	return ADAPTERS_BY_CHANNEL_ACCOUNT.get(buildChannelAccountKey(params))?.at(-1)?.normalizedAdapter ?? null;
}
function getActiveRegisteredAdapters() {
	return [...ADAPTERS_BY_CHANNEL_ACCOUNT.values()].map((registrations) => registrations.at(-1)?.normalizedAdapter ?? null).filter((adapter) => Boolean(adapter));
}
function dedupeBindings(records) {
	const byId = /* @__PURE__ */ new Map();
	for (const record of records) {
		if (!record?.bindingId) continue;
		byId.set(record.bindingId, record);
	}
	return [...byId.values()];
}
function createDefaultSessionBindingService() {
	return {
		bind: async (input) => {
			const normalizedConversation = normalizeConversationRef(input.conversation);
			const adapter = resolveAdapterForChannelAccount(normalizedConversation);
			const genericCapabilities = adapter ? null : getGenericCurrentConversationBindingCapabilities(normalizedConversation);
			if (!adapter && !genericCapabilities?.bindSupported) throw new SessionBindingError("BINDING_ADAPTER_UNAVAILABLE", `Session binding adapter unavailable for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId
			});
			if (adapter && !adapter.bind) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding adapter does not support binding for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId
			});
			const placement = normalizePlacement(input.placement) ?? inferDefaultPlacement(normalizedConversation);
			if (!(adapter ? resolveAdapterPlacements(adapter) : genericCapabilities.placements).includes(placement)) throw new SessionBindingError("BINDING_CAPABILITY_UNSUPPORTED", `Session binding placement "${placement}" is not supported for ${normalizedConversation.channel}:${normalizedConversation.accountId}`, {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId,
				placement
			});
			const bindInput = {
				...input,
				conversation: normalizedConversation,
				placement
			};
			const bound = adapter ? await adapter.bind(bindInput) : await bindGenericCurrentConversation(bindInput);
			if (!bound) throw new SessionBindingError("BINDING_CREATE_FAILED", "Session binding adapter failed to bind target conversation", {
				channel: normalizedConversation.channel,
				accountId: normalizedConversation.accountId,
				placement
			});
			return bound;
		},
		getCapabilities: (params) => {
			const adapter = resolveAdapterForChannelAccount(params);
			if (!adapter) return getGenericCurrentConversationBindingCapabilities(params) ?? resolveAdapterCapabilities(null);
			return resolveAdapterCapabilities(adapter);
		},
		listBySession: (targetSessionKey) => {
			const key = targetSessionKey.trim();
			if (!key) return [];
			const results = [];
			for (const adapter of getActiveRegisteredAdapters()) {
				const entries = adapter.listBySession(key);
				if (entries.length > 0) results.push(...entries);
			}
			results.push(...listGenericCurrentConversationBindingsBySession(key));
			return dedupeBindings(results);
		},
		resolveByConversation: (ref) => {
			const normalized = normalizeConversationRef(ref);
			if (!normalized.channel || !normalized.conversationId) return null;
			const adapter = resolveAdapterForChannelAccount(normalized);
			if (!adapter) return resolveGenericCurrentConversationBinding(normalized);
			return adapter.resolveByConversation(normalized);
		},
		touch: (bindingId, at) => {
			const normalizedBindingId = bindingId.trim();
			if (!normalizedBindingId) return;
			for (const adapter of getActiveRegisteredAdapters()) adapter.touch?.(normalizedBindingId, at);
			touchGenericCurrentConversationBinding(normalizedBindingId, at);
		},
		unbind: async (input) => {
			const removed = [];
			for (const adapter of getActiveRegisteredAdapters()) {
				if (!adapter.unbind) continue;
				const entries = await adapter.unbind(input);
				if (entries.length > 0) removed.push(...entries);
			}
			removed.push(...await unbindGenericCurrentConversationBindings(input));
			return dedupeBindings(removed);
		}
	};
}
const DEFAULT_SESSION_BINDING_SERVICE = createDefaultSessionBindingService();
function getSessionBindingService() {
	return DEFAULT_SESSION_BINDING_SERVICE;
}
const testing = {
	resetSessionBindingAdaptersForTests() {
		ADAPTERS_BY_CHANNEL_ACCOUNT.clear();
		testing$1.resetCurrentConversationBindingsForTests({ deletePersistedFile: true });
	},
	getRegisteredAdapterKeys() {
		return [...ADAPTERS_BY_CHANNEL_ACCOUNT.keys()];
	}
};
//#endregion
export { unregisterSessionBindingAdapter as a, testing as i, isSessionBindingError as n, normalizeConversationText as o, registerSessionBindingAdapter as r, getSessionBindingService as t };
