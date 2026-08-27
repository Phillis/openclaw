import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
//#region extensions/ollama/src/embedding-provider.ts
const loadOllamaEmbeddingRuntime = createLazyRuntimeModule(() => import("./embedding-provider.runtime.js"));
const createOllamaEmbeddingProvider = async (...args) => await (await loadOllamaEmbeddingRuntime()).createOllamaEmbeddingProvider(...args);
//#endregion
export { createOllamaEmbeddingProvider as t };
