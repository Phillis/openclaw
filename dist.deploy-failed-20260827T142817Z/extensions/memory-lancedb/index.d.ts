import { n as OpenClawPluginConfigSchema, t as OpenClawPluginDefinition } from "../../types-7E39v2Gx.js";
import { normalizeEmbeddingVector, testing } from "./embeddings.js";
import { parseMemoryCliFilter } from "./memory-cli.js";
import { looksLikeEnvelopeSludge, sanitizeForMemoryCapture } from "./memory-capture-sanitization.js";
import { detectCategory, escapeMemoryForPrompt, formatRelevantMemoriesContext, looksLikePromptInjection, normalizeRecallQuery, shouldCapture } from "./memory-policy.js";

//#region extensions/memory-lancedb/index.d.ts
declare const _default: Omit<{
  id: string;
  name: string;
  description: string;
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
//#endregion
export { _default as default, detectCategory, escapeMemoryForPrompt, formatRelevantMemoriesContext, looksLikeEnvelopeSludge, looksLikePromptInjection, normalizeEmbeddingVector, normalizeRecallQuery, parseMemoryCliFilter, sanitizeForMemoryCapture, shouldCapture, testing };