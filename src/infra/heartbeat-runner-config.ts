import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { resolveAgentConfig } from "../agents/agent-scope.js";
import { resolveModelRefFromString, type ModelRef } from "../agents/model-selection.js";
import { resolveEffectiveAgentRuntime } from "../agents/thinking-runtime.js";
import {
  resolveHeartbeatPromptCore as resolveHeartbeatPromptText,
  resolveHeartbeatPromptForResponseTool,
} from "../auto-reply/heartbeat.js";
import { resolveDefaultModel } from "../auto-reply/reply/directive-handling.defaults.js";
import { normalizeChatType, type ChatType } from "../channels/chat-type.js";
import { getChannelPlugin } from "../channels/plugins/index.js";
import type { ChannelId, ChannelPlugin } from "../channels/plugins/types.public.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { getActivePluginChannelRegistry } from "../plugins/runtime.js";
import type { HeartbeatConfig } from "./heartbeat-config.js";

/**
 * Hard, non-refundable model-turn budget for every heartbeat-runner wake
 * (scheduled poll, cron task, exec/event immediate). Bounds background tool
 * marathons that would otherwise run to the wall-clock timeout; the run
 * settles gracefully through the normal terminal machinery at the cap.
 * User/manual conversation turns never pass through the heartbeat runner and
 * stay unbounded. Constant, not config — the out-of-box blast radius is the
 * product decision (2026-09 heartbeat token storm: one poll burned 10.16M
 * input tokens across 173 uncached turns before its 1800s timeout).
 */
export const DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET = 40;

/**
 * Default cap for isolated heartbeat transcript windows (bounded-transcript
 * burn fix, 2026-09-14): a wedged heartbeat conversation replays in full on
 * every beat, so windows rotate to a fresh context-engine conversation once
 * the stored transcript crosses this many tokens.
 */
export const DEFAULT_HEARTBEAT_MAX_TRANSCRIPT_TOKENS = 120_000;

/** Resolves the isolated-heartbeat transcript cap; 0 disables window rotation. */
export function resolveHeartbeatMaxTranscriptTokens(heartbeat?: HeartbeatConfig) {
  const cap = heartbeat?.maxTranscriptTokens;
  if (typeof cap === "number" && Number.isFinite(cap) && cap >= 0) {
    return Math.floor(cap);
  }
  return DEFAULT_HEARTBEAT_MAX_TRANSCRIPT_TOKENS;
}

/**
 * Default wedge window for the heartbeat zero-transcript watchdog (P0-2, RCA
 * beat-wedge plan #17): if a RUNNING beat has written ZERO transcript events
 * for its session within this window of run start, the run is killed and the
 * ordinary cron retry is scheduled immediately instead of waiting out the full
 * budget. Every observed beat-wedge failure waited 1685-1800 s for exactly the
 * same zero-transcript observation.
 */
export const DEFAULT_HEARTBEAT_ZERO_TRANSCRIPT_KILL_MS = 300_000;

/**
 * Resolves the heartbeat zero-transcript watchdog window from
 * `agents.defaults.heartbeatZeroTranscriptKillMs`; 0 disables the watchdog.
 * Default ON (missing field resolves to the default window).
 */
export function resolveHeartbeatZeroTranscriptKillMs(cfg?: OpenClawConfig) {
  const raw = cfg?.agents?.defaults?.heartbeatZeroTranscriptKillMs;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) {
    return Math.floor(raw);
  }
  return DEFAULT_HEARTBEAT_ZERO_TRANSCRIPT_KILL_MS;
}

/**
 * Resolves `agents.defaults.heartbeatTurnReceiptRequired` (W2): when true, a
 * completed beat must leave disk evidence of work — a persisted heartbeat
 * outcome row, at least one transcript event for its run session, or an
 * explicit heartbeat tool response — before its `ran` result is authored;
 * otherwise the beat fails as `turn-receipt-missing` and the cron retry
 * re-runs it. Default OFF: unset keeps current behavior byte-identical.
 */
