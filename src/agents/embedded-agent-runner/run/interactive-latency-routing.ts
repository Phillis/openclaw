/**
 * Interactive-latency provider routing (config-gated, default OFF).
 *
 * Interactive Slack lanes run the same model much faster on alternate provider
 * mirrors than on the cache-optimized primary (measured: glm-5.3-flash 2.2s
 * median on ollama-cloud vs 16.4s on zai). When
 * `models.interactiveLatencyRouting.enabled` is true, interactive user turns on
 * the configured channel kinds prefer the configured (provider, model) mirror
 * list, first healthy entry wins; unhealthy or persistently slow mirrors fall
 * back to the agent's configured model.
 *
 * Non-interactive lanes never match: cron, subagent, incognito, ACP, and
 * heartbeat runs keep their configured (cache-optimized) routing. Plugin
 * `before_model_resolve` decisions keep priority — this fast path only fills
 * turns no hook routed.
 */
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import {
  isAcpSessionKey,
  isCronSessionKey,
  isSubagentSessionKey,
  parseSessionDeliveryRoute,
} from "../../../sessions/session-key-utils.js";
import { isIncognitoSessionKey } from "../../../shared/incognito-session-key.js";

export type InteractiveLatencyRouteEntry = {
  provider: string;
  model: string;
};

export type InteractiveLatencyRoutingSettings = {
  enabled: boolean;
  /** Channel ids (lowercased) whose delivery-shaped lanes count as interactive. */
  kinds: string[];
  prefer: InteractiveLatencyRouteEntry[];
  fallbackToConfigured: boolean;
  maxFallbackLatencyMs: number;
};

const DEFAULT_MAX_FALLBACK_LATENCY_MS = 15_000;
/** Two consecutive slow calls park a mirror until a within-budget success. */
const SLOW_STRIKES_TO_UNHEALTHY = 2;
/** Two consecutive errored calls park a mirror until a success. */
const FAILURE_STRIKES_TO_UNHEALTHY = 2;

type PreferredRouteHealth = {
  consecutiveFailures: number;
  consecutiveSlow: number;
};

const HEALTH_MAP_MAX_ENTRIES = 64;
const healthByRouteKey = new Map<string, PreferredRouteHealth>();

function routeKey(provider: string, model: string): string {
  return `${provider.trim().toLowerCase()}/${model.trim().toLowerCase()}`;
}

function pruneHealthMap(): void {
  while (healthByRouteKey.size > HEALTH_MAP_MAX_ENTRIES) {
    const oldest = healthByRouteKey.keys().next().value;
    if (oldest === undefined) {
      break;
    }
    healthByRouteKey.delete(oldest);
  }
}

/**
 * Reads the routing settings from config. Returns undefined when the block is
 * absent or disabled — the exact today's-behavior default.
 */
export function resolveInteractiveLatencyRoutingSettings(
  cfg: OpenClawConfig | undefined,
): InteractiveLatencyRoutingSettings | undefined {
  const block = cfg?.models?.interactiveLatencyRouting;
  if (!block?.enabled) {
    return undefined;
  }
  const prefer = (block.prefer ?? [])
    .map((entry) => ({
      provider: entry.provider?.trim() ?? "",
      model: entry.model?.trim() ?? "",
    }))
    .filter((entry) => entry.provider && entry.model);
  if (prefer.length === 0) {
    return undefined;
  }
  const kinds = (block.sessionMatch?.kinds ?? [])
    .map((kind) => kind?.trim().toLowerCase() ?? "")
    .filter(Boolean);
  if (kinds.length === 0) {
    return undefined;
  }
  return {
    enabled: true,
    kinds,
    prefer,
    fallbackToConfigured: block.fallbackToConfigured ?? true,
    maxFallbackLatencyMs: block.maxFallbackLatencyMs ?? DEFAULT_MAX_FALLBACK_LATENCY_MS,
  };
}

/**
 * True when the session key is an interactive delivery lane on one of the
 * configured channel kinds. Cron, subagent, incognito, and ACP keys are
 * structurally not delivery routes and never match.
 */
export function isInteractiveLatencyRoutingSessionKey(
  sessionKey: string | undefined | null,
  kinds: readonly string[],
): boolean {
  if (!sessionKey || kinds.length === 0) {
    return false;
  }
  if (
    isCronSessionKey(sessionKey) ||
    isSubagentSessionKey(sessionKey) ||
    isAcpSessionKey(sessionKey) ||
    isIncognitoSessionKey(sessionKey)
  ) {
    return false;
  }
  const route = parseSessionDeliveryRoute(sessionKey);
  if (!route) {
    return false;
  }
  return kinds.includes(route.channel);
}

/** True when the mirror is allowed to carry new interactive turns. */
export function isInteractiveLatencyRouteHealthy(provider: string, model: string): boolean {
  const health = healthByRouteKey.get(routeKey(provider, model));
  if (!health) {
    return true;
  }
  return (
    health.consecutiveFailures < FAILURE_STRIKES_TO_UNHEALTHY &&
    health.consecutiveSlow < SLOW_STRIKES_TO_UNHEALTHY
  );
}

