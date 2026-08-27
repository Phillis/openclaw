import { Ga as OptionalBootstrapFileName, i as OpenClawConfig, ti as AgentRouteBinding } from "./types.openclaw-woQof385.js";
import { Ft as ChannelChoice } from "./host-capability-types-BNON-nf1.js";
import { c as PluginPackageChannel, f as RuntimeEnv, l as PluginPackageInstall, o as PluginOrigin } from "./manifest-registry-DsWy3jGA.js";
import { i as PluginInstallSourceInfo } from "./installed-plugin-index-types-FxZBxK7R.js";
import { A as resolveGatewayPort, T as resolveConfigPath, dt as readConfigFileSnapshot, et as transformConfigFileWithRetry } from "./config-DiNLUfeX.js";
import { _ as ChannelMeta, t as ChannelPlugin } from "./types.public-CYOgtmD9.js";
import { a as resolveApiKeyForProviderCore } from "./provider-model-types-CwinAwen.js";
import { a as ensureAuthProfileStore } from "./usage-BcXLFbyC.js";
import { D as LocalCommandProbe, L as DefaultInferenceRouteProjection, O as probeGatewayUrl, R as resolveCliAuthBindingFingerprint, k as probeLocalCommand, o as verifySetupInferenceConfig } from "./setup-inference-D7V-GOif.js";
//#region src/channels/plugins/catalog.d.ts
type ChannelPluginCatalogInstall = PluginPackageInstall & ({
  clawhubSpec: string;
} | {
  npmSpec: string;
});
type ChannelPluginCatalogEntry = {
  id: string;
  pluginId?: string;
  origin?: PluginOrigin;
  trustedSourceLinkedOfficialInstall?: boolean;
  channel?: PluginPackageChannel;
  meta: ChannelMeta;
  install: ChannelPluginCatalogInstall;
  installSource?: PluginInstallSourceInfo;
};
//#endregion
//#region src/config/channel-configured-shared.d.ts
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
declare function isStaticallyChannelConfigured(cfg: OpenClawConfig, channelId: string, env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/commands/agents.bindings.d.ts
/** Merge new route bindings into config while reporting adds, upgrades, skips, and conflicts. */
declare function applyAgentBindings(cfg: OpenClawConfig, bindings: AgentRouteBinding[]): {
  config: OpenClawConfig;
  added: AgentRouteBinding[];
  updated: AgentRouteBinding[];
  skipped: AgentRouteBinding[];
  conflicts: Array<{
    binding: AgentRouteBinding;
    existingAgentId: string;
  }>;
};
//#endregion
//#region src/agents/agent-create.d.ts
type CreateAgentResult = {
  status: "created" | "existing";
  agentId: string;
  name: string;
  workspace: string;
  agentDir: string;
  model?: string;
  bootstrapPending: boolean;
  configHash?: string;
  bindingResult?: ReturnType<typeof applyAgentBindings>;
} | {
  status: "error";
  reason: "invalid-name" | "reserved-id" | "already-exists" | "deletion-pending" | "invalid-bindings" | "legacy-session-migration-required" | "shared-auth-store-owned-by-main" | "unsafe-identity-file";
  agentId?: string;
  message: string;
};
type AgentEntryConfig = NonNullable<NonNullable<OpenClawConfig["agents"]>["entries"]>[string];
type CreateAgentEntry = AgentEntryConfig & {
  id: string;
};
type CreateAgentParams = {
  name?: string;
  entry?: CreateAgentEntry; /** Internal authorization for onboarding to materialize the sole implicit `main` agent. */
  bootstrapMain?: boolean; /** Replace the load-time compatibility roster when onboarding creates the first real agent. */
  bootstrapFirstAgent?: boolean; /** Config revision that must still own first-agent creation under the write lock. */
  expectedConfigHash?: string | null; /** Full guided-flow staging based on expectedConfigHash; creation still publishes it once. */
  stagedConfig?: OpenClawConfig;
  workspace?: string;
  model?: string;
  emoji?: unknown;
  avatar?: unknown;
  agentDir?: string;
  skipBootstrap?: boolean;
  skipOptionalBootstrapFiles?: OptionalBootstrapFileName[];
  bindingSpecs?: string[];
  transformConfig?: typeof transformConfigFileWithRetry;
};
declare function createAgent(params: CreateAgentParams): Promise<CreateAgentResult>;
//#endregion
//#region src/commands/onboard-agent.d.ts
type FirstOnboardingAgent = {
  name: string;
};
//#endregion
//#region src/wizard/setup.finalize.d.ts
type GatewayServiceSetupOutcome = {
  status: "ready";
  action: "installed" | "started" | "reused" | "restarted" | "restart-scheduled";
} | {
  status: "skipped";
  reason: "explicit" | "systemd-unavailable" | "external";
} | {
  status: "failed";
  error: string;
};
//#endregion
//#region src/system-agent/setup-apply.d.ts
/**
 * The whole first-run setup as one approved operation: the user says "yes" in
 * the conversation and this applies model + workspace + quickstart gateway
 * defaults, seeds workspace bootstrap files, and (on the CLI surface) installs
 * and starts the gateway service. No interactive prompts may occur here —
 * everything uses quickstart defaults, so the conversation stays the only UI.
 */
type SystemAgentSetupApplyParams = {
  workspace: string; /** Selected first agent when setup starts without a persisted roster. */
  firstAgent?: FirstOnboardingAgent; /** Explicit interactive approval to replace an existing fleet workspace root. */
  allowWorkspaceChange?: boolean;
  model?: string;
  agentRuntimeId?: string; /** Pin the selected model to the exact credential that passed inference. */
  authProfileId?: string; /** Exact default-agent route whose inference passed the setup gate. */
  expectedInferenceRoute?: DefaultInferenceRouteProjection; /** Live-probe target; setup aborts if another process switches the default agent. */
  expectedAgentId?: string; /** Manual-auth target; setup aborts if the selected agent's credential directory moves. */
  expectedAgentDir?: string; /** Existing-model probe target; setup aborts if that model changes before persistence. */
  expectedModelRef?: string; /** Full config revision used by the live probe; null means the file was absent. */
  expectedConfigHash?: string | null; /** Provider-auth config produced in the isolated manual-key flow. */
  configPatch?: unknown; /** Success-gated final normalization against the config held by the write lock. */
  finalizeConfig?: (config: OpenClawConfig, sourceConfig: OpenClawConfig) => OpenClawConfig; /** Plugin whose enablement belongs to the successful setup transaction. */
  enablePluginId?: string; /** Refresh an installed plugin after its success-gated enablement commits. */
  refreshPluginRegistry?: boolean; /** Synchronous cross-store guard receives authored config under the final write lock. */
  assertCommitPreconditions?: (sourceConfig: OpenClawConfig) => void; /** Resume an interrupted local installation without restarting a running Gateway. */
  resume?: boolean;
  surface: "cli" | "gateway";
  runtime: RuntimeEnv;
};
type SystemAgentSetupApplyResult = {
  configPath: string;
  configHashBefore: string | null;
  configHashAfter: string | null;
  bootstrapPending: boolean;
  workspaceReady: boolean;
  gateway: GatewayServiceSetupOutcome;
  lines: string[];
};
type SystemAgentSetupApplyHooks = {
  /** Host-owned authority seam; called at every persistent setup boundary. */commit<T>(effect: () => Promise<T> | T): Promise<T>;
};
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
declare function applySystemAgentSetup(params: SystemAgentSetupApplyParams, hooks?: SystemAgentSetupApplyHooks): Promise<SystemAgentSetupApplyResult>;
//#endregion
//#region src/channels/plugins/setup-registry.d.ts
/**
 * Lists setup-capable channel plugins, falling back to bundled setup metadata.
 */
declare function listChannelSetupPlugins(): ChannelPlugin[];
//#endregion
//#region src/commands/channel-setup/discovery.d.ts
type ChannelCatalogEntry = {
  id: ChannelChoice;
  meta: ChannelMeta;
};
/** Return true when channel metadata should appear in setup/onboarding choices. */
type ResolvedChannelSetupEntries = {
  entries: ChannelCatalogEntry[];
  installedCatalogEntries: ChannelPluginCatalogEntry[];
  installableCatalogEntries: ChannelPluginCatalogEntry[];
  installedCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
  installableCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
};
/** List channel ids contributed by currently installed manifest-backed plugins. */
/** Merge configured channels and installable catalog channels into setup display buckets. */
declare function resolveChannelSetupEntries(params: {
  cfg: OpenClawConfig;
  installedPlugins: ChannelPlugin[];
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): ResolvedChannelSetupEntries;
//#endregion
//#region src/cli/config-set-input.d.ts
type ConfigSetOptions = {
  strictJson?: boolean; /** @deprecated Use strictJson. */
  json?: boolean;
  dryRun?: boolean;
  allowExec?: boolean;
  merge?: boolean;
  replace?: boolean;
  refProvider?: string;
  refSource?: string;
  refId?: string;
  providerSource?: string;
  providerAllowlist?: string[];
  providerPath?: string;
  providerMode?: string;
  providerTimeoutMs?: string;
  providerMaxBytes?: string;
  providerCommand?: string;
  providerArg?: string[];
  providerNoOutputTimeoutMs?: string;
  providerMaxOutputBytes?: string;
  providerJsonOnly?: boolean;
  providerEnv?: string[];
  providerPassEnv?: string[];
  providerTrustedDir?: string[];
  batchJson?: string;
  batchFile?: string;
};
//#endregion
//#region src/commands/doctor.types.d.ts
/** CLI option shape shared by doctor command entrypoints and prompt helpers. */
type DoctorOptions = {
  workspaceSuggestions?: boolean;
  yes?: boolean;
  nonInteractive?: boolean;
  deep?: boolean;
  repair?: boolean;
  force?: boolean;
  generateGatewayToken?: boolean;
  allowExec?: boolean;
  postUpgrade?: boolean;
  stateSqlite?: "compact";
  sessionSqlite?: "dry-run" | "import" | "validate" | "inspect" | "compact" | "restore" | "recover";
  sessionSqliteStore?: string;
  sessionSqliteAgent?: string;
  sessionSqliteAllAgents?: boolean;
  sessionSqliteGithubIssue?: boolean;
  json?: boolean;
};
//#endregion
//#region src/tui/tui-types.d.ts
type TuiExitReason = "exit" | "return-to-system-agent";
type TuiResult = {
  exitReason: TuiExitReason;
  systemAgentMessage?: string;
};
//#endregion
//#region src/agents/docs-path.d.ts
type ResolveOpenClawReferencePathParams = {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
};
/** Resolve docs and source roots concurrently for prompt/reference injection. */
declare function resolveOpenClawReferencePaths(params: ResolveOpenClawReferencePathParams): Promise<{
  docsPath: string | null;
  sourcePath: string | null;
}>;
//#endregion
//#region src/system-agent/overview.d.ts
type SystemAgentSummary = {
  id: string;
  name?: string;
  isDefault: boolean;
  model?: string;
  workspace?: string;
};
type SystemAgentOverview = {
  config: {
    path: string;
    exists: boolean;
    valid: boolean;
    issues: string[];
    hash: string | null;
  };
  agents: SystemAgentSummary[];
  defaultAgentId: string;
  defaultModel?: string;
  tools: {
    codex: LocalCommandProbe;
    claude: LocalCommandProbe;
    gemini: LocalCommandProbe;
    apiKeys: {
      openai: boolean;
      anthropic: boolean;
    };
  };
  gateway: {
    url: string;
    source: string;
    reachable: boolean;
    error?: string;
  };
  references: {
    docsPath?: string;
    docsUrl: string;
    sourcePath?: string;
    sourceUrl: string;
  };
};
type GatewayConnectionDetails = {
  url: string;
  urlSource: string;
  remoteFallbackNote?: string;
};
type SystemAgentOverviewDependencies = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  resolveConfigPath?: typeof resolveConfigPath;
  resolveGatewayPort?: typeof resolveGatewayPort;
  buildGatewayConnectionDetails?: (input: {
    config: OpenClawConfig;
    configPath: string;
  }) => GatewayConnectionDetails;
  probeLocalCommand?: typeof probeLocalCommand;
  probeGatewayUrl?: typeof probeGatewayUrl;
  resolveOpenClawReferencePaths?: typeof resolveOpenClawReferencePaths;
};
declare function loadSystemAgentOverview(opts?: {
  env?: NodeJS.ProcessEnv;
  deps?: SystemAgentOverviewDependencies;
}): Promise<SystemAgentOverview>;
//#endregion
//#region src/system-agent/operations-parse.d.ts
type SystemAgentOverviewLoader = () => Promise<SystemAgentOverview>;
type SystemAgentOverviewFormatter = (overview: SystemAgentOverview) => string;
/** Injectable command dependencies used by tests and alternate runners. */
type SystemAgentCommandDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProviderCore;
  formatOverview?: SystemAgentOverviewFormatter;
  loadOverview?: SystemAgentOverviewLoader;
  createAgent?: typeof createAgent;
  runConfigSet?: (opts: {
    path?: string;
    value?: string;
    cliOptions: ConfigSetOptions;
  }) => Promise<void>;
  runDoctor?: (runtime: RuntimeEnv, options: DoctorOptions) => Promise<void>;
  runGatewayRestart?: () => Promise<void | boolean>;
  runGatewayStart?: () => Promise<void>;
  runGatewayStop?: () => Promise<void>;
  runPluginUninstall?: (pluginId: string, runtime: RuntimeEnv) => Promise<void>;
  runPluginsList?: (runtime: RuntimeEnv) => Promise<void>;
  runPluginsSearch?: (query: string, runtime: RuntimeEnv) => Promise<void>;
  runTui?: (opts: {
    local: boolean;
    session?: string;
    deliver?: boolean;
    historyLimit?: number;
    message?: string;
  }) => Promise<TuiResult | void>; /** Where setup side effects run; the gateway surface never manages its own daemon. */
  setupSurface?: "cli" | "gateway";
  applySetup?: typeof applySystemAgentSetup;
  verifyInferenceConfig?: typeof verifySetupInferenceConfig;
  listChannelSetupPlugins?: typeof listChannelSetupPlugins;
  resolveChannelSetupEntries?: typeof resolveChannelSetupEntries;
  isChannelConfigured?: typeof isStaticallyChannelConfigured;
};
//#endregion
export { SystemAgentOverview as n, loadSystemAgentOverview as r, SystemAgentCommandDeps as t };