import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as stripAnsi } from "./ansi-DjDeieuH.js";
import { ft as stripLeadingInboundMetadata } from "./openclaw-state-db-DlCMR4eQ.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { f as readPersistedMediaFacts, s as isImageMediaFact } from "./media-facts-CdKKNGmE.js";
import { a as formatRawAssistantErrorForUi } from "./assistant-error-format-DYl5XHJg.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import "./usage-format-BgtSlOKr.js";
import { t as chunkTextByBreakResolver } from "./text-chunking-BWy_cIY1.js";
//#region src/tui/tui-formatters.ts
const REPLACEMENT_CHAR_RE = /\uFFFD/g;
const MAX_TOKEN_CHARS = 32;
const LONG_TOKEN_RE = /\S{33,}/g;
const LONG_TOKEN_TEST_RE = /\S{33,}/;
const BINARY_LINE_REPLACEMENT_THRESHOLD = 12;
const MAX_TUI_ABORT_DIAGNOSTIC_LENGTH = 160;
const URL_PREFIX_RE = /^(https?:\/\/|file:\/\/)/i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const FILE_LIKE_RE = /^[a-zA-Z0-9._-]+$/;
const EDGE_PUNCTUATION_RE = /^[`"'([{<]+|[`"')\]}>.,:;!?]+$/g;
const ALPHANUMERIC_RE = /[A-Za-z0-9]/;
const TOKENISH_MIN_LENGTH = 24;
const RTL_SCRIPT_RE = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufefc]/;
const CJK_SCRIPT_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/;
const BIDI_CONTROL_GLOBAL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
const RTL_ISOLATE_START = "⁧";
const RTL_ISOLATE_END = "⁩";
const FENCED_CODE_RE = /(```|~~~)[^\n]*\n[\s\S]*?\n\1[^\n]*/g;
const INLINE_CODE_RE = /(`+)(?:(?!\1).)+?\1/g;
/** Keep routing/provider/profile details in session state, not the compact footer. */
function formatModelFooter(params) {
	const model = splitTrailingAuthProfile(params.model ?? "").model || "unknown";
	const thinkingLevel = params.thinkingLevel?.trim();
	return thinkingLevel && thinkingLevel !== "off" ? `${model} ${thinkingLevel}` : model;
}
/** Format the compact TUI footer from authoritative session and process state. */
function formatTuiFooter(params) {
	const { sessionInfo } = params;
	const fastLabel = sessionInfo.fastMode === "auto" ? "fast:auto" : sessionInfo.fastMode === true ? "fast" : null;
	const verbose = sessionInfo.verboseLevel ?? "off";
	const trace = sessionInfo.traceLevel ?? "off";
	const reasoning = sessionInfo.reasoningLevel ?? "off";
	const traceLabel = trace === "raw" ? "trace:raw" : trace === "on" ? "trace" : null;
	const reasoningLabel = reasoning === "on" ? "reasoning" : reasoning === "stream" ? "reasoning:stream" : null;
	return sanitizeRenderableLine([
		`agent ${params.agentLabel}`,
		`session ${params.sessionLabel}`,
		formatModelFooter({
			model: sessionInfo.model,
			thinkingLevel: params.thinkingLevel
		}),
		formatGoalFooter(sessionInfo.goal),
		fastLabel,
		verbose !== "off" ? `verbose ${verbose}` : null,
		traceLabel,
		reasoningLabel,
		`deliver:${params.deliver ? "on" : "off"}`,
		formatTokens(sessionInfo.totalTokens ?? null, sessionInfo.contextTokens ?? null)
	].filter(Boolean).join(" | "));
}
function hasControlChars(text) {
	for (const char of text) {
		const code = char.charCodeAt(0);
		if (code <= 31 && code !== 9 && code !== 10 && code !== 13 || code >= 127 && code <= 159) return true;
	}
	return false;
}
function stripControlChars(text) {
	if (!hasControlChars(text)) return text;
	let sanitized = "";
	for (const char of text) {
		const code = char.charCodeAt(0);
		if (!(code <= 31 && code !== 9 && code !== 10 && code !== 13) && !(code >= 127 && code <= 159)) sanitized += char;
	}
	return sanitized;
}
function sanitizeTerminalControlsAndBinary(text) {
	const withoutAnsi = text.includes("\x1B") || text.includes("") || text.includes("") ? stripAnsi(text) : text;
	const withoutControlChars = hasControlChars(withoutAnsi) ? stripControlChars(withoutAnsi) : withoutAnsi;
	const withoutBidiControls = BIDI_CONTROL_RE.test(withoutControlChars) ? withoutControlChars.replace(BIDI_CONTROL_GLOBAL_RE, "") : withoutControlChars;
	return withoutBidiControls.includes("�") ? withoutBidiControls.split("\n").map((line) => redactBinaryLikeLine(line)).join("\n") : withoutBidiControls;
}
function isTerminalSafeAutocompleteValue(value) {
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code <= 31 || code >= 127 && code <= 159 || BIDI_CONTROL_RE.test(char)) return false;
	}
	return true;
}
function isCopySensitiveToken(token) {
	const candidate = token.replace(EDGE_PUNCTUATION_RE, "") || token;
	if (URL_PREFIX_RE.test(candidate)) return true;
	if (candidate.startsWith("/") || candidate.startsWith("~/") || candidate.startsWith("./") || candidate.startsWith("../")) return true;
	if (WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\")) return true;
	if (candidate.includes("/") || candidate.includes("\\")) return true;
	if (FILE_LIKE_RE.test(candidate) && (candidate.includes("_") || candidate.includes("-") || candidate.includes("."))) return true;
	if (candidate.length >= TOKENISH_MIN_LENGTH && /[a-z]/i.test(candidate) && /\d/.test(candidate)) return true;
	return false;
}
function normalizeLongTokenForDisplay(token) {
	if (isCopySensitiveToken(token)) return token;
	if (CJK_SCRIPT_RE.test(token)) return token;
	if (!ALPHANUMERIC_RE.test(token)) return token;
	return chunkTextByBreakResolver(token, MAX_TOKEN_CHARS, () => MAX_TOKEN_CHARS).join(" ");
}
function partitionByRegex(text, re) {
	const parts = [];
	let lastIndex = 0;
	for (const match of text.matchAll(re)) {
		const start = match.index ?? 0;
		if (start > lastIndex) parts.push({
			kind: "prose",
			text: text.slice(lastIndex, start)
		});
		parts.push({
			kind: "code",
			text: match[0]
		});
		lastIndex = start + match[0].length;
	}
	if (lastIndex < text.length) parts.push({
		kind: "prose",
		text: text.slice(lastIndex)
	});
	return parts;
}
function transformOutsideCode(text, transform) {
	return partitionByRegex(text, FENCED_CODE_RE).map((seg) => {
		if (seg.kind === "code") return seg.text;
		return partitionByRegex(seg.text, INLINE_CODE_RE).map((s) => s.kind === "code" ? s.text : transform(s.text)).join("");
	}).join("");
}
function redactBinaryLikeLine(line) {
	const replacementCount = (line.match(REPLACEMENT_CHAR_RE) || []).length;
	if (replacementCount >= BINARY_LINE_REPLACEMENT_THRESHOLD && replacementCount * 2 >= line.length) return "[binary data omitted]";
	return line;
}
function isolateRtlLine(line) {
	if (!RTL_SCRIPT_RE.test(line)) return line;
	return `${RTL_ISOLATE_START}${line}${RTL_ISOLATE_END}`;
}
function isolateRtlRenderedLine(line) {
	if (!RTL_SCRIPT_RE.test(stripAnsi(line))) return line;
	const padding = line.match(/^(\s*)(.*\S)(\s*)$/u);
	if (!padding) return line;
	return `${padding[1]}${RTL_ISOLATE_START}${padding[2]}${RTL_ISOLATE_END}${padding[3]}`;
}
function applyRtlIsolation(text) {
	if (!RTL_SCRIPT_RE.test(text)) return text;
	return text.split("\n").map((line) => isolateRtlLine(line)).join("\n");
}
function sanitizeMarkdownSource(text) {
	if (!text) return text;
	const hasLongTokens = LONG_TOKEN_TEST_RE.test(text);
	const controlSafe = sanitizeTerminalControlsAndBinary(text);
	if (controlSafe === text && !hasLongTokens) return text;
	return LONG_TOKEN_TEST_RE.test(controlSafe) ? transformOutsideCode(controlSafe, (segment) => LONG_TOKEN_TEST_RE.test(segment) ? segment.replace(LONG_TOKEN_RE, normalizeLongTokenForDisplay) : segment) : controlSafe;
}
function sanitizeRenderableText(text) {
	return applyRtlIsolation(sanitizeMarkdownSource(text));
}
function sanitizeRenderableLine(text) {
	return applyRtlIsolation(sanitizeTerminalControlsAndBinary(text).replace(/\s+/gu, " ").trim());
}
/** Render error causes without exposing secrets or terminal control sequences. */
function formatTuiErrorMessage(error) {
	return sanitizeRenderableText(formatErrorMessage(error));
}
function formatTuiAbortDiagnostic(value) {
	const diagnostic = sanitizeRenderableText(value ?? "").replace(/\s+/g, " ").trim();
	return diagnostic ? diagnostic.length > MAX_TUI_ABORT_DIAGNOSTIC_LENGTH ? `${truncateUtf16Safe(diagnostic, MAX_TUI_ABORT_DIAGNOSTIC_LENGTH - 1)}…` : diagnostic : void 0;
}
function resolveFinalAssistantText(params) {
	const finalText = params.finalText ?? "";
	if (finalText.trim()) return finalText;
	const streamedText = params.streamedText ?? "";
	if (streamedText.trim()) return streamedText;
	const errorMessage = params.errorMessage ?? "";
	if (errorMessage.trim()) return formatRawAssistantErrorForUi(errorMessage);
	const attachmentText = params.attachmentText ?? "";
	if (attachmentText.trim()) return attachmentText;
	return "(no output)";
}
function composeThinkingAndContent(params) {
	const thinkingText = params.thinkingText?.trim() ?? "";
	const contentText = params.contentText?.trim() ?? "";
	const parts = [];
	if (params.showThinking && thinkingText) parts.push(`[thinking]\n${thinkingText}`);
	if (contentText) parts.push(contentText);
	return parts.join("\n\n").trim();
}
function asMessageRecord(message) {
	if (!message || typeof message !== "object") return;
	return message;
}
const TUI_ATTACHMENT_BLOCK_KINDS = {
	image: "image",
	input_image: "image",
	image_url: "image",
	audio: "audio",
	video: "video",
	file: "file",
	document: "file"
};
function resolveTuiAttachmentBlockKind(block) {
	const type = typeof block.type === "string" ? block.type : "";
	const directKind = TUI_ATTACHMENT_BLOCK_KINDS[type];
	if (directKind) return directKind;
	if (type !== "attachment") return null;
	const attachment = asMessageRecord(block.attachment);
	const declaredKind = attachment?.kind;
	if (declaredKind === "image" || declaredKind === "sticker") return "image";
	if (declaredKind === "audio" || declaredKind === "video") return declaredKind;
	const mimeKind = typeof attachment?.mimeType === "string" ? attachment.mimeType.split("/", 1)[0] : "";
	return mimeKind === "image" || mimeKind === "audio" || mimeKind === "video" ? mimeKind : "file";
}
/** Keep optimistic session projection aligned with the terminal's attachment renderer. */
function isTuiAssistantAttachmentBlock(block) {
	const entry = asMessageRecord(block);
	return entry ? resolveTuiAttachmentBlockKind(entry) !== null : false;
}
function resolvePersistedTuiAttachmentKind(fact) {
	if (isImageMediaFact(fact)) return "image";
	if (fact.kind === "audio" || fact.kind === "video") return fact.kind;
	return "file";
}
/** Render assistant attachments without exposing their sources or capability URLs. */
function extractAssistantAttachmentText(message) {
	const record = asMessageRecord(message);
	if (!record) return "";
	const contentAttachments = Array.isArray(record.content) ? record.content.flatMap((block) => {
		const entry = asMessageRecord(block);
		const kind = entry ? resolveTuiAttachmentBlockKind(entry) : null;
		return kind ? [`Attached ${kind}`] : [];
	}) : [];
	if (contentAttachments.length > 0) return contentAttachments.join("\n");
	const persistedAttachments = (readPersistedMediaFacts(record) ?? []).filter((fact) => fact.path || fact.url || fact.contentType || fact.kind).map((fact) => `Attached ${resolvePersistedTuiAttachmentKind(fact)}`);
	if (persistedAttachments.length > 0) return persistedAttachments.join("\n");
	return [...typeof record.mediaUrl === "string" && record.mediaUrl.trim() ? [record.mediaUrl] : [], ...Array.isArray(record.mediaUrls) ? record.mediaUrls.filter((value) => typeof value === "string" && value.trim()) : []].map(() => "Attached media").join("\n");
}
function resolveMessageRecord(message) {
	const record = asMessageRecord(message);
	if (!record) return;
	return {
		record,
		content: record.content
	};
}
function formatAssistantErrorFromRecord(record) {
	if ((typeof record.stopReason === "string" ? record.stopReason : "") !== "error") return "";
	return formatRawAssistantErrorForUi(typeof record.errorMessage === "string" ? record.errorMessage : "");
}
function collectSanitizedBlockStrings(params) {
	if (!Array.isArray(params.content)) return [];
	const parts = [];
	for (const block of params.content) {
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (rec.type === params.blockType && typeof rec[params.valueKey] === "string") parts.push(sanitizeRenderableText(rec[params.valueKey]));
	}
	return parts;
}
/**
* Extract ONLY thinking blocks from message content.
* Model-agnostic: returns empty string if no thinking blocks exist.
*/
function extractThinkingFromMessage(message) {
	const resolved = resolveMessageRecord(message);
	if (!resolved) return "";
	const { content } = resolved;
	if (typeof content === "string") return "";
	return collectSanitizedBlockStrings({
		content,
		blockType: "thinking",
		valueKey: "thinking"
	}).join("\n").trim();
}
/**
* Extract ONLY text content blocks from message (excludes thinking).
* Model-agnostic: works for any model with text content blocks.
*/
function extractContentFromMessage(message) {
	const resolved = resolveMessageRecord(message);
	if (!resolved) return "";
	const { record, content } = resolved;
	if (record.role === "assistant") {
		if (typeof content === "string") return sanitizeRenderableText(content).trim();
		if (Array.isArray(content)) return extractAssistantRenderableContent(record);
	}
	if (typeof content === "string") return sanitizeRenderableText(content).trim();
	const parts = collectSanitizedBlockStrings({
		content,
		blockType: "text",
		valueKey: "text"
	});
	if (parts.length > 0) return parts.join("\n").trim();
	return formatAssistantErrorFromRecord(record);
}
function extractAssistantRenderableContent(record) {
	const content = [sanitizeRenderableText(extractAssistantPhaseText(record) ?? "").trim(), extractPairingQrTerminalText(record)].filter(Boolean).join("\n\n").trim();
	if (content) return content;
	return formatAssistantErrorFromRecord(record);
}
function extractPairingQrTerminalText(record) {
	const content = record.content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const blockRecord = block;
		if (blockRecord.type === "openclaw_pairing_qr" && typeof blockRecord.terminalText === "string") {
			const text = sanitizeRenderableText(blockRecord.terminalText).trim();
			if (text) parts.push(text);
		}
	}
	return parts.join("\n\n").trim();
}
function extractTextBlocks(content, opts) {
	if (typeof content === "string") return sanitizeRenderableText(content).trim();
	if (!Array.isArray(content)) return "";
	const textParts = collectSanitizedBlockStrings({
		content,
		blockType: "text",
		valueKey: "text"
	});
	return composeThinkingAndContent({
		thinkingText: (opts?.includeThinking === true ? collectSanitizedBlockStrings({
			content,
			blockType: "thinking",
			valueKey: "thinking"
		}) : []).join("\n").trim(),
		contentText: textParts.join("\n").trim(),
		showThinking: opts?.includeThinking ?? false
	});
}
function extractUserAttachmentText(record) {
	const attachments = [];
	if (Array.isArray(record.content)) for (const block of record.content) {
		const entry = asMessageRecord(block);
		if (entry?.type === "image") attachments.push("Attached image");
		else if (entry?.type === "attachment") {
			const attachment = asMessageRecord(entry.attachment);
			const label = typeof attachment?.label === "string" ? sanitizeRenderableText(attachment.label).trim() : "";
			attachments.push(label && label !== "Attached file" ? `Attached file: ${label}` : "Attached file");
		}
	}
	if (attachments.length > 0) return attachments.join("\n");
	return (readPersistedMediaFacts(record) ?? []).filter((fact) => fact.path || fact.url || fact.contentType || fact.kind).map((fact) => isImageMediaFact(fact) ? "Attached image" : "Attached file").join("\n");
}
function extractTextFromMessage(message, opts) {
	const record = asMessageRecord(message);
	if (!record) return "";
	if (record.role === "assistant") {
		const contentText = extractAssistantRenderableContent(record);
		return composeThinkingAndContent({
			thinkingText: extractThinkingFromMessage(record),
			contentText: contentText || (opts?.includeAttachments !== false ? extractAssistantAttachmentText(record) : ""),
			showThinking: opts?.includeThinking ?? false
		});
	}
	const text = extractTextBlocks(record.content, opts);
	if (text) {
		if (record.role === "user" || record.command === true) return stripLeadingInboundMetadata(text);
		return text;
	}
	if (record.role === "user") return extractUserAttachmentText(record);
	const errorText = formatAssistantErrorFromRecord(record);
	if (!errorText) return "";
	return errorText;
}
/** Extract abort-visible text while keeping attachment-only aborts diagnostic-only. */
function extractTuiAbortedText(message, includeThinking) {
	return extractTextFromMessage(message, {
		includeThinking,
		includeAttachments: false
	});
}
function isCommandMarkedMessage(message) {
	if (!message || typeof message !== "object") return false;
	return message.command === true;
}
function formatTokens(total, context) {
	if (total == null && context == null) return "tokens ?";
	const totalLabel = total == null ? "?" : formatTokenCount(total);
	if (context == null) return `tokens ${totalLabel}`;
	const pct = typeof total === "number" && context > 0 ? Math.min(999, Math.round(total / context * 100)) : null;
	return `tokens ${totalLabel}/${formatTokenCount(context)}${pct !== null ? ` (${pct}%)` : ""}`;
}
function formatGoalUsage(goal) {
	if (goal.tokenBudget === void 0) return goal.tokensUsed > 0 ? formatTokenCount(goal.tokensUsed) : null;
	return `${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
}
function formatGoalFooter(goal) {
	if (!goal) return null;
	const usage = formatGoalUsage(goal);
	const suffix = usage ? ` (${usage})` : "";
	switch (goal.status) {
		case "active": return `Pursuing goal${suffix}`;
		case "paused": return "Goal paused (/goal resume)";
		case "blocked": return "Goal blocked (/goal resume)";
		case "usage_limited": return "Goal hit usage limits (/goal resume)";
		case "budget_limited": return `Goal unmet${suffix}`;
		case "complete": return `Goal achieved${suffix}`;
	}
	return null;
}
function formatContextUsageLine(params) {
	const totalLabel = typeof params.total === "number" ? formatTokenCount(params.total) : "?";
	const ctxLabel = typeof params.context === "number" ? formatTokenCount(params.context) : "?";
	const pct = typeof params.percent === "number" ? Math.min(999, Math.round(params.percent)) : null;
	const extra = [typeof params.remaining === "number" ? `${formatTokenCount(params.remaining)} left` : null, pct !== null ? `${pct}%` : null].filter(Boolean).join(", ");
	return `tokens ${totalLabel}/${ctxLabel}${extra ? ` (${extra})` : ""}`;
}
function formatPrimitiveString(value, fallback = "") {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return fallback;
}
//#endregion
export { sanitizeMarkdownSource as _, extractThinkingFromMessage as a, formatPrimitiveString as c, formatTuiFooter as d, isCommandMarkedMessage as f, resolveFinalAssistantText as g, isolateRtlRenderedLine as h, extractTextFromMessage as i, formatTuiAbortDiagnostic as l, isTuiAssistantAttachmentBlock as m, extractAssistantAttachmentText as n, extractTuiAbortedText as o, isTerminalSafeAutocompleteValue as p, extractContentFromMessage as r, formatContextUsageLine as s, composeThinkingAndContent as t, formatTuiErrorMessage as u, sanitizeRenderableLine as v, sanitizeRenderableText as y };
