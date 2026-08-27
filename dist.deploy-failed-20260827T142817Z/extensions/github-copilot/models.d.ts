import { E as ProviderResolveDynamicModelContext, M as ProviderRuntimeModel } from "../../types-7E39v2Gx.js";
import { o as ModelDefinitionConfig } from "../../types.openclaw-3CDavCPO.js";
//#region extensions/github-copilot/models.d.ts
declare const PROVIDER_ID = "github-copilot";
declare function resolveCopilotForwardCompatModel(ctx: ProviderResolveDynamicModelContext): ProviderRuntimeModel | undefined;
declare function isCopilotCatalogModelVisible(model: CopilotCatalogModel): boolean;
declare function selectCopilotStarterModel(models: readonly CopilotCatalogModel[], preferredModelId: string): CopilotCatalogModel | undefined;
type CopilotCatalogModel = Omit<ModelDefinitionConfig, "input"> & {
  api: NonNullable<ModelDefinitionConfig["api"]>;
  input: ProviderRuntimeModel["input"];
};
type FetchCopilotModelCatalogParams = {
  /** GitHub source token accepted by the account's Copilot API endpoint. */copilotApiToken: string; /** Resolved baseUrl from the same token-exchange response. */
  baseUrl: string; /** Optional fetch override for testing. */
  fetchImpl?: typeof fetch; /** Optional AbortSignal; defaults to a 10s timeout. */
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
export { PROVIDER_ID, fetchCopilotModelCatalog, isCopilotCatalogModelVisible, resolveCopilotForwardCompatModel, selectCopilotStarterModel };