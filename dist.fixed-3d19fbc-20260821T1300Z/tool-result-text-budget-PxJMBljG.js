import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as estimateStringChars } from "./cjk-chars-B-gnWt4x.js";
//#region src/agents/embedded-agent-runner/tool-result-text-budget.ts
const ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE = /[\p{ASCII}]+|[^\p{ASCII}]/gu;
/**
* Returns provider-independent character-budget units for tool-result text.
* CJK weights match the shared token heuristic; callers may retain a larger
* existing raw-text safety floor without multiplying the CJK adjustment twice.
*/
function estimateToolResultTextChars(text, options = {}) {
	const minimumRawWeight = Math.max(1, options.minimumRawWeight ?? 1);
	if (minimumRawWeight === 1) return estimateStringChars(text);
	let chars = 0;
	for (const match of text.matchAll(ASCII_RUN_OR_NON_ASCII_CODE_POINT_RE)) {
		const segment = match[0];
		const minimumChars = Math.ceil(segment.length * minimumRawWeight);
		chars += segment.charCodeAt(0) <= 127 ? minimumChars : Math.max(estimateStringChars(segment), minimumChars);
	}
	return chars;
}
function sliceToolResultTextToBudget(text, maxChars, options = {}) {
	const budget = Math.max(0, Math.floor(maxChars));
	if (estimateToolResultTextChars(text, options) <= budget) return text;
	let best = "";
	let low = 0;
	let high = text.length;
	while (low <= high) {
		const midpoint = Math.floor((low + high) / 2);
		const candidate = sliceUtf16Safe(text, 0, midpoint);
		if (estimateToolResultTextChars(candidate, options) <= budget) {
			if (candidate.length > best.length) best = candidate;
			low = midpoint + 1;
		} else high = midpoint - 1;
	}
	return best;
}
function sliceToolResultTextTailToBudget(text, maxChars, options = {}) {
	const budget = Math.max(0, Math.floor(maxChars));
	if (estimateToolResultTextChars(text, options) <= budget) return text;
	let best = "";
	let low = 0;
	let high = text.length;
	while (low <= high) {
		const midpoint = Math.floor((low + high) / 2);
		const candidate = sliceUtf16Safe(text, midpoint);
		if (estimateToolResultTextChars(candidate, options) <= budget) {
			if (candidate.length > best.length) best = candidate;
			high = midpoint - 1;
		} else low = midpoint + 1;
	}
	return best;
}
//#endregion
export { sliceToolResultTextTailToBudget as n, sliceToolResultTextToBudget as r, estimateToolResultTextChars as t };
