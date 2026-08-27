import { D as SessionSendPolicyAction, M as ChatType, O as SessionThreadBindingsConfig, S as ReplyToMode, a as ChannelDeliveryStreamingConfig, b as MarkdownConfig, d as ChannelStreamingProgressConfig, f as ContextVisibilityMode, g as GroupPolicy, l as ChannelStreamingConfig, m as DmPolicy, o as ChannelPreviewStreamingConfig, t as AgentElevatedAllowFromConfig, u as ChannelStreamingPreviewConfig } from "./types.base-DUfwpzwr.js";
import { n as SecretInput, o as SecretRef } from "./types.secrets-BBdlv1za.js";
import { Static, Type } from "typebox";

//#region src/config/types.sandbox.d.ts
type SandboxDockerSettings = {
  /** Docker image to use for sandbox containers. */image?: string; /** Prefix for sandbox container names. */
  containerPrefix?: string; /** Container workdir mount path (default: /workspace). */
  workdir?: string; /** Run container rootfs read-only. */
  readOnlyRoot?: boolean; /** Extra tmpfs mounts for read-only containers. */
  tmpfs?: string[]; /** Container network mode (bridge|none|custom). */
  network?: string; /** Container user (uid:gid). */
  user?: string; /** Drop Linux capabilities. */
  capDrop?: string[]; /** Explicit environment variables for sandbox container creation and exec. */
  env?: Record<string, string>; /** Optional setup command run once after container creation (array entries are joined by newline). */
  setupCommand?: string; /** Limit container PIDs (0 = Docker default). */
  pidsLimit?: number; /** Limit container memory (e.g. 512m, 2g, or bytes as number). */
  memory?: string | number; /** Limit container memory swap (same format as memory). */
  memorySwap?: string | number; /** Limit container CPU shares (e.g. 0.5, 1, 2). */
  cpus?: number; /** GPU devices to expose via Docker --gpus (e.g. "all", "device=GPU-uuid"). */
  gpus?: string;
  /**
   * Set ulimit values by name (e.g. nofile, nproc).
   * Use "soft:hard" string, a number, or { soft, hard }.
   */
  ulimits?: Record<string, string | number | {
    soft?: number;
    hard?: number;
  }>; /** Seccomp profile (path or profile name). */
  seccompProfile?: string; /** AppArmor profile name. */
  apparmorProfile?: string; /** DNS servers (e.g. ["1.1.1.1", "8.8.8.8"]). */
  dns?: string[]; /** Extra host mappings (e.g. ["api.local:10.0.0.2"]). */
  extraHosts?: string[]; /** Additional bind mounts (host:container:mode format, e.g. ["/host/path:/container/path:rw"]). */
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
  containerPrefix?: string; /** Docker network for sandbox browser containers (default: openclaw-sandbox-browser). */
  network?: string;
  cdpPort?: number; /** Optional CIDR allowlist for CDP ingress at the container edge (for example: 172.21.0.1/32). */
  cdpSourceRange?: string;
  vncPort?: number;
  noVncPort?: number;
  headless?: boolean;
  noVncEnabled?: boolean; /** @deprecated Doctor-only legacy input. */
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
  autoStart?: boolean; /** Max time to wait for CDP to become reachable after auto-start (ms). */
  autoStartTimeoutMs?: number; /** Additional bind mounts for the browser container only. When set, replaces docker.binds for the browser container. */
  binds?: string[];
};
type SandboxPruneSettings = {
  /** Prune if idle for more than N hours (0 disables). */idleHours?: number; /** Prune if older than N days (0 disables). */
  maxAgeDays?: number;
};
type SandboxSshSettings = {
  /** SSH target in user@host[:port] form. */target?: string; /** SSH client command. Default: "ssh". */
  command?: string; /** Absolute remote root used for per-scope workspaces. */
  workspaceRoot?: string; /** Enforce host-key verification. Default: true. */
  strictHostKeyChecking?: boolean; /** Allow OpenSSH host-key updates. Default: true. */
  updateHostKeys?: boolean; /** Existing private key path on the host. */
  identityFile?: string; /** Existing SSH certificate path on the host. */
  certificateFile?: string; /** Existing known_hosts file path on the host. */
  knownHostsFile?: string; /** Inline or SecretRef-backed private key contents. */
  identityData?: SecretInput; /** Inline or SecretRef-backed SSH certificate contents. */
  certificateData?: SecretInput; /** Inline or SecretRef-backed known_hosts contents. */
  knownHostsData?: SecretInput;
};
//#endregion
//#region src/config/types.agents-shared.d.ts
/** Agent model selector: a single provider/model ref or primary+fallback chain. */
type AgentModelConfig = string | {
  /** Primary model (provider/model). */primary?: string; /** Per-agent model fallbacks (provider/model). */
  fallbacks?: string[];
};
/** Tool-specific model selector with an optional capability timeout override. */
type AgentToolModelConfig = string | {
  /** Primary model (provider/model). */primary?: string; /** Per-tool model fallbacks (provider/model). */
  fallbacks?: string[]; /** Optional provider request timeout in milliseconds for capabilities that support it. */
  timeoutMs?: number;
};
/** Runtime selection policy attached to providers, models, and agent defaults. */
type AgentRuntimePolicyConfig = {
  /** Agent runtime id. Omitted uses "openclaw"; "auto" opts into plugin harness auto-selection. */id?: string;
};
/** Per-agent sandbox policy shared by embedded agents and sandbox backends. */
type AgentSandboxConfig = {
  /** Sandbox activation mode for this agent. */mode?: "off" | "non-main" | "all"; /** Sandbox runtime backend id. Default: "docker". */
  backend?: string; /** Agent workspace access inside the sandbox. */
  workspaceAccess?: "none" | "ro" | "rw";
  /**
   * Session tools visibility for sandboxed sessions.
   * - "spawned": only allow session tools to target sessions spawned from this session (default)
   * - "all": allow session tools to target any session
   */
  sessionToolsVisibility?: "spawned" | "all"; /** Container/workspace scope for sandbox isolation. */
  scope?: "session" | "agent" | "shared"; /** Host workspace root mounted or copied into the sandbox. */
  workspaceRoot?: string; /** Docker-specific sandbox settings. */
  docker?: SandboxDockerSettings; /** SSH-specific sandbox settings. */
  ssh?: SandboxSshSettings; /** Optional sandboxed browser settings. */
  browser?: SandboxBrowserSettings; /** Auto-prune sandbox settings. */
  prune?: SandboxPruneSettings;
};
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
declare const QUEUE_MODES: readonly ["steer", "followup", "collect", "interrupt"];
type QueueMode = (typeof QUEUE_MODES)[number];
//#endregion
//#region src/config/types.queue.d.ts
/** Queue overflow policy for inbound channel messages. */
type QueueDropPolicy = "old" | "new" | "summarize";
type QueueModeByProvider = {
  whatsapp?: QueueMode;
  telegram?: QueueMode;
  discord?: QueueMode;
  irc?: QueueMode;
  googlechat?: QueueMode;
  slack?: QueueMode;
  mattermost?: QueueMode;
  signal?: QueueMode;
  imessage?: QueueMode;
  msteams?: QueueMode;
  webchat?: QueueMode;
  matrix?: QueueMode;
};
//#endregion
//#region src/config/types.messages.d.ts
type MentionPatternsMode = "allow" | "deny";
type MentionPatternsPolicyConfig = {
  mode?: MentionPatternsMode;
  allowIn?: string[];
  denyIn?: string[];
};
type GroupChatConfig = {
  mentionPatterns?: string[];
  historyLimit?: number;
  /**
   * Controls how unmentioned always-on group chatter is submitted.
   * Default: "user_request".
   */
  unmentionedInbound?: "user_request" | "room_event";
  /**
   * Controls how group/channel inbound events produce model-authored room replies.
   * The message-tool mode requires explicit message sends for normal assistant
   * output; explicitly host-owned runtime output remains deliverable except for
   * ambient room events.
   * Default: "automatic".
   */
  visibleReplies?: "automatic" | "message_tool";
};
type DmConfig = {
  historyLimit?: number;
};
type QueueConfig = {
  mode?: QueueMode;
  byChannel?: QueueModeByProvider; /** Per-channel debounce overrides (ms). */
  debounceMsByChannel?: InboundDebounceByProvider;
  cap?: number;
  drop?: QueueDropPolicy;
};
type InboundDebounceByProvider = Record<string, number>;
type InboundDebounceConfig = {
  debounceMs?: number;
  byChannel?: InboundDebounceByProvider;
};
type BroadcastStrategy = "parallel" | "sequential";
type BroadcastConfig = {
  /** Default processing strategy for broadcast peers. */strategy?: BroadcastStrategy;
  /**
   * Map peer IDs to arrays of agent IDs that should ALL process messages.
   *
   * Note: the index signature includes `undefined` so `strategy?: ...` remains type-safe.
   */
  [peerId: string]: string[] | BroadcastStrategy | undefined;
};
type StatusReactionsConfig = {
  /** Enable lifecycle status reactions (default: false). */enabled?: boolean;
};
type MessagesConfig = {
  /** @deprecated Doctor-only legacy input. */removeAckAfterReply?: boolean;
  /**
   * Controls how source inbound events produce visible replies across direct,
   * group, and channel conversations. Group/channel events still default to
   * `groupChat.visibleReplies` when it is set.
   *
   * Default: "automatic". In group/channel rooms, "message_tool" keeps normal
   * assistant output private unless the model sends visibly through the message
   * tool; explicitly host-owned runtime output remains deliverable.
   */
  visibleReplies?: "automatic" | "message_tool";
  /**
   * Prefix auto-added to all outbound replies.
   *
   * - string: explicit prefix (may include template variables)
   * - special value: `"auto"` derives `[{agents.entries.*.identity.name}]` for the routed agent (when set)
   *
   * Supported template variables (case-insensitive):
   * - `{model}` - short model name (e.g., `claude-opus-4-6`, `gpt-4o`)
   * - `{modelFull}` - full model identifier (e.g., `anthropic/claude-opus-4-6`)
   * - `{provider}` - provider name (e.g., `anthropic`, `openai`)
   * - `{thinkingLevel}` or `{think}` - current thinking level (`high`, `low`, `off`)
   * - `{identity.name}` or `{identityName}` - agent identity name
   *
   * Example: `"[{model} | think:{thinkingLevel}]"` → `"[claude-opus-4-6 | think:high]"`
   *
   * Unresolved variables remain as literal text (e.g., `{model}` if context unavailable).
   *
   * Default: none
   */
  responsePrefix?: string; /** Custom `/usage full` footer template, inline or JSON file path. */
  usageTemplate?: string | Record<string, unknown>;
  /**
   * Default per-reply usage footer mode (`responseUsage`) seeded into any session
   * that has not set its own via `/usage`. Precedence: session value → channel entry
   * → `default` → `off`. Absent ⇒ `off` (unchanged behavior).
   *
   * - string: one default for every channel, e.g. `"full"`.
   * - object: per-channel with a fallback, e.g. `{ "default": "off", "discord": "full" }`.
   */
  responseUsage?: "on" | "off" | "tokens" | "full" | {
    default?: "on" | "off" | "tokens" | "full";
    [channel: string]: "on" | "off" | "tokens" | "full" | undefined;
  };
  groupChat?: GroupChatConfig;
  queue?: QueueConfig; /** Debounce rapid inbound messages per sender (global + per-channel overrides). */
  inbound?: InboundDebounceConfig; /** Emoji reaction used to acknowledge inbound messages (empty disables). */
  ackReaction?: string; /** When to send ack reactions. Default: "group-mentions". */
  ackReactionScope?: "group-mentions" | "group-all" | "direct" | "all" | "off" | "none"; /** Lifecycle status reactions configuration. */
  statusReactions?: StatusReactionsConfig; /** When true, suppress ⚠️ tool-error warnings from being shown to the user. Default: false. */
  suppressToolErrors?: boolean;
};
type NativeCommandsSetting = boolean | "auto";
/**
 * Per-provider allowlist for command authorization.
 * Keys are channel IDs (e.g., "discord", "whatsapp") or "*" for global default.
 * Values are arrays of sender IDs allowed to use commands on that channel.
 */
