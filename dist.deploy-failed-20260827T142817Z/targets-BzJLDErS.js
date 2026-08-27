import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, p as resolveDefaultAgentId, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { i as isPerAgentSessionStoreConfig, r as resolvePersistedSessionStoreOwnerForTarget, t as resolvePersistedSessionStoreOwner } from "./session-store-owner-BGbniDph.js";
import { n as resolveAgentsDirFromSessionStorePath, o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-D8ws5hED.js";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-CyHApqW_.js";
import { E as listOpenClawRegisteredAgentDatabases, _ as parseSqliteSessionEntryRecord, g as hasValidSessionEntryIdentity, h as normalizeConversationPeerId, m as buildConversationRef, x as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db-maintenance-1xIPEKIN.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { a as mergeDeliveryContext, c as normalizeSessionDeliveryState, d as sessionDeliveryOrigin, f as sessionDeliveryRoute, n as deliveryContextFromSession, s as normalizeDeliveryContext, t as deliveryContextFromChannelRoute, u as sessionDeliveryChannel } from "./delivery-context.shared-D-qPZITK.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DTj1P3q4.js";
import { t as resolveConversationLabel } from "./conversation-label-DYC5BXIh.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-CWrpiLCs.js";
import "./plugins-2lW9dSyY.js";
import "./message-channel-T4W5YOto.js";
import { a as resolveGroupSessionKey, n as projectCanonicalSessionEntryShape, r as buildGroupDisplayName } from "./store-entry-shape-BcuqmtLR.js";
import { a as normalizeStoreSessionKey, n as foldedSessionKeyAliasCandidates, o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-BgSA4iwU.js";
import { i as resolveUnsuffixedSqliteTargetFromSessionStorePath, r as resolveSqliteTargetFromSessionStorePath, t as listDurableSqliteTargetOwnersForSessionStorePath } from "./session-sqlite-target-CgxvSLWw.js";
import { a as normalizeSqliteSessionKey, i as getSessionKysely, t as cloneSessionEntry } from "./session-accessor.sqlite-scope-CyEaWvgy.js";
import { n as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-U6HbS8-N.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/config/sessions/metadata.ts
function isSystemEventProvider(provider) {
	return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
const mergeSessionOrigin = (existing, next) => {
	if (!existing && !next) return;
	const merged = existing ? { ...existing } : {};
	const nextProvider = next?.provider;
	const nextIsDeliverableChannel = nextProvider != null && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider);
	if (existing != null && nextIsDeliverableChannel && (existing.provider != null && nextProvider !== existing.provider || existing.surface != null && next?.surface != null && next.surface !== existing.surface || existing.accountId != null && next?.accountId != null && next.accountId !== existing.accountId)) {
		delete merged.nativeChannelId;
		delete merged.nativeDirectUserId;
		delete merged.accountId;
		delete merged.threadId;
	}
	if (next?.label) merged.label = next.label;
	if (next?.provider) merged.provider = next.provider;
	if (next?.surface) merged.surface = next.surface;
	if (next?.chatType) merged.chatType = next.chatType;
	if (next?.from) merged.from = next.from;
	if (next?.to) merged.to = next.to;
	if (next?.nativeChannelId) merged.nativeChannelId = next.nativeChannelId;
	if (next?.nativeDirectUserId) merged.nativeDirectUserId = next.nativeDirectUserId;
	if (next?.accountId) merged.accountId = next.accountId;
	if (next?.threadId != null && next.threadId !== "") merged.threadId = next.threadId;
	return Object.keys(merged).length > 0 ? merged : void 0;
};
/** Derives session origin metadata from an inbound message context. */
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && isSystemEventProvider(ctx.Provider)) return;
	const label = normalizeOptionalString(resolveConversationLabel(ctx));
	const provider = normalizeMessageChannel(typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider);
	const surface = normalizeOptionalLowercaseString(ctx.Surface);
	const chatType = normalizeChatType(ctx.ChatType) ?? void 0;
	const from = normalizeOptionalString(ctx.From);
	const to = normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To);
	const nativeChannelId = normalizeOptionalString(ctx.NativeChannelId);
	const nativeDirectUserId = normalizeOptionalString(ctx.NativeDirectUserId);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const threadId = ctx.MessageThreadId ?? void 0;
	const origin = {};
	if (label) origin.label = label;
	if (provider) origin.provider = provider;
	if (surface) origin.surface = surface;
	if (chatType) origin.chatType = chatType;
	if (from) origin.from = from;
	if (to) origin.to = to;
	if (nativeChannelId) origin.nativeChannelId = nativeChannelId;
	if (nativeDirectUserId) origin.nativeDirectUserId = nativeDirectUserId;
	if (accountId) origin.accountId = accountId;
	if (threadId != null && threadId !== "") origin.threadId = threadId;
	return Object.keys(origin).length > 0 ? origin : void 0;
}
function deriveGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = params.ctx.GroupSubject?.trim();
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	const nextSubject = nextGroupChannel ? void 0 : subject;
	const patch = {
		chatType: resolution.chatType ?? "group",
		groupId: resolution.id
	};
	if (nextSubject) {
		patch.subject = nextSubject;
		patch.groupChannel = void 0;
	}
	if (nextGroupChannel) {
		patch.groupChannel = nextGroupChannel;
		patch.subject = void 0;
	}
	if (space) patch.space = space;
	const displayName = buildGroupDisplayName({
		provider: channel,
		subject: nextSubject ?? (nextGroupChannel ? void 0 : params.existing?.subject),
		groupChannel: nextGroupChannel ?? (nextSubject ? void 0 : params.existing?.groupChannel),
		space: space ?? params.existing?.space,
		id: resolution.id,
		key: params.sessionKey
	});
	if (displayName) patch.displayName = displayName;
	return patch;
}
function deriveSessionMetaPatch(params) {
	const groupPatch = deriveGroupSessionPatch(params);
	const origin = deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin });
	if (!groupPatch && !origin) return null;
	const patch = groupPatch ? { ...groupPatch } : {};
	const existingOrigin = sessionDeliveryOrigin(params.existing);
	const mergedOrigin = mergeSessionOrigin(existingOrigin, origin);
	if (mergedOrigin) {
		if (!patch.chatType && mergedOrigin.chatType) patch.chatType = mergedOrigin.chatType;
		const nextProvider = origin?.provider;
		const nextOwnsExternalRoute = Boolean(nextProvider && nextProvider !== "webchat" && !isInternalNonDeliveryChannel(nextProvider) && !isSystemEventProvider(nextProvider));
		const existingRoute = sessionDeliveryRoute(params.existing);
		const existingRouteAccountId = existingRoute?.accountId ?? deliveryContextFromSession(params.existing)?.accountId;
		const freshRouteOwnsNextProvider = params.preserveExistingDeliveryRoute === true && nextProvider != null && existingRoute?.channel === nextProvider && (origin?.accountId == null || existingRouteAccountId === origin.accountId);
		const deliveryIdentityChanged = nextOwnsExternalRoute && !freshRouteOwnsNextProvider && (!existingOrigin || existingOrigin.provider != null && nextProvider !== existingOrigin.provider || existingOrigin.surface != null && origin?.surface != null && origin.surface !== existingOrigin.surface || existingOrigin.accountId != null && origin?.accountId != null && origin.accountId !== existingOrigin.accountId);
		patch.delivery = normalizeSessionDeliveryState({
			route: deliveryIdentityChanged ? void 0 : sessionDeliveryRoute(params.existing),
			context: deliveryIdentityChanged ? {
				channel: mergedOrigin.provider,
				to: mergedOrigin.to,
				accountId: mergedOrigin.accountId,
				threadId: mergedOrigin.threadId
			} : deliveryContextFromSession(params.existing),
			origin: mergedOrigin
		});
	}
	return Object.keys(patch).length > 0 ? patch : null;
}
function removeThreadFromDeliveryContext(context) {
	if (!context || context.threadId == null) return context;
	const next = { ...context };
	delete next.threadId;
	return next;
}
/**
* Derives the last-route/delivery patch for an inbound routing update. Route
* updates must not refresh activity timestamps; idle/daily reset evaluation
* relies on updatedAt from actual session turns (#49515). Shared by the file
* store and the SQLite accessor so both backends apply one routing policy.
*/
function deriveLastRoutePatch(params) {
	const { channel, to, accountId, threadId, ctx, existing } = params;
	const explicitContext = normalizeDeliveryContext(params.deliveryContext);
	const inlineContext = normalizeDeliveryContext({
		channel,
		to,
		accountId,
		threadId
	});
	const routeContext = deliveryContextFromChannelRoute(params.route);
	const mergedInput = mergeDeliveryContext(routeContext, mergeDeliveryContext(explicitContext, inlineContext));
	const explicitDeliveryContext = params.deliveryContext;
	const explicitThreadValue = (explicitDeliveryContext != null && Object.hasOwn(explicitDeliveryContext, "threadId") ? explicitDeliveryContext.threadId : void 0) ?? (threadId != null && threadId !== "" ? threadId : void 0);
	const merged = mergeDeliveryContext(mergedInput, Boolean(routeContext?.channel || routeContext?.to || explicitContext?.channel || explicitContext?.to || inlineContext?.channel || inlineContext?.to) && explicitThreadValue == null ? removeThreadFromDeliveryContext(deliveryContextFromSession(existing)) : deliveryContextFromSession(existing));
	const delivery = normalizeSessionDeliveryState({
		route: params.route,
		context: {
			channel: merged?.channel,
			to: merged?.to,
			accountId: merged?.accountId,
			threadId: merged?.threadId
		},
		origin: sessionDeliveryOrigin(existing)
	});
	const nextEntry = existing ? {
		...existing,
		delivery
	} : { delivery };
	const metaPatch = ctx ? deriveSessionMetaPatch({
		ctx,
		sessionKey: params.sessionKey,
		existing: nextEntry,
		groupResolution: params.groupResolution,
		preserveExistingDeliveryRoute: routeContext != null
	}) : null;
	const basePatch = { delivery };
	return metaPatch ? {
		...basePatch,
		...metaPatch
	} : basePatch;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-status.ts
function normalizeStatus(value) {
	return value === "running" || value === "done" || value === "failed" || value === "killed" || value === "timeout" ? value : null;
}
function parseSessionEntryJson(row) {
	const record = parseSqliteSessionEntryRecord(row);
	return record ? projectCanonicalSessionEntryShape(record) : null;
}
function readSessionEntriesByStatus(database, statuses, sessionKeys) {
	const selectedStatuses = [...new Set(statuses)];
	const selectedSessionKeys = sessionKeys ? [...new Set(sessionKeys)] : void 0;
	if (selectedStatuses.length === 0 || selectedSessionKeys?.length === 0) return [];
	let query = getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
		"session_key",
		"entry_json",
		"current_session_id",
		"updated_at"
	]).where("status", "in", selectedStatuses);
	if (selectedSessionKeys) query = query.where("session_key", "in", selectedSessionKeys);
	return executeSqliteQuerySync(database.db, query).rows.flatMap((row) => {
		const entry = parseSessionEntryJson(row);
		return entry ? [{
			entry,
			sessionKey: row.session_key
		}] : [];
	}).toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
