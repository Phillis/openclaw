import { i as OpenClawConfig } from "../../../types.openclaw-ClnaeuRs.js";
import { r as LoadInstalledPluginIndexParams, t as InstalledPluginIndex } from "../../../installed-plugin-index-types-CJPGKiY7.js";
import "../../../installed-plugin-index-D0ZQ7Jlt.js";
import { t as InstalledPluginIndexStoreOptions } from "../../../installed-plugin-index-store-B_MbHlTC.js";
//#region src/commands/doctor/shared/plugin-registry-migration.d.ts
type PluginRegistryInstallMigrationPreflight = {
  /** Migration action selected before reading or writing registry state. */
  action: "skip-existing";
  /** Persisted plugin index path that migration will inspect or write. */
  filePath: string;
  /** Authoritative pre-repair generation used to detect a real inventory change. */
  current: InstalledPluginIndex;
} | {
  action: "initialize" | "migrate";
  filePath: string;
};
type PluginRegistryInstallMigrationResult = {
  status: "skip-existing" | "dry-run";
  migrated: false;
  preflight: PluginRegistryInstallMigrationPreflight;
} | {
  status: "migrated";
  migrated: true;
  preflight: PluginRegistryInstallMigrationPreflight;
  current: InstalledPluginIndex;
};
declare class InvalidPluginInstallRecordStateError extends Error {}
type PluginRegistryInstallMigrationParams = LoadInstalledPluginIndexParams & InstalledPluginIndexStoreOptions & {
  dryRun?: boolean;
  existsSync?: (path: string) => boolean;
  readConfig?: () => Promise<OpenClawConfig> | OpenClawConfig;
};
/** Decide whether plugin install registry migration should run for this environment. */
declare function preflightPluginRegistryInstallMigration(params?: PluginRegistryInstallMigrationParams): PluginRegistryInstallMigrationPreflight;
/** Persist a migrated plugin install registry from legacy config/install records when needed. */
declare function migratePluginRegistryForInstall(params?: PluginRegistryInstallMigrationParams): Promise<PluginRegistryInstallMigrationResult>;
//#endregion
export { InvalidPluginInstallRecordStateError, PluginRegistryInstallMigrationParams, migratePluginRegistryForInstall, preflightPluginRegistryInstallMigration };