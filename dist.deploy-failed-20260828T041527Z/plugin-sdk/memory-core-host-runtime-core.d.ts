import { dt as MemoryCitationsMode, n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { s as SessionScope } from "../types-DPz-SxBl.js";
import { Br as DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR, Fr as registerMemoryCapability, Nr as clearMemoryPluginState, Pr as listMemoryCorpusSupplements, gr as MemoryPromptSectionBuilder, hr as MemoryPluginRuntime, ir as MemoryCorpusSearchResult, mr as MemoryFlushPlan, zr as resolveMemorySearchConfig } from "../types-DP7cDwEi.js";
import { r as getRuntimeConfig, t as resolveStateDir } from "../config-ApKLtW3N.js";
import { t as resolveSessionAgentIds } from "../session-store-runtime-C3ijbxsj.js";
import { _ as readPositiveIntegerParam, b as jsonResult, f as AnyAgentTool, m as readFiniteNumberParam, p as asToolParamsRecord, y as readToolStringParam } from "../bundle-mcp-B4GOVNpD.js";
import { r as parseAgentSessionKey } from "../session-key-utils-Dm27D6pt.js";
import { a as resolveDefaultAgentId, i as resolveConfiguredAgentId, t as listAgentIds } from "../sessions-CcYLge8i.js";
import { n as resolveSessionTranscriptsDirForAgent } from "../paths-Bf-grF6E.js";
import "../openclaw-runtime-session-FaBbtyZD.js";
import { r as resolveRememberAcrossConversations } from "../config-utils-B7wzb8WG.js";
import { w as resolveMemoryDreamingPluginConfig } from "../dreaming-B8gSLWYv.js";
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
//#region src/agents/agent-compaction-constants.d.ts
/** Caps compaction headroom so every model retains its minimum usable prompt budget. */
declare function resolveEffectiveCompactionReserveTokens(params: {
  contextTokenBudget: number;
  reserveTokens: number;
}): number;
//#endregion
//#region src/config/sessions/main-session-key.d.ts
/** Resolves the configured main session identity for one agent and session scope. */
declare function resolveCanonicalMainSessionKey(params: {
  agentId: string;
  mainKey?: string | undefined;
  sessionScope?: SessionScope;
}): string;
//#endregion
//#region src/memory/memory-artifact-provenance.d.ts
type MemoryArtifactOriginClass = "agent" | "untrusted";
type MemoryArtifactProvenance = {
  fileHash: string;
  originClass: MemoryArtifactOriginClass;
  observedAt: number;
  sessionId?: string;
  sessionKey?: string;
};
declare function readMemoryArtifactProvenance(params: {
  workspaceDir: string;
  relativePath: string;
}): Promise<MemoryArtifactProvenance | undefined>;
declare function listMemoryArtifactProvenance(params: {
  workspaceDir: string;
}): Promise<Array<{
  relativePath: string;
  provenance: MemoryArtifactProvenance;
}>>;
//#endregion
export { type AnyAgentTool, DEFAULT_AGENT_COMPACTION_RESERVE_TOKENS_FLOOR, type MemoryArtifactOriginClass, type MemoryArtifactProvenance, type MemoryCitationsMode, type MemoryCorpusSearchResult, type MemoryFlushPlan, type MemoryPluginRuntime, type MemoryPromptSectionBuilder, type OpenClawConfig, SILENT_REPLY_TOKEN, asToolParamsRecord, clearMemoryPluginState, getRuntimeConfig, jsonResult, listAgentIds, listMemoryArtifactProvenance, listMemoryCorpusSupplements, parseAgentSessionKey, parseNonNegativeByteSize, readFiniteNumberParam, readMemoryArtifactProvenance, readPositiveIntegerParam, readToolStringParam as readStringParam, registerMemoryCapability, resolveCanonicalMainSessionKey, resolveConfiguredAgentId, resolveCronStyleNow, resolveDefaultAgentId, resolveEffectiveCompactionReserveTokens, resolveMemoryDreamingPluginConfig, resolveMemorySearchConfig, resolveRememberAcrossConversations, resolveSessionAgentIds, resolveSessionTranscriptsDirForAgent, resolveStateDir };