import { J as SessionUpstreamProbe, U as SessionCatalogContinueProviderResult, q as SessionUpstreamActivity } from "../../plugin-entry-BZAeuuKK.js";
import "../../session-catalog-AvHXSxST.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-D2tmIkUf.js";
//#region extensions/anthropic/session-upstream-activity.d.ts
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
export { checkClaudeUpstreamActivity, linkContinued };