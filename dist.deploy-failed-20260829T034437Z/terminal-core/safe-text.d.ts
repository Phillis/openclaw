//#region packages/terminal-core/src/safe-text.d.ts
/** Return whether text contains C0 or C1 terminal control characters. */
declare function hasTerminalControl(input: string): boolean;
/**
 * Normalize untrusted text for single-line terminal/log rendering.
 */
declare function sanitizeTerminalText(input: string): string;
//#endregion
export { hasTerminalControl, sanitizeTerminalText };