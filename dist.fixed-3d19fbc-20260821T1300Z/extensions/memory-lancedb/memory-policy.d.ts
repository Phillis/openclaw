import { i as MemoryCategory } from "../../config-BUzmEKad.js";
import { o as MemorySearchResult } from "../../lancedb-store-DetOLK1n.js";

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
}, agentId: string, vector: number[]): Promise<MemorySearchResult | undefined>;
declare function cleanMemorySearchResults(results: MemorySearchResult[]): Array<{
  result: MemorySearchResult;
  text: string;
}>;
declare function formatRelevantMemoriesContext(memories: Array<{
  category: MemoryCategory;
  text: string;
}>): string;
declare function shouldCapture(text: string, options?: {
  customTriggers?: string[];
  maxChars?: number;
}): boolean;
declare function detectCategory(text: string): MemoryCategory;
//#endregion
export { AutoCaptureCursor, cleanMemorySearchResults, detectCategory, escapeMemoryForPrompt, extractLatestUserText, extractUserTextContent, findCleanDuplicateMemory, formatRelevantMemoriesContext, looksLikePromptInjection, messageFingerprint, normalizeRecallQuery, resolveAutoCaptureStartIndex, shouldCapture };