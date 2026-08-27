import { TSchema } from "typebox";
//#region src/config/types.secrets.d.ts
/** Supported secret reference backends in config. */
type SecretRefSource = "env" | "file" | "exec" | "store";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 * - store source: provider "default", id "OPENAI_API_KEY"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
type EnvSecretProviderConfig = {
  source: "env";
  /** Optional env var allowlist (exact names). */
  allowlist?: string[];
};
type FileSecretProviderMode = "singleValue" | "json";
type FileSecretProviderConfig = {
  source: "file";
  path: string;
  mode?: FileSecretProviderMode;
  timeoutMs?: number;
  maxBytes?: number;
};
type ManualExecSecretProviderConfig = {
  source: "exec";
  command: string;
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
  trustedDirs?: string[];
};
type PluginIntegrationSecretProviderConfig = {
  source: "exec";
  pluginIntegration: {
    pluginId: string;
    integrationId: string;
  };
};
type ExecSecretProviderConfig = ManualExecSecretProviderConfig | PluginIntegrationSecretProviderConfig;
type StoreSecretProviderConfig = {
  source: "store";
};
type SecretProviderConfig = EnvSecretProviderConfig | FileSecretProviderConfig | ExecSecretProviderConfig | StoreSecretProviderConfig;
type SecretsConfig = {
  egressProxy?: {
    enabled?: boolean;
    allowedHosts?: string[];
    bypassHosts?: string[];
  };
  providers?: Record<string, SecretProviderConfig>;
  defaults?: {
    env?: string;
    file?: string;
    exec?: string;
    store?: string;
  };
};
//#endregion
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
//#region packages/llm-core/src/utils/diagnostics.d.ts
interface DiagnosticErrorInfo {
  name?: string;
  message: string;
  stack?: string;
  code?: string | number;
}
interface AssistantMessageDiagnostic {
  type: string;
  timestamp: number;
  error?: DiagnosticErrorInfo;
  details?: Record<string, unknown>;
}
//#endregion
//#region packages/llm-core/src/types.d.ts
/** Provider API families with first-class request/stream adapters in OpenClaw. */
type KnownApi = "openai-completions" | "mistral-conversations" | "openai-responses" | "azure-openai-responses" | "openai-chatgpt-responses" | "anthropic-messages" | "bedrock-converse-stream" | "google-generative-ai" | "google-vertex";
/** Provider API id; custom providers can use ids outside the built-in set. */
type Api = KnownApi | (string & {});
/** Provider id used for routing, diagnostics, and config lookups. */
type Provider = string;
/** Normalized reasoning-effort levels shared across provider-specific knobs. */
type ThinkingLevel = "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
/** Model thinking setting including explicit disabled state. */
type ModelThinkingLevel = "off" | ThinkingLevel;
/** Provider-specific values for normalized thinking levels. */
type ThinkingLevelMap = Partial<Record<ModelThinkingLevel, string | null>>;
/** Token budgets for each thinking level (token-based providers only) */
interface ThinkingBudgets {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
  max?: number;
}
/** Prompt-cache retention preference shared by providers that expose cache controls. */
type CacheRetention = "none" | "short" | "long";
/** Streaming transport preference for providers that support multiple transports. */
type Transport = "sse" | "websocket" | "websocket-cached" | "auto";
/** Helper for hooks that may be synchronous or asynchronous. */
type MaybePromise<T> = T | Promise<T>;
/** Minimal HTTP response metadata surfaced through provider hooks. */
interface ProviderResponse {
  status: number;
  headers: Record<string, string>;
}
/** Request options shared by text streaming providers. */
interface StreamOptions {
  temperature?: number;
  maxTokens?: number;
  /**
   * Optional JSON Schema for the generated response. Providers that support
   * constrained decoding map it to their native request shape; others ignore it.
   */
  responseFormat?: Record<string, unknown>;
  /**
   * Stop sequences forwarded to providers that support them. Providers map this
   * to their native request field, such as OpenAI `stop` or Anthropic
   * `stop_sequences`.
   */
  stop?: string[];
  signal?: AbortSignal;
  apiKey?: string;
  /**
   * Preferred transport for providers that support multiple transports.
   * Providers that do not support this option ignore it.
   */
  transport?: Transport;
  /**
   * Prompt cache retention preference. Providers map this to their supported values.
   * Default: "short".
   */
  cacheRetention?: CacheRetention;
  /**
   * Optional session identifier for providers that support session-based caching.
   * Providers can use this to enable prompt caching, request routing, or other
   * session-aware features. Ignored by providers that don't support it.
   */
  sessionId?: string;
  /**
   * Opaque per-model-call identifier for provider transport correlation.
   * Providers that do not expose request correlation ignore it.
   */
  requestId?: string;
  /**
   * Optional provider prompt-cache affinity key, distinct from transcript/session identity.
   * Providers that do not support separate cache affinity ignore it.
   */
  promptCacheKey?: string;
  /**
   * Optional callback for inspecting or replacing provider payloads before sending.
   * Return undefined to keep the payload unchanged.
   */
  onPayload?: (payload: unknown, model: Model) => MaybePromise<unknown>;
  /**
   * Optional callback invoked after an HTTP response is received and before
   * its body stream is consumed.
   */
  onResponse?: (response: ProviderResponse, model: Model) => void | Promise<void>;
  /**
   * Optional custom HTTP headers to include in API requests.
   * Merged with provider defaults; can override default headers.
   * Not supported by all providers (e.g., AWS Bedrock uses SDK auth).
   */
  headers?: Record<string, string>;
  /**
   * HTTP request timeout in milliseconds for providers/SDKs that support it.
   * For example, OpenAI and Anthropic SDK clients default to 10 minutes.
   */
  timeoutMs?: number;
  /**
   * Maximum retry attempts for providers/SDKs that support client-side retries.
   * For example, OpenAI and Anthropic SDK clients default to 2.
   */
  maxRetries?: number;
  /**
   * Maximum delay in milliseconds to wait for a retry when the server requests a long wait.
   * If the server's requested delay exceeds this value, the request fails immediately
   * with an error containing the requested delay, allowing higher-level retry logic
   * to handle it with user visibility.
   * Default: 60000 (60 seconds). Set to 0 to disable the cap.
   */
  maxRetryDelayMs?: number;
  /**
   * Optional metadata to include in API requests.
   * Providers extract the fields they understand and ignore the rest.
   * For example, Anthropic uses `user_id` for abuse tracking and rate limiting.
   */
  metadata?: Record<string, unknown>;
}
/** Unified text options used by simple completion helpers. */
interface SimpleStreamOptions extends StreamOptions {
  reasoning?: ModelThinkingLevel;
  /** Custom token budgets for thinking levels (token-based providers only) */
  thinkingBudgets?: ThinkingBudgets;
}
/** Plain assistant/user text content block. */
interface TextContent {
  type: "text";
  text: string;
  textSignature?: string;
}
/** Provider reasoning/thinking content block, including opaque replay signatures. */
interface ThinkingContent {
  type: "thinking";
  thinking: string;
  thinkingSignature?: string;
  /** When true, the thinking content was redacted by safety filters. The opaque
   *  encrypted payload is stored in `thinkingSignature` so it can be passed back
   *  to the API for multi-turn continuity. */
  redacted?: boolean;
}
/** Opaque provider-owned state that must survive transcript replay without being rendered. */
interface ProviderReplayState {
  v: 1;
  type: string;
  id?: string;
  data: string;
  replayIndex?: number;
  provider: Provider;
  api: Api;
  model: string;
  baseUrlHash?: string;
  sessionHash?: string;
  authProfileHash?: string;
}
/** Base64 image content block with MIME type metadata. */
interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}
/** Normalized assistant tool call emitted by providers or repaired from text. */
interface ToolCall {
  type: "toolCall";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  thoughtSignature?: string;
  executionMode?: "sequential" | "parallel";
}
/** Normalized token and cost accounting for a provider response. */
interface Usage {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** Whether the provider reported a cache-read/write token split. */
  cacheTelemetry?: {
    state: "available" | "unavailable";
  };
  /** Subset of `cacheWrite` written with 1-hour retention when reported. */
  cacheWrite1h?: number;
  /** Exact context snapshot for the final provider iteration. */
  contextUsage?: {
    state: "available";
    promptTokens: number;
    totalTokens: number;
  } | {
    state: "unavailable";
  };
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
    /** Provenance for the recorded total cost; provider-billed totals are authoritative. */
    totalOrigin?: "provider-billed";
  };
}
/** Normalized assistant stop reasons across text providers. */
type StopReason = "stop" | "length" | "toolUse" | "error" | "aborted";
/** User turn in a text-model conversation. */
interface UserMessage {
  role: "user";
  content: string | (TextContent | ImageContent)[];
  timestamp: number;
  /**
   * Marks a user message that carries transient current-turn runtime context
   * (e.g. an OpenClaw runtime-context carrier appended after the active user
   * turn). Such messages are volatile — present only on the turn they belong to
   * and stripped on replay — so providers must NOT anchor a prompt-cache
   * breakpoint on them, or the breakpoint would land on bytes that change every
   * turn. Anchoring stays on the last stable (non-carrier) user message.
   */
  runtimeContextCarrier?: boolean;
}
/** Assistant turn, including provider identity and final stop state. */
type AssistantDeliveryTtsFacts = {
  tagged: true;
  text?: string;
  directives?: Array<{
    provider?: string;
    values: Record<string, string>;
  }>;
};
interface AssistantMessage {
  role: "assistant";
  content: (TextContent | ThinkingContent | ToolCall)[];
  openclawDelivery?: {
    audioAsVoice?: true;
    replyToCurrent?: true;
    replyToId?: string;
    /** Provider text phase is unresolved until the assistant turn reaches terminal state. */
    textPhaseRequiresTerminal?: true;
    /** Parsed once at the assistant write boundary; delivery resolves policy from these facts. */
    tts?: AssistantDeliveryTtsFacts;
  };
  api: Api;
  provider: Provider;
  model: string;
  responseModel?: string;
  responseId?: string;
  providerReplay?: ProviderReplayState;
  turnId?: string;
  diagnostics?: AssistantMessageDiagnostic[];
  usage: Usage;
  stopReason: StopReason;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
  timestamp: number;
}
/** Tool result turn that answers a prior assistant tool call. */
interface ToolResultMessage<TDetails = unknown> {
  role: "toolResult";
  toolCallId: string;
  toolName: string;
  content: (TextContent | ImageContent)[];
  details?: TDetails;
  isError: boolean;
  timestamp: number;
}
/** Any text-model conversation message supported by LLM core. */
type Message = UserMessage | AssistantMessage | ToolResultMessage;
/** Provider tool declaration with a TypeBox/JSON-schema parameter object. */
interface Tool<TParameters extends TSchema = TSchema> {
  name: string;
  description: string;
  parameters: TParameters;
}
/** Text-model request context shared by provider adapters. */
interface Context {
  systemPrompt?: string;
  messages: Message[];
  tools?: Tool[];
}
/**
 * Event protocol for AssistantMessageEventStream.
 *
 * Streams should emit `start` before partial updates, then terminate with either:
 * - `done` carrying the final successful AssistantMessage, or
 * - `error` carrying the final AssistantMessage with stopReason "error" or "aborted"
 *   and errorMessage.
 */
