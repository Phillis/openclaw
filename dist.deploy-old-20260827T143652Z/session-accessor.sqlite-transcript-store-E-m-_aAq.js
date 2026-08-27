import { a as redactSensitiveFieldValue, c as redactSensitiveText, i as redactSecrets, n as getDefaultRedactPatterns, p as readLoggingConfig } from "./redact-Cl7lwBnl.js";
import { n as findNormalizedProviderValue } from "./provider-id-DMd-TDFp.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-sCL6pEgr.js";
import { g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, v as iterateSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { g as openOpenClawAgentDatabase } from "./openclaw-agent-db-lxLIE6rA.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-iFUXefU9.js";
import { B as readTranscriptMutationStateInTransaction, F as deleteTranscriptEventsInTransaction, H as touchTranscriptMutationInTransaction, I as ensureTranscriptGenerationInTransaction, J as coerceSqliteNumber, L as ensureTranscriptSessionRoot, P as advanceTranscriptMutationAtInTransaction, R as readNextTranscriptSeq, V as rotateTranscriptGenerationInTransaction, z as readTranscriptGenerationInTransaction } from "./targets-DxP0vsft.js";
import { i as getSessionKysely, p as toDatabaseOptions, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-kI2NyJDH.js";
import { a as reconcileSessionTranscriptIndexInTransaction, b as parseSessionTranscriptTreeEntry, f as resolveVisibleTranscriptAppendParentId, g as isSessionTranscriptLeafControl, n as deleteSessionTranscriptIndexInTransaction, r as indexAppendedTranscriptEventInTransaction } from "./session-transcript-index-Bfc_6ADm.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-ByevblQR.js";
import { i as sanitizeInlineImageDataUrlForStorage, n as sanitizeInlineImageBase64 } from "./inline-image-data-url-DaDaaE7z.js";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-CdKKNGmE.js";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cm80SY9H.js";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { sql } from "kysely";
import { OPENAI_RESPONSES_APIS } from "@openclaw/ai/internal/openai-responses-payload-policy";
//#region src/config/sessions/session-transcript-read-fence.ts
const transcriptReadFenceStorage = new AsyncLocalStorage();
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
function runWithSessionTranscriptReadFence(receipt, run) {
	return receipt ? transcriptReadFenceStorage.run(receipt, run) : run();
}
function resolveSessionTranscriptReadFence(session) {
	const receipt = transcriptReadFenceStorage.getStore();
	return receipt?.agentId === session.agentId && receipt.sessionId === session.sessionId ? receipt : void 0;
}
function resolveSqliteSessionTranscriptReadFence(params) {
	const receipt = resolveSessionTranscriptReadFence(params);
	if (!receipt) return;
	if (receipt.role !== "user") throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is not a user message: ${receipt.entryId}`);
	if (params.database.path !== receipt.storePath) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different transcript store");
	if (params.sessionKey !== void 0 && params.sessionKey !== receipt.sessionKey) throw new SessionTranscriptReadFenceError("Current-turn transcript admission belongs to a different session key");
	const db = getSessionKysely(params.database.db);
	const boundary = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.seq",
		"identity.parent_id",
		"active.message_position",
		"rewrite.generation",
		"event.event_json"
	]).where("identity.session_id", "=", params.sessionId).where("identity.event_id", "=", receipt.entryId).limit(1));
	if (boundary?.message_position === null || boundary?.message_position === void 0) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is no longer a visible message: ${receipt.entryId}`);
	if (boundary.generation !== receipt.generation || boundary.seq !== receipt.rawSeq || boundary.parent_id !== receipt.effectiveParentId || boundary.message_position !== receipt.activeMessagePosition) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission identity changed: ${receipt.entryId}`);
	const event = JSON.parse(boundary.event_json);
	if (event.type !== "message" || event.message?.role !== "user") throw new SessionTranscriptReadFenceError(`Current-turn transcript admission is not a user message: ${receipt.entryId}`);
	return {
		admission: receipt,
		beforeActiveMessagePosition: boundary.message_position,
		beforeRawSeq: boundary.seq
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-read.ts
/** Loads raw transcript events from the additive SQLite transcript store. */
async function loadTranscriptEvents(scope) {
	return loadTranscriptEventsSync(scope);
}
/** Loads raw transcript events synchronously from the additive SQLite transcript store. */
function loadTranscriptEventsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		return loadTranscriptEventsFromDatabase(database, resolved.sessionId, fence?.beforeRawSeq);
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript fenced read"
	});
}
/** Loads only the first transcript row for header metadata hot paths. */
function loadTranscriptHeaderSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("event_json").where("session_id", "=", resolved.sessionId).orderBy("seq", "asc").limit(1));
	return row ? JSON.parse(row.event_json) : void 0;
}
/** Loads a bounded newest tail in storage order for hot-path accounting. */
function loadTranscriptTailEventsSync(scope, maxEvents) {
	const limit = Number.isFinite(maxEvents) ? Math.max(0, Math.floor(maxEvents)) : 0;
	if (limit === 0) return [];
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("event_json").where("session_id", "=", resolved.sessionId).orderBy("seq", "desc").limit(limit)).rows.toReversed().map((row) => JSON.parse(row.event_json));
}
/** Loads additive transcript rows after one durable sequence checkpoint. */
function loadTranscriptEventRowsAfterSeqSync(scope, afterSeq, throughSeq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	let query = getSessionKysely(database.db).selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", resolved.sessionId).where("seq", ">", afterSeq);
	if (throughSeq !== void 0) query = query.where("seq", "<=", throughSeq);
	return executeSqliteQuerySync(database.db, query.orderBy("seq", "asc")).rows.map((row) => ({
		event: JSON.parse(row.event_json),
		seq: coerceSqliteNumber(row.seq)
	}));
}
/** Reads one checkpoint row so incremental consumers can reject transcript rewrites. */
function readTranscriptEventAtSeqSync(scope, seq) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", resolved.sessionId).where("seq", "=", seq));
	return row ? {
		event: JSON.parse(row.event_json),
		seq: coerceSqliteNumber(row.seq)
	} : void 0;
}
function loadTranscriptEventsFromDatabase(database, sessionId, beforeEventSeq) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["event_json"]).where("session_id", "=", sessionId).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).orderBy("seq", "asc")).rows.map((row) => JSON.parse(row.event_json));
}
function readTranscriptSnapshot(database, sessionId) {
	const rows = readTranscriptEventRows(database, sessionId);
	return {
		events: rows.map((row) => JSON.parse(row.eventJson)),
		rows
	};
}
/** Reads transcript rows without decoding payloads for snapshot comparison. */
function readTranscriptEventRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows.map((row) => ({
		eventJson: row.event_json,
		seq: coerceSqliteNumber(row.seq)
	}));
}
/** Reads exact transcript storage rows for guarded doctor rewrites. */
function readTranscriptStorageRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([
		"created_at",
		"event_json",
		"seq"
	]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows.map((row) => ({
		createdAt: coerceSqliteNumber(row.created_at),
		eventJson: row.event_json,
		seq: coerceSqliteNumber(row.seq)
	}));
}
function sqliteTranscriptJsonlByteSize() {
	return sql`COALESCE(SUM(LENGTH(CAST(event_json AS BLOB))), 0)
    + CASE WHEN COUNT(*) > 0 THEN COUNT(*) - 1 ELSE 0 END`.as("size_bytes");
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => [
		eb.fn.count("seq").as("event_count"),
		eb.fn.max("seq").as("max_seq"),
		sqliteTranscriptJsonlByteSize()
	]).where("session_id", "=", resolved.sessionId));
	const session = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["transcript_observed_at", "transcript_updated_at"]).where("session_id", "=", resolved.sessionId));
	return {
		eventCount: row?.event_count ?? 0,
		...session?.transcript_updated_at !== null && session?.transcript_updated_at !== void 0 ? { lastMutationAtMs: session.transcript_updated_at } : {},
		...session?.transcript_observed_at !== null && session?.transcript_observed_at !== void 0 ? { lastObservedMutationAtMs: session.transcript_observed_at } : {},
		maxSeq: row?.max_seq ?? 0,
		sizeBytes: row?.size_bytes ?? 0
	};
}
function readTranscriptEventJsonSetInTransaction(database, sessionId) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select("event_json").where("session_id", "=", sessionId)).rows;
	return new Set(rows.map((row) => row.event_json));
}
/** Reads the latest visible assistant text from SQLite transcript rows in reverse order. */
function loadLatestAssistantText(scope, options = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		const rows = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events as te").innerJoin("transcript_event_identities as ti", (join) => join.onRef("ti.session_id", "=", "te.session_id").onRef("ti.seq", "=", "te.seq")).select("te.event_json as event_json").where("te.session_id", "=", resolved.sessionId).where("ti.event_type", "=", "message").$if(beforeEventSeq !== void 0, (query) => query.where("ti.seq", "<", beforeEventSeq)).orderBy("ti.seq", "desc"));
		for (const row of rows) {
			const latest = parseLatestAssistantMessageEvent(row.event_json, options);
			if (!latest) continue;
			const text = parseLatestAssistantText(latest);
			if (text) return text;
		}
	}, {
		databaseLabel: database.path,
		operationLabel: "latest assistant fenced read"
	});
}
function parseLatestAssistantText(latest) {
	const message = latest.message;
	const text = extractAssistantPhaseText(latest.message)?.trim();
	if (!text) return;
	return {
		...latest.id ? { id: latest.id } : {},
		text,
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) ? { timestamp: message.timestamp } : {}
	};
}
function parseLatestAssistantMessageEvent(raw, options = {}) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (!options.includeTranscriptOnlyOpenClawAssistant && isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model)) return;
	return {
		...typeof parsed.id === "string" && parsed.id.trim() ? { id: parsed.id } : {},
		message
	};
}
/** Finds the newest transcript record accepted by the matcher without parsing older rows. */
async function findTranscriptEvent(scope, match) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return findTranscriptEventInDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId, match);
}
function findTranscriptEventInDatabase(database, sessionId, match) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["event_json"]).where("session_id", "=", sessionId).orderBy("seq", "desc")).rows;
	for (const row of rows) try {
		const event = JSON.parse(row.event_json);
		if (match(event)) return { event };
	} catch {}
}
function readTranscriptEventMessage(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const message = event.message;
	return message && typeof message === "object" && !Array.isArray(message) ? message : void 0;
}
function readTranscriptEventId(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const id = event.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
//#endregion
//#region src/agents/transcript-redact-images.ts
const isImageMimeType = (value) => typeof value === "string" && /^image\//iu.test(value.trim());
const normalizeImageMimeType = (value) => isImageMimeType(value) ? value.trim().toLowerCase() : void 0;
function imageMimeTypeForRecord(value) {
	return normalizeImageMimeType(value.mimeType) ?? normalizeImageMimeType(value.mediaType) ?? normalizeImageMimeType(value.media_type);
}
function imageMimeTypeFieldsForRecord(value) {
	return [
		"mimeType",
		"mediaType",
		"media_type"
	].filter((key) => isImageMimeType(value[key]));
}
function sanitizeOpaqueImageBase64(base64, mimeType) {
	return mimeType ? sanitizeInlineImageBase64({
		mimeType,
		base64
	}) : void 0;
}
function isValidOpaqueImageBase64(base64, mimeType) {
	return sanitizeOpaqueImageBase64(base64, mimeType) !== void 0;
}
function isOpaqueImageDataBlock(value) {
	return (value.type === "image" || value.type === "base64") && typeof value.data === "string" && isValidOpaqueImageBase64(value.data, imageMimeTypeForRecord(value));
}
function sanitizeTranscriptImageRecord(source) {
	const isImageBlock = source.type === "image";
	const isBase64SourceBlock = source.type === "base64";
	if (!isImageBlock && !isBase64SourceBlock || typeof source.data !== "string") return;
	const mimeTypeFields = imageMimeTypeFieldsForRecord(source);
	if (mimeTypeFields.length === 0) return;
	const sanitized = sanitizeOpaqueImageBase64(source.data, imageMimeTypeForRecord(source));
	if (!sanitized) return;
	const hasCanonicalMimeTypes = mimeTypeFields.every((key) => source[key] === sanitized.mimeType);
	if (source.data === sanitized.base64 && hasCanonicalMimeTypes) return source;
	const next = {
		...source,
		data: sanitized.base64
	};
	for (const field of mimeTypeFields) next[field] = sanitized.mimeType;
	return next;
}
function startsWithDataUrl(value) {
	return value.slice(0, 5).toLowerCase() === "data:";
}
function sanitizeImageDataUrlField(source, key, value) {
	if (!startsWithDataUrl(value)) return;
	return source.type === "input_image" && key === "image_url" || (source.type === "image" || source.type === "image_url") && key === "url" || source.type === "image" && (key === "source" || key === "data") ? sanitizeInlineImageDataUrlForStorage(value) : void 0;
}
function sanitizeTranscriptImageDataUrlField(params) {
	if (params.preserveImageDataUrlFields && params.key === "url") return startsWithDataUrl(params.value) ? sanitizeInlineImageDataUrlForStorage(params.value) : void 0;
	return sanitizeImageDataUrlField(params.source, params.key, params.value);
}
function shouldPreserveTranscriptImagePayload(source, key, item, preserveImageDataUrlFields) {
	if (typeof item !== "string") return false;
	if (key === "data" && isOpaqueImageDataBlock(source)) return true;
	if (preserveImageDataUrlFields && key === "url") return startsWithDataUrl(item) && sanitizeInlineImageDataUrlForStorage(item) !== void 0;
	return sanitizeImageDataUrlField(source, key, item) !== void 0;
}
function shouldPreserveNestedTranscriptImageDataUrlFields(source, key) {
	return key === "image_url" && (source.type === "image_url" || source.type === "input_image" || source.type === "image");
}
//#endregion
//#region src/agents/transcript-redact-replay.ts
const REPLAY_DESCRIPTORS = [{
	replayType: "openai-responses-compaction",
	suppressionType: "openai-responses-compaction-suppression",
	matchesRoute: (route, helpers) => helpers.isOpenAIResponsesRoute(route),
	matchesApi: (api, _route, helpers) => typeof api === "string" && helpers.isOpenAIResponsesApi(api),
	sanitizeData: (data, _cfg, helpers) => helpers.isStructurallyValidOpaqueReplayToken(data) ? data : void 0,
	readId: (value, route, helpers) => typeof value.id === "string" && helpers.isOpenAIResponseItemId(value.id, route) ? value.id : void 0
}, {
	replayType: "anthropic-compaction",
	suppressionType: "anthropic-compaction-suppression",
	matchesRoute: (route, helpers) => helpers.isAnthropicReasoningRoute(route),
	matchesApi: (api, route) => api === route?.api,
	sanitizeData: (data, cfg, helpers) => data.length > 0 ? helpers.redactTranscriptText(data, cfg) : void 0
}];
function sanitizeCompactionReplayState(value, route, cfg, helpers) {
	if (!value || typeof value !== "object" || !helpers.isPlainTranscriptObject(value)) return;
	const descriptor = REPLAY_DESCRIPTORS.find(({ replayType, suppressionType }) => value.type === replayType || value.type === suppressionType);
	const isSuppression = value.type === descriptor?.suppressionType;
	if (!descriptor || !descriptor.matchesRoute(route, helpers) || value.v !== 1 || typeof value.data !== "string" || value.replayIndex !== void 0 && (isSuppression || !Number.isSafeInteger(value.replayIndex) || value.replayIndex < 0) || value.provider !== route?.provider || !descriptor.matchesApi(value.api, route, helpers) || value.model !== route?.model || !helpers.isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !helpers.isOpenAIReplayContextHash(value.authProfileHash)) return;
	const data = isSuppression ? value.data === "rejected" ? value.data : void 0 : descriptor.sanitizeData(value.data, cfg, helpers);
	if (data === void 0) return;
	const replayId = isSuppression ? void 0 : descriptor.readId?.(value, route, helpers);
	return {
		v: 1,
		type: value.type,
		...replayId !== void 0 ? { id: replayId } : {},
		data,
		...value.replayIndex !== void 0 ? { replayIndex: value.replayIndex } : {},
		provider: value.provider,
		api: value.api,
		model: value.model,
		baseUrlHash: value.baseUrlHash,
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {}
	};
}
//#endregion
//#region src/agents/transcript-redact.ts
/**
* Agent transcript redaction helpers.
*
* Applies logging redaction rules to persisted messages while preserving unchanged object identity.
*/
function resolveTranscriptRedactPatterns(patterns) {
	return patterns && patterns.length > 0 ? [...patterns, ...getDefaultRedactPatterns()] : void 0;
}
function redactTranscriptOptions(cfg) {
	const configuredLogging = readLoggingConfig();
	const patterns = resolveTranscriptRedactPatterns(cfg?.logging?.redactPatterns ?? configuredLogging?.redactPatterns);
	if (patterns === void 0) return;
	return {
		mode: "tools",
		...patterns !== void 0 ? { patterns } : {}
	};
}
function isTranscriptRedactionDisabled(cfg) {
	return false;
}
function redactTranscriptText(value, cfg) {
	return redactSensitiveText(value, redactTranscriptOptions(cfg));
}
function redactTranscriptStructuredFieldValue(key, value, cfg) {
	return /^(?:next[_-]?)?page[_-]?token$|^page[_-]?cursor$/i.test(key) ? redactTranscriptText(value, cfg) : redactSensitiveFieldValue(key, value, redactTranscriptOptions(cfg));
}
function isPlainTranscriptObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
const GOOGLE_REASONING_APIS = /* @__PURE__ */ new Set([
	"google-generative-ai",
	"google-vertex",
	"google-gemini-cli",
	"openclaw-google-generative-ai-transport"
]);
const ANTHROPIC_REASONING_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"bedrock-converse-stream",
	"openclaw-anthropic-messages-transport"
]);
const OPENAI_COMPLETIONS_APIS = /* @__PURE__ */ new Set(["openai-completions", "openclaw-openai-completions-transport"]);
const OPAQUE_REPLAY_TOKEN_RE = /^[A-Za-z0-9+/_-]+={0,2}$/;
const GOOGLE_THOUGHT_SIGNATURE_RE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const OPENAI_REPLAY_CONTEXT_HASH_RE = /^[a-z0-9]{2,16}$/;
function isOpenAIReplayContextHash(value) {
	return typeof value === "string" && OPENAI_REPLAY_CONTEXT_HASH_RE.test(value);
}
function isOpenAIResponsesApi(api) {
	return OPENAI_RESPONSES_APIS.has(api);
}
function isOpenAIResponsesRoute(route) {
	return typeof route?.api === "string" && isOpenAIResponsesApi(route.api);
}
function isGoogleReasoningRoute(route) {
	return typeof route?.api === "string" && GOOGLE_REASONING_APIS.has(route.api);
}
function isAnthropicReasoningRoute(route) {
	return typeof route?.api === "string" && ANTHROPIC_REASONING_APIS.has(route.api);
}
const isOpenAICompletionsRoute = (route) => OPENAI_COMPLETIONS_APIS.has(route?.api ?? "");
function isGoogleOpenAICompletionsRoute(route) {
	return isOpenAICompletionsRoute(route) && (route?.provider === "google" || route?.endpointClass === "google-generative-ai" || route?.endpointClass === "google-vertex");
}
function isVeniceGeminiOpenAICompletionsRoute(route) {
	return isOpenAICompletionsRoute(route) && route?.provider === "venice" && typeof route.model === "string" && /(?:^|\/)gemini-/.test(route.model.trim().toLowerCase());
}
function isCustomProviderRoute(route) {
	return Boolean(route?.api && route.model && route.provider) && route?.api !== "mistral-conversations" && !isOpenAIResponsesRoute(route) && !isGoogleReasoningRoute(route) && !isAnthropicReasoningRoute(route) && !isOpenAICompletionsRoute(route);
}
function isGitHubCopilotResponsesRoute(route) {
	return (route?.api === "openai-responses" || route?.api === "openclaw-openai-responses-transport") && route.provider === "github-copilot";
}
function isStructurallyValidOpaqueReplayToken(value) {
	return value.length > 0 && value === value.trim() && OPAQUE_REPLAY_TOKEN_RE.test(value) && !value.includes("…");
}
function isCredentialSafeOpaqueReplayToken(value) {
	if (!isStructurallyValidOpaqueReplayToken(value)) return false;
	return value.startsWith("gAAAA") || redactSensitiveText(value, { mode: "tools" }) === value;
}
function isGoogleThoughtSignature(value) {
	return value.length > 0 && value === value.trim() && !value.includes("…") && GOOGLE_THOUGHT_SIGNATURE_RE.test(value);
}
function resolveTranscriptAssistantRoute(source, cfg) {
	const api = typeof source.api === "string" ? source.api : void 0;
	const model = typeof source.model === "string" ? source.model : void 0;
	const provider = typeof source.provider === "string" ? source.provider : void 0;
	const providerConfig = provider ? findNormalizedProviderValue(cfg?.models?.providers, provider) : void 0;
	const baseUrl = (model ? providerConfig?.models?.find((candidate) => candidate.id === model) : void 0)?.baseUrl ?? providerConfig?.baseUrl;
	const endpointClass = baseUrl ? resolveProviderEndpoint(baseUrl).endpointClass : void 0;
	return {
		...api ? { api } : {},
		...endpointClass ? { endpointClass } : {},
		...model ? { model } : {},
		...provider ? { provider } : {}
	};
}
function isSafeReplayIdentifier(value, maxLength = 512) {
	return value.length > 0 && value.length <= maxLength && value === value.trim() && /^[A-Za-z0-9+/_:.=-]+$/.test(value) && redactSensitiveText(value, { mode: "tools" }) === value;
}
function isOpenAIResponseItemId(value, route) {
	return isSafeReplayIdentifier(value, isGitHubCopilotResponsesRoute(route) ? 64 : 512);
}
const replaySanitizerHelpers = {
	isAnthropicReasoningRoute,
	isOpenAIReplayContextHash,
	isOpenAIResponseItemId,
	isOpenAIResponsesApi,
	isOpenAIResponsesRoute,
	isPlainTranscriptObject,
	isStructurallyValidOpaqueReplayToken,
	redactTranscriptText
};
function isOpenAITextSignature(value, route) {
	if (value.startsWith("{")) try {
		const parsed = JSON.parse(value);
		if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed)) return false;
		if (!Object.keys(parsed).every((key) => key === "v" || key === "id" || key === "phase")) return false;
		const id = typeof parsed.id === "string" && isOpenAIResponseItemId(parsed.id, route) ? parsed.id : void 0;
		const phase = parsed.phase === "commentary" || parsed.phase === "final_answer" ? parsed.phase : void 0;
		if (parsed.id !== void 0 && id === void 0) return false;
		return parsed.v === 1 && (id !== void 0 || phase !== void 0);
	} catch {
		return false;
	}
	return isOpenAIResponseItemId(value, route);
}
const OPENAI_REASONING_REPLAY_METADATA_KEYS = /* @__PURE__ */ new Set([
	"v",
	"source",
	"provider",
	"api",
	"model",
	"baseUrlHash",
	"sessionHash",
	"authProfileHash"
]);
const OPENAI_REASONING_REPLAY_METADATA_KEY = "__openclaw_replay";
function sanitizeOpenAIReasoningReplayMetadata(value, route) {
	if (!value || typeof value !== "object" || !isPlainTranscriptObject(value) || !route?.api || !route.model || !route.provider) return;
	if (value.v !== 1 || value.source !== "openai-responses" || value.provider !== route?.provider || value.api !== route.api || value.model !== route.model || value.baseUrlHash !== void 0 && !isOpenAIReplayContextHash(value.baseUrlHash) || value.sessionHash !== void 0 && !isOpenAIReplayContextHash(value.sessionHash) || value.authProfileHash !== void 0 && !isOpenAIReplayContextHash(value.authProfileHash)) return;
	if (Object.keys(value).every((key) => OPENAI_REASONING_REPLAY_METADATA_KEYS.has(key))) return value;
	return {
		v: 1,
		source: "openai-responses",
		provider: value.provider,
		api: value.api,
		model: value.model,
		...value.baseUrlHash !== void 0 ? { baseUrlHash: value.baseUrlHash } : {},
		...value.sessionHash !== void 0 ? { sessionHash: value.sessionHash } : {},
		...value.authProfileHash !== void 0 ? { authProfileHash: value.authProfileHash } : {}
	};
}
function shouldPreserveOpaqueProviderPayload(source, key, item, location, route) {
	if (location !== "assistant-content-block" || typeof item !== "string") return false;
	const type = source.type;
	const isAnthropicSlot = type === "thinking" && (key === "thinkingSignature" || key === "signature") || type === "redacted_thinking" && (key === "data" || key === "signature" || key === "thinkingSignature");
	if (isAnthropicReasoningRoute(route) && isAnthropicSlot) return isStructurallyValidOpaqueReplayToken(item);
	const isGoogleSlot = type === "text" && key === "textSignature" || type === "thinking" && (key === "thinkingSignature" || key === "thought_signature") || type === "toolCall" && key === "thoughtSignature";
	if (isGoogleReasoningRoute(route) && isGoogleSlot) return isGoogleThoughtSignature(item);
	if ((isGoogleOpenAICompletionsRoute(route) || isVeniceGeminiOpenAICompletionsRoute(route)) && type === "toolCall" && key === "thoughtSignature") return isStructurallyValidOpaqueReplayToken(item);
	if (!isCustomProviderRoute(route) || !isCredentialSafeOpaqueReplayToken(item)) return false;
	return type === "text" && key === "textSignature" || type === "thinking" && (key === "thinkingSignature" || key === "signature" || key === "thought_signature") || type === "redacted_thinking" && (key === "data" || key === "signature" || key === "thinkingSignature") || type === "toolCall" && key === "thoughtSignature";
}
function sanitizeOpenAIReasoningSignature(value, route) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning" || parsed.summary !== void 0 && !Array.isArray(parsed.summary)) return;
	const encryptedContent = parsed.encrypted_content;
	const hasEncryptedContent = Object.hasOwn(parsed, "encrypted_content");
	const isValidEncryptedContent = isOpenAIResponsesRoute(route) ? isStructurallyValidOpaqueReplayToken : isCredentialSafeOpaqueReplayToken;
	if (encryptedContent !== void 0 && encryptedContent !== null && (typeof encryptedContent !== "string" || !isValidEncryptedContent(encryptedContent))) return;
	if (parsed.id !== void 0 && (typeof parsed.id !== "string" || !isOpenAIResponseItemId(parsed.id, route))) return;
	if (parsed.status !== void 0 && parsed.status !== "in_progress" && parsed.status !== "completed" && parsed.status !== "incomplete") return;
	if (!hasEncryptedContent && typeof parsed.id !== "string") return;
	const replayMetadata = sanitizeOpenAIReasoningReplayMetadata(parsed[OPENAI_REASONING_REPLAY_METADATA_KEY], route);
	return JSON.stringify({
		...typeof parsed.id === "string" ? { id: parsed.id } : {},
		type: "reasoning",
		summary: [],
		...parsed.status !== void 0 ? { status: parsed.status } : {},
		...hasEncryptedContent ? { encrypted_content: encryptedContent } : {},
		...replayMetadata ? { [OPENAI_REASONING_REPLAY_METADATA_KEY]: replayMetadata } : {}
	});
}
function sanitizeOpenAICompletionsToolSignature(value, route) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		return;
	}
	const isValidEncryptedData = isOpenAICompletionsRoute(route) ? isStructurallyValidOpaqueReplayToken : isCredentialSafeOpaqueReplayToken;
	if (!parsed || typeof parsed !== "object" || !isPlainTranscriptObject(parsed) || parsed.type !== "reasoning.encrypted" || typeof parsed.data !== "string" || !isValidEncryptedData(parsed.data) || parsed.id !== void 0 && parsed.id !== null && (typeof parsed.id !== "string" || !isSafeReplayIdentifier(parsed.id)) || parsed.format !== void 0 && parsed.format !== null && (typeof parsed.format !== "string" || parsed.format.length > 64 || !/^[a-z0-9.-]+$/.test(parsed.format)) || parsed.index !== void 0 && (!Number.isSafeInteger(parsed.index) || parsed.index < 0)) return;
	return JSON.stringify({
		type: "reasoning.encrypted",
		data: parsed.data,
		...parsed.id !== void 0 ? { id: parsed.id } : {},
		...parsed.format !== void 0 ? { format: parsed.format } : {},
		...parsed.index !== void 0 ? { index: parsed.index } : {}
	});
}
function redactTranscriptStructuredValue(value, cfg, fieldKey, seen = /* @__PURE__ */ new WeakSet(), preserveImageDataUrlFields = false, location = "nested", assistantRoute) {
	if (typeof value === "string") {
		if (fieldKey) return redactTranscriptStructuredFieldValue(fieldKey, value, cfg);
		return redactTranscriptText(value, cfg);
	}
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		let changed = false;
		const redacted = value.map((item) => {
			const next = redactTranscriptStructuredValue(item, cfg, fieldKey, seen, preserveImageDataUrlFields, location === "assistant-content-array" ? "assistant-content-block" : "nested", assistantRoute);
			changed ||= next !== item;
			return next;
		});
		seen.delete(value);
		return changed ? redacted : value;
	}
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	if (!isPlainTranscriptObject(value)) return value;
	seen.add(value);
	const source = sanitizeTranscriptImageRecord(value) ?? value;
	const currentAssistantRoute = location === "root" && source.role === "assistant" ? resolveTranscriptAssistantRoute(source, cfg) : assistantRoute;
	let next = null;
	if (source !== value) next = { ...source };
	for (const [key, item] of Object.entries(source)) {
		if (location === "root" && source.role === "assistant" && key === "providerReplay") {
			const sanitizedReplay = sanitizeCompactionReplayState(item, currentAssistantRoute, cfg, replaySanitizerHelpers);
			if (sanitizedReplay !== void 0) {
				if (sanitizedReplay !== item) {
					next ??= { ...source };
					next[key] = sanitizedReplay;
				}
				continue;
			}
			next ??= { ...source };
			delete next[key];
			continue;
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "openclawReasoningReplay") {
			const sanitizedMetadata = sanitizeOpenAIReasoningReplayMetadata(item, currentAssistantRoute);
			if (sanitizedMetadata !== void 0) {
				if (sanitizedMetadata !== item) {
					next ??= { ...source };
					next[key] = sanitizedMetadata;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "thinking" && key === "thinkingSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAIReasoningSignature(item, currentAssistantRoute);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (location === "assistant-content-block" && (isOpenAIResponsesRoute(currentAssistantRoute) || isOpenAICompletionsRoute(currentAssistantRoute) || isAnthropicReasoningRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "text" && key === "textSignature" && typeof item === "string" && isOpenAITextSignature(item, currentAssistantRoute)) continue;
		if (location === "assistant-content-block" && (isOpenAICompletionsRoute(currentAssistantRoute) || isCustomProviderRoute(currentAssistantRoute)) && source.type === "toolCall" && key === "thoughtSignature" && typeof item === "string") {
			const sanitizedSignature = sanitizeOpenAICompletionsToolSignature(item, currentAssistantRoute);
			if (sanitizedSignature !== void 0) {
				if (sanitizedSignature !== item) {
					next ??= { ...source };
					next[key] = sanitizedSignature;
				}
				continue;
			}
		}
		if (shouldPreserveOpaqueProviderPayload(source, key, item, location, currentAssistantRoute)) continue;
		if (typeof item === "string") {
			const sanitizedDataUrl = sanitizeTranscriptImageDataUrlField({
				source,
				key,
				value: item,
				preserveImageDataUrlFields
			});
			if (sanitizedDataUrl !== void 0) {
				if (sanitizedDataUrl !== item) {
					next ??= { ...source };
					next[key] = sanitizedDataUrl;
				}
				continue;
			}
		}
		if (shouldPreserveTranscriptImagePayload(source, key, item, preserveImageDataUrlFields)) continue;
		const redacted = redactTranscriptStructuredValue(item, cfg, key, seen, preserveImageDataUrlFields || shouldPreserveNestedTranscriptImageDataUrlFields(source, key), location === "root" && source.role === "assistant" && key === "content" && Array.isArray(item) ? "assistant-content-array" : "nested", currentAssistantRoute);
		if (redacted === item) continue;
		next ??= { ...source };
		next[key] = redacted;
	}
	seen.delete(value);
	return next ?? value;
}
/** Return a redacted transcript message according to logging config. */
function redactTranscriptMessage(message, cfg) {
	if (isTranscriptRedactionDisabled(cfg)) return message;
	return redactTranscriptStructuredValue(message, cfg, void 0, /* @__PURE__ */ new WeakSet(), false, "root");
}
//#endregion
//#region src/config/sessions/version.ts
/** Current persisted session transcript/header schema version. */
const CURRENT_SESSION_VERSION = 3;
//#endregion
//#region src/config/sessions/transcript-header.ts
/** Creates a session transcript header entry with current version metadata. */
function createSessionTranscriptHeader(params = {}) {
	return {
		type: "session",
		version: 3,
		id: params.sessionId ?? randomUUID(),
		timestamp: params.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
		cwd: params.cwd ?? process.cwd(),
		...params.parentSession ? { parentSession: params.parentSession } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-store.ts
function appendTranscriptEventInTransaction(database, scope, event, options = {}) {
	const persistedEvent = canonicalizeTranscriptEventMedia(event);
	const db = getSessionKysely(database.db);
	const createdAt = readEventTimestamp(persistedEvent) ?? Date.now();
	ensureTranscriptSessionRoot(database, scope, createdAt, { allowStoredAlias: options.allowStoredAlias === true });
	ensureTranscriptGenerationInTransaction(database, scope.sessionId);
	const identity = readTranscriptEventIdentity(persistedEvent);
	if (identity && readTranscriptIdentityByEventId(database, scope.sessionId, identity.eventId)) return false;
	if (identity?.messageIdempotencyKey && options.dedupeByMessageIdempotency && readTranscriptIdentityByMessageIdempotencyKey(database, scope.sessionId, identity.messageIdempotencyKey)) return false;
	const seq = readNextTranscriptSeq(database, scope.sessionId);
	executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
		session_id: scope.sessionId,
		seq,
		event_json: JSON.stringify(persistedEvent),
		created_at: createdAt
	}));
	if (options.touchMutation !== false) touchTranscriptMutationInTransaction(database, scope.sessionId);
	const projectionNeedsRebuild = indexAppendedTranscriptEventInTransaction(database.db, {
		sessionId: scope.sessionId,
		seq,
		event: persistedEvent,
		eventId: identity?.eventId ?? null,
		createdAt
	});
	if (projectionNeedsRebuild) options.onProjectionReconcileNeeded?.();
	if (!identity) {
		scheduleTranscriptProjectionReconcile(database, scope, projectionNeedsRebuild, options);
		return true;
	}
	const indexedMessageIdempotencyKey = identity.messageIdempotencyKey && !options.dedupeByMessageIdempotency && readTranscriptIdentityByMessageIdempotencyKey(database, scope.sessionId, identity.messageIdempotencyKey) ? void 0 : identity.messageIdempotencyKey;
	executeSqliteQuerySync(database.db, db.insertInto("transcript_event_identities").values({
		session_id: scope.sessionId,
		event_id: identity.eventId,
		seq,
		event_type: identity.eventType,
		parent_id: identity.parentId,
		message_idempotency_key: indexedMessageIdempotencyKey,
		created_at: createdAt
	}).onConflict((conflict) => conflict.columns(["session_id", "event_id"]).doNothing()));
	scheduleTranscriptProjectionReconcile(database, scope, projectionNeedsRebuild, options);
	return true;
}
function scheduleTranscriptProjectionReconcile(database, scope, projectionNeedsRebuild, options) {
	if (!projectionNeedsRebuild || options.scheduleProjectionReconcile === false) return;
	startSessionTranscriptIndexReconcile({
		agentId: scope.agentId,
		path: database.path,
		preferredSessionId: scope.sessionId
	});
}
function appendTranscriptEventsInTransaction(database, scope, events) {
	let appended = 0;
	let projectionNeedsRebuild = false;
	for (const event of events) if (appendTranscriptEventInTransaction(database, scope, event, {
		onProjectionReconcileNeeded: () => {
			projectionNeedsRebuild = true;
		},
		scheduleProjectionReconcile: false,
		touchMutation: false
	})) appended += 1;
	if (appended > 0) {
		touchTranscriptMutationInTransaction(database, scope.sessionId);
		scheduleTranscriptProjectionReconcile(database, scope, projectionNeedsRebuild, {});
	}
	return appended;
}
function appendTranscriptEventRowInTransaction(database, scope, event, seq, state, createdAtOverride) {
	const persistedEvent = canonicalizeTranscriptEventMedia(event);
	const db = getSessionKysely(database.db);
	const createdAt = createdAtOverride ?? readEventTimestamp(persistedEvent) ?? Date.now();
	const identity = readTranscriptEventIdentity(persistedEvent);
	if (identity && state.seenEventIds.has(identity.eventId)) return false;
	executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
		session_id: scope.sessionId,
		seq,
		event_json: JSON.stringify(persistedEvent),
		created_at: createdAt
	}));
	indexAppendedTranscriptEventInTransaction(database.db, {
		sessionId: scope.sessionId,
		seq,
		event: persistedEvent,
		eventId: identity?.eventId ?? null,
		createdAt
	});
	if (!identity) return true;
	state.seenEventIds.add(identity.eventId);
	const indexedMessageIdempotencyKey = identity.messageIdempotencyKey && !state.seenMessageIdempotencyKeys.has(identity.messageIdempotencyKey) ? identity.messageIdempotencyKey : void 0;
	if (indexedMessageIdempotencyKey) state.seenMessageIdempotencyKeys.add(indexedMessageIdempotencyKey);
	executeSqliteQuerySync(database.db, db.insertInto("transcript_event_identities").values({
		session_id: scope.sessionId,
		event_id: identity.eventId,
		seq,
		event_type: identity.eventType,
		parent_id: identity.parentId,
		message_idempotency_key: indexedMessageIdempotencyKey,
		created_at: createdAt
	}));
	return true;
}
function ensureTranscriptHeader(database, scope, cwd, now) {
	const db = getSessionKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", scope.sessionId).limit(1))) return;
	appendTranscriptEventInTransaction(database, scope, createSessionTranscriptHeader({
		cwd,
		sessionId: scope.sessionId
	}));
	ensureTranscriptSessionRoot(database, scope, now);
}
function readActiveTranscriptAppendParentId(database, sessionId) {
	const db = getSessionKysely(database.db);
	const latest = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as ti").innerJoin("transcript_events as te", (join) => join.onRef("te.session_id", "=", "ti.session_id").onRef("te.seq", "=", "ti.seq")).select(["ti.event_type", "te.event_json"]).where("ti.session_id", "=", sessionId).orderBy("ti.seq", "desc").limit(1));
	if (!latest) return null;
	try {
		const event = JSON.parse(latest.event_json);
		const treeEntry = parseSessionTranscriptTreeEntry(event);
		if (!treeEntry) return resolveVisibleTranscriptAppendParentId(loadTranscriptEventsFromDatabase(database, sessionId));
		if (latest.event_type !== "leaf") return treeEntry.appendParentId;
		const leafReferencesKnown = treeEntry.leafId !== void 0 && transcriptTreeReferenceExists(database, sessionId, treeEntry.leafId) && transcriptTreeReferenceExists(database, sessionId, treeEntry.appendParentId);
		if (isSessionTranscriptLeafControl(event) && leafReferencesKnown) return treeEntry.appendParentId;
	} catch {}
	return resolveVisibleTranscriptAppendParentId(loadTranscriptEventsFromDatabase(database, sessionId));
}
function transcriptTreeReferenceExists(database, sessionId, eventId) {
	return eventId === null || readTranscriptIdentityByEventId(database, sessionId, eventId) !== void 0;
}
function replaceSqliteTranscriptEventsInTransaction(database, resolved, events, options = {}) {
	const preservedTranscriptUpdatedAt = options.preserveSessionWindowRecency === true ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0;
	const previousGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId);
	const deleted = deleteTranscriptEventsInTransaction(database, resolved.sessionId);
	if (events.length === 0) {
		if (deleted || previousGeneration) {
			rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
			recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		}
		return;
	}
	if (!deleted || options.preserveSessionWindowRecency !== true) ensureTranscriptSessionRoot(database, resolved, readEventTimestamp(events[0]) ?? Date.now());
	if (deleted || previousGeneration) rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	else ensureTranscriptGenerationInTransaction(database, resolved.sessionId);
	let seq = 0;
	const seenEventIds = /* @__PURE__ */ new Set();
	const seenMessageIdempotencyKeys = /* @__PURE__ */ new Set();
	for (const [eventIndex, event] of events.entries()) if (appendTranscriptEventRowInTransaction(database, resolved, event, seq, {
		seenEventIds,
		seenMessageIdempotencyKeys
	}, options.createdAtByIndex?.[eventIndex])) seq += 1;
	if (deleted || seq > 0) {
		recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		reconcileSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
	}
}
function recordTranscriptReplacementMutation(database, sessionId, preservedUpdatedAt) {
	if (preservedUpdatedAt === void 0 || preservedUpdatedAt === null) {
		touchTranscriptMutationInTransaction(database, sessionId);
		return;
	}
	advanceTranscriptMutationAtInTransaction(database, sessionId, preservedUpdatedAt, { strictly: true });
}
/** Rewrite existing transcript rows exactly, without append-time deduplication. */
function rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, rows) {
	if (rows.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const row of rows) {
		const persistedEvent = canonicalizeTranscriptEventMedia(row.event);
		if (executeSqliteQuerySync(database.db, db.updateTable("transcript_events").set({ event_json: JSON.stringify(persistedEvent) }).where("session_id", "=", resolved.sessionId).where("seq", "=", row.seq).where("event_json", "=", row.expectedEventJson)).numAffectedRows !== 1n) throw new Error(`Transcript row ${resolved.sessionId}:${row.seq} changed before exact rewrite`);
	}
	rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	touchTranscriptMutationInTransaction(database, resolved.sessionId);
	reconcileSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
}
function updateSqliteTranscriptEventJsonInTransaction(database, sessionId, updates) {
	if (updates.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const { seq, eventJson } of updates) executeSqliteQuerySync(database.db, db.updateTable("transcript_events").set({ event_json: eventJson }).where("session_id", "=", sessionId).where("seq", "=", seq));
	rotateTranscriptGenerationInTransaction(database, sessionId);
	deleteSessionTranscriptIndexInTransaction(database.db, sessionId);
	reconcileSessionTranscriptIndexInTransaction(database.db, sessionId);
	const currentUpdatedAt = readTranscriptMutationStateInTransaction(database, sessionId).updatedAt;
	if (currentUpdatedAt === null) touchTranscriptMutationInTransaction(database, sessionId);
	else advanceTranscriptMutationAtInTransaction(database, sessionId, currentUpdatedAt, { strictly: true });
}
function readTranscriptIdentityByEventId(database, sessionId, eventId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select([
		"event_id",
		"parent_id",
		"seq"
	]).where("session_id", "=", sessionId).where("event_id", "=", eventId));
	return row ? {
		eventId: row.event_id,
		parentId: row.parent_id,
		seq: row.seq
	} : void 0;
}
function readTranscriptIdentityByMessageIdempotencyKey(database, sessionId, idempotencyKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select(["event_id", "seq"]).where("session_id", "=", sessionId).where("message_idempotency_key", "=", idempotencyKey).orderBy("seq", "desc").limit(1));
	return row ? {
		eventId: row.event_id,
		seq: row.seq
	} : void 0;
}
function readTranscriptMessageByIdempotencyKey(database, scope, idempotencyKey) {
	const identity = readTranscriptIdentityByMessageIdempotencyKey(database, scope.sessionId, idempotencyKey);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptMessageByScopedIdempotencyKey(database, scope, idempotencyKey, lookup) {
	if (lookup !== "scan-assistant") return readTranscriptMessageByIdempotencyKey(database, scope, idempotencyKey);
	const found = findTranscriptEventInDatabase(database, scope.sessionId, (event) => {
		const message = readTranscriptEventMessage(event);
		return message?.role === "assistant" && message.idempotencyKey === idempotencyKey;
	});
	if (!found) return;
	const message = readTranscriptEventMessage(found.event);
	return message ? {
		messageId: readTranscriptEventId(found.event) ?? idempotencyKey,
		message
	} : void 0;
}
function readTranscriptMessageByEventId(database, scope, eventId) {
	const identity = readTranscriptIdentityByEventId(database, scope.sessionId, eventId);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptMessageByIdentity(database, scope, identity) {
	const db = getSessionKysely(database.db);
	const eventRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(["event_json"]).where("session_id", "=", scope.sessionId).where("seq", "=", identity.seq));
	if (!eventRow) return;
	const event = JSON.parse(eventRow.event_json);
	return {
		messageId: identity.eventId,
		message: event.message
	};
}
function readTranscriptEventIdentity(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const record = event;
	const eventId = typeof record.id === "string" && record.id.trim() ? record.id.trim() : void 0;
	return eventId ? {
		eventId,
		eventType: typeof record.type === "string" ? record.type : null,
		parentId: typeof record.parentId === "string" ? record.parentId : null,
		messageIdempotencyKey: readMessageIdempotencyKey(record.message)
	} : void 0;
}
function canonicalizeTranscriptEventMedia(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return event;
	const record = event;
	const message = record.message;
	if (record.type !== "message" || !message || typeof message !== "object" || Array.isArray(message)) return event;
	const canonical = canonicalizePersistedUserMessageMedia(message);
	return canonical.changed ? {
		...record,
		message: canonical.message
	} : event;
}
function readMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value.trim() : null;
}
function readEventTimestamp(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const value = event.timestamp;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value !== "string" || !value.trim()) return;
	const parsed = Date.parse(value);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function redactTranscriptMessageForStorage(message, options) {
	return isTranscriptAgentMessage(message) ? redactTranscriptMessage(message, options.config) : redactSecrets(message);
}
function isTranscriptAgentMessage(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && typeof value.role === "string";
}
//#endregion
export { readTranscriptStorageRows as A, loadTranscriptTailEventsSync as C, readTranscriptEventRows as D, readTranscriptEventMessage as E, resolveSqliteSessionTranscriptReadFence as M, runWithSessionTranscriptReadFence as N, readTranscriptSnapshot as O, loadTranscriptHeaderSync as S, readTranscriptEventJsonSetInTransaction as T, loadLatestAssistantText as _, readMessageIdempotencyKey as a, loadTranscriptEventsFromDatabase as b, readTranscriptMessageByScopedIdempotencyKey as c, rewriteSqliteTranscriptEventRowsInTransaction as d, updateSqliteTranscriptEventJsonInTransaction as f, findTranscriptEvent as g, redactTranscriptMessage as h, readActiveTranscriptAppendParentId as i, SessionTranscriptReadFenceError as j, readTranscriptStatsSync as k, redactTranscriptMessageForStorage as l, CURRENT_SESSION_VERSION as m, appendTranscriptEventsInTransaction as n, readTranscriptIdentityByEventId as o, createSessionTranscriptHeader as p, ensureTranscriptHeader as r, readTranscriptMessageByEventId as s, appendTranscriptEventInTransaction as t, replaceSqliteTranscriptEventsInTransaction as u, loadTranscriptEventRowsAfterSeqSync as v, readTranscriptEventAtSeqSync as w, loadTranscriptEventsSync as x, loadTranscriptEvents as y };
