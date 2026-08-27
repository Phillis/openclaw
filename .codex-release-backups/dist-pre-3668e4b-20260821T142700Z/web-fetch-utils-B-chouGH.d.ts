//#region src/agents/tools/web-fetch-utils.d.ts
/** Output mode requested by web_fetch extraction. */
type ExtractMode = "markdown" | "text";
/** Collapses display whitespace while preserving paragraph breaks. */
declare function normalizeWhitespace(value: string): string;
/** Converts sanitized HTML into coarse markdown plus an optional title. */
declare function htmlToMarkdown(html: string): {
  text: string;
  title?: string;
};
/** Removes markdown decoration for plain text extraction. */
declare function markdownToText(markdown: string): string;
/** Truncates text by characters and reports whether truncation occurred. */
declare function truncateWebFetchText(value: string, maxChars: number): {
  text: string;
  truncated: boolean;
};
/** Sanitizes HTML and extracts either markdown or plain text content. */
declare function extractBasicHtmlContent(params: {
  html: string;
  extractMode: ExtractMode;
}): Promise<{
  text: string;
  title?: string;
} | null>;
//#endregion
export { truncateWebFetchText as a, normalizeWhitespace as i, htmlToMarkdown as n, markdownToText as r, extractBasicHtmlContent as t };