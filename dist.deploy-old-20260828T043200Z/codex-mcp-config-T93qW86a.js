import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import "./utils-Bw16L5tB.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-dw5fHLEW.js";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-DN-1vGHC.js";
import { n as prepareOwnedBundleMcpDataDirs } from "./bundle-mcp-config-Dw_JTNQo.js";
import { i as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-z5xoSssd.js";
import { i as resolveProjectedMcpCodexToolApprovalMode } from "./mcp-codex-tool-approval-qXI1z_QK.js";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-DvUzWxBA.js";
import crypto from "node:crypto";
//#region src/agents/bundle-mcp-adapter.ts
function normalizeMcpStringRecord(value) {
	if (!isRecord(value)) return;
	const entries = Object.entries(value).filter((entry) => {
		return typeof entry[1] === "string";
	});
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function decodeHeaderEnvPlaceholder(value) {
	const match = /^(Bearer )?\${([A-Z0-9_]+)}$/.exec(value);
	return match?.[2] ? {
		envVar: match[2],
		bearer: Boolean(match[1])
	} : null;
}
const COMMON_STRING_FIELDS = [
	"command",
	"cwd",
	"url"
];
function normalizeBundleMcpServerConfig(server, fields = {}) {
	const next = {};
	for (const field of [...COMMON_STRING_FIELDS, ...fields.strings ?? []]) if (typeof server[field] === "string") next[field] = server[field];
	for (const field of fields.booleans ?? []) if (typeof server[field] === "boolean") next[field] = server[field];
	const args = Array.isArray(server.args) && server.args.every((entry) => typeof entry === "string") ? [...server.args] : void 0;
	if (args) next.args = args;
	const env = normalizeMcpStringRecord(server.env);
	if (env) next.env = env;
	return next;
}
//#endregion
//#region src/agents/codex-mcp-config.ts
/**
* Projects enabled bundle MCP servers into Codex app-server thread config.
* The projection keeps loopback approval defaults and header env placeholders
* compatible with Codex's MCP config shape.
*/
function assertCodexExactToolFilters(serverName, fieldName, patterns) {
	const wildcard = patterns.find((pattern) => pattern.includes("*"));
	if (!wildcard) return;
	throw new Error(`Cannot project mcp.servers.${serverName}.toolFilter.${fieldName} pattern "${wildcard}" into Codex ${fieldName === "include" ? "enabled_tools" : "disabled_tools"}: Codex MCP projection only supports exact tool names.`);
}
function applyCodexToolFilter(next, name, server) {
	if (!isRecord(server.toolFilter)) return;
	const include = normalizeTrimmedStringList(server.toolFilter.include);
	const exclude = normalizeTrimmedStringList(server.toolFilter.exclude);
	assertCodexExactToolFilters(name, "include", include);
	assertCodexExactToolFilters(name, "exclude", exclude);
	if (include.length > 0) next.enabled_tools = include;
	if (exclude.length > 0) next.disabled_tools = exclude;
}
/** Adds exact session denials to a server's configured filter before Codex projection. */
function applyCodexSessionMcpToolDenials(name, server, toolOverrides) {
	const denialMap = toolOverrides?.mcpToolsDeny;
	const denied = denialMap && Object.hasOwn(denialMap, name) ? denialMap[name] : void 0;
	if (!denied?.length) return server;
	const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
	const existing = normalizeTrimmedStringList(toolFilter.exclude);
	return {
		...server,
		toolFilter: {
			...toolFilter,
			exclude: [.../* @__PURE__ */ new Set([...existing, ...denied])].toSorted()
		}
	};
}
/** Normalizes one bundle MCP server into Codex's mcp_servers shape. */
function normalizeCodexMcpServerConfig(name, server) {
	const next = normalizeBundleMcpServerConfig(server);
	applyCodexToolFilter(next, name, server);
	const defaultToolsApprovalMode = resolveProjectedMcpCodexToolApprovalMode(name, server);
	if (defaultToolsApprovalMode) next.default_tools_approval_mode = defaultToolsApprovalMode;
	const httpHeaders = normalizeMcpStringRecord(server.headers);
	if (httpHeaders) {
		const staticHeaders = {};
		const envHeaders = {};
		for (const [nameLocal, value] of Object.entries(httpHeaders)) {
			const decoded = decodeHeaderEnvPlaceholder(value);
			if (!decoded) {
				staticHeaders[nameLocal] = value;
				continue;
			}
			if (decoded.bearer && normalizeOptionalLowercaseString(nameLocal) === "authorization") {
				next.bearer_token_env_var = decoded.envVar;
				continue;
			}
			envHeaders[nameLocal] = decoded.envVar;
		}
		if (Object.keys(staticHeaders).length > 0) next.http_headers = staticHeaders;
		if (Object.keys(envHeaders).length > 0) next.env_http_headers = envHeaders;
	}
	return next;
}
/**
* Build Codex `mcp_servers` config from normalized bundle MCP config.
* Requester-scoped servers are excluded: harness-native MCP clients are
* session-shared and must never dial placeholder or requester-bound URLs.
*/
function buildCodexMcpServersConfig(config) {
	const { staticServers } = partitionMcpServersByConnectionScope(config.mcpServers);
	return Object.fromEntries(Object.entries(staticServers).map(([name, server]) => [name, normalizeCodexMcpServerConfig(name, server)]));
}
function stableJsonValue(value) {
	if (Array.isArray(value)) return value.map(stableJsonValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, child]) => [key, stableJsonValue(child)]));
}
function fingerprintCodexMcpServersConfig(config) {
	return crypto.createHash("sha256").update(JSON.stringify(stableJsonValue(config))).digest("hex");
}
/** Load bundle MCP config for one Codex app-server thread. */
function loadCodexBundleMcpThreadConfigCore(params) {
	if (!shouldCreateBundleMcpRuntimeForAttempt({
		toolsEnabled: params.toolsEnabled ?? true,
		disableTools: params.disableTools,
		toolsAllow: params.toolsAllow
	})) return {
		diagnostics: [],
		evaluated: true,
		staticServerNames: [],
		userStaticServerNames: []
	};
	const bundleMcp = loadEnabledBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const serverOverrides = params.toolOverrides?.mcpServers;
	const effectiveConfig = { mcpServers: Object.fromEntries(Object.entries(bundleMcp.config.mcpServers).filter(([name]) => {
		const override = serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
		return override !== false && (override === true || configuredMcp[name]?.enabled !== false);
	}).map(([name, server]) => [name, applyCodexSessionMcpToolDenials(name, server, params.toolOverrides)])) };
	const enabledConfiguredMcp = Object.fromEntries(Object.entries(configuredMcp).filter(([name, server]) => {
		const override = serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
		return override !== false && (override === true || server.enabled !== false);
	}));
	const { staticServers: configuredStaticServers } = partitionMcpServersByConnectionScope({
		...effectiveConfig.mcpServers,
		...enabledConfiguredMcp
	});
	const { staticServers: userStaticServers } = partitionMcpServersByConnectionScope(enabledConfiguredMcp);
	const staticServerNames = Object.keys(configuredStaticServers).toSorted((left, right) => left.localeCompare(right));
	const userStaticServerNames = Object.keys(userStaticServers).toSorted((left, right) => left.localeCompare(right));
	const preparedDataDirs = prepareOwnedBundleMcpDataDirs({
		config: effectiveConfig,
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer ?? {}
	});
	const diagnostics = [...bundleMcp.diagnostics, ...preparedDataDirs.diagnostics];
	const mcpServers = buildCodexMcpServersConfig(preparedDataDirs.config);
	if (Object.keys(mcpServers).length === 0) return {
		diagnostics,
		evaluated: true,
		staticServerNames,
		userStaticServerNames
	};
	return {
		configPatch: { mcp_servers: mcpServers },
		diagnostics,
		evaluated: true,
		fingerprint: fingerprintCodexMcpServersConfig(mcpServers),
		staticServerNames,
		userStaticServerNames
	};
}
//#endregion
export { decodeHeaderEnvPlaceholder as a, normalizeCodexMcpServerConfig as i, buildCodexMcpServersConfig as n, normalizeBundleMcpServerConfig as o, loadCodexBundleMcpThreadConfigCore as r, normalizeMcpStringRecord as s, applyCodexSessionMcpToolDenials as t };
