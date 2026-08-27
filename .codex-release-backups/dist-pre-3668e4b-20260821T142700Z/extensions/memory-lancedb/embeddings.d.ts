import { r as OpenClawPluginApi } from "../../types-BwmvzNiR.js";
import { Nt as AgentToolResult } from "../../types.public-Ca4rxCP0.js";
import { a as MemoryConfig } from "../../config-BUzmEKad.js";

//#region extensions/memory-lancedb/embeddings.d.ts
type Embeddings = {
  embed(agentId: string, text: string, options?: {
    timeoutMs?: number;
  }): Promise<number[]>;
  close?(): Promise<void>;
};
declare function isEmbeddingDimensionsRejectedError(error: unknown): boolean;
declare function truncateEmbeddingVector(embedding: number[], dimensions: number, model: string): number[];
declare function runWithTimeout<T>(params: {
  timeoutMs: number;
  task: () => Promise<T>;
}): Promise<{
  status: "ok";
  value: T;
} | {
  status: "timeout";
}>;
declare function isMemoryRecallTimeoutError(error: unknown): boolean;
declare function buildMemoryRecallUnavailableResult(error: string): AgentToolResult<{
  count: number;
  disabled: true;
  unavailable: true;
  error: string;
}>;
declare class MemoryRecallEmbeddingError extends Error {
  readonly originalError: unknown;
  constructor(originalError: unknown);
}
declare const testing: {
  readonly isEmbeddingDimensionsRejectedError: typeof isEmbeddingDimensionsRejectedError;
  readonly isMemoryRecallTimeoutError: typeof isMemoryRecallTimeoutError;
  readonly runWithTimeout: typeof runWithTimeout;
  readonly truncateEmbeddingVector: typeof truncateEmbeddingVector;
};
declare function createEmbeddings(api: OpenClawPluginApi, cfg: MemoryConfig): Embeddings;
declare function normalizeEmbeddingVector(value: unknown): number[];
//#endregion
export { Embeddings, MemoryRecallEmbeddingError, buildMemoryRecallUnavailableResult, createEmbeddings, isMemoryRecallTimeoutError, normalizeEmbeddingVector, runWithTimeout, testing };