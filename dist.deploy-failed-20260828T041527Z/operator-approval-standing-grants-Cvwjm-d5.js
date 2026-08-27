import "./src-BntaCZM-.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { Bt as tableExists, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { a as loadedCronStoreFromRows } from "./row-codec-gAlP-EPD.js";
import { r as buildSystemRunApprovalEnvBinding } from "./system-run-approval-binding-0Gs8JaF5.js";
import { t as resolveCronJobConfigRevision } from "./config-revision-De4ETdXm.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/operator-approval-standing-grants.ts
/** Grants expire with the operator-approval terminal retention window. */
const CRON_STANDING_GRANT_TTL_MS = 720 * 60 * 6e4;
const STANDING_GRANT_TABLE = "operator_approval_standing_grants";
const STANDING_GRANT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);
`;
/**
* Exact gateway-exec operation binding: trimmed command text, cwd, and the
* env-override hash. Both mint (approval creation) and use (allowlist
* evaluation) derive it from the same raw inputs, so matching is byte-exact —
* the same semantics as systemRunBinding digest matching.
*/
function buildCronExecOperationBinding(params) {
	return stableStringify({
		v: 1,
		command: params.command.trim(),
		cwd: params.cwd?.trim() || null,
		envHash: buildSystemRunApprovalEnvBinding(params.env).envHash
	});
}
function ensureStandingGrantSchema(db) {
	db.exec(STANDING_GRANT_SCHEMA_SQL);
}
/**
* Mints one standing grant inside the caller's open write transaction — the
* same transaction that resolves the minting approval to allow-always. A
* re-mint for the same (agent, job, binding) replaces prior grants.
*/
function mintCronStandingGrantLocked(database, params) {
	ensureStandingGrantSchema(database.db);
	const stateDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("expires_at_ms", "<=", params.nowMs));
	executeSqliteQuerySync(database.db, stateDb.deleteFrom(STANDING_GRANT_TABLE).where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding));
	executeSqliteQuerySync(database.db, stateDb.insertInto(STANDING_GRANT_TABLE).values({
		grant_id: randomUUID(),
		minted_by_approval_id: params.approvalId,
		agent_id: params.agentId,
		cron_job_id: params.cronJobId,
		job_config_revision: params.jobConfigRevision,
		operation_binding: params.operationBinding,
		created_at_ms: params.nowMs,
		expires_at_ms: params.nowMs + CRON_STANDING_GRANT_TTL_MS,
		revoked_at_ms: null,
		revoked_by: null,
		last_used_at_ms: null,
		use_count: 0
	}));
}
/**
* Validates a standing grant without recording a use. Callers that skip the
* prompt on this result must still call consumeCronStandingGrant at the final
* execution boundary: authority is recorded only where the process spawns, so
* a revocation or job edit during awaited pre-spawn work still fails closed.
*/
function validateCronStandingGrant(params) {
	return lookupCronStandingGrant(params, { recordUse: false });
}
/**
* Validates and consumes one standing grant for a cron-context exec. All
* revalidation happens against authoritative rows inside one synchronous write
* transaction: expiry, revocation, the cron job still existing with the same
* config revision, and the minting approval row still holding allow-always.
* Every non-consumed outcome means the caller falls through to prompting.
*/
function consumeCronStandingGrant(params) {
	return lookupCronStandingGrant(params, { recordUse: true });
}
function lookupCronStandingGrant(params, opts) {
	return runOpenClawStateWriteTransaction((database) => {
		if (!tableExists(database.db, STANDING_GRANT_TABLE)) return { outcome: "no-grant" };
		const nowMs = params.nowMs ?? Date.now();
		const stateDb = getNodeSqliteKysely(database.db);
		const grant = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom(STANDING_GRANT_TABLE).selectAll().where("agent_id", "=", params.agentId).where("cron_job_id", "=", params.cronJobId).where("operation_binding", "=", params.operationBinding).orderBy("created_at_ms", "desc").orderBy("grant_id", "desc").limit(1));
		if (!grant) return { outcome: "no-grant" };
		if (grant.revoked_at_ms !== null) return { outcome: "revoked" };
		if (grant.expires_at_ms <= nowMs) return { outcome: "expired" };
		if (grant.job_config_revision !== params.jobConfigRevision) return { outcome: "job-revision-changed" };
		const jobRows = executeSqliteQuerySync(database.db, stateDb.selectFrom("cron_jobs").selectAll().where("job_id", "=", params.cronJobId).limit(2)).rows;
		if (jobRows.length !== 1) return { outcome: "job-missing" };
		const job = loadedCronStoreFromRows(jobRows).store.jobs.find((entry) => entry.id === params.cronJobId);
		if (!job) return { outcome: "job-missing" };
		if (resolveCronJobConfigRevision(job) !== grant.job_config_revision) return { outcome: "job-revision-changed" };
		const approvalRow = executeSqliteQueryTakeFirstSync(database.db, stateDb.selectFrom("operator_approvals").select(["status", "decision"]).where("approval_id", "=", grant.minted_by_approval_id));
		if (!approvalRow) return { outcome: "approval-missing" };
		if (approvalRow.status !== "allowed" || approvalRow.decision !== "allow-always") return { outcome: "approval-not-allow-always" };
		if (!opts.recordUse) return {
			outcome: "consumed",
			grant: {
				grantId: grant.grant_id,
				mintedByApprovalId: grant.minted_by_approval_id,
				agentId: grant.agent_id,
				cronJobId: grant.cron_job_id,
				jobConfigRevision: grant.job_config_revision,
				operationBinding: grant.operation_binding,
				createdAtMs: grant.created_at_ms,
				expiresAtMs: grant.expires_at_ms,
				lastUsedAtMs: grant.last_used_at_ms,
				useCount: grant.use_count
			}
		};
		const nextUseCount = grant.use_count + 1;
		if (executeSqliteQuerySync(database.db, stateDb.updateTable(STANDING_GRANT_TABLE).set({
			last_used_at_ms: nowMs,
			use_count: nextUseCount
		}).where("grant_id", "=", grant.grant_id).where("revoked_at_ms", "is", null).where("expires_at_ms", ">", nowMs)).numAffectedRows !== 1n) return { outcome: "no-grant" };
		return {
			outcome: "consumed",
			grant: {
				grantId: grant.grant_id,
				mintedByApprovalId: grant.minted_by_approval_id,
				agentId: grant.agent_id,
				cronJobId: grant.cron_job_id,
				jobConfigRevision: grant.job_config_revision,
				operationBinding: grant.operation_binding,
				createdAtMs: grant.created_at_ms,
				expiresAtMs: grant.expires_at_ms,
				lastUsedAtMs: nowMs,
				useCount: nextUseCount
			}
		};
	}, params.databaseOptions);
}
//#endregion
export { validateCronStandingGrant as i, consumeCronStandingGrant as n, mintCronStandingGrantLocked as r, buildCronExecOperationBinding as t };
