import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
//#region src/agents/cli-runner/tool-policy.ts
/** Transport prefix CLI harnesses use for loopback OpenClaw MCP tool names. */
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
/** Strips the loopback MCP transport prefix so observers see gateway tool names. */
function stripOpenClawMcpToolPrefix(toolName) {
	return toolName.startsWith(OPENCLAW_MCP_TOOL_PREFIX) ? toolName.slice(15) : toolName;
}
/** Builds the public backend contract plus the shipped beta MCP-name projection. */
function buildCliBackendToolAvailability(availability) {
	return {
		native: availability.native,
		openClaw: availability.openClaw,
		mcp: availability.openClaw.map((toolName) => `${OPENCLAW_MCP_TOOL_PREFIX}${toolName}`)
	};
}
/** Keeps only explicit runtime caps for backend-owned exact translation. */
function resolveCliRuntimeToolsAllow(toolsAllow, _toolsAllowIsDefault) {
	if (toolsAllow === void 0) return;
	return toolsAllow.some((toolName) => normalizeToolPolicyName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { resolveCliRuntimeToolsAllow as n, stripOpenClawMcpToolPrefix as r, buildCliBackendToolAvailability as t };
