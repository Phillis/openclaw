import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as PluginLruCache } from "./plugin-cache-primitives-Q46IVR5c.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-Dfh0X01f.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { x as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-Dp7mvsA3.js";
import { t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-C-CeqUb2.js";
import { a as redactMcpServersForFingerprint, i as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-BWvd6bVQ.js";
import crypto from "node:crypto";
//#region src/agents/embedded-agent-mcp.ts
/** Loads merged MCP server config for an embedded agent workspace. */
function loadEmbeddedAgentMcpConfig(params) {
	const bundleMcp = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	return {
		mcpServers: bundleMcp.config.mcpServers,
		diagnostics: bundleMcp.diagnostics,
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-config.ts
/** Session MCP config loading, filtering, and catalog fingerprints. */
const SESSION_MCP_CONFIG_DISCOVERY_CACHE_KEY = Symbol.for("openclaw.sessionMcpConfigDiscoveryCache.pluginLru.v1");
const SESSION_MCP_CONFIG_DISCOVERY_CACHE_LIMIT = 128;
const SESSION_MCP_PREPARED_CONFIG_VARIANT_LIMIT = 64;
const EMPTY_OPENCLAW_CONFIG = {};
function getSessionMcpConfigDiscoveryCacheState() {
	return resolveGlobalSingleton(SESSION_MCP_CONFIG_DISCOVERY_CACHE_KEY, () => ({
		entries: new PluginLruCache(SESSION_MCP_CONFIG_DISCOVERY_CACHE_LIMIT),
		manifestRegistryIds: /* @__PURE__ */ new WeakMap(),
		nextManifestRegistryId: 1
	}));
}
function resolveManifestRegistryCacheId(manifestRegistry) {
	if (!manifestRegistry) return "discovered";
	const state = getSessionMcpConfigDiscoveryCacheState();
	const identity = manifestRegistry.plugins;
	const existing = state.manifestRegistryIds.get(identity);
	if (existing !== void 0) return String(existing);
	const created = state.nextManifestRegistryId;
	state.nextManifestRegistryId += 1;
	state.manifestRegistryIds.set(identity, created);
	return String(created);
}
function buildSessionMcpConfigDiscoveryCacheKey(params) {
	return JSON.stringify({
		v: 1,
		workspaceDir: params.workspaceDir,
		config: resolveRuntimeConfigCacheKey(params.cfg ?? EMPTY_OPENCLAW_CONFIG),
		manifestRegistry: resolveManifestRegistryCacheId(params.manifestRegistry),
		mcpServers: params.toolOverrides?.mcpServers ? Object.fromEntries(Object.entries(params.toolOverrides.mcpServers).toSorted(([left], [right]) => left.localeCompare(right))) : void 0
	});
}
function clonePreparedSessionMcpConfig(prepared) {
	return structuredClone(prepared);
}
function loadCachedEmbeddedAgentMcpConfig(params) {
	const state = getSessionMcpConfigDiscoveryCacheState();
	const key = buildSessionMcpConfigDiscoveryCacheKey(params);
	const cached = state.entries.get(key);
	if (cached) return cached;
	const discovered = structuredClone(loadEmbeddedAgentMcpConfig(params));
	const loaded = {
		loaded: discovered,
		preparedByVariant: new PluginLruCache(SESSION_MCP_PREPARED_CONFIG_VARIANT_LIMIT)
	};
	if (discovered.diagnostics.length > 0) return loaded;
	state.entries.set(key, loaded);
	return loaded;
}
function clearSessionMcpConfigDiscoveryCache() {
	const state = getSessionMcpConfigDiscoveryCacheState();
	state.entries.clear();
	state.manifestRegistryIds = /* @__PURE__ */ new WeakMap();
	state.nextManifestRegistryId = 1;
}
registerPluginMetadataProcessMemoLifecycleClear(clearSessionMcpConfigDiscoveryCache);
function digestSafeServerNameAssignments(safeServerNamesByServer) {
	if (!safeServerNamesByServer || safeServerNamesByServer.size === 0) return;
	return Object.fromEntries([...safeServerNamesByServer.entries()].toSorted(([a], [b]) => a.localeCompare(b)));
}
function sortedSetEntries(values) {
	return values ? [...values].toSorted((a, b) => a.localeCompare(b)) : void 0;
}
function digestMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function buildPreparedConfigVariantKey(params) {
	return JSON.stringify({
		include: sortedSetEntries(params.includeServerNames),
		exclude: sortedSetEntries(params.excludeServerNames),
		redact: sortedSetEntries(params.redactConnectionServerNames),
		safeServerNames: params.safeServerNames,
		mcpAppsEnabled: params.mcpAppsEnabled,
		mcpToolsDeny: params.mcpToolsDeny
	});
}
function createCatalogFingerprint(params) {
	return crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex");
}
function filterMcpServers(mcpServers, options) {
	if (!options?.includeServerNames && !options?.excludeServerNames) return mcpServers;
	const filtered = {};
	for (const [serverName, rawServer] of Object.entries(mcpServers)) {
		if (options.includeServerNames && !options.includeServerNames.has(serverName)) continue;
		if (options.excludeServerNames?.has(serverName)) continue;
		filtered[serverName] = rawServer;
	}
	return filtered;
}
function loadSessionMcpConfig(params) {
	const discovery = loadCachedEmbeddedAgentMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	if (params.logDiagnostics !== false) for (const diagnostic of discovery.loaded.diagnostics) logWarn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	const safeServerNames = digestSafeServerNameAssignments(params.safeServerNamesByServer);
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const mcpToolsDeny = digestMcpToolDenials(params.toolOverrides?.mcpToolsDeny);
	const variantKey = buildPreparedConfigVariantKey({
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames,
		redactConnectionServerNames: params.redactConnectionServerNames,
		safeServerNames,
		mcpAppsEnabled,
		mcpToolsDeny
	});
	const prepared = discovery.preparedByVariant.get(variantKey);
	if (prepared) return clonePreparedSessionMcpConfig(prepared);
	const mcpServers = filterMcpServers(discovery.loaded.mcpServers, {
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames
	});
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(discovery.loaded.prepareDataDirsByServer ?? {}).filter(([serverName]) => Object.hasOwn(mcpServers, serverName)));
	const fingerprintServers = params.redactConnectionServerNames?.size ? redactMcpServersForFingerprint(mcpServers, params.redactConnectionServerNames) : mcpServers;
	const result = {
		loaded: {
			...discovery.loaded,
			mcpServers,
			prepareDataDirsByServer
		},
		fingerprint: createCatalogFingerprint({
			servers: fingerprintServers,
			mcpAppsEnabled,
			...safeServerNames ? { safeServerNames } : {},
			mcpToolsDeny
		})
	};
	discovery.preparedByVariant.set(variantKey, result);
	return clonePreparedSessionMcpConfig(result);
}
/**
* Loads enabled MCP config metadata for a session without creating runtimes,
* connecting transports, or issuing MCP tools/list requests.
*/
function resolveSessionMcpConfigSummary(params) {
	const { loaded, fingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: false,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	const serverNames = Object.keys(loaded.mcpServers).toSorted((a, b) => a.localeCompare(b));
	if (serverNames.length === 0) return {
		fingerprint,
		serverNames
	};
	const safeServerNamesByServer = assignSafeServerNames(Object.keys(loaded.mcpServers));
	const { requesterScopedServerNames } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	const { fingerprint: bareRuntimeFingerprint } = loadSessionMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		logDiagnostics: false,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides,
		...requesterScopedServerNames.length > 0 ? { excludeServerNames: new Set(requesterScopedServerNames) } : {},
		safeServerNamesByServer
	});
	return {
		fingerprint: bareRuntimeFingerprint,
		serverNames
	};
}
/** Reads the enabled static MCP server set without opening transports or listing tools. */
function resolveStaticSessionMcpServerNames(params) {
	const { loaded } = loadSessionMcpConfig({
		...params,
		logDiagnostics: false
	});
	const { staticServers } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	return Object.keys(staticServers).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { loadEmbeddedAgentMcpConfig as i, resolveSessionMcpConfigSummary as n, resolveStaticSessionMcpServerNames as r, loadSessionMcpConfig as t };
