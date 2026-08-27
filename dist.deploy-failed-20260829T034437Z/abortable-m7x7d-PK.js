import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./errors-Ccx0R-_Z.js";
//#region src/agents/embedded-agent-runner/run/abortable.ts
/**
* AbortSignal-aware promise racing helper for embedded-agent attempts.
*/
function getAbortReason(signal) {
	return "reason" in signal ? signal.reason : void 0;
}
/** Marks AbortErrors produced by abortable() so provider aborts stay retryable. */
const OPENCLAW_ABORTABLE_WRAPPER = Symbol.for("openclaw.abortable.wrapper");
function isOpenClawAbortableWrapper(err) {
	return err !== null && typeof err === "object" && OPENCLAW_ABORTABLE_WRAPPER in err;
}
function tagAsAbortableWrapper(err) {
	err[OPENCLAW_ABORTABLE_WRAPPER] = true;
	return err;
}
function makeAbortError(signal) {
	const reason = getAbortReason(signal);
	if (reason instanceof Error) {
		const err = new Error(reason.message, { cause: reason });
		err.name = "AbortError";
		return tagAsAbortableWrapper(err);
	}
	const err = reason ? new Error("aborted", { cause: reason }) : /* @__PURE__ */ new Error("aborted");
	err.name = "AbortError";
	return tagAsAbortableWrapper(err);
}
const RUN_LIVENESS_JOIN_TIMEOUT_MS = 12e4;
/**
* Awaits post-turn work that must never dead-end the run: races the joined
* promise against the run-abort signal and a liveness deadline. Timeout and
* abort RESOLVE (timeout after `onTimeout`) instead of rejecting so settlement
* still produces a visible terminal outcome; rejections also resolve because
* the joined chains own their error logging.
*/
function joinWithRunLivenessDeadline(input) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (reason) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			input.runAbortSignal?.removeEventListener("abort", onAbort);
			if (reason === "timeout") input.onTimeout();
			resolve();
		};
		const onAbort = () => finish("abort");
		const timer = setTimeout(() => finish("timeout"), input.timeoutMs ?? 12e4);
		timer.unref?.();
		if (input.runAbortSignal?.aborted) {
			finish("abort");
			return;
		}
		input.runAbortSignal?.addEventListener("abort", onAbort, { once: true });
		Promise.resolve().then(() => input.joinWork()).then(() => finish("settled"), () => finish("settled"));
	});
}
/**
* Races a promise against an AbortSignal while preserving normal promise
* settlement. Abort wins immediately and rejected non-Error payloads are
* normalized so callers can safely log/inspect them as Error objects.
*/
function abortable(signal, promise) {
	if (signal.aborted) return Promise.reject(makeAbortError(signal));
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			reject(makeAbortError(signal));
		};
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (err) => {
			signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(err, "Non-Error rejection"));
		});
	});
}
//#endregion
export { joinWithRunLivenessDeadline as i, abortable as n, isOpenClawAbortableWrapper as r, RUN_LIVENESS_JOIN_TIMEOUT_MS as t };
