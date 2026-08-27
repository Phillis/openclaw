import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as toStructuredErrorObject } from "./error-coercion-DisD0JTb.js";
//#region src/worker/worker-connection-contract.ts
const FENCED_CLOSE_REASONS = /* @__PURE__ */ new Set(["credential-replaced", "owner-epoch-mismatch"]);
function isFencedCloseReason(reason) {
	return FENCED_CLOSE_REASONS.has(reason);
}
var WorkerConnectionInterruptedError = class extends Error {
	constructor(message = "worker connection interrupted") {
		super(message);
		this.name = "WorkerConnectionInterruptedError";
	}
};
var WorkerConnectionStoppedError = class extends Error {
	constructor(message = "worker connection stopped") {
		super(message);
		this.name = "WorkerConnectionStoppedError";
	}
};
var WorkerAdmissionError = class extends Error {
	constructor(reason, retryable) {
		super(`worker admission rejected: ${reason}`);
		this.reason = reason;
		this.retryable = retryable;
		this.name = "WorkerAdmissionError";
	}
};
var WorkerAdmissionDeadlineExceededError = class extends Error {
	constructor() {
		super("worker admission deadline exceeded");
		this.name = "WorkerAdmissionDeadlineExceededError";
	}
};
var WorkerFencedError = class extends Error {
	constructor(reason) {
		super(`worker fenced: ${reason}`);
		this.reason = reason;
		this.name = "WorkerFencedError";
	}
};
function resolvePositiveTimeout(value, fallback) {
	if (value === void 0) return fallback;
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error("worker connection timeout must be a positive safe integer");
	return value;
}
function toWorkerConnectionError(error) {
	return toStructuredErrorObject(error);
}
function formatWorkerConnectionFailure(endpoint, error) {
	return `worker could not reach gateway ${endpoint.kind === "websocket" ? truncateUtf16Safe(new URL(endpoint.url).host, 128) : truncateUtf16Safe(endpoint.socketPath, 128)}: ${truncateUtf16Safe(toWorkerConnectionError(error).message.replace(/\s+/gu, " ").trim(), 160) || "connection failed"}; ${endpoint.kind === "websocket" ? "check TLS pin/publicUrl configuration" : "check the local gateway socket"}`;
}
//#endregion
export { WorkerFencedError as a, resolvePositiveTimeout as c, WorkerConnectionStoppedError as i, toWorkerConnectionError as l, WorkerAdmissionError as n, formatWorkerConnectionFailure as o, WorkerConnectionInterruptedError as r, isFencedCloseReason as s, WorkerAdmissionDeadlineExceededError as t };
