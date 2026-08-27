import { r as OpenClawPluginApi } from "../../types-Ci1t4mxf.js";
import { n as OpenClawConfig } from "../../types.openclaw-CpYrAZv3.js";
import { T as ConversationRecallContext, it as ResolvedActiveRecallPluginConfig, x as ActiveRecallResult } from "../../types-3KLlWwCz.js";

//#region extensions/active-memory/recall.d.ts
type ActiveRecallParams = {
  api: OpenClawPluginApi;
  runtimeConfig: OpenClawConfig;
  config: ResolvedActiveRecallPluginConfig;
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
  query: string;
  searchQuery: string;
  currentModelProviderId?: string;
  currentModelId?: string;
  conversationRecall?: ConversationRecallContext;
  abortSignal?: AbortSignal;
  runId?: string;
};
declare function maybeResolveActiveRecall(params: ActiveRecallParams): Promise<ActiveRecallResult>;
//#endregion
export { maybeResolveActiveRecall };