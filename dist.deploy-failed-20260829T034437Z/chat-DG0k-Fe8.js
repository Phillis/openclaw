import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { _ as scopeLegacySessionKeyToAgent } from "./session-key-Dbce_H9p.js";
import { a as measureDiagnosticsTimelineSpan, o as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DhDccUEp.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { G as validateChatMetadataParams, H as validateChatHistoryParams, U as validateChatInjectParams, W as validateChatMessageGetParams, q as validateChatToolTitlesParams } from "./src-4dv5TpeQ.js";
import { x as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { P as isSessionTranscriptProjectionUnavailableError, V as resolveSessionTranscriptActiveLeafEntryId, k as readTranscriptDisplayDelta } from "./session-accessor-B-FKZX9M.js";
import "./sessions-CdrF1uzY.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-DzPMUp4j.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C2lazUOH.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { x as resolveActiveEmbeddedRunOwner, y as resolveActiveEmbeddedRunHandleSessionId } from "./runs-DpT-JSmi.js";
import { A as resolveEffectiveChatHistoryMaxChars, C as projectChatDisplayMessages, D as isHeartbeatHistoryTurnBoundaryMessage, E as dropPreSessionStartAnnouncePairs, O as augmentChatHistoryWithCanvasBlocks, S as projectChatDisplayMessage, b as projectTranscriptEntryMessage, f as toTranscriptReadScope, g as capArrayByJsonBytes, h as ArchivedTranscriptReader, i as readSessionMessageByIdAsync, m as readSessionTranscriptHistoryAnchorPage, o as readSessionMessagesAsync, u as resolveTranscriptReadTarget, x as resolveCurrentUserProfileDisplay, y as projectSessionMessagePayload } from "./session-transcript-readers-CgCxlOAj.js";
import { n as resolveSessionModelRef } from "./session-model-ref-BtF53_Cz.js";
import { t as getSessionDefaults } from "./session-utils-model-jI_nhKzG.js";
import { i as buildGatewaySessionInfo, o as loadGatewaySessionRow } from "./session-utils-list-Bb0Qg6y4.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly, r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { i as runWithCronCreatorAuthorityCapability, r as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-hXifa_42.js";
import { d as resolveInFlightRunSnapshot, o as projectInFlightRunSnapshot, r as boundInFlightRunSnapshotForChatHistory } from "./chat-abort-BpfXA9KF.js";
import { t as logLargePayload } from "./diagnostic-payload-CXKe0KzH.js";
import { a as MAX_PAYLOAD_BYTES, c as getMaxChatHistoryMessagesBytes } from "./server-constants-DKuFNbQH.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import { l as resolveClaudeCliBindingSessionId } from "./cli-session-history.claude--plzwyp1.js";
import { n as resolveChatHistoryWithCliSessionImports, t as readChatHistoryCliSessionImportSnapshot } from "./cli-session-history-CComQ1Ul.js";
import { r as resolveGatewayChatCronCreatorAuthorityAdmission, t as createAgentTurnService } from "./agent-turn-service-E37ppfMh.js";
import { n as buildGatewaySessionSnapshot } from "./session-event-payload-Cf_KowSS.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-C7YJ2XPa.js";
import { N as normalizeOptionalChatText, s as appendAssistantTranscriptMessage } from "./chat-abort-runtime-Du-GXdMW.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { c as resolveRequestedChatAgentId, d as resolveGlobalAwareNodeChatDeliveryKeys, f as sendGlobalAwareNodeChatPayload, l as validateChatSelectedAgent, t as handleChatSend } from "./chat-send-handler-Cc2TmNWV.js";
import { a as prepareSessionWorkspaceIcon } from "./workspace-icon-http-DHF8V4dt.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-0q-ojjmE.js";
import { i as readIncrementalChatHistoryTail, n as dropChatHistoryOverreadContextMessage, r as readChatHistoryMessageSeq, t as capOffsetChatHistoryProjectedMessages } from "./session-history-tail-CWcgcmjb.js";
import { r as startOptionalServerMethodModelCatalogSnapshotLoad, t as loadOptionalServerMethodModelCatalogSnapshot } from "./optional-model-catalog-CLG2tIS6.js";
import { n as readSessionPlacementFields } from "./session-placement-read-projection-DeFKfhJ_.js";
//#region src/gateway/server-methods/chat-history-budget.ts
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 128 * 1024;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
let chatHistoryOmittedEmitCount = 0;
function createChatHistoryByteCounter() {
	const sizes = /* @__PURE__ */ new Map();
	const messageBytes = (message) => {
		const cached = sizes.get(message);
		if (cached !== void 0) return cached;
		const bytes = jsonUtf8Bytes(message);
		sizes.set(message, bytes);
		return bytes;
	};
	return {
		messageBytes,
		messagesBytes: (messages) => 2 + messages.reduce((bytes, message) => bytes + messageBytes(message), 0) + Math.max(0, messages.length - 1)
	};
}
function buildChatHistoryUnavailableSentinel() {
	return {
		role: "assistant",
		timestamp: Date.now(),
		content: [{
			type: "text",
			text: CHAT_HISTORY_UNAVAILABLE_SENTINEL
		}]
	};
}
function buildOversizedHistoryPlaceholder(message) {
	const role = message && typeof message === "object" && typeof message.role === "string" ? message.role : "assistant";
	const timestamp = message && typeof message === "object" && typeof message.timestamp === "number" ? message.timestamp : Date.now();
	const rawMetadata = message && typeof message === "object" ? message["__openclaw"] : void 0;
	const metadata = rawMetadata && typeof rawMetadata === "object" && !Array.isArray(rawMetadata) ? rawMetadata : {};
	const metadataId = typeof metadata.id === "string" ? metadata.id : void 0;
	const metadataSeq = typeof metadata.seq === "number" ? metadata.seq : void 0;
	const metadataIdempotencyKey = typeof metadata.idempotencyKey === "string" ? metadata.idempotencyKey : void 0;
	const turnBoundary = metadata.turnBoundary === true;
	return {
		role,
		timestamp,
		content: [{
			type: "text",
			text: CHAT_HISTORY_OVERSIZED_PLACEHOLDER
		}],
		__openclaw: {
			...metadataId ? { id: metadataId } : {},
			...metadataSeq !== void 0 ? { seq: metadataSeq } : {},
			...metadataIdempotencyKey ? { idempotencyKey: metadataIdempotencyKey } : {},
			...turnBoundary ? { turnBoundary: true } : {},
			truncated: true,
			reason: "oversized"
		}
	};
}
function replaceOversizedChatHistoryMessages(params) {
	const { messages, maxSingleMessageBytes } = params;
	const byteCounter = params.byteCounter ?? createChatHistoryByteCounter();
	if (messages.length === 0) return {
		messages,
		replacedCount: 0
	};
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (byteCounter.messageBytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		const placeholder = buildOversizedHistoryPlaceholder(message);
		return byteCounter.messageBytes(placeholder) <= maxSingleMessageBytes ? placeholder : buildChatHistoryUnavailableSentinel();
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function reportOmittedChatHistory(params) {
	const { originalMessages, finalMessages, getNormalizedBytes, maxHistoryBytes, logDebug } = params;
	const survivors = new Set(finalMessages);
	let omittedCount = 0;
	for (const message of originalMessages) if (!survivors.has(message)) omittedCount += 1;
	if (omittedCount === 0) return 0;
	chatHistoryOmittedEmitCount += omittedCount;
	logLargePayload({
		surface: "gateway.chat.history",
		action: "truncated",
		bytes: getNormalizedBytes(),
		limitBytes: maxHistoryBytes,
		count: omittedCount,
		reason: "chat_history_budget"
	});
	logDebug(`chat.history omitted oversized payloads count=${omittedCount} total=${chatHistoryOmittedEmitCount}`);
	return omittedCount;
}
//#endregion
//#region src/gateway/server-methods/chat-history-delta.ts
const CHAT_HISTORY_DELTA_MAX_EVENTS = 200;
const CHAT_HISTORY_DELTA_MAX_BYTES = 1e6;
function readMessageEvent(event) {
	const record = asOptionalRecord(event);
	if (!record) return;
	if (record.message === void 0) return;
	return {
		message: record.message,
		...typeof record.id === "string" && record.id ? { messageId: record.id } : {}
	};
}
function containsTranscriptDiscontinuity(result) {
	return result.events.some((row) => {
		const event = asOptionalRecord(row.event);
		if (!event) return false;
		const type = event.type;
		return type === "reset" || type === "compaction";
	});
}
function readChatHistoryDelta(params) {
	const result = readTranscriptDisplayDelta(params.scope, {
		cursor: params.cursor,
		maxBytes: CHAT_HISTORY_DELTA_MAX_BYTES,
		maxEvents: CHAT_HISTORY_DELTA_MAX_EVENTS
	});
	if (result.kind !== "page" || result.hasMore || containsTranscriptDiscontinuity(result)) return { kind: "reset" };
	let projectionState = {
		streamErrorFallbackPending: false,
		turnBoundaryPending: false
	};
	const messages = [];
	for (const row of result.events) {
		const event = readMessageEvent(row.event);
		if (!event || row.messageSeq === void 0) continue;
		const projected = projectSessionMessagePayload({
			agentId: params.agentId,
			message: event.message,
			...event.messageId ? { messageId: event.messageId } : {},
			messageSeq: row.messageSeq,
			projectionState,
			sessionKey: params.sessionKey,
			sessionSnapshot: params.sessionSnapshot
		});
		projectionState = projected.projectionState;
		if (projected.payload) messages.push(projected.payload);
	}
	if (Buffer.byteLength(JSON.stringify(messages), "utf8") > CHAT_HISTORY_DELTA_MAX_BYTES) return { kind: "reset" };
	return {
		activeLeafEntryId: result.activeLeafEntryId,
		deltaCursor: result.cursor,
		kind: "delta",
		messages
	};
}
//#endregion
//#region src/gateway/session-transcript-anchor-reader.ts
/** Reads one message-id-anchored page from a single transcript snapshot. */
async function readSessionMessagesAroundIdWithStatsAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const sessionFile = !scope.sessionFile && scope.sessionEntry?.sessionId && scope.sessionEntry.sessionId !== scope.sessionId ? void 0 : target.sessionFile;
	const page = readSessionTranscriptHistoryAnchorPage(toTranscriptReadScope(target), opts);
	if (!page.found) {
		if (opts.allowResetArchiveFallback === true) return await new ArchivedTranscriptReader({
			agentId: target.agentId,
			sessionFile,
			sessionId: target.sessionId,
			storePath: target.storePath
		}).readAroundId({
			...opts,
			resetArchiveOnly: true
		});
		return {
			found: false,
			hasOverreadContext: false,
			messages: [],
			offset: 0,
			totalMessages: page.totalMessages,
			transcriptPath: target.sessionFile
		};
	}
	return {
		found: true,
		hasOverreadContext: page.hasOverreadContext,
		messages: page.events.flatMap((entry) => {
			const message = projectTranscriptEntryMessage(entry.event, entry.seq);
			return message === void 0 ? [] : [message];
		}),
		offset: page.offset,
		totalMessages: page.totalMessages,
		transcriptPath: target.sessionFile
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-pages.ts
function readChatHistoryMessageId(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return typeof metadata?.id === "string" ? metadata.id : void 0;
}
function resolveChatHistoryNextOffset(params) {
	const oldestSeq = params.messages.map((message) => readChatHistoryMessageSeq(message)).find((seq) => typeof seq === "number");
	if (oldestSeq === void 0) return params.offset + params.rawPageMessages;
	const recordOffset = params.totalMessages - oldestSeq + 1;
	const replayOffset = recordOffset - 1;
	if (params.replayOldestRecord && replayOffset > params.offset) return replayOffset;
	return Math.max(params.offset + 1, recordOffset);
}
function shouldReplayOldestChatHistoryRecord(params) {
	const oldestSeq = params.bounded.map((message) => readChatHistoryMessageSeq(message)).find((seq) => typeof seq === "number");
	return oldestSeq !== void 0 && params.bounded.filter((message) => readChatHistoryMessageSeq(message) === oldestSeq).length < params.projected.filter((message) => readChatHistoryMessageSeq(message) === oldestSeq).length;
}
function resolveChatHistoryActiveLeafEntryId(readPage) {
	if (readPage.transcriptSource !== "active") return null;
	if (Object.hasOwn(readPage, "activeLeafEntryId")) return readPage.activeLeafEntryId ?? null;
	return resolveSessionTranscriptActiveLeafEntryId(readPage.transcriptEvents ?? []) ?? null;
}
/** Add checkpoint token metrics to the synthetic transcript compaction marker. */
function enrichChatHistoryCompactionMarkers(messages, entry) {
	const checkpoints = entry?.compactionCheckpoints;
	if (!Array.isArray(checkpoints) || checkpoints.length === 0) return messages;
	const checkpointByEntryId = new Map(checkpoints.flatMap((checkpoint) => {
		const entryId = checkpoint.postCompaction?.entryId;
		return typeof entryId === "string" && entryId ? [[entryId, checkpoint]] : [];
	}));
	let changed = false;
	const enriched = messages.map((message) => {
		const record = asOptionalRecord(message);
		const metadata = asOptionalRecord(record?.["__openclaw"]);
		if (metadata?.kind !== "compaction" || typeof metadata.id !== "string") return message;
		const checkpoint = checkpointByEntryId.get(metadata.id);
		if (!checkpoint) return message;
		const tokensBefore = checkpoint.tokensBefore;
		const tokensAfter = checkpoint.tokensAfter;
		if ((typeof tokensBefore !== "number" || !Number.isFinite(tokensBefore)) && (typeof tokensAfter !== "number" || !Number.isFinite(tokensAfter))) return message;
		changed = true;
		return {
			...record,
			__openclaw: {
				...metadata,
				...typeof tokensBefore === "number" && Number.isFinite(tokensBefore) ? { tokensBefore } : {},
				...typeof tokensAfter === "number" && Number.isFinite(tokensAfter) ? { tokensAfter } : {}
			}
		};
	});
	return changed ? enriched : messages;
}
function resolveChatHistoryMessageGroup(messages, index) {
	const seq = readChatHistoryMessageSeq(messages[index]);
	if (seq === void 0) return {
		start: index,
		end: index + 1
	};
	let start = index;
	let end = index + 1;
	while (start > 0 && readChatHistoryMessageSeq(messages[start - 1]) === seq) start -= 1;
	while (end < messages.length && readChatHistoryMessageSeq(messages[end]) === seq) end += 1;
	return {
		start,
		end
	};
}
function capChatHistoryAroundMessage(params) {
	const anchorIndex = params.messages.findIndex((message) => readChatHistoryMessageId(message) === params.messageId);
	if (anchorIndex === -1) return;
	const anchorGroup = resolveChatHistoryMessageGroup(params.messages, anchorIndex);
	if (!params.fits(params.messages.slice(anchorGroup.start, anchorGroup.end))) return [params.messages[anchorIndex]];
	let { start, end } = anchorGroup;
	let canGrowOlder = start > 0;
	let canGrowNewer = end < params.messages.length;
	while (canGrowOlder || canGrowNewer) {
		if (canGrowOlder) {
			const olderGroup = resolveChatHistoryMessageGroup(params.messages, start - 1);
			if (params.fits(params.messages.slice(olderGroup.start, end))) start = olderGroup.start;
			else canGrowOlder = false;
		}
		canGrowOlder &&= start > 0;
		if (canGrowNewer) {
			const newerGroup = resolveChatHistoryMessageGroup(params.messages, end);
			if (params.fits(params.messages.slice(start, newerGroup.end))) end = newerGroup.end;
			else canGrowNewer = false;
		}
		canGrowNewer &&= end < params.messages.length;
	}
	return params.messages.slice(start, end);
}
async function readChatHistoryPage(params) {
	const { entry, provider, sessionId, storePath, sessionAgentId, canonicalKey, max, maxHistoryBytes, effectiveMaxChars, offset, messageId } = params;
	if (!sessionId || !storePath) {
		if (messageId) return { messages: [] };
		return {
			...(offset ?? 0) === 0 ? { activeLeafEntryId: null } : {},
			messages: [],
			...offset !== void 0 ? { responseOffset: offset } : {},
			pagination: {
				offset: offset ?? 0,
				totalMessages: 0,
				rawPageMessages: 0
			}
		};
	}
	const readScope = {
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: canonicalKey,
		storePath
	};
	const cliSessionId = params.ignoreCliSessionImports ? void 0 : resolveClaudeCliBindingSessionId(entry);
	if ((offset !== void 0 || messageId) && !cliSessionId) {
		let pageOffset = offset ?? 0;
		let hasOverreadContext = false;
		let readPage;
		let incrementalTail;
		if (messageId) {
			const anchoredPage = await readSessionMessagesAroundIdWithStatsAsync(readScope, {
				messageId,
				maxMessages: max,
				allowResetArchiveFallback: true
			});
			if (!anchoredPage.found) return { messages: [] };
			pageOffset = anchoredPage.offset;
			hasOverreadContext = anchoredPage.hasOverreadContext;
			readPage = anchoredPage;
		} else {
			incrementalTail = await readIncrementalChatHistoryTail({
				entry,
				readScope,
				effectiveMaxChars,
				max,
				maxBytes: maxHistoryBytes,
				offset: pageOffset
			});
			readPage = incrementalTail.readPage;
		}
		const isTailPage = !messageId && pageOffset === 0;
		const overreadContextMessage = incrementalTail ? incrementalTail.overreadContextMessage : hasOverreadContext || readPage.messages.length > max ? readPage.messages[0] : void 0;
		const localMessages = incrementalTail ? incrementalTail.rawMessages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const rawPageMessages = incrementalTail ? incrementalTail.rawPageMessages : Math.min(max, Math.max(readPage.messages.length, readPage.totalMessages > pageOffset ? 1 : 0));
		const projected = incrementalTail ? incrementalTail.projected : projectChatDisplayMessages(localMessages, {
			includeCommentaryFallbacks: true,
			maxChars: effectiveMaxChars,
			resolveCurrentUserProfileDisplay,
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const windowed = messageId ? capChatHistoryAroundMessage({
			messages: projected,
			messageId,
			fits: (messages) => messages.length <= max
		}) ?? capOffsetChatHistoryProjectedMessages(projected, max) : projected;
		if (messageId) return { messages: augmentChatHistoryWithCanvasBlocks(windowed) };
		return {
			...isTailPage ? {
				activeLeafEntryId: resolveChatHistoryActiveLeafEntryId(readPage),
				...readPage.transcriptSource === "active" && readPage.deltaCursor ? { deltaCursor: readPage.deltaCursor } : {}
			} : {},
			messages: augmentChatHistoryWithCanvasBlocks(windowed),
			responseOffset: pageOffset,
			pagination: {
				offset: pageOffset,
				totalMessages: readPage.totalMessages,
				rawPageMessages
			}
		};
	}
	const incrementalTail = await readIncrementalChatHistoryTail({
		entry,
		readScope,
		effectiveMaxChars,
		max,
		maxBytes: maxHistoryBytes
	});
	const { readPage } = incrementalTail;
	const activeLeafEntryId = resolveChatHistoryActiveLeafEntryId(readPage);
	const localMessagesWithBoundaryFilter = incrementalTail.rawMessages;
	const importedMessages = params.ignoreCliSessionImports ? [] : await readChatHistoryCliSessionImportSnapshot({
		entry,
		provider,
		localMessages: localMessagesWithBoundaryFilter
	});
	const cliHistory = params.ignoreCliSessionImports ? {
		messages: localMessagesWithBoundaryFilter,
		imported: false
	} : resolveChatHistoryWithCliSessionImports({
		entry,
		provider,
		localMessages: localMessagesWithBoundaryFilter,
		preparedImportedMessages: importedMessages
	});
	if ((offset !== void 0 || messageId) && !cliHistory.imported) return readChatHistoryPage({
		...params,
		ignoreCliSessionImports: true
	});
	if (cliHistory.imported) {
		const completeCliHistory = resolveChatHistoryWithCliSessionImports({
			entry,
			provider,
			localMessages: dropPreSessionStartAnnouncePairs(await readSessionMessagesAsync(readScope, {
				mode: "full",
				reason: "chat.history CLI import merge",
				allowResetArchiveFallback: true
			}), typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0),
			preparedImportedMessages: importedMessages
		});
		if (!completeCliHistory.imported) return readChatHistoryPage({
			...params,
			ignoreCliSessionImports: true
		});
		const mergedMessages = dropPreSessionStartAnnouncePairs(completeCliHistory.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
		return {
			activeLeafEntryId,
			messages: augmentChatHistoryWithCanvasBlocks(projectChatDisplayMessages(mergedMessages, {
				includeCommentaryFallbacks: true,
				maxChars: effectiveMaxChars,
				resolveCurrentUserProfileDisplay
			})),
			completeCliImport: true,
			pagination: {
				offset: 0,
				totalMessages: mergedMessages.length,
				rawPageMessages: mergedMessages.length,
				exhausted: true
			}
		};
	}
	return {
		activeLeafEntryId,
		...readPage.transcriptSource === "active" && readPage.deltaCursor ? { deltaCursor: readPage.deltaCursor } : {},
		messages: augmentChatHistoryWithCanvasBlocks(incrementalTail.projected),
		pagination: {
			offset: 0,
			totalMessages: readPage.totalMessages,
			rawPageMessages: incrementalTail.rawPageMessages
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-handler.ts
function respondChatHistoryUnavailable(method, respond) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session history is rebuilding; retry shortly", {
		details: { method },
		retryable: true,
		retryAfterMs: 250
	}));
}
function resolveEmbeddedAgentRunRecoverySnapshot(params) {
	const sessionId = params.sessionId ?? resolveActiveEmbeddedRunHandleSessionId(params.canonicalSessionKey) ?? resolveActiveEmbeddedRunHandleSessionId(params.requestedSessionKey);
	if (!sessionId) return;
	const owner = resolveActiveEmbeddedRunOwner(sessionId);
	if (!owner) return;
	return projectInFlightRunSnapshot({
		chatRunState: params.chatRunState,
		runId: owner.runId,
		startedAtMs: owner.startedAtMs,
		sessionAbortable: true
	});
}
async function handleChatMetadataRequest({ params, respond, context }) {
	if (!assertValidParams(params, validateChatMetadataParams, "chat.metadata", respond)) return;
	const metadataParams = params;
	const cfg = context.getRuntimeConfig();
	const resolvedAgent = resolveAgentIdOrRespondError({
		rawAgentId: metadataParams.agentId,
		respond,
		cfg,
		normalize: (rawAgentId) => typeof rawAgentId === "string" && rawAgentId.trim() ? normalizeAgentId(rawAgentId) : void 0
	});
	if (!resolvedAgent) return;
	respond(true, await context.readChatMetadata({ agentId: resolvedAgent.agentId }));
}
const CHAT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS = 25;
async function handleChatHistoryRequest({ params, respond, context, method }) {
	if (!assertValidParams(params, validateChatHistoryParams, method, respond)) return;
	const { sessionKey, limit, offset, cursor, messageId, sessionId: requestedSessionId, maxChars } = params;
	if (offset !== void 0 && messageId !== void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "offset and messageId cannot be used together"));
		return;
	}
	if (cursor !== void 0 && (offset !== void 0 || messageId !== void 0)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "cursor cannot be used with offset or messageId"));
		return;
	}
	if (requestedSessionId !== void 0 && messageId === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId requires messageId"));
		return;
	}
	const requestConfig = context.getRuntimeConfig();
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
	const requestedAgent = resolveRequestedChatAgentId({
		cfg: requestConfig,
		requestedSessionKey: sessionKey,
		agentId: agentIdOverride
	});
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const sessionLoadOptions = requestedAgentId ? { agentId: requestedAgentId } : void 0;
	const { cfg, storePath, store, entry, canonicalKey } = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_entry`, () => loadGatewaySessionEntryReadOnly(sessionKey, {
		...sessionLoadOptions,
		includeStoreChildEntries: true
	}), {
		config: requestConfig,
		phase: method
	});
	const selectedAgent = validateChatSelectedAgent({
		cfg,
		requestedSessionKey: sessionKey,
		explicitAgentId: agentIdOverride
	});
	if (!selectedAgent.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
		return;
	}
	const sessionAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: selectedAgent.agentId
	});
	if (requestedSessionId) {
		const transcriptSessionKey = resolveSessionKeyBySessionId({
			agentId: sessionAgentId,
			sessionId: requestedSessionId,
			storePath
		});
		if (!transcriptSessionKey || scopeLegacySessionKeyToAgent({
			sessionKey: transcriptSessionKey,
			agentId: sessionAgentId
		}) !== scopeLegacySessionKeyToAgent({
			sessionKey: canonicalKey,
			agentId: sessionAgentId
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId does not belong to sessionKey"));
			return;
		}
	}
	if (method === "chat.startup") prepareSessionWorkspaceIcon({
		sessionKey,
		agentId: sessionAgentId
	}).catch((error) => {
		context.logGateway.debug(`chat.startup continuing without a workspace icon: ${formatErrorMessage(error)}`);
	});
	const modelCatalogPromise = method === "chat.history" ? (() => {
		const optionalModelCatalogLoad = startOptionalServerMethodModelCatalogSnapshotLoad(context, { agentId: sessionAgentId });
		const load = measureDiagnosticsTimelineSpan(`gateway.${method}.model_catalog`, () => loadOptionalServerMethodModelCatalogSnapshot(context, method, {
			logOnceKey: method,
			startedLoad: optionalModelCatalogLoad,
			timeoutMs: CHAT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS
		}), {
			config: cfg,
			phase: method
		});
		load.catch(() => void 0);
		return load;
	})() : Promise.resolve(void 0);
	const readStartupProjection = () => measureDiagnosticsTimelineSpan(`gateway.${method}.startup_projection`, async () => {
		try {
			return await context.readChatStartupProjection?.({
				agentId: sessionAgentId,
				sessionEntry: entry
			});
		} catch (error) {
			context.logGateway.debug(`chat.startup continuing without prepared startup projection: ${formatErrorMessage(error)}`);
			return;
		}
	}, {
		config: cfg,
		phase: method,
		attributes: { agentId: sessionAgentId }
	});
	const startupProjectionPromise = method === "chat.startup" && entry?.authProfileOverride?.trim() ? readStartupProjection() : void 0;
	const sessionId = requestedSessionId ?? entry?.sessionId;
	const historyEntry = requestedSessionId && requestedSessionId !== entry?.sessionId ? void 0 : entry;
	const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
	const max = Math.min(CHAT_HISTORY_MAX_ENTRIES, typeof limit === "number" ? limit : 200);
	const maxHistoryBytes = getMaxChatHistoryMessagesBytes();
	const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(cfg, maxChars);
	let historyPage;
	try {
		historyPage = cursor ? { messages: [] } : await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
			entry: historyEntry,
			provider: resolvedSessionModel.provider,
			sessionId,
			storePath,
			sessionAgentId,
			canonicalKey,
			max,
			maxHistoryBytes,
			effectiveMaxChars,
			offset,
			messageId
		}), {
			config: cfg,
			phase: method,
			attributes: {
				limit: max,
				hasMessageId: Boolean(messageId),
				hasOffset: offset !== void 0
			}
		});
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		respondChatHistoryUnavailable(method, respond);
		return;
	}
	const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry);
	const perMessageHardCap = Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxHistoryBytes);
	const byteCounter = createChatHistoryByteCounter();
	const replaced = replaceOversizedChatHistoryMessages({
		byteCounter,
		messages: normalized,
		maxSingleMessageBytes: perMessageHardCap
	});
	const capped = messageId ? capChatHistoryAroundMessage({
		messages: replaced.messages,
		messageId,
		fits: (messages) => byteCounter.messagesBytes(messages) <= maxHistoryBytes
	}) ?? capArrayByJsonBytes(replaced.messages, maxHistoryBytes, byteCounter.messageBytes).items : capArrayByJsonBytes(replaced.messages, maxHistoryBytes, byteCounter.messageBytes).items;
	const historyBudgetPreserved = replaced.replacedCount === 0 && capped.length === normalized.length && capped.every((message, index) => message === normalized[index]);
	const pagination = historyPage.pagination;
	const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
		messages: capped,
		totalMessages: pagination.totalMessages,
		offset: pagination.offset,
		rawPageMessages: pagination.rawPageMessages,
		replayOldestRecord: shouldReplayOldestChatHistoryRecord({
			projected: normalized,
			bounded: capped
		})
	});
	const hasMore = pagination !== void 0 && candidateNextOffset !== void 0 ? pagination.exhausted !== true && candidateNextOffset < pagination.totalMessages : void 0;
	const nextOffset = hasMore ? candidateNextOffset : void 0;
	reportOmittedChatHistory({
		originalMessages: normalized,
		finalMessages: capped,
		getNormalizedBytes: () => byteCounter.messagesBytes(normalized),
		maxHistoryBytes,
		logDebug: (message) => context.logGateway.debug(message)
	});
	const modelCatalogSnapshot = await modelCatalogPromise;
	const modelCatalog = modelCatalogSnapshot?.agentId === sessionAgentId ? modelCatalogSnapshot.entries : void 0;
	const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	const startupProjection = method === "chat.startup" ? await (startupProjectionPromise ?? readStartupProjection()) : void 0;
	const startupMetadata = startupProjection?.metadata;
	const sessionModelCatalog = startupProjection?.sessionModelCatalog ?? modelCatalog;
	const defaultModelCatalog = startupProjection?.defaultModelCatalog ?? modelCatalog;
	const sessionInfo = measureDiagnosticsTimelineSpanSync(`gateway.${method}.session_info`, () => buildGatewaySessionInfo({
		cfg,
		storePath,
		store,
		key: canonicalKey,
		entry,
		agentId: selectedAgent.agentId,
		modelCatalog: sessionModelCatalog
	}), {
		config: cfg,
		phase: method,
		attributes: { storeEntries: Object.keys(store).length }
	});
	const activeRunAgentId = selectedAgent.agentId;
	const activeRunState = resolveVisibleActiveSessionRunState({
		context,
		requestedKey: sessionKey,
		canonicalKey,
		sessionId,
		...activeRunAgentId ? { agentId: activeRunAgentId } : {},
		defaultAgentId: compatibilityOwnerAgentId,
		includeTerminalPersistence: true
	});
	sessionInfo.hasActiveRun = activeRunState.active;
	if (activeRunState.runIds !== void 0) sessionInfo.activeRunIds = activeRunState.runIds;
	if (activeRunState.active) sessionInfo.status = activeRunState.status ?? "running";
	Object.assign(sessionInfo, readSessionPlacementFields(context, entry?.sessionId));
	const embeddedRecovery = resolveEmbeddedAgentRunRecoverySnapshot({
		chatRunState: context.chatRunState,
		requestedSessionKey: sessionKey,
		canonicalSessionKey: canonicalKey,
		sessionId
	});
	if (Object.hasOwn(historyPage, "activeLeafEntryId")) sessionInfo.activeLeafEntryId = historyPage.activeLeafEntryId ?? null;
	const defaults = getSessionDefaults(cfg, defaultModelCatalog, { allowPluginNormalization: false });
	const thinkingLevel = sessionInfo.thinkingLevel ?? sessionInfo.thinkingDefault;
	const verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
	sessionInfo.verboseLevel = verboseLevel;
	const inFlightRun = resolveInFlightRunSnapshot({
		chatAbortControllers: context.chatAbortControllers,
		chatRunState: context.chatRunState,
		requestedSessionKey: sessionKey,
		canonicalSessionKey: canonicalKey,
		agentId: activeRunAgentId,
		defaultAgentId: compatibilityOwnerAgentId
	}) ?? embeddedRecovery;
	if (cursor !== void 0) {
		if (!sessionId || !storePath || resolveClaudeCliBindingSessionId(entry)) {
			respond(true, { kind: "reset" });
			return;
		}
		const sessionSnapshot = buildGatewaySessionSnapshot({
			sessionRow: loadGatewaySessionRow(canonicalKey, {
				agentId: sessionAgentId,
				transcriptUsageMaxBytes: 64 * 1024
			}),
			agentId: sessionAgentId,
			includeSession: true,
			activeRunState
		});
		let delta;
		try {
			delta = readChatHistoryDelta({
				agentId: sessionAgentId,
				cursor,
				scope: {
					agentId: sessionAgentId,
					sessionEntry: entry,
					sessionId,
					sessionKey: canonicalKey,
					storePath
				},
				sessionKey: canonicalKey,
				sessionSnapshot
			});
		} catch (error) {
			if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
			respondChatHistoryUnavailable(method, respond);
			return;
		}
		if (delta.kind === "reset") {
			respond(true, delta);
			return;
		}
		sessionInfo.activeLeafEntryId = delta.activeLeafEntryId;
		const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
			snapshot: inFlightRun,
			messages: delta.messages,
			maxBytes: maxHistoryBytes
		});
		respond(true, {
			kind: "delta",
			messages: delta.messages,
			deltaCursor: delta.deltaCursor,
			sessionInfo,
			...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
			...startupMetadata ? { metadata: startupMetadata } : {}
		});
		return;
	}
	const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
		snapshot: inFlightRun,
		messages: capped,
		maxBytes: maxHistoryBytes
	});
	respond(true, {
		sessionKey,
		sessionId,
		messages: capped,
		...historyPage.deltaCursor ? { deltaCursor: historyPage.deltaCursor } : {},
		...historyPage.responseOffset !== void 0 ? { offset: historyPage.responseOffset } : {},
		...hasMore ? { nextOffset } : {},
		...hasMore !== void 0 ? { hasMore } : {},
		...pagination !== void 0 ? { totalMessages: pagination.totalMessages } : {},
		...historyPage.completeCliImport && !hasMore && historyBudgetPreserved ? { completeSnapshot: true } : {},
		defaults,
		sessionInfo,
		thinkingLevel,
		fastMode: entry?.fastMode,
		toolOverrides: entry?.toolOverrides,
		verboseLevel,
		...boundedInFlightRun ? { inFlightRun: boundedInFlightRun } : {},
		...startupMetadata ? { metadata: startupMetadata } : {}
	});
}
const chatHistoryHandlers = {
	"chat.history": async (opts) => {
		await handleChatHistoryRequest({
			...opts,
			method: "chat.history"
		});
	},
	"chat.startup": async (opts) => {
		await handleChatHistoryRequest({
			...opts,
			method: "chat.startup"
		});
	},
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
//#region src/gateway/server-methods/chat-message-get-handler.ts
async function isChatMessageIdVisibleAfterHistoryFilters(params) {
	if (params.sessionStartedAt === void 0) return true;
	const { messages } = await readSessionMessagesAroundIdWithStatsAsync({
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		maxMessages: 1,
		messageId: params.messageId,
		...params.allowResetArchiveFallback === true ? { allowResetArchiveFallback: true } : {}
	});
	return dropPreSessionStartAnnouncePairs(messages, params.sessionStartedAt).some((message) => readChatHistoryMessageId(message) === params.messageId);
}
const chatMessageGetHandlers = { "chat.message.get": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateChatMessageGetParams, "chat.message.get", respond)) return;
	const { sessionKey, messageId, maxChars } = params;
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
	const requestedAgent = resolveRequestedChatAgentId({
		cfg: context.getRuntimeConfig?.(),
		requestedSessionKey: sessionKey,
		agentId: agentIdOverride
	});
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const { cfg, storePath, entry } = loadGatewaySessionEntryReadOnly(sessionKey, requestedAgentId ? { agentId: requestedAgentId } : void 0);
	const selectedAgent = validateChatSelectedAgent({
		cfg,
		requestedSessionKey: sessionKey,
		explicitAgentId: agentIdOverride
	});
	if (!selectedAgent.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
		return;
	}
	const sessionId = entry?.sessionId;
	if (!sessionId) {
		respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		return;
	}
	const sessionAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: selectedAgent.agentId
	});
	const resolved = await readSessionMessageByIdAsync({
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	}, messageId, { allowResetArchiveFallback: true });
	if (!resolved.found) {
		respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		return;
	}
	if (!await isChatMessageIdVisibleAfterHistoryFilters({
		sessionId,
		storePath,
		sessionEntry: entry,
		sessionKey,
		agentId: sessionAgentId,
		messageId,
		sessionStartedAt: typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0,
		allowResetArchiveFallback: true
	})) {
		respond(true, {
			ok: false,
			unavailableReason: "not_found"
		});
		return;
	}
	if (resolved.oversized) {
		respond(true, {
			ok: false,
			unavailableReason: "oversized"
		});
		return;
	}
	const effectiveMaxChars = typeof maxChars === "number" ? maxChars : Math.min(MAX_PAYLOAD_BYTES, 1e6);
	const projectedMessage = resolved.message ? projectChatDisplayMessage(resolved.message, {
		maxChars: effectiveMaxChars,
		resolveCurrentUserProfileDisplay
	}) : void 0;
	const projected = projectedMessage ? augmentChatHistoryWithCanvasBlocks([projectedMessage])[0] : void 0;
	if (!projected) {
		respond(true, {
			ok: false,
			unavailableReason: "not_visible"
		});
		return;
	}
	respond(true, {
		ok: true,
		message: projected
	});
} };
//#endregion
//#region src/gateway/server-methods/chat-send-external-entry.ts
const externalAuthorityAdmission = {
	resolve: (params) => {
		const authority = resolveGatewayChatCronCreatorAuthorityAdmission({
			runId: params.runId,
			resolvedSessionKey: params.sessionKey,
			spawnedBy: params.spawnedBy,
			client: params.client,
			inputProvenance: params.inputProvenance,
			hasExplicitOrigin: params.hasExplicitOrigin,
			hasRestoredCronContinuation: params.hasRestoredCronContinuation,
			isIncognito: params.isIncognitoEntry || isIncognitoSessionKey(params.sessionKey),
			isReconnectResume: params.isReconnectResume,
			isSystemGenerated: params.isSystemGenerated,
			turnKind: params.turnKind,
			isDirectExternalUser: true
		});
		return authority ? createCronCreatorAuthorityCapability(authority.runId, authority.callerOrigin) : void 0;
	},
	run: (capability, run, signal) => runWithCronCreatorAuthorityCapability(capability, run, signal)
};
/** Authenticated external chat entry; internal re-entry must call handleChatSend directly. */
function handleDirectExternalChatSend(options, onAdmissionOwned) {
	return handleChatSend(options, onAdmissionOwned, externalAuthorityAdmission);
}
//#endregion
//#region src/gateway/server-methods/chat.ts
const chatHandlers = {
	...chatHistoryHandlers,
	...chatMessageGetHandlers,
	"chat.toolTitles": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChatToolTitlesParams, "chat.toolTitles", respond)) return;
		const cfg = context.getRuntimeConfig();
		if (cfg.gateway?.controlUi?.toolTitles !== true) {
			respond(true, {
				titles: {},
				disabled: true
			});
			return;
		}
		const agentIdOverride = normalizeOptionalChatText(params.agentId);
		const requestedAgent = resolveRequestedChatAgentId({
			cfg,
			requestedSessionKey: params.sessionKey,
			agentId: agentIdOverride
		});
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const sessionAgentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: cfg,
			agentId: requestedAgent.agentId
		});
		const { cfg: sessionCfg, entry } = loadGatewaySessionEntryReadOnly(params.sessionKey, requestedAgent.agentId ? { agentId: requestedAgent.agentId } : void 0);
		const sessionModel = resolveSessionModelRef(sessionCfg, entry, sessionAgentId);
		const { generateToolCallTitles } = await import("./chat-tool-titles-DWN4GNeP.js");
		respond(true, { titles: await generateToolCallTitles({
			cfg: sessionCfg,
			agentId: sessionAgentId,
			sessionPrimaryProvider: sessionModel.provider,
			sessionAuthProfile: entry?.authProfileOverride?.trim() || void 0,
			items: params.items
		}) });
	},
	"chat.abort": async (options) => {
		await createAgentTurnService(options).abortTurn(options);
	},
	"chat.send": handleDirectExternalChatSend,
	"chat.inject": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateChatInjectParams, "chat.inject", respond)) return;
		const p = params;
		const rawSessionKey = p.sessionKey;
		const agentIdOverride = normalizeOptionalChatText(p.agentId);
		const requestedAgent = resolveRequestedChatAgentId({
			cfg: context.getRuntimeConfig?.(),
			requestedSessionKey: rawSessionKey,
			agentId: agentIdOverride
		});
		if (!requestedAgent.ok) {
			respond(false, void 0, requestedAgent.error);
			return;
		}
		const requestedAgentId = requestedAgent.agentId;
		const sessionLoadOptions = requestedAgentId ? { agentId: requestedAgentId } : void 0;
		const { cfg, storePath, entry, canonicalKey: sessionKey } = loadGatewaySessionEntry(rawSessionKey, sessionLoadOptions);
		const selectedAgent = validateChatSelectedAgent({
			cfg,
			requestedSessionKey: rawSessionKey,
			explicitAgentId: agentIdOverride
		});
		if (!selectedAgent.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
			return;
		}
		const sessionId = entry?.sessionId;
		if (!sessionId || !storePath) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session not found"));
			return;
		}
		const agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: selectedAgent.agentId
		});
		let appended;
		try {
			const admission = await beginSessionWorkAdmission({
				scope: storePath,
				identities: [sessionKey, sessionId],
				assertAllowed: () => {
					const latestEntry = loadGatewaySessionEntry(rawSessionKey, sessionLoadOptions).entry;
					if (!latestEntry) throw new Error(`Session "${sessionKey}" was deleted while starting work. Retry.`);
					if (latestEntry.sessionId !== sessionId) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
					const archivedError = resolveSessionWorkStartError(sessionKey, latestEntry);
					if (archivedError) throw new Error(archivedError);
				}
			});
			try {
				appended = await admission.run(async () => await appendAssistantTranscriptMessage({
					sessionKey,
					message: p.message,
					label: p.label,
					sessionId,
					storePath,
					agentId,
					createIfMissing: true,
					cfg
				}));
			} finally {
				admission.release();
			}
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
			return;
		}
		if (!appended.ok || !appended.messageId || !appended.message) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to write transcript: ${appended.error ?? "unknown error"}`));
			return;
		}
		const message = projectChatDisplayMessage(appended.message, { maxChars: resolveEffectiveChatHistoryMaxChars(cfg) });
		const chatPayload = {
			runId: `inject-${appended.messageId}`,
			sessionKey,
			...agentId ? { agentId } : {},
			seq: 0,
			state: "final",
			message
		};
		context.broadcast("chat", chatPayload, { sessionKeys: resolveGlobalAwareNodeChatDeliveryKeys({
			cfg,
			sessionKey,
			agentId
		}) });
		sendGlobalAwareNodeChatPayload({
			context,
			sessionKey,
			agentId,
			event: "chat",
			payload: chatPayload
		});
		respond(true, {
			ok: true,
			messageId: appended.messageId
		});
	}
};
//#endregion
export { resolveChatHistoryNextOffset as a, replaceOversizedChatHistoryMessages as c, readChatHistoryPage as i, reportOmittedChatHistory as l, handleDirectExternalChatSend as n, shouldReplayOldestChatHistoryRecord as o, enrichChatHistoryCompactionMarkers as r, CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as s, chatHandlers as t };
