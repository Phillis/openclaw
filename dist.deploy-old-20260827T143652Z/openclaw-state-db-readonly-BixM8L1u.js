import { f as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, i as createNewerSqliteSchemaVersionError, o as readSqliteUserVersion, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { c as getOpenClawStateDatabaseIfOpen, s as evictOpenClawStateDatabaseAfterCorruption, t as assertOpenClawStateDatabaseFreshOpenAllowed } from "./openclaw-state-db-DlCMR4eQ.js";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-state-db-readonly.ts
function resolveReadOnlyPath(options) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
function existingPathOrUndefined(pathname) {
	try {
		statSync(pathname);
		return pathname;
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function assertSupportedSchemaVersion(db, pathname) {
	const userVersion = readSqliteUserVersion(db);
	if (userVersion > 8) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, userVersion, 8);
}
function withOpenClawStateDatabaseReadOnlyIfOpen(operation, options, pathname) {
	const opened = getOpenClawStateDatabaseIfOpen(options);
	if (!opened || opened.db.isTransaction) return { reused: false };
	try {
		assertSupportedSchemaVersion(opened.db, pathname);
		return {
			reused: true,
			value: operation(opened)
		};
	} catch (error) {
		evictOpenClawStateDatabaseAfterCorruption(opened, error);
		throw error;
	}
}
function withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname) {
	assertOpenClawStateDatabaseFreshOpenAllowed(options);
	const db = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedSchemaVersion(db, pathname);
		return operation({
			db,
			path: pathname
		});
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
/**
* Read shared state without joining the writable lifecycle.
*
* CLI metadata reads can overlap a live Gateway. Keep them off schema repair,
* journal-mode setup, checkpoints, and permission mutation owned by writers.
*/
function withOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, options, pathname);
	if (reused.reused) return reused.value;
	return withFreshOpenClawStateDatabaseReadOnly(operation, options, pathname);
}
/** Read existing shared state while preserving non-missing filesystem failures. */
function withExistingOpenClawStateDatabaseReadOnly(operation, options = {}) {
	const pathname = resolveReadOnlyPath(options);
	const reused = withOpenClawStateDatabaseReadOnlyIfOpen(operation, options, pathname);
	if (reused.reused) return reused.value;
	const existingPath = existingPathOrUndefined(pathname);
	return existingPath === void 0 ? void 0 : withFreshOpenClawStateDatabaseReadOnly(operation, {
		...options,
		path: existingPath
	}, existingPath);
}
//#endregion
export { withOpenClawStateDatabaseReadOnly as n, withExistingOpenClawStateDatabaseReadOnly as t };
