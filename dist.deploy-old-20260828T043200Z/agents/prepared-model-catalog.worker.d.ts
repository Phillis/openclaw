import { i as AuthProfileStore } from "../types-BqVSqbhn.js";
import { Et as PluginRegistry, It as AuthStorage, Lt as AuthStorageData, St as PreparedProviderStaticCatalog, Tt as prepareMediaCapabilityProviders, _t as PreparedRuntimeCapabilityModel, bt as PreparedMessageToolCatalog, gt as PreparedConfiguredRuntimeModel, ht as PreparedModelRuntimeInput, wt as ProviderRuntimeModel, xt as InlineModelEntry, yt as PreparedAgentCredentialModes } from "../types-Hf0Z4d9b.js";
import { r as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-Unqs8JMC.js";
import { l as ModelCatalogEntry, u as ModelCatalogSnapshot } from "../provider-model-types-BSgNmVSh.js";
//#region packages/model-catalog-core/src/model-catalog-refs.d.ts
type ModelCatalogRef = {
  provider: string;
  modelId: string;
};
//#endregion
//#region src/agents/prepared-model-runtime.catalog-contract.d.ts
type PreparedModelRuntimeAgentBaseFacts = {
  input: PreparedModelRuntimeInput;
  env: NodeJS.ProcessEnv;
  authStore: AuthProfileStore;
  templateAuthStorage: AuthStorage;
  credentials: Readonly<AuthStorageData>;
  providerIds: string[];
  configuredModelRefs: readonly ModelCatalogRef[];
};
type PreparedModelRuntimeAgentFacts = PreparedModelRuntimeAgentBaseFacts & {
  configuredRuntimeModels: readonly PreparedConfiguredRuntimeModel[];
  runtimeCapabilityModels: readonly PreparedRuntimeCapabilityModel[];
  configuredGeneratedCatalogPluginIds: readonly string[];
};
//#endregion
//#region src/agents/prepared-model-catalog-worker.d.ts
type PreparedModelCatalogWorkerInput = Readonly<{
  kind: "catalog";
  generationFingerprint: string;
  input: PreparedModelRuntimeInput;
  authStore: AuthProfileStore;
  providerIds: readonly string[];
  pluginMetadataSnapshot: Omit<PluginMetadataSnapshot, "normalizePluginId">;
}>;
type PreparedModelWorkerRequest = Readonly<{
  requestId: number;
  kind: "catalog";
}> | Readonly<{
  requestId: number;
  kind: "auth-refresh";
  profileIds?: readonly string[];
  providerIds: readonly string[];
}>;
type PreparedModelWorkerResult = Readonly<{
  status: "ok";
  requestId: number;
  kind: "catalog";
  generationFingerprint: string;
  snapshot: ModelCatalogSnapshot;
  authStore: AuthProfileStore;
  authModes: PreparedAgentCredentialModes;
}> | Readonly<{
  status: "ok";
  requestId: number;
  kind: "auth-refresh";
  generationFingerprint: string;
  authStore: AuthProfileStore;
  authModes: PreparedAgentCredentialModes;
}> | Readonly<{
  status: "failed";
  requestId: number;
  error: string;
}>;
//#endregion
//#region src/agents/prepared-model-catalog.worker.d.ts
declare function runPreparedModelCatalogWorkerRequest(value: PreparedModelCatalogWorkerInput, request: PreparedModelWorkerRequest, preparedGeneration?: Promise<{
  agentFacts: PreparedModelRuntimeAgentFacts;
  pluginGeneration: Readonly<{
    pluginMetadataSnapshot: PluginMetadataSnapshot;
    messageToolCatalog?: PreparedMessageToolCatalog;
    mediaCapabilityProviders?: ReturnType<typeof prepareMediaCapabilityProviders>;
    preparedStaticProviderCatalog?: PreparedProviderStaticCatalog;
    providerStaticModels?: readonly ProviderRuntimeModel[];
    inlineProviderModels: readonly InlineModelEntry[];
    configuredCatalogEntries: readonly ModelCatalogEntry[];
    pluginRegistry?: PluginRegistry;
    inboundPluginRegistry?: PluginRegistry;
    preferBuiltPluginArtifacts?: boolean;
  }>;
}>): Promise<PreparedModelWorkerResult>;
//#endregion
export { runPreparedModelCatalogWorkerRequest };