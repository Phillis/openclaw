import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-CEKLLcTa.js";
import { x as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-CIiPoGwM.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
import { i as readRecentSessionMessagesWithStatsAsync, u as readSessionMessagesWithSourceAsync } from "./session-transcript-readers-BIeuEaZ3.js";
import { a as resolveSessionTranscriptCandidates } from "./session-transcript-files.fs-oqmavapF.js";
import { N as resolveGatewaySessionStoreTargetWithStore, k as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-row-xwseApeF.js";
import "./session-utils-DvNvk7rk.js";
import { a as authorizeScopedGatewayHttpRequestOrReply, h as resolveSharedSecretHttpOperatorScopes, l as getHeader, s as checkGatewayHttpRequestAuth } from "./http-auth-utils-DYzr92Xa.js";
import { c as sendMethodNotAllowed, o as sendInvalidRequest, p as setSseHeaders, s as sendJson, t as SSE_CONTENT_TYPE } from "./http-common-Bn4bbTny.js";
import "./http-utils-pQ8XLsuu.js";
import { l as DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS } from "./chat-display-projection-DP60qxuF.js";
import { a as resolveTranscriptPathForComparison, i as resolveSessionHistoryTailReadOptions, n as buildSessionHistorySnapshot, r as resolveCursorSeq, t as SessionHistorySseState } from "./session-history-state-D9EyUcwb.js";
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
	const { cfg } = authResult;
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
	if (!entry?.sessionId) {
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
	let boundedSnapshot;
	let fullSnapshot;
	try {
		boundedSnapshot = cursor === void 0 && typeof limit === "number" ? await readRecentSessionMessagesWithStatsAsync({
			agentId: target.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, {
			...resolveSessionHistoryTailReadOptions(limit),
			allowResetArchiveFallback: true
		}) : void 0;
		fullSnapshot = boundedSnapshot === void 0 && entry?.sessionId ? await readSessionMessagesWithSourceAsync({
			agentId: target.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		}, {
			mode: "full",
			reason: "session history cursor pagination",
			allowResetArchiveFallback: true
		}) : void 0;
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
	const rawSnapshot = boundedSnapshot?.messages ?? fullSnapshot?.messages ?? [];
	if (!shouldStreamSse(req)) {
		const history = buildSessionHistorySnapshot({
			rawMessages: rawSnapshot,
			maxChars: effectiveMaxChars,
			limit,
			cursor,
			rawTranscriptSeq: boundedSnapshot?.totalMessages,
			totalRawMessages: boundedSnapshot?.totalMessages
		}).history;
		sendJson(res, 200, {
			sessionKey: target.canonicalKey,
			...history
		});
		return true;
	}
	const transcriptCandidates = entry?.sessionId ? new Set(resolveSessionTranscriptCandidates(entry.sessionId, target.storePath, void 0, target.agentId).map((candidate) => resolveTranscriptPathForComparison(candidate)).filter((candidate) => typeof candidate === "string")) : /* @__PURE__ */ new Set();
	const sseState = SessionHistorySseState.fromRawSnapshot({
		target: {
			agentId: target.agentId,
			sessionEntry: entry,
			sessionId: entry.sessionId,
			sessionKey: target.canonicalKey,
			storePath: target.storePath
		},
		rawMessages: rawSnapshot,
		rawTranscriptSeq: boundedSnapshot?.totalMessages,
		totalRawMessages: boundedSnapshot?.totalMessages,
		transcriptPath: boundedSnapshot?.transcriptPath ?? fullSnapshot?.transcriptPath,
		maxChars: effectiveMaxChars,
		limit,
		cursor
	});
	let sentHistory = sseState.snapshot();
	let streamStopped = false;
	let streamQueue = Promise.resolve();
	const streamResources = {};
	function writeStreamHistory(snapshot) {
		sseWrite(res, "history", {
			sessionKey: target.canonicalKey,
			...snapshot
		});
		sentHistory = sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
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
	writeStreamHistory(sentHistory);
	if (isStreamClosed()) return true;
	const queueStreamWork = (work) => {
		streamQueue = streamQueue.then(async () => {
			if (streamStopped || res.writableEnded) return;
			await work();
		}).catch((error) => {
			log.warn("session history SSE stream work failed; closing stream", { error });
			closeStream();
		});
	};
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
		return authorizeOperatorScopesForMethod("chat.history", resolveSharedSecretHttpOperatorScopes(req, currentRequestAuth.requestAuth)).allowed;
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
		if (!entry?.sessionId) return;
		const updateMatchesIdentity = update.target?.sessionId === entry.sessionId && normalizeAgentId(update.target.agentId) === normalizeAgentId(target.agentId);
		const updatePath = resolveTranscriptPathForComparison(update.sessionFile);
		if (!updateMatchesIdentity && (!updatePath || !transcriptCandidates.has(updatePath))) return;
		queueStreamWork(async () => {
			if (res.writableEnded) return;
			if (!await isStreamStillAuthorized()) {
				closeStream();
				return;
			}
			if (update.message !== void 0) {
				if (limit === void 0 && cursor === void 0) {
					if (sseState.shouldRefreshForTranscriptPath(updatePath)) {
						sentHistory = await sseState.refreshAsync();
						writeStreamHistory(sentHistory);
						return;
					}
					const nextEvent = sseState.appendInlineMessage({
						message: update.message,
						messageId: update.messageId,
						messageSeq: update.messageSeq
					});
					if (!nextEvent) return;
					if (nextEvent.shouldRefresh) {
						sentHistory = await sseState.refreshAsync();
						writeStreamHistory(sentHistory);
						return;
					}
					if (nextEvent.message === void 0) return;
					sentHistory = sseState.retainRecentMessages(MAX_SESSION_HISTORY_LIMIT);
					sseWrite(res, "message", {
						sessionKey: target.canonicalKey,
						message: nextEvent.message,
						...typeof update.messageId === "string" ? { messageId: update.messageId } : {},
						messageSeq: nextEvent.messageSeq
					});
					return;
				}
			}
			sentHistory = await sseState.refreshAsync();
			writeStreamHistory(sentHistory);
		});
	});
	return true;
}
//#endregion
export { handleSessionHistoryHttpRequest };
