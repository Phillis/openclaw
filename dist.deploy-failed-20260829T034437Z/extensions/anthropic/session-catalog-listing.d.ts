import { G as SessionCatalogProvider, u as PluginRuntime } from "../../plugin-entry-BZAeuuKK.js";
import "../../session-catalog-AvHXSxST.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-D2tmIkUf.js";
import { a as ClaudeSessionTranscriptPage, i as ClaudeSessionCatalogSession, n as ClaudeSessionCatalogPage, r as ClaudeSessionCatalogResult, t as ClaudeSessionCatalogHost } from "../../session-catalog-types-B0JgvCes.js";
import "../../plugin-runtime-DYJVcb_O.js";
//#region extensions/anthropic/session-catalog-listing.d.ts
declare function listLocalClaudeSessionPage(value: unknown, homeDir?: string, scanOptions?: {
  configDir?: string;
  includeDesktop?: boolean;
}): Promise<ClaudeSessionCatalogPage>;
declare function readLocalClaudeTranscriptPage(value: unknown, homeDir?: string, scanOptions?: {
  configDir?: string;
  includeDesktop?: boolean;
}): Promise<Omit<ClaudeSessionTranscriptPage, "hostId" | "label">>;
declare function listClaudeSessionCatalog(params: {
  runtime: PluginRuntime;
  query?: unknown;
  allowProcessHomeFallback?: boolean;
  listNodes?: Parameters<SessionCatalogProvider["list"]>[0]["listNodes"];
  onHost?: (host: ClaudeSessionCatalogHost) => void;
}): Promise<ClaudeSessionCatalogResult>;
declare function readClaudeSessionTranscript(params: {
  runtime: PluginRuntime;
  hostId: string;
  threadId: string;
  cursor?: string;
  limit: number;
  allowProcessHomeFallback?: boolean;
}): Promise<ClaudeSessionTranscriptPage>;
declare function assertClaudeLocalAccess(hostId: string, allowProcessHomeFallback?: boolean): void;
declare function readBoundedClaudeHistory(params: {
  runtime: PluginRuntime;
  hostId: string;
  threadId: string;
  allowProcessHomeFallback?: boolean;
}): Promise<ClaudeTranscriptItem[]>;
declare function resolveNodeClaudeRecord(params: {
  runtime: PluginRuntime;
  nodeId: string;
  threadId: string;
}): Promise<ClaudeSessionCatalogSession>;
//#endregion
export { assertClaudeLocalAccess, listClaudeSessionCatalog, listLocalClaudeSessionPage, readBoundedClaudeHistory, readClaudeSessionTranscript, readLocalClaudeTranscriptPage, resolveNodeClaudeRecord };