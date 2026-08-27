import { i as OpenClawPluginApi$1 } from "./plugin-entry-CX5-Xb96.js";
import { n as OpenClawConfig } from "./types.openclaw-BZZbt-SF.js";
import { E as ChannelConfigSchema } from "./target-registry-types-B_YdM07w.js";
import { ct as ChannelLegacyStateMigrationPlan, k as ChannelOutboundAdapter } from "./setup-wizard-types-D9afUG0f.js";
import { t as ChannelPlugin } from "./types.public-DZji4RDV.js";
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
type OpenClawPluginApi = OpenClawPluginApi$1;
type BundledChannelRuntime = unknown;
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
//#endregion
export { BundledChannelSetupEntryContract as n, BundledChannelEntryContract as t };