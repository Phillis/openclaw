import { C as resolveMemoryDreamingConfig, D as resolveMemoryRemDreamingConfig, E as resolveMemoryLightDreamingConfig, S as resolveMemoryDeepDreamingConfig, T as resolveMemoryDreamingWorkspaces, _ as MEMORY_DREAMING_SYSTEM_EVENT_TEXT, a as DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE, b as formatMemoryDreamingDay, c as DEFAULT_MEMORY_DREAMING_FREQUENCY, d as LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT, f as LEGACY_MEMORY_REM_DREAMING_CRON_NAME, g as MANAGED_MEMORY_DREAMING_CRON_TAG, h as MANAGED_MEMORY_DREAMING_CRON_NAME, i as DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT, l as LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME, m as LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT, n as DEFAULT_MEMORY_DEEP_DREAMING_MAX_PRIOR_ENTRY_LOSS_FRACTION, o as DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES, p as LEGACY_MEMORY_REM_DREAMING_CRON_TAG, r as DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS, s as DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS, t as DEFAULT_MEMORY_DEEP_DREAMING_LIMIT, u as LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG, v as MemoryDreamingPhaseName, x as isSameMemoryDreamingDay, y as MemoryDreamingStorageConfig } from "../dreaming-D1J76-UV.js";

//#region packages/memory-host-sdk/src/host/status-format.d.ts
/** Display tone used by memory status renderers. */
type Tone = "ok" | "warn" | "muted";
/** Resolve vector indexing state from enabled and availability flags. */
declare function resolveMemoryVectorState(vector: {
  enabled: boolean;
  available?: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled" | "unknown";
};
/** Resolve full-text search state from enabled and availability flags. */
declare function resolveMemoryFtsState(fts: {
  enabled: boolean;
  available: boolean;
}): {
  tone: Tone;
  state: "ready" | "unavailable" | "disabled";
};
/** Format cache state as concise status text with optional entry count. */
declare function resolveMemoryCacheSummary(cache: {
  enabled: boolean;
  entries?: number;
}): {
  tone: Tone;
  text: string;
};
//#endregion
export { DEFAULT_MEMORY_DEEP_DREAMING_LIMIT, DEFAULT_MEMORY_DEEP_DREAMING_MAX_PRIOR_ENTRY_LOSS_FRACTION, DEFAULT_MEMORY_DEEP_DREAMING_MAX_PROMOTED_SNIPPET_TOKENS, DEFAULT_MEMORY_DEEP_DREAMING_MIN_RECALL_COUNT, DEFAULT_MEMORY_DEEP_DREAMING_MIN_SCORE, DEFAULT_MEMORY_DEEP_DREAMING_MIN_UNIQUE_QUERIES, DEFAULT_MEMORY_DEEP_DREAMING_RECENCY_HALF_LIFE_DAYS, DEFAULT_MEMORY_DREAMING_FREQUENCY, LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME, LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG, LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT, LEGACY_MEMORY_REM_DREAMING_CRON_NAME, LEGACY_MEMORY_REM_DREAMING_CRON_TAG, LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT, MANAGED_MEMORY_DREAMING_CRON_NAME, MANAGED_MEMORY_DREAMING_CRON_TAG, MEMORY_DREAMING_SYSTEM_EVENT_TEXT, type MemoryDreamingPhaseName, type MemoryDreamingStorageConfig, type Tone, formatMemoryDreamingDay, isSameMemoryDreamingDay, resolveMemoryCacheSummary, resolveMemoryDeepDreamingConfig, resolveMemoryDreamingConfig, resolveMemoryDreamingWorkspaces, resolveMemoryFtsState, resolveMemoryLightDreamingConfig, resolveMemoryRemDreamingConfig, resolveMemoryVectorState };