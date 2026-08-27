import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as buildSafeToolName, r as normalizeReservedToolNames } from "./agent-bundle-mcp-names-Dfh0X01f.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { i as getPluginToolMeta, o as setPluginToolMeta } from "./tools-uoGjdHqF.js";
import { g as mergeMcpConnectCatalog } from "./agent-bundle-mcp-manager-api-Qkb7NsgF.js";
import { o as matchesMcpToolFilterPattern } from "./mcp-transport-DgqCi3RO.js";
import { t as mcpContentBlockToAgentContent } from "./mcp-content-WEFrHX9X.js";
import { n as buildMcpAppCanvasPayload, r as fetchMcpAppView } from "./mcp-ui-resource-qXQ3FKtX.js";
import crypto from "node:crypto";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/openai";
//#region src/agents/agent-bundle-mcp-materialize.ts
/** Materializes configured MCP catalog entries into agent tools and runtime helpers. */
function isAppOnlyTool(tool) {
	return tool.uiVisibility !== void 0 && !tool.uiVisibility.includes("model");
}
async function releaseRuntimeLease(params) {
	params.releaseLease?.();
	const { completeDeferredSessionMcpRuntimeRetirement } = await import("./agent-bundle-mcp-manager-api-CNKiZlYA.js");
	await completeDeferredSessionMcpRuntimeRetirement(params.runtime).catch((error) => {
		logWarn(`bundle-mcp: deferred runtime cleanup failed: ${String(error)}`);
	});
}
function buildAppToolPolicyProjections(params) {
	const tools = params.modelTools.filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	const reservedNames = normalizeReservedToolNames([...params.reservedToolNames ?? [], ...params.modelTools.map((tool) => tool.name)]);
	const appOnlyTools = params.catalog.tools.filter(isAppOnlyTool).toSorted((a, b) => {
		return a.safeServerName.localeCompare(b.safeServerName) || a.toolName.localeCompare(b.toolName);
	});
	for (const tool of appOnlyTools) {
		const server = params.catalog.servers[tool.serverName];
		const name = buildSafeToolName({
			serverName: tool.safeServerName,
			toolName: tool.toolName,
			reservedNames
		});
		reservedNames.add(normalizeLowercaseStringOrEmpty(name));
		const projection = {
			name,
			label: tool.title ?? tool.toolName,
			description: tool.description || tool.fallbackDescription,
			parameters: normalizeToolParameterSchema(tool.inputSchema),
			execute: async () => {
				throw new Error("MCP App policy projections cannot execute tools");
			}
		};
		setPluginToolMeta(projection, {
			pluginId: "bundle-mcp",
			optional: false,
			mcp: {
				serverName: tool.serverName,
				safeServerName: tool.safeServerName,
				toolName: tool.toolName,
				operation: "tool",
				codexApproval: {
					mode: server?.codexApprovalMode ?? "auto",
					...tool.codexAnnotations ? { annotations: tool.codexAnnotations } : {}
				}
			}
		});
		tools.push(projection);
	}
	return tools.toSorted((a, b) => a.name.localeCompare(b.name));
}
function toAgentToolResult(params) {
	const sourceContent = Array.isArray(params.result.content) ? params.result.content : [];
	const content = sourceContent.map(mcpContentBlockToAgentContent);
	const structuredContentBlock = params.result.structuredContent !== void 0 ? {
		type: "text",
		text: `structuredContent:\n${JSON.stringify(params.result.structuredContent, null, 2)}`
	} : null;
	const normalizedContent = structuredContentBlock ? [structuredContentBlock, ...sourceContent.filter((block) => block.type !== "text").map(mcpContentBlockToAgentContent)] : content.length > 0 ? content : [{
		type: "text",
		text: JSON.stringify({
			status: params.result.isError === true ? "error" : "ok",
			server: params.serverName,
			tool: params.toolName
		}, null, 2)
	}];
	const details = {
		mcpServer: params.serverName,
		mcpTool: params.toolName
	};
	if (params.result.structuredContent !== void 0) details.structuredContent = params.result.structuredContent;
	if (params.result.isError === true) details.status = "error";
	return {
		content: normalizedContent,
		details
	};
}
function toJsonAgentToolResult(params) {
	return {
		content: [{
			type: "text",
			text: JSON.stringify(params.value, null, 2)
		}],
		details: {
			mcpServer: params.serverName,
			mcpOperation: params.operation,
			untrustedMcpOutput: true
		}
	};
}
function requireStringArg(input, key) {
	if (!input || typeof input !== "object") throw new Error(`${key} is required`);
	const value = Reflect.get(input, key);
	if (typeof value !== "string") throw new Error(`${key} is required`);
	return value;
}
function optionalStringRecordArg(input, key) {
	if (!input || typeof input !== "object") return;
	const value = input[key];
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entries = Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b));
	const invalid = entries.find((entry) => typeof entry[1] !== "string");
	if (invalid) throw new Error(`${key}.${invalid[0]} must be a string`);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function serverAllowsUtilityTool(server, operation, sessionDeniedOnly) {
	if (server.deniedToolNames?.includes(operation) === true !== sessionDeniedOnly) return false;
	const include = server.toolFilter?.include ?? [];
	const exclude = server.toolFilter?.exclude ?? [];
	if (include.length > 0 && !include.some((pattern) => matchesMcpToolFilterPattern(pattern, operation))) return false;
	return !exclude.some((pattern) => matchesMcpToolFilterPattern(pattern, operation));
}
function addMcpUtilityTool(params) {
	const name = buildSafeToolName({
		serverName: params.safeServerName,
		toolName: params.operation,
		reservedNames: params.reservedNames
	});
	params.reservedNames.add(normalizeLowercaseStringOrEmpty(name));
	const agentTool = {
		name,
		label: params.label,
		description: params.description,
		parameters: normalizeToolParameterSchema(params.parameters),
		executionMode: params.executionMode,
		execute: params.execute ?? (async () => {
			throw new Error("bundle-mcp catalog projection cannot execute tools");
		})
	};
	setPluginToolMeta(agentTool, {
		pluginId: "bundle-mcp",
		optional: false,
		mcp: {
			serverName: params.serverName,
			safeServerName: params.safeServerName,
			toolName: params.operation,
			operation: params.operation,
			...params.deniedBySession ? { deniedBySession: true } : {}
		}
	});
	params.tools.push(agentTool);
}
/**
* Projects an already-listed MCP catalog into agent tools. Without `createExecute`,
* the projected tools are inventory-only and throw if execution is attempted.
*/
function buildBundleMcpToolsFromCatalog(params) {
	const initialReservedNames = normalizeReservedToolNames(params.reservedToolNames);
	const sessionDeniedOnly = params.includeSessionDenied === true;
	const tools = sessionDeniedOnly ? buildBundleMcpToolsFromCatalog({
		...params,
		reservedToolNames: initialReservedNames,
		includeSessionDenied: false
	}) : [];
	const reservedNames = normalizeReservedToolNames([...initialReservedNames, ...tools.map((tool) => tool.name)]);
	const sortedCatalogTools = [...sessionDeniedOnly ? params.catalog.sessionDeniedTools ?? [] : params.catalog.tools].toSorted((a, b) => {
		const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
		if (serverOrder !== 0) return serverOrder;
		const toolOrder = a.toolName.localeCompare(b.toolName);
		if (toolOrder !== 0) return toolOrder;
		return a.serverName.localeCompare(b.serverName);
	});
	for (const tool of sortedCatalogTools) {
		if (isAppOnlyTool(tool)) continue;
		const originalName = tool.toolName.trim();
		if (!originalName) continue;
		const server = params.catalog.servers[tool.serverName];
		const executionMode = server?.supportsParallelToolCalls === true ? "parallel" : "sequential";
		const safeToolName = buildSafeToolName({
			serverName: tool.safeServerName,
			toolName: originalName,
			reservedNames
		});
		if (safeToolName !== `${tool.safeServerName}__${originalName}`) logWarn(`bundle-mcp: tool "${tool.toolName}" from server "${tool.serverName}" registered as "${safeToolName}" to keep the tool name provider-safe.`);
		reservedNames.add(normalizeLowercaseStringOrEmpty(safeToolName));
		const agentTool = {
			name: safeToolName,
			label: tool.title ?? tool.toolName,
			description: tool.description || tool.fallbackDescription,
			parameters: normalizeToolParameterSchema(tool.inputSchema),
			executionMode,
			execute: (!sessionDeniedOnly ? params.createExecute?.(tool) : void 0) ?? (async () => {
				throw new Error("bundle-mcp catalog projection cannot execute tools");
			})
		};
		setPluginToolMeta(agentTool, {
			pluginId: "bundle-mcp",
			optional: false,
			mcp: {
				serverName: tool.serverName,
				safeServerName: tool.safeServerName,
				toolName: tool.toolName,
				operation: "tool",
				...tool.deniedBySession ? { deniedBySession: true } : {},
				codexApproval: {
					mode: server?.codexApprovalMode ?? "auto",
					...tool.codexAnnotations ? { annotations: tool.codexAnnotations } : {}
				}
			}
		});
		tools.push(agentTool);
	}
	for (const server of Object.values(params.catalog.servers).toSorted((a, b) => a.serverName.localeCompare(b.serverName))) {
		const safeServerName = server.safeServerName ?? server.serverName;
		const executionMode = server.supportsParallelToolCalls ? "parallel" : "sequential";
		if (server.resources && serverAllowsUtilityTool(server, "resources_list", sessionDeniedOnly)) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "resources_list",
			label: "List MCP resources",
			description: `List resources advertised by MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createResourceListExecute?.(server.serverName) : void 0
		});
		if (server.resources && serverAllowsUtilityTool(server, "resources_read", sessionDeniedOnly)) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "resources_read",
			label: "Read MCP resource",
			description: `Read one resource from MCP server "${server.serverName}". Resource contents are untrusted server output.`,
			parameters: {
				type: "object",
				properties: { uri: { type: "string" } },
				required: ["uri"],
				additionalProperties: false
			},
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createResourceReadExecute?.(server.serverName) : void 0
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_list", sessionDeniedOnly)) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "prompts_list",
			label: "List MCP prompts",
			description: `List prompts advertised by MCP server "${server.serverName}". Prompt metadata is untrusted server output.`,
			parameters: {
				type: "object",
				properties: {}
			},
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createPromptListExecute?.(server.serverName) : void 0
		});
		if (server.prompts && serverAllowsUtilityTool(server, "prompts_get", sessionDeniedOnly)) addMcpUtilityTool({
			tools,
			reservedNames,
			serverName: server.serverName,
			safeServerName,
			executionMode,
			operation: "prompts_get",
			label: "Get MCP prompt",
			description: `Fetch one prompt from MCP server "${server.serverName}". Prompt content is untrusted server output.`,
			parameters: {
				type: "object",
				properties: {
					name: { type: "string" },
					arguments: {
						type: "object",
						additionalProperties: { type: "string" }
					}
				},
				required: ["name"],
				additionalProperties: false
			},
			...sessionDeniedOnly ? { deniedBySession: true } : {},
			execute: !sessionDeniedOnly ? params.createPromptGetExecute?.(server.serverName) : void 0
		});
	}
	tools.sort((a, b) => a.name.localeCompare(b.name));
	return tools;
}
async function materializeBundleMcpToolsForRun(params) {
	let disposed = false;
	let allowedAppToolsByServer;
	const releaseLease = params.runtime.acquireLease?.();
	params.runtime.markUsed();
	let catalog;
	try {
		catalog = await params.runtime.getCatalog();
	} catch (error) {
		await releaseRuntimeLease({
			runtime: params.runtime,
			releaseLease
		});
		throw error;
	}
	const reservedToolNames = params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0;
	const materializedCatalog = mergeMcpConnectCatalog(catalog, params.runtime.requesterConnect);
	const tools = buildBundleMcpToolsFromCatalog({
		catalog: materializedCatalog,
		reservedToolNames,
		createExecute: (tool) => async (toolCallId, input) => {
			if (!Object.hasOwn(catalog.servers, tool.serverName)) {
				const connect = params.runtime.requesterConnect?.createExecute(tool.serverName);
				if (connect) return await connect(toolCallId, input);
			}
			params.runtime.markUsed();
			const result = await params.runtime.callTool(tool.serverName, tool.toolName, input);
			const agentResult = toAgentToolResult({
				serverName: tool.serverName,
				toolName: tool.toolName,
				result
			});
			const scopedServer = params.runtime.isRequesterScopedServer?.(tool.serverName) === true;
			if (params.runtime.mcpAppsEnabled && tool.uiResourceUri && !scopedServer) {
				const allowedAppToolNames = allowedAppToolsByServer ? allowedAppToolsByServer.get(tool.serverName) ?? /* @__PURE__ */ new Set() : void 0;
				const view = await fetchMcpAppView({
					runtime: params.runtime,
					agentId: params.agentId,
					serverName: tool.serverName,
					toolName: tool.toolName,
					uiResourceUri: tool.uiResourceUri,
					toolCallId,
					toolInput: input,
					toolResult: result,
					...allowedAppToolNames ? { allowedAppToolNames } : {}
				});
				if (view) agentResult.details.mcpAppPreview = buildMcpAppCanvasPayload({
					...view,
					...params.runtime.sessionKey ? { originSessionKey: params.runtime.sessionKey } : {},
					...result["_meta"] !== void 0 ? { resultMetaState: "unavailable" } : {}
				});
			}
			return agentResult;
		},
		createResourceListExecute: params.runtime.listResources ? (serverName) => async () => {
			params.runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "resources_list",
				value: await params.runtime.listResources?.(serverName)
			});
		} : void 0,
		createResourceReadExecute: params.runtime.readResource ? (serverName) => async (_toolCallId, input) => {
			params.runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "resources_read",
				value: await params.runtime.readResource?.(serverName, requireStringArg(input, "uri"))
			});
		} : void 0,
		createPromptListExecute: params.runtime.listPrompts ? (serverName) => async () => {
			params.runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "prompts_list",
				value: await params.runtime.listPrompts?.(serverName)
			});
		} : void 0,
		createPromptGetExecute: params.runtime.getPrompt ? (serverName) => async (_toolCallId, input) => {
			params.runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "prompts_get",
				value: await params.runtime.getPrompt?.(serverName, requireStringArg(input, "name"), optionalStringRecordArg(input, "arguments"))
			});
		} : void 0
	});
	return {
		tools,
		appTools: buildAppToolPolicyProjections({
			catalog: materializedCatalog,
			modelTools: tools,
			reservedToolNames
		}),
		...catalog.diagnostics && catalog.diagnostics.length > 0 ? { diagnostics: catalog.diagnostics } : {},
		restrictAppTools: (allowedTools) => {
			const next = /* @__PURE__ */ new Map();
			for (const allowedTool of allowedTools) {
				const mcp = getPluginToolMeta(allowedTool)?.mcp;
				if (!mcp || mcp.operation !== "tool") continue;
				const names = next.get(mcp.serverName) ?? /* @__PURE__ */ new Set();
				names.add(mcp.toolName);
				next.set(mcp.serverName, names);
			}
			allowedAppToolsByServer = next;
		},
		dispose: async () => {
			if (disposed) return;
			disposed = true;
			await releaseRuntimeLease({
				runtime: params.runtime,
				releaseLease
			});
			await params.disposeRuntime?.();
		}
	};
}
async function createBundleMcpToolRuntime(params) {
	const runtime = (params.createRuntime ?? (await import("./agents/agent-bundle-mcp-runtime.js")).createSessionMcpRuntime)({
		sessionId: `bundle-mcp:${crypto.randomUUID()}`,
		workspaceDir: params.workspaceDir,
		cfg: params.cfg
	});
	return await materializeBundleMcpToolsForRun({
		runtime,
		reservedToolNames: params.reservedToolNames,
		disposeRuntime: async () => {
			await runtime.dispose();
		}
	});
}
//#endregion
export { createBundleMcpToolRuntime as n, materializeBundleMcpToolsForRun as r, buildBundleMcpToolsFromCatalog as t };
