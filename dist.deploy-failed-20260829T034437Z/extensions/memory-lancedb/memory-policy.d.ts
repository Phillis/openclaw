import { i as MemoryCategory } from "../../config-Cd958lsI.js";
import { o as MemorySearchResult } from "../../lancedb-store-DPrHOUx9.js";
//#region extensions/memory-lancedb/memory-policy.d.ts
type AutoCaptureCursor = {
  nextIndex: number;
  lastMessageFingerprint?: string;
};
declare function extractUserTextContent(message: unknown): string[];
declare function extractLatestUserText(messages: unknown[]): string | undefined;
declare function normalizeRecallQuery(text: string, maxChars?: number): string;
declare function messageFingerprint(message: unknown): string;
declare function resolveAutoCaptureStartIndex(messages: unknown[], cursor: AutoCaptureCursor | undefined): number;
declare function looksLikePromptInjection(text: string): boolean;
declare function escapeMemoryForPrompt(text: string): string;
declare function findCleanDuplicateMemory(db: {
  search(agentId: string, vector: number[], limit?: number, minScore?: number): Promise<MemorySearchResult[]>;
}, agentId: string, vector: number[], exactText?: string): Promise<MemorySearchResult | undefined>;
declare function cleanMemorySearchResults(results: MemorySearchResult[]): Array<{
  result: MemorySearchResult;
  text: string;
}>;
declare function formatRecalledMemoryForModel(text: string, maxChars?: number): string;
declare function formatRelevantMemoriesContext(memories: Array<{
  category: MemoryCategory;
  text: string;
}>, maxChars?: number): string;
declare function shouldCapture(text: string, options?: {
  customTriggers?: string[];
  maxChars?: number;
}): boolean;
declare function detectCategory(text: string): MemoryCategory;
//#endregion
export { AutoCaptureCursor, cleanMemorySearchResults, detectCategory, escapeMemoryForPrompt, extractLatestUserText, extractUserTextContent, findCleanDuplicateMemory, formatRecalledMemoryForModel, formatRelevantMemoriesContext, looksLikePromptInjection, messageFingerprint, normalizeRecallQuery, resolveAutoCaptureStartIndex, shouldCapture };