import { r as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-a_kGc1gJ.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-DPaDh_-F.js";
import fs from "node:fs";
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
//#endregion
//#region src/config/io.types.d.ts
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
};
type ConfigWriteAuditOrigin = "doctor" | "system-agent" | "config-rpc" | "plugin-install" | "cli";
type ConfigWriteOptions = {
  /** Semantic writer label recorded in the config audit journal. */auditOrigin?: ConfigWriteAuditOrigin; /** Read-time env snapshot used to validate `${VAR}` restoration decisions. */
  envSnapshotForRestore?: Record<string, string | undefined>; /** Only use envSnapshotForRestore for the config path that produced it. */
  expectedConfigPath?: string; /** Internal write destination captured by readConfigFileSnapshotForWrite(). */
  ownedConfigPathForWrite?: string; /** Rechecks that the config path captured at mutation start is still active. */
  assertConfigPathForWrite?: () => void; /** Paths that must be removed from the persisted payload. */
  unsetPaths?: string[][]; /** Caller-authored paths that stay persisted even when equal to defaults. */
  explicitSetPaths?: readonly (readonly string[])[]; /** Source-shaped values paired with explicitSetPaths. */
  explicitSetValueSource?: OpenClawConfig; /** Agent ids that this write intentionally removes from the canonical roster. */
  allowedAgentRosterRemovals?: readonly string[]; /** Permit explicit local overrides below an ancestor $include without flattening it. */
  allowIncludeAncestorExplicitSetPaths?: boolean; /** Fresh snapshot fast path for an immediate write. */
  baseSnapshot?: ConfigFileSnapshot; /** Plugin metadata paired with baseSnapshot. */
  basePluginMetadataSnapshot?: PluginMetadataSnapshot; /** Skip the runtime refresh tail when no runtime snapshot is active. */
  skipRuntimeSnapshotRefresh?: boolean; /** Controls for the active runtime snapshot refresh. */
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions; /** Allow intentionally destructive full-config writes. */
  allowDestructiveWrite?: boolean; /** Allow an intentional size drop while retaining other destructive guards. */
  allowConfigSizeDrop?: boolean; /** Suppress human-readable overwrite and anomaly logs. */
  skipOutputLogs?: boolean; /** Runtime reload intent for committed-write observers. */
  afterWrite?: ConfigWriteAfterWrite; /** Doctor-only legacy root keys retained on disk but excluded from validation. */
  preservedLegacyRootKeys?: readonly string[]; /** Skip plugin-aware validation for bounded repair migrations only. */
  skipPluginValidation?: boolean; /** Preserve an older writer version during update handoff writes. */
  lastTouchedVersionOverride?: string; /** Final async authority gate after runtime preflight and before commit. */
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig) => Promise<unknown>; /** Snapshot-time hashes for include files that mutation writers may update. */
  includeFileHashesForWrite?: Record<string, string>; /** Snapshot-time canonical include targets that writers may update. */
  includeFileTargetsForWrite?: Record<string, string>;
};
type ReadConfigFileSnapshotForWriteResult = {
  snapshot: ConfigFileSnapshot;
  writeOptions: ConfigWriteOptions;
};
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
type ConfigSnapshotReadOptions = {
  measure?: ConfigSnapshotReadMeasure;
  observe?: boolean;
  isolateEnv?: boolean;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  allowCurrentPluginMetadata?: boolean;
  recoverSuspicious?: boolean;
  allowSuspiciousRecovery?: (candidate: OpenClawConfig, current: OpenClawConfig) => boolean | Promise<boolean>;
  skipPluginValidation?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  suppressFutureVersionWarning?: boolean;
};
//#endregion
//#region src/config/io.runtime.d.ts
declare function clearConfigCache(): void;
declare function loadConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function getRuntimeConfig(options?: {
  skipPluginValidation?: boolean;
  pin?: boolean;
  skipShellEnvFallback?: boolean;
}): OpenClawConfig;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
export { readConfigFileSnapshotForWrite as a, ConfigWriteResult as c, clearRuntimeConfigSnapshot as d, getRuntimeConfigSnapshot as f, setRuntimeConfigSnapshot as h, readConfigFileSnapshot as i, ConfigWriteAfterWrite as l, selectApplicableRuntimeConfig as m, getRuntimeConfig as n, writeConfigFile as o, getRuntimeConfigSourceSnapshot as p, loadConfig as r, ConfigWriteOptions as s, clearConfigCache as t, ConfigWriteFollowUp as u };