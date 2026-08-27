import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-DsoDzKB9.js";
import { An as enableNodeSqliteKyselyStatementCache, At as createOpenClawDatabaseVerificationError, Ln as isSqliteSchemaVersionError, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Rt as createSqliteTerminalOpenLatch, Ut as clearOpenClawDatabaseQuarantine, Wt as readOpenClawDatabaseQuarantine, bt as quarantineOrphanedSqliteSidecars, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync, k as ensureAgentDatabaseLeaseSchema } from "./openclaw-state-db-kmBThqu6.js";
import { t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { i as isTerminalSqliteIntegrityError, r as confirmSqliteFileIntegrity } from "./sqlite-integrity-D3VwDKmB.js";
import { i as registerSqliteCacheExitClose, n as configureSqlitePreSchemaPragmas, t as configureSqliteConnectionPragmas } from "./sqlite-wal-BHpwckP_.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BcyyC-CC.js";
import { n as assertAgentDeletionPathFence, o as prepareAgentDeletionPathFence, t as assertAgentDeletionIdentityClaimAllowed } from "./agent-deletion-journal-C1nSMR13.js";
import { B as resolveOpenClawAgentSqlitePath, L as ensureOpenClawAgentDatabasePermissions, M as registerOpenClawAgentDatabase, N as unregisterOpenClawAgentDatabase, R as isIncognitoOpenClawAgentSqlitePath, a as ensureAgentSchema, c as assertCanonicalAgentMediaPersistenceVersion, d as assertSupportedAgentSchemaVersion, f as readExistingAgentSchemaMeta, i as assertAgentDatabaseIntegrityBeforeMutation, j as isSameOpenClawAgentDatabasePath, l as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-DRTqyY7R.js";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/state/openclaw-agent-db-lease.ts
const AGENT_DATABASE_MAINTENANCE_LEASE = {
	scope: "core:agent-database-maintenance",
	key: "global"
};
function claimOpenClawAgentDatabaseLease(params) {
	const agentId = normalizeAgentId(params.agentId);
	const deletionFence = prepareAgentDeletionPathFence({
		agentId,
		path: params.path
	}, { env: params.env });
	const leaseId = crypto.randomUUID();
	const ownerStartTime = getFileLockProcessStartTime(process.pid);
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("state_leases").select("owner").where("scope", "=", AGENT_DATABASE_MAINTENANCE_LEASE.scope).where("lease_key", "=", AGENT_DATABASE_MAINTENANCE_LEASE.key).where("expires_at", ">", Date.now()))) throw new Error("Agent database maintenance is in progress; retry after openclaw doctor --fix completes.");
		const deletion = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_deletion_journal").select("agent_id").where("agent_id", "=", agentId));
		assertAgentDeletionIdentityClaimAllowed(agentId, deletion?.agent_id);
		assertAgentDeletionPathFence(database.db, deletionFence);
		executeSqliteQuerySync(database.db, db.insertInto("agent_database_leases").values({
			lease_id: leaseId,
			agent_id: agentId,
			path: params.path,
			owner_pid: process.pid,
			owner_start_time: ownerStartTime,
			opened_at: Date.now()
		}));
	}, { env: params.env });
	return leaseId;
}
function releaseOpenClawAgentDatabaseLease(leaseId, options = {}) {
	runOpenClawStateWriteTransaction((database) => {
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "=", leaseId));
	}, options);
}
function assertNoOpenClawAgentDatabaseLeases(agentIdRaw, options = {}) {
	const maintenance = typeof agentIdRaw === "string" ? void 0 : agentIdRaw;
	const agentId = typeof agentIdRaw === "string" ? normalizeAgentId(agentIdRaw) : void 0;
	const rows = runOpenClawStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("agent_database_leases").select([
			"agent_id",
			"lease_id",
			"owner_pid",
			"owner_start_time",
			"path"
		])).rows;
	}, options);
	const staleLeaseIds = rows.filter((row) => {
		if (isPidDefinitelyDead(row.owner_pid)) return true;
		const currentStartTime = getFileLockProcessStartTime(row.owner_pid);
		return row.owner_start_time !== null && currentStartTime !== null && row.owner_start_time !== currentStartTime;
	}).map((row) => row.lease_id);
	if (staleLeaseIds.length > 0) runOpenClawStateWriteTransaction((database) => {
		maintenance?.assertOwnedInTransaction(database.db);
		ensureAgentDatabaseLeaseSchema(database.db);
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_database_leases").where("lease_id", "in", staleLeaseIds));
	}, options);
	const staleLeaseIdSet = new Set(staleLeaseIds);
	for (const row of rows) {
		if (staleLeaseIdSet.has(row.lease_id)) continue;
		const deletionFence = agentId ? prepareAgentDeletionPathFence({
			agentId: row.agent_id,
			path: row.path,
			fenceAgentId: agentId
		}, options) : void 0;
		let leaseStillExists = false;
		runOpenClawStateWriteTransaction((database) => {
			maintenance?.assertOwnedInTransaction(database.db);
			ensureAgentDatabaseLeaseSchema(database.db);
			const db = getNodeSqliteKysely(database.db);
			leaseStillExists = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("agent_database_leases").select("lease_id").where("lease_id", "=", row.lease_id)) !== void 0;
			if (leaseStillExists && row.agent_id !== agentId && deletionFence) assertAgentDeletionPathFence(database.db, deletionFence);
		}, options);
		if (leaseStillExists && (!agentId || row.agent_id === agentId)) {
			const remediation = agentId ? "." : "; stop that process and rerun openclaw doctor --fix.";
			throw new Error(`Agent ${row.agent_id} database is still open in another process${remediation}`);
		}
	}
}
//#endregion
//#region src/state/openclaw-agent-db.ts
/**
* Per-agent SQLite database lifecycle and shared-state registration.
*
* Each opened agent database is schema-owned by one normalized agent id, cached
* per pathname, protected with private file modes, and registered in the shared
* OpenClaw state database for discovery and maintenance.
*/
const OPENCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
var IncognitoAgentDatabasePathCollisionError = class extends Error {
	constructor(pathname) {
		super(`Incognito agent database sentinel path already exists: ${pathname}. This filename is reserved for in-memory incognito state; move or rename the file and retry.`);
		this.name = "IncognitoAgentDatabasePathCollisionError";
		this.path = pathname;
	}
};
const OPENCLAW_AGENT_DB_OPEN_HANDLE_CAP = 64;
const agentDbLog = createSubsystemLogger("state/agent-db");
const cachedDatabases = /* @__PURE__ */ new Map();
const incognitoDatabases = /* @__PURE__ */ new WeakSet();
let incognitoDatabaseGeneration = 0;
const cachedDatabaseOpenFailures = /* @__PURE__ */ new Map();
const cachedDatabaseLeases = /* @__PURE__ */ new Map();
const validatedAgentDatabasePaths = /* @__PURE__ */ new Map();
const terminalOpenLatch = createSqliteTerminalOpenLatch({ closeByPath: closeOpenClawAgentDatabaseByPath });
/** Reconfirm an advisory worker failure on the live owner connection. */
function confirmOpenClawAgentDatabaseIntegrity(pathname) {
	const resolvedPath = path.resolve(pathname);
	closeOpenClawAgentDatabaseByPath(resolvedPath);
	validatedAgentDatabasePaths.delete(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawAgentDatabaseOpenFailure(pathname, error, generation) {
	const recorded = terminalOpenLatch.record(pathname, error, generation);
	if (recorded) validatedAgentDatabasePaths.delete(path.resolve(pathname));
	return recorded;
}
/**
* Clear a terminal open failure after doctor rewrites the database file.
* Returns false when the persisted quarantine row survived; callers must
* surface that, or the next open re-quarantines the repaired file.
*/
function clearOpenClawAgentDatabaseOpenFailure(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	const cleared = clearOpenClawDatabaseQuarantine(resolvedPath, { env: options.env });
	terminalOpenLatch.clear(resolvedPath);
	return cleared;
}
function logSlowAgentDatabaseOpen(params) {
	if (params.elapsedMs < OPENCLAW_AGENT_DB_SLOW_OPEN_MS) return;
	agentDbLog.warn("slow OpenClaw agent database open", {
		agentId: params.agentId,
		elapsedMs: params.elapsedMs,
		path: params.path,
		thresholdMs: OPENCLAW_AGENT_DB_SLOW_OPEN_MS
	});
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectOpenClawAgentDatabaseOwner(pathname) {
	let db;
	try {
		const opened = cachedDatabases.get(path.resolve(pathname));
		if (opened?.db.isOpen) {
			assertSupportedAgentSchemaVersion(opened.db, pathname);
			return {
				status: "owned",
				agentId: opened.agentId
			};
		}
		db = openNodeSqliteDatabase(pathname, { readOnly: true });
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedAgentSchemaVersion(db, pathname);
		const existing = readExistingAgentSchemaMeta(db);
		if (!existing) return { status: "unowned" };
		if (existing.role !== "agent" || !existing.agentId) return { status: "unreadable" };
		return {
			status: "owned",
			agentId: normalizeAgentId(existing.agentId)
		};
	} catch {
		return { status: "unreadable" };
	} finally {
		db?.close();
	}
}
/** Open or return a cached per-agent database after schema and owner validation. */
function openOpenClawAgentDatabase(options) {
	const agentId = normalizeAgentId(options.agentId);
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	const incognito = isIncognitoOpenClawAgentSqlitePath(pathname, databaseOptions);
	const cached = cachedDatabases.get(pathname);
	if (cached?.db.isOpen) {
		if (cachedDatabaseOpenFailures.has(pathname)) throw cachedDatabaseOpenFailures.get(pathname);
		if (cached.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${cached.agentId}; requested agent ${agentId}.`);
		cachedDatabases.delete(pathname);
		cachedDatabases.set(pathname, cached);
		return cached;
	}
	if (incognito) {
		if (existsSync(pathname)) throw new IncognitoAgentDatabasePathCollisionError(pathname);
		if (cached) {
			closeCachedOpenClawAgentDatabase(cached);
			cachedDatabases.delete(pathname);
			cachedDatabaseOpenFailures.delete(pathname);
		}
		const db = openNodeSqliteDatabase(":memory:");
		configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
		const walMaintenance = configureSqliteConnectionPragmas(db, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: `openclaw-agent-incognito:${agentId}`,
			foreignKeys: true,
			synchronous: "NORMAL"
		});
		ensureAgentSchema(db, agentId, pathname);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		incognitoDatabases.add(database);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		cachedDatabases.set(pathname, database);
		incognitoDatabaseGeneration += 1;
		return database;
	}
	quarantineOrphanedSqliteSidecars(pathname);
	const terminalFailure = terminalOpenLatch.get(pathname);
	if (terminalFailure) throw terminalFailure;
	let persistedFailure;
	try {
		const quarantine = readOpenClawDatabaseQuarantine(pathname, { env: databaseOptions.env });
		if (quarantine) persistedFailure = createOpenClawDatabaseVerificationError("agent", pathname, quarantine.reason);
	} catch {}
	if (persistedFailure) {
		recordOpenClawAgentDatabaseOpenFailure(pathname, persistedFailure);
		throw persistedFailure;
	}
	if (cached) {
		closeCachedOpenClawAgentDatabase(cached);
		cachedDatabases.delete(pathname);
		cachedDatabaseOpenFailures.delete(pathname);
	}
	const leaseId = claimOpenClawAgentDatabaseLease({
		agentId,
		path: pathname,
		...options.env ? { env: options.env } : {}
	});
	const openStartedAt = Date.now();
	let openedDb;
	let openedDatabase;
	let openedWalMaintenance;
	try {
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		evictLruAgentDatabaseHandles();
		const db = openNodeSqliteDatabase(pathname);
		enableNodeSqliteKyselyStatementCache(db);
		openedDb = db;
		const isValidatedReopen = validatedAgentDatabasePaths.get(pathname) === agentId;
		const walMaintenance = (() => {
			let maintenance;
			try {
				db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
				if (!isValidatedReopen) {
					assertSupportedAgentSchemaVersion(db, pathname);
					assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
				}
				assertAgentDatabaseIntegrityBeforeMutation(db, agentId, pathname);
				assertCanonicalAgentMediaPersistenceVersion(db, pathname);
				configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
				maintenance = configureSqliteConnectionPragmas(db, {
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: `openclaw-agent:${agentId}`,
					databasePath: pathname,
					foreignKeys: true,
					synchronous: "NORMAL"
				});
				openedWalMaintenance = maintenance;
				if (!isValidatedReopen) ensureAgentSchema(db, agentId, pathname);
				return maintenance;
			} catch (err) {
				maintenance?.close();
				db.close();
				if (err instanceof Error && (isSqliteSchemaVersionError(err) || isTerminalSqliteIntegrityError(err))) recordOpenClawAgentDatabaseOpenFailure(pathname, err);
				throw err;
			}
		})();
		ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
		const database = {
			agentId,
			db,
			path: pathname,
			walMaintenance
		};
		openedDatabase = database;
		if (!isValidatedReopen) {
			registerOpenClawAgentDatabase({
				agentId,
				path: pathname,
				env: options.env
			});
			validatedAgentDatabasePaths.set(pathname, agentId);
		}
		terminalOpenLatch.clear(pathname);
		unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		logSlowAgentDatabaseOpen({
			agentId,
			elapsedMs: Date.now() - openStartedAt,
			path: pathname
		});
		cachedDatabaseLeases.set(pathname, {
			leaseId,
			env: options.env
		});
		cachedDatabases.set(pathname, database);
		return database;
	} catch (error) {
		let closeError;
		if (openedDatabase) try {
			closeCachedOpenClawAgentDatabase(openedDatabase);
		} catch (caught) {
			closeError = caught;
		}
		if (openedDb?.isOpen) {
			validatedAgentDatabasePaths.delete(pathname);
			const retainedDatabase = openedDatabase ?? {
				agentId,
				db: openedDb,
				path: pathname,
				walMaintenance: openedWalMaintenance ?? {
					checkpoint: () => false,
					close: () => false
				}
			};
			cachedDatabases.set(pathname, retainedDatabase);
			cachedDatabaseLeases.set(pathname, {
				leaseId,
				env: options.env
			});
			cachedDatabaseOpenFailures.set(pathname, closeError ?? error);
			unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
		} else releaseOpenClawAgentDatabaseLease(leaseId, { env: options.env });
		throw closeError ?? error;
	}
}
/** Run a synchronous immediate transaction against an agent database. */
const postCommitPublications = /* @__PURE__ */ new WeakMap();
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferOpenClawAgentPostCommitPublication(database, publish) {
	const publications = postCommitPublications.get(database);
	if (!publications) return false;
	publications.push(publish);
	return true;
}
function runOpenClawAgentWriteTransaction(operation, options, transactionOptions = {}) {
	const database = openOpenClawAgentDatabase(options);
	const enteredNestedTransaction = database.db.isTransaction;
	const publications = enteredNestedTransaction ? postCommitPublications.get(database) : [];
	const publicationStart = publications?.length ?? 0;
	if (!enteredNestedTransaction && publications) postCommitPublications.set(database, publications);
	let result;
	try {
		result = runSqliteImmediateTransactionSync(database.db, () => {
			const operationResult = operation(database);
			if (!enteredNestedTransaction) {
				if (!incognitoDatabases.has(database)) ensureOpenClawAgentDatabasePermissions(database.path, options);
			}
			return operationResult;
		}, {
			busyTimeoutMs: transactionOptions.busyTimeoutMs ?? 5e3,
			databaseLabel: database.path,
			...transactionOptions,
			operationLabel: transactionOptions.operationLabel ?? "agent.write"
		});
	} catch (error) {
		publications?.splice(publicationStart);
		throw error;
	} finally {
		if (!enteredNestedTransaction && publications) postCommitPublications.delete(database);
	}
	if (!enteredNestedTransaction) for (const publish of publications ?? []) publish();
	return result;
}
let unregisterExitClose = null;
function closeCachedOpenClawAgentDatabase(database, options = {}) {
	database.walMaintenance.close(options.eviction ? { checkpointMode: "PASSIVE" } : void 0);
	if (database.db.isOpen) database.db.close();
	const lease = cachedDatabaseLeases.get(database.path);
	if (lease) {
		releaseOpenClawAgentDatabaseLease(lease.leaseId, { env: lease.env });
		cachedDatabaseLeases.delete(database.path);
	}
}
function evictLruAgentDatabaseHandles() {
	while (cachedDatabases.size >= 64) {
		let evicted = false;
		for (const [pathname, database] of cachedDatabases) {
			if (database.db.isTransaction) continue;
			if (incognitoDatabases.has(database)) continue;
			closeCachedOpenClawAgentDatabase(database, { eviction: true });
			cachedDatabases.delete(pathname);
			cachedDatabaseOpenFailures.delete(pathname);
			agentDbLog.debug("evicted OpenClaw agent database handle", {
				agentId: database.agentId,
				openHandles: cachedDatabases.size,
				path: pathname
			});
			evicted = true;
			break;
		}
		if (!evicted) {
			agentDbLog.warn("agent database handle cap exceeded; all cached handles are in transactions", {
				cap: 64,
				openHandles: cachedDatabases.size
			});
			return;
		}
	}
}
/** Return whether the exact cached agent database pathname is still open. */
function isOpenClawAgentDatabaseOpen(pathname) {
	return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
}
/** Return the matching live cache entry without materializing a database. */
function getOpenClawAgentDatabaseIfOpen(options) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	const database = cachedDatabases.get(pathname);
	if (!database?.db.isOpen) return;
	if (cachedDatabaseOpenFailures.has(pathname)) throw cachedDatabaseOpenFailures.get(pathname);
	if (database.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${database.agentId}; requested agent ${agentId}.`);
	return database;
}
/** Lists process-held incognito databases without opening new sentinel handles. */
function listOpenIncognitoAgentDatabases() {
	return [...cachedDatabases.values()].filter((database) => database.db.isOpen && incognitoDatabases.has(database)).map((database) => ({
		agentId: database.agentId,
		storePath: database.path
	})).toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.storePath.localeCompare(right.storePath));
}
/** Return the generation of process-held incognito database membership. */
function readOpenIncognitoAgentDatabaseGeneration() {
	return incognitoDatabaseGeneration;
}
/** Returns whether this exact process-held database is incognito/in-memory. */
function isIncognitoOpenClawAgentDatabase(database) {
	return incognitoDatabases.has(database);
}
/** List process-held agent databases without opening or inspecting fixture state. */
function listOpenClawAgentDatabasesForTest() {
	return [...cachedDatabases.values()].filter((database) => database.db.isOpen).map((database) => ({
		agentId: database.agentId,
		path: database.path
	})).toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.path.localeCompare(right.path));
}
/** Close one cached agent database identified by its exact resolved pathname. */
function closeOpenClawAgentDatabaseByPath(pathname) {
	const resolvedPath = path.resolve(pathname);
	const database = cachedDatabases.get(resolvedPath);
	if (!database) return false;
	const incognito = incognitoDatabases.has(database);
	closeCachedOpenClawAgentDatabase(database);
	cachedDatabases.delete(resolvedPath);
	cachedDatabaseOpenFailures.delete(resolvedPath);
	if (incognito) incognitoDatabaseGeneration += 1;
	if (cachedDatabases.size === 0) {
		unregisterExitClose?.();
		unregisterExitClose = null;
	}
	return true;
}
/** Close and unregister one unambiguous transient agent database by filesystem identity. */
function disposeOpenClawAgentDatabaseByPath(pathname, options = {}) {
	const resolvedPath = path.resolve(pathname);
	validatedAgentDatabasePaths.delete(resolvedPath);
	const matchingDatabases = [...cachedDatabases.values()].filter((candidate) => isSameOpenClawAgentDatabasePath(candidate.path, resolvedPath));
	if (matchingDatabases.length > 1) return false;
	const database = matchingDatabases[0];
	if (database && incognitoDatabases.has(database)) return closeOpenClawAgentDatabaseByPath(database.path);
	if (!database) return false;
	try {
		unregisterOpenClawAgentDatabase({
			agentId: database.agentId,
			path: database.path,
			...options.env ? { env: options.env } : {}
		});
	} finally {
		closeOpenClawAgentDatabaseByPath(database.path);
	}
	return true;
}
/** Close all cached agent database handles. */
function closeOpenClawAgentDatabases() {
	unregisterExitClose?.();
	unregisterExitClose = null;
	const removedIncognito = [...cachedDatabases.values()].some((database) => database.db.isOpen && incognitoDatabases.has(database));
	for (const database of cachedDatabases.values()) closeCachedOpenClawAgentDatabase(database);
	cachedDatabases.clear();
	cachedDatabaseOpenFailures.clear();
	if (removedIncognito) incognitoDatabaseGeneration += 1;
}
/** Fence cross-process agent writers while Doctor reconciles shared plugin state. */
function withAgentDatabaseMaintenanceLease(options, run) {
	return withOpenClawStateLease({
		...AGENT_DATABASE_MAINTENANCE_LEASE,
		database: {
			scope: "shared",
			options
		},
		leaseMs: 6e4,
		waitMs: 5e3,
		leaseLabel: "agent database maintenance lease",
		operationLabel: "agent.database.maintenance.lease"
	}, (maintenance) => {
		closeOpenClawAgentDatabases();
		assertNoOpenClawAgentDatabaseLeases(maintenance, options);
		return run(maintenance);
	});
}
/** Close cached agent handles and clear terminal failure latches for test isolation. */
function closeOpenClawAgentDatabasesForTest() {
	closeOpenClawAgentDatabases();
	validatedAgentDatabasePaths.clear();
	terminalOpenLatch.clearAll();
}
//#endregion
export { readOpenIncognitoAgentDatabaseGeneration as _, closeOpenClawAgentDatabases as a, withAgentDatabaseMaintenanceLease as b, deferOpenClawAgentPostCommitPublication as c, inspectOpenClawAgentDatabaseOwner as d, isIncognitoOpenClawAgentDatabase as f, openOpenClawAgentDatabase as g, listOpenIncognitoAgentDatabases as h, closeOpenClawAgentDatabaseByPath as i, disposeOpenClawAgentDatabaseByPath as l, listOpenClawAgentDatabasesForTest as m, OPENCLAW_AGENT_DB_OPEN_HANDLE_CAP as n, closeOpenClawAgentDatabasesForTest as o, isOpenClawAgentDatabaseOpen as p, clearOpenClawAgentDatabaseOpenFailure as r, confirmOpenClawAgentDatabaseIntegrity as s, IncognitoAgentDatabasePathCollisionError as t, getOpenClawAgentDatabaseIfOpen as u, recordOpenClawAgentDatabaseOpenFailure as v, assertNoOpenClawAgentDatabaseLeases as x, runOpenClawAgentWriteTransaction as y };
