import { c as normalizeToolPolicyName } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
//#region src/agents/cli-runner/tool-policy.ts
/** Transport prefix CLI harnesses use for loopback OpenClaw MCP tool names. */
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
/** Strips the loopback MCP transport prefix so observers see gateway tool names. */
function stripOpenClawMcpToolPrefix(toolName) {
	return toolName.startsWith(OPENCLAW_MCP_TOOL_PREFIX) ? toolName.slice(15) : toolName;
}
/** Keeps only explicit runtime caps for backend-owned exact translation. */
function resolveCliRuntimeToolsAllow(toolsAllow, _toolsAllowIsDefault) {
	if (toolsAllow === void 0) return;
	return toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { stripOpenClawMcpToolPrefix as n, resolveCliRuntimeToolsAllow as t };
