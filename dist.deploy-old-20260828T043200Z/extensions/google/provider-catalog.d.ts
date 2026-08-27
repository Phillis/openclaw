import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../provider-model-shared-JC5NvvvC.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-DdgayoIT.js";
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