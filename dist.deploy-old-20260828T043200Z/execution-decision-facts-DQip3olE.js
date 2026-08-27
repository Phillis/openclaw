import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, Zt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { _t as validateDecisionReceiptV1 } from "./src-4dv5TpeQ.js";
import { createHmac, randomBytes } from "node:crypto";
import { sql } from "kysely";
//#region src/audit/audit-identity.ts
/** Stable installation-local pseudonyms for sensitive audit identifiers. */
const AUDIT_IDENTITY_SINGLETON_ID = 1;
const AUDIT_IDENTITY_KEY_BYTES = 32;
const AUDIT_IDENTITY_KEY_ID_BYTES = 16;
const AUDIT_IDENTITY_KEY_ID_RE = /^[a-f0-9]{32}$/u;
const AUDIT_IDENTITY_DOMAIN = "openclaw.audit.identity.v1";
const identityByDatabase = /* @__PURE__ */ new WeakMap();
function registerAuditIdentityKeyForRedaction(key) {
	const bytes = Buffer.from(key);
	registerSecretValueForRedaction(bytes.toString("hex"));
	registerSecretValueForRedaction(bytes.toString("base64url"));
}
function parseAuditIdentityKey(row) {
	if (typeof row.key_id !== "string" || !AUDIT_IDENTITY_KEY_ID_RE.test(row.key_id) || !(row.key instanceof Uint8Array) || row.key.byteLength !== AUDIT_IDENTITY_KEY_BYTES) throw new Error("audit identity key is corrupt");
	const key = Buffer.from(row.key);
	registerAuditIdentityKeyForRedaction(key);
	return {
		keyId: row.key_id,
		key
	};
}
/** Load the stable audit identity key or create it transactionally on first use. */
function loadOrCreateAuditIdentityKey(db) {
	const cached = identityByDatabase.get(db);
	if (cached) return cached;
	const kysely = getNodeSqliteKysely(db);
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_identity_keys").select(["key_id", "key"]).where("id", "=", AUDIT_IDENTITY_SINGLETON_ID));
	if (existing) {
		const identity = parseAuditIdentityKey(existing);
		identityByDatabase.set(db, identity);
		return identity;
	}
	const retainedMessage = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_events").select("sequence").where("kind", "=", "message").limit(1));
	const retainedExecutionContext = Boolean(db.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get("execution_identity_contexts")) ? executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("execution_identity_contexts").select("context_id").limit(1)) : void 0;
	if (retainedMessage || retainedExecutionContext) throw new Error("audit identity key is missing");
	const candidate = {
		id: AUDIT_IDENTITY_SINGLETON_ID,
		key_id: randomBytes(AUDIT_IDENTITY_KEY_ID_BYTES).toString("hex"),
		key: randomBytes(AUDIT_IDENTITY_KEY_BYTES),
		created_at: Date.now()
	};
	executeSqliteQuerySync(db, kysely.insertInto("audit_identity_keys").values(candidate).onConflict((conflict) => conflict.column("id").doNothing()));
	const stored = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_identity_keys").select(["key_id", "key"]).where("id", "=", AUDIT_IDENTITY_SINGLETON_ID));
	if (!stored) throw new Error("audit identity key could not be created");
	const identity = parseAuditIdentityKey(stored);
	identityByDatabase.set(db, identity);
	return identity;
}
/** Forget transaction-local key state after a failed or rolled-back write. */
function clearAuditIdentityKeyCacheForDatabase(db) {
	identityByDatabase.delete(db);
}
/** Produce a stable, domain-separated pseudonym without retaining raw identity bytes. */
function pseudonymizeAuditIdentity(params) {
	if (params.value === void 0 || params.value.length === 0) return;
	const digest = createHmac("sha256", params.identity.key).update(JSON.stringify([
		AUDIT_IDENTITY_DOMAIN,
		params.kind,
		params.channel,
		params.accountId ?? null,
		params.kind === "message" ? params.conversationId ?? null : null,
		params.value
	]), "utf8").digest("hex");
	return `hmac-sha256:v1:${params.identity.keyId}:${digest}`;
}
/** Project one execution-identity ref without retaining its raw owner value. */
function pseudonymizeExecutionIdentityRef(params) {
	if (!params.scope || !params.value) throw new Error("execution identity HMAC scope and value must be non-empty");
	const identity = loadOrCreateAuditIdentityKey(params.db);
	const digest = createHmac("sha256", identity.key).update(JSON.stringify([
		"openclaw.audit.execution-identity.v1",
		params.kind,
		params.scope,
		params.value
	]), "utf8").digest("hex");
	return `hmac-sha256:v1:${identity.keyId}:${digest}`;
}
//#endregion
//#region src/audit/execution-decision-facts.ts
const EXECUTION_DECISION_FACT_MAX_BYTES = 16 * 1024;
const EXECUTION_DECISION_FACT_RETENTION_MS = 720 * 60 * 6e4;
const EXECUTION_DECISION_FACT_MAX_ROWS = 25e4;
const EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS = 1024;
const EXECUTION_DECISION_FACT_SUMMARY_MAX_ROWS = 128;
const EXECUTION_DECISION_SELECTOR_PREFIX = "decision-fact:";
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const EXECUTION_DECISION_FACT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS execution_decision_facts (
  receipt_id TEXT NOT NULL PRIMARY KEY CHECK (length(receipt_id) BETWEEN 1 AND 256),
  context_id TEXT NOT NULL CHECK (length(context_id) BETWEEN 1 AND 256),
  execution_id TEXT NOT NULL CHECK (length(execution_id) BETWEEN 1 AND 256),
  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),
  action_id TEXT CHECK (action_id IS NULL OR length(action_id) BETWEEN 1 AND 256),
  action_family TEXT NOT NULL CHECK (length(action_family) BETWEEN 1 AND 256),
  decision_outcome TEXT NOT NULL CHECK (
    decision_outcome IN ('allowed', 'denied', 'not-applicable', 'unknown')
  ),
  coverage_state TEXT NOT NULL CHECK (
    coverage_state IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported')
  ),
  reason_code TEXT NOT NULL CHECK (length(reason_code) BETWEEN 1 AND 256),
  owner TEXT NOT NULL CHECK (length(owner) BETWEEN 1 AND 256),
  source_ref TEXT NOT NULL CHECK (length(source_ref) BETWEEN 1 AND 256),
  occurred_at INTEGER NOT NULL CHECK (occurred_at >= 0),
  receipt_bytes INTEGER NOT NULL CHECK (receipt_bytes BETWEEN 1 AND 16384),
  receipt_json TEXT NOT NULL CHECK (length(receipt_json) > 0),
  UNIQUE (occurred_at, receipt_id)
) STRICT;
CREATE INDEX IF NOT EXISTS execution_decision_facts_context_occurred_idx
  ON execution_decision_facts (context_id, occurred_at, receipt_id);
