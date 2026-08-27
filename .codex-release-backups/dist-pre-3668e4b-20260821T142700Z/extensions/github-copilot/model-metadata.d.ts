import { o as ModelDefinitionConfig } from "../../types.openclaw-CTCn19OD.js";
//#region extensions/github-copilot/model-metadata.d.ts
type CopilotRuntimeApi = "anthropic-messages" | "openai-completions" | "openai-responses";
type CopilotReasoningCompat = {
  supportedReasoningEfforts?: readonly string[] | null;
};
declare const DEFAULT_COPILOT_MODEL = "github-copilot/claude-sonnet-5";
declare function resolveCopilotTransportApi(modelId: string): CopilotRuntimeApi;
declare function resolveCopilotModelCompat(modelId: string): ModelDefinitionConfig["compat"] | undefined;
declare function resolveCopilotExtendedThinkingLevels(modelId: string, compat?: CopilotReasoningCompat | null): Array<"xhigh" | "max">;
declare function resolveStaticCopilotModelOverride(modelId: string): Partial<ModelDefinitionConfig> | undefined;
//#endregion
export { DEFAULT_COPILOT_MODEL, resolveCopilotExtendedThinkingLevels, resolveCopilotModelCompat, resolveCopilotTransportApi, resolveStaticCopilotModelOverride };