type AssistantMessageEvent = {
  type: "start";
  partial: AssistantMessage;
} | {
  type: "text_start";
  contentIndex: number;
  partial: AssistantMessage;
} |
/**
 * Plain text deltas may omit `partial` to avoid retaining one full assistant
 * snapshot per token. Consumers that need current text should replay `delta`
 * from the latest start/end partial checkpoint.
 */
{
  type: "text_delta";
  contentIndex: number;
  delta: string;
  partial?: AssistantMessage;
} | {
  type: "text_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "thinking_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "thinking_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "thinking_end";
  contentIndex: number;
  content: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_start";
  contentIndex: number;
  partial: AssistantMessage;
} | {
  type: "toolcall_delta";
  contentIndex: number;
  delta: string;
  partial: AssistantMessage;
} | {
  type: "toolcall_end";
  contentIndex: number;
  toolCall: ToolCall;
  partial: AssistantMessage;
} | {
  type: "done";
  reason: Extract<StopReason, "stop" | "length" | "toolUse">;
  message: AssistantMessage;
} | {
  type: "error";
  reason: Extract<StopReason, "aborted" | "error">;
  error: AssistantMessage;
};
interface AssistantMessageEventStreamContract extends AsyncIterable<AssistantMessageEvent> {
  /** Queue one stream event for consumers. */
  push(event: AssistantMessageEvent): void;
  /** Complete the stream and optionally resolve the final message. */
  end(result?: AssistantMessage): void;
  /** Final assistant message produced by the stream. */
  result(): Promise<AssistantMessage>;
}
/** Read-only stream contract accepted by consumers that do not need to push events. */
interface AssistantMessageEventStreamLike extends AsyncIterable<AssistantMessageEvent> {
  result(): Promise<AssistantMessage>;
}
/**
 * Compatibility settings for OpenAI-compatible completions APIs.
 * Use this to override URL-based auto-detection for custom providers.
 */
