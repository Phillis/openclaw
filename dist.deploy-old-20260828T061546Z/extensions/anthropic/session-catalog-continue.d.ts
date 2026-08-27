import { i as OpenClawPluginApi } from "../../plugin-entry-CX5-Xb96.js";
//#region extensions/anthropic/session-catalog-continue.d.ts
declare function continueClaudeSession(api: OpenClawPluginApi, agentId: string, hostId: string, threadId: string, allowProcessHomeFallback?: boolean): Promise<{
  sessionKey: string;
}>;
//#endregion
export { continueClaudeSession };