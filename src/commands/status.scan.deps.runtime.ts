// Runtime dependency adapters for status scans.
// Keeps plugin/runtime modules outside the core scan files until a caller needs them.

import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getTailnetHostname } from "../infra/tailscale.js";
import type { MemoryProviderStatus } from "../memory-host-sdk/engine-storage.js";
import { getActiveMemorySearchManager } from "../plugins/memory-runtime.js";

export { getTailnetHostname };

type StatusMemoryManager = {
  getCachedEmbeddingAvailability?():
    | import("../memory-host-sdk/engine-storage.js").MemoryEmbeddingProbeResult
    | null;
  probeEmbeddingAvailability?(): Promise<
    import("../memory-host-sdk/engine-storage.js").MemoryEmbeddingProbeResult
  >;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  status(): MemoryProviderStatus;
  close?(): Promise<void>;
};

/** Returns a narrow memory manager adapter for status probing. */
export async function getMemorySearchManager(params: {
  cfg: OpenClawConfig;
  agentId: string;
  purpose: "status";
}): Promise<{ manager: StatusMemoryManager | null }> {
  const { manager } = await getActiveMemorySearchManager(params);
  if (!manager) {
    return { manager: null };
  }
  return {
    manager: {
      getCachedEmbeddingAvailability: manager.getCachedEmbeddingAvailability
        ? () => {
            if (!manager.getCachedEmbeddingAvailability) {
              return null;
            }
            return manager.getCachedEmbeddingAvailability();
          }
        : undefined,
      probeEmbeddingAvailability: manager.probeEmbeddingAvailability
        ? async () => {
            if (!manager.probeEmbeddingAvailability) {
              throw new Error("embedding availability probe unavailable");
            }
            return await manager.probeEmbeddingAvailability();
          }
        : undefined,
      probeVectorStoreAvailability: manager.probeVectorStoreAvailability
        ? async () => {
            if (!manager.probeVectorStoreAvailability) {
              throw new Error("vector store availability probe unavailable");
            }
            return await manager.probeVectorStoreAvailability();
          }
        : undefined,
      // Expose only the status-facing methods so shared scan code stays decoupled from plugin internals.
      async probeVectorAvailability() {
        return await manager.probeVectorAvailability();
      },
      status() {
        return manager.status();
      },
      close: manager.close ? async () => await manager.close?.() : undefined,
    },
  };
}
