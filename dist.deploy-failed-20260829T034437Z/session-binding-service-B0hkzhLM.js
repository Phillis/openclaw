import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { y as uniqueValues } from "./string-normalization-e_fvmxMf.js";
import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { i as getActivePluginChannelRegistryFromState } from "./registry-lookup-DLP3NSyt.js";
import "./registry-DbgR8dhg.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeConversationRef, t as buildChannelAccountKey } from "./session-binding-normalization-B2hVorZQ.js";
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
function buildConversationKey(ref) {
	return [
		ref.channel,
		ref.accountId,
		ref.parentConversationId ?? "",
		ref.conversationId
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
	if (!record?.bindingId || !record?.conversation?.conversationId) return null;
	const conversation = normalizeConversationRef(record.conversation);
	const targetSessionKey = record.targetSessionKey?.trim() ?? "";
	if (!targetSessionKey) return null;
	return {
		...record,
		bindingId: record.bindingId.startsWith(CURRENT_BINDINGS_ID_PREFIX) ? buildBindingId(conversation) : record.bindingId,
		targetSessionKey,
		conversation
	};
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
function targetAgentIdForSessionKey(targetSessionKey) {
	return resolveAgentIdFromSessionKey(targetSessionKey);
}
function readCurrentConversationBindingRow(db, conversation, bindingKey) {
	const bindingDb = getNodeSqliteKysely(db);
	const exact = executeSqliteQueryTakeFirstSync(db, bindingDb.selectFrom("current_conversation_bindings").select([
		"binding_key",
		"binding_id",
		"target_session_key",
		"record_json"
	]).where("binding_key", "=", bindingKey));
	if (exact) return exact;
	return executeSqliteQuerySync(db, bindingDb.selectFrom("current_conversation_bindings").select([
		"binding_key",
		"binding_id",
		"target_session_key",
		"record_json"
	]).where("channel", "=", conversation.channel).where("account_id", "=", conversation.accountId).where("conversation_kind", "=", CURRENT_BINDING_CONVERSATION_KIND).where("conversation_id", "=", conversation.conversationId)).rows.find((candidate) => {
		const record = bindingRowsToRecords([candidate])[0];
		return record !== void 0 && buildConversationKey(record.conversation) === bindingKey;
	});
}
function currentConversationBindingRow(record, conversation, bindingKey) {
	return {
		binding_key: bindingKey,
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
		updated_at: Date.now()
	};
}
function deleteCurrentConversationBindingRow(db, bindingKey) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("current_conversation_bindings").where("binding_key", "=", bindingKey));
}
/** Updates one binding from its currently committed row in one synchronous transaction. */
function updateCurrentConversationBindingRecord(ref, update) {
	const conversation = normalizeConversationRef(ref);
	const bindingKey = buildConversationKey(conversation);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const existingRow = readCurrentConversationBindingRow(db, conversation, bindingKey);
		const existing = existingRow ? bindingRowsToRecords([existingRow])[0] ?? null : null;
		const previous = existing && !isBindingExpired(existing) ? existing : null;
		const current = update(previous);
		if (!current) {
			if (existingRow) deleteCurrentConversationBindingRow(db, existingRow.binding_key);
			return {
				previous,
				current: null
			};
		}
		if (buildConversationKey(normalizeConversationRef(current.conversation)) !== bindingKey) throw new Error("Current conversation binding update changed its conversation owner");
		if (existingRow && existingRow.binding_key !== bindingKey) deleteCurrentConversationBindingRow(db, existingRow.binding_key);
		const row = currentConversationBindingRow(current, conversation, bindingKey);
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("current_conversation_bindings").values(row).onConflict((conflict) => conflict.column("binding_key").doUpdateSet(row)));
		return {
			previous,
			current
		};
	});
}
/** Reads the latest durable binding and prunes only the exact expired conversation row. */
function resolveCurrentConversationBindingRecord(ref) {
	const { db } = openOpenClawStateDatabase();
	const conversation = normalizeConversationRef(ref);
	const row = readCurrentConversationBindingRow(db, conversation, buildConversationKey(conversation));
	if (!row) return null;
	const record = bindingRowsToRecords([row])[0];
	if (!record) return null;
	if (isBindingExpired(record)) return updateCurrentConversationBindingRecord(conversation, (current) => current).current;
	if (row.binding_key !== buildConversationKey(record.conversation) || row.binding_id !== record.bindingId || row.target_session_key !== record.targetSessionKey) return updateCurrentConversationBindingRecord(conversation, (current) => current).current;
	return record;
}
function listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope) {
	if (!parseAgentSessionKey(targetSessionKey)) return [];
	let query = getNodeSqliteKysely(db).selectFrom("current_conversation_bindings").select([
		"binding_key",
		"binding_id",
		"target_session_key",
		"record_json"
	]).where("target_agent_id", "=", targetAgentIdForSessionKey(targetSessionKey)).where("target_session_key", "=", targetSessionKey);
	if (scope) {
		const normalized = normalizeConversationRef({
			...scope,
			conversationId: "binding-scope"
		});
		query = query.where("channel", "=", normalized.channel).where("account_id", "=", normalized.accountId);
	} else query = query.where("binding_id", "like", `${CURRENT_BINDINGS_ID_PREFIX}%`);
	return executeSqliteQuerySync(db, query.orderBy("binding_id", "asc")).rows;
}
/** Lists latest durable bindings using the indexed session owner and optional account scope. */
function listCurrentConversationBindingRecordsBySession(targetSessionKey, scope) {
	const { db } = openOpenClawStateDatabase();
	const records = bindingRowsToRecords(listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope));
	if (!records.some((record) => isBindingExpired(record))) return records;
	return runOpenClawStateWriteTransaction(({ db: transactionDb }) => {
		const latestRows = listCurrentConversationBindingRowsBySession(transactionDb, targetSessionKey, scope);
		const active = [];
		for (const row of latestRows) {
			const record = bindingRowsToRecords([row])[0];
			if (!record || isBindingExpired(record)) deleteCurrentConversationBindingRow(transactionDb, row.binding_key);
			else active.push(record);
		}
		return active;
	});
}
/** Deletes exact account-owned or generic session rows without disturbing sibling owners. */
function deleteCurrentConversationBindingRecordsBySession(targetSessionKey, scope) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const rows = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope);
		const removed = [];
		for (const row of rows) {
			const record = bindingRowsToRecords([row])[0];
			if (!scope && !record?.bindingId.startsWith(CURRENT_BINDINGS_ID_PREFIX)) continue;
			deleteCurrentConversationBindingRow(db, row.binding_key);
			if (record && !isBindingExpired(record)) removed.push(record);
		}
		return removed;
	});
}
function resolveChannelConversationBindingSupport(params) {
	const normalized = normalizeAnyChannelId(params.channel) ?? normalizeOptionalLowercaseString(normalizeConversationText(params.channel));
	if (!normalized) return;
	const matchesPluginId = (plugin) => plugin.id === normalized || (plugin.meta?.aliases ?? []).some((alias) => normalizeOptionalLowercaseString(alias) === normalized);
	return ((getActivePluginChannelRegistryFromState()?.channels ?? []).find((entry) => matchesPluginId(entry.plugin))?.plugin)?.conversationBindings;
}
function resolveChannelSupportsCurrentConversationBinding(params) {
	const bindingSupport = resolveChannelConversationBindingSupport(params);
	if (bindingSupport?.supportsCurrentConversationBinding !== true || bindingSupport.bindingStore === "adapter" || typeof bindingSupport.createManager === "function") return false;
	return bindingSupport.isCurrentConversationBindingSupported?.({ accountId: params.accountId }) ?? true;
}
/** True when an active channel lifecycle owns bindings through a registered adapter. */
function requiresRegisteredSessionBindingAdapter(params) {
	const support = resolveChannelConversationBindingSupport(params);
	return support?.bindingStore === "adapter" || typeof support?.createManager === "function";
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
	const [channel, accountId, parentConversationId, conversationId] = bindingId.slice(8).split("␟");
	if (!channel || !accountId || !conversationId) return null;
	return {
		channel,
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {}
	};
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
	const rawNow = Date.now();
	const now = asDateTimestampMs(rawNow);
	if (now === void 0) return null;
	const ttlMs = typeof input.ttlMs === "number" && Number.isFinite(input.ttlMs) ? Math.max(0, Math.floor(input.ttlMs)) : void 0;
	const expiresAt = ttlMs === void 0 ? void 0 : ttlMs === 0 ? now : resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
	if (ttlMs !== void 0 && expiresAt === void 0) return null;
	return updateCurrentConversationBindingRecord(conversation, (existing) => ({
		bindingId: buildBindingId(conversation),
		targetSessionKey,
		targetKind: input.targetKind,
		conversation,
		status: "active",
		boundAt: now,
		...expiresAt !== void 0 ? { expiresAt } : {},
		metadata: {
			...existing?.metadata,
			...input.metadata,
			lastActivityAt: now
		}
	})).current;
}
/** Resolves a current-conversation binding and prunes it if its TTL has expired. */
function resolveGenericCurrentConversationBinding(ref) {
	if (!supportsGenericCurrentConversationBinding(ref)) return null;
	const record = resolveCurrentConversationBindingRecord(ref);
	return record?.bindingId.startsWith(CURRENT_BINDINGS_ID_PREFIX) ? record : null;
}
/** Lists non-expired current-conversation bindings owned by one target session. */
function listGenericCurrentConversationBindingsBySession(targetSessionKey) {
	return listCurrentConversationBindingRecordsBySession(targetSessionKey).filter((record) => record.bindingId.startsWith(CURRENT_BINDINGS_ID_PREFIX) && supportsGenericCurrentConversationBinding(record.conversation));
}
/** Persists last-activity metadata for an existing generic current-conversation binding. */
function touchGenericCurrentConversationBinding(bindingId, at = Date.now()) {
	const conversation = bindingRefFromId(bindingId);
	if (!conversation || !supportsGenericCurrentConversationBinding(conversation)) return;
	updateCurrentConversationBindingRecord(conversation, (current) => current?.bindingId === bindingId ? {
		...current,
		metadata: {
			...current.metadata,
			lastActivityAt: at
		}
	} : current);
}
function unbindCurrentConversationBindingById(bindingId) {
	const conversation = bindingRefFromId(bindingId);
	if (!conversation || !supportsGenericCurrentConversationBinding(conversation)) return [];
	const { previous, current } = updateCurrentConversationBindingRecord(conversation, (latest) => latest?.bindingId === bindingId ? null : latest);
	return previous && !current ? [previous] : [];
}
/** Removes generic current-conversation bindings by binding id or target session key. */
async function unbindGenericCurrentConversationBindings(input) {
	const normalizedBindingId = input.bindingId?.trim();
	if (normalizedBindingId?.startsWith(CURRENT_BINDINGS_ID_PREFIX)) return unbindCurrentConversationBindingById(normalizedBindingId);
	const normalizedTargetSessionKey = input.targetSessionKey?.trim();
	return normalizedTargetSessionKey ? deleteCurrentConversationBindingRecordsBySession(normalizedTargetSessionKey) : [];
}
const testing$1 = { clearPersistedCurrentConversationBindingsForTests() {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("current_conversation_bindings"));
	});
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
function inspectSessionBindingByConversation(ref) {
	const normalized = normalizeConversationRef(ref);
	if (!normalized.channel || !normalized.conversationId) return {
		status: "available",
		binding: null
	};
	const adapter = resolveAdapterForChannelAccount(normalized);
	if (adapter) return {
		status: "available",
		binding: adapter.resolveByConversation(normalized)
	};
	if (requiresRegisteredSessionBindingAdapter(normalized)) return { status: "unavailable" };
	return {
		status: "available",
		binding: resolveGenericCurrentConversationBinding(normalized)
	};
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
		testing$1.clearPersistedCurrentConversationBindingsForTests();
	},
	getRegisteredAdapterKeys() {
		return [...ADAPTERS_BY_CHANNEL_ACCOUNT.keys()];
	}
};
//#endregion
export { testing as a, listCurrentConversationBindingRecordsBySession as c, normalizeConversationText as d, registerSessionBindingAdapter as i, resolveCurrentConversationBindingRecord as l, inspectSessionBindingByConversation as n, unregisterSessionBindingAdapter as o, isSessionBindingError as r, deleteCurrentConversationBindingRecordsBySession as s, getSessionBindingService as t, updateCurrentConversationBindingRecord as u };
