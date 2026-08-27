import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as isSafeFenceBreak, r as parseFenceSpans, t as findFenceSpanAt } from "./fences-rLVnT2kD.js";
//#region src/agents/embedded-agent-block-chunker.ts
/**
* Splits streamed embedded-agent replies into Markdown-safe message chunks.
*/
function findSafeSentenceBreakIndex(text, fenceSpans, minChars, offset = 0) {
	const matches = text.matchAll(/[.!?](?=\s|$)/g);
	let sentenceIdx = -1;
	for (const match of matches) {
		const at = match.index ?? -1;
		if (at < minChars) continue;
		const candidate = at + 1;
		if (isSafeFenceBreak(fenceSpans, offset + candidate)) sentenceIdx = candidate;
	}
	return sentenceIdx >= minChars ? sentenceIdx : -1;
}
function findSafeParagraphBreakIndex(params) {
	const { text, fenceSpans, minChars, reverse, offset = 0 } = params;
	let paragraphIdx = reverse ? text.lastIndexOf("\n\n") : text.indexOf("\n\n");
	while (reverse ? paragraphIdx >= minChars : paragraphIdx !== -1) {
		const candidates = [paragraphIdx, paragraphIdx + 1];
		for (const candidate of candidates) {
			if (candidate < minChars) continue;
			if (candidate < 0 || candidate >= text.length) continue;
			if (isSafeFenceBreak(fenceSpans, offset + candidate)) return candidate;
		}
		paragraphIdx = reverse ? text.lastIndexOf("\n\n", paragraphIdx - 1) : text.indexOf("\n\n", paragraphIdx + 2);
	}
	return -1;
}
function findSafeNewlineBreakIndex(params) {
	const { text, fenceSpans, minChars, reverse, offset = 0 } = params;
	let newlineIdx = reverse ? text.lastIndexOf("\n") : text.indexOf("\n");
	while (reverse ? newlineIdx >= minChars : newlineIdx !== -1) {
		if (newlineIdx >= minChars && isSafeFenceBreak(fenceSpans, offset + newlineIdx)) return newlineIdx;
		newlineIdx = reverse ? text.lastIndexOf("\n", newlineIdx - 1) : text.indexOf("\n", newlineIdx + 1);
	}
	return -1;
}
function findFenceCloseLineStart(buffer, fence, offset = 0) {
	const relativeFenceEnd = Math.min(buffer.length, Math.max(0, fence.end - offset));
	if (relativeFenceEnd <= 0) return -1;
	const lastNewline = buffer.lastIndexOf("\n", relativeFenceEnd - 1);
	if (lastNewline < 0) return -1;
	const closingMarker = buffer.slice(lastNewline + 1, relativeFenceEnd).match(/^ {0,3}(`{3,}|~{3,})[ \t]*\r?$/)?.[1];
	return closingMarker && closingMarker.charAt(0) === fence.marker.charAt(0) && closingMarker.length >= fence.marker.length ? lastNewline + 1 : -1;
}
function resolveFenceReopenLine(fence, maxChars) {
	const bareMarker = `${fence.indent}${fence.marker}`;
	if (bareMarker.length * 2 + 3 > maxChars) return;
	return fence.openLine.length + bareMarker.length + 3 <= maxChars ? fence.openLine : bareMarker;
}
var EmbeddedBlockChunker = class {
	#buffer = "";
	#chunking;
	constructor(chunking) {
		this.#chunking = chunking;
	}
	/** Add streamed text to the pending chunk buffer. */
	append(text) {
		if (!text) return;
		this.#buffer += text;
	}
	/** Clear any buffered reply text without emitting it. */
	reset() {
		this.#buffer = "";
	}
	/** Return the currently buffered text for tests and flush logic. */
	get bufferedText() {
		return this.#buffer;
	}
	/** Return true when there is pending text to drain. */
	hasBuffered() {
		return this.#buffer.length > 0;
	}
	/** Emit safe chunks according to size and Markdown fence constraints. */
	drain(params) {
		const { force, emit } = params;
		const minChars = Math.max(1, Math.floor(this.#chunking.minChars));
		const maxChars = Math.max(minChars, Math.floor(this.#chunking.maxChars));
		if (this.#buffer.length < minChars && !force) return;
		if (force && this.#buffer.length <= maxChars) {
			if (this.#buffer.trim().length > 0) emit(this.#buffer);
			this.#buffer = "";
			return;
		}
		let source = this.#buffer;
		const fenceSpans = parseFenceSpans(source);
		let removedFenceInfoLength = 0;
		for (const fence of fenceSpans) {
			fence.start -= removedFenceInfoLength;
			fence.end -= removedFenceInfoLength;
			const reopenFenceLine = resolveFenceReopenLine(fence, maxChars);
			if (!reopenFenceLine || reopenFenceLine === fence.openLine || fence.end - fence.start <= maxChars) continue;
			source = source.slice(0, fence.start) + reopenFenceLine + source.slice(fence.start + fence.openLine.length);
			const removedLength = fence.openLine.length - reopenFenceLine.length;
			fence.openLine = reopenFenceLine;
			fence.end -= removedLength;
			removedFenceInfoLength += removedLength;
		}
		let start = 0;
		let reopenFence;
		while (start < source.length) {
			const reopenPrefix = reopenFence ? `${reopenFence.reopenFenceLine}\n` : "";
			const remainingLength = reopenPrefix.length + (source.length - start);
			if (!force && remainingLength < minChars) break;
			if (this.#chunking.flushOnParagraph && !force) {
				const paragraphBreak = findNextParagraphBreak(source, fenceSpans, start, minChars);
				const paragraphLimit = Math.max(1, maxChars - reopenPrefix.length);
				if (paragraphBreak && paragraphBreak.index - start <= paragraphLimit) {
					const chunk = `${reopenPrefix}${source.slice(start, paragraphBreak.index)}`;
					if (chunk.trim().length > 0) emit(chunk);
					start = skipLeadingNewlines(source, paragraphBreak.index + paragraphBreak.length);
					reopenFence = void 0;
					continue;
				}
				if (remainingLength < maxChars) break;
			}
			const view = source.slice(start);
			const breakResult = force && remainingLength <= maxChars ? this.#pickSoftBreakIndex(view, fenceSpans, 1, start) : this.#pickBreakIndex(view, fenceSpans, force ? 1 : void 0, start, maxChars - reopenPrefix.length);
			if (breakResult.index <= 0) {
				if (force) {
					emit(`${reopenPrefix}${source.slice(start)}`);
					start = source.length;
					reopenFence = void 0;
				}
				break;
			}
			const consumed = this.#emitBreakResult({
				breakResult,
				emit,
				reopenPrefix,
				source,
				start
			});
			if (consumed === null) continue;
			start = consumed.start;
			reopenFence = consumed.reopenFence;
			const nextLength = (reopenFence ? `${reopenFence.reopenFenceLine}\n`.length : 0) + (source.length - start);
			if (nextLength < minChars && !force) break;
			if (nextLength < maxChars && !force && !this.#chunking.flushOnParagraph) break;
		}
		this.#buffer = reopenFence ? `${reopenFence.reopenFenceLine}\n${source.slice(start)}` : stripLeadingNewlines(source.slice(start));
	}
	#emitBreakResult(params) {
		const { breakResult, emit, reopenPrefix, source, start } = params;
		const breakIdx = breakResult.index;
		if (breakIdx <= 0) return null;
		const absoluteBreakIdx = start + breakIdx;
		let rawChunk = `${reopenPrefix}${source.slice(start, absoluteBreakIdx)}`;
		if (rawChunk.trim().length === 0) return {
			start: skipLeadingNewlines(source, absoluteBreakIdx),
			reopenFence: void 0
		};
		const fenceSplit = breakResult.fenceSplit;
		if (fenceSplit) {
			const closeFence = rawChunk.endsWith("\n") ? fenceSplit.closeFenceLine : `\n${fenceSplit.closeFenceLine}`;
			rawChunk = `${rawChunk}${closeFence}`;
		}
		emit(rawChunk);
		if (fenceSplit) {
			if (absoluteBreakIdx === findFenceCloseLineStart(source, fenceSplit.fence)) return { start: skipLeadingNewlines(source, fenceSplit.fence.end) };
			return {
				start: absoluteBreakIdx,
				reopenFence: fenceSplit
			};
		}
		return {
			start: skipLeadingNewlines(source, absoluteBreakIdx < source.length && /\s/.test(source.charAt(absoluteBreakIdx)) ? absoluteBreakIdx + 1 : absoluteBreakIdx),
			reopenFence: void 0
		};
	}
	#pickSoftBreakIndex(buffer, fenceSpans, minCharsOverride, offset = 0) {
		const minChars = Math.max(1, Math.floor(minCharsOverride ?? this.#chunking.minChars));
		if (buffer.length < minChars) return { index: -1 };
		const preference = this.#chunking.breakPreference ?? "paragraph";
		if (preference === "paragraph") {
			const paragraphIdx = findSafeParagraphBreakIndex({
				text: buffer,
				fenceSpans,
				minChars,
				reverse: false,
				offset
			});
			if (paragraphIdx !== -1) return { index: paragraphIdx };
		}
		if (preference === "paragraph" || preference === "newline") {
			const newlineIdx = findSafeNewlineBreakIndex({
				text: buffer,
				fenceSpans,
				minChars,
				reverse: false,
				offset
			});
			if (newlineIdx !== -1) return { index: newlineIdx };
		}
		if (preference !== "newline") {
			const sentenceIdx = findSafeSentenceBreakIndex(buffer, fenceSpans, minChars, offset);
			if (sentenceIdx !== -1) return { index: sentenceIdx };
		}
		return { index: -1 };
	}
	#pickBreakIndex(buffer, fenceSpans, minCharsOverride, offset = 0, maxCharsOverride) {
		const minChars = Math.max(1, Math.floor(minCharsOverride ?? this.#chunking.minChars));
		const maxChars = Math.max(1, Math.floor(maxCharsOverride ?? this.#chunking.maxChars));
		if (buffer.length < minChars) return { index: -1 };
		const window = buffer.slice(0, Math.min(maxChars, buffer.length));
		const preference = this.#chunking.breakPreference ?? "paragraph";
		if (preference === "paragraph") {
			const paragraphIdx = findSafeParagraphBreakIndex({
				text: window,
				fenceSpans,
				minChars,
				reverse: true,
				offset
			});
			if (paragraphIdx !== -1) return { index: paragraphIdx };
		}
		if (preference === "paragraph" || preference === "newline") {
			const newlineIdx = findSafeNewlineBreakIndex({
				text: window,
				fenceSpans,
				minChars,
				reverse: true,
				offset
			});
			if (newlineIdx !== -1) return { index: newlineIdx };
		}
		if (preference !== "newline") {
			const sentenceIdx = findSafeSentenceBreakIndex(window, fenceSpans, minChars, offset);
			if (sentenceIdx !== -1) return { index: sentenceIdx };
		}
		if (preference === "newline" && buffer.length < maxChars) return { index: -1 };
		for (let i = window.length - 1; i >= minChars; i--) if (/\s/.test(window.charAt(i)) && isSafeFenceBreak(fenceSpans, offset + i)) return { index: i };
		if (buffer.length >= maxChars) {
			const firstCodePointWidth = (buffer.codePointAt(0) ?? 0) > 65535 ? 2 : 1;
			const forcedBreakIndex = sliceUtf16Safe(buffer, 0, Math.max(maxChars, firstCodePointWidth)).length;
			if (isSafeFenceBreak(fenceSpans, offset + forcedBreakIndex)) return { index: forcedBreakIndex };
			const fence = findFenceSpanAt(fenceSpans, offset + forcedBreakIndex);
			if (fence) {
				const reopenFenceLine = resolveFenceReopenLine(fence, this.#chunking.maxChars);
				if (!reopenFenceLine) return { index: forcedBreakIndex };
				const closeFenceLine = `${fence.indent}${fence.marker}`;
				const fenceBreakIndex = sliceUtf16Safe(buffer, 0, Math.max(1, maxChars - closeFenceLine.length - 1)).length;
				if (fenceBreakIndex <= 0) return { index: forcedBreakIndex };
				const closeFenceStart = findFenceCloseLineStart(buffer, fence, offset);
				return {
					index: closeFenceStart >= minChars && closeFenceStart <= fenceBreakIndex ? closeFenceStart : fenceBreakIndex,
					fenceSplit: {
						closeFenceLine,
						reopenFenceLine,
						fence
					}
				};
			}
			return { index: forcedBreakIndex };
		}
		return { index: -1 };
	}
};
function skipLeadingNewlines(value, start = 0) {
	let i = start;
	while (i < value.length && value[i] === "\n") i++;
	return i;
}
function stripLeadingNewlines(value) {
	const start = skipLeadingNewlines(value);
	return start > 0 ? value.slice(start) : value;
}
function findNextParagraphBreak(buffer, fenceSpans, startIndex = 0, minCharsFromStart = 1) {
	if (startIndex < 0) return null;
	const re = /\n[\t ]*\n+/g;
	re.lastIndex = startIndex;
	let match;
	while ((match = re.exec(buffer)) !== null) {
		const index = match.index ?? -1;
		if (index < 0) continue;
		if (index - startIndex < minCharsFromStart) continue;
		if (!isSafeFenceBreak(fenceSpans, index)) continue;
		return {
			index,
			length: match[0].length
		};
	}
	return null;
}
//#endregion
export { EmbeddedBlockChunker as t };
