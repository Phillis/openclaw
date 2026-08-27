import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as clampNumber } from "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
import { R as getAgentToolExecutionContext } from "./agent-core-r8cobJ0S.js";
import { n as CODE_MODE_WAIT_TOOL_NAME, o as isCodeModeControlTool, s as markCodeModeControlTool, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-ChmXUFfk.js";
import { n as ToolInputError } from "./common-BGOZLJ2_.js";
import { r as toCodeModeJsonSafe, t as boundCodeModeResult } from "./code-mode-json-CWwCZ1yI.js";
import { t as getActiveAgentRingZeroTools } from "./agent-tools.ring-zero-context-C-QXByzs.js";
import { _ as isDirectVisibleCatalogTool, c as ToolSearchRuntime, d as addClientToolsToToolCatalog, f as applyToolCatalogCompaction, h as compactToolSearchCatalogEntry, i as applyToolSchemaDirectoryCatalog, l as formatToolSearchControlResult, n as applyToolSearchCatalog, s as resolveToolSearchConfig } from "./tool-search-DeqbMkrl.js";
import { A as readPositiveInteger, C as codeModeFailureCode, D as isCodeModeEngagedForModel, E as enforceSnapshotPayloadLimits, F as codeModeReplayIdForToolCall, M as resolveCodeModeConfig, N as resolveCodeModeHeadlessConfig, O as prepareSource, P as toToolSearchConfig, S as boundOutputToLimit, T as createCodeModeApiFilesForRun, _ as telemetry, b as DEFAULT_HEADLESS_WALL_CLOCK_MS, c as pendingBridgeStatesForSettlement, d as reserveActiveRunSlot, f as resumingRunIds, g as takeUndeliveredCodeModeRunOutput, h as storeSnapshotState, i as createPendingBridgeStates, j as readRunId, k as readCode, l as pendingToolCalls, m as snapshotState, n as cancelPendingBridgeStates, o as disposeCodeModeRun, p as settledBridgeRequestsInCompletionOrder, r as codeModeWaitingReason, s as pendingBridgeRequestsReplaySafe, t as activeRuns, u as removeExpiredRuns, v as waitForPendingBridgeSettlement, w as codeModeFailureMessage, x as MAX_HEADLESS_WALL_CLOCK_MS, y as CODE_MODE_WORKER_WATCHDOG_GRACE_MS } from "./code-mode-state-DT84CFcg.js";
import { o as optionalStringEnum } from "./typebox-Byt2OP2j.js";
import { t as resolveRuntimeWorkerUrl } from "./runtime-worker-url-Ci13O_ix.js";
import { t as resolveSwarmConfig } from "./swarm-config-DqpqlTRZ.js";
import { t as applyLocalModelLeanToolSearchDefaults } from "./local-model-lean-BMyyuL8b.js";
import { t as resolveAgentRuntimeToolConfig } from "./tool-runtime-config-mtitX84t.js";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Worker } from "node:worker_threads";
import { Type } from "typebox";
import { tokTypes } from "acorn";
//#region src/agents/code-mode-deadline.ts
/** Race preparation and bridge work against the same guest-owned deadline. */
async function awaitCodeModeDeadline(params) {
	const remainingMs = params.deadlineMs - Date.now();
	if (remainingMs <= 0) throw params.createTimeoutError();
	if (params.signal?.aborted) throw params.createAbortError(params.signal);
	let timer;
	let onAbort;
	try {
		const deadline = new Promise((_resolve, reject) => {
			timer = setTimeout(() => reject(params.createTimeoutError()), remainingMs);
			const signal = params.signal;
			if (signal) {
				onAbort = () => reject(params.createAbortError(signal));
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		return await Promise.race([params.operation(), deadline]);
	} finally {
		if (timer) clearTimeout(timer);
		if (params.signal && onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/agents/code-mode-mcp-api.ts
function readMcpSchemaProperties(schema) {
	const properties = isRecord(schema) ? schema.properties : void 0;
	return isRecord(properties) ? properties : {};
}
function readMcpRequiredKeys(schema) {
	const required = isRecord(schema) ? schema.required : void 0;
	return Array.isArray(required) ? required.filter((entry) => typeof entry === "string") : [];
}
function escapeDocComment(value) {
	return value.replace(/\*\//gu, "* /").trim();
}
function normalizeDocLines(value) {
	return value ? value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).slice(0, 12) : [];
}
function collapseDocText(value) {
	return normalizeDocLines(value).join(" ");
}
function renderDocComment(summary, params) {
	const docLines = normalizeDocLines(summary);
	if (docLines.length === 0 && params.length === 0) return [];
	const lines = ["/**", ...docLines.map((line) => ` * ${escapeDocComment(line)}`)];
	if (docLines.length > 0 && params.length > 0) lines.push(" *");
	for (const param of params) {
		const description = collapseDocText(param.description);
		if (description) lines.push(` * @param ${param.name}${param.required ? "" : "?"} ${escapeDocComment(description)}`);
	}
	lines.push(" */");
	return lines;
}
function tsPropertyName(name) {
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name) ? name : JSON.stringify(name);
}
function renderInlineObjectType(schema) {
	const properties = readMcpSchemaProperties(schema);
	const keys = Object.keys(properties);
	if (keys.length === 0) return "Record<string, unknown>";
	const required = new Set(readMcpRequiredKeys(schema));
	return `{ ${keys.map((key) => `${tsPropertyName(key)}${required.has(key) ? "" : "?"}: ${schemaType(properties[key])}`).join("; ")} }`;
}
function schemaType(schema) {
	if (!isRecord(schema)) return "unknown";
	const enumValues = Array.isArray(schema.enum) ? schema.enum.filter((entry) => typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean") : [];
	if (enumValues.length > 0 && enumValues.length <= 16) return enumValues.map((entry) => JSON.stringify(entry)).join(" | ");
	const union = Array.isArray(schema.oneOf) ? schema.oneOf : Array.isArray(schema.anyOf) ? schema.anyOf : void 0;
	if (union && union.length > 0 && union.length <= 8) return union.map(schemaType).join(" | ");
	if (Array.isArray(schema.type)) return schema.type.map((type) => schemaType({
		...schema,
		type
	})).join(" | ");
	switch (schema.type) {
		case "string": return "string";
		case "integer":
		case "number": return "number";
		case "boolean": return "boolean";
		case "array": return `${schemaType(schema.items)}[]`;
		case "object": return renderInlineObjectType(schema);
		case "null": return "null";
		default: return Object.keys(readMcpSchemaProperties(schema)).length > 0 ? renderInlineObjectType(schema) : "unknown";
	}
}
function buildMcpParamDocs(schema) {
	const properties = readMcpSchemaProperties(schema);
	const requiredKeys = readMcpRequiredKeys(schema);
	const required = new Set(requiredKeys);
	return [.../* @__PURE__ */ new Set([...requiredKeys, ...Object.keys(properties)])].map((key) => {
		const descriptor = properties[key];
		const doc = {
			name: key,
			required: required.has(key),
			type: schemaType(descriptor)
		};
		if (isRecord(descriptor)) {
			const description = typeof descriptor.description === "string" ? descriptor.description.trim() : "";
			if (description) doc.description = description;
			if ("default" in descriptor) doc.defaultValue = descriptor.default;
		}
		return doc;
	});
}
function renderMcpInputType(params) {
	if (params.length === 0) return ["input?: Record<string, never>"];
	const lines = ["input: {"];
	for (const param of params) {
		if (param.description || param.defaultValue !== void 0) {
			const description = collapseDocText(param.description);
			const suffix = param.defaultValue === void 0 ? "" : ` Default: ${JSON.stringify(param.defaultValue)}.`;
			lines.push(`  /** ${escapeDocComment(`${description}${suffix}`.trim())} */`);
		}
		lines.push(`  ${tsPropertyName(param.name)}${param.required ? "" : "?"}: ${param.type};`);
	}
	lines.push("}");
	return lines;
}
function renderMcpToolSignature(tool, functionName = tool.path.at(-1) ?? tool.method) {
	return [
		...renderDocComment(tool.description, tool.params),
		`function ${functionName}(`,
		...renderMcpInputType(tool.params).map((line) => `  ${line}`),
		"): Promise<McpToolResult>;"
	];
}
function renderMcpServerHeader(server, tools) {
	const lines = [
		"type McpApiHeader = { header: string; tools?: unknown[]; schemas?: Record<string, unknown> };",
		"",
		"type McpToolResult = {",
		"  content?: unknown[];",
		"  structuredContent?: unknown;",
		"  isError?: boolean;",
		"  [key: string]: unknown;",
		"};",
		"",
		`declare namespace MCP.${server.identifier} {`,
		"  /** Return this TypeScript-style API header. */",
		"  function $api(toolName?: string, options?: { schema?: boolean }): Promise<McpApiHeader>;"
	];
	const nestedGroups = /* @__PURE__ */ new Map();
	for (const tool of tools) {
		if (tool.path.length === 1) {
			lines.push("", ...renderMcpToolSignature(tool).map((line) => `  ${line}`));
			continue;
		}
		const groupName = tool.path[0] ?? "tools";
		const group = nestedGroups.get(groupName);
		if (group) group.push(tool);
		else nestedGroups.set(groupName, [tool]);
	}
	for (const [groupName, groupTools] of [...nestedGroups].toSorted((a, b) => a[0].localeCompare(b[0]))) {
		lines.push("", `  namespace ${groupName} {`);
		for (const tool of groupTools) lines.push("", ...renderMcpToolSignature(tool).map((line) => `    ${line}`));
		lines.push("  }");
	}
	lines.push("}");
	return lines.join("\n");
}
function renderMcpRootHeader(servers) {
	return [
		"type McpApiHeader = { header: string; servers?: unknown[] };",
		"",
		"declare const MCP: {",
		"  /** List visible MCP servers and request server-specific headers. */",
		"  $api(): Promise<McpApiHeader>;",
		...servers.map((server) => `  readonly ${server.identifier}: typeof MCP.${server.identifier};`),
		"};"
	].join("\n");
}
function buildMcpApiResponse(params) {
	const [selector, options] = params.args;
	if (!params.server) return {
		kind: "mcp_api",
		scope: "root",
		header: renderMcpRootHeader(params.servers),
		servers: params.servers.map((server) => ({
			identifier: server.identifier,
			serverName: server.serverName,
			toolCount: server.tools.length
		})),
		note: "Call MCP.<server>.$api() for a TypeScript-style header, then call tools with one object argument matching the shown input type."
	};
	const selectedName = typeof selector === "string" ? selector.trim() : "";
	const selected = selectedName ? params.server.tools.filter((tool) => tool.method === selectedName || tool.path.join(".") === selectedName || tool.mcpTool === selectedName) : params.server.tools;
	return {
		kind: "mcp_api",
		scope: selected.length === 1 ? "tool" : "server",
		server: {
			identifier: params.server.identifier,
			serverName: params.server.serverName
		},
		header: renderMcpServerHeader(params.server, selected),
		tools: selected.map((tool) => ({
			method: tool.method,
			path: tool.path,
			mcpTool: tool.mcpTool,
			operation: tool.operation,
			description: tool.description
		})),
		...isRecord(options) && options.schema === true ? { schemas: Object.fromEntries(selected.map((tool) => [tool.method, tool.parameters])) } : {},
		note: "Call MCP tools with one object argument, for example MCP.server.tool({ requiredField: value })."
	};
}
function createMcpApiVirtualFiles(servers) {
	if (servers.length === 0) return [];
	const rootContent = [
		...servers.map((server) => `/// <reference path="./${server.identifier}.d.ts" />`),
		"",
		renderMcpRootHeader(servers)
	].join("\n");
	return [{
		path: "mcp/index.d.ts",
		description: "Root MCP namespace declaration and server list.",
		content: rootContent,
		bytes: Buffer.byteLength(rootContent, "utf8")
	}, ...servers.map((server) => {
		const content = renderMcpServerHeader(server, server.tools);
		return {
			path: `mcp/${server.identifier}.d.ts`,
			description: `MCP server declaration for ${server.serverName}.`,
			content,
			bytes: Buffer.byteLength(content, "utf8")
		};
	})];
}
//#endregion
//#region src/agents/code-mode-namespaces.ts
/**
* Registry and runtime projection for code-mode namespaces. Plugins register
* namespaced tool scopes here; code mode receives descriptors, virtual API
* files, and a guarded invocation runtime.
*/
const FORBIDDEN_NAMESPACE_PATH_SEGMENTS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
const NAMESPACE_PATH_KEY_SEPARATOR = "\0";
const CODE_MODE_NAMESPACE_TOOL_CALL = Symbol.for("openclaw.codeMode.namespaceToolCall");
const RESERVED_NAMESPACE_GLOBALS = /* @__PURE__ */ new Set([
	"ALL_TOOLS",
	"agents",
	"API",
	"Array",
	"Boolean",
	"Date",
	"Error",
	"globalThis",
	"log",
	"json",
	"JSON",
	"Map",
	"Math",
	"MCP",
	"namespaces",
	"Number",
	"Object",
	"Promise",
	"phase",
	"Set",
	"String",
	"text",
	"tools",
	"yield_control"
]);
const RESERVED_NAMESPACE_FUNCTION_IDENTIFIERS = /* @__PURE__ */ new Set([...Object.values(tokTypes).flatMap((token) => token.keyword ? [token.keyword] : []), "enum"]);
function createCodeModeNamespaceCatalogTool(catalogId, toolName, input) {
	const normalizedCatalogId = catalogId.trim();
	const normalizedToolName = toolName.trim();
	if (!normalizedCatalogId) throw new Error("Code mode namespace catalogId must be non-empty.");
	if (!normalizedToolName) throw new Error("Code mode namespace toolName must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		catalogId: normalizedCatalogId,
		toolName: normalizedToolName,
		...input ? { input } : {}
	};
}
function createCodeModeNamespaceLocalFunction(toolName, input) {
	const normalizedToolName = toolName.trim();
	if (!normalizedToolName) throw new Error("Code mode namespace local function name must be non-empty.");
	return {
		[CODE_MODE_NAMESPACE_TOOL_CALL]: true,
		toolName: normalizedToolName,
		local: true,
		input
	};
}
function isCodeModeNamespaceToolCall(value) {
	const record = isRecord(value) ? value : void 0;
	return record?.[CODE_MODE_NAMESPACE_TOOL_CALL] === true && typeof record.toolName === "string" && record.toolName.trim().length > 0;
}
function toIdentifier(value, fallback) {
	const words = value.trim().split(/[^A-Za-z0-9]+/u).map((word) => word.trim()).filter(Boolean);
	const safe = (words.length === 0 ? fallback : words.map((word, index) => index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)).join("")).replace(/^[^A-Za-z_$]+/u, "").replace(/[^A-Za-z0-9_$]/gu, "");
	return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(safe) ? safe : fallback;
}
function uniqueIdentifier(base, used) {
	let candidate = base;
	let index = 2;
	while (used.has(candidate) || RESERVED_NAMESPACE_GLOBALS.has(candidate) || RESERVED_NAMESPACE_FUNCTION_IDENTIFIERS.has(candidate) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(candidate)) {
		candidate = `${base}${index}`;
		index += 1;
	}
	used.add(candidate);
	return candidate;
}
function mapMcpNamespaceInput(schema, args) {
	if (args.length > 1) throw new Error("MCP namespace tools accept one object argument.");
	const firstArg = args[0];
	const input = firstArg === void 0 ? {} : isRecord(firstArg) ? { ...firstArg } : {};
	if (firstArg !== void 0 && !isRecord(firstArg)) throw new Error("MCP namespace tools accept one object argument.");
	for (const [key, descriptor] of Object.entries(readMcpSchemaProperties(schema))) {
		if (!isRecord(descriptor) || !Object.hasOwn(descriptor, "default") || Object.hasOwn(input, key) && input[key] !== void 0) continue;
		Object.defineProperty(input, key, {
			value: descriptor.default,
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	const missing = readMcpRequiredKeys(schema).filter((key) => !Object.hasOwn(input, key) || input[key] === void 0);
	if (missing.length > 0) throw new Error(`Missing required MCP namespace argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
	return input;
}
function scopeAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		const next = current[segment];
		if (!isRecord(next)) {
			const object = Object.create(null);
			current[segment] = object;
			current = object;
			continue;
		}
		current = next;
	}
	return current;
}
function toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier) {
	const existing = usedToolIdentifiers.get(serverIdentifier);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Set([
		"$api",
		"resources",
		"prompts"
	]);
	usedToolIdentifiers.set(serverIdentifier, created);
	return created;
}
function mcpNamespaceServerKey(mcp) {
	return mcp.node ? JSON.stringify([
		"node",
		mcp.node.id,
		mcp.serverName
	]) : JSON.stringify(["gateway", mcp.safeServerName]);
}
function sanitizeNodeFragment(value) {
	const fragment = value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32);
	if (!fragment) return "node";
	return /^[a-z]/.test(fragment) ? fragment : `node_${fragment}`.slice(0, 32);
}
function assignMcpNamespaceServerNames(servers) {
	const baseCounts = /* @__PURE__ */ new Map();
	const used = /* @__PURE__ */ new Set();
	const assignments = /* @__PURE__ */ new Map();
	for (const server of servers) {
		const normalized = server.safeServerName.toLowerCase();
		baseCounts.set(normalized, (baseCounts.get(normalized) ?? 0) + 1);
		if (!server.node) {
			assignments.set(server.key, server.safeServerName);
			used.add(normalized);
		}
	}
	for (const server of servers) {
		if (!server.node || (baseCounts.get(server.safeServerName.toLowerCase()) ?? 0) > 1) continue;
		assignments.set(server.key, server.safeServerName);
		used.add(server.safeServerName.toLowerCase());
	}
	for (const server of servers) {
		if (!server.node || assignments.has(server.key)) continue;
		const base = `${sanitizeNodeFragment(server.node.id)}_${server.safeServerName}`;
		let candidate = base;
		let index = 2;
		while (used.has(candidate.toLowerCase())) {
			candidate = `${base}_${index}`;
			index += 1;
		}
		assignments.set(server.key, candidate);
		used.add(candidate.toLowerCase());
	}
	return assignments;
}
function mcpNodeLabel(node) {
	return (node.displayName?.trim() || node.id).replace(/\s+/gu, " ").slice(0, 128);
}
function createMcpNamespaceModel(catalog) {
	const mcpEntries = catalog.filter((entry) => entry.source === "mcp" && entry.id && entry.mcp).toSorted((a, b) => (a.id ?? "").localeCompare(b.id ?? ""));
	if (mcpEntries.length === 0) return;
	const serversByKey = /* @__PURE__ */ new Map();
	for (const entry of mcpEntries) {
		const mcp = entry.mcp;
		if (!mcp) continue;
		const key = mcpNamespaceServerKey(mcp);
		if (!serversByKey.has(key)) serversByKey.set(key, {
			key,
			serverName: mcp.serverName,
			safeServerName: mcp.safeServerName,
			...mcp.node ? { node: mcp.node } : {}
		});
	}
	const servers = [...serversByKey.values()].toSorted((a, b) => a.key.localeCompare(b.key));
	const assignedServerNames = assignMcpNamespaceServerNames(servers);
	const serverIdentifiers = /* @__PURE__ */ new Map();
	const usedServerIdentifiers = /* @__PURE__ */ new Set();
	for (const server of servers) {
		const safeServerName = assignedServerNames.get(server.key) ?? server.safeServerName;
		serverIdentifiers.set(server.key, uniqueIdentifier(toIdentifier(safeServerName, "server"), usedServerIdentifiers));
	}
	const usedToolIdentifiers = /* @__PURE__ */ new Map();
	const root = Object.create(null);
	const serverDocs = /* @__PURE__ */ new Map();
	for (const entry of mcpEntries) {
		const mcp = entry.mcp;
		if (!mcp || !entry.id) continue;
		const serverKey = mcpNamespaceServerKey(mcp);
		const serverIdentifier = serverIdentifiers.get(serverKey) ?? uniqueIdentifier("server", usedServerIdentifiers);
		const serverScope = scopeAtPath(root, [serverIdentifier]);
		serverScope.$serverName = mcp.serverName;
		let serverDoc = serverDocs.get(serverIdentifier);
		if (!serverDoc) {
			serverDoc = {
				identifier: serverIdentifier,
				serverName: mcp.serverName,
				...mcp.node ? { nodeLabel: mcpNodeLabel(mcp.node) } : {},
				tools: []
			};
			serverDocs.set(serverIdentifier, serverDoc);
		}
		const path = mcp.operation === "resources_list" ? ["resources", "list"] : mcp.operation === "resources_read" ? ["resources", "read"] : mcp.operation === "prompts_list" ? ["prompts", "list"] : mcp.operation === "prompts_get" ? ["prompts", "get"] : [uniqueIdentifier(toIdentifier(mcp.toolName, "tool"), toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier))];
		const parent = scopeAtPath(serverScope, path.slice(0, -1));
		parent[path.at(-1) ?? "tool"] = createCodeModeNamespaceCatalogTool(entry.id, entry.name, (args) => mapMcpNamespaceInput(entry.parameters, args));
		serverDoc.tools.push({
			method: path.join("."),
			path,
			mcpTool: mcp.toolName,
			operation: mcp.operation,
			description: entry.description,
			parameters: entry.parameters,
			params: buildMcpParamDocs(entry.parameters)
		});
	}
	const docs = [...serverDocs.values()].map((server) => Object.assign({}, server, { tools: server.tools.toSorted((a, b) => a.method.localeCompare(b.method)) })).toSorted((a, b) => a.identifier.localeCompare(b.identifier));
	root.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
		servers: docs,
		args
	}));
	for (const server of docs) {
		const serverScope = scopeAtPath(root, [server.identifier]);
		serverScope.$api = createCodeModeNamespaceLocalFunction("$api", (args) => buildMcpApiResponse({
			servers: docs,
			server,
			args
		}));
	}
	return {
		root,
		docs
	};
}
const SWARM_AGENTS_API_CONTENT = `type AgentJsonSchema = Record<string, unknown>;

interface AgentRunOptions {
  label?: string;
  model?: string;
  thinking?: string;
  fastMode?: boolean | "auto";
  agentId?: string;
  schema?: AgentJsonSchema;
  phase?: string;
}

interface AgentsApi {
  run(prompt: string, options?: AgentRunOptions & { schema?: undefined }): Promise<string>;
  run<T>(prompt: string, options: AgentRunOptions & { schema: AgentJsonSchema }): Promise<T>;
}

/** Spawn collector agents concurrently. */
declare const agents: Readonly<AgentsApi>;
/** Publish a phase heading for this swarm. */
declare function phase(title: string): void;
/** Publish a progress note for this swarm. */
declare function log(message: string): void;

// Fan-out: const reports = await Promise.all(prompts.map((prompt) => agents.run(prompt)));
// Gate: while (!ready) { ready = await agents.run("Check readiness") === "ready"; }
// Cycle: for (let pass = 0; pass < 3; pass++) draft = await agents.run("Improve: " + draft);
// Schema: const fact = await agents.run<{ answer: string }>("Research", { schema: { type: "object", properties: { answer: { type: "string" } }, required: ["answer"] } });
`;
function createMcpNamespaceEntry(model) {
	const { root: scope } = model;
	const callablePaths = /* @__PURE__ */ new Set();
	return {
		pluginId: "bundle-mcp",
		callablePaths,
		scope,
		descriptor: {
			id: "mcp",
			globalName: "MCP",
			description: "MCP server tools grouped by server.",
			scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths)
		}
	};
}
function describeMcpNamespaceForPrompt(catalog) {
	const model = createMcpNamespaceModel(catalog);
	if (!model) return [];
	const servers = model.docs.map((server) => `${server.identifier}${server.nodeLabel ? ` (node: ${server.nodeLabel})` : ""}`);
	if (servers.length === 0) return [];
	return [
		"- MCP: MCP server tools grouped by server.",
		`Read API files such as mcp/index.d.ts and mcp/<server>.d.ts for TypeScript-style MCP headers; visible servers: ${servers.join(", ")}. Node-backed name collisions use a sanitized node-id fragment prefix.`,
		"Call MCP tools as MCP.<server>.<tool>({ ...input }) with one object argument matching the header."
	];
}
/** Builds system-prompt text describing visible code-mode namespace globals. */
function describeCodeModeNamespacesForPrompt(catalog) {
	if (!catalog) return "";
	const mcpPrompt = describeMcpNamespaceForPrompt(catalog);
	if (mcpPrompt.length === 0) return "";
	const lines = ["MCP namespace globals are available in code mode:"];
	lines.push(...mcpPrompt);
	return lines.join("\n");
}
function assertNamespacePathSegment(segment) {
	if (!segment || segment.includes(NAMESPACE_PATH_KEY_SEPARATOR) || FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(segment)) throw new Error(`Invalid code mode namespace path segment: ${segment || "(empty)"}`);
}
function namespacePathKey(path) {
	return path.join(NAMESPACE_PATH_KEY_SEPARATOR);
}
function serializeNamespaceScopeValue(value, path = [], stack = /* @__PURE__ */ new WeakSet(), callablePaths = /* @__PURE__ */ new Set()) {
	if (isCodeModeNamespaceToolCall(value)) {
		callablePaths.add(namespacePathKey(path));
		return {
			kind: "function",
			path
		};
	}
	if (typeof value === "function") throw new Error(`Code mode namespace function at ${path.join(".") || "(root)"} is not serializable.`);
	if (value === null || typeof value !== "object") return {
		kind: "value",
		value: toCodeModeJsonSafe(value)
	};
	if (stack.has(value)) throw new Error(`Circular code mode namespace scope at ${path.join(".") || "(root)"}.`);
	stack.add(value);
	try {
		if (Array.isArray(value)) return {
			kind: "array",
			items: value.map((item, index) => serializeNamespaceScopeValue(item, [...path, String(index)], stack, callablePaths))
		};
		const entries = [];
		for (const [key, child] of Object.entries(value)) {
			assertNamespacePathSegment(key);
			entries.push([key, serializeNamespaceScopeValue(child, [...path, key], stack, callablePaths)]);
		}
		return {
			kind: "object",
			entries
		};
	} finally {
		stack.delete(value);
	}
}
function resolveNamespacePath(scope, path) {
	let current = scope;
	let parent = void 0;
	for (const segment of path) {
		assertNamespacePathSegment(segment);
		parent = current;
		if (!isRecord(current) && !Array.isArray(current)) return {
			target: void 0,
			parent
		};
		current = current[segment];
	}
	return {
		target: current,
		parent
	};
}
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
function createCodeModeNamespaceRuntime(catalog = []) {
	const model = createMcpNamespaceModel(catalog);
	const entries = model ? [createMcpNamespaceEntry(model)] : [];
	const byId = new Map(entries.map((entry) => [entry.descriptor.id, entry]));
	return {
		descriptors: entries.map((entry) => entry.descriptor),
		apiFiles: [{
			path: "agents.d.ts",
			description: "Swarm collector globals and orchestration idioms.",
			content: SWARM_AGENTS_API_CONTENT,
			bytes: Buffer.byteLength(SWARM_AGENTS_API_CONTENT, "utf8")
		}, ...createMcpApiVirtualFiles(model?.docs ?? [])],
		async invoke(namespaceId, path, args, executeTool) {
			const entry = byId.get(namespaceId);
			if (!entry) throw new Error(`Unknown code mode namespace: ${namespaceId}`);
			for (const segment of path) assertNamespacePathSegment(segment);
			if (!entry.callablePaths.has(namespacePathKey(path))) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const { target } = resolveNamespacePath(entry.scope, path);
			if (!isCodeModeNamespaceToolCall(target)) throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
			const input = target.input ? await target.input(args) : args[0] ?? {};
			if (target.local) return toCodeModeJsonSafe(input);
			if (!target.catalogId) throw new Error(`Code mode namespace path has no catalog tool: ${path.join(".")}`);
			return toCodeModeJsonSafe(await executeTool({
				pluginId: entry.pluginId,
				toolName: target.toolName,
				catalogId: target.catalogId,
				input,
				namespaceId,
				path: [...path]
			}));
		}
	};
}
//#endregion
//#region src/agents/code-mode-worker.ts
let quickJsWasmModulePromise;
function getQuickJsWasmModule() {
	quickJsWasmModulePromise ??= Promise.resolve().then(() => createRequire(import.meta.url).resolve("quickjs-wasi/quickjs.wasm")).then((wasmPath) => readFile(wasmPath)).then((bytes) => WebAssembly.compile(bytes)).catch((error) => {
		quickJsWasmModulePromise = void 0;
		throw error;
	});
	return quickJsWasmModulePromise;
}
function codeModeWorkerUrl() {
	return resolveRuntimeWorkerUrl({
		currentModuleUrl: import.meta.url,
		sourceWorkerName: "code-mode.worker",
		distWorkerPath: "agents/code-mode.worker.js"
	});
}
function failedCodeModeWorkerResult(error, code) {
	return {
		status: "failed",
		error: formatErrorMessage(error),
		code,
		failurePhase: "host",
		bridgeDispatchStarted: false,
		output: []
	};
}
function normalizeCodeModeTimeoutResult(result) {
	if (result.status === "failed" && result.code === "timeout" && !String(result.error).includes("timeout exceeded")) return {
		...result,
		error: "code mode timeout exceeded"
	};
	return result;
}
function normalizeCodeModeWorkerResult(result) {
	return normalizeCodeModeTimeoutResult(result);
}
async function runCodeModeWorker(workerData, timeoutMs, workerUrl, signal) {
	const resolvedWorkerUrl = workerUrl ?? codeModeWorkerUrl();
	const sourceWorkerExecArgv = resolvedWorkerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	let timer;
	let onAbort;
	try {
		return await new Promise((resolve) => {
			let settled = false;
			const finish = (result) => {
				if (settled) return;
				settled = true;
				resolve(result);
			};
			timer = setTimeout(() => {
				finish({
					status: "failed",
					error: "code mode worker timeout exceeded",
					code: "timeout",
					failurePhase: "host",
					bridgeDispatchStarted: false,
					output: []
				});
			}, timeoutMs);
			onAbort = () => {
				const abortReason = signal?.reason;
				finish({
					status: "failed",
					error: abortReason instanceof CodeModeHeadlessTimeoutError ? "code mode timeout exceeded" : "code mode execution aborted",
					code: abortReason instanceof CodeModeHeadlessTimeoutError ? "timeout" : "aborted",
					failurePhase: "host",
					bridgeDispatchStarted: false,
					output: []
				});
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted) {
				onAbort();
				return;
			}
			getQuickJsWasmModule().then((wasmModule) => {
				if (settled) return;
				try {
					worker = new Worker(resolvedWorkerUrl, {
						workerData: isRecord(workerData) ? {
							...workerData,
							wasmModule
						} : workerData,
						execArgv: sourceWorkerExecArgv
					});
				} catch (error) {
					finish(failedCodeModeWorkerResult(error, "runtime_unavailable"));
					return;
				}
				worker.once("message", (message) => {
					const result = isRecord(message) ? message : {
						status: "failed",
						error: "invalid code mode worker response",
						code: "internal_error",
						failurePhase: "host",
						bridgeDispatchStarted: false,
						output: []
					};
					finish(normalizeCodeModeWorkerResult(result));
				});
				worker.once("error", (error) => {
					finish(failedCodeModeWorkerResult(error, "runtime_unavailable"));
				});
				worker.once("exit", (code) => {
					finish(failedCodeModeWorkerResult(/* @__PURE__ */ new Error(`code mode worker exited with code ${code} before returning a result`), "runtime_unavailable"));
				});
			}, (error) => {
				finish(failedCodeModeWorkerResult(error, "runtime_unavailable"));
			});
		});
	} finally {
		if (timer) clearTimeout(timer);
		if (onAbort) signal?.removeEventListener("abort", onAbort);
		await worker?.terminate();
	}
}
var CodeModeHeadlessAbortError = class extends Error {
	constructor(message = "code mode execution aborted") {
		super(message);
		this.name = "CodeModeHeadlessAbortError";
	}
};
var CodeModeHeadlessTimeoutError = class extends Error {
	constructor(message = "code mode headless wall-clock timeout exceeded") {
		super(message);
		this.name = "CodeModeHeadlessTimeoutError";
	}
};
//#endregion
//#region src/agents/code-mode-execution.ts
async function runCodeModeExec(params) {
	removeExpiredRuns();
	const config = resolveCodeModeConfig(params.ctx.runtimeConfig ?? params.ctx.config, params.ctx.agentId);
	if (config.enabled === false) throw new ToolInputError("code mode is disabled.");
	const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config));
	params.onRuntime?.(runtime);
	const bridgeDispatch = { started: false };
	if (params.signal?.aborted) return {
		status: "failed",
		error: "code mode execution aborted",
		code: "aborted",
		failurePhase: "host",
		bridgeDispatchStarted: false,
		output: [],
		replaySafe: params.restartSafe,
		telemetry: telemetry(runtime)
	};
	const deadlineMs = Date.now() + config.timeoutMs;
	const catalog = runtime.all({ includeMcp: false });
	const namespaceCatalog = runtime.namespaceEntries();
	const swarmEnabled = resolveSwarmConfig(params.ctx.runtimeConfig ?? params.ctx.config, params.ctx.agentId).enabled;
	const codeModeReplayId = codeModeReplayIdForToolCall(params.ctx, params.toolCallId, params.code, params.assistantTurnId);
	const namespaceRuntime = createCodeModeNamespaceRuntime(namespaceCatalog);
	const apiFiles = createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled);
	try {
		const source = await awaitCodeModeDeadline({
			operation: () => prepareSource({
				code: params.code,
				language: params.language,
				config
			}),
			deadlineMs,
			signal: params.signal,
			createTimeoutError: () => /* @__PURE__ */ new Error("interrupted"),
			createAbortError: () => /* @__PURE__ */ new Error("code mode execution aborted")
		});
		const remainingMs = deadlineMs - Date.now();
		if (remainingMs <= 0) throw new Error("interrupted");
		const result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
			kind: "exec",
			source,
			config: {
				...config,
				timeoutMs: remainingMs
			},
			catalog,
			apiFiles,
			namespaces: namespaceRuntime.descriptors,
			swarmEnabled
		}, remainingMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
		return await settleCodeModeResult({
			result,
			output: result.output,
			replaySafe: params.restartSafe,
			deadlineMs,
			parentToolCallId: params.toolCallId,
			codeModeReplayId,
			ctx: params.ctx,
			config,
			runtime,
			namespaceRuntime,
			bridgeDispatch,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	} catch (error) {
		const code = params.signal?.aborted ? "aborted" : codeModeFailureCode(error);
		return {
			status: "failed",
			error: params.signal?.aborted ? "code mode execution aborted" : codeModeFailureMessage(error),
			code,
			failurePhase: bridgeDispatch.started ? "bridge" : code === "invalid_input" ? "input" : "host",
			bridgeDispatchStarted: bridgeDispatch.started,
			output: [],
			replaySafe: params.restartSafe,
			telemetry: telemetry(runtime)
		};
	}
}
function usableResumeBudgetMs(deadlineMs, config) {
	const minimum = Math.min(250, Math.max(1, Math.floor(config.timeoutMs / 2)));
	const remaining = deadlineMs - Date.now();
	return remaining >= minimum ? remaining : void 0;
}
async function waitForPending(pending, settlementMode, timeoutMs, signal) {
	if (signal?.aborted) return false;
	const required = pendingBridgeStatesForSettlement(pending, settlementMode);
	if (required.length === 0 || settlementMode.kind === "awaiting" && required.some((entry) => entry.settled) || required.every((entry) => entry.settled)) return true;
	let timer;
	let onAbort;
	try {
		const bridgeReady = waitForPendingBridgeSettlement(pending, settlementMode).then(() => true);
		return await Promise.race([
			bridgeReady,
			new Promise((resolve) => {
				timer = setTimeout(() => resolve(false), timeoutMs);
			}),
			...signal ? [new Promise((resolve) => {
				onAbort = () => resolve(false);
				signal.addEventListener("abort", onAbort, { once: true });
			})] : []
		]);
	} finally {
		if (timer) clearTimeout(timer);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function settleCodeModeResult(params) {
	let result = params.result;
	let pending = params.pending ?? [];
	const activeRunId = params.activeRunId ?? `cm_${randomUUID()}`;
	const output = params.output;
	let deliveredOutputCount = params.deliveredOutputCount ?? 0;
	const settleDeadline = params.deadlineMs;
	const abortedResult = () => ({
		status: "failed",
		error: "code mode execution aborted",
		code: "aborted",
		failurePhase: params.bridgeDispatch.started ? "bridge" : "host",
		bridgeDispatchStarted: params.bridgeDispatch.started,
		output: output.slice(deliveredOutputCount),
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	});
	while (result.status === "waiting" && result.pendingRequests.length > 0 && result.pendingRequests.every((request) => request.method !== "yield")) {
		if (params.replaySafe) {
			if (result.pendingRequests.every((request) => request.method === "namespace")) {
				cancelPendingBridgeStates(pending);
				return {
					status: "failed",
					error: "restart-safe code mode cannot call namespace tools.",
					code: "invalid_input",
					failurePhase: params.bridgeDispatch.started ? "bridge" : "input",
					bridgeDispatchStarted: params.bridgeDispatch.started,
					output: output.slice(deliveredOutputCount),
					replaySafe: true,
					telemetry: telemetry(params.runtime)
				};
			}
			break;
		}
		const remainingMs = settleDeadline - Date.now();
		if (remainingMs <= 0) break;
		if (params.signal?.aborted) {
			cancelPendingBridgeStates(pending);
			return abortedResult();
		}
		let releaseReservation;
		try {
			enforceSnapshotPayloadLimits({
				snapshotBytes: result.snapshotBytes,
				config: params.config
			});
			if (!params.reservedActiveRunSlot) releaseReservation = reserveActiveRunSlot();
			const pendingIds = new Set(pending.map((entry) => entry.id));
			const newPendingRequests = result.pendingRequests.filter((request) => !pendingIds.has(request.id));
			if (newPendingRequests.length > 0) params.bridgeDispatch.started = true;
			pending.push(...createPendingBridgeStates({
				pendingRequests: newPendingRequests,
				config: params.config,
				runtime: params.runtime,
				namespaceRuntime: params.namespaceRuntime,
				parentToolCallId: params.parentToolCallId,
				codeModeRunId: params.codeModeReplayId,
				activeRunId,
				ctx: params.ctx,
				signal: params.signal,
				onUpdate: params.onUpdate
			}));
			const ready = await waitForPending(pending, result.settlementMode, remainingMs, params.signal);
			const resumeBudgetMs = ready ? usableResumeBudgetMs(settleDeadline, params.config) : void 0;
			if (!ready || resumeBudgetMs === void 0) {
				if (params.signal?.aborted) {
					cancelPendingBridgeStates(pending);
					return abortedResult();
				}
				return storeSnapshotState({
					runId: activeRunId,
					replayId: params.codeModeReplayId,
					pending,
					replaySafe: false,
					settlementMode: result.settlementMode,
					snapshotBytes: result.snapshotBytes,
					parentToolCallId: params.parentToolCallId,
					ctx: params.ctx,
					config: params.config,
					runtime: params.runtime,
					namespaceRuntime: params.namespaceRuntime,
					output,
					deliveredOutputCount
				});
			}
			const settledRequests = settledBridgeRequestsInCompletionOrder(pending);
			pending = pending.filter((entry) => !entry.settled);
			result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
				kind: "resume",
				snapshotBytes: result.snapshotBytes,
				config: {
					...params.config,
					timeoutMs: resumeBudgetMs
				},
				settledRequests,
				pendingRequests: pending.map(({ id, method, args }) => ({
					id,
					method,
					args
				}))
			}, resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
			output.push(...result.output);
			if (boundOutputToLimit(output, params.config)) deliveredOutputCount = 0;
		} catch (error) {
			cancelPendingBridgeStates(pending);
			throw error;
		} finally {
			releaseReservation?.();
		}
	}
	if (result.status === "waiting") {
		if (params.signal?.aborted) {
			cancelPendingBridgeStates(pending);
			return abortedResult();
		}
		const pendingReplaySafe = pendingBridgeRequestsReplaySafe(result.pendingRequests, params.runtime);
		if (params.replaySafe && !pendingReplaySafe) {
			cancelPendingBridgeStates(pending);
			return {
				status: "failed",
				error: "restart-safe code mode cannot call tool surfaces that are not proven replay-safe; recovery runs must use audited read, grep, or find tools.",
				code: "invalid_input",
				failurePhase: params.bridgeDispatch.started ? "bridge" : "input",
				bridgeDispatchStarted: params.bridgeDispatch.started,
				output: output.slice(deliveredOutputCount),
				replaySafe: true,
				telemetry: telemetry(params.runtime)
			};
		}
		if (pending.length > 0) {
			let releaseReservation;
			try {
				enforceSnapshotPayloadLimits({
					snapshotBytes: result.snapshotBytes,
					config: params.config
				});
				if (!params.reservedActiveRunSlot) releaseReservation = reserveActiveRunSlot();
				const pendingIds = new Set(pending.map((entry) => entry.id));
				const newPendingRequests = result.pendingRequests.filter((request) => !pendingIds.has(request.id));
				if (newPendingRequests.length > 0) params.bridgeDispatch.started = true;
				pending.push(...createPendingBridgeStates({
					pendingRequests: newPendingRequests,
					config: params.config,
					runtime: params.runtime,
					namespaceRuntime: params.namespaceRuntime,
					parentToolCallId: params.parentToolCallId,
					codeModeRunId: params.codeModeReplayId,
					activeRunId,
					ctx: params.ctx,
					signal: params.signal,
					onUpdate: params.onUpdate
				}));
				return storeSnapshotState({
					runId: activeRunId,
					replayId: params.codeModeReplayId,
					pending,
					replaySafe: params.replaySafe && pendingReplaySafe,
					settlementMode: result.settlementMode,
					snapshotBytes: result.snapshotBytes,
					parentToolCallId: params.parentToolCallId,
					ctx: params.ctx,
					config: params.config,
					runtime: params.runtime,
					namespaceRuntime: params.namespaceRuntime,
					output,
					deliveredOutputCount
				});
			} catch (error) {
				cancelPendingBridgeStates(pending);
				throw error;
			} finally {
				releaseReservation?.();
			}
		}
		if (result.pendingRequests.length > 0) params.bridgeDispatch.started = true;
		return snapshotState({
			pendingRequests: result.pendingRequests,
			snapshotBytes: result.snapshotBytes,
			parentToolCallId: params.parentToolCallId,
			codeModeReplayId: params.codeModeReplayId,
			ctx: params.ctx,
			config: params.config,
			runtime: params.runtime,
			namespaceRuntime: params.namespaceRuntime,
			output,
			deliveredOutputCount,
			reservedActiveRunSlot: params.reservedActiveRunSlot,
			replaySafe: params.replaySafe,
			settlementMode: result.settlementMode,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	}
	cancelPendingBridgeStates(pending);
	const bounded = boundCodeModeResult({
		output,
		...result.status === "completed" ? { value: result.value } : {},
		maxOutputBytes: params.config.maxOutputBytes
	});
	return {
		...result,
		...result.status === "completed" ? { value: bounded.value } : {},
		...result.status === "failed" ? {
			failurePhase: params.bridgeDispatch.started ? "bridge" : result.failurePhase,
			bridgeDispatchStarted: params.bridgeDispatch.started
		} : {},
		output: bounded.output.slice(bounded.truncated ? 0 : deliveredOutputCount),
		replaySafe: params.replaySafe,
		telemetry: telemetry(params.runtime)
	};
}
async function runWait(params) {
	removeExpiredRuns();
	const state = activeRuns.get(params.runId);
	if (!state) throw new ToolInputError("code mode run is unavailable or expired.");
	if (state.ctx.runId && state.ctx.runId !== params.ctx.runId) throw new ToolInputError("code mode run belongs to a different agent run.");
	if (state.ctx.sessionId && state.ctx.sessionId !== params.ctx.sessionId || state.ctx.sessionKey && state.ctx.sessionKey !== params.ctx.sessionKey || state.ctx.agentId && state.ctx.agentId !== params.ctx.agentId) throw new ToolInputError("code mode run belongs to a different session.");
	if (resumingRunIds.has(state.runId)) throw new ToolInputError("code mode run is already being resumed.");
	params.onRuntime?.(state.runtime);
	resumingRunIds.add(state.runId);
	const deadlineMs = Date.now() + state.config.timeoutMs;
	let releaseActiveRunSlot;
	try {
		const ready = await waitForPending(state.pending, state.settlementMode, Math.max(1, deadlineMs - Date.now()), params.signal);
		const resumeBudgetMs = ready ? usableResumeBudgetMs(deadlineMs, state.config) : void 0;
		if (!ready || resumeBudgetMs === void 0) {
			if (params.signal?.aborted) {
				disposeCodeModeRun(state.runId);
				return {
					status: "failed",
					error: "code mode execution aborted",
					code: "aborted",
					failurePhase: "bridge",
					bridgeDispatchStarted: true,
					output: takeUndeliveredCodeModeRunOutput(state),
					replaySafe: state.replaySafe,
					telemetry: telemetry(state.runtime)
				};
			}
			const pending = state.pending.filter((entry) => !entry.settled);
			return {
				status: "waiting",
				runId: state.runId,
				reason: codeModeWaitingReason(pending.length > 0 ? pending : state.pending),
				pendingToolCalls: pendingToolCalls(pending.length > 0 ? pending : state.pending),
				replaySafe: state.replaySafe,
				output: takeUndeliveredCodeModeRunOutput(state),
				telemetry: telemetry(state.runtime)
			};
		}
		const settledRequests = settledBridgeRequestsInCompletionOrder(state.pending);
		const pending = state.pending.filter((entry) => !entry.settled);
		releaseActiveRunSlot = reserveActiveRunSlot(state.runId);
		const result = normalizeCodeModeWorkerResult(await runCodeModeWorker({
			kind: "resume",
			snapshotBytes: state.snapshotBytes,
			config: {
				...state.config,
				timeoutMs: resumeBudgetMs
			},
			settledRequests,
			pendingRequests: pending.map(({ id, method, args }) => ({
				id,
				method,
				args
			}))
		}, resumeBudgetMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS, void 0, params.signal));
		const output = [...state.output, ...result.output];
		const outputTruncated = boundOutputToLimit(output, state.config);
		return await settleCodeModeResult({
			result,
			output,
			replaySafe: state.replaySafe,
			deadlineMs,
			parentToolCallId: state.parentToolCallId,
			codeModeReplayId: state.replayId,
			ctx: state.ctx,
			config: state.config,
			runtime: state.runtime,
			namespaceRuntime: state.namespaceRuntime,
			bridgeDispatch: { started: true },
			deliveredOutputCount: outputTruncated ? 0 : state.deliveredOutputCount,
			pending,
			activeRunId: state.runId,
			reservedActiveRunSlot: true,
			signal: params.signal,
			onUpdate: params.onUpdate
		});
	} catch (error) {
		if (!activeRuns.has(state.runId)) cancelPendingBridgeStates(state.pending);
		return {
			status: "failed",
			error: codeModeFailureMessage(error),
			code: codeModeFailureCode(error),
			failurePhase: "bridge",
			bridgeDispatchStarted: true,
			output: takeUndeliveredCodeModeRunOutput(state),
			replaySafe: state.replaySafe,
			telemetry: telemetry(state.runtime)
		};
	} finally {
		releaseActiveRunSlot?.();
		resumingRunIds.delete(state.runId);
	}
}
/** Create the exec/wait control tools for one Code Mode run context. */
//#endregion
//#region src/agents/code-mode-headless.ts
function createHeadlessAbortScope(signal, wallClockMs) {
	const controller = new AbortController();
	const onAbort = () => controller.abort(signal?.reason);
	signal?.addEventListener("abort", onAbort, { once: true });
	if (signal?.aborted) onAbort();
	const timer = setTimeout(() => controller.abort(new CodeModeHeadlessTimeoutError()), wallClockMs);
	return {
		signal: controller.signal,
		cleanup: () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
		}
	};
}
function headlessAbortError(signal) {
	return signal.reason instanceof CodeModeHeadlessTimeoutError ? signal.reason : signal.reason instanceof CodeModeHeadlessAbortError ? signal.reason : new CodeModeHeadlessAbortError();
}
function headlessFailure(params) {
	return {
		status: "failed",
		...params
	};
}
function remainingHeadlessMs(deadline) {
	const remaining = deadline - Date.now();
	if (remaining <= 0) throw new CodeModeHeadlessTimeoutError();
	return remaining;
}
async function runHeadlessWorkerLeg(params) {
	const remainingMs = remainingHeadlessMs(params.deadline);
	const timeoutMs = Math.max(1, Math.min(params.config.timeoutMs, remainingMs));
	const workerTimeoutMs = timeoutMs + CODE_MODE_WORKER_WATCHDOG_GRACE_MS;
	return await runCodeModeWorker({
		...params.input,
		config: {
			...params.config,
			timeoutMs
		}
	}, workerTimeoutMs, void 0, params.signal);
}
function normalizeHeadlessNamespaceValue(descriptor) {
	if (descriptor.kind === "array") return {
		kind: "array",
		items: descriptor.items.map(normalizeHeadlessNamespaceValue)
	};
	if (descriptor.kind === "object") return {
		kind: "object",
		entries: descriptor.entries.map(([key, value]) => {
			if (!key) throw new ToolInputError("code mode namespace descriptor keys must not be empty");
			return [key, normalizeHeadlessNamespaceValue(value)];
		})
	};
	if (descriptor.kind !== "value") return descriptor;
	return {
		kind: "value",
		value: toCodeModeJsonSafe(descriptor.value)
	};
}
function normalizeHeadlessNamespace(descriptor) {
	return {
		...descriptor,
		scope: normalizeHeadlessNamespaceValue(descriptor.scope)
	};
}
function mergeHeadlessNamespaces(registered, extra) {
	const ids = new Set(registered.map((descriptor) => descriptor.id));
	const globalNames = new Set(registered.map((descriptor) => descriptor.globalName));
	const merged = [...registered];
	for (const descriptor of extra) {
		if (ids.has(descriptor.id) || globalNames.has(descriptor.globalName)) throw new ToolInputError(`code mode namespace collision for ${descriptor.id} (${descriptor.globalName})`);
		ids.add(descriptor.id);
		globalNames.add(descriptor.globalName);
		merged.push(normalizeHeadlessNamespace(descriptor));
	}
	return merged;
}
function headlessNamespaceFreezePrelude(descriptors) {
	return `;(() => {
    const seen = new WeakSet();
    const freeze = (value) => {
      if ((value === null || (typeof value !== "object" && typeof value !== "function")) || seen.has(value)) return value;
      seen.add(value);
      for (const key of Object.keys(value)) freeze(value[key]);
      return Object.freeze(value);
    };
    for (const name of ${JSON.stringify(descriptors.map((descriptor) => descriptor.globalName))}) freeze(globalThis[name]);
  })();\n`;
}
/** Run Code Mode to completion without publishing resumable snapshot state. */
async function runCodeModeScriptHeadless(params) {
	const config = resolveCodeModeHeadlessConfig(params.ctx, params.overrides);
	const wallClockMs = clampNumber(readPositiveInteger(params.wallClockMs, DEFAULT_HEADLESS_WALL_CLOCK_MS), 1, MAX_HEADLESS_WALL_CLOCK_MS);
	const maxToolCalls = clampNumber(readPositiveInteger(params.maxToolCalls, 5), 1, 200);
	const deadline = Date.now() + wallClockMs;
	const abortScope = createHeadlessAbortScope(params.signal, wallClockMs);
	const output = [];
	let pending = [];
	let toolCallCount = 0;
	try {
		const swarmEnabled = false;
		const codeModeRunId = `cm_headless_${randomUUID()}`;
		const runtime = new ToolSearchRuntime(params.ctx, toToolSearchConfig(config));
		const catalog = runtime.all({ includeMcp: false });
		const namespaceRuntime = createCodeModeNamespaceRuntime(runtime.namespaceEntries());
		const preparedSource = await awaitCodeModeDeadline({
			operation: () => prepareSource({
				code: params.code,
				language: params.language,
				config
			}),
			deadlineMs: deadline,
			signal: abortScope.signal,
			createTimeoutError: () => new CodeModeHeadlessTimeoutError(),
			createAbortError: headlessAbortError
		});
		const namespaces = mergeHeadlessNamespaces(namespaceRuntime.descriptors, params.extraNamespaces ?? []);
		const source = `${headlessNamespaceFreezePrelude(namespaces)}${preparedSource}`;
		const parentToolCallId = `headless:${randomUUID()}`;
		let result = normalizeCodeModeWorkerResult(await runHeadlessWorkerLeg({
			input: {
				kind: "exec",
				source,
				catalog,
				apiFiles: createCodeModeApiFilesForRun(namespaceRuntime, swarmEnabled),
				namespaces,
				swarmEnabled
			},
			config,
			deadline,
			signal: abortScope.signal
		}));
		while (true) {
			output.push(...result.output);
			boundOutputToLimit(output, config);
			if (result.status === "completed") {
				const bounded = boundCodeModeResult({
					output,
					value: result.value,
					maxOutputBytes: config.maxOutputBytes
				});
				return {
					status: "completed",
					value: bounded.value,
					output: bounded.output,
					toolCallCount
				};
			}
			if (result.status === "failed") return headlessFailure({
				code: result.code,
				error: result.error,
				output,
				toolCallCount
			});
			enforceSnapshotPayloadLimits({
				snapshotBytes: result.snapshotBytes,
				config
			});
			const pendingIds = new Set(pending.map((entry) => entry.id));
			const newRequests = result.pendingRequests.filter((request) => !pendingIds.has(request.id));
			const requestedToolCalls = newRequests.filter((request) => request.method === "call" || request.method === "callValue" || request.method === "nodes" || request.method === "namespace").length;
			toolCallCount += requestedToolCalls;
			if (toolCallCount > maxToolCalls) return headlessFailure({
				code: "tool_budget_exceeded",
				error: `code mode headless tool budget exceeded (${maxToolCalls})`,
				output,
				toolCallCount
			});
			pending.push(...createPendingBridgeStates({
				pendingRequests: newRequests,
				config,
				runtime,
				namespaceRuntime,
				parentToolCallId,
				codeModeRunId,
				ctx: params.ctx,
				signal: abortScope.signal
			}));
			const settlementMode = result.settlementMode;
			if (pendingBridgeStatesForSettlement(pending, settlementMode).length === 0) return headlessFailure({
				code: "internal_error",
				error: "code mode is waiting without pending bridge requests",
				output,
				toolCallCount
			});
			await awaitCodeModeDeadline({
				operation: () => waitForPendingBridgeSettlement(pending, settlementMode),
				deadlineMs: deadline,
				signal: abortScope.signal,
				createTimeoutError: () => new CodeModeHeadlessTimeoutError(),
				createAbortError: headlessAbortError
			});
			const settledRequests = settledBridgeRequestsInCompletionOrder(pending);
			pending = pending.filter((entry) => !entry.settled);
			result = normalizeCodeModeWorkerResult(await runHeadlessWorkerLeg({
				input: {
					kind: "resume",
					snapshotBytes: result.snapshotBytes,
					settledRequests,
					pendingRequests: pending.map(({ id, method, args }) => ({
						id,
						method,
						args
					}))
				},
				config,
				deadline,
				signal: abortScope.signal
			}));
		}
	} catch (error) {
		const timedOut = error instanceof CodeModeHeadlessTimeoutError;
		const aborted = error instanceof CodeModeHeadlessAbortError;
		return headlessFailure({
			code: timedOut ? "timeout" : aborted ? "aborted" : codeModeFailureCode(error),
			error: timedOut || aborted ? error.message : codeModeFailureMessage(error),
			output,
			toolCallCount
		});
	} finally {
		cancelPendingBridgeStates(pending);
		abortScope.cleanup();
	}
}
//#endregion
//#region src/agents/code-mode.ts
/**
* Host-side Code Mode controller for isolated QuickJS execution with bridged
* tool search/call/yield support.
*/
const MAX_CODE_MODE_CATALOG_INDEX_CHARS = 8e3;
const CODE_MODE_CATALOG_INDEX_HEADING = [
	"OpenClaw/plugin tool quick index (exact ids; descriptions are intentionally deferred):",
	"Each line is `id input -> output`; `-> ?` means unknown.",
	"OUTPUT DECLARED RULE: use declared fields for dependent calls in the first exec.",
	"OUTPUT UNKNOWN RULE: return the raw tool value unchanged; inspect or map it only in a later exec."
].join("\n");
function codeModeCatalogIndexFooter(included, total) {
	const omitted = total - included;
	return omitted > 0 ? `${omitted} additional OpenClaw/plugin tools omitted from this prompt index. Use ALL_TOOLS or tools.search inside exec to find them.` : "Use these exact ids with tools.callValue; use ALL_TOOLS or tools.search inside exec when lookup is ambiguous.";
}
function renderCodeModeCatalogIndex(lines, total) {
	return [
		CODE_MODE_CATALOG_INDEX_HEADING,
		...lines,
		"",
		codeModeCatalogIndexFooter(lines.length, total)
	].join("\n");
}
function formatCodeModeCatalogIndex(catalog) {
	const lines = catalog.filter((entry) => entry.source === "openclaw").map((entry) => compactToolSearchCatalogEntry(entry)).toSorted((a, b) => (a.output ? 0 : 1) - (b.output ? 0 : 1) || a.id.localeCompare(b.id)).map((entry) => `- ${JSON.stringify(entry.id)} ${entry.input ?? "unknown"} -> ${entry.output ?? "?"}`);
	if (lines.length === 0) return "";
	const fullIndex = renderCodeModeCatalogIndex(lines, lines.length);
	if (fullIndex.length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) return fullIndex;
	const included = [];
	let includedLineLength = 0;
	for (const line of lines) {
		const candidateLineLength = includedLineLength + 1 + line.length;
		if (CODE_MODE_CATALOG_INDEX_HEADING.length + candidateLineLength + 2 + codeModeCatalogIndexFooter(included.length + 1, lines.length).length <= MAX_CODE_MODE_CATALOG_INDEX_CHARS) {
			included.push(line);
			includedLineLength = candidateLineLength;
		}
	}
	return renderCodeModeCatalogIndex(included, lines.length);
}
function createCodeModeExecDescription(ctx, catalog) {
	const namespacePrompt = describeCodeModeNamespacesForPrompt(catalog);
	const catalogKnown = catalog !== void 0;
	const hasMcp = catalog?.some((entry) => entry.source === "mcp") ?? false;
	const swarmEnabled = resolveSwarmConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).enabled;
	const apiGuidance = !catalogKnown || hasMcp || swarmEnabled ? " Read TypeScript-style declaration files with `API.list(prefix?)` and `API.read(path)`." : "";
	const mcpGuidance = !catalogKnown || hasMcp ? " MCP tools are available only through the `MCP` namespace." : "";
	const swarmGuidance = swarmEnabled ? " Swarm globals `agents.run`, `phase`, and `log` are available; read `agents.d.ts` for types and orchestration idioms." : "";
	const nodesGuidance = "\n- nodes: paired Gateway nodes; nodes.list(), (await nodes.get(id)).invoke(command, params)\n";
	const skillsGuidance = ctx.codeModeSkills?.length ? " Skills are available through the async `skills` global: use `await skills.list()` and `await skills.read(name)`." : "";
	const maxOutputBytes = resolveCodeModeConfig(ctx.runtimeConfig ?? ctx.config, ctx.agentId).maxOutputBytes;
	const catalogIndex = catalog ? formatCodeModeCatalogIndex(catalog) : "";
	return `Run JavaScript or TypeScript in OpenClaw code mode. Use \`return\` to pass the final value back; otherwise the result is \`null\`. Quick-index arrows show trusted declared output hints; \`-> ?\` means never guess result field names. For declared fields, process them in the first exec; do not spend another exec inspecting them. Perform dependent reads, checks, and follow-up calls in order; parallelize independent work only. For an unknown output, including a final dependent call after declared-output calls, return the raw tool value unchanged; do not wrap it in the requested answer shape or guess fields; filter or map it only in a later exec. Nested calls enforce normal tool policy and approvals. Nested results, output, and final value share ${maxOutputBytes} bytes; truncation reports omitted bytes and asks you to rerun with narrower args. \`ALL_TOOLS\` is the complete compact catalog. Select exact ids directly or with \`tools.search(query: string, options?)\`; use \`tools.describe(id: string)\` only when needed. Never invent or transform a tool id. \`tools.callValue(id: string, args?)\` returns its JSON value directly; \`tools.call(id: string, args?)\` preserves \`{ tool, result }\`. Example: \`const hit = ALL_TOOLS.find((entry) => entry.description.includes('weather')) ?? (await tools.search('weather'))[0]; return await tools.callValue(hit.id, {});\`. Node.js modules and \`require\`/\`import\` are NOT available; use enabled catalog tools allowed by policy for shell, file, network, or external actions.` + apiGuidance + mcpGuidance + swarmGuidance + nodesGuidance + skillsGuidance + " The `language` field accepts only \"javascript\" or \"typescript\"; do not pass \"bash\", \"shell\", or other values. The `code` field contains JavaScript or TypeScript, never a shell command. Shell/file: use exact tools; do not retry failed shell source. One-shot shell: `openclaw:core:exec`; `terminal.open` doesn't await." + (namespacePrompt ? `\n\n${namespacePrompt}` : "") + (catalogIndex ? `\n\n${catalogIndex}` : "");
}
function createCodeModeTools(ctx) {
	return [markCodeModeControlTool({
		name: CODE_MODE_EXEC_TOOL_NAME,
		label: "exec",
		description: createCodeModeExecDescription(ctx),
		parameters: Type.Object({
			code: Type.String({ description: "Required JS/TS; no Python, shell, `require`, `import`. Use explicit `return value`; a trailing expression is discarded and yields `null`. Use `callValue`, not `call`, for data; `call` wraps it under `.result`. Core text reads: `{kind:\"text\",content:string}`; use `.content`. Unknown format: return it first, then parse it in a later exec; never guess separators. Example: `const file=await tools.callValue(\"openclaw:core:read\", { path: \"notes.txt\" }); if(file.kind!==\"text\") return file; return file.content;`. Use exact ids from `ALL_TOOLS` or `tools.search(query)`; never invent ids or parallelize dependent calls." }),
			language: optionalStringEnum(["javascript", "typescript"], { description: "Source language. Must be \"javascript\" or \"typescript\". Defaults to javascript." }),
			restartSafe: Type.Optional(Type.Boolean({ description: "Set true only when every catalog call is explicitly replay-safe and OpenClaw may reconstruct the work after a gateway restart. Leave unset for ordinary calls; true rejects unmarked or namespace tool surfaces not proven replay-safe." }))
		}),
		execute: async (toolCallId, args, signal, onUpdate) => {
			const input = readCode(args);
			const executionContext = getAgentToolExecutionContext();
			let runtime;
			return formatToolSearchControlResult(normalizeCodeModeTimeoutResult(await runCodeModeExec({
				toolCallId,
				ctx,
				code: input.code,
				assistantTurnId: executionContext?.assistantMessage.responseId?.trim() || executionContext?.assistantMessage.turnId?.trim(),
				language: input.language,
				restartSafe: ctx.forceRestartSafeTools === true || input.restartSafe,
				signal,
				onUpdate,
				onRuntime: (value) => {
					runtime = value;
				}
			})), runtime);
		}
	}), markCodeModeControlTool({
		name: CODE_MODE_WAIT_TOOL_NAME,
		label: "wait",
		hideFromChannelProgress: true,
		description: "Resume a suspended OpenClaw code mode run returned by exec.",
		parameters: Type.Object({ runId: Type.String({ description: "Code mode run id returned by exec." }) }),
		execute: async (toolCallId, args, signal, onUpdate) => {
			let runtime;
			return formatToolSearchControlResult(normalizeCodeModeTimeoutResult(await runWait({
				toolCallId,
				ctx,
				runId: readRunId(args),
				signal,
				onUpdate,
				onRuntime: (value) => {
					runtime = value;
				}
			})), runtime);
		}
	})];
}
/** Compact normal tools behind Code Mode exec/wait controls. */
function applyCodeModeCatalog(params) {
	if (resolveCodeModeConfig(params.config, params.agentId).enabled === false && params.forceEnabled !== true) return applyToolCatalogCompaction({
		...params,
		enabled: false,
		isVisibleControlTool: isCodeModeControlTool
	});
	const tools = params.tools.filter((tool) => isCodeModeControlTool(tool) || tool.name !== "tool_search_code" && tool.name !== "tool_search" && tool.name !== "tool_describe" && tool.name !== "tool_call");
	const directToolNames = new Set(params.directToolNames);
	const compacted = applyToolCatalogCompaction({
		...params,
		tools,
		enabled: true,
		isVisibleControlTool: isCodeModeControlTool,
		isVisibleCatalogTool: (tool) => directToolNames.has(tool.name) && isDirectVisibleCatalogTool(tool, directToolNames),
		shouldCatalogTool: (tool) => !isCodeModeControlTool(tool)
	});
	const visibleCatalog = params.catalogRef?.current?.entries;
	for (const tool of compacted.tools) if (tool.name === "exec") tool.description = createCodeModeExecDescription({
		config: params.config,
		runtimeConfig: params.config,
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		runId: params.runId,
		catalogRef: params.catalogRef,
		codeModeSkills: params.codeModeSkills
	}, visibleCatalog);
	return compacted;
}
/** Move client-side tool definitions into the active Code Mode catalog. */
function addClientToolsToCodeModeCatalog(params) {
	return addClientToolsToToolCatalog({
		...params,
		enabled: resolveCodeModeConfig(params.config, params.agentId).enabled !== false
	});
}
//#endregion
//#region src/agents/tool-search-runtime-config.ts
function resolveAgentToolSearchRuntimeConfig(params) {
	const runtimeConfig = resolveAgentRuntimeToolConfig(params.config);
	if (params.forceDirectMessageTool) return runtimeConfig;
	return applyLocalModelLeanToolSearchDefaults({
		config: runtimeConfig,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
}
//#endregion
//#region src/agents/tool-surface-plan.ts
function resolveAgentToolSurfacePlan(params) {
	const codeModeConfig = resolveCodeModeConfig(params.config, params.agentId);
	const toolSearchRuntimeConfig = resolveAgentToolSearchRuntimeConfig({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		forceDirectMessageTool: params.forceDirectMessageTool
	});
	const toolSearchConfig = resolveToolSearchConfig(toolSearchRuntimeConfig);
	const toolsAvailable = params.toolsEnabled && getActiveAgentRingZeroTools().length === 0 && params.disableTools !== true && !params.isRawModelRun && params.skillWorkshopProposalOnly !== true && params.toolsAllow?.length !== 0 && !(params.forceDirectMessageTool && params.toolsAllow?.length === 1 && normalizeToolPolicyName(params.toolsAllow[0] ?? "") === "message");
	const codeModeControlsEnabled = toolsAvailable && (params.forceCodeModeControls === true || isCodeModeEngagedForModel(codeModeConfig, params.model));
	return {
		codeModeControlsEnabled,
		toolSearchControlsEnabled: toolsAvailable && !codeModeControlsEnabled && toolSearchConfig.enabled,
		toolSearchConfig,
		toolSearchRuntimeConfig
	};
}
function applyAgentToolSurfaceCatalog({ codeModeControlsEnabled, toolSearchConfig, toolSearchRuntimeConfig, forceDirectMessageTool, forceCodeModeControls, ...catalogParams }) {
	const directToolNames = forceDirectMessageTool ? ["message"] : [];
	if (codeModeControlsEnabled) return applyCodeModeCatalog({
		...catalogParams,
		config: catalogParams.config,
		directToolNames,
		forceEnabled: forceCodeModeControls
	});
	return (toolSearchConfig.mode === "directory" ? applyToolSchemaDirectoryCatalog : applyToolSearchCatalog)({
		...catalogParams,
		config: toolSearchRuntimeConfig,
		directToolNames
	});
}
//#endregion
export { runCodeModeScriptHeadless as a, createCodeModeTools as i, resolveAgentToolSurfacePlan as n, CodeModeHeadlessAbortError as o, addClientToolsToCodeModeCatalog as r, CodeModeHeadlessTimeoutError as s, applyAgentToolSurfaceCatalog as t };
