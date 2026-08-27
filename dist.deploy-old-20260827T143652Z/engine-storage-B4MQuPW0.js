import { t as installProcessWarningFilter } from "./warning-filter-z3hZGeVP.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { r as configureSqliteWalMaintenance, t as configureSqliteConnectionPragmas } from "./sqlite-wal-B0_s-lfW.js";
import { m as formatErrorMessage } from "./memory-schema-BzEn8uKj.js";
import "./internal-DP_IIQo9.js";
import "./fs-utils-v5Xzu3x-.js";
import "./hash-DEc9Q4-Q.js";
import "./curated-annotations-mTWgerpx.js";
import "./read-file-KFehUI8V.js";
import "./sqlite-vec-N_jC-q4Z.js";
import { createRequire } from "node:module";
//#region packages/memory-host-sdk/src/host/memory-recall-metadata.ts
function readMemoryRecallMetadata(db, ids) {
	if (ids.length === 0) return /* @__PURE__ */ new Map();
	const query = getNodeSqliteKysely(db).selectFrom("memory_index_chunks as chunk").leftJoin("memory_index_chunk_recall_metadata as metadata", "metadata.chunk_id", "chunk.id").select([
		"chunk.id as id",
		"metadata.importance as importance",
		"metadata.triggers as triggers",
		"metadata.project_key as project_key"
	]).where("chunk.id", "in", [...ids]);
	return new Map(executeSqliteQuerySync(db, query).rows.map((row) => [row.id, row]));
}
function readCuratedMemoryTriggerCandidates(db, limit, activeProjectKeys) {
	return readCuratedMemoryCandidates({
		db,
		limit,
		activeProjectKeys,
		requireProject: false,
		requireTriggers: true
	});
}
function readCuratedProjectMemoryCandidates(db, limit, activeProjectKeys) {
	if (activeProjectKeys.length === 0) return [];
	return readCuratedMemoryCandidates({
		db,
		limit,
		activeProjectKeys,
		requireProject: true,
		requireTriggers: false
	});
}
function readCuratedMemoryCandidates(params) {
	const { db, limit } = params;
	const active = params.activeProjectKeys ? new Set(params.activeProjectKeys.map((key) => key.trim()).filter(Boolean)) : void 0;
	const results = [];
	let cursor;
	const batchSize = Math.max(64, limit);
	while (results.length < limit) {
		const rows = readCuratedCandidateBatch({
			db,
			limit: batchSize,
			cursor,
			requireProject: params.requireProject,
			requireTriggers: params.requireTriggers
		});
		if (rows.length === 0) break;
		for (const row of rows) {
			const storedKeys = row.project_key?.split(";").map((key) => key.trim()).filter(Boolean);
			if (storedKeys?.includes("!invalid-project-annotation")) continue;
			if (active === void 0 && !params.requireProject || row.project_key === null && !params.requireProject || storedKeys && storedKeys.length > 0 && storedKeys.every((key) => active?.has(key) === true)) {
				results.push(row);
				if (results.length === limit) break;
			}
		}
		const last = rows.at(-1);
		if (!last || rows.length < batchSize) break;
		cursor = {
			importance: last.importance,
			path: last.path,
			id: last.id
		};
	}
	return results;
}
function readCuratedCandidateBatch(params) {
	let query = getNodeSqliteKysely(params.db).selectFrom("memory_index_chunks as chunk").leftJoin("memory_index_chunk_recall_metadata as metadata", "metadata.chunk_id", "chunk.id").select([
		"chunk.id as id",
		"chunk.path as path",
		"chunk.source as source",
		"chunk.start_line as start_line",
		"chunk.end_line as end_line",
		"chunk.text as text",
		"metadata.importance as importance",
		"metadata.triggers as triggers",
		"metadata.project_key as project_key"
	]).where("chunk.source", "=", "memory").where("chunk.path", "in", ["MEMORY.md", "USER.md"]);
	if (params.requireProject) query = query.where("metadata.project_key", "is not", null);
	if (params.requireTriggers) query = query.where("metadata.triggers", "is not", null);
	if (params.cursor) {
		const cursor = params.cursor;
		query = query.where((eb) => {
			const importance = eb.fn.coalesce("metadata.importance", eb.val(0));
			const cursorImportance = cursor.importance ?? 0;
			return eb.or([eb(importance, "<", cursorImportance), eb.and([eb(importance, "=", cursorImportance), eb.or([eb("chunk.path", ">", cursor.path), eb.and([eb("chunk.path", "=", cursor.path), eb("chunk.id", ">", cursor.id)])])])]);
		});
	}
	query = query.orderBy((eb) => eb.fn.coalesce("metadata.importance", eb.val(0)), "desc").orderBy("chunk.path").orderBy("chunk.id").limit(params.limit);
	return executeSqliteQuerySync(params.db, query).rows;
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.ts
const require = createRequire(import.meta.url);
const sqliteWalMaintenanceByDb = /* @__PURE__ */ new WeakMap();
function requireMemoryHostNodeSqlite() {
	installProcessWarningFilter();
	try {
		return require("node:sqlite");
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`, { cause: err });
	}
}
function configureMemorySqliteWalMaintenance(db, options) {
	const existing = sqliteWalMaintenanceByDb.get(db);
	if (existing) return existing;
	const maintenance = options?.busyTimeoutMs === void 0 ? configureSqliteWalMaintenance(db, options) : configureSqliteConnectionPragmas(db, options);
	sqliteWalMaintenanceByDb.set(db, maintenance);
	return maintenance;
}
function closeMemorySqliteWalMaintenance(db) {
	const maintenance = sqliteWalMaintenanceByDb.get(db);
	if (!maintenance) return true;
	sqliteWalMaintenanceByDb.delete(db);
	return maintenance.close();
}
//#endregion
export { readCuratedProjectMemoryCandidates as a, readCuratedMemoryTriggerCandidates as i, configureMemorySqliteWalMaintenance as n, readMemoryRecallMetadata as o, requireMemoryHostNodeSqlite as r, closeMemorySqliteWalMaintenance as t };
