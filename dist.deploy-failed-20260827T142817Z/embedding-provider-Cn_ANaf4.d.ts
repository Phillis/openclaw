import { K as MemoryEmbeddingProviderCreateOptions, W as MemoryEmbeddingProvider, q as EmbeddingInput } from "./types-Ci1t4mxf.js";
import { i as SsrFPolicy } from "./ssrf-CX7egwMk.js";
//#region extensions/google/embedding-provider.d.ts
type GeminiEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  model: string;
  modelPath: string;
  apiKeys: string[];
  outputDimensionality?: number;
};
declare const DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";
type GeminiTaskType = NonNullable<MemoryEmbeddingProviderCreateOptions["taskType"]>;
type GeminiTextPart = {
  text: string;
};
type GeminiInlinePart = {
  inlineData: {
    mimeType: string;
    data: string;
  };
};
type GeminiPart = GeminiTextPart | GeminiInlinePart;
type GeminiEmbeddingRequest = {
  content: {
    parts: GeminiPart[];
  };
  taskType: GeminiTaskType;
  outputDimensionality?: number;
  model?: string;
};
type GeminiTextEmbeddingRequest = GeminiEmbeddingRequest;
declare function buildGeminiEmbeddingRequest(params: {
  input: EmbeddingInput;
  taskType: GeminiTaskType;
  outputDimensionality?: number;
  modelPath?: string;
}): GeminiEmbeddingRequest;
declare function createGeminiEmbeddingProvider(options: MemoryEmbeddingProviderCreateOptions): Promise<{
  provider: MemoryEmbeddingProvider;
  client: GeminiEmbeddingClient;
}>;
//#endregion
export { createGeminiEmbeddingProvider as a, buildGeminiEmbeddingRequest as i, GeminiEmbeddingClient as n, GeminiTextEmbeddingRequest as r, DEFAULT_GEMINI_EMBEDDING_MODEL as t };