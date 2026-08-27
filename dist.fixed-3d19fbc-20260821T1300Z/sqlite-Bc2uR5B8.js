import "./src-BkwWvwB2.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { a as isPathInside } from "./path-CYL8StfC.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./path-guards-CQdx2c2I.js";
import "./utils-D9gvQMP6.js";
import { i as resolveRegisteredAgentIdForDir } from "./agent-dir-registry-lkpKoZwG.js";
import { f as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, m as enableNodeSqliteKyselyStatementCache, o as readSqliteUserVersion } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, yt as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-BciZ4rHE.js";
import { i as registerSqliteCacheExitClose } from "./sqlite-wal-JFv1PzVq.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { o as resolveSharedAuthStoreOwnership, s as resolveSharedAuthStorePath } from "./path-resolve-DES5vxlU.js";
import { c as deferOpenClawAgentPostCommitPublication, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/sqlite.ts
/**
* SQLite persistence adapter for auth profile secrets and runtime state.
* The public helpers expose raw JSON payloads so normalization stays in the
* store/state layers that own compatibility rules.
*/
const PRIMARY_ROW_KEY = "primary";
const SHARED_ROW_KEY = "shared";
const AUTH_PROFILE_READ_HANDLE_CAP = 8;
const authProfileReadDatabases = /* @__PURE__ */ new Map();
const sharedAuthPostCommitPublications = /* @__PURE__ */ new WeakMap();
let unregisterReadHandleExitClose = null;
/** Queue runtime publication on the transaction edge owned by this database. */
function deferAuthProfilePostCommitPublication(database, publish) {
	if ("agentId" in database) return deferOpenClawAgentPostCommitPublication(database, publish);
	const publications = sharedAuthPostCommitPublications.get(database);
	if (!publications) return false;
	publications.push(publish);
	return true;
}
function inferAgentIdFromDir(agentDir) {
	const normalized = path.normalize(agentDir);
	if (path.basename(normalized) === "agent") {
		const parent = path.basename(path.dirname(normalized));
		if (parent) return parent;
	}
	return `custom-${sha256HexPrefixCore(normalized, 12)}`;
}
function resolveAuthProfileDatabaseOptions(agentDir, env = process.env) {
	if (!agentDir) {
		const pathname = resolveSharedAuthStorePath(env);
		if (resolveSharedAuthStoreOwnership(env).location === "state-db") return {
			kind: "shared-state",
			path: pathname,
			env
		};
		const dir = path.dirname(pathname);
		return {
			kind: "agent",
			agentId: resolveRegisteredAgentIdForDir(dir) ?? inferAgentIdFromDir(dir),
			path: pathname,
			env
		};
	}
	const dir = resolveUserPath(agentDir);
	return {
		kind: "agent",
		agentId: resolveRegisteredAgentIdForDir(dir) ?? inferAgentIdFromDir(dir),
		path: path.join(dir, "openclaw-agent.sqlite"),
		env
	};
}
/** Resolves the SQLite database path that stores auth profiles for an agent dir. */
function resolveAuthProfileDatabasePath(agentDir) {
	return resolveAuthProfileDatabaseOptions(agentDir).path;
}
/** Resolves the durable agent owner expected for an auth-profile database. */
function resolveAuthProfileDatabaseOwnerId(agentDir) {
	const target = resolveAuthProfileDatabaseOptions(agentDir);
	if (target.kind !== "agent") throw new Error("agent auth database unexpectedly resolved to shared state");
	return target.agentId;
}
/** Resolves the SQLite database and sidecar paths used by auth profiles. */
function resolveAuthProfileDatabaseFilePaths(agentDir) {
	return resolveSqliteDatabaseFilePaths(resolveAuthProfileDatabasePath(agentDir));
}
function parseJsonCell(raw) {
	if (!raw) return null;
	return safeParseJson(raw) ?? null;
}
function getAgentAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function getSharedAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function resolveAuthProfileDatabaseKind(agentDir, database) {
	return agentDir !== void 0 ? "agent" : database && !("agentId" in database) ? "shared-state" : resolveAuthProfileDatabaseOptions(agentDir).kind;
}
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = target === "store" && databaseKind === "shared-state" ? "auth_profile_stores" : target === "store" ? "auth_profile_store" : "auth_profile_state";
	const schemaObject = db.prepare("SELECT type FROM sqlite_master WHERE name = ?").get(tableName);
	if (!schemaObject) return {
		status: "missing",
		reason: "table"
	};
	return schemaObject.type === "table" ? null : { status: "unreadable" };
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	let raw;
	if (databaseKind === "shared-state" && target === "store") {
		const row = executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("auth_profile_stores").select("store_json").where("store_key", "=", SHARED_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.store_json;
	} else if (databaseKind === "shared-state") {
		const row = executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("store_key", "=", SHARED_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.state_json;
	} else if (target === "store") {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.store_json;
	} else {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.state_json;
	}
	try {
		return {
			status: "readable",
			raw: JSON.parse(raw)
		};
	} catch {
		return { status: "unreadable" };
	}
}
function closeAuthProfileReadDatabase(databasePath) {
	const pathname = path.resolve(databasePath);
	const db = authProfileReadDatabases.get(pathname);
	if (!db) return;
	authProfileReadDatabases.delete(pathname);
	clearNodeSqliteKyselyCacheForDatabase(db);
	if (db.isOpen) db.close();
	if (authProfileReadDatabases.size === 0) {
		unregisterReadHandleExitClose?.();
		unregisterReadHandleExitClose = null;
	}
}
/** Internal lifecycle close for scoped or all process-local pooled auth-profile readers. */
function closeAuthProfileReadPool(scope) {
	if (scope?.kind === "database") {
		closeAuthProfileReadDatabase(scope.databasePath);
		return;
	}
	if (scope?.kind === "root") {
		for (const pathname of authProfileReadDatabases.keys()) if (isPathInside(scope.rootPath, pathname)) closeAuthProfileReadDatabase(pathname);
		return;
	}
	unregisterReadHandleExitClose?.();
	unregisterReadHandleExitClose = null;
	for (const pathname of authProfileReadDatabases.keys()) closeAuthProfileReadDatabase(pathname);
}
function isMissingDatabasePath(pathname) {
	try {
		fs.statSync(pathname);
		return false;
	} catch (error) {
		return error.code === "ENOENT";
	}
}
function acquireAuthProfileReadDatabase(pathname) {
	const resolvedPath = path.resolve(pathname);
	const cached = authProfileReadDatabases.get(resolvedPath);
	if (cached?.isOpen) {
		authProfileReadDatabases.delete(resolvedPath);
		authProfileReadDatabases.set(resolvedPath, cached);
		return {
			status: "readable",
			db: cached
		};
	}
	if (cached) closeAuthProfileReadDatabase(resolvedPath);
	while (authProfileReadDatabases.size >= AUTH_PROFILE_READ_HANDLE_CAP) {
		const oldestPath = authProfileReadDatabases.keys().next().value;
		if (oldestPath === void 0) break;
		closeAuthProfileReadDatabase(oldestPath);
	}
	let db;
	try {
		db = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
	} catch {
		return isMissingDatabasePath(resolvedPath) ? { status: "missing" } : { status: "unreadable" };
	}
	try {
		enableNodeSqliteKyselyStatementCache(db);
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		if (readSqliteUserVersion(db) > 17) {
			clearNodeSqliteKyselyCacheForDatabase(db);
			db.close();
			return { status: "unreadable" };
		}
	} catch {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
		return { status: "unreadable" };
	}
	authProfileReadDatabases.set(resolvedPath, db);
	unregisterReadHandleExitClose ??= registerSqliteCacheExitClose(closeAuthProfileReadPool);
	return {
		status: "readable",
		db
	};
}
function inspectAuthProfileJsonCellReadOnly(databaseTarget, target) {
	if (databaseTarget.kind === "shared-state") try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => inspectAuthProfileJsonCell(db, target, "shared-state"), {
			env: databaseTarget.env,
			path: databaseTarget.path
		}) ?? {
			status: "missing",
			reason: "database"
		};
	} catch {
		return isMissingDatabasePath(databaseTarget.path) ? {
			status: "missing",
			reason: "database"
		} : { status: "unreadable" };
	}
	const acquired = acquireAuthProfileReadDatabase(databaseTarget.path);
	if (acquired.status === "missing") return {
		status: "missing",
		reason: "database"
	};
	if (acquired.status === "unreadable") return { status: "unreadable" };
	try {
		return inspectAuthProfileJsonCell(acquired.db, target, "agent");
	} catch {
		closeAuthProfileReadDatabase(databaseTarget.path);
		return { status: "unreadable" };
	}
}
/** Distinguishes an absent auth row from a present store that could not be read. */
function inspectPersistedAuthProfileStoreRaw(agentDir, database) {
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir);
	if (database) return inspectAuthProfileJsonCell(database.db, "store", resolveAuthProfileDatabaseKind(agentDir, database));
	return inspectAuthProfileJsonCellReadOnly(databaseTarget, "store");
}
/** Distinguishes an absent auth-state row from state that could not be read. */
function inspectPersistedAuthProfileStateRaw(agentDir, database) {
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir);
	if (database) return inspectAuthProfileJsonCell(database.db, "state", resolveAuthProfileDatabaseKind(agentDir, database));
	return inspectAuthProfileJsonCellReadOnly(databaseTarget, "state");
}
/** Inspect the shared store for an explicit state root without projecting it to an agent dir. */
function inspectPersistedSharedAuthProfileStoreRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "store");
}
/** Inspect shared runtime state for an explicit state root. */
function inspectPersistedSharedAuthProfileStateRaw(env) {
	return inspectAuthProfileJsonCellReadOnly(resolveAuthProfileDatabaseOptions(void 0, env), "state");
}
/** Reads the raw persisted secrets-store payload without coercing the schema. */
function readPersistedAuthProfileStoreRaw(agentDir, database) {
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir);
	if (database) {
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getSharedAuthProfileKysely(database.db).selectFrom("auth_profile_stores").select("store_json").where("store_key", "=", SHARED_ROW_KEY))?.store_json);
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getAgentAuthProfileKysely(database.db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY))?.store_json);
	}
	const result = inspectAuthProfileJsonCellReadOnly(databaseTarget, "store");
	return result.status === "readable" ? result.raw : null;
}
/** Reads the raw persisted runtime-state payload without coercing the schema. */
function readPersistedAuthProfileStateRaw(agentDir, database) {
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir);
	if (database) {
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getSharedAuthProfileKysely(database.db).selectFrom("auth_profile_state").select("state_json").where("store_key", "=", SHARED_ROW_KEY))?.state_json);
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getAgentAuthProfileKysely(database.db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY))?.state_json);
	}
	const result = inspectAuthProfileJsonCellReadOnly(databaseTarget, "state");
	return result.status === "readable" ? result.raw : null;
}
/** Read the shared credential row for an explicit state root. */
function readPersistedSharedAuthProfileStoreRaw(env) {
	const result = inspectPersistedSharedAuthProfileStoreRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Read the shared runtime-state row for an explicit state root. */
function readPersistedSharedAuthProfileStateRaw(env) {
	const result = inspectPersistedSharedAuthProfileStateRaw(env);
	return result.status === "readable" ? result.raw : null;
}
/** Writes the raw persisted secrets-store payload inside the auth database. */
function writePersistedAuthProfileStoreRaw(payload, agentDir, database) {
	const databaseKind = resolveAuthProfileDatabaseKind(agentDir, database);
	const write = (target) => {
		if (databaseKind === "shared-state") {
			executeSqliteQuerySync(target.db, getSharedAuthProfileKysely(target.db).insertInto("auth_profile_stores").values({
				store_key: SHARED_ROW_KEY,
				store_json: JSON.stringify(payload),
				updated_at: Date.now()
			}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
				store_json: JSON.stringify(payload),
				updated_at: Date.now()
			})));
			return;
		}
		executeSqliteQuerySync(target.db, getAgentAuthProfileKysely(target.db).insertInto("auth_profile_store").values({
			store_key: PRIMARY_ROW_KEY,
			store_json: JSON.stringify(payload),
			updated_at: Date.now()
		}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
			store_json: JSON.stringify(payload),
			updated_at: Date.now()
		})));
	};
	if (database) {
		write(database);
		return;
	}
	runAuthProfileWriteTransaction(agentDir, write);
}
/** Deletes the persisted secrets-store row while leaving runtime state intact. */
function deletePersistedAuthProfileStoreRaw(agentDir, database) {
	const databaseKind = resolveAuthProfileDatabaseKind(agentDir, database);
	const remove = (target) => {
		executeSqliteQuerySync(target.db, databaseKind === "shared-state" ? getSharedAuthProfileKysely(target.db).deleteFrom("auth_profile_stores").where("store_key", "=", SHARED_ROW_KEY) : getAgentAuthProfileKysely(target.db).deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
	};
	if (database) {
		remove(database);
		return;
	}
	runAuthProfileWriteTransaction(agentDir, remove);
}
/** Writes or deletes the persisted runtime-state payload. */
function writePersistedAuthProfileStateRaw(payload, agentDir, database) {
	const databaseKind = resolveAuthProfileDatabaseKind(agentDir, database);
	const write = (target) => {
		if (databaseKind === "shared-state") {
			const db = getSharedAuthProfileKysely(target.db);
			if (!payload) {
				executeSqliteQuerySync(target.db, db.deleteFrom("auth_profile_state").where("store_key", "=", SHARED_ROW_KEY));
				return;
			}
			executeSqliteQuerySync(target.db, db.insertInto("auth_profile_state").values({
				store_key: SHARED_ROW_KEY,
				state_json: JSON.stringify(payload),
				updated_at: Date.now()
			}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
				state_json: JSON.stringify(payload),
				updated_at: Date.now()
			})));
			return;
		}
		const db = getAgentAuthProfileKysely(target.db);
		if (!payload) {
			executeSqliteQuerySync(target.db, db.deleteFrom("auth_profile_state").where("state_key", "=", PRIMARY_ROW_KEY));
			return;
		}
		executeSqliteQuerySync(target.db, db.insertInto("auth_profile_state").values({
			state_key: PRIMARY_ROW_KEY,
			state_json: JSON.stringify(payload),
			updated_at: Date.now()
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			state_json: JSON.stringify(payload),
			updated_at: Date.now()
		})));
	};
	if (database) {
		write(database);
		return;
	}
	runAuthProfileWriteTransaction(agentDir, write);
}
/** Runs an auth-profile database write transaction for store/state updates. */
function runAuthProfileWriteTransaction(agentDir, operation, options = {}) {
	const env = options.env ?? (options.stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: options.stateDir
	} : process.env);
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir, env);
	if (databaseTarget.kind === "agent") return runOpenClawAgentWriteTransaction(operation, databaseTarget);
	const database = openOpenClawStateDatabase({
		env,
		path: databaseTarget.path
	});
	const enteredNestedTransaction = database.db.isTransaction;
	const publications = enteredNestedTransaction ? sharedAuthPostCommitPublications.get(database) : [];
	const publicationStart = publications?.length ?? 0;
	if (!enteredNestedTransaction && publications) sharedAuthPostCommitPublications.set(database, publications);
	let result;
	try {
		result = runOpenClawStateWriteTransaction(operation, {
			env,
			database
		});
	} catch (error) {
		publications?.splice(publicationStart);
		throw error;
	} finally {
		if (!enteredNestedTransaction && publications) sharedAuthPostCommitPublications.delete(database);
	}
	if (!enteredNestedTransaction) for (const publish of publications ?? []) publish();
	return result;
}
//#endregion
export { writePersistedAuthProfileStoreRaw as _, inspectPersistedAuthProfileStoreRaw as a, readPersistedAuthProfileStateRaw as c, readPersistedSharedAuthProfileStoreRaw as d, resolveAuthProfileDatabaseFilePaths as f, writePersistedAuthProfileStateRaw as g, runAuthProfileWriteTransaction as h, inspectPersistedAuthProfileStateRaw as i, readPersistedAuthProfileStoreRaw as l, resolveAuthProfileDatabasePath as m, deferAuthProfilePostCommitPublication as n, inspectPersistedSharedAuthProfileStateRaw as o, resolveAuthProfileDatabaseOwnerId as p, deletePersistedAuthProfileStoreRaw as r, inspectPersistedSharedAuthProfileStoreRaw as s, closeAuthProfileReadPool as t, readPersistedSharedAuthProfileStateRaw as u };
