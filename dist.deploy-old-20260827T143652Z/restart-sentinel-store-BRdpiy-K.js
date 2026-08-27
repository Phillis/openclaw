import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
//#region src/infra/restart-sentinel-store.ts
const RESTART_SENTINEL_KEY = "current";
const RESTART_SENTINEL_REVISION_FLOOR_KEY = "revision-floor";
const UPDATE_INSTALL_RECEIPT_KEY = "latest-update-install";
const RESTART_SENTINEL_KINDS = /* @__PURE__ */ new Set([
	"config-apply",
	"config-auto-recovery",
	"config-patch",
	"update",
	"restart"
]);
const RESTART_SENTINEL_STATUSES = /* @__PURE__ */ new Set([
	"ok",
	"error",
	"skipped"
]);
function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}
function isSafeInteger(value) {
	return typeof value === "number" && Number.isSafeInteger(value);
}
function parseOptionalNullableString(record, key) {
	const value = record[key];
	if (value === void 0 || value === null || typeof value === "string") return value;
	return false;
}
function parseRestartSentinelLog(value) {
	if (!isRecord(value)) return null;
	const stdoutTail = parseOptionalNullableString(value, "stdoutTail");
	const stderrTail = parseOptionalNullableString(value, "stderrTail");
	const exitCode = value.exitCode;
	if (stdoutTail === false || stderrTail === false || exitCode !== void 0 && exitCode !== null && !isSafeInteger(exitCode)) return null;
	const result = {};
	if (stdoutTail !== void 0) result.stdoutTail = stdoutTail;
	if (stderrTail !== void 0) result.stderrTail = stderrTail;
	if (exitCode !== void 0) result.exitCode = exitCode;
	return result;
}
function parseRestartSentinelStep(value) {
	if (!isRecord(value) || typeof value.name !== "string" || typeof value.command !== "string") return null;
	const cwd = parseOptionalNullableString(value, "cwd");
	const durationMs = value.durationMs;
	const log = value.log;
	if (cwd === false || durationMs !== void 0 && durationMs !== null && !isFiniteNumber(durationMs) || log !== void 0 && log !== null && !parseRestartSentinelLog(log)) return null;
	const result = {
		name: value.name,
		command: value.command
	};
	if (cwd !== void 0) result.cwd = cwd;
	if (durationMs !== void 0) result.durationMs = durationMs;
	if (log !== void 0) result.log = log === null ? null : parseRestartSentinelLog(log);
	return result;
}
function parseRestartSentinelStats(value) {
	if (!isRecord(value)) return null;
	const mode = parseOptionalNullableString(value, "mode");
	const root = parseOptionalNullableString(value, "root");
	const handoffId = parseOptionalNullableString(value, "handoffId");
	const reason = parseOptionalNullableString(value, "reason");
	const before = value.before;
	const after = value.after;
	const steps = value.steps;
	const durationMs = value.durationMs;
	if (mode === false || mode === null || root === false || root === null || handoffId === false || handoffId === null || reason === false || value.requiresRestart !== void 0 && typeof value.requiresRestart !== "boolean" || before !== void 0 && before !== null && !isRecord(before) || after !== void 0 && after !== null && !isRecord(after) || steps !== void 0 && (!Array.isArray(steps) || steps.some((step) => !parseRestartSentinelStep(step))) || durationMs !== void 0 && durationMs !== null && !isFiniteNumber(durationMs)) return null;
	const result = {};
	if (mode !== void 0) result.mode = mode;
	if (root !== void 0) result.root = root;
	if (value.requiresRestart !== void 0) result.requiresRestart = value.requiresRestart;
	if (handoffId !== void 0) result.handoffId = handoffId;
	if (before !== void 0) result.before = before;
	if (after !== void 0) result.after = after;
	if (steps !== void 0) result.steps = steps.map((step) => parseRestartSentinelStep(step));
	if (reason !== void 0) result.reason = reason;
	if (durationMs !== void 0) result.durationMs = durationMs;
	return result;
}
function parseRestartSentinelContinuation(value) {
	if (!isRecord(value)) return null;
	if (value.kind === "systemEvent" && typeof value.text === "string") return {
		kind: "systemEvent",
		text: value.text
	};
	if (value.kind === "agentTurn" && typeof value.message === "string") return {
		kind: "agentTurn",
		message: value.message
	};
	return null;
}
function parseRestartSentinelPayload(value) {
	if (!isRecord(value) || !RESTART_SENTINEL_KINDS.has(value.kind) || !RESTART_SENTINEL_STATUSES.has(value.status) || !isSafeInteger(value.ts)) return null;
	const sessionKey = parseOptionalNullableString(value, "sessionKey");
	const threadId = parseOptionalNullableString(value, "threadId");
	const message = parseOptionalNullableString(value, "message");
	const doctorHint = parseOptionalNullableString(value, "doctorHint");
	if (sessionKey === false || sessionKey === null || threadId === false || threadId === null || message === false || doctorHint === false) return null;
	let deliveryContext;
	if (value.deliveryContext !== void 0) {
		if (!isRecord(value.deliveryContext)) return null;
		const channel = parseOptionalNullableString(value.deliveryContext, "channel");
		const to = parseOptionalNullableString(value.deliveryContext, "to");
		const accountId = parseOptionalNullableString(value.deliveryContext, "accountId");
		if (channel === false || channel === null || to === false || to === null || accountId === false || accountId === null) return null;
		deliveryContext = {};
		if (channel !== void 0) deliveryContext.channel = channel;
		if (to !== void 0) deliveryContext.to = to;
		if (accountId !== void 0) deliveryContext.accountId = accountId;
	}
	let continuation;
	if (value.continuation !== void 0) {
		continuation = value.continuation === null ? null : parseRestartSentinelContinuation(value.continuation);
		if (continuation === null && value.continuation !== null) return null;
	}
	let stats;
	if (value.stats !== void 0) {
		stats = value.stats === null ? null : parseRestartSentinelStats(value.stats);
		if (stats === null && value.stats !== null) return null;
	}
	const result = {
		kind: value.kind,
		status: value.status,
		ts: value.ts
	};
	if (sessionKey !== void 0) result.sessionKey = sessionKey;
	if (deliveryContext !== void 0 && Object.keys(deliveryContext).length > 0) result.deliveryContext = deliveryContext;
	if (threadId !== void 0) result.threadId = threadId;
	if (message !== void 0 && message !== null) result.message = message;
	if (continuation !== void 0 && continuation !== null) result.continuation = continuation;
	if (doctorHint !== void 0 && doctorHint !== null) result.doctorHint = doctorHint;
	if (stats !== void 0 && stats !== null) result.stats = stats;
	return result;
}
function parseRestartSentinelEnvelope(value) {
	if (!isRecord(value) || value.version !== 1) return null;
	const payload = parseRestartSentinelPayload(value.payload);
	return payload ? {
		version: 1,
		payload
	} : null;
}
function parseRequiredJson(value) {
	if (value === null) return;
	return safeParseJson(value);
}
function decodeRestartSentinelRow(row) {
	if (row.version !== 1 || !isSafeInteger(row.updated_at_ms)) return null;
	const candidate = {
		kind: row.kind,
		status: row.status,
		ts: row.ts
	};
	if (row.session_key !== null) candidate.sessionKey = row.session_key;
	if (row.thread_id !== null) candidate.threadId = row.thread_id;
	if (row.delivery_channel !== null || row.delivery_to !== null || row.delivery_account_id !== null) candidate.deliveryContext = {
		...row.delivery_channel === null ? {} : { channel: row.delivery_channel },
		...row.delivery_to === null ? {} : { to: row.delivery_to },
		...row.delivery_account_id === null ? {} : { accountId: row.delivery_account_id }
	};
	if (row.message !== null) candidate.message = row.message;
	if (row.continuation_json !== null) {
		const continuation = parseRequiredJson(row.continuation_json);
		if (continuation === void 0) return null;
		candidate.continuation = continuation;
	}
	if (row.doctor_hint !== null) candidate.doctorHint = row.doctor_hint;
	if (row.stats_json !== null) {
		const stats = parseRequiredJson(row.stats_json);
		if (stats === void 0) return null;
		candidate.stats = stats;
	}
	const payload = parseRestartSentinelPayload(candidate);
	return payload ? {
		version: 1,
		payload,
		revision: row.updated_at_ms
	} : null;
}
function readRestartSentinelRowForKeySync(db, sentinelKey) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_restart_sentinel").select([
		"version",
		"kind",
		"status",
		"ts",
		"session_key",
		"thread_id",
		"delivery_channel",
		"delivery_to",
		"delivery_account_id",
		"message",
		"continuation_json",
		"doctor_hint",
		"stats_json",
		"updated_at_ms"
	]).where("sentinel_key", "=", sentinelKey));
	if (!row) return { kind: "missing" };
	const sentinel = decodeRestartSentinelRow(row);
	return sentinel ? {
		kind: "valid",
		sentinel
	} : {
		kind: "invalid",
		revision: row.updated_at_ms
	};
}
function readRestartSentinelRowSync(db) {
	return readRestartSentinelRowForKeySync(db, RESTART_SENTINEL_KEY);
}
function readUpdateInstallReceiptRowSync(db) {
	const current = readRestartSentinelRowForKeySync(db, UPDATE_INSTALL_RECEIPT_KEY);
	return current.kind === "valid" ? current.sentinel : null;
}
function requireValidPayload(payload) {
	const parsed = parseRestartSentinelPayload(payload);
	if (!parsed) throw new TypeError("Invalid restart sentinel payload");
	return parsed;
}
function nextRevision(currentRevision) {
	if (currentRevision !== null && !Number.isSafeInteger(currentRevision)) throw new Error("Restart sentinel revision is outside the safe integer range");
	const revision = Math.max(Date.now(), currentRevision === null ? 0 : currentRevision + 1);
	if (!Number.isSafeInteger(revision)) throw new Error("Restart sentinel revision exhausted the safe integer range");
	return revision;
}
function readRestartSentinelRevisionFloorSync(db) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_restart_sentinel").select("updated_at_ms").where("sentinel_key", "=", RESTART_SENTINEL_REVISION_FLOOR_KEY));
	if (!row) return null;
	if (!Number.isSafeInteger(row.updated_at_ms)) throw new Error("Restart sentinel revision floor is outside the safe integer range");
	return row.updated_at_ms;
}
function maxRevision(left, right) {
	if (left === null) return right;
	if (right === null) return left;
	return Math.max(left, right);
}
function buildRestartSentinelRow(payload, revision, sentinelKey = RESTART_SENTINEL_KEY) {
	return {
		sentinel_key: sentinelKey,
		version: 1,
		kind: payload.kind,
		status: payload.status,
		ts: payload.ts,
		session_key: payload.sessionKey ?? null,
		thread_id: payload.threadId ?? null,
		delivery_channel: payload.deliveryContext?.channel ?? null,
		delivery_to: payload.deliveryContext?.to ?? null,
		delivery_account_id: payload.deliveryContext?.accountId ?? null,
		message: payload.message ?? null,
		continuation_json: payload.continuation ? JSON.stringify(payload.continuation) : null,
		doctor_hint: payload.doctorHint ?? null,
		stats_json: payload.stats ? JSON.stringify(payload.stats) : null,
		payload_json: JSON.stringify(payload),
		updated_at_ms: revision
	};
}
function upsertRestartSentinelRowSync(db, row) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("gateway_restart_sentinel").values(row).onConflict((conflict) => conflict.column("sentinel_key").doUpdateSet({
		version: (eb) => eb.ref("excluded.version"),
		kind: (eb) => eb.ref("excluded.kind"),
		status: (eb) => eb.ref("excluded.status"),
		ts: (eb) => eb.ref("excluded.ts"),
		session_key: (eb) => eb.ref("excluded.session_key"),
		thread_id: (eb) => eb.ref("excluded.thread_id"),
		delivery_channel: (eb) => eb.ref("excluded.delivery_channel"),
		delivery_to: (eb) => eb.ref("excluded.delivery_to"),
		delivery_account_id: (eb) => eb.ref("excluded.delivery_account_id"),
		message: (eb) => eb.ref("excluded.message"),
		continuation_json: (eb) => eb.ref("excluded.continuation_json"),
		doctor_hint: (eb) => eb.ref("excluded.doctor_hint"),
		stats_json: (eb) => eb.ref("excluded.stats_json"),
		payload_json: (eb) => eb.ref("excluded.payload_json"),
		updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms")
	})));
}
function advanceRestartSentinelRevisionFloorSync(db, revision) {
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow({
		kind: "restart",
		status: "skipped",
		ts: revision
	}, revision, RESTART_SENTINEL_REVISION_FLOOR_KEY));
}
function writeRestartSentinelRowSync(db, rawPayload) {
	const payload = requireValidPayload(rawPayload);
	const current = readRestartSentinelRowSync(db);
	const revision = nextRevision(maxRevision(current.kind === "missing" ? null : current.kind === "valid" ? current.sentinel.revision : current.revision, readRestartSentinelRevisionFloorSync(db)));
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow(payload, revision));
	advanceRestartSentinelRevisionFloorSync(db, revision);
	return {
		version: 1,
		payload,
		revision
	};
}
function writeUpdateInstallReceiptRowSync(db, rawPayload) {
	const payload = requireValidPayload(rawPayload);
	if (payload.kind !== "update" || payload.stats?.mode !== "git") throw new TypeError("Update install receipt requires a git update payload");
	const current = readRestartSentinelRowForKeySync(db, UPDATE_INSTALL_RECEIPT_KEY);
	const revision = nextRevision(current.kind === "missing" ? null : current.kind === "valid" ? current.sentinel.revision : current.revision);
	upsertRestartSentinelRowSync(db, buildRestartSentinelRow(payload, revision, UPDATE_INSTALL_RECEIPT_KEY));
	return {
		version: 1,
		payload,
		revision
	};
}
function writeRestartSentinelRowIfRevisionSync(db, rawPayload, expectedRevision) {
	const current = readRestartSentinelRowSync(db);
	if (current.kind !== "valid" || current.sentinel.revision !== expectedRevision) return null;
	const payload = requireValidPayload(rawPayload);
	const revision = nextRevision(maxRevision(expectedRevision, readRestartSentinelRevisionFloorSync(db)));
	const row = buildRestartSentinelRow(payload, revision);
	if (executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("gateway_restart_sentinel").set(row).where("sentinel_key", "=", RESTART_SENTINEL_KEY).where("updated_at_ms", "=", expectedRevision)).numAffectedRows !== 1n) return null;
	advanceRestartSentinelRevisionFloorSync(db, revision);
	return {
		version: 1,
		payload,
		revision
	};
}
function deleteRestartSentinelRowSync(db, expectedRevision) {
	const current = readRestartSentinelRowSync(db);
	if (current.kind === "missing") return false;
	const currentRevision = current.kind === "valid" ? current.sentinel.revision : current.revision;
	if (expectedRevision !== void 0 && currentRevision !== expectedRevision) return false;
	if (!Number.isSafeInteger(currentRevision)) throw new Error("Restart sentinel revision is outside the safe integer range");
	advanceRestartSentinelRevisionFloorSync(db, maxRevision(currentRevision, readRestartSentinelRevisionFloorSync(db)) ?? currentRevision);
	let query = getNodeSqliteKysely(db).deleteFrom("gateway_restart_sentinel").where("sentinel_key", "=", RESTART_SENTINEL_KEY);
	if (expectedRevision !== void 0) query = query.where("updated_at_ms", "=", expectedRevision);
	if (executeSqliteQuerySync(db, query).numAffectedRows !== 1n) throw new Error("Restart sentinel changed during guarded delete");
	return true;
}
//#endregion
export { writeRestartSentinelRowIfRevisionSync as a, readUpdateInstallReceiptRowSync as i, parseRestartSentinelEnvelope as n, writeRestartSentinelRowSync as o, readRestartSentinelRowSync as r, writeUpdateInstallReceiptRowSync as s, deleteRestartSentinelRowSync as t };
