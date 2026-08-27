import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-R2xZRh0U.js";
import { r as SsrFPolicy } from "../../ssrf-DvMBKwmI.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-e1qwIWXu.js";
import "../../provider-model-shared-Cgf15Gsj.js";
import "../../ssrf-runtime-if6qmXwZ.js";
import { r as resolveProviderHttpRequestConfig } from "../../shared-C8jPm2KY.js";
import "../../provider-http-BYabNk3I.js";
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