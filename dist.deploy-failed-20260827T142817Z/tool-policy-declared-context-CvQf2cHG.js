import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-B1YRfQOc.js";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-CrqljM7B.js";
import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
import { i as sanitizeServerName } from "./agent-bundle-mcp-names-Dfh0X01f.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cg4Pldzy.js";
import { n as isPluginMetadataSnapshotCompatible } from "./plugin-metadata-snapshot-BfWhFzZN.js";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-DppTp7ET.js";
import { t as hasManifestToolAvailability } from "./manifest-tool-availability-yzMRnN3e.js";
//#region src/agents/tool-policy-declared-context.ts
function normalizeToolDenylist(list) {
	return compileGlobPatterns({
		raw: list,
		normalize: normalizeToolPolicyName
	});
}
function denylistBlocksName(name, denylist) {
	const normalized = normalizeToolPolicyName(name);
	return normalized ? matchesAnyGlobPattern(normalized, denylist) : false;
}
function denylistBlocksMcpServerNamespace(params) {
	const serverPrefix = normalizeToolPolicyName(params.safeServerName + "__");
	if (!serverPrefix) return false;
	return matchesAnyGlobPattern(serverPrefix, params.denylist);
}
function denylistBlocksMcpServer(params) {
	return denylistBlocksName("bundle-mcp", params.denylist) || matchesAnyGlobPattern("group:plugins", params.denylist) || denylistBlocksMcpServerNamespace({
		safeServerName: params.safeServerName,
		denylist: params.denylist
	});
}
function denylistBlocksPlugin(params) {
	return denylistBlocksName(params.pluginId, params.denylist) || matchesAnyGlobPattern("group:plugins", params.denylist);
}
function denylistBlocksPluginTool(params) {
	return denylistBlocksPlugin({
		pluginId: params.pluginId,
		denylist: params.denylist
	}) || denylistBlocksName(params.toolName, params.denylist);
}
function collectConfiguredMcpServerNames(params) {
	const servers = normalizeConfiguredMcpServers(params.config?.mcp?.servers);
	const denylist = normalizeToolDenylist(params.toolDenylist);
	const usedServerNames = /* @__PURE__ */ new Set();
	const names = [];
	for (const [name, value] of Object.entries(servers)) {
		if (!isRecord(value) || value.enabled === false || !name.trim()) continue;
		const safeServerName = sanitizeServerName(name, usedServerNames);
		if (denylistBlocksMcpServer({
			safeServerName,
			denylist
		})) continue;
		names.push(safeServerName);
	}
	return names;
}
function collectAvailableManifestToolNames(params) {
	return (params.plugin.contracts?.tools ?? []).filter((toolName) => !denylistBlocksPluginTool({
		pluginId: params.plugin.id,
		toolName,
		denylist: params.denylist
	})).filter((toolName) => hasManifestToolAvailability({
		plugin: params.plugin,
		toolNames: [toolName],
		config: params.config,
		env: params.env
	})).map(normalizeToolPolicyName).filter(Boolean);
}
function collectDeclaredPluginContext(params) {
	if (params.config?.plugins?.enabled === false) return {};
	const env = params.env ?? process.env;
	const snapshot = (params.metadataSnapshot && params.metadataSnapshot.pluginIds === void 0 && isPluginMetadataSnapshotCompatible({
		snapshot: params.metadataSnapshot,
		config: params.config,
		env,
		workspaceDir: params.workspaceDir
	}) ? params.metadataSnapshot : void 0) ?? getCurrentPluginMetadataSnapshot({
		config: params.config,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		env
	});
	if (!snapshot) return {};
	const normalizedPlugins = normalizePluginsConfig(params.config?.plugins);
	const denylist = normalizeToolDenylist(params.toolDenylist);
	const pluginIds = /* @__PURE__ */ new Set();
	const pluginToolNames = /* @__PURE__ */ new Set();
	for (const plugin of snapshot.manifestRegistry.plugins) {
		if (!isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.config
		}) || normalizedPlugins.entries[plugin.id]?.enabled === false || normalizedPlugins.deny.includes(plugin.id) || denylistBlocksPlugin({
			pluginId: plugin.id,
			denylist
		})) continue;
		const availableToolNames = collectAvailableManifestToolNames({
			plugin,
			config: params.config,
			env,
			denylist
		});
		if (availableToolNames.length === 0) continue;
		pluginIds.add(plugin.id);
		for (const toolName of availableToolNames) pluginToolNames.add(toolName);
	}
	return {
		pluginIds,
		pluginToolNames
	};
}
function buildDeclaredToolAllowlistContext(params) {
	const mcpServerNames = uniqueStrings(collectConfiguredMcpServerNames({
		config: params.config,
		toolDenylist: params.toolDenylist
	}));
	const pluginContext = collectDeclaredPluginContext(params);
	const pluginIds = uniqueStrings(pluginContext.pluginIds ?? []);
	const pluginToolNames = uniqueStrings(pluginContext.pluginToolNames ?? []);
	if (mcpServerNames.length === 0 && pluginIds.length === 0 && pluginToolNames.length === 0) return;
	return {
		...pluginIds.length > 0 ? { pluginIds } : {},
		...pluginToolNames.length > 0 ? { pluginToolNames } : {},
		...mcpServerNames.length > 0 ? { mcpServerNames } : {}
	};
}
//#endregion
export { buildDeclaredToolAllowlistContext as t };
