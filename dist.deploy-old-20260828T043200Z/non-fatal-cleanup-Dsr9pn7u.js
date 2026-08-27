//#region src/infra/non-fatal-cleanup.ts
/** Run cleanup and swallow failures after invoking the optional error hook. */
async function runBestEffortCleanup(params) {
	try {
		return await params.cleanup();
	} catch (error) {
		params.onError?.(error);
		return;
	}
}
//#endregion
export { runBestEffortCleanup as t };
