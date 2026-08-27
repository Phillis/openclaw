import { jt as ModelCatalogEntry, ut as ProviderRuntimeModel } from "../../plugin-entry-C1So83n6.js";
import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../types-D_bV-6JC.js";
import { n as fetchWithSsrFGuard } from "../../provider-request-config-AkMplh7g.js";
import "../../agent-runtime-DyrGTaeu.js";
import "../../provider-model-shared-Bps1k4-8.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.d.ts
type LiveModelCatalogFetchGuard = typeof fetchWithSsrFGuard;
//#endregion
//#region extensions/opencode-go/provider-catalog.d.ts
type FetchOpencodeGoLiveModelIdsParams = {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
};
declare function buildStaticOpencodeGoProviderConfig(apiKey?: string): ModelProviderDeclarationConfig;
declare function resolveOpencodeGoStarterModel(params: {
  apiKey: string;
  preferredModelRef: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<string | undefined>;
declare function buildOpencodeGoLiveProviderConfig(params?: FetchOpencodeGoLiveModelIdsParams): Promise<ModelProviderDeclarationConfig>;
declare function listOpencodeGoModelCatalogEntries(): ModelCatalogEntry[];
declare function resolveOpencodeGoModel(modelId: string): ProviderRuntimeModel | undefined;
declare function isOpencodeGoKimiNoReasoningModelId(modelId: unknown): boolean;
declare function normalizeOpencodeGoResolvedModel(model: ProviderRuntimeModel): ProviderRuntimeModel | undefined;
declare function normalizeOpencodeGoBaseUrl(params: {
  api?: string | null;
  baseUrl?: string;
}): string | undefined;
//#endregion
export { buildOpencodeGoLiveProviderConfig, buildStaticOpencodeGoProviderConfig, isOpencodeGoKimiNoReasoningModelId, listOpencodeGoModelCatalogEntries, normalizeOpencodeGoBaseUrl, normalizeOpencodeGoResolvedModel, resolveOpencodeGoModel, resolveOpencodeGoStarterModel };