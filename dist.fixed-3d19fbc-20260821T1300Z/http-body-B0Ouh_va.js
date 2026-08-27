import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { t as decodeTextPrefix } from "./src-BkwWvwB2.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { clearTimeout as clearTimeout$1, setTimeout as setTimeout$1 } from "node:timers";
//#region src/infra/http-response-body-timeout.ts
function createResponseBodyTimeoutError(message) {
	const error = new Error(message);
	error.name = "TimeoutError";
	return error;
}
async function withCancellableTimeout(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		timeoutId = setTimeout(() => {
			timedOut = true;
			const error = params.onTimeout({ timeoutMs });
			clear();
			params.cancel(error).catch(() => void 0);
			reject(error);
		}, timeoutMs);
		if (typeof timeoutId === "object" && "unref" in timeoutId) timeoutId.unref();
		Promise.resolve().then(params.read).then((value) => {
			clear();
			if (!timedOut) resolve(value);
		}, (error) => {
			clear();
			if (!timedOut) reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
/** Reads one chunk, rejecting and cancelling the reader after an idle timeout. */
async function readChunkWithIdleTimeout(reader, chunkTimeoutMs, onIdleTimeout) {
	return await withCancellableTimeout({
		timeoutMs: chunkTimeoutMs,
		onTimeout: ({ timeoutMs }) => onIdleTimeout?.({ chunkTimeoutMs: timeoutMs }) ?? createResponseBodyTimeoutError(`Media download stalled: no data received for ${timeoutMs}ms`),
		cancel: async (error) => await reader.cancel(error),
		read: async () => await reader.read()
	});
}
async function withResponseBodyTimeout(params) {
	if (params.timeoutMs === void 0) return await params.read();
	return await withCancellableTimeout({
		timeoutMs: params.timeoutMs,
		onTimeout: ({ timeoutMs }) => params.onTimeout?.({ timeoutMs }) ?? createResponseBodyTimeoutError(`Response body timed out after ${timeoutMs}ms`),
		cancel: params.cancel,
		read: params.read
	});
}
//#endregion
//#region src/infra/http-body.ts
/** Cancels a response body only when no consumer has started reading it. */
async function cancelUnreadResponseBody(response) {
	if (response && !response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
const DEFAULT_WEBHOOK_MAX_BODY_BYTES = 1024 * 1024;
const DEFAULT_WEBHOOK_BODY_TIMEOUT_MS = 3e4;
const DEFAULT_ERROR_MESSAGE = {
	PAYLOAD_TOO_LARGE: "PayloadTooLarge",
	REQUEST_BODY_TIMEOUT: "RequestBodyTimeout",
	CONNECTION_CLOSED: "RequestBodyConnectionClosed"
};
const DEFAULT_ERROR_STATUS_CODE = {
	PAYLOAD_TOO_LARGE: 413,
	REQUEST_BODY_TIMEOUT: 408,
	CONNECTION_CLOSED: 400
};
const DEFAULT_RESPONSE_MESSAGE = {
	PAYLOAD_TOO_LARGE: "Payload too large",
	REQUEST_BODY_TIMEOUT: "Request body timeout",
	CONNECTION_CLOSED: "Connection closed"
};
var RequestBodyLimitError = class extends Error {
	constructor(init) {
		super(init.message ?? DEFAULT_ERROR_MESSAGE[init.code]);
		this.name = "RequestBodyLimitError";
		this.code = init.code;
		this.statusCode = DEFAULT_ERROR_STATUS_CODE[init.code];
	}
};
function isRequestBodyLimitError(error, code) {
	if (!(error instanceof RequestBodyLimitError)) return false;
	if (!code) return true;
	return error.code === code;
}
function requestBodyErrorToText(code) {
	return DEFAULT_RESPONSE_MESSAGE[code];
}
function parseContentLengthHeader(req) {
	const header = req.headers["content-length"];
	const raw = Array.isArray(header) ? header[0] : header;
	if (typeof raw !== "string") return null;
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed === void 0) return null;
	return parsed;
}
function resolveRequestBodyLimitValues(options) {
	return {
		maxBytes: Number.isFinite(options.maxBytes) ? Math.max(1, Math.floor(options.maxBytes)) : 1,
		timeoutMs: options.timeoutMs === void 0 ? DEFAULT_WEBHOOK_BODY_TIMEOUT_MS : resolveTimerTimeoutMs(options.timeoutMs, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS)
	};
}
const testApi = { resolveRequestBodyLimitValues };
function advanceRequestBodyChunk(chunk, totalBytes, maxBytes) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	const nextTotalBytes = totalBytes + buffer.length;
	return {
		buffer,
		totalBytes: nextTotalBytes,
		exceeded: nextTotalBytes > maxBytes
	};
}
function validateMaxBytes(maxBytes) {
	if (!Number.isFinite(maxBytes) || maxBytes < 0) throw new RangeError(`maxBytes must be a non-negative finite number: ${maxBytes}`);
}
async function readResponsePrefixFromReader(reader, maxBytes, options) {
	const chunks = [];
	let total = 0;
	let size = 0;
	let truncated = false;
	try {
		while (true) {
			const { done, value } = options?.chunkTimeoutMs ? await readChunkWithIdleTimeout(reader, options.chunkTimeoutMs, options.onIdleTimeout) : await reader.read();
			if (done) {
				size = total;
				break;
			}
			if (!value?.length) continue;
			const nextTotal = total + value.length;
			if (nextTotal > maxBytes || options?.stopAtLimit && nextTotal === maxBytes) {
				const remaining = maxBytes - total;
				if (remaining > 0) {
					chunks.push(value.subarray(0, remaining));
					total += remaining;
				}
				size = nextTotal;
				truncated = true;
				try {
					await reader.cancel();
				} catch {}
				break;
			}
			chunks.push(value);
			total = nextTotal;
			size = total;
		}
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return {
		buffer: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total),
		size,
		truncated
	};
}
async function readResponsePrefix(response, maxBytes, options) {
	validateMaxBytes(maxBytes);
	let timeoutMs;
	try {
		timeoutMs = typeof options?.timeoutMs === "function" ? options.timeoutMs() : options?.timeoutMs;
	} catch (error) {
		await response.body?.cancel(error).catch(() => void 0);
		throw error;
	}
	const body = response.body;
	if (!body || typeof body.getReader !== "function") return await withResponseBodyTimeout({
		timeoutMs,
		onTimeout: options?.onTimeout,
		cancel: async (error) => await body?.cancel(error),
		read: async () => {
			const fallback = Buffer.from(await response.arrayBuffer());
			if (fallback.length > maxBytes) return {
				buffer: fallback.subarray(0, maxBytes),
				size: fallback.length,
				truncated: true
			};
			return {
				buffer: fallback,
				size: fallback.length,
				truncated: false
			};
		}
	});
	const reader = body.getReader();
	return await withResponseBodyTimeout({
		timeoutMs,
		onTimeout: options?.onTimeout,
		cancel: async (error) => await reader.cancel(error),
		read: async () => await readResponsePrefixFromReader(reader, maxBytes, options)
	});
}
/** Reads and decodes a bounded text prefix while cancelling unread overflow. */
async function readResponseTextPrefix(response, maxBytes, options) {
	const prefix = await readResponsePrefix(response, maxBytes, {
		...options,
		stopAtLimit: true
	});
	return {
		text: decodeTextPrefix(prefix.buffer, { truncated: prefix.truncated }),
		size: prefix.size,
		truncated: prefix.truncated
	};
}
/** Reads a response body under byte, idle, and overall timeout bounds. */
async function readResponseWithLimit(response, maxBytes, options) {
	const onOverflow = options?.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
	const prefix = await readResponsePrefix(response, maxBytes, {
		chunkTimeoutMs: options?.chunkTimeoutMs,
		onIdleTimeout: options?.onIdleTimeout,
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	});
	if (prefix.truncated) throw onOverflow({
		size: prefix.size,
		maxBytes,
		res: response
	});
	return prefix.buffer;
}
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
async function readResponseTextSnippet(response, options) {
	const maxBytes = options?.maxBytes ?? 8 * 1024;
	const maxChars = options?.maxChars ?? 200;
	const prefix = await readResponseTextPrefix(response, maxBytes, {
		chunkTimeoutMs: options?.chunkTimeoutMs,
		onIdleTimeout: options?.onIdleTimeout,
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	});
	if (!prefix.text) return;
	const collapsed = prefix.text.replace(/\s+/g, " ").trim();
	if (!collapsed) return;
	if (collapsed.length > maxChars) return `${truncateUtf16Safe(collapsed, maxChars)}…`;
	return prefix.truncated ? `${collapsed}…` : collapsed;
}
async function readRequestBodyWithLimit(req, options) {
	const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
	const encoding = options.encoding ?? "utf-8";
	const declaredLength = parseContentLengthHeader(req);
	if (declaredLength !== null && declaredLength > maxBytes) {
		const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
		if (!req.destroyed) req.destroy();
		throw error;
	}
	return await new Promise((resolve, reject) => {
		let done = false;
		let ended = false;
		let totalBytes = 0;
		const chunks = [];
		const cleanup = () => {
			req.removeListener("data", onData);
			req.removeListener("end", onEnd);
			req.removeListener("error", onError);
			req.removeListener("close", onClose);
			clearTimeout$1(timer);
		};
		const finish = (cb) => {
			if (done) return;
			done = true;
			cleanup();
			cb();
		};
		const fail = (error) => {
			finish(() => reject(error));
		};
		const timer = setTimeout$1(() => {
			const error = new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" });
			if (!req.destroyed) req.destroy();
			fail(error);
		}, timeoutMs);
		const onData = (chunk) => {
			if (done) return;
			const progress = advanceRequestBodyChunk(chunk, totalBytes, maxBytes);
			totalBytes = progress.totalBytes;
			if (progress.exceeded) {
				const error = new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" });
				if (!req.destroyed) req.destroy();
				fail(error);
				return;
			}
			chunks.push(progress.buffer);
		};
		const onEnd = () => {
			ended = true;
			finish(() => resolve(Buffer.concat(chunks).toString(encoding)));
		};
		const onError = (error) => {
			if (done) return;
			fail(error);
		};
		const onClose = () => {
			if (done || ended) return;
			fail(new RequestBodyLimitError({ code: "CONNECTION_CLOSED" }));
		};
		req.on("data", onData);
		req.on("end", onEnd);
		req.on("error", onError);
		req.on("close", onClose);
	});
}
async function readJsonBodyWithLimit(req, options) {
	try {
		const trimmed = (await readRequestBodyWithLimit(req, options)).trim();
		if (!trimmed) {
			if (options.emptyObjectOnEmpty === false) return {
				ok: false,
				code: "INVALID_JSON",
				error: "empty payload"
			};
			return {
				ok: true,
				value: {}
			};
		}
		try {
			return {
				ok: true,
				value: JSON.parse(trimmed)
			};
		} catch (error) {
			return {
				ok: false,
				code: "INVALID_JSON",
				error: formatErrorMessage(error)
			};
		}
	} catch (error) {
		if (isRequestBodyLimitError(error)) return {
			ok: false,
			code: error.code,
			error: requestBodyErrorToText(error.code)
		};
		return {
			ok: false,
			code: "INVALID_JSON",
			error: formatErrorMessage(error)
		};
	}
}
function installRequestBodyLimitGuard(req, res, options) {
	const { maxBytes, timeoutMs } = resolveRequestBodyLimitValues(options);
	const responseFormat = options.responseFormat ?? "json";
	const customText = options.responseText ?? {};
	let tripped = false;
	let reason = null;
	let done = false;
	let ended = false;
	let totalBytes = 0;
	const cleanup = () => {
		req.removeListener("data", onData);
		req.removeListener("end", onEnd);
		req.removeListener("close", onClose);
		req.removeListener("error", onError);
		clearTimeout$1(timer);
	};
	const finish = () => {
		if (done) return;
		done = true;
		cleanup();
	};
	const respond = (error) => {
		const text = customText[error.code] ?? requestBodyErrorToText(error.code);
		if (!res.headersSent) {
			res.statusCode = error.statusCode;
			if (responseFormat === "text") {
				res.setHeader("Content-Type", "text/plain; charset=utf-8");
				res.end(text);
			} else {
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({ error: text }));
			}
		}
	};
	const trip = (error) => {
		if (tripped) return;
		tripped = true;
		reason = error.code;
		finish();
		respond(error);
		if (!req.destroyed) req.destroy();
	};
	const onData = (chunk) => {
		if (done) return;
		const progress = advanceRequestBodyChunk(chunk, totalBytes, maxBytes);
		totalBytes = progress.totalBytes;
		if (progress.exceeded) trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
	};
	const onEnd = () => {
		ended = true;
		finish();
	};
	const onClose = () => {
		if (done || ended) return;
		finish();
	};
	const onError = () => {
		finish();
	};
	const timer = setTimeout$1(() => {
		trip(new RequestBodyLimitError({ code: "REQUEST_BODY_TIMEOUT" }));
	}, timeoutMs);
	req.on("data", onData);
	req.on("end", onEnd);
	req.on("close", onClose);
	req.on("error", onError);
	const declaredLength = parseContentLengthHeader(req);
	if (declaredLength !== null && declaredLength > maxBytes) trip(new RequestBodyLimitError({ code: "PAYLOAD_TOO_LARGE" }));
	return {
		dispose: finish,
		isTripped: () => tripped,
		code: () => reason
	};
}
//#endregion
export { installRequestBodyLimitGuard as a, readRequestBodyWithLimit as c, readResponseWithLimit as d, requestBodyErrorToText as f, cancelUnreadResponseBody as i, readResponseTextPrefix as l, readChunkWithIdleTimeout as m, DEFAULT_WEBHOOK_MAX_BODY_BYTES as n, isRequestBodyLimitError as o, testApi as p, RequestBodyLimitError as r, readJsonBodyWithLimit as s, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS as t, readResponseTextSnippet as u };
