import { n as extractAssistantTextForPhase } from "./chat-message-content-BibNiFIq.js";
import { i as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-BMBDlrGB.js";
import { r as sanitizeUserFacingText, t as renderUserFacingText } from "./user-facing-text-BAcix5i_.js";
//#region src/agents/tools/chat-history-text.ts
/**
* Chat-history text helpers for session tools.
*
* Removes tool messages and extracts sanitized assistant-visible text from stored messages.
*/
function stripToolMessages(messages) {
	return messages.filter((msg) => {
		if (!msg || typeof msg !== "object") return true;
		const role = msg.role;
		return role !== "toolResult" && role !== "tool";
	});
}
/**
* Sanitize text content to strip tool call markers and thinking tags.
* This ensures user-facing text doesn't leak internal tool representations.
*/
function sanitizeTextContent(text) {
	return sanitizeAssistantVisibleTextWithProfile(text, "history");
}
function extractStoredAssistantText(message) {
	if (!message || typeof message !== "object") return;
	if (message.role !== "assistant") return;
	const joined = extractAssistantTextForPhase(message, {
		phase: "final_answer",
		sanitizeText: sanitizeTextContent,
		joinWith: ""
	}) ?? extractAssistantTextForPhase(message, {
		sanitizeText: sanitizeTextContent,
		joinWith: ""
	});
	const errorContext = message.stopReason === "error";
	return joined ? errorContext ? renderUserFacingText(joined, { errorContext: true }) : sanitizeUserFacingText(joined) : void 0;
}
//#endregion
export { stripToolMessages as n, extractStoredAssistantText as t };
