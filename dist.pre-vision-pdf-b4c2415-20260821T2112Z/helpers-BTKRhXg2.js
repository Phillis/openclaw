import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs, w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import "./channel-outbound-CEvoxZOx.js";
import { S as formatLocationText } from "./reply-payload-DBNGwex4.js";
import { p as resolveChannelPreviewStreamMode } from "./streaming-3t37hp7G.js";
import { d as tokenizeHtmlTags, r as markdownToIR } from "./construct-fallbacks-CCQa__o1.js";
import { n as firstDefined } from "./allow-from-D4kg2zcb.js";
import { t as resolveCommandAuthorization } from "./command-auth-DR4tXHFH.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import { r as renderMarkdownIRChunksWithinLimit } from "./text-chunking-DrVvfnLf.js";
import { n as renderMarkdownWithMarkers } from "./tables-Bu53rjrA.js";
import { n as isAutoLinkedFileRef, t as FILE_REF_EXTENSIONS_WITH_TLD } from "./auto-linked-file-ref-H-D-BcV4.js";
import { s as readChannelAllowFromStore } from "./pairing-store-L1ejw2gC.js";
import "./channel-inbound-BNkCsISu.js";
import "./conversation-runtime-CodUKCtR.js";
import "./command-auth-native-Bz50pc-8.js";
import { i as normalizeAllowFrom, o as resolveTelegramEffectiveDmPolicy, r as isSenderAllowed, t as expandTelegramAllowFromWithAccessGroups } from "./access-groups-CQPV0TPr.js";
import { t as normalizeTelegramReplyToMessageId } from "./outbound-params-B_YGyvIG.js";
//#region extensions/telegram/src/preview-streaming.ts
function resolveTelegramPreviewStreamMode(params = {}) {
	return resolveChannelPreviewStreamMode(params, "progress");
}
//#endregion
//#region extensions/telegram/src/format-html.ts
const TELEGRAM_HTML_ENTITY_PATTERN = /&(#[xX][0-9A-Fa-f]+|#\d+|amp|lt|gt|quot|apos);/g;
const TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS = /* @__PURE__ */ new Set([
	"aside",
	"audio",
	"blockquote",
	"caption",
	"col",
	"colgroup",
	"details",
	"figcaption",
	"figure",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"summary",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tg-collage",
	"tg-map",
	"tg-math-block",
	"tg-slideshow",
	"tr",
	"ul",
	"video"
]);
function isTelegramRichLineBreakStructuralTag(rawTag, tagName) {
	return TELEGRAM_LINE_BREAK_STRUCTURAL_TAGS.has(tagName) || tagName === "a" && /\sname="[^"]+"/i.test(rawTag);
}
function isValidTelegramHtmlEntityCodePoint(codePoint) {
	return Number.isInteger(codePoint) && codePoint >= 0 && codePoint <= 1114111 && !(codePoint >= 55296 && codePoint <= 57343);
}
function decodeTelegramHtmlEntity(entity, fallback) {
	if (entity.startsWith("#x") || entity.startsWith("#X")) {
		const codePoint = Number.parseInt(entity.slice(2), 16);
		return isValidTelegramHtmlEntityCodePoint(codePoint) ? String.fromCodePoint(codePoint) : fallback;
	}
	if (entity.startsWith("#")) {
		const codePoint = Number.parseInt(entity.slice(1), 10);
		return isValidTelegramHtmlEntityCodePoint(codePoint) ? String.fromCodePoint(codePoint) : fallback;
	}
	switch (entity) {
		case "amp": return "&";
		case "lt": return "<";
		case "gt": return ">";
		case "quot": return "\"";
		case "apos": return "'";
		default: return fallback;
	}
}
function decodeTelegramHtmlEntities(text) {
	return text.replace(TELEGRAM_HTML_ENTITY_PATTERN, (match, entity) => decodeTelegramHtmlEntity(entity, match));
}
function findTelegramHtmlEntityEnd(text, start) {
	if (text[start] !== "&") return -1;
	let index = start + 1;
	if (index >= text.length) return -1;
	if (text[index] === "#") {
		index += 1;
		if (index >= text.length) return -1;
		if (text[index] === "x" || text[index] === "X") {
			index += 1;
			const hexStart = index;
			while (/[0-9A-Fa-f]/.test(text[index] ?? "")) index += 1;
			if (index === hexStart) return -1;
		} else {
			const digitStart = index;
			while (/[0-9]/.test(text[index] ?? "")) index += 1;
			if (index === digitStart) return -1;
		}
	} else {
		const nameStart = index;
		while (/[A-Za-z0-9]/.test(text[index] ?? "")) index += 1;
		if (index === nameStart) return -1;
	}
	return text[index] === ";" ? index : -1;
}
//#endregion
//#region extensions/telegram/src/format-assistant-transcript.ts
const TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX = "<code>Assistant:</code> ";
function maskTelegramExcludedText(text) {
	return text.split("\n").map((line) => line.trim() ? `x${" ".repeat(Math.max(0, line.length - 1))}` : " ".repeat(line.length)).join("\n");
}
function maskTelegramExcludedRanges(projection) {
	let masked = "";
	let cursor = 0;
	for (const range of projection.excludedRanges) {
		masked += projection.text.slice(cursor, range.start);
		masked += maskTelegramExcludedText(projection.text.slice(range.start, range.end));
		cursor = range.end;
	}
	return masked + projection.text.slice(cursor);
}
function telegramProjectionHasRoleHeader(projection) {
	return Boolean(markdownToIR(maskTelegramExcludedRanges(projection), {
		assistantTranscriptRoleHeaders: true,
		autolink: false,
		blockquotePrefix: "",
		headingStyle: "none",
		linkify: false,
		tableMode: "off"
	}).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"));
}
function appendTelegramHtmlVisibleValue(projection, value, excluded) {
	if (!value) return;
	const start = projection.text.length;
	projection.text += value;
	if (!excluded) return;
	const previous = projection.excludedRanges.at(-1);
	if (previous?.end === start) previous.end = projection.text.length;
	else projection.excludedRanges.push({
		start,
		end: projection.text.length
	});
}
function appendTelegramHtmlVisibleSegment(projection, segment, excluded) {
	let index = 0;
	while (index < segment.length) {
		if (segment[index] === "&") {
			const entityEnd = findTelegramHtmlEntityEnd(segment, index);
			if (entityEnd >= 0) {
				appendTelegramHtmlVisibleValue(projection, decodeTelegramHtmlEntities(segment.slice(index, entityEnd + 1)), excluded);
				index = entityEnd + 1;
				continue;
			}
		}
		const codePoint = segment.codePointAt(index);
		if (codePoint === void 0) break;
		const character = String.fromCodePoint(codePoint);
		appendTelegramHtmlVisibleValue(projection, character, excluded);
		index += character.length;
	}
}
function projectTelegramHtmlVisibleText(html) {
	const projection = {
		text: "",
		excludedRanges: []
	};
	let codeDepth = 0;
	let preDepth = 0;
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		appendTelegramHtmlVisibleSegment(projection, html.slice(lastIndex, tagStart), codeDepth > 0 || preDepth > 0);
		const rawTag = tag.raw;
		const tagName = tag.name;
		const isClosing = tag.closing;
		const isSelfClosing = tag.selfClosing;
		if (isTelegramRichLineBreakStructuralTag(rawTag, tagName) && projection.text && !projection.text.endsWith("\n")) appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
		if (tagName === "br" && !isClosing) appendTelegramHtmlVisibleValue(projection, "\n", codeDepth > 0 || preDepth > 0);
		if (!isSelfClosing && tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (!isSelfClosing && tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		lastIndex = tagEnd;
	}
	appendTelegramHtmlVisibleSegment(projection, html.slice(lastIndex), codeDepth > 0 || preDepth > 0);
	return projection;
}
function protectTelegramAssistantTranscriptRoleHeaders(html) {
	if (html.startsWith("<code>Assistant:</code> ")) return html;
	if (!telegramProjectionHasRoleHeader(projectTelegramHtmlVisibleText(html))) return html;
	return `${TELEGRAM_ASSISTANT_TRANSCRIPT_PREFIX}${html}`;
}
//#endregion
//#region extensions/telegram/src/format-render.ts
function renderTelegramMarkdownIR(ir, options) {
	return renderMarkdownWithMarkers(ir, {
		annotationMarkers: { assistant_transcript_role: {
			open: "<code>",
			close: "</code>",
			suppressNestedFormatting: true
		} },
		styleMarkers: {
			bold: {
				open: "<b>",
				close: "</b>"
			},
			italic: {
				open: "<i>",
				close: "</i>"
			},
			strikethrough: {
				open: "<s>",
				close: "</s>"
			},
			code: {
				open: "<code>",
				close: "</code>"
			},
			code_block: {
				open: options.buildCodeBlockOpen,
				close: "</code></pre>"
			},
			spoiler: {
				open: "<tg-spoiler>",
				close: "</tg-spoiler>"
			},
			blockquote: {
				open: "<blockquote>",
				close: "</blockquote>"
			},
			heading_1: {
				open: "<h1>",
				close: "</h1>"
			},
			heading_2: {
				open: "<h2>",
				close: "</h2>"
			},
			heading_3: {
				open: "<h3>",
				close: "</h3>"
			},
			heading_4: {
				open: "<h4>",
				close: "</h4>"
			},
			heading_5: {
				open: "<h5>",
				close: "</h5>"
			},
			heading_6: {
				open: "<h6>",
				close: "</h6>"
			}
		},
		escapeText: options.escapeText,
		buildLink: options.buildLink
	});
}
//#endregion
//#region extensions/telegram/src/format.ts
function escapeTelegramHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeHtml(text) {
	return escapeTelegramHtml(text);
}
function escapeHtmlAttr(text) {
	return escapeHtml(text).replace(/"/g, "&quot;");
}
function isTelegramRichLinkHref(href) {
	return /^(?:https?:\/\/|tg:\/\/|mailto:|tel:|#)/i.test(href);
}
/**
* File extensions that share TLDs and commonly appear in code/documentation.
* These are wrapped in <code> tags to prevent Telegram from generating
* spurious domain registrar previews.
*
* Only includes extensions that are:
* 1. Commonly used as file extensions in code/docs
* 2. Rarely used as intentional domain references
*
* Excluded: .ai, .io, .tv, .fm (popular domain TLDs like x.ai, vercel.io, github.io)
*/
function buildTelegramLink(link, text, context) {
	const href = link.href.trim();
	if (!href) return null;
	if (link.start === link.end) return null;
	if (!isTelegramRichLinkHref(href)) return null;
	const label = text.slice(link.start, link.end);
	if (context.origin === "linkify" && isAutoLinkedFileRef(href, label)) return null;
	const safeHref = escapeHtmlAttr(href);
	return {
		start: link.start,
		end: link.end,
		open: `<a href="${safeHref}">`,
		close: "</a>"
	};
}
function buildTelegramCodeBlockOpen(span) {
	if (!span.language) return "<pre><code>";
	return `<pre><code class="language-${escapeHtmlAttr(span.language)}">`;
}
function renderTelegramHtml(ir) {
	return renderTelegramMarkdownIR(ir, {
		escapeText: escapeHtml,
		buildLink: buildTelegramLink,
		buildCodeBlockOpen: buildTelegramCodeBlockOpen
	});
}
function leadingWhitespaceLength(line) {
	let length = 0;
	while (line[length] === " " || line[length] === "	") length++;
	return length;
}
function isTelegramBulletLine(line) {
	return /^[ \t]*(?:[•*+-])[ \t]+\S/.test(line);
}
function isTelegramListBoundaryLine(line) {
	return /^[ \t]*(?:\d+\.|#{1,6})[ \t]+\S/.test(line);
}
function isMarkdownIndentedCodeLine(line) {
	return /^(?: {4}|\t)/.test(line);
}
function shouldPreserveTelegramListBoundarySpacing(previous, next) {
	return !isMarkdownIndentedCodeLine(previous) && !isMarkdownIndentedCodeLine(next) && isTelegramBulletLine(previous) && isTelegramListBoundaryLine(next) && leadingWhitespaceLength(next) <= leadingWhitespaceLength(previous);
}
function preserveTelegramListBoundarySpacing(markdown) {
	const lines = markdown.split("\n");
	const out = [];
	let inFence = false;
	let previousLine = "";
	for (const line of lines) {
		const normalizedLine = line.replace(/\r$/, "");
		const isFenceLine = /^[ \t]*(?:```|~~~)/.test(normalizedLine);
		if (!inFence && shouldPreserveTelegramListBoundarySpacing(previousLine, normalizedLine)) out.push("");
		out.push(line);
		if (isFenceLine) inFence = !inFence;
		previousLine = normalizedLine;
	}
	return out.join("\n");
}
function parseTelegramLegacyMarkdown(markdown, tableMode) {
	return markdownToIR(preserveTelegramListBoundarySpacing(markdown ?? ""), {
		assistantTranscriptRoleHeaders: true,
		linkify: true,
		enableSpoilers: true,
		headingStyle: "none",
		blockquotePrefix: "",
		tableMode: tableMode === "block" ? "code" : tableMode
	});
}
function markdownToTelegramHtml(markdown, options = {}) {
	const telegramHtml = renderSupportedTelegramHtml(renderTelegramHtml(parseTelegramLegacyMarkdown(markdown, options.tableMode)));
	if (options.wrapFileRefs !== false) return wrapFileReferencesInHtml(telegramHtml);
	return telegramHtml;
}
/**
* Wraps standalone file references (with TLD extensions) in <code> tags.
* This prevents Telegram from treating them as URLs and generating
* irrelevant domain registrar previews.
*
* Runs AFTER markdown→HTML conversion to avoid modifying HTML attributes.
* Skips content inside <code>, <pre>, and <a> tags to avoid nesting issues.
*/
/** Escape regex metacharacters in a string */
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const HTML_MODE_TAG_PATTERN = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^<>]*)>$/;
const ESCAPED_HTML_TAG_PATTERN = /&lt;(\/?)([a-zA-Z][a-zA-Z0-9-]*)(.*?)&gt;/g;
const TELEGRAM_HTML_ANCHOR_PATTERN = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a\s*>/gi;
const TELEGRAM_HTML_BREAK_PATTERN = /<br\s*\/?>/gi;
const TELEGRAM_HTML_TAG_PATTERN = /<[^>]*>/g;
const TELEGRAM_RICH_HTML_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const TELEGRAM_HTML_CAPTION_PATTERN = /<caption\b[^>]*>([\s\S]*?)<\/caption>/i;
const TELEGRAM_HTML_COLSPAN_PATTERN = /(?:^|\s)colspan\s*=\s*(['"]?)\s*(\d+)\s*\1(?=\s|$)/i;
const TELEGRAM_SIMPLE_HTML_TAGS = /* @__PURE__ */ new Set([
	"b",
	"strong",
	"i",
	"em",
	"u",
	"ins",
	"s",
	"strike",
	"del",
	"code",
	"pre",
	"tg-spoiler"
]);
const TELEGRAM_ATTR_HTML_TAG_PATTERNS = /* @__PURE__ */ new Map([
	["a", /^\s+href="[^"]+"\s*$/],
	["span", /^\s+class="tg-spoiler"\s*$/],
	["tg-emoji", /^\s+emoji-id="[^"]+"\s*$/],
	["tg-time", /^\s+unix="[1-9]\d*"(?:\s+format="(?:r|w?[dD]?[tT]?)")?\s*$/],
	["blockquote", /^(\s+expandable)?\s*$/]
]);
const TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN = /^\s+class="language-[^"]+"\s*$/;
const TELEGRAM_LEGACY_HTML_TAG_SUPPORT = {
	simpleTags: TELEGRAM_SIMPLE_HTML_TAGS,
	attrPatterns: TELEGRAM_ATTR_HTML_TAG_PATTERNS
};
let fileReferencePattern;
let orphanedTldPattern;
function popLastTagName(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index] === name) {
		tags.splice(index, 1);
		return true;
	}
	return false;
}
function isSupportedTelegramHtmlTag(rawTag, support) {
	const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
	if (!match) return false;
	const closing = match[1] === "/";
	const name = normalizeLowercaseStringOrEmpty(match[2]);
	const attrs = match[3] ?? "";
	if (closing) return attrs.trim() === "" && (support.simpleTags.has(name) || support.attrPatterns.has(name));
	if (name === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) return true;
	if (support.attrPatterns.get(name)?.test(attrs)) return true;
	return support.simpleTags.has(name) && attrs.trim() === "";
}
function hasOpenTelegramHtmlTag(tags, name) {
	return tags.includes(name);
}
function preserveTelegramHtmlTag(rawTag, openTags, escapeTag, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	const match = HTML_MODE_TAG_PATTERN.exec(rawTag);
	if (!match) return escapeTag(rawTag);
	const closing = match[1] === "/";
	const tagName = normalizeLowercaseStringOrEmpty(match[2]);
	const attrs = match[3] ?? "";
	if (!closing && tagName === "code" && TELEGRAM_CODE_LANGUAGE_ATTR_PATTERN.test(attrs)) {
		openTags.push(tagName);
		if (hasOpenTelegramHtmlTag(openTags, "pre")) return rawTag;
		return "<code>";
	}
	if (!isSupportedTelegramHtmlTag(rawTag, support)) return escapeTag(rawTag);
	if (closing) return popLastTagName(openTags, tagName) ? rawTag : escapeTag(rawTag);
	if (rawTag.trimEnd().endsWith("/>")) return rawTag;
	openTags.push(tagName);
	return rawTag;
}
function escapeUnsupportedTelegramHtml(text, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	let result = "";
	let index = 0;
	const openTags = [];
	while (index < text.length) {
		const char = text[index];
		if (char === "&") {
			const entityEnd = findTelegramHtmlEntityEnd(text, index);
			if (entityEnd !== -1) {
				result += text.slice(index, entityEnd + 1);
				index = entityEnd + 1;
			} else {
				result += "&amp;";
				index += 1;
			}
			continue;
		}
		if (char === "<") {
			const end = text.indexOf(">", index + 1);
			if (end !== -1) {
				const rawTag = text.slice(index, end + 1);
				result += preserveTelegramHtmlTag(rawTag, openTags, escapeHtml, support);
				index = end + 1;
			} else {
				result += "&lt;";
				index += 1;
			}
			continue;
		}
		if (char === ">") {
			result += "&gt;";
			index += 1;
			continue;
		}
		result += char;
		index += 1;
	}
	return result;
}
function stripTelegramHtmlForPlainText(html) {
	return decodeTelegramHtmlEntities(html.replace(TELEGRAM_HTML_BREAK_PATTERN, "\n").replace(TELEGRAM_HTML_TAG_PATTERN, ""));
}
function countTelegramHtmlVisibleCharacters(html) {
	return stripTelegramHtmlForPlainText(html).length;
}
function resolveTelegramHtmlVisibleText(html) {
	return stripTelegramHtmlForPlainText(html);
}
function encodePlainTextForTelegramHtmlStrip(text) {
	return text.replace(/[&<>]/g, (char) => {
		switch (char) {
			case "&": return "&amp;";
			case "<": return "&lt;";
			case ">": return "&gt;";
			default: return char;
		}
	});
}
function telegramHtmlToPlainTextFallback(html) {
	const withPlainTables = html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml) => {
		return parseTelegramRichHtmlTableRows(tableHtml).map((row) => row.join(" | ")).join("\n");
	});
	TELEGRAM_HTML_ANCHOR_PATTERN.lastIndex = 0;
	return stripTelegramHtmlForPlainText(withPlainTables.replace(TELEGRAM_HTML_ANCHOR_PATTERN, (_match, doubleQuotedHref, singleQuotedHref, unquotedHref, labelHtml) => {
		const href = decodeTelegramHtmlEntities(doubleQuotedHref ?? singleQuotedHref ?? unquotedHref ?? "").trim();
		const label = stripTelegramHtmlForPlainText(labelHtml).trim();
		if (!href) return encodePlainTextForTelegramHtmlStrip(label);
		return encodePlainTextForTelegramHtmlStrip(!label || label === href ? href : `${label} (${href})`);
	}));
}
function promoteEscapedSupportedTelegramTags(text, openTags, support) {
	ESCAPED_HTML_TAG_PATTERN.lastIndex = 0;
	return text.replace(ESCAPED_HTML_TAG_PATTERN, (match, closing, name, attrs) => preserveTelegramHtmlTag(`<${closing}${name}${attrs}>`, openTags, () => match, support));
}
function preserveSupportedTelegramHtmlTags(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	let codeDepth = 0;
	let preDepth = 0;
	let result = "";
	let lastIndex = 0;
	const openEscapedTags = [];
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		const tagName = tag.name;
		const isClosing = tag.closing;
		const textBefore = html.slice(lastIndex, tagStart);
		result += codeDepth > 0 || preDepth > 0 ? textBefore : promoteEscapedSupportedTelegramTags(textBefore, openEscapedTags, support);
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		result += html.slice(tagStart, tagEnd);
		lastIndex = tagEnd;
	}
	const remainingText = html.slice(lastIndex);
	result += codeDepth > 0 || preDepth > 0 ? remainingText : promoteEscapedSupportedTelegramTags(remainingText, openEscapedTags, support);
	return result;
}
function renderSupportedTelegramHtml(html, support = TELEGRAM_LEGACY_HTML_TAG_SUPPORT) {
	return protectTelegramAssistantTranscriptRoleHeaders(preserveSupportedTelegramHtmlTags(html, support));
}
function getFileReferencePattern() {
	if (fileReferencePattern) return fileReferencePattern;
	const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
	fileReferencePattern = new RegExp(`(^|[^a-zA-Z0-9_\\-/])([a-zA-Z0-9_.\\-./]+\\.(?:${fileExtensionsPattern}))(?=$|[^a-zA-Z0-9_\\-/])`, "gi");
	return fileReferencePattern;
}
function getOrphanedTldPattern() {
	if (orphanedTldPattern) return orphanedTldPattern;
	const fileExtensionsPattern = Array.from(FILE_REF_EXTENSIONS_WITH_TLD).map(escapeRegex).join("|");
	orphanedTldPattern = new RegExp(`([^a-zA-Z0-9]|^)([A-Za-z]\\.(?:${fileExtensionsPattern}))(?=[^a-zA-Z0-9/]|$)`, "g");
	return orphanedTldPattern;
}
function wrapStandaloneFileRef(match, prefix, filename) {
	if (filename.startsWith("//")) return match;
	if (/https?:\/\/$/i.test(prefix)) return match;
	return `${prefix}<code>${escapeHtml(filename)}</code>`;
}
function wrapSegmentFileRefs(text, codeDepth, preDepth, anchorDepth) {
	if (!text || codeDepth > 0 || preDepth > 0 || anchorDepth > 0) return text;
	return text.replace(getFileReferencePattern(), wrapStandaloneFileRef).replace(getOrphanedTldPattern(), (match, prefix, tld) => prefix === ">" ? match : `${prefix}<code>${escapeHtml(tld)}</code>`);
}
function wrapFileReferencesInHtml(html) {
	let codeDepth = 0;
	let preDepth = 0;
	let anchorDepth = 0;
	let result = "";
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		const isClosing = tag.closing;
		const tagName = tag.name;
		const textBefore = html.slice(lastIndex, tagStart);
		result += wrapSegmentFileRefs(textBefore, codeDepth, preDepth, anchorDepth);
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else if (tagName === "pre") preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
		else if (tagName === "a") anchorDepth = isClosing ? Math.max(0, anchorDepth - 1) : anchorDepth + 1;
		result += html.slice(tagStart, tagEnd);
		lastIndex = tagEnd;
	}
	const remainingText = html.slice(lastIndex);
	result += wrapSegmentFileRefs(remainingText, codeDepth, preDepth, anchorDepth);
	return result;
}
function renderTelegramHtmlText(text, options = {}) {
	if ((options.textMode ?? "markdown") === "html") return escapeUnsupportedTelegramHtmlWithTableFallback(text);
	return markdownToTelegramHtml(text, { tableMode: options.tableMode });
}
function escapeUnsupportedTelegramHtmlWithTableFallback(html) {
	return escapeUnsupportedTelegramHtml(normalizeTelegramLegacyHtmlTables(html), TELEGRAM_LEGACY_HTML_TAG_SUPPORT);
}
function isInsideTelegramHtmlCodeContext(html, offset) {
	let codeDepth = 0;
	let preDepth = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		if (tag.start >= offset) break;
		const tagName = tag.name;
		if (tagName !== "code" && tagName !== "pre") continue;
		const isClosing = tag.closing;
		if (tagName === "code") codeDepth = isClosing ? Math.max(0, codeDepth - 1) : codeDepth + 1;
		else preDepth = isClosing ? Math.max(0, preDepth - 1) : preDepth + 1;
	}
	return codeDepth > 0 || preDepth > 0;
}
function normalizeTelegramLegacyHtmlTables(html) {
	TELEGRAM_RICH_HTML_TABLE_PATTERN.lastIndex = 0;
	return html.replace(TELEGRAM_RICH_HTML_TABLE_PATTERN, (tableHtml, offset) => {
		if (isInsideTelegramHtmlCodeContext(html, offset)) return tableHtml;
		const rows = parseTelegramRichHtmlTableRows(tableHtml);
		return rows.length ? renderTelegramRichHtmlRawTableFallback(tableHtml, rows) : tableHtml;
	});
}
function parseTelegramHtmlColspan(attrs) {
	const raw = TELEGRAM_HTML_COLSPAN_PATTERN.exec(attrs)?.[2];
	const value = raw ? Number.parseInt(raw, 10) : 1;
	return Number.isFinite(value) && value > 1 ? Math.min(value, 21) : 1;
}
function parseTelegramRichHtmlTableRows(tableHtml) {
	const rows = [];
	TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.lastIndex = 0;
	let rowMatch;
	while ((rowMatch = TELEGRAM_RICH_HTML_TABLE_ROW_PATTERN.exec(tableHtml)) !== null) {
		const rowHtml = rowMatch[1] ?? "";
		const row = [];
		TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.lastIndex = 0;
		let cellMatch;
		while ((cellMatch = TELEGRAM_RICH_HTML_TABLE_CELL_PATTERN.exec(rowHtml)) !== null) {
			const attrs = cellMatch[2] ?? "";
			const text = telegramHtmlToPlainTextFallback(cellMatch[3] ?? "").replace(/\s+/g, " ").trim();
			row.push(text, ...Array.from({ length: parseTelegramHtmlColspan(attrs) - 1 }, () => ""));
		}
		if (row.length) rows.push(row);
	}
	return rows;
}
function renderTelegramRichHtmlRawTableFallback(tableHtml, rows) {
	const columnCount = Math.max(...rows.map((row) => row.length), 0);
	const widths = Array.from({ length: columnCount }, () => 3);
	for (const row of rows) for (let index = 0; index < columnCount; index += 1) widths[index] = Math.max(widths[index] ?? 3, row[index]?.length ?? 0);
	return `<pre><code>${escapeHtml([rows.length > 0 ? telegramHtmlToPlainTextFallback(TELEGRAM_HTML_CAPTION_PATTERN.exec(tableHtml)?.[1] ?? "").trim() : "", rows.length > 0 ? rows.map((row) => `| ${widths.map((width, index) => (row[index] ?? "").padEnd(width)).join(" | ")} |`).join("\n") : stripTelegramHtmlForPlainText(tableHtml).trim()].filter(Boolean).join("\n"))}</code></pre>\n\n`;
}
function buildTelegramHtmlOpenPrefix(tags) {
	return tags.map((tag) => tag.openTag).join("");
}
function buildTelegramHtmlCloseSuffix(tags) {
	return tags.slice().toReversed().map((tag) => tag.closeTag).join("");
}
function buildTelegramHtmlCloseSuffixLength(tags) {
	return tags.reduce((total, tag) => total + tag.closeTag.length, 0);
}
function clampToSurrogateBoundary(text, index) {
	const high = text.charCodeAt(index - 1);
	const low = text.charCodeAt(index);
	if (!(index > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return index;
	return index > 1 ? index - 1 : index + 1;
}
function findTelegramHtmlWordSafeSplitIndex(text, end) {
	let lastNewline = 0;
	let lastWhitespace = 0;
	for (let index = 1; index < end; index += 1) {
		const char = text[index];
		if (char === "\n") lastNewline = index + 1;
		else if (char !== void 0 && /\s/.test(char)) lastWhitespace = index + 1;
	}
	return lastNewline > 0 ? lastNewline : lastWhitespace;
}
function findTelegramHtmlSafeSplitIndex(text, maxLength) {
	if (text.length <= maxLength) return text.length;
	const entitySafeIndex = findTelegramHtmlEntitySafeSplitIndex(text, Math.max(1, Math.floor(maxLength)));
	const wordSafeIndex = findTelegramHtmlWordSafeSplitIndex(text, entitySafeIndex);
	return clampToSurrogateBoundary(text, wordSafeIndex > 0 ? wordSafeIndex : entitySafeIndex);
}
function findTelegramHtmlEntitySafeSplitIndex(text, normalizedMaxLength) {
	const lastAmpersand = text.lastIndexOf("&", normalizedMaxLength - 1);
	if (lastAmpersand === -1) return normalizedMaxLength;
	if (lastAmpersand < text.lastIndexOf(";", normalizedMaxLength - 1)) return normalizedMaxLength;
	const entityEnd = findTelegramHtmlEntityEnd(text, lastAmpersand);
	if (entityEnd === -1 || entityEnd < normalizedMaxLength) return normalizedMaxLength;
	return lastAmpersand;
}
function popTelegramHtmlTag(tags, name) {
	for (let index = tags.length - 1; index >= 0; index -= 1) if (tags[index]?.name === name) {
		tags.splice(index, 1);
		return;
	}
}
function splitTelegramHtmlChunksRaw(html, limit) {
	if (!html) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	if (html.length <= normalizedLimit) return [html];
	const chunks = [];
	const openTags = [];
	const suppressedTagNames = [];
	let current = "";
	let chunkHasPayload = false;
	const resetCurrent = () => {
		current = buildTelegramHtmlOpenPrefix(openTags);
		chunkHasPayload = false;
	};
	const flushCurrent = () => {
		if (!chunkHasPayload) return;
		chunks.push(`${current}${buildTelegramHtmlCloseSuffix(openTags)}`);
		resetCurrent();
	};
	const appendText = (segment) => {
		let remaining = segment;
		while (remaining.length > 0) {
			const available = normalizedLimit - current.length - buildTelegramHtmlCloseSuffixLength(openTags);
			if (available <= 0) {
				if (!chunkHasPayload) {
					suppressedTagNames.push(...openTags.map((tag) => tag.name));
					openTags.length = 0;
					resetCurrent();
					continue;
				}
				flushCurrent();
				continue;
			}
			if (remaining.length <= available) {
				current += remaining;
				chunkHasPayload = true;
				break;
			}
			const splitAt = findTelegramHtmlSafeSplitIndex(remaining, available);
			if (splitAt <= 0) {
				if (!chunkHasPayload) throw new Error(`Telegram HTML chunk limit exceeded by leading entity (limit=${normalizedLimit})`);
				flushCurrent();
				continue;
			}
			current += remaining.slice(0, splitAt);
			chunkHasPayload = true;
			remaining = remaining.slice(splitAt);
			flushCurrent();
		}
	};
	resetCurrent();
	let lastIndex = 0;
	for (const tag of tokenizeHtmlTags(html)) {
		const tagStart = tag.start;
		const tagEnd = tag.end;
		appendText(html.slice(lastIndex, tagStart));
		const rawTag = tag.raw;
		const isClosing = tag.closing;
		const tagName = tag.name;
		const isSelfClosing = !isClosing && rawTag.trimEnd().endsWith("/>");
		if (!isClosing) {
			const nextCloseLength = isSelfClosing ? 0 : `</${tagName}>`.length;
			if (chunkHasPayload && current.length + rawTag.length + buildTelegramHtmlCloseSuffixLength(openTags) + nextCloseLength > normalizedLimit) flushCurrent();
		}
		const closesOpenTag = isClosing && openTags.some((openTag) => openTag.name === tagName);
		if (!(isClosing && !closesOpenTag && popLastTagName(suppressedTagNames, tagName))) current += rawTag;
		if (isSelfClosing) chunkHasPayload = true;
		if (isClosing) popTelegramHtmlTag(openTags, tagName);
		else if (!isSelfClosing) openTags.push({
			name: tagName,
			openTag: rawTag,
			closeTag: `</${tagName}>`
		});
		lastIndex = tagEnd;
	}
	appendText(html.slice(lastIndex));
	flushCurrent();
	return chunks.length > 0 ? chunks : [html];
}
function splitTelegramHtmlChunks(html, limit) {
	const chunks = splitTelegramHtmlChunksRaw(html, limit);
	if (chunks.every((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk) === chunk)) return chunks;
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const protectedContentLimit = normalizedLimit - 24;
	if (protectedContentLimit < 1) throw new Error(`Telegram HTML chunk limit cannot fit assistant transcript marker (limit=${normalizedLimit})`);
	return splitTelegramHtmlChunksRaw(html, protectedContentLimit).map((chunk) => protectTelegramAssistantTranscriptRoleHeaders(chunk));
}
function renderTelegramChunkHtml(ir) {
	return wrapFileReferencesInHtml(renderSupportedTelegramHtml(renderTelegramHtml(ir)));
}
function renderTelegramChunksWithinHtmlLimit(ir, limit) {
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit,
		renderChunk: renderTelegramChunkHtml,
		measureRendered: (html) => html.length
	}).map(({ source, rendered }) => ({
		html: rendered,
		text: source.text
	}));
}
function markdownToTelegramChunks(markdown, limit, options = {}) {
	return renderTelegramChunksWithinHtmlLimit(parseTelegramLegacyMarkdown(markdown, options.tableMode), limit);
}
function markdownToTelegramHtmlChunks(markdown, limit, options = {}) {
	return markdownToTelegramChunks(markdown, limit, options).map((chunk) => chunk.html);
}
//#endregion
//#region extensions/telegram/src/bot/inbound-text-entities.ts
const TELEGRAM_ENTITY_MARKDOWN_PRIORITY = {
	blockquote: 0,
	expandable_blockquote: 0,
	bold: 10,
	italic: 20,
	underline: 30,
	strikethrough: 40,
	spoiler: 50,
	text_link: 60,
	code: 70,
	pre: 80
};
const SPLITTABLE_FORMATTING_ENTITY_TYPES = /* @__PURE__ */ new Set([
	"bold",
	"italic",
	"underline",
	"strikethrough",
	"spoiler"
]);
function isTelegramBlockquoteEntity(entity) {
	return entity.type === "blockquote" || entity.type === "expandable_blockquote";
}
function hasValidTelegramEntityRange(text, entity) {
	return Number.isInteger(entity.offset) && Number.isInteger(entity.length) && entity.offset >= 0 && entity.length > 0 && entity.offset + entity.length <= text.length;
}
function longestBacktickRun(text) {
	let longest = 0;
	let current = 0;
	for (const char of text) if (char === "`") {
		current += 1;
		longest = Math.max(longest, current);
	} else current = 0;
	return longest;
}
function markdownInlineCodeDelimiters(content) {
	const delimiter = "`".repeat(longestBacktickRun(content) + 1);
	if (content.startsWith(" ") || content.endsWith(" ")) return [`${delimiter} `, ` ${delimiter}`];
	return [delimiter, delimiter];
}
function markdownPreAffixes(entity, content) {
	const language = entity.language?.replace(/[\s`]+/g, "").trim();
	const fence = "`".repeat(Math.max(3, longestBacktickRun(content) + 1));
	return [language ? `${fence}${language}\n` : `${fence}\n`, content.endsWith("\n") ? fence : `\n${fence}`];
}
function markdownAffixesForTelegramEntity(entity, content) {
	switch (entity.type) {
		case "blockquote":
		case "expandable_blockquote": return ["> ", ""];
		case "bold": return ["**", "**"];
		case "italic": return ["_", "_"];
		case "underline": return ["__", "__"];
		case "strikethrough": return ["~~", "~~"];
		case "spoiler": return ["||", "||"];
		case "code": return markdownInlineCodeDelimiters(content);
		case "pre": return markdownPreAffixes(entity, content);
		case "text_link": return ["[", `](${entity.url})`];
		default: return null;
	}
}
function splitTelegramFormattingAtQuoteEdges(text, entity, quoteEdges) {
	if (!SPLITTABLE_FORMATTING_ENTITY_TYPES.has(entity.type)) return [entity];
	const entityEnd = entity.offset + entity.length;
	const interiorEdges = quoteEdges.filter((offset) => entity.offset < offset && offset < entityEnd);
	if (interiorEdges.length === 0) return [entity];
	const segments = [];
	let segmentStart = entity.offset;
	for (const edge of [...interiorEdges, entityEnd]) {
		let segmentEnd = edge;
		while (segmentStart < segmentEnd && /\s/u.test(text.charAt(segmentStart))) segmentStart += 1;
		while (segmentEnd > segmentStart && /\s/u.test(text.charAt(segmentEnd - 1))) segmentEnd -= 1;
		if (segmentStart < segmentEnd) segments.push({
			...entity,
			offset: segmentStart,
			length: segmentEnd - segmentStart
		});
		segmentStart = edge;
	}
	return segments;
}
function resolveTelegramBlockquoteClose(text, start, end) {
	let presentBreaks = 0;
	let offset = end;
	while (offset > start && text.charAt(offset - 1) === "\n") {
		presentBreaks += 1;
		offset -= text.charAt(offset - 2) === "\r" ? 2 : 1;
	}
	offset = end;
	while (offset < text.length) if (text.charAt(offset) === "\n") {
		presentBreaks += 1;
		offset += 1;
	} else if (text.charAt(offset) === "\r" && text.charAt(offset + 1) === "\n") {
		presentBreaks += 1;
		offset += 2;
	} else break;
	const missingBreaks = (end < text.length ? 2 : 1) - presentBreaks;
	return (text.charAt(end) === "\r" || text.charAt(end - 2) === "\r" ? "\r\n" : "\n").repeat(Math.max(0, missingBreaks));
}
function renderTelegramTextEntities(text, entities) {
	if (!text || !entities?.length) return text;
	const quotedLineStarts = /* @__PURE__ */ new Set();
	const quoteEdges = /* @__PURE__ */ new Set();
	for (const entity of entities) {
		if (!isTelegramBlockquoteEntity(entity) || !hasValidTelegramEntityRange(text, entity)) continue;
		const end = entity.offset + entity.length;
		quoteEdges.add(entity.offset);
		quoteEdges.add(end);
		for (let offset = entity.offset + 1; offset < end; offset += 1) if (text[offset - 1] === "\n") quotedLineStarts.add(offset);
	}
	const sortedQuoteEdges = [...quoteEdges].toSorted((left, right) => left - right);
	const boundaries = /* @__PURE__ */ new Map();
	const addBoundary = (offset, boundary) => {
		const entries = boundaries.get(offset);
		if (entries) entries.push(boundary);
		else boundaries.set(offset, [boundary]);
	};
	entities.forEach((entity, index) => {
		if (!hasValidTelegramEntityRange(text, entity)) return;
		for (const segment of splitTelegramFormattingAtQuoteEdges(text, entity, sortedQuoteEdges)) {
			const affixes = markdownAffixesForTelegramEntity(segment, text.slice(segment.offset, segment.offset + segment.length));
			if (!affixes) continue;
			const end = segment.offset + segment.length;
			if (isTelegramBlockquoteEntity(segment)) affixes[1] = resolveTelegramBlockquoteClose(text, segment.offset, end);
			const boundary = {
				open: affixes[0],
				close: affixes[1],
				start: segment.offset,
				end,
				length: segment.length,
				priority: TELEGRAM_ENTITY_MARKDOWN_PRIORITY[segment.type] ?? 100,
				index
			};
			addBoundary(boundary.start, boundary);
			addBoundary(boundary.end, boundary);
		}
	});
	if (boundaries.size === 0) return text;
	let result = "";
	for (let offset = 0; offset <= text.length; offset += 1) {
		if (quotedLineStarts.has(offset)) result += "> ";
		const boundary = boundaries.get(offset);
		if (boundary) {
			boundary.filter((entity) => entity.end === offset).toSorted((a, b) => a.length - b.length || b.priority - a.priority || b.index - a.index).forEach((entity) => {
				result += entity.close;
			});
			boundary.filter((entity) => entity.start === offset).toSorted((a, b) => b.length - a.length || a.priority - b.priority || a.index - b.index).forEach((entity) => {
				result += entity.open;
			});
		}
		if (offset < text.length) result += text[offset];
	}
	return result;
}
//#endregion
//#region extensions/telegram/src/bot/body-helpers.ts
function buildSenderName(msg) {
	return [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(" ").trim() || msg.from?.username || void 0;
}
function resolveTelegramPrimaryMedia(msg) {
	if (!msg) return;
	const photo = msg.photo?.[msg.photo.length - 1];
	if (photo) return {
		kind: "image",
		fileRef: photo
	};
	if (msg.video) return {
		kind: "video",
		fileRef: msg.video
	};
	if (msg.video_note) return {
		kind: "video",
		fileRef: msg.video_note
	};
	if (msg.audio) return {
		kind: "audio",
		fileRef: msg.audio
	};
	if (msg.voice) return {
		kind: "audio",
		fileRef: msg.voice
	};
	if (msg.document) return {
		kind: "document",
		fileRef: msg.document
	};
	if (msg.sticker) return {
		kind: "sticker",
		fileRef: msg.sticker
	};
}
function buildSenderLabel(msg, senderId) {
	const name = buildSenderName(msg);
	const username = msg.from?.username ? `@${msg.from.username}` : void 0;
	let label = name;
	if (name && username) label = `${name} (${username})`;
	else if (!name && username) label = username;
	const fallbackId = (senderId != null ? normalizeOptionalString(String(senderId)) : void 0) ?? (msg.from?.id != null ? String(msg.from.id) : void 0);
	const idPart = fallbackId ? `id:${fallbackId}` : void 0;
	if (label && idPart) return `${label} ${idPart}`;
	if (label) return label;
	return idPart ?? "id:unknown";
}
const TELEGRAM_RICH_MESSAGE_PLACEHOLDER = "[unsupported Telegram rich_message received]";
function compactRichText(value) {
	return value.split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
}
function joinRichText(parts, separator) {
	return parts.map(compactRichText).filter(Boolean).join(separator);
}
function renderRichInlineText(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(renderRichInlineText).filter(Boolean).join("");
	if (!isRecord(value)) return "";
	const directText = value.text;
	if (directText !== void 0) return renderRichInlineText(directText);
	for (const key of ["alternative_text", "expression"]) {
		const text = value[key];
		if (typeof text === "string") return text;
	}
	return "";
}
function renderRichBlocks(value) {
	if (Array.isArray(value)) return joinRichText(value.map(renderRichBlocks), "\n");
	if (!isRecord(value)) return renderRichInlineText(value);
	if (typeof value.markdown === "string") return value.markdown;
	if (typeof value.html === "string") return telegramHtmlToPlainTextFallback(value.html);
	const parts = [];
	for (const key of [
		"text",
		"summary",
		"label",
		"title",
		"subtitle",
		"credit",
		"expression"
	]) parts.push(renderRichInlineText(value[key]));
	if (value.caption !== void 0) {
		const caption = value.caption;
		if (isRecord(caption) && caption.credit !== void 0) parts.push(joinRichText([renderRichInlineText(caption.text), renderRichInlineText(caption.credit)], "\n"));
		else parts.push(renderRichInlineText(caption));
	}
	for (const key of [
		"blocks",
		"items",
		"rows",
		"cells",
		"headers",
		"children"
	]) parts.push(renderRichBlocks(value[key]));
	return joinRichText(parts, "\n");
}
function resolveTelegramRichMessagePlaceholder(msg) {
	return isRecord(msg.rich_message) ? TELEGRAM_RICH_MESSAGE_PLACEHOLDER : void 0;
}
function resolveTelegramRichMessageText(msg) {
	if (!isRecord(msg.rich_message)) return;
	return compactRichText(renderRichBlocks(msg.rich_message)) || void 0;
}
function resolveTelegramRichMessageBody(msg) {
	return resolveTelegramRichMessageText(msg) ?? resolveTelegramRichMessagePlaceholder(msg);
}
function isBinaryContent(text) {
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		if (code <= 31 && code !== 9 && code !== 10 && code !== 13) return true;
	}
	return false;
}
function resolveTelegramTextContent(text, caption) {
	const raw = typeof text === "string" ? text : typeof caption === "string" ? caption : "";
	return isBinaryContent(raw) ? "" : raw;
}
function formatTelegramPollText(poll) {
	const correctOptionIds = new Set(poll.correct_option_ids ?? []);
	const optionLines = poll.options.map((option, index) => {
		const optionText = renderTelegramTextEntities(option.text, option.text_entities);
		const voteLabel = option.voter_count === 1 ? "vote" : "votes";
		const correctLabel = correctOptionIds.has(index) ? " (correct)" : "";
		return `${index + 1}. ${optionText} — ${option.voter_count} ${voteLabel}${correctLabel}`;
	});
	return [
		`[Poll] ${renderTelegramTextEntities(poll.question, poll.question_entities)}`,
		...poll.description ? [renderTelegramTextEntities(poll.description, poll.description_entities)] : [],
		...optionLines,
		`Total voters: ${poll.total_voter_count}`,
		`Type: ${poll.type}`,
		`Visibility: ${poll.is_anonymous ? "anonymous" : "public"}`,
		`Selection: ${poll.allows_multiple_answers ? "multiple answers" : "single answer"}`,
		`Status: ${poll.is_closed ? "closed" : "open"}`,
		...poll.explanation ? [`Explanation: ${renderTelegramTextEntities(poll.explanation, poll.explanation_entities)}`] : []
	].join("\n");
}
function getTelegramTextParts(msg) {
	const text = resolveTelegramTextContent(msg.text, msg.caption);
	if (text) return {
		text,
		entities: msg.entities ?? msg.caption_entities ?? []
	};
	return {
		text: msg.poll ? formatTelegramPollText(msg.poll) : "",
		entities: []
	};
}
function joinTelegramTextParts(messages, separator) {
	const textParts = [];
	const entities = [];
	let offset = 0;
	for (const message of messages) {
		const textPart = getTelegramTextParts(message);
		if (!textPart.text) continue;
		if (textParts.length > 0) offset += separator.length;
		entities.push(...textPart.entities.map((entity) => ({
			...entity,
			offset: entity.offset + offset
		})));
		textParts.push(textPart.text);
		offset += textPart.text.length;
	}
	return {
		text: textParts.join(separator),
		entities
	};
}
function isTelegramMentionWordChar(char) {
	return char != null && /[a-z0-9_]/i.test(char);
}
function hasStandaloneTelegramMention(text, mention) {
	let startIndex = 0;
	while (startIndex < text.length) {
		const idx = text.indexOf(mention, startIndex);
		if (idx === -1) return false;
		const prev = idx > 0 ? text[idx - 1] : void 0;
		const next = text[idx + mention.length];
		if (!isTelegramMentionWordChar(prev) && !isTelegramMentionWordChar(next)) return true;
		startIndex = idx + 1;
	}
	return false;
}
function isBotCommandAddressedToMention(command, mention) {
	const normalized = normalizeLowercaseStringOrEmpty(command);
	if (!normalized.startsWith("/") || !normalized.endsWith(mention)) return false;
	return normalized.lastIndexOf(mention) > 1;
}
function hasBotMention(msg, botUsername) {
	const { text, entities } = getTelegramTextParts(msg);
	const mention = normalizeLowercaseStringOrEmpty(`@${botUsername}`);
	if (hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), mention)) return true;
	for (const ent of entities) {
		const slice = text.slice(ent.offset, ent.offset + ent.length);
		if (ent.type === "mention" && normalizeLowercaseStringOrEmpty(slice) === mention) return true;
		if (ent.type === "bot_command" && isBotCommandAddressedToMention(slice, mention)) return true;
	}
	return false;
}
function hasLeadingBotCommandAddressedToOtherBot(msg, botUsername) {
	const { text, entities } = getTelegramTextParts(msg);
	const normalizedBotUsername = normalizeLowercaseStringOrEmpty(botUsername).replace(/^@/u, "");
	if (!normalizedBotUsername) return false;
	const leadingCommand = entities.find((entity) => entity.type === "bot_command" && entity.offset === 0);
	if (!leadingCommand) return false;
	const target = text.slice(0, leadingCommand.length).match(/^\/[^@\s]+@([a-z0-9_]+)$/iu)?.[1];
	return Boolean(target && target.toLowerCase() !== normalizedBotUsername);
}
function hasBotMentionInText(text, botUsername) {
	return hasStandaloneTelegramMention(normalizeLowercaseStringOrEmpty(text), normalizeLowercaseStringOrEmpty(`@${botUsername}`));
}
function normalizeForwardedUserLabel(user) {
	const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
	const username = normalizeOptionalString(user.username);
	const id = String(user.id);
	return {
		display: (name && username ? `${name} (@${username})` : name || (username ? `@${username}` : void 0)) || `user:${id}`,
		name: name || void 0,
		username,
		id
	};
}
function normalizeForwardedChatLabel(chat, fallbackKind) {
	const title = normalizeOptionalString(chat.title);
	const username = normalizeOptionalString(chat.username);
	const id = String(chat.id);
	return {
		display: title || (username ? `@${username}` : void 0) || `${fallbackKind}:${id}`,
		title,
		username,
		id
	};
}
function buildForwardedContextFromUser(params) {
	const { display, name, username, id } = normalizeForwardedUserLabel(params.user);
	if (!display) return null;
	return {
		from: display,
		date: params.date,
		fromType: params.type,
		fromId: id,
		fromUsername: username,
		fromTitle: name
	};
}
function buildForwardedContextFromHiddenName(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return null;
	return {
		from: trimmed,
		date: params.date,
		fromType: params.type,
		fromTitle: trimmed
	};
}
function buildForwardedContextFromChat(params) {
	const fallbackKind = params.type === "channel" ? "channel" : "chat";
	const { display, title, username, id } = normalizeForwardedChatLabel(params.chat, fallbackKind);
	if (!display) return null;
	const signature = normalizeOptionalString(params.signature);
	const from = signature ? `${display} (${signature})` : display;
	const chatType = normalizeOptionalString(params.chat.type);
	return {
		from,
		date: params.date,
		fromType: params.type,
		fromId: id,
		fromUsername: username,
		fromTitle: title,
		fromSignature: signature,
		fromChatType: chatType,
		fromMessageId: params.messageId
	};
}
function resolveForwardOrigin(origin) {
	switch (origin.type) {
		case "user": return buildForwardedContextFromUser({
			user: origin.sender_user,
			date: origin.date,
			type: "user"
		});
		case "hidden_user": return buildForwardedContextFromHiddenName({
			name: origin.sender_user_name,
			date: origin.date,
			type: "hidden_user"
		});
		case "chat": return buildForwardedContextFromChat({
			chat: origin.sender_chat,
			date: origin.date,
			type: "chat",
			signature: origin.author_signature
		});
		case "channel": return buildForwardedContextFromChat({
			chat: origin.chat,
			date: origin.date,
			type: "channel",
			signature: origin.author_signature,
			messageId: origin.message_id
		});
		default: return null;
	}
}
function normalizeForwardedContext(msg) {
	if (!msg.forward_origin) return null;
	return resolveForwardOrigin(msg.forward_origin);
}
function extractTelegramLocation(msg) {
	const { venue, location } = msg;
	if (venue) return {
		latitude: venue.location.latitude,
		longitude: venue.location.longitude,
		accuracy: venue.location.horizontal_accuracy,
		name: venue.title,
		address: venue.address,
		source: "place",
		isLive: false
	};
	if (location) {
		const isLive = typeof location.live_period === "number" && location.live_period > 0;
		return {
			latitude: location.latitude,
			longitude: location.longitude,
			accuracy: location.horizontal_accuracy,
			source: isLive ? "live" : "pin",
			isLive
		};
	}
	return null;
}
const TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS = 1024;
const TELEGRAM_FORUM_FLAG_CACHE_TTL_MS = 10 * 6e4;
const telegramForumFlagByChatId = /* @__PURE__ */ new Map();
function resetTelegramForumFlagCacheForTest() {
	telegramForumFlagByChatId.clear();
}
function cacheTelegramForumFlag(chatId, isForum, nowMs = Date.now()) {
	const cacheKey = String(chatId);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(TELEGRAM_FORUM_FLAG_CACHE_TTL_MS, { nowMs });
	if (expiresAtMs === void 0) {
		telegramForumFlagByChatId.delete(cacheKey);
		return;
	}
	if (!telegramForumFlagByChatId.has(cacheKey) && telegramForumFlagByChatId.size >= TELEGRAM_FORUM_FLAG_CACHE_MAX_CHATS) {
		const oldestKey = telegramForumFlagByChatId.keys().next().value;
		if (oldestKey !== void 0) telegramForumFlagByChatId.delete(oldestKey);
	}
	telegramForumFlagByChatId.set(cacheKey, {
		expiresAtMs,
		isForum
	});
}
function hadUnsafeTelegramText(raw, sanitized) {
	return typeof raw === "string" && raw.trim().length > 0 && sanitized.trim().length === 0;
}
function shouldUseTelegramDmThreadSession(params) {
	return params.dmThreadId != null && params.botHasTopicsEnabled === true;
}
function resolveTelegramBotHasTopicsEnabled(me) {
	return me !== null && typeof me === "object" && "has_topics_enabled" in me && me.has_topics_enabled === true;
}
function extractTelegramForumFlag(value) {
	if (!value || typeof value !== "object" || !("is_forum" in value)) return;
	const forum = value.is_forum;
	return typeof forum === "boolean" ? forum : void 0;
}
function resolveTelegramMessageForumFlagHint(params) {
	if (params.chatType === "supergroup" && params.isTopicMessage === true) return true;
	return typeof params.isForum === "boolean" ? params.isForum : void 0;
}
async function resolveTelegramForumFlag(params) {
	const forumHint = resolveTelegramMessageForumFlagHint({
		chatType: params.chatType,
		isForum: params.isForum,
		isTopicMessage: params.isTopicMessage
	});
	if (typeof forumHint === "boolean") {
		if (params.isGroup && params.chatType === "supergroup") cacheTelegramForumFlag(params.chatId, forumHint);
		return forumHint;
	}
	if (!params.isGroup || params.chatType !== "supergroup" || !params.getChat) return false;
	const cacheKey = String(params.chatId);
	const rawNowMs = Date.now();
	const nowMs = asDateTimestampMs(rawNowMs);
	const cached = telegramForumFlagByChatId.get(cacheKey);
	if (cached) {
		if (nowMs !== void 0 && asDateTimestampMs(cached.expiresAtMs) !== void 0 && cached.expiresAtMs > nowMs) return cached.isForum;
		telegramForumFlagByChatId.delete(cacheKey);
	}
	try {
		const resolved = extractTelegramForumFlag(await params.getChat(params.chatId)) === true;
		cacheTelegramForumFlag(params.chatId, resolved, rawNowMs);
		return resolved;
	} catch {
		return false;
	}
}
function withResolvedTelegramForumFlag(message, isForum) {
	if (extractTelegramForumFlag(message.chat) === isForum) return message;
	return {
		...message,
		chat: {
			...message.chat,
			is_forum: isForum
		}
	};
}
async function resolveTelegramGroupAllowFromContext(params) {
	const accountId = normalizeAccountId(params.accountId);
	const threadSpec = params.threadSpec ?? resolveTelegramThreadSpec({
		isGroup: params.isGroup ?? false,
		isForum: params.isForum,
		messageThreadId: params.messageThreadId
	});
	const resolvedThreadId = threadSpec.scope === "forum" || threadSpec.scope === "direct-messages" ? threadSpec.id : void 0;
	const dmThreadId = threadSpec.scope === "dm" ? threadSpec.id : void 0;
	const threadIdForConfig = resolvedThreadId ?? dmThreadId;
	const { groupConfig, topicConfig } = params.resolveTelegramGroupConfig(params.chatId, threadIdForConfig, params.cfg);
	const groupAllowOverride = firstDefined(topicConfig?.allowFrom, groupConfig?.allowFrom);
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup: params.isGroup ?? false,
		groupConfig,
		dmPolicy: params.dmPolicy
	});
	return {
		threadSpec,
		resolvedThreadId,
		dmThreadId,
		storeAllowFrom: await loadTelegramPairingStoreIfNeeded({
			cfg: params.cfg,
			allowFrom: params.allowFrom,
			groupAllowOverride,
			accountId,
			senderId: params.senderId,
			isGroup: params.isGroup ?? false,
			effectiveDmPolicy,
			skipPairingStoreRead: params.skipPairingStoreRead,
			readChannelAllowFromStore: params.readChannelAllowFromStore
		}),
		groupConfig,
		topicConfig,
		groupAllowOverride,
		effectiveGroupAllow: normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
			cfg: params.cfg,
			allowFrom: groupAllowOverride ?? params.groupAllowFrom,
			accountId,
			senderId: params.senderId
		})),
		hasGroupAllowOverride: groupAllowOverride !== void 0
	};
}
async function isTelegramDmAllowedByConfiguredAllowFrom(params) {
	const configuredAllowFrom = params.groupAllowOverride ?? params.allowFrom;
	if (!configuredAllowFrom || configuredAllowFrom.length === 0) return false;
	const normalizedAllowFrom = normalizeAllowFrom(await expandTelegramAllowFromWithAccessGroups({
		cfg: params.cfg,
		allowFrom: configuredAllowFrom,
		accountId: params.accountId,
		senderId: params.senderId
	}));
	return normalizedAllowFrom.hasEntries && isSenderAllowed({
		allow: normalizedAllowFrom,
		senderId: params.senderId
	});
}
var TelegramPairingStoreReadError = class extends Error {
	constructor(cause) {
		super(`Telegram pairing store read failed: ${String(cause)}`);
		this.name = "TelegramPairingStoreReadError";
		this.cause = cause;
	}
};
async function loadTelegramPairingStoreIfNeeded(params) {
	if (params.skipPairingStoreRead || params.isGroup || params.effectiveDmPolicy !== "pairing") return [];
	if (await isTelegramDmAllowedByConfiguredAllowFrom({
		cfg: params.cfg,
		allowFrom: params.allowFrom,
		groupAllowOverride: params.groupAllowOverride,
		accountId: params.accountId,
		senderId: params.senderId
	})) return [];
	try {
		return await (params.readChannelAllowFromStore ?? readChannelAllowFromStore)("telegram", process.env, params.accountId);
	} catch (cause) {
		throw new TelegramPairingStoreReadError(cause);
	}
}
/**
* Resolve the thread ID for Telegram forum topics.
* For non-forum groups, returns undefined even if messageThreadId is present
* (reply threads in regular groups should not create separate sessions).
* For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
*/
function resolveTelegramForumThreadId(params) {
	if (!params.isForum) return;
	if (params.messageThreadId == null) return 1;
	return params.messageThreadId;
}
function resolveTelegramThreadSpec(params) {
	if (params.isGroup) {
		const id = resolveTelegramForumThreadId({
			isForum: params.isForum,
			messageThreadId: params.messageThreadId
		});
		return id === void 0 ? { scope: "none" } : {
			id,
			scope: "forum"
		};
	}
	if (params.messageThreadId == null) return { scope: "dm" };
	return {
		id: params.messageThreadId,
		scope: "dm"
	};
}
function resolveTelegramMessageThreadSpec(message, isForum) {
	if (message.chat.is_direct_messages === true) {
		const id = parseStrictPositiveInteger(message.direct_messages_topic?.topic_id);
		return id === void 0 ? { scope: "none" } : {
			id,
			scope: "direct-messages"
		};
	}
	return resolveTelegramThreadSpec({
		isGroup: message.chat.type === "group" || message.chat.type === "supergroup",
		isForum: isForum ?? resolveTelegramMessageForumFlagHint({
			chatType: message.chat.type,
			isForum: message.chat.is_forum,
			isTopicMessage: message.is_topic_message
		}),
		messageThreadId: message.message_thread_id
	});
}
/**
* Build thread params for Telegram API calls (messages, media).
*
* IMPORTANT: Thread IDs behave differently based on chat type:
* - Bot-private topics: Include message_thread_id when present
* - Forum topics: Skip thread_id=1 (General topic), include others
* - Channel Direct Messages topics: Include direct_messages_topic_id
* - Regular groups: Thread IDs are ignored by Telegram
*
* General forum topic (id=1) must be treated like a regular supergroup send:
* Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
*
* @param thread - Thread specification with ID and scope
* @returns API params object or undefined if thread_id should be omitted
*/
function buildTelegramThreadParams(thread) {
	if (thread?.id == null) return;
	const normalized = Math.trunc(thread.id);
	if (!Number.isFinite(normalized)) return;
	if (thread.scope === "dm") return normalized > 0 ? { message_thread_id: normalized } : void 0;
	if (thread.scope === "direct-messages") return normalized > 0 ? { direct_messages_topic_id: normalized } : void 0;
	if (thread.scope === "none") return;
	if (normalized === 1) return;
	return { message_thread_id: normalized };
}
/**
* Build a Telegram routing target that keeps real topic/thread ids in-band.
*
* This is used by generic reply plumbing that may not always carry a separate
* `threadId` field through every hop. General forum topic stays chat-scoped
* because Telegram rejects `message_thread_id=1` for message sends.
*/
function buildTelegramRoutingTarget(chatId, thread) {
	const base = `telegram:${chatId}`;
	const threadParams = buildTelegramThreadParams(thread);
	if (typeof threadParams?.direct_messages_topic_id === "number") return `${base}:direct-topic:${threadParams.direct_messages_topic_id}`;
	if (typeof threadParams?.message_thread_id !== "number") return base;
	return `${base}:topic:${threadParams.message_thread_id}`;
}
/**
* Build the canonical Telegram inbound origin used by queued follow-up routing.
* Bot-private thread ids remain metadata-only; group topic ids must be in-band.
*/
function buildTelegramInboundOriginTarget(chatId, thread) {
	if (thread?.scope !== "forum" && thread?.scope !== "direct-messages") return `telegram:${chatId}`;
	return buildTelegramRoutingTarget(chatId, thread);
}
/**
* Build thread params for typing indicators (sendChatAction).
* Empirically, General topic (id=1) needs message_thread_id for typing to appear.
*/
function buildTypingThreadParams(messageThreadId) {
	if (messageThreadId == null) return;
	return { message_thread_id: Math.trunc(messageThreadId) };
}
function resolveTelegramStreamMode(telegramCfg) {
	return resolveTelegramPreviewStreamMode(telegramCfg);
}
function buildTelegramGroupPeerId(chatId, messageThreadId) {
	return messageThreadId != null ? `${chatId}:topic:${messageThreadId}` : String(chatId);
}
function buildTelegramGroupFrom(chatId, messageThreadId) {
	return `telegram:group:${buildTelegramGroupPeerId(chatId, messageThreadId)}`;
}
function isTelegramCommandsAllowFromConfigured(cfg) {
	const commandsAllowFrom = cfg.commands?.allowFrom;
	return commandsAllowFrom != null && typeof commandsAllowFrom === "object" && (Array.isArray(commandsAllowFrom.telegram) || Array.isArray(commandsAllowFrom["*"]));
}
function resolveTelegramCommandAuthorization(params) {
	return resolveCommandAuthorization({
		ctx: {
			Provider: "telegram",
			Surface: "telegram",
			OriginatingChannel: "telegram",
			AccountId: params.accountId,
			ChatType: params.isGroup ? "group" : "direct",
			From: params.isGroup ? buildTelegramGroupFrom(params.chatId, params.resolvedThreadId) : `telegram:${params.chatId}`,
			SenderId: params.senderId || void 0,
			SenderUsername: params.senderUsername || void 0
		},
		cfg: params.cfg,
		commandAuthorized: false
	});
}
/**
* Build parentPeer for forum topic binding inheritance.
* When a message comes from a forum topic, the peer ID includes the topic suffix
* (e.g., `-1001234567890:topic:99`). To allow bindings configured for the base
* group ID to match, we provide the parent group as `parentPeer` so the routing
* layer can fall back to it when the exact peer doesn't match.
*/
function buildTelegramParentPeer(params) {
	if (!params.isGroup || params.resolvedThreadId == null) return;
	return {
		kind: "group",
		id: String(params.chatId)
	};
}
function buildGroupLabel(msg, chatId, messageThreadId) {
	const title = msg.chat?.title;
	const topicSuffix = messageThreadId != null ? ` topic:${messageThreadId}` : "";
	if (title) return `${title} id:${chatId}${topicSuffix}`;
	return `group:${chatId}${topicSuffix}`;
}
function resolveTelegramReplyId(raw) {
	return normalizeTelegramReplyToMessageId(raw);
}
function describeReplyTarget(msg) {
	const reply = msg.reply_to_message;
	const externalReply = msg.external_reply;
	const quote = msg.quote ?? externalReply?.quote;
	const rawQuoteText = quote?.text;
	const quoteText = resolveTelegramTextContent(rawQuoteText);
	let body;
	let kind = "reply";
	const filteredQuoteText = hadUnsafeTelegramText(rawQuoteText, quoteText);
	body = quoteText.trim();
	if (body) kind = "quote";
	const replyLike = reply ?? externalReply;
	const replyMedia = resolveTelegramPrimaryMedia(replyLike);
	const rawReplyText = replyLike && typeof replyLike.text === "string" ? replyLike.text : replyLike && typeof replyLike.caption === "string" ? replyLike.caption : void 0;
	const replyTextParts = replyLike ? getTelegramTextParts(replyLike) : void 0;
	const safeReplyText = replyTextParts?.text ?? "";
	let filteredReplyText = false;
	if (!body && replyLike) {
		const replyBody = safeReplyText.trim() || resolveTelegramRichMessageBody(replyLike) || "";
		filteredReplyText = hadUnsafeTelegramText(rawReplyText, replyBody);
		body = replyBody;
		if (!body) {
			const locationData = extractTelegramLocation(replyLike);
			if (locationData) body = formatLocationText(locationData);
		}
	}
	if (!body && !replyLike) return null;
	if (!body && !replyMedia && !filteredQuoteText && !filteredReplyText) return null;
	const senderLabel = (replyLike ? buildSenderName(replyLike) : void 0) ?? "unknown sender";
	const source = reply ? "reply_to_message" : "external_reply";
	const quotePosition = kind === "quote" && typeof quote?.position === "number" && Number.isFinite(quote.position) ? Math.trunc(quote.position) : void 0;
	const quoteEntities = kind === "quote" && Array.isArray(quote?.entities) ? quote.entities : void 0;
	const forwardedFrom = replyLike ? normalizeForwardedContext(replyLike) ?? void 0 : void 0;
	return {
		id: replyLike?.message_id ? String(replyLike.message_id) : void 0,
		sender: senderLabel,
		senderId: replyLike?.from?.id != null ? String(replyLike.from.id) : void 0,
		senderUsername: replyLike?.from?.username ?? void 0,
		body: body || void 0,
		mediaType: replyMedia?.kind,
		kind,
		source,
		quoteText: kind === "quote" ? quoteText : void 0,
		quotePosition,
		quoteEntities,
		forwardedFrom,
		quoteSourceText: replyTextParts?.text || void 0,
		quoteSourceEntities: replyTextParts?.entities
	};
}
//#endregion
export { hasBotMention as A, renderTelegramTextEntities as B, resolveTelegramThreadSpec as C, buildSenderName as D, buildSenderLabel as E, normalizeForwardedContext as F, markdownToTelegramHtmlChunks as G, escapeTelegramHtml as H, resolveTelegramPrimaryMedia as I, splitTelegramHtmlChunks as J, renderTelegramHtmlText as K, resolveTelegramRichMessageBody as L, hasLeadingBotCommandAddressedToOtherBot as M, isBinaryContent as N, extractTelegramLocation as O, joinTelegramTextParts as P, resolveTelegramPreviewStreamMode as Q, resolveTelegramRichMessagePlaceholder as R, resolveTelegramStreamMode as S, withResolvedTelegramForumFlag as T, markdownToTelegramChunks as U, countTelegramHtmlVisibleCharacters as V, markdownToTelegramHtml as W, wrapFileReferencesInHtml as X, telegramHtmlToPlainTextFallback as Y, decodeTelegramHtmlEntities as Z, resolveTelegramForumThreadId as _, buildTelegramInboundOriginTarget as a, resolveTelegramMessageThreadSpec as b, buildTelegramThreadParams as c, extractTelegramForumFlag as d, isTelegramCommandsAllowFromConfigured as f, resolveTelegramForumFlag as g, resolveTelegramCommandAuthorization as h, buildTelegramGroupPeerId as i, hasBotMentionInText as j, getTelegramTextParts as k, buildTypingThreadParams as l, resolveTelegramBotHasTopicsEnabled as m, buildGroupLabel as n, buildTelegramParentPeer as o, resetTelegramForumFlagCacheForTest as p, resolveTelegramHtmlVisibleText as q, buildTelegramGroupFrom as r, buildTelegramRoutingTarget as s, TelegramPairingStoreReadError as t, describeReplyTarget as u, resolveTelegramGroupAllowFromContext as v, shouldUseTelegramDmThreadSession as w, resolveTelegramReplyId as x, resolveTelegramMessageForumFlagHint as y, resolveTelegramRichMessageText as z };
