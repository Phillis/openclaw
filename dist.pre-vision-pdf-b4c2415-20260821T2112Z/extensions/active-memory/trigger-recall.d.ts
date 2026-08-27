import { G as MemorySearchResult, n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { DatabaseSync } from "node:sqlite";

//#region extensions/active-memory/trigger-recall.d.ts
declare const MAX_TRIGGER_CONTEXT_CHARS = 1800;
declare const STRONG_TRIGGER_MATCH_SCORE = 0.65;
type TriggerRecallMatch = MemorySearchResult & {
  matchScore: number;
};
declare function isPromotedTrustedMemoryEntry(entry: Pick<MemorySearchResult, "path" | "source" | "originClass" | "projectKey">, activeProjectKeys?: readonly string[]): boolean;
declare function scoreTriggerMatch(message: string, entry: MemorySearchResult): number;
declare function selectStrongTriggerMatches(message: string, entries: MemorySearchResult[], activeProjectKeys?: readonly string[]): TriggerRecallMatch[];
declare function buildTriggerRecallContext(matches: TriggerRecallMatch[]): string | undefined;
type TriggerLookupParams = {
  cfg: OpenClawConfig;
  agentId: string;
  query: string;
  activeProjectKeys?: string[];
  signal?: AbortSignal;
  runId?: string;
};
/** Open and exercise the exact local lookup path used by lane 1 before its deadline starts. */
declare function prewarmTriggerRecall(params: TriggerLookupParams): Promise<void>;
declare function resolveTriggerRecall(params: TriggerLookupParams & {
  message: string;
}): Promise<{
  context?: string;
  hasStrongHit: boolean;
  injectedCount: number;
}>;
declare function forgetTriggerRecallPrewarm(runId: string | undefined): void;
declare function resetTriggerRecallPrewarmsForTests(): void;
//#endregion
export { MAX_TRIGGER_CONTEXT_CHARS, STRONG_TRIGGER_MATCH_SCORE, buildTriggerRecallContext, forgetTriggerRecallPrewarm, isPromotedTrustedMemoryEntry, prewarmTriggerRecall, resetTriggerRecallPrewarmsForTests, resolveTriggerRecall, scoreTriggerMatch, selectStrongTriggerMatches };