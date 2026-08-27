import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { n as normalizeAgentDirRegistryPath } from "./agent-dir-registry-Xjm8INut.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { N as ensureAgentDeletionJournalSchema, h as runOpenClawStateWriteTransaction, yt as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-DlCMR4eQ.js";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/state/agent-deletion-journal.ts
function assertAgentDeletionIdentityClaimAllowed(claimAgentId, deletedAgentId) {
	if (deletedAgentId && normalizeAgentId(claimAgentId) === normalizeAgentId(deletedAgentId)) throw new Error(`OpenClaw agent database is unavailable while agent ${normalizeAgentId(deletedAgentId)} is deleted.`);
}
function prepareAgentDeletionPathFence(claim, options = {}) {
	let rows = [];
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		rows = executeSqliteQuerySync(database.db, db.selectFrom("agent_deletion_journal").select([
			"agent_id",
			"operation_id",
			"agent_dir",
			"workspace_dir",
			"sessions_dir",
			"database_paths_json",
			"cleanup_paths_json",
			"cleanup_completed"
		])).rows;
	}, options);
	const env = options.env ?? process.env;
	return {
		claimAgentId: normalizeAgentId(claim.agentId),
		...claim.fenceAgentId ? { fenceAgentId: normalizeAgentId(claim.fenceAgentId) } : {},
		targetPaths: resolveSqliteDatabaseFilePaths(claim.path).map((filePath) => normalizeAgentDirRegistryPath(filePath, env)),
		entries: rows.map((row) => ({
			agentId: row.agent_id,
			operationId: row.operation_id,
			agentDir: row.agent_dir,
			workspaceDir: row.workspace_dir,
			sessionsDir: row.sessions_dir,
			cleanupCompleted: row.cleanup_completed === 1,
			canonicalPaths: [
				row.agent_dir,
				row.workspace_dir,
				row.sessions_dir
			].map((entryPath) => normalizeAgentDirRegistryPath(entryPath, env)),
			databasePaths: parseDatabasePaths(row.database_paths_json).map((databasePath) => ({
				path: databasePath,
				canonicalPath: normalizeAgentDirRegistryPath(databasePath, env)
			})),
			cleanupPaths: parseCleanupPaths(row.cleanup_paths_json).map((cleanupPath) => Object.assign({}, cleanupPath, { fencePath: normalizeAgentDirRegistryPath(cleanupPath.canonicalPath, env) }))
		}))
	};
}
/** Refuse database claims beneath paths still owned by an unfinished deletion. */
function assertAgentDeletionPathFence(database, snapshot) {
	ensureAgentDeletionJournalSchema(database);
	const journalRows = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select([
		"agent_id",
		"operation_id",
		"agent_dir",
		"workspace_dir",
		"sessions_dir",
		"database_paths_json",
		"cleanup_paths_json",
		"cleanup_completed"
	])).rows;
	const snapshotJournal = snapshot.entries.map((entry) => [
		entry.agentId,
		entry.operationId,
		entry.agentDir,
		entry.workspaceDir,
		entry.sessionsDir,
		JSON.stringify(entry.databasePaths.map((candidate) => candidate.path)),
		JSON.stringify(entry.cleanupPaths.map(({ fencePath: _fencePath, ...candidate }) => ({ ...candidate }))),
		entry.cleanupCompleted ? 1 : 0
	].join("\0")).toSorted();
	const currentJournal = journalRows.map((row) => [
		row.agent_id,
		row.operation_id,
		row.agent_dir,
		row.workspace_dir,
		row.sessions_dir,
		row.database_paths_json,
		row.cleanup_paths_json,
		row.cleanup_completed
	].join("\0")).toSorted();
	if (snapshotJournal.join("\n") !== currentJournal.join("\n")) throw new Error("Agent deletion journal changed while preparing a database claim.");
	for (const row of journalRows) {
		if (snapshot.fenceAgentId && snapshot.fenceAgentId !== row.agent_id) continue;
		assertAgentDeletionIdentityClaimAllowed(snapshot.claimAgentId, row.agent_id);
		if (row.cleanup_completed === 1) continue;
		const entry = snapshot.entries.find((candidate) => candidate.agentId === row.agent_id && candidate.operationId === row.operation_id && candidate.agentDir === row.agent_dir && candidate.workspaceDir === row.workspace_dir && candidate.sessionsDir === row.sessions_dir && JSON.stringify(candidate.databasePaths.map((databasePath) => databasePath.path)) === row.database_paths_json && JSON.stringify(candidate.cleanupPaths.map(({ fencePath: _fencePath, ...cleanupPath }) => ({ ...cleanupPath }))) === row.cleanup_paths_json);
		if (!entry) throw new Error("Agent deletion journal changed while preparing a database claim.");
		const fences = [
			...entry.canonicalPaths.map((canonicalPath, index) => ({
				canonicalPath,
				path: [
					entry.agentDir,
					entry.workspaceDir,
					entry.sessionsDir
				][index]
			})),
			...entry.databasePaths,
			...entry.cleanupPaths.map((cleanupPath) => ({
				path: cleanupPath.path,
				canonicalPath: cleanupPath.fencePath
			}))
		];
		for (const fence of fences) {
			const blockedPath = snapshot.targetPaths.find((targetPath) => targetPath === fence.canonicalPath || isPathInside(fence.canonicalPath, targetPath));
			if (blockedPath) throw new Error(`OpenClaw agent database ${blockedPath} is unavailable while agent ${row.agent_id} deletion owns ${fence.path}.`);
		}
	}
}
function fromRow(row) {
	return {
		agentId: row.agent_id,
		operationId: row.operation_id,
		agentDir: row.agent_dir,
		workspaceDir: row.workspace_dir,
		sessionsDir: row.sessions_dir,
		databasePaths: parseDatabasePaths(row.database_paths_json),
		cleanupPaths: parseCleanupPaths(row.cleanup_paths_json),
		createdAt: row.created_at,
		cleanupCompleted: row.cleanup_completed === 1,
		deleteFiles: row.delete_files === 1
	};
}
function parseDatabasePaths(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string")) throw new Error("Invalid agent deletion database path journal.");
	return parsed;
}
function parseCleanupPaths(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "object" && entry !== null && typeof entry.path === "string" && typeof entry.canonicalPath === "string" && typeof entry.parentPath === "string" && (entry.kind === "target" || entry.kind === "symlink") && (entry.dev === null || typeof entry.dev === "number") && (entry.ino === null || typeof entry.ino === "number") && typeof entry.coversDescendants === "boolean" && typeof entry.done === "boolean" && (entry.note === void 0 || typeof entry.note === "string") && Array.isArray(entry.sourcePaths) && entry.sourcePaths.every((sourcePath) => typeof sourcePath === "string"))) throw new Error("Invalid agent deletion cleanup path journal.");
	return parsed;
}
function readAgentDeletionJournal(agentId, options = {}) {
	const id = normalizeAgentId(agentId);
	if (!existsSync(path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env)))) return;
	let entry;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_deletion_journal").selectAll().where("agent_id", "=", id));
		entry = row ? fromRow(row) : void 0;
	}, options);
	return entry;
}
function beginAgentDeletionJournal(entry, options = {}) {
	const normalized = {
		...entry,
		agentId: normalizeAgentId(entry.agentId),
		databasePaths: [...new Set((entry.databasePaths ?? []).map((entryPath) => path.resolve(entryPath)))],
		cleanupPaths: entry.cleanupPaths ?? []
	};
	let persisted;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const existing = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_deletion_journal").selectAll().where("agent_id", "=", normalized.agentId));
		const registeredDatabasePaths = executeSqliteQuerySync(database.db, db.selectFrom("agent_databases").select("path").where("agent_id", "=", normalized.agentId)).rows.flatMap((row) => resolveSqliteDatabaseFilePaths(row.path));
		const databasePaths = [...new Set([
			...existing ? fromRow(existing).databasePaths : [],
			...normalized.databasePaths,
			...registeredDatabasePaths
		].map((entryPath) => path.resolve(entryPath)))];
		const cleanupPaths = existing ? fromRow(existing).cleanupPaths : normalized.cleanupPaths;
		if (existing) {
			executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({
				operation_id: normalized.operationId,
				database_paths_json: JSON.stringify(databasePaths),
				cleanup_paths_json: JSON.stringify(cleanupPaths),
				cleanup_completed: 0,
				delete_files: normalized.deleteFiles ? 1 : 0
			}).where("agent_id", "=", normalized.agentId));
			persisted = {
				...fromRow(existing),
				operationId: normalized.operationId,
				databasePaths,
				cleanupPaths,
				cleanupCompleted: false,
				deleteFiles: normalized.deleteFiles
			};
			return;
		}
		const createdAt = Date.now();
		executeSqliteQuerySync(database.db, db.insertInto("agent_deletion_journal").values({
			agent_id: normalized.agentId,
			operation_id: normalized.operationId,
			agent_dir: normalized.agentDir,
			workspace_dir: normalized.workspaceDir,
			sessions_dir: normalized.sessionsDir,
			database_paths_json: JSON.stringify(databasePaths),
			cleanup_paths_json: JSON.stringify(cleanupPaths),
			created_at: createdAt,
			cleanup_completed: 0,
			delete_files: normalized.deleteFiles ? 1 : 0
		}));
		persisted = {
			...normalized,
			databasePaths,
			cleanupPaths,
			createdAt,
			cleanupCompleted: false
		};
	}, options);
	if (!persisted) throw new Error(`Failed to record deletion journal for agent ${normalized.agentId}.`);
	return persisted;
}
function updateAgentDeletionJournalCleanupPaths(agentId, operationId, cleanupPaths, options = {}) {
	const id = normalizeAgentId(agentId);
	let updated = false;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ cleanup_paths_json: JSON.stringify(cleanupPaths) }).where("agent_id", "=", id).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0));
		updated = Number(result.numAffectedRows ?? 0) > 0;
	}, options);
	return updated;
}
function updateAgentDeletionJournalDatabasePaths(agentId, operationId, databasePaths, options = {}) {
	const id = normalizeAgentId(agentId);
	const normalizedPaths = [...new Set(databasePaths.map((entryPath) => path.resolve(entryPath)))];
	let updated = false;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ database_paths_json: JSON.stringify(normalizedPaths) }).where("agent_id", "=", id).where("operation_id", "=", operationId).where("cleanup_completed", "=", 0));
		updated = Number(result.numAffectedRows ?? 0) > 0;
	}, options);
	return updated;
}
function completeAgentDeletionJournal(agentId, operationId, options = {}) {
	const id = normalizeAgentId(agentId);
	let completed = false;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.updateTable("agent_deletion_journal").set({ cleanup_completed: 1 }).where("agent_id", "=", id).where("operation_id", "=", operationId));
		completed = Number(result.numAffectedRows ?? 0) > 0;
	}, options);
	return completed;
}
function removeAgentDeletionJournal(agentId, operationId, options = {}) {
	const id = normalizeAgentId(agentId);
	let removed = false;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.deleteFrom("agent_deletion_journal").where("agent_id", "=", id).where("operation_id", "=", operationId));
		removed = Number(result.numAffectedRows ?? 0) > 0;
	}, options);
	return removed;
}
function claimCompletedAgentDeletionJournal(agentId, operationId, options = {}) {
	const id = normalizeAgentId(agentId);
	let removed = false;
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDeletionJournalSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		const result = executeSqliteQuerySync(database.db, db.deleteFrom("agent_deletion_journal").where("agent_id", "=", id).where("operation_id", "=", operationId).where("cleanup_completed", "=", 1));
		removed = Number(result.numAffectedRows ?? 0) > 0;
	}, options);
	return removed;
}
//#endregion
export { completeAgentDeletionJournal as a, removeAgentDeletionJournal as c, claimCompletedAgentDeletionJournal as i, updateAgentDeletionJournalCleanupPaths as l, assertAgentDeletionPathFence as n, prepareAgentDeletionPathFence as o, beginAgentDeletionJournal as r, readAgentDeletionJournal as s, assertAgentDeletionIdentityClaimAllowed as t, updateAgentDeletionJournalDatabasePaths as u };
