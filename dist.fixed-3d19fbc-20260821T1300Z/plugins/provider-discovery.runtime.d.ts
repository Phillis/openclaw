import { i as OpenClawConfig } from "../types.openclaw-woQof385.js";
import { r as ProviderPlugin } from "../host-capability-types-BNON-nf1.js";
import { n as PluginMetadataRegistryView } from "../plugin-metadata-snapshot.types-5OAiSPBb.js";

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