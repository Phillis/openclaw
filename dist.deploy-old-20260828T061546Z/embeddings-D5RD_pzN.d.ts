import { $ as MemoryEmbeddingProviderRuntime, Q as MemoryEmbeddingProviderCreateOptions, X as MemoryEmbeddingProvider } from "./plugin-entry-C1So83n6.js";
import "./config-DTMtb9Xa.js";
import "./install-security-scan.types-CuRC8Miv.js";
import "./memory-core-host-engine-embeddings-DJfAjJ27.js";
import { t as MemoryCoreAcquireLocalService } from "./embedding-local-service-BCpPp3QB.js";
//#region extensions/memory-core/src/memory/embeddings.d.ts
type EmbeddingProvider = MemoryEmbeddingProvider;
type EmbeddingProviderId = string;
type EmbeddingProviderRequest = string;
type EmbeddingProviderFallback = string;
type EmbeddingProviderRuntime = MemoryEmbeddingProviderRuntime;
type EmbeddingProviderResult = {
  provider: EmbeddingProvider | null;
  requestedProvider: EmbeddingProviderRequest;
  fallbackFrom?: string;
  fallbackReason?: string;
  providerUnavailableReason?: string;
  runtime?: EmbeddingProviderRuntime;
};
type CreateEmbeddingProviderOptions = Omit<MemoryEmbeddingProviderCreateOptions, "dimensions"> & {
  provider: EmbeddingProviderRequest;
  fallback: EmbeddingProviderFallback;
  outputDimensionality?: number;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
declare function createEmbeddingProvider(options: CreateEmbeddingProviderOptions): Promise<EmbeddingProviderResult>;
//#endregion
export { EmbeddingProviderRuntime as a, EmbeddingProviderResult as i, EmbeddingProviderId as n, createEmbeddingProvider as o, EmbeddingProviderRequest as r, EmbeddingProvider as t };