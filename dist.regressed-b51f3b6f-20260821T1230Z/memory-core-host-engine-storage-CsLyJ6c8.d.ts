import { DatabaseSync } from "node:sqlite";

//#region src/plugin-sdk/memory-core-host-engine-storage.d.ts
/** Health probe result for embedding provider availability checks. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
//#endregion
export { MemoryEmbeddingProbeResult as t };