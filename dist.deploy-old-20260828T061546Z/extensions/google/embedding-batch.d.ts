import "../../memory-core-host-engine-embeddings-BMMgs7uU.js";
import { n as GeminiEmbeddingClient, r as GeminiTextEmbeddingRequest } from "../../embedding-provider-BjHL3kq0.js";
//#region packages/memory-host-sdk/src/host/batch-runner.d.ts
/** Execution controls for provider embedding batch submissions and polling. */
type EmbeddingBatchExecutionParams = {
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debug?: (message: string, data?: Record<string, unknown>) => void;
};
//#endregion
//#region extensions/google/embedding-batch.d.ts
type GeminiBatchRequest = {
  custom_id: string;
  request: GeminiTextEmbeddingRequest;
};
declare function runGeminiEmbeddingBatches(params: {
  gemini: GeminiEmbeddingClient;
  agentId: string;
  requests: GeminiBatchRequest[];
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
//#endregion
export { runGeminiEmbeddingBatches };