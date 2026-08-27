//#region src/plugin-sdk/widget-html.ts
const COMPLETE_HTML_DOCUMENT_PATTERN = /^(?:<!doctype\s+html\b|<html\b)/i;
/** Input error surfaced by tools that accept agent-supplied widget HTML. */
var WidgetHtmlInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
/** Returns true when HTML already contains its own document shell. */
function isCompleteHtmlDocument(html) {
	return COMPLETE_HTML_DOCUMENT_PATTERN.test(html.trimStart());
}
/** Enforces a widget HTML size limit while preserving the caller's input label and unit. */
function assertWidgetHtmlSize(html, maxSize, options = {}) {
	const inputName = options.inputName ?? "html";
	const unit = options.unit ?? "bytes";
	if ((unit === "bytes" ? new TextEncoder().encode(html).byteLength : html.length) > maxSize) throw new WidgetHtmlInputError(`${inputName} exceeds maximum size (${maxSize} ${unit})`);
}
//#endregion
export { assertWidgetHtmlSize as n, isCompleteHtmlDocument as r, WidgetHtmlInputError as t };
