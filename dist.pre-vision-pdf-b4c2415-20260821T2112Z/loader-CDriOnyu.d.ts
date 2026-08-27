import { i as OpenClawConfig, p as PluginInstallRecord } from "./types.openclaw-woQof385.js";
import { A as PluginRegistry, N as CreatePluginRuntimeOptions, j as PluginRegistryParams, s as PluginLogger, wt as GatewayRequestHandler } from "./host-capability-types-DIfTL8Xi.js";
import { i as PluginDiscoveryResult, n as PluginManifestRegistry } from "./manifest-registry-DsWy3jGA.js";
import { n as PluginSdkResolutionPreference } from "./sdk-alias-BCnO7Df6.js";
import { Type } from "typebox";
import { z } from "zod";

//#region src/plugins/loader-types.d.ts
type ChannelPluginLoadIntent = "full" | "setup";
/** Inputs shared by runtime, snapshot, and CLI-metadata plugin loading. */
type PluginLoadOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  autoEnabledReasons?: Readonly<Record<string, string[]>>;
  workspaceDir?: string;
  installRecords?: Record<string, PluginInstallRecord>; /** Resolve plugin roots and load paths against an explicit environment. */
  env?: NodeJS.ProcessEnv; /** Apply the config IO env-substitution pass to direct raw-config callers. */
  resolveRawConfigEnvVars?: boolean;
  logger?: PluginLogger;
  coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
  coreGatewayMethodNames?: readonly string[]; /** Registry-construction fact supplied by the process composition root. */
  allowProcessHomeSessionCatalogs?: boolean;
  hostServices?: PluginRegistryParams["hostServices"];
  runtimeOptions?: CreatePluginRuntimeOptions;
  startupTrace?: {
    detail: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
  };
  pluginSdkResolution?: PluginSdkResolutionPreference;
  cache?: boolean;
  mode?: "full" | "validate";
  onlyPluginIds?: string[];
  includeSetupOnlyChannelPlugins?: boolean;
  forceSetupOnlyChannelPlugins?: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins?: boolean; /** Select full runtime registration or the lightweight unconfigured-channel setup path. */
  channelPluginLoadIntent?: ChannelPluginLoadIntent; /** Prefer bundled JavaScript artifacts over source TypeScript entrypoints. */
  preferBuiltPluginArtifacts?: boolean;
  toolDiscovery?: boolean;
  activate?: boolean;
  loadModules?: boolean;
  throwOnLoadError?: boolean;
  manifestRegistry?: PluginManifestRegistry;
  discovery?: PluginDiscoveryResult;
};
//#endregion
//#region src/plugins/loader-cache.d.ts
declare function clearPluginRegistryLoadCache(): void;
declare function resolvePluginRegistryLoadCacheKey(options?: PluginLoadOptions): string;
declare function isPluginRegistryLoadInFlight(options?: PluginLoadOptions): boolean;
//#endregion
//#region src/plugins/loader-cli-registry.d.ts
declare function loadOpenClawPluginCliRegistry(options?: PluginLoadOptions): Promise<PluginRegistry>;
//#endregion
//#region src/plugins/loader-runtime-registry.d.ts
declare function resolveRuntimePluginRegistry(options?: PluginLoadOptions): PluginRegistry | undefined;
declare function getRuntimePluginRegistryForLoadOptions(options?: PluginLoadOptions): PluginRegistry | undefined;
/** Return the exact active registry without triggering a fresh load on cache miss. */
declare function resolveCompatibleRuntimePluginRegistry(options?: PluginLoadOptions): PluginRegistry | undefined;
//#endregion
//#region src/plugins/loader-runtime-load.d.ts
declare function loadOpenClawPlugins(options?: PluginLoadOptions): PluginRegistry;
//#endregion
//#region src/plugins/loader.d.ts
/** Loads a caller-owned registry value without changing the process-wide active registry. */
declare function loadPluginRegistryHandle(options?: PluginLoadOptions): PluginRegistry;
/** Loads and installs the registry owned by a process composition root. */
declare function loadAndActivateRootPluginRegistry(options?: PluginLoadOptions): PluginRegistry;
//#endregion
export { resolveCompatibleRuntimePluginRegistry as a, clearPluginRegistryLoadCache as c, PluginLoadOptions as d, getRuntimePluginRegistryForLoadOptions as i, isPluginRegistryLoadInFlight as l, loadPluginRegistryHandle as n, resolveRuntimePluginRegistry as o, loadOpenClawPlugins as r, loadOpenClawPluginCliRegistry as s, loadAndActivateRootPluginRegistry as t, resolvePluginRegistryLoadCacheKey as u };