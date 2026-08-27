import { r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { t as PluginManifestRecord } from "./manifest-registry-yhz__ZXy.js";
import { n as ThinkLevel } from "./thinking.shared-Dn7xz8fk.js";
import { t as ModelCatalogEntry } from "./model-catalog.types-CNC2UliR.js";

//#region src/agents/model-ref-shared.d.ts
type ModelRef = {
  provider: string;
  model: string;
};
type ModelManifestNormalizationContext = {
  manifestPlugins?: readonly Pick<PluginManifestRecord, "modelIdNormalization">[];
};
//#endregion
//#region src/agents/model-selection-config.d.ts
declare function resolveDefaultModelForAgent(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): ModelRef;
//#endregion
//#region src/agents/model-thinking-default.d.ts
/** Resolves the default thinking level for a provider/model pair. */
declare function resolveThinkingDefault(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  catalog?: ModelCatalogEntry[];
  agentRuntime?: string | null;
}): ThinkLevel;
/** Resolves thinking default after loading runtime catalog only when needed. */
declare function resolveThinkingDefaultWithRuntimeCatalog(params: {
  cfg: OpenClawConfig;
  provider: string;
  model: string;
  loadRuntimeCatalog: () => Promise<ModelCatalogEntry[]>;
  agentRuntime?: string | null;
}): Promise<ThinkLevel>;
//#endregion
//#region src/agents/model-selection-normalize.d.ts
type ModelRefNormalizeOptions = ModelManifestNormalizationContext & {
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
};
/** Find a provider value by normalized provider ID. */
declare function findNormalizedProviderValue<T>(entries: Record<string, T> | undefined, provider: string): T | undefined;
/** Parse `provider/model` or bare model text using a default provider. */
declare function parseModelRef(raw: string, defaultProvider: string, options?: ModelRefNormalizeOptions): ModelRef | null;
//#endregion
//#region src/agents/model-selection-shared.d.ts
type ModelManifestPlugins = ModelManifestNormalizationContext["manifestPlugins"];
type ModelAliasIndex = {
  byAlias: Map<string, {
    alias: string;
    ref: ModelRef;
  }>;
  byProviderAlias?: Map<string, {
    alias: string;
    ref: ModelRef;
  }>;
  byKey: Map<string, string[]>;
};
type BuildModelAliasIndexParams = {
  cfg: OpenClawConfig;
  defaultProvider: string;
  agentId?: string;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext;
/** Build lookup maps from user-facing aliases to normalized model refs. */
declare function buildModelAliasIndex(params: BuildModelAliasIndexParams): ModelAliasIndex;
declare function resolveModelRefFromString(params: {
  cfg?: OpenClawConfig;
  raw: string;
  defaultProvider: string;
  aliasIndex?: ModelAliasIndex;
  allowManifestNormalization?: boolean;
  allowPluginNormalization?: boolean;
} & ModelManifestNormalizationContext): {
  ref: ModelRef;
  alias?: string;
} | null;
/** Build catalog entries from configured provider model rows. */
declare function buildConfiguredModelCatalog(params: {
  cfg: OpenClawConfig;
  workspaceDir?: string;
  manifestPlugins?: ModelManifestPlugins;
}): ModelCatalogEntry[];
//#endregion
//#region src/agents/model-selection.d.ts
declare function resolveAllowedModelRef(params: {
  cfg: OpenClawConfig;
  catalog: ModelCatalogEntry[];
  raw: string;
  defaultProvider: string;
  defaultModel?: string;
  agentId?: string;
} & ModelManifestNormalizationContext): {
  ref: ModelRef;
  key: string;
} | {
  error: string;
};
//#endregion
export { findNormalizedProviderValue as a, resolveThinkingDefaultWithRuntimeCatalog as c, resolveModelRefFromString as i, resolveDefaultModelForAgent as l, buildConfiguredModelCatalog as n, parseModelRef as o, buildModelAliasIndex as r, resolveThinkingDefault as s, resolveAllowedModelRef as t };