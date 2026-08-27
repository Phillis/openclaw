import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Xt as resolveOpenClawStateSqlitePath, _ as withOpenClawStateStartupMigrationCheckpointDatabase, jn as executeSqliteQuerySync, x as assertOpenClawStateWriteAllowed } from "./openclaw-state-db-kmBThqu6.js";
import { u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BcyyC-CC.js";
import { createRequire } from "node:module";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/infra/startup-migration-checkpoint.ts
const STARTUP_MIGRATION_META_KEY = "startup-migrations";
const STATE_MIGRATION_META_KEY = "state-migrations";
const STARTUP_MIGRATION_BUILD_SEPARATOR = "\n";
const STARTUP_MIGRATION_CHECKPOINT_FORMAT = "3";
const STARTUP_MIGRATION_LEASE_SCOPE = "startup-migrations";
const STARTUP_MIGRATION_LEASE_KEY = "global";
const STARTUP_MIGRATION_LEASE_POLL_INTERVAL_MS = 250;
const STARTUP_MIGRATION_LEASE_TTL_MS = 5 * 6e4;
var StartupMigrationLeaseConflictError = class extends Error {
	constructor(message, canWaitForSameHostOwner) {
		super(message);
		this.canWaitForSameHostOwner = canWaitForSameHostOwner;
	}
};
function parseStartupMigrationLeaseOwner(payloadJson) {
	if (!payloadJson) return null;
	let owner;
	try {
		const parsed = JSON.parse(payloadJson);
		owner = isRecord(parsed) ? parsed.owner : null;
	} catch {
		return null;
	}
	if (!isRecord(owner)) return null;
	const { pid, host, startedAt } = owner;
	if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 0 || typeof host !== "string" || !host || startedAt !== null && (typeof startedAt !== "number" || !Number.isSafeInteger(startedAt) || startedAt < 0)) return null;
	return {
		pid,
		host,
		startedAt
	};
}
function isStartupMigrationLeaseOwnerDefinitelyGone(owner) {
	if (!owner || owner.host !== hostname()) return false;
	if (isPidDefinitelyDead(owner.pid)) return true;
	const currentStartedAt = getFileLockProcessStartTime(owner.pid);
	return owner.startedAt !== null && currentStartedAt !== null && currentStartedAt !== owner.startedAt;
}
function resolveStartupMigrationBuildIdentity(moduleUrl = import.meta.url) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of [
			"./build-info.json",
			"../build-info.json",
			"../../dist/build-info.json"
		]) try {
			const info = require(candidate);
			if (typeof info.builtAt !== "string" || !info.builtAt.trim()) continue;
			return info.builtAt.trim();
		} catch {}
	} catch {}
	return null;
}
function withStartupMigrationCheckpointDatabase(env, callback) {
	return withOpenClawStateStartupMigrationCheckpointDatabase(callback, { env });
}
function writeStartupMigrationCheckpointDatabase(env, callback) {
	const databasePath = resolveOpenClawStateSqlitePath(env);
	return withStartupMigrationCheckpointDatabase(env, (db) => runSqliteImmediateTransactionSync(db, () => {
		assertOpenClawStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		return callback(db);
	}));
}
function assertStartupMigrationLeaseOwnedInTransaction(params) {
	const stateDb = getNodeSqliteKysely(params.database);
	if (!executeSqliteQueryTakeFirstSync(params.database, stateDb.selectFrom("state_leases").select("owner").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", params.owner).where("expires_at", ">", params.nowMs ?? Date.now()))) throw new Error("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
}
function formatStartupMigrationCheckpoint(params) {
	const identity = params.identity;
	if (params.buildIdentity === null || !identity || !identity.effectiveConfigFingerprint.trim() || !identity.pluginDoctorConfigFingerprint.trim() || !identity.pluginMigrationFingerprint.trim()) return null;
	return [
		params.version,
		STARTUP_MIGRATION_CHECKPOINT_FORMAT,
		params.buildIdentity,
		identity.effectiveConfigFingerprint,
		identity.pluginDoctorConfigFingerprint,
		identity.pluginMigrationFingerprint
	].join(STARTUP_MIGRATION_BUILD_SEPARATOR);
}
function readMigrationCheckpoint(env, metaKey) {
	return withStartupMigrationCheckpointDatabase(env, (db) => {
		return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("schema_meta").select("app_version as appVersion").where("meta_key", "=", metaKey))?.appVersion ?? null;
	});
}
function readStartupMigrationVersion(env = process.env) {
	return readMigrationCheckpoint(env, STARTUP_MIGRATION_META_KEY)?.split(STARTUP_MIGRATION_BUILD_SEPARATOR, 1)[0] ?? null;
}
/** Returns whether the canonical automatic-migration lease is still live. */
function hasActiveStartupMigrationLease(params = {}) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const lease = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("state_leases").select("payload_json as payloadJson").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("expires_at", ">", nowMs));
		return Boolean(lease && !isStartupMigrationLeaseOwnerDefinitelyGone(parseStartupMigrationLeaseOwner(lease.payloadJson)));
	}, { env }) ?? false;
}
function needsMigrationCheckpoint(metaKey, params = {}) {
	const env = params.env ?? process.env;
	const checkpoint = formatStartupMigrationCheckpoint({
		buildIdentity: params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity,
		identity: params.identity,
		version: params.version ?? VERSION
	});
	if (checkpoint === null) return true;
	return readMigrationCheckpoint(env, metaKey) !== checkpoint;
}
function needsStartupMigrationCheckpoint(params = {}) {
	return needsMigrationCheckpoint(STARTUP_MIGRATION_META_KEY, params);
}
function needsStateMigrationCheckpoint(params = {}) {
	return needsMigrationCheckpoint(STATE_MIGRATION_META_KEY, params) && needsMigrationCheckpoint(STARTUP_MIGRATION_META_KEY, params);
}
function acquireStartupMigrationLease(params = {}) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	const owner = params.owner ?? randomUUID();
	const ownerPid = params.ownerPid ?? process.pid;
	const leaseOwner = {
		pid: ownerPid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(ownerPid)
	};
	const expiresAt = nowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
	writeStartupMigrationCheckpointDatabase(env, (db) => {
		const stateDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("state_leases").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("expires_at", "<=", nowMs));
		const existing = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("state_leases").select([
			"owner",
			"expires_at as expiresAt",
			"payload_json as payloadJson"
		]).where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY));
		const existingOwner = parseStartupMigrationLeaseOwner(existing?.payloadJson ?? null);
		if (existing && isStartupMigrationLeaseOwnerDefinitelyGone(existingOwner)) executeSqliteQuerySync(db, stateDb.deleteFrom("state_leases").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", existing.owner));
		else if (existing) {
			const ownerHint = existingOwner ? ` (held by pid ${existingOwner.pid})` : "";
			throw new StartupMigrationLeaseConflictError(`OpenClaw startup migrations are already running for this state directory; retry after the other OpenClaw process finishes or after ${new Date(existing.expiresAt ?? expiresAt).toISOString()}.${ownerHint}`, existingOwner?.host === hostname());
		}
		executeSqliteQuerySync(db, stateDb.insertInto("state_leases").values({
			scope: STARTUP_MIGRATION_LEASE_SCOPE,
			lease_key: STARTUP_MIGRATION_LEASE_KEY,
			owner,
			expires_at: expiresAt,
			heartbeat_at: nowMs,
			payload_json: JSON.stringify({
				version: VERSION,
				owner: leaseOwner
			}),
			created_at: nowMs,
			updated_at: nowMs
		}));
	});
	return {
		owner,
		assertOwnedInTransaction: (database, assertionParams = {}) => {
			assertStartupMigrationLeaseOwnedInTransaction({
				database,
				owner,
				nowMs: assertionParams.nowMs
			});
		},
		heartbeat: (heartbeatParams = {}) => {
			const heartbeatNowMs = heartbeatParams.nowMs ?? Date.now();
			const heartbeatExpiresAt = heartbeatNowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
			writeStartupMigrationCheckpointDatabase(env, (db) => {
				if (executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("state_leases").set({
					expires_at: heartbeatExpiresAt,
					heartbeat_at: heartbeatNowMs,
					updated_at: heartbeatNowMs
				}).where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", owner).where("expires_at", ">", heartbeatNowMs)).numAffectedRows !== 1n) throw new Error("OpenClaw startup migration lease was lost before startup migrations completed; retry so migrations can run under a fresh lease.");
			});
		},
		release: () => {
			writeStartupMigrationCheckpointDatabase(env, (db) => {
				executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE).where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY).where("owner", "=", owner));
			});
		}
	};
}
async function acquireStartupMigrationLeaseWithWait(params = {}) {
	const now = params.now ?? Date.now;
	const monotonicNow = params.monotonicNow ?? performance.now.bind(performance);
	const sleep = params.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const timeoutMs = Math.max(0, Math.min(params.timeoutMs ?? 3e5, STARTUP_MIGRATION_LEASE_TTL_MS));
	const pollIntervalMs = Math.max(1, params.pollIntervalMs ?? STARTUP_MIGRATION_LEASE_POLL_INTERVAL_MS);
	const owner = params.owner ?? randomUUID();
	const deadlineMs = monotonicNow() + timeoutMs;
	while (true) try {
		return acquireStartupMigrationLease({
			env: params.env,
			nowMs: now(),
			owner,
			ownerPid: params.ownerPid
		});
	} catch (error) {
		if (!(error instanceof StartupMigrationLeaseConflictError) || !error.canWaitForSameHostOwner) throw error;
		const remainingMs = deadlineMs - monotonicNow();
		if (remainingMs <= 0) throw error;
		await sleep(Math.min(pollIntervalMs, remainingMs));
	}
}
function recordSuccessfulMigrationCheckpoints(metaKeys, params = {}) {
	const env = params.env ?? process.env;
	const version = params.version ?? VERSION;
	const buildIdentity = params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity;
	const nowMs = params.nowMs ?? Date.now();
	const checkpoint = formatStartupMigrationCheckpoint({
		buildIdentity,
		identity: params.identity,
		version
	});
	if (checkpoint === null) return;
	writeStartupMigrationCheckpointDatabase(env, (db) => {
		params.lease?.assertOwnedInTransaction(db, { nowMs });
		const stateDb = getNodeSqliteKysely(db);
		for (const metaKey of metaKeys) executeSqliteQuerySync(db, stateDb.insertInto("schema_meta").values({
			meta_key: metaKey,
			role: "global",
			schema_version: 3,
			agent_id: null,
			app_version: checkpoint,
			created_at: nowMs,
			updated_at: nowMs
		}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
			role: "global",
			schema_version: 3,
			agent_id: null,
			app_version: checkpoint,
			updated_at: nowMs
		})));
	});
}
function recordSuccessfulStateMigrations(params = {}) {
	recordSuccessfulMigrationCheckpoints([STATE_MIGRATION_META_KEY], params);
}
function recordSuccessfulStartupMigrations(params = {}) {
	recordSuccessfulMigrationCheckpoints([STATE_MIGRATION_META_KEY, STARTUP_MIGRATION_META_KEY], params);
}
//#endregion
export { needsStartupMigrationCheckpoint as a, recordSuccessfulStartupMigrations as c, hasActiveStartupMigrationLease as i, recordSuccessfulStateMigrations as l, acquireStartupMigrationLease as n, needsStateMigrationCheckpoint as o, acquireStartupMigrationLeaseWithWait as r, readStartupMigrationVersion as s, STARTUP_MIGRATION_LEASE_TTL_MS as t };