interface OpenAICompletionsCompat {
  /** Whether the provider supports the `store` field. Default: auto-detected from URL. */
  supportsStore?: boolean;
  /** Whether the provider supports the `developer` role (vs `system`). Default: auto-detected from URL. */
  supportsDeveloperRole?: boolean;
  /** Whether the provider supports `reasoning_effort`. Default: auto-detected from URL. */
  supportsReasoningEffort?: boolean;
  /** Whether the provider supports `stream_options: { include_usage: true }` for token usage in streaming responses. Default: true. */
  supportsUsageInStreaming?: boolean;
  /** Which field to use for max tokens. Default: auto-detected from URL. */
  maxTokensField?: "max_completion_tokens" | "max_tokens";
  /** Whether tool results require the `name` field. Default: auto-detected from URL. */
  requiresToolResultName?: boolean;
  /** Whether a user message after tool results requires an assistant message in between. Default: auto-detected from URL. */
  requiresAssistantAfterToolResult?: boolean;
  /** Whether thinking blocks must be converted to text blocks with <thinking> delimiters. Default: auto-detected from URL. */
  requiresThinkingAsText?: boolean;
  /** Whether all replayed assistant messages must include an empty reasoning_content field when reasoning is enabled. Default: auto-detected from URL. */
  requiresReasoningContentOnAssistantMessages?: boolean;
  /** Format for reasoning/thinking parameter. "openai" uses reasoning_effort, "openrouter" uses reasoning: { effort }, "deepseek" uses thinking: { type } plus reasoning_effort, "together" uses reasoning: { enabled } plus reasoning_effort when supported, "zai" uses top-level enable_thinking: boolean, "qwen" uses top-level enable_thinking: boolean, and "qwen-chat-template" uses chat_template_kwargs.enable_thinking. Default: "openai". */
  thinkingFormat?: "openai" | "openrouter" | "deepseek" | "together" | "zai" | "qwen" | "qwen-chat-template";
  /** OpenRouter-specific routing preferences. Only used when baseUrl points to OpenRouter. */
  openRouterRouting?: OpenRouterRouting;
  /** Vercel AI Gateway routing preferences. Only used when baseUrl points to Vercel AI Gateway. */
  vercelGatewayRouting?: VercelGatewayRouting;
  /** Whether z.ai supports top-level `tool_stream: true` for streaming tool call deltas. Default: false. */
  zaiToolStream?: boolean;
  /** Whether the provider supports the `strict` field in tool definitions. Default: true. */
  supportsStrictMode?: boolean;
  /** Whether the provider supports JSON Schema through `response_format`. Default: false for unknown compatible endpoints. */
  supportsJsonSchemaResponseFormat?: boolean;
  /** Cache control convention for prompt caching. "anthropic" applies Anthropic-style `cache_control` markers to the system prompt, last tool definition, and last user/assistant text content. */
  cacheControlFormat?: "anthropic";
  /** Whether to send known session-affinity headers (`session_id`, `x-client-request-id`, `x-session-affinity`) from `options.sessionId` when caching is enabled. Default: false. */
  sendSessionAffinityHeaders?: boolean;
  /** Whether the provider supports OpenAI-style `prompt_cache_key`. Default: false for third-party completions providers. */
  supportsPromptCacheKey?: boolean;
  /** Whether the provider supports long prompt cache retention (`prompt_cache_retention: "24h"` or Anthropic-style `cache_control.ttl: "1h"`, depending on format). Default: true. */
  supportsLongCacheRetention?: boolean;
}
/** Compatibility settings for OpenAI Responses APIs. */
interface OpenAIResponsesCompat {
  /** Whether the provider supports the `developer` role (vs `system`). Default: true. */
  supportsDeveloperRole?: boolean;
  /** Whether the model accepts the `temperature` parameter. Default: true. */
  supportsTemperature?: boolean;
  /** Whether to send the OpenAI `session_id` cache-affinity header from `options.sessionId` when caching is enabled. Default: true. */
  sendSessionIdHeader?: boolean;
  /** Whether the provider supports `prompt_cache_retention: "24h"`. Default: true. */
  supportsLongCacheRetention?: boolean;
}
/** Compatibility settings for Anthropic Messages-compatible APIs. */
interface AnthropicMessagesCompat {
  /**
   * Whether the provider accepts per-tool `eager_input_streaming`.
   * When false, the Anthropic provider omits `tools[].eager_input_streaming`
   * and sends the legacy `fine-grained-tool-streaming-2025-05-14` beta header
   * for tool-enabled requests.
   * Default: true.
   */
  supportsEagerToolInputStreaming?: boolean;
  /** Whether the provider supports Anthropic long cache retention (`cache_control.ttl: "1h"`). Default: true. */
  supportsLongCacheRetention?: boolean;
  /**
   * Whether to send the `x-session-affinity` header from `options.sessionId`
   * when caching is enabled. Required for providers like Fireworks that use
   * session affinity for prompt cache routing (requests to the same replica
   * maximize cache hits).
   * Default: false.
   */
  sendSessionAffinityHeaders?: boolean;
  /**
   * Whether the provider supports Anthropic-style `cache_control` markers on
   * tool definitions. When false, `cache_control` is omitted from tool params.
   * Some Anthropic-compatible providers (e.g., Fireworks) do not support this
   * field on tools and may reject or ignore it.
   * Default: true.
   */
  supportsCacheControlOnTools?: boolean;
  /** Whether empty thinking signatures can be replayed as native thinking blocks. Default: false. */
  allowEmptySignature?: boolean;
}
/**
 * OpenRouter provider routing preferences.
 * Controls which upstream providers OpenRouter routes requests to.
 * Sent as the `provider` field in the OpenRouter API request body.
 * @see https://openrouter.ai/docs/guides/routing/provider-selection
 */
