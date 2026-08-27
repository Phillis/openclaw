import { ut as ProviderRuntimeModel, v as ProviderResolveDynamicModelContext } from "../../plugin-entry-C1So83n6.js";
import { o as ModelDefinitionConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../provider-model-shared-Bps1k4-8.js";
//#region extensions/github-copilot/models.d.ts
declare const PROVIDER_ID = "github-copilot";
declare function resolveCopilotForwardCompatModel(ctx: ProviderResolveDynamicModelContext): ProviderRuntimeModel | undefined;
declare function isCopilotCatalogModelVisible(model: CopilotCatalogModel): boolean;
declare function selectCopilotStarterModel(models: readonly CopilotCatalogModel[], preferredModelId: string): CopilotCatalogModel | undefined;
declare const COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS = 10000;
type CopilotCatalogModel = Omit<ModelDefinitionConfig, "input"> & {
  api: NonNullable<ModelDefinitionConfig["api"]>;
  input: ProviderRuntimeModel["input"];
};
type FetchCopilotModelCatalogParams = {
  /** GitHub source token accepted by the account's Copilot API endpoint. */
  copilotApiToken: string;
  /** Resolved baseUrl from the same token-exchange response. */
  baseUrl: string;
  headers?: Record<string, string>;
  /** Optional fetch override for testing. */
  fetchImpl?: typeof fetch;
  /** Optional AbortSignal; defaults to a 10s timeout. */
  signal?: AbortSignal;
};
/**
 * Fetch the live Copilot model catalog from `${baseUrl}/models` and project it
 * into `ModelDefinitionConfig[]`. Used by the plugin's discovery hook so the
 * runtime catalog tracks per-account entitlements + accurate context windows
 * without manifest churn.
 *
 * Filters out non-chat objects (embeddings, routers) and internal router ids.
 * On any HTTP/parse failure the caller should fall back to the static manifest
 * catalog; this function throws so the caller decides the recovery shape.
 */
declare function fetchCopilotModelCatalog(params: FetchCopilotModelCatalogParams): Promise<CopilotCatalogModel[]>;
//#endregion
export { COPILOT_MODELS_LIST_DEFAULT_TIMEOUT_MS, PROVIDER_ID, fetchCopilotModelCatalog, isCopilotCatalogModelVisible, resolveCopilotForwardCompatModel, selectCopilotStarterModel };