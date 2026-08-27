import { i as OpenClawConfig } from "../types.openclaw-Bon4guJK.js";
import "../types-D0nbqcAi.js";
import { vt as loadManifestModelCatalog } from "../types-C6qw56EZ.js";
import "../plugin-metadata-snapshot.types-B_pmflbL.js";
import { l as ModelCatalogEntry, u as ModelCatalogSnapshot } from "../provider-model-types-Dx2wH4SF.js";
//#region src/agents/prepared-model-catalog.d.ts
type LoadPreparedModelCatalogParams = {
  agentId?: string;
  agentDir?: string;
  config?: OpenClawConfig;
  readOnly?: boolean;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  providerDiscoveryProviderIds?: readonly string[];
  /** Rebuilds a completed full catalog instead of reusing this generation's cache. */
  refreshFullCatalog?: boolean;
  /** Scoped read-only loads may run live discovery for the scoped providers only. */
  scopedLiveProviderDiscovery?: boolean;
  allowGatewaySubagentBinding?: boolean;
};
/**
 * Turn-path capability reads (thinking levels and similar per-model facts) must stay off a new
 * full catalog build: reuse the published generation, then manifest/scoped read-only metadata,
 * then scoped live discovery only for providers whose models exist solely at runtime.
 */
declare function loadProviderScopedThinkingCatalog(params: {
  config: OpenClawConfig;
  provider: string;
  model: string;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
}): Promise<ModelCatalogEntry[]>;
/** Reads one atomic catalog generation, activating a lifecycle owner when needed. */
declare function loadPreparedModelCatalogSnapshot(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogSnapshot>;
declare function loadPreparedModelCatalog(params?: LoadPreparedModelCatalogParams): Promise<ModelCatalogEntry[]>;
//#endregion
export { loadManifestModelCatalog, loadPreparedModelCatalog, loadPreparedModelCatalogSnapshot, loadProviderScopedThinkingCatalog };