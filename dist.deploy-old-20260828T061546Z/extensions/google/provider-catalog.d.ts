import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../provider-model-shared-BQajq5ha.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-9299pdDF.js";
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