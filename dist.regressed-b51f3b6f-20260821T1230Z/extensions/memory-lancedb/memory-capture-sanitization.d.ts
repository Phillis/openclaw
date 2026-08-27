//#region extensions/memory-lancedb/memory-capture-sanitization.d.ts
declare function dropMediaNoteLines(text: string): string;
/**
 * Returns true if `text` looks like it contains OpenClaw-injected envelope or
 * transport metadata that should never be persisted as a long-term memory.
 */
declare function looksLikeEnvelopeSludge(text: string): boolean;
/**
 * Strips OpenClaw-injected envelope metadata from a user message so that only
 * the user's actual intent text remains. Returns empty string if nothing
 * meaningful survives.
 */
declare function sanitizeForMemoryCapture(text: string): string;
//#endregion
export { dropMediaNoteLines, looksLikeEnvelopeSludge, sanitizeForMemoryCapture };