import { f as findAssistantTranscriptRoleHeaderSpans, r as markdownToIR, t as applyConstructFallbacks } from "./construct-fallbacks-69epEQTJ.js";
//#region src/shared/text/strip-markdown.ts
function collectLinkInsertions(ir, options) {
	const insertions = [];
	if ((options.linkStyle ?? "label-and-url") === "label-and-url") for (const link of ir.links) {
		const href = link.href.trim();
		const label = ir.text.slice(link.start, link.end).trim();
		const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
		if (href && label && label !== href && label !== comparableHref) insertions.push({
			position: link.end,
			text: ` (${href})`
		});
	}
	return insertions;
}
function collectAssistantTranscriptRoleInsertions(text, options) {
	if (options.assistantTranscriptRoleHeaders !== true) return [];
	const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
	if (!prefix) return [];
	return findAssistantTranscriptRoleHeaderSpans(text).map((span) => ({
		position: span.start,
		text: prefix
	}));
}
function collectParsedAssistantTranscriptRoleInsertions(ir, options) {
	if (options.assistantTranscriptRoleHeaders !== true) return [];
	const prefix = options.assistantTranscriptRolePrefix ?? "[assistant-authored transcript] ";
	if (!prefix) return [];
	return (ir.annotations ?? []).filter((annotation) => annotation.type === "assistant_transcript_role").map((annotation) => ({
		position: annotation.start,
		text: prefix
	}));
}
function applyPlainTextInsertions(text, insertions) {
	if (insertions.length === 0) return text;
	const sorted = insertions.toSorted((a, b) => a.position - b.position);
	let output = "";
	let cursor = 0;
	for (const insertion of sorted) {
		const position = Math.max(cursor, Math.min(insertion.position, text.length));
		output += text.slice(cursor, position);
		output += insertion.text;
		cursor = position;
	}
	return output + text.slice(cursor);
}
function cleanSpeechText(text) {
	return text.split("\n").map((line) => {
		if (/^[\p{P}\p{S}\s]+$/u.test(line)) return "";
		return line.replace(/^[•◦▪‣⁃]\s+/u, "").replace(/(?:[\p{So}\p{Sk}]\s*){2,}/gu, " ").replace(/\.{4,}/g, "...").replace(/([!?,;:])\1+/g, "$1").replace(/[ \t]{2,}/g, " ").trim();
	}).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
/** Parse Markdown, then protect role headers exposed by the final plain-text projection. */
function stripMarkdown(text, options = {}, profile) {
	const ir = markdownToIR(text, {
		assistantTranscriptRoleHeaders: options.assistantTranscriptRoleHeaders,
		autolink: false,
		blockquotePrefix: "",
		enableHtmlUnderline: profile !== void 0,
		enableTaskLists: profile !== void 0,
		headingStyle: "none",
		horizontalRuleText: "",
		linkify: false,
		preserveSourceBlockSpacing: true,
		tableMode: "bullets"
	});
	const effectiveProfile = profile && options.linkStyle === "label" ? {
		...profile,
		constructs: {
			...profile.constructs,
			linkLabel: "strip"
		}
	} : profile;
	const projectedIr = effectiveProfile ? applyConstructFallbacks(ir, effectiveProfile) : ir;
	const plainText = applyPlainTextInsertions(projectedIr.text, [...collectLinkInsertions(projectedIr, options), ...collectParsedAssistantTranscriptRoleInsertions(projectedIr, options)]).trim();
	const projected = applyPlainTextInsertions(plainText, collectAssistantTranscriptRoleInsertions(plainText, options)).trim();
	return options.mode === "speech" ? cleanSpeechText(projected) : projected;
}
//#endregion
export { stripMarkdown as t };
