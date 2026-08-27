//#region src/agents/harness/transcript-visibility.ts
/**
* Keep internal memory-maintenance turns in the audit/model transcript without
* projecting them into user-facing chat history.
*/
function projectAgentHarnessTranscriptMessageForDisplay(params) {
	if (!params.hidden) return params.message;
	if (Reflect.get(params.message, "display") === false) return params.message;
	return Object.assign({}, params.message, { display: false });
}
//#endregion
export { projectAgentHarnessTranscriptMessageForDisplay as t };
