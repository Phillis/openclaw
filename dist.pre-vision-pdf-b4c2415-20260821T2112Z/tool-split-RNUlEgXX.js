import { a as toToolDefinitions } from "./agent-tool-definition-adapter-D8y895ku.js";
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
