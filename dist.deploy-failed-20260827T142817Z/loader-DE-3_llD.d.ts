import { i as PluginInstallRecord, r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { n as PluginManifestRegistry, r as PluginDiscoveryResult } from "./manifest-registry-CRuFk5Rs.js";
import { Si as CreatePluginRuntimeOptions, ei as PluginRegistryParams, tt as PluginLogger } from "./host-capability-types-3XBDy-df.js";
import { n as GatewayRequestHandler } from "./types-4_wTt5Pv.js";
//#region src/plugins/sdk-alias.d.ts
type PluginSdkResolutionPreference = "auto" | "dist" | "src";
//#endregion
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
export { PluginLoadOptions as t };