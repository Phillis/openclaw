import { o as ModelDefinitionConfig, u as ModelProviderDeclarationConfig } from "./types.openclaw-BrHw7tim.js";
import { r as SsrFPolicy, t as LookupFn } from "./ssrf-D9Lp3jtc.js";
import { i as fetchWithSsrFGuard } from "./provider-request-config-llHCnPiq.js";
//#region src/plugin-sdk/provider-catalog-live-runtime.d.ts
type LiveModelCatalogFetchGuard = typeof fetchWithSsrFGuard;
type LiveModelCatalogHeaderContext = {
  apiKey?: string;
  discoveryApiKey?: string;
};
type FetchLiveProviderModelIdsParams = {
  providerId: string;
  endpoint: string;
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
  timeoutMs?: number;
  auditContext?: string;
  policy?: SsrFPolicy;
  lookupFn?: LookupFn;
  requireHttps?: boolean;
  readRows?: (body: unknown) => readonly unknown[];
  readModelId?: (row: unknown) => string | undefined;
  buildRequestHeaders?: (ctx: LiveModelCatalogHeaderContext) => HeadersInit;
};
type FetchLiveProviderModelRowsParams = Omit<FetchLiveProviderModelIdsParams, "readModelId">;
type LiveModelRowProjection<T extends ModelDefinitionConfig = ModelDefinitionConfig> = (rows: readonly unknown[], fallback: ModelProviderDeclarationConfig) => readonly T[];
type OpenAICompatibleModelDiscoveryOptions = {
  /** Fixed endpoint used only while the effective inference base remains canonical. */endpointUrl?: {
    url: string;
    requireBaseUrl: string;
  }; /** Relative path appended to the effective provider base URL. Defaults to `models`. */
  endpointPath?: string; /** Provider-specific response row selector when the response is not `{ data: [] }`. */
  readRows?: FetchLiveProviderModelRowsParams["readRows"]; /** Provider-owned projection when the conservative OpenAI-compatible projection is insufficient. */
  projectRows?: LiveModelRowProjection; /** Live catalog request timeout. Defaults to 5 seconds. */
  timeoutMs?: number; /** Successful live catalog cache lifetime. Defaults to 60 seconds. */
  ttlMs?: number; /** Provider-specific authorization headers for non-Bearer model-list APIs. */
  buildRequestHeaders?: FetchLiveProviderModelRowsParams["buildRequestHeaders"];
  /**
   * Gate for discovered ids the manifest does not already publish. Providers
   * whose request shaping is model-version specific use this to drop models
   * they cannot yet shape, so discovery never surfaces a selectable model that
   * would build an invalid request. Manifest-published ids bypass it.
   */
  acceptUnknownModel?: (params: {
    id: string;
    record: Record<string, unknown>;
  }) => boolean;
};
//#endregion
export { OpenAICompatibleModelDiscoveryOptions as n, LiveModelCatalogFetchGuard as t };