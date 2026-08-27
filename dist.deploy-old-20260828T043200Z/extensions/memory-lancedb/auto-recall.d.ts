import { b as OpenClawPluginApi } from "../../runtime-api-IAhSVA75.js";
import "../../api-8TnxGFHD.js";
import { a as MemoryConfig } from "../../config-Cd958lsI.js";
import { Embeddings } from "./embeddings.js";
import { n as MemoryDB } from "../../lancedb-store-DPrHOUx9.js";
//#region extensions/memory-lancedb/auto-recall.d.ts
type AutoRecallToolAuthority = {
  allows(toolName: string): boolean;
  assertActive(): void;
};
type AutoRecallHookContext = {
  agentId?: string;
  toolAuthority?: AutoRecallToolAuthority;
};
type AutoRecallHookEvent = {
  prompt: string;
  messages: unknown[];
};
declare function createAutoRecallHook(params: {
  logger: OpenClawPluginApi["logger"];
  db: MemoryDB;
  embeddings: Embeddings;
  resolveCurrentConfig: () => MemoryConfig;
  resolveEnabledAgentId: (rawAgentId: string | undefined) => string | undefined;
  readCooldown: (agentId: string) => {
    error: string;
  } | undefined;
  recordCooldown: (agentId: string, error: string) => void;
}): (event: AutoRecallHookEvent, ctx: AutoRecallHookContext) => Promise<{
  prependContext: string;
} | undefined>;
//#endregion
export { createAutoRecallHook };