import { i as OpenClawConfig, p as PluginInstallRecord } from "./types.openclaw-woQof385.js";
import { Lt as EmbeddedAgentRunResult, U as resolveCliBackendLiveSessionRequirement, b as ProviderAuthResult, l as AgentHarnessAuthBindingFingerprintParams, r as ProviderPlugin, v as AgentHarnessRuntimeArtifactBinding, z as RunCliAgentParams } from "./host-capability-types-BX08s7pv.js";
import { f as RuntimeEnv, o as PluginOrigin, s as OpenClawPackageBuild } from "./manifest-registry-DsWy3jGA.js";
import { n as InstalledPluginIndexRefreshReason } from "./installed-plugin-index-types-C4mEs_4Z.js";
import { n as PluginMetadataRegistryView, r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-DzTdp-gX.js";
import { t as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-uytVFqbZ.js";
import { G as ConfigMutationResult, Y as TransformConfigFileWithRetryParams, dt as readConfigFileSnapshot } from "./config-4pLcarPF.js";
import { i as AuthProfileStore } from "./types-CXLbbwkS.js";
import { O as WizardPrompter } from "./types.public-CYOgtmD9.js";
import { a as resolveApiKeyForProviderCore, o as ResolvedProviderAuth } from "./provider-model-types-CwinAwen.js";
import { a as ensureAuthProfileStore, c as AuthProfileDatabase, o as loadAuthProfileStoreForRuntime, s as updateAuthProfileStoreWithLock } from "./usage-iGEAfk5K.js";
import { n as AgentExecutionAuthBinding, r as OpaqueRuntimeOwnerKind, t as runEmbeddedAgent } from "./embedded-agent-runner-DJ2uJDO7.js";
import { d as PluginLoadOptions } from "./loader-B-R7CncR.js";
import { n as InstalledPluginIndexStoreOptions } from "./installed-plugin-index-store-BtVMRm-J.js";
import { execSync } from "node:child_process";

//#region src/state/openclaw-agent-db.d.ts
/** Close and unregister one unambiguous transient agent database by filesystem identity. */
declare function disposeOpenClawAgentDatabaseByPath(pathname: string, options?: {
  env?: NodeJS.ProcessEnv;
}): boolean;
//#endregion
//#region src/agents/cli-executable-identity.d.ts
type CliExecutableFileIdentity = Readonly<{
  path: string;
  device: string;
  inode: string;
  mode: string;
  size: string;
  modifiedNs: string;
  changedNs: string;
  contentSha256: string;
}>;
/** Immutable executable projection bound to one successful CLI process. */
type CliExecutableIdentity = Readonly<{
  command: string;
  resolvedPath: string;
  invocation: Readonly<{
    command: string;
    leadingArgv: readonly string[];
    resolution: "direct" | "node-entrypoint" | "exe-entrypoint";
  }>;
  files: readonly CliExecutableFileIdentity[];
  runtimeArtifact: Readonly<{
    kind: "self-contained-executable";
  }> | Readonly<{
    kind: "package-tree";
    packageName: string;
    packageVersion: string;
    rootPath: string;
    fileCount: number;
    totalBytes: string;
    treeSha256: string;
  }>;
}>;
//#endregion
//#region src/agents/cli-auth-epoch.d.ts
/**
 * Strict credential-owner proof for a verified inference turn. Unlike the
 * reusable-session epoch, identity-less OAuth tokens intentionally invalidate
 * on rotation because accepting an unknown replacement could cross accounts.
 */
declare function resolveCliAuthBindingFingerprint(params: {
  provider: string;
  config: OpenClawConfig;
  agentDir?: string;
  authProfileId?: string; /** Exact selected profile material actually forwarded to this execution. */
  resolvedAuth?: ResolvedProviderAuth;
  skipLocalCredential?: boolean;
}): string | undefined;
type CliRuntimeArtifactFingerprintParams = {
  provider: string;
  config: OpenClawConfig;
  agentId?: string;
  runtimeArtifactId?: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  executableIdentity?: CliExecutableIdentity;
};
/** Hash the exact executable plus backend-owned package implementation tree. */
/** Re-resolve a CLI backend's complete executable/package artifact boundary. */
declare function resolveCliRuntimeArtifactFingerprint(params: CliRuntimeArtifactFingerprintParams): Promise<string | undefined>;
/**
 * Resolve a CLI runtime's non-secret owner shape. The trusted runner emits
 * this projection only after a real successful turn; callers must not treat
 * this pre-run value as proof by itself.
 */
declare function resolveCliRuntimeOwnerFingerprint(params: {
  provider: string;
  config: OpenClawConfig;
  agentDir?: string;
  agentId?: string;
  runtimeOwnerId?: string;
  authProfileId?: string;
  skipLocalCredential?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  executableIdentity?: CliExecutableIdentity;
  runtimeArtifactFingerprint?: string;
}): Promise<string | undefined>;
//#endregion
//#region src/system-agent/inference-route.d.ts
type SystemAgentConfiguredRoute = {
  runConfig: OpenClawConfig;
  modelLabel: string;
  provider: string;
  model: string;
  agentDir: string;
  agentId: string;
  authProfileId?: string;
} & ({
  runner: "cli";
} | {
  runner: "embedded";
  agentHarnessRuntimeOverride?: string;
});
type SystemAgentConfiguredRouteDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  loadAuthProfileStoreForRuntime?: typeof loadAuthProfileStoreForRuntime;
  pluginMetadataPlugins?: PluginMetadataSnapshot["plugins"];
};
type DistributiveOmit$1<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type DefaultInferenceRouteProjection = {
  route: DistributiveOmit$1<SystemAgentConfiguredRoute, "runConfig"> | null;
  defaultSelection: {
    explicitIds: string[];
    fallbackId?: string;
  };
  auth: unknown;
  models: unknown;
  defaults: unknown;
  agent?: unknown;
  executionAgent?: unknown;
  env: OpenClawConfig["env"];
  secrets: OpenClawConfig["secrets"];
  plugins: OpenClawConfig["plugins"];
  tools: OpenClawConfig["tools"];
};
//#endregion
//#region src/plugins/provider-auth-choices.d.ts
type ProviderAuthChoiceMetadata = {
  pluginId: string;
  providerId: string;
  methodId: string;
  choiceId: string;
  choiceLabel: string;
  choiceHint?: string;
  icon?: string;
  website?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
  deprecatedChoiceIds?: string[];
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  onboardingFeatured?: boolean;
  optionKey?: string;
  cliFlag?: string;
  cliOption?: string;
  cliDescription?: string;
  appGuidedSecret?: boolean;
  appGuidedActionLabel?: string;
  appGuidedDiscovery?: boolean;
  appGuidedAuth?: "oauth" | "device-code";
  onboardingScopes?: ("text-inference" | "image-generation" | "music-generation")[];
};
type ManifestProviderAuthChoiceParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  metadataSnapshot?: PluginMetadataSnapshot;
  includeUntrustedWorkspacePlugins?: boolean;
  includeWorkspacePlugins?: boolean;
};
declare function resolveManifestProviderAuthChoices(params?: ManifestProviderAuthChoiceParams): ProviderAuthChoiceMetadata[];
declare function resolveManifestProviderAuthChoice(choiceId: string, params?: ManifestProviderAuthChoiceParams): ProviderAuthChoiceMetadata | undefined;
//#endregion
//#region src/system-agent/setup-inference-auth-options.d.ts
type SetupInferenceManualProvider = {
  /** Provider-auth choice id sent back to `openclaw.setup.activate`. */id: string; /** Canonical provider identity for clients with bundled brand artwork. */
  brandId?: string; /** Provider family shown above the specific credential method. */
  groupLabel?: string;
  label: string;
  hint?: string;
  icon?: string;
  website?: string;
};
type SetupInferenceAuthOption = {
  /** Provider-auth choice id sent to `openclaw.setup.auth.start`. */id: string; /** Canonical provider identity for clients with bundled brand artwork. */
  brandId?: string;
  label: string;
  hint?: string;
  groupLabel?: string;
  icon?: string;
  website?: string;
  kind: "oauth" | "device-code";
  featured: boolean;
};
type SetupInferencePrepareOption = {
  /** Provider-auth choice id sent to `openclaw.setup.prepare.start`. */id: string; /** Canonical provider identity for clients with bundled brand artwork. */
  brandId?: string;
  label: string;
  hint?: string;
  actionLabel?: string;
  icon?: string;
  website?: string;
};
declare function listSetupInferenceManualProviders(authChoices: readonly ProviderAuthChoiceMetadata[]): SetupInferenceManualProvider[];
declare function listSetupInferenceAuthOptions(authChoices: readonly ProviderAuthChoiceMetadata[]): SetupInferenceAuthOption[];
declare function listSetupInferencePrepareOptions(authChoices: readonly ProviderAuthChoiceMetadata[]): SetupInferencePrepareOption[];
//#endregion
//#region src/plugins/recommended-tool-installs.d.ts
type SetupRecommendedInstall = {
  id: string;
  brandId?: string;
  label: string;
  hint: string;
  website: string;
  icon: string;
};
//#endregion
//#region src/agents/cli-runner.d.ts
/** Prepares and runs one CLI-backed agent turn. */
declare function runCliAgent(paramsInput: RunCliAgentParams): Promise<EmbeddedAgentRunResult>;
//#endregion
//#region src/commands/codex-runtime-plugin-install.d.ts
declare const ensureCodexRuntimePluginForModelSelection: (params: {
  cfg: OpenClawConfig;
  model?: string;
  agentId?: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  workspaceDir?: string;
}) => Promise<{
  cfg: OpenClawConfig;
  required: boolean;
  installed: boolean;
  status?: "installed" | "skipped" | "failed" | "timed_out";
  reason?: string;
}>;
//#endregion
//#region src/plugins/install-record-commit.d.ts
/** Transform config with retry support while preserving plugin install index consistency. */
declare function transformConfigWithPendingPluginInstalls<T = void>(params: Omit<TransformConfigFileWithRetryParams<T>, "commit">): Promise<ConfigMutationResult<T>>;
//#endregion
//#region src/plugins/installed-plugin-index-record-cache.d.ts
/** Clears cached installed plugin records and advances the cache generation. */
declare function clearLoadInstalledPluginIndexInstallRecordsCache(): void;
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.d.ts
/** Reads install records from the persisted installed plugin index. */
declare function readPersistedInstalledPluginIndexInstallRecords(options?: InstalledPluginIndexStoreOptions): Promise<Record<string, PluginInstallRecord> | null>;
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
declare function loadInstalledPluginIndexInstallRecords(params?: InstalledPluginIndexStoreOptions): Promise<Record<string, PluginInstallRecord>>;
//#endregion
//#region src/plugins/registry-refresh.d.ts
/** Optional warning sink for best-effort registry/cache refresh failures. */
type PluginRegistryRefreshLogger = {
  warn?: (message: string) => void;
};
/** Refresh persisted plugin registry and clear runtime discovery after a config mutation. */
declare function refreshPluginRegistryAfterConfigMutation(params: {
  config: OpenClawConfig;
  reason: InstalledPluginIndexRefreshReason;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  installRecords?: Awaited<ReturnType<typeof loadInstalledPluginIndexInstallRecords>>;
  invalidateRuntimeCache?: boolean;
  policyPluginIds?: readonly string[];
  traceCommand?: string;
  logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
declare function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params: {
  logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-registry-loader.d.ts
type PluginRegistryScope = "configured-channels" | "channels" | "memory" | "all";
declare function ensurePluginRegistryLoaded(options?: {
  scope?: PluginRegistryScope;
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
}): void;
//#endregion
//#region src/plugins/managed-npm-retention.d.ts
declare function markRetainedManagedNpmInstall(params: {
  packageDir: string;
  pluginId: string;
  retainedAt?: string;
  reason: string;
}): Promise<boolean>;
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.d.ts
/** Clears plugin metadata snapshots and registered process memo caches. */
declare function clearPluginMetadataLifecycleCaches(): void;
//#endregion
//#region src/agents/auth-profiles/persisted.d.ts
type LoadPersistedAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  database?: AuthProfileDatabase;
};
/** Normalizes a single legacy credential entry into a canonical credential. */
/** Loads the persisted auth profile store and merges runtime state. */
declare function loadPersistedAuthProfileStore(agentDir?: string, options?: LoadPersistedAuthProfileStoreOptions): AuthProfileStore | null;
//#endregion
//#region src/agents/cli-credentials.d.ts
/** API-key credential parsed from the active Codex CLI auth mode. */
type CodexCliApiKeyCredential = {
  type: "api_key";
  provider: "openai";
  key: string;
};
type ExecSyncFn = typeof execSync;
/** Reads an API key only when Codex confirms that exact credential is active. */
declare function readCodexCliActiveApiKey(options?: {
  codexHome?: string;
  allowKeychainPrompt?: boolean;
  platform?: NodeJS.Platform;
  execSync?: ExecSyncFn;
}): CodexCliApiKeyCredential | null;
//#endregion
//#region src/system-agent/probes.d.ts
/**
 * Local environment probes used by OpenClaw overview loading.
 *
 * Probes are bounded by output and timeout limits so setup/status commands do
 * not hang or retain unbounded child output.
 */
/** Result from probing a local command binary. */
type LocalCommandProbe = {
  command: string;
  found: boolean;
  version?: string;
  error?: string;
  timedOut?: boolean;
};
/** Probe a command by running a small version command with bounded output and timeout. */
declare function probeLocalCommand(command: string, args?: string[], opts?: {
  outputLimit?: number;
  timeoutMs?: number;
}): Promise<LocalCommandProbe>;
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
declare function probeGatewayUrl(url: string, opts?: {
  timeoutMs?: number;
}): Promise<{
  reachable: boolean;
  url: string;
  error?: string;
}>;
//#endregion
//#region src/commands/onboard-inference-ambient.d.ts
type InferenceBackendKind = "existing-model" | "openai-api-key" | "anthropic-api-key" | "claude-cli" | "codex-cli" | "gemini-cli";
type InferenceBackendCandidate = {
  kind: InferenceBackendKind;
  modelRef: string; /** Short human label, e.g. "Claude Code CLI". */
  label: string; /** One-line provenance, e.g. "logged in", "ANTHROPIC_API_KEY set". */
  detail: string;
  /**
   * true: credentials verified; false: definitively logged out; undefined:
   * unknown (e.g. macOS keychain-backed logins we must not prompt for here).
   */
  credentials?: boolean;
};
//#endregion
//#region src/commands/onboard-inference.d.ts
/**
 * Onboarding treats inference as the one required step: reuse whatever the
 * machine already has (env API keys, Claude Code login, Codex login) before
 * asking the user anything. The ladder order is a documented contract
 * (docs/cli/setup.md "Setup bootstrap") — change docs when changing it.
 */
type DetectInferenceBackendsDeps = {
  probeLocalCommand?: typeof probeLocalCommand;
  readClaudeCliCredentials?: () => {
    type: string;
  } | null;
  readCodexCliCredentials?: () => {
    type: string;
  } | null;
  readGeminiCliCredentials?: () => {
    type: string;
  } | null;
  detectCodexLoginState?: typeof detectCodexLoginState;
  randomInt?: (maxExclusive: number) => number;
  resolveClaudeLiveSessionRequirement?: typeof resolveCliBackendLiveSessionRequirement;
};
type DetectInferenceBackendsOptions = {
  config?: OpenClawConfig;
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
  deps?: DetectInferenceBackendsDeps;
};
declare function detectCodexLoginState(probe: typeof probeLocalCommand, command: string): Promise<boolean | undefined>;
/**
 * Detect usable inference backends in ladder order. Returns candidates only
 * for backends that exist on this machine; the first entry is the bootstrap
 * default. Backends that are definitively logged out sink below logged-in and
 * unknown ones so a stale install never outranks a working login.
 */
declare function detectInferenceBackends(options?: DetectInferenceBackendsOptions): Promise<InferenceBackendCandidate[]>;
//#endregion
//#region src/plugins/enable.d.ts
type PluginEnableOptions = {
  updateChannelConfig?: boolean;
};
/** Result of enabling a plugin in config. */
type PluginEnableResult = {
  config: OpenClawConfig;
  enabled: boolean;
  pluginId: string;
  reason?: string;
};
/** Enables a plugin in config unless global, denylist, or allowlist policy blocks it. */
declare function enablePluginInConfig(cfg: OpenClawConfig, pluginId: string, options?: PluginEnableOptions): PluginEnableResult;
//#endregion
//#region src/plugins/providers.runtime.d.ts
declare function resolvePluginProvidersCore(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string; /** Use an explicit env when plugin roots should resolve independently from process.env. */
  env?: PluginLoadOptions["env"]; /** @deprecated Ignored; tests must provide explicit plugin config. Remove in the next major release. */
  bundledProviderVitestCompat?: boolean;
  onlyPluginIds?: string[];
  providerRefs?: readonly string[];
  modelRefs?: readonly string[];
  activate?: boolean;
  cache?: boolean;
  applyAutoEnable?: boolean;
  pluginSdkResolution?: PluginLoadOptions["pluginSdkResolution"];
  mode?: "runtime" | "setup";
  includeUntrustedWorkspacePlugins?: boolean;
  pluginMetadataSnapshot?: PluginMetadataRegistryView;
  skipIfLoadInFlight?: boolean;
}): ProviderPlugin[];
//#endregion
//#region src/plugins/plugin-runtime-artifact-identity.d.ts
type PluginRuntimeArtifactIdentitySource = Readonly<{
  pluginId: string;
  origin: PluginOrigin;
  rootDir: string;
  source?: string;
  packageBuild?: OpenClawPackageBuild;
}>;
//#endregion
//#region src/system-agent/verified-inference.d.ts
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type SystemAgentConfiguredRouteIdentity = DistributiveOmit<SystemAgentConfiguredRoute, "runConfig" | "authProfileId">;
type SystemAgentVerifiedExecutionRoute = Extract<SystemAgentConfiguredRoute, {
  runner: "cli";
}> | (Extract<SystemAgentConfiguredRoute, {
  runner: "embedded";
}> & {
  agentHarnessRuntimeOverride: string;
});
type SystemAgentVerifiedExecutionFingerprint = {
  route: unknown;
  defaultSelection: unknown;
  auth: unknown;
  models: unknown;
  defaults: unknown;
  agent?: unknown;
  plugins: unknown;
  ownerPluginRuntimes: readonly SystemAgentOwnerPluginRuntimeIdentity[];
};
type SystemAgentOwnerPluginRuntimeIdentity = Readonly<{
  pluginId: string;
  origin: string;
  rootDir: string;
  manifestPath: string;
  manifestHash: string;
  source: string | null;
  packageName: string | null;
  packageVersion: string | null;
  installRecordHash: string | null;
  packageJson: Readonly<{
    path: string;
    hash: string;
  }> | null;
}>;
type SystemAgentOwnerPluginArtifactIdentity = Readonly<{
  pluginId: string;
  fingerprint: string;
}>;
type SystemAgentOwnerPluginArtifactSnapshot = Readonly<{
  ownerPluginIds: readonly string[];
  ownerPluginArtifacts: readonly SystemAgentOwnerPluginArtifactIdentity[];
}>;
type SystemAgentOwnerPluginRegistryRecord = {
  pluginId: string;
  origin: PluginOrigin;
  rootDir: string;
  manifestPath: string;
  manifestHash: string;
  source?: string;
  packageName?: string;
  packageVersion?: string;
  installRecordHash?: string;
  packageJson?: {
    path: string;
    hash: string;
  };
  packageBuild?: OpenClawPackageBuild;
};
type SystemAgentOwnerPluginRegistryLoader = (params: {
  config: OpenClawConfig;
  workspaceDir: string;
  env: NodeJS.ProcessEnv;
}) => {
  plugins: readonly SystemAgentOwnerPluginRegistryRecord[];
};
/** Server-local proof returned only after the exact route completes a live turn. */
type SystemAgentVerifiedInferenceBinding = Readonly<{
  configuredRoute: SystemAgentConfiguredRouteIdentity;
  execution: SystemAgentVerifiedExecutionRoute;
  executionFingerprint: SystemAgentVerifiedExecutionFingerprint;
  ownerPluginIds: readonly string[];
  ownerPluginArtifacts: readonly SystemAgentOwnerPluginArtifactIdentity[];
  auth: Readonly<{
    authProfileId?: string;
    agentHarnessId?: string;
    modelId?: string;
    modelApi?: string;
    authFingerprint: string;
    proofKind?: "runtime-owner";
    runtimeOwnerKind?: OpaqueRuntimeOwnerKind;
    runtimeOwnerId?: string;
    runtimeArtifactFingerprint?: string;
    runtimeArtifactId?: string;
    skipLocalCredential?: true;
  }>;
}>;
type SystemAgentVerifiedInferenceDeps = SystemAgentConfiguredRouteDeps & {
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveCliRuntimeOwnerFingerprint?: typeof resolveCliRuntimeOwnerFingerprint;
  resolveCliRuntimeArtifactFingerprint?: typeof resolveCliRuntimeArtifactFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProviderCore;
  validateAgentHarnessRuntimeArtifact?: (params: {
    harnessId: string;
    artifact: AgentHarnessRuntimeArtifactBinding;
  }) => Promise<boolean>;
  resolveAgentHarnessAuthBindingFingerprint?: (params: AgentHarnessAuthBindingFingerprintParams & {
    harnessId: string;
  }) => Promise<string | undefined>;
  loadPluginRegistrySnapshot?: SystemAgentOwnerPluginRegistryLoader;
  fingerprintPluginRuntimeArtifact?: (record: PluginRuntimeArtifactIdentitySource) => string;
};
/** Capture once immediately before a live setup turn. */
declare function captureSystemAgentOwnerPluginArtifacts(params: {
  config: OpenClawConfig;
  executionRoute: SystemAgentConfiguredRoute;
  deps?: SystemAgentVerifiedInferenceDeps;
}): SystemAgentOwnerPluginArtifactSnapshot;
declare function createSystemAgentVerifiedInferenceBinding(params: {
  configuredRoute: SystemAgentConfiguredRoute;
  executionRoute: SystemAgentConfiguredRoute;
  auth: AgentExecutionAuthBinding;
  deps?: SystemAgentVerifiedInferenceDeps;
}): Promise<SystemAgentVerifiedInferenceBinding>;
/** Re-hash plugin-owned runtime files only at a persistent side-effect boundary. */
declare function hasCurrentSystemAgentOwnerPluginArtifacts(binding: SystemAgentVerifiedInferenceBinding, deps?: SystemAgentVerifiedInferenceDeps): Promise<boolean>;
declare function resolveSystemAgentVerifiedInferenceRoute(binding: SystemAgentVerifiedInferenceBinding, deps?: SystemAgentVerifiedInferenceDeps): Promise<SystemAgentVerifiedExecutionRoute | null>;
//#endregion
//#region src/system-agent/setup-inference-core.d.ts
/**
 * Inference is the one required onboarding step (docs/cli/setup.md
 * "Setup bootstrap"). This module gives structured clients (macOS app) the
 * same ladder the conversation uses, with one hard guarantee: a candidate is
 * persisted as the default model only after a real completion round-trips.
 * A failing candidate must never leave config pointing at a broken model.
 */
declare const SETUP_INFERENCE_TEST_TIMEOUT_MS = 90000;
type ProviderAutoSetupInferenceKind = `provider-auto:${string}`;
type SetupInferenceKind = InferenceBackendKind | ProviderAutoSetupInferenceKind;
type SetupInferenceCandidate = {
  kind: SetupInferenceKind; /** Canonical provider identity for clients with bundled brand artwork. */
  brandId?: string;
  label: string;
  detail: string;
  modelRef: string; /** @deprecated Gateway wire compatibility for older macOS clients. Always false. */
  recommended: false;
  credentials?: boolean;
  icon?: string;
  website?: string;
};
type SetupInferenceUnavailableCandidate = {
  id: string; /** Canonical provider identity for clients with bundled brand artwork. */
  brandId?: string;
  label: string;
  detail: string;
  reason: string; /** Provider-owned interactive sign-in that can replace the unavailable route. */
  authOptionId?: string; /** Provider-owned manual secret route that can replace the unavailable route. */
  manualProviderId?: string;
  icon?: string;
  website?: string;
};
type SetupInferenceDetection = {
  candidates: SetupInferenceCandidate[]; /** Installed integrations that cannot safely run the tool-free setup probe. */
  unavailableCandidates: SetupInferenceUnavailableCandidate[]; /** Text-inference key/token methods exposed by installed provider manifests. */
  manualProviders: SetupInferenceManualProvider[]; /** Interactive provider-owned browser and device-code sign-in methods. */
  authOptions: SetupInferenceAuthOption[]; /** Provider-owned app-guided local model setup methods. */
  prepareOptions?: SetupInferencePrepareOption[]; /** Curated tools clients can offer when no existing AI access is detected. */
  recommendedInstalls: SetupRecommendedInstall[]; /** Resolved workspace the setup apply would use (display + default). */
  workspace: string;
  configuredModel?: string; /** The connected Gateway already has a configured default-agent model. */
  setupComplete: boolean;
};
type SetupInferenceStatus = "ok" | "auth" | "rate_limit" | "billing" | "timeout" | "format" | "unavailable" | "unknown";
type SetupInferenceFailureStatus = Exclude<SetupInferenceStatus, "ok">;
type ActivateSetupInferenceResult = {
  ok: true;
  modelRef: string;
  latencyMs: number;
  lines: string[];
} | {
  ok: false;
  status: SetupInferenceFailureStatus;
  error: string;
};
/**
 * The config commit may have happened, so callers must verify current setup
 * instead of treating this like a definitive candidate failure and retrying.
 */
declare class SetupInferenceActivationIndeterminateError extends Error {
  name: string;
}
type VerifySetupInferenceResult = {
  ok: true;
  modelRef: string;
  latencyMs: number;
  authProfiles?: ProviderAuthResult["profiles"];
} | {
  ok: false;
  status: SetupInferenceFailureStatus;
  error: string;
  authProfiles?: ProviderAuthResult["profiles"];
};
type CompleteSetupInferenceResult = {
  ok: true;
  modelRef: string;
  latencyMs: number;
  text: string;
} | {
  ok: false;
  status: SetupInferenceFailureStatus;
  error: string;
};
type BoundVerifySetupInferenceResult = {
  ok: true;
  modelRef: string;
  latencyMs: number;
  binding: SystemAgentVerifiedInferenceBinding;
} | {
  ok: false;
  status: SetupInferenceFailureStatus;
  error: string;
};
type ActivateSetupInferenceParams = {
  kind: SetupInferenceKind | "api-key" | "provider-auth"; /** Configured agent that owns the route being tested and persisted. */
  agentId?: string; /** Exact explicit model to probe and persist instead of the route's starter model. */
  modelRef?: string; /** Manual step only: provider-auth choice returned by detection. */
  authChoice?: string; /** Manual step only: the pasted API key or token. Never logged. */
  apiKey?: string;
  workspace?: string;
  surface: "cli" | "gateway"; /** False when an enclosing persistent-operation boundary owns the setup audit. */
  recordSetupAudit?: boolean;
  runtime: RuntimeEnv; /** Interactive provider login transport, required for `provider-auth`. */
  prompter?: WizardPrompter; /** Cancels provider-owned browser callbacks and device-code polling. */
  signal?: AbortSignal; /** Session cancellation gate; interactive credentials must never persist after cancel. */
  isCancelled?: () => boolean; /** Observe the authored config held by the inference writer before it commits. */
  onCommitStarted?: (sourceConfig: OpenClawConfig) => void;
  deps?: ActivateSetupInferenceDeps;
};
type SetupInferenceRunEmbeddedAgent = (params: Parameters<typeof runEmbeddedAgent>[0] & {
  onSuccessfulAuthBinding?: (binding: AgentExecutionAuthBinding) => void;
  authProfileStateMode?: "read-write" | "read-only";
  preparedModelRuntimeMode?: "isolated-read-only";
}) => ReturnType<typeof runEmbeddedAgent>;
type ActivateSetupInferenceDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  runEmbeddedAgent?: SetupInferenceRunEmbeddedAgent;
  runCliAgent?: typeof runCliAgent;
  ensureCodexRuntimePlugin?: typeof ensureCodexRuntimePluginForModelSelection;
  transformConfigWithPendingPluginInstalls?: typeof transformConfigWithPendingPluginInstalls;
  refreshPluginRegistryAfterConfigMutation?: typeof refreshPluginRegistryAfterConfigMutation;
  ensurePluginRegistryLoaded?: typeof ensurePluginRegistryLoaded;
  resolvePluginProviders?: typeof resolvePluginProvidersCore;
  resolveManifestProviderAuthChoice?: typeof resolveManifestProviderAuthChoice;
  enablePluginInConfig?: typeof enablePluginInConfig;
  updateAuthProfileStoreWithLock?: typeof updateAuthProfileStoreWithLock;
  loadPersistedAuthProfileStore?: typeof loadPersistedAuthProfileStore;
  loadAuthProfileStoreForRuntime?: typeof loadAuthProfileStoreForRuntime;
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveCliRuntimeArtifactFingerprint?: typeof resolveCliRuntimeArtifactFingerprint;
  resolveCliRuntimeOwnerFingerprint?: typeof resolveCliRuntimeOwnerFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProviderCore;
  resolvePluginMetadataSnapshot?: typeof resolvePluginMetadataSnapshot;
  readCodexCliActiveApiKey?: typeof readCodexCliActiveApiKey;
  loadPluginRegistrySnapshot?: SystemAgentVerifiedInferenceDeps["loadPluginRegistrySnapshot"];
  fingerprintPluginRuntimeArtifact?: SystemAgentVerifiedInferenceDeps["fingerprintPluginRuntimeArtifact"];
  captureSystemAgentOwnerPluginArtifacts?: typeof captureSystemAgentOwnerPluginArtifacts;
  createSystemAgentVerifiedInferenceBinding?: typeof createSystemAgentVerifiedInferenceBinding;
  readPersistedInstalledPluginIndexInstallRecords?: typeof readPersistedInstalledPluginIndexInstallRecords;
  markRetainedManagedNpmInstall?: typeof markRetainedManagedNpmInstall;
  clearLoadInstalledPluginIndexInstallRecordsCache?: typeof clearLoadInstalledPluginIndexInstallRecordsCache;
  clearPluginMetadataLifecycleCaches?: typeof clearPluginMetadataLifecycleCaches;
  invalidatePluginRuntimeDiscoveryAfterConfigMutation?: typeof invalidatePluginRuntimeDiscoveryAfterConfigMutation;
  disposeOpenClawAgentDatabaseByPath?: typeof disposeOpenClawAgentDatabaseByPath;
  createTempDir?: () => Promise<string>;
  removeTempDir?: (dir: string) => Promise<void>;
  timeoutMs?: number;
};
type DetectSetupInferenceDeps = {
  detectInferenceBackends?: typeof detectInferenceBackends;
  probeLocalCommand?: typeof probeLocalCommand;
  resolveManifestProviderAuthChoices?: typeof resolveManifestProviderAuthChoices;
  resolvePluginProviders?: typeof resolvePluginProvidersCore;
  enablePluginInConfig?: typeof enablePluginInConfig;
};
//#endregion
//#region src/system-agent/setup-inference-detect.d.ts
/**
 * Manual setup options only — no CLI probing, no credential discovery. Used
 * when guarded onboarding declines the "look around" step: the option lists
 * derive from config and plugin manifests, never from scanning the machine.
 */
