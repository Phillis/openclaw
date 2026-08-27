import { ft as TranscriptReadLimits, h as ActiveMemorySearchDebug, rt as RecallSubagentResult, v as ActiveMemoryTranscriptSource, x as ActiveRecallResult } from "../../types-3KLlWwCz.js";

//#region extensions/active-memory/transcript-result.d.ts
declare function readMemoryToolResultEvidence(params: {
  toolName: string;
  result: unknown;
  isError: boolean;
  toolsAllow: readonly string[];
}): {
  hasUsableMemoryResult: boolean;
  hasUnavailableMemorySearchResult: boolean;
};
declare function readPartialAssistantText(source: ActiveMemoryTranscriptSource | string | undefined, limits?: TranscriptReadLimits): Promise<string | null>;
declare function readPartialAssistantTextFromSources(sources: readonly ActiveMemoryTranscriptSource[], limits?: TranscriptReadLimits): Promise<string | null>;
declare function attachPartialTimeoutData(error: unknown, partialReply: string | null, searchDebug: ActiveMemorySearchDebug | undefined, hasUnavailableMemorySearchResult: boolean): void;
declare function readPartialTimeoutData(error: unknown): {
  rawReply?: string;
  searchDebug?: ActiveMemorySearchDebug;
  hasUnavailableMemorySearchResult?: boolean;
};
declare function buildTimeoutRecallResult(params: {
  elapsedMs: number;
  maxSummaryChars: number;
  transcriptSources: readonly ActiveMemoryTranscriptSource[];
  rawReply?: string;
  searchDebug?: ActiveMemorySearchDebug;
  hasUnavailableMemorySearchResult?: boolean;
  subagentPromise?: Promise<RecallSubagentResult>;
  toolsAllow: readonly string[];
}): Promise<ActiveRecallResult>;
declare function buildSubagentRecallResult(params: {
  subagentResult: RecallSubagentResult;
  fallbackSearchDebug?: ActiveMemorySearchDebug;
  fallbackHasUsableMemoryResult?: boolean;
  elapsedMs: number;
  maxSummaryChars: number;
}): ActiveRecallResult;
declare function resetActiveMemoryTranscriptForTests(): void;
declare function setTimeoutPartialDataGraceMsForTests(value: number): void;
//#endregion
export { attachPartialTimeoutData, buildSubagentRecallResult, buildTimeoutRecallResult, readMemoryToolResultEvidence, readPartialAssistantText, readPartialAssistantTextFromSources, readPartialTimeoutData, resetActiveMemoryTranscriptForTests, setTimeoutPartialDataGraceMsForTests };