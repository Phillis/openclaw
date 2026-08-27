import { Bn as PluginLoadOptions, Ln as isPluginProvidersLoadInFlight, Rn as resolvePluginProvidersCore, qo as augmentModelCatalogWithProviderPlugins } from "../agent-harness-runtime-CESurA0d.js";
import "../types.openclaw-CflOMr0r.js";
import { n as PluginManifestRegistry } from "../manifest-registry-fJ5PmDA1.js";
import { i as InstalledPluginIndex, n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-DRFVcTqK.js";
import "../io-hfuWZaKF.js";
import "../config-state-B-AYiIBk.js";
//#region src/plugins/plugin-registry-snapshot.d.ts
type PluginRegistrySnapshot = InstalledPluginIndex;
//#endregion
//#region src/plugins/providers.d.ts
type ProviderManifestLoadParams = {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  registry?: PluginRegistrySnapshot;
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry"> & Partial<Pick<PluginMetadataSnapshot, "owners" | "byPluginId">>;
};
type ProviderOwnershipLookupParams = {
  provider: string;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "owners" | "manifestRegistry" | "byPluginId">;
};
declare function resolveOwningPluginIdsForProvider(params: ProviderOwnershipLookupParams): string[] | undefined;
declare function resolveCatalogHookProviderPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  metadataSnapshot?: ProviderManifestLoadParams["metadataSnapshot"];
}): string[];
//#endregion
export { augmentModelCatalogWithProviderPlugins, isPluginProvidersLoadInFlight, resolveCatalogHookProviderPluginIds, resolveOwningPluginIdsForProvider, resolvePluginProvidersCore };