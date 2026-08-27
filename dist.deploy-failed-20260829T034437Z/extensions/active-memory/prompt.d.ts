import { it as ResolvedActiveRecallPluginConfig } from "../../types-Cnxh8Kf4.js";
//#region extensions/active-memory/prompt.d.ts
declare function buildRecallPrompt(params: {
  config: ResolvedActiveRecallPluginConfig;
  query: string;
  searchQuery: string;
}): string;
declare function readExplicitMemoryEvidence(source: Record<string, unknown>): boolean | undefined;
declare function readStructuredMemoryFailure(source: unknown): boolean | undefined;
declare function readStructuredMemoryFailureFromContent(content: unknown): boolean | undefined;
declare function readStructuredMemoryEvidenceFromContent(content: unknown): boolean | undefined;
declare function normalizeActiveSummary(rawReply: string): string | null;
declare function truncateSummary(summary: string, maxSummaryChars: number): string;
declare function buildMetadata(summary: string | null): string | undefined;
declare function buildPromptPrefix(summary: string | null): string | undefined;
//#endregion
export { buildMetadata, buildPromptPrefix, buildRecallPrompt, normalizeActiveSummary, readExplicitMemoryEvidence, readStructuredMemoryEvidenceFromContent, readStructuredMemoryFailure, readStructuredMemoryFailureFromContent, truncateSummary };