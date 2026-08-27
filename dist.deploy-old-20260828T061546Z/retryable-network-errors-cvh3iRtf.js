import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { o as readErrorName } from "./errors-Ccx0R-_Z.js";
import { n as extractErrorCodeOrErrno, t as collectNestedErrorCandidates } from "./error-graph-internal-H3duHSSm.js";
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
export { isTransientNetworkError as n, hasRetryableConnectionErrorCode as t };
