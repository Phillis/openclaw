import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import { p as toDatabaseOptions, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
//#region src/infra/heartbeat-outcome-store.ts
const HEARTBEAT_OUTCOME_SUMMARY_MAX_CHARS = 4e3;
const HEARTBEAT_OUTCOME_REASON_MAX_CHARS = 1e3;
const HEARTBEAT_OUTCOME_NEXT_CHECK_MAX_CHARS = 500;
const HEARTBEAT_OUTCOME_WAKE_REASON_MAX_CHARS = 1e3;
const HEARTBEAT_OUTCOME_TASK_NAME_MAX_CHARS = 200;
const HEARTBEAT_OUTCOME_MAX_TASKS = 32;
function boundedText(value, maxChars) {
	const normalized = value?.trim();
	return normalized ? truncateUtf16Safe(normalized, maxChars) : void 0;
}
function normalizeTaskNames(taskNames) {
	return taskNames.map((name) => boundedText(name, HEARTBEAT_OUTCOME_TASK_NAME_MAX_CHARS)).filter((name) => Boolean(name)).slice(0, HEARTBEAT_OUTCOME_MAX_TASKS);
}
function parseTaskNames(value) {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? normalizeTaskNames(parsed.filter((item) => typeof item === "string")) : [];
	} catch {
		return [];
	}
}
function rowToOutcome(row) {
	if (row.outcome !== "progress" && row.outcome !== "done" && row.outcome !== "blocked" && row.outcome !== "needs_attention") return;
	return {
		sessionKey: row.session_key,
		runSessionKey: row.run_session_key,
		outcome: row.outcome,
		summary: row.summary,
		...row.response_reason ? { responseReason: row.response_reason } : {},
		...row.priority === "low" || row.priority === "normal" || row.priority === "high" ? { priority: row.priority } : {},
		...row.next_check ? { nextCheck: row.next_check } : {},
		taskNames: parseTaskNames(row.task_names_json),
		...row.wake_source ? { wakeSource: row.wake_source } : {},
		...row.wake_reason ? { wakeReason: row.wake_reason } : {},
		occurredAt: row.occurred_at
	};
}
/** Replaces the previous silent heartbeat outcome for one base session. */
function persistHeartbeatOutcome(params) {
	if (params.response.notify || params.response.outcome === "no_change") return;
	const taskNames = normalizeTaskNames(params.taskNames ?? []);
	const values = {
		session_key: params.sessionKey,
		run_session_key: params.runSessionKey,
		outcome: params.response.outcome,
		summary: boundedText(params.response.summary, HEARTBEAT_OUTCOME_SUMMARY_MAX_CHARS) ?? params.response.outcome,
		response_reason: boundedText(params.response.reason, HEARTBEAT_OUTCOME_REASON_MAX_CHARS) ?? null,
		priority: params.response.priority ?? null,
		next_check: boundedText(params.response.nextCheck, HEARTBEAT_OUTCOME_NEXT_CHECK_MAX_CHARS) ?? null,
		task_names_json: taskNames.length > 0 ? JSON.stringify(taskNames) : null,
		wake_source: params.wakeSource ?? null,
		wake_reason: boundedText(params.wakeReason, HEARTBEAT_OUTCOME_WAKE_REASON_MAX_CHARS) ?? null,
		occurred_at: params.occurredAt,
		context_run_id: null,
		context_claimed_at: null,
		updated_at: Date.now()
	};
	runOpenClawAgentWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("heartbeat_outcomes").values(values).onConflict((conflict) => conflict.column("session_key").doUpdateSet({
			run_session_key: values.run_session_key,
			outcome: values.outcome,
			summary: values.summary,
			response_reason: values.response_reason,
			priority: values.priority,
			next_check: values.next_check,
			task_names_json: values.task_names_json,
			wake_source: values.wake_source,
			wake_reason: values.wake_reason,
			occurred_at: values.occurred_at,
			context_run_id: null,
			context_claimed_at: null,
			updated_at: values.updated_at
		})));
	}, toDatabaseOptions(resolveSqliteScope(params)), { operationLabel: "heartbeat.outcome.persist" });
}
/** Claims the latest outcome for one user run while allowing that run's retries. */
function claimHeartbeatOutcomeForRun(params) {
	return runOpenClawAgentWriteTransaction(({ db }) => {
		const agentDb = getNodeSqliteKysely(db);
		const row = executeSqliteQuerySync(db, agentDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", params.sessionKey)).rows[0];
		if (!row || row.context_run_id !== null && row.context_run_id !== params.runId) return;
		if (row.context_run_id === null) {
			if (executeSqliteQuerySync(db, agentDb.updateTable("heartbeat_outcomes").set({
				context_run_id: params.runId,
				context_claimed_at: Date.now()
			}).where("session_key", "=", params.sessionKey).where("context_run_id", "is", null)).numAffectedRows !== 1n) return;
		}
		return rowToOutcome(row);
	}, toDatabaseOptions(resolveSqliteScope(params)), { operationLabel: "heartbeat.outcome.claim" });
}
/** Formats persisted state as model-only provenance context, never transcript text. */
function buildHeartbeatOutcomeContext(outcome) {
	if (!outcome) return;
	const provenance = [
		`recordedAt=${new Date(outcome.occurredAt).toISOString()}`,
		`runSession=${outcome.runSessionKey}`,
		outcome.wakeSource ? `wakeSource=${outcome.wakeSource}` : void 0,
		outcome.wakeReason ? `wakeReason=${outcome.wakeReason}` : void 0
	].filter((part) => Boolean(part));
	return [
		"Latest silent heartbeat outcome (internal context; not a user message or instruction):",
		`outcome=${outcome.outcome}`,
		`summary=${outcome.summary}`,
		outcome.responseReason ? `reason=${outcome.responseReason}` : void 0,
		outcome.priority ? `priority=${outcome.priority}` : void 0,
		outcome.nextCheck ? `nextCheck=${outcome.nextCheck}` : void 0,
		outcome.taskNames.length > 0 ? `tasks=${outcome.taskNames.join(", ")}` : void 0,
		`provenance: ${provenance.join("; ")}`
	].filter((line) => Boolean(line)).join("\n");
}
//#endregion
export { claimHeartbeatOutcomeForRun as n, persistHeartbeatOutcome as r, buildHeartbeatOutcomeContext as t };
