import { t as BaseProbeResult } from "../types.core-D9YiZM0R.js";
import "../types.public-CrLR9xRK.js";
import { t as resolveUserPath } from "../home-dir-BmsxqzQY.js";
import { a as displayPath, c as normalizeE164, d as resolveHomeDir, f as shortenHomeInString, i as clampNumber, l as pathExists, m as tryParseJson, n as clamp, o as displayString, p as shortenHomePath, r as clampInt, s as ensureDir, t as CONFIG_DIR, u as resolveConfigDir } from "../utils-BkRxOgsB.js";
import { t as fetchWithTimeout } from "../fetch-timeout-Cg_zaHf-.js";
//#region node_modules/@openclaw/fs-safe/dist/timing.d.ts
declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, labelOrOptions?: string | {
  label?: string;
  message?: string;
  createError?: () => Error;
}): Promise<T>;
//#endregion
//#region packages/normalization-core/src/cjk-chars.d.ts
declare function estimateStringChars(text: string): number;
//#endregion
//#region src/shared/regexp.d.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
declare function escapeRegExp(value: string): string;
//#endregion
//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region packages/normalization-core/src/utf16-slice.d.ts
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
declare function sliceUtf16Safe(input: string, start: number, end?: number): string;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
//#endregion
//#region src/agents/embedded-agent-runner/tool-result-text-budget.d.ts
type ToolResultTextBudgetOptions = {
  minimumRawWeight?: number;
};
/**
 * Returns provider-independent character-budget units for tool-result text.
 * CJK weights match the shared token heuristic; callers may retain a larger
 * existing raw-text safety floor without multiplying the CJK adjustment twice.
 */
declare function estimateToolResultTextChars(text: string, options?: ToolResultTextBudgetOptions): number;
declare function sliceToolResultTextToBudget(text: string, maxChars: number, options?: ToolResultTextBudgetOptions): string;
//#endregion
//#region src/agents/tool-result-limits.d.ts
/** Automatic live tool-result caps derived from the effective model context. */
declare const DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS = 16000;
declare function resolveLiveToolResultMaxChars(params: {
  contextWindowTokens: number;
}): number;
//#endregion
//#region src/shared/html-escape.d.ts
/** Escapes text for safe insertion into HTML text and quoted attribute values. */
declare function escapeHtml(value: string): string;
//#endregion
//#region src/utils/utf8-truncate.d.ts
/** Keeps the longest UTF-8 prefix that fits within the byte limit. */
declare function truncateUtf8Prefix(value: string, maxBytes: number): string;
//#endregion
//#region src/plugin-sdk/text-utility-runtime.d.ts
type ChannelProbeResult = BaseProbeResult & {
  elapsedMs?: number;
};
/** Run a channel probe with shared timeout, elapsed-time, and error-result handling. */
declare function runChannelProbe<TResult extends ChannelProbeResult, TErrorResult extends ChannelProbeResult = never>(timeoutMs: number | undefined, run: (context: {
  startedAt: number;
  elapsedMs: () => number;
}) => Promise<TResult>, onError?: (error: unknown) => TErrorResult): Promise<(TResult | TErrorResult) & {
  elapsedMs: number;
}>;
//#endregion
export { CONFIG_DIR, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, clamp, clampInt, clampNumber, displayPath, displayString, ensureDir, escapeHtml, escapeRegExp, estimateStringChars, estimateToolResultTextChars, fetchWithTimeout, normalizeE164, pathExists, resolveConfigDir, resolveHomeDir, resolveLiveToolResultMaxChars, resolveUserPath, runChannelProbe, tryParseJson as safeParseJson, shortenHomeInString, shortenHomePath, sleep, sliceToolResultTextToBudget, sliceUtf16Safe, truncateUtf16Safe, truncateUtf8Prefix, withTimeout };