const MAX_INCREMENTAL_ENTRY_READ_KEYS = 500;
const sessionEntryCaches = /* @__PURE__ */ new WeakMap();
const sessionNodesGenerationTrackerSchemaVersions = /* @__PURE__ */ new WeakMap();
function readDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
function ensureSessionNodesGenerationTracker(database) {
	const schemaRow = database.prepare("PRAGMA schema_version").get();
	if (typeof schemaRow.schema_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA schema_version");
	const trackedSchemaVersion = sessionNodesGenerationTrackerSchemaVersions.get(database);
	if (trackedSchemaVersion === schemaRow.schema_version) return;
	database.exec(`
    CREATE TEMP TABLE IF NOT EXISTS openclaw_session_nodes_cache_generation (id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1), generation INTEGER NOT NULL) STRICT;
    INSERT OR IGNORE INTO openclaw_session_nodes_cache_generation (id, generation) VALUES (1, 0);
    ${trackedSchemaVersion === void 0 ? "" : "UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1;"}
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_insert;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_update;
    DROP TRIGGER IF EXISTS openclaw_session_nodes_cache_generation_delete;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_insert
      AFTER INSERT ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_update
      AFTER UPDATE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
    CREATE TEMP TRIGGER openclaw_session_nodes_cache_generation_delete
      AFTER DELETE ON main.session_nodes BEGIN UPDATE openclaw_session_nodes_cache_generation SET generation = generation + 1 WHERE id = 1; END;
  `);
	sessionNodesGenerationTrackerSchemaVersions.set(database, schemaRow.schema_version);
}
function readSessionNodesGeneration(database) {
	ensureSessionNodesGenerationTracker(database);
	const row = database.prepare("SELECT generation FROM temp.openclaw_session_nodes_cache_generation WHERE id = 1").get();
	if (typeof row.generation !== "number") throw new Error("SQLite session_nodes cache generation is unavailable");
	return row.generation;
}
function readCacheValidityToken(database) {
	return {
		dataVersion: readDataVersion(database),
		sessionNodesGeneration: readSessionNodesGeneration(database)
	};
}
function cacheValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.sessionNodesGeneration === right.sessionNodesGeneration;
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const before = sessionEntryCaches.has(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	write();
	return before === void 0 ? void 0 : {
		before,
		after: readSessionNodesGeneration(database.db)
	};
}
function createListProjection(entry) {
	const projected = { ...entry };
	delete projected.skillsSnapshot;
	delete projected.systemPromptReport;
	return projected;
}
function createLazyListProjections(entries, projectedByKey) {
	return { get: (sessionKey) => {
		const cached = projectedByKey.get(sessionKey);
		if (cached) return cached;
		const entry = entries.get(sessionKey);
		if (!entry) return;
		const projected = createListProjection(entry);
		projectedByKey.set(sessionKey, projected);
		return projected;
	} };
}
function loadSessionEntrySnapshot(database) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"entry_json",
		"updated_at"
	]).orderBy("session_key")).rows;
	const entries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		entries.set(row.session_key, entry);
	}
	const listProjections = /* @__PURE__ */ new Map();
	return {
		entries,
		keys: rows.map((row) => row.session_key),
		listEntries: createLazyListProjections(entries, listProjections),
		listProjections,
		updatedAtByKey: new Map(rows.map((row) => [row.session_key, row.updated_at]))
	};
}
function incrementallyRevalidateSessionEntrySnapshot(database, cached, validityToken) {
	const db = getSessionKysely(database.db);
	const versions = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "updated_at"])).rows;
	const updatedAtByKey = new Map(versions.map((row) => [row.session_key, row.updated_at]));
	const changedKeys = versions.filter((row) => cached.updatedAtByKey.get(row.session_key) !== row.updated_at).map((row) => row.session_key);
	const removedKeys = cached.keys.filter((sessionKey) => !updatedAtByKey.has(sessionKey));
	if (changedKeys.length === 0 && removedKeys.length === 0) {
		cached.validityToken = validityToken;
		return cached;
	}
	if (changedKeys.length > MAX_INCREMENTAL_ENTRY_READ_KEYS) return {
		...loadSessionEntrySnapshot(database),
		validityToken
	};
	const entries = new Map(cached.entries);
	const listProjections = new Map(cached.listProjections);
	for (const sessionKey of [...changedKeys, ...removedKeys]) {
		entries.delete(sessionKey);
		listProjections.delete(sessionKey);
	}
	if (changedKeys.length > 0) {
		const changedRows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "entry_json"]).where("session_key", "in", changedKeys)).rows;
		for (const row of changedRows) {
			const entry = parseSessionEntryJson(row);
			if (entry) entries.set(row.session_key, entry);
		}
	}
	return {
		entries,
		keys: versions.map((row) => row.session_key).toSorted(),
		listEntries: createLazyListProjections(entries, listProjections),
		listProjections,
		updatedAtByKey,
		validityToken
	};
}
function readSessionEntryCache(database, options) {
	if (!options.cache || options.latest || database.db.isTransaction) return loadSessionEntrySnapshot(database);
	const validityToken = readCacheValidityToken(database.db);
	const cached = sessionEntryCaches.get(database.db);
	if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
	if (cached && cached.validityToken.dataVersion === validityToken.dataVersion) {
		const revalidated = incrementallyRevalidateSessionEntrySnapshot(database, cached, validityToken);
		if (readDataVersion(database.db) !== validityToken.dataVersion) {
			const reloadToken = readCacheValidityToken(database.db);
			const next = {
				...loadSessionEntrySnapshot(database),
				validityToken: reloadToken
			};
			sessionEntryCaches.set(database.db, next);
			return next;
		}
		sessionEntryCaches.set(database.db, revalidated);
		return revalidated;
	}
	const next = {
		...loadSessionEntrySnapshot(database),
		validityToken
	};
	sessionEntryCaches.set(database.db, next);
	return next;
}
function invalidateTrackedCache(database) {
	const invalidate = () => {
		sessionEntryCaches.delete(database.db);
	};
	if (deferOpenClawAgentPostCommitPublication(database, invalidate)) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	invalidate();
}
function publishTrackedCacheUpdate(database, publish) {
	if (deferOpenClawAgentPostCommitPublication(database, publish)) return;
	if (database.db.isTransaction) throw new Error("SQLite session entry writes must use runOpenClawAgentWriteTransaction for cache publication");
	publish();
}
function publishSqliteSessionEntryCacheUpsert(database, row, writeGeneration) {
	const entry = parseSessionEntryJson({
		current_session_id: row.current_session_id,
		entry_json: row.entry_json,
		updated_at: row.updated_at
	});
	if (!entry) {
		invalidateTrackedCache(database);
		return;
	}
	if (!writeGeneration) {
		invalidateTrackedCache(database);
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		const generationIsContinuous = cached.validityToken.sessionNodesGeneration === writeGeneration.before;
		const entries = new Map(cached.entries);
		entries.set(row.session_key, entry);
		const listProjections = new Map(cached.listProjections);
		listProjections.delete(row.session_key);
		const updatedAtByKey = new Map(cached.updatedAtByKey);
		const knownKey = updatedAtByKey.has(row.session_key);
		updatedAtByKey.set(row.session_key, row.updated_at);
		sessionEntryCaches.set(database.db, {
			entries,
			keys: knownKey ? cached.keys : [...cached.keys, row.session_key].toSorted(),
			listEntries: createLazyListProjections(entries, listProjections),
			listProjections,
			updatedAtByKey,
			validityToken: generationIsContinuous ? {
				...cached.validityToken,
				sessionNodesGeneration: writeGeneration.after
			} : cached.validityToken
		});
	});
}
function publishSessionEntryCacheInvalidation(database, row, writeGeneration) {
	if (row) {
		publishSqliteSessionEntryCacheUpsert(database, row, writeGeneration);
		return;
	}
	invalidateTrackedCache(database);
}
//#endregion
//#region src/config/sessions/conversation-identity.ts
function normalizeThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
function normalizeKind(value) {
	const normalized = normalizeChatType(typeof value === "string" ? value : void 0);
	if (normalized === "channel") return "channel";
	if (normalized === "group") return "group";
	return "direct";
}
function resolvePairedOriginPeerId(params) {
	if (params.kind !== "direct") return;
	const origin = sessionDeliveryOrigin(params.entry);
	const originFrom = normalizeOptionalString(origin?.from);
	const originTo = normalizeOptionalString(origin?.to);
	const originChannel = normalizeOptionalString(origin?.provider)?.toLowerCase();
	const deliveryChannel = normalizeOptionalString(params.deliveryContext?.channel)?.toLowerCase();
	if (!originFrom || originTo !== params.deliveryTarget || !originChannel || originChannel !== deliveryChannel || normalizeChatType(origin?.chatType) !== params.kind || (normalizeOptionalAccountId(origin?.accountId) ?? "default") !== (normalizeOptionalAccountId(params.deliveryContext?.accountId) ?? "default") || normalizeThreadId(origin?.threadId) !== normalizeThreadId(params.deliveryContext?.threadId)) return;
	return originFrom;
}
/** Builds one stable transport address from authoritative channel route facts. */
function buildConversationIdentity(params) {
	const channel = normalizeOptionalString(params.channel)?.toLowerCase();
	const rawPeerId = normalizeOptionalString(params.peerId);
	if (!channel || !rawPeerId) return null;
	const peerId = normalizeConversationPeerId(channel, rawPeerId);
	if (!peerId) return null;
	const deliveryTarget = normalizeOptionalString(params.deliveryTarget);
	if (!deliveryTarget) return null;
	const accountId = normalizeOptionalAccountId(params.accountId) ?? "default";
	const rawParent = normalizeOptionalString(params.parentConversationRef);
	const parentConversationRef = rawParent ? rawParent.startsWith("conv_") ? rawParent : buildConversationRef({
		channel,
		accountId,
		kind: params.kind,
		peerId: normalizeConversationPeerId(channel, rawParent)
	}) : void 0;
	const threadId = normalizeThreadId(params.threadId);
	return {
		conversationRef: buildConversationRef({
			channel,
			accountId,
			kind: params.kind,
			peerId,
			parentConversationRef,
			threadId
		}),
		channel,
		accountId,
		kind: params.kind,
		peerId,
		deliveryTarget,
		...parentConversationRef ? { parentConversationRef } : {},
		...threadId ? { threadId } : {},
		...normalizeOptionalString(params.nativeChannelId) ? { nativeChannelId: normalizeOptionalString(params.nativeChannelId) } : {},
		...normalizeOptionalString(params.nativeDirectUserId) ? { nativeDirectUserId: normalizeOptionalString(params.nativeDirectUserId) } : {},
		...normalizeOptionalString(params.label) ? { label: normalizeOptionalString(params.label) } : {},
		...params.metadata ? { metadata: params.metadata } : {}
	};
}
/** Derives a transport address from the canonical route snapshot persisted on a session. */
function conversationIdentityFromSessionEntry(entry) {
	const deliveryContext = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	const kind = normalizeKind(entry.chatType);
	const routeTarget = normalizeOptionalString(deliveryContext?.to);
	const deliveryTarget = routeTarget ?? (kind === "direct" ? normalizeOptionalString(origin?.from) : void 0);
	const routeOwnsTarget = Boolean(routeTarget);
	const channel = routeOwnsTarget ? deliveryContext?.channel : normalizeOptionalString(origin?.provider);
	const pairedOriginPeerId = routeTarget ? resolvePairedOriginPeerId({
		entry,
		deliveryContext,
		deliveryTarget: routeTarget,
		kind
	}) : void 0;
	return buildConversationIdentity({
		channel,
		accountId: routeOwnsTarget ? deliveryContext?.accountId : origin?.accountId,
		kind,
		peerId: pairedOriginPeerId ?? deliveryTarget,
		deliveryTarget,
		threadId: routeOwnsTarget ? deliveryContext?.threadId : origin?.threadId,
		nativeChannelId: origin?.nativeChannelId,
		nativeDirectUserId: origin?.nativeDirectUserId,
		label: entry.displayName ?? entry.label
	});
}
/** Derives the same stable address from live inbound channel facts. */
function conversationIdentityFromMsgContext(params) {
	const route = deriveSessionOrigin(params.ctx);
	const explicitDeliveryContext = normalizeDeliveryContext(params.deliveryContext);
	const deliveryContext = mergeDeliveryContext(explicitDeliveryContext, normalizeDeliveryContext({
		channel: route?.provider,
		to: route?.to,
		accountId: route?.accountId,
		threadId: route?.threadId
	}));
	const groupResolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	const kind = groupResolution?.chatType ?? normalizeKind(params.ctx.ChatType);
	const directIngressTarget = kind === "direct" ? normalizeOptionalString(params.ctx.From) : void 0;
	const useDirectIngressTarget = Boolean(directIngressTarget && !explicitDeliveryContext?.to);
	const deliveryTarget = useDirectIngressTarget ? directIngressTarget : normalizeOptionalString(deliveryContext?.to) ?? normalizeOptionalString(params.ctx.OriginatingTo) ?? normalizeOptionalString(params.ctx.To);
	return buildConversationIdentity({
		channel: useDirectIngressTarget ? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider) : deliveryContext?.channel ?? groupResolution?.channel ?? normalizeOptionalString(route?.provider) ?? normalizeOptionalString(params.ctx.OriginatingChannel) ?? normalizeOptionalString(params.ctx.Provider),
		accountId: useDirectIngressTarget ? route?.accountId ?? params.ctx.AccountId : deliveryContext?.accountId ?? route?.accountId ?? params.ctx.AccountId,
		kind,
		peerId: deliveryTarget,
		deliveryTarget,
		threadId: useDirectIngressTarget ? route?.threadId ?? params.ctx.MessageThreadId : deliveryContext?.threadId ?? params.ctx.MessageThreadId,
		nativeChannelId: params.ctx.NativeChannelId ?? route?.nativeChannelId,
		nativeDirectUserId: params.ctx.NativeDirectUserId ?? route?.nativeDirectUserId,
		label: normalizeOptionalString(resolveConversationLabel(params.ctx)) ?? route?.label
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-conversation.ts
/** Shared-main DMs multiplex peers through one context; every other routed session has one primary. */
function prepareSessionConversation(params) {
	const identity = conversationIdentityFromSessionEntry(params.entry);
	if (!identity) return null;
	return {
		identity,
		role: params.sessionScope === "shared-main" && identity.kind === "direct" ? "participant" : "primary"
	};
}
/** Upserts the address before the session row so its primary-conversation FK is always valid. */
function upsertConversationIdentity(database, identity, updatedAt) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.insertInto("conversations").values({
		conversation_id: identity.conversationRef,
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet({
		channel: identity.channel,
		account_id: identity.accountId,
		kind: identity.kind,
		peer_id: identity.peerId,
		delivery_target: identity.deliveryTarget,
		parent_conversation_id: identity.parentConversationRef ?? null,
		thread_id: identity.threadId ?? null,
		native_channel_id: identity.nativeChannelId ?? null,
		native_direct_user_id: identity.nativeDirectUserId ?? null,
		label: identity.label ?? null,
		metadata_json: identity.metadata ? JSON.stringify(identity.metadata) : null,
		updated_at: updatedAt
	})));
}
/** Links one external address to its local context without conflating the two identities. */
function linkSessionConversation(params) {
	const { database, sessionId, conversation, updatedAt } = params;
	const db = getSessionKysely(database.db);
	if (conversation.role === "primary") {
		const stalePrimaryRows = executeSqliteQuerySync(database.db, db.selectFrom("session_conversations").select(["conversation_id", "first_seen_at"]).where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef)).rows;
		if (stalePrimaryRows.length > 0) {
			executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values(stalePrimaryRows.map((row) => ({
				session_id: sessionId,
				conversation_id: row.conversation_id,
				role: "related",
				first_seen_at: row.first_seen_at,
				last_seen_at: updatedAt
			}))).onConflict((conflict) => conflict.columns([
				"session_id",
				"conversation_id",
				"role"
			]).doUpdateSet({ last_seen_at: updatedAt })));
			executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("role", "=", "primary").where("conversation_id", "!=", conversation.identity.conversationRef));
		}
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_conversations").where("session_id", "=", sessionId).where("conversation_id", "=", conversation.identity.conversationRef).where("role", "!=", conversation.role));
	executeSqliteQuerySync(database.db, db.insertInto("session_conversations").values({
		session_id: sessionId,
		conversation_id: conversation.identity.conversationRef,
		role: conversation.role,
		first_seen_at: updatedAt,
		last_seen_at: updatedAt
	}).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({ last_seen_at: updatedAt })));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-node-artifacts.ts