interface OpenRouterRouting {
  /** Whether to allow backup providers to serve requests. Default: true. */
  allow_fallbacks?: boolean;
  /** Whether to filter providers to only those that support all parameters in the request. Default: false. */
  require_parameters?: boolean;
  /** Data collection setting. "allow" (default): allow providers that may store/train on data. "deny": only use providers that don't collect user data. */
  data_collection?: "deny" | "allow";
  /** Whether to restrict routing to only ZDR (Zero Data Retention) endpoints. */
  zdr?: boolean;
  /** Whether to restrict routing to only models that allow text distillation. */
  enforce_distillable_text?: boolean;
  /** An ordered list of provider names/slugs to try in sequence, falling back to the next if unavailable. */
  order?: string[];
  /** List of provider names/slugs to exclusively allow for this request. */
  only?: string[];
  /** List of provider names/slugs to skip for this request. */
  ignore?: string[];
  /** A list of quantization levels to filter providers by (e.g., ["fp16", "bf16", "fp8", "fp6", "int8", "int4", "fp4", "fp32"]). */
  quantizations?: string[];
  /** Sorting strategy. Can be a string (e.g., "price", "throughput", "latency") or an object with `by` and `partition`. */
  sort?: string | {
    /** The sorting metric: "price", "throughput", "latency". */
    by?: string;
    /** Partitioning strategy: "model" (default) or "none". */
    partition?: string | null;
  };
  /** Maximum price per million tokens (USD). */
  max_price?: {
    /** Price per million prompt tokens. */
    prompt?: number | string;
    /** Price per million completion tokens. */
    completion?: number | string;
    /** Price per image. */
    image?: number | string;
    /** Price per audio unit. */
    audio?: number | string;
    /** Price per request. */
    request?: number | string;
  };
  /** Preferred minimum throughput (tokens/second). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_min_throughput?: number | {
    /** Minimum tokens/second at the 50th percentile. */
    p50?: number;
    /** Minimum tokens/second at the 75th percentile. */
    p75?: number;
    /** Minimum tokens/second at the 90th percentile. */
    p90?: number;
    /** Minimum tokens/second at the 99th percentile. */
    p99?: number;
  };
  /** Preferred maximum latency (seconds). Can be a number (applies to p50) or an object with percentile-specific cutoffs. */
  preferred_max_latency?: number | {
    /** Maximum latency in seconds at the 50th percentile. */
    p50?: number;
    /** Maximum latency in seconds at the 75th percentile. */
    p75?: number;
    /** Maximum latency in seconds at the 90th percentile. */
    p90?: number;
    /** Maximum latency in seconds at the 99th percentile. */
    p99?: number;
  };
}
/**
 * Vercel AI Gateway routing preferences.
 * Controls which upstream providers the gateway routes requests to.
 * @see https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
 */
