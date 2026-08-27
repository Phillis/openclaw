import { dt as stripInboundMetadata } from "./openclaw-state-db-BciZ4rHE.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { s as stripPlainTextToolCallBlocks } from "./src-Rlms7fwG.js";
import { t as coerceChatContentText } from "./chat-content-BbLAEXko.js";
import { t as findCodeRegions } from "./code-regions-Bp-dcTEf.js";
import { c as stripLegacyBracketToolCallBlocks, l as stripMinimaxToolCallXml, m as stripFinalTags, o as stripAssistantInternalTraceLines, u as stripToolCallXmlTags } from "./assistant-visible-text-DkdYrwAv.js";
import { x as renderSanitizedUserFacingText } from "./user-copy-BKvImQfV.js";
//#region src/agents/embedded-agent-helpers/sanitize-user-facing-text.ts
/** Strips internal scaffolding from text before user-facing delivery. */
const TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE = /^[ \t]*\[tool calls omitted\][ \t]*$/i;
function stripFinalTagsFromText(text) {
	const normalized = coerceChatContentText(text);
	return normalized ? stripFinalTags(normalized) : normalized;
}
function stripToolCallsOmittedPlaceholderLines(text) {
	let result = "";
	let start = 0;
	while (start < text.length) {
		const newlineIndex = text.indexOf("\n", start);
		const end = newlineIndex === -1 ? text.length : newlineIndex + 1;
		const chunk = text.slice(start, end);
		const line = chunk.endsWith("\n") ? chunk.slice(0, -1).replace(/\r$/, "") : chunk;
		if (!TOOL_CALLS_OMITTED_PLACEHOLDER_LINE_RE.test(line)) result += chunk;
		start = end;
	}
	return result;
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
	const withoutPlaceholder = stripToolCallsOmittedPlaceholderLines(stripToolCallXmlTags(stripMinimaxToolCallXml(stripInboundMetadata(stripInternalRuntimeContext(stripFinalTagsFromText(raw)))), { stripFunctionCallsXmlPayloads: true }));
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
export { sanitizeUserFacingText as n, renderUserFacingText as t };
