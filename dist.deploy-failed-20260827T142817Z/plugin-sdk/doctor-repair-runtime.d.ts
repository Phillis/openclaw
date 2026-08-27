import { n as OpenClawConfig, r as PluginInstallRecord } from "../types.openclaw-CNftZ6Ix.js";
import { n as OpenClawStateDatabaseOptions, r as OpenClawStateDatabaseSchemaMigration } from "../openclaw-state-db-contract-Cc1OsFbo.js";
import { DatabaseSync } from "node:sqlite";

//#region src/state/openclaw-state-db-schema-repair.d.ts
declare function detectOpenClawStateDatabaseSchemaMigrations(options?: OpenClawStateDatabaseOptions): OpenClawStateDatabaseSchemaMigration[];
//#endregion
//#region src/state/openclaw-state-db.d.ts
declare function repairOpenClawStateDatabaseSchema(options?: OpenClawStateDatabaseOptions): {
  changes: string[];
  warnings: string[];
};
//#endregion
//#region src/infra/plugin-install-path-warnings.d.ts
type PluginInstallPathIssue = {
  kind: "custom-path" | "missing-path";
  pluginId: string;
  path: string;
};
declare function detectPluginInstallPathIssue(params: {
  pluginId: string;
  install: PluginInstallRecord | null | undefined;
}): Promise<PluginInstallPathIssue | null>;
declare function formatPluginInstallPathIssue(params: {
  issue: PluginInstallPathIssue;
  pluginLabel: string;
  defaultInstallCommand: string;
  repoInstallCommand?: string | null;
  formatCommand?: (command: string) => string;
}): string[];
//#endregion
//#region src/plugins/uninstall-package-config.d.ts
type PluginConfigUninstallActions = {
  entry: boolean;
  install: boolean;
  allowlist: boolean;
  denylist: boolean;
  loadPath: boolean;
  memorySlot: boolean;
  contextEngineSlot: boolean;
  channelConfig: boolean;
};
//#endregion
//#region src/plugins/uninstall-config.d.ts
/** Remove plugin references from config without loading uninstall process/runtime dependencies. */
declare function removePluginFromConfig(cfg: OpenClawConfig, pluginId: string, opts?: {
  channelIds?: string[];
}): {
  config: OpenClawConfig;
  actions: PluginConfigUninstallActions;
};
//#endregion
export { type OpenClawStateDatabaseSchemaMigration, detectOpenClawStateDatabaseSchemaMigrations, detectPluginInstallPathIssue, formatPluginInstallPathIssue, removePluginFromConfig, repairOpenClawStateDatabaseSchema };