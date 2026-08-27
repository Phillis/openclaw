import { Xo as OpenClawPluginApi$1, nc as PluginCommandContext$1, tc as OpenClawPluginCommandDefinition$1 } from "../agent-harness-runtime-CESurA0d.js";
import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import { n as ChannelConfigSchema } from "../types.config-CGDAHrEQ.js";
import { L as ChannelLegacyStateMigrationPlan } from "../types.adapters-BTze_x-2.js";
import { n as ChannelOutboundAdapter } from "../outbound.types-CjLqEEYw.js";
import { t as ChannelPlugin } from "../types.plugin-B_jWpFWB.js";
import { n as AnyAgentTool$1 } from "../common-Id2h5Hft.js";
import { createJiti } from "jiti";
//#region src/plugins/plugin-module-loader-cache.d.ts
type PluginModuleLoaderFactory = typeof createJiti;
//#endregion
//#region src/plugin-sdk/channel-entry-contract.types.d.ts
/** Legacy session helpers used while bundled channels migrate old session key formats. */
type BundledChannelLegacySessionSurface = {
  isLegacyGroupSessionKey?: (key: string) => boolean;
  canonicalizeLegacySessionKey?: (params: {
    key: string;
    agentId: string;
  }) => string | null | undefined;
};
/**
 * Detects channel-owned state migrations needed before a bundled channel starts.
 * @deprecated Export stateMigrations from the plugin doctor contract instead.
 * Removal plan: remove the setup-entry adapter after the 2027.1 external-plugin migration window.
 */
