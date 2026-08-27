import { randomUUID } from "node:crypto";
//#region extensions/anthropic/agent-sdk-runtime-helpers.ts
function splitClaudeToolNames(value) {
	return value.split(",").map((name) => name.trim()).filter(Boolean);
}
function createClaudeAgentSdkUserMessage(context) {
	return {
		type: "user",
		message: {
			role: "user",
			content: context.prompt
		},
		parent_tool_use_id: null,
		uuid: randomUUID(),
		...context.sessionId ? { session_id: context.sessionId } : {}
	};
}
//#endregion
export { splitClaudeToolNames as n, createClaudeAgentSdkUserMessage as t };
