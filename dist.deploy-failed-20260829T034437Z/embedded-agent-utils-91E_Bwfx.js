import { a as parseAssistantTextSignature, i as normalizeAssistantPhase } from "./chat-message-content-BibNiFIq.js";
import { n as extractTextFromChatContent } from "./chat-content-BbLAEXko.js";
import { n as sanitizeAssistantVisibleText, t as sanitizeAssistantFinalAnswerText } from "./assistant-visible-text-BMBDlrGB.js";
import { r as sanitizeUserFacingText, t as renderUserFacingText } from "./user-facing-text-BcBNmELa.js";
import { stripCompactionReplayCheckpointInPlace } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-utils.ts
/** Narrow an agent message to an assistant message. */
function isAssistantMessage(msg) {
	return msg?.role === "assistant";
}
function sanitizeAssistantText(text, phase) {
	return phase === "final_answer" ? sanitizeAssistantFinalAnswerText(text) : sanitizeAssistantVisibleText(text);
}
function isAssistantTextContentBlockType(value) {
	return value === "text" || value === "input_text" || value === "output_text";
}
function sanitizeAssistantVisibleStreamText(text) {
	return sanitizeUserFacingText(sanitizeAssistantText(text), { errorContext: false });
}
function finalizeAssistantExtraction(msg, extracted) {
	return msg.stopReason === "error" ? renderUserFacingText(extracted, { errorContext: true }) : sanitizeUserFacingText(extracted);
}
function extractEmbeddedAssistantTextForPhase(msg, phase, options) {
	const messagePhase = normalizeAssistantPhase(msg.phase);
	const shouldIncludeContent = (resolvedPhase) => {
		if (phase) return resolvedPhase === phase;
		return resolvedPhase === void 0;
	};
	if (typeof msg.content === "string") {
		const hadRequestedPhase = phase ? messagePhase === phase : messagePhase === void 0;
		return {
			text: shouldIncludeContent(messagePhase) ? finalizeAssistantExtraction(msg, sanitizeAssistantText(msg.content, messagePhase)) : "",
			hadRequestedPhase
		};
	}
	if (!Array.isArray(msg.content)) return {
		text: "",
		hadRequestedPhase: false
	};
	const hasExplicitPhasedTextBlocks = msg.content.some((block) => {
		if (!block || typeof block !== "object") return false;
		const record = block;
		if (!isAssistantTextContentBlockType(record.type)) return false;
		return Boolean(parseAssistantTextSignature(record)?.phase);
	});
	let hadRequestedPhase = false;
	return {
		text: finalizeAssistantExtraction(msg, msg.content.map((block) => {
			if (!block || typeof block !== "object") return null;
			const record = block;
			if (!isAssistantTextContentBlockType(record.type) || typeof record.text !== "string") return null;
			const signature = parseAssistantTextSignature(record);
			const resolvedPhase = signature?.phase ?? (hasExplicitPhasedTextBlocks ? void 0 : messagePhase);
			if (!shouldIncludeContent(resolvedPhase)) return null;
			hadRequestedPhase = true;
			const sanitizerPhase = resolvedPhase ?? (options?.unphasedSignedFinalAnswer === true && signature?.id ? "final_answer" : void 0);
			const text = sanitizeAssistantText(record.text, sanitizerPhase);
			return text.trim() ? text : null;
		}).filter((value) => typeof value === "string").join("\n").trim()),
		hadRequestedPhase
	};
}
/** Extract text intended for users, preferring explicit final-answer phase blocks. */
function extractAssistantVisibleText(msg) {
	const finalAnswerExtraction = extractEmbeddedAssistantTextForPhase(msg, "final_answer");
	if (finalAnswerExtraction.hadRequestedPhase) return finalAnswerExtraction.text.trim() ? finalAnswerExtraction.text : "";
	return extractEmbeddedAssistantTextForPhase(msg, void 0, { unphasedSignedFinalAnswer: true }).text;
}
/** Extract the commentary/narration text of a commentary-phase assistant message. */
function extractAssistantCommentaryText(msg) {
	return extractEmbeddedAssistantTextForPhase(msg, "commentary").text;
}
/** Extract sanitized assistant text across all text content blocks. */
function extractEmbeddedAssistantText(msg) {
	return finalizeAssistantExtraction(msg, extractTextFromChatContent(msg.content, {
		sanitizeText: (text) => sanitizeAssistantText(text),
		joinWith: "\n",
		normalizeText: (text) => text.trim()
	}) ?? "");
}
/** Extract native thinking block text; signature-only blocks (no summary) surface nothing. */
function extractAssistantThinking(msg) {
	if (!Array.isArray(msg.content)) return "";
	return msg.content.map((block) => {
		if (!block || typeof block !== "object") return "";
		const type = Reflect.get(block, "type");
		const rawThinking = Reflect.get(block, "thinking");
		if (type === "thinking" && typeof rawThinking === "string") {
			const thinking = rawThinking.trim();
			if (thinking) return thinking;
			const thinkingSignature = Reflect.get(block, "thinkingSignature");
			if (typeof thinkingSignature === "string" && thinkingSignature.trim()) return "";
		}
		return "";
	}).filter(Boolean).join("\n").trim();
}
/** Format reasoning text for markdown-friendly channel surfaces. */
function formatReasoningMessage(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return `Thinking\n\n${trimmed.split("\n").map((line) => line ? `_${line}_` : line).join("\n")}`;
}
const THINKING_TAG_NAME_PATTERN = String.raw`(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)`;
const THINKING_TAG_OPEN_RE = new RegExp(String.raw`<\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "i");
const THINKING_TAG_CLOSE_RE = new RegExp(String.raw`<\s*\/\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "i");
/** Global regex used to scan provider-emitted thinking tags. */
const THINKING_TAG_SCAN_RE = new RegExp(String.raw`<\s*(\/?)\s*${THINKING_TAG_NAME_PATTERN}\s*>`, "gi");
const THINKING_TAG_EXACT_RE = new RegExp(String.raw`^<\s*(\/?)\s*${THINKING_TAG_NAME_PATTERN}\s*>$`, "i");
function createThinkingTagStreamState() {
	return {
		scannedOffset: 0,
		inThinking: false,
		extracted: "",
		lastMatchEnd: 0
	};
}
/** Split text that starts with thinking tags into structured thinking/text blocks. */
function splitThinkingTaggedText(text) {
	const trimmedStart = text.trimStart();
	if (!trimmedStart.startsWith("<")) return null;
	if (!THINKING_TAG_OPEN_RE.test(trimmedStart)) return null;
	if (!THINKING_TAG_CLOSE_RE.test(text)) return null;
	let inThinking = false;
	let cursor = 0;
	let thinkingStart = 0;
	const blocks = [];
	const pushText = (value) => {
		if (!value) return;
		blocks.push({
			type: "text",
			text: value
		});
	};
	const pushThinking = (value) => {
		const cleaned = value.trim();
		if (!cleaned) return;
		blocks.push({
			type: "thinking",
			thinking: cleaned
		});
	};
	for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
		const index = match.index ?? 0;
		const isClose = match[1]?.includes("/") ?? false;
		if (!inThinking && !isClose) {
			pushText(text.slice(cursor, index));
			thinkingStart = index + match[0].length;
			inThinking = true;
			continue;
		}
		if (inThinking && isClose) {
			pushThinking(text.slice(thinkingStart, index));
			cursor = index + match[0].length;
			inThinking = false;
		}
	}
	if (inThinking) return null;
	pushText(text.slice(cursor));
	if (!blocks.some((b) => b.type === "thinking")) return null;
	return blocks;
}
/** Promote inline thinking-tag text blocks into native thinking blocks in place. */
function promoteThinkingTagsToBlocks(message) {
	if (!Array.isArray(message.content)) return;
	if (message.content.some((block) => block && typeof block === "object" && block.type === "thinking")) return;
	const next = [];
	let changed = false;
	for (const block of message.content) {
		if (!block || typeof block !== "object" || !("type" in block)) {
			next.push(block);
			continue;
		}
		if (block.type !== "text") {
			next.push(block);
			continue;
		}
		const split = splitThinkingTaggedText(block.text);
		if (!split) {
			next.push(block);
			continue;
		}
		changed = true;
		for (const part of split) if (part.type === "thinking") next.push({
			type: "thinking",
			thinking: part.thinking
		});
		else if (part.type === "text") {
			const cleaned = part.text.trimStart();
			if (cleaned) next.push({
				type: "text",
				text: cleaned
			});
		}
	}
	if (!changed) return;
	message.content = next;
	stripCompactionReplayCheckpointInPlace(message);
}
/** Extract closed thinking-tag content from a complete text payload. */
function extractThinkingFromTaggedText(text) {
	if (!text) return "";
	let result = "";
	let lastIndex = 0;
	let inThinking = false;
	for (const match of text.matchAll(THINKING_TAG_SCAN_RE)) {
		const idx = match.index ?? 0;
		if (inThinking) result += text.slice(lastIndex, idx);
		inThinking = !(match[1] === "/");
		lastIndex = idx + match[0].length;
	}
	return result.trim();
}
/** Incrementally extract thinking-tag content from a growing streaming payload. */
function extractThinkingFromTaggedStream(text, state) {
	for (let index = state.scannedOffset; index < text.length; index += 1) {
		const char = text[index];
		if (char === "<") {
			state.pendingTagStart = index;
			continue;
		}
		if (char !== ">" || state.pendingTagStart === void 0) continue;
		const start = state.pendingTagStart;
		state.pendingTagStart = void 0;
		const match = THINKING_TAG_EXACT_RE.exec(text.slice(start, index + 1));
		if (!match) continue;
		if (state.inThinking) state.extracted += text.slice(state.lastMatchEnd, start);
		const isClose = match[1] === "/";
		state.inThinking = !isClose;
		state.lastMatchEnd = index + 1;
		state.lastTag = {
			type: isClose ? "close" : "open",
			end: index + 1
		};
	}
	state.scannedOffset = text.length;
	const closed = state.extracted.trim();
	if (closed || state.lastTag?.type !== "open") return closed;
	return text.slice(state.lastTag.end).trim();
}
//#endregion
export { extractAssistantVisibleText as a, extractThinkingFromTaggedText as c, promoteThinkingTagsToBlocks as d, sanitizeAssistantVisibleStreamText as f, extractAssistantThinking as i, formatReasoningMessage as l, createThinkingTagStreamState as n, extractEmbeddedAssistantText as o, extractAssistantCommentaryText as r, extractThinkingFromTaggedStream as s, THINKING_TAG_SCAN_RE as t, isAssistantMessage as u };
