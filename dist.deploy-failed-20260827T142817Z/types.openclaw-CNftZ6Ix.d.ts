import { i as SecretsConfig, n as SecretRef, t as SecretInput } from "./types.secrets-G6HDh4-9.js";
import { d as ConfiguredProviderRequest, f as AgentModelConfig, h as AgentToolModelConfig, l as ModelsConfig, m as AgentSandboxConfig, p as AgentRuntimePolicyConfig } from "./types.models-Dfmf90bZ.js";
import { n as MemoryExtraPath } from "./types-DjvKORHD.js";
import { t as ProxyConfig } from "./zod-schema.proxy-DEEqhaxa.js";
import { Static, Type } from "typebox";

//#region src/channels/chat-type.d.ts
/**
 * Normalized conversation kind shared by channel routing, sessions, and SDK helpers.
 */
type ChatType = "direct" | "group" | "channel";
//#endregion
//#region src/config/types.base.d.ts
/** Typing indicator timing policy shared by channel configs. */
type TypingMode = "never" | "instant" | "thinking" | "message";
/** Session-key ownership model for inbound messages. */
type SessionScope = "per-sender" | "global";
/** DM session-key granularity across peers, channels, and accounts. */
type DmScope = "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
/** Which source messages outbound replies should thread or quote against. */
type ReplyToMode = "off" | "first" | "all" | "batched";
/** Group-chat admission policy for channels with allowlists. */
type GroupPolicy = "open" | "disabled" | "allowlist";
/** Direct-message admission policy for channels with pairing/allowlists. */
type DmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/** How much non-allowlisted context is visible to an agent. */
type ContextVisibilityMode = "all" | "allowlist" | "allowlist_quote";
/** Text splitting strategy for outbound channel delivery. */
type TextChunkMode = "length" | "newline";
/** Preview/progress delivery mode while an agent response is still streaming. */
type StreamingMode = "off" | "partial" | "block" | "progress";
/** How command text is represented in streaming progress previews. */
type ChannelStreamingCommandTextMode = "raw" | "status";
type BlockStreamingCoalesceConfig = {
  /** Minimum buffered characters before coalesced block delivery. */minChars?: number; /** Maximum buffered characters before a block must be flushed. */
  maxChars?: number; /** Idle time in ms before flushing a partial coalesced block. */
  idleMs?: number;
};
type BlockStreamingChunkConfig = {
  /** Minimum preview chunk size before sending another draft update. */minChars?: number; /** Maximum preview chunk size before forcing a draft update. */
  maxChars?: number; /** Preferred natural boundary when splitting preview chunks. */
  breakPreference?: "paragraph" | "newline" | "sentence";
};
type ChannelStreamingProgressConfig = {
  /** Initial progress title. "auto" picks from labels; false hides the title. Default: "auto". */label?: string | false; /** Candidate labels for label="auto". Defaults to OpenClaw's built-in progress labels. */
  labels?: string[]; /** Maximum number of progress lines to keep below the label. Default: 8. */
  maxLines?: number; /** Maximum characters per compact progress line before truncation. Default: 120. */
  maxLineChars?: number; /** Include compact tool/task progress in the draft. Default: true. */
  toolProgress?: boolean; /** Command/exec progress detail in the draft. "raw" opts into command text; "status" shows only the tool label. Default: "status". */
  commandText?: ChannelStreamingCommandTextMode; /** Include assistant commentary/preamble text in the progress draft. Default: false. */
  commentary?: boolean;
  /**
   * Replace tool lines with a short utility-model narration of what the agent
   * is doing. Runs when a utility model resolves (explicit `utilityModel` or
   * the primary provider's declared default). Default: true.
   */
  narration?: boolean;
};
type ChannelStreamingPreviewConfig = {
  /** Chunking thresholds for preview-draft updates while streaming. */chunk?: BlockStreamingChunkConfig;
  /**
   * Render live tool/activity updates into the preview draft for channels that
   * edit a single preview message in place.
   * Default: true.
   */
  toolProgress?: boolean; /** Command/exec progress detail in the preview. "raw" opts into command text; "status" shows only the tool label. Default: "status". */
  commandText?: ChannelStreamingCommandTextMode;
};
type ChannelStreamingBlockConfig = {
  /** Enable chunked block-reply delivery for channels that support it. */enabled?: boolean; /** Merge streamed block replies before sending. */
  coalesce?: BlockStreamingCoalesceConfig;
};
type ChannelStreamingConfig<TProgress extends ChannelStreamingProgressConfig = ChannelStreamingProgressConfig> = {
  /**
   * Preview streaming mode:
   * - "off": disable preview updates
   * - "partial": update one preview in place
   * - "block": emit larger chunked preview updates
   * - "progress": progress/status preview mode for channels that support it
   */
  mode?: StreamingMode; /** Chunking mode for outbound text delivery. */
  chunkMode?: TextChunkMode; /** Prefer a channel's native streaming transport over its portable draft path. */
  nativeTransport?: boolean;
  preview?: ChannelStreamingPreviewConfig;
  progress?: TProgress;
  block?: ChannelStreamingBlockConfig;
};
type ChannelDeliveryStreamingConfig = Pick<ChannelStreamingConfig, "chunkMode" | "block">;
/** Streaming subset used by channels that render visible preview/progress replies. */
type ChannelPreviewStreamingConfig = Pick<ChannelStreamingConfig, "mode" | "chunkMode" | "preview" | "progress" | "block">;
type MarkdownTableMode = "off" | "bullets" | "code" | "block";
type MarkdownConfig = {
  /** Table rendering mode (off|bullets|code|block). */tables?: MarkdownTableMode;
};
type HumanDelayConfig = {
  /** Delay style for block replies (off|natural|custom). */mode?: "off" | "natural" | "custom"; /** Minimum delay in milliseconds (default: 800). */
  minMs?: number; /** Maximum delay in milliseconds (default: 2500). */
  maxMs?: number;
};
type SessionSendPolicyAction = "allow" | "deny";
type SessionSendPolicyMatch = {
  /** Channel/provider id match. */channel?: string; /** Direct/group/thread classification when the caller has channel metadata. */
  chatType?: ChatType;
  /**
   * Session key prefix match.
   * Note: some consumers match against a normalized key (for example, stripping `agent:<id>:`).
   */
  keyPrefix?: string; /** Optional raw session-key prefix match for consumers that normalize session keys. */
  rawKeyPrefix?: string;
};
type SessionSendPolicyRule = {
  /** Action applied when match criteria select this rule. */action: SessionSendPolicyAction; /** Optional match filter; omitted match behaves as a catch-all rule. */
  match?: SessionSendPolicyMatch;
};
type SessionSendPolicyConfig = {
  /** Fallback action when no send-policy rule matches. */default?: SessionSendPolicyAction; /** Ordered allow/deny rules; first matching rule wins. */
  rules?: SessionSendPolicyRule[];
};
type SessionResetMode = "none" | "daily" | "idle";
type SessionResetConfig = {
  mode?: SessionResetMode; /** Local hour (0-23) for the daily reset boundary. */
  atHour?: number; /** Sliding idle window (minutes). When set with daily mode, whichever expires first wins. */
  idleMinutes?: number;
};
type SessionResetByTypeConfig = {
  direct?: SessionResetConfig;
  group?: SessionResetConfig;
  thread?: SessionResetConfig;
};
type SessionThreadBindingsConfig = {
  /**
   * Master switch for thread-bound session routing features.
   * Channel/provider keys can override this default.
   */
  enabled?: boolean;
  /**
   * Inactivity window for thread-bound sessions (hours).
   * Session auto-unfocuses after this amount of idle time. Set to 0 to disable. Default: 24.
   */
  idleHours?: number;
  /**
   * Optional hard max age for thread-bound sessions (hours).
   * Session auto-unfocuses once this age is reached even if active. Set to 0 to disable. Default: 0.
   */
  maxAgeHours?: number;
  /**
   * Allow channel integrations to create thread-bound work sessions from
   * sessions_spawn or native ACP spawn flows. Channel/account keys can override.
   * Default: true when thread bindings are enabled.
   */
  spawnSessions?: boolean;
  /**
   * Default context mode for native subagents spawned into a bound thread.
   * Default: "fork" so the child starts from the requester transcript.
   */
  defaultSpawnContext?: "isolated" | "fork";
};
type SessionSharingConfig = {
  /** Allow owners/admins to set sessions read-only. Default: true. */readOnly?: boolean; /** Allow owners/admins to select suggest mode. Default: true. */
  suggest?: boolean; /** Allow owners/admins to hide draft sessions from other operators. Default: true. */
  drafts?: boolean;
};
type SessionConfig = {
  scope?: SessionScope; /** DM session scoping (default: "main"). */
  dmScope?: DmScope; /** Map platform-prefixed identities (e.g. "telegram:123") to canonical DM peers. */
  identityLinks?: Record<string, string[]>;
  resetTriggers?: string[];
  reset?: SessionResetConfig;
  resetByType?: SessionResetByTypeConfig; /** Channel-specific reset overrides (e.g. { discord: { mode: "idle", idleMinutes: 10080 } }). */
  resetByChannel?: Record<string, SessionResetConfig>;
  store?: string;
  mainKey?: string;
  sendPolicy?: SessionSendPolicyConfig; /** Shared defaults for thread-bound session routing across channels/providers. */
  threadBindings?: SessionThreadBindingsConfig; /** Collaboration modes owners and administrators may select. */
  sharing?: SessionSharingConfig; /** Automatic session store maintenance (pruning, capping, archive retention, disk budget). */
  maintenance?: SessionMaintenanceConfig; /** Bounded channel-session rotation and shared-main ceiling. Absent → feature off. */
  rotation?: SessionRotationConfig;
};
/** Bounded channel-peer rotation and context-ceiling triggers (absent → off). */
type SessionRotationConfig = {
  /** Rotate a channel-peer session after this many admission-bumped turns. */maxTurns?: number; /** Rotate a channel-peer session after this many hours since the base session started. */
  maxAgeHours?: number; /** Hard token ceiling for non-rotatable (protected/main) sessions forcing compaction. */
  ceilingTokens?: number; /** Target context size below the ceiling a forced ceiling compaction settles toward. */
  progressFloorTokens?: number;
};
type SessionMaintenanceMode = "enforce" | "warn";
/** Session-store cleanup policy for transcript count, age, archives, and disk budget. */
type SessionMaintenanceConfig = {
  /** Whether to enforce maintenance or warn only. Default: "enforce". */mode?: SessionMaintenanceMode; /** Remove session entries older than this duration (e.g. "30d", "12h"). Default: "30d". */
  pruneAfter?: string | number; /** Maximum total session entries to keep when protection permits. Default: 500. */
  maxEntries?: number;
  /**
   * Age-based retention for archived transcripts (`*.reset.<timestamp>` and
   * `*.deleted.<timestamp>`). Default and `false`: keep archives until the
   * disk budget evicts them oldest-first; a duration opts into deletion.
   */
  resetArchiveRetention?: string | number | false;
  /**
   * Per-agent sessions-directory disk budget (e.g. "500mb"). Default: "10gb".
   * When exceeded, warn (mode=warn) or enforce oldest-first cleanup
   * (mode=enforce). Set `false`, `0`, or `"0"` to disable the budget entirely.
   */
  maxDiskBytes?: number | string | false;
  /**
   * Target size after disk-budget cleanup (high-water mark), e.g. "400mb".
   * Default: 80% of maxDiskBytes. A value that resolves to zero falls back to
   * the default instead of clearing history; negative values are invalid.
   */
  highWaterBytes?: number | string;
};
type LoggingConfig = {
  level?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  file?: string; /** Maximum size of a single log file in bytes before rotation. Default: 100 MB. */
  maxFileBytes?: number;
  consoleLevel?: "silent" | "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  consoleStyle?: "pretty" | "json";
  /** Redact sensitive tokens in log sinks and persisted transcript text. Default: "tools". Safety-boundary UI/tool/diagnostic payloads may still redact when this is "off". */
  /** Regex patterns used to redact sensitive tokens from logs and transcripts. */
  redactPatterns?: string[]; /** Metadata-only agent activity audit ledger settings. */
  audit?: AuditConfig;
};
type DiagnosticsOtelConfig = {
  enabled?: boolean;
  endpoint?: string;
  tracesEndpoint?: string;
  metricsEndpoint?: string;
  logsEndpoint?: string;
  protocol?: "http/protobuf";
  headers?: Record<string, string>;
  serviceName?: string; /** Replacement prefix for OpenClaw-owned metric names. Empty removes the prefix; defaults to "openclaw.". */
  metricNamePrefix?: string;
  traces?: boolean;
  metrics?: boolean;
  logs?: boolean; /** Log export sink: OTLP by default, stdout JSONL, or both. */
  logsExporter?: "otlp" | "stdout" | "both"; /** Trace sample rate (0.0 - 1.0). */
  sampleRate?: number; /** Metric export interval (ms). */
  flushIntervalMs?: number; /** Opt in to raw non-system message/tool content in OTEL span attributes. */
  captureContent?: boolean;
};
type DiagnosticsCacheTraceConfig = {
  /** Write prompt-cache trace artifacts for debugging deterministic cache input. */enabled?: boolean;
};
type AuditConfig = {
  /**
   * Record metadata-only run, tool, and enabled message lifecycle events into
   * the shared state database. Content is never stored. Default: true. This is
   * startup-scoped; disabling stops new event inserts after restart while retained
   * records stay readable until they expire.
   */
  enabled?: boolean;
  /**
   * Retain bounded execution-identity attribution for exact-run inspection.
   * Default: false. Requires the audit ledger and takes effect after Gateway restart.
   */
  executionIdentity?: boolean;
  /**
   * Record content-free message lifecycle metadata. `direct` records only
   * known direct conversations; `all` also records group, channel, and
   * unknown conversation kinds. Default: `off`.
   */
  messages?: "off" | "direct" | "all";
};
type DiagnosticsConfig = {
  enabled?: boolean; /** Optional ad-hoc diagnostics flags (e.g. "telegram.http"). */
  flags?: string[];
  otel?: DiagnosticsOtelConfig;
  cacheTrace?: DiagnosticsCacheTraceConfig;
};
type AgentElevatedAllowFromConfig = Partial<Record<string, Array<string | number>>>;
type IdentityConfig = {
  name?: string;
  theme?: string;
  emoji?: string; /** Avatar image: workspace-relative path, http(s) URL, or data URI. */
  avatar?: string;
};
//#endregion
//#region src/infra/exec-safe-bin-policy-profiles.d.ts
type SafeBinProfileFixture = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: readonly string[];
  deniedFlags?: readonly string[];
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
//#region src/config/types.memory.d.ts
/** Citation rendering mode for memory-injected context. */
type MemoryCitationsMode = "auto" | "on" | "off";
/** Top-level memory config block. */
type MemoryConfig = {
  citations?: MemoryCitationsMode; /** Shared embedding/search defaults. Per-agent overrides live under agents.entries.*.memory.search. */
  search?: MemorySearchConfig;
};
type MemorySearchConfig = {
  /** Enable vector memory search (default: true). */enabled?: boolean; /** Use relevant context from this agent's other private conversations. */
  rememberAcrossConversations?: boolean; /** Sources to index and search (default: ["memory"]). */
  sources?: Array<"memory" | "sessions">; /** Extra paths to include in memory search, optionally filtered by a glob. */
  extraPaths?: MemoryExtraPath[]; /** Optional multimodal file indexing for selected extra paths. */
  multimodal?: {
    /** Enable image/audio embeddings from extraPaths. */enabled?: boolean; /** Which non-text file types to index. */
    modalities?: Array<"image" | "audio" | "all">; /** Max bytes allowed per multimodal file before it is skipped. */
    maxFileBytes?: number;
  }; /** Experimental session transcript indexing. */
  experimental?: {
    sessionMemory?: boolean;
  }; /** Memory embedding provider adapter id. */
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
    batch?: {
      /** Enable batch API for embedding indexing (OpenAI/Gemini; default: true). */enabled?: boolean;
    };
  }; /** Fallback memory embedding provider adapter id when embeddings fail. */
  fallback?: string; /** Embedding model id (remote) or alias (local). */
  model?: string; /** Optional provider-specific embedding input_type for query and document requests. */
  inputType?: string; /** Optional provider-specific embedding input_type for query-time memory search. */
  queryInputType?: string; /** Optional provider-specific embedding input_type for document/index embeddings. */
  documentInputType?: string;
  /**
   * Gemini embedding-2 models only: output vector dimensions.
   * Supported values today are 768, 1536, and 3072.
   */
  outputDimensionality?: number; /** Local embedding settings for the managed llama.cpp server. */
  local?: {
    /** GGUF model path or hf: URI. */modelPath?: string;
  }; /** Index storage configuration. */
  store?: {
    fts?: {
      /** FTS5 tokenizer (default: "unicode61"). Use "trigram" for CJK text support. */tokenizer?: "unicode61" | "trigram";
    };
    vector?: {
      /** Enable the sqlite-vec semantic index (default: true). */enabled?: boolean; /** Optional override path to sqlite-vec extension (.dylib/.so/.dll). */
      extensionPath?: string;
    };
    cache?: {
      /** Enable embedding cache (default: true). */enabled?: boolean; /** Optional max cache entries per provider/model. */
      maxEntries?: number;
    };
  }; /** Query behavior. */
  query?: {
    maxResults?: number;
    minScore?: number;
  }; /** Index cache behavior. */
  cache?: {
    /** Cache chunk embeddings in SQLite (default: true). */enabled?: boolean;
  };
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
//#region src/shared/silent-reply-policy.d.ts
type SilentReplyPolicy = "allow" | "disallow";
type SilentReplyConversationType = "direct" | "group" | "internal";
type SilentReplyPolicyShape = Partial<Record<Exclude<SilentReplyConversationType, "direct">, SilentReplyPolicy>>;
//#endregion
//#region src/transcripts/config.d.ts
/**
 * Configuration normalization for transcript capture/import.
 *
 * Raw config can contain optional auto-start provider locators; resolution
 * returns bounded defaults and drops malformed entries before runtime startup.
 */
