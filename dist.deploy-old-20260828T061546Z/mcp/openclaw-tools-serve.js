import { r as formatErrorMessage } from "../errors-Ccx0R-_Z.js";
import { n as getRuntimeConfig } from "../io-ClLVsBMp.js";
import { t as AUTOMATIONS_TOOL_NAME } from "../automations-tool-name-DBMZPbPL.js";
import "../config-B_0xOnKq.js";
import { t as createCronTool } from "../cron-tool-BKL0bIUI.js";
import { i as resolveToolsMcpAgentSessionKey, n as createToolsMcpServer, r as OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-Cnd-sfdK.js";
import { t as createSystemAgentTool } from "../system-agent-tool-CN_Xri-2.js";
import { c as resolveOpenClawToolsMcpToolSelection, i as OPENCLAW_TOOLS_MCP_TOOLS_ENV, o as resolveOpenClawToolsMcpSystemAgentApproval, r as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, s as resolveOpenClawToolsMcpSystemAgentSurface } from "../openclaw-tools-serve-config-CPi0gqnN.js";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/openclaw-tools-serve.ts
/**
* Standalone MCP server for selected built-in OpenClaw tools.
*
* Run via: node --import tsx src/mcp/openclaw-tools-serve.ts
* Or: bun src/mcp/openclaw-tools-serve.ts
*/
function resolveOpenClawToolsMcpAgentSessionKey(env = process.env) {
	return resolveToolsMcpAgentSessionKey(env);
}
function resolveOpenClawToolsForMcp(params = {}) {
	return (params.tools ?? resolveOpenClawToolsMcpToolSelection()).map((tool) => {
		if (tool === "openclaw") return createSystemAgentTool({
			surface: params.systemAgentSurface ?? resolveOpenClawToolsMcpSystemAgentSurface(),
			...resolveOpenClawToolsMcpSystemAgentApproval()
		});
		const agentSessionKey = (params.agentSessionKey ?? resolveOpenClawToolsMcpAgentSessionKey())?.trim();
		if (!agentSessionKey) throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} is required`);
		return createCronTool({
			agentSessionKey,
			config: params.config ?? getRuntimeConfig(),
			creatorToolAllowlist: [{ name: AUTOMATIONS_TOOL_NAME }]
		});
	});
}
function createOpenClawToolsMcpServer(params = {}) {
	return createToolsMcpServer({
		name: "openclaw-tools",
		tools: params.tools ?? resolveOpenClawToolsForMcp()
	});
}
async function serveOpenClawToolsMcp() {
	await connectToolsMcpServerToStdio(createOpenClawToolsMcpServer());
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) serveOpenClawToolsMcp().catch((err) => {
	process.stderr.write(`openclaw-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_SURFACE_ENV, OPENCLAW_TOOLS_MCP_TOOLS_ENV, resolveOpenClawToolsForMcp, resolveOpenClawToolsMcpAgentSessionKey };