/**
 * Records one model-call outcome for mirror health. Bounded in-memory counters
 * only — no durable state, no behavior change when routing is disabled. Any
 * call to the pair counts (mirrors serve background fallbacks too), so health
 * reflects what callers actually experienced.
 */
export function recordInteractiveLatencyRouteObservation(params: {
  provider: string | undefined;
  model: string | undefined;
  durationMs: number;
  errored: boolean;
  maxFallbackLatencyMs?: number;
}): void {
  const provider = params.provider?.trim();
  const model = params.model?.trim();
  if (!provider || !model || !Number.isFinite(params.durationMs)) {
    return;
  }
  const key = routeKey(provider, model);
  const health = healthByRouteKey.get(key) ?? { consecutiveFailures: 0, consecutiveSlow: 0 };
  const slowThreshold = params.maxFallbackLatencyMs ?? DEFAULT_MAX_FALLBACK_LATENCY_MS;
  if (params.errored) {
    health.consecutiveFailures += 1;
  } else if (params.durationMs > slowThreshold) {
    health.consecutiveSlow += 1;
    health.consecutiveFailures = 0;
  } else {
    health.consecutiveFailures = 0;
    health.consecutiveSlow = 0;
  }
  healthByRouteKey.set(key, health);
  // Re-insert to keep the map recency-ordered for pruning.
  if (healthByRouteKey.size > HEALTH_MAP_MAX_ENTRIES) {
    healthByRouteKey.delete(key);
    healthByRouteKey.set(key, health);
    pruneHealthMap();
  }
}

/** Clears mirror-health counters (test isolation only). */
export function resetInteractiveLatencyRouteHealthForTests(): void {
  healthByRouteKey.clear();
}

/** Triggers that carry interactive user turns. Heartbeat/cron/memory never route. */
const INTERACTIVE_TRIGGERS = new Set(["user", "manual"]);

export type InteractiveLatencyRouteDecision = {
  provider: string;
  modelId: string;
  routed: boolean;
  reason?: string;
};

/**
 * Decides whether this run's model selection should move to a preferred
 * interactive mirror. Pure gate + selection; callers apply the returned
 * selection only when `routed` is true.
 *
 * Gates (all required): routing enabled in config, interactive trigger, session
 * key on a configured interactive channel kind, selection not locked, no
 * plugin hook override, no pinned native harness, and the incoming selection
 * equals the agent's configured default (explicit user pins always win).
 */
export function resolveInteractiveLatencyRoute(params: {
  settings: InteractiveLatencyRoutingSettings | undefined;
  sessionKey: string | undefined | null;
  trigger: string | undefined;
  incomingProvider: string;
  incomingModelId: string;
  configuredProvider: string;
  configuredModelId: string;
  modelSelectionLocked?: boolean;
  hookSelectionChanged?: boolean;
  nativeSessionOwned?: boolean;
  sessionModelOverride?: boolean;
}): InteractiveLatencyRouteDecision {
  const keep: InteractiveLatencyRouteDecision = {
    provider: params.incomingProvider,
    modelId: params.incomingModelId,
    routed: false,
  };
  const settings = params.settings;
  if (!settings) {
    return keep;
  }
  if (params.trigger !== undefined && !INTERACTIVE_TRIGGERS.has(params.trigger)) {
    return { ...keep, reason: "trigger-not-interactive" };
  }
  if (!isInteractiveLatencyRoutingSessionKey(params.sessionKey, settings.kinds)) {
    return { ...keep, reason: "session-not-interactive" };
  }
  if (params.modelSelectionLocked) {
    return { ...keep, reason: "model-selection-locked" };
  }
  if (params.hookSelectionChanged) {
    return { ...keep, reason: "hook-override-present" };
  }
  if (params.nativeSessionOwned) {
    return { ...keep, reason: "native-session-owned" };
  }
  if (params.sessionModelOverride) {
    return { ...keep, reason: "session-model-override" };
  }
  const incomingIsConfiguredDefault =
    params.incomingProvider === params.configuredProvider &&
    params.incomingModelId === params.configuredModelId;
  if (!incomingIsConfiguredDefault) {
    return { ...keep, reason: "explicit-selection" };
  }
  const healthy = settings.prefer.find((entry) =>
    isInteractiveLatencyRouteHealthy(entry.provider, entry.model),
  );
  if (healthy) {
    return {
      provider: healthy.provider,
      modelId: healthy.model,
      routed: true,
      reason: "preferred-healthy",
    };
  }
  if (!settings.fallbackToConfigured && settings.prefer[0]) {
    return {
      provider: settings.prefer[0].provider,
      modelId: settings.prefer[0].model,
      routed: true,
      reason: "preferred-sticky",
    };
  }
  return { ...keep, reason: "preferred-unhealthy-fallback-configured" };
}
