import { m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { u as readResponseTextPrefix } from "./http-body-DthsuKdw.js";
import "./response-limit-runtime-Dd4g9Wqb.js";
import "./logging-core-BaUBu9tm.js";
import "./text-utility-runtime-BNhX-3os.js";
//#region extensions/ollama/src/request-header-redaction.ts
const AUTHORIZATION_SECRET_HEADERS = /* @__PURE__ */ new Set(["authorization", "proxy-authorization"]);
const REDACTED_SECRET = "***";
function collectSecretRepresentations(values) {
	const representations = /* @__PURE__ */ new Map();
	const add = (candidate, percentEscapesCaseInsensitive = false) => {
		if (!candidate) return;
		representations.set(candidate, representations.get(candidate) === true || percentEscapesCaseInsensitive);
		const jsonEscaped = JSON.stringify(candidate).slice(1, -1);
		if (jsonEscaped !== candidate) representations.set(jsonEscaped, representations.get(jsonEscaped) === true || percentEscapesCaseInsensitive);
	};
	for (const value of values) {
		if (!value) continue;
		add(value);
		try {
			add(encodeURIComponent(value), true);
			add(new URLSearchParams([["value", value]]).toString().slice(6), true);
		} catch {}
	}
	return [...representations];
}
function secretRepresentationPattern([candidate, percentCaseInsensitive]) {
	const source = escapeRegExp(candidate);
	if (!percentCaseInsensitive) return source;
	return source.replace(/%[0-9A-F]{2}/giu, (escape) => escape.replace(/[A-F]/giu, (hex) => `[${hex.toUpperCase()}${hex.toLowerCase()}]`));
}
function normalizePercentEscapeHexCase(value) {
	return value.replace(/%[0-9A-F]{1,2}/giu, (escape) => escape.toUpperCase());
}
function redactExactSecretValues(text, values, sourceTruncated) {
	const representations = collectSecretRepresentations(values).toSorted((left, right) => right[0].length - left[0].length);
	if (representations.length === 0) return text;
	const matcher = new RegExp(representations.map(secretRepresentationPattern).join("|"), "gu");
	const redacted = text.replace(matcher, REDACTED_SECRET);
	if (!sourceTruncated) return redacted;
	let longestPartialSuffix = 0;
	for (const [candidate, percentCaseInsensitive] of representations) {
		const comparableText = percentCaseInsensitive ? normalizePercentEscapeHexCase(redacted) : redacted;
		const comparableCandidate = percentCaseInsensitive ? normalizePercentEscapeHexCase(candidate) : candidate;
		let prefixLength = Math.min(comparableCandidate.length - 1, comparableText.length);
		while (prefixLength > longestPartialSuffix && !comparableText.endsWith(comparableCandidate.slice(0, prefixLength))) prefixLength -= 1;
		longestPartialSuffix = Math.max(longestPartialSuffix, prefixLength);
	}
	return longestPartialSuffix === 0 ? redacted : `${redacted.slice(0, -longestPartialSuffix)}${REDACTED_SECRET}`;
}
function collectOllamaRequestHeaderSecretValues(headers) {
	return Object.entries(headers).flatMap(([headerName, headerValue]) => {
		const normalizedHeaderName = headerName.toLowerCase();
		if (normalizedHeaderName === "content-type" && headerValue === "application/json") return [];
		if (!AUTHORIZATION_SECRET_HEADERS.has(normalizedHeaderName)) return [headerValue];
		const credentialComponent = /^\s*\S+\s+(.+?)\s*$/u.exec(headerValue)?.[1];
		return credentialComponent ? [headerValue, credentialComponent] : [headerValue];
	});
}
function redactOllamaResponseErrorText(text, headers, options) {
	return redactToolPayloadText(redactExactSecretValues(text, collectOllamaRequestHeaderSecretValues(headers), options?.sourceTruncated === true));
}
async function readOllamaResponseErrorText(response, limitBytes, headers) {
	const result = await readResponseTextPrefix(response, limitBytes, {
		chunkTimeoutMs: 1e4,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`)
	});
	return redactOllamaResponseErrorText(result.text, headers, { sourceTruncated: result.truncated });
}
//#endregion
export { redactOllamaResponseErrorText as n, readOllamaResponseErrorText as t };
