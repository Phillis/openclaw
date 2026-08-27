import "./src-BntaCZM-.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { C as resolveOAuthDir } from "./paths-BBSTUjD5.js";
import { i as resolveRegisteredAgentIdForDir } from "./agent-dir-registry-CEecLw_T.js";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-C1w8kMxr.js";
import { An as executeSqliteQuerySync, Ln as readSqliteUserVersion, Mn as getNodeSqliteKysely, bt as resolveSqliteDatabaseFilePaths, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync, kn as enableNodeSqliteKyselyStatementCache, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { h as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { i as registerSqliteCacheExitClose } from "./sqlite-wal-BHpwckP_.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { o as writeConfigMachineState } from "./config-machine-state-FNVGu8mV.js";
import { a as resolveSharedAuthStorePath, i as resolveSharedAuthStoreOwnership, n as noteCommittedSharedAuthStoreOwnership, o as resolveSharedMainAuthAgentDir, t as SHARED_AUTH_STORE_STATE_KEY } from "./path-resolve-CCojuy8M.js";
import { c as deferOpenClawAgentPostCommitPublication, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CM8nAOgX.js";
import "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/legacy-source-files.ts
function resolveLegacyOAuthPath(env = process.env) {
	return path.join(resolveOAuthDir(env), "oauth.json");
}
function resolveLegacySourceAgentDir(agentDir, env = process.env) {
	return agentDir ? resolveUserPath(agentDir) : resolveSharedMainAuthAgentDir(env);
}
/** Detects retired auth files by name only; runtime code must never read their contents. */
function listLegacyAuthProfileSources(params) {
	const agentDir = resolveLegacySourceAgentDir(params.agentDir, params.env);
	const candidates = [
		{
			kind: "auth-profiles",
			path: path.join(agentDir, "auth-profiles.json")
		},
		{
			kind: "auth-state",
			path: path.join(agentDir, "auth-state.json")
		},
		{
			kind: "legacy-auth",
			path: path.join(agentDir, "auth.json")
		}
	];
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	if (path.resolve(agentDir) === path.resolve(sharedMainDir)) candidates.push({
		kind: "legacy-oauth",
		path: resolveLegacyOAuthPath(params.env)
	});
	return candidates.filter((candidate) => fs.existsSync(candidate.path));
}
function listLegacyAuthProfileArchives(params) {
	const candidates = /* @__PURE__ */ new Map();
	for (const agentDir of params.agentDirs) {
		candidates.set(path.join(agentDir, "auth-profiles.json"), "auth-profiles");
		candidates.set(path.join(agentDir, "auth-state.json"), "auth-state");
		candidates.set(path.join(agentDir, "auth.json"), "legacy-auth");
	}
	candidates.set(resolveLegacyOAuthPath(params.env), "legacy-oauth");
	const archives = [];
	for (const [sourcePath, kind] of candidates) {
		const directory = path.dirname(sourcePath);
		const baseName = path.basename(sourcePath);
		const migratedPrefix = `${baseName}.migrated-`;
		const priorImportPrefix = `${baseName}.sqlite-import.`;
		let entries;
		try {
			entries = fs.readdirSync(directory);
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.startsWith(migratedPrefix) || entry.startsWith(priorImportPrefix) && entry.endsWith(".bak")) archives.push({
			kind,
			path: path.join(directory, entry)
		});
	}
	return archives;
}
//#endregion
//#region src/agents/auth-profiles/shared-store-bootstrap.ts
const PRIMARY_ROW_KEY$1 = "primary";
const SHARED_AUTH_STORE_MIGRATION_KIND = "shared-auth-store-state-db";
const inspectedLegacySharedAuthOwnerships = /* @__PURE__ */ new WeakSet();
var SharedAuthStoreSourceInspectionError = class extends Error {
	constructor(sourcePath, operation, cause) {
		const detail = cause instanceof Error ? cause.message : String(cause);
		super(`Cannot ${operation} legacy shared auth database ${sourcePath}: ${detail}`, { cause });
		this.code = "SHARED_AUTH_STORE_SOURCE_UNREADABLE";
		this.action = "openclaw doctor --fix";
		this.name = "SharedAuthStoreSourceInspectionError";
		this.sourcePath = sourcePath;
	}
};
function inspectSharedAuthLegacySourceFile(sourcePath) {
	let entry;
	try {
		entry = fs.lstatSync(sourcePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return { status: "missing" };
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "inspect", error);
	}
	let target = entry;
	if (entry.isSymbolicLink()) try {
		target = fs.statSync(sourcePath);
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "resolve", error);
	}
	if (!target.isFile()) throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", /* @__PURE__ */ new Error("path is not a regular file"));
	return {
		status: "present",
		size: target.size
	};
}
function readSharedAuthLegacyRowsFromDatabase(database) {
	const db = getNodeSqliteKysely(database);
	return {
		store: tableExists(database, "auth_profile_store") ? executeSqliteQueryTakeFirstSync(database, db.selectFrom("auth_profile_store").select(["store_json", "updated_at"]).where("store_key", "=", PRIMARY_ROW_KEY$1)) ?? null : null,
		state: tableExists(database, "auth_profile_state") ? executeSqliteQueryTakeFirstSync(database, db.selectFrom("auth_profile_state").select(["state_json", "updated_at"]).where("state_key", "=", PRIMARY_ROW_KEY$1)) ?? null : null
	};
}
function inspectSharedAuthLegacyRowsReadOnly(sourcePath) {
	if (inspectSharedAuthLegacySourceFile(sourcePath).status === "missing") return {
		store: null,
		state: null
	};
	let database;
	try {
		database = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "open", error);
	}
	try {
		return readSharedAuthLegacyRowsFromDatabase(database);
	} catch (error) {
		throw new SharedAuthStoreSourceInspectionError(sourcePath, "read", error);
	} finally {
		database.close();
	}
}
function hasPendingSharedAuthCleanup(env, sourcePath) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("migration_sources").select("source_key").where("migration_kind", "=", SHARED_AUTH_STORE_MIGRATION_KIND).where("source_path", "=", sourcePath).where("removed_source", "=", 0).limit(1));
		return Boolean(row);
	}, { env }) ?? false;
}
function initializeFreshSharedAuthStore(env) {
	const ownership = resolveSharedAuthStoreOwnership(env);
	if (ownership.location === "state-db" || inspectedLegacySharedAuthOwnerships.has(ownership)) return;
	const sourcePath = path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite");
	try {
		if (listLegacyAuthProfileSources({ env }).length > 0) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
		const rows = inspectSharedAuthLegacyRowsReadOnly(sourcePath);
		if (rows.store || rows.state || hasPendingSharedAuthCleanup(env, sourcePath)) {
			inspectedLegacySharedAuthOwnerships.add(ownership);
			return;
		}
	} catch {
		inspectedLegacySharedAuthOwnerships.add(ownership);
		return;
	}
	writeConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { location: "state-db" }, { env });
	noteCommittedSharedAuthStoreOwnership({ location: "state-db" }, env);
}
function prepareFreshSharedAuthStoreWrite(params) {
	const isSharedWrite = params.agentDir === void 0 || params.allowExplicitMain && path.resolve(resolveUserPath(params.agentDir, params.env)) === path.resolve(resolveSharedMainAuthAgentDir(params.env));
	if (isSharedWrite) initializeFreshSharedAuthStore(params.env);
	return isSharedWrite;
}
//#endregion
//#region src/agents/auth-profiles/sqlite.ts
/**
* SQLite persistence adapter for auth profile secrets and runtime state.
* The public helpers expose raw JSON payloads so normalization stays in the
* store/state layers that own compatibility rules.
*/
const PRIMARY_ROW_KEY = "primary";
const SHARED_STORE_STATE_KEY = "authProfiles.store";
const SHARED_STATE_STATE_KEY = "authProfiles.state";
function readSharedAuthKvCell(db, stateKey) {
	return executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey))?.value_json;
}
function writeSharedAuthKvCell(db, stateKey, valueJson) {
	executeSqliteQuerySync(db, getSharedAuthProfileKysely(db).insertInto("config_machine_state").values({
		state_key: stateKey,
		value_json: valueJson,
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: Date.now()
	})));
}
function deleteSharedAuthKvCell(db, stateKey) {
	executeSqliteQuerySync(db, getSharedAuthProfileKysely(db).deleteFrom("config_machine_state").where("state_key", "=", stateKey));
}
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
	if (database && "agentId" in database) return "agent";
	if (database && "path" in database) return "shared-state";
	return resolveAuthProfileDatabaseOptions(agentDir).kind;
}
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = databaseKind === "shared-state" ? "config_machine_state" : target === "store" ? "auth_profile_store" : "auth_profile_state";
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
	if (databaseKind === "shared-state") {
		const cell = readSharedAuthKvCell(db, target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY);
		if (cell === void 0) return {
			status: "missing",
			reason: "row"
		};
		raw = cell;
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
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(readSharedAuthKvCell(database.db, SHARED_STORE_STATE_KEY));
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, getAgentAuthProfileKysely(database.db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY))?.store_json);
	}
	const result = inspectAuthProfileJsonCellReadOnly(databaseTarget, "store");
	return result.status === "readable" ? result.raw : null;
}
/** Reads the raw persisted runtime-state payload without coercing the schema. */
function readPersistedAuthProfileStateRaw(agentDir, database) {
	const databaseTarget = resolveAuthProfileDatabaseOptions(agentDir);
	if (database) {
		if (resolveAuthProfileDatabaseKind(agentDir, database) === "shared-state") return parseJsonCell(readSharedAuthKvCell(database.db, SHARED_STATE_STATE_KEY));
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
			writeSharedAuthKvCell(target.db, SHARED_STORE_STATE_KEY, JSON.stringify(payload));
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
		if (databaseKind === "shared-state") {
			deleteSharedAuthKvCell(target.db, SHARED_STORE_STATE_KEY);
			return;
		}
		executeSqliteQuerySync(target.db, getAgentAuthProfileKysely(target.db).deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
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
			if (!payload) {
				deleteSharedAuthKvCell(target.db, SHARED_STATE_STATE_KEY);
				return;
			}
			writeSharedAuthKvCell(target.db, SHARED_STATE_STATE_KEY, JSON.stringify(payload));
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
	const databaseTarget = resolveAuthProfileDatabaseOptions(prepareFreshSharedAuthStoreWrite({
		agentDir,
		allowExplicitMain: options.sharedStoreWrite === true,
		env
	}) ? void 0 : agentDir, env);
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
export { listLegacyAuthProfileArchives as C, readSharedAuthLegacyRowsFromDatabase as S, resolveLegacyOAuthPath as T, writePersistedAuthProfileStoreRaw as _, inspectPersistedAuthProfileStoreRaw as a, inspectSharedAuthLegacyRowsReadOnly as b, readPersistedAuthProfileStateRaw as c, readPersistedSharedAuthProfileStoreRaw as d, resolveAuthProfileDatabaseFilePaths as f, writePersistedAuthProfileStateRaw as g, runAuthProfileWriteTransaction as h, inspectPersistedAuthProfileStateRaw as i, readPersistedAuthProfileStoreRaw as l, resolveAuthProfileDatabasePath as m, deferAuthProfilePostCommitPublication as n, inspectPersistedSharedAuthProfileStateRaw as o, resolveAuthProfileDatabaseOwnerId as p, deletePersistedAuthProfileStoreRaw as r, inspectPersistedSharedAuthProfileStoreRaw as s, closeAuthProfileReadPool as t, readPersistedSharedAuthProfileStateRaw as u, SharedAuthStoreSourceInspectionError as v, listLegacyAuthProfileSources as w, inspectSharedAuthLegacySourceFile as x, hasPendingSharedAuthCleanup as y };
