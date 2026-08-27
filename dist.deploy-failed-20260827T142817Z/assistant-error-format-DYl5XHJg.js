import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
//#region src/shared/http-error-response.ts
const HTML_ERROR_PREFIX_RE$1 = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
function extractHttpResponseBody(status) {
	if (!status) return null;
	if (HTML_ERROR_PREFIX_RE$1.test(status.rest)) return {
		code: status.code,
		body: status.rest
	};
	const lineBreak = status.rest.indexOf("\n");
	return {
		code: status.code,
		body: lineBreak === -1 ? status.rest : status.rest.slice(lineBreak + 1).trimStart()
	};
}
//#endregion
//#region src/shared/assistant-error-format.ts
const ERROR_PAYLOAD_PREFIX_RE = /^(?:error|(?:[a-z][\w-]*\s+)?api\s*error|apierror|openai\s*error|anthropic\s*error|gateway\s*error|codex\s*error)(?:\s+\d{3})?[:\s-]+/i;
const HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
const HTTP_STATUS_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
const HTTP_STATUS_CODE_PREFIX_RE = new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
const PROVIDER_WRAPPED_HTTP_STATUS_RE = /^(?:[a-z][\w-]*(?:\s+[a-z][\w-]*){0,3}\s+)?api\s*error\s*\((\d{3})\)(?:\s*:\s*([\s\S]*))?$/i;
const LABELED_HTTP_STATUS_RE = /^(?:status code|unexpected status|http status)\s*[:=]?\s*(\d{3})\b(?:\s*[:,]?\s*(?:message\s*:\s*)?([\s\S]*))?$/i;
const ERROR_STATUS_ENVELOPE_RE = /^error\s*[:,]\s*/i;
const HTML_ERROR_PREFIX_RE = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
const HTML_CLOSE_RE = /<\/html>/i;
const CLOUDFLARE_HTML_ERROR_CODES = /* @__PURE__ */ new Set([
	521,
	522,
	523,
	524,
	525,
	526,
	530
]);
const STANDALONE_HTML_ERROR_HINT_RE = /\bcloudflare\b|cdn-cgi\/challenge-platform|challenge-error-text|enable javascript and cookies to continue|access denied|forbidden|service unavailable|bad gateway|web server is down|captcha|attention required/i;
const GENERIC_PROVIDER_INTERNAL_ERROR_RE = /an error occurred while processing your request/i;
const SUPPORT_REQUEST_ID_RE = /(?:request[\s_-]*id)\s*[:#]?\s*([a-z0-9][a-z0-9_-]{6,}[a-z0-9])/i;
const GENERIC_PROVIDER_INTERNAL_ERROR_USER_MESSAGE = "The AI service returned an internal error. Please try again in a moment.";
const MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE = "OpenClaw transport error: malformed_streaming_fragment";
const MALFORMED_STREAMING_FRAGMENT_USER_MESSAGE = "LLM streaming response contained a malformed fragment. Please try again.";
function isErrorPayloadObject(payload) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
	const record = payload;
	if (record.type === "error") return true;
	if (typeof record.request_id === "string" || typeof record.requestId === "string") return true;
	if ("error" in record) {
		const err = record.error;
		if (err && typeof err === "object" && !Array.isArray(err)) {
			const errRecord = err;
			if (typeof errRecord.message === "string" || typeof errRecord.type === "string" || typeof errRecord.code === "string") return true;
		}
		if (typeof err === "string" && typeof record.message === "string") return true;
	}
	return false;
}
function parseApiErrorPayload(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const candidates = [trimmed];
	if (ERROR_PAYLOAD_PREFIX_RE.test(trimmed)) candidates.push(trimmed.replace(ERROR_PAYLOAD_PREFIX_RE, "").trim());
	for (const candidate of candidates) {
		if (!candidate.startsWith("{") || !candidate.endsWith("}")) continue;
		try {
			const parsed = JSON.parse(candidate);
			if (isErrorPayloadObject(parsed)) return parsed;
		} catch {}
	}
	return null;
}
function extractHttpStatusMatch(match) {
	if (!match) return null;
	const code = Number(match[1]);
	if (!Number.isInteger(code) || code < 100 || code > 599) return null;
	return {
		code,
		rest: (match[2] ?? "").trim()
	};
}
function extractLeadingHttpStatus(raw) {
	return extractHttpStatusMatch(raw.match(HTTP_STATUS_CODE_PREFIX_RE));
}
function extractProviderWrappedHttpStatus(raw) {
	return extractHttpStatusMatch(raw.match(PROVIDER_WRAPPED_HTTP_STATUS_RE));
}
/** Extract an explicitly labeled provider HTTP status without matching embedded numeric text. */
function extractErrorHttpStatus(raw) {
	const trimmed = raw.trim();
	const direct = extractLeadingHttpStatus(trimmed) ?? extractProviderWrappedHttpStatus(trimmed) ?? extractHttpStatusMatch(trimmed.match(LABELED_HTTP_STATUS_RE));
	if (direct) return direct;
	const unwrapped = trimmed.replace(ERROR_STATUS_ENVELOPE_RE, "");
	if (unwrapped === trimmed) return null;
	return extractLeadingHttpStatus(unwrapped) ?? extractProviderWrappedHttpStatus(unwrapped) ?? extractHttpStatusMatch(unwrapped.match(LABELED_HTTP_STATUS_RE));
}
function isCloudflareOrHtmlErrorPage(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (HTML_ERROR_PREFIX_RE.test(trimmed) && HTML_CLOSE_RE.test(trimmed) && STANDALONE_HTML_ERROR_HINT_RE.test(trimmed)) return true;
	const status = extractHttpResponseBody(extractLeadingHttpStatus(trimmed));
	if (!status || status.code < 500) return false;
	if (CLOUDFLARE_HTML_ERROR_CODES.has(status.code)) return true;
	return status.code < 600 && HTML_ERROR_PREFIX_RE.test(status.body) && HTML_CLOSE_RE.test(status.body);
}
function isGenericProviderInternalError(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	return GENERIC_PROVIDER_INTERNAL_ERROR_RE.test(trimmed) && (/help\.openai\.com/i.test(trimmed) || SUPPORT_REQUEST_ID_RE.test(trimmed));
}
function parseApiErrorInfo(raw) {
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed) return null;
	let httpCode;
	let candidate = trimmed;
	const httpPrefix = extractHttpStatusMatch(candidate.match(/^(\d{3})\s+(.+)$/s));
	if (httpPrefix) {
		httpCode = String(httpPrefix.code);
		candidate = httpPrefix.rest;
	}
	const payload = parseApiErrorPayload(candidate);
	if (!payload) return null;
	const requestId = typeof payload.request_id === "string" ? payload.request_id : typeof payload.requestId === "string" ? payload.requestId : void 0;
	const topType = typeof payload.type === "string" ? payload.type : void 0;
	const topMessage = typeof payload.message === "string" ? payload.message : void 0;
	let errType;
	let errMessage;
	if (payload.error && typeof payload.error === "object" && !Array.isArray(payload.error)) {
		const err = payload.error;
		if (typeof err.type === "string") errType = err.type;
		if (typeof err.code === "string" && !errType) errType = err.code;
		if (typeof err.message === "string") errMessage = err.message;
	} else if (typeof payload.error === "string") errType = payload.error;
	return {
		httpCode,
		type: errType ?? topType,
		message: errMessage ?? topMessage,
		requestId
	};
}
function formatRawAssistantErrorForUi(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return "LLM request failed with an unknown error.";
	if (trimmed === "OpenClaw transport error: malformed_streaming_fragment") return MALFORMED_STREAMING_FRAGMENT_USER_MESSAGE;
	if (isGenericProviderInternalError(trimmed)) return GENERIC_PROVIDER_INTERNAL_ERROR_USER_MESSAGE;
	const leadingStatus = extractLeadingHttpStatus(trimmed);
	const isHtmlChallenge = isCloudflareOrHtmlErrorPage(trimmed);
	if (leadingStatus && isHtmlChallenge) return `The AI service is temporarily unavailable (HTTP ${leadingStatus.code}). Please try again in a moment.`;
	if (isHtmlChallenge) return "The provider returned an HTML error page instead of an API response. This usually means a CDN or gateway (e.g. Cloudflare) blocked the request. Retry in a moment or check provider status.";
	const httpMatch = extractHttpStatusMatch(trimmed.match(HTTP_STATUS_PREFIX_RE));
	if (httpMatch) {
		if (!httpMatch.rest.startsWith("{")) return `HTTP ${httpMatch.code}: ${httpMatch.rest}`;
	}
	const info = parseApiErrorInfo(trimmed);
	if (info?.message) return `${info.httpCode ? `HTTP ${info.httpCode}` : "LLM error"}${info.type ? ` ${info.type}` : ""}: ${info.message}`;
	return trimmed.length > 600 ? `${truncateUtf16Safe(trimmed, 600)}…` : trimmed;
}
//#endregion
export { formatRawAssistantErrorForUi as a, parseApiErrorInfo as c, extractProviderWrappedHttpStatus as i, parseApiErrorPayload as l, extractErrorHttpStatus as n, isCloudflareOrHtmlErrorPage as o, extractLeadingHttpStatus as r, isGenericProviderInternalError as s, MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE as t, extractHttpResponseBody as u };
