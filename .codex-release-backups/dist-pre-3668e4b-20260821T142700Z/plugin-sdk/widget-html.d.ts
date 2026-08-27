//#region src/plugin-sdk/widget-html.d.ts
/** Input error surfaced by tools that accept agent-supplied widget HTML. */
declare class WidgetHtmlInputError extends Error {
  constructor(message: string);
}
/** Returns true when HTML already contains its own document shell. */
declare function isCompleteHtmlDocument(html: string): boolean;
/** Enforces a widget HTML size limit while preserving the caller's input label and unit. */
declare function assertWidgetHtmlSize(html: string, maxSize: number, options?: {
  inputName?: string;
  unit?: "bytes" | "characters";
}): void;
//#endregion
export { WidgetHtmlInputError, assertWidgetHtmlSize, isCompleteHtmlDocument };