import { n as OpenClawConfig } from "../../types.openclaw-BrHw7tim.js";
import { t as ClaudeTranscriptItem } from "../../session-catalog-transcript-D2tmIkUf.js";

//#region extensions/anthropic/session-catalog-history.d.ts
declare function importClaudeHistory(params: {
  items: ClaudeTranscriptItem[];
  threadId: string;
  sessionId: string;
  sessionKey: string;
  agentId: string;
  storePath: string;
  cwd?: string;
  config: OpenClawConfig;
}): Promise<void>;
//#endregion
export { importClaudeHistory };