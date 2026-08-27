import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as stripInlineDirectiveTagsForDelivery, t as parseInlineDirectives } from "./directive-tags-DqL78ij5.js";
//#region src/tts/directive-facts.ts
function collectMarkdownCodeRanges(text) {
	const ranges = [];
	const addMatches = (regex) => {
		for (const match of text.matchAll(regex)) {
			if (match.index == null) continue;
			ranges.push({
				start: match.index,
				end: match.index + match[0].length
			});
		}
	};
	addMatches(/```[\s\S]*?```/g);
	addMatches(/~~~[\s\S]*?~~~/g);
	addMatches(/^(?: {4}|\t).*(?:\n|$)/gm);
	addMatches(/`+[^`\n]*`+/g);
	return ranges.toSorted((left, right) => left.start - right.start);
}
function isInsideRange(index, ranges) {
	return ranges.some((range) => index >= range.start && index < range.end);
}
function replaceOutsideMarkdownCode(text, regex, replace) {
	const codeRanges = collectMarkdownCodeRanges(text);
	return text.replace(regex, (...args) => {
		const match = String(args[0]);
		const offset = args.at(-2);
		if (typeof offset === "number" && isInsideRange(offset, codeRanges)) return match;
		return replace(match, args.slice(1, -2).map((capture) => String(capture)));
	});
}
/** Extract final-text TTS syntax into persisted facts, leaving markdown code spans unchanged. */
function extractTtsDirectiveFacts(text) {
	if (!/\[\[\s*\/?\s*tts(?:\s*:|\s*\]\])/iu.test(text)) return { cleanedText: text };
	let cleanedText = text;
	let facts;
	const markTagged = () => {
		facts ??= { tagged: true };
		return facts;
	};
	cleanedText = replaceOutsideMarkdownCode(cleanedText, /\[\[\s*tts\s*:\s*text\s*\]\]([\s\S]*?)\[\[\s*\/\s*tts\s*:\s*text\s*\]\]/gi, (_match, [inner = ""]) => {
		const next = markTagged();
		if (next.text == null) next.text = inner.trim();
		return "";
	});
	cleanedText = replaceOutsideMarkdownCode(cleanedText, /\[\[\s*tts\s*\]\]([\s\S]*?)\[\[\s*\/\s*tts\s*\]\]/gi, (_match, [inner = ""]) => {
		const next = markTagged();
		const visible = inner.trim();
		if (next.text == null) next.text = visible;
		return visible;
	});
	cleanedText = replaceOutsideMarkdownCode(cleanedText, /\[\[\s*tts\s*:\s*([^\]]+)\]\]/gi, (_match, [body = ""]) => {
		const next = markTagged();
		const tokens = body.split(/\s+/).filter(Boolean);
		let provider;
		const values = {};
		for (const token of tokens) {
			const eqIndex = token.indexOf("=");
			if (eqIndex === -1) continue;
			const rawKey = token.slice(0, eqIndex).trim();
			const rawValue = token.slice(eqIndex + 1).trim();
			if (!rawKey || !rawValue) continue;
			const key = normalizeLowercaseStringOrEmpty(rawKey);
			if (key === "provider") {
				provider = normalizeLowercaseStringOrEmpty(rawValue) || void 0;
				continue;
			}
			values[key] = rawValue;
		}
		if (provider || Object.keys(values).length > 0) {
			next.directives ??= [];
			next.directives.push({
				...provider ? { provider } : {},
				values
			});
		}
		return "";
	});
	cleanedText = replaceOutsideMarkdownCode(cleanedText, /\[\[\s*tts\s*\]\]/gi, () => {
		markTagged();
		return "";
	});
	cleanedText = replaceOutsideMarkdownCode(cleanedText, /\[\[\s*\/\s*tts(?:\s*:\s*[^\]]*)?\]\]/gi, () => {
		markTagged();
		return "";
	});
	return {
		cleanedText,
		...facts ? { facts } : {}
	};
}
//#endregion
//#region src/config/sessions/transcript-assistant-delivery.ts
function mergeTtsFacts(current, next) {
	return {
		tagged: true,
		...(current?.text ?? next.text) != null ? { text: current?.text ?? next.text } : {},
		...current?.directives || next.directives ? { directives: [...current?.directives ?? [], ...next.directives ?? []] } : {}
	};
}
/** Strips final-answer directives in place so live state and persisted bytes stay identical. */
function applyAssistantDeliveryDirectives(message) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return message;
	let facts;
	for (const block of message.content) {
		if (!isRecord(block) || block.type !== "text" || typeof block.text !== "string") continue;
		const parsed = parseInlineDirectives(block.text);
		const stripped = stripInlineDirectiveTagsForDelivery(parsed.text);
		const tts = extractTtsDirectiveFacts(stripped.text);
		const hasDeliveryFacts = parsed.hasAudioTag || parsed.hasReplyTag || Boolean(tts.facts);
		if (!stripped.changed && !hasDeliveryFacts) continue;
		block.text = tts.facts ? tts.cleanedText.trim() : tts.cleanedText;
		if (!hasDeliveryFacts) continue;
		facts ??= {};
		Object.assign(facts, {
			...parsed.audioAsVoice ? { audioAsVoice: true } : {},
			...parsed.replyToCurrent ? { replyToCurrent: true } : {},
			...parsed.replyToExplicitId ? { replyToId: parsed.replyToExplicitId } : {},
			...tts.facts ? { tts: mergeTtsFacts(facts.tts, tts.facts) } : {}
		});
	}
	if (facts) Object.assign(message, { openclawDelivery: facts });
	return message;
}
//#endregion
export { extractTtsDirectiveFacts as n, applyAssistantDeliveryDirectives as t };
