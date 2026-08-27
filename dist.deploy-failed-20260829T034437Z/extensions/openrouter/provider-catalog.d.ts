import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-DRR8P0H2.js";
import { r as SsrFPolicy } from "../../ssrf-DvMBKwmI.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-DWMCbxpy.js";
import "../../provider-model-shared-CNwMbffr.js";
import "../../ssrf-runtime-xEC7ZtlH.js";
import { r as resolveProviderHttpRequestConfig } from "../../shared-CNthld1Z.js";
import "../../provider-http-Dh0oL4lE.js";
//#region extensions/openrouter/provider-catalog.d.ts
declare const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
declare function normalizeOpenRouterBaseUrl(baseUrl: string | undefined): string | undefined;
declare function resolveOpenRouterApiBaseUrl(baseUrl: string | undefined): string;
declare function resolveOpenRouterSsrfPolicy(requestConfig: Pick<ReturnType<typeof resolveProviderHttpRequestConfig>, "baseUrl" | "allowPrivateNetwork">, request?: ModelProviderDeclarationConfig["request"]): SsrFPolicy | undefined;
declare function isOpenRouterProxyReasoningUnsupportedModel(modelId: string | undefined): boolean;
declare function buildOpenrouterProvider(): ModelProviderDeclarationConfig;
declare function buildOpenrouterLiveProvider(params: {
  apiKey?: string;
  discoveryApiKey?: string;
  baseUrl?: string;
  request?: ModelProviderDeclarationConfig["request"];
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { OPENROUTER_BASE_URL, buildOpenrouterLiveProvider, buildOpenrouterProvider, isOpenRouterProxyReasoningUnsupportedModel, normalizeOpenRouterBaseUrl, resolveOpenRouterApiBaseUrl, resolveOpenRouterSsrfPolicy };