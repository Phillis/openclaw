import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import "./openclaw-agent-db-CyHApqW_.js";
import { A as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-1xIPEKIN.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CgxvSLWw.js";
import { c as normalizeLoadedFileEntry, f as partitionSessionFileEntries, o as migrateSessionFileEntryToCurrentVersion } from "./session-manager-codec-DXlXWhl0.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
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
function createTranscriptEventReader(transcriptPath, sessionId) {
	return (append) => {
		for (const event of readTranscriptEventsForImport(transcriptPath, sessionId, false)) append(event);
	};
}
function createTranscriptEventPrefixReader(transcriptPath, sessionId) {
	return (append) => {
		for (const event of readTranscriptEventsForImport(transcriptPath, sessionId, true)) append(event);
	};
}
function readTranscriptEventsForImport(transcriptPath, sessionId, allowMalformedPrefix) {
	const sourceFingerprint = readTranscriptFileFingerprint(transcriptPath);
	const plan = planTranscriptImport(transcriptPath, allowMalformedPrefix);
	assertTranscriptFileUnchanged(transcriptPath, sourceFingerprint);
	const classificationHeader = {
		id: sessionId,
		type: "session",
		version: plan.sourceVersion
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
					type: "session"
				};
				delete canonicalHeader.sessionId;
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
function readTranscriptFileFingerprint(transcriptPath) {
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
	const current = readTranscriptFileFingerprint(transcriptPath);
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
	const result = readOnlySqliteSessionEntries(target);
	return result.ok ? result.summaries.length : 0;
}
function readOnlySqliteExactSessionEntry(target, sessionKey) {
	const result = readOnlySqliteSessionEntries(target);
	if (!result.ok) return {
		error: result.error,
		ok: false
	};
	return {
		entry: result.summaries.find((summary) => summary.sessionKey === sessionKey),
		ok: true
	};
}
function readOnlySqliteSessionEntries(target) {
	const sqlitePath = resolveTargetSqlitePath(target);
	if (!fs.existsSync(sqlitePath)) return {
		exists: false,
		ok: true,
		summaries: []
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		const nodeTable = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("session_nodes");
		const legacyEntryTable = nodeTable ? void 0 : database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("session_entries");
		if (!nodeTable && !legacyEntryTable) return {
			exists: true,
			ok: true,
			summaries: []
		};
		return {
			exists: true,
			ok: true,
			summaries: database.prepare(nodeTable ? "SELECT session_key, entry_json FROM session_nodes ORDER BY session_key ASC" : "SELECT session_key, entry_json FROM session_entries ORDER BY session_key ASC").all().flatMap((row) => {
				if (typeof row.session_key !== "string" || typeof row.entry_json !== "string") return [];
				const entry = parseSqliteSessionEntry(row.entry_json);
				return entry ? [{
					entry,
					sessionKey: row.session_key
				}] : [];
			})
		};
	} catch (error) {
		return {
			error,
			exists: true,
			ok: false
		};
	} finally {
		database?.close();
	}
}
function readOnlySqliteTranscriptEventCount(target, sessionId) {
	const sqlitePath = resolveTargetSqlitePath(target);
	if (!fs.existsSync(sqlitePath)) return {
		events: 0,
		exists: false,
		ok: true
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		if (!database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("transcript_events")) return {
			events: 0,
			exists: true,
			ok: true
		};
		const count = database.prepare("SELECT COUNT(*) AS count FROM transcript_events WHERE session_id = ?").get(sessionId)?.count;
		return {
			events: typeof count === "number" && Number.isFinite(count) ? count : 0,
			exists: true,
			ok: true
		};
	} catch (error) {
		return {
			error,
			exists: true,
			ok: false
		};
	} finally {
		database?.close();
	}
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
		const hasTranscriptEvents = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("transcript_events");
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
	const sqliteTarget = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId });
	return resolveOpenClawAgentSqlitePath({
		agentId: sqliteTarget.agentId ?? target.agentId,
		...sqliteTarget.path ? { path: sqliteTarget.path } : {}
	});
}
function parseSqliteSessionEntry(entryJson) {
	try {
		const parsed = JSON.parse(entryJson);
		return isRecord(parsed) && typeof parsed.sessionId === "string" ? parsed : void 0;
	} catch {
		return;
	}
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
					final: false,
					lineNumber,
					text
				};
			}
		}
		carry += decoder.decode();
		const text = carry.trim();
		if (text) yield {
			final: true,
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
	try {
		return JSON.parse(line.text);
	} catch (error) {
		if (line.final) return;
		throw error;
	}
}
function readOnlySqliteTranscriptSessionIds(sqlitePath) {
	if (!fs.existsSync(sqlitePath)) return [];
	let database;
	try {
		database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
		if (!database.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get("transcript_events")) return [];
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
export { readOnlySqliteExactSessionEntry as a, readOnlySqliteTranscriptSessionIds as c, readSqliteEntryCount as d, resolveTargetSqlitePath as f, readOnlySqliteDbStats as i, readOnlySqliteTranscriptSnapshot as l, createTranscriptEventPrefixReader as n, readOnlySqliteSessionEntries as o, createTranscriptEventReader as r, readOnlySqliteTranscriptEventCount as s, countTranscriptEventsForPath as t, readOnlySqliteTranscriptStorageSnapshot as u };
