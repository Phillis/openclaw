import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.js";
import { j as resolveIntegerOption } from "./number-coercion-oCkfUEEq.js";
import { s as visibleWidth, u as eastAsianWidthType } from "./ansi-9qL8iF9E.js";
import { a as isWhiteSpace, i as isPunctChar, n as HTML_TAG_RE, r as isMdAsciiPunct, t as MarkdownIt } from "./markdown-it-B1BEqCrt.js";
//#region ../../../../../../openclaw/node_modules/markdown-it-cjk-friendly/dist/index.js
function isEmoji(uc) {
	return /^\p{Emoji_Presentation}/u.test(String.fromCodePoint(uc));
}
/**
* Check if `uc` is CJK. Deferred (returns `null`) if IVS.
*
* @param uc code point
* @returns `true` if `uc` is CJK, `false` if not, `null` if IVS
*/
function isCjkBase(uc) {
	if (uc < 4352) return false;
	switch (eastAsianWidthType(uc)) {
		case "fullwidth":
		case "halfwidth": return true;
		case "wide": return !isEmoji(uc);
		case "narrow": return false;
		case "ambiguous": return null;
		case "neutral": return /^\p{sc=Hangul}/u.test(String.fromCodePoint(uc));
	}
}
function is2PreviousCjk(uc, prev) {
	return isCjkBase(uc) ?? (prev === 65025 && isQuotationMark(uc));
	function isQuotationMark(uc$1) {
		return uc$1 === 8216 || uc$1 === 8217 || uc$1 === 8220 || uc$1 === 8221;
	}
}
function isPreviousCjk(uc) {
	return isCjkBase(uc) ?? (917760 <= uc && uc <= 917999);
}
function isNextCjk(uc) {
	return isCjkBase(uc) ?? false;
}
function nonEmojiGeneralUseVS(uc) {
	return uc >= 65024 && uc <= 65038;
}
function markdownItCjkFriendlyPlugin(md) {
	const PreviousState = md.inline.State;
	class CjkFriendlyState extends PreviousState {
		scanDelims(start, canSplitWord) {
			const max = this.posMax;
			const marker = this.src.charCodeAt(start);
			const [lastChar, lastCharPos] = getLastCharCode(this.src, start);
			let lastMainChar = lastChar;
			let twoPrevChar = null;
			if (nonEmojiGeneralUseVS(lastChar)) {
				twoPrevChar = getLastCharCode(this.src, lastCharPos)[0];
				if (!/^\p{Zs}/u.test(String.fromCodePoint(twoPrevChar))) lastMainChar = twoPrevChar;
			}
			let pos = start;
			while (pos < max && this.src.charCodeAt(pos) === marker) pos++;
			const count = pos - start;
			const nextChar = pos < max ? this.src.codePointAt(pos) : 32;
			const isLastWhiteSpace = isWhiteSpace(lastMainChar);
			const isNextWhiteSpace = isWhiteSpace(nextChar);
			if (isLastWhiteSpace || isNextWhiteSpace) return {
				can_open: !isNextWhiteSpace,
				can_close: !isLastWhiteSpace,
				length: count
			};
			const isLastPunctChar = isMdAsciiPunct(lastMainChar) || isPunctChar(String.fromCodePoint(lastMainChar));
			const isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCodePoint(nextChar));
			let left_flanking = isLastPunctChar;
			let right_flanking = isNextPunctChar;
			if (canSplitWord) {
				const isEitherCJKChar = isNextCjk(nextChar) || (twoPrevChar !== null ? is2PreviousCjk(twoPrevChar, lastChar) : isPreviousCjk(lastChar));
				left_flanking ||= isEitherCJKChar || !isNextPunctChar;
				right_flanking ||= isEitherCJKChar || !isLastPunctChar;
			}
			return {
				can_open: left_flanking,
				can_close: right_flanking,
				length: count
			};
			function getLastCharCode(str, pos$1) {
				if (pos$1 <= 0) return [32, -1];
				const charCode = str.charCodeAt(pos$1 - 1);
				if ((charCode & 64512) !== 56320) return [charCode, pos$1 - 1];
				const codePoint = str.codePointAt(pos$1 - 2);
				return codePoint > 65535 ? [codePoint, pos$1 - 2] : [charCode, pos$1 - 1];
			}
		}
	}
	md.inline.State = CjkFriendlyState;
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript-headers.ts
const TRANSCRIPT_ROLES = [
	"assistant",
	"developer",
	"system",
	"user"
];
function isHorizontalWhitespace(char) {
	return char === " " || char === "	";
}
function isLineTrailingWhitespace(char) {
	return isHorizontalWhitespace(char) || char === "\r";
}
function skipHorizontalWhitespace(text, start, end) {
	let cursor = start;
	while (cursor < end && isHorizontalWhitespace(text[cursor])) cursor += 1;
	return cursor;
}
function matchRoleAt(text, start, end) {
	for (const role of TRANSCRIPT_ROLES) {
		const roleEnd = start + role.length;
		if (roleEnd <= end && text.slice(start, roleEnd).toLowerCase() === role) return {
			role,
			end: roleEnd
		};
	}
	return null;
}
function findDelimitedEnd(params) {
	const searchEnd = Math.min(params.lineEnd, params.contentStart + params.maxContentLength + 1);
	let closeAt = -1;
	for (let index = params.contentStart; index < searchEnd; index += 1) {
		const char = params.text[index];
		if (char === "`") return null;
		if (char === params.close) {
			closeAt = index;
			break;
		}
	}
	if (closeAt === -1) return null;
	const contentLength = closeAt - params.contentStart;
	if (contentLength < params.minContentLength || contentLength > params.maxContentLength) return null;
	return closeAt + 1;
}
function isHeaderBoundary(char) {
	return char === void 0 || isLineTrailingWhitespace(char) || char === ":" || char === "：";
}
function matchRoleTimestampHeader(text, start, lineEnd) {
	const role = matchRoleAt(text, start, lineEnd);
	if (!role) return null;
	const bracketStart = skipHorizontalWhitespace(text, role.end, lineEnd);
	if (text[bracketStart] !== "[") return null;
	const headerEnd = findDelimitedEnd({
		text,
		contentStart: bracketStart + 1,
		lineEnd,
		close: "]",
		minContentLength: 1,
		maxContentLength: 160
	});
	if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
	return {
		start,
		end: headerEnd,
		kind: "role_timestamp_bracket",
		role: role.role
	};
}
function matchTimestampRoleHeader(text, start, lineEnd) {
	if (text[start] !== "[") return null;
	const bracketEnd = findDelimitedEnd({
		text,
		contentStart: start + 1,
		lineEnd,
		close: "]",
		minContentLength: 4,
		maxContentLength: 160
	});
	if (!bracketEnd) return null;
	const role = matchRoleAt(text, skipHorizontalWhitespace(text, bracketEnd, lineEnd), lineEnd);
	if (!role) return null;
	const colonAt = skipHorizontalWhitespace(text, role.end, lineEnd);
	if (text[colonAt] !== ":" && text[colonAt] !== "：") return null;
	return {
		start,
		end: colonAt + 1,
		kind: "timestamp_role_colon",
		role: role.role
	};
}
function matchAngleRoleHeader(text, start, lineEnd) {
	if (text[start] !== "<") return null;
	const role = matchRoleAt(text, skipHorizontalWhitespace(text, start + 1, lineEnd), lineEnd);
	const roleBoundary = role ? text[role.end] : void 0;
	if (!role || roleBoundary !== ">" && !isHorizontalWhitespace(roleBoundary)) return null;
	const headerEnd = findDelimitedEnd({
		text,
		contentStart: role.end,
		lineEnd,
		close: ">",
		minContentLength: 0,
		maxContentLength: 160
	});
	if (!headerEnd || !isHeaderBoundary(text[headerEnd])) return null;
	return {
		start,
		end: headerEnd,
		kind: "angle_role_header",
		role: role.role
	};
}
function rangesOverlap$1(left, right) {
	return left.start < right.end && left.end > right.start;
}
/** Finds supported transcript-role headers in parser-visible text. */
function findAssistantTranscriptRoleHeaderSpans(text, excludedRanges = []) {
	const spans = [];
	const sortedExcludedRanges = [...excludedRanges].toSorted((left, right) => left.start - right.start || left.end - right.end);
	let excludedRangeIndex = 0;
	let lineStart = 0;
	while (lineStart < text.length) {
		const newlineAt = text.indexOf("\n", lineStart);
		const lineEnd = newlineAt === -1 ? text.length : newlineAt;
		const contentStart = skipHorizontalWhitespace(text, lineStart, lineEnd);
		const span = matchTimestampRoleHeader(text, contentStart, lineEnd) ?? matchAngleRoleHeader(text, contentStart, lineEnd) ?? matchRoleTimestampHeader(text, contentStart, lineEnd);
		if (span) {
			for (;;) {
				const excludedRange = sortedExcludedRanges[excludedRangeIndex];
				if (!excludedRange || excludedRange.end > span.start) break;
				excludedRangeIndex += 1;
			}
			const excludedRange = sortedExcludedRanges[excludedRangeIndex];
			if (!excludedRange || !rangesOverlap$1(span, excludedRange)) spans.push(span);
		}
		if (newlineAt === -1) break;
		lineStart = newlineAt + 1;
	}
	return spans;
}
//#endregion
//#region packages/markdown-core/src/html-tags.ts
function htmlTagName(rawTag, closing) {
	let end = closing ? 2 : 1;
	while (end < rawTag.length) {
		const code = rawTag.charCodeAt(end);
		if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122) && !(code >= 48 && code <= 57) && code !== 45) break;
		end += 1;
	}
	return rawTag.slice(closing ? 2 : 1, end).toLowerCase();
}
/** Tokenizes valid open/close HTML tags with Markdown-It's quote-aware grammar. */
function* tokenizeHtmlTags(html) {
	let cursor = 0;
	while (cursor < html.length) {
		const start = html.indexOf("<", cursor);
		if (start < 0) return;
		const match = HTML_TAG_RE.exec(html.slice(start));
		if (!match) {
			cursor = start + 1;
			continue;
		}
		const raw = match[0];
		const closing = raw.startsWith("</");
		const end = start + raw.length;
		const name = htmlTagName(raw, closing);
		if (!name) {
			cursor = end;
			continue;
		}
		yield {
			raw,
			start,
			end,
			name,
			closing,
			selfClosing: !closing && raw.trimEnd().endsWith("/>")
		};
		cursor = end;
	}
}
//#endregion
//#region packages/markdown-core/src/assistant-transcript.ts
const ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE = "assistant_transcript_role_text";
const RAW_CODE_CONTAINER_TAGS = /* @__PURE__ */ new Set([
	"code",
	"pre",
	"script",
	"style",
	"textarea"
]);
function findRawCodeContainerRanges(text) {
	const ranges = [];
	const openTags = [];
	let rangeStart = -1;
	for (const tag of tokenizeHtmlTags(text)) {
		if (!RAW_CODE_CONTAINER_TAGS.has(tag.name)) continue;
		if (tag.closing) {
			const openIndex = openTags.lastIndexOf(tag.name);
			if (openIndex !== -1) {
				openTags.splice(openIndex);
				if (openTags.length === 0 && rangeStart !== -1) {
					ranges.push({
						start: rangeStart,
						end: tag.end
					});
					rangeStart = -1;
				}
			}
		} else if (!tag.selfClosing) {
			if (openTags.length === 0) rangeStart = tag.start;
			openTags.push(tag.name);
		}
	}
	if (openTags.length > 0 && rangeStart !== -1) ranges.push({
		start: rangeStart,
		end: text.length
	});
	return ranges;
}
function visibleTokenProjection(token, options) {
	if (token.type === "softbreak" || token.type === "hardbreak") return {
		text: "\n",
		excludedRanges: []
	};
	if (token.type === "html_inline" && options.isStructuralHtmlInline?.(token) === true) return null;
	if (token.type === "text" || token.type === "html_inline") return {
		text: token.content,
		excludedRanges: []
	};
	if (token.type === "code_inline") return {
		text: token.content,
		excludedRanges: [{
			start: 0,
			end: token.content.length
		}]
	};
	if (token.type === "image") return token.children && token.children.length > 0 ? visibleTokensProjection(token.children, options) : {
		text: token.content,
		excludedRanges: []
	};
	return null;
}
function visibleTokensProjection(tokens, options) {
	let text = "";
	const excludedRanges = [];
	for (const token of tokens) {
		const projection = visibleTokenProjection(token, options);
		if (!projection) continue;
		const offset = text.length;
		text += projection.text;
		for (const range of projection.excludedRanges) excludedRanges.push({
			start: offset + range.start,
			end: offset + range.end
		});
	}
	excludedRanges.push(...findRawCodeContainerRanges(text));
	return {
		text,
		excludedRanges
	};
}
function cloneToken(TokenType, source, content, type = source.type) {
	const token = new TokenType(type, type === "assistant_transcript_role_text" ? "" : source.tag, 0);
	Object.assign(token, source);
	token.type = type;
	token.content = content;
	token.children = null;
	return token;
}
function annotatedToken(TokenType, source, content, span) {
	const token = cloneToken(TokenType, source, content, ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE);
	token.meta = {
		...source.meta && typeof source.meta === "object" ? source.meta : {},
		assistantTranscriptRoleHeader: {
			kind: span.kind,
			role: span.role
		}
	};
	return token;
}
function splitVisibleToken(params) {
	const { token, visibleStart } = params;
	const visibleEnd = visibleStart + token.content.length;
	const firstSpan = params.spans[params.spanStartIndex];
	if (!firstSpan || firstSpan.start >= visibleEnd) return [token];
	const result = [];
	let localCursor = 0;
	for (let spanIndex = params.spanStartIndex; spanIndex < params.spans.length; spanIndex += 1) {
		const span = params.spans[spanIndex];
		if (!span || span.start >= visibleEnd) break;
		if (span.end <= visibleStart) continue;
		const overlapStart = Math.max(span.start, visibleStart) - visibleStart;
		const overlapEnd = Math.min(span.end, visibleEnd) - visibleStart;
		if (overlapStart > localCursor) result.push(cloneToken(params.TokenType, token, token.content.slice(localCursor, overlapStart)));
		if (overlapEnd > overlapStart) result.push(annotatedToken(params.TokenType, token, token.content.slice(overlapStart, overlapEnd), span));
		localCursor = overlapEnd;
	}
	if (localCursor < token.content.length) result.push(cloneToken(params.TokenType, token, token.content.slice(localCursor)));
	return result;
}
function annotateInlineChildren(TokenType, children, preserveLinks, options) {
	const projection = visibleTokensProjection(children, options);
	const spans = findAssistantTranscriptRoleHeaderSpans(projection.text, projection.excludedRanges);
	if (spans.length === 0) return children;
	const result = [];
	let visibleCursor = 0;
	let spanCursor = 0;
	for (const token of children) {
		const tokenProjection = visibleTokenProjection(token, options);
		if (!tokenProjection) {
			result.push(token);
			continue;
		}
		const content = tokenProjection.text;
		for (;;) {
			const span = spans[spanCursor];
			if (!span || span.end > visibleCursor) break;
			spanCursor += 1;
		}
		if (token.type === "text" || token.type === "html_inline") result.push(...splitVisibleToken({
			TokenType,
			token,
			visibleStart: visibleCursor,
			spanStartIndex: spanCursor,
			spans
		}));
		else if (token.type === "image") {
			const visibleEnd = visibleCursor + content.length;
			const imageSpans = [];
			for (let spanIndex = spanCursor; spanIndex < spans.length; spanIndex += 1) {
				const span = spans[spanIndex];
				if (!span || span.start >= visibleEnd) break;
				if (span.end <= visibleCursor) continue;
				imageSpans.push({
					...span,
					start: Math.max(span.start, visibleCursor) - visibleCursor,
					end: Math.min(span.end, visibleEnd) - visibleCursor
				});
			}
			if (imageSpans.length > 0) token.meta = {
				...token.meta && typeof token.meta === "object" ? token.meta : {},
				assistantTranscriptRoleImage: {
					text: content,
					spans: imageSpans
				}
			};
			result.push(token);
		} else result.push(token);
		visibleCursor += content.length;
	}
	return preserveLinks ? result : removeLinksContainingAssistantTranscriptRoles(result);
}
function removeLinksContainingAssistantTranscriptRoles(tokens) {
	const openLinks = [];
	const suppressedLinks = /* @__PURE__ */ new Set();
	for (const token of tokens) {
		if (token.type === "link_open") {
			openLinks.push({
				token,
				containsRole: false
			});
			continue;
		}
		const imageMeta = token.meta?.assistantTranscriptRoleImage;
		if (token.type === "assistant_transcript_role_text" || imageMeta?.spans.length) {
			for (const link of openLinks) link.containsRole = true;
			continue;
		}
		if (token.type !== "link_close") continue;
		const openLink = openLinks.pop();
		if (!openLink?.containsRole) continue;
		suppressedLinks.add(openLink.token);
		suppressedLinks.add(token);
	}
	const result = [];
	for (const token of tokens) {
		if (suppressedLinks.has(token)) continue;
		const previous = result.at(-1);
		if (previous?.type === "assistant_transcript_role_text" && token.type === "assistant_transcript_role_text") {
			previous.content += token.content;
			continue;
		}
		result.push(token);
	}
	return result;
}
function annotateHtmlBlock(TokenType, token) {
	const spans = findAssistantTranscriptRoleHeaderSpans(token.content, findRawCodeContainerRanges(token.content));
	if (spans.length === 0) return [token];
	return splitVisibleToken({
		TokenType,
		token,
		visibleStart: 0,
		spanStartIndex: 0,
		spans
	});
}
/** Adds semantic transcript-role tokens to assistant-authored Markdown only. */
function markdownItAssistantTranscriptRoles(md, options = {}) {
	md.core.ruler.after("text_join", "assistant_transcript_roles", (state) => {
		if (state.env?.assistantTranscriptRoleHeaders !== true) return;
		const tokens = [];
		const preserveLinks = state.env?.assistantTranscriptRolePreserveLinks === true;
		for (const token of state.tokens) {
			if (token.type === "inline" && token.children) {
				token.children = annotateInlineChildren(state.Token, token.children, preserveLinks, options);
				tokens.push(token);
				continue;
			}
			if (token.type === "html_block") {
				tokens.push(...annotateHtmlBlock(state.Token, token));
				continue;
			}
			tokens.push(token);
		}
		state.tokens = tokens;
	});
}
//#endregion
//#region packages/markdown-core/src/chunk-text.ts
function normalizeChunkLimit(limit) {
	return Number.isFinite(limit) && limit > 0 ? resolveIntegerOption(limit, 1, { min: 1 }) : limit;
}
function resolveChunkEarlyReturn(text, limit) {
	if (!text) return [];
	if (limit <= 0) return [text];
	if (text.length <= limit) return [text];
}
function scanParenAwareBreakpoints(text) {
	let lastNewline = -1;
	let lastWhitespace = -1;
	let depth = 0;
	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")" && depth > 0) {
			depth -= 1;
			continue;
		}
		if (depth !== 0) continue;
		if (char === "\n") lastNewline = i;
		else if (/\s/.test(char)) lastWhitespace = i;
	}
	return {
		lastNewline,
		lastWhitespace
	};
}
function findPreferredRangeEnd(text, start, end) {
	const slice = text.slice(start, end);
	let paragraphEnd;
	for (const match of slice.matchAll(/\n[\t ]*\n+/g)) if (match.index !== void 0) paragraphEnd = start + match.index + match[0].length;
	if (paragraphEnd !== void 0) return paragraphEnd;
	const newlineIndex = text.lastIndexOf("\n", end - 1);
	if (newlineIndex >= start) return newlineIndex + 1;
	for (let index = end - 1; index > start; index -= 1) if (/\s/.test(text.charAt(index))) return index + 1;
}
/**
* Splits text into contiguous UTF-16 ranges without dropping separator whitespace.
* Preferred mode selects paragraph, newline, then whitespace boundaries.
*/
function chunkTextRanges(text, options) {
	if (!text) return [];
	const normalizedLimit = normalizeChunkLimit(options.limit);
	if (normalizedLimit <= 0 || text.length <= normalizedLimit) return [{
		start: 0,
		end: text.length
	}];
	const ranges = [];
	let start = 0;
	while (start < text.length) {
		const maxEnd = Math.min(text.length, start + normalizedLimit);
		const preferredEnd = options.mode === "preferred" && maxEnd < text.length ? findPreferredRangeEnd(text, start, maxEnd) : void 0;
		const end = avoidTrailingHighSurrogateBreak(text, start, preferredEnd && preferredEnd > start ? preferredEnd : maxEnd);
		ranges.push({
			start,
			end
		});
		start = end;
	}
	return ranges;
}
/**
* Splits plain text into size-bounded chunks at readable boundaries.
*
* Returns the original text as one chunk when the limit is non-positive.
*/
function chunkText(text, limit) {
	const normalizedLimit = normalizeChunkLimit(limit);
	const early = resolveChunkEarlyReturn(text, normalizedLimit);
	if (early) return early;
	const chunks = [];
	let cursor = 0;
	while (cursor < text.length) {
		if (text.length - cursor <= normalizedLimit) {
			chunks.push(text.slice(cursor));
			break;
		}
		const windowEnd = Math.min(text.length, cursor + normalizedLimit);
		const { lastNewline, lastWhitespace } = scanParenAwareBreakpoints(text.slice(cursor, windowEnd));
		const breakOffset = lastNewline > 0 ? lastNewline : lastWhitespace;
		const end = avoidTrailingHighSurrogateBreak(text, cursor, breakOffset > 0 ? cursor + breakOffset : windowEnd);
		chunks.push(text.slice(cursor, end));
		cursor = end;
		while (cursor < text.length && /\s/.test(text[cursor] ?? "")) cursor += 1;
	}
	return chunks;
}
//#endregion
//#region packages/markdown-core/src/ir-spans.ts
const autoLinkedMarkdownLinks = /* @__PURE__ */ new WeakSet();
function createMarkdownLinkSpan(span, options = {}) {
	const created = { ...span };
	if (options.autoLinked) autoLinkedMarkdownLinks.add(created);
	return created;
}
function copyMarkdownLinkSpan(span, overrides = {}) {
	return createMarkdownLinkSpan({
		...span,
		...overrides
	}, { autoLinked: autoLinkedMarkdownLinks.has(span) });
}
function isAutoLinkedMarkdownLink(span) {
	return autoLinkedMarkdownLinks.has(span);
}
function createStyleSpan(params) {
	const span = {
		start: params.start,
		end: params.end,
		style: params.style
	};
	if (params.language) span.language = params.language;
	return span;
}
function clampStyleSpans(spans, maxLength) {
	const clamped = [];
	for (const span of spans) {
		const start = Math.max(0, Math.min(span.start, maxLength));
		const end = Math.max(start, Math.min(span.end, maxLength));
		if (end > start) clamped.push(createStyleSpan({
			start,
			end,
			style: span.style,
			language: span.language
		}));
	}
	return clamped;
}
function clampLinkSpans(spans, maxLength) {
	const clamped = [];
	for (const span of spans) {
		const start = Math.max(0, Math.min(span.start, maxLength));
		const end = Math.max(start, Math.min(span.end, maxLength));
		if (end > start) clamped.push(copyMarkdownLinkSpan(span, {
			start,
			end
		}));
	}
	return clamped;
}
function clampAnnotationSpans(spans, maxLength) {
	const clamped = [];
	for (const span of spans) {
		const start = Math.max(0, Math.min(span.start, maxLength));
		const end = Math.max(start, Math.min(span.end, maxLength));
		if (end > start) clamped.push({
			...span,
			start,
			end
		});
	}
	return clamped;
}
function mergeAnnotationSpans(spans) {
	const sorted = [...spans].toSorted((a, b) => a.start - b.start || a.end - b.end);
	const merged = [];
	for (const span of sorted) {
		const previous = merged.at(-1);
		if (previous && previous.end === span.start && previous.type === span.type && previous.kind === span.kind && previous.role === span.role) {
			previous.end = span.end;
			continue;
		}
		merged.push({ ...span });
	}
	return merged;
}
function mergeStyleSpans(spans) {
	const sorted = [...spans].toSorted((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		if (a.end !== b.end) return a.end - b.end;
		return a.style.localeCompare(b.style);
	});
	const merged = [];
	for (const span of sorted) {
		const previous = merged.at(-1);
		if (previous && previous.style === span.style && previous.language === span.language && (span.start < previous.end || span.start === previous.end && span.style !== "blockquote")) {
			previous.end = Math.max(previous.end, span.end);
			continue;
		}
		merged.push({ ...span });
	}
	return merged;
}
function resolveSliceBounds(span, start, end) {
	const sliceStart = Math.max(span.start, start);
	const sliceEnd = Math.min(span.end, end);
	return sliceEnd > sliceStart ? {
		start: sliceStart,
		end: sliceEnd
	} : null;
}
function sliceStyleSpans(spans, start, end) {
	const sliced = [];
	for (const span of spans) {
		const bounds = resolveSliceBounds(span, start, end);
		if (bounds) sliced.push(createStyleSpan({
			start: bounds.start - start,
			end: bounds.end - start,
			style: span.style,
			language: span.language
		}));
	}
	return mergeStyleSpans(sliced);
}
function sliceLinkSpans(spans, start, end) {
	const sliced = [];
	for (const span of spans) {
		const bounds = resolveSliceBounds(span, start, end);
		if (bounds) sliced.push(copyMarkdownLinkSpan(span, {
			start: bounds.start - start,
			end: bounds.end - start
		}));
	}
	return sliced;
}
function sliceAnnotationSpans(spans, start, end) {
	const sliced = [];
	for (const span of spans) {
		const bounds = resolveSliceBounds(span, start, end);
		if (bounds) sliced.push({
			...span,
			start: bounds.start - start,
			end: bounds.end - start
		});
	}
	return mergeAnnotationSpans(sliced);
}
//#endregion
//#region packages/markdown-core/src/ir-annotations.ts
function rangesOverlap(left, right) {
	return left.start < right.end && left.end > right.start;
}
/** Re-evaluate the first visible line after a transport creates a new message boundary. */
function annotateAssistantTranscriptRoleMessageBoundary(ir) {
	const firstLineEnd = ir.text.indexOf("\n");
	const boundaryText = firstLineEnd === -1 ? ir.text : ir.text.slice(0, firstLineEnd);
	const boundarySpan = findAssistantTranscriptRoleHeaderSpans(boundaryText, ir.styles.filter((span) => span.style === "code" || span.style === "code_block").filter((span) => span.start < boundaryText.length).map(({ start, end }) => ({
		start,
		end: Math.min(end, boundaryText.length)
	})))[0];
	if (!boundarySpan || (ir.annotations ?? []).some((span) => rangesOverlap(span, boundarySpan))) return ir;
	const annotation = {
		...boundarySpan,
		type: "assistant_transcript_role"
	};
	return {
		...ir,
		links: ir.links.filter((link) => !rangesOverlap(link, annotation)),
		annotations: mergeAnnotationSpans([...ir.annotations ?? [], annotation])
	};
}
function appendAssistantTranscriptRoleText(target, value, meta) {
	if (!value) return;
	const start = target.text.length;
	target.text += value;
	target.annotations.push({
		start,
		end: target.text.length,
		type: "assistant_transcript_role",
		kind: meta.kind,
		role: meta.role
	});
}
function appendAssistantTranscriptRoleImage(target, meta) {
	if (!meta.text) return;
	const offset = target.text.length;
	target.text += meta.text;
	for (const span of meta.spans) target.annotations.push({
		...span,
		start: offset + span.start,
		end: offset + span.end,
		type: "assistant_transcript_role"
	});
}
//#endregion
//#region packages/markdown-core/src/ir-source-spacing.ts
/** Prepare the next mapped block start for each token in one reverse pass. */
function computeNextMappedBlockStarts(tokens) {
	const nextStarts = [];
	let nextStart;
	for (let index = tokens.length - 1; index >= 0; index -= 1) {
		nextStarts[index] = nextStart;
		const currentStart = tokens[index]?.map?.[0];
		if (currentStart !== void 0) nextStart = currentStart;
	}
	return nextStarts;
}
function sourceBlockNewlineCount(preserveSourceBlockSpacing, nextBlockStart, blockLineEnd) {
	if (!preserveSourceBlockSpacing || blockLineEnd === void 0) return;
	return nextBlockStart === void 0 ? 0 : Math.max(1, nextBlockStart - blockLineEnd + 1);
}
//#endregion
//#region packages/markdown-core/src/ir.ts
const OPEN_MARKDOWN_HTML_TAG_PATTERN = /<\/?[a-zA-Z][a-zA-Z0-9-]*\b[^<>]*$/;
function defineMetadata(target, key, value) {
	if (value === void 0) return;
	Object.defineProperty(target, key, {
		configurable: true,
		enumerable: false,
		value,
		writable: true
	});
}
function attachListItemMetadata(item, metadata) {
	const itemWithMetadata = item;
	for (const key of [
		"contentStart",
		"contentEnd",
		"markerOnly",
		"sourceMarker",
		"sourceContent",
		"sourceIndent",
		"sourceStartLine",
		"sourceEndLine"
	]) defineMetadata(itemWithMetadata, key, metadata[key]);
	return itemWithMetadata;
}
function attachBlockMetadata(ir, blocks) {
	if (blocks.length > 0) defineMetadata(ir, "blocks", blocks);
	return ir;
}
function appendHeadingSeparator(state, nextBlockStart) {
	const newlineCount = sourceBlockNewlineCount(state.preserveSourceBlockSpacing, nextBlockStart, state.headingLineEnd);
	if (newlineCount === void 0) {
		appendParagraphSeparator(state);
		return;
	}
	if (newlineCount > 0) state.text += "\n".repeat(newlineCount);
	state.headingLineEnd = void 0;
}
function createMarkdownIt(options) {
	const md = new MarkdownIt({
		html: false,
		linkify: options.linkify ?? true,
		breaks: false,
		typographer: false
	});
	md.use(markdownItCjkFriendlyPlugin);
	md.use(markdownItAssistantTranscriptRoles);
	if (options.enableTaskLists) md.core.ruler.before("inline", "markdown_core_task_lists", protectTaskListMarkers);
	if (options.enableHtmlUnderline) md.inline.ruler.before("html_inline", "markdown_core_html_underline", parseHtmlUnderline);
	if (options.enableSpoilers) md.core.ruler.before("assistant_transcript_roles", "markdown_core_spoilers", (state) => {
		applySpoilerTokens(state.tokens);
	});
	md.enable("strikethrough");
	if (options.tableMode && options.tableMode !== "off") md.enable("table");
	else md.disable("table");
	if (options.autolink === false) md.disable("autolink");
	return md;
}
function protectTaskListMarkers(state) {
	const stack = [];
	for (const token of state.tokens) {
		if (token.type === "list_item_open") {
			stack.push({ contentStarted: false });
			continue;
		}
		if (token.type === "list_item_close") {
			stack.pop();
			continue;
		}
		const item = stack.at(-1);
		if (!item || item.contentStarted) continue;
		if (token.type === "inline") {
			item.contentStarted = true;
			if (/^\[[ xX]\](?:[ \t]|\n|$)/u.test(token.content ?? "")) {
				token.taskListMarker = true;
				token.content = `\\${token.content}`;
			}
			continue;
		}
		if (token.type !== "paragraph_open") item.contentStarted = true;
	}
}
function parseHtmlUnderline(state, silent) {
	if (state.src.charCodeAt(state.pos) !== 60) return false;
	const raw = HTML_TAG_RE.exec(state.src.slice(state.pos))?.[0];
	if (!raw) return false;
	const tag = tokenizeHtmlTags(raw).next().value;
	const underlineTag = tag && tag.start === 0 && (tag.name === "u" || tag.name === "ins") ? tag : void 0;
	if (!silent) {
		const token = state.push(!underlineTag || underlineTag.selfClosing ? "text" : underlineTag.closing ? "underline_close" : "underline_open", "", 0);
		if (!underlineTag || underlineTag.selfClosing) token.content = raw;
	}
	state.pos += raw.length;
	return true;
}
function getAttr(token, name) {
	if (token.attrGet) return token.attrGet(name);
	if (token.attrs) {
		for (const [key, value] of token.attrs) if (key === name) return value;
	}
	return null;
}
function markdownTableAlignmentFromToken(token) {
	const value = getAttr(token, "style") ?? "";
	if (/text-align\s*:\s*left/i.test(value)) return "left";
	if (/text-align\s*:\s*center/i.test(value)) return "center";
	if (/text-align\s*:\s*right/i.test(value)) return "right";
}
function createTextToken(base, content) {
	return {
		...base,
		type: "text",
		content,
		children: void 0
	};
}
function applySpoilerTokens(tokens) {
	for (const token of tokens) if (token.children && token.children.length > 0) token.children = injectSpoilersIntoInline(token.children);
}
function injectSpoilersIntoInline(tokens) {
	let totalDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") continue;
		const content = token.content ?? "";
		let i = 0;
		while (i < content.length) {
			const next = content.indexOf("||", i);
			if (next === -1) break;
			totalDelims += 1;
			i = next + 2;
		}
	}
	if (totalDelims < 2) return tokens;
	const usableDelims = totalDelims - totalDelims % 2;
	const result = [];
	const state = { spoilerOpen: false };
	let consumedDelims = 0;
	for (const token of tokens) {
		if (token.type !== "text") {
			result.push(token);
			continue;
		}
		const content = token.content ?? "";
		if (!content.includes("||")) {
			result.push(token);
			continue;
		}
		let index = 0;
		while (index < content.length) {
			const next = content.indexOf("||", index);
			if (next === -1) {
				if (index < content.length) result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (consumedDelims >= usableDelims) {
				result.push(createTextToken(token, content.slice(index)));
				break;
			}
			if (next > index) result.push(createTextToken(token, content.slice(index, next)));
			consumedDelims += 1;
			state.spoilerOpen = !state.spoilerOpen;
			result.push({ type: state.spoilerOpen ? "spoiler_open" : "spoiler_close" });
			index = next + 2;
		}
	}
	return result;
}
function initRenderTarget() {
	return {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: [],
		annotations: []
	};
}
function resolveRenderTarget(state) {
	return state.table?.currentCell ?? state;
}
function appendText(state, value) {
	if (!value) return;
	const target = resolveRenderTarget(state);
	target.text += value;
}
function openStyle(state, style) {
	const target = resolveRenderTarget(state);
	target.openStyles.push({
		style,
		start: target.text.length
	});
}
function closeStyle(state, style, options) {
	const target = resolveRenderTarget(state);
	for (let i = target.openStyles.length - 1; i >= 0; i -= 1) {
		const open = target.openStyles.at(i);
		if (open?.style === style) {
			const start = open.start;
			target.openStyles.splice(i, 1);
			const end = options?.trimTrailingParagraphSeparator && target.text.endsWith("\n\n") ? target.text.length - 2 : target.text.length;
			if (end > start) target.styles.push({
				start,
				end,
				style
			});
			return;
		}
	}
}
function appendParagraphSeparator(state, token) {
	if (state.table) return;
	if (state.env.listStack.length > 0) {
		const directListParagraphLevel = (state.env.listStack[state.env.listStack.length - 1]?.openLevel ?? 0) + 2;
		if (token?.type !== "paragraph_close" || token.hidden || token.level !== directListParagraphLevel) return;
	}
	state.text += "\n\n";
}
function appendTopLevelListSeparator(state) {
	if ((state.text.match(/\n*$/)?.[0].length ?? 0) < 2) state.text += "\n";
}
function appendNestedListSeparator(state) {
	if (!state.text.endsWith("\n")) state.text += "\n";
}
function appendListPrefix(state, isTask) {
	const stack = state.env.listStack;
	const top = stack[stack.length - 1];
	if (!top) return;
	top.index += 1;
	const itemStart = state.text.length;
	const indent = "  ".repeat(Math.max(0, stack.length - 1));
	const prefix = top.type === "ordered" ? `${top.index}. ` : "• ";
	state.text += indent;
	const markerStart = state.text.length;
	state.text += prefix;
	return {
		kind: top.type,
		listMarker: {
			start: markerStart,
			end: state.text.length
		},
		listId: top.id,
		...top.parentId !== void 0 ? { parentListId: top.parentId } : {},
		depth: stack.length - 1,
		start: itemStart,
		...isTask ? { task: true } : {}
	};
}
function recordTaskMarker(state, content) {
	const item = state.openListItems.at(-1);
	if (!item?.task || item.taskMarker) return;
	const marker = /^\[[ xX]\][ \t]?/u.exec(content)?.[0];
	if (marker) {
		const start = resolveRenderTarget(state).text.length;
		item.taskMarker = {
			start,
			end: start + marker.length
		};
	}
}
function recordListSourceMetadata(state, item, token) {
	if (!token.map) return;
	const [startLine, endLine] = token.map;
	item.sourceStartLine = startLine;
	item.sourceEndLine = endLine;
	const line = state.sourceLines[startLine] ?? "";
	const candidates = [...line.matchAll(/(?:^|[\t >])([-*+]|\d{1,9}[.)])(?=[\t ]|$)/gu)];
	const markerIndex = state.listItemsOpenedByLine.get(startLine) ?? 0;
	state.listItemsOpenedByLine.set(startLine, markerIndex + 1);
	const candidate = candidates[Math.min(markerIndex, candidates.length - 1)];
	const marker = candidate?.[1];
	if (!candidate || !marker) return;
	const markerOffset = candidate.index + candidate[0].lastIndexOf(marker);
	const markerEnd = markerOffset + marker.length;
	let paddingEnd = markerEnd;
	while (paddingEnd < line.length && /[\t ]/u.test(line[paddingEnd] ?? "")) paddingEnd += 1;
	const markerColumn = markdownSourceColumn(line.slice(0, markerEnd));
	const paddingColumns = markdownSourceColumn(line.slice(0, paddingEnd)) - markerColumn;
	item.sourceIndent = markerColumn + (paddingColumns === 0 || paddingColumns > 4 ? 1 : paddingColumns);
	const contentOffset = paddingColumns > 4 ? Math.min(markerEnd + 1, paddingEnd) : paddingEnd;
	const lineStart = state.sourceLineStarts[startLine] ?? 0;
	item.sourceMarker = {
		start: lineStart + markerOffset,
		end: lineStart + markerOffset + marker.length
	};
	item.sourceContent = {
		start: lineStart + contentOffset,
		end: state.sourceLineStarts[endLine] ?? state.source.length
	};
	if (!line.slice(contentOffset).replace(/[ \t\r\n]/gu, "")) item.markerOnly = true;
}
function renderInlineCode(state, content) {
	if (!content) return;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	target.text += content;
	target.styles.push({
		start,
		end: start + content.length,
		style: "code"
	});
}
function resolveFenceLanguage(info) {
	return info?.trim().split(/\s+/, 1)[0]?.trim() || void 0;
}
function renderCodeBlock(state, content, info, sourceNewlineCount, origin, sourceMap, codeClosed) {
	let code = content ?? "";
	if (!code.endsWith("\n")) code = `${code}\n`;
	const target = resolveRenderTarget(state);
	const start = target.text.length;
	const language = resolveFenceLanguage(info);
	target.text += code;
	target.styles.push(createStyleSpan({
		start,
		end: start + code.length,
		style: "code_block",
		language
	}));
	state.blocks.push({
		kind: "code_block",
		start,
		end: start + code.length,
		depth: state.env.listStack.length + state.blockquoteStack.length + 1,
		blockquoteDepth: state.blockquoteStack.length,
		codeOrigin: origin,
		...codeClosed !== void 0 ? { codeClosed } : {},
		...language ? { language } : {},
		...sourceMap ? {
			sourceStartLine: sourceMap[0],
			sourceEndLine: sourceMap[1]
		} : {}
	});
	if (state.env.listStack.length === 0) {
		const extraNewlines = sourceNewlineCount === void 0 ? 1 : Math.max(0, sourceNewlineCount - 1);
		target.text += "\n".repeat(extraNewlines);
	}
}
function isFenceClosed(token) {
	const sourceLines = (token.map?.[1] ?? 0) - (token.map?.[0] ?? 0);
	const content = token.content ?? "";
	return sourceLines >= (content.match(/\n/gu)?.length ?? 0) + (content && !content.endsWith("\n") ? 1 : 0) + 2;
}
function markdownSourceColumn(text) {
	let column = 0;
	for (const character of text) column += character === "	" ? 4 - column % 4 : 1;
	return column;
}
function handleLinkClose(state) {
	const target = resolveRenderTarget(state);
	const link = target.linkStack.pop();
	if (!link?.href) return;
	const href = link.href.trim();
	if (!href) return;
	const start = link.labelStart;
	const end = target.text.length;
	const span = createMarkdownLinkSpan({
		start,
		end,
		href
	}, { autoLinked: link.autoLinked });
	target.links.push(span);
}
function headingStyleFromToken(token) {
	switch (token.tag) {
		case "h1": return "heading_1";
		case "h2": return "heading_2";
		case "h3": return "heading_3";
		case "h4": return "heading_4";
		case "h5": return "heading_5";
		case "h6": return "heading_6";
		default: return null;
	}
}
function isInsideMarkdownHtmlTag(text) {
	const openTagStart = text.lastIndexOf("<");
	if (openTagStart === -1) return false;
	return text.lastIndexOf(">") < openTagStart && OPEN_MARKDOWN_HTML_TAG_PATTERN.test(text.slice(openTagStart));
}
function initTableState() {
	return {
		headers: [],
		rows: [],
		aligns: [],
		currentRow: [],
		currentCell: null,
		inHeader: false
	};
}
function finishTableCell(cell) {
	closeRemainingStyles(cell);
	return {
		text: cell.text,
		styles: cell.styles,
		links: cell.links,
		...cell.annotations.length > 0 ? { annotations: cell.annotations } : {}
	};
}
function trimCell(cell) {
	const text = cell.text;
	let start = 0;
	let end = text.length;
	while (start < end && /\s/.test(text[start] ?? "")) start += 1;
	while (end > start && /\s/.test(text[end - 1] ?? "")) end -= 1;
	if (start === 0 && end === text.length) return cell;
	const trimmedText = text.slice(start, end);
	const trimmedLength = trimmedText.length;
	const trimmedStyles = [];
	for (const span of cell.styles) {
		const sliceStart = Math.max(0, span.start - start);
		const sliceEnd = Math.min(trimmedLength, span.end - start);
		if (sliceEnd > sliceStart) trimmedStyles.push({
			start: sliceStart,
			end: sliceEnd,
			style: span.style
		});
	}
	const trimmedLinks = [];
	for (const span of cell.links) {
		const sliceStart = Math.max(0, span.start - start);
		const sliceEnd = Math.min(trimmedLength, span.end - start);
		if (sliceEnd > sliceStart) trimmedLinks.push(copyMarkdownLinkSpan(span, {
			start: sliceStart,
			end: sliceEnd
		}));
	}
	const trimmedAnnotations = sliceAnnotationSpans(cell.annotations ?? [], start, end);
	return {
		text: trimmedText,
		styles: trimmedStyles,
		links: trimmedLinks,
		...trimmedAnnotations.length > 0 ? { annotations: trimmedAnnotations } : {}
	};
}
function appendCell(state, cell) {
	if (!cell.text) return;
	const start = state.text.length;
	state.text += cell.text;
	for (const span of cell.styles) state.styles.push({
		start: start + span.start,
		end: start + span.end,
		style: span.style
	});
	for (const link of cell.links) state.links.push(copyMarkdownLinkSpan(link, {
		start: start + link.start,
		end: start + link.end
	}));
	for (const annotation of cell.annotations ?? []) state.annotations.push({
		...annotation,
		start: start + annotation.start,
		end: start + annotation.end
	});
}
function appendCellTextOnly(state, cell) {
	if (!cell.text) return;
	state.text += cell.text;
}
function collectTableBlock(state) {
	if (!state.table) return;
	const headerCells = state.table.headers.map(trimCell);
	const rowCells = state.table.rows.map((row) => row.map(trimCell));
	const table = {
		headers: headerCells.map((cell) => cell.text),
		rows: rowCells.map((row) => row.map((cell) => cell.text)),
		headerCells,
		rowCells,
		placeholderOffset: state.text.length,
		...state.table.aligns.some(Boolean) ? { aligns: [...state.table.aligns] } : {}
	};
	state.collectedTables.push(table);
}
function appendTableBulletValue(state, params) {
	const { header, value, columnIndex, includeColumnFallback } = params;
	if (!value?.text) return;
	state.text += "• ";
	if (header?.text) {
		appendCell(state, header);
		state.text += ": ";
	} else if (includeColumnFallback) state.text += `Column ${columnIndex}: `;
	appendCell(state, value);
	state.text += "\n";
}
function renderTableAsBullets(state) {
	if (!state.table) return;
	const headers = state.table.headers.map(trimCell);
	const rows = state.table.rows.map((row) => row.map(trimCell));
	if (headers.length === 0 && rows.length === 0) return;
	if (headers.length > 1 && rows.length > 0) for (const row of rows) {
		if (row.length === 0) continue;
		const rowLabel = row[0];
		if (rowLabel?.text) {
			const labelStart = state.text.length;
			appendCell(state, rowLabel);
			const labelEnd = state.text.length;
			if (labelEnd > labelStart) state.styles.push({
				start: labelStart,
				end: labelEnd,
				style: "bold"
			});
			state.text += "\n";
		}
		for (let i = 1; i < row.length; i++) appendTableBulletValue(state, {
			header: headers[i],
			value: row[i],
			columnIndex: i,
			includeColumnFallback: true
		});
		state.text += "\n";
	}
	else for (const row of rows) {
		for (let i = 0; i < row.length; i++) appendTableBulletValue(state, {
			header: headers[i],
			value: row[i],
			columnIndex: i,
			includeColumnFallback: false
		});
		state.text += "\n";
	}
}
function renderTableAsCode(state) {
	if (!state.table) return;
	const headers = state.table.headers.map(trimCell);
	const rows = state.table.rows.map((row) => row.map(trimCell));
	const columnCount = Math.max(headers.length, ...rows.map((row) => row.length));
	if (columnCount === 0) return;
	const widths = Array.from({ length: columnCount }, () => 0);
	const updateWidths = (cells) => {
		for (const [i, currentWidth] of widths.entries()) {
			const cell = cells[i];
			const width = visibleWidth(cell?.text ?? "");
			if (currentWidth < width) widths[i] = width;
		}
	};
	updateWidths(headers);
	for (const row of rows) updateWidths(row);
	const codeStart = state.text.length;
	const appendRow = (cells) => {
		state.text += "|";
		for (const [i, width] of widths.entries()) {
			state.text += " ";
			const cell = cells[i];
			if (cell) appendCellTextOnly(state, cell);
			const pad = width - visibleWidth(cell?.text ?? "");
			if (pad > 0) state.text += " ".repeat(pad);
			state.text += " |";
		}
		state.text += "\n";
	};
	const appendDivider = () => {
		state.text += "|";
		for (const width of widths) {
			const dashCount = Math.max(3, width);
			state.text += ` ${"-".repeat(dashCount)} |`;
		}
		state.text += "\n";
	};
	appendRow(headers);
	appendDivider();
	for (const row of rows) appendRow(row);
	const codeEnd = state.text.length;
	if (codeEnd > codeStart) state.styles.push({
		start: codeStart,
		end: codeEnd,
		style: "code_block"
	});
	if (state.env.listStack.length === 0) state.text += "\n";
}
function renderTokens(tokens, state) {
	const nextMappedBlockStarts = computeNextMappedBlockStarts(tokens);
	for (const [tokenIndex, token] of tokens.entries()) switch (token.type) {
		case "inline":
			if (token.children) renderTokens(token.children, state);
			break;
		case "text":
			recordTaskMarker(state, token.content ?? "");
			appendText(state, token.content ?? "");
			break;
		case "underline_open":
			openStyle(state, "underline");
			break;
		case "underline_close":
			closeStyle(state, "underline");
			break;
		case ASSISTANT_TRANSCRIPT_ROLE_NODE_TYPE: {
			const meta = token.meta?.assistantTranscriptRoleHeader;
			if (meta) appendAssistantTranscriptRoleText(resolveRenderTarget(state), token.content ?? "", meta);
			else appendText(state, token.content ?? "");
			break;
		}
		case "em_open":
			openStyle(state, "italic");
			break;
		case "em_close":
			closeStyle(state, "italic");
			break;
		case "strong_open":
			openStyle(state, "bold");
			break;
		case "strong_close":
			closeStyle(state, "bold");
			break;
		case "s_open":
			openStyle(state, "strikethrough");
			break;
		case "s_close":
			closeStyle(state, "strikethrough");
			break;
		case "code_inline":
			renderInlineCode(state, token.content ?? "");
			break;
		case "spoiler_open":
			if (state.enableSpoilers) openStyle(state, "spoiler");
			break;
		case "spoiler_close":
			if (state.enableSpoilers) closeStyle(state, "spoiler");
			break;
		case "link_open": {
			const target = resolveRenderTarget(state);
			const href = isInsideMarkdownHtmlTag(target.text) ? "" : getAttr(token, "href") ?? "";
			target.linkStack.push({
				href,
				labelStart: target.text.length,
				autoLinked: token.markup === "linkify"
			});
			break;
		}
		case "link_close":
			handleLinkClose(state);
			break;
		case "image": {
			const meta = token.meta?.assistantTranscriptRoleImage;
			if (meta) appendAssistantTranscriptRoleImage(resolveRenderTarget(state), meta);
			else appendText(state, token.content ?? "");
			break;
		}
		case "softbreak":
		case "hardbreak":
			appendText(state, "\n");
			break;
		case "paragraph_close":
			appendParagraphSeparator(state, token);
			break;
		case "heading_open":
			state.headingLineEnd = token.map?.[1];
			state.headingBlock = {
				kind: "heading",
				start: state.text.length,
				end: state.text.length,
				depth: state.env.listStack.length + state.blockquoteStack.length + 1,
				blockquoteDepth: state.blockquoteStack.length,
				headingLevel: Number.parseInt(token.tag?.slice(1) ?? "", 10),
				headingOrigin: token.markup?.startsWith("#") ? "atx" : "setext",
				...token.map ? {
					sourceStartLine: token.map[0],
					sourceEndLine: token.map[1]
				} : {}
			};
			if (state.headingStyle === "bold") openStyle(state, "bold");
			else if (state.headingStyle === "rich") {
				const style = headingStyleFromToken(token);
				if (style) openStyle(state, style);
			}
			break;
		case "heading_close":
			if (state.headingStyle === "bold") closeStyle(state, "bold");
			else if (state.headingStyle === "rich") {
				const style = headingStyleFromToken(token);
				if (style) closeStyle(state, style);
			}
			if (state.headingBlock) state.blocks.push({
				...state.headingBlock,
				end: state.text.length
			});
			state.headingBlock = void 0;
			appendHeadingSeparator(state, nextMappedBlockStarts[tokenIndex]);
			break;
		case "blockquote_open":
			if (state.blockquotePrefix) state.text += state.blockquotePrefix;
			state.blockquoteStack.push({
				start: state.text.length,
				depth: state.env.listStack.length + state.blockquoteStack.length + 1,
				blockquoteDepth: state.blockquoteStack.length + 1,
				...token.map ? {
					sourceStartLine: token.map[0],
					sourceEndLine: token.map[1]
				} : {}
			});
			openStyle(state, "blockquote");
			break;
		case "blockquote_close": {
			closeStyle(state, "blockquote", { trimTrailingParagraphSeparator: true });
			const blockquote = state.blockquoteStack.pop();
			const end = Math.max(blockquote?.start ?? 0, state.text.endsWith("\n\n") ? state.text.length - 2 : state.text.length);
			if (blockquote) state.blocks.push({
				kind: "blockquote",
				...blockquote,
				end
			});
			break;
		}
		case "bullet_list_open":
			if (state.env.listStack.length > 0) appendNestedListSeparator(state);
			state.env.listStack.push({
				type: "bullet",
				index: 0,
				openLevel: token.level ?? 0,
				id: state.nextListId++,
				...state.env.listStack.at(-1)?.id !== void 0 ? { parentId: state.env.listStack.at(-1)?.id } : {}
			});
			break;
		case "bullet_list_close":
			state.env.listStack.pop();
			if (state.env.listStack.length === 0) appendTopLevelListSeparator(state);
			break;
		case "ordered_list_open": {
			if (state.env.listStack.length > 0) appendNestedListSeparator(state);
			const start = Number(getAttr(token, "start") ?? "1");
			state.env.listStack.push({
				type: "ordered",
				index: start - 1,
				openLevel: token.level ?? 0,
				id: state.nextListId++,
				...state.env.listStack.at(-1)?.id !== void 0 ? { parentId: state.env.listStack.at(-1)?.id } : {}
			});
			break;
		}
		case "ordered_list_close":
			state.env.listStack.pop();
			if (state.env.listStack.length === 0) appendTopLevelListSeparator(state);
			break;
		case "list_item_open": {
			const leadingInline = tokens[tokenIndex + 1]?.type === "paragraph_open" ? tokens[tokenIndex + 2] : void 0;
			const item = appendListPrefix(state, leadingInline?.type === "inline" && leadingInline.taskListMarker === true);
			if (item) {
				recordListSourceMetadata(state, item, token);
				state.openListItems.push(item);
			}
			break;
		}
		case "list_item_close": {
			const item = state.openListItems.pop();
			if (item) {
				const end = state.text.length;
				const markerEnd = item.listMarker?.end ?? item.start ?? end;
				let contentStart = markerEnd;
				while (contentStart < end && /[ \t\r\n]/u.test(state.text[contentStart] ?? "")) contentStart += 1;
				let contentEnd = end;
				while (contentEnd > contentStart && /[ \t\r\n]/u.test(state.text[contentEnd - 1] ?? "")) contentEnd -= 1;
				const markerLineEnd = state.text.indexOf("\n", markerEnd);
				const markerContentEnd = markerLineEnd === -1 ? end : Math.min(markerLineEnd, end);
				const markerOnly = !state.text.slice(markerEnd, markerContentEnd).replace(/[ \t\r\n]/gu, "");
				const listItem = {
					kind: item.kind,
					...item.listMarker ? { listMarker: item.listMarker } : {},
					...item.task ? { task: true } : {},
					...item.taskMarker ? { taskMarker: item.taskMarker } : {},
					...item.listId !== void 0 ? { listId: item.listId } : {},
					...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
					...item.depth !== void 0 ? { depth: item.depth } : {},
					...item.start !== void 0 ? { start: item.start } : {},
					end
				};
				state.listItems.push(attachListItemMetadata(listItem, {
					...contentEnd > contentStart ? {
						contentStart,
						contentEnd
					} : {},
					...(item.sourceMarker ? item.markerOnly : markerOnly) ? { markerOnly: true } : {},
					sourceMarker: item.sourceMarker,
					sourceContent: item.sourceContent,
					sourceIndent: item.sourceIndent,
					sourceStartLine: item.sourceStartLine,
					sourceEndLine: item.sourceEndLine
				}));
			}
			if (!state.text.endsWith("\n")) state.text += "\n";
			break;
		}
		case "code_block":
			renderCodeBlock(state, token.content ?? "", token.info, sourceBlockNewlineCount(state.preserveSourceBlockSpacing, nextMappedBlockStarts[tokenIndex], token.map?.[1]), "indented", token.map);
			break;
		case "fence":
			renderCodeBlock(state, token.content ?? "", token.info, sourceBlockNewlineCount(state.preserveSourceBlockSpacing, nextMappedBlockStarts[tokenIndex], token.map?.[1]), "fenced", token.map, isFenceClosed(token));
			break;
		case "html_block":
		case "html_inline":
			appendText(state, token.content ?? "");
			break;
		case "table_open":
			if (state.tableMode !== "off") {
				state.table = initTableState();
				state.hasTables = true;
			}
			break;
		case "table_close":
			if (state.table) {
				if (state.tableMode === "bullets") renderTableAsBullets(state);
				else if (state.tableMode === "code") renderTableAsCode(state);
				else if (state.tableMode === "block") collectTableBlock(state);
			}
			state.table = null;
			break;
		case "thead_open":
			if (state.table) state.table.inHeader = true;
			break;
		case "thead_close":
			if (state.table) state.table.inHeader = false;
			break;
		case "tbody_open":
		case "tbody_close": break;
		case "tr_open":
			if (state.table) state.table.currentRow = [];
			break;
		case "tr_close":
			if (state.table) {
				if (state.table.inHeader) state.table.headers = state.table.currentRow;
				else state.table.rows.push(state.table.currentRow);
				state.table.currentRow = [];
			}
			break;
		case "th_open":
		case "td_open":
			if (state.table) {
				state.table.currentCell = initRenderTarget();
				if (token.type === "th_open" && state.table.inHeader) state.table.aligns[state.table.currentRow.length] = markdownTableAlignmentFromToken(token);
			}
			break;
		case "th_close":
		case "td_close":
			if (state.table?.currentCell) {
				state.table.currentRow.push(finishTableCell(state.table.currentCell));
				state.table.currentCell = null;
			}
			break;
		case "hr":
			{
				const start = state.text.length;
				if (state.horizontalRuleText) state.text += `${state.horizontalRuleText}\n\n`;
				state.blocks.push({
					kind: "thematic_break",
					start,
					end: start + state.horizontalRuleText.length,
					depth: state.env.listStack.length + state.blockquoteStack.length + 1,
					blockquoteDepth: state.blockquoteStack.length,
					...token.map ? {
						sourceStartLine: token.map[0],
						sourceEndLine: token.map[1]
					} : {}
				});
			}
			break;
		default:
			if (token.children) renderTokens(token.children, state);
			break;
	}
}
function closeRemainingStyles(target) {
	for (const open of target.openStyles.toReversed()) {
		const end = target.text.length;
		if (end > open.start) target.styles.push({
			start: open.start,
			end,
			style: open.style
		});
	}
	target.openStyles = [];
}
function sliceListMarker(marker, start, end) {
	const sliceStart = Math.max(marker.start, start);
	const sliceEnd = Math.min(marker.end, end);
	return sliceEnd > sliceStart ? {
		start: sliceStart - start,
		end: sliceEnd - start
	} : void 0;
}
function sliceMarkdownIR(ir, start, end) {
	const textLength = ir.text.length;
	const integerStart = Math.trunc(start) || 0;
	const integerEnd = Math.trunc(end) || 0;
	let normalizedStart = integerStart < 0 ? Math.max(textLength + integerStart, 0) : Math.min(integerStart, textLength);
	let normalizedEnd = integerEnd < 0 ? Math.max(textLength + integerEnd, 0) : Math.min(integerEnd, textLength);
	if (normalizedStart < normalizedEnd) {
		const safeStart = avoidTrailingHighSurrogateBreak(ir.text, 0, normalizedStart);
		if (safeStart !== normalizedStart) normalizedStart = safeStart < normalizedStart ? safeStart : normalizedStart - 1;
		const safeEnd = avoidTrailingHighSurrogateBreak(ir.text, 0, normalizedEnd);
		if (safeEnd !== normalizedEnd) normalizedEnd = safeEnd > normalizedEnd ? safeEnd : normalizedEnd + 1;
	}
	const metadataIR = ir;
	const annotations = sliceAnnotationSpans(ir.annotations ?? [], normalizedStart, normalizedEnd);
	const listItems = (ir.listItems ?? []).flatMap((item) => {
		const listMarker = item.listMarker ? sliceListMarker(item.listMarker, normalizedStart, normalizedEnd) : void 0;
		const taskMarker = item.taskMarker ? sliceListMarker(item.taskMarker, normalizedStart, normalizedEnd) : void 0;
		const content = item.contentStart !== void 0 && item.contentEnd !== void 0 ? sliceListMarker({
			start: item.contentStart,
			end: item.contentEnd
		}, normalizedStart, normalizedEnd) : void 0;
		return listMarker || taskMarker ? [attachListItemMetadata({
			kind: item.kind,
			...listMarker ? { listMarker } : {},
			...item.task ? { task: true } : {},
			...taskMarker ? { taskMarker } : {},
			...item.listId !== void 0 ? { listId: item.listId } : {},
			...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
			...item.depth !== void 0 ? { depth: item.depth } : {},
			...item.start !== void 0 ? { start: Math.max(item.start, normalizedStart) - normalizedStart } : {},
			...item.end !== void 0 ? { end: Math.min(item.end, normalizedEnd) - normalizedStart } : {}
		}, {
			...content ? {
				contentStart: content.start,
				contentEnd: content.end
			} : {},
			...item.markerOnly ? { markerOnly: true } : {},
			sourceMarker: item.sourceMarker,
			sourceContent: item.sourceContent,
			sourceIndent: item.sourceIndent,
			sourceStartLine: item.sourceStartLine,
			sourceEndLine: item.sourceEndLine
		})] : [];
	});
	const blocks = (metadataIR.blocks ?? []).flatMap((block) => {
		if (block.start === block.end) return (normalizedStart === normalizedEnd ? block.start === normalizedStart : block.start >= normalizedStart && block.start < normalizedEnd) ? [{
			...block,
			start: block.start - normalizedStart,
			end: block.end - normalizedStart
		}] : [];
		const sliced = sliceListMarker(block, normalizedStart, normalizedEnd);
		return sliced ? [{
			...block,
			...sliced
		}] : [];
	});
	return attachBlockMetadata({
		text: ir.text.slice(normalizedStart, normalizedEnd),
		styles: sliceStyleSpans(ir.styles, normalizedStart, normalizedEnd),
		links: sliceLinkSpans(ir.links, normalizedStart, normalizedEnd),
		...annotations.length > 0 ? { annotations } : {},
		...listItems.length > 0 ? { listItems } : {}
	}, blocks);
}
function markdownToIR(markdown, options = {}) {
	return markdownToIRWithMeta(markdown, options).ir;
}
function indexSourceLines(source) {
	const lines = [];
	const starts = [];
	let start = 0;
	for (let index = 0; index < source.length; index += 1) {
		const character = source[index];
		if (character !== "\r" && character !== "\n") continue;
		starts.push(start);
		lines.push(source.slice(start, index));
		if (character === "\r" && source[index + 1] === "\n") index += 1;
		start = index + 1;
	}
	starts.push(start);
	lines.push(source.slice(start));
	return {
		lines,
		starts
	};
}
function markdownToIRWithMeta(markdown, options = {}) {
	const source = markdown ?? "";
	const sourceLines = indexSourceLines(source);
	const env = {
		listStack: [],
		assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders === true,
		assistantTranscriptRolePreserveLinks: options.assistantTranscriptRoleHeaders === true
	};
	const tokens = createMarkdownIt(options).parse(source, env);
	const tableMode = options.tableMode ?? "off";
	const state = {
		text: "",
		styles: [],
		openStyles: [],
		links: [],
		linkStack: [],
		annotations: [],
		env,
		headingStyle: options.headingStyle ?? "none",
		blockquotePrefix: options.blockquotePrefix ?? "",
		enableSpoilers: options.enableSpoilers ?? false,
		tableMode,
		table: null,
		hasTables: false,
		collectedTables: [],
		horizontalRuleText: options.horizontalRuleText ?? "───",
		preserveSourceBlockSpacing: options.preserveSourceBlockSpacing ?? false,
		headingLineEnd: void 0,
		listItems: [],
		openListItems: [],
		listItemsOpenedByLine: /* @__PURE__ */ new Map(),
		nextListId: 0,
		blocks: [],
		headingBlock: void 0,
		blockquoteStack: [],
		source,
		sourceLineStarts: sourceLines.starts,
		sourceLines: sourceLines.lines
	};
	renderTokens(tokens, state);
	closeRemainingStyles(state);
	const trimmedLength = state.text.trimEnd().length;
	let codeBlockEnd = 0;
	for (const span of state.styles) {
		if (span.style !== "code_block") continue;
		if (span.end > codeBlockEnd) codeBlockEnd = span.end;
	}
	const finalLength = Math.max(trimmedLength, codeBlockEnd);
	const finalText = finalLength === state.text.length ? state.text : state.text.slice(0, finalLength);
	const annotations = mergeAnnotationSpans(clampAnnotationSpans(state.annotations, finalLength));
	const listItems = state.listItems.flatMap((item) => {
		const listMarker = item.listMarker ? sliceListMarker(item.listMarker, 0, finalLength) : void 0;
		const taskMarker = item.taskMarker ? sliceListMarker(item.taskMarker, 0, finalLength) : void 0;
		return listMarker || taskMarker ? [attachListItemMetadata({
			kind: item.kind,
			...listMarker ? { listMarker } : {},
			...item.task ? { task: true } : {},
			...taskMarker ? { taskMarker } : {},
			...item.listId !== void 0 ? { listId: item.listId } : {},
			...item.parentListId !== void 0 ? { parentListId: item.parentListId } : {},
			...item.depth !== void 0 ? { depth: item.depth } : {},
			...item.start !== void 0 ? { start: Math.min(item.start, finalLength) } : {},
			...item.end !== void 0 ? { end: Math.min(item.end, finalLength) } : {}
		}, {
			...item.contentStart !== void 0 ? { contentStart: Math.min(item.contentStart, finalLength) } : {},
			...item.contentEnd !== void 0 ? { contentEnd: Math.min(item.contentEnd, finalLength) } : {},
			...item.markerOnly ? { markerOnly: true } : {},
			sourceMarker: item.sourceMarker,
			sourceContent: item.sourceContent,
			sourceIndent: item.sourceIndent,
			sourceStartLine: item.sourceStartLine,
			sourceEndLine: item.sourceEndLine
		})] : [];
	});
	const blocks = state.blocks.flatMap((block) => {
		const start = Math.min(block.start, finalLength);
		const end = Math.min(block.end, finalLength);
		return end > start || block.kind === "blockquote" || block.kind === "code_block" || block.kind === "heading" || block.kind === "thematic_break" ? [{
			...block,
			start,
			end
		}] : [];
	}).toSorted((left, right) => left.start - right.start || left.end - right.end || left.depth - right.depth || left.kind.localeCompare(right.kind));
	const ir = {
		text: finalText,
		styles: mergeStyleSpans(clampStyleSpans(state.styles, finalLength)),
		links: clampLinkSpans(state.links, finalLength),
		...annotations.length > 0 ? { annotations } : {},
		...listItems.length > 0 ? { listItems } : {}
	};
	attachBlockMetadata(ir, blocks);
	return {
		ir,
		hasTables: state.hasTables,
		tables: state.collectedTables.map((table) => Object.assign({}, table, { placeholderOffset: Math.min(table.placeholderOffset, finalLength) }))
	};
}
function chunkMarkdownIR(ir, limit) {
	if (!ir.text) return [];
	if (limit <= 0 || ir.text.length <= limit) return [ir];
	const chunks = chunkText(ir.text, limit);
	const results = [];
	let cursor = 0;
	chunks.forEach((chunk, index) => {
		if (!chunk) return;
		if (index > 0) while (cursor < ir.text.length && /\s/.test(ir.text[cursor] ?? "")) cursor += 1;
		const start = cursor;
		const end = Math.min(ir.text.length, start + chunk.length);
		const sliced = sliceMarkdownIR(ir, start, end);
		sliced.text = chunk;
		results.push(sliced);
		cursor = end;
	});
	return results;
}
//#endregion
//#region packages/markdown-core/src/construct-fallbacks.ts
const STYLE_CONSTRUCTS = {
	bold: "bold",
	italic: "italic",
	underline: "underline",
	strikethrough: "strikethrough",
	spoiler: "spoiler",
	code: "codeInline",
	code_block: "codeBlock",
	blockquote: "blockquote"
};
function isHeading(style) {
	return style.startsWith("heading_");
}
function projectStyles(styles, profile) {
	const projected = [];
	let synthesizedHeading = false;
	for (const span of styles) {
		if (isHeading(span.style)) {
			if (profile.constructs.heading === "native") projected.push(span);
			else if (profile.constructs.heading === "fallback" && profile.constructs.bold === "native") {
				projected.push(createStyleSpan({
					...span,
					style: "bold"
				}));
				synthesizedHeading = true;
			}
			continue;
		}
		const construct = STYLE_CONSTRUCTS[span.style];
		if (construct && profile.constructs[construct] !== "native") continue;
		if (span.style === "code_block" && profile.constructs.codeLanguage !== "native") projected.push(createStyleSpan({
			start: span.start,
			end: span.end,
			style: span.style
		}));
		else projected.push(span);
	}
	return synthesizedHeading ? mergeStyleSpans(projected) : projected;
}
function collectLinkFallbacks(ir, profile) {
	if (profile.constructs.linkLabel === "native") return {
		links: ir.links,
		edits: []
	};
	if (profile.constructs.linkLabel === "strip") return {
		links: [],
		edits: []
	};
	return {
		links: [],
		edits: ir.links.flatMap((link) => {
			const href = link.href.trim();
			const label = ir.text.slice(link.start, link.end).trim();
			const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
			return href && label && label !== href && label !== comparableHref ? [{
				start: link.end,
				end: link.end,
				text: ` (${href})`
			}] : [];
		})
	};
}
function collectListFallbacks(ir, profile) {
	const edits = [];
	for (const item of ir.listItems ?? []) {
		if (item.task) {
			if (profile.constructs.taskList === "fallback" && item.listMarker) edits.push({
				...item.listMarker,
				text: ""
			});
			else if (profile.constructs.taskList === "strip" && item.taskMarker) edits.push({
				...item.taskMarker,
				text: ""
			});
		}
		if (item.listMarker && item.kind === "bullet" && profile.constructs.bulletList === "strip") edits.push({
			...item.listMarker,
			text: ""
		});
		if (item.listMarker && item.kind === "ordered" && profile.constructs.orderedList === "strip") edits.push({
			...item.listMarker,
			text: ""
		});
	}
	return edits;
}
function appendSlice(target, source) {
	const offset = target.text.length;
	target.text += source.text;
	target.styles.push(...source.styles.map((span) => createStyleSpan({
		...span,
		start: offset + span.start,
		end: offset + span.end
	})));
	target.links.push(...source.links.map((link) => copyMarkdownLinkSpan(link, {
		start: offset + link.start,
		end: offset + link.end
	})));
	const annotations = source.annotations?.map((annotation) => ({
		...annotation,
		start: offset + annotation.start,
		end: offset + annotation.end
	}));
	if (annotations?.length) (target.annotations ??= []).push(...annotations);
}
function applyTextEdits(ir, edits) {
	if (edits.length === 0) return ir;
	const ordered = edits.toSorted((a, b) => a.start - b.start || a.end - b.end).filter((edit, index, all) => {
		const previous = all[index - 1];
		return !previous || edit.start !== previous.start || edit.end !== previous.end;
	});
	const result = {
		text: "",
		styles: [],
		links: []
	};
	let cursor = 0;
	for (const edit of ordered) {
		appendSlice(result, sliceMarkdownIR(ir, cursor, edit.start));
		result.text += edit.text;
		cursor = edit.end;
	}
	appendSlice(result, sliceMarkdownIR(ir, cursor, ir.text.length));
	result.styles = mergeStyleSpans(result.styles);
	if (result.annotations) result.annotations = mergeAnnotationSpans(result.annotations);
	return result;
}
/** Applies target-declared semantic fallbacks before a mechanism-specific renderer runs. */
function applyConstructFallbacks(ir, profile) {
	const styled = {
		...ir,
		styles: projectStyles(ir.styles, profile)
	};
	const listProjected = applyTextEdits(styled, collectListFallbacks(styled, profile));
	const linkProjection = collectLinkFallbacks(listProjected, profile);
	return applyTextEdits({
		...listProjected,
		links: linkProjection.links
	}, linkProjection.edits);
}
//#endregion
export { sliceMarkdownIR as a, isAutoLinkedMarkdownLink as c, tokenizeHtmlTags as d, findAssistantTranscriptRoleHeaderSpans as f, markdownToIRWithMeta as i, mergeAnnotationSpans as l, chunkMarkdownIR as n, annotateAssistantTranscriptRoleMessageBoundary as o, markdownToIR as r, copyMarkdownLinkSpan as s, applyConstructFallbacks as t, chunkTextRanges as u };
