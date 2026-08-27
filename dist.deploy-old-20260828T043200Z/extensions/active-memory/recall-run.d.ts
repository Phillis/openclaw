import { b as OpenClawPluginApi } from "../../plugin-entry-Bvo-51M-.js";
import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
import { T as ConversationRecallContext, d as ActiveMemoryFastMode, it as ResolvedActiveRecallPluginConfig, rt as RecallSubagentResult, v as ActiveMemoryTranscriptSource } from "../../types-BEbvCn-I.js";
//#region extensions/active-memory/recall-run.d.ts
declare function runRecallSubagent(params: {
  api: OpenClawPluginApi;
  runtimeConfig: OpenClawConfig;
  config: ResolvedActiveRecallPluginConfig;
  agentId: string;
  parentSessionKey?: string;
  sessionId?: string;
  messageProvider?: string;
  channelId?: string;
  query: string;
  searchQuery: string;
  currentModelProviderId?: string;
  currentModelId?: string;
  modelRef?: {
    provider: string;
    model: string;
  };
  conversationRecall?: ConversationRecallContext;
  storePath: string;
  fastMode?: ActiveMemoryFastMode;
  abortSignal?: AbortSignal;
  onTranscriptSources?: (sources: readonly ActiveMemoryTranscriptSource[]) => void;
}): Promise<RecallSubagentResult>;
//#endregion
export { runRecallSubagent };