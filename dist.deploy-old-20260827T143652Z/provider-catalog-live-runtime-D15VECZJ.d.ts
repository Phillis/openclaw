import { c as ModelProviderDeclarationConfig, i as ModelDefinitionConfig, s as ModelProviderConfig } from "./types.models-Dfmf90bZ.js";
import { bt as ProviderCatalogResult, i as ProviderPlugin, vt as ProviderAugmentModelCatalogContext, yt as ProviderCatalogContext } from "./types-BJ8oTDFw.js";
import { r as ModelCatalogEntry } from "./model-selection-D3tdqdDP.js";
import { r as SsrFPolicy, t as LookupFn } from "./ssrf-DMQl3JA2.js";
import { a as fetchWithSsrFGuard } from "./fetch-guard-0-SfluKG.js";
import { n as ManifestProviderCatalogEntry } from "./provider-catalog-shared-BnSV7WbF.js";
//#region src/plugin-sdk/provider-catalog-live-normalize.internal.d.ts
declare function readLiveModelCatalogStringField(row: unknown, keys: string | readonly string[]): string | undefined;
declare function readLiveModelCatalogBooleanField(row: unknown, keys: string | readonly string[]): boolean | undefined;
declare function readLiveModelCatalogPositiveSafeIntegerField(row: unknown, keys: string | readonly string[]): number | undefined;
//#endregion
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
type CachedLiveProviderModelRowsParams = FetchLiveProviderModelRowsParams & {
  ttlMs?: number;
  cacheKeyParts?: readonly unknown[];
  shouldCacheRows?: (rows: readonly unknown[]) => boolean;
};
type LiveModelRowProjection<T extends ModelDefinitionConfig = ModelDefinitionConfig> = (rows: readonly unknown[], fallback: ModelProviderDeclarationConfig) => readonly T[];
declare class LiveModelCatalogHttpError extends Error {
  readonly status: number;
  constructor(providerId: string, status: number);
}
type BuildLiveModelProviderConfigParams<T extends ModelDefinitionConfig> = FetchLiveProviderModelIdsParams & {
  providerConfig: Omit<ModelProviderDeclarationConfig, "models">;
  models: readonly T[];
  ttlMs?: number;
  cacheKeyParts?: readonly unknown[]; /** Provider-owned projection for catalogs that publish richer metadata than model ids. */
  projectRows?: LiveModelRowProjection<T>; /** Retry a rejected authenticated catalog request against the provider's public catalog. */
  fallbackToAnonymousOnUnauthorized?: boolean;
};
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
type BuildOpenAICompatibleProviderCatalogParams = {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProvider: () => ModelProviderDeclarationConfig | Promise<ModelProviderDeclarationConfig>;
  allowExplicitBaseUrl?: boolean;
  modelDiscovery?: OpenAICompatibleModelDiscoveryOptions;
};
declare function fetchLiveProviderModelRows(params: FetchLiveProviderModelRowsParams): Promise<readonly unknown[]>;
declare function getCachedLiveProviderModelRows(params: CachedLiveProviderModelRowsParams): Promise<readonly unknown[]>;
declare function fetchLiveProviderModelIds(params: FetchLiveProviderModelIdsParams): Promise<string[]>;
declare function buildLiveModelProviderConfig<T extends ModelDefinitionConfig>(params: BuildLiveModelProviderConfigParams<T>): Promise<ModelProviderDeclarationConfig>;
declare function buildOpenAICompatibleLiveModelProviderConfig(params: {
  providerId: string;
  providerConfig: ModelProviderDeclarationConfig;
  apiKey?: string;
  discoveryApiKey?: string;
  modelDiscovery?: OpenAICompatibleModelDiscoveryOptions;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
/** Builds the shared authenticated live/static hooks for an ordered provider family. */
declare function buildOpenAICompatibleProviderFamilyCatalog(params: {
  credentialProviderId: string;
  entries: readonly ManifestProviderCatalogEntry[];
  staticCatalog: () => Promise<{
    providers: Record<string, ModelProviderDeclarationConfig>;
  }>;
  augmentModelCatalog: NonNullable<ProviderPlugin["augmentModelCatalog"]>;
}): {
  catalog: {
    order: "paired";
    run: (ctx: ProviderCatalogContext) => Promise<{
      providers: {
        [k: string]: ModelProviderConfig;
      };
    } | null>;
    staticRun: () => Promise<{
      providers: Record<string, ModelProviderDeclarationConfig>;
    }>;
  };
  augmentModelCatalog: (ctx: ProviderAugmentModelCatalogContext) => Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | Promise<Array<ModelCatalogEntry> | ReadonlyArray<ModelCatalogEntry> | null | undefined> | null | undefined;
};
declare function buildOpenAICompatibleProviderCatalog(params: BuildOpenAICompatibleProviderCatalogParams): Promise<ProviderCatalogResult>;
//#endregion
export { getCachedLiveProviderModelRows as _, FetchLiveProviderModelRowsParams as a, readLiveModelCatalogStringField as b, LiveModelCatalogHttpError as c, buildLiveModelProviderConfig as d, buildOpenAICompatibleLiveModelProviderConfig as f, fetchLiveProviderModelRows as g, fetchLiveProviderModelIds as h, FetchLiveProviderModelIdsParams as i, LiveModelRowProjection as l, buildOpenAICompatibleProviderFamilyCatalog as m, BuildOpenAICompatibleProviderCatalogParams as n, LiveModelCatalogFetchGuard as o, buildOpenAICompatibleProviderCatalog as p, CachedLiveProviderModelRowsParams as r, LiveModelCatalogHeaderContext as s, BuildLiveModelProviderConfigParams as t, OpenAICompatibleModelDiscoveryOptions as u, readLiveModelCatalogBooleanField as v, readLiveModelCatalogPositiveSafeIntegerField as y };