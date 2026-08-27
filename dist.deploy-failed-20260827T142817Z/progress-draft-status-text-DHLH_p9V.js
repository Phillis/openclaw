import { n as isInsideCode, t as findCodeRegions } from "./code-regions-BWkFWnhP.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-CvzK-y8_.js";
import { l as formatReasoningMessage } from "./embedded-agent-utils-BD59s5tV.js";
//#region src/channels/progress-draft-status-text.ts
const REASONING_PROGRESS_TAG_RE = /<\s*(\/?)\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/giu;
const REASONING_PROGRESS_TAG_PREFIXES = [
	"think",
	"thinking",
	"thought",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"mm:think",
	"mm:thinking",
	"mm:thought"
].flatMap((name) => [`<${name}`, `</${name}`]);
function normalizeReasoningProgressLine(text) {
	const reasoningText = readReasoningProgressTextOutsideCode(text);
	if (reasoningText === void 0) return "";
	return stripReasoningProgressTagsOutsideCode(reasoningText).replace(/^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i, "").replace(/\s+/g, " ").trim();
}
function readReasoningProgressTextOutsideCode(text) {
	if (isPartialReasoningProgressTagPrefix(text)) return;
	const codeRegions = findCodeRegions(text);
	let hasTags = false;
	let inReasoning = false;
	let cursor = 0;
	const chunks = [];
	for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE)) {
		const offset = match.index ?? 0;
		if (isInsideCode(offset, codeRegions)) continue;
		hasTags = true;
		if (match[1]) {
			if (inReasoning) chunks.push(text.slice(cursor, offset));
			inReasoning = false;
			cursor = offset + match[0].length;
			continue;
		}
		if (inReasoning) chunks.push(text.slice(cursor, offset));
		inReasoning = true;
		cursor = offset + match[0].length;
	}
	if (!hasTags) return text;
	if (inReasoning) chunks.push(text.slice(cursor));
	return chunks.join("").trim();
}
function isPartialReasoningProgressTagPrefix(text) {
	const normalized = text.trimStart().toLowerCase();
	return normalized.startsWith("<") && !normalized.includes(">") && REASONING_PROGRESS_TAG_PREFIXES.some((prefix) => prefix.startsWith(normalized) || normalized.startsWith(prefix));
}
function stripReasoningProgressTagsOutsideCode(text) {
	const codeRegions = findCodeRegions(text);
	return text.replace(REASONING_PROGRESS_TAG_RE, (match, _closing, offset) => isInsideCode(offset, codeRegions) ? match : "");
}
function normalizeReasoningProgressInput(text) {
	const normalized = normalizeReasoningProgressLine(text);
	return (normalized.match(/^_(.*)_$/u)?.[1] ?? normalized).trim();
}
function formatReasoningProgressDisplayLine(text, maxChars) {
	const formatted = normalizeReasoningProgressLine(formatReasoningMessage(normalizeReasoningProgressInput(text)));
	if (!formatted) return "";
	if (Array.from(formatted).length <= maxChars) return formatted;
	const italic = formatted.match(/^_(.*)_$/u);
	if (!italic) return compactReasoningProgressDisplayLine(formatted, maxChars);
	const body = compactReasoningProgressDisplayLine(italic[1] ?? "", Math.max(1, maxChars - 2));
	return body ? `_${body}_` : "";
}
function compactReasoningProgressDisplayLine(text, maxChars) {
	const normalized = text.replace(/\s+/g, " ").trim();
	const chars = Array.from(normalized);
	if (chars.length <= maxChars) return normalized;
	if (maxChars <= 1) return "…";
	const head = chars.slice(0, maxChars - 1).join("").trimEnd();
	const boundary = head.search(/\s+\S*$/u);
	if (boundary > Math.floor(maxChars * .6)) return `${head.slice(0, boundary).trimEnd()}…`;
	return `${head}…`;
}
function sanitizeProgressStatusText(text) {
	const cleaned = stripInlineDirectiveTagsForDelivery(text).text.trim();
	if (!cleaned || isSilentCommentaryProgressText(cleaned)) return "";
	return cleaned;
}
function normalizeCommentaryProgressText(text) {
	const cleaned = sanitizeProgressStatusText(text);
	if (!cleaned) return "";
	return cleaned.split(/\r?\n/u).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean).map((line) => `_${line}_`).join("\n");
}
function isSilentCommentaryProgressText(text) {
	const normalized = text.replace(/^[\s*_`~]+|[\s*_`~]+$/gu, "").trim();
	return /^NO_REPLY$/iu.test(normalized);
}
function mergeReasoningProgressText(current, incoming, options) {
	if (!current) return incoming;
	const normalizedCurrent = normalizeReasoningProgressInput(current);
	const normalizedIncoming = normalizeReasoningProgressInput(incoming);
	if (!normalizedIncoming) return shouldAppendEmptyReasoningProgressDelta(current, incoming) ? `${current}${incoming}` : current;
	if (normalizedIncoming === normalizedCurrent) return current;
	if (options?.snapshot === true || isReasoningSnapshotText(incoming) || normalizedCurrent && normalizedIncoming.startsWith(normalizedCurrent)) return incoming;
	return `${current}${incoming}`;
}
function isReasoningSnapshotText(text) {
	return /^\s*(?:>\s*)?(?:Reasoning:\s*(?:\r?\n|\r)\s*|Thinking\.{0,3}\s*(?:\r?\n|\r)\s*(?:\r?\n|\r)\s*)/i.test(text);
}
function shouldAppendEmptyReasoningProgressDelta(current, incoming) {
	return isPartialReasoningProgressTagPrefix(current) || isPartialReasoningProgressTagPrefix(incoming) || hasReasoningProgressTagOutsideCode(incoming);
}
function hasReasoningProgressTagOutsideCode(text) {
	const codeRegions = findCodeRegions(text);
	for (const match of text.matchAll(REASONING_PROGRESS_TAG_RE)) if (!isInsideCode(match.index ?? 0, codeRegions)) return true;
	return false;
}
//#endregion
export { sanitizeProgressStatusText as a, normalizeReasoningProgressLine as i, mergeReasoningProgressText as n, normalizeCommentaryProgressText as r, formatReasoningProgressDisplayLine as t };
