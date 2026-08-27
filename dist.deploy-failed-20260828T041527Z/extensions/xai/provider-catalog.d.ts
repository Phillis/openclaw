import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-R2xZRh0U.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-e1qwIWXu.js";
import "../../provider-model-shared-Cgf15Gsj.js";
//#region extensions/xai/provider-catalog.d.ts
declare const XAI_GROK_OAUTH_BASE_URL = "https://cli-chat-proxy.grok.com/v1";
declare function buildXaiProvider(api?: ModelProviderDeclarationConfig["api"]): ModelProviderDeclarationConfig;
declare function buildLiveXaiProvider(params: {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
declare function buildLiveXaiOAuthProvider(params: {
  discoveryApiKey: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { XAI_GROK_OAUTH_BASE_URL, buildLiveXaiOAuthProvider, buildLiveXaiProvider, buildXaiProvider };