import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.js";
import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.js";
//#region src/shared/text-chunking.ts
const CJK_PUNCTUATION_BREAK_AFTER_RE = /[、。，．！？；：）］｝〉》」』】〕〗〙]/u;
function normalizeChunkLimit(limit) {
	return Number.isFinite(limit) && limit > 0 ? resolveIntegerOption(limit, 1, { min: 1 }) : limit;
}
function clampToCodePointBoundary(text, index) {
	return avoidTrailingHighSurrogateBreak(text, 0, Math.min(Math.max(0, index), text.length));
}
function findWhitespaceBreak(window) {
	for (let index = window.length - 1; index >= 0; index--) if (/\s/.test(window.charAt(index))) return index;
	return -1;
}
function findCjkPunctuationBreak(window) {
	for (let end = window.length; end > 0;) {
		const code = window.charCodeAt(end - 1);
		const start = code >= 56320 && code <= 57343 && end > 1 ? end - 2 : end - 1;
		if (start > 0 && CJK_PUNCTUATION_BREAK_AFTER_RE.test(window.slice(start, end))) return end;
		end = start;
	}
	return -1;
}
function splitLongTextLine(line, limit, options) {
	const normalizedLimit = normalizeChunkLimit(limit);
	if (normalizedLimit <= 0 || line.length <= normalizedLimit) return [line];
	const chunks = [];
	let remaining = line;
	while (remaining.length > normalizedLimit) {
		let breakIndex = clampToCodePointBoundary(remaining, normalizedLimit);
		if (!options.preserveWhitespace) {
			const window = remaining.slice(0, normalizedLimit);
			breakIndex = findWhitespaceBreak(window);
			if (breakIndex <= 0) breakIndex = findCjkPunctuationBreak(window);
			if (breakIndex <= 0) breakIndex = clampToCodePointBoundary(remaining, normalizedLimit);
		}
		chunks.push(remaining.slice(0, breakIndex));
		remaining = remaining.slice(breakIndex);
	}
	if (remaining) chunks.push(remaining);
	return chunks;
}
/**
* Splits text into bounded chunks using caller-owned soft-break selection.
*
* The resolver sees each limit-sized window and returns an in-window break index;
* invalid indexes fall back to the hard limit so chunking always makes progress.
*/
function chunkTextByBreakResolver(text, limit, resolveBreakIndex) {
	if (!text) return [];
	const normalizedLimit = normalizeChunkLimit(limit);
	if (normalizedLimit <= 0 || text.length <= normalizedLimit) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > normalizedLimit) {
		const candidateBreak = resolveBreakIndex(remaining.slice(0, normalizedLimit));
		const safeBreakIdx = avoidTrailingHighSurrogateBreak(remaining, 0, Number.isInteger(candidateBreak) && candidateBreak > 0 && candidateBreak <= normalizedLimit ? candidateBreak : normalizedLimit);
		const chunk = remaining.slice(0, safeBreakIdx).trimEnd();
		if (chunk.length > 0) chunks.push(chunk);
		const brokeOnSeparator = safeBreakIdx < remaining.length && /\s/.test(remaining.charAt(safeBreakIdx));
		const nextStart = Math.min(remaining.length, safeBreakIdx + (brokeOnSeparator ? 1 : 0));
		remaining = remaining.slice(nextStart).trimStart();
	}
	const finalChunk = remaining.trimEnd();
	if (finalChunk.length) chunks.push(finalChunk);
	return chunks;
}
//#endregion
export { normalizeChunkLimit as n, splitLongTextLine as r, chunkTextByBreakResolver as t };
