import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { _i as listAdoptedSessionCatalogSessions, ai as SessionCatalogEntrySummary, bi as sessionCatalogAdoptedSessionKey, ci as SessionCatalogReadProviderParams, di as SessionUpstreamActivity, fi as SessionUpstreamJsonValue, gi as isExternalUserText, hi as createSessionCatalogAdoptionCoordinator, ii as SessionCatalogEntrySnapshot, li as SessionCatalogStartTerminalProviderParams, mi as SessionUpstreamProbe, ni as SessionCatalogContinueProviderParams, oi as SessionCatalogListProviderParams, pi as SessionUpstreamKind, ri as SessionCatalogContinueProviderResult, si as SessionCatalogProvider, ti as SessionCatalogArchiveProviderParams, ui as SessionCatalogTerminalPlan, vi as listSessionCatalogEntries, xi as sessionCatalogAdoptedSourceKey, yi as normalizeUserText } from "../host-capability-types-3XBDy-df.js";
import { rn as OpenClawStateDatabaseOptions } from "../types-4_wTt5Pv.js";
import { A as SessionsCatalogContinueParams, C as SessionCatalogHost, D as SessionCatalogTranscriptItem, E as SessionCatalogSession, F as SessionsCatalogReadResult, I as SessionsCatalogStartTerminalParams, L as SessionsCatalogStartTerminalResult, M as SessionsCatalogListParams, N as SessionsCatalogListResult, O as SessionsCatalogArchiveParams, P as SessionsCatalogReadParams, S as SessionCatalogDescriptor, T as SessionCatalogPullRequestSummary, b as SessionCatalog, j as SessionsCatalogContinueResult, k as SessionsCatalogArchiveResult, w as SessionCatalogLocator, x as SessionCatalogCapabilities } from "../index-Cf_fvo6T.js";

//#region src/plugins/session-catalog-history-import.d.ts
declare function importSessionCatalogHistory(params: {
  catalogId: string;
  threadId: string;
  read: (params: {
    cursor?: string;
    limit: number;
  }) => Promise<SessionsCatalogReadResult>;
  sessionId: string;
  sessionKey: string;
  agentId: string;
  cwd?: string;
  config: OpenClawConfig;
}): Promise<void>;
//#endregion
//#region src/sessions/session-upstream-links.d.ts
declare function upsertSessionUpstreamLink(input: {
  sessionKey: string;
  agentId: string;
  catalogId: string;
  hostId: string;
  threadId: string;
  upstreamKind: SessionUpstreamKind;
  upstreamRef: SessionUpstreamJsonValue;
  marker: SessionUpstreamJsonValue;
}, options?: OpenClawStateDatabaseOptions & {
  now?: number;
}): boolean;
declare function deleteSessionUpstreamLink(sessionKey: string, agentId: string, options?: OpenClawStateDatabaseOptions): void;
//#endregion
//#region src/gateway/cli-session-history.claude-activity.d.ts
type ClaudeCliHistoryLineClassification = {
  humanTurn: boolean;
  occurredAt?: number;
  userText?: string;
};
/** Classifies one native JSONL row through the same filters used by history import. */
declare function classifyClaudeCliHistoryLine(params: {
  line: string;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
/** Applies native history filters to an already-decoded catalog user message. */
declare function classifyClaudeCliHistoryMessage(params: {
  content: unknown;
  timestamp?: unknown;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
//#endregion
export { type ClaudeCliHistoryLineClassification, type SessionCatalog, type SessionCatalogArchiveProviderParams, type SessionCatalogCapabilities, type SessionCatalogContinueProviderParams, type SessionCatalogContinueProviderResult, type SessionCatalogDescriptor, type SessionCatalogEntrySnapshot, type SessionCatalogEntrySummary, type SessionCatalogHost, type SessionCatalogListProviderParams, type SessionCatalogLocator, type SessionCatalogProvider, type SessionCatalogPullRequestSummary, type SessionCatalogReadProviderParams, type SessionCatalogSession, type SessionCatalogStartTerminalProviderParams, type SessionCatalogTerminalPlan, type SessionCatalogTranscriptItem, type SessionUpstreamActivity, type SessionUpstreamJsonValue, type SessionUpstreamKind, type SessionUpstreamProbe, type SessionsCatalogArchiveParams, type SessionsCatalogArchiveResult, type SessionsCatalogContinueParams, type SessionsCatalogContinueResult, type SessionsCatalogListParams, type SessionsCatalogListResult, type SessionsCatalogReadParams, type SessionsCatalogReadResult, type SessionsCatalogStartTerminalParams, type SessionsCatalogStartTerminalResult, classifyClaudeCliHistoryLine, classifyClaudeCliHistoryMessage, createSessionCatalogAdoptionCoordinator, deleteSessionUpstreamLink, importSessionCatalogHistory, isExternalUserText, listAdoptedSessionCatalogSessions, listSessionCatalogEntries, normalizeUserText, sessionCatalogAdoptedSessionKey, sessionCatalogAdoptedSourceKey, upsertSessionUpstreamLink };