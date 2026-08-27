import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
//#region src/gateway/worker-environments/worker-error.ts
function boundedWorkerError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/g, " ").trim() || "unknown error", 1024);
}
//#endregion
export { boundedWorkerError as t };
