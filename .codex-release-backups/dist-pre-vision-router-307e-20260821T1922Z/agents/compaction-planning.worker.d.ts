import { t as AgentMessage } from "../types-smxqDTIJ.js";
//#region src/agents/compaction-planning.d.ts
/** Decision for whether a summarization stage should run as one chunk or multiple chunks. */
type StageSplitPlan = {
  mode: "single";
} | {
  mode: "split";
  chunks: AgentMessage[][];
};
/** Messages safe to summarize plus notes for messages too large to fit in a summary request. */
type OversizedFallbackPlan = {
  smallMessages: AgentMessage[];
  oversizedNotes: string[];
};
/** Builds sanitized chunks for summarization prompts. */
declare function buildSummaryChunks(params: {
  messages: AgentMessage[];
  maxChunkTokens: number;
}): AgentMessage[][];
/** Separates messages too large to summarize and emits compact placeholder notes for them. */
declare function buildOversizedFallbackPlan(params: {
  messages: AgentMessage[];
  contextWindow: number;
}): OversizedFallbackPlan;
/** Plans whether to split a summarization stage based on message count and token budget. */
declare function buildStageSplitPlan(params: {
  messages: AgentMessage[];
  maxChunkTokens: number;
  parts?: number;
  minMessagesForSplit?: number;
}): StageSplitPlan;
//#endregion
//#region src/agents/compaction-planning.worker.d.ts
/** Serializable request accepted by the compaction planning worker. */
type CompactionPlanningWorkerInput = ({
  kind: "summaryChunks";
} & Parameters<typeof buildSummaryChunks>[0]) | ({
  kind: "oversizedFallback";
} & Parameters<typeof buildOversizedFallbackPlan>[0]) | ({
  kind: "stageSplit";
} & Parameters<typeof buildStageSplitPlan>[0]) | {
  kind: "adaptiveChunkRatio";
  messages: AgentMessage[];
  contextWindow: number;
};
/** Serializable successful value returned by the compaction planning worker. */
type CompactionPlanningWorkerValue = {
  kind: "summaryChunks";
  chunkIndexes: number[][];
} | {
  kind: "oversizedFallback";
  smallMessageIndexes: number[];
  oversizedNotes: string[];
} | ({
  kind: "stageSplit";
} & ({
  mode: "single";
} | {
  mode: "split";
  chunkIndexes: number[][];
})) | {
  kind: "adaptiveChunkRatio";
  ratio: number;
};
/** Serializable success/failure envelope posted by the worker. */
type CompactionPlanningWorkerResult = {
  status: "ok";
  value: CompactionPlanningWorkerValue;
} | {
  status: "failed";
  error: string;
};
/** Run one compaction planning request and return a serializable result. */
declare function runCompactionPlanningWorkerInput(input: unknown): CompactionPlanningWorkerResult;
//#endregion
export { CompactionPlanningWorkerInput, CompactionPlanningWorkerResult, CompactionPlanningWorkerValue, runCompactionPlanningWorkerInput };