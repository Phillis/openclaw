import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { f as clearNodeSqliteKyselyCacheForDatabase, h as statementCacheSymbol, m as queryErrorHandlerByDatabase, p as kyselyByDatabase } from "./node-sqlite-sCL6pEgr.js";
import { t as resolveCommitHash } from "./git-commit-Dfaqxo9-.js";
import os from "node:os";
import path from "node:path";
import { InsertQueryNode, Kysely, SqliteDialect } from "kysely";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/infra/kysely-sync.ts
const statementInvalidationSymbol = Symbol("openclaw.kyselySyncStatementInvalidation");
const statementCacheEnabledSymbol = Symbol("openclaw.kyselySyncStatementCacheEnabled");
const authorizerActiveSymbol = Symbol("openclaw.kyselySyncAuthorizerActive");
const statementCacheCapacity = 32;
const statementCacheEntryBytes = 64 * 1024;
const compileOnlySqliteDialect = new SqliteDialect({ database: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
} });
function getNodeSqliteKysely(db) {
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
/** Register the lifecycle owner's handler for synchronous Kysely query failures. */
function registerNodeSqliteKyselyQueryErrorHandler(db, handler) {
	queryErrorHandlerByDatabase.set(db, handler);
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
function installStatementInvalidation(owner) {
	if (owner[statementInvalidationSymbol]) return;
	if (typeof owner.setAuthorizer === "function") {
		const setAuthorizer = owner.setAuthorizer.bind(owner);
		Object.defineProperty(owner, "setAuthorizer", {
			configurable: true,
			writable: true,
			value(callback) {
				setAuthorizer(callback);
				this[authorizerActiveSymbol] = callback !== null;
				delete this[statementCacheSymbol];
			}
		});
	}
	if (typeof owner.deserialize === "function") {
		const deserialize = owner.deserialize.bind(owner);
		Object.defineProperty(owner, "deserialize", {
			configurable: true,
			writable: true,
			value(...args) {
				try {
					deserialize(...args);
				} finally {
					delete this[statementCacheSymbol];
				}
			}
		});
	}
	if (typeof owner.close === "function") {
		const close = owner.close.bind(owner);
		Object.defineProperty(owner, "close", {
			configurable: true,
			writable: true,
			value() {
				clearNodeSqliteKyselyCacheForDatabase(this);
				return close();
			}
		});
	}
	if (typeof owner[Symbol.dispose] === "function") {
		const dispose = owner[Symbol.dispose].bind(owner);
		Object.defineProperty(owner, Symbol.dispose, {
			configurable: true,
			writable: true,
			value() {
				clearNodeSqliteKyselyCacheForDatabase(this);
				return dispose();
			}
		});
	}
	Object.defineProperty(owner, statementInvalidationSymbol, {
		configurable: true,
		value: true
	});
}
/**
* Enable bounded statement caching for a lifecycle-owned database that has not
* installed an authorizer before this call.
*/
function enableNodeSqliteKyselyStatementCache(db) {
	const owner = db;
	installStatementInvalidation(owner);
	owner[statementCacheEnabledSymbol] = true;
}
function queryFitsStatementCache(sql, parameters) {
	let bytes = Buffer.byteLength(sql);
	if (bytes > statementCacheEntryBytes) return false;
	for (const parameter of parameters) {
		if (typeof parameter === "string") bytes += Buffer.byteLength(parameter);
		else if (ArrayBuffer.isView(parameter)) bytes += parameter.byteLength;
		if (bytes > statementCacheEntryBytes) return false;
	}
	return true;
}
function executeWithCachedStatement(db, sql, parameters, execute) {
	const owner = db;
	installStatementInvalidation(owner);
	if (!owner[statementCacheEnabledSymbol] || owner[authorizerActiveSymbol] || !queryFitsStatementCache(sql, parameters)) return execute(db.prepare(sql));
	let cache = owner[statementCacheSymbol];
	if (!cache) {
		cache = {
			statements: /* @__PURE__ */ new Map(),
			candidates: /* @__PURE__ */ new Set(),
			active: /* @__PURE__ */ new WeakSet()
		};
		Object.defineProperty(owner, statementCacheSymbol, {
			configurable: true,
			value: cache
		});
	}
	const cached = cache.statements.get(sql);
	let statement;
	if (cached && !cache.active.has(cached)) {
		cache.statements.delete(sql);
		cache.statements.set(sql, cached);
		statement = cached;
	} else {
		statement = db.prepare(sql);
		if (!cached && cache.candidates.delete(sql)) {
			cache.statements.set(sql, statement);
			pruneMapToMaxSize(cache.statements, statementCacheCapacity);
		} else if (!cached) {
			cache.candidates.add(sql);
			if (cache.candidates.size > statementCacheCapacity) {
				const oldestCandidate = cache.candidates.values().next().value;
				if (oldestCandidate !== void 0) cache.candidates.delete(oldestCandidate);
			}
		}
	}
	cache.active.add(statement);
	try {
		return execute(statement);
	} finally {
		cache.active.delete(statement);
	}
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery) {
	const parameters = compiledQuery.parameters;
	try {
		return executeWithCachedStatement(db, compiledQuery.sql, parameters, (statement) => {
			if (statement.columns().length > 0) {
				const iterator = statement.iterate(...parameters);
				try {
					return { rows: [...iterator] };
				} catch (error) {
					try {
						iterator.return?.();
					} catch {}
					throw error;
				}
			}
			const { changes, lastInsertRowid } = statement.run(...parameters);
			const result = {
				numAffectedRows: BigInt(changes),
				rows: []
			};
			if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
				...result,
				insertId: BigInt(lastInsertRowid)
			};
			return result;
		});
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Compile and lazily iterate a Kysely query synchronously against node:sqlite. */
function* iterateSqliteQuerySync(db, query) {
	const compiledQuery = query.compile();
	try {
		const statement = db.prepare(compiledQuery.sql);
		if (statement.columns().length === 0) return;
		const parameters = compiledQuery.parameters;
		const iterator = statement.iterate(...parameters);
		try {
			yield* iterator;
		} catch (error) {
			try {
				iterator.return?.();
			} catch {}
			throw error;
		}
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeSqliteQuerySync(db, query).rows[0];
}
//#endregion
//#region src/state/openclaw-state-db-contract.ts
const OPENCLAW_STATE_SCHEMA_VERSION = 8;
const FIRST_USE_STATE_TABLES = [
	"cron_job_runtime_authorities",
	"execution_identity_contexts",
	"mcp_oauth_pending_authorizations",
	"node_worker_launches",
	"operator_approval_execution_identities",
	"execution_decision_facts"
];
const FIRST_USE_STATE_INDEXES = [
	"idx_node_worker_launches_terminal_completed",
	"execution_identity_contexts_run_created_idx",
	"execution_decision_facts_context_occurred_idx",
	"execution_decision_facts_run_occurred_idx"
];
const LAZY_ADDITIVE_STATE_TABLES = [
	...FIRST_USE_STATE_TABLES,
	"cron_run_receipts",
	"cron_store_epochs",
	"model_catalog_remote",
	"secret_store_entries",
	"projects",
	"user_preferences",
	"loop_governor_turn_counts",
	"device_pair_setup_completions",
	"gateway_origin_device_tokens",
	"device_pairing_join_codes",
	"sidebar_sections",
	"skill_workshop_proposal_events",
	"skill_workshop_proposal_origin_runs",
	"skill_workshop_proposal_rollbacks",
	"skill_workshop_proposals",
	"worker_environment_ssh_fallback_ports"
];
const LAZY_ADDITIVE_STATE_INDEXES = [
	...FIRST_USE_STATE_INDEXES,
	"idx_cron_run_receipts_active_job",
	"idx_cron_run_receipts_job_history",
	"secret_store_entries_live_idx"
];
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
/** User-facing guide for schema refusals; lives here so error sites avoid import cycles. */
const OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
//#endregion
//#region src/infra/sqlite-user-version.ts
function readSqliteUserVersion(db) {
	const row = db.prepare("PRAGMA user_version").get();
	return Number(row?.user_version ?? 0);
}
/**
* Name the refusing install the way `--version` does, plus the root it runs from.
* The path is the only part an operator can always act on: one release version
* string spans many commits, and a linked source checkout reports its git HEAD
* even when the built output actually executing is older.
*/
function describeRunningOpenClawBuild() {
	const moduleUrl = import.meta.url;
	const commit = resolveCommitHash({ moduleUrl });
	const root = resolveOpenClawPackageRootSync({ moduleUrl });
	const identity = commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`;
	return root ? `${identity} installed at ${root}` : identity;
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
	const error = /* @__PURE__ */ new Error(`${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this build supports ${supportedVersion}. Refused by ${describeRunningOpenClawBuild()}. Identify installs by that path: one version string spans many builds, and a linked source checkout reports its git HEAD even when its built output is older. Run a build that supports schema ${schemaVersion} or newer against this state directory — rebuild or update the install above — or point this build at a different OPENCLAW_STATE_DIR. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	error.name = "SqliteSchemaVersionError";
	return error;
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
/**
* Path helpers for the shared OpenClaw SQLite state database.
*
* Tests get worker-scoped temp state roots unless they explicitly provide
* `OPENCLAW_STATE_DIR`, which prevents parallel Vitest workers from sharing WAL files.
*/
function resolveOpenClawStateRootDir(env) {
	if (env.OPENCLAW_STATE_DIR?.trim()) return resolveStateDir(env);
	if (env.VITEST || env.NODE_ENV === "test") {
		const workerId = parseStrictNonNegativeInteger(env.VITEST_WORKER_ID ?? env.VITEST_POOL_ID ?? "");
		const shardSuffix = workerId !== void 0 ? `${process.pid}-${workerId}` : isMainThread ? String(process.pid) : `${process.pid}-${threadId}`;
		return path.join(os.tmpdir(), "openclaw-test-state", shardSuffix);
	}
	return resolveStateDir(env);
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.join(resolveOpenClawStateRootDir(env), "state");
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw.sqlite");
}
/** Resolve the state owner directory for a canonical or explicit shared database path. */
function resolveOpenClawStateDirForDatabasePath(databasePath) {
	const databaseDir = path.dirname(path.resolve(databasePath));
	return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
}
//#endregion
export { getNodeSqliteKysely as _, describeRunningOpenClawBuild as a, FIRST_USE_STATE_TABLES as c, OPENCLAW_DATABASE_SCHEMA_DOCS_URL as d, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as f, executeSqliteQueryTakeFirstSync as g, executeSqliteQuerySync as h, createNewerSqliteSchemaVersionError as i, LAZY_ADDITIVE_STATE_INDEXES as l, enableNodeSqliteKyselyStatementCache as m, resolveOpenClawStateSqliteDir as n, readSqliteUserVersion as o, OPENCLAW_STATE_SCHEMA_VERSION as p, resolveOpenClawStateSqlitePath as r, FIRST_USE_STATE_INDEXES as s, resolveOpenClawStateDirForDatabasePath as t, LAZY_ADDITIVE_STATE_TABLES as u, iterateSqliteQuerySync as v, registerNodeSqliteKyselyQueryErrorHandler as y };
