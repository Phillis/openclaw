import { Ar as buildBatchHeaders, Cr as RemoteEmbeddingProviderId, Di as registerRuntimeAuthProfileStoreMutationListener, Dr as enforceEmbeddingMaxInputTokens, Er as resolveRemoteEmbeddingBearerClient, Ir as getMemoryEmbeddingProvider, Lr as listMemoryEmbeddingProviders, Mr as postJsonWithRetry, Or as uploadBatchJsonlFile, Rr as listRegisteredMemoryEmbeddingProviderAdapters, Sr as resolveRemoteEmbeddingClient, Tr as resolveEmbeddingEndpointUrl, _r as buildRemoteBaseUrlPolicy, ar as MemoryEmbeddingBatchChunk, br as RemoteEmbeddingClient, cr as MemoryEmbeddingProviderAdapter, dr as MemoryEmbeddingProviderCreateResult, fr as MemoryEmbeddingProviderIndexIdentity, jr as normalizeBatchBaseUrl, kr as BatchHttpClientConfig, lr as MemoryEmbeddingProviderCallOptions, or as MemoryEmbeddingBatchOptions, pr as MemoryEmbeddingProviderRuntime, sr as MemoryEmbeddingProvider, ur as MemoryEmbeddingProviderCreateOptions, vr as withRemoteHttpResponse, wr as embeddingProviderOwnsDestination, xr as createRemoteEmbeddingProvider, yr as fetchRemoteEmbeddingVectors } from "../types-CiLdD6DO.js";
import { C as getMemoryMultimodalExtensions, S as classifyMemoryMultimodalPath, v as EmbeddingInput, x as buildCaseInsensitiveExtensionGlob, y as hasNonTextEmbeddingParts } from "../internal-CWnoK0BO.js";
//#region packages/memory-host-sdk/src/host/batch-output.d.ts
type ReadEmbeddingBatchJsonlOptions<T> = {
  label: string;
  maxRecords: number;
  maxRecordBytes?: number;
  onRecord: (record: T) => boolean;
};
/** Stream bounded JSONL records without buffering the provider output file. */
declare function readEmbeddingBatchJsonl<T>(response: Response, options: ReadEmbeddingBatchJsonlOptions<T>): Promise<void>;
/** Minimal OpenAI-compatible embedding batch output line. */
type EmbeddingBatchOutputLine = {
  custom_id?: string;
  error?: {
    message?: string;
  } | null;
  response?: {
    status_code?: number;
    message?: string;
    body?: {
      data?: Array<{
        embedding?: number[];
      }>;
      error?: {
        message?: string;
      };
    } | string;
  };
};
/** Apply one output line, collecting errors and successful embeddings by custom id. */
declare function applyEmbeddingBatchOutputLine(params: {
  line: EmbeddingBatchOutputLine;
  remaining: Set<string>;
  errors: string[];
  byCustomId: Map<string, number[]>;
}): void;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-error-utils.d.ts
/** Signals that a provider cannot run the configured embedding batch operation. */
declare class EmbeddingBatchUnavailableError extends Error {
  readonly code = "embedding_batch_unavailable";
  constructor(message: string, options?: ErrorOptions);
}
declare function isEmbeddingBatchUnavailableError(error: unknown): boolean;
/** Return the first useful error message from batch output lines. */
declare function extractBatchErrorMessage(lines: EmbeddingBatchOutputLine[]): string | undefined;
/** Redact and bound provider-controlled batch diagnostics before logging them. */
declare function formatBatchErrorDetail(detail: string | undefined): string | undefined;
/** Format a failed error-file read without hiding the underlying read problem. */
declare function formatUnavailableBatchError(err: unknown): string | undefined;
//#endregion
//#region packages/memory-host-sdk/src/host/batch-provider-common.d.ts
/** Minimal provider batch status payload used by polling code. */
type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};
/** Provider output line after an embedding batch file is read. */
type ProviderBatchOutputLine = EmbeddingBatchOutputLine;
/** OpenAI-compatible endpoint used inside embedding batch request lines. */
declare const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
//#endregion
//#region packages/memory-host-sdk/src/host/batch-runner.d.ts
/** Execution controls for provider embedding batch submissions and polling. */
type EmbeddingBatchExecutionParams = {
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debug?: (message: string, data?: Record<string, unknown>) => void;
};
type EmbeddingBatchGroupRunArgs<TRequest> = {
  group: TRequest[];
  groupIndex: number;
  groups: number;
  byCustomId: Map<string, number[]>;
  pollIntervalMs: number;
  timeoutMs: number;
};
type EmbeddingBatchSplitArgs<TRequest> = {
  error: unknown;
  group: TRequest[];
  parts: TRequest[][];
  groupIndex: number;
  groups: number;
  depth: number;
};
/** Run request groups with bounded concurrency and return embeddings by custom id. */
declare function runEmbeddingBatchGroups<TRequest>(params: {
  requests: TRequest[];
  maxRequests: number;
  maxJsonlBytes?: number;
  wait: EmbeddingBatchExecutionParams["wait"];
  pollIntervalMs: EmbeddingBatchExecutionParams["pollIntervalMs"];
  timeoutMs: EmbeddingBatchExecutionParams["timeoutMs"];
  concurrency: EmbeddingBatchExecutionParams["concurrency"];
  debugLabel: string;
  debug?: EmbeddingBatchExecutionParams["debug"];
  shouldSplitGroupOnError?: (error: unknown, group: TRequest[]) => boolean;
  onSplitGroup?: (args: EmbeddingBatchSplitArgs<TRequest>) => void;
  runGroup: (args: EmbeddingBatchGroupRunArgs<TRequest>) => Promise<void>;
}): Promise<Map<string, number[]>>;
/** Build normalized batch-group options for provider-specific runners. */
declare function buildEmbeddingBatchGroupOptions<TRequest>(params: {
  requests: TRequest[];
} & EmbeddingBatchExecutionParams, options: {
  maxRequests: number;
  maxJsonlBytes?: number;
  debugLabel: string;
}): {
  requests: TRequest[];
  maxRequests: number;
  maxJsonlBytes: number | undefined;
  wait: boolean;
  pollIntervalMs: number;
  timeoutMs: number;
  concurrency: number;
  debug: ((message: string, data?: Record<string, unknown>) => void) | undefined;
  debugLabel: string;
};
//#endregion
//#region packages/memory-host-sdk/src/host/batch-status.d.ts
/** File ids returned once a batch has completed. */
type BatchCompletionResult = {
  outputFileId: string;
  errorFileId?: string;
};
/** Convert a completed provider status payload into output/error file ids. */
declare function resolveBatchCompletionFromStatus(params: {
  provider: string;
  batchId: string;
  status: EmbeddingBatchStatus;
}): BatchCompletionResult;
/** Fail a completed partial/all-error batch before requiring its success file. */
declare function throwIfBatchCompletionError(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void>;
/** Throw when a provider reports a terminal failure, including error-file detail if available. */
declare function throwIfBatchTerminalFailure(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  readError: (errorFileId: string) => Promise<string | undefined>;
}): Promise<void>;
/** Resolve the completed batch files, optionally waiting according to caller policy. */
declare function resolveCompletedBatchResult(params: {
  provider: string;
  status: EmbeddingBatchStatus;
  wait: boolean;
  waitForBatch: () => Promise<BatchCompletionResult>;
}): Promise<BatchCompletionResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-provider-adapter-utils.d.ts
/** Detect missing API key errors from provider auth resolution. */
declare function isMissingEmbeddingApiKeyError(err: unknown): boolean;
/** Return stable cache headers after removing adapter-declared secret headers. */
declare function sanitizeEmbeddingCacheHeaders(headers: Record<string, string>, excludedHeaderNames: string[]): Array<[string, string]>;
/** Convert custom-id keyed batch embeddings back to request-index order. */
declare function mapBatchEmbeddingsByIndex(byCustomId: Map<string, number[]>, count: number): number[][];
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-vectors.d.ts
/** Replace invalid coordinates and L2-normalize non-empty vectors. */
declare function sanitizeAndNormalizeEmbedding(vec: number[]): number[];
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.d.ts
/** Write embedding debug metadata when OPENCLAW_DEBUG_MEMORY_EMBEDDINGS is enabled. */
declare function debugEmbeddingsLog(message: string, meta?: Record<string, unknown>): void;
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-model-normalize.d.ts
/** Trim a configured model id, fall back when empty, and strip known prefixes. */
declare function normalizeEmbeddingModelWithPrefixes(params: {
  model: string;
  defaultModel: string;
  prefixes: string[];
}): string;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-input-limits.d.ts
declare function estimateUtf8Bytes(text: string): number;
declare function estimateStructuredEmbeddingInputBytes(input: EmbeddingInput): number;
//#endregion
//#region src/plugin-sdk/memory-core-host-engine-embeddings.d.ts
/**
 * @deprecated Load-only bridge for published llama.cpp provider releases from before the
 * managed llama-server cutover. Remove after managed releases have replaced the old npm
 * latest and extended-stable packages and their upgrade window has closed.
 */
