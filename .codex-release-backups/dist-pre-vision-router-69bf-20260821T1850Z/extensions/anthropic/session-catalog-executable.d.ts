//#region extensions/anthropic/session-catalog-executable.d.ts
declare function resolveClaudeTerminalExecutable(env?: NodeJS.ProcessEnv): {
  executable: string;
  pathEnv?: string;
} | undefined;
//#endregion
export { resolveClaudeTerminalExecutable };