//#region src/infra/abort-signal.ts
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function isAbortError(error) {
	if (!error || typeof error !== "object") return false;
	if (("name" in error ? String(error.name) : "") === "AbortError") return true;
	return ("message" in error && typeof error.message === "string" ? error.message : "") === "This operation was aborted";
}
function racePromiseWithAbortSignal(promise, signal) {
	if (!signal) return promise;
	const abortError = () => createAbortError("Operation aborted", { cause: signal.reason });
	if (signal.aborted) return Promise.reject(abortError());
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		if (signal.aborted) onAbort();
	});
	return Promise.race([promise, aborted]).finally(() => {
		signal.removeEventListener("abort", onAbort);
	});
}
/** Resolves when the signal aborts, or immediately when no wait is needed. */
async function waitForAbortSignal(signal) {
	if (!signal || signal.aborted) return;
	await new Promise((resolve) => {
		const onAbort = () => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
//#endregion
export { waitForAbortSignal as i, isAbortError as n, racePromiseWithAbortSignal as r, createAbortError as t };
