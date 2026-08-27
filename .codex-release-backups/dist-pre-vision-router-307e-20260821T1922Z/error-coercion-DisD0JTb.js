//#region packages/normalization-core/src/error-coercion.ts
const STRUCTURED_ERROR_OWNED_FIELDS = /* @__PURE__ */ new Set([
	"cause",
	"message",
	"name",
	"stack"
]);
const STRUCTURED_ERROR_PROTOTYPE_FIELDS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function formatStatusAndCode(value) {
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return;
	try {
		if (Object.keys(value).some((key) => key !== "status" && key !== "code")) return;
	} catch {}
	const statusValue = readProperty(value, "status");
	const codeValue = readProperty(value, "code");
	if (statusValue === void 0 && codeValue === void 0) return;
	return `status=${typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown"} code=${typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown"}`;
}
function stringifyUnknown(value) {
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	try {
		const json = JSON.stringify(value);
		if (json !== void 0) return json;
	} catch {}
	try {
		return Object.prototype.toString.call(value);
	} catch {
		return "Unknown error";
	}
}
/** Formats unknown errors with cause details, structured codes, and secret redaction. */
function formatErrorMessage(value, options) {
	let formatted;
	if (value instanceof Error) {
		formatted = value.message || value.name || "Error";
		let cause = readProperty(value, "cause");
		const seen = /* @__PURE__ */ new Set([value]);
		const seenMessages = /* @__PURE__ */ new Set([formatted]);
		const appendCauseMessage = (message) => {
			if (!message || seenMessages.has(message)) return;
			formatted += ` | ${message}`;
			seenMessages.add(message);
		};
		while (cause && !seen.has(cause)) {
			seen.add(cause);
			if (cause instanceof Error) {
				appendCauseMessage(cause.message);
				const code = readProperty(cause, "code");
				if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
				cause = readProperty(cause, "cause");
			} else if (typeof cause === "string") {
				appendCauseMessage(cause);
				break;
			} else {
				appendCauseMessage(formatStatusAndCode(cause));
				break;
			}
		}
	} else formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
	return options.redact(formatted);
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
/** Preserves structured details while isolating hostile object field access. */
function toStructuredErrorObject(value) {
	if (value instanceof Error) return value;
	const message = String(value);
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return toErrorObject(value, message);
	const error = new Error(message, { cause: value });
	try {
		const detailKeys = Reflect.ownKeys(value).filter((key) => (typeof key !== "string" || !STRUCTURED_ERROR_OWNED_FIELDS.has(key) && !STRUCTURED_ERROR_PROTOTYPE_FIELDS.has(key)) && Reflect.getOwnPropertyDescriptor(value, key)?.enumerable);
		for (const key of detailKeys) try {
			Object.defineProperty(error, key, {
				value: Reflect.get(value, key),
				writable: true,
				enumerable: true,
				configurable: true
			});
		} catch {}
	} catch {}
	return error;
}
/** Preserves Error values and stringifies every other value into a new Error. */
function toStringifiedError(value) {
	return value instanceof Error ? value : new Error(String(value));
}
/** Reads Error messages unchanged and stringifies every other value. */
function coerceErrorMessage(value) {
	return value instanceof Error ? value.message : String(value);
}
/** Renders a non-Error cause as useful text without throwing. */
function stringifyNonErrorCause(value) {
	if (value === null) return "null";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	try {
		return JSON.stringify(value) ?? Object.prototype.toString.call(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
//#endregion
export { toStringifiedError as a, toErrorObject as i, formatErrorMessage as n, toStructuredErrorObject as o, stringifyNonErrorCause as r, coerceErrorMessage as t };
