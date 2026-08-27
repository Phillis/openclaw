import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { ft as stripInboundMetadata } from "./openclaw-state-db-kmBThqu6.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { n as isInsideCode, t as findCodeRegions } from "./code-regions-C2SF8Hgg.js";
import { s as stripPlainTextToolCallBlocks } from "./src-CXf6rX-C.js";
import "./history-DLKGD0Dj.js";
import { t as coerceChatContentText } from "./chat-content-BbLAEXko.js";
import { c as stripLegacyBracketToolCallBlocks, l as stripMinimaxToolCallXml, m as stripFinalTags, o as stripAssistantInternalTraceLines, u as stripToolCallXmlTags } from "./assistant-visible-text-BMBDlrGB.js";
import "./bash-tools.exec-output-D1Z0C3oY.js";
import { x as renderSanitizedUserFacingText } from "./user-copy-LZk56sIA.js";
//#region src/agents/embedded-agent-helpers/sanitize-user-facing-text.ts
/** Strips internal scaffolding from text before user-facing delivery. */
const TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE = /^[ \t]*\[tool calls omitted\][ \t]*$/i;
function stripFinalTagsFromText(text) {
	const normalized = coerceChatContentText(text);
	return normalized ? stripFinalTags(normalized) : normalized;
}
function stripInternalPlaceholderLines(text) {
	if (!text.toLowerCase().includes("[tool calls omitted]") && !text.includes("(no output)")) return text;
	let protectedRegions;
	let result = "";
	let start = 0;
	while (start < text.length) {
		const newlineIndex = text.indexOf("\n", start);
		const end = newlineIndex === -1 ? text.length : newlineIndex + 1;
		const chunk = text.slice(start, end);
		const line = chunk.endsWith("\n") ? chunk.slice(0, -1).replace(/\r$/, "") : chunk;
		if (!(TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE.test(line) || line.trim() === "(no output)") || isInsideCode(start, protectedRegions ??= findCodeRegions(text))) result += chunk;
		start = end;
	}
	return result;
}
function stripVerifiedConversationContext(text, conversationContext, streaming = false) {
	const source = conversationContext?.trim();
	if (!source || !source.includes("[Chat messages since your last reply - for context]") && !source.includes("[Current message - respond to this]")) return text;
	const containsConversationMarker = text.includes("[Chat messages since your last reply - for context]") || text.includes("[Current message - respond to this]");
	if (!streaming && !containsConversationMarker) return text;
	const sourceCodeRegions = findCodeRegions(source);
	if (!["[Chat messages since your last reply - for context]", "[Current message - respond to this]"].some((marker) => {
		let markerOffset = source.indexOf(marker);
		while (markerOffset !== -1) {
			const markerEnd = markerOffset + marker.length;
			const startsLine = markerOffset === 0 || source[markerOffset - 1] === "\n";
			const endsLine = markerEnd === source.length || source[markerEnd] === "\n" || source[markerEnd] === "\r";
			if (startsLine && endsLine && !isInsideCode(markerOffset, sourceCodeRegions)) return true;
			markerOffset = source.indexOf(marker, markerEnd);
		}
		return false;
	})) return text;
	const normalizedSource = source.replace(/\r\n?/gu, "\n");
	const markdownLinePrefix = "[ \\t]*(?:(?:>|[-+*](?=[ \\t])|#{1,6}(?=[ \\t])|\\d{1,9}[.)](?=[ \\t]))[ \\t]*)*";
	let result = text;
	if (containsConversationMarker) {
		const promptPattern = normalizedSource.split("\n").map(escapeRegExp).join(`(?:\\r\\n?|\\n)${markdownLinePrefix}`);
		const copiedPrompt = new RegExp(`(?:^${markdownLinePrefix})?${promptPattern}`, "gmu");
		result = text.replace(copiedPrompt, "");
	}
	if (!streaming) return result;
	const sourceStart = normalizedSource[0];
	if (!sourceStart) return result;
	const firstSourceLine = normalizedSource.split("\n", 1)[0] ?? normalizedSource;
	const completedSourceStart = result.indexOf(firstSourceLine);
	const searchStart = completedSourceStart === -1 ? Math.max(0, result.length - normalizedSource.length * 2) : completedSourceStart;
	const markdownWrapper = new RegExp(`^${markdownLinePrefix}$`, "u");
	const incompleteMarkdownWrapper = new RegExp(`^${markdownLinePrefix}(?:[-+*]|#{1,6}|\\d{1,9}[.)]?)?$`, "u");
	let candidateStart = result.indexOf(sourceStart, searchStart);
	let completedCandidates = 0;
	while (candidateStart !== -1) {
		if (!(result.length - candidateStart >= firstSourceLine.length ? result.startsWith(firstSourceLine, candidateStart) : firstSourceLine.startsWith(result.slice(candidateStart)))) {
			candidateStart = result.indexOf(sourceStart, candidateStart + 1);
			continue;
		}
		if (++completedCandidates > 16) return result.slice(0, searchStart);
		const suffix = result.slice(candidateStart).replace(/\r\n?/gu, "\n");
		const sourceLines = normalizedSource.split("\n");
		let lineIndex = 0;
		const unwrappedSuffix = suffix.replace(/\n([^\n]*)/gu, (_match, line) => {
			const sourceLine = sourceLines[++lineIndex];
			if (sourceLine === void 0) return `\n${line}`;
			if (!sourceLine) return incompleteMarkdownWrapper.test(line) ? "\n" : `\n${line}`;
			const sourceLineStart = sourceLine.charAt(0);
			let contentStart = line.indexOf(sourceLineStart);
			while (contentStart !== -1) {
				const content = line.slice(contentStart);
				if (sourceLine.startsWith(content) && markdownWrapper.test(line.slice(0, contentStart))) return `\n${content}`;
				contentStart = line.indexOf(sourceLineStart, contentStart + 1);
			}
			return incompleteMarkdownWrapper.test(line) ? "\n" : `\n${line}`;
		});
		if (suffix.length < normalizedSource.length && normalizedSource.startsWith(suffix) || unwrappedSuffix.length < normalizedSource.length && normalizedSource.startsWith(unwrappedSuffix)) return result.slice(0, candidateStart);
		candidateStart = result.indexOf(sourceStart, candidateStart + 1);
	}
	return result;
}
function createVerifiedConversationContextStreamFilter(getConversationContext) {
	let accumulatedText = "";
	let releasedText = "";
	return (delta) => {
		accumulatedText += delta;
		const conversationContext = getConversationContext?.();
		const safeText = stripVerifiedConversationContext(accumulatedText, conversationContext, true);
		if (releasedText === null || !safeText.startsWith(releasedText)) {
			releasedText = null;
			return "";
		}
		const newlySafeText = safeText.slice(releasedText.length);
		releasedText = safeText;
		return newlySafeText;
	};
}
function collapseConsecutiveDuplicateBlocks(text) {
	const trimmed = text.trim();
	if (!trimmed) return text;
	const blocks = trimmed.split(/\n{2,}/);
	if (blocks.length < 2) return text;
	const result = [];
	let lastNormalized = null;
	for (const block of blocks) {
		const normalized = block.trim().replace(/\s+/g, " ");
		if (lastNormalized && normalized === lastNormalized) continue;
		result.push(block.trim());
		lastNormalized = normalized;
	}
	return result.length === blocks.length ? text : result.join("\n\n");
}
function sanitizeUserFacingText(text, opts) {
	const raw = coerceChatContentText(text);
	if (!raw) return raw;
	const withoutPlaceholder = stripInternalPlaceholderLines(stripToolCallXmlTags(stripMinimaxToolCallXml(stripInboundMetadata(stripInternalRuntimeContext(stripFinalTagsFromText(stripVerifiedConversationContext(raw, opts?.conversationContext, opts?.streaming))))), { stripFunctionCallsXmlPayloads: true }));
	const withoutToolCallBlocks = stripPlainTextToolCallBlocks(stripLegacyBracketToolCallBlocks(opts?.errorContext ? stripAssistantInternalTraceLines(withoutPlaceholder) : withoutPlaceholder), { resolveProtectedRanges: findCodeRegions });
	if (!withoutToolCallBlocks.trim()) return "";
	return collapseConsecutiveDuplicateBlocks(withoutToolCallBlocks.replace(/^(?:[ \t]*\r?\n)+/, ""));
}
//#endregion
//#region src/agents/embedded-agent-helpers/user-facing-text.ts
/** Compose internal-text stripping with the canonical failover copy renderer. */
function renderUserFacingText(text, opts) {
	return renderSanitizedUserFacingText(sanitizeUserFacingText(text, opts), opts);
}
//#endregion
export { createVerifiedConversationContextStreamFilter as n, sanitizeUserFacingText as r, renderUserFacingText as t };
