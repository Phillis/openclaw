//#region packages/normalization-core/src/markdown-plain-text.d.ts
/**
 * Flattens Markdown into a single line of readable plain text.
 *
 * For one-line surfaces that render text verbatim — session-list previews,
 * sidebar narration — where unrendered syntax like `[title](url)` would leak
 * to the user. Lossy by design: it drops fenced code entirely and keeps only
 * link/image text, so it must not be used where the Markdown is rendered.
 */
declare function flattenMarkdownToPlainText(text: string): string;
//#endregion
export { flattenMarkdownToPlainText };