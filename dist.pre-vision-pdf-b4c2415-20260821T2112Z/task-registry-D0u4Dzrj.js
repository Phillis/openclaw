import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { Lt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, r as closeOpenClawStateDatabase } from "./openclaw-state-db-DlCMR4eQ.js";
import { u as onAgentEvent } from "./agent-events-Cmj8toCy.js";
import { m as runWithGatewayIndependentRootWorkAdmission, o as isGatewayRestartDraining } from "./gateway-work-admission-QDz202p9.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-DzXavROn.js";
import { d as sessionDeliveryOrigin, s as normalizeDeliveryContext } from "./delivery-context.shared-D-qPZITK.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { c as requestHeartbeat } from "./heartbeat-wake-WmGdPBfX.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { _ as parseSqliteJsonValue, g as parseDeliveryContextJson, h as parseTaskNotifyPolicy } from "./task-registry.store.sqlite-DF7-e6ST.js";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, o as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import { $ as formatTaskTerminalMessage, B as taskIdsByParentFlowId, C as getTasksByRunId, D as persistTaskRegistry, E as loadTaskRegistryDeliveryRuntime, F as setTaskRegistryListenerStop, G as tryPersistTaskDelete, H as taskRegistryLog, I as snapshotTaskRecords, J as cloneTaskDeliveryState, K as tryPersistTaskDeliveryStateUpsert, L as taskDeliveryStates, M as resetTaskRegistryRestoreState, N as restoreTaskRegistryOnce, O as pickPreferredRunIdTask, P as setTaskRegistryListenerStarter, Q as formatTaskStateChangeMessage, R as taskFlowSyncRetryTimers, S as getPeerTasksForDelivery, T as loadTaskRegistryControlRuntime, U as tasks, V as taskIdsByRelatedSessionKey, W as tasksWithPendingDelivery, X as normalizeTaskTimestamps, Y as cloneTaskRecord, Z as formatTaskBlockedFollowupMessage, _ as deleteParentFlowIdIndex, a as TASK_FLOW_SYNC_RETRY_DELAYS_MS, at as SUBAGENT_KILL_TASK_ERROR, b as emitTaskRegistryObserverEvent, c as addOwnerKeyIndex, d as addRunIdIndex, et as isTerminalTaskStatus, f as claimTaskRegistryListenerStart, g as deleteOwnerKeyIndex, h as controlRuntimeLoader, i as recordTaskActivityEvent, it as shouldUseParentReviewTaskTerminalMessage, j as resetTaskRegistryListenerState, k as rebuildRunIdIndex, l as addParentFlowIdIndex, m as compareTasksNewestFirst, n as flushTaskActivity, nt as shouldAutoDeliverTaskTerminalUpdate, o as TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY, p as clearTaskRegistryMemory, q as tryPersistTaskUpsert, rt as shouldSuppressDuplicateTerminalDelivery, s as TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY, t as clearTaskActivity, tt as shouldAutoDeliverTaskStateChange, u as addRelatedSessionKeyIndex, v as deleteRelatedSessionKeyIndex, w as getTasksByRunScope, x as ensureTaskRegistryReady, y as deliveryRuntimeLoader, z as taskIdsByOwnerKey } from "./task-registry-activity-Da_BdI-a.js";
import { i as resetTaskRegistryRuntimeForTests, r as getTaskRegistryStore } from "./task-registry.store-RQ0r4m7X.js";
import { a as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-Dl6QbFSU.js";
import { t as channelSupportsThreadDelivery } from "./thread-addressing-B9gAXkMR.js";
import { n as resolveTaskCleanupAfter } from "./task-retention-B_-KmPzc.js";
import crypto from "node:crypto";
//#region src/tasks/task-flow-registry.types.ts
const TASK_FLOW_SYNC_MODES = /* @__PURE__ */ new Set(["task_mirrored", "managed"]);
const TASK_FLOW_STATUSES = /* @__PURE__ */ new Set([
	"queued",
	"running",
	"waiting",
	"blocked",
	"succeeded",
	"failed",
	"cancelled",
	"lost"
]);
function parsePersistedFlowValue(value, values, label) {
	if (typeof value === "string" && values.has(value)) return value;
	throw new Error(`Invalid persisted task flow ${label}: ${JSON.stringify(value)}`);
}
function parseOptionalTaskFlowSyncMode(value) {
	if (value == null || value === "") return;
	return parsePersistedFlowValue(value, TASK_FLOW_SYNC_MODES, "sync mode");
}
function parseTaskFlowStatus(value) {
	return parsePersistedFlowValue(value, TASK_FLOW_STATUSES, "status");
}
//#endregion
//#region src/tasks/task-flow-registry.store.sqlite.ts
let cachedDatabase = null;
function serializeJson(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function rowToSyncMode(row) {
	const syncMode = parseOptionalTaskFlowSyncMode(row.sync_mode);
	if (syncMode) return syncMode;
	return row.shape === "single_task" ? "task_mirrored" : "managed";
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
function saveTaskFlowRegistryStateToSqlite(snapshot) {
	withWriteTransaction(({ db }) => {
		const kysely = getFlowRegistryKysely(db);
		const flowIds = [...snapshot.flows.keys()];
		if (flowIds.length === 0) {
			executeSqliteQuerySync(db, kysely.deleteFrom("flow_runs"));
			return;
		}
		pruneFlowsNotInSnapshot({
			db,
			ids: flowIds
		});
		for (const flow of snapshot.flows.values()) upsertFlowRow(db, bindFlowRecord(flow));
	});
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
	withWriteTransaction(({ db }) => {
		upsertFlowRow(db, bindFlowRecord(flow));
	});
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
	withWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getFlowRegistryKysely(db).deleteFrom("flow_runs").where("flow_id", "=", flowId));
	});
}
function closeTaskFlowRegistryDatabase() {
	cachedDatabase = null;
	closeOpenClawStateDatabase();
}
//#endregion
//#region src/tasks/task-flow-registry.store.ts
const defaultFlowRegistryStore = {
	loadSnapshot: loadTaskFlowRegistryStateFromSqlite,
	saveSnapshot: saveTaskFlowRegistryStateToSqlite,
	upsertFlow: upsertTaskFlowRegistryRecordToSqlite,
	deleteFlow: deleteTaskFlowRegistryRecordFromSqlite,
	close: closeTaskFlowRegistryDatabase
};
let configuredFlowRegistryStore = defaultFlowRegistryStore;
let configuredFlowRegistryObservers = null;
function getTaskFlowRegistryStore() {
	return configuredFlowRegistryStore;
}
function getTaskFlowRegistryObservers() {
	return configuredFlowRegistryObservers;
}
function configureTaskFlowRegistryRuntime(params) {
	if (params.store) configuredFlowRegistryStore = params.store;
	if ("observers" in params) configuredFlowRegistryObservers = params.observers ?? null;
}
function resetTaskFlowRegistryRuntimeForTests() {
	configuredFlowRegistryStore.close?.();
	configuredFlowRegistryStore = defaultFlowRegistryStore;
	configuredFlowRegistryObservers = null;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskFlowRegistryStoreTestApi")] = { configureTaskFlowRegistryRuntime };
//#endregion
//#region src/tasks/task-flow-registry.ts
const log = createSubsystemLogger("tasks/task-flow-registry");
let flows = /* @__PURE__ */ new Map();
let taskFlowRegistryRestoreState = { status: "uninitialized" };
function cloneStructuredValue(value) {
	if (value === void 0) return;
	return structuredClone(value);
}
function cloneFlowRecord(record) {
	return {
		...record,
		...record.requesterOrigin ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) } : {},
		...record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {},
		...record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {}
	};
}
function normalizeRestoredFlowRecord(record) {
	const syncMode = record.syncMode === "task_mirrored" ? "task_mirrored" : "managed";
	const controllerId = syncMode === "managed" ? normalizeOptionalString(record.controllerId) ?? "core/legacy-restored" : void 0;
	return {
		...record,
		syncMode,
		ownerKey: assertFlowOwnerKey(record.ownerKey),
		...record.requesterOrigin ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) } : {},
		...controllerId ? { controllerId } : {},
		currentStep: normalizeOptionalString(record.currentStep),
		blockedTaskId: normalizeOptionalString(record.blockedTaskId),
		blockedSummary: normalizeOptionalString(record.blockedSummary),
		...record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {},
		...record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {},
		revision: Math.max(0, record.revision),
		cancelRequestedAt: record.cancelRequestedAt ?? void 0,
		endedAt: record.endedAt ?? void 0
	};
}
function snapshotFlowRecords(source) {
	return [...source.values()].map((record) => cloneFlowRecord(record));
}
function emitFlowRegistryObserverEvent(createEvent) {
	const observers = getTaskFlowRegistryObservers();
	if (!observers?.onEvent) return;
	try {
		observers.onEvent(createEvent());
	} catch {}
}
function ensureNotifyPolicy$1(notifyPolicy) {
	return notifyPolicy ?? "done_only";
}
function normalizeJsonBlob(value) {
	return value === void 0 ? void 0 : cloneStructuredValue(value);
}
function assertFlowOwnerKey(ownerKey) {
	const normalized = normalizeOptionalString(ownerKey);
	if (!normalized) throw new Error("Flow ownerKey is required.");
	return normalized;
}
function assertControllerId(controllerId) {
	const normalized = normalizeOptionalString(controllerId);
	if (!normalized) throw new Error("Managed flow controllerId is required.");
	return normalized;
}
function resolveFlowBlockedSummary(task) {
	if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return;
	return normalizeOptionalString(task.terminalSummary) ?? normalizeOptionalString(task.progressSummary);
}
function deriveTaskFlowStatusFromTask(task) {
	if (task.status === "queued") return "queued";
	if (task.status === "running") return "running";
	if (task.status === "succeeded") return task.terminalOutcome === "blocked" ? "blocked" : "succeeded";
	if (task.status === "cancelled") return "cancelled";
	if (task.status === "lost") return "lost";
	return "failed";
}
function isTerminalTaskFlowStatus(status) {
	return status === "succeeded" || status === "blocked" || status === "failed" || status === "cancelled" || status === "lost";
}
function resolveTaskMirroredFlowTiming(task, isTerminal) {
	if (!isTerminal) return { updatedAt: task.lastEventAt ?? task.createdAt };
	const endedAt = task.endedAt ?? task.lastEventAt ?? task.createdAt;
	return {
		updatedAt: endedAt,
		endedAt
	};
}
function restoreTaskFlowRegistryOnce() {
	switch (taskFlowRegistryRestoreState.status) {
		case "ready": return;
		case "failed": throw taskFlowRegistryRestoreState.error;
		case "restoring": throw new Error("Task-flow registry restore is already in progress.");
		case "uninitialized": break;
	}
	taskFlowRegistryRestoreState = { status: "restoring" };
	try {
		const restored = getTaskFlowRegistryStore().loadSnapshot();
		const restoredFlows = /* @__PURE__ */ new Map();
		for (const [flowId, flow] of restored.flows) restoredFlows.set(flowId, normalizeRestoredFlowRecord(flow));
		flows = restoredFlows;
		taskFlowRegistryRestoreState = { status: "ready" };
	} catch (error) {
		flows = /* @__PURE__ */ new Map();
		const message = formatErrorMessage(error);
		const restoreError = new Error(`Task-flow registry restore failed: ${message}`, { cause: error });
		taskFlowRegistryRestoreState = {
			status: "failed",
			error: restoreError,
			message
		};
		log.warn("Failed to restore task-flow registry", {
			error: message,
			consoleMessage: `Failed to restore task-flow registry: ${message}`
		});
		throw restoreError;
	}
	emitFlowRegistryObserverEvent(() => ({
		kind: "restored",
		flows: snapshotFlowRecords(flows)
	}));
}
function ensureTaskFlowRegistryReady() {
	restoreTaskFlowRegistryOnce();
}
function getTaskFlowRegistryRestoreFailure() {
	try {
		ensureTaskFlowRegistryReady();
		return null;
	} catch {
		return taskFlowRegistryRestoreState.status === "failed" ? taskFlowRegistryRestoreState.message : "Task-flow registry restore did not complete.";
	}
}
function reloadTaskFlowRegistryFromStore() {
	flows = /* @__PURE__ */ new Map();
	taskFlowRegistryRestoreState = { status: "uninitialized" };
	ensureTaskFlowRegistryReady();
}
function createFlowSnapshotWith(next, deletedFlowId) {
	const snapshot = new Map(snapshotFlowRecords(flows).map((flow) => [flow.flowId, flow]));
	if (deletedFlowId) snapshot.delete(deletedFlowId);
	if (next) snapshot.set(next.flowId, cloneFlowRecord(next));
	return snapshot;
}
function persistFlowRegistry() {
	try {
		getTaskFlowRegistryStore().saveSnapshot({ flows: createFlowSnapshotWith() });
		return true;
	} catch (error) {
		log.warn("Failed to persist task-flow registry snapshot", { error });
		return false;
	}
}
function persistFlowUpsert(flow) {
	const store = getTaskFlowRegistryStore();
	if (store.upsertFlow) {
		store.upsertFlow(cloneFlowRecord(flow));
		return;
	}
	store.saveSnapshot({ flows: createFlowSnapshotWith(flow) });
}
function tryPersistFlowUpsert(flow, operation) {
	try {
		persistFlowUpsert(flow);
		return true;
	} catch (error) {
		log.warn("Failed to persist task-flow registry upsert", {
			operation,
			flowId: flow.flowId,
			error
		});
		return false;
	}
}
function persistFlowDelete(flowId) {
	const store = getTaskFlowRegistryStore();
	if (store.deleteFlow) {
		store.deleteFlow(flowId);
		return;
	}
	store.saveSnapshot({ flows: createFlowSnapshotWith(void 0, flowId) });
}
function tryPersistFlowDelete(flowId) {
	try {
		persistFlowDelete(flowId);
		return true;
	} catch (error) {
		log.warn("Failed to persist task-flow registry delete", {
			flowId,
			error
		});
		return false;
	}
}
function buildFlowRecord(params) {
	const now = params.createdAt ?? Date.now();
	const syncMode = params.syncMode ?? "managed";
	const controllerId = syncMode === "managed" ? assertControllerId(params.controllerId) : void 0;
	return {
		flowId: crypto.randomUUID(),
		syncMode,
		ownerKey: assertFlowOwnerKey(params.ownerKey),
		...params.requesterOrigin ? { requesterOrigin: cloneStructuredValue(params.requesterOrigin) } : {},
		...controllerId ? { controllerId } : {},
		revision: Math.max(0, params.revision ?? 0),
		status: params.status ?? "queued",
		notifyPolicy: ensureNotifyPolicy$1(params.notifyPolicy),
		goal: params.goal,
		currentStep: normalizeOptionalString(params.currentStep),
		blockedTaskId: normalizeOptionalString(params.blockedTaskId),
		blockedSummary: normalizeOptionalString(params.blockedSummary),
		...normalizeJsonBlob(params.stateJson) !== void 0 ? { stateJson: normalizeJsonBlob(params.stateJson) } : {},
		...normalizeJsonBlob(params.waitJson) !== void 0 ? { waitJson: normalizeJsonBlob(params.waitJson) } : {},
		...params.cancelRequestedAt != null ? { cancelRequestedAt: params.cancelRequestedAt } : {},
		createdAt: now,
		updatedAt: params.updatedAt ?? now,
		...params.endedAt != null ? { endedAt: params.endedAt } : {}
	};
}
function applyFlowPatch(current, patch) {
	const controllerId = patch.controllerId === void 0 ? current.controllerId : normalizeOptionalString(patch.controllerId);
	if (current.syncMode === "managed") assertControllerId(controllerId);
	return {
		...current,
		...patch.status ? { status: patch.status } : {},
		...patch.notifyPolicy ? { notifyPolicy: patch.notifyPolicy } : {},
		...patch.goal ? { goal: patch.goal } : {},
		controllerId,
		currentStep: patch.currentStep === void 0 ? current.currentStep : normalizeOptionalString(patch.currentStep),
		blockedTaskId: patch.blockedTaskId === void 0 ? current.blockedTaskId : normalizeOptionalString(patch.blockedTaskId),
		blockedSummary: patch.blockedSummary === void 0 ? current.blockedSummary : normalizeOptionalString(patch.blockedSummary),
		stateJson: patch.stateJson === void 0 ? current.stateJson : normalizeJsonBlob(patch.stateJson),
		waitJson: patch.waitJson === void 0 ? current.waitJson : normalizeJsonBlob(patch.waitJson),
		cancelRequestedAt: patch.cancelRequestedAt === void 0 ? current.cancelRequestedAt : patch.cancelRequestedAt ?? void 0,
		revision: current.revision + 1,
		updatedAt: patch.updatedAt ?? Date.now(),
		endedAt: patch.endedAt === void 0 ? current.endedAt : patch.endedAt ?? void 0
	};
}
function writeFlowRecord(next, previous) {
	if (!tryPersistFlowUpsert(next, previous ? "update" : "create")) return null;
	flows.set(next.flowId, next);
	emitFlowRegistryObserverEvent(() => ({
		kind: "upserted",
		flow: cloneFlowRecord(next),
		...previous ? { previous: cloneFlowRecord(previous) } : {}
	}));
	return cloneFlowRecord(next);
}
function createFlowRecord(params) {
	ensureTaskFlowRegistryReady();
	return writeFlowRecord(buildFlowRecord(params));
}
function createManagedTaskFlow(params) {
	return createFlowRecord({
		...params,
		syncMode: "managed",
		controllerId: assertControllerId(params.controllerId)
	});
}
function createTaskFlowForTask(params) {
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(params.task);
	const timing = resolveTaskMirroredFlowTiming(params.task, isTerminalTaskFlowStatus(terminalFlowStatus));
	return createFlowRecord({
		syncMode: "task_mirrored",
		ownerKey: params.task.ownerKey,
		requesterOrigin: params.requesterOrigin,
		status: terminalFlowStatus,
		notifyPolicy: params.task.notifyPolicy,
		goal: normalizeOptionalString(params.task.label) ?? (params.task.task.trim() || "Background task"),
		blockedTaskId: terminalFlowStatus === "blocked" ? normalizeOptionalString(params.task.taskId) : void 0,
		blockedSummary: resolveFlowBlockedSummary(params.task),
		createdAt: params.task.createdAt,
		updatedAt: timing.updatedAt,
		...timing.endedAt !== void 0 ? { endedAt: timing.endedAt } : {}
	});
}
function updateFlowRecordByIdUnchecked(flowId, patch) {
	ensureTaskFlowRegistryReady();
	const current = flows.get(flowId);
	if (!current) return null;
	return writeFlowRecord(applyFlowPatch(current, patch), current);
}
function updateFlowRecordByIdExpectedRevision(params) {
	ensureTaskFlowRegistryReady();
	const current = flows.get(params.flowId);
	if (!current) return {
		applied: false,
		reason: "not_found"
	};
	if (current.revision !== params.expectedRevision) return {
		applied: false,
		reason: "revision_conflict",
		current: cloneFlowRecord(current)
	};
	const flow = writeFlowRecord(applyFlowPatch(current, params.patch), current);
	if (!flow) return {
		applied: false,
		reason: "persist_failed",
		current: cloneFlowRecord(current)
	};
	return {
		applied: true,
		flow
	};
}
function setFlowWaiting(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: normalizeOptionalString(params.blockedTaskId) || normalizeOptionalString(params.blockedSummary) ? "blocked" : "waiting",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: params.waitJson,
			blockedTaskId: params.blockedTaskId,
			blockedSummary: params.blockedSummary,
			endedAt: null,
			updatedAt: params.updatedAt
		}
	});
}
function resumeFlow(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: params.status ?? "queued",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: null,
			blockedSummary: null,
			endedAt: null,
			updatedAt: params.updatedAt
		}
	});
}
function finishFlow(params) {
	const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: "succeeded",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: null,
			blockedSummary: null,
			endedAt,
			updatedAt: params.updatedAt ?? endedAt
		}
	});
}
function failFlow(params) {
	const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: "failed",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: params.blockedTaskId,
			blockedSummary: params.blockedSummary,
			endedAt,
			updatedAt: params.updatedAt ?? endedAt
		}
	});
}
function requestFlowCancel(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			cancelRequestedAt: params.cancelRequestedAt ?? params.updatedAt ?? Date.now(),
			updatedAt: params.updatedAt
		}
	});
}
function syncFlowFromTaskResult(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return {
		ok: true,
		flow: null
	};
	const flow = getTaskFlowById(flowId);
	if (!flow) return {
		ok: true,
		flow: null
	};
	if (flow.syncMode !== "task_mirrored") return {
		ok: true,
		flow
	};
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(task);
	const isTerminal = isTerminalTaskFlowStatus(terminalFlowStatus);
	const timing = resolveTaskMirroredFlowTiming({
		createdAt: flow.createdAt,
		lastEventAt: task.lastEventAt,
		endedAt: task.endedAt
	}, isTerminal);
	const updated = updateFlowRecordByIdUnchecked(flowId, {
		status: terminalFlowStatus,
		notifyPolicy: task.notifyPolicy,
		goal: normalizeOptionalString(task.label) ?? (task.task.trim() || "Background task"),
		blockedTaskId: terminalFlowStatus === "blocked" ? task.taskId.trim() || null : null,
		blockedSummary: terminalFlowStatus === "blocked" ? resolveFlowBlockedSummary(task) ?? null : null,
		waitJson: null,
		updatedAt: timing.updatedAt,
		...isTerminal ? { endedAt: timing.endedAt ?? timing.updatedAt } : { endedAt: null }
	});
	if (!updated) return {
		ok: false,
		reason: "persist_failed",
		current: flow
	};
	return {
		ok: true,
		flow: updated
	};
}
function getTaskFlowById(flowId) {
	ensureTaskFlowRegistryReady();
	const flow = flows.get(flowId);
	return flow ? cloneFlowRecord(flow) : void 0;
}
function listTaskFlowsForOwnerKey(ownerKey) {
	ensureTaskFlowRegistryReady();
	const normalizedOwnerKey = ownerKey.trim();
	if (!normalizedOwnerKey) return [];
	return [...flows.values()].filter((flow) => flow.ownerKey.trim() === normalizedOwnerKey).map((flow) => cloneFlowRecord(flow)).toSorted((left, right) => right.createdAt - left.createdAt);
}
function findLatestTaskFlowForOwnerKey(ownerKey) {
	const flow = listTaskFlowsForOwnerKey(ownerKey)[0];
	return flow ? cloneFlowRecord(flow) : void 0;
}
function resolveTaskFlowForLookupToken(token) {
	const lookup = token.trim();
	if (!lookup) return;
	return getTaskFlowById(lookup) ?? findLatestTaskFlowForOwnerKey(lookup);
}
function listTaskFlowRecords() {
	ensureTaskFlowRegistryReady();
	return [...flows.values()].map((flow) => cloneFlowRecord(flow)).toSorted((left, right) => right.createdAt - left.createdAt);
}
function deleteTaskFlowRecordById(flowId) {
	ensureTaskFlowRegistryReady();
	const current = flows.get(flowId);
	if (!current) return false;
	if (!tryPersistFlowDelete(flowId)) return false;
	flows.delete(flowId);
	emitFlowRegistryObserverEvent(() => ({
		kind: "deleted",
		flowId,
		previous: cloneFlowRecord(current)
	}));
	return true;
}
function resetTaskFlowRegistryForTests(opts) {
	flows = /* @__PURE__ */ new Map();
	taskFlowRegistryRestoreState = { status: "uninitialized" };
	resetTaskFlowRegistryRuntimeForTests();
	if (opts?.persist !== false) persistFlowRegistry();
	getTaskFlowRegistryStore().close?.();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskFlowRegistryTestApi")] = {
	createFlowRecord,
	resetTaskFlowRegistryForTests
};
//#endregion
//#region src/tasks/task-registry-common.ts
var ParentFlowLinkError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "ParentFlowLinkError";
	}
};
function isParentFlowLinkError(error) {
	return error instanceof ParentFlowLinkError;
}
function isActiveTaskStatus(status) {
	return status === "queued" || status === "running";
}
function isTerminalFlowStatus(status) {
	return status === "succeeded" || status === "failed" || status === "cancelled" || status === "lost";
}
function assertTaskOwner(params) {
	if (!params.ownerKey.trim() && params.scopeKind !== "system") throw new Error("Task ownerKey is required.");
}
function assertParentFlowLinkAllowed(params) {
	const flowId = params.parentFlowId?.trim();
	if (!flowId) return;
	if (params.scopeKind !== "session") throw new ParentFlowLinkError("scope_kind_not_session", "Only session-scoped tasks can link to flows.", { flowId });
	const flow = getTaskFlowById(flowId);
	if (!flow) throw new ParentFlowLinkError("parent_flow_not_found", `Parent flow not found: ${flowId}`, { flowId });
	if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(params.ownerKey)) throw new ParentFlowLinkError("owner_key_mismatch", "Task ownerKey must match parent flow ownerKey.", { flowId });
	if (flow.cancelRequestedAt != null) throw new ParentFlowLinkError("cancel_requested", "Parent flow cancellation has already been requested.", {
		flowId,
		status: flow.status
	});
	if (isTerminalFlowStatus(flow.status)) throw new ParentFlowLinkError("terminal", `Parent flow is already ${flow.status}.`, {
		flowId,
		status: flow.status
	});
}
function ensureLinkedTaskFlowRegistryReady(task) {
	if (task.parentFlowId?.trim()) ensureTaskFlowRegistryReady();
}
function ensureDeliveryStatus(params) {
	if (params.scopeKind === "system") return "not_applicable";
	return params.ownerKey.trim() ? "pending" : "parent_missing";
}
function ensureNotifyPolicy(params) {
	if (params.notifyPolicy) return params.notifyPolicy;
	return (params.deliveryStatus ?? ensureDeliveryStatus({
		ownerKey: params.ownerKey,
		scopeKind: params.scopeKind
	})) === "not_applicable" ? "silent" : "done_only";
}
function resolveTaskScopeKind(params) {
	if (params.scopeKind) return params.scopeKind;
	return params.requesterSessionKey.trim() ? "session" : "system";
}
function resolveTaskRequesterSessionKey(params) {
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (requesterSessionKey) return requesterSessionKey;
	if (params.scopeKind === "system") return "";
	return params.ownerKey?.trim() ?? "";
}
function resolveTaskOwnerKey(params) {
	return params.ownerKey?.trim() || params.requesterSessionKey.trim();
}
function normalizeTaskSummary(value) {
	return value?.replace(/\s+/g, " ").trim() || void 0;
}
function normalizeTaskStatus(value) {
	return value === "running" || value === "queued" || value === "succeeded" || value === "failed" || value === "timed_out" || value === "cancelled" || value === "lost" ? value : "queued";
}
function normalizeTaskTerminalOutcome(value) {
	return value === "succeeded" || value === "blocked" ? value : void 0;
}
function shouldApplyRunScopedStatusUpdate(params) {
	if (params.currentRuntime === "subagent" && params.nextStatus === "cancelled" && params.nextError === "Subagent run killed." && isTerminalTaskStatus(params.currentStatus) && !(params.currentStatus === "cancelled" && params.currentError === "Subagent run killed.")) return false;
	if (params.currentStatus === params.nextStatus) return true;
	if (!isTerminalTaskStatus(params.currentStatus)) return true;
	if (!isTerminalTaskStatus(params.nextStatus)) return false;
	if (params.currentStatus === "cancelled" && (params.nextStatus === "succeeded" || params.nextStatus === "failed" || params.nextStatus === "timed_out")) return params.currentRuntime === "subagent" && params.currentEndedAt !== void 0 && params.nextEndedAt !== void 0 && params.nextEndedAt < params.currentEndedAt || params.currentRuntime === "subagent" && Boolean(params.currentChildSessionKey?.trim()) && params.currentError === "Subagent run killed.";
	return params.currentStatus === "succeeded" && params.nextStatus !== "lost";
}
function resolveTaskTerminalOutcome(params) {
	const normalized = normalizeTaskTerminalOutcome(params.terminalOutcome);
	if (normalized) return normalized;
	return params.status === "succeeded" ? "succeeded" : void 0;
}
const TASK_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "succeeded",
	timeout: "timed_out",
	cancellation: "cancelled",
	failure: "failed"
};
function mapAgentRunTerminalOutcomeToTaskStatus(outcome) {
	return TASK_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(outcome)];
}
function resolveTaskLifecycleTerminalError(params) {
	return params.runtime === "subagent" && params.status === "cancelled" && params.terminalReason !== "superseded" ? SUBAGENT_KILL_TASK_ERROR : params.error;
}
function appendTaskEvent(event) {
	const summary = normalizeTaskSummary(event.summary);
	return {
		at: event.at,
		kind: event.kind,
		...summary ? { summary } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/completion-delivery-policy.ts
function resolveCompletionChatType(params) {
	const explicit = normalizeChatType(params.requesterEntry?.chatType ?? sessionDeliveryOrigin(params.requesterEntry)?.chatType);
	if (explicit) return explicit;
	for (const key of [params.targetRequesterSessionKey, params.requesterSessionKey]) {
		const derived = deriveSessionChatTypeFromKey(key);
		if (derived !== "unknown") return derived;
	}
	return inferCompletionChatTypeFromTarget(params.directOrigin?.to ?? params.requesterSessionOrigin?.to);
}
function completionRequiresMessageToolDelivery(params) {
	return resolveSourceReplyDeliveryMode({
		cfg: params.cfg,
		ctx: { ChatType: resolveCompletionChatType(params) },
		messageToolAvailable: params.messageToolAvailable
	}) === "message_tool_only";
}
/** Resolve transport authority for a durable, fixed-route agent completion. */
function resolveDurableCompletionDeliveryMode(sourceReplyDeliveryMode) {
	return sourceReplyDeliveryMode === "message_tool_only" ? "host_owned" : "automatic";
}
function shouldRouteCompletionThroughRequesterSession(sessionKey) {
	const chatType = deriveSessionChatTypeFromKey(sessionKey);
	return chatType === "group" || chatType === "channel";
}
function inferCompletionChatTypeFromTarget(to) {
	const normalized = to?.trim().toLowerCase();
	if (!normalized) return "unknown";
	if (normalized.startsWith("group:")) return "group";
	if (normalized.startsWith("channel:") || normalized.startsWith("thread:")) return "channel";
	if (normalized.startsWith("dm:") || normalized.startsWith("direct:") || normalized.startsWith("user:")) return "direct";
	return "unknown";
}
//#endregion
//#region src/tasks/task-cancellation-state.ts
function isProvisionalSubagentKillTask(task) {
	return task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.";
}
function isTaskFlowCancellationPending(task) {
	return task.status === "queued" || task.status === "running" || isProvisionalSubagentKillTask(task);
}
//#endregion
//#region src/tasks/task-registry-query.ts
function listTaskRecordsUnsorted() {
	ensureTaskRegistryReady();
	return snapshotTaskRecords(tasks);
}
function taskMatchesRelatedSession(task, sessionKey, sessionAgentId, cfg) {
	if (!sessionKey) return true;
	return [
		{
			key: task.requesterSessionKey,
			agentId: task.requesterAgentId
		},
		{
			key: task.childSessionKey,
			agentId: task.agentId
		},
		{
			key: task.ownerKey,
			agentId: task.requesterAgentId
		}
	].some((candidate) => {
		if (normalizeOptionalString(candidate.key) !== sessionKey) return false;
		if (!sessionAgentId) return true;
		let candidateAgentId = normalizeOptionalString(candidate.agentId) ?? parseAgentSessionKey(candidate.key)?.agentId;
		if (!candidateAgentId && cfg && candidate.key) try {
			candidateAgentId = resolveSessionAgentId({
				config: cfg,
				sessionKey: candidate.key
			});
		} catch {
			return false;
		}
		return candidateAgentId === sessionAgentId;
	});
}
function taskMatchesAgent(task, agentId, cfg) {
	if (!agentId) return true;
	const explicitAgentId = normalizeOptionalString(task.agentId);
	if (explicitAgentId) return explicitAgentId === agentId;
	const requesterAgentId = normalizeOptionalString(task.requesterAgentId);
	if (requesterAgentId) return requesterAgentId === agentId;
	return [
		task.requesterSessionKey,
		task.childSessionKey,
		task.ownerKey
	].some((candidate) => {
		const parsedAgentId = parseAgentSessionKey(candidate)?.agentId;
		if (parsedAgentId) return parsedAgentId === agentId;
		if (!candidate || !cfg) return false;
		try {
			return resolveSessionAgentId({
				config: cfg,
				sessionKey: candidate
			}) === agentId;
		} catch {
			return false;
		}
	});
}
function taskUpdatedAt(task) {
	return task.lastEventAt ?? task.endedAt ?? task.startedAt ?? task.createdAt;
}
function listTaskRecordPage(params) {
	ensureTaskRegistryReady();
	const statuses = params.statuses ? new Set(params.statuses) : null;
	const agentId = normalizeOptionalString(params.agentId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const matching = [...tasks.values()].filter((task) => (!statuses || statuses.has(task.status)) && taskMatchesAgent(task, agentId, params.cfg) && taskMatchesRelatedSession(task, sessionKey, params.sessionAgentId, params.cfg)).toSorted((left, right) => {
		const updatedDiff = taskUpdatedAt(right) - taskUpdatedAt(left);
		if (updatedDiff !== 0) return updatedDiff;
		return left.taskId < right.taskId ? -1 : left.taskId > right.taskId ? 1 : 0;
	});
	const selected = matching.slice(params.offset, params.offset + params.limit);
	return {
		tasks: selected.map((task) => cloneTaskRecord(task)),
		hasMore: params.offset + selected.length < matching.length
	};
}
function listTaskRecords() {
	ensureTaskRegistryReady();
	return [...tasks.values()].map((task, insertionIndex) => Object.assign({}, cloneTaskRecord(task), { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
}
function hasActiveTaskForChildSessionKey(params) {
	ensureTaskRegistryReady();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	const ids = taskIdsByRelatedSessionKey.get(sessionKey);
	if (!ids) return false;
	for (const taskId of ids) {
		if (taskId === params.excludeTaskId) continue;
		const task = tasks.get(taskId);
		if (task && isActiveTaskStatus(task.status) && normalizeOptionalString(task.childSessionKey) === sessionKey) return true;
	}
	return false;
}
function getTaskById(taskId) {
	ensureTaskRegistryReady();
	const task = tasks.get(taskId.trim());
	return task ? cloneTaskRecord(task) : void 0;
}
function findTaskByRunId(runId) {
	ensureTaskRegistryReady();
	const task = pickPreferredRunIdTask(getTasksByRunId(runId));
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksFromIndex(index, key) {
	const ids = index.get(key);
	if (!ids || ids.size === 0) return [];
	return [...ids].map((taskId, insertionIndex) => {
		const task = tasks.get(taskId);
		return task ? Object.assign({}, cloneTaskRecord(task), { insertionIndex }) : null;
	}).filter((task) => Boolean(task)).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
}
function listTasksForSessionKey(sessionKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function listTasksForAgentId(agentId) {
	ensureTaskRegistryReady();
	const lookup = agentId.trim();
	if (!lookup) return [];
	return snapshotTaskRecords(tasks).filter((task) => task.agentId?.trim() === lookup).toSorted(compareTasksNewestFirst);
}
function findLatestTaskForFlowId(flowId) {
	const task = listTasksForFlowId(flowId)[0];
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForOwnerKey(ownerKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listFreshTasksForOwnerKey(ownerKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	const store = getTaskRegistryStore();
	if (store.listTasksForOwnerKey) try {
		const merged = /* @__PURE__ */ new Map();
		for (const task of store.listTasksForOwnerKey(key)) merged.set(task.taskId, cloneTaskRecord(normalizeTaskTimestamps(task)));
		return [...merged.values()].map((task, insertionIndex) => Object.assign({}, task, { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
	} catch (error) {
		taskRegistryLog.warn("Failed to read fresh owner task registry records", {
			ownerKey: key,
			error
		});
	}
	return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listTasksForFlowId(flowId) {
	ensureTaskRegistryReady();
	const key = flowId.trim();
	if (!key) return [];
	return listTasksFromIndex(taskIdsByParentFlowId, key);
}
function findLatestTaskForRelatedSessionKey(sessionKey) {
	const task = listTasksForRelatedSessionKey(sessionKey)[0];
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForRelatedSessionKey(sessionKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function resolveTaskForLookupToken(token) {
	const lookup = token.trim();
	if (!lookup) return;
	return getTaskById(lookup) ?? findTaskByRunId(lookup) ?? findLatestTaskForRelatedSessionKey(lookup);
}
function deleteTaskRecordById(taskId) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current) return false;
	ensureLinkedTaskFlowRegistryReady(current);
	if (!tryPersistTaskDelete(taskId)) return false;
	deleteOwnerKeyIndex(taskId, current);
	deleteParentFlowIdIndex(taskId, current);
	deleteRelatedSessionKeyIndex(taskId, current);
	clearTaskActivity(taskId);
	tasks.delete(taskId);
	taskDeliveryStates.delete(taskId);
	rebuildRunIdIndex();
	emitTaskRegistryObserverEvent(() => ({
		kind: "deleted",
		taskId: current.taskId,
		previous: cloneTaskRecord(current)
	}));
	return true;
}
function resetTaskRegistryForTests(opts) {
	clearTaskRegistryMemory();
	resetTaskRegistryRestoreState();
	resetTaskRegistryRuntimeForTests();
	resetTaskRegistryListenerState();
	deliveryRuntimeLoader.clear();
	controlRuntimeLoader.clear();
	if (opts?.persist !== false) persistTaskRegistry();
	getTaskRegistryStore().close?.();
}
function resetTaskRegistryDeliveryRuntimeForTests() {
	globalThis[TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY] = null;
	deliveryRuntimeLoader.clear();
}
function setTaskRegistryDeliveryRuntimeForTests(runtime) {
	globalThis[TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY] = runtime;
	deliveryRuntimeLoader.clear();
}
function resetTaskRegistryControlRuntimeForTests() {
	globalThis[TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY] = null;
	controlRuntimeLoader.clear();
}
function setTaskRegistryControlRuntimeForTests(runtime) {
	globalThis[TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY] = runtime;
	controlRuntimeLoader.clear();
}
//#endregion
//#region src/tasks/task-registry-mutation.ts
function syncManagedFlowCancellationFromTask(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return;
	let flow = getTaskFlowById(flowId);
	if (!flow || flow.syncMode !== "managed" || flow.cancelRequestedAt == null || isTerminalFlowStatus(flow.status)) return;
	if (listTasksForFlowId(flowId).some(isTaskFlowCancellationPending)) return;
	const endedAt = task.endedAt ?? task.lastEventAt ?? Date.now();
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const result = updateFlowRecordByIdExpectedRevision({
			flowId,
			expectedRevision: flow.revision,
			patch: {
				status: "cancelled",
				blockedTaskId: null,
				blockedSummary: null,
				waitJson: null,
				endedAt,
				updatedAt: endedAt
			}
		});
		if (result.applied || result.reason === "not_found") return;
		flow = result.current;
		if (!flow || flow.syncMode !== "managed" || flow.cancelRequestedAt == null || isTerminalFlowStatus(flow.status)) return;
		if (listTasksForFlowId(flowId).some(isTaskFlowCancellationPending)) return;
	}
}
function scheduleTaskFlowSyncRetry(task, operation, attempt = 0) {
	const taskId = task.taskId.trim();
	if (!taskId || taskFlowSyncRetryTimers.has(taskId)) return;
	const delayMs = TASK_FLOW_SYNC_RETRY_DELAYS_MS[attempt];
	if (delayMs == null) {
		taskRegistryLog.warn("Exhausted parent flow sync retries from task", {
			operation,
			taskId,
			flowId: task.parentFlowId
		});
		return;
	}
	const retryTimer = setTimeout(() => {
		taskFlowSyncRetryTimers.delete(taskId);
		runWithGatewayIndependentRootWorkAdmission(async () => {
			const current = tasks.get(taskId);
			if (!current) return;
			const flowId = current.parentFlowId?.trim();
			if (!flowId || findLatestTaskForFlowId(flowId)?.taskId !== taskId) return;
			const result = syncFlowFromTaskResult(current);
			if (!result.ok) {
				taskRegistryLog.warn("Failed to retry parent flow sync from task", {
					operation,
					taskId,
					flowId: current.parentFlowId,
					reason: result.reason
				});
				scheduleTaskFlowSyncRetry(current, operation, attempt + 1);
			}
		}).catch((error) => {
			taskRegistryLog.warn("Failed to admit parent flow sync retry from task", {
				operation,
				taskId,
				flowId: task.parentFlowId,
				error
			});
		});
	}, delayMs);
	retryTimer.unref?.();
	taskFlowSyncRetryTimers.set(taskId, retryTimer);
}
function syncFlowFromTaskAfterTaskMutation(task, operation) {
	const result = syncFlowFromTaskResult(task);
	if (result.ok) return;
	taskRegistryLog.warn("Failed to sync parent flow from task mutation", {
		operation,
		taskId: task.taskId,
		flowId: task.parentFlowId,
		reason: result.reason
	});
	scheduleTaskFlowSyncRetry(task, operation);
}
function updateTask(taskId, patch) {
	const current = tasks.get(taskId);
	if (!current) return null;
	const next = normalizeTaskTimestamps({
		...current,
		...patch,
		...patch.detail !== void 0 ? { detail: structuredClone(patch.detail) } : {}
	});
	if (Object.hasOwn(patch, "error") && patch.error === void 0) delete next.error;
	if (Object.hasOwn(patch, "childSessionKey") && patch.childSessionKey === void 0) delete next.childSessionKey;
	if (isTerminalTaskStatus(next.status) && typeof next.cleanupAfter !== "number") {
		const createdAt = next.createdAt ?? Date.now();
		const cleanupAfter = resolveTaskCleanupAfter({
			...next,
			createdAt
		});
		Object.assign(next, cleanupAfter === void 0 ? {} : { cleanupAfter });
	}
	const sessionIndexChanged = normalizeOptionalString(current.ownerKey) !== normalizeOptionalString(next.ownerKey) || normalizeOptionalString(current.childSessionKey) !== normalizeOptionalString(next.childSessionKey);
	const parentFlowIndexChanged = current.parentFlowId?.trim() !== next.parentFlowId?.trim();
	ensureLinkedTaskFlowRegistryReady(current);
	ensureLinkedTaskFlowRegistryReady(next);
	const becomesTerminal = !isTerminalTaskStatus(current.status) && isTerminalTaskStatus(next.status);
	if (becomesTerminal) flushTaskActivity(taskId);
	if (!tryPersistTaskUpsert(next, "update")) return null;
	tasks.set(taskId, next);
	if (becomesTerminal) clearTaskActivity(taskId);
	if (patch.runId && patch.runId !== current.runId) rebuildRunIdIndex();
	if (sessionIndexChanged) {
		deleteOwnerKeyIndex(taskId, current);
		addOwnerKeyIndex(taskId, next);
		deleteRelatedSessionKeyIndex(taskId, current);
		addRelatedSessionKeyIndex(taskId, next);
	}
	if (parentFlowIndexChanged) {
		deleteParentFlowIdIndex(taskId, current);
		addParentFlowIdIndex(taskId, next);
	}
	syncFlowFromTaskAfterTaskMutation(next, "update");
	try {
		syncManagedFlowCancellationFromTask(next);
	} catch (error) {
		taskRegistryLog.warn("Failed to finalize managed flow cancellation from task update", {
			taskId,
			flowId: next.parentFlowId,
			error
		});
	}
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecord(next),
		previous: cloneTaskRecord(current)
	}));
	return cloneTaskRecord(next);
}
/** Publishes a record already committed by a cross-owner shared-state transaction. */
function publishTaskRecordAfterAtomicStore(record) {
	const next = normalizeTaskTimestamps(cloneTaskRecord(record));
	const current = tasks.get(next.taskId);
	const becomesTerminal = current !== void 0 && !isTerminalTaskStatus(current.status) && isTerminalTaskStatus(next.status);
	if (becomesTerminal) flushTaskActivity(next.taskId);
	if (current) {
		deleteOwnerKeyIndex(next.taskId, current);
		deleteParentFlowIdIndex(next.taskId, current);
		deleteRelatedSessionKeyIndex(next.taskId, current);
	}
	tasks.set(next.taskId, next);
	if (becomesTerminal) clearTaskActivity(next.taskId);
	addOwnerKeyIndex(next.taskId, next);
	addParentFlowIdIndex(next.taskId, next);
	addRelatedSessionKeyIndex(next.taskId, next);
	rebuildRunIdIndex();
	syncFlowFromTaskAfterTaskMutation(next, "atomic completion admission");
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecord(next),
		...current ? { previous: cloneTaskRecord(current) } : {}
	}));
	return cloneTaskRecord(next);
}
function upsertTaskDeliveryState(state) {
	const current = taskDeliveryStates.get(state.taskId);
	const next = {
		taskId: state.taskId,
		...state.requesterOrigin ? { requesterOrigin: normalizeDeliveryContext(state.requesterOrigin) } : {},
		...state.lastNotifiedEventAt != null ? { lastNotifiedEventAt: state.lastNotifiedEventAt } : {}
	};
	if (!next.requesterOrigin && typeof next.lastNotifiedEventAt !== "number" && !current) return cloneTaskDeliveryState({ taskId: state.taskId });
	if (!tryPersistTaskDeliveryStateUpsert(next)) return current ? cloneTaskDeliveryState(current) : cloneTaskDeliveryState({ taskId: state.taskId });
	taskDeliveryStates.set(state.taskId, next);
	return cloneTaskDeliveryState(next);
}
function getTaskDeliveryState(taskId) {
	const state = taskDeliveryStates.get(taskId);
	return state ? cloneTaskDeliveryState(state) : void 0;
}
//#endregion
//#region src/tasks/task-registry-delivery.ts
function taskTerminalDeliveryIdempotencyKey(task) {
	const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
	return `task-terminal:${task.taskId}:${task.status}:${outcome}`;
}
function resolveTaskStateChangeIdempotencyKey(params) {
	if (params.owner.flowId) return `flow-event:${params.owner.flowId}:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
	return `task-event:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
}
function resolveTaskTerminalIdempotencyKey(task) {
	const owner = resolveTaskDeliveryOwner(task);
	if (owner.flowId) {
		const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
		return `flow-terminal:${owner.flowId}:${task.taskId}:${task.status}:${outcome}`;
	}
	return taskTerminalDeliveryIdempotencyKey(task);
}
function getLinkedFlowForDelivery(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId || task.scopeKind !== "session") return;
	const flow = getTaskFlowById(flowId);
	if (!flow) return;
	if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(task.ownerKey)) return;
	return flow;
}
function resolveTaskDeliveryOwner(task) {
	const flow = getLinkedFlowForDelivery(task);
	if (flow) return {
		sessionKey: flow.ownerKey.trim(),
		requesterOrigin: normalizeDeliveryContext(flow.requesterOrigin ?? taskDeliveryStates.get(task.taskId)?.requesterOrigin),
		flowId: flow.flowId
	};
	if (task.scopeKind !== "session") return {};
	return {
		sessionKey: task.ownerKey.trim(),
		requesterOrigin: normalizeDeliveryContext(taskDeliveryStates.get(task.taskId)?.requesterOrigin)
	};
}
function canDeliverTaskToRequesterOrigin(task) {
	const owner = resolveTaskDeliveryOwner(task);
	if (shouldRouteCompletionThroughRequesterSession(owner.sessionKey)) return false;
	return canDeliverToRequesterOrigin(owner.requesterOrigin);
}
function canDeliverToRequesterOrigin(origin) {
	const channel = origin?.channel?.trim();
	const to = origin?.to?.trim();
	return Boolean(channel && to && isDeliverableMessageChannel(channel));
}
function canDeliverParentReviewTaskToThreadOrigin(task) {
	if (!shouldUseParentReviewTaskTerminalMessage(task)) return false;
	const origin = resolveTaskDeliveryOwner(task).requesterOrigin;
	const threadId = String(origin?.threadId ?? "").trim();
	return Boolean(threadId && channelSupportsThreadDelivery(origin?.channel) && canDeliverToRequesterOrigin(origin));
}
function resolveMissingOwnerDeliveryStatus(task) {
	return task.scopeKind === "system" ? "not_applicable" : "parent_missing";
}
function queueTaskSystemEvent(task, text) {
	const owner = resolveTaskDeliveryOwner(task);
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	enqueueSystemEvent(text, {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}`,
		deliveryContext: owner.requesterOrigin
	});
	requestHeartbeat({
		source: "background-task",
		intent: "immediate",
		reason: "background-task",
		sessionKey: ownerKey
	});
	return true;
}
function queueBlockedTaskFollowup(task) {
	const followupText = formatTaskBlockedFollowupMessage(task);
	if (!followupText) return false;
	const owner = resolveTaskDeliveryOwner(task);
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	enqueueSystemEvent(followupText, {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}:blocked-followup`,
		deliveryContext: owner.requesterOrigin
	});
	requestHeartbeat({
		source: "background-task-blocked",
		intent: "immediate",
		reason: "background-task-blocked",
		sessionKey: ownerKey
	});
	return true;
}
async function maybeDeliverTaskTerminalUpdate(taskId) {
	return await runTaskDeliveryWithIndependentAdmission(taskId, async () => maybeDeliverTaskTerminalUpdateUnderAdmission(taskId));
}
async function runTaskDeliveryWithIndependentAdmission(taskId, deliver) {
	ensureTaskRegistryReady();
	let admitted = false;
	try {
		return await runWithGatewayIndependentRootWorkAdmission(async () => {
			admitted = true;
			return await deliver();
		});
	} catch (error) {
		if (!admitted && isGatewayRestartDraining()) {
			ensureTaskRegistryReady();
			const current = tasks.get(taskId);
			return current ? cloneTaskRecord(current) : null;
		}
		throw error;
	}
}
async function maybeDeliverTaskTerminalUpdateUnderAdmission(taskId) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current || !shouldAutoDeliverTaskTerminalUpdate(current)) return current ? cloneTaskRecord(current) : null;
	if (tasksWithPendingDelivery.has(taskId)) return cloneTaskRecord(current);
	tasksWithPendingDelivery.add(taskId);
	try {
		const latest = tasks.get(taskId);
		if (!latest || !shouldAutoDeliverTaskTerminalUpdate(latest)) return latest ? cloneTaskRecord(latest) : null;
		const peers = latest.runId ? getPeerTasksForDelivery(latest) : [];
		const isSubagentCancellation = latest.runtime === "subagent" && latest.status === "cancelled";
		const preferred = pickPreferredRunIdTask(isSubagentCancellation ? peers.filter((candidate) => shouldAutoDeliverTaskTerminalUpdate(candidate)) : peers);
		const peerDeliveryCovered = isSubagentCancellation && peers.some((candidate) => candidate.taskId !== latest.taskId && (candidate.deliveryStatus === "delivered" || candidate.deliveryStatus === "session_queued"));
		if (shouldSuppressDuplicateTerminalDelivery({
			task: latest,
			preferredTaskId: preferred?.taskId,
			peerDeliveryCovered
		})) return updateTask(taskId, {
			deliveryStatus: "not_applicable",
			lastEventAt: Date.now()
		});
		const owner = resolveTaskDeliveryOwner(latest);
		const ownerSessionKey = owner.sessionKey?.trim();
		if (!ownerSessionKey) return updateTask(taskId, {
			deliveryStatus: resolveMissingOwnerDeliveryStatus(latest),
			lastEventAt: Date.now()
		});
		const shouldRouteParentReview = shouldUseParentReviewTaskTerminalMessage(latest);
		const shouldDeliverParentReviewDirect = canDeliverParentReviewTaskToThreadOrigin(latest);
		const canDeliverDirect = canDeliverTaskToRequesterOrigin(latest) || shouldDeliverParentReviewDirect;
		const directEventText = formatTaskTerminalMessage(latest);
		const sessionEventText = formatTaskTerminalMessage(latest, shouldRouteParentReview ? { surface: "parent_session" } : void 0);
		if (shouldRouteParentReview && !shouldDeliverParentReviewDirect || !canDeliverDirect) try {
			queueTaskSystemEvent(latest, sessionEventText);
			if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest);
			return updateTask(taskId, {
				deliveryStatus: shouldRouteParentReview && canDeliverDirect ? "pending" : "session_queued",
				lastEventAt: Date.now()
			});
		} catch (error) {
			taskRegistryLog.warn("Failed to queue background task session delivery", {
				taskId,
				ownerKey: latest.ownerKey,
				error
			});
			return updateTask(taskId, {
				deliveryStatus: "failed",
				lastEventAt: Date.now()
			});
		}
		try {
			const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
			const beforeSend = tasks.get(taskId);
			if (!beforeSend || !shouldAutoDeliverTaskTerminalUpdate(beforeSend)) return beforeSend ? cloneTaskRecord(beforeSend) : null;
			const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
			const idempotencyKey = resolveTaskTerminalIdempotencyKey(latest);
			const sendResult = await sendMessage({
				channel: owner.requesterOrigin?.channel,
				to: owner.requesterOrigin?.to ?? "",
				accountId: owner.requesterOrigin?.accountId,
				threadId: owner.requesterOrigin?.threadId,
				content: shouldDeliverParentReviewDirect ? sessionEventText : directEventText,
				agentId: requesterAgentId,
				idempotencyKey,
				mirror: {
					sessionKey: ownerSessionKey,
					agentId: requesterAgentId,
					idempotencyKey
				}
			});
			const afterSend = tasks.get(taskId);
			if (!afterSend || !shouldAutoDeliverTaskTerminalUpdate(afterSend)) return afterSend ? cloneTaskRecord(afterSend) : null;
			if (sendResult.deliveryStatus === "suppressed") {
				if (sendResult.suppressionReason === "adapter_returned_no_identity") {
					taskRegistryLog.warn("Background task update delivery was not confirmed", {
						taskId,
						ownerKey: ownerSessionKey,
						requesterOrigin: owner.requesterOrigin,
						suppressionReason: sendResult.suppressionReason
					});
					return updateTask(taskId, {
						deliveryStatus: "failed",
						lastEventAt: Date.now()
					});
				}
				throw new Error(`background task update suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
			}
			if (afterSend.terminalOutcome === "blocked") queueBlockedTaskFollowup(afterSend);
			return updateTask(taskId, {
				deliveryStatus: "delivered",
				lastEventAt: Date.now()
			});
		} catch (error) {
			taskRegistryLog.warn("Failed to deliver background task update", {
				taskId,
				ownerKey: ownerSessionKey,
				requesterOrigin: owner.requesterOrigin,
				error
			});
			const beforeFallback = tasks.get(taskId);
			if (!beforeFallback || !shouldAutoDeliverTaskTerminalUpdate(beforeFallback)) return beforeFallback ? cloneTaskRecord(beforeFallback) : null;
			try {
				queueTaskSystemEvent(beforeFallback, sessionEventText);
				if (beforeFallback.terminalOutcome === "blocked") queueBlockedTaskFollowup(beforeFallback);
			} catch (fallbackError) {
				taskRegistryLog.warn("Failed to queue background task fallback event", {
					taskId,
					ownerKey: latest.ownerKey,
					error: fallbackError
				});
			}
			return updateTask(taskId, {
				deliveryStatus: "failed",
				lastEventAt: Date.now()
			});
		}
	} finally {
		tasksWithPendingDelivery.delete(taskId);
	}
}
async function maybeDeliverTaskStateChangeUpdate(taskId, latestEvent) {
	return await runTaskDeliveryWithIndependentAdmission(taskId, async () => maybeDeliverTaskStateChangeUpdateUnderAdmission(taskId, latestEvent));
}
async function maybeDeliverTaskStateChangeUpdateUnderAdmission(taskId, latestEvent) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current || !shouldAutoDeliverTaskStateChange(current)) return current ? cloneTaskRecord(current) : null;
	const deliveryState = getTaskDeliveryState(taskId);
	if (!latestEvent || (deliveryState?.lastNotifiedEventAt ?? 0) >= latestEvent.at) return cloneTaskRecord(current);
	const eventText = formatTaskStateChangeMessage(current, latestEvent);
	if (!eventText) return cloneTaskRecord(current);
	try {
		const owner = resolveTaskDeliveryOwner(current);
		const ownerSessionKey = owner.sessionKey?.trim();
		if (!ownerSessionKey) return updateTask(taskId, {
			deliveryStatus: resolveMissingOwnerDeliveryStatus(current),
			lastEventAt: Date.now()
		});
		if (!canDeliverTaskToRequesterOrigin(current)) {
			queueTaskSystemEvent(current, eventText);
			upsertTaskDeliveryState({
				taskId,
				requesterOrigin: deliveryState?.requesterOrigin,
				lastNotifiedEventAt: latestEvent.at
			});
			return updateTask(taskId, { lastEventAt: Date.now() });
		}
		const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
		const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
		const idempotencyKey = resolveTaskStateChangeIdempotencyKey({
			task: current,
			latestEvent,
			owner
		});
		const sendResult = await sendMessage({
			channel: owner.requesterOrigin?.channel,
			to: owner.requesterOrigin?.to ?? "",
			accountId: owner.requesterOrigin?.accountId,
			threadId: owner.requesterOrigin?.threadId,
			content: eventText,
			agentId: requesterAgentId,
			idempotencyKey,
			mirror: {
				sessionKey: ownerSessionKey,
				agentId: requesterAgentId,
				idempotencyKey
			}
		});
		if (sendResult.deliveryStatus === "suppressed") {
			if (sendResult.suppressionReason !== "adapter_returned_no_identity") throw new Error(`background task state change suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
			taskRegistryLog.warn("Background task state change delivery was not confirmed", {
				taskId,
				ownerKey: current.ownerKey,
				requesterOrigin: owner.requesterOrigin,
				suppressionReason: sendResult.suppressionReason
			});
		}
		upsertTaskDeliveryState({
			taskId,
			requesterOrigin: deliveryState?.requesterOrigin,
			lastNotifiedEventAt: latestEvent.at
		});
		return updateTask(taskId, { lastEventAt: Date.now() });
	} catch (error) {
		taskRegistryLog.warn("Failed to deliver background task state change", {
			taskId,
			ownerKey: current.ownerKey,
			error
		});
		return cloneTaskRecord(current);
	}
}
//#endregion
//#region src/tasks/task-registry-lifecycle.ts
const ACTIVITY_LIVENESS_WRITE_MS = 6e4;
function ensureListener() {
	if (!claimTaskRegistryListenerStart()) return;
	setTaskRegistryListenerStop(onAgentEvent((evt) => {
		restoreTaskRegistryOnce();
		const scopedTasks = getTasksByRunScope({
			runId: evt.runId,
			sessionKey: evt.sessionKey
		});
		if (scopedTasks.length === 0) return;
		const now = evt.ts || Date.now();
		for (const current of scopedTasks) {
			if (isTerminalTaskStatus(current.status)) continue;
			if (recordTaskActivityEvent(current, evt)) {
				if (now - (current.lastEventAt ?? current.startedAt ?? current.createdAt) >= ACTIVITY_LIVENESS_WRITE_MS) updateTask(current.taskId, { lastEventAt: now });
				continue;
			}
			const patch = { lastEventAt: now };
			if (evt.stream === "lifecycle") {
				const phase = typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
				const eventStartedAt = evt.data?.startedAt;
				const startedAt = typeof eventStartedAt === "number" && Number.isFinite(eventStartedAt) ? eventStartedAt : current.startedAt;
				const endedAt = typeof evt.data?.endedAt === "number" ? evt.data.endedAt : void 0;
				if (startedAt !== void 0) patch.startedAt = startedAt;
				if (phase === "start") patch.status = "running";
				else if (phase === "end") {
					const terminal = buildAgentRunTerminalOutcomeFromLifecycleEvent({
						phase,
						data: evt.data,
						startedAt,
						endedAt: endedAt ?? now
					});
					patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
					patch.endedAt = terminal.endedAt ?? now;
					const error = resolveTaskLifecycleTerminalError({
						runtime: current.runtime,
						status: patch.status,
						terminalReason: terminal.reason,
						error: terminal.error
					});
					if (error) patch.error = error;
				} else if (phase === "error") {
					const terminal = buildAgentRunTerminalOutcomeFromLifecycleEvent({
						phase,
						data: evt.data,
						startedAt,
						endedAt: endedAt ?? now
					});
					patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
					patch.endedAt = terminal.endedAt ?? now;
					patch.error = resolveTaskLifecycleTerminalError({
						runtime: current.runtime,
						status: patch.status,
						terminalReason: terminal.reason,
						error: terminal.error
					}) ?? current.error;
				}
			} else if (evt.stream === "error") patch.error = typeof evt.data?.error === "string" ? evt.data.error : current.error;
			else if (evt.stream === "tool" && evt.data?.phase === "start") {
				const toolName = typeof evt.data.name === "string" ? evt.data.name.trim() : "";
				if (toolName) {
					patch.toolUseCount = (current.toolUseCount ?? 0) + 1;
					patch.lastToolName = toolName;
				}
			}
			const stateChangeEvent = patch.status && patch.status !== current.status ? appendTaskEvent({
				at: now,
				kind: patch.status,
				summary: patch.status === "failed" ? patch.error ?? current.error : patch.status === "succeeded" ? current.terminalSummary : void 0
			}) : void 0;
			if (updateTask(current.taskId, patch)) {
				maybeDeliverTaskStateChangeUpdate(current.taskId, stateChangeEvent);
				maybeDeliverTaskTerminalUpdate(current.taskId);
			}
		}
	}));
}
setTaskRegistryListenerStarter(ensureListener);
//#endregion
//#region src/tasks/background-exec-task-contract.ts
const BACKGROUND_EXEC_TASK_KIND = "exec";
function isBackgroundExecTask(task) {
	return task.runtime === "cli" && task.taskKind === "exec";
}
//#endregion
//#region src/tasks/cron-task-contract.ts
/** Durable task kind stamped by the current cron task-ledger owner. */
const CRON_TASK_KIND = "automation_run";
//#endregion
//#region src/tasks/harness-owned-subagent-task.ts
function isHarnessOwnedSubagentTask(task) {
	return task.runtime === "subagent" && !task.childSessionKey?.trim() && Boolean(task.taskKind?.trim());
}
//#endregion
//#region src/tasks/task-registry-create-helpers.ts
function findExistingTaskForCreate(params) {
	const runId = params.runId?.trim();
	const runScopeMatches = runId ? getTasksByRunId(runId).filter((task) => {
		if (task.runtime !== params.runtime || task.scopeKind !== params.scopeKind || (normalizeOptionalString(task.ownerKey) ?? "") !== (normalizeOptionalString(params.ownerKey) ?? "") || (normalizeOptionalString(task.childSessionKey) ?? "") !== (normalizeOptionalString(params.childSessionKey) ?? "")) return false;
		if (params.runtime === "acp") return true;
		return (normalizeOptionalString(task.parentFlowId) ?? "") === (normalizeOptionalString(params.parentFlowId) ?? "");
	}) : [];
	const exact = runId ? runScopeMatches.find((task) => (normalizeOptionalString(task.label) ?? "") === (normalizeOptionalString(params.label) ?? "") && (normalizeOptionalString(task.task) ?? "") === (normalizeOptionalString(params.task) ?? "")) : void 0;
	if (exact) return exact;
	if (!runId || params.runtime !== "acp") return;
	if (runScopeMatches.length === 0) return;
	return pickPreferredRunIdTask(runScopeMatches);
}
function mergeExistingTaskForCreate(existing, params) {
	ensureLinkedTaskFlowRegistryReady(existing);
	const patch = {};
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const currentDeliveryState = taskDeliveryStates.get(existing.taskId);
	if (requesterOrigin && !currentDeliveryState?.requesterOrigin) {
		if (!upsertTaskDeliveryState({
			taskId: existing.taskId,
			requesterOrigin,
			lastNotifiedEventAt: currentDeliveryState?.lastNotifiedEventAt
		}).requesterOrigin) return null;
	}
	if (params.sourceId?.trim() && !existing.sourceId?.trim()) patch.sourceId = params.sourceId.trim();
	if (params.taskKind?.trim() && !existing.taskKind?.trim()) patch.taskKind = params.taskKind.trim();
	if (params.parentFlowId?.trim() && !existing.parentFlowId?.trim()) {
		assertParentFlowLinkAllowed({
			ownerKey: existing.ownerKey,
			scopeKind: existing.scopeKind,
			parentFlowId: params.parentFlowId
		});
		patch.parentFlowId = params.parentFlowId.trim();
	}
	if (params.parentTaskId?.trim() && !existing.parentTaskId?.trim()) patch.parentTaskId = params.parentTaskId.trim();
	if (params.agentId?.trim() && !existing.agentId?.trim()) patch.agentId = params.agentId.trim();
	if (params.requesterAgentId?.trim() && !existing.requesterAgentId?.trim()) patch.requesterAgentId = params.requesterAgentId.trim();
	const nextLabel = params.label?.trim();
	if (params.preferMetadata) {
		if (nextLabel && (normalizeOptionalString(existing.label) ?? "") !== nextLabel) patch.label = nextLabel;
		const nextTask = params.task.trim();
		if (nextTask && (normalizeOptionalString(existing.task) ?? "") !== nextTask) patch.task = nextTask;
	} else if (nextLabel && !existing.label?.trim()) patch.label = nextLabel;
	if (params.deliveryStatus === "pending" && existing.deliveryStatus !== "delivered") patch.deliveryStatus = "pending";
	const notifyPolicy = ensureNotifyPolicy({
		notifyPolicy: params.notifyPolicy,
		deliveryStatus: params.deliveryStatus,
		ownerKey: existing.ownerKey,
		scopeKind: existing.scopeKind
	});
	if (notifyPolicy !== existing.notifyPolicy && existing.notifyPolicy === "silent") patch.notifyPolicy = notifyPolicy;
	if (params.detail !== void 0) patch.detail = params.detail;
	if (Object.keys(patch).length === 0) return cloneTaskRecord(existing);
	return updateTask(existing.taskId, patch);
}
function resolveTaskAgentId(params) {
	return normalizeOptionalString(params.explicitAgentId) ?? parseAgentSessionKey(params.childSessionKey)?.agentId ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
function resolveTaskRequesterAgentId(params) {
	const explicitRequesterAgentId = normalizeOptionalString(params.explicitRequesterAgentId);
	return (explicitRequesterAgentId ? normalizeAgentId(explicitRequesterAgentId) : void 0) ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
//#endregion
//#region src/tasks/task-registry-record-api.ts
function setTaskCleanupAfterById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, { cleanupAfter: params.cleanupAfter });
}
function markTaskTerminalById(params) {
	ensureTaskRegistryReady();
	const patch = {
		status: params.status,
		...params.childSessionKey !== void 0 ? { childSessionKey: params.childSessionKey?.trim() || void 0 } : {},
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.terminalSummary !== void 0 ? { terminalSummary: params.preserveTerminalSummary ? params.terminalSummary ?? void 0 : normalizeTaskSummary(params.terminalSummary) } : {},
		...params.terminalOutcome !== void 0 ? { terminalOutcome: resolveTaskTerminalOutcome({
			status: params.status,
			terminalOutcome: params.terminalOutcome
		}) } : {},
		...params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}
	};
	if (Object.hasOwn(params, "error")) patch.error = params.error;
	return updateTask(params.taskId, patch);
}
function markTaskLostById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		status: "lost",
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.error !== void 0 ? { error: params.error } : {},
		...params.cleanupAfter !== void 0 ? { cleanupAfter: params.cleanupAfter } : {}
	});
}
function updateTasksByRunId(params) {
	const matches = getTasksByRunScope(params);
	if (matches.length === 0) return [];
	const updated = [];
	for (const match of matches) {
		const task = updateTask(match.taskId, params.patch);
		if (task) updated.push(task);
	}
	return updated;
}
function createTaskRecord(params) {
	ensureTaskRegistryReady();
	const requesterSessionKey = resolveTaskRequesterSessionKey(params);
	const scopeKind = resolveTaskScopeKind({
		scopeKind: params.scopeKind,
		requesterSessionKey
	});
	const ownerKey = resolveTaskOwnerKey({
		requesterSessionKey,
		ownerKey: params.ownerKey
	});
	const agentId = resolveTaskAgentId({
		explicitAgentId: params.agentId,
		childSessionKey: params.childSessionKey,
		ownerKey,
		requesterSessionKey
	});
	const requesterAgentId = resolveTaskRequesterAgentId({
		explicitRequesterAgentId: params.requesterAgentId,
		ownerKey,
		requesterSessionKey
	});
	assertTaskOwner({
		ownerKey,
		scopeKind
	});
	assertParentFlowLinkAllowed({
		ownerKey,
		scopeKind,
		parentFlowId: params.parentFlowId
	});
	const existing = findExistingTaskForCreate({
		runtime: params.runtime,
		ownerKey,
		scopeKind,
		childSessionKey: params.childSessionKey,
		parentFlowId: params.parentFlowId,
		runId: params.runId,
		label: params.label,
		task: params.task
	});
	if (existing) return mergeExistingTaskForCreate(existing, {
		...params,
		agentId
	});
	const now = Date.now();
	const taskId = crypto.randomUUID();
	const status = normalizeTaskStatus(params.status);
	const deliveryStatus = params.deliveryStatus ?? ensureDeliveryStatus({
		ownerKey,
		scopeKind
	});
	const notifyPolicy = ensureNotifyPolicy({
		notifyPolicy: params.notifyPolicy,
		deliveryStatus,
		ownerKey,
		scopeKind
	});
	const lastEventAt = params.lastEventAt ?? params.startedAt ?? now;
	const record = normalizeTaskTimestamps({
		taskId,
		runtime: params.runtime,
		taskKind: normalizeOptionalString(params.taskKind),
		sourceId: normalizeOptionalString(params.sourceId),
		requesterSessionKey,
		ownerKey,
		scopeKind,
		childSessionKey: params.childSessionKey,
		parentFlowId: normalizeOptionalString(params.parentFlowId),
		parentTaskId: normalizeOptionalString(params.parentTaskId),
		agentId,
		requesterAgentId,
		runId: normalizeOptionalString(params.runId),
		label: normalizeOptionalString(params.label),
		task: params.task,
		status,
		deliveryStatus,
		notifyPolicy,
		createdAt: now,
		startedAt: params.startedAt,
		lastEventAt,
		cleanupAfter: params.cleanupAfter,
		progressSummary: normalizeTaskSummary(params.progressSummary),
		terminalSummary: normalizeTaskSummary(params.terminalSummary),
		terminalOutcome: resolveTaskTerminalOutcome({
			status,
			terminalOutcome: params.terminalOutcome
		}),
		...params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}
	});
	if (isTerminalTaskStatus(record.status) && typeof record.cleanupAfter !== "number") {
		const cleanupAfter = resolveTaskCleanupAfter(record);
		Object.assign(record, cleanupAfter === void 0 ? {} : { cleanupAfter });
	}
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const deliveryState = requesterOrigin ? {
		taskId,
		requesterOrigin
	} : void 0;
	if (!tryPersistTaskUpsert(record, "create", deliveryState)) return null;
	tasks.set(taskId, record);
	if (requesterOrigin) taskDeliveryStates.set(taskId, deliveryState);
	addRunIdIndex(taskId, record.runId);
	addOwnerKeyIndex(taskId, record);
	addParentFlowIdIndex(taskId, record);
	addRelatedSessionKeyIndex(taskId, record);
	syncFlowFromTaskAfterTaskMutation(record, "create");
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecord(record)
	}));
	if (isTerminalTaskStatus(record.status)) maybeDeliverTaskTerminalUpdate(taskId);
	return cloneTaskRecord(record);
}
function updateTaskStateByRunId(params) {
	ensureTaskRegistryReady();
	const matches = getTasksByRunScope(params);
	if (matches.length === 0) return [];
	const updated = [];
	for (const current of matches) {
		const patch = {};
		const nextStatus = params.status ? normalizeTaskStatus(params.status) : current.status;
		if (params.status && !shouldApplyRunScopedStatusUpdate({
			currentStatus: current.status,
			currentRuntime: current.runtime,
			currentChildSessionKey: current.childSessionKey,
			currentError: current.error,
			currentEndedAt: current.endedAt,
			nextStatus,
			nextError: params.error,
			nextEndedAt: params.endedAt
		})) continue;
		const eventAt = params.lastEventAt ?? params.endedAt ?? Date.now();
		if (params.status) patch.status = normalizeTaskStatus(params.status);
		if (params.startedAt != null) patch.startedAt = params.startedAt;
		if (params.endedAt != null) patch.endedAt = params.endedAt;
		if (params.lastEventAt != null) patch.lastEventAt = params.lastEventAt;
		if (params.childSessionKey !== void 0) patch.childSessionKey = params.childSessionKey?.trim() || void 0;
		if (params.clearError) patch.error = void 0;
		else if (current.status === "cancelled" && nextStatus !== "cancelled" && params.error === void 0) patch.error = void 0;
		else if (params.error !== void 0) patch.error = params.error;
		if (params.progressSummary !== void 0) patch.progressSummary = normalizeTaskSummary(params.progressSummary);
		if (params.terminalSummary !== void 0) patch.terminalSummary = params.preserveTerminalSummary ? params.terminalSummary ?? void 0 : normalizeTaskSummary(params.terminalSummary);
		if (params.terminalOutcome !== void 0) patch.terminalOutcome = resolveTaskTerminalOutcome({
			status: nextStatus,
			terminalOutcome: params.terminalOutcome
		});
		if (params.detail !== void 0) patch.detail = params.detail;
		if (params.suppressDelivery) patch.deliveryStatus = "not_applicable";
		const eventSummary = normalizeTaskSummary(params.eventSummary) ?? (nextStatus === "failed" ? normalizeTaskSummary(params.error ?? current.error) : nextStatus === "succeeded" ? normalizeTaskSummary(params.terminalSummary ?? current.terminalSummary) : void 0);
		const nextEvent = params.status && params.status !== current.status || Boolean(normalizeTaskSummary(params.eventSummary)) ? appendTaskEvent({
			at: eventAt,
			kind: params.status && normalizeTaskStatus(params.status) !== current.status ? normalizeTaskStatus(params.status) : "progress",
			summary: eventSummary
		}) : void 0;
		const task = updateTask(current.taskId, patch);
		if (task) {
			updated.push(task);
			if (!params.suppressDelivery) {
				maybeDeliverTaskStateChangeUpdate(task.taskId, nextEvent);
				maybeDeliverTaskTerminalUpdate(task.taskId);
			}
		}
	}
	return updated;
}
function updateTaskDeliveryByRunId(params) {
	ensureTaskRegistryReady();
	const patch = { deliveryStatus: params.deliveryStatus };
	if (params.error !== void 0) patch.error = params.error;
	return updateTasksByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		patch
	});
}
function markTaskRunningByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		status: "running",
		startedAt: params.startedAt,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function recordTaskProgressByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		childSessionKey: params.childSessionKey,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function finalizeTaskRecordByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		childSessionKey: params.childSessionKey,
		status: params.status,
		startedAt: params.startedAt,
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt,
		error: params.error,
		clearError: params.clearError,
		progressSummary: params.progressSummary,
		terminalSummary: params.terminalSummary,
		preserveTerminalSummary: params.preserveTerminalSummary,
		terminalOutcome: params.terminalOutcome,
		detail: params.detail,
		suppressDelivery: params.suppressDelivery
	});
}
function setTaskRunDeliveryStatusByRunId(params) {
	return updateTaskDeliveryByRunId(params);
}
function updateTaskNotifyPolicyById(params) {
	const notifyPolicy = parseTaskNotifyPolicy(params.notifyPolicy);
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		notifyPolicy,
		lastEventAt: Date.now()
	});
}
function linkTaskToFlowById(params) {
	ensureTaskRegistryReady();
	const flowId = params.flowId.trim();
	if (!flowId) return null;
	const current = tasks.get(params.taskId);
	if (!current) return null;
	if (current.parentFlowId?.trim()) return cloneTaskRecord(current);
	assertParentFlowLinkAllowed({
		ownerKey: current.ownerKey,
		scopeKind: current.scopeKind,
		parentFlowId: flowId
	});
	return updateTask(params.taskId, { parentFlowId: flowId });
}
//#endregion
//#region src/tasks/task-registry-cancel.ts
function ensureTaskCancellationReady(task) {
	const runId = task.runId?.trim();
	const linkedTasks = runId && (task.runtime === "acp" || task.runtime === "subagent") ? getTasksByRunScope({
		runId,
		runtime: task.runtime,
		sessionKey: task.childSessionKey
	}) : [task];
	for (const linkedTask of linkedTasks.length > 0 ? linkedTasks : [task]) ensureLinkedTaskFlowRegistryReady(linkedTask);
}
async function cancelTaskById(params) {
	ensureTaskRegistryReady();
	const task = tasks.get(params.taskId.trim());
	if (!task) return {
		found: false,
		cancelled: false,
		reason: "Task not found."
	};
	const requestedReason = params.reason?.trim();
	const cancellationError = requestedReason && requestedReason !== "Subagent run killed." ? requestedReason : "Cancelled by operator.";
	let isProvisionalSubagentKill = task.runtime === "subagent" && task.status === "cancelled" && task.error === "Subagent run killed.";
	if (!isProvisionalSubagentKill && (task.status === "succeeded" || task.status === "failed" || task.status === "timed_out" || task.status === "lost" || task.status === "cancelled")) return {
		found: true,
		cancelled: false,
		reason: "Task is already terminal.",
		task: cloneTaskRecord(task)
	};
	const childSessionKey = task.childSessionKey?.trim();
	try {
		ensureTaskCancellationReady(task);
		if (isBackgroundExecTask(task)) {
			const processSessionId = task.sourceId?.trim();
			const { cancelBackgroundExecSession } = await loadTaskRegistryControlRuntime();
			if (!processSessionId || !cancelBackgroundExecSession?.(processSessionId)) return {
				found: true,
				cancelled: false,
				reason: "Background command has no active cancellation handle.",
				task: cloneTaskRecord(task)
			};
		} else if (task.runtime !== "cli") {
			if (task.runtime === "cron") {
				const { cancelActiveCronTaskRun } = await loadTaskRegistryControlRuntime();
				if (!cancelActiveCronTaskRun({
					runId: task.runId,
					reason: params.reason?.trim() || "Cancelled by operator."
				})) {
					if (task.taskKind === "automation_run" || childSessionKey) return {
						found: true,
						cancelled: false,
						reason: "Cron task has no active cancellation handle.",
						task: cloneTaskRecord(task)
					};
				}
			} else if (!childSessionKey) {
				if (!isHarnessOwnedSubagentTask(task)) return {
					found: true,
					cancelled: false,
					reason: "Task has no cancellable child session.",
					task: cloneTaskRecord(task)
				};
			}
			if (task.runtime === "cron") {} else if (!childSessionKey) {} else if (task.runtime === "acp") {
				const { getAcpSessionManager } = await loadTaskRegistryControlRuntime();
				await getAcpSessionManager().cancelSession({
					cfg: params.cfg,
					sessionKey: childSessionKey,
					reason: params.reason?.trim() || "task-cancel"
				});
			} else if (task.runtime === "subagent") {
				const { killSubagentRunAdmin } = await loadTaskRegistryControlRuntime();
				const result = await killSubagentRunAdmin({
					cfg: params.cfg,
					sessionKey: childSessionKey
				});
				const current = tasks.get(task.taskId);
				if (current?.status === "cancelled" && current.error === "Subagent run killed.") isProvisionalSubagentKill = true;
				if (current?.status === "succeeded") return {
					found: true,
					cancelled: false,
					reason: "Subagent completed while cancellation was in progress.",
					task: cloneTaskRecord(current)
				};
				if (current && isTerminalTaskStatus(current.status) && current.status !== "cancelled") return {
					found: true,
					cancelled: false,
					reason: `Subagent became ${current.status} while cancellation was in progress.`,
					task: cloneTaskRecord(current)
				};
				if (current?.status === "cancelled" && !isProvisionalSubagentKill) return {
					found: true,
					cancelled: false,
					reason: "Subagent was cancelled while cancellation was in progress.",
					task: cloneTaskRecord(current)
				};
				if (result.found && result.targetState?.state === "terminal") {
					const reconciled = finalizeTaskRecordByRunId({
						runId: task.runId?.trim() || result.runId,
						runtime: "subagent",
						sessionKey: childSessionKey,
						...result.targetState.task
					}).find((candidate) => candidate.taskId === task.taskId);
					if (!reconciled) return {
						found: true,
						cancelled: false,
						reason: "Subagent became terminal, but task state reconciliation failed to persist.",
						task: cloneTaskRecord(tasks.get(task.taskId) ?? task)
					};
					if (result.targetState.task.status === "cancelled" && result.targetState.task.error === "Subagent run killed.") isProvisionalSubagentKill = true;
					else return {
						found: true,
						cancelled: false,
						reason: result.targetState.task.status === "succeeded" ? "Subagent completed while cancellation was in progress." : `Subagent became ${result.targetState.task.status} while cancellation was in progress.`,
						task: cloneTaskRecord(reconciled)
					};
				}
				if (result.found && result.targetState?.state === "finalizing") return {
					found: true,
					cancelled: false,
					reason: "Subagent completion is still being finalized.",
					task: cloneTaskRecord(current ?? task)
				};
				if ((!result.found || !result.killed) && !isProvisionalSubagentKill) return {
					found: true,
					cancelled: false,
					reason: result.found ? "Subagent was not running." : "Subagent task not found.",
					task: cloneTaskRecord(current ?? task)
				};
			} else return {
				found: true,
				cancelled: false,
				reason: "Task runtime does not support cancellation yet.",
				task: cloneTaskRecord(task)
			};
		}
		const eventAt = Date.now();
		const current = tasks.get(task.taskId) ?? task;
		const endedAt = isProvisionalSubagentKill ? current.endedAt ?? eventAt : eventAt;
		const updated = (task.runtime === "acp" || task.runtime === "subagent") && task.runId?.trim() ? updateTaskStateByRunId({
			runId: task.runId,
			runtime: task.runtime,
			sessionKey: childSessionKey,
			status: "cancelled",
			endedAt,
			lastEventAt: eventAt,
			error: cancellationError
		}).find((record) => record.taskId === task.taskId) ?? null : updateTask(task.taskId, {
			status: "cancelled",
			endedAt,
			lastEventAt: eventAt,
			error: cancellationError
		});
		if (!updated) return {
			found: true,
			cancelled: false,
			reason: "Task persistence failed.",
			task: cloneTaskRecord(task)
		};
		if (updated) maybeDeliverTaskTerminalUpdate(updated.taskId);
		return {
			found: true,
			cancelled: true,
			task: updated ?? cloneTaskRecord(task)
		};
	} catch (error) {
		return {
			found: true,
			cancelled: false,
			reason: formatErrorMessage(error),
			task: cloneTaskRecord(task)
		};
	}
}
function assertTaskCancellationReadyById(taskId) {
	ensureTaskRegistryReady();
	const task = tasks.get(taskId.trim());
	if (!task) return null;
	if (!isTerminalTaskStatus(task.status) || isProvisionalSubagentKillTask(task)) ensureTaskCancellationReady(task);
	return cloneTaskRecord(task);
}
//#endregion
//#region src/tasks/task-registry.ts
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.taskRegistryTestApi")] = {
	maybeDeliverTaskStateChangeUpdate,
	resetTaskRegistryControlRuntimeForTests,
	resetTaskRegistryDeliveryRuntimeForTests,
	resetTaskRegistryForTests,
	setTaskRegistryControlRuntimeForTests,
	setTaskRegistryDeliveryRuntimeForTests
};
//#endregion
export { resolveTaskFlowForLookupToken as $, listTasksForRelatedSessionKey as A, createManagedTaskFlow as B, listFreshTasksForOwnerKey as C, listTasksForAgentId as D, listTaskRecordsUnsorted as E, completionRequiresMessageToolDelivery as F, findLatestTaskFlowForOwnerKey as G, deleteTaskFlowRecordById as H, resolveDurableCompletionDeliveryMode as I, getTaskFlowRegistryRestoreFailure as J, finishFlow as K, isParentFlowLinkError as L, resolveTaskForLookupToken as M, isProvisionalSubagentKillTask as N, listTasksForFlowId as O, isTaskFlowCancellationPending as P, requestFlowCancel as Q, isTerminalFlowStatus as R, hasActiveTaskForChildSessionKey as S, listTaskRecords as T, ensureTaskFlowRegistryReady as U, createTaskFlowForTask as V, failFlow as W, listTaskFlowsForOwnerKey as X, listTaskFlowRecords as Y, reloadTaskFlowRegistryFromStore as Z, maybeDeliverTaskTerminalUpdate as _, linkTaskToFlowById as a, findTaskByRunId as b, markTaskTerminalById as c, setTaskRunDeliveryStatusByRunId as d, resumeFlow as et, updateTaskNotifyPolicyById as f, isBackgroundExecTask as g, BACKGROUND_EXEC_TASK_KIND as h, finalizeTaskRecordByRunId as i, listTasksForSessionKey as j, listTasksForOwnerKey as k, recordTaskProgressByRunId as l, CRON_TASK_KIND as m, cancelTaskById as n, updateFlowRecordByIdExpectedRevision as nt, markTaskLostById as o, isHarnessOwnedSubagentTask as p, getTaskFlowById as q, createTaskRecord as r, markTaskRunningByRunId as s, assertTaskCancellationReadyById as t, setFlowWaiting as tt, setTaskCleanupAfterById as u, publishTaskRecordAfterAtomicStore as v, listTaskRecordPage as w, getTaskById as x, deleteTaskRecordById as y, mapAgentRunTerminalOutcomeToTaskStatus as z };
