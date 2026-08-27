import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as truncateSanitizedExternalContent } from "./external-content-IQUFD6xt.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./text-utility-runtime-LRU688AB.js";
import "./security-runtime-B0k67yNr.js";
import { i as normalizeXaiModelId } from "./model-id-BJsQwvwb.js";
//#region extensions/xai/src/responses-tool-shared.ts
const XAI_CITATION_MAX_COUNT = 20;
const XAI_CITATION_MAX_SCAN = 1e3;
const XAI_CITATION_URL_MAX_CHARS = 2048;
function normalizeXaiCitationUrl(value) {
	if (typeof value !== "string" || value.length > XAI_CITATION_URL_MAX_CHARS) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:" || url.href.length > XAI_CITATION_URL_MAX_CHARS) return;
		return url.href === `${value}/` ? value : url.href;
	} catch {
		return;
	}
}
function collectUrlCitations(annotations, citations) {
	if (!Array.isArray(annotations)) return;
	let scanned = 0;
	for (const annotation of annotations) {
		if (++scanned > XAI_CITATION_MAX_SCAN || citations.size >= XAI_CITATION_MAX_COUNT) break;
		if (!isRecord(annotation) || annotation.type !== "url_citation") continue;
		const url = normalizeXaiCitationUrl(annotation.url);
		if (url) citations.add(url);
	}
}
const XAI_RESPONSES_BASE_URL = "https://api.x.ai/v1";
const XAI_RESPONSES_ENDPOINT = `${XAI_RESPONSES_BASE_URL}/responses`;
function resolveXaiResponsesEndpoint(baseUrl) {
	return `${(normalizeOptionalString(baseUrl) ?? XAI_RESPONSES_BASE_URL).replace(/\/+$/, "")}/responses`;
}
function buildXaiResponsesToolBody(params) {
	return {
		model: params.model,
		input: [{
			role: "user",
			content: params.inputText
		}],
		tools: params.tools,
		store: false,
		...params.reasoningEffort ? { reasoning: { effort: params.reasoningEffort } } : {},
		...params.maxTurns ? { max_turns: params.maxTurns } : {}
	};
}
function extractXaiWebSearchContent(data, maxContentChars) {
	const textParts = [];
	const annotationCitations = /* @__PURE__ */ new Set();
	const pendingAnnotations = [];
	let remainingRawChars = maxContentChars;
	let completeRawPrefix = true;
	let truncated = false;
	let rawOffset = 0;
	for (const output of data.output ?? []) {
		if (!isRecord(output)) continue;
		const blocks = output.type === "message" && Array.isArray(output.content) ? output.content : output.type === "output_text" ? [output] : [];
		for (const block of blocks) {
			if (!isRecord(block) || block.type !== "output_text" || typeof block.text !== "string") continue;
			if (block.text) {
				const blockRawOffset = rawOffset;
				rawOffset += block.text.length;
				const text = remainingRawChars === void 0 ? block.text : completeRawPrefix ? truncateUtf16Safe(block.text, remainingRawChars) : "";
				if (text.length < block.text.length) {
					truncated = true;
					completeRawPrefix = false;
				}
				if (text) {
					textParts.push(text);
					if (remainingRawChars !== void 0) remainingRawChars -= text.length;
					if (Array.isArray(block.annotations)) pendingAnnotations.push({
						rawOffset: blockRawOffset,
						annotations: block.annotations
					});
				}
			}
		}
	}
	const rawText = textParts.join("") || (typeof data.output_text === "string" ? data.output_text : "");
	let text = rawText;
	let retainedRawChars = rawText.length;
	if (maxContentChars !== void 0) {
		const bounded = truncateSanitizedExternalContent(rawText, maxContentChars);
		text = bounded.text;
		truncated ||= bounded.truncated;
		retainedRawChars = bounded.retainedRawChars;
	}
	for (const annotation of pendingAnnotations) if (annotation.rawOffset < retainedRawChars) collectUrlCitations(annotation.annotations, annotationCitations);
	const inlineCitationOffsetsSafe = text === rawText.slice(0, retainedRawChars);
	return {
		text: text || void 0,
		annotationCitations: [...annotationCitations],
		...truncated ? { truncated: true } : {},
		...maxContentChars === void 0 ? {} : { retainedRawChars },
		...inlineCitationOffsetsSafe ? {} : { inlineCitationOffsetsSafe: false }
	};
}
function requireXaiResponseTextAndCitations(data, label, maxContentChars) {
	const { text, annotationCitations, truncated, retainedRawChars, inlineCitationOffsetsSafe } = extractXaiWebSearchContent(data, maxContentChars);
	if (!text) throw new Error(`${label}: malformed JSON response`);
	const explicitCitations = /* @__PURE__ */ new Set();
	if (Array.isArray(data.citations)) {
		let scanned = 0;
		for (const citation of data.citations) {
			if (++scanned > XAI_CITATION_MAX_SCAN || explicitCitations.size >= XAI_CITATION_MAX_COUNT) break;
			const url = normalizeXaiCitationUrl(citation);
			if (url) explicitCitations.add(url);
		}
	}
	return {
		content: text,
		citations: explicitCitations.size > 0 ? [...explicitCitations] : annotationCitations,
		...truncated ? { truncated: true } : {},
		...retainedRawChars === void 0 ? {} : { retainedRawChars },
		...inlineCitationOffsetsSafe === false ? { inlineCitationOffsetsSafe: false } : {}
	};
}
function requireXaiResponseTextCitationsAndInline(data, label, inlineCitationsEnabled, maxContentChars) {
	const { content, citations, truncated, retainedRawChars, inlineCitationOffsetsSafe } = requireXaiResponseTextAndCitations(data, label, maxContentChars);
	return {
		content,
		citations,
		inlineCitations: inlineCitationsEnabled && Array.isArray(data.inline_citations) ? data.inline_citations.slice(0, XAI_CITATION_MAX_COUNT).flatMap((citation) => {
			if (!isRecord(citation)) return [];
			const url = normalizeXaiCitationUrl(citation.url);
			return inlineCitationOffsetsSafe !== false && url && Number.isSafeInteger(citation.start_index) && Number.isSafeInteger(citation.end_index) && citation.start_index >= 0 && citation.end_index >= citation.start_index && citation.end_index <= (retainedRawChars ?? content.length) ? [{
				start_index: citation.start_index,
				end_index: citation.end_index,
				url
			}] : [];
		}) : void 0,
		...truncated ? { truncated: true } : {}
	};
}
//#endregion
//#region extensions/xai/src/tool-config-shared.ts
function coerceXaiToolConfig(config) {
	return isRecord(config) ? config : {};
}
function resolveNormalizedXaiToolModel(params) {
	const value = coerceXaiToolConfig(params.config).model;
	return typeof value === "string" && value.trim() ? normalizeXaiModelId(value.trim()) : params.defaultModel;
}
function resolvePositiveIntegerToolConfig(config, key) {
	const raw = coerceXaiToolConfig(config)[key];
	if (typeof raw !== "number" || !Number.isFinite(raw)) return;
	const normalized = Math.trunc(raw);
	return normalized > 0 ? normalized : void 0;
}
//#endregion
export { buildXaiResponsesToolBody as a, requireXaiResponseTextCitationsAndInline as c, XAI_RESPONSES_ENDPOINT as i, resolveXaiResponsesEndpoint as l, resolveNormalizedXaiToolModel as n, extractXaiWebSearchContent as o, resolvePositiveIntegerToolConfig as r, requireXaiResponseTextAndCitations as s, coerceXaiToolConfig as t };
