import { i as isTransientSqliteError } from "./unhandled-rejections-ELdqUxS7.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-lxLIE6rA.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-BqrsoBzK.js";
//#region src/infra/session-cost-usage-cache.sqlite.ts
const LEGACY_CACHE_SCOPE = "session-cost-usage";
const LEGACY_CACHE_KEY = "cache";
const REFRESH_LOCK_KEY = "refresh-lock";
const RETIRED_ROLLUP_SCOPE = "session-cost-usage-rollup-v1";
const ROLLUP_SCOPE = "session-cost-usage-rollup-v2";
function readCacheDatabase(agentId, databasePath, operation) {
	try {
		const result = withOpenClawAgentDatabaseReadOnly(operation, {
			agentId: normalizeAgentId(agentId),
			...databasePath ? { path: databasePath } : {}
		});
		return result.found ? result.value : void 0;
	} catch (error) {
		if (!isTransientSqliteError(error)) throw error;
		return;
	}
}
function readCacheValue(agentId, scope, key, databasePath) {
	return readCacheDatabase(agentId, databasePath, (database) => {
		const kysely = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select("value_json").where("scope", "=", scope).where("key", "=", key).limit(1)).rows[0]?.value_json ?? null;
	}) ?? null;
}
function deleteCacheValueIfUnchanged(params) {
	runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", params.scope).where("key", "=", params.key).where("value_json", "=", params.valueJson));
	}, {
		agentId: normalizeAgentId(params.agentId),
		...params.databasePath ? { path: params.databasePath } : {}
	}, { operationLabel: `session-cost-usage.${params.key}.delete` });
}
function readSessionCostUsageRollupRows(agentId, databasePath) {
	return readCacheDatabase(agentId, databasePath, (database) => {
		const kysely = getNodeSqliteKysely(database.db);
		return executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select([
			"key",
			"value_json",
			"updated_at"
		]).where("scope", "=", ROLLUP_SCOPE)).rows.flatMap((row) => row.value_json === null ? [] : [{
			key: row.key,
			valueJson: row.value_json,
			updatedAt: row.updated_at
		}]);
	}) ?? [];
}
function writeSessionCostUsageRollup(params) {
	return runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		if ((executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select("value_json").where("scope", "=", ROLLUP_SCOPE).where("key", "=", params.rollupId).limit(1)).rows[0]?.value_json ?? null) !== params.previousValueJson) return false;
		executeSqliteQuerySync(database.db, kysely.insertInto("cache_entries").values({
			scope: ROLLUP_SCOPE,
			key: params.rollupId,
			value_json: params.valueJson,
			blob: null,
			expires_at: null,
			updated_at: params.updatedAt
		}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet({
			value_json: params.valueJson,
			blob: null,
			expires_at: null,
			updated_at: params.updatedAt
		})));
		return true;
	}, {
		agentId: normalizeAgentId(params.agentId),
		...params.databasePath ? { path: params.databasePath } : {}
	}, { operationLabel: "session-cost-usage.rollup.write" });
}
function deleteSessionCostUsageRollupsExcept(params) {
	const existing = params.rows.filter((row) => !params.liveKeys.has(row.key));
	runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		for (const row of existing) executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", ROLLUP_SCOPE).where("key", "=", row.key).where("value_json", "=", row.valueJson).where("updated_at", "=", row.updatedAt));
		executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", LEGACY_CACHE_KEY));
		executeSqliteQuerySync(database.db, kysely.deleteFrom("cache_entries").where("scope", "=", RETIRED_ROLLUP_SCOPE));
	}, {
		agentId: normalizeAgentId(params.agentId),
		...params.databasePath ? { path: params.databasePath } : {}
	}, { operationLabel: "session-cost-usage.rollup.prune" });
}
function parseRefreshLock(raw) {
	if (!raw) return null;
	try {
		const value = JSON.parse(raw);
		if (!value || typeof value.pid !== "number" || !Number.isInteger(value.pid) || value.pid <= 0 || typeof value.startedAt !== "number" || !Number.isFinite(value.startedAt) || typeof value.ownerNonce !== "string" || !value.ownerNonce) return null;
		return {
			pid: value.pid,
			startedAt: value.startedAt,
			ownerNonce: value.ownerNonce
		};
	} catch {
		return null;
	}
}
function isProcessRunning(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		return error.code === "EPERM";
	}
}
function isSessionCostUsageRefreshRunning(agentId, databasePath) {
	const raw = readCacheValue(agentId, LEGACY_CACHE_SCOPE, REFRESH_LOCK_KEY, databasePath);
	const lock = parseRefreshLock(raw);
	if (lock && isProcessRunning(lock.pid)) return true;
	if (raw !== null) deleteCacheValueIfUnchanged({
		agentId,
		databasePath,
		scope: LEGACY_CACHE_SCOPE,
		key: REFRESH_LOCK_KEY,
		valueJson: raw
	});
	return false;
}
function acquireSessionCostUsageRefreshLock(agentId, databasePath) {
	const previousRaw = readCacheValue(agentId, LEGACY_CACHE_SCOPE, REFRESH_LOCK_KEY, databasePath);
	const previousLock = parseRefreshLock(previousRaw);
	const previousOwnerIsRunning = previousLock ? isProcessRunning(previousLock.pid) : false;
	const lock = {
		pid: process.pid,
		startedAt: Date.now(),
		ownerNonce: `${process.pid}:${Date.now()}:${process.hrtime.bigint()}`
	};
	const lockJson = JSON.stringify(lock);
	const acquired = runOpenClawAgentWriteTransaction((database) => {
		const kysely = getNodeSqliteKysely(database.db);
		if ((executeSqliteQuerySync(database.db, kysely.selectFrom("cache_entries").select("value_json").where("scope", "=", LEGACY_CACHE_SCOPE).where("key", "=", REFRESH_LOCK_KEY).limit(1)).rows[0]?.value_json ?? null) !== previousRaw || previousOwnerIsRunning) return false;
		executeSqliteQuerySync(database.db, kysely.insertInto("cache_entries").values({
			scope: LEGACY_CACHE_SCOPE,
			key: REFRESH_LOCK_KEY,
			value_json: lockJson,
			blob: null,
			expires_at: null,
			updated_at: lock.startedAt
		}).onConflict((conflict) => conflict.columns(["scope", "key"]).doUpdateSet({
			value_json: lockJson,
			blob: null,
			expires_at: null,
			updated_at: lock.startedAt
		})));
		return true;
	}, {
		agentId: normalizeAgentId(agentId),
		...databasePath ? { path: databasePath } : {}
	}, { operationLabel: "session-cost-usage.refresh-lock.acquire" });
	return {
		acquired,
		release: () => {
			if (acquired) deleteCacheValueIfUnchanged({
				agentId,
				databasePath,
				scope: LEGACY_CACHE_SCOPE,
				key: REFRESH_LOCK_KEY,
				valueJson: lockJson
			});
		}
	};
}
//#endregion
export { writeSessionCostUsageRollup as a, readSessionCostUsageRollupRows as i, deleteSessionCostUsageRollupsExcept as n, isSessionCostUsageRefreshRunning as r, acquireSessionCostUsageRefreshLock as t };
