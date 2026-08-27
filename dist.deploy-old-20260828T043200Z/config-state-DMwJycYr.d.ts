import { i as OpenClawConfig } from "./types.openclaw-ClnaeuRs.js";
import { t as NormalizedPluginsConfig$1 } from "./config-normalization-shared-Cl2Pix2b.js";
//#region src/plugins/config-activation-shared.d.ts
type PluginActivationSource = "disabled" | "explicit" | "auto" | "default";
type PluginActivationConfigLike = {
  enabled: boolean;
  allow: readonly string[];
  deny: readonly string[];
  slots: {
    memory?: string | null;
    contextEngine?: string | null;
  };
  entries: Record<string, {
    enabled?: boolean;
  } | undefined>;
};
type PluginActivationConfigSourceLike<TRootConfig> = {
  plugins: PluginActivationConfigLike;
  rootConfig?: TRootConfig;
};
//#endregion
//#region src/plugins/config-state.d.ts
type PluginActivationConfigSource = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
} & PluginActivationConfigSourceLike<OpenClawConfig>;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
declare const normalizePluginsConfig: (config?: OpenClawConfig["plugins"]) => NormalizedPluginsConfig;
declare function createPluginActivationSource(params: {
  config?: OpenClawConfig;
  plugins?: NormalizedPluginsConfig;
}): PluginActivationConfigSource;
//#endregion
export { normalizePluginsConfig as n, PluginActivationSource as r, createPluginActivationSource as t };