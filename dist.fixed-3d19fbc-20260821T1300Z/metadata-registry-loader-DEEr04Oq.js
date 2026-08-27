import { o as hasExplicitPluginIdScope } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { n as loadPluginRegistryHandle } from "./loader-BIAS8vL1.js";
import { i as resolvePluginRuntimeLoadContext, t as buildPluginRuntimeLoadOptions } from "./load-context-DCsonorK.js";
//#region src/plugins/runtime/metadata-registry-loader.ts
/** Loads a non-activated plugin metadata registry snapshot for validation/status callers. */
function loadPluginMetadataRegistrySnapshot(options) {
	return loadPluginRegistryHandle(buildPluginRuntimeLoadOptions(options?.runtimeContext ?? resolvePluginRuntimeLoadContext(options), {
		...options?.config !== void 0 ? { config: options.config } : {},
		...options?.activationSourceConfig !== void 0 ? { activationSourceConfig: options.activationSourceConfig } : {},
		...options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {},
		...options?.env !== void 0 ? { env: options.env } : {},
		...options?.logger !== void 0 ? { logger: options.logger } : {},
		throwOnLoadError: true,
		cache: false,
		mode: "validate",
		loadModules: options?.loadModules,
		...hasExplicitPluginIdScope(options?.onlyPluginIds) ? { onlyPluginIds: options?.onlyPluginIds } : {},
		...options?.manifestRegistry ? { manifestRegistry: options.manifestRegistry } : {}
	}));
}
//#endregion
export { loadPluginMetadataRegistrySnapshot as t };
