import { Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Qt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync, r as closeOpenClawStateDatabase } from "./openclaw-state-db-kmBThqu6.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { r as executionOwnerBindingFromAdmission } from "./execution-owner-binding-D6RWdohd.js";
import { i as pruneOrphanedExecutionOwnerLifecycleMetadata, n as bindExecutionOwnerLifecycleMetadata, r as deleteExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-e2AfXbvP.js";
import { i as parseTaskFlowStatus, r as parseOptionalTaskFlowSyncMode } from "./task-flow-registry.types-BidrdCoB.js";
import { v as parseDeliveryContextJson, y as parseSqliteJsonValue } from "./task-registry.store.sqlite-uc-5B4tV.js";
import { o as parseTaskNotifyPolicy } from "./task-registry.types-73FJYVhP.js";
//#region src/tasks/task-flow-registry.store.sqlite.ts
let cachedDatabase = null;
function serializeJson(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function resolveFlowSyncMode(row) {
	const syncMode = parseOptionalTaskFlowSyncMode(row.sync_mode);
	if (syncMode) return syncMode;
	return row.shape === "single_task" ? "task_mirrored" : "managed";
}
function rowToSyncMode(row) {
	return resolveFlowSyncMode(row);
}
function isFlowExecutionOwnerActive(row) {
	const syncMode = resolveFlowSyncMode(row);
	const status = parseTaskFlowStatus(row.status);
	if (row.cancel_requested_at !== null || row.ended_at !== null) return false;
	return syncMode === "task_mirrored" ? status === "queued" || status === "running" : status === "queued" || status === "running" || status === "waiting" || status === "blocked";
}
function rowToFlowRecord(row) {
	const endedAt = normalizeSqliteNumber(row.ended_at);
	const cancelRequestedAt = normalizeSqliteNumber(row.cancel_requested_at);
	const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
	const stateJson = parseSqliteJsonValue(row.state_json);
	const waitJson = parseSqliteJsonValue(row.wait_json);
	return {
		flowId: row.flow_id,
		syncMode: rowToSyncMode(row),
		ownerKey: row.owner_key,
		...requesterOrigin ? { requesterOrigin } : {},
		...row.controller_id ? { controllerId: row.controller_id } : {},
		revision: normalizeSqliteNumber(row.revision) ?? 0,
		status: parseTaskFlowStatus(row.status),
		notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
		goal: row.goal,
		...row.current_step ? { currentStep: row.current_step } : {},
		...row.blocked_task_id ? { blockedTaskId: row.blocked_task_id } : {},
		...row.blocked_summary ? { blockedSummary: row.blocked_summary } : {},
		...stateJson !== void 0 ? { stateJson } : {},
		...waitJson !== void 0 ? { waitJson } : {},
		...cancelRequestedAt != null ? { cancelRequestedAt } : {},
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0,
		...endedAt != null ? { endedAt } : {}
	};
}
function bindFlowRecord(record) {
	return {
		flow_id: record.flowId,
		sync_mode: record.syncMode,
		shape: null,
		owner_key: record.ownerKey,
		requester_origin_json: serializeJson(record.requesterOrigin),
		controller_id: record.controllerId ?? null,
		revision: record.revision,
		status: record.status,
		notify_policy: record.notifyPolicy,
		goal: record.goal,
		current_step: record.currentStep ?? null,
		blocked_task_id: record.blockedTaskId ?? null,
		blocked_summary: record.blockedSummary ?? null,
		state_json: serializeJson(record.stateJson),
		wait_json: serializeJson(record.waitJson),
		cancel_requested_at: record.cancelRequestedAt ?? null,
		created_at: record.createdAt,
		updated_at: record.updatedAt,
		ended_at: record.endedAt ?? null
	};
}
function getFlowRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
function pruneFlowsNotInSnapshot(params) {
	const tempTableName = "openclaw_live_flow_ids";
	params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${tempTableName} (id TEXT PRIMARY KEY)`);
	params.db.exec(`DELETE FROM ${tempTableName}`);
	const insert = params.db.prepare(`INSERT OR IGNORE INTO ${tempTableName} (id) VALUES (?)`);
	for (const id of params.ids) insert.run(id);
	params.db.exec(`
    DELETE FROM flow_runs
    WHERE NOT EXISTS (
      SELECT 1 FROM ${tempTableName}
      WHERE ${tempTableName}.id = flow_runs.flow_id
    )
  `);
	params.db.exec(`DELETE FROM ${tempTableName}`);
}
function selectFlowRows(db) {
	return executeSqliteQuerySync(db, getFlowRegistryKysely(db).selectFrom("flow_runs").select([
		"flow_id",
		"sync_mode",
		"shape",
		"owner_key",
		"requester_origin_json",
		"controller_id",
		"revision",
		"status",
		"notify_policy",
		"goal",
		"current_step",
		"blocked_task_id",
		"blocked_summary",
		"state_json",
		"wait_json",
		"cancel_requested_at",
		"created_at",
		"updated_at",
		"ended_at"
	]).orderBy("created_at", "asc").orderBy("flow_id", "asc")).rows;
}
function upsertFlowRow(db, row) {
	executeSqliteQuerySync(db, getFlowRegistryKysely(db).insertInto("flow_runs").values(row).onConflict((conflict) => conflict.column("flow_id").doUpdateSet({
		sync_mode: (eb) => eb.ref("excluded.sync_mode"),
		owner_key: (eb) => eb.ref("excluded.owner_key"),
		requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
		controller_id: (eb) => eb.ref("excluded.controller_id"),
		revision: (eb) => eb.ref("excluded.revision"),
		status: (eb) => eb.ref("excluded.status"),
		notify_policy: (eb) => eb.ref("excluded.notify_policy"),
		goal: (eb) => eb.ref("excluded.goal"),
		current_step: (eb) => eb.ref("excluded.current_step"),
		blocked_task_id: (eb) => eb.ref("excluded.blocked_task_id"),
		blocked_summary: (eb) => eb.ref("excluded.blocked_summary"),
		state_json: (eb) => eb.ref("excluded.state_json"),
		wait_json: (eb) => eb.ref("excluded.wait_json"),
		cancel_requested_at: (eb) => eb.ref("excluded.cancel_requested_at"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		updated_at: (eb) => eb.ref("excluded.updated_at"),
		ended_at: (eb) => eb.ref("excluded.ended_at")
	})));
}
function openFlowRegistryDatabase() {
	const database = openOpenClawStateDatabase();
	const pathname = database.path;
	if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) return cachedDatabase;
	if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
	cachedDatabase = {
		db: database.db,
		path: pathname
	};
	return cachedDatabase;
}
function withWriteTransaction(write) {
	const database = openFlowRegistryDatabase();
	runOpenClawStateWriteTransaction(() => {
		write(database);
	});
}
function loadTaskFlowRegistryStateFromSqlite() {
	const { db } = openFlowRegistryDatabase();
	const rows = selectFlowRows(db);
	return { flows: new Map(rows.map((row) => [row.flow_id, rowToFlowRecord(row)])) };
}
/** Loads task flows without creating or migrating shared state. */
function loadTaskFlowRegistryStateFromSqliteReadOnly() {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const rows = selectFlowRows(db);
		return { flows: new Map(rows.map((row) => [row.flow_id, rowToFlowRecord(row)])) };
	}) ?? { flows: /* @__PURE__ */ new Map() };
}
function saveTaskFlowRegistryStateToSqlite(snapshot) {
	withWriteTransaction(({ db }) => {
		const kysely = getFlowRegistryKysely(db);
		const flowIds = [...snapshot.flows.keys()];
		if (flowIds.length === 0) {
			executeSqliteQuerySync(db, kysely.deleteFrom("flow_runs"));
			pruneOrphanedExecutionOwnerLifecycleMetadata(db, "flow");
			return;
		}
		pruneFlowsNotInSnapshot({
			db,
			ids: flowIds
		});
		for (const flow of snapshot.flows.values()) upsertFlowRow(db, bindFlowRecord(flow));
		pruneOrphanedExecutionOwnerLifecycleMetadata(db, "flow");
	});
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
	withWriteTransaction(({ db }) => {
		upsertFlowRow(db, bindFlowRecord(flow));
	});
}
/** Binds only the exact flow selected before admission; lifecycle settlement stays owner-native. */
function bindTaskFlowExecution(params) {
	const binding = executionOwnerBindingFromAdmission(params.admitted);
	if (!binding) return "disabled";
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = executeSqliteQueryTakeFirstSync(db, getFlowRegistryKysely(db).selectFrom("flow_runs").select([
			"flow_id",
			"sync_mode",
			"shape",
			"status",
			"cancel_requested_at",
			"ended_at"
		]).where("flow_id", "=", params.flowId));
		if (!current || !isFlowExecutionOwnerActive(current)) return "missing";
		return bindExecutionOwnerLifecycleMetadata({
			db,
			ownerKind: "flow",
			ownerId: current.flow_id,
			binding
		});
	}, params.options, { operationLabel: "task.flow.execution-binding" });
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
	withWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getFlowRegistryKysely(db).deleteFrom("flow_runs").where("flow_id", "=", flowId));
		deleteExecutionOwnerLifecycleMetadata({
			db,
			ownerKind: "flow",
			ownerIds: [flowId]
		});
	});
}
function closeTaskFlowRegistryDatabase() {
	cachedDatabase = null;
	closeOpenClawStateDatabase();
}
//#endregion
export { loadTaskFlowRegistryStateFromSqliteReadOnly as a, loadTaskFlowRegistryStateFromSqlite as i, closeTaskFlowRegistryDatabase as n, saveTaskFlowRegistryStateToSqlite as o, deleteTaskFlowRegistryRecordFromSqlite as r, upsertTaskFlowRegistryRecordToSqlite as s, bindTaskFlowExecution as t };
