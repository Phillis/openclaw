import { An as executeSqliteQuerySync, It as OPENCLAW_STATE_SCHEMA_SQL, Mn as getNodeSqliteKysely, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { t as classifyExecutionOwnerBinding } from "./execution-owner-binding-D6RWdohd.js";
//#region src/audit/execution-owner-lifecycle-binding-store.ts
const EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE = "execution_owner_lifecycle_bindings";
const SCHEMA_START = `CREATE TABLE IF NOT EXISTS ${EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE} (`;
const SCHEMA_END = ") STRICT;";
function lifecycleDb(db) {
	return getNodeSqliteKysely(db);
}
/** Creates only the canonical additive metadata table at first admitted owner use. */
function ensureExecutionOwnerLifecycleBindingSchema(db) {
	if (tableExists(db, "execution_owner_lifecycle_bindings")) return;
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_START);
	const end = start < 0 ? -1 : OPENCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_END, start);
	if (start < 0 || end < start) throw new Error("OpenClaw execution owner lifecycle binding schema marker is missing.");
	db.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 9));
}
function classifyRetainedBinding(current, binding) {
	const state = classifyExecutionOwnerBinding({
		contextId: current.context_id,
		executionId: current.execution_id
	}, binding);
	return state === "unbound" ? "mismatch" : state;
}
/** Stores one exact admission identity after its canonical owner row has been revalidated. */
function bindExecutionOwnerLifecycleMetadata(params) {
	ensureExecutionOwnerLifecycleBindingSchema(params.db);
	const database = lifecycleDb(params.db);
	const current = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	if (current) return classifyRetainedBinding(current, params.binding);
	const inserted = executeSqliteQuerySync(params.db, database.insertInto(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).values({
		owner_kind: params.ownerKind,
		owner_id: params.ownerId,
		context_id: params.binding.contextId,
		execution_id: params.binding.executionId
	}).onConflict((conflict) => conflict.columns(["owner_kind", "owner_id"]).doNothing()));
	if (Number(inserted.numAffectedRows ?? 0n) === 1) return "bound";
	const raced = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	return raced ? classifyRetainedBinding(raced, params.binding) : "mismatch";
}
/** Removes exact owner metadata without allocating the opt-in table. */
function deleteExecutionOwnerLifecycleMetadata(params) {
	if (params.ownerIds.length === 0 || !tableExists(params.db, "execution_owner_lifecycle_bindings")) return;
	executeSqliteQuerySync(params.db, lifecycleDb(params.db).deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", params.ownerKind).where("owner_id", "in", params.ownerIds));
}
/** Removes bindings whose canonical owner row was pruned in the same transaction. */
function pruneOrphanedExecutionOwnerLifecycleMetadata(db, ownerKind) {
	if (!tableExists(db, "execution_owner_lifecycle_bindings")) return;
	const database = lifecycleDb(db);
	const bindings = database.deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", ownerKind);
	if (ownerKind === "cron") executeSqliteQuerySync(db, bindings.where("owner_id", "not in", database.selectFrom("cron_run_receipts").select("receipt_id")));
	else if (ownerKind === "task") executeSqliteQuerySync(db, bindings.where("owner_id", "not in", database.selectFrom("task_runs").select("task_id")));
	else executeSqliteQuerySync(db, bindings.where("owner_id", "not in", database.selectFrom("flow_runs").select("flow_id")));
}
//#endregion
export { pruneOrphanedExecutionOwnerLifecycleMetadata as i, bindExecutionOwnerLifecycleMetadata as n, deleteExecutionOwnerLifecycleMetadata as r, EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE as t };
