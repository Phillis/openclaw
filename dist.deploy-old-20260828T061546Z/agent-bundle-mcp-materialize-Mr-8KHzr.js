import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { n as buildSafeToolName, r as normalizeReservedToolNames } from "./agent-bundle-mcp-names-CP3ugHLh.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { r as isToolResultError } from "./tool-result-error-CnEQjVCq.js";
import { i as getPluginToolMeta, s as setPluginToolMeta } from "./tools-COMvBqlk.js";
import { _ as mergeMcpConnectCatalog } from "./agent-bundle-mcp-manager-api-1m62vMRl.js";
import { i as runWithSessionMcpRequestSignal } from "./agent-bundle-mcp-runtime-DlEFrKcw.js";
import { r as isMcpToolAllowed } from "./mcp-transport-1VDyFnM4.js";
import { n as buildMcpAppCanvasPayload, r as fetchMcpAppView } from "./mcp-ui-resource-DAkuvpb4.js";
import crypto from "node:crypto";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/openai";
//#region src/agents/tool-search-json.ts
/** Convert bridge and transcript values into detached JSON-compatible data. */
function toToolSearchJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return value.message;
		if (value === null) return null;
		switch (typeof value) {
			case "string": return value;
			case "number":
			case "boolean":
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
//#endregion
//#region src/agents/mcp-content.ts
const mcpCodeModeGuestResults = /* @__PURE__ */ new WeakMap();
function setMcpCodeModeGuestResult(result, value) {
	mcpCodeModeGuestResults.set(result, value);
	return result;
}
function setMcpCodeModeGuestResultFromAgentResult(result) {
	return setMcpCodeModeGuestResult(result, {
		content: result.content,
		isError: isToolResultError(result)
	});
}
function transferMcpCodeModeGuestResult(source, target) {
	if (mcpCodeModeGuestResults.has(source)) {
		mcpCodeModeGuestResults.set(target, mcpCodeModeGuestResults.get(source));
		mcpCodeModeGuestResults.delete(source);
	}
	return target;
}
function consumeMcpCodeModeGuestResult(result) {
	const value = mcpCodeModeGuestResults.get(result);
	if (!mcpCodeModeGuestResults.delete(result)) return;
	const safe = toToolSearchJsonSafe(value);
	if (isRecord(safe)) delete safe._meta;
	return safe;
}
function stringifyMcpContent(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
/** Converts untrusted MCP content into the agent text/image contract. */
function mcpContentBlockToAgentContent(block) {
	if (!isRecord(block)) return {
		type: "text",
		text: stringifyMcpContent(block)
	};
	switch (block.type) {
		case "text":
			if (typeof block.text === "string") return {
				type: "text",
				text: block.text
			};
			break;
		case "image":
			if (typeof block.data === "string" && typeof block.mimeType === "string") return {
				type: "image",
				data: block.data,
				mimeType: block.mimeType
			};
			break;
		case "audio":
			if (typeof block.mimeType === "string") return {
				type: "text",
				text: `[audio ${block.mimeType}]`
			};
			break;
		case "resource_link": {
			if (typeof block.uri !== "string") break;
			const label = typeof block.title === "string" ? block.title : typeof block.name === "string" ? block.name : void 0;
			return {
				type: "text",
				text: label ? `[${label}] ${block.uri}` : block.uri
			};
		}
		case "resource":
			if (!isRecord(block.resource) || typeof block.resource.uri !== "string") break;
			return {
				type: "text",
				text: (typeof block.resource.text === "string" ? block.resource.text : void 0) ?? block.resource.uri
			};
	}
	return {
		type: "text",
		text: stringifyMcpContent(block)
	};
}
function projectMcpCallToolResultContent(result) {
	const sourceContent = Array.isArray(result.content) ? result.content : [];
	if (isRecord(result.structuredContent)) {
		const mirroredText = JSON.stringify(result.structuredContent, null, 2);
		return [{
			type: "text",
			text: `structuredContent:\n${JSON.stringify(JSON.parse(stableStringify(result.structuredContent)), null, 2)}`
		}, ...sourceContent.filter((block) => !isRecord(block) || block.type !== "text" || block.text !== mirroredText).map(mcpContentBlockToAgentContent)];
	}
	return sourceContent.map(mcpContentBlockToAgentContent);
}
/** Projects a raw MCP CallToolResult exactly once at the model boundary. */
function projectMcpCallToolResult(result, details = {}) {
	const isError = result.isError === true;
	const content = projectMcpCallToolResultContent(result);
	return setMcpCodeModeGuestResult({
		content: content.length > 0 ? content : [{
			type: "text",
			text: isError ? "MCP tool failed without returning content." : "MCP tool completed without returning content."
		}],
		details: {
			...details,
			...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
			...isError ? { status: "error" } : {}
		}
	}, {
		content: Array.isArray(result.content) ? result.content : [],
		...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
		...typeof result.isError === "boolean" ? { isError: result.isError } : {}
	});
}
//#endregion
//#region src/agents/agent-bundle-mcp-materialize.ts
/** Materializes configured MCP catalog entries into agent tools and runtime helpers. */
function isAppOnlyTool(tool) {
	return tool.uiVisibility !== void 0 && !tool.uiVisibility.includes("model");
}
async function releaseRuntimeLease(params) {
	params.releaseLease?.();
	const { completeDeferredSessionMcpRuntimeRetirement } = await import("./agent-bundle-mcp-manager-api-BIrx3tUQ.js");
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
	return projectMcpCallToolResult(params.result, {
		mcpServer: params.serverName,
		mcpTool: params.toolName
	});
}
function toJsonAgentToolResult(params) {
	const publicValue = toToolSearchJsonSafe(params.operation === "resources_list" && Array.isArray(params.value) ? { resources: params.value } : params.operation === "prompts_list" && Array.isArray(params.value) ? { prompts: params.value } : params.value);
	if (isRecord(publicValue)) delete publicValue._meta;
	return setMcpCodeModeGuestResult({
		content: [{
			type: "text",
			text: JSON.stringify(publicValue, null, 2)
		}],
		details: {
			mcpServer: params.serverName,
			mcpOperation: params.operation,
			untrustedMcpOutput: true
		}
	}, publicValue);
}
function requireStringArg(input, key) {
	if (!isRecord(input)) throw new Error(`${key} is required`);
	const value = input[key];
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
	return isMcpToolAllowed(server.toolFilter, operation);
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
		...params.execute ? { resultContentSource: "network" } : {},
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
			...params.createExecute && !sessionDeniedOnly ? { resultContentSource: "network" } : {},
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
	const runtime = params.runtime;
	let disposed = false;
	let allowedAppToolsByServer;
	const releaseLease = runtime.acquireLease?.();
	runtime.markUsed();
	let catalog;
	try {
		catalog = await runtime.getCatalog();
	} catch (error) {
		await releaseRuntimeLease({
			runtime,
			releaseLease
		});
		throw error;
	}
	const reservedToolNames = params.reservedToolNames ? Array.from(params.reservedToolNames) : void 0;
	const materializedCatalog = mergeMcpConnectCatalog(catalog, runtime.requesterConnect);
	const tools = buildBundleMcpToolsFromCatalog({
		catalog: materializedCatalog,
		reservedToolNames,
		createExecute: (tool) => (toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
			if (!Object.hasOwn(catalog.servers, tool.serverName)) {
				const connect = runtime.requesterConnect?.createExecute(tool.serverName);
				if (connect) return setMcpCodeModeGuestResultFromAgentResult(await connect(toolCallId, input));
			}
			runtime.markUsed();
			const { serverName, toolName } = tool;
			const result = await runtime.callTool(serverName, toolName, input);
			const agentResult = toAgentToolResult({
				serverName,
				toolName,
				result
			});
			const scopedServer = runtime.isRequesterScopedServer?.(serverName) === true;
			if (runtime.mcpAppsEnabled && tool.uiResourceUri && !scopedServer) {
				const allowedAppToolNames = allowedAppToolsByServer ? allowedAppToolsByServer.get(serverName) ?? /* @__PURE__ */ new Set() : void 0;
				const view = await fetchMcpAppView({
					runtime,
					agentId: params.agentId,
					serverName,
					toolName,
					uiResourceUri: tool.uiResourceUri,
					toolCallId,
					toolInput: input,
					toolResult: result,
					...allowedAppToolNames ? { allowedAppToolNames } : {}
				});
				if (view) agentResult.details.mcpAppPreview = buildMcpAppCanvasPayload({
					...view,
					...runtime.sessionKey ? { originSessionKey: runtime.sessionKey } : {},
					...result["_meta"] !== void 0 ? { resultMetaState: "unavailable" } : {}
				});
			}
			return agentResult;
		}),
		createResourceListExecute: runtime.listResources ? (serverName) => (_toolCallId, _input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
			runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "resources_list",
				value: await runtime.listResources?.(serverName)
			});
		}) : void 0,
		createResourceReadExecute: runtime.readResource ? (serverName) => (_toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
			const uri = requireStringArg(input, "uri");
			runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "resources_read",
				value: await runtime.readResource?.(serverName, uri)
			});
		}) : void 0,
		createPromptListExecute: runtime.listPrompts ? (serverName) => (_toolCallId, _input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
			runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "prompts_list",
				value: await runtime.listPrompts?.(serverName)
			});
		}) : void 0,
		createPromptGetExecute: runtime.getPrompt ? (serverName) => (_toolCallId, input, signal) => runWithSessionMcpRequestSignal(signal, async () => {
			runtime.markUsed();
			return toJsonAgentToolResult({
				serverName,
				operation: "prompts_get",
				value: await runtime.getPrompt?.(serverName, requireStringArg(input, "name"), optionalStringRecordArg(input, "arguments"))
			});
		}) : void 0
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
				runtime,
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
export { projectMcpCallToolResult as a, toToolSearchJsonSafe as c, consumeMcpCodeModeGuestResult as i, createBundleMcpToolRuntime as n, setMcpCodeModeGuestResultFromAgentResult as o, materializeBundleMcpToolsForRun as r, transferMcpCodeModeGuestResult as s, buildBundleMcpToolsFromCatalog as t };
