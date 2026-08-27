import { i as OpenClawConfig } from "../types.openclaw-ClnaeuRs.js";
import { Ct as ProviderPlugin } from "../types-Hf0Z4d9b.js";
import { n as PluginMetadataRegistryView } from "../plugin-metadata-snapshot.types-Unqs8JMC.js";
//#region src/plugins/provider-discovery.runtime.d.ts
declare function resolvePluginDiscoveryProvidersRuntime(params: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  onlyPluginIds?: string[];
  includeUntrustedWorkspacePlugins?: boolean;
  requireCompleteDiscoveryEntryCoverage?: boolean;
  discoveryEntriesOnly?: boolean;
  includeManifestModelCatalogProviders?: boolean;
  includeSyntheticAuthProviders?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
}): ProviderPlugin[];
//#endregion
export { resolvePluginDiscoveryProvidersRuntime };