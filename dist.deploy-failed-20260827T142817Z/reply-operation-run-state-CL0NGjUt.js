//#region src/auto-reply/reply/reply-operation-run-state.ts
const REPLY_OPERATION_RUN_STATE = Symbol("openclaw.replyOperationRunState");
function resolveReplyOperationRunState(options) {
	return options?.[REPLY_OPERATION_RUN_STATE];
}
function bindQueueDispositionToRunState(run, state) {
	const observe = run.onQueueDisposition;
	run.onQueueDisposition = (disposition) => {
		observe?.(disposition);
		if (state && disposition !== "queue-cap-old") state.admission = {
			status: "skipped",
			reason: "queue-cap"
		};
	};
}
//#endregion
export { bindQueueDispositionToRunState as n, resolveReplyOperationRunState as r, REPLY_OPERATION_RUN_STATE as t };