type CommandAllowFrom = Record<string, Array<string | number>>;
type CommandsConfig = {
  /** @deprecated Doctor-only legacy input. */ownerDisplay?: "raw" | "hash"; /** @deprecated Doctor-only legacy input. */
  ownerDisplaySecret?: string; /** Enable native command registration when supported (default: "auto"). */
  native?: NativeCommandsSetting; /** Enable native skill command registration when supported (default: "auto"). */
  nativeSkills?: NativeCommandsSetting; /** Enable text command parsing (default: true). */
  text?: boolean; /** Allow bash chat command (`!`; `/bash` alias) (default: false). */
  bash?: boolean; /** How long bash waits before backgrounding (default: 2000; 0 backgrounds immediately). */
  bashForegroundMs?: number; /** Allow /config command (default: false). */
  config?: boolean; /** Allow /mcp command for OpenClaw-managed MCP settings (default: false). */
  mcp?: boolean; /** Allow /plugins command for plugin listing and enablement toggles (default: false). */
  plugins?: boolean; /** Allow /debug command (default: false). */
  debug?: boolean; /** Allow restart commands/tools (default: true). */
  restart?: boolean; /** Explicit owner allowlist for owner-scoped commands (channel-native IDs). */
  ownerAllowFrom?: Array<string | number>;
  /** How owner IDs are rendered in system prompts. */
  /**
   * Per-provider allowlist restricting who can use slash commands.
   * If set, overrides the channel's allowFrom for command authorization.
   * Use "*" key for global default, provider-specific keys override the global.
   * Example: { "*": ["user1"], discord: ["user:123"] }
   */
  allowFrom?: CommandAllowFrom;
};
type ProviderCommandsConfig = {
  /** Override native command registration for this provider (bool or "auto"). */native?: NativeCommandsSetting; /** Override native skill command registration for this provider (bool or "auto"). */
  nativeSkills?: NativeCommandsSetting;
};
//#endregion
//#region src/infra/exec-safe-bin-policy-profiles.d.ts
type SafeBinProfile = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: ReadonlySet<string>;
  allowedBooleanFlags?: ReadonlySet<string>;
  deniedFlags?: ReadonlySet<string>;
  knownLongFlags?: readonly string[];
  knownLongFlagsSet?: ReadonlySet<string>;
  longFlagPrefixMap?: ReadonlyMap<string, string | null>;
};
type SafeBinProfileFixture = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: readonly string[];
  deniedFlags?: readonly string[];
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
//#region src/config/types.ssrf.d.ts
type SsrFPolicyConfig = {
  /** Permit private/internal network targets. Default: false. */dangerouslyAllowPrivateNetwork?: boolean; /** Allow RFC 2544 benchmark-range IPs (198.18.0.0/15). */
  allowRfc2544BenchmarkRange?: boolean; /** Allow IPv6 Unique Local Addresses (fc00::/7). */
  allowIpv6UniqueLocalRange?: boolean; /** Explicitly allowed exact hostnames or IP literals. */
  allowedHostnames?: string[];
};
//#endregion
//#region src/config/types.tools.d.ts
type MediaUnderstandingScopeMatch = {
  /** Channel/provider id to match before running media or link understanding. */channel?: string; /** Direct/group classification from the channel runtime, when available. */
  chatType?: ChatType; /** Attachment or link key prefix used for narrow per-source routing. */
  keyPrefix?: string;
};
type MediaUnderstandingScopeRule = {
  /** Policy applied when match criteria select this scope rule. */action: SessionSendPolicyAction; /** Optional match filter; omitted match behaves as a catch-all rule. */
  match?: MediaUnderstandingScopeMatch;
};
type MediaUnderstandingScopeConfig = {
  /** Fallback action when no scope rule matches. */default?: SessionSendPolicyAction; /** Ordered allow/block rules; first matching rule wins. */
  rules?: MediaUnderstandingScopeRule[];
};
type MediaUnderstandingCapability = "image" | "audio" | "video";
type MediaUnderstandingAttachmentsConfig = {
  /** Select the first matching attachment or process multiple. */mode?: "first" | "all"; /** Max number of attachments to process (default: 1). */
  maxAttachments?: number; /** Attachment ordering preference. */
  prefer?: "first" | "last" | "path" | "url";
};
type MediaProviderRequestConfig = {
  /** Optional provider-specific query params (merged into requests). */providerOptions?: Record<string, Record<string, string | number | boolean>>; /** Optional base URL override for provider requests. */
  baseUrl?: string; /** Optional headers merged into provider requests. */
  headers?: Record<string, string>; /** Optional request transport overrides for provider HTTP calls. */
  request?: ConfiguredProviderRequest;
};
type MediaUnderstandingModelConfig = MediaProviderRequestConfig & {
  /** provider API id (e.g. openai, google). */provider?: string; /** Model id for provider-based understanding. */
  model?: string; /** Optional capability tags for shared model lists. */
  capabilities?: MediaUnderstandingCapability[]; /** Use a CLI command instead of provider API. */
  type?: "provider" | "cli"; /** CLI binary (required when type=cli). */
  command?: string; /** CLI args (template-enabled). */
  args?: string[]; /** Optional prompt override for this model entry. */
  prompt?: string; /** Optional max output characters for this model entry. */
  maxChars?: number; /** Optional max bytes for this model entry. */
  maxBytes?: number; /** Optional timeout override (seconds) for this model entry. */
  timeoutSeconds?: number; /** Optional language hint for audio transcription. */
  language?: string; /** Auth profile id to use for this provider. */
  profile?: string; /** Preferred profile id if multiple are available. */
  preferredProfile?: string;
};
type MediaUnderstandingConfig = MediaProviderRequestConfig & {
  /** Enable media understanding when models are configured. */enabled?: boolean; /** Prefer a matching shared model entry. */
  preferredModel?: string; /** Optional scope gating for understanding. */
  scope?: MediaUnderstandingScopeConfig; /** Default max bytes to send. */
  maxBytes?: number; /** Default max output characters. */
  maxChars?: number; /** Default prompt. */
  prompt?: string; /** Internal request-scoped prompt override injected by CLI/runtime wrappers. */
  _requestPromptOverride?: string; /** Default timeout (seconds). */
  timeoutSeconds?: number; /** Default language hint (audio). */
  language?: string; /** Internal request-scoped language override injected by CLI/runtime wrappers. */
  _requestLanguageOverride?: string; /** Attachment selection policy. */
  attachments?: MediaUnderstandingAttachmentsConfig; /** Ordered model list (fallbacks in order). */
  models?: MediaUnderstandingModelConfig[];
  /**
   * Echo the audio transcript back to the originating chat before agent processing.
   * Lets users verify what was heard. Default: false.
   */
  echoTranscript?: boolean;
  /**
   * Format string for the echoed transcript. Use `{transcript}` as placeholder.
   * Default: '📝 "{transcript}"'
   */
  echoFormat?: string;
};
/** Per-capability defaults and policy. Models live only in tools.media.models. */
type MediaUnderstandingCapabilityConfig = Omit<MediaUnderstandingConfig, "models">;
type LinkModelConfig = {
  /** Use a CLI command for link processing. */type?: "cli"; /** CLI binary (required when type=cli). */
  command: string; /** CLI args (template-enabled). */
  args?: string[]; /** Optional timeout override (seconds) for this model entry. */
  timeoutSeconds?: number;
};
type LinkToolsConfig = {
  /** Enable link understanding when models are configured. */enabled?: boolean; /** Optional scope gating for understanding. */
  scope?: MediaUnderstandingScopeConfig; /** Max number of links to process per message. */
  maxLinks?: number; /** Default timeout (seconds). */
  timeoutSeconds?: number; /** Ordered model list (fallbacks in order). */
  models?: LinkModelConfig[];
};
type MediaToolsConfig = {
  /** Canonical model list for image/audio/video, selected by capability tags. */models?: MediaUnderstandingModelConfig[]; /** Max concurrent media understanding runs. */
  concurrency?: number;
  image?: MediaUnderstandingCapabilityConfig;
  audio?: MediaUnderstandingCapabilityConfig;
  video?: MediaUnderstandingCapabilityConfig;
};
type ToolProfileId = "minimal" | "coding" | "messaging" | "full";
type ToolLoopDetectionConfig = {
  /** Enable tool-loop protection (default: false). */enabled?: boolean;
};
type ToolSearchConfig = boolean | {
  /** Enable compact search/call cataloging for large tool sets. */enabled?: boolean; /** Exposed model surface. "code" exposes tool_search_code; "tools" exposes structured fallback tools; "directory" keeps a bounded directory plus selected schemas visible while deferring the rest behind search/describe/call. */
  mode?: "code" | "tools" | "directory"; /** Timeout in milliseconds for one tool_search_code execution. Runtime clamps to 1s..60s. */
  codeTimeoutMs?: number; /** Default search result count when the model omits a limit. Runtime clamps to maxSearchLimit. */
  searchDefaultLimit?: number; /** Maximum search result count. Runtime clamps to 1..50. */
  maxSearchLimit?: number;
};
type CodeModeConfig = boolean | "auto" | {
  /** Enable generic OpenClaw code mode. Default: "auto", which engages it only for models whose catalog compat flags `codeMode: "preferred"`. */enabled?: boolean | "auto"; /** Guest runtime. Only quickjs-wasi is supported. */
  runtime?: "quickjs-wasi"; /** Model-facing mode. Only "only" is supported: expose exec/wait and hide normal tools. */
  mode?: "only"; /** Accepted source languages. */
  languages?: Array<"javascript" | "typescript">; /** Wall-clock limit in milliseconds for one exec or wait call. */
  timeoutMs?: number; /** QuickJS heap limit in bytes. */
  memoryLimitBytes?: number; /** Maximum serialized output bytes. */
  maxOutputBytes?: number; /** Maximum serialized snapshot bytes. */
  maxSnapshotBytes?: number; /** Maximum concurrent nested tool calls. */
  maxPendingToolCalls?: number; /** Retention for suspended snapshots. */
  snapshotTtlSeconds?: number; /** Default search result count for tools.search. */
  searchDefaultLimit?: number; /** Maximum search result count for tools.search. */
  maxSearchLimit?: number;
};
type SwarmConfig = boolean | {
  /** Enable collector-mode subagents and agents_wait. Default: false. */enabled?: boolean; /** Maximum concurrently running collector children per swarm group. */
  maxConcurrent?: number; /** Maximum live collector children per swarm group. */
  maxChildrenPerGroup?: number; /** Maximum lifetime collector spawns per swarm group. */
  maxTotalPerGroup?: number; /** Maximum agents_wait timeout in seconds. */
  waitTimeoutSecondsMax?: number; /** Default child agent id when sessions_spawn omits agentId. */
  defaultAgentId?: string;
};
type SessionsToolsVisibility = "self" | "tree" | "agent" | "all";
type ToolAllowDenyPolicyConfig = {
  /** Exact tool names allowed in this policy scope. */allow?: string[]; /** Additional allowlist entries merged into the inherited policy. */
  alsoAllow?: string[]; /** Exact tool names denied after allow expansion; deny wins. */
  deny?: string[];
};
type ToolPolicyConfig = ToolAllowDenyPolicyConfig & {
  /** Built-in profile used as the base policy before allow/deny merges. */profile?: ToolProfileId;
};
type GroupToolPolicyConfig = ToolAllowDenyPolicyConfig;
/**
 * Per-sender overrides.
 *
 * Prefer explicit key prefixes:
 * - channel:<channelId>:<senderId>
 * - id:<senderId>
 * - e164:<phone>
 * - username:<handle>
 * - name:<display-name>
 * - * (wildcard)
 *
 * Legacy unprefixed keys are supported for backward compatibility and are matched as senderId only.
 */
