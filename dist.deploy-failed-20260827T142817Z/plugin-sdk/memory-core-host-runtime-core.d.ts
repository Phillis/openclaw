import { lt as MemoryCitationsMode, n as OpenClawConfig } from "../types.openclaw-CNftZ6Ix.js";
import { Cn as clearMemoryPluginState, Mn as resolveMemorySearchConfig, Nn as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR, Tn as registerMemoryCapability, Yt as MemoryCorpusSearchResult, an as MemoryFlushPlan, on as MemoryPluginRuntime, sn as MemoryPromptSectionBuilder, wn as listMemoryCorpusSupplements } from "../types-lxuSJRGv.js";
import { b as readToolStringParam, h as readFiniteNumberParam, m as asToolParamsRecord, p as AnyAgentTool, v as readPositiveIntegerParam, x as jsonResult } from "../cron-creator-authority-context-DAum5N8q.js";
import { r as getRuntimeConfig, t as resolveStateDir } from "../config-C7FyWyXj.js";
import { n as resolveSessionAgentIds } from "../model-selection-C3yS-lrH.js";
import { n as parseAgentSessionKey } from "../session-key-utils-Dnjnq3Ss.js";
import { i as resolveDefaultAgentId, t as listAgentIds } from "../sessions-B0DQ_ChK.js";
import { n as resolveSessionTranscriptsDirForAgent } from "../paths-Bf-grF6E.js";
import { r as resolveRememberAcrossConversations } from "../config-utils-D-FmpNxc.js";
import { w as resolveMemoryDreamingPluginConfig } from "../dreaming-D1J76-UV.js";

//#region src/agents/current-time.d.ts
type CronStyleNow = {
  userTimezone: string;
  formattedTime: string;
  timeLine: string;
};
type TimeConfigLike = {
  agents?: {
    defaults?: {
      userTimezone?: string;
      timeFormat?: "auto" | "12" | "24";
    };
  };
};
/** Resolve localized and UTC current-time text for agent prompts. */
declare function resolveCronStyleNow(cfg: TimeConfigLike, nowMs: number): CronStyleNow;
//#endregion
//#region src/auto-reply/tokens.d.ts
/** Token that marks an auto-reply response as intentionally silent. */
declare const SILENT_REPLY_TOKEN = "NO_REPLY";
//#endregion
//#region src/config/byte-size.d.ts
/**
 * Parse an optional byte-size value from config.
 * Accepts non-negative numbers or strings like "2mb".
 */
declare function parseNonNegativeByteSize(value: unknown): number | null;
//#endregion
export { type AnyAgentTool, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR, type MemoryCitationsMode, type MemoryCorpusSearchResult, type MemoryFlushPlan, type MemoryPluginRuntime, type MemoryPromptSectionBuilder, type OpenClawConfig, SILENT_REPLY_TOKEN, asToolParamsRecord, clearMemoryPluginState, getRuntimeConfig, jsonResult, listAgentIds, listMemoryCorpusSupplements, parseAgentSessionKey, parseNonNegativeByteSize, readFiniteNumberParam, readPositiveIntegerParam, readToolStringParam as readStringParam, registerMemoryCapability, resolveCronStyleNow, resolveDefaultAgentId, resolveMemoryDreamingPluginConfig, resolveMemorySearchConfig, resolveRememberAcrossConversations, resolveSessionAgentIds, resolveSessionTranscriptsDirForAgent, resolveStateDir };