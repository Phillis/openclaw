import { r as stripAnsi } from "./ansi-DjDeieuH.js";
//#region packages/terminal-core/src/safe-text.ts
/** Return whether text contains C0 or C1 terminal control characters. */
function hasTerminalControl(input) {
	for (const char of input) {
		const codePoint = char.codePointAt(0);
		if (codePoint !== void 0 && (codePoint <= 31 || codePoint >= 127 && codePoint <= 159)) return true;
	}
	return false;
}
/**
* Normalize untrusted text for single-line terminal/log rendering.
*/
function sanitizeTerminalText(input) {
	const normalized = stripAnsi(input).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
	let sanitized = "";
	for (const char of normalized) if (!hasTerminalControl(char)) sanitized += char;
	return sanitized;
}
//#endregion
export { sanitizeTerminalText as n, hasTerminalControl as t };
