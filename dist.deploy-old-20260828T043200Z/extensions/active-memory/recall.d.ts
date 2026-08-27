import { b as OpenClawPluginApi } from "../../plugin-entry-Bvo-51M-.js";
import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
import { T as ConversationRecallContext, it as ResolvedActiveRecallPluginConfig, x as ActiveRecallResult } from "../../types-BEbvCn-I.js";
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
  authorityFingerprint: string;
  memorySlot?: string;
  activeProjectKeys?: string[];
};
declare function maybeResolveActiveRecall(params: ActiveRecallParams): Promise<ActiveRecallResult>;
//#endregion
export { maybeResolveActiveRecall };