export function resolveHeartbeatTurnReceiptRequired(cfg?: OpenClawConfig) {
  return cfg?.agents?.defaults?.heartbeatTurnReceiptRequired === true;
}

export function resolveHeartbeatChannelPlugin(channel: string): ChannelPlugin | undefined {
  const activePlugin = getActivePluginChannelRegistry()?.channels.find(
    (entry) => entry.plugin.id === channel,
  )?.plugin;
  return activePlugin ?? getChannelPlugin(channel as ChannelId);
}

function resolveHeartbeatPromptRaw(cfg: OpenClawConfig, heartbeat?: HeartbeatConfig) {
  return heartbeat?.prompt ?? cfg.agents?.defaults?.heartbeat?.prompt;
}

export function resolveConfiguredHeartbeatPrompt(cfg: OpenClawConfig, heartbeat?: HeartbeatConfig) {
  return resolveHeartbeatPromptText(resolveHeartbeatPromptRaw(cfg, heartbeat));
}

export function resolveHeartbeatResponseToolPrompt(
  cfg: OpenClawConfig,
  heartbeat?: HeartbeatConfig,
) {
  return resolveHeartbeatPromptForResponseTool(resolveHeartbeatPromptRaw(cfg, heartbeat));
}

function resolveHeartbeatModelRef(params: {
  cfg: OpenClawConfig;
  agentId: string;
  heartbeat?: HeartbeatConfig;
  entry?: SessionEntry;
}): ModelRef {
  const { defaultProvider, defaultModel, aliasIndex } = resolveDefaultModel({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  const heartbeatRaw =
    normalizeOptionalString(params.heartbeat?.model) ??
    normalizeOptionalString(params.cfg.agents?.defaults?.heartbeat?.model) ??
    "";
  const heartbeatRef = heartbeatRaw
    ? resolveModelRefFromString({
        raw: heartbeatRaw,
        defaultProvider,
        aliasIndex,
      })?.ref
    : undefined;
  if (heartbeatRef) {
    return heartbeatRef;
  }
  return {
    provider:
      normalizeOptionalString(params.entry?.providerOverride) ??
      normalizeOptionalString(params.entry?.modelProvider) ??
      defaultProvider,
    model:
      normalizeOptionalString(params.entry?.modelOverride) ??
      normalizeOptionalString(params.entry?.model) ??
      defaultModel,
  };
}

function usesCodexHarness(params: {
  cfg: OpenClawConfig;
  agentId: string;
  heartbeat?: HeartbeatConfig;
  entry?: SessionEntry;
  sessionKey?: string;
}): boolean {
  const modelRef = resolveHeartbeatModelRef(params);
  return (
    resolveEffectiveAgentRuntime({
      cfg: params.cfg,
      provider: modelRef.provider,
      modelId: modelRef.model,
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      sessionEntry: params.entry,
    }) === "codex"
  );
}

export function shouldUseHeartbeatResponseToolPrompt(params: {
  cfg: OpenClawConfig;
  agentId: string;
  heartbeat?: HeartbeatConfig;
  entry?: SessionEntry;
  sessionKey?: string;
  chatType?: ChatType;
}): boolean {
  const chatType = normalizeChatType(params.chatType);
  const visibleReplies =
    chatType === "group" || chatType === "channel"
      ? (params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies)
      : params.cfg.messages?.visibleReplies;
  if (visibleReplies === "message_tool") {
    return true;
  }
  if (visibleReplies === "automatic") {
    return false;
  }
  return usesCodexHarness(params);
}

export function isHeartbeatTypingEnabled(params: {
  cfg: OpenClawConfig;
  agentId: string;
  hasChatDelivery: boolean;
}) {
  if (!params.hasChatDelivery) {
    return false;
  }
  const typingMode =
    resolveAgentConfig(params.cfg, params.agentId)?.typingMode ??
    params.cfg.agents?.defaults?.typingMode;
  return typingMode !== "never";
}

export function resolveHeartbeatTypingIntervalSeconds(cfg: OpenClawConfig) {
  const configured = cfg.agents?.defaults?.typingIntervalSeconds;
  return typeof configured === "number" && configured > 0 ? configured : undefined;
}
