import { truncateUtf8Prefix } from "../../../utils/utf8-truncate.js";
import {
  estimateToolResultTextChars,
  sliceToolResultTextToBudget,
} from "../../embedded-agent-runner/tool-result-text-budget.js";
import { toolResultFitsBudget, type ToolResultBudget } from "../../tool-result-limits.js";
import type { ReadToolContinuation, ReadToolDetails } from "./tool-contracts.js";
import { DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES, truncateHead } from "./truncate.js";

type BoundedReadTextPage = Extract<ReadToolDetails, { kind: "text" | "truncated" }>;

// BUG-072 (F1): continuation/cap guidance is structured metadata
// (`details.truncation` + `details.continuation`), never spliced into page
// content — the former formatReadContinuationNotice in-band splices are what
// got persisted into files by read-all+write-back lanes. The TUI renderer and
// tool description build their guidance from the structured details.

/** Bound a selected text page once; legacy injected readers reuse this owner decision. */
export function createBoundedReadTextPage(params: {
  content: string;
  startLine: number;
  endLine: number;
  totalLines: number;
  cursor?: number;
  limit?: number;
  maxBytes: number;
  pageMaxBytes?: number;
  modelBudget?: ToolResultBudget;
  /** Caller-owned framing already reserved in pageMaxBytes, never file/cursor content. */
  prefix?: string;
  adaptive?: boolean;
}): BoundedReadTextPage {
  const maxBytes = params.pageMaxBytes ?? Math.min(DEFAULT_MAX_BYTES, params.maxBytes);
  const remainingLines = params.totalLines - params.endLine;
  const contentBytes = Buffer.byteLength(params.content, "utf8");
  const resultPrefix = params.prefix ?? "";
  // BUG-072 (F1): continuation state is NEVER in-band content. When the page
  // fits but more lines remain, return the same structured `truncated` shape
  // (details.truncation + details.continuation) the byte/line-cut path uses.
  const lineContinuation = (offset: number): ReadToolContinuation => ({
    kind: "line",
    offset,
    ...(params.limit === undefined ? {} : { limit: Math.max(1, remainingLines) }),
  });
  const pageTruncation = (content: string) => ({
    truncated: true,
    truncatedBy: "lines" as const,
    totalLines: params.totalLines,
    totalBytes: contentBytes,
    outputLines: params.endLine - params.startLine + 1,
    outputBytes: Buffer.byteLength(content, "utf8"),
    lastLinePartial: false,
    firstLineExceedsLimit: false,
    maxLines: params.limit ?? DEFAULT_MAX_LINES,
    maxBytes,
  });
  if (
    params.endLine - params.startLine < DEFAULT_MAX_LINES &&
    contentBytes <= maxBytes &&
    toolResultFitsBudget(`${resultPrefix}${params.content}`, params.modelBudget)
  ) {
    if (remainingLines <= 0) {
      return { kind: "text", content: params.content };
    }
    return {
      kind: "truncated",
      content: params.content,
      truncation: pageTruncation(params.content),
      continuation: lineContinuation(params.endLine + 1),
    };
  }

  const boundedLimit = params.limit === undefined ? {} : { limit: params.limit };
  const firstLine = params.content.split("\n", 1)[0] ?? "";
  let prefix = truncateUtf8Prefix(params.content, maxBytes);
  if (params.modelBudget) {
    prefix = sliceToolResultTextToBudget(
      prefix,
      params.modelBudget.maxChars - estimateToolResultTextChars(resultPrefix),
    );
    prefix = sliceToolResultTextToBudget(
      prefix,
      params.modelBudget.maxContextChars -
        estimateToolResultTextChars(resultPrefix, { minimumRawWeight: 2 }),
      { minimumRawWeight: 2 },
    );
  }
  // Convert the fitted prefix back to a byte allowance for the existing line/cursor owner.
  // The cursor advances only over text that survives both model limits and its real footer.
  const contentBudgetBytes = Buffer.byteLength(prefix, "utf8");
  const truncation = truncateHead(params.content, { maxBytes: contentBudgetBytes });
  if (!truncation.truncated) {
    if (remainingLines <= 0) {
      return { kind: "text", content: truncation.content };
    }
    return {
      kind: "truncated",
      content: truncation.content,
      truncation: pageTruncation(truncation.content),
      continuation: lineContinuation(params.endLine + 1),
    };
  }

  let continuation: ReadToolContinuation;
  let content = truncation.content;
  if (truncation.firstLineExceedsLimit) {
    content = truncateUtf8Prefix(firstLine, contentBudgetBytes);
    continuation = {
      kind: "cursor",
      offset: params.startLine,
      cursor: (params.cursor ?? 0) + content.length,
      ...boundedLimit,
    };
  } else {
    const nextOffset = params.startLine + truncation.outputLines;
    continuation = {
      kind: "line",
      offset: nextOffset,
      ...(params.limit === undefined
        ? {}
        : { limit: Math.max(1, params.endLine - nextOffset + 1) }),
    };
  }

  const { content: _content, ...truncationDetails } = truncation;
  return {
    kind: "truncated",
    // BUG-072 (F1): no in-band continuation notice; guidance is structural
    // (details.truncation + details.continuation) and renderer-only.
    content,
    truncation: {
      ...truncationDetails,
      outputBytes: Buffer.byteLength(content, "utf8"),
      firstLineExceedsLimit: false,
      lastLinePartial: continuation.kind === "cursor",
      totalLines: params.totalLines,
    },
    continuation,
  };
}