type BundledChannelLegacyStateMigrationDetector = (params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  oauthDir: string;
}) => ChannelLegacyStateMigrationPlan[] | Promise<ChannelLegacyStateMigrationPlan[] | null | undefined> | null | undefined;
/** Test hook for swapping the source-module loader used by bundled entry imports. */
type BundledEntryModuleLoadOptions = {
  createLoaderForTest?: PluginModuleLoaderFactory;
};
//#endregion
//#region src/plugin-sdk/channel-entry-contract.d.ts
type AnyAgentTool = AnyAgentTool$1;
type OpenClawPluginApi = OpenClawPluginApi$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type PluginCommandContext = PluginCommandContext$1;
type BundledChannelRuntime = unknown;
type ChannelEntryConfigSchema<TPlugin> = TPlugin extends ChannelPlugin<unknown> ? NonNullable<TPlugin["configSchema"]> : ChannelConfigSchema;
type BundledEntryModuleRef = {
  specifier: string;
  exportName?: string;
};
type DefineBundledChannelEntryOptions<TPlugin = ChannelPlugin> = {
  id: string;
  name: string;
  description: string;
  importMetaUrl: string;
  plugin: BundledEntryModuleRef;
  outbound?: BundledEntryModuleRef;
  secrets?: BundledEntryModuleRef;
  configSchema?: ChannelEntryConfigSchema<TPlugin> | (() => ChannelEntryConfigSchema<TPlugin>);
  runtime?: BundledEntryModuleRef;
  accountInspect?: BundledEntryModuleRef;
  features?: BundledChannelEntryFeatures;
  registerCliMetadata?: (api: OpenClawPluginApi) => void;
  registerFull?: (api: OpenClawPluginApi) => void;
  registerCapabilities?: (api: OpenClawPluginApi) => void;
};
type DefineBundledChannelSetupEntryOptions = {
  importMetaUrl: string;
  plugin: BundledEntryModuleRef;
  secrets?: BundledEntryModuleRef;
  runtime?: BundledEntryModuleRef;
  /**
   * @deprecated Export stateMigrations from the plugin doctor contract instead.
   * Removal plan: remove the setup-entry adapter after the 2027.1 external-plugin migration window.
   */
  legacyStateMigrations?: BundledEntryModuleRef;
  legacySessionSurface?: BundledEntryModuleRef;
  registerSetupRuntime?: (api: OpenClawPluginApi) => void;
  features?: BundledChannelSetupEntryFeatures;
};
/** Feature flags exposed by bundled setup entries for optional migration/session surfaces. */
type BundledChannelSetupEntryFeatures = {
  /**
   * @deprecated Declare doctorContract.stateMigrations in openclaw.plugin.json instead.
   * Removal plan: remove the setup-entry adapter after the 2027.1 external-plugin migration window.
   */
  legacyStateMigrations?: boolean;
  legacySessionSurfaces?: boolean;
};
/** Feature flags exposed by full bundled channel entries. */
type BundledChannelEntryFeatures = {
  accountInspect?: boolean;
};
/** Runtime contract returned by a bundled channel's main entrypoint definition. */
type BundledChannelEntryContract<TPlugin = ChannelPlugin> = {
  kind: "bundled-channel-entry";
  id: string;
  name: string;
  description: string;
  configSchema: ChannelConfigSchema;
  features?: BundledChannelEntryFeatures;
  register: (api: OpenClawPluginApi) => void;
  loadChannelPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
  loadChannelOutbound?: (options?: BundledEntryModuleLoadOptions) => ChannelOutboundAdapter | undefined;
  loadChannelSecrets?: (options?: BundledEntryModuleLoadOptions) => ChannelPlugin["secrets"] | undefined;
  loadChannelAccountInspector?: (options?: BundledEntryModuleLoadOptions) => NonNullable<ChannelPlugin["config"]["inspectAccount"]>;
  setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
};
/** Runtime contract returned by a bundled channel's setup-only entrypoint definition. */
type BundledChannelSetupEntryContract<TPlugin = ChannelPlugin> = {
  kind: "bundled-channel-setup-entry";
  loadSetupPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
  loadSetupSecrets?: (options?: BundledEntryModuleLoadOptions) => ChannelPlugin["secrets"] | undefined;
  loadLegacyStateMigrationDetector?: (options?: BundledEntryModuleLoadOptions) => BundledChannelLegacyStateMigrationDetector;
  loadLegacySessionSurface?: (options?: BundledEntryModuleLoadOptions) => BundledChannelLegacySessionSurface;
  setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
  registerSetupRuntime?: (api: OpenClawPluginApi) => void;
  features?: BundledChannelSetupEntryFeatures;
};
/** Loads one export from a bundled channel sidecar module through the guarded entry boundary. */
declare function loadBundledEntryExportSync<T>(importMetaUrl: string, reference: BundledEntryModuleRef, options?: BundledEntryModuleLoadOptions): T;
/** Defines the full bundled channel entry contract used by core plugin registration. */
declare function defineBundledChannelEntry<TPlugin = ChannelPlugin>({ id, name, description, importMetaUrl, plugin, outbound, secrets, configSchema, runtime, accountInspect, features, registerCliMetadata, registerFull, registerCapabilities }: DefineBundledChannelEntryOptions<TPlugin>): BundledChannelEntryContract<TPlugin>;
/** Defines the setup-only bundled channel entry contract for onboarding and migration surfaces. */
declare function defineBundledChannelSetupEntry<TPlugin = ChannelPlugin>({ importMetaUrl, plugin, secrets, runtime, legacyStateMigrations, legacySessionSurface, registerSetupRuntime, features }: DefineBundledChannelSetupEntryOptions): BundledChannelSetupEntryContract<TPlugin>;
//#endregion
export { AnyAgentTool, BundledChannelEntryContract, BundledChannelEntryFeatures, type BundledChannelLegacySessionSurface, type BundledChannelLegacyStateMigrationDetector, BundledChannelSetupEntryContract, BundledChannelSetupEntryFeatures, type BundledEntryModuleLoadOptions, OpenClawPluginApi, OpenClawPluginCommandDefinition, PluginCommandContext, defineBundledChannelEntry, defineBundledChannelSetupEntry, loadBundledEntryExportSync };