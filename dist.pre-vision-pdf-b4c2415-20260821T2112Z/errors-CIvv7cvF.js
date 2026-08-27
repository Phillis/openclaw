import { r as stringifyNonErrorCause } from "./error-coercion-DisD0JTb.js";
//#region packages/acp-core/src/structured-auth-redaction.ts
const HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
const HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
const HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
const HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
const HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
const HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
const HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
const HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
const HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
const CREDENTIAL_STYLE_HEADER_REDACT_PATTERN = String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
const STRUCTURED_AUTH_HEADER_RE = new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`, "giu");
const AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
const AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
function skipHorizontalWhitespace(value, start) {
	let cursor = start;
	while (value[cursor] === " " || value[cursor] === "	") cursor += 1;
	return cursor;
}
function readSerializedLineEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (slashCount === 0) return null;
	if (value[cursor] === "n") return cursor + 1;
	if (value[cursor] !== "r") return null;
	cursor += 1;
	slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipHorizontalWhitespace(value, cursor);
		const tabEnd = readSerializedTabEnd(value, cursor);
		if (tabEnd !== null) {
			cursor = tabEnd;
			continue;
		}
		const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
		if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) return cursor;
		cursor = lineEnd;
	}
}
function readAuthParamName(value, start) {
	const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
	return match ? {
		name: match[0].toLowerCase(),
		end: start + match[0].length
	} : null;
}
function isAuthHeaderStart(value, index) {
	const previous = value[index - 1];
	let serializedLineBoundary = false;
	if (previous === "n" || previous === "r") {
		let slashCursor = index - 2;
		let slashCount = 0;
		while (slashCount < 64 && value[slashCursor] === "\\") {
			slashCount += 1;
			slashCursor -= 1;
		}
		serializedLineBoundary = slashCount > 0;
	}
	if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) return false;
	const proxyName = "proxy-authorization";
	const directName = "authorization";
	const candidate = value.slice(index, index + 19).toLowerCase();
	const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
	if (!name) return false;
	let cursor = index + name.length;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (value[cursor] === "\"" || value[cursor] === "'") cursor += 1;
	else if (slashCount > 0) return false;
	cursor = skipHorizontalWhitespace(value, cursor);
	return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipAuthWhitespace(value, cursor);
		if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
		if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") return null;
		if (value[cursor] === ",") {
			cursor += 1;
			continue;
		}
		const param = readAuthParamName(value, cursor);
		if (param) {
			const equals = skipAuthWhitespace(value, param.end);
			if (value[equals] === "=" && value[equals + 1] !== "=") return cursor;
		}
		while (cursor < value.length) {
			const whitespaceEnd = skipAuthWhitespace(value, cursor);
			if (whitespaceEnd > cursor) {
				cursor = whitespaceEnd;
				continue;
			}
			if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
			const char = value[cursor];
			if (char === "\r" || char === "\n" || char === ";") return null;
			cursor += 1;
			if (char === ",") break;
		}
	}
}
function usesAuthParams(scheme) {
	return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
	let cursor = start;
	while (cursor < value.length) {
		const whitespaceEnd = skipAuthWhitespace(value, cursor);
		if (whitespaceEnd > cursor) {
			cursor = whitespaceEnd;
			continue;
		}
		if (cursor > start && isAuthHeaderStart(value, cursor)) break;
		const char = value[cursor];
		if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === "\"" || char === "'" || char === "}" || char === "]") break;
		cursor += 1;
	}
	return cursor;
}
function readParamValue(value, start, options) {
	let escapedQuoteSlashCount = 0;
	while (value[start + escapedQuoteSlashCount] === "\\") escapedQuoteSlashCount += 1;
	const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === "\"";
	const quote = value[start] === "\"" || value[start] === "'" ? value[start] : void 0;
	if (quote || escapedQuotes) {
		let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
		while (cursor < value.length) {
			if (value[cursor] === "\r" || value[cursor] === "\n") {
				const whitespaceEnd = skipAuthWhitespace(value, cursor);
				if (whitespaceEnd === cursor) break;
				cursor = whitespaceEnd;
				continue;
			}
			if (escapedQuotes && value[cursor] === "\\") {
				let slashEnd = cursor + 1;
				while (value[slashEnd] === "\\") slashEnd += 1;
				if (value[slashEnd] === "\"") {
					if ((slashEnd - cursor) % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) return slashEnd + 1;
					cursor = slashEnd + 1;
					continue;
				}
				cursor = slashEnd;
				continue;
			}
			if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
				cursor += 2;
				continue;
			}
			if (!escapedQuotes && value[cursor] === quote) return cursor + 1;
			cursor += 1;
		}
		return cursor > start + 1 ? cursor : null;
	}
	if (options.signedHeaders) {
		const match = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(value.slice(start));
		if (!match) return null;
		const end = start + match[0].length;
		const next = value[end];
		return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
	}
	const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(value.slice(start));
	return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
	const ranges = [];
	for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
		const scheme = (header[2] ?? "").toLowerCase();
		let cursor = (header.index ?? 0) + header[0].length;
		const rangeStart = cursor;
		let rangeEnd = cursor;
		const directParam = readAuthParamName(value, cursor);
		const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
		if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
			if (value[skipAuthWhitespace(value, cursor)] !== "," && !usesAuthParams(scheme)) continue;
			const firstParamStart = findNextAuthParamStart(value, cursor);
			if (firstParamStart === null) continue;
			cursor = firstParamStart;
		}
		for (;;) {
			const param = readAuthParamName(value, cursor);
			if (!param) break;
			cursor = skipAuthWhitespace(value, param.end);
			if (value[cursor] !== "=") break;
			cursor = skipAuthWhitespace(value, cursor + 1);
			const valueEnd = readParamValue(value, cursor, {
				awsScope: scheme.startsWith("aws4-") && param.name === "credential",
				signedHeaders: param.name === "signedheaders"
			});
			if (valueEnd === null) {
				const nextParamStart = findNextAuthParamStart(value, cursor);
				if (nextParamStart !== null) {
					cursor = nextParamStart;
					continue;
				}
				rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
				break;
			}
			rangeEnd = valueEnd;
			const separator = skipAuthWhitespace(value, valueEnd);
			if (value[separator] !== ",") {
				if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== "\"" && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
					const nextParamStart = findNextAuthParamStart(value, separator);
					if (nextParamStart !== null) {
						cursor = nextParamStart;
						continue;
					}
					rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
				}
				break;
			}
			const nextParamStart = findNextAuthParamStart(value, separator + 1);
			if (nextParamStart === null) break;
			cursor = nextParamStart;
		}
		if (rangeEnd > rangeStart) ranges.push({
			start: rangeStart,
			end: rangeEnd
		});
	}
	return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
	const ranges = findStructuredAuthParamRanges(value);
	if (ranges.length === 0) return value;
	const merged = [];
	for (const range of ranges) {
		const previous = merged.at(-1);
		if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
		else merged.push({ ...range });
	}
	const parts = [];
	let cursor = 0;
	for (const range of merged) {
		parts.push(value.slice(cursor, range.start), replacement);
		cursor = range.end;
	}
	parts.push(value.slice(cursor));
	return parts.join("");
}
//#endregion
//#region packages/acp-core/src/error-format.ts
const STRUCTURED_AUTH_MARKER_PREFIX = ";__openclaw_structured_auth_redacted_";
const SECRET_PATTERNS = [
	/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
	/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g,
	/[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^&\s"'<>]+)/gi,
	/"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/g,
	/(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
	/(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
	/--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)\s+(["']?)([^\s"']+)\1/gi,
	new RegExp(String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`, "gi"),
	new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(?!${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}${STRUCTURED_AUTH_MARKER_PREFIX})(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`, "gi"),
	new RegExp(CREDENTIAL_STYLE_HEADER_REDACT_PATTERN, "gi"),
	/(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
	/\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])/g,
	/(^|[\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token)=([^\s&#]+)/gi,
	/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g
];
let configuredRedactor;
function createStructuredAuthMarker(value) {
	const usedIds = /* @__PURE__ */ new Set();
	const maxIdDigits = String(value.length).length;
	let cursor = 0;
	for (;;) {
		const markerStart = value.indexOf(STRUCTURED_AUTH_MARKER_PREFIX, cursor);
		if (markerStart < 0) break;
		const idStart = markerStart + 37;
		let idEnd = idStart;
		while (idEnd - idStart <= maxIdDigits) {
			const char = value[idEnd];
			if (char === void 0 || char < "0" || char > "9") break;
			idEnd += 1;
		}
		if (idEnd > idStart && value[idEnd] === ";" && idEnd - idStart <= maxIdDigits) {
			const id = Number(value.slice(idStart, idEnd));
			if (id <= value.length) usedIds.add(id);
		}
		cursor = idStart;
	}
	let id = 0;
	while (usedIds.has(id)) id += 1;
	return `${STRUCTURED_AUTH_MARKER_PREFIX}${id};`;
}
/** Installs a host-provided redactor used before ACP fallback secret-pattern redaction. */
function configureAcpErrorRedactor(redactor) {
	configuredRedactor = redactor;
}
/** Redacts common HTTP, payment, assignment, and private-key secrets from error text. */
function redactSensitiveText(value) {
	const configured = configuredRedactor ? configuredRedactor(value) : value;
	const structuredAuthMarker = createStructuredAuthMarker(configured);
	let redacted = redactStructuredAuthHeaders(configured, structuredAuthMarker);
	for (const pattern of SECRET_PATTERNS) redacted = redacted.replace(pattern, (match, ...args) => {
		if (match.includes("PRIVATE KEY-----")) return "[REDACTED_PRIVATE_KEY]";
		const token = args.slice(0, -2).findLast((group) => typeof group === "string" && group.length > 0);
		return token ? match.replace(token, "[REDACTED]") : "[REDACTED]";
	});
	return redacted.replaceAll(structuredAuthMarker, "[REDACTED]");
}
//#endregion
//#region packages/acp-core/src/runtime/errors.ts
const ACP_ERROR_CODES = [
	"ACP_BACKEND_MISSING",
	"ACP_BACKEND_UNAVAILABLE",
	"ACP_BACKEND_UNSUPPORTED_CONTROL",
	"ACP_DISPATCH_DISABLED",
	"ACP_INVALID_RUNTIME_OPTION",
	"ACP_SESSION_INIT_FAILED",
	"ACP_TURN_FAILED"
];
const ACP_ERROR_CODE_SET = new Set(ACP_ERROR_CODES);
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
var AcpRuntimeError = class extends Error {
	constructor(code, message, options) {
		super(message);
		this.name = "AcpRuntimeError";
		this.code = code;
		this.detailCode = options?.detailCode;
		this.cause = options?.cause;
	}
};
function getForeignAcpRuntimeError(value) {
	if (!(value instanceof Error)) return null;
	const code = value.code;
	if (typeof code !== "string" || !ACP_ERROR_CODE_SET.has(code)) return null;
	return {
		code,
		message: value.message
	};
}
function readAcpRequestErrorDetails(value) {
	if (typeof value.code !== "number") return;
	const data = value.data;
	if (!data || typeof data !== "object") return;
	const details = data.details;
	if (details === void 0 || details === null) return;
	const rendered = redactSensitiveText(stringifyNonErrorCause(details)).trim();
	return rendered.length > 0 ? rendered : void 0;
}
function messageWithAcpRequestErrorDetails(error) {
	const details = readAcpRequestErrorDetails(error);
	if (!details || error.message.includes(details)) return error.message;
	return `${error.message}: ${details}`;
}
/** Recognizes local and cross-realm ACP runtime errors by their stable error code. */
function isAcpRuntimeError(value) {
	return value instanceof AcpRuntimeError || getForeignAcpRuntimeError(value) !== null;
}
/** Converts arbitrary thrown values into ACP runtime errors with redacted request details. */
function toAcpRuntimeError(params) {
	if (params.error instanceof AcpRuntimeError) return params.error;
	const foreignAcpRuntimeError = getForeignAcpRuntimeError(params.error);
	if (foreignAcpRuntimeError) return new AcpRuntimeError(foreignAcpRuntimeError.code, foreignAcpRuntimeError.message, { cause: params.error });
	if (params.error instanceof Error) return new AcpRuntimeError(params.fallbackCode, messageWithAcpRequestErrorDetails(params.error), { cause: params.error });
	return new AcpRuntimeError(params.fallbackCode, params.fallbackMessage, { cause: params.error });
}
/**
* Render an error and its `.cause` chain as a single human-readable line for
* logs, lifecycle events, and tool results. Format is
* `Name [code]: message <- Name [code]: message <- ...`. Number codes also
* appear, so JSON-RPC error codes like `-32603` survive into surfaces that
* downstream consumers see (gateway logs, telegram replies, tool_result text).
*
* Depth is capped to defend against self-referential `.cause` cycles.
*/
function formatAcpErrorChain(error) {
	if (!(error instanceof Error)) return redactSensitiveText(String(error));
	const segments = [renderSingleError(error)];
	let current = error.cause;
	let depth = 0;
	while (current !== void 0 && current !== null && depth < 8) {
		if (current instanceof Error) {
			segments.push(renderSingleError(current));
			current = current.cause;
		} else {
			segments.push(stringifyNonErrorCause(current));
			current = void 0;
		}
		depth += 1;
	}
	return redactSensitiveText(segments.join(" <- "));
}
function renderSingleError(error) {
	const codeValue = error.code;
	const codeSuffix = typeof codeValue === "string" || typeof codeValue === "number" ? ` [${codeValue}]` : "";
	return `${error.name}${codeSuffix}: ${error.message}`;
}
/** Wraps async runtime work and rethrows failures as ACP runtime errors. */
async function withAcpRuntimeErrorBoundary(params) {
	try {
		return await params.run();
	} catch (error) {
		throw toAcpRuntimeError({
			error,
			fallbackCode: params.fallbackCode,
			fallbackMessage: params.fallbackMessage
		});
	}
}
//#endregion
export { findStructuredAuthParamRanges as _, toAcpRuntimeError as a, redactSensitiveText as c, HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN as d, HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN as f, HTTP_AUTH_SERIALIZED_QUOTE_PATTERN as g, HTTP_AUTH_SCHEME_PATTERN as h, isAcpRuntimeError as i, CREDENTIAL_STYLE_HEADER_REDACT_PATTERN as l, HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN as m, AcpRuntimeError as n, withAcpRuntimeErrorBoundary as o, HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN as p, formatAcpErrorChain as r, configureAcpErrorRedactor as s, ACP_ERROR_CODES as t, HTTP_AUTH_HEADER_BOUNDARY_PATTERN as u, redactStructuredAuthHeaders as v };
