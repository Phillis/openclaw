import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { o as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { t as createEmptyPluginRegistry } from "./registry-empty-55wlVNzO.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/runtime/generation-scope.ts
const pluginRuntimeGenerationRegistryScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeGenerationRegistryScope"), () => new AsyncLocalStorage());
/** Carries one prepared plugin generation through all nested runtime lookups. */
function withPluginRuntimeGenerationScope(generation, run) {
	const pluginRegistry = generation.pluginRegistry ?? createEmptyPluginRegistry();
	return withPluginMetadataSnapshotScope(generation.metadataSnapshot, () => pluginRuntimeGenerationRegistryScope.run(pluginRegistry, () => withPluginRuntimeRegistryScope(pluginRegistry, run)), {
		config: generation.config,
		trustConfigIdentity: true,
		...generation.metadataSnapshot.workspaceDir ? { workspaceDir: generation.metadataSnapshot.workspaceDir } : {}
	});
}
/** Exact registry owned by the prepared generation, when one is active. */
function getPluginRuntimeGenerationRegistry() {
	return pluginRuntimeGenerationRegistryScope.getStore();
}
//#endregion
export { withPluginRuntimeGenerationScope as n, getPluginRuntimeGenerationRegistry as t };
