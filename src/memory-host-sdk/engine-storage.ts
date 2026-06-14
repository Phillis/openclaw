/**
 * Core-facing facade for memory backend storage config resolution. Keep this
 * path stable while the shared SDK package owns provider status semantics.
 */
export {
  resolveMemoryBackendConfig,
  type MemoryEmbeddingProbeResult,
  type MemoryProviderStatus,
} from "../../packages/memory-host-sdk/src/engine-storage.js";
