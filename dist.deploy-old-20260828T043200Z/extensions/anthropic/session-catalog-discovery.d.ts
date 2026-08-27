import { U as SessionCatalogPullRequestSummary } from "../../channel-id.types-CSuowlIu.js";
import "../../session-catalog-AvHXSxST.js";
import { i as ClaudeSessionCatalogSession } from "../../session-catalog-types-B0JgvCes.js";
//#region extensions/anthropic/session-catalog-discovery.d.ts
declare const MAX_STRING_LENGTH = 4096;
type CatalogRecord = ClaudeSessionCatalogSession & {
  filePath: string;
};
declare function parsePullRequestSummary(value: unknown): SessionCatalogPullRequestSummary | undefined;
declare function listClaudeSessions(homeDir?: string, options?: {
  forceRefresh?: boolean;
  configDir?: string;
  includeDesktop?: boolean;
}): Promise<CatalogRecord[]>;
//#endregion
export { CatalogRecord, MAX_STRING_LENGTH, listClaudeSessions, parsePullRequestSummary };