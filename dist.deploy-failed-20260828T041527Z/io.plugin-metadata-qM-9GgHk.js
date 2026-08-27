import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-DDoSjKHs.js";
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
	const workspaceDirs = dirs.length ? dirs : [void 0];
	const resolveSnapshot = (workspaceDir) => resolvePluginMetadataSnapshot({
		config: params.config,
		...workspaceDir ? { workspaceDir } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		env,
		allowCurrent: params.allowCurrent,
		allowWorkspaceScopedCurrent: true,
		...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
		...params.pluginIdScope ? { pluginIdScope: params.pluginIdScope } : {}
	});
	const firstSnapshot = resolveSnapshot(workspaceDirs[0]);
	const manifestRegistry = mergeRegistries([firstSnapshot, ...workspaceDirs.slice(1).map(resolveSnapshot)].map((snapshot) => snapshot.manifestRegistry));
	params.onSnapshotResolved?.(firstSnapshot);
	return manifestRegistry;
}
//#endregion
export { resolveConfigWidePluginManifestRegistry as t };
