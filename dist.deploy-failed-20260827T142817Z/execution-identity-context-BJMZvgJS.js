import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, Rt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { Vt as validateExecutionIdentityContextV1, gt as validateDecisionReceiptV1 } from "./src-Bo4ezI_n.js";
import { d as pageOperatorApprovalReceiptsForRun, m as summarizeOperatorApprovalReceiptsForRun, s as hasOperatorApprovalReceiptsForRun } from "./operator-approval-store-CDAeuc7d.js";
import { t as parsePositiveAuditCursor } from "./audit-cursor-D7Z3YEc0.js";
import { a as parseExecutionIdentityAdmissionEnvelope, s as parseExecutionIdentityAdmissionWork } from "./execution-identity-admission-qTUfCaTZ.js";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { sql } from "kysely";
//#region src/audit/audit-event-types.ts
const AUDIT_INBOUND_MESSAGE_COMPLETED_REASONS = [
	"fast_abort",
	"plugin_bound_handled",
	"plugin_bound_unavailable",
	"plugin_bound_declined",
	"before_dispatch_handled",
	"acp_dispatch_completed",
	"acp_dispatch_empty",
	"active_run_injected"
];
const AUDIT_INBOUND_MESSAGE_SKIPPED_REASONS = [
	"duplicate",
	"reply_operation_active",
	"reply_operation_aborted",
	"acp_dispatch_aborted"
];
const AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS = [
	"cancelled_by_message_sending_hook",
	"cancelled_by_reply_payload_sending_hook",
	"empty_after_message_sending_hook",
	"empty_after_reply_payload_sending_hook",
	"no_visible_payload"
];
//#endregion
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
//#region src/audit/audit-event-store.ts
/** SQLite persistence and stable cursor queries for metadata-only audit events. */
const AUDIT_EVENT_RETENTION_MS = 720 * 60 * 6e4;
const AUDIT_EVENT_MAX_ROWS = 1e5;
const AUDIT_EVENT_PRUNE_BATCH_ROWS = 1024;
const auditEventRowCounts = /* @__PURE__ */ new WeakMap();
function getAuditKysely(db) {
	return getNodeSqliteKysely(db);
}
const RUN_ACTIONS = ["agent.run.started", "agent.run.finished"];
const TOOL_ACTIONS = ["tool.action.started", "tool.action.finished"];
const CONVERSATION_KINDS = [
	"direct",
	"group",
	"channel",
	"unknown"
];
const DELIVERY_KINDS = [
	"text",
	"media",
	"other"
];
const FAILURE_STAGES = [
	"platform_send",
	"queue",
	"unknown"
];
const AUDIT_HMAC_REF_RE = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const MESSAGE_COLUMNS = [
	"direction",
	"channel",
	"conversation_kind",
	"message_outcome",
	"reason_code",
	"delivery_kind",
	"failure_stage",
	"duration_ms",
	"result_count",
	"account_ref",
	"conversation_ref",
	"message_ref",
	"target_ref"
];
function corruptAuditRow(row, problem) {
	const sequence = normalizeSqliteNumber(row.sequence);
	const location = sequence === void 0 ? "" : ` ${sequence}`;
	throw new Error(`corrupt audit event row${location}: ${problem}`);
}
function requiredInteger(row, value, field, minimum) {
	const normalized = normalizeSqliteNumber(value);
	if (normalized === void 0 || !Number.isSafeInteger(normalized) || normalized < minimum) corruptAuditRow(row, `invalid ${field}`);
	return normalized;
}
function optionalInteger(row, value, field, minimum) {
	if (value === null) return;
	return requiredInteger(row, value, field, minimum);
}
function requiredText(row, value, field) {
	if (typeof value !== "string" || value.length === 0) corruptAuditRow(row, `invalid ${field}`);
	return value;
}
function optionalText(row, value, field) {
	if (value === null || value === void 0) return;
	return requiredText(row, value, field);
}
function requiredEnum(row, value, field, allowed) {
	for (const candidate of allowed) if (value === candidate) return candidate;
	return corruptAuditRow(row, `invalid ${field}`);
}
function optionalEnum(row, value, field, allowed) {
	if (value === null || value === void 0) return;
	return requiredEnum(row, value, field, allowed);
}
function requiredHmacRef(row, value, field) {
	const ref = requiredText(row, value, field);
	if (!AUDIT_HMAC_REF_RE.test(ref)) corruptAuditRow(row, `invalid ${field}`);
	return ref;
}
function optionalHmacRef(row, value, field) {
	if (value === null || value === void 0) return;
	return requiredHmacRef(row, value, field);
}
function requireNull(row, field) {
	if (row[field] !== null) corruptAuditRow(row, `unexpected ${field}`);
}
function requireNullColumns(row, fields) {
	for (const field of fields) requireNull(row, field);
}
function parseAuditRecordBase(row) {
	const schemaVersion = requiredInteger(row, row.schema_version, "schemaVersion", 1);
	if (schemaVersion !== 1) corruptAuditRow(row, `unsupported schemaVersion ${schemaVersion}`);
	return {
		schemaVersion,
		sequence: requiredInteger(row, row.sequence, "sequence", 1),
		eventId: requiredText(row, row.event_id, "eventId"),
		sourceSequence: requiredInteger(row, row.source_sequence, "sourceSequence", 1),
		occurredAt: requiredInteger(row, row.occurred_at, "occurredAt", 0),
		redaction: "metadata_only"
	};
}
function parseAgentRecordFields(row) {
	requireNullColumns(row, MESSAGE_COLUMNS);
	return {
		...parseAuditRecordBase(row),
		actorType: requiredEnum(row, row.actor_type, "actorType", ["agent", "system"]),
		actorId: requiredText(row, row.actor_id, "actorId"),
		agentId: requiredText(row, row.agent_id, "agentId"),
		...optionalText(row, row.session_key, "sessionKey") !== void 0 ? { sessionKey: requiredText(row, row.session_key, "sessionKey") } : {},
		...optionalText(row, row.session_id, "sessionId") !== void 0 ? { sessionId: requiredText(row, row.session_id, "sessionId") } : {},
		runId: requiredText(row, row.run_id, "runId")
	};
}
function parseAgentRunRow(row) {
	requireNull(row, "tool_call_id");
	requireNull(row, "tool_name");
	const common = {
		...parseAgentRecordFields(row),
		kind: "agent_run"
	};
	const action = requiredEnum(row, row.action, "action", RUN_ACTIONS);
	if (action === "agent.run.started") {
		requiredEnum(row, row.status, "status", ["started"]);
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "started"
		};
	}
	if (row.status === "succeeded") {
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "succeeded"
		};
	}
	const terminal = row.status === "failed" ? {
		status: "failed",
		errorCode: "run_failed"
	} : row.status === "cancelled" ? {
		status: "cancelled",
		errorCode: "run_cancelled"
	} : row.status === "timed_out" ? {
		status: "timed_out",
		errorCode: "run_timed_out"
	} : row.status === "blocked" ? {
		status: "blocked",
		errorCode: "run_blocked"
	} : corruptAuditRow(row, "invalid run terminal status");
	requiredEnum(row, row.error_code, "errorCode", [terminal.errorCode]);
	return {
		...common,
		action,
		...terminal
	};
}
function parseToolActionRow(row) {
	const toolCallId = optionalText(row, row.tool_call_id, "toolCallId");
	const toolName = optionalText(row, row.tool_name, "toolName");
	const common = {
		...parseAgentRecordFields(row),
		kind: "tool_action",
		...toolCallId ? { toolCallId } : {},
		...toolName ? { toolName } : {}
	};
	const action = requiredEnum(row, row.action, "action", TOOL_ACTIONS);
	if (action === "tool.action.started") {
		requiredEnum(row, row.status, "status", ["started"]);
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "started"
		};
	}
	if (row.status === "succeeded") {
		requireNull(row, "error_code");
		return {
			...common,
			action,
			status: "succeeded"
		};
	}
	const terminal = row.status === "failed" ? {
		status: "failed",
		errorCode: "tool_failed"
	} : row.status === "cancelled" ? {
		status: "cancelled",
		errorCode: "tool_cancelled"
	} : row.status === "timed_out" ? {
		status: "timed_out",
		errorCode: "tool_timed_out"
	} : row.status === "blocked" ? {
		status: "blocked",
		errorCode: "tool_blocked"
	} : row.status === "unknown" ? {
		status: "unknown",
		errorCode: "tool_outcome_unknown"
	} : corruptAuditRow(row, "invalid tool terminal status");
	requiredEnum(row, row.error_code, "errorCode", [terminal.errorCode]);
	return {
		...common,
		action,
		...terminal
	};
}
function parseMessageRecordFields(row) {
	requireNullColumns(row, [
		"session_key",
		"session_id",
		"tool_call_id",
		"tool_name"
	]);
	const agentId = optionalText(row, row.agent_id, "agentId");
	const runId = optionalText(row, row.run_id, "runId");
	const durationMs = optionalInteger(row, row.duration_ms, "durationMs", 0);
	const resultCount = optionalInteger(row, row.result_count, "resultCount", 0);
	const accountRef = optionalHmacRef(row, row.account_ref, "accountRef");
	const conversationRef = optionalHmacRef(row, row.conversation_ref, "conversationRef");
	const messageRef = optionalHmacRef(row, row.message_ref, "messageRef");
	const targetRef = optionalHmacRef(row, row.target_ref, "targetRef");
	return {
		...parseAuditRecordBase(row),
		kind: "message",
		channel: requiredText(row, row.channel, "channel"),
		conversationKind: requiredEnum(row, row.conversation_kind, "conversationKind", CONVERSATION_KINDS),
		...agentId ? { agentId } : {},
		...runId ? { runId } : {},
		...durationMs !== void 0 ? { durationMs } : {},
		...resultCount !== void 0 ? { resultCount } : {},
		...accountRef ? { accountRef } : {},
		...conversationRef ? { conversationRef } : {},
		...messageRef ? { messageRef } : {},
		...targetRef ? { targetRef } : {}
	};
}
function parseInboundMessageRow(row) {
	requiredEnum(row, row.action, "action", ["message.inbound.processed"]);
	requiredEnum(row, row.direction, "direction", ["inbound"]);
	requireNull(row, "delivery_kind");
	requireNull(row, "failure_stage");
	const actorType = requiredEnum(row, row.actor_type, "actorType", ["channel_sender", "system"]);
	const actorId = actorType === "channel_sender" ? requiredHmacRef(row, row.actor_id, "actorId") : requiredText(row, row.actor_id, "actorId");
	const common = {
		...parseMessageRecordFields(row),
		action: "message.inbound.processed",
		direction: "inbound",
		actorType,
		actorId
	};
	if (row.status === "succeeded") {
		requiredEnum(row, row.message_outcome, "outcome", ["completed"]);
		requireNull(row, "error_code");
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", AUDIT_INBOUND_MESSAGE_COMPLETED_REASONS);
		return {
			...common,
			status: "succeeded",
			outcome: "completed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (row.status === "blocked") {
		requiredEnum(row, row.message_outcome, "outcome", ["skipped"]);
		requireNull(row, "error_code");
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", AUDIT_INBOUND_MESSAGE_SKIPPED_REASONS);
		return {
			...common,
			status: "blocked",
			outcome: "skipped",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (row.status === "failed") {
		requiredEnum(row, row.message_outcome, "outcome", ["failed"]);
		requiredEnum(row, row.error_code, "errorCode", ["message_processing_failed"]);
		const reasonCode = optionalEnum(row, row.reason_code, "reasonCode", ["acp_dispatch_failed", "plugin_bound_error"]);
		return {
			...common,
			status: "failed",
			outcome: "failed",
			errorCode: "message_processing_failed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	return corruptAuditRow(row, "invalid inbound status");
}
function parseOutboundMessageRow(row) {
	requiredEnum(row, row.action, "action", ["message.outbound.finished"]);
	requiredEnum(row, row.direction, "direction", ["outbound"]);
	const actorType = requiredEnum(row, row.actor_type, "actorType", ["agent", "system"]);
	const actorId = requiredText(row, row.actor_id, "actorId");
	const common = {
		...parseMessageRecordFields(row),
		action: "message.outbound.finished",
		direction: "outbound",
		actorType,
		actorId
	};
	if (row.status === "succeeded") {
		const deliveryKind = optionalEnum(row, row.delivery_kind, "deliveryKind", DELIVERY_KINDS);
		requiredEnum(row, row.message_outcome, "outcome", ["sent"]);
		requireNullColumns(row, [
			"error_code",
			"reason_code",
			"failure_stage"
		]);
		return {
			...common,
			status: "succeeded",
			outcome: "sent",
			...deliveryKind ? { deliveryKind } : {}
		};
	}
	if (row.status === "blocked") {
		requireNull(row, "delivery_kind");
		requiredEnum(row, row.message_outcome, "outcome", ["suppressed"]);
		requireNullColumns(row, ["error_code", "failure_stage"]);
		const reasonCode = requiredEnum(row, row.reason_code, "reasonCode", AUDIT_OUTBOUND_MESSAGE_SUPPRESSED_REASONS);
		return {
			...common,
			status: "blocked",
			outcome: "suppressed",
			reasonCode
		};
	}
	if (row.status === "failed") {
		const deliveryKind = optionalEnum(row, row.delivery_kind, "deliveryKind", DELIVERY_KINDS);
		requiredEnum(row, row.message_outcome, "outcome", ["failed"]);
		requireNull(row, "reason_code");
		const errorCode = requiredEnum(row, row.error_code, "errorCode", ["message_delivery_failed", "message_delivery_partial_failure"]);
		const failureStage = requiredEnum(row, row.failure_stage, "failureStage", FAILURE_STAGES);
		return {
			...common,
			status: "failed",
			outcome: "failed",
			errorCode,
			failureStage,
			...deliveryKind ? { deliveryKind } : {}
		};
	}
	if (row.status === "unknown") {
		requireNull(row, "delivery_kind");
		requiredEnum(row, row.message_outcome, "outcome", ["unknown"]);
		requireNullColumns(row, ["error_code", "reason_code"]);
		const failureStage = requiredEnum(row, row.failure_stage, "failureStage", FAILURE_STAGES);
		return {
			...common,
			status: "unknown",
			outcome: "unknown",
			failureStage
		};
	}
	return corruptAuditRow(row, "invalid outbound status");
}
function rowToAuditEvent(row) {
	if (row.kind === "agent_run") return parseAgentRunRow(row);
	if (row.kind === "tool_action") return parseToolActionRow(row);
	if (row.kind !== "message") corruptAuditRow(row, "invalid kind");
	if (row.direction === "inbound") return parseInboundMessageRow(row);
	if (row.direction === "outbound") return parseOutboundMessageRow(row);
	return corruptAuditRow(row, "invalid message direction");
}
function projectMessageIdentities(db, input) {
	const identity = loadOrCreateAuditIdentityKey(db);
	const conversationId = input.conversationId ?? (input.direction === "outbound" ? input.targetId : void 0);
	const ref = (kind, value) => pseudonymizeAuditIdentity({
		identity,
		kind,
		channel: input.channel,
		...kind !== "account" && input.accountId !== void 0 ? { accountId: input.accountId } : {},
		...kind === "message" && conversationId !== void 0 ? { conversationId } : {},
		value
	});
	return {
		actorId: input.actorType === "channel_sender" ? ref("actor", input.actorId) : input.actorId,
		accountRef: ref("account", input.accountId),
		conversationRef: ref("conversation", conversationId),
		messageRef: ref("message", input.messageId),
		targetRef: ref("target", input.targetId)
	};
}
function bindAuditEvent(db, input) {
	const message = input.kind === "message" ? projectMessageIdentities(db, input) : void 0;
	return {
		event_id: randomUUID(),
		source_id: input.sourceId,
		source_sequence: input.sourceSequence,
		schema_version: 1,
		occurred_at: input.occurredAt,
		kind: input.kind,
		action: input.action,
		status: input.status,
		error_code: input.errorCode ?? null,
		actor_type: input.actorType,
		actor_id: message?.actorId ?? input.actorId,
		agent_id: input.agentId ?? null,
		session_key: input.kind === "message" ? null : input.sessionKey ?? null,
		session_id: input.kind === "message" ? null : input.sessionId ?? null,
		run_id: input.runId ?? null,
		tool_call_id: input.kind === "tool_action" ? input.toolCallId ?? null : null,
		tool_name: input.kind === "tool_action" ? input.toolName : null,
		direction: input.kind === "message" ? input.direction : null,
		channel: input.kind === "message" ? input.channel : null,
		conversation_kind: input.kind === "message" ? input.conversationKind : null,
		message_outcome: input.kind === "message" ? input.outcome : null,
		reason_code: input.kind === "message" ? input.reasonCode ?? null : null,
		delivery_kind: input.kind === "message" ? input.deliveryKind ?? null : null,
		failure_stage: input.kind === "message" ? input.failureStage ?? null : null,
		duration_ms: input.kind === "message" ? input.durationMs ?? null : null,
		result_count: input.kind === "message" ? input.resultCount ?? null : null,
		account_ref: message?.accountRef ?? null,
		conversation_ref: message?.conversationRef ?? null,
		message_ref: message?.messageRef ?? null,
		target_ref: message?.targetRef ?? null
	};
}
function countAuditEvents(db) {
	return normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(db, getAuditKysely(db).selectFrom("audit_events").select((expression) => expression.fn.countAll().as("count")))?.count ?? null) ?? 0;
}
function pruneAuditEventsAfterInsert(db, now, limits = {
	maxRows: AUDIT_EVENT_MAX_ROWS,
	pruneBatchRows: AUDIT_EVENT_PRUNE_BATCH_ROWS
}) {
	const kysely = getAuditKysely(db);
	const expired = executeSqliteQuerySync(db, kysely.deleteFrom("audit_events").where("occurred_at", "<", now - AUDIT_EVENT_RETENTION_MS));
	const cachedCount = auditEventRowCounts.get(db);
	let rowCount = cachedCount === void 0 ? countAuditEvents(db) : Math.max(0, cachedCount + 1 - Number(expired.numAffectedRows ?? 0n));
	if (rowCount <= limits.maxRows) {
		auditEventRowCounts.set(db, rowCount);
		return;
	}
	const retainedRows = Math.max(0, limits.maxRows - limits.pruneBatchRows);
	const overflowRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("audit_events").select("sequence").orderBy("sequence", "desc").offset(retainedRows).limit(1));
	const sequenceCutoff = overflowRow ? normalizeSqliteNumber(overflowRow.sequence) : void 0;
	if (sequenceCutoff !== void 0) {
		const pruned = executeSqliteQuerySync(db, kysely.deleteFrom("audit_events").where("sequence", "<=", sequenceCutoff));
		rowCount = Math.max(0, rowCount - Number(pruned.numAffectedRows ?? 0n));
	}
	auditEventRowCounts.set(db, rowCount);
}
/** Persist one projected event idempotently and prune fixed retention bounds. */
function recordAuditEvent(input, options = {}) {
	let countCacheDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			countCacheDatabase = db;
			const insert = executeSqliteQuerySync(db, getAuditKysely(db).insertInto("audit_events").values(bindAuditEvent(db, input)).onConflict((conflict) => conflict.column("source_id").doNothing()));
			if (insert.insertId === void 0) return;
			const insertedSequence = Number(insert.insertId);
			if (!Number.isSafeInteger(insertedSequence) || insertedSequence < 1) throw new Error("audit event sequence is outside the supported integer range");
			pruneAuditEventsAfterInsert(db, Date.now());
			const row = executeSqliteQueryTakeFirstSync(db, getAuditKysely(db).selectFrom("audit_events").selectAll().where("sequence", "=", insertedSequence));
			return row ? rowToAuditEvent(row) : void 0;
		}, options);
	} catch (error) {
		if (countCacheDatabase) {
			auditEventRowCounts.delete(countCacheDatabase);
			clearAuditIdentityKeyCacheForDatabase(countCacheDatabase);
		}
		throw error;
	}
}
/** List newest-first records using a stable sequence cursor. */
function listAuditEvents(params) {
	const { db } = openOpenClawStateDatabase(params.database);
	const filters = params.filters ?? {};
	const retainedAfter = (params.now ?? Date.now()) - AUDIT_EVENT_RETENTION_MS;
	let query = getAuditKysely(db).selectFrom("audit_events").selectAll().where("occurred_at", ">=", retainedAfter);
	if (params.cursor !== void 0) query = query.where("sequence", "<", params.cursor);
	if (filters.agentId) query = query.where("agent_id", "=", filters.agentId);
	if (filters.sessionKey) query = query.where("session_key", "=", filters.sessionKey);
	if (filters.runId) query = query.where("run_id", "=", filters.runId);
	if (filters.kind) query = query.where("kind", "=", filters.kind);
	else if (filters.includeMessages !== true) query = query.where("kind", "!=", "message");
	if (filters.status) query = query.where("status", "=", filters.status);
	if (filters.direction) query = query.where("direction", "=", filters.direction);
	if (filters.channel) query = query.where("channel", "=", filters.channel);
	if (filters.after !== void 0) query = query.where("occurred_at", ">=", filters.after);
	if (filters.before !== void 0) query = query.where("occurred_at", "<=", filters.before);
	const rows = executeSqliteQuerySync(db, query.orderBy("sequence", "desc").limit(params.limit + 1)).rows;
	const hasMore = rows.length > params.limit;
	const events = (hasMore ? rows.slice(0, params.limit) : rows).map(rowToAuditEvent);
	return {
		events,
		...hasMore && events.length > 0 ? { nextCursor: events[events.length - 1]?.sequence } : {}
	};
}
/** Delete expired metadata during Gateway startup and periodic worker maintenance. */
function pruneExpiredAuditEvents(params = {}) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getAuditKysely(db).deleteFrom("audit_events").where("occurred_at", "<", (params.now ?? Date.now()) - AUDIT_EVENT_RETENTION_MS));
		auditEventRowCounts.delete(db);
	}, params.database);
}
//#endregion
//#region src/audit/execution-decision-facts.ts
const EXECUTION_DECISION_FACT_MAX_BYTES = 16 * 1024;
const EXECUTION_DECISION_FACT_RETENTION_MS = 720 * 60 * 6e4;
const EXECUTION_DECISION_FACT_MAX_ROWS = 25e4;
const EXECUTION_DECISION_FACT_PRUNE_BATCH_ROWS = 1024;
const EXECUTION_DECISION_FACT_SUMMARY_MAX_ROWS = 128;
const ensuredDatabases$1 = /* @__PURE__ */ new WeakSet();
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
	if (ensuredDatabases$1.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(EXECUTION_DECISION_FACT_SCHEMA_SQL);
	}, options, { operationLabel: "audit.execution-decision.schema.ensure" });
	ensuredDatabases$1.add(database.db);
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
	]).select([executionDecisionRowId().as("receipt_rowid"), executionDecisionPayloadBytes().as("payload_bytes")]).orderBy("occurred_at", "asc").orderBy("receipt_id", "asc").$if(params.offset !== void 0, (query) => query.offset(params.offset)).limit(params.limit)).rows;
}
function retainedDecisionFactRowsById(db, ids) {
	if (ids.length === 0) return /* @__PURE__ */ new Map();
	const rows = executeSqliteQuerySync(db, decisionDb(db).selectFrom("execution_decision_facts").selectAll().where("receipt_id", "in", [...ids]).where(executionDecisionPayloadBytes(), "<=", EXECUTION_DECISION_FACT_MAX_BYTES)).rows;
	return new Map(rows.map((row) => [row.receipt_id, row]));
}
function projectDecisionRow(row, context) {
	try {
		const receipt = parseDecisionRow(row);
		return receipt.contextId === context.contextId && receipt.executionId === context.executionId && receipt.runId === context.runId ? receipt : unknownDecisionReceipt(row, "decision_fact_execution_link_mismatch", "decision.execution_link");
	} catch {
		return unknownDecisionReceipt(row, "decision_fact_record_corrupt", "decision.fact.valid");
	}
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
		const rowsById = retainedDecisionFactRowsById(db, metadataRows.filter((row) => row.payload_bytes <= EXECUTION_DECISION_FACT_MAX_BYTES).map((row) => row.receipt_id));
		const receipts = metadataRows.map((metadata) => {
			if (metadata.payload_bytes > EXECUTION_DECISION_FACT_MAX_BYTES) return unknownDecisionReceipt(metadata, "decision_fact_payload_bounded", "decision.fact.payload_bounded");
			const row = rowsById.get(metadata.receipt_id);
			return row ? projectDecisionRow(row, params.context) : unknownDecisionReceipt(metadata, "decision_fact_record_corrupt", "decision.fact.valid");
		});
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
		if (!tableExists(db, "execution_decision_facts")) return { receipts: [] };
		const metadataRows = retainedDecisionFactMetadata({
			db,
			contextId: params.context.contextId,
			now: params.now ?? Date.now(),
			after: params.after,
			offset: params.offset,
			limit: params.limit + 1
		});
		const pageMetadata = metadataRows.slice(0, params.limit);
		const rowsById = retainedDecisionFactRowsById(db, pageMetadata.filter((row) => row.payload_bytes <= EXECUTION_DECISION_FACT_MAX_BYTES).map((row) => row.receipt_id));
		const receipts = pageMetadata.map((metadata) => {
			if (metadata.payload_bytes > EXECUTION_DECISION_FACT_MAX_BYTES) return unknownDecisionReceipt(metadata, "decision_fact_payload_bounded", "decision.fact.payload_bounded");
			const row = rowsById.get(metadata.receipt_id);
			return row ? projectDecisionRow(row, params.context) : unknownDecisionReceipt(metadata, "decision_fact_record_corrupt", "decision.fact.valid");
		});
		const last = pageMetadata.at(-1);
		return {
			receipts,
			...metadataRows.length > params.limit && last ? { nextCursor: {
				occurredAt: normalizeSqliteNumber(last.occurred_at) ?? 0,
				rowId: last.receipt_rowid
			} } : {}
		};
	}, params.database) ?? { receipts: [] };
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
//#region src/audit/execution-decision-receipts.ts
const MAX_AGGREGATE_MISSING_EVIDENCE = 16;
const MISSING_EVIDENCE_TRUNCATED = "decision.missing_evidence_truncated";
var ExecutionDecisionCursorError = class extends Error {
	constructor(message = "invalid execution decision cursor") {
		super(message);
		this.name = "ExecutionDecisionCursorError";
	}
};
function parseDecisionCursor(value) {
	if (value === void 0) return;
	const offset = parsePositiveAuditCursor(value);
	if (offset !== null && offset !== void 0) return { offset };
	const match = /^([ag]):(0|[1-9]\d*):(0|[1-9]\d*)$/.exec(value);
	if (!match) return null;
	const occurredAt = Number(match[2]);
	const rowId = Number(match[3]);
	if (!Number.isSafeInteger(occurredAt) || !Number.isSafeInteger(rowId)) return null;
	return {
		stage: match[1] === "a" ? "approval" : "generic",
		...occurredAt === 0 && rowId === 0 ? {} : { after: {
			occurredAt,
			rowId
		} }
	};
}
function isExecutionDecisionCursor(value) {
	return parseDecisionCursor(value) !== null;
}
function formatDecisionCursor(stage, cursor) {
	return `${stage === "approval" ? "a" : "g"}:${cursor?.occurredAt ?? 0}:${cursor?.rowId ?? 0}`;
}
function boundMissingEvidence(values) {
	const unique = [...new Set(values)].toSorted();
	if (unique.length <= MAX_AGGREGATE_MISSING_EVIDENCE) return {
		missingEvidence: unique,
		truncated: false
	};
	return {
		missingEvidence: [...unique.filter((value) => value !== MISSING_EVIDENCE_TRUNCATED).slice(0, MAX_AGGREGATE_MISSING_EVIDENCE - 1), MISSING_EVIDENCE_TRUNCATED].toSorted(),
		truncated: true
	};
}
function admissionDecision(context) {
	return {
		schemaVersion: 1,
		receiptId: `${context.contextId}:admission`,
		contextId: context.contextId,
		executionId: context.executionId,
		runId: context.runId,
		occurredAt: context.createdAt,
		action: {
			family: "run",
			operation: "admission",
			summary: "Run admission was recorded without an identity-aware policy or grant decision."
		},
		decision: {
			outcome: "not-applicable",
			reasonCode: "run_admission_identity_not_evaluated"
		},
		enforcement: {
			coverageState: context.coverageState,
			policyRefs: [],
			grantRefs: [],
			contextFieldsUsed: []
		},
		source: {
			owner: "agent-command",
			recordRef: context.contextId,
			decisionBoundary: "agent-command.run-admission"
		},
		missingEvidence: [...context.missingEvidence],
		remediation: [{
			code: "no_identity_enforcement_claimed",
			text: "Treat this receipt as attribution only; it does not prove authorization."
		}]
	};
}
function presentExecutionDecisionReceipts(params) {
	const cursor = parseDecisionCursor(params.decisionCursor);
	if (cursor === null) throw new ExecutionDecisionCursorError();
	const limit = params.decisionLimit ?? 50;
	const now = params.options.now ?? Date.now();
	const opaqueCursor = cursor && "stage" in cursor ? cursor : void 0;
	const legacyOffset = cursor && "offset" in cursor ? cursor.offset - 1 : void 0;
	const approvalSummary = summarizeOperatorApprovalReceiptsForRun({
		context: {
			contextId: params.context.contextId,
			executionId: params.context.executionId,
			runId: params.context.runId
		},
		nowMs: now,
		databaseOptions: params.options,
		exactCount: legacyOffset !== void 0
	});
	const genericSummary = summarizeExecutionDecisionFactsForContext({
		context: params.context,
		now,
		database: params.options
	});
	const decisions = [];
	let remainingLimit = limit;
	let nextDecisionCursor;
	const approvalOffset = legacyOffset !== void 0 && legacyOffset < approvalSummary.count ? legacyOffset : void 0;
	const genericOffset = legacyOffset === void 0 ? void 0 : Math.max(0, legacyOffset - approvalSummary.count);
	if (cursor === void 0 && remainingLimit > 0) {
		decisions.push(admissionDecision(params.context));
		remainingLimit -= 1;
		if (remainingLimit === 0 && (approvalSummary.count > 0 || genericSummary.count > 0)) nextDecisionCursor = formatDecisionCursor("approval");
	}
	if (remainingLimit > 0 && opaqueCursor?.stage !== "generic" && (legacyOffset === void 0 || approvalOffset !== void 0)) {
		let page;
		try {
			page = pageOperatorApprovalReceiptsForRun({
				context: {
					contextId: params.context.contextId,
					executionId: params.context.executionId,
					runId: params.context.runId
				},
				after: opaqueCursor?.stage === "approval" ? opaqueCursor.after : void 0,
				offset: approvalOffset,
				limit: remainingLimit,
				nowMs: now,
				databaseOptions: params.options
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("cursor is no longer retained")) throw new ExecutionDecisionCursorError("decision cursor is no longer retained; restart inspection without --cursor");
			throw error;
		}
		decisions.push(...page.receipts);
		remainingLimit -= page.receipts.length;
		if (page.nextCursor) nextDecisionCursor = formatDecisionCursor("approval", page.nextCursor);
		else if (remainingLimit === 0 && genericSummary.count > 0) nextDecisionCursor = formatDecisionCursor("generic");
	}
	if (remainingLimit > 0 && nextDecisionCursor?.startsWith("a:") !== true) {
		let page;
		try {
			page = pageExecutionDecisionFactsForContext({
				context: params.context,
				after: opaqueCursor?.stage === "generic" ? opaqueCursor.after : void 0,
				offset: genericOffset,
				limit: remainingLimit,
				now,
				database: params.options
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("cursor is no longer retained")) throw new ExecutionDecisionCursorError("decision cursor is no longer retained; restart inspection without --cursor");
			throw error;
		}
		decisions.push(...page.receipts);
		if (page.nextCursor) nextDecisionCursor = formatDecisionCursor("generic", page.nextCursor);
		else nextDecisionCursor = void 0;
	}
	const ownerCoverage = /* @__PURE__ */ new Set([approvalSummary.coverageState, genericSummary.coverageState]);
	const boundedEvidence = boundMissingEvidence([
		...params.context.missingEvidence,
		...approvalSummary.missingEvidence,
		...genericSummary.missingEvidence
	]);
	const coverageState = boundedEvidence.truncated ? "unknown" : ownerCoverage.has("unsupported") ? "unsupported" : ownerCoverage.has("unknown") ? "unknown" : ownerCoverage.has("enforced") ? "enforced" : params.context.coverageState;
	return {
		schemaVersion: 1,
		run: {
			runId: params.context.runId,
			executionId: params.context.executionId,
			status: "known"
		},
		identity: {
			state: "present",
			context: params.context
		},
		decisions,
		coverage: {
			state: coverageState,
			missingEvidence: boundedEvidence.missingEvidence
		},
		...nextDecisionCursor ? { nextDecisionCursor } : {}
	};
}
//#endregion
//#region src/audit/execution-identity-context-build.ts
const EXECUTION_IDENTITY_CONTEXT_MAX_BYTES$1 = 16 * 1024;
function ensureBoundedExecutionIdentityRef(value, label, maxLength = 256) {
	if (!value || value.length > maxLength) throw new Error(`${label} must be between 1 and ${String(maxLength)} characters`);
	return value;
}
function ensureRawRef(value, label) {
	return ensureBoundedExecutionIdentityRef(value, label, 4096);
}
function freezeExecutionIdentityContext(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeExecutionIdentityContext(nested, seen);
	return Object.freeze(value);
}
function hmacRef(db, kind, scope, value) {
	return pseudonymizeExecutionIdentityRef({
		db,
		kind,
		scope: ensureBoundedExecutionIdentityRef(scope, "HMAC scope"),
		value: ensureRawRef(value, "HMAC value")
	});
}
function uniqueSorted(values, key) {
	return [...new Map(values.map((value) => [key(value), value])).values()].toSorted((a, b) => {
		const left = key(a);
		const right = key(b);
		return left < right ? -1 : left > right ? 1 : 0;
	});
}
function buildExecutionIdentityContext(db, envelope, fixed) {
	const runId = ensureBoundedExecutionIdentityRef(envelope.runId, "run id");
	const executionId = ensureBoundedExecutionIdentityRef(envelope.executionId, "execution id");
	const agentId = ensureBoundedExecutionIdentityRef(envelope.agentId, "agent id");
	const contextId = ensureBoundedExecutionIdentityRef(fixed.contextId, "context id");
	const domainRef = hmacRef(db, "domain", "gateway-cell", "gateway-cell");
	const runtimeRef = hmacRef(db, "runtime", domainRef, ensureRawRef(envelope.runtimeInstanceId, "runtime instance id"));
	const invoker = envelope.invoker?.state === "present" ? {
		state: "present",
		principal: {
			kind: envelope.invoker.kind,
			domainRef,
			principalRef: hmacRef(db, "principal", `${domainRef}:${envelope.invoker.kind}`, envelope.invoker.rawPrincipalRef),
			...envelope.invoker.displayLabel !== void 0 ? { displayLabel: envelope.invoker.displayLabel } : {}
		}
	} : envelope.invoker?.state === "unknown" ? { state: "unknown" } : { state: "absent" };
	const assurance = uniqueSorted(envelope.assurance.map((item) => ({
		kind: item.kind,
		evidenceRef: hmacRef(db, "evidence", `${domainRef}:${item.kind}`, item.rawEvidenceRef),
		strength: item.strength
	})), (item) => `${item.kind}\0${item.evidenceRef}\0${item.strength}`);
	const applicableGrants = uniqueSorted(envelope.applicableGrants.map((grant) => ({
		grantRef: hmacRef(db, "grant", domainRef, grant.rawGrantRef),
		state: grant.state
	})), (grant) => `${grant.grantRef}\0${grant.state}`);
	const missingEvidence = envelope.invoker?.state === "present" ? [] : ["invoker.principal"];
	const context = {
		schemaVersion: 1,
		contextId,
		executionId,
		runId,
		createdAt: fixed.createdAt,
		trustDomain: {
			kind: "gateway-cell",
			domainRef,
			state: "present"
		},
		invoker,
		ingress: {
			kind: envelope.ingress.kind,
			boundary: ensureBoundedExecutionIdentityRef(envelope.ingress.boundary, "ingress boundary"),
			state: envelope.ingress.state,
			...envelope.ingress.rawSourceRef ? { sourceRef: hmacRef(db, "principal", `${domainRef}:ingress:${envelope.ingress.kind}`, envelope.ingress.rawSourceRef) } : {}
		},
		agentPrincipal: {
			kind: "agent",
			domainRef,
			principalRef: agentId
		},
		agentDefinition: {
			definitionRef: agentId,
			state: "present"
		},
		runtimeInstance: {
			runtimeRef,
			kind: envelope.runtime.kind,
			state: "present"
		},
		applicableGrants,
		assurance,
		coverageState: envelope.invoker?.state === "present" ? "attribution-only" : envelope.invoker?.state === "unknown" ? "unknown" : "unattributed",
		missingEvidence
	};
	if (!validateExecutionIdentityContextV1(context)) throw new Error("prepared execution identity context violates the V1 contract");
	const encoded = JSON.stringify(context);
	if (Buffer.byteLength(encoded, "utf8") > EXECUTION_IDENTITY_CONTEXT_MAX_BYTES$1) throw new Error("prepared execution identity context exceeds 16 KiB");
	return freezeExecutionIdentityContext(context);
}
//#endregion
//#region src/audit/execution-identity-context.ts
const EXECUTION_IDENTITY_CONTEXT_MAX_BYTES = 16 * 1024;
const EXECUTION_IDENTITY_CONTEXT_RETENTION_MS = 720 * 60 * 6e4;
const EXECUTION_IDENTITY_CONTEXT_MAX_ROWS = 1e5;
const EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS = 1024;
const EXECUTION_IDENTITY_HMAC_REF_RE = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const ensuredDatabases = /* @__PURE__ */ new WeakSet();
const EXECUTION_IDENTITY_CONTEXT_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS execution_identity_contexts (
  context_id TEXT NOT NULL PRIMARY KEY CHECK (length(context_id) BETWEEN 1 AND 256),
  execution_id TEXT NOT NULL UNIQUE CHECK (length(execution_id) BETWEEN 1 AND 256),
  run_id TEXT NOT NULL CHECK (length(run_id) BETWEEN 1 AND 256),
  created_at INTEGER NOT NULL CHECK (created_at >= 0),
  coverage_state TEXT NOT NULL CHECK (
    coverage_state IN ('attribution-only', 'unattributed', 'unknown', 'unsupported')
  ),
  context_bytes INTEGER NOT NULL CHECK (context_bytes BETWEEN 1 AND 16384),
  context_json TEXT NOT NULL CHECK (length(context_json) > 0),
  UNIQUE (created_at, context_id)
) STRICT;
CREATE INDEX IF NOT EXISTS execution_identity_contexts_run_created_idx
  ON execution_identity_contexts (run_id, created_at, execution_id);
`;
function executionIdentityDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureExecutionIdentityContextSchema(options = {}) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(EXECUTION_IDENTITY_CONTEXT_SCHEMA_SQL);
	}, options, { operationLabel: "audit.execution-identity.schema.ensure" });
	ensuredDatabases.add(database.db);
}
function parseExecutionIdentityRow(row) {
	if (typeof row.context_json !== "string" || Buffer.byteLength(row.context_json, "utf8") !== normalizeSqliteNumber(row.context_bytes) || Buffer.byteLength(row.context_json, "utf8") > EXECUTION_IDENTITY_CONTEXT_MAX_BYTES) throw new Error("invalid context payload bounds");
	const parsed = JSON.parse(row.context_json);
	if (!validateExecutionIdentityContextV1(parsed)) throw new Error("invalid context payload schema");
	if (parsed.contextId !== row.context_id || parsed.executionId !== row.execution_id || parsed.runId !== row.run_id || parsed.createdAt !== normalizeSqliteNumber(row.created_at) || parsed.coverageState !== row.coverage_state || JSON.stringify(parsed) !== row.context_json || !EXECUTION_IDENTITY_HMAC_REF_RE.test(parsed.trustDomain.domainRef) || !EXECUTION_IDENTITY_HMAC_REF_RE.test(parsed.runtimeInstance.runtimeRef)) throw new Error("context payload disagrees with indexed columns");
	return freezeExecutionIdentityContext(parsed);
}
function readRowByExecutionId(db, executionId) {
	return executeSqliteQueryTakeFirstSync(db, executionIdentityDb(db).selectFrom("execution_identity_contexts").selectAll().where("execution_id", "=", executionId));
}
function readRowsByRunId(db, runId, now, offset, limit) {
	return executeSqliteQuerySync(db, executionIdentityDb(db).selectFrom("execution_identity_contexts").selectAll().where("run_id", "=", runId).where("created_at", ">=", now - EXECUTION_IDENTITY_CONTEXT_RETENTION_MS).orderBy("created_at", "asc").orderBy("execution_id", "asc").offset(offset).limit(limit)).rows;
}
function deleteExpiredExecutionIdentityContexts(db, now, limit) {
	const kysely = executionIdentityDb(db);
	const expiredIds = kysely.selectFrom("execution_identity_contexts").select("context_id").where("created_at", "<", now - EXECUTION_IDENTITY_CONTEXT_RETENTION_MS).orderBy("created_at", "asc").orderBy("context_id", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("execution_identity_contexts").where("context_id", "in", expiredIds));
}
function pruneExecutionIdentityContextsAfterInsert(db, now, limits) {
	const kysely = executionIdentityDb(db);
	const expired = deleteExpiredExecutionIdentityContexts(db, now, limits.pruneBatchRows);
	const expiredCount = Number(expired.numAffectedRows ?? 0n);
	const remainingPruneBudget = Math.max(0, limits.pruneBatchRows - expiredCount);
	if (remainingPruneBudget > 0) {
		const retainedIds = kysely.selectFrom("execution_identity_contexts").select("context_id").orderBy("created_at", "desc").orderBy("context_id", "desc").limit(limits.maxRows);
		const oldestOverflowIds = kysely.selectFrom("execution_identity_contexts").select("context_id").where("context_id", "not in", retainedIds).orderBy("created_at", "asc").orderBy("context_id", "asc").limit(remainingPruneBudget);
		executeSqliteQuerySync(db, kysely.deleteFrom("execution_identity_contexts").where("context_id", "in", oldestOverflowIds));
	}
}
/** Delete one bounded batch during the existing audit startup/hourly maintenance tick. */
function pruneExpiredExecutionIdentityContexts(params = {}) {
	const databaseOptions = params.database ?? {};
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "execution_identity_contexts")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredExecutionIdentityContexts(db, params.now ?? Date.now(), EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS);
		return Number(deleted.numAffectedRows ?? 0n);
	}, {
		...databaseOptions,
		database
	}, { operationLabel: "audit.execution-identity.context.maintenance" });
}
/** Worker-owned canonicalization and persistence for one accepted admission envelope. */
function persistExecutionIdentityAdmissionEnvelope(input, options = {}) {
	const envelope = parseExecutionIdentityAdmissionEnvelope(input);
	ensureExecutionIdentityContextSchema(options);
	const executionId = envelope.executionId;
	const plannedContext = buildExecutionIdentityContext(openOpenClawStateDatabase(options).db, envelope, {
		contextId: envelope.contextId,
		createdAt: envelope.createdAt
	});
	const plannedContextJson = JSON.stringify(plannedContext);
	let transactionDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			transactionDatabase = db;
			const existing = readRowByExecutionId(db, executionId);
			if (existing) {
				const context = parseExecutionIdentityRow(existing);
				if (plannedContextJson !== existing.context_json) throw new Error("execution identity context conflict for execution");
				return context;
			}
			executeSqliteQuerySync(db, executionIdentityDb(db).insertInto("execution_identity_contexts").values({
				context_id: plannedContext.contextId,
				execution_id: plannedContext.executionId,
				run_id: plannedContext.runId,
				created_at: plannedContext.createdAt,
				coverage_state: plannedContext.coverageState,
				context_bytes: Buffer.byteLength(plannedContextJson, "utf8"),
				context_json: plannedContextJson
			}));
			pruneExecutionIdentityContextsAfterInsert(db, options.now ?? Date.now(), options.limits ?? {
				maxRows: EXECUTION_IDENTITY_CONTEXT_MAX_ROWS,
				pruneBatchRows: EXECUTION_IDENTITY_CONTEXT_PRUNE_BATCH_ROWS
			});
			return plannedContext;
		}, options, { operationLabel: "audit.execution-identity.context.record" });
	} catch (error) {
		if (transactionDatabase) clearAuditIdentityKeyCacheForDatabase(transactionDatabase);
		throw error;
	}
}
/** A durable recovery retry may only confirm the originally captured execution. */
function verifyExecutionIdentityAdmissionRetry(token, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	if (!tableExists(db, "execution_identity_contexts")) throw new Error("execution identity recovery evidence unavailable");
	const existing = readRowByExecutionId(db, token.executionId);
	if (!existing) throw new Error("execution identity recovery evidence unavailable");
	const context = parseExecutionIdentityRow(existing);
	if (context.contextId !== token.contextId || context.executionId !== token.executionId || context.runId !== token.runId || context.createdAt !== token.createdAt) throw new Error("execution identity context conflict for execution");
	return context;
}
/** Worker-owned persistence/verification for one accepted bounded queue item. */
function processExecutionIdentityAdmissionWork(input, options = {}) {
	const work = parseExecutionIdentityAdmissionWork(input);
	return work.kind === "capture" ? persistExecutionIdentityAdmissionEnvelope(work.envelope, options) : verifyExecutionIdentityAdmissionRetry(work.token, options);
}
/** Read one exact execution while turning malformed rows into typed diagnostics. */
function readExecutionIdentityContextByExecutionId(executionId, options = {}) {
	const normalizedExecutionId = ensureBoundedExecutionIdentityRef(executionId, "execution id");
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "execution_identity_contexts")) return { status: "missing" };
		const row = readRowByExecutionId(db, normalizedExecutionId);
		if (!row) return { status: "missing" };
		const createdAt = normalizeSqliteNumber(row.created_at);
		if (createdAt !== void 0 && createdAt < (options.now ?? Date.now()) - EXECUTION_IDENTITY_CONTEXT_RETENTION_MS) return {
			status: "expired",
			runId: row.run_id
		};
		try {
			return {
				status: "found",
				context: parseExecutionIdentityRow(row)
			};
		} catch {
			return {
				status: "corrupt",
				runId: row.run_id,
				reasonCode: "identity_context_corrupt"
			};
		}
	}, options) ?? { status: "missing" };
}
function unavailableResult(params) {
	return {
		schemaVersion: 1,
		run: "executionId" in params.selector ? {
			executionId: params.selector.executionId,
			...params.resolvedRunId ? { runId: params.resolvedRunId } : {},
			status: params.runStatus
		} : {
			runId: params.resolvedRunId ?? params.selector.runId,
			status: params.runStatus
		},
		identity: {
			state: params.state,
			reasonCode: params.reasonCode,
			missingEvidence: params.missingEvidence,
			remediation: params.remediation
		},
		decisions: [],
		coverage: {
			state: params.state,
			missingEvidence: params.missingEvidence
		}
	};
}
function unavailableIdentityContext(selector, remediation, resolvedRunId) {
	return unavailableResult({
		selector,
		resolvedRunId,
		runStatus: "known",
		state: "unsupported",
		reasonCode: "identity_context_unavailable",
		missingEvidence: ["identity.context"],
		remediation: [remediation]
	});
}
function inspectExactExecution(params, options) {
	const executionId = ensureBoundedExecutionIdentityRef(params.executionId, "execution id");
	const selector = { executionId };
	const contextResult = readExecutionIdentityContextByExecutionId(executionId, options);
	if (contextResult.status === "found") return presentExecutionDecisionReceipts({
		context: contextResult.context,
		decisionCursor: params.decisionCursor,
		decisionLimit: params.decisionLimit,
		options
	});
	if (contextResult.status === "corrupt") return unavailableResult({
		selector,
		resolvedRunId: contextResult.runId,
		runStatus: "known",
		state: "unknown",
		reasonCode: contextResult.reasonCode,
		missingEvidence: ["identity.context.valid"],
		remediation: [{
			code: "inspect_state_integrity",
			text: "Run openclaw doctor and inspect the shared state database before trusting this execution."
		}]
	});
	if (contextResult.status === "expired") return unavailableIdentityContext(selector, {
		code: "run_again_after_expiry",
		text: "This execution's identity context is outside the 30-day retention window; run the operation again to record a new context."
	}, contextResult.runId);
	return unavailableResult({
		selector,
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "execution_not_found",
		missingEvidence: ["identity.context"],
		remediation: [{
			code: "verify_execution_id",
			text: "Verify the exact execution id; absence of best-effort identity evidence is not proof that no run occurred."
		}]
	});
}
function hasAnyRunContext(db, runId) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, executionIdentityDb(db).selectFrom("execution_identity_contexts").select("context_id").where("run_id", "=", runId).limit(1)));
}
function hasRetainedAuditRun(db, runId, now) {
	if (!tableExists(db, "audit_events")) return false;
	return Boolean(executeSqliteQueryTakeFirstSync(db, executionIdentityDb(db).selectFrom("audit_events").select("sequence").where("run_id", "=", runId).where("occurred_at", ">=", now - EXECUTION_IDENTITY_CONTEXT_RETENTION_MS).where("kind", "!=", "message").limit(1)));
}
function inspectRunSelector(params, options) {
	const runId = ensureBoundedExecutionIdentityRef(params.runId, "run id");
	const now = options.now ?? Date.now();
	const inspected = withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const firstMatches = tableExists(db, "execution_identity_contexts") ? readRowsByRunId(db, runId, now, 0, 2) : [];
		if (firstMatches.length === 1) {
			let context;
			try {
				context = parseExecutionIdentityRow(firstMatches[0]);
			} catch {
				return unavailableResult({
					selector: { runId },
					runStatus: "known",
					state: "unknown",
					reasonCode: "identity_context_corrupt",
					missingEvidence: ["identity.context.valid"],
					remediation: [{
						code: "inspect_state_integrity",
						text: "Run openclaw doctor and inspect the shared state database before trusting this run."
					}]
				});
			}
			return presentExecutionDecisionReceipts({
				context,
				decisionCursor: params.decisionCursor,
				decisionLimit: params.decisionLimit,
				options
			});
		}
		if (firstMatches.length > 1) {
			const offset = params.executionOffset ?? 0;
			const limit = params.executionLimit ?? 50;
			const page = readRowsByRunId(db, runId, now, offset, limit + 1);
			const candidates = page.slice(0, limit).map((row) => ({
				executionId: row.execution_id,
				contextId: row.context_id,
				createdAt: normalizeSqliteNumber(row.created_at) ?? 0
			}));
			return {
				schemaVersion: 1,
				run: {
					runId,
					status: "known"
				},
				identity: {
					state: "ambiguous",
					reasonCode: "execution_selection_required",
					candidates,
					missingEvidence: ["execution.selection"],
					remediation: [{
						code: "select_execution_id",
						text: "Select one candidate with openclaw audit --execution <id> --explain."
					}]
				},
				decisions: [],
				coverage: {
					state: "unknown",
					missingEvidence: ["execution.selection"]
				},
				...page.length > limit ? { nextExecutionCursor: String(offset + limit) } : {}
			};
		}
		if (hasOperatorApprovalReceiptsForRun({
			runId,
			nowMs: now,
			databaseOptions: options
		}) || hasExecutionDecisionFactsForRun({
			runId,
			now,
			database: options
		})) return unavailableResult({
			selector: { runId },
			runStatus: "known",
			state: "unknown",
			reasonCode: "decision_context_link_missing",
			missingEvidence: ["identity.context", "decision.context_link"],
			remediation: [{
				code: "record_new_identity_context",
				text: "Confirm execution identity collection is enabled, then run and request the action again to record a linked context."
			}]
		});
		if (tableExists(db, "execution_identity_contexts") && hasAnyRunContext(db, runId)) return unavailableIdentityContext({ runId }, {
			code: "run_again_after_expiry",
			text: "This run's retained identity contexts are outside the 30-day window; run the operation again to record a new execution."
		});
		try {
			if (hasRetainedAuditRun(db, runId, now)) return unavailableIdentityContext({ runId }, {
				code: "record_new_identity_context",
				text: "Confirm audit collection is enabled and the Gateway is current, then run the operation again to record a new execution context."
			});
		} catch {
			return unavailableResult({
				selector: { runId },
				runStatus: "unknown",
				state: "unknown",
				reasonCode: "run_evidence_unreadable",
				missingEvidence: ["run.record", "identity.context"],
				remediation: [{
					code: "inspect_state_integrity",
					text: "Run openclaw doctor and retry the run inspection."
				}]
			});
		}
	}, options);
	if (inspected) return inspected;
	return unavailableResult({
		selector: { runId },
		runStatus: "unknown",
		state: "unknown",
		reasonCode: "run_not_found",
		missingEvidence: ["run.record", "identity.context"],
		remediation: [{
			code: "verify_run_id",
			text: "Verify the run id; absence of best-effort audit activity is not proof of no run."
		}]
	});
}
/** Inspect one exact execution or discover bounded executions for a run correlation. */
function inspectExecutionIdentityRun(params, options = {}) {
	return "executionId" in params ? inspectExactExecution(params, options) : inspectRunSelector(params, options);
}
//#endregion
export { isExecutionDecisionCursor as a, listAuditEvents as c, ExecutionDecisionCursorError as i, pruneExpiredAuditEvents as l, processExecutionIdentityAdmissionWork as n, pruneExpiredExecutionDecisionFacts as o, pruneExpiredExecutionIdentityContexts as r, recordExecutionDecisionFact as s, inspectExecutionIdentityRun as t, recordAuditEvent as u };
