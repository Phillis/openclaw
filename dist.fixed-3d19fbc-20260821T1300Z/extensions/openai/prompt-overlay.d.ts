import { M as ProviderSystemPromptContribution } from "../../types-CCx6rk6K.js";
import { i as resolveGpt5SystemPromptContribution, r as Gpt5PromptOverlayMode } from "../../provider-model-shared-Jj0sVhFE.js";

//#region extensions/openai/prompt-overlay.d.ts
type OpenAIPromptOverlayMode = Gpt5PromptOverlayMode;
declare function resolveOpenAIPromptOverlayMode(pluginConfig?: Record<string, unknown>): OpenAIPromptOverlayMode;
declare function resolveOpenAISystemPromptContribution(params: {
  config?: Parameters<typeof resolveGpt5SystemPromptContribution>[0]["config"];
  legacyPluginConfig?: Record<string, unknown>;
  mode?: OpenAIPromptOverlayMode;
  modelProviderId?: string;
  modelId?: string;
  trigger?: Parameters<typeof resolveGpt5SystemPromptContribution>[0]["trigger"];
}): ProviderSystemPromptContribution | undefined;
//#endregion
export { resolveOpenAIPromptOverlayMode, resolveOpenAISystemPromptContribution };