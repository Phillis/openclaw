import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
//#region src/agents/code-mode-json.ts
function toCodeModeJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return {
			name: value.name,
			message: value.message
		};
		if (value === null) return null;
		switch (typeof value) {
			case "string":
			case "number":
			case "boolean": return value;
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
const TRUNCATION_GUIDANCE = "Output truncated; rerun with narrower args.";
function truncationMarker(serialized, maxBytes) {
	const sourceBytes = Buffer.byteLength(serialized, "utf8");
	let prefix = truncateUtf8Prefix(serialized, maxBytes);
	while (true) {
		const prefixBytes = Buffer.byteLength(prefix, "utf8");
		const candidate = {
			truncated: true,
			omittedBytes: sourceBytes - prefixBytes,
			guidance: TRUNCATION_GUIDANCE,
			prefix
		};
		const overflow = jsonUtf8Bytes(candidate) - maxBytes;
		if (overflow <= 0 || prefixBytes === 0) return candidate;
		prefix = truncateUtf8Prefix(prefix, Math.max(0, prefixBytes - overflow));
	}
}
/** Bound one JSON-compatible value, preserving a UTF-8-safe serialized prefix. */
function boundCodeModeValue(value, maxBytes) {
	const safe = toCodeModeJsonSafe(value);
	const serialized = JSON.stringify(safe) ?? "null";
	return Buffer.byteLength(serialized, "utf8") <= maxBytes ? safe : truncationMarker(serialized, maxBytes);
}
function boundOutputArray(output, maxBytes) {
	if (jsonUtf8Bytes(output) <= maxBytes) return output;
	return [truncationMarker(JSON.stringify(output), maxBytes - 2)];
}
/** Bound cumulative guest output and the final value under one serialized byte budget. */
function boundCodeModeResult(params) {
	const hasValue = Object.hasOwn(params, "value");
	const safeOutput = params.output.map(toCodeModeJsonSafe);
	const safeValue = hasValue ? toCodeModeJsonSafe(params.value) : void 0;
	const outputBytes = safeOutput.length > 0 ? jsonUtf8Bytes(safeOutput) : 0;
	const valueBytes = hasValue ? jsonUtf8Bytes(safeValue) : 0;
	if (outputBytes + valueBytes <= params.maxOutputBytes) return {
		output: safeOutput,
		...hasValue ? { value: safeValue } : {},
		truncated: false
	};
	if (safeOutput.length === 0) return {
		output: [],
		...hasValue ? { value: boundCodeModeValue(safeValue, params.maxOutputBytes) } : {},
		truncated: true
	};
	const reservedValueBytes = hasValue ? Math.min(valueBytes, Math.floor(params.maxOutputBytes / 2)) : 0;
	const output = boundOutputArray(safeOutput, params.maxOutputBytes - reservedValueBytes);
	if (!hasValue) return {
		output,
		truncated: true
	};
	return {
		output,
		value: boundCodeModeValue(safeValue, params.maxOutputBytes - jsonUtf8Bytes(output)),
		truncated: true
	};
}
//#endregion
export { boundCodeModeValue as n, toCodeModeJsonSafe as r, boundCodeModeResult as t };
