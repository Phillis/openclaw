import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../provider-model-shared-Cjiv30dr.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-Dlplgepi.js";
//#region extensions/google/provider-catalog.d.ts
declare function buildGoogleStaticCatalogProvider(): ModelProviderDeclarationConfig;
declare function buildGoogleLiveCatalogProvider(params: {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
declare function buildGoogleVertexStaticCatalogProvider(): ModelProviderDeclarationConfig;
//#endregion
export { buildGoogleLiveCatalogProvider, buildGoogleStaticCatalogProvider, buildGoogleVertexStaticCatalogProvider };