declare function listManualSetupInferenceOptions(deps?: DetectSetupInferenceDeps, agentId?: string): Promise<Pick<SetupInferenceDetection, "manualProviders" | "authOptions" | "prepareOptions" | "workspace" | "setupComplete">>;
declare function detectSetupInference(deps?: DetectSetupInferenceDeps, agentId?: string): Promise<SetupInferenceDetection>;
//#endregion
//#region src/system-agent/setup-inference-activate.d.ts
/**
 * Test one candidate with a real completion, then persist it as the setup
 * default. Manual credentials are tested from a temporary auth store and
 * copied into the real agent store only after success. A managed Codex install
 * record may remain after a failed probe because the installed package already exists.
 */
declare function activateSetupInference(params: ActivateSetupInferenceParams): Promise<ActivateSetupInferenceResult>;
//#endregion
//#region src/system-agent/setup-inference-verify.d.ts
type VerifySetupInferenceParams = {
  kind?: "existing-model";
  agentId?: string;
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps;
};
/** Live-test the configured default model without changing config or auth state. */
declare function verifySetupInference(params: VerifySetupInferenceParams & {
  bindSession: true;
}): Promise<BoundVerifySetupInferenceResult>;
declare function verifySetupInference(params: VerifySetupInferenceParams & {
  bindSession?: false;
}): Promise<VerifySetupInferenceResult>;
type BoundSetupInferenceVerifier = (params: {
  runtime: RuntimeEnv;
  bindSession: true;
  agentId?: string;
  deps?: ActivateSetupInferenceDeps;
}) => Promise<BoundVerifySetupInferenceResult>;
type ResolvePersistentApplyInferenceDeps = SystemAgentVerifiedInferenceDeps & {
  resolveVerifiedInferenceRoute?: typeof resolveSystemAgentVerifiedInferenceRoute;
  hasCurrentOwnerPluginArtifacts?: typeof hasCurrentSystemAgentOwnerPluginArtifacts;
  verifyBoundInference?: BoundSetupInferenceVerifier;
};
/**
 * Strict credentials need only the static owner check. Opaque runtimes can
 * prove liveness only by completing another exact turn at the side-effect
 * boundary; the result must still be the original frozen route.
 */
