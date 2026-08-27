import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-_fxsAvI_.js";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.js";
import "./number-runtime-Cy4drVnh.js";
import "./reply-reference-BudVOYtJ.js";
import "./reply-chunking-BXCYNOLj.js";
import { t as chunkTextForOutbound } from "./text-chunking-CJz4kAsi.js";
//#region extensions/discord/src/reply-reference.ts
function resolveDiscordReplyReference(params) {
	if (!params.replyToId) return;
	const singleUse = params.replyToIdSource !== "explicit" && params.replyToMode !== void 0 && isSingleUseReplyToMode(params.replyToMode);
	return {
		messageId: params.replyToId,
		scope: singleUse ? "first" : "all"
	};
}
function createReusableDiscordReplyReference(messageId) {
	return messageId ? {
		messageId,
		scope: "all"
	} : void 0;
}
function resolveDiscordReplyMessageId(reply, isFirst) {
	return reply && (isFirst || reply.scope === "all") ? reply.messageId : void 0;
}
//#endregion
//#region extensions/discord/src/chunk.ts
const DEFAULT_MAX_CHARS = 2e3;
const DEFAULT_MAX_LINES = 17;
const REASONING_ITALICS_MARKER_CHARS = 2;
const MIN_REASONING_ITALICS_CHUNK_CHARS = 4;
const FENCE_RE = /^( {0,3})(`{3,}|~{3,})(.*)$/;
function hasReasoningItalics(text) {
	return /^(?:Reasoning:|Thinking\.{0,3})\n+_/u.test(text) && text.trimEnd().endsWith("_");
}
function resolveDiscordChunkLimit(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 1 });
}
function countLines(text) {
	if (!text) return 0;
	return text.split("\n").length;
}
function parseFenceLine(line) {
	const match = line.match(FENCE_RE);
	if (!match) return null;
	const indent = match[1] ?? "";
	const marker = match[2] ?? "";
	return {
		indent,
		markerChar: marker[0] ?? "`",
		markerLen: marker.length,
		openLine: line
	};
}
function closeFenceLine(openFence) {
	return `${openFence.indent}${openFence.markerChar.repeat(openFence.markerLen)}`;
}
function canBalanceFence(openFence, maxChars) {
	return closeFenceLine(openFence).length * 2 + 3 <= maxChars;
}
function reopenFenceLine(openFence, maxChars) {
	const bareMarker = closeFenceLine(openFence);
	if (!canBalanceFence(openFence, maxChars)) return null;
	if (openFence.openLine.length + bareMarker.length + 3 <= maxChars) return openFence.openLine;
	return bareMarker;
}
function closeFenceIfNeeded(text, openFence, maxChars) {
	if (!openFence || !canBalanceFence(openFence, maxChars)) return text;
	const closeLine = closeFenceLine(openFence);
	if (!text) return closeLine;
	if (!text.endsWith("\n")) return `${text}\n${closeLine}`;
	return `${text}${closeLine}`;
}
/**
* Chunks outbound Discord text by both character count and (soft) line count,
* while keeping fenced code blocks balanced across chunks.
*/
function chunkDiscordText(text, opts = {}) {
	const hardMaxChars = resolveDiscordChunkLimit(opts.maxChars, DEFAULT_MAX_CHARS);
	const maxLines = resolveDiscordChunkLimit(opts.maxLines, DEFAULT_MAX_LINES);
	const body = text ?? "";
	if (!body) return [];
	if (body.length <= hardMaxChars && countLines(body) <= maxLines) return [body];
	const maxChars = hardMaxChars >= MIN_REASONING_ITALICS_CHUNK_CHARS && hasReasoningItalics(body) ? hardMaxChars - REASONING_ITALICS_MARKER_CHARS : hardMaxChars;
	const lines = body.split("\n");
	const chunks = [];
	let current = "";
	let currentLines = 0;
	let openFence = null;
	const flush = () => {
		if (!current) return;
		const payload = closeFenceIfNeeded(current, openFence, maxChars);
		if (payload.trim().length) chunks.push(payload);
		current = "";
		currentLines = 0;
		if (openFence) {
			const reopenLine = reopenFenceLine(openFence, maxChars);
			if (reopenLine) {
				current = reopenLine;
				currentLines = 1;
			}
		}
	};
	for (const originalLine of lines) {
		const fenceInfo = parseFenceLine(originalLine);
		const wasInsideFence = openFence !== null;
		let nextOpenFence = openFence;
		if (fenceInfo) {
			if (!openFence) nextOpenFence = fenceInfo;
			else if (openFence.markerChar === fenceInfo.markerChar && fenceInfo.markerLen >= openFence.markerLen) nextOpenFence = null;
		}
		const candidateFence = nextOpenFence ?? openFence;
		const fenceToReserve = candidateFence && canBalanceFence(candidateFence, maxChars) ? candidateFence : null;
		const reserveChars = fenceToReserve ? closeFenceLine(fenceToReserve).length + 1 : 0;
		const reserveLines = fenceToReserve ? 1 : 0;
		const effectiveMaxChars = maxChars - reserveChars;
		const effectiveMaxLines = maxLines - reserveLines;
		const charLimit = effectiveMaxChars > 0 ? effectiveMaxChars : maxChars;
		const lineLimit = effectiveMaxLines > 0 ? effectiveMaxLines : maxLines;
		const reopenPrefixLen = fenceToReserve ? reopenFenceLine(fenceToReserve, maxChars)?.length ?? 0 : 0;
		const prefixLen = current.length > 0 ? current.length + 1 : 0;
		const reopenBudget = reopenPrefixLen > 0 ? reopenPrefixLen + 1 : 0;
		const segments = chunkTextForOutbound(originalLine, Math.max(1, charLimit - Math.max(prefixLen, reopenBudget)), { preserveWhitespace: wasInsideFence });
		for (let segIndex = 0; segIndex < segments.length; segIndex++) {
			const segment = segments[segIndex];
			const isLineContinuation = segIndex > 0;
			let delimiter = isLineContinuation ? "" : current.length > 0 ? "\n" : "";
			let addition = `${delimiter}${segment}`;
			const nextLen = current.length + addition.length;
			const nextLines = currentLines + (isLineContinuation ? 0 : 1);
			if ((nextLen > charLimit || nextLines > lineLimit) && current.length > 0) {
				flush();
				delimiter = current.length > 0 ? "\n" : "";
				addition = `${delimiter}${segment}`;
			}
			if (current.length > 0) {
				current += addition;
				if (!isLineContinuation || delimiter) currentLines += 1;
			} else {
				current = expectDefined(segment, "current Discord chunk segment");
				currentLines = 1;
			}
		}
		openFence = nextOpenFence;
	}
	if (current.length) {
		const payload = closeFenceIfNeeded(current, openFence, maxChars);
		if (payload.trim().length) chunks.push(payload);
	}
	return rebalanceReasoningItalics(text, chunks, hardMaxChars);
}
function chunkDiscordTextWithMode(text, opts) {
	if ((opts.chunkMode ?? "length") !== "newline") return chunkDiscordText(text, opts);
	const lineChunks = chunkMarkdownTextWithMode(text, resolveDiscordChunkLimit(opts.maxChars, DEFAULT_MAX_CHARS), "newline");
	const chunks = [];
	for (const line of lineChunks) {
		const nested = chunkDiscordText(line, opts);
		if (!nested.length && line) {
			chunks.push(line);
			continue;
		}
		chunks.push(...nested);
	}
	return chunks;
}
function leadingCodeSpanEnd(body) {
	if (!body) return -1;
	const firstNewline = body.indexOf("\n");
	const openFence = parseFenceLine(firstNewline === -1 ? body : body.slice(0, firstNewline));
	if (openFence) {
		if (firstNewline === -1) return body.length;
		let lineStart = firstNewline + 1;
		while (lineStart <= body.length) {
			const lineEnd = body.indexOf("\n", lineStart);
			const line = lineEnd === -1 ? body.slice(lineStart) : body.slice(lineStart, lineEnd);
			const closeFence = parseFenceLine(line);
			const closeSuffix = closeFence ? line.slice(closeFence.indent.length + closeFence.markerLen) : "";
			if (closeFence?.markerChar === openFence.markerChar && closeFence.markerLen >= openFence.markerLen && /^[ \t]*_?[ \t]*$/u.test(closeSuffix)) {
				const markerEnd = closeFence.indent.length + closeFence.markerLen;
				const trailingSpaces = /^ */.exec(line.slice(markerEnd))?.[0].length ?? 0;
				return lineStart + markerEnd + trailingSpaces;
			}
			if (lineEnd === -1) return body.length;
			lineStart = lineEnd + 1;
		}
		return body.length;
	}
	if (!body.startsWith("`")) return -1;
	const ticks = /^(?<ticks>`+)/.exec(body)?.groups?.ticks;
	if (!ticks) return -1;
	for (let index = ticks.length; index < body.length;) {
		if (body[index] !== "`") {
			index += 1;
			continue;
		}
		let runEnd = index + 1;
		while (body[runEnd] === "`") runEnd += 1;
		if (runEnd - index === ticks.length) return runEnd;
		index = runEnd;
	}
	return -1;
}
function leadingCodePrefixEnd(body) {
	let prefixEnd = leadingCodeSpanEnd(body);
	if (prefixEnd < 0) return -1;
	while (prefixEnd < body.length) {
		const separator = /^\s+/u.exec(body.slice(prefixEnd))?.[0] ?? "";
		if (!separator) break;
		const nextStart = prefixEnd + separator.length;
		const nextEnd = leadingCodeSpanEnd(body.slice(nextStart));
		if (nextEnd < 0) break;
		prefixEnd = nextStart + nextEnd;
	}
	return prefixEnd;
}
function hasReasoningItalicsOpen(chunk) {
	const trimmed = chunk.trimStart();
	if (trimmed.startsWith("_") || /^(?:Reasoning:|Thinking\.{0,3})\n+_/u.test(trimmed)) return true;
	const codeEnd = leadingCodePrefixEnd(trimmed);
	return codeEnd >= 0 && trimmed.slice(codeEnd).trimStart().startsWith("_");
}
function reopenReasoningItalicsAfterLeadingCode(body, codeEnd) {
	const code = body.slice(0, codeEnd);
	const rest = body.slice(codeEnd);
	if (!rest.trim()) return code + rest;
	if (/^\s*_\s*$/.test(rest)) return code;
	const whitespaceLength = rest.length - rest.trimStart().length;
	const whitespace = rest.slice(0, whitespaceLength);
	const restBody = rest.slice(whitespaceLength);
	return restBody.startsWith("_") ? code + rest : `${code}${whitespace}_${restBody}`;
}
function rebalanceReasoningItalics(source, chunks, maxChars) {
	if (chunks.length <= 1 || maxChars < MIN_REASONING_ITALICS_CHUNK_CHARS) return chunks;
	if (!hasReasoningItalics(source)) return chunks;
	const adjusted = [...chunks];
	for (let i = 0; i < adjusted.length; i++) {
		const isLast = i === adjusted.length - 1;
		const current = expectDefined(adjusted[i], "Discord chunk adjustment index");
		if (!current.trimEnd().endsWith("_") && hasReasoningItalicsOpen(current)) adjusted[i] = `${current}_`;
		if (isLast) break;
		const next = expectDefined(adjusted[i + 1], "non-final Discord chunk successor");
		const leadingWhitespaceLen = next.length - next.trimStart().length;
		const leadingWhitespace = next.slice(0, leadingWhitespaceLen);
		const nextBody = next.slice(leadingWhitespaceLen);
		if (nextBody.startsWith("_")) continue;
		const codeEnd = leadingCodePrefixEnd(nextBody);
		adjusted[i + 1] = codeEnd >= 0 ? `${leadingWhitespace}${reopenReasoningItalicsAfterLeadingCode(nextBody, codeEnd)}` : `${leadingWhitespace}_${nextBody}`;
	}
	return adjusted;
}
//#endregion
export { resolveDiscordReplyReference as i, createReusableDiscordReplyReference as n, resolveDiscordReplyMessageId as r, chunkDiscordTextWithMode as t };