CREATE INDEX IF NOT EXISTS execution_decision_facts_run_occurred_idx
  ON execution_decision_facts (run_id, occurred_at, receipt_id);
`;
function decisionDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureExecutionDecisionFactSchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(EXECUTION_DECISION_FACT_SCHEMA_SQL);
	}, options, { operationLabel: "audit.execution-decision.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function parseDecisionRow(row) {
	const bytes = normalizeSqliteNumber(row.receipt_bytes);
	const occurredAt = normalizeSqliteNumber(row.occurred_at);
	if (typeof row.receipt_json !== "string" || bytes === void 0 || Buffer.byteLength(row.receipt_json, "utf8") !== bytes || bytes > EXECUTION_DECISION_FACT_MAX_BYTES || occurredAt === void 0) throw new Error("invalid decision fact payload bounds");
	const parsed = JSON.parse(row.receipt_json);
	if (!validateDecisionReceiptV1(parsed)) throw new Error("invalid decision fact payload schema");
	if (parsed.receiptId !== row.receipt_id || parsed.contextId !== row.context_id || parsed.executionId !== row.execution_id || parsed.runId !== row.run_id || (parsed.actionId ?? null) !== row.action_id || parsed.action.family !== row.action_family || parsed.decision.outcome !== row.decision_outcome || parsed.decision.reasonCode !== row.reason_code || parsed.enforcement.coverageState !== row.coverage_state || parsed.source.owner !== row.owner || parsed.source.recordRef !== row.source_ref || parsed.occurredAt !== occurredAt || JSON.stringify(parsed) !== row.receipt_json) throw new Error("decision fact payload disagrees with indexed columns");
	return parsed;
}
function unknownDecisionReceipt(row, reasonCode, missingEvidence) {
	return {
		schemaVersion: 1,
		receiptId: row.receipt_id,
		contextId: row.context_id,
		executionId: row.execution_id,
		runId: row.run_id,
		...row.action_id ? { actionId: row.action_id } : {},
		occurredAt: normalizeSqliteNumber(row.occurred_at) ?? 0,
		action: {
			family: row.action_family,
			operation: "decision"
		},
		decision: {
			outcome: "unknown",
			reasonCode
		},
		enforcement: {
			coverageState: "unknown",
			policyRefs: [],
			grantRefs: [],
			contextFieldsUsed: []
		},
		source: {
			owner: row.owner,
			recordRef: row.source_ref,
			decisionBoundary: "execution-decision-facts"
		},
		missingEvidence: [missingEvidence],
		remediation: [{
			code: "inspect_state_integrity",
			text: "Run openclaw doctor and inspect the shared state database before trusting this decision."
		}]
	};
}
function hasExactExecutionContext(db, context) {
	if (!tableExists(db, "execution_identity_contexts")) return false;
	return Boolean(executeSqliteQueryTakeFirstSync(db, decisionDb(db).selectFrom("execution_identity_contexts").select("context_id").where("context_id", "=", context.contextId).where("execution_id", "=", context.executionId).where("run_id", "=", context.runId)));
}
function deleteExpiredDecisionFacts(db, now, limit) {
	const kysely = decisionDb(db);
	const expiredIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").where("occurred_at", "<", now - EXECUTION_DECISION_FACT_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("execution_decision_facts").where("receipt_id", "in", expiredIds));
}
function pruneDecisionFactsAfterInsert(db, now, limits) {
	const kysely = decisionDb(db);
	const expired = deleteExpiredDecisionFacts(db, now, limits.pruneBatchRows);
	const remaining = Math.max(0, limits.pruneBatchRows - Number(expired.numAffectedRows ?? 0n));
	if (remaining === 0) return;
	const retainedIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").orderBy("occurred_at", "desc").orderBy("receipt_id", "desc").limit(limits.maxRows);
	const overflowIds = kysely.selectFrom("execution_decision_facts").select("receipt_id").where("receipt_id", "not in", retainedIds).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").limit(remaining);
	executeSqliteQuerySync(db, kysely.deleteFrom("execution_decision_facts").where("receipt_id", "in", overflowIds));
}
/** Record one immutable fact only when its action owner has no native durable record. */
function recordExecutionDecisionFact(receipt, options = {}) {
	if (!validateDecisionReceiptV1(receipt)) throw new Error("execution decision fact must match DecisionReceiptV1");
	if (receipt.source.owner === "operator_approvals") throw new Error("operator approvals must be read from their owner-native table");
	if (!hasExactExecutionContext(openOpenClawStateDatabase(options).db, receipt)) throw new Error("execution decision fact requires an exact retained execution context");
	const receiptJson = JSON.stringify(receipt);
	const receiptBytes = Buffer.byteLength(receiptJson, "utf8");
	if (receiptBytes > EXECUTION_DECISION_FACT_MAX_BYTES) throw new Error("execution decision fact exceeds 16 KiB");
	ensureExecutionDecisionFactSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = decisionDb(db);
		if (!hasExactExecutionContext(db, receipt)) throw new Error("execution decision fact requires an exact retained execution context");
		const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("execution_decision_facts").select(["receipt_json"]).where("receipt_id", "=", receipt.receiptId));
		if (existing) {
			if (existing.receipt_json !== receiptJson) throw new Error("execution decision fact id conflicts with retained state");
			return "existing";
		}
		executeSqliteQuerySync(db, kysely.insertInto("execution_decision_facts").values({
			receipt_id: receipt.receiptId,
			context_id: receipt.contextId,
			execution_id: receipt.executionId,
			run_id: receipt.runId,
			action_id: receipt.actionId ?? null,
			action_family: receipt.action.family,
			decision_outcome: receipt.decision.outcome,
			coverage_state: receipt.enforcement.coverageState,
			reason_code: receipt.decision.reasonCode,
			owner: receipt.source.owner,
			source_ref: receipt.source.recordRef,
			occurred_at: receipt.occurredAt,
			receipt_bytes: receiptBytes,
			receipt_json: receiptJson
		}));
		pruneDecisionFactsAfterInsert(db, options.now ?? Date.now(), options.limits ?? {
			maxRows: EXECUTION_DECISION_FACT_MAX_ROWS,
			pruneBatchRows: EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS
		});
		return "inserted";
	}, options, { operationLabel: "audit.execution-decision.record" });
}
function retainedDecisionFactsForContextQuery(db, contextId, now) {
	return decisionDb(db).selectFrom("execution_decision_facts").where("context_id", "=", contextId).where("occurred_at", ">=", now - EXECUTION_DECISION_FACT_RETENTION_MS);
}
function executionDecisionRowId() {
	return sql`execution_decision_facts.rowid`;
}
function executionDecisionPayloadBytes() {
	return sql`length(CAST(execution_decision_facts.receipt_json AS BLOB))`;
}
function executionDecisionBoundedPayload() {
	return sql`CASE WHEN length(CAST(execution_decision_facts.receipt_json AS BLOB)) <= ${EXECUTION_DECISION_FACT_MAX_BYTES} THEN execution_decision_facts.receipt_json ELSE NULL END`;
}
function executionDecisionSelectorId(row) {
	const rowId = normalizeSqliteNumber(row.receipt_rowid);
	if (rowId === void 0 || rowId < 1) throw new Error("invalid execution decision fact rowid");
	return `${EXECUTION_DECISION_SELECTOR_PREFIX}${rowId}`;
}
function retainedDecisionFactMetadata(params) {
	const boundary = params.after ? executeSqliteQueryTakeFirstSync(params.db, decisionDb(params.db).selectFrom("execution_decision_facts").select(["receipt_id", "occurred_at"]).where(executionDecisionRowId(), "=", params.after.rowId).where("context_id", "=", params.contextId).where("occurred_at", "=", params.after.occurredAt)) : void 0;
	if (params.after && !boundary) throw new Error("execution decision cursor is no longer retained");
	return executeSqliteQuerySync(params.db, retainedDecisionFactsForContextQuery(params.db, params.contextId, params.now).$if(boundary !== void 0, (query) => query.where((eb) => eb.or([eb("occurred_at", ">", boundary.occurred_at), eb.and([eb("occurred_at", "=", boundary.occurred_at), eb("receipt_id", ">", boundary.receipt_id)])]))).select([
		"receipt_id",
		"context_id",
		"execution_id",
		"run_id",
		"action_id",
		"action_family",
		"decision_outcome",
		"coverage_state",
		"reason_code",
		"owner",
		"source_ref",
		"occurred_at",
		"receipt_bytes"
	]).select([
		executionDecisionRowId().as("receipt_rowid"),
		executionDecisionPayloadBytes().as("payload_bytes"),
		executionDecisionBoundedPayload().as("bounded_receipt_json")
	]).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").$if(params.offset !== void 0, (query) => query.offset(params.offset)).limit(params.limit)).rows;
}
function projectDecisionRow(row, context) {
	try {
		const receipt = parseDecisionRow(row);
		return receipt.contextId === context.contextId && receipt.executionId === context.executionId && receipt.runId === context.runId ? receipt : unknownDecisionReceipt(row, "decision_fact_execution_link_mismatch", "decision.execution_link");
	} catch {
		return unknownDecisionReceipt(row, "decision_fact_record_corrupt", "decision.fact.valid");
	}
}
function projectDecisionMetadata(metadata, context) {
	if (metadata.payload_bytes > EXECUTION_DECISION_FACT_MAX_BYTES) return unknownDecisionReceipt(metadata, "decision_fact_payload_bounded", "decision.fact.payload_bounded");
	return typeof metadata.bounded_receipt_json === "string" ? projectDecisionRow({
		...metadata,
		receipt_json: metadata.bounded_receipt_json
	}, context) : unknownDecisionReceipt(metadata, "decision_fact_record_corrupt", "decision.fact.valid");
}
/** Summarize at most 128 owner rows; the 129th makes coverage explicitly unknown. */
function summarizeExecutionDecisionFactsForContext(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "execution_decision_facts")) return {
			count: 0,
			missingEvidence: []
		};
		const metadataRows = retainedDecisionFactMetadata({
			db,
			contextId: params.context.contextId,
			now: params.now ?? Date.now(),
			limit: 129
		});
		const count = metadataRows.length;
		if (count === 0) return {
			count: 0,
			missingEvidence: []
		};
		if (count > EXECUTION_DECISION_FACT_SUMMARY_MAX_ROWS) return {
			count,
			coverageState: "unknown",
			missingEvidence: ["decision.fact.summary_bounded"]
		};
		const receipts = metadataRows.map((metadata) => projectDecisionMetadata(metadata, params.context));
		const coverage = new Set(receipts.map((receipt) => receipt.enforcement.coverageState));
		return {
			count,
			...coverage.has("unsupported") ? { coverageState: "unsupported" } : coverage.has("unknown") ? { coverageState: "unknown" } : coverage.has("enforced") ? { coverageState: "enforced" } : {},
			missingEvidence: [...new Set(receipts.flatMap((receipt) => receipt.missingEvidence))].toSorted()
		};
	}, params.database) ?? {
		count: 0,
		missingEvidence: []
	};
}
function hasExecutionDecisionFactsForRun(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "execution_decision_facts")) return false;
		return Boolean(executeSqliteQueryTakeFirstSync(db, decisionDb(db).selectFrom("execution_decision_facts").select("receipt_id").where("run_id", "=", params.runId).where("occurred_at", ">=", (params.now ?? Date.now()) - EXECUTION_DECISION_FACT_RETENTION_MS).limit(1)));
	}, params.database) ?? false;
}
function pageExecutionDecisionFactsForContext(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "execution_decision_facts")) return {
			entries: [],
			receipts: []
		};
		const metadataRows = retainedDecisionFactMetadata({
			db,
			contextId: params.context.contextId,
			now: params.now ?? Date.now(),
			after: params.after,
			offset: params.offset,
			limit: params.limit + 1
		});
		const pageMetadata = metadataRows.slice(0, params.limit);
		const entries = pageMetadata.map((metadata) => ({
			receipt: projectDecisionMetadata(metadata, params.context),
			selectorId: executionDecisionSelectorId(metadata)
		}));
		const last = pageMetadata.at(-1);
		return {
			entries,
			receipts: entries.map((entry) => entry.receipt),
			...metadataRows.length > params.limit && last ? { nextCursor: {
				occurredAt: normalizeSqliteNumber(last.occurred_at) ?? 0,
				rowId: last.receipt_rowid
			} } : {}
		};
	}, params.database) ?? {
		entries: [],
		receipts: []
	};
}
/** Delete one bounded batch without creating the optional table. */
function pruneExpiredExecutionDecisionFacts(params = {}) {
	const databaseOptions = params.database ?? {};
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "execution_decision_facts")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => Number(deleteExpiredDecisionFacts(db, params.now ?? Date.now(), EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS).numAffectedRows ?? 0n), {
		...databaseOptions,
		database
	}, { operationLabel: "audit.execution-decision.maintenance" });
}
//#endregion
export { summarizeExecutionDecisionFactsForContext as a, pseudonymizeAuditIdentity as c, recordExecutionDecisionFact as i, pseudonymizeExecutionIdentityRef as l, pageExecutionDecisionFactsForContext as n, clearAuditIdentityKeyCacheForDatabase as o, pruneExpiredExecutionDecisionFacts as r, loadOrCreateAuditIdentityKey as s, hasExecutionDecisionFactsForRun as t };
