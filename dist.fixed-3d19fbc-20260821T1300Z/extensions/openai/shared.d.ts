import { i as ProviderPlugin } from "../../types-CCx6rk6K.js";
import { n as OpenClawConfig } from "../../types.openclaw-LvSHMCsQ.js";
import { n as matchesExactOrPrefix, t as cloneFirstTemplateModel } from "../../provider-model-shared-Jj0sVhFE.js";
import { t as findCatalogTemplate } from "../../provider-catalog-shared-BM4Q6ztL.js";

//#region extensions/openai/shared.d.ts
type SyntheticOpenAIModelCatalogCost = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type SyntheticOpenAIModelCatalogEntry = {
  provider: string;
  id: string;
  name: string;
  reasoning?: boolean;
  input?: ("text" | "image")[];
  contextWindow?: number;
  contextTokens?: number;
  cost?: SyntheticOpenAIModelCatalogCost;
};
declare const OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272000;
declare function resolveConfiguredOpenAIBaseUrl(cfg: OpenClawConfig | undefined): string;
type OpenAIResponsesProviderHooks = Pick<ProviderPlugin, "buildReplayPolicy" | "prepareExtraParams" | "wrapStreamFn" | "resolveTransportTurnState">;
declare function buildOpenAIResponsesProviderHooks(options?: {
  transport?: "auto" | "sse" | "websocket" | "websocket-cached";
}): OpenAIResponsesProviderHooks;
declare function buildOpenAISyntheticCatalogEntry(template: ReturnType<typeof findCatalogTemplate>, entry: {
  id: string;
  reasoning: boolean;
  input: readonly ("text" | "image")[];
  contextWindow: number;
  contextTokens?: number;
  cost?: SyntheticOpenAIModelCatalogCost;
}): SyntheticOpenAIModelCatalogEntry | undefined;
//#endregion
export { OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS, buildOpenAIResponsesProviderHooks, buildOpenAISyntheticCatalogEntry, cloneFirstTemplateModel, findCatalogTemplate, matchesExactOrPrefix, resolveConfiguredOpenAIBaseUrl };