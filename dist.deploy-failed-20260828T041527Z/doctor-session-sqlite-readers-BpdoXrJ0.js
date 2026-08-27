import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { Bt as tableExists, Vt as tableHasColumn } from "./openclaw-state-db-kmBThqu6.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import "./openclaw-agent-db-BEQsKM0c.js";
import { B as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-10dvR_dO.js";
import { a as resolveAllAgentSessionStoreCandidateTargetsSync } from "./targets-CSCF74bk.js";
import { c as normalizeLoadedFileEntry, f as partitionSessionFileEntries, o as migrateSessionFileEntryToCurrentVersion } from "./session-manager-codec-CANcDH2n.js";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { TextDecoder } from "node:util";
//#region src/commands/doctor-session-sqlite-readers.ts
/** Read-only diagnostic readers used by the session SQLite doctor mode. */
const JSONL_READ_CHUNK_BYTES = 64 * 1024;
const MAX_LEGACY_COMPACTION_TARGETS = 1e5;
function countTranscriptEventsForPath(transcriptPath) {
	if (!transcriptPath) return {
		status: "ok",
		events: 0
	};
	if (!fs.existsSync(transcriptPath)) return { status: "missing" };
	let events = 0;
	try {
		for (const line of iterateJsonlLinesSync(transcriptPath)) {
			if (!parseJsonlLine(line)) continue;
			events += 1;
		}
		return {
			status: "ok",
			events
		};
	} catch (err) {
		return {
			status: "malformed",
			message: String(err)
		};
	}
}
function createTranscriptEventReader(transcriptPath, sessionId, allowMalformedPrefix = false, sourceFingerprint = readTranscriptFingerprint(transcriptPath)) {
	return (append) => {
		for (const event of readTranscriptEventsForImport(transcriptPath, sessionId, allowMalformedPrefix, sourceFingerprint)) append(event);
	};
}
function readTranscriptEventsForImport(transcriptPath, sessionId, allowMalformedPrefix, sourceFingerprint) {
	const plan = planTranscriptImport(transcriptPath, allowMalformedPrefix);
	assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
	const classificationHeader = {
		id: sessionId,
		type: "session",
		version: plan.sourceVersion,
		timestamp: "",
		cwd: ""
	};
	const idPrefix = createHash("sha256").update(transcriptPath).update("\0").update(sessionId).digest("hex").slice(0, 16);
	return { *[Symbol.iterator]() {
		assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
		const migratedTargetIds = /* @__PURE__ */ new Map();
		const migrationState = {
			createEntryId: (originalIndex) => `${idPrefix}-${originalIndex.toString(36)}`,
			previousId: null,
			resolveOriginalEntryId: (originalIndex) => migratedTargetIds.get(originalIndex),
			sourceVersion: plan.sourceVersion
		};
		for (const { event: loadedEvent, originalIndex } of iterateTranscriptEvents(transcriptPath, allowMalformedPrefix)) {
			let event = loadedEvent;
			let recognizedEvent;
			if (originalIndex === plan.headerIndex) {
				const canonicalHeader = {
					...event,
					id: sessionId,
					type: "session",
					timestamp: typeof event.timestamp === "string" ? event.timestamp : "",
					cwd: "cwd" in event && typeof event.cwd === "string" ? event.cwd : ""
				};
				Reflect.deleteProperty(canonicalHeader, "sessionId");
				event = canonicalHeader;
				recognizedEvent = event;
			} else recognizedEvent = partitionSessionFileEntries([classificationHeader, event]).fileEntriesByOriginalIndex[1];
			if (recognizedEvent) {
				migrateSessionFileEntryToCurrentVersion(recognizedEvent, originalIndex, migrationState);
				if (recognizedEvent.type !== "session" && plan.compactionTargetIndexes.has(originalIndex)) migratedTargetIds.set(originalIndex, recognizedEvent.id);
				event = recognizedEvent;
			}
			yield event;
		}
		assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
	} };
}
var TranscriptImportLimitError = class extends Error {};
function readTranscriptFingerprint(transcriptPath) {
	const stat = fs.statSync(transcriptPath, { bigint: true });
	return {
		ctimeNs: stat.ctimeNs,
		dev: stat.dev,
		ino: stat.ino,
		mtimeNs: stat.mtimeNs,
		size: stat.size
	};
}
function assertTranscriptFileUnchanged(transcriptPath, expected) {
	const current = readTranscriptFingerprint(transcriptPath);
	if (current.ctimeNs !== expected.ctimeNs || current.dev !== expected.dev || current.ino !== expected.ino || current.mtimeNs !== expected.mtimeNs || current.size !== expected.size) throw new Error("Legacy transcript changed during import; stop active session writers and rerun `openclaw doctor --fix`.");
}
function planTranscriptImport(transcriptPath, allowMalformedPrefix) {
	const plan = {
		compactionTargetIndexes: /* @__PURE__ */ new Set(),
		headerIndex: -1,
		sourceVersion: 1
	};
	for (const { event, originalIndex } of iterateTranscriptEvents(transcriptPath, allowMalformedPrefix)) {
		if (plan.headerIndex < 0 && isRecord(event) && event.type === "session") {
			plan.headerIndex = originalIndex;
			plan.sourceVersion = typeof event.version === "number" ? event.version : 1;
		}
		if (isRecord(event) && event.type === "compaction" && Number.isInteger(event.firstKeptEntryIndex) && Number(event.firstKeptEntryIndex) >= 0) {
			const targetIndex = Number(event.firstKeptEntryIndex);
			if (!plan.compactionTargetIndexes.has(targetIndex) && plan.compactionTargetIndexes.size >= MAX_LEGACY_COMPACTION_TARGETS) throw new TranscriptImportLimitError(`Transcript has more than ${MAX_LEGACY_COMPACTION_TARGETS} legacy compaction targets`);
			plan.compactionTargetIndexes.add(targetIndex);
		}
	}
	return plan;
}
function* iterateTranscriptEvents(transcriptPath, allowMalformedPrefix) {
	let originalIndex = 0;
	try {
		for (const line of iterateJsonlLinesSync(transcriptPath)) {
			const parsed = parseJsonlLine(line);
			if (!parsed) continue;
			yield {
				event: normalizeLoadedFileEntry(parsed),
				originalIndex
			};
			originalIndex += 1;
		}
	} catch (error) {
		if (!allowMalformedPrefix || error instanceof TranscriptImportLimitError) throw error;
	}
}
function readSqliteEntryCount(target) {
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		const raw = projection ? database.prepare(`SELECT count(*) AS count FROM ${projection.source}`).get() : void 0;
		return sqliteNumber((isRecord(raw) ? raw : void 0)?.count);
	});
	return result.ok ? result.value ?? 0 : 0;
}
function readOnlySqliteValidationSnapshot(target) {
	const empty = {
		sessionIdsBySessionKey: /* @__PURE__ */ new Map(),
		transcriptEventCountsBySessionId: /* @__PURE__ */ new Map()
	};
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		const sessionIdsBySessionKey = /* @__PURE__ */ new Map();
		if (projection) {
			const statement = database.prepare(`SELECT session_key, ${projection.sessionIdColumn} AS session_id
               FROM ${projection.source}
              ORDER BY session_key`);
			for (const row of statement.iterate()) sessionIdsBySessionKey.set(row.session_key, row.session_id);
		}
		const transcriptEventCountsBySessionId = /* @__PURE__ */ new Map();
		if (tableExists(database, "transcript_events")) {
			const statement = database.prepare("SELECT session_id, COUNT(*) AS count FROM transcript_events GROUP BY session_id ORDER BY session_id");
			for (const row of statement.iterate()) if (typeof row.session_id === "string" && typeof row.count === "number") transcriptEventCountsBySessionId.set(row.session_id, row.count);
		}
		return {
			sessionIdsBySessionKey,
			transcriptEventCountsBySessionId
		};
	});
	return result.ok ? {
		ok: true,
		snapshot: result.value ?? empty
	} : result;
}
function scanReadOnlySqliteActiveTranscriptFiles(target, visit) {
	const result = readSessionDatabase(target, (database) => {
		const projection = resolveSessionIdentityProjection(database);
		if (!projection) return;
		const rows = database.prepare(`SELECT session_key, ${projection.sessionIdColumn} AS session_id,
                CASE WHEN json_valid(entry_json)
                  THEN json_extract(entry_json, '$.sessionFile') END AS session_file
           FROM ${projection.source}
          ORDER BY session_key`).iterate();
		for (const row of rows) visit(row.session_key, row.session_id, row.session_file ?? void 0);
	});
	return result.ok ? { ok: true } : result;
}
function readSessionDatabase(target, read) {
	const sqlitePath = resolveTargetSqlitePath(target);
	if (!fs.existsSync(sqlitePath)) return {
		ok: true,
		value: void 0
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		return {
			ok: true,
			value: read(database)
		};
	} catch (error) {
		return {
			error,
			ok: false
		};
	} finally {
		database?.close();
	}
}
function resolveSessionIdentityProjection(database) {
	if (tableExists(database, "session_nodes")) return {
		sessionIdColumn: "current_session_id",
		source: `session_nodes WHERE ${tableHasColumn(database, "session_nodes", "entry_valid") ? "entry_valid = 1" : "entry_json <> '{}'"}`
	};
	return tableExists(database, "session_entries") ? {
		sessionIdColumn: "session_id",
		source: "session_entries"
	} : void 0;
}
function readOnlySqliteDbStats(target) {
	const sqlitePath = resolveTargetSqlitePath(target);
	const sizeFor = (filePath) => {
		try {
			return fs.statSync(filePath).size;
		} catch {
			return 0;
		}
	};
	if (!fs.existsSync(sqlitePath)) return {
		ok: true,
		stats: {
			dbSizeBytes: 0,
			largestSessions: [],
			totalTranscriptRowBytes: 0,
			walSizeBytes: sizeFor(`${sqlitePath}-wal`)
		}
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		const hasTranscriptEvents = tableExists(database, "transcript_events");
		const integrityRow = database.prepare("PRAGMA quick_check").get();
		if (!hasTranscriptEvents) return {
			ok: true,
			stats: {
				dbSizeBytes: sizeFor(sqlitePath),
				integrityCheck: typeof integrityRow?.quick_check === "string" ? integrityRow.quick_check : void 0,
				largestSessions: [],
				totalTranscriptRowBytes: 0,
				walSizeBytes: sizeFor(`${sqlitePath}-wal`)
			}
		};
		const totalRow = database.prepare("SELECT COALESCE(SUM(LENGTH(event_json)), 0) AS row_bytes FROM transcript_events").get();
		const largestRows = database.prepare(`
          SELECT session_id, COUNT(*) AS events, COALESCE(SUM(LENGTH(event_json)), 0) AS row_bytes
          FROM transcript_events
          GROUP BY session_id
          ORDER BY row_bytes DESC, events DESC, session_id ASC
          LIMIT 5
        `).all();
		return {
			ok: true,
			stats: {
				dbSizeBytes: sizeFor(sqlitePath),
				integrityCheck: typeof integrityRow?.quick_check === "string" ? integrityRow.quick_check : void 0,
				largestSessions: largestRows.flatMap((row) => {
					if (typeof row.session_id !== "string") return [];
					return [{
						events: sqliteNumber(row.events),
						rowBytes: sqliteNumber(row.row_bytes),
						sessionId: row.session_id
					}];
				}),
				totalTranscriptRowBytes: sqliteNumber(totalRow?.row_bytes),
				walSizeBytes: sizeFor(`${sqlitePath}-wal`)
			}
		};
	} catch (error) {
		return {
			error,
			ok: false
		};
	} finally {
		database?.close();
	}
}
function resolveTargetSqlitePath(target) {
	if (target.sqlitePath) return resolveOpenClawAgentSqlitePath({
		agentId: target.agentId,
		path: target.sqlitePath
	});
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId });
	return resolveOpenClawAgentSqlitePath({
		agentId: sqliteTarget.agentId ?? target.agentId,
		...sqliteTarget.path ? { path: sqliteTarget.path } : {}
	});
}
/**
* Enumerates existing per-agent session SQLite databases for a Doctor repair.
* Deduplicates by resolved path (aliases collapse to one target) and skips
* databases that do not yet exist on disk. Shared by every session-row repair
* so target enumeration cannot drift between repair surfaces.
*/
function listExistingAgentDatabaseTargets(cfg, env) {
	const seenPaths = /* @__PURE__ */ new Set();
	return resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env }).flatMap((target) => {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (seenPaths.has(sqlitePath) || !fs.existsSync(sqlitePath)) return [];
		seenPaths.add(sqlitePath);
		return [{
			agentId: target.agentId,
			sqlitePath,
			storePath: target.storePath
		}];
	});
}
function* iterateJsonlLinesSync(filePath) {
	const fd = fs.openSync(filePath, "r");
	const decoder = new TextDecoder("utf-8", { fatal: true });
	const buffer = Buffer.allocUnsafe(JSONL_READ_CHUNK_BYTES);
	let carry = "";
	let lineNumber = 0;
	try {
		while (true) {
			const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
			if (bytesRead === 0) break;
			carry += decoder.decode(buffer.subarray(0, bytesRead), { stream: true });
			const parts = carry.split(/\r?\n/);
			carry = parts.pop() ?? "";
			for (const part of parts) {
				lineNumber += 1;
				const text = part.trim();
				if (text) yield {
					lineNumber,
					text
				};
			}
		}
		carry += decoder.decode();
		const text = carry.trim();
		if (text) yield {
			lineNumber: lineNumber + 1,
			text
		};
	} catch (err) {
		throw new Error(`${filePath}:${lineNumber + 1}: ${String(err)}`, { cause: err });
	} finally {
		fs.closeSync(fd);
	}
}
function sqliteNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "bigint") return Number(value);
	return 0;
}
function parseJsonlLine(line) {
	return JSON.parse(line.text);
}
function readOnlySqliteTranscriptSessionIds(sqlitePath) {
	if (!fs.existsSync(sqlitePath)) return [];
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		if (!tableExists(database, "transcript_events")) return [];
		return database.prepare("SELECT DISTINCT session_id FROM transcript_events ORDER BY session_id ASC").all().filter((row) => typeof row.session_id === "string").map((row) => row.session_id);
	} finally {
		database?.close();
	}
}
function readOnlySqliteTranscriptSnapshot(sqlitePath, sessionId) {
	if (!fs.existsSync(sqlitePath)) return {
		ok: false,
		error: /* @__PURE__ */ new Error(`SQLite database not found: ${sqlitePath}`)
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		return {
			ok: true,
			rows: database.prepare("SELECT event_json, seq FROM transcript_events WHERE session_id = ? ORDER BY seq ASC").all(sessionId).filter((row) => typeof row.event_json === "string" && typeof row.seq === "number").map((row) => ({
				eventJson: row.event_json,
				seq: row.seq
			}))
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	} finally {
		database?.close();
	}
}
/** Reads exact row metadata for a guarded transcript replacement without opening a writer. */
function readOnlySqliteTranscriptStorageSnapshot(sqlitePath, sessionId) {
	if (!fs.existsSync(sqlitePath)) return {
		ok: false,
		error: /* @__PURE__ */ new Error(`SQLite database not found: ${sqlitePath}`)
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		const rows = database.prepare("SELECT created_at, event_json, seq FROM transcript_events WHERE session_id = ? ORDER BY seq ASC").all(sessionId);
		const sessionKeyRow = database.prepare("SELECT session_key FROM session_windows WHERE session_id = ? LIMIT 1").get(sessionId);
		const storageRows = [];
		for (const row of rows) {
			if (typeof row.created_at !== "number" || typeof row.event_json !== "string" || typeof row.seq !== "number") return {
				ok: false,
				error: /* @__PURE__ */ new Error(`Invalid transcript row metadata for session ${sessionId}`)
			};
			storageRows.push({
				createdAt: row.created_at,
				eventJson: row.event_json,
				seq: row.seq
			});
		}
		return {
			ok: true,
			rows: storageRows,
			...typeof sessionKeyRow?.session_key === "string" ? { sessionKey: sessionKeyRow.session_key } : {}
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	} finally {
		database?.close();
	}
}
//#endregion
export { readOnlySqliteTranscriptSessionIds as a, readOnlySqliteValidationSnapshot as c, resolveTargetSqlitePath as d, scanReadOnlySqliteActiveTranscriptFiles as f, readOnlySqliteDbStats as i, readSqliteEntryCount as l, createTranscriptEventReader as n, readOnlySqliteTranscriptSnapshot as o, listExistingAgentDatabaseTargets as r, readOnlySqliteTranscriptStorageSnapshot as s, countTranscriptEventsForPath as t, readTranscriptFingerprint as u };
