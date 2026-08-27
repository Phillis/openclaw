import { D as ProviderResolveDynamicModelContext, L as ProviderRuntimeModel, M as ProviderSystemPromptContribution } from "./types-CCx6rk6K.js";
import { n as OpenClawConfig } from "./types.openclaw-LvSHMCsQ.js";
//#region src/agents/gpt5-prompt-overlay.d.ts
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
type Gpt5PromptOverlayMode = "friendly" | "off";
/** @deprecated OpenAI/Codex provider-owned prompt overlay helper; do not use from third-party plugins. */
declare function resolveGpt5SystemPromptContribution(params: {
  config?: OpenClawConfig;
  providerId?: string;
  modelId?: string;
  legacyPluginConfig?: Record<string, unknown>;
  enabled?: boolean;
  trigger?: "cron" | "heartbeat" | "manual" | "memory" | "overflow" | "user";
  includeHeartbeatGuidance?: boolean;
}): ProviderSystemPromptContribution | undefined;
//#endregion
//#region src/plugins/provider-model-helpers.d.ts
/** True when an id matches a normalized exact value or value prefix. */
declare function matchesExactOrPrefix(id: string, values: readonly string[]): boolean;
/** Clones the first available template model and patches it for a dynamic model id. */
declare function cloneFirstTemplateModel(params: {
  providerId: string;
  modelId: string;
  templateIds: readonly string[];
  ctx: ProviderResolveDynamicModelContext;
  patch?: Partial<ProviderRuntimeModel>;
}): ProviderRuntimeModel | undefined;
//#endregion
export { resolveGpt5SystemPromptContribution as i, matchesExactOrPrefix as n, Gpt5PromptOverlayMode as r, cloneFirstTemplateModel as t };