type GroupToolPolicyBySenderConfig = Record<string, GroupToolPolicyConfig>;
type ExecToolConfig = {
  /** Exec host routing (default: auto). */host?: "auto" | "sandbox" | "gateway" | "node"; /** Normalized exec policy mode. Prefer this over raw security/ask knobs. */
  mode?: "deny" | "allowlist" | "ask" | "auto" | "full"; /** Legacy exec security mode retained when no canonical mode can preserve policy. */
  security?: "deny" | "allowlist" | "full"; /** Legacy exec ask mode retained when no canonical mode can preserve policy. */
  ask?: "off" | "on-miss" | "always"; /** Default node binding for exec.host=node (node id/name). */
  node?: string; /** Directories to prepend to PATH when running exec (gateway/sandbox). */
  pathPrepend?: string[]; /** Safe stdin-only binaries that can run without allowlist entries. */
  safeBins?: string[];
  /**
   * Require explicit approval for interpreter inline-eval forms (`python -c`, `node -e`, etc.).
   * Prevents silent allowlist reuse and allow-always persistence for those forms.
   */
  strictInlineEval?: boolean; /** Render parser-derived command highlights in exec approval prompts (default: false). */
  commandHighlighting?: boolean; /** Extra explicit directories trusted for safeBins path checks (never derived from PATH). */
  safeBinTrustedDirs?: string[]; /** Optional custom safe-bin profiles for entries in tools.exec.safeBins. */
  safeBinProfiles?: Record<string, SafeBinProfileFixture>; /** Model-backed reviewer used by tools.exec.mode=auto before falling back to human approval. */
  reviewer?: {
    /** Optional reviewer model override (provider/model or agent model config). */model?: AgentModelConfig; /** Reviewer timeout in milliseconds (default: 30000). */
    timeoutMs?: number;
  }; /** Default time (ms) before an exec command auto-backgrounds. */
  backgroundMs?: number; /** Default timeout (seconds) before auto-killing exec commands. */
  timeoutSeconds?: number; /** Emit a running notice (ms) when approval-backed exec runs long (default: 10000, 0 = off). */
  approvalRunningNoticeMs?: number; /** How long to keep finished sessions in memory (ms). */
  cleanupMs?: number; /** Emit a system event and heartbeat when a backgrounded exec exits. */
  notifyOnExit?: boolean;
  /**
   * Also emit success exit notifications when a backgrounded exec has no output.
   * Default false to reduce context noise.
   */
  notifyOnExitEmptySuccess?: boolean; /** apply_patch subtool configuration. */
  applyPatch?: {
    /** Enable apply_patch for OpenAI models (default: true; set false to disable). */enabled?: boolean;
    /**
     * Restrict apply_patch paths to the workspace directory.
     * Default: true (safer; does not affect read/write/edit).
     */
    workspaceOnly?: boolean;
    /**
     * Optional allowlist of model ids that can use apply_patch.
     * Accepts either raw ids (e.g. "gpt-5.4") or full ids (e.g. "openai/gpt-5.4").
     */
    allowModels?: string[];
  };
};
type FsToolsConfig = {
  /**
   * Restrict filesystem tools (read/write/edit/apply_patch) to the agent workspace directory.
   * Default: false (unrestricted, matches legacy behavior).
   */
  workspaceOnly?: boolean;
};
type SessionsSpawnToolsConfig = {
  attachments?: {
    /** Enable inline attachments for sessions_spawn. */enabled?: boolean;
    maxTotalBytes?: number;
    maxFiles?: number;
    maxFileBytes?: number;
    retainOnSessionKeep?: boolean;
  };
};
type AgentToolsConfig = {
  /** Base tool profile applied before allow/deny lists. */profile?: ToolProfileId;
  allow?: string[]; /** Additional allowlist entries merged into allow and/or profile allowlist. */
  alsoAllow?: string[];
  deny?: string[]; /** Optional tool policy overrides keyed by provider id or "provider/model". */
  byProvider?: Record<string, ToolPolicyConfig>; /** Per-sender tool policy overrides keyed by sender identity. */
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Per-agent code mode override; merges over the top-level tools.codeMode config. */
  codeMode?: CodeModeConfig; /** Per-agent swarm override; merges over the top-level tools.swarm config. */
  swarm?: SwarmConfig; /** Per-agent elevated exec gate (can only further restrict global tools.elevated). */
  elevated?: {
    /** Enable or disable elevated mode for this agent (default: true). */enabled?: boolean; /** Approved senders for /elevated (per-provider allowlists). */
    allowFrom?: AgentElevatedAllowFromConfig;
  }; /** Exec tool defaults for this agent. */
  exec?: ExecToolConfig; /** Filesystem tool path guards. */
  fs?: FsToolsConfig; /** Runtime loop detection for repetitive/ stuck tool-call patterns. */
  loopDetection?: ToolLoopDetectionConfig; /** Message tool configuration for this agent. */
  message?: MessageToolsConfig;
  sandbox?: {
    tools?: ToolAllowDenyPolicyConfig;
  };
};
type ToolsConfig = {
  /** Base tool profile applied before allow/deny lists. */profile?: ToolProfileId;
  allow?: string[]; /** Additional allowlist entries merged into allow and/or profile allowlist. */
  alsoAllow?: string[];
  deny?: string[]; /** Optional tool policy overrides keyed by provider id or "provider/model". */
  byProvider?: Record<string, ToolPolicyConfig>; /** Per-sender tool policy overrides keyed by sender identity. */
  toolsBySender?: GroupToolPolicyBySenderConfig;
  web?: {
    search?: {
      /** Enable managed web_search and optional Codex-native web search. */enabled?: boolean; /** Search provider id. */
      provider?: string; /** Default search results count (1-10). */
      maxResults?: number; /** Timeout in seconds for search requests. */
      timeoutSeconds?: number; /** Cache TTL in minutes for search results. */
      cacheTtlMinutes?: number; /** Optional native Codex web search for Codex-capable models. */
      openaiCodex?: {
        /** Enable native Codex web search for eligible models. */enabled?: boolean; /** Prefer cached or explicitly request live access. Unrestricted Codex turns resolve cached to live. */
        mode?: "cached" | "live"; /** Optional allowlist of domains passed to the native Codex tool. */
        allowedDomains?: string[]; /** Optional Codex native search context size hint. */
        contextSize?: "low" | "medium" | "high"; /** Optional approximate user location passed to the native Codex tool. */
        userLocation?: {
          country?: string;
          region?: string;
          city?: string;
          timezone?: string;
        };
      };
    };
    fetch?: {
      /** Enable web fetch tool (default: true). */enabled?: boolean; /** Web fetch fallback provider id. */
      provider?: string; /** Max characters to return from fetched content. */
      maxChars?: number; /** Hard cap for maxChars (tool or config), defaults to 50000. */
      maxCharsCap?: number; /** Max download size before truncation, defaults to 2000000. */
      maxResponseBytes?: number; /** Timeout in seconds for fetch requests. */
      timeoutSeconds?: number; /** Cache TTL in minutes for fetched content. */
      cacheTtlMinutes?: number; /** Maximum number of redirects to follow (default: 3). */
      maxRedirects?: number; /** Override User-Agent header for fetch requests. */
      userAgent?: string;
      /**
       * Extra request headers sent with direct web_fetch requests. Every value is
       * treated as sensitive in exposed config. Entries a request cannot carry are
       * dropped with a warning at request time.
       */
      headers?: Record<string, string>; /** Use Readability to extract main content (default: true). */
      readability?: boolean; /** Route web_fetch through a trusted HTTP(S) env proxy and let the proxy resolve DNS. Enable only when that proxy enforces outbound policy. */
      useTrustedEnvProxy?: boolean; /** SSRF policy configuration for web_fetch. */
      ssrfPolicy?: SsrFPolicyConfig;
    };
  };
  media?: MediaToolsConfig;
  links?: LinkToolsConfig; /** Message tool configuration. */
  message?: MessageToolsConfig;
  agentToAgent?: {
    /** Enable agent-to-agent messaging tools. Default: false. */enabled?: boolean; /** Allowlist of agent ids or patterns (implementation-defined). */
    allow?: string[];
  };
  /**
   * Session tool visibility controls which sessions can be targeted by session tools
   * (sessions_list, sessions_history, sessions_search, sessions_send).
   *
   * Default: "tree" (current session + spawned subagent sessions).
   */
  sessions?: {
    /**
     * - "self": only the current session
     * - "tree": current session + sessions spawned by this session (default)
     * - "agent": any session belonging to the current agent id (can include other users)
     * - "all": any session (cross-agent still requires tools.agentToAgent)
     */
    visibility?: SessionsToolsVisibility;
  }; /** Elevated exec permissions for the host machine. */
  elevated?: {
    /** Enable or disable elevated mode (default: true). */enabled?: boolean; /** Approved senders for /elevated (per-provider allowlists). */
    allowFrom?: AgentElevatedAllowFromConfig;
  }; /** Exec tool defaults. */
  exec?: ExecToolConfig; /** Filesystem tool path guards. */
  fs?: FsToolsConfig; /** Runtime loop detection for repetitive/ stuck tool-call patterns. */
  loopDetection?: ToolLoopDetectionConfig; /** Compact large OpenClaw, MCP, and client tool catalogs behind search/call tools. */
  toolSearch?: ToolSearchConfig; /** Generic code mode: expose exec/wait and hide normal tools behind a QuickJS catalog bridge. */
  codeMode?: CodeModeConfig; /** Collector-mode subagents and wait controls. */
  swarm?: SwarmConfig; /** sessions_spawn tool configuration. */
  sessions_spawn?: SessionsSpawnToolsConfig; /** Sub-agent tool policy defaults (deny wins). */
  subagents?: {
    tools?: ToolAllowDenyPolicyConfig;
  }; /** Sandbox tool policy defaults (deny wins). */
  sandbox?: {
    tools?: ToolAllowDenyPolicyConfig;
  }; /** Structured update_plan checklist tool; enabled by default. Set false to opt out. */
  updatePlan?: boolean;
};
type MessageToolsConfig = {
  crossContext?: {
    /** Allow sends to other channels within the same provider (default: true). */allowWithinProvider?: boolean; /** Allow sends across different providers (default: false). */
    allowAcrossProviders?: boolean; /** Cross-context marker configuration. */
    marker?: {
      /** Enable origin markers for cross-context sends (default: true). */enabled?: boolean; /** Text prefix template, supports {channel}. */
      prefix?: string; /** Text suffix template, supports {channel}. */
      suffix?: string;
    };
  };
  actions?: {
    /** Message action names exposed and accepted by the message tool. */allow?: string[];
  };
  broadcast?: {
    /** Enable broadcast action (default: true). */enabled?: boolean;
  };
};
//#endregion
//#region src/config/types.tts.d.ts
type TtsProvider = string;
type TtsMode = "final" | "all";
type TtsAutoMode = "off" | "always" | "inbound" | "tagged";
type TtsModelOverrideConfig = {
  /** Enable model-provided overrides for TTS. */enabled?: boolean; /** Allow model-provided TTS text blocks. */
  allowText?: boolean; /** Allow model-provided provider override (default: false). */
  allowProvider?: boolean; /** Allow model-provided voice/voiceId override. */
  allowVoice?: boolean; /** Allow model-provided modelId override. */
  allowModelId?: boolean; /** Allow model-provided voice settings override. */
  allowVoiceSettings?: boolean; /** Allow model-provided normalization or language overrides. */
  allowNormalization?: boolean; /** Allow model-provided seed override. */
  allowSeed?: boolean;
};
type TtsProviderConfigMap = Record<string, Record<string, unknown>>;
type TtsPersonaFallbackPolicy = "preserve-persona" | "provider-defaults" | "fail";
type TtsPersonaConfig = {
  label?: string;
  description?: string; /** Preferred provider for this persona. Explicit provider prefs still win. */
  provider?: TtsProvider;
  fallbackPolicy?: TtsPersonaFallbackPolicy; /** Provider-specific persona bindings keyed by speech provider id. */
  providers?: TtsProviderConfigMap;
};
type ResolvedTtsPersona = TtsPersonaConfig & {
  id: string;
};
type TtsConfig = {
  /** Auto-TTS mode (preferred). */auto?: TtsAutoMode; /** @deprecated Use auto. */
  enabled?: boolean; /** Apply TTS to final replies only or to all replies (tool/block/final). */
  mode?: TtsMode; /** Primary TTS provider (fallbacks are automatic). */
  provider?: TtsProvider; /** Active TTS persona id. */
  persona?: string; /** Named TTS personas. */
  personas?: Record<string, TtsPersonaConfig>; /** Optional model override for TTS auto-summary (provider/model or alias). */
  summaryModel?: string; /** Allow the model to override TTS parameters. */
  modelOverrides?: TtsModelOverrideConfig; /** Provider-specific TTS settings keyed by speech provider id. */
  providers?: TtsProviderConfigMap;
  /** Optional path for local TTS user preferences JSON. */
  /** Hard cap for text sent to TTS (chars). */
  maxTextLength?: number; /** API request timeout (ms). */
  timeoutMs?: number;
};
//#endregion
//#region src/config/types.approvals.d.ts
type NativeExecApprovalEnableMode = boolean | "auto";
type ExecApprovalForwardingMode = "session" | "targets" | "both";
type ExecApprovalForwardTarget = {
  /** Channel id (e.g. "discord", "slack", or plugin channel id). */channel: string; /** Destination id (channel id, user id, etc. depending on channel). */
  to: string; /** Optional account id for multi-account channels. */
  accountId?: string; /** Optional thread id to reply inside a thread. */
  threadId?: string | number;
};
type ExecApprovalForwardingConfig = {
  /** Enable forwarding exec approvals to chat channels. Default: false. */enabled?: boolean; /** Delivery mode (session=origin chat, targets=config targets, both=both). Default: session. */
  mode?: ExecApprovalForwardingMode; /** Only forward approvals for these agent IDs. Omit = all agents. */
  agentFilter?: string[]; /** Only forward approvals matching these session key patterns (substring or regex). */
  sessionFilter?: string[]; /** Explicit delivery targets (used when mode includes targets). */
  targets?: ExecApprovalForwardTarget[];
};
type ApprovalsConfig = {
  exec?: ExecApprovalForwardingConfig;
  plugin?: ExecApprovalForwardingConfig;
};
//#endregion
//#region src/config/types.bot-loop-protection.d.ts
type ChannelBotLoopProtectionConfig = {
  /** Enable pair loop protection for channels that support it. */enabled?: boolean; /** Maximum events a sender/receiver pair may exchange within the window. */
  maxEventsPerWindow?: number; /** Sliding window length in seconds. */
  windowSeconds?: number; /** Cooldown seconds applied to a pair after the limit is hit. */
  cooldownSeconds?: number;
};
//#endregion
//#region src/config/types.channel-health.d.ts
type ChannelHeartbeatVisibilityConfig = {
  /** Show HEARTBEAT_OK acknowledgments in chat (default: false). */showOk?: boolean; /** Show heartbeat alerts with actual content (default: true). */
  showAlerts?: boolean; /** Emit indicator events for UI status display (default: true). */
  useIndicator?: boolean;
};
type ChannelHealthMonitorConfig = {
  /**
   * Enable channel-health-monitor restarts for this channel or account.
   * Inherits the global gateway setting when omitted.
   */
  enabled?: boolean;
};
//#endregion
//#region src/config/types.channel-messaging-common.d.ts
type CommonChannelMessagingConfig<TCapabilities = string[], TAllowFromEntry = string | number, TDefaultTo = string, TStreaming = ChannelDeliveryStreamingConfig> = {
  /** Optional display name for this account (used in CLI/UI lists). */name?: string; /** Optional provider capability tags used for agent/runtime guidance. */
  capabilities?: TCapabilities; /** Markdown formatting overrides (tables). */
  markdown?: MarkdownConfig; /** Allow channel-initiated config writes (default: true). */
  configWrites?: boolean; /** If false, do not start this account. Default: true. */
  enabled?: boolean; /** Direct message access policy (default: pairing). */
  dmPolicy?: DmPolicy; /** Optional allowlist for inbound DM senders. */
  allowFrom?: TAllowFromEntry[]; /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */
  defaultTo?: TDefaultTo; /** Optional allowlist for group/channel senders. */
  groupAllowFrom?: TAllowFromEntry[]; /** Group/channel message handling policy. */
  groupPolicy?: GroupPolicy; /** Scope configured mention patterns to selected conversations. */
  mentionPatterns?: MentionPatternsPolicyConfig;
  /**
   * Supplemental context visibility policy for fetched/group context.
   * - "all": include all quoted/thread/history context
   * - "allowlist": only include context from allowlisted senders
   * - "allowlist_quote": same as allowlist, but keep explicit quote/reply context
   */
  contextVisibility?: ContextVisibilityMode; /** Max group/channel messages to keep as history context (0 disables). */
  historyLimit?: number; /** Max DM turns to keep as history context. */
  dmHistoryLimit?: number; /** Per-DM config overrides keyed by sender ID. */
  dms?: Record<string, DmConfig>; /** Outbound text chunk size (chars). */
  textChunkLimit?: number; /** Delivery streaming config: chunk mode plus block streaming controls. */
  streaming?: TStreaming; /** Heartbeat visibility settings for this channel. */
  heartbeatVisibility?: ChannelHeartbeatVisibilityConfig; /** @deprecated Doctor-only legacy input. */
  heartbeat?: ChannelHeartbeatVisibilityConfig; /** Channel health monitor overrides for this channel/account. */
  healthMonitor?: ChannelHealthMonitorConfig; /** Outbound response prefix override for this channel/account. */
  responsePrefix?: string; /** Max outbound media size in MB. */
  mediaMaxMb?: number; /** Native reply-threading mode for automatic replies. */
  replyToMode?: ReplyToMode;
};
type ChannelExecApprovalTarget = "dm" | "channel" | "both";
type ChannelExecApprovalConfig<TApprover = string | number> = {
  enabled?: NativeExecApprovalEnableMode;
  approvers?: TApprover[];
  agentFilter?: string[];
  sessionFilter?: string[];
  target?: ChannelExecApprovalTarget;
};
type ChannelBotInteractionConfig<TAllowBots = boolean | "mentions"> = {
  allowBots?: TAllowBots;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  dangerouslyAllowNameMatching?: boolean;
};
type ChannelReadReceiptConfig = {
  sendReadReceipts?: boolean;
};
type ChannelMentionPatternsConfig<TArraySugar extends boolean = false> = TArraySugar extends true ? string[] : MentionPatternsPolicyConfig;
type ChannelReactionConfig<TNotification = never, TLevel = never, TAckReaction = never, TAllowlist extends boolean = false> = {
  reactionNotifications?: TNotification;
  reactionLevel?: TLevel;
  ackReaction?: TAckReaction;
} & (TAllowlist extends true ? {
  reactionAllowlist?: Array<string | number>;
} : Record<never, never>);
//#endregion
//#region src/config/types.discord-presence.d.ts
type DiscordPresenceEventsConfig = {
  /** Enable online-presence system events for this guild. Default: true when configured. */enabled?: boolean; /** Discord channel ID that receives the routed agent wake. */
  channelId: string; /** Optional immutable Discord user ID allowlist. Omit to include all human members. */
  users?: string[];
  /**
   * Suppress presence-derived online events for this many seconds after a new Gateway
   * session while guild presence state is rebuilt. 0 disables. Default: 300.
   */
  reconnectSuppressSeconds?: number; /** Maximum queued online events for this guild per burst window. Default: 8. */
  burstLimit?: number; /** Sliding burst-detection window in seconds. Default: 60. */
  burstWindowSeconds?: number;
};
//#endregion
//#region src/config/types.discord.d.ts
type DiscordChannelStreamingConfig = Omit<ChannelPreviewStreamingConfig, "progress"> & {
  progress?: ChannelStreamingProgressConfig;
};
type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};
type DiscordMentionAliasesConfig = Record<string, string>;
type DiscordDmConfig = {
  /** If false, ignore all incoming Discord DMs. Default: true. */enabled?: boolean; /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean; /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: string[];
};
type DiscordGuildChannelConfig = {
  requireMention?: boolean;
  /**
   * If true, drop messages that mention another user/role but not this one (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean; /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** If specified, only load these skills for this channel. Omit = all skills; empty = no skills. */
  skills?: string[]; /** If false, disable the bot for this channel. */
  enabled?: boolean; /** Optional allowlist for channel senders (ids or names). */
  users?: string[]; /** Optional allowlist for channel senders by role ID. */
  roles?: string[]; /** Optional system prompt snippet for this channel. */
  systemPrompt?: string; /** If false, omit thread starter context for this channel (default: true). */
  includeThreadStarter?: boolean; /** If true, automatically create a thread for each new message in this channel. */
  autoThread?: boolean; /** Archive duration (minutes) for auto-created threads. Valid values: 60, 1440, 4320, 10080. */
  autoArchiveDuration?: "60" | "1440" | "4320" | "10080" | 60 | 1440 | 4320 | 10080; /** Naming strategy for auto-created threads. "message" uses message text; "generated" renames with an LLM title. */
  autoThreadName?: "message" | "generated";
};
type DiscordReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type DiscordGuildEntry = {
  slug?: string;
  requireMention?: boolean;
  /**
   * If true, drop messages that mention another user/role but not this one (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean; /** Optional tool policy overrides for this guild (used when channel override is missing). */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Reaction notification mode (off|own|all|allowlist). Default: own. */
  reactionNotifications?: DiscordReactionNotificationMode; /** Optional allowlist for guild senders (ids or names). */
  users?: string[]; /** Optional allowlist for guild senders by role ID. */
  roles?: string[];
  presenceEvents?: DiscordPresenceEventsConfig;
  channels?: Record<string, DiscordGuildChannelConfig>;
};
type DiscordActionConfig = {
  reactions?: boolean;
  stickers?: boolean;
  polls?: boolean;
  permissions?: boolean;
  messages?: boolean;
  threads?: boolean;
  pins?: boolean;
  search?: boolean;
  memberInfo?: boolean;
  roleInfo?: boolean;
  roles?: boolean;
  channelInfo?: boolean;
  voiceStatus?: boolean;
  events?: boolean;
  moderation?: boolean;
  emojiUploads?: boolean;
  stickerUploads?: boolean;
  channels?: boolean; /** Enable bot presence/activity changes (default: false). */
  presence?: boolean;
};
type DiscordIntentsConfig = {
  /**
   * Request the privileged Message Content intent. Disable only for mention-only guild operation;
   * Discord still includes content in DMs and messages that explicitly mention the bot. Default: true.
   */
  messageContent?: boolean; /** Enable Guild Presences privileged intent (requires Portal opt-in). Default: false. */
  presence?: boolean; /** Enable Guild Members privileged intent (requires Portal opt-in). Default: false. */
  guildMembers?: boolean; /** Enable Guild Voice States intent. Defaults to voice.enabled, unless explicitly set. */
  voiceStates?: boolean;
};
type DiscordVoiceAutoJoinConfig = {
  /** Guild ID that owns the voice channel. */guildId: string; /** Voice channel ID to join. */
  channelId: string;
};
type DiscordVoiceAllowedChannelConfig = {
  /** Guild ID that owns the voice channel. */guildId: string; /** Voice channel ID allowed for realtime voice sessions. */
  channelId: string;
};
type DiscordVoiceMode = "stt-tts" | "agent-proxy" | "bidi";
type DiscordVoiceRealtimeConsultPolicy = "auto" | "always";
type DiscordVoiceRealtimeToolPolicy = "safe-read-only" | "owner" | "none";
type DiscordVoiceRealtimeBootstrapContextFile = "IDENTITY.md" | "USER.md" | "SOUL.md";
type DiscordVoiceRealtimeConfig = {
  /** Realtime voice provider id, for example "openai". */provider?: string; /** Provider realtime session model, for example "gpt-realtime-2.1". */
  model?: string; /** Provider realtime output voice name, for example "cedar". */
  speakerVoice?: string; /** Provider realtime output voice id. */
  speakerVoiceId?: string; /** System instructions passed to the realtime provider. */
  instructions?: string; /** Tool policy for bidi realtime consult calls. */
  toolPolicy?: DiscordVoiceRealtimeToolPolicy; /** Whether bidi should force the OpenClaw agent brain for every substantive turn. */
  consultPolicy?: DiscordVoiceRealtimeConsultPolicy; /** OpenAI agent-proxy wake-name policy. Unset adapts to the room: off for one human, on for two or more. True always requires; false never requires. */
  requireWakeName?: boolean; /** Wake names that allow OpenAI agent-proxy realtime Discord voice to respond when the gate is active. Defaults to the routed agent name plus OpenClaw, or the agent id plus OpenClaw. */
  wakeNames?: string[]; /** Agent profile bootstrap files to include in realtime provider instructions. Defaults to IDENTITY.md, USER.md, and SOUL.md; set [] to disable. */
  bootstrapContextFiles?: DiscordVoiceRealtimeBootstrapContextFile[]; /** Allow Discord speaker-start events to interrupt active realtime playback. */
  bargeIn?: boolean; /** Minimum assistant playback duration before a barge-in truncates audio. Default: 250ms; set 0 for immediate interruption. */
  minBargeInAudioEndMs?: number; /** Debounce window before buffered transcripts are sent to the OpenClaw agent. */
  debounceMs?: number; /** Provider-specific realtime voice config keyed by provider id. */
  providers?: Record<string, Record<string, unknown> | undefined>;
};
type DiscordVoiceAgentSessionConfig = {
  /** Which OpenClaw conversation should receive voice turns. Default: "voice". */mode?: "voice" | "target"; /** Discord target used when mode is "target", for example "channel:123". */
  target?: string;
};
type DiscordVoiceConfig = {
  /** Enable Discord voice channel conversations (default: true). */enabled?: boolean; /** Voice conversation mode. Default: agent-proxy. */
  mode?: DiscordVoiceMode; /** Route voice turns through an existing OpenClaw Discord conversation. */
  agentSession?: DiscordVoiceAgentSessionConfig; /** Optional LLM model override for Discord voice channel responses. */
  model?: string; /** Realtime provider settings for agent-proxy or bidi modes. */
  realtime?: DiscordVoiceRealtimeConfig; /** Voice channels to auto-join on startup. */
  autoJoin?: DiscordVoiceAutoJoinConfig[]; /** If false, configured followUsers are ignored without removing the saved user list. */
  followUsersEnabled?: boolean; /** Discord user IDs whose current voice channel the bot should follow. */
  followUsers?: string[]; /** Voice channels the bot is allowed to join or remain in. Unset means any voice channel is allowed. */
  allowedChannels?: DiscordVoiceAllowedChannelConfig[]; /** Enable/disable DAVE end-to-end encryption (default: true; Discord may require this). */
  daveEncryption?: boolean; /** Consecutive decrypt failures before DAVE session reinitialization (default: 24). */
  decryptionFailureTolerance?: number; /** Initial @discordjs/voice Ready wait in milliseconds (default: 30000). */
  connectTimeoutMs?: number; /** Grace period for Discord voice reconnect signalling after a disconnect (default: 15000). */
  reconnectGraceMs?: number; /** Silence grace after Discord reports a speaker ended before finalizing STT capture (default: 2000). */
  captureSilenceGraceMs?: number; /** Optional TTS overrides for Discord voice output. */
  tts?: TtsConfig;
};
type DiscordExecApprovalConfig = ChannelExecApprovalConfig<string> & {
  /** Delete approval DMs after approval, denial, or timeout. Default: false. */cleanupAfterResolve?: boolean;
};
type DiscordAgentComponentsConfig = {
  /** Enable agent-controlled interactive components (buttons, select menus). Default: true. */enabled?: boolean; /** Time in milliseconds before sent Discord component callbacks expire. Default: 1800000. */
  ttlMs?: number;
};
type DiscordThreadBindingsConfig = {
  /** Enable Discord thread binding features. Overrides session.threadBindings.enabled. */enabled?: boolean; /** Inactivity window in hours. Set 0 to disable. Default: 24. */
  idleHours?: number; /** Hard max age in hours. Set 0 to disable. Default: 0. */
  maxAgeHours?: number; /** Allow session spawns to create and bind Discord threads. Default: true. */
  spawnSessions?: boolean; /** Default context mode for native subagents. Default: fork. */
  defaultSpawnContext?: "isolated" | "fork";
};
type DiscordSlashCommandConfig = {
  /** Reply ephemerally (default: true). */ephemeral?: boolean;
};
type DiscordThreadConfig = {
  /** If true, Discord thread sessions inherit the parent channel transcript. Default: false. */inheritParent?: boolean;
};
type DiscordAutoPresenceConfig = {
  /** Enable automatic runtime/quota-based Discord presence updates. Default: false. */enabled?: boolean; /** Poll interval for evaluating runtime availability state (ms). Default: 30000. */
  intervalMs?: number; /** Minimum spacing between actual gateway presence updates (ms). Default: 15000. */
  minUpdateIntervalMs?: number;
  /** Optional custom status text while runtime is healthy; supports plain text. */
  /** Optional custom status text while runtime/quota state is degraded or unknown. */
  /** Optional custom status text while runtime detects quota/token exhaustion. */
  /** @deprecated Doctor-only legacy input. */
  exhaustedText?: string;
};
type DiscordAccountConfig = Omit<CommonChannelMessagingConfig<string[], string, string, DiscordChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<never, never, string> & {
  /** Override native command registration for Discord (bool or "auto"). */commands?: ProviderCommandsConfig;
  token?: SecretInput; /** Optional Discord application/client ID. Set this when REST application lookup is blocked. */
  applicationId?: string;
  activities?: {
    clientSecret?: string;
    applicationId?: string;
  }; /** HTTP(S) proxy URL for Discord gateway WebSocket connections. */
  proxy?: string;
  /**
   * Deterministic outbound @handle rewrites for known Discord users.
   * Keys are handles without the leading @; values are Discord user IDs.
   */
  mentionAliases?: DiscordMentionAliasesConfig;
  /**
   * Suppress Discord-generated link embeds for outbound messages. Default: true.
   * Explicit `embeds` payloads are still sent normally.
   */
  suppressEmbeds?: boolean;
  /**
   * Soft max line count per Discord message.
   * Discord clients can clip/collapse very tall messages; splitting by lines
   * keeps replies readable in-channel. Default: 17.
   */
  maxLinesPerMessage?: number; /** Per-action tool gating (default: true for all). */
  actions?: DiscordActionConfig; /** Thread session behavior. */
  thread?: DiscordThreadConfig;
  dm?: DiscordDmConfig; /** New per-guild config keyed by guild id or slug. */
  guilds?: Record<string, DiscordGuildEntry>; /** Exec approval forwarding configuration. */
  execApprovals?: DiscordExecApprovalConfig; /** Agent-controlled interactive components (buttons, select menus). */
  agentComponents?: DiscordAgentComponentsConfig;
  /** Discord UI customization (components, modals, etc.). */
  /** Slash command configuration. */
  slashCommand?: DiscordSlashCommandConfig; /** Thread binding lifecycle settings. */
  threadBindings?: DiscordThreadBindingsConfig;
  /** Show subagent count reactions and typing on the source message. Default: false. */
  /** @deprecated Doctor-only legacy input. */
  subagentProgress?: boolean; /** Privileged Gateway Intents (must also be enabled in Discord Developer Portal). */
  intents?: DiscordIntentsConfig; /** Voice channel conversation settings. */
  voice?: DiscordVoiceConfig; /** PluralKit identity resolution for proxied messages. */
  pluralkit?: DiscordPluralKitConfig; /** When to send ack reactions for this Discord account. Overrides messages.ackReactionScope. */
  ackReactionScope?: "group-mentions" | "group-all" | "direct" | "all" | "off" | "none"; /** Bot activity status text (e.g. "Watching X"). */
  activity?: string; /** Bot status (online|dnd|idle|invisible). Defaults to online when presence is configured. */
  status?: "online" | "dnd" | "idle" | "invisible"; /** Automatic runtime/quota presence signaling (status text + status mapping). */
  autoPresence?: DiscordAutoPresenceConfig; /** Activity type (0=Game, 1=Streaming, 2=Listening, 3=Watching, 4=Custom, 5=Competing). Defaults to 4 (Custom) when activity is set. */
  activityType?: 0 | 1 | 2 | 3 | 4 | 5; /** Streaming URL (Twitch/YouTube). Required when activityType=1. */
  activityUrl?: string;
  /**
   * Legacy compatibility block. Discord no longer enforces channel-owned
   * timeouts for queued inbound agent runs.
   */
  inboundWorker?: {
    /**
     * Ignored. Queued Discord agent runs are governed by the session/tool/runtime
     * lifecycle, not by Discord channel config.
     */
    runTimeoutMs?: number;
  };
};
type DiscordConfig = {
  /** Optional per-account Discord configuration (multi-account). */accounts?: Record<string, DiscordAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & DiscordAccountConfig;
//#endregion
//#region src/config/types.googlechat.d.ts
type GoogleChatDmConfig = {
  /** If false, ignore all incoming Google Chat DMs. Default: true. */enabled?: boolean;
};
type GoogleChatGroupConfig = {
  /** If false, disable the bot in this space. */enabled?: boolean; /** Require mentioning the bot to trigger replies. */
  requireMention?: boolean; /** Sliding-window bot-pair loop guard for accepted bot-authored Google Chat messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig; /** Allowlist of users that can invoke the bot in this space. */
  users?: Array<string | number>; /** Optional system prompt for this space. */
  systemPrompt?: string;
};
type GoogleChatAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & ChannelBotInteractionConfig<boolean> & {
  /** Default mention requirement for space messages (default: true). */requireMention?: boolean; /** Per-space configuration keyed by space id or name. */
  groups?: Record<string, GoogleChatGroupConfig>; /** Service account JSON (inline string, object, or secret reference). */
  serviceAccount?: string | Record<string, unknown> | SecretRef; /** Service account JSON file path. */
  serviceAccountFile?: string; /** Webhook audience type (app-url or project-number). */
  audienceType?: "app-url" | "project-number"; /** Audience value (app URL or project number). */
  audience?: string; /** Exact add-on principal to accept when app-url delivery uses add-on tokens. */
  appPrincipal?: string; /** Google Chat webhook path (default: /googlechat). */
  webhookPath?: string; /** Google Chat webhook URL (used to derive the path). */
  webhookUrl?: string; /** Optional bot user resource name (users/...). */
  botUser?: string; /** If false, ignore all incoming Google Chat DMs. Default: true. */
  dm?: GoogleChatDmConfig;
  /**
   * Typing indicator mode (default: "message").
   * - "none": No indicator
   * - "message": Send "_<name> is typing..._" then edit with response
   * - "reaction": React with 👀 to user message, remove on reply
   *   NOTE: Reaction mode requires user OAuth (not supported with service account auth).
   *   If configured, falls back to message mode with a warning.
   */
  typingIndicator?: "none" | "message" | "reaction";
};
type GoogleChatConfig = {
  /** Optional per-account Google Chat configuration (multi-account). */accounts?: Record<string, GoogleChatAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & GoogleChatAccountConfig;
//#endregion
//#region src/config/types.imessage.d.ts
/** Private-API and helper actions the iMessage runtime may expose to agents. */
type IMessageActionConfig = {
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  sendWithEffect?: boolean;
  renameGroup?: boolean;
  setGroupIcon?: boolean;
  addParticipant?: boolean;
  removeParticipant?: boolean;
  leaveGroup?: boolean;
  sendAttachment?: boolean;
  polls?: boolean;
};
/** Inbound tapback notification policy. */
type IMessageReactionNotificationMode = "off" | "own" | "all";
type IMessageSendTransport = "auto" | "bridge" | "applescript";
/** Per-account iMessage runtime/config shape. */
type IMessageAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns" | "replyToMode"> & ChannelReadReceiptConfig & ChannelReactionConfig<IMessageReactionNotificationMode> & {
  /** imsg CLI binary path (default: imsg). */cliPath?: string; /** Optional Messages db path override. */
  dbPath?: string; /** Remote SSH host token for SCP attachment fetches (`host` or `user@host`). */
  remoteHost?: string; /** Enable or disable private API message actions. */
  actions?: IMessageActionConfig; /** Optional default send service (imessage|sms|auto). */
  service?: "imessage" | "sms" | "auto"; /** Preferred imsg RPC send transport. Default: auto. */
  sendTransport?: IMessageSendTransport; /** Optional default region (used when sending SMS). */
  region?: string; /** Include attachments + reactions in watch payloads. */
  includeAttachments?: boolean; /** Allowed local iMessage attachment roots (supports single-segment `*` wildcards). */
  attachmentRoots?: string[]; /** Allowed remote iMessage attachment roots for SCP fetches (supports `*`). */
  remoteAttachmentRoots?: string[]; /** Timeout for probe/RPC operations in milliseconds (default: 10000). */
  probeTimeoutMs?: number;
  /**
   * Merge consecutive same-sender DM rows from `chat.db` into a single agent
   * turn, so Apple's split-send (`<command> <URL>` arriving as two separate
   * rows several seconds apart) lands as one merged message. DM-only — group chats
   * keep instant per-message dispatch. Widens the default inbound debounce
   * window to 7000 ms when enabled without an explicit
   * `messages.inbound.byChannel.imessage` or global
   * `messages.inbound.debounceMs`. Default: `false`.
   */
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    /**
     * Per-group system prompt. Injected into the agent's system prompt on
     * every turn that handles a message in that group. Matches the shape
     * already supported by Discord, Telegram, IRC, Slack, GoogleChat, and
     * other group-capable channels. The wildcard `groups["*"]` entry is
     * also honored.
     */
    systemPrompt?: string;
  }>;
  /**
   * Catchup: replay inbound messages that arrived in `chat.db` while the
   * gateway was offline (crash, restart, mac sleep). Disabled by default.
   * See https://github.com/openclaw/openclaw/issues/78649.
   */
  catchup?: {
    /** Master switch. Default `false`. */enabled?: boolean;
    /**
     * Maximum age of replayable messages in minutes. Messages older than
     * `now - maxAgeMinutes` are skipped even when the cursor is older.
     * Defense against runaway replay (the inverse of #62761). Default
     * `120` (2 h). Clamp `[1, 720]`.
     */
    maxAgeMinutes?: number;
    /**
     * Maximum messages to replay per catchup pass. Default `50`. Clamp
     * `[1, 500]`.
     */
    perRunLimit?: number;
    /**
     * On first run when no cursor exists, look back this many minutes.
     * Default `30`.
     */
    firstRunLookbackMinutes?: number;
    /**
     * Per-message retry ceiling. After this many consecutive failed
     * dispatch attempts against the same message guid, catchup logs a
     * `warn` and force-advances the cursor past the wedged message.
     * Default `10`. Clamp `[1, 1000]`.
     */
    maxFailureRetries?: number;
  };
};
/** Top-level iMessage config, with optional account map layered over default account fields. */
type IMessageConfig = {
  /** Optional per-account iMessage configuration (multi-account). */accounts?: Record<string, IMessageAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IMessageAccountConfig;
//#endregion
//#region src/config/types.implicit-mentions.d.ts
type ChannelImplicitMentionsConfig = {
  /** Treat replies to the bot's own message as implicit mentions. */replyToBot?: boolean; /** Treat quoted bot messages as implicit mentions. */
  quotedBot?: boolean; /** Treat follow-ups in threads the bot participated in as implicit mentions. */
  threadParticipation?: boolean;
};
//#endregion
//#region src/config/types.irc.d.ts
type IrcAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns" | "replyToMode"> & {
  /** IRC server hostname (example: irc.example.com). */host?: string; /** IRC server port (default: 6697 with TLS, otherwise 6667). */
  port?: number; /** Use TLS for IRC connection (default: true). */
  tls?: boolean; /** IRC nickname to identify this bot. */
  nick?: string; /** IRC USER field username (defaults to nick). */
  username?: string; /** IRC USER field realname (default: OpenClaw). */
  realname?: string; /** Optional IRC server password (sensitive). */
  password?: string; /** Optional file path containing IRC server password. */
  passwordFile?: string; /** Optional NickServ identify/register settings. */
  nickserv?: {
    /** Enable NickServ identify/register after connect (default: enabled when password is set). */enabled?: boolean; /** NickServ service nick (default: NickServ). */
    service?: string; /** NickServ password (sensitive). */
    password?: string; /** Optional file path containing NickServ password. */
    passwordFile?: string; /** If true, send NickServ REGISTER on connect. */
    register?: boolean; /** Email used with NickServ REGISTER. */
    registerEmail?: string;
  }; /** Auto-join channel list at connect (example: ["#openclaw"]). */
  channels?: string[]; /** Outbound text chunk size (chars). Default: 350. */
  textChunkLimit?: number;
  groups?: Record<string, {
    requireMention?: boolean;
    tools?: GroupToolPolicyConfig;
    toolsBySender?: GroupToolPolicyBySenderConfig;
    allowFrom?: Array<string | number>;
    skills?: string[];
    enabled?: boolean;
    systemPrompt?: string;
  }>; /** Optional mention patterns specific to IRC channel messages. */
  mentionPatterns?: ChannelMentionPatternsConfig<true>;
};
type IrcConfig = {
  /** Optional per-account IRC configuration (multi-account). */accounts?: Record<string, IrcAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & IrcAccountConfig;
//#endregion
//#region src/config/types.msteams.d.ts
type MSTeamsWebhookConfig = {
  /** Port for the webhook server. Default: 3978. */port?: number; /** Path for the messages endpoint. Default: /api/messages. */
  path?: string;
};
/** Teams SDK cloud environment. Public cloud is the default. */
type MSTeamsCloudName = "Public" | "USGov" | "USGovDoD" | "China";
/**
 * Bot Framework OAuth SSO configuration for Microsoft Teams.
 *
 * When enabled, the plugin handles the `signin/tokenExchange` and
 * `signin/verifyState` invoke activities that Teams sends after an
 * `oauthCard` is presented to the user. The exchanged user token is
 * persisted via the Bot Framework User Token service so downstream
 * tools can call Microsoft Graph with delegated permissions.
 *
 * Prerequisites (Azure portal):
 * - The bot's Azure AD (Entra) app is configured with an exposed API
 *   scope (for example `access_as_user`) and lists the Teams client
 *   IDs in `knownClientApplications`.
 * - The Bot Framework channel registration has an OAuth Connection
 *   Setting whose name matches `connectionName` below, pointing at
 *   the same Azure AD app.
 */
type MSTeamsSsoConfig = {
  /** If true, handle signin/tokenExchange + signin/verifyState invokes. Default: false. */enabled?: boolean;
  /**
   * Name of the OAuth connection configured on the Bot Framework channel
   * registration (Azure Bot resource). Required when `enabled` is true.
   */
  connectionName?: string;
};
/** Reply style for MS Teams messages. */
type MSTeamsReplyStyle = "thread" | "top-level";
/** Channel-level config for MS Teams. */
type MSTeamsChannelConfig = {
  /** Require @mention to respond. Default: true. */requireMention?: boolean; /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle;
};
/** Team-level config for MS Teams. */
type MSTeamsTeamConfig = {
  /** Default requireMention for channels in this team. */requireMention?: boolean; /** Default tool policy for channels in this team. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Default reply style for channels in this team. */
  replyStyle?: MSTeamsReplyStyle; /** Per-channel overrides. Key is conversation ID (e.g., "19:...@thread.tacv2"). */
  channels?: Record<string, MSTeamsChannelConfig>;
};
type MSTeamsConfig = Omit<CommonChannelMessagingConfig<string[], string, string, ChannelPreviewStreamingConfig>, "mentionPatterns" | "name" | "replyToMode"> & Pick<ChannelBotInteractionConfig<boolean>, "dangerouslyAllowNameMatching"> & {
  /** Azure Bot App ID (from Azure Bot registration). */appId?: string; /** Azure Bot App Password / Client Secret. */
  appPassword?: SecretInput; /** Azure AD Tenant ID (for single-tenant bots). */
  tenantId?: string; /** Teams SDK cloud environment. Default: Public. */
  cloud?: MSTeamsCloudName;
  /**
   * Bot Connector service URL used by SDK proactive sends/edits/deletes.
   * Set with `cloud` for USGov/DoD SDK clouds; set alone for GCC.
   */
  serviceUrl?: string;
  /**
   * Authentication type.
   * - `"secret"` (default): uses `appPassword` (client secret).
   * - `"federated"`: uses workload identity / managed identity / certificate.
   */
  authType?: "secret" | "federated"; /** Path to a PEM certificate file for certificate-based auth. Used when `authType` is `"federated"`. */
  certificatePath?: string; /** Certificate thumbprint (hex SHA-1) for certificate-based auth. */
  certificateThumbprint?: string; /** If `true`, use Azure Managed Identity (system- or user-assigned) instead of a certificate. */
  useManagedIdentity?: boolean; /** User-assigned managed-identity client ID. When omitted with `useManagedIdentity: true`, system-assigned identity is used. */
  managedIdentityClientId?: string; /** Webhook server configuration. */
  webhook?: MSTeamsWebhookConfig; /** Send native Teams typing indicator before replies. Default: true for groups/channels; DMs use informative stream status. */
  typingIndicator?: boolean;
  /**
   * Allowed host suffixes for inbound attachment downloads.
   * Use ["*"] to allow any host (not recommended).
   */
  mediaAllowHosts?: Array<string>;
  /**
   * Allowed host suffixes for attaching Authorization headers to inbound media retries.
   * Use specific hosts only; avoid multi-tenant suffixes.
   */
  mediaAuthAllowHosts?: Array<string>;
  /**
   * Query Graph for channel/group media when Bot Framework HTML omits file markers.
   * Requires the documented Graph permissions and adds one message lookup per
   * otherwise unresolved HTML activity. Default: false.
   */
  graphMediaFallback?: boolean; /** Default: require @mention to respond in channels/groups. */
  requireMention?: boolean; /** Default reply style: "thread" replies to the message, "top-level" posts a new message. */
  replyStyle?: MSTeamsReplyStyle; /** Per-team config. Key is team ID (from the /team/ URL path segment). */
  teams?: Record<string, MSTeamsTeamConfig>; /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2"). */
  sharePointSiteId?: string; /** Show a welcome Adaptive Card when the bot is added to a 1:1 chat. Default: true. */
  welcomeCard?: boolean; /** Custom prompt starter labels shown on the welcome card. */
  promptStarters?: string[]; /** Show a welcome message when the bot is added to a group chat. Default: false. */
  groupWelcomeCard?: boolean; /** Enable the Teams feedback loop (thumbs up/down) on AI-generated messages. Default: true. */
  feedbackEnabled?: boolean; /** Enable background reflection when a user gives negative feedback. Default: true. */
  feedbackReflection?: boolean; /** Minimum interval (ms) between reflections per session. Default: 300000 (5 min). */
  feedbackReflectionCooldownMs?: number; /** Delegated auth settings for user-scoped Graph API actions (e.g., reactions). */
  delegatedAuth?: {
    /** Enable delegated auth (user sign-in for Graph actions that need user scope). */enabled?: boolean; /** Additional scopes to request during OAuth consent. */
    scopes?: string[];
  }; /** Bot Framework OAuth SSO (signin/tokenExchange + signin/verifyState) settings. */
  sso?: MSTeamsSsoConfig;
};
//#endregion
//#region src/config/types.signal.d.ts
type SignalReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SignalReactionLevel = "off" | "ack" | "minimal" | "extensive";
type SignalTransportConfig = {
  kind: "managed-native"; /** Optional signal-cli config directory path (passed as --config). */
  configPath?: string; /** Native daemon connection URL when it differs from the managed bind endpoint. */
  url?: string; /** HTTP host for the managed signal-cli daemon (default 127.0.0.1). */
  httpHost?: string; /** HTTP port for the managed signal-cli daemon (default 8080). */
  httpPort?: number; /** signal-cli binary path (default: signal-cli). */
  cliPath?: string; /** Max time to wait for signal-cli daemon startup (ms, cap 120000). */
  startupTimeoutMs?: number;
  receiveMode?: "on-start" | "manual";
  ignoreStories?: boolean;
} | {
  kind: "external-native"; /** Base URL for an externally managed native signal-cli HTTP daemon. */
  url: string;
} | {
  kind: "container"; /** Base URL for bbernhard/signal-cli-rest-api. */
  url: string;
};
type SignalGroupConfig = {
  requireMention?: boolean; /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type SignalAccountConfig = Omit<CommonChannelMessagingConfig, "mentionPatterns"> & ChannelReadReceiptConfig & ChannelReactionConfig<SignalReactionNotificationMode, SignalReactionLevel, never, true> & {
  /** Optional explicit E.164 account for signal-cli. */account?: string; /** Optional account UUID for signal-cli (used for loop protection). */
  accountUuid?: string; /** Concrete transport owned by this account. Defaults to managed native signal-cli. */
  transport?: SignalTransportConfig; /** Skip downloading inbound Signal attachments. */
  ignoreAttachments?: boolean; /** OpenClaw-side target aliases keyed by friendly name. */
  aliases?: Record<string, string>; /** Per-group overrides keyed by Signal group id (or "*"). */
  groups?: Record<string, SignalGroupConfig>; /** Optional per-chat-type native reply quoting overrides. */
  replyToModeByChatType?: Partial<Record<"direct" | "group", ReplyToMode>>; /** Action toggles for message tool capabilities. */
  actions?: {
    /** Enable/disable sending reactions via message tool (default: true). */reactions?: boolean;
  };
};
type SignalConfig = {
  /** Optional per-account Signal configuration (multi-account). */accounts?: Record<string, SignalAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SignalAccountConfig;
//#endregion
//#region src/config/types.slack.d.ts
type SlackDmConfig = {
  /** If false, ignore all incoming Slack DMs. Default: true. */enabled?: boolean; /** If true, allow group DMs (default: false). */
  groupEnabled?: boolean; /** Optional allowlist for group DM channels (ids or slugs). */
  groupChannels?: Array<string | number>;
};
type SlackChannelConfig = {
  /** If false, disable the bot in this channel. */enabled?: boolean; /** Require mentioning the bot to trigger replies. */
  requireMention?: boolean;
  /**
   * Ignore room messages that mention another user or user group but not this bot.
   * Requires a resolved bot user ID. Default: false.
   */
  ignoreOtherMentions?: boolean; /** Override Slack reply/thread behavior for this channel. */
  replyToMode?: ReplyToMode; /** Optional tool policy overrides for this channel. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Allow bot-authored messages to trigger replies (default: false). Set to "mentions" to only allow bot messages that @mention this bot. */
  allowBots?: boolean | "mentions"; /** Sliding-window bot-pair loop guard for accepted bot-authored Slack messages. */
  botLoopProtection?: ChannelBotLoopProtectionConfig; /** Allowlist of users that can invoke the bot in this channel. */
  users?: Array<string | number>; /** Optional skill filter for this channel. */
  skills?: string[]; /** Optional system prompt for this channel. */
  systemPrompt?: string; /** Slack presence polling and agent wake mode for this channel. */
  presenceEvents?: SlackPresenceEventsConfig;
};
type SlackPresenceEventsMode = "off" | "auto" | "on";
type SlackPresenceEventsConfig = {
  /** Presence wake mode. Default: off. */mode?: SlackPresenceEventsMode;
};
type SlackReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SlackStreamingProgressConfig = ChannelStreamingProgressConfig & {
  /** Opt in to Slack-native task cards for progress mode. Default: false. */nativeTaskCards?: boolean;
};
type SlackChannelStreamingConfig = ChannelStreamingConfig<SlackStreamingProgressConfig>;
type SlackExecApprovalConfig = ChannelExecApprovalConfig;
type SlackCapabilitiesConfig = string[];
type SlackActionConfig = {
  reactions?: boolean;
  messages?: boolean;
  pins?: boolean;
  search?: boolean;
  permissions?: boolean;
  memberInfo?: boolean;
  channelInfo?: boolean;
  emojiList?: boolean;
};
type SlackSlashCommandConfig = {
  /** Enable handling for the configured slash command (default: false). */enabled?: boolean; /** Slash command name (default: "openclaw"). */
  name?: string; /** Session key prefix for slash commands (default: "slack:slash"). */
  sessionPrefix?: string; /** Reply ephemerally (default: true). */
  ephemeral?: boolean;
};
type SlackThreadConfig = {
  /** Scope for thread history context (thread|channel). Default: thread. */historyScope?: "thread" | "channel"; /** If true, thread sessions inherit the parent channel transcript. Default: false. */
  inheritParent?: boolean; /** Maximum number of thread messages to fetch as context when starting a new thread session (default: 20). Set to 0 to disable thread history fetching. */
  initialHistoryLimit?: number;
};
type SlackRelayConfig = {
  /** Full relay websocket URL, including the route path. */url?: string; /** Bearer token used to authenticate the gateway websocket to the Slack relay. */
  authToken?: SecretInput; /** Gateway destination id registered with openclaw-slack-router. */
  gatewayId?: string;
};
type SlackAccountConfig = Omit<CommonChannelMessagingConfig<SlackCapabilitiesConfig, string | number, string, SlackChannelStreamingConfig>, "groupAllowFrom"> & ChannelBotInteractionConfig & ChannelReactionConfig<SlackReactionNotificationMode, never, string, true> & {
  /** @deprecated Doctor-only legacy input. */identity?: "bot" | "user"; /** @deprecated Doctor-only legacy input. */
  socketMode?: {
    clientPingTimeout?: number;
    serverPingTimeout?: number;
    pingPongLoggingEnabled?: boolean;
  }; /** Slack author identity. Default: bot. */
  postAs?: "bot" | "user"; /** Slack connection mode (socket|http|relay). Default: socket. */
  mode?: "socket" | "http" | "relay";
  /** Slack SDK Socket Mode transport options. Ignored in HTTP mode. */
  /** Relay-delivered Slack event source. Used when mode is "relay". */
  relay?: SlackRelayConfig; /** Slack signing secret (required for HTTP mode). */
  signingSecret?: SecretInput; /** Slack Events API webhook path (default: /slack/events). */
  webhookPath?: string; /** Slack-native exec approval delivery + approver authorization. */
  execApprovals?: SlackExecApprovalConfig; /** Override native command registration for Slack (bool or "auto"). */
  commands?: ProviderCommandsConfig;
  botToken?: SecretInput;
  appToken?: SecretInput;
  userToken?: SecretInput; /** If true, restrict user token to read operations only. Default: true. */
  userTokenReadOnly?: boolean; /** Default mention requirement for channel messages (default: true). */
  requireMention?: boolean; /** Implicit mention policy for replies, quotes, and participated threads. */
  implicitMentions?: ChannelImplicitMentionsConfig; /** Pass through Slack chat.postMessage link unfurl control. Default: false. */
  unfurlLinks?: boolean; /** Pass through Slack chat.postMessage media unfurl control. Omitted by default. */
  unfurlMedia?: boolean;
  /**
   * Optional per-chat-type reply threading overrides.
   * Example: { direct: "all", group: "first", channel: "off" }.
   */
  replyToModeByChatType?: Partial<Record<"direct" | "group" | "channel", ReplyToMode>>; /** Thread session behavior. */
  thread?: SlackThreadConfig; /** Poll Slack presence and wake the routed agent on away-to-active transitions. Default: off. */
  presenceEvents?: SlackPresenceEventsConfig;
  actions?: SlackActionConfig;
  slashCommand?: SlackSlashCommandConfig;
  dm?: SlackDmConfig;
  channels?: Record<string, SlackChannelConfig>; /** Reaction emoji added while processing a reply (e.g. "hourglass_flowing_sand"). Removed when done. Useful as a typing indicator fallback when assistant mode is not enabled. */
  typingReaction?: string;
};
type SlackConfig = {
  /** Optional per-account Slack configuration (multi-account). */accounts?: Record<string, SlackAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & SlackAccountConfig;
//#endregion
//#region src/config/types.telegram.d.ts
type TelegramActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean; /** Enable poll creation. Requires sendMessage to also be enabled. */
  poll?: boolean;
  deleteMessage?: boolean;
  editMessage?: boolean; /** Enable sticker actions (send and search). */
  sticker?: boolean; /** Enable forum topic creation. */
  createForumTopic?: boolean; /** Enable forum topic editing (rename / change icon). */
  editForumTopic?: boolean;
};
type TelegramThreadBindingsConfig = SessionThreadBindingsConfig;
type TelegramNetworkConfig = {
  /** Override Node's autoSelectFamily behavior (true = enable, false = disable). */autoSelectFamily?: boolean;
  /**
   * DNS result order for network requests ("ipv4first" | "verbatim").
   * Set to "ipv4first" to prioritize IPv4 addresses and work around IPv6 issues.
   * Default: "ipv4first" on Node 22+ to avoid common fetch failures.
   */
  dnsResultOrder?: "ipv4first" | "verbatim";
  /**
   * Dangerous opt-in for Telegram media downloads in trusted fake-IP or
   * transparent-proxy environments that resolve api.telegram.org to
   * private/internal/special-use addresses.
   */
  dangerouslyAllowPrivateNetwork?: boolean;
};
type TelegramInlineButtonsScope = "off" | "dm" | "group" | "all" | "allowlist";
type TelegramPreviewStreamingConfig = Omit<ChannelPreviewStreamingConfig, "preview"> & {
  preview?: ChannelStreamingPreviewConfig;
};
type TelegramExecApprovalConfig = ChannelExecApprovalConfig;
type TelegramCapabilitiesConfig = string[] | {
  inlineButtons?: TelegramInlineButtonsScope;
};
/** Custom command definition for Telegram bot menu. */
type TelegramCustomCommand = {
  /** Command name (without leading /). */command: string; /** Description shown in Telegram command menu. */
  description: string;
};
type TelegramAccountConfig = CommonChannelMessagingConfig<TelegramCapabilitiesConfig, string | number, string | number, TelegramPreviewStreamingConfig> & ChannelReactionConfig<"off" | "own" | "all", "off" | "ack" | "minimal" | "extensive", string> & {
  /** Telegram-native exec approval delivery + approver authorization. */execApprovals?: TelegramExecApprovalConfig; /** Override native command registration for Telegram (bool or "auto"). */
  commands?: ProviderCommandsConfig; /** Custom commands to register in Telegram's command menu (merged with native). */
  customCommands?: TelegramCustomCommand[];
  botToken?: string; /** Path to a regular file containing the bot token; symlinks are rejected. */
  tokenFile?: string;
  groups?: Record<string, TelegramGroupConfig>; /** Per-DM configuration for Telegram DM topics (key is chat ID). */
  direct?: Record<string, TelegramDirectConfig>;
  /**
   * Use Telegram Bot API 10.2 rich messages for text sends and edits.
   * When false (default), falls back to HTML/plain text formatting via sendMessage.
   * Set to true to enable native tables, details, and rich media via sendRichMessage.
   * Note: Some Telegram clients (Web, Desktop, older mobile) do NOT support
   * sendRichMessage and will show "This message is not supported" errors.
   * Default: false.
   */
  richMessages?: boolean; /** Network transport overrides for Telegram. */
  network?: TelegramNetworkConfig;
  proxy?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookPath?: string; /** Local webhook listener bind host (default: 127.0.0.1). */
  webhookHost?: string; /** Local webhook listener bind port (default: 8787). */
  webhookPort?: number; /** Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. */
  webhookCertPath?: string; /** Per-action tool gating (default: true for all). */
  actions?: TelegramActionConfig; /** Telegram thread/conversation binding overrides. */
  threadBindings?: TelegramThreadBindingsConfig;
  /**
   * Controls which user reactions trigger notifications:
   * - "off" (default): ignore all reactions
   * - "own": notify when users react to bot messages
   * - "all": notify agent of all reactions
   */
  /**
   * Controls agent's reaction capability:
   * - "off": agent cannot react
   * - "ack" (default): bot sends acknowledgment reactions (👀 while processing)
   * - "minimal": agent can react sparingly (guideline: 1 per 5-10 exchanges)
   * - "extensive": agent can react liberally when appropriate
   */
  /** Controls whether link previews are shown in outbound messages. Default: true. */
  linkPreview?: boolean; /** Send Telegram bot error replies silently (no notification sound). Default: false. */
  silentErrorReplies?: boolean; /** Controls outbound error reporting: always, once per cooldown window, or silent. */
  errorPolicy?: "always" | "once" | "silent";
  /**
   * Per-channel outbound response prefix override.
   *
   * Account values take precedence over the channel-level value.
   * Use `""` to explicitly disable a global prefix for this channel.
   * Use `"auto"` to derive `[{identity.name}]` from the routed agent.
   */
  /**
   * Per-channel ack reaction override.
   * Telegram expects unicode emoji (e.g., "👀") rather than shortcodes.
   */
  /** Custom Telegram Bot API root URL (e.g. "https://my-proxy.example.com" or a local Bot API server), not a /bot<TOKEN> endpoint. */
  apiRoot?: string; /** Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. */
  trustedLocalFileRoots?: string[]; /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramTopicConfig = {
  requireMention?: boolean; /** Emit internal message hooks for mention-skipped topic messages. */
  ingest?: boolean; /** Per-topic override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy; /** If specified, only load these skills for this topic. Omit = all skills; empty = no skills. */
  skills?: string[]; /** If false, disable the bot for this topic. */
  enabled?: boolean; /** Optional allowlist for topic senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>; /** Optional system prompt snippet for this topic. */
  systemPrompt?: string; /** If true, skip automatic voice-note transcription for mention detection in this topic. */
  disableAudioPreflight?: boolean; /** Route this topic to a specific agent (overrides group-level and binding routing). */
  agentId?: string; /** Controls outbound error reporting for this topic. */
  errorPolicy?: "always" | "once" | "silent";
};
type TelegramGroupConfig = {
  requireMention?: boolean; /** Emit internal message hooks for mention-skipped group messages. */
  ingest?: boolean; /** Per-group override for group message policy (open|disabled|allowlist). */
  groupPolicy?: GroupPolicy; /** Optional tool policy overrides for this group. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** If specified, only load these skills for this group (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[]; /** Per-topic configuration (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>; /** If false, disable the bot for this group (and its topics). */
  enabled?: boolean; /** Optional allowlist for group senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>; /** Optional system prompt snippet for this group. */
  systemPrompt?: string; /** If true, skip automatic voice-note transcription for mention detection in this group. */
  disableAudioPreflight?: boolean; /** Controls outbound error reporting for this group. */
  errorPolicy?: "always" | "once" | "silent";
};
/** Config for LLM-based auto-topic labeling. */
type AutoTopicLabelConfig = boolean | {
  enabled?: boolean; /** Custom prompt for LLM-based topic naming. */
  prompt?: string;
};
type TelegramDirectConfig = {
  /** Per-DM override for DM message policy (open|disabled|allowlist). */dmPolicy?: DmPolicy; /** Optional tool policy overrides for this DM. */
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** If specified, only load these skills for this DM (when no topic). Omit = all skills; empty = no skills. */
  skills?: string[]; /** Per-topic configuration for DM topics (key is message_thread_id as string, or "*" for topic defaults). */
  topics?: Record<string, TelegramTopicConfig>; /** If false, disable the bot for this DM (and its topics). */
  enabled?: boolean; /** If true, require messages to be from a topic when topics are enabled. */
  requireTopic?: boolean; /** Optional allowlist for DM senders (numeric Telegram user IDs). */
  allowFrom?: Array<string | number>; /** Optional system prompt snippet for this DM. */
  systemPrompt?: string; /** Controls outbound error reporting for this DM. */
  errorPolicy?: "always" | "once" | "silent"; /** Auto-rename DM forum topics on first message using LLM. Default: true. */
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramConfig = {
  /** Optional per-account Telegram configuration (multi-account). */accounts?: Record<string, TelegramAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string;
} & TelegramAccountConfig;
//#endregion
//#region src/utils/reaction-level.d.ts
/**
 * Shared reaction-level resolver for channel plugins that expose ACK and agent reaction controls.
 * Channel adapters supply defaults/fallbacks; this helper owns the common flag expansion.
 */
/** User-configurable reaction behavior level for channel delivery. */
type ReactionLevel = "off" | "ack" | "minimal" | "extensive";
/** Expanded reaction flags consumed by runtime delivery and prompt guidance. */
type ResolvedReactionLevel = {
  level: ReactionLevel; /** Whether ACK reactions (e.g., 👀 when processing) are enabled. */
  ackEnabled: boolean; /** Whether agent-controlled reactions are enabled. */
  agentReactionsEnabled: boolean; /** Guidance level for agent reactions (minimal = sparse, extensive = liberal). */
  agentReactionGuidance?: "minimal" | "extensive";
};
/** Resolves raw reaction config into ACK and agent-reaction runtime flags. */
declare function resolveReactionLevel(params: {
  value: unknown;
  defaultLevel: ReactionLevel;
  invalidFallback: "ack" | "minimal";
}): ResolvedReactionLevel;
//#endregion
//#region src/config/types.whatsapp.d.ts
type WhatsAppActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean;
  polls?: boolean; /** Enable the experimental requester-bound voice-call tool. Default: false. */
  calls?: boolean;
};
type WhatsAppReactionLevel = ReactionLevel;
type WhatsAppGroupConfig = {
  requireMention?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig; /** Optional system prompt for this group. */
  systemPrompt?: string;
};
type WhatsAppDirectConfig = {
  /** Optional system prompt for this direct chat. */systemPrompt?: string;
};
type WhatsAppAckReactionConfig = {
  /** Emoji to use for acknowledgment (e.g., "👀"). Empty = disabled. */emoji?: string; /** Send reactions in direct chats. Default: true. */
  direct?: boolean;
  /**
   * Send reactions in group chats:
   * - "always": react to all group messages
   * - "mentions": react only when bot is mentioned
   * - "never": never react in groups
   * Default: "mentions"
   */
  group?: "always" | "mentions" | "never";
};
type WhatsAppSharedConfig = CommonChannelMessagingConfig<string[], string> & ChannelReadReceiptConfig & ChannelReactionConfig<never, WhatsAppReactionLevel, WhatsAppAckReactionConfig> & {
  /** Same-phone setup (bot uses your personal WhatsApp number). */selfChatMode?: boolean;
  groups?: Record<string, WhatsAppGroupConfig>; /** Per-direct-chat prompt overrides keyed by user ID or `*` wildcard. */
  direct?: Record<string, WhatsAppDirectConfig>;
};
type WhatsAppSpecificConfig = {
  /** @deprecated Doctor-only legacy input. */messagePrefix?: string;
};
type WhatsAppConfig = Omit<WhatsAppSharedConfig, "name"> & WhatsAppSpecificConfig & {
  /** Optional per-account WhatsApp configuration (multi-account). */accounts?: Record<string, WhatsAppAccountConfig>; /** Optional default account id when multiple accounts are configured. */
  defaultAccount?: string; /** Per-action tool gating. Calls default to false; existing actions default to true. */
  actions?: WhatsAppActionConfig; /** Plugin hook opt-in configuration for privacy-sensitive inbound events. */
  pluginHooks?: {
    /** Enable message_received hooks to broadcast inbound WhatsApp messages to plugins. */messageReceived?: boolean;
  };
};
type WhatsAppAccountConfig = WhatsAppSpecificConfig & WhatsAppSharedConfig & {
  /** Optional display name for this account (used in CLI/UI lists). */name?: string; /** Override auth directory (Baileys multi-file auth state). */
  authDir?: string; /** Plugin hook opt-in configuration for privacy-sensitive inbound events. */
  pluginHooks?: {
    /** Enable message_received hooks to broadcast inbound WhatsApp messages to plugins. */messageReceived?: boolean;
  };
};
//#endregion
//#region src/config/types.channels.d.ts
type ChannelDefaultsConfig = {
  /** @deprecated Doctor-only legacy input. */heartbeat?: ChannelHeartbeatVisibilityConfig; /** Default group-chat admission policy inherited by channels that support groups. */
  groupPolicy?: GroupPolicy; /** Default history/context visibility inherited by channel configs. */
  contextVisibility?: ContextVisibilityMode; /** Default heartbeat visibility for all channels. */
  heartbeatVisibility?: ChannelHeartbeatVisibilityConfig; /** Default pair loop guard settings for channels that support bot loop protection. */
  botLoopProtection?: ChannelBotLoopProtectionConfig; /** Default implicit-mention policy inherited by supporting channels. */
  implicitMentions?: ChannelImplicitMentionsConfig;
};
/** Provider/channel/target model override map used by channel dispatch. Keys are channel-specific group IDs, thread IDs, channel names, or DM peer identifiers (see docs/gateway/config-channels.md). */
type ChannelModelByChannelConfig = Record<string, Record<string, string>>;
/** JSON-compatible open-world channel section for plugin ids unknown to core. */
type OpenWorldChannelConfig = ReturnType<typeof JSON.parse>;
/**
 * Base type for extension channel config sections.
 * Extensions can use this as a starting point for their channel config.
 */
interface ChannelsConfig {
  /** Shared defaults inherited by channel sections unless they override them. */
  defaults?: ChannelDefaultsConfig;
  /** Map provider -> channel id / DM peer id -> model override. See docs/gateway/config-channels.md for supported key forms. */
  modelByChannel?: ChannelModelByChannelConfig;
  discord?: DiscordConfig;
  googlechat?: GoogleChatConfig;
  imessage?: IMessageConfig;
  irc?: IrcConfig;
  msteams?: MSTeamsConfig;
  signal?: SignalConfig;
  slack?: SlackConfig;
  telegram?: TelegramConfig;
  whatsapp?: WhatsAppConfig;
  /**
   * Channel sections are plugin-owned and keyed by arbitrary channel ids.
   * Open-world config keeps SDK/plugin-owned sections ergonomic for dynamic ids.
   */
  [key: string]: OpenWorldChannelConfig;
}
//#endregion
export { SsrFPolicyConfig as $, DiscordExecApprovalConfig as A, ResolvedTtsPersona as B, ChannelImplicitMentionsConfig as C, DiscordActionConfig as D, DiscordAccountConfig as E, ChannelBotLoopProtectionConfig as F, TtsPersonaConfig as G, TtsConfig as H, ApprovalsConfig as I, AgentToolsConfig as J, TtsPersonaFallbackPolicy as K, ExecApprovalForwardTarget as L, DiscordGuildEntry as M, DiscordIntentsConfig as N, DiscordAutoPresenceConfig as O, DiscordSlashCommandConfig as P, ToolsConfig as Q, ExecApprovalForwardingConfig as R, MSTeamsTeamConfig as S, GoogleChatConfig as T, TtsMode as U, TtsAutoMode as V, TtsModelOverrideConfig as W, GroupToolPolicyConfig as X, GroupToolPolicyBySenderConfig as Y, ToolLoopDetectionConfig as Z, SignalReactionNotificationMode as _, TelegramAccountConfig as a, DmConfig as at, MSTeamsConfig as b, TelegramExecApprovalConfig as c, MentionPatternsPolicyConfig as ct, TelegramNetworkConfig as d, QueueMode as dt, ConfiguredModelProviderRequest as et, TelegramTopicConfig as f, AgentModelConfig as ft, SlackSlashCommandConfig as g, SandboxDockerSettings as gt, SlackReactionNotificationMode as h, AgentToolModelConfig as ht, resolveReactionLevel as i, CommandsConfig as it, DiscordGuildChannelConfig as j, DiscordConfig as k, TelegramGroupConfig as l, MessagesConfig as lt, SlackChannelConfig as m, AgentSandboxConfig as mt, ReactionLevel as n, SafeBinProfileFixture as nt, TelegramActionConfig as o, GroupChatConfig as ot, SlackAccountConfig as p, AgentRuntimePolicyConfig as pt, TtsProvider as q, ResolvedReactionLevel as r, BroadcastConfig as rt, TelegramDirectConfig as s, MentionPatternsMode as st, ChannelsConfig as t, SafeBinProfile as tt, TelegramInlineButtonsScope as u, NativeCommandsSetting as ut, MSTeamsChannelConfig as v, GoogleChatAccountConfig as w, MSTeamsReplyStyle as x, MSTeamsCloudName as y, ExecApprovalForwardingMode as z };