function clearSessionCollaborationForKey(database, sessionKey, options = {}) {
	const presentTables = readSessionNodeArtifactTables(database);
	const db = getSessionKysely(database.db);
	if (presentTables.has("session_members")) executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
	if (options.clearSuggestions !== false && presentTables.has("session_suggestions")) executeSqliteQuerySync(database.db, db.deleteFrom("session_suggestions").where("session_key", "=", sessionKey));
}
function rehomeLegacySessionNodeArtifacts(database, legacyKey, canonicalKey, options) {
	const db = getSessionKysely(database.db);
	const presentTables = readSessionNodeArtifactTables(database);
	if (presentTables.has("board_tabs") && presentTables.has("board_widgets")) {
		const tabs = executeSqliteQuerySync(database.db, db.selectFrom("board_tabs").selectAll().where("session_key", "=", legacyKey)).rows;
		for (const tab of tabs) executeSqliteQuerySync(database.db, db.insertInto("board_tabs").values({
			...tab,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
			title: tab.title,
			position: tab.position,
			chat_dock: tab.chat_dock,
			created_by: tab.created_by,
			revision: tab.revision
		}).where("revision", "<", tab.revision)));
		const widgets = executeSqliteQuerySync(database.db, db.selectFrom("board_widgets").selectAll().where("session_key", "=", legacyKey)).rows;
		for (const widget of widgets) executeSqliteQuerySync(database.db, db.insertInto("board_widgets").values({
			...widget,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
			tab_id: widget.tab_id,
			title: widget.title,
			content_kind: widget.content_kind,
			html: widget.html,
			descriptor_json: widget.descriptor_json,
			sha256: widget.sha256,
			view_generation: widget.view_generation,
			revision: widget.revision,
			size_w: widget.size_w,
			size_h: widget.size_h,
			position: widget.position,
			manifest: widget.manifest,
			grant_state: widget.grant_state,
			granted_sha: widget.granted_sha,
			created_by: widget.created_by,
			created_at: widget.created_at,
			updated_at: widget.updated_at
		}).where((eb) => eb.or([eb("revision", "<", widget.revision), eb.and([eb("revision", "=", widget.revision), eb("updated_at", "<", widget.updated_at)])]))));
	}
	if (presentTables.has("heartbeat_outcomes")) {
		const heartbeat = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", legacyKey));
		if (heartbeat) executeSqliteQuerySync(database.db, db.insertInto("heartbeat_outcomes").values({
			...heartbeat,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
			run_session_key: heartbeat.run_session_key,
			outcome: heartbeat.outcome,
			summary: heartbeat.summary,
			response_reason: heartbeat.response_reason,
			priority: heartbeat.priority,
			next_check: heartbeat.next_check,
			task_names_json: heartbeat.task_names_json,
			wake_source: heartbeat.wake_source,
			wake_reason: heartbeat.wake_reason,
			occurred_at: heartbeat.occurred_at,
			context_run_id: heartbeat.context_run_id,
			context_claimed_at: heartbeat.context_claimed_at,
			updated_at: heartbeat.updated_at
		}).where((eb) => eb.or([eb("updated_at", "<", heartbeat.updated_at), eb.and([eb("updated_at", "=", heartbeat.updated_at), eb("occurred_at", "<", heartbeat.occurred_at)])]))));
	}
	if (options.rehomeMembers !== false && presentTables.has("session_members")) {
		const members = executeSqliteQuerySync(database.db, db.selectFrom("session_members").selectAll().where("session_key", "=", legacyKey)).rows;
		for (const member of members) executeSqliteQuerySync(database.db, db.insertInto("session_members").values({
			...member,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()));
	}
	if (presentTables.has("session_suggestions")) executeSqliteQuerySync(database.db, db.updateTable("session_suggestions").set({ session_key: canonicalKey }).where("session_key", "=", legacyKey));
}
/** Copy logical-session artifacts while doctor moves a node between agent databases. */
function copySessionNodeArtifactsForRepair(source, destination, sourceKeys, canonicalKey, options = {}) {
	const keys = [...new Set(sourceKeys)];
	if (keys.length === 0) return;
	const sourceDb = getSessionKysely(source.db);
	const destinationDb = getSessionKysely(destination.db);
	const sourceKeyReferences = new Set(keys.flatMap((key) => [key, key.trim()]));
	const sourceTables = readSessionNodeArtifactTables(source);
	const destinationTables = readSessionNodeArtifactTables(destination);
	if (sourceTables.has("board_tabs") && sourceTables.has("board_widgets") && destinationTables.has("board_tabs") && destinationTables.has("board_widgets")) {
		for (const tab of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_tabs").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_tabs").values({
			...tab,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
			title: tab.title,
			position: tab.position,
			chat_dock: tab.chat_dock,
			created_by: tab.created_by,
			revision: tab.revision
		}).where("revision", "<", tab.revision)));
		for (const widget of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_widgets").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_widgets").values({
			...widget,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
			...widget,
			session_key: canonicalKey
		}).where((eb) => eb.or([eb("revision", "<", widget.revision), eb.and([eb("revision", "=", widget.revision), eb("updated_at", "<", widget.updated_at)])]))));
	}
	if (options.includeMembers !== false && sourceTables.has("session_members") && destinationTables.has("session_members")) for (const member of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_members").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_members").values({
		...member,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()));
	if (sourceTables.has("session_suggestions") && destinationTables.has("session_suggestions")) if (source.db === destination.db) executeSqliteQuerySync(destination.db, destinationDb.updateTable("session_suggestions").set({ session_key: canonicalKey }).where("session_key", "in", keys));
	else for (const suggestion of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_suggestions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_suggestions").values({
		...suggestion,
		session_key: canonicalKey
	}).onConflict((conflict) => conflict.column("id").doNothing()));
	if (sourceTables.has("heartbeat_outcomes") && destinationTables.has("heartbeat_outcomes")) for (const heartbeat of executeSqliteQuerySync(source.db, sourceDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("heartbeat_outcomes").values({
		...heartbeat,
		session_key: canonicalKey,
		run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
		...heartbeat,
		session_key: canonicalKey,
		run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
	}).where((eb) => eb.or([eb("updated_at", "<", heartbeat.updated_at), eb.and([eb("updated_at", "=", heartbeat.updated_at), eb("occurred_at", "<", heartbeat.occurred_at)])]))));
}
/** Membership is authorization state; canonical repair replaces it from the selected winner. */
function deleteSessionMembersForRepair(database, sessionKey) {
	if (!readSessionNodeArtifactTables(database).has("session_members")) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
}
function deleteSessionDeliveryArtifacts(database, sessionKey, additionalKeys = []) {
	const db = getSessionKysely(database.db);
	const trimmedKey = sessionKey.trim();
	const lookupKeys = uniqueStrings([
		sessionKey,
		trimmedKey,
		normalizeStoreSessionKey(trimmedKey),
		...additionalKeys
	]);
	const competingIdentities = new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => row.session_key === sessionKey ? [] : [normalizeStoreSessionKey(row.session_key.trim())]));
	const sessionKeys = lookupKeys.filter((key) => key === sessionKey || !competingIdentities.has(normalizeStoreSessionKey(key.trim())));
	executeSqliteQuerySync(database.db, db.deleteFrom("conversation_deliveries").where("source_session_key", "in", sessionKeys));
}
function deleteSessionNodeArtifacts(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const presentTables = readSessionNodeArtifactTables(database);
	if (presentTables.has("board_tabs") && presentTables.has("board_widgets")) {
		executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", sessionKey));
		executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", sessionKey));
	}
	if (presentTables.has("heartbeat_outcomes")) executeSqliteQuerySync(database.db, db.deleteFrom("heartbeat_outcomes").where("session_key", "=", sessionKey));
	clearSessionCollaborationForKey(database, sessionKey);
}
function readSessionNodeArtifactTables(database) {
	const db = getSessionKysely(database.db);
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", [
		"board_tabs",
		"board_widgets",
		"heartbeat_outcomes",
		"session_members",
		"session_suggestions"
	])).rows.flatMap((row) => row.name ? [row.name] : []));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-provenance.ts
