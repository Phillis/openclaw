import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import "./errors-Ccx0R-_Z.js";
//#region src/node-host/with-timeout.ts
/** Timeout wrapper for node-host operations using AbortSignal cancellation. */
/**
* AbortSignal-based timeout wrapper for node-host operations.
*
* The wrapper races work against an abort promise, clears timers/listeners on
* completion, and preserves object-shaped abort reasons as Error properties.
*/
/** Run work with an optional timeout and AbortSignal. */
async function runAbortableTimeout(work, timeoutMs, label) {
	const resolved = timeoutMs === void 0 ? void 0 : resolveTimerTimeoutMs(timeoutMs, 1);
	if (!resolved) return await work(void 0);
	const abortCtrl = new AbortController();
	const timeoutError = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => abortCtrl.abort(timeoutError), resolved);
	timer.unref?.();
	let abortListener;
	const abortPromise = abortCtrl.signal.aborted ? Promise.reject(toErrorObject(abortCtrl.signal.reason ?? timeoutError, "Non-Error rejection")) : new Promise((_, reject) => {
		abortListener = () => reject(toErrorObject(abortCtrl.signal.reason ?? timeoutError, "Non-Error rejection"));
		abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
	});
	try {
		return await Promise.race([work(abortCtrl.signal), abortPromise]);
	} finally {
		clearTimeout(timer);
		if (abortListener) abortCtrl.signal.removeEventListener("abort", abortListener);
	}
}
//#endregion
export { runAbortableTimeout as t };
