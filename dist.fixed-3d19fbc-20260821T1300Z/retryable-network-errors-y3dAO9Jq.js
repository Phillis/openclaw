import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as readErrorName, n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-CqPTYU6G.js";
//#region src/infra/error-graph-internal.ts
function extractErrorCodeOrErrno(err) {
	const code = extractErrorCode(err);
	if (code) return code.trim().toUpperCase();
	if (!err || typeof err !== "object") return;
	const errno = err.errno;
	if (typeof errno === "string" && errno.trim()) return errno.trim().toUpperCase();
	if (typeof errno === "number" && Number.isFinite(errno)) return String(errno);
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			current.cause,
			current.reason,
			current.original,
			current.error,
			current.data
		];
		if (Array.isArray(current.errors)) nested.push(...current.errors);
		return nested;
	});
}
//#endregion
//#region src/infra/retryable-network-errors.ts
const TRANSIENT_NETWORK_CODES = /* @__PURE__ */ new Set([
	"ECONNRESET",
	"ECONNREFUSED",
	"ENOTFOUND",
	"ETIMEDOUT",
	"ESOCKETTIMEDOUT",
	"ECONNABORTED",
	"EPIPE",
	"ENETDOWN",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EADDRNOTAVAIL",
	"EAI_AGAIN",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_DNS_RESOLVE_FAILED",
	"UND_ERR_CONNECT",
	"UND_ERR_SOCKET",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_BODY_TIMEOUT",
	"ERR_HTTP2_INVALID_SESSION",
	"EPROTO",
	"ERR_SSL_WRONG_VERSION_NUMBER",
	"ERR_SSL_PROTOCOL_RETURNED_AN_ERROR"
]);
const TRANSIENT_NETWORK_ERROR_NAMES = /* @__PURE__ */ new Set([
	"AbortError",
	"ConnectTimeoutError",
	"HeadersTimeoutError",
	"BodyTimeoutError",
	"TimeoutError"
]);
const TRANSIENT_NETWORK_MESSAGE_CODE_RE = /\b(ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ESOCKETTIMEDOUT|ECONNABORTED|EPIPE|ENETDOWN|EHOSTUNREACH|ENETUNREACH|EADDRNOTAVAIL|EAI_AGAIN|EPROTO|UND_ERR_CONNECT_TIMEOUT|UND_ERR_DNS_RESOLVE_FAILED|UND_ERR_CONNECT|UND_ERR_SOCKET|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|ERR_HTTP2_INVALID_SESSION)\b/i;
const TRANSIENT_NETWORK_MESSAGE_SNIPPETS = [
	"getaddrinfo",
	"socket hang up",
	"client network socket disconnected before secure tls connection was established",
	"network error",
	"network is unreachable",
	"temporary failure in name resolution",
	"upstream connect error",
	"disconnect/reset before headers",
	"tlsv1 alert",
	"ssl routines",
	"packet length too long",
	"write eproto"
];
const RETRYABLE_CONNECTION_ERROR_CODE_RE = /\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN|UND_ERR_SOCKET)\b/i;
function isWrappedFetchFailedMessage(message) {
	if (message === "fetch failed") return true;
	return /:\s*fetch failed$/.test(message);
}
function hasRetryableConnectionErrorCode(message) {
	return RETRYABLE_CONNECTION_ERROR_CODE_RE.test(message);
}
/** Returns true when any nested error proves a transient network failure. */
function isTransientNetworkError(err) {
	if (!err) return false;
	for (const candidate of collectNestedErrorCandidates(err)) {
		const code = extractErrorCodeOrErrno(candidate);
		if (code && TRANSIENT_NETWORK_CODES.has(code)) return true;
		const name = readErrorName(candidate);
		if (name && TRANSIENT_NETWORK_ERROR_NAMES.has(name)) return true;
		if (!candidate || typeof candidate !== "object") continue;
		const message = normalizeLowercaseStringOrEmpty(candidate.message);
		if (!message) continue;
		if (TRANSIENT_NETWORK_MESSAGE_CODE_RE.test(message)) return true;
		if (isWrappedFetchFailedMessage(message)) return true;
		if (TRANSIENT_NETWORK_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet))) return true;
	}
	return false;
}
//#endregion
export { extractErrorCodeOrErrno as i, isTransientNetworkError as n, collectNestedErrorCandidates as r, hasRetryableConnectionErrorCode as t };