declare function resolvePersistentApplyInference(params: {
  binding: SystemAgentVerifiedInferenceBinding;
  runtime: RuntimeEnv;
  deps?: ResolvePersistentApplyInferenceDeps;
}): Promise<SystemAgentConfiguredRoute | null>;
/** Live-test a staged default-agent route before any caller persists it. */
declare function verifySetupInferenceConfig(params: {
  config: OpenClawConfig; /** Candidate profiles staged in the isolated probe store, never the real agent store. */
  authProfiles?: ProviderAuthResult["profiles"];
  agentId?: string; /** Explicit isolated agent directory for staged onboarding verification. */
  agentDir?: string;
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps; /** Internal session gate: capture only the final exact successful credential. */
  onVerifiedExecution?: (auth: AgentExecutionAuthBinding, binding: SystemAgentVerifiedInferenceBinding) => void; /** Reject a successful turn unless its runner reports the exact execution owner. */
  requireExecutionOwner?: boolean;
}): Promise<VerifySetupInferenceResult>;
/** Run one tool-free completion through the configured setup inference route. */
declare function completeSetupInference(params: {
  prompt: string;
  agentId?: string;
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps;
}): Promise<CompleteSetupInferenceResult>;
/** Config-injected variant used by setup clients and live provider tests. */
declare function completeSetupInferenceConfig(params: {
  config: OpenClawConfig;
  prompt: string;
  agentId?: string;
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps;
}): Promise<CompleteSetupInferenceResult>;
//#endregion
export { SetupRecommendedInstall as A, SetupInferenceStatus as C, LocalCommandProbe as D, SystemAgentVerifiedInferenceBinding as E, listSetupInferenceManualProviders as F, listSetupInferencePrepareOptions as I, DefaultInferenceRouteProjection as L, SetupInferenceManualProvider as M, SetupInferencePrepareOption as N, probeGatewayUrl as O, listSetupInferenceAuthOptions as P, resolveCliAuthBindingFingerprint as R, SetupInferenceKind as S, VerifySetupInferenceResult as T, SETUP_INFERENCE_TEST_TIMEOUT_MS as _, verifySetupInference as a, SetupInferenceDetection as b, detectSetupInference as c, ActivateSetupInferenceParams as d, ActivateSetupInferenceResult as f, ProviderAutoSetupInferenceKind as g, DetectSetupInferenceDeps as h, resolvePersistentApplyInference as i, SetupInferenceAuthOption as j, probeLocalCommand as k, listManualSetupInferenceOptions as l, CompleteSetupInferenceResult as m, completeSetupInference as n, verifySetupInferenceConfig as o, BoundVerifySetupInferenceResult as p, completeSetupInferenceConfig as r, activateSetupInference as s, ResolvePersistentApplyInferenceDeps as t, ActivateSetupInferenceDeps as u, SetupInferenceActivationIndeterminateError as v, SetupInferenceUnavailableCandidate as w, SetupInferenceFailureStatus as x, SetupInferenceCandidate as y };