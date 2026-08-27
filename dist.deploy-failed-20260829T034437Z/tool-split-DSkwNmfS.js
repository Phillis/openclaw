import { a as toToolDefinitions } from "./agent-tool-definition-adapter-DWr4Yi_A.js";
//#region src/agents/embedded-agent-runner/tool-split.ts
/**
* Splits SDK tools from OpenClaw tool definitions for provider calls.
*/
function splitSdkTools(options) {
	const { tools, toolHookContext } = options;
	return { customTools: toToolDefinitions(tools, toolHookContext) };
}
//#endregion
export { splitSdkTools as t };
