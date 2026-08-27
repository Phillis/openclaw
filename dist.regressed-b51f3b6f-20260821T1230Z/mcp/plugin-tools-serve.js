import { r as formatErrorMessage } from "../errors-CSNUPl5U.js";
import { c as parseAgentSessionKey } from "../session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "../io-CeQckj5v.js";
import { a as routeLogsToStderr } from "../console-Dqa67THW.js";
import { a as collectExplicitDenylist, c as mergeAlsoAllowPolicy, i as collectExplicitAllowlist, v as resolveToolProfilePolicy } from "../tool-policy-CWmnHLY1.js";
import { n as pickSandboxToolPolicy } from "../sandbox-tool-policy-Dj2EhvVn.js";
import "../config-Dl8DJbzM.js";
import { a as resolvePluginTools, r as ensureStandalonePluginToolRegistryLoaded } from "../tools-cCwmXcan.js";
import { i as resolveToolsMcpAgentSessionKey, n as createToolsMcpServer, r as OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV, t as connectToolsMcpServerToStdio } from "../tools-stdio-server-D0RDJ0Qz.js";
import { pathToFileURL } from "node:url";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/plugin-tools-serve.ts
/**
* Standalone MCP server that exposes OpenClaw plugin-registered tools
* (e.g. memory-lancedb's memory_recall, memory_store, memory_forget)
* so ACP sessions running Claude Code can use them.
*
* Run via: node --import tsx src/mcp/plugin-tools-serve.ts
* Or: bun src/mcp/plugin-tools-serve.ts
*/
function resolvePluginToolPolicy(config) {
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(config.tools?.profile), config.tools?.alsoAllow);
	const globalPolicy = pickSandboxToolPolicy(config.tools);
	const toolAllowlist = collectExplicitAllowlist([profilePolicy, globalPolicy]);
	const toolDenylist = collectExplicitDenylist([profilePolicy, globalPolicy]);
	return {
		...toolAllowlist.length > 0 ? { toolAllowlist } : {},
		...toolDenylist.length > 0 ? { toolDenylist } : {}
	};
}
function resolvePluginToolsForMcp(params) {
	const agentSessionKey = (params.agentSessionKey ?? resolveToolsMcpAgentSessionKey())?.trim();
	const parsedSession = agentSessionKey ? parseAgentSessionKey(agentSessionKey) : void 0;
	if (agentSessionKey && !parsedSession) throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} must be a canonical agent session key`);
	const context = {
		config: params.config,
		...parsedSession ? {
			agentId: parsedSession.agentId,
			sessionKey: agentSessionKey
		} : {}
	};
	const pluginToolPolicy = resolvePluginToolPolicy(params.config);
	const runtimeRegistry = ensureStandalonePluginToolRegistryLoaded({
		context,
		...pluginToolPolicy
	});
	return resolvePluginTools({
		context,
		...pluginToolPolicy,
		suppressNameConflicts: true,
		runtimeRegistry
	});
}
function createPluginToolsMcpServer(params = {}) {
	const cfg = params.config ?? getRuntimeConfig();
	return createToolsMcpServer({
		name: "openclaw-plugin-tools",
		tools: params.tools ?? resolvePluginToolsForMcp({
			config: cfg,
			agentSessionKey: params.agentSessionKey
		})
	});
}
async function servePluginToolsMcp() {
	routeLogsToStderr();
	const config = getRuntimeConfig();
	const tools = resolvePluginToolsForMcp({ config });
	const server = createPluginToolsMcpServer({
		config,
		tools
	});
	if (tools.length === 0) process.stderr.write("plugin-tools-serve: no plugin tools found\n");
	await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) servePluginToolsMcp().catch((err) => {
	process.stderr.write(`plugin-tools-serve: ${formatErrorMessage(err)}\n`);
	process.exit(1);
});
//#endregion
export { createPluginToolsMcpServer, resolvePluginToolsForMcp, servePluginToolsMcp };
