import { E as ThinkingLevelMap, m as OpenAIResponsesCompat, p as OpenAICompletionsCompat, t as AnthropicMessagesCompat } from "./types-DTWCh4Mv.js";
import "./types-Cc0P-Eyx.js";
import { t as SecretInput } from "./types.secrets-ktKWXaKr.js";
//#region src/config/types.sandbox.d.ts
type SandboxDockerSettings = {
  /** Docker image to use for sandbox containers. */
  image?: string;
  /** Prefix for sandbox container names. */
  containerPrefix?: string;
  /** Container workdir mount path (default: /workspace). */
  workdir?: string;
  /** Run container rootfs read-only. */
  readOnlyRoot?: boolean;
  /** Extra tmpfs mounts for read-only containers. */
  tmpfs?: string[];
  /** Container network mode (bridge|none|custom). */
  network?: string;
  /** Container user (uid:gid). */
  user?: string;
  /** Drop Linux capabilities. */
  capDrop?: string[];
  /** Explicit environment variables for sandbox container creation and exec. */
  env?: Record<string, string>;
  /** Optional setup command run once after container creation (array entries are joined by newline). */
  setupCommand?: string;
  /** Limit container PIDs (0 = Docker default). */
  pidsLimit?: number;
  /** Limit container memory (e.g. 512m, 2g, or bytes as number). */
  memory?: string | number;
  /** Limit container memory swap (same format as memory). */
  memorySwap?: string | number;
  /** Limit container CPU shares (e.g. 0.5, 1, 2). */
  cpus?: number;
  /** GPU devices to expose via Docker --gpus (e.g. "all", "device=GPU-uuid"). */
  gpus?: string;
  /**
   * Set ulimit values by name (e.g. nofile, nproc).
   * Use "soft:hard" string, a number, or { soft, hard }.
   */
  ulimits?: Record<string, string | number | {
    soft?: number;
    hard?: number;
  }>;
  /** Seccomp profile (path or profile name). */
  seccompProfile?: string;
  /** AppArmor profile name. */
  apparmorProfile?: string;
  /** DNS servers (e.g. ["1.1.1.1", "8.8.8.8"]). */
  dns?: string[];
  /** Extra host mappings (e.g. ["api.local:10.0.0.2"]). */
  extraHosts?: string[];
  /** Additional bind mounts (host:container:mode format, e.g. ["/host/path:/container/path:rw"]). */
  binds?: string[];
  /**
   * Dangerous override: allow bind mounts that target reserved container paths
   * like /workspace or /agent.
   */
  dangerouslyAllowReservedContainerTargets?: boolean;
  /**
   * Dangerous override: allow bind mount sources outside runtime allowlisted roots
   * (workspace + agent workspace roots).
   */
  dangerouslyAllowExternalBindSources?: boolean;
  /**
   * Dangerous override: allow Docker `network: "container:<id>"` namespace joins.
   * Default behavior blocks container namespace joins to preserve sandbox isolation.
   */
  dangerouslyAllowContainerNamespaceJoin?: boolean;
};
type SandboxBrowserSettings = {
  enabled?: boolean;
  image?: string;
  containerPrefix?: string;
  /** Docker network for sandbox browser containers (default: openclaw-sandbox-browser). */
  network?: string;
  cdpPort?: number;
  /** Optional CIDR allowlist for CDP ingress at the container edge (for example: 172.21.0.1/32). */
  cdpSourceRange?: string;
  vncPort?: number;
  noVncPort?: number;
  headless?: boolean;
  noVncEnabled?: boolean;
  /** @deprecated Doctor-only legacy input. */
  enableNoVnc?: boolean;
  /**
   * Allow sandboxed sessions to target the host browser control server.
   * Default: false.
   */
  allowHostControl?: boolean;
  /**
   * When true (default), sandboxed browser control will try to start/reattach to
   * the sandbox browser container when a tool call needs it.
   */
  autoStart?: boolean;
  /** Max time to wait for CDP to become reachable after auto-start (ms). */
  autoStartTimeoutMs?: number;
  /** Additional bind mounts for the browser container only. When set, replaces docker.binds for the browser container. */
  binds?: string[];
};
type SandboxPruneSettings = {
  /** Prune if idle for more than N hours (0 disables). */
  idleHours?: number;
  /** Prune if older than N days (0 disables). */
  maxAgeDays?: number;
};
type SandboxSshSettings = {
  /** SSH target in user@host[:port] form. */
  target?: string;
  /** SSH client command. Default: "ssh". */
  command?: string;
  /** Absolute remote root used for per-scope workspaces. */
  workspaceRoot?: string;
  /** Enforce host-key verification. Default: true. */
  strictHostKeyChecking?: boolean;
  /** Allow OpenSSH host-key updates. Default: true. */
  updateHostKeys?: boolean;
  /** Existing private key path on the host. */
  identityFile?: string;
  /** Existing SSH certificate path on the host. */
  certificateFile?: string;
  /** Existing known_hosts file path on the host. */
  knownHostsFile?: string;
  /** Inline or SecretRef-backed private key contents. */
  identityData?: SecretInput;
  /** Inline or SecretRef-backed SSH certificate contents. */
  certificateData?: SecretInput;
  /** Inline or SecretRef-backed known_hosts contents. */
  knownHostsData?: SecretInput;
};
//#endregion
//#region src/config/types.agents-shared.d.ts
/** Agent model selector: a single provider/model ref or primary+fallback chain. */
type AgentModelConfig = string | {
  /** Primary model (provider/model). */
  primary?: string;
  /** Per-agent model fallbacks (provider/model). */
  fallbacks?: string[];
};
/** Tool-specific model selector with an optional capability timeout override. */
type AgentToolModelConfig = string | {
  /** Primary model (provider/model). */
  primary?: string;
  /** Per-tool model fallbacks (provider/model). */
  fallbacks?: string[];
  /** Optional provider request timeout in milliseconds for capabilities that support it. */
  timeoutMs?: number;
};
/** Runtime selection policy attached to providers, models, and agent defaults. */
type AgentRuntimePolicyConfig = {
  /** Agent runtime id. Omitted uses "openclaw"; "auto" opts into plugin harness auto-selection. */
  id?: string;
};
/** Per-agent sandbox policy shared by embedded agents and sandbox backends. */
type AgentSandboxConfig = {
  /** Sandbox activation mode for this agent. */
  mode?: "off" | "non-main" | "all";
  /** Sandbox runtime backend id. Default: "docker". */
  backend?: string;
  /** Agent workspace access inside the sandbox. */
  workspaceAccess?: "none" | "ro" | "rw";
  /**
   * Session tools visibility for sandboxed sessions.
   * - "spawned": only allow session tools to target sessions spawned from this session (default)
   * - "all": allow session tools to target any session
   */
  sessionToolsVisibility?: "spawned" | "all";
  /** Container/workspace scope for sandbox isolation. */
  scope?: "session" | "agent" | "shared";
  /** Host workspace root mounted or copied into the sandbox. */
  workspaceRoot?: string;
  /** Docker-specific sandbox settings. */
  docker?: SandboxDockerSettings;
  /** SSH-specific sandbox settings. */
  ssh?: SandboxSshSettings;
  /** Optional sandboxed browser settings. */
  browser?: SandboxBrowserSettings;
  /** Auto-prune sandbox settings. */
  prune?: SandboxPruneSettings;
};
//#endregion
//#region src/config/types.provider-request.d.ts
/** Authentication override applied to provider requests after model/provider defaults resolve. */
type ConfiguredProviderRequestAuth = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: SecretInput;
} | {
  mode: "header";
  headerName: string;
  value: SecretInput;
  prefix?: string;
};
/** TLS material and verification knobs for provider or proxy connections. */
type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy selection for provider requests, including optional TLS settings for proxy transport. */
type ConfiguredProviderRequestProxy = {
  mode: "env-proxy";
  tls?: ConfiguredProviderRequestTls;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ConfiguredProviderRequestTls;
};
/** Shared provider request overrides used by model providers and media/tool providers. */
type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};
/** Model-provider request overrides plus the private-network opt-in used by model transports. */
type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/config/types.models.d.ts
/** Provider API adapter ids accepted by model/provider config and schema generation. */
declare const MODEL_APIS: readonly ["openai-completions", "openai-responses", "openai-chatgpt-responses", "anthropic-messages", "google-generative-ai", "google-vertex", "github-copilot", "bedrock-converse-stream", "ollama", "azure-openai-responses"];
type ModelApi = (typeof MODEL_APIS)[number];
type SupportedOpenAICompatFields = Pick<OpenAICompletionsCompat, "supportsStore" | "supportsDeveloperRole" | "supportsReasoningEffort" | "supportsUsageInStreaming" | "supportsStrictMode" | "supportsJsonSchemaResponseFormat" | "maxTokensField" | "requiresToolResultName" | "requiresAssistantAfterToolResult" | "requiresThinkingAsText" | "requiresReasoningContentOnAssistantMessages" | "openRouterRouting" | "vercelGatewayRouting" | "zaiToolStream" | "cacheControlFormat" | "sendSessionAffinityHeaders" | "supportsLongCacheRetention">;
type SupportedOpenAIResponsesCompatFields = Pick<OpenAIResponsesCompat, "sendSessionIdHeader" | "supportsLongCacheRetention" | "supportsTemperature">;
type SupportedAnthropicMessagesCompatFields = Pick<AnthropicMessagesCompat, "supportsEagerToolInputStreaming" | "supportsLongCacheRetention">;
type SupportedThinkingFormat = NonNullable<OpenAICompletionsCompat["thinkingFormat"]> | "deepseek" | "openrouter" | "together";
/** Provider/model compatibility switches consumed by request builders and tool schema adapters. */
type ModelCompatConfig = SupportedOpenAICompatFields & SupportedOpenAIResponsesCompatFields & SupportedAnthropicMessagesCompatFields & {
  /** Reasoning/thinking payload dialect for provider-compatible APIs. */
  thinkingFormat?: SupportedThinkingFormat;
  /** Provider-accepted reasoning effort labels. */
  supportedReasoningEfforts?: string[];
  /** Maps OpenClaw reasoning effort labels to provider-specific labels. */
  reasoningEffortMap?: Record<string, string>;
  /** Reasoning detail block types safe to expose in visible transcripts. */
  visibleReasoningDetailTypes?: string[];
  /** Whether this model supports tool/function calling. */
  supportsTools?: boolean;
  /** Code-mode tier consumed by `tools.codeMode.enabled: "auto"`; absent means "capable". */
  codeMode?: "preferred" | "capable";
  /** Whether provider accepts prompt-cache/session affinity keys. */
  supportsPromptCacheKey?: boolean;
  /** Whether all message parts must be coerced to plain strings. */
  requiresStringContent?: boolean;
  /** Whether unknown message payload keys must be stripped before requests. */
  strictMessageKeys?: boolean;
  /** Named tool-schema profile used by provider adapters. */
  toolSchemaProfile?: string;
  /** JSON Schema keywords rejected by this provider's tool schema validator. */
  unsupportedToolSchemaKeywords?: string[];
  /** Encoding expected for tool-call arguments in provider payloads. */
  toolCallArgumentsEncoding?: string;
  /** Whether OpenAI-style calls must be reshaped to Anthropic-compatible tool payloads. */
  requiresOpenAiAnthropicToolPayload?: boolean;
};
type ModelImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */
  maxBytes?: number;
  /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number;
  /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number;
  /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number;
  /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};