/** Raw auto-start transcript source entry from config. */
type TranscriptsAutoStartConfig = {
  providerId: string;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};
/** Normalized auto-start source entry consumed by transcript runtime code. */
type ResolvedTranscriptsAutoStartConfig = {
  providerId: string;
  sessionId?: string;
  title?: string;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
};
/** Raw transcripts config block. */
type TranscriptsConfig = {
  enabled?: boolean;
  autoStart?: TranscriptsAutoStartConfig[];
};
/** Resolved transcripts config with defaults applied. */
type ResolvedTranscriptsConfig = {
  enabled: boolean;
  maxUtterances: number;
  autoStart: ResolvedTranscriptsAutoStartConfig[];
};
/** Normalize raw transcripts config into runtime settings. */
declare function resolveTranscriptsConfig(raw: unknown): ResolvedTranscriptsConfig;
//#endregion
//#region src/config/includes.d.ts
type ConfigIncludeOwnership = {
  path: readonly string[];
  kind: "single" | "multiple";
  hasSiblingOverrides: boolean;
  targetPath?: string;
  targetPaths?: readonly string[];
};
//#endregion
//#region src/config/types.access-groups.d.ts
type DiscordChannelAudienceAccessGroup = {
  /**
   * Discord dynamic audience backed by the users who can currently view a guild
   * channel.
   */
  type: "discord.channelAudience"; /** Guild ID that owns the channel. */
  guildId: string; /** Channel ID whose effective ViewChannel permission defines the audience. */
  channelId: string; /** Audience predicate. Defaults to canViewChannel. */
  membership?: "canViewChannel";
};
type MessageSendersAccessGroup = {
  /**
   * Static sender allowlists that can be referenced by any message channel via
   * accessGroup:<name>.
   */
  type: "message.senders"; /** Sender entries by channel id, plus optional "*" entries shared by all channels. */
  members: Record<string, string[]>;
};
type AccessGroupConfig = DiscordChannelAudienceAccessGroup | MessageSendersAccessGroup;
type AccessGroupsConfig = Record<string, AccessGroupConfig>;
//#endregion
//#region packages/acp-core/src/runtime/types.d.ts
type AcpRuntimePromptMode = "prompt" | "steer";
type AcpRuntimeSessionMode = "persistent" | "oneshot";
/** Runtime update tags emitted by ACP adapters; unknown backend tags are passed through. */
type AcpSessionUpdateTag = "agent_message_chunk" | "agent_thought_chunk" | "tool_call" | "tool_call_update" | "usage_update" | "available_commands_update" | "current_mode_update" | "config_option_update" | "session_info_update" | "plan" | (string & {});
type AcpRuntimeControl = "session/set_mode" | "session/set_config_option" | "session/status";
/** Stable handle returned by ensureSession and passed back into all ACP runtime operations. */
type AcpRuntimeHandle = {
  sessionKey: string;
  backend: string;
  runtimeSessionName: string; /** Effective runtime working directory for this ACP session, if exposed by adapter/runtime. */
  cwd?: string; /** Backend-local record identifier, if exposed by adapter/runtime (for example acpx record id). */
  acpxRecordId?: string; /** Backend-level ACP session identifier, if exposed by adapter/runtime. */
  backendSessionId?: string; /** Upstream harness session identifier, if exposed by adapter/runtime. */
  agentSessionId?: string;
  /**
   * Effective model the backend applied during session creation, when it can differ from the
   * requested model. A backend that drops an unsupported inherited default reports `dropped` so
   * the manager omits that model from persisted runtime controls instead of replaying a rejected
   * model before the first turn. Absent when the backend did not deviate from the request.
   */
  appliedModel?: {
    kind: "applied";
    model: string;
  } | {
    kind: "dropped";
  };
};
type AcpRuntimeEnsureInput = {
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode; /** Backend or agent session id to resume when reopening an existing conversation. */
  resumeSessionId?: string; /** Optional runtime model override that must be available during session creation. */
  model?: string;
  /**
   * Whether `model` was an explicit caller selection rather than an inherited default. A backend
   * that cannot honor an explicit unsupported model must fail closed; an unsupported inherited
   * default may be dropped so the backend starts on its own default.
   */
  modelExplicit?: boolean; /** Optional runtime thinking/reasoning override that must be available during session creation. */
  thinking?: string;
  cwd?: string;
  env?: Record<string, string>;
};
type AcpRuntimeTurnAttachment = {
  mediaType: string;
  data: string;
};
/** Per-turn payload delivered to ACP adapters. */
type AcpRuntimeTurnInput = {
  handle: AcpRuntimeHandle;
  text: string;
  attachments?: AcpRuntimeTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
};
type AcpRuntimeCapabilities = {
  controls: AcpRuntimeControl[];
  /**
   * Optional backend-advertised option keys for session/set_config_option.
   * Empty/undefined means "backend accepts keys, but did not advertise a strict list".
   */
  configOptionKeys?: string[];
};
type AcpRuntimeStatus = {
  summary?: string; /** Backend-local record identifier, if exposed by adapter/runtime. */
  acpxRecordId?: string; /** Backend-level ACP session identifier, if known at status time. */
  backendSessionId?: string; /** Upstream harness session identifier, if known at status time. */
  agentSessionId?: string;
  details?: Record<string, unknown>;
};
type AcpRuntimeDoctorReport = {
  ok: boolean;
  code?: string;
  message: string;
  installCommand?: string;
  details?: string[];
};
/** Streaming event union produced by ACP adapters while a turn is running. */
type AcpRuntimeEvent = {
  type: "text_delta";
  text: string;
  stream?: "output" | "thought";
  tag?: AcpSessionUpdateTag;
} | {
  type: "status";
  text: string;
  tag?: AcpSessionUpdateTag;
  used?: number;
  size?: number;
} | {
  type: "tool_call";
  text: string;
  tag?: AcpSessionUpdateTag;
  toolCallId?: string;
  status?: string;
  title?: string;
  kind?: "read" | "edit" | "delete" | "move" | "search" | "execute" | "fetch" | "switch_mode" | "think" | "other";
} | {
  type: "done"; /** Closed result status when the manager synthesizes the terminal event. */
  status?: "completed" | "cancelled";
  stopReason?: string;
} | {
  type: "error";
  message: string;
  code?: string;
  detailCode?: string;
  retryable?: boolean;
};
type AcpRuntimeTurnResultError = {
  message: string;
  code?: string;
  detailCode?: string;
  retryable?: boolean;
};
/** Terminal turn result, separated from the live event stream for reliable failure handling. */
type AcpRuntimeTurnResult = {
  status: "completed";
  stopReason?: string;
} | {
  status: "cancelled";
  stopReason?: string;
} | {
  status: "failed";
  error: AcpRuntimeTurnResultError;
};
interface AcpRuntimeTurn {
  readonly requestId: string;
  readonly events: AsyncIterable<AcpRuntimeEvent>;
  readonly result: Promise<AcpRuntimeTurnResult>;
  /** Requests backend cancellation while keeping result/error reporting adapter-owned. */
  cancel(input?: {
    reason?: string;
  }): Promise<void>;
  /** Closes the event stream when the caller stops listening before terminal result. */
  closeStream(input?: {
    reason?: string;
  }): Promise<void>;
}
/** ACP adapter contract implemented by backend plugins and consumed by gateway/session flows. */
interface AcpRuntime {
  ensureSession(input: AcpRuntimeEnsureInput): Promise<AcpRuntimeHandle>;
  /**
   * Preferred turn API. Live events are streamed separately from the terminal
   * result so adapters can report failures without relying on legacy done/error
   * events in the stream.
   */
  startTurn?(input: AcpRuntimeTurnInput): AcpRuntimeTurn;
  runTurn(input: AcpRuntimeTurnInput): AsyncIterable<AcpRuntimeEvent>;
  getCapabilities?(input: {
    handle?: AcpRuntimeHandle;
  }): Promise<AcpRuntimeCapabilities> | AcpRuntimeCapabilities;
  getStatus?(input: {
    handle: AcpRuntimeHandle;
    signal?: AbortSignal;
  }): Promise<AcpRuntimeStatus>;
  setMode?(input: {
    handle: AcpRuntimeHandle;
    mode: string;
  }): Promise<void>;
  setConfigOption?(input: {
    handle: AcpRuntimeHandle;
    key: string;
    value: string;
  }): Promise<void>;
  doctor?(): Promise<AcpRuntimeDoctorReport>;
  /**
   * Prepare the next ensureSession for this session key to start fresh instead
   * of reopening backend-owned persistent state.
   */
  prepareFreshSession?(input: {
    sessionKey: string;
  }): Promise<void>;
  cancel(input: {
    handle: AcpRuntimeHandle;
    reason?: string;
  }): Promise<void>;
  close(input: {
    handle: AcpRuntimeHandle;
    reason: string;
    /**
     * Discard backend-owned persistent session state so the next ensureSession
     * starts fresh instead of reopening the same conversation.
     */
    discardPersistentState?: boolean;
  }): Promise<void>;
}
//#endregion
//#region src/config/types.acp.d.ts
type AcpDispatchConfig = {
  /** Master switch for ACP turn dispatch in the reply pipeline. */enabled?: boolean;
};
type AcpStreamConfig = {
  /** Suppresses repeated ACP status/tool projection lines within a turn. */repeatSuppression?: boolean; /** Live streams chunks or waits for terminal event before delivery. */
  deliveryMode?: "live" | "final_only";
  /**
   * Per-sessionUpdate visibility overrides.
   * Keys not listed here fall back to OpenClaw defaults.
   */
  tagVisibility?: Partial<Record<AcpSessionUpdateTag, boolean>>;
};
type AcpRuntimeConfig = {
  /** Optional operator install/setup command shown by `/acp install` and `/acp doctor`. */installCommand?: string;
};
type AcpConfig = {
  /** Global ACP runtime gate. */enabled?: boolean;
  dispatch?: AcpDispatchConfig; /** Backend id registered by ACP runtime plugin (for example: acpx). */
  backend?: string; /** Fallback backend ids tried when the primary backend fails with UNAVAILABLE. */
  fallbacks?: string[];
  defaultAgent?: string;
  allowedAgents?: string[];
  stream?: AcpStreamConfig;
  runtime?: AcpRuntimeConfig;
};
//#endregion
//#region packages/normalization-core/src/string-coerce.d.ts
/** Trims string input and returns undefined for non-strings or empty strings. */
declare function normalizeOptionalString(value: unknown): string | undefined;
type FastMode = boolean | "auto";
//#endregion
//#region src/config/types.agent-defaults.d.ts
/** Workspace bootstrap-file injection policy for agent system prompts. */
type AgentContextInjection = "always" | "continuation-skip" | "never";
/**
 * Optional bootstrap files that setup can skip while still creating required
 * agent files. "HEARTBEAT.md" stays accepted as legacy config input even
 * though workspace setup no longer writes it.
 */
