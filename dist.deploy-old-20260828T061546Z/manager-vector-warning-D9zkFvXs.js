import { r as isCronRunSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { o as ensureOpenClawAgentDatabaseSchema } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { f as dropMemoryPathFtsTriggers, g as ensureMemoryRecallMetadataSchema, h as MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, l as MEMORY_INDEX_PATHS_FTS_TABLE, p as ensureMemoryPathFtsTriggers, y as ensureMemoryChunkProvenance } from "./memory-schema-CJwA5QKm.js";
import { o as ensureMemoryHostDir } from "./internal-y_9W5i9a.js";
import { t as loadSqliteVecExtension } from "./sqlite-vec-yun6599L.js";
import { n as configureMemorySqliteWalMaintenance, t as closeMemorySqliteWalMaintenance } from "./engine-storage-BWafvbUP.js";
import "./sqlite-runtime-vHSfdhDj.js";
import { i as isDreamingNarrativeSessionStoreKey } from "./openclaw-runtime-session-D_Vopbw1.js";
import "./memory-core-host-engine-sessions-B9znd3K0.js";
import "./memory-core-host-engine-storage-DoFy6QD0.js";
import fs from "node:fs";
import path from "node:path";
//#region extensions/memory-core/src/memory/manager-reindex-lock.ts
function resolveMemoryReindexLockPath(dbPath) {
	return `${dbPath}.reindex-lock.sqlite`;
}
function isSqliteBusyError(err) {
	const code = err.code;
	if (code === "SQLITE_BUSY" || code === "SQLITE_LOCKED") return true;
	const message = err instanceof Error ? err.message : String(err);
	return /SQLITE_(?:BUSY|LOCKED)|database is locked/i.test(message);
}
function openMemoryLockDatabase(lockPath) {
	const lockDb = openNodeSqliteDatabase(lockPath);
	try {
		lockDb.exec("PRAGMA busy_timeout = 0");
		return lockDb;
	} catch (err) {
		try {
			lockDb.close();
		} catch {}
		throw err;
	}
}
function createMemoryReindexLockHandle(lockDb) {
	return { release: () => {
		let releaseError;
		try {
			lockDb.exec("ROLLBACK");
		} catch (err) {
			releaseError = err;
		}
		try {
			lockDb.close();
		} catch (err) {
			releaseError ??= err;
		}
		if (releaseError) throw new Error("Failed to release memory reindex lock", { cause: releaseError });
	} };
}
/** Try to acquire the build lock without locking readers of the live agent database. */
function tryAcquireMemoryReindexLock(dbPath) {
	const lockDb = openMemoryLockDatabase(resolveMemoryReindexLockPath(dbPath));
	try {
		lockDb.exec("BEGIN EXCLUSIVE");
	} catch (err) {
		lockDb.close();
		if (isSqliteBusyError(err)) return;
		throw err;
	}
	return createMemoryReindexLockHandle(lockDb);
}
/** Acquire an exclusive build lock without locking readers of the live agent database. */
function acquireMemoryReindexLock(dbPath) {
	const lock = tryAcquireMemoryReindexLock(dbPath);
	if (lock) return lock;
	throw Object.assign(/* @__PURE__ */ new Error(`Memory reindex lock is held at ${resolveMemoryReindexLockPath(dbPath)}; another reindex is active.`), { code: "SQLITE_BUSY" });
}
//#endregion
//#region extensions/memory-core/src/memory/manager-db.ts
const MEMORY_REINDEX_SCHEMA = "memory_reindex";
const MEMORY_INDEX_STATE_ID = 1;
const MEMORY_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
const MEMORY_REINDEX_ENTRY_SUFFIXES = [
	"-wal",
	"-shm",
	"-journal",
	""
];
const MEMORY_REINDEX_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MEMORY_REINDEX_ORPHAN_MIN_AGE_MS = 1440 * 6e4;
function resolveMemoryReindexBaseName(databaseBaseName, entryName) {
	for (const suffix of MEMORY_REINDEX_ENTRY_SUFFIXES) {
		if (!entryName.endsWith(suffix)) continue;
		const baseName = entryName.slice(0, entryName.length - suffix.length);
		const prefix = `${databaseBaseName}.memory-reindex-`;
		if (baseName.startsWith(prefix) && MEMORY_REINDEX_UUID_PATTERN.test(baseName.slice(prefix.length))) return baseName;
	}
}
function isRegularFile(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function tableExists(db, schema, tableName) {
	return db.prepare(`SELECT 1 AS ok FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`).get(tableName)?.ok === 1;
}
function readTableSql(db, schema, tableName) {
	const row = db.prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`).get(tableName);
	return typeof row?.sql === "string" && row.sql.trim() ? row.sql : null;
}
function hasSqliteVecExtension(db) {
	try {
		const row = db.prepare("SELECT vec_version() AS version").get();
		return typeof row?.version === "string" && row.version.trim().length > 0;
	} catch {
		return false;
	}
}
function readMemoryDatabaseRevision(db) {
	const row = db.prepare("SELECT revision FROM memory_index_state WHERE id = ?").get(MEMORY_INDEX_STATE_ID);
	if (typeof row?.revision !== "number" || !Number.isSafeInteger(row.revision)) throw new Error("Memory index revision is missing or invalid");
	return row.revision;
}
function replaceVirtualTable(params) {
	const { db, tableName, columns } = params;
	const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, tableName);
	if (!createSql) {
		try {
			db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
		} catch (err) {
			if (!params.ignoreDropErrorWhenSourceMissing) throw err;
		}
		return;
	}
	db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
	db.exec(createSql);
	db.exec(`INSERT INTO main.${tableName} (${columns}) SELECT ${columns} FROM ${MEMORY_REINDEX_SCHEMA}.${tableName}`);
}
function replaceMemoryPathFtsTable(db) {
	const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_PATHS_FTS_TABLE);
	db.exec(`DROP TABLE IF EXISTS main.${MEMORY_INDEX_PATHS_FTS_TABLE}`);
	if (!createSql) return;
	db.exec(createSql);
	db.exec(`INSERT INTO main.${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source) SELECT id, path, source FROM main.memory_index_sources`);
}
/** Publish a completed shadow memory index without replacing the shared agent database file. */
async function publishMemoryDatabaseTables(params) {
	ensureMemoryRecallMetadataSchema(params.targetDb);
	ensureMemoryChunkProvenance(params.targetDb);
	params.targetDb.prepare(`ATTACH DATABASE ? AS ${MEMORY_REINDEX_SCHEMA}`).run(params.sourcePath);
	try {
		if (tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, "memory_index_chunks_vec") && !hasSqliteVecExtension(params.targetDb)) {
			const loaded = await loadSqliteVecExtension({
				db: params.targetDb,
				extensionPath: params.vectorExtensionPath
			});
			if (!loaded.ok) throw new Error(`Failed to load sqlite-vec before publishing the full memory reindex: ` + (loaded.error ?? "unknown sqlite-vec load error"));
		}
		runSqliteImmediateTransactionSync(params.targetDb, () => {
			const liveRevision = readMemoryDatabaseRevision(params.targetDb);
			if (liveRevision !== params.expectedRevision) throw new Error(`Memory index changed while full reindex was building (expected revision ${params.expectedRevision}, found ${liveRevision}); retry the full reindex.`);
			const publishesPathFts = tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_PATHS_FTS_TABLE);
			dropMemoryPathFtsTriggers(params.targetDb);
			params.targetDb.prepare("DELETE FROM main.memory_index_meta WHERE key = ?").run(params.metaKey);
			params.targetDb.prepare(`INSERT INTO main.memory_index_meta (key, value)
           SELECT key, value FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_meta WHERE key = ?`).run(params.metaKey);
			params.targetDb.exec(`
        DELETE FROM main.memory_index_sources;
        INSERT INTO main.memory_index_sources (id, path, source, hash, mtime, size)
        SELECT id, path, source, hash, mtime, size
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_sources;

        DELETE FROM main.memory_index_chunks;
        INSERT INTO main.memory_index_chunks (
          id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        )
        SELECT
          id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_chunks;

        DELETE FROM main.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE};
        INSERT INTO main.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE} (
          chunk_id, importance, triggers, project_key
        )
        SELECT chunk_id, importance, triggers, project_key
        FROM ${MEMORY_REINDEX_SCHEMA}.${MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE};

        DELETE FROM main.memory_index_chunk_provenance;
        INSERT INTO main.memory_index_chunk_provenance (
          chunk_id, origin_class, session_kind, observed_at, supersedes_key
        )
        SELECT chunk_id, origin_class, session_kind, observed_at, supersedes_key
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_chunk_provenance;
      `);
			if (tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, "memory_embedding_cache")) params.targetDb.exec(`
          DELETE FROM main.memory_embedding_cache;
          INSERT INTO main.memory_embedding_cache (
            provider, model, provider_key, hash, embedding, dims, updated_at
          )
          SELECT provider, model, provider_key, hash, embedding, dims, updated_at
          FROM ${MEMORY_REINDEX_SCHEMA}.memory_embedding_cache;
        `);
			replaceVirtualTable({
				db: params.targetDb,
				tableName: "memory_index_chunks_fts",
				columns: "text, id, path, source, model, start_line, end_line"
			});
			replaceMemoryPathFtsTable(params.targetDb);
			if (publishesPathFts) ensureMemoryPathFtsTriggers(params.targetDb);
			replaceVirtualTable({
				db: params.targetDb,
				tableName: "memory_index_chunks_vec",
				columns: "id, embedding",
				ignoreDropErrorWhenSourceMissing: true
			});
		});
	} finally {
		params.targetDb.exec(`DETACH DATABASE ${MEMORY_REINDEX_SCHEMA}`);
	}
}
/** Remove one closed shadow memory database and its journal-mode sidecars. */
function removeMemoryDatabaseFiles(dbPath) {
	for (const suffix of MEMORY_DATABASE_FILE_SUFFIXES) fs.rmSync(`${dbPath}${suffix}`, { force: true });
}
/** Remove crash-left shadow databases only when no full reindex is active. */
function cleanupAgedMemoryReindexTempFiles(dbPath, nowMs = Date.now()) {
	if (!isRegularFile(dbPath)) return;
	let reindexLock;
	try {
		reindexLock = tryAcquireMemoryReindexLock(dbPath);
	} catch {
		return;
	}
	if (!reindexLock) return;
	try {
		const dir = path.dirname(dbPath);
		const databaseBaseName = path.basename(dbPath);
		const shadowBaseNames = /* @__PURE__ */ new Set();
		let entries;
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			const shadowBaseName = resolveMemoryReindexBaseName(databaseBaseName, entry.name);
			if (shadowBaseName) shadowBaseNames.add(shadowBaseName);
		}
		for (const shadowBaseName of shadowBaseNames) {
			const filePaths = MEMORY_DATABASE_FILE_SUFFIXES.map((suffix) => path.join(dir, `${shadowBaseName}${suffix}`));
			const stats = [];
			let hasUnknownFileState = false;
			for (const filePath of filePaths) try {
				stats.push(fs.statSync(filePath));
			} catch (err) {
				if (err.code !== "ENOENT") {
					hasUnknownFileState = true;
					break;
				}
			}
			if (hasUnknownFileState || stats.length === 0) continue;
			if (nowMs - Math.max(...stats.map((stat) => stat.mtimeMs)) < MEMORY_REINDEX_ORPHAN_MIN_AGE_MS) continue;
			for (const filePath of filePaths) try {
				fs.rmSync(filePath, { force: true });
			} catch {}
		}
	} finally {
		try {
			reindexLock.release();
		} catch {}
	}
}
function openMemoryDatabaseAtPath(dbPath, allowExtension, agentId) {
	ensureMemoryHostDir(path.dirname(dbPath));
	const db = openNodeSqliteDatabase(dbPath, { allowExtension });
	try {
		configureMemorySqliteWalMaintenance(db, {
			busyTimeoutMs: 5e3,
			databasePath: dbPath
		});
		if (agentId) ensureOpenClawAgentDatabaseSchema(db, {
			agentId,
			path: dbPath,
			register: true
		});
		return db;
	} catch (err) {
		try {
			closeMemorySqliteWalMaintenance(db);
			db.close();
		} catch {}
		throw err;
	}
}
function closeMemoryDatabase(db) {
	closeMemorySqliteWalMaintenance(db);
	db.close();
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-state.ts
function isMemorySessionIndexable(entry, archivedSessionKey) {
	return !(entry.generatedByDreamingNarrative || entry.generatedByCronRun || entry.sessionKind === "cron" || entry.sessionKind === "heartbeat" || archivedSessionKey !== void 0 && (isDreamingNarrativeSessionStoreKey(archivedSessionKey) || isCronRunSessionKey(archivedSessionKey) || archivedSessionKey.endsWith(":heartbeat")) || entry.lineProvenance !== void 0 && entry.lineProvenance.length > 0 && entry.lineProvenance.every((line) => line.originClass === "system"));
}
function resolveMemorySessionStartupState(params) {
	const existingRows = params.existingRows ?? [];
	const indexedRows = new Map(existingRows.map((row) => [row.path, row]));
	const activePaths = new Set(params.files.map((file) => file.path));
	const dirtyFiles = [];
	for (const file of params.files) {
		const existing = indexedRows.get(file.path);
		if (!existing || existing.hash === "") {
			dirtyFiles.push(file.absPath);
			continue;
		}
		const indexedMtimeMs = Number(existing.mtime);
		const indexedSize = Number(existing.size);
		if (!Number.isFinite(indexedMtimeMs) || !Number.isFinite(indexedSize)) {
			dirtyFiles.push(file.absPath);
			continue;
		}
		if (file.size !== indexedSize || file.mtimeMs !== indexedMtimeMs) dirtyFiles.push(file.absPath);
	}
	return {
		dirtyFiles,
		hasStaleIndexedPaths: existingRows.some((row) => !activePaths.has(row.path))
	};
}
function resolveMemorySessionSyncPlan(params) {
	const activePaths = params.targetSessionFiles ? null : new Set(params.files.map((file) => params.sessionPathForFile(file)));
	const existingRows = activePaths === null ? null : params.existingRows ?? [];
	return {
		activePaths,
		existingRows,
		existingHashes: existingRows ? new Map(existingRows.map((row) => [row.path, row.hash])) : null,
		indexAll: params.needsFullReindex || Boolean(params.targetSessionFiles)
	};
}
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-warning.ts
function formatMemoryVectorDegradedWriteReason(loadError) {
	return loadError ? `sqlite-vec unavailable: ${loadError}` : "semantic vector embeddings unavailable — no vector dimensions resolved";
}
function logMemoryVectorDegradedWrite(params) {
	if (!params.vectorEnabled || params.vectorReady || params.chunkCount <= 0 || params.warningShown) return params.warningShown;
	params.warn(`memory_index_chunks_vec not updated — ${formatMemoryVectorDegradedWriteReason(params.loadError)}. Vector recall degraded. Further duplicate warnings suppressed.`);
	return true;
}
//#endregion
export { resolveMemorySessionSyncPlan as a, openMemoryDatabaseAtPath as c, removeMemoryDatabaseFiles as d, acquireMemoryReindexLock as f, resolveMemorySessionStartupState as i, publishMemoryDatabaseTables as l, logMemoryVectorDegradedWrite as n, cleanupAgedMemoryReindexTempFiles as o, isMemorySessionIndexable as r, closeMemoryDatabase as s, formatMemoryVectorDegradedWriteReason as t, readMemoryDatabaseRevision as u };
