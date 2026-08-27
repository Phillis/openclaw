//#region src/agents/agent-run-result.ts
function extractAgentRunText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
function extractAgentRunTerminalError(result) {
	const errorPayload = result.payloads?.find((payload) => payload.isError === true)?.text?.trim();
	const livenessState = result.meta?.livenessState?.trim().toLowerCase();
	if (!errorPayload && !result.meta?.error && livenessState !== "blocked" && livenessState !== "abandoned") return;
	return result.meta?.error?.message?.trim() || errorPayload || (livenessState ? `Inference ended in the ${livenessState} state.` : "Inference failed.");
}
function agentRunHasVisibleReply(result) {
	if (result.meta?.finalAssistantVisibleText?.trim()) return true;
	return result.payloads?.some((payload) => payload.isError !== true && payload.isReasoning !== true && Boolean(payload.text?.trim())) === true;
}
//#endregion
export { extractAgentRunTerminalError as n, extractAgentRunText as r, agentRunHasVisibleReply as t };