function bindSessionEntryProvenance(entry) {
	const hookSource = entry.hookExternalContentSource;
	return {
		session_entry_provenance: 1,
		acp_owned: entry.acp ? 1 : 0,
		plugin_owner_id: typeof entry.pluginOwnerId === "string" && entry.pluginOwnerId.trim() ? entry.pluginOwnerId.trim() : null,
		hook_external_content_source: hookSource === "gmail" || hookSource === "webhook" ? hookSource : null
	};
}
function resolveSessionEntryProvenanceRow(params) {
	const db = getNodeSqliteKysely(params.database.db);
	const existingRoot = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.entry.sessionId));
	const hasTranscript = Boolean(executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1)));
	if (existingRoot?.session_entry_provenance === 0 && (params.previousEntry?.sessionId === params.entry.sessionId || hasTranscript)) return {
		...params.boundSessionRow,
		session_entry_provenance: 0,
		acp_owned: 0,
		plugin_owner_id: null,
		hook_external_content_source: null
	};
	return existingRoot?.session_entry_provenance === 1 ? {
		...params.boundSessionRow,
		acp_owned: existingRoot.acp_owned === 1 ? 1 : params.boundSessionRow.acp_owned,
		plugin_owner_id: params.boundSessionRow.plugin_owner_id ?? existingRoot.plugin_owner_id,
		hook_external_content_source: params.boundSessionRow.hook_external_content_source ?? existingRoot.hook_external_content_source
	} : params.boundSessionRow;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-references.ts
