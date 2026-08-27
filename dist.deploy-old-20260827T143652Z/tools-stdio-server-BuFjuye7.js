import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { a as routeLogsToStderr } from "./console-Dqa67THW.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { r as isAutomationsToolName } from "./automations-tool-name-CYqaxHxr.js";
import { l as rewrapToolWithBeforeToolCallHook, nt as consumeAdjustedParamsForToolCall, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-C_MzhwYQ.js";
import { t as coerceChatContentText } from "./chat-content-BbLAEXko.js";
import { S as isToolWrappedWithBeforeToolCallHook, y as BEFORE_TOOL_CALL_HOOK_CONTEXT } from "./gateway-IJRNg5Ul.js";
import { randomUUID } from "node:crypto";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//#region src/mcp/agent-session-env.ts
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
function resolveToolsMcpAgentSessionKey(env = process.env) {
	return env["OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY"]?.trim() || void 0;
}
//#endregion
//#region src/mcp/plugin-tools-handlers.ts
function toMcpContentBlock(block) {
	if (!isRecord(block)) return {
		type: "text",
		text: coerceChatContentText(block)
	};
	if (block.type !== "image") return block;
	if (typeof block.data === "string" && typeof block.mimeType === "string") return block;
	const source = block.source;
	if (isRecord(source) && source.type === "base64" && typeof source.data === "string" && typeof source.media_type === "string") return {
		type: "image",
		data: source.data,
		mimeType: source.media_type
	};
	return {
		type: "text",
		text: coerceChatContentText(block)
	};
}
function resolveJsonSchemaForTool(tool) {
	const params = tool.parameters;
	if (params && typeof params === "object" && "type" in params) return params;
	return {
		type: "object",
		properties: {}
	};
}
function resolveBeforeToolCallRunId(tool) {
	const context = tool[BEFORE_TOOL_CALL_HOOK_CONTEXT];
	return isRecord(context) && typeof context.runId === "string" ? context.runId : void 0;
}
function createPluginToolsMcpHandlers(tools) {
	const wrappedTools = tools.map((tool) => {
		if (isToolWrappedWithBeforeToolCallHook(tool)) return rewrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
		return wrapToolWithBeforeToolCallHook(tool, void 0, { approvalMode: "report" });
	});
	const toolMap = /* @__PURE__ */ new Map();
	for (const tool of wrappedTools) toolMap.set(tool.name, {
		tool,
		runId: resolveBeforeToolCallRunId(tool)
	});
	return {
		listTools: async () => ({ tools: wrappedTools.map((tool) => ({
			name: tool.name,
			description: tool.description ?? "",
			inputSchema: resolveJsonSchemaForTool(tool)
		})) }),
		callTool: async (params, signal) => {
			const entry = toolMap.get(params.name) ?? (isAutomationsToolName(params.name) ? Array.from(toolMap.entries()).find(([name]) => isAutomationsToolName(name))?.[1] : void 0);
			if (!entry) return {
				content: [{
					type: "text",
					text: `Unknown tool: ${params.name}`
				}],
				isError: true
			};
			const toolCallId = `mcp-${randomUUID()}`;
			try {
				const result = await entry.tool.execute(toolCallId, params.arguments ?? {}, signal);
				const rawContent = result && typeof result === "object" && "content" in result ? result.content : result;
				return { content: Array.isArray(rawContent) ? rawContent.map(toMcpContentBlock) : [{
					type: "text",
					text: coerceChatContentText(rawContent)
				}] };
			} catch (err) {
				return {
					content: [{
						type: "text",
						text: `Tool error: ${formatErrorMessage(err)}`
					}],
					isError: true
				};
			} finally {
				consumeAdjustedParamsForToolCall(toolCallId, entry.runId);
			}
		}
	};
}
//#endregion
//#region src/mcp/tools-stdio-server.ts
function createToolsMcpServer(params) {
	const handlers = createPluginToolsMcpHandlers(params.tools);
	const server = new Server({
		name: params.name,
		version: VERSION
	}, { capabilities: { tools: {} } });
	server.setRequestHandler(ListToolsRequestSchema, handlers.listTools);
	server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
		return await handlers.callTool(request.params, extra.signal);
	});
	return server;
}
async function connectToolsMcpServerToStdio(server, options = {}) {
	routeLogsToStderr();
	const transport = new StdioServerTransport();
	let shuttingDown = false;
	let resolveShutdown;
	const shutdownComplete = new Promise((resolve) => {
		resolveShutdown = resolve;
	});
	const shutdown = () => {
		if (shuttingDown) return;
		shuttingDown = true;
		process.stdin.off("end", shutdown);
		process.stdin.off("close", shutdown);
		process.off("SIGINT", shutdown);
		process.off("SIGTERM", shutdown);
		(async () => {
			let shutdownError;
			try {
				await server.close();
			} catch (error) {
				shutdownError = error;
			}
			try {
				await options.onShutdown?.();
			} catch (error) {
				shutdownError ??= error;
			} finally {
				resolveShutdown?.();
			}
			if (shutdownError) process.stderr.write(`MCP stdio shutdown failed: ${formatErrorMessage(shutdownError)}\n`);
		})();
	};
	process.stdin.once("end", shutdown);
	process.stdin.once("close", shutdown);
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	await server.connect(transport);
	if (options.onShutdown) await shutdownComplete;
}
//#endregion
export { resolveToolsMcpAgentSessionKey as i, createToolsMcpServer as n, OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV as r, connectToolsMcpServerToStdio as t };
