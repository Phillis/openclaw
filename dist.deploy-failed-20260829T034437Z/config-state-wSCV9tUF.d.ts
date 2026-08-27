import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
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
//#region src/plugins/config-normalization-shared.d.ts
/** Canonical plugin config shape consumed by runtime policy and loaders. */
type NormalizedPluginsConfig$1 = {
  enabled: boolean;
  allow: string[];
  deny: string[];
  loadPaths: string[];
  slots: {
    memory?: string | null;
    contextEngine?: string | null;
  };
  entries: Record<string, {
    enabled?: boolean;
    hooks?: {
      allowPromptInjection?: boolean;
      allowConversationAccess?: boolean;
      timeoutMs?: number;
      timeouts?: Record<string, number>;
    };
    subagent?: {
      allowModelOverride?: boolean;
      allowedModels?: string[];
      hasAllowedModelsConfig?: boolean;
    };
    llm?: {
      allowModelOverride?: boolean;
      allowedModels?: string[];
      hasAllowedModelsConfig?: boolean;
      allowedCompletionModels?: string[];
      hasAllowedCompletionModelsConfig?: boolean;
      allowAuthProfileOverride?: boolean;
      allowAgentIdOverride?: boolean;
    };
    config?: unknown;
  }>;
};
//#endregion
//#region src/plugins/config-state.d.ts
type PluginActivationConfigSource = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
} & PluginActivationConfigSourceLike<OpenClawConfig>;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
declare const normalizePluginsConfig: (config?: OpenClawConfig["plugins"]) => NormalizedPluginsConfig;
type EffectiveActivationParams = {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
};
declare const resolveEffectiveEnableState: (params: EffectiveActivationParams) => {
  enabled: boolean;
  reason?: string;
};
//#endregion
export { resolveEffectiveEnableState as n, PluginActivationSource as r, normalizePluginsConfig as t };