//#region src/agents/tool-result-limits.ts
/** Automatic live tool-result caps derived from the effective model context. */
const MAX_TOOL_RESULT_CONTEXT_SHARE = .3;
const DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS = 16e3;
const LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 32e3;
const XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS = 64e3;
const LARGE_CONTEXT_TOOL_RESULT_TOKENS = 1e5;
const XL_CONTEXT_TOOL_RESULT_TOKENS = 2e5;
function resolveAutoLiveToolResultMaxChars(contextWindowTokens) {
	if (!Number.isFinite(contextWindowTokens)) return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	const tokens = Math.floor(contextWindowTokens);
	if (tokens >= XL_CONTEXT_TOOL_RESULT_TOKENS) return XL_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	if (tokens >= LARGE_CONTEXT_TOOL_RESULT_TOKENS) return LARGE_CONTEXT_MAX_LIVE_TOOL_RESULT_CHARS;
	return DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
}
function calculateMaxToolResultCharsWithCap(contextWindowTokens, hardCapChars) {
	const maxChars = Math.floor(contextWindowTokens * MAX_TOOL_RESULT_CONTEXT_SHARE) * 4;
	return Math.min(maxChars, Math.max(1, hardCapChars));
}
function resolveLiveToolResultMaxChars(params) {
	return calculateMaxToolResultCharsWithCap(params.contextWindowTokens, resolveAutoLiveToolResultMaxChars(params.contextWindowTokens));
}
//#endregion
export { resolveLiveToolResultMaxChars as i, calculateMaxToolResultCharsWithCap as n, resolveAutoLiveToolResultMaxChars as r, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS as t };
