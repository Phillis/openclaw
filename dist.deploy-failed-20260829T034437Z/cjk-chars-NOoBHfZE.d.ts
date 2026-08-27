//#region packages/normalization-core/src/cjk-chars.d.ts
/**
 * Shared CJK-aware character counting for approximate token estimates.
 *
 * This is a provider-independent budget heuristic, not an exact tokenizer.
 * Weighting common CJK, rare BMP characters, width-compatibility forms, and
 * supplementary ideographs separately keeps current tokenizers within a
 * conservative budget range while preserving the existing Latin behavior.
 */
declare const CHARS_PER_TOKEN_ESTIMATE = 4;
declare function estimateStringChars(text: string): number;
declare function estimateTokensFromChars(chars: number): number;
//#endregion
export { estimateStringChars as n, estimateTokensFromChars as r, CHARS_PER_TOKEN_ESTIMATE as t };