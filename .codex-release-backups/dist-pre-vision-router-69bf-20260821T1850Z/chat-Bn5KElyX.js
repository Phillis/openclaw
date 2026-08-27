import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { _ as scopeLegacySessionKeyToAgent } from "./session-key-D8GLfPr_.js";
import { a as measureDiagnosticsTimelineSpan, o as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DXKu_9VY.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-yubNQC1L.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { R as resolveSessionTranscriptActiveLeafEntryId, sn as resolveSessionKeyBySessionId, x as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-CIiPoGwM.js";
import { z as beginSessionWorkAdmission } from "./agent-harness-session-key-BpWapmwX.js";
import { H as validateChatInjectParams, K as validateChatToolTitlesParams, U as validateChatMessageGetParams, V as validateChatHistoryParams, W as validateChatMetadataParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C2lazUOH.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import "./sessions-Bh837xaa.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-4IbI4BFl.js";
import { _ as ArchivedTranscriptReader, c as readSessionMessagesAsync, f as resolveTranscriptReadTarget, g as readSessionTranscriptHistoryAnchorPage, i as readRecentSessionMessagesWithStatsAsync, l as readSessionMessagesPageWithStatsAsync, m as toTranscriptReadScope, o as readSessionMessageByIdAsync, v as capArrayByJsonBytes, x as projectTranscriptEntryMessage } from "./session-transcript-readers-BIeuEaZ3.js";
import { a as resolveSessionModelRef } from "./placement-session-runtime-D3R4yOqT.js";
import { t as getSessionDefaults } from "./session-utils-model-D6D0SFax.js";
import { E as loadGatewaySessionEntryReadOnly, T as loadGatewaySessionEntry, v as resolveCurrentUserProfileDisplay, w as listAgentsForGateway } from "./session-utils-row-xwseApeF.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-D8DcCzQX.js";
import { i as buildGatewaySessionInfo } from "./session-utils-list-Df1cOTkb.js";
import "./session-utils-DvNvk7rk.js";
import { n as createCronCreatorAuthorityCapability, r as runWithCronCreatorAuthorityCapability } from "./cron-creator-authority-context-jKyB9xcY.js";
import { r as boundInFlightRunSnapshotForChatHistory, u as resolveInFlightRunSnapshot } from "./chat-abort-9K8jqLDL.js";
import { t as logLargePayload } from "./diagnostic-payload-BRcHXXpb.js";
import { a as MAX_PAYLOAD_BYTES, c as getMaxChatHistoryMessagesBytes } from "./server-constants-DKuFNbQH.js";
import { t as formatForLog } from "./ws-log-ByzETCsI.js";
import { a as resolveClaudeCliBindingSessionId } from "./cli-session-history.claude-DD2NttVO.js";
import { n as resolveChatHistoryWithCliSessionImports } from "./cli-session-history-CPIke8Au.js";
import { c as augmentChatHistoryWithCanvasBlocks, i as projectRecentChatDisplayMessages, n as projectChatDisplayMessages, o as dropPreSessionStartAnnouncePairs, s as isHeartbeatHistoryTurnBoundaryMessage, t as projectChatDisplayMessage, u as resolveEffectiveChatHistoryMaxChars } from "./chat-display-projection-DP60qxuF.js";
import { r as resolveGatewayChatCronCreatorAuthorityAdmission, t as createAgentTurnService } from "./agent-turn-service-Nm86LVQX.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CaTtpnPN.js";
import { P as normalizeOptionalChatText, s as appendAssistantTranscriptMessage, w as scheduleChatHistoryManagedMediaCleanup } from "./chat-abort-runtime-DsIj0TD9.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { i as validateChatSelectedAgent, o as resolveGlobalAwareNodeChatDeliveryKeys, r as resolveRequestedChatAgentId, s as sendGlobalAwareNodeChatPayload, t as handleChatSend } from "./chat-send-handler-C4OKJjOA.js";
import { a as prepareSessionWorkspaceIcon } from "./workspace-icon-http-Csn81jsg.js";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BhyQ_s7_.js";
import { i as resolveSessionHistoryTailReadOptions } from "./session-history-state-D9EyUcwb.js";
import { r as startOptionalServerMethodModelCatalogSnapshotLoad, t as loadOptionalServerMethodModelCatalogSnapshot } from "./optional-model-catalog-CLG2tIS6.js";
//#region src/gateway/server-methods/chat-history-budget.ts
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 128 * 1024;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
let chatHistoryOmittedEmitCount = 0;
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
	if (messages.length === 0) return {
		messages,
		replacedCount: 0
	};
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (jsonUtf8Bytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		return buildOversizedHistoryPlaceholder(message);
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function enforceChatHistoryFinalBudget(params) {
	const { messages, maxBytes } = params;
	if (messages.length === 0) return { messages };
	if (jsonUtf8Bytes(messages) <= maxBytes) return { messages };
	const last = messages.at(-1);
	if (last && jsonUtf8Bytes([last]) <= maxBytes) return { messages: [last] };
	const placeholder = buildOversizedHistoryPlaceholder(last);
	if (jsonUtf8Bytes([placeholder]) <= maxBytes) return { messages: [placeholder] };
	return { messages: [buildChatHistoryUnavailableSentinel()] };
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
function readChatHistoryMessageSeq(message) {
	return asPositiveSafeInteger(asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.seq);
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
function capOffsetChatHistoryProjectedMessages(messages, max) {
	if (messages.length <= max) return messages;
	const start = Math.max(0, messages.length - max);
	const boundarySeq = readChatHistoryMessageSeq(messages[start]);
	if (boundarySeq === void 0) return messages.slice(start);
	let safeStart = start;
	while (safeStart > 0 && readChatHistoryMessageSeq(messages[safeStart - 1]) === boundarySeq) safeStart--;
	return messages.slice(safeStart);
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
function dropLocalHistoryOverreadContextMessage(messages, contextMessage) {
	if (contextMessage === void 0) return messages;
	const index = messages.indexOf(contextMessage);
	if (index < 0) return messages;
	return [...messages.slice(0, index), ...messages.slice(index + 1)];
}
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES = 8e3;
const SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES = 100;
/** Keeps a first history page displayable by scanning past an all-silent raw tail. */
async function resolveDisplayableChatHistoryTail(params) {
	const unchanged = {
		messages: params.projected,
		rawPageMessages: params.rawPageMessages
	};
	if (params.projected.length > 0 || params.totalMessages <= params.rawPageMessages) return unchanged;
	const sessionStartedAt = typeof params.entry?.sessionStartedAt === "number" ? params.entry.sessionStartedAt : void 0;
	const scanLimit = params.rawPageMessages + SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES;
	let scanned = params.rawPageMessages;
	let scannedBytes = 0;
	let newerRawMessages = params.rawMessages;
	while (scanned < params.totalMessages && scanned < scanLimit) {
		const page = await readSessionMessagesPageWithStatsAsync(params.readScope, {
			offset: scanned,
			maxMessages: 101,
			allowResetArchiveFallback: true
		});
		if (page.messages.length === 0) return unchanged;
		const contextMessage = page.messages.length > SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES ? page.messages[0] : void 0;
		scanned += page.messages.length - (contextMessage === void 0 ? 0 : 1);
		const chunkMessages = dropLocalHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(page.messages, sessionStartedAt), contextMessage);
		const projected = projectRecentChatDisplayMessages([...chunkMessages, ...newerRawMessages], {
			maxChars: params.effectiveMaxChars,
			maxMessages: params.max,
			resolveCurrentUserProfileDisplay,
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(contextMessage)
		});
		if (projected.length > 0) return {
			messages: projected,
			rawPageMessages: scanned
		};
		scannedBytes += Buffer.byteLength(JSON.stringify(page.messages), "utf8");
		if (scannedBytes >= params.maxBytes) return unchanged;
		newerRawMessages = chunkMessages;
	}
	return unchanged;
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
		const rawHistoryWindow = resolveSessionHistoryTailReadOptions(max);
		let pageOffset = offset ?? 0;
		let hasOverreadContext = false;
		let readPage;
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
		} else if (pageOffset === 0) readPage = await readRecentSessionMessagesWithStatsAsync(readScope, {
			maxMessages: rawHistoryWindow.maxMessages + 1,
			maxLines: rawHistoryWindow.maxLines + 1,
			maxBytes: Math.max(maxHistoryBytes * 2, 1024 * 1024),
			allowResetArchiveFallback: true
		});
		else readPage = await readSessionMessagesPageWithStatsAsync(readScope, {
			offset: pageOffset,
			maxMessages: max + 1,
			allowResetArchiveFallback: true
		});
		const isTailPage = !messageId && pageOffset === 0;
		const overreadContextMessage = isTailPage ? readPage.messages.length > rawHistoryWindow.maxMessages ? readPage.messages[0] : void 0 : hasOverreadContext || readPage.messages.length > max ? readPage.messages[0] : void 0;
		const localMessages = dropLocalHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const rawPageMessages = isTailPage ? Math.min(rawHistoryWindow.maxMessages, Math.max(readPage.messages.length, readPage.totalMessages > 0 ? 1 : 0)) : Math.min(max, Math.max(readPage.messages.length, readPage.totalMessages > pageOffset ? 1 : 0));
		const recencyFilteredMessages = dropPreSessionStartAnnouncePairs(localMessages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
		const projected = isTailPage ? projectRecentChatDisplayMessages(recencyFilteredMessages, {
			maxChars: effectiveMaxChars,
			maxMessages: max,
			resolveCurrentUserProfileDisplay,
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		}) : projectChatDisplayMessages(recencyFilteredMessages, {
			maxChars: effectiveMaxChars,
			resolveCurrentUserProfileDisplay,
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const windowed = messageId ? capChatHistoryAroundMessage({
			messages: projected,
			messageId,
			fits: (messages) => messages.length <= max
		}) ?? capOffsetChatHistoryProjectedMessages(projected, max) : isTailPage ? projected : capOffsetChatHistoryProjectedMessages(projected, max);
		if (messageId) return { messages: augmentChatHistoryWithCanvasBlocks(windowed) };
		const tail = isTailPage ? await resolveDisplayableChatHistoryTail({
			entry,
			readScope,
			effectiveMaxChars,
			max,
			maxBytes: maxHistoryBytes,
			projected: windowed,
			rawMessages: recencyFilteredMessages,
			rawPageMessages,
			totalMessages: readPage.totalMessages
		}) : {
			messages: windowed,
			rawPageMessages
		};
		return {
			...isTailPage ? { activeLeafEntryId: resolveChatHistoryActiveLeafEntryId(readPage) } : {},
			messages: augmentChatHistoryWithCanvasBlocks(tail.messages),
			responseOffset: pageOffset,
			pagination: {
				offset: pageOffset,
				totalMessages: readPage.totalMessages,
				rawPageMessages: tail.rawPageMessages
			}
		};
	}
	const rawHistoryWindow = resolveSessionHistoryTailReadOptions(max);
	const readPage = await readRecentSessionMessagesWithStatsAsync(readScope, {
		maxMessages: rawHistoryWindow.maxMessages + 1,
		maxLines: rawHistoryWindow.maxLines + 1,
		maxBytes: Math.max(maxHistoryBytes * 2, 1024 * 1024),
		allowResetArchiveFallback: true
	});
	const overreadContextMessage = readPage.messages.length > rawHistoryWindow.maxMessages ? readPage.messages[0] : void 0;
	const turnBoundaryPending = isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage);
	const activeLeafEntryId = resolveChatHistoryActiveLeafEntryId(readPage);
	const localMessagesWithBoundaryFilter = dropLocalHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
	const cliHistory = params.ignoreCliSessionImports ? {
		messages: localMessagesWithBoundaryFilter,
		imported: false
	} : resolveChatHistoryWithCliSessionImports({
		entry,
		provider,
		localMessages: localMessagesWithBoundaryFilter
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
			}), typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0)
		});
		if (!completeCliHistory.imported) return readChatHistoryPage({
			...params,
			ignoreCliSessionImports: true
		});
		const mergedMessages = dropPreSessionStartAnnouncePairs(completeCliHistory.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
		return {
			activeLeafEntryId,
			messages: augmentChatHistoryWithCanvasBlocks(projectChatDisplayMessages(mergedMessages, {
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
	const rawMessages = cliHistory.messages;
	const recencyFilteredMessages = dropPreSessionStartAnnouncePairs(rawMessages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0);
	const tail = await resolveDisplayableChatHistoryTail({
		entry,
		readScope,
		effectiveMaxChars,
		max,
		maxBytes: maxHistoryBytes,
		projected: projectRecentChatDisplayMessages(recencyFilteredMessages, {
			maxChars: effectiveMaxChars,
			maxMessages: max,
			resolveCurrentUserProfileDisplay,
			turnBoundaryPending
		}),
		rawMessages: recencyFilteredMessages,
		rawPageMessages: Math.min(rawHistoryWindow.maxMessages, Math.max(readPage.messages.length, readPage.totalMessages > 0 ? 1 : 0)),
		totalMessages: readPage.totalMessages
	});
	return {
		activeLeafEntryId,
		messages: augmentChatHistoryWithCanvasBlocks(tail.messages),
		pagination: {
			offset: 0,
			totalMessages: readPage.totalMessages,
			rawPageMessages: tail.rawPageMessages
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-handler.ts
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
function resolveChatHistoryNextOffset(params) {
	const oldestSeq = params.messages.map((message) => readChatHistoryMessageSeq(message)).find((seq) => typeof seq === "number");
	if (oldestSeq !== void 0) {
		const recordOffset = params.totalMessages - oldestSeq + 1;
		const replayOffset = recordOffset - 1;
		if (params.replayOldestRecord && replayOffset > params.offset) return replayOffset;
		return Math.max(params.offset + 1, recordOffset);
	}
	return params.offset + params.rawPageMessages;
}
function shouldReplayOldestChatHistoryRecord(params) {
	const oldestSeq = params.bounded.map((message) => readChatHistoryMessageSeq(message)).find((seq) => typeof seq === "number");
	if (oldestSeq === void 0) return false;
	const projectedCount = params.projected.filter((message) => readChatHistoryMessageSeq(message) === oldestSeq).length;
	return params.bounded.filter((message) => readChatHistoryMessageSeq(message) === oldestSeq).length < projectedCount;
}
async function handleChatHistoryRequest({ params, respond, context, client, method, includeAgentsList, includeMetadata }) {
	if (!assertValidParams(params, validateChatHistoryParams, method, respond)) return;
	const { sessionKey, limit, offset, messageId, sessionId: requestedSessionId, maxChars } = params;
	if (offset !== void 0 && messageId !== void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "offset and messageId cannot be used together"));
		return;
	}
	if (requestedSessionId !== void 0 && messageId === void 0) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessionId requires messageId"));
		return;
	}
	const requestConfig = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedChatAgentId({
		cfg: requestConfig,
		requestedSessionKey: sessionKey,
		agentId: normalizeOptionalChatText(params.agentId)
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
		agentId: requestedAgentId
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
	const workspaceIconPreparation = method === "chat.startup" ? prepareSessionWorkspaceIcon({
		sessionKey,
		agentId: sessionAgentId
	}).catch((error) => {
		context.logGateway.debug(`chat.startup continuing without a workspace icon: ${formatErrorMessage(error)}`);
	}) : Promise.resolve();
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
	const sessionId = requestedSessionId ?? entry?.sessionId;
	const historyEntry = requestedSessionId && requestedSessionId !== entry?.sessionId ? void 0 : entry;
	const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
	const max = Math.min(CHAT_HISTORY_MAX_ENTRIES, typeof limit === "number" ? limit : 200);
	const maxHistoryBytes = getMaxChatHistoryMessagesBytes();
	const effectiveMaxChars = resolveEffectiveChatHistoryMaxChars(cfg, maxChars);
	let historyPage;
	try {
		historyPage = await measureDiagnosticsTimelineSpan(`gateway.${method}.history_page`, () => readChatHistoryPage({
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
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session history is rebuilding; retry shortly", {
			details: { method },
			retryable: true,
			retryAfterMs: 250
		}));
		return;
	}
	const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry);
	const replaced = replaceOversizedChatHistoryMessages({
		messages: normalized,
		maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxHistoryBytes)
	});
	scheduleChatHistoryManagedMediaCleanup({
		sessionKey,
		...selectedAgent.agentId ? { agentId: selectedAgent.agentId } : {},
		cfg,
		context
	});
	const capped = messageId ? capChatHistoryAroundMessage({
		messages: replaced.messages,
		messageId,
		fits: (messages) => jsonUtf8Bytes(messages) <= maxHistoryBytes
	}) ?? capArrayByJsonBytes(replaced.messages, maxHistoryBytes).items : capArrayByJsonBytes(replaced.messages, maxHistoryBytes).items;
	const bounded = enforceChatHistoryFinalBudget({
		messages: capped,
		maxBytes: maxHistoryBytes
	});
	const historyBudgetPreserved = replaced.replacedCount === 0 && capped.length === normalized.length && bounded.messages.length === capped.length && bounded.messages.every((message, index) => message === capped[index]);
	const pagination = historyPage.pagination;
	const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
		messages: bounded.messages,
		totalMessages: pagination.totalMessages,
		offset: pagination.offset,
		rawPageMessages: pagination.rawPageMessages,
		replayOldestRecord: shouldReplayOldestChatHistoryRecord({
			projected: normalized,
			bounded: bounded.messages
		})
	});
	const hasMore = pagination !== void 0 && candidateNextOffset !== void 0 ? pagination.exhausted !== true && candidateNextOffset < pagination.totalMessages : void 0;
	const nextOffset = hasMore ? candidateNextOffset : void 0;
	reportOmittedChatHistory({
		originalMessages: normalized,
		finalMessages: bounded.messages,
		getNormalizedBytes: () => jsonUtf8Bytes(normalized),
		maxHistoryBytes,
		logDebug: (message) => context.logGateway.debug(message)
	});
	const modelCatalogSnapshot = await modelCatalogPromise;
	const modelCatalog = modelCatalogSnapshot?.agentId === sessionAgentId ? modelCatalogSnapshot.entries : void 0;
	const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	let startupProjection;
	let startupMetadata;
	let startupAgentsList;
	if (method === "chat.startup") {
		const includeSystem = hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.AGENT_KIND);
		const startupProjections = await measureDiagnosticsTimelineSpan(`gateway.${method}.startup_projections`, async () => {
			const projection = context.readChatStartupProjection ? await context.readChatStartupProjection({
				agentId: sessionAgentId,
				sessionEntry: entry,
				includeSystem
			}).catch((error) => {
				context.logGateway.debug(`chat.startup continuing without prepared startup projection: ${formatErrorMessage(error)}`);
			}) : void 0;
			const metadata = includeMetadata ? projection?.metadata ?? await context.readChatMetadata({
				agentId: sessionAgentId,
				sessionEntry: entry
			}).catch((error) => {
				context.logGateway.debug(`chat.startup continuing without metadata: ${formatErrorMessage(error)}`);
			}) : void 0;
			return {
				agentsList: includeAgentsList ? projection?.agentsList ?? listAgentsForGateway(cfg, modelCatalog, { includeSystem }) : void 0,
				projection,
				metadata
			};
		}, {
			config: cfg,
			phase: method,
			attributes: {
				agentId: sessionAgentId,
				includeSystem
			}
		});
		startupProjection = startupProjections.projection;
		startupMetadata = startupProjections.metadata;
		startupAgentsList = startupProjections.agentsList;
	}
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
		sessionId: entry?.sessionId,
		...activeRunAgentId ? { agentId: activeRunAgentId } : {},
		defaultAgentId: compatibilityOwnerAgentId
	});
	sessionInfo.hasActiveRun = activeRunState.active;
	sessionInfo.activeRunIds = activeRunState.runIds;
	if (Object.hasOwn(historyPage, "activeLeafEntryId")) sessionInfo.activeLeafEntryId = historyPage.activeLeafEntryId ?? null;
	const defaults = getSessionDefaults(cfg, defaultModelCatalog, { allowPluginNormalization: false });
	const thinkingLevel = sessionInfo.thinkingLevel ?? sessionInfo.thinkingDefault;
	const verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
	sessionInfo.verboseLevel = verboseLevel;
	const boundedInFlightRun = boundInFlightRunSnapshotForChatHistory({
		snapshot: resolveInFlightRunSnapshot({
			chatAbortControllers: context.chatAbortControllers,
			chatRunState: context.chatRunState,
			requestedSessionKey: sessionKey,
			canonicalSessionKey: canonicalKey,
			agentId: activeRunAgentId,
			defaultAgentId: compatibilityOwnerAgentId
		}),
		messages: bounded.messages,
		maxBytes: maxHistoryBytes
	});
	const payload = {
		sessionKey,
		sessionId,
		messages: bounded.messages,
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
		...includeAgentsList && startupAgentsList ? { agentsList: startupAgentsList } : {},
		...startupMetadata ? { metadata: startupMetadata } : {}
	};
	await workspaceIconPreparation;
	respond(true, payload);
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
			method: "chat.startup",
			includeAgentsList: true,
			includeMetadata: true
		});
	},
	"chat.metadata": handleChatMetadataRequest
};
//#endregion
//#region src/gateway/server-methods/chat-message-get-handler.ts
async function isChatMessageIdVisibleAfterHistoryFilters(params) {
	if (params.sessionStartedAt === void 0) return true;
	return dropPreSessionStartAnnouncePairs(await readSessionMessagesAsync({
		agentId: params.agentId,
		sessionEntry: params.sessionEntry,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		mode: "full",
		reason: "chat.message.get visibility",
		...params.allowResetArchiveFallback === true ? { allowResetArchiveFallback: true } : {}
	}), params.sessionStartedAt).some((message) => readChatHistoryMessageId(message) === params.messageId);
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
		agentId: requestedAgentId
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
		return authority ? createCronCreatorAuthorityCapability(authority.runId) : void 0;
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
		const requestedAgentId = requestedAgent.agentId;
		const selectedAgent = validateChatSelectedAgent({
			cfg,
			requestedSessionKey: params.sessionKey,
			agentId: requestedAgentId
		});
		if (!selectedAgent.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectedAgent.error));
			return;
		}
		const sessionAgentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: cfg,
			agentId: selectedAgent.agentId
		});
		const { cfg: sessionCfg, entry } = loadGatewaySessionEntryReadOnly(params.sessionKey, selectedAgent.agentId ? { agentId: selectedAgent.agentId } : void 0);
		const sessionModel = resolveSessionModelRef(sessionCfg, entry, sessionAgentId);
		const { generateToolCallTitles } = await import("./chat-tool-titles-CT9JBNjt.js");
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
		const requestedAgent = resolveRequestedChatAgentId({
			cfg: context.getRuntimeConfig?.(),
			requestedSessionKey: rawSessionKey,
			agentId: p.agentId
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
			agentId: requestedAgentId
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
export { CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as a, reportOmittedChatHistory as c, readChatHistoryPage as i, handleDirectExternalChatSend as n, enforceChatHistoryFinalBudget as o, enrichChatHistoryCompactionMarkers as r, replaceOversizedChatHistoryMessages as s, chatHandlers as t };
