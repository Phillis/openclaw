import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import "./worker-protocol-primitives-Ch87u2k0.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
//#region src/gateway/worker-environments/worker-session-tool-result.ts
function workerSessionToolErrorResult(error) {
	return jsonResult({
		status: "error",
		error: truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : "Worker session operation failed", { mode: "tools" }), 1024)
	});
}
function responseFrameBytes(resultJson) {
	return Buffer.byteLength(JSON.stringify({
		type: "res",
		id: "x".repeat(128),
		ok: true,
		payload: { resultJson }
	}), "utf8");
}
function serializeWorkerSessionToolResult(result) {
	const resultJson = JSON.stringify(result);
	if (responseFrameBytes(resultJson) > 65536) return JSON.stringify(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session tool result exceeded the limit")));
	return resultJson;
}
//#endregion
export { workerSessionToolErrorResult as n, serializeWorkerSessionToolResult as t };
