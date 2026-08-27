import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger, s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import "./internal-runtime-context-E3ku7Huk.js";
import { a as parseAssistantTextSignature, s as resolveAssistantMessagePhase } from "./chat-message-content-BibNiFIq.js";
import { i as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-ByevblQR.js";
import { n as estimateBase64DecodedBytes } from "./base64-KcXAb-1x.js";
import { c as isMeaningfulMediaFact, f as readPersistedMediaFacts } from "./media-facts-CdKKNGmE.js";
import { a as isContextOverflowError } from "./classify-kl1ByQTv.js";
import { t as STREAM_ERROR_FALLBACK_TEXT } from "./stream-message-shared-Cyrn1UHN.js";
import { a as parseInboundMediaUri, n as buildInboundMediaUriFromPath } from "./media-reference-8XBYb3Pm.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-CvzK-y8_.js";
import { C as stripEnvelopeFromMessages } from "./session-transcript-readers-BIeuEaZ3.js";
import { f as stripInterSessionPromptPrefixForDisplay, t as INTER_SESSION_PROMPT_PREFIX_BASE, u as normalizeInputProvenance } from "./input-provenance-BA6fPshG.js";
import { r as HEARTBEAT_PROMPT } from "./heartbeat-BB6nm0Fy.js";
import { n as isHeartbeatOkResponse, r as isHeartbeatUserMessage } from "./heartbeat-filter-CWcj-18j.js";
import { n as isSuppressedControlReplyText, r as stripSuppressedControlReplyToken } from "./control-reply-text-BXkKqW89.js";
import { i as projectWorkspaceResultConflict } from "./workspace-conflicts-Vx0i_s3y.js";
import { createHash } from "node:crypto";
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
	return value === "assistant_message" ? value : void 0;
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
	return texts.length > 0 && texts.every((text) => isSuppressedControlReplyText(stripInlineDirectiveTagsForDisplay(text).text)) && hasAssistantDisplayableNonTextContent(message);
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
	if (!record) return;
	const projected = {};
	for (const key of ["changed", "created"]) if (typeof record[key] === "boolean") projected[key] = record[key];
	if (typeof record.diff === "string" && record.diff.trim()) projected.diff = truncateChatHistoryText(record.diff, maxChars).text;
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
	return Object.keys(projected).length > 0 ? projected : void 0;
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
	const marker = message.openclawTtsSupplement;
	if (!marker || typeof marker !== "object" || Array.isArray(marker)) return;
	const entry = marker;
	const textSha256 = typeof entry.textSha256 === "string" && entry.textSha256.trim() ? entry.textSha256.trim() : void 0;
	const spokenText = typeof entry.spokenText === "string" && entry.spokenText.trim() ? entry.spokenText.trim() : void 0;
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
		if (!block || typeof block !== "object") continue;
		if (block.type !== "text") {
			hasSupplementBlock = true;
			continue;
		}
		const text = typeof block.text === "string" ? block.text.trim() : "";
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
	const supplementBlocks = Array.isArray(supplement.content) ? supplement.content.filter((block) => Boolean(block) && typeof block === "object" && block.type !== "text") : [];
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
		if (isDuplicateAcpGatewayInjectedMessage(current, visible.at(-1)) || isDuplicateChannelFinalDeliveryMirror(current, messages[i - 1])) {
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
		if (typeof value === "string" && value.trim()) return stripInlineDirectiveTagsForDisplay(value).text;
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
	const mirror = {
		role: "assistant",
		content: [{
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
		const matchingDeliveryMirrorPending = deliveryMirrorText ? pending.filter((item) => item.text.trim() === deliveryMirrorText) : [];
		const duplicateDeliveryMirror = matchingDeliveryMirrorPending.some((item) => item.succeeded);
		const visibleReplies = extractMessageToolVisibleReplies(record);
		if (visibleReplies.length > 0) for (const reply of visibleReplies) pending.push({
			...reply,
			anchor: record,
			succeeded: false
		});
		else if (matchingDeliveryMirrorPending.length === 0 && isRenderableAssistantDisplayMessage(record)) clearPending();
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
		changed: false
	};
	const entry = { ...block };
	let changed = false;
	const preserveExactToolPayload = opts?.preserveExactToolPayload === true || isToolHistoryBlockType(entry.type);
	const maxChars = opts?.maxChars ?? 8e3;
	if (isToolResultHistoryBlockType(entry.type) && "details" in entry) {
		const projectedDetails = projectToolResultDetails(entry.details, maxChars);
		if (projectedDetails) entry.details = projectedDetails;
		else delete entry.details;
		changed = true;
	}
	if (typeof entry.text === "string") {
		const stripped = stripInlineDirectiveTagsForDisplay(entry.text);
		if (preserveExactToolPayload) {
			entry.text = stripped.text;
			changed ||= stripped.changed;
		} else {
			const res = truncateChatHistoryText(stripped.text, maxChars);
			entry.text = res.text;
			changed ||= stripped.changed || res.truncated;
		}
	}
	if (typeof entry.content === "string") {
		const stripped = stripInlineDirectiveTagsForDisplay(entry.content);
		if (preserveExactToolPayload) {
			entry.content = stripped.text;
			changed ||= stripped.changed;
		} else {
			const res = truncateChatHistoryText(stripped.text, maxChars);
			entry.content = res.text;
			changed ||= stripped.changed || res.truncated;
		}
	}
	if (typeof entry.partialJson === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.partialJson, maxChars);
		entry.partialJson = res.text;
		changed ||= res.truncated;
	}
	if (typeof entry.arguments === "string" && !preserveExactToolPayload) {
		const res = truncateChatHistoryText(entry.arguments, maxChars);
		entry.arguments = res.text;
		changed ||= res.truncated;
	}
	if (typeof entry.thinking === "string") {
		const res = truncateChatHistoryText(entry.thinking, maxChars);
		entry.thinking = res.text;
		changed ||= res.truncated;
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
		changed
	};
}
function sanitizeAssistantPhasedContentBlocks(content) {
	if (!content.some((block) => {
		if (!block || typeof block !== "object") return false;
		const entry = block;
		return entry.type === "text" && Boolean(parseAssistantTextSignature(entry)?.phase);
	})) return {
		content,
		changed: false
	};
	const filtered = content.filter((block) => {
		if (!block || typeof block !== "object") return true;
		const entry = block;
		if (entry.type !== "text") return true;
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
		if (typeof entry.text !== "string" || !entry.text.trim()) continue;
		const truncated = truncateChatHistoryText(stripInlineDirectiveTagsForDisplay(entry.text).text, maxChars);
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
		const projectedDetails = projectWorkspaceConflictDetails(entry) ?? (messageHasToolResultShape(entry) ? projectToolResultDetails(entry.details, maxChars) : void 0);
		if (projectedDetails) entry.details = projectedDetails;
		else delete entry.details;
		changed = true;
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
		const stripped = stripInlineDirectiveTagsForDisplay(entry.content);
		const controlStripped = stripAssistantControlTokens ? stripSuppressedControlReplyToken(stripped.text) : stripped.text;
		changed ||= controlStripped !== stripped.text;
		if (preserveExactToolPayload) {
			entry.content = controlStripped;
			changed ||= stripped.changed;
		} else {
			const res = truncateChatHistoryText(controlStripped, maxChars);
			entry.content = res.text;
			changed ||= stripped.changed || res.truncated;
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
				changed: true
			};
		});
		if (updated.some((item) => item.changed)) {
			entry.content = updated.map((item) => item.block);
			changed = true;
		}
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
		const stripped = stripInlineDirectiveTagsForDisplay(entry.text);
		const controlStripped = stripAssistantControlTokens ? stripSuppressedControlReplyToken(stripped.text) : stripped.text;
		changed ||= controlStripped !== stripped.text;
		if (preserveExactToolPayload) {
			entry.text = controlStripped;
			changed ||= stripped.changed;
		} else {
			const res = truncateChatHistoryText(controlStripped, maxChars);
			entry.text = res.text;
			changed ||= stripped.changed || res.truncated;
		}
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
	const displayText = text === void 0 ? void 0 : stripInlineDirectiveTagsForDisplay(text).text;
	if (displayText === void 0 || !isSuppressedControlReplyText(displayText)) return false;
	return !hasAssistantDisplayableNonTextContent(message);
}
function sanitizeChatHistoryMessages(messages, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = [];
	for (const message of messages) {
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
	const filtered = filterVisibleProjectedHistoryMessages(projectSessionsSendInterSessionMessages(toProjectedMessages(sanitizeChatHistoryMessages(projectEmptyAssistantErrorMessages(repairedStreamErrors.messages), Number.MAX_SAFE_INTEGER))), options?.turnBoundaryPending);
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
function limitChatDisplayMessages(messages, maxMessages) {
	if (typeof maxMessages !== "number" || !Number.isFinite(maxMessages) || maxMessages <= 0 || messages.length <= maxMessages) return messages;
	return messages.slice(-Math.floor(maxMessages));
}
function projectRecentChatDisplayMessages(messages, options) {
	return limitChatDisplayMessages(projectChatDisplayMessages(messages, options), options?.maxMessages);
}
function projectChatDisplayMessage(message, options) {
	return projectChatDisplayMessages([message], options)[0];
}
//#endregion
export { sanitizeChatHistoryMessages as a, augmentChatHistoryWithCanvasBlocks as c, projectRecentChatDisplayMessages as i, DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS as l, projectChatDisplayMessages as n, dropPreSessionStartAnnouncePairs as o, projectChatDisplayMessagesWithState as r, isHeartbeatHistoryTurnBoundaryMessage as s, projectChatDisplayMessage as t, resolveEffectiveChatHistoryMaxChars as u };
