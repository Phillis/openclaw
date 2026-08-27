import { v as MemoryDreamingPhaseName } from "../dreaming-CuZtfm8Z.js";
//#region src/memory-host-sdk/event-types.d.ts
type MemoryHostEventStorageMetadata = {
  /** True when diagnostic detail was bounded before persistence. Aggregate counts stay exact. */
  storageTruncated?: true;
};
/** Event emitted when a recall query records the selected memory snippets. */
type MemoryHostRecallRecordedEvent = MemoryHostEventStorageMetadata & {
  type: "memory.recall.recorded";
  timestamp: string;
  query: string;
  resultCount: number;
  results: Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
  }>;
};
/** Event emitted when recall hits are visible but excluded from short-term promotion. */
type MemoryHostRecallSkippedEvent = MemoryHostEventStorageMetadata & {
  type: "memory.recall.skipped";
  timestamp: string;
  query: string;
  reason: "non-short-term-memory-path";
  eligibleResultCount: number;
  skippedResultCount: number;
  results: Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    reason: "non-short-term-memory-path";
  }>;
};
/** Event emitted when deep-dream candidates are promoted into durable memory. */
type MemoryHostPromotionAppliedEvent = MemoryHostEventStorageMetadata & {
  type: "memory.promotion.applied";
  timestamp: string;
  memoryPath: string;
  applied: number;
  candidates: Array<{
    key: string;
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    recallCount: number;
  }>;
};
/** Normalized outcome for a dreaming phase run. */
type MemoryDreamOutcome = "completed" | "failed";
/** Event emitted after a dreaming phase writes inline memory and/or reports. */
type MemoryHostDreamCompletedEvent = MemoryHostEventStorageMetadata & {
  type: "memory.dream.completed";
  timestamp: string;
  phase: MemoryDreamingPhaseName;
  /** Missing on older event logs; readers should treat absent as "completed". */
  outcome?: MemoryDreamOutcome;
  /** Error detail when outcome is "failed". */
  error?: string;
  inlinePath?: string;
  reportPath?: string;
  lineCount: number;
  storageMode: "inline" | "separate" | "both";
};
/** Durable memory host events consumed by status and public-artifact readers. */
type MemoryHostEvent = MemoryHostRecallRecordedEvent | MemoryHostPromotionAppliedEvent | MemoryHostDreamCompletedEvent;
/** Full event record schema, including opt-in diagnostic variants. */
type MemoryHostEventRecord = MemoryHostEvent | MemoryHostRecallSkippedEvent;
//#endregion
//#region src/memory-host-sdk/event-store.d.ts
/** Validate and bound one diagnostic event before storing it in plugin state. */
declare function normalizeMemoryHostEventRecordForStorage(value: unknown): MemoryHostEventRecord | null;
//#endregion
//#region src/memory-host-sdk/events.d.ts
/** Resolve the retired JSONL source path without reading it at runtime. */
declare function resolveMemoryHostEventLogPath(workspaceDir: string): string;
/** Append one memory host event to shared SQLite plugin state. */
declare function appendMemoryHostEvent(workspaceDir: string, event: MemoryHostEventRecord, options?: {
  env?: NodeJS.ProcessEnv;
}): Promise<void>;
/** Read recent memory host events, excluding opt-in diagnostic variants. */
declare function readMemoryHostEvents(params: {
  workspaceDir: string;
  limit?: number;
  env?: NodeJS.ProcessEnv;
}): Promise<MemoryHostEvent[]>;
/** Read recent memory host event records, including opt-in diagnostic variants. */
declare function readMemoryHostEventRecords(params: {
  workspaceDir: string;
  limit?: number;
  env?: NodeJS.ProcessEnv;
}): Promise<MemoryHostEventRecord[]>;
//#endregion
export { appendMemoryHostEvent, normalizeMemoryHostEventRecordForStorage, readMemoryHostEventRecords, readMemoryHostEvents, resolveMemoryHostEventLogPath };