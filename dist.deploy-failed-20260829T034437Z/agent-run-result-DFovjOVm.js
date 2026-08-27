import { i as isSilentReplyPayloadText } from "./tokens-DbQz-n_m.js";
import { u as isReplyPayloadTerminalContent } from "./reply-payload-BeeUJOmJ.js";
//#region src/agents/agent-run-result.ts
/** Minimal agent-run result projection shared by setup and diagnostic probes. */
function extractAgentRunText(result) {
	const visibleText = result.meta?.finalAssistantVisibleText?.trim();
	if (visibleText) return isSilentReplyPayloadText(visibleText) ? void 0 : visibleText;
	return result.payloads?.filter((payload) => payload.visible !== false && payload.isError !== true && isReplyPayloadTerminalContent(payload)).map((payload) => payload.text?.trim()).filter((text) => Boolean(text) && !isSilentReplyPayloadText(text)).join("\n") || void 0;
}
function extractAgentRunTerminalError(result) {
	const errorPayload = result.payloads?.find((payload) => payload.isError === true)?.text?.trim();
	const livenessState = result.meta?.livenessState?.trim().toLowerCase();
	if (!errorPayload && !result.meta?.error && livenessState !== "blocked" && livenessState !== "abandoned") return;
	return result.meta?.error?.message?.trim() || errorPayload || (livenessState ? `Inference ended in the ${livenessState} state.` : "Inference failed.");
}
function agentRunHasVisibleReply(result) {
	return Boolean(extractAgentRunText(result));
}
//#endregion
export { extractAgentRunTerminalError as n, extractAgentRunText as r, agentRunHasVisibleReply as t };