type OptionalBootstrapFileName = "SOUL.md" | "USER.md" | "HEARTBEAT.md" | "IDENTITY.md";
/** Embedded runner behavior contract used by strict-agentic provider flows. */
type EmbeddedAgentExecutionContract = "default" | "strict-agentic";
/** Prompt-only default for how strongly agents should delegate to sub-agents. */
type SubagentDelegationMode = "suggest" | "prefer";
/** Image compression/detail preference used before sending image inputs to models. */
type AgentImageQualityPreference = "auto" | "efficient" | "balanced" | "high";
/** Canonical thinking levels accepted by agent defaults and compaction overrides. */
type AgentThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type AgentModelEntryConfig = {
  /** Optional display/lookup alias for this provider/model entry. */alias?: string; /** Provider-specific API parameters (e.g., GLM-4.7 thinking mode). */
  params?: Record<string, unknown>; /** Optional agent execution runtime for this specific provider/model entry. */
  agentRuntime?: AgentRuntimePolicyConfig; /** Enable streaming for this model (default: true, false for Ollama to avoid SDK issue #1205). */
  streaming?: boolean;
};
type AgentModelPolicyConfig = {
  /** Model refs allowed for session/run overrides. Empty or omitted allows any model. */allow?: string[];
};
type AgentContextPruningConfig = {
  /** Pruning mode for old tool results in model context. */mode?: "off" | "cache-ttl"; /** TTL to consider cache expired (duration string, default unit: minutes). */
  ttl?: string;
  tools?: {
    /** Tool names eligible for context pruning. */allow?: string[]; /** Tool names excluded from context pruning. */
    deny?: string[];
  };
  hardClear?: {
    /** Replace oversized old tool results with a placeholder at high pressure. */enabled?: boolean; /** Placeholder text inserted when a tool result is hard-cleared. */
    placeholder?: string;
  };
};
type AgentStartupContextConfig = {
  /** Enable runtime-owned startup-context prelude on bare session resets (default: true). */enabled?: boolean; /** Which bare reset commands should receive startup context (default: ["new", "reset"]). */
  applyOn?: Array<"new" | "reset">; /** How many dated memory files to load counting backward from today (default: 2). */
  dailyMemoryDays?: number; /** Max bytes to read from each daily memory file before skipping (default: 16384). */
  maxFileBytes?: number; /** Max characters retained from each daily memory file (default: 1200). */
  maxFileChars?: number; /** Max total characters retained across the startup prelude (default: 2800). */
  maxTotalChars?: number;
};
type AgentContextLimitsConfig = {
  /** Default max chars returned by memory_get before truncation metadata/notice (default: 12000). */memoryGetMaxChars?: number; /** Max chars retained from post-compaction AGENTS.md context injection (default: 1800). */
  postCompactionMaxChars?: number;
};
type AgentDefaultsConfig = {
  /** @deprecated Doctor-only legacy input. */imageGenerationModel?: AgentToolModelConfig; /** @deprecated Doctor-only legacy input. */
  videoGenerationModel?: AgentToolModelConfig; /** @deprecated Doctor-only legacy input. */
  musicGenerationModel?: AgentToolModelConfig; /** @deprecated Doctor-only legacy input. */
  envelopeTimezone?: string; /** @deprecated Doctor-only legacy input. */
  envelopeTimestamp?: "on" | "off"; /** @deprecated Doctor-only legacy input. */
  envelopeElapsed?: "on" | "off"; /** @deprecated Doctor-only legacy input. */
  timeFormat?: "auto" | "12" | "24"; /** @deprecated Doctor-only legacy input. */
  promptOverlays?: {
    gpt5?: {
      personality?: "friendly" | "on" | "off";
    };
  }; /** Global default provider params applied to all models before per-model and per-agent overrides. */
  params?: Record<string, unknown>; /** Primary model and fallbacks (provider/model). Accepts string or {primary,fallbacks}. */
  model?: AgentModelConfig; /** Optional lower-cost model for short internal tasks such as generated session titles. */
  utilityModel?: string;
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentRuntimePolicyConfig; /** Optional image-capable model and fallbacks (provider/model). Accepts string or {primary,fallbacks}. */
  imageModel?: AgentToolModelConfig; /** Media-generation model preferences by output modality. */
  mediaModels?: {
    image?: AgentToolModelConfig;
    video?: AgentToolModelConfig;
    music?: AgentToolModelConfig;
  }; /** Optional voice model and fallbacks (provider/model) for TTS/STT/realtime voice providers. */
  voiceModel?: AgentToolModelConfig; /** Optional PDF-capable model and fallbacks (provider/model). Accepts string or {primary,fallbacks}. */
  pdfModel?: AgentToolModelConfig; /** Maximum PDF file size in megabytes (default: 10). */
  pdfMaxMb?: number; /** Maximum number of PDF pages to process (default: 20). */
  pdfMaxPages?: number; /** Model catalog with optional aliases (full provider/model keys). */
  models?: Record<string, AgentModelEntryConfig>; /** Explicit model override policy. Empty or omitted allow permits any model. */
  modelPolicy?: AgentModelPolicyConfig; /** Agent working directory (preferred). Used as the default cwd for agent runs. */
  workspace?: string; /** Optional default allowlist of skills for agents that do not set agents.entries.*.skills. */
  skills?: string[]; /** Silent-reply policy by conversation type. */
  silentReply?: SilentReplyPolicyShape; /** Optional repository root for system prompt runtime line (overrides auto-detect). */
  repoRoot?: string;
  /** Provider-independent prompt overlays applied by model family. */
  /** Skip bootstrap (BOOTSTRAP.md creation, etc.) for pre-configured deployments. */
  skipBootstrap?: boolean;
  /**
   * List of optional bootstrap filenames to skip writing to the workspace root.
   * Applies to: SOUL.md, USER.md, IDENTITY.md ("HEARTBEAT.md" is accepted but a no-op).
   * Required workspace setup such as AGENTS.md still runs.
   * Example: ["SOUL.md", "USER.md", "IDENTITY.md"]
   */
  skipOptionalBootstrapFiles?: OptionalBootstrapFileName[];
  /**
   * Controls when workspace bootstrap files (AGENTS.md, SOUL.md, etc.) are
   * injected into the system prompt:
   * - always: inject on every turn (default)
   * - continuation-skip: skip injection on safe continuation turns once the
   *   transcript already contains a completed assistant turn
   */
  contextInjection?: AgentContextInjection; /** Max chars for injected bootstrap files before truncation (default: 20000). */
  bootstrapMaxChars?: number; /** Max total chars across all injected bootstrap files (default: 150000). */
  bootstrapTotalMaxChars?: number; /** Experimental agent-default flags. Keep off unless you are intentionally testing a preview surface. */
  experimental?: {
    /**
     * Drop heavyweight non-essential default tools for weaker or smaller local
     * model backends. Experimental preview only.
     */
    localModelLean?: boolean;
  };
  /**
   * Agent-visible bootstrap truncation warning mode:
   * - off: do not inject warning text
   * - once: inject once per unique truncation signature
   * - always: inject on every run with truncation (default)
   */
  /**
   * Optional IANA timezone for model-visible timestamps, prompt context, system events,
   * and heartbeat active hours. Defaults to the host timezone.
   */
  userTimezone?: string; /** Runtime-owned first-turn startup context for bare /new and /reset. */
  startupContext?: AgentStartupContextConfig; /** Focused context-budget overrides for high-volume injected/read surfaces. */
  contextLimits?: AgentContextLimitsConfig; /** Optional context window cap (used for runtime estimates + status %). */
  contextTokens?: number; /** Opt-in: prune old tool results from the LLM context to reduce token usage. */
  contextPruning?: AgentContextPruningConfig; /** Compaction tuning and pre-compaction memory flush behavior. */
  compaction?: AgentCompactionConfig; /** Embedded OpenClaw runner hardening and compatibility controls. */
  embeddedAgent?: {
    /**
     * How embedded OpenClaw should trust workspace-local `.openclaw/settings.json`.
     * - sanitize (default): apply project settings except shellPath/shellCommandPrefix
     * - ignore: ignore project settings entirely
     * - trusted: trust project settings as-is
     */
    projectSettingsPolicy?: "trusted" | "sanitize" | "ignore";
    /**
     * Embedded OpenClaw execution contract:
     * - default: keep the standard runner behavior
     * - strict-agentic: enable structured plan tracking and non-visible turn recovery on supported GPT-5 runs
     */
    executionContract?: EmbeddedAgentExecutionContract;
  }; /** Default thinking level when no /think directive is present. */
  thinkingDefault?: AgentThinkingLevel; /** Default fast-mode policy inherited by agent entries that omit it. */
  fastModeDefault?: FastMode; /** Default verbose level when no /verbose directive is present. */
  verboseDefault?: "off" | "on" | "full";
  /**
   * Detail mode for user-visible tool progress in /verbose and editable progress drafts.
   * - explain: compact human summary (default)
   * - raw: include raw command/detail when available
   */
  toolProgressDetail?: "explain" | "raw"; /** Default reasoning level when no /reasoning directive is present. */
  reasoningDefault?: "off" | "on" | "stream"; /** Default elevated level when no /elevated directive is present. */
  elevatedDefault?: "off" | "on" | "ask" | "full"; /** Default block streaming level when no override is present. */
  blockStreamingDefault?: "off" | "on";
  /**
   * Block streaming boundary:
   * - "text_end": end of each assistant text content block (before tool calls)
   * - "message_end": end of the whole assistant message (may include tool blocks)
   */
  blockStreamingBreak?: "text_end" | "message_end"; /** Soft block chunking for streamed replies (min/max chars, prefer paragraph/newline). */
  blockStreamingChunk?: BlockStreamingChunkConfig;
  /**
   * Block reply coalescing (merge streamed chunks before send).
   * idleMs: wait time before flushing when idle.
   */
  blockStreamingCoalesce?: BlockStreamingCoalesceConfig; /** Human-like delay between block replies. */
  humanDelay?: HumanDelayConfig;
  timeoutSeconds?: number; /** Max inbound media size in MB for agent-visible attachments (text note or future image attach). */
  mediaMaxMb?: number;
  /**
   * Max image side length (pixels) when sanitizing base64 image payloads in transcripts/tool results.
   * Default: 1200.
   */
  imageMaxDimensionPx?: number;
  /**
   * Image compression/detail preference for image-tool media loading.
   * Default: auto, which adapts to provider/model limits and image count.
   */
  imageQuality?: AgentImageQualityPreference;
  typingIntervalSeconds?: number; /** Typing indicator start mode (never|instant|thinking|message). */
  typingMode?: TypingMode; /** Periodic background heartbeat runs. */
  heartbeat?: {
    /** Agent that owns ambient heartbeat runs when no per-agent heartbeat is configured. */agentId?: string; /** Heartbeat interval (duration string, default unit: minutes; default: 30m). */
    every?: string; /** Optional active-hours window (local time); heartbeats run only inside this window. */
    activeHours?: {
      /** Start time (24h, HH:MM). Inclusive. */start?: string; /** End time (24h, HH:MM). Exclusive. Use "24:00" for end-of-day. */
      end?: string; /** Timezone for the window ("user", "local", or IANA TZ id). Default: "user". */
      timezone?: string;
    }; /** Heartbeat model override (provider/model). */
    model?: string; /** Session key for heartbeat runs ("main" or explicit session key). */
    session?: string; /** Delivery target. Default "owner" uses explicit ownerAllowFrom/allowFrom; "last" may follow groups. */
    target?: string; /** Direct/DM delivery policy. Default: "allow". */
    directPolicy?: "allow" | "block"; /** Explicit channel destination; ignored for target "owner" or an unset target. */
    to?: string; /** Optional account id for multi-account channels. */
    accountId?: string; /** Override the heartbeat prompt body. The default treats scratch as monitor prose and directs recurring work to cron jobs. */
    prompt?: string; /** Run timeout in seconds for heartbeat agent turns. Unset uses global timeout or heartbeat cadence capped at 600 seconds. */
    timeoutSeconds?: number;
    /**
     * If true, run heartbeat turns with lightweight bootstrap context.
     * Lightweight mode skips workspace bootstrap files; monitor scratch is
     * injected by the heartbeat runner either way.
     */
    lightContext?: boolean;
    /**
     * If true, run heartbeat turns in an isolated session with no prior
     * conversation history. Dramatically reduces per-heartbeat token cost by
     * avoiding the full session transcript.
     */
    isolatedSession?: boolean;
  }; /** Owner for ambient OpenClaw system-agent/Custodian inference. */
  systemAgent?: {
    agentId?: string;
  }; /** Upgrade-only owner for the inherited credential store until H2-2 relocates credentials. */
  authInheritance?: {
    agentId?: string;
  }; /** Upgrade-only owner for retired main-agent rows and legacy fixed session stores. */
  sessionStore?: {
    agentId?: string;
  }; /** Max concurrent agent runs across all conversations. Default: min(16, max(8, available CPU parallelism)). */
  maxConcurrent?: number; /** Sub-agent defaults (spawned via sessions_spawn). */
  subagents?: {
    /** Prompt-only guidance for how strongly the main agent should delegate work. Default: "suggest". */delegationMode?: SubagentDelegationMode; /** Default allowlist of target agent ids for sessions_spawn. Use "*" to allow any configured target. */
    allowAgents?: string[]; /** Max concurrent sub-agent runs (global lane: "subagent"). Default: 8. */
    maxConcurrent?: number; /** Maximum depth allowed for sessions_spawn chains. Default behavior: 1 (no nested spawns). */
    maxSpawnDepth?: number; /** Maximum active children a single requester session may spawn. Default behavior: 5. */
    maxChildrenPerAgent?: number; /** Auto-archive sub-agent sessions after N minutes (default: 60, set 0 to disable). */
    archiveAfterMinutes?: number; /** Default model selection for spawned sub-agents (string or {primary,fallbacks}). */
    model?: AgentModelConfig; /** Default thinking level for spawned sub-agents (e.g. "off", "low", "medium", "high"). */
    thinking?: string; /** Default run timeout in seconds for spawned sub-agents (0 = no timeout). */
    runTimeoutSeconds?: number; /** Gateway timeout in ms for sub-agent announce delivery calls (default: 120000). */
    announceTimeoutMs?: number; /** Require explicit agentId in sessions_spawn (no default same-as-caller). Default: false. */
    requireAgentId?: boolean;
  }; /** Optional sandbox settings for non-main sessions. */
  sandbox?: AgentSandboxConfig;
};
type AgentCompactionMode = "default" | "safeguard";
type AgentCompactionPostIndexSyncMode = "off" | "async" | "await";
type AgentCompactionIdentifierPolicy = "strict" | "off";
type AgentCompactionQualityGuardConfig = {
  /** Enable compaction summary quality audits and regeneration retries. Default: false. */enabled?: boolean; /** Maximum regeneration retries after a failed quality audit. Default: 1 when enabled. */
  maxRetries?: number;
};
type AgentCompactionMidTurnPrecheckConfig = {
  /**
   * Enable structured context pressure checks after tool results are appended
   * and before the next agent model call. Default: false.
   */
  enabled?: boolean;
};
type AgentCompactionConfig = {
  /** Enable embedded proactive auto-compaction. Default: true. */enabled?: boolean; /** Compaction summarization mode. */
  mode?: AgentCompactionMode; /** Override the session thinking level for embedded OpenClaw compaction summaries. */
  thinkingLevel?: AgentThinkingLevel; /** Embedded OpenClaw keepRecentTokens budget used for cut-point selection. */
  keepRecentTokens?: number; /** Preserve this many most-recent user/assistant turns verbatim in compaction summary context. */
  recentTurnsPreserve?: number; /** Identifier-preservation instruction policy for compaction summaries. */
  identifierPolicy?: AgentCompactionIdentifierPolicy; /** Optional quality-audit retries for safeguard compaction summaries. */
  qualityGuard?: AgentCompactionQualityGuardConfig; /** Mid-turn precheck for tool-loop context pressure. Default: disabled. */
  midTurnPrecheck?: AgentCompactionMidTurnPrecheckConfig; /** Post-compaction session memory index sync mode. */
  postIndexSync?: AgentCompactionPostIndexSyncMode; /** Pre-compaction memory flush (agentic turn). Default: enabled. */
  memoryFlush?: AgentCompactionMemoryFlushConfig; /** H2/H3 section names from AGENTS.md to inject after compaction. */
  postCompactionSections?: string[];
  /** Optional provider/model or configured bare alias for compaction summarization.
   * When set, compaction uses this model instead of the agent's primary model.
   * Falls back to the primary model when unset. */
  model?: string;
  /**
   * Proactive auto-compaction threshold expressed as a fraction of the active
   * model context window (0 < x < 1). When set, embedded and preflight
   * auto-compaction triggers as soon as assessed context usage reaches x of
   * the window instead of waiting for the window-minus-reserve boundary.
   * Example: 0.8 compacts once context usage reaches 80% of the context
   * window. Leave unset for the default window-minus-reserve behavior.
   */
  contextUsageThreshold?: number; /** Maximum time in seconds for a single compaction operation (default: 180). */
  timeoutSeconds?: number;
  /**
   * Id of a registered compaction provider plugin.
   * When set, the provider's summarize() is called instead of
   * the built-in summarizeInStages(). Falls back to built-in on failure.
   */
  provider?: string;
  /**
   * Byte threshold for normal preflight local compaction (bytes, or a byte-size
   * string like "20mb"). Set to 0 or leave unset to disable. Also caps Codex
   * app-server native rollouts; oversized native threads restart fresh.
   */
  maxActiveTranscriptBytes?: number | string;
  /**
   * Send brief context-maintenance notices to the user: when compaction starts
   * and completes, and when a pre-compaction memory flush is exhausted so the
   * reply continues in a degraded state.
   * Default: false (silent by default).
   */
  notifyUser?: boolean;
};
type AgentCompactionMemoryFlushConfig = {
  /** Enable the pre-compaction memory flush (default: true). */enabled?: boolean; /** Optional provider/model override used only for pre-compaction memory flush turns. */
  model?: string; /** Run the memory flush when context is within this many tokens of the compaction threshold. */
  softThresholdTokens?: number;
  /**
   * Force a memory flush when transcript size reaches this threshold
   * (bytes, or byte-size string like "2mb"). Set to 0 to disable.
   */
  forceFlushTranscriptBytes?: number | string;
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
//#region src/config/types.skills.d.ts
/** Per-skill runtime override keyed by skill name or source-specific skill key. */
type SkillConfig = {
  /** Disable a discovered skill without removing it from disk. */enabled?: boolean; /** Optional secret made available to the skill runtime through skill env handling. */
  apiKey?: SecretInput; /** Plain environment overrides applied when the skill runs. */
  env?: Record<string, string>; /** Skill-specific structured config consumed by the skill runtime. */
  config?: Record<string, unknown>;
};
/** Discovery and watcher settings for skill sources. */
type SkillsLoadConfig = {
  /**
   * Additional skill folders to scan (lowest precedence).
   * Each directory should contain skill subfolders with `SKILL.md`.
   */
  extraDirs?: string[];
  /**
   * Real target directories that skill symlinks may resolve into even when they
   * sit outside the configured source root.
   */
  allowSymlinkTargets?: string[]; /** Watch skill folders for changes and refresh the skills snapshot. */
  watch?: boolean;
};
/** Skill installation preferences and upload policy. */
type SkillsInstallConfig = {
  preferBrew?: boolean;
  nodeManager?: "npm" | "pnpm" | "yarn" | "bun"; /** Allow gateway clients to install zip archives staged through skills.upload.*. */
  allowUploadedArchives?: boolean;
};
/** Limits that bound skill discovery and model-facing prompt expansion. */
type SkillsLimitsConfig = {
  /** Max number of immediate child directories to consider under a skills root before treating it as suspicious. */maxCandidatesPerRoot?: number; /** Max number of skills to load per skills source (bundled/managed/workspace/extra). */
  maxSkillsLoadedPerSource?: number; /** Max number of skills to include in the model-facing skills prompt. */
  maxSkillsInPrompt?: number; /** Max characters for the model-facing skills prompt block (approx). */
  maxSkillsPromptChars?: number; /** Max size (bytes) allowed for a SKILL.md file to be considered. */
  maxSkillFileBytes?: number;
};
type SkillsWorkshopAutonomousMode = "off" | "propose" | "auto";
/** Autonomous and approval settings for generated skill proposals. */
type SkillsWorkshopConfig = {
  /** Autonomous Skill Workshop behavior controlled separately from user-prompted proposals. */autonomous?: {
    /** Capture policy for durable conversation signals and substantial completed work. */mode?: SkillsWorkshopAutonomousMode;
  }; /** Allow Skill Workshop apply to write through trusted skill symlink targets. */
  allowSymlinkTargetWrites?: boolean; /** Whether proposal lifecycle actions need explicit approval. */
  approvalPolicy?: "pending" | "auto"; /** Maximum pending/quarantined proposals retained per workspace. */
  maxPending?: number; /** Maximum generated skill proposal size in bytes. */
  maxSkillBytes?: number;
};
/** Top-level skills config block in openclaw config. */
type SkillsConfig = {
  /** Optional bundled-skill allowlist (only affects bundled skills). */allowBundled?: string[];
  load?: SkillsLoadConfig;
  install?: SkillsInstallConfig;
  limits?: SkillsLimitsConfig;
  workshop?: SkillsWorkshopConfig;
  entries?: Record<string, SkillConfig>;
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
//#region src/config/types.agents.d.ts
type AgentRuntimeAcpConfig = {
  /** ACP harness adapter id (for example codex, claude). */agent?: string; /** Optional ACP backend override for this agent runtime. */
  backend?: string; /** Optional ACP session mode override. */
  mode?: "persistent" | "oneshot"; /** Optional runtime working directory override. */
  cwd?: string;
};
type AgentRuntimeConfig = {
  type: "embedded";
} | {
  type: "acp";
  acp?: AgentRuntimeAcpConfig;
};
type AgentBindingMatch = {
  channel: string;
  /**
   * Channel account to match.
   * - Omitted/empty: matches only the channel default account.
   * - "*": matches every account on the channel.
   * - Any other string: matches that specific account id.
   */
  accountId?: string;
  peer?: {
    kind: ChatType;
    id: string;
  };
  guildId?: string;
  teamId?: string; /** Discord role IDs used for role-based routing. */
  roles?: string[];
};
type AgentRouteBinding = {
  /** Missing type is interpreted as route for backward compatibility. */type?: "route";
  agentId: string;
  comment?: string;
  match: AgentBindingMatch;
  session?: {
    /** Optional session scoping override for conversations matched by this binding. */dmScope?: DmScope;
  };
};
type AgentAcpBinding = {
  type: "acp";
  agentId: string;
  comment?: string;
  match: AgentBindingMatch;
  acp?: {
    mode?: "persistent" | "oneshot";
    label?: string;
    cwd?: string;
    backend?: string;
  };
};
type AgentBinding = AgentRouteBinding | AgentAcpBinding;
type AgentConfig = {
  id: string; /** @deprecated Raw legacy list compatibility only; canonical agents.entries rejects this key. */
  default?: boolean;
  name?: string; /** Optional human-authored agent description. */
  description?: string;
  workspace?: string;
  agentDir?: string;
  model?: AgentModelConfig; /** Optional per-agent model for short internal tasks such as generated session titles. */
  utilityModel?: string;
  /**
   * @deprecated Legacy raw config accepted only by doctor/migration repair.
   * Normal schema parsing rejects this key; use per-model agentRuntime instead.
   */
  agentRuntime?: AgentModelEntryConfig["agentRuntime"]; /** Per-model metadata overrides for this agent. */
  models?: Record<string, AgentModelEntryConfig>; /** Per-agent model override policy. Replaces the default policy when allow is present. */
  modelPolicy?: AgentModelPolicyConfig; /** @deprecated Legacy per-agent compaction config is kept for raw doctor migration/repair. */
  compaction?: AgentDefaultsConfig["compaction"]; /** Optional per-agent default thinking level (overrides agents.defaults.thinkingDefault). */
  thinkingDefault?: AgentDefaultsConfig["thinkingDefault"]; /** Optional per-agent default verbosity level. */
  verboseDefault?: "off" | "on" | "full"; /** Optional per-agent tool progress detail mode. */
  toolProgressDetail?: AgentDefaultsConfig["toolProgressDetail"]; /** Optional per-agent default reasoning visibility. */
  reasoningDefault?: "on" | "off" | "stream"; /** Optional per-agent default for fast mode. */
  fastModeDefault?: FastMode; /** Optional per-agent bootstrap/context injection mode override. */
  contextInjection?: AgentDefaultsConfig["contextInjection"]; /** Optional per-agent max chars for each injected bootstrap file. */
  bootstrapMaxChars?: AgentDefaultsConfig["bootstrapMaxChars"]; /** Optional per-agent max total chars across injected bootstrap files. */
  bootstrapTotalMaxChars?: AgentDefaultsConfig["bootstrapTotalMaxChars"]; /** Optional per-agent experimental flags. Omitted fields inherit agents.defaults.experimental. */
  experimental?: AgentDefaultsConfig["experimental"]; /** Optional allowlist of skills for this agent; omitting it inherits agents.defaults.skills when set, and an explicit list replaces defaults instead of merging. */
  skills?: string[]; /** Per-agent overrides for the shared top-level memory configuration. */
  memory?: {
    search?: MemorySearchConfig;
  }; /** Human-like delay between block replies for this agent. */
  humanDelay?: HumanDelayConfig; /** Optional per-agent typing start policy. */
  typingMode?: AgentDefaultsConfig["typingMode"];
  /** Optional per-agent TTS overrides, deep-merged over top-level tts. */
  /** Per-agent TTS overrides. prefsPath remains scoped because agents may use distinct preference stores. */
  tts?: TtsConfig & {
    prefsPath?: string;
  }; /** Optional per-agent skills subsystem overrides. */
  skillsLimits?: Pick<SkillsLimitsConfig, "maxSkillsPromptChars">; /** Optional per-agent overrides for selected context/token-heavy limits. */
  contextLimits?: AgentContextLimitsConfig;
  contextTokens?: number; /** Optional per-agent heartbeat overrides. */
  heartbeat?: Omit<NonNullable<AgentDefaultsConfig["heartbeat"]>, "agentId">;
  identity?: IdentityConfig;
  groupChat?: Omit<GroupChatConfig, "visibleReplies">;
  subagents?: {
    /** Prompt-only guidance for how strongly this agent should delegate work. */delegationMode?: SubagentDelegationMode; /** Allow spawning sub-agents under other agent ids. Use "*" to allow any configured target. */
    allowAgents?: string[]; /** Per-agent default model for spawned sub-agents (string or {primary,fallbacks}). */
    model?: AgentModelConfig; /** Per-agent default thinking level for spawned sub-agents. */
    thinking?: string; /** Require explicit agentId in sessions_spawn (no default same-as-caller). */
    requireAgentId?: boolean;
  }; /** Optional per-agent embedded OpenClaw overrides. */
  embeddedAgent?: {
    /** Optional per-agent execution contract override. */executionContract?: EmbeddedAgentExecutionContract;
  }; /** Optional per-agent sandbox overrides. */
  sandbox?: AgentSandboxConfig; /** Optional per-agent stream params (e.g. cacheRetention, temperature). */
  params?: Record<string, unknown>;
  tools?: AgentToolsConfig; /** Optional runtime descriptor for this agent. */
  runtime?: AgentRuntimeConfig;
};
type AgentEntryConfig = Omit<AgentConfig, "id">;
type LoopGovernorAlertChannel = {
  channel: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
};
type LoopGovernorConfig = {
  /** Agent ids governed by the loop budget; only non-interactive turns count. */agents: string[]; /** Max non-interactive admissions per agent per UTC hour before parking. */
  maxTurnsPerHour: number; /** Optional alert delivery target for the once-per-breach-hour notification. */
  alertChannel?: LoopGovernorAlertChannel;
};
type AgentsConfig = {
  ownership?: "explicit";
  defaults?: AgentDefaultsConfig;
  entries?: Record<string, AgentEntryConfig>;
  /**
   * Per-agent non-interactive run governor. When present, non-interactive
   * turns (cron:/subagent:/incognito: shapes) for the listed agents are
   * capped at maxTurnsPerHour per UTC hour. Interactive DM turns are never
   * governed. Absent => feature off.
   */
  loopGovernor?: LoopGovernorConfig; /** Internal non-serialized projection materialized by validation for ID-based runtime code. */
  list?: AgentConfig[];
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
//#region src/config/types.auth.d.ts
type AuthProfileConfig = {
  /** Provider id this auth profile can satisfy. */provider: string;
  /**
   * Auth route selected by this profile id.
   * - api_key: static provider API key
   * - oauth: refreshable OAuth credentials (access+refresh+expires)
   * - token: static bearer-style token (optionally expiring; no refresh)
   * - aws-sdk: AWS SDK default credential chain (no secret in auth-profiles.json)
   */
  mode: "api_key" | "aws-sdk" | "oauth" | "token"; /** Optional account email shown in profile selection/status surfaces. */
  email?: string; /** Optional human-readable label shown in profile selection/status surfaces. */
  displayName?: string;
};
type AuthConfig = {
  /** Named auth profiles keyed by profile id. */profiles?: Record<string, AuthProfileConfig>; /** Preferred profile order per provider id. */
  order?: Record<string, string[]>;
};
//#endregion
//#region src/config/types.browser.d.ts
type BrowserProfileConfig = {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */color?: string; /** CDP port for this profile. Allocated once at creation, persisted permanently. */
  cdpPort?: number; /** CDP/DevTools endpoint URL for this profile (remote CDP or existing-session endpoint attach). */
  cdpUrl?: string; /** Explicit user data directory for existing-session Chrome MCP attachment. */
  userDataDir?: string; /** Override the Chrome MCP command for existing-session profiles. */
  mcpCommand?: string; /** Extra Chrome MCP arguments for existing-session profiles. */
  mcpArgs?: string[];
  /**
   * Profile driver (default: openclaw). "extension" attaches to the user's
   * signed-in browser through the OpenClaw Chrome extension relay.
   */
  driver?: "openclaw" | "clawd" | "existing-session" | "extension"; /** If true, launch this profile in headless mode. Falls back to browser.headless. */
  headless?: boolean; /** Browser executable path for this profile. Falls back to browser.executablePath. */
  executablePath?: string; /** If true, never launch a browser for this profile; only attach. Falls back to browser.attachOnly. */
  attachOnly?: boolean;
};
type BrowserSnapshotDefaults = {
  /** Default snapshot mode (applies when mode is not provided). */mode?: "efficient";
};
type BrowserTabCleanupConfig = {
  /** Enable best-effort cleanup for tracked primary-agent browser tabs. Default: true */enabled?: boolean;
};
type BrowserExtensionRelayConfig = {
  /** Temporarily accept legacy relay bearer/basic/subprotocol auth. Default: true. */allowLegacyAuth?: boolean;
};
type BrowserSsrFPolicyConfig = SsrFPolicyConfig;
type BrowserConfig = {
  /** @deprecated Doctor-only legacy input; canonical schema rejects this field. */color?: string;
  enabled?: boolean; /** Allow importing cookies from the user's real Chrome-family profile into a managed profile (macOS). Default: true. */
  allowSystemProfileImport?: boolean; /** If false, disable browser act:evaluate (arbitrary JS). Default: true */
  evaluateEnabled?: boolean; /** Base URL of the CDP endpoint (for remote browsers). Default: loopback CDP on the derived port. */
  cdpUrl?: string; /** Override the browser executable path (all platforms). */
  executablePath?: string; /** Start Chrome headless (best-effort). Default: false */
  headless?: boolean; /** Pass --no-sandbox to Chrome (Linux containers). Default: false */
  noSandbox?: boolean; /** If true: never launch; only attach to an existing browser. Default: false */
  attachOnly?: boolean; /** Default profile to use when profile param is omitted. Default: "openclaw" */
  defaultProfile?: string; /** Named browser profiles with explicit CDP ports or URLs. */
  profiles?: Record<string, BrowserProfileConfig>; /** Default snapshot options (applied by the browser tool/CLI when unset). */
  snapshotDefaults?: BrowserSnapshotDefaults; /** Best-effort cleanup policy for tabs opened by primary-agent browser sessions. */
  tabCleanup?: BrowserTabCleanupConfig; /** Chrome extension relay authentication compatibility settings. */
  extensionRelay?: BrowserExtensionRelayConfig; /** SSRF policy for browser navigation/open-tab operations. */
  ssrfPolicy?: BrowserSsrFPolicyConfig;
  /**
   * Additional Chrome launch arguments.
   * Useful for stealth flags, window size overrides, or custom user-agent strings.
   * Example: ["--window-size=1920,1080", "--disable-infobars"]
   */
  extraArgs?: string[];
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
//#region src/config/types.cloud-workers.d.ts
type CloudWorkerProfileConfig = {
  /** Worker provider id registered by a plugin. */provider: string; /** Worker install method (default: bundle); npm requires a released gateway version. */
  install?: "bundle" | "npm"; /** Provider-owned JSON settings; secret-bearing fields use SecretRef objects. */
  settings?: Record<string, unknown>;
};
type CloudWorkersConfig = {
  /** Experimental Labs gate for the cloud-worker desktop observer. */desktop?: boolean; /** Named opt-in worker profiles. Omit or leave empty to disable cloud workers. */
  profiles?: Record<string, CloudWorkerProfileConfig>;
};
//#endregion
//#region src/config/types.cron.d.ts
type CronFailureAlertConfig = {
  enabled?: boolean;
  after?: number;
  cooldownMs?: number;
  includeSkipped?: boolean;
  mode?: "announce" | "webhook";
  accountId?: string;
  channel?: string;
  to?: string;
};
type CronConfig = {
  enabled?: boolean;
  triggers?: {
    enabled?: boolean;
  }; /** Bearer token for cron webhook POST delivery. */
  webhookToken?: SecretInput; /** SSRF policy for all outbound cron webhook deliveries. */
  webhookSsrfPolicy?: SsrFPolicyConfig;
  /**
   * How long to retain completed cron run sessions before automatic pruning.
   * Accepts a duration string (e.g. "24h", "7d", "1h30m") or `false` to disable pruning.
   * A zero duration (e.g. "0h") also disables pruning; negative durations are invalid.
   * Default: "24h".
   */
  sessionRetention?: string | false;
  failureAlert?: CronFailureAlertConfig;
};
//#endregion
//#region src/config/types.desktop.d.ts
type DesktopHostConfig = {
  /** Enables the gateway-host desktop source after a gateway restart. */enabled: boolean; /** Runs a gateway-supervised headless TigerVNC/XFCE desktop on Linux. */
  managed?: boolean; /** Loopback RFB port of an already-running VNC server (default: 5900). */
  port?: number; /** Absolute VNC password-file path; macOS ARD account credentials stay per-observation. */
  passwordFile?: string;
};
type DesktopConfig = {
  /** Experimental Labs gate for observing the gateway host desktop. */host?: DesktopHostConfig;
};
//#endregion
//#region src/gateway/operator-scopes.d.ts
declare const ADMIN_SCOPE: "operator.admin";
declare const READ_SCOPE: "operator.read";
declare const WRITE_SCOPE: "operator.write";
declare const APPROVALS_SCOPE: "operator.approvals";
declare const QUESTIONS_SCOPE: "operator.questions";
declare const PAIRING_SCOPE: "operator.pairing";
declare const TALK_SCOPE: "operator.talk";
declare const TALK_SECRETS_SCOPE: "operator.talk.secrets";
/** Operator privileges advertised by gateway auth and checked by method policy. */
type OperatorScope = typeof ADMIN_SCOPE | typeof READ_SCOPE | typeof WRITE_SCOPE | typeof APPROVALS_SCOPE | typeof QUESTIONS_SCOPE | typeof PAIRING_SCOPE | typeof TALK_SCOPE | typeof TALK_SECRETS_SCOPE;
//#endregion
//#region src/config/types.gateway.d.ts
/** Gateway bind-address policy for local server startup. */
type GatewayBindMode = "auto" | "lan" | "loopback" | "custom" | "tailnet";
type GatewayTlsConfig = {
  /** Enable TLS for the gateway server. */enabled?: boolean; /** Auto-generate a self-signed cert if cert/key are missing (default: true). */
  autoGenerate?: boolean; /** PEM certificate path for the gateway server. */
  certPath?: string; /** PEM private key path for the gateway server. */
  keyPath?: string; /** Optional PEM CA bundle for TLS clients (mTLS or custom roots). */
  caPath?: string;
};
type WideAreaDiscoveryConfig = {
  /** Optional unicast DNS-SD domain (e.g. "openclaw.internal"). */domain?: string;
};
/** mDNS/Bonjour metadata exposure level for local gateway discovery. */
type MdnsDiscoveryMode = "off" | "minimal" | "full";
type MdnsDiscoveryConfig = {
  /**
   * mDNS/Bonjour discovery broadcast mode (default: minimal).
   * - off: disable mDNS entirely
   * - minimal: omit cliPath/sshPort from TXT records
   * - full: include cliPath/sshPort in TXT records
   */
  mode?: MdnsDiscoveryMode;
};
type DiscoveryConfig = {
  /** Wide-area DNS-SD discovery settings. */wideArea?: WideAreaDiscoveryConfig; /** Local mDNS/Bonjour discovery settings. */
  mdns?: MdnsDiscoveryConfig;
};
type TalkProviderConfig = {
  /** Provider API key (optional; provider-specific env fallback may apply). */apiKey?: SecretInput; /** Provider-owned Talk config fields. */
  [key: string]: unknown;
};
type TalkRealtimeConfig = {
  /** Active realtime voice provider. */provider?: string; /** Provider-specific realtime voice config keyed by provider id. */
  providers?: Record<string, TalkProviderConfig>; /** Provider model override for realtime sessions. */
  model?: string; /** Provider speaker voice name override for realtime sessions. */
  speakerVoice?: string; /** Provider speaker voice id override for realtime sessions. */
  speakerVoiceId?: string; /** Additional system instructions appended to realtime Talk sessions. */
  instructions?: string; /** Realtime execution mode. */
  mode?: "realtime" | "stt-tts" | "transcription"; /** Byte/session transport. */
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room"; /** Voice activity detection threshold from 0 (most sensitive) to 1 (least sensitive). */
  vadThreshold?: number; /** Milliseconds of silence before the current user turn is committed. */
  silenceDurationMs?: number; /** Milliseconds of audio retained before detected speech begins. */
  prefixPaddingMs?: number; /** Provider-specific realtime reasoning effort. */
  reasoningEffort?: string; /** Tool/agent strategy for realtime sessions. */
  brain?: "agent-consult" | "direct-tools" | "none"; /** How Gateway relay handles final user transcripts when the provider skips a consult. */
  consultRouting?: "provider-direct" | "force-agent-consult";
};
type ResolvedTalkConfig = {
  /** Active Talk TTS provider resolved from the current config payload. */provider: string; /** Provider config for the active Talk provider. */
  config: TalkProviderConfig;
};
type TalkConfig = {
  /** Agent that owns Talk sessions created without an agent-scoped session key. */agentId?: string; /** Active Talk TTS provider (for example "acme-speech"). */
  provider?: string; /** Provider-specific Talk config keyed by provider id. */
  providers?: Record<string, TalkProviderConfig>; /** Realtime Talk provider, model, voice, mode, transport, and brain config. */
  realtime?: TalkRealtimeConfig; /** Optional thinking level override for the agent run behind Talk realtime consults. */
  consultThinkingLevel?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra"; /** Optional fast mode override for the agent run behind Talk realtime consults. */
  consultFastMode?: boolean; /** BCP 47 locale id used for Talk speech recognition on device nodes and the iOS system-voice fallback. */
  speechLocale?: string; /** Stop speaking when user starts talking (default: true). */
  interruptOnSpeech?: boolean; /** Milliseconds of user silence before Talk mode sends the transcript after a pause. */
  silenceTimeoutMs?: number;
};
type GatewayControlUiConfig = {
  /** @deprecated Doctor-only legacy input. */chatMessageMaxWidth?: string;
  /**
   * @deprecated Upgrade-only transport input. Retained so releases that shipped
   * this break-glass flag can migrate an unpaired browser safely.
   */
  dangerouslyDisableDeviceAuth?: boolean; /** If false, the Gateway will not serve the Control UI (default /). */
  enabled?: boolean; /** Optional base path prefix for the Control UI (e.g. "/openclaw"). */
  basePath?: string; /** Optional filesystem root for Control UI assets (defaults to dist/control-ui). */
  root?: string;
  /**
   * Opt-in AI purpose titles for tool calls in Control UI chat (default false).
   * When enabled, chat.toolTitles generates short titles through standard
   * utility-model routing and caches them per agent.
   */
  toolTitles?: boolean; /** Produce utility-model session status digests for subscribed Control UI clients (default true). */
  sessionObserver?: boolean;
  /**
   * Embed sandbox mode for hosted Control UI previews.
   * - strict: no script execution inside embeds
   * - scripts: allow scripts while keeping embeds origin-isolated (default)
   * - trusted: allow scripts and same-origin privileges
   */
  embedSandbox?: "strict" | "scripts" | "trusted";
  /**
   * DANGEROUS: Allow hosted embeds to load absolute external http(s) URLs.
   * Default off; prefer hosted /__openclaw__/canvas or /__openclaw__/a2ui content.
   */
  allowExternalEmbedUrls?: boolean;
  /** Optional max-width for grouped Control UI chat messages (default: min(900px, 68%)). */
  /** Allowed browser origins for Control UI/WebChat websocket connections. */
  allowedOrigins?: string[];
  /**
   * DANGEROUS: Keep Host-header origin fallback behavior.
   * Supported long-term for deployments that intentionally rely on this policy.
   */
  dangerouslyAllowHostHeaderOriginFallback?: boolean;
};
/** Gateway authentication strategy for WebSocket and HTTP clients. */
type GatewayAuthMode = "none" | "token" | "password" | "trusted-proxy";
/**
 * Configuration for trusted reverse proxy authentication.
 * Used when Clawdbot runs behind an identity-aware proxy (Pomerium, Caddy + OAuth, etc.)
 * that handles authentication and passes user identity via headers.
 */
type GatewayTrustedProxyConfig = {
  /**
   * Header name containing the authenticated user identity (required).
   * Common values: "x-forwarded-user", "x-remote-user", "x-pomerium-claim-email"
   */
  userHeader: string;
  /**
   * Additional headers that MUST be present for the request to be trusted.
   * Use this to verify the request actually came through the proxy.
   * Example: ["x-forwarded-proto", "x-forwarded-host"]
   */
  requiredHeaders?: string[];
  /**
   * Optional allowlist of user identities that can access the gateway.
   * If empty or omitted, all authenticated users from the proxy are allowed.
   * Example: ["nick@example.com", "admin@company.org"]
   */
  allowUsers?: string[];
  /**
   * Allow loopback proxy sources (127.0.0.1, ::1) in trusted-proxy mode.
   * Default false; enable only when a same-host reverse proxy is the intended
   * trust boundary and direct Gateway access is otherwise locked down.
   */
  allowLoopback?: boolean;
  /**
   * Automatically approve new browser device identities after trusted-proxy
   * authentication. Disabled by default; existing-device upgrades stay manual.
   */
  deviceAutoApprove?: {
    /** Enable automatic approval for new browser devices. @default false */enabled?: boolean;
    /**
     * Maximum operator scopes granted by automatic approval. Listing
     * operator.admin explicitly lets every proxy-authenticated user request
     * automatic full-admin device grants. Requests without scopes receive the
     * configured maximum. @default operator.read, operator.write,
     * operator.approvals
     */
    scopes?: string[];
  };
};
type GatewayAuthConfig = {
  /** Authentication mode for Gateway connections. Defaults to token when unset. */mode?: GatewayAuthMode; /** Shared token for token mode (plaintext or SecretRef). */
  token?: SecretInput; /** Shared password for password mode (consider env instead). */
  password?: SecretInput; /** Allow Tailscale identity headers when serve mode is enabled. */
  allowTailscale?: boolean; /** Operator scopes granted to verified trusted-proxy or Tailscale identities. */
  identityScopes?: Record<string, OperatorScope[]>; /** Rate-limit configuration for failed authentication attempts. */
  rateLimit?: GatewayAuthRateLimitConfig;
  /**
   * Configuration for trusted-proxy auth mode.
   * Required when mode is "trusted-proxy".
   */
  trustedProxy?: GatewayTrustedProxyConfig;
};
type GatewayAuthRateLimitConfig = {
  /** Maximum failed attempts per IP before blocking.  @default 10 */maxAttempts?: number; /** Sliding window duration in milliseconds.  @default 60000 (1 min) */
  windowMs?: number; /** Lockout duration in milliseconds after the limit is exceeded.  @default 300000 (5 min) */
  lockoutMs?: number; /** Exempt localhost/loopback addresses from auth rate limiting.  @default true */
  exemptLoopback?: boolean;
};
/** Tailscale exposure mode for gateway HTTP/WebSocket surfaces. */
type GatewayTailscaleMode = "off" | "serve" | "funnel";
type GatewayTailscaleConfig = {
  /** Tailscale exposure mode for the Gateway control UI. */mode?: GatewayTailscaleMode; /** Reset serve/funnel configuration on shutdown. */
  resetOnExit?: boolean; /** Optional Tailscale Service name, such as `svc:openclaw`, for Serve mode. */
  serviceName?: string;
  /**
   * When `mode="serve"` and an externally configured Tailscale Funnel route
   * already covers the gateway port, skip re-applying `tailscale serve` on
   * startup. Lets operators manage Funnel exposure outside OpenClaw without
   * losing it across gateway restarts.
   */
  preserveFunnel?: boolean;
};
type GatewayRemoteConfig = {
  /** Remote Gateway WebSocket URL (ws:// or wss://). */url?: string; /** macOS app-only transport (SSH tunnel or direct WS); core validates/preserves but does not read it. */
  transport?: "ssh" | "direct"; /** macOS app-only remote SSH port (default 18789); core validates/preserves but does not read it. */
  remotePort?: number; /** Token for remote auth (when the gateway requires token auth). */
  token?: SecretInput; /** Password for remote auth (when the gateway requires password auth). */
  password?: SecretInput; /** Expected TLS certificate fingerprint (sha256) for remote gateways. */
  tlsFingerprint?: string; /** SSH target for tunneling remote Gateway (user@host). */
  sshTarget?: string; /** SSH identity file path for tunneling remote Gateway. */
  sshIdentity?: string; /** macOS app-only; core validates/preserves but does not read it. Defaults to strict; see docs/platforms/mac/remote.md. */
  sshHostKeyPolicy?: "strict" | "openssh";
};
/**
 * Operator terminal surface served to Control UI and mobile clients.
 *
 * The terminal opens a PTY-backed shell on the gateway host, gated to
 * admin-scope operator sessions. It starts in the target agent's workspace; if
 * that agent is fully sandboxed (`sandbox.mode: "all"`) the terminal is refused
 * rather than handed an unconfined host shell (workspace isolation is
 * fail-closed). Under "non-main" the agent's main session runs on the host, so a
 * host terminal is allowed.
 */
type GatewayTerminalConfig = {
  /** Master switch for the operator terminal. Default: true; set false to opt out. */enabled?: boolean;
  /**
   * Shell executable to launch. When unset the host login shell is used
   * ($SHELL on Unix, %ComSpec% on Windows).
   */
  shell?: string;
  /**
   * How long (seconds) a session survives after its connection drops, staying
   * reattachable via terminal.attach. 0 kills sessions on disconnect
   * immediately. Default: 300.
   */
  detachedSessionTimeoutSeconds?: number;
};
/** Labs-gated external CLI session targets in the Control UI. */
type GatewayCliAgentsConfig = {
  /** Show catalog-backed CLI agents in the new-session model picker. Default: false. */enabled?: boolean;
};
/** Gateway config reload strategy for managed installs. */
type GatewayReloadMode = "off" | "restart" | "hot" | "hybrid";
type GatewayReloadConfig = {
  /** Reload strategy for config changes (default: hybrid). */mode?: GatewayReloadMode;
};
type GatewayHttpChatCompletionsConfig = {
  /**
   * If false, the Gateway will not serve `POST /v1/chat/completions`.
   * Default: false when absent.
   */
  enabled?: boolean; /** Image input controls for `image_url` parts. */
  images?: GatewayHttpChatCompletionsImagesConfig;
};
type GatewayHttpChatCompletionsImagesConfig = {
  /** Allow URL fetches for `image_url` parts. Default: false. */allowUrl?: boolean;
  /**
   * Optional hostname allowlist for URL fetches.
   * Supports exact hosts and `*.example.com` wildcards.
   */
  urlAllowlist?: string[]; /** Allowed MIME types (case-insensitive). */
  allowedMimes?: string[]; /** Max bytes per image. Default: 10MB. */
  maxBytes?: number; /** Max redirects when fetching a URL. Default: 3. */
  maxRedirects?: number; /** Fetch timeout in ms. Default: 10s. */
  timeoutMs?: number;
};
type GatewayHttpResponsesConfig = {
  /**
   * If false, the Gateway will not serve `POST /v1/responses` (OpenResponses API).
   * Default: false when absent.
   */
  enabled?: boolean;
  /**
   * Max number of URL-based `input_file` + `input_image` parts per request.
   * Default: 8.
   */
  maxUrlParts?: number; /** File inputs (input_file). */
  files?: GatewayHttpResponsesFilesConfig; /** Image inputs (input_image). */
  images?: GatewayHttpResponsesImagesConfig;
};
type GatewayHttpResponsesFilesConfig = {
  /** Allow URL fetches for input_file. Default: true. */allowUrl?: boolean;
  /**
   * Optional hostname allowlist for URL fetches.
   * Supports exact hosts and `*.example.com` wildcards.
   */
  urlAllowlist?: string[]; /** Allowed MIME types (case-insensitive). */
  allowedMimes?: string[]; /** Max bytes per file. Default: 5MB. */
  maxBytes?: number; /** Max decoded characters per file. Default: 200k. */
  maxChars?: number; /** Max redirects when fetching a URL. Default: 3. */
  maxRedirects?: number; /** Fetch timeout in ms. Default: 10s. */
  timeoutMs?: number; /** PDF handling (application/pdf). */
  pdf?: GatewayHttpResponsesPdfConfig;
};
type GatewayHttpResponsesPdfConfig = {
  /** Max pages to parse/render. Default: 4. */maxPages?: number; /** Max pixels per rendered page. Default: 4M. */
  maxPixels?: number; /** Minimum extracted text length to skip rasterization. Default: 200 chars. */
  minTextChars?: number;
};
type GatewayHttpResponsesImagesConfig = {
  /** Allow URL fetches for input_image. Default: true. */allowUrl?: boolean;
  /**
   * Optional hostname allowlist for URL fetches.
   * Supports exact hosts and `*.example.com` wildcards.
   */
  urlAllowlist?: string[]; /** Allowed MIME types (case-insensitive). */
  allowedMimes?: string[]; /** Max bytes per image. Default: 10MB. */
  maxBytes?: number; /** Max redirects when fetching a URL. Default: 3. */
  maxRedirects?: number; /** Fetch timeout in ms. Default: 10s. */
  timeoutMs?: number;
};
type GatewayHttpEndpointsConfig = {
  /** OpenAI-compatible chat completions endpoint controls. */chatCompletions?: GatewayHttpChatCompletionsConfig; /** OpenResponses-compatible responses endpoint controls. */
  responses?: GatewayHttpResponsesConfig;
};
type GatewayHttpSecurityHeadersConfig = {
  /**
   * Value for the Strict-Transport-Security response header.
   * Set to false to disable explicitly.
   *
   * Example: "max-age=31536000; includeSubDomains"
   */
  strictTransportSecurity?: string | false;
};
type GatewayHttpConfig = {
  /** Per-endpoint HTTP API controls. */endpoints?: GatewayHttpEndpointsConfig; /** HTTP security header overrides. */
  securityHeaders?: GatewayHttpSecurityHeadersConfig;
};
type GatewayPushApnsRelayConfig = {
  /** Base HTTPS URL for the external iOS APNs relay service. */baseUrl?: string; /** Timeout in milliseconds for relay send requests (default: 10000). */
  timeoutMs?: number;
};
type GatewayPushApnsConfig = {
  /** External APNs relay used by iOS/mobile notification flows. */relay?: GatewayPushApnsRelayConfig;
};
type GatewayPushConfig = {
  /** Apple Push Notification Service settings. */apns?: GatewayPushApnsConfig;
};
type GatewayNodePairingConfig = {
  /**
   * Silently approve trusted local device pairing and access upgrades.
   * Set false to require explicit approval; metadata refreshes remain automatic.
   * Default: true.
   */
  autoApproveLocal?: boolean;
  /**
   * Opt-in CIDR/IP allowlist for auto-approving first-time node-role pairing.
   * Only applies to fresh node pairing requests with no requested scopes.
   * Default: unset/disabled.
   */
  autoApproveCidrs?: string[];
  /**
   * SSH-verified auto-approval for first-time node-role pairing (default: enabled).
   * The gateway connects back to the pairing host over SSH (BatchMode, strict
   * host keys) and approves only when the remote `openclaw node identity`
   * output matches the pending request's device key. Set false to disable SSH
   * verification; this is independent of autoApproveCidrs, so unset that too for
   * manual-only node pairing. The object form tunes the probe:
   * - user: remote user (default: gateway process user)
   * - identity: SSH identity file (default: standard SSH resolution)
   * - timeoutMs: probe timeout (default: 7000)
   * - cidrs: CIDRs/IPs eligible for probing (default: private/CGNAT ranges)
   */
  sshVerify?: boolean | {
    user?: string;
    identity?: string;
    timeoutMs?: number;
    cidrs?: string[];
  };
};
type GatewayNodesConfig = {
  /** @deprecated Doctor-only legacy input. */skills?: {
    enabled?: boolean;
  }; /** @deprecated Doctor-only legacy input. */
  allowCommands?: string[]; /** @deprecated Doctor-only legacy input. */
  denyCommands?: string[]; /** Browser routing policy for node-hosted browser proxies. */
  browser?: {
    /** Routing mode (default: auto). */mode?: "auto" | "manual" | "off"; /** Pin to a specific node id/name (optional). */
    node?: string;
  }; /** Pairing policy for node-role gateway clients. */
  pairing?: GatewayNodePairingConfig; /** Controls whether paired nodes may publish agent-visible plugin tools (default: true). */
  pluginTools?: {
    /** Accept node-published plugin tool descriptors (default: true). */enabled?: boolean;
  }; /** Accept node-published skill descriptors (default: true). */
  allowSkills?: boolean;
  commands?: {
    /** Additional node.invoke commands to allow on the gateway. */allow?: string[]; /** Commands to deny even if they appear in the defaults or node claims. */
    deny?: string[];
  };
};
type GatewayToolsConfig = {
  /** Tools to deny via gateway HTTP /tools/invoke (extends defaults). */deny?: string[]; /** Tools to explicitly allow (removes from default deny list). */
  allow?: string[];
};
type GatewayConfig = {
  /** Single multiplexed port for Gateway WS + HTTP (default: 18789). */port?: number;
  /**
   * Explicit gateway mode. When set to "remote", local gateway start is disabled.
   * When set to "local", the CLI may start the gateway locally.
   */
  mode?: "local" | "remote";
  /**
   * Bind address policy for the Gateway WebSocket + Control UI HTTP server.
   * - auto: Loopback (127.0.0.1) if available, else 0.0.0.0 (fallback to all interfaces)
   * - lan: 0.0.0.0 (all interfaces, no fallback, current BYOH path is IPv4-only)
   * - loopback: 127.0.0.1 (local-only)
   * - tailnet: Tailnet IPv4 plus 127.0.0.1 if available, else loopback only
   * - custom: User-specified IPv4 address (requires customBindHost); specific IPv4s also bind 127.0.0.1
   * IPv6-only BYOH is not natively supported on this path today. Use an IPv4 sidecar or proxy.
   * Default: loopback (127.0.0.1).
   */
  bind?: GatewayBindMode; /** Custom IPv4 address for bind="custom" mode. IPv6-only BYOH requires an IPv4 sidecar or proxy. */
  customBindHost?: string; /** Externally reachable HTTPS origin for Gateway callback routes; HTTP only on loopback. */
  publicOrigin?: string;
  controlUi?: GatewayControlUiConfig;
  cliAgents?: GatewayCliAgentsConfig;
  terminal?: GatewayTerminalConfig;
  auth?: GatewayAuthConfig;
  tailscale?: GatewayTailscaleConfig;
  remote?: GatewayRemoteConfig;
  reload?: GatewayReloadConfig;
  tls?: GatewayTlsConfig;
  http?: GatewayHttpConfig;
  push?: GatewayPushConfig;
  nodes?: GatewayNodesConfig;
  /**
   * IPs of trusted reverse proxies (e.g. Traefik, nginx). When a connection
   * arrives from one of these IPs, the Gateway trusts `x-forwarded-for`
   * to determine the client IP for local pairing and HTTP checks.
   */
  trustedProxies?: string[];
  /**
   * Allow `x-real-ip` as a fallback only when `x-forwarded-for` is missing.
   * Default: false (safer fail-closed behavior).
   */
  allowRealIpFallback?: boolean; /** Tool access restrictions for HTTP /tools/invoke endpoint. */
  tools?: GatewayToolsConfig;
};
//#endregion
//#region src/config/types.installs.d.ts
/** Base persisted install record shared by plugin and skill install tracking. */
type InstallRecordBase = {
  source: "npm" | "archive" | "path" | "clawhub" | "git";
  spec?: string;
  sourcePath?: string;
  installPath?: string;
  version?: string;
  resolvedName?: string;
  resolvedVersion?: string;
  resolvedSpec?: string;
  integrity?: string;
  shasum?: string;
  resolvedAt?: string;
  installedAt?: string;
  clawhubUrl?: string;
  clawhubPackage?: string;
  clawhubFamily?: "code-plugin" | "bundle-plugin";
  clawhubChannel?: "official" | "community" | "private";
  clawhubTrustDisposition?: "clean" | "review-recommended" | "review-required" | "blocked";
  clawhubTrustScanStatus?: string;
  clawhubTrustModerationState?: string;
  clawhubTrustReasons?: string[];
  clawhubTrustPending?: boolean;
  clawhubTrustStale?: boolean;
  clawhubTrustCheckedAt?: string;
  clawhubTrustAcknowledgedAt?: string;
  artifactKind?: "legacy-zip" | "npm-pack";
  artifactFormat?: "zip" | "tgz";
  npmIntegrity?: string;
  npmShasum?: string;
  npmTarballName?: string;
  clawpackSha256?: string;
  clawpackSpecVersion?: number;
  clawpackManifestSha256?: string;
  clawpackSize?: number;
  gitUrl?: string;
  gitRef?: string;
  gitCommit?: string;
};
//#endregion
//#region src/config/types.hooks.d.ts
type HookMappingMatch = {
  path?: string;
  source?: string;
};
type HookMappingTransform = {
  module: string;
  export?: string;
};
type HookSessionMode = "isolated" | "persistent";
type HookMappingConfig = {
  id?: string;
  match?: HookMappingMatch;
  action?: "wake" | "agent";
  wakeMode?: "now" | "next-heartbeat";
  name?: string; /** Route this hook to a specific agent (unknown ids fall back to the default agent). */
  agentId?: string;
  sessionKey?: string; /** Reuse the resolved session key across runs instead of creating a fresh run session. */
  sessionMode?: HookSessionMode;
  messageTemplate?: string;
  textTemplate?: string;
  deliver?: boolean; /** DANGEROUS: Disable external content safety wrapping for this hook. */
  allowUnsafeExternalContent?: boolean;
  /**
   * "last" or any runtime channel id (including plugin channels).
   * Validation against configured/registered channels happens in gateway hooks runtime.
   */
  channel?: "last" | (string & {});
  to?: string; /** Override model for this hook (provider/model or alias). */
  model?: string;
  thinking?: string;
  timeoutSeconds?: number;
  transform?: HookMappingTransform;
};
type HooksGmailTailscaleMode = "off" | "serve" | "funnel";
type HooksGmailConfig = {
  account?: string;
  label?: string;
  topic?: string;
  subscription?: string;
  pushToken?: string;
  hookUrl?: string;
  includeBody?: boolean;
  maxBytes?: number;
  renewEveryMinutes?: number; /** DANGEROUS: Disable external content safety wrapping for Gmail hooks. */
  allowUnsafeExternalContent?: boolean;
  serve?: {
    bind?: string;
    port?: number;
    path?: string;
  };
  tailscale?: {
    mode?: HooksGmailTailscaleMode;
    path?: string; /** Optional tailscale serve/funnel target (port, host:port, or full URL). */
    target?: string;
  }; /** Optional model override for Gmail hook processing (provider/model or alias). */
  model?: string; /** Optional thinking level override for Gmail hook processing. */
  thinking?: "off" | "minimal" | "low" | "medium" | "high";
};
type HookConfig = {
  enabled?: boolean;
  env?: Record<string, string>;
  [key: string]: unknown;
};
type InternalHooksConfig = {
  /** Enable hooks system */enabled?: boolean; /** Per-hook configuration overrides */
  entries?: Record<string, HookConfig>; /** Load configuration */
  load?: {
    /** Additional hook directories to scan */extraDirs?: string[];
  };
};
type HooksConfig = {
  enabled?: boolean;
  path?: string;
  token?: string;
  /**
   * Default session key used for hook agent runs when no request/mapping session key is used.
   * If omitted, OpenClaw generates `hook:<uuid>` per request.
   */
  defaultSessionKey?: string;
  /**
   * Allow `sessionKey` from external `/hooks/agent` request payloads.
   * Default: false.
   */
  allowRequestSessionKey?: boolean;
  /**
   * Optional allowlist for explicit session keys (request + mapping). Example: ["hook:"].
   * Empty/omitted means no prefix restriction.
   */
  allowedSessionKeyPrefixes?: string[];
  /**
   * Restrict hook execution to these effective agent ids, including
   * default-agent routing when `agentId` is omitted. Omit or include `*` to
   * allow any agent. Set `[]` to deny all agent routing.
   */
  allowedAgentIds?: string[];
  presets?: string[];
  transformsDir?: string;
  mappings?: HookMappingConfig[];
  gmail?: HooksGmailConfig; /** Internal agent event hooks */
  internal?: InternalHooksConfig;
};
//#endregion
//#region src/config/types.mcp.d.ts
type McpCodexToolApprovalMode = "auto" | "prompt" | "approve";
type McpServerCodexConfig = {
  /** OpenClaw agent ids that should receive this server in Codex app-server threads. */agents?: string[]; /** Codex MCP tool approval mode emitted as default_tools_approval_mode. */
  defaultToolsApprovalMode?: McpCodexToolApprovalMode;
};
type McpServerToolFilterConfig = {
  /**
   * Exact MCP tool names or simple "*" globs to expose from this server.
   *
   * When omitted, all server tools remain eligible unless excluded.
   */
  include?: string[]; /** Exact MCP tool names or simple "*" globs to hide from this server. */
  exclude?: string[];
};
type McpServerConfig = {
  /** Set false to keep the saved definition while excluding it from runtime/probe sessions. */enabled?: boolean; /** Stdio transport: command to spawn. */
  command?: string; /** Stdio transport: arguments for the command. */
  args?: string[]; /** Environment variables passed to the server process (stdio only). */
  env?: Record<string, string | number | boolean>; /** Working directory for stdio server. */
  cwd?: string; /** HTTP transport: URL of the remote MCP server (http or https). */
  url?: string; /** Transport type — "stdio" for command-bearing servers, "sse" or "streamable-http" for remote URLs. */
  transport?: "stdio" | "sse" | "streamable-http"; /** HTTP transport: extra HTTP headers sent with every request. */
  headers?: Record<string, string | number | boolean>; /** Optional connection timeout in milliseconds. */
  connectionTimeoutMs?: number; /** Optional per-request timeout in milliseconds. */
  requestTimeoutMs?: number; /** Whether this server can safely handle concurrent tool calls. */
  supportsParallelToolCalls?: boolean; /** HTTP OAuth mode. Tokens are stored in OpenClaw state, not in config. */
  auth?: "oauth"; /** Optional OAuth client metadata overrides for HTTP MCP servers. */
  oauth?: {
    /** Credential ownership for this server. Defaults to shared operator credentials. */identity?: "shared" | "per-requester"; /** Refresh-capable auth profile used to inject the current bearer token. */
    authProfileId?: string;
    scope?: string;
    redirectUrl?: string;
    clientMetadataUrl?: string;
  }; /** HTTP TLS verification, disabled only for explicitly trusted private endpoints. */
  sslVerify?: boolean; /** HTTP mutual TLS client certificate path. */
  clientCert?: string; /** HTTP mutual TLS client key path. */
  clientKey?: string; /** Optional per-server OpenClaw MCP tool selection. */
  toolFilter?: McpServerToolFilterConfig; /** Codex-specific projection controls for Codex app-server/runtime config. */
  codex?: McpServerCodexConfig;
  [key: string]: unknown;
};
type McpConfig = {
  /** Named MCP server definitions managed by OpenClaw. */servers?: Record<string, McpServerConfig>; /** Opt-in MCP Apps rendering and app-to-server bridge. */
  apps?: {
    enabled?: boolean; /** Dedicated public origin that proxies to the sandbox listener. */
    sandboxOrigin?: string; /** Dedicated listener port. Defaults to the Gateway port plus one. */
    sandboxPort?: number;
  };
};
//#endregion
//#region src/config/types.node-host.d.ts
type NodeHostBrowserProxyConfig = {
  /** Enable the browser proxy on the node host (default: true). */enabled?: boolean; /** Optional allowlist of profile names exposed via the proxy; when set, create/delete profile routes are blocked on the proxy surface. */
  allowProfiles?: string[];
};
type NodeHostConfig = {
  /** Sensitive native agent execution exposed by the headless node host. */agentRuns?: {
    claude?: {
      /** Advertise approval-gated Claude CLI turns when the binary is installed. */enabled?: boolean;
    };
  }; /** Full OpenClaw session hosting from this node's local installation. */
  workerRuns?: {
    /** Advertise this paired node as a worker session host (default: false). */enabled?: boolean;
  }; /** Browser proxy settings for node hosts. */
  browserProxy?: NodeHostBrowserProxyConfig; /** MCP servers started and exposed by the headless node host. */
  mcp?: {
    servers?: Record<string, McpServerConfig>;
  }; /** Skills published by the headless node host. */
  skills?: {
    /** Scan and publish ~/.openclaw/skills (default: true). */enabled?: boolean;
  };
};
//#endregion
//#region src/config/types.plugins.d.ts
type PluginEntryConfig = {
  enabled?: boolean;
  hooks?: {
    /** Controls prompt mutation via before_prompt_build. */allowPromptInjection?: boolean;
    /**
     * Controls access to raw conversation content from conversation hooks including
     * before_agent_run, before_model_resolve, before_agent_reply, llm_input, llm_output,
     * before_agent_finalize, and agent_end.
     * Non-bundled plugins must opt in explicitly; bundled plugins stay allowed unless disabled.
     */
    allowConversationAccess?: boolean; /** Default timeout in milliseconds for this plugin's typed hooks. */
    timeoutMs?: number; /** Per typed-hook timeout overrides in milliseconds. */
    timeouts?: Record<string, number>;
  };
  subagent?: {
    /** Explicitly allow this plugin to request per-run provider/model overrides for subagent runs. */allowModelOverride?: boolean;
    /**
     * Allowed override targets as canonical provider/model refs.
     * Use "*" to explicitly allow any model for this plugin.
     */
    allowedModels?: string[];
  };
  llm?: {
    /** Explicitly allow this plugin to request a model override for api.runtime.llm.complete. */allowModelOverride?: boolean;
    /**
     * Allowed override targets as canonical provider/model refs.
     * Use "*" to explicitly allow any model for this plugin.
     */
    allowedModels?: string[];
    /**
     * Allowed models for every completion, including host-resolved defaults and overrides.
     * Use "*" to explicitly allow any model for this plugin.
     */
    allowedCompletionModels?: string[]; /** Allow explicit auth-profile selection for isolated agent-runtime completions. */
    allowAuthProfileOverride?: boolean; /** Explicitly allow this plugin to run completions against a non-default agent id. */
    allowAgentIdOverride?: boolean;
  };
  config?: Record<string, unknown>;
};
type PluginSlotsConfig = {
  /** Select which plugin owns the memory slot ("none" disables memory plugins). */memory?: string; /** Select which plugin owns the context-engine slot. */
  contextEngine?: string;
};
type PluginsLoadConfig = {
  /** Additional plugin/extension paths to load. */paths?: string[];
};
type PluginInstallRecord = Omit<InstallRecordBase, "source"> & {
  source: InstallRecordBase["source"] | "marketplace";
  marketplaceName?: string;
  marketplaceSource?: string;
  marketplacePlugin?: string;
};
type PluginsConfig = {
  /** Enable or disable plugin loading. */enabled?: boolean; /** Optional plugin allowlist (plugin ids). */
  allow?: string[]; /** Optional plugin denylist (plugin ids). */
  deny?: string[];
  load?: PluginsLoadConfig;
  slots?: PluginSlotsConfig;
  entries?: Record<string, PluginEntryConfig>;
  /**
   * Internal transient carrier for plugin install records during command flows.
   * This is intentionally omitted from the config schema and must not be
   * persisted to openclaw.json.
   */
  installs?: Record<string, PluginInstallRecord>;
};
//#endregion
//#region src/config/types.openclaw.d.ts
/** One persisted suppression for a known security audit finding. */
type SecurityAuditSuppression = {
  /** Exact security audit check id to suppress. */checkId: string; /** Optional case-insensitive substring required in the finding title. */
  titleIncludes?: string; /** Optional case-insensitive substring required in the finding detail. */
  detailIncludes?: string; /** Operator rationale for accepting this standing finding. */
  reason?: string;
};
type SecurityConfig = {
  /** Security audit policy and accepted standing findings. */audit?: {
    /** Accepted security audit findings to omit from active summary/findings. */suppressions?: SecurityAuditSuppression[];
  };
  installPolicy?: {
    /**
     * Enable operator-owned install policy. When true without an exec command,
     * install/update attempts fail closed for supported targets.
     */
    enabled?: boolean; /** Supported install targets. Omit to cover every supported target. */
    targets?: Array<"skill" | "plugin">;
    /**
     * Trusted local policy command. Transport intentionally mirrors exec
     * SecretRef provider fields: absolute command, no shell, bounded output,
     * explicit env allowlist, and secure path checks.
     */
    exec?: {
      source: "exec";
      command: string;
      args?: string[];
      timeoutMs?: number;
      noOutputTimeoutMs?: number;
      maxOutputBytes?: number;
      env?: Record<string, string>;
      passEnv?: string[];
      trustedDirs?: string[];
    };
  };
};
type SurfaceConfigEntry = {
  /** Surface-specific silent reply policy for channels or UI integrations. */silentReply?: SilentReplyPolicyShape;
};
/** Top-level OpenClaw config as read from user/project config files. */
type OpenClawConfig = {
  /** @deprecated Doctor-only legacy input. */audit?: AuditConfig; /** JSON schema URL used by editors and generated config files. */
  $schema?: string;
  meta?: {
    /** Last OpenClaw version that wrote this config. */lastTouchedVersion?: string; /** One-time doctor migrations already applied to this config. */
    migrations?: {
      modelPolicyAllowlist?: true;
    };
  }; /** Authentication provider/profile configuration. */
  auth?: AuthConfig; /** Named access groups used by channel/provider policy allowlists. */
  accessGroups?: AccessGroupsConfig; /** ACP integration settings. */
  acp?: AcpConfig;
  env?: {
    /** Opt-in: import missing secrets from a login shell environment (exec `$SHELL -l -c 'env -0'`). */shellEnv?: {
      enabled?: boolean; /** Timeout for the login shell exec (ms). Default: 15000. */
      timeoutMs?: number;
    }; /** Inline env vars to apply when not already present in the process env. */
    vars?: Record<string, string>; /** Sugar: allow env vars directly under env (string values only). */
    [key: string]: string | Record<string, string> | {
      enabled?: boolean;
      timeoutMs?: number;
    } | undefined;
  };
  wizard?: {
    /** Guided-onboarding discovery consent: "full" scans silently, "guarded" asks first. */accessMode?: "full" | "guarded"; /** Offer installed-application plugin and skill recommendations during onboarding. */
    appRecommendations?: boolean;
    lastRunAt?: string;
    lastRunVersion?: string;
    lastRunCommit?: string;
    lastRunCommand?: string;
    lastRunMode?: "local" | "remote";
    localModelLeanAutoModel?: string;
    securityAcknowledgedAt?: string;
  }; /** Diagnostics, tracing, and stability debugging settings. */
  diagnostics?: DiagnosticsConfig; /** Log sink, level, rotation, and redaction settings. */
  logging?: LoggingConfig; /** Security audit suppressions and security policy settings. */
  security?: SecurityConfig;
  update?: {
    /** Update channel for git + npm installs ("stable", "extended-stable", "beta", or "dev"). */channel?: "stable" | "extended-stable" | "beta" | "dev"; /** Check for updates on gateway start (npm installs only). */
    checkOnStart?: boolean; /** Core auto-update policy for package installs. */
    auto?: {
      /** Enable background auto-update checks and apply logic. Default: false. */enabled?: boolean;
    };
  }; /** Browser automation and browser plugin integration settings. */
  browser?: BrowserConfig;
  ui?: {
    /** Accent color for OpenClaw UI chrome (hex). */seamColor?: string;
    assistant?: {
      /** Assistant display name for UI surfaces. */name?: string; /** Assistant avatar (emoji, short text, or image URL/data URI). */
      avatar?: string;
    };
    /**
     * Operator display preferences. Canonical config home so agents can
     * change them through the approval gate and clients stay in sync; the
     * Control UI mirrors them into browser storage for instant boot.
     */
    prefs?: {
      /** Control UI theme. */theme?: "claw" | "knot" | "dash" | "custom"; /** Light/dark preference. */
      themeMode?: "light" | "dark" | "system"; /** BCP 47 UI locale, e.g. "en" or "pt-BR". */
      locale?: string; /** Show model thinking output in chat. */
      chatShowThinking?: boolean; /** Show tool call cards in chat. */
      chatShowToolCalls?: boolean; /** Keep model commentary in Control UI transcripts after a run. */
      chatPersistCommentary?: boolean; /** Chat send shortcut: Enter sends, or modifier+Enter sends. */
      chatSendShortcut?: "enter" | "modifier-enter"; /** Follow-up handling while a run is active; unset uses the server queue mode. */
      chatFollowUpMode?: "steer" | "queue"; /** Ordered page and pinned-session entries shown in the Control UI sidebar. */
      sidebarEntries?: string[];
    };
  }; /** Secret providers, defaults, and ref-resolution settings. */
  secrets?: SecretsConfig; /** Skill loading and bundled skill configuration. */
  skills?: SkillsConfig; /** Plugin registry/install/runtime configuration. */
  plugins?: PluginsConfig; /** Per-surface policy keyed by channel/UI/runtime surface id. */
  surfaces?: Record<string, SurfaceConfigEntry>; /** Model providers, model catalog, pricing, and catalog merge policy. */
  models?: ModelsConfig; /** Node-host pairing and remote command node settings. */
  nodeHost?: NodeHostConfig; /** Agent definitions, defaults, bindings, and runtime policy. */
  agents?: AgentsConfig; /** Tool exposure, policy, web/media tools, exec, and code-mode settings. */
  tools?: ToolsConfig; /** Legacy/direct agent bindings used by runtime resolution. */
  bindings?: AgentBinding[]; /** Broadcast command and delivery settings. */
  broadcast?: BroadcastConfig;
  attachments?: {
    /** Optional retention window for persisted inbound media cleanup. */ttlHours?: number;
  }; /** Message formatting, delivery, and action settings. */
  messages?: MessagesConfig; /** Shared text-to-speech defaults. Agent and channel overrides layer over this config. */
  tts?: TtsConfig; /** Chat command settings. */
  commands?: CommandsConfig; /** Human approval workflow settings. */
  approvals?: ApprovalsConfig; /** Session keying, reset, maintenance, send-policy, and thread-binding settings. */
  session?: SessionConfig; /** Channel defaults, built-in channel sections, and plugin-owned channel config. */
  channels?: ChannelsConfig; /** Cron schedule and retention settings. */
  cron?: CronConfig; /** Transcript persistence and export settings. */
  transcripts?: TranscriptsConfig; /** Runtime hook registration and queue behavior. */
  hooks?: HooksConfig; /** Network discovery and service advertisement settings. */
  discovery?: DiscoveryConfig; /** Voice/talk mode configuration. */
  talk?: TalkConfig; /** Gateway server, auth, UI, node-pairing, and dispatch settings. */
  gateway?: GatewayConfig; /** Opt-in cloud-worker provider profiles. */
  cloudWorkers?: CloudWorkersConfig; /** Experimental desktop sources owned by the gateway host. */
  desktop?: DesktopConfig; /** Memory indexing/search configuration. */
  memory?: MemoryConfig; /** MCP client/server and Codex MCP approval configuration. */
  mcp?: McpConfig; /** Network-level SSRF protection via an operator-managed forward proxy. */
  proxy?: ProxyConfig;
};
declare const openClawConfigStateBrand: unique symbol;
type BrandedConfigState<TState extends string> = OpenClawConfig & {
  readonly [openClawConfigStateBrand]?: TState;
};
/** Authored config before include/env resolution and runtime defaults. */
/** Source config after includes/env substitution, before runtime defaults. */
type ResolvedSourceConfig = BrandedConfigState<"resolved-source">;
/** Runtime-materialized config with defaults/normalization applied. */
type RuntimeConfig = BrandedConfigState<"runtime">;
type ConfigValidationIssue = {
  /** Dot-path to the invalid or legacy config value. */path: string; /** Structured validator path used internally for lossless source diagnostics. */
  pathSegments?: Array<string | number>; /** Human-readable validation message. */
  message: string; /** Optional allowed values shown to the operator. */
  allowedValues?: string[]; /** Number of allowed values omitted from the display list. */
  allowedValuesHiddenCount?: number;
};
type LegacyConfigIssue = {
  /** Dot-path to the legacy config value. */path: string; /** Human-readable migration or rejection message. */
  message: string;
};
type ConfigFileSnapshot = {
  /** Config file path that was read. */path: string; /** Lexical and canonical file paths reached while resolving $include directives. */
  includedPaths?: string[]; /** Exact authored ownership for every successfully resolved $include directive. */
  includeProvenance?: readonly ConfigIncludeOwnership[]; /** Temporary roster-only projection retained until write preparation uses generic ownership. */
  agentRosterIncludeOwned?: boolean;
  bindingsIncludeOwned?: boolean; /** Whether the config file exists on disk. */
  exists: boolean; /** Raw file contents before parsing; null when missing. */
  raw: string | null; /** Parsed JSON/JSONC/YAML value before schema normalization. */
  parsed: unknown; /** Include/env-resolved source before raw compatibility migrations. */
  sourceConfigBeforeMigrations?: ResolvedSourceConfig;
  /**
   * Config authored on disk after $include resolution and ${ENV} substitution,
   * but BEFORE runtime defaults are applied.
   */
  sourceConfig: ResolvedSourceConfig;
  /**
   * Config after $include resolution and ${ENV} substitution, but BEFORE runtime
   * defaults are applied. Use this for config set/unset operations to avoid
   * leaking runtime defaults into the written config file.
   */
  resolved: ResolvedSourceConfig;
  valid: boolean; /** Runtime-shaped config used by in-process readers. */
  runtimeConfig: RuntimeConfig; /** @deprecated Prefer runtimeConfig. */
  config: RuntimeConfig;
  hash?: string;
  readError?: {
    code: string | null;
  };
  issues: ConfigValidationIssue[];
  warnings: ConfigValidationIssue[];
  legacyIssues: LegacyConfigIssue[];
};
//#endregion
export { AcpRuntimeTurnInput as $, TtsAutoMode as A, FastMode as B, IMessageReactionNotificationMode as C, BrowserConfig as D, CommonChannelMessagingConfig as E, MentionPatternsMode as F, AcpRuntimeEnsureInput as G, AcpRuntime as H, MentionPatternsPolicyConfig as I, AcpRuntimePromptMode as J, AcpRuntimeEvent as K, ProviderCommandsConfig as L, TtsMode as M, TtsModelOverrideConfig as N, AgentBinding as O, TtsProvider as P, AcpRuntimeTurnAttachment as Q, QueueMode as R, IMessageActionConfig as S, ChannelReadReceiptConfig as T, AcpRuntimeCapabilities as U, normalizeOptionalString as V, AcpRuntimeDoctorReport as W, AcpRuntimeStatus as X, AcpRuntimeSessionMode as Y, AcpRuntimeTurn as Z, TelegramNetworkConfig as _, ReplyToMode as _t, ResolvedTalkConfig as a, SilentReplyConversationType as at, ChannelImplicitMentionsConfig as b, ChatType as bt, OperatorScope as c, ToolLoopDetectionConfig as ct, TelegramActionConfig as d, ContextVisibilityMode as dt, AcpRuntimeTurnResult as et, TelegramCapabilitiesConfig as f, DmPolicy as ft, TelegramGroupConfig as g, MarkdownTableMode as gt, TelegramExecApprovalConfig as h, IdentityConfig as ht, McpCodexToolApprovalMode as i, resolveTranscriptsConfig as it, TtsConfig as j, ResolvedTtsPersona as k, AutoTopicLabelConfig as l, MemoryCitationsMode as lt, TelegramDirectConfig as m, HumanDelayConfig as mt, OpenClawConfig as n, AcpSessionUpdateTag as nt, TalkConfig as o, GroupToolPolicyBySenderConfig as ot, TelegramCustomCommand as p, DmScope as pt, AcpRuntimeHandle as q, PluginInstallRecord as r, AccessGroupConfig as rt, TalkProviderConfig as s, GroupToolPolicyConfig as st, ConfigFileSnapshot as t, AcpRuntimeTurnResultError as tt, TelegramAccountConfig as u, SafeBinProfileFixture as ut, TelegramPreviewStreamingConfig as v, SessionMaintenanceMode as vt, IMessageSendTransport as w, IMessageAccountConfig as x, TelegramThreadBindingsConfig as y, SessionScope as yt, AgentModelEntryConfig as z };