/** Every transcript generation retained by one canonical logical-session record. */
function collectSessionStateIdsForEntry(entry) {
	const sessionIds = [];
	const add = (sessionId) => {
		const normalized = sessionId?.trim();
		if (normalized) sessionIds.push(normalized);
	};
	add(entry.sessionId);
	add(entry.previousSessionId);
	for (const sessionId of entry.usageFamilySessionIds ?? []) add(sessionId);
	for (const checkpoint of entry.compactionCheckpoints ?? []) {
		add(checkpoint.sessionId);
		add(checkpoint.preCompaction.sessionId);
		add(checkpoint.postCompaction.sessionId);
	}
	return uniqueStrings(sessionIds);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-normalize.ts
function createFallbackSessionEntry(patch) {
	const now = Date.now();
	return {
		sessionId: patch.sessionId ?? randomUUID(),
		updatedAt: patch.updatedAt ?? now,
		...patch
	};
}
function normalizeText(value) {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function normalizeSessionRowChatType(value) {
	if (value === "direct" || value === "group" || value === "channel") return value;
	return null;
}
function coerceSqliteNumber(value) {
	return typeof value === "bigint" ? Number(value) : value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-session-row.ts
function normalizeSessionEntryTimestamp(entry) {
	const raw = entry;
	const hasLegacyDeliveryFields = [
		"route",
		"deliveryContext",
		"origin",
		"channel",
		"lastChannel",
		"lastTo",
		"lastAccountId",
		"lastThreadId"
	].some((key) => key in raw);
	const delivery = entry.delivery ?? (hasLegacyDeliveryFields ? void 0 : { kind: "none" });
	if (typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)) {
		if (entry.delivery === delivery) return entry;
		return delivery ? {
			...entry,
			delivery
		} : entry;
	}
	const updatedAt = typeof entry.sessionStartedAt === "number" && Number.isFinite(entry.sessionStartedAt) ? entry.sessionStartedAt : Date.now();
	return delivery ? {
		...entry,
		delivery,
		updatedAt
	} : {
		...entry,
		updatedAt
	};
}
function bindSessionRoot(params) {
	const updatedAt = Number.isFinite(params.entry.updatedAt) ? params.entry.updatedAt : params.updatedAt;
	return {
		session_id: params.entry.sessionId,
		session_key: params.sessionKey,
		reason: null,
		created_at: resolveSqliteSessionCreatedAt(params.entry, updatedAt),
		updated_at: updatedAt,
		...bindSessionEntryProvenance(params.entry),
		...bindSessionWindowEntryProjection(params),
		primary_conversation_id: null
	};
}
function bindSessionWindowEntryProjection(params) {
	return {
		previous_session_id: normalizeText(params.entry.previousSessionId),
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeStatus(params.entry.status),
		chat_type: normalizeSessionRowChatType(params.entry.chatType),
		channel: resolveSqliteSessionChannel(params.entry),
		account_id: resolveSqliteSessionAccountId(params.entry),
		model_provider: normalizeText(params.entry.modelProvider),
		model: normalizeText(params.entry.model),
		agent_harness_id: normalizeText(params.entry.agentHarnessId),
		parent_session_key: normalizeText(params.entry.parentSessionKey),
		spawned_by: normalizeText(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
/** Project the canonical entry blob into the logical-node query columns. */
function bindSessionNode(params) {
	const canonicalEntry = projectCanonicalSessionEntryShape(params.entry);
	const actor = params.entry.createdActor;
	const legacyActorId = normalizeText(params.entry.createdBy?.id);
	return {
		session_key: params.sessionKey,
		current_session_id: params.entry.sessionId,
		entry_json: JSON.stringify(canonicalEntry),
		entry_valid: 1,
		updated_at: params.updatedAt,
		status: normalizeStatus(params.entry.status),
		created_at: finiteSqliteNumber(params.entry.createdAt),
		created_via: normalizeSqliteCreatedVia(params.entry.createdVia),
		created_actor_type: normalizeSqliteCreatedActorType(actor?.type) ?? (legacyActorId ? "human" : null),
		created_actor_id: normalizeText(actor?.id) ?? legacyActorId,
		project_id: normalizeText(params.entry.projectId),
		parent_session_key: normalizeText(params.entry.parentSessionKey) ?? normalizeText(params.entry.spawnedBy),
		spawned_by: normalizeText(params.entry.spawnedBy),
		fork_source_session_key: normalizeText(params.entry.forkSource?.sessionKey),
		fork_source_session_id: normalizeText(params.entry.forkSource?.sessionId),
		fork_source_entry_id: normalizeText(params.entry.forkSource?.entryId),
		label: normalizeText(params.entry.label),
		display_name: normalizeText(params.entry.displayName),
		category: normalizeText(params.entry.category),
		icon: null,
		pinned_at: finiteSqliteNumber(params.entry.pinnedAt),
		archived_at: finiteSqliteNumber(params.entry.archivedAt),
		last_read_at: finiteSqliteNumber(params.entry.lastReadAt),
		last_interaction_at: finiteSqliteNumber(params.entry.lastInteractionAt),
		last_activity_at: finiteSqliteNumber(params.entry.lastActivityAt)
	};
}
function normalizeSqliteCreatedVia(value) {
	return value === "operator" || value === "spawn" || value === "channel" || value === "cron" || value === "talk" || value === "run" || value === "plugin" || value === "internal" ? value : null;
}
function normalizeSqliteCreatedActorType(value) {
	return value === "human" || value === "agent" || value === "system" ? value : null;
}
function resolveSqliteSessionScope(entry, sessionKey) {
	const chatType = normalizeSessionRowChatType(entry.chatType);
	const normalizedKey = sessionKey.trim().toLowerCase();
	if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main"))) return "shared-main";
	if (chatType === "group" || chatType === "channel") return chatType;
	return "conversation";
}
function resolveSqliteSessionCreatedAt(entry, updatedAt) {
	for (const candidate of [
		entry.sessionStartedAt,
		entry.startedAt,
		entry.updatedAt,
		updatedAt
	]) if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) return candidate;
	return updatedAt;
}
function finiteSqliteNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function resolveSqliteSessionChannel(entry) {
	return normalizeText(sessionDeliveryChannel(entry));
}
function resolveSqliteSessionAccountId(entry) {
	return normalizeText(deliveryContextFromSession(entry)?.accountId);
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeText(entry.displayName) ?? normalizeText(entry.label) ?? normalizeText(entry.subject) ?? normalizeText(entry.groupId);
}
//#endregion
//#region src/config/sessions/session-canonical-key.ts
const SESSION_CANONICAL_KEY_REPAIR_COMMAND = "openclaw doctor --fix";
const validatedDatabases = /* @__PURE__ */ new WeakSet();
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run ${SESSION_CANONICAL_KEY_REPAIR_COMMAND}`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
function isCanonicalSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed || sessionKey !== trimmed) return false;
	if (normalizeStoreSessionKey(sessionKey) !== sessionKey) return false;
	const parsed = parseAgentSessionKey(trimmed);
	return trimmed === "global" || trimmed === "unknown" || parsed !== null && trimmed.startsWith(`agent:${parsed.agentId}:`);
}
function assertCanonicalSessionKeyWrite(sessionKey, expectedAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!isCanonicalSessionKey(sessionKey) || expectedAgentId && parsed && parsed.agentId !== normalizeAgentId(expectedAgentId)) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function readCanonicalSessionMainKey(database) {
	const db = getNodeSqliteKysely(database.db);
	return normalizeMainKey(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key);
}
function assertCanonicalSessionMainKeyWrite(sessionKey, mainKey) {
	if (parseAgentSessionKey(sessionKey)?.rest === "main" && mainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
}
function assertCanonicalSessionEntryLineageWrite(database, entry) {
	const sessionKeys = [
		entry.parentSessionKey,
		entry.spawnedBy,
		entry.forkSource?.sessionKey
	].filter((sessionKey) => sessionKey !== void 0);
	if (sessionKeys.length === 0) return;
	const mainKey = readCanonicalSessionMainKey(database);
	for (const sessionKey of sessionKeys) {
		assertCanonicalSessionKeyWrite(sessionKey);
		assertCanonicalSessionMainKeyWrite(sessionKey, mainKey);
	}
}
function assertCanonicalSessionKeyWriteMatchesDatabase(database, sessionKey) {
	assertCanonicalSessionKeyWrite(sessionKey);
	assertCanonicalSessionMainKeyWrite(sessionKey, readCanonicalSessionMainKey(database));
}
function canonicalSessionKeyMigrationRequiredError(detail) {
	return new SessionCanonicalKeyMigrationRequiredError(detail);
}
function assertCanonicalSqliteSessionKeysCurrent(database, mainKey) {
	if (validatedDatabases.has(database.db)) return;
	const db = getNodeSqliteKysely(database.db);
	const storedMainKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key;
	const canonicalMainKey = normalizeMainKey(mainKey ?? storedMainKey);
	for (const row of executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").leftJoin("session_windows as retained_window", (join) => join.onRef("retained_window.session_id", "=", "session_nodes.current_session_id").onRef("retained_window.session_key", "=", "session_nodes.session_key")).select([
		"session_nodes.session_key",
		"session_nodes.current_session_id",
		"session_nodes.entry_json",
		"session_nodes.entry_valid",
		"session_nodes.fork_source_session_key",
		"session_nodes.parent_session_key",
		"session_nodes.spawned_by",
		"retained_window.session_id as retained_window_id"
	])).rows) {
		if (row.entry_json === "{}" && row.entry_valid === -1 && row.retained_window_id === row.current_session_id) continue;
		if (row.entry_valid !== 1) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const record = parseSqliteSessionEntryRecord(row);
		if (!record) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const entry = projectCanonicalSessionEntryShape(record);
		if ((row.parent_session_key ?? void 0) !== (entry.parentSessionKey ?? entry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (entry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (entry.forkSource?.sessionKey ?? void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry);
		if (deliveryCanonicalKey !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		const trimmed = row.session_key.trim();
		const parsed = parseAgentSessionKey(trimmed);
		if (row.session_key !== trimmed || normalizeStoreSessionKey(trimmed) !== trimmed || !parsed && trimmed !== "global" && trimmed !== "unknown" || parsed && parsed.rest === "main" && canonicalMainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${trimmed || row.session_key}`);
		for (const lineageKey of [
			row.parent_session_key,
			row.spawned_by,
			row.fork_source_session_key
		]) {
			if (!lineageKey) continue;
			const normalized = normalizeStoreSessionKey(lineageKey);
			const lineageParsed = parseAgentSessionKey(normalized);
			if (normalized !== lineageKey || !lineageParsed && normalized !== "global" && normalized !== "unknown" || lineageParsed?.rest === "main" && canonicalMainKey !== "main") throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${normalized || lineageKey}`);
		}
	}
	validatedDatabases.add(database.db);
}
function setCanonicalSqliteSessionMainKey(database, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey) return;
	executeSqliteQuerySync(database.db, db.insertInto("session_key_contract").values({
		id: 1,
		main_key: canonicalMainKey,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		main_key: canonicalMainKey,
		updated_at: Date.now()
	})));
	validatedDatabases.delete(database.db);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-state.ts
function createTranscriptGeneration() {
	return randomUUID().replaceAll("-", "");
}
/** Read the current raw transcript generation inside the caller's transaction. */
function readTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation;
}
/** Materialize a generation once; pure appends must preserve an existing token. */
function ensureTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doNothing()));
	return readTranscriptGenerationInTransaction(database, sessionId) ?? generation;
}
/** Rotate the watermark in the same transaction as destructive transcript replacement. */
function rotateTranscriptGenerationInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const generation = createTranscriptGeneration();
	executeSqliteQuerySync(database.db, db.insertInto("transcript_rewrite_watermarks").values({
		session_id: sessionId,
		generation,
		updated_at: Date.now()
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		generation,
		updated_at: Date.now()
	})));
	return generation;
}
function ensureTranscriptSessionRoot(database, scope, updatedAt, options = {}) {
	const db = getSessionKysely(database.db);
	if (!options.allowStoredAlias) {
		assertCanonicalSqliteSessionKeysCurrent(database);
		assertCanonicalSessionKeyWriteMatchesDatabase(database, scope.sessionKey);
		const persistedSessionKey = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", scope.sessionId))?.session_key;
		if (persistedSessionKey && persistedSessionKey !== scope.sessionKey) throw new Error(`Transcript session ${scope.sessionId} is owned by ${persistedSessionKey}, not ${scope.sessionKey}; resolve the transcript target again before retrying.`);
		const lookupKeys = uniqueStrings([scope.sessionKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(scope.sessionKey))]);
		const candidates = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
			"current_session_id",
			"entry_json",
			"entry_valid",
			"session_key",
			"updated_at"
		]).where("session_key", "in", lookupKeys)).rows;
		for (const candidate of candidates) {
			const entry = parseSessionEntryJson(candidate);
			if (!entry) {
				if (!(candidate.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", candidate.current_session_id).where("session_key", "=", candidate.session_key)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${candidate.session_key}`);
				continue;
			}
			if (resolveDeliveryProvenCanonicalSessionKey(candidate.session_key, entry) !== candidate.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${candidate.session_key}`);
		}
		const existing = candidates.find((candidate) => candidate.session_key === scope.sessionKey);
		if (existing && existing.entry_valid !== 1) {
			if (!(existing.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", existing.current_session_id).where("session_key", "=", scope.sessionKey)) : void 0)) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${scope.sessionKey}`);
		}
	}
	if ((executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: scope.sessionKey,
		current_session_id: scope.sessionId,
		entry_json: "{}",
		entry_valid: -1,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_key").doNothing())).numAffectedRows ?? 0n) > 0n) {
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", scope.sessionKey));
		publishSessionEntryCacheInvalidation(database);
	}
	executeSqliteQuerySync(database.db, db.insertInto("session_windows").values({
		session_id: scope.sessionId,
		session_key: scope.sessionKey,
		previous_session_id: null,
		reason: null,
		session_scope: "conversation",
		created_at: updatedAt,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ updated_at: updatedAt })));
}
function readNextTranscriptSeq(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId));
	return (row?.max_seq === null || row?.max_seq === void 0 ? -1 : coerceSqliteNumber(row.max_seq)) + 1;
}
function normalizeTranscriptMutationAtMs(value) {
	const timestamp = Math.floor(value);
	return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : void 0;
}
function readTranscriptMutationStateInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", sessionId));
	return {
		observedAt: row?.transcript_observed_at ?? null,
		updatedAt: row?.transcript_updated_at ?? null
	};
}
function advanceTranscriptMutationAtInTransaction(database, sessionId, value, options = {}) {
	const transcriptUpdatedAt = normalizeTranscriptMutationAtMs(value);
	if (transcriptUpdatedAt === void 0) return;
	const state = readTranscriptMutationStateInTransaction(database, sessionId);
	const next = options.strictly ? Math.max(transcriptUpdatedAt, (state.updatedAt ?? -1) + 1, (state.observedAt ?? -1) + 1) : Math.max(transcriptUpdatedAt, state.updatedAt ?? 0);
	if (state.updatedAt !== null && state.updatedAt >= next) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ transcript_updated_at: next }).where("session_id", "=", sessionId));
}
function touchTranscriptMutationInTransaction(database, sessionId) {
	const now = normalizeTranscriptMutationAtMs(Date.now());
	if (now !== void 0) advanceTranscriptMutationAtInTransaction(database, sessionId, now, { strictly: true });
}
function deleteTranscriptEventsInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.deleteFrom("transcript_event_identities").where("session_id", "=", sessionId));
	const result = executeSqliteQuerySync(database.db, db.deleteFrom("transcript_events").where("session_id", "=", sessionId));
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	return (result.numAffectedRows ?? 0n) > 0n;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-store.ts
function parseReadableSqliteSessionEntryRow(database, row) {
	const record = parseSqliteSessionEntryRecord(row);
	if (record) {
		const entry = projectCanonicalSessionEntryShape(record);
		if (resolveDeliveryProvenCanonicalSessionKey(row.session_key, entry) !== row.session_key) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${row.session_key}`);
		return entry;
	}
	if (row.entry_json === "{}" ? executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key)) : void 0) return null;
	throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${row.session_key}`);
}
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.name = "SqliteSessionMutationConflictError";
	}
};
function readSessionIdentitySnapshot(database, sessionKeys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const sessionKey of uniqueStrings([...sessionKeys].map((key) => key.trim()))) {
		const row = readExactSessionEntryRow(database, sessionKey);
		if (row) snapshot.set(sessionKey, cloneSessionEntry(row.entry));
	}
	return snapshot;
}
function createSessionIdentitySnapshot(rows) {
	return new Map(rows.map((row) => [row.sessionKey, cloneSessionEntry(row.entry)]));
}
function readSessionEntryRow(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readSessionEntryRowUnchecked(database, sessionKey);
}
function readSessionEntryRowUnchecked(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const lookupKeys = collectSessionEntryLookupKeys(database, sessionKey);
	if (lookupKeys.length === 0) return;
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "in", lookupKeys).orderBy("session_key", "asc")).rows;
	let selected;
	for (const row of rows) {
		const entry = parseReadableSqliteSessionEntryRow(database, row);
		if (!entry || row.session_key !== sessionKey.trim()) continue;
		selected = {
			entry,
			legacyKeys: [],
			row
		};
	}
	return selected;
}
function readSessionEntrySelectionSnapshot(database, sessionKey, exact) {
	return {
		selected: exact ? readExactSessionEntryRow(database, sessionKey) : readSessionEntryRow(database, sessionKey),
		selectedRows: collectSessionEntryLookupKeys(database, sessionKey).toSorted().flatMap((candidateKey) => {
			const row = readExactSessionEntryRow(database, candidateKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey: candidateKey
			}] : [];
		})
	};
}
function assertSessionEntrySelectionUnchanged(expected, current, operationLabel) {
	if (!(expected.selected?.row.session_key === current.selected?.row.session_key && sqliteSessionEntriesEqual(expected.selected?.entry, current.selected?.entry)) || !sqliteSessionSnapshotRowsEqual(expected.selectedRows, current.selectedRows)) throw new SqliteSessionMutationConflictError(operationLabel);
}
function readExactSessionEntryRow(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "=", sessionKey));
	if (!row) return;
	const entry = parseReadableSqliteSessionEntryRow(database, row);
	return entry ? {
		entry,
		legacyKeys: [],
		row
	} : void 0;
}
function readExactSessionEntryJsonForCanonicalRepair(database, sessionKey) {
	const db = getSessionKysely(database.db);
	return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("entry_json").where("session_key", "=", sessionKey))?.entry_json;
}
function readExactSessionEntryRowValidated(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	return readExactSessionEntryRow(database, sessionKey);
}
function readSessionEntryStore(database, options = {}) {
	if (options.allowCanonicalRepair !== true) assertCanonicalSqliteSessionKeysCurrent(database);
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"entry_json",
		"session_key",
		"updated_at"
	]).orderBy("session_key")).rows;
	const store = {};
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function readSessionEntryCount(database) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("entry_json")).rows.reduce((count, row) => count + (parseSessionEntryJson(row) ? 1 : 0), 0);
}
function readSessionEntryKeys(database) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["entry_json", "session_key"]).orderBy("session_key", "asc")).rows.flatMap((row) => parseSessionEntryJson(row) ? [row.session_key] : []);
}
function resolveLifecyclePrimaryEntry(database, target, options = {}) {
	const rows = target.storeKeys.flatMap((key) => {
		const sessionKey = key.trim();
		const row = readExactSessionEntryRow(database, sessionKey);
		return row ? [{
			key: sessionKey,
			entry: row.entry
		}] : [];
	});
	if (rows.length > 1) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${target.canonicalKey}`);
	const [row] = rows;
	if (row && row.key !== target.canonicalKey && options.allowCanonicalMove !== true) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${target.canonicalKey}`);
	return row;
}
function readLifecycleTargetSnapshot(database, target, options = {}) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const normalized = normalizeLifecycleTarget(target);
	return {
		primary: resolveLifecyclePrimaryEntry(database, normalized, options),
		rows: normalized.storeKeys.flatMap((sessionKey) => {
			const row = readExactSessionEntryRow(database, sessionKey);
			return row ? [{
				entry: cloneSessionEntry(row.entry),
				sessionKey
			}] : [];
		})
	};
}
function assertLifecycleTargetSnapshotUnchanged(expected, current, operationLabel) {
	if (!(expected.primary?.key === current.primary?.key && sqliteSessionEntriesEqual(expected.primary?.entry, current.primary?.entry)) || !sqliteSessionSnapshotRowsEqual(expected.rows, current.rows)) throw new SqliteSessionMutationConflictError(operationLabel);
}
function normalizeLifecycleTarget(target) {
	const canonicalKey = normalizeSqliteSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeSqliteSessionKey)])
	};
}
function deleteSessionEntryRows(database, sessionKey, options = {}) {
	const db = getSessionKysely(database.db);
	const windows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "=", sessionKey)).rows;
	const survivingNodes = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"entry_json",
		"session_key"
	]).where("session_key", "!=", sessionKey).orderBy("session_key", "asc")).rows;
	for (const window of windows) {
		const survivingNode = survivingNodes.find((node) => {
			if (node.current_session_id === window.session_id) return true;
			const entry = parseSessionEntryJson(node);
			return entry ? collectSessionStateIdsForEntry(entry).includes(window.session_id) : false;
		});
		if (survivingNode) executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: survivingNode.session_key }).where("session_id", "=", window.session_id));
	}
	if (options.deleteOwnedWindows) {
		deleteSessionDeliveryArtifacts(database, sessionKey, options.deliveryCleanupKeys);
		deleteSessionNodeArtifacts(database, sessionKey);
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
		publishSessionEntryCacheInvalidation(database);
		return;
	}
	const remainingWindow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id", "updated_at"]).where("session_key", "=", sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
	if (remainingWindow) {
		deleteSessionNodeArtifacts(database, sessionKey);
		clearSqliteSessionEntryPreservingWindows(database, {
			sessionId: remainingWindow.session_id,
			sessionKey,
			updatedAt: remainingWindow.updated_at
		});
		publishSessionEntryCacheInvalidation(database);
		return;
	}
	executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
	publishSessionEntryCacheInvalidation(database);
}
/** Remove the logical entry while retaining its node-owned transcript windows. */
function clearSqliteSessionEntryPreservingWindows(database, params) {
	const db = getSessionKysely(database.db);
	const cleared = {
		current_session_id: params.sessionId,
		entry_json: "{}",
		entry_valid: -1,
		updated_at: params.updatedAt,
		status: null,
		created_at: null,
		created_via: null,
		created_actor_type: null,
		created_actor_id: null,
		project_id: null,
		parent_session_key: null,
		spawned_by: null,
		fork_source_session_key: null,
		fork_source_session_id: null,
		fork_source_entry_id: null,
		label: null,
		display_name: null,
		category: null,
		icon: null,
		pinned_at: null,
		archived_at: null,
		last_read_at: null,
		last_interaction_at: null,
		last_activity_at: null
	};
	executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: params.sessionKey,
		...cleared
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet(cleared)));
	executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: -1 }).where("session_key", "=", params.sessionKey));
}
function deleteLifecycleTargetRows(database, target) {
	for (const sessionKey of uniqueStrings([target.canonicalKey, ...target.storeKeys])) {
		const trimmed = sessionKey.trim();
		if (trimmed) deleteSessionEntryRows(database, trimmed);
	}
}
function sqliteSessionEntriesEqual(left, right) {
	if (!left || !right) return left === right;
	return JSON.stringify(left) === JSON.stringify(right);
}
function sqliteSessionSnapshotRowsEqual(left, right) {
	return left.length === right.length && left.every((row, index) => row.sessionKey === right[index]?.sessionKey && sqliteSessionEntriesEqual(row.entry, right[index]?.entry));
}
function sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry) {
	const current = resolveLifecyclePrimaryEntry(database, target)?.entry;
	if (!current || !expectedEntry) return current === expectedEntry;
	return sqliteSessionEntriesEqual(current, expectedEntry);
}
function assertLifecycleTargetUnchanged(database, target, expectedEntry, operation) {
	if (sqliteLifecycleTargetMatchesExpectedEntry(database, target, expectedEntry)) return;
	throw new Error(`SQLite session entry changed before ${operation} lifecycle mutation`);
}
function deleteLegacySessionEntryRows(database, legacyKeys, sessionKey, options = {}) {
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const legacyKey of legacyKeys) {
		if (legacyKey === sessionKey) continue;
		rehomeSessionWindows(database, sessionKey, [legacyKey]);
		rehomeLegacySessionNodeArtifacts(database, legacyKey, sessionKey, options);
		executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", legacyKey));
		publishSessionEntryCacheInvalidation(database);
	}
}
/** Move retained generations to the canonical node before removing key aliases. */
function rehomeSessionWindows(database, canonicalKey, previousKeys) {
	const legacyKeys = uniqueStrings([...previousKeys].map((key) => key.trim())).filter((key) => key && key !== canonicalKey);
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: canonicalKey }).where("session_key", "in", legacyKeys));
}
function writeSessionEntry(database, sessionKey, entry, options = {}) {
	const db = getSessionKysely(database.db);
	if (!options.allowStoredAliases) {
		assertCanonicalSessionKeyWriteMatchesDatabase(database, sessionKey);
		assertCanonicalSessionEntryLineageWrite(database, entry);
		if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
	}
	const normalizedEntry = normalizeSessionEntryTimestamp(entry);
	if (!hasValidSessionEntryIdentity(normalizedEntry)) throw new Error("Refusing invalid SQLite session entry identity");
	const updatedAt = normalizedEntry.updatedAt;
	const canonicalPreviousEntry = (options.allowStoredAliases && options.previousEntry !== void 0 ? void 0 : readExactSessionEntryRow(database, sessionKey))?.entry ?? (options.allowStoredAliases && options.previousEntry !== void 0 ? options.previousEntry ?? void 0 : void 0);
	const previousEntry = options.previousEntry === void 0 ? canonicalPreviousEntry : options.previousEntry ?? void 0;
	if (previousEntry && previousEntry.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.visibility;
	if (canonicalPreviousEntry && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId) clearSessionCollaborationForKey(database, sessionKey, { clearSuggestions: options.preserveNodeSuggestions !== true });
	const transcriptObservedAt = readTranscriptMutationStateInTransaction(database, normalizedEntry.sessionId).updatedAt ?? updatedAt;
	const boundSessionRoot = bindSessionRoot({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const conversation = prepareSessionConversation({
		entry: normalizedEntry,
		sessionScope: boundSessionRoot.session_scope
	});
	if (conversation) upsertConversationIdentity(database, conversation.identity, updatedAt);
	const sessionRow = resolveSessionEntryProvenanceRow({
		boundSessionRow: {
			...boundSessionRoot,
			primary_conversation_id: conversation?.role === "primary" ? conversation.identity.conversationRef : null,
			transcript_observed_at: transcriptObservedAt
		},
		database,
		entry: normalizedEntry,
		previousEntry
	});
	const sessionNode = bindSessionNode({
		entry: normalizedEntry,
		sessionKey,
		updatedAt
	});
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values(sessionNode).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
			current_session_id: sessionNode.current_session_id,
			entry_json: sessionNode.entry_json,
			entry_valid: sessionNode.entry_valid,
			updated_at: sessionNode.updated_at,
			status: sessionNode.status,
			created_at: sessionNode.created_at,
			created_via: sessionNode.created_via,
			created_actor_type: sessionNode.created_actor_type,
			created_actor_id: sessionNode.created_actor_id,
			project_id: sessionNode.project_id,
			parent_session_key: sessionNode.parent_session_key,
			spawned_by: sessionNode.spawned_by,
			fork_source_session_key: sessionNode.fork_source_session_key,
			fork_source_session_id: sessionNode.fork_source_session_id,
			fork_source_entry_id: sessionNode.fork_source_entry_id,
			label: sessionNode.label,
			display_name: sessionNode.display_name,
			category: sessionNode.category,
			icon: null,
			pinned_at: sessionNode.pinned_at,
			archived_at: sessionNode.archived_at,
			last_read_at: sessionNode.last_read_at,
			last_interaction_at: sessionNode.last_interaction_at,
			last_activity_at: sessionNode.last_activity_at
		})));
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", sessionKey));
	});
	executeSqliteQuerySync(database.db, db.insertInto("session_windows").values(sessionRow).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		session_key: sessionKey,
		previous_session_id: sessionRow.previous_session_id,
		reason: sessionRow.reason,
		session_scope: sessionRow.session_scope,
		transcript_observed_at: transcriptObservedAt,
		session_entry_provenance: sessionRow.session_entry_provenance,
		acp_owned: sessionRow.acp_owned,
		plugin_owner_id: sessionRow.plugin_owner_id,
		hook_external_content_source: sessionRow.hook_external_content_source,
		updated_at: updatedAt,
		started_at: sessionRow.started_at,
		ended_at: sessionRow.ended_at,
		status: sessionRow.status,
		chat_type: sessionRow.chat_type,
		channel: sessionRow.channel,
		account_id: sessionRow.account_id,
		primary_conversation_id: sessionRow.primary_conversation_id,
		model_provider: sessionRow.model_provider,
		model: sessionRow.model,
		agent_harness_id: sessionRow.agent_harness_id,
		parent_session_key: sessionRow.parent_session_key,
		spawned_by: sessionRow.spawned_by,
		display_name: sessionRow.display_name
	})));
	if (conversation) linkSessionConversation({
		database,
		sessionId: sessionRow.session_id,
		conversation,
		updatedAt
	});
	publishSessionEntryCacheInvalidation(database, sessionNode, writeGeneration);
}
/** Resolves the parent fork decision using SQLite transcript rows when totals are stale. */
//#endregion
//#region src/agents/session-dirs.ts
/**
* Agent session directory discovery helpers.
* Lists per-agent `sessions` directories under state roots in sorted order for
* callers that scan persisted session stores.
*/
function mapAgentSessionDirs(agentsDir, entries) {
	return entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(agentsDir, entry.name, "sessions")).toSorted((a, b) => a.localeCompare(b));
}
/** Synchronous variant of per-agent session directory discovery. */
function resolveAgentSessionDirsFromAgentsDirSync(agentsDir) {
	let entries;
	try {
		entries = fs.readdirSync(agentsDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") return [];
		throw err;
	}
	return mapAgentSessionDirs(agentsDir, entries);
}
/** Lists per-agent session directories under a state directory. */
async function resolveAgentSessionDirs(stateDir) {
	const agentsDir = path.join(stateDir, "agents");
	let entries;
	try {
		entries = await fs$1.readdir(agentsDir, { withFileTypes: true });
	} catch (err) {
		if (err.code === "ENOENT") return [];
		throw err;
	}
	return mapAgentSessionDirs(agentsDir, entries);
}
//#endregion
//#region src/config/sessions/targets-collision.ts
const log = createSubsystemLogger("sessions/targets");
function dedupeSessionStoreTargetsBySqliteTarget(targets, options) {
	const registeredDatabases = listOpenClawRegisteredAgentDatabases({ env: options.env });
	const grouped = /* @__PURE__ */ new Map();
	const logicalGroups = /* @__PURE__ */ new Map();
	const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
	const resolvePhysicalGroupKey = (groups, pathname) => [...groups.keys()].find((candidate) => isSameDatabasePath(candidate, pathname)) ?? path.resolve(pathname);
	for (const target of targets) {
		const resolvedUnsuffixedPath = path.resolve(resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).path ?? target.storePath);
		const resolved = resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			defaultAgentId: options.defaultAgentId,
			env: options.env,
			registeredDatabases,
			isSameDatabasePath
		});
		const sqlitePath = resolvePhysicalGroupKey(grouped, resolved.path ?? target.storePath);
		const group = grouped.get(sqlitePath) ?? [];
		group.push({
			target,
			shared: resolved.shared === true,
			...resolved.agentId ? { databaseOwnerAgentId: normalizeAgentId(resolved.agentId) } : {}
		});
		grouped.set(sqlitePath, group);
		const unsuffixedPath = resolvePhysicalGroupKey(logicalGroups, resolvedUnsuffixedPath);
		const logicalGroup = logicalGroups.get(unsuffixedPath) ?? [];
		logicalGroup.push({
			target,
			...resolved.ownerSource ? { ownerSource: resolved.ownerSource } : {},
			...resolved.unsuffixedOwnerAgentId ? { unsuffixedOwnerAgentId: resolved.unsuffixedOwnerAgentId } : {}
		});
		logicalGroups.set(unsuffixedPath, logicalGroup);
	}
	for (const [sqlitePath, group] of logicalGroups) {
		const agentIds = [...new Set(group.map(({ target }) => normalizeAgentId(target.agentId)))];
		if (agentIds.length <= 1 || group.some((entry) => !entry.ownerSource)) continue;
		const ownerAgentId = group[0]?.unsuffixedOwnerAgentId;
		const ownerSource = group[0]?.ownerSource ?? "configured-default";
		const ignoredAgentIds = ownerAgentId ? agentIds.filter((agentId) => agentId !== ownerAgentId) : agentIds;
		const diagnostic = {
			message: ownerAgentId ? `Session store target collision at ${sqlitePath}: owner "${ownerAgentId}" selected by ${ownerSource}; suffixed owner(s): ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : ownerSource === "registered-suffixed" ? `Session store target collision at ${sqlitePath}: configured default retains its registered suffixed target; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : ownerSource === "occupied-unsuffixed" ? `Session store target collision at ${sqlitePath}: unsuffixed target is occupied without a durable owner; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.` : `Session store target collision at ${sqlitePath}: registry ownership is ambiguous; all claimant(s) use suffixed targets: ${ignoredAgentIds.map((id) => `"${id}"`).join(", ")}.`,
			sqlitePath,
			...ownerAgentId ? { ownerAgentId } : {},
			ignoredAgentIds,
			ownerSource
		};
		if (options.onDiagnostic) options.onDiagnostic(diagnostic);
		else log.warn(diagnostic.message);
	}
	const deduped = [];
	for (const [sqlitePath, group] of grouped) {
		const byAgentId = new Map(group.map(({ target }) => [normalizeAgentId(target.agentId), target]));
		const registeredOwners = [...new Set(registeredDatabases.filter((entry) => isSameDatabasePath(entry.path, sqlitePath)).map((entry) => normalizeAgentId(entry.agentId)))];
		const pathOwners = [...new Set(group.flatMap((entry) => entry.databaseOwnerAgentId ?? []))];
		const collision = byAgentId.size > 1;
		if (pathOwners.length !== 1 && registeredOwners.length > 1) {
			const diagnostic = {
				message: `Session store target collision at ${sqlitePath}: registry ownership is ambiguous across ${registeredOwners.map((id) => `"${id}"`).join(", ")}; no owner selected.`,
				sqlitePath,
				ignoredAgentIds: [...byAgentId.keys()],
				ownerSource: "ambiguous-registry"
			};
			if (options.onDiagnostic) options.onDiagnostic(diagnostic);
			else log.warn(diagnostic.message);
			continue;
		}
		const ownerSource = pathOwners.length === 1 ? "database-path" : registeredOwners.length === 1 ? "database-registry" : "configured-default";
		const ownerAgentId = normalizeAgentId(pathOwners[0] ?? registeredOwners[0] ?? (collision ? options.defaultAgentId : group[0].target.agentId));
		const selected = byAgentId.get(ownerAgentId) ?? (group.some((entry) => entry.shared) ? byAgentId.get(normalizeAgentId(options.defaultAgentId)) ?? group[0]?.target : void 0);
		if (selected) deduped.push(selected);
		const selectedAgentId = selected ? normalizeAgentId(selected.agentId) : ownerAgentId;
		const ignoredAgentIds = [...byAgentId.keys()].filter((agentId) => agentId !== selectedAgentId);
		if (!selected || ignoredAgentIds.length > 0) {
			const effectiveIgnoredAgentIds = selected ? ignoredAgentIds : [...byAgentId.keys()];
			const diagnostic = {
				message: `Session store target collision at ${sqlitePath}: owner "${ownerAgentId}" selected by ${ownerSource}; ignored owner(s): ${effectiveIgnoredAgentIds.map((id) => `"${id}"`).join(", ")}.`,
				sqlitePath,
				ownerAgentId,
				ignoredAgentIds: effectiveIgnoredAgentIds,
				ownerSource
			};
			if (options.onDiagnostic) options.onDiagnostic(diagnostic);
			else log.warn(diagnostic.message);
		}
	}
	return deduped;
}
//#endregion
//#region src/config/sessions/targets-path-validation.ts
const NON_FATAL_DISCOVERY_ERROR_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"ELOOP",
	"ENOENT",
	"ENOTDIR",
	"EPERM",
	"ESTALE"
]);
function dedupeTargetsByStorePath(targets) {
	const deduped = /* @__PURE__ */ new Map();
	for (const target of targets) if (!deduped.has(target.storePath)) deduped.set(target.storePath, target);
	return [...deduped.values()];
}
function shouldSkipDiscoveryError(err) {
	const code = err?.code;
	return typeof code === "string" && NON_FATAL_DISCOVERY_ERROR_CODES.has(code);
}
function isWithinRoot(realPath, realRoot) {
	return realPath === realRoot || realPath.startsWith(`${realRoot}${path.sep}`);
}
function shouldSkipDiscoveredAgentDirName(dirName, agentId) {
	return !/[a-z0-9]/i.test(dirName) || !isValidAgentId(agentId) || agentId === "main" && dirName.toLowerCase() !== "main";
}
function resolveValidatedManagedFilePathSync(params) {
	try {
		const stat = fs.lstatSync(params.filePath);
		if (stat.isSymbolicLink() || !stat.isFile()) return;
		return isWithinRoot(fs.realpathSync.native(params.filePath), params.realAgentsRoot ?? fs.realpathSync.native(params.agentsRoot)) ? params.filePath : void 0;
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) return;
		throw err;
	}
}
//#endregion
//#region src/config/sessions/targets.ts
/** Lists agent ids whose session stores should be considered configured. */
function listConfiguredSessionStoreAgentIds(cfg) {
	const ids = new Set(listAgentIds(cfg).map((agentId) => normalizeAgentId(agentId)));
	const addAcpAgentId = (agentId) => {
		const raw = agentId?.trim() ?? "";
		if (!raw || raw === "*") return;
		const normalized = normalizeAgentId(raw);
		ids.add(normalized);
	};
	addAcpAgentId(cfg.acp?.defaultAgent);
	for (const agentId of cfg.acp?.allowedAgents ?? []) addAcpAgentId(agentId);
	for (const agent of listAgentEntries(cfg)) if (agent.runtime?.type === "acp") addAcpAgentId(agent.runtime.acp?.agent ?? agent.id);
	return [...ids];
}
/** Lists configured owners plus persisted owners whose registered DB still matches this store. */
function listKnownSessionStoreAgentIds(cfg, params = {}) {
	const env = params.env ?? process.env;
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
	const ids = new Set(listConfiguredSessionStoreAgentIds(cfg));
	if (!isPerAgentSessionStoreConfig(cfg.session?.store)) {
		const storePath = resolveSessionStorePathCore(cfg.session?.store, {
			agentId: defaultAgentId,
			env
		});
		const durableTarget = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: defaultAgentId,
			defaultAgentId,
			env,
			isSameDatabasePath
		});
		if (durableTarget.unsuffixedOwnerAgentId) ids.add(normalizeAgentId(durableTarget.unsuffixedOwnerAgentId));
		else if (durableTarget.ownerSource === "database-path" && durableTarget.agentId) ids.add(normalizeAgentId(durableTarget.agentId));
		for (const durableOwner of listDurableSqliteTargetOwnersForSessionStorePath(storePath)) ids.add(normalizeAgentId(durableOwner));
		if (durableTarget.shared && durableTarget.agentId && fs.existsSync(durableTarget.path)) try {
			const logicalOwners = withOpenClawAgentDatabaseReadOnly((database) => readSessionEntryKeys(database).flatMap((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				return parsed ? [normalizeAgentId(parsed.agentId)] : [];
			}), {
				agentId: durableTarget.agentId,
				env,
				path: durableTarget.path
			});
			if (logicalOwners.found) for (const logicalOwner of logicalOwners.value) ids.add(logicalOwner);
		} catch {}
	}
	for (const registered of listOpenClawRegisteredAgentDatabases({ env })) {
		const agentId = normalizeAgentId(registered.agentId);
		const expectedPath = resolveSqliteTargetFromSessionStorePath(resolveSessionStorePathCore(cfg.session?.store, {
			agentId,
			env
		}), {
			agentId,
			defaultAgentId,
			env,
			isSameDatabasePath
		}).path;
		if (isSameDatabasePath(registered.path, expectedPath)) ids.add(agentId);
	}
	return [...ids];
}
/** Checks whether an agent is configured to own a session store. */
function isConfiguredSessionStoreAgentId(cfg, agentId) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return listConfiguredSessionStoreAgentIds(cfg).includes(normalizedAgentId);
}
function resolveValidatedDiscoveredStorePathSync(params) {
	const storePath = path.join(params.sessionsDir, "sessions.json");
	const validatedStorePath = resolveValidatedManagedFilePathSync({
		agentsRoot: params.agentsRoot,
		filePath: storePath,
		realAgentsRoot: params.realAgentsRoot
	});
	if (validatedStorePath) return validatedStorePath;
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath).path;
	if (!sqlitePath) return;
	return resolveValidatedManagedFilePathSync({
		agentsRoot: params.agentsRoot,
		filePath: sqlitePath,
		realAgentsRoot: params.realAgentsRoot
	}) ? storePath : void 0;
}
function resolveValidatedExistingSessionStoreTargetSync(target) {
	const sqlitePath = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
	if (!sqlitePath) return;
	const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
	if (!agentsRoot) return fs.existsSync(sqlitePath) ? target : void 0;
	return resolveValidatedManagedFilePathSync({
		agentsRoot,
		filePath: sqlitePath
	}) ? target : void 0;
}
function isValidatedRecoveryCandidateSessionsDir(params) {
	const agentDir = path.dirname(params.sessionsDir);
	try {
		const agentStat = fs.lstatSync(agentDir);
		if (agentStat.isSymbolicLink() || !agentStat.isDirectory()) return false;
		if (!isWithinRoot(fs.realpathSync.native(agentDir), params.realAgentsRoot)) return false;
		try {
			const sessionsStat = fs.lstatSync(params.sessionsDir);
			return !sessionsStat.isSymbolicLink() && sessionsStat.isDirectory() && isWithinRoot(fs.realpathSync.native(params.sessionsDir), params.realAgentsRoot);
		} catch (err) {
			return err.code === "ENOENT";
		}
	} catch (err) {
		if (err.code === "ENOENT") return params.allowMissingAgentDir === true;
		if (shouldSkipDiscoveryError(err)) return false;
		throw err;
	}
}
function resolveSessionStoreDiscoveryState(cfg, env) {
	const configuredTargets = resolveSessionStoreTargets(cfg, { allAgents: true }, { env });
	const agentsRoots = /* @__PURE__ */ new Set();
	for (const target of configuredTargets) {
		const agentsDir = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (agentsDir) agentsRoots.add(agentsDir);
	}
	agentsRoots.add(path.join(resolveStateDir(env), "agents"));
	return {
		configuredTargets,
		agentsRoots: [...agentsRoots]
	};
}
function toDiscoveredSessionStoreTarget(sessionsDir, storePath) {
	const dirName = path.basename(path.dirname(sessionsDir));
	const agentId = normalizeAgentId(dirName);
	if (shouldSkipDiscoveredAgentDirName(dirName, agentId)) return;
	return {
		agentId,
		storePath
	};
}
function resolveExplicitSessionStoreTarget(params) {
	const storePath = resolveSessionStorePathCore(params.store, {
		agentId: params.defaultAgentId,
		env: params.env
	});
	return (resolveAgentsDirFromSessionStorePath(storePath) ? toDiscoveredSessionStoreTarget(path.dirname(storePath), storePath) : void 0) ?? {
		agentId: params.defaultAgentId,
		storePath
	};
}
/** Resolves all configured and discoverable agent session stores synchronously. */
function resolveAllAgentSessionStoreTargetsSync(cfg, params = {}) {
	const env = params.env ?? process.env;
	const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env);
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		const cached = realAgentsRoots.get(agentsRoot);
		if (cached !== void 0) return cached;
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return;
			throw err;
		}
	};
	const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (!agentsRoot) return [target];
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) return [];
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(target.storePath),
			agentsRoot,
			realAgentsRoot
		});
		return validatedStorePath ? [{
			...target,
			storePath: validatedStorePath
		}] : [];
	});
	const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
		try {
			const realAgentsRoot = getRealAgentsRoot(agentsDir);
			if (!realAgentsRoot) return [];
			return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
				const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
					sessionsDir,
					agentsRoot: agentsDir,
					realAgentsRoot
				});
				const target = validatedStorePath ? toDiscoveredSessionStoreTarget(sessionsDir, validatedStorePath) : void 0;
				return target ? [target] : [];
			});
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return [];
			throw err;
		}
	});
	return dedupeSessionStoreTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets], {
		defaultAgentId: resolveSessionStoreCompatibilityAgentId(cfg),
		env
	});
}
/** Resolves only already-existing stores for one configured, retired, or manual agent. */
function resolveExistingAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storeConfig = cfg.session?.store;
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	if (!isPerAgentSessionStoreConfig(storeConfig)) {
		const fixedTarget = {
			agentId: requested,
			storePath: resolveSessionStorePathCore(storeConfig, {
				agentId: requested,
				env
			})
		};
		const configuredTargets = listConfiguredSessionStoreAgentIds(cfg).map((configuredAgentId) => ({
			agentId: configuredAgentId,
			storePath: resolveSessionStorePathCore(storeConfig, {
				agentId: configuredAgentId,
				env
			})
		}));
		if (!configuredTargets.some((target) => normalizeAgentId(target.agentId) === requested)) configuredTargets.push(fixedTarget);
		const resolvedTarget = resolveSqliteTargetFromSessionStorePath(fixedTarget.storePath, {
			agentId: requested,
			defaultAgentId,
			env
		});
		if (!resolvedTarget.shared && !dedupeSessionStoreTargetsBySqliteTarget(configuredTargets, {
			defaultAgentId,
			env
		}).some((target) => normalizeAgentId(target.agentId) === requested)) return [];
		const sqlitePath = resolvedTarget.path;
		if (sqlitePath && fs.existsSync(sqlitePath)) try {
			const databaseAgentId = resolvedTarget.shared ? normalizeAgentId(resolvedTarget.agentId ?? defaultAgentId) : requested;
			const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionEntryKeys(database).some((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				return parsed ? normalizeAgentId(parsed.agentId) === requested : databaseAgentId === requested;
			}), {
				agentId: databaseAgentId,
				env,
				path: sqlitePath
			});
			return result.found && result.value ? [fixedTarget] : [];
		} catch {
			return [];
		}
		return [];
	}
	const requestedTarget = {
		agentId: requested,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: requested,
			env
		})
	};
	const discoveredTargets = resolveAllAgentSessionStoreTargetsSync(cfg, { env }).flatMap((target) => {
		if (normalizeAgentId(target.agentId) !== requested) return [];
		const validated = resolveValidatedExistingSessionStoreTargetSync(target);
		return validated ? [validated] : [];
	});
	const validatedRequestedTarget = resolveValidatedExistingSessionStoreTargetSync(requestedTarget);
	return dedupeSessionStoreTargetsBySqliteTarget([...validatedRequestedTarget ? [validatedRequestedTarget] : [], ...discoveredTargets], {
		defaultAgentId,
		env
	});
}
/**
* Resolves recovery candidates without requiring either the legacy store or SQLite file.
* Callers must validate the selected artifact before performing filesystem mutations.
*/
function resolveAllAgentSessionStoreCandidateTargetsSync(cfg, params = {}) {
	const env = params.env ?? process.env;
	const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env);
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) {
				realAgentsRoots.set(agentsRoot, void 0);
				return;
			}
			throw err;
		}
	};
	const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
		if (!agentsRoot) return [target];
		if (!fs.existsSync(agentsRoot)) return [target];
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		return realAgentsRoot && isValidatedRecoveryCandidateSessionsDir({
			allowMissingAgentDir: true,
			realAgentsRoot,
			sessionsDir: path.dirname(target.storePath)
		}) ? [target] : [];
	});
	const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
		try {
			const realAgentsRoot = getRealAgentsRoot(agentsDir);
			if (!realAgentsRoot) return [];
			return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
				if (!isValidatedRecoveryCandidateSessionsDir({
					realAgentsRoot,
					sessionsDir
				})) return [];
				const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
				return target ? [target] : [];
			});
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) return [];
			throw err;
		}
	});
	return dedupeSessionStoreTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets], {
		defaultAgentId: resolveSessionStoreCompatibilityAgentId(cfg),
		env
	});
}
/** Resolves session store targets for one agent, including retired/manual stores. */
function resolveAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
	const env = params.env ?? process.env;
	const requested = normalizeAgentId(agentId);
	const storePaths = /* @__PURE__ */ new Set([resolveSessionStorePathCore(cfg.session?.store, {
		agentId: requested,
		env
	}), resolveSessionStorePathCore(void 0, {
		agentId: requested,
		env
	})]);
	const targets = [];
	const realAgentsRoots = /* @__PURE__ */ new Map();
	const getRealAgentsRoot = (agentsRoot) => {
		if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
		try {
			const realAgentsRoot = fs.realpathSync.native(agentsRoot);
			realAgentsRoots.set(agentsRoot, realAgentsRoot);
			return realAgentsRoot;
		} catch (err) {
			if (shouldSkipDiscoveryError(err)) {
				realAgentsRoots.set(agentsRoot, void 0);
				return;
			}
			throw err;
		}
	};
	for (const storePath of storePaths) {
		const agentsRoot = resolveAgentsDirFromSessionStorePath(storePath);
		if (!agentsRoot) {
			targets.push({
				agentId: requested,
				storePath
			});
			continue;
		}
		const realAgentsRoot = getRealAgentsRoot(agentsRoot);
		if (!realAgentsRoot) continue;
		const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
			sessionsDir: path.dirname(storePath),
			agentsRoot,
			realAgentsRoot
		});
		if (validatedStorePath) targets.push({
			agentId: requested,
			storePath: validatedStorePath
		});
	}
	const { agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env);
	for (const agentsDir of agentsRoots) try {
		const realAgentsRoot = getRealAgentsRoot(agentsDir);
		if (!realAgentsRoot) continue;
		for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
			const target = toDiscoveredSessionStoreTarget(sessionsDir, path.join(sessionsDir, "sessions.json"));
			if (!target || normalizeAgentId(target.agentId) !== requested) continue;
			const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
				sessionsDir,
				agentsRoot: agentsDir,
				realAgentsRoot
			});
			if (validatedStorePath) targets.push({
				...target,
				storePath: validatedStorePath
			});
		}
	} catch (err) {
		if (shouldSkipDiscoveryError(err)) continue;
		throw err;
	}
	return dedupeTargetsByStorePath(targets);
}
/** Resolves session store targets from explicit CLI-style selection options. */
function resolveSessionStoreTargets(cfg, opts, params = {}) {
	const env = params.env ?? process.env;
	const hasAgent = Boolean(opts.agent?.trim());
	const allAgents = opts.allAgents === true;
	if (hasAgent && allAgents) throw new Error("--agent and --all-agents cannot be used together");
	if (opts.store && allAgents) throw new Error("--store cannot be combined with --all-agents");
	if (opts.store) {
		const persistedStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
			config: cfg,
			sessionKey: "main",
			storePath: opts.store,
			env
		});
		if (persistedStoreOwner.kind === "retired") throw new Error(`Session store owner is retired: ${persistedStoreOwner.agentId}`);
		const requestedAgentId = hasAgent ? normalizeAgentId(opts.agent ?? "") : void 0;
		if (requestedAgentId && persistedStoreOwner.kind === "configured" && persistedStoreOwner.agentId !== requestedAgentId) throw new Error(`Session store belongs to agent "${persistedStoreOwner.agentId}", not requested agent "${requestedAgentId}".`);
		const defaultAgentId = requestedAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg);
		const knownAgentIds = new Set(listAgentIds(cfg).map(normalizeAgentId));
		if (hasAgent && !knownAgentIds.has(defaultAgentId)) throw new Error(`Unknown agent id "${opts.agent}". Use "openclaw agents list" to see configured agents.`);
		const target = resolveExplicitSessionStoreTarget({
			defaultAgentId,
			env,
			store: opts.store
		});
		if ((hasAgent || persistedStoreOwner.kind === "configured") && target.agentId !== defaultAgentId) throw new Error(`Session store belongs to agent "${target.agentId}", not requested agent "${defaultAgentId}".`);
		return [target];
	}
	if (allAgents) {
		const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
		return dedupeSessionStoreTargetsBySqliteTarget(listConfiguredSessionStoreAgentIds(cfg).map((agentId) => ({
			agentId,
			storePath: resolveSessionStorePathCore(cfg.session?.store, {
				agentId,
				env
			})
		})), {
			defaultAgentId,
			env,
			...params.diagnostics ? { onDiagnostic: (diagnostic) => params.diagnostics?.push(diagnostic.message) } : {}
		});
	}
	if (hasAgent) {
		const knownAgents = listAgentIds(cfg);
		const requested = normalizeAgentId(opts.agent ?? "");
		if (!knownAgents.includes(requested)) throw new Error(`Unknown agent id "${opts.agent}". Use "openclaw agents list" to see configured agents.`);
		return [{
			agentId: requested,
			storePath: resolveSessionStorePathCore(cfg.session?.store, {
				agentId: requested,
				env
			})
		}];
	}
	const persistedStoreOwner = resolvePersistedSessionStoreOwner(cfg);
	if (persistedStoreOwner.kind === "retired") throw new Error(`Session store owner is retired: ${persistedStoreOwner.agentId}`);
	const defaultAgentId = (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg);
	return [{
		agentId: defaultAgentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, {
			agentId: defaultAgentId,
			env
		})
	}];
}
//#endregion
export { upsertConversationIdentity as $, rehomeSessionWindows as A, readTranscriptMutationStateInTransaction as B, readLifecycleTargetSnapshot as C, readSessionEntrySelectionSnapshot as D, readSessionEntryRow as E, deleteTranscriptEventsInTransaction as F, canonicalSessionKeyMigrationRequiredError as G, touchTranscriptMutationInTransaction as H, ensureTranscriptGenerationInTransaction as I, coerceSqliteNumber as J, setCanonicalSqliteSessionMainKey as K, ensureTranscriptSessionRoot as L, sqliteSessionEntriesEqual as M, writeSessionEntry as N, readSessionEntryStore as O, advanceTranscriptMutationAtInTransaction as P, deleteSessionMembersForRepair as Q, readNextTranscriptSeq as R, readExactSessionEntryRowValidated as S, readSessionEntryKeys as T, assertCanonicalSessionKeyWrite as U, rotateTranscriptGenerationInTransaction as V, assertCanonicalSqliteSessionKeysCurrent as W, collectSessionStateIdsForEntry as X, createFallbackSessionEntry as Y, copySessionNodeArtifactsForRepair as Z, deleteLifecycleTargetRows as _, resolveAllAgentSessionStoreCandidateTargetsSync as a, parseSessionEntryJson as at, readExactSessionEntryJsonForCanonicalRepair as b, resolveSessionStoreTargets as c, deriveSessionMetaPatch as ct, resolveAgentSessionDirsFromAgentsDirSync as d, buildConversationIdentity as et, assertLifecycleTargetSnapshotUnchanged as f, deleteLegacySessionEntryRows as g, createSessionIdentitySnapshot as h, resolveAgentSessionStoreTargetsSync as i, trackSessionEntryCacheWrite as it, resolveLifecyclePrimaryEntry as j, readSessionIdentitySnapshot as k, dedupeSessionStoreTargetsBySqliteTarget as l, deriveSessionOrigin as lt, assertSessionEntrySelectionUnchanged as m, listConfiguredSessionStoreAgentIds as n, publishSessionEntryCacheInvalidation as nt, resolveAllAgentSessionStoreTargetsSync as o, readSessionEntriesByStatus as ot, assertLifecycleTargetUnchanged as p, bindSessionWindowEntryProjection as q, listKnownSessionStoreAgentIds as r, readSessionEntryCache as rt, resolveExistingAgentSessionStoreTargetsSync as s, deriveLastRoutePatch as st, isConfiguredSessionStoreAgentId as t, conversationIdentityFromMsgContext as tt, resolveAgentSessionDirs as u, deleteSessionEntryRows as v, readSessionEntryCount as w, readExactSessionEntryRow as x, normalizeLifecycleTarget as y, readTranscriptGenerationInTransaction as z };
