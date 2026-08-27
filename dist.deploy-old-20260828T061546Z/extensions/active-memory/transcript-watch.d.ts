import { dt as TerminalMemorySearchWatch, ft as TranscriptReadLimits, h as ActiveMemorySearchDebug, v as ActiveMemoryTranscriptSource } from "../../types-B0IzvLgE.js";
//#region extensions/active-memory/transcript-watch.d.ts
declare function readActiveMemorySearchDebug(source: ActiveMemoryTranscriptSource | string, limits?: TranscriptReadLimits): Promise<ActiveMemorySearchDebug | undefined>;
declare function readMergedActiveMemoryTranscriptState(params: {
  sources: readonly ActiveMemoryTranscriptSource[];
  toolsAllow: readonly string[];
}): Promise<{
  searchDebug?: ActiveMemorySearchDebug;
  hasUsableMemoryResult: boolean;
  hasUnavailableMemorySearchResult: boolean;
}>;
declare function watchTerminalMemorySearchResult(params: {
  getTranscriptSources: () => readonly ActiveMemoryTranscriptSource[];
  abortSignal: AbortSignal;
  toolsAllow: readonly string[];
}): TerminalMemorySearchWatch;
declare function readActiveMemorySearchDebugFromRunResult(result: unknown): ActiveMemorySearchDebug | undefined;
declare function readActiveMemorySessionFileFromRunResult(result: unknown): string | undefined;
//#endregion
export { readActiveMemorySearchDebug, readActiveMemorySearchDebugFromRunResult, readActiveMemorySessionFileFromRunResult, readMergedActiveMemoryTranscriptState, watchTerminalMemorySearchResult };