import { Bt as MemoryEmbeddingProvider, Ht as MemoryEmbeddingProviderCreateOptions, Wt as EmbeddingInput } from "./acpx-Bsv7pbza.js";
import "./types.openclaw-n6JIVcIK.js";
import { r as SsrFPolicy } from "./ssrf-CTfgAjkq.js";
import "./memory-core-host-engine-embeddings-BMMgs7uU.js";
import "./ssrf-runtime-CONmX3MY.js";
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
  taskType?: GeminiTaskType;
  outputDimensionality?: number;
  model?: string;
};
type GeminiTextEmbeddingRequest = GeminiEmbeddingRequest;
declare function buildGeminiEmbeddingRequest(params: {
  input: EmbeddingInput;
  model: string;
  role: "query" | "document";
  taskType: GeminiTaskType;
  outputDimensionality?: number;
  modelPath?: string;
}): GeminiEmbeddingRequest;
/** Returns true for Gemini Embedding 2 variants with multimodal and extended task support. */
declare function isGeminiEmbedding2Model(model: string): boolean;
declare function sanitizeGeminiEmbedding(values: number[], expectedDimensions?: number): number[];
declare function createGeminiEmbeddingProvider(options: MemoryEmbeddingProviderCreateOptions): Promise<{
  provider: MemoryEmbeddingProvider;
  client: GeminiEmbeddingClient;
}>;
//#endregion
export { createGeminiEmbeddingProvider as a, buildGeminiEmbeddingRequest as i, GeminiEmbeddingClient as n, isGeminiEmbedding2Model as o, GeminiTextEmbeddingRequest as r, sanitizeGeminiEmbedding as s, DEFAULT_GEMINI_EMBEDDING_MODEL as t };