import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { f as redactSensitiveText } from "./redact-CWP17HFN.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
//#region src/gateway/worker-environments/worker-error.ts
function boundedWorkerError(error, maxChars = 1024) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/g, " ").trim() || "unknown error", maxChars);
}
//#endregion
export { boundedWorkerError as t };
