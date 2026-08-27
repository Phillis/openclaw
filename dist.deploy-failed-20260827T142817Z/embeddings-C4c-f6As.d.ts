import { H as MemoryEmbeddingProvider, U as MemoryEmbeddingProviderCreateOptions, W as MemoryEmbeddingProviderRuntime } from "./types-R6eI-mj_.js";
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
type CreateEmbeddingProviderOptions = MemoryEmbeddingProviderCreateOptions & {
  provider: EmbeddingProviderRequest;
  fallback: EmbeddingProviderFallback;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
declare function createEmbeddingProvider(options: CreateEmbeddingProviderOptions): Promise<EmbeddingProviderResult>;
//#endregion
export { EmbeddingProviderRuntime as a, EmbeddingProviderResult as i, EmbeddingProviderId as n, createEmbeddingProvider as o, EmbeddingProviderRequest as r, EmbeddingProvider as t };