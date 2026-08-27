//#region packages/tool-call-repair/src/contracts.d.ts
/** Parser limits and allowlist options for plain-text tool-call repair. */
type PlainTextToolCallParseOptions = {
  /** Optional allowlist of tool names that may be repaired. */allowedToolNames?: Iterable<string>; /** Maximum serialized payload size accepted for one repaired call. */
  maxPayloadBytes?: number;
};
/** Source range that must remain literal user-visible text. */
type PlainTextToolCallProtectedRange = {
  end: number;
  start: number;
};
//#endregion
//#region packages/tool-call-repair/src/payload.d.ts
/** Parsed standalone plain-text tool call block with source offsets for repair. */
type PlainTextToolCallBlock = {
  /** Parsed JSON arguments object. */arguments: Record<string, unknown>; /** Exclusive end offset of the parsed block. */
  end: number; /** Tool name parsed from bracket, Harmony, or XML-ish syntax. */
  name: string; /** Original text slice that produced this block. */
  raw: string; /** Inclusive start offset of the parsed block. */
  start: number;
};
//#endregion
//#region src/plugin-sdk/tool-payload.d.ts
type PlainTextToolCallStripOptions = {
  /** Resolves literal source ranges that must not be interpreted as tool calls. */resolveProtectedRanges?: (text: string) => readonly PlainTextToolCallProtectedRange[];
};
/** Parses a message made only of standalone plain-text tool call blocks. */
declare function parseStandalonePlainTextToolCallBlocks(text: string, options?: PlainTextToolCallParseOptions): PlainTextToolCallBlock[] | null;
/** Removes full-line standalone plain-text tool call blocks from visible text. */
declare function stripPlainTextToolCallBlocks(text: string, options?: PlainTextToolCallStripOptions): string;
/** Minimal tool-result-like object shape accepted by payload extraction helpers. */
type ToolPayloadCarrier = {
  /** Structured payload preferred over content text when present. */details?: unknown; /** Provider/tool content blocks or fallback payload. */
  content?: unknown;
};
/**
 * Extract the most useful payload from tool result-like objects shared across
 * outbound core flows and bundled plugin helpers.
 */
declare function extractToolPayload(result: ToolPayloadCarrier | null | undefined): unknown;
//#endregion
export { type PlainTextToolCallBlock, type PlainTextToolCallParseOptions, type PlainTextToolCallProtectedRange, PlainTextToolCallStripOptions, ToolPayloadCarrier, extractToolPayload, parseStandalonePlainTextToolCallBlocks, stripPlainTextToolCallBlocks };