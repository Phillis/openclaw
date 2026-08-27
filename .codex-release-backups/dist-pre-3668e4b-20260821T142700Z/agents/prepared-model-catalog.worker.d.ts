import { A as PluginRegistry, D as PreparedProviderStaticCatalog, E as ProviderRuntimeModel, H as AuthStorageData, O as prepareMediaCapabilityProviders, S as PreparedConfiguredRuntimeModel, T as PreparedAgentCredentialModes, V as AuthStorage, k as PreparedMessageToolCatalog, w as InlineModelEntry, x as PreparedModelRuntimeInput } from "../host-capability-types-CdpnHc99.js";
import { r as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-5OAiSPBb.js";
import { i as AuthProfileStore } from "../types-CXLbbwkS.js";
import { c as ModelCatalogSnapshot, s as ModelCatalogEntry } from "../provider-model-types-CwinAwen.js";

//#region packages/model-catalog-core/src/configured-model-refs.d.ts
/** One configured model reference plus its config path. */
type ConfiguredModelRef = {
  path: string;
  value: string;
};
//#endregion
//#region src/agents/prepared-model-runtime.facts.d.ts
type PreparedModelRuntimeAgentBaseFacts = {
  input: PreparedModelRuntimeInput;
  env: NodeJS.ProcessEnv;
  authStore: AuthProfileStore;
  templateAuthStorage: AuthStorage;
  credentials: Readonly<AuthStorageData>;
  providerIds: string[];
  configuredModelRefs: readonly ConfiguredModelRef[];
};
type PreparedModelRuntimeAgentFacts = PreparedModelRuntimeAgentBaseFacts & {
  configuredRuntimeModels: readonly PreparedConfiguredRuntimeModel[];
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
  }>;
}>): Promise<PreparedModelWorkerResult>;
//#endregion
export { runPreparedModelCatalogWorkerRequest };