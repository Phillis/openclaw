import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { at as normalizeAgentRunTerminalReplySnapshot, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-B3qeEQhR.js";
import { isDeepStrictEqual } from "node:util";
import { sql } from "kysely";
//#region src/agents/subagents/registry/subagent-registry-memory.ts
/**
* Process-local live subagent run map.
*
* Shared by registry read/write helpers for active in-memory run state.
*/
const collectorRunIdByChildSessionKey = /* @__PURE__ */ new Map();
const runsByChildSessionKey = /* @__PURE__ */ new Map();
const runsByCollectorGroupKey = /* @__PURE__ */ new Map();
function collectorGroupKey(entry) {
	if (entry.collect !== true || !entry.groupId) return;
	return JSON.stringify([entry.swarmRequesterSessionKey ?? entry.requesterSessionKey, entry.groupId]);
}
function removeIndexedSubagentRun(index, key, runId, entry) {
	if (!key) return;
	const indexedRuns = index.get(key);
	if (indexedRuns?.get(runId) !== entry) return;
	indexedRuns.delete(runId);
	if (indexedRuns.size === 0) index.delete(key);
}
function indexSubagentRun(index, key, runId, entry) {
	if (!key) return;
	const indexedRuns = index.get(key);
	if (indexedRuns) indexedRuns.set(runId, entry);
	else index.set(key, /* @__PURE__ */ new Map([[runId, entry]]));
}
var SubagentRunMap = class extends Map {
	set(runId, entry) {
		const prev = this.get(runId);
		if (prev) {
			removeIndexedSubagentRun(runsByChildSessionKey, prev.childSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByCollectorGroupKey, collectorGroupKey(prev), runId, prev);
			if (prev.collect === true && prev.childSessionKey) collectorRunIdByChildSessionKey.delete(prev.childSessionKey);
		}
		super.set(runId, entry);
		indexSubagentRun(runsByChildSessionKey, entry.childSessionKey, runId, entry);
		indexSubagentRun(runsByCollectorGroupKey, collectorGroupKey(entry), runId, entry);
		if (entry.collect === true && entry.childSessionKey) collectorRunIdByChildSessionKey.set(entry.childSessionKey, runId);
		return this;
	}
	delete(runId) {
		const prev = this.get(runId);
		if (prev) {
			removeIndexedSubagentRun(runsByChildSessionKey, prev.childSessionKey, runId, prev);
			removeIndexedSubagentRun(runsByCollectorGroupKey, collectorGroupKey(prev), runId, prev);
		}
		if (prev?.collect === true && prev.childSessionKey && collectorRunIdByChildSessionKey.get(prev.childSessionKey) === runId) collectorRunIdByChildSessionKey.delete(prev.childSessionKey);
		return super.delete(runId);
	}
	clear() {
		super.clear();
		collectorRunIdByChildSessionKey.clear();
		runsByChildSessionKey.clear();
		runsByCollectorGroupKey.clear();
	}
};
const subagentRuns = new SubagentRunMap();
/** Iterate live generations for one child session without scanning the registry. */
function getSubagentRunsForChildSession(childSessionKey) {
	return runsByChildSessionKey.get(childSessionKey)?.values() ?? [];
}
/** Iterate live collector members for one requester/group archive decision. */
function getSubagentRunsForCollectorGroup(requesterSessionKey, groupId) {
	const key = JSON.stringify([requesterSessionKey, groupId]);
	return runsByCollectorGroupKey.get(key)?.entries() ?? [];
}
/** Resolve a collector tombstone that reserves its child session from ordinary turns. */
function findSwarmCollectorSession(childSessionKey) {
	const key = childSessionKey?.trim();
	if (!key) return;
	const runId = collectorRunIdByChildSessionKey.get(key);
	return runId ? subagentRuns.get(runId) : void 0;
}
/** Resolve the host-registered collector that authorizes a Gateway request. */
function findAuthorizedSwarmCollectorRequest(params) {
	const idempotencyKey = params.idempotencyKey?.trim();
	if (!idempotencyKey) return;
	const entry = findSwarmCollectorSession(params.childSessionKey);
	if (!entry) return;
	return entry.swarmLaunchIdempotencyKey === idempotencyKey && isDeepStrictEqual(entry.outputSchema, params.outputSchema) ? entry : void 0;
}
//#endregion
//#region src/agents/subagents/registry/subagent-delivery-state.ts
function normalizeSubagentRunState(entry) {
	entry.taskRunId = (typeof entry.taskRunId === "string" ? entry.taskRunId.trim() : "") || void 0;
	const requesterTurnRunId = typeof entry.requesterTurnRunId === "string" ? entry.requesterTurnRunId.trim() : "";
	entry.requesterTurnRunId = requesterTurnRunId || void 0;
	entry.requesterTurnYielded = requesterTurnRunId && entry.requesterTurnYielded === true ? true : void 0;
	entry.retireAfterRequesterTurn = requesterTurnRunId && entry.retireAfterRequesterTurn === true ? true : void 0;
	entry.generation = typeof entry.generation === "number" && Number.isSafeInteger(entry.generation) && entry.generation > 0 ? entry.generation : void 0;
	entry.deleteCleanupDispatchedAt = Number.isFinite(entry.deleteCleanupDispatchedAt) ? entry.deleteCleanupDispatchedAt : void 0;
	entry.suppressCompletionDelivery = entry.suppressCompletionDelivery === true ? true : void 0;
	entry.terminalOwner = entry.terminalOwner === "interrupted-recovery" && Number.isFinite(entry.execution.endedAt) && entry.execution.outcome?.status === "error" && entry.endedReason === "subagent-error" && entry.pauseReason !== "sessions_yield" ? "interrupted-recovery" : void 0;
	if (entry.completion) entry.completion.terminalReply = normalizeAgentRunTerminalReplySnapshot(entry.completion.terminalReply);
	const killReconciliation = entry.killReconciliation;
	if (!killReconciliation || typeof killReconciliation !== "object" || !Number.isFinite(killReconciliation.killedAt)) delete entry.killReconciliation;
	else entry.killReconciliation = {
		killedAt: killReconciliation.killedAt,
		suppressTaskDelivery: killReconciliation.suppressTaskDelivery === true ? true : void 0,
		supersededAt: Number.isFinite(killReconciliation.supersededAt) ? killReconciliation.supersededAt : void 0
	};
	const killIntent = entry.killIntent;
	if (!killIntent || typeof killIntent !== "object" || !Number.isFinite(killIntent.requestedAt) || typeof killIntent.reason !== "string" || !killIntent.reason.trim()) delete entry.killIntent;
	else entry.killIntent = {
		requestedAt: killIntent.requestedAt,
		reason: killIntent.reason.trim(),
		lifecycleGeneration: typeof killIntent.lifecycleGeneration === "string" && killIntent.lifecycleGeneration.trim() ? killIntent.lifecycleGeneration.trim() : void 0,
		sessionId: typeof killIntent.sessionId === "string" && killIntent.sessionId.trim() ? killIntent.sessionId.trim() : void 0,
		sessionLifecycleRevision: typeof killIntent.sessionLifecycleRevision === "string" && killIntent.sessionLifecycleRevision.trim() ? killIntent.sessionLifecycleRevision.trim() : void 0,
		suppressTaskDelivery: killIntent.suppressTaskDelivery === true ? true : void 0
	};
	if (entry.cleanupHandled === true && typeof entry.cleanupCompletedAt !== "number" && entry.delivery?.status !== "discarded") entry.cleanupHandled = false;
	return entry;
}
/** Ensures a run has a nested completion state object. */
function ensureCompletionState(entry) {
	entry.completion ??= { required: entry.expectsCompletionMessage === true };
	return entry.completion;
}
/** Ensures a run has a nested delivery state object. */
function ensureDeliveryState(entry) {
	entry.delivery ??= { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
	return entry.delivery;
}
/** Resets delivery state to its initial status for the run's completion requirement. */
function clearDeliveryState(entry) {
	entry.delivery = { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
}
/** Returns true when delivery is suspended with a durable timestamp. */
function isDeliverySuspended(entry) {
	return entry.delivery?.status === "suspended" && typeof entry.delivery.suspendedAt === "number";
}
/** Reads the current delivery attempt count. */
function getDeliveryAttemptCount(entry) {
	return entry.delivery?.attemptCount ?? 0;
}
/** Reads the non-empty last delivery error. */
function getDeliveryLastError(entry) {
	const error = entry.delivery?.lastError;
	return typeof error === "string" && error.trim() ? error : void 0;
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-generation.ts
function normalizeGeneration(entry) {
	return typeof entry.generation === "number" && Number.isFinite(entry.generation) ? entry.generation : 0;
}
/** Orders runs that share a child session, including legacy rows without a generation. */
function compareSubagentRunGeneration(left, right) {
	const generationDelta = normalizeGeneration(left) - normalizeGeneration(right);
	if (generationDelta !== 0) return generationDelta;
	const createdAtDelta = left.createdAt - right.createdAt;
	if (createdAtDelta !== 0) return createdAtDelta;
	return left.runId.localeCompare(right.runId);
}
/** Allocates a durable monotonic generation within one child session. */
function nextSubagentRunGeneration(runs, childSessionKey) {
	let generation = 0;
	for (const entry of runs) if (entry.childSessionKey === childSessionKey) generation = Math.max(generation, normalizeGeneration(entry));
	return generation + 1;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.sqlite.ts
/**
* Persists subagent run records in the shared sqlite state database. The
* store preserves typed columns for hot delivery state while retaining the
* normalized payload JSON for forward-compatible record hydration.
*/
const EXECUTION_STATUSES = new Set("queued running interrupted terminal".split(" "));
const DELIVERY_STATUSES = new Set("not_required pending in_progress delivered failed suspended discarded".split(" "));
function hasStateStatus(value, statuses) {
	return isRecord(value) && typeof value.status === "string" && statuses.has(value.status);
}
function isCanonicalSubagentRunRecord(value) {
	return isRecord(value) && hasStateStatus(value.execution, EXECUTION_STATUSES) && isRecord(value.completion) && typeof value.completion.required === "boolean" && hasStateStatus(value.delivery, DELIVERY_STATUSES) && !("handoffLeaseId" in value.delivery || "handoffLeasedAt" in value.delivery || "handoffInjectedAt" in value.delivery);
}
function jsonStringify(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function parseJson(raw) {
	return raw ? safeParseJson(raw) : void 0;
}
function boolToSqlite(value) {
	return value === void 0 ? null : value ? 1 : 0;
}
/** Rehydrates one sqlite row into the normalized subagent run record shape. */
function rowToSubagentRunRecord(row) {
	const payload = parseJson(row.payload_json);
	if (!isCanonicalSubagentRunRecord(payload)) return null;
	payload.runId = row.run_id;
	payload.childSessionKey = row.child_session_key;
	payload.requesterSessionKey = row.requester_session_key;
	const controllerSessionKey = row.controller_session_key?.trim();
	if (controllerSessionKey) payload.controllerSessionKey = controllerSessionKey;
	else delete payload.controllerSessionKey;
	if (payload.requesterOrigin) payload.requesterOrigin = normalizeDeliveryContext(payload.requesterOrigin);
	if (payload.expectsCompletionMessage === false) payload.delivery.status = "not_required";
	const record = normalizeSubagentRunState(payload);
	return record.runId && record.childSessionKey && record.requesterSessionKey ? record : null;
}
/** Canonically serializes a run before an outer transaction acquires the write lock. */
function bindSubagentRunRecord(entry) {
	const normalized = normalizeSubagentRunState(structuredClone(entry));
	if (!isCanonicalSubagentRunRecord(normalized)) throw new Error("subagent run is missing canonical nested state");
	const delivery = normalized.delivery;
	const completion = normalized.completion;
	const requesterSettleWake = normalized.requesterSettleWake;
	return {
		run_id: normalized.runId,
		child_session_key: normalized.childSessionKey,
		controller_session_key: normalized.controllerSessionKey?.trim() || null,
		requester_session_key: normalized.requesterSessionKey,
		requester_display_key: normalized.requesterDisplayKey,
		requester_origin_json: jsonStringify(normalized.requesterOrigin),
		task: normalized.task,
		task_name: normalized.taskName ?? null,
		cleanup: normalized.cleanup,
		label: normalized.label ?? null,
		model: normalized.model ?? null,
		agent_dir: normalized.agentDir ?? null,
		workspace_dir: normalized.workspaceDir ?? null,
		run_timeout_seconds: normalized.runTimeoutSeconds ?? null,
		spawn_mode: normalized.spawnMode ?? null,
		created_at: normalized.createdAt,
		started_at: normalized.execution.startedAt ?? null,
		session_started_at: normalized.sessionStartedAt ?? null,
		accumulated_runtime_ms: normalized.accumulatedRuntimeMs ?? null,
		ended_at: normalized.execution.endedAt ?? null,
		outcome_json: jsonStringify(normalized.execution.outcome),
		archive_at_ms: normalized.archiveAtMs ?? null,
		cleanup_completed_at: normalized.cleanupCompletedAt ?? null,
		cleanup_handled: boolToSqlite(normalized.cleanupHandled),
		suppress_announce_reason: normalized.suppressAnnounceReason ?? null,
		expects_completion_message: boolToSqlite(normalized.expectsCompletionMessage),
		announce_retry_count: delivery?.attemptCount ?? null,
		last_announce_retry_at: delivery?.lastAttemptAt ?? null,
		last_announce_delivery_error: delivery?.lastError ?? null,
		ended_reason: normalized.endedReason ?? null,
		pause_reason: normalized.pauseReason ?? null,
		wake_on_descendant_settle: boolToSqlite(normalized.wakeOnDescendantSettle),
		requester_settle_wake_status: requesterSettleWake?.status ?? null,
		requester_settle_wake_attempt_count: requesterSettleWake?.attemptCount ?? null,
		requester_settle_wake_replay_count: requesterSettleWake?.replayCount ?? null,
		requester_settle_wake_next_attempt_at: requesterSettleWake?.nextAttemptAt ?? null,
		requester_settle_wake_batch_run_ids_json: jsonStringify(requesterSettleWake?.batchRunIds),
		requester_settle_wake_last_error: requesterSettleWake?.lastError ?? null,
		requester_settle_wake_retire_after: boolToSqlite(requesterSettleWake?.retireAfterSettle),
		frozen_result_text: completion?.resultText ?? null,
		frozen_result_captured_at: completion?.capturedAt ?? null,
		fallback_frozen_result_text: completion?.fallbackResultText ?? null,
		fallback_frozen_result_captured_at: completion?.fallbackCapturedAt ?? null,
		ended_hook_emitted_at: normalized.endedHookEmittedAt ?? null,
		pending_final_delivery: boolToSqlite(delivery?.status === "pending" || Boolean(delivery?.payload)),
		pending_final_delivery_created_at: delivery?.createdAt ?? null,
		pending_final_delivery_last_attempt_at: delivery?.lastAttemptAt ?? null,
		pending_final_delivery_attempt_count: delivery?.attemptCount ?? null,
		pending_final_delivery_last_error: delivery?.lastError ?? null,
		pending_final_delivery_payload_json: jsonStringify(delivery?.payload),
		completion_announced_at: delivery?.announcedAt ?? null,
		swarm_group_id: normalized.groupId ?? null,
		swarm_collector: boolToSqlite(normalized.collect),
		swarm_output_schema_json: jsonStringify(normalized.outputSchema),
		swarm_completion_status: normalized.collectorCompletion?.status ?? null,
		swarm_structured_json: jsonStringify(normalized.collectorCompletion?.structured),
		swarm_schema_error: normalized.collectorCompletion?.schemaError ?? null,
		swarm_usage_json: jsonStringify(normalized.collectorCompletion?.usage),
		payload_json: JSON.stringify(normalized)
	};
}
/** Upserts a prebound run on the exact supplied shared-state handle. */
function upsertSubagentRunRowInDatabase(database, row) {
	const stateDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, stateDb.insertInto("subagent_runs").values(row).onConflict((conflict) => conflict.column("run_id").doUpdateSet(subagentRunRecordToSqliteUpdate(row))));
}
function subagentRunRecordToSqliteUpdate(values) {
	const { run_id: _runId, ...update } = values;
	return update;
}
function writeSubagentRunValues(values, deleteRunIds, retainedRunIds) {
	if (values.length === 0 && deleteRunIds?.length === 0 && retainedRunIds === void 0) return;
	runOpenClawStateWriteTransaction((database) => {
		const { db } = database;
		const stateDb = getNodeSqliteKysely(db);
		for (const row of values) upsertSubagentRunRowInDatabase(database, row);
		if (retainedRunIds !== void 0) {
			executeSqliteQuerySync(db, retainedRunIds.length === 0 ? stateDb.deleteFrom("subagent_runs") : stateDb.deleteFrom("subagent_runs").where("run_id", "not in", retainedRunIds));
			return;
		}
		if (deleteRunIds && deleteRunIds.length > 0) executeSqliteQuerySync(db, stateDb.deleteFrom("subagent_runs").where("run_id", "in", deleteRunIds));
	});
}
function readSubagentRegistryRows(scope) {
	const { db } = openOpenClawStateDatabase();
	let query = getNodeSqliteKysely(db).selectFrom("subagent_runs").selectAll();
	if (scope?.kind === "child") query = query.where("child_session_key", "=", scope.sessionKey);
	else if (scope?.kind === "controller") query = query.where((eb) => eb.or([eb("controller_session_key", "=", scope.sessionKey), eb.and([eb.or([eb("controller_session_key", "is", null), eb("controller_session_key", "=", "")]), eb("requester_session_key", "=", scope.sessionKey)])]));
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("run_id", "asc")).rows;
}
function subagentPayloadJsonValue(path) {
	return sql`json_extract(payload_json, ${path})`;
}
function canonicalSubagentPayloadFilter() {
	return sql`json_valid(payload_json)
    AND json_type(payload_json, '$.execution') = 'object'
    AND json_extract(payload_json, '$.execution.status')
      IN ('queued', 'running', 'interrupted', 'terminal')
    AND json_type(payload_json, '$.completion') = 'object'
    AND json_type(payload_json, '$.completion.required') IN ('true', 'false')
    AND json_type(payload_json, '$.delivery') = 'object'
    AND json_extract(payload_json, '$.delivery.status')
      IN (
        'not_required',
        'pending',
        'in_progress',
        'delivered',
        'failed',
        'suspended',
        'discarded'
      )
    AND json_type(payload_json, '$.delivery.handoffLeaseId') IS NULL
    AND json_type(payload_json, '$.delivery.handoffLeasedAt') IS NULL
    AND json_type(payload_json, '$.delivery.handoffInjectedAt') IS NULL`;
}
function readSubagentSessionListRows() {
	const { db } = openOpenClawStateDatabase();
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("subagent_runs").select([
		"run_id",
		"child_session_key",
		"controller_session_key",
		"requester_session_key",
		"model",
		"run_timeout_seconds",
		"created_at",
		"started_at",
		"session_started_at",
		"accumulated_runtime_ms",
		"ended_at",
		"ended_reason",
		"cleanup_completed_at",
		subagentPayloadJsonValue("$.generation").as("generation"),
		subagentPayloadJsonValue("$.execution.outcome.status").as("outcome_status"),
		subagentPayloadJsonValue("$.delivery.status").as("delivery_status"),
		subagentPayloadJsonValue("$.requesterAgentId").as("requester_agent_id"),
		subagentPayloadJsonValue("$.delivery.suspendedAt").as("delivery_suspended_at")
	]).where(canonicalSubagentPayloadFilter()).orderBy("created_at", "asc").orderBy("run_id", "asc")).rows;
}
function rowToSubagentRunReadRecord(row) {
	const runId = row.run_id.trim();
	const childSessionKey = row.child_session_key.trim();
	const requesterSessionKey = row.requester_session_key.trim();
	if (!runId || !childSessionKey || !requesterSessionKey) return null;
	const outcomeStatus = row.outcome_status === "ok" || row.outcome_status === "error" || row.outcome_status === "timeout" || row.outcome_status === "unknown" ? row.outcome_status : void 0;
	const deliveryStatus = DELIVERY_STATUSES.has(row.delivery_status ?? "") ? row.delivery_status : void 0;
	const startedAt = asFiniteNumber(row.started_at);
	const endedAt = asFiniteNumber(row.ended_at);
	return Object.fromEntries(Object.entries({
		runId,
		childSessionKey,
		controllerSessionKey: row.controller_session_key?.trim() || void 0,
		requesterSessionKey,
		requesterAgentId: row.requester_agent_id?.trim() || void 0,
		model: row.model || void 0,
		generation: asFiniteNumber(row.generation),
		createdAt: row.created_at,
		execution: {
			...startedAt !== void 0 ? { startedAt } : {},
			...endedAt !== void 0 ? { endedAt } : {},
			...outcomeStatus ? { outcome: { status: outcomeStatus } } : {}
		},
		sessionStartedAt: asFiniteNumber(row.session_started_at),
		accumulatedRuntimeMs: asFiniteNumber(row.accumulated_runtime_ms),
		runTimeoutSeconds: asFiniteNumber(row.run_timeout_seconds),
		endedReason: row.ended_reason || void 0,
		cleanupCompletedAt: asFiniteNumber(row.cleanup_completed_at),
		delivery: deliveryStatus ? {
			status: deliveryStatus,
			...asFiniteNumber(row.delivery_suspended_at) !== void 0 ? { suspendedAt: row.delivery_suspended_at ?? void 0 } : {}
		} : void 0
	}).filter(([, value]) => value !== void 0));
}
function loadScopedSubagentRuns(scope) {
	const key = scope.sessionKey.trim();
	if (!key) return [];
	return readSubagentRegistryRows({
		...scope,
		sessionKey: key
	}).flatMap((row) => {
		const run = rowToSubagentRunRecord(row);
		return run ? [run] : [];
	});
}
/** Loads runs controlled by one session, preserving the legacy requester fallback. */
function loadSubagentRunsForControllerFromSqlite(controllerSessionKey) {
	return loadScopedSubagentRuns({
		kind: "controller",
		sessionKey: controllerSessionKey
	});
}
/** Loads all persisted generations for one child session through its existing index. */
function loadSubagentRunsForChildSessionFromSqlite(childSessionKey) {
	return loadScopedSubagentRuns({
		kind: "child",
		sessionKey: childSessionKey
	});
}
/** Loads the canonical subagent registry from shared SQLite state. */
function loadSubagentRegistryFromSqlite() {
	const runs = /* @__PURE__ */ new Map();
	for (const row of readSubagentRegistryRows()) {
		const entry = rowToSubagentRunRecord(row);
		if (entry) runs.set(entry.runId, entry);
	}
	return runs;
}
/** Loads only the canonical fields needed to build session-list topology metadata. */
function loadSubagentSessionListRunsFromSqlite() {
	const runs = /* @__PURE__ */ new Map();
	for (const row of readSubagentSessionListRows()) {
		const entry = rowToSubagentRunReadRecord(row);
		if (entry) runs.set(entry.runId, entry);
	}
	return runs;
}
/** Saves the complete subagent run snapshot to sqlite and prunes rows not in the snapshot. */
function saveSubagentRegistryToSqlite(runs) {
	const values = [...runs.values()].map(bindSubagentRunRecord);
	writeSubagentRunValues(values, void 0, values.map((row) => row.run_id));
}
/** Persists only named run mutations, deleting names absent from the current registry. */
function saveSubagentRegistryChangesToSqlite(runs, changedRunIds) {
	const runIds = [...new Set(changedRunIds.map((runId) => runId.trim()).filter(Boolean))];
	const values = [];
	const deleteRunIds = [];
	for (const runId of runIds) {
		const entry = runs.get(runId);
		if (entry) values.push(bindSubagentRunRecord(entry));
		else deleteRunIds.push(runId);
	}
	writeSubagentRunValues(values, deleteRunIds);
}
//#endregion
export { subagentRuns as S, normalizeSubagentRunState as _, loadSubagentSessionListRunsFromSqlite as a, getSubagentRunsForChildSession as b, upsertSubagentRunRowInDatabase as c, clearDeliveryState as d, ensureCompletionState as f, isDeliverySuspended as g, getDeliveryLastError as h, loadSubagentRunsForControllerFromSqlite as i, compareSubagentRunGeneration as l, getDeliveryAttemptCount as m, loadSubagentRegistryFromSqlite as n, saveSubagentRegistryChangesToSqlite as o, ensureDeliveryState as p, loadSubagentRunsForChildSessionFromSqlite as r, saveSubagentRegistryToSqlite as s, bindSubagentRunRecord as t, nextSubagentRunGeneration as u, findAuthorizedSwarmCollectorRequest as v, getSubagentRunsForCollectorGroup as x, findSwarmCollectorSession as y };
