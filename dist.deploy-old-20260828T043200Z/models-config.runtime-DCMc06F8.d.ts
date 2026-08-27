import { i as OpenClawConfig } from "./types.openclaw-ClnaeuRs.js";
import "./types-BqVSqbhn.js";
import { St as PreparedProviderStaticCatalog } from "./types-Hf0Z4d9b.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Unqs8JMC.js";
import "./plugin-metadata-snapshot-31daOrm8.js";
import "./config-GDtWBx0k.js";
import { d as ProviderCatalogOutcome } from "./provider-model-types-BSgNmVSh.js";
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