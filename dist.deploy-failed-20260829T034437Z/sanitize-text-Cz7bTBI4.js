import { t as findCodeRegions } from "./code-regions-C2SF8Hgg.js";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-CfV8Yu3p.js";
//#region src/infra/outbound/sanitize-text.ts
const HTML_TAG_RE = /<\/?[a-z][a-z0-9_.:-]*(?=[\s/>])[^>]*>/gi;
const MAY_CONTAIN_MARKDOWN_CODE_RE = /[`~]|\t| {4}/;
const CODE_ESCAPE = "\0e";
const CODE_PLACEHOLDER = "\0p";
const CONVERTIBLE_HTML_OPEN_TAG_RE = /<(b|strong|i|em|s|strike|del|code|h[1-6]|li)(?=\s|>)(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
function stripRemainingHtmlTags(text) {
	let previous;
	let current = text;
	do {
		previous = current;
		current = current.replace(HTML_TAG_RE, "");
	} while (current !== previous);
	return current;
}
function convertHtmlOutsideCode(text, options) {
	const boldMarker = options.style === "markdown" ? "**" : "*";
	const strikeMarker = options.style === "markdown" ? "~~" : "~";
	return stripRemainingHtmlTags(text.replace(/<((?:https?:\/\/|mailto:)[^<>\s]+)>/gi, "$1").replace(CONVERTIBLE_HTML_OPEN_TAG_RE, "<$1>").replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(p|div)>/gi, "\n").replace(/<(b|strong)>(.*?)<\/\1>/gi, `${boldMarker}$2${boldMarker}`).replace(/<(i|em)>(.*?)<\/\1>/gi, "_$2_").replace(/<(s|strike|del)>(.*?)<\/\1>/gi, `${strikeMarker}$2${strikeMarker}`).replace(/<code>(.*?)<\/code>/gi, "`$1`").replace(/<h[1-6]>(.*?)<\/h[1-6]>/gi, `\n${boldMarker}$1${boldMarker}\n`).replace(/<li>(.*?)<\/li>/gi, "• $1\n")).replace(/\n{3,}/g, "\n\n");
}
/**
* Convert common HTML tags to their plain-text/lightweight-markup equivalents
* and strip anything that remains.
*
* The function is intentionally conservative — it only targets tags that models
* are known to produce and avoids false positives on angle brackets in normal
* prose (e.g. `a < b`), in fenced blocks, and in inline code spans.
*/
function sanitizeForPlainText(text, options = {}) {
	const prepared = flattenMarkdownDetails(stripInternalRuntimeScaffolding(text));
	const codeRegions = (prepared.includes("<") || prepared.includes("\n\n\n")) && MAY_CONTAIN_MARKDOWN_CODE_RE.test(prepared) ? findCodeRegions(prepared) : [];
	if (codeRegions.length === 0) return convertHtmlOutsideCode(prepared, options);
	const preservedCode = [];
	let masked = "";
	let cursor = 0;
	for (const region of codeRegions) {
		masked += prepared.slice(cursor, region.start).replaceAll("\0", CODE_ESCAPE);
		masked += CODE_PLACEHOLDER;
		preservedCode.push(prepared.slice(region.start, region.end));
		cursor = region.end;
	}
	masked += prepared.slice(cursor).replaceAll("\0", CODE_ESCAPE);
	const converted = convertHtmlOutsideCode(masked, options);
	let restored = "";
	cursor = 0;
	for (const code of preservedCode) {
		const placeholder = converted.indexOf(CODE_PLACEHOLDER, cursor);
		restored += converted.slice(cursor, placeholder).replaceAll(CODE_ESCAPE, "\0");
		restored += code;
		cursor = placeholder + 2;
	}
	return restored + converted.slice(cursor).replaceAll(CODE_ESCAPE, "\0");
}
//#endregion
export { sanitizeForPlainText as t };