interface VercelGatewayRouting {
  /** List of provider slugs to exclusively use for this request (e.g., ["bedrock", "anthropic"]). */
  only?: string[];
  /** List of provider slugs to try in order (e.g., ["anthropic", "openai"]). */
  order?: string[];
}
interface Model<TApi extends Api = Api> {
  id: string;
  name: string;
  api: TApi;
  provider: Provider;
  baseUrl: string;
  reasoning: boolean;
  /**
   * Maps OpenClaw thinking levels to provider/model-specific values.
   * Missing keys use provider defaults. null marks a level as unsupported.
   */
  thinkingLevelMap?: ThinkingLevelMap;
  input: ("text" | "image")[];
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
  contextWindow?: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while allowing a
   * smaller practical window.
   */
  contextTokens?: number;
  maxTokens: number;
  /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Sends runtime credentials as Authorization: Bearer instead of provider-specific key headers. */
  authHeader?: boolean;
  /** Compatibility overrides for OpenAI-compatible APIs. If not set, auto-detected from baseUrl. */
  compat?: TApi extends "openai-completions" ? OpenAICompletionsCompat : TApi extends "openai-responses" ? OpenAIResponsesCompat : TApi extends "anthropic-messages" ? AnthropicMessagesCompat : never;
  /** Provider-documented media input limits used by attachment preprocessing. */
  mediaInput?: {
    image?: {
      maxBytes?: number;
      maxPixels?: number;
      maxSidePx?: number;
      preferredSidePx?: number;
      tokenMode?: "tile" | "detail" | "provider";
    };
  };
}
type StreamFn = (model: Model, context: Context, options?: SimpleStreamOptions) => AssistantMessageEventStreamLike | Promise<AssistantMessageEventStreamLike>;
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
export { SecretRef as A, ConfiguredProviderRequest as C, AgentToolModelConfig as D, AgentSandboxConfig as E, SandboxDockerSettings as O, Usage as S, AgentRuntimePolicyConfig as T, StreamFn as _, ModelProviderAuthMode as a, ThinkingLevelMap as b, ModelsConfig as c, AssistantMessageEventStreamContract as d, Context as f, SimpleStreamOptions as g, Model as h, ModelMediaInputConfig as i, SecretsConfig as j, SecretInput as k, Api as l, Message as m, ModelCompatConfig as n, ModelProviderConfig as o, ImageContent as p, ModelDefinitionConfig as r, ModelProviderDeclarationConfig as s, ModelApi as t, AssistantMessage as u, TextContent as v, AgentModelConfig as w, Tool as x, ThinkingLevel as y };