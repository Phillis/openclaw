import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./boolean-DmBL0YJK.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import "./number-coercion-CLj0HTDM.js";
import { f as redactSensitiveText, m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import { f as readResponseWithLimit, u as readResponseTextPrefix } from "./http-body-DthsuKdw.js";
//#region src/agents/provider-http-errors.ts
/**
* Shared provider HTTP error normalization helpers.
*
* Transport adapters use this module to turn provider-specific response bodies,
* request ids, and binary payload guardrails into stable OpenClaw error shapes.
*/
const ERROR_BODY_METADATA_LIMIT = 500;
const PROVIDER_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
const SHORT_BEARER_TOKEN_PATTERN = /\b(Bearer)\s+[-A-Za-z0-9._~+/=]{1,17}(?![-A-Za-z0-9._~+/=…])/giu;
function extractHeaderCredential(headers, headerName, prefix = "") {
	const value = headers.get(headerName) ?? "";
	return prefix && value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
function extractAuthorizationPayload(headers) {
	const value = headers.get("Authorization") ?? "";
	const separator = value.search(/\s/u);
	return separator === -1 ? value : value.slice(separator).trimStart();
}
/** Builds a redactor for response text that may reflect the request's active credential. */
function createProviderErrorTextRedactor(params) {
	const auth = params.request?.auth;
	const credentials = [
		extractHeaderCredential(params.headers, params.defaultAuthHeader, params.defaultAuthPrefix),
		auth?.mode === "header" ? extractHeaderCredential(params.headers, auth.headerName, auth.prefix ?? "") : auth?.mode === "authorization-bearer" ? extractHeaderCredential(params.headers, "Authorization", "Bearer ") : "",
		extractAuthorizationPayload(params.headers)
	].filter(Boolean).toSorted((left, right) => right.length - left.length);
	return (text, context) => {
		let withoutActiveCredential = credentials.reduce((redacted, credential) => redacted.split(credential).join("***"), text);
		if (context?.truncated) {
			const partialCredentialLength = credentials.reduce((longest, credential) => {
				const maxLength = Math.min(credential.length - 1, withoutActiveCredential.length);
				for (let length = maxLength; length > longest; length -= 1) if (withoutActiveCredential.endsWith(credential.slice(0, length))) return length;
				return longest;
			}, 0);
			if (partialCredentialLength > 0) withoutActiveCredential = `${withoutActiveCredential.slice(0, -partialCredentialLength)}***`;
		}
		return redactToolPayloadText(withoutActiveCredential).replace(SHORT_BEARER_TOKEN_PATTERN, "$1 ***");
	};
}
function readProviderResponseBytes(response, label, kind, opts, onOverflow) {
	return readResponseWithLimit(response, opts?.maxBytes ?? PROVIDER_RESPONSE_MAX_BYTES, {
		...opts,
		chunkTimeoutMs: opts?.chunkTimeoutMs ?? 3e4,
		onIdleTimeout: opts?.onIdleTimeout ?? (({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${label}: response body stalled for ${chunkTimeoutMs}ms`)),
		onOverflow: onOverflow ?? (({ maxBytes: limit }) => /* @__PURE__ */ new Error(`${label}: ${kind} response exceeds ${limit} bytes`))
	});
}
var ProviderErrorBodyTimeout = class extends Error {
	constructor(timeoutError) {
		super(timeoutError instanceof Error ? timeoutError.message : String(timeoutError), { cause: timeoutError });
		this.name = "ProviderErrorBodyTimeout";
		this.timeoutError = timeoutError;
	}
};
/** Trims provider error details to a log- and prompt-safe preview length. */
function truncateErrorDetail(detail, limit = 220) {
	return detail.length <= limit ? detail : `${truncateUtf16Safe(detail, limit - 1)}…`;
}
/** Redacts secrets before preserving a bounded provider error body preview. */
function redactProviderErrorBody(body) {
	return truncateErrorDetail(redactSensitiveText(body), ERROR_BODY_METADATA_LIMIT);
}
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
async function readResponseTextLimited(response, limitBytes = 16 * 1024, options) {
	if (limitBytes <= 0) return "";
	return (await readResponseTextPrefix(response, limitBytes, {
		chunkTimeoutMs: options?.chunkTimeoutMs ?? 1e4,
		onIdleTimeout: options?.onIdleTimeout ?? (({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`)),
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	})).text;
}
/** Reads a successful provider text response under a byte cap. */
async function readProviderTextResponse(response, label, opts) {
	const bytes = await readProviderResponseBytes(response, label, "text", opts);
	return new TextDecoder().decode(bytes);
}
/** Formats common provider JSON error payload shapes into one readable detail string. */
function formatProviderErrorPayload(payload) {
	const root = asOptionalRecord(payload);
	const detailObject = asOptionalRecord(root?.detail);
	const subject = asOptionalRecord(root?.error) ?? detailObject ?? root;
	if (!subject) return;
	const errorDescription = normalizeOptionalString(subject.error_description) ?? normalizeOptionalString(root?.error_description);
	const oauthCode = errorDescription ? normalizeOptionalString(root?.error) : void 0;
	const message = normalizeOptionalString(subject.message) ?? normalizeOptionalString(subject.detail) ?? errorDescription ?? normalizeOptionalString(root?.message) ?? normalizeOptionalString(root?.error) ?? normalizeOptionalString(root?.detail);
	const type = normalizeOptionalString(subject.type);
	const code = normalizeOptionalString(subject.code) ?? normalizeOptionalString(subject.status) ?? oauthCode;
	const metadata = [type ? `type=${type}` : void 0, code ? `code=${code}` : void 0].filter((value) => Boolean(value)).join(", ");
	if (message && metadata) return `${truncateErrorDetail(message)} [${metadata}]`;
	if (message) return truncateErrorDetail(message);
	if (metadata) return `[${metadata}]`;
}
function extractProviderErrorPayloadMetadata(payload) {
	const root = asOptionalRecord(payload);
	const detailObject = asOptionalRecord(root?.detail);
	const subject = asOptionalRecord(root?.error) ?? detailObject ?? root;
	if (!subject) return {};
	const detail = formatProviderErrorPayload(payload);
	const type = normalizeOptionalString(subject.type);
	const oauthCode = normalizeOptionalString(subject.error_description) ?? normalizeOptionalString(root?.error_description) ? normalizeOptionalString(root?.error) : void 0;
	const code = normalizeOptionalString(subject.code) ?? normalizeOptionalString(subject.status) ?? oauthCode;
	return {
		...detail ? { detail: redactSensitiveText(detail) } : {},
		...code ? { code } : {},
		...type ? { type } : {}
	};
}
/** Extracts normalized provider error metadata while keeping the raw body bounded and redacted. */
async function extractProviderErrorInfo(response, options) {
	const bodyTimeoutMs = options?.bodyTimeoutMs;
	const rawBody = normalizeOptionalString(await readResponseTextLimited(response, 16 * 1024, {
		timeoutMs: typeof bodyTimeoutMs === "function" ? () => {
			try {
				return bodyTimeoutMs();
			} catch (error) {
				throw new ProviderErrorBodyTimeout(error);
			}
		} : bodyTimeoutMs,
		onTimeout: (params) => new ProviderErrorBodyTimeout(options?.onBodyTimeout?.(params) ?? /* @__PURE__ */ new Error(`Provider error body timed out after ${params.timeoutMs}ms`))
	}).catch((error) => {
		if (error instanceof ProviderErrorBodyTimeout) throw error.timeoutError;
		return "";
	}));
	const requestId = extractProviderRequestId(response);
	if (!rawBody) return requestId ? { requestId } : {};
	const body = redactProviderErrorBody(rawBody);
	try {
		const metadata = extractProviderErrorPayloadMetadata(JSON.parse(rawBody));
		return {
			...metadata.detail ? { detail: metadata.detail } : { detail: body },
			...metadata.code ? { code: metadata.code } : {},
			...metadata.type ? { type: metadata.type } : {},
			body,
			...requestId ? { requestId } : {}
		};
	} catch {
		return {
			detail: body,
			body,
			...requestId ? { requestId } : {}
		};
	}
}
/** Returns only the normalized provider detail string for callers that do not need metadata. */
async function extractProviderErrorDetail(response) {
	return (await extractProviderErrorInfo(response)).detail;
}
/** Reads the provider request id header variants used across model and media APIs. */
function extractProviderRequestId(response) {
	return normalizeOptionalString(response.headers.get("x-request-id")) ?? normalizeOptionalString(response.headers.get("request-id"));
}
/** Error type carrying normalized provider status, request id, code, type, and body metadata. */
var ProviderHttpError = class extends Error {
	constructor(message, params) {
		super(message);
		this.name = "ProviderHttpError";
		this.status = params.status;
		this.statusCode = params.status;
		this.code = params.code;
		this.errorCode = params.code;
		this.errorType = params.type;
		this.errorBody = params.body;
		this.requestId = params.requestId;
	}
};
/** Builds the human-facing provider HTTP error message from normalized metadata. */
function formatProviderHttpErrorMessage(params) {
	const { label, status, detail, requestId, statusPrefix = "" } = params;
	return `${label} (${statusPrefix}${status})` + (detail ? `: ${detail}` : "") + (requestId ? ` [request_id=${requestId}]` : "");
}
/** Creates a normalized provider HTTP error from a failed response. */
async function createProviderHttpError(response, label, options) {
	const info = await extractProviderErrorInfo(response, options);
	return new ProviderHttpError(formatProviderHttpErrorMessage({
		label,
		status: response.status,
		detail: info.detail,
		requestId: info.requestId,
		statusPrefix: options?.statusPrefix
	}), {
		status: response.status,
		code: info.code,
		type: info.type,
		body: info.body,
		requestId: info.requestId
	});
}
/** Throws a normalized provider error when a fetch response is not OK. */
async function assertOkOrThrowProviderError(response, label, options) {
	if (response.ok) return;
	throw await createProviderHttpError(response, label, options);
}
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
async function assertOkOrThrowHttpError(response, label, options) {
	if (response.ok) return;
	throw await createProviderHttpError(response, label, {
		...options,
		statusPrefix: "HTTP "
	});
}
/**
* Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
*
* The body is read through the same bounded reader as binary responses so a provider that streams an
* unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
*/
async function readProviderJsonResponse(response, label, opts) {
	const bytes = await readProviderResponseBytes(response, label, "JSON", opts);
	try {
		return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
	} catch (cause) {
		throw new Error(`${label}: malformed JSON response`, { cause });
	}
}
/** Parses a provider JSON response that must be a top-level object. */
async function readProviderJsonObjectResponse(response, label, opts) {
	const object = asOptionalRecord(await readProviderJsonResponse(response, label, opts));
	if (!object) throw new Error(`${label}: malformed JSON response`);
	return object;
}
/** Parses a provider JSON object response and returns an array field. */
async function readProviderJsonArrayFieldResponse(response, label, field, opts) {
	const value = (await readProviderJsonObjectResponse(response, label, opts))[field];
	if (!Array.isArray(value)) throw new Error(`${label}: malformed JSON response`);
	return value;
}
function normalizeContentType(response) {
	return response.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() || void 0;
}
/** Rejects text or JSON responses on provider endpoints that should return binary bytes. */
function assertProviderBinaryResponseContent(response, label, kind = "binary") {
	const contentType = normalizeContentType(response);
	if (!contentType) return;
	if (contentType === "application/json" || contentType.endsWith("+json") || contentType.startsWith("text/")) throw new Error(`${label}: malformed ${kind} response`);
}
/** Reads a bounded non-empty binary provider response after content-type validation. */
async function readProviderBinaryResponse(response, label, kind = "binary", opts) {
	try {
		assertProviderBinaryResponseContent(response, label, kind);
	} catch (error) {
		response.body?.cancel().catch(() => void 0);
		throw error;
	}
	const bytes = await readProviderResponseBytes(response, label, kind, opts, opts?.onOverflow);
	if (bytes.byteLength === 0) throw new Error(`${label}: malformed ${kind} response`);
	return bytes;
}
//#endregion
export { truncateErrorDetail as _, createProviderErrorTextRedactor as a, extractProviderRequestId as c, readProviderBinaryResponse as d, readProviderJsonArrayFieldResponse as f, readResponseTextLimited as g, readProviderTextResponse as h, assertProviderBinaryResponseContent as i, formatProviderErrorPayload as l, readProviderJsonResponse as m, assertOkOrThrowHttpError as n, createProviderHttpError as o, readProviderJsonObjectResponse as p, assertOkOrThrowProviderError as r, extractProviderErrorDetail as s, ProviderHttpError as t, formatProviderHttpErrorMessage as u };