type ModelMediaInputConfig = {
  /** Image input limits and accounting hints for this model. */
  image?: ModelImageInputConfig;
};
/** Authentication mode expected by a configured model provider. */
type ModelProviderAuthMode = "api-key" | "aws-sdk" | "oauth" | "token";
type ModelProviderLocalServiceConfig = {
  /** Executable started before model requests are sent. */
  command: string;
  /** Arguments passed without shell expansion. */
  args?: string[];
  /** Working directory for the local service process. */
  cwd?: string;
  /** Environment variables added to the service process. */
  env?: Record<string, string>;
  /** Optional health endpoint polled before the provider is considered ready. */
  healthUrl?: string;
  /** Startup readiness timeout in milliseconds. */
  readyTimeoutMs?: number;
  /** Idle timeout in milliseconds before stopping the local service. */
  idleStopMs?: number;
};
type ModelDefinitionConfig = {
  /** Provider-facing model id. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Optional API adapter override for this model. */
  api?: ModelApi;
  /** Optional base URL override for this model. */
  baseUrl?: string;
  /** Whether the model supports reasoning/thinking controls. */
  reasoning: boolean;
  /** Supported input modalities for routing and media-tool selection. */
  input: Array<"text" | "image" | "video" | "audio">;
  /** Token pricing in USD per million tokens. */
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    /** Optional tiered pricing.  When present, cost calculation uses
     *  per-tier rates instead of the flat rates above.  Prices are
     *  USD / million tokens; ranges are half-open `[start, end)` on the
     *  input-token axis. */
    tieredPricing?: Array<{
      input: number;
      output: number;
      cacheRead: number;
      cacheWrite: number;
      /** Bounded tier: `[start, end)`. Open-ended top tier: `[start]` (normalized to `[start, Infinity]` at load time). */
      range: [number, number] | [number];
    }>;
  };
  /** Provider/native maximum context window in tokens. */
  contextWindow?: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while letting configs
   * prefer a smaller practical window.
   */
  contextTokens?: number;
  /** Maximum completion/output token budget. */
  maxTokens: number;
  /** Maps OpenClaw thinking levels to provider/model-specific values. */
  thinkingLevelMap?: ThinkingLevelMap;
  /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>;
  /** Optional agent execution runtime override for this provider/model pair. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Static headers merged into requests for this model. */
  headers?: Record<string, string>;
  /** Provider compatibility flags for payload shaping and feature gating. */
  compat?: ModelCompatConfig;
  /** Media input limits used by routing and preflight compression. */
  mediaInput?: ModelMediaInputConfig;
  /** Metadata source marker for models added by CLI/catalog tooling. */
  metadataSource?: "models-add";
};
type ModelProviderConfig = {
  /** Provider API base URL. */
  baseUrl: string;
  /** API key or secret reference for this provider. */
  apiKey?: SecretInput;
  /** Authentication mode used when resolving credentials for this provider. */
  auth?: ModelProviderAuthMode;
  /** Default API adapter for models under this provider. */
  api?: ModelApi;
  /** Provider-level default max output tokens. */
  maxTokens?: number;
  /** Provider request timeout in seconds. */
  timeoutSeconds?: number;
  /** Optional provider deployment/API region used by provider plugins that expose regional endpoints. */
  region?: string;
  injectNumCtxForOpenAICompat?: boolean;
  /** Provider-specific runtime parameters interpreted by provider plugins. */
  params?: Record<string, unknown>;
  /** Optional default agent execution runtime for models under this provider. */
  agentRuntime?: AgentRuntimePolicyConfig;
  /** Optional local service to start before calling this provider. */
  localService?: ModelProviderLocalServiceConfig;
  /** Secret-bearing headers merged into provider requests. */
  headers?: Record<string, SecretInput>;
  /** Whether default Authorization header injection is enabled. */
  authHeader?: boolean;
  /** Provider request transport/retry overrides. */
  request?: ConfiguredModelProviderRequest;
  /** Model catalog entries exposed by this provider. */
  models: ModelDefinitionConfig[];
};
/** Fully materialized provider declaration emitted by provider catalog plugins. */
type ModelProviderDeclarationConfig = ModelProviderConfig;
type BedrockDiscoveryConfig = {
  /** Enable AWS Bedrock model discovery. */
  enabled?: boolean;
  /** AWS region to query for models. */
  region?: string;
  /** Optional provider id filters for discovery. */
  providerFilter?: string[];
  /** Discovery cache refresh interval in seconds. */
  refreshInterval?: number;
  /** Context window applied when discovery cannot infer one. */
  defaultContextWindow?: number;
  /** Max output tokens applied when discovery cannot infer one. */
  defaultMaxTokens?: number;
};
type ModelCatalogRefreshConfig = {
  /** Fetch model catalog updates from the hosted OpenClaw catalog. Default: true. */
  enabled?: boolean;
  /** Override the hosted catalog URL (HTTPS mirrors, or localhost HTTP for testing). */
  url?: string;
};
type ModelsConfig = {
  /** Merge provider config with bundled catalogs or replace bundled catalogs entirely. */
  mode?: "merge" | "replace";
  /** Configured provider catalog keyed by provider id. */
  providers?: Record<string, ModelProviderConfig>;
  /** Hosted model catalog refresh settings. */
  catalogRefresh?: ModelCatalogRefreshConfig;
};
//#endregion
export { ModelMediaInputConfig as a, ModelProviderDeclarationConfig as c, ConfiguredProviderRequest as d, AgentModelConfig as f, SandboxDockerSettings as g, AgentToolModelConfig as h, ModelDefinitionConfig as i, ModelsConfig as l, AgentSandboxConfig as m, ModelApi as n, ModelProviderAuthMode as o, AgentRuntimePolicyConfig as p, ModelCompatConfig as r, ModelProviderConfig as s, BedrockDiscoveryConfig as t, ConfiguredModelProviderRequest as u };