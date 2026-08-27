import { ft as MemoryEmbeddingProvider, mt as MemoryEmbeddingProviderCreateOptions } from "./plugin-entry-DF9X1uwv.js";
import { r as SsrFPolicy } from "./ssrf-Ck7fh8Hg.js";
import "./memory-core-host-engine-embeddings-Bp61SU2n.js";
//#region extensions/openai/embedding-provider.d.ts
type OpenAiEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  fetchImpl?: typeof fetch;
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  outputDimensionality?: number;
};
declare const DEFAULT_OPENAI_EMBEDDING_MODEL = "text-embedding-3-small";
declare function createOpenAiEmbeddingProvider(options: MemoryEmbeddingProviderCreateOptions): Promise<{
  provider: MemoryEmbeddingProvider;
  client: OpenAiEmbeddingClient;
}>;
//#endregion
export { OpenAiEmbeddingClient as n, createOpenAiEmbeddingProvider as r, DEFAULT_OPENAI_EMBEDDING_MODEL as t };