//#region extensions/anthropic/session-catalog-shared.d.ts
declare const CLAUDE_SESSIONS_LIST_COMMAND = "anthropic.claude.sessions.list.v1";
declare const CLAUDE_SESSION_READ_COMMAND = "anthropic.claude.sessions.read.v1";
declare const CLAUDE_CLI_NODE_RUN_COMMAND = "agent.cli.claude.run.v1";
declare const CLAUDE_TERMINAL_RESUME_COMMAND = "anthropic.claude.terminal.resume.v1";
declare class ClaudeCatalogParamsError extends Error {}
declare function isResumableClaudeSource(source: string | undefined): boolean;
//#endregion
export { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, isResumableClaudeSource };