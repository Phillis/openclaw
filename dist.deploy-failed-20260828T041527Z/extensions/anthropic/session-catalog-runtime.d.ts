import { W as SessionCatalogEntrySnapshot, i as OpenClawPluginApi } from "../../plugin-entry-CX5-Xb96.js";
import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import "../../config-contracts-CHCvb6rG.js";
import "../../session-catalog-BF6GFto-.js";
//#region extensions/anthropic/session-catalog-runtime.d.ts
declare function currentClaudeSessionCatalogConfig(api: OpenClawPluginApi): OpenClawConfig;
declare function listBoundClaudeSessions(api: OpenClawPluginApi, agentId?: string, sessionEntries?: SessionCatalogEntrySnapshot): Map<string, string>;
/**
 * Resolve the Claude model an agent actually routes to the Claude CLI backend.
 * Callers must not assume the current default is routed: existing configs pin
 * older Claude models, and stamping the default onto their sessions would
 * select a model the operator never routed or allowed.
 */
declare function resolveClaudeCliRoutedModelId(config: OpenClawConfig, agentId: string): string | undefined;
//#endregion
export { currentClaudeSessionCatalogConfig, listBoundClaudeSessions, resolveClaudeCliRoutedModelId };