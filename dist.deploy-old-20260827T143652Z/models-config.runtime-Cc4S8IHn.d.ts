import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { D as PreparedProviderStaticCatalog } from "./host-capability-types-CSKZWJAm.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-5OAiSPBb.js";
import { l as ProviderCatalogOutcome } from "./provider-model-types-CwinAwen.js";

//#region src/agents/models-config-state.d.ts
type ModelsJsonReadyResult = {
  agentDir: string;
  wrote: boolean;
};
//#endregion
//#region src/agents/models-config.d.ts
type ModelsConfigPluginMetadataSnapshot = Pick<PluginMetadataSnapshot, "index" | "manifestRegistry" | "owners" | "pluginIds">;
type EnsureOpenClawModelsJsonOptions = {
  env?: NodeJS.ProcessEnv;
  pluginMetadataSnapshot?: ModelsConfigPluginMetadataSnapshot;
  preparedStaticProviderCatalog?: PreparedProviderStaticCatalog;
  workspaceDir?: string;
  providerDiscoveryProviderIds?: readonly string[];
  providerDiscoveryTimeoutMs?: number;
  providerDiscoveryEntriesOnly?: boolean;
  onProviderCatalogOutcome?: (outcome: ProviderCatalogOutcome) => void;
};
/** Ensures models.json and the agent SQLite catalog cache are current. */
declare function ensureOpenClawModelsJson(config?: OpenClawConfig, agentDirOverride?: string, options?: EnsureOpenClawModelsJsonOptions): Promise<ModelsJsonReadyResult>;
//#endregion
export { ensureOpenClawModelsJson as t };