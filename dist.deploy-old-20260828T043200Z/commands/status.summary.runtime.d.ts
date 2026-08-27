import { i as OpenClawConfig } from "../types.openclaw-ClnaeuRs.js";
import "../types-Db5QLc7j.js";
import { a as SessionEntry } from "../types-BHAWRYWo.js";
import "../models-config.runtime-DCMc06F8.js";
//#region src/agents/context-resolution.d.ts
type ContextTokenResolutionParams = {
  cfg?: OpenClawConfig;
  provider?: string;
  modelProvider?: string;
  model?: string;
  fallbackContextTokens?: number;
  modelContextWindow?: number;
  modelContextTokens?: number;
  allowAsyncLoad?: boolean;
  allowUnscopedModelLookup?: boolean;
};
/** Returns only the per-model contextTokens value authored in OpenClaw config. */
declare function resolveAuthoredModelContextTokens(params: Pick<ContextTokenResolutionParams, "cfg" | "provider" | "modelProvider" | "model">): number | undefined;
declare function resolveContextTokensForModelFromCache(params: ContextTokenResolutionParams, lookupContextTokens?: (modelId?: string) => number | undefined, lookupContextWindow?: (modelId?: string) => number | undefined): number | undefined;
//#endregion
//#region src/agents/context.d.ts
declare function waitForContextWindowCacheLoad(options?: {
  timeoutMs?: number;
}): Promise<"idle" | "loaded" | "timeout">;
//#endregion
//#region src/sessions/classify-session-kind.d.ts
type SessionKind = "cron" | "direct" | "group" | "global" | "spawn-child" | "unknown";
/**
 * Classify a session key + entry into a display kind.
 *
 * Evaluation order matters — more-specific signals take priority:
 *   1. sentinel keys ("global", "unknown")
 *   2. cron key shape
 *   3. spawn-child (entry has `spawnedBy`) — checked before key-shape so ACP
 *      spawn-child sessions with opaque keys are not misclassified as "direct"
 *   4. group/channel chatType or key-shape substring
 *   5. fallback: "direct"
 */
declare function classifySessionKind(key: string, entry?: {
  chatType?: string | null;
  spawnedBy?: string | null;
}): SessionKind;
//#endregion
//#region src/status/summary.runtime.d.ts
declare function resolveConfiguredStatusModelRef(params: {
  cfg: OpenClawConfig;
  defaultProvider: string;
  defaultModel: string;
  agentId?: string;
}): {
  provider: string;
  model: string;
};
declare function resolveStatusModelLookupRef(params: {
  provider?: unknown;
  model?: unknown;
  defaultProvider?: unknown;
}): {
  provider: string;
  model: string;
} | null;
declare function resolveStatusModelComparisonLabel(params: {
  provider?: unknown;
  model?: unknown;
  defaultProvider?: unknown;
}): string | null;
declare function resolveSessionModelRef(cfg: OpenClawConfig, entry?: SessionEntry | Pick<SessionEntry, "model" | "modelProvider" | "modelOverride" | "providerOverride">, agentId?: string): {
  provider: string;
  model: string;
};
declare function resolveSessionRuntime(params: {
  cfg: OpenClawConfig;
  entry?: SessionEntry;
  provider: string;
  model: string;
  agentId?: string;
  sessionKey: string;
}): {
  id: string | undefined;
  label: string;
};
declare const statusSummaryRuntime: {
  waitForContextWindowCacheLoad: typeof waitForContextWindowCacheLoad;
  resolveAuthoredModelContextTokens: typeof resolveAuthoredModelContextTokens;
  resolveContextTokensForModel: typeof resolveContextTokensForModelFromCache;
  classifySessionKey: typeof classifySessionKind;
  resolveSessionModelRef: typeof resolveSessionModelRef;
  resolveSessionRuntime: typeof resolveSessionRuntime;
  resolveConfiguredStatusModelRef: typeof resolveConfiguredStatusModelRef;
  resolveStatusModelLookupRef: typeof resolveStatusModelLookupRef;
  resolveStatusModelComparisonLabel: typeof resolveStatusModelComparisonLabel;
};
//#endregion
export { statusSummaryRuntime };