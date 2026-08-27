import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { n as estimateStringChars, r as estimateTokensFromChars } from "./cjk-chars-B-gnWt4x.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { M as resolveNonNegativeIntegerOption, d as asPositiveSafeInteger, j as resolveIntegerOption, l as asNonNegativeFiniteNumber, s as asFiniteNumber, u as asPositiveFiniteNumber, v as parseDateFirstTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { g as materializeSessionArchiveForRead } from "./artifacts-FzMa6c2e.js";
import { t as readFileWindowFully } from "./file-read-DtMn74uz.js";
import { An as executeSqliteQuerySync, ct as stripUserEnvelopeForDisplay, ht as stripEnvelope, jn as executeSqliteQueryTakeFirstSync, lt as extractInboundSenderLabel, st as stripInternalMetadataForDisplay } from "./openclaw-state-db-CeAO_dqo.js";
import "./internal-runtime-context-E3ku7Huk.js";
import { E as selectSessionTranscriptActiveEntries } from "./session-transcript-index-DtVCy6vi.js";
import { C as resolveSessionTranscriptReadTarget, M as withCurrentProjectionSnapshot, O as createTranscriptRawDeltaCursor, P as isSessionTranscriptProjectionUnavailableError, _ as resolveVisibleMessagePositions, a as readRecentSessionTranscriptMessageEvents, d as readSessionTranscriptMessageEvents, g as resolveVisibleMessagePositionRange, h as readVisibleMessageRange, j as getActiveTranscriptKysely, m as readTranscriptProjectionGeneration, p as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, x as resolveConcreteSessionStorePath } from "./session-accessor-B-FKZX9M.js";
import { a as parseAssistantTextSignature, s as resolveAssistantMessagePhase, t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { R as isOpenClawDeliveryMirrorAssistantMessage } from "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { n as estimateBase64DecodedBytes } from "./base64-Vw7DZYSc.js";
import { c as isMeaningfulMediaFact, f as readPersistedMediaFacts } from "./media-facts-Bd6apMSF.js";
import { a as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-L6FHgw7r.js";
import { i as hasNonzeroUsage, o as normalizeUsage, r as deriveSessionTotalTokens } from "./usage-DNKCVmJi.js";
import { t as streamSessionTranscriptLines } from "./transcript-stream-Dmc7cIIB.js";
import { a as isContextOverflowError } from "./classify-DkuNrlYG.js";
import { t as STREAM_ERROR_FALLBACK_TEXT } from "./stream-message-shared-Cyrn1UHN.js";
import { a as parseInboundMediaUri, n as buildInboundMediaUriFromPath } from "./media-reference-Q4z-WfN-.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { n as HEARTBEAT_PROMPT } from "./heartbeat-yX5WzsUn.js";
import { f as stripInterSessionPromptPrefixForDisplay, t as INTER_SESSION_PROMPT_PREFIX_BASE, u as normalizeInputProvenance } from "./input-provenance-CCQsDhUy.js";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-l25UpcLD.js";
import { t as flattenMarkdownToPlainText } from "./markdown-plain-text-BIBtRgN0.js";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken } from "./control-reply-text-DcrqVZr7.js";
import { a as resolveSessionTranscriptCandidates, o as resolveSessionTranscriptResetArchiveCandidatesAsync } from "./session-transcript-files.fs-BR7phvyf.js";
import { a as projectWorkspaceResultConflict } from "./workspace-conflicts-BySrOYlf.js";
import { i as getUserProfileDisplay } from "./user-profiles-DGHdUlAe.js";
import { s as buildControlUiUserAvatarPath } from "./control-ui-contract-CgrOMhfo.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { sql } from "kysely";
import readline from "node:readline";
//#region src/gateway/chat-sanitize.ts
function extractMessageSenderLabel(entry) {
	if (typeof entry.senderLabel === "string" && entry.senderLabel.trim()) return entry.senderLabel.trim();
	if (typeof entry.content === "string") return extractInboundSenderLabel(entry.content);
	if (Array.isArray(entry.content)) for (const item of entry.content) {
		if (!item || typeof item !== "object") continue;
		const text = item.text;
		if (typeof text !== "string") continue;
		const senderLabel = extractInboundSenderLabel(text);
		if (senderLabel) return senderLabel;
	}
	if (typeof entry.text === "string") return extractInboundSenderLabel(entry.text);
	return null;
}
function stripEnvelopeFromContentWithRole(content, role) {
	const stripUserEnvelope = role === "user";
	let changed = false;
	return {
		content: content.map((item) => {
			if (!item || typeof item !== "object") return item;
			const entry = item;
			if (!(entry.type === "text" || role === "user" && entry.type === "input_text" || role === "assistant" && (entry.type === "input_text" || entry.type === "output_text")) || typeof entry.text !== "string") return item;
			const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
			if (stripped === entry.text) return item;
			changed = true;
			return {
				...entry,
				text: stripped
			};
		}),
		changed
	};
}
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
function stripEnvelopeFromMessage(message) {
	if (!message || typeof message !== "object") return message;
	const entry = message;
	const role = typeof entry.role === "string" ? normalizeLowercaseStringOrEmpty(entry.role) : "";
	const stripUserEnvelope = role === "user";
	let changed = false;
	const next = { ...entry };
	const senderLabel = stripUserEnvelope ? extractMessageSenderLabel(entry) : null;
	if (senderLabel && entry.senderLabel !== senderLabel) {
		next.senderLabel = senderLabel;
		changed = true;
	}
	if (typeof entry.content === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.content) : stripInternalMetadataForDisplay(entry.content);
		if (stripped !== entry.content) {
			next.content = stripped;
			changed = true;
		}
	} else if (Array.isArray(entry.content)) {
		const updated = stripEnvelopeFromContentWithRole(entry.content, role);
		if (updated.changed) {
			next.content = updated.content;
			changed = true;
		}
	} else if (typeof entry.text === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
		if (stripped !== entry.text) {
			next.text = stripped;
			changed = true;
		}
	}
	return changed ? next : message;
}
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
function stripEnvelopeFromMessages(messages) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = messages.map((message) => {
		const stripped = stripEnvelopeFromMessage(message);
		if (stripped !== message) changed = true;
		return stripped;
	});
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/session-display-projection.ts
const SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS = 240;
const SESSION_DISPLAY_PROJECTION_MAX_CHARS = 800;
function extractUserText(message) {
	if (typeof message.content === "string") return message.content;
	if (Array.isArray(message.content)) {
		const parts = message.content.flatMap((block) => {
			const entry = asOptionalRecord(block);
			if (!entry) return [];
			return (entry.type === "text" || entry.type === "input_text") && typeof entry.text === "string" ? [entry.text] : [];
		});
		if (parts.length > 0) return parts.join("\n");
	}
	return typeof message.text === "string" ? message.text : void 0;
}
/** Projects one transcript row onto visible text within the shared display budget. */
function projectSessionDisplayMessage(message, options = {}) {
	const entry = asOptionalRecord(message);
	if (!entry) return null;
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	if (role !== "user" && role !== "assistant") return null;
	let text = (role === "assistant" ? extractAssistantPhaseText(entry) : extractUserText(entry))?.trim();
	if (!text || role === "assistant" && isSuppressedControlReplyText(text)) return null;
	if (role === "user") text = stripEnvelope(text).trim();
	if (options.flattenMarkdown) text = flattenMarkdownToPlainText(text);
	if (!text) return null;
	const requestedMaxChars = options.maxChars ?? SESSION_LAST_MESSAGE_PREVIEW_DEFAULT_CHARS;
	const limit = Math.min(SESSION_DISPLAY_PROJECTION_MAX_CHARS, Math.max(20, Math.floor(requestedMaxChars)));
	return {
		role,
		text: text.length <= limit ? text : `${truncateUtf16Safe(text, limit - 3)}...`
	};
}
//#endregion
//#region src/gateway/session-transcript-derived-readers.ts
function extractTranscriptUsageSnapshot(message, source) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	if (source === "artifact" && typeof record.role === "string" && record.role !== "assistant") return null;
	const usageRaw = record.usage && typeof record.usage === "object" && !Array.isArray(record.usage) ? record.usage : void 0;
	const usage = normalizeUsage(usageRaw);
	const normalizedUsage = usage ?? {};
	const legacyCliUsage = (source === "artifact" && typeof record.api === "string" ? record.api.trim() : record.api) === "cli" && usageRaw && usageRaw.contextUsage === void 0;
	const derivedTotalTokens = legacyCliUsage ? void 0 : deriveSessionTotalTokens({ usage });
	const totalTokens = source === "artifact" ? asPositiveFiniteNumber(derivedTotalTokens) : derivedTotalTokens;
	const modelProvider = typeof record.provider === "string" ? record.provider.trim() : void 0;
	const model = typeof record.model === "string" ? record.model.trim() : void 0;
	const costUsd = source === "artifact" ? asNonNegativeFiniteNumber(usageRaw?.cost?.total) : typeof usageRaw?.cost?.total === "number" && Number.isFinite(usageRaw.cost.total) ? usageRaw.cost.total : usageRaw?.costUsd;
	const hasMeaningfulUsage = hasNonzeroUsage(usage) || typeof totalTokens === "number" || typeof costUsd === "number" && Number.isFinite(costUsd) && (source === "artifact" || costUsd > 0);
	const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
	if (!hasMeaningfulUsage && !modelProvider && !model) return null;
	if (isDeliveryMirror && !hasMeaningfulUsage) return null;
	return {
		...!isDeliveryMirror && modelProvider ? { modelProvider } : {},
		...!isDeliveryMirror && model ? { model } : {},
		...typeof normalizedUsage.input === "number" ? { inputTokens: normalizedUsage.input } : {},
		...typeof normalizedUsage.output === "number" ? { outputTokens: normalizedUsage.output } : {},
		...typeof normalizedUsage.cacheRead === "number" ? { cacheRead: normalizedUsage.cacheRead } : {},
		...typeof normalizedUsage.cacheWrite === "number" ? { cacheWrite: normalizedUsage.cacheWrite } : {},
		...legacyCliUsage ? { contextUsage: { state: "unavailable" } } : normalizedUsage.contextUsage ? { contextUsage: normalizedUsage.contextUsage } : {},
		...typeof totalTokens === "number" ? {
			totalTokens,
			totalTokensFresh: true
		} : {},
		...typeof costUsd === "number" && Number.isFinite(costUsd) ? { costUsd } : {}
	};
}
function estimateTranscriptMessageChars(message) {
	if (!isRecord(message)) return 0;
	const content = message.content;
	if (typeof content === "string") return content.trim() ? estimateStringChars(content.trim()) : 0;
	if (!Array.isArray(content)) return 0;
	return content.reduce((total, part) => {
		if (!isRecord(part)) return total;
		const { text, type } = part;
		if (typeof text !== "string" || typeof type === "string" && type !== "text" && type !== "output_text" && type !== "input_text") return total;
		const normalized = text.trim();
		return normalized ? total + estimateStringChars(normalized) : total;
	}, 0);
}
function aggregateSessionTranscriptUsage(messages, source = "sqlite") {
	const aggregate = {};
	let sawUsage = false;
	let inputTokens = 0;
	let outputTokens = 0;
	let cacheRead = 0;
	let cacheWrite = 0;
	let costUsd = 0;
	let sawInput = false;
	let sawOutput = false;
	let sawCacheRead = false;
	let sawCacheWrite = false;
	let sawCost = false;
	let estimatedTranscriptChars = 0;
	let sawEstimateModelIdentity = false;
	for (const message of messages) {
		if (source === "artifact" && isRecord(message)) {
			const provider = typeof message.provider === "string" ? message.provider.trim() : void 0;
			const model = typeof message.model === "string" ? message.model.trim() : void 0;
			if ((message.role === "user" || message.role === "assistant") && !(message.role === "assistant" && provider === "openclaw" && model === "delivery-mirror")) {
				const estimatedChars = estimateTranscriptMessageChars(message);
				estimatedTranscriptChars += estimatedChars;
				sawEstimateModelIdentity ||= message.role === "assistant" && estimatedChars > 0 && Boolean(provider || model);
			}
		}
		const snapshot = extractTranscriptUsageSnapshot(message, source);
		if (!snapshot) continue;
		sawUsage = true;
		if (snapshot.modelProvider) aggregate.modelProvider = snapshot.modelProvider;
		if (snapshot.model) aggregate.model = snapshot.model;
		if (typeof snapshot.inputTokens === "number") {
			inputTokens += snapshot.inputTokens;
			sawInput = true;
		}
		if (typeof snapshot.outputTokens === "number") {
			outputTokens += snapshot.outputTokens;
			sawOutput = true;
		}
		if (typeof snapshot.cacheRead === "number") {
			cacheRead += snapshot.cacheRead;
			sawCacheRead = true;
		}
		if (typeof snapshot.cacheWrite === "number") {
			cacheWrite += snapshot.cacheWrite;
			sawCacheWrite = true;
		}
		if (snapshot.contextUsage) aggregate.contextUsage = snapshot.contextUsage;
		else if (typeof snapshot.totalTokens === "number") delete aggregate.contextUsage;
		if (snapshot.contextUsage?.state === "unavailable") {
			delete aggregate.totalTokens;
			delete aggregate.totalTokensFresh;
		} else if (typeof snapshot.totalTokens === "number") {
			aggregate.totalTokens = snapshot.totalTokens;
			aggregate.totalTokensFresh = true;
		}
		if (typeof snapshot.costUsd === "number") {
			costUsd += snapshot.costUsd;
			sawCost = true;
		}
	}
	if (!sawUsage) return null;
	if (sawInput) aggregate.inputTokens = inputTokens;
	if (sawOutput) aggregate.outputTokens = outputTokens;
	if (sawCacheRead) aggregate.cacheRead = cacheRead;
	if (sawCacheWrite) aggregate.cacheWrite = cacheWrite;
	if (sawCost) aggregate.costUsd = costUsd;
	if (source === "artifact" && typeof aggregate.totalTokens !== "number" && aggregate.contextUsage?.state !== "unavailable" && estimatedTranscriptChars > 0 && sawEstimateModelIdentity) {
		const estimatedTotalTokens = estimateTokensFromChars(estimatedTranscriptChars);
		if (estimatedTotalTokens > 0) {
			aggregate.totalTokens = estimatedTotalTokens;
			aggregate.totalTokensFresh = true;
		}
	}
	return aggregate;
}
//#endregion
//#region src/gateway/session-transcript-json.ts
/** Reads a nonblank transcript field while preserving its original whitespace. */
function readNonBlankStringPreservingWhitespace(value) {
	return readNonBlankString(value);
}
const TRANSCRIPT_FIELD_REGEX_CACHE = /* @__PURE__ */ new Map();
function getTranscriptFieldRegexes(field) {
	let cached = TRANSCRIPT_FIELD_REGEX_CACHE.get(field);
	if (!cached) {
		const escapedField = escapeRegExp(field);
		cached = {
			stringRe: new RegExp(`"${escapedField}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`),
			nullRe: new RegExp(`"${escapedField}"\\s*:\\s*null`),
			numberRe: new RegExp(`"${escapedField}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`)
		};
		TRANSCRIPT_FIELD_REGEX_CACHE.set(field, cached);
	}
	return cached;
}
function extractJsonStringFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).stringRe.exec(prefix);
	if (!match) return;
	try {
		return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
	} catch {
		return;
	}
}
function extractJsonNullableStringFieldPrefix(prefix, field) {
	if (getTranscriptFieldRegexes(field).nullRe.test(prefix)) return null;
	return extractJsonStringFieldPrefix(prefix, field);
}
function extractJsonNumberFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).numberRe.exec(prefix);
	if (!match) return;
	const decoded = Number(match[1]);
	return Number.isFinite(decoded) ? decoded : void 0;
}
//#endregion
//#region src/chat/canvas-render.ts
function getRecordStringField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function getRecordNumberField(record, key) {
	const value = record?.[key];
	return asFiniteNumber(value);
}
function getNestedRecord(record, key) {
	const value = record?.[key];
	return asOptionalRecord(value);
}
function coerceMcpAppDescriptor(record) {
	const viewId = getRecordStringField(record, "viewId");
	if (!viewId || viewId.length > 128) return;
	const serverName = getRecordStringField(record, "serverName");
	const toolName = getRecordStringField(record, "toolName");
	const uiResourceUri = getRecordStringField(record, "uiResourceUri");
	const toolCallId = getRecordStringField(record, "toolCallId");
	const originSessionKey = getRecordStringField(record, "originSessionKey");
	const resultMetaState = record?.resultMetaState === "unavailable" ? "unavailable" : void 0;
	return Boolean(serverName && serverName.length <= 256 && toolName && toolName.length <= 256 && uiResourceUri?.startsWith("ui://") && uiResourceUri.length <= 2048 && toolCallId && toolCallId.length <= 512) ? {
		viewId,
		serverName,
		toolName,
		uiResourceUri,
		toolCallId,
		...originSessionKey && originSessionKey.length <= 512 ? { originSessionKey } : {},
		...resultMetaState ? { resultMetaState } : {}
	} : { viewId };
}
function normalizeSurface(value) {
	return value === "assistant_message" || value === "node_panel" ? value : void 0;
}
function normalizeSandbox(value) {
	return value === "strict" || value === "scripts" ? value : void 0;
}
function normalizePreferredHeight(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 160 ? Math.min(Math.trunc(value), 1200) : void 0;
}
function isCanvasBoardWidgetName(value) {
	return typeof value === "string" && /^[a-z0-9][a-z0-9._-]{0,63}$/u.test(value);
}
function coerceCanvasPreview(record) {
	if (!record) return;
	if (getRecordStringField(record, "kind")?.trim().toLowerCase() !== "canvas") return;
	const presentation = getNestedRecord(record, "presentation");
	const view = getNestedRecord(record, "view");
	const source = getNestedRecord(record, "source");
	const mcpApp = coerceMcpAppDescriptor(getNestedRecord(record, "mcpApp"));
	const mcpAppViewId = mcpApp?.viewId;
	const requestedSurface = getRecordStringField(presentation, "target") ?? getRecordStringField(record, "target");
	const surface = requestedSurface ? normalizeSurface(requestedSurface) : "assistant_message";
	if (!surface) return;
	const title = getRecordStringField(presentation, "title") ?? getRecordStringField(view, "title");
	const preferredHeight = normalizePreferredHeight(getRecordNumberField(presentation, "preferred_height") ?? getRecordNumberField(presentation, "preferredHeight") ?? getRecordNumberField(view, "preferred_height") ?? getRecordNumberField(view, "preferredHeight"));
	const className = getRecordStringField(presentation, "class_name") ?? getRecordStringField(presentation, "className");
	const style = getRecordStringField(presentation, "style");
	const sandbox = normalizeSandbox(getRecordStringField(presentation, "sandbox"));
	const viewUrl = getRecordStringField(view, "url") ?? getRecordStringField(view, "entryUrl");
	const viewId = getRecordStringField(view, "id") ?? getRecordStringField(view, "docId");
	const requestedBoardWidgetName = getRecordStringField(view, "boardWidgetName");
	const boardWidgetName = isCanvasBoardWidgetName(requestedBoardWidgetName) ? requestedBoardWidgetName : void 0;
	if (mcpAppViewId && viewId === mcpAppViewId) return {
		kind: "canvas",
		surface,
		render: "url",
		viewId,
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...sandbox ? { sandbox } : {},
		mcpApp
	};
	if (viewUrl) return {
		kind: "canvas",
		surface,
		render: "url",
		url: viewUrl,
		...viewId ? { viewId } : {},
		...title ? { title } : {},
		...preferredHeight ? { preferredHeight } : {},
		...className ? { className } : {},
		...style ? { style } : {},
		...sandbox ? { sandbox } : {},
		...boardWidgetName ? { boardWidgetName } : {},
		...mcpApp ? { mcpApp } : {}
	};
	if (getRecordStringField(source, "type")?.trim().toLowerCase() === "url") {
		const url = getRecordStringField(source, "url");
		if (!url) return;
		return {
			kind: "canvas",
			surface,
			render: "url",
			url,
			...title ? { title } : {},
			...preferredHeight ? { preferredHeight } : {},
			...className ? { className } : {},
			...style ? { style } : {},
			...sandbox ? { sandbox } : {},
			...mcpApp ? { mcpApp } : {}
		};
	}
}
/** Extracts an MCP App Canvas preview from sanitized tool-result details. */
function extractCanvasFromDetails(value) {
	return coerceCanvasPreview(asOptionalRecord(asOptionalRecord(value)?.mcpAppPreview));
}
/** Extracts a canvas preview from a JSON-shaped tool or assistant payload. */
function extractCanvasFromText(outputText, _toolName) {
	return coerceCanvasPreview(outputText ? safeParseJsonRecord(outputText) : void 0);
}
//#endregion
//#region src/gateway/chat-display-projection.helpers.ts
const DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS = 8e3;
/** Resolve the text cap used when projecting chat history for display. */
function resolveEffectiveChatHistoryMaxChars(_cfg, maxChars) {
	if (typeof maxChars === "number") return maxChars;
	return DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
}
function truncateChatHistoryText(text, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS) {
	if (text.length <= maxChars) return {
		text,
		truncated: false
	};
	return {
		text: `${truncateUtf16Safe(text, maxChars)}\n...(truncated)...`,
		truncated: true
	};
}
function extractAssistantTextForSilentCheck(message) {
	if (!message || typeof message !== "object") return;
	const entry = message;
	if (entry.role !== "assistant") return;
	if (typeof entry.text === "string") return entry.text;
	if (typeof entry.content === "string") return entry.content;
	if (!Array.isArray(entry.content) || entry.content.length === 0) return;
	const texts = [];
	for (const block of entry.content) {
		if (!block || typeof block !== "object") return;
		const typed = block;
		if (isAssistantInternalReasoningContentType(typed.type)) continue;
		if (!isAssistantTextContentType(typed.type) || typeof typed.text !== "string") return;
		texts.push(typed.text);
	}
	return texts.length > 0 ? texts.join("\n") : void 0;
}
function isAssistantTextContentType(type) {
	return type === "text" || type === "input_text" || type === "output_text";
}
function isAssistantInternalReasoningContentType(type) {
	return type === "thinking" || type === "reasoning" || type === "redacted_thinking";
}
function hasAssistantNonTextContent(message) {
	if (!message || typeof message !== "object") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	return content.some((block) => block && typeof block === "object" && !isAssistantTextContentType(block.type));
}
function hasAssistantDisplayableNonTextContent(message) {
	if (!message || typeof message !== "object") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	return content.some((block) => block && typeof block === "object" && !isAssistantTextContentType(block.type) && !isAssistantInternalReasoningContentType(block.type));
}
function shouldPreserveAssistantControlReplyText(message) {
	if (isProjectedSessionsSendForwardedMessage(message)) return true;
	const content = message.text ?? message.content;
	const texts = typeof content === "string" ? [content] : Array.isArray(content) ? content.flatMap((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return [];
		const typed = block;
		return isAssistantTextContentType(typed.type) && typeof typed.text === "string" ? [typed.text] : [];
	}) : [];
	return texts.length > 0 && texts.every((text) => isSuppressedControlReplyText(text)) && hasAssistantDisplayableNonTextContent(message);
}
function asRoleContentMessage(message) {
	const role = typeof message.role === "string" ? message.role.toLowerCase() : "";
	if (!role) return null;
	return {
		role,
		...message.content !== void 0 ? { content: message.content } : message.text !== void 0 ? { content: message.text } : {}
	};
}
function isEmptyTextOnlyContent(content) {
	if (typeof content === "string") return content.trim().length === 0;
	if (!Array.isArray(content)) return false;
	if (content.length === 0) return true;
	let sawText = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const entry = block;
		if (entry.type !== "text") return false;
		sawText = true;
		if (typeof entry.text !== "string" || entry.text.trim().length > 0) return false;
	}
	return sawText;
}
function hasTranscriptMediaFacts(message) {
	return (readPersistedMediaFacts(message) ?? []).some(isMeaningfulMediaFact);
}
function extractProjectedText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const text = block.text;
		if (typeof text === "string") parts.push(text);
	}
	return parts.join("\n");
}
function isSessionsSendInterSessionUserMessage(message) {
	if (message.role !== "user") return false;
	const provenance = normalizeInputProvenance(message.provenance);
	return provenance?.kind === "inter_session" && provenance.sourceTool === "sessions_send";
}
function isProjectedSessionsSendForwardedMessage(message) {
	if (message.role !== "assistant") return false;
	const provenance = normalizeInputProvenance(message.provenance);
	return provenance?.kind === "inter_session" && provenance.sourceTool === "sessions_send";
}
//#endregion
//#region src/gateway/chat-display-projection.canvas.ts
const TOOL_APPROVAL_REVIEW_STATUSES = /* @__PURE__ */ new Set([
	"in_progress",
	"approved",
	"denied",
	"timed_out",
	"aborted"
]);
function boundedReviewText(value, maxChars) {
	const text = typeof value === "string" ? value.trim() : "";
	return text ? truncateUtf16Safe(text, maxChars) : void 0;
}
function projectToolApprovalReview(value) {
	const review = asOptionalRecord(value);
	const id = boundedReviewText(review?.id, 256);
	const label = boundedReviewText(review?.label, 80);
	const status = boundedReviewText(review?.status, 32);
	if (!id || !label || !status || !TOOL_APPROVAL_REVIEW_STATUSES.has(status)) return;
	const riskLevel = boundedReviewText(review?.riskLevel, 40);
	const userAuthorization = boundedReviewText(review?.userAuthorization, 40);
	const rationale = boundedReviewText(review?.rationale, 2e3);
	return {
		id,
		label,
		status,
		...riskLevel ? { riskLevel } : {},
		...userAuthorization ? { userAuthorization } : {},
		...rationale ? { rationale } : {}
	};
}
/** Return true for known tool-call/tool-result block type spellings in transcripts. */
function isToolHistoryBlockType(type) {
	if (typeof type !== "string") return false;
	const normalized = type.trim().toLowerCase();
	return normalized === "toolcall" || normalized === "tool_call" || normalized === "tooluse" || normalized === "tool_use" || normalized === "toolresult" || normalized === "tool_result";
}
function isToolResultHistoryBlockType(type) {
	if (typeof type !== "string") return false;
	const normalized = type.trim().toLowerCase();
	return normalized === "toolresult" || normalized === "tool_result";
}
function projectToolResultDetails(details, maxChars) {
	const record = asOptionalRecord(details);
	if (!record) return {
		details: void 0,
		truncated: false
	};
	const projected = {};
	let truncated = false;
	for (const key of ["changed", "created"]) if (typeof record[key] === "boolean") projected[key] = record[key];
	if (typeof record.diff === "string" && record.diff.trim()) {
		const diff = truncateChatHistoryText(record.diff, maxChars);
		projected.diff = diff.text;
		truncated = diff.truncated;
	}
	if (Array.isArray(record.approvalReviews)) {
		const reviews = record.approvalReviews.slice(-16).flatMap((review) => projectToolApprovalReview(review) ?? []);
		if (reviews.length > 0) projected.approvalReviews = reviews;
	}
	const reviewOutcome = record.approvalReviewOutcome;
	if (reviewOutcome === "approved" || reviewOutcome === "denied" || reviewOutcome === "reviewing") projected.approvalReviewOutcome = reviewOutcome;
	const preview = extractCanvasFromDetails(record);
	if (preview?.mcpApp && preview.viewId) projected.mcpAppPreview = {
		kind: "canvas",
		view: {
			id: preview.viewId,
			...preview.url ? { url: preview.url } : {},
			...preview.title ? { title: preview.title } : {}
		},
		presentation: {
			target: "assistant_message",
			...preview.title ? { title: preview.title } : {},
			...preview.preferredHeight ? { preferred_height: preview.preferredHeight } : {},
			...preview.sandbox ? { sandbox: preview.sandbox } : {}
		},
		mcpApp: preview.mcpApp
	};
	return {
		details: Object.keys(projected).length > 0 ? projected : void 0,
		truncated
	};
}
function messageHasToolResultShape(message) {
	const role = typeof message.role === "string" ? message.role.toLowerCase() : "";
	if (role === "toolresult" || role === "tool_result" || role === "tool" || role === "function") return true;
	const content = Array.isArray(message.content) ? message.content : [];
	if (content.some((block) => block && typeof block === "object" && isToolResultHistoryBlockType(block.type))) return true;
	const hasToolCallBlock = content.some((block) => block && typeof block === "object" && isToolHistoryBlockType(block.type) && !isToolResultHistoryBlockType(block.type));
	const hasToolId = typeof message.toolCallId === "string" || typeof message.tool_call_id === "string" || typeof message.toolUseId === "string" || typeof message.tool_use_id === "string";
	const hasToolName = typeof message.toolName === "string" || typeof message.tool_name === "string";
	return hasToolId && hasToolName && !hasToolCallBlock;
}
function extractChatHistoryBlockText(message) {
	if (!message || typeof message !== "object") return;
	const entry = message;
	if (typeof entry.content === "string") return entry.content;
	if (typeof entry.text === "string") return entry.text;
	if (!Array.isArray(entry.content)) return;
	const textParts = entry.content.map((block) => {
		if (!block || typeof block !== "object") return;
		const typed = block;
		return typeof typed.text === "string" ? typed.text : void 0;
	}).filter((value) => typeof value === "string");
	return textParts.length > 0 ? textParts.join("\n") : void 0;
}
function extractChatHistoryCanvasPreview(message) {
	const direct = extractCanvasFromDetails(message.details);
	if (direct) return direct;
	if (!Array.isArray(message.content)) return;
	for (const block of message.content) {
		const preview = extractCanvasFromDetails(asOptionalRecord(block)?.details);
		if (preview) return preview;
	}
}
function appendCanvasBlockToAssistantHistoryMessage(params) {
	const preview = params.preview;
	if (!preview || !params.message || typeof params.message !== "object") return params.message;
	const entry = params.message;
	const baseContent = Array.isArray(entry.content) ? [...entry.content] : typeof entry.content === "string" ? [{
		type: "text",
		text: entry.content
	}] : typeof entry.text === "string" ? [{
		type: "text",
		text: entry.text
	}] : [];
	if (!baseContent.some((block) => {
		if (!block || typeof block !== "object") return false;
		const typed = block;
		return typed.type === "canvas" && typed.preview && typeof typed.preview === "object" && (typed.preview.viewId && typed.preview.viewId === preview.viewId || typed.preview.url && typed.preview.url === preview.url);
	})) baseContent.push({
		type: "canvas",
		preview,
		rawText: params.rawText
	});
	return {
		...entry,
		content: baseContent
	};
}
function messageContainsToolHistoryContent(message) {
	if (!message || typeof message !== "object") return false;
	const entry = message;
	if (typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string" || typeof entry.toolName === "string" || typeof entry.tool_name === "string") return true;
	if (!Array.isArray(entry.content)) return false;
	return entry.content.some((block) => {
		if (!block || typeof block !== "object") return false;
		return isToolHistoryBlockType(block.type);
	});
}
function augmentChatHistoryWithCanvasBlocks(messages) {
	if (messages.length === 0) return messages;
	const next = [...messages];
	let changed = false;
	let lastAssistantIndex = -1;
	let lastRenderableAssistantIndex = -1;
	const pending = [];
	for (let index = 0; index < next.length; index++) {
		const message = next[index];
		if (!message || typeof message !== "object") continue;
		const entry = message;
		if ((typeof entry.role === "string" ? entry.role.toLowerCase() : "") === "assistant") {
			lastAssistantIndex = index;
			if (!messageContainsToolHistoryContent(entry)) {
				lastRenderableAssistantIndex = index;
				if (pending.length > 0) {
					let target = next[index];
					for (const item of pending) target = appendCanvasBlockToAssistantHistoryMessage({
						message: target,
						preview: item.preview,
						rawText: item.rawText
					});
					next[index] = target;
					pending.length = 0;
					changed = true;
				}
			}
			continue;
		}
		if (!messageContainsToolHistoryContent(entry)) continue;
		const toolName = typeof entry.toolName === "string" ? entry.toolName : typeof entry.tool_name === "string" ? entry.tool_name : void 0;
		const text = extractChatHistoryBlockText(entry);
		const detailsPreview = extractChatHistoryCanvasPreview(entry);
		const preview = detailsPreview ?? extractCanvasFromText(text, toolName);
		if (!preview) continue;
		pending.push({
			preview,
			rawText: detailsPreview ? null : text ?? null
		});
	}
	if (pending.length > 0) {
		const targetIndex = lastRenderableAssistantIndex >= 0 ? lastRenderableAssistantIndex : lastAssistantIndex;
		if (targetIndex >= 0) {
			let target = next[targetIndex];
			for (const item of pending) target = appendCanvasBlockToAssistantHistoryMessage({
				message: target,
				preview: item.preview,
				rawText: item.rawText
			});
			next[targetIndex] = target;
			changed = true;
		}
	}
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.history.ts
function digestTtsSupplementText(text) {
	return createHash("sha256").update(text.trim()).digest("hex");
}
function readTtsSupplementMarker(message) {
	const marker = asOptionalRecord(message.openclawTtsSupplement);
	if (!marker) return;
	const textSha256 = typeof marker.textSha256 === "string" && marker.textSha256.trim() ? marker.textSha256.trim() : void 0;
	const spokenText = typeof marker.spokenText === "string" && marker.spokenText.trim() ? marker.spokenText.trim() : void 0;
	return textSha256 || spokenText ? {
		textSha256,
		spokenText
	} : void 0;
}
function isAssistantTtsSupplementMessage(message) {
	if (asRoleContentMessage(message)?.role !== "assistant") return false;
	if (!readTtsSupplementMarker(message)) return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	let hasSupplementBlock = false;
	for (const block of content) {
		const record = asOptionalRecord(block);
		if (!record) continue;
		if (record.type !== "text") {
			hasSupplementBlock = true;
			continue;
		}
		const text = typeof record.text === "string" ? record.text.trim() : "";
		if (text && text !== "Audio reply") return false;
	}
	return hasSupplementBlock;
}
function ttsSupplementMatchesAssistant(marker, message) {
	if (asRoleContentMessage(message)?.role !== "assistant") return false;
	if (isProjectedSessionsSendForwardedMessage(message)) return false;
	if (readTtsSupplementMarker(message)) return false;
	const text = extractProjectedText(message.content ?? message.text).trim();
	if (!text) return false;
	if (marker.textSha256 && digestTtsSupplementText(text) === marker.textSha256) return true;
	return Boolean(marker.spokenText && text === marker.spokenText);
}
function mergeTtsSupplementContent(target, supplement) {
	const supplementBlocks = Array.isArray(supplement.content) ? supplement.content.filter((block) => {
		const record = asOptionalRecord(block);
		return record !== void 0 && record.type !== "text";
	}) : [];
	if (supplementBlocks.length === 0) return target;
	const targetContent = target.content;
	if (Array.isArray(targetContent)) return {
		...target,
		content: [...targetContent, ...supplementBlocks]
	};
	const targetText = extractProjectedText(targetContent ?? target.text).trim();
	return {
		...target,
		content: [...targetText ? [{
			type: "text",
			text: targetText
		}] : [], ...supplementBlocks]
	};
}
function mergeTtsSupplementMessages(messages) {
	if (!messages.some(isAssistantTtsSupplementMessage)) return messages;
	const merged = [];
	let changed = false;
	for (const message of messages) {
		const marker = readTtsSupplementMarker(message);
		if (marker && isAssistantTtsSupplementMessage(message)) {
			let targetIndex = -1;
			for (let i = merged.length - 1; i >= 0; i--) {
				const candidate = merged[i];
				if (candidate && ttsSupplementMatchesAssistant(marker, candidate)) {
					targetIndex = i;
					break;
				}
			}
			if (targetIndex >= 0) {
				merged[targetIndex] = mergeTtsSupplementContent(expectDefined(merged[targetIndex], "merged entry at target index"), message);
				changed = true;
				continue;
			}
		}
		merged.push(message);
	}
	return changed ? merged : messages;
}
function isSubagentAnnounceInterSessionUserMessage(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	if (provenance?.kind === "inter_session" && provenance.sourceTool === "subagent_announce") return true;
	const text = extractProjectedText(message.content ?? message.text);
	return text.includes("[Inter-session message]") && text.includes("sourceTool=subagent_announce");
}
function readChatHistoryRecordTimestampMs(message) {
	return asFiniteNumber(asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.recordTimestampMs) ?? asFiniteNumber(asOptionalRecord(message)?.timestamp);
}
function isSubagentAnnounceInterSessionUserChatHistoryMessage(message) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "user") return false;
	const provenance = normalizeInputProvenance(record.provenance);
	if (provenance?.kind === "inter_session" && provenance.sourceTool === "subagent_announce") return true;
	const text = extractChatHistoryBlockText(record);
	return typeof text === "string" && text.includes("[Inter-session message]") && text.includes("sourceTool=subagent_announce");
}
function isChatHistoryAssistantMessage(message) {
	return asOptionalRecord(message)?.role === "assistant";
}
function dropPreSessionStartAnnouncePairs(messages, sessionStartedAt) {
	if (sessionStartedAt === void 0 || messages.length === 0) return messages;
	let changed = false;
	const kept = [];
	for (let i = 0; i < messages.length; i++) {
		const current = messages[i];
		if (isSubagentAnnounceInterSessionUserChatHistoryMessage(current)) {
			const ts = readChatHistoryRecordTimestampMs(current);
			if (typeof ts === "number" && ts < sessionStartedAt) {
				const next = messages[i + 1];
				const nextTs = readChatHistoryRecordTimestampMs(next);
				if (isChatHistoryAssistantMessage(next) && typeof nextTs === "number" && nextTs < sessionStartedAt) i++;
				changed = true;
				continue;
			}
		}
		kept.push(current);
	}
	return changed ? kept : messages;
}
function isDisplayHiddenProjectedMessage(message) {
	if (message.display === false) return true;
	return message.role === "custom" && message.customType === "openclaw.runtime-context";
}
function shouldHideProjectedHistoryMessage(message) {
	if (isDisplayHiddenProjectedMessage(message)) return true;
	if (isProjectedSessionsSendForwardedMessage(message)) return false;
	const roleContent = asRoleContentMessage(message);
	if (!roleContent) return false;
	if (roleContent.role === "user" && isSubagentAnnounceInterSessionUserMessage(message)) return true;
	if (roleContent.role === "user" && isEmptyTextOnlyContent(message.content ?? message.text) && !hasTranscriptMediaFacts(message)) return true;
	if (roleContent.role === "assistant" && isEmptyTextOnlyContent(message.content ?? message.text)) return false;
	if (isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT)) return true;
	return isHeartbeatOkResponse(roleContent);
}
/** Identifies the hidden native input that starts a heartbeat-driven turn. */
function isHeartbeatHistoryTurnBoundaryMessage(message) {
	const record = asOptionalRecord(message);
	if (!record || isSessionsSendInterSessionUserMessage(record)) return false;
	const roleContent = asRoleContentMessage(record);
	return roleContent?.role === "user" && isHeartbeatUserMessage(roleContent, HEARTBEAT_PROMPT);
}
function attachProjectedTurnBoundary(message) {
	const metadata = asOptionalRecord(message["__openclaw"]);
	if (metadata?.turnBoundary === true) return message;
	return {
		...message,
		__openclaw: {
			...metadata,
			turnBoundary: true
		}
	};
}
function canCarryProjectedTurnBoundary(message) {
	return Boolean(message && message.role !== "system" && message.role !== "custom");
}
function openclawAssistantModel(message) {
	return message.role === "assistant" && message.provider === "openclaw" && typeof message.model === "string" ? message.model : void 0;
}
function displayTextForDuplicateCheck(message) {
	const text = extractProjectedText(message.content ?? message.text).trim();
	return text ? text : void 0;
}
function isDuplicateAcpGatewayInjectedMessage(current, previousVisible) {
	if (!previousVisible) return false;
	if (openclawAssistantModel(previousVisible) !== "acp-runtime" || openclawAssistantModel(current) !== "gateway-injected") return false;
	if (hasAssistantNonTextContent(previousVisible) || hasAssistantNonTextContent(current)) return false;
	const previousText = displayTextForDuplicateCheck(previousVisible);
	const currentText = displayTextForDuplicateCheck(current);
	return Boolean(previousText && currentText && previousText === currentText);
}
function isDuplicateChannelFinalDeliveryMirror(current, previousVisible) {
	if (!previousVisible || !isOpenClawDeliveryMirrorAssistantMessage(current)) return false;
	if (asOptionalRecord(current.openclawDeliveryMirror)?.kind !== "channel-final") return false;
	if (asRoleContentMessage(previousVisible)?.role !== "assistant") return false;
	if (isOpenClawDeliveryMirrorAssistantMessage(previousVisible)) return false;
	if (isProjectedSessionsSendForwardedMessage(previousVisible)) return false;
	const previousMeta = asOptionalRecord(previousVisible["__openclaw"]);
	if (typeof previousMeta?.mirrorIdentity !== "string" || !previousMeta.mirrorIdentity.trim()) return false;
	if (hasAssistantNonTextContent(previousVisible) || hasAssistantNonTextContent(current)) return false;
	const previousText = displayTextForDuplicateCheck(previousVisible);
	const currentText = displayTextForDuplicateCheck(current);
	return Boolean(previousText && currentText && previousText === currentText);
}
function toProjectedMessages(messages) {
	return messages.filter((message) => Boolean(message) && typeof message === "object" && !Array.isArray(message));
}
function filterVisibleProjectedHistoryMessages(messages, turnBoundaryPending = false) {
	if (messages.length === 0) return {
		messages,
		turnBoundaryPending
	};
	let pendingTurnBoundary = turnBoundaryPending;
	let changed = false;
	const visible = [];
	for (let i = 0; i < messages.length; i++) {
		const current = messages[i];
		if (!current) continue;
		const currentRoleContent = asRoleContentMessage(current);
		const next = messages[i + 1];
		const nextRoleContent = next ? asRoleContentMessage(next) : null;
		if (currentRoleContent && next && nextRoleContent && isHeartbeatUserMessage(currentRoleContent, HEARTBEAT_PROMPT) && isHeartbeatOkResponse(nextRoleContent) && !isProjectedSessionsSendForwardedMessage(next)) {
			changed = true;
			pendingTurnBoundary = true;
			i++;
			continue;
		}
		if (shouldHideProjectedHistoryMessage(current)) {
			changed = true;
			pendingTurnBoundary ||= isHeartbeatHistoryTurnBoundaryMessage(current);
			continue;
		}
		if (isDuplicateAcpGatewayInjectedMessage(current, messages[i - 1]) || isDuplicateChannelFinalDeliveryMirror(current, messages[i - 1])) {
			changed = true;
			continue;
		}
		if (pendingTurnBoundary && canCarryProjectedTurnBoundary(currentRoleContent)) {
			visible.push(attachProjectedTurnBoundary(current));
			pendingTurnBoundary = false;
			changed = true;
		} else visible.push(current);
	}
	return {
		messages: changed ? visible : messages,
		turnBoundaryPending: pendingTurnBoundary
	};
}
function stripInterSessionPromptPrefixFromContent(content) {
	if (typeof content === "string") return stripInterSessionPromptPrefixForDisplay(content);
	if (!Array.isArray(content)) return content;
	return content.map((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return block;
		const record = block;
		if (typeof record.text !== "string") return block;
		const stripped = stripInterSessionPromptPrefixForDisplay(record.text);
		return stripped === record.text ? block : {
			...record,
			text: stripped
		};
	});
}
function extractPromptPrefixField(text, field) {
	const prefixIndex = text.indexOf(INTER_SESSION_PROMPT_PREFIX_BASE);
	if (prefixIndex === -1) return;
	const lineEnd = text.indexOf("\n", prefixIndex);
	const header = lineEnd === -1 ? text.slice(prefixIndex) : text.slice(prefixIndex, lineEnd);
	const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return normalizeOptionalString(new RegExp(`(?:^|\\s)${escapedField}=([^\\s]+)`).exec(header)?.[1]);
}
function resolveSessionsSendForwardedSenderLabel(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	const text = extractProjectedText(message.content ?? message.text);
	const agentId = parseAgentSessionKey(provenance?.sourceSessionKey ?? extractPromptPrefixField(text, "sourceSession"))?.agentId;
	return agentId ? `Forwarded from ${agentId}` : "Forwarded agent message";
}
function projectSessionsSendInterSessionMessages(messages) {
	let changed = false;
	const projected = messages.map((message) => {
		if (!isSessionsSendInterSessionUserMessage(message)) return message;
		changed = true;
		const next = {
			...message,
			role: "assistant",
			senderLabel: resolveSessionsSendForwardedSenderLabel(message)
		};
		if ("content" in next) next.content = stripInterSessionPromptPrefixFromContent(next.content);
		if (typeof next.text === "string") next.text = stripInterSessionPromptPrefixForDisplay(next.text);
		return next;
	});
	return changed ? projected : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.message-tool.ts
function normalizeToolHistoryType(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized ? normalized.replace(/_/g, "") : void 0;
}
function readMaybeJsonRecord(value) {
	if (typeof value === "string") return safeParseJsonRecord(value);
	return asOptionalRecord(value);
}
function readToolBlockName(block) {
	const direct = normalizeOptionalString(block.name) ?? normalizeOptionalString(block.toolName) ?? normalizeOptionalString(block.tool_name) ?? normalizeOptionalString(block.tool);
	if (direct) return direct;
	const fn = asOptionalRecord(block.function);
	return fn ? normalizeOptionalString(fn.name) : void 0;
}
function readToolBlockCallId(block) {
	return normalizeOptionalString(block.id) ?? normalizeOptionalString(block.toolCallId) ?? normalizeOptionalString(block.tool_call_id) ?? normalizeOptionalString(block.callId) ?? normalizeOptionalString(block.call_id);
}
function readToolBlockArguments(block) {
	for (const key of [
		"arguments",
		"input",
		"args",
		"params"
	]) {
		const args = readMaybeJsonRecord(block[key]);
		if (args) return args;
	}
	const fn = asOptionalRecord(block.function);
	if (fn) {
		const args = readMaybeJsonRecord(fn.arguments);
		if (args) return args;
	}
	return {};
}
function hasNonEmptyValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.some(hasNonEmptyValue);
	if (!value || typeof value !== "object") return value != null;
	return Object.values(value).some(hasNonEmptyValue);
}
function hasExplicitMessageToolRoute(args) {
	return [
		"target",
		"targets",
		"to",
		"recipient",
		"recipients",
		"chatId",
		"chat_id",
		"channelId",
		"channel_id",
		"conversationId",
		"conversation_id",
		"threadId",
		"thread_id",
		"roomId",
		"room_id",
		"groupId",
		"group_id"
	].some((field) => hasNonEmptyValue(args[field]));
}
function readMessageToolVisibleText(args) {
	for (const field of [
		"message",
		"text",
		"content",
		"body",
		"caption"
	]) {
		const value = args[field];
		if (typeof value === "string" && value.trim()) return value;
	}
}
function isDryRunMessageToolRecord(record) {
	if (record.dryRun === true || record.dry_run === true) return true;
	return (normalizeOptionalString(record.deliveryStatus) ?? normalizeOptionalString(record.delivery_status) ?? normalizeOptionalString(record.status))?.toLowerCase() === "dry_run";
}
function extractMessageToolVisibleReplies(message) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return [];
	const replies = [];
	for (const block of message.content) {
		const record = asOptionalRecord(block);
		if (!record) continue;
		const type = normalizeToolHistoryType(record.type);
		if (type !== "toolcall" && type !== "tooluse") continue;
		if (readToolBlockName(record)?.toLowerCase() !== "message") continue;
		const args = readToolBlockArguments(record);
		if (normalizeOptionalString(args.action)?.toLowerCase() !== "send") continue;
		if (isDryRunMessageToolRecord(args)) continue;
		const requiresSourceRouteConfirmation = hasExplicitMessageToolRoute(args);
		const text = readMessageToolVisibleText(args);
		if (!text?.trim()) continue;
		const toolCallId = readToolBlockCallId(record);
		replies.push({
			...toolCallId ? { toolCallId } : {},
			text,
			requiresSourceRouteConfirmation
		});
	}
	return replies;
}
function isAssistantSilentControlReplyOnly(message) {
	const text = extractAssistantTextForSilentCheck(message);
	return text !== void 0 && isSuppressedControlReplyText(text) && !hasAssistantDisplayableNonTextContent(message);
}
function isRenderableAssistantDisplayMessage(message) {
	if (message.role !== "assistant") return false;
	const text = extractAssistantTextForSilentCheck(message);
	return text !== void 0 && !isSuppressedControlReplyText(text);
}
function readMessageToolResultName(message) {
	return normalizeOptionalString(message.toolName) ?? normalizeOptionalString(message.tool_name) ?? normalizeOptionalString(message.name) ?? normalizeOptionalString(message.tool);
}
function readMessageToolResultCallId(message) {
	return normalizeOptionalString(message.toolCallId) ?? normalizeOptionalString(message.tool_call_id) ?? normalizeOptionalString(message.callId) ?? normalizeOptionalString(message.call_id) ?? normalizeOptionalString(message.id);
}
function readToolResultOkValue(value) {
	if (typeof value === "boolean") return value;
	const record = readMaybeJsonRecord(value);
	if (record && typeof record.ok === "boolean") return record.ok;
	if (Array.isArray(value)) for (const block of value) {
		const blockOk = readToolResultOkValue(block);
		if (blockOk !== void 0) return blockOk;
		const recordBlock = asOptionalRecord(block);
		if (typeof recordBlock?.text === "string") {
			const textOk = readToolResultOkValue(recordBlock.text);
			if (textOk !== void 0) return textOk;
		}
		if (typeof recordBlock?.content === "string") {
			const contentOk = readToolResultOkValue(recordBlock.content);
			if (contentOk !== void 0) return contentOk;
		}
	}
}
function hasDryRunToolResultValue(value) {
	const record = readMaybeJsonRecord(value);
	if (record && isDryRunMessageToolRecord(record)) return true;
	if (!Array.isArray(value)) return false;
	return value.some((block) => {
		if (hasDryRunToolResultValue(block)) return true;
		const recordBlock = asOptionalRecord(block);
		if (typeof recordBlock?.text === "string" && hasDryRunToolResultValue(recordBlock.text)) return true;
		return typeof recordBlock?.content === "string" && hasDryRunToolResultValue(recordBlock.content);
	});
}
function hasSuppressedToolResultValue(value) {
	const record = readMaybeJsonRecord(value);
	if (record) {
		const messageId = normalizeOptionalString(record.messageId)?.toLowerCase();
		const status = (normalizeOptionalString(record.deliveryStatus) ?? normalizeOptionalString(record.delivery_status) ?? normalizeOptionalString(record.status))?.toLowerCase();
		if (record.delivered === false || messageId === "skipped" || messageId === "suppressed" || status === "skipped" || status === "suppressed") return true;
	}
	if (!Array.isArray(value)) return false;
	return value.some((block) => {
		if (hasSuppressedToolResultValue(block)) return true;
		const blockRecord = asOptionalRecord(block);
		return hasSuppressedToolResultValue(blockRecord?.text) || hasSuppressedToolResultValue(blockRecord?.content);
	});
}
function isSuccessfulMessageToolResult(message, pending) {
	const role = typeof message.role === "string" ? message.role.toLowerCase().replace(/_/g, "") : "";
	const toolName = readMessageToolResultName(message)?.toLowerCase();
	if (role !== "toolresult" && role !== "tool" && role !== "function" && toolName !== "message") return false;
	if (toolName && toolName !== "message") return false;
	const resultCallId = readMessageToolResultCallId(message);
	const hasConfirmedSourceRoute = !pending.requiresSourceRouteConfirmation || asOptionalRecord(message.details)?.sourceReplyRoute === "current-source";
	if (pending.toolCallId) return resultCallId === pending.toolCallId && isSuccessfulMessageToolResultPayload(message) && hasConfirmedSourceRoute;
	return isSuccessfulMessageToolResultPayload(message) && hasConfirmedSourceRoute;
}
function isSuccessfulMessageToolResultPayload(message) {
	if (message.isError === true || message.error != null && message.error !== false) return false;
	if (hasDryRunToolResultValue(message.result) || hasDryRunToolResultValue(message.output) || hasDryRunToolResultValue(message.content) || hasDryRunToolResultValue(message.text)) return false;
	if (hasSuppressedToolResultValue(message.details) || hasSuppressedToolResultValue(message.result) || hasSuppressedToolResultValue(message.output) || hasSuppressedToolResultValue(message.content) || hasSuppressedToolResultValue(message.text)) return false;
	return (readToolResultOkValue(message.result) ?? readToolResultOkValue(message.output) ?? readToolResultOkValue(message.content) ?? readToolResultOkValue(message.text)) !== false;
}
function readMessageToolSourceReplySink(message) {
	return asOptionalRecord(message.details)?.sourceReplySink === "internal-ui" ? "internal-ui" : void 0;
}
function buildMessageToolVisibleReplyMirror(pending) {
	const sourceMessageSeq = asPositiveSafeInteger(asOptionalRecord(pending.anchor["__openclaw"])?.seq);
	const deliveryMirror = [pending.deliveryMirrorAnchor, pending.completionAnchor].find((message) => isOpenClawDeliveryMirrorAssistantMessage(message));
	const mirror = {
		role: "assistant",
		content: Array.isArray(deliveryMirror?.content) ? deliveryMirror.content : [{
			type: "text",
			text: pending.text
		}],
		openclawMessageToolMirror: {
			toolName: "message",
			...pending.toolCallId ? { toolCallId: pending.toolCallId } : {},
			...pending.sourceReplySink ? { sourceReplySink: pending.sourceReplySink } : {},
			...pending.sourceReplySink && sourceMessageSeq ? { sourceMessageSeq } : {}
		}
	};
	for (const field of [
		"timestamp",
		"createdAt",
		"agentId"
	]) if (pending.anchor[field] !== void 0) mirror[field] = pending.anchor[field];
	const transcriptMeta = asOptionalRecord((pending.completionAnchor ?? pending.anchor)["__openclaw"]);
	if (transcriptMeta) mirror["__openclaw"] = { ...transcriptMeta };
	return mirror;
}
function readMessageToolDeliveryMirrorText(message) {
	if (!isOpenClawDeliveryMirrorAssistantMessage(message)) return;
	return displayTextForDuplicateCheck(message);
}
function readMessageToolDeliveryMirrorCallId(message) {
	if (!isOpenClawDeliveryMirrorAssistantMessage(message)) return;
	return normalizeOptionalString(asOptionalRecord(message.openclawDeliveryMirror)?.toolCallId);
}
function mirrorMessageToolVisibleReplies(messages) {
	if (messages.length === 0) return messages;
	if (!messages.some((message) => asOptionalRecord(message))) return messages;
	let changed = false;
	const next = [];
	const pending = [];
	const clearPending = () => {
		if (pending.length > 0) pending.length = 0;
	};
	const flushSucceededMirrors = () => {
		for (const item of pending) {
			if (!item.succeeded) continue;
			next.push(buildMessageToolVisibleReplyMirror(item));
			changed = true;
		}
		clearPending();
	};
	const flushSelectedMirrors = (items) => {
		if (items.length === 0) return;
		const selected = new Set(items);
		const remaining = [];
		for (const item of pending) {
			if (selected.has(item) && item.succeeded) {
				next.push(buildMessageToolVisibleReplyMirror(item));
				changed = true;
				continue;
			}
			remaining.push(item);
		}
		pending.length = 0;
		pending.push(...remaining);
	};
	for (const message of messages) {
		const record = asOptionalRecord(message);
		if (!record) {
			next.push(message);
			continue;
		}
		if (record.role === "user" && isSessionsSendInterSessionUserMessage(record) || isProjectedSessionsSendForwardedMessage(record)) {
			next.push(message);
			continue;
		}
		if (record.role === "user") {
			clearPending();
			next.push(message);
			continue;
		}
		const flushAfterCurrentMessage = [];
		const deliveryMirrorText = readMessageToolDeliveryMirrorText(record);
		const deliveryMirrorCallId = readMessageToolDeliveryMirrorCallId(record);
		const exactDeliveryMirrorPending = deliveryMirrorCallId ? pending.filter((item) => item.toolCallId === deliveryMirrorCallId) : [];
		const textMatchingDeliveryMirrorPending = deliveryMirrorText ? pending.filter((item) => item.text.trim() === deliveryMirrorText) : [];
		const matchingDeliveryMirrorPending = deliveryMirrorCallId ? exactDeliveryMirrorPending.length === 1 ? exactDeliveryMirrorPending : [] : textMatchingDeliveryMirrorPending.length === 1 ? textMatchingDeliveryMirrorPending : [];
		const duplicateDeliveryMirror = matchingDeliveryMirrorPending.some((item) => item.succeeded);
		const visibleReplies = extractMessageToolVisibleReplies(record);
		if (visibleReplies.length > 0) for (const reply of visibleReplies) pending.push({
			...reply,
			anchor: record,
			succeeded: false
		});
		else if (deliveryMirrorText === void 0 && isRenderableAssistantDisplayMessage(record)) clearPending();
		if (pending.length > 0) {
			for (const item of pending) if (!item.succeeded && isSuccessfulMessageToolResult(record, item)) {
				item.succeeded = true;
				const sourceReplySink = readMessageToolSourceReplySink(record);
				if (sourceReplySink) item.sourceReplySink = sourceReplySink;
				item.completionAnchor = item.deliveryMirrorAnchor ?? record;
				if (item.deliveryMirrorAnchor) {
					if (typeof item.deliveryMirrorIndex === "number") next[item.deliveryMirrorIndex] = {
						...item.deliveryMirrorAnchor,
						display: false
					};
					flushAfterCurrentMessage.push(item);
				}
			}
			if (isAssistantSilentControlReplyOnly(record)) flushSucceededMirrors();
		}
		if (duplicateDeliveryMirror) {
			for (const item of matchingDeliveryMirrorPending) item.completionAnchor = record;
			flushSelectedMirrors(matchingDeliveryMirrorPending);
			changed = true;
			continue;
		}
		for (const item of matchingDeliveryMirrorPending) {
			item.deliveryMirrorAnchor = record;
			item.deliveryMirrorIndex = next.length;
		}
		next.push(message);
		flushSelectedMirrors(flushAfterCurrentMessage);
	}
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.sanitize.ts
const MEDIA_PRIVATE_FIELDS = [
	"data",
	"blob",
	"path",
	"file",
	"filePath",
	"localPath"
];
const MEDIA_REFERENCE_FIELDS = [
	"url",
	"openUrl",
	"image_url",
	"audio_url",
	"video_url"
];
const MEDIA_FACT_PRIVATE_FIELDS = ["workspaceDir", ...MEDIA_PRIVATE_FIELDS.filter((field) => field !== "path")];
function projectChatHistoryMediaReference(value) {
	if (typeof value !== "string") return;
	const reference = value.trim();
	if (/^\/(?:api\/chat\/media\/outgoing|media|__openclaw__)\//u.test(reference)) return reference.split(/[?#]/u, 1)[0];
	try {
		if (/^media:/iu.test(reference)) return parseInboundMediaUri(reference)?.normalizedSource;
		const url = new URL(reference);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		url.username = url.password = url.search = url.hash = "";
		return url.toString();
	} catch {
		return;
	}
}
function projectChatHistoryMediaBlock(entry, fact = false) {
	if (!fact && (typeof entry.type !== "string" || !/^(?:image|audio|video)$/u.test(entry.type))) return false;
	const media = entry;
	const hasTopLevelPayload = typeof media.data === "string" || typeof media.blob === "string";
	const source = fact ? void 0 : asOptionalRecord(media.source);
	const projectedSource = source ? { ...source } : void 0;
	const records = [media, ...projectedSource ? [projectedSource] : []];
	if (projectedSource) media.source = projectedSource;
	const privateFields = fact ? MEDIA_FACT_PRIVATE_FIELDS : MEDIA_PRIVATE_FIELDS;
	const referenceFields = fact ? ["path", "url"] : MEDIA_REFERENCE_FIELDS;
	const sourceIsReference = !source && (!fact || typeof media.source !== "string" || /^(?:[a-z][a-z0-9+.-]*:|~?[\\/])|[\\/]/iu.test(media.source));
	let encodedPayload;
	for (const record of records) {
		let omitted = false;
		const payload = typeof record.data === "string" ? record.data : record.blob;
		if (encodedPayload === void 0 && typeof payload === "string") encodedPayload = payload;
		for (const field of privateFields) {
			if (!Object.hasOwn(record, field)) continue;
			delete record[field];
			omitted = true;
		}
		const recordReferences = record === media && sourceIsReference ? [...referenceFields, "source"] : referenceFields;
		for (const field of recordReferences) {
			if (!Object.hasOwn(record, field)) continue;
			const projected = (fact ? buildInboundMediaUriFromPath(String(record[field])) : void 0) ?? projectChatHistoryMediaReference(record[field]);
			record[field] = projected;
			if (projected === void 0) {
				delete record[field];
				omitted = true;
			}
		}
		if (!fact && omitted) {
			if (record === media || media.type !== "image") record.omitted = true;
			if (record === media || media.type !== "audio") media.omitted = true;
		}
	}
	if (!fact && encodedPayload !== void 0) (media.type === "audio" && !hasTopLevelPayload && projectedSource ? projectedSource : media).bytes = estimateBase64DecodedBytes(encodedPayload);
	return true;
}
function projectChatHistoryMediaFacts(value) {
	return Array.isArray(value) ? value.map((fact) => {
		const projected = { ...asOptionalRecord(fact) };
		projectChatHistoryMediaBlock(projected, true);
		return projected;
	}) : void 0;
}
function sanitizeChatHistoryContentBlock(block, opts) {
	if (!block || typeof block !== "object") return {
		block,
		changed: false,
		truncated: false
	};
	const entry = { ...block };
	let changed = false;
	let truncated = false;
	const preserveExactToolPayload = opts?.preserveExactToolPayload === true || isToolHistoryBlockType(entry.type);
	const maxChars = opts?.maxChars ?? 8e3;
	if (isToolResultHistoryBlockType(entry.type) && "details" in entry) {
		const projectedDetails = projectToolResultDetails(entry.details, maxChars);
		if (projectedDetails.details) entry.details = projectedDetails.details;
		else delete entry.details;
		changed = true;
		truncated ||= projectedDetails.truncated;
	}
	if (typeof entry.text === "string") {
		if (!preserveExactToolPayload) {
			const res = truncateChatHistoryText(entry.text, maxChars);
			entry.text = res.text;
			changed ||= res.truncated;
			truncated ||= res.truncated;
		}
	}
	if (typeof entry.content === "string") {
		if (!preserveExactToolPayload) {
			const res = truncateChatHistoryText(entry.content, maxChars);
			entry.content = res.text;
			changed ||= res.truncated;
			truncated ||= res.truncated;
		}
	}
	if (typeof entry.partialJson === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.partialJson, maxChars);
		entry.partialJson = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (typeof entry.arguments === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.arguments, maxChars);
		entry.arguments = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if (typeof entry.thinking === "string") {
		const res = truncateChatHistoryText(entry.thinking, maxChars);
		entry.thinking = res.text;
		changed ||= res.truncated;
		truncated ||= res.truncated;
	}
	if ("thinkingSignature" in entry) {
		delete entry.thinkingSignature;
		changed = true;
	}
	if ("openclawReasoningReplay" in entry) {
		delete entry.openclawReasoningReplay;
		changed = true;
	}
	const mediaChanged = projectChatHistoryMediaBlock(entry);
	changed ||= mediaChanged;
	return {
		block: changed ? entry : block,
		changed,
		truncated
	};
}
function sanitizeAssistantPhasedContentBlocks(content) {
	if (!content.some((block) => {
		if (!block || typeof block !== "object") return false;
		const entry = block;
		return isAssistantTextContentType(entry.type) && parseAssistantTextSignature(entry)?.phase;
	})) return {
		content,
		changed: false
	};
	const filtered = content.filter((block) => {
		if (!block || typeof block !== "object") return true;
		const entry = block;
		if (!isAssistantTextContentType(entry.type)) return true;
		return parseAssistantTextSignature(entry)?.phase === "final_answer";
	});
	return {
		content: filtered,
		changed: filtered.length !== content.length
	};
}
function projectAssistantMixedToolContent(content, maxChars) {
	if (!content.some((block) => {
		if (!block || typeof block !== "object") return false;
		return isToolHistoryBlockType(block.type);
	})) return null;
	let hasVisibleText = false;
	const projectedContent = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const entry = block;
		if (!isAssistantTextContentType(entry.type)) {
			projectedContent.push(block);
			continue;
		}
		if (parseAssistantTextSignature(entry)?.phase === "commentary") continue;
		if (typeof entry.text !== "string" || !entry.text.trim()) continue;
		const truncated = truncateChatHistoryText(entry.text, maxChars);
		if (truncated.text.trim()) {
			projectedContent.push({
				type: "text",
				text: truncated.text
			});
			hasVisibleText = true;
		}
	}
	return hasVisibleText ? {
		content: projectedContent,
		changed: true
	} : null;
}
function projectAssistantCommentaryFallbacks(message, maxChars) {
	if (!message || typeof message !== "object") return [];
	const entry = asOptionalRecord(message);
	if (!entry || entry.role !== "assistant" || !Array.isArray(entry.content) || entry.stopReason === "error" || typeof entry.errorMessage === "string") return [];
	const transcriptMeta = asOptionalRecord(entry["__openclaw"]);
	return entry.content.flatMap((block) => {
		const content = asOptionalRecord(block);
		if (!content) return [];
		const signature = parseAssistantTextSignature(content);
		const text = typeof content.text === "string" ? content.text : "";
		const itemId = signature?.id?.trim();
		if (!isAssistantTextContentType(content.type) || signature?.phase !== "commentary" || !itemId || !text.trim()) return [];
		const projected = truncateChatHistoryText(text, maxChars);
		const projectedMeta = projected.truncated ? {
			...transcriptMeta,
			truncated: true,
			reason: typeof transcriptMeta?.reason === "string" ? transcriptMeta.reason : "display-cap"
		} : transcriptMeta ? { ...transcriptMeta } : void 0;
		return [{
			role: "assistant",
			content: [{
				type: "text",
				text: projected.text
			}],
			...typeof entry.timestamp === "number" ? { timestamp: entry.timestamp } : {},
			openclawStreamFallback: {
				replacementText: projected.text,
				source: "segment",
				itemId
			},
			...projectedMeta ? { __openclaw: projectedMeta } : {}
		}];
	});
}
function sanitizeCost(raw) {
	if (!raw || typeof raw !== "object") return;
	const c = raw;
	const out = {};
	for (const key of [
		"input",
		"output",
		"cacheRead",
		"cacheWrite",
		"total"
	]) {
		const value = asFiniteNumber(c[key]);
		if (value !== void 0) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : void 0;
}
function sanitizeUsage(raw) {
	if (!raw || typeof raw !== "object") return;
	const u = raw;
	const out = {};
	for (const k of [
		"input",
		"output",
		"total",
		"totalTokens",
		"inputTokens",
		"outputTokens",
		"promptTokens",
		"completionTokens",
		"cacheRead",
		"cacheWrite",
		"cache_read_input_tokens",
		"cache_creation_input_tokens",
		"input_tokens",
		"output_tokens",
		"prompt_tokens",
		"completion_tokens",
		"total_tokens"
	]) {
		const n = asFiniteNumber(u[k]);
		if (n !== void 0) out[k] = n;
	}
	if ("cost" in u && u.cost != null && typeof u.cost === "object") {
		const sanitizedCost = sanitizeCost(u.cost);
		if (sanitizedCost) out.cost = sanitizedCost;
	}
	return Object.keys(out).length > 0 ? out : void 0;
}
function projectWorkspaceConflictDetails(entry) {
	if (entry.role !== "custom" || entry.customType !== "cloud-workspace-conflict") return;
	const details = asOptionalRecord(entry.details);
	if (!details || !Array.isArray(details.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef) || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length)) return;
	try {
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	} catch {
		return;
	}
}
function sanitizeChatHistoryMessage(message, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS) {
	if (!message || typeof message !== "object") return {
		message,
		changed: false
	};
	const entry = { ...message };
	let changed = false;
	let truncated = false;
	if ("providerReplay" in entry) {
		delete entry.providerReplay;
		changed = true;
	}
	const openClawMeta = asOptionalRecord(entry["__openclaw"]);
	if (openClawMeta && ("upstreamUserText" in openClawMeta || "media" in openClawMeta)) {
		const projectedMeta = { ...openClawMeta };
		delete projectedMeta.upstreamUserText;
		if ("media" in projectedMeta) {
			projectedMeta.media = projectChatHistoryMediaFacts(projectedMeta.media);
			if (projectedMeta.media === void 0) delete projectedMeta.media;
		}
		if (Object.keys(projectedMeta).length > 0) entry["__openclaw"] = projectedMeta;
		else delete entry["__openclaw"];
		changed = true;
	}
	const role = typeof entry.role === "string" ? entry.role.toLowerCase() : "";
	const preserveExactToolPayload = role === "toolresult" || role === "tool_result" || role === "tool" || role === "function" || typeof entry.toolName === "string" || typeof entry.tool_name === "string" || typeof entry.toolCallId === "string" || typeof entry.tool_call_id === "string";
	if ("details" in entry) {
		const conflictDetails = projectWorkspaceConflictDetails(entry);
		const toolResultDetails = !conflictDetails && messageHasToolResultShape(entry) ? projectToolResultDetails(entry.details, maxChars) : void 0;
		const projectedDetails = conflictDetails ?? toolResultDetails?.details;
		if (projectedDetails) entry.details = projectedDetails;
		else delete entry.details;
		changed = true;
		truncated ||= toolResultDetails?.truncated === true;
	}
	if (entry.role !== "assistant") {
		if ("usage" in entry) {
			delete entry.usage;
			changed = true;
		}
		if ("cost" in entry) {
			delete entry.cost;
			changed = true;
		}
	} else {
		if ("usage" in entry) {
			const sanitized = sanitizeUsage(entry.usage);
			if (sanitized) entry.usage = sanitized;
			else delete entry.usage;
			changed = true;
		}
		if ("cost" in entry) {
			const sanitized = sanitizeCost(entry.cost);
			if (sanitized) entry.cost = sanitized;
			else delete entry.cost;
			changed = true;
		}
	}
	const stripAssistantControlTokens = role === "assistant" && !shouldPreserveAssistantControlReplyText(entry);
	if (typeof entry.content === "string") {
		const controlStripped = stripAssistantControlTokens ? stripSuppressedControlReplyToken(entry.content) : entry.content;
		changed ||= controlStripped !== entry.content;
		if (preserveExactToolPayload) entry.content = controlStripped;
		else {
			const res = truncateChatHistoryText(controlStripped, maxChars);
			entry.content = res.text;
			changed ||= res.truncated;
			truncated ||= res.truncated;
		}
	} else if (Array.isArray(entry.content)) {
		const updated = entry.content.map((block) => {
			const sanitized = sanitizeChatHistoryContentBlock(block, {
				preserveExactToolPayload,
				maxChars
			});
			if (!stripAssistantControlTokens || !sanitized.block || typeof sanitized.block !== "object" || Array.isArray(sanitized.block)) return sanitized;
			const contentBlock = sanitized.block;
			if (!isAssistantTextContentType(contentBlock.type) || typeof contentBlock.text !== "string") return sanitized;
			const text = stripSuppressedControlReplyToken(contentBlock.text);
			return text === contentBlock.text ? sanitized : {
				block: {
					...contentBlock,
					text
				},
				changed: true,
				truncated: sanitized.truncated
			};
		});
		if (updated.some((item) => item.changed)) {
			entry.content = updated.map((item) => item.block);
			changed = true;
		}
		truncated ||= updated.some((item) => item.truncated);
		if (entry.role === "assistant" && Array.isArray(entry.content)) {
			const mixedToolContent = projectAssistantMixedToolContent(entry.content, maxChars);
			if (mixedToolContent) {
				entry.content = mixedToolContent.content;
				if (entry.phase === "commentary") delete entry.phase;
				changed = true;
			} else {
				const sanitizedPhases = sanitizeAssistantPhasedContentBlocks(entry.content);
				if (sanitizedPhases.changed) {
					entry.content = sanitizedPhases.content;
					changed = true;
				}
			}
		}
	}
	if (typeof entry.text === "string") {
		const controlStripped = stripAssistantControlTokens ? stripSuppressedControlReplyToken(entry.text) : entry.text;
		changed ||= controlStripped !== entry.text;
		if (preserveExactToolPayload) entry.text = controlStripped;
		else {
			const res = truncateChatHistoryText(controlStripped, maxChars);
			entry.text = res.text;
			changed ||= res.truncated;
			truncated ||= res.truncated;
		}
	}
	if (truncated) {
		const meta = asOptionalRecord(entry["__openclaw"]);
		entry["__openclaw"] = {
			...meta,
			truncated: true,
			reason: typeof meta?.reason === "string" ? meta.reason : "display-cap"
		};
		changed = true;
	}
	return {
		message: changed ? entry : message,
		changed
	};
}
function hasAssistantMixedToolVisibleText(message) {
	if (!message || typeof message !== "object") return false;
	const content = message.content;
	if (!Array.isArray(content)) return false;
	let hasToolHistoryBlock = false;
	let hasText = false;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const entry = block;
		if (isToolHistoryBlockType(entry.type)) hasToolHistoryBlock = true;
		if (isAssistantTextContentType(entry.type) && typeof entry.text === "string" && entry.text.trim()) hasText = true;
	}
	return hasToolHistoryBlock && hasText;
}
function shouldDropAssistantHistoryMessage(message) {
	if (!message || typeof message !== "object") return false;
	const entry = message;
	if (entry.role !== "assistant") return false;
	if (isProjectedSessionsSendForwardedMessage(entry)) return false;
	if (resolveAssistantMessagePhase(message) === "commentary") return !hasAssistantMixedToolVisibleText(message);
	const text = extractAssistantTextForSilentCheck(message);
	if (text === void 0 || !isSuppressedControlReplyText(text)) return false;
	return !hasAssistantDisplayableNonTextContent(message);
}
function sanitizeChatHistoryMessages(messages, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, opts) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = [];
	for (const message of messages) {
		if (opts?.includeCommentaryFallbacks === true) for (const commentary of projectAssistantCommentaryFallbacks(message, maxChars)) {
			const projected = sanitizeChatHistoryMessage(commentary, maxChars);
			next.push(projected.message);
			changed = true;
		}
		if (shouldDropAssistantHistoryMessage(message)) {
			changed = true;
			continue;
		}
		const res = sanitizeChatHistoryMessage(message, maxChars);
		changed ||= res.changed;
		if (shouldDropAssistantHistoryMessage(res.message)) {
			changed = true;
			continue;
		}
		next.push(res.message);
	}
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/chat-display-projection.core.ts
function projectCurrentUserProfileAvatars(messages, resolveDisplay) {
	if (!resolveDisplay) return messages;
	const displayBySenderId = /* @__PURE__ */ new Map();
	let changed = false;
	const projected = messages.map((message) => {
		if (message.role !== "user") return message;
		const metadata = asOptionalRecord(message["__openclaw"]);
		if (!metadata) return message;
		const senderId = metadata.senderId;
		if (typeof senderId !== "string" || !senderId) return message;
		let display = displayBySenderId.get(senderId);
		if (!display) {
			display = resolveDisplay(senderId);
			displayBySenderId.set(senderId, display);
		}
		if (display.kind === "unresolved") return message;
		if (metadata.senderProfileAvatarUrl === display.avatarUrl) return message;
		changed = true;
		return {
			...message,
			__openclaw: {
				...metadata,
				senderProfileAvatarUrl: display.avatarUrl
			}
		};
	});
	return changed ? projected : messages;
}
const GATEWAY_ASSISTANT_ERROR_FALLBACK_TEXT = "The agent run failed before producing a reply.";
const GATEWAY_ASSISTANT_CONTEXT_OVERFLOW_FALLBACK_TEXT = "Context overflow: this conversation is too large for the model. Try /compact, use /new to start a fresh session, or retry the command with a tighter output limit.";
function isContextOverflowErrorSignal(value) {
	if (typeof value !== "string") return false;
	return normalizeLowercaseStringOrEmpty(value) === "context_overflow" || isContextOverflowError(value);
}
function isContextOverflowAssistantError(message) {
	return isContextOverflowErrorSignal(message.errorCode) || isContextOverflowErrorSignal(message.errorType) || isContextOverflowErrorSignal(message.errorMessage);
}
function getAssistantErrorFallbackText(message) {
	return isContextOverflowAssistantError(message) ? GATEWAY_ASSISTANT_CONTEXT_OVERFLOW_FALLBACK_TEXT : GATEWAY_ASSISTANT_ERROR_FALLBACK_TEXT;
}
function sanitizeAssistantErrorDisplayMessage(message) {
	const { content, ...envelope } = message;
	const next = sanitizeChatHistoryMessage(envelope, Number.MAX_SAFE_INTEGER).message;
	if (Array.isArray(content)) {
		let firstTextBlock = true;
		next.content = content.flatMap((block) => {
			const sanitized = sanitizeChatHistoryContentBlock(block, { maxChars: Number.MAX_SAFE_INTEGER }).block;
			if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) return [sanitized];
			const entry = sanitized;
			if (entry.type === "thinking" || entry.type === "reasoning" || entry.type === "redacted_thinking") return [];
			if (!firstTextBlock || !isAssistantTextContentType(entry.type)) return [sanitized];
			firstTextBlock = false;
			if (typeof entry.text !== "string" || !entry.text.startsWith("[assistant turn failed before producing content]")) return [sanitized];
			const replyText = entry.text.slice(STREAM_ERROR_FALLBACK_TEXT.length);
			return replyText ? [{
				...entry,
				text: replyText
			}] : [];
		});
	} else next.content = typeof content === "string" && content.startsWith("[assistant turn failed before producing content]") ? content.slice(STREAM_ERROR_FALLBACK_TEXT.length) : content;
	if (typeof next.text === "string" && next.text.startsWith("[assistant turn failed before producing content]")) next.text = next.text.slice(STREAM_ERROR_FALLBACK_TEXT.length);
	delete next.diagnostics;
	delete next.errorBody;
	delete next.errorCode;
	delete next.errorMessage;
	delete next.errorType;
	return next;
}
function isPureStreamErrorFallbackAssistantMessage(message) {
	if (message.role !== "assistant" || message.stopReason !== "error") return false;
	const text = extractAssistantTextForSilentCheck(message);
	return text !== void 0 && text.trim() === "[assistant turn failed before producing content]" && !hasAssistantNonTextContent(message);
}
function hasVisibleAssistantDisplayContent(message) {
	if (message.role !== "assistant" || message.display === false || isPureStreamErrorFallbackAssistantMessage(message)) return false;
	const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
	if (shouldDropAssistantHistoryMessage(sanitized)) return false;
	if (hasAssistantDisplayableNonTextContent(sanitized)) return true;
	const text = extractAssistantTextForSilentCheck(sanitized);
	return Boolean(text?.trim()) && !isSuppressedControlReplyText(text ?? "");
}
function projectRepairedStreamErrorFallbackMessages(messages, initialPending = false) {
	let pending = initialPending;
	let repaired = false;
	let changed = false;
	let pendingIndexes = [];
	const repairedIndexes = /* @__PURE__ */ new Set();
	for (let index = 0; index < messages.length; index++) {
		const message = messages[index];
		if (!message) continue;
		if (message.role === "user") {
			pending = false;
			pendingIndexes = [];
			continue;
		}
		if (isPureStreamErrorFallbackAssistantMessage(message)) {
			pending = true;
			pendingIndexes.push(index);
			continue;
		}
		if (!pending || !hasVisibleAssistantDisplayContent(message)) continue;
		repaired = true;
		pending = false;
		if (pendingIndexes.length > 0) {
			changed = true;
			for (const pendingIndex of pendingIndexes) repairedIndexes.add(pendingIndex);
			pendingIndexes = [];
		}
	}
	return {
		messages: changed ? messages.filter((_, index) => !repairedIndexes.has(index)) : messages,
		pending,
		repaired
	};
}
function projectEmptyAssistantErrorMessages(messages) {
	let changed = false;
	const projected = messages.map((message) => {
		if (message.role !== "assistant" || message.stopReason !== "error") return message;
		if (hasAssistantDisplayableNonTextContent(message)) {
			changed = true;
			return sanitizeAssistantErrorDisplayMessage(message);
		}
		const sanitized = sanitizeChatHistoryMessage(message, Number.MAX_SAFE_INTEGER).message;
		const visibleTexts = [];
		if (typeof sanitized.content === "string") visibleTexts.push(sanitized.content);
		else if (Array.isArray(sanitized.content)) for (const block of sanitized.content) {
			if (!block || typeof block !== "object" || Array.isArray(block)) continue;
			const entry = block;
			if (isAssistantTextContentType(entry.type) && typeof entry.text === "string") visibleTexts.push(entry.text);
		}
		if (typeof sanitized.text === "string") visibleTexts.push(sanitized.text);
		const hasVisibleReplyText = visibleTexts.map((text) => text.trim()).filter(Boolean).some((text) => text !== "[assistant turn failed before producing content]" && !isSuppressedControlReplyText(text));
		if (!shouldDropAssistantHistoryMessage(sanitized) && hasVisibleReplyText) {
			changed = true;
			return sanitizeAssistantErrorDisplayMessage(message);
		}
		changed = true;
		const next = {
			...sanitized,
			content: [{
				type: "text",
				text: getAssistantErrorFallbackText(message)
			}]
		};
		delete next.diagnostics;
		delete next.errorBody;
		delete next.errorCode;
		delete next.errorMessage;
		delete next.errorType;
		delete next.phase;
		delete next.text;
		return next;
	});
	return changed ? projected : messages;
}
function projectChatDisplayMessagesWithState(messages, options) {
	const repairedStreamErrors = projectRepairedStreamErrorFallbackMessages(toProjectedMessages(mirrorMessageToolVisibleReplies(options?.stripEnvelope === false ? messages : stripEnvelopeFromMessages(messages))), options?.streamErrorFallbackPending);
	const filtered = filterVisibleProjectedHistoryMessages(projectSessionsSendInterSessionMessages(toProjectedMessages(sanitizeChatHistoryMessages(projectEmptyAssistantErrorMessages(repairedStreamErrors.messages), Number.MAX_SAFE_INTEGER, { includeCommentaryFallbacks: options?.includeCommentaryFallbacks }))), options?.turnBoundaryPending);
	return {
		messages: projectCurrentUserProfileAvatars(sanitizeChatHistoryMessages(mergeTtsSupplementMessages(filtered.messages), options?.maxChars ?? 8e3), options?.resolveCurrentUserProfileDisplay),
		turnBoundaryPending: filtered.turnBoundaryPending,
		streamErrorFallbackPending: repairedStreamErrors.pending,
		streamErrorFallbackRepaired: repairedStreamErrors.repaired
	};
}
function projectChatDisplayMessages(messages, options) {
	return projectChatDisplayMessagesWithState(messages, options).messages;
}
function projectChatDisplayMessage(message, options) {
	return projectChatDisplayMessages([message], options)[0];
}
//#endregion
//#region src/gateway/current-user-profile-display.ts
function resolveCurrentUserProfileDisplay(senderId) {
	try {
		const profile = getUserProfileDisplay(senderId);
		const label = normalizeOptionalString(profile.displayName);
		return {
			kind: "resolved",
			profileId: profile.id,
			...label ? { label } : {},
			avatarUrl: buildControlUiUserAvatarPath(profile.id, profile.avatarRevision),
			hasUploadedAvatar: profile.hasAvatar
		};
	} catch {
		return { kind: "unresolved" };
	}
}
//#endregion
//#region src/gateway/session-transcript-message.ts
/** Attach OpenClaw metadata to a transcript message without dropping existing metadata. */
function attachOpenClawTranscriptMeta(message, meta) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return message;
	const record = message;
	const existing = record["__openclaw"] && typeof record["__openclaw"] === "object" && !Array.isArray(record["__openclaw"]) ? record["__openclaw"] : {};
	return {
		...record,
		__openclaw: {
			...existing,
			...meta
		}
	};
}
function readTranscriptMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readTranscriptMessageSenderIsOwner(message) {
	const value = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.senderIsOwner;
	return typeof value === "boolean" ? value : void 0;
}
/** Project one transcript message into the exact payload emitted as session.message. */
function projectSessionMessagePayload(params) {
	const idempotencyKey = readTranscriptMessageIdempotencyKey(params.message);
	const senderIsOwner = readTranscriptMessageSenderIsOwner(params.message);
	const rawMessage = attachOpenClawTranscriptMeta(params.message, {
		...params.messageId ? { id: params.messageId } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...params.messageSeq !== void 0 ? { seq: params.messageSeq } : {}
	});
	const projected = params.projectionState ? projectChatDisplayMessagesWithState([rawMessage], {
		resolveCurrentUserProfileDisplay,
		streamErrorFallbackPending: params.projectionState.streamErrorFallbackPending,
		turnBoundaryPending: params.projectionState.turnBoundaryPending
	}) : {
		messages: [projectChatDisplayMessage(rawMessage, { resolveCurrentUserProfileDisplay })],
		streamErrorFallbackPending: false,
		turnBoundaryPending: false
	};
	const projectionState = {
		streamErrorFallbackPending: projected.streamErrorFallbackPending,
		turnBoundaryPending: projected.turnBoundaryPending
	};
	const message = projected.messages[0];
	if (!message) return { projectionState };
	return {
		payload: {
			sessionKey: params.sessionKey,
			...senderIsOwner === void 0 ? {} : { senderIsOwner },
			...params.agentId ? { agentId: params.agentId } : {},
			message,
			...params.messageId ? { messageId: params.messageId } : {},
			...params.messageSeq !== void 0 ? { messageSeq: params.messageSeq } : {},
			...params.sessionSnapshot,
			...params.runId ? { runId: params.runId } : {}
		},
		projectionState
	};
}
/** Project one stored transcript entry onto the client-visible chat history shape. */
function projectTranscriptEntryMessage(entry, seq) {
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
	const record = entry;
	if (record.message) {
		const recordTimestampMs = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : typeof record.timestamp === "number" ? record.timestamp : NaN;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(record.message);
		return attachOpenClawTranscriptMeta(record.message, {
			...typeof record.id === "string" ? { id: record.id } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			...Number.isFinite(recordTimestampMs) ? { recordTimestampMs } : {},
			seq
		});
	}
	if (record.type !== "compaction" && record.type !== "reset") return null;
	const kind = record.type;
	const parsedTimestamp = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
	return {
		role: "system",
		content: [{
			type: "text",
			text: kind === "compaction" ? "Compaction" : "Reset"
		}],
		timestamp: Number.isFinite(parsedTimestamp) ? parsedTimestamp : Date.now(),
		__openclaw: {
			kind,
			id: typeof record.id === "string" ? record.id : void 0,
			seq
		}
	};
}
//#endregion
//#region src/gateway/session-utils.fs.ts
const RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
const transcriptIndexes = /* @__PURE__ */ new Map();
const MAX_TRANSCRIPT_INDEXES = 256;
function normalizeRecentSessionReadOptions(opts) {
	const maxMessages = resolveNonNegativeIntegerOption(opts?.maxMessages, 0);
	return {
		maxMessages,
		maxBytes: resolveIntegerOption(opts?.maxBytes, RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES, { min: 1024 }),
		maxLines: resolveIntegerOption(opts?.maxLines, maxMessages * 20 + 20, { min: maxMessages })
	};
}
async function readRecentTranscriptTailLinesAsync(filePath, stat, opts) {
	const { maxBytes, maxLines } = normalizeRecentSessionReadOptions(opts);
	const readLen = Math.min(stat.size, maxBytes);
	const readStart = Math.max(0, stat.size - readLen);
	const handle = await fs.promises.open(filePath, "r");
	try {
		const buffer = Buffer.alloc(readLen);
		const bytesRead = await readFileWindowFully(handle, buffer, readStart);
		if (bytesRead <= 0) return [];
		return buffer.toString("utf-8", 0, bytesRead).split(/\r?\n/).slice(readStart > 0 ? 1 : 0).filter((line) => line.trim().length > 0).slice(-maxLines);
	} finally {
		await handle.close();
	}
}
const MAX_TRANSCRIPT_PARSE_LINE_BYTES = 256 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS = 64 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS = 64 * 1024;
const MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES = 32;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER = "[chat.history omitted: message too large]";
function isOversizedTranscriptLine(line) {
	return Buffer.byteLength(line, "utf8") > MAX_TRANSCRIPT_PARSE_LINE_BYTES;
}
function isJsonObjectFieldToken(source, tokenIndex) {
	for (let index = tokenIndex - 1; index >= 0; index--) {
		const char = source.charAt(index);
		if (/\s/.test(char)) continue;
		return char === "{" || char === ",";
	}
	return true;
}
function extractJsonStringFieldWindow(source, field, startIndex = 0, endIndex = source.length) {
	const fieldToken = JSON.stringify(field);
	let searchIndex = startIndex;
	while (searchIndex < endIndex) {
		const tokenIndex = source.indexOf(fieldToken, searchIndex);
		if (tokenIndex < 0 || tokenIndex >= endIndex) return;
		searchIndex = tokenIndex + fieldToken.length;
		if (!isJsonObjectFieldToken(source, tokenIndex)) continue;
		const match = /^\s*:\s*"((?:\\.|[^"\\])*)"/.exec(source.slice(searchIndex, endIndex));
		if (!match) continue;
		try {
			return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
		} catch {
			return;
		}
	}
}
function extractJsonStringFieldSuffix(source, field) {
	return extractJsonStringFieldWindow(source, field, Math.max(0, source.length - OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS));
}
function recoverOversizedMultimodalTranscriptRecord(line) {
	const markerPrefix = "__openclaw_omitted_image_";
	if (line.includes(markerPrefix)) return;
	const payloads = [];
	const dataPattern = /"data"\s*:\s*"/g;
	let scannedCandidates = 0;
	for (let dataMatch = dataPattern.exec(line); dataMatch; dataMatch = dataPattern.exec(line)) {
		if (!isJsonObjectFieldToken(line, dataMatch.index)) continue;
		if (++scannedCandidates > MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES) return;
		const start = dataMatch.index + dataMatch[0].length;
		let end = start;
		let padding = 0;
		let valid = true;
		for (; end < line.length && line.charCodeAt(end) !== 34; end++) {
			const code = line.charCodeAt(end);
			if (code === 92) {
				valid = false;
				end++;
				continue;
			}
			if (!valid) continue;
			if (code === 61) {
				if (++padding > 2) valid = false;
			} else if (padding > 0 || ((code | 32) < 97 || (code | 32) > 122) && (code < 48 || code > 57) && code !== 43 && code !== 47) valid = false;
		}
		if (end >= line.length) return;
		dataPattern.lastIndex = end + 1;
		if (!valid || (end - start) % 4 !== 0) continue;
		payloads.push({
			start,
			end,
			marker: `${markerPrefix}${payloads.length}__`,
			bytes: (end - start) * 3 / 4 - padding
		});
	}
	if (payloads.length === 0) return;
	try {
		const parseBoundedRedaction = (selected) => {
			const bytes = selected.reduce((remaining, payload) => remaining - (payload.end - payload.start - payload.marker.length), Buffer.byteLength(line, "utf8"));
			if (selected.length === 0 || bytes > MAX_TRANSCRIPT_PARSE_LINE_BYTES) return;
			let cursor = 0;
			const parts = [];
			for (const payload of selected) {
				parts.push(line.slice(cursor, payload.start), payload.marker);
				cursor = payload.end;
			}
			parts.push(line.slice(cursor));
			const markers = new Set(selected.map((payload) => payload.marker));
			const parsed = JSON.parse(parts.join(""), (_key, value) => {
				if (typeof value === "string" && value.startsWith(markerPrefix) && !markers.delete(value)) throw new Error("invalid transcript image recovery marker");
				return value;
			});
			if (markers.size > 0 || !parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
			return parsed;
		};
		const imageDataOwners = (block) => {
			const source = block.source;
			return source && typeof source === "object" && source.type === "base64" ? [block, source] : [block];
		};
		const previewContent = (parseBoundedRedaction(payloads)?.message)?.content;
		if (!Array.isArray(previewContent)) return;
		const payloadByMarker = new Map(payloads.map((payload) => [payload.marker, payload]));
		const imageMarkers = /* @__PURE__ */ new Set();
		for (const candidate of previewContent) {
			if (!candidate || typeof candidate !== "object" || candidate.type !== "image") continue;
			for (const owner of imageDataOwners(candidate)) {
				if (typeof owner.data !== "string") continue;
				if (!payloadByMarker.has(owner.data) || imageMarkers.has(owner.data)) return;
				imageMarkers.add(owner.data);
			}
		}
		if (imageMarkers.size === 0) return;
		const imagePayloads = payloads.filter((payload) => imageMarkers.has(payload.marker));
		const record = parseBoundedRedaction(imagePayloads);
		const content = (record?.message)?.content;
		if (!record || !Array.isArray(content)) return;
		const remaining = new Map(imagePayloads.map((payload) => [payload.marker, payload]));
		for (const candidate of content) {
			if (!candidate || typeof candidate !== "object" || candidate.type !== "image") continue;
			const block = candidate;
			let imageBytes;
			for (const owner of imageDataOwners(block)) {
				if (typeof owner.data !== "string") continue;
				const payload = remaining.get(owner.data);
				if (!payload) return;
				remaining.delete(payload.marker);
				imageBytes ??= payload.bytes;
				delete owner.data;
			}
			if (imageBytes !== void 0) {
				block.omitted = true;
				block.bytes = imageBytes;
			}
		}
		return remaining.size === 0 && jsonUtf8Bytes(record) <= MAX_TRANSCRIPT_PARSE_LINE_BYTES ? record : void 0;
	} catch {
		return;
	}
}
function parseTranscriptRecord(line) {
	const oversized = isOversizedTranscriptLine(line);
	const recoveredRecord = oversized ? recoverOversizedMultimodalTranscriptRecord(line) : void 0;
	if (!oversized || recoveredRecord) try {
		const parsed = recoveredRecord ?? JSON.parse(line);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		const record = parsed;
		const id = readNonBlankStringPreservingWhitespace(record.id);
		return {
			byteLength: Buffer.byteLength(line, "utf8"),
			...id ? { id } : {},
			...recoveredRecord ? { recoveredImageData: true } : {},
			record
		};
	} catch {
		return null;
	}
	const prefix = line.slice(0, OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS);
	const messageMatch = /"message"\s*:/.exec(prefix);
	const recordPrefix = messageMatch ? prefix.slice(0, messageMatch.index) : prefix;
	const id = extractJsonStringFieldPrefix(prefix, "id");
	const parentId = extractJsonNullableStringFieldPrefix(prefix, "parentId");
	const type = extractJsonStringFieldPrefix(prefix, "type");
	const timestamp = extractJsonStringFieldPrefix(recordPrefix, "timestamp") ?? extractJsonNumberFieldPrefix(recordPrefix, "timestamp");
	const role = extractJsonStringFieldPrefix(prefix, "role") ?? "assistant";
	const idempotencyKey = extractJsonStringFieldPrefix(prefix, "idempotencyKey") ?? extractJsonStringFieldSuffix(line, "idempotencyKey");
	const record = {
		...type ? { type } : {},
		...id ? { id } : {},
		...parentId !== void 0 ? { parentId } : {},
		...timestamp !== void 0 ? { timestamp } : {},
		message: {
			role,
			...idempotencyKey ? { idempotencyKey } : {},
			content: [{
				type: "text",
				text: TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER
			}],
			__openclaw: {
				truncated: true,
				reason: "oversized"
			}
		}
	};
	return {
		byteLength: Buffer.byteLength(line, "utf8"),
		...id ? { id } : {},
		record
	};
}
function parseRecentTranscriptTailSnapshot(lines, maxMessages) {
	const selected = projectResetBoundary(selectSessionTranscriptActiveEntries({
		entries: lines.flatMap((line) => {
			const entry = parseTranscriptRecord(line);
			return entry ? [entry] : [];
		}),
		recordOf: (entry) => entry.record,
		failClosedOnInvalidLeafControl: true
	}));
	const messages = [];
	for (const entry of selected) {
		const message = projectTranscriptEntryMessage(entry.record, messages.length + 1);
		if (message) messages.push(message);
	}
	return {
		messages: messages.slice(-maxMessages),
		transcriptEvents: selected.map((entry) => entry.record)
	};
}
function isVisibleTranscriptRecord(record) {
	return Boolean(record.message) || record.type === "compaction" || record.type === "reset";
}
function projectResetBoundary(entries) {
	const boundaryIndex = entries.findLastIndex(({ record }) => {
		return record.type === "compaction" || record.type === "reset";
	});
	if (boundaryIndex < 0 || entries[boundaryIndex]?.record.type !== "reset") return entries;
	const firstKeptEntryId = entries[boundaryIndex]?.record.firstKeptEntryId;
	const firstKeptIndex = typeof firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && entry.id === firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter(({ record }) => {
		const role = record.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex)];
}
function toIndexedEntries(entries) {
	const indexed = [];
	for (const entry of entries) if (isVisibleTranscriptRecord(entry.record)) indexed.push({
		...entry,
		seq: indexed.length + 1
	});
	return indexed;
}
async function buildSessionTranscriptIndex(filePath) {
	const records = [];
	const stream = fs.createReadStream(filePath, { encoding: "utf8" });
	const lines = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	try {
		for await (const line of lines) if (line.trim()) {
			const record = parseTranscriptRecord(line);
			if (record) records.push(record);
		}
	} finally {
		lines.close();
		stream.destroy();
	}
	return { entries: toIndexedEntries(projectResetBoundary(selectSessionTranscriptActiveEntries({
		entries: records,
		recordOf: (entry) => entry.record
	}))) };
}
async function readSessionTranscriptIndex(filePath, opts = {}) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) {
		transcriptIndexes.delete(filePath);
		return null;
	}
	const identity = `${stat.mtimeMs}:${stat.size}`;
	let cached = opts.cache === "skip" ? void 0 : transcriptIndexes.get(filePath);
	if (cached?.identity === identity) {
		transcriptIndexes.delete(filePath);
		transcriptIndexes.set(filePath, cached);
	}
	if (cached?.identity !== identity) {
		cached = {
			identity,
			value: buildSessionTranscriptIndex(filePath)
		};
		if (opts.cache !== "skip") {
			transcriptIndexes.delete(filePath);
			transcriptIndexes.set(filePath, cached);
			pruneMapToMaxSize(transcriptIndexes, MAX_TRANSCRIPT_INDEXES);
		}
	}
	let index;
	try {
		index = await cached.value;
	} catch (error) {
		if (transcriptIndexes.get(filePath) === cached) transcriptIndexes.delete(filePath);
		throw error;
	}
	return index;
}
function findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId) {
	return resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((value) => fs.existsSync(value)) ?? null;
}
/** Single owner for bounded reads of live JSONL artifacts and cold reset archives. */
var ArchivedTranscriptReader = class {
	constructor(scope) {
		this.scope = scope;
	}
	async resolvePath(opts) {
		return (await this.resolveArtifact(opts))?.path ?? null;
	}
	activePath() {
		return findExistingTranscriptPath(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
	}
	async resolveArtifact(opts) {
		if (opts.resetArchiveOnly !== true) {
			const activePath = this.activePath();
			if (activePath) return {
				path: activePath,
				source: "active"
			};
		}
		if (opts.allowResetArchiveFallback !== true) return null;
		const archives = await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
		for (const archivePath of archives) {
			if (!(await fs.promises.stat(archivePath).catch(() => null))?.isFile()) continue;
			if (opts.resetArchiveOnly !== true) {
				const activePath = this.activePath();
				if (activePath) return {
					path: activePath,
					source: "active"
				};
			}
			try {
				return {
					path: materializeSessionArchiveForRead(archivePath),
					source: "reset-archive"
				};
			} catch {
				continue;
			}
		}
		return null;
	}
	async read(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return { messages: [] };
		if (opts.mode === "recent") {
			if (normalizeRecentSessionReadOptions(opts).maxMessages === 0) return { messages: [] };
			return {
				messages: (await readRecentSessionSnapshotFromPathAsync(artifact.path, normalizeRecentSessionReadOptions(opts))).messages,
				transcriptPath: artifact.path
			};
		}
		return {
			messages: (await readSessionTranscriptIndex(artifact.path))?.entries.flatMap(indexedTranscriptEntryToMessages) ?? [],
			transcriptPath: artifact.path
		};
	}
	async readById(messageId, opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			oversized: false,
			found: false
		};
		const entry = (await readSessionTranscriptIndex(artifact.path))?.entries.find((candidate) => candidate.id === messageId);
		if (!entry) return {
			oversized: false,
			found: false
		};
		if (entry.byteLength > MAX_TRANSCRIPT_PARSE_LINE_BYTES && (entry.recoveredImageData !== true || jsonUtf8Bytes(entry.record) > MAX_TRANSCRIPT_PARSE_LINE_BYTES)) return {
			oversized: true,
			found: true,
			seq: entry.seq
		};
		return {
			message: indexedTranscriptEntryToMessage(entry),
			seq: entry.seq,
			oversized: false,
			found: true
		};
	}
	async readRecentWithStats(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			messages: [],
			totalMessages: 0
		};
		const totalMessages = (await readSessionTranscriptIndex(artifact.path))?.entries.length ?? 0;
		const normalized = normalizeRecentSessionReadOptions(opts);
		const snapshot = normalized.maxMessages === 0 ? {
			messages: [],
			transcriptEvents: []
		} : await readRecentSessionSnapshotFromPathAsync(artifact.path, normalized);
		const firstSeq = Math.max(1, totalMessages - snapshot.messages.length + 1);
		return {
			messages: snapshot.messages.map((message, index) => attachOpenClawTranscriptMeta(message, { seq: firstSeq + index })),
			transcriptEvents: snapshot.transcriptEvents,
			totalMessages,
			transcriptPath: artifact.path,
			transcriptSource: artifact.source
		};
	}
	async readPage(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			messages: [],
			totalMessages: 0
		};
		const index = await readSessionTranscriptIndex(artifact.path);
		if (!index) return {
			messages: [],
			totalMessages: 0,
			transcriptPath: artifact.path
		};
		const totalMessages = index.entries.length;
		const offset = Math.min(resolveNonNegativeIntegerOption(opts.offset, 0), totalMessages);
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - resolveNonNegativeIntegerOption(opts.maxMessages, 0));
		const entries = index.entries.slice(start, endExclusive);
		return {
			messages: entries.flatMap(indexedTranscriptEntryToMessages),
			transcriptEvents: entries.map((entry) => entry.record),
			totalMessages,
			transcriptPath: artifact.path,
			transcriptSource: artifact.source
		};
	}
	async readAroundId(opts) {
		const artifacts = [];
		if (opts.resetArchiveOnly !== true) {
			const activePath = this.activePath();
			if (activePath) artifacts.push({
				path: activePath,
				source: "active"
			});
		}
		if (opts.allowResetArchiveFallback === true) for (const archivePath of await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId)) try {
			artifacts.push({
				path: materializeSessionArchiveForRead(archivePath),
				source: "reset-archive"
			});
		} catch {}
		let activeTotalMessages = 0;
		for (const artifact of artifacts) {
			const index = await readSessionTranscriptIndex(artifact.path);
			if (!index) continue;
			if (artifact.source === "active") activeTotalMessages = index.entries.length;
			const anchorIndex = index.entries.findIndex((entry) => entry.id === opts.messageId);
			if (anchorIndex < 0) continue;
			const pageSize = Math.max(1, Math.floor(opts.maxMessages));
			const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
			const start = Math.min(Math.max(0, anchorIndex - olderMessages), Math.max(0, index.entries.length - pageSize));
			const endExclusive = Math.min(index.entries.length, start + pageSize);
			const readStart = Math.max(0, start - 1);
			return {
				found: true,
				hasOverreadContext: readStart < start,
				messages: index.entries.slice(readStart, endExclusive).flatMap(indexedTranscriptEntryToMessages),
				offset: index.entries.length - endExclusive,
				totalMessages: index.entries.length,
				transcriptPath: artifact.path,
				transcriptSource: artifact.source
			};
		}
		return {
			found: false,
			hasOverreadContext: false,
			messages: [],
			offset: 0,
			totalMessages: activeTotalMessages
		};
	}
};
async function readRecentSessionSnapshotFromPathAsync(filePath, opts) {
	const { maxMessages } = opts;
	let stat;
	try {
		stat = await fs.promises.stat(filePath);
	} catch {
		return {
			messages: [],
			transcriptEvents: []
		};
	}
	if (stat.size === 0) return {
		messages: [],
		transcriptEvents: []
	};
	return parseRecentTranscriptTailSnapshot(await readRecentTranscriptTailLinesAsync(filePath, stat, { ...opts }), maxMessages);
}
function indexedTranscriptEntryToMessage(entry) {
	return projectTranscriptEntryMessage(entry.record, entry.seq);
}
function indexedTranscriptEntryToMessages(entry) {
	const message = indexedTranscriptEntryToMessage(entry);
	return message ? [message] : [];
}
function capArrayByJsonBytes(items, maxBytes, byteLength = jsonUtf8Bytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map(byteLength);
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= expectDefined(parts[start], "parts entry at start") + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
async function resolveSessionHistoryTranscriptPathAsync(sessionId, storePath, sessionFile, opts) {
	return await new ArchivedTranscriptReader({
		agentId: opts?.agentId,
		sessionFile,
		sessionId,
		storePath
	}).resolvePath({ allowResetArchiveFallback: opts?.allowResetArchiveFallback });
}
async function readLatestSessionUsageFromTranscriptFileAsync(sessionId, storePath, sessionFile, agentId) {
	const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
	if (!filePath) return null;
	try {
		if ((await fs.promises.stat(filePath)).size === 0) return null;
		const messages = [];
		for await (const line of streamSessionTranscriptLines(filePath)) {
			if (isOversizedTranscriptLine(line)) continue;
			try {
				const record = JSON.parse(line);
				if (!record.message || typeof record.message !== "object" || Array.isArray(record.message)) continue;
				const message = record.message;
				const usage = message.usage && typeof message.usage === "object" && !Array.isArray(message.usage) ? message.usage : record.usage;
				messages.push({
					...message,
					...typeof message.provider !== "string" && typeof record.provider === "string" ? { provider: record.provider } : {},
					...typeof message.model !== "string" && typeof record.model === "string" ? { model: record.model } : {},
					...usage && typeof usage === "object" && !Array.isArray(usage) ? { usage } : {}
				});
			} catch {
				continue;
			}
		}
		return aggregateSessionTranscriptUsage(messages, "artifact");
	} catch {
		return null;
	}
}
function buildSessionPreviewItems(messages, maxItems, maxChars) {
	const items = [];
	for (const message of messages) {
		const projected = projectSessionDisplayMessage(message, { maxChars });
		if (!projected) continue;
		items.push(projected);
	}
	if (items.length <= maxItems) return items;
	return items.slice(-maxItems);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-events.ts
function resolveVisibleHistoryProjection(projection) {
	if (projection.state.activeEventCount === projection.state.activeMessageCount) return {
		boundaries: [],
		total: projection.state.activeMessageCount
	};
	const visibleMessages = resolveVisibleMessagePositions(projection);
	const db = getActiveTranscriptKysely(projection.database);
	const rows = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
		"identity.event_id",
		"identity.event_type",
		"identity.seq",
		sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")
	]).select((eb) => eb.selectFrom("session_transcript_active_events as next").select("next.message_position").whereRef("next.session_id", "=", "active.session_id").whereRef("next.active_position", ">", "active.active_position").where("next.message_position", "is not", null).orderBy("next.active_position", "asc").limit(1).as("next_message_position")).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).orderBy("active.active_position", "asc")).rows;
	const latestBoundaryIsReset = rows.at(-1)?.event_type === "reset";
	const visibleRows = latestBoundaryIsReset ? rows.slice(-1) : rows;
	let priorBoundaries = 0;
	const boundaries = visibleRows.map((row) => {
		const messagePosition = latestBoundaryIsReset ? visibleMessages.kept.length : Math.min(row.next_message_position ?? projection.state.activeMessageCount, visibleMessages.total);
		return {
			displayPosition: messagePosition + priorBoundaries++,
			eventId: row.event_id,
			eventSeq: row.seq,
			messagePosition,
			serializedBytes: row.serialized_bytes
		};
	});
	return {
		boundaries,
		total: visibleMessages.total + boundaries.length
	};
}
function resolveVisibleHistoryRange(history, start, endExclusive) {
	const boundedStart = Math.min(Math.max(0, start), history.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), history.total);
	const selectedBoundaries = history.boundaries.filter((boundary) => boundary.displayPosition >= boundedStart && boundary.displayPosition < boundedEnd);
	const boundaries = new Map(selectedBoundaries.map((boundary) => [boundary.displayPosition, boundary]));
	const messageStart = boundedStart - history.boundaries.filter((boundary) => boundary.displayPosition < boundedStart).length;
	return {
		boundedEnd,
		boundedStart,
		boundaries,
		messageEnd: messageStart + boundedEnd - boundedStart - selectedBoundaries.length,
		messageStart
	};
}
function readBoundaryEvents(projection, boundaries) {
	const eventSeqs = Array.from(boundaries, (boundary) => boundary.eventSeq);
	const [firstSeq] = eventSeqs;
	const lastSeq = eventSeqs.at(-1);
	if (firstSeq === void 0 || lastSeq === void 0) return /* @__PURE__ */ new Map();
	const db = getActiveTranscriptKysely(projection.database);
	return new Map(executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["event.seq", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).where("identity.seq", ">=", firstSeq).where("identity.seq", "<=", lastSeq)).rows.map((row) => [row.seq, JSON.parse(row.event_json)]));
}
function readVisibleHistoryRange(projection, start, endExclusive, history = resolveVisibleHistoryProjection(projection)) {
	const { boundedEnd, boundedStart, boundaries, messageEnd, messageStart } = resolveVisibleHistoryRange(history, start, endExclusive);
	if (boundedEnd <= boundedStart) return [];
	const messages = readVisibleMessageRange(projection, messageStart, messageEnd);
	const boundaryEvents = readBoundaryEvents(projection, boundaries.values());
	let messageIndex = 0;
	const events = [];
	for (let displayPosition = boundedStart; displayPosition < boundedEnd; displayPosition += 1) {
		const boundary = boundaries.get(displayPosition);
		if (boundary) {
			const event = boundaryEvents.get(boundary.eventSeq);
			if (event) events.push({
				event,
				seq: displayPosition + 1
			});
			continue;
		}
		const message = messages[messageIndex++];
		if (message) events.push({
			event: message.event,
			seq: displayPosition + 1
		});
	}
	return events;
}
function resolveRecentHistoryStart(projection, start, endExclusive, history, maxBytes, maxMessages) {
	const { boundedEnd, boundedStart, boundaries, messageEnd, messageStart } = resolveVisibleHistoryRange(history, start, endExclusive);
	const positions = resolveVisibleMessagePositionRange(projection, Math.max(messageStart, messageEnd - maxMessages), messageEnd);
	const db = getActiveTranscriptKysely(projection.database);
	const messageBytes = new Map(positions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "in", positions)).rows.flatMap((row) => row.message_position === null ? [] : [[row.message_position, row.serialized_bytes]]));
	let messageIndex = positions.length - 1;
	let selectedStart = boundedEnd;
	let selectedCount = 0;
	let bytes = 0;
	for (let displayPosition = boundedEnd - 1; displayPosition >= boundedStart; displayPosition -= 1) {
		if (selectedCount >= maxMessages) break;
		const boundary = boundaries.get(displayPosition);
		const messagePosition = boundary ? void 0 : positions[messageIndex--];
		const serializedBytes = boundary?.serializedBytes ?? (messagePosition === void 0 ? void 0 : messageBytes.get(messagePosition));
		if (serializedBytes === void 0) continue;
		if (selectedCount > 0 && bytes + serializedBytes > maxBytes) break;
		selectedStart = displayPosition;
		selectedCount += 1;
		bytes += serializedBytes;
	}
	return selectedStart;
}
function readVisibleMessageById(projection, eventId) {
	const db = getActiveTranscriptKysely(projection.database);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", eventId).where("active.message_position", "is not", null));
	if (!row || row.message_position === null) return;
	const visible = resolveVisibleMessagePositions(projection);
	const logicalPosition = row.message_position >= visible.postStart ? visible.kept.length + row.message_position - visible.postStart : visible.kept.indexOf(row.message_position);
	return logicalPosition < 0 ? void 0 : {
		event: JSON.parse(row.event_json),
		seq: logicalPosition + 1
	};
}
function resolveHistoryEventById(projection, eventId, history = resolveVisibleHistoryProjection(projection)) {
	const boundary = history.boundaries.find((candidate) => candidate.eventId === eventId);
	if (boundary) {
		const event = readBoundaryEvents(projection, [boundary]).get(boundary.eventSeq);
		return event ? {
			event,
			seq: boundary.displayPosition + 1
		} : void 0;
	}
	const message = readVisibleMessageById(projection, eventId);
	if (!message) return;
	const messagePosition = message.seq - 1;
	const precedingBoundaries = history.boundaries.filter((candidate) => candidate.messagePosition <= messagePosition).length;
	return {
		event: message.event,
		seq: message.seq + precedingBoundaries
	};
}
function readSessionTranscriptHistoryEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		return readVisibleHistoryRange(projection, 0, history.total, history);
	});
}
function readRecentSessionTranscriptHistoryEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const generation = readTranscriptProjectionGeneration(projection);
		const deltaCursor = generation ? createTranscriptRawDeltaCursor({
			agentId: projection.resolved.agentId,
			generation,
			lastSeq: projection.state.indexedSeq,
			sessionId: projection.resolved.sessionId
		}) : void 0;
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			...deltaCursor ? { deltaCursor } : {},
			events: [],
			totalMessages: history.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8 * 1024 * 1024));
		const selectedStart = resolveRecentHistoryStart(projection, Math.max(0, history.total - maxLines), history.total, history, maxBytes, maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			...deltaCursor ? { deltaCursor } : {},
			events: readVisibleHistoryRange(projection, selectedStart, history.total, history),
			totalMessages: history.total
		};
	});
}
function readSessionTranscriptHistoryEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), history.total);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = Math.max(0, history.total - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleHistoryRange(projection, start, endExclusive, history),
			totalMessages: history.total
		};
	});
}
function readSessionTranscriptHistoryEventCount(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => resolveVisibleHistoryProjection(projection).total);
}
function readSessionTranscriptHistoryEventById(scope, eventId) {
	return withCurrentProjectionSnapshot(scope, (projection) => resolveHistoryEventById(projection, eventId));
}
function readSessionTranscriptHistoryAnchorPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const anchor = resolveHistoryEventById(projection, options.messageId, history);
		if (!anchor) return {
			events: [],
			found: false,
			hasOverreadContext: false,
			offset: 0,
			totalMessages: history.total
		};
		const pageSize = Math.max(1, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 1));
		const anchorPosition = anchor.seq - 1;
		const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
		const latestStart = Math.max(0, history.total - pageSize);
		const start = Math.min(Math.max(0, anchorPosition - olderMessages), latestStart);
		const endExclusive = Math.min(history.total, start + pageSize);
		const readStart = Math.max(0, start - 1);
		return {
			events: readVisibleHistoryRange(projection, readStart, endExclusive, history),
			found: true,
			hasOverreadContext: readStart < start,
			offset: history.total - endExclusive,
			totalMessages: history.total
		};
	});
}
//#endregion
//#region src/gateway/session-transcript-readers.ts
function resolveTranscriptReadTarget(scope) {
	const target = resolveSessionTranscriptReadTarget(scope);
	return {
		agentId: target.agentId,
		sessionFile: target.sessionKey ?? target.sessionId,
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		storePath: target.storePath
	};
}
function toTranscriptReadScope(target) {
	return {
		...target.agentId ? { agentId: target.agentId } : {},
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		...target.storePath ? { storePath: target.storePath } : {}
	};
}
function archivedTranscriptReader(target) {
	return new ArchivedTranscriptReader({
		agentId: target.agentId,
		sessionId: target.sessionId,
		storePath: target.storePath
	});
}
function readTranscriptRecordTimestampMs(event) {
	return parseDateFirstTimestampMs(event.timestamp);
}
function extractMessageRecord(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const record = event;
	if (record.message === void 0) return;
	const recordTimestampMs = readTranscriptRecordTimestampMs(event);
	return {
		...typeof record.id === "string" ? { id: record.id } : {},
		message: record.message,
		...recordTimestampMs !== void 0 ? { recordTimestampMs } : {}
	};
}
function extractMessageRecordsFromEventEntries(entries) {
	return entries.flatMap((entry) => {
		const record = extractMessageRecord(entry.event);
		return record ? [{
			...record,
			seq: entry.seq
		}] : [];
	});
}
function readSqliteMessageRecords(target) {
	return extractMessageRecordsFromEventEntries(readSessionTranscriptMessageEvents(toTranscriptReadScope(target)));
}
function projectSqliteHistoryEvents(entries) {
	return entries.flatMap((entry) => {
		const message = projectTranscriptEntryMessage(entry.event, entry.seq);
		return message ? [message] : [];
	});
}
function readSqliteMessagesSync(target) {
	return readSqliteMessageRecords(target).map(sqliteRecordMessageWithSeq);
}
function normalizeRecentSqliteReadOptions(opts) {
	const maxMessages = Math.max(0, Math.floor(opts?.maxMessages ?? 0));
	const maxBytes = typeof opts?.maxBytes === "number" && Number.isFinite(opts.maxBytes) ? Math.max(1024, Math.floor(opts.maxBytes)) : 8 * 1024 * 1024;
	const defaultMaxLines = maxMessages * 20 + 20;
	return {
		maxMessages,
		maxBytes,
		maxLines: typeof opts?.maxLines === "number" && Number.isFinite(opts.maxLines) ? Math.max(maxMessages, Math.floor(opts.maxLines)) : defaultMaxLines
	};
}
async function readRecentSqliteMessageRecords(target, opts) {
	const normalized = normalizeRecentSqliteReadOptions(opts);
	const page = readRecentSessionTranscriptHistoryEvents(toTranscriptReadScope(target), normalized);
	return {
		...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		...page.deltaCursor ? { deltaCursor: page.deltaCursor } : {},
		messages: projectSqliteHistoryEvents(page.events),
		transcriptEvents: page.events.map((entry) => entry.event),
		totalMessages: page.totalMessages
	};
}
function readRecentSqliteUsageMessages(target, maxBytes) {
	return extractMessageRecordsFromEventEntries(readRecentSessionTranscriptMessageEvents(toTranscriptReadScope(target), {
		maxBytes: Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8 * 1024 * 1024)),
		maxLines: 1e3,
		maxMessages: 1e3
	}).events).map((record) => record.message);
}
function sqliteRecordMessageWithSeq(record) {
	const rawIdempotencyKey = record.message?.idempotencyKey;
	const idempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : void 0;
	return attachOpenClawTranscriptMeta(record.message, {
		...record.id ? { id: record.id } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...record.recordTimestampMs !== void 0 ? { recordTimestampMs: record.recordTimestampMs } : {},
		seq: record.seq
	});
}
function sqliteMessageEventWithSeq(entry) {
	return projectTranscriptEntryMessage(entry.event, entry.seq);
}
function readSqliteAggregateUsageSnapshot(target) {
	return aggregateSessionTranscriptUsage(readSqliteMessagesSync(target));
}
function buildSqlitePreviewItems(target, maxItems, maxChars) {
	const initialMaxEvents = Math.min(256, Math.max(64, Math.ceil(maxItems) * 4));
	const readPreviewPage = (maxEvents, maxBytes) => {
		const page = readRecentSessionTranscriptHistoryEvents(toTranscriptReadScope(target), {
			maxBytes,
			maxLines: maxEvents,
			maxMessages: maxEvents
		});
		return {
			items: buildSessionPreviewItems(extractMessageRecordsFromEventEntries(page.events).map(sqliteRecordMessageWithSeq), maxItems, maxChars),
			hasOlderEvents: page.totalMessages > page.events.length
		};
	};
	const preview = readPreviewPage(initialMaxEvents, 1024 * 1024);
	if (preview.items.length >= maxItems || !preview.hasOlderEvents) return preview.items;
	return readPreviewPage(Math.min(2048, Math.max(1024, initialMaxEvents * 8, Math.ceil(maxItems))), 8 * 1024 * 1024).items;
}
/** Reads display messages asynchronously through the reader seam. */
async function readSessionMessagesAsync(scope, opts) {
	return (await readSessionMessagesWithSourceAsync(scope, opts)).messages;
}
/** Reads display messages with source metadata through the reader seam. */
async function readSessionMessagesWithSourceAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const messages = opts.mode === "recent" ? (await readRecentSqliteMessageRecords(target, opts)).messages : projectSqliteHistoryEvents(readSessionTranscriptHistoryEvents(toTranscriptReadScope(target)));
	if (messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).read({
		...opts,
		resetArchiveOnly: true
	});
	return {
		messages,
		transcriptPath: target.sessionFile
	};
}
/** Finds one display message by transcript id through the reader seam. */
async function readSessionMessageByIdAsync(scope, messageId, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const foundEvent = readSessionTranscriptHistoryEventById(toTranscriptReadScope(target), messageId);
	if (foundEvent) return {
		found: true,
		message: projectTranscriptEntryMessage(foundEvent.event, foundEvent.seq),
		oversized: false,
		seq: foundEvent.seq
	};
	if (opts?.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readById(messageId, {
		...opts,
		resetArchiveOnly: true
	});
	return {
		found: false,
		oversized: false
	};
}
/** Visits display messages asynchronously through the reader seam. */
async function visitSessionMessagesAsync(scope, visit, _opts) {
	const target = resolveTranscriptReadTarget(scope);
	let count = 0;
	for (const record of readSqliteMessageRecords(target)) {
		visit(record.message, record.seq);
		count += 1;
	}
	return count;
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const transcriptScope = toTranscriptReadScope(resolveTranscriptReadTarget(scope));
	try {
		return readSessionTranscriptHistoryEventCount(transcriptScope);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(transcriptScope);
		return readSessionTranscriptHistoryEventCount(transcriptScope);
	}
}
/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const { activeLeafEntryId, deltaCursor, messages, transcriptEvents, totalMessages } = await readRecentSqliteMessageRecords(target, opts);
	if (totalMessages === 0 && messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readRecentWithStats({
		...opts,
		resetArchiveOnly: true
	});
	return {
		...activeLeafEntryId !== void 0 ? { activeLeafEntryId } : {},
		...deltaCursor ? { deltaCursor } : {},
		messages,
		transcriptEvents,
		totalMessages,
		transcriptPath: target.sessionFile,
		transcriptSource: "active"
	};
}
/** Reads one offset page with total-count metadata through the reader seam. */
async function readSessionMessagesPageWithStatsAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const page = readSessionTranscriptHistoryEventPage(toTranscriptReadScope(target), opts);
	if (page.totalMessages === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readPage({
		...opts,
		resetArchiveOnly: true
	});
	return {
		...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		messages: projectSqliteHistoryEvents(page.events),
		transcriptEvents: page.events.map((entry) => entry.event),
		totalMessages: page.totalMessages,
		transcriptPath: target.sessionFile,
		transcriptSource: "active"
	};
}
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile, void 0);
	return readSqliteAggregateUsageSnapshot(resolveTranscriptReadTarget(scope));
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	return aggregateSessionTranscriptUsage(readRecentSqliteUsageMessages(resolveTranscriptReadTarget(scope), maxBytes));
}
/** Reads compact session preview items through the reader seam. */
function readSessionPreviewItemsFromTranscript(scope, maxItems, maxChars) {
	return buildSqlitePreviewItems(resolveTranscriptReadTarget(scope), maxItems, maxChars);
}
//#endregion
export { resolveEffectiveChatHistoryMaxChars as A, projectChatDisplayMessages as C, isHeartbeatHistoryTurnBoundaryMessage as D, dropPreSessionStartAnnouncePairs as E, stripEnvelopeFromMessage as M, augmentChatHistoryWithCanvasBlocks as O, projectChatDisplayMessage as S, sanitizeChatHistoryMessages as T, resolveSessionHistoryTranscriptPathAsync as _, readSessionMessageCountAsync as a, projectTranscriptEntryMessage as b, readSessionMessagesWithSourceAsync as c, sqliteMessageEventWithSeq as d, toTranscriptReadScope as f, capArrayByJsonBytes as g, ArchivedTranscriptReader as h, readSessionMessageByIdAsync as i, projectSessionDisplayMessage as j, DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS as k, readSessionPreviewItemsFromTranscript as l, readSessionTranscriptHistoryAnchorPage as m, readRecentSessionMessagesWithStatsAsync as n, readSessionMessagesAsync as o, visitSessionMessagesAsync as p, readRecentSessionUsageFromTranscript as r, readSessionMessagesPageWithStatsAsync as s, readLatestSessionUsageFromTranscriptAsync as t, resolveTranscriptReadTarget as u, attachOpenClawTranscriptMeta as v, projectChatDisplayMessagesWithState as w, resolveCurrentUserProfileDisplay as x, projectSessionMessagePayload as y };
