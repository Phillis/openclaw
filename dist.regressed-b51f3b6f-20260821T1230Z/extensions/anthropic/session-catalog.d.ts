import { A as SessionCatalogProvider, r as OpenClawPluginApi } from "../../types-CbXjz50O.js";
import { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, isResumableClaudeSource } from "./session-catalog-shared.js";
import { ClaudeSessionCatalogPage, ClaudeSessionTranscriptPage } from "./session-catalog-types.js";

//#region extensions/anthropic/session-catalog.d.ts
declare function listLocalClaudeSessionPage(value: unknown, homeDir?: string, scanOptions?: {
  configDir?: string;
  includeDesktop?: boolean;
}): Promise<ClaudeSessionCatalogPage>;
declare function readLocalClaudeTranscriptPage(value: unknown, homeDir?: string, scanOptions?: {
  configDir?: string;
  includeDesktop?: boolean;
}): Promise<Omit<ClaudeSessionTranscriptPage, "hostId" | "label">>;
type ClaudeSessionCatalogRuntime = Required<Pick<SessionCatalogProvider, "list" | "read" | "continueSession" | "startTerminalSession" | "openTerminal" | "checkUpstreamActivity">>;
declare function createClaudeSessionCatalogRuntime(api: OpenClawPluginApi): ClaudeSessionCatalogRuntime;
//#endregion
export { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, createClaudeSessionCatalogRuntime, isResumableClaudeSource, listLocalClaudeSessionPage, readLocalClaudeTranscriptPage };