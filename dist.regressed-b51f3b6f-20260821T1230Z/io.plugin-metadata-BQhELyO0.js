import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-BL3eAChG.js";
//#region src/config/io.plugin-metadata.ts
function mergeRegistries(registries) {
	const grouped = /* @__PURE__ */ new Map();
	const diagnostics = registries.flatMap((registry) => registry.diagnostics);
	for (const registry of registries) for (const plugin of registry.plugins) {
		const id = normalizePluginPolicyId(plugin.id);
		const group = grouped.get(id) ?? {
			plugin,
			sources: /* @__PURE__ */ new Set()
		};
		group.plugin = plugin;
		group.sources.add(plugin.source);
		grouped.set(id, group);
	}
	return {
		plugins: [...grouped.entries()].flatMap(([pluginId, group]) => {
			if (group.sources.size === 1) return [group.plugin];
			diagnostics.push({
				level: "error",
				pluginId,
				message: `plugin id ${JSON.stringify(pluginId)} is present in multiple agent workspaces: ${[...group.sources].toSorted().join(", ")}`
			});
			return [];
		}),
		diagnostics
	};
}
function resolveConfigWidePluginManifestRegistry(params) {
	const env = params.env ?? process.env;
	const dirs = listAgentWorkspaceDirs(params.config, env);
	return mergeRegistries((dirs.length ? dirs : [void 0]).map((workspaceDir) => resolvePluginMetadataSnapshot({
		config: params.config,
		...workspaceDir ? { workspaceDir } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		env,
		allowCurrent: params.allowCurrent,
		allowWorkspaceScopedCurrent: true,
		...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
		...params.pluginIdScope ? { pluginIdScope: params.pluginIdScope } : {}
	}).manifestRegistry));
}
//#endregion
export { resolveConfigWidePluginManifestRegistry as t };
