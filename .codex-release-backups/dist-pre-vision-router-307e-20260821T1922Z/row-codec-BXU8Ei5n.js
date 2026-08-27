import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { R as timestampMsToIsoString, f as asSafeIntegerInRange, o as asDateTimestampMs, t as MAX_DATE_TIMESTAMP_MS, x as parseStrictFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.js";
import { c as isRecord, i as asOptionalObjectRecord, o as asRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { O as compileSafeRegex } from "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { g as sanitizeAgentId } from "./session-key-D8GLfPr_.js";
import { An as preprocess, Rn as string, Xn as union, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { Lt as normalizeSqliteNumber } from "./openclaw-state-db-DlCMR4eQ.js";
import { t as parseAbsoluteTimeMs } from "./parse-CXcqOHNZ.js";
import { r as resolveDefaultCronStaggerMs, t as normalizeCronStaggerMs } from "./stagger-DfgzUk9D.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/cron/store/key.ts
/** Cron store key normalization for SQLite partitions. */
/** Returns the canonical per-file SQLite partition key for cron store rows. */
function cronStoreKey(storePath) {
	return path.resolve(storePath);
}
//#endregion
//#region src/cron/normalize-job-identity.ts
/** Repairs legacy cron job identity fields into the canonical id shape. */
/** Normalizes mutable cron job rows from old `jobId` storage into the canonical `id` field. */
function normalizeCronJobIdentityFields(raw) {
	const rawId = normalizeOptionalString(raw.id) ?? "";
	const legacyJobId = normalizeOptionalString(raw.jobId) ?? "";
	const hadJobIdKey = "jobId" in raw;
	const normalizedId = rawId || legacyJobId;
	const idChanged = Boolean(normalizedId && raw.id !== normalizedId);
	if (idChanged) raw.id = normalizedId;
	if (hadJobIdKey) delete raw.jobId;
	return {
		mutated: idChanged || hadJobIdKey,
		legacyJobIdIssue: hadJobIdKey
	};
}
//#endregion
//#region src/cron/delivery-defaults.ts
/** Shared create- and run-time defaults for cron result delivery. */
/**
* Keep create-time normalization, direct service persistence, and run-time
* planning on one target policy; disagreement silently drops cron results.
*/
function shouldDefaultCronDeliveryToAnnounce(params) {
	if (params.payloadKind !== "agentTurn" && params.payloadKind !== "command" && params.payloadKind !== "script") return false;
	return params.sessionTarget === "isolated" || params.sessionTarget === "current" || typeof params.sessionTarget === "string" && params.sessionTarget.startsWith("session:");
}
//#endregion
//#region src/cron/delivery-field-schemas.ts
/** Parses user-provided cron delivery fields into narrow runtime values. */
const trimStringPreprocess = (value) => typeof value === "string" ? value.trim() : value;
const trimLowercaseStringPreprocess = (value) => normalizeOptionalLowercaseString(value) ?? value;
const DeliveryModeFieldSchema = preprocess(trimLowercaseStringPreprocess, _enum([
	"deliver",
	"announce",
	"none",
	"webhook"
])).transform((value) => value === "deliver" ? "announce" : value);
/** Accepts non-empty string fields after trimming and lowercasing user-provided delivery input. */
const LowercaseNonEmptyStringFieldSchema = preprocess(trimLowercaseStringPreprocess, string().min(1));
/** Accepts non-empty string fields after trimming delivery input without changing case. */
const TrimmedNonEmptyStringFieldSchema = preprocess(trimStringPreprocess, string().min(1));
/** Accepts delivery thread identifiers as either trimmed strings or finite numeric ids. */
const DeliveryThreadIdFieldSchema = union([TrimmedNonEmptyStringFieldSchema, number().finite()]);
/** Accepts non-negative finite timeout seconds from cron delivery payloads. */
const TimeoutSecondsFieldSchema = number().finite().nonnegative();
/** Parses optional cron delivery fields while dropping invalid values instead of throwing. */
function parseDeliveryInput(input) {
	return {
		mode: parseOptionalField(DeliveryModeFieldSchema, input.mode),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, input.channel),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema, input.threadId),
		accountId: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.accountId)
	};
}
/** Returns a parsed field value only when the supplied schema accepts it. */
function parseOptionalField(schema, value) {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
//#endregion
//#region src/cron/normalize-payload.ts
function normalizeTrimmedStringArray(value, options) {
	if (Array.isArray(value)) {
		const normalized = normalizeTrimmedStringList(value);
		if (normalized.length === 0 && value.length > 0) return;
		return normalized;
	}
	if (options?.allowNull && value === null) return null;
}
function normalizeCommandEnv(value) {
	if (!isRecord(value)) throw new Error("command env must be an object with non-blank keys and string values");
	const entries = [];
	for (const [rawKey, rawValue] of Object.entries(value)) {
		const key = normalizeOptionalString(rawKey);
		if (!key || typeof rawValue !== "string") throw new Error("command env must be an object with non-blank keys and string values");
		entries.push([key, rawValue]);
	}
	return Object.fromEntries(entries);
}
function normalizeCronCommandArgv(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	if (value.some((entry) => typeof entry !== "string" || entry.length === 0)) return;
	return [...value];
}
function hasAgentTurnOnlyPayloadHint(payload) {
	return "model" in payload || "fallbacks" in payload || "thinking" in payload || "timeoutSeconds" in payload || typeof payload.lightContext === "boolean" || typeof payload.allowUnsafeExternalContent === "boolean";
}
function normalizeCronPayload(payload) {
	const next = { ...payload };
	const kindRaw = normalizeLowercaseStringOrEmpty(next.kind);
	if (kindRaw === "agentturn") next.kind = "agentTurn";
	else if (kindRaw === "systemevent") next.kind = "systemEvent";
	else if (kindRaw === "command") next.kind = "command";
	else if (kindRaw === "script") next.kind = "script";
	else if (kindRaw) next.kind = kindRaw;
	if (typeof next.message === "string") {
		const trimmed = normalizeOptionalString(next.message) ?? "";
		if (trimmed) next.message = trimmed;
		else next.message = "";
	}
	if (typeof next.text === "string") {
		const trimmed = normalizeOptionalString(next.text) ?? "";
		if (trimmed) next.text = trimmed;
		else next.text = "";
	}
	if (typeof next.script === "string") next.script = next.script.trim();
	if ("model" in next) if (next.model === null) next.model = null;
	else {
		const model = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.model);
		if (model !== void 0) next.model = model;
		else delete next.model;
	}
	if ("thinking" in next) if (next.thinking === null) next.thinking = null;
	else {
		const thinking = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.thinking);
		if (thinking !== void 0) next.thinking = thinking;
		else delete next.thinking;
	}
	if ("timeoutSeconds" in next) {
		const timeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.timeoutSeconds);
		if (timeoutSeconds !== void 0) next.timeoutSeconds = timeoutSeconds;
		else delete next.timeoutSeconds;
	}
	if ("fallbacks" in next) {
		const fallbacks = normalizeTrimmedStringArray(next.fallbacks, { allowNull: true });
		if (fallbacks !== void 0) next.fallbacks = fallbacks;
		else delete next.fallbacks;
	}
	if ("toolsAllow" in next) {
		const toolsAllow = normalizeTrimmedStringArray(next.toolsAllow, { allowNull: true });
		if (toolsAllow !== void 0) next.toolsAllow = toolsAllow;
		else delete next.toolsAllow;
	}
	if ("argv" in next) {
		const argv = normalizeCronCommandArgv(next.argv);
		if (Array.isArray(argv) && argv.length > 0) next.argv = argv;
		else delete next.argv;
	}
	if ("cwd" in next) {
		const cwd = parseOptionalField(TrimmedNonEmptyStringFieldSchema, next.cwd);
		if (cwd !== void 0) next.cwd = cwd;
		else delete next.cwd;
	}
	if ("env" in next) next.env = normalizeCommandEnv(next.env);
	if ("input" in next && typeof next.input !== "string") delete next.input;
	if ("noOutputTimeoutSeconds" in next) {
		const noOutputTimeoutSeconds = parseOptionalField(TimeoutSecondsFieldSchema, next.noOutputTimeoutSeconds);
		if (noOutputTimeoutSeconds !== void 0) next.noOutputTimeoutSeconds = noOutputTimeoutSeconds;
		else delete next.noOutputTimeoutSeconds;
	}
	if ("outputMaxBytes" in next) {
		const outputMaxBytes = parseOptionalField(TimeoutSecondsFieldSchema, next.outputMaxBytes);
		if (outputMaxBytes !== void 0 && outputMaxBytes > 0) next.outputMaxBytes = Math.floor(outputMaxBytes);
		else delete next.outputMaxBytes;
	}
	if ("toolBudget" in next) {
		const toolBudget = parseOptionalField(TimeoutSecondsFieldSchema, next.toolBudget);
		if (toolBudget !== void 0 && toolBudget > 0) next.toolBudget = Math.floor(toolBudget);
		else delete next.toolBudget;
	}
	if ("allowUnsafeExternalContent" in next && typeof next.allowUnsafeExternalContent !== "boolean") delete next.allowUnsafeExternalContent;
	if (!("kind" in next) && typeof next.text === "string" && hasAgentTurnOnlyPayloadHint(next)) {
		next.kind = "agentTurn";
		next.message = next.text;
	}
	if (next.kind === "systemEvent") {
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.timeoutSeconds;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "agentTurn") {
		delete next.text;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "command") {
		delete next.text;
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.script;
		delete next.toolBudget;
	} else if (next.kind === "script") {
		delete next.text;
		delete next.message;
		delete next.model;
		delete next.fallbacks;
		delete next.thinking;
		delete next.lightContext;
		delete next.allowUnsafeExternalContent;
		delete next.argv;
		delete next.cwd;
		delete next.env;
		delete next.input;
		delete next.noOutputTimeoutSeconds;
		delete next.outputMaxBytes;
	}
	return next;
}
//#endregion
//#region src/cron/runtime-authority.ts
const CRON_RUNTIME_AUTHORITY_MAX_BYTES = 64 * 1024;
const CRON_RUNTIME_AUTHORITY_MAX_ID_LENGTH = 128;
const CRON_RUNTIME_AUTHORITY_MAX_DEPTH = 16;
const CRON_RUNTIME_AUTHORITY_ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/u;
const CRON_RUNTIME_AUTHORITY_KEYS = /* @__PURE__ */ new Set([
	"version",
	"runtimeId",
	"namespace",
	"payload"
]);
function normalizeAuthorityId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= CRON_RUNTIME_AUTHORITY_MAX_ID_LENGTH && CRON_RUNTIME_AUTHORITY_ID_PATTERN.test(normalized) ? normalized : void 0;
}
function cloneJsonValue(value, seen, depth) {
	if (depth > CRON_RUNTIME_AUTHORITY_MAX_DEPTH) return;
	if (value === null || typeof value === "string" || typeof value === "boolean") return value;
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value !== "object") return;
	if (seen.has(value)) return;
	seen.add(value);
	if (Array.isArray(value)) {
		const result = [];
		for (const item of value) {
			const cloned = cloneJsonValue(item, seen, depth + 1);
			if (cloned === void 0) return;
			result.push(cloned);
		}
		seen.delete(value);
		return result;
	}
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) return;
	const result = Object.create(null);
	for (const [key, item] of Object.entries(value)) {
		const cloned = cloneJsonValue(item, seen, depth + 1);
		if (cloned === void 0) return;
		result[key] = cloned;
	}
	seen.delete(value);
	return result;
}
function cloneJsonObject(value) {
	if (!isRecord(value) || Array.isArray(value)) return;
	const cloned = cloneJsonValue(value, /* @__PURE__ */ new WeakSet(), 0);
	return isRecord(cloned) && !Array.isArray(cloned) ? cloned : void 0;
}
function deepFreezeJson(value) {
	if (value && typeof value === "object") {
		for (const item of Array.isArray(value) ? value : Object.values(value)) deepFreezeJson(item);
		Object.freeze(value);
	}
	return value;
}
/** Validates the private persisted transport without learning runtime-owned payload semantics. */
function normalizeCronRuntimeAuthority(value) {
	if (!isRecord(value) || value.version !== 1 || Object.keys(value).some((key) => !CRON_RUNTIME_AUTHORITY_KEYS.has(key)) || !Object.hasOwn(value, "runtimeId") || !Object.hasOwn(value, "namespace") || !Object.hasOwn(value, "payload")) return;
	const runtimeId = normalizeAuthorityId(value.runtimeId);
	const namespace = normalizeAuthorityId(value.namespace);
	const payload = cloneJsonObject(value.payload);
	if (!runtimeId || !namespace || !payload) return;
	const normalized = {
		version: 1,
		runtimeId,
		namespace,
		payload: deepFreezeJson(payload)
	};
	if (Buffer.byteLength(JSON.stringify(normalized), "utf8") > CRON_RUNTIME_AUTHORITY_MAX_BYTES) return;
	return Object.freeze(normalized);
}
function cloneCronRuntimeAuthority(value) {
	return normalizeCronRuntimeAuthority(value);
}
//#endregion
//#region src/cron/schedule-number.ts
/** Coerces cron schedule time fields with strict Date-range parsing. */
/** Coerces temporal schedule fields without accepting partial, non-finite, or invalid-Date values. */
function coerceFiniteScheduleNumber(value) {
	return asDateTimestampMs(parseStrictFiniteNumber(value));
}
//#endregion
//#region src/cron/scheduled-tool-policy.ts
/** Creates provenance for an authenticated operator or trusted in-process caller. */
function createTrustedCronScheduledToolPolicy() {
	return {
		version: 1,
		mode: "trusted"
	};
}
/** Creates requester-scoped provenance from an authenticated account identity. */
function createAccountCronScheduledToolPolicy(params) {
	const ownerSessionKey = normalizeOptionalString(params.ownerSessionKey);
	const ownerAccountId = normalizeOptionalAccountId(params.ownerAccountId);
	if (!ownerSessionKey || !ownerAccountId) return;
	return {
		version: 1,
		mode: "account",
		ownerSessionKey,
		ownerAccountId
	};
}
/** Accepts only the current closed provenance shape; unknown versions fail closed. */
function normalizeCronScheduledToolPolicy(value) {
	if (!isRecord(value) || value.version !== 1) return;
	if (value.mode === "trusted") return Object.keys(value).every((key) => key === "version" || key === "mode") ? createTrustedCronScheduledToolPolicy() : void 0;
	if (value.mode !== "account") return;
	const policy = createAccountCronScheduledToolPolicy({
		ownerSessionKey: typeof value.ownerSessionKey === "string" ? value.ownerSessionKey : "",
		ownerAccountId: typeof value.ownerAccountId === "string" ? value.ownerAccountId : ""
	});
	if (!policy) return;
	return Object.keys(value).every((key) => key === "version" || key === "mode" || key === "ownerSessionKey" || key === "ownerAccountId") ? policy : void 0;
}
/** Resolves trusted provenance only when it is consistent with the persisted job owner. */
function resolveCronScheduledToolPolicy(params) {
	if (params.toolsAllow === void 0) return;
	const policy = normalizeCronScheduledToolPolicy(params.scheduledToolPolicy);
	if (!policy || policy.mode === "trusted") return policy;
	const ownerSessionKey = normalizeOptionalString(params.owner?.sessionKey);
	const ownerAccountId = normalizeOptionalAccountId(params.owner?.accountId);
	return ownerSessionKey === policy.ownerSessionKey && ownerAccountId === policy.ownerAccountId ? policy : void 0;
}
//#endregion
//#region src/cron/service/normalize.ts
/** Name, agent id, and payload text normalization helpers for cron service ops. */
/** Normalizes a required cron job name and throws the public validation error when absent. */
function normalizeRequiredName(raw) {
	if (typeof raw !== "string") throw new Error("automation name is required");
	const name = raw.trim();
	if (!name) throw new Error("automation name is required");
	return name;
}
function truncateText(input, maxLen) {
	return truncateWithMarker(input, maxLen, {
		marker: "…",
		reserve: 1,
		trimEnd: true
	});
}
/** Infers a compact cron job name from payload text first, then schedule shape. */
function inferCronJobName(job) {
	const firstLine = (job?.payload?.kind === "systemEvent" && typeof job.payload.text === "string" ? job.payload.text : job?.payload?.kind === "agentTurn" && typeof job.payload.message === "string" ? job.payload.message : job?.payload?.kind === "command" && Array.isArray(job.payload.argv) ? job.payload.argv.join(" ") : "").split("\n").map((l) => l.trim()).find(Boolean) ?? "";
	if (firstLine) return truncateText(firstLine, 60);
	const kind = typeof job?.schedule?.kind === "string" ? job.schedule.kind : "";
	if (kind === "cron" && typeof job?.schedule?.expr === "string") return `Cron: ${truncateText(job.schedule.expr, 52)}`;
	if (kind === "every" && typeof job?.schedule?.everyMs === "number") return `Every: ${job.schedule.everyMs}ms`;
	if (kind === "at") return "One-shot";
	return "Automation";
}
/** Extracts the executable text from cron payload variants for main-session queueing. */
function normalizePayloadToSystemText(payload) {
	if (payload.kind === "systemEvent") return typeof payload.text === "string" ? payload.text.trim() : "";
	return payload.kind === "agentTurn" && typeof payload.message === "string" ? payload.message.trim() : "";
}
//#endregion
//#region src/cron/session-target.ts
/** Resolves and validates session-target keys used by cron jobs and delivery. */
const INVALID_CRON_SESSION_TARGET_ID_ERROR = "invalid cron sessionTarget session id";
/** Returns whether an error came from cron session target id validation. */
function isInvalidCronSessionTargetIdError(error) {
	return error instanceof Error && error.message === INVALID_CRON_SESSION_TARGET_ID_ERROR;
}
/** Validates the opaque session id portion of a `session:` cron target. */
function assertSafeCronSessionTargetId(sessionId) {
	const trimmed = sessionId.trim();
	if (!trimmed) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
	if (trimmed.includes("\0")) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
	return trimmed;
}
/** Extracts the persistent session key from a `session:` cron target, if present. */
function resolveCronSessionTargetSessionKey(sessionTarget) {
	if (typeof sessionTarget !== "string" || !sessionTarget.startsWith("session:")) return;
	return assertSafeCronSessionTargetId(sessionTarget.slice(8));
}
/** Returns whether cron executes the job in a detached run session. */
function isDetachedCronSessionTarget(sessionTarget) {
	return sessionTarget === "isolated" || sessionTarget === "current";
}
/** Preserves `current` with a creation-time sessionKey so future active UI state is irrelevant. */
function resolveCronCurrentSessionTarget(params) {
	if (params.sessionTarget !== "current") return params.sessionTarget ?? void 0;
	return params.sessionKey?.trim() ? "current" : "isolated";
}
/** Chooses the session key used for cron delivery, preferring explicit persistent targets. */
function resolveCronDeliverySessionKey(job) {
	const sessionTargetKey = resolveCronSessionTargetSessionKey(job.sessionTarget);
	if (sessionTargetKey) return sessionTargetKey;
	return typeof job.sessionKey === "string" && job.sessionKey.trim() ? job.sessionKey.trim() : void 0;
}
/** Returns the notification session key, falling back to a stable per-job failure session. */
function resolveCronNotificationSessionKey(params) {
	return typeof params.sessionKey === "string" && params.sessionKey.trim() ? params.sessionKey.trim() : `cron:${params.jobId}:failure`;
}
//#endregion
//#region src/cron/stream-schedule.ts
const DEFAULT_CRON_STREAM_BATCH_MS = 250;
const MIN_CRON_STREAM_BATCH_MS = 50;
const MAX_CRON_STREAM_BATCH_MS = 5e3;
const DEFAULT_CRON_STREAM_MAX_BATCH_BYTES = 16384;
const MIN_CRON_STREAM_MAX_BATCH_BYTES = 1024;
const MAX_CRON_STREAM_MAX_BATCH_BYTES = 65536;
const CRON_STREAM_TRUNCATED_MARKER = "[truncated]";
/** Opaque identity for one logical stream source across child-process restarts. */
function createCronStreamSourceIdentity() {
	return randomUUID();
}
function clampInteger(value, fallback, min, max) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error("stream schedule batching values must be integers");
	return Math.max(min, Math.min(max, value));
}
/** Resolve stream batching defaults without rewriting omitted public fields. */
function resolveCronStreamBatching(schedule) {
	return {
		batchMs: clampInteger(schedule.batchMs, DEFAULT_CRON_STREAM_BATCH_MS, MIN_CRON_STREAM_BATCH_MS, MAX_CRON_STREAM_BATCH_MS),
		maxBatchBytes: clampInteger(schedule.maxBatchBytes, DEFAULT_CRON_STREAM_MAX_BATCH_BYTES, MIN_CRON_STREAM_MAX_BATCH_BYTES, MAX_CRON_STREAM_MAX_BATCH_BYTES)
	};
}
/** Stable key for the source definition, with omitted defaults resolved. */
function cronStreamScheduleKey(schedule) {
	const batching = resolveCronStreamBatching(schedule);
	return JSON.stringify({
		command: schedule.command,
		cwd: schedule.cwd,
		mode: schedule.mode ?? "line",
		match: schedule.match,
		batchMs: batching.batchMs,
		maxBatchBytes: batching.maxBatchBytes
	});
}
/** Clamp explicitly supplied stream batching fields during create/update normalization. */
function normalizeCronStreamBatching(schedule) {
	if (schedule.batchMs !== void 0) {
		if (typeof schedule.batchMs !== "number" || !Number.isSafeInteger(schedule.batchMs)) throw new Error("stream schedule batchMs must be an integer");
		schedule.batchMs = clampInteger(schedule.batchMs, DEFAULT_CRON_STREAM_BATCH_MS, MIN_CRON_STREAM_BATCH_MS, MAX_CRON_STREAM_BATCH_MS);
	}
	if (schedule.maxBatchBytes !== void 0) {
		if (typeof schedule.maxBatchBytes !== "number" || !Number.isSafeInteger(schedule.maxBatchBytes)) throw new Error("stream schedule maxBatchBytes must be an integer");
		schedule.maxBatchBytes = clampInteger(schedule.maxBatchBytes, DEFAULT_CRON_STREAM_MAX_BATCH_BYTES, MIN_CRON_STREAM_MAX_BATCH_BYTES, MAX_CRON_STREAM_MAX_BATCH_BYTES);
	}
}
function renderTruncatedCronStreamBatch(text, maxBytes) {
	const markerBytes = Buffer.byteLength(CRON_STREAM_TRUNCATED_MARKER, "utf8");
	const contentBudget = Math.max(0, maxBytes - markerBytes);
	let low = 0;
	let high = text.length;
	while (low < high) {
		const mid = Math.ceil((low + high) / 2);
		const candidate = truncateUtf16Safe(text, mid);
		if (Buffer.byteLength(candidate, "utf8") <= contentBudget) low = mid;
		else high = mid - 1;
	}
	return `${truncateUtf16Safe(text, low)}${CRON_STREAM_TRUNCATED_MARKER}`;
}
/** Render known-truncated source text without exposing the marker to match filters. */
function markCronStreamBatchTruncated(text, maxBytes) {
	return renderTruncatedCronStreamBatch(text, maxBytes);
}
/** Keep a UTF-8 batch inside its byte budget and reserve room for the marker. */
function truncateCronStreamBatch(text, maxBytes) {
	return Buffer.byteLength(text, "utf8") <= maxBytes ? text : renderTruncatedCronStreamBatch(text, maxBytes);
}
/** Append event text through the same payload seam used by trigger messages. */
function appendCronPayloadText(payload, text) {
	if (payload.kind === "systemEvent") return {
		...payload,
		text: `${payload.text}\n\n${text}`
	};
	if (payload.kind === "agentTurn") return {
		...payload,
		message: `${payload.message}\n\n${text}`
	};
	return payload;
}
//#endregion
//#region src/cron/normalize.ts
/** Normalizes cron create/patch payloads before validation and persistence. */
const DEFAULT_OPTIONS = { applyDefaults: false };
function coerceSchedule(schedule) {
	const next = { ...schedule };
	const rawKind = normalizeLowercaseStringOrEmpty(schedule.kind);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" || rawKind === "on-exit" || rawKind === "stream" ? rawKind : void 0;
	const exprRaw = normalizeOptionalString(schedule.expr) ?? "";
	const timezone = normalizeOptionalString(schedule.tz);
	const commandRaw = normalizeOptionalString(schedule.command) ?? "";
	const streamCommand = normalizeCronCommandArgv(schedule.command);
	const cwdRaw = normalizeOptionalString(schedule.cwd) ?? "";
	const streamMode = normalizeOptionalLowercaseString(schedule.mode);
	const streamMatch = typeof schedule.match === "string" ? schedule.match : void 0;
	const everyMs = coerceFiniteScheduleNumber(schedule.everyMs);
	const anchorMs = coerceFiniteScheduleNumber(schedule.anchorMs);
	const atString = normalizeOptionalString(schedule.at) ?? "";
	const parsedAtMs = atString ? parseAbsoluteTimeMs(atString) : null;
	if (kind) next.kind = kind;
	const parsedAtIso = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
	if (atString) next.at = parsedAtIso ?? atString;
	else if (parsedAtIso !== void 0) next.at = parsedAtIso;
	if (exprRaw) next.expr = exprRaw;
	else if ("expr" in next) delete next.expr;
	if (timezone) next.tz = timezone;
	else if ("tz" in next) delete next.tz;
	if (everyMs !== void 0 && everyMs >= 1) next.everyMs = Math.floor(everyMs);
	if (anchorMs !== void 0 && anchorMs >= 0) next.anchorMs = Math.floor(anchorMs);
	if (kind === "stream" && streamCommand) next.command = streamCommand;
	else if (commandRaw) next.command = commandRaw;
	else if ("command" in next) delete next.command;
	if (cwdRaw) next.cwd = cwdRaw;
	else if ("cwd" in next) delete next.cwd;
	if (kind === "stream") {
		if (streamMode === "line" || streamMode === "match") next.mode = streamMode;
		else if ("mode" in next) delete next.mode;
		if (streamMatch !== void 0) next.match = streamMatch;
		else if ("match" in next) delete next.match;
		normalizeCronStreamBatching(next);
	}
	const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
	if (staggerMs !== void 0) next.staggerMs = staggerMs;
	else if ("staggerMs" in next) delete next.staggerMs;
	if (next.kind === "at") {
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	} else if (next.kind === "every") {
		delete next.at;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	} else if (next.kind === "cron") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.command;
		delete next.cwd;
	} else if (next.kind === "on-exit") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
		delete next.mode;
		delete next.match;
		delete next.batchMs;
		delete next.maxBatchBytes;
	} else if (next.kind === "stream") {
		delete next.at;
		delete next.everyMs;
		delete next.anchorMs;
		delete next.expr;
		delete next.tz;
		delete next.staggerMs;
	}
	if (next.kind !== "on-exit" && next.kind !== "stream") {
		delete next.command;
		delete next.cwd;
	}
	if (next.kind !== "stream") {
		delete next.mode;
		delete next.match;
		delete next.batchMs;
		delete next.maxBatchBytes;
	}
	return next;
}
function coerceTrigger(trigger) {
	const script = typeof trigger.script === "string" ? trigger.script.trim() : "";
	const once = parseBoolean(trigger.once);
	return {
		script,
		...once !== void 0 ? { once } : {}
	};
}
function coerceDelivery(delivery) {
	const next = { ...delivery };
	const parsed = parseDeliveryInput(delivery);
	if (parsed.mode !== void 0) next.mode = parsed.mode;
	else if ("mode" in next) delete next.mode;
	if ("channel" in delivery && delivery.channel === null) next.channel = null;
	else if (parsed.channel !== void 0) next.channel = parsed.channel;
	else if ("channel" in next) delete next.channel;
	if ("to" in delivery && delivery.to === null) next.to = null;
	else if (parsed.to !== void 0) next.to = parsed.to;
	else if ("to" in next) delete next.to;
	if ("threadId" in delivery && delivery.threadId === null) next.threadId = null;
	else if (parsed.threadId !== void 0) next.threadId = parsed.threadId;
	else if ("threadId" in next) delete next.threadId;
	if ("accountId" in delivery && delivery.accountId === null) next.accountId = null;
	else if (parsed.accountId !== void 0) next.accountId = parsed.accountId;
	else if ("accountId" in next) delete next.accountId;
	if ("failureDestination" in next) if (next.failureDestination === null) next.failureDestination = null;
	else if (isRecord(next.failureDestination)) next.failureDestination = coerceFailureDestination(next.failureDestination);
	else delete next.failureDestination;
	if ("completionDestination" in next) if (next.completionDestination === null) next.completionDestination = null;
	else {
		const completionDestination = isRecord(next.completionDestination) ? coerceCompletionDestination(next.completionDestination) : null;
		if (completionDestination) next.completionDestination = completionDestination;
		else delete next.completionDestination;
	}
	return next;
}
function coerceCompletionDestination(value) {
	const mode = normalizeOptionalLowercaseString(value.mode);
	const to = normalizeOptionalString(value.to);
	if (mode !== "webhook") return null;
	return {
		mode,
		...to ? { to } : {}
	};
}
function coerceFailureDestination(value) {
	const next = { ...value };
	if ("channel" in next) if (next.channel === null) next.channel = null;
	else if (next.channel === void 0) next.channel = void 0;
	else {
		const channel = normalizeOptionalLowercaseString(next.channel);
		if (channel) next.channel = channel;
		else delete next.channel;
	}
	if ("to" in next) if (next.to === null) next.to = null;
	else if (next.to === void 0) next.to = void 0;
	else {
		const to = normalizeOptionalString(next.to);
		if (to) next.to = to;
		else delete next.to;
	}
	if ("accountId" in next) if (next.accountId === null) next.accountId = null;
	else if (next.accountId === void 0) next.accountId = void 0;
	else {
		const accountId = normalizeOptionalString(next.accountId);
		if (accountId) next.accountId = accountId;
		else delete next.accountId;
	}
	if ("mode" in next) if (next.mode === null) next.mode = null;
	else if (next.mode === void 0) next.mode = void 0;
	else {
		const mode = normalizeOptionalLowercaseString(next.mode);
		if (mode === "announce" || mode === "webhook") next.mode = mode;
		else delete next.mode;
	}
	return next;
}
function normalizeSessionTarget(raw) {
	if (typeof raw !== "string") return;
	const trimmed = raw.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower === "main" || lower === "isolated" || lower === "current") return lower;
	if (lower.startsWith("session:")) return `session:${assertSafeCronSessionTargetId(trimmed.slice(8))}`;
}
function normalizeWakeMode(raw) {
	if (typeof raw !== "string") return;
	const trimmed = normalizeOptionalLowercaseString(raw);
	if (trimmed === "now" || trimmed === "next-heartbeat") return trimmed;
}
/** Normalizes raw cron job input without deciding whether create-time defaults apply. */
function normalizeCronJobInput(raw, options = DEFAULT_OPTIONS) {
	if (!isRecord(raw)) return null;
	const base = raw;
	const next = { ...base };
	for (const field of ["declarationKey", "displayName"]) if (field in base && typeof base[field] === "string") {
		const trimmed = base[field].trim();
		if (trimmed) next[field] = trimmed;
		else delete next[field];
	}
	if (isRecord(base.owner)) {
		const agentId = normalizeOptionalString(base.owner.agentId);
		const sessionKey = normalizeOptionalString(base.owner.sessionKey);
		const accountId = normalizeOptionalAccountId(typeof base.owner.accountId === "string" ? base.owner.accountId : void 0);
		if (agentId || sessionKey || accountId) next.owner = {
			...agentId ? { agentId: sanitizeAgentId(agentId) } : {},
			...sessionKey ? { sessionKey } : {},
			...accountId ? { accountId } : {}
		};
		else delete next.owner;
	}
	if ("scheduledToolPolicy" in base) {
		const scheduledToolPolicy = normalizeCronScheduledToolPolicy(base.scheduledToolPolicy);
		if (scheduledToolPolicy) next.scheduledToolPolicy = scheduledToolPolicy;
		else delete next.scheduledToolPolicy;
	}
	if ("toolsAllowProvenance" in base) {
		const provenance = base.toolsAllowProvenance;
		if (isRecord(provenance) && provenance.version === 1 && provenance.source === "final-executable-surface") next.toolsAllowProvenance = {
			version: 1,
			source: "final-executable-surface"
		};
		else delete next.toolsAllowProvenance;
	}
	if ("runtimeAuthority" in base) {
		const runtimeAuthority = normalizeCronRuntimeAuthority(base.runtimeAuthority);
		if (runtimeAuthority) next.runtimeAuthority = runtimeAuthority;
		else delete next.runtimeAuthority;
	}
	if (base.runtimeAuthorityRecoveryRequired === true) next.runtimeAuthorityRecoveryRequired = true;
	else delete next.runtimeAuthorityRecoveryRequired;
	if ("agentId" in base) {
		const agentId = base.agentId;
		if (agentId === null) next.agentId = null;
		else if (typeof agentId === "string") {
			const trimmed = agentId.trim();
			if (trimmed) next.agentId = sanitizeAgentId(trimmed);
			else delete next.agentId;
		}
	}
	if ("sessionKey" in base) {
		const sessionKey = base.sessionKey;
		if (sessionKey === null) next.sessionKey = null;
		else if (typeof sessionKey === "string") {
			const trimmed = sessionKey.trim();
			if (trimmed) next.sessionKey = trimmed;
			else delete next.sessionKey;
		}
	}
	if ("enabled" in base) {
		const enabled = parseBoolean(base.enabled);
		if (enabled !== void 0) next.enabled = enabled;
	}
	if ("sessionTarget" in base) {
		const normalized = normalizeSessionTarget(base.sessionTarget);
		if (normalized) next.sessionTarget = normalized;
		else delete next.sessionTarget;
	}
	if ("wakeMode" in base) {
		const normalized = normalizeWakeMode(base.wakeMode);
		if (normalized) next.wakeMode = normalized;
		else delete next.wakeMode;
	}
	if (isRecord(base.schedule)) next.schedule = coerceSchedule(base.schedule);
	if (isRecord(base.payload)) next.payload = normalizeCronPayload(base.payload);
	if ("trigger" in base) if (base.trigger === null) next.trigger = null;
	else if (isRecord(base.trigger)) next.trigger = coerceTrigger(base.trigger);
	else delete next.trigger;
	if (isRecord(base.delivery)) next.delivery = coerceDelivery(base.delivery);
	if (options.applyDefaults) {
		if (!next.wakeMode) next.wakeMode = "now";
		if (typeof next.enabled !== "boolean") next.enabled = true;
		if ((typeof next.name !== "string" || !next.name.trim()) && isRecord(next.schedule) && isRecord(next.payload)) next.name = inferCronJobName({
			schedule: next.schedule,
			payload: next.payload
		});
		else if (typeof next.name === "string") {
			const trimmed = next.name.trim();
			if (trimmed) next.name = trimmed;
		}
		if (!next.sessionTarget && isRecord(next.payload)) {
			const kind = typeof next.payload.kind === "string" ? next.payload.kind : "";
			if (kind === "systemEvent" || kind === "heartbeat") next.sessionTarget = "main";
			else if (kind === "agentTurn") next.sessionTarget = "current";
			else if (kind === "command" || kind === "script") next.sessionTarget = "isolated";
		}
		const normalizedSessionTarget = typeof next.sessionTarget === "string" ? next.sessionTarget : void 0;
		const resolvedCurrentSessionKey = options.sessionContext?.sessionKey ?? (typeof next.sessionKey === "string" ? next.sessionKey : void 0);
		const resolvedSessionTarget = resolveCronCurrentSessionTarget({
			sessionTarget: normalizedSessionTarget,
			sessionKey: resolvedCurrentSessionKey
		});
		if (resolvedSessionTarget !== void 0) {
			next.sessionTarget = resolvedSessionTarget;
			if (next.sessionTarget !== "isolated" && normalizedSessionTarget === "current" && resolvedCurrentSessionKey?.trim()) next.sessionKey = assertSafeCronSessionTargetId(resolvedCurrentSessionKey);
		} else delete next.sessionTarget;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "at" && !("deleteAfterRun" in next)) next.deleteAfterRun = true;
		if ("schedule" in next && isRecord(next.schedule) && next.schedule.kind === "cron") {
			const schedule = next.schedule;
			const explicit = normalizeCronStaggerMs(schedule.staggerMs);
			if (explicit !== void 0) schedule.staggerMs = explicit;
			else {
				const defaultStaggerMs = resolveDefaultCronStaggerMs(typeof schedule.expr === "string" ? schedule.expr : "");
				if (defaultStaggerMs !== void 0) schedule.staggerMs = defaultStaggerMs;
			}
		}
		const payload = isRecord(next.payload) ? next.payload : null;
		const payloadKind = payload && typeof payload.kind === "string" ? payload.kind : "";
		const sessionTarget = typeof next.sessionTarget === "string" ? next.sessionTarget : "";
		if (!("delivery" in next && next.delivery !== void 0) && shouldDefaultCronDeliveryToAnnounce({
			payloadKind,
			sessionTarget
		})) next.delivery = { mode: "announce" };
	}
	return next;
}
/** Normalizes a raw cron create request and applies create-time defaults. */
function normalizeCronJobCreate(raw, options) {
	return normalizeCronJobInput(raw, {
		applyDefaults: true,
		...options
	});
}
/** Normalizes a raw cron patch request without filling omitted fields. */
function normalizeCronJobPatch(raw, options) {
	return normalizeCronJobInput(raw, {
		applyDefaults: false,
		...options
	});
}
//#endregion
//#region src/cron/persisted-shape.ts
/** Validates persisted cron job records before loading them from disk/state. */
const CRON_STATE_TIMESTAMP_FIELDS = [
	"nextRunAtMs",
	"scheduleActivatedAtMs",
	"startupCatchupAtMs",
	"pacedNextRunAtMs",
	"forcePreservedNextRunAtMs",
	"queuedAtMs",
	"runningAtMs",
	"lastRunAtMs",
	"lastFailureAlertAtMs",
	"lastTriggerEvalAtMs",
	"lastTriggerFireAtMs",
	"streamLastStartedAtMs",
	"streamLastExitAtMs"
];
function isValidStateTimestamp(value) {
	return asSafeIntegerInRange(value, {
		min: 0,
		max: MAX_DATE_TIMESTAMP_MS
	}) !== void 0;
}
function getInvalidCronJobStateTimestampField(state) {
	const record = asRecord(state);
	const field = CRON_STATE_TIMESTAMP_FIELDS.find((key) => record[key] !== void 0 && !isValidStateTimestamp(record[key]));
	if (field) return field;
	const atMs = asRecord(record.autoDisabled).atMs;
	return atMs !== void 0 && !isValidStateTimestamp(atMs) ? "autoDisabled.atMs" : void 0;
}
/** Rejects caller-authored state timestamps that cannot round-trip through Date and SQLite. */
function assertCronJobStateTimestamps(state) {
	const invalidField = getInvalidCronJobStateTimestampField(state);
	if (invalidField) throw new Error(`cron state.${invalidField} must be a non-negative Date-valid integer timestamp`);
}
/** Returns the first structural reason a persisted cron job cannot be loaded safely. */
function getInvalidPersistedCronJobReason(candidate) {
	const id = candidate.id;
	if (typeof id !== "string" || !id.trim()) return "missing-id";
	if (getInvalidCronJobStateTimestampField(candidate.state)) return "invalid-state";
	const schedule = candidate.schedule;
	if (!schedule || Array.isArray(schedule)) return "missing-schedule";
	if (typeof schedule === "string") return null;
	if (typeof schedule !== "object") return "missing-schedule";
	const scheduleRecord = schedule;
	const scheduleKind = scheduleRecord.kind;
	if (scheduleKind !== "at" && scheduleKind !== "every" && scheduleKind !== "cron" && scheduleKind !== "on-exit" && scheduleKind !== "stream") return "invalid-schedule";
	if (scheduleKind === "at") {
		const at = scheduleRecord.at;
		if (typeof at !== "string" || parseAbsoluteTimeMs(at) === null) return "invalid-schedule";
	}
	if (scheduleKind === "every") {
		const everyMs = scheduleRecord.everyMs;
		const anchorMs = scheduleRecord.anchorMs;
		if (asSafeIntegerInRange(everyMs, {
			min: 1,
			max: 864e13
		}) === void 0 || anchorMs !== void 0 && asSafeIntegerInRange(anchorMs, {
			min: 0,
			max: 864e13
		}) === void 0) return "invalid-schedule";
	}
	if (scheduleKind === "cron") {
		const expr = scheduleRecord.expr;
		const staggerMs = scheduleRecord.staggerMs;
		if (typeof expr !== "string" || expr.trim().length === 0 || staggerMs !== void 0 && asSafeIntegerInRange(staggerMs, {
			min: 0,
			max: 864e13
		}) === void 0) return "invalid-schedule";
	}
	if (scheduleKind === "on-exit") {
		const command = scheduleRecord.command;
		if (typeof command !== "string" || command.trim().length === 0) return "invalid-schedule";
	}
	if (scheduleKind === "stream") {
		const command = scheduleRecord.command;
		const mode = scheduleRecord.mode ?? "line";
		const batchFieldValid = (value) => value === void 0 || asSafeIntegerInRange(value, {}) !== void 0;
		if (!Array.isArray(command) || command.length === 0 || command.some((value) => typeof value !== "string" || value.length === 0) || mode !== "line" && mode !== "match" || mode === "match" && typeof scheduleRecord.match !== "string" || mode === "line" && scheduleRecord.match !== void 0 || !batchFieldValid(scheduleRecord.batchMs) || !batchFieldValid(scheduleRecord.maxBatchBytes)) return "invalid-schedule";
		if (mode === "match") {
			if (!compileSafeRegex(scheduleRecord.match)) return "invalid-schedule";
		}
	}
	if ("trigger" in candidate) {
		const trigger = candidate.trigger;
		if (!trigger || typeof trigger !== "object" || Array.isArray(trigger)) return "invalid-trigger";
		const script = trigger.script;
		if (typeof script !== "string" || script.trim().length === 0 || scheduleKind === "at" || scheduleKind === "on-exit") return "invalid-trigger";
	}
	const payload = candidate.payload;
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "missing-payload";
	const payloadRecord = payload;
	const payloadKind = payloadRecord.kind;
	if (payloadKind !== "systemEvent" && payloadKind !== "agentTurn" && payloadKind !== "command" && payloadKind !== "script" && payloadKind !== "heartbeat") return "invalid-payload";
	const requiredText = payloadKind === "systemEvent" ? payloadRecord.text : payloadKind === "agentTurn" ? payloadRecord.message : payloadKind === "script" ? payloadRecord.script : void 0;
	if ((payloadKind === "systemEvent" || payloadKind === "agentTurn" || payloadKind === "script") && (typeof requiredText !== "string" || payloadKind !== "systemEvent" && !requiredText.trim())) return "invalid-payload";
	if (payloadKind === "command") {
		const argv = payloadRecord.argv;
		if (!Array.isArray(argv) || argv.length === 0 || argv.some((value) => typeof value !== "string" || value.length === 0)) return "invalid-payload";
		if (scheduleKind === "stream") return "invalid-payload";
	}
	return null;
}
//#endregion
//#region src/cron/pacing.ts
function parsePositivePacingDuration(value, field) {
	try {
		const durationMs = parseDurationMs(value);
		if (durationMs > 0) return durationMs;
	} catch {}
	throw new Error(`cron pacing ${field} must be a positive duration`);
}
/** Validates pacing strings and returns their millisecond bounds. */
function parseCronPacingBounds(pacing) {
	if (pacing.min === void 0 && pacing.max === void 0) throw new Error("cron pacing requires at least one of min or max");
	const minMs = pacing.min === void 0 ? void 0 : parsePositivePacingDuration(pacing.min, "min");
	const maxMs = pacing.max === void 0 ? void 0 : parsePositivePacingDuration(pacing.max, "max");
	if (minMs !== void 0 && maxMs !== void 0 && minMs > maxMs) throw new Error("cron pacing min must not exceed max");
	return {
		minMs,
		maxMs
	};
}
/** Clamps one successful run's proposal against its job-local pacing bounds. */
function resolvePacedNextRunAtMs(params) {
	const { minMs, maxMs } = parseCronPacingBounds(params.pacing);
	const proposedAtMs = params.nowMs + params.delayMs;
	return asDateTimestampMs(Math.min(params.nowMs + (maxMs ?? Number.POSITIVE_INFINITY), Math.max(params.nowMs + (minMs ?? 0), proposedAtMs)));
}
//#endregion
//#region src/cron/schedule-identity.ts
/** Builds stable identities for cron scheduling inputs. */
function readScheduleTime(record, key) {
	return coerceFiniteScheduleNumber(record[key]);
}
function readScheduleInteger(record, key) {
	return asSafeIntegerInRange(parseStrictFiniteNumber(record[key]), {
		min: Number.MIN_SAFE_INTEGER,
		max: Number.MAX_SAFE_INTEGER
	});
}
function schedulePayloadFromRecord(schedule) {
	const rawKind = normalizeOptionalString(schedule.kind)?.toLowerCase();
	const expr = normalizeOptionalString(schedule.expr);
	const at = normalizeOptionalString(schedule.at);
	const everyMs = readScheduleTime(schedule, "everyMs");
	const anchorMs = readScheduleTime(schedule, "anchorMs");
	const tz = normalizeOptionalString(schedule.tz);
	const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
	const kind = rawKind === "at" || rawKind === "every" || rawKind === "cron" || rawKind === "on-exit" || rawKind === "stream" ? rawKind : at ? "at" : everyMs !== void 0 ? "every" : expr ? "cron" : void 0;
	if (kind === "at") return at ? {
		kind: "at",
		at
	} : void 0;
	if (kind === "every" && everyMs !== void 0) return {
		kind: "every",
		everyMs,
		anchorMs
	};
	if (kind === "cron" && expr) return {
		kind: "cron",
		expr,
		tz,
		staggerMs
	};
	if (kind === "on-exit") {
		const command = normalizeOptionalString(schedule.command);
		return command ? {
			kind: "on-exit",
			command,
			cwd: normalizeOptionalString(schedule.cwd)
		} : void 0;
	}
	if (kind === "stream") {
		const command = schedule.command;
		if (!Array.isArray(command) || command.length === 0 || command.some((entry) => typeof entry !== "string" || entry.length === 0)) return;
		const mode = normalizeOptionalString(schedule.mode);
		return {
			kind: "stream",
			command: [...command],
			cwd: normalizeOptionalString(schedule.cwd),
			mode: mode === "line" || mode === "match" ? mode : void 0,
			match: typeof schedule.match === "string" ? schedule.match : void 0,
			batchMs: readScheduleInteger(schedule, "batchMs"),
			maxBatchBytes: readScheduleInteger(schedule, "maxBatchBytes")
		};
	}
}
function resolvePacingPayload(job) {
	if (job.pacing === void 0 || job.pacing === null) return;
	if (typeof job.pacing !== "object" || Array.isArray(job.pacing)) return null;
	const pacing = job.pacing;
	const min = normalizeOptionalString(pacing.min);
	const max = normalizeOptionalString(pacing.max);
	try {
		return parseCronPacingBounds({
			min,
			max
		});
	} catch {
		return null;
	}
}
/** Builds a stable scheduling identity for deciding whether stored timer state is still valid. */
function tryCronScheduleIdentity(job) {
	const schedule = job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule) ? schedulePayloadFromRecord(job.schedule) : void 0;
	const pacing = resolvePacingPayload(job);
	if (!schedule || pacing === null) return;
	return JSON.stringify({
		version: 2,
		enabled: typeof job.enabled === "boolean" ? job.enabled : true,
		schedule,
		pacing,
		hasTrigger: job.trigger !== void 0 && job.trigger !== null
	});
}
/** Compares two cron jobs by the normalized inputs that affect next-run computation. */
function cronSchedulingInputsEqual(previous, next) {
	const previousIdentity = tryCronScheduleIdentity(previous);
	const nextIdentity = tryCronScheduleIdentity(next);
	return previousIdentity !== void 0 && previousIdentity === nextIdentity;
}
//#endregion
//#region src/cron/store/scalar-codec.ts
function tryParseJsonObject(raw) {
	const parsed = safeParseJson(raw);
	return isRecord(parsed) ? parsed : void 0;
}
/** Converts optional booleans into nullable SQLite integer flags. */
function booleanToInteger(value) {
	return typeof value === "boolean" ? value ? 1 : 0 : null;
}
/** Converts SQLite integer flags into booleans while preserving missing columns as undefined. */
function integerToBoolean(value) {
	const normalized = normalizeSqliteNumber(value);
	return normalized == null ? void 0 : normalized !== 0;
}
/** Serializes optional structured values for JSON columns. */
function serializeJson(value) {
	return value == null ? null : JSON.stringify(value);
}
/** Parses a JSON string-array column and drops non-string entries from legacy data. */
function parseJsonArray(raw) {
	if (!raw) return;
	const parsed = safeParseJson(raw);
	return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : void 0;
}
//#endregion
//#region src/cron/store/delivery-codec.ts
/** Maps cron delivery config into normalized SQLite columns. */
function bindDeliveryColumns(delivery) {
	const failureDestination = delivery?.failureDestination;
	return {
		delivery_mode: delivery?.mode ?? null,
		delivery_channel: delivery?.channel ?? null,
		delivery_to: delivery?.to ?? null,
		delivery_thread_id: delivery?.threadId === void 0 || delivery.threadId === null ? null : String(delivery.threadId),
		delivery_thread_id_type: delivery?.threadId === void 0 || delivery.threadId === null ? null : typeof delivery.threadId,
		delivery_account_id: delivery?.accountId ?? null,
		delivery_best_effort: booleanToInteger(delivery?.bestEffort),
		delivery_completion_mode: delivery?.completionDestination?.mode ?? null,
		delivery_completion_to: delivery?.completionDestination?.to ?? null,
		failure_delivery_mode: bindFailureDestinationField(failureDestination, "mode"),
		failure_delivery_channel: bindFailureDestinationField(failureDestination, "channel"),
		failure_delivery_to: bindFailureDestinationField(failureDestination, "to"),
		failure_delivery_account_id: bindFailureDestinationField(failureDestination, "accountId")
	};
}
function bindFailureDestinationField(failureDestination, key) {
	if (!failureDestination || !Object.hasOwn(failureDestination, key)) return null;
	return failureDestination[key] ?? "";
}
function readFailureDestinationField(value) {
	return value === "" || value == null ? void 0 : value;
}
function cronDeliveryModeFromValue(value) {
	return value === "none" || value === "announce" || value === "webhook" ? value : void 0;
}
function threadIdFromRow(row) {
	const value = row.delivery_thread_id;
	if (!value) return;
	if (row.delivery_thread_id_type === "number") {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : value;
	}
	return value;
}
/** Reconstructs delivery config from split SQLite columns, preserving legacy partial rows. */
function deliveryFromRow(row) {
	const rowMode = cronDeliveryModeFromValue(row.delivery_mode);
	const threadId = threadIdFromRow(row);
	const hasDeliveryColumns = Boolean(row.delivery_channel || row.delivery_to || threadId !== void 0 || row.delivery_account_id || row.delivery_completion_mode || row.delivery_completion_to || row.failure_delivery_channel != null || row.failure_delivery_to != null || row.failure_delivery_mode != null || row.failure_delivery_account_id != null) || row.delivery_best_effort != null;
	const completionDestination = rowMode === "announce" && row.delivery_completion_mode === "webhook" ? {
		mode: "webhook",
		...row.delivery_completion_to ? { to: row.delivery_completion_to } : {}
	} : void 0;
	const failureDestination = row.failure_delivery_channel != null || row.failure_delivery_to != null || row.failure_delivery_mode != null || row.failure_delivery_account_id != null ? {
		...row.failure_delivery_channel != null ? { channel: readFailureDestinationField(row.failure_delivery_channel) } : {},
		...row.failure_delivery_to != null ? { to: readFailureDestinationField(row.failure_delivery_to) } : {},
		...row.failure_delivery_mode != null ? { mode: readFailureDestinationField(row.failure_delivery_mode) } : {},
		...row.failure_delivery_account_id != null ? { accountId: readFailureDestinationField(row.failure_delivery_account_id) } : {}
	} : void 0;
	if (!rowMode && !hasDeliveryColumns) return;
	return {
		mode: rowMode ?? "announce",
		...row.delivery_channel ? { channel: row.delivery_channel } : {},
		...row.delivery_to ? { to: row.delivery_to } : {},
		...threadId !== void 0 ? { threadId } : {},
		...row.delivery_account_id ? { accountId: row.delivery_account_id } : {},
		...row.delivery_best_effort != null ? { bestEffort: integerToBoolean(row.delivery_best_effort) } : {},
		...completionDestination ? { completionDestination } : {},
		...failureDestination ? { failureDestination } : {}
	};
}
//#endregion
//#region src/cron/store/failure-alert-codec.ts
/** Maps cron failure-alert config into normalized SQLite columns. */
function bindFailureAlertColumns(failureAlert) {
	if (failureAlert === false) return {
		failure_alert_disabled: 1,
		failure_alert_after: null,
		failure_alert_channel: null,
		failure_alert_to: null,
		failure_alert_cooldown_ms: null,
		failure_alert_include_skipped: null,
		failure_alert_mode: null,
		failure_alert_account_id: null
	};
	return {
		failure_alert_disabled: failureAlert ? 0 : null,
		failure_alert_after: failureAlert?.after ?? null,
		failure_alert_channel: failureAlert?.channel ?? null,
		failure_alert_to: failureAlert?.to ?? null,
		failure_alert_cooldown_ms: failureAlert?.cooldownMs ?? null,
		failure_alert_include_skipped: booleanToInteger(failureAlert?.includeSkipped),
		failure_alert_mode: failureAlert?.mode ?? null,
		failure_alert_account_id: failureAlert?.accountId ?? null
	};
}
/** Reconstructs failure-alert config, distinguishing disabled from omitted config. */
function failureAlertFromRow(row) {
	if (row.failure_alert_disabled === 1) return false;
	const failureAlertExplicitlyEnabled = row.failure_alert_disabled === 0;
	if (row.failure_alert_after == null && !row.failure_alert_channel && !row.failure_alert_to && row.failure_alert_cooldown_ms == null && row.failure_alert_include_skipped == null && !row.failure_alert_mode && !row.failure_alert_account_id && !failureAlertExplicitlyEnabled) return;
	return {
		...row.failure_alert_after != null ? { after: normalizeSqliteNumber(row.failure_alert_after) } : {},
		...row.failure_alert_channel ? { channel: row.failure_alert_channel } : {},
		...row.failure_alert_to ? { to: row.failure_alert_to } : {},
		...row.failure_alert_cooldown_ms != null ? { cooldownMs: normalizeSqliteNumber(row.failure_alert_cooldown_ms) } : {},
		...row.failure_alert_include_skipped != null ? { includeSkipped: integerToBoolean(row.failure_alert_include_skipped) } : {},
		...row.failure_alert_mode ? { mode: row.failure_alert_mode } : {},
		...row.failure_alert_account_id ? { accountId: row.failure_alert_account_id } : {}
	};
}
//#endregion
//#region src/cron/store/payload-codec.ts
/** SQLite column codec for cron payload variants. */
function bindPayloadToolAllowColumns(payload) {
	return {
		payload_tools_allow_json: serializeJson(payload.toolsAllow),
		payload_tools_allow_is_default: payload.toolsAllow ? booleanToInteger(payload.toolsAllowIsDefault) : null
	};
}
function payloadToolAllowFromRow(row) {
	const toolsAllow = parseJsonArray(row.payload_tools_allow_json);
	if (!toolsAllow) return {};
	return {
		toolsAllow,
		...integerToBoolean(row.payload_tools_allow_is_default) ? { toolsAllowIsDefault: true } : {}
	};
}
function parseExternalContentSource(raw) {
	const parsed = raw ? safeParseJson(raw) : void 0;
	return parsed === "gmail" || parsed === "webhook" ? parsed : void 0;
}
function parseCommandPayloadMessage(raw) {
	const parsed = raw ? safeParseJson(raw) : void 0;
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const record = parsed;
	if (!Array.isArray(record.argv) || record.argv.length === 0 || record.argv.some((value) => typeof value !== "string" || value.length === 0)) return null;
	const argv = record.argv.map((value) => String(value));
	const env = record.env && typeof record.env === "object" && !Array.isArray(record.env) ? Object.fromEntries(Object.entries(record.env).filter((entry) => typeof entry[1] === "string")) : void 0;
	const rawNoOutputTimeoutSeconds = typeof record.noOutputTimeoutSeconds === "number" || typeof record.noOutputTimeoutSeconds === "bigint" ? record.noOutputTimeoutSeconds : null;
	const rawOutputMaxBytes = typeof record.outputMaxBytes === "number" || typeof record.outputMaxBytes === "bigint" ? record.outputMaxBytes : null;
	const noOutputTimeoutSeconds = normalizeSqliteNumber(rawNoOutputTimeoutSeconds);
	const outputMaxBytes = normalizeSqliteNumber(rawOutputMaxBytes);
	return {
		argv,
		...typeof record.cwd === "string" && record.cwd.trim() ? { cwd: record.cwd } : {},
		...env && Object.keys(env).length > 0 ? { env } : {},
		...typeof record.input === "string" ? { input: record.input } : {},
		...noOutputTimeoutSeconds != null ? { noOutputTimeoutSeconds } : {},
		...outputMaxBytes != null && outputMaxBytes > 0 ? { outputMaxBytes } : {}
	};
}
function parseScriptPayloadMessage(raw) {
	const parsed = raw ? safeParseJson(raw) : void 0;
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
	const record = parsed;
	if (typeof record.script !== "string" || !record.script.trim()) return null;
	const toolBudget = normalizeSqliteNumber(typeof record.toolBudget === "number" || typeof record.toolBudget === "bigint" ? record.toolBudget : null);
	return {
		script: record.script,
		...toolBudget != null ? { toolBudget } : {}
	};
}
/** Maps cron payload variants into normalized SQLite columns. */
function bindPayloadColumns(payload) {
	const agentTurn = payload.kind === "agentTurn" ? payload : void 0;
	let payloadMessage;
	if (payload.kind === "systemEvent") payloadMessage = payload.text;
	else if (payload.kind === "heartbeat") payloadMessage = null;
	else if (agentTurn) payloadMessage = agentTurn.message;
	else {
		const { timeoutSeconds: _timeoutSeconds, toolsAllow: _toolsAllow, toolsAllowIsDefault: _toolsAllowIsDefault, ...serializedPayload } = payload;
		payloadMessage = serializeJson(serializedPayload);
	}
	return {
		payload_kind: payload.kind,
		payload_message: payloadMessage,
		payload_model: agentTurn?.model ?? null,
		payload_fallbacks_json: serializeJson(agentTurn?.fallbacks),
		payload_thinking: agentTurn?.thinking ?? null,
		payload_timeout_seconds: payload.kind === "systemEvent" || payload.kind === "heartbeat" ? null : payload.timeoutSeconds ?? null,
		payload_allow_unsafe_external_content: booleanToInteger(agentTurn?.allowUnsafeExternalContent),
		payload_external_content_source_json: serializeJson(agentTurn?.externalContentSource),
		payload_light_context: booleanToInteger(agentTurn?.lightContext),
		...bindPayloadToolAllowColumns(payload)
	};
}
/** Reconstructs cron payload variants from SQLite columns, returning null for invalid rows. */
function payloadFromRow(row) {
	if (row.payload_kind === "systemEvent") {
		if (row.payload_message == null) return null;
		return {
			kind: "systemEvent",
			text: row.payload_message,
			...payloadToolAllowFromRow(row)
		};
	}
	if (row.payload_kind === "agentTurn") {
		if (row.payload_message == null) return null;
		const fallbacks = row.payload_fallbacks_json ? parseJsonArray(row.payload_fallbacks_json) : void 0;
		const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
		const allowUnsafeExternalContent = row.payload_allow_unsafe_external_content != null ? integerToBoolean(row.payload_allow_unsafe_external_content) : void 0;
		const externalContentSource = parseExternalContentSource(row.payload_external_content_source_json);
		const lightContext = row.payload_light_context != null ? integerToBoolean(row.payload_light_context) : void 0;
		return {
			kind: "agentTurn",
			message: row.payload_message,
			...row.payload_model ? { model: row.payload_model } : {},
			...fallbacks ? { fallbacks } : {},
			...row.payload_thinking ? { thinking: row.payload_thinking } : {},
			...timeoutSeconds != null ? { timeoutSeconds } : {},
			...allowUnsafeExternalContent != null ? { allowUnsafeExternalContent } : {},
			...externalContentSource ? { externalContentSource } : {},
			...lightContext != null ? { lightContext } : {},
			...payloadToolAllowFromRow(row)
		};
	}
	if (row.payload_kind === "command") {
		const command = parseCommandPayloadMessage(row.payload_message);
		if (!command) return null;
		const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
		return {
			kind: "command",
			...command,
			...timeoutSeconds != null ? { timeoutSeconds } : {},
			...payloadToolAllowFromRow(row)
		};
	}
	if (row.payload_kind === "heartbeat") return { kind: "heartbeat" };
	if (row.payload_kind === "script") {
		const script = parseScriptPayloadMessage(row.payload_message);
		if (!script) return null;
		const timeoutSeconds = normalizeSqliteNumber(row.payload_timeout_seconds);
		return {
			kind: "script",
			...script,
			...timeoutSeconds != null ? { timeoutSeconds } : {},
			...payloadToolAllowFromRow(row)
		};
	}
	return null;
}
//#endregion
//#region src/cron/store/schema.ts
/** Creates the Kysely facade scoped to cron_jobs for synchronous SQLite access. */
function getCronStoreKysely(db) {
	return getNodeSqliteKysely(db);
}
function ensureCronStoreEpochSchema(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS cron_store_epochs (
      store_key TEXT PRIMARY KEY,
      store_epoch INTEGER NOT NULL DEFAULT 0
    ) STRICT
  `);
}
//#endregion
//#region src/cron/store/state-codec.ts
/** SQLite column codec for mutable cron runtime state. */
/** Maps mutable cron runtime state into normalized SQLite columns. */
function bindStateColumns(state) {
	return {
		next_run_at_ms: state.nextRunAtMs ?? null,
		running_at_ms: state.runningAtMs ?? null,
		last_run_at_ms: state.lastRunAtMs ?? null,
		last_run_status: state.lastRunStatus ?? state.lastStatus ?? null,
		last_error: state.lastError ?? null,
		last_duration_ms: state.lastDurationMs ?? null,
		consecutive_errors: state.consecutiveErrors ?? null,
		consecutive_skipped: state.consecutiveSkipped ?? null,
		schedule_error_count: state.scheduleErrorCount ?? null,
		last_delivery_status: state.lastDeliveryStatus ?? null,
		last_delivery_error: state.lastDeliveryError ?? null,
		last_delivered: booleanToInteger(state.lastDelivered),
		last_failure_alert_at_ms: state.lastFailureAlertAtMs ?? null
	};
}
/** Reconstructs cron runtime state from JSON plus split indexed columns. */
function stateFromRow(row) {
	return {
		...asRecord(safeParseJson(row.state_json)),
		...row.next_run_at_ms != null ? { nextRunAtMs: normalizeSqliteNumber(row.next_run_at_ms) } : {},
		...row.running_at_ms != null ? { runningAtMs: normalizeSqliteNumber(row.running_at_ms) } : {},
		...row.last_run_at_ms != null ? { lastRunAtMs: normalizeSqliteNumber(row.last_run_at_ms) } : {},
		...row.last_run_status ? { lastRunStatus: row.last_run_status } : {},
		...row.last_error ? { lastError: row.last_error } : {},
		...row.last_duration_ms != null ? { lastDurationMs: normalizeSqliteNumber(row.last_duration_ms) } : {},
		...row.consecutive_errors != null ? { consecutiveErrors: normalizeSqliteNumber(row.consecutive_errors) } : {},
		...row.consecutive_skipped != null ? { consecutiveSkipped: normalizeSqliteNumber(row.consecutive_skipped) } : {},
		...row.schedule_error_count != null ? { scheduleErrorCount: normalizeSqliteNumber(row.schedule_error_count) } : {},
		...row.last_delivery_status ? { lastDeliveryStatus: row.last_delivery_status } : {},
		...row.last_delivery_error ? { lastDeliveryError: row.last_delivery_error } : {},
		...row.last_delivered != null ? { lastDelivered: integerToBoolean(row.last_delivered) } : {},
		...row.last_failure_alert_at_ms != null ? { lastFailureAlertAtMs: normalizeSqliteNumber(row.last_failure_alert_at_ms) } : {}
	};
}
//#endregion
//#region src/cron/store/trigger-codec.ts
/** Maps cron trigger config into normalized SQLite columns. */
function bindTriggerColumns(trigger) {
	return {
		trigger_script: trigger?.script ?? null,
		trigger_once: booleanToInteger(trigger?.once)
	};
}
/** Reconstructs trigger config from normalized SQLite columns. */
function triggerFromRow(row) {
	if (!row.trigger_script) return;
	return {
		script: row.trigger_script,
		...row.trigger_once != null ? { once: integerToBoolean(row.trigger_once) } : {}
	};
}
//#endregion
//#region src/cron/store/row-codec.ts
function bindScheduleColumns(schedule) {
	if (schedule.kind === "at") return {
		schedule_kind: "at",
		at: schedule.at,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: null,
		schedule_tz: null,
		stagger_ms: null
	};
	if (schedule.kind === "every") return {
		schedule_kind: "every",
		at: null,
		every_ms: schedule.everyMs,
		anchor_ms: schedule.anchorMs ?? null,
		schedule_expr: null,
		schedule_tz: null,
		stagger_ms: null
	};
	if (schedule.kind === "on-exit") return {
		schedule_kind: "on-exit",
		at: null,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: schedule.command,
		schedule_tz: schedule.cwd ?? null,
		stagger_ms: null
	};
	if (schedule.kind === "stream") return {
		schedule_kind: "stream",
		at: null,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: null,
		schedule_tz: null,
		stagger_ms: null
	};
	return {
		schedule_kind: "cron",
		at: null,
		every_ms: null,
		anchor_ms: null,
		schedule_expr: schedule.expr,
		schedule_tz: schedule.tz ?? null,
		stagger_ms: schedule.staggerMs ?? null
	};
}
function stripJobRuntimeFields(job) {
	const { runtimeAuthority: _runtimeAuthority, runtimeAuthorityRecoveryRequired: _runtimeAuthorityRecoveryRequired, state: _state, updatedAtMs: _updatedAtMs, ...rest } = job;
	return {
		...rest,
		state: {}
	};
}
function mergeFailureDestinationProjection(configJob, projectedJob) {
	const failureDestination = projectedJob?.delivery?.failureDestination;
	if (!failureDestination) return configJob;
	const delivery = isRecord(configJob.delivery) ? { ...configJob.delivery } : projectedJob?.delivery ? {
		mode: projectedJob.delivery.mode,
		...projectedJob.delivery.channel ? { channel: projectedJob.delivery.channel } : {},
		...projectedJob.delivery.to ? { to: projectedJob.delivery.to } : {},
		...projectedJob.delivery.threadId !== void 0 ? { threadId: projectedJob.delivery.threadId } : {},
		...projectedJob.delivery.accountId ? { accountId: projectedJob.delivery.accountId } : {},
		...projectedJob.delivery.bestEffort !== void 0 ? { bestEffort: projectedJob.delivery.bestEffort } : {},
		...projectedJob.delivery.completionDestination ? { completionDestination: projectedJob.delivery.completionDestination } : {}
	} : {};
	const nextFailureDestination = isRecord(delivery.failureDestination) ? { ...delivery.failureDestination } : {};
	if (Object.hasOwn(failureDestination, "channel")) nextFailureDestination.channel = failureDestination.channel;
	if (Object.hasOwn(failureDestination, "to")) nextFailureDestination.to = failureDestination.to;
	if (Object.hasOwn(failureDestination, "accountId")) nextFailureDestination.accountId = failureDestination.accountId;
	if (Object.hasOwn(failureDestination, "mode")) nextFailureDestination.mode = failureDestination.mode;
	delivery.failureDestination = nextFailureDestination;
	return {
		...configJob,
		delivery
	};
}
function bindCronJobRow(storeKey, job, sortOrder) {
	return {
		store_key: storeKey,
		job_id: job.id,
		declaration_key: job.declarationKey ?? null,
		display_name: job.displayName ?? null,
		owner_agent_id: job.owner?.agentId ?? null,
		owner_session_key: job.owner?.sessionKey ?? null,
		name: job.name,
		description: job.description ?? null,
		enabled: job.enabled ? 1 : 0,
		delete_after_run: booleanToInteger(job.deleteAfterRun),
		created_at_ms: job.createdAtMs,
		updated_at: job.updatedAtMs,
		agent_id: job.agentId ?? null,
		session_key: job.sessionKey ?? null,
		session_target: job.sessionTarget,
		wake_mode: job.wakeMode,
		...bindTriggerColumns(job.trigger),
		...bindScheduleColumns(job.schedule),
		...bindPayloadColumns(job.payload),
		...bindDeliveryColumns(job.delivery),
		...bindFailureAlertColumns(job.failureAlert),
		...bindStateColumns(job.state ?? {}),
		job_json: JSON.stringify(stripJobRuntimeFields(job)),
		state_json: JSON.stringify(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity(job) ?? null,
		sort_order: sortOrder
	};
}
function normalizeCronJobForSqlite(job) {
	const raw = structuredClone(job);
	const hadDeleteAfterRun = Object.hasOwn(raw, "deleteAfterRun");
	normalizeCronJobIdentityFields(raw);
	const normalized = normalizeCronJobInput(raw, { applyDefaults: true });
	if (!normalized || getInvalidPersistedCronJobReason(normalized)) return null;
	if (!hadDeleteAfterRun) delete normalized.deleteAfterRun;
	const createdAtMs = typeof normalized.createdAtMs === "number" && Number.isFinite(normalized.createdAtMs) ? normalized.createdAtMs : Date.now();
	const updatedAtMs = typeof normalized.updatedAtMs === "number" && Number.isFinite(normalized.updatedAtMs) ? normalized.updatedAtMs : createdAtMs;
	return {
		...normalized,
		createdAtMs,
		updatedAtMs,
		state: isRecord(normalized.state) ? normalized.state : {}
	};
}
function countUnpersistableCronJobs(store) {
	return store.jobs.reduce((count, job) => count + (normalizeCronJobForSqlite(job) ? 0 : 1), 0);
}
/** Fails before replacing SQLite rows when any config job cannot round-trip. */
function assertCronStoreCanPersist(store) {
	const invalidJobs = countUnpersistableCronJobs(store);
	if (invalidJobs > 0) throw new Error(`Cannot persist cron store with ${invalidJobs} invalid job(s)`);
}
function scheduleFromRow(row, jobJson) {
	if (row.schedule_kind === "at" && row.at) return {
		kind: "at",
		at: row.at
	};
	if (row.schedule_kind === "every" && row.every_ms != null) return {
		kind: "every",
		everyMs: normalizeSqliteNumber(row.every_ms) ?? 0,
		...row.anchor_ms != null ? { anchorMs: normalizeSqliteNumber(row.anchor_ms) } : {}
	};
	if (row.schedule_kind === "cron" && row.schedule_expr) return {
		kind: "cron",
		expr: row.schedule_expr,
		...row.schedule_tz ? { tz: row.schedule_tz } : {},
		...row.stagger_ms != null ? { staggerMs: normalizeSqliteNumber(row.stagger_ms) } : {}
	};
	if (row.schedule_kind === "on-exit" && row.schedule_expr) return {
		kind: "on-exit",
		command: row.schedule_expr,
		...row.schedule_tz ? { cwd: row.schedule_tz } : {}
	};
	if (row.schedule_kind === "stream") {
		const schedule = jobJson.schedule;
		if (!isRecord(schedule) || schedule.kind !== "stream" || !Array.isArray(schedule.command)) return null;
		return structuredClone(schedule);
	}
	return null;
}
function pacingFromJobJson(jobJson) {
	const pacing = jobJson.pacing;
	if (!isRecord(pacing)) return;
	return {
		...typeof pacing.min === "string" ? { min: pacing.min } : {},
		...typeof pacing.max === "string" ? { max: pacing.max } : {}
	};
}
function rowToCronJob(row, jobJson) {
	const jsonOwner = isRecord(jobJson.owner) ? jobJson.owner : void 0;
	const ownerAccountId = normalizeOptionalAccountId(typeof jsonOwner?.accountId === "string" ? jsonOwner.accountId : void 0);
	const schedule = scheduleFromRow(row, jobJson);
	const payload = payloadFromRow(row);
	const delivery = deliveryFromRow(row);
	const failureAlert = failureAlertFromRow(row);
	const trigger = triggerFromRow(row);
	const pacing = pacingFromJobJson(jobJson);
	const scheduledToolPolicy = normalizeCronScheduledToolPolicy(jobJson.scheduledToolPolicy);
	const toolsAllowProvenance = isRecord(jobJson.toolsAllowProvenance) && jobJson.toolsAllowProvenance.version === 1 && jobJson.toolsAllowProvenance.source === "final-executable-surface" ? {
		version: 1,
		source: "final-executable-surface"
	} : void 0;
	if (!schedule || !payload) return null;
	const createdAtMs = normalizeSqliteNumber(row.created_at_ms) ?? Date.now();
	return {
		id: row.job_id,
		...row.declaration_key ? { declarationKey: row.declaration_key } : {},
		...row.display_name ? { displayName: row.display_name } : {},
		...row.owner_agent_id || row.owner_session_key || ownerAccountId ? { owner: {
			...row.owner_agent_id ? { agentId: row.owner_agent_id } : {},
			...row.owner_session_key ? { sessionKey: row.owner_session_key } : {},
			...ownerAccountId ? { accountId: ownerAccountId } : {}
		} } : {},
		...scheduledToolPolicy ? { scheduledToolPolicy } : {},
		...toolsAllowProvenance ? { toolsAllowProvenance } : {},
		name: row.name,
		...row.description ? { description: row.description } : {},
		enabled: row.enabled !== 0,
		...row.delete_after_run != null ? { deleteAfterRun: integerToBoolean(row.delete_after_run) } : {},
		createdAtMs,
		updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at) ?? createdAtMs,
		...row.agent_id ? { agentId: row.agent_id } : {},
		...row.session_key ? { sessionKey: row.session_key } : {},
		schedule,
		...pacing !== void 0 ? { pacing } : {},
		sessionTarget: row.session_target,
		wakeMode: row.wake_mode,
		...trigger ? { trigger } : {},
		payload,
		...delivery ? { delivery } : {},
		...failureAlert !== void 0 ? { failureAlert } : {},
		state: stateFromRow(row)
	};
}
/** Projects a live job through the same normalization/codecs used by SQLite persistence. */
function projectCronJobThroughStorageCodec(job) {
	const normalized = normalizeCronJobForSqlite(job);
	if (!normalized) throw new Error(`cannot project invalid cron job ${job.id}`);
	const row = bindCronJobRow("config-revision", normalized, 0);
	const projected = rowToCronJob(row, asOptionalObjectRecord(safeParseJson(row.job_json)) ?? {});
	if (!projected) throw new Error(`cannot project cron job ${job.id} through storage codecs`);
	return projected;
}
/** Loads cron rows in config order with deterministic fallbacks for old rows. */
function loadCronRows(db, storeKey) {
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").selectAll().where("store_key", "=", storeKey).orderBy("sort_order", "asc").orderBy("updated_at", "asc").orderBy("job_id", "asc")).rows;
}
function incrementCronStoreEpoch(db, storeKey) {
	ensureCronStoreEpochSchema(db);
	executeSqliteQuerySync(db, getCronStoreKysely(db).insertInto("cron_store_epochs").values({
		store_key: storeKey,
		store_epoch: 0
	}).onConflict((conflict) => conflict.column("store_key").doNothing()));
	executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_store_epochs").set((eb) => ({ store_epoch: eb("store_epoch", "+", 1) })).where("store_key", "=", storeKey));
}
/** Materializes retired ownership; the caller's transaction commits row and epoch updates together. */
function materializeCronRowAgentOwners(db, storeKey, legacyDefaultAgentId) {
	const agentId = normalizeAgentId(legacyDefaultAgentId);
	let rewritten = 0;
	for (const row of loadCronRows(db, storeKey)) {
		const jobJson = tryParseJsonObject(row.job_json);
		const jsonSessionAgentId = parseAgentSessionKey(normalizeOptionalString(jobJson?.sessionKey))?.agentId;
		if (normalizeOptionalString(row.agent_id) || normalizeOptionalString(jobJson?.agentId) || parseAgentSessionKey(row.session_key)?.agentId || jsonSessionAgentId) continue;
		if (jobJson) jobJson.agentId = agentId;
		executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set({
			agent_id: agentId,
			...jobJson ? { job_json: JSON.stringify(jobJson) } : {}
		}).where("store_key", "=", storeKey).where("job_id", "=", row.job_id));
		rewritten += 1;
	}
	if (rewritten > 0) incrementCronStoreEpoch(db, storeKey);
	return rewritten;
}
/** Removes one owned job family from obsolete store partitions. */
function deleteStaleCronJobFamilyRows(db, activeStoreKey, family) {
	const staleRows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select([
		"store_key",
		"job_id",
		"declaration_key",
		"name",
		"description"
	]).where("store_key", "!=", activeStoreKey)).rows.filter((row) => row.declaration_key === family.declarationKey || row.name === family.name && row.description?.includes(family.ownerPluginTag) === true);
	for (const row of staleRows) {
		executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_job_scratch").where("store_key", "=", row.store_key).where("job_id", "=", row.job_id));
		executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", row.store_key).where("job_id", "=", row.job_id));
	}
	return staleRows.length;
}
/** Replaces all persisted cron rows and returns the canonical jobs that were written. */
function replaceCronRows(db, storeKey, store) {
	const existingRows = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").select("job_id").where("store_key", "=", storeKey)).rows;
	const normalizedJobs = [];
	for (const [index, job] of store.jobs.entries()) normalizedJobs.push(upsertCronJobRow(db, storeKey, job, index));
	const nextJobIds = new Set(normalizedJobs.map((job) => job.id));
	for (const row of existingRows) {
		if (nextJobIds.has(row.job_id)) continue;
		executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey).where("job_id", "=", row.job_id));
	}
	return normalizedJobs;
}
/** Upserts one persisted cron row without rewriting unrelated jobs in its store partition. */
function upsertCronJobRow(db, storeKey, job, sortOrder) {
	const normalized = normalizeCronJobForSqlite(job);
	if (!normalized) throw new Error(`Cannot persist invalid cron job ${job.id}`);
	const values = bindCronJobRow(storeKey, normalized, sortOrder);
	executeSqliteQuerySync(db, getCronStoreKysely(db).insertInto("cron_jobs").values(values).onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet(values)));
	return normalized;
}
function deleteCronJobRowInDatabase(db, storeKey, jobId) {
	executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", jobId));
	executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_jobs").where("store_key", "=", storeKey).where("job_id", "=", jobId));
}
/** Updates only mutable runtime columns without rewriting full job config JSON. */
function updateCronRuntimeRows(db, storeKey, store) {
	for (const job of store.jobs) executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_jobs").set({
		...bindStateColumns(job.state ?? {}),
		state_json: JSON.stringify(job.state ?? {}),
		runtime_updated_at_ms: job.updatedAtMs,
		schedule_identity: tryCronScheduleIdentity(job)
	}).where("store_key", "=", storeKey).where("job_id", "=", job.id));
}
/** Reconstructs loaded cron store data and config-runtime sidecars from SQLite rows. */
function loadedCronStoreFromRows(rows) {
	const jobs = [];
	const configJobs = [];
	const configJobIndexes = [];
	const configJobRuntimeEntries = [];
	const invalidConfigRows = [];
	for (const [index, row] of rows.entries()) {
		const parsedJobJson = asOptionalObjectRecord(safeParseJson(row.job_json));
		const jobJson = parsedJobJson ?? {};
		const job = rowToCronJob(row, jobJson);
		const configJob = mergeFailureDestinationProjection(parsedJobJson ?? (job ? stripJobRuntimeFields(job) : {}), job);
		const runtimeEntry = {
			updatedAtMs: normalizeSqliteNumber(row.runtime_updated_at_ms) ?? normalizeSqliteNumber(row.updated_at),
			scheduleIdentity: row.schedule_identity ?? void 0,
			state: stateFromRow(row)
		};
		if (!job) {
			invalidConfigRows.push({
				sourceIndex: index,
				reason: getInvalidPersistedCronJobReason(configJob) ?? (scheduleFromRow(row, jobJson) ? "invalid-payload" : "invalid-schedule"),
				job: configJob,
				...runtimeEntry.state ? { state: runtimeEntry.state } : {},
				...runtimeEntry.updatedAtMs !== void 0 ? { updatedAtMs: runtimeEntry.updatedAtMs } : {},
				...runtimeEntry.scheduleIdentity !== void 0 ? { scheduleIdentity: runtimeEntry.scheduleIdentity } : {}
			});
			continue;
		}
		jobs.push(job);
		configJobs.push(configJob);
		configJobIndexes.push(index);
		configJobRuntimeEntries.push(runtimeEntry);
	}
	return {
		store: {
			version: 1,
			jobs
		},
		configJobs,
		configJobIndexes,
		configJobRuntimeEntries,
		invalidConfigRows
	};
}
//#endregion
export { resolveCronNotificationSessionKey as A, cloneCronRuntimeAuthority as B, markCronStreamBatchTruncated as C, isDetachedCronSessionTarget as D, assertSafeCronSessionTargetId as E, createAccountCronScheduledToolPolicy as F, parseOptionalField as G, DeliveryThreadIdFieldSchema as H, createTrustedCronScheduledToolPolicy as I, cronStoreKey as J, shouldDefaultCronDeliveryToAnnounce as K, normalizeCronScheduledToolPolicy as L, inferCronJobName as M, normalizePayloadToSystemText as N, isInvalidCronSessionTargetIdError as O, normalizeRequiredName as P, resolveCronScheduledToolPolicy as R, cronStreamScheduleKey as S, truncateCronStreamBatch as T, LowercaseNonEmptyStringFieldSchema as U, normalizeCronRuntimeAuthority as V, TrimmedNonEmptyStringFieldSchema as W, normalizeCronJobCreate as _, loadedCronStoreFromRows as a, appendCronPayloadText as b, replaceCronRows as c, getCronStoreKysely as d, cronSchedulingInputsEqual as f, getInvalidPersistedCronJobReason as g, assertCronJobStateTimestamps as h, loadCronRows as i, resolveCronSessionTargetSessionKey as j, resolveCronDeliverySessionKey as k, updateCronRuntimeRows as l, resolvePacedNextRunAtMs as m, deleteCronJobRowInDatabase as n, materializeCronRowAgentOwners as o, parseCronPacingBounds as p, normalizeCronJobIdentityFields as q, deleteStaleCronJobFamilyRows as r, projectCronJobThroughStorageCodec as s, assertCronStoreCanPersist as t, upsertCronJobRow as u, normalizeCronJobInput as v, resolveCronStreamBatching as w, createCronStreamSourceIdentity as x, normalizeCronJobPatch as y, coerceFiniteScheduleNumber as z };
