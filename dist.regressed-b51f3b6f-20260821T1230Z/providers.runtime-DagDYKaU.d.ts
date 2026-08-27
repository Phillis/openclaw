import { t as PluginMetadataRegistryView } from "./plugin-metadata-snapshot.types-C7yXs8r5.js";
import { x as ProviderPlugin } from "./host-capability-types-BQXGgYpD.js";
import { t as PluginLoadOptions } from "./loader-EbSG79FY.js";
import { DatabaseSync } from "node:sqlite";

//#region src/plugins/providers.runtime.d.ts
declare function isPluginProvidersLoadInFlight(params: Parameters<typeof resolvePluginProvidersCore>[0]): boolean;
declare function resolvePluginProvidersCore(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string; /** Use an explicit env when plugin roots should resolve independently from process.env. */
  env?: PluginLoadOptions["env"]; /** @deprecated Ignored; tests must provide explicit plugin config. Remove in the next major release. */
  bundledProviderVitestCompat?: boolean;
  onlyPluginIds?: string[];
  providerRefs?: readonly string[];
  modelRefs?: readonly string[];
  activate?: boolean;
  cache?: boolean;
  applyAutoEnable?: boolean;
  pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
  mode?: "runtime" | "setup";
  includeUntrustedWorkspacePlugins?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
  skipIfLoadInFlight?: boolean;
}): ProviderPlugin[];
//#endregion
export { resolvePluginProvidersCore as n, isPluginProvidersLoadInFlight as t };