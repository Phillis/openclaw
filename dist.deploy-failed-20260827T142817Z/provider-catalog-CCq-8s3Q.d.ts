import { u as ModelProviderDeclarationConfig } from "./types.openclaw-3CDavCPO.js";
import { r as SsrFPolicy } from "./ssrf-C1p3Hf59.js";
import { s as fetchWithSsrFGuard } from "./provider-request-config-BgWtlSlq.js";
import { n as resolveProviderHttpRequestConfig } from "./shared-BBhQrwCi.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.d.ts
type LiveModelCatalogFetchGuard = typeof fetchWithSsrFGuard;
//#endregion
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
export { normalizeOpenRouterBaseUrl as a, isOpenRouterProxyReasoningUnsupportedModel as i, buildOpenrouterLiveProvider as n, resolveOpenRouterApiBaseUrl as o, buildOpenrouterProvider as r, resolveOpenRouterSsrfPolicy as s, OPENROUTER_BASE_URL as t };