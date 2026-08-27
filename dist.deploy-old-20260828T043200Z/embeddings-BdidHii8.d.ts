import { $ as MemoryEmbeddingProviderRuntime, Q as MemoryEmbeddingProviderCreateOptions, X as MemoryEmbeddingProvider } from "./plugin-entry-SSZcu2d5.js";
import "./config--7WyvZ2K.js";
import "./install-security-scan.types-SU0HMt7J.js";
import "./memory-core-host-engine-embeddings-r4OnsQxa.js";
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