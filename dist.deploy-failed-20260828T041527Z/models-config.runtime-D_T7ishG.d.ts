import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import "./types-D0nbqcAi.js";
import { St as PreparedProviderStaticCatalog } from "./types-C6qw56EZ.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-B_pmflbL.js";
import "./plugin-metadata-snapshot-zyXEJFTB.js";
import "./config-7RZyYa4d.js";
import { d as ProviderCatalogOutcome } from "./provider-model-types-Dx2wH4SF.js";
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