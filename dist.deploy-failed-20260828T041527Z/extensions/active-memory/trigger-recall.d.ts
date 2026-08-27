import "../../plugin-entry-bE5OaTNY.js";
import { V as MemorySearchResult, n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { DatabaseSync } from "node:sqlite";
//#region extensions/active-memory/trigger-recall.d.ts
declare const MAX_TRIGGER_CONTEXT_CHARS = 1800;
type TriggerRecallMatch = MemorySearchResult & {
  matchScore: number;
};
declare function isPromotedTrustedMemoryEntry(entry: Pick<MemorySearchResult, "provenance" | "projectKey" | "source">, activeProjectKeys?: readonly string[]): boolean;
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
  authorityFingerprint?: string;
};
declare function resolveTriggerRecall(params: TriggerLookupParams & {
  message: string;
}): Promise<{
  context?: string;
  hasStrongHit: boolean;
  injectedCount: number;
}>;
declare function forgetTriggerRecallRun(runId: string | undefined): void;
declare function resetTriggerRecallRunsForTests(): void;
//#endregion
export { MAX_TRIGGER_CONTEXT_CHARS, buildTriggerRecallContext, forgetTriggerRecallRun, isPromotedTrustedMemoryEntry, resetTriggerRecallRunsForTests, resolveTriggerRecall, scoreTriggerMatch, selectStrongTriggerMatches };