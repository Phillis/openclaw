import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as HEARTBEAT_TOKEN } from "./tokens-CMI0yx54.js";
//#region src/auto-reply/heartbeat.ts
/** Heartbeat prompt defaults, token stripping, task parsing, and due-time helpers. */
const HEARTBEAT_CRON_TASK_GUIDANCE = "Recurring tasks are automations; create or change their schedules with the automations tool, not heartbeat scratch.";
const HEARTBEAT_CONTEXT_PROMPT = `Follow the heartbeat monitor scratch context when provided. ${HEARTBEAT_CRON_TASK_GUIDANCE} Do not infer or repeat old tasks from prior chats.`;
/** Default prompt for heartbeat turns when config does not override it. */
const HEARTBEAT_PROMPT = `${HEARTBEAT_CONTEXT_PROMPT} If nothing needs attention, reply HEARTBEAT_OK.`;
const HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS = "Use heartbeat_respond to report the wake outcome. Set notify=false when nothing needs the user's attention. Set notify=true with notificationText only when the user should be interrupted.";
const HEARTBEAT_RESPONSE_TOOL_PROMPT = `${HEARTBEAT_CONTEXT_PROMPT} ${HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS}`;
const HEARTBEAT_TRANSCRIPT_PROMPT = "[OpenClaw heartbeat poll]";
const DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
function stripLeadingHtmlCommentScaffolding(line, state) {
	let remaining = line;
	while (state.inHtmlComment || remaining.trimStart().startsWith("<!--")) {
		const searchText = state.inHtmlComment ? remaining : remaining.trimStart();
		const commentEnd = searchText.indexOf("-->");
		if (commentEnd === -1) {
			state.inHtmlComment = true;
			return "";
		}
		state.inHtmlComment = false;
		if (searchText === remaining) remaining = remaining.slice(commentEnd + 3);
		else {
			const leadingWidth = remaining.length - searchText.length;
			remaining = remaining.slice(0, leadingWidth) + searchText.slice(commentEnd + 3);
		}
	}
	return remaining;
}
function stripHeartbeatHtmlComments(content) {
	const state = { inHtmlComment: false };
	return content.split("\n").map((line) => stripLeadingHtmlCommentScaffolding(line, state));
}
/**
* Check if heartbeat scratch is "effectively empty" - meaning it has no actionable tasks.
* This allows skipping heartbeat API calls when no tasks are configured.
*
* A file is considered effectively empty if it contains only:
* - Whitespace / empty lines
* - Markdown/HTML comments
* - Markdown ATX headers (`#`, `##`, ...)
* - One-line HTML comments (`<!-- ... -->`)
* - Markdown fence markers such as ``` or ```markdown
* - Empty list item stubs (`- `, `- [ ]`, `* `, `+ `)
*
* Note: Missing scratch returns false (not effectively empty) so the model can
* still decide what to do. This function applies only when a scratch row exists.
*/
function isHeartbeatContentEffectivelyEmpty(content) {
	if (content === void 0 || content === null) return false;
	if (typeof content !== "string") return false;
	const lines = stripHeartbeatHtmlComments(content);
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (/^<!--.*-->$/.test(trimmed)) continue;
		if (/^#+(\s|$)/.test(trimmed)) continue;
		if (/^<!--.*-->$/.test(trimmed)) continue;
		if (/^[-*+]\s*(\[[\sXx]?\]\s*)?$/.test(trimmed)) continue;
		if (/^```[A-Za-z0-9_-]*$/.test(trimmed) || /^<!--.*-->$/.test(trimmed)) continue;
		return false;
	}
	return true;
}
/** Resolves configured heartbeat prompt text with the built-in default fallback. */
function resolveHeartbeatPromptCore(raw) {
	return (normalizeOptionalString(raw) ?? "") || HEARTBEAT_PROMPT;
}
function appendHeartbeatResponseToolInstructions(prompt) {
	const trimmed = normalizeOptionalString(prompt) ?? "";
	if (!trimmed) return HEARTBEAT_RESPONSE_TOOL_PROMPT;
	if (trimmed.includes("Use heartbeat_respond to report the wake outcome. Set notify=false when nothing needs the user's attention. Set notify=true with notificationText only when the user should be interrupted.")) return trimmed;
	return `${trimmed}\n\n${HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS}`;
}
/** Resolves heartbeat prompt text and guarantees heartbeat_respond tool instructions are present. */
function resolveHeartbeatPromptForResponseTool(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	return trimmed ? appendHeartbeatResponseToolInstructions(trimmed) : HEARTBEAT_RESPONSE_TOOL_PROMPT;
}
function stripTokenAtEdges(raw) {
	let text = raw.trim();
	if (!text) return {
		text: "",
		didStrip: false
	};
	const token = HEARTBEAT_TOKEN;
	const tokenAtEndWithOptionalTrailingPunctuation = new RegExp(`${escapeRegExp(token)}[^\\w]{0,4}$`);
	if (!text.includes(token)) return {
		text,
		didStrip: false
	};
	let didStrip = false;
	let changed = true;
	while (changed) {
		changed = false;
		const next = text.trim();
		if (next.startsWith(token)) {
			text = next.slice(token.length).trimStart();
			didStrip = true;
			changed = true;
			continue;
		}
		if (tokenAtEndWithOptionalTrailingPunctuation.test(next)) {
			const idx = next.lastIndexOf(token);
			const before = next.slice(0, idx).trimEnd();
			if (!before) text = "";
			else text = `${before}${next.slice(idx + token.length).trimStart()}`.trimEnd();
			didStrip = true;
			changed = true;
		}
	}
	return {
		text: text.replace(/\s+/g, " ").trim(),
		didStrip
	};
}
/** Strips HEARTBEAT_OK acknowledgements and decides whether visible notification is needed. */
function stripHeartbeatToken(raw, opts = {}) {
	if (!raw) return {
		shouldSkip: true,
		text: "",
		didStrip: false
	};
	const trimmed = raw.trim();
	if (!trimmed) return {
		shouldSkip: true,
		text: "",
		didStrip: false
	};
	const mode = opts.mode ?? "message";
	const maxAckCharsRaw = opts.maxAckChars;
	const parsedAckChars = typeof maxAckCharsRaw === "string" ? Number(maxAckCharsRaw) : maxAckCharsRaw;
	const maxAckChars = Math.max(0, typeof parsedAckChars === "number" && Number.isFinite(parsedAckChars) ? parsedAckChars : 300);
	const stripMarkup = (text) => text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/^[*`~_]+/, "").replace(/[*`~_]+$/, "");
	const trimmedNormalized = stripMarkup(trimmed);
	if (!(trimmed.includes("HEARTBEAT_OK") || trimmedNormalized.includes("HEARTBEAT_OK"))) return {
		shouldSkip: false,
		text: trimmed,
		didStrip: false
	};
	const strippedOriginal = stripTokenAtEdges(trimmed);
	const strippedNormalized = stripTokenAtEdges(trimmedNormalized);
	const picked = strippedOriginal.didStrip && strippedOriginal.text ? strippedOriginal : strippedNormalized;
	if (!picked.didStrip) return {
		shouldSkip: false,
		text: trimmed,
		didStrip: false
	};
	if (!picked.text) return {
		shouldSkip: true,
		text: "",
		didStrip: true
	};
	const rest = picked.text.trim();
	if (mode === "heartbeat") {
		if (rest.length <= maxAckChars) return {
			shouldSkip: true,
			text: "",
			didStrip: true
		};
	}
	return {
		shouldSkip: false,
		text: rest,
		didStrip: true
	};
}
//#endregion
export { HEARTBEAT_RESPONSE_TOOL_PROMPT as a, resolveHeartbeatPromptCore as c, HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS as i, resolveHeartbeatPromptForResponseTool as l, HEARTBEAT_CRON_TASK_GUIDANCE as n, HEARTBEAT_TRANSCRIPT_PROMPT as o, HEARTBEAT_PROMPT as r, isHeartbeatContentEffectivelyEmpty as s, DEFAULT_HEARTBEAT_ACK_MAX_CHARS as t, stripHeartbeatToken as u };
