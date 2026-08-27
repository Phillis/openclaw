import { Lr as listMemoryEmbeddingProviders, Rr as listRegisteredMemoryEmbeddingProviderAdapters, cr as MemoryEmbeddingProviderAdapter, dr as MemoryEmbeddingProviderCreateResult, ur as MemoryEmbeddingProviderCreateOptions } from "../types-CiLdD6DO.js";
//#region packages/memory-host-sdk/src/host/embedding-defaults.d.ts
/** Default local embedding model used when config omits an explicit model. */
declare const DEFAULT_LOCAL_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
//#endregion
export { DEFAULT_LOCAL_MODEL, type MemoryEmbeddingProviderAdapter, type MemoryEmbeddingProviderCreateOptions, type MemoryEmbeddingProviderCreateResult, listMemoryEmbeddingProviders, listRegisteredMemoryEmbeddingProviderAdapters };