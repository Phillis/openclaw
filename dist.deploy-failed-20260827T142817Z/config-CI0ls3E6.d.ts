import { i as OpenClawConfig, n as ConfigValidationIssue, t as ConfigFileSnapshot } from "./types.openclaw-D9FrGbix.js";
import { n as PluginManifestRegistry } from "./manifest-registry-DXEb65Gx.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-BMcWFrCD.js";
import { t as Result } from "./result-Op6FTu_Y.js";
import fs from "node:fs";
import JSON5 from "json5";

//#region src/config/config-env-vars.d.ts
/** Config-owned runtime env staged for one acceptance transaction. */
type ConfigRuntimeEnvPublication = (() => void) & {
  commit: () => void;
};
type PreparedConfigRuntimeEnv = {
  env: NodeJS.ProcessEnv;
  publish: () => ConfigRuntimeEnvPublication;
};
//#endregion
//#region src/config/runtime-snapshot.d.ts
type RuntimeConfigSnapshotRefreshOptions = {
  includeAuthStoreRefs?: boolean;
};
type RuntimeConfigSnapshotRefreshParams = RuntimeConfigSnapshotRefreshOptions & {
  sourceConfig: OpenClawConfig;
  preflightResult?: unknown;
};
type MaybePromise<T> = T | Promise<T>;
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
declare function resolveConfigWriteAfterWrite(afterWrite?: ConfigWriteAfterWrite): ConfigWriteAfterWrite;
declare function resolveConfigWriteFollowUp(afterWrite?: ConfigWriteAfterWrite): ConfigWriteFollowUp;
type RuntimeConfigSnapshotRefreshHandler = {
  preflight?: (params: RuntimeConfigSnapshotRefreshParams) => MaybePromise<unknown>;
  refresh: (params: RuntimeConfigSnapshotRefreshParams) => boolean | Promise<boolean>;
  clearOnRefreshFailure?: () => void;
};
type RuntimeConfigWriteNotification = {
  configPath: string;
  sourceConfig: OpenClawConfig;
  runtimeConfig: OpenClawConfig;
  persistedHash: string;
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  writtenAtMs: number;
  afterWrite?: ConfigWriteAfterWrite;
  runtimeRefresh?: RuntimeConfigSnapshotRefreshOptions;
  preparedCandidate?: RuntimeConfigWritePreparedCandidate;
  preparedCandidatesByOwner?: ReadonlyMap<symbol, RuntimeConfigWritePreparedCandidate>;
};
type RuntimeConfigWritePreparedCandidate = {
  runtimeConfig: OpenClawConfig;
  compareConfig: OpenClawConfig;
  runtimeEnv?: PreparedConfigRuntimeEnv;
  reapplyRuntimeOverlays?: (config: OpenClawConfig) => OpenClawConfig;
  reapplyCompareOverlays?: (config: OpenClawConfig) => OpenClawConfig;
};
type RuntimeConfigSnapshotMetadata = {
  revision: number;
  fingerprint: string;
  sourceFingerprint: string | null;
  updatedAtMs: number;
};
declare function hashRuntimeConfigValue(value: OpenClawConfig): string;
declare function setRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig?: OpenClawConfig): void;
declare function setAppliedRuntimeConfigSnapshot(config: OpenClawConfig, sourceConfig: OpenClawConfig): void;
declare function resetConfigRuntimeState(): void;
declare function clearRuntimeConfigSnapshot(): void;
declare function getRuntimeConfigSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSourceSnapshot(): OpenClawConfig | null;
declare function getRuntimeConfigSnapshotMetadata(): RuntimeConfigSnapshotMetadata | null;
/** Resolved source-config revision accepted by the active Gateway runtime. */
declare function getRuntimeConfigAppliedHash(): string | null;
declare function setRuntimeConfigAppliedHash(hash: string | null): void;
declare function resolveRuntimeConfigCacheKey(config: OpenClawConfig): string;
declare function selectApplicableRuntimeConfig(params: {
  inputConfig?: OpenClawConfig;
  runtimeConfig?: OpenClawConfig | null;
  runtimeSourceConfig?: OpenClawConfig | null;
}): OpenClawConfig | undefined;
declare function setRuntimeConfigSnapshotRefreshHandler(refreshHandler: RuntimeConfigSnapshotRefreshHandler | null): void;
//#endregion
//#region src/config/io.types.d.ts
type ParseConfigJson5Result = {
  ok: true;
  parsed: unknown;
} | {
  ok: false;
  error: string;
};
type ConfigWriteResult = {
  persistedHash: string;
  persistedConfig: OpenClawConfig;
};
declare const configWritePostCommitRollback: unique symbol;
type InternalConfigWriteResult = ConfigWriteResult & {
  [configWritePostCommitRollback]?: () => void;
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
type ConfigWriteNotification = RuntimeConfigWriteNotification;
type ConfigSnapshotReadMeasure = <T>(name: string, run: () => T | Promise<T>) => Promise<T>;
declare class ConfigRuntimeRefreshError extends Error {
  constructor(message: string, options?: {
    cause?: unknown;
  });
}
type ConfigIoDeps = {
  fs?: typeof fs;
  json5?: typeof JSON5;
  env?: NodeJS.ProcessEnv;
  lowerPrecedenceEnv?: Readonly<Record<string, string>>;
  homedir?: () => string;
  configPath?: string;
  logger?: Pick<typeof console, "error" | "warn">;
  measure?: ConfigSnapshotReadMeasure;
  suppressFutureVersionWarning?: boolean;
  observe?: boolean;
};
type NormalizedConfigIoDeps = Required<ConfigIoDeps>;
type ConfigIoFactoryOptions = ConfigIoDeps & {
  pluginValidation?: "full" | "skip";
  preservedLegacyRootKeys?: readonly string[];
  shellEnvFallback?: "load" | "defer";
};
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
type ReadConfigFileSnapshotInternalResult = {
  snapshot: ConfigFileSnapshot;
  envSnapshotForRestore?: Record<string, string | undefined>;
  includeFileHashesForWrite?: Record<string, string>;
  includeFileTargetsForWrite?: Record<string, string>;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
type ReadConfigFileSnapshotWithPluginMetadataResult = {
  snapshot: ConfigFileSnapshot;
  pluginMetadataSnapshot?: PluginMetadataSnapshot;
};
type BestEffortConfigSnapshot = {
  config: OpenClawConfig;
  sourceConfig: OpenClawConfig;
};
type ConfigRecoveryCandidate = {
  raw: string;
  parsed: unknown;
  config?: OpenClawConfig;
};
type ConfigRecoveryCandidatePreparation = {
  ok: true;
  candidate: ConfigRecoveryCandidate;
} | {
  ok: false;
  reason: string;
};
//#endregion
//#region src/config/io.context.d.ts
type ValidationPluginMetadataSnapshotLoader = {
  load: (config: OpenClawConfig) => Pick<PluginMetadataSnapshot, "manifestRegistry">;
  getManifestRegistry: () => PluginManifestRegistry | undefined;
  getSnapshot: () => PluginMetadataSnapshot | undefined;
};
type ConfigIoContext = {
  deps: NormalizedConfigIoDeps;
  configPath: string;
  options: ConfigIoFactoryOptions;
  observeLoadConfigSnapshot: (snapshot: ConfigFileSnapshot) => ConfigFileSnapshot;
  finalizeLoadedRuntimeConfig: (config: OpenClawConfig) => OpenClawConfig;
  createValidationPluginMetadataSnapshotLoader: (params: {
    effectiveConfigRaw: unknown;
    env: NodeJS.ProcessEnv;
    allowCurrentPluginMetadata?: boolean;
  }) => ValidationPluginMetadataSnapshotLoader;
  resolveRuntimePreflightSourceConfig: (candidate: OpenClawConfig) => OpenClawConfig;
  prepareRecoveryBackupCandidate: (candidate: ConfigRecoveryCandidate) => ConfigRecoveryCandidatePreparation;
};
//#endregion
//#region src/config/io.write.d.ts
declare function writeConfigFileFromContext(context: ConfigIoContext, cfg: OpenClawConfig, options: ConfigWriteOptions, readSnapshot: () => Promise<ReadConfigFileSnapshotInternalResult>): Promise<InternalConfigWriteResult>;
//#endregion
//#region src/config/io.factory.d.ts
declare function createConfigIO(options?: ConfigIoFactoryOptions): {
  configPath: string;
  env: NodeJS.ProcessEnv;
  loadConfig: (loadOptions?: {
    skipSuspiciousRecovery?: boolean;
  }) => OpenClawConfig;
  readBestEffortConfig: () => Promise<OpenClawConfig>;
  readBestEffortConfigSnapshot: () => Promise<BestEffortConfigSnapshot>;
  readSourceConfigBestEffort: () => Promise<OpenClawConfig>;
  readConfigFileSnapshot: (readOptions?: ConfigSnapshotReadOptions) => Promise<ConfigFileSnapshot>;
  readConfigFileSnapshotWithPluginMetadata: (readOptions?: ConfigSnapshotReadOptions) => Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
  readConfigFileSnapshotForWrite: () => Promise<ReadConfigFileSnapshotForWriteResult>;
  promoteConfigSnapshotToLastKnownGood: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  recoverConfigFromLastKnownGood: (params: {
    snapshot: ConfigFileSnapshot;
    reason: string;
  }) => Promise<boolean>;
  preserveConfigSnapshotAsClobbered: (snapshot: ConfigFileSnapshot) => Promise<string | null>;
  recoverConfigFromJsonRootSuffix: (snapshot: ConfigFileSnapshot) => Promise<boolean>;
  writeConfigFile: (config: Parameters<typeof writeConfigFileFromContext>[1], writeOptions?: Parameters<typeof writeConfigFileFromContext>[2]) => Promise<InternalConfigWriteResult>;
};
//#endregion
//#region src/config/io.read-helpers.d.ts
declare function resolveConfigSnapshotHash(snapshot: {
  hash?: string;
  raw?: string | null;
}): string | null;
declare function parseConfigJson5(raw: string, json5?: {
  parse: (value: string) => unknown;
}): ParseConfigJson5Result;
//#endregion
//#region src/config/io.runtime.d.ts
declare function clearConfigCache(): void;
declare function registerConfigWriteListener(listener: (event: ConfigWriteNotification) => void, options?: {
  ownsRuntimeActivationFor?: string;
  preCommitRuntimePreflight?: (sourceConfig: OpenClawConfig, refreshOptions?: RuntimeConfigSnapshotRefreshOptions) => Promise<RuntimeConfigWritePreparedCandidate>;
}): () => void;
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
declare function readBestEffortConfig(options?: {
  isolateEnv?: boolean;
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<OpenClawConfig>;
declare function readBestEffortConfigSnapshot(options?: {
  observe?: boolean;
  skipPluginValidation?: boolean;
}): Promise<BestEffortConfigSnapshot>;
declare function readSourceConfigBestEffort(): Promise<OpenClawConfig>;
declare function readConfigFileSnapshot(options?: ConfigSnapshotReadOptions): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotWithPluginMetadata(options?: Pick<ConfigSnapshotReadOptions, "allowCurrentPluginMetadata" | "allowSuspiciousRecovery" | "isolateEnv" | "lowerPrecedenceEnv" | "measure" | "observe" | "recoverSuspicious">): Promise<ReadConfigFileSnapshotWithPluginMetadataResult>;
declare function promoteConfigSnapshotToLastKnownGood(snapshot: ConfigFileSnapshot): Promise<boolean>;
declare function recoverConfigFromLastKnownGood(params: {
  snapshot: ConfigFileSnapshot;
  reason: string;
}): Promise<boolean>;
declare function recoverConfigFromJsonRootSuffix(snapshot: ConfigFileSnapshot): Promise<boolean>;
declare function readSourceConfigSnapshot(): Promise<ConfigFileSnapshot>;
declare function readConfigFileSnapshotForWrite(options?: {
  skipPluginValidation?: boolean;
}): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function readSourceConfigSnapshotForWrite(): Promise<ReadConfigFileSnapshotForWriteResult>;
declare function writeConfigFile(cfg: OpenClawConfig, options?: ConfigWriteOptions): Promise<ConfigWriteResult>;
//#endregion
//#region src/config/runtime-source-projection.d.ts
/** Projects a runtime-derived config back onto the active authored source snapshot. */
declare function projectConfigOntoRuntimeSourceSnapshot(config: OpenClawConfig): OpenClawConfig;
//#endregion
//#region src/config/mutation-types.d.ts
/** Selects whether a mutation starts from runtime or source config shape. */
type ConfigMutationBase = "runtime" | "source";
//#endregion
//#region src/config/mutation-conflict.d.ts
/** Raised when a config write loses an optimistic snapshot race. */
declare class ConfigMutationConflictError extends Error {
  readonly currentHash: string | null;
  readonly retryable: boolean;
  constructor(message: string, params: {
    currentHash: string | null;
    retryable?: boolean;
  });
}
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (cfg: OpenClawConfig, options?: ConfigWriteOptions) => Promise<ConfigWriteResult | void>;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigTransformResult<T> = {
  nextConfig: OpenClawConfig;
  result?: T;
};
type ConfigMutationCommitParams = {
  nextConfig: OpenClawConfig;
  snapshot: ConfigFileSnapshot;
  baseHash?: string;
  writeOptions?: ConfigWriteOptions;
  afterWrite: ConfigWriteAfterWrite;
  io?: ConfigMutationIO;
};
type ConfigMutationCommitResult = {
  config: OpenClawConfig;
  persistedHash: string | null;
  afterWrite?: ConfigWriteAfterWrite;
};
type ConfigMutationCommit = (params: ConfigMutationCommitParams) => Promise<ConfigMutationCommitResult>;
type TransformConfigFileParams<T> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  commit?: ConfigMutationCommit;
  transform: (currentConfig: OpenClawConfig, context: ConfigMutationContext) => Promise<ConfigTransformResult<T>> | ConfigTransformResult<T>;
};
type TransformConfigFileWithRetryParams<T> = TransformConfigFileParams<T> & {
  maxAttempts?: number;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
/**
 * Run a multi-phase operation under the canonical cross-process write lock.
 * Nested mutation helpers are reentrant through activeConfigMutationLocks.
 */
declare function withConfigMutationExclusive<T>(fn: (config: OpenClawConfig) => Promise<T>): Promise<T>;
declare function replaceConfigFile(params: {
  nextConfig: OpenClawConfig;
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
}): Promise<ConfigReplaceResult>;
declare function transformConfigFile<T = void>(params: TransformConfigFileParams<T>): Promise<ConfigMutationResult<T>>;
declare function transformConfigFileWithRetry<T = void>(params: TransformConfigFileWithRetryParams<T>): Promise<ConfigMutationResult<T>>;
declare function mutateConfigFile<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
declare function mutateConfigFileWithRetry<T = void>(params: {
  base?: ConfigMutationBase;
  baseHash?: string;
  maxAttempts?: number;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  mutate: (draft: OpenClawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
}): Promise<ConfigMutationResult<T>>;
//#endregion
//#region src/config/nix-mode-write-guard.d.ts
/** Error thrown when a mutating config path is attempted while Nix owns config state. */
declare class NixModeConfigMutationError extends Error {
  readonly code = "OPENCLAW_NIX_MODE_CONFIG_IMMUTABLE";
  constructor(params?: {
    configPath?: string;
  });
}
/** Throw when the current environment marks OpenClaw config as Nix-managed and immutable. */
declare function assertConfigWriteAllowedInCurrentMode(params?: {
  configPath?: string;
  env?: NodeJS.ProcessEnv;
}): void;
//#endregion
//#region src/config/paths.d.ts
/**
 * Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
 * In this mode:
 * - No auto-install flows should be attempted
 * - Missing dependencies should produce actionable Nix-specific error messages
 * - Config is managed externally (read-only from Nix perspective)
 */
declare function resolveIsNixMode(env?: NodeJS.ProcessEnv): boolean;
declare let isNixMode: boolean;
/** True when the root CLI selected a non-default isolated profile. */
declare function isNamedProfile(env?: NodeJS.ProcessEnv): boolean;
declare function resolveLegacyStateDirs(homedir?: () => string): string[];
declare function resolveNewStateDir(homedir?: () => string): string;
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Whether the process uses the default home-scoped state directory. */
declare function isDefaultStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): boolean;
declare function resolveNativeServiceProfileConflict(env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform): string | null;
/** Whether host service management belongs to the active default install identity. */
declare function isDefaultInstallIdentity(env?: NodeJS.ProcessEnv, homedir?: () => string, platform?: NodeJS.Platform): boolean;
/** Whether external session catalogs may inherit a scan root from process HOME. */
declare function allowsProcessHomeSessionScan(env?: NodeJS.ProcessEnv, homedir?: () => string, platform?: NodeJS.Platform): boolean;
declare function normalizeStateDirEnv(env?: NodeJS.ProcessEnv): void;
/**
 * Optional allowlist of directories that `$include` directives may resolve
 * outside the config directory. Set via `OPENCLAW_INCLUDE_ROOTS` as a
 * platform-delimited path list (`:` on POSIX, `;` on Windows).
 *
 * Each entry is tilde-expanded and resolved to an absolute path. Entries that
 * cannot be resolved or that are not absolute after expansion are dropped.
 *
 * Returns an empty array when the var is unset or contains no usable entries,
 * preserving the historical behavior where `$include` is confined to the
 * directory containing `openclaw.json`.
 */
declare function resolveIncludeRoots(env?: NodeJS.ProcessEnv, homedir?: () => string): string[];
declare let STATE_DIR: string;
/**
 * Config file path (JSON or JSON5).
 * Can be overridden via OPENCLAW_CONFIG_PATH.
 * Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
 */
declare function resolveCanonicalConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string): string;
/**
 * Resolve the active config path by preferring existing config candidates
 * before falling back to the canonical path.
 */
declare function resolveConfigPathCandidate(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/**
 * Active config path (prefers existing config files).
 */
declare function resolveConfigPath(env?: NodeJS.ProcessEnv, stateDir?: string, homedir?: () => string): string;
declare let CONFIG_PATH: string;
/**
 * Re-pins process-stable runtime paths after an early startup selector changes the environment.
 *
 * Gateway startup must call this before importing runtime modules that derive their own constants
 * from these live bindings, otherwise one process can split reads and writes across two targets.
 */
declare function pinRuntimePaths(env?: NodeJS.ProcessEnv): {
  configPath: string;
  stateDir: string;
};
/**
 * Resolve default config path candidates across default locations.
 * Order: explicit config path → state-dir-derived paths → new default.
 */
declare function resolveDefaultConfigCandidates(env?: NodeJS.ProcessEnv, homedir?: () => string): string[];
declare const DEFAULT_GATEWAY_PORT = 18789;
/**
 * Gateway lock directory inside the selected state tree.
 * Default: $OPENCLAW_STATE_DIR/tmp/openclaw-<uid> (uid suffix when available).
 */
declare function resolveGatewayLockDir(stateDir?: string, uid?: number | undefined): string;
/**
 * Queue-owned copies of outbound attachments that have not been delivered yet,
 * held outside the media store so its TTL sweep cannot reclaim an attachment a
 * durable row still has to send.
 */
declare function resolveDeliveryQueueMediaDir(stateDir?: string): string;
/** Resolves the legacy credentials directory retained for Doctor and backup ownership. */
declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDir?: string): string;
declare function resolveGatewayPort(cfg?: OpenClawConfig, env?: NodeJS.ProcessEnv): number;
//#endregion
//#region src/config/recovery-policy.d.ts
/**
 * Return true when an invalid config snapshot is blocked only by plugin packaging fallout.
 * This lets callers show plugin repair hints instead of treating user config as corrupted.
 */
declare function isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues"> & Partial<Pick<ConfigFileSnapshot, "warnings">>): boolean;
/**
 * Return true when an invalid config snapshot is scoped entirely to stale plugin refs.
 * Whole-file recovery is skipped for these snapshots so plugin cleanup can preserve user config.
 */
declare function isPluginLocalInvalidConfigSnapshot(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">): boolean;
/**
 * Decide whether whole-file last-known-good recovery is appropriate for an invalid snapshot.
 * Plugin-local failures stay on the current file so targeted plugin cleanup can run.
 */
declare function shouldAttemptLastKnownGoodRecovery(snapshot: Pick<ConfigFileSnapshot, "valid" | "issues" | "legacyIssues">): boolean;
//#endregion
//#region src/config/runtime-overrides.d.ts
type OverrideTree = Record<string, unknown>;
/** Return the process-local runtime override tree used by debug config commands. */
declare function getConfigOverrides(): OverrideTree;
/** Clear all process-local runtime overrides. Intended for debug reset flows and tests. */
declare function resetConfigOverrides(): void;
/** Set one runtime override at a parsed config path after sanitizing object values. */
declare function setConfigOverride(pathRaw: string, value: unknown): Result<string[], string>;
/** Remove one runtime override path and report whether an override was present. */
declare function unsetConfigOverride(pathRaw: string): Result<boolean, string>;
/** Merge the current runtime overrides over a loaded config without mutating the input config. */
declare function applyConfigOverrides(cfg: OpenClawConfig): OpenClawConfig;
/** Capture an immutable applier for the process-local overrides active at this instant. */
declare function captureConfigOverrideApplier(): (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion
//#region src/config/validation-core.d.ts
/**
 * Validates config without applying runtime defaults.
 * Use this when you need the raw validated config (e.g., for writing back to file).
 */
declare function validateConfigObjectRaw(raw: unknown, opts?: {
  sourceRaw?: unknown;
  touchedPaths?: ReadonlyArray<ReadonlyArray<string>>;
  validateBundledChannels?: boolean;
  preservedLegacyRootKeys?: readonly string[];
  env?: NodeJS.ProcessEnv;
}): {
  ok: true;
  config: OpenClawConfig;
} | {
  ok: false;
  issues: ConfigValidationIssue[];
};
declare function validateConfigObject(raw: unknown, opts?: {
  manifestRegistry?: Pick<PluginMetadataSnapshot, "manifestRegistry">["manifestRegistry"];
  sourceRaw?: unknown;
}): {
  ok: true;
  config: OpenClawConfig;
} | {
  ok: false;
  issues: ConfigValidationIssue[];
};
//#endregion
//#region src/config/validation.d.ts
type ValidateConfigWithPluginsResult = {
  ok: true;
  config: OpenClawConfig;
  warnings: ConfigValidationIssue[];
} | {
  ok: false;
  issues: ConfigValidationIssue[];
  warnings: ConfigValidationIssue[];
};
type ValidateConfigWithPluginsParams = {
  env?: NodeJS.ProcessEnv;
  pluginValidation?: "full" | "skip";
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "manifestRegistry">;
  loadPluginMetadataSnapshot?: (config: OpenClawConfig) => Pick<PluginMetadataSnapshot, "manifestRegistry">;
  sourceRaw?: unknown;
  preservedLegacyRootKeys?: readonly string[];
};
declare function validateConfigObjectWithPlugins(raw: unknown, params?: ValidateConfigWithPluginsParams): ValidateConfigWithPluginsResult;
declare function validateConfigObjectRawWithPlugins(raw: unknown, params?: ValidateConfigWithPluginsParams): ValidateConfigWithPluginsResult;
//#endregion
export { transformConfigFile as $, resolveGatewayPort as A, ConfigWriteAfterWrite as At, ConfigMutationCommit as B, resolveConfigWriteAfterWrite as Bt, pinRuntimePaths as C, createConfigIO as Ct, resolveDefaultConfigCandidates as D, ConfigWriteNotification as Dt, resolveConfigPathCandidate as E, ConfigSnapshotReadOptions as Et, resolveNewStateDir as F, getRuntimeConfigSnapshot as Ft, ConfigMutationResult as G, setRuntimeConfigAppliedHash as Gt, ConfigMutationCommitResult as H, resolveRuntimeConfigCacheKey as Ht, resolveOAuthDir as I, getRuntimeConfigSnapshotMetadata as It, TransformConfigFileParams as J, ConfigReplaceResult as K, setRuntimeConfigSnapshot as Kt, resolveStateDir as L, getRuntimeConfigSourceSnapshot as Lt, resolveIsNixMode as M, RuntimeConfigSnapshotMetadata as Mt, resolveLegacyStateDirs as N, clearRuntimeConfigSnapshot as Nt, resolveDeliveryQueueMediaDir as O, ConfigWriteResult as Ot, resolveNativeServiceProfileConflict as P, getRuntimeConfigAppliedHash as Pt, replaceConfigFile as Q, NixModeConfigMutationError as R, hashRuntimeConfigValue as Rt, normalizeStateDirEnv as S, resolveConfigSnapshotHash as St, resolveConfigPath as T, ConfigRuntimeRefreshError as Tt, ConfigMutationContext as U, selectApplicableRuntimeConfig as Ut, ConfigMutationCommitParams as V, resolveConfigWriteFollowUp as Vt, ConfigMutationIO as W, setAppliedRuntimeConfigSnapshot as Wt, mutateConfigFile as X, TransformConfigFileWithRetryParams as Y, mutateConfigFileWithRetry as Z, allowsProcessHomeSessionScan as _, recoverConfigFromJsonRootSuffix as _t, applyConfigOverrides as a, clearConfigCache as at, isNamedProfile as b, writeConfigFile as bt, resetConfigOverrides as c, promoteConfigSnapshotToLastKnownGood as ct, isPluginLocalInvalidConfigSnapshot as d, readConfigFileSnapshot as dt, transformConfigFileWithRetry as et, isPluginPackagingRuntimeOutputInvalidConfigSnapshot as f, readConfigFileSnapshotForWrite as ft, STATE_DIR as g, readSourceConfigSnapshotForWrite as gt, DEFAULT_GATEWAY_PORT as h, readSourceConfigSnapshot as ht, validateConfigObjectRaw as i, projectConfigOntoRuntimeSourceSnapshot as it, resolveIncludeRoots as j, ConfigWriteFollowUp as jt, resolveGatewayLockDir as k, ReadConfigFileSnapshotWithPluginMetadataResult as kt, setConfigOverride as l, readBestEffortConfig as lt, CONFIG_PATH as m, readSourceConfigBestEffort as mt, validateConfigObjectWithPlugins as n, ConfigMutationConflictError as nt, captureConfigOverrideApplier as o, getRuntimeConfig as ot, shouldAttemptLastKnownGoodRecovery as p, readConfigFileSnapshotWithPluginMetadata as pt, ConfigTransformResult as q, setRuntimeConfigSnapshotRefreshHandler as qt, validateConfigObject as r, ConfigMutationBase as rt, getConfigOverrides as s, loadConfig as st, validateConfigObjectRawWithPlugins as t, withConfigMutationExclusive as tt, unsetConfigOverride as u, readBestEffortConfigSnapshot as ut, isDefaultInstallIdentity as v, recoverConfigFromLastKnownGood as vt, resolveCanonicalConfigPath as w, BestEffortConfigSnapshot as wt, isNixMode as x, parseConfigJson5 as xt, isDefaultStateDir as y, registerConfigWriteListener as yt, assertConfigWriteAllowedInCurrentMode as z, resetConfigRuntimeState as zt };