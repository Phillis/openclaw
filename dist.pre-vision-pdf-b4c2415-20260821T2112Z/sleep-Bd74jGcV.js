import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
//#region src/utils/sleep.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
function sleep(ms, signal) {
	const delayMs = resolveTimerTimeoutMs(ms, 0, 0);
	if (signal) {
		if (signal.aborted) return Promise.reject(createAbortError("aborted", { cause: signal.reason ?? /* @__PURE__ */ new Error("aborted") }));
		return sleepWithAbort(delayMs, signal);
	}
	return new Promise((resolve) => {
		setTimeout(resolve, delayMs);
	});
}
//#endregion
export { sleep as t };