declare function createLocalEmbeddingProvider(..._args: unknown[]): Promise<never>;
//#endregion
export { type BatchCompletionResult, type BatchHttpClientConfig, EMBEDDING_BATCH_ENDPOINT, type EmbeddingBatchExecutionParams, type EmbeddingBatchStatus, EmbeddingBatchUnavailableError, type EmbeddingInput, type MemoryEmbeddingBatchChunk, type MemoryEmbeddingBatchOptions, type MemoryEmbeddingProvider, type MemoryEmbeddingProviderAdapter, type MemoryEmbeddingProviderCallOptions, type MemoryEmbeddingProviderCreateOptions, type MemoryEmbeddingProviderCreateResult, type MemoryEmbeddingProviderIndexIdentity, type MemoryEmbeddingProviderRuntime, type ProviderBatchOutputLine, type RemoteEmbeddingClient, type RemoteEmbeddingProviderId, applyEmbeddingBatchOutputLine, buildBatchHeaders, buildCaseInsensitiveExtensionGlob, buildEmbeddingBatchGroupOptions, buildRemoteBaseUrlPolicy, classifyMemoryMultimodalPath, createLocalEmbeddingProvider, createRemoteEmbeddingProvider, debugEmbeddingsLog, embeddingProviderOwnsDestination, enforceEmbeddingMaxInputTokens, estimateStructuredEmbeddingInputBytes, estimateUtf8Bytes, extractBatchErrorMessage, fetchRemoteEmbeddingVectors, formatBatchErrorDetail, formatUnavailableBatchError, getMemoryEmbeddingProvider, getMemoryMultimodalExtensions, hasNonTextEmbeddingParts, isEmbeddingBatchUnavailableError, isMissingEmbeddingApiKeyError, listMemoryEmbeddingProviders, listRegisteredMemoryEmbeddingProviderAdapters, mapBatchEmbeddingsByIndex, normalizeBatchBaseUrl, normalizeEmbeddingModelWithPrefixes, postJsonWithRetry, readEmbeddingBatchJsonl, registerRuntimeAuthProfileStoreMutationListener, resolveBatchCompletionFromStatus, resolveCompletedBatchResult, resolveEmbeddingEndpointUrl, resolveRemoteEmbeddingBearerClient, resolveRemoteEmbeddingClient, runEmbeddingBatchGroups, sanitizeAndNormalizeEmbedding, sanitizeEmbeddingCacheHeaders, throwIfBatchCompletionError, throwIfBatchTerminalFailure, uploadBatchJsonlFile, withRemoteHttpResponse };