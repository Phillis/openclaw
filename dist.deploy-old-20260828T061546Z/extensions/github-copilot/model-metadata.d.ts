import { o as ModelDefinitionConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../provider-model-shared-Bps1k4-8.js";
//#region extensions/github-copilot/model-metadata.d.ts
type CopilotRuntimeApi = "anthropic-messages" | "openai-completions" | "openai-responses";
type CopilotReasoningCompat = {
  supportsReasoningEffort?: boolean;
  supportedReasoningEfforts?: readonly string[] | null;
};
declare const DEFAULT_COPILOT_MODEL = "github-copilot/claude-sonnet-5";
declare function resolveCopilotTransportApi(modelId: string): CopilotRuntimeApi;
declare function resolveCopilotModelCompat(modelId: string): ModelDefinitionConfig["compat"] | undefined;
declare function resolveCopilotThinkingLevelMap(modelId: string, compat?: CopilotReasoningCompat | null, api?: string | null): ModelDefinitionConfig["thinkingLevelMap"] | undefined;
declare function resolveStaticCopilotModelOverride(modelId: string): Partial<ModelDefinitionConfig> | undefined;
//#endregion
export { DEFAULT_COPILOT_MODEL, resolveCopilotModelCompat, resolveCopilotThinkingLevelMap, resolveCopilotTransportApi, resolveStaticCopilotModelOverride };