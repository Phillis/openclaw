import { gt as SessionTranscriptTargetParams, yt as OpenClawPluginToolContext } from "./plugin-entry-DyrRrRy2.js";
//#region extensions/active-memory/types.d.ts
declare const DEFAULT_TIMEOUT_MS = 15000;
declare const DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS = 45000;
declare const DEFAULT_AGENT_ID = "main";
declare const DEFAULT_MAX_SUMMARY_CHARS = 220;
declare const DEFAULT_RECENT_USER_TURNS = 2;
declare const DEFAULT_RECENT_ASSISTANT_TURNS = 1;
declare const DEFAULT_RECENT_USER_CHARS = 220;
declare const DEFAULT_RECENT_ASSISTANT_CHARS = 180;
declare const DEFAULT_CACHE_TTL_MS = 15000;
declare const DEFAULT_MAX_CACHE_ENTRIES = 1000;
declare const CACHE_SWEEP_INTERVAL_MS = 1000;
declare const DEFAULT_MIN_TIMEOUT_MS = 250;
declare const DEFAULT_SETUP_GRACE_TIMEOUT_MS = 0;
declare const MAX_TIMEOUT_MS = 120000;
declare const MAX_SETUP_GRACE_TIMEOUT_MS = 30000;
declare const DEFAULT_QUERY_MODE: "recent";
declare const DEFAULT_ACTIVE_MEMORY_MODE: "escalate";
declare const DEFAULT_TRANSCRIPT_DIR = "active-memory";
declare const ACTIVE_MEMORY_RECALL_LANE = "active-memory";
declare const ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS: readonly [0, 50, 250];
declare const DEFAULT_CIRCUIT_BREAKER_MAX_TIMEOUTS = 3;
declare const DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS = 60000;
declare const DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW: readonly ["memory_search", "memory_get"];
declare const LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW: readonly ["memory_recall"];
declare const MAX_ACTIVE_MEMORY_TOOLS_ALLOW = 32;
declare const STRUCTURED_MEMORY_FAILURE_STATUSES: Set<string>;
declare const STRUCTURED_MEMORY_EMPTY_STATUSES: Set<string>;
declare const ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW: Set<string>;
declare const DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS = 32000;
declare const DEFAULT_TRANSCRIPT_READ_MAX_LINES = 2000;
declare const DEFAULT_TRANSCRIPT_READ_MAX_BYTES: number;
declare const TIMEOUT_PARTIAL_DATA_GRACE_MS = 500;
declare const HOOK_TIMEOUT_RECOVERY_GRACE_MS: number;
declare const MAX_ACTIVE_MEMORY_SEARCH_QUERY_CHARS = 480;
declare const TERMINAL_MEMORY_SEARCH_POLL_INTERVAL_MS = 25;
declare const NO_RECALL_VALUES: Set<string>;
declare const TIMEOUT_BOILERPLATE_PATTERNS: RegExp[];
declare const RECALLED_CONTEXT_LINE_PATTERNS: RegExp[];
type ActiveRecallPluginConfig = {
  enabled?: boolean;
  mode?: ActiveMemoryMode;
  agents?: string[];
  model?: string;
  modelFallback?: string;
  modelFallbackPolicy?: "default-remote" | "resolved-only";
  allowedChatTypes?: Array<"direct" | "group" | "channel" | "explicit">;
  allowedChatIds?: string[];
  deniedChatIds?: string[];
  thinking?: ActiveMemoryThinkingLevel;
  fastMode?: ActiveMemoryFastMode;
  promptStyle?: "balanced" | "strict" | "contextual" | "recall-heavy" | "precision-heavy" | "preference-only";
  toolsAllow?: string[];
  promptOverride?: string;
  promptAppend?: string;
  timeoutMs?: number;
  setupGraceTimeoutMs?: number;
  queryMode?: "message" | "recent" | "full";
  maxSummaryChars?: number;
  recentUserTurns?: number;
  recentAssistantTurns?: number;
  recentUserChars?: number;
  recentAssistantChars?: number;
  logging?: boolean;
  cacheTtlMs?: number;
  circuitBreakerMaxTimeouts?: number;
  circuitBreakerCooldownMs?: number;
  persistTranscripts?: boolean;
  transcriptDir?: string;
};
type ResolvedActiveRecallPluginConfig = {
  enabled: boolean;
  mode: ActiveMemoryMode;
  agents: string[];
  model?: string;
  modelFallback?: string;
  modelFallbackPolicy: "default-remote" | "resolved-only";
  allowedChatTypes: Array<"direct" | "group" | "channel" | "explicit">;
  allowedChatIds: string[];
  deniedChatIds: string[];
  thinking: ActiveMemoryThinkingLevel;
  fastMode?: ActiveMemoryFastMode;
  promptStyle: "balanced" | "strict" | "contextual" | "recall-heavy" | "precision-heavy" | "preference-only";
  toolsAllow: string[];
  promptOverride?: string;
  promptAppend?: string;
  timeoutMs: number;
  /** True when timeoutMs is the built-in default rather than operator config. */
  timeoutMsIsDefault: boolean;
  setupGraceTimeoutMs: number;
  queryMode: "message" | "recent" | "full";
  maxSummaryChars: number;
  recentUserTurns: number;
  recentAssistantTurns: number;
  recentUserChars: number;
  recentAssistantChars: number;
  logging: boolean;
  cacheTtlMs: number;
  circuitBreakerMaxTimeouts: number;
  circuitBreakerCooldownMs: number;
  persistTranscripts: boolean;
  transcriptDir: string;
};
type ActiveRecallRecentTurn = {
  role: "user" | "assistant";
  text: string;
};
type PluginDebugEntry = {
  pluginId: string;
  lines: string[];
};
type ActiveMemorySearchDebug = {
  backend?: string;
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
  searchMs?: number;
  hits?: number;
  warning?: string;
  action?: string;
  error?: string;
};
type ActiveRecallResult = {
  status: "empty" | "failed" | "no_relevant_memory" | "timeout" | "unavailable";
  elapsedMs: number;
  summary: string | null;
  searchDebug?: ActiveMemorySearchDebug;
} | {
  status: "timeout_partial";
  elapsedMs: number;
  summary: string;
  searchDebug?: ActiveMemorySearchDebug;
} | {
  status: "ok";
  elapsedMs: number;
  rawReply: string;
  summary: string;
  searchDebug?: ActiveMemorySearchDebug;
};
type ActiveMemoryPartialTimeoutError = Error & {
  activeMemoryPartialReply?: string;
  activeMemorySearchDebug?: ActiveMemorySearchDebug;
  activeMemoryUnavailableMemorySearch?: boolean;
};
type TranscriptReadLimits = {
  maxChars?: number;
  maxLines?: number;
  maxBytes?: number;
};
type ActiveMemoryTranscriptSource = {
  kind: "runtime";
  target: SessionTranscriptTargetParams;
} | {
  kind: "file";
  sessionFile: string;
};
type RecallSubagentResult = {
  rawReply: string;
  resultStatus?: "failed" | "unavailable";
  transcriptPath?: string;
  searchDebug?: ActiveMemorySearchDebug;
  hasUsableMemoryResult?: boolean;
  hasUnavailableMemorySearchResult?: boolean;
};
type TerminalMemorySearchResult = {
  status: "unavailable";
  hasUsableMemoryResult: boolean;
  searchDebug?: ActiveMemorySearchDebug;
};
type TerminalMemorySearchWatch = {
  promise: Promise<TerminalMemorySearchResult>;
  stop: () => void;
};
type CachedActiveRecallResult = {
  expiresAt: number;
  result: ActiveRecallResult;
};
type ActiveMemoryChatType = "direct" | "group" | "channel" | "explicit";
type ActiveMemoryMode = "escalate" | "always" | "off";
type ActiveMemoryToggleEntry = {
  sessionKey: string;
  disabled: true;
  updatedAt: number;
};
type ActiveMemoryThinkingLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
type ActiveMemoryFastMode = boolean | "auto";
type ConversationRecallContext = NonNullable<OpenClawPluginToolContext["conversationRecall"]>;
type ActiveMemoryPromptStyle = "balanced" | "strict" | "contextual" | "recall-heavy" | "precision-heavy" | "preference-only";
declare const ACTIVE_MEMORY_STATUS_PREFIX = "🧩 Active Memory:";
declare const ACTIVE_MEMORY_DEBUG_PREFIX = "🔎 Active Memory Debug:";
declare const ACTIVE_MEMORY_PLUGIN_TAG = "active_memory_plugin";
declare const ACTIVE_MEMORY_CONTEXT_HEADER = "Context:";
declare const ACTIVE_MEMORY_OPEN_TAG = "<active_memory_plugin>";
declare const ACTIVE_MEMORY_CLOSE_TAG = "</active_memory_plugin>";
declare const MAX_LOG_VALUE_CHARS = 300;
type CircuitBreakerEntry = {
  consecutiveTimeouts: number;
  lastTimeoutAt: number;
};
//#endregion
export { MAX_TIMEOUT_MS as $, DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS as A, DEFAULT_RECENT_USER_CHARS as B, CachedActiveRecallResult as C, DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW as D, DEFAULT_ACTIVE_MEMORY_MODE as E, DEFAULT_MIN_TIMEOUT_MS as F, DEFAULT_TRANSCRIPT_READ_MAX_BYTES as G, DEFAULT_SETUP_GRACE_TIMEOUT_MS as H, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS as I, LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW as J, DEFAULT_TRANSCRIPT_READ_MAX_LINES as K, DEFAULT_QUERY_MODE as L, DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS as M, DEFAULT_MAX_CACHE_ENTRIES as N, DEFAULT_AGENT_ID as O, DEFAULT_MAX_SUMMARY_CHARS as P, MAX_SETUP_GRACE_TIMEOUT_MS as Q, DEFAULT_RECENT_ASSISTANT_CHARS as R, CACHE_SWEEP_INTERVAL_MS as S, ConversationRecallContext as T, DEFAULT_TIMEOUT_MS as U, DEFAULT_RECENT_USER_TURNS as V, DEFAULT_TRANSCRIPT_DIR as W, MAX_ACTIVE_MEMORY_TOOLS_ALLOW as X, MAX_ACTIVE_MEMORY_SEARCH_QUERY_CHARS as Y, MAX_LOG_VALUE_CHARS as Z, ActiveMemoryToggleEntry as _, ACTIVE_MEMORY_OPEN_TAG as a, STRUCTURED_MEMORY_EMPTY_STATUSES as at, ActiveRecallRecentTurn as b, ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW as c, TIMEOUT_BOILERPLATE_PATTERNS as ct, ActiveMemoryFastMode as d, TerminalMemorySearchWatch as dt, NO_RECALL_VALUES as et, ActiveMemoryMode as f, TranscriptReadLimits as ft, ActiveMemoryThinkingLevel as g, ActiveMemorySearchDebug as h, ACTIVE_MEMORY_DEBUG_PREFIX as i, ResolvedActiveRecallPluginConfig as it, DEFAULT_CIRCUIT_BREAKER_MAX_TIMEOUTS as j, DEFAULT_CACHE_TTL_MS as k, ACTIVE_MEMORY_STATUS_PREFIX as l, TIMEOUT_PARTIAL_DATA_GRACE_MS as lt, ActiveMemoryPromptStyle as m, ACTIVE_MEMORY_CLOSE_TAG as n, RECALLED_CONTEXT_LINE_PATTERNS as nt, ACTIVE_MEMORY_PLUGIN_TAG as o, STRUCTURED_MEMORY_FAILURE_STATUSES as ot, ActiveMemoryPartialTimeoutError as p, HOOK_TIMEOUT_RECOVERY_GRACE_MS as q, ACTIVE_MEMORY_CONTEXT_HEADER as r, RecallSubagentResult as rt, ACTIVE_MEMORY_RECALL_LANE as s, TERMINAL_MEMORY_SEARCH_POLL_INTERVAL_MS as st, ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS as t, PluginDebugEntry as tt, ActiveMemoryChatType as u, TerminalMemorySearchResult as ut, ActiveMemoryTranscriptSource as v, CircuitBreakerEntry as w, ActiveRecallResult as x, ActiveRecallPluginConfig as y, DEFAULT_RECENT_ASSISTANT_TURNS as z };