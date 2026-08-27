//#region extensions/anthropic/claude-desktop-groups.d.ts
/**
 * Claude Desktop stores Code custom groups in Chromium Local Storage, not beside the session JSON.
 * This reads only labels and local-session assignments; it never mutates Desktop account state.
 */
declare function readClaudeDesktopCustomGroups(homeDir: string): Promise<Map<string, string>>;
//#endregion
export { readClaudeDesktopCustomGroups };