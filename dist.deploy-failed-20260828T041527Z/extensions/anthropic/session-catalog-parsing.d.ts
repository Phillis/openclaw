import { n as ClaudeSessionCatalogPage } from "../../session-catalog-types-BoiOCt_L.js";
//#region extensions/anthropic/session-catalog-parsing.d.ts
declare const MAX_PAGE_LIMIT = 100;
declare const DEFAULT_TRANSCRIPT_LIMIT = 20;
declare const MAX_TRANSCRIPT_LIMIT = 50;
declare const MAX_HOSTS = 100;
declare function encodeOffset(offset: number): string;
declare function decodeOffset(cursor: string | undefined, label: string): number;
declare function readOptionalCursor(value: unknown, label: string): string | undefined;
declare function readListParams(value: unknown): {
  cursor?: string;
  limit: number;
  searchTerm?: string;
};
declare function readTranscriptParams(value: unknown, options?: {
  includeHostId?: boolean;
}): {
  threadId: string;
  cursor?: string;
  limit: number;
};
declare function readNodePageCursor(value: Record<string, unknown>, invalidPageMessage: string): string | undefined;
declare function parseCatalogPage(value: unknown): ClaudeSessionCatalogPage;
declare function unwrapNodePayload(value: unknown): unknown;
declare function parseGatewayQuery(value: unknown): {
  search?: string;
  limitPerHost: number;
  hostIds?: string[];
  cursors?: Record<string, string>;
};
//#endregion
export { DEFAULT_TRANSCRIPT_LIMIT, MAX_HOSTS, MAX_PAGE_LIMIT, MAX_TRANSCRIPT_LIMIT, decodeOffset, encodeOffset, parseCatalogPage, parseGatewayQuery, readListParams, readNodePageCursor, readOptionalCursor, readTranscriptParams, unwrapNodePayload };