import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { w as hasErrnoCode } from "./redact-DP7p9QfH.js";
import "./errors-CqPTYU6G.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { f as isIncognitoOpenClawAgentDatabase, g as openOpenClawAgentDatabase } from "./openclaw-agent-db-C8vnaZ56.js";
import { c as normalizeSessionDeliveryState } from "./delivery-context.shared-B3qeEQhR.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DX1p0rnU.js";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-CnAfxmHQ.js";
import { G as canonicalSessionKeyMigrationRequiredError, J as coerceSqliteNumber, M as sqliteSessionEntriesEqual, O as readSessionEntryStore, Q as deleteSessionMembersForRepair, X as collectSessionStateIdsForEntry, Z as copySessionNodeArtifactsForRepair, at as parseSessionEntryJson, b as readExactSessionEntryJsonForCanonicalRepair, nt as publishSessionEntryCacheInvalidation, q as bindSessionWindowEntryProjection, v as deleteSessionEntryRows, x as readExactSessionEntryRow } from "./targets-CdQ3kEkv.js";
import { a as normalizeStoreSessionKey } from "./store-entry-BB6W2GxL.js";
import { c as resolveSqliteStoreScope, i as getSessionKysely, p as toDatabaseOptions, s as resolveSqliteScope, t as cloneSessionEntry } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
import { C as selectSessionTranscriptLeafControlledPath, a as reconcileSessionTranscriptIndexInTransaction, n as deleteSessionTranscriptIndexInTransaction } from "./session-transcript-index-B7GQuTh4.js";
import { r as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "./session-accessor.sqlite-delete-snapshot-15FV4pBR.js";
import { b as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-transcript-store-Cgnm_AHf.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
function isValidReplayTimestamp(value) {
	if (typeof value === "number") return Number.isFinite(value);
	return typeof value === "string" && value.trim().length > 0;
}
function replayableTranscriptRole(record) {
	if (!record || record.type !== "message" || typeof record.id !== "string" || record.id.trim().length === 0 || !isValidReplayTimestamp(record.timestamp) || !(record.parentId === null || record.parentId === void 0 || typeof record.parentId === "string")) return;
	const role = record.message?.role;
	return role === "user" || role === "assistant" ? role : void 0;
}
function selectRecentUserAssistantReplayRecords(records, maxMessages = 6) {
	const max = Math.max(0, maxMessages);
	if (max === 0) return [];
	const kept = [];
	for (const record of records) {
		const role = replayableTranscriptRole(record);
		if (role) kept.push({
			role,
			record
		});
	}
	return selectAlternatingReplayTail(kept, max).map((entry) => entry.record);
}
function selectAlternatingReplayTail(kept, max) {
	if (kept.length === 0) return [];
	let startIdx = Math.max(0, kept.length - max);
	while (startIdx < kept.length && kept[startIdx]?.role === "assistant") startIdx += 1;
	if (startIdx === kept.length) return [];
	return coalesceAlternatingReplayTail(kept.slice(startIdx));
}
function coalesceAlternatingReplayTail(entries) {
	const tail = [];
	for (const entry of entries) {
		const lastIdx = tail.length - 1;
		if (lastIdx >= 0 && tail[lastIdx]?.role === entry.role) {
			tail[lastIdx] = entry;
			continue;
		}
		tail.push(entry);
	}
	return tail;
}
//#endregion
//#region src/config/sessions/file-range.ts
async function readFileRangeAsync(fileHandle, position, length) {
	const buffer = Buffer.alloc(length);
	let offset = 0;
	while (offset < length) {
		const { bytesRead } = await fileHandle.read(buffer, offset, length - offset, position + offset);
		if (bytesRead <= 0) break;
		offset += bytesRead;
	}
	return offset === length ? buffer : buffer.subarray(0, offset);
}
//#endregion
//#region src/config/sessions/transcript-stream.ts
const DEFAULT_REVERSE_CHUNK_BYTES = 64 * 1024;
const MAX_REVERSE_CHUNK_BYTES = 1024 * 1024;
const MIN_REVERSE_CHUNK_BYTES = 1024;
/**
* Stream the non-empty, trimmed JSONL lines of a transcript file in order.
*
* Returns an empty async iterator if the file does not exist, is empty, or is
* not a regular file. Honours `options.signal` between lines so long scans can
* cooperate with abort signals.
*/
async function* streamSessionTranscriptLines(filePath, options = {}) {
	let stat;
	try {
		stat = await fs.promises.stat(filePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	if (!stat.isFile() || stat.size <= 0) return;
	if (options.signal?.aborted) return;
	const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
	const rl = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	try {
		for await (const line of rl) {
			if (options.signal?.aborted) return;
			const trimmed = line.trim();
			if (!trimmed) continue;
			yield trimmed;
		}
	} finally {
		rl.close();
		stream.destroy();
	}
}
/**
* Stream the non-empty, trimmed JSONL lines of a transcript file in reverse
* (newest-first) order.
*
* Returns an empty async iterator if the file does not exist, is empty, or is
* not a regular file. The implementation splits on newline bytes before UTF-8
* decoding so multibyte characters survive arbitrary chunk boundaries.
*/
async function* streamSessionTranscriptLinesReverse(filePath, options = {}) {
	const requestedChunkBytes = Number.isFinite(options.chunkBytes) ? Math.max(MIN_REVERSE_CHUNK_BYTES, Math.floor(options.chunkBytes)) : DEFAULT_REVERSE_CHUNK_BYTES;
	const chunkBytes = Math.min(requestedChunkBytes, MAX_REVERSE_CHUNK_BYTES);
	let fileHandle;
	try {
		fileHandle = await fs.promises.open(filePath, "r");
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	try {
		const stat = await fileHandle.stat();
		if (!stat.isFile() || stat.size <= 0 || options.signal?.aborted) return;
		let position = stat.size;
		let carry = Buffer.alloc(0);
		while (position > 0) {
			if (options.signal?.aborted) return;
			const readLength = Math.min(position, chunkBytes);
			position -= readLength;
			const chunk = await readFileRangeAsync(fileHandle, position, readLength);
			const combined = carry.length > 0 ? Buffer.concat([chunk, carry]) : chunk;
			let lineEnd = combined.length;
			for (let index = combined.length - 1; index >= 0; index -= 1) {
				if (combined[index] !== 10) continue;
				const line = decodeTrimmedLine(combined.subarray(index + 1, lineEnd));
				if (line) {
					yield line;
					if (options.signal?.aborted) return;
				}
				lineEnd = index;
			}
			carry = combined.subarray(0, lineEnd);
		}
		const firstLine = decodeTrimmedLine(carry);
		if (firstLine && !options.signal?.aborted) yield firstLine;
	} finally {
		await fileHandle.close().catch(() => void 0);
	}
}
function decodeTrimmedLine(line) {
	return line.toString("utf-8").trim();
}
//#endregion
//#region src/config/sessions/session-reset-boundary-event.ts
function recordId(record) {
	if (!record || typeof record !== "object" || Array.isArray(record)) return;
	const id = record.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function uniqueBoundaryId(records) {
	const ids = new Set(records.flatMap((record) => recordId(record) ? [recordId(record)] : []));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
function projectLatestBoundaryWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => {
		const type = entry && typeof entry === "object" && !Array.isArray(entry) ? entry.type : void 0;
		return type === "compaction" || type === "reset";
	});
	if (boundaryIndex < 0) return [...entries];
	const boundary = entries[boundaryIndex];
	const firstKeptIndex = typeof boundary.firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && recordId(entry) === boundary.firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter((entry) => {
		const role = entry?.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex + 1)];
}
function buildSessionResetBoundaryEvent(params) {
	const entries = params.events.filter((event) => event !== null && typeof event === "object" && !Array.isArray(event) && event.type !== "session");
	const activeEntries = selectSessionTranscriptLeafControlledPath(entries) ?? entries;
	const firstKeptEntryId = recordId(selectRecentUserAssistantReplayRecords(projectLatestBoundaryWindow(activeEntries))[0]);
	return {
		type: "reset",
		id: uniqueBoundaryId(params.events),
		parentId: recordId(activeEntries.at(-1)) ?? null,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		reason: params.reason,
		...firstKeptEntryId ? { firstKeptEntryId } : {}
	};
}
async function readLegacyTranscriptEvents(sessionFile) {
	const filePath = sessionFile?.trim();
	if (!filePath || !path.isAbsolute(filePath) || !filePath.endsWith(".jsonl")) return [];
	try {
		const newestFirst = [];
		let boundaryFirstKeptEntryId;
		let foundBoundary = false;
		for await (const line of streamSessionTranscriptLinesReverse(filePath)) {
			let record;
			try {
				record = JSON.parse(line);
			} catch {
				continue;
			}
			const type = record && typeof record === "object" && !Array.isArray(record) ? record.type : void 0;
			if (!foundBoundary && (type === "reset" || type === "compaction")) {
				foundBoundary = true;
				const firstKept = record.firstKeptEntryId;
				boundaryFirstKeptEntryId = typeof firstKept === "string" && firstKept.trim() ? firstKept : void 0;
				if (!boundaryFirstKeptEntryId) break;
				continue;
			}
			if (foundBoundary && (type === "reset" || type === "compaction")) break;
			if (replayableTranscriptRole(record)) newestFirst.push(record);
			if (newestFirst.length >= 6 || foundBoundary && recordId(record) === boundaryFirstKeptEntryId) break;
		}
		const selected = selectRecentUserAssistantReplayRecords(newestFirst.toReversed());
		return selected.map((record, index) => Object.assign({}, record, { parentId: index === 0 ? null : recordId(selected[index - 1]) ?? null }));
	} catch {
		return [];
	}
}
async function buildSessionResetBoundaryPlan(params) {
	const seedEvents = (params.events.some((event) => {
		const type = event !== null && typeof event === "object" && !Array.isArray(event) ? event.type : void 0;
		return type === "message" || type === "compaction" || type === "reset";
	}) ? [] : await readLegacyTranscriptEvents(params.legacySessionFile)).filter((event) => event !== null && typeof event === "object" && !Array.isArray(event) && event.type !== "session");
	return {
		event: buildSessionResetBoundaryEvent({
			events: seedEvents.length > 0 ? [...params.events, ...seedEvents] : params.events,
			reason: params.reason
		}),
		seedEvents
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-lifecycle-state.ts
function shouldRemoveSessionEntry(entry, removal) {
	if (!entry) return false;
	if (removal.expectedEntry !== void 0 && JSON.stringify(entry) !== JSON.stringify(removal.expectedEntry)) return false;
	if (removal.expectedSessionId !== void 0 && entry.sessionId !== removal.expectedSessionId) return false;
	if (removal.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== removal.expectedLifecycleRevision) return false;
	if (removal.expectedUpdatedAt !== void 0 && entry.updatedAt !== removal.expectedUpdatedAt) return false;
	return true;
}
function sessionKeySegmentStartsWith(sessionKey, prefix) {
	const firstSeparator = sessionKey.indexOf(":");
	if (firstSeparator < 0) return sessionKey.startsWith(prefix);
	const secondSeparator = sessionKey.indexOf(":", firstSeparator + 1);
	return (secondSeparator < 0 ? sessionKey : sessionKey.slice(secondSeparator + 1)).startsWith(prefix);
}
function sessionKeyBelongsToAgent(sessionKey, agentId) {
	if (agentId === void 0) return true;
	const parsed = parseAgentSessionKey(sessionKey);
	return parsed !== null && normalizeAgentId(parsed.agentId) === normalizeAgentId(agentId);
}
function readSessionTranscriptUpdatedAt(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("created_at").as("updated_at")).where("session_id", "=", sessionId));
	if (row?.updated_at === null || row?.updated_at === void 0) return;
	return coerceSqliteNumber(row.updated_at);
}
function sqliteTranscriptStateIsReclaimable(params) {
	const transcriptUpdatedAt = readSessionTranscriptUpdatedAt(params.database, params.sessionId);
	const updatedAt = params.sessionUpdatedAt === void 0 ? transcriptUpdatedAt : Math.max(params.sessionUpdatedAt, transcriptUpdatedAt ?? params.sessionUpdatedAt);
	return updatedAt === void 0 || params.nowMs - updatedAt >= params.orphanTranscriptMinAgeMs;
}
function sqliteTranscriptStateHasMarker(params) {
	const db = getSessionKysely(params.database.db);
	return executeSqliteQuerySync(params.database.db, db.selectFrom("transcript_events").select("event_json").where("session_id", "=", params.sessionId).orderBy("seq", "asc")).rows.some((row) => row.event_json.includes(params.transcriptContentMarker));
}
/** Session ids protected by live node state. */
function readReferencedSessionIds(database, excludedSessionKeys = /* @__PURE__ */ new Set()) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"entry_json",
		"current_session_id",
		"session_key"
	])).rows;
	const sessionIds = /* @__PURE__ */ new Set();
	for (const row of rows) {
		if (excludedSessionKeys.has(row.session_key)) continue;
		sessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	}
	return sessionIds;
}
function readReferencedSessionIdsAfterTargetMutation(database, target, nextEntry) {
	const removedKeys = new Set(uniqueStrings([target.canonicalKey, ...target.storeKeys].map((key) => key.trim())));
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"entry_json",
		"session_key",
		"current_session_id"
	])).rows;
	const sessionIds = /* @__PURE__ */ new Set();
	for (const row of rows) {
		if (removedKeys.has(row.session_key)) continue;
		sessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	}
	if (nextEntry) for (const sessionId of collectSessionStateIdsForEntry(nextEntry)) sessionIds.add(sessionId);
	return sessionIds;
}
function planSessionStateDeleteIfUnreferenced(params) {
	if (params.referencedSessionIds.has(params.sessionId)) return null;
	return {
		agentId: params.database.agentId,
		archiveDirectory: params.archiveDirectory,
		archiveTranscript: params.archiveTranscript !== false && !isIncognitoOpenClawAgentDatabase(params.database),
		databasePath: params.database.path,
		reason: params.reason ?? "deleted",
		sessionId: params.sessionId,
		snapshot: readSessionStateDeleteSnapshot(params.database.db, params.sessionId)
	};
}
function deleteMaterializedSessionStatePlans(database, plans, protectedSessionIds, excludedSessionKeys) {
	const archivedTranscripts = [];
	const referencedSessionIds = readReferencedSessionIds(database, excludedSessionKeys);
	for (const sessionId of protectedSessionIds ?? []) referencedSessionIds.add(sessionId);
	for (const plan of plans) {
		if (referencedSessionIds.has(plan.sessionId)) continue;
		if (!sqliteSessionStateDeleteSnapshotsEqual(readSessionStateDeleteSnapshot(database.db, plan.sessionId), plan.snapshot)) throw new Error(`SQLite session state changed before deletion for ${plan.sessionId}`);
		deleteSqliteSessionStateRows(database, plan.sessionId);
		if (plan.snapshot.lastSeq !== null && plan.archivedTranscript) archivedTranscripts.push(plan.archivedTranscript);
	}
	return archivedTranscripts;
}
function planSessionStateAfterEntryRemoval(params) {
	const referencedSessionIds = params.referencedSessionIds ?? readReferencedSessionIds(params.database);
	const plans = [];
	for (const sessionId of collectSessionStateIdsForEntry(params.entry)) {
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveTranscript,
			archiveDirectory: params.archiveDirectory,
			database: params.database,
			reason: params.reason,
			referencedSessionIds,
			sessionId
		});
		if (plan) plans.push(plan);
	}
	return plans;
}
/** Ids of every persisted generation owned by the given logical session keys. */
function readSessionGenerationIdsForKeys(database, keys, options = {}) {
	const sessionKeys = uniqueStrings([...keys].map((key) => options.exactStoredKeys ? key : key.trim()));
	if (sessionKeys.length === 0) return [];
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "in", sessionKeys)).rows.map((row) => row.session_id);
}
async function projectSessionEntryLifecycleMutation(database, params) {
	const store = readSessionEntryStore(database, { allowCanonicalRepair: params.allowCanonicalRepair === true });
	const removedEntries = [];
	const removedKeysToArchive = /* @__PURE__ */ new Set();
	const changedSessionKeys = /* @__PURE__ */ new Set();
	const projectedRemovals = [];
	for (const removal of params.removals) {
		const sessionKey = removal.exactStoredKey ? removal.sessionKey : removal.sessionKey.trim();
		let entry = removal.exactStoredKey || sessionKey ? store[sessionKey] : void 0;
		if (removal.expectedRawEntryJson !== void 0) {
			if (readExactSessionEntryJsonForCanonicalRepair(database, sessionKey) !== removal.expectedRawEntryJson) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${sessionKey}`);
			entry = removal.expectedEntry ? cloneSessionEntry(removal.expectedEntry) : void 0;
		}
		if (!shouldRemoveSessionEntry(entry, removal)) continue;
		projectedRemovals.push({
			expectedEntry: cloneSessionEntry(entry),
			removal,
			sessionKey
		});
		removedEntries.push({
			archiveTranscript: removal.archiveRemovedTranscript === true,
			entry
		});
		if (removal.archiveRemovedTranscript === true) removedKeysToArchive.add(sessionKey);
		changedSessionKeys.add(sessionKey);
		delete store[sessionKey];
	}
	const upsertedEntries = [];
	for (const upsert of params.upserts) {
		const sessionKey = upsert.sessionKey.trim();
		if (!sessionKey) continue;
		const expectedEntry = store[sessionKey] ? cloneSessionEntry(store[sessionKey]) : void 0;
		if (upsert.resetBoundaryReason && !expectedEntry) throw new Error(`Cannot append reset boundary without an existing session row: ${sessionKey}`);
		const entry = upsert.buildEntry === void 0 ? upsert.entry : await upsert.buildEntry({
			currentEntry: expectedEntry ? cloneSessionEntry(expectedEntry) : void 0,
			sessionKey,
			store
		});
		if (!entry) continue;
		const cloned = cloneSessionEntry(entry);
		store[sessionKey] = cloned;
		changedSessionKeys.add(sessionKey);
		const resetBoundaryPlan = upsert.resetBoundaryReason && expectedEntry?.sessionId ? await buildSessionResetBoundaryPlan({
			events: loadTranscriptEventsFromDatabase(database, expectedEntry.sessionId),
			reason: upsert.resetBoundaryReason
		}) : void 0;
		upsertedEntries.push({
			expectedEntry,
			sessionKey,
			entry: cloned,
			...resetBoundaryPlan ? { resetBoundaryPlan } : {}
		});
	}
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: changedSessionKeys,
		projectedStore: store
	});
	const deletePlans = removedEntries.flatMap(({ archiveTranscript, entry }) => planSessionStateAfterEntryRemoval({
		archiveDirectory: params.archiveDirectory,
		archiveTranscript,
		database,
		entry,
		reason: "deleted",
		referencedSessionIds
	}));
	const plannedIds = new Set(deletePlans.map((plan) => plan.sessionId));
	for (const sessionId of readSessionGenerationIdsForKeys(database, removedKeysToArchive)) {
		if (plannedIds.has(sessionId)) continue;
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveDirectory: params.archiveDirectory,
			archiveTranscript: true,
			database,
			reason: "deleted",
			referencedSessionIds,
			sessionId
		});
		if (plan) {
			deletePlans.push(plan);
			plannedIds.add(sessionId);
		}
	}
	return {
		deletePlans,
		removals: projectedRemovals,
		upsertedEntries
	};
}
function collectReferencedSqliteSessionIdsFromStore(store) {
	const sessionIds = /* @__PURE__ */ new Set();
	for (const entry of Object.values(store)) for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	return sessionIds;
}
function collectProjectedReferencedSessionIds(params) {
	const excludedSessionKeys = new Set(params.excludedSessionKeys);
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		"entry_json",
		"session_key",
		"current_session_id"
	])).rows;
	const sessionIds = /* @__PURE__ */ new Set();
	for (const row of rows) {
		if (excludedSessionKeys.has(row.session_key)) continue;
		sessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (!entry) continue;
		for (const sessionId of collectSessionStateIdsForEntry(entry)) sessionIds.add(sessionId);
	}
	for (const sessionId of collectReferencedSqliteSessionIdsFromStore(params.projectedStore)) sessionIds.add(sessionId);
	return sessionIds;
}
function deleteSqliteSessionStateRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	executeSqliteQuerySync(database.db, db.deleteFrom("session_windows").where("session_id", "=", sessionId));
}
function planSqliteOrphanLifecycleTranscriptStateDeletes(params) {
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"plugin_owner_id"
	]).orderBy("session_id", "asc")).rows;
	const deletePlans = [];
	for (const row of rows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || params.referencedSessionIds.has(row.session_id) || params.excludedSessionIds?.has(row.session_id) || params.pluginOwnerId && row.plugin_owner_id && row.plugin_owner_id !== params.pluginOwnerId) continue;
		if (!sqliteTranscriptStateIsReclaimable({
			database: params.database,
			sessionId: row.session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		}) || !sqliteTranscriptStateHasMarker({
			database: params.database,
			sessionId: row.session_id,
			transcriptContentMarker: params.transcriptContentMarker
		})) continue;
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database: params.database,
			reason: "deleted",
			referencedSessionIds: params.referencedSessionIds,
			sessionId: row.session_id
		});
		if (plan) deletePlans.push(plan);
	}
	return deletePlans;
}
function planSessionLifecycleArtifactCleanup(database, params) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"entry_json",
		"session_key",
		"current_session_id",
		"updated_at"
	]).orderBy("session_key", "asc")).rows;
	const removedSessionIds = /* @__PURE__ */ new Set();
	const entries = [];
	const projectedStore = readSessionEntryStore(database);
	const foreignOwnedSessionIds = params.pluginOwnerId ? new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("plugin_owner_id", "is not", null).where("plugin_owner_id", "!=", params.pluginOwnerId)).rows.map((row) => row.session_id)) : void 0;
	for (const row of rows) {
		if (!sessionKeyBelongsToAgent(row.session_key, params.agentId) || !sessionKeySegmentStartsWith(row.session_key, params.sessionKeySegmentPrefix)) continue;
		const entry = parseSessionEntryJson(row);
		const sessionIds = uniqueStrings([row.current_session_id, ...entry ? collectSessionStateIdsForEntry(entry) : []]);
		if (params.pluginOwnerId && entry?.pluginOwnerId && entry.pluginOwnerId !== params.pluginOwnerId || sessionIds.some((sessionId) => foreignOwnedSessionIds?.has(sessionId))) continue;
		if (!sqliteTranscriptStateIsReclaimable({
			database,
			sessionUpdatedAt: coerceSqliteNumber(row.updated_at),
			sessionId: row.current_session_id,
			nowMs: params.nowMs,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs
		})) continue;
		for (const sessionId of sessionIds) removedSessionIds.add(sessionId);
		entries.push({
			expectedEntry: entry ? cloneSessionEntry(entry) : void 0,
			sessionKey: row.session_key
		});
		delete projectedStore[row.session_key];
	}
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: entries.map((entry) => entry.sessionKey),
		projectedStore
	});
	const deletePlans = [];
	for (const sessionId of removedSessionIds) {
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: params.archiveRemovedEntryTranscripts,
			archiveDirectory: params.archiveDirectory,
			database,
			referencedSessionIds,
			sessionId
		});
		if (plan) deletePlans.push(plan);
	}
	deletePlans.push(...planSqliteOrphanLifecycleTranscriptStateDeletes({
		...params.agentId ? { agentId: params.agentId } : {},
		archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
		archiveDirectory: params.archiveDirectory,
		database,
		excludedSessionIds: removedSessionIds,
		...params.pluginOwnerId ? { pluginOwnerId: params.pluginOwnerId } : {},
		referencedSessionIds,
		transcriptContentMarker: params.transcriptContentMarker,
		orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
		nowMs: params.nowMs
	}));
	return {
		deletePlans,
		entries
	};
}
function deletePlannedLifecycleArtifactEntries(database, entries) {
	assertPlannedLifecycleArtifactEntriesUnchanged(database, entries);
	let removedEntries = 0;
	for (const planned of entries) {
		deleteSessionEntryRows(database, planned.sessionKey);
		removedEntries += 1;
	}
	return removedEntries;
}
function assertPlannedLifecycleArtifactEntriesUnchanged(database, entries) {
	for (const planned of entries) {
		const current = readExactSessionEntryRow(database, planned.sessionKey)?.entry;
		if (!sqliteSessionEntriesEqual(current, planned.expectedEntry)) throw new Error(`SQLite lifecycle cleanup entry changed for ${planned.sessionKey}`);
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-canonical-inventory.ts
/** Doctor inventory hydrates rejected legacy blobs from promoted node/window columns. */
function hydrateCanonicalRepairEntry(row) {
	let record = {};
	try {
		const parsed = JSON.parse(row.entry_json);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) record = parsed;
	} catch {}
	const createdActor = row.created_actor_type ? {
		type: row.created_actor_type,
		...row.created_actor_id ? { id: row.created_actor_id } : {}
	} : void 0;
	const forkSource = row.fork_source_session_key && row.fork_source_session_id ? {
		sessionKey: row.fork_source_session_key,
		sessionId: row.fork_source_session_id,
		...row.fork_source_entry_id ? { entryId: row.fork_source_entry_id } : {}
	} : void 0;
	const delivery = row.delivery_channel && row.delivery_target ? normalizeSessionDeliveryState({ context: {
		channel: row.delivery_channel,
		to: row.delivery_target,
		...row.delivery_account_id ? { accountId: row.delivery_account_id } : {},
		...row.delivery_thread_id ? { threadId: row.delivery_thread_id } : {}
	} }) : void 0;
	return projectCanonicalSessionEntryShape({
		...record,
		...row.status ? { status: row.status } : {},
		...row.current_started_at !== null ? { startedAt: row.current_started_at } : {},
		...row.current_ended_at !== null ? { endedAt: row.current_ended_at } : {},
		...row.current_chat_type ? { chatType: row.current_chat_type } : {},
		...row.current_model_provider ? { modelProvider: row.current_model_provider } : {},
		...row.current_model ? { model: row.current_model } : {},
		...row.current_previous_session_id ? { previousSessionId: row.current_previous_session_id } : {},
		...row.current_agent_harness_id ? { agentHarnessId: row.current_agent_harness_id } : {},
		...delivery ? { delivery } : {},
		...row.created_at !== null ? { createdAt: row.created_at } : {},
		...row.created_via ? { createdVia: row.created_via } : {},
		...createdActor ? { createdActor } : {},
		...row.spawned_by ? { spawnedBy: row.spawned_by } : {},
		...row.parent_session_key && row.parent_session_key !== row.spawned_by ? { parentSessionKey: row.parent_session_key } : {},
		...forkSource ? { forkSource } : {},
		...row.label ? { label: row.label } : {},
		...row.display_name ? { displayName: row.display_name } : {},
		...row.category ? { category: row.category } : {},
		...row.pinned_at !== null ? { pinnedAt: row.pinned_at } : {},
		...row.archived_at !== null ? { archivedAt: row.archived_at } : {},
		...row.last_read_at !== null ? { lastReadAt: row.last_read_at } : {},
		...row.last_interaction_at !== null ? { lastInteractionAt: row.last_interaction_at } : {},
		...row.last_activity_at !== null ? { lastActivityAt: row.last_activity_at } : {},
		sessionId: row.current_session_id,
		updatedAt: row.updated_at
	});
}
function listSqliteSessionEntriesWithCanonicalOwnerEvidence(scope = {}) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").leftJoin("session_windows as current_window", (join) => join.onRef("current_window.session_id", "=", "session_nodes.current_session_id").onRef("current_window.session_key", "=", "session_nodes.session_key")).leftJoin("session_windows as current_window_owner", "current_window_owner.session_id", "session_nodes.current_session_id").leftJoin("conversations as current_conversation", "current_conversation.conversation_id", "current_window.primary_conversation_id").selectAll("session_nodes").select([
			"current_window_owner.session_key as current_window_owner_session_key",
			"current_window.started_at as current_started_at",
			"current_window.ended_at as current_ended_at",
			"current_window.chat_type as current_chat_type",
			"current_window.model_provider as current_model_provider",
			"current_window.model as current_model",
			"current_window.previous_session_id as current_previous_session_id",
			"current_window.agent_harness_id as current_agent_harness_id",
			"current_conversation.channel as delivery_channel",
			"current_conversation.account_id as delivery_account_id",
			"current_conversation.delivery_target",
			"current_conversation.thread_id as delivery_thread_id"
		])).rows;
		const persistedEntries = new Map(rows.map((row) => [row.session_key, parseSessionEntryJson(row)]));
		const validSessionKeysById = /* @__PURE__ */ new Map();
		for (const row of rows) {
			if (row.entry_valid !== 1 || !persistedEntries.get(row.session_key)) continue;
			const keys = validSessionKeysById.get(row.current_session_id) ?? [];
			keys.push(row.session_key);
			validSessionKeysById.set(row.current_session_id, keys);
		}
		return rows.flatMap((row) => {
			const isEmptyWindowOwner = row.entry_json === "{}" && row.current_window_owner_session_key === row.session_key;
			const competingValidKeys = (validSessionKeysById.get(row.current_session_id) ?? []).filter((sessionKey) => sessionKey !== row.session_key);
			const canonicalOwnerSessionKey = isEmptyWindowOwner ? competingValidKeys.length === 1 ? competingValidKeys[0] : void 0 : row.entry_json === "{}" && row.current_window_owner_session_key && persistedEntries.has(row.current_window_owner_session_key) ? row.current_window_owner_session_key : void 0;
			if (isEmptyWindowOwner && !canonicalOwnerSessionKey) return [];
			const persistedEntry = persistedEntries.get(row.session_key);
			const entry = persistedEntry ?? hydrateCanonicalRepairEntry(row);
			const lineageProjectionMismatch = Boolean(persistedEntry && ((row.parent_session_key ?? void 0) !== (persistedEntry.parentSessionKey ?? persistedEntry.spawnedBy ?? void 0) || (row.spawned_by ?? void 0) !== (persistedEntry.spawnedBy ?? void 0) || (row.fork_source_session_key ?? void 0) !== (persistedEntry.forkSource?.sessionKey ?? void 0)));
			const rawCompareRequired = row.entry_valid !== 1 || !persistedEntry || lineageProjectionMismatch;
			return [{
				sessionKey: row.session_key,
				entry,
				...canonicalOwnerSessionKey ? { canonicalOwnerSessionKey } : {},
				...rawCompareRequired ? { rawEntryJson: row.entry_json } : {}
			}];
		});
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : [];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-canonical-repair.ts
function listSqliteSessionEntriesForCanonicalRepair(scope = {}) {
	return listSqliteSessionEntriesWithCanonicalOwnerEvidence(scope);
}
function resolveSqliteCanonicalRepairLookupKeys(canonicalKey, storedKeys) {
	return uniqueStrings([
		canonicalKey,
		...storedKeys,
		...storedKeys.flatMap((key) => {
			const trimmedKey = key.trim();
			return [trimmedKey, normalizeStoreSessionKey(trimmedKey)];
		})
	]);
}
/** Doctor probes only the exact staged target and may replace a malformed partial row. */
function readExactSessionEntryRowForCanonicalRepair(database, sessionKey, options = {}) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").selectAll().where("session_key", "=", sessionKey));
	if (!row) return;
	if (row.entry_json === "{}") {
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", row.current_session_id).where("session_key", "=", row.session_key))) return;
	}
	const parsedEntry = parseSessionEntryJson(row);
	if (!parsedEntry && !options.allowMalformedRowRepair) throw canonicalSessionKeyMigrationRequiredError(`invalid persisted session row requires repair for ${sessionKey}`);
	return {
		entry: parsedEntry ?? {
			sessionId: row.current_session_id,
			updatedAt: row.updated_at
		},
		legacyKeys: [],
		row
	};
}
/** Doctor-only cross-store copy; the source node remains until lifecycle archival succeeds. */
function copySqliteSessionOwnedStateForCanonicalRepair(params) {
	const sourceDatabase = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteStoreScope(params.source.storePath, { agentId: params.source.agentId })));
	copySqliteSessionOwnedStateForRepair({
		canonicalKey: params.canonicalKey,
		destination: params.destinationDatabase,
		...params.preferredEntry ? { preferredEntry: params.preferredEntry } : {},
		...params.preferredSessionKey ? { preferredSessionKey: params.preferredSessionKey } : {},
		source: sourceDatabase,
		sourceEntries: params.sourceEntries,
		sourceKeys: params.sourceKeys
	});
}
/** Doctor-only inventory of every generation copied for one canonical-key group. */
function listSqliteSessionGenerationIdsForCanonicalRepair(params) {
	return readSessionGenerationIdsForKeys(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteStoreScope(params.storePath, { agentId: params.agentId }))), uniqueStrings(params.sourceKeys), { exactStoredKeys: true });
}
/** Doctor-only same-store rewrite for delivery attribution owned by removed aliases. */
function rehomeSqliteSessionDeliveryReferencesForCanonicalRepair(database, canonicalKey, previousKeys) {
	rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, [{
		canonicalKey,
		previousKeys
	}]);
}
/** Doctor-only batched delivery rewrite with one session identity inventory per database. */
function rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, repairs) {
	if (repairs.length === 0) return;
	const db = getSessionKysely(database.db);
	const storedSessionKeys = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.map((row) => row.session_key);
	const storedSessionKeySet = new Set(storedSessionKeys);
	const identityCounts = /* @__PURE__ */ new Map();
	for (const sessionKey of storedSessionKeys) {
		const identity = normalizeStoreSessionKey(sessionKey.trim());
		identityCounts.set(identity, (identityCounts.get(identity) ?? 0) + 1);
	}
	for (const repair of repairs) {
		const ownedKeys = /* @__PURE__ */ new Set([repair.canonicalKey, ...repair.previousKeys]);
		const ownedIdentityCounts = /* @__PURE__ */ new Map();
		for (const sessionKey of ownedKeys) {
			if (!storedSessionKeySet.has(sessionKey)) continue;
			const identity = normalizeStoreSessionKey(sessionKey.trim());
			ownedIdentityCounts.set(identity, (ownedIdentityCounts.get(identity) ?? 0) + 1);
		}
		const aliases = resolveSqliteCanonicalRepairLookupKeys(repair.canonicalKey, repair.previousKeys).filter((key) => {
			if (key === repair.canonicalKey) return false;
			if (ownedKeys.has(key)) return true;
			const identity = normalizeStoreSessionKey(key.trim());
			return (identityCounts.get(identity) ?? 0) <= (ownedIdentityCounts.get(identity) ?? 0);
		});
		if (aliases.length === 0) continue;
		executeSqliteQuerySync(database.db, db.updateTable("conversation_deliveries").set({ source_session_key: repair.canonicalKey }).where("source_session_key", "in", aliases));
	}
}
function copySqliteSessionOwnedStateForRepair(params) {
	const storedSourceKeys = uniqueStrings(params.sourceKeys.filter((key) => key.length > 0));
	if (storedSourceKeys.length === 0) return;
	const sourceKeys = storedSourceKeys;
	const sourceDb = getSessionKysely(params.source.db);
	const destinationDb = getSessionKysely(params.destination.db);
	const entrySessionIds = uniqueStrings(params.sourceEntries.flatMap((entry) => [...collectSessionStateIdsForEntry(entry)]));
	const windows = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_windows").selectAll().where((eb) => entrySessionIds.length === 0 ? eb("session_key", "in", sourceKeys) : eb.or([eb("session_key", "in", sourceKeys), eb("session_id", "in", entrySessionIds)]))).rows;
	const sessionIds = uniqueStrings([...windows.map((row) => row.session_id), ...entrySessionIds]);
	const sessionLinks = sessionIds.length === 0 ? [] : executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_conversations").selectAll().where("session_id", "in", sessionIds)).rows;
	const linkedConversationIds = uniqueStrings([...windows.flatMap((row) => row.primary_conversation_id ? [row.primary_conversation_id] : []), ...sessionLinks.map((row) => row.conversation_id)]);
	const sourceKeyReferences = new Set(sourceKeys);
	const sourceLineageIdentities = new Set(sourceKeys.map((key) => normalizeStoreSessionKey(key.trim())));
	const deliveryLookupKeys = resolveSqliteCanonicalRepairLookupKeys(params.canonicalKey, sourceKeys);
	const competingDeliveryIdentities = new Set(executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => sourceKeyReferences.has(row.session_key) ? [] : [normalizeStoreSessionKey(row.session_key.trim())]));
	const deliverySourceKeys = deliveryLookupKeys.filter((key) => sourceKeyReferences.has(key) || !competingDeliveryIdentities.has(normalizeStoreSessionKey(key.trim())));
	const deliverySourceKeyReferences = new Set(deliverySourceKeys);
	const deliveries = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversation_deliveries").selectAll().where("source_session_key", "in", deliverySourceKeys)).rows;
	const conversationIds = uniqueStrings([...linkedConversationIds, ...deliveries.map((delivery) => delivery.conversation_id)]);
	if (conversationIds.length > 0) {
		const conversations = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("conversations").selectAll().where("conversation_id", "in", conversationIds)).rows;
		for (const conversation of conversations) {
			const { conversation_id: _conversationId, ...replacement } = conversation;
			executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("conversations").values(conversation).onConflict((conflict) => conflict.column("conversation_id").doUpdateSet(replacement)));
		}
		for (const delivery of deliveries) {
			const canonicalDelivery = {
				...delivery,
				source_session_key: delivery.source_session_key !== null && deliverySourceKeyReferences.has(delivery.source_session_key) ? params.canonicalKey : delivery.source_session_key
			};
			const { operation_id: _operationId, ...replacement } = canonicalDelivery;
			executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("conversation_deliveries").values(canonicalDelivery).onConflict((conflict) => conflict.column("operation_id").doUpdateSet(replacement)));
		}
	}
	const preferredWindowProjection = params.preferredEntry ? bindSessionWindowEntryProjection({
		entry: params.preferredEntry,
		sessionKey: params.canonicalKey
	}) : void 0;
	const preferredWindowProvenance = params.preferredEntry ? executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("session_windows").select([
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source"
	]).where("session_id", "=", params.preferredEntry.sessionId)) : void 0;
	for (const window of windows) {
		const canonicalWindow = {
			...window,
			session_key: params.canonicalKey,
			parent_session_key: window.parent_session_key && sourceLineageIdentities.has(normalizeStoreSessionKey(window.parent_session_key.trim())) ? params.canonicalKey : window.parent_session_key,
			spawned_by: window.spawned_by && sourceLineageIdentities.has(normalizeStoreSessionKey(window.spawned_by.trim())) ? params.canonicalKey : window.spawned_by,
			...preferredWindowProjection && window.session_id === params.preferredEntry?.sessionId ? {
				...preferredWindowProjection,
				...preferredWindowProvenance
			} : {}
		};
		const { session_id: _sessionId, ...replacement } = { ...canonicalWindow };
		executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_windows").values(canonicalWindow).onConflict((conflict) => conflict.column("session_id").doUpdateSet(replacement)));
	}
	const copiedWindowIds = new Set(windows.map((row) => row.session_id));
	for (const sessionId of entrySessionIds) {
		if (copiedWindowIds.has(sessionId)) continue;
		const entry = (params.preferredEntry?.sessionId === sessionId ? params.preferredEntry : void 0) ?? params.sourceEntries.find((candidate) => candidate.sessionId === sessionId) ?? params.sourceEntries.find((candidate) => new Set(collectSessionStateIdsForEntry(candidate)).has(sessionId));
		const updatedAt = entry?.updatedAt ?? Date.now();
		const recoveryWindow = {
			session_key: params.canonicalKey,
			previous_session_id: entry?.sessionId === sessionId ? entry.previousSessionId ?? null : null,
			reason: "recovery",
			session_scope: "conversation",
			created_at: updatedAt,
			updated_at: updatedAt
		};
		executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_windows").values({
			session_id: sessionId,
			...recoveryWindow
		}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({ session_key: params.canonicalKey })));
	}
	for (const link of sessionLinks) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("session_conversations").values(link).onConflict((conflict) => conflict.columns([
		"session_id",
		"conversation_id",
		"role"
	]).doUpdateSet({
		first_seen_at: link.first_seen_at,
		last_seen_at: link.last_seen_at
	})));
	for (const sessionId of sessionIds) {
		if (!copySqliteSessionGenerationRows({
			destination: params.destination,
			sessionId,
			source: params.source,
			sourceWindowPresent: copiedWindowIds.has(sessionId)
		})) continue;
		deleteSessionTranscriptIndexInTransaction(params.destination.db, sessionId);
		reconcileSessionTranscriptIndexInTransaction(params.destination.db, sessionId);
		publishSessionEntryCacheInvalidation(params.destination);
	}
	deleteSessionMembersForRepair(params.destination, params.canonicalKey);
	copySessionNodeArtifactsForRepair(params.source, params.destination, sourceKeys, params.canonicalKey, { includeMembers: false });
	copySessionNodeArtifactsForRepair(params.source, params.destination, params.preferredSessionKey ? [params.preferredSessionKey] : sourceKeys, params.canonicalKey);
}
function copySqliteSessionGenerationRows(params) {
	const sourceDb = getSessionKysely(params.source.db);
	const destinationDb = getSessionKysely(params.destination.db);
	const transcriptEvents = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("transcript_events").selectAll().where("session_id", "=", params.sessionId)).rows;
	const transcriptIdentities = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("transcript_event_identities").selectAll().where("session_id", "=", params.sessionId)).rows;
	const rewriteWatermarks = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("transcript_rewrite_watermarks").selectAll().where("session_id", "=", params.sessionId)).rows;
	const trajectoryEvents = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("trajectory_runtime_events").selectAll().where("session_id", "=", params.sessionId)).rows;
	const parentStreamEvents = executeSqliteQuerySync(params.source.db, sourceDb.selectFrom("acp_parent_stream_events").selectAll().where("session_id", "=", params.sessionId)).rows;
	if (!params.sourceWindowPresent && transcriptEvents.length === 0 && transcriptIdentities.length === 0 && rewriteWatermarks.length === 0 && trajectoryEvents.length === 0 && parentStreamEvents.length === 0) return false;
	for (const table of [
		"transcript_event_identities",
		"transcript_events",
		"transcript_rewrite_watermarks",
		"trajectory_runtime_events",
		"acp_parent_stream_events"
	]) executeSqliteQuerySync(params.destination.db, destinationDb.deleteFrom(table).where("session_id", "=", params.sessionId));
	for (const row of transcriptEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("transcript_events").values(row));
	for (const row of transcriptIdentities) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("transcript_event_identities").values(row));
	for (const row of rewriteWatermarks) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("transcript_rewrite_watermarks").values(row));
	for (const row of trajectoryEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("trajectory_runtime_events").values(row));
	for (const row of parentStreamEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("acp_parent_stream_events").values(row));
	return true;
}
//#endregion
export { readFileRangeAsync as C, streamSessionTranscriptLinesReverse as S, readReferencedSessionIdsAfterTargetMutation as _, rehomeSqliteSessionDeliveryReferencesForCanonicalRepair as a, buildSessionResetBoundaryPlan as b, assertPlannedLifecycleArtifactEntriesUnchanged as c, deletePlannedLifecycleArtifactEntries as d, planSessionLifecycleArtifactCleanup as f, readReferencedSessionIds as g, projectSessionEntryLifecycleMutation as h, readExactSessionEntryRowForCanonicalRepair as i, collectProjectedReferencedSessionIds as l, planSessionStateDeleteIfUnreferenced as m, listSqliteSessionEntriesForCanonicalRepair as n, rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch as o, planSessionStateAfterEntryRemoval as p, listSqliteSessionGenerationIdsForCanonicalRepair as r, listSqliteSessionEntriesWithCanonicalOwnerEvidence as s, copySqliteSessionOwnedStateForCanonicalRepair as t, deleteMaterializedSessionStatePlans as u, readSessionGenerationIdsForKeys as v, streamSessionTranscriptLines as x, shouldRemoveSessionEntry as y };
