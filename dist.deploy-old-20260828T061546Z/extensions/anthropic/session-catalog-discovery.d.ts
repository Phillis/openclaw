import { U as SessionCatalogPullRequestSummary } from "../../channel-id.types-BshMre9Z.js";
import "../../session-catalog-BF6GFto-.js";
import { i as ClaudeSessionCatalogSession } from "../../session-catalog-types-BoiOCt_L.js";
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