import { Bt as tableExists, Lt as OPENCLAW_STATE_SCHEMA_SQL, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Qt as normalizeSqliteNumber, Vt as tableHasColumn, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync, zt as ensureColumn } from "./openclaw-state-db-kmBThqu6.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { Ht as validateExecutionIdentityContextV1 } from "./src-4dv5TpeQ.js";
import "./audit-activity-D1fGuIwS.js";
import { a as parseExecutionIdentityAdmissionEnvelope, c as executionIdentitySpawnAdmission, o as parseExecutionIdentityAdmissionToken, s as parseExecutionIdentityAdmissionWork } from "./execution-identity-admission-Tv8ni-9_.js";
import { t as EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE } from "./execution-owner-lifecycle-binding-store-e2AfXbvP.js";
import { a as summarizeExecutionDecisionFactsForContext, c as pseudonymizeAuditIdentity, l as pseudonymizeExecutionIdentityRef, n as pageExecutionDecisionFactsForContext, o as clearAuditIdentityKeyCacheForDatabase, s as loadOrCreateAuditIdentityKey, t as hasExecutionDecisionFactsForRun } from "./execution-decision-facts-2puDcKuZ.js";
import { t as parsePositiveAuditCursor } from "./audit-cursor-B-p0ImK5.js";
import { d as pageOperatorApprovalReceiptsForRun, m as summarizeOperatorApprovalReceiptsForRun, s as hasOperatorApprovalReceiptsForRun } from "./operator-approval-store-CQ2Uh4i5.js";
import { randomUUID } from "node:crypto";
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
function isOutboundMessageProgressInput(input) {
	return input.kind === "message" && input.direction === "outbound" && (input.action === "message.outbound.queued" || input.action === "message.outbound.platform-started");
}
//#endregion
//#region src/audit/message-execution-binding.ts
const ensuredTerminalBindingDatabases = /* @__PURE__ */ new WeakSet();
function selectMessageExecutionBinding(params) {
	if (params.contextId === void 0 && params.executionId === void 0) return;
	if (!params.contextId || !params.executionId) throw new Error("outbound message decision query requires the exact context and execution");
	return {
		contextId: params.contextId,
		executionId: params.executionId
	};
}
function hasMessageExecutionBindingColumns(db, tableName) {
	return tableHasColumn(db, tableName, "context_id") && tableHasColumn(db, tableName, "execution_id");
}
function terminalBindingSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS outbound_message_execution_bindings (");
	const indexStart = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE INDEX IF NOT EXISTS outbound_message_execution_bindings_execution_event_idx", start);
	const end = indexStart >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(";", indexStart) : -1;
	if (start < 0 || end < 0) throw new Error("canonical outbound message execution binding schema is missing");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 1);
}
/** Install the terminal binding companion only when an exact producer first uses it. */
function ensureTerminalMessageExecutionBindingSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredTerminalBindingDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(terminalBindingSchemaSql());
	}, {
		...options,
		database
	}, { operationLabel: "audit.outbound-message.execution-binding.schema.ensure" });
	ensuredTerminalBindingDatabases.add(database.db);
}
/** Validate queue-loaded token bytes before entering a synchronous write transaction. */
function planMessageExecutionBinding(token, runId) {
	if (!token) return;
	const planned = parseExecutionIdentityAdmissionToken(token);
	if (!runId || planned.runId !== runId) throw new Error("outbound message execution binding disagrees with the admitted run");
	return planned;
}
/** Confirm the exact retained admission row; run correlation alone never binds a receipt. */
function confirmMessageExecutionBinding(db, token) {
	if (!token || !tableExists(db, "execution_identity_contexts")) return;
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("execution_identity_contexts").select("context_id").where("context_id", "=", token.contextId).where("execution_id", "=", token.executionId).where("run_id", "=", token.runId).where("created_at", "=", token.createdAt)) ? {
		contextId: token.contextId,
		executionId: token.executionId
	} : void 0;
}
function recordTerminalMessageExecutionBinding(db, params) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("outbound_message_execution_bindings").values({
		event_id: params.eventId,
		context_id: params.contextId,
		execution_id: params.executionId,
		run_id: params.runId
	}));
}
function recordConfirmedTerminalMessageExecutionBinding(db, params) {
	if (!params.eventId) return;
	const binding = confirmMessageExecutionBinding(db, params.token);
	if (binding && params.token) recordTerminalMessageExecutionBinding(db, {
		eventId: params.eventId,
		runId: params.token.runId,
		...binding
	});
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
const AUDIT_HMAC_REF_RE$1 = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
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
function requiredText$1(row, value, field) {
	if (typeof value !== "string" || value.length === 0) corruptAuditRow(row, `invalid ${field}`);
	return value;
}
function optionalText$1(row, value, field) {
	if (value === null || value === void 0) return;
	return requiredText$1(row, value, field);
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
	const ref = requiredText$1(row, value, field);
	if (!AUDIT_HMAC_REF_RE$1.test(ref)) corruptAuditRow(row, `invalid ${field}`);
	return ref;
}
function optionalHmacRef$1(row, value, field) {
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
		eventId: requiredText$1(row, row.event_id, "eventId"),
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
		actorId: requiredText$1(row, row.actor_id, "actorId"),
		agentId: requiredText$1(row, row.agent_id, "agentId"),
		...optionalText$1(row, row.session_key, "sessionKey") !== void 0 ? { sessionKey: requiredText$1(row, row.session_key, "sessionKey") } : {},
		...optionalText$1(row, row.session_id, "sessionId") !== void 0 ? { sessionId: requiredText$1(row, row.session_id, "sessionId") } : {},
		runId: requiredText$1(row, row.run_id, "runId")
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
	const toolCallId = optionalText$1(row, row.tool_call_id, "toolCallId");
	const toolName = optionalText$1(row, row.tool_name, "toolName");
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
	const agentId = optionalText$1(row, row.agent_id, "agentId");
	const runId = optionalText$1(row, row.run_id, "runId");
	const durationMs = optionalInteger(row, row.duration_ms, "durationMs", 0);
	const resultCount = optionalInteger(row, row.result_count, "resultCount", 0);
	const accountRef = optionalHmacRef$1(row, row.account_ref, "accountRef");
	const conversationRef = optionalHmacRef$1(row, row.conversation_ref, "conversationRef");
	const messageRef = optionalHmacRef$1(row, row.message_ref, "messageRef");
	const targetRef = optionalHmacRef$1(row, row.target_ref, "targetRef");
	return {
		...parseAuditRecordBase(row),
		kind: "message",
		channel: requiredText$1(row, row.channel, "channel"),
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
	const actorId = actorType === "channel_sender" ? requiredHmacRef(row, row.actor_id, "actorId") : requiredText$1(row, row.actor_id, "actorId");
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
	const action = requiredEnum(row, row.action, "action", [
		"message.outbound.queued",
		"message.outbound.platform-started",
		"message.outbound.finished"
	]);
	requiredEnum(row, row.direction, "direction", ["outbound"]);
	const actorType = requiredEnum(row, row.actor_type, "actorType", ["agent", "system"]);
	const actorId = requiredText$1(row, row.actor_id, "actorId");
	const common = {
		...parseMessageRecordFields(row),
		action,
		direction: "outbound",
		actorType,
		actorId
	};
	if (row.status === "started") {
		requireNull(row, "delivery_kind");
		requireNullColumns(row, [
			"error_code",
			"reason_code",
			"failure_stage"
		]);
		if (action === "message.outbound.queued") {
			requiredEnum(row, row.message_outcome, "outcome", ["queued"]);
			return {
				...common,
				action,
				status: "started",
				outcome: "queued"
			};
		}
		if (action === "message.outbound.platform-started") {
			requiredEnum(row, row.message_outcome, "outcome", ["platform_started"]);
			return {
				...common,
				action,
				status: "started",
				outcome: "platform_started"
			};
		}
		return corruptAuditRow(row, "invalid outbound lifecycle action");
	}
	requiredEnum(row, action, "action", ["message.outbound.finished"]);
	const terminalCommon = {
		...common,
		action: "message.outbound.finished"
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
			...terminalCommon,
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
			...terminalCommon,
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
			...terminalCommon,
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
			...terminalCommon,
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
function deleteExpiredAuditEvents(db, now) {
	const kysely = getAuditKysely(db);
	const expiredSequences = kysely.selectFrom("audit_events").select("sequence").where("occurred_at", "<", now - AUDIT_EVENT_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(AUDIT_EVENT_PRUNE_BATCH_ROWS);
	return executeSqliteQuerySync(db, kysely.deleteFrom("audit_events").where("sequence", "in", expiredSequences));
}
function pruneAuditEventsAfterInsert(db, now) {
	const kysely = getAuditKysely(db);
	const expired = deleteExpiredAuditEvents(db, now);
	const cachedCount = auditEventRowCounts.get(db);
	let rowCount = cachedCount === void 0 ? countAuditEvents(db) : Math.max(0, cachedCount + 1 - Number(expired.numAffectedRows ?? 0n));
	if (rowCount <= AUDIT_EVENT_MAX_ROWS) {
		auditEventRowCounts.set(db, rowCount);
		return;
	}
	const retainedRows = Math.max(0, AUDIT_EVENT_MAX_ROWS - AUDIT_EVENT_PRUNE_BATCH_ROWS);
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
	if (isOutboundMessageProgressInput(input)) throw new Error("outbound message progress belongs to its companion store");
	const executionToken = input.kind === "message" && input.direction === "outbound" ? planMessageExecutionBinding(input.executionIdentityToken, input.runId) : void 0;
	if (executionToken) ensureTerminalMessageExecutionBindingSchema(options);
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
			recordConfirmedTerminalMessageExecutionBinding(db, {
				eventId: row?.event_id,
				token: executionToken
			});
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
	let query = getAuditKysely(db).selectFrom("audit_events").selectAll().where("occurred_at", ">=", retainedAfter).where("action", "not in", ["message.outbound.queued", "message.outbound.platform-started"]);
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
/** Delete one bounded batch during Gateway startup and periodic audit maintenance. */
function pruneExpiredAuditEvents(params = {}) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredAuditEvents(db, params.now ?? Date.now());
		auditEventRowCounts.delete(db);
		return Number(deleted.numAffectedRows ?? 0n);
	}, params.database);
}
//#endregion
//#region src/audit/execution-owner-lifecycle-receipts.ts
const KNOWN_STATUSES = {
	cron: /* @__PURE__ */ new Set([
		"running",
		"ok",
		"error",
		"skipped",
		"interrupted",
		"superseded"
	]),
	task: /* @__PURE__ */ new Set([
		"queued",
		"running",
		"succeeded",
		"failed",
		"timed_out",
		"cancelled",
		"lost",
		"blocked"
	]),
	flow: /* @__PURE__ */ new Set([
		"queued",
		"running",
		"waiting",
		"blocked",
		"succeeded",
		"failed",
		"cancelled",
		"lost"
	])
};
const OWNER_LIFECYCLE_CURSOR_RETAINED_ERROR = "owner lifecycle cursor is no longer retained";
function ownerName(stage) {
	return stage === "cron" ? "cron_run_receipts" : stage === "task" ? "task_runs" : "flow_runs";
}
function displayProducer(stage) {
	return stage === "cron" ? "cron-lifecycle" : stage === "task" ? "task-lifecycle" : "flow-lifecycle";
}
function assertRetainedCursor(params) {
	if (!params.after) return;
	const kysely = getNodeSqliteKysely(params.db);
	const ownerQuery = params.stage === "cron" ? kysely.selectFrom("cron_run_receipts").select("receipt_id as ownerId").where("rowid", "=", params.after.rowId).where("started_at_ms", "=", params.after.occurredAt) : params.stage === "task" ? kysely.selectFrom("task_runs").select("task_id as ownerId").where("rowid", "=", params.after.rowId).where("created_at", "=", params.after.occurredAt) : kysely.selectFrom("flow_runs").select("flow_id as ownerId").where("rowid", "=", params.after.rowId).where("created_at", "=", params.after.occurredAt);
	const owner = executeSqliteQueryTakeFirstSync(params.db, ownerQuery);
	if (!(owner ? executeSqliteQueryTakeFirstSync(params.db, kysely.selectFrom("execution_owner_lifecycle_bindings").select("owner_id").where("owner_kind", "=", params.stage).where("owner_id", "=", owner.ownerId).where("context_id", "=", params.contextId).where("execution_id", "=", params.executionId)) : void 0)) throw new Error(OWNER_LIFECYCLE_CURSOR_RETAINED_ERROR);
}
function readRows(params) {
	const owner = ownerName(params.stage);
	if (!tableExists(params.db, owner) || !tableExists(params.db, "execution_owner_lifecycle_bindings")) {
		if (params.after) throw new Error(OWNER_LIFECYCLE_CURSOR_RETAINED_ERROR);
		return [];
	}
	assertRetainedCursor(params);
	const kysely = getNodeSqliteKysely(params.db);
	if (params.stage === "cron") {
		let query = kysely.selectFrom("cron_run_receipts").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "cron_run_receipts.receipt_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "cron")).select([
			"cron_run_receipts.receipt_id as recordId",
			"execution_owner_lifecycle_bindings.execution_id as executionId",
			"cron_run_receipts.started_at_ms as occurredAt",
			"cron_run_receipts.status",
			"cron_run_receipts.rowid as rowId"
		]).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).orderBy("cron_run_receipts.started_at_ms", "asc").orderBy("cron_run_receipts.rowid", "asc").limit(params.limit);
		if (params.after) query = query.where((eb) => eb.or([eb("cron_run_receipts.started_at_ms", ">", params.after.occurredAt), eb.and([eb("cron_run_receipts.started_at_ms", "=", params.after.occurredAt), eb("cron_run_receipts.rowid", ">", params.after.rowId)])]));
		else if (params.offset) query = query.offset(params.offset);
		return executeSqliteQuerySync(params.db, query).rows.map((row) => Object.assign(row, { owner }));
	}
	if (params.stage === "task") {
		let query = kysely.selectFrom("task_runs").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "task_runs.task_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "task")).select([
			"task_runs.task_id as recordId",
			"execution_owner_lifecycle_bindings.execution_id as executionId",
			"task_runs.created_at as occurredAt",
			"task_runs.status",
			"task_runs.terminal_outcome as terminalOutcome",
			"task_runs.rowid as rowId"
		]).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).orderBy("task_runs.created_at", "asc").orderBy("task_runs.rowid", "asc").limit(params.limit);
		if (params.after) query = query.where((eb) => eb.or([eb("task_runs.created_at", ">", params.after.occurredAt), eb.and([eb("task_runs.created_at", "=", params.after.occurredAt), eb("task_runs.rowid", ">", params.after.rowId)])]));
		else if (params.offset) query = query.offset(params.offset);
		return executeSqliteQuerySync(params.db, query).rows.map((row) => Object.assign(row, {
			owner,
			status: row.terminalOutcome === "blocked" ? "blocked" : row.status
		}));
	}
	let query = kysely.selectFrom("flow_runs").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "flow_runs.flow_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "flow")).select([
		"flow_runs.flow_id as recordId",
		"execution_owner_lifecycle_bindings.execution_id as executionId",
		"flow_runs.created_at as occurredAt",
		"flow_runs.status",
		"flow_runs.rowid as rowId"
	]).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).orderBy("flow_runs.created_at", "asc").orderBy("flow_runs.rowid", "asc").limit(params.limit);
	if (params.after) query = query.where((eb) => eb.or([eb("flow_runs.created_at", ">", params.after.occurredAt), eb.and([eb("flow_runs.created_at", "=", params.after.occurredAt), eb("flow_runs.rowid", ">", params.after.rowId)])]));
	else if (params.offset) query = query.offset(params.offset);
	return executeSqliteQuerySync(params.db, query).rows.map((row) => Object.assign(row, { owner }));
}
function countRows(params) {
	const owner = ownerName(params.stage);
	if (!tableExists(params.db, owner) || !tableExists(params.db, "execution_owner_lifecycle_bindings")) return 0;
	const kysely = getNodeSqliteKysely(params.db);
	const query = params.stage === "cron" ? kysely.selectFrom("cron_run_receipts").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "cron_run_receipts.receipt_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "cron")).select((eb) => eb.fn.countAll().as("count")).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).$if(params.executionId !== void 0, (qb) => qb.where("execution_owner_lifecycle_bindings.execution_id", "=", params.executionId)) : params.stage === "task" ? kysely.selectFrom("task_runs").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "task_runs.task_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "task")).select((eb) => eb.fn.countAll().as("count")).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).$if(params.executionId !== void 0, (qb) => qb.where("execution_owner_lifecycle_bindings.execution_id", "=", params.executionId)) : kysely.selectFrom("flow_runs").innerJoin(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE, (join) => join.onRef("execution_owner_lifecycle_bindings.owner_id", "=", "flow_runs.flow_id").on("execution_owner_lifecycle_bindings.owner_kind", "=", "flow")).select((eb) => eb.fn.countAll().as("count")).where("execution_owner_lifecycle_bindings.context_id", "=", params.contextId).$if(params.executionId !== void 0, (qb) => qb.where("execution_owner_lifecycle_bindings.execution_id", "=", params.executionId));
	return executeSqliteQueryTakeFirstSync(params.db, query)?.count ?? 0;
}
function projectReceipt(stage, row, context) {
	const exact = row.executionId === context.executionId;
	const known = KNOWN_STATUSES[stage].has(row.status);
	const valid = exact && known;
	const missingEvidence = valid ? [] : [exact ? `decision.${stage}_owner_status` : "decision.execution_link"];
	return {
		schemaVersion: 1,
		receiptId: `${stage}:${row.recordId}`,
		contextId: context.contextId,
		executionId: context.executionId,
		runId: context.runId,
		actionId: row.recordId,
		occurredAt: row.occurredAt,
		action: {
			family: stage === "cron" ? "scheduled-run" : stage === "task" ? "task" : "flow",
			operation: "lifecycle",
			summary: valid ? `${stage === "cron" ? "Scheduled run" : stage === "task" ? "Task" : "Flow"} lifecycle: ${row.status.replaceAll("_", "-")}.` : "Owner lifecycle evidence could not be matched exactly."
		},
		decision: {
			outcome: valid ? "not-applicable" : "unknown",
			reasonCode: valid ? `${stage}_run_${row.status}` : exact ? `${stage}_run_status_unknown` : `${stage}_run_execution_link_mismatch`
		},
		enforcement: {
			coverageState: valid ? "attribution-only" : "unknown",
			evaluatorRef: `${stage}-lifecycle-owner`,
			policyRefs: [],
			grantRefs: [],
			contextFieldsUsed: ["contextId", "executionId"]
		},
		source: {
			owner: row.owner,
			recordRef: row.recordId,
			decisionBoundary: `${stage}.run.lifecycle`
		},
		missingEvidence,
		remediation: valid ? [] : [{
			code: "inspect_owner_execution_binding",
			text: "Inspect the owner row and its exact admission binding before drawing a lifecycle conclusion."
		}]
	};
}
function summarizeOwnerLifecycleReceipts(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const count = countRows({
			db,
			stage: params.stage,
			contextId: params.context.contextId
		});
		const mismatch = count !== countRows({
			db,
			stage: params.stage,
			contextId: params.context.contextId,
			executionId: params.context.executionId
		});
		return {
			count,
			...count > 0 ? { coverageState: mismatch ? "unknown" : "attribution-only" } : {},
			missingEvidence: mismatch ? ["decision.execution_link"] : []
		};
	}, params.options) ?? {
		count: 0,
		missingEvidence: []
	};
}
function pageOwnerLifecycleReceipts(params) {
	const retainedRows = withExistingOpenClawStateDatabaseReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => readRows({
		db,
		stage: params.stage,
		contextId: params.context.contextId,
		executionId: params.context.executionId,
		after: params.after,
		offset: params.offset,
		limit: params.limit + 1
	}), { operationLabel: "owner lifecycle receipt page" }), params.options);
	if (!retainedRows && params.after) throw new Error(OWNER_LIFECYCLE_CURSOR_RETAINED_ERROR);
	const rows = retainedRows ?? [];
	const hasMore = rows.length > params.limit;
	const page = hasMore ? rows.slice(0, params.limit) : rows;
	const last = page.at(-1);
	return {
		entries: page.map((row) => ({
			receipt: projectReceipt(params.stage, row, params.context),
			selectorId: `${params.stage}-lifecycle:${row.occurredAt}:${row.rowId}`,
			displayProducer: displayProducer(params.stage)
		})),
		...hasMore && last ? { nextCursor: {
			occurredAt: last.occurredAt,
			rowId: last.rowId
		} } : {}
	};
}
//#endregion
//#region src/audit/message-delivery-progress-store.ts
/** Lazy owner-native persistence for nonterminal outbound message progress. */
const OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS = 720 * 60 * 6e4;
const OUTBOUND_MESSAGE_PROGRESS_MAX_ROWS = 2e5;
const OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS = 1024;
const AUDIT_HMAC_REF_RE = /^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$/u;
const ensuredDatabases$1 = /* @__PURE__ */ new WeakSet();
const progressRowCounts = /* @__PURE__ */ new WeakMap();
function progressSchemaSql() {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE TABLE IF NOT EXISTS outbound_message_progress (");
	const finalIndex = OPENCLAW_STATE_SCHEMA_SQL.indexOf("CREATE INDEX IF NOT EXISTS outbound_message_progress_run_occurred_idx", start);
	const end = finalIndex >= 0 ? OPENCLAW_STATE_SCHEMA_SQL.indexOf(";", finalIndex) : -1;
	if (start < 0 || end < 0) throw new Error("canonical outbound message progress schema is missing");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 1);
}
function progressDb(db) {
	return getNodeSqliteKysely(db);
}
function ensureProgressSchema(options) {
	const database = openOpenClawStateDatabase(options);
	if (ensuredDatabases$1.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(progressSchemaSql());
		ensureColumn(db, "outbound_message_progress", "context_id TEXT");
		ensureColumn(db, "outbound_message_progress", "execution_id TEXT");
	}, options, { operationLabel: "audit.outbound-message-progress.schema.ensure" });
	ensuredDatabases$1.add(database.db);
}
function projectProgressIdentities(db, input) {
	const identity = loadOrCreateAuditIdentityKey(db);
	const conversationId = input.conversationId ?? input.targetId;
	const ref = (kind, value) => pseudonymizeAuditIdentity({
		identity,
		kind,
		channel: input.channel,
		...kind !== "account" && input.accountId !== void 0 ? { accountId: input.accountId } : {},
		value
	});
	return {
		accountRef: ref("account", input.accountId),
		conversationRef: ref("conversation", conversationId),
		targetRef: ref("target", input.targetId)
	};
}
function bindProgressRow(db, input, executionBinding) {
	const refs = projectProgressIdentities(db, input);
	return {
		progress_id: randomUUID(),
		source_id: input.sourceId,
		source_sequence: input.sourceSequence,
		schema_version: 1,
		occurred_at: input.occurredAt,
		action: input.action,
		outcome: input.outcome,
		actor_type: input.actorType,
		actor_id: input.actorId,
		agent_id: input.agentId ?? null,
		run_id: input.runId ?? null,
		context_id: executionBinding?.contextId ?? null,
		execution_id: executionBinding?.executionId ?? null,
		channel: input.channel,
		conversation_kind: input.conversationKind,
		duration_ms: input.durationMs ?? null,
		account_ref: refs.accountRef ?? null,
		conversation_ref: refs.conversationRef ?? null,
		target_ref: refs.targetRef ?? null
	};
}
function requiredText(value, field) {
	if (typeof value !== "string" || value.length === 0) throw new Error(`corrupt outbound message progress row: invalid ${field}`);
	return value;
}
function optionalText(value, field) {
	if (value === null || value === void 0) return;
	return requiredText(value, field);
}
function optionalHmacRef(value, field) {
	const ref = optionalText(value, field);
	if (ref !== void 0 && !AUDIT_HMAC_REF_RE.test(ref)) throw new Error(`corrupt outbound message progress row: invalid ${field}`);
	return ref;
}
function rowToProgressEvent(row) {
	const sequence = normalizeSqliteNumber(row.sequence);
	const sourceSequence = normalizeSqliteNumber(row.source_sequence);
	const occurredAt = normalizeSqliteNumber(row.occurred_at);
	const durationMs = normalizeSqliteNumber(row.duration_ms);
	if (sequence === void 0 || sequence < 1 || sourceSequence === void 0 || sourceSequence < 1 || occurredAt === void 0 || occurredAt < 0 || row.schema_version !== 1 || durationMs !== void 0 && durationMs < 0) throw new Error("corrupt outbound message progress row: invalid numeric field");
	if (row.action === "message.outbound.queued" && row.outcome !== "queued" || row.action === "message.outbound.platform-started" && row.outcome !== "platform_started" || row.action !== "message.outbound.queued" && row.action !== "message.outbound.platform-started") throw new Error("corrupt outbound message progress row: invalid lifecycle field");
	const actorType = row.actor_type === "agent" ? "agent" : row.actor_type === "system" ? "system" : void 0;
	if (!actorType) throw new Error("corrupt outbound message progress row: invalid actor type");
	const conversationKind = row.conversation_kind === "direct" ? "direct" : row.conversation_kind === "group" ? "group" : row.conversation_kind === "channel" ? "channel" : row.conversation_kind === "unknown" ? "unknown" : void 0;
	if (!conversationKind) throw new Error("corrupt outbound message progress row: invalid conversation kind");
	const common = {
		schemaVersion: 1,
		sequence,
		eventId: requiredText(row.progress_id, "progressId"),
		sourceSequence,
		occurredAt,
		redaction: "metadata_only",
		kind: "message",
		actorType,
		actorId: requiredText(row.actor_id, "actorId"),
		...optionalText(row.agent_id, "agentId") !== void 0 ? { agentId: row.agent_id } : {},
		...optionalText(row.run_id, "runId") !== void 0 ? { runId: row.run_id } : {},
		direction: "outbound",
		channel: requiredText(row.channel, "channel"),
		conversationKind,
		...durationMs !== void 0 ? { durationMs } : {},
		resultCount: 0,
		...optionalHmacRef(row.account_ref, "accountRef") !== void 0 ? { accountRef: row.account_ref } : {},
		...optionalHmacRef(row.conversation_ref, "conversationRef") !== void 0 ? { conversationRef: row.conversation_ref } : {},
		...optionalHmacRef(row.target_ref, "targetRef") !== void 0 ? { targetRef: row.target_ref } : {}
	};
	return row.action === "message.outbound.queued" ? {
		...common,
		action: row.action,
		status: "started",
		outcome: "queued"
	} : {
		...common,
		action: row.action,
		status: "started",
		outcome: "platform_started"
	};
}
function countProgressRows(db) {
	return normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(db, progressDb(db).selectFrom("outbound_message_progress").select((expression) => expression.fn.countAll().as("count")))?.count ?? null) ?? 0;
}
function deleteExpiredProgressRows(db, now, limit) {
	const kysely = progressDb(db);
	const expiredSequences = kysely.selectFrom("outbound_message_progress").select("sequence").where("occurred_at", "<", now - OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS).orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(limit);
	return executeSqliteQuerySync(db, kysely.deleteFrom("outbound_message_progress").where("sequence", "in", expiredSequences));
}
function pruneProgressAfterInsert(db, now) {
	const kysely = progressDb(db);
	const expired = deleteExpiredProgressRows(db, now, OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS);
	const cachedCount = progressRowCounts.get(db);
	let rowCount = cachedCount === void 0 ? countProgressRows(db) : Math.max(0, cachedCount + 1 - Number(expired.numAffectedRows ?? 0n));
	if (rowCount <= OUTBOUND_MESSAGE_PROGRESS_MAX_ROWS) {
		progressRowCounts.set(db, rowCount);
		return;
	}
	const retainedRows = Math.max(0, OUTBOUND_MESSAGE_PROGRESS_MAX_ROWS - OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS);
	const overflow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("outbound_message_progress").select("sequence").orderBy("sequence", "desc").offset(retainedRows).limit(1));
	const cutoff = overflow ? normalizeSqliteNumber(overflow.sequence) : void 0;
	if (cutoff !== void 0) {
		const pruned = executeSqliteQuerySync(db, kysely.deleteFrom("outbound_message_progress").where("sequence", "<=", cutoff));
		rowCount = Math.max(0, rowCount - Number(pruned.numAffectedRows ?? 0n));
	}
	progressRowCounts.set(db, rowCount);
}
/** Persist one progress fact idempotently; first use installs only this owner table. */
function recordOutboundMessageProgress(input, options = {}) {
	const executionToken = planMessageExecutionBinding(input.executionIdentityToken, input.runId);
	ensureProgressSchema(options);
	let cacheDatabase;
	try {
		return runOpenClawStateWriteTransaction(({ db }) => {
			cacheDatabase = db;
			const executionBinding = confirmMessageExecutionBinding(db, executionToken);
			const insert = executeSqliteQuerySync(db, progressDb(db).insertInto("outbound_message_progress").values(bindProgressRow(db, input, executionBinding)).onConflict((conflict) => conflict.column("source_id").doNothing()));
			if (insert.insertId === void 0) return;
			const sequence = Number(insert.insertId);
			if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("outbound message progress sequence is outside the supported range");
			pruneProgressAfterInsert(db, Date.now());
			const row = executeSqliteQueryTakeFirstSync(db, progressDb(db).selectFrom("outbound_message_progress").selectAll().where("sequence", "=", sequence));
			return row ? rowToProgressEvent(row) : void 0;
		}, options);
	} catch (error) {
		if (cacheDatabase) {
			progressRowCounts.delete(cacheDatabase);
			clearAuditIdentityKeyCacheForDatabase(cacheDatabase);
		}
		throw error;
	}
}
function countOutboundMessageProgressForRun(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (!tableExists(db, "outbound_message_progress") || exact && !hasMessageExecutionBindingColumns(db, "outbound_message_progress")) return 0;
		let query = progressDb(db).selectFrom("outbound_message_progress").select((expression) => expression.fn.countAll().as("count")).where("run_id", "=", params.runId).where("occurred_at", ">=", (params.now ?? Date.now()) - OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS);
		if (exact) query = query.where("context_id", "=", exact.contextId).where("execution_id", "=", exact.executionId);
		return normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(db, query)?.count ?? null) ?? 0;
	}, params.database) ?? 0;
}
function readOutboundMessageProgressForRun(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (!tableExists(db, "outbound_message_progress") || exact && !hasMessageExecutionBindingColumns(db, "outbound_message_progress")) return [];
		let query = progressDb(db).selectFrom("outbound_message_progress").selectAll().where("run_id", "=", params.runId).where("action", "=", params.action).where("occurred_at", ">=", (params.now ?? Date.now()) - OUTBOUND_MESSAGE_PROGRESS_RETENTION_MS);
		if (exact) query = query.where("context_id", "=", exact.contextId).where("execution_id", "=", exact.executionId);
		const after = params.after;
		if (after) query = query.where((expression) => expression.or([expression("occurred_at", ">", after.occurredAt), expression.and([expression("occurred_at", "=", after.occurredAt), expression("sequence", ">", after.sequence)])]));
		return executeSqliteQuerySync(db, query.orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(params.limit)).rows.map(rowToProgressEvent);
	}, params.database) ?? [];
}
function hasOutboundMessageProgressCursor(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (!tableExists(db, "outbound_message_progress") || exact && !hasMessageExecutionBindingColumns(db, "outbound_message_progress")) return false;
		let query = progressDb(db).selectFrom("outbound_message_progress").select("sequence").where("sequence", "=", params.sequence).where("run_id", "=", params.runId).where("occurred_at", "=", params.occurredAt).where("action", "=", params.action);
		if (exact) query = query.where("context_id", "=", exact.contextId).where("execution_id", "=", exact.executionId);
		return Boolean(executeSqliteQueryTakeFirstSync(db, query));
	}, params.database) ?? false;
}
/** Prune existing progress without creating its lazy table. */
function pruneExpiredOutboundMessageProgress(params = {}) {
	if (!tableExists(openOpenClawStateDatabase(params.database).db, "outbound_message_progress")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const deleted = deleteExpiredProgressRows(db, params.now ?? Date.now(), OUTBOUND_MESSAGE_PROGRESS_PRUNE_BATCH_ROWS);
		progressRowCounts.delete(db);
		return Number(deleted.numAffectedRows ?? 0n);
	}, params.database);
}
//#endregion
//#region src/audit/message-delivery-audit-store.ts
function deliveryAuditDb(db) {
	return getNodeSqliteKysely(db);
}
function terminalBindingEventIds(db, runId, binding) {
	return deliveryAuditDb(db).selectFrom("outbound_message_execution_bindings").select("event_id").where("context_id", "=", binding.contextId).where("execution_id", "=", binding.executionId).where("run_id", "=", runId);
}
const MESSAGE_CURSOR_STAGE_SPAN = 0xe8d4a51000;
const MESSAGE_STREAM_CHUNK_SIZE = 256;
function messageStage(event) {
	return event.action === "message.outbound.queued" ? 0 : event.action === "message.outbound.platform-started" ? 1 : 2;
}
function compositeMessageRowId(event) {
	if (event.sequence >= MESSAGE_CURSOR_STAGE_SPAN) throw new Error("outbound message decision cursor is outside the supported integer range");
	const rowId = messageStage(event) * MESSAGE_CURSOR_STAGE_SPAN + event.sequence;
	if (!Number.isSafeInteger(rowId)) throw new Error("outbound message decision cursor is outside the supported integer range");
	return rowId;
}
function readTerminalEventsForRun(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (exact && !tableExists(db, "outbound_message_execution_bindings")) return [];
		let query = deliveryAuditDb(db).selectFrom("audit_events").selectAll().where("kind", "=", "message").where("direction", "=", "outbound").where("action", "=", "message.outbound.finished").where("run_id", "=", params.runId).where("occurred_at", ">=", (params.now ?? Date.now()) - 2592e6);
		if (exact) query = query.where("event_id", "in", terminalBindingEventIds(db, params.runId, exact));
		const after = params.after;
		if (after) query = query.where((expression) => expression.or([expression("occurred_at", ">", after.occurredAt), expression.and([expression("occurred_at", "=", after.occurredAt), expression("sequence", ">", after.sequence)])]));
		return executeSqliteQuerySync(db, query.orderBy("occurred_at", "asc").orderBy("sequence", "asc").limit(params.limit)).rows.map((row) => rowToAuditEvent(row));
	}, params.database) ?? [];
}
function compareOwnedMessageEvents(left, right) {
	return left.event.occurredAt === right.event.occurredAt ? left.rowId - right.rowId : left.event.occurredAt - right.event.occurredAt;
}
function streamAfterCursor(cursor, stage) {
	if (!cursor) return;
	const cursorStage = Math.floor(cursor.rowId / MESSAGE_CURSOR_STAGE_SPAN);
	const cursorSequence = cursor.rowId % MESSAGE_CURSOR_STAGE_SPAN;
	return {
		occurredAt: cursor.occurredAt,
		sequence: stage < cursorStage ? Number.MAX_SAFE_INTEGER : stage > cursorStage ? 0 : cursorSequence
	};
}
function fillMessageStream(stream, params) {
	if (stream.buffered.length > 0 || stream.exhausted) return;
	const query = {
		runId: params.runId,
		...params.contextId ? { contextId: params.contextId } : {},
		...params.executionId ? { executionId: params.executionId } : {},
		now: params.now,
		database: params.database,
		after: stream.after,
		limit: MESSAGE_STREAM_CHUNK_SIZE
	};
	const events = stream.stage === 2 ? readTerminalEventsForRun(query) : readOutboundMessageProgressForRun({
		...query,
		action: stream.stage === 0 ? "message.outbound.queued" : "message.outbound.platform-started"
	});
	stream.buffered = events.map((event) => ({
		event,
		rowId: compositeMessageRowId(event)
	}));
	stream.exhausted = events.length < MESSAGE_STREAM_CHUNK_SIZE;
	const last = events.at(-1);
	if (last) stream.after = {
		occurredAt: last.occurredAt,
		sequence: last.sequence
	};
}
function takeNextMessageEvent(streams, params) {
	for (const stream of streams) fillMessageStream(stream, params);
	let selected;
	for (const stream of streams) {
		const candidate = stream.buffered[0];
		const current = selected?.buffered[0];
		if (candidate && (!current || compareOwnedMessageEvents(candidate, current) < 0)) selected = stream;
	}
	return selected?.buffered.shift();
}
function hasTerminalCursor(params) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (exact && !tableExists(db, "outbound_message_execution_bindings")) return false;
		let query = deliveryAuditDb(db).selectFrom("audit_events").select("sequence").where("sequence", "=", params.sequence).where("run_id", "=", params.runId).where("occurred_at", "=", params.occurredAt).where("kind", "=", "message").where("direction", "=", "outbound").where("action", "=", "message.outbound.finished");
		if (exact) query = query.where("event_id", "in", terminalBindingEventIds(db, params.runId, exact));
		return Boolean(executeSqliteQueryTakeFirstSync(db, query));
	}, params.database) ?? false;
}
/** Count retained owner-native outbound lifecycle records for one run. */
function countOutboundMessageAuditEventsForRun(params) {
	return (withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const exact = selectMessageExecutionBinding(params);
		if (exact && !tableExists(db, "outbound_message_execution_bindings")) return 0;
		let query = deliveryAuditDb(db).selectFrom("audit_events").select((expression) => expression.fn.countAll().as("count")).where("kind", "=", "message").where("direction", "=", "outbound").where("action", "=", "message.outbound.finished").where("run_id", "=", params.runId).where("occurred_at", ">=", (params.now ?? Date.now()) - 2592e6);
		if (exact) query = query.where("event_id", "in", terminalBindingEventIds(db, params.runId, exact));
		return normalizeSqliteNumber(executeSqliteQueryTakeFirstSync(db, query)?.count ?? null) ?? 0;
	}, params.database) ?? 0) + countOutboundMessageProgressForRun(params);
}
/** Page retained owner-native outbound lifecycle records in decision order. */
function pageOutboundMessageAuditEventsForRun(params) {
	if (params.after) {
		const stage = Math.floor(params.after.rowId / MESSAGE_CURSOR_STAGE_SPAN);
		const sequence = params.after.rowId % MESSAGE_CURSOR_STAGE_SPAN;
		if (!(Number.isSafeInteger(sequence) && sequence >= 1 && stage >= 0 && stage <= 2 ? stage === 2 ? hasTerminalCursor({
			runId: params.runId,
			...params.contextId ? { contextId: params.contextId } : {},
			...params.executionId ? { executionId: params.executionId } : {},
			occurredAt: params.after.occurredAt,
			sequence,
			database: params.database
		}) : hasOutboundMessageProgressCursor({
			runId: params.runId,
			...params.contextId ? { contextId: params.contextId } : {},
			...params.executionId ? { executionId: params.executionId } : {},
			occurredAt: params.after.occurredAt,
			sequence,
			action: stage === 0 ? "message.outbound.queued" : "message.outbound.platform-started",
			database: params.database
		}) : false)) throw new Error("outbound message decision cursor is no longer retained");
	}
	const streams = [
		0,
		1,
		2
	].map((stage) => ({
		stage,
		after: streamAfterCursor(params.after, stage),
		buffered: [],
		exhausted: false
	}));
	const streamParams = {
		runId: params.runId,
		...params.contextId ? { contextId: params.contextId } : {},
		...params.executionId ? { executionId: params.executionId } : {},
		now: params.now ?? Date.now(),
		database: params.database
	};
	let remainingOffset = params.offset ?? 0;
	while (remainingOffset > 0 && takeNextMessageEvent(streams, streamParams)) remainingOffset -= 1;
	const rows = [];
	while (rows.length <= params.limit) {
		const next = takeNextMessageEvent(streams, streamParams);
		if (!next) break;
		rows.push(next);
	}
	const pageRows = rows.slice(0, params.limit);
	const last = pageRows.at(-1);
	return {
		entries: pageRows,
		...rows.length > params.limit && last ? { nextCursor: {
			occurredAt: last.event.occurredAt,
			rowId: last.rowId
		} } : {}
	};
}
//#endregion
//#region src/audit/message-delivery-receipts.ts
function messageOutcome(event) {
	switch (event.outcome) {
		case "queued": return {
			decision: {
				outcome: "allowed",
				reasonCode: "message_queued"
			},
			remediation: [{
				code: "inspect_delivery_progress",
				text: "Inspect this run again to observe the platform and terminal delivery outcome."
			}]
		};
		case "platform_started": return {
			decision: {
				outcome: "allowed",
				reasonCode: "message_platform_started"
			},
			remediation: [{
				code: "inspect_delivery_result",
				text: "Inspect this run again for a delivered, failed, or unknown terminal outcome."
			}]
		};
		case "sent": return {
			decision: {
				outcome: "allowed",
				reasonCode: "message_delivered"
			},
			remediation: []
		};
		case "suppressed": return {
			decision: {
				outcome: "not-applicable",
				reasonCode: `message_suppressed_${event.reasonCode}`
			},
			remediation: [{
				code: "revise_suppressed_message",
				text: "Revise the outbound content or remove the suppressing hook before retrying."
			}]
		};
		case "failed": return {
			decision: {
				outcome: "unknown",
				reasonCode: `message_delivery_failed_${event.failureStage}`
			},
			remediation: [{
				code: "inspect_delivery_failure",
				text: "Inspect channel configuration and delivery logs before retrying the message."
			}]
		};
		case "unknown": return {
			decision: {
				outcome: "unknown",
				reasonCode: `message_delivery_unknown_${event.failureStage}`
			},
			remediation: [{
				code: "reconcile_delivery_outcome",
				text: "Reconcile the platform delivery outcome before retrying to avoid a duplicate message."
			}]
		};
	}
	throw new Error("unsupported outbound message outcome");
}
function projectMessageDeliveryReceipt(event, context) {
	const resourceRef = `channel:${event.channel}`;
	const outcome = messageOutcome(event);
	return {
		schemaVersion: 1,
		receiptId: `message:${event.eventId}`,
		contextId: context.contextId,
		executionId: context.executionId,
		runId: context.runId,
		actionId: event.eventId,
		occurredAt: event.occurredAt,
		action: {
			family: "message",
			operation: "send",
			...resourceRef.length <= 256 ? { resourceRef } : {},
			...event.targetRef ? { targetRef: event.targetRef } : {},
			summary: `Outbound message lifecycle: ${event.outcome.replaceAll("_", "-")}.`
		},
		decision: outcome.decision,
		enforcement: {
			coverageState: "attribution-only",
			evaluatorRef: "outbound-delivery",
			policyRefs: [],
			grantRefs: [],
			contextFieldsUsed: [
				"contextId",
				"executionId",
				"runId"
			]
		},
		source: {
			owner: event.action === "message.outbound.finished" ? "audit_events" : "outbound_message_progress",
			recordRef: event.eventId,
			decisionBoundary: event.action
		},
		missingEvidence: [],
		remediation: outcome.remediation
	};
}
function summarizeMessageDeliveryReceiptsForRun(params) {
	const count = countOutboundMessageAuditEventsForRun({
		runId: params.context.runId,
		contextId: params.context.contextId,
		executionId: params.context.executionId,
		now: params.options.now,
		database: params.options
	});
	return {
		count,
		...count > 0 ? { coverageState: "attribution-only" } : {},
		missingEvidence: []
	};
}
function pageMessageDeliveryReceiptsForRun(params) {
	const page = pageOutboundMessageAuditEventsForRun({
		runId: params.context.runId,
		contextId: params.context.contextId,
		executionId: params.context.executionId,
		after: params.after,
		offset: params.offset,
		limit: params.limit,
		now: params.options.now,
		database: params.options
	});
	return {
		entries: page.entries.map(({ event, rowId }) => ({
			receipt: projectMessageDeliveryReceipt(event, params.context),
			selectorId: `message-decision:${rowId}`
		})),
		...page.nextCursor ? { nextCursor: page.nextCursor } : {}
	};
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
	const match = /^([amgctf]):(0|[1-9]\d*):(0|[1-9]\d*)$/.exec(value);
	if (!match) return null;
	const occurredAt = Number(match[2]);
	const rowId = Number(match[3]);
	if (!Number.isSafeInteger(occurredAt) || !Number.isSafeInteger(rowId)) return null;
	return {
		stage: match[1] === "a" ? "approval" : match[1] === "m" ? "message" : match[1] === "g" ? "generic" : match[1] === "c" ? "cron" : match[1] === "t" ? "task" : "flow",
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
	return `${{
		approval: "a",
		message: "m",
		generic: "g",
		cron: "c",
		task: "t",
		flow: "f"
	}[stage]}:${cursor?.occurredAt ?? 0}:${cursor?.rowId ?? 0}`;
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
function projectDecisionDisplay({ receipt, provenance, selectorId }) {
	if (provenance.state === "unverified") return {
		schemaVersion: 1,
		selectorId,
		occurredAt: receipt.occurredAt,
		action: {
			family: "decision",
			operation: "record"
		},
		decision: {
			outcome: "unknown",
			reasonCode: "decision_fact_display_unverified"
		},
		enforcement: {
			coverageState: "unknown",
			policyCount: 0,
			grantCount: 0,
			contextFieldsUsed: []
		},
		provenance,
		missingEvidence: ["decision.display_provenance"],
		remediation: []
	};
	const counts = {
		policyCount: receipt.enforcement.policyRefs.length,
		grantCount: receipt.enforcement.grantRefs.length
	};
	return {
		schemaVersion: 1,
		selectorId,
		occurredAt: receipt.occurredAt,
		action: {
			family: receipt.action.family,
			operation: receipt.action.operation,
			...receipt.action.summary ? { summary: receipt.action.summary } : {}
		},
		decision: receipt.decision,
		enforcement: {
			coverageState: receipt.enforcement.coverageState,
			...counts,
			contextFieldsUsed: receipt.enforcement.contextFieldsUsed
		},
		provenance,
		missingEvidence: receipt.missingEvidence,
		remediation: receipt.remediation
	};
}
function presentExecutionDecisionReceipts(params) {
	const cursor = parseDecisionCursor(params.decisionCursor);
	if (cursor === null) throw new ExecutionDecisionCursorError();
	const decisionLimit = params.decisionLimit ?? 50;
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
	const messageSummary = summarizeMessageDeliveryReceiptsForRun({
		context: params.context,
		options: {
			...params.options,
			now
		}
	});
	const cronSummary = summarizeOwnerLifecycleReceipts({
		stage: "cron",
		context: params.context,
		options: params.options
	});
	const taskSummary = summarizeOwnerLifecycleReceipts({
		stage: "task",
		context: params.context,
		options: params.options
	});
	const flowSummary = summarizeOwnerLifecycleReceipts({
		stage: "flow",
		context: params.context,
		options: params.options
	});
	const stages = [
		{
			stage: "approval",
			count: approvalSummary.count,
			page: ({ after, offset, limit }) => {
				const page = pageOperatorApprovalReceiptsForRun({
					context: {
						contextId: params.context.contextId,
						executionId: params.context.executionId,
						runId: params.context.runId
					},
					after,
					offset,
					limit,
					nowMs: now,
					databaseOptions: params.options
				});
				return {
					entries: page.entries.map((entry) => ({
						receipt: entry.receipt,
						provenance: {
							state: "verified",
							producer: "operator-approval"
						},
						selectorId: entry.selectorId
					})),
					...page.nextCursor ? { nextCursor: page.nextCursor } : {}
				};
			}
		},
		{
			stage: "message",
			count: messageSummary.count,
			page: ({ after, offset, limit }) => {
				const page = pageMessageDeliveryReceiptsForRun({
					context: params.context,
					after,
					offset,
					limit,
					options: {
						...params.options,
						now
					}
				});
				return {
					entries: page.entries.map((entry) => ({
						receipt: entry.receipt,
						provenance: {
							state: "verified",
							producer: "message-delivery"
						},
						selectorId: entry.selectorId
					})),
					...page.nextCursor ? { nextCursor: page.nextCursor } : {}
				};
			}
		},
		{
			stage: "generic",
			count: genericSummary.count,
			page: ({ after, offset, limit }) => {
				const page = pageExecutionDecisionFactsForContext({
					context: params.context,
					after,
					offset,
					limit,
					now,
					database: params.options
				});
				return {
					entries: page.entries.map((entry) => ({
						receipt: entry.receipt,
						provenance: { state: "unverified" },
						selectorId: entry.selectorId
					})),
					...page.nextCursor ? { nextCursor: page.nextCursor } : {}
				};
			}
		},
		...[
			"cron",
			"task",
			"flow"
		].map((stage) => ({
			stage,
			count: {
				cron: cronSummary,
				task: taskSummary,
				flow: flowSummary
			}[stage].count,
			page: ({ after, offset, limit }) => {
				const page = pageOwnerLifecycleReceipts({
					stage,
					context: params.context,
					after,
					offset,
					limit,
					options: params.options
				});
				return {
					entries: page.entries.map((entry) => ({
						receipt: entry.receipt,
						provenance: {
							state: "verified",
							producer: entry.displayProducer
						},
						selectorId: entry.selectorId
					})),
					...page.nextCursor ? { nextCursor: page.nextCursor } : {}
				};
			}
		}))
	];
	const decisions = [];
	let remainingLimit = decisionLimit;
	let nextDecisionCursor;
	if (cursor === void 0 && remainingLimit > 0) {
		decisions.push({
			receipt: admissionDecision(params.context),
			provenance: {
				state: "verified",
				producer: "run-admission"
			},
			selectorId: `${params.context.contextId}:admission`
		});
		remainingLimit -= 1;
		if (remainingLimit === 0 && stages.some((stage) => stage.count > 0)) nextDecisionCursor = formatDecisionCursor("approval");
	}
	let startStage = 0;
	let firstStageOffset;
	if (opaqueCursor) startStage = stages.findIndex((stage) => stage.stage === opaqueCursor.stage);
	else if (legacyOffset !== void 0) {
		let preceding = 0;
		startStage = stages.findIndex((stage) => {
			if (legacyOffset < preceding + stage.count) {
				firstStageOffset = legacyOffset - preceding;
				return true;
			}
			preceding += stage.count;
			return false;
		});
		if (startStage < 0) startStage = stages.length;
	}
	for (let index = startStage; index < stages.length && remainingLimit > 0; index += 1) {
		const stage = stages[index];
		if (!stage) continue;
		let page;
		try {
			page = stage.page({
				...index === startStage && opaqueCursor?.stage === stage.stage ? { after: opaqueCursor.after } : {},
				...index === startStage && firstStageOffset !== void 0 ? { offset: firstStageOffset } : {},
				limit: remainingLimit
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("cursor is no longer retained")) throw new ExecutionDecisionCursorError("decision cursor is no longer retained; restart inspection without --cursor");
			throw error;
		}
		decisions.push(...page.entries);
		remainingLimit -= page.entries.length;
		if (page.nextCursor) {
			nextDecisionCursor = formatDecisionCursor(stage.stage, page.nextCursor);
			break;
		}
		if (remainingLimit === 0) {
			const successor = stages.slice(index + 1).find((candidate) => candidate.count > 0);
			nextDecisionCursor = successor ? formatDecisionCursor(successor.stage) : void 0;
		}
	}
	const ownerCoverage = new Set([
		approvalSummary.coverageState,
		messageSummary.coverageState,
		cronSummary.coverageState,
		taskSummary.coverageState,
		flowSummary.coverageState
	].filter((coverageState) => coverageState !== void 0));
	const hasUnverifiedGenericDecisions = genericSummary.count > 0;
	const boundedEvidence = boundMissingEvidence([
		...params.context.missingEvidence,
		...approvalSummary.missingEvidence,
		...messageSummary.missingEvidence,
		...cronSummary.missingEvidence,
		...taskSummary.missingEvidence,
		...flowSummary.missingEvidence,
		...hasUnverifiedGenericDecisions ? ["decision.display_provenance"] : []
	]);
	const coverageState = boundedEvidence.truncated ? "unknown" : hasUnverifiedGenericDecisions ? "unknown" : ownerCoverage.has("unsupported") ? "unsupported" : ownerCoverage.has("unknown") ? "unknown" : ownerCoverage.has("enforced") ? "enforced" : ownerCoverage.has("attribution-only") ? "attribution-only" : params.context.coverageState;
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
		decisions: decisions.map(({ receipt }) => receipt),
		decisionDisplays: decisions.map(projectDecisionDisplay),
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
	const serializedSpawnFacts = executionIdentitySpawnAdmission({
		operation: "read",
		value: envelope
	});
	const [lineageFacts, spawnMissingEvidence] = serializedSpawnFacts ? executionIdentitySpawnAdmission({
		operation: "parse",
		value: serializedSpawnFacts
	}) : [void 0, []];
	const lineage = lineageFacts ? {
		...typeof lineageFacts.parentContextId === "string" ? { parentContextId: lineageFacts.parentContextId } : {},
		...typeof lineageFacts.parentExecutionId === "string" ? { parentExecutionId: lineageFacts.parentExecutionId } : {},
		...typeof lineageFacts.parentRunId === "string" ? { parentRunId: lineageFacts.parentRunId } : {},
		parentAgentPrincipal: {
			kind: "agent",
			domainRef,
			principalRef: lineageFacts.parentAgentId
		},
		delegationRef: hmacRef(db, "grant", `${domainRef}:delegation`, JSON.stringify([
			lineageFacts.relation,
			lineageFacts.rawRequesterRef,
			lineageFacts.rawControllerRef,
			lineageFacts.localPolicyRefs,
			lineageFacts.targetPolicyRefs
		])),
		depth: lineageFacts.depth
	} : void 0;
	const missingEvidence = uniqueSorted([...envelope.invoker?.state === "present" ? [] : ["invoker.principal"], ...spawnMissingEvidence], (item) => item);
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
		...lineage ? { lineage } : {},
		coverageState: lineage ? "attribution-only" : envelope.invoker?.state === "present" ? "attribution-only" : envelope.invoker?.state === "unknown" ? "unknown" : "unattributed",
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
		decisionDisplays: [],
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
				decisionDisplays: [],
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
export { isExecutionDecisionCursor as a, listAuditEvents as c, isOutboundMessageProgressInput as d, ExecutionDecisionCursorError as i, pruneExpiredAuditEvents as l, processExecutionIdentityAdmissionWork as n, pruneExpiredOutboundMessageProgress as o, pruneExpiredExecutionIdentityContexts as r, recordOutboundMessageProgress as s, inspectExecutionIdentityRun as t, recordAuditEvent as u };
