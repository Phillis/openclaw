import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { C as PluginManifestProviderRequestProvider, S as PluginManifestProviderEndpoint, h as PluginDiagnostic, i as PluginDiscoveryResult, n as PluginManifestRegistry, t as PluginManifestRecord } from "./manifest-registry-DsWy3jGA.js";
import { t as InstalledPluginIndex } from "./installed-plugin-index-types-C4mEs_4Z.js";

//#region src/plugins/plugin-registry-snapshot.types.d.ts
/** Source class for plugin registry snapshots used by diagnostics and cache decisions. */
type PluginRegistrySnapshotSource = "provided" | "persisted" | "derived";
//#endregion
//#region src/plugins/plugin-metadata-snapshot.types.d.ts
type PluginMetadataSnapshotPluginIdScope = {
  key: string;
  resolve: (params: {
    index: InstalledPluginIndex;
  }) => readonly string[] | undefined;
};
type PluginMetadataSnapshotOwnerMaps = {
  channels: ReadonlyMap<string, readonly string[]>;
  channelConfigs: ReadonlyMap<string, readonly string[]>;
  providers: ReadonlyMap<string, readonly string[]>;
  modelCatalogProviders: ReadonlyMap<string, readonly string[]>;
  cliBackends: ReadonlyMap<string, readonly string[]>;
  setupProviders: ReadonlyMap<string, readonly string[]>;
  commandAliases: ReadonlyMap<string, readonly string[]>;
  contracts: ReadonlyMap<string, readonly string[]>;
  providerEndpoints?: readonly PluginManifestProviderEndpoint[];
  providerRequests?: ReadonlyMap<string, PluginManifestProviderRequestProvider>;
};
type PluginMetadataSnapshotMetrics = {
  registrySnapshotMs: number;
  manifestRegistryMs: number;
  ownerMapsMs: number;
  totalMs: number;
  indexPluginCount: number;
  manifestPluginCount: number;
};
type PluginMetadataSnapshotRegistryDiagnostic = {
  level: "info" | "warn";
  code: "persisted-registry-missing" | "persisted-registry-stale-policy" | "persisted-registry-stale-source";
  message: string;
};
type PluginMetadataSnapshot = {
  policyHash: string;
  configFingerprint?: string;
  pluginIds?: readonly string[];
  registrySource?: PluginRegistrySnapshotSource;
  workspaceDir?: string;
  index: InstalledPluginIndex;
  registryDiagnostics: readonly PluginMetadataSnapshotRegistryDiagnostic[];
  manifestRegistry: PluginManifestRegistry;
  plugins: readonly PluginManifestRecord[];
  diagnostics: readonly PluginDiagnostic[];
  byPluginId: ReadonlyMap<string, PluginManifestRecord>;
  normalizePluginId: (pluginId: string) => string;
  owners: PluginMetadataSnapshotOwnerMaps;
  metrics: PluginMetadataSnapshotMetrics;
  discovery?: PluginDiscoveryResult;
};
type PluginMetadataRegistryView = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "discovery">;
type PluginMetadataManifestView = Pick<PluginMetadataSnapshot, "index" | "plugins">;
type LoadPluginMetadataSnapshotParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  stateDir?: string;
  env?: NodeJS.ProcessEnv;
  index?: InstalledPluginIndex;
  pluginIds?: readonly string[];
  pluginIdScope?: PluginMetadataSnapshotPluginIdScope;
  preferPersisted?: boolean;
  allowCurrent?: boolean;
};
type ResolvePluginMetadataSnapshotParams = LoadPluginMetadataSnapshotParams & {
  allowWorkspaceScopedCurrent?: boolean;
  workspacePluginRootPresent?: boolean;
};
//#endregion
export { ResolvePluginMetadataSnapshotParams as a, PluginMetadataSnapshotOwnerMaps as i, PluginMetadataRegistryView as n, PluginMetadataSnapshot as r, PluginMetadataManifestView as t };