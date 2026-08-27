import { n as MemoryExtraPath, t as MemoryEntryProvenance } from "./types-DjvKORHD.js";

//#region packages/memory-host-sdk/src/host/multimodal.d.ts
declare const MEMORY_MULTIMODAL_SPECS: {
  readonly image: {
    readonly labelPrefix: "Image file";
    readonly extensions: readonly [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];
  };
  readonly audio: {
    readonly labelPrefix: "Audio file";
    readonly extensions: readonly [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".m2a", ".aac", ".flac"];
  };
};
/** Supported multimodal memory modality. */
type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** Normalized multimodal memory ingestion settings. */
type MemoryMultimodalSettings = {
  enabled: boolean;
  modalities: MemoryMultimodalModality[];
  maxFileBytes: number;
};
/** Return accepted file extensions for a modality. */
declare function getMemoryMultimodalExtensions(modality: MemoryMultimodalModality): readonly string[];
/** Build a glob that matches an extension case-insensitively for indexed sources. */
declare function buildCaseInsensitiveExtensionGlob(extension: string): string;
/** Classify a file path into a supported multimodal modality under current settings. */
declare function classifyMemoryMultimodalPath(filePath: string, settings: MemoryMultimodalSettings): MemoryMultimodalModality | null;
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-inputs.d.ts
/** Text part passed through embedding providers that support structured input. */
type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};
/** Inline binary payload encoded for providers with multimodal embedding support. */
type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};
/** Single structured embedding input part. */
type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;
/** Provider-facing input while preserving the plain text fallback. */
type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};
/** Return true when a chunk needs structured provider handling, not text splitting. */
declare function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean;
//#endregion
//#region packages/memory-host-sdk/src/host/internal.d.ts
type MemoryFileEntry = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  dataHash?: string;
  kind?: "markdown" | "multimodal";
  contentText?: string;
  modality?: MemoryMultimodalModality;
  mimeType?: string;
};
type MemoryChunk = {
  startLine: number;
  endLine: number;
  entryStartLine?: number;
  entryEndLine?: number;
  text: string;
  hash: string;
  embeddingInput?: EmbeddingInput;
  provenance?: MemoryEntryProvenance;
};
declare const MEMORY_CHUNKING_VERSION = 3;
type MultimodalMemoryChunk = {
  chunk: MemoryChunk;
  structuredInputBytes: number;
};
declare function ensureMemoryHostDir(dir: string): string;
type NormalizedExtraMemoryPath = {
  path: string;
  pattern?: string;
};
declare function normalizeExtraMemoryPathEntries(workspaceDir: string, extraPaths?: MemoryExtraPath[]): NormalizedExtraMemoryPath[];
declare function normalizeExtraMemoryPaths(workspaceDir: string, extraPaths?: MemoryExtraPath[]): string[];
declare function matchesExtraMemoryPathEntry(entry: NormalizedExtraMemoryPath, candidatePath: string): boolean;
declare function listMemoryFiles(workspaceDir: string, extraPaths?: MemoryExtraPath[], multimodal?: MemoryMultimodalSettings): Promise<string[]>;
declare function buildFileEntry(absPath: string, workspaceDir: string, multimodal?: MemoryMultimodalSettings): Promise<MemoryFileEntry | null>;
declare function buildMultimodalChunkForIndexing(entry: Pick<MemoryFileEntry, "absPath" | "contentText" | "mimeType" | "kind" | "hash" | "size" | "dataHash">): Promise<MultimodalMemoryChunk | null>;
type CuratedMarkdownEntry = {
  startLine: number;
  endLine: number;
  text: string;
  kind: "entry" | "section";
};
declare function splitCuratedMarkdownEntries(content: string): CuratedMarkdownEntry[];
declare function chunkMarkdown(content: string, chunking: {
  tokens: number;
  overlap: number;
  perEntry?: boolean;
}): MemoryChunk[];
/**
 * Remap chunk startLine/endLine from content-relative positions to original
 * source file positions using a lineMap.  Each entry in lineMap gives the
 * 1-indexed source line for the corresponding 0-indexed content line.
 *
 * This is used for session JSONL files where buildSessionEntry() flattens
 * messages into a plain-text string before chunking.  Without remapping the
 * stored line numbers would reference positions in the flattened text rather
 * than the original JSONL file.
 */
declare function remapChunkLines(chunks: MemoryChunk[], lineMap: number[] | undefined): void;
declare function parseEmbedding(raw: string): number[];
declare function cosineSimilarity(a: number[], b: number[]): number;
declare function runMemoryHostTasksWithConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]>;
//#endregion
export { getMemoryMultimodalExtensions as C, classifyMemoryMultimodalPath as S, splitCuratedMarkdownEntries as _, buildFileEntry as a, MemoryMultimodalSettings as b, cosineSimilarity as c, matchesExtraMemoryPathEntry as d, normalizeExtraMemoryPathEntries as f, runMemoryHostTasksWithConcurrency as g, remapChunkLines as h, MemoryFileEntry as i, ensureMemoryHostDir as l, parseEmbedding as m, MEMORY_CHUNKING_VERSION as n, buildMultimodalChunkForIndexing as o, normalizeExtraMemoryPaths as p, MemoryChunk as r, chunkMarkdown as s, CuratedMarkdownEntry as t, listMemoryFiles as u, EmbeddingInput as v, buildCaseInsensitiveExtensionGlob as x, hasNonTextEmbeddingParts as y };