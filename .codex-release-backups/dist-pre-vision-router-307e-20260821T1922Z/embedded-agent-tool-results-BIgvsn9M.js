import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { a as redactSensitiveFieldValue, i as redactSecrets, u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import { n as estimateBase64DecodedBytes } from "./base64-KcXAb-1x.js";
import { a as readToolResultDetails, n as isToolResultError, o as readToolResultStatus } from "./tool-result-error-BPVRZjCB.js";
//#region src/agents/content-blocks.ts
/** Collects text block payloads from provider-style structured content arrays. */
function collectTextContentBlocks(content) {
	if (!Array.isArray(content)) return [];
	const parts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const rec = block;
		if (rec.type === "text" && typeof rec.text === "string") parts.push(rec.text);
	}
	return parts;
}
//#endregion
//#region src/agents/embedded-agent-tool-results.ts
/** Sanitizes, extracts, and classifies embedded-agent tool execution results. */
const TOOL_RESULT_MAX_CHARS = 8e3;
const TOOL_ERROR_MAX_CHARS = 400;
const LIVE_EXEC_OUTPUT_MAX_CHARS = 8e3;
const TOOL_DENIAL_ERROR_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
const OPAQUE_STRUCTURED_RESULT_FIELDS = /* @__PURE__ */ new Set(["encrypted_content", "encrypted_stdout"]);
const SENSITIVE_STRUCTURED_HEADER_FIELDS = /* @__PURE__ */ new Set([
	"authorization",
	"proxy-authorization",
	"cookie",
	"set-cookie",
	"x-api-key",
	"x-auth-token"
]);
function truncateToolText(text) {
	if (text.length <= TOOL_RESULT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, TOOL_RESULT_MAX_CHARS)}\n…(truncated)…`;
}
function truncateLiveExecOutput(text) {
	if (text.length <= LIVE_EXEC_OUTPUT_MAX_CHARS) return text;
	return `${truncateUtf16Safe(text, LIVE_EXEC_OUTPUT_MAX_CHARS)}\n...(live output truncated)...`;
}
function capLiveExecResult(result) {
	const details = readToolResultDetails(result);
	if (!details || typeof details.status !== "string" || typeof details.aggregated !== "string") return result;
	const aggregated = truncateLiveExecOutput(details.aggregated);
	if (aggregated === details.aggregated) return result;
	if (!result || typeof result !== "object" || Array.isArray(result)) return result;
	return {
		...result,
		details: {
			...details,
			aggregated
		}
	};
}
function normalizeToolErrorText(text) {
	const trimmed = text.trim();
	if (!trimmed) return;
	const firstLine = trimmed.split(/\r?\n/)[0]?.trim() ?? "";
	if (!firstLine) return;
	return firstLine.length > TOOL_ERROR_MAX_CHARS ? `${truncateUtf16Safe(firstLine, TOOL_ERROR_MAX_CHARS)}…` : firstLine;
}
function isErrorLikeStatus(status) {
	const normalized = normalizeOptionalLowercaseString(status);
	if (!normalized) return false;
	if (normalized === "0" || normalized === "ok" || normalized === "success" || normalized === "completed" || normalized === "running") return false;
	return /error|fail|timeout|timed[_\s-]?out|denied|cancel|invalid|forbidden/.test(normalized);
}
function readErrorCandidate(value) {
	if (typeof value === "string") return normalizeToolErrorText(value);
	if (!value || typeof value !== "object") return;
	const record = value;
	if (typeof record.message === "string") return normalizeToolErrorText(record.message);
	if (typeof record.error === "string") return normalizeToolErrorText(record.error);
}
function extractErrorField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const direct = extractDirectErrorField(record);
	if (direct) return direct;
	const status = normalizeOptionalString(record.status) ?? "";
	if (!status || !isErrorLikeStatus(status)) return;
	return normalizeToolErrorText(status);
}
function extractDirectErrorField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readErrorCandidate(record.error) ?? readErrorCandidate(record.message) ?? readErrorCandidate(record.reason);
}
function readErrorCodeField(value) {
	return typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function readDenialErrorCodeFromMessage(value) {
	const message = typeof value === "string" ? normalizeOptionalString(value) : void 0;
	if (!message) return;
	for (const code of TOOL_DENIAL_ERROR_CODES) if (message === code || message.startsWith(`${code}:`)) return code;
}
function readNestedErrorCodeField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readDenialErrorCodeFromMessage(record.message) ?? readDenialErrorCodeFromMessage(record.error) ?? readErrorCodeField(record.code) ?? readErrorCodeField(record.gatewayCode);
}
function extractDirectErrorCodeField(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return readNestedErrorCodeField(record.error) ?? readNestedErrorCodeField(record.nodeError) ?? readErrorCodeField(record.code) ?? readErrorCodeField(record.gatewayCode);
}
function buildToolLifecycleErrorResult(error) {
	const errorRecord = asOptionalRecord(error);
	const nodeError = asOptionalRecord(asOptionalRecord(errorRecord?.details)?.nodeError);
	const gatewayCode = readErrorCodeField(errorRecord?.gatewayCode) ?? readErrorCodeField(errorRecord?.code);
	return { details: {
		status: "error",
		error: error instanceof Error ? error.message : String(error),
		...gatewayCode ? { gatewayCode } : {},
		...nodeError ? { nodeError } : {}
	} };
}
function extractAggregatedErrorField(value) {
	if (!value || typeof value !== "object") return;
	return readErrorCandidate(value.aggregated);
}
function redactStringsDeep(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") return redactToolPayloadText(value);
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		return value.map((item) => redactStringsDeep(item, seen));
	}
	if (value && typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = {};
		for (const [key, child] of Object.entries(value)) out[key] = typeof child === "string" ? redactSensitiveFieldValue(key, child) : redactStringsDeep(child, seen);
		return out;
	}
	return value;
}
function sanitizeToolArgs(args) {
	return redactStringsDeep(args);
}
function sanitizeToolResult(result) {
	if (typeof result === "string") return redactToolPayloadText(result);
	if (Array.isArray(result)) return redactSecrets(result);
	if (!result || typeof result !== "object") return result;
	const record = result;
	const preCleaned = { ...record };
	const originalContent = Array.isArray(record.content) ? record.content : null;
	if (originalContent) preCleaned.content = originalContent.map((item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (readStringValue(entry.type) === "image") {
			const data = readStringValue(entry.data);
			const existingBytes = typeof entry.bytes === "number" ? entry.bytes : void 0;
			const bytes = data === void 0 ? existingBytes : estimateBase64DecodedBytes(data);
			const cleaned = { ...entry };
			delete cleaned.data;
			return Object.assign({}, cleaned, {
				bytes,
				omitted: true
			});
		}
		return entry;
	});
	const baseline = redactSecrets(preCleaned);
	const out = { ...baseline };
	const content = Array.isArray(baseline.content) ? baseline.content : null;
	if (content) out.content = content.map((item) => {
		if (!item || typeof item !== "object") return item;
		const entry = item;
		if (readStringValue(entry.type) === "text" && typeof entry.text === "string") return Object.assign({}, entry, { text: truncateToolText(entry.text) });
		return entry;
	});
	return out;
}
const INLINE_DATA_URI_VALUE_PATTERN = /^data:(?:[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+)?(?:;[a-z0-9.+-]+(?:=[^,;"'\s]+)?)*,/i;
function redactInlineDataUriValue(value) {
	const trimmed = value.trimStart();
	if (!INLINE_DATA_URI_VALUE_PATTERN.test(trimmed)) return value;
	return `[inline data URI: ${value.length} chars]`;
}
function carriesBinaryData(record) {
	const type = normalizeOptionalLowercaseString(record.type);
	if (type === "audio" || type === "image" || type === "base64") return true;
	const mediaType = normalizeOptionalLowercaseString(record.media_type ?? record.mimeType);
	return mediaType?.startsWith("image/") === true || mediaType?.startsWith("audio/") === true || mediaType?.startsWith("video/") === true || mediaType === "application/pdf";
}
function sanitizeStructuredToolResultValue(value, key = "", parentCarriesBinaryData = false, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") {
		if (SENSITIVE_STRUCTURED_HEADER_FIELDS.has(key.toLowerCase())) return "***";
		if (key === "blob" || key === "data" && parentCarriesBinaryData) return `[binary omitted: ${value.length} chars]`;
		if (OPAQUE_STRUCTURED_RESULT_FIELDS.has(key)) return `[opaque data omitted: ${value.length} chars]`;
		return truncateToolText(redactInlineDataUriValue(redactSensitiveFieldValue(key, value)));
	}
	if (typeof value === "bigint") return value.toString();
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	seen.add(value);
	if (Array.isArray(value)) return value.map((item) => sanitizeStructuredToolResultValue(item, key, parentCarriesBinaryData, seen));
	const record = value;
	const hasBinaryData = carriesBinaryData(record);
	return Object.fromEntries(Object.entries(record).map(([childKey, child]) => [childKey, sanitizeStructuredToolResultValue(child, childKey, hasBinaryData, seen)]));
}
function stringifyStructuredToolResultContent(block) {
	if (!block || typeof block !== "object") return;
	const record = block;
	const type = readStringValue(record.type);
	if (type === "text" || type === "image" || type === "image_url" || type === "audio") return;
	try {
		const serialized = JSON.stringify(sanitizeStructuredToolResultValue(record));
		const redacted = serialized ? redactToolPayloadText(serialized) : serialized;
		return redacted && redacted !== "{}" ? redacted : void 0;
	} catch {
		return;
	}
}
function resolveToolResultContentBlocks(result) {
	if (Array.isArray(result)) return result;
	const record = result;
	if (readStringValue(record.type)) return [record];
	if (Array.isArray(record.content)) return record.content;
	if (record.content && typeof record.content === "object") return [record.content];
	return [record];
}
function extractToolResultText(result) {
	if (typeof result === "string") {
		const trimmed = redactToolPayloadText(redactInlineDataUriValue(result)).trim();
		return trimmed ? truncateToolText(trimmed) : void 0;
	}
	if (!result || typeof result !== "object") return;
	const content = resolveToolResultContentBlocks(result);
	const texts = collectTextContentBlocks(content).map((item) => {
		const trimmed = item.trim();
		return trimmed ? trimmed : void 0;
	}).filter((value) => Boolean(value));
	if (texts.length > 0) return truncateToolText(texts.join("\n"));
	const structuredTexts = [];
	for (const item of content) {
		const structured = stringifyStructuredToolResultContent(item);
		if (structured) structuredTexts.push(structured);
	}
	if (structuredTexts.length === 0) return;
	return truncateToolText(structuredTexts.join("\n"));
}
function extractToolErrorCode(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	return extractDirectErrorCodeField(record.details) ?? extractDirectErrorCodeField(record);
}
function isToolResultTimedOut(result) {
	if (readToolResultStatus(result) === "timeout") return true;
	return readToolResultDetails(result)?.timedOut === true;
}
function extractToolErrorMessage(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const fromDetails = extractDirectErrorField(record.details);
	if (fromDetails) return fromDetails;
	const fromDetailsAggregated = extractAggregatedErrorField(record.details);
	if (fromDetailsAggregated) return fromDetailsAggregated;
	const fromRoot = extractDirectErrorField(record);
	if (fromRoot) return fromRoot;
	const text = extractToolResultText(result);
	if (text) try {
		const fromJson = extractErrorField(JSON.parse(text));
		if (fromJson) return fromJson;
	} catch {}
	const fromDetailsStatus = extractErrorField(record.details);
	if (fromDetailsStatus) return fromDetailsStatus;
	const fromRootStatus = extractErrorField(record);
	if (fromRootStatus) return fromRootStatus;
	if (readToolResultStatus(result) && !isToolResultError(result)) return;
	return text ? normalizeToolErrorText(text) : void 0;
}
//#endregion
export { extractToolResultText as a, sanitizeToolResult as c, extractToolErrorMessage as i, truncateLiveExecOutput as l, capLiveExecResult as n, isToolResultTimedOut as o, extractToolErrorCode as r, sanitizeToolArgs as s, buildToolLifecycleErrorResult as t, collectTextContentBlocks as u };
