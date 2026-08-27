import { M as SessionUpstreamActivity, N as SessionUpstreamProbe, O as SessionCatalogContinueProviderResult } from "../../types-R6eI-mj_.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-D2tmIkUf.js";
//#region extensions/anthropic/session-upstream-activity.d.ts
declare const continueOperations: Map<string, Promise<{
  sessionKey: string;
}>>;
declare function linkContinued(params: {
  sessionKey: string;
  hostId: string;
  threadId: string;
  history?: ClaudeTranscriptItem[];
  listLocalSessions: () => Promise<Array<{
    threadId: string;
    filePath: string;
  }>>;
  readRemote: () => Promise<ClaudeTranscriptItem[]>;
}): Promise<SessionCatalogContinueProviderResult>;
declare function checkClaudeUpstreamActivity(probes: SessionUpstreamProbe[], readRemote?: (probe: SessionUpstreamProbe) => Promise<ClaudeTranscriptItem[]>): Promise<SessionUpstreamActivity[]>;
//#endregion
export { checkClaudeUpstreamActivity, continueOperations, linkContinued };