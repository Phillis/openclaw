import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { d as asPositiveSafeInteger, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-UYcIi_5g.js";
import "./version-CwNT1gaY.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BQC2sTma.js";
import { a as readSessionTranscriptUpdateVersion, r as onInternalSessionTranscriptUpdate } from "./transcript-events-Ce7n2r8A.js";
import { P as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-fcDZuc2H.js";
import { C as projectChatDisplayMessages, c as readSessionMessagesWithSourceAsync, k as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, s as readSessionMessagesPageWithStatsAsync, v as attachOpenClawTranscriptMeta, w as projectChatDisplayMessagesWithState, x as resolveCurrentUserProfileDisplay } from "./session-transcript-readers-fCOIrclF.js";
import { a as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-BR7phvyf.js";
import { f as resolveGatewaySessionStoreTargetWithStore, s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { c as getMaxChatHistoryMessagesBytes } from "./server-constants-DKuFNbQH.js";
import { _ as resolveSharedSecretHttpOperatorScopes, d as getHeader, l as checkGatewayHttpRequestAuth, s as authorizeScopedGatewayHttpRequestOrReply } from "./http-auth-utils-Bmffinhw.js";
import { c as sendMethodNotAllowed, o as sendInvalidRequest, p as setSseHeaders, s as sendJson, t as SSE_CONTENT_TYPE } from "./http-common-Dy8Dj7pv.js";
import { g as resolveSessionSharingTarget, u as createSessionListEntryFilter } from "./session-sharing-DSLYm21V.js";
import "./http-utils-Q1g14o7u.js";
import { i as readIncrementalChatHistoryTail, r as readChatHistoryMessageSeq } from "./session-history-tail-_xLpIyvr.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/http-media-range.ts
const HTTP_TOKEN_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u;
const HTTP_QVALUE_PATTERN = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/u;
const HTTP_OPTIONAL_WHITESPACE_PATTERN = /^[\t ]+|[\t ]+$/gu;
function trimHttpOptionalWhitespace(value) {
	return value.replace(HTTP_OPTIONAL_WHITESPACE_PATTERN, "");
}
function splitOutsideQuotedStrings(value, delimiter) {
	const parts = [];
	let start = 0;
	let quoted = false;
	let escaped = false;
	for (let index = 0; index < value.length; index += 1) {
		const character = value[index];
		if (quoted) {
			if (escaped) {
				escaped = false;
				continue;
			}
			if (character === "\\") {
				escaped = true;
				continue;
			}
			if (character === "\"") quoted = false;
			continue;
		}
		if (character === "\"") {
			quoted = true;
			continue;
		}
		if (character === delimiter) {
			parts.push(value.slice(start, index));
			start = index + 1;
		}
	}
	if (quoted || escaped) return null;
	parts.push(value.slice(start));
	return parts;
}
function parseParameterValue(value) {
	if (HTTP_TOKEN_PATTERN.test(value)) return value;
	if (value.length < 2 || value[0] !== "\"" || value.at(-1) !== "\"") return null;
	let parsed = "";
	let escaped = false;
	for (let index = 1; index < value.length - 1; index += 1) {
		const character = value[index];
		if (escaped) {
			parsed += character;
			escaped = false;
			continue;
		}
		if (character === "\\") {
			escaped = true;
			continue;
		}
		if (character === "\"") return null;
		parsed += character;
	}
	return escaped ? null : parsed;
}
function normalizeParameterValue(name, value) {
	return name === "charset" ? value.toLowerCase() : value;
}
function parseMediaType(value, allowQuality) {
	const segments = splitOutsideQuotedStrings(value, ";");
	if (!segments) return null;
	const [type, subtype, ...extra] = trimHttpOptionalWhitespace(segments.shift() ?? "").toLowerCase().split("/");
	if (extra.length > 0 || !type || !subtype || !HTTP_TOKEN_PATTERN.test(type) || !HTTP_TOKEN_PATTERN.test(subtype)) return null;
	let quality = 1;
	let qualitySeen = false;
	const parameters = /* @__PURE__ */ new Map();
	for (const rawParameter of segments) {
		const parameter = trimHttpOptionalWhitespace(rawParameter);
		if (!parameter) continue;
		const separator = parameter.indexOf("=");
		const name = (separator < 0 ? parameter : parameter.slice(0, separator)).toLowerCase();
		if (!HTTP_TOKEN_PATTERN.test(name)) return null;
		if (separator <= 0) return null;
		const rawValue = parameter.slice(separator + 1);
		if (!rawValue) return null;
		if (name === "q") {
			if (!allowQuality || qualitySeen || !HTTP_QVALUE_PATTERN.test(rawValue)) return null;
			qualitySeen = true;
			quality = Number(rawValue);
			continue;
		}
		const parameterValue = parseParameterValue(rawValue);
		if (parameterValue === null || parameters.has(name)) return null;
		parameters.set(name, normalizeParameterValue(name, parameterValue));
	}
	return {
		type,
		subtype,
		parameters,
		quality
	};
}
function matchesRepresentation(range, representation) {
	if (range.type !== representation.type || range.subtype !== representation.subtype) return false;
	for (const [name, value] of range.parameters) if (representation.parameters.get(name) !== value) return false;
	return true;
}
/**
* Checks for an explicit, positive-quality media range in an Accept field.
* Wildcards intentionally do not opt callers into long-lived streaming responses.
*/
function hasExplicitAcceptableMediaRange(accept, expectedRepresentation) {
	if (!accept) return false;
	const representation = parseMediaType(expectedRepresentation, false);
	if (!representation) return false;
	const ranges = splitOutsideQuotedStrings(accept, ",");
	if (!ranges) return false;
	let bestSpecificity = -1;
	let bestExplicitQuality = 0;
	for (const range of ranges) {
		if (!trimHttpOptionalWhitespace(range)) continue;
		const parsedRange = parseMediaType(range, true);
		if (!parsedRange || !matchesRepresentation(parsedRange, representation)) continue;
		const specificity = parsedRange.parameters.size;
		if (specificity > bestSpecificity) {
			bestSpecificity = specificity;
			bestExplicitQuality = parsedRange.quality;
		} else if (specificity === bestSpecificity) bestExplicitQuality = Math.max(bestExplicitQuality, parsedRange.quality);
	}
	return bestSpecificity >= 0 && bestExplicitQuality > 0;
}
//#endregion
//#region src/gateway/session-transcript-path.ts
/** Resolve a transcript file path into a stable comparison key. */
function resolveTranscriptPathForComparison(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const resolved = path.resolve(trimmed);
	try {
		return fs.realpathSync(resolved);
	} catch {
		return resolved;
	}
}
//#endregion
//#region src/gateway/session-history-state.ts
function readMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value : void 0;
}
/** Owns both complete history snapshots and bounded visible-message pages. */
async function readSessionHistoryRawSnapshotAsync(params) {
	if (typeof params.limit !== "number") {
		const snapshot = await readSessionMessagesWithSourceAsync(params.target, {
			mode: "full",
			reason: "session history cursor pagination",
			allowResetArchiveFallback: true
		});
		return {
			rawMessages: snapshot.messages,
			transcriptPath: snapshot.transcriptPath
		};
	}
	const cursorSeq = resolveCursorSeq(params.cursor);
	const offset = cursorSeq === void 0 ? void 0 : Math.max(0, (await readSessionMessagesPageWithStatsAsync(params.target, {
		offset: 0,
		maxMessages: 0,
		allowResetArchiveFallback: true
	})).totalMessages - cursorSeq + 1);
	const tail = await readIncrementalChatHistoryTail({
		entry: params.target.sessionEntry,
		readScope: params.target,
		effectiveMaxChars: params.maxChars ?? 8e3,
		max: params.limit,
		maxBytes: getMaxChatHistoryMessagesBytes(),
		...offset === void 0 ? {} : { offset },
		preserveProjectionContext: true
	});
	return {
		projection: tail.projection,
		rawMessages: tail.rawMessages,
		rawTranscriptSeq: tail.readPage.totalMessages,
		totalRawMessages: tail.readPage.totalMessages,
		transcriptPath: tail.readPage.transcriptPath
	};
}
function resolveCursorSeq(cursor) {
	if (!cursor) return;
	const normalized = cursor.startsWith("seq:") ? cursor.slice(4) : cursor;
	if (!/^\d+$/.test(normalized)) return;
	const value = Number(normalized);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function toSessionHistoryMessages(messages) {
	return messages.filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message));
}
function buildPaginatedSessionHistory(params) {
	return {
		items: params.messages,
		messages: params.messages,
		hasMore: params.hasMore,
		...params.nextCursor ? { nextCursor: params.nextCursor } : {}
	};
}
function isMessageToolMirrorMessage(message) {
	return message.openclawMessageToolMirror !== void 0;
}
function paginateSessionMessages(messages, limit, cursor) {
	const cursorSeq = resolveCursorSeq(cursor);
	let endExclusive = messages.length;
	if (typeof cursorSeq === "number") {
		endExclusive = messages.findIndex((message, index) => {
			const seq = readChatHistoryMessageSeq(message);
			if (typeof seq === "number") return seq >= cursorSeq;
			return index + 1 >= cursorSeq;
		});
		if (endExclusive < 0) endExclusive = messages.length;
	}
	let start = typeof limit === "number" && limit > 0 ? Math.max(0, endExclusive - limit) : 0;
	const pageSeqs = new Set(messages.slice(start, endExclusive).map(readChatHistoryMessageSeq).filter(Boolean));
	const gapSeqs = /* @__PURE__ */ new Set();
	for (let index = start - 1; index >= 0; index--) {
		const seq = readChatHistoryMessageSeq(messages[index]);
		if (seq === void 0) continue;
		gapSeqs.add(seq);
		if (!pageSeqs.has(seq)) continue;
		start = index;
		gapSeqs.forEach((gapSeq) => pageSeqs.add(gapSeq));
		gapSeqs.clear();
	}
	const paginatedMessages = messages.slice(start, endExclusive);
	const firstSeq = readChatHistoryMessageSeq(paginatedMessages[0]);
	return buildPaginatedSessionHistory({
		messages: paginatedMessages,
		hasMore: start > 0,
		...start > 0 && typeof firstSeq === "number" ? { nextCursor: String(firstSeq) } : {}
	});
}
/** Builds the display history snapshot and raw transcript sequence watermark. */
function buildSessionHistorySnapshot(params) {
	const projected = params.projection ?? projectChatDisplayMessagesWithState(params.rawMessages, {
		includeCommentaryFallbacks: true,
		maxChars: params.maxChars ?? 8e3,
		resolveCurrentUserProfileDisplay
	});
	const visibleMessages = projected.messages;
	const rawHistoryMessages = toSessionHistoryMessages(params.rawMessages);
	const history = paginateSessionMessages(visibleMessages, params.limit, params.cursor);
	if (typeof params.totalRawMessages === "number" && params.totalRawMessages > params.rawMessages.length && (!params.cursor || (readChatHistoryMessageSeq(rawHistoryMessages[0]) ?? 0) > 1)) {
		const firstSeq = readChatHistoryMessageSeq(history.messages[0] ?? rawHistoryMessages[0]);
		history.hasMore = true;
		if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
	}
	return {
		history,
		rawTranscriptSeq: params.rawTranscriptSeq ?? readChatHistoryMessageSeq(rawHistoryMessages.at(-1)) ?? rawHistoryMessages.length,
		turnBoundaryPending: projected.turnBoundaryPending,
		streamErrorFallbackPending: projected.streamErrorFallbackPending
	};
}
/** Tracks session-history SSE state and decides when inline appends are still valid. */
var SessionHistorySseState = class SessionHistorySseState {
	static fromRawSnapshot(params) {
		return new SessionHistorySseState(params);
	}
	constructor(params) {
		this.target = params.target;
		this.maxChars = params.maxChars ?? 8e3;
		this.limit = params.limit;
		this.cursor = params.cursor;
		const snapshot = this.buildSnapshot(params);
		this.sentHistory = snapshot.history;
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.streamErrorFallbackPending = snapshot.streamErrorFallbackPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(params.transcriptPath);
	}
	snapshot() {
		return this.sentHistory;
	}
	retainRecentMessages(maxMessages) {
		if (this.sentHistory.messages.length <= maxMessages) return this.snapshot();
		const messages = this.sentHistory.messages.slice(-maxMessages);
		const firstSeq = readChatHistoryMessageSeq(messages[0]);
		this.sentHistory = buildPaginatedSessionHistory({
			messages,
			hasMore: true,
			...firstSeq !== void 0 ? { nextCursor: String(firstSeq) } : {}
		});
		return this.snapshot();
	}
	appendInlineMessage(update) {
		if (this.limit !== void 0 || this.cursor !== void 0) return null;
		const carriedSeq = asPositiveSafeInteger(update.messageSeq);
		if (carriedSeq !== void 0) {
			if (carriedSeq <= this.rawTranscriptSeq) return { shouldRefresh: true };
			this.rawTranscriptSeq = carriedSeq;
		} else this.rawTranscriptSeq += 1;
		const idempotencyKey = readMessageIdempotencyKey(update.message);
		const nextMessage = attachOpenClawTranscriptMeta(update.message, {
			...typeof update.messageId === "string" ? { id: update.messageId } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			seq: this.rawTranscriptSeq
		});
		const hadPendingTurnBoundary = this.turnBoundaryPending;
		const nextProjection = projectChatDisplayMessagesWithState([nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			turnBoundaryPending: hadPendingTurnBoundary,
			streamErrorFallbackPending: this.streamErrorFallbackPending
		});
		this.turnBoundaryPending = nextProjection.turnBoundaryPending;
		this.streamErrorFallbackPending = nextProjection.streamErrorFallbackPending;
		if (nextProjection.streamErrorFallbackRepaired) return { shouldRefresh: true };
		const projectedMessages = projectChatDisplayMessages([...this.sentHistory.messages, nextMessage], {
			includeCommentaryFallbacks: true,
			maxChars: this.maxChars,
			resolveCurrentUserProfileDisplay
		});
		const projectedPrefix = projectedMessages.slice(0, this.sentHistory.messages.length);
		if (projectedMessages.length > this.sentHistory.messages.length && !isDeepStrictEqual(projectedPrefix, this.sentHistory.messages)) {
			this.sentHistory = buildPaginatedSessionHistory({
				messages: projectedMessages,
				hasMore: false
			});
			return { shouldRefresh: true };
		}
		if (projectedMessages.length > this.sentHistory.messages.length) {
			const addedMessages = projectedMessages.slice(this.sentHistory.messages.length);
			if (hadPendingTurnBoundary && !this.turnBoundaryPending) {
				const firstAdded = attachOpenClawTranscriptMeta(addedMessages[0], { turnBoundary: true });
				addedMessages[0] = firstAdded;
				projectedMessages[this.sentHistory.messages.length] = firstAdded;
			}
			if (addedMessages.length > 1) {
				this.sentHistory = buildPaginatedSessionHistory({
					messages: projectedMessages,
					hasMore: false
				});
				return { shouldRefresh: true };
			}
			const projectedMessage = expectDefined(addedMessages[0], "projected inline message");
			const emittedMessage = isMessageToolMirrorMessage(projectedMessage) || readChatHistoryMessageSeq(projectedMessage) === void 0 ? attachOpenClawTranscriptMeta(projectedMessage, { seq: this.rawTranscriptSeq }) : projectedMessage;
			this.sentHistory = buildPaginatedSessionHistory({
				messages: [...this.sentHistory.messages, emittedMessage],
				hasMore: false
			});
			return {
				message: emittedMessage,
				messageSeq: readChatHistoryMessageSeq(emittedMessage)
			};
		}
		if (nextProjection.messages.length === 0 && projectedMessages.length === this.sentHistory.messages.length) return null;
		this.sentHistory = buildPaginatedSessionHistory({
			messages: projectedMessages,
			hasMore: false
		});
		return { shouldRefresh: true };
	}
	shouldRefreshForTranscriptPath(updatePath) {
		const nextPath = normalizeTranscriptPathForComparison(updatePath);
		return Boolean(this.transcriptPath && nextPath && this.transcriptPath !== nextPath);
	}
	async refreshAsync() {
		const rawSnapshot = await readSessionHistoryRawSnapshotAsync({
			target: this.target,
			maxChars: this.maxChars,
			limit: this.limit,
			cursor: this.cursor
		});
		const snapshot = this.buildSnapshot(rawSnapshot);
		this.rawTranscriptSeq = snapshot.rawTranscriptSeq;
		this.turnBoundaryPending = snapshot.turnBoundaryPending;
		this.streamErrorFallbackPending = snapshot.streamErrorFallbackPending;
		this.transcriptPath = normalizeTranscriptPathForComparison(rawSnapshot.transcriptPath);
		this.sentHistory = snapshot.history;
		return snapshot.history;
	}
	buildSnapshot(rawSnapshot) {
		return buildSessionHistorySnapshot({
			projection: rawSnapshot.projection,
			rawMessages: rawSnapshot.rawMessages,
			maxChars: this.maxChars,
			limit: this.limit,
			cursor: this.cursor,
			rawTranscriptSeq: rawSnapshot.rawTranscriptSeq,
			totalRawMessages: rawSnapshot.totalRawMessages
		});
	}
};
function normalizeTranscriptPathForComparison(filePath) {
	return typeof filePath === "string" ? resolveTranscriptPathForComparison(filePath) : void 0;
}
//#endregion
//#region src/gateway/sessions-history-http.ts
const log = createSubsystemLogger("gateway/sessions-history-sse");
const MAX_SESSION_HISTORY_LIMIT = 1e3;
function resolveSessionHistoryPath(req) {
	const match = new URL(req.url ?? "/", "http://localhost").pathname.match(/^\/sessions\/([^/]+)\/history$/);
	if (!match) return { matched: false };
	try {
		const sessionKey = normalizeOptionalString(decodeURIComponent(match[1] ?? ""));
		return sessionKey ? {
			matched: true,
			sessionKey
		} : {
			error: "invalid-session-key",
			matched: true
		};
	} catch {
		return {
			error: "invalid-session-key",
			matched: true
		};
	}
}
function shouldStreamSse(req) {
	return hasExplicitAcceptableMediaRange(getHeader(req, "accept"), SSE_CONTENT_TYPE);
}
function getRequestUrl(req) {
	return new URL(req.url ?? "/", "http://localhost");
}
function resolveLimit(req) {
	const raw = getRequestUrl(req).searchParams.get("limit");
	if (raw == null) return ok(void 0);
	const trimmed = raw.trim();
	const value = parseStrictPositiveInteger(trimmed);
	if (value !== void 0) return ok(Math.min(MAX_SESSION_HISTORY_LIMIT, value));
	if (/^\d+$/.test(trimmed) && /[1-9]/.test(trimmed)) return ok(MAX_SESSION_HISTORY_LIMIT);
	return err("limit must be a positive integer");
}
function sseWrite(res, event, payload) {
	res.write(`event: ${event}\n`);
	res.write(`data: ${JSON.stringify(payload)}\n\n`);
}
function resolveSessionHistoryHttpClient(requestAuth, scopes) {
	if (!requestAuth.authenticatedUserProfile) return null;
	return {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes
		},
		authenticatedUserProfile: requestAuth.authenticatedUserProfile
	};
}
/** Handle `/sessions/:sessionKey/history` JSON/SSE requests. */
async function handleSessionHistoryHttpRequest(req, res, opts) {
	const sessionKeyResolution = resolveSessionHistoryPath(req);
	if (!sessionKeyResolution.matched) return false;
	if ("error" in sessionKeyResolution) {
		sendInvalidRequest(res, "invalid session key");
		return true;
	}
	const { sessionKey } = sessionKeyResolution;
	if (req.method !== "GET") {
		sendMethodNotAllowed(res, "GET");
		return true;
	}
	const authResult = await authorizeScopedGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		operatorMethod: "chat.history",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	});
	if (!authResult) return true;
	const { cfg, requestAuth, operatorScopes } = authResult;
	let target;
	let entry;
	try {
		target = resolveGatewaySessionStoreTargetWithStore({
			cfg,
			key: sessionKey
		});
		entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	} catch (error) {
		if (error?.code !== "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") throw error;
		sendJson(res, 409, {
			ok: false,
			error: {
				type: "migration_required",
				message: error instanceof Error ? error.message : String(error)
			}
		});
		return true;
	}
	const historyClient = resolveSessionHistoryHttpClient(requestAuth, operatorScopes);
	if (!entry?.sessionId || createSessionListEntryFilter({
		cfg,
		client: historyClient
	})?.(target.canonicalKey, entry) === false) {
		sendJson(res, 404, {
			ok: false,
			error: {
				type: "not_found",
				message: `Session not found: ${sessionKey}`
			}
		});
		return true;
	}
	const limitResult = resolveLimit(req);
	if (!limitResult.ok) {
		sendInvalidRequest(res, limitResult.error);
		return true;
	}
	const limit = limitResult.value;
	const cursor = normalizeOptionalString(getRequestUrl(req).searchParams.get("cursor"));
	if (cursor !== void 0 && resolveCursorSeq(cursor) === void 0) {
		sendInvalidRequest(res, "cursor must be a positive integer");
		return true;
	}
	const effectiveMaxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
	const historyTarget = {
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	};
	const snapshotVersion = readSessionTranscriptUpdateVersion();
	let rawSnapshot;
	try {
		rawSnapshot = await readSessionHistoryRawSnapshotAsync({
			cursor,
			target: historyTarget,
			limit,
			maxChars: effectiveMaxChars
		});
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		res.setHeader("Retry-After", "1");
		sendJson(res, 503, {
			ok: false,
			error: {
				type: "unavailable",
				message: "session history is rebuilding; retry shortly",
				retryable: true
			}
		});
		return true;
	}
	const historySnapshot = {
		...rawSnapshot,
		maxChars: effectiveMaxChars,
		limit,
		cursor
	};
	if (!shouldStreamSse(req)) {
		const history = buildSessionHistorySnapshot(historySnapshot).history;
		sendJson(res, 200, {
			sessionKey: target.canonicalKey,
			...history
		});
		return true;
	}
	const transcriptCandidates = new Set(resolveSessionTranscriptCandidates(historyTarget.sessionId, target.storePath, void 0, target.agentId).map((candidate) => resolveTranscriptPathForComparison(candidate)).filter((candidate) => typeof candidate === "string"));
	const sseState = SessionHistorySseState.fromRawSnapshot({
		...historySnapshot,
		target: historyTarget
	});
	let streamStopped = false;
	let streamQueue = Promise.resolve();
	const streamResources = {};
	function writeStreamHistory(snapshot) {
		sseWrite(res, "history", {
			sessionKey: target.canonicalKey,
			...snapshot
		});
		sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
	}
	function releaseStreamResources() {
		if (streamStopped) return;
		streamStopped = true;
		if (streamResources.heartbeat) clearInterval(streamResources.heartbeat);
		if (streamResources.unsubscribe) streamResources.unsubscribe();
	}
	function detachStreamListeners() {
		req.off("close", handleRequestStreamClose);
		req.off("error", handleRequestStreamError);
		res.off("close", handleResponseStreamClose);
		res.off("finish", handleResponseStreamFinish);
		res.off("error", handleResponseStreamError);
	}
	function closeStream() {
		releaseStreamResources();
		if (!res.writableEnded && !res.destroyed) res.end();
	}
	function handleRequestStreamClose() {
		releaseStreamResources();
		req.off("close", handleRequestStreamClose);
		req.off("error", handleRequestStreamError);
	}
	function handleRequestStreamError(error) {
		log.warn("session history SSE request stream errored; closing stream", { error });
		closeStream();
	}
	function handleResponseStreamFinish() {
		releaseStreamResources();
		res.off("finish", handleResponseStreamFinish);
	}
	function handleResponseStreamClose() {
		releaseStreamResources();
		detachStreamListeners();
	}
	function handleResponseStreamError(error) {
		log.warn("session history SSE response stream errored; cleaning up stream", { error });
		releaseStreamResources();
	}
	const isStreamClosed = () => streamStopped || res.writableEnded || res.destroyed;
	req.on("close", handleRequestStreamClose);
	req.on("error", handleRequestStreamError);
	res.on("close", handleResponseStreamClose);
	res.on("finish", handleResponseStreamFinish);
	res.on("error", handleResponseStreamError);
	setSseHeaders(res);
	res.write("retry: 1000\n\n");
	if (isStreamClosed()) return true;
	const queueStreamWork = (work) => {
		streamQueue = streamQueue.then(async () => {
			if (isStreamClosed()) return;
			await work();
		}).catch((error) => {
			log.warn("session history SSE stream work failed; closing stream", { error });
			closeStream();
		});
	};
	queueStreamWork(async () => {
		if (snapshotVersion !== readSessionTranscriptUpdateVersion()) await sseState.refreshAsync();
		if (!isStreamClosed()) writeStreamHistory(sseState.snapshot());
	});
	const isStreamStillAuthorized = async () => {
		const cfgLocal = getRuntimeConfig();
		const currentRequestAuth = await checkGatewayHttpRequestAuth({
			req,
			auth: opts.getResolvedAuth?.() ?? opts.auth,
			trustedProxies: cfgLocal.gateway?.trustedProxies,
			allowRealIpFallback: cfgLocal.gateway?.allowRealIpFallback,
			rateLimiter: opts.rateLimiter,
			cfg: cfgLocal
		});
		if (!currentRequestAuth.ok) return false;
		if (currentRequestAuth.requestAuth.authenticatedUserProfile?.profileId !== requestAuth.authenticatedUserProfile?.profileId) return false;
		const requestedScopes = resolveSharedSecretHttpOperatorScopes(req, currentRequestAuth.requestAuth);
		if (!authorizeOperatorScopesForMethod("chat.history", requestedScopes).allowed) return false;
		const currentClient = resolveSessionHistoryHttpClient(currentRequestAuth.requestAuth, requestedScopes);
		if (!currentClient) return true;
		const currentTarget = resolveSessionSharingTarget({
			cfg: cfgLocal,
			sessionKey: target.canonicalKey,
			agentId: target.agentId
		});
		return currentTarget !== null && createSessionListEntryFilter({
			cfg: cfgLocal,
			client: currentClient
		})?.(currentTarget.canonicalKey, currentTarget.entry) !== false;
	};
	streamResources.heartbeat = setInterval(() => {
		queueStreamWork(async () => {
			if (!await isStreamStillAuthorized()) {
				closeStream();
				return;
			}
			if (!res.writableEnded) res.write(": keepalive\n\n");
		});
	}, 15e3);
	streamResources.unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const updateMatchesIdentity = update.target?.sessionId === historyTarget.sessionId && normalizeAgentId(update.target.agentId) === normalizeAgentId(target.agentId);
		const updatePath = resolveTranscriptPathForComparison(update.sessionFile);
		if (!updateMatchesIdentity && (!updatePath || !transcriptCandidates.has(updatePath))) return;
		queueStreamWork(async () => {
			if (!await isStreamStillAuthorized()) {
				closeStream();
				return;
			}
			if (update.message !== void 0 && limit === void 0 && cursor === void 0) {
				if (sseState.shouldRefreshForTranscriptPath(updatePath)) {
					writeStreamHistory(await sseState.refreshAsync());
					return;
				}
				const nextEvent = sseState.appendInlineMessage({
					message: update.message,
					messageId: update.messageId,
					messageSeq: update.messageSeq
				});
				if (!nextEvent) return;
				if (nextEvent.shouldRefresh) {
					writeStreamHistory(await sseState.refreshAsync());
					return;
				}
				if (nextEvent.message === void 0) return;
				sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
				sseWrite(res, "message", {
					sessionKey: target.canonicalKey,
					message: nextEvent.message,
					...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
					messageSeq: nextEvent.messageSeq
				});
				return;
			}
			writeStreamHistory(await sseState.refreshAsync());
		});
	});
	return true;
}
//#endregion
export { handleSessionHistoryHttpRequest };
