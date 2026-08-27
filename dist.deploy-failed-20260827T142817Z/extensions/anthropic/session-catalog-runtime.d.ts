import { k as SessionCatalogEntrySnapshot, r as OpenClawPluginApi } from "../../types-R6eI-mj_.js";
import { n as OpenClawConfig } from "../../types.openclaw-BrHw7tim.js";
//#region extensions/anthropic/session-catalog-runtime.d.ts
declare function currentClaudeSessionCatalogConfig(api: OpenClawPluginApi): OpenClawConfig;
declare function listBoundClaudeSessions(api: OpenClawPluginApi, sessionEntries?: SessionCatalogEntrySnapshot): Map<string, string>;
/**
 * Resolve the Claude model an agent actually routes to the Claude CLI backend.
 * Callers must not assume the current default is routed: existing configs pin
 * older Claude models, and stamping the default onto their sessions would
 * select a model the operator never routed or allowed.
 */
declare function resolveClaudeCliRoutedModelId(config: OpenClawConfig, agentId: string): string | undefined;
//#endregion
export { currentClaudeSessionCatalogConfig, listBoundClaudeSessions, resolveClaudeCliRoutedModelId };