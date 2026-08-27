import { G as SessionCatalogProvider, i as OpenClawPluginApi } from "../../plugin-entry-CX5-Xb96.js";
import "../../session-catalog-BF6GFto-.js";
import { listLocalClaudeSessionPage, readLocalClaudeTranscriptPage } from "./session-catalog-listing.js";
import { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, isResumableClaudeSource } from "./session-catalog-shared.js";
//#region extensions/anthropic/session-catalog.d.ts
type ClaudeSessionCatalogRuntime = Required<Pick<SessionCatalogProvider, "list" | "read" | "continueSession" | "startTerminalSession" | "openTerminal" | "checkUpstreamActivity">>;
declare function createClaudeSessionCatalogRuntime(api: OpenClawPluginApi): ClaudeSessionCatalogRuntime;
//#endregion
export { CLAUDE_CLI_NODE_RUN_COMMAND, CLAUDE_SESSIONS_LIST_COMMAND, CLAUDE_SESSION_READ_COMMAND, CLAUDE_TERMINAL_RESUME_COMMAND, ClaudeCatalogParamsError, createClaudeSessionCatalogRuntime, isResumableClaudeSource, listLocalClaudeSessionPage, readLocalClaudeTranscriptPage };