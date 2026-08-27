import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as isInsideCode, t as findCodeRegions } from "./code-regions-C2SF8Hgg.js";
//#region src/utils/directive-tags.ts
const AUDIO_TAG_RE = /\[\[\s*audio_as_voice\s*\]\]/gi;
const REPLY_TAG_RE = /\[\[\s*(?:reply_to_current|reply_to\s*:\s*([^\]\n]+))\s*\]\]/gi;
const INLINE_DIRECTIVE_TAG_WITH_PADDING_RE = /(?:\s*(?:\[\[\s*audio_as_voice\s*\]\]|\[\[\s*(?:reply_to_current|reply_to\s*:\s*[^\]\n]+)\s*\]\])\s*|^[\t ]*\[\[\s*(?:reply_to_current(?:[\t ]*\](?!\])|(?=[\t ]+\S)|[\t ]*$)|reply_to\s*:\s*(?:[^\]\r\n]*\](?!\])|[\t ]*$))[\t ]*)/giu;
const MAX_REPLY_DIRECTIVE_ID_LENGTH = 256;
const NO_INLINE_DIRECTIVES = {
	audioAsVoice: false,
	replyToCurrent: false,
	hasAudioTag: false,
	hasReplyTag: false
};
function replacementPreservesWordBoundary(source, offset, length) {
	const before = source[offset - 1];
	const after = source[offset + length];
	return before && after && !/\s/u.test(before) && !/\s/u.test(after) ? " " : "";
}
const BLOCK_SENTINEL_SEED = "";
function createBlockSentinel(text) {
	let sentinel = BLOCK_SENTINEL_SEED;
	while (text.includes(sentinel)) sentinel += BLOCK_SENTINEL_SEED;
	return sentinel;
}
function replaceOutsideCodeRegions(text, regex, replacement) {
	const codeRegions = text.includes("[[") ? findCodeRegions(text) : [];
	return text.replace(regex, (...args) => {
		const match = String(args[0]);
		const offset = args.at(-2);
		return typeof offset === "number" && isInsideCode(offset + match.indexOf("[["), codeRegions) ? match : replacement(match, args.slice(1, -2), Number(offset), text);
	});
}
function normalizeDirectiveWhitespace(text) {
	const blockSentinel = createBlockSentinel(text);
	const blockPlaceholderRe = new RegExp(`${blockSentinel}(\\d+)${blockSentinel}`, "g");
	const blocks = [];
	const codeRegions = text.includes("`") || text.includes("~~~") ? findCodeRegions(text) : [];
	let masked = "";
	let cursor = 0;
	for (const span of codeRegions) {
		blocks.push(text.slice(span.start, span.end));
		masked += `${text.slice(cursor, span.start)}${blockSentinel}${blocks.length - 1}${blockSentinel}`;
		cursor = span.end;
	}
	masked = `${masked}${text.slice(cursor)}`.replace(/(?:(?:^|\n)(?:    |\t)[^\n]*)+/gm, (block) => {
		blocks.push(block);
		return `${blockSentinel}${blocks.length - 1}${blockSentinel}`;
	});
	return masked.replace(/\r\n/g, "\n").replace(/([^\s])[ \t]{2,}([^\s])/g, "$1 $2").replace(/^\n+/, "").replace(/^[ \t](?=\S)/, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trimEnd().replace(blockPlaceholderRe, (_, i) => expectDefined(blocks[Number(i)], "blocks entry at number(i)"));
}
function stripInlineDirectiveTagsForDisplay(text) {
	if (!text) return {
		text,
		changed: false
	};
	const stripped = replaceOutsideCodeRegions(replaceOutsideCodeRegions(text, AUDIO_TAG_RE, () => ""), REPLY_TAG_RE, () => "");
	return {
		text: stripped,
		changed: stripped !== text
	};
}
function stripUnsafeReplyDirectiveChars(value) {
	const chars = [];
	for (const ch of value) {
		const code = ch.charCodeAt(0);
		if (code >= 0 && code <= 31 || code === 127 || code >= 128 && code <= 159 || ch === "[" || ch === "]") continue;
		chars.push(ch);
	}
	return chars.join("");
}
function sanitizeReplyDirectiveId(rawReplyToId) {
	const trimmed = rawReplyToId?.trim();
	if (!trimmed) return;
	const sanitized = stripUnsafeReplyDirectiveChars(trimmed).trim();
	if (!sanitized) return;
	const chars = Array.from(sanitized);
	if (chars.length > MAX_REPLY_DIRECTIVE_ID_LENGTH) return chars.slice(0, MAX_REPLY_DIRECTIVE_ID_LENGTH).join("");
	return sanitized;
}
function stripInlineDirectiveTagsForDelivery(text) {
	if (!text) return {
		text,
		changed: false
	};
	const stripped = replaceOutsideCodeRegions(text, INLINE_DIRECTIVE_TAG_WITH_PADDING_RE, (match) => match.includes("]]") ? " " : "");
	const changed = stripped !== text;
	return {
		text: changed ? stripped.trim() : text,
		changed
	};
}
function parseInlineDirectives(text, options = {}) {
	const { currentMessageId, stripAudioTag = true, stripReplyTags = true } = options;
	if (!text) return {
		text: "",
		...NO_INLINE_DIRECTIVES
	};
	if (!text.includes("[[")) return {
		text: normalizeDirectiveWhitespace(text),
		...NO_INLINE_DIRECTIVES
	};
	let cleaned = text;
	let audioAsVoice = false;
	let hasAudioTag = false;
	let hasReplyTag = false;
	let sawCurrent = false;
	let lastExplicitId;
	cleaned = replaceOutsideCodeRegions(cleaned, AUDIO_TAG_RE, (match, _captures, offset, source) => {
		audioAsVoice = true;
		hasAudioTag = true;
		return stripAudioTag ? replacementPreservesWordBoundary(source, offset, match.length) : match;
	});
	cleaned = replaceOutsideCodeRegions(cleaned, REPLY_TAG_RE, (match, captures, offset, source) => {
		const idRaw = typeof captures[0] === "string" ? captures[0] : void 0;
		hasReplyTag = true;
		if (idRaw === void 0) sawCurrent = true;
		else {
			const id = sanitizeReplyDirectiveId(idRaw);
			if (id) lastExplicitId = id;
		}
		return stripReplyTags ? replacementPreservesWordBoundary(source, offset, match.length) : match;
	});
	if (!hasAudioTag && !hasReplyTag) return {
		text,
		...NO_INLINE_DIRECTIVES
	};
	cleaned = normalizeDirectiveWhitespace(cleaned);
	const replyToId = lastExplicitId ?? (sawCurrent ? normalizeOptionalString(currentMessageId) : void 0);
	return {
		text: cleaned,
		audioAsVoice,
		replyToId,
		replyToExplicitId: lastExplicitId,
		replyToCurrent: sawCurrent,
		hasAudioTag,
		hasReplyTag
	};
}
//#endregion
export { stripInlineDirectiveTagsForDisplay as a, stripInlineDirectiveTagsForDelivery as i, replaceOutsideCodeRegions as n, sanitizeReplyDirectiveId as r, parseInlineDirectives as t };
