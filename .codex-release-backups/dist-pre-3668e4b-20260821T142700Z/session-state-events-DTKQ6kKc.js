import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { a as buildAgentMainSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { A as SESSION_WATCH_PROVENANCE_EXPLICIT, Lt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, k as SESSION_WATCH_PROVENANCE_AMBIENT_GROUP } from "./openclaw-state-db-BciZ4rHE.js";
import { $t as loadSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import { t as classifySessionKind } from "./classify-session-kind-C57o_c98.js";
import { c as requestHeartbeat } from "./heartbeat-wake-CAQb-fCA.js";
import { a as enqueueSystemEvent } from "./system-events-DecgSLEt.js";
import { t as deleteSessionUpstreamLink } from "./session-upstream-links-i-TvS0qu.js";
//#region src/sessions/session-state-event-kinds.ts
const NOTIFY_BY_SESSION_STATE_EVENT_KIND = {
	created: false,
	human_direct_message: true,
	upstream_missing: true,
	adopted: false,
	goal_changed: true,
	run_completed: false,
	run_failed: false,
	child_spawned: false,
	compacted: false
};
//#endregion
//#region src/sessions/session-state-notices.ts
/** Stale-state notice text, coalescing keys, and watcher eligibility. */
const SESSION_STATE_CONTEXT_PREFIX = "session-state:";
function encodeNoticeTarget(sessionKey) {
	return Buffer.from(sessionKey, "utf8").toString("hex");
}
function decodeSessionStateNoticeContextKey(contextKey) {
	if (!contextKey.startsWith(SESSION_STATE_CONTEXT_PREFIX)) return;
	const encoded = contextKey.slice(14);
	if (!encoded || encoded.length % 2 !== 0 || !/^[0-9a-f]+$/.test(encoded)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(Buffer.from(encoded, "hex"));
	} catch {
		return;
	}
}
function sessionStateNoticeText(targetSessionKey, lastSeenSequence) {
	return `Session "${targetSessionKey}" changed (other actor). Reconcile before acting: session_status sessionKey "${targetSessionKey}" changesSince ${lastSeenSequence}.`;
}
function shouldWakeWatcher(watcherSessionKey) {
	return !isSubagentSessionKey(watcherSessionKey);
}
function isNotifiableWatcherKey(watcherSessionKey) {
	return parseAgentSessionKey(watcherSessionKey) != null;
}
function enqueueSessionStateNotice(params) {
	enqueueSystemEvent(sessionStateNoticeText(params.targetSessionKey, params.lastSeenSequence), {
		sessionKey: params.watcherSessionKey,
		contextKey: `${SESSION_STATE_CONTEXT_PREFIX}${encodeNoticeTarget(params.targetSessionKey)}`,
		...params.queueOnly ? { replace: true } : {}
	});
	if (params.queueOnly) return;
	if (!shouldWakeWatcher(params.watcherSessionKey)) return;
	requestHeartbeat({
		source: "session-state",
		intent: "immediate",
		reason: `session-state:${params.targetSessionKey}`,
		sessionKey: params.watcherSessionKey
	});
}
//#endregion
//#region src/sessions/session-state-events.ts
const SESSION_STATE_RETENTION_MS = 720 * 60 * 6e4;
const SESSION_STATE_MAX_ROWS = 5e4;
const SESSION_STATE_PRUNE_INTERVAL_MS = 60 * 6e4;
const log = createSubsystemLogger("sessions/state-events");
let lastPruneAt = 0;
function getSessionStateKysely(db) {
	return getNodeSqliteKysely(db);
}
function normalizeOptionalSqliteNumber(value) {
	return value === void 0 ? void 0 : normalizeSqliteNumber(value);
}
function rowToSessionStateEvent(row) {
	const payload = row.payload_json ? safeParseJsonRecord(row.payload_json) : void 0;
	return {
		sequence: normalizeSqliteNumber(row.sequence) ?? 0,
		sessionKey: row.session_key,
		...row.session_id ? { sessionId: row.session_id } : {},
		agentId: row.agent_id,
		kind: row.kind,
		actorType: row.actor_type,
		...row.actor_id ? { actorId: row.actor_id } : {},
		...row.run_id ? { runId: row.run_id } : {},
		occurredAt: normalizeSqliteNumber(row.occurred_at) ?? 0,
		summary: row.summary,
		...payload ? { payload } : {}
	};
}
function bindSessionStateEvent(input, occurredAt) {
	return {
		dedupe_key: input.dedupeKey ?? null,
		session_key: input.sessionKey,
		session_id: input.sessionId ?? null,
		agent_id: input.agentId,
		kind: input.kind,
		actor_type: input.actorType,
		actor_id: input.actorId ?? null,
		run_id: input.runId ?? null,
		occurred_at: occurredAt,
		summary: input.summary,
		payload_json: input.payload ? JSON.stringify(input.payload) : null
	};
}
function readCursor(db, watcherSessionKey, targetSessionKey) {
	return executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
}
function isAmbientGroupWatchCursor(row) {
	return row?.provenance === SESSION_WATCH_PROVENANCE_AMBIENT_GROUP;
}
function upsertSeedCursor(params) {
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		provenance: params.provenance ?? "explicit",
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		last_seen_sequence: params.sequence,
		notified_sequence: params.sequence,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
}
function updateMaterialCursor(params) {
	const current = readCursor(params.db, params.watcherSessionKey, params.targetSessionKey);
	const lastSeen = normalizeOptionalSqliteNumber(current?.last_seen_sequence) ?? 0;
	const notified = normalizeOptionalSqliteNumber(current?.notified_sequence) ?? 0;
	const frozenNotified = notified === lastSeen ? params.sequence : notified;
	executeSqliteQuerySync(params.db, getSessionStateKysely(params.db).insertInto("session_watch_cursors").values({
		watcher_session_key: params.watcherSessionKey,
		target_session_key: params.targetSessionKey,
		last_seen_sequence: lastSeen,
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		provenance: SESSION_WATCH_PROVENANCE_EXPLICIT,
		updated_at: params.now
	}).onConflict((conflict) => conflict.columns(["watcher_session_key", "target_session_key"]).doUpdateSet({
		notified_sequence: frozenNotified,
		material_sequence: params.sequence,
		updated_at: params.now
	})));
	return {
		lastSeenSequence: lastSeen,
		queueOnly: isAmbientGroupWatchCursor(current)
	};
}
/** Classify the actor once at producer boundaries; missing provenance is interactive human input. */
function classifySessionStateActor(opts) {
	if (opts.inputProvenance?.kind === "inter_session") return {
		actorType: "agent",
		...opts.inputProvenance.sourceSessionKey ? { actorId: opts.inputProvenance.sourceSessionKey } : {}
	};
	if (opts.inputProvenance?.kind === "internal_system" || (opts.internalEvents?.length ?? 0) > 0 || opts.sessionEffects === "internal") return { actorType: "system" };
	return {
		actorType: "human",
		...opts.humanActorId ? { actorId: opts.humanActorId } : {}
	};
}
/** Append a signal-log event without allowing signaling failure to fail the originating action. */
const SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS = 1440 * 6e4;
function clampSessionStateOccurredAt(value, now) {
	if (typeof value !== "number" || !Number.isFinite(value)) return now;
	return Math.min(Math.max(value, now - SESSION_STATE_OCCURRED_AT_MAX_SKEW_MS), now);
}
function recordSessionStateEvent(input, options = {}) {
	const now = options.now ?? Date.now();
	const occurredAt = clampSessionStateOccurredAt(input.occurredAt, now);
	const notices = [];
	try {
		const event = runOpenClawStateWriteTransaction(({ db }) => {
			const insert = executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_events").values(bindSessionStateEvent(input, occurredAt)).onConflict((conflict) => conflict.column("dedupe_key").doNothing()));
			const insertedSequence = insert.insertId ? Number(insert.insertId) : void 0;
			if (insertedSequence === void 0) {
				if (!input.dedupeKey) return;
				const existing = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("dedupe_key", "=", input.dedupeKey));
				return existing ? rowToSessionStateEvent(existing) : void 0;
			}
			executeSqliteQuerySync(db, getSessionStateKysely(db).insertInto("session_state_heads").values({
				session_key: input.sessionKey,
				agent_id: input.agentId,
				last_sequence: insertedSequence,
				updated_at: now
			}).onConflict((conflict) => conflict.columns(["session_key", "agent_id"]).doUpdateSet({
				last_sequence: insertedSequence,
				updated_at: now
			})));
			const registeredWatcherKeys = NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] ? executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("target_session_key", "=", input.sessionKey)).rows.map((row) => row.watcher_session_key) : [];
			const watcherSessionKeys = [.../* @__PURE__ */ new Set([...input.watcherSessionKeys ?? [], ...registeredWatcherKeys])].filter((key) => Boolean(key) && isNotifiableWatcherKey(key));
			for (const watcherSessionKey of watcherSessionKeys) {
				if (input.kind === "child_spawned") {
					upsertSeedCursor({
						db,
						watcherSessionKey,
						targetSessionKey: input.sessionKey,
						sequence: insertedSequence,
						now
					});
					continue;
				}
				if (!NOTIFY_BY_SESSION_STATE_EVENT_KIND[input.kind] || input.actorId === watcherSessionKey) continue;
				const materialCursor = updateMaterialCursor({
					db,
					watcherSessionKey,
					targetSessionKey: input.sessionKey,
					sequence: insertedSequence,
					now
				});
				notices.push({
					watcherSessionKey,
					targetSessionKey: input.sessionKey,
					lastSeenSequence: materialCursor.lastSeenSequence,
					queueOnly: materialCursor.queueOnly
				});
			}
			const row = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_events").selectAll().where("sequence", "=", insertedSequence));
			return row ? rowToSessionStateEvent(row) : void 0;
		}, options);
		for (const notice of notices) enqueueSessionStateNotice(notice);
		if (now - lastPruneAt > SESSION_STATE_PRUNE_INTERVAL_MS) pruneSessionStateEvents({
			...options,
			now
		});
		return event;
	} catch (error) {
		log.warn(`failed to record session state event: ${String(error)}`);
		return;
	}
}
/** Return the durable signal-log head for one session; degrades to 0 on read failure. */
function getSessionStateVersion(sessionKey, agentId, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		return normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", sessionKey).where("agent_id", "=", agentId))?.last_sequence) ?? 0;
	} catch (error) {
		log.warn(`failed to read session state version: ${String(error)}`);
		return 0;
	}
}
/** Batch durable signal-log heads for session-list enrichment, keyed agent → session key. */
function getSessionStateVersions(refs, options = {}) {
	const keys = [...new Set(refs.map((ref) => ref.sessionKey).filter(Boolean))];
	if (keys.length === 0) return {};
	const byAgent = {};
	try {
		const { db } = openOpenClawStateDatabase(options);
		for (let offset = 0; offset < keys.length; offset += 500) {
			const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select([
				"session_key",
				"agent_id",
				"last_sequence"
			]).where("session_key", "in", keys.slice(offset, offset + 500))).rows;
			for (const row of rows) (byAgent[row.agent_id] ??= {})[row.session_key] = normalizeSqliteNumber(row.last_sequence) ?? 0;
		}
	} catch (error) {
		log.warn(`failed to read session state versions: ${String(error)}`);
	}
	return byAgent;
}
/** List retained signal-log events after a version without advancing watcher cursors. */
function listSessionStateEventsSince(sessionKey, agentId, afterSequence, limit = 200, options = {}) {
	try {
		const boundedLimit = Math.max(1, Math.min(200, Math.floor(limit)));
		const { db } = openOpenClawStateDatabase(options);
		const kysely = getSessionStateKysely(db);
		const rows = executeSqliteQuerySync(db, kysely.selectFrom("session_state_events").selectAll().where("session_key", "=", sessionKey).where("agent_id", "=", agentId).where("sequence", ">", afterSequence).orderBy("sequence", "asc").limit(boundedLimit + 1)).rows;
		const earliest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select((eb) => eb.fn.min("sequence").as("sequence")).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const headRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_heads").select(["last_sequence", "pruned_max_sequence"]).where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
		const head = normalizeOptionalSqliteNumber(headRow?.last_sequence) ?? 0;
		const prunedMax = normalizeOptionalSqliteNumber(headRow?.pruned_max_sequence) ?? 0;
		const earliestAvailableSequence = normalizeOptionalSqliteNumber(earliest?.sequence) ?? (head > 0 ? head + 1 : 0);
		return {
			events: rows.slice(0, boundedLimit).map(rowToSessionStateEvent),
			truncated: rows.length > boundedLimit,
			earliestAvailableSequence,
			historyGap: afterSequence < prunedMax
		};
	} catch (error) {
		log.warn(`failed to list session state events: ${String(error)}`);
		return {
			events: [],
			truncated: false,
			earliestAvailableSequence: 0,
			historyGap: false
		};
	}
}
/** Ack only the frozen notice watermark; advancing to head would lose an interleaved event. */
function acknowledgeSessionStateNotices(watcherSessionKey, targetSessionKeys, options = {}) {
	const now = options.now ?? Date.now();
	const followups = [];
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			for (const targetSessionKey of new Set(targetSessionKeys)) {
				const row = readCursor(db, watcherSessionKey, targetSessionKey);
				if (!row) continue;
				const notified = normalizeSqliteNumber(row.notified_sequence) ?? 0;
				const material = normalizeSqliteNumber(row.material_sequence) ?? 0;
				const nextNotified = material > notified ? material : notified;
				executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({
					last_seen_sequence: notified,
					notified_sequence: nextNotified,
					updated_at: now
				}).where("watcher_session_key", "=", watcherSessionKey).where("target_session_key", "=", targetSessionKey));
				if (material > notified) followups.push({
					watcherSessionKey,
					targetSessionKey,
					lastSeenSequence: notified,
					queueOnly: isAmbientGroupWatchCursor(row)
				});
			}
		}, options);
		for (const followup of followups) enqueueSessionStateNotice(followup);
	} catch (error) {
		log.warn(`failed to acknowledge session state notices: ${String(error)}`);
	}
}
/** Reset parent-side assumptions while retaining target history across session incarnations. */
function handleSessionStateSessionReset(sessionKey, options = {}) {
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			executeSqliteQuerySync(db, getSessionStateKysely(db).deleteFrom("session_watch_cursors").where("watcher_session_key", "=", sessionKey));
		}, options);
	} catch (error) {
		log.warn(`failed to reset session state cursors: ${String(error)}`);
	}
}
/** Delete all signal-log and cursor state owned by a deleted session key. */
function handleSessionStateSessionDeleted(sessionKey, agentId, options = {}) {
	deleteSessionUpstreamLink(sessionKey, agentId, options);
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getSessionStateKysely(db);
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_heads").where("session_key", "=", sessionKey).where("agent_id", "=", agentId));
			executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where((eb) => eb.or([eb("watcher_session_key", "=", sessionKey), eb("target_session_key", "=", sessionKey)])));
		}, options);
	} catch (error) {
		log.warn(`failed to delete session state history: ${String(error)}`);
	}
}
function sessionExists(sessionKey, env) {
	try {
		return Boolean(loadSessionEntryReadOnly({
			sessionKey,
			clone: false,
			env
		}));
	} catch {
		return false;
	}
}
/** Re-materialize pending notices after the in-memory queue is lost on restart. */
function sweepSessionStateWatchNotices(options = {}) {
	const now = options.now ?? Date.now();
	try {
		const { db } = openOpenClawStateDatabase(options);
		const pendingRows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").selectAll().whereRef("material_sequence", ">", "last_seen_sequence")).rows.filter((row) => sessionExists(row.watcher_session_key, options.env));
		runOpenClawStateWriteTransaction(({ db: writeDb }) => {
			for (const row of pendingRows) executeSqliteQuerySync(writeDb, getSessionStateKysely(writeDb).updateTable("session_watch_cursors").set({
				notified_sequence: row.material_sequence,
				updated_at: now
			}).where("watcher_session_key", "=", row.watcher_session_key).where("target_session_key", "=", row.target_session_key));
		}, options);
		for (const row of pendingRows) enqueueSessionStateNotice({
			watcherSessionKey: row.watcher_session_key,
			targetSessionKey: row.target_session_key,
			lastSeenSequence: normalizeSqliteNumber(row.last_seen_sequence) ?? 0,
			queueOnly: isAmbientGroupWatchCursor(row)
		});
		pruneSessionStateEvents({
			...options,
			now
		});
	} catch (error) {
		log.warn(`failed to sweep session state notices: ${String(error)}`);
	}
}
/** Enforce bounded retained history without regressing durable per-session heads. */
function pruneSessionStateEvents(options = {}) {
	const now = options.now ?? Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db }) => {
			const kysely = getSessionStateKysely(db);
			const stampPrunedWatermarks = (predicate) => {
				let query = kysely.selectFrom("session_state_events").select(["session_key", "agent_id"]).select((eb) => eb.fn.max("sequence").as("max_sequence")).groupBy(["session_key", "agent_id"]);
				if (predicate.occurredBefore !== void 0) query = query.where("occurred_at", "<", predicate.occurredBefore);
				if (predicate.sequenceAtOrBelow !== void 0) query = query.where("sequence", "<=", predicate.sequenceAtOrBelow);
				for (const row of executeSqliteQuerySync(db, query).rows) {
					const maxSequence = normalizeSqliteNumber(row.max_sequence) ?? 0;
					executeSqliteQuerySync(db, kysely.updateTable("session_state_heads").set({
						pruned_max_sequence: maxSequence,
						updated_at: now
					}).where("session_key", "=", row.session_key).where("agent_id", "=", row.agent_id).where("pruned_max_sequence", "<", maxSequence));
				}
			};
			const retentionCutoff = now - SESSION_STATE_RETENTION_MS;
			stampPrunedWatermarks({ occurredBefore: retentionCutoff });
			executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("occurred_at", "<", retentionCutoff));
			const sequenceCutoff = normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_state_events").select("sequence").orderBy("sequence", "desc").offset(SESSION_STATE_MAX_ROWS).limit(1))?.sequence);
			if (sequenceCutoff !== void 0) {
				stampPrunedWatermarks({ sequenceAtOrBelow: sequenceCutoff });
				executeSqliteQuerySync(db, kysely.deleteFrom("session_state_events").where("sequence", "<=", sequenceCutoff));
			}
			const cursorCutoff = now - SESSION_STATE_RETENTION_MS;
			executeSqliteQuerySync(db, kysely.deleteFrom("session_watch_cursors").where("updated_at", "<", cursorCutoff));
		}, options);
		lastPruneAt = now;
	} catch (error) {
		log.warn(`failed to prune session state history: ${String(error)}`);
	}
}
/** Record one successful compaction from the two concrete v1 owners. */
function recordSessionCompacted(params) {
	if (!params.sessionKey) return;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "compacted",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `compacted:${params.operationId}`,
		summary: "session compacted"
	});
}
/** Record a persisted goal mutation using lineage already available at the session-store seam. */
function recordSessionGoalChanged(params) {
	const watcherSessionKey = params.entry.spawnedBy ?? params.entry.parentSessionKey;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "goal_changed",
		actorType: params.actor?.type ?? "system",
		...params.actor?.id ? { actorId: params.actor.id } : {},
		summary: params.summary,
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	});
}
/** Record the child's own creation fact when its durable stamp identifies an actor. */
function recordSessionCreated(params) {
	const actor = params.entry.createdActor;
	if (!actor) return;
	recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.entry.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "created",
		actorType: actor.type,
		...actor.id ? { actorId: actor.id } : {},
		dedupeKey: `created:${params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey)}:${params.sessionKey}:${params.entry.sessionId}`,
		summary: "session created"
	});
}
/** True when any seeded or explicitly registered watcher cursor targets this session. */
function hasSessionStateWatchers(targetSessionKey, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		return executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("watcher_session_key").where("target_session_key", "=", targetSessionKey).limit(1)) !== void 0;
	} catch (error) {
		log.warn(`failed to probe session state watchers: ${String(error)}`);
		return false;
	}
}
/** List durable ambient-group targets owned by one watcher; failures grant nothing. */
function listAmbientGroupWatchTargets(watcherSessionKey, options = {}) {
	try {
		const { db } = openOpenClawStateDatabase(options);
		const rows = executeSqliteQuerySync(db, getSessionStateKysely(db).selectFrom("session_watch_cursors").select("target_session_key").where("watcher_session_key", "=", watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP)).rows;
		return new Set(rows.map((row) => row.target_session_key));
	} catch (error) {
		log.warn(`failed to list ambient group watch targets: ${String(error)}`);
		return /* @__PURE__ */ new Set();
	}
}
/** Register an explicit watcher (e.g. a sessions_send coordinator) for a target session. */
function registerSessionStateWatch(params, options = {}) {
	if (params.watcherSessionKey === params.targetSessionKey || !isNotifiableWatcherKey(params.watcherSessionKey)) return false;
	const now = options.now ?? Date.now();
	try {
		let registered = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			const existing = readCursor(db, params.watcherSessionKey, params.targetSessionKey);
			if (existing) {
				if (existing.provenance !== "explicit") executeSqliteQuerySync(db, getSessionStateKysely(db).updateTable("session_watch_cursors").set({ provenance: SESSION_WATCH_PROVENANCE_EXPLICIT }).where("watcher_session_key", "=", params.watcherSessionKey).where("target_session_key", "=", params.targetSessionKey));
				registered = true;
				return;
			}
			const agentId = params.targetAgentId ?? resolveAgentIdFromSessionKey(params.targetSessionKey);
			const head = executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.targetSessionKey).where("agent_id", "=", agentId));
			upsertSeedCursor({
				db,
				watcherSessionKey: params.watcherSessionKey,
				targetSessionKey: params.targetSessionKey,
				sequence: normalizeOptionalSqliteNumber(head?.last_sequence) ?? 0,
				now
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register session state watch: ${String(error)}`);
		return false;
	}
}
/** Register the personal agent's main session to observe one routed group session. */
function registerMainSessionGroupWatch(params, options = {}) {
	if (classifySessionKind(params.sessionKey, params.entry) !== "group") return false;
	const watcherSessionKey = buildAgentMainSessionKey({ agentId: params.agentId });
	const now = options.now ?? Date.now();
	try {
		const { db: readDb } = openOpenClawStateDatabase(options);
		if (params.dmScope !== "main") {
			if (!isAmbientGroupWatchCursor(readCursor(readDb, watcherSessionKey, params.sessionKey))) return false;
			runOpenClawStateWriteTransaction(({ db }) => {
				if (!isAmbientGroupWatchCursor(readCursor(db, watcherSessionKey, params.sessionKey))) return;
				executeSqliteQuerySync(db, getSessionStateKysely(db).deleteFrom("session_watch_cursors").where("target_session_key", "=", params.sessionKey).where("watcher_session_key", "=", watcherSessionKey).where("provenance", "=", SESSION_WATCH_PROVENANCE_AMBIENT_GROUP));
			}, options);
			return false;
		}
		if (readCursor(readDb, watcherSessionKey, params.sessionKey)) return true;
		let registered = false;
		runOpenClawStateWriteTransaction(({ db }) => {
			if (readCursor(db, watcherSessionKey, params.sessionKey)) {
				registered = true;
				return;
			}
			const sequence = normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(db, getSessionStateKysely(db).selectFrom("session_state_heads").select("last_sequence").where("session_key", "=", params.sessionKey).where("agent_id", "=", params.agentId))?.last_sequence) ?? 0;
			upsertSeedCursor({
				db,
				watcherSessionKey,
				targetSessionKey: params.sessionKey,
				sequence,
				now,
				provenance: SESSION_WATCH_PROVENANCE_AMBIENT_GROUP
			});
			registered = true;
		}, options);
		return registered;
	} catch (error) {
		log.warn(`failed to register ambient group watch: ${String(error)}`);
		return false;
	}
}
function recordSessionHumanDirectMessage(params, options = {}) {
	const watcherSessionKey = params.entry?.spawnedBy ?? params.entry?.parentSessionKey;
	if (params.actor.actorType !== "human") return;
	if (!watcherSessionKey && !hasSessionStateWatchers(params.sessionKey, options)) return;
	return recordSessionStateEvent({
		sessionKey: params.sessionKey,
		sessionId: params.entry?.sessionId,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		kind: "human_direct_message",
		actorType: "human",
		...params.actor.actorId ? { actorId: params.actor.actorId } : {},
		runId: params.runId,
		...params.dedupeKey ? { dedupeKey: params.dedupeKey } : {},
		summary: `human message via ${params.channel?.trim() || "unknown"}`,
		payload: params.payload,
		...params.occurredAt === void 0 ? {} : { occurredAt: params.occurredAt },
		...watcherSessionKey ? { watcherSessionKeys: [watcherSessionKey] } : {}
	}, options);
}
/** Seed the parent cursor at the child-spawn version. */
function recordSubagentSpawned(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: params.agentId,
		kind: "child_spawned",
		actorType: "agent",
		actorId: params.requesterSessionKey,
		runId: params.childRunId,
		dedupeKey: `child-spawned:${params.childRunId}`,
		summary: "child session spawned",
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
const SUBAGENT_TERMINAL_SUMMARY = {
	ok: "child run completed",
	error: "child run failed",
	timeout: "child run timed out",
	cancelled: "child run cancelled"
};
/** Project an already-normalized subagent terminal outcome into the signal log. */
function recordSubagentTerminalState(params) {
	recordSessionStateEvent({
		sessionKey: params.childSessionKey,
		agentId: resolveAgentIdFromSessionKey(params.childSessionKey),
		kind: params.outcomeStatus === "ok" ? "run_completed" : "run_failed",
		actorType: "system",
		runId: params.runId,
		dedupeKey: `run-terminal:${params.runId}`,
		summary: SUBAGENT_TERMINAL_SUMMARY[params.outcomeStatus],
		...params.outcomeStatus === "ok" ? {} : { payload: { outcome: params.outcomeStatus } },
		watcherSessionKeys: [params.requesterSessionKey]
	});
}
//#endregion
export { registerSessionStateWatch as _, handleSessionStateSessionDeleted as a, listSessionStateEventsSince as c, recordSessionGoalChanged as d, recordSessionHumanDirectMessage as f, registerMainSessionGroupWatch as g, recordSubagentTerminalState as h, getSessionStateVersions as i, recordSessionCompacted as l, recordSubagentSpawned as m, classifySessionStateActor as n, handleSessionStateSessionReset as o, recordSessionStateEvent as p, getSessionStateVersion as r, listAmbientGroupWatchTargets as s, acknowledgeSessionStateNotices as t, recordSessionCreated as u, sweepSessionStateWatchNotices as v, decodeSessionStateNoticeContextKey as y };
