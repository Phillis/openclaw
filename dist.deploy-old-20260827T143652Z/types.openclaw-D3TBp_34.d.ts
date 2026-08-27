import { t as FastMode } from "./string-coerce-DjUc69CC.js";
import { C as SessionConfig, M as ChatType, _ as HumanDelayConfig, h as DmScope, i as BlockStreamingCoalesceConfig, j as TypingMode, n as AuditConfig, p as DiagnosticsConfig, r as BlockStreamingChunkConfig, v as IdentityConfig, y as LoggingConfig } from "./types.base-COwCxNSg.js";
import { c as SecretsConfig, n as SecretInput } from "./types.secrets-BBdlv1za.js";
import { $ as SsrFPolicyConfig, H as TtsConfig, I as ApprovalsConfig, J as AgentToolsConfig, Q as ToolsConfig, et as ConfiguredModelProviderRequest, ft as AgentModelConfig, ht as AgentToolModelConfig, it as CommandsConfig, lt as MessagesConfig, mt as AgentSandboxConfig, ot as GroupChatConfig, pt as AgentRuntimePolicyConfig, rt as BroadcastConfig, t as ChannelsConfig } from "./types.channels-B7ph6mKI.js";
import { d as OpenAIResponsesCompat, h as ThinkingLevelMap, t as AnthropicMessagesCompat, u as OpenAICompletionsCompat } from "./types-De8IanPo.js";
import fs from "node:fs";
import { z } from "zod";

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
/** Raw transcripts config block. */
type TranscriptsConfig = {
  enabled?: boolean;
  autoStart?: TranscriptsAutoStartConfig[];
};
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
type AcpRuntimeSessionMode = "persistent" | "oneshot";
/** Runtime update tags emitted by ACP adapters; unknown backend tags are passed through. */
type AcpSessionUpdateTag = "agent_message_chunk" | "agent_thought_chunk" | "tool_call" | "tool_call_update" | "usage_update" | "available_commands_update" | "current_mode_update" | "config_option_update" | "session_info_update" | "plan" | (string & {});
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
//#region packages/memory-host-sdk/src/host/types.d.ts
type MemorySource = "memory" | "sessions";
type MemoryOriginClass = "owner" | "agent" | "untrusted" | "system";
type MemorySessionKind = "interactive" | "cron" | "heartbeat" | "subagent" | "unknown";
/** Additional memory root, optionally narrowed by a root-relative glob. */
type MemoryExtraPath = string | {
  path: string;
  pattern?: string;
};
type MemoryEntryProvenance = {
  originClass: MemoryOriginClass;
  sessionKind: MemorySessionKind;
  observedAt: number;
  supersedesKey?: string;
};
/** One ranked memory search hit with optional vector/text scoring details. */
type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  importance?: number;
  triggers?: string; /** Semicolon-separated stable repository identities lifted from inline annotations. */
  projectKey?: string; /** Future provenance column supplied by the promoted-memory workstream. */
  originClass?: string;
  citation?: string;
  provenance?: MemoryEntryProvenance;
};
/** Cached/probed embedding availability status. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
/** Progress event emitted during memory sync. */
type MemorySyncProgressUpdate = {
  completed: number;
  total: number;
  label?: string;
};
type MemorySessionSyncTarget = {
  /** Owning OpenClaw agent. Omit only when the active manager scope already supplies it. */agentId?: string; /** Storage-neutral transcript/session identity. */
  sessionId: string; /** Optional visible session-store key for callers that already carry it. */
  sessionKey?: string;
};
type MemorySyncParams = {
  reason?: string;
  force?: boolean; /** Storage-neutral session transcript targets to refresh. */
  sessions?: MemorySessionSyncTarget[]; /** Archive/support transcript files to refresh without treating paths as active session identity. */
  archiveFiles?: string[];
  progress?: (update: MemorySyncProgressUpdate) => void;
};
type MemorySearchRuntimeDebug = {
  backend: "builtin";
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
  embeddingBootstrap?: {
    ok: false;
    provider: string;
    reason: string;
    degradedTo: "keyword-only";
  };
};
/** Result of reading a memory file, optionally paginated/truncated. */
type MemoryReadResult = {
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** Aggregated memory backend status for CLI/UI diagnostics. */
type MemoryVectorIndexState = {
  state: "empty";
} | {
  state: "complete";
} | {
  state: "incomplete";
} | {
  state: "unverified";
};
type MemoryProviderStatus = {
  backend: "builtin";
  provider: string;
  model?: string;
  requestedProvider?: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  workspaceDir?: string;
  dbPath?: string;
  extraPaths?: MemoryExtraPath[];
  sources?: MemorySource[];
  sourceCounts?: Array<{
    source: MemorySource;
    files: number;
    chunks: number;
  }>;
  cache?: {
    enabled: boolean;
    entries?: number;
    maxEntries?: number;
  };
  fts?: {
    enabled: boolean;
    available: boolean;
    error?: string;
  };
  fallback?: {
    from: string;
    reason?: string;
  };
  vector?: {
    enabled: boolean;
    index?: MemoryVectorIndexState;
    storeAvailable?: boolean;
    semanticAvailable?: boolean;
    available?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  batch?: {
    enabled: boolean;
    failures: number;
    limit: number;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    lastError?: string;
    lastProvider?: string;
  };
  custom?: Record<string, unknown>;
};
/** Search/read/sync/status contract implemented by memory managers. */
interface MemorySearchManager {
  search(query: string, opts?: {
    maxResults?: number;
    minScore?: number;
    sessionKey?: string;
    /**
     * Keyword/FTS scoring only: skip query embedding and vector search.
     * For reply-path recall (trigger injection) that must not add a
     * network round-trip per inbound message.
     */
    lexicalOnly?: boolean; /** Active repository identities used only for project-aware ranking. */
    activeProjectKeys?: string[];
    onDebug?: (debug: MemorySearchRuntimeDebug) => void;
    sources?: MemorySource[]; /** Optional caller cancellation; managers consume it where their runtime supports cancellation. */
    signal?: AbortSignal;
  }): Promise<MemorySearchResult[]>;
  listTriggerCandidates?(opts?: {
    limit?: number;
    activeProjectKeys?: string[];
  }): Promise<MemorySearchResult[]>;
  listCuratedProjectCandidates?(opts: {
    activeProjectKeys: string[];
    limit?: number;
  }): Promise<MemorySearchResult[]>;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<MemoryReadResult>;
  status(): MemoryProviderStatus;
  sync?(params?: MemorySyncParams): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  close?(): Promise<void>;
}
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
type AgentsConfig = {
  ownership?: "explicit";
  defaults?: AgentDefaultsConfig;
  entries?: Record<string, AgentEntryConfig>; /** Internal non-serialized projection materialized by validation for ID-based runtime code. */
  list?: AgentConfig[];
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
  /** Reasoning/thinking payload dialect for provider-compatible APIs. */thinkingFormat?: SupportedThinkingFormat; /** Provider-accepted reasoning effort labels. */
  supportedReasoningEfforts?: string[]; /** Maps OpenClaw reasoning effort labels to provider-specific labels. */
  reasoningEffortMap?: Record<string, string>; /** Reasoning detail block types safe to expose in visible transcripts. */
  visibleReasoningDetailTypes?: string[]; /** Whether this model supports tool/function calling. */
  supportsTools?: boolean; /** Code-mode tier consumed by `tools.codeMode.enabled: "auto"`; absent means "capable". */
  codeMode?: "preferred" | "capable"; /** Whether provider accepts prompt-cache/session affinity keys. */
  supportsPromptCacheKey?: boolean; /** Whether all message parts must be coerced to plain strings. */
  requiresStringContent?: boolean; /** Whether unknown message payload keys must be stripped before requests. */
  strictMessageKeys?: boolean; /** Named tool-schema profile used by provider adapters. */
  toolSchemaProfile?: string; /** JSON Schema keywords rejected by this provider's tool schema validator. */
  unsupportedToolSchemaKeywords?: string[]; /** Encoding expected for tool-call arguments in provider payloads. */
  toolCallArgumentsEncoding?: string; /** Whether OpenAI-style calls must be reshaped to Anthropic-compatible tool payloads. */
  requiresOpenAiAnthropicToolPayload?: boolean;
};
type ModelImageInputConfig = {
  /** Provider-documented maximum encoded image payload size. */maxBytes?: number; /** Provider-documented maximum accepted input pixels. */
  maxPixels?: number; /** Provider-documented maximum accepted width/height in pixels. */
  maxSidePx?: number; /** Preferred resize side for the default balanced compression policy. */
  preferredSidePx?: number; /** Token accounting style, used as documentation for provider-owned policy. */
  tokenMode?: "tile" | "detail" | "provider";
};
type ModelMediaInputConfig = {
  /** Image input limits and accounting hints for this model. */image?: ModelImageInputConfig;
};
/** Authentication mode expected by a configured model provider. */
type ModelProviderAuthMode = "api-key" | "aws-sdk" | "oauth" | "token";
type ModelProviderLocalServiceConfig = {
  /** Executable started before model requests are sent. */command: string; /** Arguments passed without shell expansion. */
  args?: string[]; /** Working directory for the local service process. */
  cwd?: string; /** Environment variables added to the service process. */
  env?: Record<string, string>; /** Optional health endpoint polled before the provider is considered ready. */
  healthUrl?: string; /** Startup readiness timeout in milliseconds. */
  readyTimeoutMs?: number; /** Idle timeout in milliseconds before stopping the local service. */
  idleStopMs?: number;
};
type ModelDefinitionConfig = {
  /** Provider-facing model id. */id: string; /** Human-readable display name. */
  name: string; /** Optional API adapter override for this model. */
  api?: ModelApi; /** Optional base URL override for this model. */
  baseUrl?: string; /** Whether the model supports reasoning/thinking controls. */
  reasoning: boolean; /** Supported input modalities for routing and media-tool selection. */
  input: Array<"text" | "image" | "video" | "audio">; /** Token pricing in USD per million tokens. */
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
      cacheWrite: number; /** Bounded tier: `[start, end)`. Open-ended top tier: `[start]` (normalized to `[start, Infinity]` at load time). */
      range: [number, number] | [number];
    }>;
  }; /** Provider/native maximum context window in tokens. */
  contextWindow: number;
  /**
   * Optional effective runtime cap used for compaction/session budgeting.
   * Keeps provider/native contextWindow metadata intact while letting configs
   * prefer a smaller practical window.
   */
  contextTokens?: number; /** Maximum completion/output token budget. */
  maxTokens: number; /** Maps OpenClaw thinking levels to provider/model-specific values. */
  thinkingLevelMap?: ThinkingLevelMap; /** Provider-specific request/runtime parameters passed through to provider plugins. */
  params?: Record<string, unknown>; /** Optional agent execution runtime override for this provider/model pair. */
  agentRuntime?: AgentRuntimePolicyConfig; /** Static headers merged into requests for this model. */
  headers?: Record<string, string>; /** Provider compatibility flags for payload shaping and feature gating. */
  compat?: ModelCompatConfig; /** Media input limits used by routing and preflight compression. */
  mediaInput?: ModelMediaInputConfig; /** Metadata source marker for models added by CLI/catalog tooling. */
  metadataSource?: "models-add";
};
type ModelProviderConfig = {
  /** Provider API base URL. */baseUrl: string; /** API key or secret reference for this provider. */
  apiKey?: SecretInput; /** Authentication mode used when resolving credentials for this provider. */
  auth?: ModelProviderAuthMode; /** Default API adapter for models under this provider. */
  api?: ModelApi; /** Provider-level default context window. */
  contextWindow?: number; /** Provider-level effective runtime context cap. */
  contextTokens?: number; /** Provider-level default max output tokens. */
  maxTokens?: number; /** Provider request timeout in seconds. */
  timeoutSeconds?: number; /** Optional provider deployment/API region used by provider plugins that expose regional endpoints. */
  region?: string;
  injectNumCtxForOpenAICompat?: boolean; /** Provider-specific runtime parameters interpreted by provider plugins. */
  params?: Record<string, unknown>; /** Optional default agent execution runtime for models under this provider. */
  agentRuntime?: AgentRuntimePolicyConfig; /** Optional local service to start before calling this provider. */
  localService?: ModelProviderLocalServiceConfig; /** Secret-bearing headers merged into provider requests. */
  headers?: Record<string, SecretInput>; /** Whether default Authorization header injection is enabled. */
  authHeader?: boolean; /** Provider request transport/retry overrides. */
  request?: ConfiguredModelProviderRequest; /** Model catalog entries exposed by this provider. */
  models: ModelDefinitionConfig[];
};
type ModelCatalogRefreshConfig = {
  /** Fetch model catalog updates from the hosted OpenClaw catalog. Default: true. */enabled?: boolean; /** Override the hosted catalog URL (HTTPS mirrors, or localhost HTTP for testing). */
  url?: string;
};
type ModelsConfig = {
  /** Merge provider config with bundled catalogs or replace bundled catalogs entirely. */mode?: "merge" | "replace"; /** Configured provider catalog keyed by provider id. */
  providers?: Record<string, ModelProviderConfig>; /** Hosted model catalog refresh settings. */
  catalogRefresh?: ModelCatalogRefreshConfig;
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
//#region src/config/zod-schema.proxy.d.ts
declare const ProxyConfigSchema: z.ZodOptional<z.ZodObject<{
  enabled: z.ZodOptional<z.ZodBoolean>;
  proxyUrl: z.ZodOptional<z.ZodURL>;
  tls: z.ZodOptional<z.ZodObject<{
    caFile: z.ZodOptional<z.ZodString>;
  }, z.core.$strict>>;
  loopbackMode: z.ZodOptional<z.ZodEnum<{
    "gateway-only": "gateway-only";
    proxy: "proxy";
    block: "block";
  }>>;
}, z.core.$strict>>;
type ProxyConfig = z.infer<typeof ProxyConfigSchema>;
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
export { AgentDefaultsConfig as A, AgentBinding as C, MemorySearchManager as D, MemoryExtraPath as E, AccessGroupConfig as M, AccessGroupsConfig as N, MemorySearchResult as O, SilentReplyConversationType as P, AuthConfig as S, MemorySearchConfig as T, TalkConfig as _, ModelApi as a, BrowserConfig as b, ModelMediaInputConfig as c, McpCodexToolApprovalMode as d, GatewayAuthConfig as f, ResolvedTalkConfig as g, GatewayTrustedProxyConfig as h, PluginInstallRecord as i, AcpRuntimeSessionMode as j, AgentContextLimitsConfig as k, ModelProviderAuthMode as l, GatewayTailscaleMode as m, ConfigValidationIssue as n, ModelCompatConfig as o, GatewayTailscaleConfig as p, OpenClawConfig as r, ModelDefinitionConfig as s, ConfigFileSnapshot as t, ModelProviderConfig as u, TalkProviderConfig as v, MemoryCitationsMode as w, BrowserProfileConfig as x, OperatorScope as y };